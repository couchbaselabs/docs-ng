# Views and Indexes

Views within Couchbase Server process the information stored in your Couchbase
Server database, allowing you to index and query your data. A view creates an
index on the stored information according to the format and structure defined
within the view. The view consists of specific fields and information extracted
from the objects stored in Couchbase. Views create indexes on your information
allowing you to search and select information stored within Couchbase Server.

Views are eventually consistent compared to the underlying stored documents.
Documents are included in views when the document data is persisted to disk, and
documents with expiry times are removed from indexes only when the expiration
pager operates to remove the document from the database. Fore more information,
read [View Operation](#couchbase-views-operation).

Views can be used within Couchbase Server for a number of reasons, including:

 * Indexing and querying data from your stored objects

 * Producing lists of data on specific object types

 * Producing tables and lists of information based on your stored data

 * Extracting or filtering information from the database

 * Calculating, summarizing or reducing the information on a collection of stored
   data

You can create multiple views and therefore multiple indexes and routes into the
information stored in your database. By exposing specific fields from the stored
information, views enable you to create and query the information stored within
your Couchbase Server, perform queries and selection on the information, and
paginate through the view output. The View Builder provides an interface for
creating your views within the Couchbase Server Web Console. Views can be
accessed using a suitable client library to retrieve matching records from the
Couchbase Server database.

 * For background information on the creation of views and how they relate to the
   contents of your Couchbase Server database, see [View
   Basics](#couchbase-views-basics).

 * For more information on how views work with stored information, see [Views and
   Stored Data](#couchbase-views-datastore).

 * For information on the rules and implementation of views, see [View
   Operation](#couchbase-views-operation).

 * Two types of views, development and production, are used to help optimize
   performance and view development. See [Development and Production
   Views](#couchbase-views-types).

 * Writing views, including the language and options available are covered in
   [Development and Production Views](#couchbase-views-types).

 * For a detailed background and technical information on troubleshooting views,
   see [Troubleshooting Views (Technical
   Background)](#couchbase-views-troubleshooting).

 * The Couchbase Server Web Console includes an editor for writing and developing
   new views. See [Using the Views Editor](#couchbase-views-editor). You can also
   use a REST API to create, update and delete design documents. See [Design
   Document REST API](#couchbase-views-designdoc-api).

<a id="couchbase-views-basics"></a>

## View Basics

The purpose of a view is take the un-structured, or semi-structured, data stored
within your Couchbase Server database, extract the fields and information that
you want, and to produce an index of the selected information. Storing
information in Couchbase Server using JSON makes the process of selecting
individual fields for output easier. The resulting generated structure is a
*view* on the stored data. The view that is created during this process allows
you to iterate, select and query the information in your database from the raw
data objects that have been stored.

A brief overview of this process is shown in the figure below.


![](images/views-basic-overview.png)

In the above example, the view takes the Name, City and Salary fields from the
stored documents and then creates a array of this information for each document
in the view. A view is created by iterating over every single document within
the Couchbase bucket and outputting the specified information. The resulting
index is stored for future use and updated with new data stored when the view is
accessed. The process is incremental and therefore has a low ongoing impact on
performance. Creating a new view on an existing large dataset may take a long
time to build, but updates to the data will be quick.

The view definition specifies the format and content of the information
generated for each document in the database. Because the process relies on the
fields of stored JSON, if the document is not JSON, or the requested field in
the view does not exist, the information is ignored. This enables the view to be
created, even if some documents have minor errors or lack the relevant fields
altogether.

One of the benefits of a document database is the ability to change the format
of documents stored in the database at any time, without requiring a wholesale
change to applications or a costly schema update before doing so.

<a id="couchbase-views-operation"></a>

## View Operation

All views within Couchbase operate as follows:

 * Views are updated when the document data is persisted to disk. There is a delay
   between creating or updating the document, and the document being updated within
   the view.

 * Documents that are stored with an expiry are not automatically removed until the
   background expiry process removes them from the database. This means that
   expired documents may still exist within the index.

 * Views are scoped within a design document, with each design document part of a
   single bucket. A view can only access the information within the corresponding
   bucket.

 * View names must be specified using one or more UTF-8 characters. You cannot have
   a blank view name. View names cannot have leading or trailing whitespace
   characters (space, tab, newline, or carriage-return).

 * Document IDs that are not UTF-8 encodable are automatically filtered and not
   included in any view. The filtered documents are logged so that they can be
   identified.

 * Views can only access documents defined within their corresponding bucket. You
   cannot access or aggregate data from multiple buckets within a given view.

 * Views are created as part of a design document, and each design document exists
   within the corresponding named bucket.

    * Each design document can have 0-n views.

    * Each bucket can contain 0-n design documents.

 * All the views within a single design document are updated when the update to a
   single view is triggered. For example, a design document with three views will
   update all three views simultaneously when just one of these views is updated.

 * Updates can be triggered in two ways:

    * At the point of access or query by using the `stale` parameter (see [Index
      Updates and the stale Parameter](#couchbase-views-writing-stale) ).

    * Automatically by Couchbase Server based on the number of updated documents, or
      the period since the last update.

      Automatic updates can be controlled either globally, or individually on each
      design document. See [Automated Index
      Updates](#couchbase-views-operation-autoupdate).

 * Views are updated incrementally. The first time the view is accessed, all the
   documents within the bucket are processed through the map/reduce functions. Each
   new access to the view only processes the documents that have been added,
   updated, or deleted, since the last time the view index was updated.

   In practice this means that views are entirely incremental in nature. Updates to
   views are typically quick as they only update changed documents. You should try
   to ensure that views are updated, using either the built-in automatic update
   system, through client-side triggering, or explicit updates within your
   application framework.

 * Because of the incremental nature of the view update process, information is
   only ever appended to the index stored on disk. This helps ensure that the index
   is updated efficiently. Compaction (including auto-compaction) will optimize the
   index size on disk and optimize the index structure. An optimized index is more
   efficient to update and query. See [Database and View
   Compaction](#couchbase-admin-tasks-compaction).

 * The entire view is recreated if the view definition has changed. Because this
   would have a detrimental effect on live data, only development views can be
   modified.

   Views are organized by design document, and indexes are created according to the
   design document. Changing a single view in a design document with multiple views
   invalidates all the views (and stored indexes) within the design document, and
   all the corresponding views defined in that design document will need to be
   rebuilt. This will increase the I/O across the cluster while the index is
   rebuilt, in addition to the I/O required for any active production views.

 * You can choose to update the result set from a view before you query it or after
   you query. Or you can choose to retrieve the existing result set from a view
   when you query the view. In this case the results are possibly out of date, or
   stale. For more information, see [Index Updates and the stale
   Parameter](#couchbase-views-writing-stale).

 * The views engine creates an index is for each design document; this index
   contains the results for all the views within that design document.

 * The index information stored on disk consists of the combination of both the key
   and value information defined within your view. The key and value data is stored
   in the index so that the information can be returned as quickly as possible, and
   so that views that include a reduce function can return the reduced information
   by extracting that data from the index.

   Because the value and key information from the defined map function are stored
   in the index, the overall size of the index can be larger than the stored data
   if the emitted key/value information is larger than the original source document
   data.

<a id="couchbase-views-expiration"></a>

### How Expiration Impacts Views

Be aware that Couchbase Server does lazy expiration, that is, expired items are
flagged as deleted rather than being immediately erased. Couchbase Server has a
maintenance process, called *expiry pager* that will periodically look through
all information and erase expired items. This maintenance process will run every
60 minutes, but it can be configured to run at a different interval. Couchbase
Server will immediately remove an item flagged for deletion the next time the
item requested; the server will respond that the item does not exist to the
requesting process.

The result set from a view *will contain* any items stored on disk that meet the
requirements of your views function. Therefore information that has not yet been
removed from disk may appear as part of a result set when you query a view.

Using Couchbase views, you can also perform *reduce functions* on data, which
perform calculations or other aggregations of data. For instance if you want to
count the instances of a type of object, you would use a reduce function. Once
again, if an item is on disk, it will be included in any calculation performed
by your reduce functions. Based on this behavior due to disk persistence, here
are guidelines on handling expiration with views:

 * **Detecting Expired Documents in Result Sets** : If you are using views for
   indexing items from Couchbase Server, items that have not yet been removed as
   part of the expiry pager maintenance process will be part of a result set
   returned by querying the view. To exclude these items from a result set you
   should use query parameter `include_doc` set to `true`. This parameter typically
   includes all JSON documents associated with the keys in a result set. For
   example, if you use the parameter `include_docs=true` Couchbase Server will
   return a result set with an additional `"doc"` object which contains the JSON or
   binary data for that key:

    ```
    {"total_rows":2,"rows":[
    {"id":"test","key":"test","value":null,"doc":{"meta":{"id":"test","rev":"4-0000003f04e86b040000000000000000","expiration":0,"flags":0},"json":{"testkey":"testvalue"}}},
    {"id":"test2","key":"test2","value":null,"doc":{"meta":{"id":"test2","rev":"3-0000004134bd596f50bce37d00000000","expiration":1354556285,"flags":0},"json":{"testkey":"testvalue"}}}
    ]
    }
    ```

   For expired documents if you set `include_doc=true`, Couchbase Server will
   return a result set indicating the document does not exist anymore.
   Specifically, the key that had expired but had not yet been removed by the
   cleanup process will appear in the result set as a row where `"doc":null` :

    ```
    {"total_rows":2,"rows":[
    {"id":"test","key":"test","value":null,"doc":{"meta":{"id":"test","rev":"4-0000003f04e86b040000000000000000","expiration":0,"flags":0},"json":{"testkey":"testvalue"}}},
    {"id":"test2","key":"test2","value":null,"doc":null}
    ]
    }
    ```

 * **Reduces and Expired Documents** : In some cases, you may want to perform a
   *reduce function* to perform aggregations and calculations on data in Couchbase
   Server 2.0. In this case, Couchbase Server takes pre-calculated values which are
   stored for an index and derives a final result. This also means that any expired
   items still on disk will be part of the reduction. This may not be an issue for
   your final result if the ratio of expired items is proportionately low compared
   to other items. For instance, if you have 10 expired scores still on disk for an
   average performed over 1 million players, there may be only a minimal level of
   difference in the final result. However, if you have 10 expired scores on disk
   for an average performed over 20 players, you would get very different result
   than the average you would expect.

   In this case, you may want to run the expiry pager process more frequently to
   ensure that items that have expired are not included in calculations used in the
   reduce function. We recommend an interval of 10 minutes for the expiry pager on
   each node of a cluster. Do note that this interval will have some slight impact
   on node performance as it will be performing cleanup more frequently on the
   node.

For more information about setting intervals for the maintenance process, refer
to the Couchbase Manual command line tool, [Couchbase Server Manual 2.0,
Specifying Disk Cleanup
Interval](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-cbepctl-disk-cleanup.html)
and refer to the examples on `exp_pager_stime`. For more information about views
and view query parameters, see [Finding Data with
Views](http://www.couchbase.com/docs/couchbase-devguide-2.0/indexing-querying-data.html).

<a id="couchbase-views-operation-cluster"></a>

### How Views Function in a Cluster

**Distributing data**. If you familiar working with Couchbase Server you know
that the server distributes data across different nodes in a cluster. This means
that if you have four nodes in a cluster, on average each node will contain
about 25% of active data. If you use views with Couchbase Server, the indexing
process runs on all four nodes and the four nodes will contain roughly 25% of
the results from indexing on disk. We refer to this index as a *partial index*,
since it is an index based on a subset of data within a cluster. We show this in
this partial index in the illustration below.

**Replicating data and Indexes**. Couchbase Server also provides data
replication; this means that the server will replicate data from one node onto
another node. In case the first node fails the second node can still handle
requests for the data. To handle possible node failure, you can specify that
Couchbase Server also replicate a partial index for replicated data. By default
each node in a cluster will have a copy of each design document and view
functions. If you make any changes to a views function, Couchbase Server will
replicate this change to all nodes in the cluster. The sever will generate
indexes from views within a single design document and store the indexes in a
single file on each node in the cluster:


![](images/views_replica.png)

Couchbase Server can optionally create replica indexes on nodes that are contain
replicated data; this is to prepare your cluster for a failover scenario. The
server does not replicate index information from another node, instead each node
creates an index for the replicated data it stores. The server recreates indexes
using the replicated data on a node for each defined design document and view.
By providing replica indexes the server enables you to still perform queries
even in the event of node failure. You can specify whether Couchbase Server
creates replica indexes or not when you create a data bucket. For more
information, see [Creating and Editing Data
Buckets](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console-data-buckets-createedit.html)

**Query Time within a Cluster**

When you query a view and thereby trigger the indexing process, you send that
request to a single node in the cluster. This node then distributes the request
to all other nodes in the cluster. Depending on the parameter you send in your
query, each node will either send the most current partial index at that node,
will update the partial index and send it, or send the partial index and update
it on disk. Couchbase Server will collect and collate these partial indexes and
sent this aggregate result to a client. For more information about controlling
index updates using query parameters, see [Index Updates and the stale
Parameter](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-stale.html).

To handle errors when you perform a query, you can configure how the cluster
behaves when errors occur. See [Error
Control](#couchbase-views-writing-querying-errorcontrol).

**Queries During Rebalance or Failover**

You can query an index during cluster rebalance and node failover operations. If
you perform queries during rebalance or node failure, Couchbase Server will
ensure that you receive the query results that you would expect from a node as
if there were no rebalance or node failure.

During node rebalance, you will get the same results you would get as if the
data were active data on a node and as if data were not being moved from one
node to another. In other words, this feature ensures you get query results from
a node during rebalance that are consistent with the query results you would
have received from the node before rebalance started. This functionality
operates by default in Couchbase Server, however you can optionally choose to
disable it. For more information, see [Disabling Consistent Query Results on
Rebalance](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-consistent-query.html).
Be aware that while this functionality, when enabled, will cause cluster
rebalance to take more time; however we do not recommend you disable this
functionality in production without thorough testing otherwise you may observe
inconsistent query results.

<a id="couchbase-views-operation-performance"></a>

### View Performance

View performance includes the time taken to update the view, the time required
for the view update to be accessed, and the time for the updated information to
be returned, depend on different factors. Your file system cache, frequency of
updates, and the time between updating document data and accessing (or updating)
a view will all impact performance.

Some key notes and points are provided below:

 * Index queries are always accessed from disk; indexes are not kept in RAM by
   Couchbase Server. However, frequently used indexes are likely to be stored in
   the filesystem cache used for caching information on disk. Increasing your
   filesystem cache, and reducing the RAM allocated to Couchbase Server from the
   total RAM available will increase the RAM available for the OS.

 * The filesystem cache will play a role in the update of the index information
   process. Recently updated documents are likely to be stored in the filesystem
   cache. Requesting a view update immediately after an update operation will
   likely use information from the filesystem cache. The eventual persistence
   nature implies a small delay between updating a document, it being persisted,
   and then being updated within the index.

   Keeping some RAM reserved for your operating system to allocate filesystem
   cache, or increasing the RAM allocated to filesystem cache, will help keep space
   available for index file caching.

 * View indexes are stored, accessed, and updated, entirely independently of the
   document updating system. This means that index updates and retrieval is not
   dependent on having documents in memory to build the index information. Separate
   systems also mean that the performance when retrieving and accessing the cluster
   is not dependent on the document store.

<a id="couchbase-views-writing-stale"></a>

### Index Updates and the stale Parameter

Indexes are created by Couchbase Server based on the view definition, but
updating of these indexes can be controlled at the point of data querying,
rather than each time data is inserted. Whether the index is updated when
queried can be controlled through the `stale` parameter.

Irrespective of the `stale` parameter, documents can only be indexed by the
system once the document has been persisted to disk. If the document has not
been persisted to disk, use of the `stale` will not force this process. You can
use the `observe` operation to monitor when documents are persisted to disk
and/or updated in the index.

Views can also be updated automatically according to a document change, or
interval count. See [Automated Index
Updates](#couchbase-views-operation-autoupdate).

Three values for `stale` are supported:

 * **stale=ok**

   The index is not updated. If an index exists for the given view, then the
   information in the current index is used as the basis for the query and the
   results are returned accordingly.


   ![](images/views-stale-sequence-stale.png)

   This setting results in the fastest response times to a given query, since the
   existing index will be used without being updated. However, this risks returning
   incomplete information if changes have been made to the database and these
   documents would otherwise be included in the given view.

 * **stale=false**

   The index is updated before the query is executed. This ensures that any
   documents updated (and persisted to disk) are included in the view. The client
   will wait until the index has been updated before the query has executed, and
   therefore the response will be delayed until the updated index is available.


   ![](images/views-stale-sequence-updatebefore.png)

 * **stale=update\_after**

   This is the default setting if no `stale` parameter is specified. The existing
   index is used as the basis of the query, but the index is marked for updating
   once the results have been returned to the client.


   ![](images/views-stale-sequence-updateafter.png)

The indexing engine is an asynchronous process; this means querying an index may
produce results you may not expect. For example, if you update a document, and
then immediately run a query on that document you may not get the new
information in the emitted view data. This is because the document updates have
not yet been committed to disk, which is the point when the updates are indexed.

This also means that deleted documents may still appear in the index even after
deletion because the deleted document has not yet been removed from the index.

For both scenarios, you should use an `observe` command from a client with the
`persistto` argument to verify the persistent state for the document, then force
an update of the view using `stale=false`. This will ensure that the document is
correctly updated in the view index. For more information, see [Couchbase
Developer Guide, Using
Observe](http://www.couchbase.com/docs/couchbase-devguide-2.0/monitoring-data.html).

When you have multiple clients accessing an index, the index update process and
results returned to clients depend on the parameters passed by each client and
the sequence that the clients interact with the server.

 * Situation 1

    1. Client 1 queries view with `stale=false`

    1. Client 1 waits until server updates the index

    1. Client 2 queries view with `stale=false` while re-indexing from Client 1 still
       in progress

    1. Client 2 will wait until existing index process triggered by Client 1 completes.
       Client 2 gets updated index.

 * Situation 2

    1. Client 1 queries view with `stale=false`

    1. Client 1 waits until server updates the index

    1. Client 2 queries view with `stale=ok` while re-indexing from Client 1 in
       progress

    1. Client 2 will get the existing index

 * Situation 3

    1. Client 1 queries view with `stale=false`

    1. Client 1 waits until server updates the index

    1. Client 2 queries view with `stale=update_after`

    1. If re-indexing from Client 1 not done, Client 2 gets the existing index. If
       re-indexing from Client 1 done, Client 2 gets this updated index and triggers
       re-indexing.

Index updates may be stacked if multiple clients request that the view is
updated before the information is returned ( `stale=false` ). This ensures that
multiple clients updating and querying the index data get the updated document
and version of the view each time. For `stale=update_after` queries, no stacking
is performed, since all updates occur after the query has been accessed.

Sequential accesses

 1. Client 1 queries view with stale=ok

 1. Client 2 queries view with stale=false

 1. View gets updated

 1. Client 1 queries a second time view with stale=ok

 1. Client 1 gets the updated view version

The above scenario can cause problems when paginating over a number of records
as the record sequence may change between individual queries.

<a id="couchbase-views-operation-autoupdate"></a>

### Automated Index Updates

In addition to a configurable update interval, you can also update all indexes
automatically in the background. You configure automated update through two
parameters, the update time interval in seconds and the number of document
changes that occur before the views engine updates an index. These two
parameters are `updateInterval` and `updateMinChanges` :

 * `updateInterval` : the time interval in milliseconds between automatic
   re-indexing, default is 5000 milliseconds.

 * `updateMinChanges` : the number of document changes that occur before
   re-indexing occurs, default is 5000 changes.

The auto-update process only operates on full-set development and production
indexes. Auto-update does not operate on partial set development indexes.

Irrespective of the automated update process, documents can only be indexed by
the system once the document has been persisted to disk. If the document has not
been persisted to disk, the automated update process will not force the
unwritten data to be written to disk. You can use the `observe` operation to
monitor when documents have been persisted to disk and/or updated in the index.

The updates are applied as follows:

 * Active Indexes (Production Views)

   For all active indexes (production views), indexes are automatically updated
   according to the update interval ( `updateInterval` ) and the number of document
   changes ( `updateMinChanges` ).

   If `updateMinChanges` is set to 0 (zero), then automatic updates are disabled
   for main indexes.

 * Replica Indexes

   If replica indexes have been configured for a bucket, the index is automatically
   updated according to the document changes ( `replicaUpdateMinChanges` ; default
   5000) settings.

   If `replicaUpdateMinChanges` is set to 0 (zero), then automatic updates are
   disabled for replica indexes.

The trigger level can be configured both globally and for individual design
documents for all indexes using the REST API.

To obtain the current view update daemon settings, access a node within the
cluster on the administration port using the URL
`http://nodename:8091/settings/viewUpdateDaemon` :


```
GET http://Administrator:Password@nodename:8091/settings/viewUpdateDaemon
```

The request returns the JSON of the current update settings:


```
{
    "updateInterval":5000,
    "updateMinChanges":5000,
    "replicaUpdateMinChanges":5000
}
```

To update the settings, use `POST` with a data payload that includes the updated
values. For example, to update the time interval to 10 seconds, and document
changes to 7000 each:


```
POST http://nodename:8091/settings/viewUpdateDaemon
updateInterval=10000&updateMinChanges=7000
```

If successful, the return value is the JSON of the updated configuration.

To configure the update values explicitly on individual design documents, you
must specify the parameters within the `options` section of the design document.
For example:


```
{
   "_id": "_design/myddoc",
   "views": {
      "view1": {
          "map": "function(doc, meta) { if (doc.value) { emit(doc.value, meta.id);} }"
      }
   },
   "options": {
       "updateMinChanges": 1000,
       "replicaUpdateMinChanges": 20000
   }
}
```

You can set this information when creating and updating design documents through
the design document REST API. For more information, see [Design Document REST
API](#couchbase-views-designdoc-api).

To perform this operation using the `curl` tool:


```
shell> curl -X POST -v -d 'updateInterval=7000&updateMinChanges=7000' \
    'http://Administrator:Password@192.168.0.72:8091/settings/viewUpdateDaemon'
```

Partial-set development views are not automatically rebuilt, and during a
rebalance operation, development views are not updated, even when when
consistent views are enabled, as this relies on the automated update mechanism.
Updating development views in this way would waste system resources.

<a id="couchbase-views-datastore"></a>

## Views and Stored Data

The view system relies on the information stored within your cluster being
formatted as a JSON document. The formatting of the data in this form allows the
individual fields of the data to be identified and used at the components of the
index.

Information is stored into your Couchbase database the data stored is parsed, if
the information can be identified as valid JSON then the information is tagged
and identified in the database as valid JSON. If the information cannot be
parsed as valid JSON then it is stored as a verbatim binary copy of the
submitted data.


![](images/view-types-datastore.png)

When retrieving the stored data, the format of the information depends on
whether the data was tagged as valid JSON or not:

 * **JSON**

   Information identified as JSON data may not be returned in a format identical to
   that stored. The information will be semantically identical, in that the same
   fields, data and structure as submitted will be returned. Metadata information
   about the document is presented in a separate structure available during view
   processing.

   The white space, field ordering may differ from the submitted version of the JSON
   document.

   For example, the JSON document below, stored using the key `mykey` :

    ```
    {
       "title" : "Fish Stew",
       "servings" : 4,
       "subtitle" : "Delicious with fresh bread"
    }
    ```

   May be returned within the view processor as:

    ```
    {
        "servings": 4,
        "subtitle": "Delicious with fresh bread",
        "title": "Fish Stew"
    }
    ```

 * **Non-JSON**

   Information not parsable as JSON will always be stored and returned as a
   binary copy of the information submitted to the database. If you store an image,
   for example, the data returned will be an identical binary copy of the stored
   image.

   Non-JSON data is available as a base64 string during view processing. A non-JSON
   document can be identified by examining the `type` field of the metadata
   structure.

The significance of the returned structure can be seen when editing the view
within the Web Console.

<a id="couchbase-views-datastore-json"></a>

### JSON Basics

JSON is used because it is a lightweight, easily parsed, cross-platform data
representation format. There are a multitude of libraries and tools designed to
help developers work efficiently with data represented in JSON format, on every
platform and every conceivable language and application framework, including, of
course, most web browsers.

JSON supports the same basic types as supported by JavaScript, these are:

 * Number (either integer or floating-point).

   JavaScript supports a maximum numerical value of 2 `53`. If you are working with
   numbers larger than this from within your client library environment (for
   example, 64-bit numbers), you must store the value as a string.

 * String — this should be enclosed by double-literals and supports Unicode
   characters and backslash escaping. For example:

    ```
    "A String"
    ```

 * Boolean — a `true` or `false` value. You can use these strings directly. For
   example:

    ```
    { "value": true}
    ```

 * Array — a list of values enclosed in square brackets. For example:

    ```
    ["one", "two", "three"]
    ```

 * Object — a set of key/value pairs (i.e. an associative array, or hash). The key
   must be a string, but the value can be any of the supported JSON values. For
   example:

    ```
    {
       "servings" : 4,
       "subtitle" : "Easy to make in advance, and then cook when ready",
       "cooktime" : 60,
       "title" : "Chicken Coriander"
    }
    ```

If the submitted data cannot be parsed as a JSON, the information will be stored
as a binary object, not a JSON document.

<a id="couchbase-views-datastore-fields"></a>

### Document Metadata

During view processing, metadata about individual documents is exposed through a
separate JSON object, `meta`, that can be optionally defined as the second
argument to the `map()`. This metadata can be used to further identify and
qualify the document being processed.

The `meta` structure contains the following fields and associated information:

 * `id`

   The ID or key of the stored data object. This is the same as the key used when
   writing the object to the Couchbase database.

 * `rev`

   An internal revision ID used internally to track the current revision of the
   information. The information contained within this field is not consistent or
   trackable and should not be used in client applications.

 * `type`

   The type of the data that has been stored. A valid JSON document will have the
   type `json`. Documents identified as binary data will have the type `base64`.

 * `flags`

   The numerical value of the flags set when the data was stored. The availability
   and value of the flags is dependent on the client library you are using to store
   your data. Internally the flags are stored as a 32-bit integer.

 * `expiration`

   The expiration value for the stored object. The stored expiration time is always
   sotred as an absolute Unix epoch time value.

These additional fields are only exposed when processing the documents within
the view server. These fields are not returned when you access the object
through the Memcached/Couchbase protocol as part of the document.

<a id="couchbase-views-datastore-nonjson"></a>

### Non-JSON Data

All documents stored in Couchbase Server will return a JSON structure, however,
only submitted information that could be parsed into a JSON document will be
stored as a JSON document. If you store a value that cannot be parsed as a JSON
document, the original binary data is stored. This can be identified during view
processing by using the `meta` object supplied to the `map()` function.

Information that has been identified and stored as binary documents instead of
JSON documents can still be indexed through the views system by creating an
index on the key data. This can be particularly useful when the document key is
significant. For example, if you store information using a prefix to the key to
identify the record type, you can create document-type specific indexes.

For more information and examples, see [Views on non-JSON
Data](#couchbase-views-writing-nonjson).

<a id="couchbase-views-datastore-indexseq"></a>

### Document Storage and Indexing Sequence

The method of storage of information into the Couchbase Server affects how and
when the indexing information is built, and when data written to the cluster is
incorporated into the indexes. In addition, the indexing of data is also
affected by the view system and the settings used when the view is accessed.

The basic storage and indexing sequence is:

 1. A document is stored within the cluster. Initially the document is stored only
    in RAM.

 1. The document is persisted to disk through the standard disk write queue
    mechanism.

 1. Once the document has been persisted to disk, the document can be indexed by the
    view mechanism.

This sequence means that the view results are `eventually consistent` with what
is stored in memory based on whether documents have been persisted to disk. It
is possible to write a document to the cluster, and access the index, without
the newly written document appearing in the generated view index.

Conversely, documents that have been stored with an expiry may continue to be
included within the view index until the document has been removed from the
database by the expiry pager.

Couchbase Server supports the Observe command, which enables the current state
of a document and whether the document has been persisted to disk and/or whether
it has been considered for inclusion in an index.

When accessing a view, the contents of the view are asynchronous to the stored
documents. In addition, the creation and updating of the view is subject to the
`stale` parameter. This controls how and when the view is updated when the view
content is queried. For more information, see [Index Updates and the stale
Parameter](#couchbase-views-writing-stale). Views can also be automatically
updated on a schedule so that their data is not too out of sync with stored
documents. For more information, see [Automated Index
Updates](#couchbase-views-operation-autoupdate).

<a id="couchbase-views-types"></a>

## Development and Production Views

Due to the nature of the Couchbase cluster and because of the size of the
datasets that can be stored across a cluster, the impact of view development
needs to be controlled. Creating a view implies the creation of the index which
could slow down the performance of your server while the index is being
generated. However, views also need to be built and developed using the actively
stored information.

To support both the creation and testing of views, and the deployment of views
in production, Couchbase Server supports two different view types, `Development`
views and `Production` views. The two view types work identically, but have
different purposes and restrictions placed upon their operation.

 * **Development Views**

   Development views are designed to be used while you are still selecting and
   designing your view definitions. While a view is in development mode, views
   operate with the following attributes

    * By default the development view works on only a subset of the stored
      information. You can, however, force the generation of a development view
      information on the full dataset.

    * Uses live data from the selected Couchbase bucket, enabling you to develop and
      refine your view in real-time on your production data.

    * Development views are not automatically rebuilt, and during a rebalance
      operation, development views are not updated, even when when consistent views
      are enabled, as this relies on the automated update mechanism. Updating
      development views in this way would waste system resources.

    * Development views are full editable and modifiable during their lifetime. You
      can change and update the view definition for a development view at any time.

    * During development of the view you can view and edit stored document to help
      develop the view definition.

    * Development views are accessed from client libraries through a different URL
      than production views, making it easy to determine the view type and information
      during development of your application.

    * Within the Web Console the execution of a view by default occurs only over a
      subset of the full set of documents stored in the bucket. You can elect to run
      the View over the full set using the Web Console.

      Because of the selection process, the reduced set of documents may not be fully
      representative of all the documents in the bucket. You should always check the
      view execution over the full set.

 * **Production Views**

   Production views are optimized for production use. A production view has the
   following attributes:

    * Production views always operate on the full dataset for their respective bucket.

    * Production views cannot be modified through the UI. You can only access the
      information exposed through a production view. To make changes to a production
      view, it must be copied to a development view, edited, and re-published.

      Views can be updated by the REST API, but updating a production design document
      immediately invalidates all of the views defined within it.

    * Production views are accessed through a different URL to development views.

The support for the two different view types means that there is a typical work
flow for view development, as shown in the figure below:


![](images/view-types-workflow.png)

The above diagram features the following steps:

 1. Create a development view and view the sample view output.

 1. Refine and update your view definition to suit your needs, repeating the process
    until your view is complete.

    During this phase you can access your view from your client library and
    application to ensure it suits your needs.

 1. Once the view definition is complete, apply your view to your entire Cluster
    dataset.

 1. Push your development view into production. This moves the view from development
    into production, and renames the index (so that the index does not need to be
    rebuilt).

 1. Start using your production view.

Individual views are created as part of a design document. Each design document
can have multiple views, and each Couchbase bucket can have multiple design
documents. You can therefore have both development and production views within
the same bucket while you development different indexes on your data.

For information on publishing a view from development to production state, see
[Publishing Views](#couchbase-views-editor-publishing).

<a id="couchbase-views-writing"></a>

## Writing Views

The fundamentals of a view are straightforward. A view creates a perspective on
the data stored in your Couchbase buckets in a format that can be used to
represent the data in a specific way, define and filter the information, and
provide a basis for searching or querying the data in the database based on the
content. During the view creation process, you define the output structure,
field order, content and any summary or grouping information desired in the
view.

Views achieve this by defining an output structure that translates the stored
JSON object data into a JSON array or object across two components, the key and
the value. This definition is performed through the specification of two
separate functions written in JavaScript. The view definition is divided into
two parts, a map function and a reduce function:

 * **Map function**

   As the name suggests, the map function creates a mapping between the input data
   (the JSON objects stored in your database) and the data as you want it displayed
   in the results (output) of the view. Every document in the Couchbase bucket for
   the view is submitted to the `map()` function in each view once, and it is the
   output from the `map()` function that is used as the result of the view.

   The `map()` function is supplied two arguments by the views processor. The first
   argument is the JSON document data. The optional second argument is the
   associated metadata for the document, such as the expiration, flags, and
   revision information.

   The map function outputs zero or more 'rows' of information using an `emit()`
   function. Each call to the `emit()` function is equivalent to a row of data in
   the view result. The `emit()` function can be called multiple times within the
   single pass of the `map()` function. This functionality allows you to create
   views that may expose information stored in a compound format within a single
   stored JSON record, for example generating a row for each item in an array.

   You can see this in the figure below, where the name, salary and city fields of
   the stored JSON documents are translated into a table (an array of fields) in
   the generated view content.

 * **Reduce function**

   The reduce function is used to summarize the content generated during the map
   phase. Reduce functions are optional in a view and do not have to be defined.
   When they exist, each row of output (from each `emit()` call in the
   corresponding `map()` function) is processed by the corresponding `reduce()`
   function.

   If a reduce function is specified in the view definition it is automatically
   used. You can access a view without enabling the reduce function by disabling
   reduction ( `reduce=false` ) when the view is accessed.

   Typical uses for a reduce function are to produce a summarized count of the
   input data, or to provide sum or other calculations on the input data. For
   example, if the input data included employee and salary data, the reduce
   function could be used to produce a count of the people in a specific location,
   or the total of all the salaries for people in those locations.

The combination of the map and the reduce function produce the corresponding
view. The two functions work together, with the map producing the initial
material based on the content of each JSON document, and the reduce function
summarising the information generated during the map phase. The reduction
process is selectable at the point of accessing the view, you can choose whether
to the reduce the content or not, and, by using an array as the key, you can
specifying the grouping of the reduce information.

Each row in the output of a view consists of the view key and the view value.
When accessing a view using only the map function, the contents of the view key
and value are those explicitly stated in the definition. In this mode the view
will also always contain an `id` field which contains the document ID of the
source record (i.e. the string used as the ID when storing the original data
record).

When accessing a view employing both the map and reduce functions the key and
value are derived from the output of the reduce function based on the input key
and group level specified. A document ID is not automatically included because
the document ID cannot be determined from reduced data where multiple records
may have been merged into one. Examples of the different explicit and implicit
values in views will be shown as the details of the two functions are discussed.

You can see an example of the view creation process in the figure below.


![](images/view-building.png)

Because of the separation of the two elements, you can consider the two
functions individually.

For information on how to write map functions, and how the output of the map
function affects and supports searching, see [Map
Functions](#couchbase-views-writing-map). For details on writing the reduce
function, see [Reduce Functions](#couchbase-views-writing-reduce).

View names must be specified using one or more UTF-8 characters. You cannot have
a blank view name. View names cannot have leading or trailing whitespace
characters (space, tab, newline, or carriage-return).

To create views, you can use either the Admin Console View editor (see [Using
the Views Editor](#couchbase-views-editor) ), use the REST API for design
documents (see [Design Document REST API](#couchbase-views-designdoc-api) ), or
use one of the client libraries that support view management.

For more information and examples on how to query and obtain information from a
map, see [Querying Views](#couchbase-views-writing-querying).

<a id="couchbase-views-writing-map"></a>

### Map Functions

The map function is the most critical part of any view as it provides the
logical mapping between the input fields of the individual objects stored within
Couchbase to the information output when the view is accessed.

Through this mapping process, the map function and the view provide:

 * The output format and structure of the view on the bucket.

 * Structure and information used to query and select individual documents using
   the view information.

 * Sorting of the view results.

 * Input information for summarizing and reducing the view content.

Applications access views through the REST API, or through a Couchbase client
library. All client libraries provide a method for submitting a query into the
view system and obtaining and processing the results.

The basic operation of the map function can be seen in the figure below.


![](images/views-basic-overview.png)

In this example, a map function is taking the Name, City, and Salary fields from
the JSON documents stored in the Couchbase bucket and mapping them to a table of
these fields. The map function which produces this output might look like this:


```
function(doc, meta)
{
  emit(doc.name, [doc.city, doc.salary]);
}
```

When the view is generated the `map()` function is supplied two arguments for
each stored document, `doc` and `meta` :

 * `doc`

   The stored document from the Couchbase bucket, either the JSON or binary
   content. Content type can be identified by accessing the `type` field of the
   `meta` argument object.

 * `meta`

   The metadata for the stored document, containing expiry time, document ID,
   revision and other information. For more information, see [Document
   Metadata](#couchbase-views-datastore-fields).

Every document in the Couchbase bucket is submitted to the `map()` function in
turn. After the view is created, only the documents created or changed since the
last update need to be processed by the view. View indexes and updates are
materialized when the view is accessed. Any documents added or changed since the
last access of the view will be submitted to the `map()` function again so that
the view is updated to reflect the current state of the data bucket.

Within the `map()` function itself you can perform any formatting, calculation
or other detail. To generate the view information, you use calls to the `emit()`
function. Each call to the `emit()` function outputs a single row or record in
the generated view content.

The `emit()` function accepts two arguments, the key and the value for each
record in the generated view:

 * *key*

   The emitted key is used by Couchbase Server both for sorting and querying the
   content in the database.

   The key can be formatted in a variety of ways, including as a string or compound
   value (such as an array or JSON object). The content and structure of the key is
   important, because it is through the emitted key structure that information is
   selected within the view.

   All views are output in a sorted order according to the content and structure of
   the key. Keys using a numeric value are sorted numerically, for strings, UTF-8
   is used. Keys can also support compound values such as arrays and hashes. For
   more information on the sorting algorithm and sequence, see
   [Ordering](#couchbase-views-writing-querying-ordering).

   The key content is used for querying by using a combination of this sorting
   process and the specification of either an explicit key or key range within the
   query specification. For example, if a view outputs the `RECIPE TITLE` field as
   a key, you could obtain all the records matching 'Lasagne' by specifying that
   only the keys matching 'Lasagne' are returned.

   For more information on querying and extracting information using the key value,
   see [Querying Views](#couchbase-views-writing-querying).

 * *value*

   The value is the information that you want to output in each view row. The value
   can be anything, including both static data, fields from your JSON objects, and
   calculated values or strings based on the content of your JSON objects.

   The content of the value is important when performing a reduction, since it is
   the value that is used during reduction, particularly with the built-in
   reduction functions. For example, when outputting sales data, you might put the
   `SALESMAN` into the emitted key, and put the sales amounts into the value. The
   built-in `_sum` function will then total up the content of the corresponding
   value for each unique key.

The format of both key and value is up to you. You can format these as single
values, strings, or compound values such as arrays or JSON. The structure of the
key is important because you must specify keys in the same format as they were
generated in the view specification.

The `emit()` function can be called multiple times in a single map function,
with each call outputting a single row in the generated view. This can be useful
when you want to supporting querying information in the database based on a
compound field. For a sample view definition and selection criteria, see
[Emitting Multiple Rows](#couchbase-views-sample-patterns-multiemit).

Views and map generation are also very forgiving. If you elect to output fields
in from the source JSON objects that do not exist, they will simply be replaced
with a `null` value, rather than generating an error.

For example, in the view below, some of the source records do contain all of the
fields in the specified view. The result in the view result is just the `null`
entry for that field in the value output.


![](images/views-basic-overview-missing.png)

You should check that the field or data source exists during the map processing
before emitting the data.

To better understand how the map function works to output different types of
information and retrieve it, see [View and Query Pattern
Samples](#couchbase-views-sample-patterns).

<a id="couchbase-views-writing-reduce"></a>

### Reduce Functions

Often the information that you are searching or reporting on needs to be
summarized or reduced. There are a number of different occasions when this can
be useful. For example, if you want to obtain a count of all the items of a
particular type, such as comments, recipes matching an ingredient, or blog
entries against a keyword.

When using a reduce function in your view, the value that you specify in the
call to `emit()` is replaced with the value generated by the reduce function.
This is because the value specified by `emit()` is used as one of the input
parameters to the reduce function. The reduce function is designed to reduce a
group of values emitted by the corresponding `map()` function.

Alternatively, reduce can be used for performing sums, for example totalling all
the invoice values for a single client, or totalling up the preparation and
cooking times in a recipe. Any calculation that can be performed on a group of
the emitted data.

In each of the above cases, the raw data is the information from one or more
rows of information produced by a call to `emit()`. The input data, each record
generated by the `emit()` call, is reduced and grouped together to produce a new
record in the output.

The grouping is performed based on the value of the emitted key, with the rows
of information generated during the map phase being reduced and collated
according to the uniqueness of the emitted key.

When using a reduce function the reduction is applied as follows:

 * For each record of input, the corresponding reduce function is applied on the
   row, and the return value from the reduce function is the resulting row.

   For example, using the built-in `_sum` reduce function, the `value` in each case
   would be totaled based on the emitted key:

    ```
    {
       "rows" : [
          {"value" : 13000, "id" : "James", "key" : "James" },
          {"value" : 20000, "id" : "James", "key" : "James" },
          {"value" : 5000,  "id" : "Adam",  "key" : "Adam"  },
          {"value" : 8000,  "id" : "Adam",  "key" : "Adam"  },
          {"value" : 10000, "id" : "John",  "key" : "John"  },
          {"value" : 34000, "id" : "John",  "key" : "John"  }
       ]
    }
    ```

   Using the unique key of the name, the data generated by the map above would be
   reduced, using the key as the collator, to the produce the following output:

    ```
    {
       "rows" : [
          {"value" : 33000, "key" : "James" },
          {"value" : 13000, "key" : "Adam"  },
          {"value" : 44000, "key" : "John"  },
       ]
    }
    ```

   In each case the values for the common keys (John, Adam, James), have been
   totalled, and the six input rows reduced to the 3 rows shown here.

 * Results are grouped on the key from the call to `emit()` if grouping is selected
   during query time. As shown in the previous example, the reduction operates by
   the taking the key as the group value as using this as the basis of the
   reduction.

 * If you use an array as the key, and have selected the output to be grouped
   during querying you can specify the level of the reduction function, which is
   analogous to the element of the array on which the data should be grouped. For
   more information, see [Grouping in
   Queries](#couchbase-views-writing-querying-grouping).

The view definition is flexible. You can select whether the reduce function is
applied when the view is accessed. This means that you can access both the
reduced and unreduced (map-only) content of the same view. You do not need to
create different views to access the two different types of data.

Whenever the reduce function is called, the generated view content contains the
same key and value fields for each row, but the key is the selected group (or an
array of the group elements according to the group level), and the value is the
computed reduction value.

[[[[Couchbase includes three built-in reduce functions,
`_count`](#couchbase-views-writing-reduce-count),
`_sum`](#couchbase-views-writing-reduce-sum), and
`_stats`](#couchbase-views-writing-reduce-stats). You can also write your
owncustom reduction functions](#couchbase-views-writing-reduce-custom).

The reduce function also has a final additional benefit. The results of the
computed reduction are stored in the index along with the rest of the view
information. This means that when accessing a view with the reduce function
enabled, the information comes directly from the index content. This results in
a very low impact on the Couchbase Server to the query (the value is not
computed at runtime), and results in very fast query times, even when accessing
information based on a range-based query.

The `reduce()` function is designed to reduce and summarize the data emitted
during the `map()` phase of the process. It should only be used to summarize the
data, and not to transform the output information or concatenate the information
into a single structure.

When using a composite structure, the size limit on the composite structure
within the `reduce()` function is 64KB.

<a id="couchbase-views-writing-reduce-count"></a>

### Built-in _count

The `_count` function provides a simple count of the input rows from the `map()`
function, using the keys and group level to provide a count of the correlated
items. The values generated during the `map()` stage are ignored.

For example, using the input:


```
{
   "rows" : [
      {"value" : 13000, "id" : "James", "key" : ["James", "Paris"] },
      {"value" : 20000, "id" : "James", "key" : ["James", "Tokyo"] },
      {"value" : 5000,  "id" : "James", "key" : ["James", "Paris"] },
      {"value" : 7000,  "id" : "Adam",  "key" : ["Adam",  "London"] },
      {"value" : 19000, "id" : "Adam",  "key" : ["Adam",  "Paris"] },
      {"value" : 17000, "id" : "Adam",  "key" : ["Adam",  "Tokyo"] },
      {"value" : 22000, "id" : "John",  "key" : ["John",  "Paris"] },
      {"value" : 3000,  "id" : "John",  "key" : ["John",  "London"] },
      {"value" : 7000,  "id" : "John",  "key" : ["John",  "London"] },
    ]
}
```

Enabling the `reduce()` function and using a group level of 1 would produce:


```
{
   "rows" : [
      {"value" : 3, "key" : ["Adam" ] },
      {"value" : 3, "key" : ["James"] },
      {"value" : 3, "key" : ["John" ] }
   ]
}
```

The reduction has produce a new result set with the key as an array based on the
first element of the array from the map output. The value is the count of the
number of records collated by the first element.

Using a group level of 2 would generate the following:


```
{
   "rows" : [
      {"value" : 1, "key" : ["Adam", "London"] },
      {"value" : 1, "key" : ["Adam", "Paris" ] },
      {"value" : 1, "key" : ["Adam", "Tokyo" ] },
      {"value" : 2, "key" : ["James","Paris" ] },
      {"value" : 1, "key" : ["James","Tokyo" ] },
      {"value" : 2, "key" : ["John", "London"] },
      {"value" : 1, "key" : ["John", "Paris" ] }
   ]
}
```

Now the counts are for the keys matching both the first two elements of the map
output.

<a id="couchbase-views-writing-reduce-sum"></a>

### Built-in _sum

The built-in `_sum` function sums the values from the `map()` function call,
this time summing up the information in the value for each row. The information
can either be a single number or during a rereduce an array of numbers.

The input values must be a number, not a string-representation of a number. The
entire map/reduce will fail if the reduce input is not in the correct format.
You should use the `parseInt()` or `parseFloat()` function calls within your
`map()` function stage to ensure that the input data is a number.

For example, using the same sales source data, accessing the group level 1 view
would produce the total sales for each salesman:


```
{
   "rows" : [
      {"value" : 43000, "key" : [ "Adam"  ] },
      {"value" : 38000, "key" : [ "James" ] },
      {"value" : 32000, "key" : [ "John"  ] }
   ]
}
```

Using a group level of 2 you get the information summarized by salesman and
city:


```
{
   "rows" : [
      {"value" : 7000,  "key" : [ "Adam",  "London" ] },
      {"value" : 19000, "key" : [ "Adam",  "Paris"  ] },
      {"value" : 17000, "key" : [ "Adam",  "Tokyo"  ] },
      {"value" : 18000, "key" : [ "James", "Paris"  ] },
      {"value" : 20000, "key" : [ "James", "Tokyo"  ] },
      {"value" : 10000, "key" : [ "John",  "London" ] },
      {"value" : 22000, "key" : [ "John",  "Paris"  ] }
   ]
}
```

<a id="couchbase-views-writing-reduce-stats"></a>

### Built-in _stats

The built-in `_stats` reduce function produces statistical calculations for the
input data. As with the `_sum` function, the corresponding value in the emit
call should be a number. The generated statistics include the sum, count,
minimum ( `min` ), maximum ( `max` ) and sum squared ( `sumsqr` ) of the input
rows.

Using the sales data, a slightly truncated output at group level one would be:


```
{
   "rows" : [
      {
         "value" : {
            "count" : 3,
            "min" : 7000,
            "sumsqr" : 699000000,
            "max" : 19000,
            "sum" : 43000
         },
         "key" : [
            "Adam"
         ]
      },
      {
         "value" : {
            "count" : 3,
            "min" : 5000,
            "sumsqr" : 594000000,
            "max" : 20000,
            "sum" : 38000
         },
         "key" : [
            "James"
         ]
      },
      {
         "value" : {
            "count" : 3,
            "min" : 3000,
            "sumsqr" : 542000000,
            "max" : 22000,
            "sum" : 32000
         },
         "key" : [
            "John"
         ]
      }
   ]
}
```

The same fields in the output value are provided for each of the reduced output
rows.

<a id="couchbase-views-writing-reduce-custom"></a>

### Writing Custom Reduce Functions

The `reduce()` function has to work slightly differently to the `map()`
function. In the primary form, a `reduce()` function must convert the data
supplied to it from the corresponding `map()` function.

The core structure of the reduce function execution is shown the figurebelow.


![](images/custom-reduce.png)

The base format of the `reduce()` function is as follows:


```
function(key, values, rereduce) {
…

return retval;
}
```

The reduce function is supplied three arguments:

 * `key`

   The `key` is the unique key derived from the `map()` function and the
   `group_level` parameter.

 * `values`

   The `values` argument is an array of all of the values that match a particular
   key. For example, if the same key is output three times, `data` will be an array
   of three items containing, with each item containing the value output by the
   `emit()` function.

 * `rereduce`

   The `rereduce` indicates whether the function is being called as part of a
   re-reduce, that is, the reduce function being called again to further reduce the
   input data.

   When `rereduce` is false:

    * The supplied `key` argument will be an array where the first argument is the
      `key` as emitted by the map function, and the `id` is the document ID that
      generated the key.

    * The values is an array of values where each element of the array matches the
      corresponding element within the array of `keys`.

   When `rereduce` is true:

    * `key` will be null.

    * `values` will be an array of values as returned by a previous `reduce()`
      function.

The function should return the reduced version of the information by calling the
`return()` function. The format of the return value should match the format
required for the specified key.

<a id="couchbase-views-writing-reduce-custom-builtin"></a>

### Re-writing the built-in Reduce Functions

Using this model as a template, it is possible to write the full implementation
of the built-in functions `_sum` and `_count` when working with the sales data
and the standard `map()` function below:


```
function(doc, meta)
{
  emit(meta.id, null);
}
```

The `_count` function returns a count of all the records for a given key. Since
argument for the reduce function contains an array of all the values for a given
key, the length of the array needs to be returned in the `reduce()` function:


```
function(key, values, rereduce) {
   if (rereduce) {
       var result = 0;
       for (var i = 0; i < values.length; i++) {
           result += values[i];
       }
       return result;
   } else {
       return values.length;
   }
}
```

To explicitly write the equivalent of the built-in `_sum` reduce function, the
sum of supplied array of values needs to be returned:


```
function(key, values, rereduce) {
  var sum = 0;
  for(i=0; i < values.length; i++) {
    sum = sum + values[i];
  }
  return(sum);
}
```

In the above function, the array of data values is iterated over and added up,
with the final value being returned.

<a id="couchbase-views-writing-reduce-custom-rereduce"></a>

### Handling Rereduce

For `reduce()` functions, they should be both transparent and standalone. For
example, the `_sum` function did not rely on global variables or parsing of
existing data, and didn't need to call itself, hence it is also transparent.

In order to handle incremental map/reduce functionality (i.e. updating an
existing view), each function must also be able to handle and consume the
functions own output. This is because in an incremental situation, the function
must be handle both the new records, and previously computed reductions.

This can be explicitly written as follows:


```
f(keys, values) = f(keys, [ f(keys, values) ])
```

This can been seen graphically in the illustrationbelow, where previous
reductions are included within the array of information are re-supplied to the
reduce function as an element of the array of values supplied to the reduce
function.


![](images/custom-rereduce.png)

That is, the input of a reduce function can be not only the raw data from the
map phase, but also the output of a previous reduce phase. This is called
`rereduce`, and can be identified by the third argument to the `reduce()`. When
the `rereduce` argument is true, both the `key` and `values` arguments are
arrays, with the corresponding element in each containing the relevant key and
value. I.e., `key[1]` is the key related to the value of `value[1]`.

An example of this can be seen by considering an expanded version of the `sum`
function showing the supplied values for the first iteration of the view index
building:


```
function('James', [ 13000,20000,5000 ]) {...}
```

When a document with the 'James' key is added to the database, and the view
operation is called again to perform an incremental update, the equivalent call
is:


```
function('James', [ 19000, function('James', [ 13000,20000,5000 ]) ]) { ... }
```

In reality, the incremental call is supplied the previously computed value, and
the newly emitted value from the new document:


```
function('James', [ 19000, 38000 ]) { ... }
```

Fortunately, the simplicity of the structure for `sum` means that the function
both expects an array of numbers, and returns a number, so these can easily be
recombined.

If writing more complex reductions, where a compound key is output, the
`reduce()` function must be able to handle processing an argument of the
previous reduction as the compound value in addition to the data generated by
the `map()` phase. For example, to generate a compound output showing both the
total and count of values, a suitable `reduce()` function could be written like
this:


```
function(key, values, rereduce) {
  var result = {total: 0, count: 0};
  for(i=0; i < values.length; i++) {
    if(rereduce) {
        result.total = result.total + values[i].total;
        result.count = result.count + values[i].count;
    } else {
        result.total = sum(values);
        result.count = values.length;
    }
  }
  return(result);
}
```

Each element of the array supplied to the function is checked using the built-in
`typeof` function to identify whether the element was an object (as output by a
previous reduce), or a number (from the map phase), and then updates the return
value accordingly.

Using the sample sales data, and group level of two, the output from a reduced
view may look like this:


```
{"rows":[
{"key":["Adam", "London"],"value":{"total":7000,  "count":1}},
{"key":["Adam", "Paris"], "value":{"total":19000, "count":1}},
{"key":["Adam", "Tokyo"], "value":{"total":17000, "count":1}},
{"key":["James","Paris"], "value":{"total":118000,"count":3}},
{"key":["James","Tokyo"], "value":{"total":20000, "count":1}},
{"key":["John", "London"],"value":{"total":10000, "count":2}},
{"key":["John", "Paris"], "value":{"total":22000, "count":1}}
]
}
```

Reduce functions must be written to cope with this scenario in order to cope
with the incremental nature of the view and index building. If this is not
handled correctly, the index will fail to be built correctly.

The `reduce()` function is designed to reduce and summarize the data emitted
during the `map()` phase of the process. It should only be used to summarize the
data, and not to transform the output information or concatenate the information
into a single structure.

When using a composite structure, the size limit on the composite structure
within the `reduce()` function is 64KB.

<a id="couchbase-views-writing-nonjson"></a>

### Views on non-JSON Data

If the data stored within your buckets is not JSON formatted or JSON in nature,
then the information is stored in the database as an attachment to a JSON
document returned by the core database layer.

This does not mean that you cannot create views on the information, but it does
limit the information that you can output with your view to the information
exposed by the document key used to store the information.

At the most basic level, this means that you can still do range queries on the
key information. For example:


```
function(doc, meta)
{
    emit(meta.id, null);
}
```

You can now perform range queries by using the emitted key data and an
appropriate `startkey` and `endkey` value.

If you use a structured format for your keys, for example using a prefix for the
data type, or separators used to identify different elements, then your view
function can output this information explicitly in the view. For example, if you
use a key structure where the document ID is defined as a series of values that
are colon separated:


```
OBJECTYPE:APPNAME:OBJECTID
```

You can parse this information within the JavaScript map/reduce query to output
each item individually. For example:


```
function(doc, meta)
{
    values = meta.id.split(':',3);
    emit([values[0], values[1], values[2]], null);
}
```

The above function will output a view that consists of a key containing the
object type, application name, and unique object ID. You can query the view to
obtain all entries of a specific object type using:


```
startkey=['monster', null, null]&endkey=['monster','\u0000' ,'\u0000']
```

<a id="couchbase-views-writing-utilityfuncs"></a>

### Built-in Utility Functions

Couchbase Server incorporates different utility function beyond the core
JavaScript functionality that can be used within `map()` and `reduce()`
functions where relevant.

 * `dateToArray(date)`

   Converts a JavaScript Date object or a valid date string such as
   "2012-07-30T23:58:22.193Z" into an array of individual date components. For
   example, the previous string would be converted into a JavaScript array:

    ```
    [2012, 7, 30, 23, 58, 22]
    ```

   The function can be particularly useful when building views using dates as the
   key where the use of a reduce function is being used for counting or rollup. For
   an example, see [Date and Time
   Selection](#couchbase-views-sample-patterns-timestamp).

   Currently, the function works only on UTC values. Timezones are not supported.

 * `decodeBase64(doc)`

   Converts a binary (base64) encoded value stored in the database into a string.
   This can be useful if you want to output or parse the contents of a document
   that has not been identified as a valid JSON value.

 * `sum(array)`

   When supplied with an array containing numerical values, each value is summed
   and the resulting total is returned.

   For example:

    ```
    sum([12,34,56,78])
    ```

<a id="couchbase-views-writing-bestpractice"></a>

### View Writing Best Practice

Although you are free to write views matching your data, you should keep in mind
the performance and storage implications of creating and organizing the
different design document and view definitions.

You should keep the following in mind while developing and deploying your views:

 * **Quantity of Views per Design Document**

   Because the index for each map/reduce combination within each view within a
   given design document is updated at the same time, avoid declaring too many
   views within the same design document. For example, if you have a design
   document with five different views, all five views will be updated
   simultaneously, even if only one of the views is accessed.

   This can result in increase view index generation times, especially for
   frequently accessed views. Instead, move frequently used views out to a separate
   design document.

   The exact number of views per design document should be determined from a
   combination of the update frequency requirements on the included views and
   grouping of the view definitions. For example, if you have a view that needs to
   be updated with a high frequency (for example, comments on a blog post), and
   another view that needs to be updated less frequently (e.g. top blogposts),
   separate the views into two design documents so that the comments view can be
   updated frequently, and independently, of the other view.

   You can always configure the updating of the view through the use of the `stale`
   parameter (see [Index Updates and the stale
   Parameter](#couchbase-views-writing-stale) ). You can also configure different
   automated view update times for individual design documents, for more
   information see [Automated Index
   Updates](#couchbase-views-operation-autoupdate).

 * **Modifying Existing Views**

   If you modify an existing view definition, or are executing a full build on a
   development view, the entire view will need to be recreated. In addition, all
   the views defined within the same design document will also be recreated.

   Rebuilding all the views within a single design document is an expensive
   operation in terms of I/O and CPU requirements, as each document will need to be
   parsed by each views `map()` and `reduce()` functions, with the resulting index
   stored on disk.

   This process of rebuilding will occur across all the nodes within the cluster
   and increases the overall disk I/O and CPU requirements until the view has been
   recreated. This process will take place in addition to any production design
   documents and views that also need to be kept up to date.

 * **Don't Include Document ID**

   The document ID is automatically output by the view system when the view is
   accessed. When accessing a view without reduce enabled you can always determine
   the document ID of the document that generated the row. You should not include
   the document ID (from `meta.id` ) in your key or value data.

 * **Check Document Fields**

   Fields and attributes from source documentation in `map()` or `reduce()`
   functions should be checked before their value is checked or compared. Because
   the view definitions in a design document are processed at the same time. A
   runtime error in one of the views within a design document will cause the other
   views in the same design document not to be executed. A common cause of runtime
   errors in views is missing, or invalid field and attribute checking.

   The most common issue is a field within a null object being accessed. This
   generates a runtime error that will cause execution of all views within the
   design document to fail. To address this problem, you should check for the
   existence of a given object before it is used, or the content value is checked.
   For example, the following view will fail if the `doc.ingredient` object does
   not exist, because accessing the `length` attribute on a null object will fail:

    ```
    function(doc, meta)
    {
        emit(doc.ingredient.ingredtext, null);
    }
    ```

   Adding a check for the parent object before calling `emit()` ensures that the
   function is not called unless the field in the source document exists:

    ```
    function(doc, meta)
    {
      if (doc.ingredient)
      {
         emit(doc.ingredient.ingredtext, null);
      }
    }
    ```

   The same check should be performed when comparing values within the `if`
   statement.

   This test should be performed on all objects where you are checking the
   attributes or child values (for example, indices of an array).

 * **View Size, Disk Storage and I/O**

   Within the map function, the information declared within your `emit()` statement
   is included in the view index data and stored on disk. Outputting this
   information will have the following effects on your indexes:

    * *Increased index size on disk* — More detailed or complex key/value combinations
      in generated views will result in more information being stored on disk.

    * *Increased disk I/O* — in order to process and store the information on disk,
      and retrieve the data when the view is queried. A larger more complex key/value
      definition in your view will increase the overall disk I/O required both to
      update and read the data back.

   The result is that the index can be quite large, and in some cases, the size of
   the index can exceed the size of the original source data by a significant
   factor if multiple views are created, or you include large portions or the
   entire document data in the view output.

   For example, if each view contains the entire document as part of the value, and
   you define ten views, the size of your index files will be more than 10 times
   the size of the original data on which the view was created. With a 500-byte
   document and 1 million documents, the view index would be approximately 5GB with
   only 500MB of source data.

 * **Including Value Data in Views**

   Views store both the key and value emitted by the `emit()`. To ensure the
   highest performance, views should only emit the minimum key data required to
   search and select information. The value output by `emit()` should only be used
   when you need the data to be used within a `reduce()`.

   You can obtain the document value by using the core Couchbase API to get
   individual documents or documents in bulk. Some SDKs can perform this operation
   for you automatically. See [Couchbase SDKs](http://www.couchbase.com/develop).

   Using this model will also prevent issues where the emitted view data may be
   inconsistent with the document state and your view is emitting value data from
   the document which is no longer stored in the document itself.

   For views that are not going to be used with reduce, you should output a null
   value:

    ```
    function(doc, meta)
        {
        if(doc.type == 'object')
        emit(doc.experience, null);
        }
    ```

   This will create an optimized view containing only the information required,
   ensuring the highest performance when updating the view, and smaller disk usage.

 * **Don't Include Entire Documents in View output**

   A view index should be designed to provide base information and through the
   implicitly returned document ID point to the source document. It is bad practice
   to include the entire document within your view output.

   You can always access the full document data through the client libraries by
   later requesting the individual document data. This is typically much faster
   than including the full document data in the view index, and enables you to
   optimize the index performance without sacrificing the ability to load the full
   document data.

   For example, the following is an example of a bad view:

    ```
    function(doc, meta)
        {
        if(doc.type == 'object')
        emit(doc.experience, doc);
        }
    ```

   The above view may have significant performance and index size effects.

   This will include the full document content in the index.

   Instead, the view should be defined as:

    ```
    function(doc, meta)
        {
        if(doc.type == 'object')
        emit(doc.experience, null);
        }
    ```

   You can then either access the document data individually through the client
   libraries, or by using the built-in client library option to separately obtain
   the document data.

 * **Using Document Types**

   If you are using a document type (by using a field in the stored JSON to
   indicate the document structure), be aware that on a large database this can
   mean that the view function is called to update the index for document types
   that are not being updated or added to the index.

   For example, within a database storing game objects with a standard list of
   objects, and the users that interact with them, you might use a field in the
   JSON to indicate 'object' or 'player'. With a view that outputs information when
   the document is an object:

    ```
    function(doc, meta)
    {
      emit(doc.experience, null);
    }
    ```

   If only players are added to the bucket, the map/reduce functions to update this
   view will be executed when the view is updated, even though no new objects are
   being added to the database. Over time, this can add a significant overhead to
   the view building process.

   In a database organization like this, it can be easier from an application
   perspective to use separate buckets for the objects and players, and therefore
   completely separate view index update and structure without requiring to check
   the document type during progressing.

 * **Use Built-in Reduce Functions**

   [[[Where possible, use one of the supplied built-in reduce functions,
   `_sum`](#couchbase-views-writing-reduce-sum),
   `_count`](#couchbase-views-writing-reduce-count),
   `_stats`](#couchbase-views-writing-reduce-stats).

   These functions are highly optimized. Using a custom reduce function requires
   additional processing and may impose additional build time on the production of
   the index.

<a id="couchbase-views-schemaless"></a>

## Views in a Schema-less Database

One of the primary advantages of the document-based storage and the use of
map/reduce views for querying the data is that the structure of the stored
documents does not need to be predeclared, or even consistent across multiple
documents.

Instead, the view can cope with and determine the structure of the incoming
documents that are stored in the database, and the view can then reformat and
restructure this data during the map/reduce stage. This simplifies the storage
of information, both in the initial format, and over time, as the format and
structure of the documents can change over time.

For example, you could start storing name information using the following JSON
structure:


```
{
   "email" : "mc@example.org",
   "name" : "Martin Brown"
}
```

A view can be defined that outputs the email and name:


```
function(doc, meta)
{
    emit([doc.name, doc.email], null);
}
```

This generates an index containing the name and email information. Over time,
the application is adjusted to store the first and last names separately:


```
{
   "email" : "mc@example.org",
   "firstname" : "Martin",
   "lastname" : "Brown"
}
```

The view can be modified to cope with both the older and newer document types,
while still emitting a consistent view:


```
function(doc, meta)
{
  if (doc.name && (doc.name != null))
  {
    emit([doc.name, doc.email], null);
  }
  else
  {
    emit([doc.firstname + " " + doc.lastname, doc.email], null);
  }
}
```

The schema-less nature and view definitions allows for a flexible document
structure, and an evolving one, without requiring either an initial schema
description, or explicit schema updates when the format of the information
changes.

<a id="couchbase-views-designdoc-api"></a>

## Design Document REST API

Design documents are used to store one ore more view definitions. Views can be
defined within a design document and uploaded to the server through the REST
API.

<a id="couchbase-views-designdoc-api-storing"></a>

### Storing a Design Document

To create a new design document with one or more views, you can upload the
corresponding design document using the REST API with the definition in place.
The format of this command is as shown in the table below:

<a id="couchbase-views-designdoc-api-put"></a>

**Method**                  | `PUT /bucket/_design/design-doc`                                                                         
----------------------------|----------------------------------------------------------------------------------------------------------
**Request Data**            | Design document definition (JSON)                                                                        
**Response Data**           | Success and stored design document ID                                                                    
**Authentication Required** | optional                                                                                                 
**Return Codes**            |                                                                                                          
201                         | Document created successfully.                                                                           
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.

When creating a design document through the REST API it is recommended that you
create a development ( `dev` ) view. It is recommended that you create a dev
design document and views first, and then check the output of the configured
views in your design document. To create a dev view you *must* explicitly use
the `dev_` prefix for the design document name.

For example, using `curl`, you can create a design document, `byfield`, by
creating a text file (with the name `byfield.ddoc` ) with the design document
content using the following command:


```
shell> curl -X PUT -H 'Content-Type: application/json' \
   http://user:password@localhost:8092/sales/_design/dev_byfield' \
   -d @byfield.ddoc
```

In the above example:

 * `-X PUT`

   Indicates that an HTTP PUT operation is requested.

 * `-H 'Content-Type: application/json'`

   Specifies the HTTP header information. Couchbase Server requires the information
   to be sent and identified as the `application/json` datatype. Information not
   supplied with the content-type set in this manner will be rejected.

 * `http://user:password@localhost:8092/sales/_design/dev_byfield'`

   The URL, including authentication information, of the bucket where you want the
   design document uploaded. The `user` and `password` should either be the
   Administration privileges, or for SASL protected buckets, the bucket name and
   bucket password. If the bucket does not have a password, then the authentication
   information is not required.

   The view being accessed in this case is a development view. To create a
   development view, you *must* use the `dev_` prefix to the view name.

   As a `PUT` command, the URL is also significant, in that the location designes
   the name of the design document. In the example, the URL includes the name of
   the bucket ( `sales` ) and the name of the design document that will be created
   `dev_byfield`.

 * `-d @byfield.ddoc`

   Specifies that the data payload should be loaded from the file `byfield.ddoc`.

If successful, the HTTP response code will be 201 (created). The returned JSON
will contain the field `ok` and the ID of the design document created:


```
{
    "ok":true,
    "id":"_design/dev_byfield"
}
```

The design document will be validated before it is created or updated in the
system. The validation checks for valid Javascript and for the use of valid
built-in reduce functions. Any validation failure is reported as an error.

In the event of an error, the returned JSON will include the field `error` with
a short description, and the field `reason` with a longer description of the
problem.

The format of the design document should include all the views defined in the
design document, incorporating both the map and reduce functions for each named
view. For example:


```
{"views":{"byloc":{"map":"function (doc, meta) {\n  if (meta.type == \"json\") {\n    emit(doc.city, doc.sales);\n  } else {\n    emit([\"blob\"]);\n  }\n}"}}}
```

Formatted, the design document looks like this:


```
{
   "views" : {
      "byloc" : {
         "map" : "function (doc, meta) {\n  if (meta.type == \"json\") {\n    emit(doc.city, doc.sales);\n  } else {\n    emit([\"blob\"]);\n  }\n}"
      }
   }
}
```

The top-level `views` field lists one or more view definitions (the `byloc` view
in this example), and for each view, a corresponding `map()` function.

<a id="couchbase-views-designdoc-api-retrieving"></a>

### Retrieving a Design Document

To obtain an existing design document from a given bucket, you need to access
the design document from the corresponding bucket using a `GET` request, as
detailed in the table below.

<a id="couchbase-views-designdoc-api-get"></a>

**Method**                  | `GET /bucket/_design/design-doc`                                                                                                
----------------------------|---------------------------------------------------------------------------------------------------------------------------------
**Request Data**            | Design document definition (JSON)                                                                                               
**Response Data**           | Success and stored design document ID                                                                                           
**Authentication Required** | optional                                                                                                                        
**Return Codes**            |                                                                                                                                 
200                         | Request completed successfully.                                                                                                 
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.                       
404                         | The requested content could not be found. The returned content will include further information, as a JSON object, if available.


To get back all the design documents with views defined on a bucket, the use following URI path with the GET request. 
In addition to get specific design documents back, the name of the design document can be specified to retrieve it.

```
"ddocs": {
        "uri": "/pools/default/buckets/default/ddocs" // To obtain design docs for this bucket
    }
```

For example, to get the existing design document from the bucket `sales` for the
design document `byfield` :


```
shell> curl -X GET \
    -H 'Content-Type: application/json' \
    'http://user:password@192.168.0.77:8092/sales/_design/dev_byfield
```

Through `curl` this will download the design document to the file `dev_byfield`
filename.

If the bucket does not have a password, you can omit the authentication
information. If the view does not exist you will get an error:


```
{
   "error":"not_found",
   "reason":"missing"
}
```

The HTTP response header will include a JSON document containing the metadata
about the design document being accessed. The information is returned within the
`X-Couchbase-Meta` header of the returned data. You can obtain this information
by using the `-v` option to the `curl`.

For example:


```
shell&gt; curl -v -X GET \
   -H 'Content-Type: application/json' \
   'http://user:password@192.168.0.77:8092/sales/_design/
* About to connect() to 192.168.0.77 port 8092 (#0)
*   Trying 192.168.0.77...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* connected
* Connected to 192.168.0.77 (192.168.0.77) port 8092 (#0)
* Server auth using Basic with user 'Administrator'
> GET /sales/_design/something HTTP/1.1
> Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
> User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
> Host: 192.168.0.77:8092
> Accept: */*
> Content-Type: application/json
>
< HTTP/1.1 200 OK
< X-Couchbase-Meta: {"id":"_design/dev_sample","rev":"5-2785ea87","type":"json"}
< Server: MochiWeb/1.0 (Any of you quaids got a smint?)
< Date: Mon, 13 Aug 2012 10:45:46 GMT
< Content-Type: application/json
< Content-Length: 159
< Cache-Control: must-revalidate
<
{ [data not shown]
100   159  100   159    0     0  41930      0 --:--:-- --:--:-- --:--:-- 53000
* Connection #0 to host 192.168.0.77 left intact
* Closing connection #0
```

The metadata matches the corresponding metadata for a data document.

<a id="couchbase-views-designdoc-api-deleting"></a>

### Deleting a Design Document

To delete a design document, you use the `DELETE` HTTP request with the URL of
the corresponding design document. The summary information for this request is
shown in the table below:

<a id="couchbase-views-designdoc-api-delete"></a>

**Method**                  | `DELETE /bucket/_design/design-doc`                                                                                             
----------------------------|---------------------------------------------------------------------------------------------------------------------------------
**Request Data**            | Design document definition (JSON)                                                                                               
**Response Data**           | Success and confirmed design document ID                                                                                        
**Authentication Required** | optional                                                                                                                        
**Return Codes**            |                                                                                                                                 
200                         | Request completed successfully.                                                                                                 
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.                       
404                         | The requested content could not be found. The returned content will include further information, as a JSON object, if available.

Deleting a design document immediately invalidates the design document and all
views and indexes associated with it. The indexes and stored data on disk are
removed in the background.

For example, to delete the previously created design document using `curl` :


```
shell> curl -v -X DELETE -H 'Content-Type: application/json' \
    'http://Administrator:Password@192.168.0.77:8092/default/_design/dev_byfield'
```

When the design document has been successfully removed, the JSON returned
indicates successful completion, and confirmation of the design document
removed:


```
{"ok":true,"id":"_design/dev_byfield"}
```

Error conditions will be returned if the authorization is incorrect, or the
specified design document cannot be found.

<a id="couchbase-views-writing-querying"></a>

## Querying Views

In order to query a view, the view definition must include a suitable map
function that uses the `emit()` function to generate each row of information.
The content of the key that is generated by the `emit()` provides the
information on which you can select the data from your view.

The key can be used when querying a view as the selection mechanism, either by
using an:

 * *explicit key* — show all the records matching the exact structure of the
   supplied key.

 * *list of keys* — show all the records matching the exact structure of each of
   the supplied keys (effectively showing keya or keyb or keyc).

 * *range of keys* — show all the records starting with keya and stopping on the
   last instance of keyb.

When querying the view results, a number of parameters can be used to select,
limit, order and otherwise control the execution of the view and the information
that is returned.

When a view is accessed without specifying any parameters, the view will produce
results matching the following:

 * Full view specification, i.e. all documents are potentially output according to
   the view definition.

 * Limited to 10 items within the Admin Console, unlimited through the REST API.

 * Reduce function used if defined in the view.

 * Items sorted in ascending order (using UTF-8 comparison for strings, natural
   number order)

View results and the parameters operate and interact in a specific order. The
interaction directly affects how queries are written and data is selected.


![](images/views-query-flow.png)

The core arguments and selection systems are the same through both the REST API
interface, and the client libraries. The setting of these values differes
between different client libraries, but the argument names and expected and
supported values are the same across all environments.

<a id="couchbase-views-querying-rest-api"></a>

### Querying Using the REST API

Querying can be performed through the REST API endpoint. The REST API supports
and operates using the core HTTP protocol, and this is the same system used by
the client libraries to obtain the view data.

Using the REST API you can query a view by accessing any node within the
Couchbase Server cluster on port 8092. For example:


```
GET http://localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Where:

 * `bucketname` is the name of the bucket.

 * `designdocname` is the name of the design document that contains the view.

   For views defined within the development context (see [Development and
   Production Views](#couchbase-views-types) ), the `designdocname` is prefixed
   with `dev_`. For example, the design document `beer` is accessible as a
   development view using `dev_beer`.

   Production views are accessible using their name only.

 * `viewname` is the name of the corresponding view within the design document.

When accessing a view stored within an SASL password-protected bucket, you must
include the bucket name and bucket password within the URL of the request:


```
GET http://bucketname:password@localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Additional arguments to the URL request can be used to select information from
the view, and provide limit, sorting and other options. For example, to output
only ten items:


```
GET http://localhost:8092/bucketname/_design/designdocname/_view/viewname?limit=10
```

The formatting of the URL follows the HTTP specification. The first argument
should be separated from the base URL using a question mark ( `?` ). Additional
arguments should be separated using an ampersand ( `&` ). Special characters
should be literald or escaped according to the HTTP standard rules.

The additional supported arguments are detailed in the table below.

<a id="table-couchbase-querying-arguments"></a>

**Method**                  | `GET /bucket/_design/design-doc/_view/view-name`                                                                                                                     
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Request Data**            | None                                                                                                                                                                 
**Response Data**           | JSON of the rows returned by the view                                                                                                                                
**Authentication Required** | no                                                                                                                                                                   
**Query Arguments**         |                                                                                                                                                                      
`descending`                | Return the documents in descending by key order                                                                                                                      
                            | **Parameters** : boolean; optional                                                                                                                                   
`endkey`                    | Stop returning records when the specified key is reached. Key must be specified as a JSON value.                                                                     
                            | **Parameters** : string; optional                                                                                                                                    
`endkey_docid`              | Stop returning records when the specified document ID is reached                                                                                                     
                            | **Parameters** : string; optional                                                                                                                                    
`full_set`                  | Use the full cluster data set (development views only).                                                                                                              
                            | **Parameters** : boolean; optional                                                                                                                                   
`group`                     | Group the results using the reduce function to a group or single row                                                                                                 
                            | **Parameters** : boolean; optional                                                                                                                                   
`group_level`               | Specify the group level to be used                                                                                                                                   
                            | **Parameters** : numeric; optional                                                                                                                                   
`inclusive_end`             | Specifies whether the specified end key should be included in the result                                                                                             
                            | **Parameters** : boolean; optional                                                                                                                                   
`key`                       | Return only documents that match the specified key. Key must be specified as a JSON value.                                                                           
                            | **Parameters** : string; optional                                                                                                                                    
`keys`                      | Return only documents that match each of keys specified within the given array. Key must be specified as a JSON value. Sorting is not applied when using this option.
                            | **Parameters** : array; optional                                                                                                                                     
`limit`                     | Limit the number of the returned documents to the specified number                                                                                                   
                            | **Parameters** : numeric; optional                                                                                                                                   
`on_error`                  | Sets the response in the event of an error                                                                                                                           
                            | **Parameters** : string; optional                                                                                                                                    
                            | **Supported Values**                                                                                                                                                 
                            | `continue` : Continue to generate view information in the event of an error, including the error information in the view response stream.                            
                            | `stop` : Stop immediately when an error condition occurs. No further view information will be returned.                                                              
`reduce`                    | Use the reduction function                                                                                                                                           
                            | **Parameters** : boolean; optional                                                                                                                                   
`skip`                      | Skip this number of records before starting to return the results                                                                                                    
                            | **Parameters** : numeric; optional                                                                                                                                   
`stale`                     | Allow the results from a stale view to be used                                                                                                                       
                            | **Parameters** : string; optional                                                                                                                                    
                            | **Supported Values** :                                                                                                                                               
                            | `false` : Force a view update before returning data                                                                                                                  
                            | `ok` : Allow stale views                                                                                                                                             
                            | `update_after` : Allow stale view, update view after it has been accessed                                                                                            
`startkey`                  | Return records with a value equal to or greater than the specified key. Key must be specified as a JSON value.                                                       
                            | **Parameters** : string; optional                                                                                                                                    
`startkey_docid`            | Return records starting with the specified document ID                                                                                                               
                            | **Parameters** : string; optional                                                                                                                                    

The output from a view will be a JSON structure containing information about the
number of rows in the view, and the individual view information.

An example of the View result is shown below:


```
{
  "total_rows": 576,
  "rows" : [
      {"value" : 13000, "id" : "James", "key" : ["James", "Paris"] },
      {"value" : 20000, "id" : "James", "key" : ["James", "Tokyo"] },
      {"value" : 5000,  "id" : "James", "key" : ["James", "Paris"] },
…
    ]
}
```

The JSON returned consists of two fields:

 * `total_rows`

   A count of the number of rows of information within the stored View. This shows
   the number of rows in the full View index, not the number of rows in the
   returned data set.

 * `rows`

   An array, with each element of the array containing the returned view data,
   consisting of the value, document ID that generated the row, and the key.

In the event of an error, the HTTP response will be an error type (not 200), and
a JSON structure will be returned containing two fields, the basic `error` and a
more detailed `reason` field. For example:


```
{
  "error":"bad_request",
  "reason":"invalid UTF-8 JSON: {{error,{1,\"lexical error: invalid char in json text.\\n\"}},\n                     \"Paris\"}"
}
```

If you supply incorrect parameters to the query, an error message is returned by
the server. Within the Client Libraries the precise behavior may differ between
individual language implementations, but in all cases, an invalid query should
trigger an appropriate error or exception.

Detail on each of the parameters, and specific areas of interaction are
described within the additional following sections, which also apply to all
client library interfaces.

<a id="couchbase-views-writing-querying-selection"></a>

### Selecting Information

Couchbase Server supports a number of mechanisms for selecting information
returned by the view. Key selection is made after the view results (including
the reduction function) are executed, and after the items in the view output
have been sorted.

When specifying keys to the selection mechanism, the key must be expressed in
the form of a JSON value. For example, when specifying a single key, a string
must be literald ("string").

When specifying the key selection through a parameter, the keys must match the
format of the keys emitted by the view. Compound keys, for example where an
array or hash has been used in the emitted key structure, the supplied selection
value should also be an array or a hash.

The following selection types are supported:

 * **Explicit Key**

   An explicit key can be specified using the parameter `key`. The view query will
   only return results where the key in the view output, and the value supplied to
   the `key` parameter match identically.

   For example, if you supply the value "tomato" only records matching *exactly*
   "tomato" will be selected and returned. Keys with values such as "tomatoes" will
   not be returned.

 * **Key List**

   A list of keys to be output can be specified by supplying an array of values
   using the `keys` parameter. In this instance, each item in the specified array
   will be used as explicit match to the view result key, with each array value
   being combined with a logical `or`.

   For example, if the value specified to the `keys` parameter was
   `["tomato","avocado"]`, then all results with a key of 'tomato' *or* 'avocado'
   will be returned.

   When using this query option, the output results are not sorted by key. This is
   because key sorting of these values would require collating and sorting all the
   rows before returning the requested information.

   In the event of using a compound key, each compound key must be specified in the
   query. For example:

    ```
    keys=[["tomato",20],["avocado",20]]
    ```

 * **Key Range**

   A key range, consisting of a `startkey` and `endkey`. These options can be used
   individually, or together, as follows:

    * `startkey` only

      Output does not start until the first occurrence of `startkey`, or a value
      greater than the specified value, is seen. Output will then continue until the
      end of the view.

    * `endkey` only

      Output starts with the first view result, and continues until the last
      occurrence of `endkey`, or until the emitted value is greater than the computed
      lexical value of `endkey`.

    * `startkey` and `endkey`

      Output of values does not start until `startkey` is seen, and stops when the
      last occurrence of `endkey` is identified.

   When using `endkey`, the `inclusive_end` option specifies whether output stops
   after the last occurrence of the specified `endkey` (the default). If set to
   false, output stops on the last result before the specified `endkey` is seen.

   The matching algorithm works on partial values, which can be used to an
   advantage when searching for ranges of keys. See [Partial Selection and Key
   Ranges](#couchbase-views-writing-querying-selection-partial)

<a id="couchbase-views-writing-querying-selection-compoundbykey"></a>

### Selecting Compound Information by key or keys

If you are generating a compound key within your view, for example when
outputting a date split into individually year, month, day elements, then the
selection value must exactly match the format and size of your compound key. The
value of `key` or `keys` must exactly match the output key structure.

For example, with the view data:


```
{"total_rows":5693,"rows":[
{"id":"1310653019.12667","key":[2011,7,14,14,16,59],"value":null},
{"id":"1310662045.29534","key":[2011,7,14,16,47,25],"value":null},
{"id":"1310668923.16667","key":[2011,7,14,18,42,3],"value":null},
{"id":"1310675373.9877","key":[2011,7,14,20,29,33],"value":null},
{"id":"1310684917.60772","key":[2011,7,14,23,8,37],"value":null},
{"id":"1310693478.30841","key":[2011,7,15,1,31,18],"value":null},
{"id":"1310694625.02857","key":[2011,7,15,1,50,25],"value":null},
{"id":"1310705375.53361","key":[2011,7,15,4,49,35],"value":null},
{"id":"1310715999.09958","key":[2011,7,15,7,46,39],"value":null},
{"id":"1310716023.73212","key":[2011,7,15,7,47,3],"value":null}
]
}
```

Using the `key` selection mechanism you must specify the entire key value, i.e.:


```
?key=[2011,7,15,7,47,3]
```

If you specify a value, such as only the date:


```
?key=[2011,7,15]
```

The view will return no records, since there is no exact key match. Instead, you
must use a range that encompasses the information range you want to output:


```
?startkey=[2011,7,15,0,0,0]&endkey=[2011,7,15,99,99,99]
```

This will output all records within the specified range for the specified date.
For more information, see [Partial Selection with Compound
Keys](#couchbase-views-writing-querying-selection-compound).

<a id="couchbase-views-writing-querying-selection-partial"></a>

### Partial Selection and Key Ranges

Matching of the key value has a precedence from right to left for the key value
and the supplied `startkey` and/or `endkey`. Partial strings may therefore be
specified and return specific information.

For example, given the view data:


```
"a",
 "aa",
 "bb",
 "bbb",
 "c",
 "cc",
 "ccc"
 "dddd"
```

Specifying a `startkey` parameter with the value "aa" will return the last seven
records, including "aa":


```
"aa",
 "bb",
 "bbb",
 "c",
 "cc",
 "ccc",
 "dddd"
```

Specifying a partial string to `startkey` will trigger output of the selected
values as soon as the first value or value greather than the specified value is
identified. For strings, this partial match (from left to right) is identified.
For example, specifying a `startkey` of "d" will return:


```
"dddd"
```

This is because the first match is identified as soon as the a key from a view
row matches the supplied `startkey` value *from left to right*. The supplied
single character matches the first character of the view output.

When comparing larger strings and compound values the same matching algorithm is
used. For example, searching a database of ingredients and specifying a
`startkey` of "almond" will return all the ingredients, including "almond",
"almonds", and "almond essence".

To match all of the records for a given word or value across the entire range,
you can use the null value in the `endkey` parameter. For example, to search for
all records that start only with the word "almond", you specify a `startkey` of
"almond", and an endkey of "almond\u02ad" (i.e. with the last latin character at
the end). If you are using Unicode strings, you may want to use "\uefff".


```
startkey="almond"&endkey="almond\u02ad"
```

The precedence in this example is that output starts when 'almond' is seen, and
stops when the emitted data is lexically greater than the supplied `endkey`.
Although a record with the value "almond\02ad" will never be seen, the emitted
data will eventually be lexically greater than "almond\02ad" and output will
stop.

In effect, a range specified in this way acts as a prefix with all the data
being output that match the specified prefix.

<a id="couchbase-views-writing-querying-selection-compound"></a>

### Partial Selection with Compound Keys

Compound keys, such as arrays or hashes, can also be specified in the view
output, and the matching precedence can be used to provide complex selection
ranges. For example, if time data is emitted in the following format:


```
[year,month,day,hour,minute]
```

Then precise date (and time) ranges can be selected by specifying the date and
time in the generated data. For example, to get information between 1st April
2011, 00:00 and 30th September 2011, 23:59:


```
?startkey=[2011,4,1,0,0]&endkey=[2011,9,30,23,59]
```

The flexible structure and nature of the `startkey` and `endkey` values enable
selection through a variety of range specifications. For example, you can obtain
all of the data from the beginning of the year until the 5th March using:


```
?startkey=[2011]&endkey=[2011,3,5,23,59]
```

You can also examine data from a specific date through to the end of the month:


```
?startkey=[2011,3,16]&endkey=[2011,3,99]
```

In the above example, the value for the `day` element of the array is an
impossible value, but the matching algorithm will identify when the emitted
value is lexically greater than the supplied `endkey` value, and information
selected for output will be stopped.

A limitation of this structure is that it is not possible to ignore the earlier
array values. For example, to select information from 10am to 2pm each day, you
cannot use this parameter set:


```
?startkey=[null,null,null,10,0]&endkey=[null,null,null,14,0]
```

In addition, because selection is made by a outputting a range of values based
on the start and end key, you cannot specify range values for the date portion
of the query:


```
?startkey=[0,0,0,10,0]&endkey=[9999,99,99,14,0]
```

This will instead output all the values from the first day at 10am to the last
day at 2pm.

For more information and examples on formatting and querying this data, see
[Date and Time Selection](#couchbase-views-sample-patterns-timestamp).

<a id="couchbase-views-writing-querying-pagination"></a>

### Pagination

Pagination over results can be achieved by using the `skip` and `limit`
parameters. For example, to get the first 10 records from the view:


```
?limit=10
```

The next ten records can obtained by specifying:


```
?skip=10&limit=10
```

On the server, the `skip` option works by executing the query and literally
iterating over the specified number of output records specified by `skip`, then
returning the remainder of the data up until the specified `limit` records are
reached, if the `limit` parameter is specified.

When paginating with larger values for `skip`, the overhead for iterating over
the records can be significant. A better solution is to track the document id
output by the first query (with the `limit` parameter). You can then use
`startkey_docid` to specify the last document ID seen, skip over that record,
and output the next ten records.

Therefore, the paging sequence is, for the first query:


```
?startkey="carrots"&limit=10
```

Record the last document ID in the generated output, then use:


```
?startkey="carrots"&startkey_docid=DOCID&skip=1&limit=10
```

When using `startkey_docid` you must specify the `startkey` parameter to specify
the information being searched for. By using the `startkey_docid` parameter,
Couchbase Server skips through the B-Tree index to the specified document ID.
This is much faster than the skip/limit example shown above.

<a id="couchbase-views-writing-querying-grouping"></a>

### Grouping in Queries

If you have specified an array as your compound key within your view, then you
can specify the group level to be applied to the query output when using a
`reduce()`.

When grouping is enabled, the view output is grouped according to the key array,
and you can specify the level within the defined array that the information is
grouped by. You do this by specifying the index within the array by which you
want the output grouped using the `group_level` parameter.


![](images/views-grouping.png)

The `group_level` parameter specifies the array index (starting at 1) at which
you want the grouping occur, and generate a unique value based on this value
that is used to identify all the items in the view output that include this
unique value:

 * A group level of `0` groups by the entire dataset (as if no array exists).

 * A group level of `1` groups the content by the unique value of the first element
   in the view key array. For example, when outputting a date split by year, month,
   day, hour, minute, each unique year will be output.

 * A group level of `2` groups the content by the unique value of the first and
   second elements in the array. With a date, this outputs each unique year and
   month, including all records with that year and month into each group.

 * A group level of `3` groups the content by the unique value of the first three
   elements of the view key array. In a date this outputs each unique date (year,
   month, day) grouping all items according to these first three elements.

The grouping will work for any output structure where you have output an
compound key using an array as the output value for the key.

<a id="couchbase-views-writing-querying-grouping-selection"></a>

### Selection when Grouping

When using grouping and selection using the `key`, `keys`, or `startkey` /
`endkey` parameters, the query value should match at least the format (and
element count) of the group level that is being queried.

For example, using the following `map()` function to output information by date
as an array:


```
function(doc, meta)
{
  emit([doc.year, doc.mon, doc.day], doc.logtype);
}
```

If you specify a `group_level` of `2` then you must specify a key using at least
the year and month information. For example, you can specify an explicit key,
such as `[2012,8]` :


```
?group=true&group_level=2&key=[2012,8]
```

Or a range:


```
?group=true&group_level=2&startkey=[2012,2]&endkey=[2012,8]
```

You can also specify a year, month and day, while still grouping at a higher
level. For example, to group by year/month while selecting by specific dates:


```
?group=true&group_level=2&startkey=[2012,2,15]&endkey=[2012,8,10]
```

Specifying compound keys that are shorter than the specified group level may
output unexpected results due to the selection mechanism and the way `startkey`
and `endkey` are used to start and stop the selection of output rows.

<a id="couchbase-views-writing-querying-ordering"></a>

### Ordering

All view results are automatically output sorted, with the sorting based on the
content of the key in the output view. Views are sorted using a specific sorting
format, with the basic order for all basic and compound follows as follows:

 * `null`

 * `false`

 * `true`

 * Numbers

 * Text (case sensitive, lowercase first, UTF-8 order)

 * Arrays (according to the values of each element, in order)

 * Objects (according to the values of keys, in key order)

The natural sorting is therefore by default close to natural sorting order both
alphabetically (A-Z) and numerically (0-9).

There is no collation or foreign language support. Sorting is always according
to the above rules based on UTF-8 values.

You can alter the direction of the sorting (reverse, highest to lowest
numerically, Z-A alphabetically) by using the `descending` option. When set to
true, this reverses the order of the view results, ordered by their key.

Because selection is made after sorting the view results, if you configure the
results to be sorted in descending order and you are selecting information using
a key range, then you must also reverse the `startkey` and `endkey` parameters.
For example, if you query ingredients where the start key is 'tomato' and the
end key is 'zucchini', for example:


```
?startkey="tomato"&endkey="zucchini"
```

The selection will operate, returning information when the first key matches
'tomato' and stopping on the last key that matches 'zucchini'.

If the return order is reversed:


```
?descending=true&startkey="tomato"&endkey="zucchini"
```

The query will return only entries matching 'tomato'. This is because the order
will be reversed, 'zucchini' will appear first, and it is only when the results
contain 'tomato' that any information is returned.

To get all the entries that match, the `startkey` and `endkey` values must also
be reversed:


```
?descending=true&startkey="zucchini"&endkey="tomato"
```

The above selection will start generating results when 'zucchini' is identified
in the key, and stop returning results when 'tomato' is identified in the key.

View output and selection are case sensitive. Specifying the key 'Apple' will
not return 'apple' or 'APPLE' or other case differences. Normalizing the view
output and query input to all lowercase or upper case will simplify the process
by eliminating the case differences.

<a id="couchbase-views-ordering-unicode-collation"></a>

### Understanding Letter Ordering in Views

Couchbase Server uses a Unicode collation algorithm to order letters, so you
should be aware of how this functions. Most developers are typically used to
Byte order, such as that found in ASCII and which is used in most programming
languages for ordering strings during string comparisons.

The following shows the order of precedence used in Byte order, such as ASCII:


```
123456890 < A-Z < a-z
```

This means any items that start with integers will appear before any items with
letters; any items that beginning with capital letters will appear before items
in lower case letters. This means the item named "Apple" will appear before
"apple" and the item "Zebra" will appear before "apple". Compare this with the
order of precedence used in Unicode collation, which is used in Couchbase
Server:


```
123456790 < aAbBcCdDeEfFgGhH...
```

Notice again that items that start with integers will appear before any items
with letters. However, in this case, the lowercase and then uppercase of the
same letter are grouped together. This means that that if "apple" will appear
before "Apple" and would also appear before "Zebra." In addition, be aware that
with accented characters will follow this ordering:


```
a < á < A < Á < b
```

This means that all items starting with "a" *and accented variants of the
letter* will occur before "A" and any accented variants of "A."

**Ordering Example**

In Byte order, keys in an index would appear as follows:


```
"ABC123" < "ABC223" < "abc123" < "abc223" < "abcd23" < "bbc123" < "bbcd23"
```

The same items will be ordered this way by Couchbase Server under Unicode
collation:


```
"abc123" < "ABC123" < "abc223" < "ABC223" < "abcd23" < "bbc123" < "bbcd23"
```

This is particularly important for you to understand if you query Couchbase
Server with a `startkey` and `endkey` to get back a range of results. The items
you would retrieve under Byte order are different compared to Unicode collation.
For more information about ordering results, see [Partial Selection and Key
Ranges](#couchbase-views-writing-querying-selection-partial).

**Ordering and Query Example**

This following example demonstrates Unicode collation in Couchbase Server and
the impact on query results returned with a `startkey` and `endkey`. It is based
on the `beer-sample` database provided with Couchbase Server 2.0. For more
information, see [Beer Sample Bucket](#couchbase-sampledata-beer).

Imagine you want to retrieve all breweries with names starting with uppercase Y.
Your query parameters would appear as follows:


```
startkey="Y"&endkey="z"
```

If you want breweries starting with lowercase y *or* uppercase Y, you would
provides a query as follows:


```
startkey="y"&endkey="z"
```

This will return all names with lower case Y and items up to, but not including
lowercase z, thereby including uppercase Y as well. To retrieve the names of
breweries starting with lowercase y only, you would terminate your range with
capital Y:


```
startkey="y"&endkey="Y"
```

As it happens, the sample database does not contain any results because there
are no beers in it which start with lowercase y. If you want to learn more about
Unicode collation, refer to these resources: [Unicode Technical Standard
\#10](http://www.unicode.org/reports/tr10/) and [ICU User Guide, Customization,
Default
Options](http://userguide.icu-project.org/collation/customization#TOC-Default-Options/).

<a id="couchbase-views-writing-querying-errorcontrol"></a>

### Error Control

There are a number of parameters that can be used to help control errors and
responses during a view query.

 * `on_error`

   The `on_error` parameter specifies whether the view results will be terminated
   on the first error from a node, or whether individual nodes can fail and other
   nodes return information.

   When returning the information generated by a view request, the default response
   is for any raised error to be included as part of the JSON response, but for the
   view process to continue. This allows for individual nodes within the Couchbase
   cluster to timeout or fail, while still generating the requested view
   information.

   In this instance, the error is included as part of the JSON returned:

    ```
    {
       "errors" : [
          {
             "from" : "http://192.168.1.80:9503/_view_merge/?stale=false",
             "reason" : "req_timedout"
          },
          {
             "from" : "http://192.168.1.80:9502/_view_merge/?stale=false",
             "reason" : "req_timedout"
          },
          {
             "from" : "http://192.168.1.80:9501/_view_merge/?stale=false",
             "reason" : "req_timedout"
          }
       ],
       "rows" : [
          {
             "value" : 333280,
             "key" : null
          }
       ]
    }
    ```

   You can alter this behavior by using the `on_error` argument. The default value
   is `continue`. If you set this value to `stop` then the view response will cease
   the moment an error occurs. The returned JSON will contain the error information
   for the node that returned the first error. For example:

    ```
    {
       "errors" : [
          {
             "from" : "http://192.168.1.80:9501/_view_merge/?stale=false",
             "reason" : "req_timedout"
          }
       ],
       "rows" : [
          {
             "value" : 333280,
             "key" : null
          }
       ]
    }
    ```

<a id="couchbase-views-sample-patterns"></a>

## View and Query Pattern Samples

Building views and querying the indexes they generate is a combined process
based both on the document structure and the view definition. Writing an
effective view to query your data may require changing or altering your document
structure, or creating a more complex view in order to allow the specific
selection of the data through the querying mechanism.

For background and examples, the following selections provide a number of
different scenarios and examples have been built to demonstrate the document
structures, views and querying parameters required for different situations.

<a id="couchbase-views-sample-patterns-general"></a>

### General Advice

There are some general points and advice for writing all views that apply
irrespective of the document structure, query format, or view content.

 * Do not assume the field will exist in all documents.

   Fields may be missing from your document, or may only be supported in specific
   document types. Use an `if` test to identify problems. For example:

    ```
    if (document.firstname)...
    ```

 * View output is case sensitive.

   The value emitted by the `emit()` function is case sensitive. Emitting a field
   value of 'Martin' but specifying a `key` value of 'martin' will not match the
   data. Emitted data, and the key selection values, should be normalized to
   eliminate potential problems. For example:

    ```
    emit(doc.firstname.toLowerCase(),null);
    ```

 * Number formatting

   Numbers within JavaScript may inadvertently be converted and output as strings.
   To ensure that data is correctly formatted, the value should be explicitly
   converted. For example:

    ```
    emit(parseInt(doc.value,10),null);
    ```

   The `parseInt()` built-in function will convert a supplied value to an integer.
   The `parseFloat()` function can be used for floating-point numbers.

<a id="couchbase-views-sample-patterns-type"></a>

### Validating Document Type

If your dataset includes documents that may be either JSON or binary, then you
do not want to create a view that outputs individual fields for non-JSON
documents. You can fix this by using a view that checks the metadata `type`
field before outputting the JSON view information:


```
function(doc,meta) {
    if (meta.type == "json") {
        emit(doc.firstname.toLowerCase(),null);
    }
}
```

In the above example, the `emit()` function will only be called on a valid JSON
document. Non-JSON documents will be ignored and not included in the view
output.

<a id="couchbase-views-sample-patterns-primary"></a>

### Document ID (Primary) Index

To create a 'primary key' index, i.e. an index that contains a list of every
document within the database, with the document ID as the key, you can create a
simple view:


```
function(doc,meta)
{
  emit(meta.id,null);
}
```

This enables you to iterate over the documents stored in the database.

This will provide you with a view that outputs the document ID of every document
in the bucket using the document ID as the key.

The view can be useful for obtaining groups or ranges of documents based on the
document ID, for example to get documents with a specific ID prefix:


```
?startkey="object"&endkey="object\u0000"
```

Or to obtain a list of objects within a given range:


```
?startkey="object100"&endkey="object199"
```

For all views, the document ID is automatically included as part of the view
response. But the without including the document ID within the key emitted by
the view, it cannot be used as a search or querying mechanism.

<a id="couchbase-views-sample-patterns-second"></a>

### Secondary Index

The simplest form of view is to create an index against a single field from the
documents stored in your database.

For example, given the document structure:


```
{
    "firstname": "Martin",
    "lastname": "Brown"
}
```

A view to support queries on the `firstname` field could be defined as follows:


```
function(doc, meta)
{
  if (doc.firstname)
  {
     emit(doc.firstname.toLowerCase(),null);
  }
}
```

The view works as follows for each document:

 * Only outputs a record if the document contains a `firstname` field.

 * Converts the content of the `firstname` field to lowercase.

Queries can now be specified by supplying a string converted to lowercase. For
example:


```
?key="martin"
```

Will return all documents where the `firstname` field contains 'Martin',
regardless of the document field capitalization.

<a id="couchbase-views-sample-patterns-expiry"></a>

### Using Expiration Metadata

The metadata object makes it very easy to create and update different views on
your data using information outside of the main document data. For example, you
can use the expiration field within a view to get the list of recently active
sessions in a system.

Using the following `map()` function, which uses the expiration as part of the
emitted data.


```
function(doc, meta)
{
  if (doc.type && doc.type == "session")
  {
    emit(meta.expiration, doc.nickname)
  }
}
```

If you have sessions which are saved with a TTL, this will allow you to give a
view of who was recently active on the service.

<a id="couchbase-views-sample-patterns-multiemit"></a>

### Emitting Multiple Rows

The `emit()` function is used to create a record of information for the view
during the map phase, but it can be called multiple times within that map phase
to allowing querying over more than one source of information from each stored
document.

An example of this is when the source documents contain an array of information.
For example, within a recipe document, the list of ingredients is exposed as an
array of objects. By iterating over the ingredients, an index of ingredients can
be created and then used to find recipes by ingredient.


```
{
    "title": "Fried chilli potatoes",
    "preptime": "5"
    "servings": "4",
    "totaltime": "10",
    "subtitle": "A new way with chips.",
    "cooktime": "5",
    "ingredients": [
        {
            "ingredtext": "chilli powder",
            "ingredient": "chilli powder",
            "meastext": "3-6 tsp"
        },
        {
            "ingredtext": "potatoes, peeled and cut into wedges",
            "ingredient": "potatoes",
            "meastext": "900 g"
        },
        {
            "ingredtext": "vegetable oil for deep frying",
            "ingredient": "vegetable oil for deep frying",
            "meastext": ""
        }
    ],
}
```

The view can be created using the following `map()` function:


```
function(doc, meta)
{
  if (doc.ingredients)
  {
    for (i=0; i < doc.ingredients.length; i++)
    {
        emit(doc.ingredients[i].ingredient, null);
    }
  }
}
```

To query for a specific ingredient, specify the ingredient as a key:


```
?key="carrot"
```

The `keys` parameter can also be used in this situation to look for recipes that
contain multiple ingredients. For example, to look for recipes that contain
either "potatoes" or "chilli powder" you would use:


```
?keys=["potatoes","chilli powder"]
```

This will produce a list of any document containing either ingredient. A simple
count of the document IDs by the client can determine which recipes contain all
three.

The output can also be combined. For example, to look for recipes that contain
carrots and can be cooked in less than 20 minutes, the view can be rewritten as:


```
function(doc, meta)
{
  if (doc.ingredients)
  {
    for (i=0; i < doc.ingredients.length; i++)
    {
      if (doc.ingredients[i].ingredtext &amp;&amp; doc.totaltime)
      {
        emit([doc.ingredients[i].ingredtext, parseInt(doc.totaltime,10)], null);
      }
    }
  }
}
```

In this map function, an array is output that generates both the ingredient
name, and the total cooking time for the recipe. To perform the original query,
carrot recipes requiring less than 20 minutes to cook:


```
?startkey=["carrot",0]&endkey=["carrot",20]
```

This generates the following view:


```
{"total_rows":26471,"rows":[
{"id":"Mangoandcarrotsmoothie","key":["carrots",5],"value":null},
{"id":"Cheeseandapplecoleslaw","key":["carrots",15],"value":null}
]
}
```

<a id="couchbase-views-sample-patterns-timestamp"></a>

### Date and Time Selection

For date and time selection, consideration must be given to how the data will
need to be selected when retrieving the information. This is particularly true
when you want to perform log roll-up or statistical collection by using a reduce
function to count or quantify instances of a particular event over time.

Examples of this in action include querying data over a specific range, on
specific day or date combinations, or specific time periods. Within a
traditional relational database it is possible to perform an extraction of a
specific date or date range by storing the information in the table as a date
type.

Within a map/reduce, the effect can be simulated by exposing the date into the
individual components at the level of detail that you require. For example, to
obtain a report that counts individual log types over a period identifiable to
individual days, you can use the following `map()` function:


```
function(doc, meta) {
    emit([doc.year, doc.mon, doc.day, doc.logtype], null);
}
```

By incorporating the full date into the key, the view provides the ability to
search for specific dates and specific ranges. By modifying the view content you
can simplify this process further. For example, if only searches by year/month
are required for a specific application, the day can be omitted.

And with the corresponding `reduce()` built-in of `_count`, you can perform a
number of different queries. Without any form of data selection, for example,
you can use the `group_level` parameter to summarize down as far as individual
day, month, and year. Additionally, because the date is explicitly output,
information can be selected over a specific range, such as a specific month:


```
endkey=[2010,9,30]&group_level=4&startkey=[2010,9,0]
```

Here the explicit date has been specified as the start and end key. The
`group_level` is required to specify roll-up by the date and log type.

This will generate information similar to this:


```
{"rows":[
{"key":[2010,9,1,"error"],"value":5},
{"key":[2010,9,1,"warning"],"value":10},
{"key":[2010,9,2,"error"],"value":8},
{"key":[2010,9,2,"warning"],"value":9},
{"key":[2010,9,3,"error"],"value":16},
{"key":[2010,9,3,"warning"],"value":8},
{"key":[2010,9,4,"error"],"value":15},
{"key":[2010,9,4,"warning"],"value":11},
{"key":[2010,9,5,"error"],"value":6},
{"key":[2010,9,5,"warning"],"value":12}
]
}
```

Additional granularity, for example down to minutes or seconds, can be achieved
by adding those as further arguments to the map function:


```
function(doc, meta)
{
    emit([doc.year, doc.mon, doc.day, doc.hour, doc.min, doc.logtype], null);
}
```

The same trick can also be used to output based on other criteria. For example,
by day of the week, week number of the year or even by period:


```
function(doc, meta) {
  if (doc.mon)
  {
    var quarter = parseInt((doc.mon - 1)/3,10)+1;

    emit([doc.year, quarter, doc.logtype], null);
  }
}
```

To get more complex information, for example a count of individual log types for
a given date, you can combine the `map()` and `reduce()` stages to provide the
collation.

For example, by using the following `map()` function we can output and collate
by day, month, or year as before, and with data selection at the date level.


```
function(doc, meta) {
    emit([doc.year, doc.mon, doc.day], doc.logtype);
}
```

For convenience, you may wish to use the `dateToArray()` function, which
convertes a date object or string into an array. For example, if the date has
been stored within the document as a single field:


```
function(doc, meta) {
    emit(dateToArray(doc.date), doc.logtype);
}
```

For more information, see `dateToArray()`.

Using the following `reduce()` function, data can be collated for each
individual logtype for each day within a single record of output.


```
function(key, values, rereduce)
{
  var response = {"warning" : 0, "error": 0, "fatal" : 0 };
  for(i=0; i<values.length; i++)
  {
    if (rereduce)
    {
      response.warning = response.warning + values[i].warning;
      response.error = response.error + values[i].error;
      response.fatal = response.fatal + values[i].fatal;
    }
    else
    {
      if (values[i] == "warning")
      {
        response.warning++;
      }
      if (values[i] == "error" )
      {
        response.error++;
      }
      if (values[i] == "fatal" )
      {
        response.fatal++;
      }
    }
  }
  return response;
}
```

When queried using a `group_level` of two (by month), the following output is
produced:


```
{"rows":[
{"key":[2010,7], "value":{"warning":4,"error":2,"fatal":0}},
{"key":[2010,8], "value":{"warning":4,"error":3,"fatal":0}},
{"key":[2010,9], "value":{"warning":4,"error":6,"fatal":0}},
{"key":[2010,10],"value":{"warning":7,"error":6,"fatal":0}},
{"key":[2010,11],"value":{"warning":5,"error":8,"fatal":0}},
{"key":[2010,12],"value":{"warning":2,"error":2,"fatal":0}},
{"key":[2011,1], "value":{"warning":5,"error":1,"fatal":0}},
{"key":[2011,2], "value":{"warning":3,"error":5,"fatal":0}},
{"key":[2011,3], "value":{"warning":4,"error":4,"fatal":0}},
{"key":[2011,4], "value":{"warning":3,"error":6,"fatal":0}}
]
}
```

The input includes a count for each of the error types for each month. Note that
because the key output includes the year, month and date, the view also supports
explicit querying while still supporting grouping and roll-up across the
specified group. For example, to show information from 15th November 2010 to
30th April 2011 using the following query:


```
?endkey=[2011,4,30]&group_level=2&startkey=[2010,11,15]
```

Which generates the following output:


```
{"rows":[
{"key":[2010,11],"value":{"warning":1,"error":8,"fatal":0}},
{"key":[2010,12],"value":{"warning":3,"error":4,"fatal":0}},
{"key":[2011,1],"value":{"warning":8,"error":2,"fatal":0}},
{"key":[2011,2],"value":{"warning":4,"error":7,"fatal":0}},
{"key":[2011,3],"value":{"warning":4,"error":4,"fatal":0}},
{"key":[2011,4],"value":{"warning":5,"error":7,"fatal":0}}
]
}
```

Keep in mind that you can create multiple views to provide different views and
queries on your document data. In the above example, you could create individual
views for the limited datatypes of logtype to create a `warningsbydate` view.

<a id="couchbase-views-sample-patterns-selectivemap"></a>

### Selective Record Output

If you are storing different document types within the same bucket, then you may
want to ensure that you generate views only on a specific record type within the
`map()` phase. This can be achieved by using an `if` statement to select the
record.

For example, if you are storing blog 'posts' and 'comments' within the same
bucket, then a view on the blog posts could be created using the following map:


```
function(doc, meta) {
    if (doc.title && doc.type && doc.date &&
        doc.author && doc.type == 'post')
    {
        emit(doc.title, [doc.date, doc.author]);
    }
}
```

The same solution can also be used if you want to create a view over a specific
range or value of documents while still allowing specific querying structures.
For example, to filter all the records from the statistics logging system over a
date range that are of the type error you could use the following `map()`
function:


```
function(doc, meta) {
    if (doc.logtype == 'error')
    {
       emit([doc.year, doc.mon, doc.day],null);
    }
}
```

The same solution can also be used for specific complex query types. For
example, all the recipes that can be cooked in under 30 minutes, made with a
specific ingredient:


```
function(doc, meta)
{
  if (doc.totaltime &amp;&amp; doc.totaltime <= 20)
  {
    if (doc.ingredients) {
      for (i=0; i < doc.ingredients.length; i++)
      {
        if (doc.ingredients[i].ingredtext)
        {
          emit(doc.ingredients[i].ingredtext, null);
        }
      }
    }
  }
}
```

The above function allows for much quicker and simpler selection of recipes by
using a query and the `key` parameter, instead of having to work out the range
that may be required to select recipes when the cooking time and ingredients are
generated by the view.

These selections are application specific, but by producing different views for
a range of appropriate values, for example 30, 60, or 90 minutes, recipe
selection can be much easier at the expense of updating additional view indexes.

<a id="couchbase-views-sample-patterns-sortreduce"></a>

### Sorting on Reduce Values

The sorting algorithm within the view system outputs information ordered by the
generated key within the view, and therefore it operates before any reduction
takes place. Unfortunately, it is not possible to sort the output order of the
view on computed reduce values, as there is no post-processing on the generated
view information.

To sort based on reduce values, you must access the view content with reduction
enabled from a client, and perform the sorting within the client application.

<a id="couchbase-views-sample-patterns-joins"></a>

### Solutions for Simulating Joins

Joins between data, even when the documents being examined are contained within
the same bucket, are not possible directly within the view system. However, you
can simulate this by making use of a common field used for linking when
outputting the view information. For example, consider a blog post system that
supports two different record types, 'blogpost' and 'blogcomment'. The basic
format for 'blogpost' is:


```
{
    "type" : "post",
    "title" : "Blog post"
    "categories" : [...],
    "author" : "Blog author"
    ...
}
```

The corresponding comment record includes the blog post ID within the document
structure:


```
{
    "type" : "comment",
    "post_id" : "post_3454"
    "author" : "Comment author",
    "created_at" : 123498235
...
}
```

To output a blog post and all the comment records that relate to the blog post,
you can use the following view:


```
function(doc, meta)
{
    if (doc.post_id && doc.type && doc.type == "post")
    {
        emit([doc.post_id, null], null);
    }
    else if (doc.post_id && doc.created_at && doc.type && doc.type == "comment")
    {
        emit([doc.post_id, doc.created_at], null);
    }
}
```

The view makes use of the sorting algorithm when using arrays as the view key.
For a blog post record, the document ID will be output will a null second value
in the array, and the blog post record will therefore appear first in the sorted
output from the view. For a comment record, the first value will be the blog
post ID, which will cause it to be sorted in line with the corresponding parent
post record, while the second value of the array is the date the comment was
created, allowing sorting of the child comments.

For example:


```
{"rows":[
{"key":["post_219",null],       "value":{...}},
{"key":["post_219",1239875435],"value":{...}},
{"key":["post_219",1239875467],"value":{...}},
]
}
```

Another alternative is to make use of a multi-get operation within your client
through the main Couchbase SDK interface, which should load the data from cache.
This allows you to structure your data with the blog post containing an array of
the of the child comment records. For example, the blog post structure might be:


```
{
    "type" : "post",
    "title" : "Blog post"
    "categories" : [...],
    "author" : "Blog author",
    "comments": ["comment_2298","comment_457","comment_4857"],
    ...
}
```

To obtain the blog post information and the corresponding comments, create a
view to find the blog post record, and then make a second call within your
client SDK to get all the comment records from the Couchbase Server cache.

<a id="couchbase-views-sample-patterns-transactions"></a>

### Simulating Transactions

Couchbase Server does not support transactions, but the effect can be simulated
by writing a suitable document and view definition that produces the effect
while still only requiring a single document update to be applied.

For example, consider a typical banking application, the document structure
could be as follows:


```
{
   "account" : "James",
   "value" : 100
}
```

A corresponding record for another account:


```
{
   "account" : "Alice",
   "value" : 200
}
```

To get the balance of each account, the following `map()` :


```
function(doc, meta) {
    if (doc.account && doc.value)
    {
      emit(doc.account,doc.value);
    }
}
```

The `reduce()` function can use the built-in `_sum` function.

When queried, using a `group_level` of 1, the balance of the accounts is
displayed:


```
{"rows":[
{"key":"Alice","value":200},
{"key":"James","value":100}
]
}
```

Money in an account can be updated just by adding another record into the system
with the account name and value. For example, adding the record:


```
{
   "account" : "James",
   "value" : 50
}
```

Re-querying the view produces an updated balance for each account:


```
{"rows":[
{"key":"Alice","value":200},
{"key":"James","value":150}
]
}
```

However, if Alice wants to transfer $100 to James, two record updates are
required:

 1. A record that records an update to Alice's account to reduce the value by 100.

 1. A record that records an update to James's account to increase the value by 100.

Unfortunately, the integrity of the transaction could be compromised in the
event of a problem between step 1 and step 2. Alice's account may be deducted,
without updates James' record.

To simulate this operation while creating (or updating) only one record, a
combination of a transaction record and a view must be used. The transaction
record looks like this:


```
{
     "fromacct" : "Alice",
     "toacct" : "James",
     "value" : 100
}
```

The above records the movement of money from one account to another. The view
can now be updated to handle a transaction record and output a row through
`emit()` to update the value for each account.


```
function(doc, meta)
{
  if (doc.fromacct)
  {
    emit(doc.fromacct, -doc.value);
    emit(doc.toacct, doc.value);
  }
  else
  {
    emit(doc.account, doc.value);
  }
}
```

The above `map()` effectively generates two fake rows, one row subtracts the
amount from the source account, and adds the amount to the destination account.
The resulting view then uses the `reduce()` function to sum up the transaction
records for each account to arrive at a final balance:


```
{"rows":[
{"key":"Alice","value":100},
{"key":"James","value":250}
]
}
```

Throughout the process, only one record has been created, and therefore
transient problems with that record update can be captured without corrupting or
upsetting the existing stored data.

<a id="couchbase-views-sample-patterns-commits"></a>

### Simulating Multi-phase Transactions

The technique in [Simulating
Transactions](#couchbase-views-sample-patterns-transactions) will work if your
data will allow the use of a view to effectively roll-up the changes into a
single operation. However, if your data and document structure do not allow it
then you can use a multi-phase transaction process to perform the operation in a
number of distinct stages.

This method is not reliant on views, but the document structure and update make
it easy to find out if there are 'hanging' or trailing transactions that need to
be processed without additional document updates. Using views and the Observe
operation to monitor changes could lead to long wait times during the
transaction process while the view index is updated.

To employ this method, you use a similar transaction record as in the previous
example, but use the transaction record to record each stage of the update
process.

Start with the same two account records:


```
{
   "type" : "account",
   "account" : "James",
   "value" : 100,
   "transactions" : []
}
```

The record explicitly contains a `transactions` field which contains an array of
all the currently active transactions on this record.

The corresponding record for the other account:


```
{
   "type" : "account",
   "account" : "Alice",
   "value" : 200,
   "transactions" : []
}
```

Now perform the following operations in sequence:

 1. Create a new transaction record that records the transaction information:

     ```
     {
          "type" : "transaction",
          "fromacct" : "Alice",
          "toacct" : "James",
          "value" : 100,
          "status" : "waiting"
     }
     ```

    The core of the transaction record is the same, the difference is the use of a
    `status` field which will be used to monitor the progress of the transaction.

    Record the ID of the transaction, for example, `transact_20120717163`.

 1. Set the value of the `status` field in the transaction document to 'pending':

     ```
     {
          "type" : "transaction",
          "fromacct" : "Alice",
          "toacct" : "James",
          "value" : 100,
          "status" : "pending"
     }
     ```

 1. Find all transaction records in the `pending` state using a suitable view:

     ```
     function(doc, meta)
     {
       if (doc.type && doc.status &&
           doc.type == "transaction" && doc.status == "pending" )
       {
         emit([doc.fromacct,doc.toacct], doc.value);
       }
     }
     ```

 1. Update the record identified in `toacct` with the transaction information,
    ensuring that the transaction is not already pending:

     ```
     {
        "type" : "account",
        "account" : "Alice",
        "value" : 100,
        "transactions" : ["transact_20120717163"]
     }
     ```

    Repeat on the other account:

     ```
     {
        "type" : "account",
        "account" : "James",
        "value" : 200,
        "transactions" : ["transact_20120717163"]
     }
     ```

 1. Update the transaction record to mark that the records have been updated:

     ```
     {
          "type" : "transaction",
          "fromacct" : "Alice",
          "toacct" : "James",
          "value" : 100,
          "status" : "committed"
     }
     ```

 1. Find all transaction records in the `committed` state using a suitable view:

     ```
     function(doc, meta)
     {
       if (doc.type && doc.status &&
           doc.type == "transaction" && doc.status == "committed" )
       {
         emit([doc.fromacct, doc.toacct], doc.value);
       }
     }
     ```

    Update the source account record noted in the transaction and remove the
    transaction ID:

     ```
     {
        "type" : "account",
        "account" : "Alice",
        "value" : 100,
        "transactions" : []
     }
     ```

    Repeat on the other account:

     ```
     {
        "type" : "account",
        "account" : "James",
        "value" : 200,
        "transactions" : []
     }
     ```

 1. Update the transaction record state to 'done'. This will remove the transaction
    from the two views used to identify unapplied, or uncommitted transactions.

Within this process, although there are multiple steps required, you can
identify at each step whether a particular operation has taken place or not.

For example, if the transaction record is marked as 'pending', but the
corresponding account records do not contain the transaction ID, then the record
still needs to be updated. Since the account record can be updated using a
single atomic operation, it is easy to determine if the record has been updated
or not.

The result is that any sweep process that accesses the views defined in each
step can determine whether the record needs updating. Equally, if an operation
fails, a record of the transaction, and whether the update operation has been
applied, also exists, allowing the changes to be reversed and backed out.

<a id="couchbase-views-writing-sql"></a>

## Translating SQL to Map/Reduce


```
SELECT fieldlist FROM table \
    WHERE condition \
    GROUP BY groupfield \
    ORDER BY orderfield \
    LIMIT limitcount OFFSET offsetcount
```

The different elements within the source statement affect how a view is written
in the following ways:

 * `SELECT fieldlist`

   The field list within the SQL statement affects either the corresponding key or
   value within the `map()` function, depending on whether you are also selecting
   or reducing your data. See [Translating SQL Field Selection (SELECT) to
   Map/Reduce](#couchbase-views-writing-sql-select)

 * `FROM table`

   There are no table compartments within Couchbase Server and you cannot perform
   views across more than one bucket boundary. However, if you are using a `type`
   field within your documents to identify different record types, then you may
   want to use the `map()` function to make a selection.

   For examples of this in action, see [Selective Record
   Output](#couchbase-views-sample-patterns-selectivemap).

 * `WHERE condition`

   The `map()` function and the data generated into the view key directly affect
   how you can query, and therefore how selection of records takes place. For
   examples of this in action, see [Translating SQL WHERE to
   Map/Reduce](#couchbase-views-writing-sql-where).

 * `ORDER BY orderfield`

   The order of record output within a view is directly controlled by the key
   specified during the `map()` function phase of the view generation.

   For further discussion, see [Translating SQL ORDER BY to
   Map/Reduce](#couchbase-views-writing-sql-order).

 * `LIMIT limitcount OFFSET offsetcount`

   There are a number of different paging strategies available within the
   map/reduce and views mechanism. Discussion on the direct parameters can be seen
   in [Translating SQL LIMIT and OFFSET](#couchbase-views-writing-sql-paging). For
   alternative paging solutions, see
   [Pagination](#couchbase-views-writing-querying-pagination).

 * `GROUP BY groupfield`

   Grouping within SQL is handled within views through the use of the `reduce()`
   function. For comparison examples, see [Translating SQL GROUP BY to
   Map/Reduce](#couchbase-views-writing-sql-group).

The interaction between the view `map()` function, `reduce()` function,
selection parameters and other miscellaneous parameters according to the table
below:

<a id="table-couchbase-views-writing-sql"></a>

SQL Statement Fragment | View Key | View Value | `map()` Function | `reduce()` Function                                         | Selection Parameters | Other Parameters
-----------------------|----------|------------|------------------|-------------------------------------------------------------|----------------------|-----------------
SELECT fields          | Yes      | Yes        | Yes              | No: with `GROUP BY` and `SUM()` or `COUNT()` functions only | No                   | No              
FROM table             | No       | No         | Yes              | No                                                          | No                   | No              
WHERE clause           | Yes      | No         | Yes              | No                                                          | Yes                  | No              
ORDER BY field         | Yes      | No         | Yes              | No                                                          | No                   | `descending`    
LIMIT x OFFSET y       | No       | No         | No               | No                                                          | No                   | `limit`, `skip` 
GROUP BY field         | Yes      | Yes        | Yes              | Yes                                                         | No                   | No              

Within SQL, the basic query structure can be used for a multitude of different
queries. For example, the same ' `SELECT fieldlist FROM table WHERE xxxx` can be
used with a number of different clauses.

Within map/reduce and Couchbase Server, multiple views may be needed to be
created to handled different query types. For example, performing a query on all
the blog posts on a specific date will need a very different view definition
than one needed to support selection by the author.

<a id="couchbase-views-writing-sql-select"></a>

### Translating SQL Field Selection (SELECT) to Map/Reduce

The field selection within an SQL query can be translated into a corresponding
view definition, either by adding the fields to the emitted key (if the value is
also used for selection in a `WHERE` clause), or into the emitted value, if the
data is separate from the required query parameters.

For example, to get the sales data by country from each stored document using
the following `map()` function:


```
function(doc, meta) {
  emit([doc.city, doc.sales], null);
}
```

If you want to output information that can be used within a reduce function,
this should be specified in the value generated by each `emit()` call. For
example, to reduce the sales figures the above `map()` function could be
rewritten as:


```
function(doc, meta) {
  emit(doc.city, doc.sales);
}
```

In essence this does not produce significantly different output (albeit with a
simplified key), but the information can now be reduced using the numerical
value.

If you want to output data or field values completely separate to the query
values, then these fields can be explicitly output within the value portion of
the view. For example:


```
function(doc, meta) {
  emit(doc.city, [doc.name, doc.sales]);
}
```

If the entire document for each item is required, load the document data after
the view has been requested through the client library. For more information on
this parameter and the performance impact, see [View Writing Best
Practice](#couchbase-views-writing-bestpractice).

Within a `SELECT` statement it is common practice to include the primary key for
a given record in the output. Within a view this is not normally required, since
the document ID that generated each row is always included within the view
output.

<a id="couchbase-views-writing-sql-where"></a>

### Translating SQL WHERE to Map/Reduce

The `WHERE` clause within an SQL statement forms the selection criteria for
choosing individual records. Within a view, the ability to query the data is
controlled by the content and structure of the `key` generated by the `map()`
function.

In general, for each `WHERE` clause you need to include the corresponding field
in the key of the generated view, and then use the `key`, `keys` or `startkey` /
`endkey` combinations to indicate the data you want to select.. The complexity
occurs when you need to perform queries on multiple fields. There are a number
of different strategies that you can use for this.

The simplest way is to decide whether you want to be able to select a specific
combination, or whether you want to perform range or multiple selections. For
example, using our recipe database, if you want to select recipes that use the
ingredient 'carrot' and have a cooking time of exactly 20 minutes, then you can
specify these two fields in the `map()` function:


```
function(doc, meta)
{
  if (doc.ingredients)
  {
    for(i=0; i < doc.ingredients.length; i++)
    {
      emit([doc.ingredients[i].ingredient, doc.totaltime], null);
    }
  }
}
```

Then the query is an array of the two selection values:


```
?key=["carrot",20]
```

This is equivalent to the SQL query:


```
SELECT recipeid FROM recipe JOIN ingredients on ingredients.recipeid = recipe.recipeid
    WHERE ingredient = 'carrot' AND totaltime = 20
```

If, however, you want to perform a query that selects recipes containing carrots
that can be prepared in less than 20 minutes, a range query is possible with the
same `map()` function:


```
?startkey=["carrot",0]&endkey=["carrot",20]
```

This works because of the sorting mechanism in a view, which outputs in the
information sequentially, fortunately nicely sorted with carrots first and a
sequential number.

More complex queries though are more difficult. What if you want to select
recipes with carrots and rice, still preparable in under 20 minutes?

A standard `map()` function like that above wont work. A range query on both
ingredients will list all the ingredients between the two. There are a number of
solutions available to you. First, the easiest way to handle the timing
selection is to create a view that explicitly selects recipes prepared within
the specified time. I.E:


```
function(doc, meta)
{
  if (doc.totaltime <= 20)
  {
    ...
  }
}
```

Although this approach seems to severely limit your queries, remember you can
create multiple views, so you could create one for 10 mins, one for 20, one for
30, or whatever intervals you select. It's unlikely that anyone will really want
to select recipes that can be prepared in 17 minutes, so such granular selection
is overkill.

The multiple ingredients is more difficult to solve. One way is to use the
client to perform two queries and merge the data. For example, the `map()`
function:


```
function(doc, meta)
{
  if (doc.totaltime &amp;&amp; doc.totaltime <= 20)
  {
    if (doc.ingredients)
    {
      for(i=0; i < doc.ingredients.length; i++)
      {
        emit(doc.ingredients[i].ingredient, null);
      }
    }
  }
}
```

Two queries, one for each ingredient can easily be merged by performing a
comparison and count on the document ID output by each view.

The alternative is to output the ingredients twice within a nested loop, like
this:


```
function(doc, meta)
{
  if (doc.totaltime &amp;&amp; doc.totaltime <= 20)
  {
    if (doc.ingredients)
    {
      for (i=0; i < doc.ingredients.length; i++)
      {
        for (j=0; j < doc.ingredients.length; j++)
        {
          emit([doc.ingredients[i].ingredient, doc.ingredients[j].ingredient], null);
        }
      }
    }
  }
}
```

Now you can perform an explicit query on both ingredients:


```
?key=["carrot","rice"]
```

If you really want to support flexible cooking times, then you can also add the
cooking time:


```
function(doc, meta)
{
  if (doc.ingredients)
  {
    for (i=0; i < doc.ingredients.length; i++)
    {
      for (j=0; j < doc.ingredients.length; j++)
      {
        emit([doc.ingredients[i].ingredient, doc.ingredients[j].ingredient, recipe.totaltime], null);
      }
    }
  }
}
```

And now you can support a ranged query on the cooking time with the two
ingredient selection:


```
?startkey=["carrot","rice",0]&key=["carrot","rice",20]
```

This would be equivalent to:


```
SELECT recipeid FROM recipe JOIN ingredients on ingredients.recipeid = recipe.recipeid
    WHERE (ingredient = 'carrot' OR ingredient = 'rice') AND totaltime = 20
```

<a id="couchbase-views-writing-sql-order"></a>

### Translating SQL ORDER BY to Map/Reduce

The `ORDER BY` clause within SQL controls the order of the records that are
output. Ordering within a view is controlled by the value of the key. However,
the key also controls and supports the querying mechanism.

In `SELECT` statements where there is no explicit `WHERE` clause, the emitted
key can entirely support the sorting you want. For example, to sort by the city
and salesman name, the following `map()` will achieve the required sorting:


```
function(doc, meta)
{
   emit([doc.city, doc.name], null)
}
```

If you need to query on a value, and that query specification is part of the
order sequence then you can use the format above. For example, if the query
basis is city, then you can extract all the records for 'London' using the above
view and a suitable range query:


```
?endkey=["London\u0fff"]&startkey=["London"]
```

However, if you want to query the view by the salesman name, you need to reverse
the field order in the `emit()` statement:


```
function(doc, meta)
{
   emit([doc.name,doc.city],null)
}
```

Now you can search for a name while still getting the information in city order.

The order the output can be reversed (equivalent to `ORDER BY field DESC` ) by
using the `descending` query parameter. For more information, see
[Ordering](#couchbase-views-writing-querying-ordering).

<a id="couchbase-views-writing-sql-group"></a>

### Translating SQL GROUP BY to Map/Reduce

The `GROUP BY` parameter within SQL provides summary information for a group of
matching records according to the specified fields, often for use with a numeric
field for a sum or total value, or count operation.

For example:


```
SELECT name,city,SUM(sales) FROM sales GROUP BY name,city
```

This query groups the information by the two fields 'name' and 'city' and
produces a sum total of these values. To translate this into a map/reduce
function within Couchbase Server:

 * From the list of selected fields, identify the field used for the calculation.
   These will need to be exposed within the value emitted by the `map()` function.

 * Identify the list of fields in the `GROUP BY` clause. These will need to be
   output within the key of the `map()` function.

 * Identify the grouping function, for example `SUM()` or `COUNT()`. You will need
   to use the equivalent built-in function, or a custom function, within the
   `reduce()` function of the view.

For example, in the above case, the corresponding map function can be written as
`map()` :


```
function(doc, meta)
{
   emit([doc.name,doc.city],doc.sales);
}
```

This outputs the name and city as the key, and the sales as the value. Because
the `SUM()` function is used, the built-in `reduce()` function `_sum` can be
used.

An example of this map/reduce combination can be seen in [Built-in
_sum](#couchbase-views-writing-reduce-sum).

More complex grouping operations may require a custom reduce function. For more
information, see [Writing Custom Reduce
Functions](#couchbase-views-writing-reduce-custom).

<a id="couchbase-views-writing-sql-paging"></a>

### Translating SQL LIMIT and OFFSET

Within SQL, the `LIMIT` and `OFFSET` clauses to a given query are used as a
paging mechanism. For example, you might use:


```
SELECT recipeid,title FROM recipes LIMIT 100
```

To get the first 100 rows from the database, and then use the `OFFSET` to get
the subsequent groups of records:


```
SELECT recipeid,title FROM recipes LIMIT 100 OFFSET 100
```

With Couchbase Server, the `limit` and `skip` parameters when supplied to the
query provide the same basic functionality:


```
?limit=100&skip=100
```

Performance for high values of skip can be affected. See
[Pagination](#couchbase-views-writing-querying-pagination) for some further
examples of paging strategies.

<a id="couchbase-views-writing-geo"></a>

## Writing Geospatial Views

Geospatial support was introduced as an *experimental* feature in Couchbase
Server 2.0. This feature is currently unsupported and is provided only for the
purposes of demonstration and testing.

GeoCouch adds two-dimensional spatial index support to Couchbase. Spatial
support enables you to record geometry data into the bucket and then perform
queries which return information based on whether the recorded geometries
existing within a given two-dimensional range such as a bounding box. This can
be used in spatial queries and in particular geolocationary queries where you
want to find entries based on your location or region.

The GeoCouch support is provided through updated index support and modifications
to the view engine to provide advanced geospatial queries.

<a id="couchbase-views-writing-geo-data"></a>

### Adding Geometry Data

GeoCouch supports the storage of any geometry information using the
[GeoJSON](http://geojson.org/geojson-spec.html) specification. The format of the
storage of the point data is arbitrary with the geometry type being supported
during the view index generation.

For example, you can use two-dimensional geometries for storing simple location
data. You can add these to your Couchbase documents using any field name. The
convention is to use a single field with two-element array with the point
location, but you can also use two separate fields or compound structures as it
is the view that compiles the information into the geospatial index.

For example, to populate a bucket with city location information, the document
sent to the bucket could be formatted like that below:


```
{
"loc" : [-122.270833, 37.804444],
"title" : "Oakland"
}
```

<a id="couchbase-views-writing-geo-views"></a>

### Views and Queries

The GeoCouch extension uses the standard Couchbase indexing system to build a
two-dimensional index from the point data within the bucket. The format of the
index information is based on the
[GeoJSON](http://geojson.org/geojson-spec.html) specification.

To create a geospatial index, use the `emit()` function to output a GeoJSON
Point value containing the coordinates of the point you are describing. For
example, the following function will create a geospatial index on the earlier
spatial record example.


```
function(doc, meta)
{
  if (doc.loc)
  {
     emit(
          {
             type: "Point",
             coordinates: doc.loc,
          },
          [meta.id, doc.loc]);
  }
}
```

The key in the spatial view index can be any valid GeoJSON geometry value,
including points, multipoints, linestrings, polygons and geometry collections.

The view `map()` function should be placed into a design document using the
`spatial` prefix to indicate the nature of the view definition. For example, the
following design document includes the above function as the view `points`


```
{
   "spatial" : {
      "points" : "function(doc, meta) { if (doc.loc) { emit({ type: \"Point\", coordinates: [doc.loc[0], doc.loc[1]]}, [meta.id, doc.loc]);}}",
   }
}
```

To execute the geospatial query you use the design document format using the
embedded spatial indexing. For example, if the design document is called `main`
within the bucket `places`, the URL will be
`http://localhost:8092/places/_design/main/_spatial/points`.

Spatial queries include support for a number of additional arguments to the view
request. The full list is provided in the following summary table.

<a id="couchbase-querying-arguments-geo"></a>

**Method**                  | `GET /bucket/_design/design-doc/_spatial/spatial-name`              
----------------------------|---------------------------------------------------------------------
**Request Data**            | None                                                                
**Response Data**           | JSON of the documents returned by the view                          
**Authentication Required** | no                                                                  
                            | **Query Arguments**                                                 
`bbox`                      | Specify the bounding box for a spatial query                        
                            | **Parameters** : string; optional                                   
`limit`                     | Limit the number of the returned documents to the specified number  
                            | **Parameters** : numeric; optional                                  
`skip`                      | Skip this number of records before starting to return the results   
                            | **Parameters** : numeric; optional                                  
`stale`                     | Allow the results from a stale view to be used                      
                            | **Parameters** : string; optional                                   
                            | **Supported Values**                                                
                            | `false` : Force update of the view index before results are returned
                            | `ok` : Allow stale views                                            
                            | `update_after` : Allow stale view, update view after access         

Bounding Box QueriesIf you do not supply a bounding box, the full dataset is
returned. When querying a spatial index you can use the bounding box to specify
the boundaries of the query lookup on a given value. The specification should be
in the form of a comma-separated list of the coordinates to use during the
query.

These coordinates are specified using the GeoJSON format, so the first two
numbers are the lower left coordinates, and the last two numbers are the upper
right coordinates.

For example, using the above design document:


```
GET http://localhost:8092/places/_design/main/_spatial/points?bbox=0,0,180,90
Content-Type: application/json
```

Returns the following information:


```
{
   "update_seq" : 3,
   "rows" : [
      {
         "value" : [
            "oakland",
            [
               10.898333,
               48.371667
            ]
         ],
         "bbox" : [
            10.898333,
            48.371667,
            10.898333,
            48.371667
         ],
         "id" : "augsburg"
      }
   ]
}
```

Note that the return data includes the value specified in the design document
view function, and the bounding box of each individual matching document. If the
spatial index includes the `bbox` bounding box property as part of the
specification, then this information will be output in place of the
automatically calculated version.

<a id="couchbase-monitoring"></a>
