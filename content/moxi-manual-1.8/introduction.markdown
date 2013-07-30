# Introduction

`moxi` is a proxy for `memcached` traffic that can be used in a variety of ways
and is especially useful against a Couchbase Server cluster.

There a three main reasons for using `moxi` :

 * **Compatibility**

   You want the automatic, dynamic reconfiguration features of Couchbase, but
   you're too busy to change your web application. `moxi` can help here by proxying
   requests to the correct Couchbase server nodes and will provide protocol
   transformations, too. That is, you can keep on using ascii `memcached` clients
   without any changes.

 * **Simplification**

   Simplifying your configuration. `moxi` can dynamically respond to cluster health
   updates, so your application doesn't have to.

 * **Performance**

   You can use `moxi` within a "client-side" architecture (which runs on your web
   application servers). This can be helpful to share already-connected sockets,
   reduce the number of connections from web-app servers to Couchbase, and avoid
   extra machine hops.

<a id="moxi-using"></a>

## Using moxi

`moxi` is an integrated part of Couchbase already, so just point your
`memcached` clients to the right port (such as 11211) and you're done. This
common configuration is called *server-side*  `moxi`.

As mentioned above, you can also run your own `moxi` instances on the
client-side, or on your web-app server hosts. In this case, your web application
will be making local machine connections to a long-running `moxi` process (which
will provide connection pooling for you). That is, your web applications will
connection to 127.0.0.1:11211, and `moxi` will do the rest to proxy requests to
the right Couchbase server.

For more information on running `moxi` in client-side, see [Standalone Moxi
Component](#moxi-standalone)

`moxi` is a proxy server that speaks the `memcached` protocol, can multiplex
multiple clients onto fewer, shared connections, and can translate between
`memcached` ascii and binary protocols. `moxi` has advanced features that allow
it to have dynamic reconfigurability and integration with Couchbase.

<a id="moxi-serverside"></a>

### Server-side moxi

Each Couchbase server node includes integrated (or server-side) `moxi` server
software. Server-side `moxi` processes are spawned and managed by the Couchbase
cluster manager (so they're running on the same server-side nodes as the other
Couchbase server processes). Couchbase knows how to do handle watch-dogging and
reconfigures these server-side `moxi` processes automatically.

There is one "gateway" `moxi` server process in particular which the Couchbase
cluster manager will configure to listen, by default, on port 11211. This
gateway `moxi` server process is fully cluster aware and will be automatically,
dynamically reconfigured by the Couchbase cluster manager whenever the cluster
changes server node membership or health status.

The gateway `moxi` has an additional special responsibility of handling the
"default" bucket, if there is one. (There will be a default bucket configured
when you follow the normal Couchbase initial configuration wizard screens). So a
client that connects to port 11211 will end up using the "default" bucket (if
there is one).

The gateway `moxi` also has a special responsibility to handle any buckets that
need SASL authentication. That is, a client can use the binary `memcached`
protocol to connect to the gateway `moxi` and use SASL authentication (which is
part of the binary `memcached` protocol) to associate the client's connection
with a different bucket.

Also, as you create per-port buckets in your Couchbase cluster, the Couchbase
cluster manager will automatically spawn and manage a separate `moxi` process or
instance for every port-based bucket that you've created. For example, if you
create a second bucket named "shoppingCarts" on port 11212, there will be a
dedicated `moxi` process/instance that listens on port 11212 that provides
access to that shoppingCarts bucket.

<a id="moxi-proxy-memcached"></a>

### Proxying existing memcached clients

Existing ascii `memcached` clients (what most folks are using) should be able to
connect to any gateway `moxi` instance or to any port-based `moxi` instance,
without any changes. In your application's client library configuration, just
specify the right port (eg, 11211, 11212, etc).

If an ascii `memcached` client connects to the gateway `moxi`, it will be
assigned to use the "default" bucket (if the default bucket exists (it may have
been deleted or not have been created by the Couchbase administrator)).

If an ascii `memcached` client connects to a port-based `moxi` (for example,
port 11212 for the "shoppingCarts" bucket), it will be assigned to the bucket
that was created with that port.

<a id="moxi-clientside"></a>

### Client side moxi

You may also choose to run `moxi` on the "client-side". That means installing
and running `moxi`, for example, on your web-application server hosts.

This has the advantage of increased performance, especially for PHP-style
applications that use occasional process restart strategies. (Think of classic
CGI apps in the worst case.) Since a client-side `moxi` server can run on the
same machine as the `memcached` client application (usually a web host), the
`memcached` client only needs to make a fast local machine network connection to
`moxi`, the client-side `moxi` server can reuse long-running connections (saving
on TCP connection setup handshake time), and the client-side `moxi` can
multiplex multiple clients into shared connections (reducing the file descriptor
usage on the servers.)

Additionally, client-side `moxi` 's can provide some simplified configuration
benefits. The client applications can connect to the client-side `moxi`, which
might be running at "127.0.0.1:11211" instead of having the manage their own
server-lists and having to have their own code to handle cluster
reconfigurations. The client-side `moxi` can participate in the same dynamic
cluster reconfiguration algorithms of Couchbase. Any cluster membership or
health changes can propagate automatically to the client-side `moxi` 's
instances.

See [Standalone Moxi Component](#moxi-standalone) for more information about
configuring a client-side `moxi`.

<a id="moxi-datamanagement-channel"></a>

### Data Channel versus Management Channel

There are two kinds of connections that `moxi` either creates or handles: data
channel traffic (for `memcached` key-value requests) and management channel
traffic (to learn about the cluster configuration and re-configuration).

Management channel traffic is REST-based, and by default uses port 8091. These
are specified via the REST URL's described in the previous section. The JSON
messages passed over these HTTP/REST channels are all about the cluster's
configuration (and re-configuration events).

Data channel traffics occurs on bucket-oriented ports, like 11211. The messages
passing over these connections are key-value requests such as `get` or `incr`.

Much less traffic passes over the management HTTP/REST channels, as cluster
health and membership changes tend to be infrequent.

However, the management channels are important, as a client-side `moxi` works
best when it receives relevant cluster management change information quickly.
`moxi` servers will still work even with slow management channel news, but will
inefficiently be making requests to the wrong servers and receiving errors that
force `moxi` to retry requests on other servers.

As mentioned in the previous section, you may apply industry standard tools like
HTTP reverse-proxies to help increase availability and ease of configurability.
An HTTP proxy can help make a Couchbase proxy perform better because it will
improve the management channel (HTTP/REST) operations. By adding a
level-of-indirection via a reverse-proxy, you can allow each client-side `moxi`
to have a simple URL as shown above.

<a id="moxi-dataflow"></a>
