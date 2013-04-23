# Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-net-update-append"></a>

## Append Methods

The `Append()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `Append()` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use Append, the content of the serialized object will not be
extended. For example, adding an `List` of integers into the database, and then
using `Append()` to add another integer will result in the key referring to a
serialized version of the list, immediately followed by a serialized version of
the integer. It will not contain an updated list with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

<a id="table-couchbase-sdk_net_append"></a>

**API Call**     | `object.Append(key, value)`           
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Append a value to an existing key     
**Returns**      | `Object` ( Binary object )            
**Arguments**    |                                       
**string key**   | Document ID used to identify the value
**object value** | Value to be stored                    

The `Append()` method appends information to the end of an existing key/value
pair.

The sample below demonstrates how to create a csv string by appending new
values.


```
client.Store(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Append("beers", new ArraySegment<byte>(stringToBytes(",Three Philosophers")));
client.Append("beers", new ArraySegment<byte>(stringToBytes(",Witte")));
```

You can check if the Append operation succeeded by using the checking the return
value.


```
var result = client.Append("beers", new ArraySegment<byte>(stringToBytes(",Hennepin")));
if (result) {
    Console.WriteLine("Append succeeded");
} else {
    Console.WriteLine("Append failed");
}
```

<a id="table-couchbase-sdk_net_append-cas"></a>

**API Call**        | `object.Append(key, casunique, value)`             
--------------------|----------------------------------------------------
**Asynchronous**    | no                                                 
**Description**     | Append a value to an existing key                  
**Returns**         | `Object` ( Binary object )                         
**Arguments**       |                                                    
**string key**      | Document ID used to identify the value             
**ulong casunique** | Unique value used to verify a key/value combination
**object value**    | Value to be stored                                 

`Append()` may also be used with a CAS value. With this overload, the return
value is a `CasResult`, where success is determined by examining the CasResult's
Result property.


```
var casv = client.GetWithCas("beers");
var casResult = client.Append("beers", casv.Cas, new ArraySegment<byte>(stringToBytes(",Adoration")));

if (casResult.Result) {
    Console.WriteLine("Append succeeded");
} else {
    Console.WriteLine("Append failed");
}
```

<a id="table-couchbase-sdk_net_executeappend"></a>

**API Call**     | `object.ExecuteAppend(key, value)`                  
-----------------|-----------------------------------------------------
**Asynchronous** | no                                                  
**Description**  | Append a value to an existing key                   
**Returns**      | `IConcatOperationResult` ( Concat operation result )
**Arguments**    |                                                     
**string key**   | Document ID used to identify the value              
**object value** | Value to be stored                                  

The `ExecuteAppend()` method behaves similar to `Append()` but returns detailed
results via an instance of an `IConcatOperationResult` instead of a `Boolean`

The sample below demonstrates how to create a csv string by appending new
values.


```
var result = client.Store(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Append("beers", new ArraySegment<byte>(stringToBytes(",Three Philosophers")));
client.Append("beers", new ArraySegment<byte>(stringToBytes(",Witte")));

if (! result.Success) {
    logger.Error("Operation failed. Status code: " + result.StatusCode);
}
```

<a id="table-couchbase-sdk_net_executeappend-cas"></a>

**API Call**        | `object.ExecuteAppend(key, casunique, value)`       
--------------------|-----------------------------------------------------
**Asynchronous**    | no                                                  
**Description**     | Append a value to an existing key                   
**Returns**         | `IConcatOperationResult` ( Concat operation result )
**Arguments**       |                                                     
**string key**      | Document ID used to identify the value              
**ulong casunique** | Unique value used to verify a key/value combination 
**object value**    | Value to be stored                                  

As with `Append()`  `ExecuteAppend()` may also be used with a CAS value. With
this overload, the return value is a `IConcatOperationResult`.


```
var getResult = client.ExecuteGet("beers");
var concatResult = client.ExecuteAppend("beers", getResult.Cas, new ArraySegment<byte>(stringToBytes(",Adoration")));

if (concatResult.Success) {
    Console.WriteLine("Append succeeded");
} else {
    Console.WriteLine("Append failed");
}
```

<a id="couchbase-sdk-net-update-cas"></a>

## Cas Methods

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

<a id="table-couchbase-sdk_net_cas"></a>

**API Call**            | `object.Cas(storemode, key, value)`                           
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `CasResult<bool>` ( Cas result of bool )                      
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            

Store a value and get a `CasResult` with the Cas for that key.


```
var casResult = client.Cas(StoreMode.Set, "somekey", "somevalue");
logger.Debug("Cas value: " + casResult.Cas);
```

<a id="table-couchbase-sdk_net_cas-cas"></a>

**API Call**            | `object.Cas(storemode, key, value, casunique)`                
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `CasResult<bool>` ( Cas result of bool )                      
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            
**ulong casunique**     | Unique value used to verify a key/value combination           

`Cas()` may also be used with a CAS value. With this overload, the return value
is a `CasResult`, where success is determined by examining the CasResult's
Result property.


```
var casv = client.GetWithCas("somekey");
var casResult = client.Cas(StoreMode.Set, "somekey", "somevalue", casv.Cas);
if (casResult.Result) {
    logger.Debug("Cas result was successful");
}
```

<a id="table-couchbase-sdk_net_cas-validfor"></a>

**API Call**            | `object.Cas(storemode, key, value, validfor, casunique)`      
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `CasResult<bool>` ( Cas result of bool )                      
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            
**TimeSpan validfor**   | Expiry time (in seconds) for key                              
**ulong casunique**     | Unique value used to verify a key/value combination           

Perform a check and set operation, setting a `TimeStamp` expiration on the key.


```
var casv = client.GetWithCas("somekey");
var casResult = client.Cas(StoreMode.Set, "somekey", "somevalue", TimeSpan.FromMinutes(30), casv.Cas);
if (casResult.Result) {
    logger.Debug("Cas result was successful");
}
```

<a id="table-couchbase-sdk_net_cas-expiresat"></a>

**API Call**            | `object.Cas(storemode, key, value, expiresat, casunique)`     
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `CasResult<bool>` ( Cas result of bool )                      
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            
**DateTime expiresat**  | Explicit expiry time for key                                  
**ulong casunique**     | Unique value used to verify a key/value combination           

Perform a check and set operation, setting a `DateTime` expiration on the key.


```
var casv = client.GetWithCas("somekey");
var casResult = client.Cas(StoreMode.Set, "somekey", "somevalue", DateTime.Now.AddMinutes(30), casv.Cas);
if (casResult.Result) {
    logger.Debug("Cas result was successful");
}
```

<a id="table-couchbase-sdk_net_executecas"></a>

**API Call**            | `object.ExecuteCas(storemode, key, value)`                    
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `IStoreOperationResult` ( Store operation result )            
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            

Store a value and get an `IStoreOperationResult` return value.


```
var storeResult = client.ExecuteCas(StoreMode.Set, "somekey", "somevalue");
logger.Debug("Cas value: " + storeResult.Cas);
```

<a id="table-couchbase-sdk_net_executecas-cas"></a>

**API Call**            | `object.ExecuteCas(storemode, key, value, casunique)`         
------------------------|---------------------------------------------------------------
**Asynchronous**        | no                                                            
**Description**         | Compare and set a value providing the supplied CAS key matches
**Returns**             | `IStoreOperationResult` ( Store operation result )            
**Arguments**           |                                                               
**StoreMode storemode** | Storage mode for a given key/value pair                       
**string key**          | Document ID used to identify the value                        
**object value**        | Value to be stored                                            
**ulong casunique**     | Unique value used to verify a key/value combination           

`ExecuteCas()` works like `Cas()` and may also be used with a CAS value. With
this overload, the return value is an instance of an `IStoreOperationResult`.


```
var getResult = client.ExecutGet("somekey");
var storeResult = client.Cas(StoreMode.Set, "somekey", "somevalue", getResult.Cas);
if (storeResult.Result) {
    logger.Debug("Cas operation was successful");
}
```

<a id="table-couchbase-sdk_net_executecas-validfor"></a>

**API Call**            | `object.ExecuteCas(storemode, key, value, validfor, casunique)`
------------------------|----------------------------------------------------------------
**Asynchronous**        | no                                                             
**Description**         | Compare and set a value providing the supplied CAS key matches 
**Returns**             | `IStoreOperationResult` ( Store operation result )             
**Arguments**           |                                                                
**StoreMode storemode** | Storage mode for a given key/value pair                        
**string key**          | Document ID used to identify the value                         
**object value**        | Value to be stored                                             
**TimeSpan validfor**   | Expiry time (in seconds) for key                               
**ulong casunique**     | Unique value used to verify a key/value combination            

Perform a check and set operation, setting a `TimeStamp` expiration on the key.
Return an instance of an `IStoreOperationResult`.


```
var getResult = client.ExecutGet("somekey");
var storeResult = client.Cas(StoreMode.Set, "somekey", "somevalue", TimeSpan.FromMinutes(30), getResult.Cas);
if (storeResult.Result) {
    logger.Debug("Cas operation was successful");
}
```

<a id="table-couchbase-sdk_net_executecas-expiresat"></a>

**API Call**            | `object.ExecuteCas(storemode, key, value, expiresat, casunique)`
------------------------|-----------------------------------------------------------------
**Asynchronous**        | no                                                              
**Description**         | Compare and set a value providing the supplied CAS key matches  
**Returns**             | `IStoreOperationResult` ( Store operation result )              
**Arguments**           |                                                                 
**StoreMode storemode** | Storage mode for a given key/value pair                         
**string key**          | Document ID used to identify the value                          
**object value**        | Value to be stored                                              
**DateTime expiresat**  | Explicit expiry time for key                                    
**ulong casunique**     | Unique value used to verify a key/value combination             

Perform a check and set operation, setting a `DateTime` expiration on the key.
Return an instance of an `IStoreOperationResult`.


```
var getResult = client.ExecutGet("somekey");
var storeResult = client.Cas(StoreMode.Set, "somekey", "somevalue", DateTime.Now.AddMinutes(30), getResult.Cas);
if (storeResult.Result) {
    logger.Debug("Cas operation was successful");
}
```

<a id="couchbase-sdk-net-update-decrement"></a>

## Decrement Methods

The `Decrement()` methods reduce the value of a given key if the corresponding
value can be parsed to an integer value. These operations are provided at a
protocol level to eliminate the need to get, update, and reset a simple integer
value in the database. All the.NET Client Library methods support the use of an
explicit offset value that will be used to reduce the stored value in the
database.

<a id="table-couchbase-sdk_net_decrement"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset)`                                                                                                             
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
client.Decrement("inventory", 100, 1);
```

<a id="table-couchbase-sdk_net_decrement-validfor"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, validfor)`                                                                                                   
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                          

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds.


```
client.Decrement("inventory", 100, 1, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_decrement-expiresat"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, expiresat)`                                                                                                  
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                              

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes.


```
client.Decrement("inventory", 100, 1, DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_decrement-cas"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, casunique)`                                                                                                  
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
var casv = client.GetWithCas("inventory");
client.Decrement("inventory", 100, 1, cas.Cas);
```

<a id="table-couchbase-sdk_net_decrement-cas-validfor"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, validfor, casunique)`                                                                                        
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                          
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds.


```
var casv = client.GetWithCas("inventory");
client.Decrement("inventory", 100, 1, TimeSpan.FromSeconds(60), cas.Cas);
```

<a id="table-couchbase-sdk_net_decrement-cas-expiresat"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, expiresat, casunique)`                                                                                       
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                              
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes.


```
var casv = client.GetWithCas("inventory");
client.Decrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), cas.Cas);
```

<a id="table-couchbase-sdk_net_executedecrement"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset)`                                                                                                      
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't
exist. Returns an `IMutateOperationResult`.


