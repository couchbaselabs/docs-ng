<a id="couchbase-admin-cmdline-cbepctl"></a>

# cbepctl Tool

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
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbepctl.exe`                               
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbepctl`

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

## Changing the Disk Cleanup Interval

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

## Changing Disk Write Queue Quotas

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

## Changing Access Log Settings

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

## Changing Thresholds for Ejection

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
ejection defaults for Couchbase Server 2.0 unless you are required to do so.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

For technical information about the ejection process, the role of NRU and server
processes related to ejection, see [Ejection and Working Set
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
data from a node whether or not the data is frequently or infrequently used. By
default, the server is configured to eject 40% random active items and will
eject 60% random replica data from a node.

You change also the default percentage for ejection of active items versus
replica items using the Couchbase command-line tool, `cbepctl` :


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

For technical information about the ejection process, the role of NRU and server
processes related to ejection, see [Ejection and Working Set
Management](#couchbase-admin-tasks-working-set-mgmt).

<a id="couchbase-admin-cbepctl-mutation_mem"></a>

## Changing Setting for Out Of Memory Errors

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

## Enabling Flush of Data Buckets - Will be Deprecated

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

You can initiate the flush via the REST API. For information about changing this
setting in the Web Console, see [Viewing Data
Buckets](#couchbase-admin-web-console-data-buckets). For information about
flushing data buckets via REST, see [Flushing a
Bucket](#couchbase-admin-restapi-flushing-bucket).

<a id="couchbase-admin-cbepctl-flush-params"></a>

## Other cbepctl flush_param

The complete list of options for `flush_param` are:

Parameter                       | Description                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------
**alog\_sleep\_time**           | Access scanner interval (minute)                                                                                                   
**alog\_task\_time**            | Access scanner next task time (UTC)                                                                                                
**bg\_fetch\_delay**            | Delay before executing a bg fetch (test feature).                                                                                  
**couch\_response\_timeout**    | timeout in receiving a response from CouchDB.                                                                                      
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
