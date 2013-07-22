# Moxi Design Internals

moxi was started around Q1 2009 based off the memcached code base. It's current
source repository is a
[http://github.com/couchbase/moxi](http://github.com/membase/moxi).

Moxi inherited a lot of machinery from memcached, including:

 * Networking and connection management

 * Thread management

 * Protocol parsing

 * Startup components

 * Build environment

From the point of view of moxi's codebase:

 * upstream -- the client application, or the source of requests

 * downstream -- the memcached/membase servers which are the destination for
   requests

Moxi code also uses the word "pool" in a way that predates our modern usage of
"cluster", so they are somewhat synonyms.

<a id="moxi-internals-guidingideas"></a>

## Guiding Ideas

Originally, a rule was to keep changes from any "memcached heritage" files to a
minimum.

 * The motivation was so that moxi could keep up with memcached, allowing us to
   easily merge in any improvements from memcached into moxi.

 * This is why much of moxi lives in files separate from memcached's files
   (cproxy\_.c/.h)

 * Nowadays, that rule is very much relaxed. We'll probably never get easy merges
   from memcached into moxi (or vice versa).

   As much as possible, moxi tries to avoid locks, even though it is
   multi-threaded, especially in the key/item request proxying codepaths.

Moxi can be considered a store and forward proxy. So, the high level "main loop"
in `moxi` worker threads in moxi wait for i/o activity, via libevent (a
higher-level library above epoll/poll/kpoll/select). Some of the i/o events
include:

 * If a client has sent a request, a worker thread wakes up, reads in the client's
   request fully, and queues each request in memory.

 * If a downstream cluster resource becomes available, moxi assigns a waiting
   request off the queue, makes routing decisions (ketama or libvbucket), and
   writes the request to the appropriate downstream server(s).

 * If a downstream server has sent a response, a worker thread wakes up, reads in
   the server's response fully, and asynchronously writes the response back to the
   waiting client. After all responses are fully written, the client connection is
   then available for more input request reading.

<a id="moxi-internals-keydependencies"></a>

## Key Dependencies

As with memcached, moxi depends on libevent and pthreads.

In addition, moxi has an abstraction layer called mcs where different hashing
libraries can be hooked in:

 * libvbucket

 * libmemcached

Moxi also depends on the libconflate library, for dynamic, late-binding network
based configuration (and re-configuration).

<a id="moxi-internals-keyfiles"></a>

## Key Modules / Files

To a large degree, moxi's modules map to the corresponding component files:

 * agent\_\* - integration with libconflate for dynamic reconfiguration

 * mcs - abstraction API over libvbucket and libmemcached

 * cproxy\_config - API for configuration data structures

 * cproxy\_front - the "front caching" feature of moxi

 * cproxy\_multiget - support for multigets and optimizations (de-duplicating keys,
   de-mux'ing responses, etc)

 * cproxy\_protocol\_\* - protocol translations

    * a - stands for ascii

    * b - stands for binary

    * the files include:

 * cproxy\_protocol\_a - parses and processes ascii client messages

 * cproxy\_protocol\_a2a

 * cproxy\_protocol\_a2b

 * cproxy\_protocol\_b - parses and processes binary client messages

 * cproxy\_protocol\_b2b

 * a2a, a2b, b2b stand for ascii-to-ascii, ascii-to-binary, and binary-to-binary
   respectively

 * or, more explicitly a2b stands for ascii-upstream to a binary-downstream

For completeness, here are some other files of lower-level functionality:

 * inherited from memcached:

    * memcached - main(argc,argv), cmd-line parsing, and connection state machine

    * thread - multithreading support

    * items - API for items

    * assoc - slabber aware hashtable

       * slabs - slabber allocator

       * [http://code.google.com/p/memcached/wiki/MemcachedSlabAllocator](http://code.google.com/p/memcached/wiki/MemcachedSlabAllocator)

    * cache - utility memory allocator

    * genhash - utility hash table

 * stdin\_check - feature to exit() when stdin closes, motivated by windows
   support.

 * other utility

    * htgram - histogram

    * matcher - simple string pattern matcher

    * util - other utility functions

    * work - multi-threaded work/message queues for communicating between threads

    * cJSON - json parsing library

<a id="moxi-internals-cmdline"></a>

## Command-Line Configuration

Moxi inherits command-line configuration parsing from memcached
(argc/argv/getopt), such as:

 * `-t NUM_THREADS`

 * `-vvv`

 * `-u USER`

 * `-c MAX_CONNS`

 * `-d (daemonize)`

The new parts of moxi configurability, however, belong with two new flags: -z
and -Z.

<a id="moxi-internals-cmdline-clusterspec"></a>

### Specifying a cluster

The -z flag specifies a cluster of membase or memcached servers. There a several
ways to specify a cluster using -z. For example:

 * ```
   -z 11211=MC_HOST1:MC_PORT1,MC_HOST2:MC_PORT2
   ```

   * This is a libmemcached-style of cluster specification, via a list of
     comma-separated HOST:PORT's.

   * Here, moxi will listen on port 11211.

 * ```
   -z 11211={ some libvbucket JSON config here }
   ```

   * This is useful for testing libvbucket-style cluster configuration.

   * Again, moxi will listen on port 11211.

 * ```
   -x url=http://HOST:8080/pools/default/bucketsStreaming/BUCKET_NAME
   ```

   * This specifies a REST URL where moxi can dynamically request a libvbucket-style
     cluster configuration.

The following, by the way, is an ease-of-use shortcut for specifying a `-z
url=URL` :


```
./moxi http://HOST:8080/pools/default/bucketsStreaming/BUCKET_NAME
```

<a id="moxi-internals-cmdline-optional"></a>

### Optional configuration parameters

The -Z flag specifies optional, comma-separated key-value configuration
parameters, called "proxy\_behavior"'s in the codebase. For example:


```
-Z downstream_max=8,time_stats=1,downstream_protocol=ascii
```

Here's some of the more useful -Z flags:


```
port_listen                 // IL: Default port to listen on.
cycle                       // IL: Clock resolution in millisecs.
downstream_max              // PL: Downstream concurrency per worker thread.
downstream_retry            // SL: How many times to retry a cmd, defaults to 1.
downstream_protocol         // SL: Favored downstream protocol, defaults to binary.
downstream_timeout          // SL: Millisecs.
wait_queue_timeout          // PL: Millisecs.
time_stats                  // IL: Capture timing stats (for histograms).

connect_max_errors          // IL: Pause when too many connect() errors.
connect_retry_interval      // IL: Time in millisecs before retrying
                            // when too many connect() errors, to not
                            // overwhelm the downstream servers.

front_cache_max             // PL: Max # of front cachable items.
front_cache_lifespan        // PL: In millisecs.
front_cache_spec            // PL: Matcher prefixes for front caching.
front_cache_unspec          // PL: Don't front cache prefixes.

key_stats_max               // PL: Max # of key stats entries.
key_stats_lifespan          // PL: In millisecs.
key_stats_spec              // PL: Matcher prefixes for key-level stats.
key_stats_unspec            // PL: Don't key stat prefixes.

optimize_set                // PL: Matcher prefixes for SET optimization.

usr                         // SL: User name for REST or SASL auth.
pwd                         // SL: Password for REST or SASL auth.
bucket                      // SL: Bucket name for bucket selection.

default_bucket_name         // ML: The named bucket (proxy->name)
                            // that upstream conn's should start on.
                            // When empty (""), then only binary SASL
                            // clients can actually do anything useful.
```

The IL/ML/PL/SL markers above in the -Z flags refer to a behavior inheritance
design in moxi. More information on how behavior/configuration values are
inherited at various levels in the system (initialization-level, pool-level,
server-level...) is available at:

[http://github.com/couchbase/moxi/blob/master/doc/moxi/configuration.org](http://github.com/couchbase/moxi/blob/master/doc/moxi/configuration.org)

<a id="moxi-internals-cmdline-configfiles"></a>

### Config Files

The -z and -Z flags can also be specified via config files, too:

 * -z./relative/path/to/z-config

 * -Z./relative/path/to/Z-config

 * -z /absolute/path/to/z-config

 * -Z /absolute/path/to/Z-config

For improved readability, moxi allows for whitespace in configuration files. For
example, a -Z config file may look like:


```
cycle          = 200,
downstream_max = 8,
time_stats     = 1
```

<a id="moxi-internals-cmdline-multicluster"></a>

### Multi-cluster configuration

Moxi also supports proxying to multiple clusters from a single moxi instance,
where this was originally designed and implemented for software-as-a-service
purposes. Use a semicolon (';') to specify and delimit more than one cluster:


```
-z
            "LISTEN_PORT=[CLUSTER_CONFIG][;LISTEN_PORT2=[CLUSTER_CONFIG2][]]"
```

For example:


```
-z "11211=mc1,mc2;11311=mcA,mcB,mcC"
```

Above, moxi will listen on port 11211, proxying to cluster mc1,mc2. And moxi
will also listen on port 11311, proxying to mcA,mcB,mcC. The multi-pool
codepaths are also overloaded and re-used to support multi-tenancy (multiple
buckets).

<a id="moxi-internals-cmdline-zstored"></a>

### Zstored inherited configuration

The terrific engineers at Zynga provided several enhancements to moxi, with some
cmd-line changes that don't fit into the -Z/-z world:


```
-O path/to/log/file
    -X (mcmux compatibility -- mcmux was a fork of moxi whose features
    have been merged back into moxi)
```

<a id="moxi-internals-threading"></a>

## Threading

If you know memcached threading, moxi's is very much the same.

Just like with memcached, there's a main thread, which is responsible for:

 * main(argc,argv) initialization and command-line parsing.

 * daemonizing.

 * spawning worker and ancilliary threads.

 * listen()'ing on (usually) one or more ports.

 * accept()'ing client connections, and delegating accepted upstream connections to
   worker threads.

The ancillary threads include:

 * libconflate thread - for dynamic (re-)configuration

   This thread is spawned by the libconflate library to make out-of-band REST or
   XMPP calls for configuration instructions.

 * stdin\_term\_handler - watches to see when stdin closes, for windows platform
   support.

 * hashtable reallocation thread - inherited from memcached.

Tere are also worker threads, which are assigned ownership of accepted upstream
connections my the main thread.

<a id="moxi-internals-threads-worker"></a>

### Worker Threads

The number of worker threads is configurable at startup and remains constant
afterwards for the life of the moxi process, based on the -t NUM\_THREADS
command-line parameter.

After a worker thread is assigned to "own" an upstream connection, that upstream
connection is now handled by just that one worker thread. Moxi takes advantage
of this design to allow it to avoid a lot of unnecessary locking, since there's
hardly any communication between worker threads.

<a id="moxi-internals-startup"></a>

## Startup Sequences

Moxi's startup codepaths are slightly different, depending if you have a static
configuration or a dynamic configuration. For example, you have a static
configuration (where moxi has all the complete info it needs to operate) if you
start moxi like:


```
./moxi -z 11211=memcached1,memcached2,memcached3
```

You have a dynamic configuration when moxi needs to gets a full configuration
from some remote system, and there might be delays. For example:


```
./moxi -z url=http://HOST:8080/pools/default/bucketsStreaming/default
```

Static Configuration Startup SequenceWhen moxi knows its listen ports and
cluster at start-time:

 1. The main thread parses cmd-line parameters.

 1. The main thread then creates one or more listening sockets.

 1. The main thread then spawns the specified number of worker threads.

 1. The main thread then goes into the libevent main event loop, awaiting
    connections from clients or other work tasks.

Dynamic Configuration Startup SequenceWhen moxi goes through dynamic
configuration:

 1. The main thread parses cmd-line parameters.

 1. The main thread then passes config info, such as URL's, to libconflate.

 1. The main thread then spawns the specified number of worker threads. (same as
    above)

 1. The main thread then goes into the libevent main event loop, awaiting
    connections from clients or other work tasks. (same as above)

Libconflate spawns a separate thread to make REST calls and process REST/JSON
configuration responses.

When the libconflate thread receives a proper REST/JSON configuration, it puts a
re-configuration work task on the main thread's work queue.

The work queue functionality is the main way that threads communicate between
each other in moxi.

<a id="moxi-internals-thread-communication"></a>

## Inter-Thread Communcation & Work Queues

The main thread and the worker threads each have their own work queues.

The work queue code is a generalization of code inherited from memcached. The
memcached code, which we'll call the connection assignment queue, is used when
the main thread wants to assign a new, accept()'ed upstream connection to a
worker thread. That connection assignment queue code still exists and is used in
moxi (it's not broken). However, the work queue code allows any work task to be
assigned to a different thread.

Work TasksA work task is a function pointer plus opaque callback data.

Work Queues & LibeventBoth the connection assignment queue code and the work
queue code integrate with libevent, and use the memcached-inspired trick of
writing one byte to a pipe, if necessary, in order to wakeup a target thread
that might be waiting for file-descriptor activity in libevent.

Asynchronous vs Synchronous Work TasksThe work queue facility is fundamentally
asynchronous, so it supports fire-and-forget work tasks.

The work queue code also has functions that support higher-level synchronous
work tasks between threads. That is, a calling thread can fire off a work task
at some target thread, do some other stuff, then wait (block) for the work task
to complete (when the target thread marks the task as complete).

Most communication between the libconflate thread and the main thread uses the
synchronous work task facility.

Scatter/Gather Work TasksThe work queue code also has functions that support
"broadcast" scatter/gather patterns. For example, the main thread can fire off
"statistics gathering" work tasks at each worker thread, and then wait/block
until there are responses from all worker threads.

Most communication between the main thread and worker threads uses the
scatter/gather facility.

<a id="moxi-internals-reconfig"></a>

## Re-configuration

In the dynamic configuration world, configuration, whether the first time or
whether a re-configuration, uses the work queues and the same code paths. That
is, the first time is just an edge case of re-configuration.

Configuration Lock Avoidance & VersioningAlso, to keep locking to a minimum,
each thread has its own copy of the configuration data structures and strings.
Each copy of the configuration is associated with a version number (called
"config\_ver"), to allow for faster comparisons. That is, it's fast to test that
configuration hasn't changed by just comparing numbers.

In the dynamic configuration world, it all starts with libconflate.

Integration with LibconflateLibconflate has its own, dedicated thread for making
HTTP/REST calls to retrieve a cluster configuration and processing JSON
responses. When the libconflate receives a proper REST response, it invokes moxi
callbacks (so the dynamic re-configuration callbacks are happening on
libconflate's dedicated thread).

Those moxi callbacks are implemented by the agent\_config.c file in moxi. The
agent\_config code next sends a synchronous work task (with the latest,
successfully parsed config info to moxi's main thread.

One JSON message has all bucketsNote that there may be more than one proxy
config in a single "re-configuration" work task. The reason is that each JSON
configuration message, for simplicity, includes all buckets, even if most of the
buckets haven't changed. For example, if there are 55 buckets, the JSON message
will have 55 bucket configuration details in it.

Later, if another bucket is added, for example, the next JSON reconfiguration
message will have 56 buckets in it (as opposed to just sending a delta).

This approach is wasteful on network bandwidth (during the infrequent
re-configuration episodes), but allows for code simplicity. In this simplicity,
the first-time pathway, re-configuration pathway, and approach to handling
restarts are all the same, since everything that moxi needs to operate will
appear in a single JSON message.

Main thread's list of proxiesThe main thread tracks a list of active proxies.
Each active proxy has a name, such as "default". In a multi-tenant deployment,
this proxy name is the same as a bucket name. During the re-configuration work
task, the main thread walks through its active proxies list and updates each
proxy data structure

appropriately. Also, new proxies are created and no longer unlisted proxies are
deleted, as necessary.

proxy vs proxy\_tdWhile the main thread is responsible for proxy data structures
(and the linked list of proxy structures), each worker thread has its own copy
or snapshot of this information (plus more thread-specific data), called a
proxy\_td data structure. This is short for "proxy thread data", and is often
abbreviated as "ptd" in the code.

A proxy keeps track of its proxy\_td's (one proxy\_td per worker thread).

A worker thread can freely mutate its proxy\_td structure, but never touch the
proxy\_td's of other work threads. So, a worker thread does not need locks to
access its own proxy\_td.

A worker thread (and the main thread, too) must use locking before accessing the
shared, mutatable fields on its "parent" proxy data structure. Some proxy data
structure fields are inherently read-only and static, so they don't need
locking. The code comments (cproxy.h) try to clearly specify which fields are
immutable and lockless.

Worker threads handle a proxy\_td change.Between each request, each worker
thread grabs a very short lock on its parent's proxy data structure to compare
config\_ver numbers. If the config\_ver numbers match, the worker thread knows
that the proxy's configuration remains the same, and the request can proceed.

If the numbers are different, the worker thread knows a re-configuration has
occured, and the worker thread will remove cached information and update its
proxy\_td copy appropriately.

<a id="moxi-build"></a>
