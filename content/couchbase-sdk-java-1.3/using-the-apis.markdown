# Using the APIs

The Client libraries provides an interface to both Couchbase and Memcached
clients using a consistent interface. The interface between your Java
application and your Couchbase or Memcached servers is provided through the
instantiation of a single object class, `CouchbaseClient`.

Creating a new object based on this class opens the connection to each
configured server and handles all the communication with the servers when
setting, retrieving and updating values. A number of different methods are
available for creating the object specifying the connection address and methods.

<a id="couchbase-sdk-java-started-connection-bucket"></a>

## Connecting to a Couchbase Bucket

You can connect to specific Couchbase buckets (in place of using the default
bucket or a hostname:port combination configured on the Couchbase cluster) by
using the Couchbase `URI` for one or more Couchbase nodes and specifying the
bucket name and password (if required) when creating the new `CouchbaseClient`
object.

For example, to connect to the local host and the `default` bucket:


```java
List<URI> uris = new LinkedList<URI>();
uris.add(URI.create("http://127.0.0.1:8091/pools"));

try {
  client = new CouchbaseClient(uris, "default", "");
} catch (Exception e) {
  System.err.println("Error connecting to Couchbase: " + e.getMessage());
  System.exit(0);
}
```

The format of this constructor is:


```
CouchbaseClient(URIs,BUCKETNAME,BUCKETPASSWORD)
```

Where:

 * `URIS` is a `List` of URIs to the Couchbase nodes. The format of the URI is the
   hostname, port and path `/pools`.

 * `BUCKETNAME` is the name of the bucket on the cluster that you want to use.
   Specified as a `String`.

 * `BUCKETPASSWORD` is the password for this bucket. Specified as a `String`.

The returned `CouchbaseClient` object can be used as with any other
`CouchbaseClient` object.

<a id="couchbase-sdk-java-started-connection-sasl"></a>

## Connecting using Hostname and Port with SASL

If you want to use SASL to provide secure connectivity to your Couchbase server,
create a `CouchbaseConnectionFactory` that defines the SASL
connection type, user bucket, and password.

The connection to Couchbase uses the underlying protocol for SASL. This is
similar to the earlier example except that it uses the
`CouchbaseConnectionFactory` class.


```java
List<URI> baseURIs = new ArrayList<URI>();
baseURIs.add(base);

CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs, "userbucket", "password");
client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

<a id="couchbase-sdk-ccfb"></a>

## Setting runtime Parameters for the CouchbaseConnectionFactoryBuilder

A final approach to creating the connection is using the
`CouchbaseConnectionFactoryBuilder` and `CouchbaseConnectionFactory` classes.

It's possible to override some of the default parameters that are defined in
`CouchbaseConnectionFactoryBuilder` for a variety of reasons and customize the
connection for the session depending on expected load on the server and
potential network traffic.

For example, in the following program snippet, we instantiate a new
`CouchbaseConnectionFactoryBuilder` and use the `setOpTimeout` method to change
the default value to 10000 ms (10 seconds).

We subsequently use the `buildCouchbaseConnection` specifying the bucket name,
password and an username (which is not being used any more) to get a
`CouchbaseConnectionFactory` object. We then create a `CouchbaseClient` object.

```java
List<URI> baseURIs = new ArrayList<URI>();
baseURIs.add(base);
CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();

// Ovveride default values on CouchbaseConnectionFactoryBuilder

// For example - wait up to 10 seconds for an operation to succeed
cfb.setOpTimeout(10000);

CouchbaseConnectionFactory cf = cfb.buildCouchbaseConnection(baseURIs, "default", "", "");

client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

For example, the following code snippet sets the `OpTimeOut` value to 10000 ms before creating the connection as we saw in the code above.


```java
cfb.setOpTimeout(10000);
```

These parameters can be set at run time by setting a property on the command line
(such as *-DopTimeout=1000* ) or via properties in a file *cbclient.properties*
in that order of precedence.

The following table summarizes the parameters that you can set. The table provides
the parameter name, a brief description, the default value, and why the
particular parameter might need to be modified.