```
var result = client.ExecuteDecrement("inventory", 100, 1);

if (result.Success) {
    logger.Debug("New value: " + result.Value);
}
```

<a id="table-couchbase-sdk_net_executedecrement-validfor"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset, validfor)`                                                                                            
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                          

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds. Return an instance of an
`IMutateOperationResult`.


```
var result = client.ExecuteDecrement("inventory", 100, 1, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_executedecrement-expiresat"></a>

**API Call**            | `object.Decrement(key, defaultvalue, offset, expiresat)`                                                                                                  
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                 
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                              

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes. Return an instance of an
`IMutateOperationResult`.


```
var result = client.Decrement("inventory", 100, 1, DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_executedecrement-cas"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset, casunique)`                                                                                           
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1 using check and set, defaulting to 100 if
the key doesn't exist. Return an instance of an `IMutateOperationResult`.


```
var getResult = client.ExecuteGet("inventory");
var mutateResult = client.ExecuteDecrement("inventory", 100, 1, getResult.Cas);
```

<a id="table-couchbase-sdk_net_executedecrement-cas-validfor"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset, validfor, casunique)`                                                                                 
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                          
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1 using check and set, defaulting to 100 if
the key doesn't exist and set an expiry of 60 seconds. Return an instance of an
`IMutateOperationResult`


```
var getResult = client.ExecuteGet("inventory");
var mutateResult = client.ExecuteDecrement("inventory", 100, 1, TimeSpan.FromSeconds(60), getResult.Cas);
```

<a id="table-couchbase-sdk_net_executedecrement-cas-expiresat"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset, expiresat, casunique)`                                                                                
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                              
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                       

