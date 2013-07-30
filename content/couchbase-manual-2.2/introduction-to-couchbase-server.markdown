# Introduction to Couchbase Server

Couchbase Server is a NoSQL document database for interactive web applications.
It has a flexible data model, is easily scalable, provides consistent high
performance and is 'always-on,' meaning it is can serve application data 24
hours, 7 days a week. Couchbase Server provides the following benefits:

 * **Flexible Data Model**

   With Couchbase Server, you use JSON documents to represent application objects
   and the relationships between objects. This document model is flexible enough so
   that you can change application objects without having to migrate the database
   schema, or plan for significant application downtime. Even the same type of
   object in your application can have a different data structures. For instance,
   you can initially represent a user name as a single document field. You can
   later structure a user document so that the first name and last name are
   separate fields in the JSON document without any downtime, and without having to
   update all user documents in the system.

   The other advantage in a flexible, document-based data model is that it is well
   suited to representing real-world items and how you want to represent them. JSON
   documents support nested structures, as well as field representing relationships
   between items which enable you to realistically represent objects in your
   application.

 * **Easy Scalability**

   It is easy to scale your application with Couchbase Server, both within a
   cluster of servers and between clusters at different data centers. You can add
   additional instances of Couchbase Server to address additional users and growth
   in application data without any interruptions or changes in your application
   code. With one click of a button, you can rapidly grow your cluster of Couchbase
   Servers to handle additional workload and keep data evenly distributed.

   Couchbase Server provides automatic sharding of data and rebalancing at runtime;
   this lets you resize your server cluster on demand. Cross-data center
   replication providing in Couchbase Server 2.0 enables you to move data closer to
   your user at other data centers.

 * **Consistent High Performance**

   Couchbase Server is designed for massively concurrent data use and consistent
   high throughput. It provides consistent sub-millisecond response times which
   help ensure an enjoyable experience for users of your application. By providing
   consistent, high data throughput, Couchbase Server enables you to support more
   users with less servers. The server also automatically spreads workload across
   all servers to maintain consistent performance and reduce bottlenecks at any
   given server in a cluster.

 * **"Always Online"**

   Couchbase Server provides consistent sub-millisecond response times which help
   ensure an enjoyable experience for users of your application. By providing
   consistent, high data throughput, Couchbase Server enables you to support more
   users with less servers. The server also automatically spreads workload across
   all servers to maintain consistent performance and reduce bottlenecks at any
   given server in a cluster.

   Features such as cross-data center replication and auto-failover help ensure
   availability of data during server or datacenter failure.

All of these features of Couchbase Server enable development of web applications
where low–latency and high throughput are required by end users. Web
applications can quickly access the right information within a Couchbase cluster
and developers can rapidly scale up their web applications by adding servers.

<a id="couchbase-introduction-nosql"></a>

## Couchbase Server and NoSQL

NoSQL databases are characterized by their ability to store data without first
requiring one to define a database schema. In Couchbase Server, you can store
data as key-value pairs or JSON documents. Data does not need to confirm to a
rigid, pre-defined schema from the perspective of the database management
system. Due to this schema-less nature, Couchbase Server supports a *scale out*
approach to growth, increasing data and I/O capacity by adding more servers to a
cluster; and without any change to application software. In contrast, relational
database management systems *scale up* by adding more capacity including CPU,
memory and disk to accommodate growth.

Relational databases store information in relations which must be defined, or
modified, before data can be stored. A relation is simply a table of rows, where
each row in a given relation has a fixed set of columns. These columns are
consistent across each row in a relation. Tables can be further connected
through cross-table references. One table, could hold rows of all individual
citizens residing in a town. Another table, could have rows consisting of
parent, child and relationship fields. The first two fields could be references
to rows in the citizens table while the third field describes the parental
relationship between the persons in the first two fields such as father or
mother.

<a id="couchbase-introduction-architecture"></a>

## Architecture and Concepts

In order to understand the structure and layout of Couchbase Server, you first
need to understand the different components and systems that make up both an
individual Couchbase Server instance, and the components and systems that work
together to make up the Couchbase Cluster as a whole.

The following section provides key information and concepts that you need to
understand the fast and elastic nature of the Couchbase Server database, and how
some of the components work together to support a highly available and high
performance database.

<a id="couchbase-introduction-architecture-nodes"></a>

### Nodes and Clusters

Couchbase Server can be used either in a standalone configuration, or in a
cluster configuration where multiple Couchbase Servers are connected together to
provide a single, distributed, data store.

In this description:

 * **Couchbase Server or Node**

   A single instance of the Couchbase Server software running on a machine, whether
   a physical machine, virtual machine, EC2 instance or other environment.

   All instances of Couchbase Server are identical, provide the same functionality,
   interfaces and systems, and consist of the same components.

 * **Cluster**

   A cluster is a collection of one ore more instances of Couchbase Server that are
   configured as a logical cluster. All nodes within the cluster are identical and
   provide the same functionality. Each node is capable of managing the cluster and
   each node can provide aggregate statistics and operational information about the
   cluster. User data is is stored across the entire cluster through the vBucket
   system.

   Clusters operate in a completely horizontal fashion. To increase the size of a
   cluster, you add another node. There are no parent/child relationships or
   hierarchical structures involved. This means that Couchbase Server scales
   linearly, both in terms of increasing the storage capacity and the performance
   and scalability.

