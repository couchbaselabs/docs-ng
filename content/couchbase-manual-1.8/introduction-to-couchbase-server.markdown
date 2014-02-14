# Introduction to Couchbase Server

Couchbase Server is a distributed, document ("NoSQL") database management
system, designed to store the information for web applications. Couchbase Server
provides a managed in-memory caching tier, so that it supports very fast create,
store, update and retrieval operations.

These features are designed to support web application development where the
high-performance characteristics are required to support low-latency and high
throughput applications. Couchbase Server achieves this on a single server and
provides support for the load to be increased almost linearly by making use of
the clustered functionality built into Couchbase Server.

The cluster component distributes data over multiple servers to share the data
and I/O load, while incorporating intelligence into the server and client access
libraries that enable clients to quickly access the right node within the
cluster for the information required. This intelligent distribution allows
Couchbase Server to provide excellent scalability that can be extended simply by
adding more servers as your load and application requirements increase.

For a more in-depth description of Couchbase Server, see the following sections:

 * The guiding principles and design goals of Couchbase Server are covered in
   [Couchbase Server Basics](#couchbase-introduction-basics).

 * Couchbase Server is part of the NoSQL database movement. For background
   information on what NoSQL is, and how this maps to Couchbase Server
   functionality, see [Couchbase Server and NoSQL](#couchbase-introduction-nosql).

 * Information on the different components and systems in Couchbase Server, and how
   these map to the concepts and architecture required to understand the
   fundamentals of how it works are provided in [Architecture and
   Concepts](#couchbase-introduction-architecture).

<a id="couchbase-introduction-basics"></a>

## Couchbase Server Basics

Couchbase Server is a database platform that combines the principles and
components of Membase Server and Apache CouchDB. From Membase Server, Couchbase
Server builds on the high performance, memory-based, document storage interface,
and incorporates the core principles of being *Simple*, *Fast*, and *Elastic*.

 * **Simple**

   Couchbase Server is easy to install and manage, and through the document nature
   and memcached protocol interface, an easy to use database system. Because the
   database uses the document structure you do not need to create or manage the
   databases, tables and schemas. The simplified structure also means that the
   information can be distributed across nodes in a Couchbase Cluster
   automatically, without having to worry about normalizing or sharding your data
   to scale out performance.

 * **Fast**

   Couchbase Server is fast, primarily because of the in-memory nature of the
   database. Furthermore, Couchbase Server provides quasi-deterministic latency and
   throughput, meaning that you can predict and rely on the speed and performance
   of your database without having to prepare and cope for spikes in load and
   problems.

 * **Elastic**

   Couchbase Server was built from the core with the ability to expand and
   distribute the load across multiple servers. This is achieved through a
   combination of intelligence built into the server for distributing the stored
   data, and complimentary intelligence for clients accessing the data to be
   directed to the right machine. Data is automatically redistributed across the
   cluster, and changing the capacity of the cluster is a case of adding or
   removing nodes and *rebalancing* the cluster.

   In tandem with the elastic nature of Couchbase Server, a Couchbase Cluster also
   takes advantage of the clustered architecture to support high availability. All
   nodes in a cluster are identical, and the cluster automatically creates replicas
   of information across the cluster. If a node fails, the stored data will be
   available on another node in the cluster.

 * **memcached Compatibility**

   memcached is an memory-based caching application that uses the notion of a
   document store to save important data that are required by applications directly
   in RAM. Because the information is stored entirely in RAM, the latency for
   storing and retrieving information is very low. As a caching solution, memcached
   is used by a wide range of companies, including Google, Facebook, YouTube,
   Twitter and Wikipedia to help speed up their web-application performance by
   acting as a storage location for objects retrieved at comparative expense from a
   traditional SQL database.

   Couchbase Server supports the same client protocol used by memcached for
   creating, retrieving, updating and deleting information in the database. This
   enables Couchbase Server to be a drop-in replacement for memcached, and this
   means that applications already employing memcached can take advantage of the
   other functionality within Couchbase Server, such as clustered and elastic
   distribution.

<a id="couchbase-introduction-nosql"></a>

## Couchbase Server and NoSQL

*NoSQL* is a somewhat unfortunate term that has been widely used to describe a
class of database management systems that don't employ a relational data model.
The terminology keys off the SQL query language - a hallmark of relational
database management systems. Unfortunately the query language is not the real
differentiator; in fact, it is not necessarily a differentiator at all. Some
*NoSQL* database management systems do, in fact, support the SQL query language!
The fundamental difference in these systems lies not in the query language, but
in the non-relational data model they employ. While *non-relational* database
would be a more technically accurate term, it would also be more broad than the
term *NoSQL* intends. It is interesting to note that a *backronym* has emerged
in which NoSQL is proposed to stand for *Not Only SQL.* While more accurate, it
is even less descriptive.

NoSQL databases are characterized by their ability to store data without first
requiring one to define a database schema. In Couchbase Server, data is stored
as a distributed, associative array of document IDs and contents, where the
value is a *blob* of opaque binary data that doesn't conform to a rigid,
pre-defined schema from the perspective of the database management system
itself. Additionally, and largely enabled by their schema-less nature, these
systems tend to support a *scale out* approach to growth, increasing data and
I/O capacity by adding more servers to a cluster; and without requiring any
change to application software. In contrast, relational database management
systems *scale up* by adding more capacity (CPU, Memory and Disk) to a single
server to accommodate growth.

Relational databases store information in relations which must be defined, or
modified, before data can be stored. A relation is simply a table of rows, where
each row (also known as a tuple) in a given relation has a fixed set of
attributes (columns). These columns are consistent across each row in a
relation. Relations (tables) can be further connected through cross-table
references. One table, CITIZENS for example, could hold rows of all individual
citizens residing in a town. Another table, PARENTS, could have rows consisting
of PARENT, CHILD and RELATIONSHIP fields. The first two fields could be
references to rows in the CITIZENS table while the third field describes the
parental relationship between the persons in the first two fields (father,
mother).

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

   A cluster is a collection of one or more instances of Couchbase Server that are
   configured as a logical cluster. All nodes within the cluster are identical and
   provide the same functionality. Each node is capable of managing the cluster and
   each node can provide aggregate statistics and operational information about the
   cluster. User data is stored across the entire cluster through the vBucket
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

<a id="couchbase-introduction-architecture-quotas"></a>

### Memory Quotas

Couchbase Server manages the memory used across different components of the
system:

 * **Managing Disk and Memory for Nodes in the Cluster**

   Couchbase Server automatically manages storing the working set between disk and
   memory resources for nodes in a cluster. This allows an installation to have a
   working set that is larger than the available RAM in the nodes participating in
   the cluster. To keep throughput high and latency low, Couchbase Server will
   always keep metadata about all items in memory.

   When configuring a Couchbase Server, a memory quota is set. Couchbase Server
   will automatically migrate items from memory to disk when the configured memory
   quota is reached. If those items are later accessed, they will be moved back
   into system memory. For efficiency purposes, these operations are performed on a
   regular basis in the background.

   At the moment, there is no ability define a quota for the on-disk persistent
   storage. It is up to the administrator to appropriately monitor the disk
   utilization and take action (either deleting data from Couchbase or adding
   capacity by upgrading the nodes themselves or adding more nodes).

   Couchbase Server monitors and reports on statistics for managing disk and
   memory. As with any multi-tier cache, if the working set of data is greater than
   the available amount of the bucket RAM quota (the first level of caching),
   performance will drop due to disk access latencies being higher and disk
   throughput being lower than RAM latencies and throughput. Acceptable performance
   of the system is application dependent. Statistics should be monitored in case
   tuning adjustments are required.

 * **Server Quotas**

   Each server node has a memory quota that defines the amount of system memory
   that is available to that server node on the host system. The first node in a
   cluster sets a memory quota that is subsequently inherited by all servers
   joining the cluster. The maximum memory quota set on the first server node must
   be less than or equal to 80% of the total physical RAM on that node. A server
   cannot join a cluster if it has less physical RAM than 1.25x the RAM quota (the
   same maximum allocation of 80% of physical RAM to the cluster). If a server that
   was a standalone cluster joins another cluster, the memory quota is inherited
   from the cluster to which the node is added.

   Server nodes do not have disk quotas. System administrators are responsible for
   monitoring free disk space on individual server nodes. Each server node in a
   cluster has its own storage path - the location on disk where data will be
   stored. Storage paths do not need to be uniform across all server nodes in a
   cluster. If a server that was a standalone cluster joins another cluster, the
   storage path for that server remains unchanged.

 * **Bucket Quotas**

   Memory quota allocation is also controlled on a bucket-by-bucket basis. A fixed
   amount of memory per node is allocated for use by a bucket. Adding or removing
   nodes will change the size of the bucket.

For more information about creating and changing these node memory quota and
bucket quota, see [Initializing Nodes](#couchbase-cli-initializing-nodes) and
[Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit).

<a id="couchbase-introduction-architecture-buckets"></a>

### Buckets

Couchbase Server provides data management services using named buckets. These
are isolated virtual containers for data. A bucket is a logical grouping of
physical resources within a cluster of Couchbase Servers. They can be used by
multiple client applications across a cluster. Buckets provide a secure
mechanism for organizing, managing, and analyzing data storage resources.

Couchbase Server provides the two core types of buckets that can be created and
managed. Couchbase Server collects and reports on run-time statistics by bucket
type.

<a id="table-couchbase-introduction-architecture-bucket-types"></a>

Bucket Type | Description                                                                                                                                                                                                                                                                                                              
------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Couchbase   | Provides highly-available and dynamically reconfigurable distributed data storage, providing persistence and replication services. Couchbase buckets are 100% protocol compatible with, and built in the spirit of, the memcached open source distributed document cache.                                                
Memcached   | Provides a directly-addressed, distributed (scale-out), in-memory, document cache. Memcached buckets are designed to be used alongside relational database technology – caching frequently-used data, thereby reducing the number of queries a database server must perform for web servers delivering a web application.

The different bucket types support different capabilities. Couchbase-type
buckets provide a highly-available and dynamically reconfigurable distributed
data store. Couchbase-type buckets survive node failures and allow cluster
reconfiguration while continuing to service requests. Couchbase-type buckets
provide the following core capabilities.

<a id="table-couchbase-introduction-architecture-bucket-capabilities"></a>

Capability  | Description                                                                                                                                                                                                                                                                                                
------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Caching     | Couchbase buckets operate through RAM. Data is kept in RAM and persisted down to disk. Data will be cached in RAM until the configured RAM is exhausted, when data is ejected from RAM. If requested data is not currently in the RAM cache, it will be loaded automatically from disk.                    
Persistence | Data objects can be persisted asynchronously to hard-disk resources from memory to provide protection from server restarts or minor failures. Persistence properties are set at the bucket level.                                                                                                          
Replication | A configurable number of replica servers can receive copies of all data objects in the Couchbase-type bucket. If the host machine fails, a replica server can be promoted to be the host server, providing high avilability cluster operations via failover. Replication is configured at the bucket level.
Rebalancing | Rebalancing enables load distribution across resources and dynamic addition or removal of buckets and servers in the cluster.                                                                                                                                                                              

For more information on the bucket types, their configuration and accessibility,
see [Buckets](#couchbase-architecture-buckets).

Couchbase Server leverages the memcached storage engine interface and the
Couchbase Bucket Engine to enable isolated buckets that support multi-tenancy.


![](images/couchbase-060711-1157-32_img_25.jpg)

Smart clients discover changes in the cluster using the Couchbase Management
REST API. Buckets can be used to isolate individual applications to provide
multi-tenancy, or to isolate data types in the cache to enhance performance and
visibility. Couchbase Server allows you to configure different ports to access
different buckets, and gives you the option to access isolated buckets using
either the binary protocol with SASL authentication, or the ASCII protocol with
no authentication

Couchbase Server allows you to use and mix different types of buckets (Couchbase
and Memcached) as appropriate in your environment. Buckets of different types
still share the same resource pool and cluster resources. Quotas for RAM and
disk usage are configurable per bucket so that resource usage can be managed
across the cluster. Quotas can be modified on a running cluster so that
administrators can reallocate resources as usage patterns or priorities change
over time.

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

<a id="couchbase-introduction-architecture-datainram"></a>

### Data in RAM

The architecture of Couchbase Server includes a built-in caching layer. This
approach allows for very fast response times, since the data is initially
written to RAM by the client, and can be returned from RAM to the client when
the data is requested.

The effect of this design to provide an extensive built-in caching layer which
acts as a central part of the operation of the system. The client interface
works through the RAM-based data store, with information stored by the clients
written into RAM and data retrieved by the clients returned from RAM, or loaded
from disk into RAM before being returned to the client.

This process of storing and retrieving stored data through the RAM interface
ensures the best performance. For the highest performance, you should allocate
the maximum amount of RAM on each of your nodes. The aggregated RAM is used
across the cluster.

This is different in design to other database systems where the information is
written to the database and either a separate caching layer is employed, or the
caching provided by the operating system is used to kept regularly used
information in memory and accessible.

<a id="couchbase-introduction-architecture-ejection"></a>

### Ejection

Ejection is a mechanism used with Couchbase buckets, and is the process of
removing data from RAM to provide room for the active and more frequently used
information and is a key part of the caching mechanism. Ejection is automatic
and operates in conjunction with the disk persistence system to ensure that data
in RAM has been persisted to disk and can be safely ejected from the system.

The system ensures that the data stored in RAM will already have been written to
disk, so that it can be loaded back into RAM if the data is requested by a
client. Ejection is a key part of keeping the frequently used information in RAM
and ensuring there is space within the Couchbase RAM allocation to load that
data back into RAM when the information is requested by a client.

[For Couchbase buckets, data is never deleted from the system unless a client
explicitly deletes the document from the database or
theexpiration](#couchbase-introduction-architecture-expiration) value for the
document is reached. Instead, the ejection mechanism removes it from RAM,
keeping a copy of that information on disk.

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

<a id="couchbase-introduction-architecture-eviction"></a>

### Eviction

Eviction is the process of removing information entirely from memory for
`memcached` buckets. The `memcached` system uses a least recently used (LRU)
algorithm to remove data from the system entirely when it is no longer used.

Within a `memcached` bucket, LRU data is removed to make way for new data, with
the information being deleted, since there is no persistence for `memcached`
buckets.

<a id="couchbase-introduction-architecture-diskstorage"></a>

### Disk Storage

For performance, Couchbase Server prefers to store and provide information to
clients using RAM. However, this is not always possible or desirable in an
application. Instead, what is required is the 'working set' of information
stored in RAM and immediately available for supporting low-latency responses.

Couchbase Server stores data on disk, in addition to keeping as much data as
possible in RAM as part of the caching layer used to improve performance. Disk
persistence allows for easier backup/restore operations, and allows datasets to
grow larger than the built-in caching layer.

Couchbase automatically moves data between RAM and disk (asynchronously in the
background) in order to keep regularly used information in memory, and less
frequently used data on disk. Couchbase constantly monitors the information
accessed by clients, keeping the active data within the caching layer.

The process of removing data from the caching to make way for the actively used
information is called `ejection`, and is controlled automatically through
thresholds set on each configured bucket in your Couchbase Server Cluster.

The use of disk storage presents an issue in that a client request for an
individual document ID must know whether the information exists or not.
Couchbase Server achieves this using metadata structures. The `metadata` holds
information about each document stored in the database and this information is
held in RAM. This means that the server can always return a 'document ID not
found' response for an invalid document ID, while returning the data for an item
either in RAM (in which case it is returned immediately), or after the item has
been read from disk (after a delay, or until a timeout has been reached).

The process of moving information to disk is asynchronous. Data is ejected to
disk from memory in the background while the server continues to service active
requests. During sequences of high writes to the database, clients will be
notified that the server is temporarily out of memory until enough items have
been ejected from memory to disk.

Similarly, when the server identifies an item that needs to be loaded from disk
because it is not in active memory, the process is handled by a background
process that processes the load queue and reads the information back from disk
and into memory. The client is made to wait until the data has been loaded back
into memory before the information is returned.

The asynchronous nature and use of queues in this way enables reads and writes
to be handled at a very fast rate, while removing the typical load and
performance spikes that would otherwise cause a traditional RDBMS to produce
erratic performance.

<a id="couchbase-introduction-architecture-warmup"></a>

### Warmup

When Couchbase Server is re-started, or when it is started after a restore from
backup, the server goes through a warm-up process. The warm-up loads data from
disk into RAM, making the data available to clients.

The warmup process must complete before clients can be serviced. Depending on
the size and configuration of your system, and the amount of data that you have
stored, the warmup may take some time to load all of the stored data into
memory.

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

In addition to distributing information across the cluster for the purposes of
even data distribution and performance, Couchbase Server also includes the
ability to create additional replicas of the data. These replicas work in tandem
with the vBucket structure, with replicas of individual vBuckets distributed
data around the cluster. Distribution of replicas is handled in the same way as
the core data, with portions of the data distributed around the cluster to
prevent a single point of failure.

The replication of this data around this cluster is entirely peer-to-peer based,
with the information being exchanged directly between nodes in the cluster.
There is no topology, hierarchy or master/slave relationship. When the data is
written to a node within the cluster, the data is stored directly in the vBucket
and then distributed to one or more replica vBuckets simultaneously using the
TAP system.

In the event of a failure of one of the nodes in the system, the replica
vBuckets are enabled in place of the vBuckets that were failed in the bad node.
The process is near-instantaneous. Because the replicas are populated at the
same time as the original data, there is no need for the data to be copied over;
the replica vBuckets are there waiting to be enabled with the data already
within them. The replica buckets are enabled and the vBucket structure updated
so that clients now communicate with the updated vBucket structure.

Replicas are configured on each bucket. You can configure different buckets to
contain different numbers of replicas according to the required safety level for
your data. Replicas are only enabled once the number of nodes within your
cluster support the required number of replicas. For example, if you configure
three replicas on a bucket, the replicas will only be enabled once you have four
nodes.

The number of replicas for a bucket cannot be changed after the bucket has been
created.

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

For more information, see [Node Failover](#couchbase-admin-tasks-failover).

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
   to store a *document* against a specified *document ID*. Bulk operations for
   setting the value of a large number of documents at the same time are available,
   and these are more efficient than multiple smaller requests.

   The value stored can be any binary value, including structured and unstructured
   strings, serialized objects (from the native client language), native binary
   data (for example, images or audio).

 * **Retrieve**

   To retrieve, you must know the document ID used to store a particular value,
   then you can use the memcached protocol (or an appropriate memcached compatible
   client-library) to retrieve the value stored against a specific document ID. You
   can also perform bulk operations

 * **Update**

   To update information in the database, you must use the memcached protocol
   interface. The memcached protocol includes functions to directly update the
   entire contents, and also to perform simple operations, such as appending
   information to the existing record, or incrementing and decrementing integer
   values.

 * **Delete**

   To delete information from Couchbase Server you need to use the memcached
   protocol which includes an explicit delete command to remove a document from the
   server.

   However, Couchbase Server also allows information to be stored in the database
   with an expiry value. The expiry value states when a document should be
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

   For more information, see [Web Console for
   Administration](#couchbase-admin-web-console).

 * **Administration REST API**

   In addition to the Web Administration console, Couchbase Server incorporates a
   management interface exposed through the standard HTTP REST protocol. This REST
   interface can be called from your own custom management and administration
   scripts to support different operations.

   Full details are provided in [REST API for
   Administration](#couchbase-admin-restapi)

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

<a id="couchbase-getting-started"></a>
