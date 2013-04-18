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

<a id="quickstart"></a>

## Quickstart

If you want to get up and running really quickly, here is how to get it done
using [Jetty](http://jetty.codehaus.org/jetty/). Note that this short guide
assumes you're running MacOS or Linux. If you're running windows, you need to
modify the paths accordingly. Also, make sure to have at least
[maven](http://maven.apache.org/) installed.

 * [Download](http://www.couchbase.com/download) Couchbase Server 2.0 and
   [install](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-getting-started-install.html)
   it. Make sure to install the
   [beer-sample](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-sampledata-beer.html)
   dataset when you run the wizard, because the tutorial application will work with
   it.

 * Add the following views (and design documents) to the `beer-sample` bucket (and
   publish them to production afterwards):

   Design document name is `beer` and view name is `by_name`.

    ```
    function (doc, meta) {
      if(doc.type && doc.type == "beer") {
        emit(doc.name, null);
      }
    }
    ```

   Design document name is `brewery` and view name is `by_name`.

    ```
    function (doc, meta) {
      if(doc.type && doc.type == "brewery") {
        emit(doc.name, null);
      }
    }
    ```

 * Clone the repository from
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

 * Finally, use maven to run the application inside the Jetty container:

    ```
    $ mvn jetty:run
    .... snip ....
    Dec 17, 2012 1:50:16 PM com.couchbase.beersample.ConnectionManager contextInitialized
    INFO: Connecting to Couchbase Cluster
    2012-12-17 13:50:16.621 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    2012-12-17 13:50:16.624 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@2e2a730e
    2012-12-17 13:50:16.635 WARN net.spy.memcached.auth.AuthThreadMonitor:  Incomplete authentication interrupted for node {QA sa=localhost/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=8}
    2012-12-17 13:50:16.662 WARN net.spy.memcached.auth.AuthThread:  Authentication failed to localhost/127.0.0.1:11210
    2012-12-17 13:50:16.662 INFO net.spy.memcached.protocol.binary.BinaryMemcachedNodeImpl:  Removing cancelled operation: SASL auth operation
    2012-12-17 13:50:16.664 INFO net.spy.memcached.auth.AuthThread:  Authenticated to localhost/127.0.0.1:11210
    2012-12-17 13:50:16.666 INFO com.couchbase.client.ViewConnection:  Added localhost to connect queue
    2012-12-17 13:50:16.667 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
    2012-12-17 13:50:16.866:INFO::Started SelectChannelConnector@0.0.0.0:8080
    [INFO] Started Jetty Server
    ```

 * Now, navigate to [http://localhost:8080/welcome](http://localhost:8080/welcome)
   and enjoy the application.

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

### Project Setup

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
            <version>1.1.4</version>
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

### Preparing the Views

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

### Bootstrapping our Servlets: web.xml

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