Parameter | Description | Default | When to Override the default value                                                                                                                                                                                                                         
----------------------------|--------------------------------------------------------------------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`opTimeout` | Time in milliseconds for an operation to time out                                                    | 2500 ms  | You can set this value higher when there is heavy network traffic and timeouts happen frequently.                                                                                                                                                          
`timeoutExceptionThreshold` | Number of operations to time out before the node is deemed down | 998 | You can set this value lower to deem a node is down earlier.                                                                                                                                                                                               
`readBufSize` | Read buffer size | 16384 | You can set this value higher or lower to optimize the reads.                                                                                                                                                                                              
`opQueueMaxBlockTime`       | The maximum time to block waiting for op queue operations to complete, in milliseconds.          | 10000 ms | The default has been set with the expectation that most requests are interactive and waiting for more than a few seconds is thus more undesirable than failing the request. However, this value could be lowered for operations not to block for this time.
`shouldOptimize`            | Optimize behavior for the network                                                                | False            | You can set this value to be true if the performance should be optimized for the network as in cases where there are some known issues with the network that may be causing adverse effects on applications.                                               
`maxReconnectDelay`         | Maximum number of milliseconds to wait between reconnect attempts.                               | 30000 ms | You can set this value lower when there is intermittent and frequent connection failures.                                                                                                                                                                  
`MinReconnectInterval`      | Default minimum reconnect interval in milliseconds                                               | 1100             | This means that if a reconnect is needed, it won't try to reconnect more frequently than the default value. The internal connections take up to 500 ms per request. You can set this value higher to try reconnecting less frequently.                             
`obsPollInterval`           | Wait for the specified interval before the observe operation polls the nodes.                    | 400              | Set this higher or lower depending on whether the polling needs to happen less or more frequently depending on the tolerance limits for the observe operation as compared to other operations.                                                             
`obsPollMax`                | The maximum number of times to poll the master and replicas to meet the desired durability requirements. | 10               | You could set this value higher if the observe operations do not complete after the normal polling.                                                                                                                                                        

<a id="couchbase-sdk-java-started-disconnection"></a>

## Shutting down the Connection

The preferred method for closing a connection is to cleanly shut down the active
connection with a timeout using the `shutdown()` method with an optional timeout
period and unit specification. The following example shuts down the active connection
to all the configured servers after 60 seconds:


```java
client.shutdown(60, TimeUnit.SECONDS);
```

The unit specification relies on the `TimeUnit` object enumerator, which
supports the following values:

Constant                | Description              
------------------------|--------------------------
`TimeUnit.NANOSECONDS`  | Nanoseconds 
`TimeUnit.MICROSECONDS` | Microseconds 
`TimeUnit.MILLISECONDS` | Milliseconds
`TimeUnit.SECONDS`      | Seconds        

The method returns a Boolean value that indicates whether the shutdown request
completed successfully.

You also can shut down an active connection immediately by using the `shutdown()`
method to your Couchbase object instance. For example:


```java
client.shutdown();
```

In this form the `shutdown()` method returns no value.

<a id="api-reference-summary"></a>

## Querying Views

This section provides reference material about querying and working with views and design documents from the perspective of the Java client. If you want to get started quickly, check out the tutorial first. Also, the server documentation provides good information about how views work in general and their characteristics. 

### Introduction
Let's first discuss how the client interacts with the server in terms of views. While not mandatory, it is always good to get a general idea about how the underlying codebase works. Because a view result potentially contains many rows, the client cannot pinpoint a single node to ask for the result (which is different than key-based operations). So instead of asking a single node for a specific document, the client asks one node in the cluster for the complete result. The server node temporarily acts as the broker for the view query and aggregates the results from all nodes in the cluster. It then returns the combined result to the client. All communication is done over HTTP port 8092. You need to make sure this port is reachable (in addition to [other ports](http://docs.couchbase.com/couchbase-manual-2.2/#network-ports)).

In the current implementation, the SDK uses the Apache **httpcore** library to perform the actual HTTP requests (and collect responses). This is done over Java NIO, which is very efficient compared to traditional, blocking IO. By default, two threads are created for view handling when you instantiate a new `CouchbaseClient` object. The first one is for the IO Reactor, which is basically the orchestrator, and then a worker thread  that does the actual work of listening on the NIO selectors is launched. These settings can be tuned, but the defaults are suitable to get started.

While views are performant, they can never be as fast as single-key lookups. Therefore, they need to be used with care on the "hot code path" where performance is key to your application. We'll see later how to get the most performance out of your views, but as always there are tradeoffs that need to be considered.

### Configuration
On the `CouchbaseConnectionFactoryBuilder`, you can tune the following configuration options, which modify the run time behavior of views:

 - `setViewTimeout()`&mdash;default: 75 seconds (Cluster side default timeout is 60 seconds.)
 - `setViewWorkerSize()`&mdash;default: 1 thread
 - `setViewConnsPerNode()`&mdash;default: 10 connections.

Here is a example that shows how they could be changed:

```java
CouchbaseClient client = new CouchbaseClient(
new CouchbaseConnectionFactoryBuilder()
.setViewTimeout(30) // set the timeout to 30 seconds
.setViewWorkerSize(5) // use 5 worker threads instead of one
.setViewConnsPerNode(20) // allow 20 parallel http connections per node in the cluster
.buildCouchbaseConnection(nodes, bucket, password)
);
```

 **View timeout**. The view timeout is the default timeout used when the blocking methods are used (like `client.query(...)`). If the asynchronous methods are used, a custom timeout can be provided for greater flexibility. In general, you should not set a low timeout (like 2.5 seconds as with key-based operations), because views tend to take longer to return. Also, plan some padding for network spike latencies or if more traffic arrives than planned. This is also why a very conservative timeout of 75 seconds is used (and on the server side, the timeout is 60 seconds).

 **View worker size**. Depending on the number of nodes in the cluster and the amount of view requests made, the worker size can be tuned to accommodate special needs. As a rule of thumb, if you do not expect more than 1 KB of view requests per second, one worker should be fine. If you want to push the limits, steadily increase the worker size and see if throughput increases (always potentially with higher latency as the trade-off).

