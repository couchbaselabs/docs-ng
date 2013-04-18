# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-java-retrieve-get"></a>

## Synchronous get Methods

The synchronous `get()` methods allow for direct access to a given key/value
pair.

<a id="table-couchbase-sdk_java_get"></a>

**API Call**     | `client.get(key)`                     
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Get one or more key values            
**Returns**      | `Object` ( Binary object )            
**Arguments**    |                                       
**String key**   | Document ID used to identify the value

The `get()` method obtains an object stored in Couchbase using the default
transcoder for serialization of the object.

For example:


```
Object myObject = client.get("someKey");
```

Transcoding of the object assumes the default transcoder was used when the value
was stored. The returned object can be of any type.

If the request key does no existing in the database then the returned value is
null.

<a id="table-couchbase-sdk_java_get-transcoder"></a>

**API Call**                 | `client.get(key, transcoder)`                 
-----------------------------|-----------------------------------------------
**Asynchronous**             | no                                            
**Description**              | Get one or more key values                    
**Returns**                  | `T` ( Transcoded object )                     
**Arguments**                |                                               
**String key**               | Document ID used to identify the value        
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value

The second form of the `get()` retrieves a value from Couchbase using a custom
transcoder.

For example to obtain an integer value using the IntegerTranscoder:


```
Transcoder<Integer> tc = new IntegerTranscoder();
Integer ic = client.get("someKey", tc);
```

<a id="couchbase-sdk-java-retrieve-get-async"></a>

## Asynchronous get Methods

The asynchronous `asyncGet()` methods allow to retrieve a given value for a key
without waiting actively for a response.

<a id="table-couchbase-sdk_java_asyncget"></a>

**API Call**       | `client.asyncGet(key)`                                    
-------------------|-----------------------------------------------------------
**Asynchronous**   | yes                                                       
**Description**    | Get one or more key values                                
**Returns**        | `Future<Object>` ( Asynchronous request value, as Object )
**Arguments**      |                                                           
**String key**     | Document ID used to identify the value                    
**Exceptions**     |                                                           
`TimeoutException` | Value could not be retrieved                              

The first form of the `asyncGet()` method obtains a value for a given key
returning a Future object so that the value can be later retrieved. For example,
to get a key with a stored String value:


```
GetFuture<Object> getOp =
    client.asyncGet("samplekey");

String username;

try {
    username = (String) getOp.get(5, TimeUnit.SECONDS);
} catch(Exception e) {
    getOp.cancel(false);
}
```

<a id="table-couchbase-sdk_java_asyncget-transcoder"></a>

**API Call**                 | `client.asyncGet(key, transcoder)`                              
-----------------------------|-----------------------------------------------------------------
**Asynchronous**             | yes                                                             
**Description**              | Get one or more key values                                      
**Returns**                  | `Future<T>` ( Asynchronous request value, as Transcoded Object )
**Arguments**                |                                                                 
**String key**               | Document ID used to identify the value                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                  

The second form is identical to the first, but includes the ability to use a
custom transcoder on the stored value.

<a id="couchbase-sdk-java-retrieve-gat"></a>

## Get-and-Touch Methods

The Get-and-Touch (GAT) methods obtain a value for a given key and update the
expiry time for the key. This can be useful for session values and other
information where you want to set an expiry time, but don't want the value to
expire while the value is still in use.

<a id="table-couchbase-sdk_java_gat"></a>

**API Call**           | `client.getAndTouch(key, expiry)`                                                                                           
-----------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**       | no                                                                                                                          
**Description**        | Get a value and update the expiration time for a given key                                                                  
**Introduced Version** | 1.0                                                                                                                         
**Returns**            | `CASValue` ( Check and set object )                                                                                         
**Arguments**          |                                                                                                                             
**String key**         | Document ID used to identify the value                                                                                      
**int expiry**         | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The first form of the `getAndTouch()` obtains a given value and updates the
expiry time. For example, to get session data and renew the expiry time to five
minutes:


```
session = client.getAndTouch("sessionid",300);
```

