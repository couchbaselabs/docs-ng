# Introduction to Couchbase

Couchbase Server is a NoSQL document database for interactive web applications.
It has a flexible data model, is easily scalable, provides consistent high
performance and is "always-on," meaning it is can serve application data 24
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

   The other advantage to the flexible, document-based data model is that it is
   well suited to representing real-world items and how you want to represent them.
   JSON documents support nested structures, as well as field representing
   relationships between items which enable you to realistically represent objects
   in your application.

 * **Easy Scalability**

   It is easy to scale your application with Couchbase Server, both within a
   cluster of servers and between clusters at different data centers. You can add
   additional instances of Couchbase Server to address additional users and growth
   in application data without any interruptions or changes in your application
   code. With one click of a button, you can rapidly grow your cluster of Couchbase
   Servers to handle additional workload and keep data evenly distributed.

   Couchbase Server provides automatic sharding of data and rebalancing at runtime;
   this lets you resize your server cluster on demand. Cross-data center
   replication providing in Couchbase Server 2.1.0 enables you to move data closer
   to your user at other data centers.

 * **Consistent High Performance**

   Couchbase Server is designed for massively concurrent data use and consistent
   high throughput. It provides consistent sub-millisecond response times which
   help ensure an enjoyable experience for users of your application. By providing
   consistent, high data throughput, Couchbase Server enables you to support more
   users with fewer servers. The server also automatically spreads workload across
   all servers to maintain consistent performance and reduce bottlenecks at any
   given server in a cluster.

 * **"Always Online"**

   Couchbase Server provides consistent sub-millisecond response times which help
   ensure an enjoyable experience for users of your application. By providing
   consistent, high data throughput, Couchbase Server enables you to support more
   users with fewer servers. The server also automatically spreads workload across
   all servers to maintain consistent performance and reduce bottlenecks at any
   given server in a cluster.

   Features such as cross-data center replication and auto-failover help ensure
   availability of data during server or datacenter failure.

All of these features of Couchbase Server enable development of web applications
where low–latency and high throughput are required by end users. Web
applications can quickly access the right information within a Couchbase cluster
and developers can rapidly scale up their web applications by adding servers.

<a id="couchbase-concepts"></a>

## Understanding Couchbase Concepts

