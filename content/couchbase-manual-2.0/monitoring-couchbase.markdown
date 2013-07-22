# Monitoring Couchbase

There are a number of different ways in which you can monitor Couchbase. You
should be aware however of some of the basic issues that you will need to know
before starting your monitoring procedure.

<a id="couchbase-underlying-processes"></a>

## Underlying Server Processes

There are several different server processes that constantly run in Couchbase
Server whether or not the server is actively handling reads/writes or handling
other operations from a client application. Right after you start up a node, you
may notice a spike in CPU utilization, and the utilization rate will plateau at
some level greater than zero. The following describes the ongoing processes that
are running on your node:

 * **erl.exe** : This process is specific to Windows and is handles operations.

 * **beam.smp** : This will index items, handle ongoing XDCR replications, and
   manage cluster operations.

 * **memcached** : This process is responsible for caching items in RAM and
   persisting them to disk.

<a id="couchbase-monitoring-ports"></a>

## Port numbers and accessing different buckets

In a Couchbase Server cluster, any communication (stats or data) to a port
*other* than 11210 will result in the request going through a Moxi process. This
means that any stats request will be aggregated across the cluster (and may
produce some inconsistencies or confusion when looking at stats that are not
"aggregatable").

In general, it is best to run all your stat commands against port 11210 which
will always give you the information for the specific node that you are sending
the request to. It is a best practice to then aggregate the relevant data across
nodes at a higher level (in your own script or monitoring system).

When you run the below commands (and all stats commands) without supplying a
bucket name and/or password, they will return results for the default bucket and
produce an error if one does not exist.

To access a bucket other than the default, you will need to supply the bucket
name and/or password on the end of the command. Any bucket created on a
dedicated port does not require a password.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="couchbase-monitoring-startup"></a>

## Monitoring startup (warmup)

If a Couchbase Server node is starting up for the first time, it will create
whatever DB files necessary and begin serving data immediately. However, if
there is already data on disk (likely because the node rebooted or the service
restarted) the node needs to read all of this data off of disk before it can
begin serving data. This is called "warmup". Depending on the size of data, this
can take some time.

When starting up a node, there are a few statistics to monitor. Use the
`cbstats` command to watch the warmup and item stats:


```
shell> cbstats localhost:11210 all | »
    egrep "warm|curr_items"
```

<a id="table-couchbase-monitoring-startup"></a>

curr\_items:        | 0      
--------------------|--------
curr\_items\_tot:   | 15687  
ep\_warmed\_up:     | 15687  
ep\_warmup:         | false  
ep\_warmup\_dups:   | 0      
ep\_warmup\_oom:    | 0      
ep\_warmup\_thread: | running
ep\_warmup\_time:   | 787    

And when it is complete:


```
shell> cbstats localhost:11210 all | »
    egrep "warm|curr_items"
```

<a id="table-couchbase-monitoring-startup-update"></a>

curr\_items:        | 10000   
--------------------|---------
curr\_items\_tot:   | 20000   
ep\_warmed\_up:     | 20000   
ep\_warmup:         | true    
ep\_warmup\_dups:   | 0       
ep\_warmup\_oom:    | 0       
ep\_warmup\_thread: | complete
ep\_warmup\_time    | 1400    

<a id="table-couchbase-monitoring-startup-stats"></a>

Stat               | Description                                                                                                                                         
-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------
curr\_items        | The number of items currently active on this node. During warmup, this will be 0 until complete                                                     
curr\_items\_tot   | The total number of items this node knows about (active and replica). During warmup, this will be increasing and should match ep\_warmed\_up        
ep\_warmed\_up     | The number of items retrieved from disk. During warmup, this should be increasing.                                                                  
ep\_warmup\_dups   | The number of duplicate items found on disk. Ideally should be 0, but a few is not a problem                                                        
ep\_warmup\_oom    | How many times the warmup process received an Out of Memory response from the server while loading data into RAM                                    
ep\_warmup\_thread | The status of the warmup thread. Can be either running or complete                                                                                  
ep\_warmup\_time   | How long the warmup thread was running for. During warmup this number should be increasing, when complete it will tell you how long the process took

