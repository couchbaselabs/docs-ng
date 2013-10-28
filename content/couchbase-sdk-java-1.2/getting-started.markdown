# Getting Started

This section shows you the basics of Couchbase Server and how to interact
with it through the Java Client SDK. Here's a quick outline of what you'll do
in this section:

 1. Create a project in your favorite IDE and set up the dependencies.

 1. Write a simple program that demonstrates how to connect to Couchbase Server and save some documents.

 1. Write a program that demonstrates how to use create, read, update, and delete (CRUD)
    operations on documents in combination with JSON serialization and
    deserialization.

 1. Explore some of the API methods that provide more specialized functions.

At this point we assume that you have a Couchbase Server 2.2 release running and
you have the **beer-sample** bucket configured. If you need help setting up
everything, see the following documents:

 * [Using the Couchbase Web
   Console](http://docs.couchbase.com/couchbase-manual-2.2/#using-the-web-console) for information about using the Couchbase Administrative Console

 * [Couchbase
   CLI](http://docs.couchbase.com/couchbase-manual-2.2/#command-line-interface-for-administration) for information about the command line interface

 * [Couchbase REST
   API](http://docs.couchbase.com/couchbase-manual-2.2/#using-the-rest-api) for information about creating and managing Couchbase resources

The TCP/IP port allocation on Microsoft Windows by default includes a restricted number of
ports available for client communication. For more information about this issue,
including information about how to adjust the configuration and increase the number of
available ports, see <a href=http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx>MSDN: Avoiding TCP/IP Port Exhaustion</a>.

<a id="getting-started-preparations"></a>
## Preparation

To get ready to build your first app, you need to install Couchbase Server, download the Couchbase Java SDK, and set up your IDE.

**Installing Couchbase Server**

Get the [latest
Couchbase Server 2.2](http://couchbase.com/download) release and install it.

As you follow the download instructions and setup wizard, make sure you install the
**beer-sample** default bucket. It contains beer and brewery sample data,
which you use with the examples.

If you already have Couchbase Server 2.2 but do not have the **beer-sample**
bucket installed, open the Couchbase Web Console and select
**Settings > Sample Buckets**. Select the **beer-sample** checkbox, and then click
**Create**. A notification box in the upper-right corner disappears when the bucket is ready to use.

**Downloading the Couchbase Client Libraries**

To include the Client SDK in your project, you can either
manually include all dependencies in your `CLASSPATH`, or if you want it to be
easier, you can use a dependency manager such as [Maven](http://maven.apache.org/). Since the Java SDK 1.2.0 release,
all Couchbase-related dependencies are published in the [Maven Central Repository](http://search.maven.org/).

To include the libraries directly in your project,
[download the archive](http://www.couchbase.com/communities/java/getting-started) and add
all the JAR files to your `CLASSPATH` of the system/project. Most IDEs also allow
you to add specific JAR files to your project. Make sure you add the following
dependencies in your `CLASSPATH` :

 * couchbase-client-1.2.1.jar, or latest version available

 * spymemcached-2.10.1.jar

 * commons-codec-1.5.jar

 * httpcore-4.1.1.jar

 * netty-3.5.5.Final.jar

 * httpcore-nio-4.1.1.jar

 * jettison-1.1.jar


If you use a dependency manager, the syntax varies for each tool. The following examples show how to set up the dependencies when using Maven, sbt (for Scala programs), and Gradle.

To use Maven to include the SDK, add the following dependency to your **pom.xml** file:

```xml
<dependency>
    <groupId>com.couchbase.client</groupId>
    <artifactId>couchbase-client</artifactId>
    <version>1.2.1</version>
</dependency>
```

If you program in [Scala](http://scala-lang.org/) and want to manage your dependencies 
through [sbt](http://www.scala-sbt.org/), then you can do it with these additions to
your **build.sbt** file:


```
libraryDependencies += "couchbase" % "couchbase-client" % "1.2.1"
```

For [Gradle](http://www.gradle.org/) you can use the following snippet:

```groovy
repositories {
  mavenCentral()
}

dependencies {
  compile "com.couchbase.client:couchbase-client:1.2.1"
}
```

Now that you have all needed dependencies in the `CLASSPATH` environment variable, you can set up your IDE.

**Setting up your IDE**

The [NetBeans IDE](http://netbeans.org/) is used in this example, but you can use
any other Java-compatible IDE. After you install the
NetBeans IDE and open it:

 1. Select **File > New Project > Maven > Java Application**, and then click **Next**.

    ![](images/maven_setup2.png)

 1. Enter a name for your new project and change the location to the
    directory you want.

	We named the project "examples."

    ![](images/maven_setup1.png)

 1. Enter a namespace for the project in the **Group Id** field. 

	We used the `com.couchbase` namespace for this example, but you can use your own if you like. If you do so, just make sure you change the namespace later in the source files when you copy them from our examples.

    Now that your project, you can add the Couchbase Maven repository to use the
    Java SDK.

1. Click **Finish**.

 1. In the **Projects** window,  right-click  **Dependencies > Add
    Dependency**. 

1.  Enter the following settings to add the Couchbase Java SDK from the Maven repository:

     * **Group ID**: com.couchbase.client

     * **Artifact ID**: couchbase-client

     * **Version**: 1.2.1

	For now, you need to add only the Couchbase Java SDK itself because the
    transitive dependencies are fetched automatically.

1. Click **Add**.

Now all the dependencies are in place and you can move forward to your first
application with Couchbase.

<a id="hello-world"></a>

## Hello Couchbase

To follow the tradition of first programming tutorials, we start with a "Hello
Couchbase" example. In this example, we connect to the a Couchbase node, set a
simple document, retrieve the document, and then print the value out. This first
example contains the full source code, but in later examples we omit the import
statements and also assume an existing connection to the cluster.

**Listing 1: Hello Couchbase!**

```java
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
    client.set("hello", "couchbase!").get();

    // Return the result and cast it to string
    String result = (String) client.get("hello");
    System.out.println(result);

    // Shutdown the client
    client.shutdown();
  }
}
```

The code in Listing 1 is very straightforward, but there is a lot going on that is worth a
little more discussion:

 * **Connect**. The `CouchbaseClient` class accepts a list of URIs that point to nodes in the cluster. If your cluster has more than one node, Couchbase strongly recommends that you add at least two or three URIs to the list. The list does not have to contain all nodes in the cluster, but you do need to provide a few nodes so that during the initial connection phase your client can connect to the cluster even if one or more nodes fail.

    After the initial connection, the client automatically fetches cluster configuration
    and keeps it up-to-date, even when the cluster topology changes. This means that you do not need to change your application configuration at all when you add
    nodes to your cluster or when nodes fail. Also make sure you use a URI in this
    format: `http://[YOUR-NODE]:8091/pools`. If you provide only the IP address, your client will fail to connect. We call this initial URI the *bootstrap URI*.

    The next two arguments are for the `bucket` and the `password`. The bucket is
    the container for all your documents. Inside a bucket, a key &mdash; the identifier for a document &mdash; must be unique. In production environments, Couchbase recommends that you use a password on the bucket (this can be configured during bucket creation), but when you are just starting out using the `default` bucket without a password is fine. The **beer-sample** bucket also doesn't have a password, so just change the bucket name and you're set.

* **Set and get.** These two operations are the most important ones you will use
    from a Couchbase SDK. You use `set` to create or overwrite a document and you
    use `get` to read it from the server. There are lots of arguments and variations
    for these two methods, but if you use them as shown in the previous example it
    will get you pretty fair in your application development.

    Note that the `get` operation will read all types of information, including
    binary, from the server, so you need to cast it into the data format you want.
    In our case we knew we stored a string, so it makes sense to convert it back to
    a string when we get it later.

* **Disconnect** when you shutdown your server instance, such as at the end of
    your application, you should use the `shutdown` method to prevent loss of data.
    If you use this method without arguments, it waits until all outstanding
    operations finish, but does not accept any new operations. You can also call
    this method with a maximum waiting time that makes sense if you do not want
    your application to wait indefinitely for a response from the server.

The logger for the Java SDK logs from `INFO` upwards by default. This means the Java SDK logs a good amount of
information about server communications. From our Hello Couchbase example the
log looks like this:


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

From the log, you can determine which nodes the client is connected to, see whether views on
the server are in development or production mode, and view other helpful output.
These logs provide vital information when you need to debug any issues on
Couchbase community forums or through Couchbase Customer Support.

<a id="read-docs"></a>

## Reading Documents

With Couchbase Server 2.0, you have two ways of fetching your documents: either
by the unique key through the `get` method, or through Views. Because Views are
more complex we will discuss them later in this guide. In the meantime, we show
`get` first:


```java
Object get = client.get("mykey");
```

Because Couchbase Server stores all types of data, including binary, `get` returns an object of type `Object`. If you store JSON documents, the actual document is a
string, so you can safely convert it to a string:


```java
String json = (String) client.get("mykey");
```

If the server finds no document for that key, it returns a `null`. It is
important that you check for `null` in your code, to prevent
`NullPointerExceptions` later down the stack.

With Couchbase Server 2.0 and later, you can also query for documents with secondary
indexes, which we collectively call
[Views](http://docs.couchbase.com/couchbase-manual-2.2/#views-and-indexes).
This feature enables you to provide *map functions* to extract information and
you can optionally provide *reduce functions* to perform calculations on
information. This guide gets you started on how to use views through the Java
SDK. If you want to learn more, including how to set up views with Couchbase Web
Console, see [Using the Views Editor](http://docs.couchbase.com/couchbase-manual-2.2/#using-the-views-editor) in the *Couchbase Server Manual*.

This next example assumes you already have a view function set up with
Couchbase Web Console. After you create your View in the Couchbase Web Console, you can
query it from the Java SDK in three steps. First, you get the view definition
from the Couchbase cluster, second you create a `Query` object and third, you
query the cluster with both the `View` and the `Query` objects. In its simplest
form, it looks like this:


```java
// 1: Get the View definition from the cluster
View view = client.getView("beer", "brewery_beers");

// 2: Create the query object
Query query = new Query();

// 3: Query the cluster with the view and query information
ViewResponse result = client.query(view, query);
```

The `getView()` method needs both the name of the design document and the name
of the view to load the proper definition from the cluster. The SDK needs them
to determine whether there is a view with the given map functions and also whether it
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

Now that we have our `view` and the `query` objects in place, we can
issue the `query` command, which actually triggers indexing on a Couchbase
cluster. The server returns the results to the Java SDK in the `ViewResponse`
object. We can use it to iterate over the results and print out some details.
Here is a more complete example, which also includes the full documents and fetches only the first five results:


```java
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


```java
OperationFuture<Boolean> delete = client.delete("key");
```

Again, `delete` is an asynchronous operation and therefore returns a
`OperationFuture` object on which you can block through the `get()` method. If you try
to delete a document that is not there, the result of the `OperationFuture` is `false`. Be aware that when you delete a document, the server does not
immediately remove a copy of that document from disk, instead it performs lazy
deletion for items that expired or deleted items. For more information about how
the server handles lazy expiration, see [About Document
Expiration](http://docs.couchbase.com/couchbase-devguide-2.2/#about-document-expiration) in the *Couchbase Server Developer Guide*.

<a id="next-steps"></a>

## Next Steps

You are now ready to start exploring Couchbase Server and the Java SDK on your own.
If you want to learn more and see a full-fledged application on top of Couchbase
Server 2.2, read the [Web Application Tutorial](http://docs.couchbase.com/couchbase-sdk-java-1.2/#tutorial). The [Couchbase Server Manual](http://docs.couchbase.com/couchbase-manual-2.2/) and the [Couchbase Developer Guide](http://docs.couchbase.com/couchbase-devguide-2.2/) provide useful information for your day-to-day work with Couchbase Server. You can also look at the [Couchbase Java SDK API Reference](http://www.couchbase.com/autodocs/couchbase-java-client-1.2.0/index.html).

