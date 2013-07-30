# Store Operations

The Couchbase Java Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="couchbase-sdk-java-set-add"></a>

## Add Operations

The `add()` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_java_add"></a>

**API Call**     | `client.add(key, expiry, value)`                                                                                            
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                         
**Description**  | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**      | `Future<Boolean>` ( Asynchronous request value, as Boolean )                                                                
**Arguments**    |                                                                                                                             
**String key**   | Document ID used to identify the value                                                                                      
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value** | Value to be stored                                                                                                          

The `add()` method adds a value to the database using the specified key.


```
client.add("someKey", 0, someObject);
```

Unlike [Set Operations](#couchbase-sdk-java-set-set) the operation can fail (and
return false) if the specified key already exist.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will have set the key:


```
OperationFuture<Boolean> addOp = client.add("someKey",0,"astring");
System.out.printf("Result was %b",addOp.get());
addOp =  client.add("someKey",0,"anotherstring");
System.out.printf("Result was %b",addOp.get());
```

<a id="table-couchbase-sdk_java_add-transcoder"></a>

**API Call**                 | `client.add(key, expiry, value, transcoder)`                                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                                                         
**Description**              | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**                  | `Future<Boolean>` ( Asynchronous request value, as Boolean )                                                                
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This method is identical to the `add()` method, but supports the use of a custom
transcoder for serialization of the object value. For more information on
transcoding, see [Object Serialization
(Transcoding)](#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-set"></a>

## Set Operations

The set operations store a value into Couchbase or Memcached using the specified
key and value. The value is stored against the specified key, even if the key
already exists and has data. This operation overwrites the existing with the new
data.

<a id="table-couchbase-sdk_java_set"></a>

**API Call**     | `client.set(key, expiry, value)`                                                                                                           
-----------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                                        
**Description**  | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**      | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )                                                                      
**Arguments**    |                                                                                                                                            
**String key**   | Document ID used to identify the value                                                                                                     
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).               
**Object value** | Value to be stored                                                                                                                         

The first form of the `set()` method stores the key, sets the expiry (use 0 for
no expiry), and the corresponding object value using the built in transcoder for
serialization.

The simplest form of the command is:


```
client.set("someKey", 3600, someObject);
```

The `Boolean` return value will be true if the value was stored. For example:


```
OperationFuture<Boolean> setOp = membase.set("someKey",0,"astring");
System.out.printf("Result was %b",setOp.get());
```

<a id="table-couchbase-sdk_java_set-transcoder"></a>

**API Call**                 | `client.set(key, expiry, value, transcoder)`                                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                                                         
**Description**              | Store a value using the specified key and a custom transcoder.                                                              
**Returns**                  | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )                                                       
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This method is identical to the `set()` method, but supports the use of a custom
transcoder for serialization of the object value. For more information on
transcoding, see [Object Serialization
(Transcoding)](#couchbase-sdk-java-summary-transcoding).

<a id="api-reference-retrieve"></a>
