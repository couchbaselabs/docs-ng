<title>Buckets REST API</title>
# Buckets REST API

The bucket management and configuration REST API endpoints are provided to fine
level control over the individual buckets in the cluster, their configuration,
and specific operations such as `FLUSH`.

<table>
<tr>
	<th>HTTP method</th><th>URI path</th><th>Description</th>
	</tr>
<tr>
	<td>GET</td><td>/pools/default/buckets</td><td>Retrieves all bucket and bucket operations information from a cluster.</td>
	</tr>
<tr>
	<td>GET</td><td>/pools/default/buckets/default</td><td>Retrieves information for a single bucket associated with a cluser.</td>
	</tr>
<tr>
	<td>GET</td><td>/pools/default/buckets/bucket_name/stats</td><td>Retrieves bucket statistics for a specific bucket.</td>
	</tr>
<tr>
	<td>POST</td><td>/pools/default/buckets</td><td>Creates a new Couchbase bucket.</td>
	</tr>
<tr>
	<td>DELETE</td><td>/pools/default/buckets/bucket_name</td><td>Deletes a specific bucket.</td>
	</tr>
<tr>
	<td>POST</td><td>/pools/default/buckets/default/controller/doFlush</td><td>Flushes a specific bucket.</td>
	</tr>
</table>	

<a id="couchbase-admin-restapi-bucket-info"></a>

## Viewing buckets and bucket operations

If you create your own SDK for Couchbase, you can use either the proxy path or
the direct path to connect to Couchbase Server. If your SDK uses the direct
path, your SDK will not be insulated from most reconfiguration changes to the
bucket. This means your SDK will need to either poll the bucket's URI or connect
to the streamingUri to receive updates when the bucket configuration changes.
Bucket configuration can happen for instance, when nodes are added, removed, or
if a node fails.

To retrieve information for all bucket for cluster:

    curl -u admin:password http://localhost:8091/pools/default/buckets

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

## Getting single bucket information

To retrieve information for a single bucket associated with a cluster, you make
this request, where the last default can be replaced with the name of a specific
bucket, if you have named buckets:

    curl -u admin:password \
    http://localhost:8091/pools/default/buckets/default

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

## Getting bucket statistics

You can use the REST API to get statistics with the at the bucket level from
Couchbase Server. Your request URL should be taken from stats.uri property of a
bucket response. By default this request returns stats samples for the last
minute and for heavily used keys. You use provide additional query parameters in
a request to get a more detailed level of information:

 * **zoom** - provide statistics sampling for that bucket stats at a particular
   interval (minute | hour | day | week | month | year). For example zoom level of
   minute will provide bucket statistics from the past minute, a zoom level of day
   will provide bucket statistics for the past day, and so on. If you provide no
   zoom level, the server returns samples from the past minute.

 * **haveTStamp** - request statistics from this timestamp until now. You provide
   the timestamp as UNIX epoch time. You can get a timestamp for a timeframe by
   making a REST request to the endpoint with a zoom level.

The following is a sample request to the endpoint with no parameters:

    curl -u admin:password http://localhost:8091/pools/default/buckets/bucket_name/stats

Replace the *admin*, *password*, *localhost*, and *bucket_name* values in the
above example with your actual values.
    
The actual request appears as follows:

```
GET /pools/default/buckets/<bucket name>/stats
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json X-memcachekv-Store-Client-Specification-Version: 0.1
```

Upon success, you will see output similar to the following:

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

The following are sample requests at this endpoint with optional parameters.
Replace the *admin*, *password*, *localhost*, *bucket_name*, and
*1376963720000* values in the below examples with your actual values.

    curl -u admin:password  -d zoom=minute http://localhost:8091/pools/default/buckets/bucket_name/stats

This will sample statistics from a bucket for the last minute.

    curl -u admin:password  -d zoom=day http://localhost:8091/pools/default/buckets/bucket_name/stats

This will sample statistics from a bucket for the past day.

Using zoom level of a month:

    curl -u admin:password  -d zoom=month http://localhost:8091/pools/default/buckets/bucket_name/stats

