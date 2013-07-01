# Accessing Data with Couchbase SDKs

Couchbase Server communicates with a web application in two ways: 1) through
APIs in your chosen SDK which are supported by Couchbase Server, or 2) through a
RESTful interface which you can use to manage an entire cluster.

Couchbase SDKs enable you to perform read/write operations to Couchbase Server
and will be responsible for getting updates on cluster topology from Couchbase
Server. The SDK provide an abstraction level so that you do not need to be
concerned about handling the logic of cluster rebalance and failover in your
application. All SDKs are able to automatically get updated server and cluster
information so that your web application continues to function during a
Couchbase Server rebalance or failover.

Couchbase SDKs are written in several programming languages so that you can
interact with Couchbase Server using the same language you use for your web
application. The SDKs available from Couchbase are at: [Couchbase SDK
Downloads](http://www.couchbase.com/develop)

You use a Couchbase SDK for storage, retrieval, update, and removal of
application data from the database. As of Couchbase 2.0 you can also use the
SDKs to index and query information and also determine if entries are available
to index/query. Couchbase SDK read/write methods are all built upon the binary
version of the memcached protocol. When you perform an operation an SDK converts
it into a binary memcached command which is then sent to Couchbase Server. For
more information about memcached protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

Couchbase REST API can be used to get information about a cluster or make
changes to a entire cluster. At an underlying level, Couchbase SDKs use the REST
API to perform indexing and querying; for developers who want to write their own
SDK, the REST API can also be used to provide cluster updates to a SDK. There
are also some helpful bucket-level operations that you will use as an
application developer, such as creating a new data bucket, and setting
authentication for the bucket. With the REST API, you can also gather statistics
from a cluster, define and make changes to buckets, and add or remove new nodes
to the cluster. For more information about helpful bucket-level operations you
will can use as you develop an application in [Couchbase Server Manual 2.1.0,
REST API for
Administration](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-restapi.html).

<a id="couchbase-vs-sql"></a>

## Couchbase SDKs and SQL Commands

Couchbase SDKs support all of the four standard SQL commands used for reading
and writing data. These functions in Couchbase have different method names, but
they are the functional equivalents of the following SQL commands:

<a id="table-couchbase-vs-sql-comparison"></a>

**SQL Command**                  | **Couchbase SDK Method**                                                                                                                                                                                                                                                                                                                                              
---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`INSERT`, to create.             | `set` and  `add`                                                                                                                                                                                                                                                                                                                                                      
`SELECT`, to retrieve/read data. | `get`,  multiple-retrieves, and  get-and-touch (get and update expiration).                                                                                                                                                                                                                                                                                           
`UPDATE`, to modify data.        | `set` with a given key, or  `add` with a new key, or  `replace` with a key, or  `cas`, also known as Check-and-Set. Used to update a value by providing the matching CAS value for the document.  There are also methods for incrementing and decrementing numeric values, changing the expiration for a value, as well as pre-pending or appending to stored objects.
`DELETE`, to remove data.        | `delete`,  deletes information associated with a given key.                                                                                                                                                                                                                                                                                                           

<a id="cb-core-protocol"></a>

## Reading/Writing Data

In general, all Couchbase SDKs provide the same core set of methods to read,
write and update documents in the Couchbase Server's data stores. Common
features across all SDKs include:

 * All operations are atomic

 * All operations require a key

 * No implicit locking, such as a row lock, occur during an operation

 * Several update operations require a matching CAS value in order to succeed. You
   provide the CAS value as a parameter to a method and if the value matches the
   current CAS value stored with a document, it will be updated.

The following describes major data store operations you can perform in your web
application using the Couchbase Client. Language-specific variations in the
SDK's do exist; please consult your chosen SDK's Language Reference for details
specific to the SDK at [Develop with
Couchbase](http://www.couchbase.com/develop).

Note: If you use the text-based memcache protocol to communicate with Couchbase
Server, you will need to use moxi as a message proxy. For more information, see
[Moxi Manual 1.8](http://www.couchbase.com/docs/moxi-manual-1.8/index.html).

 * **Store Operations**

    * **Add:** Stores a given document if it does not yet exist in the data store.

    * **Set:** Stores a given document, overwriting an existing version if it exists.

 * **Retrieve Operations**

    * **Get:** Retrieve/Fetch a specified document.

    * **Get and touch:** Fetch a specified document and update the document
      expiration.

    * **Multi-retrieves:** Fetch multiple documents in a single server request.

 * **Update Operations**

    * **Touch:** Update the Time to Live (TTL) for a given document.

    * **Replace:** Replace a given document, if it exists, otherwise do not commit any
      data to the store.

    * **Check and Set (CAS):** Replace a current document with a given document if it
      matches a given CAS value.

    * **Append/Prepend:** Add data at the start, or at the end of a specified
      document.

 * **Delete:** Remove a specified document from the store.

 * **Flush:** Delete an entire data bucket, including cached and persisted data.

 * **'Observe':** Determine whether a stored document is persisted onto disk, and
   is therefore also available via indexing and querying.

<a id="about-ttl-values"></a>

## About Document Expiration

Time to Live, also known as TTL, is the time until a document expires in
Couchbase Server. By default, all documents will have a TTL of 0, which
indicates the document will be kept indefinitely. Typically when you add, set,
or replace information, you would establish a custom TTL by passing it as a
parameter to your method call. As part of normal maintenance operations,
Couchbase Server will periodically remove all items with expirations that have
passed.

Here is how to specify a TTL:

 * Values less than 30 days: if you want an item to live for less than 30 days, you
   can provide a TTL in seconds, or as Unix epoch time. The maximum number of
   seconds you can specify are the seconds in a month, namely 30 x 24 x 60 x 60.
   Couchbase Server will remove the item the given number of seconds after it
   stores the item.

   Be aware that even if you specify a TTL as a relative value such as seconds into
   the future, it is actually stored in Couchbase server as an absolute Unix
   timestamp. This means, for example, if you store an item with a two-day relative
   TTL, immediately make a backup, and then restore from that backup three days
   later, the expiration will have passed and the data is no longer there.

 * Values over 30 days: if you want an item to live for more than 30 day you must
   provide a TTL in Unix epoch time; for instance, 1 095 379 198 indicates the
   seconds since 1970.

Be aware that Couchbase Server does lazy expiration, that is, expired items are
flagged as deleted rather than being immediately erased. Couchbase Server has a
maintenance process, called *expiry pager* that will periodically look through
all information and erase expired items. This maintenance process will run every
60 minutes, but it can be configured to run at a different interval. Couchbase
Server will immediately remove an item flagged for deletion the next time the
item requested; the server will respond that the item does not exist to the
requesting process.

Couchbase Server offers new functionality you can use to index and find
documents and perform calculations on data, known as *views*. For views, you
write functions in JavaScript that specify what data should be included in an
index. When you want to retrieve information using views, it is called *querying
a view* and the information Couchbase Server returns is called a *result set*.

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
   Server. In this case, Couchbase Server takes pre-calculated values which are
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
to the Couchbase Manual command line tool, [Couchbase Server Manual 2.1.0
Specifying Disk Cleanup
Interval](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-cbepctl-disk-cleanup.html)
and refer to the examples on `exp_pager_stime`. For more information about views
and view query parameters, see [Finding Data with
Views](http://www.couchbase.com/docs/couchbase-devguide-2.1.0/indexing-querying-data.html).

<a id="about-asynchronous-operations"></a>

## About Asynchronous Methods

All Couchbase SDKs provide data operations as synchronous methods. In the case
of synchronous methods, your application will block and not continue executing
until it receives a response from Couchbase Server. In most SDKs, notably Java,
Ruby and PHP, there are data operations you can perform asynchronously; in this
case your application can continue performing other, background operations until
Couchbase Server responds. Asynchronous operations are particularly useful when
your application accesses persisted data, or when you are performing bulk data
stores and updates.

There are a few standard approaches in Couchbase SDKs for asynchronous
operations: 1) performing the asynchronous method, then later explicitly
retrieving any results returned by Couchbase server and are stored in runtime
memory, 2) performing an asynchronous method and retrieve the results from
memory in a callback, and/or 3) perform an event loop which waits for and
dispatches events in the program.

The following briefly demonstrates the first approach, where we perform an
asynchronous call and then later explicitly retrieve it from runtime memory with
a second call. The sample is from the PHP SDK:


```
<?php
$cb = new Couchbase();

$cb->set('int', 99);
$cb->set('array', array(11, 12));

$cb->getDelayed(array('int', 'array'), true);

//do something else

var_dump($cb->fetchAll());
?>
```

In the first two lines we create a new Couchbase client instance which is
connected to the default bucket. Then we set some sample variables named `int`
and `array`. We perform an asynchronous request to retrieve to retrieve the two
keys. Using the `fetchAll` call we can retrieve any results returned by
Couchbase server which are now in runtime memory.

This is only one example of the pattern of method calls used to perform an
asynchronous operation. A few more examples will follow in this section,
therefore we introduce the concept here. For more information, see [Synchronous
and Asynchronous
Transactions](couchbase-devguide-ready.html#synchronous-and-asynchronous)

<a id="cb-store-operations"></a>

## Storing Information

These operations are used for storing information into Couchbase Server and
consist of `add` and `set`. Both operations exist for all SDKs provided by
Couchbase. For some languages, parameters, return values, and data types may
differ. Unique behavior for these store methods that you should be aware of:

 * Expiration: By default all documents you store using `set` and `add` will not
   expire. Removal must be explicit, such as using `delete`. If you do set an
   expiration to the value 0, this will also indicate no expiration. For more
   information, see [About Document
   Expiration](couchbase-devguide-ready.html#about-ttl-values)

 * CAS ID/CAS Value: For every value that exists in Couchbase Server, the server
   will automatically add a unique Check and Set (CAS) value as a 64-bit integer
   with the item. You can use this value in your implementation to provide basic
   optimistic concurrency. For more information, see [Retrieving Items with CAS
   Values](couchbase-devguide-ready.html#cb-get-with-cas)

For existing keys, `set` will overwrite any existing value if a key already
exists; in contrast `add` will fail and return an error. If you use `replace` it
will fail if the key does not already exist.

The following storage limits exist for each type of information that you provide
as well as the metadata that Couchbase Server automatically adds to items:

 * Keys: Can be up to 250 Bytes. Couchbase Server keeps all keys in RAM and does
   not eject any keys to free up space.

 * Metadata: This is the information Couchbase Server automatically stores with
   your value, namely CAS value, expiration and flags. Metadata per document is 60
   Bytes for Couchbase 2.0.1 and 54 for Couchbase 2.1.0. This is stored in RAM at
   all times, and cannot be ejected from RAM.

 * Values: You can store values up to 1 MB in memcached buckets and up to 20 MB in
   Couchbase buckets. Values can be any arbitrary binary data or it can be a
   JSON-encoded document.

Be aware of key and metadata size if you are handling millions of documents or
more. Couchbase Server keeps all keys and metadata in RAM and does not remove
them to create more space in RAM. One hundred million keys which are 70 Bytes
each plus meta data at 54 Bytes each will require about 11.2 GB of RAM for a
cluster. This figure does not include caching any values or replica copies of
data, if you consider these factors, you would need over 23 GB. For more
information, see [Couchbase Manual, Sizing
Guidelines](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-bestpractice-sizing.html).

<a id="cb-set"></a>

### Set

`set` will write information to the data store regardless of whether the key for
the value already exists or not. The method is destructive; if the key exists,
it will overwrite any existing value. Typically you want to use `set` in cases
where you do not care whether or not you overwrite an existing value, nor do you
care if the key already exists or not. This method is similar to an `INSERT`
statement in SQL.

For instance, if you have a player location document in a game, you might not
care whether you overwrite the location with a new value; it is however
important that you quickly create a location document if it does not already
exist. In the case of this type of application logic, you might not want to
waste any code to check if a player location exists; performing rapid
read/writes of the player location and creating the initial score document may
be more important than performing any checks in your application logic. In this
case, using `set` would be suitable.

Another scenario is when you populate a database with initial values. This can
be a production or development database. In this case, you are creating all the
initial values for an entire set of keys. Since you are starting out with an
empty database, and have no risk of overwriting useful data, you would use `set`
here as well. For instance, if you are populating your new test database with
documents that represent different planets, you could follow this approach:


![](images/set_seeding.png)

Another scenario that is appropriate for using `set` is another scenario where
you do not care about overwriting the last value for a key. For instance if you
want to document the last visitor to your site, you would store that as a key
and update it each time a new visitor is at your site. You might not care who
the previous visitors are; in this case, you use `set` to overwrite anything
that exists and replace it with the latest visit information.

This method is the functional equivalent of a RDMS commit/insert. `Set` will
support the following parameters which are used during the operation:

 * Key: unique identifier for the information you want to store. This can be a
   string, symbol, or numeric sequence. A required parameter.

 * Value: the information you want to store. This can be in byte-stream, object,
   JSON document, or even string. A required parameter.

 * Options: this includes expiration, also known as TTL (time to live), which
   specifies how long the information remains in the data store before it is
   automatically flagged for removal and then deleted. You can also specify
   formatting options and flags.

The following shows a simple example of using set using the Ruby SDK:


```
c.set("foo", "bar", :ttl => 2)
```

This operation takes the key `foo` and sets the string 'bar' for the key which
will expire after 2 seconds. This next example is part of a data loader script
in PHP which reads in different JSON files in a specified directory. It then
sends requests to write each file to Couchbase Server:


```
function import($cb, $dir) {
    $d = dir($dir);
    while (false !== ($file = $d->read())) {
        if (substr($file, -5) != '.json') continue;
            echo "adding $file\n";
        $json = json_decode(file_get_contents($dir . $file), true);
        unset($json["_id"]);
        echo $cb->set(substr($file, 0, -5), json_encode($json));
        echo "\n";
    }
}
```

The first part of this function takes a Couchbase client instance as a parameter
and a directory. It then assigns the directory to a local variable `$d` and
opens it. The `while` loop will continue reading each file in the directory so
long as we have not finished reading all the files. In the loop we detect if the
file has the `.json` file type or not so we know to handle it, and store it. If
the file is json we decode it, remove the attribute `_id` and then set the key
as the filename with the other file contents as value. We choose this different
key for better identification in our system. The following illustrates a sample
JSON file which you can use with this loader:


```
{
  "_id":"beer_#40_Golden_Lager",
  "brewery":"Minocqua Brewing Company",
  "name":"#40 Golden Lager",
  "updated":"2010-07-22 20:00:20"
}
```

To view the complete loader application and sample data available on GitHub, see
[Couchbase Labs: Beer Sample](https://github.com/couchbaselabs/couchbase-beers)

In Couchbase SDKs you can store a value with `set` while simultaneously
providing a document expiration.

`Set` will return a boolean of true if it is able to successfully commit data to
the databases; it can also return a CAS value, which is a unique identifier for
the document, and is used for optimistic locking.

The associated memcached protocol in ASCII is `set` which stores a key. For more
information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html)

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being set. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-add"></a>

### Add

`add` will also write information to the Couchbase Server, but unlike `set`,
`add` will fail if the value for a given key already exists in Couchbase Server.

The reason you would want to use `add` instead of `set` is so that you can
create a new key, without accidentally overwriting an existing key with the same
name. For Couchbase Server, keys must be unique for every bucket; therefore when
you commit new keys to Couchbase Server, using `add` may be preferable based on
your application logic.

For example, if you create an application where you store all new users with a
unique username and you want to use usernames as a keys, you would want to store
the new key with `add` instead of `set`.


![](images/sdk_add_example.png)

If a user already exists in your system with the unique username, you would not
want to overwrite the user with a new user's information. Instead, you could
perform some real-time feedback and let the user know if the username has
already been taken when the new user fills out their profile information. You
can catch this type of error and report it back in your application when you use
`add` to create the document.

Because `add` fails and reports an error when a key exists, some Couchbase
Server developers prefer it to `set` in cases where they create a new document.


```
#stores successfully
c.add("foo", "bar")

#raises Couchbase::Error::KeyExists: failed to store value
#failed to store value (key="foo", error=0x0c)

c.add("foo", "baz")
```

This next example demonstrates an `add` in PHP:


```
$script_name=$_SERVER["SCRIPT_NAME"];
$script_access_count=$cb_obj->get($script_name);

if($cb_obj->getResultCode() == COUCHBASE_KEY_ENOENT){
    #the add will fail if it has already been added
   $cb_obj->add($script_name,0);
```

In this example we try to get a script name for the script that currently runs
on our web application server. We then try to retrieve any script name that is
already stored in Couchbase Server. If we receive a 'key not found' error, we
add the script name to Couchbase Server.

In Couchbase SDKs you can store a value with `add` while simultaneously
providing a document expiration.

The memcached protocol equivalent for this method is `add`. For more information
about the underlying protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html)

If you receive an unexpected 'key exists' error when you use `add` you should
log the error, and then go back into your code to determine why the key already
exists. You will want to go back into the application logic that creates these
keys and find out if there is a problem in the logic. One approach to use to
ensure you have unique keys for all your documents is to use a key generator
that creates unique keys for all documents.

There are application scenarios where you receive a 'key exists' error and you
want that error to occur so you can handle it in your application logic. For
instance, if you are handling a coupon, and if the coupon key already exists you
know the coupon code has already been redeemed. In that case you can use the
error to trigger a message to the user that the coupon has already been used.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being set. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-retrieve-operations"></a>

## Retrieving Information

These operations are used for retrieving information from Couchbase and exist
for all SDKs provided by Couchbase. They include `get`, performing a
multiple-retrieve, get-and-touch, and get-with-CAS. They enable you to retrieve
individual items of information, retrieve data as a collection of documents,
retrieve data while updating the expiration date for the data, and retrieving a
value and the CAS value for document.

<a id="cb-get-one-key"></a>

### Get

You can use this operation for a document you want to change, or for a document
you want to read, but not necessarily update or edit. In this first scenario
where you want to change a value, you would perform a `get` and assign the value
that Couchbase returns to a variable. After you change the value of the
variable, you would store the new value to Couchbase Server with one of the
store or update methods: `set`, `add`, `replace` or for optimistic concurrency,
`cas`. For instance, following our example of a spaceship game, the case of
spaceship fuel is a scenario where you will probably constantly change fuel
level with player interaction. In this case, you could perform a retrieve,
update and then store.

There are also cases where you could use `get` to retrieve a value, but only as
a read-only operation. An example of when you do want to read in the value but
not change the value is if you have a game with player profiles. Imagine you
have documents that represent different users and their attributes. The user
profile are part of the player experience, but game play does not change the
profile or their properties, such as contact information. In this case, we
perform `get` to retrieve and display a play profile.

A related scenario is when we use a `get` to determine if a key exists, and if
it does not exist, perform some action. For instance, if a player creates a user
profile, we could try to read in the player profile with `get`, and if it does
not exist, we can create the new profile including information such as the
player email address:


![](images/get_alt.png)

Developers who are starting with Couchbase Server will rely heavily on `get/set`
requests to do all of their read and write operations. The majority of the time,
`get/set` operations are the most useful Couchbase methods for your application.

Over time, developers discover other Couchbase methods, and the benefits to
using alternative read/write operations in their application logic. One
advantage is that applications in multi-user environments may inadvertently
overwrite the latest key you retrieve using only `get/set`, therefore in a
multi-user environment you might not be able to always rely on that value being
valid and current if you plan to perform operations on it after the `get`. In
this case, there are alternate methods, such as get-with-cas and `cas` that can
provide optimistic concurrency.

There is one problem you can encounter if you use `get` to make sure that a key
exists before they perform some operation. This can cause problems if the value
for a key is large and can result in slower application performance. An
alternate, more efficient way to test if a key exists, without retrieving the
whole key, is to use `touch`, which only updates the expiration, but does not
retrieve the whole value. Even this approach has a drawback; you can use `touch`
to determine the key exists, but you will be working on the assumption that the
item does not expire by the time you perform your next operation on it.

The other important assumption you are making when you use this approach is that
when you touch to test for existence of an item, you must overwrite the TTL at
the same time. If you know an item does not have an expiration, then you can use
the touch approach as a workaround. If your application depends on the item
expiration, you should not use the touch approach because this would overwrite
your expiration.

Finally, if you use `get` make sure you are aware of the value size, and how
many times you are repeatedly performing the operation. There may be alternate
convenience methods which can handle your task with a less resource-consuming
request.

The simplest case of retrieving information is by using `get` with a single key.
Here is an example in Ruby:


```
c.get("foo")
```

The following PHP example demonstrates use of `get` to retrieve a user password
from Couchbase Server and compare it to a password provided in a web form:


```
$submitted_passwordHash = sha1($password);
        $db_passwordHash = $cb_obj -> get($userid_key);

        if($db_passwordHash == false) {
            return (false);
        }
        //do we match the password?
        if($db_passwordHash == $submitted_passwordHash) {
            $_SESSION{"userid"} = $userid;
            return true;
        } else {
            return false;
        }
```

In this case we perform `$userid_key` and `$password` are based on parameters a
user provides in a web form. We perform a `get` with `$userid_key` to retrieve
the user password which is stored in Couchbase Server. If the password provided
in the form matches the password in Couchbase Server, we create a new user
session, otherwise we return false.

The memcached protocol which relate to this method are `get` and `getk`. These
first is the operation for retrieving an item; the later is for getting the
value and the key. For more information about memcached protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

If a key does not exist, you will receive a 'key not found' type error as a
response to `get`. If you expected the key to actually exist, you should check
your application logic to see why it does not exist. Any logic that creates that
type of key, or any logic that deletes it may inadvertently cause this result.
Another reason why you might get this error is that the item expired; in this
case Couchbase Server will respond to the request with a 'key not found' error.
So you will also want to check any explicit expiration set for that key.

In the case where you use a `get` to determine if key does not exist and then
store it, you can attempt a `set` or `add` to create the key.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

There are variations for parameters used in the `get` depending on the SDK. For
instance, some SDKs, such as the one for Java, support providing a transcoder
that will manipulate a value after it retrieves it (for instance, remove and
replace underscores with spaces.) Refer to an individual SDK's API documentation
for more information.

<a id="cb-get-multiple"></a>

### Retrieving Multiple Keys

In the case of our spaceship game example, we create space environment which
contains multiple planets and discussed how we could use `get` to retrieve
documents that represent the planets. In reality if we want to retrieve more
than one document, and do so efficiently, we would use one of the forms
bulk-retrieves. This enables us to send a single request from our SDK for all
the keys we want to retrieve.

Developers that are new to Couchbase Server tend to heavily rely on `get` to
retrieve values, even sets of values. However, using a form of multiple-retrieve
may be a better approach if you are doing multiple retrievals.

The major advantages of using a multiple-retrieve is that you can make a single
request to Couchbase Server from an SDK. The alternate you could choose is to
make multiple, sequential `get` requests and your application needs to wait for
the SDK to make each of these requests. This approach has the performance
disadvantage of creating a separate request that Couchbase Server must then
individually respond to. For instance if you want to retrieve 100 keys, you
could do this as a multiple-retrieve and all keys could be retrieved in 1
millisecond. If you chose to do 100 `get` calls, this would take the equivalent
of 100 milliseconds. In short, if you are retrieving multiple keys, performing a
multiple-retrieve will improve application performance compared to performing a
regular `get`.

Using a multiple-retrieve is particularly suited in cases where you have
'object-graphs' in your application. An object graph exists in your data model
when you have one primary, 'root' object and that object owns or links-to
several other objects. For instance, a farm can have several farm animals; or a
solar system can have several planets. In the case of a solar system, you could
have one JSON document represent the solar system, and that document references
the planets in the solar system. You could then use a form of multiple-retrieve
to construction the solar system in your application:


![](images/multi_get2.0.png)

There are other cases where you have multiple objects related to a process and
it would be better to use indexing and querying with views instead of a
multiple-retrieve. These are typically cases where you do not have a
relationship of ownership/possession by a root object. For instance in the case
of a game leader board, individual user documents do not necessarily relate to
the leader board object; only user documents with a high scores should be
retrieved and displayed for a leader board. In this type of scenario, it is a
better alternative to do indexing and querying with views in order to find the
top score holders. For more information, see [Finding Data with
Views](couchbase-devguide-ready.html#indexing-querying-data).

This example demonstrates how to retrieve multiple keys, using different method
overloads in Ruby:


```
keys = ["foo", "bar","baz"]

// alternate method signatures for multiple-retrieve

conn.get(keys)

conn.get(["foo", "bar", "baz"])

conn.get("foo", "bar", "baz")
```

In this case, we can overload the standard `get` method signature to include
several keys.

In the case of other languages, such as Java, there is a separate method, called
`getBulk` which will retrieve keys provided in a string collection:


```
Map<String,Object> keyvalues = client.getBulk(keylist);
```

There are some cases where you want to perform a multiple-retrieve but you know
the operation will take longer than a user will want to wait, or you want to
perform the operation in the background while the application performs other
tasks. In a spaceship game, for instance, you want to retrieve all the profiles
of users who have a high score to display in a leader board. But in the
meantime, you want players to be able to continue playing their game.

In this case, you can perform a multiple-retrieve asynchronously. When you do
so, multiple-retrieve will return before the SDK sends a request to Couchbase
Server. Your game application continues for the player and they can play their
game. In the background, Couchbase Server retrieves all the specified keys that
exist and sends these documents to the client SDK. Your application can later
retrieve the documents if they exist, or perform error-handling if the documents
do not exist. The following demonstrates an asynchronous multiple-retrieve in
PHP:


```
$cb->set('int', 99);
$cb->set('string', 'a simple string');
$cb->set('array', array(11, 12));

$cb->getDelayed(array('int', 'array'), true);
var_dump($cb->fetchAll());
```

In this case `getDelayed` returns immediately and we retrieve all the keys later
by performing `fetchAll`.

The multiple-retrieve methods in Couchbase SDKs are based on sending multiple
`getq` in the memcached protocol in a single binary packet. For more information
about the memcached protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-architecture-apis-memcached-protocol.html).

When you do a multiple-retrieve, be aware that the method will return values for
the keys that exist. If a key does not exist, Couchbase Server returns a 'key
not found' error which the SDK interprets. If a key is missing, SDK do not
provide a placeholder in the result set for the missing key. Therefore do not
assume that the order of results will be the same as the order of the keys you
provide. If your application depends on all keys existing and being retrieved,
you should provide application logic that iterates through the results and
checks to see the number results matches the number of keys. You might also want
to provide logic that sorts the results so they map to your sequence of keys.

If you expected a key to actually exist, but it does not appear in a result set,
you should check your application logic to see why it does not exist. Any logic
that creates that type of key, or any logic that deletes it may inadvertently
cause this result. Another reason why you might get this result is that the item
expired and Couchbase Server returns a 'key not found' error. So you will want
to check any explicit expiration set for that key.

One option to handle this result is to create the value if it does not already
exist. After you receive this result you can attempt a `set` or `add` to create
the key.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format values
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-get-and-touch"></a>

### Get and Touch

When you perform a `get` you may also want to update the expiration for that
document. This is called a 'get-and-touch' operation and can be completed in a
single request to Couchbase Server. This saves you the time from having to do a
get and then a separate operation to update the expiration. This method is
useful for scenarios where you have a document that should eventually expire,
but perhaps you want to keep that document around when it is still in use by the
application. Therefore when you retrieve the document, you also update the
expiration so it will be in Couchbase Server for a bit longer.

Going back to our spaceship game example, imagine that we have a special mode
that a player can achieve. For instance, if they hit a special target they have
temporary powers and can score more points for the next 30 seconds of play.

In this case, you could represent this temporary play mode as a document named
username\_power\_up\_mode for instance. The document could have attributes
related to this special play mode, such as double-points or triple-point
scoring. Since the special play mode will only last 30 seconds, when you get the
power\_up\_mode document you could also update the expiration so that it will
also only exist for the next 30 seconds. To do this, you would perform a
get-and-touch operation.


![](images/get_and_touch.png)

If you need to constantly retrieve a document and update it to keep it stored
longer, this method will also improve your application performance, when you
compare it to using separate `get` and `touch` calls. When you use the separate
calls, you effectively double the number of requests and responses between your
application and Couchbase Server, thereby increasing response and request times
and decreasing application performance. Therefore get-and-touch is preferable
for heavy retrieve operations where you also want to update document expiration.

The next example demonstrates a get-and-touch in Ruby:


```
val = c.get("foo", :ttl => 10)
```

The Couchbase SDK get-and-touch methods are based on the memcached protocol
command `get` with a specified expiration. For more information about the
protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

If a key does not exist, you will get a 'key does not exist' type error in
response. If you did not expect this result, you should check any application
logic that creates that type of key, or any logic that deletes it may
inadvertently cause this result. Another reason why you might get this result is
that the item expired and Couchbase Server returns a 'key not found.' So you
will want to check any explicit expiration set for that key.

One option to handle this result is to create the value and set the new
expiration; you can attempt this with `set` or `add`.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-get-with-cas"></a>

## Retrieving Items with CAS Values

These methods return a value and the associated CAS value for a given key. The
CAS value can be used later to perform a check and set operation. Getting the
CAS value for a given document while you are getting the document may be useful
if you want to update it, but want to do so while avoiding conflict with another
document change.

The most common scenario where you will use a get-with-cas operation is when you
want to retrieve a value and update that value using a `cas` operation. The
`cas` operation requires a key and the CAS value of the key, so you would
retrieve the CAS value using a get-with-cas operation.

Another scenario where get-with-cas is useful is when you want to test and see
if another process has updated a key, and then perform some check or special
operation if another process has updated the key. In this case, when you perform
a get-with-cas and it returns an unexpected CAS value, you can have your
application logic proceed along another path, than you would if get-with-cas
succeeds.

For instance, imagine you are creating a coupon redemption system, but you only
want the coupon to be valid for the first 50 users. In this case, you can store
a counter for the coupon and use get-with-cas to see if the CAS value has
changed; if it has, you know that the number of available coupons has changed
and you might want to offer a different coupon, you may need to check another
system to get new deals from that vendor, or check the actual coupon count
before you display the coupon. In this case we illustrate the principle that you
use a get-with-cas method to find out if the CAS value has changed, and then you
know you need to check another system:


![](images/get_w_cas.png)

All documents and values stored in Couchbase Server will create a CAS value
associated with it as metadata. Couchbase Server provides CAS values as
integers; developer and server administrators do not provide these values. There
are variations in the method naming and method signature; consult you respective
SDK Language Reference to determine the correct method call.

When you want to perform a check-and-set, you will need to do a get-with-cas
beforehand to get the current CAS value. You retrieve the CAS value for a given
key, and then you can provide it as a parameter to the check and set operation.

In the case of some SDKs, such as Ruby, getting a document with a CAS value is
an extension of the standard `get` call. In the example that follows, for
instance, we perform a get, and provide an optional parameter to the call in
order to retrieve the CAS value:


```
val = c.get("foo", :extended => true)
val.inspect #returns "foo"=>["1", 0, 8835713818674332672]
```

In this example, the value for the "foo" key is 1, flags are set to zero, and
the CAS value is 8835713818674332672.

The equivalent call in the memcached protocol is `get` which returns the value
for the key as well as the CAS value. For more information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-architecture-apis-memcached-protocol.html).

If a key does not exist, you will get a 'key does not exist' error in response.
If you did not expect this result, you should check any application logic that
creates that type of key, or any logic that deletes it may inadvertently cause
this result. Another reason why you might get this result is that the item
expired; in this case Couchbase Server returns a 'key not found' type error. So
you will want to check any explicit expiration set for that key.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="get-and-lock"></a>

## Locking Items

Get-and-lock methods enable you to retrieve a value for a given key and lock
that key; it thereby provides a form of pessimistic concurrency control in
Couchbase Server. While a key is locked, other clients are not able to update
the key, nor are they able to retrieve it.

When you perform a get-and-lock operation you provide an expiration for the lock
as a parameter. The maximum amount of time a key can be locked is 30 seconds;
any parameter you provide that is more than 30 seconds will be set to 30
seconds; negative numbers will be interpreted as 30 seconds also. When Couchbase
Server locks a key, it sets a flag on the key indicating it is locked, it
updates the CAS value for the key and returns the new CAS value. When you
perform a `cas` operation with the new CAS value, it will release the lock.

You would want to use this method any time you want to provide a high level of
assurance that a value you update is valid, or that a user can modify the value
without any conflict with other users.

Going back to the spaceship example, imagine we want spaceships to be able to
immediately put a repair item on hold when they arrive in the spaceship service
station. This way, a player with a broken spaceship can immediately be assured
that as long as they perform a `getl` and the repair part is in inventory, they
will get that part:


![](images/getl.png)

Other spaceships that arrive in open repair spots afterwards cannot take it
since the entire inventory is locked. In this case, it would make sense to
provide separate inventories for all the different parts so that only that type
of part is locked while a ship reserves a part. The spaceship that made the lock
can update the inventory and release the key by using a `cas` update.

The following are two examples of using a get-and-lock operation in the Ruby
SDK:


```
c.get("foo", :lock => true)

c.get("foo", "bar", :lock => 3)
```

In the first example, we use the standard method call of `get()` and include the
parameter `:lock => true` to indicate we want to lock the when we perform the
retrieve. This lock will remain on the key until we perform a `cas` operation on
it with the correct CAS value, or the lock will expire by default in 30 seconds.
In the second version of get-and-lock we explicit set the lock to a three second
expiration by providing the parameter `:lock => 3`. If we perform a `cas`
operation within the three seconds with the correct CAS value it will release
the key; alternately the lock will expire and Couchbase Server will unlock the
key in three seconds.


```
Object myObject = client.getAndLock("someKey", 10);
```

In this previous example we retrieve the value for 'someKey' and lock that key
for ten seconds. In the next example we perform a get-and-lock operation and try
to retrieve the value while it is still locked:


```
public static void main(String args[]) throws Exception {
      List<URI> uris = new LinkedList<URI>();
      uris.add(URI.create("http://localhost:8091/pools"));

      CouchbaseClient client = new CouchbaseClient(uris, "default", "");

      client.set("key", 0, "value").get();

      client.getAndLock("key", 2);


      System.out.println("Set locked key result: " + client.set("key", 0, "lockedvalue").get());
      System.out.println("Get locked key result: " + client.get("key"));

      Thread.sleep(3000);

      System.out.println("Set unlocked key result: " + client.set("key", 0, "newvalue").get());
      System.out.println("Get unlocked key result: " + client.get("key"));
      client.shutdown();
}
```

The first attempt to set the key to 'lockedvalue' will output an error since the
key is still locked. The attempt to output it will output the original value,
which is 'value.' After we have the thread sleep 30 seconds we are able to set
it to 'newvalue' since the lock has expired. When we then perform a get, it
outputs the updated value, 'newvalue.'

The other way to explicitly unlock a value using a Couchbase SDK is to perform a
`cas` operation on the key with a valid CAS value. After Couchbase Server
successfully updates the document, it will also unlock the key.

The equivalent call in the memcached protocol is `get` which returns the value
for the key and will set a timed lock if you provide it as a parameter. For more
information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-update-operations"></a>

## Updating Information

These operations are for replacing, updating, deleting or modifying a stored
numerical value through increment or decrement. This include check and set (CAS)
operations, which enable you to perform optimistic concurrency in your
application. All update operations exist for all SDKs provided by Couchbase. For
some languages, parameters, return values, and data types may differ.

<a id="cb-touch"></a>

### Touch

With the `touch` method you can update the expiration time on a given key. This
can be useful for situations where you want to prevent an item from expiring
without resetting the associated value. For example, for a session database you
might want to keep the session alive in the database each time the user accesses
a web page without explicitly updating the session value, keeping the user's
session active and available.

The other context when you might want to use touch is if you want to test if a
key actually exists. As we mentioned earlier for our discussion of `get`,
developers will typically rely on `get` to determine if a key exists. The
unintended problem this can cause is if the value for a key is several megabytes
instead of mere bytes. If you constantly use `get` only to test if a key exists,
you nonetheless retrieve the entire value; this can cause a performance loss if
the value is large, and especially if you perform the `get` over thousands or
millions of documents.

Using `touch` as an alternative way to test if a key exists may be a preferable.
Since `touch` only updates the expiration and does not retrieve the item value,
the request payload and response are both small. The most important drawback to
be aware of is that when you use touch to determine if a key exists, you assume
that the key does not have an expiration time that is used in other parts of
your application. If the expiration time for a key is important, when you use
`touch` it will overwrite that expiration and will impact application behavior.
If you are certain the key expiration is not important, than using `touch` in
this context is safe.

The other drawback of using this approach is that if you perform a `touch` to
determine if a key exists, you are working on the assumption that it will not
expire by the time you perform your next operation on that key. If you only want
to test for the existence of a key, and you do not want to update the
expiration, you can provide the existing expiration, or set it to 0, which
indicates no expiration. The following illustrations demonstrate how you can use
the result from `touch` to decide whether you store a key, or store an alternate
key:


![](images/touch1.png)


![](images/touch2.png)

The following shows and example of using `touch` in the Ruby SDK:


```
# updates the expiration time to 10 seconds for 'foo' document

c.touch("foo", :ttl => 10)
```

As we discussed earlier in this chapter, the SDKs provide a convenience method
you can use to retrieve a document and update the expiration. With these so
called get-and-touch operations you do not need to perform a separate setting
operation to update expiration when you are retrieving the document. This will
also provide better performance compared to doing a separate `get` and `touch`
requests. If you use separate calls to `get` and `touch` you will create two
requests to Couchbase Server and two responses from the server per document; in
contrast you create only one request and response when you use a get-and-touch
method.

The equivalent call in the memcached protocol is `touch` which updates the item
expiration. For more information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

As we mention previously, you can perform a `touch` to explicitly test whether a
key exists or not, and then create a key; you can try this with `set` or `add`.
If a key is missing, Couchbase Server will return a 'key not found' type error
which you can check. Be aware that when you use this approach, you are assuming
the key will *not* expire before you perform your next operation on it.

If the key is missing and you did not expect this result, you should check any
application logic that creates that type of key, or any logic that deletes it
may inadvertently cause this result. Another reason why you might get this
result is that the item expired and Couchbase Server deleted it as part of the
regular maintenance. So you will want to check any logic that sets an explicit
expiration set for that key.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being retrieved. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-replace"></a>

### Replace

This method will update the value for a key, if the key already exists. If the
key does not exist, it will fail and return an error. `Replace` is useful in
cases where you do care whether or not a key exists, for instance, your
application logic will perform one action if a key exists, but perform another
action if the key does not exist. This method is roughly analogous to a `UPDATE`
command in SQL.

For instance, going back to a game application example, imagine you want to show
new users a special offerings page with a variety of new games. In this case you
could have a document in Couchbase Server which stores last login times for
users. When a new user initially logs in, your application tries to replace the
last login document with the current time, but it receive an error that the key
does not exist. Your application would then know that the key does not exist
because this is the first user login and could then show the special offer page.


![](images/replace1.png)


![](images/replace2.png)

Some Couchbase Server developers prefer to exclusively use `replace` anytime
they update documents. With this approach you will know whether the key exists
or not prior to updating it; using `replace` will return error information if
the key is missing which you can handle in your application logic.

In Couchbase SDKs you can update the value with `replace` while simultaneously
updating the document expiration.

Here is a simple example of `replace` in Ruby:


```
c.replace("foo", "bar")
```

This will replace the value for the key `foo` with the new string 'bar'; if the
key does not exist, it will return a 'key not found' error. The following
example demonstrates use of `replace` in PHP:


```
$script_access_count=$cb_obj->get($script_name);
$cb_obj->replace("DATE::" . $script_name,date("F j, Y, g:i:s a "));
```

In this example we use the `replace` to update the latest access date and time
for a server script. We update the date and time using a standard PHP date
format.

The equivalent call in the memcached protocol is `replace` ; for more
information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

If a key does not exist, you will receive 'key not found' type error. If you
receive this error and you expected it to exist, you should check your
application logic to see why it does not exist. Any logic that creates that type
of key, or any logic that deletes it may inadvertently cause that error. Another
reason why you might get this error is that the item expired; once a key is
expired Couchbase Server will return a 'key not found' error in response to a
`replace` request. So you will want to check any explicit expiration set for
that key.

One option to handle this error is to create the value if it does not already
exist. After you receive an error that the value could not be replaced, you can
attempt an `add` to create the key.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being set. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-cas"></a>

### Check and Set (CAS)

This operation is also known as a check-and-set method; it enables you to update
information only if a unique identifier matches the identifier for the document
you want to change. This identifier, called a CAS value or ID, prevents an
application from updating values in the database that may have changed since the
application originally obtained the value.

A check-and-set operation will only allow the user with the latest CAS value to
update a key. This assures you that if you get a key, and someone has changed it
in the meantime, you can not change the value. Essentially the first process
that accessed the document with the most current CAS value will be able to
update it. When this update occurs, Couchbase Server also updates the CAS value.
All other requests at this point will be sending the old, invalid CAS values.

Providing optimistic concurrency is optional in your application. All documents
you create in Couchbase Server automatically have a CAS value stored as part of
metadata for the document. To use it for optimistic concurrency, you include
get-with-cas and check-and-set operations in your application logic as well as
provide CAS values as parameters to these methods.

CAS values are in the form of 64-bit integers and they are updated every time a
value is modified; if an application attempts to set or update a key/value pair
and the CAS provided does not match, Couchbase Server will return an error.

For instance, imagine we want to have a repair station for our spaceship game.
Players who suffer damage to their ships must go there occasionally or they
cannot travel or defend themselves. However, we do not want the repair station
to have an unlimited supply of spaceship replacement parts on inventory. In this
example, we have a document to represent the types of spaceship parts the repair
station carries, and the amounts it has in inventory.

By requiring CAS values in this scenario, we only update the inventory and
provide it to a ship if we have the most current CAS value for the inventory
document. If another ship has come and taken the part in the meantime, it will
change the CAS value for inventory, we fail to get the part with our current CAS
value and receive an error.

Typically we would perform a get-with-cas call in order to retrieve the current
inventory of repair parts and the CAS value for the inventory. If the part we
need is in inventory, we would use the CAS value to update our inventory
document to show one less part.


![](images/cas1.png)

By using the CAS value we will ensure that our spaceship either gets the part
given our current CAS value, or needs to check inventory again because another
ship has already taken one of the parts. In this scenario performing
get-with-cas and then a `cas` call to update the inventory will ensure that our
reduction of inventory occurs in an orderly fashion, and that spaceships can
only remove inventory when they have the right to do so by providing the correct
CAS value.


![](images/cas2.png)

Should you choose to enforce CAS values for a certain type of key or set of
application data, you should retrieve the keys and store the CAS value returned
by get-with-cas. Anytime you want to update one of these keys, you should do so
as a `cas` operation.

To be able to perform a `cas` update you not only need the key for a document,
you will also need the CAS value in order to successfully update it. In this
case you could also store the CAS value returned when the value was originally
created and then perform a `cas` operation. In most cases however, you would
find it easiest to use get-with-cas to retrieve the CAS for a given key, and
then perform your check-and-set. In.Net, the method that retrieves a value and
CAS value for a given key is called `GetWithCas`.

The following is an example of a cas operation using pseudo-code:


```
attempts_left = 10;

loop {
    cas, val = Get("aKey");

    new_value = updateValue(val);

    result = ReplaceWithCAS("aKey", new_value, cas);

    if (result == success) {
        break; # YAY, success
  }

    if (result.error == EXISTS_WITH_DIFFERENT_CAS) {
        --attempts_left;
        if (attempts_left == 0) {
            throw("Failed to update item 'aKey' too many times, giving up!")
        }
        continue;
  }

    throw("Unexpected error when updating item 'aKey': ", result.error);

}
```

The first part of our loop retrieves the CAS value and value and then changes
the value. We then try to update the value in Couchbase Server as a cas
operation. If the result object sent back by Couchbase Server is success we
break, if it is a 'key exists' error, we make additional attempts to update the
value until `attempts_left` is 0. At this point we throw and exception and exit
the loop.

If you perform a CAS operation and the CAS value has been changed by another
process, you will get 'key exists' error. How you handle this error depends on
the value you are trying to update. You can try again to get the key and when
you get the value, actually compare the part you want to change with the value
you expected. It is possible that another process made an update, but it did not
update the part of the value you are interested in changing. In this case the
other process will release the key with a `cas` operation. You can then perform
another `get` to retrieve the new CAS value and content, then examine the
content. Here is the general sequence you could follow:

 * Perform a get-with-cas to retrieve the CAS value for a key,

 * Try a `cas` with the CAS value. If you fail,

 * Perform a get-with-cas again to get the new CAS value, and compare the part of
   the value with the content you expected,

 * If the part of the value is still intact, try to perform `cas` again with your
   updated content and the new CAS value.

When you try this approach, you might want to limit the number of times you
re-attempt a get-with-cas and the number of times you will try to check and
update the content.

The equivalent call in the memcached protocol is `set` with a CAS value
provided. For more information, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

The only other types of errors you can typically experience with `cas` are
issues with the new value you provide, such as formatting. The other error is
that a key that is truly missing, which you should have discovered when you
first performed a get-with-cas to retrieve the CAS value.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being stored. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-append-prepend"></a>

### Appending and Pre-pending

With `append` and `prepend` methods, you can add information to the start or end
of a binary data that already exists in the data store. Both of these methods,
along with the incrementing and decrementing methods, are considered 'binary'
methods since they operate on binary data such as string or integers, not JSON
documents. These methods can add raw serialized data to existing data for a key.
The Couchbase Server treats an existing value as a binary stream and
concatenates the new content to either beginning or end.

Both `append` and `prepend` are atomic operations; this means that multiple
threads can be appending or pre-pending the same key without accidentally
overwriting changes from another `append/prepend` request. Note however that the
order in which Couchbase Server appends or prepends data is not guaranteed for
concurrent `append/prepend` requests.

**Unhandled:** `[:unknown-tag :sidebar]` Both `append` and `prepend` originated
from the request that Couchbase Server supports 'lists' or sets. Developers
wanted to maintain documents representing the latest 100 RSS feeds, or the
latest 100 tweets about a certain topic, or hash-tag. At this point, you can use
it to maintain lists, but be aware that the content needs to be a binary form,
such as strings or numeric information.

In the chapter on more advanced development topics, we provide an example on
managing a data set using `append` ; we provide the sample as a Python script.
Please refer to [Using the Fastest
Methods](couchbase-devguide-ready.html#optimizing-method-calls). You can also
view the entire blog post about the topic from Dustin Sallings at the Couchbase
blog, [Maintaining a Set](http://blog.couchbase.com/maintaining-set-memcached).

For purposes of this introduction to pre-pending and appending with Couchbase
SDKs, we offer these illustrations to show how the two methods work. Imagine we
are running an intergalactic empire, and we decide to knight/dame numerous
users. We have also improved our document-keeping system and we want to enable
users to have suffixes:


![](images/append_prepend.png)


![](images/append_prepend2.png)

Notice that we provide the appropriate spacing and since the two methods are
separate Couchbase Server requests, Couchbase Server updates the CAS value two
times. Be aware that in some SDKs you may provide `prepend` and `append` with a
CAS value as a parameter in order to perform the operation; however no SDK
requires it.

The next example demonstrates use of `append` in Ruby. Note in this case,
providing a CAS value is optional. If provided however, it will raise an error
if the given CAS value does not match the CAS value of the stored document:


```
#simple append operation and get

c.set("foo", "aaa")
c.append("foo", "bbb")
c.get("foo")           #=> "aaabbb"

#append using CAS option

ver = c.set("foo", "aaa")
c.append("foo", "bbb", :cas => ver)

#simple prepend

c.set("foo", "aaa")
c.prepend("foo", "bbb")
c.get("foo")           #=> "bbbaaa"
```

The following examples demonstrates `append` and `prepend` in Java. In this case
the get-with-cas operation in Java is `gets` :


```
/* get cas value for sample key and then append string */

CASValue<Object> casv = client.gets("samplekey");
client.append(casv.getCas(),"samplekey", "appendedstring");

/* handling possible errors using return value of append */

OperationFuture<Boolean> appendOp =
            client.append(casv.getCas(),"notsamplekey", "appendedstring");

try {
    if (appendOp.get().booleanValue()) {
        System.out.printf("Append succeeded\n");
    } else {
        System.out.printf("Append failed\n");
  }
} catch (Exception e) {
          ...
}

/* prepend a string to an existing value */

CASValue<Object> casv = client.gets("samplekey");

client.prepend(casv.getCas(),"samplekey", "prependedstring");
```

The most significant error developers can make with `prepend` and `append` is
that they repeatedly use the method and create a value that is too large for
Couchbase Server. When `append` and `prepend` add content to a document, they do
not remove the equivalent amount of content, such as removing the oldest item
from a list when new list content is added.

Therefore you can quickly reach the limit of data allowed for a document if you
do not keep track of it as you prepend or append. The limit for values is 20MB
so if you repeatedly use these two methods, you may receive an error from the
server as well as inconsistent results. When you start getting these errors you
need to go back to your application logic, determine how often you are actually
triggering an `append` and `prepend` for the document. The three possible
approaches, which can be used simultaneously are:

 * Change Methods Used: Instead of using `append/prepend` use a `set` or `add` and
   additional programming logic to add the new content, but also remove old
   content. This will maintain a more constant document size and reduce oversized
   documents.

 * Reduce Use: Reduce the number times you are appending and pre-pending, or reduce
   the amount of information you add to the document.

 * Split Documents: To avoid documents that are too large, logically separate the
   documents. For instance, instead of one document for set of tweets on Etsy
   products, break it up into several documents on different types of Etsy
   products, or tweets occuring during different time periods.

 * Compaction: In this case we explicitly remove data from a document if it makes
   sense to remove the data. This helps us avoid documents that are too large. For
   more information and an example implementation, view the entire blog post about
   the topic from Dustin Sallings at the Couchbase blog, [Maintaining a
   Set](http://blog.couchbase.com/maintaining-set-memcached).

Be aware that for Couchbase SDKs, if you try to `append` or `prepend` a
different data-type to an existing key, an SDK may perform no data cast, but
rather overwrite the entire value with the new value. For instance this Ruby
example shows an overwrite and cast:


```
c.set('karen', 'karen')  #returns cas value for 'karen'

c.get('karen').class     #returns String

c.prepend('karen', 2)    #returns new cas value

c.get('karen').class     #Fixnum
```

The equivalent memcached protocol calls are `append` and `prepend`. These are
the methods for appending and prepending; for more information see, [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

If you encounter a data type or generally data you did not expect, refer back to
the methods that create your keys, as well as prepend or append them. Confirm
that you provide the data as a consistent data-type.

If a key is missing, you will get a 'key does not exist' error in response. If
you did not expect this result, you should check any application logic that
creates that type of key, or any logic that deletes it may inadvertently cause
this result. Another reason why you might get this result is that the item
expired and Couchbase Server returns a 'key not found' type error. So you will
want to check any logic that sets an explicit expiration set for that key.

The other error that can occur when you are prepending or appending is if you
provide a bad value, such as a newline, or invalid character. Check the value
you want to use with either of these methods so that it is valid.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being stored. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-incr-decr"></a>

### Incrementing and Decrementing

These methods can increment or decrement a value for a given key, if that value
can be interpreted as an integer value. Couchbase Server requires that the value
be an ASCII number to be incremented or decremented

Both of these methods are atomic; this means that multiple threads can be
incrementing/decrementing a key without conflicting with other threads that are
also incrementing/decrementing the value. Note however that if concurrent
threads make a request to increment or decrement a value, there is no guarantee
on which thread will change a value first.

The operations are provided as convenience methods for scenarios where you want
to have some sort of counter; they eliminate the need for you to explicitly get,
update and then reset an integer document through separate database operations.

The primary use for these the `incr` method is to increment a counter, typically
to represent the number of page visits. Generally they can be used for any
scenario where you have a frequently updated counter. For instance, if you have
a coupon with a limited number of redemptions, you could store the redemptions
as a separate key, and decrement the redemptions each time someone uses the
coupon.

There are several other uses for `incr` that enable you to create unique keys be
incrementing a value. Here are some suggested uses:

 * Provide an index for individual items such as comments, users, products, and
   other lists of items that grow considerably.

 * Generate keys based on an atomic counter, and use that key as a reference to
   other documents in Couchbase.

For instance, you can use `incr` to create a unique user id for a system. First
you would need a document that represents the counter. In Ruby we could do this:


```
c = Couchbase.new        # => setup default connection
c.set("user::count", 0)
```

Then you would increment the counter each time you store a new user to the
system and store the new counter value as part of the unique key for the new
user:


```
# increment the counter-id and assign to user id

new_id = c.incr("user::count")

# store the counter-id as a self-reference

user_hash = {
    :uid => new_id,
    :username => "donp",
    :firstname => "Don",
    :lastname => "Pinto"
}

# create the document with the counter-id and hash

c.add("user::#{new_id}", user_hash)
```

The entire process would be as follows, if you imagine we want to create a
unique user id for a spaceship game. In this case we increment the user count,
and then apply it to the new key for the user:


![](images/incr_decr.png)

Both `incr` and `decr` are considered 'binary' methods in that they operate on
binary data, not JSON documents. Because of this, keys used by `incr` and `decr`
cannot be queried or indexed with Couchbase Server.

Couchbase Server stores and transmits numbers as **unsigned numbers**, therefore
if you try to store negative number and then increment, it will cause overflow.
In this case, an integer overflow value will be returned. See the integer
overflow example that follows. In the case of decrement, if you attempt to
decrement zero or a negative number, you will always get a result of zero.

The next example demonstrates use of `incr` to identify documents with unique
ids and retrieve them with the id:


```
# initialize the counter

c = Couchbase.new        # => setup default connection

c.set("user::count", 0)        # => initialize counter
```

First we create a new Couchbase client instance and create a new document which
represents the counter. then we increment the counter each time we create a new
user in Couchbase Server:


```
# retrieve the latest (so you see incr adds one...)
c.get("user::count")                # => 3

# increment the counter-id
new_id = c.incr("user::count")            # => new_id = 4

# store the counter-id as a reference to the new user
user_hash = {
               :uid => new_id,
               :username => "jsmith",
               :firstname => "John",
               :lastname => "Smith"
            }

# create the document with the counter-id as key and hash as value
c.add("user::#{new_id}", user_hash)        # => save new user, with document key = "user::4"
```

We first start by retrieving the current counter, to find out the most recently
used number for current users. Then we increment the counter by one and store
this new count to `new_id` which we will use as part of the new key. Finally we
`add` the new user document.

If we want to retrieve the newest user to the system, we can use the latest
counter document and use that in the key we retrieve:


```
# retrieve the latest

latest_user = c.get("user::count")        # => latest_user = 4

# retrieve the document with the index

user_info = c.get("user::#{latest_user}")    # => retrieve user document

# outputs { "uid" => 4, "username" => "jsmith", "firstname" => "John", "lastname" => "Smith" }

puts user_info
```

The memcached protocol equivalents for this method are `incr` and `decr` which
are the commands for incrementing and decrementing. For more information about
the underlying protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

Couchbase Server returns no specific operation-level error objects when you
perform this operation. If a key does not exist, `incr` and `decr` at the
SDK-level will create the new key and initialize it with the value you provide,
or set the default of 0. As demonstrated above, if you try to increment a
negative number, Couchbase Server will return an integer overflow number. If you
try to decrement so the result is a negative number, Couchbase server will
return 0.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to use a key being
stored. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="cb-delete-operations"></a>

## Deleting Information

This operation erases an individual document from the data store for a given
key. In some SDKs you can specifically check a document's CAS value, a unique
identifier, and if the number provided as a `delete` parameter does not match
the deletion will fail and return an error. If Couchbase Server successfully
deletes a document, it returns a status code indicating success or failure.

**Unhandled:** `[:unknown-tag :sidebar]` It is important to note that in some
SDK's such as in Ruby, a `delete` can be performed in synchronous or
asynchronous mode; in contrast other SDK's such as Java support `delete` as an
asynchronous operation only. Consult your respective language reference to find
out more about your chosen SDK. For more information about asynchronous calls in
Couchbase SDKs, see [Synchronous and Asynchronous
Transactions](couchbase-devguide-ready.html#synchronous-and-asynchronous)

The following example demonstrates a `delete` in Ruby. In this case, parameters
can be provided to check the unique identifier for a value, so that if there is
mismatch, the `delete` fails:


```
# returns the cas/unique identifier on set and assigns to ver

ver = c.set("foo", "bar")

# cas mismatch, raises Couchbase::Error::KeyExists

c.delete("foo", :cas => 123456)

#returns true

c.delete("foo", :cas => ver)
```

When you delete a document for some SDKs you can provide CAS value for the
document in order for `delete` to succeed. As in other update methods, you can
obtain the CAS value by performing a get-with-CAS operation and then pass the
CAS value as a parameter:


```
#returns value, flags and cas

val, flags, cas = client.get("rec1", :extended => true)

#removes document as cas operation

client.delete("rec1", :cas => cas)
```

The memcached protocol equivalents for this method is `delete`. For more
information about the underlying protocol, see [memcached
protocol](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-architecture-apis-memcached-protocol.html).

<a id="cb-destroy-operations"></a>

## Permanently Destroying Data

Should you choose to destroy cached and persisted data, the `flush_all`
operation is available at the SDK level.

This operation is disabled by default as of the 1.8.1 Couchbase Server and
above. This is to prevent accidental, detrimental data loss. Use of this
operation should be done only with extreme caution, and most likely only for
test databases as it will delete, item by item, every persisted document as well
as destroy all cached data.

Third-party client testing tools may perform a `flush_all` operation as part of
their test scripts. Be aware of the scripts run by your testing tools and avoid
triggering these test cases/operations unless you are certain they are being
performed on your sample/test database.

Inadvertent use of `flush_all` on production databases, or other data stores you
intend to use will result in permanent loss of data. Moreover the operation as
applied to a large data store will take many hours to remove persisted
documents.

This next example demonstrates how to perform a synchronous and asynchronous
`flush` in Ruby:


```
#synchronous flush

c.flush    #=> true

#asynchronous flush

c.run do
    c.flush do |ret|
        ret.operation   #=> :flush
        ret.success?    #=> true
    ret.node        #=> "localhost:11211"
    end
end
```

In the case of asynchronous operations we use the event loop in Ruby. Within the
loop we try to perform a `flush`.

When you perform a `flush` you provide the URI for one node in the cluster as a
parameter and it will operate against all nodes in a cluster.

<a id="monitoring-data"></a>

## Monitoring Data (Using Observe)

With Couchbase you can use *observe-functions* in the SDKs to determine the
status of a document in Couchbase Server. This provides a level of assurance in
your application that data will be available in spite of node failure.

For instance, you may want to create a ticketing application and you want to
place a hold on tickets while you perform a credit card authorization to pay for
the ticket. If a node fails during that time, you may not be able to recover the
current state of the ticket, and determine whether it was on hold for a user, or
not. If the ticket is in RAM only, you may not be able to retrieve the ticket at
all. By using an observe command, you can determine whether the ticket is
persisted or whether it has been replicated. You can then determine if you
retrieve the ticket state you can get the most current version that is on disk.

This section describes when you would want to use observe-functions and how to
implement it in your application.

<a id="couchbase-sdk-when-to-observe"></a>

## Why Observe Items?

One of the challenges working with items that can be in-memory or on-disk is
that you may want to keep track of the state of your document in the system. For
instance, in your application you may also want to know if a document has been
stored to disk or not. You may also want to specify how many copies of a
document are stored on replicas. Both of these enhancements enable you to
recover important documents and provide consistent information in your
application despite server failure.

With Couchbase Server, you can use Couchbase SDK observe-functions to do the
following in your application logic:

 * Determine whether a document has been persisted,

 * Determine whether a document has been replicated.

One of the new features of Couchbase Server is support for indexing and querying
of data. We provide this functionality as *views*. Views enable you to find
specific information in Couchbase Server, extract information, sort information,
and also perform a wide variety of calculations across a group of entries in the
database. For instance if you want to generate an alphabetical list of users in
your system you would use views to do so.

Couchbase Server can index and query information from a document when that
document is actually persisted to disk. Therefore you may want to use an
observe-function to determine if the document is persisted and therefore
available for use in views. To do so, you would make an observe request, and
after you know Couchbase Server persists the item, you can retrieve the relevant
view.

The other scenario you may want to handle in your application is where you want
to make sure a document has been replicated. As of Couchbase Server 2.0, you can
automatically configure replication of data from one cluster to another cluster
and from one data bucket to another bucket. Collectively, this new functionality
is known as cross datacenter replication, or XDCR. For more information, see
[Couchbase Sever 2.1.0 Manual, Cross Datacenter
Replication](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-tasks-xdcr.html).

The final scenario where you would want to use an observe-function is for
documents that should be durable in nature. For instance, imagine you have a
shopping cart in your application and you want to maintain the state of the
shopping cart in the application while a user continues searching for other
items. When a user returns to a shopping cart the latest items they have
selected should still be there for purchase. You also want the state of the
shopping cart to not only be current but also to survive a node failure if
possible.

In this type of scenario, you can use the observe command so that you know the
state of the shopping cart data in Couchbase Server. By knowing the state of the
shopping cart document in the server, you can provide the correct application
logic to handle the document state. If you know you are unable to recover the
shopping cart data, you might want to provide an error message to the user and
ask them to reselect items for the cart; if you are able to recover a persisted
or replica document, you can provide another message and the provide the most
current recovered shopping cart items.

The following illustrates two different scenarios using an observe-function. The
first illustration is how you might handle a scenario where a node fails and the
observe-function indicates the cart is not yet on disk or in replica:


![](images/observe1.png)

In this case where node fails and the data is not yet persisted or replicated on
another node, it will disappear from RAM and is not recoverable. When you
observe this type of scenario, an observe-function will indicate the data is not
replicated or persisted and therefore it cannot be recreated into RAM and
retrieved from RAM. So your application logic would need to compensate for that
lack of data by showing for instance, an empty cart, or a cart error message
letting the user know they need to add items once again. In the next
illustration we show the scenario where a node fails but we successfully
determine that the cart is persisted or on a replica node:


![](images/observe2.png)

In this second scenario we have a backup of the shopping cart on disk or on a
replica node; we can retrieve the shopping cart data once it is brought back
into RAM by Couchbase Server. After a node fails an observe-function will
indicate when the item returns back into RAM and then we can retrieve it to
rebuild the user shopping cart.

When you observe a key, this will survive node rebalance and topology changes.
In other words if your application observes a key, and the key moves to another
node due to rebalance or cluster changes, a Couchbase SDK will be able to
continue monitoring the status of the key in the new location.

There are important points to understand about data replication and data
persistence. When Couchbase Server creates replica data, it adds this data in
the RAM of another Couchbase node. This supports very rapid reads/writes for the
data once the data has been replicated. When Couchbase Server persists data, the
data must wait in a queue before it is persisted to disk. Even if there are only
a few documents ahead of document, it will take longer to be stored on disk from
the queue than it would be to create a replica on another node. Therefore if
rapid access to data is your priority, but you want to provide high availability
of the data, you may prefer to use replication.

<a id="couchbase-sdk-implement-observes"></a>

## Observing Documents

Couchbase SDK observe-functions indicate whether a document is on disk or on a
replica node. Documents in Couchbase Server can be in RAM only, can be persisted
to disk, or can also be on a replica node as a copy. When data is persisted onto
disk or is on a replica node, when the node that contains that data fails, you
can still recover the data.

Once the node fails, the document can be recovered from disk back into RAM and
then retrieved by your application. If the document is available on a replica
node that is still functioning, you can request the document and it will be
retrieved from the replica node. You use observe-functions to determine whether
important application data has been persisted or replicated so that you have
some assurance you can recreate the document or not if a Couchbase node is down.

There are two approaches for providing 'observe'/monitoring functionality in
Couchbase SDKs:

 * Provide ability to monitor the state of a document and determine if it is
   persisted or on replica node.

 * Provide ability to explicitly persist or replicate documents to a certain number
   of disks or replica nodes.

The first example we demonstrate in the Ruby SDK takes the first approach where
you can monitor a given key. The Couchbase Ruby SDK will return a `Result`
object with the status of a given key:


```
stats = conn.observe("foo")
```

In this case, we perform the `observe` with a Couchbase cluster containing one
replica node. The results we receive will be as follows:


```
<Couchbase::Result:0x0000000182d588 error=0x0 key="foo" status=:persisted cas=4640963567427715072 from_master=true time_to_persist=0 time_to_replicate=0>
```

This `Results` object provides the status for the key `foo` : the symbol
`:persisted` tells us that it has been persisted to disk, and the
`from_master=true` result indicates that the document has been replicated. The
Couchbase Ruby SDK also supports the second approach where we can specify our
preferences for replica and persistence when we store a document:


```
conn.set("foo", "bar", :observe => {:persisted => 2, :timeout => 5})
```

For store and update operations, we can provide a parameter to specify that a
document be persisted or replicated a certain number of times. In this example
above we indicate that the key `foo` be persisted onto disk on two nodes. The
`:timeout` is specific to this operation and indicates the operation should
timeout after 5 seconds of waiting for the two document writes onto disk.

One common approach for using an observe-function is to verify that a document
is on at least one replica node. If you want to be extremely certain about the
durability of some documents, you may want to verify that the document is
replicated to at lease three nodes and persisted to at least four servers. This
represents the maximum number of replicas and on-disk copies that Couchbase
Server currently supports.

For asynchronous observe requests, a Couchbase SDK determines that an observe
request is complete by polling the Couchbase Server. A Couchbase SDK will
determine which observe requests have completed all the events that are being
observed for a key, namely replication and persistence.

The types of errors that can occur during this operation include 1) inability to
connect to a node, or 2) some error exists while attempting to format a value
being used. If you have a connection-level error you may need to reattempt
connection, and possibly check the status of the server. If you have an error
with the size of your value or formatting, you need to check the value itself,
and how it is encoded and see if there are any issues that make the document
incompatible with Couchbase Server.

For more information about connections and connection-level settings, see
[Optimizing Client
Instances](couchbase-devguide-ready.html#optimizing-client-instances) and
[Client-Side Timeouts](couchbase-devguide-ready.html#about-client-timeouts)

<a id="indexing-querying-data"></a>