Decrement the inventory counter by 1 using check and set, defaulting to 100 if
the key doesn't exist and set an expiry of 5 minutes. Return an instance of an
`IMutateOperationResult`.


```
var getResult = client.ExecuteGet("inventory");
client.ExecuteDecrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), getResult.Cas);
```

<a id="couchbase-sdk-net-update-remove"></a>

## Remove Methods

<a id="table-couchbase-sdk_net_remove"></a>

**API Call**     | `object.Remove(key)`                  
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Delete a key/value                    
**Returns**      | `Object` ; supported values:          
                 | `COUCHBASE_ETMPFAIL`                  
                 | `COUCHBASE_KEY_ENOENT`                
                 | `COUCHBASE_NOT_MY_VBUCKET`            
                 | `COUCHBASE_NOT_STORED`                
                 | `docid`                               
**Arguments**    |                                       
**string key**   | Document ID used to identify the value

The `Remove()` method deletes an item in the database with the specified key.

Remove the item with a specified key


```
client.Remove("Budweiser");
```

<a id="table-couchbase-sdk_net_executeremove"></a>

**API Call**     | `object.ExecuteRemove(key)`                         
-----------------|-----------------------------------------------------
**Asynchronous** | no                                                  
**Description**  | Delete a key/value                                  
**Returns**      | `IRemoveOperationResult` ( Remove operation result )
**Arguments**    |                                                     
**string key**   | Document ID used to identify the value              

