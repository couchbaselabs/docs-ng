# Moxi Performance Tuning Standalone Moxi

As your site and cluster usage grows, it's often a good step to move towards
standalone or client-side Moxi. (It can be even better, too, to move towards a
"smart client", which removes the need for moxi (whether server-side or
client-side) in the first place.)

See [Standalone Moxi Component](moxi-manual-ready.html#moxi-standalone) for more
information.

<a id="moxi-performance-conncounts"></a>

## Connection Counts

For standalone (client-side) moxi, a key resource to watch is connection usage,
especially when bumping into O/S limits (eg, number of file descriptors).

There are two sides of this, client-side (upstream) and membase-side
(downstream).

**Unhandled:** `[:unknown-tag :bridgehead]` In general, moxi usually has no
trouble servicing many hundreds or more of connections from upstream clients
(eg, from your application). If you need to tune this, use the -c command-line
parameter (see moxi -h for more moxi command-line usage information).

However, moxi doesn't let all client/upstream connections attack the servers all
at once, but has a (per-thread) connection pool and a configurable concurrency
limit on the number of upstream/client requests it will send to downstream
servers.

[See the "concurrency" (aka, "downstream\_max") configuration parameter, as
discussed here: [Standalone Moxi
Component](moxi-manual-ready.html#moxi-standalone) andFollow A Request Through
Moxi](moxi-manual-ready.html#moxi-dataflow)

**Unhandled:** `[:unknown-tag :bridgehead]` The other side of moxi, of course,
is with its memcached/membase-facing connections. Usually, you won't run into
limitations here, but should instead consider the equation from
memcached/membase server's point of view.

You might have NUM\_MOXI number of standalone moxi processes all feverishly
processing requests at their downstream\_max limits of concurrency. And, you
might have NUM\_MEMBASE number of membase nodes.

So, from each standalone moxi, you'll have these many connections to a single
membase node:

NUM\_CONN\_FROM\_MOXI\_TO\_MEMBASE = NUM\_MOXI\_WORKER\_THREADS x NUM\_BUCKETS x
downstream\_max

To simplify, let's say you just have a single bucket (such as the "default"
bucket), that downstream\_max is 4 (the default, circa 1.6.0 moxi) and that
NUM\_MOXI\_WORKER\_THREADS is 4 (which is also the default -t command-line flag
value, circa 1.6.0 moxi). So, in this example, there are 4 x 1 x 4 = 16
connections that a single moxi will make to memcached/membase.

Multiply NUM\_CONN\_FROM\_MOXI\_TO\_MEMBASE by NUM\_MOXI and you'll have the
number of connections that each membase will see from the farm of standalone
moxi processes. (In your accounting, don't forget to leave some room for other
clients (such as membase's own monitoring processes, vbucketmigrator processes
and embedded moxi's so that they can create their own connections to membase
services).

Multiply NUM\_CONN\_FROM\_MOXI\_TO\_MEMBASE by NUM\_MEMBASE and you'll have the
number of connections that each moxi will make just on its downstream side.

These numbers (plus whatever whatever extra wiggle room you need) can help you
calculate your ulimit's correctly.

**Unhandled:** `[:unknown-tag :bridgehead]` To see the current number of
connections into moxi, as totals and on the upstream and/or downstream-side,
send moxi an ascii "stats proxy" request. More information on this is at: [Moxi
Statistics](moxi-manual-ready.html#moxi-statistics)

<a id="moxi-performance-ostuning"></a>

## Operating System Tuning

Some networking stack settings to consider tuning for your deployments:

 * Turning on `tcp_no_delay` in your application code

 * Setting the MTU on the localhost to 1500 (linux defaults can be much higher)

<a id="moxi-statistics"></a>
