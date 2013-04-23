# Connection Operations

**Unhandled thing here**
To connect to a Couchbase Server, you must should create a new **Unhandled:**
`[:unknown-tag :classname]` object:

<a id="table-couchbase-sdk_php_new_couchbase"></a>

**API Call**                       | `$object->new Couchbase([ $url ] [, $username ] [, $password ] [, $bucket ] [, $persistent ])`                                                                                                                                                                     
-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                                                                                                                                                                 
**Description**                    | Create a connection to Couchbase Server with given parameters, such as node URL. The connection obtains the cluster configuration from the first host to which it has connected. Further communication operates directly with each node in the cluster as required.
**Returns**                        | `scalar` ; supported values:                                                                                                                                                                                                                                       
                                   | `object`                                                                                                                                                                                                                                                           
**Arguments**                      |                                                                                                                                                                                                                                                                    
**string $url**                    | URL for Couchbase Server Instance, or node.                                                                                                                                                                                                                        
                                   | **Default**                                                                                                                                                                                                                                                        
**string $username**               | Username for Couchbase bucket.                                                                                                                                                                                                                                     
                                   | **Default**                                                                                                                                                                                                                                                        
**string $password**               | Password for Couchbase bucket.                                                                                                                                                                                                                                     
                                   | **Default**                                                                                                                                                                                                                                                        
**string $bucket**                 | Bucket name used for storing objects.                                                                                                                                                                                                                              
                                   | **Default**                                                                                                                                                                                                                                                        
**string $persistent**             | True/false which indicates whether connection should be persistent or not.                                                                                                                                                                                         
                                   | **Default**                                                                                                                                                                                                                                                        
**Errors**                         |                                                                                                                                                                                                                                                                    
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                                                                                                                                                                     
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                                                                                                                                                                  
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                                                                                                                                                         
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                                                                                                                                                                     

An example below on creating a single connection to the default bucket at
Couchbase Server:


```
$cb = new Couchbase("192.168.1.200:8091");
```

For redundancy, you should specify more than one host to attempt the connection
with the cluster. You can do this either by supplying a string a semi-colon
separated list of hosts, for example:


```
$cb = new Couchbase("192.168.1.200:8091;192.168.1.206:8091");
```

Alternatively, you can supply an array as the first argument:


```
$cb = new Couchbase(array("192.168.1.200:8091","192.168.1.206:8091"));
```

The two formats are functionally identical.

To create a connection to a named bucket using SASL authentication, you must
specify the bucket name, username (bucket name) and bucket password:


```
$cb = new Couchbase("192.168.1.200:8091", "logging", "pass", "logging");
```

The Couchbase PHP SDK can also create a persistent connection which can be used
for multiple request and response from processes. When you use a persistent
connection, the first connection request from an SDK will take longer than
subsequent SDK requests. Each subsequent request from a client application
automatically reuses the existing instance of the client and the connections for
that client. The following example demonstrates how you create a persistent
connection:


```
$cb = new Couchbase("192.168.1.200:8091", "user", "pass", "bucket", true);
```

The parameters you use include host:port, username, password, bucket name, and a
boolean. The boolean set to true indicates that you want to create a persistent
connection. By default connections are not persistent.

When you use a persistent connection, the first request from a client
application will typically require more CPU and time to create a connection,
compared to operations that rely on an existing connection. Subsequent requests
from a client application will automatically reuse this existing persistent
connection.

Be aware many web servers such as Apache will automatically take control of the
connection instance and may destroy but also rebuild a connection after a
certain number of requests. This is part of the web server functioning, and
enables the web server to create a pool of reuseable connections.

<a id="api-reference-connection-serverlist"></a>

## Getting a List of Nodes in the Cluster

To obtain a list of the servers within a given connection, use the
`getServers()` method:

<a id="table-couchbase-sdk_php_getserverlist"></a>

**API Call**     | `$object->getServers()`                       
-----------------|-----------------------------------------------
**Asynchronous** | no                                            
**Description**  | Returns the list of servers in the server pool
**Returns**      | `array` ( List of objects or key/value pairs )
**Arguments**    |                                               
                 | None                                          

The return type is an array of the servers in the cluster.

<a id="api-reference-connection-options"></a>

## Setting Client Library Options

