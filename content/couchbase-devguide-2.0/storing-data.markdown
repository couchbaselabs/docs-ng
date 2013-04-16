# Storing Data

This section describes how Couchbase Server stores information from your
application. It includes information that you will store with every item, and
how Couchbase Server structures storage in data buckets. The last sections will
briefly describe basic operations you can perform on data buckets during
application development.

<a id="using-keys-values-metadata"></a>

## About Keys, Values and Meta-data

Earlier we briefly described how Couchbase Server stores information; the server
stores all data as key-value pairs. A value can be a string, image, integers, or
serialized objects, and valid JSON documents. In general, the Couchbase Server
does not attempt to interpret any structure for the value you provide.

<a id="couchbase-keys"></a>

### Specifying Keys

Keys are unique identifiers that you provide as a parameter when you perform any
operation on data. Each document you store in a data bucket must have a unique
document ID, which is similar to the concept of a SQL primary key. The following
applies to keys:

 * Keys are strings, typically enclosed by quotes for any given SDK.

 * No spaces are allowed in a key.

 * Separators and identifiers are allowed, such as underscore: 'person\_93847'.

 * A key must be unique within a bucket; if you attempt to store the same key in a
   bucket, it will either overwrite the value or return an error in the case of
   `add()`.

 * Maximum key size is 250 bytes. Couchbase Server stores all keys in RAM and does
   not remove these keys to free up space in RAM. Take this into consideration when
   you select keys and key length for your application.

This last point about key size is important if you consider the size of keys
stored for tens or hundreds of millions of records. One hundred million keys
which are 70 Bytes each plus meta data at 150 Bytes each will require about 45
GB of RAM for document meta data.

<a id="couchbase-values"></a>

### Specifying Values

Any value you want to store in Couchbase Server will be stored as a document, or
as a pure byte string. In the case of JSON documents, the JSON syntax enables
you to provide context and structure for the data. The following applies to
values in Couchbase Server:

 * In general, values have no implied meaning when stored in the server.

 * Integers have implicit value for particular operations, namely incrementing and
   decrementing. This means Couchbase Server recognizes integers as values that can
   be incremented and decremented.

 * Strings, or serialized objects can be stored.

 * Documents stored in memcached buckets can be up to 1 MB; values stored in
   Couchbase buckets can be up to 20 MB.

In general it is to your advantage to keep any documents as small as possible;
this way, they require less RAM, they will require less network bandwidth, and
by using smaller values Couchbase Server can better distribute the information
across nodes.

<a id="more-on-metadata"></a>

### More on Metadata

When you store a key-document pair in Couchbase Server, it also saves meta data
that is associated with the new record. The following are the types of meta
data:

 * Expiration, also known as Time to Live, or TTL.

 * Check and Set value (CAS), which is often also called a Compare and Swap value.

 * Flags, which are typically SDK-specific and are often used to identify the type
   of data stored, or to specify formatting.

Couchbase Server also stores metadata that will not be visible to you, but is
used internally by the server to track keys and internally manage documents.

CAS values enable you to store information and then require that a client
provide the correct unique CAS value in order to update it. Be aware that
performing a function with CAS does slow storing or retrieval. There are some
operations that should be fast in nature where you do not want to perform with
CAS, for instance `append()`. For some SDKs a CAS value is nonetheless required
to perform the operation. In this case, you can provide 0 as the CAS and the
operation will execute without comparing the CAS value. For more information,
see "Using Couchbase SDKs."

Flags are used by SDKs to perform a variety of information- and SDK-specifc
function. Typically a Couchbase SDK will use a flag to determine if information
should be serialized or formatted in a particular way. For instance, in the case
of Java, a flag can signify the data type of an object you are storing. Some
SDKs will expose flags for an application to handle; in other SDKs flags may be
automatically handled by the SDK itself. For more information about the flags
unique to your chosen SDK, please refer to the SDK's API reference.

On average, document metadata is about 150 Bytes per item. Couchbase Server
keeps all document metadata and keys in RAM and does not remove them from RAM to
free up additional space. This means 100 million items with a 70 Byte key and
150 Byte meta data would require approximately 45 GB of RAM at runtime.

As discussed previously in this guide, you can provide an explicit expiration
for a record or let Couchbase assign a default. The default expiration for any
given record is 0, which signifies indefinite storage. Couchbase will keep the
item stored until you explicitly perform a `delete()` on that key. Alternately
if you remove the entire bucket, Couchbase will delete the record. Expirations
are typically set in seconds:

 * Items < 30 days: if you want to store an item for thirty days or less, you
   specify the number of seconds until expiration.

 * Items > 30 days: if you want to store an item for thirty days or more, you
   specify the an absolute Unix epoch time. Milliseconds will be rounded up to the
   nearest second. Couchbase Server will delete an item at this time.

