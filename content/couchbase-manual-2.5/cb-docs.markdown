# Couchbase Server

This manual documents the Couchbase Server database system. For differences between individual version within this release series,
see the version-specific notes throughout the manual.

In addition to an introduction to Couchbase Server and a description of the relationship to NoSQL, 
this manual provides the following topics: 

* [Installation and Upgrade](cb-install/)

* [Administration](cb-admin/)  

* [CLI](cb-cli/)

* [REST API](cb-rest-api/)



## Enhancements in 2.5

Couchbase Server 2.5 includes the following new features and enhancement:

* Rack Awareness (Enterprise Edition only)
* XDCR data security (Enterprise Edition only)
* Optimized connection management


### Rack Awareness feature

The Rack Awareness feature allows logical groupings of servers on a cluster 
where each server group physically belongs to a rack or availability zone. 
This feature provides the ability to specify that active and corresponding 
replica partitions be created on servers that are part of a separate rack or zone. 
This increases reliability and availability in case entire racks or zones become unavailable. 

See the following for more information about Rack Awareness:

* For concept details on Rack Awareness and Server Groups, see [Rack Awareness](cb-admin/#cb-concepts-rack-aware).
* For administrative tasks on managing Rack Awareness, see [Managing Rack Awareness](cb-admin/#cb-admin-tasks-rack-aware).
* For command line interface information on managing server groups, see the 
[couchbase-cli](cb-cli/#couchbase-cli-tool) and 
[Managing Rack Awareness CLI](cb-cli/#cb-cli-rack-aware).
* For REST API information on managing server groups, see the 
[Rack Awareness REST API](cb-rest-api/#cb-restapi-rack-aware).


### XDCR data encryption feature

The cross data center (XDCR) data security feature provides secure cross 
data center replication using Secure Socket Layer (SSL) encryption. 
The data replicated between clusters can be SSL-encrypted in both uni and bi-directional. 

With the XDCR data security feature, the XDCR traffic can be secured by selecting the 
XDCR encryption option and providing the remote cluster's certificate. 

<div class="notebox"><p>Note</p>
<p>The certificate is an internal self-signed certificate used by SSL to initiate secure sessions.
</p></div>

See the following for more information about XDCR data encryption:

* For concept details on XDCR and XDCR data encryption, see 
[Cross Datacenter Replication](cb-admin/#cb-concepts-xdcr) and 
[XDCR data encryption](cb-admin/#cb-concepts-xdcr-data-encrypt).
* For administrative tasks on managing XDCR data encryption, see  
[Managing XDCR](cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information on managing XDCR and XDCR data encryption, 
see the [couchbase-cli](cb-cli/#couchbase-cli-tool), [Managing XDCR CLI](cb-cli/#cb-cli-xdcr), 
and [Managing XDCR data encryption CLI](cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information on managing XDCR and XDCR data encryption, see the 
[XDCR REST API](cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption REST API](cb-rest-api/#cb-restapi-xdcr-data-encrypt).

### Optimized connection management

In releases prior to Couchbase Server 2.5, a developer, via a client library of their choice, randomly selects a host from which to request an initial topology configuration. Any future changes to the cluster map following the initial bootstrap are based on the NOT_MY_VBUCKET response from the server. This connection is made to port 8091 and is based on an HTTP connection. 

Starting with Couchbase Server 2.5, client libraries may instead query a cluster for initial topology configuration for a bucket from one of the nodes in the cluster. This is similar to prior releases. However, this information is transmitted via the memcached protocol on port 11210 (rather than via persistent HTTP connections to port 8091). This significantly improves connection scaling capabilities.  

Optimized connection management is backward compatible. Old client libraries can connect to Couchbase Server 2.5, and updated client libraries can connect to Couchbase Server 2.5 and earlier. 

<div class="notebox"><p>Note</p>
<p>This change is only applicable to Couchbase type buckets (not memcached buckets).</p>
<p>An updated client library is required take advantage of optimized connection management. Older client libraries will continue to use the port 8091 HTTP connection. See the client library release notes for details.</p>
</div>

For more information, see [Using a smart (vBucket aware) client](cb-admin/#couchbase-deployment-vbucket-client) in Deployment strategies.





## Couchbase Server introduction

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
   replication enables you to move data closer to
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





