# Getting Started

**Unhandled:** `[:unknown-tag :simpara]`<a id="_download_and_installation"></a>

## Download and Installation

 1. **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
    :simpara]`

 1. **Unhandled:** `[:unknown-tag :simpara]`

 1. **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
    :screen]`

 1. **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
    :simpara]`  **Unhandled:** `[:unknown-tag :screen]`  **Unhandled:**
    `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 1. **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
    :screen]`

**Unhandled:** `[:unknown-tag :simpara]`<a id="_hello_couchbase"></a>

## Hello Couchbase

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



 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:literallayout]`  **Unhandled:** `[:unknown-tag :literallayout]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_working_with_documents"></a>

## Working With Documents

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`<a id="_storing_documents"></a>

### Storing Documents

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

### CRUD Example

**Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:screen]`<a id="_getting_documents_by_key"></a>

### Getting Documents By Key

### Getting A Single Document


```
client.store("my list", [])
result = client.get("my list")
doc = result.value
```



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



**Unhandled:** `[:unknown-tag :simpara]`
```
>>> CouchbaseError.rc_to_exctype(result.rc)
<class 'couchbase.exceptions.NotFoundError'>
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
results = client.get_multi(("i exist", "but i don't"), quiet=True)
if not results.all_ok:
    print "Couldn't get all keys"
```

<a id="_getting_documents_by_querying_views"></a>

### Getting Documents by Querying Views

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
view_results = client.query("beer", "brewery_beers")
for result in view_results:
    print "Mapped key: %r" % (result.key,)
    print "Emitted value: %r" % (result.value,)
    print "Document ID: %s" % (result.docid,)
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
results = client.query("beer", "brewery_beers", opt1=value1, opt2=value2, ...)
for result in results:
    # do something with result..
```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`<a id="_other_formats"></a>

### Other Formats

**Unhandled:** `[:unknown-tag :simpara]`
```
import pprint

from couchbase import Couchbase, FMT_PICKLE

c = Couchbase.connect(bucket='default')
c.set("a_python_object", object(), format=FMT_PICKLE)
c.set("a_python_set", set([1,2,3]), format=FMT_PICKLE)

pprint.pprint(c.get("a_python_object").value)
pprint.pprint(c.get("a_python_set").value)
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`
```
import pprint

from couchbase import Couchbase, FMT_BYTES

c = Couchbase.connect(bucket='default')
c.set("blob", b"\x01\x02\x03\x04", format=FMT_BYTES)
pprint.pprint(c.get("blob").value)
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
from couchbase import Couchbase, FMT_UTF8

c = Couchbase.connect(bucket='default')
c.set("EXCALIBUR", u"\u03EE", format=FMT_UTF8)
print c.get("EXCALIBUR")
```

### Setting The Default Format

**Unhandled:** `[:unknown-tag :simpara]`
```
c = Couchbase.connect(bucket='default', default_format=FMT_UTF8)
```

**Unhandled:** `[:unknown-tag :simpara]`
```
c.default_format = FMT_PICKLE
```

<a id="_tutorial"></a>
