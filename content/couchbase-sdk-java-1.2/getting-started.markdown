# Getting Started

This chapter will teach you the basics of Couchbase Server and how to interact
with it through the Java Client SDK. Here's a quick outline of what you'll learn
in this chapter:

 1. Create a project in your favorite IDE and set up the dependencies.

 1. Write a simple program to demonstrate connecting to Couchbase and saving some
    documents.

 1. Write a program to demonstrate using Create, Read, Update, Delete (CRUD)
    operations on documents in combination with JSON serialization and
    deserialization.

 1. Explore some of the API methods that will provide more specialized functions.

At this point we assume that you have a Couchbase Server 2.0 release running and
you have the "beer-sample" bucket configured. If you need any help on setting up
everything, see the following documents:

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

## Preparation

**Installing Couchbase Server**

You will need the latest version of Couchbase Server. You can get [the latest
Couchbase Server 2.0](http://couchbase.com/download) release and install it.

As you follow the download instructions and setup wizard, make sure install the
`beer-sample` default bucket. It contains sample data of beers and breweries,
which that you will use with the examples here.

If you already have Couchbase Server 2.0 and but do not have the `beer-sample`
bucket or you deleted it, open the Couchbase Web Console and navigate to
`Settings/Sample Buckets`. Activate the `beer-sample` checkbox and click
`Create`. In the right hand corner you will see a notification box that will
disappear once the bucket is ready to be used.

**Downloading the Couchbase Client Libraries**

There are two options to include the Client SDK in your project. You can either
manually include all dependencies in your `CLASSPATH` or if you want it to be
easier, you can use [Maven](http://maven.apache.org/).

To include the libraries directly in your project,
[download](http://www.couchbase.com/develop/java/current) the archive and add
all `jar` files to your `CLASSPATH` of the system/project. Most IDEs also enable
you add specific `jar` files to your project. Make sure you add the following
dependencies in your `CLASSPATH` :

 * couchbase-client-1.1.5.jar, or latest version available

 * spymemcached-2.8.12.jar

 * commons-codec-1.5.jar

 * httpcore-4.1.1.jar

 * netty-3.5.5.Final.jar

 * httpcore-nio-4.1.1.jar

 * jettison-1.1.jar

Alternatively, you can use a build manager to handle them for you. Couchbase
provides a [Maven](http://maven.apache.org/) repository that you can use which
automatically includes the SDK dependencies. The root URL of the repository is
located under
[http://files.couchbase.com/maven2/](http://files.couchbase.com/maven2/).
Depending on your build manager, the exact syntax you use to include it may
vary. Here is an example on how to do it in Maven by updating your `pom.xml` :


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
    <version>1.1.4</version>
    <scope>provided</scope>
</dependency>
```

If you have a background in Scala and want to manage your dependencies through
[sbt](http://www.scala-sbt.org/), then you can do it with these additions to
your `build.sbt` :


```
resolvers += "Couchbase Maven Repository" at "http://files.couchbase.com/maven2"

libraryDependencies += "couchbase" % "couchbase-client" % "1.1.4"
```

Now that you have the Java SDK third party dependencies set up in your classpath
or via a build manager, you can set up your IDE to use the SDK.

**Setting up your IDE**

In this example we use the [NetBeans IDE](http://netbeans.org/), but you can use
any other Java-compatible IDE with the Java SDK as well. After you install the
IDE and open it:

 1. Select `File -> New Project` -> `Maven` -> `Java Application`.


    ![](images/maven_setup2.png)

 1. Provide a name for your new project "examples" and change the location to the
    directory you want.

 1. Provide a name for your new project "examples" and change the location to the
    directory you want.


    ![](images/maven_setup1.png)

 1. Provide a namespace for the project. We use the `com.couchbase` namespace for
    this example, but you can use your own if you like. If you do so, just make sure
    you change the namespace later in the source files when you copy them from our
    examples.

    Now that your project, you can add the Couchbase Maven repository to use the
    Java SDK.

 1. Select `Window -> Services` to open a list of available services.

 1. Under the `Maven Repositories` tree, right click on the Couchbase Java SDK and
    click `Add Repository`.

 1. Use the following settings for the repository:

     * ID: couchbase

     * Name: Couchbase Maven Repository

     * URL: http://files.couchbase.com/maven2/

 1. Go back to your new project and right click on `Dependencies`, and then `Add
    Dependency`. For now, we only need to add the Couchbase SDK itself, because the
    transitive dependencies will be fetched automatically. Use the following
    settings:

     * Group ID: couchbase

     * Artifact ID: couchbase-client

     * Version: 1.1.4

Now all the dependencies are in place and we can move forward to our first
application with Couchbase.

<a id="hello-world"></a>

## Hello Couchbase

To follow the tradition of first programming tutorials, we start with a "Hello
Couchbase" example. In this example, we connect to the a Couchbase node, set a
simple document, retrieve the document, and then print the value out. This first
example contains the full source code, but in later examples we omit the import
statements and also assume an existing connection to the cluster.

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

 1. **Connect:** the CouchbaseClient accepts a List of `URIs` that point to nodes in
    the Cluster. You can provide only one `URI` however we strongly recommend that
    you add two or three if your cluster has more than one node. Be aware that this
    list does not have to contain all nodes in the cluster; you need to provide a
    few so that during the initial connection phase your client can connect to the
    cluster even if one or more nodes fail.

    After initial connection, the Client automatically fetches cluster configuration
    and keeps it up to date, even when the cluster topology changes. This means that
    you do not need to change your application configuration at all when you add
    nodes to your cluster or when nodes fail. Also keep in mind to use a URI in this
    format: `http://[YOUR-NODE]:8091/pools`. If you only provide the IP address,
    your client will fail to connect. We call this initial URI the *bootstrap URI*.

    The next two arguments are for the `bucket` and the `password`. The bucket is
    the container for all your documents. Inside a bucket, a key - the identifier
    for a document - must be unique. In production environments, it is recommended
    to use a password on a bucket (this can be configured during bucket creation),
    but when you are just starting out using the `default` bucket without a password
    is fine. Note that the `beer-sample` bucket also doesn't have a password, so
    just change the bucket name and you're set.

 1. **Set and get:** these two operations are the most important ones you will use
    from a Couchbase SDK. You use `set` to create or overwrite a document and you
    use `get` to read it from the server. There are lots of arguments and variations
    for these two methods, but if you use them as shown in the previous example it
    will get you pretty fair in your application development.

    Note that the `get` operation will read all types of information, including
    binary, from the server, so you need to cast it into the data format you want.
    In our case we knew we stored a string, so it makes sense to convert it back to
    a string when we get it later.

 1. **Disconnect** when you shutdown your server instance, such as at the end of
    your application, you should use the `shutdown` method to prevent loss of data.
    If you use this method without arguments, it will wait until all outstanding
    operations complete, but will not accept any new operations. You can also call
    this method with a maximum waiting time which makes sense if you do not want
    your application to wait indefinitely for a response from the server.

Be aware that by default, the logger for the Java SDK will log from `INFO`
upwards by default. This means the Java SDK will log a good amount of
information about server communications. From our Hello Couchbase example the
log look likes this:


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

You can determine which nodes the client is connected to, see whether views on
the server are in development or production mode, and other helpful output.
These logs provide vital information when you need to debug any issues on
Couchbase community forums or through Couchbase Customer Support.

<a id="read-docs"></a>

## Reading Documents

With Couchbase Server 2.0, you have two ways of fetching your documents: either
by the unique key through the `get` method, or through Views. Since Views are
more complex we will discuss them later in this guide. In the meantime, we show
`get` first:


```
Object get = client.get("mykey");
```

Since Couchbase Server will store all types of datatypes, including binary, you
get a `Object` back. If you store JSON documents the actual document will be a
String, so you can safely convert it to a string:


```
String json = (String) client.get("mykey");
```

If the server finds no document for that key it will return a `null`. It is
important that you check for `null` in your code, to prevent
`NullPointerExceptions` later down the stack.

With Couchbase Server 2.0, you can also query for documents with secondary
indexes, which we collectively call
[Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).
This feature enables you to provide *map functions* to extract information and
you can optionally provide *reduce functions* to perform calculations on
information. This guide gets you started on how to use them through the Java
SDK, if you want to learn more, including how to set up views with Couchbase Web
Console please see [Couchbase Server Manual,
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

This next example assumes you already have a views function set up with
Couchbase Web Console. Once you create your View in the Web Console, you can
query it from the Java SDK in three steps. First, you get the View definition
from the Couchbase cluster, second you create a `Query` object and third, you
query the cluster with both the `View` and the `Query` objects. In its simplest
form, it looks like this:


```
// 1: Get the View definition from the cluster
View view = client.getView("beer", "brewery_beers");

// 2: Create the query object
Query query = new Query();

// 3: Query the cluster with the view and query information
ViewResponse result = client.query(view, query);
```

The `getView()` method needs both the name of the `Design Document` and the name
of the `View` to load the proper definition from the cluster. The SDK needs this
to determine if there is a view with the given map functions and also if it
contains a reduce function or is even a spatial view.

You can query views with several different options. All options are available as
setter methods on the `Query` object. Here are some of them:

 * `setIncludeDocs(boolean)` : Use to define if the complete documents should be
   included in the result.

 * `setReduce(boolean)` : Used to enable/disable the reduce function (if there is
   one defined on the server).

 * `setLimit(int)` : Limit the number of results that should be returned.

 * `setDescending(boolean)` : Revert the sorting order of the result set.

 * `setStale(Stale)` : Can be used to define the tradeoff between performance and
   freshness of the data.

 * `setDebug(boolean)` : Prints out debugging information in the logs.

Now that we have our View information and the Query object in place, we can
issue the `query` command, which actually triggers indexing on a Couchbase
cluster. The server returns the results to the Java SDK in the `ViewResponse`
object. We can use it to iterate over the results and print out some details
(here is a more complete example which also includes the full documents and only
fetches the first five results):


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

In the logs, you can see the corresponding document keys automatically sorted in
ascending order:


```
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
21st_amendment_brewery_cafe-bitter_american
```

<a id="delete-docs"></a>

## Deleting Documents

If you want to get delete documents, you can use the `delete` operation:


```
OperationFuture<Boolean> delete = client.delete("key");
```

Again, `delete` is an asynchronous operation and therefore returns a
`OperationFuture` on which you can block through the `get()` method. If you try
to delete a document that is not there, the result of the `OperationFuture` will
be `false`. Be aware that when you delete a document, the server does not
immediately remove a copy of that document from disk, instead it performs lazy
deletion for items that expired or deleted items. For more information about how
the server handles lazy expiration, see [Couchbase Developer Guide, About
Document
Expiration](http://www.couchbase.com/docs/couchbase-devguide-2.0/about-ttl-values.html).

<a id="next-steps"></a>

## Next Steps

You are now ready start exploring Couchbase Server and the Java SDK on your own.
If you want to learn more and see a full-fledged application on top of Couchbase
Server 2.0, go to to the [Web Application
Tutorial](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/tutorial.html).
Also, the [server
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/) and the
[developer
documentation](http://www.couchbase.com/docs/couchbase-devguide-2.0/index.html)
provide useful information for your day-to-day work with Couchbase. Finally, the
API docs of the Java SDK can be found
[here](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/api-reference-summary.html).
And JavaDoc is also
[available](http://www.couchbase.com/autodocs/couchbase-java-client-1.1.4/index.html).

<a id="tutorial"></a>