The `ExecuteRemove()` method deletes an item in the database with the specified
key and returns an instance of an `IRemoveOperationResult`.


```
var result = client.ExecuteRemove("Coors");

if (!result.Success) {
    if (result.InnerResult != null) {
        logger.Error(result.Message, result.InnerResult.Exception);
    }
}
```

<a id="couchbase-sdk-net-update-increment"></a>

## Increment Methods

The `Increment()` methods increase the value of a given key if the corresponding
value can be parsed to an integer value. These operations are provided at a
protocol level to eliminate the need to get, update, and reset a simple integer
value in the database. All the.NET Client Library methods support the use of an
explicit offset value that will be used to reduce the stored value in the
database.

<a id="table-couchbase-sdk_net_increment"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset)`                                                                                                                                                                                                                                                                                             
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   

Increment the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
client.Increment("inventory", 100, 1);
```

<a id="table-couchbase-sdk_net_increment-validfor"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset, validfor)`                                                                                                                                                                                                                                                                                   
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                                                                                                                                                                                                          

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds.


```
client.Increment("inventory", 100, 1, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_increment-expiresat"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset, expiresat)`                                                                                                                                                                                                                                                                                  
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                                                                                                                                                                                                              

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes.


```
client.Increment("inventory", 100, 1, DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_increment-cas"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset, casunique)`                                                                                                                                                                                                                                                                                  
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

Increment the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
var casv = client.GetWithCas("inventory");
client.Increment("inventory", 100, 1, cas.Cas);
```

<a id="table-couchbase-sdk_net_increment-cas-validfor"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset, validfor, casunique)`                                                                                                                                                                                                                                                                        
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                                                                                                                                                                                                          
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds.


```
var casv = client.GetWithCas("inventory");
client.Increment("inventory", 100, 1, TimeSpan.FromSeconds(60), cas.Cas);
```

<a id="table-couchbase-sdk_net_increment-cas-expiresat"></a>

**API Call**            | `object.Increment(key, defaultvalue, offset, expiresat, casunique)`                                                                                                                                                                                                                                                                       
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `CasResult<ulong>` ( Cas result of bool )                                                                                                                                                                                                                                                                                                 
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                                                                                                                                                                                                              
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes.


```
var casv = client.GetWithCas("inventory");
client.Increment("inventory", 100, 1, DateTime.Now.AddMinutes(5), cas.Cas);
```

<a id="table-couchbase-sdk_net_executeincrement"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset)`                                                                                                                                                                                                                                                                                      
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   

Increment the inventory counter by 1, defaulting to 100 if the key doesn't
exist. Return an instance of an `IMutateOperationResult`.


```
var result = client.Increment("inventory", 100, 1);

