# Store Operations

The Couchbase Java Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

**Unhandled thing here**
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

Unlike [Set
Operations](couchbase-sdk-java-ready.html#couchbase-sdk-java-set-set) the
operation can fail (and return false) if the specified key already exists.

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
(Transcoding)](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-set"></a>

## Set Operations

The `set()` operations store a value into Couchbase or Memcached using the
specified key and value. The value is stored against the specified key, even if
the key already exists and has data. This operation overwrites the existing with
the new data. The store operation in this case is asynchronous.

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

The `Boolean` return value from the asynchronous operation return value will be
true if the value was stored. For example:


```
OperationFuture<Boolean> setOp = client.set("someKey",0,"astring");
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

The second form of the `set()` method supports the use of a custom transcoder
for serialization of the object value. For more information on transcoding, see
[Object Serialization
(Transcoding)](couchbase-sdk-java-ready.html#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-durability"></a>

## Store Operations with Durability Requirements

<a id="table-couchbase-sdk_java_set-persist"></a>

**API Call**       | `client.set(key, expiry, value, persistto)`                                                                                 
-------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**   | yes                                                                                                                         
**Description**    | Store a value using the specified key and observe it being persisted on master and more node(s).                            
**Returns**        | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )                                                       
**Arguments**      |                                                                                                                             
**String key**     | Document ID used to identify the value                                                                                      
**int expiry**     | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**   | Value to be stored                                                                                                          
**enum persistto** | Specify the number of nodes on which the document must be persisted to before returning.                                    

<a id="table-couchbase-sdk_java_set-replicate"></a>

**API Call**         | `client.set(key, expiry, value, replicateto)`                                                                               
---------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**     | yes                                                                                                                         
**Description**      | Store a value using the specified key and observe it being replicated to one or more node(s).                               
**Returns**          | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )                                                       
**Arguments**        |                                                                                                                             
**String key**       | Document ID used to identify the value                                                                                      
**int expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**     | Value to be stored                                                                                                          
**enum replicateto** | Specify the number of nodes on which the document must be replicated to before returning                                    

<a id="table-couchbase-sdk_java_set-persist-replicate"></a>

**API Call**         | `client.set(key, expiry, value, persistto, replicateto)`                                                                                    
---------------------|---------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**     | yes                                                                                                                                         
**Description**      | Store a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).
**Returns**          | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )                                                                       
**Arguments**        |                                                                                                                                             
**String key**       | Document ID used to identify the value                                                                                                      
**int expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                
**Object value**     | Value to be stored                                                                                                                          
**enum persistto**   | Specify the number of nodes on which the document must be persisted to before returning.                                                    
**enum replicateto** | Specify the number of nodes on which the document must be replicated to before returning                                                    

This method is identical to the `set()` method, but supports the ability to
observe the persistence on the master and replicas and the propagation to the
replicas. Using these methods above, it's possible to set the persistence
requirements for the data on the nodes.

The persistence requirements can be specified in terms of how the data should be
persisted on the master and the replicas using `PeristTo` and how the data
should be propagated to the replicas using `ReplicateTo` respectively.

The client library will poll the server until the persistence requirements are
met. The method will return FALSE if the requirments are impossible to meet
based on the configuration (inadequate number of replicas) or even after a set
amount of retries the persistence requirments could not be met.

The program snippet below illustrates how to specify a requirement that the data
should be persisted on 4 nodes (master and three replicas).


```
// Perist to all four nodes including master
OperationFuture<Boolean> setOp =
   c.set("key", 0, "value", PersistTo.FOUR);
System.out.printf("Result was %b", setOp.get());
```

The peristence requirements can be specified for both the master and replicas.
In the case above, it's required that the key and value is persisted on all the
4 nodes (including replicas).

In the following, the requirement is specified as requiring persistence to the
master and propagation of the data to the three replicas. This requirment is
weaker than requring the data to be persisted on all four nodes including the
three replicas.


```
// Perist to master and propagate the data to three replicas
OperationFuture<Boolean> setOp =
   c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
System.out.printf("Result was %b", setOp.get());
```

Similar requirements can used with the *add()* and *replace()* mutation
operations.

<a id="api-reference-retrieve"></a>