<a id="couchbase-monitoring-diskwritequeue"></a>

## Disk Write Queue

Couchbase Server is a persistent database which means that part of monitoring
the system is understanding how we interact with the disk subsystem.

Since Couchbase Server is an asynchronous system, any mutation operation is
committed first to DRAM and then queued to be written to disk. The client is
returned an acknowledgement almost immediately so that it can continue working.
There is replication involved here too, but we're ignoring it for the purposes
of this discussion.

We have implemented disk writing as a 2-queue system and they are tracked by the
stats. The first queue is where mutations are immediately placed. Whenever there
are items in that queue, our "flusher" (disk writer) comes along and takes all
the items off of that queue, places them into the other one and begins writing
to disk. Since disk performance is so dramatically different than RAM, this
allows us to continue accepting new writes while we are (possibly slowly)
writing new ones to the disk.

The flusher will process 250k items a a time, then perform a disk commit and
continue this cycle until its queue is drained. When it has completed everything
in its queue, it will either grab the next group from the first queue or
essentially sleep until there are more items to write.

<a id="couchbase-monitoring-diskwritequeue-monitoring"></a>

### Monitoring the Disk Write Queue

There are basically two ways to monitor the disk queue, at a high-level from the
Web UI or at a low-level from the individual node statistics.

From the Web UI, click on Monitor Data Buckets and select the particular bucket
that you want to monitor. Click "Configure View" in the top right corner and
select the "Disk Write Queue" statistic. Closing this window will show that
there is a new mini-graph. This graph is showing the Disk Write Queue for all
nodes in the cluster. To get a deeper view into this statistic, you can monitor
each node individually using the 'stats' output (see [Viewing Server
Nodes](couchbase-manual-ready.html#couchbase-admin-web-console-server-nodes) for
more information about gathering node-level stats). There are two statistics to
watch here:

ep\_queue\_size (where new mutations are placed) flusher\_todo (the queue of
items currently being written to disk)

[SeeThe
Dispatcher](couchbase-manual-ready.html#couchbase-monitoring-nodestats-dispatcher)
for more information about monitoring what the disk subsystem is doing at any
given time.

<a id="couchbase-monitoring-stats"></a>

## Couchbase Server Statistics

Couchbase Server provides statistics at multiple levels throughout the cluster.
These are used for regular monitoring, capacity planning and to identify the
performance characteristics of your cluster deployment. The most visible
statistics are those in the Web UI, but components such as the REST interface,
the proxy and individual nodes have directly accessible statistics interfaces.

<a id="couchbase-monitoring-stats-rest"></a>

### REST Interface Statistics

[The easiest to use interface into the statistics provided by REST is to use the
[Using the Web
Console](couchbase-manual-ready.html#couchbase-admin-web-console). This GUI
gathers statistics via REST and displays them to your browser. The REST
interface has a set of resources that provide access to the current and historic
statistics the cluster gathers and stores. See theREST
documentation](couchbase-manual-ready.html#couchbase-admin-restapi) for more
information.

<a id="couchbase-monitoring-nodestats"></a>

### Couchbase Server Node Statistics

[Detailed stats
documentation](http://github.com/membase/ep-engine/blob/master/docs/stats.org)
can be found in the repository.

[Along with stats at the REST and UI level, individual nodes can also be queried
for statistics either through a client which uses binary protocol or through
thecbstats utility](couchbase-manual-ready.html#couchbase-admin-cmdline-cbstats)
shipped with Couchbase Server.

For example:


```
shell> cbstats localhost:11210 all
 auth_cmds:                   9
 auth_errors:                 0
 bucket_conns:                10
 bytes_read:                  246378222
 bytes_written:               289715944
 cas_badval:                  0
 cas_hits:                    0
 cas_misses:                  0
 cmd_flush:                   0
 cmd_get:                     134250
 cmd_set:                     115750
…
```

The most commonly needed statistics are surfaced through the Web Console and
have descriptions there and in the associated documentation. Software developers
and system administrators wanting lower level information have it available
through the stats interface.

There are seven commands available through the stats interface:

 * `stats` (referred to as 'all')

 * `dispatcher`

 * `hash`

 * `tap`

 * `timings`

 * `vkey`

 * `reset`

<a id="couchbase-monitoring-nodestats-stats"></a>

### stats Command

This displays a large list of statistics related to the Couchbase process
including the underlying engine (ep\_\* stats).

<a id="couchbase-monitoring-nodestats-dispatcher"></a>

### dispatcher Command

This statistic will show what the dispatcher is currently doing:


```
dispatcher
     runtime: 45ms
       state: dispatcher_running
      status: running
        task: Running a flusher loop.
nio_dispatcher
       state: dispatcher_running
      status: idle
```

The first entry, dispatcher, monitors the process responsible for disk access.
The second entry is a non-IO (non disk) dispatcher. There may also be a
ro\_dispatcher dispatcher present if the engine is allowing concurrent reads and
writes. When a task is actually running on a given dispatcher, the "runtime"
tells you how long the current task has been running. Newer versions will show
you a log of recently run dispatcher jobs so you can see what's been happening.

<a id="couchbase-monitoring-moxistats"></a>

## Couchbase Server Moxi Statistics

Moxi, as part of it's support of memcached protocol, has support for the
memcached `stats` command. Regular memcached clients can request statistics
through the memcached stats command. The stats command accepts optional
arguments, and in the case of Moxi, there is a stats proxy sub-command. A
detailed description of statistics available through Moxi can be found
[here](http://www.couchbase.com/docs/moxi-manual-1.7/index.html).

For example, one simple client one may use is the commonly available netcat
(output elided with ellipses):


```
$ echo "stats proxy" | nc localhost 11211
STAT basic:version 1.6.0
STAT basic:nthreads 5
…
STAT proxy_main:conf_type dynamic
STAT proxy_main:behavior:cycle 0
STAT proxy_main:behavior:downstream_max 4
STAT proxy_main:behavior:downstream_conn_max 0
STAT proxy_main:behavior:downstream_weight 0
…
STAT proxy_main:stats:stat_configs 1
STAT proxy_main:stats:stat_config_fails 0
STAT proxy_main:stats:stat_proxy_starts 2
STAT proxy_main:stats:stat_proxy_start_fails 0
STAT proxy_main:stats:stat_proxy_existings 0
STAT proxy_main:stats:stat_proxy_shutdowns 0
STAT 11211:default:info:port 11211
STAT 11211:default:info:name default
…
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
STAT 11211:default:behavior:key_stats_max
STAT 11211:default:behavior:key_stats_lifespan 0
STAT 11211:default:behavior:key_stats_spec
STAT 11211:default:behavior:key_stats_unspec
STAT 11211:default:behavior:optimize_set
STAT 11211:default:behavior:usr default
…
STAT 11211:default:pstd_stats:num_upstream 1
STAT 11211:default:pstd_stats:tot_upstream 2
STAT 11211:default:pstd_stats:num_downstream_conn 1
STAT 11211:default:pstd_stats:tot_downstream_conn 1
STAT 11211:default:pstd_stats:tot_downstream_conn_acquired 1
STAT 11211:default:pstd_stats:tot_downstream_conn_released 1
STAT 11211:default:pstd_stats:tot_downstream_released 2
STAT 11211:default:pstd_stats:tot_downstream_reserved 1
STAT 11211:default:pstd_stats:tot_downstream_reserved_time 0
STAT 11211:default:pstd_stats:max_downstream_reserved_time 0
STAT 11211:default:pstd_stats:tot_downstream_freed 0
STAT 11211:default:pstd_stats:tot_downstream_quit_server 0
STAT 11211:default:pstd_stats:tot_downstream_max_reached 0
STAT 11211:default:pstd_stats:tot_downstream_create_failed 0
STAT 11211:default:pstd_stats:tot_downstream_connect 1
STAT 11211:default:pstd_stats:tot_downstream_connect_failed 0
STAT 11211:default:pstd_stats:tot_downstream_connect_timeout 0
STAT 11211:default:pstd_stats:tot_downstream_connect_interval 0
STAT 11211:default:pstd_stats:tot_downstream_connect_max_reached 0
…
END
```

<a id="couchbase-troubleshooting"></a>