<a id="table-couchbase-sdk_java_gat-transcoder"></a>

**API Call**                 | `client.getAndTouch(key, expiry, transcoder)`                                                                               
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | no                                                                                                                          
**Description**              | Get a value and update the expiration time for a given key                                                                  
**Introduced Version**       | 1.0                                                                                                                         
**Returns**                  | `CASValue` ( Check and set object )                                                                                         
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form supports the use of a custom transcoder for the stored value
information.

<a id="table-couchbase-sdk_java_asyncgat"></a>

**API Call**           | `client.asyncGetAndTouch(key, expiry)`                                                                                      
-----------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**       | yes                                                                                                                         
**Description**        | Get a value and update the expiration time for a given key                                                                  
**Introduced Version** | 1.0                                                                                                                         
**Returns**            | `Future<CASValue<Object>>` ( Asynchronous request value, as CASValue, as Object )                                           
**Arguments**          |                                                                                                                             
**String key**         | Document ID used to identify the value                                                                                      
**int expiry**         | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The asynchronous methods obtain the value and update the expiry time without
requiring you to actively wait for the response. The returned value is a CAS
object with the embedded value object.


```
Future<CASValue<Object>> future = client.asyncGetAndTouch("sessionid", 300);

CASValue casv;

try {
    casv = future.get(5, TimeUnit.SECONDS);
} catch(Exception e) {
    future.cancel(false);
}
```

<a id="table-couchbase-sdk_java_asyncgat-transcoder"></a>

**API Call**                 | `client.asyncGetAndTouch(key, expiry, transcoder)`                                                                          
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                                                         
**Description**              | Get a value and update the expiration time for a given key                                                                  
**Introduced Version**       | 1.0                                                                                                                         
**Returns**                  | `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as Transcoded object )                                      
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form of the asynchronous method supports the use of a custom
transcoder for the stored object.

<a id="couchbase-sdk-java-retrieve-gets"></a>

## CAS get Methods

The `gets()` methods obtain a CAS value for a given key. The CAS value is used
in combination with the corresponding Check-and-Set methods when updating a
value. For example, you can use the CAS value with the `append()` operation to
update a value only if the CAS value you supply matches. For more information
see [Append
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-update-append) and
[Check-and-Set
Methods](couchbase-sdk-java-ready.html#couchbase-sdk-java-update-cas).

<a id="table-couchbase-sdk_java_gets"></a>

**API Call**     | `client.gets(key)`                    
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Get single key value with CAS value   
**Returns**      | `CASValue` ( Check and set object )   
**Arguments**    |                                       
**String key**   | Document ID used to identify the value

The `gets()` method obtains a `CASValue` for a given key. The CASValue holds the
CAS to be used when performing a Check-And-Set operation, and the corresponding
value for the given key.

For example, to obtain the CAS and value for the key `someKey` :


```
CASValue status = client.gets("someKey");
System.out.printf("CAS is %s\n",status.getCas());
System.out.printf("Result was %s\n",status.getValue());
```

The CAS value can be used in a CAS call such as `append()` :


```
client.append(status.getCas(),"someKey", "appendedstring");
```

<a id="table-couchbase-sdk_java_gets-transcoder"></a>

**API Call**                 | `client.gets(key, transcoder)`                
-----------------------------|-----------------------------------------------
**Asynchronous**             | no                                            
**Description**              | Get single key value with CAS value           
**Returns**                  | `CASValue` ( Check and set object )           
**Arguments**                |                                               
**String key**               | Document ID used to identify the value        
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value

The second form of the `gets()` method supports the use of a custom transcoder.

<a id="table-couchbase-sdk_java_asyncgets"></a>

**API Call**     | `client.asyncGets(key)`                                                          
-----------------|----------------------------------------------------------------------------------
**Asynchronous** | yes                                                                              
**Description**  | Get single key value with CAS value                                              
**Returns**      | `Future<CASValue<Object>>` ( Asynchronous request value, as CASValue, as Object )
**Arguments**    |                                                                                  
**String key**   | Document ID used to identify the value                                           

The `asyncGets()` method obtains the `CASValue` object for a stored value
against the specified key, without requiring an explicit wait for the returned
value.

For example:


```
Future<CASValue<Object>> future = client.asyncGets("someKey");