if (result.Success) {
    logger.Debug("New value: " + result.Value);
}
```

<a id="table-couchbase-sdk_net_executeincrement-validfor"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset, validfor)`                                                                                                                                                                                                                                                                            
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                                                                                                                                                                                                          

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds. Return an instance of an
`IMutateOperationResult`.


```
var result = client.Increment("inventory", 100, 1);

if (result.Success) {
    logger.Debug("New value: " + result.Value);
}
```

<a id="table-couchbase-sdk_net_executeincrement-expiresat"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset, expiresat)`                                                                                                                                                                                                                                                                           
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                                                                                                                                                                                                              

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes. Return an instance of an
`IMutateOperationResult`.


```
client.ExecuteIncrement("inventory", 100, 1, DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_executeincrement-cas"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset, casunique)`                                                                                                                                                                                                                                                                           
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

Increment the inventory counter by 1 using check and set, defaulting to 100 if
the key doesn't exist. Return an instance of an `IMutateOperationResult`.


```
var getResult = client.ExecuteGet("inventory");

if (getResult.Success) {
    var mutateResult  client.ExecuteIncrement("inventory", 100, 1, getResult.Cas);

    if (mutateResult.Success) {
        logger.Debug("New value: " + mutateResult.Value);
    }
}
```

<a id="table-couchbase-sdk_net_executeincrement-cas-validfor"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset, validfor, casunique)`                                                                                                                                                                                                                                                                 
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                                                                                                                                                                                                                          
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

ExecuteIncrement the inventory counter by 1 using check and set, defaulting to
100 if the key doesn't exist and set an expiry of 60 seconds. Return an instance
of an `IMutateOperationResult`.


```
var getResult = client.ExecuteGet("inventory");
var mutateResult = client.ExecuteIncrement("inventory", 100, 1, TimeSpan.FromSeconds(60), getResult.Cas);
```

<a id="table-couchbase-sdk_net_executeincrement-cas-expiresat"></a>

**API Call**            | `object.ExecuteIncrement(key, defaultvalue, offset, expiresat, casunique)`                                                                                                                                                                                                                                                                
------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                        
**Description**         | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                                                                                                                                                                                                      
**Arguments**           |                                                                                                                                                                                                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                                                                                                                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                                                                                                                                                                                                              
**ulong casunique**     | Unique value used to verify a key/value combination                                                                                                                                                                                                                                                                                       

Increment the inventory counter by 1 using check and set, defaulting to 100 if
the key doesn't exist and set an expiry of 5 minutes. Return an instance of an
`IMutateOperationResult`.


```
var getResult = client.ExecuteGet("inventory");
var mutateResult = client.ExecuteIncrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), getResult.Cas);
```

<a id="couchbase-sdk-net-update-prepend"></a>

## Prepend Methods

The `Prepend()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data before the existing data.

The `Prepend()` methods prepend raw serialized data on to the end of the
existing data in the key. If you have previously stored a serialized object into
Couchbase and then use Prepend, the content of the serialized object will not be
extended. For example, adding an `List` of integers into the database, and then
using `Prepend()` to add another integer will result in the key referring to a
serialized version of the list, immediately preceded by a serialized version of
the integer. It will not contain an updated list with the new integer prepended
to it. De-serialization of objects that have had data prepended may result in
data corruption.

<a id="table-couchbase-sdk_net_prepend"></a>

**API Call**     | `object.Prepend(key, value)`          
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Prepend a value to an existing key    
**Returns**      | `Object` ( Binary object )            
**Arguments**    |                                       
**string key**   | Document ID used to identify the value
**object value** | Value to be stored                    

The `Prepend()` method prepends information to the end of an existing key/value
pair.

The sample below demonstrates how to create a csv string by prepending new
values.


```
client.Store(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Prepend("beers", new ArraySegment<byte>(stringToBytes("Three Philosophers,")));
client.Prepend("beers", new ArraySegment<byte>(stringToBytes("Witte,")));
```

You can check if the Prepend operation succeeded by using the checking the
return value.


```
var result = client.Prepend("beers", new ArraySegment<byte>(stringToBytes("Hennepin,")));
if (result) {
    Console.WriteLine("Prepend succeeded");
} else {
    Console.WriteLine("Prepend failed");
}
```

<a id="table-couchbase-sdk_net_prepend-cas"></a>

**API Call**        | `object.Prepend(key, casunique, value)`            
--------------------|----------------------------------------------------
**Asynchronous**    | no                                                 
**Description**     | Prepend a value to an existing key                 
**Returns**         | `Object` ( Binary object )                         
**Arguments**       |                                                    
**string key**      | Document ID used to identify the value             
**ulong casunique** | Unique value used to verify a key/value combination
**object value**    | Value to be stored                                 

