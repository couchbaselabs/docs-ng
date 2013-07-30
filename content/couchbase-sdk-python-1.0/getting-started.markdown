# Getting Started

The following sections demonstrate how to get started using Couchbase with the
Python SDK. We’ll first show how to install the SDK and then demonstrate how it
can be used to perform some simple operations.

<a id="_download_and_installation"></a>

## Download and Installation

Install the following packages to get started using the Python SDK:

 1. [Download, install, and start Couchbase
    server](http://www.couchbase.com/download). Come back here when you are done.

 1. [Download and install the C
    library](http://www.couchbase.com/develop/c/current). If you are using Microsoft
    Windows, you can skip this step because starting with version 1.0 Beta, the C
    library is bundled with the Python SDK.

 1. Check your Python version. It must be at least version 2.6 (Python version 3.x
    is supported as well). To check your python version:

    `shell> python -V python 2.6.6`

 1. Install the Python SDK. The easiest way to do this is via the `pip` tool:

    `shell> pip install couchbase --quiet` If all went well, you should not see any
    errors printed to the screen.

    Alternatively, you can manually download one of the packages at
    [PyPi](https://pypi.python.org/pypi/couchbase).

 1. Verify that your Python SDK is available and working by entering the following
    command:

    `shell> python -c 'import couchbase'` If this does not print any errors or
    exceptions, your Python SDK is properly installed!

<a id="_hello_couchbase"></a>

## Hello Couchbase

To follow the tradition of programming tutorials, we’ll start with "Hello
Couchbase." This example works with the "beer-sample" bucket that is provided
with the default install.

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
# with Unicode format values, we make the format string unicode as well.


print unicode("{name}, ABV: {abv}").format(name=doc['name'], abv=doc['abv'])

doc['comment'] = "Random beer from Norway"

try:
    result = c.replace("aass_brewery-juleol", doc)
    print result

except CouchbaseError as e:
    print "Couldn't replace key"
    raise
```



The following points explain each step in the example:

 * *Connecting*

   The `Couchbase.connect` class method constructs a new
   `couchbase.connection.Connection` object. This object represents a connection to
   a single bucket within the cluster. Arguments passed to `connect` are passed to
   the constructor (see API documentation on the `Connection` object for more
   details and options).

   A bucket represents a logical namespace for a key. All keys must be unique
   within a single bucket, but multiple buckets can have keys with the same names
   and they will not conflict. A new connection object must be created for each
   bucket that you want to interact with in your application. This example creates
   one connection to the `beer-sample` bucket.

   The constructor is passed the bucket name, which is `beer-sample`, and a node on
   the cluster to connect to. You can pass any node that is a member of the
   cluster. This example uses the local cluster instance.

 * *Retrieving Data*

   The `get` method retrieves the value for the key requested. If the key exists, a
   `Result` object that contains the value of the key as well as additional
   metadata is returned. To get the actual value of the object, you can access the
   `Result` object’s `value` property.

   If the key does not exist on the server, an exception of type `CouchbaseError`
   is thrown. This exception object can be caught and examined or printed to see
   more details about why the operation failed. See the API documentation for more
   details.

   We treat the `value` as a `dict` object. As a documented oriented database,
   values stored to the server are considered to be JSON by default, and when
   retrieved from the server are interpreted to be JSON (and unserialized into a
   Python `dict` ). It is possible to use other formats than the default JSON,
   however. The `set` methods accept a `format` keyword argument that indicates the
   conversion type to be used. The default is `couchbase.FMT_JSON`, but you can
   also use `couchbase.FMT_BYTES`, `couchbase.FMT_UTF8`, or `couchbase.FMT_PICKLE`
   instead. If none of these are sufficient, you can write your own custom
   `Transcoder` object to handle conversion on your own.

 * *Storing Data*

   To store documents in the server, you can use one of the `set` family of
   methods. Here we use `replace`, which enforces the constraint that a previous
   value of the document must already exist. This can be thought of as an *update*
   operation in terms of *CRUD* (create, read, update, delete).

   The storage methods also return a `Result` object that contains metadata about
   the value stored.

Now we’re ready to run our first Couchbase Program:

The first line outputs the *name* field of the document, and the second line
outputs the `Result` object of the replace operation.

<a id="_working_with_documents"></a>

## Working With Documents

A document in Couchbase server consists of a *key*, *value*, and *metadata*.

 * *Key*

   A key is a unique identifier for your data. Each document must have a unique
   key. The key can be any valid Unicode string.

 * *Value*

   The value is your own application data that exists under the key. The format of
   the value can be anything. By default, only JSON-serializable objects are
   supported — Python `str`, `unicode`, `dict`, `list`, `tuple`, `int`, `long`,
   `float`, `bool`, and `None` types — in short, anything that the standard
   `json.dumps` accepts. The reason JSON is the default format is for the ability
   to later query the database based on value contents, as will be explained later.

   You can also store arbitrary Python objects using the `FMT_PICKLE` value for the
   `format` option.

 * *Metadata*

   The metadata contains information concerning the format of the value that is,
   whether it’s JSON, Pickle, or something else. It also contains revision
   information such as the *CAS*, which we’ll read about later.

You can *store* documents by providing the unique *key* under which the document
will be stored, and the *value* which contains the actual document. You can
*retrieve* documents either by directly specifying the unique *key* under which
the document was stored or by querying *views* that retrieve documents based on
specific *criteria*.

<a id="_storing_documents"></a>

### Storing Documents

This section provides a bit more insight on how to store documents. This is a
prerequisite to demonstrate how to retrieve documents because there must be
something to retrieve.

There are additional storage methods beyond those described here, which are
covered in the Advanced section, see [Advanced Usage](#_advanced_usage). These
include manipulating numeric counters, setting expiration times for documents,
and appending/prepending to existing values.

The `Connection` object provides the following store operations, which conform
to the *CRUD* model:

 * `set(key, value)`

   Stores the document `value` under the `key`. If the key did not previously
   exist, it is created. If the key already exists, its existing value is
   overwritten with the new contents of `value`.

 * `add(key, value)`

   Stores the document `value` under the `key`, but only if `key` does *not already
   exist*. If `key` already exists, an exception is thrown.

 * `replace(key, value)`

   `Replace` is the inverse of `add`. It sets the contents of `key` to `value`, but
   only if the *key already exists*. If the key does not already exist, an
   exception is thrown.

 * `delete(key)`

   Deletes the `key` from the bucket. Future attempts to access this key via `get`
   raise an exception until something is stored again for this key using one of the
   `set` methods.

### CRUD Example

The following code demonstrates the store operations.


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

Output:

`Setting key demo_key with value demo_value... OperationResult<RC=0x0,
Key=demo_key, CAS=0x3222e0f096e80000>  Getting value for key demo_key...
ValueResult<RC=0x0, Key=demo_key, Value=u'demo_value', CAS=0x3222e0f096e80000,
Flags=0x0>  Creating new key demo_key with value 'new_value' This will fail as
'demo_key' already exists <Key=u'demo_key', RC=0xC[Key exists (with a different
CAS value)], Operational Error, Results=1, C Source=(src/multiresult.c,147)>
Replacing existing key demo_key with new value... result  Getting new value for
key demo_key... ValueResult<RC=0x0, Key=demo_key, Value=u'new value',
CAS=0xbff8f2f096e80000, Flags=0x0>  Deleting key demo_key...
OperationResult<RC=0x0, Key=demo_key, CAS=0xc0f8f2f096e80000>  Getting value for
key demo_key. This will fail as it has been deleted <Key=u'demo_key', RC=0xD[No
such key], Operational Error, Results=1, C Source=(src/multiresult.c,147)> 
Creating new key demo_key with value 'added_value'... OperationResult<RC=0x0,
Key=demo_key, CAS=0x366a05f196e80000> Getting the new value...
ValueResult<RC=0x0, Key=demo_key, Value=u'added_value', CAS=0x366a05f196e80000,
Flags=0x0>`<a id="_getting_documents_by_key"></a>

### Getting Documents By Key

Couchbase provides two ways to fetch your documents: you can retrieve a document
by its *key*, or you can retrieve a set of documents that match some constraint
by using Views. Because views are more complex, we’ll first demonstrate getting
documents by their keys.

To get a single document, simply supply the key as the first argument to the
`get` method. It returns a `Result` object on success that can then be used to
extract the value.

### Getting A Single Document


```
client.store("my list", [])
result = client.get("my list")
doc = result.value
```



To get multiple documents, you can use the more efficient `get_multi` method.
You pass it an iterable sequence of keys, and it returns a `MultiResult` object
with the keys passed to `get_multi` as keys, and the values being a `Result`
object for the result of each key. `MultiResult` is a subclass of `dict`.

### Getting Multiple Documents


```
client.set_multi({
    'sheep_counting' : ['first sheep', 'second sheep'],
    'famous_sheep' : {'sherry lewis' : 'Lamb Chop'}
})

keys = ('sheep_counting', 'famous_sheep')
results = client.get_multi(keys)
for key, result in results.items():
    doc = result.value
```



### Error Handling

If a document does not exist, a `couchbase.exceptions.NotFoundError` (which is a
subclass of `couchbase.exceptions.CouchbaseError` ) is thrown.

You can change this behavior by using the `quiet` keyword parameter and setting
it to true (to suppress exceptions for a specific `get` call) or by setting the
`Connection.quiet` property on the `Connection` object (which suppresses
exceptions on `get` for subsequent calls).

When using `quiet`, you can still determine if a key was retrieved successfully
by examining the `success` property of the value object.

### Passing quiet to get


```
result = client.get("non-exist-key", quiet=True)
if result.success:
    print "Got document OK"
else:
    print ("Couldn't retrieve document. "
           "Result was received with code"), result.rc
```



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

When using `get_multi` with the quiet option enabled, you can immediately
determine whether all the keys were fetched successfully by examining the
`all_ok` property of the returned `MultiResult` object.


```
results = client.get_multi(("i exist", "but i don't"), quiet=True)
if not results.all_ok:
    print "Couldn't get all keys"
```

<a id="_getting_documents_by_querying_views"></a>

### Getting Documents by Querying Views

In addition to fetching documents by keys, you can also employ *Views* to
retrieve information using secondary indexes. This guide gets you started on how
to use them from the Python SDK. If you want to learn more about views, see the
[chapter in the Couchbase Server 2.0
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

First, create your view definition using by the web UI (though you may also do
this directly from the Python SDK, as will be shown later).

You can then query the view results by calling the `query` method on the
`Connection` object. Simply pass it the design and view name.


```
view_results = client.query("beer", "brewery_beers")
for result in view_results:
    print "Mapped key: %r" % (result.key,)
    print "Emitted value: %r" % (result.value,)
    print "Document ID: %s" % (result.docid,)
```

The `query` method returns a `couchbase.views.iterator.View` object, which is an
iterator. You can simply iterate over it to retrieve the results for the query.
Each object yielded is a `ViewRow`, which is a simple object containing the key,
value, document ID, and optionally the document itself for each of the results
returned by the view.

In addition to the design and view name, the `query` method accepts additional
keyword arguments that control the behavior of the results returned. You can
thus use it as follows:


```
results = client.query("beer", "brewery_beers", opt1=value1, opt2=value2, ...)
for result in results:
    # do something with result..
```

Here are some of the available parameters for the `query` method. A full listing
can be found in the API documentation.

 * `include_docs`

   This boolean parameter indicates whether the corresponding document should be
   retrieved for each row fetched. If this is true, the `doc` property of the
   `ViewRow` object yielded by the iterator returned by `query` contains a `Result`
   object that contains the document for the key.

 * `reduce`

   This boolean parameter indicates whether the server should also pass the results
   to the view’s `reduce` function. An exception is raised if the view does not
   have a `reduce` method defined.

 * `limit`

   This numeric parameter indicates the maximum amount of results to fetch from the
   query. This parameter is handy if your query can produce a lot of results.

 * `descending`

   This boolean parameter indicates that the results should be returned in reverse
   order.

 * `stale`

   This boolean parameter controls the tradeoff between performance and freshness
   of data.

 * `debug`

   This boolean parameter fetches low-level debugging information from the view
   engine.

 * `streaming`

   This boolean parameter indicates whether the view results should be decoded in a
   *streaming* manner. When enabled, the iterator internally fetches chunks of the
   response as required.

   As this is less efficient than fetching all results at once, it is disabled by
   default, but can be very useful if you have a large dataset because it prevents
   the entire view from being buffered in memory.


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
any valid object that is accepted by the standard `json.dumps` library function
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

`{u'and this is a list': [u'with', u'some', u'elements'], u'and this is a
tuple': [u'with', u'more', u'elements'], u'blobs': u'\x00', u'integers': 42,
u'or a None': None, u'strings': u'hello', u'this is a': u'dictionary',
u'unicode': u'\u05e9\u05dc\u05d5\u05dd!', u'you can also use floats': 3.14}
שלום!` To view the document that you just created, go to `localhost:8091` in
your browser, type in your administrative credentials, go over to the *Data
Buckets* pane, click on the *Documents* button for the `default` bucket, and
type in the ID for the document (in this case, it’s `a_key` )). The document can
now be indexed and queried against using views.



<a id="_other_formats"></a>

### Other Formats

While JSON is the default format, you might want to use other formats. For
example, if you want to store complex custom Python objects and classes and
don’t require that they be indexed with views, you can use the `pickle`
serialization format. It allows you to store types that are not accepted by
JSON:


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

`<object object at 0x7fa7d0ad80e0> set([1, 2, 3])` You can also store arbitrary
strings of bytes by using `FMT_BYTES`.

In Python 2.6 and above `bytes` and `str` are the same type; however in Python
3, a `str` is a string with an encoding (i.e. Python 2’s `unicode` ) while
`bytes` is a sequence of bytes which must be explicitly converted in order to be
used with text operations.


```
import pprint

from couchbase import Couchbase, FMT_BYTES

c = Couchbase.connect(bucket='default')
c.set("blob", b"\x01\x02\x03\x04", format=FMT_BYTES)
pprint.pprint(c.get("blob").value)
```

Outputs

`b'\x01\x02\x03\x04'` Alternatively, you can use `FMT_UTF8` to store a `unicode`
object represented as *UTF-8*.

While JSON is also capable of storing strings and Unicode, the JSON
specification mandates that all strings begin and end with a quote ( `"` ). This
uses additional space and costs extra processing power to decode and encode your
JSON string. Therefore,you can save on performance by using `FMT_UTF8` for
simple strings.

It is possible to encode your data by using encodings other than *UTF-8*.
However, because the view engine operates using *UTF-8*, we selected this as the
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
