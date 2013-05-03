# REST API for Administration

The Couchbase Management REST API enables you to manage a Couchbase Server
deployment. It conforms to Representational State Transfer (REST) constraints,
in other words, the REST API follows a **RESTful** architecture. You use the
REST API to manage clusters, server nodes, and buckets, and to retrieve run-time
statistics within your Couchbase Server deployment.

The REST API is *not* used to directly manage data that is in memory or is on
disk. The cache data management operations such as `set` and `get`, for example,
are handled by Couchbase SDKs. See [Couchbase
SDKs](http://couchbase.com/develop).

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
   browser-based [Web Console for
   Administration](couchbase-manual-ready.html#couchbase-admin-web-console) and
   [Command-line Interface for
   Administration](couchbase-manual-ready.html#couchbase-admin-cmdline) also use
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

 * **Cluster/Pool**

   A cluster is a group of one or more nodes; it is a collection of physical
   resources that are grouped together and provide services and a management
   interface. A single default cluster exists for every deployment of Couchbase
   Server. A node, or instance of Couchbase Server, is a member of a cluster.
   Couchbase Server collects run-time statistics for clusters, maintaining an
   overall pool-level data view of counters and periodic metrics of the overall
   system. The Couchbase Management REST API can be used to retrieve historic
   statistics for a cluster.

 * **Server Nodes**

   A Server node, also known as 'node', is a physical or virtual machine running
   Couchbase Server. Each node is as a member of a cluster.

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

<a id="restapi-launching-console"></a>

## Using the Couchbase Administrative Console

Although part of the REST API, the Couchbase Administrative Console uses many of
the same REST API endpoints you would use for a REST API request.

For a list of supported browsers, see [Getting
Started](couchbase-manual-ready.html#couchbase-getting-started) System
Requirements. For the Couchbase Web Console, a separate UI hierarchy is served
from each node of the system (though asking for the root "/" would likely return
a redirect to the user agent). To launch the Couchbase Web Console, point your
browser to the appropriate host and port, for instance on your development
machine: `http://localhost:8091`

<a id="restspi-bootstrapping"></a>

## Viewing Cluster Information

One of the first ways to discover the URI endpoints for the REST API is to find
the clusters available. For this you provide the Couchbase Server IP address,
port number, and append '/pools'.

Example Request:


```
shell> curl -u admin:password http://localhost:8091/pools
```


```
GET /pools
Host: node.in.your.pool.com
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


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

<a id="getting-node-info"></a>

## Getting Information on Nodes

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

## Retrieving Bucket Statistics from Nodes

To retrieve statistics about a bucket on a node, you can first retrieve a list
of nodes in a cluster with this request:


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

If Couchbase Server successfully handles the reuqest, you will get a response
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
{"hostname":"10.4.2.4:8091","hot_keys":[{"name":"[2012-11-05::3:47:01]
....
"samplesCount":60,"isPersistent":true,"lastTStamp":1352922180718,"interval":1000}}
```

The statistics returned will be for the individual bucket associated with that
node.

<a id="couchbase-admin-restapi-provisioning"></a>

## Provisioning a Node

Creating a new cluster or adding a node to a cluster is called **Unhandled:**
`[:unknown-tag :firstterm]`. You need to:

 * Create a new node by installing a new Couchbase Server.

 * Configure disk path for the node.

 * Optionally configure memory quota for the cluster. Any nodes you add to a
   cluster will inherit the memory quota set for the cluster; if the cluster does
   not have a memory quota specified, any node you add will default to 80% of
   physical memory. The minimum size you can specify for is 100MB.

 * Add the node to your existing cluster.

Whether you are adding a node to an existing cluster or starting a new cluster,
the node's disk path must be configured. Your next steps depends on whether you
create a new cluster or you want to add a node to an existing cluster. If you
create a new cluster you will need to secure it by providing an administrative
username and password. If you add a node to an existing cluster you will need
the URI and credentials to use the REST API with that cluster.

<a id="couchbase-admin-restapi-provisioning-diskpath"></a>

### Configuring Disk Path for a Node

You configure node resources through a controller on the node. The primary
resource you will want to configure is the disk path for the node, which is
where Couchbase Server persists items for the node. You must configure a disk
path for a node prior to creating a new cluster or adding a node to an existing
cluster.

**Unhandled:** `[:unknown-tag :sidebar]` Example as follows:


```
shell> curl -u admin:password -d path=/var/tmp/test http://localhost:8091/nodes/self/controller/settings
```

HTTP Request


```
POST /nodes/self/controller/settings HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx path=/var/tmp/test
```

HTTP Response


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 0
```

<a id="restapi-cluster-memory-quota"></a>

### Configuring Memory Quota for a Cluster

When you specify a memory quota for a cluster, that minimum will apply to each
and every node in the cluster. If you do not have this specified for a cluster,
you must do so before you add nodes to the cluster. The minimum size you can
specify for is 256MB, or Couchbase Server will return an error. Here we set the
memory quota for a cluster at 400MB:


```
shell> curl -u admin:password -d memoryQuota=400 http://localhost:8091/pools/default
```


```
POST /pools/default HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx memoryQuota=400
```

Response


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 0
```

<a id="restapi-create-new-node"></a>

### Adding a Node to a Cluster

You add a new node with the at the RESTful endpoint
`host:port/controller/addNode`. You will need to provide an administrative
username and password as parameters:


```
shell> curl -u Administrator:password \
    10.2.2.60:8091/controller/addNode \
    -d "hostname=10.2.2.64&user=Administrator&password=password"
```

Here we create a request to add a new node to the cluster at 10.2.2.60:8091 by
using method, `controller/addNode` and by providing the IP address for the new
node as well as credentials. If successful, Couchbase Server will respond:


```
Status Code 200 OK
      {"otpNode":"ns_1@10.4.2.6"}
```

<a id="restapi-node-username-pass"></a>

### Setting Username and Password for a Node

While this can be done at any time for a cluster, it is typically the last step
you complete when you add node into being a new cluster. The response will
indicate the new base URI if the parameters are valid. Clients will want to send
a new request for cluster information based on this response.

Example


```
shell> curl -u admin:password -d username=Administrator \
    -d password=letmein \
    -d port=8091 \
    http://localhost:8091/settings/web
```


```
POST /settings/web HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx
username=Administrator&password=letmein&port=8091
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Server: Couchbase Server 1.6.0
Pragma: no-cache
Date: Mon, 09 Aug 2010 18:50:00 GMT
Content-Type: application/json
Content-Length: 39
Cache-Control: no-cache no-store max-age=0
{"newBaseUri":"http://localhost:8091/"}
```

Note that even if it is not to be changed, the port number must be specified
when you update username/password.

<a id="restapi-get-autofailover-settings"></a>

## Retrieve Auto-Failover Settings

Use this request to retrieve any auto-failover settings for a cluster.
Auto-failover is a global setting for all clusters. You need to be authenticated
to read this value. Example:


```
shell> curl -u Administrator:letmein http://localhost:8091/settings/autoFailover
```

If successful Couchbase Server returns any auto-failover settings for the
cluster as JSON:


```
{"enabled":false,"timeout":30,"count":0}
```

The following parameters and settings appear:

 * `enabled` : either true if auto-failover is enabled or false if it is not.

 * `timeout` : seconds that must elapse before auto-failover executes on a cluster.

 * `count` : can be 0 or 1. Number of times any node in a cluster can be
   automatically failed-over. After one auto-failover occurs, count is set to 1 and
   Couchbase server will not perform auto-failure for the cluster again again
   unless you reset the count to 0. If you want to failover more than one node at a
   time in a cluster, you will need to do so manually. do it manually.

The HTTP request and response are as follows:


```
GET /settings/autoFailover HTTP/1.1
Host: node.in.your.pool.com
Authorization: Basic YWRtaW46YWRtaW4=
Accept: */*
```


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{ "enabled": false, "timeout": 30, "count": 0 }
```

Possible errors include:


```
This endpoint isn't available yet.
HTTP 401 Unauthorized
```

<a id="coucnbase-admin-restapi-autofailover"></a>

## Enabling/Disabling Auto-Failover

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
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: 14
enabled=true&timeout=60
```


```
200 OK
```

The possible errors include:


```
400 Bad Request, The value of "enabled" must be true or false.
400 Bad Request, The value of "timeout" must be a positive integer bigger or equal to 30.
401 Unauthorized
This endpoint isn't available yet.
```

<a id="restapi-reset-autofailover"></a>

## Resetting Auto-Failovers

This resets the number of nodes that Couchbase Server has automatically
failed-over. You can send to request to set the auto-failover number to 0. This
is a global setting for all clusters. You need to be authenticated to change
this value. No parameters are required:


```
shell> curl -i -u Administrator:letmein \
    http://localhost:8091/settings/autoFailover/resetCount
```


```
POST /settings/autoFailover/resetCount HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
```


```
200 OK
```

Possible errors include:


```
This endpoint isn't available yet.
401 Unauthorized
```

<a id="restapi-info-on-email-settings"></a>

## View Settings for Email Notifications

The response to this request will specify whether you have email alerts set, and
which events will trigger emails. This is a global setting for all clusters. You
need to be authenticated to read this value:


```
shell> curl -u Administrator:letmein http://localhost:8091/settings/alerts
```


```
GET /settings/alerts HTTP/1.1
Host: node.in.your.pool.com
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

<a id="restapi-enbling-disabling-email"></a>

## Enabling/Disabling Email Notifications

This is a global setting for all clusters. You need to be authenticated to
change this value. If this is enabled, Couchbase Server sends an email when
certain events occur. Only events related to auto-failover will trigger
notification:


```
shell> curl -i -u Administrator:letmein \
    -d 'enabled=true&sender=couchbase@localhost&recipients=admin@localhost,membi@localhost&emailHost=localhost&emailPort=25&emailEncrypt=false' http://localhost:8091/settings/alerts
```

Possible parameters include:

 * `enabled` : (true or false) (required). Whether to enable or disable email
   notifications,

 * `sender` (string) (optional, default: couchbase@localhost). Email address of the
   sender,

 * `recipients` (string) (required). Comma-separated list of email recipients,

 * `emailHost` (string) (optional, default: localhost). Host address of the SMTP
   server,

 * `emailPort` (integer) (optional, default: 25). Port of the SMTP server,

 * `emailEncrypt` (true|false) (optional, default: false). Whether you want to use
   TLS or not,

 * `emailUser` (string) (optional, default: ""): Username for the SMTP server,

 * `emailPass` (string) (optional, default: ""): Password for the SMTP server,

 * `alerts` (string) (optional, default: auto\_failover\_node,
   auto\_failover\_maximum\_reached, auto\_failover\_other\_nodes\_down,
   auto\_failover\_cluster\_too\_small). Comma separated list of alerts that should
   cause an email to be sent. Possible values are: auto\_failover\_node,
   auto\_failover\_maximum\_reached, auto\_failover\_other\_nodes\_down,
   auto\_failover\_cluster\_too\_small.


```
POST /settings/alerts HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: 14 enabled=true&sender=couchbase@localhost&recipients=admin@localhost,membi@localhost&emailHost=localhost&emailPort=25&emailEncrypt=false�
```


```
200 OK
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

<a id="restapi-sending-test-emails"></a>

## Sending Test Emails

This is a global setting for all clusters. You need to be authenticated to
change this value. In response to this request, Couchbase Server sends a test
email with the current configurations. This request uses the same parameters
used in setting alerts and additionally an email subject and body.


```
curl -i -u Administrator:letmein http://localhost:8091/settings/alerts/sendTestEmail \
  -d 'subject=Test+email+from+Couchbase& \
  body=This+email+was+sent+to+you+to+test+the+email+alert+email+server+settings.&enabled=true& \
  recipients=vmx%40localhost&sender=couchbase%40localhost& \
  emailUser=&emailPass=&emailHost=localhost&emailPort=25&emailEncrypt=false& \
  alerts=auto_failover_node%2Cauto_failover_maximum_reached%2Cauto_failover_other_nodes_down%2Cauto_failover_cluster_too_small'
```


```
POST /settings/alerts/sendTestEmail HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
```

200 OK

Possible errrors include:


```
400 Bad Request: Unknown macro: {"error"} 401 Unauthorized
This endpoint isn't available yet.
```

<a id="restapi-viewing-pool-info"></a>

## Viewing Cluster Details

At the highest level, the response for this request describes a cluster, as
mentioned previously. The response contains a number of properties which define
attributes of the cluster, controllers for the cluster, and enables you to make
certain requests of the cluster.

Note that since buckets could be renamed and there is no way to determine the
name for the default bucket for a cluster, the system will attempt to connect
non-SASL, non-proxied to a bucket clients to a bucket named "default". If it
does not exist, Couchbase Server will drop the connection.

You should not use the rely on the node list here to create a server list to
connect using a Couchbase Server. You should instead issue an HTTP get call to
the bucket to get the node list for that specific bucket.


```
GET /pools/default
Host: node.in.your.pool.com
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
        "otpNode":"ns_1@node.in.your.pool.com",
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

Function          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ejectNode         | Eject a node from the cluster. Required parameter: "otpNode", the node to be ejected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
addNode           | Add a node to this cluster. Required parameters: "hostname", "user" and "password". Username and password are for the Administrator for this node.                                                                                                                                                                                                                                                                                                                                                                                                                        
rebalance         | Rebalance the existing cluster. This controller requires both "knownNodes" and "ejectedNodes". This allows a client to state the existing known nodes and which nodes should be removed from the cluster in a single operation. To ensure no cluster state changes have occurred since a client last got a list of nodes, both the known nodes and the node to be ejected must be supplied. If the list does not match the set of nodes, the request will fail with an HTTP 400 indicating a mismatch. Note rebalance progress is available via the rebalanceProgress uri.
rebalanceProgress | Return status of progress for a rebalance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
failover          | Failover the vBuckets from a given node to the nodes which have replicas of data for those vBuckets. The "otpNode" parameter is required and specifies the node to be failed over.                                                                                                                                                                                                                                                                                                                                                                                        
reAddNode         | The "otpNode" parameter is required and specifies the node to be re-added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
stopRebalance     | Stop any rebalance operation currently running. This takes no parameters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

<a id="restapi-bucket-info"></a>

## Viewing Buckets and Bucket Operations

If you create your own SDK for Couchbase, you can either the proxy path or the
direct path to connect to Couchbase Server. If your SDK uses the direct path,
your SDK will not be insulated from most reconfiguration changes to the bucket.
This means your SDK will need to either poll the bucket's URI or connect to the
streamingUri to receive updates when the bucket configuration changes. Bucket
configuration can happen for instance, when nodes are added, removed, or if a
node fails.

To retrieve information for all buckets in a cluster:


```
curl http://10.4.2.5:8091/pools/default/buckets
```


```
GET /pools/default/buckets
Host: node.in.your.pool.com
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

## Getting Individual Bucket Information

To retrieve information for a single bucket associated with a cluster, you make
this request, where the last default can be replaced with the name of a specific
bucket, if you have named buckets:


```
shell> curl -u admin:password http://10.4.2.5:8091/pools/default/buckets/bucket_name
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
    "uri":"/pools/default/buckets/bucket_name",
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
GET http://10.4.2.5:8091/pools/default/buckets/bucket_name
```


```
200 OK
```

<a id="restapi-named-bucket"></a>

## Getting Bucket Information

The individual bucket request is exactly the same request you would use for an
entire bucket list, plus the name of the bucket, or a default, for the default
bucket. An example request is as follows:


```
curl -u admin:password hostname:8091/pools/default/buckets/newbucket
```

The following is a sample request to the bucket:


```
GET /pools/default/buckets/newbucket
Host: node.in.your.pool.com
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```

The next example is a sample response:


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: nnn
{
  "name": "newbucket",
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
    "rawRAM": 629145600
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

<a id="rest-api-streaming-bucket"></a>

## Streaming Bucket Request

The streamingUri is exactly the same request as a bucket level-request except it
streams HTTP chunks using chunked encoding. The stream contains the vBucket Map
for a given bucket. When the vBucket changes it will resend an update map to
console output. A response is in the form of line-delimited chunks: "\n\n\n\n."
This will likely be converted to a "zero chunk" in a future release of this API,
and thus the behavior of the streamingUri should be considered evolving. The
following is an example request:


```
curl -u admin:password localhost:8091/pools/default/bucketsStreaming/default
```

Here is a sample HTTP request:


```
GET /pools/default/bucketsStreaming/default HTTP/1.1
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: localhost:8091
Accept: */*
```

Here is a example, abbreviated response of the vBucket content stream:


```
....
        "vBucketMap":[[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1],[0,-1]
        ....
```

<a id="rest-api-bucket-stats"></a>

## Getting Bucket Statistics

You can use the REST API to get bucket statistics from Couchbase Server. Your
request URL should be taken from the stats.uri property of a bucket response. By
default this request returns stats samples for the last minute and for heavily
used keys. You use provide additional query parameters in a request to get
samplings of statistics over different time periods:

 * `zoom` : Determines level of granularity and time period for statistics.
   Indicate one of the following as a URI parameters: (minute | hour | day | week |
   month | year). This indicates you want a sampling of statistics within the last
   minute, hour, day, week, and so forth. If you indicate 'zoom = minute' you will
   get 60 timestamps and statistics from within the last minute. If you indicate
   week, you will get 100 timestamps and statistics from the last week, and so
   forth.

 * `resampleForUI` : Indicates the number of samplings you want Couchbase Server to
   provide with bucket statistics. Indicate 1 if you want 60 samplings of
   statistics.

 * `haveTStamp` : Request samplings that are newer than the given timestamp.
   Specified in Unix epoch time.

The following is an example request:


```
curl -u admin:password -v http://localhost:8091/pools/default/buckets/test/stats
```

The following shows the actual HTTP request:


```
GET /pools/default/buckets/test/stats HTTP/1.1
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: localhost:8091
Accept: */*
```

The following is the HTTP response. For the sake of brevity, some of the JSON
sampling is abbreviated:


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
            "lastTStamp": 1292513777166.0,
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

<a id="restapi-managing-buckets"></a>

## Managing Buckets

You can create a new bucket with a POST command sent to the URI for buckets in a
cluster. This can be used to create either a couchbase or a memcached type
bucket. The bucket name cannot have a leading underscore.

When you create a bucket you must provide the `authType` parameter:

 * If you set `authType` to "none", then you must specify a proxyPort number.

 * If you set `authType` to "sasl", then you may optionally provide a
   "saslPassword" parameter. For Couchbase Sever 1.6.0, any SASL
   authentication-based access must go through a proxy at port 11211.

`ramQuotaMB` specifies how much memory, in megabytes, you want to allocate to
each node for the bucket. The minimum supported value is 100MB.

 * If the items stored in a memcached bucket take space beyond the `ramQuotaMB`,
   Couchbase Sever typically will evict items on least-requested-item basis.
   Couchbase Server may evict other infrequently used items depending on object
   size, or whether or not an item is being referenced.

 * In the case of Couchbase buckets, the system may return temporary failures if
   the `ramQuotaMB` is reached. The system will try to keep 25% of the available
   ramQuotaMB free for new items by ejecting old items from occupying memory. In
   the event these items are later requested, they will be retrieved from disk.

<a id="restapi-creating-memcached-bucket"></a>

## Creating a Memcached Bucket

To create a memcached bucket:


```
curl -v -u Administrator:password -d name=newbucket -d ramQuotaMB=100 -d authType=none \
-d bucketType=memcached -d proxyPort=11216 http://localhost:8091/pools/default/buckets
```

If successful, the HTTP 200 response will contain no URI to check for the
bucket, but most bucket creation will complete within a few seconds. You can do
a REST request on the new bucket stats to confirm it exists:


```
curl -u admin:password -v http://localhost:8091/pools/default/buckets/newbucket/stats
```

The following is the actual HTTP request:


```
POST /pools/default/buckets HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZA==
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: localhost:8091
Accept: */*
Content-Length: 80
Content-Type: application/x-www-form-urlencoded
```

And the following is the HTTP response sent when Couchbase Server successfully
creates the new bucket:


```
HTTP/1.1 202 Accepted
Server: Couchbase Server 1.8.1-937-rel-community
Pragma: no-cache
Location: /pools/default/buckets/newbucket
Date: Fri, 13 Jul 2012 18:40:25 GMT
Content-Length: 0
Cache-Control: no-cache
```

<a id="restapi-creating-couchbase-bucket"></a>

## Creating a Couchbase Bucket

In addition to the parameters used to create a memcached bucket, you can provide
`replicaNumber` to specify the number of replicas for a Couchbase bucket:


```
shell> curl -u admin:password -d name=newbucket -d ramQuotaMB=20 -d authType=none \
     -d replicaNumber=2 -d proxyPort=11215 http://localhost:8091/pools/default/buckets
```


```
POST /pools/default/buckets
HTTP/1.1
Host: node.in.your.cluster:8091
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization: Basic YWRtaW46YWRtaW4=
Content-Length: xx
name=newbucket&ramQuotaMB=20&authType=none&replicaNumber=2&proxyPort=11215
```


```
202: bucket will be created.
```

<a id="restapi-getting-bucket-request"></a>

## Getting a Bucket Request


```
GET /pools/default/buckets/Another bucket
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
                "kvcache" : 11311
            }
        },
        {
            "hostname" : "10.0.1.21",
            "uri" : "/addresses/10.0.1.21",
            "status" : "healthy",
            "ports" :
            {
                "routing" : 11211,
                "kvcache" : 11311
            }
        }
    ]
}
```

Clients MUST use the nodes list from the bucket, not the pool to indicate which
are the appropriate nodes to connect to.

<a id="restapi-modifying-bucket-properties"></a>

## Modifying Bucket Properties

You can modify buckets by posting the same parameters used to create the bucket
to the bucket's URI.

Do not omit a parameter for a bucket property in your request, even if you are
not modifying the property. This may be equivalent to not setting it in many
cases. We recommend you do a request to get current bucket settings, make
modifications as needed and then make your POST request to the bucket URI. You
cannot change the name of a bucket via the REST API, or any other means besides
removing the bucket and creating a new one witht he new name.

<a id="restapi-bucket-memory-quota"></a>

## Increasing the Memory Quota for a Bucket

Increasing a bucket's ramQuotaMB from the current level. Note, the system will
not let you decrease the ramQuotaMB for a couchbase bucket type and memcached
bucket types will be flushed when the ramQuotaMB is changed:

As of 1.6.0, there are some known issues with changing the ramQuotaMB for
memcached bucket types.

Example of a request:


```
shell> curl -u admin:password -d ramQuotaMB=25 -d authType=none \
    -d proxyPort=11215 http://localhost:8091/pools/default/buckets/bucket_name
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

<a id="restapi-bucket-authentication"></a>

## Changing Bucket Authentication

Changing a bucket from port based authentication to SASL authentication can be
done with:


```
shell> curl -u admin:password -d ramQuotaMB=130 -d authType=sasl proxyPort = 11215 \
    -d saslPassword=letmein \
    http://localhost:8091/pools/default/buckets/bucket_name
```

<a id="restapi-flushing-bucket"></a>

## Flushing a Bucket

This operation is data destructive.The service makes no attempt to double check
with the user. It simply moves forward. Clients applications using this are
advised to double check with the end user before sending such a request.

As of Couchbase 1.6 bucket flushing via REST API is not supported. Flushing via
Couchbase SDKs as of Couchbase Server 1.8.1 is disabled by default.

The bucket details provide a bucket URI at which a simple request can be made to
flush the bucket.


```
POST /pools/default/buckets/default/controller/doFlush
Host: node.in.your.pool.com
Authorization: Basic xxxxxxxxxxxxxxxxxxx
X-memcachekv-Store-Client-Specification-Version: 0.1
```

You can use any HTTP parameters in this request. Since the URI is in the bucket
details, neither the URI nor the parameters control what is actually done by the
service. The simple requirement is for a POST is that it has an appropriate
authorization header, if the system is secured.

HTTP Response, if the flush is successful


```
204 No Content
```

Possible errors include:


```
404 Not Found
```

Couchbase Server will return a HTTP 404 response if the URI is invalid or if it
does not correspond to a bucket in the system.

<a id="restapi-deleting-bucket"></a>

## Deleting a Bucket

To delete a bucket from Couchbase Server via the REST API, provide
administrative username and password in a request. The URI is for the named
bucket you want to delete, and the request is a HTTP DELETE

This operation is data destructive. The service makes no attempt to confirm with
the user before removing a bucket. Clients applications using this are advised
to check again with the end user, or client application before sending such a
request.

The following is an example request to delete the bucket named 'bucket\_name':


```
curl -v -X DELETE -u Administrator:password http://localhost:8091/pools/default/buckets/bucket_name
```

The following is the HTTP request:


```
DELETE /pools/default/buckets/bucket_name
Host: node.in.your.pool.com
Authorization: Basic xxxxxxxxxxxxxxxxxxx
X-memcachekv-Store-Client-Specification-Version: 0.1
```

If successful, Couchbase Server returns the following HTTP response:


```
HTTP/1.1 200 OK
```

<a id="restapi-add-node-to-cluster"></a>

## Adding a Node to a Cluster

Clusters cannot be merged if they are made of multiple nodes. However, you can
add a single node to an existing cluster. You will need to provide several
parameters to add a node to a cluster:


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
Host: target.node.to.do.join.from:8091
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

<a id="restapi-remove-node-from-cluster"></a>

## Removing a Node from a Cluster

When a node is temporarily or permanently down, you may want to remove it from a
cluster:


```
shell> curl -u admin:password -d otpNode=ns_1@192.168.0.107 \
    http://192.168.0.106:8091/controller/ejectNode
```


```
POST /controller/ejectNode
Host: altnernate.node.in.cluster:8091
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

<a id="restapi-rebalance"></a>

## Initiating a Rebalance

To start a rebalance process through the REST API you must supply two arguments
containing the list of nodes that have been marked to be ejected, and the list
of nodes that are known within the cluster. You can obtain this information by
getting the current node configuration as reported by [Getting Information on
Nodes](couchbase-manual-ready.html#getting-node-info). This is to ensure that
the client making the REST API request is aeare of the current cluster
configuration. Nodes should have been previously added or marked for removal as
appropriate.

The information must be supplied via the `ejectedNodes` and `knownNodes`
parameters as a `POST` operation to the `/controller/rebalance` endpoint. For
example:


```
shell&gt; curl -u admin:password -v -X POST 'http://Administrator:Password@192.168.0.77:8091/controller/rebalance' \
    -d 'ejectedNodes=&knownNodes=ns_1%40192.168.0.77%2Cns_1%40192.168.0.56'
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
Progress](couchbase-manual-ready.html#restapi-rebalance-progress).

<a id="restapi-rebalance-progress"></a>

## Getting Rebalance Progress

Once a rebalance process has been started the progress of the rebalance can be
monitored by accessing the `/pools/default/rebalanceProgress` endpoint. This
returns a JSON structure continaing the current progress information:


```
shell&gt; curl -u admin:password 'http://Administrator:Password@192.168.0.77:8091/pools/default/rebalanceProgress'
```

As a pure REST API call:


```
GET /pools/default/rebalanceProgress HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: 192.168.0.77:8091
Accept: */*
```

The response data packet contains a JSON structure showing the rebalance
progress for each node. The progress figure is provided as a percentage (shown
as a floating point value betweeen 0 and 1).


```
{
    "status":"running",
    "ns_1@192.168.0.56":{"progress":0.2734375},
    "ns_1@192.168.0.77":{"progress":0.09114583333333337}
}
```

<a id="restapi-using-system-logs"></a>

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
Host: node.in.your.pool.com
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

<a id="rest-api-client-logging"></a>

## Client Logging Interface

If you create your own Couchbase SDK you may might want to add entries to the
central log. These entries would typically be responses to exceptions such as
difficulty handling a server response. For instance, the Web UI uses this
functionality to log client error conditions. To add entries you provide a REST
request:


```
POST /logClientError
Host: node.in.your.pool.com
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
200 - OK
```

<a id="couchbase-developing"></a>
