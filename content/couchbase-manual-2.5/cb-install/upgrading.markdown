<a id="couchbase-getting-started-upgrade"></a>

# Upgrading

The following are the officially supported upgrade paths for Couchbase Server for
both online upgrades or offline upgrades:

 * Couchbase 1.8.1 to Couchbase 2.0 or higher
 * Couchbase 2.0.x to Couchbase 2.1 or higher
 * Couchbase 2.1.x to Couchbase 2.2 or higher
 * Couchbase 2.2 to Couchbase 2.5 or higher

<div class="notebox warning">
<p>Important</p>
<p>
If you plan to upgrade from 1.8.0 to 2.0 or higher, ensure that there is enough disk space
available for both your original Couchbase Server 1.8 data files and the new
format for the new Couchbase Server files. Provide approximately three (3) times 
the disk space for functionality such as indexing and compaction.
</p></div>

You cannot perform a direct upgrade from Couchbase Server 1.8.0 to a higher release of Couchbase Server. You
must first upgrade from Couchbase Server 1.8 or earlier to Couchbase Server
1.8.1 to provide data compatibility with a higher release of Couchbase Server. After 
performing this initial upgrade, upgrade to a higher release of Couchbase Server.

You can perform a cluster upgrade in two ways:

* Online upgrades
* Offline upgrades

