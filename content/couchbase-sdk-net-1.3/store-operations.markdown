## Store Operations

The Couchbase.NET Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="couchbase-sdk-net-store-set"></a>

### Store Methods

The Store() methods add or replace a value in the database with the specified
key.

The behavior of `Store` and `ExecuteStore` operations is defined by setting the
first parameter to a value from the `StoreMode` enumeration.

 * `StoreMode.Add` - Add a key to the database, failing if the key exists

 * `StoreMode.Replace` - Replace a key in the database, failing if the key does not
   exist

 * `StoreMode.Set` - Add a key to the database, replacing the key if it already
   exists

JavaScript can store numbers up to a maximum size of 2 `53`. If you are storing
64-bit integers within Couchbase and want to use the numbers through the
Map/Reduce engine, numbers larger than 2 `53` should be stored as a string to
prevent number rounding errors.

<a id="table-couchbase-sdk_net_store"></a>

**API Call**            | `object.Store(storemode, key, value)`                                                                                                      
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

<a id="table-couchbase-sdk_net_executestore"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value)`                                                                                               
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         

The `ExecuteStore()` methods are similar to the `Store` methods, but return an
instance of an `IStoreOperationResult`.


```
var result = client.ExecuteStore(StoreMode.Add, "beer", new Beer() {
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
```

<a id="table-couchbase-sdk_net_executestore-validfor"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value, validfor)`                                                                                     
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                           


```
client.ExecuteStore(StoreMode.Set, "beer", new Beer() {
    Brewer = "Peak Organic Brewing Company",
    Name = "IPA"
}, TimeSpan.FromSeconds(60));
```

<a id="table-couchbase-sdk_net_executestore-expiresat"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value, expiresat)`                                                                                    
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**DateTime expiresat**  | Explicit expiry time for key                                                                                                               


```
client.ExecuteStore(StoreMode.Replace, "beer", new Beer() {
    Brewer = "Six Point Craft Ales",
    Name = "Righteous Rye"
}, DateTime.Now.Addhours(1));
```

<a id="table-couchbase-sdk_net_executestore-observe"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value)`                                                                                               
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         

The `ExecuteStore()` methods may define persistence or replciation (durability)
requirements. These operations will either return success only when the
durability requirements have been met. The operation fails if it times out
before meeting the durability requirement.

 * When specifying a persistence requirement, the persistTo parameter is set to a
   value from the `PersistTo` enumeration. These values specify the number of nodes
   to which a key must be persisted to disk. `PersistTo.One` - Require master only
   persistence

 * `PersistTo.Two, PersistTo.Three, PersistTo.Four` - Persist to master, plus one,
   two or three replicas



 * When specifying a replication requirement, the replicateTo parameter is set to a
   value from the `ReplicateTo` enumeration. These values specify the number of
   nodes to which a key must be replicated. `ReplicateTo.One, ReplicateTo.Two,
   ReplicateTo.Three` - Replicate to one, two or three replicas




```
//master persistence, replicate to two replicas
var result = client.ExecuteStore(StoreMode.Add, "beer", new Beer() {
    Brewer = "Thomas Hooker Brewing Company",
    Name = "American Ale"
}, PersistTo.One, ReplicateTo.Two);

if (! result.Success)
{
    Console.WriteLine("Store failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
```

<a id="table-couchbase-sdk_net_executestore-validfor-observe"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value, validfor)`                                                                                     
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**TimeSpan validfor**   | Expiry time (in seconds) for key                                                                                                           


```
//master only persistence
client.ExecuteStore(StoreMode.Set, "beer", new Beer() {
    Brewer = "Peak Organic Brewing Company",
    Name = "IPA"
}, TimeSpan.FromSeconds(60), PersistTo.One, ReplicateTo.Zero););
```

<a id="table-couchbase-sdk_net_executestore-expiresat-observe"></a>

**API Call**            | `object.ExecuteStore(storemode, key, value, expiresat)`                                                                                    
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                         
**Description**         | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**             | `IStoreOperationResult` ( Store operation result )                                                                                         
**Arguments**           |                                                                                                                                            
**StoreMode storemode** | Storage mode for a given key/value pair                                                                                                    
**string key**          | Document ID used to identify the value                                                                                                     
**object value**        | Value to be stored                                                                                                                         
**DateTime expiresat**  | Explicit expiry time for key                                                                                                               


```
//no persistence requirement, replicate to two nodes
client.ExecuteStore(StoreMode.Replace, "beer", new Beer() {
    Brewer = "Six Point Craft Ales",
    Name = "Righteous Rye"
}, DateTime.Now.Addhours(1), PersistTo.Zero, ReplicateTo.Two););
```

<a id="api-reference-retrieve"></a>