<a id="couchbase-introduction-architecture-clustermanager"></a>

### Cluster Manager

Every node within a Couchbase Cluster includes the Cluster Manager component.
The Cluster Manager is responsible for the following within a cluster:

 * Cluster management

 * Node administration

 * Node monitoring

 * Statistics gathering and aggregation

 * Run-time logging

 * Multi-tenancy

 * Security for administrative and client access

 * Client proxy service to redirect requests

Access to the Cluster Manager is provided through the administration interface
(see [Administration Tools](#couchbase-introduction-architecture-administration)
) on a dedicated network port, and through dedicated network ports for client
access. Additional ports are configured for inter-node communication.

<a id="couchbase-introduction-architecture-buckets"></a>

### Data Storage

Couchbase Server provides data management services using *buckets* ; these are
isolated virtual containers for data. A bucket is a logical grouping of physical
resources within a cluster of Couchbase Servers. They can be used by multiple
client applications across a cluster. Buckets provide a secure mechanism for
organizing, managing, and analyzing data storage resources.

There are two types of data bucket in Couchbase Server: 1) memcached buckets,
and 2) couchbase buckets. The two different types of buckets enable you to store
data in-memory only, or to store data in-memory as well as on disk for added
reliability. When you set up Couchbase Server you can choose what type of bucket
you need in your implementation:

<a id="table-couchbase-introduction-architecture-bucket-types"></a>

Bucket Type | Description                                                                                                                                                                                                                                                                                                               
------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Couchbase   | Provides highly-available and dynamically reconfigurable distributed data storage, providing persistence and replication services. Couchbase buckets are 100% protocol compatible with, and built in the spirit of, the memcached open source distributed key-value cache.                                                
Memcached   | Provides a directly-addressed, distributed (scale-out), in-memory, key-value cache. Memcached buckets are designed to be used alongside relational database technology – caching frequently-used data, thereby reducing the number of queries a database server must perform for web servers delivering a web application.

The different bucket types support different capabilities. Couchbase-type
buckets provide a highly-available and dynamically reconfigurable distributed
data store. Couchbase-type buckets survive node failures and allow cluster
reconfiguration while continuing to service requests. Couchbase-type buckets
provide the following core capabilities.

<a id="table-couchbase-introduction-architecture-bucket-capabilities"></a>

Capability  | Description                                                                                                                                                                                                                                                                                                 
------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Caching     | Couchbase buckets operate through RAM. Data is kept in RAM and persisted down to disk. Data will be cached in RAM until the configured RAM is exhausted, when data is ejected from RAM. If requested data is not currently in the RAM cache, it will be loaded automatically from disk.                     
Persistence | Data objects can be persisted asynchronously to hard-disk resources from memory to provide protection from server restarts or minor failures. Persistence properties are set at the bucket level.                                                                                                           
Replication | A configurable number of replica servers can receive copies of all data objects in the Couchbase-type bucket. If the host machine fails, a replica server can be promoted to be the host server, providing high availability cluster operations via failover. Replication is configured at the bucket level.
Rebalancing | Rebalancing enables load distribution across resources and dynamic addition or removal of buckets and servers in the cluster.                                                                                                                                                                               

<a id="table-couchbase-introduction-buckets-comparison"></a>

Capability      | memcached Buckets                               | Couchbase Buckets        
----------------|-------------------------------------------------|--------------------------
Item Size Limit | 1 MByte                                         | 20 MByte                 
Persistence     | No                                              | Yes                      
Replication     | No                                              | Yes                      
Rebalance       | No                                              | Yes                      
Statistics      | Limited set for in-memory stats                 | Full suite               
Client Support  | Memcached, should use Ketama consistent hashing | Full Smart Client Support

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

Smart clients discover changes in the cluster using the Couchbase Management
REST API. Buckets can be used to isolate individual applications to provide
multi-tenancy, or to isolate data types in the cache to enhance performance and
visibility. Couchbase Server allows you to configure different ports to access
different buckets, and gives you the option to access isolated buckets using
either the binary protocol with SASL authentication, or the ASCII protocol with
no authentication

Couchbase Server enables you to use and mix different types of buckets,
Couchbase and Memcached, as appropriate in your environment. Buckets of
different types still share the same resource pool and cluster resources. Quotas
for RAM and disk usage are configurable per bucket so that resource usage can be
managed across the cluster. Quotas can be modified on a running cluster so that
administrators can reallocate resources as usage patterns or priorities change
over time.

