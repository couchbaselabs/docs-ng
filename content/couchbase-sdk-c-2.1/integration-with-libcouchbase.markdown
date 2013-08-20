# Integration with libcouchbase

This tutorial assumes you have installed libcouchbase on your systems per the
installation instructions in the Getting Started section of this guide. Because
the approach for building a program based on libcouchbase may vary between
Linux/Mac OS and Windows, this tutorial will focus on the components of the
program rather than how to build it.

The libcouchbase is written in C and can be integrated in variety ways with your
application. First is the most trivial case, when your application written in a
scripting language supported by Couchbase client libraries, which already have
libcouchbase wrappers. Couchbase has built and maintains following
libcouchbase-based libraries:

 * [Ruby](http://www.couchbase.com/communities/ruby/getting-started)

 * [Python](http://www.couchbase.com/communities/python/getting-started)

 * [PHP](http://www.couchbase.com/communities/php/getting-started)

 * [node.js](https://github.com/couchbase/couchnode)

Users of these libraries automatically get an API, which looks natural for their
platform, so that it doesn't require knowledge of libcouchbase APIs. But this
tutorial is mostly about two other use cases:

 * Add libcouchbase into existing application to implement persistence layer. This
   section will contain two sections: first we will create a simple echo server
   written using [libev](http://software.schmorp.de/pkg/libev.html) library. And
   then it will be shown how to persist each message going through the server to
   Couchbase.

   Get complete code here:
   [https://github.com/couchbaselabs/libev-couchbase-example](https://github.com/couchbaselabs/libev-couchbase-example)

 * Build applications around libcouchbase. Here we show how to build a proxy server
   for regular memcached clients. Just like [moxi
   server](http://www.couchbase.com/docs/moxi-manual-1.8/), but limited for
   demonstrative purposes.

   get complete code here:
   [https://github.com/couchbaselabs/libcouchbase-proxy-sample](https://github.com/couchbaselabs/libcouchbase-proxy-sample)

<a id="add_to_existent_application"></a>

## Add to an Application

Lets start from defining specification of an existing application. Our
application is the asynchronous single-threaded echo server, which leverages
[libev](http://software.schmorp.de/pkg/libev.html) to solve [C10K
problem](http://www.kegel.com/c10k.html) and efficiently serve huge number of
concurrent connections. It should listen given port (in this sample 4567), and
send back everything the client submitting to it.

The libev library implements [reactor
pattern](http://en.wikipedia.org/wiki/Reactor_pattern) uses term `event loop` to
represent entity which encapsulate register of handlers for various IO events
and the timers. To start we have the application code from the main function:


```
int main()
{
    struct ev_loop *loop = ev_default_loop(0);
    int sd;
    struct sockaddr_in addr;
    struct ev_io server;

    if ((sd = socket(PF_INET, SOCK_STREAM, 0)) < 0) {
        fail("socket error");
    }

    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT_NO);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sd, (struct sockaddr *) &addr, sizeof(addr)) != 0) {
        fail("bind error");
    }
    if (listen(sd, 2) < 0) {
        fail("listen error");
    }

    ev_io_init(&server, accept_cb, sd, EV_READ);
    ev_io_start(loop, &server);

    printf("Listen on %d\n", PORT_NO);
    ev_run(loop, 0);

    return 0;
}
```

Here we are create an event loop instance, and create and bind new socket to
local port `PORT_NO (4567)`. After that we can mark this socket as listening and
ask libev to call the function `accept_cb` when the socket become ready to read,
that is when the new client will come to us. The final step is to run `ev_run()`
which does all the server interaction.

The `accept_cb` is in charge of allocating client structures with the buffer for
messages. The sample is using ring buffers from the libcouchbase code for easier
managing memory for IO buffers.


```
void accept_cb(struct ev_loop *loop, struct ev_io *watcher, int revents)
{
    struct client_s *client;
    int flags;

    if (EV_ERROR & revents) {
        fail("got invalid event");
    }
    client = malloc(sizeof(struct client_s));
    if (!client) {
        fail("client watcher alloc");
    }
    if (!ringbuffer_initialize(&client->buf, BUFFER_SIZE)) {
        fail("client buffer alloc");
    }
    client->naddr = sizeof(client->addr);
    client->fd = accept(watcher->fd, (struct sockaddr *)&client->addr,
                        &client->naddr);
    if (client->fd < 0) {
        fail("accept error");
    }
    if ((flags = fcntl(client->fd, F_GETFL, NULL)) == -1) {
        fail("fcntl(F_GETFL)");
    }
    if (fcntl(client->fd, F_SETFL, flags | O_NONBLOCK) == -1) {
        fail("fcntl(F_SETFL, O_NONBLOCK)");
    }

    printf("Successfully connected with client\n");

    ev_io_init((ev_io *)client, client_cb, client->fd, EV_READ);
    ev_io_start(loop, (ev_io *)client);
}
```

The most interesting part of the function above in last two lines, which
registers a new handler `client_cb` on reading an event for the client socket.
This handler will be called each time when the kernel will receive new data from
the socket, so that it could be read with non-blocking call.

The last snippet of our application depicts the `client_cb` function, which
handles all the application logic. It reads everything from the socket if it is
ready and registers itself for write events, and then sends all the contents out
to the network. It is also the handling end of a stream situation, which means
that the client closed the connection.


```
void client_cb(struct ev_loop *loop, struct ev_io *watcher, int revents)
{
    struct lcb_iovec_st iov[2];
    ssize_t nbytes;
    struct client_s *client = (struct client_s *)watcher;

    if (EV_READ & revents) {
        ringbuffer_ensure_capacity(&client->buf, BUFFER_SIZE);
        ringbuffer_get_iov(&client->buf, RINGBUFFER_WRITE, iov);
        nbytes = io_recvv(watcher->fd, iov);
        if (nbytes < 0) {
            fail("read error");
        } else if (nbytes == 0) {
            ev_io_stop(loop, watcher);
            ringbuffer_destruct(&client->buf);
            free(client);
            printf("Peer disconnected\n");
            return;
        } else {
            ringbuffer_produced(&client->buf, nbytes);
            printf("Received %zu bytes\n", nbytes);
            ev_io_stop(loop, watcher);
            ev_io_set(watcher, watcher->fd, EV_WRITE);
            ev_io_start(loop, watcher);
        }
    } else if (EV_WRITE & revents) {
        ringbuffer_get_iov(&client->buf, RINGBUFFER_READ, iov);
        nbytes = io_sendv(watcher->fd, iov);
        if (nbytes < 0) {
            fail("write error");
        } else if (nbytes == 0) {
            ev_io_stop(loop, watcher);
            ringbuffer_destruct(&client->buf);
            free(client);
            printf("Peer disconnected\n");
            return;
        } else {
            ringbuffer_consumed(&client->buf, nbytes);
            printf("Sent %zu bytes\n", nbytes);
            ev_io_stop(loop, watcher);
            ev_io_set(watcher, watcher->fd, EV_READ);
            ev_io_start(loop, watcher);
        }
    } else  {
        fail("got invalid event");
    }
}
```

Again, the whole application is stored on the github at
[https://github.com/couchbaselabs/libev-couchbase-example](https://github.com/couchbaselabs/libev-couchbase-example).
Let's see it in action. To clone and build the applications use the following
commands:


```
~ $ git clone git://github.com/couchbaselabs/libev-couchbase-example.git
~ $ cd libev-couchbase-example/step1
step1 $ ./autogen.sh && ./configure && make
```

As the client for the echo application, any telnet-like application will be
adequate, such as telnet, nc etc. The following listing simulates two terminals
by splitting them with vertical line:


```
step 1 $ ./server                   |  step1 $ telnet localhost 4567
Listen on 4567                      |  Trying 127.0.0.1...
Successfully connected with client  |  Connected to localhost.
Received 14 bytes                   |  Escape character is '^]'.
Sent 14 bytes                       |  Hello world!
Received 9 bytes                    |  Hello world!
Sent 9 bytes                        |  foo bar
Peer disconnected                   |  foo bar
                                    |  ^]
                                    |  telnet> Connection closed.
```

When we described our application, let's integrate Couchbase as the database
using libcouchbase. The `server.c` file will have some small additions. In the
`main` function, before initializing server socket, we will call `storage_init`
and put a connection handle into the server struct.


```
server.handle = storage_init(loop, "localhost:8091", "default", null);
```

And also in the `client_cb` handler, each time we receive a data from the
client, we will send it to Couchbase server with `storage_put` where `the_key`
is a hard-coded string `"example"`.


```
storage_put(client, the_key, val, nbytes);
```

Here, the initial application from step one is already using its own custom
event loop to handle other IO in the application. The application could be more
complex, but libcouchbase has separate interface to inject your IO
implementation into the library. In the simplest case, for example if your
application is using one of the IO libraries supported by libcouchbase, you can
just pass your event loop instance into the initializer, and libcouchbase won't
create new one. Instead it will register all its events on this external loop.
In case your application is using its own implementation of a reactor pattern,
such as nginx, or you use linux epoll API, you can easily write your own IO
plugin, and pass it to connection initializer.

The echo server is using libev library, and libcouchbase provides a plugin to
libev out-of-the-box. In this case we can imagine that it doesn't already have
it. In this case, we can copy the plugin from libcouchbase distribution into the
directory `step2/lcb-plugin/` and update build files appropriately.

Now we inspect the `storage.c`, where our `storage_init()` and `storage_put()`
defined.


```
lcb_t storage_init(struct ev_loop *loop, const char *host, const char *bucket, const char *password)
{
    struct lcb_create_st opts;
    struct lcb_create_io_ops_st io_opts;
    lcb_t handle;
    lcb_error_t err;

    io_opts.version = 1;
    io_opts.v.v1.sofile = NULL;
    io_opts.v.v1.symbol = "lcb_create_libev_io_opts";
    io_opts.v.v1.cookie = loop;

    opts.version = 0;
    opts.v.v0.host = host;
    opts.v.v0.bucket = bucket;
    opts.v.v0.user = bucket;
    opts.v.v0.passwd = password;

    err = lcb_create_io_ops(&opts.v.v0.io, &io_opts);
    if (err != LCB_SUCCESS) {
        error_callback(NULL, err, "failed to create IO object");
        return NULL;
    }
    err = lcb_create(&handle, &opts);
    if (err != LCB_SUCCESS) {
        error_callback(NULL, err, "failed to create connection object");
        return NULL;
    }

    (void)lcb_set_error_callback(handle, error_callback);
    (void)lcb_set_store_callback(handle, storage_callback);

    err = lcb_connect(handle);
    if (err != LCB_SUCCESS) {
        error_callback(handle, err, "failed to connect to the server");
        return NULL;
    }

    return handle;
}
```

The end of the function may look familiar, but the `io_opts` structure is more
interesting, because it defines how to look up our custom IO plugin. The
`io_opts.v.v1.sofile` set to `NULL` to specify that our plugin compiled into the
current executable image, In this case, `symbol` is the string name of the
function with the following signature:


```
lcb_error_t lcb_create_libev_io_opts(int version, lcb_io_opt_t *io, void *loop);
```

Which initializes the IO plugin and then the `cookie` will be passed to this
function as the `loop` argument. You can refer to the `lcb_create_io_ops(3)`
manpage for other ways to initialize IO subsystem.

The libcouchbase client is purely asynchronous, therefore each data operation is
split into two parts: a function-scheduler which validates and copies all
arguments to internal buffers for further handing, and a function-callback,
which will be called with the results of the operation. It is possible to
implement a wrapper which will provide a more synchronous API, but it is
difficult to write generic and efficient at the same time library API. Also
since all communication is done by using function arguments, it is easier to
maintain backward compatible APIs by versioning both incoming structures and
results. Let's see how we did it in our sample.


```
void storage_put(struct client_s *client, const char *key,
                 const void *val, size_t nval)
{
    lcb_error_t err;
    lcb_store_cmd_t cmd;
    const lcb_store_cmd_t *cmds[] = { &cmd };

    memset(&cmd, 0, sizeof(cmd));
    cmd.version = 0;
    cmd.v.v0.key = key;
    cmd.v.v0.nkey = strlen(key);
    cmd.v.v0.bytes = val;
    cmd.v.v0.nbytes = nval;
    cmd.v.v0.operation = LCB_SET;
    err = lcb_store(client->handle, client, 1, cmds);
    if (err != LCB_SUCCESS) {
        error_callback(client->handle, err, "failed to schedule store operation");
    }
}

void storage_callback(lcb_t instance, const void *cookie,
                      lcb_storage_t operation, lcb_error_t error,
                      const lcb_store_resp_t *resp)
{
    struct client_s *client = (struct client_s *)cookie;
    struct ev_io* watcher = (struct ev_io*)client;
    char cas_str[128];
    ssize_t nb;

    nb = snprintf(cas_str, 128, "%"PRIu64"\n", resp->v.v0.cas);
    if (nb < 0) {
        fail("output CAS value");
    }
    ringbuffer_ensure_capacity(&client->out, nb);
    if (ringbuffer_write(&client->out, cas_str, nb) != nb) {
        fail("write CAS into the buffer");
    }
    ev_io_stop(client->loop, watcher);
    ev_io_set(watcher, watcher->fd, EV_WRITE);
    ev_io_start(client->loop, watcher);

    (void)operation;
    (void)resp;
}
```

Here `storage_put()` function is a wrapper over `lcb_store(3)` and translates
arguments to the versioned structure and runs `lcb_store` to pass it to the
library. The data won't be sent immediately, but when the data socket, the
libcouchbase is connecting will be ready to accept data. After the server will
process the request, the application will be notified asynchronously via
`storage_callback`. Which in turn will copy CAS value to the output buffer to be
sent to the client.

Time to demonstrate an application. This application is built as the previous
one, except you need to navigate to `step2/` directory. As previously noted the
script will be split to demonstrate both server and the client:


```
step2 $ ./server                    |  step2 $ telnet localhost 4567
Listen on 4567                      |  Trying 127.0.0.1...
Successfully connected with client  |  Connected to localhost.
Received 14 bytes                   |  Escape character is '^]'.
Sent 20 bytes                       |  Hello world!
Peer disconnected                   |  2916447493390860288
                                    |  ^]
                                    |  telnet> Connection closed.
```

Now you can install `cbc` tools from package `libcouchbase2-bin`. In the case
you installed libcouchbase from source, you likely have it already. Check that
it created a key example and the CAS values are matching:


```
step2 $ printf "%x\n" 2916447493390860288
28794d8b11a40000
step2 $ cbc cat example
"example" Size:14 Flags:0 CAS:28794d8b11a40000
Hello world!
```

<a id="build_application_around"></a>

## Build an Application

You can use libcouchbase when you are building Couchbase-enabled application,
and want to bootstrap quickly. To do so you can build you application using IO
abstraction provided with libcouchbase.

In this example we create a thin proxy application which will expose the
memcached-compatible API for the system. Similar approaches exist for [moxi
server](http://www.couchbase.com/docs/moxi-manual-1.8/). Also this application
will use less hard-coded logic and more look like real-life service. Full source
code could be found at
[https://github.com/couchbaselabs/libcouchbase-proxy-sample](https://github.com/couchbaselabs/libcouchbase-proxy-sample).

We skip parsing and initialization of the Couchbase connection from the `main`
function for brevity. The proxy code begins in `run_proxy`, which is similar to
the main function in the previous section. The important difference here is that
we are using the IO abstraction from libcouchbase, to register events, and drive
an event loop.


```
void run_proxy(lcb_t conn)
{
    lcb_io_opt_t io;
    struct sockaddr_in addr;
    int sock, rv;
    server_t server;

    io = opts.v.v0.io;
    info("starting proxy on port %d", port);
    sock = socket(PF_INET, SOCK_STREAM, 0);
    if (sock == -1) {
        fail("socket()", strerror(errno));
    }
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = INADDR_ANY;
    rv = bind(sock, (struct sockaddr *)&addr, sizeof(addr));
    if (rv == -1) {
        fail("bind()");
    }
    rv = listen(sock, 10);
    if (rv == -1) {
        fail("listen()");
    }
    server.conn = conn;
    server.io = io;
    server.event = io->v.v0.create_event(io);
    if (server.event == NULL) {
        fail("failed to create event for proxy");
    }
    io->v.v0.update_event(io, sock, server.event, LCB_READ_EVENT,
                          &server, proxy_accept_callback);
    lcb_set_error_callback(conn, error_callback);
    lcb_set_get_callback(conn, get_callback);
    lcb_set_store_callback(conn, store_callback);
    info("use ctrl-c to stop");
    io->v.v0.run_event_loop(io);
}
```

As in the previous example, we create a listening socket and bind a handler to
read events. The handler is `proxy_accept_callback`, and it will be triggered
for each new client. In turn it will create a new client structure, defined as
follows:


```
typedef struct client_st client_t;
struct client_st {
    int id;
    server_t *server;
    int sock;
    ringbuffer_t in;
    ringbuffer_t out;
    void *event;
};
```

This initializes input and output buffers, and makes socket descriptors
non-blocking. At the end it register handler function `proxy_client_callback`
for read events, and then await for incoming data.

The proxy implements a very limited number of protocol commands: GET, SET and
VERSION. But other commands could be easily added.


```
void proxy_client_callback(lcb_socket_t sock, short which, void *data)
{
    struct lcb_iovec_st iov[2];
    ssize_t rv;
    lcb_io_opt_t io;
    client_t *cl = data;

    io = cl->server->io;
    if (which & LCB_READ_EVENT) {
        for (;;) {
            /* read in chunks of BUFFER_SIZE */
            ringbuffer_ensure_capacity(&cl->in, BUFFER_SIZE);
            ringbuffer_get_iov(&cl->in, RINGBUFFER_WRITE, iov);
            rv = io->v.v0.recvv(io, cl->sock, iov, 2);
            if (rv == -1) {
                if (io->v.v0.error == EINTR) {
                    /* interrupted by signal */
                    continue;
                } else if (io->v.v0.error == EWOULDBLOCK) {
                    /* nothing to read right now */
                    io->v.v0.update_event(io, cl->sock, cl->event,
                                          LCB_WRITE_EVENT, cl,
                                          proxy_client_callback);
                    break;
                } else {
                    fail("read error");
                }
            } else if (rv == 0) {
                /* end of stream */
                io->v.v0.destroy_event(io, cl->event);
                ringbuffer_destruct(&cl->in);
                ringbuffer_destruct(&cl->out);
                close(cl->sock);
                info("[%d] disconnected", cl->id);
                free(cl);
                return;
            } else {
                ringbuffer_produced(&cl->in, rv);

                for (;;) {
                    protocol_binary_request_header req;
                    lcb_size_t nr, sz;
                    char *buf;

                    /* make sure the buffer is aligned */
                    if (ringbuffer_ensure_alignment(&cl->in) != 0) {
                        fail("cannot align the buffer");
                    }
                    /* take the packet header from the buffer */
                    nr = ringbuffer_peek(&cl->in, req.bytes, sizeof(req));
                    if (nr < sizeof(req)) {
                        break;
                    }
                    /* make sure the buffer has whole the body */
                    sz = ntohl(req.request.bodylen) + sizeof(req);
                    if (cl->in.nbytes < sz) {
                        break;
                    }
                    /* copy packet into intermediate buffer */
                    buf = malloc(sizeof(char) * sz);
                    if (buf == NULL) {
                        fail("cannot allocate buffer for packet");
                    }
                    nr = ringbuffer_read(&cl->in, buf, sz);
                    if (nr < sizeof(req)) {
                        fail("input buffer doesn't contain enough data");
                    }
                    /* handle packet and deallocate the intermediate
                     * buffer */
                    handle_packet(cl, buf);
                    free(buf);
                }
            }
        }
    }
    if (which & LCB_WRITE_EVENT) {
        /* check if we have something to send */
        ringbuffer_get_iov(&cl->out, RINGBUFFER_READ, iov);
        if (iov[0].iov_len + iov[1].iov_len == 0) {
            io->v.v0.delete_event(io, cl->sock, cl->event);
            return;
        }
        rv = io->v.v0.sendv(io, cl->sock, iov, 2);
        if (rv < 0) {
            fail("write error");
        } else if (rv == 0) {
            io->v.v0.destroy_event(io, cl->event);
            ringbuffer_destruct(&cl->in);
            ringbuffer_destruct(&cl->out);
            close(cl->sock);
            info("[%d] disconnected", cl->id);
            free(cl);
            return;
        } else {
            ringbuffer_consumed(&cl->out, rv);
            io->v.v0.update_event(io, cl->sock, cl->event,
                                  LCB_READ_EVENT, cl,
                                  proxy_client_callback);
        }
    }
    (void)sock;
}
```

The function `proxy_client_callback` logically divided into two parts.

 * First one is taking effect when the event loop notifies us that the socket is
   ready for non-blocking reading. In this case it tries to read all the data
   available on the socket, find bounds of the packets and pass aligned byte arrays
   to `handle_packet`. Once it get from the IO subsystem special code, that it
   cannot read anything without blocking, it stops processing and register itself
   for write events, because in nearest future, responses will appear in the output
   buffer.

 * The second part of the function reacts on write events and basically much
   simpler. It just checks if there data in the output buffer, if so, it will try
   to send it to the client, otherwise unregister itself from write event to save
   CPU cycles.

The function `handle_packet` is good place to start playing with this example if
you'd like to add new features there. It decodes protocol packet and translates
it into libcouchbase calls. When for unknown commands it renders special packed
immediately.


```
void handle_packet(client_t *cl, char *buf)
{
    protocol_binary_request_header *req = (void *)buf;
    protocol_binary_response_header res;
    union {
        lcb_get_cmd_t get;
        lcb_store_cmd_t set;
    } cmd;
    union {
        const lcb_get_cmd_t *get[1];
        const lcb_store_cmd_t *set[1];
    } cmds;
    cookie_t *cookie;

    cookie = malloc(sizeof(cookie_t));
    if (cookie == NULL) {
        fail("cannot allocate buffer for command cookie");
    }
    cookie->client = cl;
    cookie->opaque = req->request.opaque;
    cookie->opcode = req->request.opcode;
    memset(&cmd, 0, sizeof(cmd));
    switch (req->request.opcode) {
    case PROTOCOL_BINARY_CMD_GET:
        cmds.get[0] = &cmd.get;
        cmd.get.v.v0.nkey = ntohs(req->request.keylen);
        cmd.get.v.v0.key = buf + sizeof(*req);
        info("[%d] get \"%.*s\"", cl->id,
             (int)cmd.get.v.v0.nkey, (char *)cmd.get.v.v0.key);
        lcb_get(cl->server->conn, (const void*)cookie, 1, cmds.get);
        break;
    case PROTOCOL_BINARY_CMD_SET:
        cmds.set[0] = &cmd.set;
        cmd.set.v.v0.operation = LCB_SET;
        cmd.set.v.v0.nkey = ntohs(req->request.keylen);
        cmd.set.v.v0.key = buf + sizeof(*req) + 8;
        cmd.set.v.v0.nbytes = ntohl(req->request.bodylen) - 8 - ntohs(req->request.keylen);
        cmd.set.v.v0.bytes = buf + sizeof(*req) + 8 + ntohs(req->request.keylen);
        cmd.set.v.v0.cas = req->request.cas;
        cmd.set.v.v0.datatype = req->request.datatype;
        memcpy(&cmd.set.v.v0.flags, buf + sizeof(*req), 4);
        cmd.set.v.v0.flags = ntohl(cmd.set.v.v0.flags);
        memcpy(&cmd.set.v.v0.exptime, buf + sizeof(*req) + 4, 4);
        cmd.set.v.v0.exptime = ntohl(cmd.set.v.v0.exptime);
        info("[%d] set \"%.*s\"", cl->id,
             (int)cmd.set.v.v0.nkey, (char *)cmd.set.v.v0.key);
        lcb_store(cl->server->conn, (const void*)cookie, 1, cmds.set);
        break;
    case PROTOCOL_BINARY_CMD_VERSION:
        free(cookie);
        info("[%d] version", cl->id);
        res.response.magic = PROTOCOL_BINARY_RES;
        res.response.opcode = req->request.opcode;
        res.response.keylen = 0;
        res.response.extlen = 0;
        res.response.datatype = PROTOCOL_BINARY_RAW_BYTES;
        res.response.status = PROTOCOL_BINARY_RESPONSE_SUCCESS;
        res.response.bodylen = htonl(sizeof(version_msg));
        res.response.opaque = req->request.opaque;
        res.response.cas = 0;
        ringbuffer_ensure_capacity(&cl->out, sizeof(res));
        ringbuffer_write(&cl->out, res.bytes, sizeof(res));
        ringbuffer_write(&cl->out, version_msg, sizeof(version_msg));
        break;
    default:
        free(cookie);
        info("[%d] unsupported command: 0x%02x", cl->id, req->request.opcode);
        res.response.magic = PROTOCOL_BINARY_RES;
        res.response.opcode = req->request.opcode;
        res.response.keylen = 0;
        res.response.extlen = 0;
        res.response.datatype = PROTOCOL_BINARY_RAW_BYTES;
        res.response.status = PROTOCOL_BINARY_RESPONSE_NOT_SUPPORTED;
        res.response.bodylen = htonl(sizeof(notsup_msg));
        res.response.opaque = req->request.opaque;
        res.response.cas = 0;
        ringbuffer_ensure_capacity(&cl->out, sizeof(notsup_msg) + sizeof(res));
        ringbuffer_write(&cl->out, res.bytes, sizeof(res));
        ringbuffer_write(&cl->out, notsup_msg, sizeof(notsup_msg));
    }
}
```

To maintain a logical link between requests and responses for the clients, the
protocol defines a special field `opaque`, which could be a special tag or
sequence number. To preserve this field in the response, we will put it into a
`cookie_t` structure. During the proxy initialization we defined two
callback-functions for libcouchbase:


```
lcb_set_get_callback(conn, get_callback);
lcb_set_store_callback(conn, store_callback);
```

In this kind application these function just build a protocol response from
libcouchbase return value and also register the `proxy_client_callback` on write
events to send out the data just written into the buffer.


```
void get_callback(lcb_t conn, const void *cookie, lcb_error_t err,
                  const lcb_get_resp_t *item)
{
    cookie_t *c = (cookie_t *)cookie;
    client_t *cl = c->client;
    lcb_io_opt_t io = cl->server->io;
    protocol_binary_response_get res;

    res.message.header.response.magic = PROTOCOL_BINARY_RES;
    res.message.header.response.opcode = PROTOCOL_BINARY_CMD_GET;
    res.message.header.response.keylen = 0;
    res.message.header.response.extlen = 4;
    res.message.header.response.datatype = item->v.v0.datatype;
    res.message.header.response.status = htons(map_status(err));
    res.message.header.response.bodylen = htonl(4 + item->v.v0.nbytes);
    res.message.header.response.opaque = c->opaque;
    res.message.header.response.cas = item->v.v0.cas;
    res.message.body.flags = htonl(item->v.v0.flags);
    ringbuffer_ensure_capacity(&cl->out, sizeof(res.bytes) + item->v.v0.nbytes);
    ringbuffer_write(&cl->out, res.bytes, sizeof(res.bytes));
    ringbuffer_write(&cl->out, item->v.v0.bytes, item->v.v0.nbytes);
    io->v.v0.update_event(io, cl->sock, cl->event, LCB_WRITE_EVENT,
                          cl, proxy_client_callback);
    free(c);
    (void)conn;
}
```

This is virtually the all integration points with libcouchbase. As we
demonstrated, libcouchbase more than protocol parser; it also abstract and
portable IO framework, allowing you to build asynchronous applications around
Couchbase Server.

As a conclusion, let's run your favourite memcached client, and verify our
proxy. First you need to clone and build it:


```
$ git clone git://github.com/couchbaselabs/libcouchbase-proxy-sample.git
$ cd libcouchbase-proxy-sample
libcouchbase-proxy-sample $ make
```

Run the server, and send couple of commands to it. We will use the
[dalli](https://github.com/mperham/dalli) ruby gem here.


```
libcouchbase-proxy-sample $ ./proxy                 |  $ irb
connecting to bucket "default" at "localhost:8091"  |  irb:001:0> require 'dalli'
starting proxy on port 1987                         |  true
use ctrl-c to stop                                  |  irb:002:0> m = Dalli::Client.new  "localhost:1987"
[1] connected                                       |  #<Dalli::Client:0x007f716321ce20 @servers=["localhost:1987"], @options={}, @ring=nil>
[1] version                                         |  irb:003:0> m.set("foo", "bar")
[1] set "foo"                                       |  true
[1] get "foo"                                       |  irb:004:0> m.get("foo")
[1] disconnected                                    |  "bar"
```

<a id="couchbase-sdk-c-rn"></a>
