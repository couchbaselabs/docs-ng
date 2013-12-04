# couchbase-cli Tool

You can find this tool in the following locations, depending upon your platform.
This tool can perform operations on an entire cluster, on a bucket shared across
an entire cluster, or on a single node in a cluster. For instance, if you use
this tool to create a data bucket, it will create a bucket that all nodes in the
cluster have access to.

<a id="table-couchbase-admin-cmdline-couchbase-cli-locs"></a>

Operating System | Directory Locations
-------------|-----------------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin/couchbase-cli`                                                      
**Windows**  | `C:\Program Files\Couchbase\Server\bin\couchbase-cli.exe`                               
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/couchbase-cli`

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
   
	Option | Description
   -----------------------------------|-----------------------------------
   `-u USERNAME, --user=USERNAME`     | Admin username of the cluster
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
`setting-compacttion`  | `--compaction-period-from=HH:MM`           | Enable compaction from this time onwards                                
`setting-compacttion`  | `--compaction-period-to=HH:MM`             | Stop enabling compaction at this time                                   
`setting-compacttion`  | `--enable-compaction-abort=[0|1]`          | Allow compaction to abort when time expires                             
`setting-compacttion`  | `--enable-compaction-parallel=[0|1]`       | Allow parallel compaction processes for database and view               
                       |                                            |                                                                         
`setting-notification` | `--enable-notification=[0|1]`              | Allow notifications                                                     
                       |                                            |                                                                         
`setting-alert`        | `--enable-email-alert=[0|1]`               | Allow email alert                                                       
`setting-alert`        | `--email-recipients=RECIPIENT`             | Email recipents, separate addresses with, or ;                          
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
`xdcr-replicate`       | `--xdcr-clucter-name=CLUSTERNAME`          | Remote cluster to replicate to                                          
`xdcr-replicate`       | `--xdcr-to-bucket=BUCKETNAME`              | Remote bucket to replicate to   
`xdcr-replicate`  | `--xdcr-replication-mode= PROTOCOL` | Select REST protocol or memcached for replication. `xmem` indicates memcached while `capi` indicates REST protocol.                                                    

You can also perform many of these same settings using the REST API, see [Using
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
       --enable-flush=1

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

        Create a remote cluster reference named "RemoteCluster":
        couchbase-cli xdcr-setup -c 10.3.121.121:8091 -u Administrator  -p password \
         --create --xdcr-cluster-name=RemoteCluster  --xdcr-hostname=10.3.121.123:8091 \ 
         --xdcr-username=Administrator  --xdcr-password=password
    

```

<a id="couchbase-admin-cli-xmem"></a>

## Setting XDCR Protocol with couchbase-cli

As of Couchbase Server 2.2+ you can select the mode of replication for 
XDCR. For information about this feature, see [XDCR Behavior and Limitations](#couchbase-admin-tasks-xdcr-functionality). 

If you change want the replication protocol for an existing XDCR replication, you need to delete the replication, then re-create the replication with your preference.

First we create a destination cluster reference named "RemoteCluster":

        couchbase-cli xdcr-setup -c hostname_:8091 -u Administrator  -p password \
         --create --xdcr-cluster-name=RemoteCluster  --xdcr-hostname=10.3.121.123:8091 \ 
         --xdcr-username=Administrator  --xdcr-password=password
         
Upon success, we get this response:

        SUCCESS: init RemoteCluster
        
Now you can start replication to the remote cluster using memcached protocol as the existing default:

        couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password \
        --xdcr-cluster-name RemoteCluster --xdcr-from-bucket default --xdcr-to-bucket backup

If you changed the protocol, you can explicitly set it once again to memcached:

        couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password \
        --xdcr-cluster-name RemoteCluster --xdcr-from-bucket default --xdcr-to-bucket backup \
        --xdcr-replication-mode xmem

To use REST for this replication:

        couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password \ 
        --xdcr-cluster-name RemoteCluster --xdcr-from-bucket default --xdcr-to-bucket backup \
        --xdcr-replication-mode capi
        
If there is already an existing replication for a bucket, you will get an error when you 
try to start the replication again with any new settings:

    couchbase-cli xdcr-replicate -c 10.3.121.121:8091 -u Administrator -p password \
    --xdcr-cluster-name RemoteCluster --xdcr-from-bucket default --xdcr-to-bucket backup \
    --xdcr-replication-mode capi
        
Will result in  the error:

        ERROR: unable to create replication (400) Bad Request
        {u'errors': {u'_': u'Replication to the same remote cluster and bucket already exists'}}
        ERROR: Replication to the same remote cluster and bucket already exists


## Flushing Buckets with couchbase-cli

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