**View connections per node**. This setting describes the maximum number of open HTTP connections in parallel on a per-node basis. For example, if you have 5 servers in your cluster and you keep the default maximum of 10 connections, the SDK will not open more than a total of 50 connections to the cluster. If you need more performance tuning this value might or might not help (if the server is busy serving requests, adding more connections won't always help). The client only opens new connections if the other ones are still busy processing. If the maximum number of connections is open, the requests are  queued up and dispatched (or time out).

The operation timeout for key-based operations, which is set to 2.5 seconds by default, is somewhat related because if you use the `setIncludeDocs(true)` query parameter, the SDK fetches documents in the background for you before returning you the `ViewResult`. While key-based operations are much more performant, timeouts can still occur. This is especially something to watch out for if you have a large amount of your data set on disk.

You can also configure the `viewmode` system property. By default, all view requests are made against design documents that haven been published. If you forget to click `Publish` in the user interface, the SDK still complains that the view does not exist. If you explicitly want to use development views, you can change this by setting the `viewmode` system property to `development` (default is `production`) before the `CouchbaseClient` object is constructed. This enables you to change from a development version of the view to a production version without needing to rebuild the application.

### Querying
Querying the view consists of several steps. To query the view, you load the view definition, define a `Query` object ,and then query the actual index on the server. You can then iterate over the returned data set.

The following exempts use the `beer-sample` bucket that ships with the server. Make sure to load and connect to it if you want to follow along with the queries.

#### Loading the View Definition
The first thing to do is load the view definition from the server. This is needed because the client needs to know if a reduce function is defined, what kind of view it is and so on. To load the definition, you need both the name of the design document and of the view itself. The following example looks for the `brewery_beers` view inside the `beer` design document (remember to publish it first!).

```java
CouchbaseClient client = new CouchbaseClient(...);
View view = client.getView("beer", "brewery_beers");
```

While not particularly interesting in general, the `View` object itself provides methods that help during debugging. You can use the `getURI()` method to make sure the query URL is correct and `hasReduce()` to see if a reduce function is defined and will be used by default (if not switched off through the `Query` object). The `CouchbaseClient` accesses the same properties later to route the query properly.

#### Preparing Query parameters
The next step is to instantiate a `Query` object and (optionally) apply parameters that influence the run time behavior of the query itself. The methods you see on the `Query` object, by intention, mirror those in the UI when you click the triangle next to Filter Results. Some of the parameters take enums as arguments to make it easier for you. Here is an example that shows how to set some parameters:

```java
Query query = new Query();
query.setLimit(10);
query.setIncludeDocs(true);
query.setStale(Stale.UPDATE_AFTER);
```

##### ComplexKeys
The setters have docblocks to explain their meaning, but there is one thing you should be aware of. Because those arguments get transformed into HTTP query parameters, certain transformations need to be done, the most important one being escaping of values. Because escaping tends to get complex pretty quickly, especially if you might be dealing with brackets (for arrays) and quotes, a `ComplexKey` utility class is available. It removes the escaping burden from you and helps with inferring the correct wire format for the given object. All of the methods that take a `ComplexKey` also take a raw `String`, so you can always provide your own arguments if needed.

Let's say we only want to get two keys out of our view index. Couchbase Server needs a format like `["key1","key2"]`, but we also need to encode it properly. Let's try the raw way first:

```java
Query query = new Query();
query.setKeys("[\"foo\",\"bar\"]");
```

This would be rendered on the wire as `keys=%5B%22foo%22%2C%22bar%22%5D`. To achieve the same result more easily, you can rewrite the same query using the `ComplexKey` class:

```java
Query query = new Query();
query.setKeys(ComplexKey.of("foo", "bar"));
```

This doesn't only work for strings, but also for numbers and so on. By default, if you pass only one element to the `ComplexKey` object it does not assume you need it wrapped in an array. If you do, call the `forceArray` method to enforce this behavior. 

You can easily verify the output by calling `toString` on the Query class, which outputs the on the wire representation of the query.

##### Including Documents
As you have already been warned in the Couchbase Server documentation, you should never put the full document in the emit body. A map function like this is not recommended and bloats your index unecessarily (because you are essentially storing the document both on disk and in the index):

```javascript
// Don't do this!
function (doc, meta) {
  emit(meta.id, doc);
}
```

Most of the time though, you need the document content that refers to a specific key (here, the document ID). The good news is that the SDK takes care of that for you. All map functions (not reduced) contain the document id implicitly, so if you set `setIncludeDocs(true)` on the Query object, the SDK will do a `get` fetch underneath to load the full document for you on the fly. So instead of the problematic snippet shown previously, here is the proper way:

```javascript
function (doc, meta) {
  emit(meta.id, null);
}
```

```java
Query query = new Query();
query.setIncludeDocs(true);
```

The next section shows how to get a handle on the document body.
#### Querying the Index
Now that we have prepared both the view information and the actual query, it's time to perform the actual query. 

The `CouchbaseClient` provides a `query` method that is used for this task. It returns a `ViewResponse` that you can inspect and iterate over. Each iteration gives a `ViewRow` that represents a row emitted in the index and contains all the data needed.

The `beer-sample` data set contains a view that emits both breweries and their beers. To list the first 15 entries and print their document IDs in this view, you can write the following code:

```java
View view = client.getView("beer", "brewery_beers");

Query query = new Query();
query.setLimit(15);

ViewResponse response = client.query(view, query);
for (ViewRow row : response) {
    System.out.println(row.getId());
}
```

Here's the output from the previous example:

```
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
21st_amendment_brewery_cafe-bitter_american
21st_amendment_brewery_cafe-double_trouble_ipa
21st_amendment_brewery_cafe-general_pippo_s_porter
21st_amendment_brewery_cafe-north_star_red
21st_amendment_brewery_cafe-oyster_point_oyster_stout
21st_amendment_brewery_cafe-potrero_esb
21st_amendment_brewery_cafe-south_park_blonde
21st_amendment_brewery_cafe-watermelon_wheat
3_fonteinen_brouwerij_ambachtelijke_geuzestekerij
3_fonteinen_brouwerij_ambachtelijke_geuzestekerij-drie_fonteinen_kriek
3_fonteinen_brouwerij_ambachtelijke_geuzestekerij-oude_geuze
```

The keys are sorted by UTF-8 collation. For more information about the collation scheme, see <http://blog.couchbase.com/understanding-letter-ordering-view-queries>.

The following example uses a range to list only the 21st Amendment Brewery Cafe and all its beers: 

```java
Query query = new Query();
String brewery = "21st_amendment_brewery_cafe";
String endToken = "\\u02ad";

query.setRange(
  ComplexKey.of(brewery).forceArray(true), // from (start)
  ComplexKey.of(brewery + endToken).forceArray(true) // to (end)
);
```

The code in the example instructs the view engine to return a range of keys, beginning with the key specified in the `brewery` string for the 21s Amendment Brewery Cafe and ending with a nonexistent key. If an ending key is not specified, queries return the rows for the specified starting key and all rows following the starting key. The character stored in `endToken` is the last UTF-8 character, so you can think of it as the end to search for. The code creates a nonexistent ending key by concatenating `endToken` to the end of the starting key.

Running this query returns only the 21st Amendment Brewery Cafe and all its beers:

```
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
21st_amendment_brewery_cafe-bitter_american
21st_amendment_brewery_cafe-double_trouble_ipa
21st_amendment_brewery_cafe-general_pippo_s_porter
21st_amendment_brewery_cafe-north_star_red
21st_amendment_brewery_cafe-oyster_point_oyster_stout
21st_amendment_brewery_cafe-potrero_esb
21st_amendment_brewery_cafe-south_park_blonde
21st_amendment_brewery_cafe-watermelon_wheat
```

#### Working with the returned data
So far the examples have only printed the ID of the document, which you can also use to load the full document content :

```java
ViewResponse response = client.query(view, query);
for (ViewRow row : response) {
    if (row.getId() != null) {
        String documentBody = (String) client.get(row.getId());
    }
}
```

The `Query` class has shorthand that instructs the SDK to load the document and provide it through the `getDocument()` method:

```java
Query query = new Query();
query.setLimit(2);
query.setIncludeDocs(true);

ViewResponse response = client.query(view, query);
for (ViewRow row : response) {
    System.out.println(row.getDocument());
}
```

This prints out the content of the first two documents in the index:

```json
{
    "address": [
        "563 Second Street"
    ],
    "city": "San Francisco",
    "code": "94107",
    "country": "United States",
    "description": "The 21st Amendment Brewery offers a variety of award winning house made brews and American grilled cuisine in a comfortable loft like setting. Join us before and after Giants baseball games in our outdoor beer garden. A great location for functions and parties in our semi-private Brewers Loft. See you soon at the 21A!",
    "geo": {
        "accuracy": "ROOFTOP",
        "lat": 37.7825,
        "lon": -122.393
    },
    "name": "21st Amendment Brewery Cafe",
    "phone": "1-415-369-0900",
    "state": "California",
    "type": "brewery",
    "updated": "2010-10-24 13:54:07",
    "website": "http://www.21st-amendment.com/"
}

{
    "abv": 7.2,
    "brewery_id": "21st_amendment_brewery_cafe",
    "category": "North American Ale",
    "description": "Deep golden color. Citrus and piney hop aromas. Assertive malt backbone supporting the overwhelming bitterness. Dry hopped in the fermenter with four types of hops giving an explosive hop aroma. Many refer to this IPA as Nectar of the Gods. Judge for yourself. Now Available in Cans!",
    "ibu": 0.0,
    "name": "21A IPA",
    "srm": 0.0,
    "style": "American-Style India Pale Ale",
    "type": "beer",
    "upc": 0,
    "updated": "2010-07-22 20:00:20"
}
```

It is important to not confuse the `getId()` and `getKey()` methods. The `getId()` method always refers to the unique ID of a document. You can use it to locate the document through the `client.get()` method. The `getKey()` method refers to a string representation of the actual key in the index. The `getValue()` method refers to the value of the `emit` call.

The following example prints out more information about the last query:

```java
for (ViewRow row : response) {
    System.out.println("Document ID: " + row.getId());
    System.out.println("Indey Key: " + row.getKey());
    System.out.println("Index Value: " + row.getValue());
    System.out.println("---");
}
```

```
Document ID: 21st_amendment_brewery_cafe
Indey Key: ["21st_amendment_brewery_cafe"]
Index Value: null
---
Document ID: 21st_amendment_brewery_cafe-21a_ipa
Indey Key: ["21st_amendment_brewery_cafe","21st_amendment_brewery_cafe-21a_ipa"]
Index Value: null
---
```

You can see that while the ID refers to the document ID (and won't change, even if the index changes), both the key and value reflect the view definition.

#### Pagination
If you want to go through larger amounts of index data, it might make sense to load them in chunks (speak "pages"). Pagination is commonly found in web applications where a table is displayed and the user can click a button to get the next batch of data and so on. A naive approach might be implemented with `setLimit()` and `setSkip()`, keeping the limit at a fixed size (the page size) and increment skip by the numbers of pages you want to skip forward.

While this sounds pretty easy at first, it turns out that if the skip part gets very large, the performance degrades a lot. This has to do with how the indexer goes through the stored information. It can't just skip directly to the skip marker you requested, but has to go through all N skipped documents to find the starting point. One can imagine that this is quite inefficient, so a second strategy can be used that requires more work on the client side, but is much faster.

Using a combination of `startKey` and `startKeyDocID`, you can hint the correct document ID to the indexer and because of the index structure stored it can jump directly to the desired document. This is also known as stateful pagination because the client needs to keep track of the next document to start with. So you need to keep in mind to fetch N+1 documents and use the last one as a starter for the next query. For reduced views, only skip and limit can be used because there is no distinct document ID to start from next.

Thankfully, you don't need to do this on your own. The SDK provides a `Paginator` class that provides Java `Iterable` pages:

```java
View view = client.getView("beer", "brewery_beers");
Query query = new Query();
query.setLimit(10);

int docsPerPage = 4;
Paginator pages = client.paginatedQuery(view, query, docsPerPage);
while (pages.hasNext()) {
    System.out.println ("--Page:");
    ViewResponse response = pages.next();
    for (ViewRow row : response) {
        System.out.println(row.getId());
    }
}
```

The example sets a maximum limit of 10 documents and requests four documents per batch (page size). The output looks like this:

```
--Page:
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
--Page:
21st_amendment_brewery_cafe-bitter_american
21st_amendment_brewery_cafe-double_trouble_ipa
21st_amendment_brewery_cafe-general_pippo_s_porter
21st_amendment_brewery_cafe-north_star_red
--Page:
21st_amendment_brewery_cafe-oyster_point_oyster_stout
21st_amendment_brewery_cafe-potrero_esb
```

This technique can also be used if lots of data in a view needs to be analyzed. It will be done in smaller chunks which is easier for the underlying JVM, cluster connection, and so on.  

#### Asynchronous Querying
The `CouchbaseClient` API provides asynchronous methods where possible, and view execution is no exception. All methods seen previously (especially `getView` and `query`) can be executed asynchronously. You can either use the `Future` directly, or attach a `Listener` to it and let the executor handle calling the callback. Here is a fully asynchronous execution of a view query. We are using a `CountDownLatch` to make the current thread wait until the execution is completed. If you use a completely reactive environment such as [Akka](http://akka.io/) or [Play](http://www.playframework.com/), this is not needed.

```java
final CountDownLatch latch = new CountDownLatch(1);

final Query query = new Query();
query.setLimit(10);

client.asyncGetView("beer", "brewery_beers").addListener(new HttpCompletionListener() {
    @Override
    public void onComplete(HttpFuture<?> viewFuture) throws Exception {
        if (viewFuture.getStatus().isSuccess()) {
            View view = (View) viewFuture.get();

            client.asyncQuery(view, query).addListener(new HttpCompletionListener() {
                @Override
                public void onComplete(HttpFuture<?> queryFuture) throws Exception {
                    if (queryFuture.getStatus().isSuccess()) {
                        ViewResponse response = (ViewResponse) queryFuture.get();
                        for (ViewRow row : response) {
                            System.out.println(row.getId());
                        }
                    }
                    latch.countDown(); // signal we are done
                }
            });
        }
    }
});

latch.await(); // wait for the latch to be counted down in the callback
```

You can also grab the `HttpFuture` directly from the `async*` methods and block on them as needed (or sending them over to your own thread pool for execution). Another reason why you want to use the `HttpFuture` is that you can change the default timeout for every query. If you only want to wait 50 seconds until a timeout arises, you can do it like this:

```java
View view = client.asyncGetView("beer", "brewery_beers").get(50, TimeUnit.SECONDS);
```

### Design Documents
Design documents are usually created through the UI. While this is convenient, sometimes you need things more automated. For example, in integration tests you might want to create a design document with one or more views automatically before each run.

The Java SDK provides some methods that help you with that:

 - `getDesignDoc`: load a design document with its view definitions
 - `createDesignDoc`: create a design document containing view definitions
 - `deleteDesignDoc`: delete a design document

This example shows how to use the `getDesignDoc` method:

```java
// Load the Design Document
DesignDocument beer = client.getDesignDoc("beer");

// Print the name and map function of all its views
for (ViewDesign view : beer.getViews()) {
    System.out.println("Name: " + view.getName());
    System.out.println("Map: " + view.getMap());
}
```

The `DesignDocument` object is your starting point and provides information about itself, but also about the views contained. You can iterate over all stored views and print their names, map and reduce functions. Executing the example code on the `beer-sample` bucket gives you the following:

```
Name: brewery_beers
Map: function(doc, meta) {
  switch(doc.type) {
  case "brewery":
    emit([meta.id]);
    break;
  case "beer":
    if (doc.brewery_id) {
      emit([doc.brewery_id, meta.id]);
    }
    break;
  }
}

Name: by_location
Map: function (doc, meta) {
  if (doc.country, doc.state, doc.city) {
    emit([doc.country, doc.state, doc.city], 1);
  } else if (doc.country, doc.state) {
    emit([doc.country, doc.state], 1);
  } else if (doc.country) {
    emit([doc.country], 1);
  }
}
```

The same way you load a `DesignDocument`, you can create your own and save it. Note that there is no translation between Java and JavaScript going on, the best idea is to write the view in the UI and then copy it to a file or directly in the source code, depending on your needs. Make sure special characters are properly escaped (your IDE should help you with that).

Here is an example that creates a new design document, one view with a map and reduce function and saves it. You could then query it as normal.

```java
DesignDocument designDoc = new DesignDocument("beers");
designDoc.setView(new ViewDesign("by_name", "function (doc, meta) {" +
        "  if (doc.type == \"beer\" && doc.name) {" +
        "    emit(doc.name, null);" +
        "  }" +
        "}"));

client.createDesignDoc(designDoc);
```

You can also delete a design document completely:

```java
client.deleteDesignDoc("beers");
```

### Performance
If you are running Couchbase Server, you probably do because you care about performance and scalability. As a general rule of thumb, just because of its nature, views tend to be more feature rich, but also slower than key-based document lookups (like you would do with a `get` command). The main reason for this is that more work has to be done on the server side to locate the proper contents of the index and return it to the user. Walking a tree data structure on distributed nodes and merging the subresults back into one for the client takes more time than a simple document lookup on one server.

After this initial disclaimer, let's see how we can get the maximum performance out of our views.

#### Understanding Staleness
When you are doing a view query, you can choose between data freshness and query performance. You can set the appropriate staleness option on the `Query` object through the `setStale(Stale)` method. The following options are available:

 - `Stale.OK`: When the query is executed on the server side, whatever is in the index at the moment is collected and sent back to the client. This is the most performant way of querying, but potentially also includes stale data or does not include recent documents (which the indexer did not pick up yet). Index updating is not triggered here, but the automatic index rebuilding process on the server side will update it eventually.
 - `Stale.UPDATE_AFTER`: Like Stale.OK, but triggers the index rebuilding in the background after the index has been returned to the client. This provides a good compromise between data freshness and performance, and therefore is the default setting.
 - `Stale.FALSE`: A full index update is done before the data is returned to the client. This option gives you the most accurate information about what's in the view index, but is also slower than the others because it takes some time to update the index (depending on how many documents have been mutated after the last indexer run).

When you are writing unit tests and when you absolutely need 100% accurate data sets in your views you not only need to query with `Stale.FALSE`, but also write the data with a persistence constraint of `PersistTo.MASTER`. This is because the indexer picks up the data from disk, and the only way to make sure it has received the write is to wait until it actually has been persisted to disk.
 
#### Reusing View Definitions
Every time you call the `.getView(String, String)` method on the `CouchbaseClient` object, an HTTP request is sent to the server. As you've seen in the previous sections, a `View` object is nothing more than a representation of what the view is about. This information won't change much in production.

As a best practice, call `getView` only once, and then cache the returned object and reuse it for every subsequent `query` call. That way you not only save bandwidth and latency, it also reduces the amount of work the server needs to do.

The reason you need to fetch the view information up front is so you know how the view is structured. If your view changes its characteristics (for example, a map function gets added or removed or the name changes) you need to reload the view. This needs to be handled appropriately for your application needs (for example, expose a command, rest endpoint or a JMX MBean). If just the content of the map function changes, there is no need to clear the cache.

#### Caching View Results
Another optimization that is very common is to cache the view result in another document. You can then treat it as any other cacheable object, optionally with a time to live attached. If the cached document doesn't need to be read by another programming language, you can store it as a serialized java object (or any other binary format).

Suppose you want to get a list of document IDs that represent breweries and beers. A simple caching solution that keeps the list of IDs for 10 seconds in a separate document before fetching it again from the view might look like this:

```java
private List<String> findBreweriesCached(CouchbaseClient client, View view) throws Exception {
    int ttl = 10; // keep for 10 seconds
    String key = "cache::" + view.getDesignDocumentName() + "::" + view.getViewName();

    List<String> response = (List<String>) client.get(key);
    if (response == null) {
        ViewResponse result = client.query(view, new Query());
        response = new ArrayList<String>();
        for (ViewRow row : result) {
            response.add(row.getId());
        }
        client.set(key, ttl, response).get();
    }
    return response;
}
```

Of course this can be modified to handle custom `Query` objects and timeout settings. The `View` instance is passed in explicitly because it can also be cached and reused in other spots of the application (also, proper error handling needs to be in place in a production setting).

#### Parallelism
One thread querying a view might not give you the throughput needed for your application. If you are benchmarking simple code like the following, you are more or less benchmarking network latency:

```java
View view = client.getView("beer", "brewery_beers");
Query query = new Query();

while (true) {
    client.query(view, new Query()); // do one query and wait for the result to arrive.
}
```

One approach is to use a [ExecutorService](http://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ExecutorService.html) and parallelize the query execution. With the addition of listeners after the 1.2 series, things got much easier, even on a single thread. To simulate a higher load, fire off 50 requests in parallel and wait until they come back. You can use the same approach if you need to query different views in parallel or process other operations at the same time:

```java
View view = client.getView("beer", "brewery_beers");
Query query = new Query();

int factor = 50;
while (true) {
    final CountDownLatch latch = new CountDownLatch(factor);
    for (int i = 0; i < factor; i++) {
        client.asyncQuery(view, new Query()).addListener(new HttpCompletionListener() {
            @Override
            public void onComplete(HttpFuture<?> future) throws Exception {
                ViewResponse response = (ViewResponse) future.get();
                // do something with the response here.
                
                latch.countDown();
            }
        });
    }
    latch.await();
}
```

To see whether the server or the client is the bottleneck, you can use `Stale.FALSE` and a smaller `limit` clause to both take off some pressure from the server and the network. Of course, if you are testing for realistic scenarios (which you should), just use the values that you anticipate to produce a realistic load behavior.

### Failure Handling
Because various things can go wrong in distributed systems, it's also important to talk about failure handling and avoidance. Most of the potential issues can be worked around with defensive coding; that is, accepting that things can go wrong and provide code to handle it appropriately to the application context.

Because view queries are not mutating any state, the `CouchbaseClient` itself will retry the query if a non-success response gets returned from the server until it times out. This is done for responses that indicate a retry might be successful. One of the common examples is that if a node gets removed from the cluster and it doesn't have any shards assigned to it (right before leaving the cluster at the end of a rebalance operation) it can't serve view requests anymore. In such cases, the server responds with an HTTP redirect indicating that another node in the cluster should be tried, which the client does transparently to the application.

One of the common responses that is not retried is a 404, which tells the client that the view can't be found on the server. If this happens, a `InvalidViewException` error is thrown:

```
Exception in thread "main" com.couchbase.client.protocol.views.InvalidViewException: Could not load view "bar" for design doc "foo"
    at com.couchbase.client.CouchbaseClient.getView(CouchbaseClient.java:421)
    at Main.main(Main.java:27)
```

Make sure that the view is deployed to production and available on the target cluster. Note that since it's expected that if the `View` object is found, a subsequent 404 on the `query` method is retried (because it could indicate a temporary error). 

If you construct an invalid `View` object intentionally and query the server, you'll see the following:

```java
client.asyncQuery(
    new View("beer-sample", "foo", "bar", true, false),
    new Query()
).get(10, TimeUnit.SECONDS);
```

```
2014-01-09 11:27:35.745 INFO com.couchbase.client.ViewNode$MyHttpRequestExecutionHandler:  Retrying HTTP operation Request: GET /beer-sample/_design/foo/_view/bar HTTP/1.1, Response: HTTP/1.1 404 Object Not Found
Exception in thread "main" java.util.concurrent.TimeoutException: Timed out waiting for operation
    at com.couchbase.client.internal.HttpFuture.waitForAndCheckOperation(HttpFuture.java:93)
    at com.couchbase.client.internal.HttpFuture.get(HttpFuture.java:82)
```

If you always try to load a fresh `View` object this is not likely to happen, but could arise when you are caching `View` definitions that get deleted or renamed.

`TimeoutExceptions` can arise on all view method calls, most of the time because one part in the request/response cycles is slowing down (client, network or server). They should be caught, logged and investigated properly. The default timeout, while adjustable, is set to 75 seconds.

Always include null-checks when processing `getDocument()` calls because by definition a view is not 100% up-to-date on the state of the documents. This is especially important if you are storing documents with timeouts or deleting them on a regular basis. The following example checks for a null document:


```java
View view = client.getView("beer", "brewery_beers");
ViewResponse response = client.query(view, new Query().setIncludeDocs(true));
for (ViewRow row : response) {
    Object doc = row.getDocument();
    if (doc != null) {
        // do something with your document       
    }
}
```

### Experimental: Spatial Views
Spatial iews are an experimental feature on both on the server and the client side as of the 2.x server releases. The documents queried need to follow the [GeoJSON](http://geojson.org/geojson-spec.html) specification. You can create a spatial view from the UI with the following map function:

```javascript
function (doc) {
    if (doc.type == "brewery" && doc.geo.lon && doc.geo.lat) {
        emit({ "type": "Point", "coordinates": [doc.geo.lon, doc.geo.lat]}, null);
    }
}
```

Querying the spatial view from the Java SDK is similar to querying regular views:

```java
SpatialView view = client.getSpatialView("beer", "points");
Query query = new Query();
query.setLimit(10);

ViewResponse response = client.query(view, query);
for (ViewRow row : response) {
   System.out.println(row.getId() + ": " + row.getBbox());
}
```

```
vancouver_island_brewing: [-123.367,48.4344,-123.367,48.4344]
umpqua_brewing: [-123.342,43.2165,-123.342,43.2165]
yaletown_brewing: [-123.121,49.2755,-123.121,49.2755]
wild_duck_brewing: [-123.087,44.0521,-123.087,44.0521]
white_oak_cider: [-123.073,45.3498,-123.073,45.3498]
thirstybear_brewing: [-122.4,37.7855,-122.4,37.7855]
yakima_brewing_and_malting_grant_s_ales: [-120.506,46.6021,-120.506,46.6021]
tenaya_creek_restaurant_and_brewery: [-115.251,36.2154,-115.251,36.2154]
wyder_s_cider: [-114.083,51.034,-114.083,51.034]
uinta_brewing_compnay: [-111.954,40.7326,-111.954,40.7326]
```

You can also access the latitude and longitude parameters from the `ViewRow` response. Doing a query like this returns the first 10 rows from wherever in the world. If you just want to get those from Europe, you can use coordinates to set a bounding box at query time:

```java
SpatialView view = client.getSpatialView("beer", "points");
Query query = new Query();
query.setLimit(10);

// Somewhere south-west of portugal
double lowerLeftLon = -10.37109375;
double lowerLeftLat = 33.578014746143985;

// Somewhere north-east of europe, over russia
double upperRightLon = 43.76953125;
double upperRightLat = 71.9653876991313;
query.setBbox(lowerLeftLon, lowerLeftLat, upperRightLon, upperRightLat);

ViewResponse response = client.query(view, query);
for (ViewRow row : response) {
   System.out.println(row.getId() + ": " + row.getBbox());
}
```

```
dublin_brewing: [-6.2675,53.3441,-6.2675,53.3441]
st_james_s_gate_brewery: [-6.2675,53.3441,-6.2675,53.3441]
strangford_lough_brewing_company_ltd: [-5.6548,54.3906,-5.6548,54.3906]
st_austell_brewery: [-4.7883,50.3416,-4.7883,50.3416]
tennent_caledonian_brewery: [-4.2324,55.8593,-4.2324,55.8593]
williams_brothers_brewing_company: [-3.7954,56.1163,-3.7954,56.1163]
maclay_and_co: [-3.7528,56.1073,-3.7528,56.1073]
orkney_brewery: [-3.3135,59.0697,-3.3135,59.0697]
sa_brain_co_ltd: [-3.179,51.4736,-3.179,51.4736]
traquair_house_brewery: [-3.0636,55.619,-3.0636,55.619]
```

For more information about working with spatial views, see [Writing geospatial views](http://docs.couchbase.com/couchbase-manual-2.2/#writing-geospatial-views).