## Online upgrades

   You can upgrade your cluster without taking your cluster down and so your
   application keeps running during the upgrade process. There are two ways you can
   perform this process: as a standard online upgrade, or as a swap rebalance. We
   highly recommend using a swap rebalance for online upgrade so that cluster
   capacity is always maintained. The standard online upgrade should only be used
   if swap rebalance is not possible.

   Using the standard online upgrade, you take down one or two nodes from a
   cluster, and rebalance so that remaining nodes handle incoming requests. This is
   an approach you use if you have enough remaining cluster capacity to handle the
   nodes you remove and upgrade. You will need to perform rebalance twice for every
   node you upgrade: the first time to move data onto remaining nodes, and a second
   time to move data onto the new nodes. For more information about a standard
   online upgrade, see [Standard online
   upgrades](#couchbase-getting-started-upgrade-online).

   Standard online upgrades may take a while because each node must be taken out of
   the cluster, upgraded to a current version, brought back into the cluster, and
   then rebalanced. However since you can upgrade the cluster without taking the
   cluster down, you may prefer this upgrade method. For instructions on online
   upgrades, see [Standard online
   upgrades](#couchbase-getting-started-upgrade-online).

   For swap rebalance, you add a node to the cluster then perform a swap rebalance
   to shift data from an old node to a new node. You might prefer this approach if
   you do not have enough cluster capacity to handle data when you remove an old
   node. This upgrade process is also much quicker than performing a standard
   online upgrade because you only need to rebalance each upgraded node once. For
   more information on swap rebalance, see [Swap
   rebalance](../cb-admin/#couchbase-admin-tasks-addremove-rebalance-swap).

## Offline upgrades

   This type of upgrade must be well-planned and scheduled. For offline upgrades,
   you shut down your application first so that no more incoming data arrives. Then
   you verify the disk write queue is 0 then shut down each node. This way you know
   that Couchbase Server has stored all items onto disk from during shutdown. You
   then perform an install of the latest version of Couchbase onto the machine. The
   installer will automatically detect the files from the older install and convert
   them to the correct format, if needed.

   Offline upgrades can take less time than online upgrades because you can upgrade
   every node in the cluster at once. The cluster must be shut down for the upgrade
   to take place. Both the cluster and all the applications built on it will not be
   available during this time. For full instructions on performing an offline
   upgrade, see [Offline upgrade process](#couchbase-getting-started-upgrade-offline).

<a id="table-couchbase-getting-started-upgrade"></a>

Feature                       | Online Upgrades                                 | Offline Upgrades                     
------------------------------|-------------------------------------------------|--------------------------------------
Applications Remain Available | Yes                                             | No                                   
Cluster Stays in Operation    | Yes                                             | No                                   
Cluster must be Shutdown      | No                                              | Yes                                  
Time Required                 | Requires Rebalance, Upgrade, Rebalance per Node | All nodes in Cluster Upgraded at Once


<div class="notebox bp">
<p>Recommendation</p>
<p>Before performing an upgrade, whether it is online or offline, 
backup your data, see <a href="../cb-admin/#couchbase-backup-restore">Backup and restore</a>.
</p></div>

<a id="couchbase-getting-started-upgrade-online-swap"></a>

## Online upgrade with swap rebalance

You can perform a swap rebalance to upgrade your nodes to Couchbase Server,
without reducing the performance of your cluster. This is the preferred method
for performing an online upgrade of your cluster because cluster capacity is
always maintained throughout the upgrade. If you are unable to perform an
upgrade via swap rebalance, perform a standard online upgrade, see
[Standard online upgrades](#couchbase-getting-started-upgrade-online). For
general information on swap rebalance, see [Swap
rebalance](../cb-admin/#couchbase-admin-tasks-addremove-rebalance-swap).

You will need at least one extra node to perform a swap rebalance.

 1. Install Couchbase Server on one extra machine that is not yet in the
    cluster. For install instructions, see [Installing Couchbase
    Server](#couchbase-getting-started-install).

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    tool](../cb-cli/#couchbase-admin-cmdline-cbbackup).

 1. Open Couchbase Web Console at an existing node in the cluster.

 1. Go to `Manage->Server Nodes`. In the Server panel you can view and managing
    servers in the cluster:


    ![](../images/upgrade_addserver.png)

 1. Click *Add Server*. A panel appears where you can provide credentials and either a
    host name or IP address for the new node: *At this point you can provide a
    hostname for the node you add. For more information, see.*


    ![](../images/online-upgrade-addnode.png)

 1. Remove one of your existing old nodes from the cluster. Under Server Nodes |
    Server panel, Click Remove Server for the node you want to remove. This will
    flag this server for removal.

 1. In the Server panel, click Rebalance.

    The rebalance automatically takes all data from the node flagged for removal
    and move it to your new node.

Repeat these steps for all the remaining old nodes in the cluster. You can add
and remove multiple nodes from a cluster, however you should always add the same
number of nodes from the cluster as you remove. For instance if you add one
node, remove one node and if you add two nodes, you can remove two.

Until all nodes in a cluster are upgraded from 1.8.1 or earlier, features in the new Couchbase Server release are disabled. 
This means views or XDCR do not function until all nodes in your cluster are migrated. 
After all nodes are upgraded, the features are enabled.

For general information on swap rebalance, see [Swap rebalance](../cb-admin/#couchbase-admin-tasks-addremove-rebalance-swap).

<a id="couchbase-getting-started-upgrade-online"></a>

## Standard online upgrades

This is also known as a standard online upgrade process and it can take place
without taking down the cluster or your application. This means that the cluster
and applications can continue running while you upgrade the individual nodes in
a cluster to the latest Couchbase version. You should only use this online
upgrade method if you are not able to perform online upgrade via swap rebalance,
see [Online upgrade with swap
rebalance](#couchbase-getting-started-upgrade-online-swap).

<div class="notebox bp">
<p>Best practice</p>
<p>
Always add the same number of nodes to a
cluster as the number that were removed and then perform rebalance. While it is
technically possible, avoid removing a node, rebalancing, and then adding
back nodes into the cluster. This reduces cluster capacity until the new node is added back into the cluster, which could lead to data being ejected to disk.
</p>
</div>

For information on upgrading from Couchbase Server 1.8 to a higher release of Couchbase Server, 
see [Upgrade from 1.8.1 notes](#couchbase-getting-started-upgrade-1-8-2-0).
Couchbase Server 1.8 cannot be upgraded directly to 2.0 or higher, instead, first upgrade to Couchbase Server 1.8.1 for data compatibility and then upgrade to a higher release.

To perform an standard, online upgrade of your cluster:

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    tool](../cb-cli/#couchbase-admin-cmdline-cbbackup).

 1. Choose a node to remove from the cluster and upgrade. You can upgrade one node
    at a time, or if you have enough cluster capacity, two nodes at a time. We do
    not recommend that you remove more than two nodes at a time for this upgrade.

 1. In Couchbase Web Console under `Manage->Server Nodes` screen, click `Remove
    Server`. This marks the server for removal from the cluster, but does not
    actually remove it.


    ![](../images/online-upgrade-removenode.png)

 1. The `Pending Rebalance` shows servers that require a rebalance. Click the
    `Rebalance` button next to the node you will remove.


    ![](../images/online-upgrade-rebalance.png)

    This moves data from the node to remaining nodes in cluster. Once
    rebalancing has been completed, the `Server Nodes` display should display only
    the remaining, active nodes in your cluster.


    ![](../images/online-upgrade-noderemoved.png)

 1. Perform an individual node upgrade to the latest version of Couchbase Server.
    See [Upgrading individual nodes](#couchbase-getting-started-upgrade-individual).

    Couchbase Server starts automatically after the upgrade. You now need to add the
    node back to the cluster.

 1. Open Web Console for an existing node in the cluster.

 1. Go to `Manage->Server Nodes`.

 1. Click the `Add Server` button. You will see a prompt to add a node to the
    cluster.



    ![](../images/online-upgrade-addnode.png)

    After the new node is added, the Pending Rebalance count indicates that
    servers need to be rebalanced into the cluster.

 1. Click `Rebalance` to rebalance the cluster and bring the new node into an active
    state.

Repeat these steps for each node in the cluster in order to upgrade the entire
cluster to a new version.

<a id="couchbase-getting-started-upgrade-offline"></a>

## Offline upgrade process

The offline upgrade process requires that all the applications and the entire Couchbase Server cluster be shutdown. After shutting down applications and nodes, perform the upgrade the
software on each machine, and bring your cluster and application back up again.

<div class="notebox">
<p>Note</p>
<p>
If you are upgrading from Couchbase Server 1.8 to Couchbase Server 2.0 or higher, there are more
steps for the upgrade because you must first upgrade to Couchbase 1.8.1 for data
compatibility. For more information, see <a href="#couchbase-getting-started-upgrade-1-8-2-0"> Upgrade from 1.8.1 notes</a>
</p>
</div>

<div class="notebox bp">
<p>Best practice</p>
<p>
Check that the disk write queue is completely drained to ensure
all data has been persisted to disk and will be available after the upgrade. 
Couchbase recommends that you turn off your application and allow the queue to drain
before upgrading. Couchbase also recommends all
data be backed up before upgrading. For more information, see 
<a href="../cb-admin/#couchbase-monitoring-diskwritequeue"> Disk Write
Queue</a>.
</p></div>

To perform an offline upgrade:

 1. Under Settings | Auto-Failover, disable auto-failover for all nodes in the
    cluster. If you leave this enabled, the first node that you shut down will be
    auto-failed-over. For instructions, see [Enabling Auto-Failover
    Settings](../cb-admin/#couchbase-admin-web-console-settings-autofailover).

 1. Shut down your application, so that no more requests go to Couchbase Cluster.

    You can monitor the activity of your cluster by using Couchbase Web Console. The
    cluster needs to finish writing all information to disk. This will ensure that
    when you restart your cluster, all of your data can be brought back into the
    caching layer from disk. You can do this by monitoring the Disk Write Queue for
    every bucket in your cluster. The disk write queue should reach zero; this means
    no data remains to be written to disk.

 1. Open Web Console at a node in your cluster.

 1. Click Data Buckets | *your\_bucket*. In the Summary section, check that `disk
    write queue` reads 0. If you have more than one data bucket for your cluster,
    repeat this step to check each bucket has a disk write queue of 0.


    ![](../images/upgrade_disk_write_zero.png)

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    tool](../cb-cli/#couchbase-admin-cmdline-cbbackup).

 1. Shutdown Couchbase Server on each machine in your cluster. For instructions, see
    [Server Startup and Shutdown](../cb-admin/#couchbase-admin-basics-running)

 1. After you shutdown your nodes, perform a standard node upgrade to the new
    version of Couchbase Server. See [Upgrading individual
   nodes](#couchbase-getting-started-upgrade-individual) for instructions.

    Couchbase Server starts automatically on each node after you perform the node
    upgrade.

 1. As the cluster warms up, you can monitor the status of the warmup process to
    determine when you can switch on your application. See [Monitoring startup
    (warmup)](../cb-admin/#couchbase-monitoring-startup).

Once the cluster finishes warmup, you can re-enable your application on the
upgraded cluster.

<a id="couchbase-getting-started-upgrade-individual"></a>

## Upgrading individual nodes

Whether you are performing an online or offline upgrade, the steps for upgrading
an individual nodes in a cluster remain the same:

 1. Download Couchbase Server

 1. Backup data for that node. To backup an existing Couchbase Server installation,
    use `cbbackup`. See [Backing up using
    cbbackup](../cb-admin/#couchbase-backup-restore-backup-cbbackup).

 1. Backup the node-specific configuration files. While the upgrade script perform a
    backup of the configuration and data files, as a best practice you should make
    your own backup of these files:

    <a id="table-couchbase-getting-started-upgrade-individual"></a>

    Platform | Location
    ---------|-------------------------------------------------------------------------------
    Linux    | `/opt/couchbase/var/lib/couchbase/config/config.dat`
    Windows  | `C:\Program Files\Couchbase\Server\Config\var\lib\couchbase\config\config.dat`

 1. Stop Couchbase Server. For instructions, see [Server Startup and
    Shutdown](../cb-admin/#couchbase-admin-basics-running).

 1. Check your hostname configurations. If you have deployed Couchbase Server in a
    cloud service, or you are using hostnames rather than IP addresses, you must
    ensure that the hostname has been configured correctly before performing the
    upgrade. See [Using hostnames with Couchbase
    Server](#couchbase-getting-started-hostnames)

 1. Check for required components and if needed, install them. This ensures that
    Couchbase Server upgrades and migrates your existing data files. See [Upgrade from 1.8.1 notes](#couchbase-getting-started-upgrade-1-8-2-0).

 1. Perform the installation upgrade for your platform:

###RHEL/CentOS

    You can perform an upgrade install using the RPM package — this will keep the
    data and existing configuration.

     ```
     root-> rpm -U couchbase-server-architecture___meta_current_version__.rpm
     ```

##Ubuntu/Debian Linux

    You can perform a package upgrade by installing the updated `.pkg` package:

     ```
     > sudo dpkg -i couchbase-server-architecture___meta_current_release.deb
     ```

###Windows

    The Install Wizard will upgrade your server installation using the same
    installation location. For example, if you have installed Couchbase Server in
    the default location, `C:\Program Files\Couchbase\Server`, the Couchbase Server
    installer will put the latest version at the same location.
    
    
## Upgrade to 2.5 notes
This section covers upgrade behavior and important steps.

### Before upgrading to 2.5
If buckets are using any of the following reserved ports, change the port for the bucket. 
Otherwise, XDCR data encryption is unavailable. (This applies to both offline and online upgrades.) 

<div class="notebox warning"><p>Important</p>
<p>Ensure that the Secure Socket Layer (SSL) reserved ports are available prior to using XDCR data encryption.
</p></div>

With XDCR data encryption, the following ports are reserved:

Port | Description
-----------|---------------
11214 | Incoming SSL Proxy
11215 | Internal Outgoing SSL Proxy
18091 | Internal REST HTTPS for SSL
18092 | Internal CAPI HTTPS for SSL   



### During a 2.5 upgrade

If Couchbase Server 2.5 has more than two (2) replicas, the first swap rebalance takes additional time. This behavior is expected.



<a id="couchbase-getting-started-upgrade-1-8-2-0"></a>

## Upgrade from 1.8.1 notes

You can upgrade from Couchbase Server 1.8.1 to a higher release of Couchbase Server using
either the online or offline upgrade method.

**Use Online Upgrades from Couchbase Server 1.8.1**

We recommend the online upgrade method when upgrading from 1.8.1 to a higher release of Couchbase Server. The process is quicker and
can take place while clusters and applications are up and running. When upgrading from Couchbase Server 1.8.1 to a higher release of Couchbase Server, the data files are
updated to use the new Couchstore data format instead of the SQLite format used
in 1.8.1 and earlier. This increases the upgrade time, and requires additional
disk space to support the migration.

Be aware that if you perform a scripted online upgrade from 1.8.1 to a higher release of Couchbase Server, expect a 10 second delay from adding a node to the cluster and
rebalancing. If a rebalance request occurs too soon after adding a node, the
rebalance may fail.

###Linux upgrade from 1.8.1 notes

When you upgrade from Couchbase Server 1.8 to a higher release of Couchbase Server on Linux, 
be aware of the **OpenSSL** requirement. OpenSSL is a required
component and an error message occurs during upgrade if it is not
installed. To install it Red Hat-based systems, use `yum` :


```
root-> yum install openssl098e
```

On Debian-based systems, use `apt-get` to install the required OpenSSL package:


```
> sudo apt-get install libssl0.9.8
```

###Windows upgrade from 1.8.1 notes

If you have configured your Couchbase Server nodes to use hostnames, rather than
IP addresses, to identify themselves within the cluster, ensure that
the IP and hostname configuration is correct both before the upgrade and after
upgrading the software. See [Hostnames for Couchbase Server 2.0.1 and
Earlier](#couchbase-getting-started-hostnames-pre2.0).

###Mac OS X upgrade from 1.8.1 notes

There is currently no officially supported upgrade installer for Mac OS X. If you
want to migrate from 1.8.1 to a higher release of Couchbase Server on OS X, backup your data
files with `cbbackup`, install the latest version, then restore your data with
`cbrestore`. For more information, see [cbbackup
tool](../cb-cli/#couchbase-admin-cmdline-cbbackup) and [cbrestore
tool](../cb-cli/#couchbase-admin-cmdline-cbrestore).

<a id="couchbase-getting-started-upgrade-1-8-2-0-process"></a>

## Upgrade from 1.8 and earlier notes
If you run Couchbase Server 1.8 or earlier, including Membase 1.7.2 and earlier, 
upgrade to Couchbase Server 1.8.1 first. The intermediate upgrade to Couchbase Server 1.8.1 
allows the data files to be converted into the new Couchbase Server compatible formats. 
This conversion is only available when upgrading from 1.8.1 to a higher release of Couchbase Server.

To perform an offline upgrade, you use the standard installation system such as 
`dpkg`, `rpm` or Windows Setup Installer to upgrade the software on each 
machine. Each installer will perform the following operations: 

    * Shutdown Couchbase Server 1.8. Do not uninstall the server.

    * Run the installer. The installer will detect any prerequisite software or
      components. An error is raised if the pre-requisites are missing. If you install
      additional required components such as OpenSSL during the upgrade, you must
      manually restart Couchbase after you install the components.

The installer copies 1.8.1-compatible data and configuration files to a backup location.

The `cbupgrade` program automatically starts. This will non-destructively 
convert data from the 1.8.1 database file format (SQLite) to the newer database file 
format (couchstore). The 1.8 database files are left "as-is", and new 
database files are created. There must be enough disk space to handle this 
conversion operation (e.g., 3x more disk space).

<div class="notebox"><p>Note</p>
<p>The data migration process from the old file format to the new file format may 
take some time. You should wait for the process to finish before starting 
Couchbase Server.
</p></div>

Once the upgrade process finishes, Couchbase Server starts automatically. 
Repeat this process on all nodes within your cluster.

<a id="couchbase-getting-started-upgrade-cetoee"></a>

## Upgrading from Community Edition to Enterprise Edition

**Use the same Couchbase Server version number when upgrading to the Enterprise Edition.** Version differences may result in a failed upgrade. To
upgrade from Couchbase Server Community Edition to Couchbase Server
Enterprise Edition, one of the following methods:

 * Perform an online upgrade
 * Perform an offline upgrade

### Online upgrade to Enterprise Edition
   Here you remove one node from the cluster and rebalance. On the nodes you have
   taken out of the cluster, uninstall Couchbase Server Community Edition package,
   and install Couchbase Server Enterprise Edition. You can then add the new nodes
   back into the cluster and rebalance. Repeat this process until the entire
   cluster is using the Enterprise Edition.

   For more information on performing online upgrades, see [Standard online
   upgrades](#couchbase-getting-started-upgrade-online).

### Offline upgrade to Enterprise Edition

   Shutdown the entire cluster, and uninstall Couchbase Server Community Edition
   from each machine. Then install Couchbase Server Enterprise Edition. The data
   files will be retained, and the cluster can be restarted.

   For more information on performing offline upgrades, see [Offline upgrade
   process](#couchbase-getting-started-upgrade-offline).

