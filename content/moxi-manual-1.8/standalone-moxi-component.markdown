# Standalone Moxi Component

Couchbase provides a standalone Moxi component that enables scalable deployments
across multiple web application servers. The best practice is to install one
standalone Moxi per web application server, and then point web applications to
the standalone Moxi instance on its own server. The Moxi component then
communicates directly with the Cluster Manager (specified via the HTTP/REST URL
supplied upon Moxi startup). This Moxi component communicates with the Cluster
Manager and is aware of cluster settings and changes.

<a id="moxi-standalone-install"></a>

## Downloading and Installing Standalone Moxi

To obtain the standalone Moxi component, download it (from
[http://www.couchbase.com/downloads-all](http://www.couchbase.com/downloads-all)
). Installer packages are available

**RedHat Linux**


```
shell> sudo rpm -i moxi-server_VERSION.rpm
```

**Ubuntu**


```
shell> sudo dpkg -i moxi-server_VERSION.deb
```

Moxi will install into the /opt/moxi/subdirectory, so that you can run:


```
shell> /opt/moxi/bin/moxi
```

To get some initial usage/help information:


```
shell> /opt/moxi/bin/moxi -h
```

<a id="moxi-standalone-running"></a>

## Running moxi

You can start and stop moxi from the command line by using the `moxi-server`
startup script:


```
shell> /etc/init.d/moxi-server start|stop|restart
```

You can start, stop and restart `moxi` using the corresponding keyword to the
command line.

<a id="moxi-standalone-config"></a>

## Configuration

In 1.7, Moxi will install as a service and the instructions immediately below
are valid. For anything prior to 1.7, please follow the instructions to run Moxi
manually

The standalone moxi server includes /etc/init.d/moxi-server startup scripts that
you need to configure before using the startup scripts. After installing the
moxi server software, please edit the configuration files under the
/opt/moxi/etc directory

 * `/opt/moxi/etc/moxi.cfg`

   Local config/information.

 * `/opt/moxi/etc/moxi-cluster.cfg`

   Cluster config/information.

<a id="moxi-standalone-config-local"></a>

### Local configuration (moxi.cfg)

The `moxi.cfg` file allows you to configure the moxi process, including process
performance characteristics like timeouts, resource limits, listening port
number, etc. It is equivalent to what you can specify with moxi's `-Z`
command-line parameter.

An example of `moxi.cfg` file:


```
usr=Administrator,
pwd=password,
port_listen=11211,
default_bucket_name=default,
downstream_max=1024,
downstream_conn_max=4,
downstream_conn_queue_timeout=200,
downstream_timeout=5000,
wait_queue_timeout=200,
connect_max_errors=5,
connect_retry_interval=30000,
connect_timeout=400,
auth_timeout=100,
cycle=200
```

<a id="moxi-standalone-config-cluster"></a>

### Cluster Configuration (moxi-cluster.cfg)

The `moxi-cluster.cfg` file allows you to point moxi to a cluster. It is
equivalent to moxi's `-z` command-line parameter.

It will usually contain the REST URL information of a Couchbase cluster. For
example:


```
url=http://membase01:8091/pools/default/bucketsStreaming/default
```

<a id="moxi-standalone-config-advanced"></a>

## Advanced Standalone moxi Configuration

Some of you may want to run multiple instances of moxi, giving each moxi process
special command-line configuration parameters. The simplest way to start moxi
completely via the command-line is by passing it one or more comma-separated
REST URL's:


```
shell> moxi URL1[,URL2[,URLn]]
```

For example:


```
shell> moxi http://membase0:8091/pools/default/bucketsStreaming/shoppingCarts,http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

The URLs in this case are separated by a comma. In a configuration file, the
URLs should be separated by the pipe ( `|` ) character.

On startup moxi will contact each URL in the provided order, until one of the
URL's succeeds in returning a valid REST response. The connection that moxi
creates to the URL is persistent; neither Couchbase server nor moxi will close
the HTTP connection. Therefore Couchbase server can stream cluster topology
update information to moxi as needed. If moxi loses its persistent HTTP
connection to a URL, it will attempt to find a running Couchbase server using
the URL's provided in the start command. In other words, moxi will first attempt
to reconnect to Couchbase server using URL's provided at the beginning of the
command, and if needed, then proceed to subsequent URLs.

A per-bucket URL has the form of:


```
http://<MEMBASE_SERVER>:8091/pools/default/bucketsStreaming/<BUCKET_NAME>
```

For example, with a bucket named "shoppingCarts":


```
shell> moxi http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

And using more than one Couchbase server for redundancy:


```
shell> moxi http://membase0:8091/pools/default/bucketsStreaming/shoppingCarts,http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

The "Gold Standard" best practice (if you have the flexibility) is to put the
Couchbase host URLs behind a http reverse-proxy, so that all the client-side
Moxi's can be more easily configured with a "stable" URL which can handle
cluster changes without having to touch each client-side Moxi like..


```
shell> moxi http://membase_http_reverse_proxy_host:8091/pools/default/bucketsStreaming/<BUCKET_NAME>
```

Certain HTTP reverse proxies or load balancers will close a connection that they
have deemed idle. When a client-side Moxi is connected to Couchbase's streaming
API, there is very little data flowing unless topology changes occur. Because of
this, some load balancers will close the connection which can cause traffic
disruptions. It is a best practice to configure the load balancer with an
infinite timeout on idle connections for this traffic.

Additionally, some HTTP reverse proxies or load balancers can provide 'round
robin' load balancing; such features should be avoided. Because clients connect
to the HTTP reverse-proxy/load-balancer, the reverse- proxy/load-balancer in
'round-robin' mode will choose the next server on its list to forward the
connection. Instead the HTTP reverse-proxy/load-balancer should be configured to
use either a 'source' mode (different reverse-proxies/load- balancers have
different terms for this concept), where the same HTTP client from a given IP
address would be proxy for the same HTTP server.

**Unhandled:** `[:unknown-tag :bridgehead]` Moxi will listen on port 11211 by
default. To change Moxi's listen port, use a -Z port\_listen flag:


```
shell> moxi -Z port_listen=11311 http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

**Unhandled:** `[:unknown-tag :bridgehead]` If your bucket has SASL
authentication credentials, you can also specify them using the usr and pwd -Z
flags. For example:


```
shell> moxi -Z usr=shoppingCarts,pwd=need_a_better_pswd,port_listen=11311 \
    http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

**Unhandled:** `[:unknown-tag :bridgehead]` To have moxi emit more logging
information, you can specify -v, -vv, or -vvv flags (the more v's, the more
verbose moxi will be). For example:


```
shell> moxi -vv -Z usr=shoppingCarts,pwd=need_a_better_pswd,port_listen=11311  \
    http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

<a id="moxi-standalone-protocols"></a>

## Ascii and Binary Protocols

Moxi, by default, will auto-detect whether your client is using ascii memcached
protocol or binary memcached protocol. You can configure moxi to only allow a
particular protocol via its "-B" command-line flag. This is the same "-B"
command-line feature as memcached.

<a id="moxi-standalone-gatewaymoxi"></a>

## Gateway versus bucket-specific moxi's

When moxi is running embedded in the Couchbase cluster, it actually is used into
two different modes: as a "gateway" moxi or as a bucket-specific moxi. This is
done by just starting moxi processes with different command-line flags,
specifically by pointing moxi at (slightly) different URL's. You can use these
different URL's when starting your own client-side, standalone moxi's.

The gateway moxi (usually listening on port 11211 when moxi is embedded in
Couchbase) handles all SASL authenticated buckets. That is, a client connects to
port 11211, and by default, ends up on the default bucket (if it exists and
hasn't been deleted). The client can then use binary memcached protocol to SASL
authenticate to a different bucket.

The bucket-specific moxi, on the other hand, is already associated with a
particular bucket (and this is a bucket that's not already handled by the
gateway moxi). For example, a bucket-specific moxi might be listening on port
11212, for the "shoppingCarts" bucket, and as soon as a client connects to port
11212, the client may immediately use any memcached commands
(get/set/delete/flush\_all/etc) to affect key-value items in that shoppingCarts
bucket.

**Unhandled:** `[:unknown-tag :bridgehead]` To start a gateway moxi, use a URL
of the form: /pools/default/saslBucketsStreaming

For example:

./moxi -Z usr=Administrator,pwd=DontTell
http://membase-a:8091/pools/default/saslBucketsStreaming

**Unhandled:** `[:unknown-tag :bridgehead]` To start a per-bucket moxi, use a
URL of the form: /pools/default/bucketsStreaming/<BUCKET\_NAME> For example:

./moxi http://membase-a:8091/pools/default/bucketsStreaming/shoppingCarts

<a id="moxi-standalone-concurrency"></a>

## Increasing Concurrency

There are a couple ways to increase concurrency in moxi:

**Unhandled:** `[:unknown-tag :bridgehead]` By default, moxi uses 4 worker
threads. This can be changed via the -t THREAD\_NUM flag. For example:


```
shell> moxi -t 6 -Z port_listen=11311 http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

**Unhandled:** `[:unknown-tag :bridgehead]` moxi limits the number of inflight
or concurrent client requests that it will send to the Couchbase cluster. This
is controlled via the -Z concurrency configuration value, whose default value is
1024. For older users of moxi, the "concurrency" configuration parameter is also
known as the "downstream\_max" configuration parameter. For example, to set
concurrency to 8:


```
shell> moxi -Z port_listen=11311,concurrency=8 http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

The formula of total number concurrent requests that moxi will process is:

NUM\_THREADS x NUM\_BUCKETS x concurrency

With the last command-line, then, the NUM\_THREADS defaults to 4. There's only
one bucket involved (the shoppingCarts bucket), so NUM\_BUCKETS is 1. And,
concurrency has been overridden to be 8. So, there will be moxi allow only 32
concurrent client requests to be processed. All other client requests will go
onto a wait queue until active requests are finished.

**Unhandled:** `[:unknown-tag :bridgehead]` Increasing concurrency and the
number of worker threads isn't necessarily a free lunch. More threads, for
example, means using resources that other processes (such as your web app
servers) might need. Higher concurrency settings from moxi (when multiplied by
the number moxi's you've deployed) means more connections will be created to
downstream servers, which can eventually cause other performance issues or hit
connection (file descriptor) limits.

**Unhandled:** `[:unknown-tag :bridgehead]` More information on the downstream
conn queues is available: [Following A Request Through
Moxi](moxi-manual-ready.html#moxi-dataflow).

<a id="moxi-standalone-timeouts"></a>

## Timeouts

You can configure a wait queue timeout in moxi, so that moxi will return a
SERVER\_ERROR if a client request has been waiting too long in the wait queue.
You can also specify a timeout for any active, inflight requests (in the
previous section example, for example, this would be one of the 32 active
requests).

These timeouts are -Z `wait_queue_time` and `downstream_timeout` configuration
values, specified in milliseconds. To use timeouts, you must specify a clock
cycle or quantum, in milliseconds, via the "cycle" -Z flag. The -Z flag is 200
milliseconds by default so that moxi doesn't waste any effort making timing
system calls. In other words, moxi only checks the system time by default every
200 milliseconds. Other threads use the cached value for the system time. This
means that other timeout values should be a multiple of the cycle value. For
example:


```
shell> moxi -Z port_listen=11311,concurrency=8,cycle=100,wait_queue_timeout=5000,downstream_timeout=5000 \
     http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

Please see [Following A Request Through
Moxi](moxi-manual-ready.html#moxi-dataflow) for more information on timeouts.

<a id="moxi-standalone-configfile"></a>

## Configuration File

The -Z flag can only be specified once on the moxi command-line, so it can get
really long with key-value configuration pairs. Here's a long example:


```
shell> moxi -Z port_listen=11311,concurrency=8,cycle=100,wait_queue_timeout=5000,downstream_timeout=5000 \
    http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

At this point, you can put the entire -Z key-value configuration list into a
separate file, and tell moxi to load the -Z configuration from that file. For
example:


```
shell> moxi -Z ./relative/path/to/config_file http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
shell> moxi -Z /absolute/path/to/config_file http://membase1:8091/pools/default/bucketsStreaming/shoppingCarts
```

The contents of the config file still needs to be key=value pairs and
comma-separated, but may have extra whitespace and line breaks for readability.
Here's an example -Z config file:


```
port_listen = 11311, concurrency = 8, cycle = 100, wait_queue_timeout = 5000, downstream_timeout = 5000,
```

The REST/HTTP URL's may also be placed into their own configuration file. It
turns out the way we've been specifying REST/HTTP URL's so far in this document
is actually just a convenience shorthand for the following (lowercase) -z url
flag. We can the -z flag a cluster configuration flag. For example:


```
shell> moxi -z url=http://membase1:8091/pools/default/bucketsStreaming
```

When specifying multiple hosts, use a comma to separate each URL:


```
shell> moxi -z url=http://membase1:8091/pools/default/bucketsStreaming
```

The above is exactly the same as the more convenient:


```
shell> moxi http://membase1:8091/pools/default/bucketsStreaming
```

However, the -z can also point to a separate file:


```
shell> moxi -z ./relative/path/to/lowercase-z-config-file
shell> moxi -z /absolute/path/to/lowercase-z-config-file
```

The contents of the "lowercase z config file" would look like:


```
url = http://membase1:8091/pools/default/bucketsStreaming
```

Multiple URL's can be specified in the cluster REST/URL config file, but must be
separated by '|' (vertical 'pipe' bar) characters (because the comma character
is already used as a key=value delimiter):


```
url = http://membase1:8091/pools/default/bucketsStreaming|http://membase2:8091/pools/default/bucketsStreaming|http://membase3:8091/pools/default/bucketsStreaming
```

The URLs in this case are separated by the pipe ( `|` ) character. On the
command-line, they should be separated by a comma.

Finally, you can use both capital Z and lowercase z flags, to specify both kinds
of config files:


```
shell> moxi -Z ./moxi.cfg -z ./cluster.cfg
```

<a id="moxi-standalone-errors"></a>

## Errors

**Unhandled:** `[:unknown-tag :bridgehead]` If you're pointing moxi at the wrong
server/URL, or moxi can't reach any of its REST/URL's, you'll see output
prefixed with the word `ERROR:` :


```
shell> ./dev/moxi/moxi http://foo.bar.baz.foo
ERROR: could not contact REST server(s): http://foo.bar.baz.foo
ERROR: could not contact REST server(s): http://foo.bar.baz.foo
```

You can see that moxi retries its configured REST/URL's every second. Also, if
the server that moxi is contacting is up, but provides mangled JSON information,
moxi will also inform you every second.


```
shell> ./dev/moxi/moxi http://google.com
2010-11-01 16:14:43: (agent_config.c.453) ERROR: could not parse JSON from REST server: <HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8"> <TITLE>301 Moved</TITLE></HEAD><BODY> <H1>301 Moved</H1> The document has moved <A HREF="http://www.google.com/">here</A>. </BODY></HTML>
```

When you provide moxi with a list of REST/URL's, the earlier URL's have higher
precedence. So, moxi will favor the first URL and attempt to contact it first.
Then the 2nd URL, then the 3rd and so on. If the 2nd URL works, but stops
working (moxi succeeded in contacting the 2nd URL, but loses its connection to
the 2nd URL some time later), moxi will start over from the start of the
REST/URL's list with the first URL (in the hopes that the favored earlier URL is
now back online).

**Unhandled:** `[:unknown-tag :bridgehead]` Please see: [Moxi Error
Responses](moxi-manual-ready.html#moxi-errors)

<a id="moxi-memcached"></a>