System.out.printf("CAS is %s\n",future.get(5,TimeUnit.SECONDS).getCas());
```

Note that you have to extract the CASValue from the Future response, and then
the CAS value from the corresponding object. This is performed here in a single
statement.

<a id="table-couchbase-sdk_java_asyncgets-transcoder"></a>

**API Call**                 | `client.asyncGets(key, transcoder)`                                                   
-----------------------------|---------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                   
**Description**              | Get single key value with CAS value                                                   
**Returns**                  | `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as Transcoded object )
**Arguments**                |                                                                                       
**String key**               | Document ID used to identify the value                                                
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                        

The final form of the `asyncGets()` method supports the use of a custom
transcoder.

<a id="couchbase-sdk-java-retrieve-bulk"></a>

## Bulk get Methods

The bulk `getBulk()` methods allow you to get one or more items from the
database in a single request. Using the bulk methods is more efficient than
multiple single requests as the operation can be conducted in a single network
call.

<a id="table-couchbase-sdk_java_get-bulk"></a>

**API Call**                         | `client.getBulk(keycollection)`                
-------------------------------------|------------------------------------------------
**Asynchronous**                     | no                                             
**Description**                      | Get one or more key values                     
**Returns**                          | `Map<String,Object>` ( Map of Strings/Objects )
**Arguments**                        |                                                
**Collection<String> keycollection** | One or more keys used to reference a value     

The first format accepts a `String`  `Collection` as the request argument which
is used to specify the list of keys that you want to retrieve. The return type
is `Map` between the keys and object values.

For example:


```
Map<String,Object> keyvalues = client.getBulk(keylist);

System.out.printf("A is %s\n",keyvalues.get("keyA"));
System.out.printf("B is %s\n",keyvalues.get("keyB"));
System.out.printf("C is %s\n",keyvalues.get("keyC"));
```

The returned map will only contain entries for keys that exist from the original
request. For example, if you request the values for three keys, but only one
exists, the resultant map will contain only that one key/value pair.

<a id="table-couchbase-sdk_java_get-bulk-transcoder"></a>

**API Call**                         | `client.getBulk(keycollection, transcoder)`          
-------------------------------------|------------------------------------------------------
**Asynchronous**                     | no                                                   
**Description**                      | Get one or more key values                           
**Returns**                          | `Map<String,T>` ( Map of Strings/Transcoded objects )
**Arguments**                        |                                                      
**Collection<String> keycollection** | One or more keys used to reference a value           
**Transcoder<T> transcoder**         | Transcoder class to be used to serialize value       

The second form of the `getBulk()` method supports the same `Collection`
argument, but also supports the use of a custom transcoder on the returned
values.

The specified transcoder will be used for every value requested from the
database.

<a id="table-couchbase-sdk_java_get-bulk-multikeys"></a>

**API Call**       | `client.getBulk(keyn)`                         
-------------------|------------------------------------------------
**Asynchronous**   | no                                             
**Description**    | Get one or more key values                     
**Returns**        | `Map<String,Object>` ( Map of Strings/Objects )
**Arguments**      |                                                
**String... keyn** | One or more keys used to reference a value     

The third form of the `getBulk()` method supports a variable list of arguments
with each interpreted as the key to be retrieved from the database.

For example, the equivalent of the `Collection` method operation using this
method would be:


```
Map<String,Object> keyvalues = client.getBulk("keyA","keyB","keyC");

System.out.printf("A is %s\n",keyvalues.get("keyA"));
System.out.printf("B is %s\n",keyvalues.get("keyB"));
System.out.printf("C is %s\n",keyvalues.get("keyC"));
```

The return `Map` will only contain entries for keys that exist. Non-existent
keys will be silently ignored.

<a id="table-couchbase-sdk_java_get-bulk-multikeys-transcoder"></a>