`Prepend()` may also be used with a CAS value. With this overload, the return
value is a `CasResult`, where success is determined by examining the CasResult's
Result property.


```
var casv = client.GetWithCas("beers");
var casResult = client.Prepend("beers", casv.Cas, new ArraySegment<byte>(stringToBytes("Adoration,")));

if (casResult.Result) {
    Console.WriteLine("Prepend succeeded");
} else {
    Console.WriteLine("Prepend failed");
}
```

<a id="table-couchbase-sdk_net_executeprepend"></a>

**API Call**     | `object.ExecutePrepend(key, value)`                 
-----------------|-----------------------------------------------------
**Asynchronous** | no                                                  
**Description**  | Prepend a value to an existing key                  
**Returns**      | `IConcatOperationResult` ( Concat operation result )
**Arguments**    |                                                     
**string key**   | Document ID used to identify the value              
**object value** | Value to be stored                                  

The `ExecutePrepend()` behaves similar to `Prepend()`, but instead of a
`Boolean` it returns an instance of an `IConcatOperationResult`.


```
var concatResult = client.Store(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Prepend("beers", new ArraySegment<byte>(stringToBytes("Three Philosophers,")));
client.Prepend("beers", new ArraySegment<byte>(stringToBytes("Witte,")));

if (! concatResult.Success) {
    logger.Error(concatResult.Message, concatResult.Exception);
}
```

<a id="table-couchbase-sdk_net_executeprepend-cas"></a>

**API Call**        | `object.ExecutePrepend(key, casunique, value)`      
--------------------|-----------------------------------------------------
**Asynchronous**    | no                                                  
**Description**     | Prepend a value to an existing key                  
**Returns**         | `IConcatOperationResult` ( Concat operation result )
**Arguments**       |                                                     
**string key**      | Document ID used to identify the value              
**ulong casunique** | Unique value used to verify a key/value combination 
**object value**    | Value to be stored                                  

`ExecutePrepend()` may also be used with a CAS value. With this overload, the
return value is an instance of an `IConcatOperationResult`.


```
var getResult = client.ExecuteGet("beers");
var concatResult = client.Prepend("beers", getResult.Cas, new ArraySegment<byte>(stringToBytes("Adoration,")));

if (concatResult.Success) {
    Console.WriteLine("Prepend succeeded");
} else {
    Console.WriteLine("Prepend failed");
}
```

<a id="couchbase-sdk-net-update-touch"></a>

## Touch Methods

The `Touch()` methods allow you to update the expiration time on a given key.
This can be useful for situations where you want to prevent an item from
expiring without resetting the associated value. For example, for a session
database you might want to keep the session alive in the database each time the
user accesses a web page without explicitly updating the session value, keeping
the user's session active and available.

<a id="table-couchbase-sdk_net_touch"></a>

**API Call**      | `object.Touch(key, expiry)`                                                                                                 
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Update the expiry time of an item                                                                                           
**Returns**       | `Boolean` ( Boolean (true/false) )                                                                                          
**Arguments**     |                                                                                                                             
**string key**    | Document ID used to identify the value                                                                                      
**object expiry** | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The `Touch` method provides a simple key/expiry call to update the expiry time
on a given key. For example, to update the expiry time on a session for another
60 seconds:


```
client.Touch("session", TimeSpan.FromSeconds(60));
```

To update the expiry time on the session for another day:


```
client.Touch("session", DateTime.Now.AddDays(1));
```

<a id="couchbase-sdk-net-update-sync"></a>

## Sync Methods



<a id="table-couchbase-sdk_net_sync"></a>

**API Call**         | `object.Sync(mode, keyn, replicationcount)`          
---------------------|------------------------------------------------------
**Asynchronous**     | no                                                   
**Description**      | Sync one or more key/value pairs on a Membase cluster
**Returns**          | (none)                                               
**Arguments**        |                                                      
**mode**             |                                                      
**keyn**             | One or more keys used to reference a value           
**replicationcount** |                                                      

Sync operations

<a id="couchbase-sdk-net-logging"></a>

# Appendix: Configuring Logging

The following sections provide details on how to enable logging for the.NET
Client Library

To enable logging, you can tap into the logging capabilities provided by the
Enyim.Caching dependency. Enyim logging currently supports either log4net or
NLog.

