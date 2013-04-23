# Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-python-update-append"></a>

## Append Methods

The `append()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `append()` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding `Dictionary` of integers into the database, and
then using `append()` to add another integer will result in the key referring to
a serialized version of the dictionary, immediately followed by a serialized
version of the integer. It will not contain an updated dictionary with the new
integer appended to it. De-serialization of objects that have had data appended
may result in data corruption.

<a id="table-couchbase-sdk_python_append"></a>

**API Call**      | `object.append(key, value [, casunique ])`         
------------------|----------------------------------------------------
**Asynchronous**  | no                                                 
**Description**   | Append a value to an existing key                  
**Returns**       | `object` ( Binary object )                         
**Arguments**     |                                                    
**key**           | Document ID used to identify the value             
**object value**  | Value to be stored                                 
**int casunique** | Unique value used to verify a key/value combination

The `append()` appends information to the end of an existing key/value pair. The
`append()` function requires a CAS value.

For example, to append a string to an existing key, first get the value for the
given key, then use the first element in the returned list as the CAS:


```
casv = couchbase.get("samplekey")
couchbase.append(casv[0],"samplekey", "appendedstring")
```

<a id="couchbase-sdk-python-update-prepend"></a>

## Prepend Methods

The `prepend()` methods insert information before the existing data for a given
key. Note that as with the `append()` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend()`.

<a id="table-couchbase-sdk_python_prepend"></a>

**API Call**      | `object.prepend(key, value [, casunique ])`        
------------------|----------------------------------------------------
**Asynchronous**  | no                                                 
**Description**   | Prepend a value to an existing key                 
**Returns**       | `object` ( Binary object )                         
**Arguments**     |                                                    
**key**           | Document ID used to identify the value             
**object value**  | Value to be stored                                 
**int casunique** | Unique value used to verify a key/value combination

The `prepend()` inserts information before the existing data stored in the
key/value pair. The `prepend()` function requires a CAS value.

For example, to prepend a string to an existing key:


```
casv = couchbase.get("samplekey")
couchbase.prepend(casv[0],"samplekey", "prependedstring")
```

<a id="couchbase-sdk-python-update-cas"></a>

## Check-and-Set Methods

The check-and-set methods provide a mechanism for updating information only if
the client knows the check (CAS) value. This can be used to prevent clients from
updating values in the database that may have changed since the client obtained
the value. Methods for storing and updating information support a CAS method
that allows you to ensure that the client is updating the version of the data
that the client retrieved.

The check value is in the form of a 64-bit integer which is updated every time
the value is modified, even if the update of the value does not modify the
binary data. Attempting to set or update a key/value pair where the CAS value
does not match the value stored on the server will fail.

The `cas()` methods are used to explicitly set the value only if the CAS
supplied by the client matches the CAS on the server, analogous to the [Set
Operations](couchbase-sdk-python-ready.html#couchbase-sdk-python-set-set)
method.

<a id="table-couchbase-sdk_python_cas"></a>

**API Call**        | `object.cas(key, expiry, flags, oldvalue, value)`                                                                           
--------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                                          
**Description**     | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**         | `object` ( Binary object )                                                                                                  
**Arguments**       |                                                                                                                             
**key**             | Document ID used to identify the value                                                                                      
**expiry**          | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**flags**           | Flags for storage options. Flags are ignored by the server byt preserved for use by the client.                             
**object oldvalue** | Old value to be compared                                                                                                    
**object value**    | Value to be stored                                                                                                          

The first form of the `cas()` method allows for an item to be set in the
database only if the CAS value supplied matches that stored on the server.

For example:


```
casr = couchbase.cas("caskey", casvalue, "new string value")
```

<a id="couchbase-sdk-python-update-delete"></a>

## Delete Methods

The `delete()` method deletes an item in the database with the specified key.
Delete operations are synchronous only.

<a id="table-couchbase-sdk_python_delete"></a>

**API Call**       | `object.delete(key [, casunique ] [, vbucket ])`   
-------------------|----------------------------------------------------
**Asynchronous**   | no                                                 
**Description**    | Delete a key/value                                 
**Returns**        | `object` ; supported values:                       
                   | `COUCHBASE_ETMPFAIL`                               
                   | `COUCHBASE_KEY_ENOENT`                             
                   | `COUCHBASE_NOT_MY_VBUCKET`                         
                   | `COUCHBASE_NOT_STORED`                             
                   | `docid`                                            
**Arguments**      |                                                    
**key**            | Document ID used to identify the value             
**int casunique**  | Unique value used to verify a key/value combination
**String vbucket** | Name of the vBucket to be used for storage.        

For example, to delete an item you might use code similar to the following:


```
couchbase.delete("samplekey");
```

<a id="couchbase-sdk-python-update-decrement"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Python Client Library methods support the use of an
explicit offset value that will be used to reduce the stored value in the
database.

<a id="table-couchbase-sdk_python_decr"></a>

**API Call**     | `object.decr(key [, offset ] [, defaultvalue ] [, expiry ])`                                                                                              
-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                        
**Description**  | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**      | `object` ( Binary object )                                                                                                                                
**Arguments**    |                                                                                                                                                           
**key**          | Document ID used to identify the value                                                                                                                    
**offset**       | Integer offset value to increment/decrement (default 1)                                                                                                   
**defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                              

The first form of the `decr()` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


```
couchbase.decr("dlcounter",5);
```

The return value is the updated value of the specified key.

<a id="couchbase-sdk-python-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_python_incr"></a>

**API Call**     | `object.incr(key [, offset ] [, defaultvalue ] [, expiry ])`                                                                                                                                                                                                                                                                              
-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                                                                                                                                                                                                        
**Description**  | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**      | `object` ( Binary object )                                                                                                                                                                                                                                                                                                                
**Arguments**    |                                                                                                                                                                                                                                                                                                                                           
**key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**offset**       | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                              

The first form of the `incr()` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


```
couchbase.incr("dlcounter",5);
```

The return value is the updated value of the specified key.

<a id="couchbase-sdk-python-update-touch"></a>

## Touch Methods

The `touch()` methods allow you to update the expiration time on a given key.
This can be useful for situations where you want to prevent an item from
expiring without resetting the associated value. For example, for a session
database you might want to keep the session alive in the database each time the
user accesses a web page without explicitly updating the session value, keeping
the user's session active and available.

<a id="table-couchbase-sdk_python_touch"></a>

**API Call**     | `object.touch(key, expiry)`                                                                                                 
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                          
**Description**  | Update the expiry time of an item                                                                                           
**Returns**      | `Boolean` ( Boolean (true/false) )                                                                                          
**Arguments**    |                                                                                                                             
**key**          | Document ID used to identify the value                                                                                      
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The first form of the `touch()` provides a simple key/expiry call to update the
expiry time on a given key. For example, to update the expiry time on a session
for another 5 minutes:


```
couchbase.touch("sessionid",300);
```

<a id="couchbase-sdk-python-stats-metasrc"></a>
