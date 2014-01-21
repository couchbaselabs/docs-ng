# Compaction REST API

## Set data and index compaction

Couchbase Server will write all data that you append, update and delete as files
on disk. This process can eventually lead to gaps in the data file, particularly
when you delete data. Be aware the server also writes index files in a
sequential format based on appending new results in the index. You can reclaim
the empty gaps in all data files by performing a process called compaction. In
both the case of data files and index files, you will want to perform frequent
compaction of the files on disk to help reclaim disk space and reduce disk
fragmentation. For more general information on this administrative task, see
[Database and View Compaction](../cb-admin/#couchbase-admin-tasks-compaction).

<a id="couchbase-admin-rest-compacting-bucket"></a>

### Compacting bucket data and indexes

To compact data files for a given bucket as well as any indexes associated with
that bucket, you make this request:

    curl -i -v -X POST -u admin:password http://localhost:8091/pools/default/buckets/bucket_name/controller/compactBucket

Replace the *admin*, *password*, *localhost*, and *bucket_name* values in the
above example with your actual values.
    
Where you provide the ip and port for a node that accesses the bucket as well as
the bucket name. You need to provide administrative credentials for
that node in the cluster. To stop bucket compaction, issue this request:

    curl -i -v -X POST -u admin:password http://localhost:8091/pools/default/buckets/bucket_name/controller/cancelBucketCompaction

Replace the *admin*, *password*, *localhost*, and *bucket_name* values in the
above example with your actual values.
    
**Compacting spatial views**

If you have spatial views in your dataset, these are not
automatically compacted with data and indexes. Instead, you must manually compact each spatial
view through the REST API.

To do this, you must call the spatial compaction endpoint:

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

    curl -u admin:password -X POST \
    'http://localhost:8091/default/_design/dev_test_spatial_compaction/_spatial/_compact'
    -H 'Content-type: application/json'

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
    
<a id="couchbase-admin-rest-auto-compaction"></a>

### Setting auto-compaction

In Couchbase Server you can also provide auto-compaction settings which will 
trigger data and view compaction based on certain settings. These settings can be 
made for an entire cluster or for a bucket in a cluster. 
For background information, see [Admin Tasks, Compaction Process](../cb-admin/#couchbase-admin-tasks-compaction-process). 
To details about each setting, see 
[Admin Tasks, Auto-Compaction Configuration](../cb-admin/#couchbase-admin-tasks-compaction-autocompaction)

**Auto-compaction API**

| REST API   | Description           
| ------------- |-------------| 
| POST /controller/setAutoCompaction   | Set cluster-wide auto-compaction intervals and thresholds
| GET /settings/autoCompaction  | Read cluster-wide settings for auto-compaction    
| GET /pools/default/buckets/*bucket_name* | Read auto-compaction settings for named bucket   
| POST/pools/default/buckets/*bucket_name* | Set auto-compaction interval or thresholds for named bucket

**Auto-compaction parameters**

You can use the following parameters for global auto-compaction settings which apply to all buckets in a cluster at `/controller/setAutoCompaction`. You also use these at `/pools/default/buckets/<bucket_name>`  
for bucket-level auto-compaction. You will need to provide administrative credentials to change these settings.

As of Couchbase Server 2.2+ you can provide a purge interval to remove the key and metadata 
for items that have been deleted or are expired. This is known as 'tombstone purging'. 
For background information, see [Introduction, Tombstone Purging](../cb-admin/#couchbase-introduction-tombstone-purge).

| Parameter   | Value | Notes
| ------------- |-------------|-------------|
| databaseFragmentationThreshold[percentage]  |  Integer between 2 and 100 | Percentage disk fragmentation for data
| databaseFragmentationThreshold[size] | Integer greater than 1 | Bytes of disk fragmentation for data
| viewFragmentationThreshold[percentage] | Integer between 2 and 100 |  Percentage disk fragmentation for index
| viewFragmentationThreshold[size] | Integer greater than 1 |  Bytes of disk fragmentation for index
| parallelDBAndViewCompaction | True or false | Run index and data compaction in parallel
| allowedTimePeriod[fromHour] | Integer between 0 and 23 | Compaction can occur from this hour onward
| allowedTimePeriod[toHour] | Integer between 0 and 23 | Compaction can occur up to this hour
| allowedTimePeriod[fromMinute] | Integer between 0 and 59 | Compaction can occur from this minute onward
| allowedTimePeriod[toMinute] | Integer between 0 and 59 | Compaction can occur up to this minute
| allowedTimePeriod[abortOutside] | True or false | Terminate compaction if process takes longer than allowed time
| purgeInterval | Integer between 1 and 60 | Number of days a item is deleted or expired. The key and metadata for that item will be purged by auto-compaction


To read current auto-compaction settings for a cluster:

        curl -u admin:password http://localhost:8091/settings/autoCompaction

Replace the *admin*, *password*, and *localhost* values in the above example
with your actual values.
        
This will result in JSON response as follows:

        {
           "purgeInterval": 3,
           "autoCompactionSettings": {
               "viewFragmentationThreshold": {
                   "size": "undefined",
                   "percentage": "undefined"
                },
                "databaseFragmentationThreshold": {
                    "size": "undefined",
                    "percentage": "undefined"
                },
             "parallelDBAndViewCompaction": false
           }
        }
        
This tells us we have a `purgeInterval` of three days and no current thresholds set for data or index compaction. The field `parallelDBAndViewCompaction` set to 'false' indicates the 
cluster will not perform data and index compaction in parallel. To see auto-compaction settings for a single bucket, 
use this request:

        curl -u admin:password http://localhost:8091/pools/default/buckets/bucket_name

Replace the *admin*, *password*, *localhost*, and *bucket_name* values in the
above example with your actual values.
        
Couchbase Server sends a JSON response with auto-compaction settings for the `bucket_name`:

    {
        "purgeInterval": 2,
        "autoCompactionSettings": {
            "viewFragmentationThreshold": {
                "size": "undefined",
                "percentage": 30
            },
            "databaseFragmentationThreshold": {
                "size": "undefined",
                "percentage": 30
            },
            "parallelDBAndViewCompaction": true
        }
    }

This indicates a tombstone `purgeInterval` of two days with a threshold of 30% disk fragmentation for data and views. This means items can be expired for two days or deleted two ago and their tombstones will be purged during the next auto-compaction run.cluster-wide