Start by adding a reference to either Enyim.Caching.Log4NetAdapter or
Enyim.Caching.NLogAdapter. Both are available as part of the Couchbase.NET
Client Nuget package or as part of the client library zip file.

You could also get the projects from
[](https://github.com/enyim/EnyimMemcached). If you use these Visual Studio
projects, you'll also need to add a reference to log4net or NLog (depending on
which adapter you choose). Each of these dependencies is located in a "binaries"
directory under the root "EnyimMemcached" directory.

For log4net, your configuration should include an enyim.com section that defines
which log factory to use along with standard log4net configuration.

The log4net configuration will vary by the type of appender you are using. For
more information on log4net configuration, see
[](http://logging.apache.org/log4net/release/manual/configuration.html).


```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="enyim.com">
      <section name="log" type="Enyim.Caching.Configuration.LoggerSection, Enyim.Caching" />
    </sectionGroup>
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
  </configSections>
  <enyim.com>
    <log factory="Enyim.Caching.Log4NetFactory, Enyim.Caching.Log4NetAdapter" />
  </enyim.com>
  <log4net debug="false">
    <appender name="LogFileAppender" type="log4net.Appender.FileAppender,log4net">
      <param name="File" value="c:\\temp\\error-log.txt" />
      <param name="AppendToFile" value="true" />
      <layout type="log4net.Layout.PatternLayout,log4net">
        <param name="ConversionPattern" value="%d [%t] %-5p %c [%x] &lt;%X{auth}&gt; - %m%n" />
      </layout>
    </appender>
    <root>
      <priority value="ALL" />
      <level value="DEBUG" />
      <appender-ref ref="LogFileAppender" />
    </root>
  </log4net>
</configuration>
```

You'll also need to initialize (only once in your app) log4net in your code with
the standard log4net initializer.


```
log4net.Config.XmlConfigurator.Configure();
```

NLog configuration requires setting the log factory to NLogAdapter and including
the appropriate NLog configuration section.


```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="enyim.com">
      <section name="log" type="Enyim.Caching.Configuration.LoggerSection, Enyim.Caching" />
    </sectionGroup>
    <section name="nlog" type="NLog.Config.ConfigSectionHandler, NLog" />
  </configSections>
  <enyim.com>
    <log factory="Enyim.Caching.NLogFactory, Enyim.Caching.NLogAdapter" />
  </enyim.com>
  <nlog>
    <targets>
      <target name="logfile" type="File" fileName="c:\temp\error-log.txt" />
    </targets>
    <rules>
      <logger name="*" minlevel="Info" writeTo="logfile" />
    </rules>
  </nlog>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0" />
  </startup>
</configuration>
```

See [](http://nlog-project.org/wiki/Configuration_file) for more NLog
configuration details.

<a id="couchbase-sdk-net-configuration"></a>

# Appendix: Configuring the.NET CLient Library

The following sections provide details on the App|Web.config configuration
options for the.NET Client Library

The `CouchbaseClientSection` class is the configuration section handler.


```
<section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
```

The minimum configuration options are to include a `couchbase` section with a
`servers` element with at least one URI, which is used to bootstrap the client.
At least two node URIs should be provided, so that in the event that the client
can't reach the first, it will try the second.


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

The "bucket" and "bucketPassword" attributes of the `servers` element default to
"default" and an empty string respectively.


```
<couchbase>
    <servers bucket="beers" bucketPassword="H0p$">
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

The client will periodically check the health of its connection to the cluster
by performing a heartbeat check. By default, this test is done every 10 seconds
against the bootstrap URI defined in the `servers` element.

The "uri", "enabled" and "interval" attributes are all optional. The "interval"
is specified in milliseconds. Setting "enabled" to false will cause other
settings to be ignored and the heartbeat will not be checked.


```
<heartbeatMonitor uri="http://127.0.0.1:8091/pools/heartbeat" interval="60000" enabled="true" />
```

<a id="couchbase-sdk-net-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library.NET. To browse or submit new issues, see [Couchbase
Client Library.NET Issues Tracker](http://www.couchbase.com/issues/browse/NCBC).

<a id="couchbase-sdk-net-rn_1-1-6"></a>

## Release Notes for Couchbase Client Library.NET 1.1.6 GA (07 June 2012)

**New Features and Behaviour Changes in 1.1.6**

 * The 1.1.6 release of the Couchbase.NET Client library is a build only change,
   providing signed assemblies for both Couchbase.dll and Enyim.Caching.dll. The
   logging assemblies have also been signed.

<a id="couchbase-sdk-net-rn_1-1-5"></a>

## Release Notes for Couchbase Client Library.NET 1.1.5 GA (30 May 2012)

These updates includes minor bugfixes to release (.92) as well as an upgrade to
the current release of Enyim.Memcached (2.15)

**New Features and Behaviour Changes in 1.1.5**

 * The 1.1.5 release of the Couchbase.NET Client library includes fixes for issues
   NCBC-42, NCBC-43 and NCBC-49. With this release, client bootstrapping is now
   performed off of /pools and the heartbeat check is configurable.

   Prior to version 1.1.5, the.NET client would get cluster information by first
   bootstrapping to a node at /pools/default. While this approach is generally
   safe, the client should have bootstrapped off of /pools as /pools/default might
   not be the correct second URI in the handshake sequence.

    ```
    <servers>
              <add uri="http://127.0.0.1:8091/pools" />
         </servers>
    ```

   The.NET client performs a heartbeat check on the streaming connection it
   maintains by querying the bootstrapping node at periodic intervals. The URI it
   used previously for bootstrapping was the above bootstrapping URI. This release
   allows for this URI to be configured, along with the interval. Disabling the
   check is also allowed now.

   The default values are to check the /pools URI every 10 seconds. The
   heartbeatMonitor element is a sibling to the servers element.

    ```
    <heartbeatMonitor uri="http://127.0.0.1:8091/pools" interval="10000" enabled="true" />
    ```

<a id="couchbase-sdk-net-rn_1-1-0"></a>

## Release Notes for Couchbase Client Library.NET 1.1.0 GA (02 May 2012)

**New Features and Behaviour Changes in 1.1.0**

 * The 1.1 release of the.NET Client Library contains a series of new API methods
   designed to provide developers with more details about the success or failure of
   an operation performed by the client.

   The existing API methods remain in place and as such, these changes are not
   breaking. Each of the new methods has the standard API method name prefixed by
   `Execute`. For example `Store` becomes `ExecuteStore`.

    ```
    var storeResult = client.ExecuteStore(StoreMode.Set, "foo", "bar");

    if (! result.Success) {
        Console.WriteLine("Operation failed: {0}", result.Message);
    }
    ```

   Each of the new Execute methods returns an instance of an `IOperationResult`,
   with is extended by various operation specific interfaces -
   `IGetOperationResult`, `IStoreOperationResult`, `IConcatOperationResult`,
   `IMutateOperationResult` and `IRemoveOperationResult`.

   `IOperationResult` defines common properties available to all results returned
   by Execute methods.

    ```
    IOperationResult opertionResult = client.Store(StoreMode.Set, "foo", "bar");

    //Was the operation successful (i.e., no errors or exceptions)?
    Console.WriteLine("Success: " + operationResult.Success);

    //Print out possible error, warning or informational message
    Console.WriteLine("Message: " + operationResult.Message);

    //Print out a caught exception
    Console.WriteLine("Exception: " + operationResult.Exception.Message);

    //Print out status code (nullable)
    Console.WriteLine("StatusCode: " + operationResult.StatusCode);

    //Print out InnerResult, which is populated on handled failures (i.e., IO exceptions)
    Console.WriteLine("InnerResult: " + operationResult.InnerResult.Message);
    ```

   Store, Get, Mutate and Concat operation results all return Cas values.

    ```
    var getResult = client.ExecuteGet("foo");

    //Print out the Cas value
    Console.WriteLine("Cas value for 'foo':" + getResult.Cas);
    ```

   Get operation results also expose HasValue and Value properties.

    ```
    var getResult = client.ExecuteGet("foo");

    //Print out whether getResult contains a value (shortcut for value null check)
    Console.WriteLine("getResult HasValue: " + getResult.HasValue);

    //Print out the item value
    Console.WriteLine("Value for 'foo':" + getResult.Value);
    ```

   Most failures are likely to fall into one of two categories. The first are
   conditions that the server won't allow. For example, a Cas operation with an
   expired CAS value would be a failure. Attempting to add a key when that key
   already exists would also be failure. The second category of likely failures
   would occur when the client can't connect to a node.

   Both categories of failures are likely to be reported by lower-level components
   within the client library. These components handle these errors gracefully and
   then log the problem. Before 1.1, these failure conditions were swallowed and
   did not propagate up to the caller. As a consequence, it is a good idea to check
   the `InnerResult` for a failed operation result.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.