This will sample statistics from a bucket for the last month.

Using zoom level of an hour from a specific timestamp:

    curl -u admin:password  -d zoom=hour&haveTStamp=1376963720000 http://localhost:8091/pools/default/buckets/bucket_name/stats

This will sample statistics from a bucket from the timestamp until the server
receives the REST request.

Sample output for each of these requests appears in the same format and with the
same fields. Depending on the level of bucket activity, there may be more detail
for each field or less. We the sake of brevity we have omitted sample output for
each category.

```
{
  "hot_keys": [],
  "op": {
    "interval": 1000,
    "lastTStamp": 1376963580000,
    "isPersistent": true,
    "samplesCount": 1440,
    "samples": {
      "timestamp": [1376955060000, 1376955120000, 1376955180000, 1376955240000, ... ],
      "xdc_ops": [0, 0, 0, 0, ... ],
      "vb_total_queue_age": [0, 0, 0, 0, ... ],
      "vb_replica_queue_size": [0, 0, 0, 0, ... ],
      "vb_replica_queue_fill": [0, 0, 0, 0, ... ],
      "vb_replica_queue_drain": [0, 0, 0, 0, ... ],
      "vb_replica_queue_age": [0, 0, 0, 0, ... ],
      "vb_replica_ops_update": [0, 0, 0, 0, ... ],
      "vb_replica_ops_create": [0, 0, 0, 0, ... ],
      "vb_replica_num_non_resident": [0, 0, 0, 0, ... ],
      "vb_replica_num": [0, 0, 0, 0, ... ],
      "vb_replica_meta_data_memory": [0, 0, 0, 0, ... ],
      "vb_replica_itm_memory": [0, 0, 0, 0, ... ],
      "vb_replica_eject": [0, 0, 0, 0, ... ],
      "vb_replica_curr_items": [0, 0, 0, 0, ... ],
      "vb_pending_queue_size": [0, 0, 0, 0, ... ],
      "vb_pending_queue_fill": [0, 0, 0, 0, ... ],
      "vb_pending_queue_drain": [0, 0, 0, 0, ... ],
      "vb_pending_queue_age": [0, 0, 0, 0, ... ],
      "vb_pending_ops_update": [0, 0, 0, 0, ... ],
      "vb_pending_ops_create": [0, 0, 0, 0, ... ],
      "vb_pending_num_non_resident": [0, 0, 0, 0, ... ],
      "vb_pending_num": [0, 0, 0, 0, ... ],
      "vb_pending_meta_data_memory": [0, 0, 0, 0, ... ],
      "vb_pending_itm_memory": [0, 0, 0, 0, ... ],
      "vb_pending_eject": [0, 0, 0, 0, ... ],
      "vb_pending_curr_items": [0, 0, 0, 0, ... ],
      "vb_active_queue_size": [0, 0, 0, 0, ... ],
      "vb_active_queue_fill": [0, 0, 0, 0, ... ],
      "vb_active_queue_drain": [0, 0, 0, 0, ... ],
      "vb_active_queue_age": [0, 0, 0, 0, ... ],
      "vb_active_ops_update": [0, 0, 0, 0, ... ],
      "vb_active_ops_create": [0, 0, 0, 0, ... ],
      "vb_active_num_non_resident": [0, 0, 0, 0, ... ],
      "vb_active_num": [1024, 1024, 1024, 1024, ... ],
      "vb_active_meta_data_memory": [0, 0, 0, 0, ... ],
      "vb_active_itm_memory": [0, 0, 0, 0, ... ],
      "vb_active_eject": [0, 0, 0, 0, ... ],
      "ep_ops_create": [0, 0, 0, 0, ... ],
      "ep_oom_errors": [0, 0, 0, 0, ... ],
      "ep_num_value_ejects": [0, 0, 0, 0, ... ],
      "ep_num_ops_set_ret_meta": [0, 0, 0, 0, ... ],
      "ep_num_ops_set_meta": [0, 0, 0, 0, ... ],
      "ep_num_ops_get_meta": [0, 0, 0, 0, ... ],
      "ep_num_ops_del_ret_meta": [0, 0, 0, 0, ... ],
      "ep_num_ops_del_meta": [0, 0, 0, 0, ... ],
      "ep_num_non_resident": [0, 0, 0, 0, ... ],
      "ep_meta_data_memory": [0, 0, 0, 0, ... ],
      "ep_mem_low_wat": [402653184, 402653184, 402653184, 402653184, ... ],
      "ep_mem_high_wat": [456340275, 456340275, 456340275, 456340275, ... ],
      "ep_max_data_size": [536870912, 536870912, 536870912, 536870912, ... ],
      "ep_kv_size": [0, 0, 0, 0, ... ],
      "ep_item_commit_failed": [0, 0, 0, 0, ... ],
      "ep_flusher_todo": [0, 0, 0, 0, ... ],
      "ep_diskqueue_items": [0, 0, 0, 0, ... ],
      "ep_diskqueue_fill": [0, 0, 0, 0, ... ],
      "ep_diskqueue_drain": [0, 0, 0, 0, ... ],
      "ep_bg_fetched": [0, 0, 0, 0, ... ],
      "disk_write_queue": [0, 0, 0, 0, ... ],
      "disk_update_total": [0, 0, 0, 0, ... ],
      "disk_update_count": [0, 0, 0, 0, ... ],
      "disk_commit_total": [0, 0, 0, 0, ... ],
      "disk_commit_count": [0, 0, 0, 0, ... ],
      "delete_misses": [0, 0, 0, 0, ... ],
      "delete_hits": [0, 0, 0, 0, ... ],
      "decr_misses": [0, 0, 0, 0, ... ],
      "decr_hits": [0, 0, 0, 0, ... ],
      "curr_items_tot": [0, 0, 0, 0, ... ],
      "curr_items": [0, 0, 0, 0, ... ],
      "curr_connections": [9, 9, 9, 9, ... ],
      "avg_bg_wait_time": [0, 0, 0, 0, ... ],
      "avg_disk_commit_time": [0, 0, 0, 0, ... ],
      "avg_disk_update_time": [0, 0, 0, 0, ... ],
      "vb_pending_resident_items_ratio": [0, 0, 0, 0, ... ],
      "vb_replica_resident_items_ratio": [0, 0, 0, 0, ... ],
      "vb_active_resident_items_ratio": [0, 0, 0, 0, ... ],
      "vb_avg_total_queue_age": [0, 0, 0, 0, ... ],
      "vb_avg_pending_queue_age": [0, 0, 0, 0, ... ],
      "couch_total_disk_size": [8442535, 8449358, 8449392, 8449392, ... ],
      "couch_docs_fragmentation": [0, 0, 0, 0, ... ],
      "couch_views_fragmentation": [0, 0, 0, 0, ... ],
      "hit_ratio": [0, 0, 0, 0, ... ],
      "ep_cache_miss_rate": [0, 0, 0, 0, ... ],
      "ep_resident_items_rate": [100, 100, 100, 100, ... ],
      "vb_avg_active_queue_age": [0, 0, 0, 0, ... ],
      "vb_avg_replica_queue_age": [0, 0, 0, 0, ... ],
      "bg_wait_count": [0, 0, 0, 0, ... ],
      "bg_wait_total": [0, 0, 0, 0, ... ],
      "bytes_read": [103.5379762658911, 103.53627151841438, 103.53627262555834, 103.53739884434893, ... ],
      "bytes_written": [20793.105529503482, 20800.99759272974, 20802.109356966503, 20803.59949917707, ... ],
      "cas_badval": [0, 0, 0, 0, ... ],
      "cas_hits": [0, 0, 0, 0, ... ],
      "cas_misses": [0, 0, 0, 0, ... ],
      "cmd_get": [0, 0, 0, 0, ... ],
      "cmd_set": [0, 0, 0, 0, ... ],
      "couch_docs_actual_disk_size": [8442535, 8449358, 8449392, 8449392, ... ],
      "couch_docs_data_size": [8435712, 8435712, 8435712, 8435712, ... ],
      "couch_docs_disk_size": [8435712, 8435712, 8435712, 8435712, ... ],
      "couch_views_actual_disk_size": [0, 0, 0, 0, ... ],
      "couch_views_data_size": [0, 0, 0, 0, ... ],
      "couch_views_disk_size": [0, 0, 0, 0, ... ],
      "couch_views_ops": [0, 0, 0, 0, ... ],
      "ep_ops_update": [0, 0, 0, 0, ... ],
      "ep_overhead": [27347928, 27347928, 27347928, 27347928, ... ],
      "ep_queue_size": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_count": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_qlen": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_queue_backfillremaining": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_queue_backoff": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_queue_drain": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_queue_fill": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_queue_itemondisk": [0, 0, 0, 0, ... ],
      "ep_tap_rebalance_total_backlog_size": [0, 0, 0, 0, ... ],
      "ep_tap_replica_count": [0, 0, 0, 0, ... ],
      "ep_tap_replica_qlen": [0, 0, 0, 0, ... ],
      "ep_tap_replica_queue_backfillremaining": [0, 0, 0, 0, ... ],
      "ep_tap_replica_queue_backoff": [0, 0, 0, 0, ... ],
      "ep_tap_replica_queue_drain": [0, 0, 0, 0, ... ],
      "ep_tap_replica_queue_fill": [0, 0, 0, 0, ... ],
      "ep_tap_replica_queue_itemondisk": [0, 0, 0, 0, ... ],
      "ep_tap_replica_total_backlog_size": [0, 0, 0, 0, ... ],
      "ep_tap_total_count": [0, 0, 0, 0, ... ],
      "ep_tap_total_qlen": [0, 0, 0, 0, ... ],
      "ep_tap_total_queue_backfillremaining": [0, 0, 0, 0, ... ],
      "ep_tap_total_queue_backoff": [0, 0, 0, 0, ... ],
      "ep_tap_total_queue_drain": [0, 0, 0, 0, ... ],
      "ep_tap_total_queue_fill": [0, 0, 0, 0, ... ],
      "ep_tap_total_queue_itemondisk": [0, 0, 0, 0, ... ],
      "ep_tap_total_total_backlog_size": [0, 0, 0, 0, ... ],
      "ep_tap_user_count": [0, 0, 0, 0, ... ],
      "ep_tap_user_qlen": [0, 0, 0, 0, ... ],
      "ep_tap_user_queue_backfillremaining": [0, 0, 0, 0, ... ],
      "ep_tap_user_queue_backoff": [0, 0, 0, 0, ... ],
      "ep_tap_user_queue_drain": [0, 0, 0, 0, ... ],
      "ep_tap_user_queue_fill": [0, 0, 0, 0, ... ],
      "ep_tap_user_queue_itemondisk": [0, 0, 0, 0, ... ],
      "ep_tap_user_total_backlog_size": [0, 0, 0, 0, ... ],
      "ep_tmp_oom_errors": [0, 0, 0, 0, ... ],
      "ep_vb_total": [1024, 1024, 1024, 1024, ... ],
      "evictions": [0, 0, 0, 0, ... ],
      "get_hits": [0, 0, 0, 0, ... ],
      "get_misses": [0, 0, 0, 0, ... ],
      "incr_hits": [0, 0, 0, 0, ... ],
      "incr_misses": [0, 0, 0, 0, ... ],
      "mem_used": [27347928, 27347928, 27347928, 27347928, ... ],
      "misses": [0, 0, 0, 0, ... ],
      "ops": [0, 0, 0, 0, ... ],
      "replication_active_vbreps": [0, 0, 0, 0, ... ],
      "replication_bandwidth_usage": [0, 0, 0, 0, ... ],
      "replication_changes_left": [0, 0, 0, 0, ... ],
      "replication_commit_time": [0, 0, 0, 0, ... ],
      "replication_data_replicated": [0, 0, 0, 0, ... ],
      "replication_docs_checked": [0, 0, 0, 0, ... ],
      "replication_docs_latency_aggr": [0, 0, 0, 0, ... ],
      "replication_docs_latency_wt": [0, 0, 0, 0, ... ],
      "replication_docs_rep_queue": [0, 0, 0, 0, ... ],
      "replication_docs_written": [0, 0, 0, 0, ... ],
      "replication_meta_latency_aggr": [0, 0, 0, 0, ... ],
      "replication_meta_latency_wt": [0, 0, 0, 0, ... ],
      "replication_num_checkpoints": [0, 0, 0, 0, ... ],
      "replication_num_failedckpts": [0, 0, 0, 0, ... ],
      "replication_rate_replication": [0, 0, 0, 0, ... ],
      "replication_size_rep_queue": [0, 0, 0, 0, ... ],
      "replication_waiting_vbreps": [0, 0, 0, 0, ... ],
      "replication_work_time": [0, 0, 0, 0, ... ]
    }
  }
}
```

