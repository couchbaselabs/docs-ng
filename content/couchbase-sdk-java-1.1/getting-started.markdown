#Introduction

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

This guide provides information for developers who want to use the Couchbase Java SDK to build applications that use Couchbase Server.

# Getting Started

Awesome that you want to learn more about Couchbase! This is the right place to
start your journey. This chapter will teach you the basics of Couchbase and how
to interact with it through the Java Client SDK.

If you haven't already, [download](http://couchbase.com/downloads) the latest
Couchbase Server 2.0 release (or later) and install it. While following the download
instructions and setup wizard, make sure install the `beer-sample` default
bucket. It contains sample data of beers and breweries, which we'll be using in
our examples here. If you've already installed Couchbase Server 2.0 and didn't
install the `beer-sample` bucket (or if you deleted it), just open the Web-UI
and navigate to `Settings/Sample Buckets`. Activate the `beer-sample` checkbox
and click `Create`. In the right hand corner you'll see a notification box that
will disappear once the bucket is ready to be used.

Here's a quick outline of what you'll learn in this chapter:

 1. Create a project in your favorite IDE and set up the dependencies.

 1. Write a simple program to demonstrate connecting to Couchbase and saving some
    documents.

 1. Write a program to demonstrate using Create, Read, Update, Delete (CRUD)
    operations on documents in combination with JSON serialization and
    deserialization.

 1. Explore some of the API methods that will take you further than what you've seen
    previously.

