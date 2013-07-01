# Getting Started

The following chapters will demonstrate how to get started quickly using
Couchbase with the Python SDK. We’ll first show how to install the SDK and then
demonstrate how it can be used to perform some simple operations.

<a id="_download_and_installation"></a>

## Download and Installation

Follow and install these packages to get started wih using the Python SDK

 1. [Get, Install, and Start Couchbase server](http://www.couchbase.com/download).
    Come back here when you are done.

 1. [Get and install the C library](http://www.couchbase.com/develop/c/current).
    Note that for Windows users, starting with version 1.0 Beta, the C library is
    bundled with the Python SDK, so you may skip this step.

 1. Check your Python version. It should be at least version 2.6 (Python versions
    3.x are supported as well). To check your python version:

    **Unhandled:** `[:unknown-tag :screen]`

 1. Install the Python SDK. The easiest way to do this is via the `pip` tool.

    Simply invoke

    **Unhandled:** `[:unknown-tag :screen]` If all went well, you should not see any
    errors printed to the screen.

    Alternatively, you may also manually download one of the packages at
    [PyPi](https://pypi.python.org/pypi/couchbase)

 1. Verify your Python SDK is available and working

    **Unhandled:** `[:unknown-tag :screen]`

If this does not print any errors or exceptions, your Python SDK is properly
installed!

<a id="_hello_couchbase"></a>

## Hello Couchbase

To follow the tradition of programming tutorials, we’ll start with "Hello
Couchbase". Note that this example expects you to have installed the
"beer-sample" bucket (which is provided with the default install).

### hello-couchbase.py


```
from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError

c = Couchbase.connect(bucket='beer-sample', host='localhost')

try:
    beer = c.get("aass_brewery-juleol")

except CouchbaseError as e:
    print "Couldn't retrieve value for key", e
    # Rethrow the exception, making the application exit
    raise

doc = beer.value

# Because Python 2.x will complain if an ASCII format string is used
# with Unicode format values, we make the format string unicode as
# well.

print unicode("{name}, ABV: {abv}").format(name=doc['name'], abv=doc['abv'])

doc['comment'] = "Random beer from Norway"

try:
    result = c.replace("aass_brewery-juleol", doc)
    print result

except CouchbaseError as e:
    print "Couldn't replace key"
    raise
```



While this code should be simple, we’ll explain each step in greater detail:

 * *Connecting*

   The `Couchbase.connect` class method constructs a new
   `couchbase.connection.Connection` object. This object represents a connection to
   a single bucket within the cluster. Arguments passed to `connect` are passed to
   the constructor (see API documentation on the `Connection` object for more
   details and options).

   A bucket represents a logical namespace for a key. All keys must be unique
   within a single bucket, but multiple buckets can have keys with the same names
   (and they will not conflict). A new connection object must be created for each
   bucket you wish to interact with in your application. Here we are creating one
   connection to the `beer-sample` bucket.

   The constructor is passed the bucket name (which is `beer-sample` ), and a node
   on the cluster to connect to. Note that you can pass any node that is a member
   of the cluster. In this case, I’m using my local cluster instance.

 * *Retrieving Data*

   The `get` method retrieves the value for the key requested. If the key exists, a
   `Result` object is returned containing the value of the key as well as
   additional metadata. To get the actual value of the object, you can access the
   `Result` object’s `value` property.

   Note that if the key does not exist on the server, an exception of type
   `CouchbaseError` is thrown. This exception object can be caught and examined or
   printed to see more details about why the operation failed. See the API
   documentation for more details.

   Note that we treat the `value` as a `dict` object. As a documented oriented
   database, values stored to the server are considered to be JSON by default, and
   when retrieve from the server are interpreted to be JSON (and unserialized into
   a Python dict). It is possible to use other formats than the default JSON,
   however. The `set` methods accept a `format` keyword argument which indicates
   the conversion type to be used. The default is `couchbase.FMT_JSON`, but you may
   also use `couchbase.FMT_BYTES`, `couchbase.FMT_UTF8`, or `couchbase.FMT_PICKLE`
   instead. If none of these are sufficient, you may even write your own custom
   `Transcoder` object to handle conversion on your own.

 * *Storing Data*

   To store documents in the server, you can use one of the `set` family of
   methods. Here we use `replace` which enforces the constraint that a previous
   value of the document must already exist. This can be thought of as an *update*
   operation in terms of *C.R.U.D.* (Create, Read, Update, Delete).

   The storage methods also return a `Result` object containing metadata about the
   value stored.

Now we’re ready to run our first Couchbase Program:

**Unhandled:** `[:unknown-tag :literallayout]`  **Unhandled:** `[:unknown-tag
:literallayout]` The first line outputs the *name* field of the document, and
the second line outputs the `Result` object of the replace operation.

<a id="_working_with_documents"></a>

## Working With Documents

A document in Couchbase server consists of a *key*, *value*, and *metadata*. We
will explain the following briefly

 * *Key*

   A key is a unique identifier for your data. Each document must have its unique
   key. The key can be any valid unicode string.

 * *Value*

   The value is your own application data which exists under the key. The format of
   the value can be anything. By default, only JSON-serializable object are
   supported (that is, Python `str`, `unicode`, `dict`, `list`, `tuple`, `int`,
   `long`, `float`, `bool`, and `None` types) - in short, anything that the
   standard `json.dumps` will accept. The reason JSON is the default format is for
   the ability to later query the database based on value contents, as will be
   explained later.

   Note that it is possible to also store arbitrary Python objects using the
   `FMT_PICKLE` value for the `format` option.

 * *Metadata*

   This contains information concerning the format of the value (e.g. whether it’s
   JSON, Pickle, or something else). It also contains revision information - such
   as the *CAS*, which we’ll read about later.

You can *store* documents by providing the unique *key* under which the document
will be stored, and the *value* which contains the actual document. You can
*retrieve* documents either by directly specifying the unique *key* under which
the document was stored, or by querying *views* which will retrieve information
about documents based on specific *criteria* - which will yield the documents
that match it.

<a id="_storing_documents"></a>

### Storing Documents

This section provides a bit more insight in how to store documents. This is a
prerequisite to demonstrate how to retrieve documents (as there must be
something to retrieve)

There are additional storage methods beyond those described here, which are
covered in the Advanced section. These include manipulating numeric counters,
setting expiration times for documents, and appending/prepending to existing
values.

The `Connection` object has three different store operations which conform to
the *CRUD* model:

 * `set(key, value)`

   This stores the document `value` under the key `key`. If the key did not
   previously exist, it is created. If the key already exists, its existing value
   is overwritten with the new contents of `value`.

 * `add(key, value)`

   This stores the document `value` under the key `key`, but only if `key` does
   *not already exist*. If `key` already exists, an exception is thrown.

 * `replace(key, value)`

   This is the inverse of `add`. This will set the contents of `key` to `value`,
   but only if the *key already exists*. If the key does not already exist, an
   exception is thrown.

 * `delete(key)`

   Deletes the key `key` from the bucket. Future attempts to access this key via
   `get` will raise an exception until something is stored again for this key using
   one of the `set` methods.

### CRUD Example

The following code demonstrates the four functions above


```
from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError

key = "demo_key"
value = "demo_value"

# We use the 'default' bucket.
c = Couchbase.connect(bucket='default', host='localhost')

print "Setting key {0} with value {1}".format(key, value)
result = c.set(key, value)
print "...", result

print ""
print "Getting value for key {0}".format(key)
result = c.get(key)
print "...", result

print ""
print "Creating new key {0} with value 'new_value'".format(key)
print "This will fail as '{0}' already exists".format(key)
try:
    c.add(key, "another value")
except CouchbaseError as e:
    print e

print "Replacing existing key {0} with new value".format(key)
result = c.replace(key, "new value")
print "...", "result"

print ""
print "Getting new value for key {0}".format(key)
result = c.get(key)
print "...", result

print ""
print "Deleting key", key
result = c.delete(key)
print "...", result

print ""
print "Getting value for key {0}. This will fail as it has been deleted".format(key)
try:
    c.get(key)
except CouchbaseError as e:
    print e

print ""
print "Creating new key {0} with value 'added_value'".format(key)
result = c.add(key, "added_value")
print "...", result

print "Getting the new value"
result = c.get(key)
print "...", result
```

Will output

**Unhandled:** `[:unknown-tag :screen]`<a id="_getting_documents_by_key"></a>

### Getting Documents By Key

Couchbase allows two ways to fetch your documents: You can retrieve a document
by its *key*, or you can retrieve a set of documents which match some constraint
using Views. Since views are more complex, we’ll first demonstrate getting
documents by their keys.

To get a single document, simply supply the key as the first argument to the
`get` method. It will return a `Result` object on success which can then be used
to extract the value.

### Getting A Single Document


```
client.store("my list", [])
result = client.get("my list")
doc = result.value
```



To get multiple documents, you may use the more efficient `get_multi` method. It
is passed an iterable sequence of keys, and returns a dict-like object (this is
actually a dict subclass called `MultiResult` ) with the keys passed to
`get_multi` as keys, and the values being a `Result` object for the result of
each key.

### Getting Multiple Documents


```
client.set_multi({
    'sheep_counting' : ['first sheep', 'second sheep'],
    'famous_sheep' : {'sherry lewis' : 'Lamb Chops'}
})

keys = ('sheep_counting', 'famous_sheep')
results = client.get_multi(keys)
for key, result in results.items():
    doc = result.value
```



### Error Handling

Note that if a document does not exist, a `couchbase.exceptions.NotFoundError`
(which is a subclass of `couchbase.exceptions.CouchbaseError` is thrown).

You can change this behavior by using the `quiet` keyword parameter and setting
it to true (to suppress exceptions for a specific `get` call) or by setting the
`Connection.quiet` property on the `Connection` object (which will supress
exceptions on `get` for subsequent calls).

When using `quiet`, you can still determine if a key was retrieved successfuly
by examining the `success` property of the value object

### Passing quiet to get


```
result = client.get("non-exist-key", quiet=True)
if result.success:
    print "Got document OK"
else:
    print ("Couldn't retrieve document. "
           "Result was received with code"), result.rc
```



Or

### Setting quiet in the constructor


```
client = Couchbase.connect(bucket='default', quiet=True)
result = client.get("non-exist-key")
if result.success:
    print "Got document OK"
else:
    print "Couldn't retrieve document"
```



The `rc` property of the `Result` object contains the error code received on
failure (on success, its value is `0` ). You can also obtain the exception class
which would have been thrown by using


```
>>> CouchbaseError.rc_to_exctype(result.rc)
<class 'couchbase.exceptions.NotFoundError'>
```

This class method is passed an error code and produces the appropriate exception
class.

Note that on `get_multi` with the quiet option enabled, you can immediately
determine if all the keys were fetched successfully or not by examining the
returned `MultiResult` 's `all_ok` property.


```
results = client.get_multi(("i exist", "but i don't"), quiet=True)
if not results.all_ok:
    print "Couldn't get all keys"
```

<a id="_getting_documents_by_querying_views"></a>

### Getting Documents by Querying Views

In addition to fetching documents by keys, you may also employ *Views* to
retrieve information using secondary indexes. This guide gets you started on how
to use them from the Python SDK. If you want to learn more about views, see the
[chapter in the Couchbase Server 2.0
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)

First, create your view definition using the web UI (though you may also do this
directly from the Python SDK, as will be shown later).

You can then query the view results by calling the `query` method on the
`Connection` object. Simply pass it the design and view name.


```
view_results = client.query("beer", "brewery_beers")
for result in view_results:
    print "Mapped key: %r" % (result.key,)
    print "Emitted value: %r" % (result.value,)
    print "Document ID: %s" % (result.docid,)
```

The `query` method returns a `couchbase.views.iterator.View` object which is an
iterator. You may simply iterate over it to retrieve the results for the query.
Each object yielded is a `ViewRow` which is a simple object containing the key,
value, document ID, and optionally the document itself for each of the results
returned by the view.

In addition to passing the design and view name, the `query` method accepts
additional keyword arguments which control the behavior of the results returned.
You may thus use it like so:


```
results = client.query("beer", "brewery_beers", opt1=value1, opt2=value2, ...)
for result in results:
    # do something with result..
```

Here are some of the available parameters for the `query` method. A full listing
may be found in the API documentation.

 * `include_docs`

   This boolean parameter indicates whether the corresponding document should be
   retrieved for each row fetched. If this is true, the `doc` property of the
   `ViewRow` object yielded by the iterator returned by `query` will contain a
   `Result` object containing the document for the key.

 * `reduce`

   This boolean parameter indicates whether the server should also pass the results
   to the view’s `reduce` function. An exception is raised if the view does not
   have a `reduce` method defined.

 * `limit`

   This numeric parameter indicates the maximum amount of results to fetch from the
   query. This is handy if your query can produce a lot of results

 * `descending`

   This boolean parameter indicates that the results should be returned in reversed
   (descending) order.

 * `stale`

   This boolean parameter can be used to control the tradeoff between performance
   and freshness of data.

 * `debug`

   This boolean parameter will also fetch low-level debugging information from the
   view engine.

 * `streaming`

   This boolean parameter indicates whether the view results should be decoded in a
   *streaming* manner. When enabled, the iterator will internally fetch chunks of
   the response as required.

As this is less efficient than fetching all results at once, it is disabled by
default, but can be very useful if you have a large dataset as it prevents the
entire view from being buffered in memory.


```
results = client.query("beer", "brewery_beers",
                       include_docs=True, limit=5)

for result in results:
    print "key is %r" % (result.key)
    doc = result.doc.value
    if doc['type'] == "beer":
        print "Got a beer. It's got %0.2f ABV" % (doc['abv'],)
```

<a id="_encoding_and_serialization"></a>

### Encoding and Serialization

The default encoding format for the Python SDK is JSON. This means you can pass
any valid object which is accepted by the standard `json.dumps` library function
and you will receive it back when you retrieve it.


```
# -*- coding: utf-8 -*-

import pprint
from couchbase import Couchbase

client = Couchbase.connect(bucket='default', host='localhost')
value = {
    "this is a" : "dictionary",
    "and this is a list" : ["with", "some", "elements"],
    "and this is a tuple" : ("with", "more", "elements"),
    "you can also use floats" : 3.14,
    "integers" : 42,
    "strings" : "hello",
    "unicode" : "שלום!",
    "blobs" : "\x00",
    "or a None" : None
}

client.set("a_key", value)
result = client.get("a_key")
pprint.pprint(result.value)
print result.value['unicode']
```

Which then prints

**Unhandled:** `[:unknown-tag :screen]` If you navigate to the document browser
for the bucket in the Web UI (go to `localhost:8091` in your browser, type in
your administrative credentials, go over to the *Data Buckets* pane, and click
on the *Documents* button for the `default` bucket. Then in the text input box,
type in the ID for the document you just created (in this case, it’s `a_key` )),
you’ll see it show up and recognized by the document browser). This means it can
now be indexed and queried against using views.

**Unhandled:** `[:unknown-tag :inlinemediaobject]`

<a id="_other_formats"></a>

### Other Formats

While JSON is the default format, it might be useful to utilize other formats.
For example, if you wish to store complex custom Python objects and classes and
don’t require that they be indexed with views, you can use the `pickle`
serialization format. This allows you to store types that will not be accepted
by JSON:


```
import pprint

from couchbase import Couchbase, FMT_PICKLE

c = Couchbase.connect(bucket='default')
c.set("a_python_object", object(), format=FMT_PICKLE)
c.set("a_python_set", set([1,2,3]), format=FMT_PICKLE)

pprint.pprint(c.get("a_python_object").value)
pprint.pprint(c.get("a_python_set").value)
```

Outputs:

**Unhandled:** `[:unknown-tag :screen]` You can also store arbitrary strings of
bytes by using `FMT_BYTES`

In Python 2 (2.6 and above) `bytes` and `str` are the same type; however in
Python 3, a `str` is a string with an encoding (i.e. Python 2’s `unicode` )
while `bytes` is a sequence of bytes which must be explicitly converted in order
to be used with text operations.


```
import pprint

from couchbase import Couchbase, FMT_BYTES

c = Couchbase.connect(bucket='default')
c.set("blob", b"\x01\x02\x03\x04", format=FMT_BYTES)
pprint.pprint(c.get("blob").value)
```

Outputs

**Unhandled:** `[:unknown-tag :screen]` Or use `FMT_UTF8` to store a `unicode`
object represented as *UTF-8*

While JSON is also capable of storing strings and Unicode, the JSON
specification mandates that all strings begin and end with a quote ( `"` ). This
uses up needless space and costs extra processing power in "decoding" and
"encoding" your JSON string. Therefore you can save on performance by using
`FMT_UTF8` for simple strings

It is possible to encode your data in other encodings other than *UTF-8*.
However since the view engine operates using *UTF-8*, we select this as the
default. If you need a different encoding, consider using the `Transcoder`
interface.


```
from couchbase import Couchbase, FMT_UTF8

c = Couchbase.connect(bucket='default')
c.set("EXCALIBUR", u"\u03EE", format=FMT_UTF8)
print c.get("EXCALIBUR")
```

Outputs

### Setting The Default Format

You can set the default format for the value type you use most by setting the
`default_format` property on the connection object, either during construction
or afterwards:


```
c = Couchbase.connect(bucket='default', default_format=FMT_UTF8)
```

Or


```
c.default_format = FMT_PICKLE
```

<a id="_tutorial"></a>
