# Tutorial

In this chapter we build on the foundations of the Getting Started guide and
build a simple web application. Make sure you have the beer-sample bucket
installed, because we’ll be using it. The sample application will allow you to
edit and manage various beers and breweries.

This tutorial is not entirely complete, and leaves some features that remain to
be implemented. Implementing them is left as an exercise for the reader.

The full source code for the sample application is available in the
beersample-node project through couchbaselabs on GitHub.

Note that the sample application provides more content than described in this
tutorial, but it should be simple to navigate while reading this tutorial.

<a id="quick_start"></a>

## Quickstart

 * [Download Couchbase Server](http://www.couchbase.com/download) and install it.
   Make sure to install the beer-sample dataset when you run the wizard because
   this tutorial application works with it.

 * Clone the repository and install dependencies (express, jade):

   `shell> git clone git://github.com/couchbaselabs/beersample-node Cloning into
   'beersample-node' #... shell> cd beersample-node shell> npm install`

 * Some views need to be set up. You can set up the views manually via the Web UI,
   or invoke the design\_setup.js script located in the beersample-node directory.

   In the beer design document, create a view called by\_name:

    ```
    function (doc, meta) {
        if (doc.type && doc.type == "beer") {
            emit(doc.name, null);
        }
    }
    ```

   Create a design document called brewery and add a view called by\_name:

    ```
    function (doc, meta) {
        if (doc.type && doc.type == "brewery") {
            emit(doc.name, null);
        }
    }
    ```

 * Invoke the beer.js script:

   `shell> node beer.js Server running at http://127.0.0.1:1337/`

 * Navigate to localhost:1337 and enjoy the application!

<a id="preparations"></a>

## Preparations

<a id="project_setup"></a>

### Project Setup

In this section we’ll talk a bit about setting up your directory layout and
adding some views in the server before we start dealing with the Node.js SDK and
express+jade itself.

Create a project directory named beer:

`shell> mkdir beer shell> cd beer shell> mkdir views shell> mkdir views/beer
shell> mkdir views/brewery shell> mkdir static shell> mkdir static/js shell>
mkdir static/css` Showing your directory contents displays something like this:

`shell> find. -type
d./static./static/js./static/css./views./views/brewery./views/beer` To make the
application look pretty, we’re incorporating jQuery and Twitter Bootstrap. You
can either download the libraries and put them in their appropriate css and js
directories (under static), or clone the project repository and use it from
there. If you followed the Quickstart steps, you already have the files in your
beersample-node directory. Either way, make sure you have the following files in
place:

`static/css/beersample.css static/css/bootstrap.min.css (the minified twitter
bootstrap library) static/css/bootstrap-responsive.min.css (the minified
responsive layout classes from bootstrap) static/js/beersample.js
static/js/jquery.min.js (the jQuery javascript library)` From here on, you
should have a bare bones web application configured that has all the
dependencies included. We’ll now move on and configure the beer-sample bucket
the way we need it.

<a id="preparing_the_views"></a>

### Preparing the Views

The beer-sample bucket comes with a small set of predefined views, but to make
our application function correctly we need some more. This is also a good chance
to explore the view management possibilities inside the Web-UI.

Because we want to list beers and breweries by name, we need to define one view
for each. Head over to the Web-UI and click on the Views menu. Select
beer-sample from the drop-down list to switch to the correct bucket. Now click
on Development Views and then Create Development View to define your first view.
You need to give it the name of both the design document and the actual view.
Insert the following names:

 * Design Document Name: \_design/dev\_beer

 * View Name: by\_name

The next step is to define the map and (optional) reduce functions. In our
examples, we won’t use the reduce functions at all but you can play around and
see what happens. Insert the following map function (that’s JavaScript) and
click Save.


```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

Every map function takes the full document (doc) and its associated metadata
(meta) as the arguments. You are then free to inspect this data and emit a
result when you want to have it in your index. In our case, we emit the name of
the beer (doc.name) when the document both has a type field and the type is
beer. We don’t need to emit a value — that’s why we are using null here. It’s
always advisable to keep the index as small as possible. Resist the urge to
include the full document through emit(meta.id, doc), because it will increase
the size of your view indexes. If you need to access the full document you can
call bucket.get(result.key) to get the individual doc for a single row. The
resulting retrieval of the document might be slightly out of sync with your
view, but it will be fast and efficient.

Now we need to define a view for our breweries. You already know how to do this
— here is all the information you need to create a brewery view:

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

The final step is to push the design documents in production. While the design
documents are in development, the index is applied only on the local node.
Because we want to have the index on the whole dataset, click the Publish button
on both design documents (and accept any pop-up windows that warn you about
overriding the old design documents).

For more information about using views for indexing and querying from Couchbase
Server, see the following helpful resources in the Couchbase Server Manual:

 * General information: [Views and
   Indexes](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views.html)

 * Sample patterns: [View and Query Pattern
   Samples](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views-sample-patterns.html)

 * Time stamp patterns: Many developers ask about extracting information based on
   date or time. To find out more, see [Date and Time
   Selection](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views-sample-patterns-timestamp.html)

<a id="the_welcome_page"></a>

## The Welcome Page

The first route we will implement is that of the welcome page, that is, the page
that is displayed when someone goes to the root of your site. Because there is
no Couchbase interaction involved, we just tell express to render the template.

### beer_app.js (welcome page):


```
function welcome(req, res) {
  res.render('welcome');
}
app.get('/welcome', welcome);
```



The welcome.html template is actually a Jade template inside the views
directory. It looks like this:

### views/welcome.jade:


```
extends layout
block content
  .span6
    .span12
      h4 Browse all Beers
      a(href="/beers" class="btn btn-warning") Show me all beers
      hr
    .span12
      h4 Browse all Breweries
      a(href="/breweries" class="btn btn-info") Take me to the breweries
  .span6
    .span12
      h4 About this App
      p Welcome to Couchbase!
      p
        | This application helps you to get started on application
        | development with Couchbase. It shows how to create, update and
        | delete documents and how to work with JSON documents.
```



The template simply provides some links to the brewery and beer pages (which are
shown later).

An interesting thing about this template is that it "inherits" from the common
layout.jade template. All pages in the beer app have a common header and footer
to them — with only their body differing. This is the layout.jade template.

### views/layout.jade:


```
!!!5
html(lang="en")
  head
    meta(charset="utf-8")
    title Couchbase Node.js Beer Sample
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    meta(name="description" content="The Couchbase Node.js Beer-Sample App")
    meta(name="author" content="Couchbase, Inc. 2013")

    link(href="/css/bootstrap.min.css" rel="stylesheet")
    link(href="/css/beersample.css" rel="stylesheet")
    link(href="/css/bootstrap-responsive.min.css" rel="stylesheet")

    //HTML5 shim, for IE6-8 support of HTML5 elements
    //if lt IE 9
      script(src="http://html5shim.googlecode.com/svn/trunk/html5.js")

  body
    .container-narrow
      .masthead
        ul.nav.nav-pills.pull-right
          li: a(href="/welcome") Home
          li: a(href="/beers") Beers
          li: a(href="/breweries") Breweries
        h2.muted Couchbase Beer Sample
      hr

      .row-fluid
        .span12
          block content
      hr

      .footer
        p &copy; Couchbase, Inc. 2013

    script(src="/js/jquery.min.js")
    script(src="/js/beersample.js")
```



The template simply provides some links to the brewery and beer pages (which are
shown later).

If you start your app now, you should be able to navigate to
http://localhost:1337 and see the welcome page. You’ll get a 404 error if you
try to visit any links though - this is because we haven’t implemented them yet.
Let’s do that now!

<a id="managing_beers"></a>

## Managing Beers

<a id="showing_beers"></a>

### Showing Beers

Now we’re finally getting into the cooler stuff of this tutorial. In the beer
listing page, we want to display each beer along with a link to the brewery that
produces it. However, we’ve defined the beer/by\_name view to return only the
name of the beer. To obtain the brewery, we need to fetch each beer document and
examine it. The document contains the brewery that we need later.

After we’ve retrieved a list of all the beers, we create a list of document IDs
to fetch by using the underscore libraries pluck function. We pass this list to
getMulti.

While we could have made this simpler by performing an individual get on each
beer’s id, that would be less efficient in terms of network usage.

Now that we have the beer documents, we iterate through the list of values we
retrieved and assign the key (which is the object key) to a property of the beer
object itself to allow usage of it in the template.

Now let’s put this all together:

### beer_app.js (showing beer listings):


```
function list_beers(req, res) {
      var q = {
        limit : ENTRIES_PER_PAGE,   // configure max number of entries.
        stale : false               // We don't want stale views here.
      };

      db.view( "beer", "by_name", q).query(function(err, values) {
        // 'by_name' view's map function emits beer-name as key and value as
        // null. So values will be a list of
        //      [ {id: <beer-id>, key: <beer-name>, value: <null>}, ... ]

        // we will fetch all the beer documents based on its id.
        var keys = _.pluck(values, 'id');

        db.getMulti( keys, null, function(err, results) {

          // Add the id to the document before sending to template
          var beers = _.map(results, function(v, k) {
            v.value.id = k;
            return v.value;
          });

          res.render('beer/index', {'beers':beers});
        })
      });
    }
    app.get('/beers', list_beers);
```



We also tell express to route requests for /beers to this function, we then
direct express to render the beer/index.jade template.

Here is the beer/index.jade template:

### views/index.jade:


```
extends ../layout
  block content

    h3 Browse Beers
    form(class="navbar-search pull-left")
      input#beer-search(class="search-query" type="text" placeholder="Search for Beers")

    table#beer-table(class="table table-striped")
      thead
        tr
          th Name
          th Brewery
          th
      tbody
        for beer in beers
          tr
            td: a(href="/beers/show/#{beer.id}") #{beer.name}
            td: a(href="/breweries/show/#{beer.brewery_id}") To Brewery
            td
              a(class="btn btn-small btn-warning" href="/beers/edit/#{beer.id}") Edit
              a(class="btn btn-small btn-danger" href="/beers/delete/#{beer.id}") Delete

    div
      a(class="btn btn-small btn-success" href="/beers/create") Add Beer
```



Navigate to http://localhost:1337/beers, to see a listing of beers. Each beer
has To Brewery, Edit, and Delete buttons.

On the bottom of the page, you can also see an Add Beer button, which allows you
to define new beers.

Let’s implement the Delete button next!

<a id="deleting_beers"></a>

### Deleting Beers

Due to the simplicity of Couchbase and express, we can implement a single method
to delete both beers and breweries.

### beer_app.js (showing beer listings):


```
function delete_object( req, res ) {
    db.remove( req.params.object_id, function(err, meta) {
      if( err ) {
        console.log( 'Unable to delete document `' + req.params.object_id + '`' );
      }

      res.redirect('/welcome');
    });
  }
  app.get('/beers/delete/:object_id', delete_object);
  app.get('/breweries/delete/:object_id', delete_object);
```



Here we tell express to route our two deletion URLs to the same method. We
attempt to delete the object in our Couchbase cluster that is passed through the
url then redirect the user to our Welcome page. If this delete fails, we also
log an error to the console.

If you find that a beer is still displayed after you click the delete button,
you can wait a moment and refresh the browser page to verify that the beer has
been deleted. Deleted objects may not immediately get removed from our view, but
may instead need to wait for a view index update.

Another way to verify that a beer has been deleted is by clicking the delete
button again and getting a 404 error.

<a id="displaying_beers"></a>

### Displaying Beers

### beer_app.js (showing a single beer):


```
function show_beer(req, res) {
    db.get( req.params.beer_id, function(err, result) {
      var doc = result.value;
      if( doc === undefined ) {
        res.send(404);
      } else {
        doc.id = req.params.beer_id;

        var view = {
          'beer': doc,
          'beerfields': _.map(doc, function(v,k){return {'key':k,'value':v};})
        };
        res.render('beer/show', view);
      }
    });
  }
  app.get('/beers/show/:beer_id', show_beer);
```



Like for the delete example, we first check if the document actually exists
within our cluster. We pass the beer ID through the URL, this is passed to use
as beer\_id, as seen in the express route.

In order to retrieve the information or this particular beer, we simply call the
connections get method with the beer\_id we received through the route. We first
check the ensure we received a document and if not return a HTTP 404 error.

If the beer exists, we build prepare a view object to pass to the template which
contains the beer object as well as a mapped list of all fields and values that
are inside of the beer object. We pass this data to the views/beer/show.jade
template, which you is shown below.

### views/beer/show.jade:


```
extends ../layout
block content

  h3 Show Details for Beer #{beer.name}
  table(class="table table-striped")
    tbody
      tr
        td: strong #{beer.brewery_id}
        td: a(href="/breweries/show/#{beer.brewery_id}") #{beer.brewery_id}
      for beerfield in beerfields
        tr
          td: strong #{beerfield.key}
          td #{beerfield.value}

  a(class="btn btn-medium btn-warning" href="/beers/edit/#{beer.id}") Edit
  a(class="btn btn-medium btn-danger" href="/beers/delete/#{beer.id}") Delete
```



Here we extract the brewery\_id, and create a special entry with a link pointing
to the page to display the actual brewery.

Then we is iterate over the rest of the fields, printing out the key and value
of each.

Finally, we provide links at the bottom to Edit and Delete the beer.

<a id="editing_beers"></a>

### Editing Beers

### beer_app.js (beer editing):


```
function normalize_beer_fields(data) {
    var doc = {};
    _.each(data, function(value, key) {
      if(key.substr(0,4) == 'beer') {
        doc[key.substr(5)] = value;
      }
    });

    if (!doc['name']) {
      throw new Error('Must have name');
    }
    if (!doc['brewery_id']) {
      throw new Error('Must have brewery ID');
    }

    return doc;
  }

  function begin_edit_beer(req, res) {
    db.get(req.params.beer_id, function(err, result) {
      var doc = result.value;
      if( doc === undefined ) { // Trying to edit non-existing doc ?
        res.send(404);
      } else { // render form.
        doc.id = req.params.beer_id;
        var view = { is_create: false, beer: doc };
        res.render('beer/edit', view);
      }
    });
  }
  function done_edit_beer(req, res) {
    var doc = normalize_beer_fields(req.body);

    db.get( rc.doc.brewery_id, function(err, result) {
      if (result.value === undefined) { // Trying to edit non-existing doc ?
        res.send(404);
      } else {    // Set and redirect.
        db.set( req.params.beer_id, doc, function(err, doc, meta) {
          res.redirect('/beers/show/'+req.params.beer_id);
        })
      }
    });
  }
  app.get('/beers/edit/:beer_id', begin_edit_beer);
  app.post('/beers/edit/:beer_id', done_edit_beer);
```



We define two handlers for editing. The first handler is the GET method for
/beers/edit/:beer\_id, which displays a nice HTML form that we can use to edit
the beer. It passes the following parameters to the template: the beer object
and a boolean that indicates this is not a new beer (because the same template
is also used for the Create Beer form).

The second handler is the POST method, which validates the input. The post
handler calls the normalize\_beer\_fields function, which converts the form
fields into properly formed names for the beer document, checks to see that the
beer has a valid name, and checks to see that a brewery\_id is specified and
that it indeed exists. If all the checks pass, the function returns the
formatted document. If an exception is thrown, express will catch this error and
render it to the user. Otherwise, the document is set to Couchbase using the set
method and the user is redirected to the newly created beer’s show page.

This template is rather wordy because we enumerate all the possible fields with
a nice description.

### views/beer/edit.jade:


```
extends ../layout
block content

  if is_create
    h3 Create Beer
  else
    h3 Editing #{beer.name}

  form(method="post" action="")
    fieldset
      legend General Info
      .span12
        .span6
          label Type
          input(type="text" name="beer_type" placeholder="Type of the document" value="#{beer.type}")
          label Name
          input(type="text" name="beer_name" placeholder="The name of the beer" value="#{beer.name}")
          label Description
          input(type="text" name="beer_description" placeholder="A short description" value="#{beer.description}")
        .span6
          label Style
          input(type="text" name="beer_style" placeholder="Bitter? Sweet? Hoppy?" value="#{beer.style}")
          label Category
          input(type="text" name="beer_category" placeholder="Ale? Stout? Lager?" value="#{beer.category}")
    fieldset
      legend Details
      .span12
        .span6
          label Alcohol (ABV)
          input(type="text" name="beer_abv" placeholder="The beer's ABV" value="#{beer.abv}")
          label Biterness (IBU)
          input(type="text" name="beer_ibu" placeholder="The beer's IBU" value="#{beer.ibu}")
        .span6
          label Beer Color (SRM)
          input(type="text" name="beer_srm" placeholder="The beer's SRM" value="#{beer.srm}")
          label Universal Product Code (UPC)
          input(type="text" name="beer_upc" placeholder="The beer's UPC" value="#{beer.upc}")
    fieldset
      legend Brewery
      .span12
        .span6
          label Brewery
            input(type="text" name="beer_brewery_id" placeholder="The brewery" value="#{beer.brewery_id}")

    .form-actions
      button(type="submit" class="btn btn-primary") Save changes
```



The template first checks the is\_create variable. If it’s false, then we’re
editing an existing beer, and the caption is filled with that name. Otherwise,
it’s titled as Create Beer.

<a id="creating_beers"></a>

### Creating Beers

Creating beers is largely the same as editing beers:

### beer_app.js (create beer):


```
function begin_create_beer(req, res) {
    var view = { is_create : true, beer:{
      type: '',
      name: '',
      description: '',
      style: '',
      category: '',
      abv: '',
      ibu: '',
      srm: '',
      upc: '',
      brewery_id: ''
    } };
    res.render('beer/edit', view);
  }
  function done_create_beer(req, res) {
    var doc = normalize_beer_fields(req.body);
    var beer_id = doc.brewery_id + '-' +
                  doc.name.replace(' ', '-').toLowerCase();
    db.add( beer_id, doc, function(err, result) {
      if (err) throw err;
      res.redirect('/beers/show/'+beer_id);
    });
  }
  app.get('/beers/create', begin_create_beer);
  app.post('/beers/create', done_create_beer);
```



Here we display the same form as the one for editing beers, except we set the
is\_create parameter to true, and pass an empty beer object. This is necessary
because the template still tries to populate the form fields with existing
values.

In the POST handler, we call normalize\_beer\_field as above when editing beers.

Because we’re creating a new beer, we use the add method instead. This raise
will cause the callback to be invoked with an error if the beer already exists.
We catch this and display it to the user.

If everything went well, the user is redirected to the beer display page for the
newly created beer.

<a id="searching_beers"></a>

### Searching Beers

In the beer listing page above, you might have noticed a search box at the top.
We can use it to dynamically filter our table based on user input. We’ll use
Javascript at the client layer to perform the querying and filtering, and views
with range queries at the server (nodejs/express) layer to return the results.

Before we implement the server-side search method, we need to put the following
in the static/js/beersample.js file (if it’s not there already) to listen on
search box changes and update the table with the resulting JSON (which is
returned from the search method):

### static/js/beersample.js (snippet):


```
$(document).ready(function() {

    /**
     * AJAX Beer Search Filter
     */
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
});
```



The code waits for keyup events on the search field, and if they happen, it
issues an AJAX query on the search function within the app. The search handler
computes the result (using views) and returns it as JSON. The JavaScript then
clears the table, iterates over the results, and creates new rows.

The search handler looks like this:

### beer_app.js (ajax search response):


```
function search_beer(req, res) {
    var value = req.query.value;
    var q = { startkey : value,
              endkey : value + JSON.parse('"\u0FFF"'),
              stale : false,
              limit : ENTRIES_PER_PAGE }
    db.view( "beer", "by_name", q).query(function(err, values) {
      var keys = _.pluck(values, 'id');
      db.getMulti( keys, null, function(err, results) {
        var beers = [];
        for(var k in results) {
          beers.push({
            'id': k,
            'name': results[k].value.name,
            'brewery_id': results[k].value.brewery_id
          });
        }

        res.send(beers);
      });
    });
  };
  app.get('/beers/search', search_beer);
```



The beer\_search function first extracts the user input by examining the query
string from the request.

It then builds an options object which will be passed to the view query api. We
pass the users input for the startkey, and pass the users input appended with a
Unicode \u0FFF, which for the view engine means "end here." You need to get used
to it a bit, but it’s actually very neat and efficient.

We use getMulti (as has been seen in list beers page in a previous tutorial
section) to retrieve the complete data for each beer. However, unlike before,
rather than rendering a template using the data we have retrieved, we send the
object directly to express, which will kindly serialize it to JSON for us.

Now your search box should work nicely.

<a id="wrapping_up"></a>

## Wrapping Up

While you may notice that the breweries management code has been implemented in
the repository, it is left as an exercise to the user to work out the details of
this. Additionally, here are some things that are not implemented in the example
which you might add while learning to use the SDK:

 * When deleting a brewery, ensure it has no beers dependent on it.

 * Provide a search where one can query beers belonging to a given brewery.

 * Handle concurrent updates to a beer and/or brewery.

 * Implement a like feature, where one can like a beer or a brewery; likewise, they
   can unlike one as well!

The tutorial presents an easy approach to start a web application with Couchbase
Server as the underlying data source. If you want to dig a little bit deeper,
the full source code in the couchbaselabs repository on GitHub has more code to
learn from. This code might be extended and updated from time to time.

The tutorial presents an easy approach to start a web application with Couchbase
Server as the underlying data source. If you want to dig a little bit deeper,
the full source code in the couchbaselabs repository on GitHub has more code to
learn from. This code might be extended and updated from time to time.

<a id="advanced-usage"></a>
