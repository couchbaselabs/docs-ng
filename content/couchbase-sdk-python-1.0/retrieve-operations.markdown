# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-python-retrieve-get"></a>

## get Methods

The `get()` methods allow for direct access to a given key/value pair.

<a id="table-couchbase-sdk_python_get"></a>

**API Call**       | `object.get(key [, vbucket ])`             
-------------------|--------------------------------------------
**Asynchronous**   | no                                         
**Description**    | Get one or more key values                 
**Returns**        | `object` ( Binary object )                 
**Arguments**      |                                            
**key**            | Document ID used to identify the value     
**String vbucket** | Name of the vBucket to be used for storage.

The `get()` method obtains an object stored in Couchbase.

For example:


```
couchbase.get("someKey")
```

If the request key does not exist in the database then the returned value is
null.

<a id="couchbase-sdk-python-retrieve-getl"></a>

## getl Methods

The "get with lock" `getl()` method allows for direct access to a given
key/value pair while locking, providing exclusive access to an item for a period
of time.

The `getl()` method obtains an object stored in Couchbase and locks for time
limited exclusive access. Default lock expiry is 15 seconds.

For example:


```
couchbase.getl("somekey",30)
```

<a id="couchbase-sdk-python-retrieve-gat"></a>

## Get-and-Touch (GAT) Methods

The Get-and-Touch `gat()` method obtains a value for a given key and update the
expiry time for the key. This can be useful for session values and other
information where you want to set an expiry time, but don't want the value to
expire while the value is still in use.

<a id="table-couchbase-sdk_python_gat"></a>

**API Call**     | `object.gat(key, expiry)`                                                                                                   
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous** | no                                                                                                                          
**Description**  | Get a value and update the expiration time for a given key                                                                  
**Returns**      | (none)                                                                                                                      
**Arguments**    |                                                                                                                             
**key**          | Document ID used to identify the value                                                                                      
**expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The `gat()` function obtains a given value and updates the expiry time. For
example, to get session data and renew the expiry time to five minutes:


```
couchbase.gat('sessionid',300);
```

<a id="couchbase-sdk-python-update"></a>
