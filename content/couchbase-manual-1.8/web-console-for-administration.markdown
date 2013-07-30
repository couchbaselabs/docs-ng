# Web Console for Administration

The Couchbase Web Console is the main administration method for managing your
Couchbase installation. The Web Console provides the following functionality:

 * `Cluster Overview` provides a quick guide to the status of your Couchbase
   cluster.

   For more information, read [Cluster
   Overview](#couchbase-admin-web-console-cluster-overview).

 * `Data Buckets` provides access to your data bucket configuration, including
   creating new buckets, editing existing configurations, and provides detailed
   analysis and statistics on the bucket activity.

   See [Data Buckets](#couchbase-admin-web-console-data-buckets).

 * `Server Nodes` details your active nodes and their configuration and activity.
   You can also fail over nodes and remove them from your cluster, and view
   server-specific performance and monitoring statistics.

   Read [Server Nodes](#couchbase-admin-web-console-server-nodes).

 * `Log` access allows you to view errors and problems.

   See [Log](#couchbase-admin-web-console-log) for more information.

 * `Settings` configures the console and cluster settings.

   See [Settings](#couchbase-admin-web-console-settings) for more information.

In addition to the navigable sections of the Couchbase Web Console, there are
additional systems within the web console, including:

 * `Update Notifications`

   Update notifications warn you when there is an update available for the
   installed Couchbase Server. See [Update
   Notifications](#couchbase-admin-web-console-update-notifications) for more
   information on this feature.

 * `Warnings and Alerts`

   The warnings and alerts system will notify you through the web console where
   there is an issue that needs to be addressed within your cluster. The warnings
   and alerts can be configured through the
   [Settings](#couchbase-admin-web-console-settings).

   For more information on the warnings and alerts, see [Warnings and
   Alerts](#couchbase-admin-web-console-alerting).

<a id="couchbase-admin-web-console-cluster-overview"></a>

## Cluster Overview

The `Cluster Overview` page is the home page for the Couchbase Web Console. The
page is designed to give you a quick overview of your cluster health, including
RAM and disk usage and activity.


![](images/web-console-cluster-overview.png)

[[[The page is divided into
`Cluster`](#couchbase-admin-web-console-cluster-overview-cluster),
`Buckets`](#couchbase-admin-web-console-cluster-overview-buckets), and
`Servers`](#couchbase-admin-web-console-cluster-overview-servers) sections.

<a id="couchbase-admin-web-console-cluster-overview-cluster"></a>

### Cluster

The Cluster section provides information on the RAM and disk usage information
for your cluster.

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

### Buckets

The `Buckets` section provides two graphs showing the `Operations per second`
and `Disk fetches per second`.

The `Operations per second` provides information on the level of activity on the
cluster in terms of storing or retrieving objects from the data store.

The `Disk fetches per second` indicates how frequently Couchbase is having to go
to disk to retrieve information instead of using the information stored in RAM.

<a id="couchbase-admin-web-console-cluster-overview-servers"></a>

### Servers

The `Servers` section indicates overall server information for the cluster:

 * `Active Servers` is the number of active servers within the current cluster
   configuration.

 * `Servers Failed Over` is the number of servers that have failed over due to an
   issue that should be investigated.

 * `Servers Down` shows the number of servers that are down and not-contactable.

 * `Servers Pending Rebalance` shows the number of servers that are currently
   waiting to be rebalanced after joining a cluster or being reactivated after
   failover.

<a id="couchbase-admin-web-console-monitoring"></a>

## Web Console Statistics

Within the `Data Bucket` monitor display, information is shown by default for
the entire Couchbase Server cluster. The information is aggregated from all the
server nodes within the configured cluster for the selected bucket.

The following functionality is available through this display, and is common to
all the graphs and statistics display within the web console.

 * `Bucket Selection`

   The `Data Buckets` selection list allows you to select which of the buckets
   configured on your cluster is to be used as the basis for the graph display.

 * `Server Selection`

   The `Server Selection` option enables you to enable the display for an
   individual server instead of for the entire cluster. You can select an
   individual node, which displays the [Server
   Nodes](#couchbase-admin-web-console-server-nodes) for that node. Selecting `All
   Server Nodes` shows the [Data
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
   you to view the statistics on each individual server, instead of the default
   view which shows the entire cluster information for a given statistic.

<a id="couchbase-admin-web-console-data-buckets"></a>

## Data Buckets

Couchbase Server incorporates a range of statistics and user interface available
through the `Data Buckets` and `Server Nodes` that shows overview and detailed
information so that administrators can better understand the current state of
individual nodes and the cluster as a whole.

The `Data Buckets` page displayed a list of all the configured buckets on your
system (of both Membase and memcached types). The page provides a quick overview
of your cluster health from the perspective of the configured buckets, rather
than whole cluster or individual servers.

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

 * Clicking the `Information` button opens the basic bucket information summary.
   For more information, see [Bucket
   Information](#couchbase-admin-web-console-data-buckets-info).

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

### Creating a new Bucket

When creating a new bucket, you are presented with the `Create Bucket` dialog,
as shown in the figure below.


![](images/web-console-create-bucket.png)

 * `Bucket Name`

   The bucket name. The bucket name can only contain characters in range A-Z, a-z,
   0-9 as well as underscore, period, dash and percent symbols.

 * `Bucket Type`

   Specifies the type of the bucket to be created, either `Memcached` or `Membase`.

 * `Access Control`

   The access control configures the port your clients will use to communicate with
   the data bucket, and whether the bucket requires a password.

   To use the TCP standard port (11211), the first bucket you create can use this
   port without requiring SASL authentication. For each subsequent bucket, you must
   specify the password to be used for SASL authentication, and client
   communication must be made using the binary protocol.

   To use a dedicated port, select the dedicate port radio button and enter the
   port number you want to use. Using a dedicated port supports both the text and
   binary client protocols, and does not require authentication.

 * **Memory Size**

   This option specifies the amount of available RAM configured on this server
   which should be allocated to the bucket being configured. Note that the
   allocation is the amount of memory that will be allocated for this bucket on
   each node, not the total size of the bucket across all nodes.

 * **Replication**

   For Membase buckets you can enable replication to support multiple replicas of
   the default bucket across the servers within the cluster. You can configure up
   to three replicas. Each replica receives copies of all the documents that are
   managed by the bucket. If the host machine for a bucket fails, a replica can be
   promoted to take its place, providing continuous (high-availability) cluster
   operations in spite of machine failure.

   You can disable replication by setting the number of replica copies to zero (0).

Once you selected the options for the new bucket, you can click `Create` button
to create and activate the bucket within your cluster. You can cancel the bucket
creation using the `Cancel` button.

<a id="couchbase-admin-web-console-data-buckets-createedit-editcb"></a>

### Editing Couchbase Buckets

You can edit a limited number of settings for an existing Couchbase bucket:

 * `Access Control`, including the standard port/password or custom port settings.

 * `Memory Size` can be modified providing you have unallocated space within your
   Cluster configuration. You can reduce the amount of memory allocated to a bucket
   if that space is not already in use.

The bucket name cannot be modified.

To delete the configured bucket entirely, click the `Delete` button.

<a id="couchbase-admin-web-console-data-buckets-createedit-editmc"></a>

### Editing Memcached Buckets

For Memcached buckets, you can modify the following settings when editing an
existing bucket:

 * `Access Control`, including the standard port/password or custom port settings.

 * `Memory Size` can be modified providing you have unallocated space within your
   Cluster configuration. You can reduce the amount of memory allocated to a bucket
   if that space is not already in use.

You can delete the bucket entirely by clicking the `Delete` button.

You can empty a Memcached bucket of all the cached information that it stores by
using the `Flush` button.

Using the `Flush` button removes all the objects stored in the Memcached bucket.
Using this button on active Memcached buckets may delete important information.

<a id="couchbase-admin-web-console-data-buckets-info"></a>

### Bucket Information

You can obtain basic information about the status of your data buckets by
clicking on the *i* button within the `Data Buckets` page. The bucket
information shows memory size, access, and replica information for the bucket,
as shown in the figure below.


![](images/web-console-bucket-info.png)

You can edit the bucket information by clicking the `Edit` button within the
bucket information display.

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
   information, see [Bucket Monitoring — vBucket
   Resources](#couchbase-admin-web-console-data-buckets-vbucket).

 * **Disk Queues**

   Disk queues show the activity on the backend disk storage used for persistence
   within a data bucket. The information displayed shows the active, replica and
   pending activity. For more information, see [Bucket Monitoring — Disk
   Queues](#couchbase-admin-web-console-data-buckets-diskqueues).

 * **TAP Queues**

   The TAP queues section provides information on the activity within the TAP
   queues across replication, rebalancing and client activity. For more
   information, see [Bucket Monitoring — TAP
   Queues](#couchbase-admin-web-console-data-buckets-tapqueues).

 * **Top Keys**

   This shows a list of the top 10 most actively used keys within the selected data
   bucket.

For Memcached bucket types, the Memcached static summary is provided. See
[Bucket Monitoring — Memcached
Buckets](#couchbase-admin-web-console-data-buckets-memcached).

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

   Percentage of reads per second to this bucket which required a read from disk
   rather than RAM.

 * `creates per sec.`

   Number of new items created in this bucket per second.

 * `updates per sec.`

   Number of existing items updated in this bucket per second.

 * `disk reads per sec.`

   Number of reads per second from disk for this bucket.

 * `temp OOM per second`

   Number of temporary out-of-memory errors sent to clients for this bucket.

 * `gets per second`

   Number of get operations per second for this bucket.

 * `sets per second`

   Number of set/update operations per second for this bucket.

 * `CAS ops per sec.`

   Number of compare and swap operations per second for this bucket.

 * `deletes per sec.`

   Number of delete operations per second for this bucket.

 * `items`

   Item count for this bucket.

 * `disk write queue`

   Size of the disk write queue for this bucket.

 * `memory used`

   *Couchbase Server 1.8.1 or later*

   The memory used within this bucket.

 * `high water mark`

   *Couchbase Server 1.8.1 or later*

   The high water mark for memory usage.

 * `low water mark`

   *Couchbase Server 1.8.1 or later*

   The low water mark for memory usage.

 * `disk update time`

   *Couchbase Server 1.8.1 or later*

   The time taken to update the persisted informaiton on disk. This provides an
   indication of the fragmentation level of the SQLite data files used for
   persistence.

<a id="couchbase-admin-web-console-data-buckets-vbucket"></a>

### Bucket Monitoring — vBucket Resources

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

 * `% resident items`

   Percentage of items within the vBuckets of the specified state that are resident
   (in RAM).

 * `new items per second`

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

### Bucket Monitoring — Disk Queues

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

### Bucket Monitoring — TAP Queues

The TAP queues statistics are designed to show information about the TAP queue
activity, both internally, between cluster nodes and clients. The statistics
information is therefore organized as a table with columns showing the
statistics for TAP queues used for replication, rebalancing and clients.


![](images/web-console-server-stats-tapqueues.png)

The statistics in this section are detailed below:

 * `# tap senders`

   Number of TAP queues in this bucket for internal (replica), rebalancing or
   client connections.

 * `# items`

   Number of items in the corresponding TAP queue for this bucket.

 * `fill rate`

   Number of items per second being put into the corresponding TAP queue for this
   bucket.

 * `drain rate`

   Number of items per second being sent over the corresponding TAP queue
   connections to this bucket.

 * `back-off rate`

   Number of back-offs per second received when sending data through the
   corresponding TAP connection to this bucket.

 * `# backfill remaining`

   Number of items in the backfill queue for the corresponding TAP connection for
   this bucket.

 * `# remaining on disk`

   Number of items still on disk that need to be loaded to service the TAP
   connection to this bucket.

<a id="couchbase-admin-web-console-data-buckets-memcached"></a>

### Bucket Monitoring — Memcached Buckets

For Memcached buckets a separate suite of Memcached-specific statistics are
displayed.


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

 * `CAS ops per sec.`

   Number of CAS operations per second for data that this bucket contains

 * `CAS badval per sec.`

   Number of CAS operations per second using an incorrect CAS ID for data that this
   bucket contains

 * `CAS misses per sec.`

   Number of CAS operations per second for data that this bucket does not contain

<a id="couchbase-admin-web-console-server-nodes"></a>

## Server Nodes

In addition to monitoring buckets over all the nodes within the cluster,
Couchbase Server also includes support for monitoring the statistics for an
individual node.

The Server Nodes monitoring overview shows summary data for the Swap Usage, RAM
Usage, CPU Usage and Active Items across all the nodes in your cluster.


![](images/web-console-server-summary.png)

Clicking the server name provides server node specific information, including
the IP address, OS, Couchbase version and Memory and Disk allocation
information.

Selecting a server from the list shows a server-specific version of the Bucket
Monitoring overview, showing a combination of the server-specific performance
information, and the overall statistic information for the bucket across all
nodes.


![](images/web-console-server-individual.png)

The graphs specific to the server are:

 * **swap usage**

   Amount of swap space in use on this server.

 * **free memory**

   Amount of RAM available on this server.

 * **CPU utilization**

   Percentage of CPU utilized across all cores on the selected server.

 * **connection count**

   Number of connects to this server of all types for client, proxy, TAP requests
   and internal statistics.

You can select an individual bucket and server to view a statistic for using the
popup selections for the server and bucket, and clicking on the mini-graph for a
given statistic.


![](images/web-console-server-specific.png)

For more information on the data bucket statistics, see [Data
Buckets](#couchbase-admin-web-console-data-buckets).

<a id="couchbase-admin-web-console-server-states"></a>

## Couchbase Server States

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

For more information on how Update Notifications work, see [Update
Notifications](#couchbase-admin-web-console-update-notifications).

<a id="couchbase-admin-web-console-settings-autofailover"></a>

### Auto-Failover Settings

The Auto-Failover settings enable auto-failover, and the timeout before the
auto-failover process is started when a cluster node failure is detected.

To enable Auto-Failover, check the `Enable auto-failover` checkbox. To set the
delay, in seconds, before auto-failover is started, enter the number of seconds
it the `Timeout` box. The default timeout is 30 seconds.


![](images/web-console-server-settings-autofailover.png)

For more information on Auto-Failover, see [Using Automatic
Failover](#couchbase-admin-tasks-failover-automatic).

<a id="couchbase-admin-web-console-settings-alerts"></a>

### Alerts

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

 * `Sender email`

   The email address from which the email will be identified as being sent from.
   This email address should be one that is valid as a sender address for the SMTP
   server that you specify.

 * `Recipients`

   A list of the recipients of each alert message. You can specify more than one
   recipient by separating each address by a space, comma or semicolon.

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


![](images/web-console-server-settings-alerts.png)

For more information on Auto-Failover, see [Using Automatic
Failover](#couchbase-admin-tasks-failover-automatic).

<a id="couchbase-admin-web-console-log"></a>

## Log

The `Log` section of the website allows you to view the built-in event log for
Couchbase Server so that you can identify activity and errors within your
Couchbase cluster.


![](images/web-console-server-log.png)

The Couchbase Web Console displays the following information about each logged
event.

<a id="table-couchbase-admin-web-console-log"></a>

Name        | Description                                                                                           
------------|-------------------------------------------------------------------------------------------------------
Event       | Event that triggered the alert.                                                                       
Module      | Code Software module in which the event occurred and an internal alert code associated with the event.
Server Node | Server Node that raised the log entry.                                                                
Time        | Time and date when the event occurred.                                                                

<a id="couchbase-admin-web-console-log-diagreport"></a>

### Diagnostic Report

You can run a diagnostic report to get a snapshot of your deployment, including
version information, the state of the cluster, and log output. To generate a
diagnostic report: Under Monitor in the left-hand navigation menu, click `Log`.
Click `Generate Diagnostic Report` ( `http://hostname:8091/diag` ). The
Couchbase Web Console opens a new browser window and downloads the text of the
diagnostic report.

<a id="couchbase-admin-web-console-update-notifications"></a>

## Update Notifications

During installation you can select to enable the Update Notification function.
Update notifications allow a client accessing the Couchbase Web Console to
determine whether a newer version of Couchbase Server is available for download.

If you select the `Update Notifications` option, the Web Console will
communicate with Couchbase Servers to confirm the version number of your
Couchbase installation. During this process, the client submits the following
information to the Couchbase Server:

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
communicated to the Couchbase Servers.

The update notification process the information anonymously, and the data cannot
be tracked. The information is only used to provide you with update notification
and to provide information that will help us improve the future development
process for Couchbase Server and related products.

If the browser or computer that you are using to connect to your Couchbase
Server web console does not have Internet access, the update notification system
will not work.

<a id="couchbase-admin-web-console-update-notifications-list"></a>

### Notifications

If an update notification is available, the counter within the button display
within the Couchbase Console will be displayed with the number of available
updates.

<a id="couchbase-admin-web-console-update-notifications-available"></a>

### Viewing Available Updates

To view the available updates, click on the `Update Notifications` link. This
displays your current version and update availability. From here you can be
taken to the download location to obtain the updated release package.

<a id="couchbase-admin-web-console-alerting"></a>

## Warnings and Alerts

A new alerting systems has been built into the Couchbase Web Console. This is
sued to highlight specific issues and problems that you should be aware of and
may need to check to ensure the health of your Couchbase cluster. Alerts are
provided as a popup within the web console.

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
