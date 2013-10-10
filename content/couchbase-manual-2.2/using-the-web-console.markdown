<a id="couchbase-admin-web-console"></a>
# Using the Web Console

The Couchbase Web Console is the main tool for managing your Couchbase
installation. The Web Console provides the following tabs:

 * `Cluster Overview` : a quick guide to the status of your Couchbase cluster.

   For more information, read [Viewing Cluster
   Summary](#couchbase-admin-web-console-cluster-overview).

 * `Data Buckets` : view and update data bucket settings. You can create new
   buckets, edit existing settings, and see detailed statistics on the bucket.

   See [Viewing Data Buckets](#couchbase-admin-web-console-data-buckets).

 * `Server Nodes` : shows your active nodes, their configuration and activity.
   Under this tab you can also fail over nodes and remove them from your cluster,
   view server-specific performance, and monitor cluster statistics.

   Read [Viewing Server Nodes](#couchbase-admin-web-console-server-nodes).

 * `Views` : is were you can create and manage your views functions for indexing
   and querying data. Here you can also preview results from views.

   See [Using the Views Editor](#couchbase-views-editor) for the views editor in
   Web Console. For more information on views in general, see [Views and
   Indexes](#couchbase-views).

 * `Documents` : you can be create and edit documents under this tab. This enables
   you to view and modify documents that have been stored in a data bucket and can
   be useful when you work with views.

   See [Using the Document Editor](#couchbase-admin-web-console-documents).

 * `Log` : displays errors and problems.

   See [Log](#couchbase-admin-web-console-log) for more information.

 * `Settings` : under this tab you can configure the console and cluster settings.

   See [Settings](#couchbase-admin-web-console-settings) for more information.

In addition to these sections of the Couchbase Web Console, there are additional
systems within the web console, including:

 * `Update Notifications`

   Update notifications indicates when there is an update available for the
   installed Couchbase Server. See [Updating
   Notifications](#couchbase-admin-web-console-update-notifications) for more
   information on this feature.

 * `Warnings and Alerts`

   Warnings and alerts in Web Console will notify you when there is an issue that
   needs to be addressed within your cluster. The warnings and alerts can be
   configured through [Settings](#couchbase-admin-web-console-settings).

   For more information on the warnings and alerts, see [Warnings and
   Alerts](#couchbase-admin-web-console-alerting).

<a id="couchbase-admin-web-console-cluster-overview"></a>

## Viewing Cluster Summary

`Cluster Overview` is the home page for the Couchbase Web Console. The page
provides an overview of your cluster health, including RAM and disk usage and
activity.


![](images/web-console-cluster-overview.png)

[[[The page is divided into
`Cluster`](#couchbase-admin-web-console-cluster-overview-cluster),
`Buckets`](#couchbase-admin-web-console-cluster-overview-buckets), and
`Servers`](#couchbase-admin-web-console-cluster-overview-servers) sections.

<a id="couchbase-admin-web-console-cluster-overview-cluster"></a>

### Viewing Cluster Overview

The Cluster section provides information on the RAM and disk usage information
for your cluster.


![](images/web-console-cluster-overview-cluster.png)

For the RAM information you are provided with a graphical representation of your
RAM situation, including:

 * `Total in Cluster`

   Total RAM configured within the cluster. This is the total amount of memory
   configured for all the servers within the cluster.

 * `Total Allocated`

   The amount of RAM allocated to data buckets within your cluster.

 * `Unallocated`

   The amount of RAM not allocated to data buckets within your cluster.

 * `In Use`

   The amount of memory across all buckets that is actually in use (i.e. data is
   actively being stored).

 * `Unused`

   The amount of memory that is unused (available) for storing data.

The `Disk Overview` section provides similar summary information for disk
storage space across your cluster.

 * `Total Cluster Storage`

   Total amount of disk storage available across your entire cluster for storing
   data.

 * `Usable Free Space`

   The amount of usable space for storing information on disk. This figure shows
   the amount of space available on the configured path after non-Couchbase files
   have been taken into account.

 * `Other Data`

   The quantity of disk space in use by data other than Couchbase information.

 * `In Use`

   The amount of disk space being used to actively store information on disk.

 * `Free`

   The free space available for storing objects on disk.

<a id="couchbase-admin-web-console-cluster-overview-buckets"></a>

### Viewing Buckets

The `Buckets` section provides two graphs showing the `Operations per second`
and `Disk fetches per second`.


![](images/web-console-cluster-overview-buckets.png)

The `Operations per second` provides information on the level of activity on the
cluster in terms of storing or retrieving objects from the data store.

The `Disk fetches per second` indicates how frequently Couchbase is having to go
to disk to retrieve information instead of using the information stored in RAM.

<a id="couchbase-admin-web-console-cluster-overview-servers"></a>

### Viewing Servers

The `Servers` section indicates overall server information for the cluster:


![](images/web-console-cluster-overview-servers.png)

 * `Active Servers` is the number of active servers within the current cluster
   configuration.

 * `Servers Failed Over` is the number of servers that have failed over due to an
   issue that should be investigated.

 * `Servers Down` shows the number of servers that are down and not-contactable.

 * `Servers Pending Rebalance` shows the number of servers that are currently
   waiting to be rebalanced after joining a cluster or being reactivated after
   failover.

<a id="couchbase-admin-web-console-server-nodes"></a>

## Viewing Server Nodes

In addition to monitoring buckets over all the nodes within the cluster,
Couchbase Server also includes support for monitoring the statistics for an
individual node.

The Server Nodes monitoring overview shows summary data for the Swap Usage, RAM
Usage, CPU Usage and Active Items across all the nodes in your cluster.


![](images/web-console-server-summary.png)

Clicking the triangle next to a server displays server node specific
information, including the IP address, OS, Couchbase version and Memory and Disk
allocation information.


![](images/web-console-server-node.png)

The detail display shows the following information:

 * **Node Information**

   The node information provides detail node configuration data:

    * `Server Name`

      The server IP address and port number used to communicated with this sever.

    * `Uptime`

      The uptime of the Couchbase Server process. This displays how long Couchbase
      Server has been running as a node, not the uptime for the server.

    * `OS`

      The operating system identifier, showing the platform, environment, operating
      system and operating system derivative.

    * `Version`

      The version number of the Couchbase Server installed and running on this node.

 * **Memory Cache**

   The Memory Cache section shows you the information about memory usage, both for
   Couchbase Server and for the server as a whole. You can use this to compare RAM
   usage within Couchbase Server to the overall available RAM. The specific details
   tracked are:

    * **Couchbase Quota**

      Shows the amount of RAM in the server allocated specifically to Couchbase
      Server.

    * **In Use**

      Shows the amount of RAM currently in use by stored data by Couchbase Server.

    * **Other Data**

      Shows the RAM used by other processes on the server.

    * **Free**

      Shows the amount of free RAM out of the total RAM available on the server.

    * **Total**

      Shows the total amount of free RAM on the server available for all processes.

 * **Disk Storage**

   This section displays the amount of disk storage available and configured for
   Couchbase. Information will be displayed for each configured disk.

    * **In Use**

      Shows the amount of disk space currently used to stored data for Couchbase
      Server.

    * **Other Data**

      Shows the disk space used by other files on the configured device, not
      controlled by Couchbase Server.

    * **Free**

      Shows the amount of free disk storage on the server out of the total disk space
      available.

    * **Total**

      Shows the total disk size for the configured storage device.

Selecting a server from the list shows the server-specific version of the Bucket
Monitoring overview, showing server-specific performance information.


![](images/web-console-server-individual.png)

The graphs specific to the server are:

 * **swap usage**

   Amount of swap space in use on this server.

 * **free RAM**

   Amount of RAM available on this server.

 * **CPU utilization**

   Percentage of CPU utilized across all cores on the selected server.

 * **connection count**

   Number of connections to this server of all types for client, proxy, TAP
   requests and internal statistics.

By clicking on the blue triangle against an individual statistic within the
server monitoring display, you can optionally select to view the information for
a specific bucket-statistic on an individual server, instead of across the
entire cluster.


![](images/web-console-server-specific.png)

For more information on the data bucket statistics, see [Viewing Data
Buckets](#couchbase-admin-web-console-data-buckets).

<a id="couchbase-admin-web-console-server-states"></a>

### Understanding Server States

Couchbase Server nodes can be in a number of different states depending on their
current activity and availability. The displayed states are:

 * **Up**

   Host is up, replicating data between nodes and servicing requests from clients.

 * **Down**

   Host is down, not replicating data between nodes and not servicing requests from
   clients.


   ![](images/web-console-server-states-down.png)

 * **Pend**

   Host is up and currently filling RAM with data, but is not servicing requests
   from clients. Client access will be supported once the RAM has been pre-filled
   with information.


   ![](images/web-console-server-states-pend.png)

You can monitor the current server status using both the `Manage: Server Nodes`
and `Monitor: Server Nodes` screens within the Web Console.

<a id="couchbase-admin-web-console-data-buckets"></a>

## Viewing Data Buckets

Couchbase Server provides a range of statistics and settings through the `Data
Buckets` and `Server Nodes`. These show overview and detailed information so
that administrators can better understand the current state of individual nodes
and the cluster as a whole.

The `Data Buckets` page displays a list of all the configured buckets on your
system (of both Couchbase and memcached types). The page provides a quick
overview of your cluster health from the perspective of the configured buckets,
rather than whole cluster or individual servers.

The information is shown in the form of a table, as seen in the figure below.


![](images/web-console-data-buckets-overview.png)

The list of buckets are separated by the bucket type. For each bucket, the
following information is provided in each column:

 * `Bucket name` is the given name for the bucket. Clicking on the bucket name
   takes you to the individual bucket statistics page. For more information, see
   [Individual Bucket
   Monitoring](#couchbase-admin-web-console-data-buckets-individual).

 * `RAM Usage/Quota` shows the amount of RAM used (for active objects) against the
   configure bucket size.

 * `Disk Usage` shows the amount of disk space in use for active object data
   storage.

 * `Item Count` indicates the number of objects stored in the bucket.

 * `Ops/sec` shows the number of operations per second for this data bucket.

 * `Disk Fetches/sec` shows the number of operations required to fetch items from
   disk.

 * Clicking the `Bucket Name` opens the basic bucket information summary. For more
   information, see [Bucket
   Information](#couchbase-admin-web-console-data-buckets-info).

 * Clicking the `Documents` button will take you to a list of objects identified as
   parseable documents. See [Using the Document
   Editor](#couchbase-admin-web-console-documents) for more information.

 * The `Views` button allows you to create and manage views on your stored objects.
   For more information, see [Using the Views Editor](#couchbase-views-editor).

To create a new data bucket, click the `Create New Data Bucket`. See [Creating
and Editing Data Buckets](#couchbase-admin-web-console-data-buckets-createedit)
for details on creating new data buckets.

<a id="couchbase-admin-web-console-data-buckets-createedit"></a>

### Creating and Editing Data Buckets

When creating a new data bucket, or editing an existing one, you will be
presented with the bucket configuration screen. From here you can set the memory
size, access control and other settings, depending on whether you are editing or
creating a new bucket, and the bucket type.

<a id="couchbase-admin-web-console-data-buckets-createedit-create"></a>

### Creating a New Bucket

You can create a new bucket in Couchbase Web Console under the Data Buckets tab.

 1. Click Data Buckets | Create New Data Bucket. You see the `Create Bucket` panel,
    as follows:


    ![](images/mrw_create_bucket.png)

 1. Select a name for the new bucket. The bucket name can only contain characters in
    range A-Z, a-z, 0-9 as well as underscore, period, dash and percent symbols.

    ### Default Bucket Should Only for Testing

    Any default bucket you initially set up with Couchbase Server should not be used
    for storing live application data; you should create a named bucket specifically
    for your application. The default bucket you create when you first install
    Couchbase Server should only be used for testing.

 1. Select a Bucket Type, either `Memcached` or `Couchbase`. See [Data
    Storage](#couchbase-introduction-architecture-buckets) for more information. The
    options that appear in this panel will differ based on your a bucket type you
    select.

    For `Couchbase` bucket type:

     * **Memory Size**

       The amount of available RAM on this server which should be allocated to the
       bucket. Note that the allocation is the amount of memory that will be allocated
       for this bucket on each node, not the total size of the bucket across all nodes.

     * **Replicas**

       For Couchbase buckets you can enable data replication so that the data is copied
       to other nodes in a cluster. You can configure up to three replicas per bucket.
       If you set this to one, you need to have a minimum of two nodes in your cluster
       and so forth. If a node in a cluster fails, after you perform failover, the
       replicated data will be made available on a functioning node. This provides
       continuous cluster operations in spite of machine failure. For more information,
       see [Failing Over Nodes](#couchbase-admin-tasks-failover).

       You can disable replication by deselecting the `Enable` checkbox.

       You can disable replication by setting the number of replica copies to zero (0).

       To configure replicas, Select a number in `Number of replica (backup) copies`
       drop-down list.

       To enable replica indexes, Select the `Index replicas` checkbox. Couchbase
       Server can also create replicas of indexes. This ensures that indexes do not
       need to be rebuilt in the event of a node failure. This will increase network
       load as the index information is replicated along with the data.

     * **Disk Read-Write Concurrency**

       As of Couchbase Server 2.1, we support multiple readers and writers to persist
       data onto disk. For earlier versions of Couchbase Server, each server instance
       had only single disk reader and writer threads. By default this is set to three
       total threads per data bucket, with two reader threads and one writer thread for
       the bucket.

       For now, leave this setting at the default. In the future, when you create new
       data buckets you can update this setting. For general information about disk
       storage, see [Disk Storage](#couchbase-introduction-architecture-diskstorage).
       For information on multi- readers and writers, see [Using Multi- Readers and
       Writers](#couchbase-admin-tasks-mrw).

     * **Flush**

       To enable the operation for a bucket, click the `Enable` checkbox. Enable or
       disable support for the Flush command, which deletes all the data in an a
       bucket. The default is for the flush operation to be disabled.

    For `Memcached` bucket type:

     * **Memory Size**

       The bucket is configured with a per-node amount of memory. Total bucket memory
       will change as nodes are added/removed.

       For more information, see [RAM Sizing](#couchbase-bestpractice-sizing-ram).

       Changing the size of a memcached bucket will erase all the data in the bucket
       and recreate it, resulting in loss of all stored data for existing buckets.

     * **Auto-Compaction**

       Both data and index information stored on disk can become fragmented. Compaction
       rebuilds the stored data on index to reduce the fragmentation of the data. For
       more information on database and view compaction, see [Database and View
       Compaction](#couchbase-admin-tasks-compaction).

       You can opt to override the default auto compaction settings for this individual
       bucket. Default settings are configured through the `Settings` menu. For more
       information on setting the default autocompaction parameters, see [Enabling
       Auto-Compaction](#couchbase-admin-web-console-settings-autocompaction). If you
       override the default autocompaction settings, you can configure the same
       parameters, but the limits will affect only this bucket.

    For either bucket type provide these two settings in the Create Bucket panel:

     * `Access Control`

       The access control configures the port clients use to communicate with the data
       bucket, and whether the bucket requires a password.

       To use the TCP standard port (11211), the first bucket you create can use this
       port without requiring SASL authentication. For each subsequent bucket, you must
       specify the password to be used for SASL authentication, and client
       communication must be made using the binary protocol.

       To use a dedicated port, select the dedicate port radio button and enter the
       port number you want to use. Using a dedicated port supports both the text and
       binary client protocols, and does not require authentication.

     * **Flush**

       Enable or disable support for the Flush command, which deletes all the data in
       an a bucket. The default is for the flush operation to be disabled. To enable
       the operation for a bucket, click the `Enable` checkbox.

 1. Click Create.

    Creates the new bucket with bucket configuration.

<a id="couchbase-admin-web-console-data-buckets-createedit-editcb"></a>

### Editing Couchbase Buckets

You can edit a number of settings for an existing Couchbase bucket in Couchbase
Web Console:

 * `Access Control`, including the standard port/password or custom port settings.

 * `Memory Size` can be modified providing you have unallocated space within your
   Cluster configuration. You can reduce the amount of memory allocated to a bucket
   if that space is not already in use.

 * `Auto-Compaction` settings, including enabling the override of the default
   auto-compaction settings, and bucket-specific auto-compaction.

 * `Flush` support. You can enable or disable support for the Flush command.

The bucket name cannot be modified. To delete the configured bucket entirely,
click the `Delete` button.

<a id="couchbase-admin-web-console-data-buckets-createedit-editmc"></a>

### Editing Memcached Buckets

For Memcached buckets, you can modify the following settings when editing an
existing bucket:

 * `Access Control`, including the standard port/password or custom port settings.

 * `Memory Size` can be modified providing you have unallocated RAM quota within
   your Cluster configuration. You can reduce the amount of memory allocated to a
   bucket if that space is not already in use.

You can delete the bucket entirely by clicking the `Delete` button.

You can empty a Memcached bucket of all the cached information that it stores by
using the `Flush` button.

Using the `Flush` button removes all the objects stored in the Memcached bucket.
Using this button on active Memcached buckets may delete important information.

<a id="couchbase-admin-web-console-data-buckets-info"></a>

### Bucket Information

You can obtain basic information about the status of your data buckets by
clicking on the drop-down next to the bucket name under the `Data Buckets` page.
The bucket information shows memory size, access, and replica information for
the bucket, as shown in the figure below.


![](images/web-console-bucket-info.png)

You can edit the bucket information by clicking the `Edit` button within the
bucket information display.

<a id="couchbase-admin-web-console-monitoring"></a>

## Viewing Bucket and Cluster Statistics

Within the `Data Bucket` monitor display, information is shown by default for
the entire Couchbase Server cluster. The information is aggregated from all the
server nodes within the configured cluster for the selected bucket.

The following functionality is available through this display, and is common to
all the graphs and statistics display within the web console.

 * `Bucket Selection`

   The `Data Buckets` selection list allows you to select which of the buckets
   configured on your cluster is to be used as the basis for the graph display. The
   statistics shown are aggregated over the whole cluster for the selected bucket.

 * `Server Selection`

   The `Server Selection` option enables you to limit the display to an individual
   server or entire cluster. You can select an individual node, which displays the
   [Viewing Server Nodes](#couchbase-admin-web-console-server-nodes) for that node.
   Selecting `All Server Nodes` shows the [Viewing Data
   Buckets](#couchbase-admin-web-console-data-buckets) page.

 * `Interval Selection`

   The `Interval Selection` at the top of the main graph changes interval display
   for all graphs displayed on the page. For example, selecting `Minute` shows
   information for the last minute, continuously updating.

   As the selected interval increases, the amount of statistical data displayed
   will depend on how long your cluster has been running.

 * `Statistic Selection`

   All of the graphs within the display update simultaneously. Clicking on any of
   the smaller graphs will promote that graph to be displayed as the main graph for
   the page.

 * `Individual Server Selection`

   Clicking the blue triangle next to any of the smaller statistics graphs enables
   you to show the selected statistic individual for each server within the
   cluster, instead of aggregating the information for the entire cluster.

<a id="couchbase-admin-web-console-data-buckets-individual"></a>

### Individual Bucket Monitoring

Bucket monitoring within the Couchbase Web Console has been updated to show
additional detailed information. The following statistic groups are available
for Couchbase bucket types.

 * **Summary**

   The summary section provides a quick overview of the cluster activity. For more
   information, see [Bucket Monitoring — Summary
   Statistics](#couchbase-admin-web-console-data-buckets-summary).

 * **vBucket Resources**

   This section provides detailed information on the vBucket resources across the
   cluster, including the active, replica and pending operations. For more
   information, see [Monitoring vBucket
   Resources](#couchbase-admin-web-console-data-buckets-vbucket).

 * **Disk Queues**

   Disk queues show the activity on the backend disk storage used for persistence
   within a data bucket. The information displayed shows the active, replica and
   pending activity. For more information, see [Monitoring Disk
   Queues](#couchbase-admin-web-console-data-buckets-diskqueues).

 * **TAP Queues**

   The TAP queues section provides information on the activity within the TAP
   queues across replication, rebalancing and client activity. For more
   information, see [Monitoring TAP
   Queues](#couchbase-admin-web-console-data-buckets-tapqueues).

 * **XDCR Destination**

   The XDCR Destination section show you statistical information about the Cross
   Datacenter Replication (XDCR), if XDCR has been configured. For more information
   on XDCR, see [Cross Datacenter Replication (XDCR)](#couchbase-admin-tasks-xdcr).
   For more information on the available statistics, see [Monitoring Outgoing
   XDCR](#couchbase-admin-web-console-data-buckets-xdcr).

 * **View Stats**

   The View Stats section allows you to monitor the statistics for each production
   view configured within the bucket or system. For more information on the
   available statistics, see [Monitoring View
   Statistics](#couchbase-admin-web-console-data-buckets-views).

 * **Top Keys**

   This shows a list of the top 10 most actively used keys within the selected data
   bucket.

For Memcached bucket types, the Memcached statistic summary is provided. See
[Bucket Memcached Buckets](#couchbase-admin-web-console-data-buckets-memcached).

<a id="couchbase-admin-web-console-data-buckets-summary"></a>

### Bucket Monitoring — Summary Statistics

The summary section is designed to provide a quick overview of the cluster
activity. Each graph (or selected graph) shows information based on the
currently selected bucket.


![](images/web-console-server-stats-summary.png)

The following graph types are available:

 * `ops per second`

   The total number of operations per second on this bucket.

 * `cache miss ratio`

   Ratio of reads per second to this bucket which required a read from disk rather
   than RAM.

 * `creates per second`

   Number of new items created in this bucket per second.

 * `updates per second`

   Number of existing items updated in this bucket per second.

 * `XDCR ops per sec`

   Number of XDCR related operations per second for this bucket.

 * `disk reads per sec`

   Number of reads per second from disk for this bucket.

 * `temp OOM per sec`

   Number of temporary out of memory conditions per second.

 * `gets per second`

   Number of get operations per second.

 * `sets per second`

   Number of set operations per second.

 * `deletes per second`

   Number of delete operations per second.

 * `items`

   Number of items (documents) stored in the bucket.

 * `disk write queue`

   Size of the disk write queue.

 * `docs data size`

   Size of the stored document data.

 * `docs total disk size`

   Size of the persisted stored document data on disk.

 * `doc fragmentation %`

   Document fragmentation of persisted data as stored on disk.

 * `XDC replication queue`

   Size of the XDCR replication queue.

 * `total disk size`

   Total size of the information for this bucket as stored on disk, including
   persisted and view index data.

 * `views data size`

   Size of the view data information.

 * `views total disk size`

   Size of the view index information as stored on disk.

 * `views fragmentation %`

   Percentage of fragmentation for a given view index.

 * `view reads per second`

   Number of view reads per second.

 * `memory used`

   Amount of memory used for storing the information in this bucket.

 * `high water mark`

   High water mark for this bucket (based on the configured bucket RAM quota).

 * `low water mark`

   Low water mark for this bucket (based on the configured bucket RAM quota).

 * `disk update time`

   Time required to update data on disk.

<a id="couchbase-admin-web-console-data-buckets-vbucket"></a>

### Monitoring vBucket Resources

The vBucket statistics provide information for all vBucket types within the
cluster across three different states. Within the statistic display the table of
statistics is organized in four columns, showing the Active, Replica and Pending
states for each individual statistic. The final column provides the total value
for each statistic.


![](images/web-console-server-stats-vbucket.png)

The Active column displays the information for vBuckets within the Active state.
The Replica column displays the statistics for vBuckets within the Replica state
(i.e. currently being replicated). The Pending columns shows statistics for
vBuckets in the Pending state, i.e. while data is being exchanged during
rebalancing.

These states are shared across all the following statistics. For example, the
graph `new items per sec` within the `Active` state column displays the number
of new items per second created within the vBuckets that are in the active
state.

The individual statistics, one for each state, shown are:

 * `vBuckets`

   The number of vBuckets within the specified state.

 * `items`

   Number of items within the vBucket of the specified state.

 * `resident %`

   Percentage of items within the vBuckets of the specified state that are resident
   (in RAM).

 * `new items per sec.`

   Number of new items created in vBuckets within the specified state. Note that
   new items per second is not valid for the Pending state.

 * `ejections per second`

   Number of items ejected per second within the vBuckets of the specified state.

 * `user data in RAM`

   Size of user data within vBuckets of the specified state that are resident in
   RAM.

 * `metadata in RAM`

   Size of item metadata within the vBuckets of the specified state that are
   resident in RAM.

<a id="couchbase-admin-web-console-data-buckets-diskqueues"></a>

### Monitoring Disk Queues

The Disk Queues statistics section displays the information for data being
placed into the disk queue. Disk queues are used within Couchbase Server to
store the information written to RAM on disk for persistence. Information is
displayed for each of the disk queue states, Active, Replica and Pending.


![](images/web-console-server-stats-diskqueues.png)

The Active column displays the information for the Disk Queues within the Active
state. The Replica column displays the statistics for the Disk Queues within the
Replica state (i.e. currently being replicated). The Pending columns shows
statistics for the disk Queues in the Pending state, i.e. while data is being
exchanged during rebalancing.

These states are shared across all the following statistics. For example, the
graph `fill rate` within the `Replica` state column displays the number of items
being put into the replica disk queue for the selected bucket.

The displayed statistics are:

 * `items`

   The number of items waiting to be written to disk for this bucket for this
   state.

 * `fill rate`

   The number of items per second being added to the disk queue for the
   corresponding state.

 * `drain rate`

   Number of items actually written to disk from the disk queue for the
   corresponding state.

 * `average age`

   The average age of items (in seconds) within the disk queue for the specified
   state.

<a id="couchbase-admin-web-console-data-buckets-tapqueues"></a>

### Monitoring TAP Queues

The TAP queues statistics are designed to show information about the TAP queue
activity, both internally, between cluster nodes and clients. The statistics
information is therefore organized as a table with columns showing the
statistics for TAP queues used for replication, rebalancing and clients.


![](images/web-console-server-stats-tapqueues.png)

The statistics in this section are detailed below:

 * `TAP senders`

   Number of TAP queues in this bucket for internal (replica), rebalancing or
   client connections.

 * `items`

   Number of items in the corresponding TAP queue for this bucket.

 * `drain rate`

   Number of items per second being sent over the corresponding TAP queue
   connections to this bucket.

 * `back-off rate`

   Number of back-offs per second sent when sending data through the corresponding
   TAP connection to this bucket.

 * `backfill remaining`

   Number of items in the backfill queue for the corresponding TAP connection for
   this bucket.

 * `remaining on disk`

   Number of items still on disk that need to be loaded in order to service the TAP
   connection to this bucket.

<a id="couchbase-admin-web-console-data-buckets-memcached"></a>

### Bucket Memcached Buckets

For Memcached buckets, Web Console displays a separate group of statistics:


![](images/web-console-server-stats-memcached.png)

The Memcached statistics are:

 * `Operations per sec.`

   Total operations per second serviced by this bucket

 * `Hit Ratio %`

   Percentage of get requests served with data from this bucket

 * `Memory bytes used`

   Total amount of RAM used by this bucket

 * `Items count`

   Number of items stored in this bucket

 * `RAM evictions per sec.`

   Number of items per second evicted from this bucket

 * `Sets per sec.`

   Number of set operations serviced by this bucket

 * `Gets per sec.`

   Number of get operations serviced by this bucket

 * `Net. bytes TX per sec`

   Number of bytes per second sent from this bucket

 * `Net. bytes RX per sec.`

   Number of bytes per second sent into this bucket

 * `Get hits per sec.`

   Number of get operations per second for data that this bucket contains

 * `Delete hits per sec.`

   Number of delete operations per second for data that this bucket contains

 * `Incr hits per sec.`

   Number of increment operations per second for data that this bucket contains

 * `Decr hits per sec.`

   Number of decrement operations per second for data that this bucket contains

 * `Delete misses per sec.`

   Number of delete operations per second for data that this bucket does not
   contain

 * `Decr misses per sec.`

   Number of decr operations per second for data that this bucket does not contain

 * `Get Misses per sec.`

   Number of get operations per second for data that this bucket does not contain

 * `Incr misses per sec.`

   Number of increment operations per second for data that this bucket does not
   contain

 * `CAS hits per sec.`

   Number of CAS operations per second for data that this bucket contains

 * `CAS badval per sec.`

   Number of CAS operations per second using an incorrect CAS ID for data that this
   bucket contains

 * `CAS misses per sec.`

   Number of CAS operations per second for data that this bucket does not contain

<a id="couchbase-admin-web-console-data-buckets-xdcr"></a>

### Monitoring Outgoing XDCR

The Outgoing XDCR shows the XDCR operations that are supporting cross datacenter
replication from the current cluster to a destination cluster. For more
information on XDCR, see [Cross Datacenter Replication
(XDCR)](#couchbase-admin-tasks-xdcr).

You can monitor the current status for all active replications in the `Ongoing
Replications` section under the XDCR tab:


![](images/xdcr_ongoing.png)

The `Ongoing Replications` section shows the following information:

Column | Description                                                       
-------|-------------------------------------------------------------------
Bucket | The source bucket on the current cluster that is being replicated.
From   | Source cluster name.                                              
To     | Destination cluster name.                                         
Status | Current status of replications.                                   
When   | Indicates when replication occurs.                                

The `Status` column indicates the current state of the replication
configuration. Possible include:

 * **Starting Up**

   The replication process has just started, and the clusters are determining what
   data needs to be sent from the originating cluster to the destination cluster.

 * **Replicating**

   The bucket is currently being replicated and changes to the data stored on the
   originating cluster are being sent to the destination cluster.

 * **Failed**

   Replication to the destination cluster has failed. The destination cluster
   cannot be reached. The replication configuration may need to be deleted and
   recreated.

Under the `Data Buckets` tab you can click on a named Couchbase bucket and find
more statistics about replication for that bucket. Couchbase Web Console
displays statistics for the particular bucket; on this page you can find two
drop-down areas called in the `Outgoing XDCR` and `Incoming XDCR Operations`.
Both provides statistics about ongoing replication for the particular bucket.
Under the `Outgoing XDCR` panel if you have multiple replication streams you
will see statistics for each stream.

![outbound xdcr stats 2.2](images/outbound_xdcr_2.2.png)

The statistics shown are:

 * `outbound XDCR mutation`

   Number of changes in the queue waiting to be sent to the destination cluster.

 * `mutations checked`

   Number of document mutations checked on source cluster.

 * `mutations replicated`

   Number of document mutations replicated to the destination cluster.

 * `data replicated`

   Size of data replicated in bytes.

 * `active vb reps`

   Number of parallel, active vBucket replicators. Each vBucket has one replicator
   which can be active or waiting. By default you can only have 32 parallel active
   replicators at once per node. Once an active replicator finishes, it will pass a
   token to a waiting replicator.

 * `waiting vb reps`

   Number of vBucket replicators that are waiting for a token to replicate.

 * `secs in replicating`

   Total seconds elapsed for data replication for all vBuckets in a cluster.

 * `secs in checkpointing`

   Time working in seconds including wait time for replication.

 * `checkpoints issued`

   Total number of checkpoints issued in replication queue. By default active
   vBucket replicators issue a checkpoint every 30 minutes to keep track of
   replication progress.

 * `checkpoints failed`

   Number of checkpoints failed during replication. This can happen due to
   timeouts, due to network issues or if a destination cluster cannot persist
   quickly enough.

 * `mutations in queue`

   Number of document mutations waiting in replication queue.

 * `XDCR queue size`

   Amount of memory used by mutations waiting in replication queue. In bytes.

 * `mutation replication rate`

   Number of mutations replicated to destination cluster per second.

 * `data replication rate`

   Bytes replicated to destination per second.

 * `ms meta ops latency`

   Weighted average time for requesting document metadata. In milliseconds.

 * `mutations replicated optimistically`

   Total number of mutations replicated with optimistic XDCR.
 
 * `ms docs ops latency`

   Weighted average time for sending mutations to destination cluster. In
   milliseconds.

 * `percent completed`

   Percent of total mutations checked for metadata.

Be aware that if you use an earlier version of Couchbase Server, such as
Couchbase Server 2.0, only the first three statistics appear and have the labels
**changes queue, documents checked, and documents replicated** respectively. You
can also get XDCR statistics using the Couchbase REST API. All of the statistics
in Web Console are based on statistics via the REST API or values derived from
them. For more information including a full list of available statistics, see
[Getting XDCR Stats via REST](#couchbase-admin-restapi-xdcr-stats).

<a id="couchbase-admin-web-console-data-buckets-xdcr-recv"></a>

### Monitoring Incoming XDCR

The Incoming XDCR section shows the XDCR operations that are coming into to the
current cluster from a remote cluster. For more information on XDCR, see [Cross
Datacenter Replication (XDCR)](#couchbase-admin-tasks-xdcr).


![](images/inbound_xdcr_web_console.png)

The statistics shown are:

 * `metadata reads per sec.`

   Number of documents XDCR scans for metadata per second. XDCR uses this
   information for conflict resolution. See, [Behavior and
   Limitations](#couchbase-admin-tasks-xdcr-functionality).

 * `sets per sec.`

   Set operations per second for incoming XDCR data.

 * `deletes per sec.`

   Delete operations per second as a result of the incoming XDCR data stream.

 * `total ops per sec.`

   Total of all the operations per second.

<a id="couchbase-admin-web-console-data-buckets-views"></a>

### Monitoring View Statistics

The View statistics show information about individual design documents within
the selected bucket. One block of stats will be shown for each production-level
design document. For more information on Views, see [Views and
Indexes](#couchbase-views).


![](images/web-console-server-stats-views.png)

The statistics shown are:

 * `data size`

   Size of the data required for this design document.

 * `disk size`

   Size of the stored index as stored on disk.

 * `view reads per sec.`

   Number of read operations per second for this view.

<a id="couchbase-views-editor"></a>

## Using the Views Editor

The Views Editor is available within the Couchbase Web Console. You can access
the View Editor either by clicking the `Views` for a given data bucket within
the `Data Buckets` display, or by selecting the `Views` page from the main
navigation panel.


![](images/views-overview.png)

The individual elements of this interface are:

 * The pop-up, at the top-left, provides the selection of the data bucket where you
   are viewing or editing a view.

 * The `Create Development View` enables you to create a new view either within the
   current design document, or within a new document. See [Creating and Editing
   Views](#couchbase-views-editor-createedit).

 * You can switch between `Production Views` and `Development Views`. See
   [Development and Production Views](#couchbase-views-types) for more information.

 * The final section provides a list of the design documents, and within each
   document, each defined view.

   When viewing `Development Views`, you can perform the following actions:

    * `Compact` the view index with an associated design document. This will compact
      the view index and recover space used to store the view index on disk.

    * `Delete` a design document. This will delete all of the views defined within the
      design document.

    * `Add Spatial View` creates a new spatial view within the corresponding design
      document. See [Creating and Editing Views](#couchbase-views-editor-createedit).

    * `Add View` creates a new view within the corresponding design document. See
      [Creating and Editing Views](#couchbase-views-editor-createedit).

    * `Publish` your design document (and all of the defined views) as a production
      design document. See [Publishing Views](#couchbase-views-editor-publishing).

    * For each individual view listed:

       * `Edit`, or clicking the view name

         Opens the view editor for the current view name, see [Creating and Editing
         Views](#couchbase-views-editor-createedit).

       * `Delete`

         Deletes an individual view.

   When viewing `Production Views` you can perform the following operations on each
   design document:

    * `Compact` the view index with an associated design document. This will compact
      the view index and recover space used to store the view index on disk.

    * `Delete` a design document. This will delete all of the views defined within the
      design document.

    * `Copy to Dev` copies the view definition to the development area of the view
      editor. This enables you edit the view definition. Once you have finished making
      changes, using the `Publish` button will then overwrite the existing view
      definition.

    * For each individual view:

       * By clicking the view name, or the `Show` button, execute and examine the results
         of a production view. See [Getting View Results](#couchbase-views-editor-view)
         for more information.

<a id="couchbase-views-editor-createedit"></a>

### Creating and Editing Views

You can create a new design document and/or view by clicking the `Create
Development View` button within the `Views` section of the Web Console. If you
are creating a new design document and view you will be prompted to supply both
the design document and view name. To create or edit your documents using the
REST API, see [Design Document REST API](#couchbase-views-designdoc-api).

To create a new view as part of an existing design document, click the `Add
View` button against the corresponding design document.

View names must be specified using one or more UTF-8 characters. You cannot have
a blank view name. View names cannot have leading or trailing whitespace
characters (space, tab, newline, or carriage-return).

If you create a new view, or have selected a Development view, you can create
and edit the `map()` and `reduce()` functions. Within a development view, the
results shown for the view are executed either over a small subset of the full
document set (which is quicker and places less load on the system), or the full
data set.


![](images/views-editing.png)

The top portion of the interface provides navigation between the available
design documents and views.

The `Sample Document` section allows you to view a random document from the
database to help you write your view functions and so that you can compare the
document content with the generated view output. Clicking the `Preview a Random
Document` will randomly select a document from the database. Clicking `Edit
Document` will take you to the Views editor, see [Using the Document
Editor](#couchbase-admin-web-console-documents)

Documents stored in the database that are identified as Non-JSON may be
displayed as binary, or text-encoded binary, within the UI.

Document metadata is displayed in a separate box on the right hand side of the
associated document. This shows the metadata for the displayed document, as
supplied to the `map()` as the second argument to the function. For more
information on writing views and creating the `map()` and `reduce()` functions,
see [Writing Views](#couchbase-views-writing).

With the View Code section, you should enter the function that you want to use
for the `map()` and `reduce()` portions of the view. The map function is
required, the reduce function is optional. When creating a new view a basic
`map()` function will be provided. You can modify this function to output the
information in your view that you require.

Once you have edited your `map()` and `reduce()` functions, you must use the
`Save` button to save the view definition.

The design document will be validated before it is created or updated in the
system. The validation checks for valid JavaScript and for the use of valid
built-in reduce functions. Any validation failure is reported as an error.

You can also save the modified version of your view as a new view using the
`Save As...` button.

The lower section of the window will show you the list of documents that would
be generated by the view. You can use the `Show Results` to execute the view.

To execute a view and get a sample of the output generated by the view
operation, click the `Show Results` button. This will create the index and show
the view output within the table below. You can configure the different
parameters by clicking the arrow next to `Filter Results`. This shows the view
selection criteria, as seen in the figure below. For more information on
querying and selecting information from a view, see [Querying
Views](#couchbase-views-writing-querying).


![](images/views-filters.png)

Clicking on the `Filter Results` query string will open a new window containing
the raw, JSON formatted, version of the View results. To access the view results
using the REST API, see [Querying Using the REST
API](#couchbase-views-querying-rest-api).

By default, Views during the development stage are executed only over a subset
of the full document set. This is indicated by the `Development Time Subset`
button. You can execute the view over the full document set by selecting `Full
Cluster Data Set`. Because this executes the view in real-time on the data set,
the time required to build the view may be considerable. Progress for building
the view is shown at the top of the window.

If you have edited either the `map()` or `reduce()` portions of your view
definition, you *must* save the definition. The `Show Results` button will
remain greyed out until the view definition has been saved.

You can also filter the results and the output using the built-in filter system.
This filter provides similar options that are available to clients for filtering
results.

For more information on the filter options, see [Getting View
Results](#couchbase-views-editor-view).

<a id="couchbase-views-editor-publishing"></a>

### Publishing Views

Publishing a view moves the view definition from the Development view to a
Production View. Production views cannot be edited. The act of publishing a view
and moving the view from the development to the production view will overwrite a
view the same name on the production side. To edit a Production view, you copy
the view from production to development, edit the view definition, and then
publish the updated version of the view back to the production side.

<a id="couchbase-views-editor-view"></a>

### Getting View Results

Once a view has been published to be a production view, you can examine and
manipulate the results of the view from within the web console view interface.
This makes it easy to study the output of a view without using a suitable client
library to obtain the information.

To examine the output of a view, click icon next to the view name within the
view list. This will present you with a view similar to that shown in the figure
below.


![](images/views-detail.png)

The top portion of the interface provides navigation between the available
design documents and views.

The `Sample Document` section allows you to view a random document from the
database so that you can compare the document content with the generated view
output. Clicking the `Preview a Random Document` will randomly select a document
from the database. If you know the ID of a document that you want to examine,
enter the document ID in the box, and click the `Lookup Id` button to load the
specified document.

To examine the function that generate the view information, use the `View Code`
section of the display. This will show the configured map and reduce functions.

The lower portion of the window will show you the list of documents generated by
the view. You can use the `Show Results` to execute the view.

The `Filter Results` interface allows you to query and filter the view results
by selecting the sort order, key range, or document range, and view result
limits and offsets.

To specify the filter results, click on the pop-up triangle next to `Filter
Results`. You can delete existing filters, and add new filters using the
embedded selection windows. Click `Show Results` when you have finished
selecting filter values. The filter values you specify are identical to those
available when querying from a standard client library. For more information,
see [Querying Views](#couchbase-views-writing-querying).

Due to the nature of range queries, a special character may be added to query
specifications when viewing document ranges. The character may not show up in
all web browsers, and may instead appear instead as an invisible, but
selectable, character. For more information on this character and usage, see
[Partial Selection and Key
Ranges](#couchbase-views-writing-querying-selection-partial).

<a id="couchbase-admin-web-console-documents"></a>

## Using the Document Editor

The Document Viewer and Editor enables you to browse, view, and edit individual
documents stored in Couchbase Server buckets. To get to the `Documents` editor,
click on the `Documents` button within the `Data Buckets` view. This will open a
list of available documents. You are shown only a selection of the available
documents, rather than all documents. The maximum size of editable documents is 2.5 KB.


![](images/web-console-document-list.png)

You can select a different Bucket by using the bucket selection popup on the
left. You can also page through the list of documents shown by using the
navigation arrows on the right. To jump to a specific document ID, enter the ID
in the box provided and click `Lookup Id`. To edit an existing document, click
the `Edit Document` button. To delete the document from the bucket, click
`Delete`.

To create a new document, click the `Create Document` button. This will open a
prompt to specify the document Id of the created document.


![](images/web-console-document-create.png)

Once the document Id has been set, you will be presented with the document
editor. The document editor will also be opened when you click on the document
ID within the document list. To edit the contents of the document, use the
textbox to modify the JSON of the stored document.


![](images/web-console-document-edit.png)

Within the document editor, you can click `Delete` to delete the current
document, `Save As...` will copy the currently displayed information and create
a new document with the document Id you specify. The `Save` will save the
current document and return you to the list of documents.

<a id="couchbase-admin-web-console-log"></a>

## Log

The `Log` section of the website allows you to view the built-in event log for
Couchbase Server so that you can identify activity and errors within your
Couchbase cluster.


![](images/web-console-server-log.png)

<a id="couchbase-admin-web-console-settings"></a>

## Settings

The `Settings` interface sets the global settings for your Couchbase Server
instance.

<a id="couchbase-admin-web-console-settings-updatenotifications"></a>

### Update Notification Settings

You can enable or disable Update Notifications by checking the `Enable software
update notifications` checkbox within the `Update Notifications` screen. Once
you have changed the option, you must click `Save` to record the change.

If update notifications are disabled then the Update Notifications screen will
only notify you of your currently installed version, and no alert will be
provided.


![](images/web-console-server-settings-updatenotifications.png)

For more information on how Update Notifications work, see [Updating
Notifications](#couchbase-admin-web-console-update-notifications).

<a id="couchbase-admin-web-console-settings-autofailover"></a>

### Enabling Auto-Failover Settings

The Auto-Failover settings enable auto-failover, and the timeout before the
auto-failover process is started when a cluster node failure is detected.

To enable Auto-Failover, check the `Enable auto-failover` checkbox. To set the
delay, in seconds, before auto-failover is started, enter the number of seconds
it the `Timeout` box. The default timeout is 30 seconds.


![](images/web-console-server-settings-autofailover.png)

For more information on Auto-Failover, see [Using Automatic
Failover](#couchbase-admin-tasks-failover-automatic).

<a id="couchbase-admin-web-console-settings-alerts"></a>

### Enabling Alerts

You can enable email alerts to be raised when a significant error occurs on your
Couchbase Server cluster. The email alert system works by sending email directly
to a configured SMTP server. Each alert email is send to the list of configured
email recipients.

The available settings are:

 * `Enable email alerts`

   If checked, email alerts will be raised on the specific error enabled within the
   `Available Alerts` section of the configuration.

 * `Host`

   The hostname for the SMTP server that will be used to send the email.

 * `Port`

   The TCP/IP port to be used to communicate with the SMTP server. The default is
   the standard SMTP port 25.

 * `Username`

   For email servers that require a username and password to send email, the
   username for authentication.

 * `Password`

   For email servers that require a username and password to send email, the
   password for authentication.

 * `Require TLS`

   Enable Transport Layer Security (TLS) when sending the email through the
   designated server.

 * `Sender email`

   The email address from which the email will be identified as being sent from.
   This email address should be one that is valid as a sender address for the SMTP
   server that you specify.

 * `Recipients`

   A list of the recipients of each alert message. You can specify more than one
   recipient by separating each address by a space, comma or semicolon.

   Clicking the `Test Mail` button will send a test email to confirm the settings
   and configuration of the email server and recipients.

 * `Available alerts`

   You can enable individual alert messages that can be sent by using the series of
   checkboxes. The supported alerts are:

    * `Node was auto-failovered`

      The sending node has been auto-failovered.

    * `Maximum number of auto-failovered nodes was reached`

      The auto-failover system will stop auto-failover when the maximum number of
      spare nodes available has been reached.

    * `Node wasn't auto-failovered as other nodes are down at the same time`

      Auto-failover does not take place if there are no spare nodes within the current
      cluster.

    * `Node wasn't auto-failovered as the cluster was too small (less than 3 nodes)`

      You cannot support auto-failover with less than 3 nodes.

    * `Node's IP address has changed unexpectedly`

      The IP address of the node has changed, which may indicate a network interface,
      operating system, or other network or system failure.

    * `Disk space used for persistent storage has reach at least 90% of capacity`

      The disk device configured for storage of persistent data is nearing full
      capacity.

    * `Metadata overhead is more than 50%`

      The amount of data required to store the metadata information for your dataset
      is now greater than 50% of the available RAM.

    * `Bucket memory on a node is entirely used for metadata`

      All the available RAM on a node is being used to store the metadata for the
      objects stored. This means that there is no memory available for caching
      values,. With no memory left for storing metadata, further requests to store
      data will also fail.

    * `Writing data to disk for a specific bucket has failed`

      The disk or device used for persisting data has failed to store persistent data
      for a bucket.


![](images/web-console-server-settings-alerts.png)

For more information on Auto-Failover, see [Using Automatic
Failover](#couchbase-admin-tasks-failover-automatic).

<a id="couchbase-admin-web-console-settings-autocompaction"></a>

### Enabling Auto-Compaction

The `Auto-Compaction` tab configures the default auto-compaction settings for
all the databases. These can be overridden using per-bucket settings available
within [Creating and Editing Data
Buckets](#couchbase-admin-web-console-data-buckets-createedit). For 
information about changing these settings with the REST API, see 
[Using the REST API, Setting Auto-Compaction](couchbase-admin-rest-auto-compaction).

As of Couchbase Server 2.2+ you can provide a purge interval to remove the key and metadata 
for items that have been deleted or are expired. This is known as 'tombstone purging'. 
For background information, see [Introduction, Tombstone Purging](#couchbase-introduction-tombstone-purge).

![](images/purge_interval2.2.png)

The settings tab sets the following default parameters:

 * `Database Fragmentation`

   If checked, you must specify either the percentage of fragmentation at which
   database compaction will be triggered, or the database size at which compaction
   will be triggered. You can also configure both trigger parameters.

 * `View Fragmentation`

   If checked, you must specify either the percentage of fragmentation at which
   database compaction will be triggered, or the view size at which compaction will
   be triggered. You can also configure both trigger parameters.

 * `Time Period`

   If checked, you must specify the start hour and minute, and end hour and minute
   of the time period when compaction is allowed to occur.

 * `Abort if run time exceeds the above period`

   If checked, if database compaction is running when the configured time period
   ends, the compaction process will be terminated.

 * `Process Database and View compaction in parallel`

   If enabled, database and view compaction will be executed simultaneously,
   implying a heavier processing and disk I/O load during the compaction process.

 * `Metadata Purge Interval`

   Defaults to three days. Tombstones are records of expired or deleted items and they include the key and metadata. Tombstones are used in Couchbase Server to provide eventual consistency of data between clusters.
   
   The auto-compaction process waits this number of days before it permanently 
   deletes tombstones for expired or deleted items.  
   
   If you set this value too low, you may see
   more inconsistent results in views queries such as deleted items in a result
   set. You may also see inconsistent items in clusters with XDCR set up between
   the clusters. If you set this value too high, it will delay the server from
   reclaiming disk space.

   You can also change this setting with the REST API, see [Using REST, Setting Auto-Compaction](couchbase-admin-rest-auto-compaction).

For more information on compaction, see [Database and View
Compaction](#couchbase-admin-tasks-compaction). For information on how
auto-compaction operates, see [Auto-Compaction
Configuration](#couchbase-admin-tasks-compaction-autocompaction).

<a id="couchbase-admin-web-console-settings-samplebuckets"></a>

### Installing Sample Buckets

The `Sample Buckets` tab enables you to install the sample bucket data if the
data has not already been loaded in the system. For more information on the
sample data available, see [Couchbase Sample Buckets](#couchbase-sampledata).


![](images/web-console-server-settings-sample.png)

If the sample bucket data was not loaded during setup, select the sample buckets
that you want to load using the checkboxes, and click the `Create` button.

If the sample bucket data has already been loaded, it will be listed under the
`Installed Samples` section of the page.

<a id="couchbase-admin-web-console-update-notifications"></a>

## Updating Notifications

During installation you can select to enable the Update Notification function.
Update notifications allow a client accessing the Couchbase Web Console to
determine whether a newer version of Couchbase Server is available for download.

If you select the `Update Notifications` option, the Web Console will
communicate with Couchbase servers to confirm the version number of your
Couchbase installation. During this process, the client submits the following
information to the Couchbase server:

 * The current version of your Couchbase Server installation. When a new version of
   Couchbase Server becomes available, you will be provided with notification of
   the new version and information on where you can download the new version.

 * Basic information about the size and configuration of your Couchbase cluster.
   This information will be used to help us prioritize our development efforts.

You can enable/disable software update notifications

The process occurs within the browser accessing the web console, not within the
server itself, and no further configuration or internet access is required on
the server to enable this functionality. Providing the client accessing the
Couchbase server console has internet access, the information can be
communicated to the Couchbase servers.

The update notification process the information anonymously, and the data cannot
be tracked. The information is only used to provide you with update notification
and to provide information that will help us improve the future development
process for Couchbase Server and related products.

If the browser or computer that you are using to connect to your Couchbase
Server web console does not have Internet access, the update notification system
will not work.

**Notifications**

If an update notification is available, the counter within the button display
within the Couchbase Console will be displayed with the number of available
updates.

**Viewing Available Updates**

To view the available updates, click on the `Settings` link. This displays your
current version and update availability. From here you can be taken to the
download location to obtain the updated release package.

<a id="couchbase-admin-web-console-alerting"></a>

## Warnings and Alerts

A new alerting systems has been built into the Couchbase Web Console. This is
sued to highlight specific issues and problems that you should be aware of and
may need to check to ensure the health of your Couchbase cluster.

Alerts are provided as a popup within the web console. A sample of the IP
address popup is shown below:


![](images/warning-notification.png)

The following errors and alerts are supported:

 * **IP Address Changes**

   If the IP address of a Couchbase Server in your cluster changes, you will be
   warned that the address is no longer available. You should check the IP address
   on the server, and update your clients or server configuration.

 * **OOM (Hard)**

   Indicates if the bucket memory on a node is entirely used for metadata.

 * **Commit Failure**

   Indicates that writing data to disk for a specific bucket has failed.

 * **Metadata Overhead**

   Indicates that a bucket is now using more than 50% of the allocated RAM for
   storing metadata and keys, reducing the amount of RAM available for data values.

 * **Disk Usage**

   Indicates that the available disk space used for persistent storage has reached
   at least 90% of capacity.

<a id="couchbase-admin-cmdline"></a>
