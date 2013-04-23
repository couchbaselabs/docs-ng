# Getting Started

This chapter will get you started with using Couchbase Server and the Python
Client Library.

<a id="server"></a>

## Get a Server

[Get & Install Couchbase
Server.](http://new.stage.couchbase.com/couchbase-server/next) Come back here
when you're done

<a id="downloading"></a>

## Get a Client Library

The easiest way to get the Couchbase Python Client Library is to use PIP.


```
pip install couchbase
```

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="tryitout"></a>

## Try it Out!

### Setup

Once the Couchbase Python Client Library has been installed, it's easy to get
started. Create a new Python file and add your import statements.


```
#!/usr/bin/env python

from couchbase.client import Couchbase
```

<a id="couchbaseclient"></a>

### Creating a Couchbase Client Instance

To create a Couchbase client instance, the URI of any available node in the
cluster is needed, as is a bucket name and password (or cluster credentials).


```
couchbase = Couchbase("http://192.168.56.2:8091/pools/default", "default", "");
```

The default Couchbase Server installation creates a bucket named "default"
without a password, therefore the third argument is optional when used with this
bucket. If you created an authenticated bucket, you should specify those values
in place of the default settings above.

The construction of a Couchbase client instance does require some overhead as
the cluster topology is discovered, so as a best practice the client should not
be created more than once per bucket, per application.

<a id="buckets"></a>

### Working with a Bucket

The Couchbase instance is a container for Bucket instances, which based on the
credentials supplied are accessible through the client's bucket collection.
Using the credentials above, only the default bucket would be available to an
application. If cluster credentials were supplied, then all buckets would be
available.


```
bucket = client["default"]
```

CRUD operations are performed by using an instance of a Bucket.

<a id="crud"></a>

### CRUD Operations

The primary CRUD API used by the Python Client is that of a standard key/value
store. You create and update documents by supplying a key and value. You
retrieve or remove documents by supplying a key. For example, consider the JSON
document that you'll find in the "beer-sample" bucket that's available when you
install Couchbase Server and setup your cluster. The key "110fc0f765" is
associated with the beer document below.


```
{
 "name": "Sundog",
 "abv": 5.25,
 "ibu": 0,
 "srm": 0,
 "upc": 0,
 "type": "beer",
 "brewery_id": "110f1bb0ee",
 "updated": "2010-07-22 20:00:20",
 "description": "Sundog is an amber ale as deep as the copper glow of a Lake Michigan sunset. Its biscuit malt give Sundog a toasty character and a subtle malty sweetness. Sundog brings out the best in grilled foods, caramelized onions, nutty cheese, barbecue, or your favorite pizza.",
 "style": "American-Style Amber/Red Ale",
 "category": "North American Ale"
}
```

Note that credentials and bucket selection would vary slightly for this example.


```
couchbase = Couchbase("http://192.168.56.2:8091/pools/default", "beer-sample", "");
bucket = couchbase["beer-sample"]
```

To retrieve this document, you simply call the Get method of the client.


```
var savedBeer = client.Get("110fc0f765");
```

To retrieve this document, you simply call the get method of the bucket. The get
method returns a tuple, where the third element is the value. The first is the
status code and the second the CAS value for the key.


```
savedBeer = bucket.get("110fc0f765")[2]
```

If you add a line to print the savedBeer to the console, you should see a JSON
string that contains the data above.


```
savedBeer = client.get("110fc0f765")
print savedBeer
```

To add a document, first create a JSON string.


```
newBeer = \
"""
   "name": "Old Yankee Ale",
   "abv": 5.00,
   "ibu": 0,
   "srm": 0,
   "upc": 0,
   "type": "beer",
   "brewery_id": "110a45622a",
   "updated": "2012-08-30 20:00:20",
   "description": ".A medium-bodied Amber Ale",
   "style": "American-Style Amber",
   "category": "North American Ale"
"""
```

For a key, we'll simply compute a SHA-1 hash of our document and then grab the
first 10 characters. The exact mechanism by which you create your keys need only
be consistent. If you are going to query documents by key (not just through
views) you should choose predictable keys (e.g., beer\_Old\_Yankee\_Ale).


```
import hashlib
key = hashlib.sha1(newBeer).hexdigest()[0:10]
```

With this new key, the JSON document may easily be stored.


```
bucket.set(key, 0, 0, newBeer)
```

The set method will replace a key if it exists or add it if it does not. There
are also individual add and replace methods. There are four arguments to provide
the set method. The first is the key and the fourth the value. The second and
third arguments provided are the expiry and flags for the set operation. In the
case above, the key will not expire, nor will it have any flags set on the data.
For more on these topics please see the Python API docs.

Removing a document simply entails calling the delete method with the key to be
removed.


```
bucket.delete(key)
```

<a id="storingjson"></a>

### Storing JSON Documents

While storing and retreiving JSON strings is a straightforward process,
documents in a typical application are likely at some point to be represented by
domain objects or some data structure other than a string. For example, the beer
documents could be represented by an instance of a Beer class in memory or more
simply as dictionaries. The Python Client Library will accept arbitrary strings
as values. However, on the server, these strings (if not JSON) will be stored as
binary attachments to a JSON document. The impact of being an attachment is that
it will not be indexed in a view. A better solution then, is to serialize data
objects or dictionaries to JSON strings before storing them and deserializing
the JSON document strings to objects or dictionaries when retrieving them.

Instead of the JSON string above, using a dictionary provides an easy way to
organize documents.


```
newBeer = \
{
   "name": "Old Yankee Ale",
   "abv": 5.00,
   "ibu": 0,
   "srm": 0,
   "upc": 0,
   "type": "beer",
   "brewery_id": "110a45622a",
   "updated": "2012-08-30 20:00:20",
   "description": ".A medium-bodied Amber Ale",
   "style": "American-Style Amber",
   "category": "North American Ale"
}
```

To store this dictionary as a JSON document, simply use the dumps method of the
json module.


```
import json
bucket.set(key, 0, 0, json.dumps(newBeer)
```

To retrieve the stored document string into a dictionary instance, use the json
loads method.


```
savedBeer = json.loads(bucket.get(key)[2])
print savedBeer["name"]
```

<a id="workingwithviews"></a>

### Working with Views

Map/Reduce Views are used to create queryable, secondary indexes in Couchbase
Server. The primary index for documents is the key you use when performing the
standard CRUD methods described above. See the view documentation for more
information on writing views.

For this example, a by\_name view in a beer design document will be queried.
This view simply checks whether a document is a beer and has a name. If it does,
it emits the beer's name into the index. This view will allow for beers to be
queried for by name. For example, it's now possible to ask the question "What
beers start with A?"


```
function (doc, meta) {
  if (doc.type && doc.type == "beer" && doc.name) {
     emit(doc.name, null);
  }
}
```

Querying a view through the Python client is performed through the view method.


```
view = bucket.view("_design/beer/_view/by_name")
```

The view method returns a list with dictionary entries for each row in the
view's results. Iterating over the results of the view, the "id" property of the
row (currently the unicode id must be converted to an ASCII string) can be used
to retrieve the original document.


```
for row in view:
    id = row["id"].__str__()
    beer = json.loads(bucket.get(id)[2])
    print beer["name"]
```

Finally, the view results can be modified by specifying keyword arguments when
first calling the view method.


```
view = bucket.view("_design/beer/_view/by_name", limit=10, key="Sundog")
```

<a id="tutorial"></a>
