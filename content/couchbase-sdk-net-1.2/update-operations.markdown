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

You can check if the Append operation succeeded by checking the return value.


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

The `Append` operation may also be used with a CAS value.


```
var storeResult = client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");

Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Append("beers", storeResult.Cas, new ArraySegment<byte>(stringToBytes(",Three Philosophers")));
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

The ExecuteAppend operation is used to get an instance of an
`IConcatOperationResult`.


```
client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
var result = client.ExecuteAppend("beers", new ArraySegment<byte>(stringToBytes(",Three Philosophers")));

if (! result.Sucecss)
{
    Console.WriteLine("Append failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception == null)
    {
        throw result.Exception;
    }
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

The ExecuteAppend operation may also be used with a CAS value.


```
var storeResult = client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");

Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
var appendResult = client.ExecuteAppend("beers", storeResult.Cas, new ArraySegment<byte>(stringToBytes(",Three Philosophers")));

if (! appendResult.Sucecss)
{
    Console.WriteLine("Append failed with message {0} and status code {1}", appendResult.Message, appendResult.StatusCode);

    if (appendResult.Exception == null)
    {
        throw appendResult.Exception;
    }
}
```

<a id="couchbase-sdk-net-update-decrement"></a>

## Decrement Methods

The `Decrement()` methods reduce the value of a given key if the corresponding
value can be parsed to an integer value. These operations are provided at a
protocol level to eliminate the need to get, update, and reset a simple integer
value in the database. All the.NET Client Library methods support the use of an
explicit offset value that will be used to reduce the stored value in the
database. Note that the `Decrement` methods may not be used with keys that were
first created with a `Store` method. To initialize a counter, you must first use
either `Increment` or `Decrement` with a default value.

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
client.Remove("inventory"); //reset the counter
client.Decrement("inventory", 100, 1); //counter will be 100
client.Decrement("inventory", 100, 1); //counter will be 99
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
exist. Fail if CAS value doesn't match CAS value on server.


```
var result = client.ExecuteGet("inventory");
client.Decrement("inventory", 100, 1, result.Cas);
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
and set an expiry of 60 seconds. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.Decrement("inventory", 100, 1, TimeSpan.FromSeconds(60), result.Cas);
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
and set an expiry of 5 minutes. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.Decrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), result.Cas);
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

ExecuteDecrement will return an instance of an `IMutateOperationResult`

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
client.Remove("inventory"); //reset the counter
client.ExecuteDecrement("inventory", 100, 1); //counter will be 100
var result = client.ExecuteDecrement("inventory", 100, 1); //counter will be 99

if (! result.Success)
{
    Console.WriteLine("Decrement failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
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
and set an expiry of 60 seconds.


```
client.ExecuteDecrement("inventory", 100, 1, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_executedecrement-expiresat"></a>

**API Call**            | `object.ExecuteDecrement(key, defaultvalue, offset, expiresat)`                                                                                           
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                        
**Description**         | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**             | `IMutateOperationResult` ( Mutate operation result )                                                                                                      
**Arguments**           |                                                                                                                                                           
**string key**          | Document ID used to identify the value                                                                                                                    
**object defaultvalue** | Value to be stored if key does not already exist                                                                                                          
**Integer offset**      | Integer offset value to increment/decrement (default 1)                                                                                                   
**DateTime expiresat**  | Explicit expiry time for key                                                                                                                              

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes.


```
client.ExecuteDecrement("inventory", 100, 1, DateTime.Now.AddMinutes(5));
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

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't
exist. Fail if CAS value doesn't match CAS value on server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteDecrement("inventory", 100, 1, result.Cas);
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

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteDecrement("inventory", 100, 1, TimeSpan.FromSeconds(60), result.Cas);
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

Decrement the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteDecrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), result.Cas);
```

<a id="couchbase-sdk-net-update-remove"></a>

## Remove Methods

The `Remove()` method deletes an item in the database with the specified key.

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

Remove the item with a specified key


```
client.Remove("badkey");
```

<a id="table-couchbase-sdk_net_executeremove"></a>

**API Call**     | `object.ExecuteRemove(key)`                         
-----------------|-----------------------------------------------------
**Asynchronous** | no                                                  
**Description**  | Delete a key/value                                  
**Returns**      | `IRemoveOperationResult` ( Remove operation result )
**Arguments**    |                                                     
**string key**   | Document ID used to identify the value              

`ExecuteRemove` removes an item by key and returns an instance of an
`IRemoveOperationResult`


```
var result = client.ExecuteRemove("badkey");

if (! result.Succes)
{
    Console.WriteLine("Remove failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
```

<a id="table-couchbase-sdk_net_executeremove-cas"></a>

**API Call**        | `object.ExecuteRemove-cas(key, casunique)`          
--------------------|-----------------------------------------------------
**Asynchronous**    | no                                                  
**Description**     | Delete a key/value                                  
**Returns**         | `IRemoveOperationResult` ( Remove operation result )
**Arguments**       |                                                     
**string key**      | Document ID used to identify the value              
**ulong casunique** | Unique value used to verify a key/value combination 

`ExecuteRemove` removes an item by key using a CAS operation and returns an
instance of an `IRemoveOperationResult`


```
var result = client.ExecuteRemove("badkey", 86753091234);

if (! result.Succes)
{
    Console.WriteLine("Remove failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
```

<a id="table-couchbase-sdk_net_executeremove-observe"></a>

**API Call**     | `object.ExecuteRemove(key)`                         
-----------------|-----------------------------------------------------
**Asynchronous** | no                                                  
**Description**  | Delete a key/value                                  
**Returns**      | `IRemoveOperationResult` ( Remove operation result )
**Arguments**    |                                                     
**string key**   | Document ID used to identify the value              

The `ExecuteRemove()` method may define persistence requirements. This operation
will return success only when the key has been removed from the specified number
of nodes.

`PersistTo.One` will ensure removal from the key's master node and not consider
removal of its replicas. A common use of this option is to combine it with a
non-stale view query, to guarantee that a deleted key is not returned in a view
result.


```
var result = client.ExecuteRemove("city_NC_Raleigh", PersistTo.One);

if (! result.Succes)
{
    Console.WriteLine("Remove failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
else
{
    var view = client.GetView("cities", "by_name").Stale(StaleMode.False);
    //safe to iterate this view, because the key has been removed from disk
    //and the index was updated.
}
```

<a id="couchbase-sdk-net-update-increment"></a>

## Increment Methods

The `Increment()` methods reduce the value of a given key if the corresponding
value can be parsed to an integer value. These operations are provided at a
protocol level to eliminate the need to get, update, and reset a simple integer
value in the database. All the.NET Client Library methods support the use of an
explicit offset value that will be used to reduce the stored value in the
database. Note that the `Increment` methods may not be used with keys that were
first created with a `Store` method. To initialize a counter, you must first use
either `Increment` or `Increment` with a default value.

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
client.Remove("inventory"); //reset the counter
client.Increment("inventory", 100, 1); //counter will be 100
client.Increment("inventory", 100, 1); //counter will be 101
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
exist. Fail if CAS value doesn't match CAS value on server.


```
var result = client.ExecuteGet("inventory");
client.Increment("inventory", 100, 1, result.Cas);
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
and set an expiry of 60 seconds. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.Increment("inventory", 100, 1, TimeSpan.FromSeconds(60), result.Cas);
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
and set an expiry of 5 minutes. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.Increment("inventory", 100, 1, DateTime.Now.AddMinutes(5), result.Cas);
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

ExecuteIncrement will return an instance of an `IMutateOperationResult`

Increment the inventory counter by 1, defaulting to 100 if the key doesn't
exist.


```
client.Remove("inventory"); //reset the counter
client.ExecuteIncrement("inventory", 100, 1); //counter will be 100
var result = client.ExecuteIncrement("inventory", 100, 1); //counter will be 101

if (! result.Success)
{
    Console.WriteLine("Increment failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
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
and set an expiry of 60 seconds.


```
client.ExecuteIncrement("inventory", 100, 1, TimeSpan.FromSeconds(60));
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
and set an expiry of 5 minutes.


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

Increment the inventory counter by 1, defaulting to 100 if the key doesn't
exist. Fail if CAS value doesn't match CAS value on server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteIncrement("inventory", 100, 1, result.Cas);
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

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 60 seconds. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteIncrement("inventory", 100, 1, TimeSpan.FromSeconds(60), result.Cas);
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

Increment the inventory counter by 1, defaulting to 100 if the key doesn't exist
and set an expiry of 5 minutes. Fail if CAS value doesn't match CAS value on
server.


```
var result = client.ExecuteGet("inventory");
client.ExecuteIncrement("inventory", 100, 1, DateTime.Now.AddMinutes(5), result.Cas);
```

<a id="couchbase-sdk-net-update-prepend"></a>

## Prepend Methods

The `Prepend()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `Prepend()` methods prepend raw serialized data on to the end of the
existing data in the key. If you have previously stored a serialized object into
Couchbase and then use Prepend, the content of the serialized object will not be
extended. For example, adding an `List` of integers into the database, and then
using `Prepend()` to add another integer will result in the key referring to a
serialized version of the list, immediately followed by a serialized version of
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
client.Prepend("beers", new ArraySegment<byte>(stringToBytes(",Three Philosophers")));
client.Prepend("beers", new ArraySegment<byte>(stringToBytes(",Witte")));
```

You can check if the Prepend operation succeeded by checking the return value.


```
var result = client.Prepend("beers", new ArraySegment<byte>(stringToBytes(",Hennepin")));
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

The `Prepend` operation may also be used with a CAS value.


```
var storeResult = client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");

Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
client.Prepend("beers", storeResult.Cas, new ArraySegment<byte>(stringToBytes(",Three Philosophers")));
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

The ExecutePrepend operation is used to get an instance of an
`IConcatOperationResult`.


```
client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");
Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
var result = client.ExecutePrepend("beers", new ArraySegment<byte>(stringToBytes(",Three Philosophers")));

if (! result.Sucecss)
{
    Console.WriteLine("Prepend failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception == null)
    {
        throw result.Exception;
    }
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

The ExecutePrepend operation may also be used with a CAS value.


```
var storeResult = client.ExecuteStore(StoreMode.Set, "beers", "Abbey Ale");

Func<string, byte[]> stringToBytes = (s) => Encoding.Default.GetBytes(s);
var prependResult = client.ExecutePrepend("beers", storeResult.Cas, new ArraySegment<byte>(stringToBytes(",Three Philosophers")));

if (! prependResult.Sucecss)
{
    Console.WriteLine("Prepend failed with message {0} and status code {1}", prependResult.Message, prependResult.StatusCode);

    if (prependResult.Exception == null)
    {
        throw prependResult.Exception;
    }
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

<a id="couchbase-sdk-net-store-cas"></a>

## CAS Methods

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

 * The behavior of `Cas` and `ExecuteCas` operations is defined by setting the
   first parameter to a value from the `StoreMode` enumeration. `StoreMode.Add` -
   Add a key to the database, failing if the key exists

 * `StoreMode.Replace` - Replace a key in the database, failing if the key does not
   exist

 * `StoreMode.Set` - Add a key to the database, replacing the key if it already
   exists



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

The `Cas()` method is used to persist new values by key. Any class decorated
with the `Serializable` attribute may be stored. The CAS value is returned by
way of a `CasResult`


```
var casResult = client.Cas(StoreMode.Add, "beer", new Beer() {
    Brewer = "Thomas Hooker Brewing Company",
    Name = "American Ale"
});

if (casResult.Result)
{
    Console.WriteLine("Cas: ", casResult.Cas);
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


```
client.Cas(StoreMode.Set, "beer", new Beer() {
    Brewer = "Peak Organic Brewing Company",
    Name = "IPA"
}, TimeSpan.FromSeconds(60));
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


```
client.Cas(StoreMode.Replace, "beer", new Beer() {
    Brewer = "Six Point Craft Ales",
    Name = "Righteous Rye"
}, DateTime.Now.Addhours(1));
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

The `ExecuteCas()` methods are similar to the `Cas` methods, but return an
instance of an `IStoreOperationResult`.


```
var result = client.ExecuteCas(StoreMode.Add, "beer", new Beer() {
    Brewer = "Thomas Hooker Brewing Company",
    Name = "American Ale"
});

if (! result.Success)
{
    Console.WriteLine("Store failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}

client.ExecuteCas(StoreMode.Replace"beer", new Beer() {
    Brewer = "Thomas Hooker Brewing Co.",
    Name = "American Ale"
}, result.Cas);
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


```
client.ExecuteCas(StoreMode.Set, "beer", new Beer() {
    Brewer = "Peak Organic Brewing Company",
    Name = "IPA"
}, TimeSpan.FromSeconds(60));
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


```
client.ExecuteCas(StoreMode.Replace, "beer", new Beer() {
    Brewer = "Six Point Craft Ales",
    Name = "Righteous Rye"
}, DateTime.Now.Addhours(1));
```

<a id="api-reference-view"></a>
