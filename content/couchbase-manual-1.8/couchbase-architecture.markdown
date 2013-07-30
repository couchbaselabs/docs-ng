# Couchbase Architecture

From a client perspective, Couchbase Server speaks memcached protocol, which is
well understood by many, if not most application developers. The difference, of
course, is that Couchbase Server has persistence and replication capabilities
while still allowing for memcached like speed.

<a id="couchbase-architecture-clusterdesign"></a>

## Cluster Design

Individual Couchbase Server nodes are clustered together. Within a cluster data
is automatically replicated between nodes of a cluster. Cluster nodes can be
added and removed without interrupting access to data within the cluster.

All clusters start with a single node, typically one installed from a package.
Either through the Web UI or from the REST interface, Couchbase Server allows
one or more nodes to be added to the cluster. When a node is added to the
cluster, it does not immediately start performing data operations. This is to
allow the user to perform one or more changes to the cluster before initiating a
rebalance. During a rebalance the data and replicas of that data, contained in
sub-partitions of the cluster called vBuckets, are redistributed throughout the
cluster. By design, a given vBucket is only active in one place within the
cluster at a given point in time. By doing so, Couchbase Server is always
consistent for any given item.

Data is moved between nodes, both when rebalancing and replicating, using a set
of managed eBucketmigrator processes in the cluster. This process uses a new
protocol called TAP. TAP is generic in nature though, and it has very clear use
cases outside replication or migration of data. Incidentally, TAP doesn't
actually stand for anything. The name came about when thinking about how to "tap
into" a Couchbase Server node. This could be thought of along the lines of a
'wiretap' or tapping into a keg.

Cluster replication defaults to asynchronous, but is designed to be synchronous.
The benefit of replication being asynchronous is that Couchbase Server has
speeds similar to memcached in the default case, taking a data safety risk for a
short interval.

