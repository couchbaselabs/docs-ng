# Introduction to Couchbase

Couchbase Server is a distributed, highly–scalable, non-relational database.
Couchbase Server provides a managed in-memory caching tier, so that you can
create very fast, responsive web applications. There are three core benefits you
should be aware of when decide to develop an application on Couchbase Server:

 * **Simplicity**

   Couchbase Server follows a non-relational structure for storing information.
   This makes it easy for an application to read and write data, and for developers
   to handle application data. Developers can retrieve and write data without
   having to define a data structure and there are no complicated queries or query
   languages needed to create, read and update data.

 * **Fast**

   Couchbase Server retains as much of your application's most used data in RAM at
   all times, so the performance of your application is generally only limited by
   the network speed used to access the data. The performance of your application
   can also be improved by adding more nodes, or instances of Couchbase Servers.

 * **Elastic**

   A cluster of Couchbase Servers is easy to expand. When an application is ready
   for release, you can increase capacity by simply adding more machines to our
   existing cluster. Your entire existing cluster will remain running during the
   process. The ability to create a clustered architecture will also support high
   availability of data for your application. If a server in a cluster fails, the
   data will be available from another server in the cluster.

All of these features of Couchbase Server enable development of web applications
where low–latency and high throughput are required by end users. Web
applications can quickly access the right information within a Couchbase cluster
and developers can rapidly scale up their web applications by adding nodes.

<a id="couchbase-concepts"></a>

## Understanding Couchbase Concepts

Before you develop applications on the Couchbase Server, you will want to
understand key concepts and components that are related to application
development on Couchbase Server. This section provides an overview of concepts
and terms you will become familiar with as you create an application. For more
detailed information about underlying functions of the Couchbase Server, data
storage, and server management, please refer to the [Couchbase Server
Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/index.html).

<a id="couchbase-buckets"></a>

### Data Buckets

Your web application stores data in a Couchbase cluster using "buckets." Buckets
are isolated, virtual containers which logically group data in memory within a
cluster; they are the functional equivalent to a database. You create data
buckets in Couchbase Server in the same scenarios where you would create a
database in MySQL or any other relational database. Buckets can be accessed by
multiple client applications across a cluster. They provide a secure mechanism
for organizing, managing and analyzing data storage. As an application developer
you will most likely create buckets for your development and production
environment.

