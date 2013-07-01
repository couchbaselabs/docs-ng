# Tutorial

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_quickstart"></a>

## Quickstart

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :screen]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]````
   function (doc, meta) {
       if (doc.type && doc.type == "beer") {
           emit(doc.name, null);
       }
   }
   ```

   **Unhandled:** `[:unknown-tag :simpara]````
   function (doc, meta) {
       if (doc.type == "brewery") {
           emit(doc.name, null);
       }
   }
   ```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :screen]`

 * **Unhandled:** `[:unknown-tag :simpara]`

<a id="_preparations"></a>

## Preparations

**Unhandled:** `[:unknown-tag :simpara]`<a id="_project_setup"></a>

### Project Setup

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :screen]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`<a id="_preparing_the_views"></a>

### Preparing the Views

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`
```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]````
   function (doc, meta) {
     if(doc.type && doc.type == "brewery") {
       emit(doc.name, null);
     }
   }
   ```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

<a id="_structure_of_the_flask_application"></a>

### Structure of the Flask Application

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



### beer.py (configuration)

**Unhandled:** `[:unknown-tag :screen]`

### beer.py (creating the application)


```
app = Flask(__name__, static_url_path='')
app.config.from_object(__name__)
```



### beer.py (generating a Connection object)


```
def connect_db():
    return Couchbase.connect(
        bucket=app.config['DATABASE'],
        host=app.config['HOST'])

db = connect_db()
```



**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_the_welcome_page"></a>

## The Welcome Page

### beer.py (welcome page)


```
@app.route('/')
def welcome():
    return render_template('welcome.html')

app.add_url_rule('/welcome', view_func=welcome)
```



### templates/welcome.html

**Unhandled:** `[:unknown-tag :screen]`

### templates/layout.html

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`<a id="_managing_beers"></a>

## Managing Beers

**Unhandled:** `[:unknown-tag :simpara]`<a id="_showing_beers"></a>

### Showing Beers

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



### templates/beer/index.html

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_deleting_beers"></a>

### Deleting Beers

### beer.py (deleting a beer)

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`<a id="_displaying_beers"></a>

### Displaying Beers

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



### templates/beer/show.html

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_editing_beers"></a>

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



### templates/beer/edit.html

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`<a id="_creating_beers"></a>

### Creating Beers

### beer.py (create beer page)

**Unhandled:** `[:unknown-tag :screen]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_searching_beers"></a>

### Searching Beers

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



**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
{ "id" : "beer_id", "name" : "beer_name", "brewery" : "the_brewery_id" }
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_managing_breweries"></a>

## Managing Breweries

**Unhandled:** `[:unknown-tag :simpara]`<a id="_wrapping_up"></a>

## Wrapping Up

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_food_for_thought"></a>

### Food For Thought

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

<a id="_using_the_apis"></a>
