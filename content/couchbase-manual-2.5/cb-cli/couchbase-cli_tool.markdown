<title="couchbase-cli tool">
<a id="cb-cli-couchbase-cli"></a>


# couchbase-cli tool

The couchbase-cli tool is located in the following paths, depending upon the platform.
This tool can perform operations on an entire cluster, on a bucket shared across
an entire cluster, or on a single node in a cluster. For instance, if this tool is used to create a data bucket, 
all nodes in the cluster have access the bucket.

<div class="notebox">
<p>Note</p>
<p>Many of these same settings can be performed using the REST API.
</p>
</div>

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

 * `CLUSTER` is a cluster specification.  The following shows both short and long form syntax:

```
// Short form
	-c HOST[:PORT]
// Long form
	--cluster=HOST[:PORT]
```

 
 * `OPTIONS` are zero or more options as follows:

   <a id="table-couchbase-admin-couchbase-cli-options"></a>
   
Option | Description
   -----------------------------------|-----------------------------------
   `-u USERNAME, --user=USERNAME`     |  Admin username of the cluster
   `-p PASSWORD, --password=PASSWORD` |  Admin password of the cluster
   `-o KIND, --output=KIND`           | Type of document: JSON or standard
   `-d, --debug`                      | Output debug information

<a id="couchbase-admin-cmdline-couchbase-commands"></a>

## couchbase-cli commands

Command                | Description                                          
-----------------------|------------------------------------------------------
`server-list`          | List all servers in a cluster                        
`server-info`          | Show details on one server                           
`server-add`           | Add one or more servers to the cluster               
`server-readd`         | Readds a server that was failed over   
`group-manage`         | Manages server groups  (Enterprise Edition only)    
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


## couchbase-cli command  options
The following are options which can be used with their respective commands.
Administration — `couchbase-cli` Tool commands options:

<a id="couchbase-admin-cmdline-couchbase-commands-stdopts"></a>


### server-list option
server-list options                         | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
--group-name=GROUPNAME | Displays all server in a server group (Enterprise Edition only)

### server-add options

server-add options                         | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--server-add=HOST[:PORT]`                 | Server to add to cluster                                                
`--server-add-username=USERNAME`           | Admin username for the server to be added                               
`--server-add-password=PASSWORD`           | Admin password for the server to be added   
`--group-name=GROUPNAME`  | Server group where the server is to be added (Enterprise Edition only)                           


### server-readd options 

server-readd options                         | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--server-add=HOST[:PORT]`                 | Server to re-add to cluster                                             
`--server-add-username=USERNAME`           | Admin username for the server to be added                               
 `--server-add-password=PASSWORD`           | Admin password for the server to be added                               
`--group-name=GROUPNAME`  | Server group where the server is to be added (Enterprise Edition only)

### group-manage options (Enterprise Edition only)

group-manage options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--group-name=GROUPNAME` | Server group name
`--list`              | Shows the server groups and the server assigned to each server group
`--create`        |  Creates a server group.
`--delete`     | Removes an empty server group.    
`--rename=NEWGROUPNAME` | Renames an existing server group.
`---add-servers="HOST:PORT;HOST:PORT"` | Adds servers to a group 
`--move-servers="HOST:PORT;HOST:PORT"` | Moves a list of server from a group
`--from-group=GROUPNAME ` | Moves one or more servers from a group.  
`--to-group=GROUPNAME` | Moves one or more server to a group

### rebalance options

rebalance options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
 `--server-add*`                            | See server-add OPTIONS                                                  
 `--server-remove=HOST[:PORT]`              | The server to remove from cluster    
                                 


### failover option

failover option                   | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--server-failover=HOST[:PORT]`            | Server to failover                                                      

### cluster-* options

cluster-* options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
 `--cluster-username=USER`                  | New admin username                                                      
`--cluster-password=PASSWORD`              | New admin password                                                      
 `--cluster-port=PORT`                      | New cluster REST/http port                                              
 `--cluster-ramsize=RAMSIZEMB`              | Per node RAM quota in MB                                                


