<a id="couchbase-sdk-java-1-1"></a>

# Couchbase Client Library: Java 1.1

This is the manual for 1.1 of the Couchbase Java client library, which is
compatible with Couchbase Server 2.0.

This manual provides a reference to the key features and best practice for using
the Java Couchbase Client libraries ( `couchbase-client` and `spymemcached` ).
The content constitutes a reference to the core API, not a complete guide to the
entire API functionality.

 * Couchbase Server 1.8 — ✓ — ✓ —

 * Couchbase Server 2.0 — ✓ — ✓ —



### External Community Resources

 * [Wiki: Java Client
   Library](http://www.couchbase.com/wiki/display/couchbase/Couchbase+Java+Client+Library)

 * [Download Client
   Library](http://packages.couchbase.com/clients/java/1.1.0/Couchbase-Java-Client-1.1.0.zip)

 * [JavaDoc](http://www.couchbase.com/autodocs/couchbase-java-client-1.1.0/index.html)

 * [Couchbase Developer Guide
   2.0](http://www.couchbase.com/docs/couchbase-devguide-2.0/index.html)

 * [Couchbase Server Manual
   2.0](http://www.couchbase.com/docs/couchbase-manual-2.0/index.html)

 * [Java Client Library](http://www.couchbase.com/develop/java/current)

 * [SDK Forum](http://www.couchbase.com/forums/sdks/sdks)



### Note

The following document is still in production, and is not considered complete or
exhaustive.

*Last document update* : 12 Feb 2013 19:30; *Document built* : 12 Feb 2013
19:30.

### Documentation Availability and Formats

This documentation is available **Unhandled:** `[:unknown-tag :wordasword]`. For
other documentation from Couchbase, see [Couchbase Documentation
Library](http://www.couchbase.com/docs)

**Contact:**  [editors@couchbase.com](mailto:editors@couchbase.com) or
[couchbase.com](http://www.couchbase.com)

Copyright © 2010, 2011 Couchbase, Inc. Contact
[copyright@couchbase.com](mailto:copyright@couchbase.com).

For documentation license information, see [Documentation
License](couchbase-sdk-java-ready.html#license-documentation). For all license
information, see [Licenses](couchbase-sdk-java-ready.html#licenses).


![](/media/java/images/couchbase_logo.jpg)

<a id="getting-started"></a>

# Getting Started

Awesome that you want to learn more about Couchbase! This is the right place to
start your journey. This chapter will teach you the basics of Couchbase and how
to interact with it through the Java Client SDK.

If you haven't already, [download](http://couchbase.com/download) the latest
Couchbase Server 2.0 release and install it. While following the download
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
   Console](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="getting-started-preparations"></a>

## Preparations

<a id="downloading"></a>

## Downloading the Couchbase Client Libraries

In general, there are two options available on how to include the Client SDK in
your project. You can either manually include all dependencies in your
`CLASSPATH` or (if you want to make your life easier) use
[Maven](http://maven.apache.org/).

To include the libraries ( `jar` files) directly in your project,
[download](http://www.couchbase.com/develop/java/current) the archive and add
all `jar` files to your `CLASSPATH` of the system/project. Most IDEs also allow
you add specific `jar` files to your project. Make sure to have the following
dependencies in your `CLASSPATH` :

 * couchbase-client-1.1.0.jar

 * spymemcached-2.8.9.jar

 * commons-codec-1.5.jar

 * httpcore-4.1.1.jar

 * netty-3.5.5.Final.jar

 * httpcore-nio-4.1.1.jar

 * jettison-1.1.jar

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
    <snapshots>
      <enabled>false</enabled>
    </snapshots>
  </repository>
</repositories>

<dependency>
    <groupId>couchbase</groupId>
    <artifactId>couchbase-client</artifactId>
    <version>1.1.0</version>
    <scope>provided</scope>
</dependency>
```

If you are coming from Scala and want to manage your dependencies through
[sbt](http://www.scala-sbt.org/), then you can do it this way (in your
`build.sbt` ):


```
resolvers += "Couchbase Maven Repository" at "http://files.couchbase.com/maven2"

libraryDependencies += "couchbase" % "couchbase-client" % "1.1.0"
```

<a id="ide-setup"></a>

## Setting up your IDE

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

 * Version: 1.1.0

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

 1. `Set` and `get` : these two operations are one of the most fundamental ones. You
    can use `set` to create or override a document inside your bucket and `get` to
    read it back afterwards. There are lots of arguments and variations, but if you
    just use them as shown in the previous example will get you pretty far. Note
    that the `get` operation doesn't care what you read out of the bucket, so you
    need to cast it into the format you want (in our case we did store a string, so
    it makes sense to convert it back later).

 1. Disconnecting: at the end of the program (or when you shutdown your server
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

## Creating and Updating Documents

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

## Reading Documents

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

## Deleting Documents

If you want to get rid of a document, you can use the `delete` operation:


```
OperationFuture<Boolean> delete = client.delete("key");
```

Again, `delete` is an asynchronous operation and therefore returns a
`OperationFuture` on which you can block through the `get()` method. If you try
to delete a document that is not there, the result of the `OperationFuture` will
be `false`.

<a id="json-handling-docs"></a>

## JSON Encoding/Decoding

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

## CAS and Locking

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

## Persistence and Replication

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

## View Queries with ComplexKeys

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
   Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

<a id="next-steps"></a>

## Next Steps

You should now be well equipped to start exploring Couchbase Server on your own.
If you want to dig deeper and see a full-fledged application on top of Couchbase
Server 2.0, head over to the [Web Application
Tutorial](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/tutorial.html).
Also, the [server
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/) and the
[developer
documentation](http://www.couchbase.com/docs/couchbase-devguide-2.0/index.html)
provide useful information for your day-to-day work with Couchbase. Finally, the
API docs of the Java SDK can be found
[here](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/api-reference-summary.html).
And JavaDoc is also
[available](http://www.couchbase.com/autodocs/couchbase-java-client-1.1.0/index.html).

<a id="tutorial"></a>

# Tutorial

In this chapter we'll build on the foundations introduced in the [Getting
Started](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/getting-started.html)
guide and build a full-blown web application on top of it. Make sure to have the
`beer-sample` bucket around, because the application will allow you to display
and manage beers and breweries.

The full sourcecode is available through [couchbaselabs on
GitHub](http://github.com/couchbaselabs/beersample-java). Note that the sample
application over there provides more content than described in this tutorial,
but it should be easy for you to poke around if you read this tutorial here.

<a id="preparations"></a>

## Preparations

This tutorial uses Servlets and JSPs in combination with Couchbase Server 2.0 to
display and manage beers and breweries found in the `beer-sample` dataset. The
easiest way is to develop it with your IDE (like Eclipse or NetBeans) and then
publish it automatically to your application server (Apache Tomcat or GlassFish)
through a `war` archive. The code used here is designed to be as portable as
possible, but it may be the case that you need to tweak one or two things if you
have a slightly different version or a customized setup.

<a id="preps-project"></a>

## Project Setup

Inside your IDE, go ahead and create a new `Web Project`, either with or without
Maven support. The getting started guide provides information on how to include
the Couchbase SDK and all the needed dependencies in your project (the same
concepts apply here). Also make sure to include Google GSON or your favorite
JSON library as well. This turorial uses a directory structure like this:


```
|-target
|-src
|---main
|-----java
|-------com
|---------couchbase
|-----------beersample
|-----resources
|-----webapp
|-------WEB-INF
|---------beers
|---------breweries
|---------maps
|---------tags
|---------welcome
|-------css
|-------js
```

If you're using Maven, then you'll also have a `pom.xml` in the root directory.
Here is a sampe `pom.xml` for your reference (the full source is available from
the repository mentioned at the beginning of the tutorial):


```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.couchbase</groupId>
    <artifactId>beersample-java</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>beersample-java</name>

    <repositories>
        <repository>
            <id>couchbase</id>
            <name>Couchbase Maven Repository</name>
            <layout>default</layout>
            <url>http://files.couchbase.com/maven2/</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>couchbase</groupId>
            <artifactId>couchbase-client</artifactId>
            <version>1.1.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.2.2</version>
        </dependency>
        <dependency>
            <groupId>javax</groupId>
            <artifactId>javaee-web-api</artifactId>
            <version>6.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

In order to make the application look pretty, we're incorporating jQuery and
Twitter Bootstrap. You can either download the libraries and put it in their
appropriate css and js directories (under `webapp` ), or clone the project
repository and use it from there. Either way, make sure to have the following
files in place:

 * [css/beersample.css](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/beersample.css)

 * [css/bootstrap.min.css (the minified twitter bootstrap
   library)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/bootstrap.min.css)

 * [css/bootstrap-responsive.min.css (the minified responsive layout classes from
   bootstrap)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/bootstrap-responsive.min.css)

 * [js/beersample.js](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/js/beersample.js)

 * [js/jquery.min.js (the jQuery javascript
   library)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/js/jquery.min.js)

From here on, you should have a barebones web application configured that has
all the dependencies included. We'll now move on and configure the `beer-sample`
bucket the way we need it.

<a id="preps-views"></a>

## Preparing the Views

The `beer-sample` bucket comes with a small set of views already predefined, but
to make our application function correctly we need some more. This is also a
very good chance to explore the view management possibilities inside the Web-UI.

Since we want to list beers and breweries by their name, we need to define one
view for each. Head over to the Web-UI and click on the `Views` menu. Select
`beer-sample` from the dropdown list to switch to the correct bucket. Now click
on `Development Views` and then `Create Development View` to define your first
view. You need to give it the name of both the design document and the actual
view. Insert the following names:

 * Design Document Name: \_design/dev\_beer

 * View Name: by\_name

The next step is to define the `map` and (optional) `reduce` functions. In our
examples, we won't use the `reduce` functions at all but you can play around and
see what happens. Insert the following `map` function (that's JavaScript) and
click `Save`.


```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

Every `map` function takes the full document ( `doc` ) and its associated
metadata ( `meta` ) as the arguments. You are then free to inspect this data and
`emit` a result when you want to have it in your index. In our case we emit the
name of the beer ( `doc.name` ) when the document both has a type field and the
type is `beer`. We don't need to emit a value - that's we we are using `null`
here. It's always advisable to keep the index as small as possible. Resist the
urge to include the full document through `emit(meta.id, doc)`, because it will
increase the size of your view indexes. If you need to access the full document
(or large parts), then use the `setIncludeDocs(true)` directive which will do a
`get()` call against the document ID in the background. The resulting retrieval
of the document may be slightly out of sync with your view, but it will be fast
and efficient.

Now we need to do (nearly) the same for our breweries. Since you already know
how to do this, here is all the information you need to create it:

 * Design Document Name: \_design/dev\_brewery

 * View Name: by\_name

 * Map Function:

    ```
    function (doc, meta) {
      if(doc.type && doc.type == "brewery") {
        emit(doc.name, null);
      }
    }
    ```

The final step that you need to do is to push the design documents in
production. While the design documents are in `development`, the index is only
applied on the local node. Since we want to have the index on the whole dataset,
click the `Publish` button on both design documents (and accept any info popup
that warns you from overriding the old one).

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * General Information: [Couchbase Server Manual: Views and
   Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

<a id="preps-webxml"></a>

## Bootstrapping our Servlets: web.xml

To tell the application server where and how the incoming HTTP requests should
be routed, we need to define a `web.xml` inside the `WEB-INF` directory.


```
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
    <listener>
        <listener-class>com.couchbase.beersample.ConnectionManager</listener-class>
    </listener>
    <servlet>
        <servlet-name>WelcomeServlet</servlet-name>
        <servlet-class>com.couchbase.beersample.WelcomeServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>BreweryServlet</servlet-name>
        <servlet-class>com.couchbase.beersample.BreweryServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>BeerServlet</servlet-name>
        <servlet-class>com.couchbase.beersample.BeerServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>WelcomeServlet</servlet-name>
        <url-pattern>/welcome</url-pattern>
    </servlet-mapping>
    <servlet-mapping>
        <servlet-name>BreweryServlet</servlet-name>
        <url-pattern>/breweries/*</url-pattern>
        <url-pattern>/breweries</url-pattern>
    </servlet-mapping>
    <servlet-mapping>
        <servlet-name>BeerServlet</servlet-name>
        <url-pattern>/beers/*</url-pattern>
        <url-pattern>/beers</url-pattern>
    </servlet-mapping>
  <welcome-file-list>
    <welcome-file>welcome</welcome-file>
  </welcome-file-list>
</web-app>
```

Don't try to run this yet, because none of these classes are already
implemented. The `listener` directive references the `ConnectionMananger` class,
which we'll implement to manage the connection instance to our Couchbase
cluster. The `servlet` directives define our servlet classes that we're going to
use (three of them) and the following `servlet-mapping` directives map HTTP URLs
to them. The final `welcome-file-list` directive is used to tell the application
server where to route the root URL ( `"/"` ).

For now, comment out all `servlet`, `servlet-mapping` and `welcome-file-list`
directives, because the application server will complain if they're not
implemented. When you implement the appropriate servlets, remove the comments
accordingly (if you don't know how comment inside an XML file, use the `<!--`
and `-->` characters). If you plan to add your own servlets, don't forget to add
and map them inside the `web.xml` properly!

<a id="connection-management"></a>

## Connection Management

The first class we're going to implement is the `ConnectionManager` in the
`src/main/java/com/couchbase/beersample` directory. This is a
`ServletContextListener` which starts the `CouchbaseClient` on startup and
closes the connection when the application is shut down. Here is the full class,
the discussion follows afterwards (the comments and imports have been removed to
shorten the listing a bit).


```
package com.couchbase.beersample;

public class ConnectionManager implements ServletContextListener {

  private static CouchbaseClient client;

  private static final Logger logger = Logger.getLogger(
    ConnectionManager.class.getName());

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    logger.log(Level.INFO, "Connecting to Couchbase Cluster");
    ArrayList<URI> nodes = new ArrayList<URI>();
    nodes.add(URI.create("http://127.0.0.1:8091/pools"));
    try {
      client = new CouchbaseClient(nodes, "beer-sample", "");
    } catch (IOException ex) {
      logger.log(Level.SEVERE, ex.getMessage());
    }
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    logger.log(Level.INFO, "Disconnecting from Couchbase Cluster");
    client.shutdown();
  }

  public static CouchbaseClient getInstance() {
    return client;
  }

}
```

The `contextInitialized` and the `contextDestroyed` method are called on startup
and shutdown. When the application starts, the `CouchbaseClient` is initialized
with the list of nodes, the bucket name and the password (empty). Note that in a
production deployment, you want to fetch these environment-dependent settings
from a config file. The `getInstance()` method will be called from the servlets
to obtain the `CouchbaseClient` instance.

When you publish your application, you should see in the server logs that
Couchbase is correctly connecting to the bucket. If an exception is raised
during this phase, it means that your settings are wrong or you don't have no
Couchbase Server running at the given nodes.


```
INFO: Connecting to Couchbase Cluster
SEVERE: 2012-12-05 14:39:00.419 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
SEVERE: 2012-12-05 14:39:00.426 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@1b554a4
SEVERE: 2012-12-05 14:39:00.458 INFO net.spy.memcached.auth.AuthThread:  Authenticated to localhost/127.0.0.1:11210
SEVERE: 2012-12-05 14:39:00.487 INFO com.couchbase.client.ViewConnection:  Added localhost to connect queue
SEVERE: 2012-12-05 14:39:00.489 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
INFO: WEB0671: Loading application [com.couchbase_beersample-java_war_1.0-SNAPSHOT] at [/]
INFO: com.couchbase_beersample-java_war_1.0-SNAPSHOT was successfully deployed in 760 milliseconds.
```

<a id="welcome-page"></a>

## The Welcome Page

The first servlet that we're going to implement is the `WelcomeServlet`, so go
ahead and remove the appropriate comments inside the `web.xml` file (don't
forget to enable the `welcome-file-list` as well). When the user visits the
application, we'll show him a nice greeting and give him all available options
to choose.

Since there is no Couchbase interaction involved, we just tell it to render the
JSP template (imports and comments removed).


```
package com.couchbase.beersample;

public class WelcomeServlet extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    request.getRequestDispatcher("/WEB-INF/welcome/index.jsp")
      .forward(request, response);
  }

}
```

The index.jsp uses formatting-magic from twiter bootstrap to look pretty. Aside
from that, it shows a nice greeting and links to the servlets who provide the
actual functionality.


```
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<t:layout>
    <jsp:body>
        <div class="span6">
          <div class="span12">
            <h4>Browse all Beers</h4>
            <a href="/beers" class="btn btn-warning">Show me all beers</a>
            <hr />
          </div>
          <div class="span12">
            <h4>Browse all Breweries</h4>
            <a href="/breweries" class="btn btn-info">Take me to the breweries</a>
          </div>
        </div>
        <div class="span6">
          <div class="span12">
            <h4>About this App</h4>
            <p>Welcome to Couchbase!</p>
            <p>This application helps you to get started on application
                development with Couchbase. It shows how to create, update and
                delete documents and how to work with JSON documents.</p>
            <p>The official tutorial can be found
                <a href="http://www.couchbase.com/docs/couchbase-sdk-java-1.1/tutorial.html">here</a>!</p>
          </div>
        </div>
    </jsp:body>
</t:layout>
```

There is one more "unusual" thing here: it uses taglibs, which allow us to use
the same layout for all pages. Since haven't created it yet, it's time for it
now. Create a `layout.tag` file in the `/WEB-INF/tags` directory that looks like
this:


```
<%@tag description="Page Layout" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Couchbase Java Beer-Sample</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The Couchbase Java Beer-Sample App">
    <meta name="author" content="Couchbase, Inc. 2012">

    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/beersample.css" rel="stylesheet">
    <link href="/css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container-narrow">
      <div class="masthead">
        <ul class="nav nav-pills pull-right">
          <li><a href="/welcome">Home</a></li>
          <li><a href="/beers">Beers</a></li>
          <li><a href="/breweries">Breweries</a></li>
        </ul>
        <h2 class="muted">Couchbase Beer-Sample</h2>
      </div>
      <hr>
      <div class="row-fluid">
        <div class="span12">
            <jsp:doBody/>
        </div>
      </div>
      <hr>
      <div class="footer">
        <p>&copy; Couchbase, Inc. 2012</p>
      </div>
    </div>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/beersample.js"></script>
  </body>
</html>
```

Again, nothing fancy here. We just need it in place to make everything look
pretty afterwards. When you now deploy your application, you should see through
the logs that it is connecting to the Couchbase cluster and from the browser a
nice web page greeting you.

<a id="managing-beers"></a>

## Managing Beers

Now we're getting to the real meat of the tutorial. First, uncomment the
`BeerServlet` and its corresponding tags inside the `web.xml`. We'll make use of
a view to list all beers and make them easily searchable. We'll also provide a
form to create and/or edit beers and finally delete them.

Here is the barebones structure of our `BeerServlet`, which will be filled with
live data soon (again, comments and imports are removed).


```
package com.couchbase.beersample;

public class BeerServlet extends HttpServlet {

  final CouchbaseClient client = ConnectionManager.getInstance();

  final Gson gson = new Gson();

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    try {
      if(request.getPathInfo() == null) {
        handleIndex(request, response);
      } else if(request.getPathInfo().startsWith("/show")) {
        handleShow(request, response);
      } else if(request.getPathInfo().startsWith("/delete")) {
        handleDelete(request, response);
      } else if(request.getPathInfo().startsWith("/edit")) {
        handleEdit(request, response);
      } else if(request.getPathInfo().startsWith("/search")) {
        handleSearch(request, response);
      }
    } catch (InterruptedException ex) {
      Logger.getLogger(BeerServlet.class.getName()).log(
        Level.SEVERE, null, ex);
    } catch (ExecutionException ex) {
      Logger.getLogger(BeerServlet.class.getName()).log(
        Level.SEVERE, null, ex);
    }
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
  }

  private void handleIndex(HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
  }

  private void handleShow(HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
  }

  private void handleDelete(HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException,
    InterruptedException,
    ExecutionException {
  }

  private void handleEdit(HttpServletRequest request,
    HttpServletResponse response) throws ServletException, IOException {
  }

  private void handleSearch(HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
  }

}
```

Since our `web.xml` uses wildcards ( `*` ) to route every `/beer` -related to
this servlet, we need to inspect the path through `getPathInfo()` and dispatch
the request to a helper method that does the actual work. The `doPost()` method
will be used to analyze and store the results of the web-form to edit and create
beers (since the form is sent through a POST request).

The first functionality we'll implement is to list the top 20 beers in a table.
We can use the `beer/by_name` view we've created at the beginning to get a
sorted list of all beers. The following code belongs to the `handleIndex`
method:


```
// Fetch the View
View view = client.getView("beer", "by_name");

// Set up the Query object
Query query = new Query();

// We the full documents and only the top 20
query.setIncludeDocs(true).setLimit(20);

// Query the Cluster
ViewResponse result = client.query(view, query);

// This ArrayList will contain all found beers
ArrayList<HashMap<String, String>> beers = new ArrayList<HashMap<String, String>>();

// Iterate over the found documents
for(ViewRow row : result) {
  // Use Google GSON to parse the JSON into a HashMap
  HashMap<String, String> parsedDoc = gson.fromJson((String)row.getDocument(), HashMap.class);

  // Create a HashMap which will be stored in the beers list.
  HashMap<String, String> beer = new HashMap<String, String>();
  beer.put("id", row.getId());
  beer.put("name", parsedDoc.get("name"));
  beer.put("brewery", parsedDoc.get("brewery_id"));
  beers.add(beer);
}

// Pass all found beers to the JSP layer
request.setAttribute("beers", beers);

// Render the index.jsp template
request.getRequestDispatcher("/WEB-INF/beers/index.jsp")
  .forward(request, response);
```

The index action queries the view, parses the results with GSON into a `HashMap`
and eventually forwards the `ArrayList` to the JSP layer. We'll now implement
the `index.jsp` template which will iterate over the `ArrayList` and print it
out in a nicely-formatted table:


```
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<t:layout>
  <jsp:body>
    <h3>Browse Beers</h3>

    <form class="navbar-search pull-left">
      <input id="beer-search" type="text" class="search-query" placeholder="Search for Beers">
    </form>

    <table id="beer-table" class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Brewery</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <c:forEach items="${beers}" var="beer">
            <tr>
              <td><a href="/beers/show/${beer.id}">${beer.name}</a></td>
              <td><a href="/breweries/show/${beer.brewery}">To Brewery</a></td>
              <td>
                <a class="btn btn-small btn-warning" href="/beers/edit/${beer.id}">Edit</a>
                <a class="btn btn-small btn-danger" href="/beers/delete/${beer.id}">Delete</a>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </jsp:body>
</t:layout>
```

We're using [JSP](http://en.wikipedia.org/wiki/JavaServer_Pages) tags to iterate
over the beers and use their properties ( `name` and `id` ) to fill the rows in
the table. On the website you should now see a table with a list of beers with
`Edit` and `Delete` buttons on the right. There is also a link to the associated
brewery that you can click on. Let's implement the delete action next, since its
very easy to do with Couchbase:


```
private void handleDelete(HttpServletRequest request,
  HttpServletResponse response) throws IOException, ServletException, InterruptedException, ExecutionException {

  // Split the Request-Path and get the Beer ID out of it
  String beerId = request.getPathInfo().split("/")[2];

  // Try to delete the document and store the OperationFuture
  OperationFuture<Boolean> delete = client.delete(beerId);

  // If the Future succeeded (returned true), redirect to /beers
  if(delete.get()) {
    response.sendRedirect("/beers");
  }
}
```

The delete method deletes a document from the cluster based on the given
document key. Here, we wait on the `OperationFuture` to return (through the
`get()` method) and if the delete was successful (when `true` is returned), we
redirect to the index action.

Now that we can delete a document, it makes sense to also be able to edit it.
The edit action is very similar to the delete action, but it reads the document
based on the given `ID` instead of deleting it. We also need to parse the String
representation of the JSON document into a Java structure, so we can use it in
the template. We again make use of the excellent Google GSON library to handle
this for us.


```
private void handleEdit(HttpServletRequest request,
    HttpServletResponse response) throws ServletException, IOException {

    // Extract the Beer ID from the URL
    String[] beerId = request.getPathInfo().split("/");

    // If there is a Beer ID
    if(beerId.length > 2) {

      // Read the Document (as a JSON string)
      String document = (String) client.get(beerId[2]);

      HashMap<String, String> beer = null;
      if(document != null) {
        // Convert the String into a HashMap
        beer = gson.fromJson(document, HashMap.class);
        beer.put("id", beerId[2]);

        // Forward the beer to the view
        request.setAttribute("beer", beer);
      }
      request.setAttribute("title", "Modify Beer \"" + beer.get("name") + "\"");
    } else {
      request.setAttribute("title", "Create a new beer");
    }

    request.getRequestDispatcher("/WEB-INF/beers/edit.jsp").forward(request, response);
  }
```

If the document could be successfully loaded, it gets parsed into a `HashMap`
and then forwarded to the edit.jsp template. Also, we define a title variable
that is used inside the template to determine if we want to edit a document or
create a new one (that is when no Beer ID passed to the edit method). Here is
the corresponding edit.jsp template:


```
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<t:layout>
  <jsp:body>
    <h3>${title}</h3>

    <form method="post" action="/beers/edit/${beer.id}">
      <fieldset>
        <legend>General Info</legend>
        <div class="span12">
          <div class="span6">
            <label>Name</label>
            <input type="text" name="beer_name" placeholder="The name of the beer." value="${beer.name}">

            <label>Description</label>
            <input type="text" name="beer_description" placeholder="A short description." value="${beer.description}">
          </div>
          <div class="span6">
            <label>Style</label>
            <input type="text" name="beer_style" placeholder="Bitter? Sweet? Hoppy?" value="${beer.style}">

            <label>Category</label>
            <input type="text" name="beer_category" placeholder="Ale? Stout? Lager?" value="${beer.category}">
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Details</legend>
        <div class="span12">
          <div class="span6">
            <label>Alcohol (ABV)</label>
            <input type="text" name="beer_abv" placeholder="The beer's ABV" value="${beer.abv}">

            <label>Biterness (IBU)</label>
            <input type="text" name="beer_ibu" placeholder="The beer's IBU" value="${beer.ibu}">
          </div>
          <div class="span6">
            <label>Beer Color (SRM)</label>
            <input type="text" name="beer_srm" placeholder="The beer's SRM" value="${beer.srm}">

            <label>Universal Product Code (UPC)</label>
            <input type="text" name="beer_upc" placeholder="The beer's UPC" value="${beer.upc}">
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Brewery</legend>
        <div class="span12">
          <div class="span6">
            <label>Brewery</label>
            <input type="text" name="beer_brewery_id" placeholder="The brewery" value="${beer.brewery_id}">
          </div>
        </div>
      </fieldset>
      <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save changes</button>
      </div>
    </form>
  </jsp:body>
</t:layout>
```

It's a little bit longer, but just because we have lots of fields on our beer
documents. Note how the beer attributes are used inside the value attributes of
the HTML input fields. The unique ID is also used in the form method to dispatch
it to the correct URL on submit.

The last thing we need to implement to make the form submission work is the
actual form parsing and storing itself. Since the form submission happens
through a POST request, we need to implement the `doPost()` method on our
servlet.


```
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

  // Parse the Beer ID
  String beerId = request.getPathInfo().split("/")[2];
  HashMap<String, String> beer = beer = new HashMap<String, String>();
  Enumeration<String> params = request.getParameterNames();

  // Iterate over all POST params
  while(params.hasMoreElements()) {
    String key = params.nextElement();
    if(!key.startsWith("beer_")) {
      continue;
    }
    String value = request.getParameter(key);

    // Store them in a HashMap with key and value
    beer.put(key.substring(5), value);
  }

  // Add two more fields
  beer.put("type", "beer");
  beer.put("updated", new Date().toString());

  // Set (add or override) the document (converted to JSON with GSON)
  client.set(beerId, 0, gson.toJson(beer));

  // Redirect to the show page
  response.sendRedirect("/beers/show/" + beerId);
}
```

The code iterates over all POST fields and stores them in a `HashMap`. We then
use the set command to store the Document inside the cluster and use Google GSON
to translate out `HashMap` to a JSON string. In this case, we could also wait
for a `OperationFuture` response and for example return an error if the set
failed.

The last line redirects to a show method, which just shows all fields of the
document. Since the patterns are the same as before, here is the show method
without any further ado:


```
private void handleShow(HttpServletRequest request,
  HttpServletResponse response) throws IOException, ServletException {

  // Extract the Beer ID
  String beerId = request.getPathInfo().split("/")[2];
  String document = (String) client.get(beerId);
  if(document != null) {
    // Parse the JSON and set it for the template if a document was found
    HashMap<String, String> beer = gson.fromJson(document, HashMap.class);
    request.setAttribute("beer", beer);
  }

  // render the show.jsp template
  request.getRequestDispatcher("/WEB-INF/beers/show.jsp")
    .forward(request, response);
}
```

The ID is again extracted and if a document is found (get returns null when it
can't find a document for the given ID), it gets parsed into a HashMap and
forwarded to the show.jsp template. The templat then just prints out all keys
and values in a table:


```
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<t:layout>
  <jsp:body>
    <h3>Show Details for Beer "${beer.name}"</h3>
    <table class="table table-striped">
      <tbody>
        <c:forEach items="${beer}" var="item">
          <tr>
              <td><strong>${item.key}</strong></td>
              <td>${item.value}</td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
  </jsp:body>
</t:layout>
```

In the index.jsp template, you may have noticed the search box at the top. We
can use to dynamically filter our table based on the user input. We'll use
nearly the same code for it as in the index method, aside from the fact that we
make use of range queries to define a beginning and end to search for.

Before we implement the actual Java method, we need to put the following snippet
inside the `js/beersample.js` file (if you haven't already at the beginning of
the tutorial) to listen on searchbox changes and update the table with the
resulting JSON (which will be returned from the search method):


```
$("#beer-search").keyup(function() {
   var content = $("#beer-search").val();
   if(content.length >= 0) {
       $.getJSON("/beers/search", {"value": content}, function(data) {
           $("#beer-table tbody tr").remove();
           for(var i=0;i<data.length;i++) {
               var html = "<tr>";
               html += "<td><a href=\"/beers/show/"+data[i].id+"\">"+data[i].name+"</a></td>";
               html += "<td><a href=\"/breweries/show/"+data[i].brewery+"\">To Brewery</a></td>";
               html += "<td>";
               html += "<a class=\"btn btn-small btn-warning\" href=\"/beers/edit/"+data[i].id+"\">Edit</a>\n";
               html += "<a class=\"btn btn-small btn-danger\" href=\"/beers/delete/"+data[i].id+"\">Delete</a>";
               html += "</td>";
               html += "</tr>";
               $("#beer-table tbody").append(html);
           }
       });
   }
});
```

The code waits for keyup events on the search field and if they happen does a
AJAX query to the search method on the servlet. The servlet computes the result
and sends it back as JSON. The JavaScript then clears the table, iterates over
the result and creates new rows. The search method looks like this:


```
private void handleSearch(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

  // Exctract the searched value
  String startKey = request.getParameter("value").toLowerCase();

  // Prepare a query against the by_name view
  View view = client.getView("beer", "by_name");
  Query query = new Query();

  // Define the query params
  query.setIncludeDocs(true) // include the full documents
    .setLimit(20) // only show 20 results
    .setRangeStart(ComplexKey.of(startKey)) // Start the search at the given search value
    .setRangeEnd(ComplexKey.of(startKey + "\uefff")); // End the search at the given search plus the unicode "end"

  // Query the view
  ViewResponse result = client.query(view, query);

  ArrayList<HashMap<String, String>> beers = new ArrayList<HashMap<String, String>>();
  // Iterate over the results
  for(ViewRow row : result) {
    // Parse the Document to a HashMap
    HashMap<String, String> parsedDoc = gson.fromJson((String)row.getDocument(), HashMap.class);

      // Create a new Beer out of it
      HashMap<String, String> beer = new HashMap<String, String>();
      beer.put("id", row.getId());
      beer.put("name", parsedDoc.get("name"));
      beer.put("brewery", parsedDoc.get("brewery_id"));
      beers.add(beer);
  }

  // Return a JSON representation of all Beers
  response.setContentType("application/json");
  PrintWriter out = response.getWriter();
  out.print(gson.toJson(beers));
  out.flush();
}
```

You can use the `setRangeStart()` and `setRangeEnd()` methods to define which
key range from the index should be returned. If we've just provded the start
range key, then we'd get all documents starting from our search value. Since we
want only those beginning with the search value, we can use the special
`"\uefff"` UTF-8 character at the end which means "end here". You need to get
used to it in the first place, but its very fast and efficient when accessing
the view.

<a id="wrapping-up"></a>

## Wrapping Up

The tutorial presented an easy approach to start a web application with
Couchbase Server 2.0 as the underlying data source. If you want to dig a little
bit deeper, the full sourcecode on [couchbaselabs on
GitHub](http://github.com/couchbaselabs/beersample-java) has more servlets and
code to learn from. This may be extended and updated from time to time.

Of course, this is only the starting point for Couchbase, but together with the
Getting Started Guide, you should now be well equipped to start exploring
Couchbase Server on your own. Have fun working with Couchbase!

<a id="api-reference-started"></a>

# Using the APIs

The Client libraries provides an interface to both Couchbase and Memcached
clients using a consistent interface. The interface between your Java
application and your Couchbase or Memcached servers is provided through the
instantiation of a single object class, `CouchbaseClient`.

Creating a new object based on this class opens the connection to each
configured server and handles all the communication with the server(s) when
setting, retrieving and updating values. A number of different methods are
available for creating the object specifying the connection address and methods.

<a id="couchbase-sdk-java-started-connection-bucket"></a>

## Connecting to a Couchbase Bucket

You can connect to specific Couchbase buckets (in place of using the default
bucket, or a hostname/port combination configured on the Couchbase cluster) by
using the Couchbase `URI` for one or more Couchbase nodes, and specifying the
bucket name and password (if required) when creating the new `CouchbaseClient`
object.

For example, to connect to the local host and the `default` bucket:


```
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

If you want to use SASL to provide secure connectivity to your Couchbase server
then you could create a `CouchbaseConnectionFactory` that defines the SASL
connection type, userbucket and password.

The connection to Couchbase uses the underlying protocol for SASL. This is
similar to the earlier example except that we use the
`CouchbaseConnectionFactory`.


```
List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactory cf = new
                CouchbaseConnectionFactory(baseURIs,
                    "userbucket", "password");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

<a id="couchbase-sdk-ccfb"></a>

## Setting runtime Parameters for the CouchbaseConnectionFactoryBuilder

A final approach to creating the connection is using the
`CouchbaseConnectionFactoryBuilder` and `CouchbaseConnectionFactory` classes.

It's possible to ovverride some of the default paramters that are defined in the
`CouchbaseConnectionFactoryBuilder` for a variety of reasons and customize the
connection for the session depending on expected load on the server and
potential network traffic.

For example, in the following program snippet, we instatiate a new
`CouchbaseConnectionFactoryBuilder` and use the `setOpTimeout` method to change
the default value to 10000ms (or 10 secs).

We subsequently use the `buildCouchbaseConnection` specifying the bucket name,
password and an username (which is not being used any more) to get a
`CouchbaseConnectionFactory` object. We then create a `CouchbaseClient` object.


```
List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactoryBuilder cfb = new
            CouchbaseConnectionFactoryBuilder();

        // Ovveride default values on CouchbaseConnectionFactoryBuilder

        // For example - wait up to 10 seconds for an operation to succeed
        cfb.setOpTimeout(10000);

        CouchbaseConnectionFactory cf =
            cfb.buildCouchbaseConnection(baseURIs, "default", "", "");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

For example, the following code snippet will set the OpTimeOut value to 10000
secs. before creating the connection as we saw in the code above.


```
cfb.setOpTimeout(10000);
```

These parameters can be set at runtime by setting a property on the command line
(such as *-DopTimeout=1000* ) or via properties in a file *cbclient.properties*
in that order of precedence.

The following parameters can be set as summarized in the table below. We provide
the parameter name, a brief description, the default value and why the
particular parameter might need to be modified.

Parameter                   | Description                                                                                      | Default value    | When to Override the default value                                                                                                                                                                                                                         
----------------------------|--------------------------------------------------------------------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`opTimeout`                 | Time in millisecs for an operation to Timeout                                                    | 2500 millisecs.  | You can set this value higher when there is heavy network traffic and timeouts happen frequently.                                                                                                                                                          
`timeoutExceptionThreshold` | Number of operations to timeout before the node is deemed down                                   | 998              | You can set this value lower to deem a node is down earlier.                                                                                                                                                                                               
`readBufSize`               | Read Buffer Size                                                                                 | 16384            | You can set this value higher or lower to optimize the reads.                                                                                                                                                                                              
`opQueueMaxBlockTime`       | The maximum time to block waiting for op queue operations to complete, in milliseconds.          | 10000 millisecs. | The default has been set with the expectation that most requests are interactive and waiting for more than a few seconds is thus more undesirable than failing the request. However, this value could be lowered for operations not to block for this time.
`shouldOptimize`            | Optimize behavior for the network                                                                | False            | You can set this value to be true if the performance should be optimized for the network as in cases where there are some known issues with the network that may be causing adverse effects on applications.                                               
`maxReconnectDelay`         | Maximum number of milliseconds to wait between reconnect attempts.                               | 30000 millisecs. | You can set this value lower when there is intermittent and frequent connection failures.                                                                                                                                                                  
`MinReconnectInterval`      | A default minimum reconnect interval in millisecs.                                               | 1100             | This means that if a reconnect is needed, it won't try to reconnect more frequently than default value. The internal connections take up to 500ms per request. You can set this to higher to try reconnecting less frequently.                             
`obsPollInterval`           | Wait for the specified interval before the Observe operation polls the nodes.                    | 400              | Set this higher or lower depending on whether the polling needs to happen less or more frequently depending on the tolerance limits for the Observe operation as compared to other operations.                                                             
`obsPollMax`                | The maximum times to poll the master and replica(s) to meet the desired durability requirements. | 10               | You could set this value higher if the Observe operations do not complete after the normal polling.                                                                                                                                                        

<a id="couchbase-sdk-java-started-disconnection"></a>

## Shutting down the Connection

The preferred method for closing a connection is to cleanly shutdown the active
connection with a timeout using the `shutdown()` method with an optional timeout
period and unit specification. The following will shutdown the active connection
to all the configured servers after 60 seconds:


```
client.shutdown(60, TimeUnit.SECONDS);
```

The unit specification relies on the `TimeUnit` object enumerator, which
supports the following values:

Constant                | Description                                                      
------------------------|------------------------------------------------------------------
`TimeUnit.NANOSECONDS`  | Nanoseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s). 
`TimeUnit.MICROSECONDS` | Microseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s).
`TimeUnit.MILLISECONDS` | Milliseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s).
`TimeUnit.SECONDS`      | Seconds.                                                         

The method returns a `boolean` value indicating whether the shutdown request
completed successfully.

You also can shutdown an active connection immediately by using the `shutdown()`
method to your Couchbase object instance. For example:


```
client.shutdown();
```

In this form the `shutdown()` method returns no value.

<a id="api-reference-summary"></a>

# Java Method Summary

The `couchbase-client` and `spymemcached` libraries support the full suite of
API calls to Couchbase. A summary of the supported methods are listed in
**Couldn't resolve xref tag: table-couchbase-sdk-java-summary**.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add** — Add a value with
   the specified key that does not already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist** — Add a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist-replicate**
   — Add a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-replicate** — Add a
   value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-transcoder** — Add a
   value that does not already exist using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append** — Append a
   value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append-transcoder** —
   Append a value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas** —
   Asynchronously compare and set a value —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asynccas-expiry-transcoder** — Asynchronously compare
   and set a value with custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas-transcoder** —
   Asynchronously compare and set a value with custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncdecr** —
   Asynchronously decrement the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat** —
   Asynchronously get a value and update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat-transcoder** —
   Asynchronously get a value and update the expiration time for a given key using
   a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget** —
   Asynchronously get a single key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-bulk** —
   Asynchronously get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys** — Asynchronously get
   multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys-transcoder** — Asynchronously
   get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-transcoder** — Asynchronously get
   multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-transcoder** —
   Asynchronously get a single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl** —
   Asynchronously get a lock. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl-transcoder** —
   Asynchronously get a lock with transcoder. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets** —
   Asynchronously get single key value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets-transcoder** —
   Asynchronously get single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncincr** —
   Asynchronously increment the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas** — Compare and set
   —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-expiry-transcoder**
   — Compare and set with a custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-transcoder** —
   Compare and set with a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr** — Decrement the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default-expiry** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist, with an expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_delete** — Delete the
   specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat** — Get a value and
   update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat-transcoder** — Get a
   value and update the expiration time for a given key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get** — Get a single key
   —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-and-lock** — Get and
   lock Asynchronously —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-and-lock-transcoder** — Get and lock —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk** — Get
   multiple keys —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-multikeys** —
   Get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-bulk-multikeys-transcoder** — Get multiple keys
   using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-transcoder** —
   Get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-transcoder** — Get a
   single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets** — Get single key
   value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets-transcoder** — Get
   single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats** — Get the
   statistics from all connections —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats-name** — Get
   the statistics from all connections —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getview** — Create a
   view object —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr** — Increment the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default-expiry** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_new\_couchbaseclient** —
   Create connection to Couchbase Server —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend** — Prepend a
   value to an existing key using the default transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend-transcoder** —
   Prepend a value to an existing key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_query** — Query a view —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_query-new** — Create a
   query object —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace** — Update an
   existing key with a new value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-persist** —
   Replace a value using the specified key and observe it being persisted on master
   and more node(s). —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_replace-persist-replicate** — Replace a value using
   the specified key and observe it being persisted on master and more node(s) and
   being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-replicate** —
   Replace a value using the specified key and observe it being replicated to one
   or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-transcoder** —
   Update an existing key with a new value using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set** — Store a value
   using the specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist** — Store a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist-replicate**
   — Store a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-replicate** — Store
   a value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-transcoder** — Store
   a value using the specified key and a custom transcoder. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_touch** — Update the
   expiry time of an item —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_unlock** — Unlock —

<a id="couchbase-sdk-java-summary-synchronous"></a>

## Synchronous Method Calls

The Java Client Libraries support the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the `get()` is a synchronous operation:


```
Object myObject = client.get("someKey");
```

In the example code above, the client `get()` call will wait until a response
has been received from the appropriately configured Couchbase servers before
returning the required value or an exception.

A list of the synchronous methods are shown in **Couldn't resolve xref tag:
table-couchbase-sdk-java-summary-sync**.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append** — Append a
   value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append-transcoder** —
   Append a value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas** — Compare and set
   —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-expiry-transcoder**
   — Compare and set with a custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-transcoder** —
   Compare and set with a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr** — Decrement the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default-expiry** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist, with an expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat** — Get a value and
   update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat-transcoder** — Get a
   value and update the expiration time for a given key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get** — Get a single key
   —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-and-lock-transcoder** — Get and lock —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk** — Get
   multiple keys —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-multikeys** —
   Get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-bulk-multikeys-transcoder** — Get multiple keys
   using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-transcoder** —
   Get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-transcoder** — Get a
   single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets** — Get single key
   value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets-transcoder** — Get
   single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats** — Get the
   statistics from all connections —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats-name** — Get
   the statistics from all connections —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getview** — Create a
   view object —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr** — Increment the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default-expiry** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_new\_couchbaseclient** —
   Create connection to Couchbase Server —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_query** — Query a view —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_query-new** — Create a
   query object —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_unlock** — Unlock —

<a id="couchbase-sdk-java-summary-asynchronous"></a>

## Asynchronous Method Calls

In addition, the librares also support a range of asynchronous methods that can
be used to store, update and retrieve values without having to explicitly wait
for a response.

The asynchronous methods use a *Future* object or its appropriate implementation
which is returned by the initial method call for the operation. The
communication with the Couchbase server will be handled by the client libraries
in the background so that the main program loop can continue. You can recover
the status of the operation by using a method to check the status on the
returned Future object. For example, rather than synchronously getting a key, an
asynchronous call might look like this:


```
GetFuture getOp = client.asyncGet("someKey");
```

A list of the asynchronous methods are shown in **Couldn't resolve xref tag:
table-couchbase-sdk-java-summary-async**.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add** — Add a value with
   the specified key that does not already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist** — Add a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist-replicate**
   — Add a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-replicate** — Add a
   value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-transcoder** — Add a
   value that does not already exist using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas** —
   Asynchronously compare and set a value —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asynccas-expiry-transcoder** — Asynchronously compare
   and set a value with custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas-transcoder** —
   Asynchronously compare and set a value with custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncdecr** —
   Asynchronously decrement the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat** —
   Asynchronously get a value and update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat-transcoder** —
   Asynchronously get a value and update the expiration time for a given key using
   a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget** —
   Asynchronously get a single key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-bulk** —
   Asynchronously get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys** — Asynchronously get
   multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys-transcoder** — Asynchronously
   get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-transcoder** — Asynchronously get
   multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-transcoder** —
   Asynchronously get a single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl** —
   Asynchronously get a lock. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl-transcoder** —
   Asynchronously get a lock with transcoder. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets** —
   Asynchronously get single key value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets-transcoder** —
   Asynchronously get single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncincr** —
   Asynchronously increment the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_delete** — Delete the
   specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-and-lock** — Get and
   lock Asynchronously —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend** — Prepend a
   value to an existing key using the default transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend-transcoder** —
   Prepend a value to an existing key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace** — Update an
   existing key with a new value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-persist** —
   Replace a value using the specified key and observe it being persisted on master
   and more node(s). —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_replace-persist-replicate** — Replace a value using
   the specified key and observe it being persisted on master and more node(s) and
   being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-replicate** —
   Replace a value using the specified key and observe it being replicated to one
   or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-transcoder** —
   Update an existing key with a new value using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set** — Store a value
   using the specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist** — Store a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist-replicate**
   — Store a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-replicate** — Store
   a value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-transcoder** — Store
   a value using the specified key and a custom transcoder. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_touch** — Update the
   expiry time of an item —

This will populate the Future object `GetFuture` with the response from the
server. The Future object class is defined
[here](http://download.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/Future.html?is-external=true).
The primary methods are:

 * `cancel()`

   Attempts to Cancel the operation if the operation has not already been
   completed.

 * `get()`

   Waits for the operation to complete. Gets the object returned by the operation
   as if the method was synchronous rather than asynchronous.

 * `get(timeout, TimeUnit)`

   Gets the object waiting for a maximum time specified by `timeout` and the
   corresponding `TimeUnit`.

 * `isDone()`

   The operation has been completed successfully.

For example, you can use the timeout method to obtain the value or cancel the
operation:


```
GetFuture getOp = client.asyncGet("someKey");

Object myObj;

try {
    myObj = getOp.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    getOp.cancel(false);
}
```

Alternatively, you can do a blocking wait for the response by using the `get()`
method:


```
Object myObj;

myObj = getOp.get();
```

<a id="couchbase-sdk-java-summary-transcoding"></a>

## Object Serialization (Transcoding)

All of the Java client library methods use the default Whalin transcoder that
provides compatilibility with memcached clients for the serialization of objects
from the object type into a byte array used for storage within Couchbase.

You can also use a custom transcoder the serialization of objects. This can be
to serialize objects in a format that is compatible with other languages or
environments.

You can customize the transcoder by implementing a new Transcoder interface and
then using this when storing and retrieving values. The Transcoder will be used
to encode and decode objects into binary strings. All of the methods that store,
retrieve or update information have a version that supports a custom transcoder.

<a id="couchbase-sdk-java-summary-expiry"></a>

## Expiry Values

All values in Couchbase and Memcached can be set with an expiry value. The
expiry value indicates when the item should be expired from the database and can
be set when an item is added or updated.

Within `spymemcached` the expiry value is expressed in the native form of an
integer as per the Memcached protocol specification. The integer value is
expressed as the number of seconds, but the interpretation of the value is
different based on the value itself:

 * Expiry is less than `30*24*60*60` (30 days)

   The value is interpreted as the number of seconds from the point of storage or
   update.

 * Expiry is greater than `30*24*60*60`

   The value is interpreted as the number of seconds from the epoch (January 1st,
   1970).

 * Expiry is 0

   This disables expiry for the item.

For example:


```
client.set("someKey", 3600, someObject);
```

The value will have an expiry time of 3600 seconds (one hour) from the time the
item was stored.

The statement:


```
client.set("someKey", 1307458800, someObject);
```

Will set the expiry time as June 7th 2011, 15:00 (UTC).

<a id="api-reference-connection"></a>

# Connection Operations

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_new\_couchbaseclient** —
   Create connection to Couchbase Server —

 * **API Call** — `new CouchbaseClient([ url ] [, urls ] [, username ] [, password
   ])`

 * **Asynchronous** — no

 * **Description** — Create a connection to Couchbase Server with given parameters,
   such as node URL. Most SDKs accept a list of possible URL's to avoid an error in
   case one node is down. After initial connection a Couchbase Client uses node
   topology provided by Couchbase Server to reconnect after failover or rebalance.

 * **Returns** — (none)

 * **Arguments** —

 * **String url** — URL for Couchbase Server Instance, or node.

 * **String urls** — Linked list containing one or more URLs as strings.

 * **String username** — Username for Couchbase bucket.

 * **String password** — Password for Couchbase bucket.

<a id="api-reference-set"></a>

# Store Operations

The Couchbase Java Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add** — Add a value with
   the specified key that does not already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist** — Add a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-persist-replicate**
   — Add a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-replicate** — Add a
   value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_add-transcoder** — Add a
   value that does not already exist using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace** — Update an
   existing key with a new value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-persist** —
   Replace a value using the specified key and observe it being persisted on master
   and more node(s). —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_replace-persist-replicate** — Replace a value using
   the specified key and observe it being persisted on master and more node(s) and
   being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-replicate** —
   Replace a value using the specified key and observe it being replicated to one
   or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_replace-transcoder** —
   Update an existing key with a new value using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set** — Store a value
   using the specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist** — Store a
   value using the specified key and observe it being persisted on master and more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-persist-replicate**
   — Store a value using the specified key and observe it being persisted on master
   and more node(s) and being replicated to one or more node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-replicate** — Store
   a value using the specified key and observe it being replicated to one or more
   node(s). —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_set-transcoder** — Store
   a value using the specified key and a custom transcoder. —

<a id="couchbase-sdk-java-set-add"></a>

## Add Operations

The `add()` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

 * **API Call** — `add(key, expiry, value)`

 * **Asynchronous** — yes

 * **Description** — Add a value with the specified key that does not already
   exist. Will fail if the key/value pair already exist.

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

The `add()` method adds a value to the database using the specified key.


```
client.add("someKey", 0, someObject);
```

Unlike [Set
Operations](couchbase-sdk-java-ready.html#couchbase-sdk-java-set-set) the
operation can fail (and return false) if the specified key already exists.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will have set the key:


```
OperationFuture<Boolean> addOp = client.add("someKey",0,"astring");
System.out.printf("Result was %b",addOp.get());
addOp =  client.add("someKey",0,"anotherstring");
System.out.printf("Result was %b",addOp.get());
```

 * **API Call** — `add(key, expiry, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Add a value with the specified key that does not already
   exist. Will fail if the key/value pair already exist.

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

This method is identical to the `add()` method, but supports the use of a custom
transcoder for serialization of the object value. For more information on
transcoding, see [Object Serialization
(Transcoding)](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-set"></a>

## Set Operations

The `set()` operations store a value into Couchbase or Memcached using the
specified key and value. The value is stored against the specified key, even if
the key already exists and has data. This operation overwrites the existing with
the new data. The store operation in this case is asynchronous.

 * **API Call** — `set(key, expiry, value)`

 * **Asynchronous** — yes

 * **Description** — Store a value using the specified key, whether the key already
   exists or not. Will overwrite a value if the given key/value already exists.

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

The first form of the `set()` method stores the key, sets the expiry (use 0 for
no expiry), and the corresponding object value using the built in transcoder for
serialization.

The simplest form of the command is:


```
client.set("someKey", 3600, someObject);
```

The `Boolean` return value from the asynchronous operation return value will be
true if the value was stored. For example:


```
OperationFuture<Boolean> setOp = client.set("someKey",0,"astring");
System.out.printf("Result was %b",setOp.get());
```

 * **API Call** — `set(key, expiry, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Store a value using the specified key and a custom transcoder.

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `set()` method supports the use of a custom transcoder
for serialization of the object value. For more information on transcoding, see
[Object Serialization
(Transcoding)](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-durability"></a>

## Store Operations with Durability Requirements

 * **API Call** — `set(key, expiry, value, persistto)`

 * **Asynchronous** — yes

 * **Description** — Store a value using the specified key and observe it being
   persisted on master and more node(s).

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **enum persistto** — Specify the number of nodes on which the document must be
   persisted to before returning.

 * **API Call** — `set(key, expiry, value, replicateto)`

 * **Asynchronous** — yes

 * **Description** — Store a value using the specified key and observe it being
   replicated to one or more node(s).

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **enum replicateto** — Specify the number of nodes on which the document must be
   replicated to before returning

 * **API Call** — `set(key, expiry, value, persistto, replicateto)`

 * **Asynchronous** — yes

 * **Description** — Store a value using the specified key and observe it being
   persisted on master and more node(s) and being replicated to one or more
   node(s).

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **enum persistto** — Specify the number of nodes on which the document must be
   persisted to before returning.

 * **enum replicateto** — Specify the number of nodes on which the document must be
   replicated to before returning

This method is identical to the `set()` method, but supports the ability to
observe the persistence on the master and replicas and the propagation to the
replicas. Using these methods above, it's possible to set the persistence
requirements for the data on the nodes.

The persistence requirements can be specified in terms of how the data should be
persisted on the master and the replicas using `PeristTo` and how the data
should be propagated to the replicas using `ReplicateTo` respectively.

The client library will poll the server until the persistence requirements are
met. The method will return FALSE if the requirments are impossible to meet
based on the configuration (inadequate number of replicas) or even after a set
amount of retries the persistence requirments could not be met.

The program snippet below illustrates how to specify a requirement that the data
should be persisted on 4 nodes (master and three replicas).


```
// Perist to all four nodes including master
OperationFuture<Boolean> setOp =
   c.set("key", 0, "value", PersistTo.FOUR);
System.out.printf("Result was %b", setOp.get());
```

The peristence requirements can be specified for both the master and replicas.
In the case above, it's required that the key and value is persisted on all the
4 nodes (including replicas).

In the following, the requirement is specified as requiring persistence to the
master and propagation of the data to the three replicas. This requirment is
weaker than requring the data to be persisted on all four nodes including the
three replicas.


```
// Perist to master and propagate the data to three replicas
OperationFuture<Boolean> setOp =
   c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
System.out.printf("Result was %b", setOp.get());
```

Similar requirements can used with the *add()* and *replace()* mutation
operations.

<a id="api-reference-retrieve"></a>

# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat** —
   Asynchronously get a value and update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgat-transcoder** —
   Asynchronously get a value and update the expiration time for a given key using
   a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget** —
   Asynchronously get a single key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-bulk** —
   Asynchronously get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys** — Asynchronously get
   multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-multikeys-transcoder** — Asynchronously
   get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asyncget-bulk-transcoder** — Asynchronously get
   multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncget-transcoder** —
   Asynchronously get a single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl** —
   Asynchronously get a lock. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgetl-transcoder** —
   Asynchronously get a lock with transcoder. —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets** —
   Asynchronously get single key value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncgets-transcoder** —
   Asynchronously get single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat** — Get a value and
   update the expiration time for a given key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gat-transcoder** — Get a
   value and update the expiration time for a given key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get** — Get a single key
   —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-and-lock** — Get and
   lock Asynchronously —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-and-lock-transcoder** — Get and lock —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk** — Get
   multiple keys —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-multikeys** —
   Get multiple keys —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_get-bulk-multikeys-transcoder** — Get multiple keys
   using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-transcoder** —
   Get multiple keys using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_get-transcoder** — Get a
   single key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets** — Get single key
   value with CAS value —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_gets-transcoder** — Get
   single key value with CAS value using custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_unlock** — Unlock —

<a id="couchbase-sdk-java-retrieve-get"></a>

## Synchronous get Methods

The synchronous `get()` methods allow for direct access to a given key/value
pair.

 * **API Call** — `get(key)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `Object` ( Binary object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

The `get()` method obtains an object stored in Couchbase using the default
transcoder for serialization of the object.

For example:


```
Object myObject = client.get("someKey");
```

Transcoding of the object assumes the default transcoder was used when the value
was stored. The returned object can be of any type.

If the request key does no existing in the database then the returned value is
null.

 * **API Call** — `get(key, transcoder)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `T` ( Transcoded object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `get()` retrieves a value from Couchbase using a custom
transcoder.

For example to obtain an integer value using the IntegerTranscoder:


```
Transcoder<Integer> tc = new IntegerTranscoder();
Integer ic = client.get("someKey", tc);
```

<a id="couchbase-sdk-java-retrieve-get-async"></a>

## Asynchronous get Methods

The asynchronous `asyncGet()` methods allow to retrieve a given value for a key
without waiting actively for a response.

 * **API Call** — `asyncGet(key)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `Future<Object>` ( Asynchronous request value, as Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **Exceptions** —

 * `TimeoutException` — Value could not be retrieved

The first form of the `asyncGet()` method obtains a value for a given key
returning a Future object so that the value can be later retrieved. For example,
to get a key with a stored String value:


```
GetFuture<Object> getOp =
    client.asyncGet("samplekey");

String username;

try {
    username = (String) getOp.get(5, TimeUnit.SECONDS);
} catch(Exception e) {
    getOp.cancel(false);
}
```

 * **API Call** — `asyncGet(key, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `Future<T>` ( Asynchronous request value, as Transcoded Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form is identical to the first, but includes the ability to use a
custom transcoder on the stored value.

<a id="couchbase-sdk-java-retrieve-gat"></a>

## Get-and-Touch Methods

The Get-and-Touch (GAT) methods obtain a value for a given key and update the
expiry time for the key. This can be useful for session values and other
information where you want to set an expiry time, but don't want the value to
expire while the value is still in use.

 * **API Call** — `getAndTouch(key, expiry)`

 * **Asynchronous** — no

 * **Description** — Get a value and update the expiration time for a given key

 * **Introduced Version** — 1.0

 * **Returns** — `CASValue` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

The first form of the `getAndTouch()` obtains a given value and updates the
expiry time. For example, to get session data and renew the expiry time to five
minutes:


```
session = client.getAndTouch("sessionid",300);
```

 * **API Call** — `getAndTouch(key, expiry, transcoder)`

 * **Asynchronous** — no

 * **Description** — Get a value and update the expiration time for a given key

 * **Introduced Version** — 1.0

 * **Returns** — `CASValue` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form supports the use of a custom transcoder for the stored value
information.

 * **API Call** — `asyncGetAndTouch(key, expiry)`

 * **Asynchronous** — yes

 * **Description** — Get a value and update the expiration time for a given key

 * **Introduced Version** — 1.0

 * **Returns** — `Future<CASValue<Object>>` ( Asynchronous request value, as
   CASValue, as Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

The asynchronous methods obtain the value and update the expiry time without
requiring you to actively wait for the response. The returned value is a CAS
object with the embedded value object.


```
Future<CASValue<Object>> future = client.asyncGetAndTouch("sessionid", 300);

CASValue casv;

try {
    casv = future.get(5, TimeUnit.SECONDS);
} catch(Exception e) {
    future.cancel(false);
}
```

 * **API Call** — `asyncGetAndTouch(key, expiry, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Get a value and update the expiration time for a given key

 * **Introduced Version** — 1.0

 * **Returns** — `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as
   Transcoded object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the asynchronous method supports the use of a custom
transcoder for the stored object.

<a id="couchbase-sdk-java-retrieve-gets"></a>

## CAS get Methods

The `gets()` methods obtain a CAS value for a given key. The CAS value is used
in combination with the corresponding Check-and-Set methods when updating a
value. For example, you can use the CAS value with the `append()` operation to
update a value only if the CAS value you supply matches. For more information
see [Append
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-update-append) and
[Check-and-Set
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-update-cas).

 * **API Call** — `gets(key)`

 * **Asynchronous** — no

 * **Description** — Get single key value with CAS value

 * **Returns** — `CASValue` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

The `gets()` method obtains a `CASValue` for a given key. The CASValue holds the
CAS to be used when performing a Check-And-Set operation, and the corresponding
value for the given key.

For example, to obtain the CAS and value for the key `someKey` :


```
CASValue status = client.gets("someKey");
System.out.printf("CAS is %s\n",status.getCas());
System.out.printf("Result was %s\n",status.getValue());
```

The CAS value can be used in a CAS call such as `append()` :


```
client.append(status.getCas(),"someKey", "appendedstring");
```

 * **API Call** — `gets(key, transcoder)`

 * **Asynchronous** — no

 * **Description** — Get single key value with CAS value

 * **Returns** — `CASValue` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `gets()` method supports the use of a custom transcoder.

 * **API Call** — `asyncGets(key)`

 * **Asynchronous** — yes

 * **Description** — Get single key value with CAS value

 * **Returns** — `Future<CASValue<Object>>` ( Asynchronous request value, as
   CASValue, as Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

The `asyncGets()` method obtains the `CASValue` object for a stored value
against the specified key, without requiring an explicit wait for the returned
value.

For example:


```
Future<CASValue<Object>> future = client.asyncGets("someKey");

System.out.printf("CAS is %s\n",future.get(5,TimeUnit.SECONDS).getCas());
```

Note that you have to extract the CASValue from the Future response, and then
the CAS value from the corresponding object. This is performed here in a single
statement.

 * **API Call** — `asyncGets(key, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Get single key value with CAS value

 * **Returns** — `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as
   Transcoded object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The final form of the `asyncGets()` method supports the use of a custom
transcoder.

<a id="couchbase-sdk-java-retrieve-bulk"></a>

## Bulk get Methods

The bulk `getBulk()` methods allow you to get one or more items from the
database in a single request. Using the bulk methods is more efficient than
multiple single requests as the operation can be conducted in a single network
call.

 * **API Call** — `getBulk(keycollection)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `Map<String,Object>` ( Map of Strings/Objects )

 * **Arguments** —

 * **Collection<String> keycollection** — One or more keys used to reference a
   value

The first format accepts a `String`  `Collection` as the request argument which
is used to specify the list of keys that you want to retrieve. The return type
is `Map` between the keys and object values.

For example:


```
Map<String,Object> keyvalues = client.getBulk(keylist);

System.out.printf("A is %s\n",keyvalues.get("keyA"));
System.out.printf("B is %s\n",keyvalues.get("keyB"));
System.out.printf("C is %s\n",keyvalues.get("keyC"));
```

The returned map will only contain entries for keys that exist from the original
request. For example, if you request the values for three keys, but only one
exists, the resultant map will contain only that one key/value pair.

 * **API Call** — `getBulk(keycollection, transcoder)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `Map<String,T>` ( Map of Strings/Transcoded objects )

 * **Arguments** —

 * **Collection<String> keycollection** — One or more keys used to reference a
   value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `getBulk()` method supports the same `Collection`
argument, but also supports the use of a custom transcoder on the returned
values.

The specified transcoder will be used for every value requested from the
database.

 * **API Call** — `getBulk(keyn)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `Map<String,Object>` ( Map of Strings/Objects )

 * **Arguments** —

 * **String... keyn** — One or more keys used to reference a value

The third form of the `getBulk()` method supports a variable list of arguments
with each interpreted as the key to be retrieved from the database.

For example, the equivalent of the `Collection` method operation using this
method would be:


```
Map<String,Object> keyvalues = client.getBulk("keyA","keyB","keyC");

System.out.printf("A is %s\n",keyvalues.get("keyA"));
System.out.printf("B is %s\n",keyvalues.get("keyB"));
System.out.printf("C is %s\n",keyvalues.get("keyC"));
```

The return `Map` will only contain entries for keys that exist. Non-existent
keys will be silently ignored.

 * **API Call** — `getBulk(transcoder, keyn)`

 * **Asynchronous** — no

 * **Description** — Get one or more key values

 * **Returns** — `Map<String,T>` ( Map of Strings/Transcoded objects )

 * **Arguments** —

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

 * **String... keyn** — One or more keys used to reference a value

The fourth form of the `getBulk()` method uses the variable list of arguments
but supports a custom transcoder.

Note that unlike other formats of the methods used for supporting custom
transcoders, the transcoder specification is at the start of the argument list,
not the end.

 * **API Call** — `asyncGetBulk(keycollection)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )

 * **Arguments** —

 * **Collection<String> keycollection** — One or more keys used to reference a
   value

The asynchronous `getBulk()` method supports a `Collection` of keys to be
retrieved, returning a BulkFuture object (part of the `spymemcached` package)
with the returned map of key/value information. As with other asynchronous
methods, the benefit is that you do not need to actively wait for the response.

The `BulkFuture` object operates slightly different in context to the standard
`Future` object. Whereas the `Future` object gets a returned single value, the
`BulkFuture` object will return an object containing as many keys as have been
returned. For very large queries requesting large numbers of keys this means
that multiple requests may be required to obtain every key from the original
list.

For example, the code below will obtain as many keys as possible from the
supplied `Collection`.


```
BulkFuture<Map<String,Object>> keyvalues = client.asyncGetBulk(keylist);

Map<String,Object> keymap = keyvalues.getSome(5,TimeUnit.SECONDS);

System.out.printf("A is %s\n",keymap.get("keyA"));
System.out.printf("B is %s\n",keymap.get("keyB"));
System.out.printf("C is %s\n",keymap.get("keyC"));
```

 * **API Call** — `asyncGetBulk(keycollection, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )

 * **Arguments** —

 * **Collection<String> keycollection** — One or more keys used to reference a
   value

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the asynchronous `getBulk()` method supports the custom
transcoder for the returned values.

 * **API Call** — `asyncGetBulk(keyn)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )

 * **Arguments** —

 * **String... keyn** — One or more keys used to reference a value

The third form is identical to the multi-argument key request method (see
**Couldn't resolve link tag: table-couchbase-sdk\_java\_get-bulk-multikeys** ),
except that the operation occurs asynchronously.

 * **API Call** — `asyncGetBulk(transcoder, keyn)`

 * **Asynchronous** — yes

 * **Description** — Get one or more key values

 * **Returns** — `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )

 * **Arguments** —

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

 * **String... keyn** — One or more keys used to reference a value

The final form of the `asyncGetBulk()` method supports a custom transcoder with
the variable list of keys supplied as arguments.

<a id="couchbase-sdk-java-retrieve-get-and-lock"></a>

## Get and Lock

 * **API Call** — `asyncGetLock(key [, getl-expiry ], transcoder)`

 * **Asynchronous** — yes

 * **Description** — Get the value for a key, lock the key from changes

 * **Returns** — `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as
   Transcoded object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int getl-expiry** — Expiry time for lock

 * — **Default** — 15 —

 * — **Maximum** — 30 —

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

 * **API Call** — `asyncGetLock(key [, getl-expiry ])`

 * **Asynchronous** — yes

 * **Description** — Get the value for a key, lock the key from changes

 * **Returns** — `Future<CASValue<Object>>` ( Asynchronous request value, as
   CASValue, as Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int getl-expiry** — Expiry time for lock

 * — **Default** — 15 —

 * — **Maximum** — 30 —

 * **API Call** — `getAndLock(key [, getl-expiry ], transcoder)`

 * **Asynchronous** — no

 * **Description** — Get the value for a key, lock the key from changes

 * **Returns** — `CASValue<T>` ( CASValue as Transcoded object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int getl-expiry** — Expiry time for lock

 * — **Default** — 15 —

 * — **Maximum** — 30 —

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

 * **Exceptions** —

 * `OperationTimeoutException` — Exception timeout occured while waiting for value.

 * `RuntimeException` — Exception object specifying interruption while waiting for
   value.

The simplest form of the method is without the transcoder as below.

 * **API Call** — `getAndLock(key [, getl-expiry ])`

 * **Asynchronous** — yes

 * **Description** — Get the value for a key, lock the key from changes

 * **Returns** — `CASValue<Object>` ( CASValue as Object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int getl-expiry** — Expiry time for lock

 * — **Default** — 15 —

 * — **Maximum** — 30 —

 * **Exceptions** —

 * `OperationTimeoutException` — Exception timeout occured while waiting for value.

 * `RuntimeException` — Exception object specifying interruption while waiting for
   value.


```
CASValue<Object> casv = client.getAndLock("keyA", 3);
```

Will lock keyA for 3 seconds or until an Unlock is issued.

<a id="couchbase-sdk-java-retrieve-unlock"></a>

## Unlock

 * **API Call** — `unlock(key, casunique)`

 * **Asynchronous** — no

 * **Description** — Unlock a previously locked key by providing the corresponding
   CAS value that was returned during the lock

 * **Returns** — `Boolean` ( Boolean (true/false) )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **Exceptions** —

 * `InterruptedException` — Interrupted Exception while waiting for value.

 * `OperationTimeoutException` — Exception timeout occured while waiting for value.

 * `RuntimeException` — Exception object specifying interruption while waiting for
   value.


```
CASValue<Object> casv = client.getAndLock("keyA", 3);
//Use CAS Value to Unlock
client.unlock("getunltest", casv.getCas());
```

<a id="api-reference-update"></a>

# Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append** — Append a
   value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_append-transcoder** —
   Append a value to an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas** —
   Asynchronously compare and set a value —

 * **Couldn't resolve link tag:
   table-couchbase-sdk\_java\_asynccas-expiry-transcoder** — Asynchronously compare
   and set a value with custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asynccas-transcoder** —
   Asynchronously compare and set a value with custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncdecr** —
   Asynchronously decrement the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_asyncincr** —
   Asynchronously increment the value of an existing key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas** — Compare and set
   —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-expiry-transcoder**
   — Compare and set with a custom transcoder and expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_cas-transcoder** —
   Compare and set with a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr** — Decrement the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_decr-default-expiry** —
   Decrement the value of a key, setting the initial value if the key didn't
   already exist, with an expiry —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_delete** — Delete the
   specified key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr** — Increment the
   value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_incr-default-expiry** —
   Increment the value of an existing numeric key —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend** — Prepend a
   value to an existing key using the default transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_prepend-transcoder** —
   Prepend a value to an existing key using a custom transcoder —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_touch** — Update the
   expiry time of an item —

<a id="couchbase-sdk-java-update-append"></a>

## Append Methods

The `append()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `append()` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding an `Array` of integers into the database, and then
using `append()` to add another integer will result in the key referring to a
serialized version of the array, immediately followed by a serialized version of
the integer. It will not contain an updated array with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

 * **API Call** — `append(casunique, key, value)`

 * **Asynchronous** — no

 * **Description** — Append a value to an existing key

 * **Returns** — `Object` ( Binary object )

 * **Arguments** —

 * **long casunique** — Unique value used to verify a key/value combination

 * **String key** — Document ID used to identify the value

 * **Object value** — Value to be stored

The `append()` appends information to the end of an existing key/value pair. The
`append()` function requires a CAS value. For more information on CAS values,
see [CAS get
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-retrieve-gets).

For example, to append a string to an existing key:


```
CASValue<Object> casv = client.gets("samplekey");
client.append(casv.getCas(),"samplekey", "appendedstring");
```

You can check if the append operation succeeded by using the return
`OperationFuture` value:


```
OperationFuture<Boolean> appendOp =
    client.append(casv.getCas(),"notsamplekey", "appendedstring");

try {
    if (appendOp.get().booleanValue()) {
        System.out.printf("Append succeeded\n");
    }
    else {
        System.out.printf("Append failed\n");
    }
}
catch (Exception e) {
...
}
```

 * **API Call** — `append(casunique, key, value, transcoder)`

 * **Asynchronous** — no

 * **Description** — Append a value to an existing key

 * **Returns** — `Object` ( Binary object )

 * **Arguments** —

 * **long casunique** — Unique value used to verify a key/value combination

 * **String key** — Document ID used to identify the value

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `append()` method supports the use of custom transcoder.

<a id="couchbase-sdk-java-update-prepend"></a>

## Prepend Methods

The `prepend()` methods insert information before the existing data for a given
key. Note that as with the `append()` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend()`.

 * **API Call** — `prepend(casunique, key, value)`

 * **Asynchronous** — yes

 * **Description** — Prepend a value to an existing key

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **long casunique** — Unique value used to verify a key/value combination

 * **String key** — Document ID used to identify the value

 * **Object value** — Value to be stored

The `prepend()` inserts information before the existing data stored in the
key/value pair. The `prepend()` function requires a CAS value. For more
information on CAS values, see [CAS get
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-retrieve-gets).

For example, to prepend a string to an existing key:


```
CASValue<Object> casv = client.gets("samplekey");
client.prepend(casv.getCas(),"samplekey", "prependedstring");
```

You can check if the prepend operation succeeded by using the return
`OperationFuture` value:


```
OperationFuture<Boolean> prependOp =
    client.prepend(casv.getCas(),"notsamplekey", "prependedstring");

try {
    if (prependOp.get().booleanValue()) {
        System.out.printf("Prepend succeeded\n");
    }
    else {
        System.out.printf("Prepend failed\n");
    }
}
catch (Exception e) {
...
}
```

 * **API Call** — `prepend(casunique, key, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Prepend a value to an existing key

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **long casunique** — Unique value used to verify a key/value combination

 * **String key** — Document ID used to identify the value

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The secondary form of the `prepend()` method supports the use of a custom
transcoder for updating the key/value pair.

<a id="couchbase-sdk-java-update-cas"></a>

## Check-and-Set Methods

The check-and-set methods provide a mechanism for updating information only if
the client knows the check (CAS) value. This can be used to prevent clients from
updating values in the database that may have changed since the client obtained
the value. Methods for storing and updating information support a CAS method
that allows you to ensure that the client is updating the version of the data
that the client retrieved.

The check value is in the form of a 64-bit integer which is updated every time
the value is modified, even if the update of the value does not modify the
binary data. Attempting to set or update a key/value pair where the CAS value
does not match the value stored on the server will fail.

The `cas()` methods are used to explicitly set the value only if the CAS
supplied by the client matches the CAS on the server, analogous to the [Set
Operations](couchbase-sdk-java-ready.html#couchbase-sdk-java-set-set) method.

With all CAS operations, the `CASResponse` value returned indicates whether the
operation succeeded or not, and if not why. The `CASResponse` is an `Enum` with
three possible values:

 * `EXISTS`

   The item exists, but the CAS value on the database does not match the value
   supplied to the CAS operation.

 * `NOT_FOUND`

   The specified key does not exist in the database. An `add()` method should be
   used to add the key to the database.

 * `OK`

   The CAS operation was successful and the updated value is stored in Couchbase

 * **API Call** — `cas(key, casunique, value)`

 * **Asynchronous** — no

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `CASResponse` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **Object value** — Value to be stored

The first form of the `cas()` method allows for an item to be set in the
database only if the CAS value supplied matches that stored on the server.

For example:


```
CASResponse casr = client.cas("caskey", casvalue, "new string value");

if (casr.equals(CASResponse.OK)) {
    System.out.println("Value was updated");
}
else if (casr.equals(CASResponse.NOT_FOUND)) {
    System.out.println("Value is not found");
}
else if (casr.equals(CASResponse.EXISTS)) {
    System.out.println("Value exists, but CAS didn't match");
}
```

 * **API Call** — `cas(key, casunique, value, transcoder)`

 * **Asynchronous** — no

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `CASResponse` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the method supports using a custom transcoder for storing a
value.

 * **API Call** — `cas(key, casunique, expiry, value, transcoder)`

 * **Asynchronous** — no

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `CASResponse` ( Check and set object )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

This form of the `cas()` method updates both the key value and the expiry time
for the value. For information on expiry values, see [Expiry
Values](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-expiry).

For example the following attempts to set the key `caskey` with an updated
value, setting the expiry times to 3600 seconds (one hour).


```
Transcoder<Integer> tc = new IntegerTranscoder();
CASResponse casr = client.cas("caskey", casvalue, 3600, 1200, tc);
```

 * **API Call** — `asyncCAS(key, casunique, value)`

 * **Asynchronous** — yes

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `Future<CASResponse>` ( Asynchronous request value, as CASResponse
   )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **Object value** — Value to be stored

Performs an asynchronous CAS operation on the given key/value. You can use this
method to set a value using CAS without waiting for the response. The following
example requests an update of a key, timing out after 5 seconds if the operation
was not successful.


```
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, "updatedvalue");

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

 * **API Call** — `asyncCAS(key, casunique, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `Future<CASResponse>` ( Asynchronous request value, as CASResponse
   )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

Performs an asynchronous CAS operation on the given key/value using a custom
transcoder. The example below shows the update of an existing value using a
custom Integer transcoder.


```
Transcoder<Integer> tc = new IntegerTranscoder();
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 1200, tc);

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

 * **API Call** — `asyncCAS(key, casunique, expiry, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Compare and set a value providing the supplied CAS key matches

 * **Returns** — `Future<CASResponse>` ( Asynchronous request value, as CASResponse
   )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **long casunique** — Unique value used to verify a key/value combination

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The final form of the `asyncCAS()` method supports a custom transcoder and
setting the associated expiry value. For example, to update a value and set the
expiry to 60 seconds:


```
Transcoder<Integer> tc = new IntegerTranscoder();
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 60, 1200, tc);

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

<a id="couchbase-sdk-java-update-delete"></a>

## Delete Methods

The `delete()` method deletes an item in the database with the specified key.
Delete operations are asynchronous only.

 * **API Call** — `delete(key)`

 * **Asynchronous** — yes

 * **Description** — Delete a key/value

 * **Returns** — `OperationFuture<Boolean>` ( Asynchronous request value, as
   Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

For example, to delete an item you might use code similar to the following:


```
OperationFuture<Boolean> delOp =
    client.delete("samplekey");

try {
    if (delOp.get().booleanValue()) {
        System.out.printf("Delete succeeded\n");
    }
    else {
        System.out.printf("Delete failed\n");
    }

}
catch (Exception e) {
    System.out.println("Failed to delete " + e);
}
```

<a id="couchbase-sdk-java-update-decr"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Java Client Library methods support the use of an explicit
offset value that will be used to reduce the stored value in the database.

 * **API Call** — `decr(key, offset)`

 * **Asynchronous** — no

 * **Description** — Decrement the value of an existing numeric key. The Couchbase
   Server stores numbers as unsigned values. Therefore the lowest you can decrement
   is to zero.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

The first form of the `decr()` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


```
client.decr("dlcounter",5);
```

The return value is the updated value of the specified key.

 * **API Call** — `decr(key, offset, default)`

 * **Asynchronous** — no

 * **Description** — Decrement the value of an existing numeric key. The Couchbase
   Server stores numbers as unsigned values. Therefore the lowest you can decrement
   is to zero.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

 * **int default** — Default value to increment/decrement if key does not exist

The second form of the `decr()` method will decrement the given key by the
specified `offset` value if the key already exists, or set the key to the
specified `default` value if the key does not exist. This can be used in
situations where you are recording a counter value but do not know whether the
key exists at the point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


```
long newcount =
    client.decr("dlcount",1,1000);

System.out.printf("Updated counter is %d\n",newcount);
```

A subsequent identical call will return the value 999 as the key `dlcount`
already exists.

 * **API Call** — `decr(key, offset, default, expiry)`

 * **Asynchronous** — no

 * **Description** — Decrement the value of an existing numeric key. The Couchbase
   Server stores numbers as unsigned values. Therefore the lowest you can decrement
   is to zero.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

 * **int default** — Default value to increment/decrement if key does not exist

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

The third form of the `decr()` method the decrement operation, with a default
value and with the addition of setting an expiry time on the stored value. For
example, to decrement a counter, using a default of 1000 if the value does not
exist, and an expiry of 1 hour (3600 seconds):


```
long newcount =
    client.decr("dlcount",1,1000,3600);
```

For information on expiry values, see [Expiry
Values](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-expiry).

 * **API Call** — `asyncDecr(key, offset)`

 * **Asynchronous** — yes

 * **Description** — Decrement the value of an existing numeric key. The Couchbase
   Server stores numbers as unsigned values. Therefore the lowest you can decrement
   is to zero.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

The asynchronous form of the `asyncDecr()` method enables you to decrement a
value without waiting for a response. This can be useful in situations where you
do not need to know the updated value or merely want to perform a decrement and
continue processing.

For example, to asynchronously decrement a given key:


```
OperationFuture<Long> decrOp =
    client.asyncDecr("samplekey",1,1000,24000);
```

<a id="couchbase-sdk-java-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

 * **API Call** — `incr(key, offset)`

 * **Asynchronous** — no

 * **Description** — Increment the value of an existing numeric key. Couchbase
   Server stores numbers as unsigned numbers, therefore if you try to increment an
   existing negative number, it will cause an integer overflow and return a
   non-logical numeric result. If a key does not exist, this method will initialize
   it with the zero or a specified value.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

The first form of the `incr()` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


```
client.incr("dlcounter",5);
```

The return value is the updated value of the specified key.

 * **API Call** — `incr(key, offset, default)`

 * **Asynchronous** — no

 * **Description** — Increment the value of an existing numeric key. Couchbase
   Server stores numbers as unsigned numbers, therefore if you try to increment an
   existing negative number, it will cause an integer overflow and return a
   non-logical numeric result. If a key does not exist, this method will initialize
   it with the zero or a specified value.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

 * **int default** — Default value to increment/decrement if key does not exist

The second form of the `incr()` method supports the use of a default value which
will be used to set the corresponding key if that value does not already exist
in the database. If the key exists, the default value is ignored and the value
is incremented with the provided offset value. This can be used in situations
where you are recording a counter value but do not know whether the key exists
at the point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


```
long newcount =
    client.incr("dlcount",1,1000);

System.out.printf("Updated counter is %d\n",newcount);
```

A subsequent identical call will return the value 1001 as the key `dlcount`
already exists and the value (1000) is incremented by 1.

 * **API Call** — `incr(key, offset, default, expiry)`

 * **Asynchronous** — no

 * **Description** — Increment the value of an existing numeric key. Couchbase
   Server stores numbers as unsigned numbers, therefore if you try to increment an
   existing negative number, it will cause an integer overflow and return a
   non-logical numeric result. If a key does not exist, this method will initialize
   it with the zero or a specified value.

 * **Returns** — `long` ( Numeric value )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

 * **int default** — Default value to increment/decrement if key does not exist

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

The third format of the `incr()` method supports setting an expiry value on the
given key, in addition to a default value if key does not already exist.

For example, to increment a counter, using a default of 1000 if the value does
not exist, and an expiry of 1 hour (3600 seconds):


```
long newcount =
    client.incr("dlcount",1,1000,3600);
```

For information on expiry values, see [Expiry
Values](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-expiry).

 * **API Call** — `asyncIncr(key, offset)`

 * **Asynchronous** — yes

 * **Description** — Increment the value of an existing numeric key. Couchbase
   Server stores numbers as unsigned numbers, therefore if you try to increment an
   existing negative number, it will cause an integer overflow and return a
   non-logical numeric result. If a key does not exist, this method will initialize
   it with the zero or a specified value.

 * **Returns** — `Future<Long>` ( Asynchronous request value, as Long )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int offset** — Integer offset value to increment/decrement (default 1)

The `asyncIncr()` method supports an asynchronous increment on the value for a
corresponding key. Asynchronous increments are useful when you do not want to
immediately wait for the return value of the increment operation.


```
OperationFuture<Long> incrOp =
    client.asyncIncr("samplekey",1,1000,24000);
```

<a id="couchbase-sdk-java-update-replace"></a>

## Replace Methods

The `replace()` methods update an existing key/value pair in the database. If
the specified key does not exist, then the operation will fail.

 * **API Call** — `replace(key, expiry, value)`

 * **Asynchronous** — yes

 * **Description** — Update an existing key with a new value

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

The first form of the `replace()` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


```
OperationFuture<Boolean> replaceOp =
    client.replace("samplekey","updatedvalue",0);
```

The return value is a `OperationFuture` value with a `Boolean` base.

 * **API Call** — `replace(key, expiry, value, transcoder)`

 * **Asynchronous** — yes

 * **Description** — Update an existing key with a new value

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

 * **Object value** — Value to be stored

 * **Transcoder<T> transcoder** — Transcoder class to be used to serialize value

The second form of the `replace()` method is identical o the first, but also
supports using a custom Transcoder in place of the default transcoder.

<a id="couchbase-sdk-java-update-touch"></a>

## Touch Methods

The `touch()` methods allow you to update the expiration time on a given key.
This can be useful for situations where you want to prevent an item from
expiring without resetting the associated value. For example, for a session
database you might want to keep the session alive in the database each time the
user accesses a web page without explicitly updating the session value, keeping
the user's session active and available.

 * **API Call** — `touch(key, expiry)`

 * **Asynchronous** — yes

 * **Description** — Update the expiry time of an item

 * **Returns** — `Future<Boolean>` ( Asynchronous request value, as Boolean )

 * **Arguments** —

 * **String key** — Document ID used to identify the value

 * **int expiry** — Expiry time for key. Values larger than 30\*24\*60\*60 seconds
   (30 days) are interpreted as absolute times (from the epoch).

The first form of the `touch()` provides a simple key/expiry call to update the
expiry time on a given key. For example, to update the expiry time on a session
for another 5 minutes:


```
OperationFuture<Boolean> touchOp =
    client.touch("sessionid",300);
```

<a id="api-reference-stat"></a>

# Statistics Operations

The Couchbase Java Client Library includes support for obtaining statistic
information from all of the servers defined within a `CouchbaseClient` object. A
summary of the commands is provided below.

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats** — Get the
   statistics from all connections —

 * **Couldn't resolve link tag: table-couchbase-sdk\_java\_getstats-name** — Get
   the statistics from all connections —

 * **API Call** — `getStats()`

 * **Asynchronous** — no

 * **Description** — Get the database statistics

 * **Returns** — `Object` ( Binary object )

 * **Arguments** —

 * — None —

The first form of the `getStats()` command gets the statistics from all of the
servers configured in your `CouchbaseClient` object. The information is returned
in the form of a nested Map, first containing the address of configured server,
and then within each server the individual statistics for that server.

 * **API Call** — `getStats(statname)`

 * **Asynchronous** — no

 * **Description** — Get the database statistics

 * **Returns** — `Object` ( Binary object )

 * **Arguments** —

 * **String statname** — Group name of a statistic for selecting individual
   statistic value

The second form of the `getStats()` command gets the specified group of
statistics from all of the servers configured in your CouchbaseClient object.
The information is returned in the form of a nested Map, first containing the
address of configured server, and then within each server the individual
statistics for that server.

<a id="api-reference-view"></a>

# View/Query Interface

Couchbase Server 2.0 combines the speed and flexibility of Couchbase databases
with the powerful JSON document database technology of CouchDB into a new
product that is easy to use and provides powerful query capabilities such as
map-reduce. With Couchbase Server 2.0 you are able to keep using all of the
Couchbase code you already have, and upgrade certain parts of it to use JSON
documents without any hassles. In doing this, you can easily add the power of
Views and querying those views to your applications.

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * For more information on Views, how they operate, and how to write effective
   map/reduce queries, see [Couchbase Server 2.0:
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
   and [Couchbase Sever 2.0: Writing
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

The `View` Object is obtained by calling the `getView` method which provides
access to the view on the server.

 * **API Call** — `getView(ddocname, viewname)`

 * **Asynchronous** — no

 * **Description** — Create a view object to be used when querying a view.

 * **Returns** — (none)

 * **Arguments** —

 * **String ddocname** — Design document name

 * **String viewname** — View name within a design document


```
View view = client.getView(docName, viewName)
```

Then obtain a new `Query` method.

 * **API Call** — `new()`

 * **Asynchronous** — no

 * **Description** — Create a query object to be used when querying a view.

 * **Returns** — (none)

 * **Arguments** —

 * — None —


```
Query query = new Query();
```

Once, the View and Query objects are available, the results of the server view
can be accessed as below.

 * **API Call** — `query(view, query)`

 * **Asynchronous** — no

 * **Description** — Query a view within a design doc

 * **Returns** — (none)

 * **Arguments** —

 * **View view** — View object associated with a server view

 * **Query query** — View object associated with a server view


```
ViewResponse = client.query(view, query)
```

Before accessing the View, a list of options can be set with the query object.

 * `setKey(java.lang.String key)`

   to set the starting Key.

 * `setRangeStart(java.lang.String startKey)`

   to set the starting Key.

 * `setRangeEnd(java.lang.String endKey)`

   to set the ending Key.

 * `setRange(java.lang.String startKey, java.lang.String endKey)`

   to set the starting and ending key, both.

 * `setDescending(boolean descending)`

   to set the descending flat to true or false.

 * `setIncludeDocs(boolean include)`

   to Include the original JSON document with the query.

 * `setReduce(boolean reduce)`

   where the reduce function is included or excluded based on the Flag.

 * `setStale(Stale stale)`

   where the possible values for stale are `FALSE`, `UPDATE_AFTER` and `OK` as
   noted in the Release Notes.

The format of the returned information of the query method is:

`ViewResponse` or any of the other inherited objects such as
`ViewResponseWithDocs`, `ViewResponseNoDocs`, `ViewResponseReduced`.

The `ViewResponse` method provides a `iterator()` method for iterating through
the rows as a `ViewRow` interface. The `ViewResponse` method also provides a
`getMap()` method where the result is available as a map.

The following methods are available on the `ViewRow` interface.

 * `getId()`

   to get the Id of the associated row.

 * `getKey()`

   to get the Key of the associated Key/Value pair of the result.

 * `getValue()`

   to get the Value of the associated Key/Value pair of the result.

 * `getDocument()`

   to get the document associated with the row.

For usage of these classes, please refer to the
[Tutorial](couchbase-sdk-java-ready.html#tutorial) which has been enhanced to
include Views.

<a id="api-reference-troubleshooting"></a>

# Java Troubleshooting

This Couchbase SDK Java provides a complete interface to Couchbase Server
through the Java programming language. For more on Couchbase Server and Java
read our [Java SDK Getting Started
Guide](http://www.couchbase.com/develop/java/current) followed by our in-depth
Couchbase and Java tutorial. We recommended Java SE 6 (or higher) for running
the Couchbase Client Library.

This section covers the following topics:

 * Logging from the Java SDK

 * Handling Timeouts

 * Bulk Load and Exponential Backoff

 * Retrying After Receiving a Temporary Failure

<a id="java-api-configuring-logging"></a>

## Configuring Logging

Occasionally when you are troubleshooting an issue with a clustered deployment,
you may find it helpful to use additional information from the Couchbase Java
SDK logging. The SDK uses JDK logging and this can be configured by specifying a
runtime define and adding some additional logging properties. There are two ways
to set up Java SDK logging:

 * Use spymemcached to log from the Java SDK. Since the SDK uses spymemcached and
   is compatible with spymemcached, you can use the logging provided to output
   SDK-level information.

 * Set your JDK properties to log Couchbase Java SDK information.

 * Provide logging from your application.

To provide logging via spymemcached:


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
```

or


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");
```

The default logger simply logs everything to the standard error stream. To
provide logging via the JDK, if you are running a command-line Java program, you
can run the program with logging by setting a property:


```
-Djava.util.logging.config.file=logging.properties
```

The other alternative is create a `logging.properties` and add it to your in
your classpath:


```
logging.properties
handlers = java.util.logging.ConsoleHandler
java.util.logging.ConsoleHandler.level = ALL
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
com.couchbase.client.vbucket.level = FINEST
com.couchbase.client.vbucket.config.level = FINEST
com.couchbase.client.level = FINEST
```

The final option is to provide logging from your actual Java application. If you
are writing your application in an IDE which manages command-line operations for
you, it may be easier if you express logging in your application code. Here is
an example:


```
// Tell things using spymemcached logging to use internal SunLogger API
        Properties systemProperties = System.getProperties();
        systemProperties.put("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
        System.setProperties(systemProperties);

        Logger.getLogger("net.spy.memcached").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client.vbucket").setLevel(Level.FINEST);

        //get the top Logger
        Logger topLogger = java.util.logging.Logger.getLogger("");

        // Handler for console (reuse it if it already exists)
        Handler consoleHandler = null;
        //see if there is already a console handler
        for (Handler handler : topLogger.getHandlers()) {
            if (handler instanceof ConsoleHandler) {
                //found the console handler
                consoleHandler = handler;
                break;
            }
        }

        if (consoleHandler == null) {
            //there was no console handler found, create a new one
            consoleHandler = new ConsoleHandler();
            topLogger.addHandler(consoleHandler);
        }

        //set the console handler to fine:
        consoleHandler.setLevel(java.util.logging.Level.FINEST);
```

<a id="java-sdk-handling-timeouts"></a>

## Handling Timeouts

The Java client library has a set of synchronous and asynchronous methods. While
it does not happen in most situations, occasionally network IO can become
congested, nodes can fail, or memory pressure can lead to situations where an
operation can timeout.

When a timeout occurs, most of the synchronous methods on the client will return
a RuntimeException showing a timeout as the root cause. Since the asynchronous
operations give more specific control over how long it takes for an operation to
be successful or unsuccessful, asynchronous operations throw a checked
TimeoutException.

As an application developer, it is best to think about what you would do after
this timeout. This may be something such as showing the user a message, it may
be doing nothing, or it may be going to some other system for additional data.

In some cases you might want to retry the operation, but you should consider
this carefully before performing the retry in your code; sometimes a retry may
exacerbate the underlying problem that caused the timeout. If you choose to do a
retry, providing in the form of a backoff or exponential backoff is advisable.
This can be thought of as a pressure relief valve for intermittent resource
problems. For more information on backoff and exponential backoff, see [Bulk
Load and Exponential
Backoff](couchbase-sdk-java-ready.html#java-sdk-bulk-load-and-backoff).

<a id="java-sdk-timingout-and-blocking"></a>

## Timing-out and Blocking

If your application creates a large number of asynchronous operations, you may
also encounter timeouts immediately in response to the requests. When you
perform an asynchronous operation, Couchbase Java SDK creates an object and puts
the object into a request queue. The object and the request are stored in Java
runtime memory, in other words, they are stored in local to your Java
application runtime memory and require some amount of Java Virtual Machine IO to
be serviced.

Rather than write so many asynchronous operations that can overwhelm a JVM and
generate out of memory errors for the JVM, you can rely on SDK-level timeouts.
The default behavior of the Java SDK is to start to immediately timeout
asynchronous operations if the queue of operations to be sent to the server is
overwhelmed.

You can also choose to control the volume of asynchronous requests that are
issued by your application by setting a timeout for blocking. You might want to
do this for a bulk load of data so that you do not overwhelm your JVM. The
following is an example:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-bulk-load-and-backoff"></a>

## Bulk Load and Exponential Backoff

When you bulk load data to Couchbase Server, you can accidentally overwhelm
available memory in the Couchbase cluster before it can store data on disk. If
this happens, Couchbase Server will immediately send a response indicating the
operation cannot be handled at the moment but can be handled later.

This is sometimes referred to as "handling Temp OOM", where where OOM means out
of memory. Note though that the actual temporary failure could be sent back for
reasons other than OOM. However, temporary OOM is the most common underlying
cause for this error.

To handle this problem, you could perform an exponential backoff as part of your
bulk load. The backoff essentially reduces the number of requests sent to
Couchbase Server as it receives OOM errors:


```
package com.couchbase.sample.dataloader;

import com.couchbase.client.CouchbaseClient;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import net.spy.memcached.internal.OperationFuture;
import net.spy.memcached.ops.OperationStatus;

/**
 *
   * The StoreHandler exists mainly to abstract the need to store things
   * to the Couchbase Cluster even in environments where we may receive
   * temporary failures.
 *
 * @author ingenthr
 */
public class StoreHandler {

  CouchbaseClient cbc;
  private final List<URI> baselist;
  private final String bucketname;
  private final String password;

  /**
   *
   * Create a new StoreHandler.  This will not be ready until it's initialized
   * with the init() call.
   *
   * @param baselist
   * @param bucketname
   * @param password
   */
  public StoreHandler(List<URI> baselist, String bucketname, String password) {
    this.baselist = baselist; // TODO: maybe copy this?
    this.bucketname = bucketname;
    this.password = password;


  }

  /**
   * Initialize this StoreHandler.
   *
   * This will build the connections for the StoreHandler and prepare it
   * for use.  Initialization is separated from creation to ensure we would
   * not throw exceptions from the constructor.
   *
   *
   * @return StoreHandler
   * @throws IOException
   */
  public StoreHandler init() throws IOException {
    // I prefer to avoid exceptions from constructors, a legacy we're kind
    // of stuck with, so wrapped here
    cbc = new CouchbaseClient(baselist, bucketname, password);
    return this;
  }

  /**
   *
   * Perform a regular, asynchronous set.
   *
   * @param key
   * @param exp
   * @param value
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> set(String key, int exp, Object value) {
    return cbc.set(key, exp, cbc);
  }

  /**
   * Continuously try a set with exponential backoff until number of tries or
   * successful.  The exponential backoff will wait a maximum of 1 second, or
   * whatever
   *
   * @param key
   * @param exp
   * @param value
   * @param tries number of tries before giving up
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> contSet(String key, int exp, Object value,
          int tries) {
    OperationFuture<Boolean> result = null;
    OperationStatus status;
    int backoffexp = 0;

    try {
      do {
        if (backoffexp > tries) {
          throw new RuntimeException("Could not perform a set after "
                  + tries + " tries.");
        }
        result = cbc.set(key, exp, value);
        status = result.getStatus(); // blocking call, improve if needed
        if (status.isSuccess()) {
          break;
        }
        if (backoffexp > 0) {
          double backoffMillis = Math.pow(2, backoffexp);
          backoffMillis = Math.min(1000, backoffMillis); // 1 sec max
          Thread.sleep((int) backoffMillis);
          System.err.println("Backing off, tries so far: " + backoffexp);
        }
        backoffexp++;

        if (!status.isSuccess()) {
          System.err.println("Failed with status: " + status.getMessage());
        }

      } while (status.getMessage().equals("Temporary failure"));
    } catch (InterruptedException ex) {
      System.err.println("Interrupted while trying to set.  Exception:"
              + ex.getMessage());
    }

    if (result == null) {
      throw new RuntimeException("Could not carry out operation."); // rare
    }

    // note that other failure cases fall through.  status.isSuccess() can be
    // checked for success or failure or the message can be retrieved.
    return result;
  }
}
```

There is also a setting you can provide at the connection-level for Couchbase
Java SDK that will also help you avoid too many asynchronous requests:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpTimeout(10000);  // wait up to 10 seconds for an operation to succeed
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-retry"></a>

## Retrying After Receiving a Temporary Failure

If you send too many requests all at once to Couchbase, you can create a out of
memory problem, and the server will send back a temporary failure message. The
message indicates you can retry the operation, however the server will not slow
down significantly; it just does not handle the request. In contrast, other
database systems will become slower for all operations under load.

This gives your application a bit more control since the temporary failure
messages gives you the opportunity to provide a backoff mechanism and retry
operations in your application logic.

<a id="java-gc-tuning"></a>

## Java Virtual Machine Tuning Guidelines

Generally speaking, there is no reason to adjust any Java Virtual Machine
parameters when using the Couchbase Java Client. In fact, in general you should
not start with specific tuning, but instead should use defaults from the
application server first, then measure application metrics such as throughput
and response time. Then, if there is a need to make an improvement, make
adjustments and re-measure.

The recommendations here are based on the Oracle (formerly Sun) HotSpot Virtual
Machine and derivations such as the Java Virtual Machine shipped with Mac OS X
and the OpenJDK project. Other Java virtual machines likely behave similarly.

It should be noted that by default, garbage collection times may easily go over
1sec. This can lead to higher than expected response times or even timeouts, as
the default timeout is 2.5 seconds. This is true with simple tests even on
systems with lots of CPUs and a good amount of memory.

The reason for this is that for the most part, by default, the JVM is weighted
toward throughput instead of latency. Of course, much of this can be controlled
with GC tuning on the JVM. With the hotspot JVM, look to this whitepaper:
http://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf

In the referenced whitepaper, the Concurrent Mark Sweep collector is recommended
if your applciation needs short pauses. It also recommends advising the JVM to
try to shorten pause times. Given the Couchbase client's 2.5 second default
timeout, with our basic testing we found the following to be useful:


```
-XX:+UseConcMarkSweepGC -XX:MaxGCPauseMillis=850
```

The whitepaper refers to a couple of tools which may be useful in gathering
information on JVM GC performance. For example, adding -XX:+PrintGCDetails and
-XX:+PrintGCTimeStamps are a simple way to generate log messages which you may
correlate to application behavior. The logs may show a full GC event taking,
perhaps, several seconds during which no processing occurs and operations may
timeout. Adjusting parameters related to how to perform a full GC, which
collector to use, how long to pause the VM during GC and even adding incremental
mode may help, depending on your application's workload. One other common tool
for getting information is JConsole
(http://docs.oracle.com/javase/6/docs/technotes/guides/management/jconsole.html).
JConsole is more of an interactive tool, but it may help you identify changes
you may want to make in the different memory spaces used by the JVM to further
reduce the need to run a GC on the old generation.

There is a CPU time tradeoff when setting these tuning parameters. There are
also other parameters which may provide additional help referenced in the
whitepaper.

If you happen to be using JDK 7 update 4 or later, the G1 collector may be an
even better option. Again, you should be guided by measuring performance from
the application level.

Even with these, our testing showed some GCs near a half a second. While the
Couchbase Client allows tuning of the timeout time to drop as low as you wish,
we do not recommend dropping it much below one second unless you are planning to
tune other parts of the system beyond the JVM.

For example, most people run applications on networks that do not offer any
guarantee around response time. If the network is oversubscribed or minor blips
occur on the network, there can be TCP retransmissions. While many TCP
implementations may ignore it, RFC 2988 specifies rounding up to 1sec when
calculating TCP retransmit timeouts.

Achieving either maximum throughput or minimum per-operation latency can be
enhanced with JVM tuning, supported by overall system tuning at the extremes.

<a id="couchbase-sdk-java-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see [Couchbase
Client Library Java Issues
Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-1-1a"></a>

## Release Notes for Couchbase Client Library Java 1.1.1 GA (23 January 2013)

The 1.1.1 release is the first bugfix release for the 1.1 series. It brings more
resiliency on failover, adds more flexibility for view query params and adds a
(by default disabled) stats-based throttling mechanism.

**New Features and Behaviour Changes in 1.1.1**

 * An adaptive throttling mechanism has been implemented that is particularily
   useful when running bulk load operations while maintaining a healthy throughput
   from a different running application at the same time. The throttler is disabled
   by default and can be enabled through properties.

   The adaptive throttling mechanisms works on top of memory thresholds that it
   fetches every N operations from the cluster. If the memory is higher than a
   certain level, operations are throttled until everything is back to normal. See
   the `cbclient.properties.dist` for all available options.

   Note that this code should normally not enabled by default, because it
   negatively impacts the throughput and latency against your cluster (which is
   okay if you want the tradeoff in particular situations).

   *Issues* : [JCBC-212](http://www.couchbase.com/issues/browse/JCBC-212)

 * Behind the scenes, property management has been refactored into a centralized
   class. While this doesn't change anything in the first place, all properties
   should now have the `cbclient.` prefix, so that they are picked up
   automatically. As always, when there is a `cbclient.properties` file around in
   the CLASSPATH, it is picked up automatically.

   The only notable difference (for backwards compatibility) is the `viewmode`
   property, which can be used with or without the `cbclient.` prefix.

   *Issues* : [JCBC-211](http://www.couchbase.com/issues/browse/JCBC-211),
   [JCBC-215](http://www.couchbase.com/issues/browse/JCBC-215)

 * Spymemcached has been updated to 2.8.10, which includes a fix that improves
   timeouts during node failure situations.

 * When working with the `ComplexKey` class for view queries, it is now possible to
   use all kinds of numbers (not only doubles).

   *Issues* : [JCBC-190](http://www.couchbase.com/issues/browse/JCBC-190)

**Fixes in 1.1.1**

 * A bug in the reconnection logic has been fixed that would negatively impact the
   reconnect threshold when a node is considered down but a cluster config update
   has not yet reached the client (or the entry node has been failed over/killed).

   Also, possible hanging nodes (that is the socket is open but the process may be
   dead) are now properly detected and should not cause infinited timeouts and
   block the client.

   *Issues* : [JCBC-207](http://www.couchbase.com/issues/browse/JCBC-207),
   [JCBC-134](http://www.couchbase.com/issues/browse/JCBC-134),
   [JCBC-214](http://www.couchbase.com/issues/browse/JCBC-214)

**Known Issues in 1.1.1**

 * The `flush()` command now works over HTTP, but is currently not working because
   of an open issue inside Couchbase Server 2.0 (MB-7381). A workaround is to use
   the ClusterManager with Administrator privileges in the meantime.

   *Issues* : [JCBC-144](http://www.couchbase.com/issues/browse/JCBC-144)

<a id="couchbase-sdk-java-rn_1-1-0f"></a>

## Release Notes for Couchbase Client Library Java 1.1.0 GA (11 December 2012)

The 1.1.0 release adds all features and tools neded to work against Couchbase
Server 2.0 with Java.

This especially includes support for the brand-new view engine. The following
list includes the major features and bugfixes compared to the 1.0.\* releases.
For more detailed release notes, see the developer preview and beta releases.

Also, the [Getting Started
Guide](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/getting-started.html)
and the
[Tutorial](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/tutorial.html)
have been updated and can be used together with the 1.1.0 release.

**New Features and Behaviour Changes in 1.1.0**

 * This release adds the possibility of providing a durability setting that allows
   to make sure data is replicated but not persisted. This may speed up operations
   while allowing to maintain a reasonable safety net at the same time (wait until
   the operation has been replicated to the given number of nodes). Also, every
   command takes either ReplicateTo, PersistTo or both.

   Here is an usage example of an add operation which makes sure to replicate to at
   least one node:

    ```
    // With ReplicateTo only
     client.add("mykey", 0, "value", ReplicateTo.ONE);

     // Identical to this
     client.add("mykey", 0, "value", PersistTo.ZERO, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-119](http://www.couchbase.com/issues/browse/JCBC-119),
   [JCBC-128](http://www.couchbase.com/issues/browse/JCBC-128)

 * Support for spatial view queries has been added to the SDK. Not that at this
   stage, spatial view queries are expermimental and should be treated as such.
   Since spatial queries differ a little bit from classic map/reduce ones, a new
   "bbox" param has been added to the Query object as well to accomodate the needs.
   Note that there has been taken lots of care not to break the current API by
   adding this feature. The main difference to normal map/reduce is to use the
   "getSpatialView" method instead of the "getView" method on the CouchbaseClient
   object. Here is a short example on how to use it:

    ```
    SpatialView view = client.getSpatialView("my_design", "my_spatial_view");
     Query query = new Query();
     ViewResponse response = client.query(view, query);
     for(ViewRow row : response) {
     // Work with bbox data: row.getBbox();
     // Work with geometry data: row.getGeometry();
     // Work with the value: row.getValue();
     }
    ```

   *Issues* : [JCBC-136](http://www.couchbase.com/issues/browse/JCBC-136)

 * ComplexKey querying support has been enhanced and is now more flexible when it
   comes to Long values, nulls and others.

   *Issues* : [JCBC-165](http://www.couchbase.com/issues/browse/JCBC-165),
   [JCBC-167](http://www.couchbase.com/issues/browse/JCBC-167)

 * View Query Timeouts can now be configured through the
   CouchbaseConnectionFactoryBuilder (using the `setViewTimeout()` method).

   *Issues* : [JCBC-168](http://www.couchbase.com/issues/browse/JCBC-168)

 * A new ComplexKey class has ben added as a utility to define view query options.
   This makes it possible to convert Java types into their corresponding JSON
   representations as easy as possible. Also, this avoids the need to encode the
   values by hand to encode them properly. Passing in a string does still work, but
   the ComplexKey approach is recommended when working with arrays or other more
   complex JSON structures.

   Here is a short example on how to use it properly:

    ```
    // JSON Result: 100
     ComplexKey.of(100);

     // JSON Result: "Hello"
     ComplexKey.of("Hello");

     // JSON Result: ["Hello", "World"]
     ComplexKey.of("Hello", "World");

     // JSON Result: [1349360771542,1]
     ComplexKey.of(new Date().getTime(), 1);
    ```

   When querying a view it looks like this:

    ```
    long now = new Date().getTime();
     long tomorrow = now + 86400;
     Query query = new Query();
     query.setRange(ComplexKey.of(now), ComplexKey.of(tomorrow));
     // Converts to: ?startkey=1349362647742&endkey=1349362734142
    ```

   *Issues* : [JCBC-32](http://www.couchbase.com/issues/browse/JCBC-32),
   [JCBC-41](http://www.couchbase.com/issues/browse/JCBC-41)

 * The Views functionality has been added to the Couchbase-client library. Views is
   available starting with Couchbase Server 2.0. For more details on this feature
   refer to [Couchbase Server
   Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

   The purpose of a view is take the structured data stored within your Couchbase
   Server database as JSON documents, extract the fields and information that is
   needed, and to produce an index of the selected information. The result is a
   view on the stored data.

   The view that is created during this process can be iterated, selected and
   queried with the information in the database from the raw data objects that have
   been stored using Java objects such as `View`, `Query`, `ViewFuture`,
   `ViewResponse` and `ViewRow`.

   The following code fragment illustrates how to use the objects and access the
   view.

    ```
    Query query = new Query();

     query.setReduce(false);
     query.setIncludeDocs(true);
     query.setStale(Stale.FALSE);

     // Specify the design and document (by default production mode)
     View view = client.getView("chat", "messages");

     if (view == null) {
     // Take corrective action
     }

     ViewResponse result = client.query(view, query);

     Iterator<ViewRow> itr = result.iterator();
     ViewRow row;

     while (itr.hasNext()) {
     row = itr.next();
     String doc = (String) row.getDocument();
     // Do something for each row
     }
    ```

 * Starting from this beta release, it is now possible to manage design documents
   through the SDK as well. Design documents can be created, loaded and deleted
   through their corresponding methods from the CouchbaseClient class. Use the
   "createDesignDoc()" and "deleteDesignDoc()" methods for creating or deleting
   design documents as a whole. Here is a short example on how to use it:

    ```
    List<ViewDesign> views = new ArrayList<ViewDesign>();
     List<SpatialViewDesign> spviews = new ArrayList<SpatialViewDesign>();

     ViewDesign view1 = new ViewDesign(
     "view1",
     "function(a, b) {}"
     );
     views.add(view1);

     SpatialViewDesign spview = new SpatialViewDesign(
     "spatialfoo",
     "function(map) {}"
     );
     spviews.add(spview);

     DesignDocument doc = new DesignDocument("mydesign", views, spviews);
     Boolean success = client.createDesignDoc(doc);
    ```

   Note that creating design documents may take some time, so make sure to wait
   some time and poll with "getDesignDocument()" to see if it is already correctly
   loaded.

   *Issues* : [JCBC-63](http://www.couchbase.com/issues/browse/JCBC-63)

**Fixes in 1.1.0**

 * When no replicas are defined in the cluster and a node fails (or more nodes fail
   at the same time than replicas are defined), then it is possible that there is
   no single master responsible for a given vbucket. This has been a problem in
   previous tests and is now handled that a RuntimeException is thrown which a
   explanatory message. Since the cluster may now be in a very bad state, it is up
   to the developer at the application level to ensure the correct behavior of the
   following operation (since this may be very different depending on the
   application requirements).

   *Issues* : [JCBC-123](http://www.couchbase.com/issues/browse/JCBC-123)

 * Netty has been upgraded to 3.5.5.

   *Issues* : [JCBC-106](http://www.couchbase.com/issues/browse/JCBC-106)

 * Operation Status message has been changed from hard coded value to be based on
   tunable parameters.

   *Issues* : [JCBC-107](http://www.couchbase.com/issues/browse/JCBC-107)

 * When using memcache-type buckets instead of couchbase-type buckets, the
   reconfiguration should now work as expected. The client previously tried to
   compare the vbuckets all the time, but since memcache-type buckets don't contain
   vbuckets it failed (now only the server nodes themselves are compared).

   *Issues* : [JCBC-35](http://www.couchbase.com/issues/browse/JCBC-35)

**Known Issues in 1.1.0**

 * The `flush()` command now works over HTTP, but is currently not working because
   of an open issue inside Couchbase Server 2.0 (MB-7381). A workaround is to use
   the ClusterManager with Administrator privileges in the meantime.

   *Issues* : [JCBC-144](http://www.couchbase.com/issues/browse/JCBC-144)

<a id="couchbase-sdk-java-rn_1-1-0e"></a>

## Release Notes for Couchbase Client Library Java 1.1-beta Beta (3 December 2012)

**New Features and Behaviour Changes in 1.1-beta**

 * The "delete" command now also supports persitence constraints like set, add,
   replace or CAS do.

    ```
    client.delete("my_key", PersistTo.MASTER, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-162](http://www.couchbase.com/issues/browse/JCBC-162)

 * To assist with better debugging on view queries, a new method on the "Query"
   class, "setDebug(boolean)" has been introduced. When it is set to true, the
   client will log the view results including debug information to the INFO level,
   which is by default turned on. This can be very helpful on debugging misbehaving
   view queries and to provide vital information for support tickets.

   *Issues* : [JCBC-158](http://www.couchbase.com/issues/browse/JCBC-158)

 * The regular view timeout has been increased from 60 to 75 seconds (because the
   server-side view timeout is 60 seconds and now the corresponding timeout on the
   client is slightly higher). It is now possible to configure it through the
   CouchbaseConnectionFactoryBuilder. Use the corresponding "setViewTimeout" method
   on it if you want to change the setting. Note that the lower threshold is set to
   500ms, and it will print a warning if it's lower than 2500ms because this can
   lead to undesired effects in production.

   *Issues* : [JCBC-153](http://www.couchbase.com/issues/browse/JCBC-153)

 * Support for spatial view queries has been added to the SDK. Not that at this
   stage, spatial view queries are expermimental and should be treated as such.
   Since spatial queries differ a little bit from classic map/reduce ones, a new
   "bbox" param has been added to the Query object as well to accomodate the needs.
   Note that there has been taken lots of care not to break the current API by
   adding this feature. The main difference to normal map/reduce is to use the
   "getSpatialView" method instead of the "getView" method on the CouchbaseClient
   object. Here is a short example on how to use it:

    ```
    SpatialView view = client.getSpatialView("my_design", "my_spatial_view");
     Query query = new Query();
     ViewResponse response = client.query(view, query);
     for(ViewRow row : response) {
     // Work with bbox data: row.getBbox();
     // Work with geometry data: row.getGeometry();
     // Work with the value: row.getValue();
     }
    ```

   *Issues* : [JCBC-136](http://www.couchbase.com/issues/browse/JCBC-136)

 * To "fail fast" on observe constraints (when operations like "set" are used with
   PersistTo and/or ReplicateTo), the client now checks if there are enough nodes
   in the cluster to theoretically fulfill the request. This means if
   PersistTo.THREE is used when there are only two nodes in the cluster, the
   operations may succeed but the observation surely fails because the constraint
   can't be fulfilled. In this case, the OperationFuture would return false and the
   message respons with something like this: "Currently, there are less nodes in
   the cluster than required to satisfy the replication/persistence constraint.".
   Keep in mind that replication constraints always require one additional node to
   be fulfilled correctly. So a ReplicateTo.TWO with only two nodes in the cluster
   will fail.

   *Issues* : [JCBC-148](http://www.couchbase.com/issues/browse/JCBC-148)

 * Starting from this beta release, it is now possible to manage design documents
   through the SDK as well. Design documents can be created, loaded and deleted
   through their corresponding methods from the CouchbaseClient class. Use the
   "createDesignDoc()" and "deleteDesignDoc()" methods for creating or deleting
   design documents as a whole. Here is a short example on how to use it:

    ```
    List<ViewDesign> views = new ArrayList<ViewDesign>();
     List<SpatialViewDesign> spviews = new ArrayList<SpatialViewDesign>();

     ViewDesign view1 = new ViewDesign(
     "view1",
     "function(a, b) {}"
     );
     views.add(view1);

     SpatialViewDesign spview = new SpatialViewDesign(
     "spatialfoo",
     "function(map) {}"
     );
     spviews.add(spview);

     DesignDocument doc = new DesignDocument("mydesign", views, spviews);
     Boolean success = client.createDesignDoc(doc);
    ```

   Note that creating design documents may take some time, so make sure to wait
   some time and poll with "getDesignDocument()" to see if it is already correctly
   loaded.

   *Issues* : [JCBC-63](http://www.couchbase.com/issues/browse/JCBC-63)

 * The "getViews" method has been renamed to "getDesignDocument" and the arguments
   have been changed to make it easier to use in combination with
   "createDesignDocument" and "deleteDesignDocument". The method takes the name of
   the design document and returns an instance of a "DesignDocument". This can be
   modified and then passed back to "createDesignDocument" to update it
   accordingly. Here is a quick example:

    ```
    DesignDocument design = client.getDesignDocument("rawdesign");
    design.getName(); // Returns the name of the design document
    design.getViews(); // Contains the stored views
    design.getSpatialViews(); // contains the stored spatial views
    ```

   *Issues* : [JCBC-147](http://www.couchbase.com/issues/browse/JCBC-147)

**Fixes in 1.1-beta**

 * When a view with a defined reduce-function is used, the client now implicitly
   sets "setReduce()" to "true". This behavour is now much more intuitive and also
   irons-out some bugs associated with it.

   *Issues* : [JCBC-150](http://www.couchbase.com/issues/browse/JCBC-150)

 * Pagination support got a lot more attention in the previous weeks and therefore
   some bugs have been ironed out. NullPointerExceptions should not be raised
   anymore. Note that is currently not possible to paginate over reduced or spatial
   results, this will be added in a future release.

   *Issues* : [JCBC-40](http://www.couchbase.com/issues/browse/JCBC-40)

 * When no replicas are defined in the cluster and a node fails (or more nodes fail
   at the same time than replicas are defined), then it is possible that there is
   no single master responsible for a given vbucket. This has been a problem in
   previous tests and is now handled that a RuntimeException is thrown which a
   explanatory message. Since the cluster may now be in a very bad state, it is up
   to the developer at the application level to ensure the correct behavior of the
   following operation (since this may be very different depending on the
   application requirements).

   *Issues* : [JCBC-123](http://www.couchbase.com/issues/browse/JCBC-123)

 * It is now possible to read every kind of included document through views.
   Previously all documents were casted to strings when fetched with
   "setIncludeDocs(true)", which did not allow it to be (for example) serialized
   java objects. This is now possible since those objects are not implicitly casted
   to strings anymore. Note that this only applies to the included documents, view
   results are still interpreted as strings (JSON).

   *Issues* : [JCBC-125](http://www.couchbase.com/issues/browse/JCBC-125)

 * When using memcache-type buckets instead of couchbase-type buckets, the
   reconfiguration should now work as expected. The client previously tried to
   compare the vbuckets all the time, but since memcache-type buckets don't contain
   vbuckets it failed (now only the server nodes themselves are compared).

   *Issues* : [JCBC-35](http://www.couchbase.com/issues/browse/JCBC-35)

 * Additional checkpoints have been added to make sure all ViewConnection threads
   are properly closed during the shutdown phase.

   *Issues* : [JCBC-94](http://www.couchbase.com/issues/browse/JCBC-94)

<a id="couchbase-sdk-java-rn_1-1-0d"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp4 Developer Preview (29 October 2012)

**New Features and Behaviour Changes in 1.1-dp4**

 * It is now possible to create and delete buckets from the client directly,
   without the need to switch to the UI or use the REST API. The functionality is
   provided through the new ClusterManager class. Here is a short example on how to
   use it:

    ```
    // Connect with cluster admin and password
     ClusterManager manager = new ClusterManager(uris, "Administrator", "password");

     // Create a new bucket with authentication
     manager.createSaslBucket(BucketType.COUCHBASE, "saslbucket", 100, 0, "password");

     // Delete the bucket again
     manager.deleteBucket("saslbucket");
    ```

   See the documentation for more details and usage examples.

   *Issues* : [JCBC-64](http://www.couchbase.com/issues/browse/JCBC-64)

 * This release adds the possibility of providing a durability setting that allows
   to make sure data is replicated but not persisted. This may speed up operations
   while allowing to maintain a reasonable safety net at the same time (wait until
   the operation has been replicated to the given number of nodes). Also, every
   command takes either ReplicateTo, PersistTo or both.

   Here is an usage example of an add operation which makes sure to replicate to at
   least one node:

    ```
    // With ReplicateTo only
     client.add("mykey", 0, "value", ReplicateTo.ONE);

     // Identical to this
     client.add("mykey", 0, "value", PersistTo.ZERO, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-119](http://www.couchbase.com/issues/browse/JCBC-119),
   [JCBC-128](http://www.couchbase.com/issues/browse/JCBC-128)

 * A new ComplexKey class has ben added as a utility to define view query options.
   This makes it possible to convert Java types into their corresponding JSON
   representations as easy as possible. Also, this avoids the need to encode the
   values by hand to encode them properly. Passing in a string does still work, but
   the ComplexKey approach is recommended when working with arrays or other more
   complex JSON structures.

   Here is a short example on how to use it properly:

    ```
    // JSON Result: 100
     ComplexKey.of(100);

     // JSON Result: "Hello"
     ComplexKey.of("Hello");

     // JSON Result: ["Hello", "World"]
     ComplexKey.of("Hello", "World");

     // JSON Result: [1349360771542,1]
     ComplexKey.of(new Date().getTime(), 1);
    ```

   When querying a view it looks like this:

    ```
    long now = new Date().getTime();
     long tomorrow = now + 86400;
     Query query = new Query();
     query.setRange(ComplexKey.of(now), ComplexKey.of(tomorrow));
     // Converts to: ?startkey=1349362647742&endkey=1349362734142
    ```

   *Issues* : [JCBC-32](http://www.couchbase.com/issues/browse/JCBC-32),
   [JCBC-41](http://www.couchbase.com/issues/browse/JCBC-41)

**Fixes in 1.1-dp4**

 * When a HTTP operation is cancelled, it is now ensured that the corresponding
   HTTP request is also cancelled. This prevents a possible issue where the calling
   thread is blocked longer than needed.

   *Issues* : [JCBC-30](http://www.couchbase.com/issues/browse/JCBC-30)

 * The CouchbaseClient now does not try to establish view connections on memcache
   buckets. This makes it possible to connect to memcache buckets on the 1.1 series
   again.

   *Issues* : [JCBC-121](http://www.couchbase.com/issues/browse/JCBC-121)

 * Behind the scenes, the HTTP query parameters for the views are now properly
   encoded. This means that passing characters like spaces don't break view queries
   anymore. This fix also ensures that query parameters generated through
   ComplexKey.of work properly.

   *Issues* : [JCBC-126](http://www.couchbase.com/issues/browse/JCBC-126)

 * The update\_seq param has been removed from the possible Query options because
   it has also been removed from Couchbase Server 2.0 as well.

<a id="couchbase-sdk-java-rn_1-1-0c"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp3 Developer Preview (19 September 2012)

**Fixes in 1.1-dp3**

 * Default Observe poll latency has been changed to 100ms.

   *Issues* : [JCBC-109](http://www.couchbase.com/issues/browse/JCBC-109)

 * The options with Views as documented in
   [http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html)
   is available. The options STOP and CONTINUE can be set as below.

    ```
    query.setOnError(OnError.CONTINUE);
    ```

   *Issues* : [JCBC-25](http://www.couchbase.com/issues/browse/JCBC-25)

 * Netty has been upgraded to 3.5.5.

   *Issues* : [JCBC-106](http://www.couchbase.com/issues/browse/JCBC-106)

 * Operation Status message has been changed from hard coded value to be based on
   tunable parameters.

   *Issues* : [JCBC-107](http://www.couchbase.com/issues/browse/JCBC-107)

**Known Issues in 1.1-dp3**

 * The Paginator object has been changed to handle this. The following code listing
   illustrates how to use the Paginator object and iterate through the pages and
   between the rows.

    ```
    Paginator result = client.paginatedQuery(view, query, 15);

     while (result.hasNext()) {
     ViewResponse response = result.next();
     for (ViewRow row: response) {
     System.out.println("Next Row: " + row.getId());
     }
     System.out.println("<=== Page ====>");
     }
    ```

   *Issues* : [JCBC-40](http://www.couchbase.com/issues/browse/JCBC-40)

<a id="couchbase-sdk-java-rn_1-1-0b"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp2 Developer Preview (23 August 2012)

**New Features and Behaviour Changes in 1.1-dp2**

 * The `set()` and `delete()` methods now support the ability to observe the
   persistence on the master and replicas. Using these methods, it's possible to
   set the persistence requirements for the data on the nodes.

   These methods are supported in Couchbase server build 1554 or higher.

   The persistence requirements can be specified in terms of how the data should be
   persisted on the master and the replicas using `PeristTo` and `ReplicateTo`
   respectively.

   The client library will poll the server until the persistence requirements are
   met. The method will return FALSE if the requirments are impossible to meet
   based on the configuration (inadequate number of replicas) or even after a set
   amount of retries the persistence requirments could not be met.

   The program snippet below illustrates how to specify a requirement that the data
   should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist to all four nodes including master
    OperationFuture<Boolean> setOp =
     c.set("key", 0, "value", PersistTo.FOUR);
    System.out.printf("Result was %b", setOp.get());
    ```

   The program snippet below illustrates how to specify a requirement that the data
   deletion should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist of delete to all four nodes including master
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.FOUR);
    System.out.printf("Result was %b",deleteOp.get());
    ```

   The program snippet below illustrates how to specify a requirement that the data
   deletion should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist of delete to all four nodes including master
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.FOUR);
    System.out.printf("Result was %b",deleteOp.get());
    ```

   The peristence requirements can be specified for both the master and replicas.
   In the case above, it's required that the key and value is persisted on all the
   4 nodes (including replicas).

   The same persistence requirment can be specified in a slightly different form as
   below.

    ```
    // Perist to master and three replicas
    OperationFuture<Boolean> setOp =
     c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", setOp.get());
    ```

   The same persistence requirment can be specified in a slightly different form as
   below.

    ```
    // Perist of delete to master and three replicas
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", deleteOp.get());
    ```

**Fixes in 1.1-dp2**

 * The Java client library throws exception for non-200 http view responses.

   *Issues* : [JCBC-72](http://www.couchbase.com/issues/browse/JCBC-72)

 * The issue is now fixed.

   *Issues* : [JCBC-20](http://www.couchbase.com/issues/browse/JCBC-20)

 * The Getting Started has a brief explanation of JSON and has a simple example of
   persisting JSON data.

   *Issues* : [JCBC-97](http://www.couchbase.com/issues/browse/JCBC-97)

 * This issue is now fixed.

   *Issues* : [JCBC-68](http://www.couchbase.com/issues/browse/JCBC-68)

 * This issue is now fixed.

   *Issues* : [JCBC-69](http://www.couchbase.com/issues/browse/JCBC-69)

**Known Issues in 1.1-dp2**

 * unlock() method does not check for server errors. The method should check for
   the error and raise an exception.

   *Issues* : [SPY-97](http://www.couchbase.com/issues/browse/SPY-97)

<a id="couchbase-sdk-java-rn_1-1-0a"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp Developer Preview (16 March 2012)

**New Features and Behaviour Changes in 1.1-dp**

 * The Views functionality has been added to the Couchbase-client library. Views is
   available starting with Couchbase Server 2.0. For more details on this feature
   refer to [Couchbase Server
   Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

   The purpose of a view is take the structured data stored within your Couchbase
   Server database as JSON documents, extract the fields and information that is
   needed, and to produce an index of the selected information. The result is a
   view on the stored data.

   The view that is created during this process can be iterated, selected and
   queried with the information in the database from the raw data objects that have
   been stored using Java objects such as `View`, `Query`, `ViewFuture`,
   `ViewResponse` and `ViewRow`.

   The following code fragment illustrates how to use the objects and access the
   view.

    ```
    Query query = new Query();

     query.setReduce(false);
     query.setIncludeDocs(true);
     query.setStale(Stale.FALSE);

     // Specify the design and document (by default production mode)
     View view = client.getView("chat", "messages");

     if (view == null) {
     // Take corrective action
     }

     ViewResponse result = client.query(view, query);

     Iterator<ViewRow> itr = result.iterator();
     ViewRow row;

     while (itr.hasNext()) {
     row = itr.next();
     String doc = (String) row.getDocument();
     // Do something for each row
     }
    ```

**Fixes in 1.1-dp**

 * The `CouchbaseConnectionFactory` which was not being closed properly has been
   fixed. The [TapConnectionProvider
   patch](http://www.couchbase.com/issues/browse/JCBC-16) has been integrated.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.

