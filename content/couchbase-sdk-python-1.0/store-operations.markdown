# Store Operations

The Couchbase Python Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

**Unhandled thing here**
<a id="couchbase-sdk-python-set-add"></a>

## Add Operations

The `add()` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_python_add"></a>

**API Call**     | `object.add(key, expiry, flags, value)`                                                                                     
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                          
**Description**  | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**      | `object` ( Binary object )                                                                                                  
**Arguments**    |                                                                                                                             
**key**          | Document ID used to identify the value                                                                                      
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**flags**        | Flags for storage options. Flags are ignored by the server byt preserved for use by the client.                             
**object value** | Value to be stored                                                                                                          

The `add()` method adds a value to the database using the specified key.


```
couchbase.add("someKey", 0, 0, someObject)
```

Unlike [Set
Operations](couchbase-sdk-python-ready.html#couchbase-sdk-python-set-set) the
operation can fail if the specified key already exists.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will have set the key:


```
couchbase.set("someKey",0,0,"astring")
couchbase.add("someKey",0,0,"astring")
```

<a id="couchbase-sdk-python-set-set"></a>

## Set Operations

The set operations store a value into Couchbase using the specified key and
value. The value is stored against the specified key, even if the key already
exists and has data. This operation overwrites the existing with the new data.

<a id="table-couchbase-sdk_python_set"></a>

**API Call**       | `object.set(key, expiry, flags, value [, vbucket ])`                                                                                       
-------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**   | no                                                                                                                                         
**Description**    | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**        | `object` ( Binary object )                                                                                                                 
**Arguments**      |                                                                                                                                            
**key**            | Document ID used to identify the value                                                                                                     
**expiry**         | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).               
**flags**          | Flags for storage options. Flags are ignored by the server byt preserved for use by the client.                                            
**object value**   | Value to be stored                                                                                                                         
**String vbucket** | Name of the vBucket to be used for storage.                                                                                                

The first form of the `set()` method stores the key and sets the expiry (use 0
for no expiry).

The simplest form of the command is:


```
couchbase.set("someKey",0,0,someObject)
```

<a id="couchbase-sdk-python-set-replace"></a>

## Replace Operations

The `replace()` methods update an existing key/value pair in the database. If
the specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_python_replace"></a>

**API Call**     | `object.replace(key, expiry, flags, value)`                                                                                 
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                          
**Description**  | Update an existing key with a new value                                                                                     
**Returns**      | `object` ( Binary object )                                                                                                  
**Arguments**    |                                                                                                                             
**key**          | Document ID used to identify the value                                                                                      
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**flags**        | Flags for storage options. Flags are ignored by the server byt preserved for use by the client.                             
**object value** | Value to be stored                                                                                                          

The first form of the `replace()` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


```
couchbase.replace("samplekey",0,0,"updatedvalue");
```

<a id="couchbase-sdk-python-retrieve-metasrc"></a>
