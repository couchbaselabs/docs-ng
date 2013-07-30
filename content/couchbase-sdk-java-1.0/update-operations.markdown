# Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

<a id="couchbase-sdk-java-update-append"></a>

## Append Methods

The `append()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `append()` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding an `Array` of integers into the database, and then
using `append()` to add another integer will result in the key referring to a
serialized version of the array, immediately followed by a serialized version of
the integer. It will not contain an updated array with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

<a id="table-couchbase-sdk_java_append"></a>

**API Call**       | `client.append(casunique, key, value)`             
-------------------|----------------------------------------------------
**Asynchronous**   | no                                                 
**Description**    | Append a value to an existing key                  
**Returns**        | `Object` ( Binary object )                         
**Arguments**      |                                                    
**long casunique** | Unique value used to verify a key/value combination
**String key**     | Document ID used to identify the value             
**Object value**   | Value to be stored                                 

The `append()` appends information to the end of an existing key/value pair. The
`append()` function requires a CAS value. For more information on CAS values,
see [CAS get Methods](#couchbase-sdk-java-retrieve-gets).

For example, to append a string to an existing key:


```
CASValue<Object> casv = client.gets("samplekey");
client.append(casv.getCas(),"samplekey", "appendedstring");
```

You can check if the append operation succeeded by using the return
`OperationFuture` value:


```
OperationFuture<Boolean> appendOp =
    client.append(casv.getCas(),"notsamplekey", "appendedstring");

try {
    if (appendOp.get().booleanValue()) {
        System.out.printf("Append succeeded\n");
    }
    else {
        System.out.printf("Append failed\n");
    }
}
catch (Exception e) {
...
}
```

<a id="table-couchbase-sdk_java_append-transcoder"></a>

**API Call**                 | `client.append(casunique, key, value, transcoder)` 
-----------------------------|----------------------------------------------------
**Asynchronous**             | no                                                 
**Description**              | Append a value to an existing key                  
**Returns**                  | `Object` ( Binary object )                         
**Arguments**                |                                                    
**long casunique**           | Unique value used to verify a key/value combination
**String key**               | Document ID used to identify the value             
**Object value**             | Value to be stored                                 
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value     

The second form of the `append()` method supports the use of custom transcoder.

<a id="couchbase-sdk-java-update-prepend"></a>

## Prepend Methods

The `prepend()` methods insert information before the existing data for a given
key. Note that as with the `append()` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend()`.

<a id="table-couchbase-sdk_java_prepend"></a>

**API Call**       | `client.prepend(casunique, key, value)`                     
-------------------|-------------------------------------------------------------
**Asynchronous**   | yes                                                         
**Description**    | Prepend a value to an existing key                          
**Returns**        | `Future<Boolean>` ( Asynchronous request value, as Boolean )
**Arguments**      |                                                             
**long casunique** | Unique value used to verify a key/value combination         
**String key**     | Document ID used to identify the value                      
**Object value**   | Value to be stored                                          