**API Call**                 | `client.getBulk(transcoder, keyn)`                   
-----------------------------|------------------------------------------------------
**Asynchronous**             | no                                                   
**Description**              | Get one or more key values                           
**Returns**                  | `Map<String,T>` ( Map of Strings/Transcoded objects )
**Arguments**                |                                                      
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value       
**String... keyn**           | One or more keys used to reference a value           

The fourth form of the `getBulk()` method uses the variable list of arguments
but supports a custom transcoder.

Note that unlike other formats of the methods used for supporting custom
transcoders, the transcoder specification is at the start of the argument list,
not the end.

<a id="table-couchbase-sdk_java_asyncget-bulk"></a>

**API Call**                         | `client.asyncGetBulk(keycollection)`                       
-------------------------------------|------------------------------------------------------------
**Asynchronous**                     | yes                                                        
**Description**                      | Get one or more key values                                 
**Returns**                          | `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )
**Arguments**                        |                                                            
**Collection<String> keycollection** | One or more keys used to reference a value                 

The asynchronous `getBulk()` method supports a `Collection` of keys to be
retrieved, returning a BulkFuture object (part of the `spymemcached` package)
with the returned map of key/value information. As with other asynchronous
methods, the benefit is that you do not need to actively wait for the response.

The `BulkFuture` object operates slightly different in context to the standard
`Future` object. Whereas the `Future` object gets a returned single value, the
`BulkFuture` object will return an object containing as many keys as have been
returned. For very large queries requesting large numbers of keys this means
that multiple requests may be required to obtain every key from the original
list.

For example, the code below will obtain as many keys as possible from the
supplied `Collection`.


```
BulkFuture<Map<String,Object>> keyvalues = client.asyncGetBulk(keylist);

Map<String,Object> keymap = keyvalues.getSome(5,TimeUnit.SECONDS);

System.out.printf("A is %s\n",keymap.get("keyA"));
System.out.printf("B is %s\n",keymap.get("keyB"));
System.out.printf("C is %s\n",keymap.get("keyC"));
```

<a id="table-couchbase-sdk_java_asyncget-bulk-transcoder"></a>

**API Call**                         | `client.asyncGetBulk(keycollection, transcoder)`                 
-------------------------------------|------------------------------------------------------------------
**Asynchronous**                     | yes                                                              
**Description**                      | Get one or more key values                                       
**Returns**                          | `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )
**Arguments**                        |                                                                  
**Collection<String> keycollection** | One or more keys used to reference a value                       
**Transcoder<T> transcoder**         | Transcoder class to be used to serialize value                   

The second form of the asynchronous `getBulk()` method supports the custom
transcoder for the returned values.

<a id="table-couchbase-sdk_java_asyncget-bulk-multikeys"></a>

**API Call**       | `client.asyncGetBulk(keyn)`                                
-------------------|------------------------------------------------------------
**Asynchronous**   | yes                                                        
**Description**    | Get one or more key values                                 
**Returns**        | `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )
**Arguments**      |                                                            
**String... keyn** | One or more keys used to reference a value                 

[The third form is identical to the multi-argument key request method
(seecollection based
`asyncBulkGet()`](couchbase-sdk-java-ready.html#table-couchbase-sdk_java_get-bulk-multikeys)
), except that the operation occurs asynchronously.

<a id="table-couchbase-sdk_java_asyncget-bulk-multikeys-transcoder"></a>

**API Call**                 | `client.asyncGetBulk(transcoder, keyn)`                          
-----------------------------|------------------------------------------------------------------
**Asynchronous**             | yes                                                              
**Description**              | Get one or more key values                                       
**Returns**                  | `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )
**Arguments**                |                                                                  
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                   
**String... keyn**           | One or more keys used to reference a value                       

The final form of the `asyncGetBulk()` method supports a custom transcoder with
the variable list of keys supplied as arguments.

<a id="couchbase-sdk-java-retrieve-get-and-lock"></a>

## Get and Lock

<a id="table-couchbase-sdk_java_asyncgetl-transcoder"></a>

