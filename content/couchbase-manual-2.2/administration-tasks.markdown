# Administration Tasks

For general running and configuration, Couchbase Server is self-managing. The
management infrastructure and components of the Couchbase Server system are able
to adapt to the different events within the cluster. There are only a few
different configuration variables, and the majority of these do not need to be
modified or altered in most installations.

However, there are a number of different tasks that you will need to carry out
over the lifetime of your cluster, such as backup, failover and altering the
size of your cluster as your application demands change. You will also need to
monitor and react to the various statistics reported by the server to ensure
that your cluster is operating at the highest performance level, and to expand
your cluster when you need to expand the RAM or disk I/O capabilities.

These administration tasks include:

 * **Increasing or Reducing Your Cluster Size**

   When your cluster requires additional RAM, disk I/O or network capacity, you
   will need to expand the size of your cluster. If the increased load is only a
   temporary event, then you may later want to reduce the size of your cluster.

   You can add or remove multiple nodes from your cluster at the same time. Once
   the new node arrangement has been configured, the process redistributing the
   data and bringing the nodes into the cluster is called `rebalancing`. The
   rebalancing process moves the data around the cluster to match the new
   structure, and can be performed live while the cluster is still servicing
   application data requests.

   More information on increasing and reducing your cluster size and performing a
   rebalance operation is available in
   [Rebalancing](#couchbase-admin-tasks-addremove).

 * **Warming up a Server** There may be cases where you want to explicitly shutdown
   a server and then restart it. Typically the server had been running for a while
   and has data stored on disk when you restart it. In this case, the server needs
   to undergo a warmup process before it can again serve data requests. To manage
   the warmup process for Couchbase Server instances, see [Handling Server
   Warmup](#couchbase-admin-tasks-warmup-access).

 * **Handle a Failover Situation**

   A failover situation occurs when one of the nodes within your cluster fails,
   usually due to a significant hardware or network problem. Couchbase Server is
   designed to cope with this situation through the use of replicas which provide
   copies of the data around the cluster which can be activated when a node fails.

   Couchbase Server provides two mechanisms for handling failover. Automated
   Failover allows the cluster to operate autonomously and react to failovers
   without human intervention. Monitored failover enables you to perform a
   controlled failure by manually failing over a node. There are additional
   considerations for each failover type, and you should read the notes to ensure
   that you know the best solution for your specific situation.

   For more information, see [Failing Over Nodes](#couchbase-admin-tasks-failover).

 * **Manage Database and View Fragmentation**

   The database and view index files created by Couchbase Server can become
   fragmented. This can cause performance problems, as well as increasing the space
   used on disk by the files, compared to the size of the information they hold.
   Compaction reduces this fragmentation to reclaim the disk space.

   Information on how to enable and configure auto-compaction is available in
   [Database and View Compaction](#couchbase-admin-tasks-compaction).

 * **Backup and Restore Your Cluster Data**

   Couchbase Server automatically distributes your data across the nodes within the
   cluster, and supports replicas of that data. It is good practice, however, to
   have a backup of your bucket data in the event of a more significant failure.

   More information on the available backup and restore methods are available in
   [Backup and Restore](#couchbase-backup-restore).

<a id="couchbase-admin-tasks-read-only"></a>

##Read-Only Users

As of Couchbase Server 2.2+ you can create one non-administrative user who has read-only access in Web Console and the REST API. A read-only user cannot create buckets, edit buckets, add nodes to clusters, change XDCR setup, create views or see any stored data. Any REST API calls which require an administrator will fail and return an error for this user. In the Web Console a read-only user will be able to view:

   - Cluster Overview.
   - Design documents and views but cannot query views.
   - Bucket summaries including Cache Size and Storage Size, but no documents in the buckets.
   - List of XDCR replications and remote clusters.
   - Logs under the Log tab, but the user cannot Generate Diagnostic Report.
   - Current settings for a cluster.

To create a read-only user:

1. In Couchbase Web Console, click Settings. A panel appears with several different sub-tabs.
2. Click Account Management. A panel appears where you can add the user:

   ![](images/read_only_setup.png)

3. Enter a Username, Password and verify the password.
4. Click Create. The panel refreshes and has options for resetting the read-only user password or deleting the user:
 ![](images/read_only_created.png)
 
The new user can now log into Couchbase Web Console in read-only mode or perform REST API requests that do not require administrative credentials. If a read-only performs a REST requests that changes cluster, bucket, XDCR, or node settings, the server will send an HTTP 401 error:

        HTTP/1.1 401 Unauthorized
        WWW-Authenticate: Basic realm="Couchbase Server Admin / REST"
        ....

For more information about Web Console or REST API, see [Using the Web Console](#couchbase-admin-web-console) or [Using the REST API](#couchbase-admin-restapi). You can also create a read-only user with the REST API, see [Creating Read-Only Users](#couchbase-restapi-read-only-user).
           
<a id="couchbase-admin-tasks-mrw"></a>

## Using Multi- Readers and Writers

As of Couchbase Server 2.1, we support multiple readers and writers to persist
data onto disk. For earlier versions of Couchbase Server, each bucket instance
had only single disk reader and writer workers. By default this is set to three
total workers per data bucket, with two reader workers and one writer worker for
the bucket. This feature can help you increase your disk I/O throughput. If your
disk utilization is below the optimal level, you can increase the setting to
improve disk utilization. If your disk utilization is near the maximum and you
see heavy I/O contention, you can decrease this setting. By default we allocate
three total readers and writers.

How you change this setting depends on the hardware in your Couchbase cluster:

 * If you deploy your cluster on the minimum hardware requirement which is
   dual-core CPUs running on 2GHz and 4GM of physical RAM, you should stay with the
   default setting of three.

 * If you deploy your servers on recommended hardware requirements or above you can
   increase this setting to eight. The recommended hardware requirements are
   quad-core processes on 64-bit CPU and 3GHz, 16GB RAM physical storage. We also
   recommend solid state drives.

 * If you have a hardware configuration which conforms to pre-2.1 hardware
   requirements, you should change this setting to the minimum, which is 2.

For more information about system requirements for Couchbase Server, see
[Resource Requirements](#couchbase-getting-started-prepare-hardware).

**Changing the Number of Readers and Writers**

You should configure this setting in Couchbase Web Console when you initially
create a data bucket. For general information on creating buckets, see [Creating
a New Bucket](#couchbase-admin-web-console-data-buckets-createedit-create).

 1. Under Data Buckets, click Create New Data Bucket.

    A Configure Bucket panel appears where you can provide settings for the new
    bucket.

 1. Select a number of reader/writers under Disk Read-Write Concurrency.


    ![](images/mrw_setting_panel.png)

 1. Provide other bucket-level settings of your choice.

 1. Click Create.

    The new bucket will appear under the Data Buckets tabs in Web Console with a
    yellow indicator to show the bucket is in warmup phase:


    ![](images/mrw_bucket_warmup.png)

    After the bucket completes warmup, it will appear with a green indicator next to
    it:


    ![](images/mrw_bucket_ready2.png)

    This default bucket is now ready to receive and serve requests. If you create a
    named bucket, you will see a similar status indicator next to your named bucket.

**Viewing Status of Multi- Readers and Writers**

After you change this setting you can view the status of this setting with
`cbstats` :


```
/opt/couchbase/bin/cbstats hostname:11210 -b bucket_name raw workload

 ep_workload:num_readers: 3
 ep_workload:num_shards:  3
 ep_workload:num_writers: 2
 ep_workload:policy:      Optimized for read data access
```

This indicates we have three reader threads and two writer threads on
`bucket_name` in the cluster at `hostname:11210`. The vBucket map for the data
bucket is grouped into multiple shards, where one read worker will access one of
the shards. In this example we have one reader for each of the three shards.
This report also tell us we are optimized for read data access because we have
more reader threads than writer threads for the bucket. You can also view the
number of threads if you view the data bucket properties via a REST call:


```
curl -u Admin:password http://localhost:8091/pools/default/buckets/bucket_name
```

This provides information about the named bucket as a JSON response, including
the total number of threads:


```
{"name":"bucket_name","bucketType":"couchbase"
....
"replicaNumber":1,
"threadsNumber":5,
....
}
```

To view the changed behavior, go to the Data Buckets tab and select your named
bucket. Under the summary section, you can view the `disk write queue` for
change in drain rate. Under the Disk Queues section, you see a change in the
active and replica `drain rate` fields after you change this setting. For more
information about bucket information in Web Console, see [Individual Bucket
Monitoring](#couchbase-admin-web-console-data-buckets-individual).

**Changing Readers and Writers for Existing Buckets**

You can change this setting after you create a data bucket in Web Console or
REST-API. If you do so, the bucket will be re-started and will go through server
warmup before it becomes available. For more information about warmup, see
[Handling Server Warmup](#couchbase-admin-tasks-warmup-access).

To change this setting in Web Console:

 1. Click the Data Buckets tab.

    A table with all data buckets in your cluster appears.

 1. Click the drop-down next to your data bucket.

    General information about the bucket appears as well as controls for the bucket.


    ![](images/mrw_edit_bucket.png)

 1. Click Edit.

    A Configure Bucket panel appears where you can edit the current settings for the
    bucket. The Disk Read-Write section is where you will change this setting.

 1. Enter a number of readers and writers.

 1. Click Save.

    A warning appears indicating that this change will recreate the data bucket.


    ![](images/mrw_bucket_edit_warning.png)

 1. Click Continue

    The Data Buckets tab appears and you see the named bucket with a yellow
    indicator. This tells you the bucket is recreated and is warming up. The
    indicator turns green when the bucket has completed warmup. At this point it is
    ready to receive and serve requests.

To change this setting via REST, we provide the `threadsNumber` parameter with a
value from two to eight. The following is an example REST call:


```
curl -X POST -u Admin:password http://10.3.3.72:8091/pools/default/buckets/bucket_name -d \
ramQuotaMB=4000 -d threadsNumber=3 -v
```

For details about changing bucket properties via REST, including limitations and
behavior, see [Creating and Editing Data
Buckets](#couchbase-admin-restapi-creating-buckets).

You see the following request via HTTP:


```
About to connect() to 10.3.3.72 port 8091 (#0)
 Trying 10.3.3.72... connected
 Connected to 10.3.3.72 (10.3.3.72) port 8091 (#0)
 Server auth using Basic with user 'Administrator'
 POST /pools/default/buckets/bucket_name HTTP/1.1
 ....
```

Upon success you will see this response:


```
HTTP/1.1 200 OK
....
```

If you provide an invalid number of threads, you will a response similar to the
following:


```
HTTP/1.1 400 Bad Request
....
{"errors":{"threadsNumber":"The number of threads can't be greater than 8"},"
```

If you upgrade a Couchbase cluster, a new node can use this setting without
bucket restart and warmup. In this case you set up a new 2.1+ node, add that
node to the cluster, and on that new node edit the existing bucket setting for
readers and writers. After you rebalance the cluster, this new node will perform
reads and writes with multiple readers and writers and the data bucket will not
restart or go through warmup. All existing pre-2.1 nodes will remain with a
single readers and writers for the data bucket. As you continue the upgrade and
add additional 2.1+ nodes to the cluster, these new nodes will automatically
pick up the setting and use multiple readers and writers for the bucket. For
general information about Couchbase cluster upgrade, see [Upgrading to Couchbase
Server 2.1](#couchbase-getting-started-upgrade).

<a id="couchbase-admin-tasks-warmup-access"></a>

## Handling Server Warmup

Couchbase Server 2.0+ provides improved performance for *server warmup* ; this
is the process a restarted server must undergo before it can serve data. During
this process the server loads items persisted on disk into RAM. One approach to
load data is to do sequential loading of items from disk into RAM; however it is
not necessarily an effective process because the server does not take into
account whether the items are frequently used. In Couchbase Server 2.0, we
provide additional optimizations during the warmup process to make data more
rapidly available, and to prioritize frequently-used items in an access log. The
server pre-fetches a list of most-frequently accessed keys and fetches these
documents before it fetches any other items from disk.

The server also runs a configurable scanner process which will determine which
keys are most frequently-used. You can use Couchbase Server command-line tools
to change the initial time and the interval for the process. You may want to do
this for instance, if you have a peak time for your application when you want
the keys used during this time to be quickly available after server restart. For
more information, see [Changing Access Log
Settings](#couchbase-admin-cbepctl-access-scanner).

The server can also switch into a ready mode before it has actually retrieved
all documents for keys into RAM, and therefore can begin serving data before it
has loaded all stored items. This is also a setting you can configure so that
server warmup is faster.

The following describes the initial warmup phases for the Couchbase Server 2.0+.
In these first phase, the server begins fetch all keys and metadata from disk.
Then the server gets access log information it needs to retrieve the most-used
keys:

 * **Initialize**. At this phase, the server does not have any data that it can
   serve yet. The server starts populating a list of all vBuckets stored on disk by
   loading the recorded, initial state of each vBucket.

 * **Key Dump**. In this next phase, the server begins pre-fetching all keys and
   metadata from disk based on items in the vBucket list.

 * **Check Access Logs**. The server then reads a single cached access log which
   indicates which keys are frequently accessed. The server generates and maintains
   this log on a periodic basis and it can be configured. If this log exists, the
   server will first load items based on this log before it loads other items from
   disk.

Once Couchbase Server has information about keys and has read in any access log
information, it is ready to load documents:

 * **Loading based on Access Logs** Couchbase Server loads documents into memory
   based on the frequently-used items identified in the access log.

 * **Loading Data**. If the access log is empty or is disabled, the server will
   sequentially load documents for each key based on the vBucket list.

Couchbase Server is able to serve information from RAM when one of the following
conditions is met during warmup:

 * The server has finished loading documents for all keys listed in the access log,
   or

 * The server has finished loading documents for every key stored on disk for all
   vBuckets, or

 * The total number of documents loaded into memory is greater than, or equal to,
   the setting for `ep_warmup_min_items_threshold`, or

 * If total % of RAM filled by documents is greater than, or equal to, the setting
   for `ep_warmup_min_memory_threshold`, or

 * If total RAM usage by a node is greater than or equal to the setting for
   `mem_low_wat`.

When the server reaches one of these states, this is known as the *run level* ;
when Couchbase Server reaches this point, it immediately stops loading documents
for the remaining keys. After this point, Couchbase Server will load this
remaining documents from disk into RAM as a background data fetch.

In order to adjust warmup behavior, it is also important for you to understand
the access log and scanning process in Couchbase Server 2.0. The server uses the
access log to determine which documents are most frequently used, and therefore
which documents should be loaded first.

The server has a process that will periodically scan every key in RAM and
compile them into a log, named `access.log` as well as maintain a backup of this
access log, named `access.old`. The server can use this backup file during
warmup if the most recent access log has been corrupted during warmup or node
failure. By default this process runs initially at 2:00 GMT and will run again
in 24- hour time periods after that point. You can configure this process to run
at a different initial time and at a different fixed interval.

If a client tries to contact Couchbase Server during warmup, the server will
produce a `ENGINE_TMPFAIL (0x0d)` error code. This error indicates that data
access is still not available because warmup has not yet finished. For those of
you who are creating your own Couchbase SDK, you will need to handle this error
in your library. This may mean that the client waits and retries, or the client
performs a backoff of requests, or it produces an error and does not retry the
request. For those of you who are building an application with a Couchbase SDK,
be aware that how this error is delivered and handled is dependent upon the
individual SDKs. For more information, refer to the Language Reference for your
chosen Couchbase SDK.

<a id="couchbase-admin-tasks-cbstats-warmup"></a>

### Getting Warmup Information

You can use `cbstats` to get information about server warmup, including the
status of warmup and whether warmup is enabled. The following are two alternates
to filter for the information:


```
> cbstats localhost:11210 -b beer_sample -p bucket_password all | grep 'warmup'
> cbstats hostname:11210 -b my_bucket -p bucket_password raw warmup
```

Here the `localhost:11210` is the host name and default memcached port for a
given node and `beer_sample` is a named bucket for the node. If you do not
specify a bucket name, the command will apply to any existing default bucket for
the node.

ep\_warmup\_thread | Indicates if the warmup has completed. Returns "running" or "complete".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ep\_warmup\_state  | * Indicates the current progress of the warmup: **Initial**. Start warmup processes.  * **EstimateDatabaseItemCount**. Estimating database item count.  * **KeyDump**. Begin loading keys and metadata based, but not documents, into RAM.  * **CheckForAccessLog**. Determine if an access log is available. This log indicates which keys have been frequently read or written.  * **LoadingAccessLog**. Load information from access log.  * **LoadingData**. This indicates the server is loading data first for keys listed in the access log, or if no log available, based on keys found during the 'Key Dump' phase.  * **Done**. Server is ready to handle read and write requests.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

There are more detailed statistics available on the warmup process. For more
information, see [Getting Warmup
Information](#couchbase-admin-cmdline-cbstats-warmup).

<a id="couchbase-admin-warmup-threshold"></a>

### Changing the Warmup Threshold

To modify warmup behavior by changing the setting for
`ep_warmup_min_items_threshold` use the command-line tool provided with your
Couchbase Server installation, `cbepctl`. This indicates the number of items
loaded in RAM that must be reached for Couchbase Server to begin serving data.
The lower this number, the sooner your server can begin serving data. Be aware,
however that if you set this value to be too low, once requests come in for
items, the item may not be in memory and Couchbase Server will experience
cache-miss errors.

<a id="couchbase-admin-tasks-access-scanner"></a>

### Changing Access Scanner Settings

The server runs a periodic scanner process which will determine which keys are
most frequently-used, and therefore, which documents should be loaded first
during server warmup. You can use `cbepctl flush_param` to change the initial
time and the interval for the process. You may want to do this, for instance, if
you have a peak time for your application when you want the keys used during
this time to be quickly available after server restart.

Note if you want to change this setting for an entire Couchbase cluster, you
will need to perform this command on per-node and per-bucket in the cluster. By
default any setting you change with `cbepctl` will only be for the named bucket
at the specific node you provide in the command.

This means if you have a data bucket that is shared by two nodes, you will
nonetheless need to issue this command twice and provide the different host
names and ports for each node and the bucket name. Similarly, if you have two
data buckets for one node, you need to issue the command twice and provide the
two data bucket names. If you do not specify a named bucket, it will apply to
the default bucket or return an error if a default bucket does not exist.

By default the scanner process will run once every 24 hours with a default
initial start time of 2:00 AM UTC. This means after you install a new Couchbase
Server 2.0 instance or restart the server, by default the scanner will run every
24- hour time period at 2:00 AM UTC by default. To change the time interval when
the access scanner process runs to every 20 minutes:


```
> ./cbepctl localhost:11210 -b beer-sample set flush_param alog_sleep_time 20
```

This updates the parameter for the named bucket, beer-sample on the given node
on `localhost`. To change the initial time that the access scanner process runs
from the default of 2:00 AM UTC:


```
> ./cbepctl hostname:11210 -b beer-sample -p beer-password set flush_param alog_task_time 13
```

In this example we set the initial time to 1:00 PM UTC.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster. For more information, see [cbepctl
Tool](#couchbase-admin-cmdline-cbepctl).

<a id="couchbase-admin-tasks-intercluster-replication"></a>

## Handling Replication within a Cluster

Within a Couchbase cluster, you have *replica data* which is a copy of an item
at another node. After you write an item to Couchbase Server, it makes a copy of
this data from the RAM of one node to another node. Distribution of replica data
is handled in the same way as active data; portions of replica data will be
distributed around the Couchbase cluster onto different nodes to prevent a
single point of failure. Each node in a cluster will have *replica data* and
*active data* ; replica data is the copy of data from another node while active
data is data that had been written by a client on that node.

Replication of data between nodes is entirely peer-to-peer based; information
will be replicated directly between nodes in the cluster. There is no topology,
hierarchy or master-slave relationship between nodes in a cluster. When a client
writes to a node in the cluster, Couchbase Server stores the data on that node
and then distributes the data to one or more nodes within a cluster. The
following shows two different nodes in a Couchbase cluster, and illustrates how
two nodes can store replica data for one another:


![](images/replica_backoff.png)

When a client application writes data to a node, that data will be placed in a
replication queue and then a copy will be sent to another node. The replicated
data will be available in RAM on the second node and will be placed in a disk
write queue to be stored on disk at the second node.

Notice that a second node will also simultaneously handle both replica data and
incoming writes from a client. The second node will put both replica data and
incoming writes into a disk write queue. If there are too many items in the disk
write queue, this second node can send a *backoff message* to the first node.
The first node will then reduce the rate at which it sends items to the second
node for replication. This can sometimes be necessary if the second node is
already handling a large volume of writes from a client application. For
information about changing this setting, see [Changing Disk Write Queue
Quotas](#couchbase-admin-cbepctl-disk-queue).

If multiple changes occur to the same document waiting to be replicated,
Couchbase Server is able to *de-duplicate, or 'de-dup'* the item; this means for
the sake of efficiency, it will only send the latest version of a document to
the second node.

If the first node fails in the system the replicated data is still available at
the second node. Couchbase can serve replica data from the second node nearly
instantaneously because the second node already has a copy of the data in RAM;
there is no need for the data to be copied over from the failed node or to be
fetched from disk. Once replica data is enabled at the second node, Couchbase
Server updates a map indicating where the data should be retrieved, and the
server shares this information with client applications. Client applications can
then get the replica data from the functioning node. For more information about
node failure and failover, see [Failing Over
Nodes](#couchbase-admin-tasks-failover).

<a id="couchbase-admin-creating-replicas-for-buckets"></a>

### Providing Data Replication

You can configure data replication for each bucket in cluster. You can also
configure different buckets to have different levels of data replication,
depending how many copies of your data you need. For the highest level of data
redundancy and availability, you can specify that a data bucket will be
replicated three times within the cluster.

Replication is enabled once the number of nodes in your cluster meets the number
of replicas you specify. For example, if you configure three replicas for a data
bucket, replication will only be enabled once you have four nodes in the
cluster.

After you specify the number of replicas you want for a bucket and then create
the bucket, you cannot change this value. Therefore be certain you specify the
number of replicas you truly want.

For more information about creating and editing buckets, or specifying replicas
for buckets, see [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit).

<a id="couchbase-admin-tasks-replica-backoff"></a>

### Specifying Backoff for Replication

Your cluster is set up to perform some level of data replication between nodes
within the cluster for any given node. Every node will have both *active data*
and *replica data*. Active data is all the data that had been written to the
node from a client, while replica data is a copy of data from another node in
the cluster. Data replication enables high availability of data in a cluster.
Should any node in cluster fail, the data will still be available at a replica.

On any give node, both active and replica data must wait in a disk write queue
before being written to disk. If you node experiences a heavy load of writes,
the replication queue can become overloaded with replica and active data waiting
to be persisted.

By default a node will send backoff messages when the disk write queue on the
node contains one million items or 10%. When other nodes receive this message,
they will reduce the rate at which they send replica data. You can configure
this default to be a given number so long as this value is less than 10% of the
total items currently in a replica partition. For instance if a node contains 20
million items, when the disk write queue reaches 2 million items a backoff
message will be sent to nodes sending replica data. You use the Couchbase
command-line tool, `cbepctl` to change this configuration:


```
> ./cbepctl 10.5.2.31:11210 -b bucketname -p bucketpassword set tap_param tap_throttle_queue_cap 2000000
```

In this example we specify that a node sends replication backoff requests when
it has two million items or 10% of all items, whichever is greater. You will see
a response similar to the following:


```
setting param: tap_throttle_queue_cap 2000000
```

In this next example, we change the default percentage used to manage the
replication stream. If the items in a disk write queue reach the greater of this
percentage or a specified number of items, replication requests will slow down:


```
> ./cbepctl  10.5.2.31:11210 set -b bucketname tap_param tap_throttle_cap_pcnt 15
```

In this example, we set the threshold to 15% of all items at a replica node.
When a disk write queue on a node reaches this point, it will send replication
backoff requests to other nodes.

**Be aware that this tool is a per-node, per-bucket operation.** That means that
if you want to perform this operation, you must specify the IP address of a node
in the cluster and a named bucket. If you do not provided a named bucket, the
server will apply the setting to any default bucket that exists at the specified
node. If you want to perform this operation for an entire cluster, you will need
to perform the command for every node/bucket combination that exists for that
cluster.

For more information about changing this setting, see [cbepctl
Tool](#couchbase-admin-cmdline-cbepctl). You can also monitor the progress of
this backoff operation in Couchbase Web Console under Tap Queue Statistics |
back-off rate. For more information, see [Monitoring TAP
Queues](#couchbase-admin-web-console-data-buckets-tapqueues).

<a id="couchbase-admin-tasks-working-set-mgmt"></a>

## Ejection and Working Set Management

Couchbase Server actively manages the data stored in a caching layer; this
includes the information which is frequently accessed by clients and which needs
to be available for rapid reads and writes. When there are too many items in
RAM, Couchbase Server will remove certain data to create free space and to
maintain system performance. This process is called *working set management* and
we refer to the set of data in RAM as a *working set*.

In general your working set consists of all the keys, metadata, and associated
documents which are frequently used in your system and therefore require fast
access. The process the server performs to remove data from RAM is known as
*ejection*, and when the server performs this process, it removes the document,
but not the keys or metadata for an item. Keeping keys and metadata in RAM
serves three important purposes in a system:

 * Couchbase Server uses the remaining key and metadata in RAM if a request for
   that key comes from a client; the server will then try to fetch the item from
   disk and return it into RAM.

 * The server can also use the keys and metadata in RAM for *miss access*. This
   means that you quickly determine if an item is missing and then perform some
   action, such as add it.

 * Finally the expiration process in Couchbase Server uses the metadata in RAM to
   quickly scan for items that are expired and later remove them from disk. This
   process is known as the *expiry pager* and runs every 60 minutes by default. For
   more information about the pager, and changing the setting for it, see [Changing
   the Disk Cleanup Interval](#couchbase-admin-cbepctl-disk-cleanup).

**Not-Frequently-Used Items**

All items in the server contain metadata indicating whether the item has been
recently accessed or not; this metadata is known as NRU, which is an
abbreviation for *not-recently-used*. If an item has not been recently used then
the item is a candidate for ejection if the high water mark has been exceeded.
When the high water mark has been exceeded, the server evicts items from RAM.

As of Couchbase Server 2.0.1+ we provide two NRU bits per item and also provide
a replication protocol that can propagate items that are frequently read, but
not mutated often. For earlier versions of Couchbase Server, we had provided
only a single bit for NRU and a different replication protocol which resulted in
two issues: metadata could not reflect how frequently or recently an item had
been changed, and the replication protocol only propagated NRUs for mutation
items from an active vBucket to a replica vBucket. This second behavior meant
that the working set on an active vBucket could be quite different than the set
on a replica vBucket. By changing the replication protocol in 2.0.1+ the working
set in replica vBuckets will be closer to the working set in the active vBucket.

NRUs will be decremented or incremented by server processes to indicate an item
is more frequently used, or less frequently used. Items with lower bit values
will have lower scores and will be considered more frequently used. The bit
values, corresponding scores and status are as follows:

<a id="table-couchbase-admin-NRU"></a>

**Binary NRU** | **Score** | **Working Set Replication Status (WSR)** | **Access Pattern**                                                  | **Description**           
---------------|-----------|------------------------------------------|---------------------------------------------------------------------|---------------------------
00             | 0         | TRUE                                     | Set by write access to 00. Decremented by read access or no access. | Most heavily used item.   
01             | 1         | Set to TRUE                              | Decremented by read access.                                         | Frequently access item.   
10             | 2         | Set to FALSE                             | Initial value or decremented by read access.                        | Default for new items.    
11             | 3         | Set to FALSE                             | Incremented by item pager for eviction.                             | Less frequently used item.

When WSR is set to TRUE it means that an item should be replicated to a replica
vBucket. There are two processes which change the NRU for an item: 1) if a
client reads or writes an item, the server decrements NRU and lowers the item's
score, 2) Couchbase Server also has a daily process which creates a list of
frequently-used items in RAM. After this process runs, the server increment one
of the NRU bits. Because two processes will change NRUs, they will also affect
which items are candidates for ejection. For more information about the access
scanner, see [Handling Server Warmup](#couchbase-admin-tasks-warmup-access).

You can adjust settings for Couchbase Server which change behavior during
ejection. You can indicate the percentage of RAM you are willing to consume
before items are ejected, or you can indicate whether ejection should occur more
frequently on replicated data than on original data. Be aware that for Couchbase
Server 2.0+, we recommend that you remain using the defaults provided.

**Understanding the Item Pager**

The process that periodically runs and removes documents from RAM is known as
the *item pager*. When a threshold known as *low water mark* is reached, this
process starts ejecting inactive replica data from RAM on the node. If the
amount of RAM used by items reaches an upper threshold, known as the *high water
mark*, both replica data and active data written from clients will be ejected.
The item pager will continue to eject items from RAM until the amount of RAM
consumed is below the *low water mark*. Both the high water mark and low water
mark are expressed as an absolute amount of RAM, such as 5577375744 bytes.

When you change either of these settings, you can provide a percentage of total
RAM for a node such as 80% or as an absolute number of bytes. For Couchbase
Server 2.0 and above, we recommend you remain using the default settings
provided. Defaults for these two settings are listed below.

<a id="table-couchbase-admin-watermark-defaults"></a>

**Version** | **High Water Mark** | **Low Water Mark**
------------|---------------------|-------------------
2.0         | 75%                 | 60%               
2.0.1+      | 85%                 | 75%               

The item pager ejects items from RAM in two phases:

 * **Phase 1: Eject based on NRU**. Scan NRU for items and create list of all items
   with score of 3. Eject all items with a NRU score of 3. Check RAM usage and
   repeat this process if usage is still above the low water mark.

 * **Phase 2: Eject based on Algorithm**. Increment all item NRUs by 1. If an NRU
   is equal to 3, generate a random number and eject that item if the random number
   is greater than a specified probability. The probability is based on current
   memory usage, low water mark, and whether a vBucket is in an active or replica
   state. If a vBucket is in active state the probability of ejection is lower than
   if the vBucket is in a replica state. The default probabilities for ejection
   from active of replica vBuckets is as follows:

<a id="table-couchbase-admin-ejection-defaults"></a>

**Version** | **Probability for Active vBucket** | **Probability for Replica vBucket**
------------|------------------------------------|------------------------------------
2.0+        | 60%                                | 40%                                

For instructions to change this setting, see [Changing Thresholds for
Ejection](#couchbase-admin-cbepctl-ejection).

<a id="couchbase-admin-tasks-compaction"></a>

## Database and View Compaction

The data files in which information is stored in a persistent state for a
Couchbase Bucket are written to and updated as information is appended, updated
and deleted. This process can eventually lead to gaps within the data file
(particularly when data is deleted) which can be reclaimed using a process
called compaction.

The index files that are created each time a view is built are also written in a
sequential format. Updated index information is appended to the file as updates
to the stored information is indexed.

In both these cases, frequent compaction of the files on disk can help to
reclaim disk space and reduce fragmentation.

<a id="couchbase-admin-tasks-compaction-process"></a>

### Compaction Process

**How it works**

Couchbase compacts views and data files. For database compaction, a new file is
created into which the active index information is written. Meanwhile, the
existing database files stay in place and continue to be used for storing
information and updating the index data. This process ensures that the database
continues to be available while compaction takes place. Once compaction is
completed, the old database is disabled and saved. Then any incoming updates
continue in the newly created database files. The old database is then deleted
from the system.

View compaction occurs in the same way. Couchbase creates a new index file for
each active design document. Then Couchbase takes this new index file and writes
active index information into it. Old index files are handled in the same way
old data files are handled during compaction. Once compaction is complete, the
old index files are deleted from the system.

**How to use it**

Compaction takes place as a background process while Couchbase Server is
running. You do not need to shutdown or pause your database operation, and
clients can continue to access and submit requests while the database is
running. While compaction takes place in the background, you need to pay
attention to certain factors.

Make sure you perform compaction…

 * **... on every server:** Compaction operates on only a single server within your
   Couchbase Server cluster. You will need to perform compaction on each node in
   your cluster, on each database in your cluster.

 * **... during off-peak hours:** The compaction process is both disk and CPU
   intensive. In heavy-write based databases where compaction is required, the
   compaction should be scheduled during off-peak hours (use auto-compact to
   schedule specific times).

   If compaction isn’t scheduled during off-peak hours, it can cause problems.
   Because the compaction process can take a long to complete on large and busy
   databases, it is possible for the compaction process to fail to complete
   properly while the database is still active. In extreme cases, this can lead to
   the compaction process never catching up with the database modifications, and
   eventually using up all the disk space. Schedule compaction during off-peak
   hours to prevent this!

 * **… with adequate disk space:** Because compaction occurs by creating new files
   and updating the information, you may need as much as twice the disk space of
   your current database and index files for compaction to take place.

   However, it is important to keep in mind that the exact amount of the disk space
   required depends on the level of fragmentation, the amount of dead data and the
   activity of the database, as changes during compaction will also need to be
   written to the updated data files.

   Before compaction takes place, the disk space is checked. If the amount of
   available disk space is less than twice the current database size, the
   compaction process does not take place and a warning is issued in the log. See
   [Log](#couchbase-admin-web-console-log).

**Compaction Behavior**

 * **Stop/Restart:** The compaction process can be stopped and restarted. However,
   you should be aware that the if the compaction process is stopped, further
   updates to database are completed, and then the compaction process is restarted,
   the updated database may not be a clean compacted version. This is because any
   changes to the portion of the database file that were processed before the
   compaction was canceled and restarted have already been processed.

 * **Auto-compaction:** Auto-compaction automatically triggers the compaction
   process on your database. You can schedule specific hours when compaction can
   take place.

 * **Compaction activity log:** Compaction activity is reported in the Couchbase
   Server log. You will see entries similar to following showing the compaction
   operation and duration:

    ```
    Service couchbase_compaction_daemon exited on node 'ns_1@127.0.0.1' in 0.00s
    (repeated 1 times)
    ```

   For information on accessing the log, see
   [Log](#couchbase-admin-web-console-log).

<a id="couchbase-admin-tasks-compaction-autocompaction"></a>

### Auto-Compaction Configuration

Couchbase Server incorporates an automated compaction mechanism that can compact
both data files and the view index files, based on triggers that measure the
current fragmentation level within the database and view index data files.

Spatial indexes are not automatically compacted. Spatial indexes must be
compacted manually. For more information, see **Couldn't resolve xref tag:
couchbase-admin-tasks-compaction-spatial**.

Auto-compaction can be configured in two ways:

 * *Default Auto-Compaction* affects all the Couchbase Buckets within your
   Couchbase Server. If you set the default Auto-Compaction settings for your
   Couchbase server then auto-compaction is enabled for all Couchbase Buckets
   automatically. For more information, see
   [Settings](#couchbase-admin-web-console-settings).

 * *Bucket Auto-Compaction* can be set on individual Couchbase Buckets. The
   bucket-level compaction always overrides any default auto-compaction settings,
   including if you have not configured any default auto-compaction settings. You
   can choose to explicitly override the Couchbase Bucket specific settings when
   editing or creating a new Couchbase Bucket. See [Creating and Editing Data
   Buckets](#couchbase-admin-web-console-data-buckets-createedit).

The available settings for both default Auto-Compaction and Couchbase Bucket
specific settings are identical:

 * **Database Fragmentation**

   The primary setting is the percentage level within the database at which
   compaction occurs. The figure is expressed as a percentage of fragmentation for
   each item, and you can set the fragmentation level at which the compaction
   process will be triggered.

   For example, if you set the fragmentation percentage at 10%, the moment the
   fragmentation level has been identified, the compaction process will be started,
   unless you have time limited auto-compaction. SeeTime Period.

 * **View Fragmentation**

   The View Fragmentation specifies the percentage of fragmentation within all the
   view index files at which compaction will be triggered, expressed as a
   percentage.

 * **Time Period**

   To prevent auto compaction taking place when your database is in heavy use, you
   can configure a time during which compaction is allowed. This is expressed as
   the hour and minute combination between which compaction occurs. For example,
   you could configure compaction to take place between 01:00 and 06:00.

   If compaction is identified as required outside of these hours, compaction will
   be delayed until the specified time period is reached.

   The time period is applied every day while the Couchbase Server is active. The
   time period cannot be configured on a day-by-day basis.

 * **Compaction abortion**

   The compaction process can be configured so that if the time period during which
   compaction is allowed ends while the compaction process is still completing, the
   entire compaction process will be terminated. This option affects the compaction
   process:

    * **Enabled**

      If this option is enabled, and compaction is running, the process will be
      stopped. The files generated during the compaction process will be kept, and
      compaction will be restarted when the next time period is reached.

      This can be a useful setting if want to ensure the performance of your Couchbase
      Server during a specified time period, as this will ensure that compaction is
      never running outside of the specified time period.

    * **Disabled**

      If compaction is running when the time period ends, compaction will continue
      until the process has been completed.

      Using this option can be useful if you want to ensure that the compaction
      process completes.

 * **Parallel Compaction**

   By default, compaction operates sequentially, executing first on the database
   and then the Views if both are configured for auto-compaction. If you enable
   parallel compaction, both the databases and the views can be compacted at the
   same time. This requires more CPU and database activity for both to be processed
   simultaneously, but if you have CPU cores and disk I/O (for example, if the
   database and view index information is stored on different physical disk
   devices), the two can complete in a shorter time.

 * **Metadata Purge Interval**

   You can remove tombstones for expired and deleted items as part of the
   auto-compaction process. Tombstones are records containing the key and metadata
   for deleted and expired items and are used for eventually consistency between
   clusters and for views.

Configuration of auto-compaction is through Couchbase Web Console. For more
information on the settings, see
[Settings](#couchbase-admin-web-console-settings). Information on per-bucket
settings is through the Couchbase Bucket create/edit screen. See [Creating and
Editing Data Buckets](#couchbase-admin-web-console-data-buckets-createedit). You can also view 
and change these settings using the REST API, see [Using REST, Setting Auto-Compaction](#couchbase-admin-rest-auto-compaction).

<a id="couchbase-admin-tasks-compaction-strategies"></a>

### Auto-compaction Strategies

The exact fragmentation and scheduling settings for auto-compaction should be
chosen carefully to ensure that your database performance and compaction
performance meet your requirements.

You want to consider the following:

 * You should monitor the compaction process to determine how long it takes to
   compact your database. This will help you identify and schedule a suitable
   time-period for auto-compaction to occur.

 * Compaction affects the disk space usage of your database, but should not affect
   performance. Frequent compaction runs on a small database file are unlikely to
   cause problems, but frequent compaction on a large database file may impact the
   performance and disk usage.

 * Compaction can be terminated at any time. This means that if you schedule
   compaction for a specific time period, but then require the additional resources
   being used for compaction you can terminate the compaction and restart during
   another off-peak period.

 * Because compaction can be stopped and restarted it is possible to indirectly
   trigger an incremental compaction. For example, if you configure a one-hour
   compaction period, enable Compaction abortion, and compaction takes 4 hours to
   complete, compaction will incrementally take place over four days.

 * When you have a large number of Couchbase buckets on which you want to use
   auto-compaction, you may want to schedule your auto-compaction time period for
   each bucket in a staggered fashion so that compaction on each bucket can take
   place within a it's own unique time period.




<a id="couchbase-admin-tasks-failover"></a>

## Failing Over Nodes

If a node in a cluster is unable to serve data you can *failover* that node.
Failover means that Couchbase Server removes the node from a cluster and makes
replicated data at other nodes available for client requests. Because Couchbase
Server provides data replication within a cluster, the cluster can handle
failure of one or more nodes without affecting your ability to access the stored
data. In the event of a node failure, you can manually initiate a `failover`
status for the node in Web Console and resolve the issues.

Alternately you can configure Couchbase Server so it will *automatically* remove
a failed node from a cluster and have the cluster operate in a degraded mode. If
you choose this automatic option, the workload for functioning nodes that remain
the cluster will increase. You will still need to address the node failure,
return a functioning node to the cluster and then rebalance the cluster in order
for the cluster to function as it did prior to node failure.

Whether you manually failover a node or have Couchbase Server perform automatic
failover, you should determine the underlying cause for the failure. You should
then set up functioning nodes, add the nodes, and then rebalance the cluster.
Keep in mind the following guidelines on replacing or adding nodes when you cope
with node failure and failover scenarios:

 * If the node failed due to a hardware or system failure, you should add a new
   replacement node to the cluster and rebalance.

 * If the node failed because of capacity problems in your cluster, you should
   replace the node but also add additional nodes to meet the capacity needs.

 * If the node failure was transient in nature and the failed node functions once
   again, you can add the node back to the cluster.

Be aware that failover is a distinct operation compared to
*removing/rebalancing* a node. Typically you remove a *functioning node* from a
cluster for maintenance, or other reasons; in contrast you perform a failover
for a node that does not function.

When you remove a functioning node from a cluster, you use Web Console to
indicate the node will be removed, then you rebalance the cluster so that data
requests for the node can be handled by other nodes. Since the node you want to
remove still functions, it is able to handle data requests until the rebalance
completes. At this point, other nodes in the cluster will handle data requests.
There is therefore no disruption in data service or no loss of data that can
occur when you remove a node then rebalance the cluster. If you need to remove a
functioning node for administration purposes, you should use the remove and
rebalance functionality not failover. See [Performing a Rebalance, Adding a Node
to a
Cluster](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-addremove-rebalance.html).

If you try to failover a functioning node it may result in data loss. This is
because failover will immediately remove the node from the cluster and any data
that has not yet been replicated to other nodes may be permanently lost if it
had not been persisted to disk.

For more information about performing failover see the following resources:

 * **Automated failover** will automatically mark a node as failed over if the node
   has been identified as unresponsive or unavailable. There are some deliberate
   limitations to the automated failover feature. For more information on choosing
   whether to use automated or manual failover see [Choosing a Failover
   Solution](#couchbase-admin-tasks-failover-choosing).

   For information on how to enable and monitor automatic failover, see [Using
   Automatic Failover](#couchbase-admin-tasks-failover-automatic).

 * **Initiating a failover** whether or not you use automatic or manual failover,
   you need to perform additional steps to bring a cluster into a fully functioning
   state. Information on handling a failover is in [Handling a Failover
   Situation](#couchbase-admin-tasks-failover-handling).

 * **Adding nodes after failover**. After you resolve the issue with the failed
   over node you can add the node back to your cluster. Information about this
   process is in [Adding Back a Failed Over
   Node](#couchbase-admin-tasks-failover-addback).

<a id="couchbase-admin-tasks-failover-choosing"></a>

### Choosing a Failover Solution

Because node failover has the potential to reduce the performance of your
cluster, you should consider how best to handle a failover situation. Using
automated failover means that a cluster can fail over a node without
user-intervention and without knowledge and identification of the issue that
caused the node failure. It still requires you to initiate a rebalance in order
to return the cluster to a healthy state.

If you choose manual failover to manage your cluster you need to monitor the
cluster and identify when an issue occurs. If an issues does occur you then
trigger a manual failover and rebalance operation. This approach requires more
monitoring and manual intervention, there is also still a possibility that your
cluster and data access may still degrade before you initiate failover and
rebalance.

In the following sections the two alternatives and their issues are described in
more detail.

<a id="couchbase-admin-tasks-failover-automatic-considerations"></a>

### Automated Failover Considerations

Automatically failing components in any distributed system can cause problems.
If you cannot identify the cause of failure, and you do not understand the load
that will be placed on the remaining system, then automated failover can cause
more problems than it is designed to solve. Some of the situations that might
lead to problems include:

 * **Avoiding Failover Chain-Reactions (Thundering Herd)**

   Imagine a scenario where a Couchbase Server cluster of five nodes is operating
   at 80-90% aggregate capacity in terms of network load. Everything is running
   well but at the limit of cluster capacity. Imagine a node fails and the software
   decides to automatically failover that node. It is unlikely that all of the
   remaining four nodes are be able to successfully handle the additional load.

   The result is that the increased load could lead to another node failing and
   being automatically failed over. These failures can cascade and lead to the
   eventual loss of an entire cluster. Clearly having 1/5th of the requests not
   being serviced due to single node failure would be more desirable than none of
   the requests being serviced due to an entire cluster failure.

   The solution in this case is to continue cluster operations with the single node
   failure, add a new server to the cluster to handle the missing capacity, mark
   the failed node for removal and then rebalance. This way there is a brief
   partial outage rather than an entire cluster being disabled.

   One alternate preventative solution is to ensure there is excess capacity to
   handle unexpected node failures and allow replicas to take over.

 * **Handling Failovers with Network Partitions**

   If you have a network partition across the nodes in a Couchbase cluster,
   automatic failover would lead to nodes on both sides of the partition to
   automatically failover. Each functioning section of the cluster would now have
   to assume responsibility for the entire document ID space. While there would be
   consistency for a document ID within each partial cluster, there would start to
   be inconsistency of data between the partial clusters. Reconciling those
   differences may be difficult, depending on the nature of your data and your
   access patterns.

   Assuming one of the two partial clusters is large enough to cope with all
   traffic, the solution is to direct all traffic for the cluster to that single
   partial cluster. The separated nodes could then be re-added to the cluster to
   bring the cluster to its original size.

 * **Handling Misbehaving Nodes**

   There are cases where one node loses connectivity to the cluster or functions as
   if it has lost connectivity to the cluster. If you enable it to automatically
   failover the rest of the cluster, that node is able to create a cluster-of-one.
   The result for your cluster is a similar partition situation we described
   previously.

   In this case you should make sure there is spare node capacity in your cluster
   and failover the node with network issues. If you determine there is not enough
   capacity, add a node to handle the capacity after your failover the node with
   issues.

<a id="couchbase-admin-tasks-failover-monitored"></a>

### Manual or Monitored Failover

Performing manual failover through monitoring can take two forms, either by
human monitoring or by using a system external to the Couchbase Server cluster.
An external monitoring system can monitor both the cluster and the node
environment and make a more information-driven decision. If you choose a manual
failover solution, there are also issues you should be aware of. Although
automated failover has potential issues, choosing to use manual or monitored
failover is not without potential problems.

 * **Human intervention**

   One option is to have a human operator respond to alerts and make a decision on
   what to do. Humans are uniquely capable of considering a wide range of data,
   observations and experiences to best resolve a situation. Many organizations
   disallow automated failover without human consideration of the implications. The
   drawback of using human intervention is that it will be slower to respond than
   using a computer-based monitoring system.

 * **External monitoring**

   [Another option is to have a system monitoring the cluster via theManagement
   REST API](#couchbase-admin-restapi). Such an external system is in a good
   position to failover nodes because it can take into account system components
   that are outside the scope of Couchbase Server.

   For example monitoring software can observe that a network switch is failing and
   that there is a dependency on that switch by the Couchbase cluster. The system
   can determine that failing Couchbase Server nodes will not help the situation
   and will therefore not failover the node.

   The monitoring system can also determine that components around Couchbase Server
   are functioning and that various nodes in the cluster are healthy. If the
   monitoring system determines the problem is only with a single node and
   remaining nodes in the cluster can support aggregate traffic, then the system
   may failover the node using the REST API or command-line tools.

<a id="couchbase-admin-tasks-failover-automatic"></a>

### Using Automatic Failover

There are a number of restrictions on automatic failover in Couchbase Server.
This is to help prevent some issues that can occur when you use automatic
failover. For more information about potential issues, see [Choosing a Failover
Solution](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-failover-choosing.html#couchbase-admin-tasks-failover-automatic-considerations).

 * **Disabled by Default** Automatic failover is disabled by default. This prevents
   Couchbase Server from using automatic failover without you explicitly enabling
   it.

 * **Minimum Nodes** Automatic failover is only available on clusters of at least
   three nodes.

   If two or more nodes go down at the same time within a specified delay period,
   the automatic failover system will not failover any nodes.

 * **Required Intervention** Automatic failover will only fail over one node before
   requiring human intervention. This is to prevent a chain reaction failure of all
   nodes in the cluster.

 * **Failover Delay** There is a minimum 30 second delay before a node will be
   failed over. This time can be raised, but the software is hard coded to perform
   multiple pings of a node that may be down. This is to prevent failover of a
   functioning but slow node or to prevent network connection issues from
   triggering failover. For more information about this setting, see [Enabling and
   Disabling
   Auto-Failover](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-autofailover.html).

You can use the REST API to configure an email notification that will be sent by
Couchbase Server if any node failures occur and node is automatically failed
over. For more information, see [Enabling and Disabling Email
Notifications](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-enbling-disabling-email.html).

To configure automatic failover through the Administration Web Console, see
[Enabling Auto-Failover
Settings](#couchbase-admin-web-console-settings-autofailover). For information
on using the REST API, see [Retrieving Auto-Failover
Settings](#couchbase-admin-restapi-get-autofailover-settings).

Once an automatic failover has occurred, the Couchbase Cluster is relying on
other nodes to serve replicated data. You should initiate a rebalance to return
your cluster to a fully functioning state. For more information, see [Handling a
Failover Situation](#couchbase-admin-tasks-failover-handling).

**Resetting the Automatic failover counter**

After a node has been automatically failed over, Couchbase Server increments an
internal counter that indicates if a node has been failed over. This counter
prevents the server from automatically failing over additional nodes until you
identify the issue that caused the failover and resolve it. If the internal
counter indicates a node has failed over, the server will no longer
automatically failover additional nodes in the cluster. You will need to
re-enable automatic failover in a cluster by resetting this counter.

You should only resetting the automatic failover after you resolve the node
issue, rebalance and restore the cluster to a fully functioning state.

You can reset the counter using the REST API:


```
> curl -i -u cluster-username:cluster-password \
    http://localhost:8091/settings/autoFailover/resetCount
```

For more information on using this REST API see [Resetting
Auto-Failover](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-reset-autofailover.html).

<a id="couchbase-admin-tasks-failover-manual"></a>

### Initiating a Node Failover

If you need to remove a node from the cluster due to hardware or system failure,
you need to indicate the failover status for that node. This causes Couchbase
Server to use replicated data from other functioning nodes in the cluster.

Before you indicate the failover for a node you should read [Failing Over
Nodes](#couchbase-admin-tasks-failover). Do not use failover to remove a
functioning node from the cluster for administration or upgrade. This is because
initiating a failover for a node will activate replicated data at other nodes
which will reduce the overall capacity of the cluster. Data from the failover
node that has not yet been replicated at other nodes or persisted on disk will
be lost. For information about removing and adding a node, see [Performing a
Rebalance, Adding a Node to a
Cluster](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-addremove-rebalance.html).

You can provide the failover status for a node with two different methods:

 * **Using the Web Console**

   Go to the `Management -> Server Nodes` section of the Web Console. Find the node
   that you want to failover, and click the `Fail Over` button. You can only
   failover nodes that the cluster has identified as being Down.

   Web Console will display a warning message.

   Click `Fail Over` to indicate the node is failed over. You can also choose to
   `Cancel`.

 * **Using the Command-line**

   You can failover one or more nodes using the `failover` command in
   `couchbase-cli`. To failover the node, you must specify the IP address and port,
   if not the standard port for the node you want to failover. For example:

    ```
    > ﻿couchbase-cli failover --cluster=localhost:8091\
        -u cluster-username -p cluster-password\
        --server-failover=192.168.0.72:8091
    ```

   If successful this indicates the node is failed over.

After you specify that a node is failed over you should handle the cause of
failure and get your cluster back to a fully functional state. For more
information, see [Handling a Failover
Situation](#couchbase-admin-tasks-failover-handling).

<a id="couchbase-admin-tasks-failover-handling"></a>

### Handling a Failover Situation

Any time that you automatically or manually failover a node, the cluster
capacity will be reduced. Once a node is failed over:

 * The number of available nodes for each data bucket in your cluster will be
   reduced by one.

 * Replicated data handled by the failover node will be enabled on other nodes in
   the cluster.

 * Remaining nodes will have to handle all incoming requests for data.

After a node has been failed over, you should perform a rebalance operation. The
rebalance operation will:

 * Redistribute stored data across the remaining nodes within the cluster.

 * Recreate replicated data for all buckets at remaining nodes.

 * Return your cluster to the configured operational state.

You may decide to add one or more new nodes to the cluster after a failover to
return the cluster to a fully functional state. Better yet you may choose to
replace the failed node and add additional nodes to provide more capacity than
before. For more information on adding new nodes, and performing the rebalance
operation, see [Performing a
Rebalance](#couchbase-admin-tasks-addremove-rebalance).

<a id="couchbase-admin-tasks-failover-addback"></a>

### Adding Back a Failed Over Node

You can add a failed over node back to the cluster if you identify and fix the
issue that caused node failure. After Couchbase Server marks a node as failed
over, the data on disk at the node will remain. A failed over node will not
longer be *synchronized* with the rest of the cluster; this means the node will
no longer handle data request or receive replicated data.

When you add a failed over node back into a cluster, the cluster will treat it
as if it is a new node. This means that you should rebalance after you add the
node to the cluster. This also means that any data stored on disk at that node
will be destroyed when you perform this rebalance.

**Copy or Delete Data Files before Rejoining Cluster**

Therefore, before you add a failed over node back to the cluster, it is best
practice to move or delete the persisted data files before you add the node back
into the cluster. If you want to keep the files you can copy or move the files
to another location such as another disk or EBS volume. When you add a node back
into the cluster and then rebalance, data files will be deleted, recreated and
repopulated.

For more information on adding a node to the cluster and rebalancing, see
[Performing a Rebalance](#couchbase-admin-tasks-addremove-rebalance).

<a id="couchbase-admin-tasks-remote-recovery"></a>

## Data Recovery from Remote Clusters

If more nodes fail in a cluster than the number of replicas, data partitions in
that cluster will no longer be available. For instance, if you have a four node
cluster with one replica per node and two nodes fail, some data partitions will
no longer be available. There are two solutions for this scenario:

 * Recover data from disk. If you plan on recovering from disk, you may not be able
   to do so if the disk completely fails.

 * Recover partitions from a remote cluster. You can use this second option when
   you have XDCR set up to replicate data to the second cluster. The requirement
   for using `cbrecovery` is that you need to set up a second cluster that will
   contain backup data.

For more information on XDCR as a backup, see [Basic
Topologies](#xdcr-topologies). The following shows a scenario where you will
lose replica vBuckets from a cluster due to multi-node failure:


![](images/cb_rec_multi_failure.png)

Before you perform a recovery, make sure that your main cluster has an adequate
amount of memory and disk space to support the workload as well as the data you
recover. This means that even though you can recover data to a cluster with
failed nodes, you should investigate what caused the node failures and also make
sure your cluster has adequate capacity before you recover data. If you do add
nodes be certain to rebalance only after you have For more information about
handling node failure in a cluster, see [Failing Over
Nodes](#couchbase-admin-tasks-failover).

When you use `cbrecovery` it compares the data partitions from a main cluster
with a backup cluster, then sends missing data partitions detected. If it fails,
once you successfully restart `cbrecovery`, it will do a delta between clusters
again and determine any missing partitions since the failure then resume
restoring these partitions.

**Failure Scenarios**

Imagine the following happens when you have a four node cluster with one
replica. Each node has 256 active and 256 replica vBuckets which total 1024
active and 1024 replica vBuckets:

 1. When one node fails, some active and some replica vBuckets are no longer
    available in the cluster.

 1. After you fail over this node, the corresponding replica vBuckets on other nodes
    will be put into an active state. At this point you have a full set of active
    vBuckets and a partial set of replica vBuckets in the cluster.

 1. A second node fails. More active vBuckets will not be accessible.

 1. You fail over the second node. At this point any missing active vBuckets that do
    not have corresponding replica vBuckets will be lost.

In this type of scenario you can use `cbrecovery` to get the missing vBuckets
from your backup cluster. If you have multi-node failure on both your main and
backup clusters you will experience data loss.

**Recovery Scenarios for cbrecovery**

The following describes some different cluster setups so that you can better
understand whether or not this approach will work in your failure scenario:

 * **Multiple Node Failure in Cluster**. If multiple nodes fail in a cluster then
   some vBuckets may be unavailable. In this case if you have already setup XDCR
   with another cluster, you can recover those unavailable vBuckets from the other
   cluster.

 * **Bucket with Inadequate Replicas**.

   **Single Bucket**. In this case where we have only one bucket with zero replicas
   on all the nodes in a cluster. In this case when a node goes down in the cluster
   some of the partitions for that node will be unavailable. If we have XDCR set up
   for this cluster we can recover the missing partitions with `cbrecovery`.

   **Multi-Bucket**. In this case, nodes in a cluster have multiple buckets and
   some buckets might have replicas and some do not. In the image below we have a
   cluster and all nodes have two buckets, Bucket1 and Bucket2. Bucket 1 has
   replicas but Bucket2 does not. In this case if one of the nodes goes down, since
   Bucket 1 has replicas, when we failover the node the replicas on other nodes
   will be activated. But for the bucket with no replicas some partitions will be
   unavailable and will require `cbrecovery` to recover data. In this same example
   if multiple nodes fail in the cluster, we need to perform vBucket recovery both
   buckets since both will have missing partitions.


   ![](images/cbrecovery_diff_replicas.png)

**Handling the Recovery**

Should you encounter node failure and have unavailable vBuckets, you should
follow this process:

 1. For each failed node, Click Fail Over under the Server Nodes tab in Web Console.
    For more information, see [Initiating a Node
    Failover](#couchbase-admin-tasks-failover-manual).

    After you click Fail Over, under Web Console | Log tab you will see whether data
    is unavailable and which vBuckets are unavailable. If you do not have enough
    replicas for the number of failed over nodes, some vBuckets will no longer be
    available:


    ![](images/post-failover-log-lost-data.png)

 1. Add new functioning nodes to replace the failed nodes.

    Do not rebalance after you add new nodes to the cluster. Typically you do this
    after adding nodes to a cluster, but in this scenario the rebalance will destroy
    information about the missing vBuckets and you cannot recover them.


    ![](images/cb_recovery1b.png)

    In this example we have two nodes that failed in a three-node cluster and we add
    a new node 10.3.3.61.

    If you are certain your cluster can easily handle the workload and recovered
    data, you may choose to skip this step. For more instructions on adding nodes,
    see [Adding a Node to a
    Cluster](#couchbase-admin-tasks-addremove-rebalance-add).

 1. Run `cbrecovery` to recover data from your backup cluster. In the Server Panel,
    a Stop Recovery button appears.


    ![](images/cb_recovery2.png)

    After the recovery completes, this button disappears.

 1. Rebalance your cluster. For more information, see [Performing a
    Rebalance](#couchbase-admin-tasks-addremove-rebalance).

    Once the recovery is done, you can rebalance your cluster, which will recreate
    replica vBuckets and evenly redistribute them across the cluster.


    ![](images/cbrecovery_3b.png)

**Recovery 'Dry-Run'**

Before you recover vBuckets, you may want to preview a list of buckets no longer
available in the cluster. Use this command and options:


```
shell> ./cbrecovery http://Administrator:password@10.3.3.72:8091 http://Administrator:password@10.3.3.61:8091 -n
```

Here we provide administrative credentials for the node in the cluster as well
as the option `-n`. This will return a list of vBuckets in the remote secondary
cluster which are no longer in the your first cluster. If there are any
unavailable buckets in the cluster with failed nodes, you see output as follows:


```
2013-04-29 18:16:54,384: MainThread Missing vbuckets to be recovered:[{"node": "ns_1@10.3.3.61",
"vbuckets": [513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526,, 528, 529,
530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545,, 547, 548,
549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567,
568, 569, 570, 571, 572,....
```

Where the `vbuckets` array contains all the vBuckets that are no longer
available in the cluster. These are the bucket you can recover from the remotes
cluster. To recover the vBuckets:


```
shell> ./cbrecovery http://Administrator:password@<From_IP>:8091 \
    http://Administrator:password@<To_IP>:8091 -B bucket_name
```

You can run the command on either the cluster with unavailable vBuckets or on
the remote cluster, as long as you provide the hostname, port, and credentials
for remote cluster and the cluster with missing vBuckets in that order. If you
do not provide the parameter `-B` the tool assumes you will recover unavailable
vBuckets for the default bucket.

**Monitoring the Recovery Process**

You can monitor the progress of recovery under the Data Buckets tab of Couchbase
Web Console:

 1. Click on the Data Buckets tab.

 1. Select the data bucket you are recovering in the Data Buckets drop-down.

 1. Click on the Summary drop-down to see more details about this data bucket. You
    see an increased number in the `items` level during recovery:


    ![](images/monitor_cb_recovery.png)

 1. You can also see the number of active vBuckets increase as they are recovered
    until you reach 1024 vBuckets. Click on the vBucket Resources drop-down:


    ![](images/cbrec_monitor_vbucks.png)

 1. As this tool runs from the command line you can stop it at any time as you would
    any other command-line tool.

    A `Stop Recovery` button appears in the Servers panels. If you click this
    button, you will stop the recovery process between clusters. Once the recovery
    process completes, this button will no longer appear and you will need to
    rebalance the cluster. If you are in Couchbase Web Console, you can also stop it
    in this panel:


    ![](images/stop_cbrecovery.png)

 1. After recovery completes, click on the Server Nodes tab then Rebalance to
    rebalance your cluster.

When `cbrecovery` finishes it will output a report in the console:


```
Recovery :                Total |    Per sec
 batch    :                 0000 |       14.5
 byte     :                 0000 |      156.0
 msg      :                 0000 |       15.6
4 vbuckets recovered with elapsed time 10.90 seconds
```

In this report `batch` is a group of internal operations performed by
`cbrecovery`, `byte` indicates the total number of bytes recovered and `msg` is
the number of documents recovered.

<a id="couchbase-backup-restore"></a>

## Backup and Restore

Backing up your data should be a regular process on your cluster to ensure that
you do not lose information in the event of a serious hardware or installation
failure.

There are a number of methods for performing a backup:

 * Using `cbbackup`

   The `cbbackup` command enables you to back up a single node, single buckets, or
   the entire cluster into a flexible backup structure that allows for restoring
   the data into the same, or different, clusters and buckets. All backups can be
   performed on a live cluster or node. Using `cbbackup` is the most flexible and
   recommended backup tool.

   For more information, see [Backing Up Using
   cbbackup](#couchbase-backup-restore-backup-cbbackup).

   [To restore, you need to use the
   `cbrestore`](#couchbase-backup-restore-cbrestore) command.

 * Using File Copies

   A running or offline cluster can be backed up by copying the files on each of
   the nodes. Using this method you can only restore to a cluster with an identical
   configuration.

   For more information, see [Backing Up Using File
   Copies](#couchbase-backup-restore-backup-filecopy).

   [To restore, you need to use thefile copy](#couchbase-backup-restore-filecopy)
   method.

Due to the active nature of Couchbase Server it is impossible to create a
complete in-time backup and snapshot of the entire cluster. Because data is
always being updated and modified, it would be impossible to take an accurate
snapshot.

For detailed information on the restore processes and options, see [Restoring
Using cbrestore](#couchbase-backup-restore-restore).

It is a best practice to backup and restore your entire cluster to minimize any
inconsistencies in data. Couchbase is always per-item consistent, but does not
guarantee total cluster consistency or in-order persistence.

<a id="couchbase-backup-restore-backup-cbbackup"></a>

### Backing Up Using cbbackup

The `cbbackup` tool is a flexible backup command that enables you to backup both
local data and remote nodes and clusters involving different combinations of
your data:

 * Single bucket on a single node

 * All the buckets on a single node

 * Single bucket from an entire cluster

 * All the buckets from an entire cluster

Backups can be performed either locally, by copying the files directly on a
single node, or remotely by connecting to the cluster and then streaming the
data from the cluster to your backup location. Backups can be performed either
on a live running node or cluster, or on an offline node.

The `cbbackup` command stores data in a format that allows for easy restoration.
When restoring, using `cbrestore`, you can restore back to a cluster of any
configuration. The source and destination clusters do not need to match if you
used `cbbackup` to store the information.

The `cbbackup` command will copy the data in each course from the source
definition to a destination backup directory. The backup file format is unique
to Couchbase and enables you to restore, all or part of the backed up data when
restoring the information to a cluster. Selection can be made on a key (by
regular expression) or all the data stored in a particular vBucket ID. You can
also select to copy the source data from a bucketname into a bucket of a
different name on the cluster on which you are restoring the data.

The `cbbackup` command takes the following arguments:


```
cbbackup [options] [source] [backup_dir]
```

The `cbbackup` tool is located within the standard Couchbase command-line
directory. See [Command-line Interface for
Administration](#couchbase-admin-cmdline).

Be aware that `cbbackup` does not support external IP addresses. This means that
if you install Couchbase Server with the default IP address, you cannot use an
external hostname to access it. To change the address format into a hostname
format for the server, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

Where the arguments are as described below:

 * `[options]`

   One or more options for the backup process. These are used to configure username
   and password information for connecting to the cluster, backup type selection,
   and bucket selection. For a full list of the supported arguments, see [cbbackup
   Tool](#couchbase-admin-cmdline-cbbackup).

   The primary options select what will be backed up by `cbbackup`, including:

    * `--single-node`

      Only back up the single node identified by the source specification.

    * `--bucket-source` or `-b`

      Backup only the specified bucket name.

 * `[source]`

   The source for the data, either a local data directory reference, or a remote
   node/cluster specification:

    * `Local Directory Reference`

      A local directory specification is defined as a URL using the `couchstore-files`
      protocol. For example:

       ```
       couchstore-files:///opt/couchbase/var/lib/couchbase/data/default
       ```

      Using this method you are specifically backing up the specified bucket data on a
      single node only. To backup an entire bucket data across a cluster, or all the
      data on a single node, you must use the cluster node specification. This method
      does not backup the design documents defined within the bucket.

    * `cluster node`

      A node or node within a cluster, specified as a URL to the node or cluster
      service. For example:

       ```
       http://HOST:8091
       ```

      Or for distinction you can use the `couchbase` protocol prefix:

       ```
       couchbase://HOST:8091
       ```

      The administrator and password can also be combined with both forms of the URL
      for authentication. If you have named data buckets other than the default bucket
      which you want to backup, you will need to specify an administrative name and
      password for the bucket:

       ```
       couchbase://Administrator:password@HOST:8091
       ```

      The combination of additional options specifies whether the supplied URL refers
      to the entire cluster, a single node, or a single bucket (node or cluster). The
      node and cluster can be remote (or local).

      This method also backs up the design documents used to define views and indexes.

 * `[backup_dir]`

   The directory where the backup data files will be stored on the node on which
   the `cbbackup` is executed. This must be an absolute, explicit, directory, as
   the files will be stored directly within the specified directory; no additional
   directory structure is created to differentiate between the different components
   of the data backup.

   The directory that you specify for the backup should either not exist, or exist
   and be empty with no other files. If the directory does not exist, it will be
   created, but only if the parent directory already exists.

   The backup directory is always created on the local node, even if you are
   backing up a remote node or cluster. The backup files are stored locally in the
   backup directory specified.

Backups can take place on a live, running, cluster or node for the IP

Using this basic structure, you can backup a number of different combinations of
data from your source cluster. Examples of the different combinations are
provided below:

 * **Backup all nodes and all buckets**

   To backup an entire cluster, consisting of all the buckets and all the node
   data:

    ```
    > cbbackup http://HOST:8091 /backups/backup-20120501 \
      -u Administrator -p password
      [####################] 100.0% (231726/231718 msgs)
    bucket: default, msgs transferred...
           :                total |       last |    per sec
     batch :                 5298 |       5298 |      617.1
     byte  :             10247683 |   10247683 |  1193705.5
     msg   :               231726 |     231726 |    26992.7
    done
      [####################] 100.0% (11458/11458 msgs)
    bucket: loggin, msgs transferred...
           :                total |       last |    per sec
     batch :                 5943 |       5943 |    15731.0
     byte  :             11474121 |   11474121 | 30371673.5
     msg   :84 |84 |   643701.2
    done
    ```

   When backing up multiple buckets, a progress report, and summary report for the
   information transferred will be listed for each bucket backed up. The `msgs`
   count shows the number of documents backed up. The `byte` shows the overall size
   of the data document data.

   The source specification in this case is the URL of one of the nodes in the
   cluster. The backup process will stream data directly from each node in order to
   create the backup content. The initial node is only used to obtain the cluster
   topology so that the data can be backed up.

   A backup created in this way enables you to choose during restoration how you
   want to restore the information. You can choose to restore the entire dataset,
   or a single bucket, or a filtered selection of that information onto a cluster
   of any size or configuration.

 * **Backup all nodes, single bucket**

   To backup all the data for a single bucket, containing all of the information
   from the entire cluster:

    ```
    > cbbackup http://HOST:8091 /backups/backup-20120501 \
      -u Administrator -p password \
      -b default
      [####################] 100.0% (231726/231718 msgs)
    bucket: default, msgs transferred...
           :                total |       last |    per sec
     batch :                 5294 |       5294 |      617.0
     byte  :             10247683 |   10247683 |  1194346.7
     msg   :               231726 |     231726 |    27007.2
    done
    ```

   The `-b` option specifies the name of the bucket that you want to backup. If the
   bucket is a named bucket you will need to provide administrative name and
   password for that bucket.

   To backup an entire cluster, you will need to run the same operation on each
   bucket within the cluster.

 * **Backup single node, all buckets**

   To backup all of the data stored on a single node across all of the different
   buckets:

    ```
    > cbbackup http://HOST:8091 /backups/backup-20120501 \
      -u Administrator -p password \
      --single-node
    ```

   Using this method, the source specification must specify the node that you want
   backup. To backup an entire cluster using this method, you should backup each
   node individually.

 * **Backup single node, single bucket**

   To backup the data from a single bucket on a single node:

    ```
    > cbbackup http://HOST:8091 /backups/backup-20120501 \
      -u Administrator -p password \
      --single-node \
      -b default
    ```

   Using this method, the source specification must be the node that you want to
   back up.

 * **Backup single node, single bucket; backup files stored on same node**

   To backup a single node and bucket, with the files stored on the same node as
   the source data, there are two methods available. One uses a node specification,
   the other uses a file store specification. Using the node specification:

    ```
    > ssh USER@HOST
    remote-> sudo su - couchbase
    remote-> cbbackup http://127.0.0.1:8091 /mnt/backup-20120501 \
      -u Administrator -p password \
      --single-node \
      -b default
    ```

   This method backups up the cluster data of a single bucket on the local node,
   storing the backup data in the local filesystem.

   Using a file store reference (in place of a node reference) is faster because
   the data files can be copied directly from the source directory to the backup
   directory:

    ```
    > ssh USER@HOST
    remote-> sudo su - couchbase
    remote-> cbbackup couchstore-files:///opt/couchbase/var/lib/couchbase/data/default /mnt/backup-20120501
    ```

   To backup the entire cluster using this method, you will need to backup each
   node, and each bucket, individually.

Choosing the right backup solution will depend on your requirements and your
expected method for restoring the data to the cluster.

<a id="couchbase-backup-restore-backup-cbbackup-filter"></a>

### Filtering Keys During Backup

The `cbbackup` command includes support for filtering the keys that are backed
up into the database files you create. This can be useful if you want to
specifically backup a portion of your dataset, or you want to move part of your
dataset to a different bucket.

The specification is in the form of a regular expression, and is performed on
the client-side within the `cbbackup` tool. For example, to backup information
from a bucket where the keys have a prefix of 'object':


```
> cbbackup http://HOST:8091 /backups/backup-20120501 \
  -u Administrator -p password \
  -b default \
  -k '^object.*'
```

The above will copy only the keys matching the specified prefix into the backup
file. When the data is restored, only those keys that were recorded in the
backup file will be restored.

The regular expression match is performed client side. This means that the
entire bucket contents must be accessed by the `cbbackup` command and then
discarded if the regular expression does not match.

Key-based regular expressions can also be used when restoring data. You can
backup an entire bucket and restore selected keys during the restore process
using `cbrestore`. For more information, see [Restoring using cbrestore
tool](#couchbase-backup-restore-cbrestore).

<a id="couchbase-backup-restore-backup-filecopy"></a>

### Backing Up Using File Copies

You can also backup by using either `cbbackup` and specifying the local
directory where the data is stored, or by copying the data files directly using
`cp`, `tar` or similar.

For example, using `cbbackup` :


```
> cbbackup \
    couchstore-files:///opt/couchbase/var/lib/couchbase/data/default \
    /mnt/backup-20120501
```

The same backup operation using `cp` :


```
> cp -R /opt/couchbase/var/lib/couchbase/data/default \
      /mnt/copy-20120501
```

The limitation of backing up information in this way is that the data can only
be restored to offline nodes in an identical cluster configuration, and where an
identical vbucket map is in operation (you should also copy the `config.dat`
configuration file from each node.

<a id="couchbase-backup-restore-restore"></a>

### Restoring Using cbrestore

When restoring a backup, you have to select the appropriate restore sequence
based on the type of restore you are performing. The methods available to you
when restoring a cluster are dependent on the method you used when backing up
the cluster. If `cbbackup` was used to backup the bucket data, you can restore
back to a cluster with the same or different configuration. This is because
`cbbackup` stores information about the stored bucket data in a format that
enables it to be restored back into a bucket on a new cluster. For all these
scenarios you can use `cbrestore`. See [Restoring using cbrestore
tool](#couchbase-backup-restore-cbrestore).

If the information was backed up using a direct file copy, then you must restore
the information back to an identical cluster. See [Restoring Using File
Copies](#couchbase-backup-restore-filecopy).

<a id="couchbase-backup-restore-filecopy"></a>

### Restoring Using File Copies

To restore the information to the same cluster, with the same configuration, you
must shutdown your entire cluster while you restore the data, and then restart
the cluster again. You are replacing the entire cluster data and configuration
with the backed up version of the data files, and then re-starting the cluster
with the saved version of the cluster files.

Make sure that any restoration of files also sets the proper ownership of those
files to the couchbase user

When restoring data back in to the same cluster, then the following must be true
before proceeding:

 * The backup and restore must take between cluster using the same version of
   Couchbase Server.

 * The cluster must contain the same number of nodes.

 * Each node must have the IP address or hostname it was configured with when the
   cluster was backed up.

 * You must restore all of the `config.dat` configuration files as well as all of
   the database files to their original locations.

The steps required to complete the restore process are:

 1. Stop the Couchbase Server service on all nodes. For more information, see
    [Server Startup and Shutdown](#couchbase-admin-basics-running).

 1. On each node, restore the database, `stats.json`, and configuration file (
    `config.dat` ) from your backup copies for each node.

 1. Restart the service on each node. For more information, see [Server Startup and
    Shutdown](#couchbase-admin-basics-running).

<a id="couchbase-backup-restore-cbrestore"></a>

### Restoring using cbrestore tool

The `cbrestore` command takes the information that has been backed up via the
`cbbackup` command and streams the stored data into a cluster. The configuration
of the cluster does not have to match the cluster configuration when the data
was backed up, allowing it to be used when transferring information to a new
cluster or updated or expanded version of the existing cluster in the event of
disaster recovery.

Because the data can be restored flexibly, it allows for a number of different
scenarios to be executed on the data that has been backed up:

 * You want to restore data into a cluster of a different size and configuration.

 * You want to transfer/restore data into a different bucket on the same or
   different cluster.

 * You want to restore a selected portion of the data into a new or different
   cluster, or the same cluster but a different bucket.

The basic format of the `cbrestore` command is as follows:


```
cbrestore [options] [source] [destination]
```

Where:

 * `[options]`

   Options specifying how the information should be restored into the cluster.
   Common options include:

    * `--bucket-source`

      Specify the name of the bucket data to be read from the backup data that will be
      restored.

    * `--bucket-destination`

      Specify the name of the bucket the data will be written to. If this option is
      not specified, the data will be written to a bucket with the same name as the
      source bucket.

   For information on all the options available when using `cbrestore`, see
   [cbrestore Tool](#couchbase-admin-cmdline-cbrestore)

 * `[source]`

   The backup directory specified to `cbbackup` where the backup data was stored.

 * `[destination]`

   The REST API URL of a node within the cluster where the information will be
   restored.

The `cbrestore` command restores only a single bucket of data at a time. If you
have created a backup of an entire cluster (i.e. all buckets), then you must
restore each bucket individually back to the cluster. All destination buckets
must already exist; `cbrestore` does not create or configure destination buckets
for you.

For example, to restore a single bucket of data to a cluster:


```
> cbrestore \
    /backups/backup-2012-05-10 \
    http://Administrator:password@HOST:8091 \
    --bucket-source=XXX
  [####################] 100.0% (231726/231726 msgs)
bucket: default, msgs transferred...
       :                total |       last |    per sec
 batch :                  232 |        232 |       33.1
 byte  :             10247683 |   10247683 |  1462020.7
 msg   :               231726 |     231726 |    33060.0
done
```

To restore the bucket data to a different bucket on the cluster:


```
> cbrestore \
    /backups/backup-2012-05-10 \
    http://Administrator:password@HOST:8091 \
    --bucket-source=XXX \
    --bucket-destination=YYY
  [####################] 100.0% (231726/231726 msgs)
bucket: default, msgs transferred...
       :                total |       last |    per sec
 batch :                  232 |        232 |       33.1
 byte  :             10247683 |   10247683 |  1462020.7
 msg   :               231726 |     231726 |    33060.0
done
```

The `msg` count in this case is the number of documents restored back to the
bucket in the cluster.

<a id="couchbase-backup-restore-cbrestore-filter"></a>

### Filtering Keys During Restore

The `cbrestore` command includes support for filtering the keys that are
restored to the database from the files that were created during backup. This is
in addition to the filtering support available during backup (see [Filtering
Keys During Backup](#couchbase-backup-restore-backup-cbbackup-filter) ).

The specification is in the form of a regular expression supplied as an option
to the `cbrestore` command. For example, to restore information to a bucket only
where the keys have a prefix of 'object':


```
> cbrestore /backups/backup-20120501 http://HOST:8091 \
  -u Administrator -p password \
  -b default \
  -k '^object.*'
2013-02-18 10:39:09,476: w0 skipping msg with key: sales_7597_3783_6
...
2013-02-18 10:39:09,476: w0 skipping msg with key: sales_5575_3699_6
2013-02-18 10:39:09,476: w0 skipping msg with key: sales_7597_3840_6
  [                    ] 0.0% (0/231726 msgs)
bucket: default, msgs transferred...
       :                total |       last |    per sec
 batch :                    1 |          1 |        0.1
 byte  :                    0 |          0 |        0.0
 msg   :                    0 |          0 |        0.0
done
```

The above will copy only the keys matching the specified prefix into the
`default` bucket. For each key skipped, an information message will be supplied.
The remaining output shows the records transferred and summary as normal.

<a id="couchbase-backup-restore-mac"></a>

### Backup and Restore Between Mac OS X and Other Platforms

Couchbase Server 2.0 on Mac OS X uses a different number of configured vBuckets
than the Linux and Windows installations. Because of this, backing up from Mac
OS X and restoring to Linux or Windows, or vice versa, requires using the
built-in Moxi server and the memcached protocol. Moxi will rehash the stored
items into the appropriate bucket.

 * **Backing Up Mac OS X and Restoring on Linux/Windows**

   To backup the data from Mac OS X, you can use the standard `cbbackup` tool and
   options:

    ```
    > cbbackup http://Administrator:password@mac:8091 /macbackup/today
    ```

   To restore the data to a Linux/Windows cluster, you must connect to the Moxi
   port (11211) on one of the nodes within your destination cluster and use the
   Memcached protocol to restore the data. Moxi will rehash the information and
   distribute the data to the appropriate node within the cluster. For example:

    ```
    > cbrestore /macbackup/today memcached://linux:11211 -b default -B default
    ```

   If you have backed up multiple buckets from your Mac, you must restore to each
   bucket individually.

 * **Backing Up Linux/Windows and Restoring on Mac OS X**

   To backup the data from Linux or Windows, you can use the standard `cbbackup`
   tool and options:

    ```
    > cbbackup http://Administrator:password@linux:8091 /linuxbackup/today
    ```

   To restore to the Mac OS X node or cluster, you must connect to the Moxi port
   (11211) and use the Memcached protocol to restore the data. Moxi will rehash the
   information and distribute the data to the appropriate node within the cluster.
   For example:

    ```
    > cbrestore /linuxbackup/today memcached://mac:11211 -b default -B default
    ```

 * **Transferring Data Directly**

   You can use `cbtransfer` to perform the data move directly between Mac OS X and
   Linux/Windows clusters without creating the backup file, providing you correctly
   specify the use of the Moxi and Memcached protocol in the destination:

    ```
    > cbtransfer http://linux:8091 memcached://mac:11211 -b default -B default
    > cbtransfer http://mac:8091 memcached://linux:11211 -b default -B default
    ```

   These transfers will not transfer design documents, since they are using the
   Memcached protocol

 * **Transferring Design Documents**

   Because you are restoring data using the Memcached protocol, design documents
   are not restored. A possible workaround is to modify your backup directory.
   Using this method, you first delete the document data from the backup directory,
   and then use the standard restore process. This will restore only the design
   documents. For example:

    ```
    > cbbackup http://Administrator:password@linux:8091 /linuxbackup/today
    ```

   Remove or move the data files from the backup out of the way:

    ```
    > mv /linuxbackup/today/bucket-default/* /tmp
    ```

   Only the design document data will remain in the backup directory, you can now
   restore that information using `cbrestore` as normal:

    ```
    > cbrestore /linuxbackup/today http://mac:8091 -b default -B default
    ```

<a id="couchbase-admin-tasks-addremove"></a>

## Rebalancing

As you store data into your Couchbase Server cluster, you may need to alter the
number of nodes in your cluster to cope with changes in your application load,
RAM, disk I/O and networking performance requirements.

Couchbase Server is designed to actively change the number of nodes configured
within the cluster to cope with these requirements, all while the cluster is up
and running and servicing application requests. The overall process is broken
down into two stages; the addition and/or removal of nodes in the cluster, and
the `rebalancing` of the information across the nodes.

The addition and removal process merely configures a new node into the cluster,
or marks a node for removal from the cluster. No actual changes are made to the
cluster or data when configuring new nodes or removing existing ones.

During the rebalance operation:

 * Using the new Couchbase Server cluster structure, data is moved between the
   vBuckets on each node from the old structure. This process works by exchanging
   the data held in vBuckets on each node across the cluster. This has two effects:

    * Removes the data from machines being removed from the cluster. By totally
      removing the storage of data on these machines, it allows for each removed node
      to be taken out of the cluster without affecting the cluster operation.

    * Adds data and enables new nodes so that they can serve information to clients.
      By moving active data to the new nodes, they will be made responsible for the
      moved vBuckets and for servicing client requests.

 * Rebalancing moves both the data stored in RAM, and the data stored on disk for
   each bucket, and for each node, within the cluster. The time taken for the move
   is dependent on the level of activity on the cluster and the amount of stored
   information.

 * The cluster remains up, and continues to service and handle client requests.
   Updates and changes to the stored data during the migration process are tracked
   and will be updated and migrated with the data that existed when the rebalance
   was requested.

 * The current vBucket map, used to identify which nodes in the cluster are
   responsible for handling client requests, is updated incrementally as each
   vBucket is moved. The updated vBucket map is communicated to Couchbase client
   libraries and enabled smart clients (such as Moxi), and allows clients to use
   the updated structure as the rebalance completes. This ensures that the new
   structure is used as soon as possible to help spread and even out the load
   during the rebalance operation.

Because the cluster stays up and active throughout the entire process, clients
can continue to store and retrieve information and do not need to be aware that
a rebalance operation is taking place.

There are four primary reasons that you perform a rebalance operation:

 * Adding nodes to expand the size of the cluster.

 * Removing nodes to reduce the size of the cluster.

 * Reacting to a failover situation, where you need to bring the cluster back to a
   healthy state.

 * You need to temporarily remove one or more nodes to perform a software,
   operating system or hardware upgrade.

Regardless of the reason for the rebalance, the purpose of the rebalance is
migrate the cluster to a healthy state, where the configured nodes, buckets, and
replicas match the current state of the cluster.

For information and guidance on choosing how, and when, to rebalance your
cluster, read [Choosing When to
Rebalance](#couchbase-admin-tasks-addremove-deciding). This will provide
background information on the typical triggers and indicators that your cluster
requires changes to the node configuration, and when a good time to perform the
rebalance is required.

Instructions on how to expand and shrink your cluster, and initiate the
rebalance operation are provided in [Performing a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

Once the rebalance operation has been initiated, you should monitor the
rebalance operation and progress. You can find information on the statistics and
events to monitor using [Monitoring a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).

Common questions about the rebalancing operation are located in [Common
Rebalancing Questions](#couchbase-admin-tasks-addremove-questions).

For a deeper background on the rebalancing and how it works, see [Rebalance
Behind-the-Scenes](#couchbase-admin-tasks-addremove-rebalance-background).

<a id="couchbase-admin-tasks-addremove-deciding"></a>

### Choosing When to Rebalance

Choosing when each of situations applies is not always straightforward. Detailed
below is the information you need to choose when, and why, to rebalance your
cluster under different scenarios.

**Choosing when to expand the size of your cluster**

You can increase the size of your cluster by adding more nodes. Adding more
nodes increases the available RAM, disk I/O and network bandwidth available to
your client applications and helps to spread the load around more machines.
There are a few different metrics and statistics that you can use on which to
base your decision:

 * **Increasing RAM Capacity**

   One of the most important components in a Couchbase Server cluster is the amount
   of RAM available. RAM not only stores application data and supports the
   Couchbase Server caching layer, it is also actively used for other operations by
   the server, and a reduction in the overall available RAM may cause performance
   problems elsewhere.

   There are two common indicators for increasing your RAM capacity within your
   cluster:

    * If you see more disk fetches occurring, that means that your application is
      requesting more and more data from disk that is not available in RAM. Increasing
      the RAM in a cluster will allow it to store more data and therefore provide
      better performance to your application.

    * If you want to add more buckets to your Couchbase Server cluster you may need
      more RAM to do so. Adding nodes will increase the overall capacity of the system
      and then you can shrink any existing buckets in order to make room for new ones.

 * **Increasing disk I/O Throughput**

   By adding nodes to a Couchbase Server cluster, you will increase the aggregate
   amount of disk I/O that can be performed across the cluster. This is especially
   important in high-write environments, but can also be a factor when you need to
   read large amounts of data from the disk.

 * **Increasing Disk Capacity**

   You can either add more disk space to your current nodes or add more nodes to
   add aggregate disk space to the cluster.

 * **Increasing Network Bandwidth**

   If you see that you are or are close to saturating the network bandwidth of your
   cluster, this is a very strong indicator of the need for more nodes. More nodes
   will cause the overall network bandwidth required to be spread out across
   additional nodes, which will reduce the individual bandwidth of each node.

\> **Choosing when to shrink your cluster**

Choosing to shrink a Couchbase cluster is a more subjective decision. It is
usually based upon cost considerations, or a change in application requirements
not requiring as large a cluster to support the required load.

When choosing whether to shrink a cluster:

 * You should ensure you have enough capacity in the remaining nodes to support
   your dataset and application load. Removing nodes may have a significant
   detrimental effect on your cluster if there are not enough nodes.

 * You should avoid removing multiple nodes at once if you are trying to determine
   the ideal cluster size. Instead, remove each node one at a time to understand
   the impact on the cluster as a whole.

 * You should remove and rebalance a node, rather than using failover. When a node
   fails and is not coming back to the cluster, the failover functionality will
   promote its replica vBuckets to become active immediately. If a healthy node is
   failed over, there might be some data loss for the replication data that was in
   flight during that operation. Using the remove functionality will ensure that
   all data is properly replicated and continuously available.

**Choosing when to Rebalance**

Once you decide to add or remove nodes to your Couchbase Server cluster, there
are a few things to take into consideration:

 * If you're planning on adding and/or removing multiple nodes in a short period of
   time, it is best to add them all at once and then kick-off the rebalancing
   operation rather than rebalance after each addition. This will reduce the
   overall load placed on the system as well as the amount of data that needs to be
   moved.

 * Choose a quiet time for adding nodes. While the rebalancing operation is meant
   to be performed online, it is not a "free" operation and will undoubtedly put
   increased load on the system as a whole in the form of disk IO, network
   bandwidth, CPU resources and RAM usage.

 * Voluntary rebalancing (i.e. not part of a failover situation) should be
   performed during a period of low usage of the system. Rebalancing is a
   comparatively resource intensive operation as the data is redistributed around
   the cluster and you should avoid performing a rebalance during heavy usage
   periods to avoid having a detrimental affect on overall cluster performance.

 * Rebalancing requires moving large amounts of data around the cluster. The more
   RAM that is available will allow the operating system to cache more disk access
   which will allow it to perform the rebalancing operation much faster. If there
   is not enough memory in your cluster the rebalancing may be very slow. It is
   recommended that you don't wait for your cluster to reach full capacity before
   adding new nodes and rebalancing.

<a id="couchbase-admin-tasks-addremove-rebalance"></a>

### Performing a Rebalance

Rebalancing a cluster involves marking nodes to be added or removed from the
cluster, and then starting the rebalance operation so that the data is moved
around the cluster to reflect the new structure.

Until you complete a rebalance, you should avoid using the failover
functionality since that may result in loss of data that has not yet been
replicated.

 * For information on adding nodes to your cluster, see [Adding a Node to a
   Cluster](#couchbase-admin-tasks-addremove-rebalance-add).

 * For information on removing nodes to your cluster, see [Removing a Node from a
   Cluster](#couchbase-admin-tasks-addremove-rebalance-remove).

 * In the event of a failover situation, a rebalance is required to bring the
   cluster back to a healthy state and re-enable the configured replicas. For more
   information on how to handle a failover situation, see [Failing Over
   Nodes](#couchbase-admin-tasks-failover)

The Couchbase Admin Web Console will indicate when the cluster requires a
rebalance because the structure of the cluster has been changed, either through
adding a node, removing a node, or due to a failover. The notification is
through the count of the number of servers that require a rebalance. You can see
a sample of this in the figure below, here shown on the `Manage Server Nodes`
page.


![](images/admin-tasks-pending-rebalance.png)

To rebalance the cluster, you must initiate the rebalance process, detailed in
[Performing a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

<a id="couchbase-admin-tasks-addremove-rebalance-add"></a>

### Adding a Node to a Cluster

There are a number of methods available for adding a node to a cluster. The
result is the same in each case, the node is marked to be added to the cluster,
but the node is not an active member until you have performed a rebalance
operation. The methods are:

 * **Web Console — During Installation**

   When you are performing the Setup of a new Couchbase Server installation (see
   [Initial Server Setup](#couchbase-getting-started-setup) ), you have the option
   of joining the new node to an existing cluster.

   During the first step, you can select the `Join a cluster now` radio button, as
   shown in the figure below:


   ![](images/admin-tasks-rebalance-add-setup.png)

   You are prompted for three pieces of information:

    * `IP Address`

      The IP address of any existing node within the cluster you want to join.

    * `Username`

      The username of the administrator of the target cluster.

    * `Password`

      The password of the administrator of the target cluster.

   The node will be created as a new cluster, but the pending status of the node
   within the new cluster will be indicated on the Cluster Overview page, as seen
   in the example below:


   ![](images/admin-tasks-rebalance-node-added.png)

 * **Web Console — After Installation**

   You can add a new node to an existing cluster after installation by clicking the
   `Add Server` button within the `Manage Server Nodes` area of the Admin Console.
   You can see the button in the figure below.


   ![](images/admin-tasks-rebalance-add-button.png)

   You will be presented with a dialog box, as shown below. Couchbase Server should
   be installed, and should have been configured as per the normal setup
   procedures. You can also add a server that has previously been part of this or
   another cluster using this method. The Couchbase Server must be running.


   ![](images/admin-tasks-rebalance-add-console.png)

   You need to fill in the requested information:

    * `Server IP Address`

      The IP address of the server that you want to add.

    * `Username`

      The username of the administrator of the target node.

    * `Password`

      The password of the administrator of the target node.

   You will be provided with a warning notifying you that the operation is
   destructive on the destination server. Any data currently stored on the server
   will be deleted, and if the server is currently part of another cluster, it will
   be removed and marked as failed over in that cluster.

   Once the information has been entered successfully, the node will be marked as
   ready to be added to the cluster, and the servers pending rebalance count will
   be updated.

 * **Using the REST API**

   Using the REST API, you can add nodes to the cluster by providing the IP
   address, administrator username and password as part of the data payload. For
   example, using `curl` you could add a new node:

    ```
    > curl -u cluster-username:cluster-password\
        localhost:8091/controller/addNode \
        -d "hostname=192.168.0.68&user=node-username&password=node-password"
    ```

   For more information, see [Adding a Node to a
   Cluster](#restapi-create-new-node).

 * **Using the Command-line**

   You can use the `couchbase-cli` command-line tool to add one or more nodes to an
   existing cluster. The new nodes must have Couchbase Server installed, and
   Couchbase Server must be running on each node.

   To add, run the command:

    ```
    > couchbase-cli server-add \
          --cluster=localhost:8091 \
          -u cluster-username -p cluster-password \
          --server-add=192.168.0.72:8091 \
          --server-add-username=node-username \
          --server-add-password=node-password
    ```

   Where:

   <a id="couchbase-admin-tasks-addremove-rebalance-add-cmdline"></a>

   Parameter               | Description
   ------------------------|-------------------------------------------------------
   `--cluster`             | The IP address of a node in the existing cluster.
   `-u`                    | The username for the existing cluster.
   `-p`                    | The password for the existing cluster.
   `--server-add`          | The IP address of the node to be added to the cluster.
   `--server-add-username` | The username of the node to be added.
   `--server-add-password` | The password of the node to be added.

   If the add process is successful, you will see the following response:

    ```
    SUCCESS: server-add 192.168.0.72:8091
    ```

   If you receive a failure message, you will be notified of the type of failure.

   You can add multiple nodes in one command by supplying multiple `--server-add`
   command-line options to the command.

Once a server has been successfully added, the Couchbase Server cluster will
indicate that a rebalance is required to complete the operation.

You can cancel the addition of a node to a cluster without having to perform a
rebalance operation. Canceling the operation will remove the server from the
cluster without having transferred or exchanged any data, since no rebalance
operation took place. You can cancel the operation through the web interface.

<a id="couchbase-admin-tasks-addremove-rebalance-remove"></a>

### Removing a Node from a Cluster

Removing a node marks the node for removal from the cluster, and will completely
disable the node from serving any requests across the cluster. Once removed, a
node is no longer part of the cluster in any way and can be switched off, or can
be updated or upgraded.

### Ensure Capacity for Node Removal

Before you remove a node from the cluster, you should ensure that you have the
capacity within the remaining nodes of your cluster to handle your workload. For
more information on the considerations, seeChoosing when to shrink your cluster.
For the best results, use swap rebalance to swap the node you want to remove
out, and swap in a replacement node. For more information on swap rebalance, see
[Swap Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

Like adding nodes, there are a number of solutions for removing a node:

 * **Web Console**

   You can remove a node from the cluster from within the `Manage Server Nodes`
   section of the Web Console, as shown in the figure below.

   To remove a node, click the `Remove Server` button next to the node you want to
   remove. You will be provided with a warning to confirm that you want to remove
   the node. Click `Remove` to mark the node for removal.

 * **Using the Command-line**

   You cannot mark a node for removal from the command-line without also initiating
   a rebalance operation. The `rebalance` command accepts one or more
   `--server-add` and/or `--server-remove` options. This adds or removes the server
   from the cluster, and immediately initiates a rebalance operation.

   For example, to remove a node during a rebalance operation:

    ```
    > couchbase-cli rebalance --cluster=127.0.0.1:8091 \
              -u Administrator -p Password \
              --server-remove=192.168.0.73
    ```

   For more information on the rebalance operation, see [Performing a
   Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

Removing a node does not stop the node from servicing requests. Instead, it only
marks the node ready for removal from the cluster. You must perform a rebalance
operation to complete the removal process.

<a id="couchbase-admin-tasks-addremove-rebalance-rebalancing"></a>

### Performing a Rebalance

Once you have configured the nodes that you want to add or remove from your
cluster, you must perform a rebalance operation. This moves the data around the
cluster so that the data is distributed across the entire cluster, removing and
adding data to different nodes in the process.

If Couchbase Server identifies that a rebalance is required, either through
explicit addition or removal, or through a failover, then the cluster is in a
`pending rebalance` state. This does not affect the cluster operation, it merely
indicates that a rebalance operation is required to move the cluster into its
configured state. To start a rebalance:

 * **Using the Web Console**

   Within the `Manage Server Nodes` area of the Couchbase Administration Web
   Console, a cluster pending a rebalance operation will have enabled the
   `Rebalance` button.


   ![](images/admin-tasks-rebalance-starting-console.png)

   Clicking this button will immediately initiate a rebalance operation. You can
   monitor the progress of the rebalance operation through the web console.

   You can stop a rebalance operation at any time during the process by clicking
   the `Stop Rebalance` button. This only stops the rebalance operation, it does
   not cancel the operation. You should complete the rebalance operation.

 * **Using the Command-line**

   You can initiate a rebalance using the `couchbase-cli` and the `rebalance`
   command:

    ```
    > couchbase-cli rebalance -c 127.0.0.1:8091 -u Administrator -p Password
      INFO: rebalancing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . .
      SUCCESS: rebalanced cluster
    ```

   You can also use this method to add and remove nodes and initiate the rebalance
   operation using a single command. You can specify nodes to be added using the
   `--server-add` option, and nodes to be removed using the `--server-remove`. You
   can use multiple options of each type. For example, to add two nodes, and remove
   two nodes, and immediately initiate a rebalance operation:

    ```
    > couchbase-cli rebalance -c 127.0.0.1:8091 \
              -u Administrator -p Password \
              --server-add=192.168.0.72 \
              --server-add=192.168.0.73 \
              --server-remove=192.168.0.70 \
              --server-remove=192.168.0.69
    ```

   The command-line provides an active view of the progress and will only return
   once the rebalance operation has either completed successfully, or in the event
   of a failure.

   You can stop the rebalance operation by using the `stop-rebalance` command to
   `couchbase-cli`.

The time taken for a rebalance operation depends on the number of servers,
quantity of data, cluster performance and any existing cluster activity, and is
therefore difficult to accurately predict or estimate.

Throughout any rebalance operation you should monitor the process to ensure that
it completes successfully, see [Monitoring a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).

<a id="couchbase-admin-tasks-addremove-rebalance-swap"></a>

### Swap Rebalance

Swap Rebalance is an automatic feature that optimizes the movement of data when
you are adding and removing the same number of nodes within the same operation.
The swap rebalance optimizes the rebalance operation by moving data directly
from the nodes being removed to the nodes being added. This is more efficient
than standard rebalancing which would normally move data across the entire
cluster.

Swap rebalance only occurs if the following are true:

 * You are removing and adding the same number of nodes during rebalance. For
   example, if you have marked two nodes to be removed, and added another two nodes
   to the cluster.

Swap rebalance occurs automatically if the number of nodes being added and
removed are identical. There is no configuration or selection mechanism to force
a swap rebalance. If a swap rebalance cannot take place, then a normal rebalance
operation will be used instead.

When Couchbase Server identifies that a rebalance is taking place and that there
are an even number of nodes being removed and added to the cluster, the swap
rebalance method is used to perform the rebalance operation.

When a swap rebalance takes place, the rebalance operates as follows:

 * Data will be moved directly from a node being removed to a node being added on a
   one-to-one basis. This eliminates the need to restructure the entire vBucket
   map.

 * Active vBuckets are moved, one at a time, from a source node to a destination
   node.

 * Replica vBuckets are created on the new node and populated with existing data
   before being activated as the live replica bucket. This ensures that if there is
   a failure during the rebalance operation, that your replicas are still in place.

For example, if you have a cluster with 20 nodes in it, and configure two nodes
(X and Y) to be added, and two nodes to be removed (A and B):

 * vBuckets from node A will be moved to node X.

 * vBuckets from node B will be moved to node Y.

The benefits of swap rebalance are:

 * Reduced rebalance duration. Since the move takes place directly from the nodes
   being removed to the nodes being added.

 * Reduced load on the cluster during rebalance.

 * Reduced network overhead during the rebalance.

 * Reduced chance of a rebalance failure if a failover occurs during the rebalance
   operation, since replicas are created in tandem on the new hosts while the old
   host replicas still remain available.

 * Because data on the nodes are swapped, rather than performing a full rebalance,
   the capacity of the cluster remains unchanged during the rebalance operation,
   helping to ensure performance and failover support.

The behaviour of the cluster during a failover and rebalance operation with the
swap rebalance functionality affects the following situations:

 * **Stopping a rebalance**

   If rebalance fails, or has been deliberately stopped, the active and replica
   vBuckets that have been transitioned will be part of the active vBucket map. Any
   transfers still in progress will be canceled. Restarting the rebalance operation
   will continue the rebalance from where it left off.

 * **Adding back a failed node**

   When a node has failed, removing it and adding a replacement node, or adding the
   node back, will be treated as swap rebalance.

   ### Failed Over Nodes

   With swap rebalance functionality, after a node has failed over, you should
   either clean up and re-add the failed over node, or add a new node and perform a
   rebalance as normal. The rebalance will be handled as a swap rebalance which
   will minimize the data movements without affecting the overall capacity of the
   cluster.

<a id="couchbase-admin-tasks-addremove-rebalance-monitoring"></a>

### Monitoring a Rebalance

You should monitor the system during and immediately after a rebalance operation
until you are confident that replication has completed successfully.

As of Couchbase Server 2.1+ we provide a detailed rebalance report in Web
Console. As the server moves vBuckets within the cluster, Web Console provides a
detailed report. You can view the same statistics in this report via a REST API
call, see [Getting Rebalance
Progress](#couchbase-admin-restapi-rebalance-progress). If you click on the
drop-down next to each node, you can view the detailed rebalance status:


![](images/rebalance_detail_report.png)

The section `Data being transferred out` means that a node sends data to other
nodes during rebalance. The section `Data being transferred in` means that a
node receives data from other nodes during rebalance. A node can be either a
source, a destination, or both a source and destination for data. The progress
report displays the following information:

 * **Bucket** : Name of bucket undergoing rebalance. Number of buckets transferred
   during rebalance out of total buckets in cluster.

 * **Total number of keys** : Total number of keys to be transferred during the
   rebalance.

 * **Estimated number of keys** : Number of keys transferred during rebalance.

 * **Number of Active\# vBuckets and Replica\# vBuckets** : Number of active
   vBuckets and replica vBuckets to be transferred as part of rebalance.

You can also use `cbstats` to see underlying rebalance statistics:

 * **Backfilling**

   The first stage of replication reads all data for a given active vBucket and
   sends it to the server that is responsible for the replica. This can put
   increased load on the disk as well as network bandwidth but it is not designed
   to impact any client activity. You can monitor the progress of this task by
   watching for ongoing TAP disk fetches. You can also watch `cbstats tap`, for
   example:

    ```
    cbstats <node_IP>:11210 -b bucket_name -p bucket_password tap | grep backfill
    ```

   This will return a list of TAP backfill processes and whether they are still
   running (true) or done (false). During the backfill process for a particular tap
   stream you will see output as follows:

    ```
    eq_tapq:replication_building_485_'n_1@127.0.0.1':backfill_completed: false
     eq_tapq:replication_building_485_'n_1@127.0.0.1':backfill_start_timestamp: 1371675343
     eq_tapq:replication_building_485_'n_1@127.0.0.1':flags: 85 (ack,backfill,vblist,checkpoints)
     eq_tapq:replication_building_485_'n_1@127.0.0.1':pending_backfill: true
     eq_tapq:replication_building_485_'n_1@127.0.0.1':pending_disk_backfill: true
     eq_tapq:replication_building_485_'n_1@127.0.0.1':queue_backfillremaining: 202
    ```

   When all have completed, you should see the Total Item count ( `curr_items_tot`
   ) be equal to the number of active items multiplied by replica count. The output
   you see for a TAP stream after backfill completes is as follows:

    ```
    eq_tapq:replication_building_485_'n_1@127.0.0.1':backfill_completed: true
     eq_tapq:replication_building_485_'n_1@127.0.0.1':backfill_start_timestamp: 1371675343
     eq_tapq:replication_building_485_'n_1@127.0.0.1':flags: 85 (ack,backfill,vblist,checkpoints)
     eq_tapq:replication_building_485_'n_1@127.0.0.1':pending_backfill: false
     eq_tapq:replication_building_485_'n_1@127.0.0.1':pending_disk_backfill: false
     eq_tapq:replication_building_485_'n_1@127.0.0.1':queue_backfillremaining: 0
    ```

   If you are continuously adding data to the system, these values may not
   correspond exactly at a given instant in time. However you should be able to
   determine whether there is a significant difference between the two figures.

 * **Draining**

   After the backfill process is complete, all nodes that had replicas materialized
   on them will then need to persist those items to disk. It is important to
   continue monitoring the disk write queue and memory usage until the rebalancing
   operation has been completed, to ensure that your cluster is able to keep up
   with the write load and required disk I/O.

<a id="couchbase-admin-tasks-addremove-questions"></a>

### Common Rebalancing Questions

Provided below are some common questions and answers for the rebalancing
operation.

 * **How long will rebalancing take?**

   Because the rebalancing operation moves data stored in RAM and on disk, and
   continues while the cluster is still servicing client requests, the time
   required to perform the rebalancing operation is unique to each cluster. Other
   factors, such as the size and number of objects, speed of the underlying disks
   used for storage, and the network bandwidth and capacity will also impact the
   rebalance speed.

   Busy clusters may take a significant amount of time to complete the rebalance
   operation. Similarly, clusters with a large quantity of data to be moved between
   nodes on the cluster will also take some time for the operation to complete. A
   busy cluster with lots of data may take a significant amount of time to fully
   rebalance.

 * **How many nodes can be added or removed?**

   Functionally there is no limit to the number of nodes that can be added or
   removed in one operation. However, from a practical level you should be
   conservative about the numbers of nodes being added or removed at one time.

   When expanding your cluster, adding more nodes and performing fewer rebalances
   is the recommend practice.

   When removing nodes, you should take care to ensure that you do not remove too
   many nodes and significantly reduce the capability and functionality of your
   cluster.

   Remember as well that you can remove nodes, and add nodes, simultaneously. If
   you are planning on performing a number of addition and removals simultaneously,
   it is better to add and remove multiple nodes and perform one rebalance, than to
   perform a rebalance operation with each individual move.

   If you are swapping out nodes for servicing, then you can use this method to
   keep the size and performance of your cluster constant.

 * **Will cluster performance be affected during a rebalance?**

   By design, there should not be any significant impact on the performance of your
   application. However, it should be obvious that a rebalance operation implies a
   significant additional load on the nodes in your cluster, particularly the
   network and disk I/O performance as data is transferred between the nodes.

   Ideally, you should perform a rebalance operation during the quiet periods to
   reduce the impact on your running applications.

 * **Can I stop a rebalance operation?**

   The vBuckets within the cluster are moved individually. This means that you can
   stop a rebalance operation at any time. Only the vBuckets that have been fully
   migrated will have been made active. You can re-start the rebalance operation at
   any time to continue the process. Partially migrated vBuckets are not activated.

   The one exception to this rule is when removing nodes from the cluster. Stopping
   the rebalance cancels their removal. You will need to mark these nodes again for
   removal before continuing the rebalance operation.

   To ensure that the necessary clean up occurs, stopping a rebalance incurs a five
   minute grace period before the rebalance can be restarted. This ensures that the
   cluster is in a fixed state before rebalance is requested again.

<a id="couchbase-admin-tasks-addremove-buckets"></a>

### Rebalance Effect on Bucket Types

The rebalance operation works across the cluster on both Couchbase and
`memcached` buckets, but there are differences in the rebalance operation due to
the inherent differences of the two bucket types.

For Couchbase buckets:

 * Data is rebalance across all the nodes in the cluster to match the new
   configuration.

 * Updated vBucket map is communicated to clients as each vBucket is successfully
   moved.

 * No data is lost, and there are no changes to the caching or availability of
   individual keys.

For `memcached` buckets:

 * If new nodes are being added to the cluster, the new node is added to the
   cluster, and the node is added to the list of nodes supporting the memcached
   bucket data.

 * If nodes are being removed from the cluster, the data stored on that node within
   the memcached bucket will be lost, and the node removed from the available list
   of nodes.

 * In either case, the list of nodes handling the bucket data is automatically
   updated and communicated to the client nodes. Memcached buckets use the Ketama
   hashing algorithm which is designed to cope with server changes, but the change
   of server nodes may shift the hashing and invalidate some keys once the
   rebalance operation has completed.

<a id="couchbase-admin-tasks-addremove-rebalance-background"></a>

### Rebalance Behind-the-Scenes

The rebalance process is managed through a specific process called the
`orchestrator`. This examines the current vBucket map and then combines that
information with the node additions and removals in order to create a new
vBucket map.

The orchestrator starts the process of moving the individual vBuckets from the
current vBucket map to the new vBucket structure. The process is only started by
the orchestrator - the nodes themselves are responsible for actually performing
the movement of data between the nodes. The aim is to make the newly calculated
vBucket map match the current situation.

Each vBucket is moved independently, and a number of vBuckets can be migrated
simultaneously in parallel between the different nodes in the cluster. On each
destination node, a process called `ebucketmigrator` is started, which uses the
TAP system to request that all the data is transferred for a single vBucket, and
that the new vBucket data will become the active vBucket once the migration has
been completed.

While the vBucket migration process is taking place, clients are still sending
data to the existing vBucket. This information is migrated along with the
original data that existed before the migration was requested. Once the
migration of the all the data has completed, the original vBucket is marked as
disabled, and the new vBucket is enabled. This updates the vBucket map, which is
communicated back to the connected clients which will now use the new location.

<a id="couchbase-admin-tasks-xdcr"></a>

## Cross Datacenter Replication (XDCR)

Couchbase Server 2.0 supports cross datacenter replication (XDCR), providing an
easy way to replicate data from one cluster to another for disaster recovery as
well as better data locality (getting data closer to its users).

Couchbase Server provides support for both intra-cluster replication and cross
datacenter replication (XDCR). Intra-cluster replication is the process of
replicating data on multiple servers within a cluster in order to provide data
redundancy should one or more servers crash. Data in Couchbase Server is
distributed uniformly across all the servers in a cluster, with each server
holding active and replica documents. When a new document is added to Couchbase
Server, in addition to being persisted, it is also replicated to other servers
within the cluster (this is configurable up to three replicas). If a server goes
down, failover promotes replica data to active:


![](images/intra_cluster_repl.png)

Cross datacenter replication in Couchbase Server involves replicating active
data to multiple, geographically diverse datacenters either for disaster
recovery or to bring data closer to its users for faster data access, as shown
in below:


![](images/xdcr_1.png)

You can also see that XDCR and intra-cluster replication occurs simultaneously.
Intra-cluster replication is taking place within the clusters at both Datacenter
1 and Datacenter 2, while at the same time XDCR is replicating documents across
datacenters. Both datacenters are serving read and write requests from the
application.

### Use Cases

**Disaster Recovery.** Disaster can strike your datacenter at any time – often
with little or no warning. With active-active cross datacenter replication in
Couchbase Server, applications can read and write to any geo-location ensuring
availability of data 24x365 even if an entire datacenter goes down.

**Bringing Data Closer to Users.** Interactive web applications demand low
latency response times to deliver an awesome application experience. The best
way to reduce latency is to bring relevant data closer to the user. For example,
in online advertising, sub-millisecond latency is needed to make optimized
decisions about real-time ad placements. XDCR can be used to bring
post-processed user profile data closer to the user for low latency data access.

**Data Replication for Development and Test Needs.** Developers and testers
often need to simulate production-like environments for troubleshooting or to
produce a more reliable test. By using cross datacenter replication, you can
create test clusters that host subset of your production data so that you can
test code changes without interrupting production processing or risking data
loss.

<a id="xdcr-topologies"></a>

### Basic Topologies

XDCR can be configured to support a variety of different topologies; the most
common are unidirectional and bidirectional.

Unidirectional Replication is one-way replication, where active data gets
replicated from the source cluster to the destination cluster. You may use
unidirectional replication when you want to create an active offsite backup,
replicating data from one cluster to a backup cluster.

Bidirectional Replication allows two clusters to replicate data with each other.
Setting up bidirectional replication in Couchbase Server involves setting up two
unidirectional replication links from one cluster to the other. This is useful
when you want to load balance your workload across two clusters where each
cluster bidirectionally replicates data to the other cluster.

In both topologies, data changes on the source cluster are replicated to the
destination cluster only after they are persisted to disk. You can also have
more than two datacenters and replicate data between all of them.

XDCR can be setup on a per bucket basis. A bucket is a logical container for
documents in Couchbase Server. Depending on your application requirements, you
might want to replicate only a subset of the data in Couchbase Server between
two clusters. With XDCR you can selectively pick which buckets to replicate
between two clusters in a unidirectional or bidirectional fashion. As shown in
Figure 3, there is no XDCR between Bucket A (Cluster 1) and Bucket A (Cluster
2). Unidirectional XDCR is setup between Bucket B (Cluster 1) and Bucket B
(Cluster 2). There is bidirectional XDCR between Bucket C (Cluster 1) and Bucket
C (Cluster 2):

Cross datacenter replication in Couchbase Server involves replicating active
data to multiple, geographically diverse datacenters either for disaster
recovery or to bring data closer to its users for faster data access, as shown
in below:


![](images/xdcr_selective.png)

As shown above, after the document is stored in Couchbase Server and before XDCR
replicates a document to other datacenters, a couple of things happen within
each Couchbase Server node.

 1. Each server in a Couchbase cluster has a managed cache. When an application
    stores a document in Couchbase Server it is written into the managed cache.

 1. The document is added into the intra-cluster replication queue to be replicated
    to other servers within the cluster.

 1. The document is added into the disk write queue to be asynchronously persisted
    to disk. The document is persisted to disk after the disk-write queue is
    flushed.

 1. After the documents are persisted to disk, XDCR pushes the replica documents to
    other clusters. On the destination cluster, replica documents received will be
    stored in cache. This means that replica data on the destination cluster can
    undergo low latency read/write operations:


    ![](images/xdcr-persistence.png)

<a id="xdcr-architecture"></a>

### XDCR Architecture

There are a number of key elements in Couchbase Server’s XDCR architecture
including:

**Continuous Replication.** XDCR in Couchbase Server provides continuous
replication across geographically distributed datacenters. Data mutations are
replicated to the destination cluster after they are written to disk. There are
multiple data streams (32 by default) that are shuffled across all shards
(called vBuckets in Couchbase Server) on the source cluster to move data in
parallel to the destination cluster. The vBucket list is shuffled so that
replication is evenly load balanced across all the servers in the cluster. The
clusters scale horizontally, more the servers, more the replication streams,
faster the replication rate. For information on changing the number of data
streams for replication, see [Changing XDCR
Settings](#couchbase-admin-xdcr-rest-crossref)

**Cluster Aware.** XDCR is cluster topology aware. The source and destination
clusters could have different number of servers. If a server in the source or
destination cluster goes down, XDCR is able to get the updated cluster topology
information and continue replicating data to available servers in the
destination cluster.

**Push based connection resilient replication.** XDCR in Couchbase Server is
push-based replication. The source cluster regularly checkpoints the replication
queue per vBucket and keeps track of what data the destination cluster last
received. If the replication process is interrupted for example due to a server
crash or intermittent network connection failures, it is not required to restart
replication from the beginning. Instead, once the replication link is restored,
replication can continue from the last checkpoint seen by the destination
cluster.

**Efficient.** For the sake of efficiency, Couchbase Server is able to
de-duplicate information that is waiting to be stored on disk. For instance, if
there are three changes to the same document in Couchbase Server, and these
three changes are waiting in queue to be persisted, only the last version of the
document is stored on disk and later gets pushed into the XDCR queue to be
replicated.

**Active-Active Conflict Resolution.** Within a cluster, Couchbase Server
provides strong consistency at the document level. On the other hand, XDCR also
provides eventual consistency across clusters. Built-in conflict resolution will
pick the same “winner” on both the clusters if the same document was mutated on
both the clusters. If a conflict occurs, the document with the most updates will
be considered the “winner.” If the same document is updated the same number of
times on the source and destination, additional metadata such as numerical
sequence, CAS value, document flags and expiration TTL value are used to pick
the “winner.” XDCR applies the same rule across clusters to make sure document
consistency is maintained:


![](images/xdcr_conflict_res.png)

As shown in above, bidirectional replication is set up between Datacenter 1 and
Datacenter 2 and both the clusters start off with the same JSON document (Doc
1). In addition, two additional updates to Doc 1 happen on Datacenter 2. In the
case of a conflict, Doc 1 on Datacenter 2 is chosen as the winner because it has
seen more updates.

### Advanced Topologies

By combining unidirectional and bidirectional topologies, you have the
flexibility to create several complex topologies such as the chain and
propagation topology as shown below:


![](images/xdcr_repl_chain.png)

In the image below there is one bidirectional replication link between
Datacenter 1 and Datacenter 2 and two unidirectional replication links between
Datacenter 2 and Datacenters 3 and 4. Propagation replication can be useful in a
scenario when you want to setup a replication scheme between two regional
offices and several other local offices. Data between the regional offices is
replicated bidirectionally between Datacenter 1 and Datacenter 2. Data changes
in the local offices (Datacenters 3 and 4) are pushed to the regional office
using unidirectional replication:


![](images/xdcr_advanced.png)

A description of the functionality, implementation and limitations of XDCR are
provided in [Behavior and
Limitations](#couchbase-admin-tasks-xdcr-functionality).

To create and configure replication, see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).

<a id="couchbase-admin-tasks-xdcr-configuration"></a>

### About XDCR Replications

You configure replications using the `XDCR` tab of the Administration Web
Console. You configure replication on a bucket basis. If you want to replicate
data from all buckets in a cluster, you should individually configure
replication for each bucket.

**Before You Configure XDCR**

 * All nodes within each cluster must be configured to communicate with all the
   nodes on the destination cluster. XDCR will use any node in a cluster to
   replicate between the two clusters.

 * Couchbase Server versions and platforms, must match. For instance if you want to
   replicate from a Linux-based cluster, you need to do so with another Linux-based
   cluster.

 * When XDCR performs replication, it exchanges data between clusters over TCP/IP
   port 8092; Couchbase Server uses TCP/IP port 8091 to exchange cluster
   configuration information. If you are communicating with a destination cluster
   over a dedicated connection or the Internet you should ensure that all the nodes
   in the destination and source clusters can communicate with each other over
   ports 8091 and 8092.

`Ongoing Replications` are those replications that are currently configured and
operating. You can monitor the current configuration, current status, and the
last time a replication process was triggered for each configured replication.

Under the XDCR tab you can also configure `Remote Clusters` for XDCR; these are
named destination clusters you can select when you configure replication. When
you configure XDCR, the destination cluster reference should point to the IP
address of one of the nodes in the destination cluster.

Before you set up replication via XDCR, you should be certain that a destination
bucket already exists. If this bucket does not exist, replication via XDCR may
not find some shards on the destination cluster; this will result in replication
of only some data from the source bucket and will significantly delay
replication. This would also require you to retry replication multiple times to
get a source bucket to be fully replicated to a destination.

Therefore make sure that you check that a destination bucket exists. The
recommended approach is try to read on any key from the bucket. If you receive a
'key not found' error, or the document for the key, the bucket exists and is
available to all nodes in a cluster. You can do this via a Couchbase SDK with
any node in the cluster. See [Couchbase Developer Guide 2.0, Performing Connect,
Set and
Get](ttp://www.couchbase.com/docs/couchbase-devguide-2.0/cb-basic-connect-get-set.html).

For more information about creating  buckets via the REST API, see [Creating and
Editing Data Buckets](#couchbase-admin-restapi-creating-buckets).

###Set Source and Destination Clusters

To create a uni-directional replication (i.e. from cluster A to cluster B):

 1. Check and ensure that a destination bucket exists on the cluster to which you
    will be replicating. To do so, perform this REST API request:

     ```
     curl -u Admin:password http://ip.for.destination.cluster:8091/pools/default/buckets
     ```

 2. To set up a destination cluster reference, click the `Create Cluster Reference`
    button. You will be prompted to enter a name used to identify this cluster, the
    IP address, and optionally the administration port number for the remote
    cluster.


    ![](images/xdcr-cluster-reference.png)

    Enter the username and password for the administrator on the destination
    cluster.

 3. Click Save to store new reference to the destination cluster. This cluster
    information will now be available when you configure replication for your source
    cluster.
    
<a id="admin-tasks-xdcr-new-replication"></a>
    
###Create New Replication

After you create references to the source and destination, you can create a replication 
between the clusters in Couchbase Web Console. 


 1. Click `Create Replication` to configure a new XDCR replication. A panel appears
    where you can configure a new replication from source to destination cluster.

 2. In the `Replicate changes from` section select a from the current cluster that
    is to be replicated. This is your source bucket.

 3. In the `To` section, select a destination cluster and enter a bucket name from
    the destination cluster:


    ![](images/xdcr-cluster-setup.png)

 4. Click the `Replicate` button to start the replication process.

After you have configured and started replication, the web console will show the
current status and list of replications in the `Ongoing Replications` section:


![](images/xdcr-cluster-monitor.png)

<a id="admin-tasks-xdcr-advanced"></a>

###Providing Advanced Settings

As of Couchbase Server 2.2+, when you create a new replication, you can also provide internal settings and choose the protocol used for replication at the destination cluster. For earlier versions of Couchbase Server, these internal settings were only available via the REST-API, see [Changing Internal XDCR Settings](#couchbase-admin-restapi-xdcr-change-settings)

1. In the `Create Replication` panel, click `Advanced Settings`.
    Additional options appear in the panel.
    
2. For `XDCR Protocol` select Version 1 or Version 2. This defaults to Version 1. You can also change this setting via the REST-API for  XDCR internal settings we provide above or in Couchbase Server 2.2+, you can use  [`couchbase-cli` Tool](#couchbase-admin-cli-xmem").

    - Version 1 - uses the memcached protocol for replication. This increases XDCR throughput at destination clusters.
    
    - Version 2 - uses a REST protocol for replication. If you use the Elastic Search plugin which depends on XDCR, you must use this protocol.
    
    See also, [XDCR Behavior and Limitations](#couchbase-admin-tasks-xdcr-functionality) and for more information on Elastic Search, see 
    [Couchbase Elastic Search Guide](http://docs.couchbase.com/couchbase-elastic-search/).
    
3. Provide any changes for internal XDCR settings. You can also change these settings plus additional internal settings via the REST API. 
    
    How you adjust these variables differs based on what whether you want to perform
    uni-directional or bi-directional replication between clusters. Other factors
    for consideration include intensity of read/write operations on your clusters,
    the rate of disk persistence on your destination cluster, and your system
    environment. Changing these parameters will impact performance of your clusters
    as well as XDCR replication performance.
    
    Internal settings that you can update in Web Console include:
    
    - `XDCR Max Replications per Bucket`

      Maximum concurrent replications per bucket, 8 to 256. This controls the number
      of parallel replication streams per node. If you are running your cluster on
      hardware with high-performance CPUs, you can increase this value to improve
      replication speed.

    - `XDCR Checkpoint Interval`

      Interval between checkpoints, 60 to 14400 (seconds). Default 1800. At this time
      interval, batches of data via XDCR replication will be placed in the front of
      the disk persistence queue. This time interval determines the volume of data
      that will be replicated via XDCR should replication need to restart. The greater
      this value, the longer amount of time transpires for XDCR queues to grow. For
      example, if you set this to 10 minutes and a network error occurs, when XDCR
      restarts replication, 10 minutes of items will have accrued for replication.

      Changing this to a smaller value could impact cluster operations when you have
      significant amount of write operations on a destination cluster and you are
      performing bi-directional replication with XDCR. For instance, if you set this
      to 5 minutes, the incoming batches of data via XDCR replication will take
      priority in the disk write queue over incoming write workload for a destination
      cluster. This may result in the problem of having an ever growing disk-write
      queue on a destination cluster; also items in the disk-write queue that are
      higher priority than the XDCR items will grow staler/older before they are
      persisted.

    - `XDCR Batch Count`

      Document batching count, 500 to 10000. Default 500. In general, increasing this
      value by 2 or 3 times will improve XDCR transmissions rates, since larger
      batches of data will be sent in the same timed interval. For unidirectional
      replication from a source to a destination cluster, adjusting this setting by 2
      or 3 times will improve overall replication performance as long as persistence
      to disk is fast enough on the destination cluster. Note however that this can
      have a negative impact on the destination cluster if you are performing
      bi-directional replication between two clusters and the destination already
      handles a significant volume of reads/writes.

    - `XDCR Batch Size (KB)`

      Document batching size, 10 to 100000 (kB). Default 2048. In general, increasing
      this value by 2 or 3 times will improve XDCR transmissions rates, since larger
      batches of data will be sent in the same timed interval. For unidirectional
      replication from a source to a destination cluster, adjusting this setting by 2
      or 3 times will improve overall replication performance as long as persistence
      to disk is fast enough on the destination cluster. Note however that this can
      have a negative impact on the destination cluster if you are performing
      bi-directional replication between two clusters and the destination already
      handles a significant volume of reads/writes.

    - `XDCR Failure Retry Interval`

      Interval for restarting failed XDCR, 1 to 300 (seconds). Default 30. If you
      expect more frequent network or server failures, you may want to set this to a
      lower value. This is the time that XDCR waits before it attempts to restart
      replication after a server or network failure.

    - `XDCR Optimistic Replication Threshold`. This will improve latency for XDCR.

      This is document size in bytes. 0 to 2097152 Bytes (20MB). Default is 256 Bytes. XDCR
      will get metadata for documents larger than this size on a single time before
      replicating the document to a destination cluster. For background information, see 
      ['Optimistic Replication' in XDCR](#xdcr-optimistic-replication)

4. Click Replicate. 

After you create the replication or update the setting, you can view or edit them once again by clicking Settings in Outgoing Replications.

**Configuring Bi-Directional Replication**

Replication is unidirectional from one cluster to another. To configure
bidirectional replication between two clusters, you need to provide settings for
two separate replication streams. One stream replicates changes from Cluster A
to Cluster B, another stream replicates changes from Cluster B to Cluster A. To
configure a bidirectional replication:

 1. Create a replication from Cluster A to Cluster B on Cluster A.

 1. Create a replication from Cluster B to Cluster A on Cluster B.

You do not need identical topologies for both clusters; you can have a different
number of nodes in each cluster, and different RAM and persistence
configurations.

You can also create a replication using the Administration REST API instead of
Couchbase Web Console. For more information, see [Getting a Destination Cluster
Reference](#couchbase-admin-restapi-xdcr-destination).

After you create a replication between clusters, you can configure the number of
parallel replicators that run per node. The default number of parallel, active
streams per node is 32, but you can adjust this. For information on changing the
internal configuration settings, see [Viewing Internal XDCR
Settings](#couchbase-admin-restapi-xdcr-internal-settings).

<a id="couchbase-admin-tasks-xdcr-monitoring"></a>

### Monitoring Replication Status

There are two different areas of Couchbase Web Console which contain information
about replication via XDCR: 1) the XDCR tab, and 2) the outgoing XDCR section
under the Data Buckets tab.

The Couchbase Web Console will display replication from the cluster it belongs
to. Therefore, when you view the console from a particular cluster, it will
display any replications configured, or replications in progress for that
particular source cluster. If you want to view information about replications at
a destination cluster, you need to open the console at that cluster. Therefore,
when you configure bi-directional you should use the web consoles that belong to
source and destination clusters to monitor both clusters.

To see statistics on incoming and outgoing replications via XDCR see the
following:

 * Incoming Replications, see [Monitoring Incoming
   XDCR](#couchbase-admin-web-console-data-buckets-xdcr-recv).

 * Outgoing Replications, see [Monitoring Outgoing
   XDCR](#couchbase-admin-web-console-data-buckets-xdcr).

Any errors that occur during replication appear in the XDCR errors panel. In the
example below, we show the errors that occur if replication streams from XDCR
will fail due to the missing vBuckets:


![](images/xdcr-errors-missing-vbuckets.png)

You can tune your XDCR parameters by using the administration REST API. See
[Viewing Internal XDCR
Settings](#couchbase-admin-restapi-xdcr-internal-settings).

<a id="couchbase-admin-tasks-xdcr-cancellation"></a>

### Canceling Replication

You can cancel replication at any time by clicking `Delete` next to the active
replication that is to be canceled.

A prompt will confirm the deletion of the configured replication. Once the
replication has been stopped, replication will cease on the originating cluster
on a document boundary.

Canceled replications that were terminated while the replication was still
active will be displayed within the `Past Replications` section of the
`Replications` section of the web console.

<a id="couchbase-admin-tasks-xdcr-functionality"></a>

### Behavior and Limitations

 * **Replication via Memcached Protocol** As of Couchbase Server 2.2+, XDCR can
   replicate data through the memcached protocol. By using this protocol for XDCR
   replication you can significantly reduce overhead and improve latency. In the
   past, XDCR supported a single internal REST protocol for replicating data from
   one cluster to another. On a source cluster a work process batched multiple
   mutations and sent the batch to a destination cluster using a REST interface.
   The REST interface at the destination node unpacked the batch of mutations and
   sent each mutation via a single memcached command. The destination cluster then
   stored mutations in RAM. This process is known as *CAPI mode XDCR* as it relies
   on the REST API known as CAPI.

   This additional mode available for XDCR is known as *XMEM mode XDCR* and will
   bypass the REST interface and replicate mutations via the memcached protocol at
   the destination cluster:


   ![](images/XDCR_xmem.png)

   In this mode, every replication process at a source cluster will deliver
   mutations directly via the memcached protocol on the remote cluster. This
   additional mode will not impact current XDCR architecture, rather it is
   implemented completely within the data communication layer used in XDCR. Any
   external XDCR interface remains the same. The benefit of using this mode is
   performance: this will increase XDCR throughput, improve XDCR scalability, and
   reduce CPU usage at destination clusters during replication.

   You can configure XDCR to operate via the new XMEM mode or remain using the CAPI
   mode. To do so, you use the REST-API and change the setting for
   `xdcr_replication_mode`, see [Changing Internal XDCR
   Settings](#couchbase-admin-restapi-xdcr-change-settings).

 * **Network and System Outages**

    * XDCR is resilient to intermittent network failures. In the event that the
      destination cluster is unavailable due to a network interruption, XDCR will
      pause replication and will then retry the connection to the cluster every 30
      seconds. Once XDCR can successfully reconnect with a destination cluster, it
      will resume replication. In the event of a more prolonged network failure where
      the destination cluster is unavailable for more than 30 seconds, a source
      cluster will continue polling the destination cluster which may result in
      numerous errors over time. In this case, you should delete the replication in
      Couchbase Web Console, fix the system issue, then re-create the replication. The
      new XDCR replication will resume replicating items from where the old
      replication had been stopped.

    * Your configurations will be retained over host restarts and reboots. You do not
      need to re-configure your replication configuration in the event of a system
      failure.

 * **Document Handling**

    * XDCR does not replicate views and view indexes; you must manually exchange view
      definitions between clusters and re-generate the index on the destination
      cluster.

    * Non UTF-8 encodable document IDs on the source cluster are automatically
      filtered out and logged and are not transferred to the remote cluster. If you
      have any non UTF-8 keys you will see warning output in the `xdcr_error.*` log
      files along with a list of all non-UTF-8 keys found by XDCR.

 * **Flush Requests**

   Flush requests to delete the entire contents of bucket are not replicated to the
   remote cluster. Performing a flush operation will only delete data on the local
   cluster. Flush is disabled if there is an active outbound replica stream
   configured.

<a id="couchbase-xdcr-conflict-resolution"></a>

### Conflict Resolution in XDCR

XDCR automatically performs conflict resolution for different document versions
on source and destination clusters. The algorithm is designed to consistently
select the same document on either a source or destination cluster. For each
stored document, XDCR perform checks of metadata to resolve conflicts. It checks
the following:

 * Numerical sequence, which is incremented on each mutation

 * CAS value

 * Document flags

 * Expiration (TTL) value

If a document does not have the highest revision number, changes to this
document will not be stored or replicated; instead the document with the highest
score will take precedence on both clusters. Conflict resolution is automatic
and does not require any manual correction or selection of documents.

By default XDCR fetches metadata twice from every document before it replicates
the document at a destination cluster. XDCR fetches metadata on the source
cluster and looks at the number of revisions for a document. It compares this
number with the number of revisions on the destination cluster and the document
with more revisions is considered the 'winner.'

If XDCR determines a document from a source cluster will win conflict
resolution, it puts the document into the replication queue. If the document
will lose conflict resolution because it has a lower number of mutations, XDCR
will not put it into the replication queue. Once the document reaches the
destination, this cluster will request metadata once again to confirm the
document on the destination has not changed since the initial check. If the
document from the source cluster is still the 'winner' it will be persisted onto
disk at the destination. The destination cluster will discard the document
version with the lowest number of mutations.

The key point is that the number of document mutations is the main factor that
determines whether XDCR keeps a document version or not. This means that the
document that has the most recent mutation may not be necessarily the one that
wins conflict resolution. If both documents have the same number of mutations,
XDCR selects a winner based on other document metadata. Precisely determining
which document is the most recently changed is often difficult in a distributed
system. The algorithm Couchbase Server uses does ensure that each cluster can
independently reach a consistent decision on which document wins.

<a id="xdcr-optimistic-replication"></a>

### 'Optimistic Replication' in XDCR

In Couchbase 2.1 you can also tune the performance of XDCR with a new parameter,
`xdcrOptimisticReplicationThreshold`. By default XDCR gets metadata twice for
documents over 256 bytes before it performs conflict resolution for at a
destination cluster. If the document fails conflict resolution it will be
discarded at the destination cluster.

When a document is smaller than the number of bytes provided as this parameter,
XDCR immediately puts it into the replication queue without getting metadata on
the source cluster. If the document is deleted on a source cluster, XDCR will no
longer fetch metadata for the document before it sends this update to a
destination cluster. Once a document reaches the destination cluster, XDCR will
fetch the metadata and perform conflict resolution between documents. If the
document 'loses' conflict resolution, Couchbase Server discards it on the
destination cluster and keeps the version on the destination. This new feature
improves replication latency, particularly when you replicate small documents.

There are tradeoffs when you change this setting. If you set this low relative
to document size, XDCR will frequently check metadata. This will increase
latency during replication, it also means that it will get metadata before it
puts a document into the replication queue, and will get it again for the
destination to perform conflict resolution. The advantage is that you do not
waste network bandwidth since XDCR will send less documents that will 'lose.'

If you set this very high relative to document size, XDCR will fetch less
metadata which will improve latency during replication. This also means that you
will increase the rate at which XDCR puts items immediately into the replication
queue which can potentially overwhelm your network, especially if you set a high
number of parallel replicators. This may increase the number of documents sent
by XDCR which ultimately 'lose' conflicts at the destination which wastes
network bandwidth.

As of Couchbase Server 2.1, XDCR will not fetch metadata for documents that are
deleted.

**Changing the Document Threshold**

You can change this setting with the REST API as one of the internal settings
for XDCR. For more information, see [Changing Internal XDCR
Settings](#couchbase-admin-restapi-xdcr-change-settings).

**Monitoring 'Optimistic Replication"**

The easiest way you can monitor the impact of this setting is in Couchbase Web
Console. On the Data Buckets tab under Incoming XDCR Operations, you can compare
`metadata reads per sec` to `sets per sec` :


![](images/monitor_optmized_xdcr.png)

If you set a low threshold relative to document size, `metadata reads per sec`
will be roughly twice the value of `sets per sec`. If you set a high threshold
relative to document size, this will virtually eliminate the first fetch of
metadata and therefore `metadata reads per sec` will roughly equal `sets per
sec`

The other option is to check the log files for XDCR, which you can find in
`/opt/couchbase/var/lib/couchbase/logs` on the nodes for a source bucket. The
log files following the naming convention `xdcr.1`, `xdcr.2` and so on. In the
logs you will see a series of entries as follows:


```
out of all 11 docs, number of small docs (including dels: 2) is 4,
number of big docs is 7, threshold is 256 bytes,
after conflict resolution at target ("http://Administrator:asdasd@127.0.0.1:9501/default%2f3%3ba19c9d4e733a97fa7cb38daa4113d034/"),
out of all big 7 docs the number of docs we need to replicate is: 5;
total # of docs to be replicated is: 9, total latency: 142 ms
```

The first line means that 4 documents are under the threshold and XDCR checked
metadata twice for all 7 documents and replicated 5 larger documents and 4
smaller documents. The amount of time to check and replicate all 11 documents
was 142 milliseconds. For more information about XDCR, see [Cross Datacenter
Replication (XDCR)](#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-xdcr-rest-crossref"></a>

### Changing XDCR Settings

Besides Couchbase Web Console, you can use several Couchbase REST-API endpoints
to modify XDCRsettings. Some of these settings are references used in XDCR and
some of these settings will change XDCR behavior or performance:

 * Viewing, setting and removing destination cluster references, can be found in
   [Getting a Destination Cluster
   Reference](#couchbase-admin-restapi-xdcr-destination), [Creating a Destination
   Cluster Reference](#couchbase-admin-restapi-xdcr-create-ref) and [Deleting a
   Destination Cluster Reference](#couchbase-admin-restapi-xdcr-deleting-ref).

 * Creating and removing a replication via REST can be found in [Creating a
   Destination Cluster Reference](#couchbase-admin-restapi-xdcr-create-ref) and
   [Deleting a Destination Cluster
   Reference](#couchbase-admin-restapi-xdcr-deleting-ref).

 * Concurrent replications, which is the number of concurrent replications per
   Couchbase Server instance. See [Viewing Internal XDCR
   Settings](#couchbase-admin-restapi-xdcr-internal-settings).

 * 'Optimistic Replication.' For more information about 'optimistic replication',
   see ['Optimistic Replication' in XDCR](#xdcr-optimistic-replication).



For the XDCR retry interval you can provide an environment variable or make a
PUT request. By default if XDCR is unable to replicate for any reason like
network failures, it will stop and try to reach the remote cluster every 30
seconds if the network is back, XDCR will resume replicating. You can change
this default behavior by changing an environment variable or by changing the
server parameter `xdcr_failure_restart_interval` with a PUT request:

Note that if you are using XDCR on multiple nodes in cluster and you want to
change this setting throughout the cluster, you will need to perform this
operation on every node in the cluster.

 * By an environment variable:

    ```
    >    export XDCR_FAILURE_RESTART_INTERVAL=60
    ```

 * By server setting:

    ```
    >    curl -X POST http://Administrator: <http://Administrator/>asdasd@127.0.0.1:9000/diag/eval \
                          -d 'rpc:call(node(), ns_config, set, [xdcr_failure_restart_interval, 60]).'
    ```

You can put the system environment variable in a system configuration file on
your nodes. When the server restarts, it will load this parameter. If you set
both the environment variable and the server parameter, the value for the
environment parameter will supersede.

<a id="couchbase-admin-tasks-xdcr-security"></a>

### Securing Data Communication with XDCR

When configuring XDCR across multiple clusters over public networks, the data is
sent unencrypted across the public interface channel. To ensure security for the
replicated information you will need to configure a suitable VPN gateway between
the two datacenters that will encrypt the data between each route between
datacenters.

Within dedicated datacenters being used for Couchbase Server deployments, you
can configure a point to point VPN connection using a static route between the
two clusters:


![](images/xdcr-vpn-static.png)

When using Amazon EC2 or other cloud deployment solutions, particularly when
using different EC2 zones, there is no built-in VPN support between the
different EC2 regional zones. However, there is VPN client support for your
cluster within EC2 and Amazon VPC to allow communication to a dedicated VPN
solution. For more information, see [Amazon Virtual Private Cloud
FAQs](http://aws.amazon.com/vpc/faqs/) for a list of supported VPNs.

To support cluster to cluster VPN connectivity within EC2 you will need to
configure a multi-point BGP VPN solution that can route multiple VPN
connections. You can then route the VPN connection from one EC2 cluster and
region to the third-party BGP VPN router, and the VPN connection from the other
region, using the BGP gateway to route between the two VPN connections.


![](images/xdcr-vpn-bgp.png)

Configuration of these VPN routes and systems is dependent on your VPN solution.

For additional security, you should configure your security groups to allow
traffic only on the required ports between the IP addresses for each cluster. To
configure security groups, you will need to specify the inbound port and IP
address range. You will also need to ensure that the security also includes the
right port and IP addresses for the remainder of your cluster to allow
communication between the nodes within the cluster.

You must ensure when configuring your VPN connection that you route and secure
all the ports in use by the XDCR communication protocol, ports 8091 and 8092 on
every node within the cluster at each destination.

<a id="couchbase-admin-tasks-xdcr-cloud"></a>

### Using XDCR in Cloud Deployments

If you want to use XDCR within a cloud deployment to replicate between two or
more clusters that are deployed in the cloud, there are some additional
configuration requirements:

 * Use a public DNS names and public IP addresses for nodes in your clusters.

   Cloud services support the use of a public IP address to allow communication to
   the nodes within the cluster. Within the cloud deployment environment, the
   public IP address will resolve internally within the cluster, but allow external
   communication. In Amazon EC2, for example, ensure that you have enabled the
   public interface in your instance configuration, that the security parameters
   allow communication to the required ports, and that public DNS record exposed by
   Amazon is used as the reference name.

   You should configure the cluster with a fixed IP address and the public DNS name
   according to the information in [Handling Changes in IP
   Addresses](#couchbase-bestpractice-cloud-ip).

 * Use a DNS service to identify or register a CNAME that points to the public DNS
   address of each node within the cluster. This will allow you to configure XDCR
   to use the CNAME to a node in the cluster. The CNAME will be constant, even
   though the underlying public DNS address may change within the cloud service.

   The CNAME record entry can then be used as the destination IP address when
   configuring replication between the clusters using XDCR. If a transient failure
   causes the public DNS address for a given cluster node to change, update the
   CNAME to point to the updated public DNS address provided by the cloud service.

By updating the CNAME records, replication should be able to persist over a
public, internet- based connection, even though the individual IP of different
nodes within each cluster configured in XDCR.

For additional security, you should configure your security groups to allow
traffic only on the required ports between the IP addresses for each cluster. To
configure security groups, you will need to specify the inbound port and IP
address range. You will also need to ensure that the security also includes the
right port and IP addresses for the remainder of your cluster to allow
communication between the nodes within the cluster.

Node Group           | Ports                                  | IP Addresses         
---------------------|----------------------------------------|----------------------
Nodes within cluster | 4369, 8091, 8092,9, 11210, 21100-21199 | IP of cluster nodes  
XDCR Nodes           | 8091, 8092                             | IP of remote clusters

For more information in general about using Couchbase Server in the cloud, see
[Using Couchbase in the Cloud](#couchbase-bestpractice-cloud).

<a id="couchbase-admin-tasks-changepath"></a>

## Changing the Configured Disk Path

You cannot change the disk path where the data and index files are stored on a
running server. To change the disk path, the node must be removed from the
cluster, configured with the new path, and added back to the cluster.

The quickest and easiest method is to provision a new node with the correct disk
path configured, and then use swap rebalance to add the new node in while taking
the old node out. For more information, see [Swap
Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

To change the disk path of the existing node, the recommended sequence is:

 1. Remove the node where you want to change the disk path from the cluster. For
    more information, see [Removing a Node from a
    Cluster](#couchbase-admin-tasks-addremove-rebalance-remove). To ensure the
    performance of your cluster is not reduced, perform a swap rebalance with a new
    node (see [Swap Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap) ).

 1. Perform a rebalance operation, see [Performing a
    Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

 1. Configure the new disk path, either by using the REST API (see [Configuring
    Index Path for a Node](#couchbase-admin-restapi-provisioning-diskpath) ), using
    the command-line (seecluster initializationfor more information).

    Alternatively, connect to the Web UI of the new node, and follow the setup
    process to configure the disk path (see [Initial Server
    Setup](#couchbase-getting-started-setup).

 1. Add the node back to the cluster, see [Adding a Node to a
    Cluster](#couchbase-admin-tasks-addremove-rebalance-add).

The above process will change the disk path only on the node you removed from
the cluster. To change the disk path on multiple nodes, you will need to swap
out each node and change the disk path individually.

<a id="couchbase-admin-web-console"></a>