The `prepend()` inserts information before the existing data stored in the
key/value pair. The `prepend()` function requires a CAS value. For more
information on CAS values, see [CAS get
Methods](#couchbase-sdk-java-retrieve-gets).

For example, to prepend a string to an existing key:


```
CASValue<Object> casv = client.gets("samplekey");
client.prepend(casv.getCas(),"samplekey", "prependedstring");
```

You can check if the prepend operation succeeded by using the return
`OperationFuture` value:


```
OperationFuture<Boolean> prependOp =
    client.prepend(casv.getCas(),"notsamplekey", "prependedstring");

try {
    if (prependOp.get().booleanValue()) {
        System.out.printf("Prepend succeeded\n");
    }
    else {
        System.out.printf("Prepend failed\n");
    }
}
catch (Exception e) {
...
}
```

<a id="table-couchbase-sdk_java_prepend-transcoder"></a>

**API Call**                 | `client.prepend(casunique, key, value, transcoder)`         
-----------------------------|-------------------------------------------------------------
**Asynchronous**             | yes                                                         
**Description**              | Prepend a value to an existing key                          
**Returns**                  | `Future<Boolean>` ( Asynchronous request value, as Boolean )
**Arguments**                |                                                             
**long casunique**           | Unique value used to verify a key/value combination         
**String key**               | Document ID used to identify the value                      
**Object value**             | Value to be stored                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value              

The secondary form of the `prepend()` method supports the use of a custom
transcoder for updating the key/value pair.

<a id="couchbase-sdk-java-update-cas"></a>

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
Operations](#couchbase-sdk-java-set-set) method.

With all CAS operations, the `CASResponse` value returned indicates whether the
operation succeeded or not, and if not why. The `CASResponse` is an `Enum` with
three possible values:

 * `EXISTS`

   The item exists, but the CAS value on the database does not match the value
   supplied to the CAS operation.

 * `NOT_FOUND`

   The specified key does not exist in the database. An `add()` method should be
   used to add the key to the database.

 * `OK`

   The CAS operation was successful and the updated value is stored in Couchbase

<a id="table-couchbase-sdk_java_cas"></a>

**API Call**       | `client.cas(key, casunique, value)`                           
-------------------|---------------------------------------------------------------
**Asynchronous**   | no                                                            
**Description**    | Compare and set a value providing the supplied CAS key matches
**Returns**        | `CASResponse` ( Check and set object )                        
**Arguments**      |                                                               
**String key**     | Document ID used to identify the value                        
**long casunique** | Unique value used to verify a key/value combination           
**Object value**   | Value to be stored                                            

The first form of the `cas()` method allows for an item to be set in the
database only if the CAS value supplied matches that stored on the server.

For example:


```
CASResponse casr = client.cas("caskey", casvalue, "new string value");

if (casr.equals(CASResponse.OK)) {
    System.out.println("Value was updated");
}
else if (casr.equals(CASResponse.NOT_FOUND)) {
    System.out.println("Value is not found");
}
else if (casr.equals(CASResponse.EXISTS)) {
    System.out.println("Value exists, but CAS didn't match");
}
```

<a id="table-couchbase-sdk_java_cas-transcoder"></a>

**API Call**                 | `client.cas(key, casunique, value, transcoder)`               
-----------------------------|---------------------------------------------------------------
**Asynchronous**             | no                                                            
**Description**              | Compare and set a value providing the supplied CAS key matches
**Returns**                  | `CASResponse` ( Check and set object )                        
**Arguments**                |                                                               
**String key**               | Document ID used to identify the value                        
**long casunique**           | Unique value used to verify a key/value combination           
**Object value**             | Value to be stored                                            
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                

The second form of the method supports using a custom transcoder for storing a
value.

<a id="table-couchbase-sdk_java_cas-expiry-transcoder"></a>

**API Call**                 | `client.cas(key, casunique, expiry, value, transcoder)`                                                                     
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | no                                                                                                                          
**Description**              | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**                  | `CASResponse` ( Check and set object )                                                                                      
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**long casunique**           | Unique value used to verify a key/value combination                                                                         
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This form of the `cas()` method updates both the key value and the expiry time
for the value. For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

For example the following attempts to set the key `caskey` with an updated
value, setting the expiry times to 3600 seconds (one hour).


```
Transcoder<Integer> tc = new IntegerTranscoder();
CASResponse casr = client.cas("caskey", casvalue, 3600, 1200, tc);
```

<a id="table-couchbase-sdk_java_asynccas"></a>

**API Call**       | `client.asyncCAS(key, casunique, value)`                            
-------------------|---------------------------------------------------------------------
**Asynchronous**   | yes                                                                 
**Description**    | Compare and set a value providing the supplied CAS key matches      
**Returns**        | `Future<CASResponse>` ( Asynchronous request value, as CASResponse )
**Arguments**      |                                                                     
**String key**     | Document ID used to identify the value                              
**long casunique** | Unique value used to verify a key/value combination                 
**Object value**   | Value to be stored                                                  

Performs an asynchronous CAS operation on the given key/value. You can use this
method to set a value using CAS without waiting for the response. The following
example requests an update of a key, timing out after 5 seconds if the operation
was not successful.


```
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, "updatedvalue");

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

<a id="table-couchbase-sdk_java_asynccas-transcoder"></a>

**API Call**                 | `client.asyncCAS(key, casunique, value, transcoder)`                
-----------------------------|---------------------------------------------------------------------
**Asynchronous**             | yes                                                                 
**Description**              | Compare and set a value providing the supplied CAS key matches      
**Returns**                  | `Future<CASResponse>` ( Asynchronous request value, as CASResponse )
**Arguments**                |                                                                     
**String key**               | Document ID used to identify the value                              
**long casunique**           | Unique value used to verify a key/value combination                 
**Object value**             | Value to be stored                                                  
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                      

Performs an asynchronous CAS operation on the given key/value using a custom
transcoder. The example below shows the update of an existing value using a
custom Integer transcoder.


```
Transcoder<Integer> tc = new IntegerTranscoder();
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 1200, tc);

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

<a id="table-couchbase-sdk_java_asynccas-expiry-transcoder"></a>