Cluster coordination and communication is handled by the `ns_server` erlang
process. Generally, users of Couchbase Server need not be aware of the details
about how `ns_server` performs its tasks, as interfacing with the cluster is
done with the aforementioned [REST API for
Administration](#couchbase-admin-restapi). As part of keeping the system simple,
all nodes of the cluster expose the state of the cluster.

<a id="couchbase-architecture-persistencedesign"></a>

## Persistence Design

Generally speaking, Couchbase Server is memory oriented, by which we mean that
it tends to be designed around the working set being resident in memory, as is
the case with most highly interactive web applications. However, the set of data
in memory at any given point in time is only the hot data. Data is persisted to
disk by Couchbase Server asynchronously, based on rules in the system.

<a id="couchbase-architecture-components"></a>

## Component Overview

From a developer perspective, it is useful to know how all of the components of
Couchbase Server come together. A Couchbase Server node consists of:

 * `ns_server`

   `ns_server` is the main process that runs on each node. As it says in it's
   source repository summary, it is the supervisor. One of these runs on each node
   and then spawns processes, which then later spawn more processes.

 * `ebucketmigrator`

   The `ebucketmigrator` component of `ns_server` is responsible for handling the
   redistribution of information within the cluster nodes during rebalance
   operations.

 * `menelaus`

   Menelaus is really two components, which are part of the `ns_server` component.
   The main focus of menelaus is providing the RESTful interface to working with a
   cluster. Built atop that RESTful interface is a very rich, sophisticated jQuery
   based application which makes REST calls to the server.

 * memcached

   Though Couchbase Server is different than memcached, it does leverage the core
   of memcached. The core includes networking and protocol handling.

   The bulk of Couchbase Server is implemented in two components:

    * Couchbase Server engine ( `ep-engine` )

      This is loaded through the memcached core and the bucket\_engine. This core
      component provides persistence in an asynchronous fashion and implements the TAP
      protocol.

    * bucket engine

      The bucket engine provides a way of loading instances of engines under a single
      memcached process. This is how Couchbase Server provides multitenancy.

 * `Moxi`

   A memcached proxy, moxi "speaks" vBucket hashing (implemented in libvbucket) and
   can talk to the REST interface to get cluster state and configuration, ensuring
   that clients are always routed to the appropriate place for a given vBucket.

   Across multiple cloud instances, VMs or physical servers, all of these
   components come together to become a couchbase cluster.

<a id="couchbase-architecture-diskstorage"></a>

## Disk Storage (Growing Data Sets Beyond Memory)

Couchbase Server has asynchronous persistence as a feature. One
feature-of-that-feature is that the working set stored by an individual
Couchbase Server node can be larger than the cache dedicated to that node. This
feature is commonly referred to as "disk greater than memory".

<a id="couchbase-architecture-diskstorage-design"></a>

### Design

Each instance of ep-engine in a given node will have a certain memory quota
associated with it. This memory quota is sometimes referred to as >the amount of
cache memory. That amount of memory will always store the index to the entire
working set. By doing so, we ensure most items are quickly fetched and checks
for the existence of items is always fast.


![](images/couchbase-060711-1157-32_img_300.jpg)

In addition to the quota, there are two watermarks the engine will use to
determine when it is necessary to start freeing up available memory. These are
mem\_low\_wat and mem\_high\_wat.

As the system is loaded with data, eventually the mem\_low\_wat is passed. At
this time, no action is taken. This is the "goal" the system will move toward
when migrating items to disk. As data continues to load, it will evenutally
reach mem\_high\_wat. At this point a background job is scheduled to ensure
items are migrated to disk and the memory is then available for other Couchbase
Server items. This job will run until measured memory reaches mem\_low\_wat. If
the rate of incoming items is faster than the migration of items to disk, the
system may return errors indicating there is not enough space. This will
continue until there is available memory.

<a id="couchbase-architecture-diskstorage-consequences"></a>

### Consequences of Memory faster than Disk

Obviously, the migration of data to disk is generally much slower and has much
lower throughput than setting things in memory. When an application is setting
or otherwise mutating data faster than it can be migrated out of memory to make
space available for incoming data, the behavior of the server may be a bit
different than the client expects with memcached. In the case of memcached,
items are evicted from memory, and the newly mutated item is stored. In the case
of couchbase, however, the expectation is that we'll migrate items to disk.

When Couchbase Server determines that RAM is at 90% of the bucket quota, the
server will return `TMPFAIL` to clients when storing data. This indicates that
the out of memory issue is temporary and can be retried. The reason for the
response is that there are still outstanding items in the disk write queue that
need to be persisted to disk before they can safely be ejected from memory. The
situation is rare and seen only when very large volumes of writes in a short
period of time. Clients will still be able to read data from memory.

When Couchbase Server determines that there is not enough memory to store
information immediately, the server will return `TMP_OOM`, the temporary out of
memory error. This is designed to indicate that the inability to store the
requested information is only a temporary, not a permanent, lack of memory. When
the client receives this error, the storage process can either be tried later or
fail, dependending on the client and application requirements.

<a id="couchbase-architecture-diskstorage-dgm"></a>

### DGM Implementation Details

The actual process of eviction is relatively simple now. When we need memory, we
look around in hash tables and attempt to find things we can get rid of (i.e.
things that are persisted on disk) and start dropping it. We will also eject
data as soon as it's persisted iff it's for an inactive (e.g. replica) vBucket
if we're above our low watermark for memory. If we have plenty of memory, we'll
keep it loaded.

The bulk of this page is about what happens when we encounter values that are
not resident.

<a id="couchbase-architecture-diskstorage-dgm-get"></a>

### Get Flow

In the current flow, a get request against a given document ID will first fetch
the value from the hash table. For any given item we know about, there will
definitely be a document ID and its respective metadata will always be available
in the hash table. In the case of an "ejected" record, the value will be
missing, effectively pointed to NULL. This is useful for larger objects, but not
particularly efficient for small objects. This is being addressed in future
versions.

When fetching a value, we will first look in the hash table. If we don't find
it, we don't have it. MISS.

If we do have it and it's resident, we return it. HIT.

If we have it and it's not resident, we schedule a background fetch and let the
dispatcher pull the object from the DB and reattach it to the stored value in
memory. The connection is then placed into a blocking state so the client will
wait until the item has returned from slower storage.

The background fetch happens at some point in the future via an asynchronous job
dispatcher.


![](images/couchbase-060711-1157-32_img_301.jpg)

When the job runs, the item is returned from disk and then the in-memory item is
pulled and iff it is still not resident, will have the value set with the result
of the disk fetch.\*

Once the process is complete, whether the item was reattached from the disk
value or not, the connection is reawakened so the core server will replay the
request from the beginning.

It's possible (though very unlikely) for another eject to occur before this
process runs in which case the entire fetch process will begin again. The client
has no particular action to take after the get request until the server is able
to satisfy it.

An item may be resident after a background fetch either in the case of another
background fetch for the same document ID having completed prior to this one or
another client has modified the value since we looked in memory. In either case,
we assume the disk value is older and will discard it.

<a id="couchbase-architecture-diskstorage-dgm-concurrentrw"></a>

### Concurrent Reads and Writes

Concurrent reads and writes are sometimes possible under the right conditions.
When these conditions are met, reads are executed by a new dispatcher that
exists solely for read-only database requests, otherwise, the read-write
dispatcher is used.

The underlying storage layer reports the level of concurrency it supports at
startup time (specifically, post init-script evaluation). For stock SQLite,
concurrent reads are allowed if both the journal-mode is WAL and
read\_uncommitted is enabled.

Future storage mechanisms may allow for concurrent execution under different
conditions and will indicate this by reporting their level of concurrency
differently.

The concurrentDB engine parameter allows the user to disable concurrent DB
access even when the DB reports it's possible.

The possible concurrency levels are reported via the `ep_store_max_concurrency`,
`ep_store_max_readers` and, `ep_store_max_readwrite` stats. The dispatcher stats
will show the read-only dispatcher when it's available.

<a id="couchbase-architecture-diskstorage-dgm-mutationflow"></a>

### Mutation Flow

New data is better than old data, so a set always wins. Similarly, a delete
always wins. Increment, decrement, add, etc are all atomic, but you can imagine
them working as a get + store.

<a id="couchbase-architecture-apis"></a>

## Couchbase APIs

A Couchbase cluster communicates with clients in two ways; the primary way
clients interact with Couchbase Server is through manipulating data through
various operations supported by couchbase. This is always through memcached
protocol, and almost always through a client written for the particular
programming language and platform you use.

In addition, there is also a RESTful interface which allows so-called "control
plane" management of a cluster. Through this, a client may get information about
or make changes to the cluster. For example, with the REST interface, a client
can do things such as gather statistics from the cluster, define and make
changes to buckets and even add/remove new nodes to the cluster.

<a id="couchbase-architecture-apis-memcached-protocol"></a>

### memcached protocol

Couchbase Server supports the textual memcached protocol as described in
[protocol.txt](http://code.sixapart.com/svn/memcached/trunk/server/doc/protocol.txt).
The textual protocol is disabled for the direct port to Couchbase Server due to
the lack of vBucket support in couchbase. All access to Couchbase Server with
the textual protocol must go through moxi.

One minor difference with Couchbase Server compared to memcached is that
Couchbase Server allows for larger item sizes. Where memcached is 1MByte by
default (tunable in more recent versions), Couchbase Server defaults to a
maximum item size of 20MByte.

<a id="couchbase-architecture-apis-memcached-memcapable"></a>

### memcapable 1.0

`memcapable` is a tool included in lib memcached that is used to verify if a
memcached implementation adheres to the memcached protocol. It does this by
sending all of the commands specified in the protocol description and verifies
the result. This means that the server must implement an actual item storage and
all of the commands to be able to pass the `memcapable` testsuite.

<a id="couchbase-architecture-apis-memcached-memcapable-cmdline"></a>

### Command line options

`memcapable` supports a number of command line options you may find useful (try
running `memcapable` -h to see the list of available options). If you run
`memcapable` without any options it will try to connect to `localhost:11211` and
run the `memcapable` testsuite (see
[Example](#couchbase-architecture-apis-memcached-memcapable-example) ). If
you're trying to implement your own server and one of the tests fails, you might
want to know why it failed. There is two options you might find useful for that:
`-v` or `-c`. The `-v` option prints out the assertion why the test failed, and
may help you figure out the problem. I'm a big fan of debuggers and corefiles,
so I prefer `-c`. When using `-c`  `memcapable` will dump core whenever a test
fails, so you can inspect the corefile to figure out why the test failed.

<a id="couchbase-architecture-apis-memcached-memcapable-example"></a>

### Example

The following example tests the server listening on port 11211 on the local host
(in this example I've got the stock memcached server running there)


```
shell> memcapable
ascii quit [pass]
ascii version [pass]
ascii verbosity [pass]
ascii set [pass]
ascii set noreply [pass]
ascii get [pass]
ascii gets [pass]
ascii mget [pass]
ascii flush [pass]
ascii flush noreply [pass]
ascii add [pass]
ascii add noreply [pass]
ascii replace [pass]
ascii replace noreply [pass]
ascii CAS [pass]
ascii CAS noreply [pass]
ascii delete [pass]
ascii delete noreply [pass]
ascii incr [pass]
ascii incr noreply [pass]
ascii decr [pass]
ascii decr noreply [pass]
ascii append [pass]
ascii append noreply [pass]
ascii prepend [pass]
ascii prepend noreply [pass]
ascii stat [pass]
binary noop [pass]
binary quit [pass]
binary quitq [pass]
binary set [pass]
binary setq [pass]
binary flush [pass]
binary flushq [pass]
binary add [pass]
binary addq [pass]
binary replace [pass]
binary replaceq [pass]
binary delete [pass]
binary deleteq [pass]
binary get [pass]
binary getq [pass]
binary getk [pass]
binary getkq [pass]
binary incr [pass]
binary incrq [pass]
binary decr [pass]
binary decrq [pass]
binary version [pass]
binary append [pass]
binary appendq [pass]
binary prepend [pass]
binary prependq [pass]
binary stat [pass]
All tests passed
```

The following example runs the test named "binary prepend"


```
trond@opensolaris> memcapable -T "binary prepend"
binary prepend [pass]
All tests passed
```

The following example runs the test suite, but prompts the user before each test


```
trond@opensolaris> memcapable -P ascii quit
Press <return> when you are ready?
ascii quit [pass]
ascii version
Press <return> when you are ready? quit
```

<a id="couchbase-architecture-buckets"></a>

## Buckets

Buckets are used to compartmentalize data within Couchbase Server and are also
used as the basic mechanism used to replicate and duplicate information (if
supported). Couchbase Server supports two different bucket types. These are:

 * **memcached Buckets**

   The memcached buckets are designed to fully support the core memcached protocol
   as an in-memory caching solution. The support and functionality is therefore
   limited to the same functionality as within a standalone memcached
   implementation.

   The main features are:

    * Item size is limited to 1 Mbyte.

    * Persistence is not supported.

    * Replication is not supported; data is available only on one node.

    * Statistics are limited to those directly related to the in-memory nature of the
      data. Statistics related to persistence, disk I/O and replication/rebalancing
      are not available.

    * Client setup should use ketama consistent hashing

    * memcached buckets do not use vBuckets, so there is no rebalancing.

 * **Couchbase Buckets**

   Couchbase buckets support the full range of Couchbase-specific functionality,
   including balancing, persistence and replication. The main features are:

    * Item size is limited to 20 Mbyte.

    * Persistence, including data sets larger than the allocated memory size.

    * Replication and rebalancing are fully supported.

    * Full suite of statistics supported.

In addition to these overall bucket differences, there are also security and
network port differences that enable you to configure and structure the
connectivity to the different bucket types differently.


![](images/couchbase-060711-1157-32_img_452.jpg)

There are three bucket interface types that can be be configured:

 * The default Bucket

   The default bucket is a Couchbase bucket that always resides on port 11211 and
   is a non-SASL authenticating bucket. When Couchbase Server is first installed
   this bucket is automatically set up during installation. This bucket may be
   removed after installation and may also be re-added later, but when re-adding a
   bucket named "default", the bucket must be place on port 11211 and must be a
   non-SASL authenticating bucket. A bucket not named default may not reside on
   port 11211 if it is a non-SASL bucket. The default bucket may be reached with a
   vBucket aware smart client, an ASCII client or a binary client that doesn't use
   SASL authentication.

 * Non-SASL Buckets

   Non-SASL buckets may be placed on any available port with the exception of port
   11211 if the bucket is not named "default". Only one Non-SASL bucket may placed
   on any individual port. These buckets may be reached with a vBucket aware smart
   client, an ASCII client or a binary client that doesn't use SASL authentication

 * SASL Buckets

   SASL authenticating Couchbase buckets may only be placed on port 11211 and each
   bucket is differentiated by its name and password. SASL bucket may not be placed
   on any other port beside 11211. These buckets can be reached with either a
   vBucket aware smart client or a binary client that has SASL support. These
   buckets cannot be reached with ASCII clients.

<a id="couchbase-architecture-vbuckets"></a>

## vBuckets

For simplicity, in this section we completely ignore Couchbase Server
multi-tenancy (or what we have historically called a "bucket," which represents
a "virtual couchbase instance" inside a single couchbase cluster). The bucket
and vBucket concepts are not to be confused - they are not related. For purposes
of this section, a bucket can simply be viewed as synonymous with "a couchbase
cluster."

A vBucket is defined as the "owner" of a subset of the key space of a Couchbase
Server cluster.

Every document ID "belongs" to a vBucket. A mapping function is used to
calculate the vBucket in which a given document ID belongs. In couchbase, that
mapping function is a hashing function that takes a document ID as input and
outputs a vBucket identifier. Once the vBucket identifier has been computed, a
table is consulted to lookup the server that "hosts" that vBucket. The table
contains one row per vBucket, pairing the vBucket to its hosting server. A
server appearing in this table can be (and usually is) responsible for multiple
vBuckets.

The hashing function used by Couchbase Server to map document IDs to vBuckets is
configurable - both the hashing algorithm and the output space (i.e. the total
number of vBuckets output by the function). Naturally, if the number of vBuckets
in the output space of the hash function is changed, then the table which maps
vBuckets to Servers must be resized.

<a id="couchbase-architecture-vbuckets-illustrated"></a>

### Couchbase Document ID-vBucket-Server Mapping Illustrated

The vBucket mechanism provides a layer of indirection between the hashing
algorithm and the server responsible for a given document ID. This indirection
is useful in managing the orderly transition from one cluster configuration to
another, whether the transition was planned (e.g. adding new servers to a
cluster) or unexpected (e.g. a server failure).

The diagram below shows how document ID-Server mapping works when using the
vBucket construct. There are 3 servers in the cluster. A client wants to look up
(get) the value of document ID. The client first hashes the ID to calculate the
vBucket which owns ID. Assume Hash(ID) = vB8. The client then consults the
vBucket-server mapping table and determines Server C hosts vB8. The `get`
operation is sent to Server C.


![](images/vbuckets.png)

After some period of time, there is a need to add a server to the cluster (e.g.
to sustain performance in the face of growing application use). Administrator
adds Server D to the cluster and the vBucket Map is updated as follows.


![](images/vbuckets-after.png)

The vBucket-Server map is updated by an internal Couchbase algorithm and that
updated table is transmitted by Couchbase to all cluster participants - servers
and proxies.

After the addition, a client once again wants to look up (get) the value of
document ID. Because the hashing algorithm in this case has not changed 1
Hash(ID) = vB8 as before. The client examines the vBucket-server mapping table
and determines Server D now owns vB8. The get operation is sent to Server D.

<a id="couchbase-architecture-vbuckets-memcache"></a>

### vBuckets in a world of memcached clients

The interface between clients and your Couchbase Cluster will largely depend on
the client environment you are using. For the majority of client interfaces,
asmartclient is available that can talk natively to the Couchbase Cluster. This
provides the client with a number of advantages in terms of the interface and
sharing of information between the cluster and the client, and results in better
overall performance and availability in failover situations.

Although you can continue to use `memcached` compatible clients, there are
significant performance disadvantages to this deployment model, as it requires
the use of a proxy that handles the mapping and distribution of information to
the correct vBucket and node.

If you want to continue to use the `memcached` you should use the client-side
Moxi deployment solution, as outlined in [Client-Side (standalone)
Proxy](#couchbase-deployment-standaloneproxy).

<a id="couchbase-monitoring"></a>