### node-init options
node-init options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--node-init-data-path=PATH`               | Per node path to store data                                             
`--node-init-index-path=PATH`              | Per node path to store index    
`--note-init-hostname=NAME`                   | Host name for the node. Default: 127.0.0.1               

### bucket-* options

bucket-* options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--bucket=BUCKETNAME`                      | Named bucket to act on                                                  
`--bucket-type=TYPE`                       | Bucket type, either memcached or couchbase                              
 `--bucket-port=PORT`                       | Supports ASCII protocol and does not require authentication             
 `--bucket-password=PASSWORD`               | Standard port, exclusive with bucket-port                               
`--bucket-ramsize=RAMSIZEMB`               | Bucket RAM quota in MB                                                  
`--bucket-replica=COUNT`                   | Replication count                                                       
`--enable-flush=[0\|1]`                     | Enable/disable flush                                                    
`--enable-index-replica=[0\|1]`             | Enable/disable index replicas                                           
`--wait`                                   | Wait for bucket create to be complete before returning                  
`--force`                                  | Force command execution without asking for confirmation                 
`--data-only`                              | Compact database data only                                              
 `--view-only`                              | Compact view data only                                                  

### setting-compaction options

setting-compaction options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
 `--compaction-db-percentage=PERCENTAGE`    | Percentage of disk fragmentation when database compaction is triggered  
 `--compaction-db-size=SIZE[MB]`            | Size of disk fragmentation when database compaction is triggered        
`--compaction-view-percentage=PERCENTAGE`  | Percentage of disk fragmentation when views compaction is triggered     
 `--compaction-view-size=SIZE[MB]`          | Size of disk fragmentation when views compaction is triggered           
`--compaction-period-from=HH:MM`           | Enable compaction from this time onwards                                
`--compaction-period-to=HH:MM`             | Stop enabling compaction at this time                                   
`--enable-compaction-abort=[0\|1]`          | Allow compaction to abort when time expires                             
`--enable-compaction-parallel=[0\|1]`       | Allow parallel compaction processes for database and view               

### setting-alert and notification options

setting-alert options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------               |                                                                         
`--enable-email-alert=[0\|1]`               | Allow email alert                                                       
`--email-recipients=RECIPIENT`             | Email recipents, separate addresses with, or ;                          
 `--email-sender=SENDER`                    | Sender email address                                                    
`--email-user=USER`                        | Email server username                                                   
`--email-password=PWD`                     | Email server password                                                   
`--email-host=HOST`                        | Email server hostname                                                   
`--email-port=PORT`                        | Email server port                                                       
 `--enable-email-encrypt=[0\|1]`             | Email encryption with 0 the default for no encryption                   
`--alert-auto-failover-node`               | Node was failed over via autofailover                                   
`--alert-auto-failover-max-reached`        | Maximum number of auto failover nodes reached                           
`--alert-auto-failover-node-down`          | Node not auto failed-over as other nodes are down at the same time      
`--alert-auto-failover-cluster-small`      | Node not auto failed-over as cluster was too small                      
`--alert-ip-changed`                       | Node ip address changed unexpectedly                                    
`--alert-disk-space`                       | Disk space used for persistent storage has reached at least 90% capacity
`--alert-meta-overhead`                    | Metadata overhead is more than 50% of RAM for node                      
`--alert-meta-oom`                         | Bucket memory on a node is entirely used for metadata                   
`--alert-write-failed`                     | Writing data to disk for a specific bucket has failed                   
 
setting-notification option                 | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------                                              
`--enable-notification=[0\|1]`              | Allow notifications                                                     


### setting-autofailover options

setting-autofailover options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--enable-auto-failover=[0\|1]`             | Allow auto failover                                                     
`--auto-failover-timeout=TIMEOUT (>=30)`   | Specify amount of node timeout that triggers auto failover      

### setting-xdcr options        

setting-xdcr options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--max-concurrent-reps=[32]`               | Maximum concurrent replicators per bucket, 8 to 256.                    
`--checkpoint-interval=[1800]`             | Intervals between checkpoints, 60 to 14400 seconds.                     
`--worker-batch-size=[500]`                | Doc batch size, 500 to 10000.                                           
`--doc-batch-size=[2048]KB`                | Document batching size, 10 to 100000 KB                                 
`--failure-restart-interval=[30]`          | Interval for restarting failed xdcr, 1 to 300 seconds                   
`--optimistic-replication-threshold=[256]` | Document body size threshold (bytes) to trigger optimistic replication  