If you provide a time to live in seconds that is greater than the number of
seconds in 30 days (60 \* 60 \*24 \* 30) Couchbase Server will consider this to
be a real Unix epoch time value, rather than interpret it as seconds. It will
remove the item at that epoch time.

<a id="how-couchbase-handles-expirations"></a>

### Understanding Document Expirations

Time to live can be a bit confusing for developers at first. There are many
cases where you may set an expiration to be 30 seconds, but the record may still
exist on disk after expiration.

There are two ways that Couchbase Server will remove items flagged for deletion:

 * Lazy Deletion: key are flagged for deletion; after the next request for the key,
   it will be removed. This applies to data in Couchbase and memcached buckets.

 * Maintenance Intervals: items flagged as expired will be removed by an automatic
   maintenance process that runs every 60 minutes.

When Couchbase Server performs lazy deletion, it flags an item as deleted when
the server receives a delete request; later when a client tries to retrieve the
item, Couchbase Server will return a message that the key does not exist and
actually delete the item. Items that are flagged as expired will be removed
every 60 minutes by default by an automatic maintenance process. To update the
interval for this maintenance, you would set `exp_pager_stime` :


```
./cbconfig localhost:11210 set flush exp_pager_stime 7200
```

This updates the maintenance program so that it runs every two hours on the
default bucket.

<a id="json-documents"></a>

## Writing JSON Documents to Couchbase

When you are dealing with larger and more complex JSON documents with Couchbase
Server, you can use a JSON library to handle and convert the JSON.

Note that some Couchbase SDKs provides JSON conversions as part of the method
call; with these SDKs you do not need to explicitly load a JSON conversion
library and do a conversion prior to reading and writing a JSON document. For
more information, please consult the Language Reference for your chosen SDK.

If you are currently using serialized objects with memcached or Membase, you can
continue using this in Couchbase Server 1.8+. JSON offers the advantage of
providing heterogeneous platform support, and will enable you to use new
features of Couchbase Server 2.0 such as view, querying and indexing.

The following illustrates a simple JSON document used to represent a beer. For
JSON, string-value pairs are the basic building blocks you use to represent
information:


```
{
    "abv": 10.0,
    "brewery": "Legacy Brewing Co.",
    "category": "North American Ale",
    "name": "Hoptimus Prime",
    "style": "Imperial or Double India Pale Ale",
    "updated": [2010, 7, 22, 20, 0, 20],
    "available": true
}
```

The unique identifier we provide within the JSON is 'beer\_Hoptimus\_Prime.'
Notice there are a variety of valid values that can be used within the JSON
document to represent your real-world item: floats, strings, arrays, and
booleans are used in this case to represent beer number, category, update time,
and availability. The JSON document is itself a hash delimited by curly
brackets, {}, with commas to separate each string-value pair. Collectively, all
string-value pairs in a block are called members.

To save a JSON document into Couchbase Server, you would provide the
JSON-encoded document as a parameter to your store method:


```
<?php
// create connection to Couchbase
// defaults to the “default” bucket

$cb = new Couchbase("localhost:8091");

// create very simple brew

$mybrew = array(“name” => “Good Beer”, “brewery” => "The Kitchen");

$cb->set("beer_My_Brew", json_encode($mybrew));
?>
```

In the example above we create an array `$mybrew` to represent our beer with two
attributes, the beer name and the brewery. We then store the beer as a valid
JSON document by using `json_encode()` and passing in the result as the value to
`set()`. When we store the JSON document, we specify the key 'beer\_My\_Brew.'

