# Tutorial

In this chapter we will build on the foundations of the *Getting Started* guide,
and build a simple web application on top of it. Make sure to have the
`beer-sample` bucket installed, as we’ll be using it -; the sample application
will allow you to edit and manage various beers and breweries.

The sample application is not entirely complete, and there are some features
which remain to be implemented. Implementing them is an exercise for the reader.

The full source code is available through couchbaselabs on
[GitHub](https://github.com/couchbaselabs/beersample-python)

Note that the sample application provides more content then described in this
tutorial but it should be simple to navigate while reading this tutorial.

<a id="_quickstart"></a>

## Quickstart

 * Ensure you have *Flask* installed. You can either install it via your
   distribution or use `pip install flask`.

 * [Download Couchbase Server](http://www.couchbase.com/download) and install it.
   Make sure to install the `beer-sample` dataset when you run the wizard, because
   this tutorial application will work with it.

 * Clone the repository and `cd` into the directory

   **Unhandled:** `[:unknown-tag :screen]`

 * Some views need to be set up. You can do this manually via the Web UI, or invoke
   the `design_setup.py` script in the sample repository.

   In the `beer` design document, create a view called `by_name`

    ```
    function (doc, meta) {
        if (doc.type && doc.type == "beer") {
            emit(doc.name, null);
        }
    }
    ```

   Create a design document called `brewery`. Add a view called `by_name`

    ```
    function (doc, meta) {
        if (doc.type == "brewery") {
            emit(doc.name, null);
        }
    }
    ```

 * Finally, invoke the `beer.py` script

   **Unhandled:** `[:unknown-tag :screen]`

 * Navigate to `localhost:5000` and enjoy the application!

<a id="_preparations"></a>

## Preparations

In this section we’ll talk a bit about setting up your directory layout and
adding some views in the server before we start dealing with the Python SDK and
Flask itself.

<a id="_project_setup"></a>

### Project Setup

Create your project directory, we will call it `beer`

**Unhandled:** `[:unknown-tag :screen]` Showing your directory contents should
display something like this

**Unhandled:** `[:unknown-tag :screen]` In order to make the application look
pretty, we’re incorporating jQuery and Twitter Bootstrap. You can either
download the libraries and put it in their appropriate `css` and `js`
directories (under `static` ), or clone the project repository and use it from
there. Either way, make sure to have the following files in place:

 * `static/css/beersample.css`

 * `static/css/bootstrap.min.css` (the minified twitter bootstrap library)

 * `static/css/bootstrap-responsive.min.css` (the minified responsive layout
   classes from bootstrap)

 * `static/js/beersample.js`

 * `static/js/jquery.min.js` (the jQuery javascript library)

From here on, you should have a barebones web application configured that has
all the dependencies included. We’ll now move on and configure the `beer-sample`
bucket the way we need it.

<a id="_preparing_the_views"></a>

### Preparing the Views

The beer-sample bucket comes with a small set of views already predefined, but
to make our application function correctly we need some more. This is also a
very good chance to explore the view management possibilities inside the Web-UI.

Since we want to list beers and breweries by their name, we need to define one
view for each. Head over to the Web-UI and click on the *Views* menu. Select
`beer-sample` from the dropdown list to switch to the correct bucket. Now click
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
result when you want to have it in your index. In our case we emit the name of
the beer ( `doc.name` ) when the document both has a `type` field and the `type`
is `beer`. We don’t need to emit a value - that’s we we are using `null` here.
It’s always advisable to keep the index as small as possible. Resist the urge to
include the full document through `emit(meta.id, doc)`, because it will increase
the size of your view indexes. If you need to access the full document (or large
parts), then use the `include_docs` in the `query` method, which will return
`ViewRow` objects together with their documents. You can also call
`cb.get(row.docid)` as well, to get the individual doc for a single row. The
resulting retrieval of the document may be slightly out of sync with your view,
but it will be fast and efficient.

Now we need to do (nearly) the same for our breweries. Since you already know
how to do this, here is all the information you need to create it:

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

The final step that you need to do is to push the design documents in
production. While the design documents are in development, the index is only
applied on the local node. Since we want to have the index on the whole dataset,
click the *Publish* button on both design documents (and accept any info popup
that warns you from overriding the old one).

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * General Information: Couchbase Server Manual: Views and Indexes.

 * Sample Patterns: to see examples and patterns you can use for views, see
   Couchbase Views, Sample Patterns.

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see Couchbase Views, Sample Patterns.

<a id="_structure_of_the_flask_application"></a>

### Structure of the Flask Application

We’ll be showing bits and pieces of the web app as it pertains to specific
sections. The entire file is less than 300 lines long, and can be inspected by
looking into the `beer.py` file in the repository.

First, our imports

We need some extra imports to be able to handle exceptions properly and let us
build better view queries.

### beer.py (imports)


```
from collections import namedtuple
import json

from flask import Flask, request, redirect, abort, render_template

from couchbase import Couchbase
from couchbase.exceptions import KeyExistsError
from couchbase.views.iterator import RowProcessor
from couchbase.views.params import UNSPEC, Query
```



Then, we want to set some constants for our application.

### beer.py (configuration)

**Unhandled:** `[:unknown-tag :screen]`

The `ENTRIES_PER_PAGE` variable is used later on to configure how many beers and
breweries to show in the search results.

Now, we’re ready to create our `Flask` application instance

### beer.py (creating the application)


```
app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)
```



The first line creates a new Flask application. The first argument is the module
in which the application is defined. Since we’re only using a single file as our
application, we can use `__name__` which expands to the name of the current file
being executed (minus the `.py` suffix).

The second argument instructs Flask to treat unrouted URLs as being requests for
files located in the `static` directory we created earlier. This will allow our
templates to load the required `.js` and `.css` files.

The second line creates a configuration object for our `app`. The argument is
the name of the module to scan for configuration directives. Flask scans this
module for variable names in `UPPER_CASE` and places them in the `app.config`
dictionary.

Then, define a function to give us a database connection

### beer.py (generating a Connection object)


```
def connect_db():
    return Couchbase.connect(
        bucket=app.config['DATABASE'],
        host=app.config['HOST'])

db = connect_db()
```



You already know how to connect to a Couchbase cluster, we’ll skip the
explanation here.

The second line sets the module-level `db` variable to be the `Connection`
object. While in larger applications this is probably not a good idea, since
this is a simple app, we can get away with it.

<a id="_the_welcome_page"></a>

## The Welcome Page

The first route we will implement is that of the `welcome` page, i.e. the page
which is displayed when someone will go to the root of your site. Since there is
no Couchbase interaction involved, we just tell Flask to render the template.

### beer.py (welcome page)


```
@app.route('/')
def welcome():
    return render_template('welcome.html')

app.add_url_rule('/welcome', view_func=welcome)
```



The `welcome.html` is actually a *Jinja* template inside the `templates`
directory. Its contents is displayed here:

### templates/welcome.html

**Unhandled:** `[:unknown-tag :screen]`

The template simply provides some links to the brewery and beer pages (which are
shown later).

An interesting thing about this template is that it "inherits" from the common
`layout.html` template. All pages in the beer app will have a common header and
footer to them — with only their `body` differing. Here we will show the
`layout.html` template.

### templates/layout.html

**Unhandled:** `[:unknown-tag :screen]`

If you start your app now, you should be able to navigate to `localhost:5000`
and see the welcome page. You’ll get a 404 if you try to visit any links though
- this is because we haven’t implemented them yet. Let’s do that now!

<a id="_managing_beers"></a>

## Managing Beers

In this section we’ll show the construction of the webapp in respect to managing
beers. We’ll be able to list, inspect, edit, create, search, and delete beers.

<a id="_showing_beers"></a>

### Showing Beers

Now we’re finally getting into the cooler stuff of this tutorial.

First, we’ll implement several classes for our pages to use.

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



First, we declare a simple `Beer` object. This isn’t too fancy and we could’ve
probably just used a simple `dict` - however it allows us to demonstrate the use
of the `RowProcessor` interface (defined next).

In the beer listing page, we want to display each beer along with a link to the
brewery that produces it. However, we’ve defined the `beer/by_name` view to only
return the name of the beer. In order to obtain the brewery we need to fetch
each beer document and examine it. The document will contain the Brewery ID
which we can then use later on.

The `BeerListRowProcessor` is an implementation of the `RowProcessor` interface
which operates on the returned view rows.

For each raw JSON row, it creates a new `Beer` object; the first argument is the
document ID - which is used to provide a link to display more information about
the beer. The second is the name of the beer itself which we use in the beer
list on the webpage.

We also create a local variable called `by_docids` - this will allow us to get a
`Beer` object by its document ID- for reasons we will soon see.

After we’ve created all the beers, we create a list of document IDs to fetch by
using list comprehension. We pass this list to `get_multi` (passing
`quiet=True`, as there may be some inconsistencies between view indexes and the
actual documents).

While we could have made this simpler by performing an individual `get` on each
`beer.id`, this would have been less efficient in terms of network usage.

Now that we have the beer documents, it’s time to set each beer’s `brewery_id`
to its relevant value.

We first check to see that each document was successful in being retrieved; then
we look up the corresponding `Beer` object by getting it from the `by_docids`
dictionary using the `beer_id` as the key.

Then, we extract the `brewery_id` field from the document and place it into the
`Beer` object.

Finally, we return the list of populated beers. The `View` object (returned by
the `query` function) will now yield results from it as we iterate over it.

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



We tell flask to route requests to `/beers` to this function. We create an
instance of the `BeerListRowProcessor` function we just defined above.

We then execute a view query using the `query` method; passing it the name of
the design and view ( `beer` and `by_name`, respsectively).

We set the `limit` directive to the aforementioned `ENTRIES_PER_PAGE` directive;
so as not to flood a single webpage with many results.

We finally tell the `query` method to use our own `BeerListRowProcessor` for
processing the results.

We then direct the template engine to render the `beer/index.html` template,
setting the template variable `rows` to the iterable returned by the `query`
function.

Here is the `beer/index.html` template:

### templates/beer/index.html

**Unhandled:** `[:unknown-tag :screen]`

We’re using *Jinja*  `{% for %}` blocks to iterate and emit a fragment of HTML
for each `Beer` object returned by the query.

If you navigate to `localhost:5000/beers`, you’ll see a listing of beers now.
Each beer will have an `To Brewery`, `Edit`, and `Delete` button.

On the bottom of the page, you can also see a button `Add Beer` which will allow
you to define new beers.

Let’s implement the `Delete` button next!

<a id="_deleting_beers"></a>

### Deleting Beers

Due to the simplicity of Couchbase and Flask, we can implement a single method
to delete both beers and breweries.

### beer.py (deleting a beer)

**Unhandled:** `[:unknown-tag :screen]`

Here we tell flask to route any URL which has as its second component the string
`delete` to this method. The paths in `<angle brackets>` are routing tokens
which flask passes to the handler as arguments. This means that URLs such as
`/beers/delete/foobar`, `/foo/delete/whatever` etc. are all routed to here.

When we get an ID, we try to delete it by using the `delete` method. We use a
`try` block. If successful, we redirect to the welcome page; but if the key does
not exist, we return with an error message and a `404` status code.

You can now access this page by going to
`localhost:5000/beers/delete/nonexistent` and get a 404. Or you can delete a
beer by clicking on one of the `Delete` buttons in the `/beers` page!

<a id="_displaying_beers"></a>

### Displaying Beers

Here we will demonstrate how you can display the beers. In this case, we display
a page showing all the fields and values of a given beer.

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

**Unhandled:** `[:unknown-tag :screen]`

Here we make the `display` variable in a special `{% set %}` directive. This
makes dealing with the rest of the code simpler.

The next thing we do is extract the `brewery_id`, and create a special entry
with a link pointing to the page to display the actual brewery.

The next thing we do is iterate over the rest of the fields (omitting the
brewery ID); printing out the key and value of each.

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
                           posturl='/beers/edit/' + beer,
                           is_create=False)


@app.route('/beers/edit/<beer>', methods=['POST'])
def edit_beer_submit(beer):
    doc, err = normalize_beer_fields(request.form)

    if not doc:
        return err

    db.set(beer, doc)
    return redirect('/beers/show/' + beer)
```



We define two handlers for editing. The first is the `GET` method for
`/beers/edit/<beer>` which displays a nice HTML form in which we can use to edit
it. It passes the template the `Beer` object, a boolean parameter indicating
that this is *not* a new beer (as the same template is also used for the `Create
Beer` form), and finally the URL to `POST` to when the form is submitted.

The second is the `POST` handler which validates the input. The post handler
calls the `normalize_beer_fields` function.

This function converts the form fields into properly formed names for the beer
document; then it checks to see that the beer has a valid `name`. It then checks
to see that a `brewery_id` was specified and that it indeed exists. Once these
checks have passed, it returns a tuple of ( `doc`, `None` ).

The `POST` handler checks to see that the second element of the tuple is false -
if it isn’t, then it’s an error code, and the first element becomes the error
message.

Otherwise, the first element becomes the document.

It then sets the document in Couchbase using the `set` method.

The template is rather wordy as we enumerate all the possible fields with a nice
description :)

### templates/beer/edit.html

**Unhandled:** `[:unknown-tag :screen]`

The template first checks the `is_create` variable - if it’s `False`, then we’re
editing an existing beer, and the caption is filled with that name. Otherwise,
it’s titled as `Create Beer`.

<a id="_creating_beers"></a>

### Creating Beers

This is largely the same as editing beers:

### beer.py (create beer page)

**Unhandled:** `[:unknown-tag :screen]`

Here we display the same form as the one for editing beers, except we set the
`is_create` parameter to True, and pass an empty `Beer` object - needed because
the template still tries to populate the form fields with *existing* values.

In the `POST` handler, we call `normalize_beer_field` as above when editing
beers.

Since we’re creating a *new* beer, we use the `add` method instead. This will
raise an exception if the beer already exists. We catch this and display it to
the user.

If all things went well, the user is redirected to the beer display page for the
newly created beer.

<a id="_searching_beers"></a>

### Searching Beers

In the beer listing page above, you may have noticed a search box at the top. We
can use it to dynamically filter our table based on user input. We’ll use
*Javascript* at the client layer to perform the querying and filtering, and
views with range queries at the server (flask) layer to return the results.

Before we implement the Python-level search method, we need to put the following
in the `static/js/beersample.js` file (if it’s not there already) to listen on
searchbox changes and update the table with the resulting JSON (which will be
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
issues an *AJAX* query on the search function within the app. The search handler
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

It then creates a `Query` object; the `Query` object then has its `mapkey_range`
property set to a list of two elements; the first is the user input, and the
second is the user input with the magic `STRING_RANGE_END` string appended to
it. This form of range indicates that all keys which start with the user input (
`value` ) will be returned. If we just provided a single element, results would
also contain matches which are lexically "greater" than the user input; if we
just provided the same value for the second and first elements, only items which
matched the string exactly would be returned.

The special `STRING_RANGE_END` is actually a `u"\uEFF"` UTF-8 character, which
for the view engine means "end here". You need to get used to it a bit, but it’s
actually very neat and efficient.

We re-use our `BeerListRowProcessor` class to filter the results here (as the
data required is the same as that of the beer listing ( `beer/index.html` )
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

The tutorial presented an easy approach to start a web application with
Couchbase Server as the underlying data source. If you want to dig a little bit
deeper, the full source code on couchbaselabs on GitHub has more code to learn
from. This may be extended and updated from time to time.

Of course, this is only the starting point for Couchbase, but together with the
Getting Started Guide, you should now be well equipped to start exploring
Couchbase Server on your own. Have fun working with Couchbase!

<a id="_food_for_thought"></a>

### Food For Thought

There are some things still not implemented in the example; here is some food
for thought.

 * When deleting a brewery, ensure it has no beers dependent on it.

 * Provide a search where one can query beers beloning to a given brewery

 * Handle concurrent updates to a beer and/or brewery

 * Implement a *like* feature, where one can like a beer or a brewery; likewise,
   they can unlike one as well!

<a id="_using_the_apis"></a>
