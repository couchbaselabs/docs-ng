# Tutorial

Building on the foundations of the [Getting
Started](http://www.couchbase.com/docs/couchbase-sdk-php-1.1/getting-started.html)
guide, this tutorial will show you how to build a full-blown web application on
top of Couchbase Server 2.0. We'll make use of a very powerful toolchain,
consisting of Composer, Silex and Twig to build a solid web application fast
while not losing the focus on showing how to work with the PHP SDK.

We'll make use of the `beer-sample` dataset to display and manage beers and
breweries. Along the way we'll pickup concepts on querying Couchbase Server 2.0
by keys or through views.

The full code sample is available on
[GitHub](https://github.com/couchbaselabs/beersample-php). You can clone the
repository and work from there if you would simply like to see the finished
application.

 * While we'll cover the installation process in detail, make sure to have the
   following dependencies in place:PHP 5.3 or later: The PHP SDK itself requires
   5.3 or later, nearly all of the dependencies used here require 5.3.

 * [Couchbase PHP SDK 1.1](http://www.couchbase.com/develop/php/current) : Install
   the appropriate.so or.dll file, depending on your platform. Earlier versions are
   not capable enough, because we make use of the brand new view-related
   functionality.

 * [Composer](http://getcomposer.org/) : An excellent dependency manager for PHP
   and supported by major libraries and frameworks like Doctrine or Symfony.



<a id="tutorial-preparations"></a>

## Preparations

Before we can start coding our application logic, we need to prepare both the
database and the application. We'll import the `beer-sample` bucket, prepare
some views and make sure everything works correctly. We'll also get our
application skeleton in line so we are ready to code.

<a id="tutorial-preparations-cb-server"></a>

### Setting up Couchbase Server

If you haven't already, download and install Couchbase Server 2.0. While you're
at it, make sure to install the `beer-sample` sample bucket on the fly. If you
already have the server installed and the `beer-sample` bucket is not in place,
head over to `Settings->Sample Buckets` and install it. Give it a few seconds
until the notificaton box disappears. You may need to shrink the size of some of
your existing buckets to make room for the beer-sample database.

The `beer-sample` bucket comes with a small set of views already predefined, but
to make our application function correctly we need some more. This is also a
very good chance to explore the view management possibilities inside the Web UI.

Since we want to list beers and breweries by name, we need to define one view
for each. Head over to the Web UI and click on the `Views` menu. Select
`beer-sample` from the dropdown list to switch to the correct bucket. Now click
on `Development Views` and then `Create Development View` to define your first
view. You need to give it the name of both the design document and the actual
view. Insert the following names:

 * Design Document Name: \_design/dev\_beer

 * View Name: by\_name

The next step is to define the `map` and (optional) `reduce` functions. In our
examples, we won't use have a `reduce` function, but you can play around if you
would like to. Insert the following JavaScript `map` function and click `Save`.


```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

Every `map` function takes the full document ( `doc` ) and (optionally) its
associated metadata ( `meta` ) as the arguments. You are then free to inspect
this data and `emit` a result when you want to have it in your view. Views are
always sorted by key, so by emitting information, we are in effect creating an
index. In our case we emit the name of the beer ( `doc.name` ) when the document
both has a type field and the type is `beer`. We don't need to emit a value -
that's because we are using `null` here. It's always advisable to keep the view
entry as small as possible. Resist the urge to include the full document through
`emit(meta.id, doc)`, because it will increase the size of your views. If you
need to access the full document (or large parts), then retrieve the document
via the returned id in the view result. Note: at this time PHP does not have a
way to include docs, though some other Couchbase SDKs do.

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
applied to a subset of the data. Since we want to have the index on the whole
dataset, click the `Publish` button on both design documents (and accept any
info popup that warns you from overriding the old one). See the view section of
the Couchbase Server manual for more information on how you may use this
development and production workflow to your advantage when developing a large
application.

<a id="tutorial-preparations-app"></a>

### Installing the Application Dependencies

Now that Couchbase Server is ready to use, we need to set up the skeleton of our
application. Since we're using composer, all we need to get the dependencies is
to create a `composer.json` file with the following content:


```
{
  "require": {
    "silex/silex": "1.0.x-dev",
    "twig/twig": ">=1.8,<2.0-dev"
  }
}
```

Place that file inside the `/beersample-php` directory of your webroot
(depending on your setup, it is often located under `/var/www/` ). We also need
to create a few more directories to keep the application organized.

Create directories with the following structure:


```
/beersample-php
    /templates
        /beers
        /breweries
    /assets
        /css
        /js
```

We'll fill the template directories later, but the assets can be added
immediately. Please locate and download the following JavaScript and CSS files
so they are in place. We make use of the fabulous [Twitter
Bootstrap](http://twitter.github.com/bootstrap/) library to make the application
look good without much effort.

 * [css/beersample.css](https://raw.github.com/couchbaselabs/beersample-php/master/assets/css/beersample.css)

 * [css/bootstrap.min.css (the minified twitter bootstrap
   library)](https://raw.github.com/couchbaselabs/beersample-php/master/assets/css/bootstrap.min.css)

 * [css/bootstrap-responsive.min.css (the minified responsive layout classes from
   bootstrap)](https://raw.github.com/couchbaselabs/beersample-php/master/assets/css/bootstrap-responsive.min.css)

 * [js/beersample.js](https://raw.github.com/couchbaselabs/beersample-php/master/assets/js/beersample.js)

 * [js/jquery.min.js (the jQuery javascript
   library)](https://raw.github.com/couchbaselabs/beersample-php/master/assets/js/jquery.min.js)

Also, we're using pretty URLs in our application. Here is a `.htaccess` file you
can place inside your root directory to make it work properly when using Apache
HTTPD. Please refer to the [Silex
documentation](http://silex.sensiolabs.org/doc/web_servers.html) on how to add
one for different web servers.


```
<IfModule mod_rewrite.c>
    Options -MultiViews

    RewriteEngine On
    RewriteBase /beersample-php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

To install the dependencies, we're now able to run `php composer.phar install`
(or `update` ). It should install all needed dependencies and we're ready to go
afterwards:


```
Loading composer repositories with package information
Installing dependencies
  - Installing twig/twig (v1.11.1)
    Downloading: 100%
...

  - Installing silex/silex (dev-master 0e69dc2)
    Cloning 0e69dc22400293f9364f8b918d008f3f6b634a47

symfony/routing suggests installing symfony/config (2.1.*)
...
Writing lock file
Generating autoload files
```

<a id="tutorial-bootstrap"></a>

## Bootstrapping the Application

With all the dependencies installed and ready to go, we can start out by adding
our `index.php` and doing the basic bootstrap.

Create a `index.php` file inside your `/beersample-php` directory and add the
following. We'll discuss it afterwards:


```
<?php
use Symfony\Component\HttpFoundation\Request;
use Silex\Application;
use Silex\Provider\TwigServiceProvider;

// Config Settings
define("SILEX_DEBUG", true);
define("COUCHBASE_HOSTS", "127.0.0.1");
define("COUCHBASE_BUCKET", "beer-sample");
define("COUCHBASE_PASSWORD", "");
define("COUCHBASE_CONN_PERSIST", true);
define("INDEX_DISPLAY_LIMIT", 20);

// Autoloader
require_once __DIR__.'/vendor/autoload.php';

// Silex-Application Bootstrap
$app = new Application();
$app['debug'] = SILEX_DEBUG;

// Connecting to Couchbase
$cb = new Couchbase(COUCHBASE_HOSTS, "beer-sample", COUCHBASE_PASSWORD, COUCHBASE_BUCKET, COUCHBASE_CONN_PERSIST);

// Register the Template Engine
$app->register(new TwigServiceProvider(), array('twig.path' => __DIR__.'/templates'));

// Run the Application
$app->run();
?>
```

The first part defines some constants to make config settings easy to change. Of
course this is not needed, but makes it easy for you to change the configuration
later in different environments. Afterwards, the composer autoloader is
included. This is needed to make sure the `use` statements are available to us
without having to require all PHP files by hand.

The `new Application();` initializes a new Silex application. To make sure that
we see all errors during development, we can set `debug` to `true`.

Now it gets interesting. We connect to our Couchbase cluster by constructing a
new Couchbase object. We pass in all required information (easy to grasp with
the name of the constants). This object will then be passed into all controller
actions and used from there.

Because we're using the [Twig template engine](http://twig.sensiolabs.org/), we
can register a
[TwigServiceProvider](http://silex.sensiolabs.org/doc/providers/twig.html) which
helps us to automatially locate and load them. You'll see later how these are
renderd and how we can pass data to them.

Finally, we run the application through `$app->run();`. The actual actions are
implemented between the Twig registration call ( `$app->register(new
TwigServiceProvider()...` ) and the final run method ( `$app->run()` ), so
remeber to put them in there.

If you now run the application in your browser, you should see the following
Exception showing up: `"Sorry, the page you are looking for could not be
found."`. This is actually great, because [Silex](http://silex.sensiolabs.org/)
is at work, but can't find the route for the `/` URL. Let's fix this now. Add
the following snippet between the `TwigServiceProvider` and the `run()` call:


```
$app->get('/', function() use ($app) {
    return $app['twig']->render('welcome.twig.html');
});
```

This action is called when a `GET` request comes in for the `/` URL. We don't
need to fetch any data from Couchbase here, so we just instruct
[Silex](http://silex.sensiolabs.org/) to render a
[Twig](http://twig.sensiolabs.org/) template named `welcome.twig.html`. Since we
haven't created it yet, go ahead and place the file inside the "templates"
directory:


```
{% extends "layout.twig.html" %}

{% block content %}
    <div class="span6">
      <div class="span12">
        <h4>Browse all Beers</h4>
        <a href="/beersample-php/beers" class="btn btn-warning">Show me all beers</a>
        <hr />
      </div>
      <div class="span12">
        <h4>Browse all Breweries</h4>
        <a href="/beersample-php/breweries" class="btn btn-info">Take me to the breweries</a>
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
            <a href="http://www.couchbase.com/docs/couchbase-sdk-php-1.1/tutorial.html">here</a>!</p>
      </div>
    </div>
{% endblock %}
```

There is nothing fancy here, we're just showing some basic information to the
user and guiding them to the real application functionality. Also, note the `{%
extends "layout.twig.html" %}` and `{% block content %}` twig elements on top of
the page.

Since we don't want to repeat the HTML layout part on every template, we can
define a layout and each template is a block that is loaded into that template.
Since we haven't created the `layout.twig.html`, do that in the same directory
as the `welcome.twig.html` :


```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Couchbase PHP Beer-Sample</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The Couchbase PHP Beer-Sample App">
    <meta name="author" content="Couchbase, Inc. 2012">

    <link href="/beersample-php/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="/beersample-php/assets/css/beersample.css" rel="stylesheet">
    <link href="/beersample-php/assets/css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container-narrow">
      <div class="masthead">
        <ul class="nav nav-pills pull-right">
          <li><a href="/beersample-php">Home</a></li>
          <li><a href="/beersample-php/beers">Beers</a></li>
          <li><a href="/beersample-php/breweries">Breweries</a></li>
        </ul>
        <h2 class="muted">Couchbase Beer-Sample</h2>
      </div>
      <hr>
      <div class="row-fluid">
        <div class="span12">
            {% block content %}{% endblock %}
        </div>
      </div>
      <hr>
      <div class="footer">
        <p>&copy; Couchbase, Inc. 2012</p>
      </div>
    </div>
    <script src="/beersample-php/assets/js/jquery.min.js"></script>
    <script src="/beersample-php/assets/js/bootstrap.min.js"></script>
    <script src="/beersample-php/assets/js/beersample.js"></script>
  </body>
</html>
```

The `{% block content %}{% endblock %}` is responsible for loading the
appropriate block later (the other markup is again just HTML boilerplate to help
with a nice layout for [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
).

If you load the page, you should see the welcome page loading! If not, you may
need to look at your webserver logs to see what kind of error messages have been
generated when running the scripts. Assuming all is working well, we're now
ready to implement the actual functionality.

<a id="tutorial-beers"></a>

## Managing Beers

The first thing we're going to implement is to show a list of beers in a table.
The table itself will contain the name of the beer and links to the brewery as
well as buttons to edit or delete the beer. We'll implement interactive
filtering on the table later as well. The following code should be inserted
after the `/` action to keep everything in order.


```
$app->get('/beers', function() use ($app, $cb) {
    // Load all beers from the beer/by_name view
    $results = $cb->view("beer", "by_name", array(
        'limit' => INDEX_DISPLAY_LIMIT
    ));

    $beers = array();
    // Iterate over the returned rows
    foreach($results['rows'] as $row) {
        // Load the full document by the ID
        $doc = $cb->get($row['id']);
        if($doc) {
            // Decode the JSON string into a PHP array
            $doc = json_decode($doc, true);
            $beers[] = array(
                'name' => $doc['name'],
                'brewery' => $doc['brewery_id'],
                'id' => $row['id']
            );
        }

    }

    // Render the template and pass on the beers array
    return $app['twig']->render('beers/index.twig.html', compact('beers'));
});
```

We're making use of our previously defined view `beer/by_name`. We also pass in
a `limit` option to make sure we don't load all documents returned by the view.
The `results` variable stores the view response and contains the actual data
inside the `rows` element. We can then iterate over the dataset, but since the
view only returns the document ID and we need more information, we fetch the
full document through the `get()` method. If it actually finds a document by the
given ID, we convert the JSON string to a PHP array and add it to the list of
beers. The list is then passed on to the template to display it.

The corresponding template `beers/index.twig.html` looks like this:


```
{% extends "layout.twig.html" %}

{% block content %}
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
      {% for beer in beers %}
        <tr>
          <td><a href="/beersample-php/beers/show/{{beer.id}}">{{beer.name}}</a></td>
          <td><a href="/beersample-php/breweries/show/{{beer.brewery}}">To Brewery</a></td>
          <td>
            <a class="btn btn-small btn-warning" href="/beersample-php/beers/edit/{{beer.id}}">Edit</a>
            <a class="btn btn-small btn-danger" href="/beersample-php/beers/delete/{{beer.id}}">Delete</a>
          </td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
{% endblock %}
```

Aside from normal HTML table markup, we make use of the `{% for beer in beers
%}` block to loop over the beers array. We then print out each row and show the
name of the beer, the link to the brewery and also buttons to edit and delete
the beer. We'll implement these methods in a minute.

The next action we're going to implement is the `show` action. When you click on
a beer, it should display all attributes from the JSON document in a table so we
can inspect them properly. Since everything is stored in one document, we just
need to fetch it by the given ID, decode it from the JSON string and pass it on
to the view. Very straightforward and performant:


```
$app->get('/beers/show/{id}', function($id) use ($app, $cb) {
    // Get the beer by its ID
    $beer = $cb->get($id);
    if($beer) {
       // If a document was found, decode it
       $beer = json_decode($beer, true);
       $beer['id'] = $id;
    } else {
       // Redirect if no document was found
       return $app->redirect('/beers');
    }

    // Render the template and pass the beer to it
    return $app['twig']->render(
        'beers/show.twig.html',
        compact('beer')
    );
});
```

The template iterates over the JSON attributes and prints their name and value
accordingly. Note that some documents can contain nested values which is not
covered here.


```
{% extends "layout.twig.html" %}

{% block content %}
<h3>Show Details for Beer "{{beer.name}}"</h3>
<table class="table table-striped">
    <tbody>
       {% for key,attribute in beer %}
        <c:forEach items="${beer}" var="item">
            <tr>
                <td><strong>{{key}}</strong></td>
                <td>{{attribute}}</td>
            </tr>
          </c:forEach>
          {% endfor %}
    </tbody>
</table>
{% endblock %}
```

The next action we're going to implement is the `delete` action.


```
$app->get('/beers/delete/{id}', function($id) use ($app, $cb) {
    // Delete the Document by its ID
    $cb->delete($id);
    // Redirect to the Index action
    return $app->redirect('/beersample-php/beers');
});
```

As you can see, the `delete` call is very similar to the previous `get` method.
After the document has been deleted, we redirect to the index action. If we'd
like to, we could get more sophisticated in here. For example, good practice
would be to fetch the document first and check if the document type is `beer` to
make sure only beers are deleted here. Also, it would be appropriate to return a
error message if the document didn't exist previously. Note that there is no
template needed because we redirect immediately after deleting the document.

Since we can now show and delete beers, its about time to make them editable as
well. We now need to implement two different actions here. One to load the
dataset and one to actually handle the `POST` response. Take note that this demo
code is not really suited for production. You really want to add validation here
to make sure only valid data is stored - but it should give you a solid idea on
how to implement the basics with Couchbase.


```
// Show the beer form
$app->get('/beers/edit/{id}', function($id) use ($app, $cb) {
    // Fetch the document
    $beer = $cb->get($id);
    if($beer) {
        // Decode the document
       $beer = json_decode($beer, true);
       $beer['id'] = $id;
    } else {
        // Redirect if no document was found
       return $app->redirect('/beers');
    }

    // Pass the document on to the template
    return $app['twig']->render(
        'beers/edit.twig.html',
        compact('beer')
    );
});

// Store submitted Beer Data (POST /beers/edit/<ID>)
$app->post('/beers/edit/{id}', function(Request $request, $id) use ($app, $cb) {
    // Extract the POST form data out of the request
    $data = $request->request;

    $newbeer = array();
    // Iterate over the POSTed fields and extract their content.
    foreach($data as $name => $value) {
        $name = str_replace('beer_', '', $name);
        $newbeer[$name] = $value;
    }

    // Add the type field
    $newbeer['type'] = 'beer';

    // Encode it to a JSON string and save it back
    $cb->set($id, json_encode($newbeer));

    // Redirect to show the beers details
    return $app->redirect('/beersample-php/beers/show/' . $id);
});
```

The missing link between the `GET` and `POST` handlers is the form itself. The
template is called `edit.twig.html` and looks like this:


```
{% extends "layout.twig.html" %}

{% block content %}
<h3>Edit Beer</h3>

<form method="post" action="/beersample-php/beers/edit/{{beer.id}}">
    <fieldset>
      <legend>General Info</legend>
      <div class="span12">
        <div class="span6">
          <label>Name</label>
          <input type="text" name="beer_name" placeholder="The name of the beer." value="{{beer.name}}">

          <label>Description</label>
          <input type="text" name="beer_description" placeholder="A short description." value="{{beer.description}}">
        </div>
        <div class="span6">
          <label>Style</label>
          <input type="text" name="beer_style" placeholder="Bitter? Sweet? Hoppy?" value="{{beer.style}}">

          <label>Category</label>
          <input type="text" name="beer_category" placeholder="Ale? Stout? Lager?" value="{{beer.category}}">
        </div>
      </div>
    </fieldset>
    <fieldset>
        <legend>Details</legend>
        <div class="span12">
            <div class="span6">
              <label>Alcohol (ABV)</label>
              <input type="text" name="beer_abv" placeholder="The beer's ABV" value="{{beer.abv}}">

              <label>Biterness (IBU)</label>
              <input type="text" name="beer_ibu" placeholder="The beer's IBU" value="{{beer.ibu}}">
            </div>
            <div class="span6">
              <label>Beer Color (SRM)</label>
              <input type="text" name="beer_srm" placeholder="The beer's SRM" value="{{beer.srm}}">

              <label>Universal Product Code (UPC)</label>
              <input type="text" name="beer_upc" placeholder="The beer's UPC" value="{{beer.upc}}">
            </div>
        </div>
    </fieldset>
    <fieldset>
        <legend>Brewery</legend>
        <div class="span12">
            <div class="span6">
              <label>Brewery</label>
              <input type="text" name="beer_brewery_id" placeholder="The brewery" value="{{beer.brewery_id}}">
            </div>
        </div>
    </fieldset>
    <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save changes</button>
    </div>
</form>
{% endblock %}
```

The only special part in the form are the Twig blocks like
`{{beer.brewery_id}}`. They allow us to easily include the actual value from the
field (when there is one). You can now change the values in the input fields,
hit `Save changes` and see the updated document either in the web application or
through the Couchbase Admin UI.

There is one last thing we want to implement here. You may have noticed that the
`index` page lists all beers but also has a search box on the top. Currently, it
won't work because the backend is not yet implemented. The JavaScript is already
in place in the `assets/js/beersample.js` file, so look through it if you are
interested. It just does an AJAX request against the server with the given
search value, expects a JSON response and iterates over it while replacing the
original table rows with the new ones.

We need to implement nearly the same view code as in the `index` action, but
this time we make use of two more view query params that allow us to only return
the range of documents we need:


```
$app->get('/beers/search', function(Request $request) use ($app, $cb) {
    // Extract the search value
    $input = strtolower($request->query->get('value'));

    // Define the Query options
    $options = array(
      'limit' => INDEX_DISPLAY_LIMIT, // Limit the number of returned documents
      'startkey' => $input, // Start the search at the given search input
      'endkey' => $input . '\uefff' // End the search with a special character (see explanation below)
    );

    // Query the view
    $results = $cb->view("beer", "by_name", $options);

    $beers = array();
    // Iterate over the resulting rows
    foreach($results['rows'] as $row) {
        // Load the corresponding document
        $doc = $cb->get($row['id']);
        if($doc) {
            // If the doc is found, decode it.
            $doc = json_decode($doc, true);
            $beers[] = array(
                'name' => $doc['name'],
                'brewery' => $doc['brewery_id'],
                'id' => $row['id']
            );
        }

    }
    // Return a JSON formatted response of all beers for the JavaScript code.
    return $app->json($beers, 200);
});
```

The two new query parameters we make use of are: `startkey` and `endkey`. They
allow us to define the key where the search should begin and the key where the
search should end. We use the special character `'\uefff'` here which means
"end". That way, we only get results which correctly begin with the given search
string. This is a little trick that comes in very handy from time to time.

The rest is very similar to the `index` action so we'll skip the discussion for
that. Also, we don't need a template here because we can return the JSON
response directly. Very straightforward.

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * For technical details on views, how they operate, and how to write effective
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

<a id="tutorial-wrapping-up"></a>

## Wrapping Up

If you look through the actual code on GitHub, you will notice that there is
much more to it than described here. For example, some is the same but just for
breweries. There is also some additional code not covered here. We recommend you
look through it to become more familiar with it. Then move on to the API
documentation and further examples.

Couchbase Server and the PHP SDK provids a boatload of useful methods that you
can use in your day-to-day work. You should now be ready to explore thos on your
own, so have fun coding with Couchbase!

<a id="api-reference-summary"></a>