From here on, we'll assume that you have a Couchbase Server 2.0 release running
and the "beer-sample" bucket configured. If you need any help on setting up
everything, there is plenty of documentation available:

 * [Using the Couchbase Web
   Console](http://docs.couchbase.com/couchbase-manual-2.0/#introduction-to-couchbase-server),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://docs.couchbase.com/couchbase-manual-2.0/#command-line-interface-for-administration),
   for the command line interface,

 * [Couchbase REST
   API](http://docs.couchbase.com/couchbase-manual-2.0/#using-the-rest-api),
   for creating and managing Couchbase resources.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see  <a href=http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx> MSDN: Avoiding TCP/IP Port
Exhaustion</a>.

<a id="getting-started-preparations"></a>

## Preparations

<a id="downloading"></a>

### Downloading the Couchbase Client Libraries

In general, there are two options available on how to include the Client SDK in
your project. You can either manually include all dependencies in your
`CLASSPATH` or (if you want to make your life easier) use
[Maven](http://maven.apache.org/).

To include the libraries ( `jar` files) directly in your project,
[download the archive](http://packages.couchbase.com/clients/java/1.2.3/Couchbase-Java-Client-1.2.3.zip) and add
all `jar` files to your `CLASSPATH` of the system/project. Most IDEs also allow
you add specific `jar` files to your project. Make sure to have the following
dependencies in your `CLASSPATH` :

 * couchbase-client-1.1.9.jar

 * spymemcached-2.9.1.jar

 * commons-codec-1.5.jar

 * httpcore-4.1.1.jar

 * netty-3.5.5.Final.jar

 * httpcore-nio-4.1.1.jar

 * jettison-1.1.jar

Previous releases are also available as zip archives as well:
 * [Couchbase Java Client 1.1.8](http://packages.couchbase.com/clients/java/1.1.8/Couchbase-Java-Client-1.1.8.zip)
 * [Couchbase Java Client 1.1.7](http://packages.couchbase.com/clients/java/1.1.7/Couchbase-Java-Client-1.1.7.zip)
 * [Couchbase Java Client 1.1.6](http://packages.couchbase.com/clients/java/1.1.6/Couchbase-Java-Client-1.1.6.zip)
 * [Couchbase Java Client 1.1.5](http://packages.couchbase.com/clients/java/1.1.5/Couchbase-Java-Client-1.1.5.zip)
 * [Couchbase Java Client 1.1.4](http://packages.couchbase.com/clients/java/1.1.4/Couchbase-Java-Client-1.1.4.zip)
 * [Couchbase Java Client 1.1.3](http://packages.couchbase.com/clients/java/1.1.3/Couchbase-Java-Client-1.1.3.zip)
 * [Couchbase Java Client 1.1.2](http://packages.couchbase.com/clients/java/1.1.2/Couchbase-Java-Client-1.1.2.zip)
 * [Couchbase Java Client 1.1.1](http://packages.couchbase.com/clients/java/1.1.1/Couchbase-Java-Client-1.1.1.zip)
 * [Couchbase Java Client 1.1.0](http://packages.couchbase.com/clients/java/1.1.0/Couchbase-Java-Client-1.1.0.zip)

If you don't like to handle dependencies on your own, you can use a build
manager to handle them for you. Couchbase provides a
[Maven](http://maven.apache.org/) repository that you can use which includes the
dependencies automatically. The root URL of the repository is located under
[http://files.couchbase.com/maven2/](http://files.couchbase.com/maven2/).
Depending on the build manager you're using, the exact syntax to include it may
vary. Here is an example on how to do it in Maven by updating your `pom.xml`.


```
<repositories>
  <repository>
    <id>couchbase</id>
    <name>Couchbase Maven Repository</name>
    <layout>default</layout>
    <url>http://files.couchbase.com/maven2/</url>
  </repository>
</repositories>

<dependency>
    <groupId>couchbase</groupId>
    <artifactId>couchbase-client</artifactId>
    <version>1.1.9</version>
</dependency>
```

If you are coming from Scala and want to manage your dependencies through
[sbt](http://www.scala-sbt.org/), then you can do it this way (in your
`build.sbt` ):


```
resolvers += "Couchbase Maven Repository" at "http://files.couchbase.com/maven2"

libraryDependencies += "couchbase" % "couchbase-client" % "1.1.9"
```

<a id="ide-setup"></a>

### Setting up your IDE

In this example here we'll use the [NetBeans IDE](http://netbeans.org/), but of
course any other will work as well. After installing the IDE, go to `File -> New
Project`, select `Maven` and `Java Application`. Give it a name (like
"examples") and change the location to a directory where you want to place the
files. We'll use the `com.couchbase` namespace, but you can use your own if you
like (just make sure to change it later in the source files when you copy them).

Now that you've created your project, it's time to add the Couchbase Maven
repository. The easiest way to do this is to go to `Window -> Services`, spot
the `Maven Repositories` tree, right click on it and click `Add Repository`. Use
the following settings (or modify the `directly` ):

 * ID: couchbase

 * Name: Couchbase Maven Repository

 * URL: http://files.couchbase.com/maven2/

Jump back to your new project and right click on `Dependencies`, and then `Add
Dependency`. For now, we only need to add the Couchbase SDK itself, because the
transitive dependencies will be fetched automatically. Use the following
settings:

 * Group ID: couchbase

 * Artifact ID: couchbase-client

 * Version: 1.1.9

Now all dependencies are in place and we can move forward to our first
application with Couchbase!

<a id="hello-world"></a>

## Hello Couchbase

To follow the tradition of programming tutorials, we'll start with "Hello
Couchbase". In the first example, we'll connect to the Cluster, set a simple
document, retrieve it and print it out. This first example contains the full
sourcecode, but in later example we'll omit the imports and assume we're already
connected to the cluster.

Listing 1: Hello Couchbase!


```
package com.couchbase.examples;

import com.couchbase.client.CouchbaseClient;
import java.net.URI;
import java.util.ArrayList;

public class App {
  public static void main(String[] args) {
    ArrayList<URI> nodes = new ArrayList<URI>();

    // Add one or more nodes of your cluster (exchange the IP with yours)
    nodes.add(URI.create("http://127.0.0.1:8091/pools"));

    // Try to connect to the client
    CouchbaseClient client = null;
    try {
      client = new CouchbaseClient(nodes, "default", "");
    } catch (Exception e) {
      System.err.println("Error connecting to Couchbase: " + e.getMessage());
      System.exit(1);
    }

    // Set your first document with a key of "hello" and a value of "couchbase!"
    int timeout = 0; // 0 means store forever
    client.set("hello", timeout, "couchbase!");

    // Return the result and cast it to string
    String result = (String)client.get("hello");
    System.out.println(result);

    // Shutdown the client
    client.shutdown();
  }
}
```

While this code should be very easy to grasp, there is a lot going on worth a
little more discussion:

 1. Connecting: the CouchbaseClient accepts a List of `URIs` that point to nodes in
    the Cluster. While passing in only one `URI` is fine, it is strongly recommended
    to add two or three (of course if your cluster has more than one node). It is
    important to understand that this list does not have to contain all nodes in the
    cluster - you just need to provide a few so that during the initial bootstrap
    phase the Client is able to connect to the server. After this has happened, the
    Client automatically fetches the cluster configuration and keeps it up to date,
    even when the cluster topology changes. This means that you don't need to change
    your application config at all when you need to resize your cluster. Also keep
    in mind to use a URI exactly like `http://[YOUR-NODE]:8091/pools` (and not just
    the IP-Address for example) - this is sometimes called the bootstrap URI.

    The next two arguments are for the `bucket` and the `password`. The bucket is
    the container for all your documents. Inside a bucket, a key - the identifier
    for a document - must be unique. In production environments, it is recommended
    to use a password on a bucket (this can be configured during bucket creation),
    but when you are just starting out using the `default` bucket without a password
    is fine. Note that the `beer-sample` bucket also doesn't have a password, so
    just change the bucket name and you're set.

 2. `Set` and `get` : these two operations are one of the most fundamental ones. You
    can use `set` to create or override a document inside your bucket and `get` to
    read it back afterwards. There are lots of arguments and variations, but if you
    just use them as shown in the previous example will get you pretty far. Note
    that the `get` operation doesn't care what you read out of the bucket, so you
    need to cast it into the format you want (in our case we did store a string, so
    it makes sense to convert it back later).

 3. Disconnecting: at the end of the program (or when you shutdown your server
    instance), you should use the `shutdown` method to prevent the loss of data. If
    used without arguments, it will wait until all outstanding operations have been
    finished (but no new ones will be accepted). You can also call it with a maximum
    waiting time which makes sense if you (potentially) don't want to wait forever.

By default, the logger is configured to log from `INFO` upwards. This means that
by default, a decent amount of helpful information is logged automatically. In
our example above, the logs look like this:


```
2012-12-03 18:57:45.777 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
2012-12-03 18:57:45.788 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@76f8968f
2012-12-03 18:57:45.807 INFO com.couchbase.client.ViewConnection:  Added localhost to connect queue
2012-12-03 18:57:45.808 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
couchbase!
2012-12-03 18:57:45.925 INFO com.couchbase.client.CouchbaseConnection:  Shut down Couchbase client
2012-12-03 18:57:45.929 INFO com.couchbase.client.ViewConnection:  Node localhost has no ops in the queue
2012-12-03 18:57:45.929 INFO com.couchbase.client.ViewNode:  I/O reactor terminated for localhost
```

You can see to which nodes the client connects (hopefully every node in the
cluster), which viewmode is used (more on that later) and other helpful output.
These logs provide vital information when a issue needs to be debugged (be it
through the community forums or through paid Couchbase Support).

<a id="working-with-docs"></a>

## Working with Documents

A document in Couchbase Server consists of a unique `key`, a `value` and us
stored in a `bucket`. A document can be anything, but it is recommended to use
the JSON format. JSON is very convenient for storing structured data with little
overhead, and is also used inside the View engine. This means that if you want
to get most out of Couchbase Server 2.0, use JSON.

The Java SDK doesn't come with a JSON library bundled and leaves it up to you to
choose your favorite one. If you are not sure which one to use, the [GSON
library](http://code.google.com/p/google-gson/) is a very good choice (and it's
what we'll use in later examples). You can download it directly (and include it
in your `CLASSPATH` ) or get it through Maven.

The following chapter introduces the basic operations that you can use as the
fundamental building blocks of your application.

<a id="create-update-docs"></a>

### Creating and Updating Documents

Couchbase Server provides a set of commands to store documents. The commands are
very similar to each other and differ only in their meaning on the server-side.
These are:

 * `set` : Stores a document in Couchbase Server (identified by its unique key) and
   overrides the previous document (if there was one).

 * `add` : Adds a document in Couchbase Server (identified by its unique key) and
   fails if there is already a document with the same key stored.

 * `replace` : Replaces a document in Couchbase Server (identified by its unique
   key) and fails if there is no document with the given key already in place.

The SDK provides overloaded methods for these operations, but to start out here
are the simplest forms:


```
String key = "mykey";
int timeout = 0;
String doc = "something";
OperationFuture<Boolean> setResult = client.set(key, timeout, doc);
OperationFuture<Boolean> addResult = client.add(key, timeout, doc);
OperationFuture<Boolean> replaceResult = client.replace(key, timeout, doc);
```

Couchbase Server takes performance very seriously, so all these operations are
non-blocking (asynchronous). They return immediately and are handled in a
different thread behind the scenes. If you want to explicitly wait until the
operation has finished, you can use the `get()` method on the returned future.
If you do so, your calling thread will wait until the operation has been
fulfilled by the server and is marked as `done`. If something goes wrong, the
return value of the future will be `false` and you can use the
`future.getStatus().getMessage()` method to see why it failed.

The second param on all these mutation operations is a `timeout`. When set to
`0`, the document will be stored forever (or until deleted manually). If set to
(for example) `10`, the document will be deleted automatically after 10 seconds.
If you want to use Couchbase Server as a session store, this comes in very handy
(amongst lots of other use cases).

<a id="read-docs"></a>

### Reading Documents

With Couchbase Server 2.0, you have two ways of fetching your documents: either
by the unique key through the `get` method, or through Views. Since Views are
more complex, let's tackle `get` first:


```
Object get = client.get("mykey");
```

Since Couchbase doesn't really know what you've stored as a document, you get a
`Object` back. If you store JSON documents, the actual document will be a
String, so you can safely convert it to a string:


```
String json = (String) client.get("mykey");
```

If no document was found, `null` is returned. It is important to check for
`null`, to prevent `NullPointerExceptions` later down the stack.

With Couchbase Server 2.0, the very powerful ability to query your documents
through secondary indexes (
[Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
) has been added to your toolbelt. This guide gets you started on how to use
them through the Java SDK, if you want to learn more please refer to the
[chapter in the Couchbase Server 2.0
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

Once you created your View in the UI, you can query it from the SDK in three
steps. First, you grab the View definition from the cluster, second you create a
`Query` object and third, you query the cluster with both the `View` and the
`Query` objects. In its simplest form, it looks like this:


```
// 1: Get the View definition from the cluster
View view = client.getView("beer", "brewery_beers");

// 2: Create the query object
Query query = new Query();

// 3: Query the cluster with the view and query information
ViewResponse result = client.query(view, query);
```

The `getView()` method needs both the name of the `Design Document` and the
`View` to load up the proper definition from the cluster. This is needed to
determine if there is a view with the given information and also if it contains
a reduce function (or is even a spatial view).

Views can be queried with a large amount of options. All supported options are
available as setter methods on the `Query` object. Here are some of them:

 * `setIncludeDocs(boolean)` : Used to define if the complete documents should be
   included in the result.

 * `setReduce(boolean)` : Used to enable/disable the reduce function (if there is
   one defined on the server).

 * `setLimit(int)` : Limit the number of results that should be returned.

 * `setDescending(boolean)` : Revert the sorting order of the result set.

 * `setStale(Stale)` : Can be used to define the tradeoff between performance and
   freshness of the data.

 * `setDebug(boolean)` : Prints out debugging information in the logs.

Now that we have our View information and the Query object in place, we can
issue the `query` command, which actually triggers the scatter-gather data
loading process on the Cluster. The resulting information is encapsulated inside
the `ViewResponse` object. We can use it to iterate over the results and print
out some details (here is a more complete example which also includes the full
documents and only fetches the first five results):


```
View view = client.getView("beer", "brewery_beers");
Query query = new Query();
query.setIncludeDocs(true).setLimit(5); // include all docs and limit to 5
ViewResponse result = client.query(view, query);

// Iterate over the result and print the key of each document:
for(ViewRow row : result) {
  System.out.println(row.getId());
  // The full document (as String) is available through row.getDocument();
}
```

In the logs, you can see the corresponding document keys automatically sorted
(ascending):


```
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
21st_amendment_brewery_cafe-bitter_american
```

<a id="delete-docs"></a>

### Deleting Documents

If you want to get rid of a document, you can use the `delete` operation:


```
OperationFuture<Boolean> delete = client.delete("key");
```

Again, `delete` is an asynchronous operation and therefore returns a
`OperationFuture` on which you can block through the `get()` method. If you try
to delete a document that is not there, the result of the `OperationFuture` will
be `false`.

<a id="json-handling-docs"></a>

### JSON Encoding/Decoding

One benefit of working with JSON documents is that you can map them (nearly)
directly from/to objects in your application. Unlike with Java object
serialization, you need to do some more work to convert your object to its
appropriate JSON representation. Fortunately, libraries like GSON (as mentioned
before) are here to help.

In the following example, we define a simple `Beer` class that implicitly
carries the JSON fields as attributes. We can then use GSON to convert from the
Object to JSON and back. The example is a little bit contrived, but it shows the
roundtrip from Object to JSON back to Object pretty well that you can use
throughout your application.


```
public class App {

  // Model the Beer
  static class Beer {
    String name;
    String type;
    String category;
    float abv;

    // Convenience method to generate a key
    public String getKey() {
      return type + "-" + name;
    }
  }

  public static void main(String args[]) throws Exception {

    // Connect
    CouchbaseClient client = new CouchbaseClient(
      Arrays.asList(URI.create("http://127.0.0.1:8091/pools")),
      "beer-sample",
      ""
    );

    // Instantiate GSON
    Gson gson = new Gson();

    // Create a beer
    Beer myAle = new Beer();
    myAle.name = "cool-ale";
    myAle.type ="beer";
    myAle.category = "Stouts and Ales";
    myAle.abv = 5.2f;

    // Convert the beer to JSON
    String json = gson.toJson(myAle);

    // Store in Couchbase
    client.set(myAle.getKey(), 0, json);

    // Read it back
    String readJson = (String) client.get(myAle.getKey());

    // Create a object out of it
    Beer sameBeer = gson.fromJson(readJson, Beer.class);

    // Now use it like:
    System.out.println(sameBeer.category);

    // Disconnect
    client.shutdown(3, TimeUnit.SECONDS);
    System.exit(0);
  }

}
```

You can also use the same pattern when you query a View, and include the
complete docs through `setIncludeDocs(true)`. Based on the previous `Beer`
class, imagine a View that returns all beers stored in the bucket. We could
query the View and immediately create Objects out of them:


```
View view = client.getView("beer", "only_beers");
Query query = new Query();
query.setIncludeDocs(true);
ViewResponse result = client.query(view, query);

for(ViewRow row : result) {
  Beer beer = gson.fromJson(row.getDocument(), Beer.class);
  System.out.println(beer.name);
}
```

The previous chapters introduced Couchbase Server and how to use it through the
Java SDK. With this knowledge at hand, you are already able to build powerful
applications on top of Couchbase Server 2.0 and Java. The next chapter digs a
bit deeper and introduces advanced concepts that can help you along the way.

<a id="advanced-topics"></a>

## Advanced Topics

This chapter introduces some techniques topics that you can use to further
extend your Couchbase vocabulary.

<a id="advanced-cas"></a>

### CAS and Locking

If you need to coordinate shared access on documents, Couchbase helps you with
two approaches. Depending on the application you may need to use both of them,
but in general it is better (if feasible) to lean towards `CAS` because it
provides the better performance characteristics.

 * Optimistic Locking with `cas()` : Each document has a unique identifier
   associated with it (the `CAS` value), which changes when the document itself is
   mutated. You can fetch the `CAS` value for a given key and then use the `cas()`
   operation to update it. The update will only succeed, when the `CAS` value is
   still the same. This is why it's called optimistic locking: someone else can
   still read and try to update the document, but it will fail once the `CAS` value
   has changed. Here is a example on how to do it with the Java SDK:

    ```
    // Reads the document with the CAS value.
    String key = "eagle_brewing-golden";
    CASValue<Object> beerWithCAS = client.gets(key);

    // Updates the document and tries to store it back.
    Beer beer = gson.fromJson((String)beerWithCAS.getValue(), Beer.class);
    beer.name = "Some other Name";
    CASResponse cas = client.cas(key, beerWithCAS.getCas(), gson.toJson(beer));
    ```

   The `CASResponse` is a ENUM which identifies the status of the `cas()`
   operation. If it succeeds, `CASResponse.OK` is returned. If `CASResponse.EXISTS`
   is returned, the CAS has changed in the meantime. A common approach is to run
   the script shown above (the whole fetch-and-update process) in a loop until the
   operation did succeed. Depending on your application, you may need to do
   conflict management as well.

   Note that this also means that all your application need to follow the same code
   path (cooperative locking). If you use `set()` somewhere else in the code on the
   same document, it will work even if the `CAS` itself is out of date (that's
   because the normal `set()` method doesn't care about those values at all). Of
   course, the `CAS` itself changes then and the `cas()` operation would fail
   afterwards.

 * Pessimistic Locking with `getAndLock()` : If you want to lock a document
   completely (or an object graph), you can use the `getAndLock()` method. Other
   threads can still run `get()` queries against the document, but `set()`
   operations without a `CAS` will fail.

    ```
    // Get with Lock
    String key = "eagle_brewing-golden";
    CASValue<Object> beer = client.getAndLock(key, 20);
    String beerJson = (String) beer.getValue();

    // Try to set without the lock
    OperationFuture<Boolean> result = client.set(key, 0, beerJson);
    System.out.println(result.get()); // Prints false

    // Try to set with the CAS aquired
    CASResponse cas = client.cas(key, beer.getCas(), beerJson);
    System.out.println(cas); // Prints OK
    ```

   Once you update the document, the lock will be released. There is also the
   `unlock()` method available through which you can unlock the document. You are
   required to define how long the lock should be active (the maximum is 30
   seconds).

<a id="advanced-persistence"></a>

### Persistence and Replication

By default, the `OperationFutures` return when Couchbase Server has accepted the
command and stored it in memory (disk persistence and replication is handled
asynchronously by the cluster). That's one of the reason why it's so fast. For
most use-cases, that's the behavior that you need. Sometimes though, you want to
trade in performance for data-safety and wait until the document has been saved
to disk and/or replicated to other hosts.

The Java SDK provides overloaded commands for all necessary operations (that is
`set()`, `add()`, `replace()`, `cas()` and `delete()` ). They all accept a
combindation of `PersistTo` and `ReplicateTo` enums, which define on how many
other servers you want it to persist/replicate. Here is an example on how to
make sure that the document has been persisted on its master node, but also
replicated to at least one of its replicas.


```
OperationFuture<Boolean> oper = client.set(
  "important",
  0,
  "document",
  PersistTo.MASTER,
  ReplicateTo.ONE
);
Boolean success = oper.get();
if(success == false) {
  System.err.println(oper.getStatus().getMessage());
}
```

It is very important to understand that the persistence checks are separate from
the actual operation. This means that when the `OperationFuture` returns false,
it can be the case that the operation itself succeeded. It is up to the
application layer to determine what went wrong and what to do afterwards. This
may seem problematic at first, but imagine the following scenario: because of a
power outage in the datacenter, the nodes with the replica copies for the key
went down. Now the persistence constraint will fail temporarily, but you can
still serve your application because the main node is still available. If you
need different behavior, you can add a "rollback" wrapper around it and delete
the saved document if persistence problems arise.

<a id="advanced-complexkey"></a>

### View Queries with ComplexKeys

Most of the setters you can use on the `Query` object accept Booleans or Enums.
Some of them accept strings as well, which means the value given would be
encoded and sent over the wire. The problem is that Couchbase Server expects
valid JSON strings for some of them, which means you need to take care of proper
JSON handling yourself. To make your life easier, all of these commands are
overloaded and accept instances of the `ComplexKey` class in addition to plain
Strings. These `ComplexKey` instances accept any kind of Java objects and handle
the proper JSON translation for you.

To create `ComplexKeys`, you can use the `of()` factory method like this as it
accepts a variable amount of java objects and/or types:


```
Query query = new Query();

// Generates valid ["Hello","World",5.12] JSON on the wire.
ComplexKey rangeStart = ComplexKey.of("Hello", "World", 5.12);

// Pass it in like this
query.setRangeStart(rangeStart);
```

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * General Information: [Couchbase Server Manual: Views and
   Indexes](http://docs.couchbase.com/couchbase-manual-2.0/#views-and-indexes).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://docs.couchbase.com/couchbase-manual-2.0/#views-in-a-schema-less-database).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://docs.couchbase.com/couchbase-manual-2.0/#date-and-time-selection).

<a id="next-steps"></a>

## Next Steps

You should now be well equipped to start exploring Couchbase Server on your own.
If you want to dig deeper and see a full-fledged application on top of Couchbase
Server 2.0, head over to the [Web Application
Tutorial](http://docs.couchbase.com/couchbase-sdk-java-1.1/#tutorial).
Also, the [server
documentation](http://docs.couchbase.com/couchbase-manual-2.0/) and the
[developer
documentation](http://docs.couchbase.com/couchbase-devguide-2.0/)
provide useful information for your day-to-day work with Couchbase. Finally, the
API docs of the Java SDK can be found
[here](http://docs.couchbase.com/couchbase-sdk-java-1.1/#java-method-summary).
And JavaDoc is also
[available](http://www.couchbase.com/autodocs/couchbase-java-client-1.1.9/index.html).

<a id="tutorial"></a>
