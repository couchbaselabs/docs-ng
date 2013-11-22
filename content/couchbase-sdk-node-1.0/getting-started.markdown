# Introduction

This guide provides information for developers who want to use the Couchbase Node.js SDK to build applications that use Couchbase Server.

# Getting Started

The following sections demonstrate how to get started using Couchbase with the
Node.js SDK. We’ll first show how to install the SDK and then demonstrate how it
can be used to perform some simple operations.

<a id="download_and_installation"></a>

## Download and Installation

Install the following packages to get started using the Node.js SDK:

 1. [Download, install and start Couchbase
    server](http://www.couchbase.com/download). Come back here when you are done.

 1. [Download and install the C
    library](http://www.couchbase.com/develop/c/current).

 1. Install the Node.js SDK. The easiest way to do this is via the npm tool: `shell>
    npm install couchbase` If all went well, you should not see any errors printed
    to the screen.

<a id="hello_couchbase"></a>

## Hello Couchbase

To follow the tradition of programming tutorials, we’ll start with "Hello
Couchbase". This example works with the "beer-sample" bucket that is provided
with the default install.

### hello-couchbase.js


```
var couchbase = require("couchbase");

var bucket = new couchbase.Connection({
  'bucket':'beer-sample',
  'host':'127.0.0.1:8091'
}, function(err) {
  if (err) {
    // Failed to make a connection to the Couchbase cluster.
    throw err;
  }

  bucket.get('aass_brewery-juleol', function(err, result) {
    if (err) {
      // Failed to retrieve key
      throw err;
    }

    var doc = result.value;

    console.log(doc.name + ', ABV: ' + doc.abv);

    doc.comment = "Random beer from Norway";

    bucket.replace('aass_brewery-juleol', doc, function(err, result) {
      if (err) {
        // Failed to replace key
        throw err;
      }

      console.log(result);

      // Success!
      process.exit(0);
    });
  });
});
```



The following points explain each step in the example:

 * *Connecting*

   A Connection object represents a connection to a single bucket within the
   cluster.

   A bucket represents a logical namespace for a key. All keys must be unique
   within a single bucket, but multiple buckets can have keys with the same names
   and they will not conflict. A new connection object must be created for each
   bucket that you want to interact with in your application. This example creates
   one connection to the beer-sample bucket.

   The constructor is passed the bucket name, which is beer-sample, and a node on
   the cluster to connect to. You can pass any node that is a member of the
   cluster. This example uses the local cluster instance.

 * *Retrieving Data*

   The get method initiates an asynchronous request to retrieve the key requested.
   If the key exists, the callback will be invoked with a results object that
   contains the value of the key as well as any additional metadata returned from
   the cluster. To get the actual value of the object, you can access the result
   object’s value property.

   If the key does not exist on the server, the callback will be invoked with an
   unset value property on the result object (it will not set the callbacks error
   parameter).

 * *Storing Data*

   To store documents in the server, you can use one of the set family of methods.
   Here we use replace, which enforces the constraint that a previous value of the
   document must already exist. This can be thought of as an update operation in
   terms of CRUD (create, read, update, delete).

   The storage methods also return a result object that contains metadata about the
   value that was stored.

Now we’re ready to run our first Couchbase Program:

`shell> node hello-couchbase.js`<a id="working_with_documents"></a>

## Working with Documents

A document in Couchbase server consists of a key, value, and metadata.

 * *Key*

   A key is a unique identifier for your data. Each document must have a unique
   key. The key can be any valid string.

 * *Value*

   The value is your own application data that exists under the key. The format of
   the value can be anything, couchnode will automatically choose the best storage
   format.

 * *Metadata*

   The metadata contains information concerning the format of the value that is,
   whether it’s JSON, a raw type, or something else. It also contains revision
   information such as the CAS, which we’ll read about later.

You can store documents by providing the unique key under which the document
will be stored, and the value which contains the actual document. You can
retrieve documents either by directly specifying the unique key under which the
document was stored or by querying views that retrieve documents based on
specific criteria.

<a id="getting_a_document_by_key"></a>

### Getting a document by key

Couchbase provides two ways to fetch your documents: you can retrieve a document
by its key, or you can retrieve a set of documents that match some constraint by
using Views. Because views are more complex, we’ll first demonstrate getting
documents by their keys.

### Getting A Single Document

To get a single document, simply supply the key as the first argument to the get
method. It returns a result object on success that can then be used to extract
the value.
```
bucket.get(‘test1’, function(err, result) {
  console.log(result.value);
});
```



### Getting Multiple Documents

To get multiple documents, you can use the more efficient getMulti method. You
can pass it an array of keys and it will return an object containing keys that
match the keys you passed into getMulti and result objects similar to the get
call as values.
```
bucket.getMulti([‘test1’, ‘test2’], function(err, results) {
  for(key in results) {
    console.log(key + ‘: ‘ + results[key].value);
  }
});
```



### Error Handling

If the key does not exist on the server, the callback will be invoked with an
unset value property on the result objects (it will not set the callbacks error
parameter). In the case of a getMulti call, it is possible that some results
will be returned, while others will not. For every other kinds of error such as
temporaryError, it is possible that some result objects will have error set,
while others do not. If any of the results from a getMulti call failed, there
error parameter of the callback will be set to 1 to signify that at least one
operation failed to execute successfully.

<a id="storing_a_document"></a>

### Storing a Document

This section provides a bit more insight on how to store documents. This is a
prerequisite to demonstrate how to retrieve documents because there must be
something to retrieve.

There are additional storage methods beyond those described here, which are
covered in the Advanced section, see Chapter 4, Advanced Usage. These include
manipulating numeric counters, setting expiration times for documents, and
appending/prepending to existing values.

The Connection object provides the following store operations, which conform to
the CRUD model:

 * `set(key, value, options)`

   Stores the document value under the key. If the key did not previously exist, it
   is created. If the key already exists, its existing value is overwritten with
   the new contents of value.

 * `add(key, value, options)`

   Stores the document value under the key, but only if key does not already exist.
   If key already exists, an exception is thrown.

 * `replace(key, value, options)`

   Replace is the inverse of add. It sets the contents of key to value, but only if
   the key already exists. If the key does not already exist, an exception is
   thrown.

 * `remove(key, options)`

   Deletes the key from the bucket. Future attempts to access this key via get
   raise an exception until something is stored again for this key using one of the
   set methods.

The following code demonstrates the store operations.


```
var couchbase = require('couchbase');

var key = "demo_key";
var value = "demo_value";

// We use the 'default' bucket.
bucket = new couchbase.Connection({bucket: 'default', host:'localhost'}, function(err) {
  if (err) throw err;

  console.log('Setting key ' + key + ' with value ' + value);
  bucket.set(key, value, function(err, result) {
    if (err) throw err;
    console.log(result);

    console.log('Getting value for key ' + key);
    bucket.get(key, function(err, result) {
      if (err) throw err;
      console.log(result);

      console.log('Creating new key ' + key + ' with value "new_value"');
      console.log('This will fail as ' + key + ' already exists');
      bucket.add(key, 'new_value', function(err, result) {
        console.log(err);

        console.log('Replacing existing key ' + key + ' with new value');
        bucket.replace(key, 'new value', function(err, result) {
          if (err) throw err;
          console.log(result);

          console.log('Getting new value for key ' + key);
          bucket.get(key, function(err, result) {
            if (err) throw err;
            console.log(result);

            console.log('Deleting key ' + key);
            bucket.remove(key, function(err, result) {
              if (err) throw err;
              console.log(result);

              console.log('Getting value for key ' + key);
              console.log('This will fail as it has been deleted');
              bucket.get(key, function(err, result) {
                console.log(err);

                // Done
                process.exit(0);
              });
            });
          });
        });
      });
    });
  });
});
```

Output:

`Setting key demo_key with value demo_value { cas: { '0': 467599872, '1':
461666438 } } Getting value for key demo_key { cas: { '0': 467599872, '1':
461666438 }, flags: 4, value: 'demo_value' } Creating new key demo_key with
value "new_value" This will fail as demo_key already exists { [Error: Key exists
(with a different CAS value)] code: 12 } Replacing existing key demo_key with
new value { cas: { '0': 467599872, '1': 3664555910 } } Getting new value for key
demo_key { cas: { '0': 467599872, '1': 3664555910 }, flags: 4, value: 'new
value' } Deleting key demo_key { cas: { '0': 467599872, '1': 3681333126 } }
Getting value for key demo_key This will fail as it has been deleted { [Error:
No such key] code: 13 }`<a id="querying_a_view"></a>

### Querying a view

In addition to fetching documents by keys, you can also employ Views to retrieve
information using secondary indexes. This guide gets you started on how to use
them from the Node.js SDK. If you want to learn more about views, see the
chapter in the Couchbase Server 2.0 documentation.

First, create your view definition using by the web UI (though you may also do
this directly from the Node.js SDK, as will be shown later).

You can then query the view results by calling the query method on the
Connection object. Simply pass it the design and view name.

The view method returns a ViewQuery object which provides an interface for
accessing the data stored in a view. The view can be then queried via the
ViewQuery method through the use of the query or firstPage methods which return
a full list of results, or only the first page respectively. Both the view
method as well as the query methods accept additional optional options that
control the behavior of the results returned. You can thus use it as follows:


```
var viewQuery = bucket.view('beer', 'brewery_beers', {opt1: value1, opt2: value2});
viewQuery.query(function(err, results) {
  for(key in results) {
    // Do something with the results
  }
});
```

Or alternatively like this to retrieve only the first 30 results:


```
var viewQuery = bucket.view('beer', 'brewery_beers', {opt1: value1, opt2: value2});
viewQuery.firstPage({limit:30}, function(err, results) {
  for(key in results) {
    // Do something with the results
  }
});
```

Here are some of the available options for the query methods. A full listing can
be found in the API documentation.

 * `reduce`

   This boolean parameter indicates whether the server should also pass the results
   to the view’s reduce function. An error is triggered if the view does not have a
   reduce method defined.

 * `limit`

   This numeric parameter indicates the maximum amount of results to fetch from the
   query. This parameter is handy if your query can produce a lot of results.

 * `descending`

   This boolean parameter indicates that the results should be returned in reverse
   order.

 * `stale`

   This string parameter controls the tradeoff between performance and freshness
   of data.  Possible values include "false" (force update), "update_after" (force
   after view request) and "ok" (default: do not force any updates).

 * `debug`

   This boolean parameter fetches low-level debugging information from the view
   engine.

<a id="tutorial"></a>