<a id="couchbase-admin-restapi-named-bucket-streaming-uri"></a>

## Using the bucket streaming URI

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

## Creating and editing buckets

You can create a new bucket with a POST command sent to the URI for buckets in a
cluster. This can be used to create either a Couchbase or a Memcached type
bucket. The bucket name cannot have a leading underscore.

To create a new Couchbase bucket, or edit the existing parameters for an
existing bucket, you can send a `POST` to the REST API endpoint. You can also
use this same endpoint to get a list of buckets that exist for a cluster.

<div class="notebox">
<p>Note</p>
<p>
Be aware that when you edit bucket properties, if you do not specify an existing
bucket property Couchbase Server may reset this the property to be the default.
So even if you do not intend to change a certain property when you edit a
bucket, you should specify the existing value to avoid this behavior.
</p></div>

The REST API returns a successful response when preliminary files for a
data bucket are created on one node. Because you may be using a multi-node
cluster, bucket creation may not yet be complete for all nodes when a response
is sent. Therefore it is possible that the bucket is not available for
operations immediately after this REST call successful returns.

To ensure a bucket is available, the recommended approach is try to read a key
from the bucket. If you receive a 'key not found' error, or the document for the
key, the bucket exists and is available to all nodes in a cluster. You can do
this via a Couchbase SDK with any node in the cluster. 
See the _Couchbase Developer Guide_ for more information.

