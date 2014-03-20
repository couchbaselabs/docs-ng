# Moxi Statistics

Cluster-wide stats vs Single-server stats

moxi provides a "cluster-wide" view of stats. That is, moxi broadcasts the
"stats" command to every server in the cluster and aggregates (sums) the
returned values that make sense, before returning aggregated values back to you.
Underneath the hood, it uses a hashmap to do the aggregation, so that stats
values that moxi emits are returned in un-sorted (confusing) order. Because of
this, folks usually do something like the following to make values easier to
read (port 11211 is where moxi is listening by default when used as part of the
Couchbase installation).


```
echo "stats" | nc HOST 11211 | sort
```

If you just want to get a single server's stats, directly from
memcached/ep-engine, please use:


```
/opt/membase/VERSION/bin/ep-engine/management/stats.py HOST:11210 all
```

Port 11210 is where memcached/ep-engine is running by default in Couchbase.

<a id="moxi-statistics-proxy"></a>

## Proxy-related stats

The latest versions of moxi have improved proxy-related stats:


```
telnet 127.0.0.1 11211
stats proxy
```

Alternatively:


```
echo "stats proxy" | nc HOST 11211
```

The above will provide statistics about the moxi proxy itself, not from asking
the Couchbase servers for cluster-wide statistics.

The proxy-related stats can tell you information about the moxi process,
including:

 * how it's been configured

 * how many buckets it's handling

 * per-bucket statistics

 * number of connections, requests, errors, retries, etc.

The `stats proxy` output will looks like:


```
$ echo stats proxy | nc 127.0.0.1 11211
STAT basic:version 1.6.1rc1
STAT basic:nthreads 5
STAT basic:hostname stevenmb.local
STAT memcached:settings:maxbytes 67108864
STAT memcached:settings:maxconns 1024
STAT memcached:settings:tcpport 0
....
STAT 11211:[ <NULL_BUCKET> ]:pstd_stats:tot_upstream_paused 0
STAT 11211:[ <NULL_BUCKET> ]:pstd_stats:tot_upstream_unpaused 0
STAT 11211:[ <NULL_BUCKET> ]:pstd_stats:err_oom 0
STAT 11211:[ <NULL_BUCKET> ]:pstd_stats:err_upstream_write_prep 0
STAT 11211:[ <NULL_BUCKET> ]:pstd_stats:err_downstream_write_prep 0 END
```

Let's walk through each section.

<a id="moxi-statistics-basic-info"></a>

### Basic Information

Here, we can tell that moxi has been configured with 4 worker threads plus the
main listener thread. 4 + 1 == 5 "nthreads"


```
STAT basic:version 1.6.1rc1
STAT basic:nthreads 5
STAT basic:hostname stevenmb.local
```

<a id="moxi-statistics-basic-inherited"></a>

### Memcached Inherited Settings And Statistics

Next, moxi emits many statistics and settings that it inherits from its
memcached codebase. (moxi was based on the memcached codebase, inheriting a lot
of asynchronous, high-performance C-based connection and networking machinery.)

Of note, the "memcached:settings" are changable through moxi's command-line
flags. You can use "moxi -h" to learn more about moxi's command-line flags.

In particular, the "maxconns" (-c command-line flag) may be a limit that your
moxi might reach, if you have many clients connecting to the same moxi and/or
have a large cluster (many Couchbase servers). Look for the
"listen\_disabled\_num" (in a later section) to grow rapidly in this situation.

