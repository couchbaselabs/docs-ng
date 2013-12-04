<a id="couchbase-admin-restapi-node-management"></a>

# Server Nodes REST API

A Couchbase Server instance, also known as 'node', is a physical or virtual
machine running Couchbase Server. Each node is as a member of a cluster.

To view information about nodes that exist in a Couchbase Cluster, you use
this request:

    curl -u admin:password http://localhost:8091/pools/nodes

Replace *admin*, *password*, and *localhost* values in the above example with
your actual values.

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

## Retrieving statistics

To retrieve statistics about a node, you can first retrieve a list of nodes in a
cluster with this request:

    curl -u admin:password http://localhost:8091/pools/default/buckets/default/nodes

Replace the *admin*, *password*, and values in the above example with your
actual values.
    
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

    curl -u admin:password http://10.4.2.4:8091/pools/default/buckets/default/nodes/10.4.2.4%3A8091/stats

Replace the *admin*, *password*, and *10.4.2.4* values in the above example
with your actual values.
    
This sends the following HTTP request:

```
GET /pools/default/buckets/default/nodes/10.4.2.4%3A8091/stats HTTP/1.1
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If Couchbase Server successfully handles the request, you will get a response
similar to the following example:

```
{"hostname":"10.4.2.4:8091","hot_keys":[{"name":"[2012-11-05::3:47:01]"
....
"samplesCount":60,"isPersistent":true,"lastTStamp":1352922180718,"interval":1000}}
```

The statistics returned will be for the individual bucket associated with that
node.

<a id="couchbase-admin-restapi-provisioning"></a>

## Provisioning nodes

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

## Configuring index paths

The path for the index files can be configured through the use of the
`index_path` parameter:

Example as follows:

    curl -X POST -u admin:password \
    -d index_path=/var/tmp/text-index \
    http://localhost:8091/nodes/self/controller/settings

Replace the *admin*, *password*, *localhost*, and */var/tmp/text-index*
values in the above example with your actual values.
    
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

## Setting usernames and passwords

While this can be done at any time for a cluster, it is typically the last step
you complete when you add node into being a new cluster. The response will
indicate the new base URI if the parameters are valid. Clients will want to send
a new request for cluster information based on this response.

For example, using `curl` :

    curl -u admin:password -d username=Administrator \
    -d password=letmein \
    -d port=8091 \
    http://localhost:8091/settings/web

Replace the *admin*, *password*, *localhost*, *letmein*, and *Administrator*
values in the above example with your actual values.
    
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

## Configuring node memory quota

The node memory quota configures how much RAM to be allocated to Couchbase for
every node within the cluster.

<a id="table-couchbase-admin-restapi-settings-cluster-set-param-post"></a>

Set Memory | Description 
----------------------------|----------------------------------------------------
**Method**                  | `POST /pools/default`                              
**Request Data**            | Payload with memory quota setting                  
**Response Data**           | Empty                                              
**Authentication Required** | yes                                                
**Return Codes**            |                                                    
200                         | OK                                                 
400                         | Bad Request JSON: The RAM Quota value is too small.
401                         | Unauthorized                                       

For example, to set the memory quota for a cluster at 400MB:

    curl -X POST -u admin:password -d memoryQuota=400 http://localhost:8091/pools/default

Replace the *admin*, *password*, *localhost*, and *400* values in the above
example with your actual values.
    
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

## Providing hostnames

There are several ways you can provide hostnames for Couchbase. You can
provide a hostname when you install a Couchbase Server node, when you add it
to an existing cluster for online upgrade, or via a REST API call. If a node
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

## Requesting node failover

You can use this request to failover a node in the cluster. When you failover a
node, it indicates the node is no longer available in a cluster and replicated
data at another node should be available to clients. You can also choose to
perform node failover using the Web Console.

Using the REST API endpoint `host:port/controller/failOver`, provide your
administrative credentials and the parameter `optNode` which is an internal name
for the node:

    curl -v -X POST -u admin:password http://localhost:8091/controller/failOver -d otpNode=ns_2@10.3.3.63

Replace the *admin*, *password*, *localhost*, and *10.3.3.63*, values in the
above example with your actual values.
    
The HTTP request will be similar to the following:

```
POST /controller/failOver HTTP/1.1
Authorization: Basic
```

Upon success, Couchbase Server will send a response as follows:

```
HTTP/1.1 200 OK
```

If you try to failover a node that does not exist in the cluster, you will get a
HTTP 404 error. To learn more about how to retrieve `optNode` information for
the nodes in a cluster, see [Managing Clusters](#couchbase-admin-restapi-clusterops).