### xdcr-setup options

xdcr-setup options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--create`                                 | Create a new xdcr configuration                                         
`--edit`                                   | Modify existed xdcr configuration                                       
`--delete`                                 | Delete existing xdcr configuration                                      
`--xdcr-cluster-name=CLUSTERNAME`          | Remote cluster name                                                     
`--xdcr-hostname=HOSTNAME`                 | Remote host name to connect to                                          
`--xdcr-username=USERNAME`                 | Remote cluster admin username                                           
`--xdcr-password=PASSWORD`                 | Remote cluster admin password  
`--xdcr-demand-encryption=[0\|1]`          | Enables data encryption using Secure Socket Layer (SSL). **1** (one) enables data encryption. Default: 0 (Enterprise Edition only)
`--xdcr-certificate=CERTIFICATE`           | Specifies the pem-encoded certificate. The certificate is required for XDCR data encryption. Specify the full path for the location of the pem-encoded certificate file on the source cluster. (Enterprise Edition only)                                         

### xdcr-replicate options

xdcr-replicate options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------  
`--create`                                 | Create and start a new replication                                      
`--delete`                                 | Stop and cancel a replication                                           
`--xdcr-from-bucket=BUCKET`                | Source bucket name to replicate from                                    
`--xdcr-clucter-name=CLUSTERNAME`          | Remote cluster to replicate to                                          
`--xdcr-to-bucket=BUCKETNAME`              | Remote bucket to replicate to   
`--xdcr-replication-mode= PROTOCOL` | Select REST protocol or memcached for replication. `xmem` indicates memcached while `capi` indicates REST protocol.                                                    

### ssl-manage options

ssl-manage options                  | Description                                                             
--------------------------------------------|-------------------------------------------------------------------------
`--regenerate-cert=CERTIFICATE`             | Regenerates a self-signed certificate on the destination cluster. Specify the full path for the location of the pem-encoded certificate file. For example, `--regenerate-cert=./new.pem`. (Enterprise Edition only)
`--retrieve-cert=CERTIFICATE`               | Retrieves the self-signed certificate from the destination cluster to the source cluster. Specify a local location (full path) and file name for the pem-encoded certificate. For example, `--retrieve-cert=./newCert.pem`. (Enterprise Edition only)


## Managing servers

To set a data path for an unprovisioned cluster:


<pre><code>
couchbase-cli node-init -c 192.168.0.1:8091 \
       --node-init-data-path=/tmp/data \
       --node-init-index-path=/tmp/index
</code></pre>

To list servers in a cluster:

<pre><code> 
couchbase-cli server-list -c 192.168.0.1:8091
</code></pre>

### Retrieving server information

```
couchbase-cli server-info -c 192.168.0.1:8091
```

### Adding nodes to clusters

The following example adds a node to a cluster but does not rebalance:

```
couchbase-cli server-add -c 192.168.0.1:8091 \
	--server-add=192.168.0.2:8091 \
	--server-add-username=Administrator \
	--server-add-password=password
```

The following example adds a node to a cluster and rebalances:

```
couchbase-cli rebalance -c 192.168.0.1:8091 \
	--server-add=192.168.0.2:8091 \
	--server-add-username=Administrator \
	--server-add-password=password
```

### Removing nodes
The following example removes a node from a cluster and rebalances:

```
couchbase-cli rebalance -c 192.168.0.1:8091 \
	--server-remove=192.168.0.2:8091
```

The following example removes and adds nodes from/to a cluster and rebalances:

```
couchbase-cli rebalance -c 192.168.0.1:8091 \
	--server-remove=192.168.0.2 \
	--server-add=192.168.0.4 \
	--server-add-username=Administrator \
	--server-add-password=password
