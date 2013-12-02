# Connection Operations

An example below on creating a single connection to the default bucket at
Couchbase Server:


```
$cb = new Couchbase("192.168.1.200:8091", "user", "pass");
```

The Couchbase PHP SDK can also create a persistent connection which can be used
for multiple request and response from processes. When you use a persistent
connection, the first connection request from an SDK will take longer than
subsequent SDK requests. Each subsequent request from a client application
automatically reuses the existing instance of the client and the connections for
that client. The following example demonstrates how you create a persistent
connection:


```
$cb = new Couchbase("192.168.1.200:8091", "user", "pass", true);
```

The parameters you use include host:port, username, password, bucket name, and a
boolean. The boolean set to true indicates that you want to create a persistent
connection. By default connections are not persistent.

When you use a persistent connection, the first request from a client
application will typically require more CPU and time to create a connection,
compared to operations that rely on an existing connection. Subsequent requests
from a client application will automatically reuse this existing persistent
connection based upon the name of the connection.

Be aware many web servers such as Apache will automatically take control of the
connection instance and may destroy but also rebuild a connection after a
certain number of requests. This is part of the web server functioning, and
enables the web server to create a pool of reuseable connections.

To plan for redundancy in the event of a failure of the Couchbase Server node
you specify to the client library, you may wish to supply multiple hosts. For
example:


```
$hosts = array(
    "server1",
    "server2"
);

$cb = new Couchbase($hosts,
    "user",
    "pass",
    "bucket",
    true);
```

With this method of building the connection, the client will try each of the
hosts specified in the order specified until it either connects with and
establishes a connection to a cluster or it runs out of hosts to try.

<a id="table-couchbase-sdk_php_addserver"></a>

**API Call**        | `$object->addServer($host, $port [, $weight ])`                
--------------------|----------------------------------------------------------------
**Asynchronous**    | no                                                             
**Description**     | Add a server to the connection pool                            
**Returns**         | `scalar` ( Binary object )                                     
**Arguments**       |                                                                
**string $host**    | Addresses a server by hostname or numeric IP address           
**integer $port**   | Specifies a TCP port number                                    
**integer $weight** | Defines the relative weight of a server in the connection pool.

<a id="table-couchbase-sdk_php_getoption"></a>

**API Call**     | `$object->getOption($option)`                    
-----------------|--------------------------------------------------
**Asynchronous** | no                                               
**Description**  | Retrieve an option                               
**Returns**      | `scalar` ( Binary object )                       
**Arguments**    |                                                  
**int $option**  | Option controlling connection or server behavior

<a id="table-couchbase-sdk_php_setoption"></a>

**API Call**      | `$object->setOption($option, $mixed)`            
------------------|--------------------------------------------------
**Asynchronous**  | no                                               
**Description**   | Specify an option                                
**Returns**       | `boolean` ( Boolean (true/false) )               
**Arguments**     |                                                  
**int $option**   | Option controlling connection or server behavior
**scalar $mixed** | Option value (constant, number, or string)       

<a id="api-reference-store"></a>