**API Call**                 | `client.asyncCAS(key, casunique, expiry, value, transcoder)`                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                                                         
**Description**              | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**                  | `Future<CASResponse>` ( Asynchronous request value, as CASResponse )                                                        
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**long casunique**           | Unique value used to verify a key/value combination                                                                         
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The final form of the `asyncCAS()` method supports a custom transcoder and
setting the associated expiry value. For example, to update a value and set the
expiry to 60 seconds:


```
Transcoder<Integer> tc = new IntegerTranscoder();
Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 60, 1200, tc);

CASResponse casr;

try {
    casr = future.get(5, TimeUnit.SECONDS);
} catch(TimeoutException e) {
    future.cancel(false);
}
```

<a id="couchbase-sdk-java-update-delete"></a>

## Delete Methods

The `delete()` method deletes an item in the database with the specified key.
Delete operations are asynchronous only.

<a id="table-couchbase-sdk_java_delete"></a>

**API Call**     | `client.delete(key)`                                                 
-----------------|----------------------------------------------------------------------
**Asynchronous** | yes                                                                  
**Description**  | Delete a key/value                                                   
**Returns**      | `OperationFuture<Boolean>` ( Asynchronous request value, as Boolean )
**Arguments**    |                                                                      
**String key**   | Document ID used to identify the value                               

For example, to delete an item you might use code similar to the following:


```
OperationFuture<Boolean> delOp =
    client.delete("samplekey");

try {
    if (delOp.get().booleanValue()) {
        System.out.printf("Delete succeeded\n");
    }
    else {
        System.out.printf("Delete failed\n");
    }

}
catch (Exception e) {
    System.out.println("Failed to delete " + e);
}
```

<a id="couchbase-sdk-java-update-decr"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Java Client Library methods support the use of an explicit
offset value that will be used to reduce the stored value in the database.

<a id="table-couchbase-sdk_java_decr"></a>

**API Call**     | `client.decr(key, offset)`                                                                                                                                
-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                        
**Description**  | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**      | `long` ( Numeric value )                                                                                                                                  
**Arguments**    |                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                   

The first form of the `decr()` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


```
client.decr("dlcounter",5);
```

The return value is the updated value of the specified key.

<a id="table-couchbase-sdk_java_decr-default"></a>

**API Call**     | `client.decr(key, offset, default)`                                                                                                                       
-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                        
**Description**  | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**      | `long` ( Numeric value )                                                                                                                                  
**Arguments**    |                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                   
**int default**  | Default value to increment/decrement if key does not exist                                                                                                

The second form of the `decr()` method will decrement the given key by the
specified `offset` value if the key already exists, or set the key to the
specified `default` value if the key does not exist. This can be used in
situations where you are recording a counter value but do not know whether the
key exists at the point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


```
long newcount =
    client.decr("dlcount",1,1000);

System.out.printf("Updated counter is %d\n",newcount);
```

A subsequent identical call will return the value 999 as the key `dlcount`
already exists.

<a id="table-couchbase-sdk_java_decr-default-expiry"></a>

**API Call**     | `client.decr(key, offset, default, expiry)`                                                                                                               
-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                        
**Description**  | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**      | `long` ( Numeric value )                                                                                                                                  
**Arguments**    |                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                   
**int default**  | Default value to increment/decrement if key does not exist                                                                                                
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                              

The third form of the `decr()` method the decrement operation, with a default
value and with the addition of setting an expiry time on the stored value. For
example, to decrement a counter, using a default of 1000 if the value does not
exist, and an expiry of 1 hour (3600 seconds):


```
long newcount =
    client.decr("dlcount",1,1000,3600);
```

For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

<a id="table-couchbase-sdk_java_asyncdecr"></a>

**API Call**     | `client.asyncDecr(key, offset)`                                                                                                                           
-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                                                       
**Description**  | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**      | `long` ( Numeric value )                                                                                                                                  
**Arguments**    |                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                   

The asynchronous form of the `asyncGet()` method enables you to decrement a
value without waiting for a response. This can be useful in situations where you
do not need to know the updated value or merely want to perform a decrement and
continue processing.

For example, to asynchronously decrement a given key:


```
OperationFuture<Long> decrOp =
    client.asyncDecr("samplekey",1,1000,24000);
```

<a id="couchbase-sdk-java-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_java_incr"></a>

**API Call**     | `client.incr(key, offset)`                                                                                                                                                                                                                                                                                                                
-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                                                                                                                                                                                                        
**Description**  | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**      | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                  
**Arguments**    |                                                                                                                                                                                                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   

The first form of the `incr()` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


```
client.incr("dlcounter",5);
```

The return value is the updated value of the specified key.

<a id="table-couchbase-sdk_java_incr-default"></a>

