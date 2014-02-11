# Following A Request Through Moxi

To understand some of the configurable command-line flags in `moxi` (
`concurrency`, `downstream_max`, `downstream_conn_max`, `downstream_timeout`,
`wait_queue_timeout`, etc), it can be helpful to follow a request through
moxi...

The normal flow of data for `moxi` is as follows:

 1. **A client connects**

    A client creates a connection (an upstream conn) to moxi. moxi's -c command-line
    parameter ultimately controls the limits on the maximum number of connections.

    In this -c parameter, moxi inherits the same behavior as memcached, and will
    stop accept()'ing client connections until existing connections are closed. When
    the count of existing connections drops below the -c defined level, moxi will
    accept() more client connections.

 1. **The client makes a request, which goes on the wait queue**

    Next, the client makes a request — such as simple single-key command (like set,
    add, append, or a single-key get).

    At this point, moxi places the upstream conn onto the tail of a wait queue.
    moxi's `wait_queue_timeout` parameter controls how long an upstream conn should
    stay on the wait queue before moxi times it out and responds to the client with
    a SERVER\_ERROR response.

 1. **The concurrency parameter**

    Next, there's a configurable max limit to how many upstream conn requests moxi
    will process concurrently off the head of the wait queue. This configurable
    limit is called `concurrency`. (This formerly used to be known, perhaps
    confusingly, as `downstream_max`. For backwards compatibility, `concurrency` and
    `downstream_max` configuration flags are treated as synonyms.)

    The concurrency configuration is per-thread and per-bucket. That is, the moxi
    process-level concurrency is actually `concurrency` X num-worker-threads X
    num-buckets.

    The default concurrency configuration value is 1024. This means moxi will
    concurrently process 1024 upstream connection requests from the head of the wait
    queue. (There are more queues in moxi, however, before moxi actually forwards a
    request. This is discussed in later sections.)

    Taking the concurrency value of 1024 as an example, if you have 4 worker threads
    (the default, controlled by moxi's -t parameter) and 1 bucket (what most folks
    start out with, such as the "default" bucket), you'll have a limit of 1024 x 4 x
    1 or 4096 concurrently processed client requests in that single moxi process.

    The rationale behind the concurrency increase to 1024 for moxi's configuration
    (it used to be much lower) is due to the evolving design of moxi. Originally,
    moxi only had the wait queue as its only internal queue. As more, later-stage
    queues were added during moxi's history, we found that getting requests off the
    wait queue sooner and onto the later stage queues was a better approach. We'll
    discuss these later-stage queues below.

    Next, let's discuss how client requests are matched to downstream connections.

 1. **Key hashing**

    The concurrently processed client requests (taken from the head of the wait
    queue) now need to be matched up with downstream connections to the Couchbase
    server. If the client's request comes with a key (like a SET, DELETE, ADD, INCR,
    single-key GET), the request's key is hashed to find the right downstream server
    "host:port:bucket" info. For example, something like —
    "memcache1:11211:default". If the client's request was a broadcast-style command
    (like FLUSH\_ALL, or a multi-key GET), moxi knows the downstream connections
    that it needs to acquire.

 1. **The downstream conn pool**

    Next, there's a lookup using those `host:port:bucket` identifiers into a
    downstream conn pool in order to acquire or reserve the appropriate downstream
    conns. There's a downstream conn pool per thread. Each downstream conn pool is
    just a hashmap keyed by `host:port:bucket` with hash values of a linked-list of
    available downstream conns. The max length of any downstream conn linked list is
    controlled by moxi's `downstream_conn_max` configuration parameter.

     * *The downstream\_conn\_max parameter*

       By default the `downstream_conn_max` value is 4. A value of 0 means no limit.

       So, if you've set `downstream_conn_max` of 4, have 4 worker threads, and have 1
       bucket, you should see moxi create a maximum of 4 X 4 X 1 or 16 connections to
       any Couchbase server.

 1. **Connecting to a downstream server**

    If there isn't a downstream conn available, and the `downstream_conn_max` wasn't
    reached, moxi creates a downstream conn as needed by doing a `connect()` and
    SASL auth as needed.

     * **The connect\_timeout and auth\_timeout parameters**

       The `connect()` and SASL auth have their own configurable timeout parameters,
       called `connect_timeout` and `auth_timeout`, and these are in milliseconds. The
       default value for `connect_timeout` is 400 milliseconds, and the `auth_timeout`
       default is 100 milliseconds.

     * **The downstream conn queue**

       If `downstream_conn_max` is reached, then the request must wait until a
       downstream conn becomes available; the request therefore is placed on a
       per-thread, per- `host:port:bucket` queue, which is called a downstream conn
       queue. As downstream conns are released back into the downstream conn pool, they
       will be assigned to any requests that are waiting on the downstream conn queue.

     * **The downstream\_conn\_queue\_timeout parameter**

       There is another configurable timeout, downstream\_conn\_queue\_timeout, that
       defines how long a request should stay on the downstream conn queue in
       milliseconds before timing out. By default, the downstream\_conn\_queue\_timeout
       is 200 milliseconds. A value of 0 indicates no timeout.

 1. **A downstream connection is reserved**

    Finally, at this point, downstream conn's are matched up for the client's
    request. If you've configured moxi to track timing histogram statistics, moxi
    will now get the official start time of the request. moxi now starts
    asynchronously sending request message bytes to the downstream conn and
    asynchronously awaits responses.

    To turn on timing histogram statistics, use the "time\_stats=1" configuration
    flag. By default, time\_stats is 0 or off.

 1. **The downstream\_timeout parameter**

    Next, if you've configured a `downstream_timeout`, moxi starts a timer for the
    request where moxi can limit the time it will spend processing a request at this
    point. If the timer fires, moxi will return a "SERVER\_ERROR proxy downstream
    timeout" back to the client.

    The `downstream_timeout` default value is 5000 milliseconds. If moxi sees this
    time elapse, it will close any downstream connections that were assigned to the
    request. Due to this simple behavior of closing downstream connections on
    timeout, having a very short `downstream_timeout` is not recommended. This will
    help avoid repetitive connection creation, timeout, closing and reconnecting. On
    an overloaded cluster, you may want to increase `downstream_timeout` so that
    moxi does not constantly attempt to time out downstream connections on an
    already overloaded cluster, or by creating even more new connections when
    servers are already trying to process requests on old, closed connections. If
    you see your servers greatly spiking, you should consider making this
    adjustment.

 1. **Responses are received**

    When all responses are received from the downstream servers for a request (or
    the downstream conn had an error), moxi asynchronously sends those responses to
    the client's upstream conn. If you've configured moxi to track timing histogram
    statistics, moxi now tracks the official end time of the request. The downstream
    conn is now released back to the per-thread downstream conn pool, and another
    waiting client request (if any) is taken off the downstream conn queue and
    assigned to use that downstream conn.

Backoff/BlacklistingAt step 6, there's a case where a `connect()` attempt might
fail. Moxi can be configured to count up the number of `connect()` failures for
a downstream server, and will also track the time of the last failing
`connect()` attempt.

With the `connect()` failure counting, moxi can be configured to blacklist a
server if too many `connect()` failures are seen, which is defined by the
connect\_max\_errors configuration parameter. When more than
connect\_max\_errors number of `connect()` failures are seen, moxi can be
configured to temporarily stop making `connect()` attempts to that server (or
backoff) for a configured amount of time. The backoff time is defined via the
connect\_retry\_interval configuration, in milliseconds.

The default for `connect_max_errors` is 5 and the `connect_retry_interval` is
30000 millisecods, that is, 30 seconds.

If you use connect\_max\_errors parameter, it should be set greater than the
`downstream_conn_max` configuration parameter.

<a id="moxi-standalone"></a>
