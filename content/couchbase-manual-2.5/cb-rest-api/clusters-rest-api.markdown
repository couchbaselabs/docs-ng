<title>Clusters REST API</title>

<a id="cb-restapi-clusters"></a>
# Clusters REST API

One of the first ways to discover the URI endpoints for the REST API is to find
the clusters available. For this you provide the Couchbase Server IP address,
port number, and append '/pools'.

**Example Request**

    curl -u admin:password http://localhost:8091/pools

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

<pre><code>
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
</code></pre>

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

## Viewing cluster details

At the highest level, the response for this request describes a cluster, as
mentioned previously. The response contains a number of properties which define
attributes of the cluster and *controllers* which enable you to make certain
requests of the cluster.

<div class="notebox warning">
<p>Warning</p>
<p>
Since buckets could be renamed and there is no way to determine the
name for the default bucket for a cluster, the system attempts to connect
non-SASL, non-proxied to a bucket named "default". If it
does not exist, Couchbase Server drops the connection.
</p></div>

Do not rely on the node list returned by this request to connect to a
Couchbase Server. Instead, issue an HTTP Get call to the bucket to get
the node list for that specific bucket.

```
GET /pools/default
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```

<pre><code>
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
</code></pre>

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

##  Adding nodes to clusters

This is a REST request made to a Couchbase cluster to add a given node to the
cluster. You add a new node with the at the RESTful endpoint
`server_ip:port/controller/addNode`. Provide an administrative
username and password as parameters:

    curl -u admin:password \
    10.2.2.60:8091/controller/addNode \
    -d "hostname=10.2.2.64&user=admin&password=password"

Here we create a request to the cluster at 10.2.2.60:8091 to add a given node by
using method, `controller/addNode` and by providing the IP address for the node
as well as credentials. Replace the *admin*, *password*, *10.2.2.60*, and
*10.2.2.64* values in the above example with your actual values.

If successful, Couchbase Server will respond:

```
HTTP/1.1 200 OK
{"otpNode":"ns_1@10.4.2.6"}
```

<a id="couchbase-admin-restapi-add-node-to-cluster"></a>

## Joining nodes into clusters

This is a REST request made to an individual Couchbase node to add that node to
a given cluster. You cannot merge two clusters together into a single cluster
using the REST API, however, you can add a single node to an existing cluster.
You will need to provide several parameters to add a node to a cluster:

    curl -u admin:password -d clusterMemberHostIp=192.168.0.1 \
    -d clusterMemberPort=8091 \
    -d user=admin -d password=password
    http://localhost:8091/node/controller/doJoinCluster

Replace the *admin*, *password*, and *192.168.0.1* values in the above
example with your actual values.
    
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

## Removing nodes from clusters

When a node is temporarily or permanently down, you may want to remove it from a
cluster:


    curl -u admin:password -d otpNode=ns_1@192.168.0.107 \
    http://192.168.0.106:8091/controller/ejectNode

Replace the *admin*, *password*, *192.168.0.107*, and *192.168.0.106*
values in the above example with your actual values.
    
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

## Rebalancing nodes
To start a rebalance process through the REST API you must supply two arguments
containing the list of nodes that have been marked to be ejected, and the list
of nodes that are known within the cluster. 

