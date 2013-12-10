<a id="couchbase-introduction-migration"></a>

# Migration to Couchbase

Couchbase Server is based on components from both Membase Server and CouchDB. If
you are a user of these database systems, or are migrating from these to
Couchbase Server, the following information may help in translating your
understanding of the main concepts and terms.

<a id="couchbase-introduction-migration-membase"></a>

## Migrating for Membase Users

For an existing Membase user the primary methods for creating, adding,
manipulating and retrieving data remain the same. In addition, the background
operational elements of your Couchbase Server deployment will not differ from
the basic running of a Membase cluster.

### Term and Concept Differences

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

### Consistent Functionality

   The core functionality of Membase, including the methods for basic creation,
   updating and retrieval of information all remain identical within Couchbase
   Server. You can continue to use the same client protocols for setting and
   retrieving information.

   The administration, deployment, and core of the web console and administration
   interfaces are also identical. There are updates and improvements to support
   additional functionality which is included in existing tools. These include
   View-related statistics, and an update to the Web Administration Console for
   building and defining views.

### Changed Functionality

   The main difference of Couchbase Server is that in addition to the key/value
   data store nature of the database, you can also use Views to convert the
   information from individual objects in your database into lists or tables of
   records and information. Through the view system, you can also query data from
   the database based on the value (or fragment of a value) of the information that
   you have stored in the database against a key.

   This fundamental differences means that applications no longer need to manually
   manage the concept of lists or sets of data by using other keys as a lookup or
   compounding values.

### Operational and Deployment Differences

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

### Client and Application Changes

   Clients can continue to communicate with Couchbase Server using the existing
   memcached protocol interface for the basic create, retrieve, update and delete
   operations for key/value pairs. However, to access the View functionality you
   must use a client library that supports the view API (which uses HTTP REST).

   To build Views that can output and query your stored data, your objects must be
   stored in the database using the JSON format. This may mean that if you have
   been using the native serialization of your client library to convert a language
   specific object so that it can be stored into Membase Server, you will now need
   to structure your data and use a native to JSON serialization solution, or
   reformat your data so that it can be formatted as JSON.

<a id="couchbase-introduction-migration-couchdb"></a>

## Migrating for CouchDB Users

Although Couchbase Server incorporates the view engine functionality built into
CouchDB, the bulk of the rest of the functionality is supported through the
components and systems of Membase Server.

This change introduces a number of significant differences for CouchDB users
that want to use Couchbase Server, particularly when migrating existing
applications. However, you also gain the scalability and performance advantages
of the Membase Server components.

### Term and Concept Differences

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

### Consistent Functionality

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

### Changed Functionality

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

### Operational and Deployment Differences

   From a practical level the major difference between CouchDB and Couchbase Server
   is that options for clustering and distribution of information are significantly
   different. With CouchDB you would need to handle the replication of information
   between multiple nodes and then use a proxy service to distribute the load from
   clients over multiple machines.

   With Couchbase Server, the distribution of information is automatic within the
   cluster, and any Couchbase Server client library will automatically handle and
   redirect queries to the server that holds the information as it is distributed
   around the cluster. This process is automatic.

### Client and Application Changes

   As your CouchDB based application already uses JSON for the document
   information, and a document ID to identify each document, the bulk of your
   application logic and view support remain identical. However, the HTTP REST API
   for basic CRUD operations must be updated to use the memcached protocol.

   Additionally, because CouchApps are unsupported you will need to develop a
   client side application to support any application logic.
