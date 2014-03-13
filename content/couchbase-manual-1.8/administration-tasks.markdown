# Administration Tasks

For general day-to-day running and configuration, Couchbase Server is
self-managing. The management infrastructure and components of the Couchbase
Server system are able to adapt to the different events within the cluster.
There are also only a few different configuration variables, and the majority of
these do not need to be modified or altered in most installations.

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
   rebalance operation is available in [Rebalancing (Expanding and Shrinking your
   Cluster)](#couchbase-admin-tasks-addremove)

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

   For more information, see [Node Failover](#couchbase-admin-tasks-failover).

 * **Backup and Restore Your Cluster Data**

   Couchbase Server automatically distributes your data across the nodes within the
   cluster, and supports replicas of that data. It is good practice, however, to
   have a backup of your bucket data in the event of a more significant failure.

   More information on the available backup and restore methods are available in
   [Backup and Restore with Couchbase](#couchbase-backup-restore).

<a id="couchbase-admin-tasks-failover"></a>

## Node Failover

The replica system within Couchbase Server enables the cluster to cope with a
failure of one or more nodes within the cluster without affecting your ability
to access the stored data. In the event of an issue on one of the nodes, you can
initiate a `failover` status for the node. This removes the node from the
cluster, and enables the replicas of the data stored on that node within the
other nodes in the cluster.

Because failover of a node enables the replica vBuckets for the corresponding
data stored, the load on the nodes holding the replica data will increase. Once
the failover has occurred, your cluster performance will have degraded, and the
replicas of your data will have been reduced by one.

To address this problem, once a node has been failed over, you should perform a
rebalance as soon as possible. During a rebalance after a failover:

 * Data is redistributed between the nodes in the cluster

 * Replica vBuckets are recreated and enabled

Rebalancing should therefore take place as soon as possible after a failover
situation to ensure the health and performance of your cluster is maintained.

Failover should be used on a node that has become unresponsive or that cannot be
reached due to a network or other issue. If you need to remove a node for
administration purposes, you should use the remove and rebalance functionality.
See [Performing a Rebalance](#couchbase-admin-tasks-addremove-rebalance). This
will ensure that replicas and data remain in tact.

Using failover on a live node (instead of using remove/rebalance) may introduce
a small data-loss window as any data that has not yet been replicated may be
lost when the failover takes place. You can still recover the data, but it will
not be immediately available.

There are a number of considerations when planning, performing or responding to
a failover situation:

 * **Automated failover** is available. This will automatically mark a node as
   failed over if the node has been identified as unresponsive or unavailable.
   However, there are deliberate limitations to the automated failover feature. For
   more information on choosing whether to use automated or manual (monitored)
   failover is available in [Choosing a Failover
   Solution](#couchbase-admin-tasks-failover-choosing).

   For information on how to enable and monitor automatic failover, see [Using
   Automatic Failover](#couchbase-admin-tasks-failover-automatic).

 * Initiating a **failover**, whether automatically or manually requires additional
   operations to return the cluster back to full operational health. More
   information on handling a failover situation is provided in [Handling a Failover
   Situation](#couchbase-admin-tasks-failover-handling).

 * Once the issue with the failed over node has been addressed, you can add the
   failed node back to your cluster. The steps and considerations required for this
   operation are provided in [Adding Back a Failed
   Node](#couchbase-admin-tasks-failover-addback).

<a id="couchbase-admin-tasks-failover-choosing"></a>

### Choosing a Failover Solution

Because failover has the potential to significantly reduce the performance of
your cluster, you should consider how best to handle a failover situation.

Using automated failover implies that you are happy for a node to be failed over
without user-intervention and without the knowledge and identification of the
issue that initiated the failover situation. It does not, however, negate the
need to initiate a rebalance to return the cluster to a healthy state.

Manual failover requires constant monitoring of the cluster to identify when an
issue occurs, and then triggering a manual failover and rebalance operation.
Although it requires more monitoring and manual intervention, there is a
possibility that your cluster and data access may have degraded significantly
before the failover and rebalance are initiated.

In the following sections the two alternatives and their issues are described in
more detail.

<a id="couchbase-admin-tasks-failover-automatic-considerations"></a>

### Automated failover considerations

Automatically failing components in any distributed system has the potential to
cause problems. There are many examples of high-profile applications that have
taken themselves off-line through unchecked automated failover strategies. Some
of the situations that might lead to pathological in an automated failover
solution include:

 * **Scenario 1 — Thundering herd**

   Imagine a scenario where a Couchbase Server cluster of five nodes is operating
   at 80-90% aggregate capacity in terms of network load. Everything is running
   well, though at the limit. Now a node fails and the software decides to
   automatically failover that node. It is unlikely that all of the remaining four
   nodes would be able to handle the additional load successfully.

   The result is that the increased load could lead to another node failing and
   being automatically failed over. These failures can cascade leading to the
   eventual loss of the entire cluster. Clearly having 1/5th of the requests not
   being serviced would be more desirable than none of the requests being serviced.

   The solution in this case would be to live with the single node failure, add a
   new server to the cluster, mark the failed node for removal and then rebalance.
   This way there is a brief partial outage, rather than an entire cluster being
   disabled.

   One alternative preparative solution is to ensure there is excess capacity to
   handle unexpected node failures and allow replicas to take over.

 * **Situation 2 — Network partition**

In case of network partition or split-brain where the failure of a network device causes a network to be split, Couchbase implements automatic failover with the following restrictions:

* Automatic failover requires a minimum of three (3) nodes per cluster. This prevents a 2-node cluster from having both nodes fail each other over in the face of a network partition and protects the data integrity and consistency.
* Automatic failover occurs only if exactly one (1) node is down. This prevents a network partition from causing two or more halves of a cluster from failing each other over and protects the data integrity and consistency.
* Automatic failover occurs only once before requiring administrative action. This prevents cascading failovers and subsequent performance and stability degradation. In many cases, it is better to not have access to a small part of the dataset rather than having a cluster continuously degrade itself to the point of being non-functional. 
* Automatic failover implements a 30 second delay when a node fails before it performs an automatic failover.  This prevents transient network issues or slowness from causing a node to be failed over when it shouldn’t be. 

If a network partition occurs, automatic failover occurs if and only if automatic failover is allowed by the specified restrictions. For example, if a single node is partitioned out of a cluster of five (5), it is automatically failed over. If more than one (1) node is partitioned off, autofailover does not occur. After that, administrative action is required for a reset. In the event that another node fails before the automatic failover is reset, no automatic failover occurs. 


 * **Situation 3 — Misbehaving node**

   If one node loses connectivity to the cluster (or "thinks" that it has lost
   connectivity to the cluster), allowing it to automatically failover the rest of
   the cluster would lead to that node creating a cluster-of-one. As a result a
   similar partition situation as described above arises again.

   In this case the solution is to take down the node that has connectivity issues
   and let the rest of the cluster handle the load (assuming there is spare
   capacity available).

<a id="couchbase-admin-tasks-failover-monitored"></a>

### Manual (Monitored) Failover

Although automated failover has potential issues, choosing to use manual or
monitored failover is not without potential problems.

If the cause of the failure is not identified, and the load that will be placed
on the remaining system is not well understood, then automated failover can
cause more problems than it is designed to solve. An alternative solution is to
use monitoring to drive the failover decision. Monitoring can take two forms,
either human or by using a system external to the Couchbase Server cluster that
can monitor both the cluster and the node environment and make a more
information driven decision.

 * **Human intervention**

   One option is to have a human operator respond to alerts and make a decision on
   what to do. Humans are uniquely capable of considering a wide range of data,
   observations and experience to best resolve a situation. Many organizations
   disallow automated failover without human consideration of the implications.

 * **External monitoring**

   [Another option is to have a system monitoring the cluster via theManagement
   REST API](#couchbase-admin-restapi). Such an external system is in the best
   position to order the failover of nodes because it can take into account system
   components that are outside the scope of Couchbase Server visibility.

   For example, by observing that a network switch is flaking and that there is a
   dependency on that switch by the Couchbase cluster, the management system may
   determine that failing the Couchbase Server nodes will not help the situation.

   If, however, everything around Couchbase Server and across the various nodes is
   healthy and that it does indeed look like a single node problem, and that the
   aggregate traffic can support loading the remaining nodes with all traffic, then
   the management system may fail the system over using the REST API or
   command-line tools.

<a id="couchbase-admin-tasks-failover-automatic"></a>

### Using Automatic Failover

Due to the potential for problems when using automated failover (see [Automated
failover
considerations](#couchbase-admin-tasks-failover-automatic-considerations) ),
there are a number of restrictions on the automatic failover functionality in
Couchbase Server:

 * Automatic failover is disabled by default. This prevents Couchbase Server from
   using automatic failover without the functionality being explicitly enabled.

 * Automatic failover is only available on clusters of at least three nodes.

 * Automatic failover will only fail over one node before requiring administrative
   interaction. This is to prevent a cascading failure from taking the cluster
   completely out of operation.

 * There is a minimum 30 second delay before a node will be failed over. This can
   be raised, but the software is hard coded to perform multiple "pings" of a node
   that is perceived down. This is to prevent a slow node or flaky network
   connection from being failed-over inappropriately.

 * If two or more nodes go down at the same time within the specified delay period,
   the automatic failover system will not failover any nodes.

If there are any node failures, an email can be configured to be sent out both
when an automatic failover occurs, and when it doesn't.

To configure automatic failover through the Administration Web Console, see
[Auto-Failover Settings](#couchbase-admin-web-console-settings-autofailover).
For information on using the REST API, see [Retrieve Auto-Failover
Settings](#restapi-get-autofailover-settings).

Once an automatic failover has occurred, the Couchbase Cluster is relying on
replicas to serve data. A rebalance should be initiated to return your cluster
to proper operational state. For more information, see [Handling a Failover
Situation](#couchbase-admin-tasks-failover-handling).

<a id="couchbase-admin-tasks-failover-automatic-reset"></a>

### Resetting the Automatic failover counter

After a node has been automatically failed over, an internal counter is used to
identify how many nodes have been failed over. This counter is used to prevent
the automatic failover system from failing over additional nodes until the issue
that caused the failover has been identified and rectified.

To re-enable automatic failover, the administrator must reset the counter
manually.

Resetting the automatic failover counter should only be performed after
restoring the cluster to a healthy and balanced state.

You can reset the counter using the REST API:


```
shell> curl -i -u cluster-username:cluster-password \
    http://localhost:8091/settings/autoFailover/resetCount
```

More information on using the REST API for this operation can be found in
[Resetting Auto-Failovers](#restapi-reset-autofailover).

<a id="couchbase-admin-tasks-failover-manual"></a>

### Initiating a Node Failover

In the event of a problem where you need to remove a node from the cluster due
to hardware or system failure, you need to mark the node as failed over. This
causes Couchbase Server to activate one of the available replicas for the
buckets in the cluster.

Before marking a node for failover you should read [Node
Failover](#couchbase-admin-tasks-failover). You should not use failover to
remove a node from the cluster for administration or upgrade. This is because
initiating a failover activates the replicas for a bucket, reducing the
available replicas with the potential for data loss if additional failovers
occur.

You can explicitly mark a node as failed over using a number of different
methods:

 * **Using the Web Console**

   Go to the `Management -> Server Nodes` section of the Administration Web
   Console. Find the node that you want to failover, and click the `Fail Over`
   button. You can only failover nodes that the cluster has identified as being
   'Down'.

   You will be presented with a warning. Click `Fail Over` to finish marking the
   node as failed over. Click `Cancel` if you want to cancel the operation.

 * **Using the Command-line**

   You can failover one or more nodes using the `failover` command to the
   `couchbase-cli` command. To failover the node, you must specify the IP address
   (and port, if not the standard port) of the node you want to failover. For
   example:

    ```
    shell> couchbase-cli failover --cluster=localhost:8091\
        -u cluster-username -p cluster-password\
        --server-failover=192.168.0.72:8091
    ```

   This immediately marks the node as failed over.

Once the node has been marked as failed over you must handle the failover
situation and get your cluster back into it's configured operation state. For
more information, see [Handling a Failover
Situation](#couchbase-admin-tasks-failover-handling).

<a id="couchbase-admin-tasks-failover-handling"></a>

### Handling a Failover Situation

Whether a node has been failed over manually or automatically, the health of
your Couchbase Server cluster has been reduced. Once a node is failed over:

 * The number of available replicas for each bucket in your cluster will be reduced
   by one.

 * Replicas for the vBuckets handled by the failover node will be enabled on the
   other nodes in the cluster.

 * Remaining nodes will be required to handled all future updates to the stored
   data.

Once a node has been failed over, you should perform a rebalance operation. The
rebalance operation will:

 * Redistribute and rebalance the stored data across the remaining nodes within the
   cluster.

 * Recreate replica vBuckets for all buckets within the cluster.

 * Return your cluster to it's configured operational state.

You may decide to optionally add one or more new nodes to the cluster after a
failover to return the cluster to the same, or higher, node count than before
the failover occurred. For more information on adding new nodes, and performing
the rebalance operation, see [Performing a
Rebalance](#couchbase-admin-tasks-addremove-rebalance).

<a id="couchbase-admin-tasks-failover-addback"></a>

### Adding Back a Failed Node

You can add a failed node back to the cluster if you have identified and fixed
the issue that originally made the node unavailable and suitable for being
marked as failed over.

When a node is marked as failed over, no changes are made on the failed node.
The persisted data files on disk remain in place, however, the node will no
longer be synchronized with the rest of the cluster. You cannot add a failed
over node back to the cluster and re-synchronize. Instead, the node will be
added back and treated as a new node.

### Data Files Should be Copied and/or Deleted Before Rejoining Cluster

Before adding a node back to the cluster, it is best practice to either move or
delete the persisted data files before the node is added back to the cluster.

If you want to keep the files, you can copy or move the files to another
location (for example another disk, or EBS volume). During the node addition and
rebalance operation, the data files will be deleted, recreated and repopulated.

For more information on adding the node to the cluster and rebalancing, see
[Performing a Rebalance](#couchbase-admin-tasks-addremove-rebalance).

<a id="couchbase-backup-restore"></a>

## Backup and Restore with Couchbase

Backing up your data should be a regular process on your cluster to ensure that
you do not lose information in the event of a serious hardware or installation
failure.

Due to the active nature of Couchbase Server it is impossible to create a
complete in-time backup and snapshot of the entire cluster. Because data is
always being updated and modified, it would be impossible to take an accurate
snapshot.

For detailed information on the restore processes and options, see
[Restore](#couchbase-backup-restore-restore).

It is a best practice to backup and restore all nodes together to minimize any
inconsistencies in data. Couchbase is always per-item consistent, but does not
guarantee total cluster consistency or in-order persistence.

<a id="couchbase-backup-restore-backup-cbbackup"></a>

### Backing Up

You can take a backup of a running Couchbase node. The `cbbackup` copies the
data in the data files, but the backup process must be performed on each bucket
and on all nodes of a cluster to take a backup of that cluster. The command does
not backup all the data automatically.

The `cbbackup` script takes the following arguments:


```
cbbackup [bucket_path_name] [dest_dir_path]
```

The `cbbackup` tool is located within the standard Couchbase command-line
directory. See [Command-line Interface for
Administration](#couchbase-admin-cmdline).

Make sure that there is enough disk space to accommodate the backup. You will
need at least as much storage space as currently used by the node for storing
Couchbase data.

The user running the `cbbackup` command must have the correct permissions to
read/write to the files being backed up, and run the necessary additional
commands that are executed during the process.

Recommended best practice is to run the command as the `couchbase` user, as this
is the default owner of the files when Couchbase Server is installed.

The `cbbackup` script will also perform a `vacuum` of the database files to
defragment them which provides faster startup times. Depending on the amount of
data, this script can take an extended amount of time to run. It is a best
practice to make sure that your connection to the server running the script is
not broken.

 * **Linux**

    ```
    shell> cbbackup /opt/couchbase/var/lib/couchbase/data/default-data/default /backups/2010-12-22/
    ```

   Backup the configuration file located at:
   `/opt/couchbase/var/lib/couchbase/config/config.dat`

 * **Windows**

    1. Start a `powershell` session.

    1. Set the execution policy for the session:

        ```
        shell> set-executionpolicy remotesigned
        ```

    1. Run the backup

        ```
        shell> cbbackup "C:\Program Files\Couchbase\Server\var\lib\couchbase\data\default-data\default" \
             "C:/backup/2010-12-22/"
        ```

    1. Copy the configuration file `config.dat` file located at `C:\Program
       Files\Couchbase\Server\var\lib\couchbase\config\config.dat`.

<a id="couchbase-backup-restore-restore"></a>

### Restore

When restoring a backup, you have to select the appropriate restore sequence
based on the type of restore you are performing. There are a number of methods
of restoring your cluster:

 * Restoring a cluster to a previous state, to the same cluster

   This method should be used when you are restoring information to an identical
   cluster, or directly back to the cluster form which the backup was made. The
   cluster will need to be identically configured, with the same number of nodes
   and identical IP addresses to the cluster at the point when it was backed up.

   For advice on using this method, see [Restoring to the same
   cluster](#couchbase-backup-restore-prevstate-same).

 * Restoring a cluster to a previous state, to a different cluster

   If your cluster environment has changed in any way for example changes to the
   hardware or underlying configuration, for example disk layout or IP addresses,
   then you should use this method. When using Couchbase Server within a virtual or
   cloud environment, the IP address and/or size configuration is likely to have
   changed considerably.

   For advice on using this method, see [Restoring to a different
   cluster](#couchbase-backup-restore-prevstate-different).

 * Restoring a cluster to a different configuration

   If you want to restore data to a cluster with a different configuration, or in
   the event of a corruption of your existing cluster data, then you can use the
   `cbrestore` tool. This natively restores data back into a new cluster and new
   configuration.

   For advice on using this method, see [Restoring using cbrestore
   tool](#couchbase-backup-restore-cbrestore).

Make sure that any restoration of files also sets the proper ownership of those
files to the couchbase user

<a id="couchbase-backup-restore-prevstate-same"></a>

### Restoring to the same cluster

To restore the information to the same cluster, with the same configuration, you
must shutdown your entire cluster while you restore the data, and then restart
the cluster again. You are replacing the entire cluster data and configuration
with the backed up version of the data files, and then re-starting the cluster
with the saved version of the cluster files.

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
    [Startup and Shutdown of Couchbase Server](#couchbase-admin-basics-running).

 1. On each node, restore the database and configuration file ( `config.dat` ) from
    your backup copies for each node.

 1. Restart the service on each node. For more information, see [Startup and
    Shutdown of Couchbase Server](#couchbase-admin-basics-running).

<a id="couchbase-backup-restore-prevstate-different"></a>

### Restoring to a different cluster

To restore the data to a different cluster you take a backup of the data, and
recreate the bucket configuration on a new cluster. This enables Couchbase
Server to load the data into the new cluster and repopulate the database with
the backed up data. You cannot change the topology or number of nodes within the
cluster using this method, but you can modify the physical characteristics of
each node, including the hardware configuration or IP addresses.

You can use this feature to migrate an entire cluster into new set of machines.
This is particularly useful when:

 * In cloud environments, where the IP addresses of nodes will have changed

 * Hardware configuration, such as RAM size, disk hardware or disk configuration
   and/or environment has changed.

 * To create dev/test clusters with the same data as the production cluster

To restore a cluster using this method, the following must be true:

 * You have a backup of each of the buckets in your cluster made using the
   `cbbackup` command.

 * The two clusters must have the same number of nodes.

 * The original cluster must be in a healthy state. This means that all nodes
   should be up and running and no rebalance or failover operation should be
   running.

 * It is a best practice for both clusters to be of the same OS and memory
   configuration.

The necessary steps for migrating data using this method are as follows:

 1. Take a backup of the data files of all nodes, using the above procedure.
    Alternately, shut down the couchbase-server on all nodes and copy the DB files.

 1. Install Couchbase Server (of at least version 1.7.1) on new nodes and cluster
    together. If using the web console to setup your cluster, a 'default' bucket
    will be created. Please delete this bucket before proceeding.

 1. Place the copies of the original files into the data directory on all the new
    nodes.

    You must ensure that each set of original data files gets placed onto one and
    only one node of the new cluster.

    Please ensure that you retain file ownership properties for those files which
    you placed on the destination node.

 1. Start couchbase-server on the new nodes

 1. Create a bucket with the same name and SASL configuration on the new nodes.

 1. After the bucket creation, each node will start loading items from the data
    files into memory.

 1. The cluster will be in a balanced state after warm up.

 1. Do not start a rebalance process while nodes are still warming up.

 1. If any nodes go down during the warmup, it is a best practice to restart all
    nodes together.

<a id="couchbase-backup-restore-cbrestore"></a>

### Restoring using cbrestore tool

There are a number of bugs in older versions of the `mbrestore` script. Anyone
using `mbrestore` should make sure to get the latest script to ensure proper
functionality. You can download the latest from
[here](https://github.com/couchbase/ep-engine/blob/master/management/cbrestore).
The latest version of the script will work with any previous versions of
Couchbase.

This is useful if:

 * You want to restore data into a cluster of a different size

 * You want to transfer/restore data into a different bucket

 * You have a broken or corrupted database file (usually from running out of space
   on a disk drive)

The `cbrestore` tool provides the following options:


```
cbrestore opts db_files (use -h for detailed help)

 -a --add Use add instead of set to avoid overwriting existing items
 -H --host Hostname of moxi server to connect to (default is 127.0.0.1)
 -p --port Port of moxi server to connect to (default is 11211)
 -t --threads Number of worker threads
 -u --username Username to authenticate with (this is the name of the bucket you are sending data into)
 -P --password Password to authenticate with (this is the password of the bucket you are sending data into)
```

Depending on the amount of data, this script can take an extended amount of time
to run. It is a best practice to make sure that your connection to the server
running the script is not broken, or that you are using something to let the
script run in the background (i.e. screen). For example, on Linux:


```
shell> cbrestore -a default default-0.mb default-1.mb default-2.mb default-3.mb
```

For better speed/efficiency you can run the command on multiple nodes, with each
node using a separate backup file. For example:


```
shell-node1> cbrestore -a -t 8 default default-0.mb
...
shell-node2> cbrestore -a -t 8 default default-1.mb
...
shell-node3> cbrestore -a -t 8 default default-2.mb
...
shell-node4> cbrestore -a -t 8 default default-3.mb
```

On Windows, ensure you correctly quote the filename arguments:


```
shell> cbrestore -a "C:/backup/2010-12-22/default" "C:/backup/2010-12-22/default-0.mb" \
    "C:/backup/2010-12-22/default-1.mb" "C:/backup/2010-12-22/default-2.mb" "C:/backup/2010-12-22/default-3.mb"
```

<a id="couchbase-admin-tasks-addremove"></a>

## Rebalancing (Expanding and Shrinking your Cluster)

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
   was requested. By copying over the existing and actively updated information

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
rebalance operation are provided in [Starting a
Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

Once the rebalance operation has been initiated, you should monitor the
rebalance operation and progress. You can find information on the statistics and
events to monitor using [Monitoring During
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

**Choosing when to shrink your cluster**

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

 * For information on adding nodes to your cluster, see [Adding a Node to a
   Cluster](#couchbase-admin-tasks-addremove-rebalance-add).

 * For information on adding nodes to your cluster, see [Removing a Node from a
   Cluster](#couchbase-admin-tasks-addremove-rebalance-remove).

 * In the event of a failover situation, a rebalance is required to bring the
   cluster back to a healthy state and re-enable the configured replicas. For more
   information on how to handle a failover situation, see [Node
   Failover](#couchbase-admin-tasks-failover)

The Couchbase Admin Web Console will indicate when the cluster requires a
rebalance because the structure of the cluster has been changed, either through
adding a node, removing a node, or due to a failover. The notification is
through the count of the number of servers that require a rebalance. You can see
a sample of this in the figure below, here shown on the `Manage Server Nodes`
page


![](images/admin-tasks-pending-rebalance.png)

To rebalance the cluster, you must initiate the rebalance process, detailed in
[Starting a Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

<a id="couchbase-admin-tasks-addremove-rebalance-add"></a>

### Adding a Node to a Cluster

There are a number of methods available for adding a node to a cluster. The
result is the same in each case, the node is marked to be added to the cluster,
but the node is not an active member until you have performed a rebalance
operation.

The methods are:

 * **Web Console — During Installation**

   When you are performing the Setup of a new Couchbase Server installation (see
   [Setting up Couchbase Server](#couchbase-getting-started-setup) ), you have the
   option of joining the new node to an existing cluster.

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
   ready to added to the cluster, and the servers pending rebalance count will be
   updated.

 * **Using the REST API**

   Using the REST API, you can add nodes to the cluster by providing the IP
   address, administrator username and password as part of the data payload. For
   example, using `curl` you could add a new node:

    ```
    shell> curl -u cluster-username:cluster-password\
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
    shell> couchbase-cli server-add \
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
    shell> couchbase-cli rebalance --cluster=127.0.0.1:8091 \
              -u Administrator -p Password \
              --server-remove=192.168.0.73
    ```

   For more information on the rebalance operation, see [Starting a
   Rebalance](#couchbase-admin-tasks-addremove-rebalance-rebalancing).

Removing a node does not stop the node from servicing requests. Instead, it only
marks the node ready for removal from the cluster. You must perform a rebalance
operation to complete the removal process.

<a id="couchbase-admin-tasks-addremove-rebalance-rebalancing"></a>

### Starting a Rebalance

Once you have configured the nodes that you want to add or remove from your
cluster, you must perform a rebalance operation. This moves the data around the
cluster so that the data is distributed across the entire cluster, removing and
adding data to different nodes in the process.

If Couchbase Server identifies that a rebalance is required, either through
explicit addition or removal, or through a failover, then the cluster is in a
`pending rebalance` state. This does not affect the cluster operation, it merely
indicates that a rebalance operation is required to move the cluster into its
configured state.

To initiate a rebalance operation:

 * **Using the Web Console**

   Within the `Manage Server Nodes` area of the Couchbase Administration Web
   Console, a cluster pending a rebalance operation will have enabled the
   `Rebalance` button.


   ![](images/admin-tasks-rebalance-starting-console.png)

   Clicking this button will immediately initiate a rebalance operation. You can
   monitor the progress of the rebalance operation through the web console. The
   progress of the movement of vBuckets is provided for each server by showing the
   movement progress as a percentage.


   ![](images/admin-tasks-rebalance-monitoring-console.png)

   You can monitor the progress by viewing the `Active vBuckets` statistics. This
   should show the number of active vBuckets on nodes being added increased and the
   number of vBucketson nodes being removed reducing.

   You can monitor this through the UI by selecting the `vBuckets` statistic in the
   `Monitoring` section of the Administration Web Console.


   ![](images/swap-rebalance-active-vbuckets.png)

   You can stop a rebalance operation at any time during the process by clicking
   the `Stop Rebalance` button. This only stops the rebalance operation, it does
   not cancel the operation. You should complete the rebalance operation.

 * **Using the Command-line**

   You can initiate a rebalance using the `couchbase-cli` and the `rebalance`
   command:

    ```
    shell> couchbase-cli rebalance -c 127.0.0.1:8091 -u Administrator -p Password
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
    shell> couchbase-cli rebalance -c 127.0.0.1:8091 \
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

The time taken for a rebalance operation is entirely dependent on the number of
servers, quantity of data, cluster performance and any existing cluster
activity, and is therefore impossible to accurately predict or estimate.

Throughout any rebalance operation you should monitor the process to ensure that
it completes successfully, see [Monitoring During
Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).

<a id="couchbase-admin-tasks-addremove-rebalance-swap"></a>

### Swap Rebalance

### 1.8.1

Swap Rebalance functionality was added to Couchbase Server 1.8.1.

Swap Rebalance is an automatic feature that optimizes the movement of data when
you are adding and removing the same number of nodes within the same operation.
The swap rebalance optimizes the rebalance operation by moving data directly
from the nodes being removed to the nodes being added. This is more efficient
than standard rebalancing which would normally move data across the entire
cluster.

Swap rebalance can be used during an upgrade process to upgrade all the nodes of
the cluster, without requiring data to be moved around the cluster degrading the
performance. For more information, [Upgrading to Couchbase Server 1.8.1 Using
Swap Rebalance](#couchbase-getting-started-upgrade-online-swap-1-8-1).

Swap rebalance only occurs if the following are true:

 * You are removing and adding the same number of nodes during rebalance. For
   example, if you have marked two nodes to be removed, and added another two nodes
   to the cluster.

 * There must be at least one Couchbase Server 1.8.1 node in the cluster.

Swap rebalance occurs automatically if the number of nodes being added and
removed are identical. There is no configuration or selection mechanism to force
a swap rebalance. If a swap rebalance cannot take place, then a normal rebalance
operation will be used instead.

When Couchbase Server 1.8.1 identifies that a rebalance is taking place and that
there are an even number of nodes being removed and added to the cluster, the
swap rebalance method is used to perform the rebalance operation.

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

The behavior of the cluster during a failover and rebalance operation with the
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

### Monitoring During Rebalance

### Monitoring a Rebalance

You should monitor the system during and immediately after a rebalance operation
until you are confident that replication has completed successfully.

There are essentially two stages to rebalancing:

 * **Backfilling**

   The first stage of replication involves reading all data for a given active
   vBucket and sending it to the server that is responsible for the replica. This
   can put increased load on the disk subsystem as well as network bandwidth but is
   not designed to impact any client activity.

   You can monitor the progress of this task by watching for ongoing TAP disk
   fetches and/or watching `cbstats tap`, or

    ```
    shell> cbstats <couchbase_node>:11210 tap | grep backfill
    ```

   Both will return a list of TAP backfill processes and whether they are still
   running (true) or done (false).

   When all have completed, you should see the Total Item count ( `curr_items_tot`
   ) be equal to the number of active items multiplied by replica count.

   If you are continuously adding data to the system, these values may not line up
   exactly at a given instant in time. However, you should be able to determine
   whether there is a significant difference between the two figures.

   Until this is completed, you should avoid using the "failover" functionality
   since that may result in loss of the data that has not yet been replicated.

 * **Draining**

   After the backfill process is completed, all nodes that had replicas
   materialized on them will then need to persist those items to disk. It is
   important to continue monitoring the disk write queue and memory usage until the
   rebalancing operation has been completed, to ensure that your cluster is able to
   keep up with the write load and required disk I/O.

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

<a id="couchbase-admin-tasks-quotas"></a>

## Changing Couchbase Quotas

Couchbase Server includes two key quotas for allocating RAM for storing data:

 * **Couchbase Server Quota**

   The Couchbase Server quota is the amount of RAM available on each server
   allocated to Couchbase for *all* buckets. You may want to change this value if
   you have increased the physical RAM in your server, or added new nodes with a
   higher RAM configuration in a cloud deployment.

   The Couchbase Server quota is initially set when you install the first node in
   your cluster. All nodes in the cluster use the same server quota configuration.
   The configuration value is set by configuring the RAM allocation for all nodes
   within the cluster.

   To change the Couchbase Server Quota, use the `couchbase-cli` command, using the
   `cluster-init` command and the `--cluster-init-ramsize` option. For example, to
   set the server RAM quota to 8GB:

    ```
    shell> couchbase-cli cluster-init -c 127.0.0.1 \
        -u Administrator -p Password \
        --cluster-init-ramsize=8192
    ```

   Setting the value on one node sets the RAM quota for all the configured nodes
   within the cluster.

 * **Bucket Quota**

   The bucket quota is the RAM allocated to an individual bucket from within the
   RAM allocated to the nodes in the cluster. The configuration is set on a per
   node basis; i.e. configuring a bucket with 100MB per node on an eight node
   cluster provides a total bucket size of 800MB.

   The easiest way to configure the Bucket Quota is through the Couchbase Web
   Console. For more details, see [Editing Couchbase
   Buckets](#couchbase-admin-web-console-data-buckets-createedit-editcb).

   The value can also be modified from the command-line using the `couchbase-cli`
   command:

    ```
    shell> /opt/couchbase/bin/couchbase-cli bucket-edit -c 127.0.0.1 \
        -u Administrator -p Password \
        --bucket=beer-sample --bucket-ramsize=200
    ```

<a id="couchbase-admin-web-console"></a>