Before you develop applications on the Couchbase Server, you will want to
understand key concepts and components that are related to application
development on Couchbase Server. This section provides an overview of concepts
and terms you will become familiar with as you create an application. For more
detailed information about underlying functions of Couchbase Server, data
storage, and cluster management, please refer to the [Couchbase Server
Manual](http://www.couchbase.com/docs/couchbase-manual-2.1.0/index.html).

<a id="couchbase-as-doc-store"></a>

### Couchbase as Document Store

The primary unit of data storage in Couchbase Server 2.1.0 is a JSON document,
which is a data structure capable of holding arrays and other complex
information. JSON documents are information-rich, flexible structures that
enable you to model objects as individual documents. By using JSON documents to
model your data, you can construct your application data as individual documents
which would otherwise require rigidly-defined relational database tables. This
provides storage for your web application which is well suited to serialized
objects and the programming languages that use them. Notably in Couchbase Server
2.1.0, as in previous versions of the server, you can also store binary objects,
such as integers and strings.

Because you model your application objects as documents, you do not need to
perform schema migrations. The documents you use and the fields they store will
indicate any relationships between application objects; therefore to update the
structure of objects you store, you merely change the document structure that
you write to Couchbase Server.

When you use Couchbase Server as a store for JSON documents, you also get the
ability to index and query your records. Couchbase Server 2.1.0 provides a
JavaScript-based query engine you use to find records based on field values. For
more information, see [Finding Data with
Views](couchbase-devguide-ready.html#indexing-querying-data).

For more information about working with JSON documents and Couchbase, see,
[Modeling Documents](couchbase-devguide-ready.html#modeling-documents).

<a id="couchbase-buckets"></a>

### Data Buckets

Your web application stores data in a Couchbase cluster using *buckets*. Buckets
are isolated, virtual containers which logically group records within a cluster;
they are the functional equivalent to a database. Buckets can be accessed by
multiple client applications across a cluster. They provide a secure mechanism
for organizing, managing and analyzing data storage. As an application developer
you will most likely create buckets for your development and production
environment.

For more information about data buckets in Couchbase Server, and how to create
them, see [Using Data Buckets](bucket-general-function) and [Couchbase Server
2.1.0 Manual, Data
Buckets](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-web-console-data-buckets.html)

<a id="keys-documents"></a>

### Keys and Metadata

All information that you store in Couchbase Server are documents with keys.
*Keys* are unique identifiers for a document, and *values* are either JSON
documents or if you choose the data you want to store can be byte stream, data
types, or other forms of serialized objects.

Keys are also known as document IDs and serve the same function as a SQL primary
key. A key in Couchbase Server can be any string, including strings with
separators and identifiers, such as 'person\_93679.' A key is unique.

By default, all documents contain three types of metadata which are provided by
the Couchbase Server. This information is stored with the document and is used
to change how the document is handled:

 * **Cas Value** —Also called *cas token* or *cas ID* ; this is a unique identifier
   associated with a document, and verified by the Couchbase Server before a
   document is deleted or changed. This provides a form of basic optimistic
   concurrency; when Couchbase Server checks a CAS value before changing data, it
   effectively prevents data loss without having to lock records. Couchbase Server
   will prevent a document from being altered by an operation if another process
   alters the document and its CAS value, in the meantime.

 * **Time to Live (ttl)** — This is an expiration for a document typically
   specified in seconds. By default, any document created in Couchbase Server that
   does not have a given ttl will have an indefinite life span and will remain in
   Couchbase Server unless an explicit delete call from a client removes it. The
   Couchbase Server will delete values during regular maintenance if the ttl for an
   item has expired.

   The expiration value deletes information from the entire database. It has no
   effect on when the information is removed from the RAM caching layer.

 * **Flags** —These are SDK- specific flags which are used to provides a variety of
   options during storage, retrieval, update, and removal of documents. Typically
   flags are optional metadata used by a Couchbase client library to perform
   additional processing of a document. An example of flags include the ability to
   specify that a document be formatted a specific way before it is stored.

<a id="couchbase-clients"></a>

### Couchbase SDKs

Couchbase SDKs, sometimes also referred to as client libraries, are the
language-specific SDKs provided by Couchbase and third-party providers and that
are installed on your web application server. A Couchbase SDK is responsible for
communicating with the Couchbase Server and provides language-specific
interfaces your web application can use to perform database operations.

All Couchbase SDKs automatically read and write data to the right node in a
cluster. If database topology changes, the SDK responds automatically and
correctly distribute read/write requests to the right cluster nodes. Similarly,
if your cluster experiences server failure, SDKs will automatically direct
requests to still-functioning nodes. SDKs are able to determine the locations of
information, the status of nodes, and the status of the cluster using a REST API
for administration. For more information about the REST API for Administration,
see [Couchbase Server 2.1.0 Manual, REST API for
Administration](https://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-restapi.html).

The following shows a single web application server, the Couchbase SDK, and a
Couchbase Server cluster. In real deployments, multiple web application servers
can communicate via a Couchbase SDK to a cluster.


![](images/CB_basic_arch.jpg)

<a id="couchbase-nodes-clusters"></a>

### Nodes and Clusters

You deliver your application on several grouped servers, also known as a
*cluster*. Each cluster consists of multiple *nodes* :

 * Couchbase Server or Node: A *node* is a single instance of a Couchbase Server
   running on a physical or virtual machine, or other environment.

 * Cluster: This is a collection of one or more nodes. All nodes in a cluster are
   identical in function, interfaces, components and systems. Couchbase Server
   manages data across nodes in a cluster. When you increase the size of a cluster,
   the cluster scales linearly; that is, there is no hierarchy or parent/child
   relationships between multiple nodes in a cluster.

Nodes or clusters typically reside on a separate physical machine than your web
server. Your Couchbase node/cluster will communicate with your web application
via a Couchbase SDK, which we describe in detail in this guide. Your application
logic does not need to handle information about nodes or clusters; the Couchbase
SDKs are able to automatically communicate with the appropriate Couchbase
cluster node.

<a id="couchbase-cluster-map"></a>

### Information about the Cluster

Your web application does not need to directly handle any information about
where a document resides; Couchbase SDKs automatically retrieve updates from
Couchbase Server about the location of items in a cluster. Multiple web
application instances can access the same item at the same time using Couchbase
SDKs.

How an SDK gets updates on cluster topology is a slightly more advanced topic
and is mainly relevant for those developers who want to create their own
Couchbase SDK. For instance developers who want to create a Couchbase SDK for a
language not yet supported would be interested in this topic. For more
information, see, [Getting Cluster
Topology](couchbase-devguide-ready.html#couchbase-client-topology-via-rest).

<a id="couchbase-vs-RDMS"></a>

## Comparing Couchbase and Traditional RDMS

If you are an application developer with a background primarily in relational
databases, Couchbase Server has some key characteristics and advantages that you
should be familiar with. The following compares the different database systems:

**Couchbase Server**                                                                                                                                                                                                    | **Traditional Relational Database (RDBMS)**                                                                                                                      
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------
Rapidly scalable to millions of users.                                                                                                                                                                                  | Scalable to thousands of users.                                                                                                                                  
Data can be structured, semi-structured, and unstructured.                                                                                                                                                              | Data must be normalized.                                                                                                                                         
Built on modern reality of relatively inexpensive. plentiful memory.                                                                                                                                                    | Built on assumption of scarce, expensive memory.                                                                                                                 
Built for environments with high-speed data networking.                                                                                                                                                                 | Built at a time when networking still formative and slow.                                                                                                        
Data can be flexibly stored as JSON documents or binary data. No need to predefine data types.                                                                                                                          | Data types must be predefined for columns.                                                                                                                       
Does not require knowledge or use of SQL as query language.                                                                                                                                                             | Requires SQL as query language.                                                                                                                                  
Highly optimized for retrieve and append operations; high-performance for data-intensive applications, such as serving pages on high-traffic websites; can handle a large number of documents and document read/writes. | Significantly slower times for retrieving and committing data. Designed for occasional, smaller read/write transactions and infrequent larger batch transactions.
Data stored as key-document pairs; well suited for applications which handle rapidly growing lists of elements.                                                                                                         | Data stored in tables with fixed relations between tables.                                                                                                       
Does not require extensive data modeling; data structure is of lesser significance during development.                                                                                                                  | Data modeling and establishing relational model for data structures required during application development.                                                     
Asynchronous operations and optimistic concurrency enable applications designed for high throughput.                                                                                                                    | Strict enforcement of data integrity and normalization, with the tradeoff of lower performance and slower response times.                                        

Before you develop your application and model application data, you should
consider the issues faced when you use a traditional RDBMS. Couchbase Server is
well suited to handle these issues:

 * Stores many serialized objects,

 * Stores dissimilar objects that do not fit a single schema,

 * Scales out from thousands to millions of users rapidly,

 * Performs large volume reads/writes,

 * Supports schema and application data changes on running system.

If you need a system that provides a high level of scalability, flexibility in
data structure, and high performance, a NoSQL solution such as Couchbase is well
suited. If you want to handle multi-record transactions, have complex security
needs, or need to perform rollback of operations, a traditional RDBMS may be the
better alternative for your application. There may also be many cases in which
you perform and analysis of your application needs and determine you use both a
RDBMS and Couchbase Server for your data. For more detailed information about
the topic, see our resource library, webinars and whitepapers on the topic at
[Couchbase, Why NoSQL, Why
Now?](http://www.couchbase.com/on-demand/webinar/WhyNoSQLWebinarSeries)

## Support for Memcached Protocol

The Couchbase Server is completely compatible with the *memcached protocol*,
which is a widely adopted protocol for storing information in high-performance,
in-memory caches. This means than any existing memcached client libraries and
applications using these libraries can be migrated to with Couchbase Server with
little or no modification.

There are numerous challenges faced by developers who currently use memcached
with a traditional RDBMS which are resolved by a move to Couchbase Server. For
instance, if you currently use a memcached layer for data service and a
traditional RDBMS, your database could become overloaded and non-responsive when
memcached nodes go down. With a Couchbase Server cluster, your information will
be automatically replicated across the cluster, which provides a high
availability of data, even during node failure.

For more information about Couchbase Server as a replacement for memcached and
RDBMS systems, see [Replacing a Memcached Tier with a Couchbase
Cluster](http://info.couchbase.com/rs/northscale/images/Couchbase_WP_Dealing_with_Memcached_Challenges.pdf)
and [Couchbase Server Manual 2.1.0, Couchbase
APIs](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis.html).

<a id="couchbase-rebalancing"></a>

## Server Rebalancing

During a server rebalance, Couchbase Server automatically updates information
about where data is located. During the rebalance, a Couchbase SDK can therefore
still write to an active node in a cluster and the Couchbase Server will update
information about the newly saved data location. Once the rebalance is complete,
your Couchbase SDK will automatically switch to the new topology. For more
information, see [Couchbase Server Manual 2.1.0,
Rebalancing](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-tasks-addremove.html)

<a id="couchbase-failover"></a>

## Server Failover

Couchbase SDKs can connect to any node in a cluster; at runtime SDKs also
automatically receive information from Couchbase Server if any nodes are
unavailable. If a node that is used by your application fails, the SDK will be
informed by Couchbase Server and mark that node as down and will also have
information about alternate nodes that are still available. You use the
Couchbase Admin tool to manually indicate a node has failed, or you can
configure couchbase Server to use auto-failover. For more information, see
[Couchbase Server 1.8
Manual](http://www.couchbase.com/docs/couchbase-manual-2.1.0/index.html).

During node failure, Couchbase SDKs will get errors trying to read or write any
data that is on a failed node. Couchbase SDKs are still able to read and write
to all other functioning nodes in the cluster. After the node failure has been
detected and the node has been failed-over, SDKs will be updated by the
Couchbase Server and will resume functioning with the cluster and nodes as they
normally would. In this way, Couchbase SDKs and the applications you build on
them are able to cope with transient node failures and still conduct reads and
writes.

For more information about node failover, see [Couchbase Server Manual 2.1.0,
Node
Failover](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-tasks-failover.html).

<a id="couchbase-usecases"></a>

## Applications on Couchbase Server

If you look at successful Couchbase deployments, you will see there several
patterns of use; these patterns tend to rely on Couchbase Server's unique
combination of 1) linear, horizontal scalability, 2) sustained low latency and
high throughput performance, and 3) the extensibility of the system. This
section highlights ways you might want to think about using the Couchbase Server
for your application. For more detailed information, including case studies and
whitepapers, see [Couchbase NoSQL Use
Cases](http://www.couchbase.com/why-nosql/use-cases).

**Session Store**

User sessions are easily stored and managed in Couchbase, for instance, by using
the document ID naming scheme, "user:USERID". With Couchbase Server, you can
flag items for deletion after a certain amount of time, and therefore you have
the option of having Couchbase automatically delete old sessions.

Optimistic concurrency operations can be used to ensure concurrent web requests
from a single user do not lose data. For more information, see [Check and Set
(CAS)](couchbase-devguide-ready.html#cb-cas).

Many web application frameworks such as Ruby on Rails and various PHP and Python
web frameworks also provide pre-integrated support for storing session data
using Memcached protocol. These are supported by default by Couchbase.

For more detailed information, including case studies and whitepapers, see
[Couchbase NoSQL Use Cases](http://www.couchbase.com/why-nosql/use-cases).

**Social Gaming**

You can model and store game state, property state, time lines, conversations
and chats with Couchbase Server. The asynchronous persistence algorithms of
Couchbase were designed, built and deployed to support some of the highest scale
social games.

In particular, the heavy dual read and write storage access patterns of social
games, where nearly every user gesture mutates game state, is serviced by
Couchbase by asynchronously queueing mutations for disk storage and also by
collapsing mutations into the most recently queued mutation. For example, a
player making 10 game state mutations in 5 seconds, such as planting 10 flowers
in 5 seconds, will be compressed by Couchbase automatically into just one queued
disk mutation.

Couchbase Server can also force-save mutated item data to disk, even if an item
is heavily changed, such as when the user keeps on clicking and clicking.
Additionally, game state for that player remains instantly readable as long as
it is in the memory working set of Couchbase.

For more detailed information, including case studies and whitepapers, see
[Couchbase NoSQL Use Cases](http://www.couchbase.com/why-nosql/use-cases).

**Ad, Offer and Content Targeting**

The same attributes which serve Couchbase in the gaming context also apply well
for real-time ad and content targeting. For example, Couchbase provides a fast
storage capability for counters. Counters are useful for tracking visits,
associating users with various targeting profiles, tracking ad-offers, and for
tracking ad-inventory.

Multi-retrieve operations in Couchbase allow ad applications to concurrently
distribute data and then gather it against profiles, counters, or other items in
order to allow for ad computation and serving decisions under strict response
latency requirements.

For more detailed information, including case studies and whitepapers, see
[Couchbase NoSQL Use Cases](http://www.couchbase.com/why-nosql/use-cases).

<a id="modeling-documents"></a>
