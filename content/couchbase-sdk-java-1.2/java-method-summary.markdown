# Java Method Summary

The `couchbase-client` and `spymemcached` libraries support the full suite of
API calls to Couchbase. A summary of the supported methods are listed in
**Couldn't resolve xref tag: table-couchbase-sdk-java-summary**.

<a id="couchbase-sdk-java-summary-synchronous"></a>

## Synchronous Method Calls

The Java Client Libraries support the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the `get()` is a synchronous operation:


```
Object myObject = client.get("someKey");
```

In the example code above, the client `get()` call will wait until a response
has been received from the appropriately configured Couchbase servers before
returning the required value or an exception.

A list of the synchronous methods are shown in
[](couchbase-sdk-java-ready.html#table-couchbase-sdk-java-summary-sync).

<a id="table-couchbase-sdk-java-summary-sync"></a>

Method                                                                                                                                                    | Title                                                                                                  
----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------
[`client.append(casunique, key, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_append)                                                   | Append a value to an existing key                                                                      
[`client.append(casunique, key, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_append-transcoder)                            | Append a value to an existing key                                                                      
[`client.cas(key, casunique, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_cas)                                                         | Compare and set                                                                                        
[`client.cas(key, casunique, expiry, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_cas-expiry-transcoder)                   | Compare and set with a custom transcoder and expiry                                                    
[`client.cas(key, casunique, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_cas-transcoder)                                  | Compare and set with a custom transcoder                                                               
[`client.decr(key, offset)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_decr)                                                                 | Decrement the value of an existing numeric key                                                         
[`client.decr(key, offset, default)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_decr-default)                                                | Decrement the value of a key, setting the initial value if the key didn't already exist                
[`client.decr(key, offset, default, expiry)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_decr-default-expiry)                                 | Decrement the value of a key, setting the initial value if the key didn't already exist, with an expiry
[`client.getAndTouch(key, expiry)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_gat)                                                           | Get a value and update the expiration time for a given key                                             
[`client.getAndTouch(key, expiry, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_gat-transcoder)                                    | Get a value and update the expiration time for a given key using a custom transcoder                   
[`client.get(key)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get)                                                                           | Get a single key                                                                                       
[`client.getAndLock(key [, getl-expiry ], transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-and-lock-transcoder)                   | Get and lock                                                                                           
[`client.getBulk(keycollection)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-bulk)                                                        | Get multiple keys                                                                                      
[`client.getBulk(keyn)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-bulk-multikeys)                                                       | Get multiple keys                                                                                      
[`client.getBulk(transcoder, keyn)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-bulk-multikeys-transcoder)                                | Get multiple keys using a custom transcoder                                                            
[`client.getBulk(keycollection, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-bulk-transcoder)                                 | Get multiple keys using a custom transcoder                                                            
[`client.get(key, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-transcoder)                                                    | Get a single key using a custom transcoder                                                             
[`client.gets(key)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_gets)                                                                         | Get single key value with CAS value                                                                    
[`client.gets(key, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_gets-transcoder)                                                  | Get single key value with CAS value using custom transcoder                                            
[`client.getStats()`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_getstats)                                                                    | Get the statistics from all connections                                                                
[`client.getStats(statname)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_getstats-name)                                                       | Get the statistics from all connections                                                                
[`client.getView(ddocname, viewname)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_getview)                                                    | Create a view object                                                                                   
[`client.incr(key, offset)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_incr)                                                                 | Increment the value of an existing numeric key                                                         
[`client.incr(key, offset, default)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_incr-default)                                                | Increment the value of an existing numeric key                                                         
[`client.incr(key, offset, default, expiry)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_incr-default-expiry)                                 | Increment the value of an existing numeric key                                                         
[`client.new CouchbaseClient([ url ] [, urls ] [, username ] [, password ])`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_new_couchbaseclient) | Create connection to Couchbase Server                                                                  
[`client.query(view, query)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_query)                                                               | Query a view                                                                                           
[`Query.new()`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_query-new)                                                                         | Create a query object                                                                                  
[`client.unlock(key, casunique)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_unlock)                                                          | Unlock                                                                                                 

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

A list of the asynchronous methods are shown in
[](couchbase-sdk-java-ready.html#table-couchbase-sdk-java-summary-async).

<a id="table-couchbase-sdk-java-summary-async"></a>

Method                                                                                                                                            | Title                                                                                                                                         
--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------
[`client.add(key, expiry, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_add)                                                    | Add a value with the specified key that does not already exist                                                                                
`client.add(key, expiry, value, persistto)`                                                                                                       | Add a value using the specified key and observe it being persisted on master and more node(s).                                                
`client.add(key, expiry, value, persistto, replicateto)`                                                                                          | Add a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).    
`client.add(key, expiry, value, replicateto)`                                                                                                     | Add a value using the specified key and observe it being replicated to one or more node(s).                                                   
[`client.add(key, expiry, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_add-transcoder)                             | Add a value that does not already exist using custom transcoder                                                                               
[`client.asyncCAS(key, casunique, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asynccas)                                       | Asynchronously compare and set a value                                                                                                        
[`client.asyncCAS(key, casunique, expiry, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asynccas-expiry-transcoder) | Asynchronously compare and set a value with custom transcoder and expiry                                                                      
[`client.asyncCAS(key, casunique, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asynccas-transcoder)                | Asynchronously compare and set a value with custom transcoder                                                                                 
[`client.asyncDecr(key, offset)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncdecr)                                               | Asynchronously decrement the value of an existing key                                                                                         
[`client.asyncGetAndTouch(key, expiry)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgat)                                         | Asynchronously get a value and update the expiration time for a given key                                                                     
[`client.asyncGetAndTouch(key, expiry, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgat-transcoder)                  | Asynchronously get a value and update the expiration time for a given key using a custom transcoder                                           
[`client.asyncGet(key)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget)                                                         | Asynchronously get a single key                                                                                                               
[`client.asyncGetBulk(keycollection)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget-bulk)                                      | Asynchronously get multiple keys                                                                                                              
[`client.asyncGetBulk(keyn)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget-bulk-multikeys)                                     | Asynchronously get multiple keys                                                                                                              
[`client.asyncGetBulk(transcoder, keyn)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget-bulk-multikeys-transcoder)              | Asynchronously get multiple keys using a custom transcoder                                                                                    
[`client.asyncGetBulk(keycollection, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget-bulk-transcoder)               | Asynchronously get multiple keys using a custom transcoder                                                                                    
[`client.asyncGet(key, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncget-transcoder)                                  | Asynchronously get a single key using a custom transcoder                                                                                     
[`client.asyncGetLock(key [, getl-expiry ])`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgetl)                                   | Asynchronously get a lock.                                                                                                                    
[`client.asyncGetLock(key [, getl-expiry ], transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgetl-transcoder)            | Asynchronously get a lock with transcoder.                                                                                                    
[`client.asyncGets(key)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgets)                                                       | Asynchronously get single key value with CAS value                                                                                            
[`client.asyncGets(key, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncgets-transcoder)                                | Asynchronously get single key value with CAS value using custom transcoder                                                                    
[`client.asyncIncr(key, offset)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_asyncincr)                                               | Asynchronously increment the value of an existing key                                                                                         
[`client.delete(key)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_delete)                                                             | Delete the specified key                                                                                                                      
[`client.getAndLock(key [, getl-expiry ])`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-and-lock)                                  | Get and lock Asynchronously                                                                                                                   
[`client.prepend(casunique, key, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_prepend)                                         | Prepend a value to an existing key using the default transcoder                                                                               
[`client.prepend(casunique, key, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_prepend-transcoder)                  | Prepend a value to an existing key using a custom transcoder                                                                                  
[`client.replace(key, expiry, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_replace)                                            | Update an existing key with a new value                                                                                                       
`client.replace(key, expiry, value, persistto)`                                                                                                   | Replace a value using the specified key and observe it being persisted on master and more node(s).                                            
`client.replace(key, expiry, value, persistto, replicateto)`                                                                                      | Replace a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).
`client.replace(key, expiry, value, replicateto)`                                                                                                 | Replace a value using the specified key and observe it being replicated to one or more node(s).                                               
[`client.replace(key, expiry, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_replace-transcoder)                     | Update an existing key with a new value using a custom transcoder                                                                             
[`client.set(key, expiry, value)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_set)                                                    | Store a value using the specified key                                                                                                         
[`client.set(key, expiry, value, persistto)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_set-persist)                                 | Store a value using the specified key and observe it being persisted on master and more node(s).                                              
[`client.set(key, expiry, value, persistto, replicateto)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_set-persist-replicate)          | Store a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).  
[`client.set(key, expiry, value, replicateto)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_set-replicate)                             | Store a value using the specified key and observe it being replicated to one or more node(s).                                                 
[`client.set(key, expiry, value, transcoder)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_set-transcoder)                             | Store a value using the specified key and a custom transcoder.                                                                                
[`client.touch(key, expiry)`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_touch)                                                       | Update the expiry time of an item                                                                                                             

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

You can also use a custom transcoder for the serialization of objects. This can
be used to serialize objects in a format that is compatible with other languages
or environments.

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