**API Call**     | `client.incr(key, offset, default)`                                                                                                                                                                                                                                                                                                       
-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                                                                                                                                                                                                        
**Description**  | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**      | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                  
**Arguments**    |                                                                                                                                                                                                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**int default**  | Default value to increment/decrement if key does not exist                                                                                                                                                                                                                                                                                

The second form of the `incr()` method supports the use of a default value which
will be used to set the corresponding key if that value does already exist in
the database. If the key exists, the default value is ignored and the value is
incremented with the provided offset value. This can be used in situations where
you are recording a counter value but do not know whether the key exists at the
point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


```
long newcount =
    client.incr("dlcount",1,1000);

System.out.printf("Updated counter is %d\n",newcount);
```

A subsequent identical call will return the value 1001 as the key `dlcount`
already exists and the value (1000) is incremented by 1.

<a id="table-couchbase-sdk_java_incr-default-expiry"></a>

**API Call**     | `client.incr(key, offset, default, expiry)`                                                                                                                                                                                                                                                                                               
-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                                                                                                                                                                                                                                        
**Description**  | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**      | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                  
**Arguments**    |                                                                                                                                                                                                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**int default**  | Default value to increment/decrement if key does not exist                                                                                                                                                                                                                                                                                
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                              

The third format of the `incr()` method supports setting an expiry value on the
given key, in addition to a default value if key does not already exist.

For example, to increment a counter, using a default of 1000 if the value does
not exist, and an expiry of 1 hour (3600 seconds):


```
long newcount =
    client.incr("dlcount",1,1000,3600);
```

For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

<a id="table-couchbase-sdk_java_asyncincr"></a>

**API Call**     | `client.asyncIncr(key, offset)`                                                                                                                                                                                                                                                                                                           
-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                                                                                                                                                                                                                                       
**Description**  | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**      | `Future<Long>` ( Asynchronous request value, as Long )                                                                                                                                                                                                                                                                                    
**Arguments**    |                                                                                                                                                                                                                                                                                                                                           
**String key**   | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**int offset**   | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   

The `asyncIncr()` method supports an asynchronous increment on the value for a
corresponding key. Asynchronous increments are useful when you do not want to
immediately wait for the return value of the increment operation.


```
OperationFuture<Long> incrOp =
    client.asyncIncr("samplekey",1,1000,24000);
```

<a id="couchbase-sdk-java-update-replace"></a>

## Replace Methods

The `replace()` methods update an existing key/value pair in the database. If
the specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_java_replace"></a>

**API Call**     | `client.replace(key, expiry, value)`                                                                                        
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                         
**Description**  | Update an existing key with a new value                                                                                     
**Returns**      | `Future<Boolean>` ( Asynchronous request value, as Boolean )                                                                
**Arguments**    |                                                                                                                             
**String key**   | Document ID used to identify the value                                                                                      
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value** | Value to be stored                                                                                                          

The first form of the `replace()` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


```
OperationFuture<Boolean> replaceOp =
    client.replace("samplekey","updatedvalue",0);
```

The return value is a `OperationFuture` value with a `Boolean` base.

<a id="table-couchbase-sdk_java_replace-transcoder"></a>

**API Call**                 | `client.replace(key, expiry, value, transcoder)`                                                                            
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**             | yes                                                                                                                         
**Description**              | Update an existing key with a new value                                                                                     
**Returns**                  | `Future<Boolean>` ( Asynchronous request value, as Boolean )                                                                
**Arguments**                |                                                                                                                             
**String key**               | Document ID used to identify the value                                                                                      
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form of the `replace()` method is identical o the first, but also
supports using a custom Transcoder in place of the default transcoder.

<a id="couchbase-sdk-java-update-touch"></a>

## Touch Methods

The `touch()` methods allow you to update the expiration time on a given key.
This can be useful for situations where you want to prevent an item from
expiring without resetting the associated value. For example, for a session
database you might want to keep the session alive in the database each time the
user accesses a web page without explicitly updating the session value, keeping
the user's session active and available.

<a id="table-couchbase-sdk_java_touch"></a>

**API Call**     | `client.touch(key, expiry)`                                                                                                 
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                                                         
**Description**  | Update the expiry time of an item                                                                                           
**Returns**      | `Future<Boolean>` ( Asynchronous request value, as Boolean )                                                                
**Arguments**    |                                                                                                                             
**String key**   | Document ID used to identify the value                                                                                      
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The first form of the `touch()` provides a simple key/expiry call to update the
expiry time on a given key. For example, to update the expiry time on a session
for another 5 minutes:


```
OperationFuture<Boolean> touchOp =
    client.touch("sessionid",300);
```

<a id="api-reference-stat"></a>
