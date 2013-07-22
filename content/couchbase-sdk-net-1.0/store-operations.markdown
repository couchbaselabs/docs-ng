# Store Operations

The Couchbase.NET Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="couchbase-sdk-net-retrieve-set"></a>

## Store Methods

The Store() methods adds a value to the database with the specified key, but
will fail if the key already exists in the database and the StoreMode is set to
Add.

<a id="table-couchbase-sdk_net_store"></a>

**API Call**            | `object.Store(StoreMode storemode, string key, object value)`                                                                              
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `Boolean` ( Boolean (true/false) )                                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         

The `Store()` method is used to persist new values by key. Any class decorated
with the `Serializable` attribute may be stored.

StoreMode.Set will behave like StoreMode.Add when the key doesn't exist and
StoreMode.Replace when it does.


```
client.Store(StoreMode.Add, "beer", new Beer() {
    Brewer = "Thomas Hooker Brewing Company",
    Name = "American Ale"
});
```

<a id="table-couchbase-sdk_net_store-validfor"></a>

**API Call**            | `object.Store(storemode, key, value, validfor)`                                                                                            
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `Boolean` ( Boolean (true/false) )                                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                           


```
client.Store(StoreMode.Set, "beer", new Beer() {
    Brewer = "Peak Organic Brewing Company",
    Name = "IPA"
}, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_store-expiresat"></a>

**API Call**            | `object.Store(storemode, key, value, expiresat)`                                                                                           
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `Boolean` ( Boolean (true/false) )                                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**DateTime expiresat**  | Explicit expiry time for key                                                                                                               


```
client.Store(StoreMode.Replace, "beer", new Beer() {
    Brewer = "Six Point Craft Ales",
    Name = "Righteous Rye"
}, DateTime.Now.Addhours(1));
```

<a id="api-reference-retrieve"></a>