For more information about creating and managing buckets, see the following
resources:

 * Bucket RAM Quotas: see [RAM
   Quotas](#couchbase-introduction-architecture-quotas).

 * Creating and Managing Buckets with Couchbase Web Console: see [Viewing Data
   Buckets](#couchbase-admin-web-console-data-buckets).

 * Creating and Managing Buckets with Couchbase REST-API: see [Managing
   Buckets](#couchbase-admin-restapi-bucketops).

 * Creating and Managing Buckets with Couchbase CLI (Command-Line Tool): see
   [couchbase-cli Tool](#couchbase-admin-cmdline-couchbase-cli).

<a id="couchbase-introduction-architecture-quotas"></a>

### RAM Quotas

RAM is allocated to Couchbase Server in two different configurable quantities,
the `Server Quota` and `Bucket Quota`. For more information about creating and
changing these two settings, see **Couldn't resolve xref tag:
couchbase-cli-other-examples** and [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit).

 * **Server Quota**

   The Server Quota is the RAM that is allocated to the server when Couchbase
   Server is first installed. This sets the limit of RAM allocated by Couchbase for
   caching data *for all buckets* and is configured on a per-node basis. The Server
   Quota is initially configured in the first server in your cluster is configured,
   and the quota is identical on all nodes. For example, if you have 10 nodes and a
   16GB Server Quota, ther is 160GB RAM available across the cluster. If you were
   to add two more nodes to the cluster, the new nodes would need 16GB of free RAM,
   and the aggregate RAM available in the cluster would be 192GB.

 * **Bucket Quota**

   The Bucket Quota is the amount of RAM allocated to an individual bucket for
   caching data. Bucket quotas are configured on a per-node basis, and is allocated
   out of the RAM defined by the Server Quota. For example, if you create a new
   bucket with a Bucket Quota of 1GB, in a 10 node cluster there would be an
   aggregate bucket quota of 10GB across the cluster. Adding two nodes to the
   cluster would extend your aggregate bucket quota to 12GB.


![](images/ram-quotas.png)

From this description and diagram, you can see that adding new nodes to the
cluster expands the overal RAM quota, and the bucket quota, increasing the
amount of information that can be kept in RAM.

[The Bucket Quota is used by the system to determine when data should
beejected](#couchbase-introduction-architecture-ejection-eviction) from memory.
Bucket Quotas are dynamically configurable within the limit of your Server
Quota, and enable you to individually control the caching of information in
memory on a per bucket basis. You can therefore configure different buckets to
cope with your required caching RAM allocation requirements.

The Server Quota is also dynamically configurable, but care must be taken to
ensure that the nodes in your cluster have the available RAM to support your
chosen RAM quota configuration.

For more information on changing Couchbase Quotas, see **Couldn't resolve xref
tag: couchbase-admin-tasks-quotas**.

<a id="couchbase-introduction-architecture-vbuckets"></a>

### vBuckets

A vBucket is defined as the *owner* of a subset of the key space of a Couchbase
cluster. These vBuckets are used to allow information to be distributed
effectively across the cluster. The vBucket system is used both for distributing
data, and for supporting replicas (copies of bucket data) on more than one node.

Clients access the information stored in a bucket by communicating directly with
the node response for the corresponding vBucket. This direct access enables
clients to communicate with the node storing the data, rather than using a proxy
or redistribution architecture. The result is abstracting the physical toplogy
from the logical partitioning of data. This architecture is what gives Coucbase
Server the elasticity.

This architecture differs from the method used by `memcached`, which uses
client-side key hashes to determine the server from a defined list. This
requires active management of the list of servers, and specific hashing
algorithms such as Ketama to cope with changes to the topology. The structure is
also more flexible and able to cope with changes than the typical sharding
arrangement used in an RDBMS environment.

vBuckets are not a user-accessible component, but they are a critical component
of Couchbase Server and are vital to the availability support and the elastic
nature.

Every document ID belongs to a vBucket. A mapping function is used to calculate
the vBucket in which a given document belongs. In Couchbase Server, that mapping
function is a hashing function that takes a document ID as input and outputs a
vBucket identifier. Once the vBucket identifier has been computed, a table is
consulted to lookup the server that "hosts" that vBucket. The table contains one
row per vBucket, pairing the vBucket to its hosting server. A server appearing
in this table can be (and usually is) responsible for multiple vBuckets.

The diagram below shows how the Key to Server mapping (vBucket map) works. There
are three servers in the cluster. A client wants to look up ( `get` ) the value
of KEY. The client first hashes the key to calculate the vBucket which owns KEY.
In this example, the hash resolves to vBucket 8 ( `vB8` ) By examining the
vBucket map, the client determines Server C hosts vB8. The `get` operation is
sent directly to Server C.


![](images/vbuckets.png)

After some period of time, there is a need to add a server to the cluster. A new
node, Server D is added to the cluster and the vBucket Map is updated.


![](images/vbuckets-after.png)

[The vBucket map is updated during
therebalance](#couchbase-introduction-architecture-rebalancing) operation; the
updated map is then sent the cluster to all the cluster participants, including
the other nodes, any connected "smart" clients, and the Moxi proxy service.

Within the new four-node cluster model, when a client again wants to `get` the
value of KEY, the hashing algorithm will still resolve to vBucket 8 ( `vB8` ).
The new vBucket map however now maps that vBucket to Server D. The client now
communicates directly with Server D to obtain the information.

<a id="couchbase-introduction-architecture-datainram"></a>

### Caching Layer

The architecture of Couchbase Server includes a built-in caching layer. This
caching layer acts as a central part of the server and provides very rapid reads
and writes of data. Other database solutions read and write data from disk,
which results in much slower performance. One alternative approach is to install
and manage a caching layer as a separate component which will work with a
database. This approach also has drawbacks because the burden of managing
transfer of data between caching layer and database and the burden managing the
caching layer results in significant custom code and effort.

In contrast Couchbase Server automatically manages the caching layer and
coordinates with disk space to ensure that enough cache space exists to maintain
performance. Couchbase Server automatically places items that come into the
caching layer into disk queue so that it can write these items to disk. If the
server determines that a cached item is infrequently used, it can remove it from
RAM to free space for other items. Similarly the server can retrieve
infrequently-used items from disk and store them into the caching layer when the
items are requested. So the entire process of managing data between the caching
layer and data persistence layer is handled entirely by server. In order provide
the most frequently-used data while maintaining high performance, Couchbase
Server manages a *working set* of your entire information; this set consists of
the all data you most frequently access and is kept in RAM for high performance.

Couchbase automatically moves data from RAM to disk asynchronously in the
background in order to keep frequently used information in memory, and less
frequently used data on disk. Couchbase constantly monitors the information
accessed by clients, and decides how to keep the active data within the caching
layer. Data is ejected to disk from memory in the background while the server
continues to service active requests. During sequences of high writes to the
database, clients will be notified that the server is temporarily out of memory
until enough items have been ejected from memory to disk. The asynchronous
nature and use of queues in this way enables reads and writes to be handled at a
very fast rate, while removing the typical load and performance spikes that
would otherwise cause a traditional RDBMS to produce erratic performance.

When the server stores data on disk and a client requests the data, it sends an
individual document ID then the server determines whether the information exists
or not. Couchbase Server does this with metadata structures. The `metadata`
holds information about each document in the database and this information is
held in RAM. This means that the server can always return a 'document ID not
found' response for an invalid document ID or it can immediately return the data
from RAM, or return it after it fetches it from disk.

<a id="couchbase-introduction-architecture-diskstorage"></a>

### Disk Storage

For performance, Couchbase Server mainly stores and retrieves information for
clients using RAM. At the same time, Couchbase Server will eventually store all
data to disk to provide a higher level of reliability. If a node fails and you
lose all data in the caching layer, you can still recover items from disk. We
call this process of disk storage *eventual persistence* since the server does
not block a client while it writes to disk, rather it writes data to the caching
layer and puts the data into a disk write queue to be persisted to disk. Disk
persistence enables you to perform backup and restore operations, and enables
you to grow your datasets larger than the built-in caching layer. For more
information, see [Ejection, Eviction and Working Set
Management](#couchbase-introduction-architecture-ejection-eviction).

When the server identifies an item that needs to be loaded from disk because it
is not in active memory, the process is handled by a background process that
processes the load queue and reads the information back from disk and into
memory. The client is made to wait until the data has been loaded back into
memory before the information is returned.

**Multiple Readers and Writers**

As of Couchbase Server 2.1, we support multiple readers and writers to persist
data onto disk. For earlier versions of Couchbase Server, each server instance
had only single disk reader and writer threads. Disk speeds have now increased
to the point where single read/write threads do not efficiently keep up with the
speed of disk hardware. The other problem caused by single read/writes threads
is that if you have a good portion of data on disk and not RAM, you can
experience a high level of cache misses when you request this data. In order to
utilize increased disk speeds and improve the read rate from disk, we now
provide multi-threaded readers and writers so that multiple processes can
simultaneously read and write data on disk:


![](images/threads_read_write.png)

This multi-threaded engine includes additional synchronization among threads
that are access the same data cache to avoid conflicts. To maintain performance
while avoiding conflicts over data we use a form of locking between threads as
well as thread allocation among vBuckets with static partitioning. When
Couchbase Server creates multiple reader and writer threads, the server assesses
a range of vBuckets for each thread and assigns each thread exclusively to
certain vBuckets. With this static thread coordination, the server schedules
threads so that only a single reader and single writer thread that access the
same vBucket at any given time. We show this in the image above with six
pre-allocated threads and two data Buckets. Each thread has the range of
vBuckets that is statically partitioned for read and write access.

For information about configuring this option, see [Using Multi- Readers and
Writers](#couchbase-admin-tasks-mrw).

**Document Deletion from Disk**

[Couchbase Server will never delete entire items from disk unless a client
explicitly deletes the item from the database or
theexpiration](#couchbase-introduction-architecture-expiration) value for the
item is reached. The ejection mechanism removes an item from RAM, while keeping
a copy of the key and metadata for that document in RAM and also keeping copy of
that document on disk. For more information about document expiration and
deletion, see [Couchbase Developer Guide, About Document
Expiration](http://www.couchbase.com/docs/couchbase-devguide-2.0/about-ttl-values.html).

<a id="couchbase-introduction-architecture-ejection-eviction"></a>

### Ejection, Eviction and Working Set Management

*Ejection* is a process automatically performed by Couchbase Server; it is the
process of removing data from RAM to provide room for frequently-used items.
When Couchbase Server ejects information, it works in conjunction with the disk
persistence system to ensure that data in RAM has been persisted to disk and can
be safely retrieved back into RAM if the item is requested. The process that
Couchbase Server performs to free space in RAM, and to ensure the most-used
items are still available in RAM is also known as *working set management*.

In addition to memory quota for the caching layer, there are two watermarks the
engine will use to determine when it is necessary to start persisting more data
to disk. These are `mem_low_wat` and `mem_high_wat`.

As the caching layer becomes full of data, eventually the mem\_low\_wat is
passed. At this time, no action is taken. As data continues to load, it will
eventually reach `mem_high_wat`. At this point a background job is scheduled to
ensure items are migrated to disk and the memory is then available for other
Couchbase Server items. This job will run until measured memory reaches
`mem_low_wat`. If the rate of incoming items is faster than the migration of
items to disk, the system may return errors indicating there is not enough
space. This will continue until there is available memory. The process of
removing data from the caching to make way for the actively used information is
called `ejection`, and is controlled automatically through thresholds set on
each configured bucket in your Couchbase Server Cluster.


![](images/couchbase-060711-1157-32_img_300.jpg)

Some of you may be using only memcached buckets with Couchbase Server; in this
case the server provides only a caching layer as storage and no data persistence
on disk. If your server runs out of space in RAM, it will *evict* items from RAM
on a least recently used basis (LRU). Eviction means the server will remove the
key, metadata and all other data for the item from RAM. After eviction, the item
is irretrievable.

For more detailed technical information about ejection and working set
management, including any administrative tasks which impact this process, see
[Ejection and Working Set Management](#couchbase-admin-tasks-working-set-mgmt).

<a id="couchbase-introduction-architecture-expiration"></a>

### Expiration

Each document stored in the database has an optional expiration value (TTL, time
to live). The default is for there to be no expiration, i.e. the information
will be stored indefinitely. The expiration can be used for data that naturally
has a limited life that you want to be automatically deleted from the entire
database.

The expiration value is user-specified on a document basis at the point when the
data is stored. The expiration can also be updated when the data is updated, or
explicitly changed through the Couchbase protocol. The expiration time can
either be specified as a relative time (for example, in 60 seconds), or absolute
time (31st December 2012, 12:00pm).

Typical uses for an expiration value include web session data, where you want
the actively stored information to be removed from the system if the user
activity has stopped and not been explicitly deleted. The data will time out and
be removed from the system, freeing up RAM and disk for more active data.

<a id="couchbase-introduction-architecture-warmup"></a>

### Server Warmup

Anytime you restart the Couchbase Server, or when you restore data to a server
instance, the server must undergo a *warmup* process before it can handle
requests for the data. During warmup the server loads data from disk into RAM;
after the warmup process completes, the data is available for clients to read
and write. Depending on the size and configuration of your system and the amount
of data persisted in your system, server warmup may take some time to load all
of the data into memory.

Couchbase Server 2.0 provides a more optimized warmup process; instead of
loading data sequentially from disk into RAM, it divides the data to be loaded
and handles it in multiple phases. Couchbase Server is also able to begin
serving data before it has actually loaded all the keys and data from vBuckets.
For more technical details about server warmup and how to manage server warmup,
see [Handling Server Warmup](#couchbase-admin-tasks-warmup-access).

<a id="couchbase-introduction-architecture-rebalancing"></a>

### Rebalancing

The way data is stored within Couchbase Server is through the distribution
offered by the vBucket structure. If you want to expand or shrink your Couchbase
Server cluster then the information stored in the vBuckets needs to be
redistributed between the available nodes, with the corresponding vBucket map
updated to reflect the new structure. This process is called `rebalancing`.

Rebalancing is an deliberate process that you need to initiate manually when the
structure of your cluster changes. The rebalance process changes the allocation
of the vBuckets used to store the information and then physically moves the data
between the nodes to match the new structure.

The rebalancing process can take place while the cluster is running and
servicing requests. Clients using the cluster read and write to the existing
structure with the data being moved in the background between nodes. Once the
moving process has been completed, the vBucket map is updated and communicated
to the smart clients and the proxy service (Moxi).

The result is that the distribution of data across the cluster has been
rebalanced, or smoothed out, so that the data is evenly distributed across the
database, taking into account the data and replicas of the data required to
support the system.

<a id="couchbase-introduction-architecture-replication"></a>

### Replicas and Replication

In addition to distributing information across the cluster for even data
distribution and cluster performance, you can also establish *replica vBuckets*
within a single Couchbase cluster.

A copy of data from one bucket, known as a *source* will be copied to a
*destination*, which we also refer to as the replica, or replica vBucket. The
node that contains the replica vBucket is also referred to as the *replica node*
while the node containing original data to be replicated is called a *source
node*. Distribution of replica data is handled in the same way as data at a
source node; portions of replica data will be distributed around the cluster to
prevent a single point of failure.

After Couchbase has stored replica data at a destination node, the data will
also be placed in a queue to be persisted on disk at that destination node. For
more technical details about data replication within Couchbase clusters, or to
learn about any configurations for replication, see [Handling Replication within
a Cluster](#couchbase-admin-tasks-intercluster-replication).

As of Couchbase Server 2.0, you are also able to perform replication between two
Couchbase clusters. This is known as cross datacenter replication (XDCR) and can
provide a copy of your data at a cluster which is closer to your users, or to
provide the data in case of disaster recovery. For more information about
replication between clusters via XDCR see [Cross Datacenter Replication
(XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-introduction-architecture-failover"></a>

### Failover

Information is distributed around a cluster using a series of replicas. For
Couchbase buckets you can configure the number of `replicas` (complete copies of
the data stored in the bucket) that should be kept within the Couchbase Server
Cluster.

In the event of a failure in a server (either due to transient failure, or for
administrative purposes), you can use a technique called `failover` to indicate
that a node within the Couchbase Cluster is no longer available, and that the
replica vBuckets for the server are enabled.

The failover process contacts each server that was acting as a replica and
updates the internal table that maps client requests for documents to an
available server.

Failover can be performed manually, or you can use the built-in automatic
failover that reacts after a preset time when a node within the cluster becomes
unavailable.

For more information, see [Failing Over Nodes](#couchbase-admin-tasks-failover).

<a id="couchbase-introduction-architecture-tap"></a>

### TAP

The TAP protocol is an internal part of the Couchbase Server system and is used
in a number of different areas to exchange data throughout the system. TAP
provides a stream of data of the changes that are occurring within the system.

TAP is used during replication, to copy data between vBuckets used for replicas.
It is also used during the rebalance procedure to move data between vBuckets and
redestribute the information across the system.

<a id="couchbase-introduction-architecture-clientinterface"></a>

### Client Interface

Within Couchbase Server, the techniques and systems used to get information into
and out of the database differ according to the level and volume of data that
you want to access. The different methods can be identified according to the
base operations of Create, Retrieve, Update and Delete:

 * **Create**

   Information is stored into the database using the memcached protocol interface
   to store a *value* against a specified *key*. Bulk operations for setting the
   key/value pairs of a large number of documents at the same time are available,
   and these are more efficient than multiple smaller requests.

   The value stored can be any binary value, including structured and unstructured
   strings, serialized objects (from the native client language), native binary
   data (for example, images or audio). For use with the Couchbase Server View
   engine, information must be stored using the JavaScript Object Notation (JSON)
   format, which structures information as a object with nested fields, arrays, and
   scalar datatypes.

 * **Retrieve**

   To retrieve information from the database, there are two methods available:

    * **By Key**

      If you know the key used to store a particular value, then you can use the
      memcached protocol (or an appropriate memcached compatible client-library) to
      retrieve the value stored against a specific key. You can also perform bulk
      operations

    * **By View**

      If you do not know the key, you can use the View system to write a view that
      outputs the information you need. The view generates one or more rows of
      information for each JSON object stored in the database. The view definition
      includes the keys (used to select specific or ranges of information) and values.
      For example, you could create a view on contact information that outputs the
      JSON record by the contact's name, and with a value containing the contacts
      address. Each view also outputs the key used to store the original object. IF
      the view doesn't contain the information you need, you can use the returned key
      with the memcached protocol to obtain the complete record.

 * **Update**

   To update information in the database, you must use the memcached protocol
   interface. The memcached protocol includes functions to directly update the
   entire contents, and also to perform simple operations, such as appending
   information to the existing record, or incrementing and decrementing integer
   values.

 * **Delete**

   To delete information from Couchbase Server you need to use the memcached
   protocol which includes an explicit delete command to remove a key/value pair
   from the server.

   However, Couchbase Server also allows information to be stored in the database
   with an expiry value. The expiry value states when a key/value pair should be
   automatically deleted from the entire database, and can either be specified as a
   relative time (for example, in 60 seconds), or absolute time (31st December
   2012, 12:00pm).

The methods of creating, updating and retrieving information are critical to the
way you work with storing data in Couchbase Server.

<a id="couchbase-introduction-architecture-administration"></a>

### Administration Tools

Couchbase Server was designed to be as easy to use as possible, and does not
require constant attention. Administration is however offered in a number of
different tools and systems. For a list of the most common administration tasks,
see [Administration Tasks](#couchbase-admin-tasks).

Couchbase Server includes three solutions for managing and monitoring your
Couchbase Server and cluster:

 * **Web Administration Console**

   Couchbase Server includes a built-in web-administration console that provides a
   complete interface for configuring, managing, and monitoring your Couchbase
   Server installation.

   For more information, see [Using the Web Console](#couchbase-admin-web-console).

 * **Administration REST API**

   In addition to the Web Administration console, Couchbase Server incorporates a
   management interface exposed through the standard HTTP REST protocol. This REST
   interface can be called from your own custom management and administration
   scripts to support different operations.

   Full details are provided in [Using the REST API](#couchbase-admin-restapi)

 * **Command Line Interface**

   Couchbase Server includes a suite of command-line tools that provide information
   and control over your Couchbase Server and cluster installation. These can be
   used in combination with your own scripts and management procedures to provide
   additional functionality, such as automated failover, backups and other
   procedures. The command-line tools make use of the REST API.

   For information on the command-line tools available, see [Command-line Interface
   for Administration](#couchbase-admin-cmdline).

<a id="couchbase-introduction-architecture-stats"></a>

### Statistics and Monitoring

In order to understand what your cluster is doing and how it is performing,
Couchbase Server incorporates a complete set of statistical and monitoring
information. The statistics are provided through all of the administration
interfaces. Within the Web Administration Console, a complete suite of
statistics are provided, including built-in real-time graphing and performance
data.

The statistics are divided into a number of groups, allowing you to identify
different states and performance information within your cluster:

 * **By Node**

   Node statistics show CPU, RAM and I/O numbers on each of the servers and across
   your cluster as a whole. This information can be used to help identify
   performance and loading issues on a single server.

 * **By vBucket**

   The vBucket statistics show the usage and performance numbers for the vBuckets
   used to store information in the cluster. These numbers are useful to determine
   whether you need to reconfigure your buckets or add servers to improve
   performance.

 * **By View**

   View statistics display information about individual views in your system,
   including the CPU usage and disk space used so that you can monitor the effects
   and loading of a view on your Couchbase nodes. This information may indicate
   that your views need modification or optimization, or that you need to consider
   defining views across multiple design documents.

 * **By Disk Queues**

   These statistics monitor the queues used to read and write information to disk
   and between replicas. This information can be helpful in determining whether you
   should expand your cluster to reduce disk load.

 * **By TAP Queues**

   The TAP interface is used to monitor changes and updates to the database. TAP is
   used internally by Couchbase to provide replication between Couchbase nodes, but
   can also be used by clients for change notifications.

In nearly all cases the statistics can be viewed both on a whole of cluster
basis, so that you can monitor the overall RAM or disk usage for a given bucket,
or an individual server basis so that you can identify issues within a single
machine.

<a id="couchbase-introduction-migration"></a>

## Migration to Couchbase

Couchbase Server is based on components from both Membase Server and CouchDB. If
you are a user of these database systems, or are migrating from these to
Couchbase Server, the following information may help in translating your
understanding of the main concepts and terms.

<a id="couchbase-introduction-migration-membase"></a>

### Migrating for Membase Users

For an existing Membase user the primary methods for creating, adding,
manipulating and retrieving data remain the same. In addition, the background
operational elements of your Couchbase Server deployment will not differ from
the basic running of a Membase cluster.

 * **Term and Concept Differences**

   The following terms are new, or updated, in Couchbase Server:

    * `Views`, and the associated terms of the `map` and `reduce` functions used to
      define views. Views provide an alternative method for accessing and querying
      information stored in key/value pairs within Couchbase Server. Views allow you
      to query and retrieve information based on the values of the contents of a
      key/value pair, providing the information has been stored in JSON format.

    * *JSON (JavaScript Object Notation)*, a data representation format that is
      required to store the information in a format that can be parsed by the View
      system is new.

    * *Membase Server* is now *Couchbase Server*.

    * *Membase Buckets* are now *Couchbase Buckets*.

 * **Consistent Functionality**

   The core functionality of Membase, including the methods for basic creation,
   updating and retrieval of information all remain identical within Couchbase
   Server. You can continue to use the same client protocols for setting and
   retrieving information.

   The administration, deployment, and core of the web console and administration
   interfaces are also identical. There are updates and improvements to support
   additional functionality which is included in existing tools. These include
   View-related statistics, and an update to the Web Administration Console for
   building and defining views.

 * **Changed Functionality**

   The main difference of Couchbase Server is that in addition to the key/value
   data store nature of the database, you can also use Views to convert the
   information from individual objects in your database into lists or tables of
   records and information. Through the view system, you can also query data from
   the database based on the value (or fragment of a value) of the information that
   you have stored in the database against a key.

   This fundamental differences means that applications no longer need to manually
   manage the concept of lists or sets of data by using other keys as a lookup or
   compounding values.

 * **Operational and Deployment Differences**

   The main components of the operation and deployment of your Couchbase Server
   remain the same as with Membase Server. You can add new nodes, failover,
   rebalance and otherwise manage your nodes as normal.

   However, the introduction of Views means that you will need to monitor and
   control the design documents and views that are created alongside your bucket
   configurations. Indexes are generated for each design document (i.e. multiple
   views), and for optimum reliability you may want to backup the generated index
   information to reduce the time to bring up a node in the event of a failure, as
   building a view from raw data on large datasets may take a significant amount of
   time.

   In addition, you will need to understand how to recreate and rebuild View data,
   and how to compact and clean-up view information to help reduce disk space
   consumption and response times.

 * **Client and Application Changes**

   Clients can continue to communicate with Couchbase Server using the existing
   memcached protocol interface for the basic create, retrieve, update and delete
   operations for key/value pairs. However, to access the View functionality you
   must use a client library that supports the view API (which uses HTTP REST).

   To build Views that can output and query your stored data, your objects must be
   stored in the database using the JSON format. This may mean that if you have
   been using the native serialisation of your client library to convert a language
   specific object so that it can be stored into Membase Server, you will now need
   to structure your data and use a native to JSON serialization solution, or
   reformat your data so that it can be formated as JSON.

<a id="couchbase-introduction-migration-couchdb"></a>

### Migrating for CouchDB Users

Although Couchbase Server incorporates the view engine functionality built into
CouchDB, the bulk of the rest of the functionality is supported through the
components and systems of Membase Server.

This change introduces a number of significant differences for CouchDB users
that want to use Couchbase Server, particularly when migrating existing
applications. However, you also gain the scalability and performance advantages
of the Membase Server components.

 * **Term and Concept Differences**

   Within CouchDB information is stored into the database using the concept of a
   document ID (either explicit or automatically generated), against which the
   document (JSON) is stored. Within Couchbase, there is no document ID, instead
   information is stored in the form of a key/value pair, where the key is
   equivalent to the document ID, and the value is equivalent to the document. The
   format of the data is the same.

   Almost all of the HTTP REST API that makes up the interface for communicating
   with CouchDB does not exist within Couchbase Server. The basic document
   operations for creating, retrieving, updating and deleting information are
   entirely supported by the memcached protocol.

   Also, beyond views, many of the other operations are unsupported at the client
   level within CouchDB. For example, you cannot create a new database as a client,
   store attachments, or perform administration-style functions, such as view
   compaction.

   Couchbase Server does not support the notion of databases, instead information
   is stored within logical containers called Buckets. These are logically
   equivalent and can be used to compartmentalize information according to projects
   or needs. With Buckets you get the additional capability to determine the number
   of replicas of the information, and the port and authentication required to
   access the information.

 * **Consistent Functionality**

   The operation and interface for querying and creating view definitions in
   Couchbase Server is mostly identical. Views are still based on the combination
   of a map/reduce function, and you should be able to port your map/reduce
   definitions to Couchbase Server without any issues. The main difference is that
   the view does not output the document ID, but, as previously noted, outputs the
   key against which the key/value was stored into the database.

   Querying views is also the same, and you use the same arguments to the query,
   such as a start and end docids, returned row counts and query value
   specification, including the requirement to express your key in the form of a
   JSON value if you are using compound (array or hash) types in your view key
   specification. Stale views are also supported, and just as with CouchDB,
   accessing a stale view prevents Couchbase Server from updating the index.

 * **Changed Functionality**

   There are many changes in the functionality and operation of Couchbase Server
   than CouchDB, including:

    * Basic data storage operations must use the memcached API.

    * Explicit replication is unsupported. Replication between nodes within a cluster
      is automatically configured and enabled and is used to help distribute
      information around the cluster.

    * You cannot replicate between a CouchDB database and Couchbase Server.

    * Explicit attachments are unsupported, but you can store additional files as new
      key/value pairs into the database.

    * CouchApps are unsupported.

    * Update handlers, document validation functions, and filters are not supported.

    * Futon does not exist, instead there is an entire Web Administration Console
      built into Couchbase Server that provides cluster configuration, monitoring and
      view/document update functionality.

 * **Operational and Deployment Differences**

   From a practical level the major difference between CouchDB and Couchbase Server
   is that options for clustering and distribution of information are significantly
   different. With CouchDB you would need to handle the replication of information
   between multiple nodes and then use a proxy service to distribute the load from
   clients over multiple machines.

   With Couchbase Server, the distribution of information is automatic within the
   cluster, and any Couchbase Server client library will automatically handle and
   redirect queries to the server that holds the information as it is distributed
   around the cluster. This process is automatic.

 * **Client and Application Changes**

   As your CouchDB based application already uses JSON for the document
   information, and a document ID to identify each document, the bulk of your
   application logic and view support remain identical. However, the HTTP REST API
   for basic CRUD operations must be updated to use the memcached protocol.

   Additionally, because CouchApps are unsupported you will need to develop a
   client side application to support any application logic.

<a id="couchbase-getting-started"></a>
