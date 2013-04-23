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


```
var beer = client.Get("beer") as Beer;
```

The generic form of the `Get` method allows for retrieval without the need to
cast. If the stored type cannot be serialized to the generic type provided, an
`InvalidCastException` will be thrown.


```
var beer = client.Get<Beer>("beer");
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

<a id="api-reference-update"></a>
