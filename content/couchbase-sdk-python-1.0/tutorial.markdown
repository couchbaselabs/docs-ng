# Tutorial

In this chapter we build on the foundations of the *Getting Started* guide and
build a simple web application. Make sure you have the `beer-sample` bucket
installed, because we’ll be using it. The sample application will allow you to
edit and manage various beers and breweries.

The sample application is not entirely complete, and there are some features
that remain to be implemented. Implementing them is an exercise for the reader.

The full source code for the sample application is available through
couchbaselabs on [GitHub](https://github.com/couchbaselabs/beersample-python).

Note that the sample application provides more content than described in this
tutorial, but it should be simple to navigate while reading this tutorial.

<a id="_quickstart"></a>

## Quickstart

 * Ensure you have Flask installed. You can either install it via your distribution
   or use `pip install Flask`.

 * [Download Couchbase Server](http://www.couchbase.com/download) and install it.
   Make sure to install the `beer-sample` dataset when you run the wizard because
   this tutorial application works with it.

 * Clone the repository and `cd` into the directory:

   `shell> git clone git://github.com/couchbaselabs/beersample-python Cloning into
   'beersample-python' #... shell> cd beersample-python`

 * Some views need to be set up. You can set up the views manually via the Web UI,
   or invoke the `design_setup.py` script located in the `beersample-python`
   directory.

   In the `beer` design document, create a view called `by_name` :

    ```
    function (doc, meta) {
        if (doc.type && doc.type == "beer") {
            emit(doc.name, null);
        }
    }
    ```

   Create a design document called `brewery` and add a view called `by_name` :

    ```
    function (doc, meta) {
        if (doc.type && doc.type == "brewery") {
            emit(doc.name, null);
        }
    }
    ```

 * Invoke the `beer.py` script:

   `shell> python beer.py * Running on http://0.0.0.0:5000/ * Restarting with
   reloader`

 * Navigate to `localhost:5000` and enjoy the application!

<a id="_preparations"></a>

## Preparations

In this section we’ll talk a bit about setting up your directory layout and
adding some views in the server before we start dealing with the Python SDK and
Flask itself.

<a id="_project_setup"></a>

### Project Setup

Create a project directory named `beer` :

`shell> mkdir beer shell> cd beer shell> mkdir templates shell> mkdir
templates/beer shell> mkdir templates/brewery shell> mkdir static shell> mkdir
static/js shell> mkdir static/css` Showing your directory contents displays
something like this:

`shell> find. -type
d./static./static/js./static/css./templates./templates/brewery./templates/beer`
To make the application look pretty, we’re incorporating jQuery and Twitter
Bootstrap. You can either download the libraries and put them in their
appropriate `css` and `js` directories (under `static` ), or clone the project
repository and use it from there. If you followed the Quickstart steps, you
already have the files in your `beersample-python` directory. Either way, make
sure you have the following files in place:

 * `static/css/beersample.css`

 * `static/css/bootstrap.min.css` (the minified twitter bootstrap library)

 * `static/css/bootstrap-responsive.min.css` (the minified responsive layout
   classes from bootstrap)

 * `static/js/beersample.js`

 * `static/js/jquery.min.js` (the jQuery javascript library)

From here on, you should have a bare bones web application configured that has
all the dependencies included. We’ll now move on and configure the `beer-sample`
bucket the way we need it.

<a id="_preparing_the_views"></a>

### Preparing the Views

The `beer-sample` bucket comes with a small set of predefined views, but to make
our application function correctly we need some more. This is also a good chance
to explore the view management possibilities inside the Web-UI.

Because we want to list beers and breweries by name, we need to define one view
for each. Head over to the Web-UI and click on the *Views* menu. Select
`beer-sample` from the drop-down list to switch to the correct bucket. Now click
on *Development Views* and then *Create Development View* to define your first
view. You need to give it the name of both the design document and the actual
view. Insert the following names:

 * Design Document Name: `_design/dev_beer`

 * View Name: `by_name`

The next step is to define the `map` and (optional) `reduce` functions. In our
examples, we won’t use the reduce functions at all but you can play around and
see what happens. Insert the following map function (that’s JavaScript) and
click `Save`.


```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

Every map function takes the full document ( `doc` ) and its associated metadata
( `meta` ) as the arguments. You are then free to inspect this data and emit a
result when you want to have it in your index. In our case, we emit the name of
the beer ( `doc.name` ) when the document both has a `type` field and the `type`
is `beer`. We don’t need to emit a value — that’s why we are using `null` here.
It’s always advisable to keep the index as small as possible. Resist the urge to
include the full document through `emit(meta.id, doc)`, because it will increase
the size of your view indexes. If you need to access the full document (or large
parts), then use `include_docs` in the `query` method, which returns `ViewRow`
objects together with their documents. You can also call `cb.get(row.docid)` to
get the individual doc for a single row. The resulting retrieval of the document
might be slightly out of sync with your view, but it will be fast and efficient.

Now we need to define a view for our breweries. You already know how to do this
— here is all the information you need to create a brewery view:

 * Design Document Name: `_design/dev_brewery`

 * View Name: `by_name`

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
Because we want to have the index on the whole dataset, click the *Publish*
button on both design documents (and accept any pop-up windows that warn you
about overriding the old design documents).

For more information about using views for indexing and querying from Couchbase
Server, see the following helpful resources in the [Couchbase Server
Manual](http://www.couchbase.com/docs/couchbase-manual-2.1.0/index.html) :

 * General information: [Views and
   Indexes](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views.html).

 * Sample patterns: [View and Query Pattern
   Samples](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views-sample-patterns.html).

 * Time stamp patterns: Many developers ask about extracting information based on
   date or time. To find out more, see [Date and Time
   Selection](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views-sample-patterns-timestamp.html).

<a id="_structure_of_the_Flask_application"></a>

### Structure of the Flask Application

We’ll be showing bits and pieces of the web app as it pertains to specific
sections. The entire file is less than 300 lines long, and you can inspect it by
looking into the `beer.py` file in the repository.

First, our imports. We need some extra imports to be able to handle exceptions
properly and let us build better view queries.

### beer.py (imports)


```
from collections import namedtuple
import json

from Flask import Flask, request, redirect, abort, render_template

from couchbase import Couchbase
from couchbase.exceptions import KeyExistsError, NotFoundError
from couchbase.views.iterator import RowProcessor
from couchbase.views.params import UNSPEC, Query
```



Then, we want to set some constants for our application:

### beer.py (configuration)

`DATABASE = 'beer-sample' HOST = 'localhost' ENTRIES_PER_PAGE = 30`

The `ENTRIES_PER_PAGE` variable is used later on to configure how many beers and
breweries to show in the search results.

Now, we’re ready to create our Flask application instance:

### beer.py (creating the application)


```
app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)
```



The first line creates a new Flask application. The first argument is the module
in which the application is defined. Because we’re using only a single file as
our application, we can use `__name__`, which expands to the name of the current
file being executed (minus the `.py` suffix).

The second argument instructs Flask to treat unrouted URLs as being requests for
files located in the `static` directory we created earlier. This allows our
templates to load the required `.js` and `.css` files.

The second line creates a configuration object for our `app`. The argument is
the name of the module to scan for configuration directives. Flask scans this
module for variable names in `UPPER_CASE` and places them in the `app.config`
dictionary.

Then, define a function to give us a database connection:

### beer.py (generating a Connection object)


```
def connect_db():
    return Couchbase.connect(
        bucket=app.config['DATABASE'],
        host=app.config['HOST'])

db = connect_db()
```



You already know how to connect to a Couchbase cluster, so we’ll skip the
explanation here.

The module-level `db` variable is set to be the `Connection` object. In larger
applications this is not a good idea, but we can get away with it here because
this is a simple app.

<a id="_the_welcome_page"></a>

## The Welcome Page

The first route we will implement is that of the `welcome` page, that is, the
page that is displayed when someone goes to the root of your site. Because there
is no Couchbase interaction involved, we just tell Flask to render the template.

### beer.py (welcome page)


```
@app.route('/')
def welcome():
    return render_template('welcome.html')

app.add_url_rule('/welcome', view_func=welcome)
```



The `welcome.html` template is actually a *Jinja* template inside the
`templates` directory. It looks like this:

### templates/welcome.html


```
{% extends "layout.html" %}
{% block body %}
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
<div class="span6">
  <div class="span12">
    <h4>About this App</h4>
    <p>Welcome to Couchbase!</p>
    <p>This application helps you to get started on application
        development with Couchbase. It shows how to create, update and
        delete documents and how to work with JSON documents.</p>
  </div>
</div>

{% endblock %}
```



The template simply provides some links to the brewery and beer pages (which are
shown later).

An interesting thing about this template is that it "inherits" from the common
`layout.html` template. All pages in the beer app have a common header and
footer to them — with only their `body` differing. This is the `layout.html`
template.

### templates/layout.html


```
<!DOCTYPE HTML>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Couchbase Python Beer Sample</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The Couchbase Java Beer-Sample App">
    <meta name="author" content="Couchbase, Inc. 2013">

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
        <h2 class="muted">Couchbase Beer Sample</h2>
      </div>
      <hr>
      <div class="row-fluid">
        <div class="span12">
            {% block body %}{% endblock %}
        </div>
      </div>
      <hr>
      <div class="footer">
        <p>&copy; Couchbase, Inc. 2013</p>
      </div>
    </div>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/beersample.js"></script>
  </body>
</html>
```



If you start your app now, you should be able to navigate to `localhost:5000`
and see the welcome page. You’ll get a 404 error if you try to visit any links
though - this is because we haven’t implemented them yet. Let’s do that now!

<a id="_managing_beers"></a>

## Managing Beers

In this section we’ll show the construction of the web app with respect to
managing beers. We’ll be able to list, inspect, edit, create, search, and delete
beers.

<a id="_showing_beers"></a>

### Showing Beers

Now we’re finally getting into the cooler stuff of this tutorial. First, we’ll
implement several classes for our pages to use.

### beer.py (custom Beer row class and processing)


```
class Beer(object):
    def __init__(self, id, name, doc=None):
        self.id = id
        self.name = name
        self.brewery = None
        self.doc = doc

    def __getattr__(self, name):
        if not self.doc:
            return ""
        return self.doc.get(name, "")


class BeerListRowProcessor(object):
    """
    This is the row processor for listing all beers (with their brewery IDs).
    """
    def handle_rows(self, rows, connection, include_docs):
        ret = []
        by_docids = {}

        for r in rows:
            b = Beer(r['id'], r['key'])
            ret.append(b)
            by_docids[b.id] = b

        keys_to_fetch = [ x.id for x in ret ]
        docs = connection.get_multi(keys_to_fetch, quiet=True)

        for beer_id, doc in docs.items():
            if not doc.success:
                ret.remove(beer)
                continue

            beer = by_docids[beer_id]
            beer.brewery_id = doc.value['brewery_id']

        return ret
```



First, we declare a simple `Beer` object. This app isn’t too fancy and we
could’ve just used a simple `dict`. However, it allows us to demonstrate the use
of the `RowProcessor` interface.

In the beer listing page, we want to display each beer along with a link to the
brewery that produces it. However, we’ve defined the `beer/by_name` view to
return only the name of the beer. To obtain the brewery, we need to fetch each
beer document and examine it. The document contains the Brewery ID that we need
later.

The `BeerListRowProcessor` is an implementation of the `RowProcessor` interface
that operates on the returned view rows.

For each raw JSON row, it creates a new `Beer` object. The first argument is the
document ID, which is used to provide a link to display more information about
the beer. The second argument is the name of the beer itself, which we use in
the beer list on the webpage.

We also create a local variable called `by_docids` that allows us to get a
`Beer` object by its document ID.

After we’ve created all the beers, we create a list of document IDs to fetch by
using list comprehension. We pass this list to `get_multi` (passing
`quiet=True`, because there might be some inconsistencies between the view
indexes and the actual documents).

While we could have made this simpler by performing an individual `get` on each
`beer.id`, that would be less efficient in terms of network usage.

Now that we have the beer documents, it’s time to set each beer’s `brewery_id`
to its relevant value.

We first check to see that each document was successful in being retrieved; then
we look up the corresponding `Beer` object by getting it from the `by_docids`
dictionary using the `beer_id` as the key.

Then, we extract the `brewery_id` field from the document and place it into the
`Beer` object.

Finally, we return the list of populated beers. The `View` object (returned by
the `query` function) now yields results as we iterate over it.

Before we forget, let’s put this all together:

### beer.py (showing beer listings)


```
@app.route('/beers')
def beers():
    rp = BeerListRowProcessor()
    rows = db.query("beer", "by_name",
                    limit=ENTRIES_PER_PAGE,
                    row_processor=rp)

    return render_template('beer/index.html', results=rows)
```



We tell Flask to route requests to `/beers` to this function. We create an
instance of the `BeerListRowProcessor` function we just defined.

We then execute a view query using the `query` method, passing it the name of
the design and view ( `beer` and `by_name`, respsectively).

We set the `limit` directive to the aforementioned `ENTRIES_PER_PAGE` directive,
to avoid flooding a single webpage with many results.

We finally tell the `query` method to use our own `BeerListRowProcessor` for
processing the results.

We then direct the template engine to render the `beer/index.html` template,
setting the template variable `rows` to the iterable returned by the `query`
function.

Here is the `beer/index.html` template:

### templates/beer/index.html


```
{% extends "layout.html" %}
{% block body %}

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
        {% for beer in results %}
        <tr>
            <td><a href="/beers/show/{{beer.id}}">{{beer.name}}</a></td>
            <td><a href="/breweries/show/{{beer.brewery_id}}">To Brewery</a></td>
            <td>
                <a class="btn btn-small btn-warning" href="/beers/edit/{{beer.id}}">Edit</a>
                <a class="btn btn-small btn-danger" href="/beers/delete/{{beer.id}}">Delete</a>
            </td>
        </tr>
        {% endfor %}
    </tbody>
</table>

<div>
    <a class="btn btn-small btn-success" href="/beers/create">Add Beer</a>
</div>

{% endblock %}
```



We’re using *Jinja*  `{% for %}` blocks to iterate and emit a fragment of HTML
for each `Beer` object returned by the query.

Navigate to `localhost:5000/beers`, to see a listing of beers. Each beer has `To
Brewery`, `Edit`, and `Delete` buttons.

On the bottom of the page, you can also see an `Add Beer` button, which allows
you to define new beers.

Let’s implement the `Delete` button next!

<a id="_deleting_beers"></a>

### Deleting Beers

Due to the simplicity of Couchbase and Flask, we can implement a single method
to delete both beers and breweries.

### beer.py (deleting a beer)


```
@app.route('<otype>/delete/<id>')
def delete_object(otype, id):
    try:
        db.delete(id)
        return redirect('/welcome')

    except NotFoundError:
        return "No such {0} '{1}'".format(otype, id), 404
```



Here we tell Flask to route any URL that has as its second component the string
`delete` to this method. The paths in `<angle brackets>` are routing tokens that
Flask passes to the handler as arguments. This means that URLs such as
`/beers/delete/foobar` and `/foo/delete/whatever` are all routed here.

When we get an ID, we try to delete it by using the `delete` method in a `try`
block. If successful, we redirect to the welcome page, but if the key does not
exist, we return with an error message and a `404` status code.

You can now access this page by going to
`localhost:5000/beers/delete/nonexistent` and get a 404 error. Or you can delete
a beer by clicking on one of the `Delete` buttons in the `/beers` page!

If you find that a beer is still displayed after you click the delete button,
you can refresh the browser page to verify that the beer has been deleted.

Another way to verify that a beer has been deleted is by clicking the delete
button again and getting a 404 error.

<a id="_displaying_beers"></a>

### Displaying Beers

Here we demonstrate how you can display the beers. In this case, we display a
page showing all the fields and values of a given beer.

### beer.py (showing a single beer)


```
@app.route('/beers/show/<beer_id>')
def show_beer(beer_id):
    doc = db.get(beer_id, quiet=True)
    if not doc.success:
        return "No such beer {0}".format(beer_id), 404


    return render_template(
        'beer/show.html',
        beer=Beer(beer_id, doc.value['name'], doc.value))
```



Like for the `delete` action, we first check to see that the beer exists. We are
passed the beer ID as the last part of the URL - this is passed to us as the
`beer_id`.

In order to display the information for the given beer ID, we simply call the
connection’s `get` method with the `beer_id` argument. We also pass the `quiet`
parameter so that we don’t receive an exception if the beer does not exist.

We then check to see that the `success` property of the returned `Result` object
is true. If it isn’t we return an HTTP `404` error.

If the beer exists, we construct a new `Beer` object; passing it the ID and the
`name` field within the value dictionary.

We then pass this beer to the `templates/beer/show.html` template which we’ll
show here:

### templates/beer/show.html


```
{% extends "layout.html" %}
{% block body %}

{% set display = beer.doc %}
{% set brewery_id = display['brewery_id'] %}

<h3>Show Details for Beer "{{beer.name}}"</h3>
<table class="table table-striped">
    <tbody>
        <tr>
            <td><strong>brewery_id</strong></td>
            <td><a href="/breweries/show/{{brewery_id}}">{{brewery_id}}</a></td>
        </tr>
        {% for k, v in display.items() if not k == "brewery_id" %}
        <tr>
            <td><strong>{{k}}</strong></td>
            <td>{{v}}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

<a class="btn btn-medium btn-warning"
    href="/beers/edit/{{beer.id}}">Edit</a>
<a class="btn btn-medium btn-danger"
    href="/beers/delete/{{beer.id}}">Delete</a>

{% endblock %}
```



Here we make the `display` variable in a special `{% set %}` directive. This
makes dealing with the rest of the code simpler.

The next thing we do is extract the `brewery_id`, and create a special entry
with a link pointing to the page to display the actual brewery.

Then we is iterate over the rest of the fields (omitting the brewery ID),
printing out the key and value of each.

Finally, we provide links at the bottom to `Edit` and `Delete` the beer.

<a id="_editing_beers"></a>

### Editing Beers

### beer.py (beer edit page)


```
def normalize_beer_fields(form):
    doc = {}
    for k, v in form.items():
        name_base, fieldname = k.split('_', 1)
        if name_base != 'beer':
            continue

        doc[fieldname] = v

    if not 'name' in doc or not doc['name']:
        return (None, ("Must have name", 400))

    if not 'brewery_id' in doc or not doc['brewery_id']:
        return (None, ("Must have brewery ID", 400))

    if not db.get(doc['brewery_id'], quiet=True).success:
        return (None,
                ("Brewery ID {0} not found".format(doc['brewery_id']), 400))

    return doc, None

@app.route('/beers/edit/<beer>', methods=['GET'])
def edit_beer_display(beer):
    bdoc = db.get(beer, quiet=True)
    if not bdoc.success:
        return "No Such Beer", 404

    return render_template('beer/edit.html',
                           beer=Beer(beer, bdoc.value['name'], bdoc.value),
                           is_create=False)


@app.route('/beers/edit/<beer>', methods=['POST'])
def edit_beer_submit(beer):
    doc, err = normalize_beer_fields(request.form)

    if not doc:
        return err

    db.set(beer, doc)
    return redirect('/beers/show/' + beer)
```



We define two handlers for editing. The first handler is the `GET` method for
`/beers/edit/<beer>`, which displays a nice HTML form that we can use to edit
the beer. It passes the following parameters to the template: the `Beer` object
and a Boolean that indicates this is *not* a new beer (because the same template
is also used for the `Create Beer` form).

The second handler is the `POST` method, which validates the input. The post
handler calls the `normalize_beer_fields` function, which converts the form
fields into properly formed names for the beer document, checks to see that the
beer has a valid `name`, and checks to see that a `brewery_id` is specified and
that it indeed exists. If all the checks pass, the function returns a tuple of (
`doc`, `None` ). The `POST` handler checks whether the second element of the
returned tuple is false. If it is not false, then it’s an error code, and the
first element is the error message. Otherwise, the first element is the
document. It then sets the document in Couchbase by using the `set` method.

The template is rather wordy because we enumerate all the possible fields with a
nice description.

### templates/beer/edit.html


```
{% extends "layout.html" %}
{% block body %}

{% if is_create %}
<h3>Create Beer</h3>
{% else %}
<h3>Editing {{beer.name}}</h3>
{% endif %}

<form method="post" action="">
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



The template first checks the `is_create` variable. If it’s `False`, then we’re
editing an existing beer, and the caption is filled with that name. Otherwise,
it’s titled as `Create Beer`.

<a id="_creating_beers"></a>

### Creating Beers

Creating beers is largely the same as editing beers:

### beer.py (create beer page)


```
@app.route('/beers/create')
def create_beer_display():
    return render_template('beer/edit.html', beer=Beer('', ''), is_create=True)


@app.route('/beers/create', methods=['POST'])
def create_beer_submit():
    doc, err = normalize_beer_fields(request.form)

    if not doc:
        return err

    id = '{0}-{1}'.format(doc['brewery_id'],
                          doc['name'].replace(' ', '_').lower())

    try:
        db.add(id, doc)
        return redirect('/beers/show/' + id)

    except KeyExistsError:
        return "Beer already exists!", 400
```



Here we display the same form as the one for editing beers, except we set the
`is_create` parameter to True, and pass an empty `Beer` object. This is
necessary because the template still tries to populate the form fields with
*existing* values.

In the `POST` handler, we call `normalize_beer_field` as above when editing
beers.

Because we’re creating a *new* beer, we use the `add` method instead. This
raisew an exception if the beer already exists. We catch this and display it to
the user.

If everything went well, the user is redirected to the beer display page for the
newly created beer.

<a id="_searching_beers"></a>

### Searching Beers

In the beer listing page above, you might have noticed a search box at the top.
We can use it to dynamically filter our table based on user input. We’ll use
Javascript at the client layer to perform the querying and filtering, and views
with range queries at the server (Flask) layer to return the results.

Before we implement the Python-level search method, we need to put the following
in the `static/js/beersample.js` file (if it’s not there already) to listen on
search box changes and update the table with the resulting JSON (which is
returned from the search method):

### static/js/beersample.js (snippet)


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

### beer.py (ajax search response)


```
def return_search_json(ret):
    response = app.make_response(json.dumps(ret))
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/beers/search')
def beer_search():
    value = request.args.get('value')
    q = Query()
    q.mapkey_range = [value, value + Query.STRING_RANGE_END]
    q.limit = ENTRIES_PER_PAGE

    ret = []

    rp = BeerListRowProcessor()
    res = db.query("beer", "by_name",
                   row_processor=rp,
                   query=q,
                   include_docs=True)

    for beer in res:
        ret.append({'id' : beer.id,
                    'name' : beer.name,
                    'brewery' : beer.brewery_id})

    return return_search_json(ret)
```



The `beer_search` function first extracts the user input by examining the query
string from the request.

It then creates a `Query` object. The `Query` object's `mapkey_range` property
is set to a list of two elements; the first is the user input, and the second is
the user input with the magic `STRING_RANGE_END` string appended to it. This
form of range indicates that all keys that start with the user input ( `value` )
are returned. If we just provided a single element, the results would also
contain matches that are lexically greater than the user input; if we just
provided the same value for the second and first elements, only items that match
the string exactly are returned.

The special `STRING_RANGE_END` is actually a `u"\u0FFF"` UTF-8 character, which
for the view engine means "end here." You need to get used to it a bit, but it’s
actually very neat and efficient.

We re-use our `BeerListRowProcessor` class to filter the results here (because
the data required is the same as that of the beer listing ( `beer/index.html` )
page.

However we need to return a JSON array of


```
{ "id" : "beer_id", "name" : "beer_name", "brewery" : "the_brewery_id" }
```

so we need to convert the rows into JSON first. This is done by the
`return_search_json` function.

Now your search box should work nicely.

<a id="_managing_breweries"></a>

## Managing Breweries

While this is implemented in the repository above, it is left as an exercise to
the reader to work out some more details.

<a id="_wrapping_up"></a>

## Wrapping Up

The tutorial presents an easy approach to start a web application with Couchbase
Server as the underlying data source. If you want to dig a little bit deeper,
[the full source code in the couchbaselabs repository on
GitHub](https://github.com/couchbaselabs/beersample-python) has more code to
learn from. This code might be extended and updated from time to time.

Of course, this is only the starting point for Couchbase, but together with the
Getting Started Guide, you should now be well equipped to start exploring
Couchbase Server on your own. Have fun working with Couchbase!

<a id="_food_for_thought"></a>

### Food For Thought

Some things are not implemented in the example. Here's some ideas for features
you might add while learning to use the SDK:

 * When deleting a brewery, ensure it has no beers dependent on it.

 * Provide a search where one can query beers belonging to a given brewery.

 * Handle concurrent updates to a beer and/or brewery.

 * Implement a *like* feature, where one can like a beer or a brewery; likewise,
   they can unlike one as well!

<a id="_using_the_apis"></a>
