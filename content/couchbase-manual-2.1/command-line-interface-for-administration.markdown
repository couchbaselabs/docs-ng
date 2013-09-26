# Command-line Interface for Administration

Couchbase Server includes a number of command-line tools that can be used to
manage and monitor a Couchbase Server cluster or server. All operations are
mapped to their appropriate [Using the REST API](#couchbase-admin-restapi) call
(where available).

There are a number of command-line tools that perform different functions and
operations, these are described individually within the following sections.
Tools can be located in a number of directories, dependent on the tool in
question in each case.

<a id="couchbase-admin-cmdline-rename-remove-new"></a>

## Command Line Tools and Availability

As of Couchbase Server 2.0, the following publicly available tools have been
renamed, consolidated or removed. This is to provide better usability, and
reduce the number of commands required to manage Couchbase Server:

By default, the command-line tools are installed into the following locations on
each platform:

<a id="table-couchbase-admin-cmdline-locs"></a>

**Linux**    | `/opt/couchbase/bin`, `/opt/couchbase/bin/install`, `/opt/couchbase/bin/tools`, `/opt/couchbase/bin/tools/unsupported`                      
-------------|---------------------------------------------------------------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\couchbase\server\bin`, `C:\Program Files\couchbase\server\bin\install`, and `C:\Program Files\couchbase\server\bin\tools`.
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin`                                                                  

<a id="couchbase-admin-cmdline-unsupported"></a>

## Unsupported Tools

The following are tools that are visible in Couchbase Server 2.0 installation;
however the tools are unsupported. This means they are meant for Couchbase
internal use and will not be supported by Couchbase Technical Support:

 * `cbbrowse_logs`

 * `cbdump-config`

 * `cbenable_core_dumps.sh`

 * `couch_compact`

 * `couch_dbdump`

 * `couch_dbinfo`

 * `memslap`

<a id="couchbase-admin-cmdline-deprecated-removed"></a>

## Deprecated and Removed Tools

The following are tools that existed in previous versions but have been
deprecated and removed as of Couchbase Server 1.8:

<a id="table-couchbase-admin-cmdline-deprecated"></a>

Tool                         | Server Versions | Description/Status                                            
-----------------------------|-----------------|---------------------------------------------------------------
`tap.py`                     | 1.8             | Deprecated in 1.8.                                            
`cbclusterstats`             | 1.8             | Deprecated in 1.8. Replaced by `cbstats` in 1.8.              
`membase`                    | 1.7             | Deprecated in 1.8. Replaced by `couchbase-cli` in 1.8.1       
`mbadm-online-restore`       | 1.7             | Deprecated in 1.8. Replaced by `cbadm-online-restore` in 1.8.1
`membase`                    | 1.7             | Deprecated in 1.8, replaced by `couchbase-cli`                
`mbadm-online-restore`       | 1.7             | Deprecated in 1.8, replaced by `cbadm-online-restore`         
`mbadm-online-update`        | 1.7             | Deprecated in 1.8, replaced by `cbadm-online-update`          
`mbadm-tap-registration`     | 1.7             | Deprecated in 1.8, replaced by `cbadm-tap-registration`       
`mbbackup-incremental`       | 1.7             | Deprecated in 1.8, replaced by `cbbackup-incremental`         
`mbbackup-merge-incremental` | 1.7             | Deprecated in 1.8, replaced by `cbbackup-merge-incremental`   
`mbbackup`                   | 1.7             | Deprecated in 1.8, replaced by `cbbackup`                     
`mbbrowse_logs`              | 1.7             | Deprecated in 1.8, replaced by `cbbrowse_logs`                
`mbcollect_info`             | 1.7             | Deprecated in 1.8, replaced by `cbcollect_info`               
`mbdbconvert`                | 1.7             | Deprecated in 1.8, replaced by `cbdbconvert`                  
`mbdbmaint`                  | 1.7             | Deprecated in 1.8, replaced by `cbdbmaint`                    
`mbdbupgrade`                | 1.7             | Deprecated in 1.8, replaced by `cbdbupgrade`                  
`mbdumpconfig.escript`       | 1.7             | Deprecated in 1.8, replaced by `cbdumpconfig.escript`         
`mbenable_core_dumps.sh`     | 1.7             | Deprecated in 1.8, replaced by `cbenable_core_dumps.sh`       
`mbflushctl`                 | 1.7             | Deprecated in 1.8, replaced by `cbflushctl`                   
`mbrestore`                  | 1.7             | Deprecated in 1.8, replaced by `cbrestore`                    
`mbstats`                    | 1.7             | Deprecated in 1.8, replaced by `cbstats`                      
`mbupgrade`                  | 1.7             | Deprecated in 1.8, replaced by `cbupgrade`                    
`mbvbucketctl`               | 1.7             | Deprecated in 1.8, replaced by `cbvbucketctl`                 

<a id="couchbase-admin-cmdline-couchbase-cli"></a>

## couchbase-cli Tool

You can find this tool in the following locations, depending upon your platform.
This tool can perform operations on an entire cluster, on a bucket shared across
an entire cluster, or on a single node in a cluster. For instance, if you use
this tool to create a data bucket, it will create a bucket that all nodes in the
cluster have access to.

<a id="table-couchbase-admin-cmdline-couchbase-cli-locs"></a>

**Linux**    | `/opt/couchbase/bin/couchbase-cli`                                                      
-------------|-----------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\couchbase-cli.exe`                               
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/couchbase-cli`

This tool provides access to various management operations for Couchbase Server
clusters, nodes and buckets. The basic usage format is:


```
couchbase-cli COMMAND [BUCKET_NAME] CLUSTER [OPTIONS]
```

Where:

 * `COMMAND` is a command listed below.

 * `CLUSTER` is a cluster specification. You can use either:

    ```
    --cluster=HOST[:PORT]
    ```

   Or the shortened form:

    ```
    -c HOST[:PORT]
    ```

 * `OPTIONS` are zero or more options as follows:

   <a id="table-couchbase-admin-couchbase-cli-otpions"></a>

   `-u USERNAME, --user=USERNAME`     | Admin username of the cluster
   -----------------------------------|-----------------------------------
   `-p PASSWORD, --password=PASSWORD` | Admin password of the cluster
   `-o KIND, --output=KIND`           | Type of document: JSON or standard
   `-d, --debug`                      | Output debug information

<a id="couchbase-admin-cmdline-couchbase-commands"></a>

Command                | Description                                          
-----------------------|------------------------------------------------------
`server-list`          | List all servers in a cluster                        
`server-info`          | Show details on one server                           
`server-add`           | Add one or more servers to the cluster               
`server-readd`         | Readd a server that was failed over                  
`rebalance`            | Start a cluster rebalancing                          
`rebalance-stop`       | Stop current cluster rebalancing                     
`rebalance-status`     | Show status of current cluster rebalancing           
`failover`             | Failover one or more servers                         
`cluster-init`         | Set the username,password and port of the cluster    
`cluster-edit`         | Modify cluster settings                              
`node-init`            | Set node specific parameters                         
`bucket-list`          | List all buckets in a cluster                        
`bucket-create`        | Add a new bucket to the cluster                      
`bucket-edit`          | Modify an existing bucket                            
`bucket-delete`        | Delete an existing bucket                            
`bucket-flush`         | Flush all data from disk for a given bucket          
`bucket-compact`       | Compact database and index data                      
`setting-compaction`   | Set auto compaction settings                         
`setting-notification` | Set notifications.                                   
`setting-alert`        | Email alert settings                                 
`setting-autofailover` | Set auto failover settings                           
`setting-xdcr`         | Set XDCR-related configuration which affect behavior.
`xdcr-setup`           | Set up XDCR replication.                             
`xdcr-replicate`       | Create and run replication via XDCR                  
`help show longer`     | usage/help and examples                              

The following are options which can be used with their respective commands.
Administration — `couchbase-cli` Tool commands options:

<a id="couchbase-admin-cmdline-couchbase-commands-stdopts"></a>

Command                | Option                                     | Description                                                             
-----------------------|--------------------------------------------|-------------------------------------------------------------------------
`server-add`           | `--server-add=HOST[:PORT]`                 | Server to add to cluster                                                
`server-add`           | `--server-add-username=USERNAME`           | Admin username for the server to be added                               
`server-add`           | `--server-add-password=PASSWORD`           | Admin password for the server to be added                               
                       |                                            |                                                                         
`server-readd`         | `--server-add=HOST[:PORT]`                 | Server to re-add to cluster                                             
`server-readd`         | `--server-add-username=USERNAME`           | Admin username for the server to be added                               
`server-readd`         | `--server-add-password=PASSWORD`           | Admin password for the server to be added                               
                       |                                            |                                                                         
`rebalance`            | `--server-add*`                            | See server-add OPTIONS                                                  
`rebalance`            | `--server-remove=HOST[:PORT]`              | The server to remove from cluster                                       
                       |                                            |                                                                         
`failover`             | `--server-failover=HOST[:PORT]`            | Server to failover                                                      
                       |                                            |                                                                         
`cluster-*`            | `--cluster-username=USER`                  | New admin username                                                      
`cluster-*`            | `--cluster-password=PASSWORD`              | New admin password                                                      
`cluster-*`            | `--cluster-port=PORT`                      | New cluster REST/http port                                              
`cluster-*`            | `--cluster-ramsize=RAMSIZEMB`              | Per node RAM quota in MB                                                
                       |                                            |                                                                         
`node-init`            | `--node-init-data-path=PATH`               | Per node path to store data                                             
`node-init`            | `--node-init-index-path=PATH`              | Per node path to store index                                            
                       |                                            |                                                                         
`bucket-*`             | `--bucket=BUCKETNAME`                      | Named bucket to act on                                                  
`bucket-*`             | `--bucket-type=TYPE`                       | Bucket type, either memcached or couchbase                              
`bucket-*`             | `--bucket-port=PORT`                       | Supports ASCII protocol and does not require authentication             
`bucket-*`             | `--bucket-password=PASSWORD`               | Standard port, exclusive with bucket-port                               
`bucket-*`             | `--bucket-ramsize=RAMSIZEMB`               | Bucket RAM quota in MB                                                  
`bucket-*`             | `--bucket-replica=COUNT`                   | Replication count                                                       
`bucket-*`             | `--enable-flush=[0|1]`                     | Enable/disable flush                                                    
`bucket-*`             | `--enable-index-replica=[0|1]`             | Enable/disable index replicas                                           
`bucket-*`             | `--wait`                                   | Wait for bucket create to be complete before returning                  
`bucket-*`             | `--force`                                  | Force command execution without asking for confirmation                 
`bucket-*`             | `--data-only`                              | Compact database data only                                              
`bucket-*`             | `--view-only`                              | Compact view data only                                                  
                       |                                            |                                                                         
`setting-compacttion`  | `--compaction-db-percentage=PERCENTAGE`    | Percentage of disk fragmentation when database compaction is triggered  
`setting-compacttion`  | `--compaction-db-size=SIZE[MB]`            | Size of disk fragmentation when database compaction is triggered        
`setting-compacttion`  | `--compaction-view-percentage=PERCENTAGE`  | Percentage of disk fragmentation when views compaction is triggered     
`setting-compacttion`  | `--compaction-view-size=SIZE[MB]`          | Size of disk fragmentation when views compaction is triggered           
`setting-compacttion`  | `--compaction-period-from=HH:MM`           | Enable compaction from this time onward                                
`setting-compacttion`  | `--compaction-period-to=HH:MM`             | Stop enabling compaction at this time                                   
`setting-compacttion`  | `--enable-compaction-abort=[0|1]`          | Allow compaction to abort when time expires                             
`setting-compacttion`  | `--enable-compaction-parallel=[0|1]`       | Allow parallel compaction processes for database and view               
                       |                                            |                                                                         
`setting-notification` | `--enable-notification=[0|1]`              | Allow notifications                                                     
                       |                                            |                                                                         
`setting-alert`        | `--enable-email-alert=[0|1]`               | Allow email alert                                                       
`setting-alert`        | `--email-recipients=RECIPIENT`             | Email recipients, separate addresses with, or ;                          
`setting-alert`        | `--email-sender=SENDER`                    | Sender email address                                                    
`setting-alert`        | `--email-user=USER`                        | Email server username                                                   
`setting-alert`        | `--email-password=PWD`                     | Email server password                                                   
`setting-alert`        | `--email-host=HOST`                        | Email server hostname                                                   
`setting-alert`        | `--email-port=PORT`                        | Email server port                                                       
`setting-alert`        | `--enable-email-encrypt=[0|1]`             | Email encryption with 0 the default for no encryption                   
`setting-alert`        | `--alert-auto-failover-node`               | Node was failed over via autofailover                                   
`setting-alert`        | `--alert-auto-failover-max-reached`        | Maximum number of auto failover nodes reached                           
`setting-alert`        | `--alert-auto-failover-node-down`          | Node not auto failed-over as other nodes are down at the same time      
`setting-alert`        | `--alert-auto-failover-cluster-small`      | Node not auto failed-over as cluster was too small                      
`setting-alert`        | `--alert-ip-changed`                       | Node ip address changed unexpectedly                                    
`setting-alert`        | `--alert-disk-space`                       | Disk space used for persistent storage has reached at least 90% capacity
`setting-alert`        | `--alert-meta-overhead`                    | Metadata overhead is more than 50% of RAM for node                      
`setting-alert`        | `--alert-meta-oom`                         | Bucket memory on a node is entirely used for metadata                   
`setting-alert`        | `--alert-write-failed`                     | Writing data to disk for a specific bucket has failed                   
                       |                                            |                                                                         
`setting-autofailover` | `--enable-auto-failover=[0|1]`             | Allow auto failover                                                     
`setting-autofailover` | `--auto-failover-timeout=TIMEOUT (>=30)`   | Specify amount of node timeout that triggers auto failover              
                       |                                            |                                                                         
`setting-xdcr`         | `--max-concurrent-reps=[32]`               | Maximum concurrent replicators per bucket, 8 to 256.                    
`setting-xdcr`         | `--checkpoint-interval=[1800]`             | Intervals between checkpoints, 60 to 14400 seconds.                     
`setting-xdcr`         | `--worker-batch-size=[500]`                | Doc batch size, 500 to 10000.                                           
`setting-xdcr`         | `--doc-batch-size=[2048]KB`                | Document batching size, 10 to 100000 KB                                 
`setting-xdcr`         | `--failure-restart-interval=[30]`          | Interval for restarting failed xdcr, 1 to 300 seconds                   
`setting-xdcr`         | `--optimistic-replication-threshold=[256]` | Document body size threshold (bytes) to trigger optimistic replication  
                       |                                            |                                                                         
`xdcr-setup`           | `--create`                                 | Create a new xdcr configuration                                         
`xdcr-setup`           | `--edit`                                   | Modify existed xdcr configuration                                       
`xdcr-setup`           | `--delete`                                 | Delete existing xdcr configuration                                      
`xdcr-setup`           | `--xdcr-cluster-name=CLUSTERNAME`          | Remote cluster name                                                     
`xdcr-setup`           | `--xdcr-hostname=HOSTNAME`                 | Remote host name to connect to                                          
`xdcr-setup`           | `--xdcr-username=USERNAME`                 | Remote cluster admin username                                           
`xdcr-setup`           | `--xdcr-password=PASSWORD`                 | Remote cluster admin password                                           
                       |                                            |                                                                         
`xdcr-replicate`       | `--create`                                 | Create and start a new replication                                      
`xdcr-replicate`       | `--delete`                                 | Stop and cancel a replication                                           
`xdcr-replicate`       | `--xdcr-from-bucket=BUCKET`                | Source bucket name to replicate from                                    
`xdcr-replicate`       | `--xdcr-cluster-name=CLUSTERNAME`          | Remote cluster to replicate to                                          
`xdcr-replicate`       | `--xdcr-to-bucket=BUCKETNAME`              | Remote bucket to replicate to                                           

You can also perform many of these same settings using the REST-API, see [Using
the REST API](#couchbase-admin-restapi).

Some examples of commonly-used `couchbase-cli` commands:


```
Set data path for an unprovisioned cluster:
  couchbse-cli node-init -c 192.168.0.1:8091 \
       --node-init-data-path=/tmp/data \
       --node-init-index-path=/tmp/index

  List servers in a cluster:
    couchbase-cli server-list -c 192.168.0.1:8091

  Server information:
    couchbase-cli server-info -c 192.168.0.1:8091

  Add a node to a cluster, but do not rebalance:
    couchbase-cli server-add -c 192.168.0.1:8091 \
       --server-add=192.168.0.2:8091 \
       --server-add-username=Administrator \
       --server-add-password=password

  Add a node to a cluster and rebalance:
    couchbase-cli rebalance -c 192.168.0.1:8091 \
       --server-add=192.168.0.2:8091 \
       --server-add-username=Administrator \
       --server-add-password=password

  Remove a node from a cluster and rebalance:
    couchbase-cli rebalance -c 192.168.0.1:8091 \
       --server-remove=192.168.0.2:8091

  Remove and add nodes from/to a cluster and rebalance:
    couchbase-cli rebalance -c 192.168.0.1:8091 \
      --server-remove=192.168.0.2 \
      --server-add=192.168.0.4 \
      --server-add-username=Administrator \
      --server-add-password=password

  Stop the current rebalancing:
    couchbase-cli rebalance-stop -c 192.168.0.1:8091

  Set the username, password, port and ram quota:
    couchbase-cli cluster-init -c 192.168.0.1:8091 \
       --cluster-init-username=Administrator \
       --cluster-init-password=password \
       --cluster-init-port=8080 \
       --cluster-init-ramsize=300

  change the cluster username, password, port and ram quota:
    couchbase-cli cluster-edit -c 192.168.0.1:8091 \
       --cluster-username=Administrator \
       --cluster-password=password \
       --cluster-port=8080 \
       --cluster-ramsize=300

  Change the data path:
     couchbase-cli node-init -c 192.168.0.1:8091 \
       --node-init-data-path=/tmp

  List buckets in a cluster:
    couchbase-cli bucket-list -c 192.168.0.1:8091

  Create a new dedicated port couchbase bucket:
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=couchbase \
       --bucket-port=11222 \
       --bucket-ramsize=200 \
       --bucket-replica=1

  Create a couchbase bucket and wait for bucket ready:
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=couchbase \
       --bucket-port=11222 \
       --bucket-ramsize=200 \
       --bucket-replica=1 \
       --wait

  Create a new sasl memcached bucket:
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=memcached \
       --bucket-password=password \
       --bucket-ramsize=200 \
       --enable-flush=1 \
       --enable-index-replica=1

  Modify a dedicated port bucket:
    couchbase-cli bucket-edit -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-port=11222 \
       --bucket-ramsize=400 \
       --enable-flush=1 \
       --enable-index-replica=1

  Delete a bucket:
    couchbase-cli bucket-delete -c 192.168.0.1:8091 \
       --bucket=test_bucket

  Flush a bucket:
    couchbase-cli bucket-flush -c 192.168.0.1:8091 \
       --force

  Compact a bucket for both data and view:
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket

  Compact a bucket for data only:
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket \
        --data-only

  Compact a bucket for view only:
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket \
        --view-only

  Create a XDCR remote cluster:
    couchbase-cli xdcr-setup -c 192.168.0.1:8091 \
        --create \
        --xdcr-cluster-name=test \
        --xdcr-hostname=10.1.2.3:8091 \
        --xdcr-username=Administrator \
        --xdcr-password=password

  Delete a XDCR remote cluster:
    couchbase-cli xdcr-delete -c 192.168.0.1:8091 \
        --xdcr-cluster-name=test

  Start a replication stream:
    couchbase-cli xdcr-replicate -c 192.168.0.1:8091 \
        --create \
        --xdcr-cluster-name=test \
        --xdcr-from-bucket=default \
        --xdcr-to-bucket=default1

  Delete a replication stream:
    couchbase-cli xdcr-replicate -c 192.168.0.1:8091 \
        --delete \
        --xdcr-replicator=f4eb540d74c43fd3ac6d4b7910c8c92f/default/default
```

<a id="couchbase-admin-cli-flushing"></a>

### Flushing Buckets with couchbase-cli

**Enabling Flush of Buckets:**

When you want to flush a data bucket you must first enable this option then
actually issue the command to flush the data bucket. *We do not advise that you
enable this option if your data bucket is in a production environment. Be aware
that this is one of the preferred methods for enabling data bucket flush.* The
other option available to enable data bucket flush is to use the Couchbase Web
Console, see [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit). You can enable
this option when you actually create the data bucket, or when you edit the
bucket properties:


```
> couchbase-cli bucket-create [bucket_name] [cluster_admin:pass] --enable-flush=[0|1]  // 0 the default and 1 to enable

 > couchbase-cli bucket-edit [bucket_name] [cluster_admin:pass] --enable-flush=[0|1]  // 0 the default and 1 to enable
```

After you enable this option, you can then flush the data bucket.

**Flushing a Bucket:**

After you explicitly enable data bucket flush, you can then flush data from the
bucket. Flushing a bucket is data destructive. Client applications using this
are advised to double check with the end user before sending such a request. You
can control and limit the ability to flush individual buckets by setting the
`flushEnabled` parameter on a bucket in Couchbase Web Console or via
`couchbase-cli` as described in the previous section. See also [Creating and
Editing Data Buckets](#couchbase-admin-web-console-data-buckets-createedit).


```
> couchbase-cli bucket-flush [cluster_admin:pass] [bucket_name OPTIONS]
```

By default this command will confirm whether or not you truly want to flush the
data bucket. You can optionally call this command with the `--force` option to
flush data without confirmation.

<a id="couchbase-admin-cmdline-cbstats"></a>

## cbstats Tool

You use the `cbstats` tool to get node- and cluster-level statistics about
performance and items in storage. The tool can be found in the following
locations, depending on your platform:

<a id="table-couchbase-admin-cmdline-cbstats-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbstats`                                                      
-------------|-----------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbstats.exe`                               
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbstats`



**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

[You use this tool to get the Couchbase Server node
statistics](#couchbase-monitoring-nodestats). The general format for the command
is:


```
> cbstats <IP>:11210 <command> -b <bucket_name> [-p <bucket_password>]
```

Where `BUCKET_HOST` is the hostname and port ( `HOSTNAME[:PORT]` ) combination
for a Couchbase bucket, and `username` and `password` are the authentication for
the named bucket. `COMMAND` (and `[options]` ) are one of the follow options:


```
all
allocator
checkpoint [vbid]
dispatcher [logs]
hash [detail]
items
kvstore
kvtimings
raw argument
reset
slabs
tap [username password]
tapagg
timings
vkey keyname vbid
```

From these options, `all` and `timings` will be the main ones you will use to
understand cluster or node performance. The other options are used by Couchbase
internally and to help resolve customer support incidents.

For example, the `cbstats` output can be used with other command-line tools to
sort and filter the data.


```
> watch --diff "cbstats \
    ip-10-12-19-81:11210 -b bucket_name -p bucket_password all | egrep 'item|mem|flusher|ep_queue|bg|eje|resi|warm'"
```

The following table provides a list of results that will be returned when you
perform a `cbstats all` command:

Stat                               | Description                                                                                                                                                                      
-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ep\_version                        | Version number of ep\_engine.                                                                                                                                                    
ep\_storage\_age                   | Seconds since most recently stored object was initially queued.                                                                                                                  
ep\_storage\_age\_highwat          | ep\_storage\_age high water mark                                                                                                                                                 
ep\_min\_data\_age                 | Minimum data age setting.                                                                                                                                                        
ep\_startup\_time                  | System-generated engine startup time                                                                                                                                             
ep\_queue\_age\_cap                | Queue age cap setting.                                                                                                                                                           
ep\_max\_txn\_size                 | Max number of updates per transaction.                                                                                                                                           
ep\_data\_age                      | Seconds since most recently stored object was modified.                                                                                                                          
ep\_data\_age\_highwat             | ep\_data\_age high water mark                                                                                                                                                    
ep\_too\_young                     | Deprecated in 2.1.0. Number of times an object was not stored due to being too young.                                                                                            
ep\_too\_old                       | Deprecated in 2.1.0. Number of times an object was stored after being dirty too long.                                                                                            
ep\_total\_enqueued                | Total number of items queued for persistence                                                                                                                                     
ep\_total\_new\_items              | Total number of persisted new items.                                                                                                                                             
ep\_total\_del\_items              | Total number of persisted deletions.                                                                                                                                             
ep\_total\_persisted               | Total number of items persisted.                                                                                                                                                 
ep\_item\_flush\_failed            | Number of times an item failed to flush due to storage errors.                                                                                                                   
ep\_item\_commit\_failed           | Number of times a transaction failed to commit due to storage errors.                                                                                                            
ep\_item\_begin\_failed            | Number of times a transaction failed to start due to storage errors.                                                                                                             
ep\_expired\_access                | Number of times an item was expired on application access.                                                                                                                       
ep\_expired\_pager                 | Number of times an item was expired by ep engine item pager.                                                                                                                     
ep\_item\_flush\_expired           | Number of times an item is not flushed due to the expiry of the item                                                                                                             
ep\_queue\_size                    | Number of items queued for storage.                                                                                                                                              
ep\_flusher\_todo                  | Number of items remaining to be written.                                                                                                                                         
ep\_flusher\_state                 | Current state of the flusher thread.                                                                                                                                             
ep\_commit\_num                    | Total number of write commits.                                                                                                                                                   
ep\_commit\_time                   | Number of milliseconds of most recent commit                                                                                                                                     
ep\_commit\_time\_total            | Cumulative milliseconds spent committing.                                                                                                                                        
ep\_vbucket\_del                   | Number of vbucket deletion events.                                                                                                                                               
ep\_vbucket\_del\_fail             | Number of failed vbucket deletion events.                                                                                                                                        
ep\_vbucket\_del\_max\_walltime    | Max wall time (µs) spent by deleting a vbucket                                                                                                                                   
ep\_vbucket\_del\_avg\_walltime    | Avg wall time (µs) spent by deleting a vbucket                                                                                                                                   
ep\_flush\_duration\_total         | Cumulative seconds spent flushing.                                                                                                                                               
ep\_flush\_all                     | True if disk flush\_all is scheduled                                                                                                                                             
ep\_num\_ops\_get\_meta            | Number of getMeta operations                                                                                                                                                     
ep\_num\_ops\_set\_meta            | Number of setWithMeta operations                                                                                                                                                 
ep\_num\_ops\_del\_meta            | Number of delWithMeta operations                                                                                                                                                 
curr\_items                        | Num items in active vbuckets (temp + live)                                                                                                                                       
curr\_temp\_items                  | Num temp items in active vbuckets                                                                                                                                                
curr\_items\_tot                   | Num current items including those not active (replica, dead and pending states)                                                                                                  
ep\_kv\_size                       | Memory used to store item metadata, keys and values, no matter the vbucket's state. If an item's value is ejected, this stat will be decremented by the size of the item's value.
ep\_value\_size                    | Memory used to store values for resident keys                                                                                                                                    
ep\_overhead                       | Extra memory used by transient data like persistence queues, replication queues, checkpoints, etc.                                                                               
ep\_max\_data\_size                | Max amount of data allowed in memory.                                                                                                                                            
ep\_mem\_low\_wat                  | Low water mark for auto-evictions.                                                                                                                                               
ep\_mem\_high\_wat                 | High water mark for auto-evictions.                                                                                                                                              
ep\_total\_cache\_size             | The total byte size of all items, no matter the vbucket's state, no matter if an item's value is ejected.                                                                        
ep\_oom\_errors                    | Number of times unrecoverable OOMs happened while processing operations                                                                                                          
ep\_tmp\_oom\_errors               | Number of times temporary OOMs happened while processing operations                                                                                                              
ep\_mem\_tracker\_enabled          | True if memory usage tracker is enabled                                                                                                                                          
ep\_bg\_fetched                    | Number of items fetched from disk.                                                                                                                                               
ep\_bg\_meta\_fetched              | Number of meta items fetched from disk.                                                                                                                                          
ep\_bg\_remaining\_jobs            | Number of remaining background fetch jobs.                                                                                                                                       
ep\_tap\_bg\_fetched               | Number of tap disk fetches                                                                                                                                                       
ep\_tap\_bg\_fetch\_requeued       | Number of times a tap background fetch task is re-queued.                                                                                                                        
ep\_num\_pager\_runs               | Number of times we ran pager loops to seek additional memory.                                                                                                                    
ep\_num\_expiry\_pager\_runs       | Number of times we ran expiry pager loops to purge expired items from memory/disk                                                                                                
ep\_num\_access\_scanner\_runs     | Number of times we ran access scanner to snapshot working set                                                                                                                    
ep\_access\_scanner\_num\_items    | Number of items that last access scanner task swept to access log.                                                                                                               
ep\_access\_scanner\_task\_time    | Time of the next access scanner task (GMT)                                                                                                                                       
ep\_access\_scanner\_last\_runtime | Number of seconds that last access scanner task took to complete.                                                                                                                
ep\_items\_rm\_from\_checkpoints   | Number of items removed from closed unreferenced checkpoints.                                                                                                                    
ep\_num\_value\_ejects             | Number of times item values got ejected from memory to disk                                                                                                                      
ep\_num\_eject\_failures           | Number of items that could not be ejected                                                                                                                                        
ep\_num\_not\_my\_vbuckets         | Number of times Not My VBucket exception happened during runtime                                                                                                                 
ep\_tap\_keepalive                 | Tap keep-alive time.                                                                                                                                                             
ep\_dbname                         | DB path.                                                                                                                                                                         
ep\_dbinit                         | Number of seconds to initialize DB.                                                                                                                                              
ep\_io\_num\_read                  | Number of io read operations                                                                                                                                                     
ep\_io\_num\_write                 | Number of io write operations                                                                                                                                                    
ep\_io\_read\_bytes                | Number of bytes read (key + values)                                                                                                                                              
ep\_io\_write\_bytes               | Number of bytes written (key + values)                                                                                                                                           
ep\_pending\_ops                   | Number of ops awaiting pending vbuckets                                                                                                                                          
ep\_pending\_ops\_total            | Total blocked pending ops since reset                                                                                                                                            
ep\_pending\_ops\_max              | Max ops seen awaiting 1 pending vbucket                                                                                                                                          
ep\_pending\_ops\_max\_duration    | Max time (µs) used waiting on pending vbuckets                                                                                                                                   
ep\_bg\_num\_samples               | The number of samples included in the average                                                                                                                                    
ep\_bg\_min\_wait                  | The shortest time (µs) in the wait queue                                                                                                                                         
ep\_bg\_max\_wait                  | The longest time (µs) in the wait queue                                                                                                                                          
ep\_bg\_wait\_avg                  | The average wait time (µs) for an item before it is serviced by the dispatcher                                                                                                   
ep\_bg\_min\_load                  | The shortest load time (µs)                                                                                                                                                      
ep\_bg\_max\_load                  | The longest load time (µs)                                                                                                                                                       
ep\_bg\_load\_avg                  | The average time (µs) for an item to be loaded from the persistence layer                                                                                                        
ep\_num\_non\_resident             | The number of non-resident items                                                                                                                                                 
ep\_store\_max\_concurrency        | Maximum allowed concurrency at the storage layer.                                                                                                                                
ep\_store\_max\_readers            | Maximum number of concurrent read-only storage threads.                                                                                                                          
ep\_store\_max\_readwrite          | Maximum number of concurrent read/write storage threads.                                                                                                                         
ep\_bg\_wait                       | The total elapse time for the wait queue                                                                                                                                         
ep\_bg\_load                       | The total elapse time for items to be loaded from the persistence layer                                                                                                          
ep\_mlog\_compactor\_runs          | Number of times mutation log compactor is executed                                                                                                                               
ep\_vb\_total                      | Total vBuckets (count)                                                                                                                                                           
curr\_items\_tot                   | Total number of items                                                                                                                                                            
curr\_items                        | Number of active items in memory                                                                                                                                                 
curr\_temp\_items                  | Number of temporary items in memory                                                                                                                                              
vb\_dead\_num                      | Number of dead vBuckets                                                                                                                                                          
ep\_diskqueue\_items               | Total items in disk queue                                                                                                                                                        
ep\_diskqueue\_memory              | Total memory used in disk queue                                                                                                                                                  
ep\_diskqueue\_fill                | Total enqueued items on disk queue                                                                                                                                               
ep\_diskqueue\_drain               | Total drained items on disk queue                                                                                                                                                
ep\_diskqueue\_pending             | Total bytes of pending writes                                                                                                                                                    
ep\_vb\_snapshot\_total            | Total VB state snapshots persisted in disk                                                                                                                                       
vb\_active\_num                    | Number of active vBuckets                                                                                                                                                        
vb\_active\_curr\_items            | Number of in memory items                                                                                                                                                        
vb\_active\_num\_non\_resident     | Number of non-resident items                                                                                                                                                     
vb\_active\_perc\_mem\_resident    | % memory resident                                                                                                                                                                
vb\_active\_eject                  | Number of times item values got ejected                                                                                                                                          
vb\_active\_expired                | Number of times an item was expired                                                                                                                                              
vb\_active\_ht\_memory             | Memory overhead of the hashtable                                                                                                                                                 
vb\_active\_itm\_memory            | Total item memory                                                                                                                                                                
vb\_active\_meta\_data\_memory     | Total metadata memory                                                                                                                                                            
vb\_active\_ops\_create            | Number of create operations                                                                                                                                                      
vb\_active\_ops\_update            | Number of update operations                                                                                                                                                      
vb\_active\_ops\_delete            | Number of delete operations                                                                                                                                                      
vb\_active\_ops\_reject            | Number of rejected operations                                                                                                                                                    
vb\_active\_queue\_size            | Active items in disk queue                                                                                                                                                       
vb\_active\_queue\_memory          | Memory used for disk queue                                                                                                                                                       
vb\_active\_queue\_age             | Sum of disk queue item age in milliseconds                                                                                                                                       
vb\_active\_queue\_pending         | Total bytes of pending writes                                                                                                                                                    
vb\_active\_queue\_fill            | Total enqueued items                                                                                                                                                             
vb\_active\_queue\_drain           | Total drained items                                                                                                                                                              
vb\_active\_num\_ref\_items        | Number of referenced items                                                                                                                                                       
vb\_active\_num\_ref\_ejects       | Number of times referenced item values got ejected                                                                                                                               
vb\_pending\_num                   | Number of pending vBuckets                                                                                                                                                       
vb\_pending\_curr\_items           | Number of in memory items                                                                                                                                                        
vb\_pending\_num\_non\_resident    | Number of non-resident items                                                                                                                                                     
vb\_pending\_perc\_mem\_resident   | % of memory used for resident items                                                                                                                                              
vb\_pending\_eject                 | Number of times item values got ejected                                                                                                                                          
vb\_pending\_expired               | Number of times an item was expired                                                                                                                                              
vb\_pending\_ht\_memory            | Memory overhead of the hashtable                                                                                                                                                 
vb\_pending\_itm\_memory           | Total item in memory                                                                                                                                                             
vb\_pending\_meta\_data\_memory    | Total metadata memory                                                                                                                                                            
vb\_pending\_ops\_create           | Number of create operations                                                                                                                                                      
vb\_pending\_ops\_update           | Number of update operations                                                                                                                                                      
vb\_pending\_ops\_delete           | Number of delete operations                                                                                                                                                      
vb\_pending\_ops\_reject           | Number of rejected operations                                                                                                                                                    
vb\_pending\_queue\_size           | Pending items in disk queue                                                                                                                                                      
vb\_pending\_queue\_memory         | Memory used for disk queue                                                                                                                                                       
vb\_pending\_queue\_age            | Sum of disk queue item age in milliseconds                                                                                                                                       
vb\_pending\_queue\_pending        | Total bytes of pending writes                                                                                                                                                    
vb\_pending\_queue\_fill           | Total enqueued items                                                                                                                                                             
vb\_pending\_queue\_drain          | Total drained items                                                                                                                                                              
vb\_pending\_num\_ref\_items       | Number of referenced items                                                                                                                                                       
vb\_pending\_num\_ref\_ejects      | Number of times referenced item values got ejected                                                                                                                               

<a id="couchbase-admin-cmdline-cbstats-timings"></a>

### Getting Server Timings

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

The following is sample output from `cbstats timings` :


```
disk_insert (10008 total)
   8us - 16us    : ( 94.80%)8 ###########################################
   16us - 32us   : ( 97.70%)  290 #
   32us - 64us   : ( 98.43%)   73
   64us - 128us  : ( 99.29%)   86
   128us - 256us : ( 99.77%)   48
   256us - 512us : ( 99.79%)    2
   512us - 1ms   : ( 99.91%)   12
   1ms - 2ms     : ( 99.92%)    1
disk_commit (1 total)
    0 - 1s        : (100.00%) 1 #############################################################
disk_vbstate_snapshot (2 total)
    4s - 8s       : (100.00%) 2 #############################################################
get_stats_cmd (1535 total)
    ....
set_vb_cmd (1024 total)
    4us - 8us     : ( 97.95%) 1003 ########################################################
    8us - 16us    : ( 98.83%)    9
    ....
```

The first statistic tells you that `disk_insert` took 8-16µs8 times, 16-32µs 290
times, and so forth.

The following are the possible return values provided by `cbstats timings`. The
return values provided by this command depend on what has actually occurred on a
data bucket:

<a id="table-couchbase-admin-cmdline-couchbase-cbstats-timings"></a>

bg\_load                | Background fetches waiting for disk                                      
------------------------|--------------------------------------------------------------------------
bg\_wait                | Background fetches waiting in the dispatcher queue                       
data\_age               | Age of data written to disk                                              
disk\_commit            | Time waiting for a commit after a batch of updates                       
disk\_del               | Wait for disk to delete an item                                          
disk\_insert            | Wait for disk to store a new item                                        
disk\_vbstate\_snapshot | Time spent persisting vbucket state changes                              
disk\_update            | Wait time for disk to modify an existing item                            
get\_cmd                | Servicing get requests                                                   
get\_stats\_cmd         | Servicing get\_stats requests                                            
set\_vb\_cmd            | Servicing vbucket set state commands                                     
item\_alloc\_sizes      | Item allocation size counters (in bytes)                                 
notify\_io              | Time for waking blocked connections                                      
storage\_age            | Time since most recently persisted item was initially queued for storage.
tap\_mutation           | Time spent servicing tap mutations                                       

<a id="couchbase-admin-cmdline-cbstats-warmup"></a>

### Getting Warmup Information

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

You can use `cbstats` to get information about server warmup, including the
status of warmup and whether warmup is enabled. The following are two alternates
to filter for the information:


```
cbstats hostname:port -b bucket_name -p bucket_password | grep 'warmup'

cbstats hostname:port -b bucket_name -p bucket_password raw warmup
```

ep\_warmup\_thread | Indicates if the warmup has completed. Returns "running" or "complete".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ep\_warmup\_state  | * Indicates the current progress of the warmup: **Initial**. Start warmup processes.  * **EstimateDatabaseItemCount**. Estimating database item count.  * **KeyDump**. Begin loading keys and metadata, but not documents, into RAM.  * **CheckForAccessLog**. Determine if an access log is available. This log indicates which keys have been frequently read or written.  * **LoadingAccessLog**. Load information from access log.  * **LoadingData**. This indicates the server is loading data first for keys listed in the access log, or if no log available, based on keys found during the 'Key Dump' phase.  * **Done**. Server is ready to handle read and write requests.

High-level warmup statistics that are available are as follows:

Name                                | Description                                                  | Value Type                         
------------------------------------|--------------------------------------------------------------|------------------------------------
ep\_warmup\_dups                    | Number of failures due to duplicate keys                     | Integer                            
ep\_warmup\_estimated\_key\_count   | Estimated number of keys in database                         | Integer (DEFAULT = "unknown")      
ep\_warmup\_estimated\_value\_count | Estimated number of key data to read based on the access log | Integer (DEFAULT = "unknown")      
ep\_warmup\_keys\_time              | Total time spent by loading persisted keys                   | Integer                            
ep\_warmup\_min\_item\_threshold    | Enable data traffic after loading this number of key data    | Integer                            
ep\_warmup\_min\_memory\_threshold  | Enable data traffic after filling this % of memory           | Integer (%)                        
ep\_warmup\_oom                     | Number of out of memory failures during warmup               | Integer                            
ep\_warmup\_state                   | What is current warmup state                                 | String, refer to *WarmupStateTable*
ep\_warmup\_thread                  | Is warmup running?                                           | String ("running", "complete")     
ep\_warmup\_time                    | Total time spent by loading data (warmup)                    | Integer (microseconds)             

There are also additional lower-level, detailed statistics returned by passing
the keyword "warmup" for the command. For instance:


```
cbstats hostname:port -b bucketname -p bucket_password raw warmup
```

The additional lower-level stats are as follows. Note that some of these items
are also available as higher-level summary statistics about warmup:

Name                                | Description                                                  | Value Type                         
------------------------------------|--------------------------------------------------------------|------------------------------------
ep\_warmup                          | Is warmup enabled?                                           | String ("enabled")                 
ep\_warmup\_key\_count              | How many keys have been loaded?                              | Integer                            
ep\_warmup\_value\_count            | How many key values (data) have been loaded?                 | Integer                            
ep\_warmup\_dups                    | Number of failures due to duplicate keys                     | Integer                            
ep\_warmup\_estimated\_key\_count   | Estimated number of keys in database                         | Integer (DEFAULT = "unknown")      
ep\_warmup\_estimated\_value\_count | Estimated number of key data to read based on the access log | Integer (DEFAULT = "unknown")      
ep\_warmup\_keys\_time              | Total time spent by loading persisted keys                   | Integer                            
ep\_warmup\_min\_item\_threshold    | Enable data traffic after loading this number of key data    | Integer                            
ep\_warmup\_min\_memory\_threshold  | Enable data traffic after filling this % of memory           | Integer (%)                        
ep\_warmup\_oom                     | Number of out of memory failures during warmup               | Integer                            
ep\_warmup\_state                   | What is current warmup state                                 | String, refer to *WarmupStateTable*
ep\_warmup\_thread                  | Is warmup running?                                           | String ("running", "complete")     
ep\_warmup\_time                    | Total time spent by loading data (warmup)                    | Integer (microseconds)             

<a id="couchbase-admin-cmdline-cbstats-TAP"></a>

### Getting TAP Information

Couchbase Server uses an internal protocol known as TAP to stream information
about data changes between cluster nodes. Couchbase Server uses the TAP protocol
during 1) rebalance, 2) replication at other cluster nodes, and 3) persistence
of items to disk.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

The following statistics will be output in response to a `cbstats tap` request:

ep\_tap\_total\_queue         | Sum of tap queue sizes on the current tap queues                                 
------------------------------|----------------------------------------------------------------------------------
ep\_tap\_total\_fetched       | Sum of all tap messages sent                                                     
ep\_tap\_bg\_max\_pending     | The maximum number of background jobs a tap connection may have                  
ep\_tap\_bg\_fetched          | Number of tap disk fetches                                                       
ep\_tap\_bg\_fetch\_requeued  | Number of times a tap background fetch task is requeued.                         
ep\_tap\_fg\_fetched          | Number of tap memory fetches                                                     
ep\_tap\_deletes              | Number of tap deletion messages sent                                             
ep\_tap\_throttled            | Number of tap messages refused due to throttling.                                
ep\_tap\_keepalive            | How long to keep tap connection state after client disconnect.                   
ep\_tap\_count                | Number of tap connections.                                                       
ep\_tap\_bg\_num\_samples     | The number of tap background fetch samples included in the average               
ep\_tap\_bg\_min\_wait        | The shortest time (µs) for a tap item before it is serviced by the dispatcher    
ep\_tap\_bg\_max\_wait        | The longest time (µs) for a tap item before it is serviced by the dispatcher     
ep\_tap\_bg\_wait\_avg        | The average wait time (µs) for a tap item before it is serviced by the dispatcher
ep\_tap\_bg\_min\_load        | The shortest time (µs) for a tap item to be loaded from the persistence layer    
ep\_tap\_bg\_max\_load        | The longest time (µs) for a tap item to be loaded from the persistence layer     
ep\_tap\_bg\_load\_avg        | The average time (µs) for a tap item to be loaded from the persistence layer     
ep\_tap\_noop\_interval       | The number of secs between a no-op is added to an idle connection                
ep\_tap\_backoff\_period      | The number of seconds the tap connection should back off after receiving ETMPFAIL
ep\_tap\_queue\_fill          | Total enqueued items                                                             
ep\_tap\_queue\_drain         | Total drained items                                                              
ep\_tap\_queue\_backoff       | Total back-off items                                                             
ep\_tap\_queue\_backfill      | Number of backfill remaining                                                     
ep\_tap\_queue\_itemondisk    | Number of items remaining on disk                                                
ep\_tap\_throttle\_threshold  | Percentage of memory in use before we throttle tap streams                       
ep\_tap\_throttle\_queue\_cap | Disk write queue cap to throttle tap streams                                     

You use the `cbstats tapagg` to get statistics from named tap connections which
are logically grouped and aggregated together by prefixes.

For example, if all of your tap connections started with `rebalance_` or
`replication_`, you could call `cbstats tapagg _` to request stats grouped by
the prefix starting with `_`. This would return a set of statistics for
`rebalance` and a set for `replication`. The following are possible values
returned by `cbstats tapagg` :

\[prefix\]:count                | Number of connections matching this prefix
--------------------------------|-------------------------------------------
\[prefix\]:qlen                 | Total length of queues with this prefix   
\[prefix\]:backfill\_remaining  | Number of items needing to be backfilled  
\[prefix\]:backoff              | Total number of backoff events            
\[prefix\]:drain                | Total number of items drained             
\[prefix\]:fill                 | Total number of items filled              
\[prefix\]:itemondisk           | Number of items remaining on disk         
\[prefix\]:total\_backlog\_size | Number of remaining items for replication 

<a id="couchbase-admin-cmdline-cbepctl"></a>

## cbepctl Tool

The `cbepctl` command enables you to control many of the configuration, RAM and
disk parameters of a running cluster. This tool is for controlling the vBucket
states on a Couchbase Server node. It is also responsible for controlling the
configuration, memory and disk persistence behavior. This tool was formerly
provided as the separate tools, `cbvbucketctl` and `cbflushctl` in Couchbase
1.8.

Changes to the cluster configuration using `cbepctl` are not persisted over a
cluster restart.

<a id="table-couchbase-admin-cmdline-cbepctl-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbepctl`                                                      
-------------|-----------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbepctl.exe`                               
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbepctl`

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.


```
cbepctl host:11210 -b bucket_name -p bucket_password start
cbepctl host:11210 -b bucket_name -p bucket_password stop
cbepctl host:11210 -b bucket_name -p bucket_password set type param value
```

For this command, `host` is the IP address for your Couchbase cluster, or node
in the cluster. The port will always be the standard port used for cluster-wide
stats and is at `11210`. You also provide the named bucket and the password for
the named bucket. After this you provide command options and authentication.

You can use the following command options to manage persistence:

Option    | Description                                                                                            
----------|--------------------------------------------------------------------------------------------------------
**stop**  | stop persistence                                                                                       
**start** | start persistence                                                                                      
**drain** | wait until queues are drained                                                                          
**set**   | to set `checkpoint_param`, `flush_param`, and `tap_param`. This changes how or when persistence occurs.

You can use the following command options, combined with the parameters to set
`checkpoint_param`, `flush_param`, and `tap_param`. These changes the behavior
of persistence in Couchbase Server.

The command options for `checkpoint_param` are:

Parameter                      | Description                                                                                                        
-------------------------------|--------------------------------------------------------------------------------------------------------------------
**chk\_max\_items**            | Max number of items allowed in a checkpoint.                                                                       
**chk\_period**                | Time bound (in sec.) on a checkpoint.                                                                              
**item\_num\_based\_new\_chk** | True if a new checkpoint can be created based on. the number of items in the open checkpoint.                      
**keep\_closed\_chks**         | True if we want to keep closed checkpoints in memory, as long as the current memory usage is below high water mark.
**max\_checkpoints**           | Max number of checkpoints allowed per vbucket.                                                                     

<a id="couchbase-admin-cbepctl-disk-cleanup"></a>

### Changing the Disk Cleanup Interval

One of the most important use cases for the `cbepctl flush_param` is the set the
time interval for disk cleanup in Couchbase Server 2.0. Couchbase Server does
lazy expiration, that is, expired items are flagged as deleted rather than being
immediately erased. Couchbase Server has a maintenance process that will
periodically look through all information and erase expired items. This
maintenance process will run every 60 minutes, but it can be configured to run
at a different interval. For example, the following options will set the cleanup
process to run every 10 minutes:


```
./cbepctl localhost:11210 -b bucket_name -p bucket_password set flush_param exp_pager_stime 600
```

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

Here we specify 600 seconds, or 10 minutes as the interval Couchbase Server
waits before it tries to remove expired items from disk.

<a id="couchbase-admin-cbepctl-disk-queue"></a>

### Changing Disk Write Queue Quotas

One of the specific uses of `cbepctl` is to the change the default maximum items
for a disk write queue. This impacts replication of data that occurs between
source and destination nodes within a cluster. Both data that a node receives
from client applications, and replicated items that it receives are placed on a
disk write queue. If there are too many items waiting in the disk write queue at
any given destination, Couchbase Server will reduce the rate of data that is
sent to a destination. This is process is also known as *backoff*.

By default, when a disk write queue contains one million items, a Couchbase node
will reduce the rate it sends out data to be replicated. You can change this
setting to be the greater of 10% of the items at a destination node or a number
you specify. For instance:


```
> ./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set tap_param tap_throttle_queue_cap 2000000
```

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

In this example we specify that a replica node send a request to backoff when it
has two million items or 10% of all items, whichever is greater. You will see a
response similar to the following:


```
setting param: tap_throttle_queue_cap 2000000
```

In this next example, we change the default percentage used to manage the
replication stream. If the items in a disk write queue reach the greater of this
percentage or a specified number of items, replication requests will slow down:


```
> ./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set tap_param tap_throttle_cap_pcnt 15
```

In this example, we set the threshold to 15% of all items at a replica node.
When a disk write queue on a replica node reaches this point, it will request
replication backoff. For more information about replicas, replication and
backoff from replication, see [Replicas and
Replication](#couchbase-introduction-architecture-replication). The other
command options for `tap_param` are:

Parameter                     | Description                                                                                                                                 
------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------
**tap\_keepalive**            | Seconds to hold a named tap connection.                                                                                                     
**tap\_throttle\_queue\_cap** | Max disk write queue size when tap streams will put into a temporary, 5-second pause. 'Infinite' means there is no cap.                     
**tap\_throttle\_cap\_pcnt**  | Maximum items in disk write queue as percentage of all items on a node. At this point tap streams will put into a temporary, 5-second pause.
**tap\_throttle\_threshold**  | Percentage of memory in use when tap streams will be put into a temporary, 5-second pause.                                                  

<a id="couchbase-admin-cbepctl-access-scanner"></a>

### Changing Access Log Settings

In Couchbase Server 2.0, we provide a more optimized disk warmup. In past
versions of Couchbase Server, the server would load all keys and data
sequentially from vBuckets in RAM. Now the server pre-fetches a list of
most-frequently accessed keys and fetches these documents first. The server runs
a periodic scanner process which will determine which keys are most
frequently-used. You can use `cbepctl flush_param` to change the initial time
and the interval for the process. You may want to do this, for instance, if you
have a peak time for your application when you want the keys used during this
time to be quickly available after server restart.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

By default the scanner process will run once every 24 hours with a default
initial start time of 2:00 AM UTC. This means after you install a new Couchbase
Server 2.0 instance or restart the server, by default the scanner will run every
24- hour time period at 2:00 AM GMT and then 2:00 PM GMT by default. To change
the time interval when the access scanner process runs to every 20 minutes:


```
> ./cbepctl hostname:port -b bucket_name -p bucket_password set flush_param alog_sleep_time 20
```

To change the initial time that the access scanner process runs from the default
of 2:00 AM UTC:


```
> ./cbepctl hostname:port -b bucket_name -p bucket_password set flush_param alog_task_time 23
```

In this example we set the initial time to 11:00 PM UTC.

<a id="couchbase-admin-cbepctl-ejection"></a>

### Changing Thresholds for Ejection

Couchbase Server has a process to *eject* items from RAM when too much space is
being taken up in RAM; ejection means that documents will be removed from RAM,
however the key and metadata for the item will remain in RAM. When a certain
amount of RAM is consumed by items, the server will eject items starting with
replica data. This threshold is known as the *low water mark*. If a second,
higher threshold is breached, Couchbase Server will not only eject replica data,
it will also eject less-frequently used items. This second RAM threshold is
known as the *high water mark*. The server determines that items are not
frequently used based on a boolean for each item known as NRU
(Not-Recently-used). There a few settings you can adjust to change server
behavior during the ejection process. In general, we do not recommend you change
ejection defaults for Couchbase Server 2.0+ unless you are required to do so.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

For background information about the ejection process, the role of NRU and
server processes related to ejection, see [Ejection and Working Set
Management](#couchbase-admin-tasks-working-set-mgmt).

**Setting the Low Water Mark**

This represents the amount of RAM you ideally want to consume on a node. If this
threshold is met, the server will begin ejecting replica items as they are
written to disk. To change this percentage for instance:


```
>    ./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set flush_param mem_low_wat 70
```

You can also provides an absolute number of bytes when you change this setting.

**Setting the High Water Mark**

This represents the amount of RAM consumed by items that must be breached before
infrequently used items will be ejected. To change this amount, you use the
Couchbase command-line tool, `cbepctl` :


```
>    ./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set flush_param mem_high_wat 80
```

Here we set the high water mark to be 80% of RAM for a specific data bucket on a
given node. This means that items in RAM on this node can consume up to 80% of
RAM before the item pager begins ejecting items. You can also specify an
absolute number of bytes when you set this threshold.

**Setting Percentage of Ejected Items**

After Couchbase Server removes all infrequently-used items and the high water
mark is still breached, the server will then eject replicated data and active
data from a node whether or not the data is frequently or infrequently used. You
change also the default percentage for ejection of active items versus replica
items using the Couchbase command-line tool, `cbepctl` :


```
>    ./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set flush_param pager_active_vb_pcnt 50
```

This increases the percentage of active items that can be ejected from a node to
50%. Be aware of potential performance implications when you make this change.
In very simple terms, it may seem more desirable to eject as many replica items
as possible and limit the amount of active data that can be ejected. In doing
so, you will be able to maintain as much active data from a source node as
possible, and maintain incoming requests to that node. However, if you have the
server eject a very large percentage of replica data, should a node fail, the
replica data will not be immediately available. In that case, Couchbase Server
has to retrieve the items from disk back into RAM and then it can respond to the
requests. For Couchbase Server 2.0 we generally recommend that you do not change
these defaults.

<a id="couchbase-admin-cbepctl-mutation_mem"></a>

### Changing Setting for Out Of Memory Errors

By default, Couchbase Server will send clients a temporary out of memory error
if RAM is 95% consumed and only 5% RAM remains for overhead. We do not suggest
you change this default to a higher value; however you may choose to reduce this
value if you think you need more RAM available for system overhead such as disk
queue or for server data structures. To change this value:


```
>./cbepctl 10.5.2.31:11210 -b bucket_name -p bucket_password set flush_param mutation_mem_threshold 65
```

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

In this example we reduce the threshold to 65% of RAM. This setting must be
updated on a per-node, per-bucket basis, meaning you need to provide the
specific node and named bucket to update this setting. To update it for an
entire cluster, you will need to issue the command for every combination of node
and named bucket that exists in the cluster.

<a id="couchbase-admin-cbepctl-flush-enable"></a>

### Enabling Flush of Data Buckets - Will be Deprecated

By default, this setting appears in Couchbase Web Console and is disabled; when
it is enabled Couchbase Server is able to flush all the data in a bucket. **Be
also aware that this operation will be deprecated as a way to enable data bucket
flushes.** This is because **cbepctl** is designed for individual node
configuration not operating on data buckets shared by multiple nodes.

**The preferred way to enable data bucket flush is either 1) Couchbase Web
Console or via 2) couchbase-cli**. For more information about these two options,
see [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit) and [Flushing
Buckets with couchbase-cli](#couchbase-admin-cli-flushing).

Flushing a bucket is data destructive. If you use **cbepctl**, it makes no
attempt to confirm or double check the request. Client applications using this
are advised to double check with the end user before sending such a request. You
can control and limit the ability to flush individual buckets by setting the
`flushEnabled` parameter on a bucket in Couchbase Web Console or via `cbepctl
flush_param`.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

To enable flushing a data bucket:


```
> ./cbepctl hostname:port -b bucket_name -p bucket_password set flush_param flushall_enabled true
```

To disable flushing a data bucket:


```
> ./cbepctl hostname:port -b bucket_name -p bucket_password set flush_param flushall_enabled false
```

You can initiate the flush via the REST-API. For information about changing this
setting in the Web Console, see [Viewing Data
Buckets](#couchbase-admin-web-console-data-buckets). For information about
flushing data buckets via REST, see [Flushing a
Bucket](#couchbase-admin-restapi-flushing-bucket).

<a id="couchbase-admin-cbepctl-flush-params"></a>

### Other cbepctl flush_param

The complete list of options for `flush_param` are:

Parameter                       | Description                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------
**alog\_sleep\_time**           | Access scanner interval (minute)                                                                                                   
**alog\_task\_time**            | Access scanner next task time (UTC)                                                                                                
**bg\_fetch\_delay**            | Delay before executing a bg fetch (test feature).                                                                                  
**couch\_response\_timeout**    | timeout in receiving a response from couchdb.                                                                                      
**exp\_pager\_stime**           | Expiry Pager interval. Time interval that Couchbase Server waits before it performs cleanup and removal of expired items from disk.
**flushall\_enabled**           | Enable flush operation.                                                                                                            
**klog\_compactor\_queue\_cap** | queue cap to throttle the log compactor.                                                                                           
**klog\_max\_log\_size**        | maximum size of a mutation log file allowed.                                                                                       
**klog\_max\_entry\_ratio**     | max ratio of \# of items logged to \# of unique items.                                                                             
**pager\_active\_vb\_pcnt**     | Percentage of active vbuckets items among all ejected items by item pager.                                                         
**pager\_unbiased\_period**     | Period after last access scanner run during which item pager preserve working set.                                                 
**queue\_age\_cap**             | Maximum queue age before flushing data.                                                                                            
**max\_size**                   | Max memory used by the server.                                                                                                     
**max\_txn\_size**              | Maximum number of items in a flusher transaction.                                                                                  
**min\_data\_age**              | Minimum data age before flushing data.                                                                                             
**mutation\_mem\_threshold**    | Amount of RAM that can be consumed in that caching layer before clients start receiving temporary out of memory messages.          
**timing\_log**                 | path to log detailed timing stats.                                                                                                 

<a id="couchbase-admin-cmdline-cbcollect_info"></a>

## cbcollect_info Tool

This is one of the most important diagnostic tools used by Couchbase technical
support teams; this command-line tool provides detailed statistics for a
specific node. The tool is at the following locations, depending upon your
platform:

<a id="table-couchbase-admin-cmdline-cbcollect_info-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbcollect_info`                                                      
-------------|------------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbcollect_info`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbcollect_info`

**Be aware that this tool is a per-node operation.** If you want to perform this
operation for an entire cluster, you will need to perform the command for every
node that exists for that cluster.

As of Couchbase Server 2.1+ you will need a root account to run this command and
collect all the server information needed. There are internal server files and
directories that this tool accesses which require root privileges.

To use this command, you remotely connect to the machine which contains your
Couchbase Server then issue the command with options. You typically run this
command under the direction of technical support at Couchbase and it will
generate a large.zip file. This archive will contain several different files
which contain performance statistics and extracts from server logs. The
following describes usage, where `output_file` is the name of the.zip file you
will create and send to Couchbase technical support:


```
cbcollect_info hostname:port output_file

Options:
  -h, --help  show this help message and exit
  -v          increase verbosity level
```

If you choose the verbosity option, `-v` debugging information for
`cbcollect_info` will be also output to your console. When you run
`cbcollect_info`, it will gather statistics from an individual node in the
cluster.

This command will collect information from an individual Couchbase Server node.
If you are experiencing problems with multiple nodes in a cluster, you may need
to run it on all nodes in a cluster.

The tool will create the following.log files in your named archive:

<a id="table-couchbase-admin-cmdline-cbcollect_info"></a>

**couchbase.log**          | OS-level information about a node.                                                                                                      
---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------
**ns\_server.couchdb.log** | Information about the persistence layer for a node.                                                                                     
**ns\_server.debug.log**   | Debug-level information for the cluster management component of this node.                                                              
**ns\_server.error.log**   | Error-level information for the cluster management component of this node.                                                              
**ns\_server.info.log**    | Info-level entries for the cluster management component of this node.                                                                   
**ns\_server.views.log**   | Includes information about indexing, time taken for indexing, queries which have been run, and other statistics about views.            
**stats.log**              | The results from multiple `cbstats` options run for the node. For more information, see [cbstats Tool](#couchbase-admin-cmdline-cbstats)

After you finish running the tool, you should upload the archive and send it to
Couchbase technical support:


```
> curl --upload-file file_name https://s3.amazonaws.com/customers.couchbase.com/company_name/
```

Where `file_name` is the name of your archive, and `company_name` is the name of
your organization. After you have uploaded the archive, please contact Couchbase
technical support. For more information, see [Working with Couchbase Customer
Support](http://www.couchbase.com/wiki/display/couchbase/Working+with+the+Couchbase+Technical+Support+Team).

<a id="couchbase-admin-cmdline-cbbackup"></a>

## cbbackup Tool

The `cbbackup` tool creates a copy of data from an entire running cluster, an
entire bucket, a single node, or a single bucket on a single functioning node.
Your node or cluster needs to be functioning in order to create the backup.
Couchbase Server will write a copy of data onto disk.

`cbbackup`, `cbrestore` and `cbtransfer` do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

Depending upon your platform, this tool is the following directories:

<a id="table-couchbase-admin-cmdline-cbbackup-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbbackup`                                                      
-------------|------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbbackup`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbbackup`

The format of the `cbbackup` command is:


```
cbbackup [options] [source] [destination]
```

Where:

 * `[options]`

   Same options available for `cbtransfer`, see [cbtransfer
   Tool](#couchbase-admin-cmdline-cbtransfer)

 * `[source]`

   Source for the backup. This can be either a URL of a node when backing up a
   single node or the cluster, or a URL specifying a directory where the data for a
   single bucket is located.

 * `[destination]`

   The destination directory for the backup files to be stored. Either the
   directory must exist, and be empty, or the directory will be created. The parent
   directory must exist.

This tool has several different options which you can use to:

 * Backup all buckets in an entire cluster,

 * Backup one named bucket in a cluster,

 * Backup all buckets on a node in a cluster,

 * Backup one named buckets on a specified node,

All command options for `cbbackup` are the same options available for
`cbtransfer`. For a list of standard and special-use options, see [cbtransfer
Tool](#couchbase-admin-cmdline-cbtransfer).

You can backup an entire cluster, which includes all of the data buckets and
data at all nodes. This will also include all design documents; do note however
that you will need to rebuild any indexes after you restore the data. To backup
an entire cluster and all buckets for that cluster:


```
> cbbackup http://HOST:8091 ~/backups \
          -u Administrator -p password
```

Where `~/backups` is the directory where you want to store the data. When you
perform this operation, be aware that cbbackup will create the following
directory structure and files in the `~/backups` directory assuming you have two
buckets in your cluster named `my_name` and `sasl` and two nodes `N1` and `N2` :


```
~/backups
        bucket-my_name
            N1
            N2
        bucket-sasl
            N1
            N2
```

Where `bucket-my_name` and `bucket-sasl` are directories containing data files
and where `N1` and `N2` are two sets of data files for each node in the cluster.
To backup a single bucket in a cluster:


```
> cbbackup http://HOST:8091 /backups/backup-20120501 \
  -u Administrator -p password \
  -b default
```

In this case `-b default` specifies you want to backup data from the default
bucket in a cluster. You could also provide any other given bucket in the
cluster that you want to backup. To backup all the data stored in multiple
buckets from a single node which access the buckets:


```
> cbbackup http://HOST:8091 /backups/ \
  -u Administrator -p password \
  --single-node
```

This is an example of how to backup data from a single bucket on a single node
follows:


```
> cbbackup http://HOST:8091 /backups \
  -u Administrator -p password \
  --single-node \
  -b bucket_name
```

This example shows you how you can specify keys that are backed up using the `-
k` option. For example, to backup all keys from a bucket with the prefix
'object':


```
> cbbackup http://HOST:8091 /backups/backup-20120501 \
  -u Administrator -p password \
  -b bucket_name \
  -k '^object.*'
```

For more information on using `cbbackup` scenarios when you may want to use it
and best practices for backup and restore of data with Couchbase Server, see
[Backing Up Using cbbackup](#couchbase-backup-restore-backup-cbbackup).

**Backing Up Design Documents Only**

As of Couchbase Server 2.1 you can backup only design documents from a cluster
or bucket with the option, `design_doc_only=1`. You can later restore the design
documents only with `cbrestore`, see [cbrestore
Tool](#couchbase-admin-cmdline-cbrestore) :


```
> ./cbbackup http://10.5.2.30:8091 ~/backup -x design_doc_only=1 -b bucket_name

transfer design doc only. bucket msgs will be skipped.
done
```

Where you provide the hostname and port for a node in the cluster. This will
make a backup copy of all design documents from `bucket_name` and store this as
`design.json` in the directory `~/backup/bucket_name`. If you do not provide a
named bucket it will backup design documents for all buckets in the cluster. In
this example we did a backup of two design documents on a node and our file will
appear as follows:


```
[
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fddoc1/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fddoc1/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "view1":{
                  "map":"function(doc){emit(doc.key,doc.key_num);}"
               },
               "view2":{
                  "map":"function(doc,meta){emit(meta.id,doc.key);}"
               }
            }
         },
         "meta":{
            "rev":"1-6f9bfe0a",
            "id":"_design/ddoc1"
         }
      }
   },
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fddoc2/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fddoc2/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "dothis":{
                  "map":"function (doc, meta) {\n  emit(meta.id, null);\n}"
               }
            }
         },
         "meta":{
            "rev":"1-4b533871",
            "id":"_design/ddoc2"
         }
      }
   },
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fdev_ddoc2/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fdev_ddoc2/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "dothat":{
                  "map":"function (doc, meta) {\n  emit(meta.id, null);\n}"
               }
            }
         },
         "meta":{
            "rev":"1-a8b6f59b",
            "id":"_design/dev_ddoc2"
         }
      }
   }
]
```

**Using cbbackup from Couchbase Server 2.0 with 1.8.x**

You can use `cbbackup` 2.x to backup data from a Couchbase 1.8.x cluster,
including 1.8. To do so you use the same command options you use when you backup
a 2.0 cluster except you provide it the hostname and port for the 1.8.x cluster.
You do not need to even install Couchbase Server 2.0 in order to use `cbbackup
2.x` to backup Couchbase Server 1.8.x. You can get a copy of the tool from the
[Couchbase command-line tools GitHub
repository](https://github.com/couchbase/couchbase-cli). After you get the tool,
go to the directory where you cloned the tool and perform the command. For
instance:


```
./cbbackup http://1.8_host_name:port ~/backup -u Administrator -p password
```

This creates a backup of all buckets in the 1.8 cluster at `~/backups` on the
physical machine where you run `cbbackup`. So if you want to make the backup on
the machine containing the 1.8.x data bucket, you should copy the tool on that
machine. As in the case where you perform backup with Couchbase 2.0, you can use
`cbbackup 2.0` options to backup all buckets in a cluster, backup a named
bucket, backup the default bucket, or backup the data buckets associated with a
single node.

Be aware that you can also use the `cbrestore 2.0` tool to restore backup data
onto a 1.8.x cluster. See [cbrestore Tool](#couchbase-admin-cmdline-cbrestore).

<a id="couchbase-admin-cmdline-cbrestore"></a>

## cbrestore Tool

The `cbrestore` tool restores data from a file to an entire cluster or to a
single bucket in the cluster. Items that had been written to file on disk will
be restored to RAM.

`cbbackup`, `cbrestore` and `cbtransfer` do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

The tool is in the following locations, depending on your platform:

<a id="table-couchbase-admin-cmdline-cbrestore-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbrestore`                                                      
-------------|-------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbrestore`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbrestore`

The format of the `cbrestore` command is:


```
cbrestore [options] [host:ip] [source] [destination]
```

Where:

 * `[options]`

   Command options for `cbrestore` are the same options for `cbtransfer`, see
   [cbtransfer Tool](#couchbase-admin-cmdline-cbtransfer).

 * `[host:ip]`

   Hostname and port for a node in cluster.

 * `[source]`

   Source bucket name for the backup data. This is in the directory created by
   `cbbackup` when you performed the backup.

 * `[destination]`

   The destination bucket for the restored information. This is a bucket in an
   existing cluster. If you restore the data to a single node in a cluster, provide
   the hostname and port for the node you want to restore to. If you restore an
   entire data bucket, provide the URL of one of the nodes within the cluster.

All command options for `cbrestore` are the same options available for
`cbtransfer`. For a list of standard and special-use options, see [cbtransfer
Tool](#couchbase-admin-cmdline-cbtransfer).

**Using cbrestore for Design Documents Only**

As of Couchbase Server 2.1 you can restore design documents to a server node
with the option, `design_doc_only=1`. You can restore from a backup file you
create with `cbbackup`, see [cbbackup Tool](#couchbase-admin-cmdline-cbbackup) :


```
> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b a_bucket -B my_bucket

transfer design doc only. bucket msgs will be skipped.
done
```

This will restore design documents from the backup file `~/backup/a_bucket` to
the destination bucket `my_bucket` in a cluster. If you backed up more than one
source bucket, you will need to perform this command more than once. For
instance, imagine you did a backup for a cluster with two data buckets and have
the backup files `~/backup/bucket_one/design.json` and
`~/backup/bucket_two/design.json` :


```
> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_one -B my_bucket

> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_two -B my_bucket
```

This will restore design documents in both backup files to a bucket in your
cluster named `my_bucket` After you restore the design documents you can see
them in Couchbase Web Console under the Views tab. For more information about
the Views Editor, see [Using the Views Editor](#couchbase-views-editor).

**Using cbrestore from Couchbase Server 2.0 with 1.8.x**

You can use `cbrestore` 2.0 to backup data from a Couchbase 1.8.x cluster,
including 1.8. To do so you use the same command options you use when you backup
a 2.0 cluster except you provide it the hostname and port for the 1.8.x cluster.
You do not need to even install Couchbase Server 2.0 in order to use `cbrestore`
2.0 to backup Couchbase Server 1.8.x. You can get a copy of the tool from the
[Couchbase command-line tools GitHub
repository](https://github.com/couchbase/couchbase-cli). After you get the tool,
go to the directory where you cloned the tool and perform the command. For
instance:


```
./cbrestore ~/backup http://10.3.3.11:8091 -u Administrator -p password -B saslbucket_destination -b saslbucket_source
```

This restores all data in the `bucket-saslbucket_source` directory under
`~/backups` on the physical machine where you run `cbbackup`. It will restore
this data into a bucket named `saslbucket_destination` in the cluster with the
node host:port of `10.3.3.11:8091`.

Be aware that if you are trying to restore data to a different cluster, that you
should make sure that cluster should have the same number of vBuckets as the
cluster that you backed up. If you attempt to restore data from a cluster to a
cluster with a different number of vBuckets, it will fail when you use the
default port of `8091`. The default number of vBuckets for Couchbase 2.0 is
1024; in earlier versions of Couchbase, you may have a different number of
vBuckets. If you do want to restore data to a cluster with a different number of
vBuckets, you should perform this command with port `11211`, which will
accommodate the difference in vBuckets:


```
cbrestore /backups/backup-42 memcached://HOST:11211 \
    --bucket-source=sessions --bucket-destination=sessions2
```

If you want more information about using `cbbackup` 2.0 tool to backup data onto
a 1.8.x cluster. See [cbbackup Tool](#couchbase-admin-cmdline-cbbackup).

For general information on using `cbbackup`, see [Restoring using cbrestore
tool](#couchbase-backup-restore-cbrestore).

<a id="couchbase-admin-cmdline-cbtransfer"></a>

## cbtransfer Tool

You use this tool to transfer data and design documents between two clusters or
from a file to a cluster. With this tool you can also create a copy of data from
a node that no longer running. This tool is the underlying, generic data
transfer tool that `cbbackup` and `cbrestore` are built upon. It is a
lightweight extract-transform-load (ETL) tool that can move data from a source
to a destination. The source and destination parameters are similar to URLs or
file paths.

`cbbackup`, `cbrestore` and `cbtransfer` do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

Locations for this tool are as follows:

<a id="table-couchbase-admin-cmdline-cbtransfer-locs"></a>

**Linux**    | `/opt/couchbase/bin/`                                                      
-------------|----------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/`

The following is the syntax and examples for this command:


```
> ./cbtransfer [options] source destination


Examples:
  cbtransfer http://SOURCE:8091 /backups/backup-42
  cbtransfer /backups/backup-42 http://DEST:8091
  cbtransfer /backups/backup-42 couchbase://DEST:8091
  cbtransfer http://SOURCE:8091 http://DEST:8091
  cbtransfer 1.8_COUCHBASE_BUCKET_MASTER_DB_SQLITE_FILE http://DEST:8091
  cbtransfer file.csv http://DEST:8091
```

The following are the standard command options which you can also view with
`cbtransfer -h` :

<a id="table-couchbase-admin-cbtranfer-options"></a>

-h, --help                                                       | Command help                                                                                                                                                                                                                 
-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--add                                                            | Use --add instead of --set in order to not overwrite existing items in the destination
-b BUCKET\_SOURCE                                                | Single named bucket from source cluster to transfer                                                                                                                                                                          
-B BUCKET\_DESTINATION, --bucket-destination=BUCKET\_DESTINATION | Single named bucket on destination cluster which receives transfer. This allows you to transfer to a bucket with a different name as your source bucket. If you do not provide defaults to the same name as the bucket-source
-i ID, --id=ID                                                   | Transfer only items that match a vbucketID                                                                                                                                                                                   
-k KEY, --key=KEY                                                | Transfer only items with keys that match a regexp                                                                                                                                                                            
-n, --dry-run                                                    | No actual transfer; just validate parameters, files, connectivity and configurations                                                                                                                                         
-u USERNAME, --username=USERNAME                                 | REST username for source cluster or server node                                                                                                                                                                              
-p PASSWORD, --password=PASSWORD                                 | REST password for cluster or server node                                                                                                                                                                                     
-t THREADS, --threads=THREADS                                    | Number of concurrent workers threads performing the transfer. Defaults to 4.                                                                                                                                                 
-v, --verbose                                                    | Verbose logging; provide more verbosity                                                                                                                                                                                      
-x EXTRA, --extra=EXTRA                                          | Provide extra, uncommon config parameters                                                                                                                                                                                    
--single-node                                                    | Transfer from a single server node in a source cluster. This single server node is a source node URL                                                                                                                         
--source-vbucket-state=SOURCE\_VBUCKET\_STATE                    | Only transfer from source vbuckets in this state, such as 'active' (default) or 'replica'. Must be used with Couchbase cluster as source.                                                                                    
--destination-vbucket-state=DESTINATION\_VBUCKET\_STATE          | Only transfer to destination vbuckets in this state, such as 'active' (default) or 'replica'. Must be used with Couchbase cluster as destination.                                                                            
--destination-operation=DESTINATION\_OPERATION                   | Perform this operation on transfer. "set" will override an existing document, 'add' will not override, 'get' will load all keys transferred from a source cluster into the caching layer at the destination.                 
`/path/to/filename`                                              | Export a.csv file from the server or import a.csv file to the server.                                                                                                                                                        

The following are extra, specialized command options you use in this form
`cbtransfer -x [EXTRA OPTIONS]` :

<a id="table-couchbase-admin-cbtranfer-special-options"></a>

batch\_max\_bytes=400000 | Transfer this \# of bytes per batch.                                                                                 
-------------------------|----------------------------------------------------------------------------------------------------------------------
batch\_max\_size=1000    | Transfer this \# of documents per batch                                                                              
cbb\_max\_mb=100000      | Split backup file on destination cluster if it exceeds MB                                                            
max\_retry=10            | Max number of sequential retries if transfer fails                                                                   
nmv\_retry=1             | 0 or 1, where 1 retries transfer after a NOT\_MY\_VBUCKET message. Default of 1.                                     
recv\_min\_bytes=4096    | Amount of bytes for every TCP/IP batch transferred                                                                   
report=5                 | Number batches transferred before updating progress bar in console                                                   
report\_full=2000        | Number batches transferred before emitting progress information in console                                           
try\_xwm=1               | As of 2.1, transfer documents with metadata. 1 is default. 0 should only be used if you transfer from 1.8.x to 1.8.x.
data\_only=0             | For value 1, only transfer data from a backup file or cluster.                                                       
design\_doc\_only=0      | For value 1, transfer design documents only from a backup file or cluster. Defaults to 0.                            

The most important way you can use this tool is to transfer data from a
Couchbase node that is no longer running to a cluster that is running:


```
./cbtransfer \
       couchstore-files://COUCHSTORE_BUCKET_DIR \
       couchbase://HOST:PORT \
       --bucket-destination=DESTINATION_BUCKET

./cbtransfer \
       couchstore-files:///opt/couchbase/var/lib/couchbase/data/default \
       couchbase://10.5.3.121:8091 \
       --bucket-destination=foo
```

Upon success, the tool will output as follows:


```
[####################] 100.0% (10000/10000 msgs)
bucket: bucket_name, msgs transferred...
      : total | last | per sec
batch : 1088 | 1088 | 554.8
byte : 5783385 | 5783385 | 3502156.4
msg : 10000 | 10000 | 5230.9
done
```

This shows we successfully transferred 10000 total documents in batch size of
1088 documents each. This next examples shows how you can send all the data from
a node to standard output:


```
> ./cbtransfer http://10.5.2.37:8091/ stdout:
```

Will produce a output as follows:


```
set pymc40 0 0 10
0000000000
set pymc16 0 0 10
0000000000
set pymc9 0 0 10
0000000000
set pymc53 0 0 10
0000000000
set pymc34 0 0 10
0000000000
```

Note Couchbase Server will store all data from a bucket, node or cluster, but
not the associated design documents. To to so, you should explicitly use
`cbbackup` to store the information and `cbrestore` to read it back into memory.

**Exporting and Importing CSV Files**

As of Couchbase Server 2.1 you can import and export well-formed.csv files with
`cbtransfer`. This will import data into Couchbase Server as documents and will
export documents from the server into comma-separated values. This does not
include any design documents associated with a bucket in the cluster.

For example imagine you have records as follows in the default bucket in a
cluster:


```
re-fdeea652a89ec3e9,
0,
0,
4271152681275955,
"{""key"":""re-fdeea652a89ec3e9"",
 ""key_num"":4112,
 ""name"":""fdee c3e"",
 ""email"":""fdee@ea.com"",
 ""city"":""a65"",
 ""country"":""2a"",
 ""realm"":""89"",
 ""coins"":650.06,
 ""category"":1,
 ""achievements"":[77, 149, 239, 37, 76],""body"":""xc4ca4238a0b923820d
 .......
""}"
......
```

Where `re-fdeea652a89ec3e9` is the document ID, 0 are flags, 0 is the expiration
and the CAS value is `4271152681275955`. The actual value in this example is the
hash starting with `"{""key""......`. To export these items to a.csv file
perform this command:


```
./cbtransfer http://[hostname]:[port] csv:./data.csv -b default -u Administrator -p password
```

Will transfer all items from the default bucket, `-b default` available at the
node `http://localhost:8091` and put the items into the `/data.csv` file. If you
provide another named bucket for the `-b` option, it will export items from that
named bucket. You will need to provide credentials for the cluster when you
export items from a bucket in the cluster. You will see output similar to that
in other `cbtransfer` scenarios:


```
[####################] 100.0% (10000/10000 msgs)
bucket: default, msgs transferred...
       : total | last | per sec
 batch : 1053 | 1053 | 550.8
 byte : 4783385 | 4783385 | 2502156.4
 msg : 10000 | 10000 | 5230.9
2013-05-08 23:26:45,107: mt warning: cannot save bucket design on a CSV destination
done
```

This shows we transferred 1053 batches of data at 550.8 batches per second. The
tool outputs "cannot save bucket design...." to indicate that no design
documents were exported. To import information from a.csv file to a named bucket
in a cluster:


```
./cbtransfer /data.csv http://[hostname]:[port] -B bucket_name -u Administrator -p password
```

If your.csv is not correctly formatted you will see the following error during
import:


```
w0 error: fails to read from csv file, .....
```

**Transferring Design Documents Only**

As of Couchbase Server 2.1 you can transfer design documents from one cluster to
another one with the option, `design_doc_only=1` :


```
> ./cbtransfer http://10.5.2.30:8091 http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_one -B bucket_two
transfer design doc only. bucket msgs will be skipped.
done
```

This will transfer all design documents associated with `bucket_one` to
`bucket_two` on the cluster with node `http://10.3.1.10:8091`. In Couchbase Web
Console you can see this updated design documents when you click on the View tab
and select `bucket_two` in the drop-down.

<a id="couchbase-admin-cmdline-cbhealthchecker"></a>

## cbhealthchecker Tool

The `cbhealthchecker` tool generates a health report named *Cluster Health Check
Report* for a Couchbase cluster. The report provides data that helps
administrators, developers, and testers determine whether a cluster is healthy,
has issues that must be addressed soon to prevent future problems, or has issues
that must be addressed immediately.

[The tool retrieves data from the Couchbase Server monitoring system, aggregates
it over a time scale, analyzes the statistics against thresholds, and generates
a report. Unlike other command line tools such as `cbstats` and `cbtransfer`
that use the TAP protocol](#couchbase-introduction-architecture-tap) to obtain
data from the monitoring system, `cbhealthchecker` obtains data by using the
REST API and the memcached protocol. For more information about the statistics
provided by Couchbase Server, see [Statistics and
Monitoring](#couchbase-introduction-architecture-stats).

You can generate reports on the following time scales: minute, hour, day, week,
month, and year. The tool outputs an HTML file, a text file, and a JSON file.
Each file contains the same information — the only difference between them is
the format of the information. All `cbhealthchecker` output is stored in a
`reports` folder. The tool does not delete any files from the folder. You can
delete files manually if the `reports` folder becomes too large. The path to the
output files is displayed when the run finishes.

`cbhealthchecker` is automatically installed with Couchbase Server 2.1 and
later. You can find the tool in the following locations, depending upon your
platform:

<a id="table-couchbase-admin-cmdline-cbhealthchecker-locs"></a>

**Linux**    | `/opt/couchbase/bin/`                                                      
-------------|----------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/`

The format of the `cbhealthchecker` command is:


```
cbhealthchecker CLUSTER USERNAME PASSWORD OPTIONS
```

Where:

 * `CLUSTER`

   The cluster for which you want a report:

   `-c HOST[:PORT]`  `--cluster=HOST[:PORT]` | Hostname and port of a node in the cluster. The default port is 8091.
   ------------------------------------------|----------------------------------------------------------------------

 * `USERNAME`

   Username of the cluster administrator account:

   `-u USERNAME`  `--user=USERNAME` | Admin username of the cluster.
   ---------------------------------|-------------------------------

 * `PASSWORD`

   Password of the cluster administrator account:

   `-p PASSWORD`  `--password=PASSWORD` | Admin password of the cluster.
   -------------------------------------|-------------------------------

 * `OPTIONS`

   Command options:

   <a id="table-couchbase-admin-cmdline-cbhealthchecker-options"></a>

   `-b BUCKETNAME`  `--bucket=BUCKETNAME` | Specific bucket on which to report. The default is all buckets.
   ---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------
   `-i FILENAME`  `--input=FILENAME`      | Generate an analysis report from an input JSON file.
   `-o FILENAME`  `--output=FILENAME`     | File name for the HTML report. The default output file name is the report time stamp, for example: `2013-07-26_13-26-23.html`.
   `-h`  `--help`                         | Show the help message and exit.
   `-s SCALE`  `--scale=SCALE`            | Time span (scale) for the statistics: minute, hour, day, week, month or year. The default time span is day.
   `-j`  `--jsononly`                     | Collect data and output only a JSON file. When you use this option, the analysis report is not generated.

**Sample Commands**

The following command runs a report on all buckets in the cluster for the past
day:


```
./cbhealthchecker -c 10.3.1.10:8091 -u Administrator -p password

bucket: default
  node: 10.3.1.10 11210
  node: 10.3.1.11 11210
................................

The run finished successfully.
Please find html output at '/opt/couchbase/bin/reports/2013-07-23_16-29-02.html'
and text output at '/opt/couchbase/bin/reports/2013-07-23_16-29-02.txt'.
```

The following command runs a report on all buckets in the cluster for the past
month:


```
./cbhealthchecker -c 10.3.1.10:8091 -u Administrator -p password -s month

The run finished successfully.
Please find html output at '/opt/couchbase/bin/reports/2013-07-26_13-26-23.html'
and text output at '/opt/couchbase/bin/reports/2013-07-26_13-26-23.txt'.
```

The following command runs a report on only the `beer-sample` bucket for the
past year and outputs the HTML report to a file named `beer-health-report.html`.


```
./cbhealthchecker -c 10.3.1.10:8091 -u Administrator -p password -o beer-health-report.html \
      -b beer-sample -s year

The run finished successfully.
Please find html output at '/opt/couchbase/bin/reports/beer-health-report.html'
and text output at '/opt/couchbase/bin/reports/2013-07-26_15-57-11.txt'.
```

The following command generates only the statistics and outputs them in a JSON
file:


```
./cbhealthchecker -c 10.3.1.10:8091 -u Administrator -p password -j

The run finished successfully.
Please find collected stats at '/opt/couchbase/bin/reports/2013-07-26_13-30-36.json'.
```

**HTML Report**

You can view the HTML report in any web browser. If you copy the report to
another location, be sure to copy all the files in the reports folder to ensure
that the report is displayed correctly by the browser. When you have multiple
HTML reports in the folder, you can use the tabs at the top of the page to
display a particular report. (If the tabs do not function in your browser, try
using Firefox.)

Throughout the report, normal health statuses are highlighted in green, warnings
are highlighted in yellow, and conditions that require immediate action are
highlighted in red. When viewing the report, you can hover your mouse over each
statistic to display a message that describes how the statistic is calculated.

The report begins with a header that lists the statistics scale, the date and
time the report was run, and an assessment of the overall health of the cluster.
The following figure shows the report header:


![](images/health-report-header.png)

 * The body of the report is divided into several sections:Couchbase — Alerts

   The alerts section contains a list of urgent issues that require immediate
   attention. For each issue, the report lists the symptoms detected, the impact of
   the issue, and the recommended corrective action to take. This section appears
   in the report only when urgent issues are detected. The following figure shows a
   portion of the alerts section of a report:


   ![](images/health-report-alerts.png)

 * Couchbase Cluster Overview

   The cluster overview section contains cluster-wide metrics and metrics for each
   bucket and node in the cluster. This section appears in all reports. The
   following figure shows a portion of the cluster overview section of a report:


   ![](images/health-report-cluster-overview.png)

 * Couchbase — Warning Indicators

   The warning indicators section contains a list of issues that require attention.
   For each issue, the report lists the symptoms detected, the impact of the issue,
   and the recommended corrective action to take. This section appears in the
   report only when warning indicators are detected. The following figure shows a
   portion of the warning indicators section of a report:


   ![](images/health-report-warnings.png)



<a id="couchbase-admin-cmdline-cbdocloader"></a>

## cbdocloader Tool

You can use this tool to load a group of JSON documents in a given directory, or
in a single.zip file. This is the underlying tool used during your initial
Couchbase Server install which will optionally install two sample databases
provided by Couchbase. You can find this tool in the following locations,
depending upon your platform:

<a id="table-couchbase-admin-cmdline-cbdocloader-locs"></a>

**Linux**    | `/opt/couchbase/bin/tools/`                                                      
-------------|----------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

When you load documents as well as any associated design documents for views,
you should use a directory structure similar to the following:


```
/design_docs    // which contains all the design docs for views.
/docs           // which contains all the raw json data files. This can contain other sub directories too.
```

All JSON files that you want to upload contain well-formatted JSON. Any file
names should exclude spaces. If you want to upload JSON documents and design
documents into Couchbase Server, be aware that the design documents will be
uploaded after all JSON documents. The following are command options for
`cbdocloader` :


```
-n HOST[:PORT], --node=HOST[:PORT] Default port is 8091

-u USERNAME, --user=USERNAME REST username of the cluster. It can be specified in environment variable REST_USERNAME.

-p PASSWORD, --password=PASSWORD REST password of the cluster. It can be specified in environment variable REST_PASSWORD.

-b BUCKETNAME, --bucket=BUCKETNAME Specific bucket name. Default is default bucket. Bucket will be created if it does not exist.

-s QUOTA, RAM quota for the bucket. Unit is MB. Default is 100MB.

-h --help Show this help message and exit
```

The following is an example of uploading JSON from a.zip file:


```
./cbdocloader  -n localhost:8091 -u Administrator -p password -b mybucket ../samples/gamesim.zip
```

Be aware that there are typically three types of errors that can occur: 1) the
files are not well-formatted, 2) credentials are incorrect, or 3) the RAM quota
for a new bucket to contain the JSON is too large given the current quota for
Couchbase Server. For more information about changing RAM quotas for Couchbase
Server nodes, see **Couldn't resolve xref tag: couchbase-admin-tasks-quotas**.

<a id="couchbase-admin-cmdline-cbworkloadgen"></a>

## cbworkloadgen Tool

Tool that generates random data and perform read/writes for Couchbase Server.
This is useful for testing your Couchbase node.

<a id="table-couchbase-admin-cmdline-cbworkloadgen-locs"></a>

**Linux**    | `/opt/couchbase/bin/tools/`                                                      
-------------|----------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

The following is the standard command format:


```
cbworkloadgen Usage:
cbworkloadgen -n host:port -u [username] -p [password]

Options are as follows:

-r [number] // % of workload will be writes, remainder will be reads
--ratio-sets=[number] // 95% of workload will be writes, 5% will be reads
-i [number]    // number of inserted items
-l // loop forever until interrupted by user
-t // set number of concurrent threads
-v // verbose mode
```

For example, to generate workload on a given Couchbase node and open port on
that node:


```
> ./cbworkloadgen -n 10.17.30.161:9000 -u Administrator -p password
```

Will produce a result similar to the following if successful:


```
[####################] 100.0% (10527/10526 msgs)
bucket: default, msgs transferred...
       :                total |       last |    per sec
 batch :                   11 |         11 |        2.2
 byte  :               105270 |     105270 |    21497.9
 msg   :                10527 |      10527 |     2149.8
done
```

When you check the data bucket you will see 10000 new items of with random keys
and values such as the following item:


```
pymc0    "MDAwMDAwMDAwMA=="
```

<a id="couchbase-admin-cmdline-cbanalyze-core"></a>

## cbanalyze-core Tool

Helper script to parse and analyze core dump from a Couchbase node. Depending
upon your platform, this tool is at the following locations:

<a id="table-couchbase-admin-cmdline-cbanalyze-core-locs"></a>

**Linux**    | `/opt/couchbase/bin/tools/`                                                      
-------------|----------------------------------------------------------------------------------
**Windows**  | Not Available on this platform.                                                  
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

<a id="couchbase-admin-cmdline-vbuckettool"></a>

## vbuckettool Tool

Returns vBucket and node where a key should be for a Couchbase bucket. These two
values based on Couchbase Server internal hashing algorithm. Moved as of 1.8 to
/bin/tools directory.

<a id="table-couchbase-admin-cmdline-vbuckettool-locs"></a>

**Linux**    | `/opt/couchbase/bin/tools/`                                                      
-------------|----------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

<a id="couchbase-admin-restapi"></a>
