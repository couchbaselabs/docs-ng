# Tutorial

This tutorial builds on the foundation introduced in the [Getting Started](http://docs.couchbase.com/couchbase-sdk-java-1.4/#getting-started) section and evolves the introduced concepts further by implementing a complete web application. Make sure you have the `beer-sample` bucket installed because the application allows you to display and manage beers and breweries. If you need to get the sample database, see [Preparation](#getting-started-preparations).

The full source code for the example is available at [couchbaselabs on GitHub](http://github.com/couchbaselabs/beersample-java). The sample application that you can download provides more content than we describe in this tutorial; but it should be easy for you to look around and understand how it functions if you first start reading this tutorial here.

<a id="quickstart"></a>

## Preview the Application

If you want to get up and running really quickly, here is how to do it with [Jetty](http://jetty.codehaus.org/jetty/). This guide assumes you are using  OS X or Linux. If you are using Windows, you need to modify the paths accordingly. Also, make sure you have [Maven](http://maven.apache.org/) installed on your machine.

 1. [Download](http://www.couchbase.com/downloads) Couchbase Server 2.5 or later and [install](http://docs.couchbase.com/couchbase-manual-2.5/cb-install/) it. Make sure you install the [beer-sample](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#sample-buckets) data set when you run the wizard because this tutorial uses it.

 1. Add the following views and design documents to the `beer-sample` bucket. 

	Views and design documents enable you to index and query data from the database. Later we will publish the views as production views. For more information about using views from an SDK, see [Couchbase Developer Guide, Finding Data with
    Views](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#querying-views).

    The first design document name is `beer` and view name is `by_name`:

     ```javascript
     function (doc, meta) {
       if(doc.type && doc.type == "beer") {
         emit(doc.name, null);
       }
     }
     ```

    The other design document name is `brewery` and view name is `by_name`:

     ```javascript
     function (doc, meta) {
       if(doc.type && doc.type == "brewery") {
         emit(doc.name, null);
       }
     }
     ```

 1. Clone the Java SDK beer repository from
    [GitHub](https://github.com/couchbaselabs/beersample-java) and `cd` into the
    directory:

     ```
     $ git clone git://github.com/couchbaselabs/beersample-java.git
     Cloning into 'beersample-java'...
     remote: Counting objects: 153, done.
     remote: Compressing objects: 100% (92/92), done.
     remote: Total 153 (delta 51), reused 124 (delta 22)
     Receiving objects: 100% (153/153), 81.97 KiB | 120 KiB/s, done.
     Resolving deltas: 100% (51/51), done.
     $ cd beersample-java
     ```

 1. In Maven, run the application inside the Jetty container:

     ```
     $ mvn jetty:run
     .... snip ....
     Dec 17, 2012 1:50:16 PM com.couchbase.beersample.ConnectionManager contextInitialized
     INFO: Connecting to Couchbase Cluster
     2012-12-17 13:50:16.621 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
     2012-12-17 13:50:16.624 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@2e2a730e
     2012-12-17 13:50:16.635 WARN net.spy.memcached.auth.AuthThreadMonitor:  Incomplete authentication interrupted for node {QA sa=localhost/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=8}
     2012-12-17 13:50:16.662 WARN net.spy.memcached.auth.AuthThread:  Authentication failed to localhost/127.0.0.1:11210
     2012-12-17 13:50:16.664 INFO net.spy.memcached.auth.AuthThread:  Authenticated to localhost/127.0.0.1:11210
     2012-12-17 13:50:16.666 INFO com.couchbase.client.ViewConnection:  Added localhost to connect queue
     2012-12-17 13:50:16.667 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
     2012-12-17 13:50:16.866:INFO::Started SelectChannelConnector@0.0.0.0:8080
     [INFO] Started Jetty Server
     ```

 1. Navigate to [http://localhost:8080/welcome](http://localhost:8080/welcome) and enjoy the application.

<a id="preparations"></a>

## Preparing Your Project

This tutorial uses Servlets and JSPs in combination with Couchbase Server 2.5 to
display and manage beers and breweries found in the `beer-sample` data set. The
easiest way to develop apps is by using an IDE such as [Eclipse](http://www.eclipse.org) or [NetBeans](https://netbeans.org). You
can use the IDE to automatically publish apps to an application server such as
Apache Tomcat or GlassFish as a WAR file. We designed the code here to be as portable as possible, but you might need to change one or two things if you have a slightly different version or a customized setup in your environment.

<a id="preps-project"></a>

### Project Setup

In your IDE, create a new `Web Project`, either with or without Maven support.
If you have not already gone through the Getting Started section for the Java SDK, you
should review the information on how to include the Couchbase SDK and all the
required dependencies in your project. For more information, see
[Preparation](#getting-started-preparations).

Also make sure to include [Google GSON](https://code.google.com/p/google-gson/) or your favorite JSON library as well.

This tutorial uses the following directory structure:


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

If you use Maven, you should also have a **pom.xml** file in the root directory. Here
is a sample **pom.xml** so you can see the general structure and dependencies. The
full source is at the repository we mentioned earlier. See [couchbaselabs on
GitHub](http://github.com/couchbaselabs/beersample-java) for the full **pom.xml** file.


```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.couchbase</groupId>
    <artifactId>beersample-java</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>beersample-java</name>

    <dependencies>
        <dependency>
            <groupId>com.couchbase.client</groupId>
            <artifactId>couchbase-client</artifactId>
            <version>1.4.5</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.2.4</version>
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

To make the application more interactive, we use jQuery and Twitter Bootstrap.
You can either download the libraries and put them in their appropriate **css** and
**js** directories under the **webapp** directory, or clone the project repository and use it from there. Either way, make sure you have the following files in place:

 * [css/beersample.css](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/beersample.css)

 * [css/bootstrap.min.css (the minified twitter bootstrap
   library)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/bootstrap.min.css)

 * [css/bootstrap-responsive.min.css (the minified responsive layout classes from
   bootstrap)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/css/bootstrap-responsive.min.css)

 * [js/beersample.js](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/js/beersample.js)

 * [js/jquery.min.js (the jQuery javascript
   library)](https://raw.github.com/couchbaselabs/beersample-java/master/src/main/webapp/js/jquery.min.js)

From here, you should have a basic web application configured that has all the
dependencies included. We now move on and configure the `beer-sample` bucket so
we can use it in our application.

<a id="preps-views"></a>

### Creating Your Views

Views enable you to index and query data from your database. The **beer-sample**
bucket comes with a small set of predefined view functions, but to have our
application function correctly we need some more views. This is also a very good
chance for you to see how you can manage views inside Couchbase Web Console. For
more information on the topics, see [Couchbase Developer Guide, Finding Data
with
Views](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#querying-views
and [Couchbase Manual, Using the Views
Editor](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#using-the-views-editor).

Because we want to list beers and breweries by their name, we need to define one
view function for each type of result that we want.

 1. In Couchbase Web Console, click  **Views** .

 1. From the drop-down list box, choose the **beer-sample** bucket.

 1. Click  **Development Views**, and then click **Create Development View** to define your first view.

 1. Give the view the names of both the design document and the actual view.
    Insert the following names:

    Design Document Name: `_design/dev_beer`

    View Name: `by_name`

    The next step is to define the `map` function and optionally at this phase
    you could define a `reduce` function to perform information on the index
    results. In our example, we do not use the `reduce` functions at all, but you can play around with reduce functions ro see how they work. For more information, see Couchbase
    Developer Guide, [Using Built-in Reduce
    Functions](http://docs.couchbase.com/couchbase-devguide-2.5/#using-built-in-reduces)
    and [Creating Custom
    Reduces](http://docs.couchbase.com/couchbase-devguide-2.5/#creating-custom-reduces).

 1. Insert the following JavaScript `map` function and click **Save**.

     ```javascript
     function (doc, meta) {
       if(doc.type && doc.type == "beer") {
         emit(doc.name, null);
       }
     }
     ```

Every `map` function takes the full document ( `doc` ) and its associated
metadata ( `meta` ) as the arguments. Your map function can then inspect this
data and `emit` the item to a result set when you want to have it in your index.
In our case we emit the name of the beer ( `doc.name` ) when the document has a
type field and the type is `beer`. For our application we do not need to emit a
value; therefore we emit a `null` here.

In general, you should try to keep the index as small as possible. You should
resist the urge to include the full document with `emit(meta.id, doc)`, because
it will increase the size of your view indexes and potentially impact application performance. If you need to access the full document or large parts
of it, use the `setIncludeDocs(true)` directive, which does a `get()` call with the document ID in the background. Couchbase Server might return a version of
the document that is slightly out of sync with your view, but it will be a fast and efficient operation.

Now we need to provide a similar map function for the breweries. Because you already know how to do this, here is all the information you need to create it:

 * Design Document Name: `_design/dev_brewery`

 * View Name: `by_name`

 * Map Function:

    ```javascript
    function (doc, meta) {
      if(doc.type && doc.type == "brewery") {
        emit(doc.name, null);
      }
    }
    ```

The final step is to push the design documents to production
mode for Couchbase Server. While the design documents are in development mode, the index is applied only on the local node. See, [Couchbase Manual, Development and Production Views](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#development-and-production-views). To have the index on the whole data set:

 1. In Couchbase Web Console, click **Views**.

 1. Click the **Publish** button on both design documents.

 1. Accept any dialog that warns you from overriding the old view function.

For more information about using views for indexing and querying from Couchbase
Server, see the following useful resources:

 * General Information: [Couchbase Server Manual: Views and
   Indexes](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#view-basics).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#view-and-query-pattern-samples).

 * Time-stamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#date-and-time-selection).

<a id="preps-webxml"></a>

### Bootstrapping Our Servlets

To tell the application server where and how the incoming HTTP requests should
be routed, we need to define a `web.xml` inside the `WEB-INF` directory of our
project:


```xml
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

This is not ready to run yet, because you have not implemented any of these classes yet, but we will do that soon. The `listener` directive references the
`ConnectionMananger` class, which we implement to manage the connection instance to our Couchbase cluster. The `servlet` directives define the servlet classes
that we use and the following `servlet-mapping` directives map HTTP URLs to them. The final `welcome-file-list` directive tells the application server where to route the root URL ( `"/"` ).

For now, comment out all `servlet`, `servlet-mapping` and `welcome-file-list` directives with the `<!--` and `-->` tags, because the application server will complain that they are not implemented. When you implement the appropriate servlets, remove the comments accordingly. If you plan to add your own servlets, remember to add and map them inside the `web.xml` properly!

<a id="connection-management"></a>

## Managing Connections

The first class we implement is the `ConnectionManager` in the
**src/main/java/com/couchbase/beersample** directory. This is a
`ServletContextListener` that starts the `CouchbaseClient` on application startup and closes the connection when the application shuts down. Here is the
full class:


```java
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
    client.shutdown(60, TimeUnit.SECONDS);
  }

  public static CouchbaseClient getInstance() {
    return client;
  }

}
```

In this example, we removed the comments and imports  to shorten the listing a bit. The `contextInitialized` and `contextDestroyed` methods are called on start-up and shutdown. When the application starts, we initialize the `CouchbaseClient` with the list of nodes, the bucket name and an empty password. In a production deployment, you want to fetch these environment-dependent settings from a configuration file. We will call the `getInstance()` method from the servlets to obtain the `CouchbaseClient` instance.

When you publish your application, you should see in the server logs that the
Java SDK correctly connects to the bucket. If you see an exception at this phase, it means that your settings are wrong or you have no Couchbase Server running at the given nodes. Here is an example server log from a successful connection:


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

The first servlet that we implement is the `WelcomeServlet`, so go ahead and remove the appropriate comments inside the `web.xml` file. You also want to enable the `welcome-file-list` at this point. When a user visits the application, we show him a nice greeting and give him all available options to choose.

Because there is no Couchbase Server interaction involved, we just tell it to render the JSP template:


```java
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

The **index.jsp** file uses styling from Twitter bootstrap to provide a clean layout.
Aside from that, it shows a nice greeting and links to the servlets that provide the actual functionality:


```xml
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

There is one more interesting note to make here: it uses taglibs, which enables us to use the same layout for all pages. Because we have not created this layout, we do so now. Create the following **layout.tag** file in the **/WEB-INF/tags** directory:


```xml
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

Again, nothing fancy here. We just need it in place to make everything look clean afterwards. When you deploy your application, you should see in the logs that it is connects to the Couchbase cluster, and when you view it in the browser you should see a nice web page greeting.

<a id="managing-beers"></a>

## Managing Beers

Now we reach the main portion of the tutorial where we actually interact with Couchbase Server. First, we uncomment the `BeerServlet` and its corresponding tags inside the **web.xml** file. We make use of the view to list all beers and make them easily searchable. We also provide a form to create, edit, or delete beers.

Here is the bare structure of our `BeerServlet`, which will be filled with live data soon. Once again, we removed comments and imports for the sake of brevity:


```java
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

Because our **web.xml** file uses wildcards ( `*` ) to route every `/beer` that is
related to this servlet, we need to inspect the path through `getPathInfo()` and dispatch the request to a helper method that does the actual work. We use the
`doPost()` method to analyze and store the results of the web form. We also use
this method to edit and create new beers because we sent the form through a POST
request.

The first functionality we implement is a list of the top 20 beers in a table.
We can use the `beer/by_name` view we created earlier to get a sorted list of all beers. The following Java code belongs to the `handleIndex` method and builds the list:


```java
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

The index action in the code above queries the view, parses the results with
GSON into a `HashMap` object and eventually forwards the `ArrayList` to the JSP layer. At this point we can implement the **index.jsp** template which iterates over the `ArrayList` and prints out the beers in a nicely formatted table:


```xml
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

Here we use [JSP](http://en.wikipedia.org/wiki/JavaServer_Pages) tags to iterate
over the beers and use their properties, `name` and `id`, and fill the table rows with this information. In a browser you should now see a table with a list of beers with `Edit` and `Delete` buttons on the right. You can also see a link to the associated brewery that you can click on. Now we implement the delete action for each beer, because it's very easy to do with Couchbase:


```java
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

The delete method deletes a document from the cluster based on the given document key. Here, we wait on the `OperationFuture` to return from the `get()` method and if the server successfully deletes the item we get `true` and can redirect to the index action.

Now that we can delete a document, we want to enable users to edit beers.
The edit action is very similar to the delete action, but it reads and updates the document based on the given ID instead of deleting it. Before we can edit
a beer, we need to parse the string representation of the JSON document into a Java structure so we can use it in the template. We again make use of the Google GSON library to handle this for us:


```java
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
      request.setAttribute("title", "Modify Beer \"" + beer.get("name") + "\"");    } else {
      request.setAttribute("title", "Create a new beer");
    }

    request.getRequestDispatcher("/WEB-INF/beers/edit.jsp").forward(request, response);
  }
```


If the `handleEdit` method gets a beer document back from Couchbase Server and parses it into JSON, the document is converted to a `HashMap` object and then forwarded to the **edit.jsp** template. Also, we define a title variable that we use inside the template to determine whether we want to edit a document or create a new one. We can enable users to create new beers as opposed to editing an existing beer anytime we pass no Beer ID to the edit method. Here is the corresponding **edit.jsp** template:


```xml
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

This template is a little bit longer, but that is mainly because we have lots of fields on our beer documents. Note how we use the beer attributes inside the value attributes of the HTML input fields. We also use the unique ID in the form method to dispatch it to the correct URL on submit.

The last thing we need to do for form submission to work is the actual form parsing and storing itself. Since we do form submission through a POST request, we need to implement the `doPost()` method on our servlet: 

```java
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

The code iterates over all POST fields and stores them in a `HashMap` object. We then
use the `set` command to store the document to Couchbase Server and use Google
GSON to translate information out of the `HashMap` object into a JSON string. In this case, we could also wait for a `OperationFuture` response and return an error if we determine the `set` failed.

The last line redirects to a show method, which just shows all fields of the document. Because the patterns are the same as before, here is the `handleShow` method:


```java
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

Again we extract the ID and if Couchbase Server finds the document it gets parsed into a HashMap and forwarded to the **show.jsp** template. If the server finds no document, we get a return of null in the Java SDK. The template then just prints out all keys and values in a table:


```xml
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

In the **index.jsp** template, you might notice the search box at the top. We can use it to dynamically filter our table results based on the user input. We will use
nearly the same code for the filter as in the index method; except this time we make use of range queries to define a beginning and end to search for. For more information about performing range queries, see [Ordering](http://docs.couchbase.com/couchbase-manual-2.2/#view-and-query-pattern-samples).

Before we implement the actual Java method, we need to put the following snippet in the **js/beersample.js** file. You might have already done this at the beginning of the tutorial, and if so, you can skip this step. This code takes any search box changes from the UI and updates the table with the JSON returned from the search method:


```javasript
$("#beer-search").keyup(function() {
   var content = $("#beer-search").val();
   if(content.length >= 0) {
       $.getJSON("/beers/search", {"value": content}, function(data) {
           $("#beer-table tbody tr").remove();
           for(var i=0;i < data.length; i++) {
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

The code waits for key-up events on the search field and then does an AJAX query to the search method on the servlet. The servlet computes the result and sends it back as JSON. The JavaScript then clears the table, iterates over the result, and creates new rows with the new JSON results. The search method looks like this:


```java
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

You can use the `setRangeStart()` and `setRangeEnd()` methods to define the key range Couchbase Server returns. If we just provide the start range key, then we
get all documents starting from our search value. Because we want only those beginning with the search value, we can use the special `"\uefff"` UTF-8 character at the end, which means "end here." You need to get used to this convention, but it's very fast and efficient when accessing the view.

<a id="wrapping-up"></a>

## Wrapping Up

The tutorial presents an easy approach to start a web application with Couchbase
Server as the underlying data source. If you want to dig a little bit deeper, see the full source code at [couchbaselabs on GitHub](http://github.com/couchbaselabs/beersample-java). This contains more servlets and code to learn from. This might be extended and updated from time to time, so you might want to watch the repo.

Of course this is only the starting point for Couchbase, but together with the Getting Started Guide and other community resources you are well equipped to start exploring Couchbase Server on your own. Have fun working with Couchbase!

<a id="api-reference-started"></a>