```

### Stopping rebalance
The following example stops the current rebalancing:

```
couchbase-cli rebalance-stop -c 192.168.0.1:8091
```

### Setting cluster parameters
The following example sets the username, password, port and ram quota:

```
couchbase-cli cluster-init -c 192.168.0.1:8091 \
	--cluster-init-username=Administrator \
	--cluster-init-password=password \
	--cluster-init-port=8080 \
	--cluster-init-ramsize=300
```

The following example changes the cluster username, password, port and ram quota:

```
    couchbase-cli cluster-edit -c 192.168.0.1:8091 \
       --cluster-username=Administrator \
       --cluster-password=password \
       --cluster-port=8080 \
       --cluster-ramsize=300
```


### Changing data paths
The following example changes the data path:

```
     couchbase-cli node-init -c 192.168.0.1:8091 \
       --node-init-data-path=/tmp
```

<a id="cb-cli-rack-aware"></a>

## Managing Rack Awareness
The Rack Awareness feature allows logical groupings of servers on a cluster where each server group physically belongs to a rack or availability zone. This feature provides the ability to specify that active and corresponding replica partitions be created on servers that are part of a separate rack or zone. To enable Rack Awareness, all servers in a cluster must be upgraded to use the Rack Awareness feature. 

<div class="notebox">
<p>Note</p>
<p>The Rack Awareness feature with its server group capability is an Enterprise Edition feature.</p>
</div>

To configure servers into groups, use the `couchbase-cli` tool with the `group-manage` command.

General syntax with `group-manage`:

```
couchbase-cli group-manage -c HOST:PORT 
	-u USERNAME -p PASSWORD
	[OPTIONS]
```

`-c HOST:PORT or --cluster=HOST:PORT`  
: Cluster location   

`-u USERNAME or --username=USERNAME`  
: Administrator username for the cluster  
   
`-p PASSWORD or --password=PASSWORD `  
: Administrator password for the cluster    

`--list`  
: Shows the server groups and the servers assigned to each server group.

`--create --group-name=groupName`
: Creates a server group .

`--delete --group-name=groupName`
: Removes an empty server group.

`--rename=newGroupName --group-name=oldGroupName`
: Renames an existing server group.

`--group-name=groupName --add-servers="HOST:PORT;HOST:PORT"` 
: Adds  servers to a group.

`--from-group=groupName --to-group=groupName --move-servers="HOST:PORT;HOST:PORT"`
: Moves one or more servers from one group to another.



### Creating server groups
In the following example, a server group is created.

<div class="notebox"><p>Note</p>
<p>The `--create --group-name` command may fail when an exclamation (!) is present inside the group name.
</p></div>


```
couchbase-cli group-manage -c 192.168.0.1:8091 
   -u myAdminName
   -p myAdminPassword
   --create --group-name=myGroupName
```

### Adding servers to server groups
In the following example, two servers are added to a server group using the `group-manage` command.

```
couchbase-cli group-manage -c 192.168.0.1:8091 
   -u myAdminName
   -p myAdminPassword
   --group-name=myNewGroup
   --add-servers="10.1.1.1:8091;10.1.1.2:8091"
```

In the following example, a server is added to the server group using the `server-add` command.


<div class="notebox"><p>Note</p>
<p>The `couchbase-cli group-manage' command is the preferred method of adding servers to 
server group.</p>
<p>If the `--group-name` option is not specified with the `server-add` command, the server 
is added to the default group.</p>
</div>

```
couchbase-cli server-add -c 192.168.0.1:8091
   --server-add=192.168.0.2:8091
   --server-add-username=Administrator
   --server-add-password=password
   --group-name=groupName
```



### Moving servers from server groups
In the following example, two servers are moved from one server group to another using the `group-manage` command.

```
couchbase-cli group-manage -c 192.168.0.1:8091 
   -u myAdminName
   -p myAdminPassword
   --from-group=myFirstGroup
   --to-group=mySecondGroup
   --move-servers="10.1.1.1:8091;10.1.1.2:8091"
```


## Managing buckets
This section provides examples for listing, creating, modifying, flushing, and compacting buckets.

### Listing bucketss

To list buckets in a cluster:

```
    couchbase-cli bucket-list -c 192.168.0.1:8091
```

### Creating buckets

To create a new dedicated port couchbase bucket:

```
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=couchbase \
       --bucket-port=11222 \
       --bucket-ramsize=200 \
       --bucket-replica=1
```

To create a couchbase bucket and wait for bucket ready:

```
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=couchbase \
       --bucket-port=11222 \
       --bucket-ramsize=200 \
       --bucket-replica=1 \
       --wait
```

To create a new sasl memcached bucket:

```
    couchbase-cli bucket-create -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-type=memcached \
       --bucket-password=password \
       --bucket-ramsize=200 \
       --enable-flush=1 \
       --enable-index-replica=1
```

### Modifying buckets

To modify a dedicated port bucket:

```
    couchbase-cli bucket-edit -c 192.168.0.1:8091 \
       --bucket=test_bucket \
       --bucket-port=11222 \
       --bucket-ramsize=400 \
       --enable-flush=1
```

### Deleting buckets
 To delete a bucket:

```
    couchbase-cli bucket-delete -c 192.168.0.1:8091 \
       --bucket=test_bucket
```

### Flushing buckets
Flushing buckets involves:

1. Enable the flush buckets option.
1. Flush the bucket.

To enable the flush bucket option:

When you want to flush a data bucket you must first enable this option then
actually issue the command to flush the data bucket.  The
other option available to enable data bucket flush is to use the Couchbase Web
Console, see [Creating and editing data
buckets](../cb-admin/#couchbase-admin-web-console-data-buckets-createedit). 

<div class="notebox">
<p>Note</p>
<p>We do not advise that you
enable this option if your data bucket is in a production environment. Be aware
that this is one of the preferred methods for enabling data bucket flush.
</p></div>


You can enable this option when you actually create the data bucket, or when you edit the
bucket properties:


```
// To enable, set bucket flush to 1. Default:0
// To enable bucket flush when creating a bucket:

couchbase-cli bucket-create [bucket_name] [cluster_admin:pass] --enable-flush=[0|1]

// To enable bucket flush when editing the bucket properties:

couchbase-cli bucket-edit [bucket_name] [cluster_admin:pass] --enable-flush=[0|1]
```

After you enable this option, you can then flush the data bucket.

To flush a bucket:

After you explicitly enable data bucket flush, flush the data from the
bucket. Flushing a bucket is data destructive. Client applications using this
are advised to double check with the end user before sending such a request. You
can control and limit the ability to flush individual buckets by setting the
`flushEnabled` parameter on a bucket in Couchbase Web Console or via
`couchbase-cli` as described in the previous section. See also [Creating and
Editing data buckets](../cb-admin/#couchbase-admin-web-console-data-buckets-createedit).


**Syntax**

```
> couchbase-cli bucket-flush [cluster_admin:pass] [bucket_name OPTIONS]
```

By default, this command confirms whether or not you truly want to flush the
data bucket. You can optionally call this command with the `--force` option to
flush data without confirmation.


**Example**

```
    couchbase-cli bucket-flush -c 192.168.0.1:8091 \
       --force
```

### Compacting buckets
To compact a bucket for both data and view:

```
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket
```

To compact a bucket for data only:

```
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket \
        --data-only
```

To compact a bucket for view only:

```
    couchbase-cli bucket-compact -c 192.168.0.1:8091 \
        --bucket=test_bucket \
        --view-only
```

<a id="cb-cli-xdcr"></a>

## Managing XDCR

To create a XDCR remote cluster:

```
    couchbase-cli xdcr-setup -c 192.168.0.1:8091 \
        --create \
        --xdcr-cluster-name=test \
        --xdcr-hostname=10.1.2.3:8091 \
        --xdcr-username=Administrator \
        --xdcr-password=password
```

To delete a XDCR remote cluster:

```
    couchbase-cli xdcr-delete -c 192.168.0.1:8091 \
        --xdcr-cluster-name=test
```

### Managing XDCR replication streams

To start a replication stream:

```
    couchbase-cli xdcr-replicate -c 192.168.0.1:8091 \
        --create \
        --xdcr-cluster-name=test \
        --xdcr-from-bucket=default \
        --xdcr-to-bucket=default1
```
        
To delete a replication stream:

```
    couchbase-cli xdcr-replicate -c 192.168.0.1:8091 \
        --delete \
        --xdcr-replicator=f4eb540d74c43fd3ac6d4b7910c8c92f/default/default
```

### Managing remote clusters

To create a remote cluster reference:

In the following example the remote cluster is "RemoteCluster".

```
couchbase-cli xdcr-setup -c 10.3.121.121:8091 -u Administrator  -p password \
	--create 
	--xdcr-cluster-name=RemoteCluster  
	--xdcr-hostname=10.3.121.123:8091  
	--xdcr-username=Administrator  
	--xdcr-password=password
```


<a id="couchbase-admin-cli-xmem"></a>

To set a XDCR protocol:

An XDCR protocol for the mode of replication can be specified for 
XDCR. For information about this feature, see [XDCR Behavior and Limitations](../cb-admin/#couchbase-admin-tasks-xdcr-functionality). 

To change a XDCR replication protocol for an existing XDCR replication:

If you change want the replication protocol for an existing XDCR replication:

1. Delete the replication.
1. Re-create the replication with your preference.

First we create a destination cluster reference named "RemoteCluster":

```
couchbase-cli xdcr-setup -c hostname_:8091 -u Administrator  -p password \
  --create --xdcr-cluster-name=RemoteCluster  --xdcr-hostname=10.3.121.123:8091 \ 
  --xdcr-username=Administrator  --xdcr-password=password
```
         
Upon success, we get this response:

        SUCCESS: init RemoteCluster
        
Now you can start replication to the remote cluster using memcached protocol as the existing default:

```
couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password 
        --xdcr-cluster-name RemoteCluster 
        --xdcr-from-bucket default 
        --xdcr-to-bucket backup
```


To explicitly set the protocol to memcached:


```
couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password \
	--xdcr-cluster-name RemoteCluster 
	--xdcr-from-bucket default 
	--xdcr-to-bucket backup 
	--xdcr-replication-mode xmem
```

To set the protocol to CAPI:

```
couchbase-cli xdcr-replicate -c host_name:8091 -u Administrator -p password \ 
	--xdcr-cluster-name RemoteCluster 
	--xdcr-from-bucket default 
	--xdcr-to-bucket backup
	--xdcr-replication-mode capi
```
    
If there is already an existing replication for a bucket, you get an error when you 
try to start the replication again with any new settings:

```
 couchbase-cli xdcr-replicate -c 10.3.121.121:8091 -u Administrator -p password 
	--xdcr-cluster-name RemoteCluster 
	--xdcr-from-bucket default 
	--xdcr-to-bucket backup
    --xdcr-replication-mode capi
```

Results in the following error:

```
ERROR: unable to create replication (400) Bad Request
        {u'errors': {u'_': u'Replication to the same remote cluster and bucket already exists'}}
ERROR: Replication to the same remote cluster and bucket already exists
```

<a id="cb-cli-xdcr-data-encrypt"></a>
### Managing XDCR data encryption

The Couchbase Server command line interface (CLI) enables XDCR data encryption (Enterprise Edition only) 
when an XDCR cluster reference is created or modified. The CLI provides the `couchbase-cli` tool and the `xdcr-setup` command. 
The option `--xdcr-demand-encryption=1` enables XDCR data encryption  `-xdcr-certificate=CERTIFICATE` 
provides the SSL certificate for data security.

#### Enabling XDCR data encryption
To setup XDCR with SSL data encryption:

1. Retrieve the certificate from the destination cluster. See [Managing SSL certificates](#cb-cli-ssl-cert) for more information
1. Create or modify the XDCR configuration to allow data encryption and provide the SSL certificate.
1. Define the replication.    

To configure XDCR with SSL data encryption, the `xdcr-setup` command is used.

**Syntax**

```
couchbase-cli xdcr-setup -c localHost:port -u localAdmin -p localPassword
  --create --xdcr-cluster-name=remoteClustername 
  --xdcr-hostname=remoteHost:port 
  --xdcr-username=remoteAdmin --xdcr-password=remotePassword 
  --xdcr-demand-encryption=[0|1]   // 1 to enable, 0 to disable (default)
  --xdcr-certificate=<localPath>/<certFile>.pem  
```

**Example**

```
couchbase-cli xdcr-setup -c 10.3.4.186:8091 -u localAdmin -p localPassword
  --create --xdcr-cluster-name=Omaha 
  --xdcr-hostname=10.3.4.187:8091 
  --xdcr-username=Peyton --xdcr-password=Manning 
  --xdcr-demand-encryption=1 
  --xdcr-certificate=./new.pem  
```

**Results**

The following is an example of results for a successful XDCR configuration.

```
SUCCESS: init/edit test 
<<replication reference created>> 
```

#### Disabling XDCR data encryption
To disable XDCR data encryption, execute `couchbase-cli xdcr-setup` with `--xdcr-demand-encryption=0`. 

**Example**

```
couchbase-cli xdcr-setup -c 10.3.4.186:8091 -u localAdmin -p localPassword
  --create --xdcr-cluster-name=Omaha 
  --xdcr-hostname=10.3.4.187:8091 
  --xdcr-username=Peyton --xdcr-password=Manning 
  --xdcr-demand-encryption=0 
```



<a id="cb-cli-ssl-cert"></a>

### Managing SSL certificates

Retrieving an SSL certificate for XDCR data encryption, should be done in a secure manner, such as with `ssh` and `scp`. For example:

1. Use a secure method to log in to a node on the destination cluster. For example: `ssh`.
1. Retrieve the certificate with the `couchbase-cli ssl-manage` command.
1. Use a secure method  to transfer the certificate from the destination cluster to the source cluster. For example: `scp`.
1. Proceed with setting up XDCR with SSL data encryption. See [Managing XDCR data encryption](#cb-cli-xdcr-data-encrypt).

The  `couchbase-cli ssl-manage` command provides the following options for regenerating and retrieving certificates.


`--regenerate-cert=CERTIFICATE`
: Regenerates a self-signed certificate on the destination cluster. Specify the full path for the location of the pem-encoded certificate file. For example, `--regenerate-cert=./new.pem`.

`--retrieve-cert=CERTIFICATE`
: Retrieves the self-signed certificate from the destination cluster to the source cluster. Specify a local location (full path) and file name for the pem-encoded certificate. For example, `--retrieve-cert=./newCert.pem`.


#### Retrieving certificates

To retrieve an existing self-signed certificate, the `ssl-manage` command is used.


**Syntax**

```
couchbase-cli ssl-manage -c localHost:port 
  -u Administrator -p password 
  --retrieve-cert=./<newCert>.pem 
```

**Example**

```
couchbase-cli ssl-manage -c 10.3.4.187:8091 
  -u Administrator -p password 
  --retrieve-cert=./newCert.pem 
```

**Results**

The following is an example of results for a successful retrieval of the certificate:

```
SUCCESS: retrieve certificate to './newCert.pem' 
Certificate matches what seen on GUI 
```


#### Regenerating certificates
To regenerate a self-signed certificate, use `couchbase-cli ssl-manage` command. 

**Syntax**

```
couchbase-cli ssl-manage 
  -c remoteHost:port 
  -u adminName -p adminPassword 
  --regenerate-cert=CERTIFICATE 
```


**Example**

The following is an example of the CLI commands and options for regenerating a self-signed certificate with the `ssl-manage` command:

```
couchbase-cli ssl-manage 
  -c 10.3.4.187:8091 
  -u Administrator -p password 
  --regenerate-cert=./new.pem 
```

**Results**

The following is an example of results for a successful regeneration of the certification:

```
SUCCESS: regenerate certificate to './new.pem' 
```


To retrieve an existing self-signed certificate, the `ssl-manage` command is used.

**Syntax**

```
couchbase-cli ssl-manage -c localHost:port 
  -u Administrator -p password 
  --retrieve-cert=./<newCert>.pem 
```

**Example**

```
couchbase-cli ssl-manage -c 10.3.4.187:8091 
  -u Administrator -p password 
  --retrieve-cert=./newCert.pem 
```

**Results**

The following is an example of results for a successful retrieval of the certificate:

```
SUCCESS: retrieve certificate to './newCert.pem' 
Certificate matches what seen on GUI 
```



