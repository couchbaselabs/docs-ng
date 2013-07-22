# Moxi Design Internals

moxi was started around Q1 2009 based off the memcached code base. It's current
source repository is a
[http://github.com/couchbase/moxi](http://github.com/couchbase/moxi).

Moxi inherited a lot of machinery from memcached, including:

 * Networking and connection management

 * Thread management

 * Protocol parsing

 * Startup components

 * Build environment

From the point of view of moxi's codebase:

 * upstream -- the client application, or the source of requests

 * downstream -- the Couchbase servers which are the destination for requests

Moxi code also uses the word "pool" in a way that predates our modern usage of
"cluster", so they are somewhat synonyms.

<a id="moxi-internals-guidingideas"></a>

## Guiding Ideas

Originally, a rule was to keep changes from any "memcached heritage" files to a
minimum.

 * The motivation was so that moxi could keep up with memcached, allowing us to
   easily merge in any improvements from memcached into moxi.

 * This is why much of moxi lives in files separate from memcached's files
   (cproxy\_\*.c/.h)

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

The -z flag specifies a cluster of Couchbase servers. There a several ways to
specify a cluster using -z. For example:

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

<a id="moxi-server-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Moxi. To browse or submit new issues, see [Moxi Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

<a id="moxi-server-rn_1-8"></a>

## Release Notes for Moxi 1.8.0 GA (Already released)

**Known Issues in 1.8.0**

 * When using Moxi in a cluster using `haproxy`, it's possible for a memory leak to
   cause a problem in Moxi when the topology appears to change. The problem is due
   to `haproxy` disabling open connections, particularly those used for management,
   that Moxi may have open, but not using. The `haproxy` closes these open
   connections, which `moxi` identifies as topology changes. The problem is
   particularly prevalent when using the `balance roundrobin` load balancing type.

   *Workaround* : There are two possible workarounds to prevent the memory leak in
   `moxi` :

    * Use `balance source` load balancing mode within `haproxy`. This reduces the
      effect of `haproxy` closing the open network ports.

    * Increase the network timeouts in `haproxy`. You can do this by editing the
      `haproxy` configuration file and adding the following two lines:

       ```
       timeout client 300000
       timeout server 300000
       ```

      The above sets a 5 minute timeout. You can increase this to a larger number.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.

<a id="licenses-community"></a>

## Couchbase, Inc. Community Edition License Agreement

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS COMMUNITY EDITION LICENSE
AGREEMENT (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU REPRESENT
AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO THIS
AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE "I
ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. License Grant. Couchbase Inc. hereby grants Licensee, free of charge, the
    non-exclusive right to use, copy, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to Licensee including the following copyright notice
    in all copies or substantial portions of the Software:

     ```
     Couchbase ©
     http://www.couchbase.com
     Copyright 2011 Couchbase, Inc.
     ```

    As used in this Agreement, "Software" means the object code version of the
    applicable elastic data management server software provided by Couchbase, Inc.

 1. Support. Couchbase, Inc. will provide Licensee with access to, and use of, the
    Couchbase, Inc. support forum available at the following URL:
    http://forums.membase.org. Couchbase, Inc. may, at its discretion, modify,
    suspend or terminate support at any time upon notice to Licensee.

 1. Warranty Disclaimer and Limitation of Liability. THE SOFTWARE IS PROVIDED "AS
    IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL COUCHBASE INC. OR THE AUTHORS OR COPYRIGHT
    HOLDERS IN THE SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES (INCLUDING, WITHOUT
    LIMITATION, DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES) OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a id="licenses-enterprise"></a>

## Couchbase, Inc. Enterprise License Agreement: Free Edition

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS ENTERPRISE LICENSE AGREEMENT
– FREE EDITION (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU
REPRESENT AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO
THIS AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE
"I ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. **License Grant**. Subject to Licensee's compliance with the terms and
    conditions of this Agreement, Couchbase Inc. hereby grants to Licensee a
    perpetual, non-exclusive, non-transferable, non-sublicensable, royalty-free,
    limited license to install and use the Software only for Licensee's own internal
    production use on up to two (2) Licensed Servers or for Licensee's own internal
    non-production use for the purpose of evaluation and/or development on an
    unlimited number of Licensed Servers.

 1. **Restrictions**. Licensee will not: (a) copy or use the Software in any manner
    except as expressly permitted in this Agreement; (b) use or deploy the Software
    on any server in excess of the Licensed Servers for which Licensee has paid the
    applicable Subscription Fee unless it is covered by a valid license; (c)
    transfer, sell, rent, lease, lend, distribute, or sublicense the Software to any
    third party; (d) use the Software for providing time-sharing services, service
    bureau services or as part of an application services provider or as a service
    offering primarily designed to offer the functionality of the Software; (e)
    reverse engineer, disassemble, or decompile the Software (except to the extent
    such restrictions are prohibited by law); (f) alter, modify, enhance or prepare
    any derivative work from or of the Software; (g) alter or remove any proprietary
    notices in the Software; (h) make available to any third party the functionality
    of the Software or any license keys used in connection with the Software; (i)
    publically display or communicate the results of internal performance testing or
    other benchmarking or performance evaluation of the Software; or (j) export the
    Software in violation of U.S. Department of Commerce export administration rules
    or any other export laws or regulations.

 1. **Proprietary Rights**. The Software, and any modifications or derivatives
    thereto, is and shall remain the sole property of Couchbase Inc. and its
    licensors, and, except for the license rights granted herein, Couchbase Inc. and
    its licensors retain all right, title and interest in and to the Software,
    including all intellectual property rights therein and thereto. The Software may
    include third party open source software components. If Licensee is the United
    States Government or any contractor thereof, all licenses granted hereunder are
    subject to the following: (a) for acquisition by or on behalf of civil agencies,
    as necessary to obtain protection as "commercial computer software" and related
    documentation in accordance with the terms of this Agreement and as specified in
    Subpart 12.1212 of the Federal Acquisition Regulation (FAR), 48 C.F.R.12.1212,
    and its successors; and (b) for acquisition by or on behalf of the Department of
    Defense (DOD) and any agencies or units thereof, as necessary to obtain
    protection as "commercial computer software" and related documentation in
    accordance with the terms of this Agreement and as specified in Subparts
    227.7202-1 and 227.7202-3 of the DOD FAR Supplement, 48 C.F.R.227.7202-1 and
    227.7202-3, and its successors. Manufacturer is Couchbase, Inc.

 1. **Support**. Couchbase Inc. will provide Licensee with: (a) periodic Software
    updates to correct known bugs and errors to the extent Couchbase Inc.
    incorporates such corrections into the free edition version of the Software; and
    (b) access to, and use of, the Couchbase Inc. support forum available at the
    following URL: http://forums.membase.org. Licensee must have Licensed Servers at
    the same level of Support Services for all instances in a production deployment
    running the Software. Licensee must also have Licensed Servers at the same level
    of Support Services for all instances in a development and test environment
    running the Software, although these Support Services may be at a different
    level than the production Licensed Servers. Couchbase Inc. may, at its
    discretion, modify, suspend or terminate support at any time upon notice to
    Licensee.

 1. **Records Retention and Audit**. Licensee shall maintain complete and accurate
    records to permit Couchbase Inc. to verify the number of Licensed Servers used
    by Licensee hereunder. Upon Couchbase Inc.'s written request, Licensee shall:
    (a) provide Couchbase Inc. with such records within ten (10) days; and (b) will
    furnish Couchbase Inc. with a certification signed by an officer of Licensee
    verifying that the Software is being used pursuant to the terms of this
    Agreement. Upon at least thirty (30) days prior written notice, Couchbase Inc.
    may audit Licensee's use of the Software to ensure that Licensee is in
    compliance with the terms of this Agreement. Any such audit will be conducted
    during regular business hours at Licensee's facilities and will not unreasonably
    interfere with Licensee's business activities. Licensee will provide Couchbase
    Inc. with access to the relevant Licensee records and facilities. If an audit
    reveals that Licensee has used the Software in excess of the authorized Licensed
    Servers, then (i) Couchbase Inc. will invoice Licensee, and Licensee will
    promptly pay Couchbase Inc., the applicable licensing fees for such excessive
    use of the Software, which fees will be based on Couchbase Inc.'s price list in
    effect at the time the audit is completed; and (ii) Licensee will pay Couchbase
    Inc.'s reasonable costs of conducting the audit.

 1. **Confidentiality**. Licensee and Couchbase Inc. will maintain the
    confidentiality of Confidential Information. The receiving party of any
    Confidential Information of the other party agrees not to use such Confidential
    Information for any purpose except as necessary to fulfill its obligations and
    exercise its rights under this Agreement. The receiving party shall protect the
    secrecy of and prevent disclosure and unauthorized use of the disclosing party's
    Confidential Information using the same degree of care that it takes to protect
    its own confidential information and in no event shall use less than reasonable
    care. The terms of this Confidentiality section shall survive termination of
    this Agreement. Upon termination or expiration of this Agreement, the receiving
    party will, at the disclosing party's option, promptly return or destroy (and
    provide written certification of such destruction) the disclosing party's
    Confidential Information.

 1. **Disclaimer of Warranty**. THE SOFTWARE AND ANY SERVICES PROVIDED HEREUNDER ARE
    PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. COUCHBASE INC. DOES NOT WARRANT
    THAT THE SOFTWARE OR THE SERVICES PROVIDED HEREUNDER WILL MEET LICENSEE'S
    REQUIREMENTS, THAT THE SOFTWARE WILL OPERATE IN THE COMBINATIONS LICENSEE MAY
    SELECT FOR USE, THAT THE OPERATION OF THE SOFTWARE WILL BE ERROR-FREE OR
    UNINTERRUPTED OR THAT ALL SOFTWARE ERRORS WILL BE CORRECTED. COUCHBASE INC.
    HEREBY DISCLAIMS ALL WARRANTIES, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
    LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, NON-INFRINGEMENT, TITLE, AND ANY WARRANTIES ARISING OUT OF COURSE OF
    DEALING, USAGE OR TRADE.

 1. **Agreement Term and Termination**. The term of this Agreement shall begin on
    the Effective Date and will continue until terminated by the parties. Licensee
    may terminate this Agreement for any reason, or for no reason, by providing at
    least ten (10) days prior written notice to Couchbase Inc. Couchbase Inc. may
    terminate this Agreement if Licensee materially breaches its obligations
    hereunder and, where such breach is curable, such breach remains uncured for ten
    (10) days following written notice of the breach. Upon termination of this
    Agreement, Licensee will, at Couchbase Inc.'s option, promptly return or destroy
    (and provide written certification of such destruction) the applicable Software
    and all copies and portions thereof, in all forms and types of media. The
    following sections will survive termination or expiration of this Agreement:
    Sections 2, 3, 6, 7, 8, 9, 10 and 11.

 1. **Limitation of Liability**. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
    IN NO EVENT WILL COUCHBASE INC. OR ITS LICENSORS BE LIABLE TO LICENSEE OR TO ANY
    THIRD PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY
    DAMAGES OR FOR THE COST OF PROCURING SUBSTITUTE PRODUCTS OR SERVICES ARISING OUT
    OF OR IN ANY WAY RELATING TO OR IN CONNECTION WITH THIS AGREEMENT OR THE USE OF
    OR INABILITY TO USE THE SOFTWARE OR DOCUMENTATION OR THE SERVICES PROVIDED BY
    COUCHBASE INC. HEREUNDER INCLUDING, WITHOUT LIMITATION, DAMAGES OR OTHER LOSSES
    FOR LOSS OF USE, LOSS OF BUSINESS, LOSS OF GOODWILL, WORK STOPPAGE, LOST
    PROFITS, LOSS OF DATA, COMPUTER FAILURE OR ANY AND ALL OTHER COMMERCIAL DAMAGES
    OR LOSSES EVEN IF ADVISED OF THE POSSIBILITY THEREOF AND REGARDLESS OF THE LEGAL
    OR EQUITABLE THEORY (CONTRACT, TORT OR OTHERWISE) UPON WHICH THE CLAIM IS BASED.
    IN NO EVENT WILL COUCHBASE INC.'S OR ITS LICENSORS' AGGREGATE LIABILITY TO
    LICENSEE, FROM ALL CAUSES OF ACTION AND UNDER ALL THEORIES OF LIABILITY, EXCEED
    ONE THOUSAND DOLLARS (US $1,000). The parties expressly acknowledge and agree
    that Couchbase Inc. has set its prices and entered into this Agreement in
    reliance upon the limitations of liability specified herein, which allocate the
    risk between Couchbase Inc. and Licensee and form a basis of the bargain between
    the parties.

 1. **General**. Couchbase Inc. shall not be liable for any delay or failure in
    performance due to causes beyond its reasonable control. Neither party will,
    without the other party's prior written consent, make any news release, public
    announcement, denial or confirmation of this Agreement, its value, or its terms
    and conditions, or in any manner advertise or publish the fact of this
    Agreement. Notwithstanding the above, Couchbase Inc. may use Licensee's name and
    logo, consistent with Licensee's trademark policies, on customer lists so long
    as such use in no way promotes either endorsement or approval of Couchbase Inc.
    or any Couchbase Inc. products or services. Licensee may not assign this
    Agreement, in whole or in part, by operation of law or otherwise, without
    Couchbase Inc.'s prior written consent. Any attempt to assign this Agreement,
    without such consent, will be null and of no effect. Subject to the foregoing,
    this Agreement will bind and inure to the benefit of each party's successors and
    permitted assigns. If for any reason a court of competent jurisdiction finds any
    provision of this Agreement invalid or unenforceable, that provision of the
    Agreement will be enforced to the maximum extent permissible and the other
    provisions of this Agreement will remain in full force and effect. The failure
    by either party to enforce any provision of this Agreement will not constitute a
    waiver of future enforcement of that or any other provision. All waivers must be
    in writing and signed by both parties. All notices permitted or required under
    this Agreement shall be in writing and shall be delivered in person, by
    confirmed facsimile, overnight courier service or mailed by first class,
    registered or certified mail, postage prepaid, to the address of the party
    specified above or such other address as either party may specify in writing.
    Such notice shall be deemed to have been given upon receipt. This Agreement
    shall be governed by the laws of the State of California, U.S.A., excluding its
    conflicts of law rules. The parties expressly agree that the UN Convention for
    the International Sale of Goods (CISG) will not apply. Any legal action or
    proceeding arising under this Agreement will be brought exclusively in the
    federal or state courts located in the Northern District of California and the
    parties hereby irrevocably consent to the personal jurisdiction and venue
    therein. Any amendment or modification to the Agreement must be in writing
    signed by both parties. This Agreement constitutes the entire agreement and
    supersedes all prior or contemporaneous oral or written agreements regarding the
    subject matter hereof. To the extent there is a conflict between this Agreement
    and the terms of any "shrinkwrap" or "clickwrap" license included in any
    package, media, or electronic version of Couchbase Inc.-furnished software, the
    terms and conditions of this Agreement will control. Each of the parties has
    caused this Agreement to be executed by its duly authorized representatives as
    of the Effective Date. Except as expressly set forth in this Agreement, the
    exercise by either party of any of its remedies under this Agreement will be
    without prejudice to its other remedies under this Agreement or otherwise. The
    parties to this Agreement are independent contractors and this Agreement will
    not establish any relationship of partnership, joint venture, employment,
    franchise, or agency between the parties. Neither party will have the power to
    bind the other or incur obligations on the other's behalf without the other's
    prior written consent.

 1. **Definitions**. Capitalized terms used herein shall have the following
    definitions: "Confidential Information" means any proprietary information
    received by the other party during, or prior to entering into, this Agreement
    that a party should know is confidential or proprietary based on the
    circumstances surrounding the disclosure including, without limitation, the
    Software and any non-public technical and business information. Confidential
    Information does not include information that (a) is or becomes generally known
    to the public through no fault of or breach of this Agreement by the receiving
    party; (b) is rightfully known by the receiving party at the time of disclosure
    without an obligation of confidentiality; (c) is independently developed by the
    receiving party without use of the disclosing party's Confidential Information;
    or (d) the receiving party rightfully obtains from a third party without
    restriction on use or disclosure. "Documentation" means any technical user
    guides or manuals provided by Couchbase Inc. related to the Software. "Licensed
    Server" means an instance of the Software running on one (1) operating system.
    Each operating system instance may be running directly on physical hardware, in
    a virtual machine, or on a cloud server. "Couchbase" means Couchbase, Inc.
    "Couchbase Website" means www.couchbase.com. "Software" means the object code
    version of the applicable elastic data management server software provided by
    Couchbase Inc. and ordered by Licensee during the ordering process on the
    Couchbase Website.

If you have any questions regarding this Agreement, please contact
sales@couchbase.com.