<a id="table-couchbase-admin-restapi-creating-buckets"></a>


**Method** - `POST /pools/default/buckets`                                                                                                                                                                                                                                                                                                                             
**Request Data** - List of payload parameters for the new bucket                                                                                                                                                                                                                                                                                                             
**Response Data** - JSON of the bucket confirmation or error condition                                                                                                                                                                                                                                                                                                        
**Authentication Required** - yes  

                                                                                                                                                                                                                                                                                                                                                    
Payload Arguments        |  Description   
------------------------------|----------------------------------------------------------------------------------------------                                                                                                                                                                                                                                                                                                                                                    
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
`threadsNumber`               | Optional Parameter. Integer from 2 to 8. Change the number of concurrent readers and writers for the data bucket. For detailed information about this feature, see [Using Multi- Readers and Writers](../cb-admin/#couchbase-admin-tasks-mrw).                                                                                                                        
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

    curl -X POST -u admin:password -d name=newbucket -d ramQuotaMB=200 -d authType=none \
    -d replicaNumber=2 -d proxyPort=11215 http://localhost:8091/pools/default/buckets

Replace the *admin*, *password*, *localhost*, *newbucket*, *200*, *2*,
and *11215* values in the above example with your actual values.

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

## Getting bucket configuration

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

## Modifying bucket parameters

You can modify existing bucket parameters by posting the updated parameters used
to create the bucket to the bucket's URI. Do not omit a parameter in your
request since this is equivalent to not setting it in many cases. We recommend
you do a request to get current bucket settings, make modifications as needed
and then make your POST request to the bucket URI.

For example, to edit the bucket `customer` :


    curl -v -X POST -u admin:password -d name=customer \
    -d flushEnabled=0 -d replicaNumber=1 -d authType=none \
    -d ramQuotaMB=200 -d proxyPort=11212 \
     http://localhost:8091/pools/default/buckets/customer

Replace the *admin*, *password*, *localhost*, *customer*, *0*, *1*,
*200*, *11212*, and *customer* values in the above example with your
actual values.
     
[Available parameters are identical to those available when creating a bucket.
See bucket parameters](#table-couchbase-admin-restapi-creating-buckets).

If the request is successful, HTTP response 200 will be returned with an empty
data content.

<div class="notebox warning">
<p>Warning</p>
<p>
The bucket name cannot be changed via the REST API.
</p>
</div>

<a id="couchbase-admin-restapi-bucket-memory-quota"></a>

## Increasing bucket memory quota

You can increase and decrease a bucket's ramQuotaMB from its current level.
However, while increasing will do no harm, decreasing should be done with proper
sizing. Decreasing the bucket's ramQuotaMB lowers the watermark, and some items
may be unexpectedly ejected if the ramQuotaMB is set too low.

<div class="notebox">
<p>Note</p>
<p>
There are some known issues with changing the ramQuotaMB for
memcached bucket types.
</p></div>

Example of a request:

    curl -X POST -u admin:password -d ramQuotaMB=25 -d authType=none \
    -d proxyPort=11215 http://localhost:8091/pools/default/buckets/newbucket

Replace the *admin*, *password*, *localhost*, *25*, *11215*, and *new_bucket*
values in the above example with your actual values.
    
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

## Changing bucket authentication

Changing a bucket from port based authentication to SASL authentication can be
achieved by changing the active bucket configuration. You must specify the
existing configuration parameters and the changed authentication parameters in
the request:

    curl -X POST -u admin:password -d ramQuotaMB=130 -d authType=sasl \
    -d saslPassword=letmein \
    http://localhost:8091/pools/default/buckets/acache

Replace the *admin*, *password*, *localhost*, *130*, *letmein*, and *acache*
values in the above example with your actual values.
    
<a id="couchbase-admin-restapi-deleting-bucket"></a>

## Deleting buckets

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

<div class="notebox warning">
<p>Warning</p>
<p>
This operation is data destructive.The service makes no attempt to double check
with the user. It simply moves forward. Clients applications using this are
advised to double check with the end user before sending such a request.
</p></div>

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

## Flushing buckets

<div class="notebox warning">
<p>Warning</p>
<p>This operation is data destructive. The service makes no attempt to confirm or
double check the request. Client applications using this are advised to double
check with the end user before sending such a request. You can control and limit
the ability to flush individual buckets by setting the `flushEnabled` parameter
on a bucket in Couchbase Web Console or via `cbepctl flush_param`.
</p></div>

For information about changing this setting in the Web Console, see [Viewing
data buckets](../cb-admin/#couchbase-admin-web-console-data-buckets). For information about
flushing data buckets via REST, see [Flushing a
bucket](#couchbase-admin-restapi-flushing-bucket).

The `doFlush` operation empties the contents of the specified bucket, deleting
all stored data. The operation will only succeed if flush is enabled on
configured bucket. The format of the request is the URL of the REST endpoint
using the `POST` HTTP operation:

```
http://localhost:8091/pools/default/buckets/default/controller/doFlush
```

For example, using `curl` :

    curl -X POST 'http://admin:password@localhost:8091/pools/default/buckets/default/controller/doFlush'

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
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

<div class="notebox warning">
<p>Warning</p>
<p>
The flush request may lead to significant disk activity as the data in the
bucket is deleted from the database. The high disk utilization may affect the
performance of your server until the data has been successfully deleted.
</p></div>

<div class="notebox">
<p>Note</p>
<p>
The flush request is not transmitted over XDCR replication
configurations; the remote bucket will not be flushed.
</p></div>

Couchbase Server returns a HTTP 404 response if the URI is invalid or if it
does not correspond to an active bucket in the system.

```
404 Not Found
```

You can configure whether flush is enabled for a bucket by configuring the
individual bucket properties, either the REST API (see [Modifying Bucket
Parameters](#couchbase-admin-restapi-modifying-bucket-properties) ), or through
the Admin Console (see [Creating and Editing Data
Buckets](../cb-admin/#couchbase-admin-web-console-data-buckets-createedit) ).