The PHP client library supports a number of global options that can be
configured using the `setOption()` method. The supported options are configured
by using one of the constnats in
[](couchbase-sdk-php-ready.html#table-couchbase-sdk-php-summary-optconstants).

<a id="table-couchbase-sdk-php-summary-optconstants"></a>

Option                       | Description                                                                                                                     
-----------------------------|---------------------------------------------------------------------------------------------------------------------------------
`Couchbase::OPT_SERIALIZER`  | Specifies the serializer to be used when objects are stored.                                                                    
`Couchbase::OPT_COMPRESSION` | Specifies the compression to be used when storing large documents.                                                              
`Couchbase::OPT_PREFIX_KEY`  | Specifies the prefix key to be added to all stored document IDs. Can be used to create your own namespace within a given bucket.

The serializer controls how objects are translated into the bytes stored as the
document within Couchbase. For example, to configure the serializer to convert
objects to JSON documents:


```
$couchbase->setOption(OPT_SERIALIZER, SERIALIZER_JSON);
```

Using the serializer option employs the flags against objects stored within
Couchbase to identify the serialization type. When reading or updating objects
from other languages care should be taken to ensure that the flag values are
retained to ensure compatibility. Alternatively, you can manually
serialize/deserilize data which will not update the flags value.

<a id="table-couchbase-sdk_php_setoption"></a>

**API Call**      | `$object->setOption($option, $mixed)`            
------------------|--------------------------------------------------
**Asynchronous**  | no                                               
**Description**   | Specify an option                                
**Returns**       | `boolean` ( Boolean (true/false) )               
**Arguments**     |                                                  
**int $option**   | Option controlling connection or server behaviour
**scalar $mixed** | Option value (constant, number, or string)       

The list of supported constants and behaviour are described in
[](couchbase-sdk-php-ready.html#table-couchbase-sdk-php-summary-optconstants-serializer).

<a id="table-couchbase-sdk-php-summary-optconstants-serializer"></a>

Value                              | Value Description                               
-----------------------------------|-------------------------------------------------
`Couchbase::SERIALIZER_PHP`        | Serialize to/from a PHP object string           
`Couchbase::SERIALIZER_JSON`       | Serialize objects to a JSON structure           
`Couchbase::SERIALIZER_JSON_ARRAY` | Serialize objects to an array of JSON structures

Documents can be optionally compressed automatically as they are stored into the
database. The compression of these objects is configured using the
`OPT_COMPRESSION` option to the `setOption()` function. For example:


```
$couchbase->setOption(Couchbase::OPT_COMPRESSION, Couchbase::COMPRESSION_ZLIB);
```

The list of supported constants and behaviour are described in
[](couchbase-sdk-php-ready.html#table-couchbase-sdk-php-summary-optconstants-compression).

<a id="table-couchbase-sdk-php-summary-optconstants-compression"></a>

Value                           | Value Description                                                
--------------------------------|------------------------------------------------------------------
`Couchbase::COMPRESSION_NONE`   | Don't compress objects                                           
`Couchbase::COMPRESSION_FASTLZ` | Compress the document data using the Fast Lempel-Ziv compression.
`Couchbase::COMPRESSION_ZLIB`   | Compress the document data using the Zlib compression.           

You can also get the current value for a given option using the `getOption()`
function:

<a id="table-couchbase-sdk_php_getoption"></a>

**API Call**     | `$object->getOption($option)`                    
-----------------|--------------------------------------------------
**Asynchronous** | no                                               
**Description**  | Retrieve an option                               
**Returns**      | `scalar` ( Binary object )                       
**Arguments**    |                                                  
**int $option**  | Option controlling connection or server behaviour

<a id="table-couchbase-sdk_php_settimeout"></a>

**API Call**        | `$object->setTimeout($timeout)`                
--------------------|------------------------------------------------
**Asynchronous**    | no                                             
**Description**     | Set the configured timeout value for operations
**Returns**         | `scalar` ; supported values:                   
                    | `scalar`                                       
**Arguments**       |                                                
**scalar $timeout** | The operation timeout specified in microseconds

<a id="table-couchbase-sdk_php_gettimeout"></a>

**API Call**     | `$object->getTimeout()`                                     
-----------------|-------------------------------------------------------------
**Asynchronous** | no                                                          
**Description**  | Get the currently configured timeout value for operations   
**Returns**      | `scalar` ( The operation timeout specified in microseconds )
**Arguments**    |                                                             
                 | None                                                        

<a id="api-reference-connection-version"></a>

## Getting Version Information

To obtain an array containing the version number of each of the servers, use the
`getVersion()` function:

<a id="table-couchbase-sdk_php_getversion"></a>

**API Call**     | `$object->getVersion()`                               
-----------------|-------------------------------------------------------
**Asynchronous** | no                                                    
**Description**  | Returns the versions of all servers in the server pool
**Returns**      | `array` ; supported values:                           
                 | `array`                                               
**Arguments**    |                                                       
                 | None                                                  

Returns an array containing the version number of each of the memcached servers
in the cluster. Please note that this is not the version number of the cluster.

To get the version number for the nodes in the cluster you may do:


```
$cb = new Couchbase("localhost",
                    "Administrator",
                    "secret");
$info = json_decode($cb->getInfo());
foreach ($info->{"nodes"} as $node) {
   print $node->{"hostname"} . " is running " . $node->{"version"} . "\n";
}
```

To obtain the version information for the client library, use the
`getClientVersion()` method:

<a id="table-couchbase-sdk_php_getclientversion"></a>

**API Call**     | `$object->getClientVersion()`            
-----------------|------------------------------------------
**Asynchronous** | no                                       
**Description**  | Returns the version of the client library
**Returns**      | `scalar` ( Binary object )               
**Arguments**    |                                          
                 | None                                     

<a id="api-reference-connection-numreplicas"></a>

## Obtain the Number of Replicas

To obtain a count of the number of configured replicas for a given bucket, use
the `getNumReplicas()` method. You should use in combination with operations
that enforce or monitor the durability of a stored document to determine if the
document has been stored on all the configured replicas.

<a id="table-couchbase-sdk_php_getnumreplicas"></a>

**API Call**                       | `$object->getNumReplicas()`                                               
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Returns the number of replicas for the configured bucket                  
**Returns**                        | `scalar` ( Number of replicas )                                           
**Arguments**                      |                                                                           
                                   | None                                                                      
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

The method returns an integer count of the number of replicas configured for the
Couchbase Server bucket.

<a id="api-reference-store"></a>
