# Java Method Summary

The `couchbase-client` and `spymemcached` libraries support the full suite of
API calls to Couchbase. 

<a id="couchbase-sdk-java-summary-synchronous"></a>

## Synchronous Method Calls

The Java Client Libraries support the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the following fragment stores and retrieves a single key/value
pair:


```
client.set("someKey", 3600, someObject);

Object myObject = client.get("someKey");
```

In the example code above, the client `get()` call will wait until a response
has been received from the appropriately configured Couchbase servers before
returning the required value or an exception.

<a id="couchbase-sdk-java-summary-asynchronous"></a>

## Asynchronous Method Calls

In addition, the librares also support a range of asynchronous methods that can
be used to store, update and retrieve values without having to explicitly wait
for a response.

The asynchronous methods use a *Future* object or its appropriate implementation
which is returned by the initial method call for the operation. The
communication with the Couchbase server will be handled by the client libraries
in the background so that the main program loop can continue. You can recover
the status of the operation by using a method to check the status on the
returned Future object. For example, rather than synchronously getting a key, an
asynchronous call might look like this:


```
GetFuture getOp = client.asyncGet("someKey");
```

This will populate the Future object `GetFuture` with the response from the
server. The Future object class is defined
[here](http://download.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/Future.html?is-external=true).
The primary methods are:

 * `cancel()`

   Attempts to Cancel the operation if the operation has not already been
   completed.

 * `get()`

   Waits for the operation to complete. Gets the object returned by the operation
   as if the method was synchronous rather than asynchronous.

 * `get(timeout, TimeUnit)`

   Gets the object waiting for a maximum time specified by `timeout` and the
   corresponding `TimeUnit`.

 * `isDone()`

   The operation has been completed successfully.

For example, you can use the timeout method to obtain the value or cancel the
operation:


```
GetFuture getOp = client.asyncGet("someKey");

Object myObj;

try {
    myObj = getOp.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    getOp.cancel(false);
}
```

Alternatively, you can do a blocking wait for the response by using the `get()`
method:


```
Object myObj;

myObj = getOp.get();
```

<a id="couchbase-sdk-java-summary-transcoding"></a>

## Object Serialization (Transcoding)

All of the Java client library methods use the default Whalin transcoder that
provides compatilibility with memcached clients for the serialization of objects
from the object type into a byte array used for storage within Couchbase.

You can also use a custom transcoder the serialization of objects. This can be
to serialize objects in a format that is compatible with other languages or
environments.

You can customize the transcoder by implementing a new Transcoder interface and
then using this when storing and retrieving values. The Transcoder will be used
to encode and decode objects into binary strings. All of the methods that store,
retrieve or update information have a version that supports a custom transcoder.

<a id="couchbase-sdk-java-summary-expiry"></a>

## Expiry Values

All values in Couchbase and Memcached can be set with an expiry value. The
expiry value indicates when the item should be expired from the database and can
be set when an item is added or updated.

Within `spymemcached` the expiry value is expressed in the native form of an
integer as per the Memcached protocol specification. The integer value is
expressed as the number of seconds, but the interpretation of the value is
different based on the value itself:

 * Expiry is less than `30*24*60*60` (30 days)

   The value is interpreted as the number of seconds from the point of storage or
   update.

 * Expiry is greater than `30*24*60*60`

   The value is interpreted as the number of seconds from the epoch (January 1st,
   1970).

 * Expiry is 0

   This disables expiry for the item.

For example:


```
client.set("someKey", 3600, someObject);
```

The value will have an expiry time of 3600 seconds (one hour) from the time the
item was stored.

The statement:


```
client.set("someKey", 1307458800, someObject);
```

Will set the expiry time as June 7th 2011, 15:00 (UTC).

<a id="api-reference-connection"></a>