For more information about data buckets in Couchbase Server, and how to create
them, see [Using Data Buckets](bucket-general-function) and [Couchbase Server
1.8 Manual, Data
Buckets](https://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console-data-buckets.html)

<a id="keys-documents"></a>

### Keys and Metadata

All information that you store in a Couchbase bucket will have a key and
associated content. Keys are unique identifiers for a document, and content is
either the data you want to store as byte stream, data types, or serialized
objects such as JSON.

A key in Couchbase Server can be any string, including strings with separators
and identifiers, such as 'person\_93679.' A key is unique.

By default, all documents contain three types of metadata which are provided by
the Couchbase Server. This information is stored with the document and is used
to change how the document is handled:

 * **Cas Value** —Also called *cas token* or *cas ID* ; this is a unique identifier
   associated with a document, and verified by the Couchbase Server before a
   document is deleted or changed. This provides a form of basic optimistic
   concurrency; when the Couchbase Server checks a CAS value before changing data,
   it effectively prevents data loss without having to lock records. Couchbase
   Server will prevent a document from being altered by an operation if another
   process alters the document and its CAS value, in the meantime.

 * **Time to Live (ttl)** —This is an expiration for a document typically specified
   in seconds. By default, any document created in Couchbase Server that does not
   have a given ttl will have an indefinite life span and will remain in Couchbase
   Server unless an explicit delete operation from a client removes it. The
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

All Couchbase SDKs automatically read and write data at the right node in a
cluster. If database topology changes, the SDK responds automatically and
correctly distribute read/write requests to the right cluster nodes. Similarly,
if Couchbase Server experiences failover, SDKs will automatically direct
requests to still-functioning nodes. SDKs are able to determine the locations of
information/data, the status of nodes, and the status of the cluster using a
REST API for administration. For more information about the REST API for
Administration, see [Couchbase Server 1.8 Manual, REST API for
Administration](https://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html).

The following shows a single web application server, the Couchbase SDK, and a
Couchbase Server cluster. In real deployments, multiple web application servers
can communicate via a Couchbase SDK to a cluster.


![](images/CB_basic_arch.jpg)

<a id="couchbase-nodes-clusters"></a>

### Nodes and Clusters

You deliver your application on several grouped servers, also known as a
*cluster*. Each cluster consists of multiple *nodes* :

 * Node: A node is a single instance of a Couchbase Server running on a physical or
   virtual machine, or other environment.

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
cluster nodes.

<a id="couchbase-cluster-map"></a>

### Information about the Cluster

Your web application does not need to directly handle any information about
where a document resides; Couchbase SDKs automatically retrieve updates from
Couchbase Server about the location of items in a cluster. Multiple web
application instances can access the same item at the same time using Couchbase
SDKs.

How this actually works is a slightly more advanced topic and is mainly relevant
for those developers who want to create their own Couchbase SDK. This topic is
more relevant for developers who want to create a Couchbase SDK for a language
that is not yet supported. For more information, see, [Handling vBucketMap
Information](#couchbase-client-development-restjson-parsing-vbucketmap)

<a id="couchbase-vs-RDMS"></a>

## Comparing Couchbase and Traditional RDMS

If you are an application developer with a background primarily in relational
databases, Couchbase Server has some key characteristics and advantages that you
should be familiar with. The following compares the different database systems:

**Couchbase Server**                                                                                                                                                                                                    | **Traditional Relational Database (RDBMS)**                                                                                                                      
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------
Rapidly scalable to millions of users.                                                                                                                                                                                  | Scalable to thousands of users.                                                                                                                                  
Data can be structured, semi-structured, and unstructured.                                                                                                                                                              | Data must be normalized.                                                                                                                                         
Built on modern reality of relatively inexpensive, plentiful memory.                                                                                                                                                    | Built on assumption of scarce, expensive memory.                                                                                                                 
Built for environments with high-speed data networking.                                                                                                                                                                 | Built at a time when networking still formative and slow.                                                                                                        
Data can be flexibly stored as JSON documents or binary data. No need to predefine data types.                                                                                                                          | Data types must be predefined for columns.                                                                                                                       
Does not require knowledge or use of SQL as query language.                                                                                                                                                             | Requires SQL as query language.                                                                                                                                  
Highly optimized for retrieve and append operations; high-performance for data-intensive applications, such as serving pages on high-traffic websites; can handle a large number of documents and document read/writes. | Significantly slower times for retrieving and committing data. Designed for occasional, smaller read/write transactions and infrequent larger batch transactions.
For optimal performance and speed, stores most frequently used data in RAM. Persistent storage also provided to survive system downtime and for re-population of RAM.                                                   | Assumes all data is persistent data to be stored on disk.                                                                                                        
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
RDBMS and Couchbase Server for your data.

## Support for Memcached Protocol

The Couchbase Server is completely compatible with the memcached protocol. This
means than any existing memcached client libraries and applications using these
libraries can be migrated to with Couchbase Server with little or no
modification. For more information, see [Couchbase Server Manual
2.0](http://www.couchbase.com/docs/couchbase-manual-2.0/index.html) and
[Couchbase Server Manual 2.0, Couchbase
APIs](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-architecture-apis.html).

<a id="couchbase-rebalancing"></a>

## Server Rebalancing

During a server rebalance, Couchbase server automatically updates information
about where data is located. During the rebalance, a Couchbase SDK can still
write to an active node in a cluster and the Couchbase Server will update
information about the newly saved data location. Once the rebalance is complete,
your Couchbase SDK will automatically switch to the new topology. For more
information, see [Couchbase Server Manual 2.0,
Rebalancing](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-addremove.html)

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
Manual](http://www.couchbase.com/docs/couchbase-manual-1.8/index.html).

During node failure, Couchbase SDKs will get errors trying to read or write any
data that is on a failed node. Couchbase SDKs are still able to read and write
to all other functioning nodes in the cluster. After the node failure has been
detected and the node has been failed-over, SDKs will be updated by the
Couchbase Server and will resume functioning with the cluster and nodes as they
normally would. In this way, Couchbase SDKs and the applications you build on
them are able to cope with transient node failures and still conduct reads and
writes.

For more information about node failover, see [Couchbase Server Manual 2.0, Node
Failover](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-failover.html).

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
(CAS)](#cb-cas).

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

The same attributes which server Couchbase in the gaming context also apply well
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

<a id="protocol"></a>