### Initiating a rebalance
You can obtain the information about ejected and known node by
getting the current node configuration from [Managing Couchbase
Nodes](#couchbase-admin-restapi-node-management). This is to ensure that the
client making the REST API request is aware of the current cluster
configuration. Nodes should have been previously added or marked for removal as
appropriate.

The information must be supplied via the `ejectedNodes` and `knownNodes`
parameters as a `POST` operation to the `/controller/rebalance` endpoint. 

**Example**

    curl -v -X -u admin:password POST 'http://192.168.0.77:8091/controller/rebalance' \
    -d 'ejectedNodes=&knownNodes=ns_1%40192.168.0.77%2Cns_1%40192.168.0.56'

Replace the *admin*, *password*, *192.168.0.77*, and *192.168.0.56*
values in the above example with your actual values.

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
Rebalance](../cb-admin/#couchbase-admin-tasks-addremove-rebalance-monitoring) for details
and definitions.

**Example**

This first request returns a JSON structure containing the current progress
information:


```
curl -u admin:password '192.168.0.77:8091/pools/default/rebalanceProgress'
```

Replace the *admin*, *password*, *localhost*, and *192.168.0.77*
values in the above example with your actual values.

As a pure REST API call, it appears as follows:

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

For more details about the rebalance, use the following request:


```
curl -u admin:password 'http://localhost:8091/pools/default/tasks'
```

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.

```
GET /pools/default/rebalanceProgress HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: 192.168.0.77:8091
Accept: */*
```

The response data packet contains a JSON structure showing detailed progress:

<pre><code>
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
</code></pre>

This shows percentage complete for each individual node undergoing
rebalance. For each specific node, it provides the current number of docs
transferred and other items. For details and definitions of these items, see
[Monitoring a Rebalance](../cb-admin/#couchbase-admin-tasks-addremove-rebalance-monitoring).

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
experience delays in rebalance. There is REST API parameter as of Couchbase
Server 2.0.1 you can use to improve rebalance performance. If you do make this
selection, you will reduce the performance of index compaction which can result
in larger index file size.

**Example**

To make this request:

```
curl -X POST -u admin:password 'http://localhost:8091/internalSettings' 
    -d 'rebalanceMovesBeforeCompaction=256'
```

Replace the *admin*, *password*, *localhost*, and *256* values in the above
example with your actual values.
    
This needs to be made as POST request to the `/internalSettings` endpoint. By
default this setting is 16, which specifies the number of vBuckets which will
moved per node until all vBucket movements pauses. After this pause the system
triggers index compaction. Index compaction will not be performed while vBuckets
are being moved, so if you specify a larger value, it means that the server will
spend less time compacting the index, which will result in larger index files
that take up more disk space.


<a id="couchbase-admin-restapi-get-autofailover-settings"></a>


## Managing auto-failover
This section provides information about retrieving, enabling, disabling and resetting auto-failover.

### Retrieving auto-failover settings

Use this request to retrieve any auto-failover settings for a cluster.
Auto-failover is a global setting for all clusters. You need to be authenticated
to read this value. Example:

```
curl -u admin:password http://localhost:8091/settings/autoFailover
```

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
If successful Couchbase Server returns any auto-failover settings for the
cluster:


```
{"enabled":false,"timeout":30,"count":0}
```

The following parameters and settings appear:

 * `enabled` : either true if auto-failover is enabled or false if it is not.

 * `timeout` : seconds that must elapse before auto-failover executes on a cluster.

 * `count` : Value is 0 or 1. After one auto-failover occurs, count is set to 1 and
   Couchbase Server will not perform another auto-failover for the cluster unless the count 
is reset to 0. If you want to failover more than one node at a time in a
   cluster, you have to do it manually.

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

### Enabling and disabling auto-failover

This is a global setting you apply to all clusters. You need to be authenticated
to change this value. An example of this request:

```
curl "http://localhost:8091/settings/autoFailover" \
    -i -u admin:password -d 'enabled=true&timeout=600'
```

Replace the *admin*, *password*, *localhost*, and *600* values in the above
example with your actual values.
    
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

### Resetting auto-failover

This resets the number of nodes that Couchbase Server has automatically
failed-over. You can send a request to set the auto-failover number to 0. This
is a global setting for all clusters. You need to be authenticated to change
this value. No parameters are required:

```
curl -X POST -i -u admin:password \
    http://localhost:8091/settings/autoFailover/resetCount
```

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

## Setting maximum buckets for clusters

By default the maximum number of buckets recommended for a Couchbase Cluster is
ten. This is a safety mechanism to ensure that a cluster does not have resource
and CPU overuse due to too many buckets. This limit is configurable using the
REST API.

The Couchbase REST API has changed to enable you to change the default maximum
number of buckets used in a Couchbase cluster. The maximum allowed buckets in
this request is 128, however the suggested maximum number of buckets is ten per
cluster. The following illustrates the endpoint and parameters used:

    curl -X POST -u admin:password -d maxBucketCount=6 http://localhost:8091/internalSettings

Replace the *admin*, *password*, *localhost*, and *6* values in the above
example with your actual values.
    
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

## Setting maximum parallel indexers

You can set the number of parallel indexers that will be used on each node when
view indexes are updated. To get the current setting of the number of parallel
indexers, use a `GET` request.

<a id="table-couchbase-admin-restapi-settings-maxparallelindexers-get"></a>

Get Maximum Parallel Indexers | Description
----------------------------|------------------------------------------------------------------------------------------------------
**Method**                  | `GET /settings/maxParallelIndexers`                                
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

Set Maximum Parallel Indexers | Description
----------------------------|------------------------------------------------------------------------------------------------------
**Method**                  | `POST /settings/maxParallelIndexers`                                                                 
**Request Data**            | None                                                                                                 
**Response Data**           | JSON of the global and node-specific parallel indexer configuration                                  
**Authentication Required** | yes                                                                                                  
**Payload Arguments**       |                                                                                                      
`globalValue`               | Required parameter. Numeric. Sets the global number of parallel indexers. Minimum of 1, maximum 1024.
**Return Codes**            |                                                                                                      
400                         | globalValue not specified or invalid                                                                 

<a id="couchbase-admin-restapi-info-on-email-settings"></a>

## View settings for email notifications

The response to this request will specify whether you have email alerts set, and
which events will trigger emails. This is a global setting for all clusters. You
need to be authenticated to read this value:

    curl -u admin:password http://localhost:8091/settings/alerts

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

### Enabling and disabling email notifications

This is a global setting for all clusters. You need to be authenticated to
change this value. If this is enabled, Couchbase Server sends an email when
certain events occur. Only events related to auto-failover trigger
notification:

```
curl -i -u admin:password \
    -d 'enabled=true&sender=couchbase@localhost&recipients=admin@localhost,membi@localhost&emailHost=localhost&emailPort=25&emailEncrypt=false' http://localhost:8091/settings/alerts
```

Replace the *admin*, *password*, *localhost*, *couchbase@localhost*,
*admin@localhost*, *membi@localhost*, *25*, and *false* values in the above
example with your actual values.
    
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

### Sending test emails

This is a global setting for all clusters. You need to be authenticated to
change this value. In response to this request, Couchbase Server sends a test
email with the current configurations. This request uses the same parameters
used in setting alerts and additionally an email subject and body.

```
    curl -i -u admin:password http://localhost:8091/settings/alerts/testEmail \
    -d 'subject=Test+email+from+Couchbase& \
    body=This+email+was+sent+to+you+to+test+the+email+alert+email+server+settings.&enabled=true& \
    recipients=vmx%40localhost&sender=couchbase%40localhost& \
    emailUser=&emailPass=&emailHost=localhost&emailPort=25&emailEncrypt=false& \
    alerts=auto_failover_node%2Cauto_failover_maximum_reached%2Cauto_failover_other_nodes_down%2Cauto_failover_cluster_too_small'
```


Replace the *admin*, *password*, *localhost*, *vmx%40localhost*,
*couchbase%40localhost*, *25*, and *false* values in the above example with
your actual values.

```
POST /settings/alerts/sendTestEmail HTTP/1.1
Host: localhost:8091
Content-Type: application/x-www-form-urlencoded
Authorization: Basic YWRtaW46YWRtaW4=
```

200 OK

Possible errors include:


```
400 Bad Request: Unknown macro: {"error"} 401 Unauthorized
This endpoint isn't available yet.
```

<a id="couchbase-admin-restapi-settings-max_bucket_count"></a>

## Managing internal cluster settings

You can set a number of internal settings the number of maximum number of
supported buckets supported by the cluster. To get the current setting of the
number of parallel indexers, use a `GET` request.

<a id="table-couchbase-admin-restapi-settings-maxbucketcount-get"></a>

Get Internal Settings | Description
----------------------------|----------------------------------
**Method**                  | `GET /internalSettings`          
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

Set Configuration Value | Description
----------------------------|---------------------------------------------------------------
**Method**                  | `POST /settings/maxParallelIndexers`                                                                 
**Request Data**            | None                                                                                                 
**Response Data**           | JSON of the global and node-specific parallel indexer configuration                                  
**Authentication Required** | yes                                                                                                  
**Payload Arguments**       |                                                                                                      
`globalValue`               | Required parameter. Numeric. Sets the global number of parallel indexers. Minimum of 1, maximum 1024.
**Return Codes**            |                                                                                                      
400                         | globalValue not specified or invalid                                                                 

For example, to update the maximum number of buckets:

    curl -v -X POST http://admin:password@localhost:8091/internalSettings \
    -d maxBucketCount=20

Replace the *admin*, *password*, *localhost*, and *20* values in the above
example with your actual values.
    
<a id="couchbase-admin-restapi-consistent-query"></a>

## Disabling consistent query results on rebalance

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

<div class="notebox">
<p>Note</p>
<p>
Be aware that rebalance may take significantly more time if you have implemented
views for indexing and querying. While this functionality is enabled by default,
if rebalance time becomes a critical factor for your application, you can
disable this feature via the REST API.</p>
<p>We do not recommend you disable this functionality for applications in
production without thorough testing. To do so may lead to unpredictable query
results during rebalance.
</p>
</div>

To disable this feature, provide a request similar to the following:

    curl -v -u admin:password -X POST http://localhost:8091/internalSettings \
    -d indexAwareRebalanceDisabled=true

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
If successful Couchbase Server will send a response:

```
HTTP/1.1 200 OK
Content-Type: application/json
```

For more information about views and how they function within a cluster, see
[View Operation](../cb-admin/#couchbase-views-operation).