**API Call**                 | `client.asyncGetLock(key [, getl-expiry ], transcoder)`                               
-----------------------------|---------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                   
**Description**              | Get the value for a key, lock the key from changes                                    
**Returns**                  | `Future<CASValue<T>>` ( Asynchronous request value, as CASValue as Transcoded object )
**Arguments**                |                                                                                       
**String key**               | Document ID used to identify the value                                                
**int getl-expiry**          | Expiry time for lock                                                                  
                             | **Default**                                                                           
                             | **Maximum**                                                                           
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                        

<a id="table-couchbase-sdk_java_asyncgetl"></a>

**API Call**        | `client.asyncGetLock(key [, getl-expiry ])`                                      
--------------------|----------------------------------------------------------------------------------
**Asynchronous**    | yes                                                                              
**Description**     | Get the value for a key, lock the key from changes                               
**Returns**         | `Future<CASValue<Object>>` ( Asynchronous request value, as CASValue, as Object )
**Arguments**       |                                                                                  
**String key**      | Document ID used to identify the value                                           
**int getl-expiry** | Expiry time for lock                                                             
                    | **Default**                                                                      
                    | **Maximum**                                                                      

<a id="table-couchbase-sdk_java_get-and-lock-transcoder"></a>

**API Call**                 | `client.getAndLock(key [, getl-expiry ], transcoder)`            
-----------------------------|------------------------------------------------------------------
**Asynchronous**             | no                                                               
**Description**              | Get the value for a key, lock the key from changes               
**Returns**                  | `CASValue<T>` ( CASValue as Transcoded object )                  
**Arguments**                |                                                                  
**String key**               | Document ID used to identify the value                           
**int getl-expiry**          | Expiry time for lock                                             
                             | **Default**                                                      
                             | **Maximum**                                                      
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                   
**Exceptions**               |                                                                  
`OperationTimeoutException`  | Exception timeout occured while waiting for value.               
`RuntimeException`           | Exception object specifying interruption while waiting for value.

The simplest form of the method is without the transcoder as below.

<a id="table-couchbase-sdk_java_get-and-lock"></a>

**API Call**                | `client.getAndLock(key [, getl-expiry ])`                        
----------------------------|------------------------------------------------------------------
**Asynchronous**            | yes                                                              
**Description**             | Get the value for a key, lock the key from changes               
**Returns**                 | `CASValue<Object>` ( CASValue as Object )                        
**Arguments**               |                                                                  
**String key**              | Document ID used to identify the value                           
**int getl-expiry**         | Expiry time for lock                                             
                            | **Default**                                                      
                            | **Maximum**                                                      
**Exceptions**              |                                                                  
`OperationTimeoutException` | Exception timeout occured while waiting for value.               
`RuntimeException`          | Exception object specifying interruption while waiting for value.


```
CASValue<Object> casv = client.getAndLock("keyA", 3);
```

Will lock keyA for 3 seconds or until an Unlock is issued.

<a id="couchbase-sdk-java-retrieve-unlock"></a>

## Unlock

<a id="table-couchbase-sdk_java_unlock"></a>

**API Call**                | `client.unlock(key, casunique)`                                                                          
----------------------------|----------------------------------------------------------------------------------------------------------
**Asynchronous**            | no                                                                                                       
**Description**             | Unlock a previously locked key by providing the corresponding CAS value that was returned during the lock
**Returns**                 | `Boolean` ( Boolean (true/false) )                                                                       
**Arguments**               |                                                                                                          
**String key**              | Document ID used to identify the value                                                                   
**long casunique**          | Unique value used to verify a key/value combination                                                      
**Exceptions**              |                                                                                                          
`InterruptedException`      | Interrupted Exception while waiting for value.                                                           
`OperationTimeoutException` | Exception timeout occured while waiting for value.                                                       
`RuntimeException`          | Exception object specifying interruption while waiting for value.                                        


```
CASValue<Object> casv = client.getAndLock("keyA", 3);
//Use CAS Value to Unlock
client.unlock("getunltest", casv.getCas());
```

<a id="api-reference-update"></a>
