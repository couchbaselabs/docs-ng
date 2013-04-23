# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-net-retrieve-get"></a>

## Get Methods

The Get() methods allow for direct access to a given key/value pair.

<a id="table-couchbase-sdk_net_get"></a>

**API Call**     | `object.Get(key)`                     
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Get one or more key values            
**Returns**      | `Object` ( Binary object )            
**Arguments**    |                                       
**string key**   | Document ID used to identify the value

The generic form of the `Get` method allows for retrieval without the need to
cast. If the stored type cannot be serialized to the generic type provided, an
`InvalidCastException` will be thrown.


```
var beer = client.Get<Beer>("beer");
```

<a id="table-couchbase-sdk_net_gat"></a>

**API Call**      | `object.Get(key, expiry)`                                                                                                   
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Get a value and update the expiration time for a given key                                                                  
**Returns**       | (none)                                                                                                                      
**Arguments**     |                                                                                                                             
**string key**    | Document ID used to identify the value                                                                                      
**object expiry** | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

Calling the `Get()` method with a key and a new expiration value will cause get
and touch operations to be performed.


```
var val = client.Get("beer", DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_get-multi"></a>

**API Call**               | `object.Get(keyarray)`                             
---------------------------|----------------------------------------------------
**Asynchronous**           | no                                                 
**Description**            | Get one or more key values                         
**Returns**                | `Object` ( Binary object )                         
**Arguments**              |                                                    
**List <string> keyarray** | Array of keys used to reference one or more values.

Calling `Get()` with multiple keys returns a dictionary with the associated
values.


```
client.Store(StoreMode.Set, "brewer", "Cottrell Brewing Co.");
client.Store(StoreMode.Set, "beer", "Old Yankee Ale");

var dict = client.Get(new string[] { "brewery", "beer" });
Console.WriteLine(dict["brewery"]);
Console.WriteLine(dict["beer"]);
```

<a id="table-couchbase-sdk_net_getwithcas"></a>

**API Call**     | `object.Get(key)`                     
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Get one or more key values            
**Returns**      | `Object` ( Binary object )            
**Arguments**    |                                       
**string key**   | Document ID used to identify the value

`GetWithCas` returns a `CasResult`, which includes the document and its CAS
value.

For example:


```
var casResult = client.GetWithCas("beer");
client.Store(StoreMode.Set, "beer", "some other beer", casResult.Cas)
```

Calling `GetWithCas()` with multiple keys returns a dictionary with the
associated values. The generic version will return the `Result` as an instance
of `T`.


```
var casResult = client.GetWithCas<Beer>("beer");
Console.WriteLine(casResult.Name);
```

<a id="table-couchbase-sdk_net_executeget"></a>

**API Call**     | `object.ExecuteGet(key)`                      
-----------------|-----------------------------------------------
**Asynchronous** | no                                            
**Description**  | Get one or more key values                    
**Returns**      | `IGetOperationResult` ( Get operation result )
**Arguments**    |                                               
**string key**   | Document ID used to identify the value        

The ExecuteGet and generic ExecuteGet<T> methods are used to return detailed
results in an instance of an `IGetOperationResult`.


```
var result = client.ExecuteGet("beer");

if (! result.Success)
{
    Console.WriteLine("Get failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}

var beer = result.Value as Beer;
beer.Brewery = "Cambridge Brewing Company";
var casResult = client.ExecuteCas(StoreMode.Set, "beer", beer, result.Cas); //ExecuteGet returns the CAS for the key
```

The generic form of `ExecuteGet<T>` will set the `Value` property to type `T`


```
var result = client.ExecuteGet<Beer>("beer");
var beer = result.Value; //no need to cast beer as a Beer
```

<a id="table-couchbase-sdk_net_executegat"></a>

**API Call**      | `object.ExecuteGet(key, expiry)`                                                                                            
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Get a value and update the expiration time for a given key                                                                  
**Returns**       | `IGetOperationResult` ( Get operation result )                                                                              
**Arguments**     |                                                                                                                             
**string key**    | Document ID used to identify the value                                                                                      
**object expiry** | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

Calling the `ExecuteGet()` method with a key and a new expiration value will
cause get and touch operations to be performed.


```
var val = client.Get("beer", DateTime.Now.AddMinutes(5));
```

<a id="table-couchbase-sdk_net_executeget-multi"></a>

**API Call**               | `object.ExecuteGet(keyarray)`                      
---------------------------|----------------------------------------------------
**Asynchronous**           | no                                                 
**Description**            | Get one or more key values                         
**Returns**                | `IGetOperationResult` ( Get operation result )     
**Arguments**              |                                                    
**List <string> keyarray** | Array of keys used to reference one or more values.

Calling `ExecuteGet()` with multiple keys returns a dictionary with the
associated `IGetOperationResult` values.


```
client.Store(StoreMode.Set, "brewery", "Cottrell Brewing Co.");
client.Store(StoreMode.Set, "beer", "Old Yankee Ale");

var dict = client.ExecuteGet(new string[] { "brewery", "beer" });
foreach(var key in dict.Keys)
{
    Console.WriteLine(dict[key]);
}
```

`GetWithLock()` prevents a key from being updated for either 30 seconds
(default) or the value specified as an optional lock expiration.


```
var casResult = client.GetWithLock("beer", TimeSpan.FromSeconds(10));
var result = client.Store(StoreMode.Set, "beer", new Beer()); //result will be false
```

`ExecuteGetWithLock()` provides similar behavior to `GetWithLock`, but returns
an `IGetOperationResult`, which allows for status codes to be checked.


```
var lockResult = client.ExecuteGetWithLock("key", TimeSpan.FromSeconds(30));
var storeResult = client.ExecuteStore(StoreMode.Set, "key", "new value");
//storeResult.Success will be false
//storeResult.StatusCode will be equal to (int)StatusCodeEnums.DataExistsForKey

var getLockResultA = client.ExecuteGetWithLock("key");
var getLockResultB = client.ExecuteGetWithLock("key");
//getLockResultB.StatusCode will be equalt to (int)CouchbaseStatusCodeEnums.LockError)
```

<a id="table-couchbase-sdk_net_keyexists"></a>

**API Call**     | `object.KeyExists(key)`               
-----------------|---------------------------------------
**Asynchronous** | no                                    
**Description**  | Get one or more key values            
**Returns**      | `Boolean` ( Boolean (true/false) )    
**Arguments**    |                                       
**string key**   | Document ID used to identify the value

`KeyExists()` checks whether a key has been either a) written to RAM or b)
written to disk on the master node for a key. If the key exists, the value is
not returned.


```
var result = client.KeyExists("foo"); //result is true when "foo" exists
```

<a id="api-reference-update"></a>
