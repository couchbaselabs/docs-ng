# Command-line Interface for Administration

Couchbase Server includes a number of command-line tools that can be used to
manage and monitor a Couchbase Server cluster or server. Most operations
correspond to Couchbase REST API requests, and were applicable we
cross-reference these REST reqeusts: [REST API for
Administration](couchbase-manual-ready.html#couchbase-admin-restapi).

Couchbase command-line tools are described individually within the following
sections:

Couchbase Server installer places tools in a number of directories, dependent on
the tool and platform. You can either go to that directory and use the command
line tool, or create a symbolic link to the directory:

<a id="table-couchbase-admin-cmdline-locs"></a>

**Linux**    | `/opt/couchbase/bin`                                                       
-------------|----------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cli`                                
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin`

<a id="couchbase-admin-cmdline-deprecated"></a>

## Command-Line Tools Availability

As of Couchbase Server 1.8.1 GA, the following command-line tools have been
deprecated and replaced with the corresponding tool as noted in the table below.
In Couchbase 1.8 and earlier versions, both sets of tools were available,
although those prefixed with m- or mb- were deprecated:

<a id="table-couchbase-admin-cmdline-changes"></a>

Deprecated Tool              | Replacement Tool            
-----------------------------|-----------------------------
`membase`                    | `couchbase-cli`             
`mbadm-online-restore`       | `cbadm-online-restore`      
`mbadm-online-update`        | `cbadm-online-update`       
`mbadm-tap-registration`     | `cbadm-tap-registration`    
`mbbackup-incremental`       | `cbbackup-incremental`      
`mbbackup-merge-incremental` | `cbbackup-merge-incremental`
`mbbackup`                   | `cbbackup`                  
`mbbrowse_logs`              | `cbbrowse_logs`             
`mbcollect_info`             | `cbcollect_info`            
`mbdbconvert`                | `cbdbconvert`               
`mbdbmaint`                  | `cbdbmaint`                 
`mbdbupgrade`                | `cbdbupgrade`               
`mbdumpconfig.escript`       | `cbdumpconfig.escript`      
`mbenable_core_dumps.sh`     | `cbenable_core_dumps.sh`    
`mbflushctl`                 | `cbflushctl`                
`mbrestore`                  | `cbrestore`                 
`mbstats`                    | `cbstats`                   
`mbupgrade`                  | `cbupgrade`                 
`mbvbucketctl`               | `cbvbucketctl`              

Using a deprecated tool will result in a warning message that the tool is
deprecated and will no longer be supported.

<a id="couchbase-admin-cmdline-couchbase-cli"></a>

## Using couchbase-cli

<a id="table-couchbase-admin-cmdline-couchbase-cli-locs"></a>

**Linux**    | `/opt/couchbase/bin/couchbase-cli`                                                       
-------------|------------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cli\couchbase-cli.exe`                            
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin/couchbase-cli`

This tool provides access to various management operations for Couchbase Server
clusters, nodes and buckets. The basic usage format is:


```
couchbase-cli COMMAND CLUSTER [OPTIONS]
```

Where:

 * `COMMAND` is a command from
   [](couchbase-manual-ready.html#couchbase-admin-cmdline-couchbase-commands)

 * `CLUSTER` is a cluster specification. You can use either:

    ```
    --cluster=HOST[:PORT]
    ```

   Or the shortened form:

    ```
    -c HOST[:PORT]
    ```

 * `OPTIONS` is zero or more options.

<a id="couchbase-admin-cmdline-couchbase-commands"></a>

Command            | Description                                        
-------------------|----------------------------------------------------
`server-list`      | List all servers in a cluster                      
`server-info`      | Show details on one server                         
`server-add`       | Add one or more servers to the cluster             
`server-readd`     | Re-add a server that was failed over to the cluster
`rebalance`        | Start a cluster rebalancing                        
`rebalance-stop`   | Stop current cluster rebalancing                   
`rebalance-status` | Show status of current cluster rebalancing         
`failover`         | Failover one or more servers                       
`cluster-init`     | Set the username, password and port of the cluster 
`node-init`        | Set node specific parameters                       
`bucket-list`      | List all buckets in a cluster                      
`bucket-create`    | Add a new bucket to the cluster                    
`bucket-edit`      | Modify an existing bucket                          
`bucket-delete`    | Delete an existing bucket                          
`bucket-flush`     | Flush a given bucket                               
`help`             | Show longer usage/help and examples                

<a id="couchbase-admin-cmdline-couchbase-commands-stdopts"></a>

Option                               | Command                                   | Description                                                                                     
-------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------
`--user=USERNAME`, `-u USERNAME`     |                                           | Administrator username for accessing the cluster                                                
`--password=PASSWORD`, `-p PASSWORD` |                                           | Administrator password for accessing the cluster                                                
`--output=KIND`, `-o KIND`           |                                           | Output kind, either `json` for JSON format, or `standard` for the native format for the command.
`--debug`, `-d`                      |                                           | Output debug information.                                                                       
`--server-add=HOST[:PORT]`           | `server-add`, `server-readd`, `rebalance` | Server to be added                                                                              
`--server-add-username=USERNAME`     | `server-add`, `server-readd`, `rebalance` | Admin username for the server to be added                                                       
`--server-add-password=PASSWORD`     | `server-add`, `server-readd`, `rebalance` | Admin password for the server to be added                                                       
`--server-remove=HOST[:PORT]`        | `rebalance`                               | The server to be removed                                                                        
`--server-failover=HOST[:PORT]`      | `failover`                                | Server to failover                                                                              
`--cluster-init-username=USER`       | `cluster-init`                            | New admin username                                                                              
`--cluster-init-password=PASSWORD`   | `cluster-init`                            | New admin password                                                                              
`--cluster-init-port=PORT`           | `cluster-init`                            | New cluster port                                                                                
`--cluster-init-ramsize=300`         | `cluster-init`                            | New RAM quota                                                                                   
`--bucket=BUCKETNAME`                | `bucket*`                                 | Bucket to act on                                                                                
`--bucket-type=TYPE`                 | `bucket*`                                 | Memcached or Couchbase                                                                          
`--bucket-port=PORT`                 | `bucket*`                                 | Supports ASCII protocol and is auth-less                                                        
`--bucket-password=PASSWORD`         | `bucket*`                                 | Standard port, exclusive with bucket-port                                                       
`--bucket-ramsize=RAMSIZEMB`         | `bucket*`                                 | RAM quota in MB                                                                                 
`--bucket-replica=COUNT`             | `bucket*`                                 | Replication count                                                                               

<a id="couchbase-cli-list-servers"></a>

### Listing Servers

To list servers in a cluster you can provide the host:port for any one of the
nodes in the cluster and also provide the `--output=json` option as we do below:


```
shell> couchbase-cli server-list -c 192.168.0.1:8091 -u Administrator -p password --output=json
```

This will return the following information about the cluster as well as nodes in
the cluster:

 * Memory usage, including quotas and consumption for RAM and disk.

 * List of nodes in cluster, including Couchbase Server version, OS, and memory per
   node.

 * List of REST API endpoints for cluster.

 * Failover and alert settings for the cluster.

If you do not provide the `--output=json` option, you will get a response from
the individual node your provided in your command and whether the node is
active.

<a id="couchbase-cli-get-server-info"></a>

### Getting Node Information

To retrieve information about a specified node, provide the host:port for that
particular node:


```
shell> couchbase-cli server-info -c 192.168.0.1:8091 -u Administrator -p password
```

Couchbase Server returns information about the node, including:

 * Whether the node is functioning or not.

 * Memory usage, including allocated memory, memory quota and free memory.

 * Items stored for node, total items, including replica data.

 * CPU utilization for the node.

 * Ports and disk path associated with a node.

 * Availability and uptime for the node.

<a id="couchbase-cli-adding-node"></a>

### Adding Nodes to a Cluster

To a node to a cluster without performing rebalance, you use the `server-add`
command:


```
shell> couchbase-cli server-add -c 192.168.0.1:8091 \
     --server-add=192.168.0.2:8091 -u Administrator -p password
```

To a node to a cluster and then immediately rebalance the cluster, you use the
`rebalance` command with the `--server-add=HOST[:PORT]` option. In the option
provide the host and port for the node you want to add to the cluster:


```
shell> couchbase-cli rebalance -c 192.168.0.1:8091 \
     --server-add=192.168.0.2:8091
```

<a id="couchbase-cli-removing-nodes"></a>

### Removing Nodes from Clusters

To remove a node from the cluster, use the `rebalance` command and specify the
URI for the node you want to remove in the `--server-remove` option:


```
shell> couchbase-cli rebalance -c 10.4.2.4:8091 -u Administrator -p password --server-remove=10.4.2.4:8091
```

Additional servers can be specified by using addition `--server-remove` option.
The operation imediately triggers s rebalance after the nodes have been removd
from the cluster.


```
INFO: rebalancing . . . . . . . . . . . . . . .
```

<a id="couchbase-cli-rebalancing"></a>

### Rebalancing a Cluster

To remove a node from a cluster and then rebalance the entire cluster, use the
`rebalance` command with the `--server-remove=HOST[:PORT]` option. In the option
specify the host and port for the node you want to remove:


```
shell> couchbase-cli rebalance -c 192.168.0.1:8091 \
     --server-remove=192.168.0.2:8091
```

To remove and add nodes to/from a cluster and then rebalance, use the
`rebalance` command with the `--server-remove=HOST[:PORT]` and
`--server-add=HOST[:PORT]` options:


```
shell> couchbase-cli rebalance -c 192.168.0.1:8091 \
      --server-remove=192.168.0.2 \
      --server-add=192.168.0.4
```

Couchbase Server will remove one node, add another node, and then perform a
cluster rebalance. During the rebalance, you will see status updates from the
server:


```
. METHOD: GET
PARAMS:  {}
ENCODED_PARAMS:
REST CMD: GET /pools/default/rebalanceProgress
response.status: 200
```

To view the status of a cluster rebalance, use the `rebalance-status` command:


```
shell> couchbase-cli rebalance-status -c 10.4.2.6 -u Administrator -p password
```

If the rebalance is in progress without any errors, Couchbase Server will
return:


```
(u'running', None)
```

To stop a current cluster rebalance, use the `rebalance-stop` command:


```
shell> couchbase-cli rebalance-stop -c 192.168.0.1:8091
```

When Couchbase server stops the rebalance, it will return:


```
SUCCESS: rebalance cluster stopped
```

<a id="couchbase-cli-initializing-nodes"></a>

### Initializing Nodes

Initialize a new node on the cluster


```
shell> couchbase-cli cluster-init -c 192.168.0.1:8091 \
      --cluster-init-username=Administrator \
      --cluster-init-password=password \
      --cluster-init-port=8080 \
      --cluster-init-ramsize=8192
```

<a id="couchbase-cli-viewing-buckets"></a>

### Viewing Buckets

To list all buckets in a cluster use the `bucket-list` command. For this
operation, Couchbase Server does not require authentication:


```
shell> couchbase-cli bucket-list -c 192.168.0.1:8091
```

Couchbase Server returns a list of buckets in the cluster, including:

 * The type of bucket, either membase or couchbase bucket.

 * Memory usage for the bucket, included memory quota, memory used, and number of
   replicas for the bucket.

 * What type of authentication is required for a bucket, either none or SASL.

<a id="couchbase-cli-creating-buckets"></a>

### Creating New Buckets

Create a new couchbase bucket with a dedicated port with the `bucket-create`
command and associated bucket options. Note that the minimum size you can
specify is 100MB, and the maximum number of replicas is 3.


```
shell> couchbase-cli bucket-create -c 192.168.0.1:8091 --bucket=test_bucket \
      --bucket-type=couchbase --bucket-port=11222 --bucket-ramsize=200 \
      --bucket-replica=1
```

To create a new memcached bucket with SASL authentication use the
`bucket-create` command and the `--bucket-password=PASSWORD` option:


```
shell> couchbase-cli bucket-create -c 192.168.0.1:8091 --bucket=test_bucket \
      --bucket-type=memcached--bucket-password=password \
      --bucket-ramsize=200
```

To view the status of a cluster rebalance, use the

<a id="couchbase-cli-updating-bucket-properties"></a>

### Updating Bucket Properties

The following is an example demonstration how to modify the port dedicated to a
bucket. In the case of updating bucket properties with `couchbase-cli` you
should provide other existing bucket properties as options, even though you
might not be changing these other properties. This is because the command to
update bucket properties may interpret missing options as meaning the option
should be reset to a default/nothing. We recommend you review the current bucket
properties and provide your new option and existing options that you want to
maintain:


```
shell> couchbase-cli bucket-edit -c 192.168.0.1:8091 --bucket=test_bucket \
      --bucket-port=11222 --bucket-ramsize=400
```

You cannot change the name of a bucket with `couchbase-cli`, the Couchbase REST
API, or Couchbase Administration Console. You can however delete the bucket and
create a new bucket with the new name and properties of your choice.

<a id="couchbase-cli-deleting-buckets"></a>

### Deleting Buckets

To delete a bucket:

This operation is data destructive. The service makes no attempt to confirm with
the user before removing a bucket. Client applications using this are advised to
check again with the end user, or client application before sending such a
request.


```
shell> couchbase-cli bucket-delete -c 192.168.0.1:8091 --bucket=test_bucket
```

<a id="couchbase-admin-cmdline-cbstats"></a>

## Using cbstats

You can use `cbstats` to access information about individual nodes, and the
buckets associated with the nodes, in a Couchbase cluster. The utility is
located in one of the following directories, depending upon your platform
install:

<a id="table-couchbase-admin-cmdline-cbstats-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbstats`                                                       
-------------|------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbstats.exe`                                
**Mac OS X** | `/Applications/Couchbase \Server.app/Contents/Resources/couchbase-core/bin/cbstats`

[You can use this utility to getcouchbase node
statistics](couchbase-manual-ready.html#couchbase-monitoring-nodestats). The
general format for using it is:


```
shell> cbstats HOST:BUCKET_PORT COMMAND [-flags] [bucketname password]
```

For this command, note that host and port are specifically for a bucket, not a
node or cluster. The following describes the command format:

 * `HOST` is the hostname and `BUCKET_PORT` is the dedicated port for the bucket.

 * `COMMAND` is one of the `cbstats` from the commands listed below.

 * `-flags` are one of the optional flags described below.

 * `bucketname` is the name of the Couchbase or memcached bucket.

 * `password` is the for bucket-level authentication.

The following are the possible `cbstats` commands you can use:

<a id="couchbase-admin-cmdline-cbstats-commands"></a>

Command                   | Description                                                                               
--------------------------|-------------------------------------------------------------------------------------------
`all`                     | Provides statistics for a named bucket.                                                   
`allocator`               | Memory allocation for bucket, if exists.                                                  
`checkpoint [vbid]`       | Checkpoints are internal markers used to flag items in queue. View them with this command.
`dispatcher [logs]`       |                                                                                           
`hash [detail]`           |                                                                                           
`items`                   |                                                                                           
`kvstore`                 |                                                                                           
`kvtimings`               |                                                                                           
`raw argument`            |                                                                                           
`reset`                   | Resets hit- and miss- counters which indicate number of requests and failed requests.     
`slabs`                   |                                                                                           
`tap [username password]` |                                                                                           
`tapagg`                  |                                                                                           
`timings`                 | Shows history and time durations of different read/write operations. In milliseconds.     
`vkey keyname vbid`       |                                                                                           
`help`                    |                                                                                           

For example, the `cbstats` output can be used with other command-line tools to
sort and filter the data.


```
watch --diff "cbstats \
    ip-10-12-19-81:11210 all | egrep 'item|mem|flusher|ep_queue|bg|eje|resi|warm'"
```

<a id="cbstats-all-bucket-info"></a>

### Retrieving Bucket Statistics

Use the `all` command to get information about a named bucket:


```
./cbstats 10.4.2.5:11220 all newbucket password | grep -E 'uptime|bytes_read|bytes_written'
```

The types of bucket statistics returned by `all` include:

 * Connection information for the bucket including attempted connections,
   rejections and port information.

 * Hits and Misses: hits are the number of requests made for bucket information and
   misses are requests made for keys that cannot be found. Both hit- and miss-
   statistics are grouped by operation.

 * Memory quota and usage.

Couchbase Server will return these statistics about a memcached or Couchbase
bucket. In the case of memcached buckets, statistics about persistence do not
apply and therefore do not appear:

<a id="couchbase-admin-cbstats-all-output"></a>

Name                                              | Description                                                                                                                                                                
--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`accepting_conns`                                 | Connections accepted by a node.                                                                                                                                            
`auth_cmds`                                       | Number of authentication commands handled with success or failure.                                                                                                         
`auth_errors`                                     | Number of failed authentications.                                                                                                                                          
`bucket_active_conns`                             | Active connection to bucket.                                                                                                                                               
`bucket_conns`                                    |                                                                                                                                                                            
`bytes_read`                                      | Total number of bytes read by this node from network.                                                                                                                      
`bytes_written`                                   | Total number of bytes sent by this node to network.                                                                                                                        
`cas_badval`                                      | Total number of CAS commands that failed to modify a value due to a bad CAS id.                                                                                            
`cas_hits`                                        | Number of successful CAS requests.                                                                                                                                         
`cas_misses`                                      | Number of CAS requests against missing keys.                                                                                                                               
`cmd_flush`                                       |                                                                                                                                                                            
`Cumulative number of flush requests for bucket.` |                                                                                                                                                                            
`cmd_get`                                         | Cumulative number of get requests for node.                                                                                                                                
`cmd_set`                                         | Cumulative number of set requests for node.                                                                                                                                
`conn_yields`                                     | Number of times any connection yielded to another one due to hitting the -R limit.                                                                                         
`connection_structures`                           | Number of connection structures allocated by node.                                                                                                                         
`curr_connections`                                | Number of open connections                                                                                                                                                 
`curr_connections`                                | Number of open connections                                                                                                                                                 
`curr_items`                                      | Current number of items stored.                                                                                                                                            
`curr_items_tot`                                  | Number of current items including those not active (replica, dead and pending states.)                                                                                     
`daemon_connections`                              | Number of connection structures used by this node internally.                                                                                                              
`decr_hits`                                       | Number of successful decrement requests.                                                                                                                                   
`decr_misses`                                     | Number of decrement requests against missing keys.                                                                                                                         
`delete_hits`                                     | Number of deletion requests against missing keys.                                                                                                                          
`delete_misses`                                   | Number of deletion requests against missing keys.                                                                                                                          
`ep_bg_fetched`                                   | Number of items fetched from disk.                                                                                                                                         
`ep_commit_num`                                   | Total number of write commits.                                                                                                                                             
`ep_commit_time`                                  | Number of seconds transpired for most recent commit.                                                                                                                       
`ep_commit_time_total`                            | Cumulative seconds spent committing.                                                                                                                                       
`ep_data_age`                                     | Age of data that has been persisted to disk.                                                                                                                               
`ep_data_age_highwat`                             | Oldest age of data that has been persisted to disk                                                                                                                         
`ep_db_cleaner_status`                            | Status of database maintenance process that removes invalid items with old vBucket versions.                                                                               
`ep_db_strategy`                                  | SQLite db strategy.                                                                                                                                                        
`ep_dbinit`                                       | Number of seconds to initialize DB.                                                                                                                                        
`ep_dbshards`                                     | Number of shards for db store                                                                                                                                              
`ep_diskqueue_drain`                              | Total items in queue to be persisted that have been stored on disk.                                                                                                        
`ep_diskqueue_fill`                               | Total items waiting in queue to be stored on disk.                                                                                                                         
`ep_diskqueue_items`                              | Total items in disk queue.                                                                                                                                                 
`ep_diskqueue_memory`                             | Total memory used in disk queue.                                                                                                                                           
`ep_diskqueue_pending`                            | Total bytes of pending disk writes.                                                                                                                                        
`ep_exp_pager_stime`                              | Interval set for regular maintenance process that removes expired items from node. In seconds.                                                                             
`ep_expired`                                      | Number of times any item was expired for a node/bucket.                                                                                                                    
`ep_flush_all`                                    | Boolean that is set to true if disk flush\_all is scheduled.                                                                                                               
`ep_flush_all`                                    | Boolean that is set to true if disk flush\_all is scheduled.                                                                                                               
`ep_flush_duration`                               | Number of seconds duration of most recent flush.                                                                                                                           
`ep_flush_duration_highwat`                       | Longest duration required to flush data.                                                                                                                                   
`ep_flush_duration_total`                         | Cumulative seconds spent flushing data.                                                                                                                                    
`ep_flush_preempts`                               | Number of flush early exits for read requests.                                                                                                                             
`ep_flusher_deduplication`                        |                                                                                                                                                                            
`ep_flusher_state`                                | Current state of the flusher thread.                                                                                                                                       
`ep_flusher_todo`                                 | Number of items remaining to be written to disk.                                                                                                                           
`ep_inconsistent_slave_chk`                       | Flag indicating whether we allow a “downstream” master to receive checkpoint messages.                                                                                     
`ep_io_num_read`                                  | Number of io read operations.                                                                                                                                              
`ep_io_num_write`                                 | Number of io write operations.                                                                                                                                             
`ep_io_read_bytes`                                | Number of bytes read (key + values)                                                                                                                                        
`ep_io_write_bytes`                               | Number of bytes written (key + values).                                                                                                                                    
`ep_item_begin_failed`                            | Number of times a transaction failed to start due to storage errors.                                                                                                       
`ep_item_commit_failed`                           | Number of times a transaction failed to commit data due to storage errors.                                                                                                 
`ep_item_flush_expired`                           | Number of times an item is not flushed due to the expiry of the item.                                                                                                      
`ep_item_flush_failed`                            | Number of times an item failed to flush due to storage errors.                                                                                                             
`ep_items_rm_from_checkpoints`                    | Number of items removed from closed unreferenced checkpoints.                                                                                                              
`ep_keep_closed_checkpoints`                      | Boolean indicating a checkpoint status retained or deleted.                                                                                                                
`ep_kv_size`                                      | Memory used to store item metadata, keys and values, regardless of a vBucket state. If Couchbase Server ejects a value, it decrements this number by the size of the value.
`ep_latency_arith_cmd`                            | The total elapsed time for increment and decrement requests.                                                                                                               
`ep_latency_get_cmd`                              | The total elapsed time for get requests for bucket/node.                                                                                                                   
`ep_latency_store_cmd`                            | The total elapsed time for store requests.                                                                                                                                 
`ep_max_data_size`                                | Maximum amount of data allowed in memory.                                                                                                                                  
`ep_max_txn_size`                                 | Max number of updates per transaction.                                                                                                                                     
`ep_mem_high_wat`                                 | High water mark for auto-evictions.                                                                                                                                        
`ep_mem_low_wat`                                  | Low water mark for auto-evictions.                                                                                                                                         
`ep_mem_tracker_enabled`                          |                                                                                                                                                                            
`ep_min_data_age`                                 | Minimum age for data before it can be persisted.                                                                                                                           
`ep_num_active_non_resident`                      | Number of non-resident items in active vBuckets. Non-resident items have their values ejected onto disk.                                                                   
`ep_num_checkpoint_remover_runs`                  | Number of times Couchbase Server ran checkpoint remover to remove closed unreferenced checkpoints.                                                                         
`ep_num_eject_failures`                           | Number of values that could not be ejected from RAM to disk.                                                                                                               
`ep_num_eject_replicas`                           | Number of times Couchbase Server ejected replica values from memory to disk.                                                                                               
`ep_num_expiry_pager_runs`                        | Number of times Couchbase Server ran maintenance processes to purge expired items from memory/disk.                                                                        
`ep_num_non_resident`                             | The number of non-resident items. Non-resident items are keys that have the key and metadata stored in RAM, but the value is ejected onto disk.                            
`ep_num_not_my_vbuckets`                          | Number of times a 'Not My VBucket' exception has occurred for a node. This exception occurs when a request comes for data stored in another vBucket associated with a node.
`ep_num_pager_runs`                               | Number of times this node has run the maintenance process to free additional memory.                                                                                       
`ep_onlineupdate`                                 | Returns true if engine is in online updated mode.                                                                                                                          
`ep_onlineupdate_revert_add`                      | Number of reverted newly added items.                                                                                                                                      
`ep_onlineupdate_revert_delete`                   | Number of reverted deleted items.                                                                                                                                          
`ep_onlineupdate_revert_update`                   | Number of reverted updated items.                                                                                                                                          
`ep_oom_errors`                                   | Number of times an unrecoverable out of memory error occurred while this node processed requests.                                                                          
`ep_overhead`                                     | Extra memory used by transient data, such as persistence queue, replication queues, checkpoints, and so forth.                                                             
`ep_pending_ops`                                  | Number of operations awaiting pending vBuckets.                                                                                                                            
`ep_pending_ops_max`                              | Maximum operations awaiting 1 pending vBucket.                                                                                                                             
`ep_pending_ops_max_duration`                     | Maximum time used waiting on pending vBuckets.                                                                                                                             
`ep_pending_ops_total`                            | Total blocked pending operations.                                                                                                                                          
`ep_queue_age_cap`                                | Queue age cap setting.                                                                                                                                                     
`ep_queue_size`                                   | Number of items queued for storage.                                                                                                                                        
`ep_storage_age`                                  | How long an item has been waiting in queue to be persisted to disk.                                                                                                        
`ep_storage_age_highwat`                          | The longest an item has been waiting in queue to be persisted to disk.                                                                                                     
`ep_storage_type`                                 | Indicates whether disk storage is SQLite or Couchstore.                                                                                                                    
`ep_store_max_concurrency`                        | Maximum allowed concurrency at the storage level.                                                                                                                          
`ep_store_max_readers`                            | Maximum number of concurrent read-only storage threads allowed for this node.                                                                                              
`ep_store_max_readwrite`                          | Maximum number of concurrent read-write storage threads allowed for this node.                                                                                             
`ep_tap_bg_fetch_requeued`                        | Number of times a TAP background fetch task is requeued.                                                                                                                   
`ep_tap_bg_fetched`                               | Number of TAP background fetches from disk.                                                                                                                                
`ep_tap_keepalive`                                | How long to maintain existing TAP connection state after a client disconnect.                                                                                              
`ep_tmp_oom_errors`                               | Number of times temporary out of memory errors have occurred for this node while processing requests.                                                                      
`ep_too_old`                                      | Number of times an object was stored on disk after being stale for too long.                                                                                               
`ep_too_young`                                    | Number of times an object is not stored on disk because it is too new.                                                                                                     
`ep_total_cache_size`                             | Total size of all items for this node, regardless of vBucket state, or whether or not the value for an item is ejected into RAM.                                           
`ep_total_del_items`                              | Total number of items flagged for deletion that are persisted on disk.                                                                                                     
`ep_total_enqueued`                               | Total number of items waiting in queue to be persisted on disk.                                                                                                            
`ep_total_new_items`                              | Total new keys for a node that have been persisted.                                                                                                                        
`ep_total_persisted`                              | Total number of items for node that have been persisted.                                                                                                                   
`ep_uncommitted_items`                            | Items that are new or updated but are not yet persisted.                                                                                                                   
`ep_value_size`                                   | Memory used to store values for resident keys. These are items which are stored on both RAM and disk in entirety.                                                          
`ep_vb_total`                                     | Total number of vBuckets.                                                                                                                                                  
`ep_vbucket_del`                                  | Number of deletions that have occurred for a vBucket.                                                                                                                      
`ep_vbucket_del_fail`                             | Number of deletions that have failed for a vBucket.                                                                                                                        
`ep_version`                                      | Version number of underlying Couchbase Server component, ep\_engine.                                                                                                       
`ep_warmed_up`                                    | Number of items warmed up.                                                                                                                                                 
`ep_warmup`                                       | True if node is ready to accept new writes and reads.                                                                                                                      
`ep_warmup_dups`                                  | Duplicates encountered during node warmup.                                                                                                                                 
`ep_warmup_oom`                                   | Out of memory errors encountered during warmup.                                                                                                                            
`ep_warmup_thread`                                | Indicates complete if the node is done with its initialization phase.                                                                                                      
`ep_warmup_time`                                  | Time (µs) spent by warming data.                                                                                                                                           
`get_hits`                                        | Number of keys that have been requested and found.                                                                                                                         
`get_misses`                                      | Number of items that have been requested but not found.                                                                                                                    
`incr_hits`                                       | Number of successful increment requests.                                                                                                                                   
`incr_misses`                                     | Number of increment requests made for keys that cannot be found.                                                                                                           
`libevent`                                        | Maximum number of bytes this node is allowed to use for storage.                                                                                                           
`limit_maxbytes`                                  | Total number of items for node that have been persisted.                                                                                                                   
`listen_disabled_num`                             | Occurs if there are too many simultaneous connections. Incremented when Couchbase Server rejects a connection request.                                                     
`max_conns_on_port_`                              | Maximum number of connections allowed on specified port.                                                                                                                   
`mem_used`                                        | Total memory used by Couchbase Server component, ep\_engine.                                                                                                               
`pid`                                             | ID for this server process.                                                                                                                                                
`pointer_size`                                    | Default size of pointers on the host OS; typically 32- or 64- bit.                                                                                                         
`rejected_conns`                                  | Connection requests rejected by this node.                                                                                                                                 
`rusage_system`                                   | Accumulated system time for this process, in form for seconds:microseconds.                                                                                                
`rusage_user`                                     | Accumulated user time for this process, in form for seconds:microseconds.                                                                                                  
`threads`                                         | Number of worker threads requested.                                                                                                                                        
`time`                                            | Current UNIX time according to the node.                                                                                                                                   
`uptime`                                          | Number of seconds since this node initially started                                                                                                                        
`vb_active_curr_items`                            | Number of items in RAM.                                                                                                                                                    
`vb_active_eject`                                 | Number of times this node ejected values from RAM onto disk.                                                                                                               
`vb_active_ht_memory`                             | Memory used to store keys and values                                                                                                                                       
`vb_active_itm_memory`                            | Total items in memory.                                                                                                                                                     
`vb_active_num`                                   | Number of active vBuckets                                                                                                                                                  
`vb_active_num_non_resident`                      | Number of non-resident items; non-resident items are those with keys and metadata in RAM, but the values are stored on disk to conserve resources.                         
`vb_active_ops_create`                            | Number of create requests made on node.                                                                                                                                    
`vb_active_ops_delete`                            | Number of delete requests made on node.                                                                                                                                    
`vb_active_ops_reject`                            | Number of requests made on node but rejected by node.                                                                                                                      
`vb_active_ops_update`                            | Number of update requests made on node.                                                                                                                                    
`vb_active_perc_mem_resident`                     | Percentage of memory taken up by resident data. This is data where the key, metadata and value all reside in RAM.                                                          
`vb_active_queue_age`                             | Total of all ages for items in disk queue. In milliseconds.                                                                                                                
`vb_active_queue_drain`                           | Total number of keys that have been drained from a disk-write queue.                                                                                                       
`vb_pending_queue_fill`                           | Total items waiting in queue for disk write.                                                                                                                               
`vb_pending_queue_memory`                         | Total memory used by queue for disk writes.                                                                                                                                
`vb_pending_queue_pending`                        | Total bytes used by items awaiting disk persistence.                                                                                                                       
`vb_pending_queue_size`                           | Pending items in disk-write queue.                                                                                                                                         
`vb_replica_curr_items`                           | Number of items for vBuckets in replica state.                                                                                                                             
`vb_replica_eject`                                | Number of times the value for a key has been ejected from RAM to disk.                                                                                                     
`vb_replica_ht_memory`                            | Memory used to store keys and values.                                                                                                                                      
`vb_replica_itm_memory`                           | Total bytes taken up by items memory.                                                                                                                                      
`vb_replica_num`                                  | Number of replica vBuckets for this node.                                                                                                                                  
`vb_replica_num_non_resident`                     | Number of non-resident items; these are keys and associated metadata in RAM, while the associated value for the keys are stored on disk.                                   
`vb_replica_ops_create`                           | Number of create requests made for replica-state vBuckets.                                                                                                                 
`vb_replica_ops_delete`                           | Number of delete requests made for replica-state vBuckets..                                                                                                                
`vb_replica_ops_reject`                           | Number of rejected requests made for replica-state vBuckets.                                                                                                               
`vb_replica_ops_update`                           | Number of update requests made for replica-state vBuckets.                                                                                                                 
`vb_replica_perc_mem_resident`                    | Percentage of resident memory. Resident data are items stored entirely in RAM and disk, including keys, values, and metadata.                                              
`vb_replica_queue_age`                            | Total age in milliseconds of items waiting in queue to be stored to disk.                                                                                                  
`vb_replica_queue_drain`                          | Total items from this vBucket drained from the disk-write queue.                                                                                                           
`vb_replica_queue_fill`                           | Total items awaiting disk persistence from this vBucket.                                                                                                                   
`vb_replica_queue_memory`                         | Memory used for disk queue for this vBucket.                                                                                                                               
`vb_replica_queue_pending`                        | Total bytes of disk-queue items for this vBucket                                                                                                                           
`vb_replica_queue_size`                           | Replica items in disk queue.                                                                                                                                               
`version`                                         | Version number of ep\_engine component.                                                                                                                                    

<a id="cbstats-allocator"></a>

### Viewing Memory Allocations

To view memory allocations, and memory usage for a bucket:

Couchbase Server 1.8 on OSX using different memory allocation than other
platforms, therefore this information is not available.


```
./cbstats 10.4.2.5:11210 allocator -a -b _admin -p _admin
```

<a id="cbstats-timings"></a>

### Viewing Timing for Operations

You may find this information useful for measuring your node and cluster. This
command returns the time required for operations to complete. All times are
provided in milliseconds:


```
./cbstats 10.4.2.5:11210 timings
```

Couchbase Server returns a histogram showing total operations, and then detail
about operations that completed within different time intervals:


```
(1 total)
    0 - 1us       : (100.00%) 1 ##################################################
 disk_invalid_vbtable_del (1 total)
    1ms - 2ms     : (100.00%) 1 ##################################################
 get_stats_cmd (3702 total)
    0 - 1us       : (  0.05%)   2
    1us - 2us     : (  4.73%) 173 ##
    2us - 4us     : ( 29.58%) 920 ###########
    4us - 8us     : ( 30.90%)  49
    8us - 16us    : ( 31.06%)   6
    32us - 64us   : ( 31.58%)  19
    64us - 128us  : ( 40.46%) 329 ####
    128us - 256us : ( 55.73%) 565 #######
    256us - 512us : ( 60.37%) 172 ##
    512us - 1ms   : ( 72.42%) 446 #####
    1ms - 2ms     : ( 82.66%) 379 ####
    2ms - 4ms     : ( 98.54%) 588 #######
    4ms - 8ms     : ( 99.95%)  52
    8ms - 16ms    : (100.00%)   2
 set_vb_cmd (1024 total)
    8us - 16us    : (  0.49%)   5
    16us - 32us   : ( 76.56%) 779 ####################################
    32us - 64us   : ( 98.83%) 228 ##########
    64us - 128us  : (100.00%)  12
```

<a id="couchbase-admin-cmdline-cbflushctl"></a>

## Using cbflushctl

The `cbflushctl` command enables you to control many of the configuration, RAM
and disk parameters of a running cluster.

Changes to the cluster configuration using `cbflushctl` are not retained after a
cluster restart. Any configuration you had set will return to cluster defaults.

You can find this tool at one of the following locations, depending upon your
platform:

<a id="table-couchbase-admin-cmdline-cbflushctl-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbflushctl`                                                       
-------------|---------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbflushctl.exe`                                
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin/cbflushctl`

Usage:


```
cbflushctl host:port COMMAND bucket-name bucket-password
```

Where `COMMAND` is one of the following commands:

 * `drain`

   Drain the disk write queue for the specified bucket.

 * `start`

   Enable the disk write queue for the specified bucket (start persistence).

 * `stop`

   Disable the disk write queue for the specified bucket (stop persistence).

 * `evict key`

   Evict the specified key from memory, providing the key has been persisted to
   disk.

 * `set`

   Set the value for a configurable parameter within the persistence system. For
   more information, see [cbflushctlset
   Command](couchbase-manual-ready.html#couchbase-admin-cmdline-cbflushctl-set).

Note that for each command you must specify the bucketname (and bucket password
if configured) to configure the appropriate bucket. If you want to set the
parameter on multiple buckets you must specify each bucket individually.

<a id="couchbase-admin-cmdline-cbflushctl-set"></a>

### cbflushctlset Command

The `set` command configures a specific parameter or value within the
persistence component. This is used to enable or configure specific behaviour
within the persistence system, such as disabling the client `flush_all` command
support, or changing the watermarks used when determining keys to be evicted
from RAM after they have been persisted.

 * `bg_fetch_delay`

   Delay before executing a bg fetch (test feature)

 * `chk_max_items`

   Maximum items before creating a new checkpoint

 * `chk_period`

   Duration before creating a new checkpoint

 * `exp_pager_stime`

   Expiry Pager Sleeptime

 * `inconsistent_slave_chk`

   Enables active to active replication

 * `queue_age_cap`

   Maximum queue age before flushing data

 * `max_checkpoints`

   Maximum number of checkpoints

 * `max_size`

   Max memory used by the server

 * `max_txn_size`

   Maximum number of items in a flusher transaction

 * `mem_high_wat`

   High water mark

 * `mem_low_wat`

   Low water mark

 * `min_data_age`

   Minimum data age before flushing data

 * `sync_cmd_timeout`

   The timeout for the sync command

 * `tap_throttle_queue_cap`

   Destination disk write queue cap for tap backoff ('infinite' means no cap)

 * `tap_throttle_threshold`

   Destination memory threshold for tap backoff

 * `keep_closed_chks`

   Keep all closed checkpoints in memory

 * `flushall_enabled`

   Enable or disable the `flush_all` operation. The `flush_all` operation is
   disabled by default in Couchbase Server 1.8.1. To enable support for the
   `flush_all` operation it must be enabled on each bucket:

    ```
    shell> cbflushctl localhost:11210 set flushall_enabled true sample sample
    ```

   To disable `flush_all` on a given bucket, set `flushall_enabled` to false:

    ```
    shell> cbflushctl localhost:11210 set flushall_enabled false sample sample
    ```

<a id="couchbase-admin-cmdline-tappy"></a>

## Using tap.py

<a id="table-couchbase-admin-cmdline-tappy-locs"></a>

**Linux** | `/opt/couchbase/bin/ep_engine/management/tap.py`
----------|-------------------------------------------------

Usage:


```
/opt/couchbase/bin/ep_engine/management/tap.py host:port
```

<a id="couchbase-admin-cmdline-cbvbucketctl"></a>

## Using cbvbucketctl

<a id="table-couchbase-admin-cmdline-cbvbucketctl-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbvbucketctl`                                                       
-------------|-----------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbvbucketctl.exe`                                
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents/Resources/couchbase-core/bin/cbvbucketctl`

Usage:


```
mbvbucketctl Usage:
mbvbucketctl host:port list [username password] or
mbvbucketctl host:port rm vbid [username password] or
mbvbucketctl host:port set vbid vbstate [username password]
```

<a id="couchbase-admin-cmdline-cbvbuckettool"></a>

## Usingcbvbuckettool

Usage:


```
shell> cbvbuckettool mapfile key0 [key1 ... keyN]
```

The `cbvbuckettool` expects a vBucketServerMap JSON mapfile, and will print the
vBucketId and servers each key should live on. You may use '-' instead for the
filename to specify stdin.

Examples:


```
shell> cbvbuckettool file.json some_key another_key
```

Or


```
shell> curl http://host:8091/pools/default/buckets/default | cbvbuckettool - some_key another_key
```

An example of running it with output:


```
shell> curl http://127.0.0.1:8091/pools/default/buckets/default | cbvbuckettool - some_key another_key
key: some_key vBucketId: 260 master: http://127.0.0.1:11210/ replicas:
key: another_key vBucketId: 1022 master: http://127.0.0.1:11210/ replicas:
```

<a id="couchbase-admin-cmdline-cbdbmaint"></a>

## Using cbdbmaint

<a id="table-couchbase-admin-cmdline-cbdbmaint-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbdbmaint`                                                        
-------------|---------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbdbmaint.exe`                                 
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents//Resources/couchbase-core/bin/cbdbmaint`

Usage:


```
cbdbmaint [--vacuum] [--backupto=<dest_dir>] [--port=11210]
```

<a id="couchbase-admin-cmdline-cbcollect_info"></a>

## Using cbcollect_info

<a id="table-couchbase-admin-cmdline-cbcollect_info-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbcollect_info`                                                        
-------------|--------------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbcollect_info`                                     
**Mac OS X** | `/Applications/Couchbase\ Server.app/Contents//Resources/couchbase-core/bin/cbcollect_info`

Usage:


```
cbcollect_info [options] output_file

Options:
  -h, --help  show this help message and exit
  -v          increase verbosity level
```

<a id="couchbase-admin-restapi"></a>