In the presidents example provided in the section on [Performing a Bulk
Set](http://www.couchbase.com/docs/couchbase-devguide-2.0/populating-cb.html),
we used one of the many JSON Libraries available that convert JSON documents in
to native objects. In this case we use
[Gson](http://code.google.com/p/google-gson/) an open source library which
converts JSON documents into Java:


```
Gson gson = new Gson();

President[] Presidents = gson.fromJson(new FileReader("Presidents.json"), President[].class);

for (President entry : Presidents) {
    String JSONentry = gson.toJson(entry);
    c.set(entry.presidency, 1200, JSONentry);
}
```

<a id="bucket-general-function"></a>

## About Data Buckets

Couchbase Server stores all of your application data in either RAM or on disk.
The data containers used in Couchbase Server are called buckets; there are two
bucket types in Couchbase, which reflect the two types of data storage that we
use in Couchbase Server. Buckets also serve as namespaces for documents and are
used to look up a document by key:

 * Couchbase Buckets: provide data persistence and data replication. Data stored in
   Couchbase Buckets is highly-available and reconfigurable without server
   downtime. They can survive node failures and restore data plus allow cluster
   reconfiguration while still fulfilling service requests. The main features are:

    * Supports items up to 20MB in size.

    * Persistence, including data sets that are larger than the allocated memory size
      for a bucket. You can configure persistence per bucket and Couchbase Server will
      persist data asynchronously from RAM to disk.

    * Fully supports replication and server rebalancing. You can configure one or more
      replica servers for a Couchbase bucket. If a node fails, a replica node can be
      promoted to be the host node.

    * Full range of statistics supported.

 * Memcached Buckets: provides in-memory document storage. Memcache buckets cache
   frequently-used data in memory, thereby reducing the number of queries a
   database server must perform in response to web application requests. Memcached
   buckets can work alongside relational database technology, not only NoSQL
   databases.

    * Item size limited to 1 MByte.

    * No persistence.

    * No replication; no rebalancing.

    * Statistics about Memcached Buckets are on RAM usage and client-side operations.



You can customize the properties of each bucket, within limits using Couchbase
Admin Console, Couchbase Command Line Interface (CLI), or the Couchbase REST
Admin API. Quotas for RAM and disk space can be configured per bucket so you can
manage usage across a cluster. For more detailed information about buckets, See
Section 11.6 of the Couchbase Manual.

Couchbase Server is best suited for fast-changing data items of relatively small
size. For in-memory storage, using Couchbase Memcached buckets, the memcached
standard 1 megabyte limit applies to each value. Items suitable for storage
include shopping carts, user profile, user sessions, time lines, game states,
pages, conversations and product catalog. Items that are less suitable include
large audio or video media files.

Couchbase buckets can store any binary bytes, and the encoding is dependent on
your chosen Couchbase SDK. Some SDKs offer convenience functions to
serialize/de-serialize objects from your favorite web application programming
language to a blob for storage. Please consult your client library API
documentation for details.

On that note, some Couchbase SDKs offer the additional feature of optionally
compressing/decompressing objects stored into Couchbase. The CPU-time versus
space trade-off here should be considered, in addition to how you might want to
version objects under changing encoding schemes. For example, you might consider
using the flags field in each item to denote the encoding kind or optional
compression. When starting your application development, a useful mantra to
follow is to keep things simple. For more information, please consult the
Language Reference for your chosen SDK.

<a id="brief-info-on-vBuckets"></a>

## About Sharding Data

If you are familiar with traditional relational databases, you are probably
familiar with the concept of database sharding and may wonder if the same
concept exists in Couchbase Server. There is a third internal, structure for
organizing data in the Couchbase Sever; these structures are called vBuckets, an
abbreviation for 'virtual buckets.' vBuckets are roughly functional equivalents
of database shards for traditional relational databases. Unlike manual sharding
which you may need to perform for relational database, the Couchbase SDKs
automatically request updates on the location of vBucket information from
Couchbase Server when you add nodes or perform failover.

vBuckets reference information across different records and distribute bucket
information across a Couchbase cluster thereby supporting scalability, replicas
and fail overs. Couchbase client SDKs abstract you from the level of vBuckets;
your information storage and retrieval operations will be communicated between
an SDK and memcached and Couchbase buckets.

In the background and at a lower level, Couchbase Server will automatically
create, manage and update vBuckets; similarly your Couchbase SDK will also
automatically request updates on vBucket information so that it can find
information and store in the right place. In short, there is very little to
worry about with vBuckets and most likely you will not be in direct contact with
them. As a developer, you only need to be aware that vBuckets exist and the role
they generally provide in the system.

<a id="cb-managing-buckets-info"></a>

## Creating and Managing Buckets

The Couchbase Server can be accessed via a REST API, the Couchbase
Administrative Console, or the Couchbase CLI. For most cases, this API is used
for management and administration of a Couchbase cluster, however as a developer
you should be aware that these tools available, and there are some standard
bucket operations you may find helpful. For more information about these three
tools, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

The following areas can be administered using the Couchbase REST API, the
Couchbase Administrative Console, or Couchbase CLI:

 * Managing individual Couchbase Server instances, or nodes,

 * Managing clusters of servers,

 * Managing data buckets, such as create new buckets, changing settings and so on,

 * Handling views,

 * Managing Cross datacenter replication (XDCR.)

<a id="data-partitioning-buckets"></a>

## Partitioning Data with Buckets

You can partition your data into separate buckets with Couchbase Server.
Couchbase will keep separate storage for different buckets, which enables you to
perform operations such as statistics. Separating buckets is also a structure
you may choose if you have a particular bucket that is reserved for data
removal.

As you build more complex applications, you may want to partition your
application across more than one data bucket with the following goals in mind:

 * Improve fault tolerance by increasing replication gained in using multiple
   buckets.

 * Provide a special reserve bucket which can be cleared without affecting all
   other application data, which is spread across other buckets.

 * Partition your application's key space among several buckets to avoid naming
   collisions.

<a id="developing-applications"></a>
