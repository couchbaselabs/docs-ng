# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

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


```
var beer = client.Get("beer") as Beer;
```

The generic form of the `Get` method allows for retrieval without the need to
cast. If the stored type cannot be serialized to the generic type provided, an
`InvalidCastException` will be thrown.


```
var beer = client.Get<Beer>("beer");
```

<a id="table-couchbase-sdk_net_executeget"></a>

**API Call**     | `object.ExecuteGet(key)`                      
-----------------|-----------------------------------------------
**Asynchronous** | no                                            
**Description**  | Get one or more key values                    
**Returns**      | `IGetOperationResult` ( Get operation result )
**Arguments**    |                                               
**string key**   | Document ID used to identify the value        

`ExecuteGet()` behaves as does `Get()` but returns an instance of an
`IGetOperationResult` instead of directly returning the item for the key.


```
Beer beer = null;
var getResult = client.ExecuteGet("beer") as Beer;
if (getResult.Success && getResult.HasValue) {
    beer = getResult.Value as Beer;
} else {
    logger.Error(getResult.Message, getResult.Exception);
}
```

`ExecuteGet()` also has a generic form to allow an item to be retrieved without
casting.


```
var beer = client.ExecuteGet<Beer>("beer").Value;
```

<a id="table-couchbase-sdk_net_getwithcas"></a>

**API Call**     | `object.GetWithCas(key)`                 
-----------------|------------------------------------------
**Asynchronous** | no                                       
**Description**  | Get one or more key values               
**Returns**      | `CasResult<ulong>` ( Cas result of bool )
**Arguments**    |                                          
**string key**   | Document ID used to identify the value   

`GetWithCas()` will return a `CasResult` with the Cas value for a given key.


```
var casResult = client.GetWithCas("beer");
var beer = casResult.Result;
beer = "Heady Topper";
var storeResult = client.Cas(StoreMode.Replace, "beer", beer, casResult.Cas);
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

var dict = client.Get(new string[] { "brewer", "beer" });
Console.WriteLine(dict["brewer"]);
Console.WriteLine(dict["beer"]);
```

<a id="table-couchbase-sdk_net_executeget-multi"></a>

**API Call**               | `object.ExecuteGet(keyarray)`                      
---------------------------|----------------------------------------------------
**Asynchronous**           | no                                                 
**Description**            | Get one or more key values                         
**Returns**                | `IGetOperationResult` ( Get operation result )     
**Arguments**              |                                                    
**List <string> keyarray** | Array of keys used to reference one or more values.

Calling `ExecuteGet()` with multiple keys returns a dictionary where the values
are instances of an `IGetOperationResult`.


```
client.Store(StoreMode.Set, "brewer", "Cottrell Brewing Co.");
client.Store(StoreMode.Set, "beer", "Old Yankee Ale");

var dict = client.ExecuteGet(new string[] { "brewer", "beer" });
Console.WriteLine(dict["brewer"].Value);
Console.WriteLine(dict["beer"].Value);
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

<a id="table-couchbase-sdk_net_executegat"></a>

**API Call**      | `object.ExecuteGet(key, expiry)`                                                                                            
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Get a value and update the expiration time for a given key                                                                  
**Returns**       | `IGetOperationResult` ( Get operation result )                                                                              
**Arguments**     |                                                                                                                             
**string key**    | Document ID used to identify the value                                                                                      
**object expiry** | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

`ExecuteGet()` when called with an expiration will update the time to live for
an item and return an instane of an `IGetOperationResult`


```
var val = client.Get("beer", DateTime.Now.AddMinutes(5));
```

<a id="api-reference-update"></a>
