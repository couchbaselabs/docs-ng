# Using the REST API

The Couchbase REST API enables you to manage a Couchbase Server deployment as
well as perform operations such as storing design documents and querying for
results. The REST API conforms to Representational State Transfer (REST)
constraints, in other words, the REST API follows a **RESTful** architecture.
You use the REST API to manage clusters, server nodes, and buckets, and to
retrieve run-time statistics within your Couchbase Server deployment. If you
want to develop your own Couchbase-compatible SDK, you will also use the
REST-API within your library to handle *views*. Views enable you to index and
query data based on functions you define. For more information about views, see
[Views and Indexes](#couchbase-views).

The REST API should *not* be used to read or write data to the server. Data
operations such as `set` and `get` for example, are handled by Couchbase SDKs.
See [Couchbase SDKs](http://couchbase.com/develop).

The REST API accesses several different systems within the Couchbase Server
product.

Please provide RESTful requests; you will not receive any handling instructions,
resource descriptions, nor should you presume any conventions for URI structure
for resources represented. The URIs in the REST API may have a specific URI or
may even appear as RPC or some other architectural style using HTTP operations
and semantics.

In other words, you should build your request starting from Couchbase Cluster
URIs, and be aware that URIs for resources may change from version to version.
Also note that the hierarchies shown here enable your reuse of requests, since
they follow a similar pattern for accessing different parts of the system.

The REST API is built on a number of basic principles:

 * **JSON Responses**

   The Couchbase Management REST API returns many responses as JavaScript Object
   Notation (JSON). On that node, you may find it convenient to read responses in a
   JSON reader. Some responses may have an empty body, but indicate the response
   with standard HTTP codes. For more information, see RFC 4627 (
   [http://www.ietf.org/rfc/rfc4627.txt](http://www.ietf.org/rfc/rfc4627.txt) ) and
   [www.json.org](http://www.json.org).

 * **HTTP Basic Access Authentication**

   The Couchbase Management REST API uses HTTP basic authentication. The
   browser-based [Using the Web Console](#couchbase-admin-web-console) and
   [Command-line Interface for Administration](#couchbase-admin-cmdline) also use
   HTTP basic authentication.

 * **Versatile Server Nodes**

   All server nodes in a cluster share the same properties and can handle any
   requests made via the REST API.; you can make a REST API request on any node in
   a cluster you want to access. If the server node cannot service a request
   directly, due to lack of access to state or some other information, it will
   forward the request to the appropriate server node, retrieve the results, and
   send the results back to the client.

In order to use the REST API you should be aware of the different terms and
concepts discussed in the following sections.

<a id="couchbase-admin-restapi-key-concepts-resources"></a>

## Types of Resources

There are a number of different resources within the Couchbase Server and these
resources will require a different URI/RESTful-endpoint in order to perform an
operations:

 * **Server Nodes**

   A Couchbase Server instance, also known as 'node', is a physical or virtual
   machine running Couchbase Server. Each node is as a member of a cluster.

 * **Cluster/Pool**

   A cluster is a group of one or more nodes; it is a collection of physical
   resources that are grouped together and provide services and a management
   interface. A single default cluster exists for every deployment of Couchbase
   Server. A node, or instance of Couchbase Server, is a member of a cluster.
   Couchbase Server collects run-time statistics for clusters, maintaining an
   overall pool-level data view of counters and periodic metrics of the overall
   system. The Couchbase Management REST API can be used to retrieve historic
   statistics for a cluster.

 * **Buckets**

   A bucket is a logical grouping of data within a cluster. It provides a name
   space for all the related data in an application; therefore you can use the same
   key in two different buckets and they are treated as unique items by Couchbase
   Server.

   Couchbase Server collects run-time statistics for buckets, maintaining an
   overall bucket-level data view of counters and periodic metrics of the overall
   system. Buckets are categorized by storage type: 1) memcached buckets are for
   in-memory, RAM-based information, and 2) Couchbase buckets, which are for
   persisted data.

 * **Views**

   Views enable you to index and query data based on logic you specify. You can
   also use views to perform calculations and aggregations, such as statistics, for
   items in Couchbase Server. For more information, see [Views and
   Indexes](#couchbase-views).

 * **Cross Datacenter Replication (XDCR)**

   Cross Datacenter Replication (XDCR) is new functionality as of Couchbase Server
   2.0. It enables you to automatically replicate data between clusters and between
   data buckets. There are two major benefits of using XDCR as part of your
   Couchbase Server implementation: 1) enables you to restore data from one
   Couchbase cluster to another cluster after system failure. 2) provide copies of
   data on clusters that are physically closer to your end users. For more
   information, see [Cross Datacenter Replication
   (XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-key-concepts-httpheaders"></a>

## HTTP Request Headers

You will use the following HTTP request headers when you create your request:

<a id="table-couchbase-admin-restapi-key-concepts-httpheaders"></a>

Header                               | Supported Values                                            | Description of Use                                                                           | Required                                     
-------------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------
Accept                               | Comma-delimited list of media types or media type patterns. | Indicates to the server what media type(s) this client is prepared to accept.                | Recommended                                  
Authorization                        | `Basic` plus username and password (per RFC 2617).          | Identifies the authorized user making this request.                                          | No, unless secured                           
Content-Length                       | Body Length (in bytes)                                      | Describes the size of the message body.                                                      | Yes, on requests that contain a message body.
Content-Type                         | Content type                                                | Describes the representation and syntax of the request message body.                         | Yes, on requests that contain a message body.
Host                                 | Origin hostname                                             | Required to allow support of multiple origin hosts at a single IP address.                   | All requests                                 
X-YYYYY-Client-Specification-Version | String                                                      | Declares the specification version of the YYYYY API that this client was programmed against. | No                                           

<a id="couchbase-admin-restapi-key-concepts-httpstatus"></a>

## HTTP Status Codes

The Couchbase Server will return one of the following HTTP status codes in
response to your REST API request:

<a id="table-couchbase-admin-restapi-key-concepts-httpstatus"></a>

HTTP Status               | Description                                                                                                                                                                                                                                                               
--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
200 OK                    | Successful request and an HTTP response body returns. If this creates a new resource with a URI, the 200 status will also have a location header containing the canonical URI for the newly created resource.                                                             
201 Created               | Request to create a new resource is successful, but no HTTP response body returns. The URI for the newly created resource returns with the status code.                                                                                                                   
202 Accepted              | The request is accepted for processing, but processing is not complete. Per HTTP/1.1, the response, if any, SHOULD include an indication of the request's current status, and either a pointer to a status monitor or some estimate of when the request will be fulfilled.
204 No Content            | The server fulfilled the request, but does not need to return a response body.                                                                                                                                                                                            
400 Bad Request           | The request could not be processed because it contains missing or invalid information, such as validation error on an input field, a missing required value, and so on.                                                                                                   
401 Unauthorized          | The credentials provided with this request are missing or invalid.                                                                                                                                                                                                        
403 Forbidden             | The server recognized the given credentials, but you do not possess proper access to perform this request.                                                                                                                                                                
404 Not Found             | URI you provided in a request does not exist.                                                                                                                                                                                                                             
405 Method Not Allowed    | The HTTP verb specified in the request (DELETE, GET, HEAD, POST, PUT) is not supported for this URI.                                                                                                                                                                      
406 Not Acceptable        | The resource identified by this request cannot create a response corresponding to one of the media types in the Accept header of the request.                                                                                                                             
409 Conflict              | A create or update request could not be completed, because it would cause a conflict in the current state of the resources supported by the server. For example, an attempt to create a new resource with a unique identifier already assigned to some existing resource. 
500 Internal Server Error | The server encountered an unexpected condition which prevented it from fulfilling the request.                                                                                                                                                                            
501 Not Implemented       | The server does not currently support the functionality required to fulfill the request.                                                                                                                                                                                  
503 Service Unavailable   | The server is currently unable to handle the request due to temporary overloading or maintenance of the server.                                                                                                                                                           

<a id="couchbase-admin-restapi-launching-console"></a>

## Using the Couchbase Administrative Console

The Couchbase Administrative Console uses many of the same REST API endpoints
you would use for a REST API request. This is especially for administrative
tasks such as creating a new bucket, adding a node to a cluster, or changing
cluster settings.

[For a list of supported browsers, seeSystem
Requirements](#couchbase-getting-started-prepare). For the Couchbase Web
Console, a separate UI hierarchy is served from each node of the system (though
asking for the root "/" would likely return a redirect to the user agent). To
launch the Couchbase Web Console, point your browser to the appropriate host and
port, for instance on your development machine: `http://localhost:8091`

The operation and interface for the console is described in [Using the Web
Console](#couchbase-admin-web-console). For most of the administrative
operations described in this chapter for the REST-API, you can perform the
functional equivalent in Couchbase Web Console.

<a id="couchbase-admin-restapi-node-management"></a>

## Managing Couchbase Nodes

A Couchbase Server instance, also known as 'node', is a physical or virtual
machine running Couchbase Server. Each node is as a member of a cluster.

To view information about nodes that exist in a Couchbase Cluster, you use this
request:


```
shell> curl -u admin:password 10.4.2.4:8091/pools/nodes
```

Couchbase server returns this response in JSON:


```
{"storageTotals":
                    {
                    "ram":
                    {
                    "quotaUsed":10246684672.0,
                    "usedByData":68584936,
                    "total":12396216320.0,
                    "quotaTotal":10246684672.0,
                    "used":4347842560.0},
                    "hdd":
                          {"usedByData":2560504,
                          "total":112654917632.0,
                          "quotaTotal":112654917632.0,
                          "used":10138942586.0,
                          "free":102515975046.0}
                     },
                     "name":"nodes",
                     "alerts":[],
                     "alertsSilenceURL":"/controller/resetAlerts?token=0",
                     "nodes":
                            [{"systemStats":
                                      {
                                      "cpu_utilization_rate":2.5,
                                      "swap_total":6140452864.0,
                                      "swap_used":0
                                      },
                             "interestingStats":
                                      {
                                      "curr_items":0,
                                      "curr_items_tot":0,
                                      "vb_replica_curr_items":0
                                      },
                              "uptime":"5782",
                              "memoryTotal":6198108160.0,
                              "memoryFree":3777110016.0,
                              "mcdMemoryReserved":4728,
                              "mcdMemoryAllocated":4728,
                              "clusterMembership":"active",
                              "status":"healthy",
                              "hostname":"10.4.2.5:8091",
                              "clusterCompatibility":1,
                              "version":"1.8.1-937-rel-community",
                              "os":"x86_64-unknown-linux-gnu",
                              "ports":
                                      {
                                      "proxy":11211,
                                      "direct":11210
                                      }
                            .......

                                  }],
                       "buckets":
                                {"uri":"/pools/nodes/buckets?v=80502896" },
                                "controllers":{"addNode":{"uri":"/controller/addNode"},
                                "rebalance":{"uri":"/controller/rebalance"},
                                "failOver":{"uri":"/controller/failOver"},
                                "reAddNode":{"uri":"/controller/reAddNode"},
                                "ejectNode":{"uri":"/controller/ejectNode"},
                                "testWorkload":{"uri":"/pools/nodes/controller/testWorkload"}},
                                "balanced":true,
                                "failoverWarnings":["failoverNeeded","softNodesNeeded"],
                                "rebalanceStatus":"none",
                                "rebalanceProgressUri":"/pools/nodes/rebalanceProgress",
                                "stopRebalanceUri":"/controller/stopRebalance",
                                "nodeStatusesUri":"/nodeStatuses",
                                "stats":{"uri":"/pools/nodes/stats"},
                                "counters":{"rebalance_success":1,"rebalance_start":1},
                                "stopRebalanceIsSafe":true}
```

<a id="couchbase-admin-restapi-bucket-stats-on-node"></a>

### Retrieving Statistics from Nodes

To retrieve statistics about a node, you can first retrieve a list of nodes in a
cluster with this request:


```
shell> curl -u Admin:password http://10.4.2.4:8091/pools/default/buckets/default/nodes
```

You can send this request using the IP address and port for any node in the
cluster. This sends the following HTTP request:


```
GET /pools/default/buckets/default/nodes HTTP/1.1
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If Couchbase Server successfully handles the request, you will get a response
similar to the following example:


```
{"servers":[
  {"hostname":"10.4.2.6:8091",
  "uri":"/pools/default/buckets/default/nodes/10.4.2.6%3A8091",
  "stats":
      {"uri":"/pools/default/buckets/default/nodes/10.4.2.6%3A8091/stats"}}
    ....
```

You can then make a REST request to the specific IP address and port of given
node shown in the response and add `/stats` as the endpoint:


```
shell> curl -u Administrator:password http://10.4.2.4:8091/pools/default/buckets/default/nodes/10.4.2.4%3A8091/stats
```

This sends the following HTTP request:


```
GET /pools/default/buckets/default/nodes/10.4.2.4%3A8091/stats HTTP/1.1
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If Couchbase Server successfully handles the reuqest, you will get a response
similar to the following example:


```
{"hostname":"10.4.2.4:8091","hot_keys":[{"name":"[2012-11-05::3:47:01]"
....
"samplesCount":60,"isPersistent":true,"lastTStamp":1352922180718,"interval":1000}}
```

The statistics returned will be for the individual bucket associated with that
node.

<a id="couchbase-admin-restapi-provisioning"></a>

### Provisioning a Node

Creating a new cluster or adding a node to a cluster is called `provisioning`.
You need to:

 * Create a new node by installing a new Couchbase Server.

 * Configure disk path for the node.

 * Optionally configure memory quota for each node within the cluster. Any nodes
   you add to a cluster will inherit the configured memory quota. The default
   memory quota for the first node in a cluster is 60% of the physical RAM.

 * Add the node to your existing cluster.

Whether you are adding a node to an existing cluster or starting a new cluster,
the node's disk path must be configured. Your next steps depends on whether you
create a new cluster or you want to add a node to an existing cluster. If you
create a new cluster you will need to secure it by providing an administrative
username and password. If you add a node to an existing cluster you will need
the URI and credentials to use the REST API with that cluster.

<a id="couchbase-admin-restapi-provisioning-diskpath"></a>

### Configuring Index Path for a Node

The path for the index files can be configured through the use of the
`index_path` parameter:

Example as follows:


```
shell> curl -X POST -u admin:password \
    -d index_path=/var/tmp/text-index \
    http://localhost:8091/nodes/self/controller/settings
```

As a raw HTTP request:


```
POST /nodes/self/controller/settings HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx path=/var/tmp/test
```

The HTTP response will contain the response code and optional error message:


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 0
```

As of Couchbase Server 2.0.1 if you try to set the data path at this endpoint,
you will receive this error:


```
ERROR: unable to init 10.3.4.23 (400) Bad Request
{u'error': u'Changing data of nodes that are part of provisioned cluster is not supported'}
```

<a id="couchbase-admin-restapi-node-username-pass"></a>

### Setting Username and Password for a Node

While this can be done at any time for a cluster, it is typically the last step
you complete when you add node into being a new cluster. The response will
indicate the new base URI if the parameters are valid. Clients will want to send
a new request for cluster information based on this response.

For example, using `curl` :


```
shell> curl -u admin:password -d username=Administrator \
    -d password=letmein \
    -d port=8091 \
    http://localhost:8091/settings/web
```

The raw HTTP request:


```
POST /settings/web HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx
username=Administrator&password=letmein&port=8091
```

The corresponding HTTP response data:


```
HTTP/1.1 200 OK
Content-Type: application/json
Server: Couchbase Server 2.0
Pragma: no-cache
Date: Mon, 09 Aug 2010 18:50:00 GMT
Content-Type: application/json
Content-Length: 39
Cache-Control: no-cache no-store max-age=0
{"newBaseUri":"http://localhost:8091/"}
```

Note that even if it is not to be changed, the port number must be specified
when you update username/password.

<a id="couchbase-admin-restapi-cluster-memory-quota"></a>

### Configuring Node Memory Quota

The node memory quota configures how much RAM to be allocated to Couchbase for
every node within the cluster.

<a id="table-couchbase-admin-restapi-settings-cluster-set-param-post"></a>

**Method**                  | `POST /pools/default`                              
----------------------------|----------------------------------------------------
**Request Data**            | Payload with memory quota setting                  
**Response Data**           | Empty                                              
**Authentication Required** | yes                                                
**Return Codes**            |                                                    
200                         | OK                                                 
400                         | Bad Request JSON: The RAM Quota value is too small.
401                         | Unauthorized                                       

For example, to set the memory quota for a cluster at 400MB:


```
shell> curl -X POST -u admin:password -d memoryQuota=400 http://localhost:8091/pools/default
```

As a raw HTTP request:


```
POST /pools/default HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx
memoryQuota=400
```

The HTTP response will contain the response code and optional error message:


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 0
```

<a id="couchbase-admin-restapi-hostname"></a>

### Providing Hostnames for Nodes

There are several ways you can provide hostnames for Couchbase 2.1+. You can
provide a hostname when you install a Couchbase Server 2.1 node, when you add it
to an existing cluster for online upgrade, or via a REST-API call. If a node
restarts, any hostname you establish will be used. You cannot provide a hostname
for a node that is already part of a Couchbase cluster; the server will reject
the request and return `error 400 reason: unknown ["Renaming is disallowed for
nodes that are already part of a cluster"]`.

To see the specific REST request, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

For Couchbase Server 2.0.1 and earlier you must follow a manual process where
you edit config files for each node which we describe below. For more
information, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

<a id="couchbase-admin-restapi-failover-node"></a>

### Manually Failing Over a Node

You can use this request to failover a node in the cluster. When you failover a
node, it indicates the node is no longer available in a cluster and replicated
data at another node should be available to clients. You can also choose to
perform node failover using the Web Console, for more information, see
[Couchbase Server Manual, Initiating Node
Failover](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-failover-manual.html).

Using the REST-API endpoint `host:port/controller/failOver`, provide your
administrative credentials and the parameter `optNode` which is an internal name
for the node:


```
> curl -v -X POST -u admin:password http://10.3.3.61:8091/controller/failOver -d otpNode=ns_2@10.3.3.63
```

The HTTP request will be similar to the following:


```
POST /controller/failOver HTTP/1.1
Authorization: Basic
```

Upon success, Couchbase Server will send a response as follows:


```
HTTP/1.1 200 OK
HTTP/1.1 200 OK
```

If you try to failover a node that does not exist in the cluster, you will get a
HTTP 404 error. To learn more about how to retrieve `optNode` information for
the nodes in a cluster, see [Viewing Cluster
Details](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-viewing-pool-info.html).

<a id="couchbase-admin-restapi-bucketops"></a>

## Managing Buckets

The bucket management and configuration REST API endpoints are provided to fine
level control over the individual buckets in the cluster, their configuration,
and specific operations such as `FLUSH`.

<a id="couchbase-admin-restapi-bucket-info"></a>

### Viewing Buckets and Bucket Operations

If you create your own SDK for Couchbase, you can use either the proxy path or
the direct path to connect to Couchbase Server. If your SDK uses the direct
path, your SDK will not be insulated from most reconfiguration changes to the
bucket. This means your SDK will need to either poll the bucket's URI or connect
to the streamingUri to receive updates when the bucket configuration changes.
Bucket configuration can happen for instance, when nodes are added, removed, or
if a node fails.

To retrieve information for all bucket for cluster:


```
shell> curl -u Administrator:password http://10.4.2.5:8091/pools/default/buckets
```


```
GET /pools/default/buckets
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
HTTP/1.1 200 OK
Server: Couchbase Server 1.6.0
Pragma: no-cache
Date: Wed, 03 Nov 2010 18:12:19 GMT
Content-Type: application/json
Content-Length: nnn
Cache-Control: no-cache no-store max-age=0
[
    {
        "name": "default",
        "bucketType": "couchbase",
        "authType": "sasl",
        "saslPassword": "",
        "proxyPort": 0,
        "uri": "/pools/default/buckets/default",
        "streamingUri": "/pools/default/bucketsStreaming/default",
        "flushCacheUri": "/pools/default/buckets/default/controller/doFlush",
        "nodes": [
            {
                "uptime": "784657",
                "memoryTotal": 8453197824.0,
                "memoryFree": 1191157760,
                "mcdMemoryReserved": 6449,
                "mcdMemoryAllocated": 6449,
                "clusterMembership": "active",
                "status": "unhealthy",
                "hostname": "10.1.15.148:8091",
                "version": "1.6.0",
                "os": "windows",
                "ports": {
                    "proxy": 11211,
                    "direct": 11210
                }
            }
        ],
        "stats": {
            "uri": "/pools/default/buckets/default/stats"
        },
        "nodeLocator": "vbucket",
        "vBucketServerMap": {
            "hashAlgorithm": "CRC",
            "numReplicas": 1,
            "serverList": [
                "192.168.1.2:11210"
            ],
      "vBucketMap": [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ], [ 0, -1 ], [ 0, -1 ], [ 0, -1 ]]
  },
        "replicaNumber": 1,
        "quota": {
            "ram": 104857600,
            "rawRAM": 104857600
        },
        "basicStats": {
            "quotaPercentUsed": 24.360397338867188,
            "opsPerSec": 0,
            "diskFetches": 0,
            "itemCount": 0,
            "diskUsed": 0,
            "memUsed": 25543728
        }
    },
    {
        "name": "test-application",
        "bucketType": "memcached",
        "authType": "sasl",
        "saslPassword": "",
        "proxyPort": 0,
        "uri": "/pools/default/buckets/test-application",
        "streamingUri": "/pools/default/bucketsStreaming/test-application",
        "flushCacheUri": "/pools/default/buckets/test-application/controller/doFlush",
        "nodes": [
            {
                "uptime": "784657",
                "memoryTotal": 8453197824.0,
                "memoryFree": 1191157760,
                "mcdMemoryReserved": 6449,
                "mcdMemoryAllocated": 6449,
                "clusterMembership": "active",
                "status": "healthy",
                "hostname": "192.168.1.2:8091",
                "version": "1.6.0",
                "os": "windows",
                "ports": {
                    "proxy": 11211,
                    "direct": 11210
                }
            }
        ],
        "stats": {
            "uri": "/pools/default/buckets/test-application/stats"
        },
        "nodeLocator": "ketama",
        "replicaNumber": 0,
        "quota": {
            "ram": 67108864,
            "rawRAM": 67108864
        },
        "basicStats": {
            "quotaPercentUsed": 4.064150154590607,
            "opsPerSec": 0,
            "hitRatio": 0,
            "itemCount": 1385,
            "diskUsed": 0,
            "memUsed": 2727405
        }
    }
]
```

<a id="restapi-named-bucket-info"></a>

### Getting Individual Bucket Information

To retrieve information for a single bucket associated with a cluster, you make
this request, where the last default can be replaced with the name of a specific
bucket, if you have named buckets:


```
shell> curl -u Administrator:password \
    http://10.4.2.5:8091/pools/default/buckets/default
```

Couchbase Server returns a large JSON document with bucket information including
internal vBucket information:


```
{
    "name":"default",
    "bucketType":"membase",
    "authType":"sasl",
    "saslPassword":"",
    "proxyPort":0,
    "uri":"/pools/default/buckets/default",
    "streamingUri":"/pools/default/bucketsStreaming/default",
    "flushCacheUri":"/pools/default/buckets/default/controller/doFlush",
    "nodes":[
        {
            "systemStats":
            {
                "cpu_utilization_rate":1.5151515151515151,
                "swap_total":6140452864.0,
                "swap_used":0
            },

                ......

            "replicaNumber":1,
            "quota":
            {
                "ram":10246684672.0,
                "rawRAM":5123342336.0
            },
            "basicStats":
            {
                "quotaPercentUsed":0.5281477251650123,
                "opsPerSec":0,"diskFetches":0,
                "itemCount":0,
                "diskUsed":7518856,
                "memUsed":54117632
            }
        }
    ]
}
```


```
GET http://10.4.2.5:8091/pools/default/buckets/default?_=1340926633052
```


```
HTTP/1.1 200 OK
```

<a id="couchbase-admin-restapi-bucket-stats"></a>

### Getting Bucket Statistics

You can use the REST API to get statistics with the at the bucket level from
Couchbase Server. Your request URL should be taken from stats.uri property of a
bucket response. By default this request returns stats samples for the last
minute and for heavily used keys. You use provide additional query parameters in
a request to get a more detailed level of information:

 * zoom - stats zoom level (minute | hour | day | week | month | year)

 * resampleForUI - pass 1 if you need 60 samples

 * haveTStamp - request sending only samples newer than given timestamp


```
GET /pools/default/stats
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{
    "op": {
        "samples": {
            "hit_ratio": [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            "ep_cache_miss_rate": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0 ],


                .....


            "samplesCount": 60,
            "isPersistent": true,
            "lastTStamp":513777166.0,
            "interval": 1000
        },
        "hot_keys": [
            {
                "name": "48697",
                "ops": 0.0009276437847866419
            },
            {
                "name": "8487",
                "ops": 0.0009276437847866419
            },
            {
                "name": "77262",
                "ops": 0.0009276437847866419
            },
            {
                "name": "58495",
                "ops": 0.0009276437847866419
            },
            {
                "name": "21003",
                "ops": 0.0009276437847866419
            },
            {
                "name": "26850",
                "ops": 0.0009276437847866419
            },
            {
                "name": "73717",
                "ops": 0.0009276437847866419
            },
            {
                "name": "86218",
                "ops": 0.0009276437847866419
            },
            {
                "name": "80344",
                "ops": 0.0009276437847866419
            },
            {
                "name": "83457",
                "ops": 0.0009276437847866419
            }
        ]
    }
}
```

<a id="couchbase-admin-restapi-named-bucket-streaming-uri"></a>

### Using the Bucket Streaming URI

The individual bucket request is exactly the same as what would be obtained from
the item in the array for the entire buckets list described previously. The
streamingUri is exactly the same except it streams HTTP chunks using chunked
encoding. A response of "\n\n\n\n" delimits chunks. This will likely be
converted to a "zero chunk" in a future release of this API, and thus the
behavior of the streamingUri should be considered evolving.


```
GET /pools/default/buckets/default
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{
  "name": "default",
  "bucketType": "couchbase",
  "authType": "sasl",
  "saslPassword": "",
  "proxyPort": 0,
  "uri": "/pools/default/buckets/default",
  "streamingUri": "/pools/default/bucketsStreaming/default",
  "flushCacheUri": "/pools/default/buckets/default/controller/doFlush",
  "nodes": [
    {
      "uptime": "308",
      "memoryTotal": 3940818944.0,
      "memoryFree": 1608724480,
      "mcdMemoryReserved": 3006,
      "mcdMemoryAllocated": 3006,
      "replication": 1.0,
      "clusterMembership": "active",
      "status": "healthy",
      "hostname": "172.25.0.2:8091",
      "clusterCompatibility": 1,
      "version": "1.6.4r_107_g49a149d",
      "os": "i486-pc-linux-gnu",
      "ports": {
        "proxy": 11211,
        "direct": 11210
      }
    },
    {
      "uptime": "308",
      "memoryTotal": 3940818944.0,
      "memoryFree": 1608724480,
      "mcdMemoryReserved": 3006,
      "mcdMemoryAllocated": 3006,
      "replication": 1.0,
      "clusterMembership": "active",
      "status": "healthy",
      "hostname": "172.25.0.3:8091",
      "clusterCompatibility": 1,
      "version": "1.6.4r_107_g49a149d",
      "os": "i486-pc-linux-gnu",
      "ports": {
        "proxy": 11211,
        "direct": 11210
      }
    },
    {
      "uptime": "308",
      "memoryTotal": 3940818944.0,
      "memoryFree": 1608597504,
      "mcdMemoryReserved": 3006,
      "mcdMemoryAllocated": 3006,
      "replication": 1.0,
      "clusterMembership": "active",
      "status": "healthy",
      "hostname": "172.25.0.4:8091",
      "clusterCompatibility": 1,
      "version": "1.6.4r_107_g49a149d",
      "os": "i486-pc-linux-gnu",
      "ports": {
        "proxy": 11211,
        "direct": 11210
      }
    }
  ],
  "stats": {
    "uri": "/pools/default/buckets/default/stats"
  },
  "nodeLocator": "vbucket",
  "vBucketServerMap": {
    "hashAlgorithm": "CRC",
    "numReplicas": 1,
    "serverList": [
      "172.25.0.2:11210",
      "172.25.0.3:11210",
      "172.25.0.4:11210"
    ],
    "vBucketMap": [
      [1,0],
      [2,0],
      [1,2],
      [2,1],
      [1,2],
      [0,2],
      [0,1],
      [0,1]
    ]
  },
  "replicaNumber": 1,
  "quota": {
    "ram": 1887436800,
    "rawRAM":145600
  },
  "basicStats": {
    "quotaPercentUsed": 14.706055058373344,
    "opsPerSec": 0,
    "diskFetches": 0,
    "itemCount": 65125,
    "diskUsed": 139132928,
    "memUsed": 277567495
  }
}
```

<a id="couchbase-admin-restapi-creating-buckets"></a>

### Creating and Editing Data Buckets

You can create a new bucket with a POST command sent to the URI for buckets in a
cluster. This can be used to create either a Couchbase or a Memcached type
bucket. The bucket name cannot have a leading underscore.

To create a new Couchbase bucket, or edit the existing parameters for an
existing bucket, you can send a `POST` to the REST API endpoint. You can also
use this same endpoint to get a list of buckets that exist for a cluster.

Be aware that when you edit bucket properties, if you do not specify an existing
bucket property Couchbase Server may reset this the property to be the default.
So even if you do not intend to change a certain property when you edit a
bucket, you should specify the existing value to avoid this behavior.

This REST API will return a successful response when preliminary files for a
data bucket are created on one node. Because you may be using a multi-node
cluster, bucket creation may not yet be complete for all nodes when a response
is sent. Therefore it is possible that the bucket is not available for
operations immediately after this REST call successful returns.

To ensure a bucket is available the recommended approach is try to read a key
from the bucket. If you receive a 'key not found' error, or the document for the
key, the bucket exists and is available to all nodes in a cluster. You can do
this via a Couchbase SDK with any node in the cluster. See [Couchbase Developer
Guide 2.0, Performing Connect, Set and
Get](http://www.couchbase.com/docs/couchbase-devguide-2.0/cb-basic-connect-get-set.html).

<a id="table-couchbase-admin-restapi-creating-buckets"></a>

**Method**                    | `POST /pools/default/buckets`                                                                                                                                                                                                                                                                                                                             
------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Request Data**              | List of payload parameters for the new bucket                                                                                                                                                                                                                                                                                                             
**Response Data**             | JSON of the bucket confirmation or error condition                                                                                                                                                                                                                                                                                                        
**Authentication Required**   | yes                                                                                                                                                                                                                                                                                                                                                       
**Payload Arguments**         |                                                                                                                                                                                                                                                                                                                                                           
`authType`                    | Required parameter. Type of authorization to be enabled for the new bucket as a string. Defaults to blank password if not specified. "sasl" enables authentication. "none" disables authentication.                                                                                                                                                       
`bucketType`                  | Required parameter. Type of bucket to be created. String value. "memcached" configures as Memcached bucket. "couchbase" configures as Couchbase bucket                                                                                                                                                                                                    
`flushEnabled`                | Optional parameter. Enables the 'flush all' functionality on the specified bucket. Boolean. 1 enables flush all support, 0 disables flush all support. Defaults to 0.                                                                                                                                                                                     
`name`                        | Required parameter. Name for new bucket.                                                                                                                                                                                                                                                                                                                  
`parallelDBAndViewCompaction` | Optional parameter. String value. Indicates whether database and view files on disk can be compacted simultaneously. Defaults to "false."                                                                                                                                                                                                                 
`proxyPort`                   | Required parameter. Numeric. Proxy port on which the bucket communicates. Must be a valid network port which is not already in use. You must provide a valid port number if the authorization type is not SASL.                                                                                                                                           
`ramQuotaMB`                  | Required parameter. RAM Quota for new bucket in MB. Numeric. The minimum you can specify is 100, and the maximum can only be as great as the memory quota established for the node. If other buckets are associated with a node, RAM Quota can only be as large as the amount memory remaining for the node, accounting for the other bucket memory quota.
`replicaIndex`                | Optional parameter. Boolean. 1 enable replica indexes for replica bucket data while 0 disables. Default of 1.                                                                                                                                                                                                                                             
`replicaNumber`               | Optional parameter. Numeric. Number of replicas to be configured for this bucket. Required parameter when creating a Couchbase bucket. Default 1, minimum 0, maximum 3.                                                                                                                                                                                   
`saslPassword`                | Optional Parameter. String. Password for SASL authentication. Required if SASL authentication has been enabled.                                                                                                                                                                                                                                           
`threadsNumber`               | Optional Parameter. Integer from 2 to 8. Change the number of concurrent readers and writers for the data bucket. For detailed information about this feature, see [Using Multi- Readers and Writers](#couchbase-admin-tasks-mrw).                                                                                                                        
**Return Codes**              |                                                                                                                                                                                                                                                                                                                                                           
202                           | Accepted                                                                                                                                                                                                                                                                                                                                                  
204                           | Bad Request JSON with errors in the form of {"errors": {.... }} name: Bucket with given name already exists ramQuotaMB: RAM Quota is too large or too small replicaNumber: Must be specified and must be a non-negative integer proxyPort: port is invalid, port is already in use                                                                        
404                           | Object Not Found                                                                                                                                                                                                                                                                                                                                          

When you create a bucket you must provide the `authType` parameter:

 * If you set `authType` to `none`, then you must specify a proxyPort number.

 * If you set `authType` to `sasl`, then you may optionally provide a
   `saslPassword` parameter.

The `ramQuotaMB` parameter specifies how much memory, in megabytes, you want to
allocate to each node for the bucket. The minimum supported value is 100MB.

 * If the items stored in a memcached bucket take space beyond the `ramQuotaMB`,
   Couchbase Sever typically will evict items on least-requested-item basis.
   Couchbase Server may evict other infrequently used items depending on object
   size, or whether or not an item is being referenced.

 * In the case of Couchbase buckets, the system may return temporary failures if
   the `ramQuotaMB` is reached. The system will try to keep 25% of the available
   ramQuotaMB free for new items by ejecting old items from occupying memory. In
   the event these items are later requested, they will be retrieved from disk.

For example:


```
shell> curl -X POST -u admin:password -d name=newbucket -d ramQuotaMB=200 -d authType=none \
     -d replicaNumber=2 -d proxyPort=11215 http://localhost:8091/pools/default/buckets
```

The parameters for configuring the bucket are provided as payload data, with
each parameter and value provided as a key/value pair, separated by an
ampersand.

The HTTP request should include the parameters setting in the payload of the
`POST` request:


```
POST /pools/default/buckets
HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx
name=newbucket&ramQuotaMB=20&authType=none&replicaNumber=2&proxyPort=11215
```

If the bucket creation was successful, HTTP response 202 (Accepted) will be
returned with empty content.


```
202 Accepted
```

If the bucket could not be created, because the parameter was missing or
incorrect, HTTP response 400 will be returned, with a JSON payload containing
the error reason.

<a id="couchbase-admin-restapi-getting-bucket-request"></a>

### Getting Bucket Configuration

To obtain the information about an existing bucket, use the main REST API bucket
endpoint with the bucket name. For example:


```
GET /pools/default/buckets/bucketname
```


```
HTTP/1.1 200 OK
Content-Type: application/com.couchbase.store+json
Content-Length: nnn
{
    "name" : "Another bucket",
    "bucketRules" :
    {
        "cacheRange" :
        {
            "min" : 1,
            "max" : 599
        },
        "replicationFactor" : 2
    }
    "nodes" : [
        {
            "hostname" : "10.0.1.20",
            "uri" : "/addresses/10.0.1.20",
            "status" : "healthy",
            "ports" :
            {
                "routing" : 11211,
                "kvcache" :1
            }
        },
        {
            "hostname" : "10.0.1.21",
            "uri" : "/addresses/10.0.1.21",
            "status" : "healthy",
            "ports" :
            {
                "routing" : 11211,
                "kvcache" :1
            }
        }
    ]
}
```

Clients MUST use the nodes list from the bucket, not the pool to indicate which
are the appropriate nodes to connect to.

<a id="couchbase-admin-restapi-modifying-bucket-properties"></a>

### Modifying Bucket Parameters

You can modify existing bucket parameters by posting the updated parameters used
to create the bucket to the bucket's URI. Do not omit a parameter in your
request since this is equivalent to not setting it in many cases. We recommend
you do a request to get current bucket settings, make modifications as needed
and then make your POST request to the bucket URI.

For example, to edit the bucket `customer` :


```
shell> curl -v -X POST -u Administrator:Password -d name=customer \
    -d flushEnabled=0 -d replicaNumber=1 -d authType=none \
    -d ramQuotaMB=200 -d proxyPort=11212 \
     http://localhost:8091/pools/default/buckets/customer
```

[Available parameters are identical to those available when creating a bucket.
Seebucket parameters](#table-couchbase-admin-restapi-creating-buckets).

If the request is successful, HTTP response 200 will be returned with an empty
data content.

You cannot change the name of a bucket via the REST API.

<a id="couchbase-admin-restapi-bucket-memory-quota"></a>

### Increasing the Memory Quota for a Bucket

Increasing a bucket's ramQuotaMB from the current level. Note, the system will
not let you decrease the ramQuotaMB for a couchbase bucket type and memcached
bucket types will be flushed when the ramQuotaMB is changed:

As of 1.6.0, there are some known issues with changing the ramQuotaMB for
memcached bucket types.

Example of a request:


```
shell> curl -X POST -u admin:password -d ramQuotaMB=25 -d authType=none \
    -d proxyPort=11215 http://localhost:8091/pools/default/buckets/newbucket
```

The response will be 202, indicating the quota will be changed asynchronously
throughout the servers in the cluster. An example:


```
HTTP/1.1 202 OK
Server: Couchbase Server 1.6.0
Pragma: no-cache
Date: Wed, 29 Sep 2010 20:01:37 GMT
Content-Length: 0
Cache-Control: no-cache no-store max-age=0
```

<a id="couchbase-admin-restapi-bucket-authentication"></a>

### Changing Bucket Authentication

Changing a bucket from port based authentication to SASL authentication can be
achieved by changing the active bucket configuration. You must specify the
existing configuration parameters and the changed authentication parameters in
the request:


```
shell> curl -X POST -u admin:password -d ramQuotaMB=130 -d authType=sasl \
    -d saslPassword=letmein \
    http://localhost:8091/pools/default/buckets/acache
```

<a id="couchbase-admin-rest-compacting-bucket"></a>

### Compacting Bucket Data and Indexes

Couchbase Server will write all data that you append, update and delete as files
on disk. This process can eventually lead to gaps in the data file, particularly
when you delete data. Be aware the server also writes index files in a
sequential format based on appending new results in the index. You can reclaim
the empty gaps in all data files by performing a process called compaction. In
both the case of data files and index files, you will want to perform frequent
compaction of the files on disk to help reclaim disk space and reduce disk
fragmentation. For more general information on this administrative task, see
[Database and View Compaction](#couchbase-admin-tasks-compaction).

**Compacting Data Buckets and Indexes**

To compact data files for a given bucket as well as any indexes associated with
that bucket, you perform a request as follows:


```
shell> curl -i -v -X POST -u Administrator:password http://[ip]:[port]/pools/default/buckets/[bucket-name]/controller/compactBucket
```

Where you provide the ip and port for a node that accesses the bucket as well as
the bucket name. You will also need to provide administrative credentials for
that node in the cluster. To stop bucket compaction, you issue this request:


```
shell> curl -i -v -X POST -u Administrator:password http://[ip]:[port]/pools/default/buckets/[bucket-name]/controller/cancelBucketCompaction
```

**Compacting Spatial Views**

If you have spatial views configured within your dataset, these are not
automatically compacted for you. Instead, you must manually compact each spatial
view through the REST API.

To do this, you must call the spatial compaction routine at the URL format:


```
http://127.0.0.1:9500/BUCKETNAME/_design/DDOCNAME/_spatial/_compact
```

This URL contains the following special information:

 * `127.0.0.1:9500`

   The port number, 9500, is unique to the spatial indexing system.

 * `BUCKETNAME`

   The `BUCKETNAME` is the name of the bucket in which the design document is
   configured.

 * `DDOCNAME`

   The name of the design document that contains the spatial index or indexes that
   you want to compact.

For example, you can send a request using `curl` :


```
shell> curl -X POST \
    'http://127.0.0.1:9500/default/_design/dev_test_spatial_compaction/_spatial/_compact'
    -H 'Content-type: application/json'
```

<a id="couchbase-admin-restapi-deleting-bucket"></a>

### Deleting a Bucket

<a id="table-couchbase-admin-restapi-deleting-bucket-delete"></a>

**Method**                  | `DELETE /pools/default/buckets/bucket_name` 
----------------------------|---------------------------------------------
**Request Data**            | None                                        
**Response Data**           | None                                        
**Authentication Required** | yes                                         
                            | **Return Codes**                            
200                         | OK Bucket Deleted on all nodes              
401                         | Unauthorized                                
404                         | Object Not Found                            
500                         | Bucket could not be deleted on all nodes    
503                         | Buckets cannot be deleted during a rebalance

This operation is data destructive.The service makes no attempt to double check
with the user. It simply moves forward. Clients applications using this are
advised to double check with the end user before sending such a request.

To delete a bucket, you supply the URL of the Couchbase bucket using the
`DELETE` operation. For example:


```
DELETE /pools/default/buckets/default
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
```

Bucket deletion is a synchronous operation but because the cluster may include a
number of nodes, they may not all be able to delete the bucket. If all the nodes
delete the bucket within the standard timeout of 30 seconds, `200` will be
returned. If the bucket cannot be deleted on all nodes within the 30 second
timeout, a `500` is returned.

Further requests to delete the bucket will return a `404` error. Creating a new
bucket with the same name may return an error that the bucket is still being
deleted.

<a id="couchbase-admin-restapi-flushing-bucket"></a>

### Flushing a Bucket

This operation is data destructive. The service makes no attempt to confirm or
double check the request. Client applications using this are advised to double
check with the end user before sending such a request. You can control and limit
the ability to flush individual buckets by setting the `flushEnabled` parameter
on a bucket in Couchbase Web Console or via `cbepctl flush_param`.

For information about changing this setting in the Web Console, see [Viewing
Data Buckets](#couchbase-admin-web-console-data-buckets). For information about
flushing data buckets via REST, see [Flushing a
Bucket](#couchbase-admin-restapi-flushing-bucket).

The `doFlush` operation empties the contents of the specified bucket, deleting
all stored data. The operation will only succeed if flush is enabled on
configured bucket. The format of the request is the URL of the REST endpoint
using the `POST` HTTP operation:


```
http://localhost:8091/pools/default/buckets/default/controller/doFlush
```

For example, using `curl` :


```
shell> curl -X POST 'http://Administrator:Password@localhost:8091/pools/default/buckets/default/controller/doFlush'
```

The equivalent HTTP protocol request:


```
POST /pools/default/buckets/default/controller/doFlush
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
```

Parameters and payload data are ignored, but the request must including the
authorization header if the system has been secured.

If flushing is disable for the specified bucket, a 400 response will be returned
with the bucket status:


```
{"_":"Flush is disabled for the bucket"}
```

If the flush is successful, the HTTP response code is `200` :


```
HTTP/1.1 200 OK
```

The flush request may lead to significant disk activity as the data in the
bucket is deleted from the database. The high disk utilization may affect the
performance of your server until the data has been successfully deleted.

Also note that the flush request is not transmitted over XDCR replication
configurations; the remote bucket will not be flushed.

Couchbase Server will return a HTTP 404 response if the URI is invalid or if it
does not correspond to an active bucket in the system.


```
404 Not Found
```

You can configure whether flush is enabled for a bucket by configuring the
individual bucket properties, either the REST API (see [Modifying Bucket
Parameters](#couchbase-admin-restapi-modifying-bucket-properties) ), or through
the Admin Console (see [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit) ).

<a id="couchbase-admin-restapi-clusterops"></a>

## Managing Clusters

One of the first ways to discover the URI endpoints for the REST API is to find
the clusters available. For this you provide the Couchbase Server IP address,
port number, and append '/pools'.

Example Request:


```
shell> curl -u admin:password http://localhost:8091/pools
```

As a raw HTTP request:


```
GET /pools
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```

The corresponding HTTP response contains a JSON document describing the cluster
configuration:


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn


{"pools": [
            {
            "name":"default",
            "uri":"/pools/default",
            "streamingUri":"/poolsStreaming/default"
            }
          ],
          "isAdminCreds":false,
          "uuid":"c25913df-59a2-4886-858c-7119d42e36ab",
          "implementationVersion":"1.8.1-927-rel-enterprise",
          "componentsVersion":
             {
             "ale":"8cffe61",
             "os_mon":"2.2.6",
             "mnesia":"4.4.19",
             "inets":"5.6",
             "kernel":"2.14.4",
             "sasl":"2.1.9.4",
             "ns_server":"1.8.1-927-rel-enterprise",
             "stdlib":"1.17.4"}
 }
```

Couchbase Server returns only one cluster per group of systems and the cluster
will typically have a default name.

Couchbase Server returns the build number for the server in
`implementation_version`, the specifications supported are in the
`componentsVersion`. While this node can only be a member of one cluster, there
is flexibility which allows for any given node to be aware of other pools.

The Client-Specification-Version is optional in the request, but advised. It
allows for implementations to adjust representation and state transitions to the
client, if backward compatibility is desirable.

<a id="couchbase-admin-restapi-viewing-pool-info"></a>

### Viewing Cluster Details

At the highest level, the response for this request describes a cluster, as
mentioned previously. The response contains a number of properties which define
attributes of the cluster and *controllers* which enable you to make certain
requests of the cluster.

Note that since buckets could be renamed and there is no way to determine the
name for the default bucket for a cluster, the system will attempt to connect
non-SASL, non-proxied to a bucket clients to a bucket named "default". If it
does not exist, Couchbase Server will drop the connection.

You should not rely on the node list returned by this request to connect to a
Couchbase Server. You should instead issue an HTTP get call to the bucket to get
the node list for that specific bucket.


```
GET /pools/default
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{
    "name":"default",
    "nodes":[{

        "hostname":"10.0.1.20",

        "status":"healthy",
        "uptime":"14",
        "version":"1.6.0",
        "os":"i386-apple-darwin9.8.0",
        "memoryTotal":3584844000.0,
        "memoryFree":74972000,
        "mcdMemoryReserved":64,
        "mcdMemoryAllocated":48,
        "ports":{

            "proxy":11213,
            "direct":11212
        },
        "otpNode":"ns_1@localhost",
        "otpCookie":"fsekryjfoeygvgcd",
        "clusterMembership":"active"
    }],
    "storageTotals":{

        "ram":{
            "total":2032558080,
            "used":1641816064

        },
        "hdd":{
            "total":239315349504.0,
            "used": 229742735523.0
        }
    },
    "buckets":{

        "uri":"/pools/default/buckets"
    },
    "controllers":{
        "ejectNode":{
            "uri":"/pools/default/controller/ejectNode"
        },
        "addNode":{


            "uri":"/controller/addNode"
        },
        "rebalance":{


            "uri":"/controller/rebalance"
        },
        "failover":{


            "uri":"/controller/failOver"
        },
        "reAddNode":{


            "uri":"/controller/reAddNode"
        },
        "stopRebalance":{


            "uri":"/controller/stopRebalance"
        }
    },
    "rebalanceProgress":{


        "uri":"/pools/default/rebalanceProgress"
    },
    "balanced": true,
    "etag":"asdas123",
    "initStatus":

    "stats":{
        "uri":"/pools/default/stats"
    }
}
```

The controllers in this list all accept parameters as `x-www-form-urlencoded`,
and perform the following functions:

<a id="table-restapi-viewing-pool-info-controller"></a>

Function      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ejectNode     | Eject a node from the cluster. Required parameter: "otpNode", the node to be ejected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
addNode       | Add a node to this cluster. Required parameters: "hostname", "user" and "password". Username and password are for the Administrator for this node.                                                                                                                                                                                                                                                                                                                                                                                                                        
rebalance     | Rebalance the existing cluster. This controller requires both "knownNodes" and "ejectedNodes". This allows a client to state the existing known nodes and which nodes should be removed from the cluster in a single operation. To ensure no cluster state changes have occurred since a client last got a list of nodes, both the known nodes and the node to be ejected must be supplied. If the list does not match the set of nodes, the request will fail with an HTTP 400 indicating a mismatch. Note rebalance progress is available via the rebalanceProgress uri.
failover      | Failover the vBuckets from a given node to the nodes which have replicas of data for those vBuckets. The "otpNode" parameter is required and specifies the node to be failed over.                                                                                                                                                                                                                                                                                                                                                                                        
reAddNode     | The "otpNode" parameter is required and specifies the node to be re-added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
stopRebalance | Stop any rebalance operation currently running. This takes no parameters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

<a id="restapi-create-new-node"></a>

### Adding a Node to a Cluster

This is a REST request made to a Couchbase cluster to add a given node to the
cluster. You add a new node with the at the RESTful endpoint
`server_ip:port/controller/addNode`. You will need to provide an administrative
username and password as parameters:


```
shell> curl -u Administrator:password \
    10.2.2.60:8091/controller/addNode \
    -d "hostname=10.2.2.64&user=Administrator&password=password"
```

Here we create a request to the cluster at 10.2.2.60:8091 to add a given node by
using method, `controller/addNode` and by providing the IP address for the node
as well as credentials. If successful, Couchbase Server will respond:


```
HTTP/1.1 200 OK
{"otpNode":"ns_1@10.4.2.6"}
```

<a id="couchbase-admin-restapi-add-node-to-cluster"></a>

### Joining a Node into a Cluster

This is a REST request made to an individual Couchbase node to add that node to
a given cluster. You cannot merge two clusters together into a single cluster
using the REST API, however, you can add a single node to an existing cluster.
You will need to provide several parameters to add a node to a cluster:


```
shell> curl -u admin:password -d clusterMemberHostIp=192.168.0.1 \
    -d clusterMemberPort=8091 \
    -d user=admin -d password=admin123
    http://localhost:8091/node/controller/doJoinCluster
```

The following arguments are required:

<a id="table-restapi-add-node-to-cluster-args"></a>

Argument            | Description                                                                                   
--------------------|-----------------------------------------------------------------------------------------------
clusterMemberHostIp | Hostname or IP address to a member of the cluster the node receiving this POST will be joining
clusterMemberPort   | Port number for the RESTful interface to the system                                           

If your cluster requires credentials, you will need to provide the following
parameters in your request:

<a id="table-restapi-add-node-to-cluster-args-additional"></a>

Argument | Description                                     
---------|-------------------------------------------------
user     | Administration user                             
password | Password associated with the Administration user


```
POST /node/controller/doJoinCluster
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxx
Accept: */*
Content-Length: xxxxxxxxxx
Content-Type: application/x-www-form-urlencoded
clusterMemberHostIp=192.168.0.1&clusterMemberPort=8091&user=admin&password=admin123
```


```
200 OK with Location header pointing to pool details of pool just joined - successful join
400 Bad Request - missing parameters, etc.
401 Unauthorized - credentials required, but not supplied
403 Forbidden bad credentials - invalid credentials
```

<a id="couchbase-admin-restapi-remove-node-from-cluster"></a>

### Removing a Node from a Cluster

When a node is temporarily or permanently down, you may want to remove it from a
cluster:


```
shell> curl -u admin:password -d otpNode=ns_1@192.168.0.107 \
    http://192.168.0.106:8091/controller/ejectNode
```


```
POST /controller/ejectNode
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxx
Accept: */*
Content-Length: xxxxxxxxxx
Content-Type: application/x-www-form-urlencoded
otpNode=ns_1@192.168.0.1
```


```
200 OK - node ejected
400 Error, the node to be ejected does not exist
401 Unauthorized - Credentials were not supplied and are required
403 Forbidden - Credentials were supplied and are incorrect
```

<a id="couchbase-admin-restapi-rebalance"></a>

### Initiating a Rebalance

To start a rebalance process through the REST API you must supply two arguments
containing the list of nodes that have been marked to be ejected, and the list
of nodes that are known within the cluster. You can obtain this information by
getting the current node configuration from [Managing Couchbase
Nodes](#couchbase-admin-restapi-node-management). This is to ensure that the
client making the REST API request is aware of the current cluster
configuration. Nodes should have been previously added or marked for removal as
appropriate.

The information must be supplied via the `ejectedNodes` and `knownNodes`
parameters as a `POST` operation to the `/controller/rebalance` endpoint. For
example:


```
> curl -v -u Administrator:password -X POST
'http://172.23.121.11:8091/controller/rebalance' -d
'ejectedNodes=&knownNodes=ns_1@172.23.121.11,ns_1@172.23.121.12'
```

The corresponding raw HTTP request:


```
POST /controller/rebalance HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: 192.168.0.77:8091
Accept: */*
Content-Length: 63
Content-Type: application/x-www-form-urlencoded
```

The response will be 200 (OK) if the operation was successfully submitted.

If the wrong node information has been submitted, JSON with the mismatch error
will be returned:


```
{"mismatch":1}
```

Progress of the rebalance operation can be obtained by using [Getting Rebalance
Progress](#couchbase-admin-restapi-rebalance-progress).

<a id="couchbase-admin-restapi-rebalance-progress"></a>

### Getting Rebalance Progress

There are two endpoints for rebalance progress. One is a general request which
outputs high-level percentage completion at `/pools/default/rebalanceProgress`.
The second possible endpoint is one corresponds to the detailed rebalance report
available in Web Console, see [Monitoring a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring) for details
and definitions.

This first request returns a JSON structure containing the current progress
information:


```
> curl -u admin:password 'http://Administrator:Password@192.168.0.77:8091/pools/default/rebalanceProgress'
```

As a pure REST API call it appears as follows:


```
GET /pools/default/rebalanceProgress HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: 192.168.0.77:8091
Accept: */*
```

The response data packet contains a JSON structure showing the rebalance
progress for each node. The progress figure is provided as a percentage (shown
as a floating point value between 0 and 1).


```
{
    "status":"running",
    "ns_1@192.168.0.56":{"progress":0.2734375},
    "ns_1@192.168.0.77":{"progress":0.09114583333333337}
}
```

For more details about the rebalance, use this request


```
gt; curl -u admin:password 'http://ip_address:port/pools/default/tasks'
```


```
GET /pools/default/rebalanceProgress HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: 192.168.0.77:8091
Accept: */*
```

The response data packet contains a JSON structure showing detailed progress:


```
{
  type: "rebalance",
  recommendedRefreshPeriod: 0.25,
  status: "running",
  progress: 9.049479166666668,
  perNode: {
    ns_1@10.3.3.61: {
      progress: 13.4765625
    },
    ns_1@10.3.2.55: {
      progress: 4.6223958333333375
    }
  },
  detailedProgress: {
    bucket: "default",
    bucketNumber: 1,
    bucketsCount: 1,
    perNode: {
      ns_1@10.3.3.61: {
        ingoing: {
          docsTotal: 0,
          docsTransferred: 0,
          activeVBucketsLeft: 0,
          replicaVBucketsLeft: 0
        },
        outgoing: {
          docsTotal: 512,
          docsTransferred: 69,
          activeVBucketsLeft: 443,
          replicaVBucketsLeft: 511
        }
      },
      ns_1@10.3.2.55: {
        ingoing: {
          docsTotal: 512,
          docsTransferred: 69,
          activeVBucketsLeft: 443,
          replicaVBucketsLeft: 0
        },
        outgoing: {
          docsTotal: 0,
          docsTransferred: 0,
          activeVBucketsLeft: 0,
          replicaVBucketsLeft: 443
        }
      }
    }
  }
}
```

This will show percentage complete for each individual node undergoing
rebalance. For each specific node, it provides the current number of docs
transferred and other items. For details and definitions of these items, see
[Monitoring a Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).
If you rebalance fails, you will see this response:


```
[
  {
    "type": "rebalance",
    "status": "notRunning",
    "errorMessage": "Rebalance failed. See logs for detailed reason. You can try rebalance again."
  }
]
```

<a id="couchbase-admin-restapi-rebalance-before-compaction"></a>

### Adjusting Rebalance during Compaction

If you perform a rebalance while a node is undergoing index compaction, you may
experience delays in rebalance. There is REST-API parameter as of Couchbase
Server 2.0.1 you can use to improve rebalance performance. If you do make this
selection, you will reduce the performance of index compaction which can result
in larger index file size.

To make this request:


```
wget --post-data='rebalanceMovesBeforeCompaction=256'
--user=Administrator --password=pass http://lh:9000/internalSettings
```

This needs to be made as POST request to the `/internalSettings` endpoint. By
default this setting is 16, which specifies the number of vBuckets which will
moved per node until all vBucket movements pauses. After this pause the system
triggers index compaction. Index compaction will not be performed while vBuckets
are being moved, so if you specify a larger value, it means that the server will
spend less time compacting the index, which will result in larger index files
that take up more disk space.

<a id="couchbase-admin-restapi-get-autofailover-settings"></a>

### Retrieving Auto-Failover Settings

Use this request to retrieve any auto-failover settings for a cluster.
Auto-failover is a global setting for all clusters. You need to be authenticated
to read this value. Example:


```
shell> curl -u Administrator:letmein http://localhost:8091/settings/autoFailover
```

If successful Couchbase Server returns any auto-failover settings for the
cluster:


```
{"enabled":false,"timeout":30,"count":0}
```

The following parameters and settings appear:

 * `enabled` : either true if auto-failover is enabled or false if it is not.

 * `timeout` : seconds that must elapse before auto-failover executes on a cluster.

 * `count` : can be 0 or 1. Number of times any node in a cluster can be
   automatically failed-over. After one auto-failover occurs, count is set to 1 and
   Couchbase server will not perform auto-failure for the cluster again unless you
   reset the count to 0. If you want to failover more than one node at a time in a
   cluster, you will need to do so manually.

Possible errors include:


```
HTTP/1.1 401 Unauthorized
This endpoint isn't available yet.
```


```
GET /settings/autoFailover HTTP/1.1
Host: localhost:8091
Authorization: Basic YWRtaW46YWRtaW4=
Accept: */*
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{ "enabled": false, "timeout": 30, "count": 0 }
```

<a id="couchbase-admin-restapi-autofailover"></a>

### Enabling and Disabling Auto-Failover

This is a global setting you apply to all clusters. You need to be authenticated
to change this value. An example of this request:


```
shell> curl "http://localhost:8091/settings/autoFailover" \
    -i -u Administrator:letmein -d 'enabled=true&timeout=600'
```

Possible parameters are:

 * `enabled` (true|false) (required): Indicates whether Couchbase Server will
   perform auto-failover for the cluster or not.

 * `timeout` (integer that is greater than or equal to 30) (required; optional when
   enabled=false): The number of seconds a node must be down before Couchbase
   Server performs auto-failover on the node.


```
POST /settings/autoFailover HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: 14
enabled=true&timeout=60
```


```
HTTP/1.1 200 OK
```

The possible errors include:


```
400 Bad Request, The value of "enabled" must be true or false.
400 Bad Request, The value of "timeout" must be a positive integer bigger or equal to 30.
401 Unauthorized
This endpoint isn't available yet.
```

<a id="couchbase-admin-restapi-reset-autofailover"></a>

### Resetting Auto-Failover

This resets the number of nodes that Couchbase Server has automatically
failed-over. You can send a request to set the auto-failover number to 0. This
is a global setting for all clusters. You need to be authenticated to change
this value. No parameters are required:


```
shell> curl -i -u Administrator:letmein \
    http://localhost:8091/settings/autoFailover/resetCount
```


```
POST /settings/autoFailover/resetCount HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
```


```
HTTP/1.1 200 OK
```

Possible errors include:


```
This endpoint isn't available yet.
401 Unauthorized
```

<a id="couchbase-admin-restapi-max-buckets"></a>

### Setting Maximum Buckets for Clusters

By default the maximum number of buckets recommended for a Couchbase Cluster is
ten. This is a safety mechanism to ensure that a cluster does not have resource
and CPU overuse due to too many buckets. This limit is configurable using the
REST API.

The Couchbase REST API has changed to enable you to change the default maximum
number of buckets used in a Couchbase cluster. The maximum allowed buckets in
this request is 128, however the suggested maximum number of buckets is ten per
cluster. The following illustrates the endpoint and parameters used:


```
shell> curl -X POST -u admin:password -d maxBucketCount=6 http://ip_address:8091/internalSettings
```

For this request you need to provide administrative credentials for the cluster.
The following HTTP request will be sent:


```
About to connect() to 127.0.0.1 port 8091 (#0)
Trying 127.0.0.1...
connected
Connected to 127.0.0.1 (127.0.0.1) port 8091 (#0)
Server auth using Basic with user 'Administrator'
POST /internalSettings HTTP/1.1
```

If Couchbase Server successfully changes the bucket limit for the cluster, you
will get a HTTP 200 response:


```
HTTP/1.1 200 OK
Server: Couchbase Server 2.0.0r_501_gb614829
Pragma: no-cache
Date: Wed, 31 Oct 2012 21:21:48 GMT
Content-Type: application/json
Content-Length: 2
Cache-Control: no-cache
```

If you provide an invalid number, such as 0, a negative number, or an amount
over 128 buckets, you will get this error message:


```
["Unexpected server error, request logged."]
```

<a id="couchbase-admin-restapi-settings-maxparallelindexers"></a>

### Setting Maximum Parallel Indexers

You can set the number of parallel indexers that will be used on each node when
view indexes are updated. To get the current setting of the number of parallel
indexers, use a `GET` request.

<a id="table-couchbase-admin-restapi-settings-maxparallelindexers-get"></a>

**Method**                  | `GET /settings/maxParallelIndexers`                                
----------------------------|--------------------------------------------------------------------
**Request Data**            | None                                                               
**Response Data**           | JSON of the global and node-specific parallel indexer configuration
**Authentication Required** | no                                                                 

For example:


```
GET http://127.0.0.1:8091/settings/maxParallelIndexers
```

This returns a JSON structure of the current settings, providing both the
globally configured value, and individual node configuration:


```
{
   "globalValue" : 4,
   "nodes" : {
      "ns_1@127.0.0.1" : 4
   }
}
```

To set the value, `POST` to the URL specifying a URL-encoded value to the
`globalValue` argument.

<a id="table-couchbase-admin-restapi-settings-maxparallelindexers-post"></a>

**Method**                  | `POST /settings/maxParallelIndexers`                                                                 
----------------------------|------------------------------------------------------------------------------------------------------
**Request Data**            | None                                                                                                 
**Response Data**           | JSON of the global and node-specific parallel indexer configuration                                  
**Authentication Required** | yes                                                                                                  
**Payload Arguments**       |                                                                                                      
`globalValue`               | Required parameter. Numeric. Sets the global number of parallel indexers. Minimum of 1, maximum 1024.
**Return Codes**            |                                                                                                      
400                         | globalValue not specified or invalid                                                                 

<a id="couchbase-admin-restapi-info-on-email-settings"></a>

### View Settings for Email Notifications

The response to this request will specify whether you have email alerts set, and
which events will trigger emails. This is a global setting for all clusters. You
need to be authenticated to read this value:


```
shell> curl -u Administrator:letmein http://localhost:8091/settings/alerts
```


```
GET /settings/alerts HTTP/1.1
Host: localhost:8091
Authorization: Basic YWRtaW46YWRtaW4= Accept: */*
```


```
{
    "recipients": ["root@localhost"],
    "sender":"couchbase@localhost",
    "enabled":true,
    "emailServer":{"user":"","pass":"","host":"localhost","port":25,"encrypt":false},
    "alerts":
      ["auto_failover_node",
      "auto_failover_maximum_reached",
      "auto_failover_other_nodes_down",
      "auto_failover_cluster_too_small"]
  }
```

Possible errors include:


```
This endpoint isn't available yet.
```

<a id="couchbase-admin-restapi-enbling-disabling-email"></a>

### Enabling and Disabling Email Notifications

This is a global setting for all clusters. You need to be authenticated to
change this value. If this is enabled, Couchbase Server sends an email when
certain events occur. Only events related to auto-failover will trigger
notification:


```
shell> curl -i -u Administrator:letmein \
    -d 'enabled=true&sender=couchbase@localhost&recipients=admin@localhost,membi@localhost&emailHost=localhost&emailPort=25&emailEncrypt=false' http://localhost:8091/settings/alerts
```

Possible parameters include:

 * `enabled` : (true|false) (required). Whether to enable or disable email
   notifications

 * `sender` (string) (optional, default: couchbase@localhost). Email address of the
   sender.

 * `recipients` (string) (required). A comma separated list of recipients of the of
   the emails.

 * `emailHost` (string) (optional, default: localhost). Host address of the SMTP
   server

 * `emailPort` (integer) (optional, default: 25). Port of the SMTP server

 * `emailEncrypt` (true|false) (optional, default: false). Whether you want to use
   TLS or not

 * `emailUser` (string) (optional, default: ""): Username for the SMTP server

 * `emailPass` (string) (optional, default: ""): Password for the SMTP server

 * `alerts` (string) (optional, default: auto\_failover\_node,
   auto\_failover\_maximum\_reached, auto\_failover\_other\_nodes\_down,
   auto\_failover\_cluster\_too\_small). Comma separated list of alerts that should
   cause an email to be sent. Possible values are: auto\_failover\_node,
   auto\_failover\_maximum\_reached, auto\_failover\_other\_nodes\_down,
   auto\_failover\_cluster\_too\_small.


```
POST /settings/alerts HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: 14 enabled=true&sender=couchbase@localhost&recipients=admin@localhost,membi@localhost&emailHost=localhost&emailPort=25&emailEncrypt=false�
```


```
HTTP/1.1 200 OK
```

Possible HTTP errors include:


```
400 Bad Request
401 Unauthorized
JSON object ({"errors": {"key": "error"}}) with errors.
```

 * Possible errors returned in a JSON document include:

 * alerts: alerts contained invalid keys. Valid keys are: \[list\_of\_keys\].

 * email\_encrypt: emailEncrypt must be either true or false.

 * email\_port: emailPort must be a positive integer less than 65536.

 * enabled: enabled must be either true or false.

 * recipients: recipients must be a comma separated list of valid email addresses.

 * sender: sender must be a valid email address.

 * general: No valid parameters given.

<a id="couchbase-admin-restapi-sending-test-emails"></a>

### Sending Test Emails

This is a global setting for all clusters. You need to be authenticated to
change this value. In response to this request, Couchbase Server sends a test
email with the current configurations. This request uses the same parameters
used in setting alerts and additionally an email subject and body.


```
shell> curl -i -u Administrator:letmein http://localhost:8091/settings/alerts/sendTestEmail \
  -d 'subject=Test+email+from+Couchbase& \
  body=This+email+was+sent+to+you+to+test+the+email+alert+email+server+settings.&enabled=true& \
  recipients=vmx%40localhost&sender=couchbase%40localhost& \
  emailUser=&emailPass=&emailHost=localhost&emailPort=25&emailEncrypt=false& \
  alerts=auto_failover_node%2Cauto_failover_maximum_reached%2Cauto_failover_other_nodes_down%2Cauto_failover_cluster_too_small'
```


```
POST /settings/alerts/sendTestEmail HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
```

200 OK

Possible errrors include:


```
400 Bad Request: Unknown macro: {"error"} 401 Unauthorized
This endpoint isn't available yet.
```

<a id="couchbase-admin-restapi-settings-max_bucket_count"></a>

### Managing Internal Cluster Settings

You can set a number of internal settings the number of maximum number of
supported buckets supported by the cluster. To get the current setting of the
number of parallel indexers, use a `GET` request.

<a id="table-couchbase-admin-restapi-settings-maxbucketcount-get"></a>

**Method**                  | `GET /internalSettings`          
----------------------------|----------------------------------
**Request Data**            | None                             
**Response Data**           | JSON of current internal settings
**Authentication Required** | no                               
**Return Codes**            |                                  
200                         | Settings returned                

For example:


```
GET http://127.0.0.1:8091/internalSettings
```

This returns a JSON structure of the current settings:


```
{
  "indexAwareRebalanceDisabled":false,
  "rebalanceIndexWaitingDisabled":false,
  "rebalanceIndexPausingDisabled":false,
  "maxParallelIndexers":4,
  "maxParallelReplicaIndexers":2,
  "maxBucketCount":20
}
```

To set a configuration value, `POST` to the URL a payload containing the updated
values.

<a id="table-couchbase-admin-restapi-settings-maxparallelindexers"></a>

**Method**                  | `POST /settings/maxParallelIndexers`                                                                 
----------------------------|------------------------------------------------------------------------------------------------------
**Request Data**            | None                                                                                                 
**Response Data**           | JSON of the global and node-specific parallel indexer configuration                                  
**Authentication Required** | yes                                                                                                  
**Payload Arguments**       |                                                                                                      
`globalValue`               | Required parameter. Numeric. Sets the global number of parallel indexers. Minimum of 1, maximum 1024.
**Return Codes**            |                                                                                                      
400                         | globalValue not specified or invalid                                                                 

For example, to update the maximum number of buckets:


```
shell> curl -v -X POST http://Administrator:Password@localhost:8091/internalSettings \
    -d maxBucketCount=20
```

<a id="couchbase-admin-restapi-consistent-query"></a>

### Disabling Consistent Query Results on Rebalance

If you perform queries during rebalance, this new feature will ensure that you
receive the query results that you would expect from a node as if it is not
being rebalanced. During node rebalance, you will get the same results you would
get as if the data were on an original node and as if data were not being moved
from one node to another. In other words, this new feature ensures you get query
results from a new node during rebalance that are consistent with the query
results you would have received from the node before rebalance started.

By default this functionality is enabled; although it is possible to disable
this functionality via the REST API, under certain circumstances described
below.

Be aware that rebalance may take significantly more time if you have implemented
views for indexing and querying. While this functionality is enabled by default,
if rebalance time becomes a critical factor for your application, you can
disable this feature via the REST API.

We do not recommend you disable this functionality for applications in
production without thorough testing. To do so may lead to unpredictable query
results during rebalance.

To disable this feature, provide a request similar to the following:


```
shell> curl -v -u Administrator:password -X POST http://10.4.2.4:8091/internalSettings \
    -d indexAwareRebalanceDisabled=true
```

If successful Couchbase Server will send a response:


```
HTTP/1.1 200 OK
Content-Type: application/json
```

For more information about views and how they function within a cluster, see
[View Operation](#couchbase-views-operation).

<a id="couchbase-admin-restapi-views"></a>

## Managing Views with REST

In Couchbase 2.0 you can index and query JSON documents using views. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to: find all the documents in your database,
create a copy of data in a document and present it in a specific order, create
an index to efficiently find documents by a particular value or by a particular
structure in the document, represent relationships between documents, and
perform calculations on data contained in documents.

You store view functions in a design document as JSON and can use the REST-API
to manage your design documents. Please refer to the following resources:

 * [Storing a Design
   Document](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-designdoc-api-storing.html).

 * [Retrieving a Design
   Document](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-designdoc-api-retrieving.html).

 * [Deleting a Design
   Document](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-designdoc-api-deleting.html).

 * Querying Views via the REST-API. [Querying Using the REST
   API](#couchbase-views-querying-rest-api).

<a id="couchbase-restapi-request-limits"></a>

### Limiting Simultaneous Node Requests

As of Couchbase 2.1+ you can use the `/internalSettings` endpoint to limit the
number of simultaneous requests each node can accept. In earlier releases, too
many simultaneous views requests resulted in a node being overwhelmed. For
general information about this endpoint, see [Managing Internal Cluster
Settings](#couchbase-admin-restapi-settings-max_bucket_count).

 When Couchbase Server rejects an incoming connection because one of these
limits is exceeded, it responds with an HTTP status code of 503. The HTTP
Retry-After header will be set appropriately. If the request is made to a REST
port, the response body will provide the reason why the request was rejected. If
the request is made on a CAPI port, such as a views request, the server will
respond with a JSON object with a "error" and "reason" fields.

For example, to change this limit for the port used for views:


```
wget --post-data='capiRequestLimit=50'
--user=Administrator --password=pass http://a_hostname:9000/internalSettings
```

Will limit the number of simultaneous views requests and internal XDCR requests
which can be made on a port. The following are all the port-related request
parameters you can set:

 * **restRequestLimit** : Maximum number of simultaneous connections each node
   should accept on a REST port. Diagnostic-related requests and 
   `/internalSettings` requests are not counted in this limit.

 * **capiRequestLimit** : Maximum number of simultaneous connections each node
   should accept on CAPI port. This port is used for XDCR and views connections.

 * **dropRequestMemoryThresholdMiB** : In MB. The amount of memory used by Erlang
   VM that should not be exceeded. If the amount is exceeded the server will start
   dropping incoming connections.

By default these settings do not have any limit set. We recommend you leave this
settings at the default setting unless you experience issues with too many
requests impacting a node. If you set these thresholds too low, too many
requests will be rejected by the server, including requests from Couchbase Web
Console.

<a id="couchbase-admin-restapi-xdcr"></a>

## Managing Cross Data Center Replication (XDCR)

Cross Datacenter Replication (XDCR) enables you to automatically replicate data
between clusters and between data buckets. There are several endpoints for the
Couchbase REST API that you can use specifically for XDCR. For more information
about using and configuring XDCR, see [Cross Datacenter Replication
(XDCR)](#couchbase-admin-tasks-xdcr).

When you use XDCR, you specify source and destination clusters. A source cluster
is the cluster from which you want to copy data; a destination cluster is the
cluster where you want the replica data to be stored. When you configure
replication, you specify your selections for an individual cluster using
Couchbase Admin Console. XDCR will replicate data between specific buckets and
specific clusters and you can configure replication be either uni-directional or
bi-directional. Uni-directional replication means that XDCR replicates from a
source to a destination; in contrast, bi-directional replication means that XDCR
replicates from a source to a destination and also replicates from the
destination to the source. For more information about using Couchbase Web
Console to configure XDCR, see [Cross Datacenter Replication
(XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-xdcr-destination"></a>

### Getting a Destination Cluster Reference

When you use XDCR, you establish *source* and *destination* cluster. A source
cluster is the cluster from which you want to copy data; a destination cluster
is the cluster where you want the replica data to be stored. To get information
about a destination cluster:


```
shell> curl -u Administrator:password http://10.4.2.5:8091/pools/default/remoteClusters
```

You provide credentials for the cluster and also the hostname and port for the
remote cluster. This will generate a request similar to the following sample:


```
GET /pools/default/remoteClusters HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZA==
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If successful, Couchbase Server will respond with a JSON response similar to the
following:


```
[{
"name":"remote1",
"uri":"/pools/default/remoteClusters/remote1",
"validateURI":"/pools/default/remoteClusters/remote1?just_validate=1",
"hostname":"10.4.2.6:8091",
"username":"Administrator",
"uuid":"9eee38236f3bf28406920213d93981a3",
"deleted":false
}]
```

The following describes the response elements:

 * (String) name: Name of the destination cluster referenced for XDCR.

 * (String) uri: URI for destination cluster information.

 * (String) validateURI: URI to validate details of cluster reference.

 * (String) hostname: Hostname/IP (and :port) of the remote cluster.

 * (String) uuid: UUID of the remote cluster reference.

 * (String) username: Username for the destination cluster administrator.

 * (Boolean) deleted: Indicates whether the reference to the destination cluster
   has been deleted or not.

For more information about XDCR and using XDCR via the Couchbase Web Console,
see [Cross Datacenter Replication (XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-xdcr-create-ref"></a>

### Creating a Destination Cluster Reference

When you use XDCR, you establish *source* and *destination* cluster. A source
cluster is the cluster from which you want to copy data; a destination cluster
is the cluster where you want the replica data to be stored. To create a
reference to a destination cluster:


```
shell> curl -v -u Administrator:password1 10.4.2.4:8091/pools/default/remoteClusters \
-d uuid=9eee38236f3bf28406920213d93981a3  \
-d name=remote1
-d hostname=10.4.2.6:8091
-d username=Administrator -d password=password2
```

You provide credentials for the source cluster and information, including
credentials and UUID for destination cluster. This will generate a request
similar to the following sample:


```
POST /pools/default/remoteClusters HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZA==
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
Content-Length: 114
Content-Type: application/x-www-form-urlencoded
```

If successful, Couchbase Server will respond with a JSON response similar to the
following:


```
{"name":"remote1","uri":"/pools/default/remoteClusters/remote1",
"validateURI":"/pools/default/remoteClusters/remote1?just_validate=1",
"hostname":"10.4.2.6:8091",
"username":"Administrator",
"uuid":"9eee38236f3bf28406920213d93981a3",
"deleted":false}
```

The following describes the response elements:

 * (String) name: Name of the destination cluster referenced for XDCR.

 * (String) validateURI: URI to validate details of cluster reference.

 * (String) hostname: Hostname/IP (and :port) of the remote cluster.

 * (String) username: Username for the destination cluster administrator.

 * (String) uuid: UUID of the remote cluster reference.

 * (Boolean) deleted: Indicates whether the reference to the destination cluster
   has been deleted or not.

For more information about XDCR and creating references to destination clusters
via the Couchbase Web Console, see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-deleting-ref"></a>

### Deleting a Destination Cluster Reference

You can remove a reference to destination cluster using the REST API. A
destination cluster is a cluster to which you replicate data. After you remove
it, it will no longer be available for replication via XDCR:


```
shell> curl -v -X DELETE -u Administrator:password1 10.4.2.4:8091/pools/default/remoteClusters/remote1
```

This will send a request similar to the following example:


```
DELETE /pools/default/remoteClusters/remote1 HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZDE=
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If successful, Couchbase Server will respond with a 200 response as well as the
string, 'OK':


```
HTTP/1.1 200 OK
Server: Couchbase Server 2.0.0-1941-rel-community
Pragma: no-cache

....

"ok"
```

For more information about XDCR and references to destination clusters via the
Couchbase Web Console, see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-create-repl"></a>

### Creating XDCR Replications

To replicate data to an established destination cluster from a source cluster,
you can use the REST API or Couchbase Web Console. Once you create a replication
it will automatically begin between the clusters. As a REST call:


```
shell> curl -v -X POST -u Administrator:password1 http://10.4.2.4:8091/controller/createReplication
-d uuid=9eee38236f3bf28406920213d93981a3
-d fromBucket=beer-sample
-d toCluster=remote1
-d toBucket=remote_beer
-d replicationType=continuous
```

This will send a request similar to the following example:


```
POST / HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZDE=
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
Content-Length: 126
Content-Type: application/x-www-form-urlencoded
```

If Couchbase Server successfully create the replication, it will immediately
begin replicating data from the source to destination cluster. You will get a
response similar to the following JSON:


```
{
  "id": "9eee38236f3bf28406920213d93981a3/beer-sample/remote_beer",
  "database": "http://10.4.2.4:8092/_replicator"
}
```

The unique document ID returned in the JSON is a reference you can use if you
want to delete the replication.

For more information about XDCR and creating a new replication see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-delete-repl"></a>

### Deleting XDCR Replications

When you delete a replication, it stops replication from the source to the
destination. If you re-create the replication between the same source and
destination clusters and buckets, it XDCR will resume replication. To delete
replication via REST API:


```
shell> curl -u Administrator:password1  \
http://10.4.2.4:8091/controller/cancelXDCR/9eee38236f3bf28406920213d93981a3%2Fbeer-sample%2Fremote_beer  \
-X DELETE
```

You use a URL-encoded endpoint which contains the unique document ID that
references the replication. You can also delete a replication using the
Couchbase Web Console. For more information, see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-internal-settings"></a>

### Viewing Internal XDCR Settings

There are internal settings for XDCR which are only exposed via the REST API.
These settings will change the replication behavior, performance, and timing. To
view an XDCR internal settings, for instance:


```
shell> curl -u Administrator:password1  \
http://10.4.2.4:8091/internalSettings
```

You will recieve a response similar to the following. For the sake of brevity,
we are showing only the XDCR-related items:


```
{
....

"xdcrMaxConcurrentReps":33,
"xdcrCheckpointInterval":222,
"xdcrWorkerBatchSize":555,
"xdcrDocBatchSizeKb":999,
"xdcrFailureRestartInterval":44
}
```

The the XDCR-related values are defined as follows:

 * (Number) xdcrMaxConcurrentReps: Maximum concurrent replications per bucket, 8 to
   256. Default is 32. This controls the number of parallel replication streams per
   node. If you are running your cluster on hardware with high-performance CPUs,
   you can increase this value to improve replication speed.

 * (Number) xdcrCheckpointInterval: Interval between checkpoints, 60 to 14400
   (seconds). Default 1800.

 * (Number) xdcrWorkerBatchSize: Document batching count, 500 to 10000. Default
   500.

 * (Number) xdcrDocBatchSizeKb: Document batching size, 10 to 100000 (kB). Default
   2048.

 * (Number) xdcrFailureRestartInterval: Interval for restarting failed XDCR, 1 to
   300 (seconds). Default 30.

For more information about XDCR, see [Cross Datacenter Replication
(XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-xdcr-change-settings"></a>

### Changing Internal XDCR Settings

There are internal settings for XDCR which are only exposed via the REST API.
These settings will change the replication behavior, performance, and timing.
The following updates an XDCR setting for parallel replication streams per node:


```
shell> curl -X POST -u Administrator:password1  \
http://10.4.2.4:8091/internalSettings  \
-d xdcrMaxConcurrentReps=64
```

If Couchbase Server successfully updates this setting, it will send a response
as follows:


```
HTTP/1.1 200 OK
Server: Couchbase Server 2.0.0-1941-rel-community
Pragma: no-cache
Date: Wed, 28 Nov 2012 18:20:22 GMT
Content-Type: application/json
Content-Length: 188
Cache-Control: no-cache
```

How you adjust these variables differs based on what whether you want to perform
uni-directional or bi-directional replication between clusters. Other factors
for consideration include intensity of read/write operations on your clusters,
the rate of disk persistence on your destination cluster, and your system
environment. Changing these parameters will impact performance of your clusters
as well as XDCR replication performance. The the XDCR-related settings which you
can adjust are defined as follows:

 * `xdcrMaxConcurrentReps` (Integer)

   Maximum concurrent replications per bucket, 8 to 256. This controls the number
   of parallel replication streams per node. If you are running your cluster on
   hardware with high-performance CPUs, you can increase this value to improve
   replication speed.

 * `xdcrCheckpointInterval` (Integer)

   Interval between checkpoints, 60 to 14400 (seconds). Default 1800. At this time
   interval, batches of data via XDCR replication will be placed in the front of
   the disk persistence queue. This time interval determines the volume of data
   that will be replicated via XDCR should replication need to restart. The greater
   this value, the longer amount of time transpires for XDCR queues to grow. For
   example, if you set this to 10 minutes and a network error occurs, when XDCR
   restarts replication, 10 minutes of items will have accrued for replication.

   Changing this to a smaller value could impact cluster operations when you have
   significant amount of write operations on a destination cluster and you are
   performing bi-directional replication with XDCR. For instance, if you set this
   to 5 minutes, the incoming batches of data via XDCR replication will take
   priority in the disk write queue over incoming write workload for a destination
   cluster. This may result in the problem of having an ever growing disk-write
   queue on a destination cluster; also items in the disk-write queue that are
   higher priority than the XDCR items will grow staler/older before they are
   persisted.

 * `xdcrWorkerBatchSize` (Integer)

   Document batching count, 500 to 10000. Default 500. In general, increasing this
   value by 2 or 3 times will improve XDCR transmissions rates, since larger
   batches of data will be sent in the same timed interval. For unidirectional
   replication from a source to a destination cluster, adjusting this setting by 2
   or 3 times will improve overall replication performance as long as persistence
   to disk is fast enough on the destination cluster. Note however that this can
   have a negative impact on the destination cluster if you are performing
   bi-directional replication between two clusters and the destination already
   handles a significant volume of reads/writes.

 * `xdcrDocBatchSizeKb` (Integer)

   Document batching size, 10 to 100000 (kB). Default 2048. In general, increasing
   this value by 2 or 3 times will improve XDCR transmissions rates, since larger
   batches of data will be sent in the same timed interval. For unidirectional
   replication from a source to a destination cluster, adjusting this setting by 2
   or 3 times will improve overall replication performance as long as persistence
   to disk is fast enough on the destination cluster. Note however that this can
   have a negative impact on the destination cluster if you are performing
   bi-directional replication between two clusters and the destination already
   handles a significant volume of reads/writes.

 * `xdcrFailureRestartInterval` (Integer)

   Interval for restarting failed XDCR, 1 to 300 (seconds). Default 30. If you
   expect more frequent network or server failures, you may want to set this to a
   lower value. This is the time that XDCR waits before it attempts to restart
   replication after a server or network failure.

 * `xdcrOptimisticReplicationThreshold` (Integer)

   Document size in bytes. 0 to 2097152 Bytes (20MB). Default is 256 Bytes. XDCR
   will get metadata for documents larger than this size on a single time before
   replicating the document to a destination cluster.

<a id="couchbase-admin-restapi-xdcr-stats"></a>

### Getting XDCR Stats via REST

You can get XDCR statistics from either Couchbase Web Console, or the REST-API.
You perform all of these requests on a source cluster to get information about a
destination cluster. All of these requests use the UUID, a unique identifier for
destination cluster. You can get this ID by using the REST-API if you do not
already have it. For instructions, see [Getting a Destination Cluster
Reference](#couchbase-admin-restapi-xdcr-destination). The endpoints are as
follows:


```
http://hostname:port/pools/default/buckets/[bucket_name]/stats/[destination_endpoint]

# where a possible [destination endpoint] includes:

# number of documents written to destination cluster via XDCR
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_written

# size of data replicated in bytes
replications/[UUID]/[source_bucket]/[destination_bucket]/data_replicated

# number of updates still pending replication
replications/[UUID]/[source_bucket]/[destination_bucket]/changes_left

# number of documents checked for changes
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_checked

# number of checkpoints issued in replication queue
replications/[UUID]/[source_bucket]/[destination_bucket]/num_checkpoints

# number of checkpoints failed during replication
replications/[UUID]/[source_bucket]/[destination_bucket]/num_failedckpts

# size of replication queue in bytes
replications/[UUID]/[source_bucket]/[destination_bucket]/size_rep_queue

# active vBucket replicators
replications/[UUID]/[source_bucket]/[destination_bucket]/active_vbreps

# waiting vBucket replicators
replications/[UUID]/[source_bucket]/[destination_bucket]/waiting_vbreps

# seconds elapsed during replication
replications/[UUID]/[source_bucket]/[destination_bucket]/time_committing

# time working in seconds including wait time
replications/[UUID]/[source_bucket]/[destination_bucket]/time_working

# bandwidth used during replication
replications/[UUID]/[source_bucket]/[destination_bucket]/bandwidth_usage

# aggregate time waiting to send changes to destination cluster in milliseconds
# weighted average latency for sending replicated changes to destination cluster
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_latency_aggr
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_latency_wt

# Number of documents in replication queue
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_rep_queue

# aggregate time to request and receive metadata about documents
# weighted average time for requesting document metadata
# XDCR uses this for conflict resolution prior to sending document into replication queue
replications/[UUID]/[source_bucket]/[destination_bucket]/meta_latency_aggr
replications/[UUID]/[source_bucket]/[destination_bucket]/meta_latency_wt

# bytes replicated per second
replications/[UUID]/[source_bucket]/[destination_bucket]/rate_replication
```

You need to provide properly URL-encoded
`/[UUID]/[source_bucket]/[destination_bucket]/[stat_name]`. To get the number of
documents written:


```
curl-X GET http://hostname:port/pools/default/buckets/default/stats/replications%2F8ba6870d88cd72b3f1db113fc8aee675%2Fsource_bucket%2Fdestination_bucket%2Fdocs_written
```

Will produce this output:


```
{"samplesCount":60,"isPersistent":true,"lastTStamp":1371685106753,"interval":1000,
"timestamp":[1371685048753,1371685049754,1371685050753,1371685051753,1371685052753,1371685053753,1371685054753,
1371685055753,1371685056753,1371685057753,1371685058752,1371685059753,1371685060753,1371685061753,1371685062753,
1371685063753,1371685064753,1371685065753,1371685066753,1371685067753,1371685068753,1371685069753,1371685070753,
1371685071753,1371685072753,1371685073753,1371685074753,1371685075753,1371685076753,1371685077753,1371685078753,
1371685079753,1371685080753,1371685081753,1371685082753,1371685083753,1371685084753,1371685085753,1371685086753,
1371685087753,1371685088753,1371685089753,1371685090753,1371685091754,1371685092753,1371685093753,1371685094753,
1371685095753,1371685096753,1371685097753,1371685098753,1371685099753,1371685100753,1371685101753,1371685102753,
1371685103753,1371685104753,1371685105753,1371685106753],
"nodeStats":{"127.0.0.1:9000":[1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000]}}
```

This shows that XDCR transferred 1 million documents at each of the timestamps
provided. To get the rate of replication, make this REST request:


```
curl -X GET http://hostanme:port/pools/default/buckets/default/stats/replications%2F8ba6870d88cd72b3f1db113fc8aee675%2Fsource_bucket%2Fdestination_bucket%2Frate_replication
```

This will produce this output:


```
{"samplesCount":60,"isPersistent":true,"lastTStamp":1371685006753,"interval":1000,
"timestamp":[1371684948753,1371684949753,1371684950753,1371684951753,1371684952753,1371684953753,1371684954753,
1371684955754,1371684956753,1371684957753,1371684958753,1371684959753,1371684960753,1371684961753,1371684962753,
1371684963753,1371684964753,1371684965753,1371684966753,1371684967753,1371684968752,1371684969753,1371684970753,
1371684971753,1371684972753,1371684973753,1371684974753,1371684975753,1371684976753,1371684977753,1371684978753,
1371684979753,1371684980753,1371684981753,1371684982753,1371684983753,1371684984753,1371684985754,1371684986753,
1371684987754,1371684988753,1371684989753,1371684990753,1371684991753,1371684992753,1371684993753,1371684994753,
1371684995753,1371684996753,1371684997753,1371684998776,1371684999753,1371685000753,1371685001753,1371685002753,
1371685003753,1371685004753,1371685005753,1371685006753],
"nodeStats":{"127.0.0.1:9000":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}
```

You can also see the incoming write operations that occur on a destination
cluster due to replication via XDCR. For this REST request, you need to make the
request on your destination cluster at the following endpoint:


```
http://[Destination_IP]:8091/pools/default/buckets/[bucket_name]/stats
```

This will return results for all stats as follows. Within the JSON you find an
array `xdc_ops` and the value for this attribute will be the last sampling of
write operations on the destination due to XDCR:


```
{
.................
"xdc_ops":[0.0,0.0,0.0,0.0,633.3666333666333,1687.6876876876877, \
2610.3896103896104,3254.254254254254,3861.138861138861,4420.420420420421, \
................
}
```

Finally be aware that we expose many of these statistics in Couchbase Web
Console. For more information, see [Monitoring Outgoing
XDCR](#couchbase-admin-web-console-data-buckets-xdcr).

<a id="couchbase-admin-restapi-using-system-logs"></a>

## Using System Logs

Couchbase Server logs various messages, which are available via the REST API.
These log messages are optionally categorized by the module. You can retrieve a
generic list of recent log entries or recent log entries for a particular
category. If you perform a GET request on the systems logs URI, Couchbase Server
will return all categories of messages.

Messages may be labeled, "info" "crit" or "warn". Accessing logs requires
administrator credentials if the system is secured.


```
GET /pools/default/logs?cat=crit
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
201: bucket was created and valid URIs returned
HTTP/1.1
200 OK
Content-Type: application/json
Content-Length: nnn
[
    {
        "cat":"info",
        "date": "",
        "code": "302",
        "message": "Some information for you."
    },
    {
        "cat":"warn",
        "date": "",
        "code": "502",
        "message": "Something needs attention."
    }
]
```

<a id="couchbase-admin-restapi-client-logging"></a>

## Client Logging Interface

If you create your own Couchbase SDK you may might want to add entries to the
central log. These entries would typically be responses to exceptions such as
difficulty handling a server response. For instance, the Web UI uses this
functionality to log client error conditions. To add entries you provide a REST
request:


```
POST /logClientError
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
200 - OK
```

<a id="couchbase-views"></a>