And, we can see that moxi's been running only a short time ("uptime" of 11
seconds), is running the 64-bit version ("pointer\_size"), and does not have
many open connections ("curr\_connections", which counts both client connections
into moxi and also moxi's connections to downstream Couchbase servers).


```
STAT memcached:settings:maxbytes 67108864
STAT memcached:settings:maxconns 1024
STAT memcached:settings:tcpport 0
STAT memcached:settings:udpport -2
STAT memcached:settings:inter NULL
STAT memcached:settings:verbosity 0
STAT memcached:settings:oldest 0
STAT memcached:settings:evictions on
STAT memcached:settings:domain_socket NULL
STAT memcached:settings:umask 700
STAT memcached:settings:growth_factor 1.25
STAT memcached:settings:chunk_size 48
STAT memcached:settings:num_threads 5
STAT memcached:settings:stat_key_prefix :
STAT memcached:settings:detail_enabled no
STAT memcached:settings:reqs_per_event 20
STAT memcached:settings:cas_enabled yes
STAT memcached:settings:tcp_backlog 1024
STAT memcached:settings:binding_protocol auto-negotiate
STAT memcached:stats:pid 691
STAT memcached:stats:uptime 11
STAT memcached:stats:time 1288649197
STAT memcached:stats:version 1.6.1rc1
STAT memcached:stats:pointer_size 64
STAT memcached:stats:rusage_user 0.015575
STAT memcached:stats:rusage_system 0.005112
STAT memcached:stats:curr_connections 4
STAT memcached:stats:total_connections 5
STAT memcached:stats:connection_structures 5
STAT memcached:stats:cmd_get 0
STAT memcached:stats:cmd_set 0
STAT memcached:stats:cmd_flush 0
STAT memcached:stats:get_hits 0
STAT memcached:stats:get_misses 0
STAT memcached:stats:delete_misses 0
STAT memcached:stats:delete_hits 0
STAT memcached:stats:incr_misses 0
STAT memcached:stats:incr_hits 0
STAT memcached:stats:decr_misses 0
STAT memcached:stats:decr_hits 0
STAT memcached:stats:cas_misses 0
STAT memcached:stats:cas_hits 0
STAT memcached:stats:cas_badval 0
STAT memcached:stats:bytes_read 24
STAT memcached:stats:bytes_written 0
STAT memcached:stats:limit_maxbytes 67108864
STAT memcached:stats:accepting_conns 1
STAT memcached:stats:listen_disabled_num 0
STAT memcached:stats:threads 5
STAT memcached:stats:conn_yields 0
```

<a id="moxi-statistics-moxi-specific"></a>

### Moxi-Specific Global Settings

Next, moxi emits many moxi-specific configuration values. The word "behavior" is
a synonym here for configuration (and turns out to be an easy target for
grep'ing). Of note, we can see that moxi concurrency setting ("downstream\_max")
is the default value of 4, and timeouts have been configured (by default) to off
("cycle", "wait\_queue\_timeout", and "downstream\_timeout" are 0).

Additionally, the front\_cache and key\_stats features are configured off (the
default), via the "front\_cache\_lifespan" and "key\_stats\_lifespace" of 0.
And, moxi has received two dynamic reconfiguration events so far
("stat\_configs" is 2).


```
STAT proxy_main:conf_type dynamic
STAT proxy_main:behavior:cycle 0
STAT proxy_main:behavior:downstream_max 4
STAT proxy_main:behavior:downstream_conn_max 0
STAT proxy_main:behavior:downstream_weight 0
STAT proxy_main:behavior:downstream_retry 1
STAT proxy_main:behavior:downstream_protocol 8
STAT proxy_main:behavior:downstream_timeout 0
STAT proxy_main:behavior:wait_queue_timeout 0
STAT proxy_main:behavior:time_stats 0
STAT proxy_main:behavior:connect_max_errors 0
STAT proxy_main:behavior:connect_retry_interval 0
STAT proxy_main:behavior:front_cache_max 200
STAT proxy_main:behavior:front_cache_lifespan 0
STAT proxy_main:behavior:front_cache_spec
STAT proxy_main:behavior:front_cache_unspec
STAT proxy_main:behavior:key_stats_max 4000
STAT proxy_main:behavior:key_stats_lifespan 0
STAT proxy_main:behavior:key_stats_spec
STAT proxy_main:behavior:key_stats_unspec
STAT proxy_main:behavior:optimize_set
STAT proxy_main:behavior:usr Administrator
STAT proxy_main:behavior:host
STAT proxy_main:behavior:port 0
STAT proxy_main:behavior:bucket
STAT proxy_main:behavior:port_listen 11211
STAT proxy_main:behavior:default_bucket_name default
STAT proxy_main:stats:stat_configs 2
STAT proxy_main:stats:stat_config_fails 0
STAT proxy_main:stats:stat_proxy_starts 2
STAT proxy_main:stats:stat_proxy_start_fails 0
STAT proxy_main:stats:stat_proxy_existings 1
STAT proxy_main:stats:stat_proxy_shutdowns 0
```

<a id="moxi-statistics-perbucket"></a>

### Per-Bucket Statistics

Next, we see moxi emits settings and statistics about its buckets. The first
bucket in this example is the "default" bucket, available on port 11211.

We can see that the "default" bucket in moxi inherits the same behavior settings
from the global configuration settings (the same "behavior" values as above).


```
STAT 11211:default:info:port 11211
STAT 11211:default:info:name default
STAT 11211:default:info:config { "name": "default", "nodeLocator": "vbucket", "saslPassword": "", "
nodes": [{ "clusterMembership": "active", "status": "healthy"}],
STAT 11211:default:info:config_ver 2
STAT 11211:default:info:behaviors_num 1
STAT 11211:default:behavior:downstream_max 4
STAT 11211:default:behavior:downstream_conn_max 0
STAT 11211:default:behavior:downstream_weight 0
STAT 11211:default:behavior:downstream_retry 1
STAT 11211:default:behavior:downstream_protocol 8
STAT 11211:default:behavior:downstream_timeout 0
STAT 11211:default:behavior:wait_queue_timeout 0
STAT 11211:default:behavior:time_stats 0
STAT 11211:default:behavior:connect_max_errors 0
STAT 11211:default:behavior:connect_retry_interval 0
STAT 11211:default:behavior:front_cache_max 200
STAT 11211:default:behavior:front_cache_lifespan 0
STAT 11211:default:behavior:front_cache_spec
STAT 11211:default:behavior:front_cache_unspec
STAT 11211:default:behavior:key_stats_max 4000
STAT 11211:default:behavior:key_stats_lifespan 0
STAT 11211:default:behavior:key_stats_spec
STAT 11211:default:behavior:key_stats_unspec
STAT 11211:default:behavior:optimize_set
STAT 11211:default:behavior:usr default
STAT 11211:default:behavior:host
STAT 11211:default:behavior:port 0
STAT 11211:default:behavior:bucket
STAT 11211:default:behavior:port_listen 11211
STAT 11211:default:behavior:default_bucket_name default
```

<a id="moxi-statistics-perbucket-server"></a>

### Per-Bucket Server-List Settings

Next, in keys that follow a naming pattern of PORT:BUCKET\_NAME:behavior-X, we
can see the "server list" that moxi associates with a bucket. We can see that
moxi knows of only 1 server (X == 0) for the "default" bucket:


```
STAT 11211:default:behavior-0:downstream_weight 0
STAT 11211:default:behavior-0:downstream_retry 1
STAT 11211:default:behavior-0:downstream_protocol 8
STAT 11211:default:behavior-0:downstream_timeout 0
STAT 11211:default:behavior-0:usr default
STAT 11211:default:behavior-0:host 127.0.0.1
STAT 11211:default:behavior-0:port 11210
STAT 11211:default:behavior-0:bucket
```

<a id="moxi-statistics-perbucket-counters"></a>

### Per-Bucket Statistics (Counters)

Next, we can see the active counters that moxi tracks on a per-bucket basis.
First, we can see that nothing's happened to the frontcache counters
(unsurprisingly, as the frontcache feature has been configured off):


```
STAT 11211:default:stats:listening 2
STAT 11211:default:stats:listening_failed 0
STAT 11211:default:frontcache:max 0
STAT 11211:default:frontcache:oldest_live 0
STAT 11211:default:frontcache:tot_get_hits 0
STAT 11211:default:frontcache:tot_get_expires 0
STAT 11211:default:frontcache:tot_get_misses 0
STAT 11211:default:frontcache:tot_get_bytes 0
STAT 11211:default:frontcache:tot_adds 0
STAT 11211:default:frontcache:tot_add_skips 0
STAT 11211:default:frontcache:tot_add_fails 0
STAT 11211:default:frontcache:tot_add_bytes 0
STAT 11211:default:frontcache:tot_deletes 0
STAT 11211:default:frontcache:tot_evictions 0
```

Then, we can see more interesting and useful per-bucket statistics.

In general, counters named num\_xxx are active counters (they increase and
decrease). And, tot\_xxx are counters that only increase (until there's a "stats
proxy reset" command).

Below, "upstream" refers to client-side statistics (from your application). And
"downstream" refers to Couchbase server-side statistics.

Of note, moxi acquires downstream connections from a connection pool, assigns
them to upstream clients, and releases the downstream connections back into the
connection when the upstream client has finished a request/response, if there
were no errors (in which case moxi might close the downstream connection rather
than releasing it back into the connection pool). Because of this, you'll see
that "tot\_downstream\_conn\_acquired" will often grow (hopefully, only
slightly) faster than "tot\_downstream\_conn\_released".


```
STAT 11211:default:pstd_stats:num_upstream 1
STAT 11211:default:pstd_stats:tot_upstream 1
STAT 11211:default:pstd_stats:num_downstream_conn 0
STAT 11211:default:pstd_stats:tot_downstream_conn 0
STAT 11211:default:pstd_stats:tot_downstream_conn_acquired 0
STAT 11211:default:pstd_stats:tot_downstream_conn_released 0
STAT 11211:default:pstd_stats:tot_downstream_released 0
STAT 11211:default:pstd_stats:tot_downstream_reserved 0
STAT 11211:default:pstd_stats:tot_downstream_reserved_time 0
STAT 11211:default:pstd_stats:max_downstream_reserved_time 0
STAT 11211:default:pstd_stats:tot_downstream_freed 0
STAT 11211:default:pstd_stats:tot_downstream_quit_server 0
STAT 11211:default:pstd_stats:tot_downstream_max_reached 0
STAT 11211:default:pstd_stats:tot_downstream_create_failed 0
STAT 11211:default:pstd_stats:tot_downstream_connect 0
STAT 11211:default:pstd_stats:tot_downstream_connect_failed 0
STAT 11211:default:pstd_stats:tot_downstream_connect_timeout 0
STAT 11211:default:pstd_stats:tot_downstream_connect_interval 0
STAT 11211:default:pstd_stats:tot_downstream_connect_max_reached 0
STAT 11211:default:pstd_stats:tot_downstream_waiting_errors 0
STAT 11211:default:pstd_stats:tot_downstream_auth 0
STAT 11211:default:pstd_stats:tot_downstream_auth_failed 0
STAT 11211:default:pstd_stats:tot_downstream_bucket 0
STAT 11211:default:pstd_stats:tot_downstream_bucket_failed 0
STAT 11211:default:pstd_stats:tot_downstream_propagate_failed 0
STAT 11211:default:pstd_stats:tot_downstream_close_on_upstream_close 0
STAT 11211:default:pstd_stats:tot_downstream_timeout 0
STAT 11211:default:pstd_stats:tot_wait_queue_timeout 0
STAT 11211:default:pstd_stats:tot_assign_downstream 0
STAT 11211:default:pstd_stats:tot_assign_upstream 0
STAT 11211:default:pstd_stats:tot_assign_recursion 0
STAT 11211:default:pstd_stats:tot_reset_upstream_avail 0
STAT 11211:default:pstd_stats:tot_multiget_keys 0
STAT 11211:default:pstd_stats:tot_multiget_keys_dedupe 0
STAT 11211:default:pstd_stats:tot_multiget_bytes_dedupe 0
STAT 11211:default:pstd_stats:tot_optimize_sets 0
STAT 11211:default:pstd_stats:tot_optimize_self 0
STAT 11211:default:pstd_stats:tot_retry 0
STAT 11211:default:pstd_stats:tot_retry_time 0
STAT 11211:default:pstd_stats:max_retry_time 0
STAT 11211:default:pstd_stats:tot_retry_vbucket 0
STAT 11211:default:pstd_stats:tot_upstream_paused 0
STAT 11211:default:pstd_stats:tot_upstream_unpaused 0
STAT 11211:default:pstd_stats:err_oom 0
STAT 11211:default:pstd_stats:err_upstream_write_prep 0
STAT 11211:default:pstd_stats:err_downstream_write_prep 0
```

Of note in the previous section, if "tot\_upstream\_paused" grows much greater
than "tot\_upstream\_unpaused", that means that client connections are stuck in
a "paused" state, awaiting some event that wakes them up (such as moxi receiving
a response from a Couchbase server or a reserved/assigned downstream connection
getting closed).

<a id="moxi-statistics-nullbucket"></a>

### NULL_BUCKET Statistics

The NULL\_BUCKET also has its own section of emitted moxi statistics. If you see
a NULL\_BUCKET in your "stats proxy" output, it's because you're talking to a
moxi that's been started (via command-line arguments) as a "gateway moxi". In
this situation, when a client first connects, it is assigned to this "/dev/null"
bucket. The client then can do a SASL authentication to be associated with a
non-null bucket.

<a id="moxi-statistics-timing-histograms"></a>

## Timing Histograms

If you start moxi with the -Z time\_stats=1 flag:


```
./moxi -Z time_stats=1,port_listen=11511 http://HOST:8080/pools/default/bucketsStreaming/default
```

Then you can get histogram output from moxi:


```
telnet 127.0.0.1 11511
stats proxy timings
```

When time\_stats=1, moxi will call gettimeofday() system call before and after
each request. And, per-bucket, it introduces into moxi a relatively small
constant amount of memory to track the histogram bins. By default time\_stats is
0 (or disabled).

For example:


```
$ echo "stats proxy timings" | nc 127.0.0.1 11511
STAT 11511:default:connect 0+100=1 25.00% ********
STAT 11511:default:connect 100+100=3 100.00% ************************
STAT 11511:default:connect 200+100=0 100.00%
STAT 11511:default:reserved 0+100 =97624 86.18% ************************
STAT 11511:default:reserved 100+100 =15414 99.79% ***
STAT 11511:default:reserved 200+100 =134 99.90%
STAT 11511:default:reserved 300+100 =29 99.93%
STAT 11511:default:reserved 400+100 =21 99.95%
STAT 11511:default:reserved 500+100 =10 99.96%
STAT 11511:default:reserved 600+100 =14 99.97%
STAT 11511:default:reserved 700+100 =10 99.98%
STAT 11511:default:reserved 800+100 =9 99.99%
STAT 11511:default:reserved 900+100 =3 99.99%
STAT 11511:default:reserved 1000+100 =2 99.99%
STAT 11511:default:reserved 1100+100 =3 99.99%
STAT 11511:default:reserved 1200+100 =1 99.99%
STAT 11511:default:reserved 1300+100 =1 99.99%
STAT 11511:default:reserved 1400+100 =0 99.99%
STAT 11511:default:reserved 1500+100 =0 99.99%
STAT 11511:default:reserved 1600+100 =0 99.99%
STAT 11511:default:reserved 1700+100 =0 99.99%
STAT 11511:default:reserved 1800+100 =0 99.99%
STAT 11511:default:reserved 1900+100 =0 99.99%
STAT 11511:default:reserved 2000+100 =0 99.99%
STAT 11511:default:reserved 2100+200 =0 99.99%
STAT 11511:default:reserved 2300+400 =0 99.99%
STAT 11511:default:reserved 2700+800 =0 99.99%
STAT 11511:default:reserved 3500+1600=4 100.00%
STAT 11511:default:reserved 5100+3200=2 100.00%
STAT 11511:default:reserved 8300+6400=0 100.00%
END
```

 * * There are two parts to the histogram:

   * connect -- time spent in a connect

 * reserved -- time spent with a downstream fully reserved (or assigned) to an
   upstream connection. To read it, a line looks like:

 * STAT...:reserved bucket\_start\_usec+bucket\_width\_usec =count
   cummulative\_percentile asterisk\_graph For example:


```
STAT 11511:default:reserved 0+100 =97624 86.18% ************************
STAT 11511:default:reserved 100+100 =15414 99.79% ***
STAT 11511:default:reserved 200+100 =134 99.90%
```

And that means that:

97,624 requests fell into the 0-to-100 usec bucket, which was 86.18% of all
requests.

15,414 requests fell into the 100-to-200 usec bucket, and 99.79% of requests
were faster than 200 usecs.

134 requests fell into the 200-to-300 usec bucket, and 99.90% of requests were
faster than 300 usecs.

Note that the histogram bucket (or bin) widths start out constant; but, the
bucket widths start doubling towards the end with the longer timings.

<a id="moxi-statistics-proxy-config"></a>

## Proxy Configuration

Recent builds of moxi (> 1.6.1) support a "stats proxy config" command, which
can show you the exact configuration REST/JSON that moxi is using.

For example, if moxi was started with ketama hashing:


```
$ ./dev/moxi/moxi -z 11211=127.0.0.1:11411,127.0.0.1:11511
```

Then "stats proxy config" would return:


```
$ echo stats proxy config | nc 127.0.0.1 11211
STAT 11211:default:config 127.0.0.1:11411,127.0.0.1:11511
END
```

If moxi was started with Coucbase REST/URL/JSON, then you'll see JSON:


```
$ echo stats proxy config | nc 127.0.0.1 11211
STAT 11211:default:config {
"name": "default",
"nodeLocator": "vbucket",
"saslPassword": "",
...clipped...
}
STAT 11211:[ <NULL_BUCKET> ]:config
END
```

<a id="moxi-statistics-proxy-resetting"></a>

## Resetting Moxi Proxy Stats

Moxi's `stats proxy` counters are all kept in moxi memory only. Restarting moxi
reset those stats. To dynamically reset moxi's `stats proxy` counters, send an
ASCII request of:


```
stats proxy reset
```

Only the stats counters that make sense for reset will be zero'ed – for example,
usually the `tot_XXXX` counters that normally only climb upwards.

For example:


```
get a
VALUE a 0 1
1
END

stats proxy timings
STAT 11211:default:connect 5100+3200=1 100.00% ************************
STAT 11211:default:connect 8300+6400=0 100.00%
STAT 11211:default:reserved 1200+100 =1  50.00% ************************
STAT 11211:default:reserved 1300+100 =0  50.00%
STAT 11211:default:reserved 1400+100 =0  50.00%
STAT 11211:default:reserved 1500+100 =0  50.00%
STAT 11211:default:reserved 1600+100 =0  50.00%
STAT 11211:default:reserved 1700+100 =0  50.00%
STAT 11211:default:reserved 1800+100 =0  50.00%
STAT 11211:default:reserved 1900+100 =0  50.00%
STAT 11211:default:reserved 2000+100 =0  50.00%
STAT 11211:default:reserved 2100+200 =0  50.00%
STAT 11211:default:reserved 2300+400 =0  50.00%
STAT 11211:default:reserved 2700+800 =0  50.00%
STAT 11211:default:reserved 3500+1600=1 100.00% ************************
STAT 11211:default:reserved 5100+3200=0 100.00%
END

stats proxy reset
OK

stats proxy timings
END

get a
VALUE a 0 1
1
END

stats proxy timings
STAT 11211:default:reserved 300+100=1 100.00% ************************
STAT 11211:default:reserved 400+100=0 100.00%
END
```

<a id="moxi-errors"></a>
