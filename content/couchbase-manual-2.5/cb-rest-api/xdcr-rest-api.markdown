<a id="couchbase-admin-restapi-xdcr"></a>

# XDCR REST API

Cross Datacenter Replication (XDCR) enables you to automatically replicate data
between clusters and between data buckets. There are several endpoints for the
Couchbase REST API that you can use specifically for XDCR. For more information
about using and configuring XDCR, see [Cross Datacenter Replication
(XDCR)](../cb-admin/#couchbase-admin-tasks-xdcr).

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
(XDCR)](../cb-admin/#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-xdcr-destination"></a>

## Getting a destination cluster reference

When you use XDCR, you establish *source* and *destination* cluster. A source
cluster is the cluster from which you want to copy data; a destination cluster
is the cluster where you want the replica data to be stored. To get information
about a destination cluster:

```
curl -u admin:password 
	http://localhost:8091/pools/default/remoteClusters
```

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
You provide credentials for the cluster and also the hostname and port for the
remote cluster. This will generate a request similar to the following sample:

```
GET /pools/default/remoteClusters HTTP/1.1
Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZA==
User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
Host: 10.4.2.4:8091
Accept: */*
```

If successful, Couchbase Server responds with a JSON response similar to the
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
see [Cross Datacenter Replication (XDCR)](../cb-admin/#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-xdcr-create-ref"></a>

## Creating a destination cluster reference

When you use XDCR, you establish *source* and *destination* cluster. A source
cluster is the cluster from which you want to copy data; a destination cluster
is the cluster where you want the replica data to be stored. To create a
reference to a destination cluster:

    curl -v -u admin:password1 http://10.4.2.4:8091/pools/default/remoteClusters \
    -d uuid=9eee38236f3bf28406920213d93981a3  \
    -d name=remote1
    -d hostname=10.4.2.6:8091
    -d username=admin -d password=password2

Replace the *admin*, *password1*, *password2*, *10.4.2.4*, *10.4.2.6*,
*9eee38236f3bf28406920213d93981a3*, and *remote1* values in the above example
with your actual values.

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
Replication](../cb-admin/#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-deleting-ref"></a>

## Deleting a destination cluster reference

You can remove a reference to destination cluster using the REST API. A
destination cluster is a cluster to which you replicate data. After you remove
it, it will no longer be available for replication via XDCR:

    curl -v -X DELETE -u admin:password1 10.4.2.4:8091/pools/default/remoteClusters/remote1
    
Replace the *admin*, *password1*, *10.4.2.4*, and *remote1* values in the
above example with your actual values.
    
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
Replication](../cb-admin/#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-create-repl"></a>

## Creating XDCR replications

To replicate data to an established destination cluster from a source cluster,
you can use the REST API or Couchbase Web Console. Once you create a replication
it will automatically begin between the clusters. As a REST call:

```
curl -v -X POST -u admin:password1 http://10.4.2.4:8091/controller/createReplication
    -d fromBucket=beer-sample
    -d toCluster=remote1
    -d toBucket=remote_beer
    -d replicationType=continuous
    -d type=capi
```
    

Replace the *admin*, *password1*, *10.4.2.4*, *beer-sample*, *remote1*, *remote_beer*, and *capi* values in the above example with your actual values. The `replicationType` must be *continuous*. The `type` values are capi or xmem where capi and xmem are represented by version1 and version 2 in the web console. Default: `xmem`.
    
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

If Couchbase Server successfully creates the replication, it will immediately
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
Replication](../cb-admin/#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-delete-repl"></a>

## Deleting XDCR replications

When you delete a replication, it stops replication from the source to the
destination. If you re-create the replication between the same source and
destination clusters and buckets, it XDCR will resume replication. To delete
replication via REST API:

    curl -u admin:password1  \
    http://10.4.2.4:8091/controller/cancelXDCR/9eee38236f3bf28406920213d93981a3%2Fbeer-sample%2Fremote_beer  \
    -X DELETE

Replace the *admin*, *password1*, *10.4.2.4*,
*9eee38236f3bf28406920213d93981a3*, *beer-sample*, and *remote_beer*
values in the above example with your actual values.
    
You use a URL-encoded endpoint which contains the unique document ID that
references the replication. You can also delete a replication using the
Couchbase Web Console. For more information, see [Configuring
Replication](../cb-admin/#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-restapi-xdcr-internal-settings"></a>

## Viewing internal XDCR settings

There are internal settings for XDCR which are only exposed via the REST API.
These settings will change the replication behavior, performance, and timing. To
view an XDCR internal settings, for instance:

    curl -u admin:password1  \
    http://10.4.2.4:8091/internalSettings

Replace the *admin*, *password1*, and *10.4.2.4* values in the above example
with your actual values.
    
You will receive a response similar to the following. For the sake of brevity,
we are showing only the XDCR-related items:

```
{
....

"xdcrMaxConcurrentReps":33,
"xdcrCheckpointInterval":222,
"xdcrWorkerBatchSize":555,
"xdcrDocBatchSizeKb":999,
"xdcrFailureRestartInterval":44
....
}
```

For more information about these settings and their usage, see [Cross Datacenter Replication
(XDCR), Providing Advanced Settings](../cb-admin/#admin-tasks-xdcr-advanced).

<a id="couchbase-admin-restapi-xdcr-change-settings"></a>

## Changing internal XDCR settings

There are internal settings for XDCR which will change the replication behavior, performance, and timing.
With the Couchbase Server, endpoints are available to change global settings for replications for a cluster and to change settings for a specific replication ID:

- `/settings/replications/` — global settings applied to all replications for a cluster
- `/settings/replications/<replication_id>` — settings for specific replication for a bucket
- `/internalSettings` - settings applied to all replications for a cluster. Endpoint exists in Couchbase 2.0 and onward.

As of Couchbase Server 2.2+ you can change settings for a specific replication ID in Web Console | XDCR | Ongoing Replications | Settings. 
In the REST API you can change these settings globally for all replications for a cluster or for a specific replication ID. 
For detailed information about these settings including the impact of changes to a setting, 
see [XDCR, Providing Advanced Settings](../cb-admin/#admin-tasks-xdcr-advanced):

Parameter        | Value           | Description 
------------- |-------------| --------
`xdcrMaxConcurrentReps` | Integer |  Equivalent to Web Console setting `XDCR Max Replications per Bucket`.
`xdcrCheckpointInterval` | Integer | Same as Web Console setting`XDCR Checkpoint Interval`.
`xdcrWorkerBatchSize` | Integer | Known as Web Console setting `XDCR Batch Count`.
`xdcrDocBatchSizeKb` | Integer | Same as Web Console setting `XDCR Batch Size (KB)`.
`xdcrFailureRestartInterval` | Integer | equal to Web Console setting`XDCR Failure Retry Interval`.
`xdcrOptimisticReplicationThreshold` | Integer | Same as to Web Console setting `XDCR Optimistic Replication Threshold`.
 
There are additional internal settings for XDCR which are not yet exposed by Web Console, but are available 
via the REST API. These parameters are as follows:

Parameter        | Value           | Description 
------------- |-------------| --------
`workerProcesses` | Integer from 1 to 32. Default 32. |   The number of worker processes for each vbucket replicator in XDCR. Setting is available for replications using either memcached or REST for replication.
`httpConnections` | Integer from 1 to 100. Default 2. | Number of maximum simultaneous HTTP connections used for REST protocol.

The following example updates an XDCR setting for parallel replication streams per node:

    curl -X POST -u admin:password1  \
    http://10.4.2.4:8091/settings/replications/  \
    -d xdcrMaxConcurrentReps=64

Replace the *admin*, *password1*, *10.4.2.4*, and *64* values in the above
example with your actual values.

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

<a id="couchbase-admin-restapi-xdcr-stats"></a>

## Getting XDCR stats via REST

You can get XDCR statistics from either Couchbase Web Console, or the REST API.
You perform all of these requests on a source cluster to get information about a
destination cluster. All of these requests use the UUID, a unique identifier for
destination cluster. You can get this ID by using the REST API if you do not
already have it. For instructions, see [Getting a Destination Cluster
Reference](../cb-admin/#couchbase-admin-restapi-xdcr-destination). The endpoints are as
follows:

<pre><code class="java">

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
# number of docs sent optimistically 
replications/[UUID]/[source_bucket]/[destination_bucket]/docs_opt_repd
</code></pre>

You need to provide properly URL-encoded
`/[UUID]/[source_bucket]/[destination_bucket]/[stat_name]`. To get the number of
documents written:

```
curl -u admin:password http://localhost:8091/pools/default/buckets/default/stats/replications%2F8ba6870d88cd72b3f1db113fc8aee675%2Fsource_bucket%2Fdestination_bucket%2Fdocs_written
```

Replace the *admin*, *password*, *localhost*,
*8ba6870d88cd72b3f1db113fc8aee675*, *source_bucket*, and *destination_bucket*
values in the above example with your actual values.

The above command produces the following output:

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
"nodeStats":{"127.0.0.1:8091":[1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000,
1000000,1000000,1000000,1000000,1000000,1000000,1000000]}}
```

This shows that XDCR transferred 1 million documents at each of the timestamps
provided. To get the rate of replication, make this REST request:

    curl -u admin:password http://localhost:8091/pools/default/buckets/default/stats/replications%2F8ba6870d88cd72b3f1db113fc8aee675%2Fsource_bucket%2Fdestination_bucket%2Frate_replication

Replace the *admin*, *password*, *localhost*,
*8ba6870d88cd72b3f1db113fc8aee675*, *source_bucket*, and *destination_bucket*
values in the above example with your actual values.
    
This will produce the following output:

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
"nodeStats":{"127.0.0.1:8091":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}
```

To get `docs_opt_repd` you first get the replication id for a source and destination bucket. First get a list active tasks for a cluster:

        curl -s -u admin:password \
        http://localhost:8091/pools/default/tasks

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
                
This will result in output as follows:

        ....
        "id": "def03dbf5e968a47309194ebe052ed21\/bucket_source\/bucket_destination", 
        "source": "bucket_source",
        "target":"\/remoteClusters\/def03dbf5e968a47309194ebe052ed21\/buckets\/bucket_name", 
        "continuous": true, 
        "type": "xdcr", 
        ....

With this replication id you can get a sampling of stats for `docs_opt_repd`:

```
http://10.3.121.119:8091/pools/default/buckets/default/stats/ \
replications%2fdef03dbf5e968a47309194ebe052ed21%2fbucket_source%2fbucket_destination%2fdocs_opt_repd 
```

This results in output similar to the following:

        { 
           "samplesCount":60, 
           "isPersistent":true, 
           "lastTStamp":1378398438975, 
           "interval":1000, 
           "timestamp":[ 
              1378398380976, 
              1378398381976,
              ....
              
You can also see the incoming write operations that occur on a destination
cluster due to replication via XDCR. For this REST request, you need to make the
request on your destination cluster at the following endpoint:

```
http://[Destination_IP]:8091/pools/default/buckets/[bucket_name]/stats
```

This returns results for all stats as follows. Within the JSON you find an
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

Many of these statistics are exposed in the Couchbase Web
Console. For more information, see [Monitoring Outgoing
XDCR](../cb-admin/#couchbase-admin-web-console-data-buckets-xdcr).


<a id="cb-restapi-xdcr-data-encrypt"></a>

## Managing XDCR data encryption
The process for configuring XDCR with data encryption (Enterprise Edition only) involves configuring the XDCR cluster reference with data encryption enabled, providing the SSL certificate, and configuring replication.

The following summarizes the HTTP methods used for defining XDCR data encryption:



<table border="1">
<tr><th>HTTP method</th><th>URI path</th><th>Description</th></tr>
<tr><td>GET</td><td><code>/pools/default/remoteClusters</code></td><td>Gets the destination cluster reference</td></tr>
<tr><td>POST</td><td><code>/pools/default/remoteClusters</code></td><td>Creates a  reference to the destination cluster</td></tr>
<tr><td>PUT</td><td><code>/pools/default/remoteClusters/UUID</code></td><td>Modifies the destination cluster reference</td></tr>
<tr><td>DELETE</td><td><code>/pools/default/remoteClusters/UUID</code></td><td>Deletes the reference to the destination cluster.</td></tr>
</table>




### Retrieving certificates

To retrieve the SSL certificate from the destination cluster to the source cluster:

**Destination endpoint**

`/pools/default/certificate`

**Example**

```
curl http://remoteHost:port/pools/default/certificate > ./remoteCert.pem
```


### Regenerating certificates
To regenerate a certificate on a destination cluster:

**Destination endpoint**

`/controller/regenerateCertificate`


**Example**


```
curl -X POST http://Administrator:asdasd@remoteHost:8091/controller/regenerateCertificate
```


### Configuring XDCR with data encryption
A POST to `/pools/default/remoteClusters` creates the XDCR cluster reference from the source cluster to the destination cluster. Setting the `demandEncryption` to one (1) and providing the certificate name and location enables data encryption.

**Destination endpoint**

`POST /pools/default/remoteClusters` creates the destination cluster reference.

`PUT /pools/default/remoteClusters` modifies the destination cluster reference.


**Syntax**

```
curl –X POST  -u Admin:myPassword
  http://localHost:port/pools/default/remoteClusters 
  -d name=<clusterName>             // Remote cluster name
  -d hostname=<host>:<port>         // FQDN of the remote host.
  -d username=<adminName>           // Remote cluster Admin name
  -d password=<adminPassword>       // Remote cluster Admin password
  -d demandEncryption=[0|1] --data-urlencode "certificate=$(cat remoteCert.pem)"
```


**Example**

```
curl –X POST 
-d name=remoteName  
-d hostname=10.3.4.187:8091
-d username=remoteAdmin –d password=remotePassword
-d demandEncryption=1 --data-urlencode "certificate=$(cat remoteCert.pem)"
http://Administrator:asdasd@192.168.0.1:8091/pools/default/remoteClusters/
```




### Disabling data encryption
To modify the XDCR configuration so that SSL data encryption is disabled, execute a PUT from the source cluster to the destination cluster with `demandEncryption=0`.

**Destination endpoint**

`/pools/default/remoteClusters`

**Example**

```
curl –X PUT  -u Admin:myPassword
  http://192.168.0.1:8091/pools/default/remoteClusters/
-d name=remoteName 
-d hostname=10.3.4.187:8091
-d username=remoteAdmin –d password=remotePassword
-d demandEncryption=0
```


