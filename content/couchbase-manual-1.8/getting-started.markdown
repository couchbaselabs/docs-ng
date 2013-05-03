# Getting Started

To start using Couchbase Server, you need to follow these steps:

 1. Prepare your target system by ensuring that you meet the system requirements.
    See
    [Preparation](couchbase-manual-ready.html#couchbase-getting-started-prepare).

 1. Install Couchbase Server using one of the available binary distributions. See
    [Installing Couchbase
    Server](couchbase-manual-ready.html#couchbase-getting-started-install).

 1. For more information on Upgrading Couchbase Server from a previous version, see
    [Upgrading to Couchbase Server
    1.8](couchbase-manual-ready.html#couchbase-getting-started-upgrade).

 1. Test the installation by connecting to the Couchbase Server and storing some
    data using the native Memcached protocol. See [Testing Couchbase
    Server](couchbase-manual-ready.html#couchbase-getting-started-testing).

 1. Setup the new Couchbase Server system by completing the web-based setup
    instructions. See [Setting up Couchbase
    Server](couchbase-manual-ready.html#couchbase-getting-started-setup).

<a id="couchbase-getting-started-prepare"></a>

## Preparation

Heterogeneous or mixed deployments (deployments with both Linux and Windows
server nodes) are not supported at this time. It is recommended that when
deploying to multiple systems, that system be running the same operating system.

When running Couchbase Server your system should meet or exceed the following
system requirements.

<a id="couchbase-getting-started-prepare-platforms"></a>

### Supported Platforms

The following operating systems are supported:

 * RedHat Enterprise Linux 5.2 (Deprecated). Requires additional third-party
   libraries and packages.

 * RedHat Enterprise Linux 5.4 (32-bit and 64-bit)

 * Ubuntu Linux 10.04 (32-bit and 64-bit)

 * Ubuntu Linux 11.10 (32-bit and 64-bit) *Developer Only*

 * Windows Server 2008 R2 (32-bit and 64-bit)

 * Mac OS X 10.5 or higher (minimum), 10.6 or higher preferred (64-bit only)
   *Developer Only*

**Unhandled:** `[:unknown-tag :sidebar]`<a id="couchbase-getting-started-prepare-hardware"></a>

### Hardware Requirements

The following hardware requirements are recommended for installation:

 * Quad-core, 64-bit CPU running at 3GHz

 * 16GB RAM (physical)

 * Block-based storage device (hard disk, SSD, EBS, iSCSI). Network filesystems
   (e.g. CIFS, NFS) are not supported.

A minimum specification machine should have the following characteristics:

 * Dual-core CPU running at 2GHz

 * 4GB RAM (physical)

For development and testing purposes a reduced CPU and RAM configuration than
the minimum specified can be used. This can be as low as 256MB of free RAM
(beyond operating system requirements) and a single CPU core.

However, you should not use a configuration lower than that specified above in
production. Performance on machines lower than the above specification will be
significantly lower and should not be used as an indication of the performance
on a production machine.

You must have enough memory to run your operating system and the memory reserved
for use by Couchbase Server. For example, if you want to dedicate 8GB of RAM to
Couchbase Server you must have at least an additional 128MB of RAM to host your
operating system. If you are running additional applications and servers, you
will need additional RAM.

<a id="couchbase-getting-started-prepare-storage"></a>

### Storage Requirements

For running Couchbase Server you must have the following storage available:

 * 100MB for application logging

 * Disk space to match your physical RAM requirements for persistence of
   information

<a id="couchbase-getting-started-prepare-browser"></a>

### Web Browser (for administration)

The Couchbase Server administration interface is supported using the following
Web browsers, with Javascript support enabled:

 * Mozilla Firefox 3.6 or higher

   To enable JavaScript, select the `Enable JavaScript` option within the `Content`
   panel of the application preferences.

 * Safari 5 or higher

   To enable JavaScript, use the checkbox on the security tab of the application
   preferences.

 * Google Chrome 11 or higher

   To enable JavaScript, use the `Allow all sites to run JavaScript (recommended)`
   option within the `Content` button of the `Under the Hood` section of the
   application preferences.

 * Internet Explorer 8 or higher

   To enable JavaScript, by enabling `Active Scripting` within the `Custom Level`,
   section of the `Security` section of the **Unhandled:** `[:unknown-tag
   :guimenuitem]` item of the **Unhandled:** `[:unknown-tag :guimenu]` menu.

<a id="couchbase-network-ports"></a>

### Network Ports

Couchbase Server uses a number of different network ports for communication
between the different components of the server, and for communicating with
clients that accessing the data stored in the Couchbase cluster. The ports
listed must be available on the host for Couchbase Server to run and operate
correctly.

Couchbase Server will configure these ports automatically, but you must ensure
that your firewall or IP tables configuration allow communication on the
specified ports for each usage type.

The following table lists the ports used for different types of communication
with Couchbase Server, as follows:

 * **Node to Node**

   Where noted, these ports are used by Couchbase Server for communication between
   all nodes within the cluster. You must have these ports open on all to enable
   nodes to communicate with each other.

 * **Node to Client**

   Where noted, these ports should be open between each node within the cluster and
   any client nodes accessing data within the cluster.

 * **Cluster Administration**

   Where noted, these ports should be open and accessible to allow administration,
   whether using the REST API, command-line clients, and Web browser.

<a id="table-couchbase-network-ports"></a>

Port                       | Purpose                       | Node to Node | Node to Client | Cluster Administration
---------------------------|-------------------------------|--------------|----------------|-----------------------
8091                       | Web Administration Port       | Yes          | Yes            | Yes                   
11209                      | Internal Cluster Port         | Yes          | No             | No                    
11210                      | Internal Cluster Port         | Yes          | Yes            | No                    
4369                       | Erlang Port Mapper ( `epmd` ) | Yes          | No             | No                    
21100 to 21199 (inclusive) | Node data exchange            | Yes          | No             | No                    

<a id="couchbase-getting-started-install"></a>

## Installing Couchbase Server

To install Couchbase Server on your machine you must download the appropriate
package for your chosen platform from
[http://www.couchbase.com/downloads](http://www.couchbase.com/downloads). For
each platform, follow the corresponding platform-specific instructions.

<a id="couchbase-getting-started-install-redhat"></a>

### Red Hat Linux Installation

The RedHat installation uses the RPM package. Installation is supported on
RedHat and RedHat based operating systems such as CentOS.

To install, use the `rpm` command-line tool with the RPM package that you
downloaded. You must be logged in as root (Superuser) to complete the
installation:


```
root-shell> rpm --install couchbase-server version.rpm
```

Where `version` is the version number of the downloaded package.

Once the `rpm` command has been executed, the Couchbase Server starts
automatically, and is configured to automatically start during boot under the 2,
3, 4, and 5 runlevels. Refer to the RedHat RPM documentation for more
information about installing packages using RPM.

Once installation has completed, the installation process will display a message
similar to that below:


```
Starting Couchbase server: [ OK ]

You have successfully installed Couchbase Server.
Please browse to http://hostname:8091/ to configure your server.
Please refer to http://couchbase.com/support for
additional resources.

Please note that you have to update your firewall configuration to
allow connections to the following ports: 11211, 11210, 4369, 8091
and from 21100 to 21199.

By using this software you agree to the End User License Agreement.
See /opt/couchbase/LICENSE.txt.
```

Once installed, you can use the RedHat `chkconfig` command to manage the
Couchbase Server service, including checking the current status and creating the
links to enable and disable automatic startup. Refer to the RedHat documentation
for instructions.

To continue installation you must open a web browser and access the web
administration interface. See [Setting up Couchbase
Server](couchbase-manual-ready.html#couchbase-getting-started-setup).

<a id="couchbase-getting-started-install-ubuntu"></a>

### Ubuntu Linux Installation

The Ubuntu installation uses the DEB package.

To install, use the `dpkg` command-line tool using the DEB file that you
downloaded. The following example uses `sudo` which will require root-access to
allow installation:


```
shell> dpkg -i couchbase-server version.deb
```

Where `version` is the version number of the downloaded package.

Once the `dpkg` command has been executed, the Couchbase Server starts
automatically, and is configured to automatically start during boot under the 2,
3, 4, and 5 runlevels. Refer to the Ubuntu documentation for more information
about installing packages using the Debian package manager.

Once installation has completed, the installation process will display a message
similar to that below:


```
Selecting previously deselected package couchbase-server.
(Reading database ... 218698 files and directories currently installed.)
Unpacking couchbase-server (from couchbase-server-community_x86_64_beta.deb) ...
Setting up couchbase-server (2-0~basestar) ...
 * Started Couchbase server

You have successfully installed Couchbase Server.
Please browse to http://tellurium-internal:8091/ to configure your server.
Please refer to http://couchbase.com for additional resources.

Please note that you have to update your firewall configuration to
allow connections to the following ports: 11211, 11210, 4369, 8091
and from 21100 to 21199.

By using this software you agree to the End User License Agreement.
See /opt/couchbase/LICENSE.txt.
```

Once installed, you can use the `service` command to manage the Couchbase Server
service, including checking the current status. Refer to the Ubuntu
documentation for instructions.

To continue installation you must open a web browser and access the web
administration interface. See [Setting up Couchbase
Server](couchbase-manual-ready.html#couchbase-getting-started-setup).

<a id="couchbase-getting-started-install-win"></a>

### Microsoft Windows Installation

To install on Windows you must download the Windows installer package. This is
supplied as an Windows executable. You can install the package either using the
GUI installation process, or by using the unattended installation process.

<a id="couchbase-getting-started-install-win-gui"></a>

### GUI Installation

To use the GUI installer, double click on the downloaded executable file.

The installer will launch and prepare for installation. You can cancel this
process at any time. Once completed, you will be provided with the welcome
screen.


![](images/win-install-1.png)

Click **Unhandled:** `[:unknown-tag :guibutton]` to start the installation. You
will be prompted with the `Installation Location` screen. You can change the
location where the Couchbase Server application is located. Note that this does
not configure the location of where the persistent data will be stored, only the
location of the application itself. To select the install location, click the
**Unhandled:** `[:unknown-tag :guibutton]` button to select the folder. Click
**Unhandled:** `[:unknown-tag :guibutton]` to continue the installation.


![](images/win-install-2.png)

Configuration has now been completed. You will be prompted to confirm that you
want to continue installation. Click **Unhandled:** `[:unknown-tag :guibutton]`
to confirm the installation and start the installation process.


![](images/win-install-3.png)

The install will copy over the necessary files to the system. During the
installation process, the installer will also check to ensure that the default
administration port is not already in use by another application. If the default
port is unavailable, the installer will prompt for a different port to be used
for administration of the Couchbase Server.


![](images/win-install-4.png)

Once the installation process has been completed, you will be prompted with the
completion screen. This indicates that the installation has been completed and
your Couchbase Server is ready to be setup and configured. When you click
**Unhandled:** `[:unknown-tag :guibutton]`, the installer will quit and
automatically open a web browser with the Couchbase Server setup window.


![](images/win-install-5.png)

To continue installation you should follow the server setup instructions. See
[Setting up Couchbase
Server](couchbase-manual-ready.html#couchbase-getting-started-setup).

<a id="couchbase-getting-started-install-win-unattended"></a>

### Unattended Installation

The unattended installation process works by first recording your required
installation settings using the GUI installation process outlined above which
are saved to a file. You can then use the file created to act as the option
input to future installations.

To record your installation options, open a Command Terminal or Powershell and
start the installation executable with the `/r` command-line option:


```
C:\Downloads> couchbase_server_version.exe /r
```

You will be prompted with the installation choices as outlined above, but the
installation process will not actually be completed. Instead, a file with your
option choices will be recorded in the file `C:\Windows\setup.iss`.

To perform an installation using a previously recorded setup file, copy the
`setup.iss` file into the same directory as the installer executable. Run the
installer from the command-line, this time using the `/s` option.


```
C:\Downloads> couchbase_server_version.exe /s
```

You can repeat this process on multiple machines by copying the executable
package and the `setup.iss` file to each machine.

<a id="couchbase-getting-started-install-macosx"></a>

### Mac OS X Installation

The Mac OS X installation uses a Zip file which contains a standalone
application that can be copied to the `Applications` folder or to any other
location you choose. The installation location does not affect the location of
the Couchbase data files.

To install:

 1. Download the Mac OS X Zip file.

 1. Double-click the downloaded Zip installation file to extract the contents. This
    will create a single file, the `Couchbase.app` application.

 1. Drag and Drop the `Couchbase.app` to your chosen installation folder, such as
    the system `Applications` folder.

Once the application has been copied to your chosen location, you can
double-click on the application to start it. The application itself has no user
interface. Instead, the Couchbase application icon will appear in the menubar on
the right-hand side. If there is no active configuration for Couchbase, then the
Couchbase Web Console will be opened and you will be asked to complete the
Couchbase Server setup process. See [Setting up Couchbase
Server](couchbase-manual-ready.html#couchbase-getting-started-setup) for more
details.

The Couchbase application runs as a background application. Clicking on the
menubar gives you a list of operations that can be performed. For more
information, see [Startup and Shutdown on Mac OS
X](couchbase-manual-ready.html#couchbase-admin-basics-running-macosx).

The command line tools are included within the Couchbase Server application
directory. You can access them within Terminal by using the full location of the
Couchbase Server installation. By default, this is `/Applications/Couchbase
Server.app/Contents//Resources/couchbase-core/bin/`.

<a id="couchbase-getting-started-upgrade"></a>

## Upgrading to Couchbase Server 1.8

Couchbase Server supports upgrades from the previous major release version
(Membase Server 1.7) to any minor release within Couchbase Server 1.8, or
between minor releases within Couchbase Server 1.8.

Upgrades using either the online or offline method are supported only when
upgrading from Membase Server 1.7 to Couchbase Server 1.8. For cluster upgrades
older than Membase Server 1.7, you must upgrade to Membase Server 1.7.2 first.

For information on upgrading to Membase 1.7.x, see
[](http://www.couchbase.com/docs/membase-manual-1.7/membase-getting-started-1-7-upgrade.html).

A known issue exists when performing a rolling upgrade from Membase Server 1.7.1
to Couchbase Server 1.8. The problem manifests itself as the rebalance process
failing to complete effectively. You should perform an offline (in-place)
upgrade. See [Offline (in-place) Upgrade
Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline),
for more information.

The upgrade process for a cluster can be performed in two ways:

 * **Online (rolling) Upgrades**

   Online upgrades enable you to upgrade your cluster without taking your cluster
   down, allowing your application to continue running. Using the Online upgrade
   method, individual nodes are removed from the cluster (using rebalancing),
   upgraded, and then brought back into action within the cluster.

   Online upgrades natually take a long time, as each node must be taken out of the
   cluster, upgraded, and then brought back in. However, because the cluster can be
   upgraded without taking either the cluster or associated applications down, it
   can be a more effective method of upgrading.

   For full instructions on performing an online upgrade, see [Online (rolling)
   Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online).

   Starting with Couchbase Server 1.8.1, you can also make use of the swap
   rebalance functionality to perform an online upgrade with reduced performance
   impact on your cluster. For more information, see [Upgrading to Couchbase Server
   1.8.1 Using Swap
   Rebalance](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online-swap-1-8-1).

 * **Offline (in-place) Upgrades**

   Offline upgrades involve taking your application and Couchbase Server cluster
   offline, upgrading every node within the cluster while the cluster is down, and
   then restarting the upgraded cluster.

   Offline upgrades can be quicker because the upgrade process can take place
   simultaneously on every node in the cluster. The cluster, though, must be shut
   down for the upgrade to take place. This disables both the cluster and all the
   applications that rely on it.

   For full instructions on performing an offline upgrade, see [Offline (in-place)
   Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline).

<a id="table-couchbase-getting-started-upgrade"></a>

Feature                       | Online Upgrades                                 | Offline Upgrades                  
------------------------------|-------------------------------------------------|-----------------------------------
Applications Remain Available | ✓                                               | ✗                                 
Cluster Stays in Operation    | ✓                                               | ✗                                 
Cluster must be Shutdown      | ✗                                               | ✓                                 
Time Required                 | Requires Rebalance, Upgrade, Rebalance per Node | Entire Cluster is Upgraded at Once

Before beginning any upgrade, a backup should be taken as a best practice, see
[Backup and Restore with
Couchbase](couchbase-manual-ready.html#couchbase-backup-restore).

For information on backing up Membase 1.7.x, see
[](http://www.couchbase.com/docs/membase-manual-1.7/membase-backup_1-7-0_backup.html).

<a id="couchbase-getting-started-upgrade-online"></a>

### Online (rolling) Upgrade Process

Within an online or rolling upgrade, the upgrade process can take place without
taking down the cluster or the associated application. This means that the
cluster and applications can continue to function while you upgrade the
individual nodes within the cluster.

The online upgrade process makes use of the auto-sharding and rebalancing
functionality within Couchbase Server to enable one or more nodes within the
cluster to be temporarily removed from the cluster, upgraded, and then
re-enabled within the cluster again.

To perform an online upgrade of your cluster:

 1. Depending on the size and activity of your cluster, choose one or more nodes to
    be temporarily removed from the cluster and upgraded. You can upgrade one node
    at a time, or if you have capacity, multiple nodes by taking them out of the
    cluster at the same time.

    If necessary, you can add new nodes to your cluster to maintain performance
    while your existing nodes are upgraded.

 1. On the `Manage->Server Nodes` screen, click the **Unhandled:** `[:unknown-tag
    :guibutton]`. This marks the server for removal from the cluster, but does not
    actually remove it.


    ![](images/online-upgrade-removenode.png)

 1. The `Pending Rebalance` will show the number of servers that require a rebalance
    to remove them from the cluster. Click the **Unhandled:** `[:unknown-tag
    :guibutton]` button.


    ![](images/online-upgrade-rebalance.png)

    This will start the rebalance process. Once rebalancing has been completed, the
    `Server Nodes` display should display only the remaining (active) nodes in your
    cluster.


    ![](images/online-upgrade-noderemoved.png)

 1. On the node to be upgraded, stop the Couchbase Server process. For guidance on
    specific platforms, see [Startup and Shutdown of Couchbase
    Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

 1. With Couchbase Server shutdown on the node, you can perform a standard node
    upgrade to the new version of Couchbase Server. See [Node Upgrade
    Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-individual)
    for details.

 1. Couchbase Server should be started automatically after the upgrade. If not,
    restart the Couchbase Server process, using the methods described in [Startup
    and Shutdown of Couchbase
    Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

 1. With the node upgraded, you need to add the node back to the cluster.

    On an existing node within the running cluster, navigate to the
    `Manage-gt;Server Nodes` page. Click the **Unhandled:** `[:unknown-tag
    :guibutton]` button. You will be prompted to enter the IP address and
    username/password of the server to add back to the cluster.


    ![](images/online-upgrade-addnode.png)

 1. The `Pending Rebalance` count will indicate that servers need to be rebalanced
    into the cluster. Click **Unhandled:** `[:unknown-tag :guibutton]` to rebalance
    the cluster, and bring the node back into production.

You will need to repeate the above sequence for each node within the cluster in
order to upgrade the entire cluster to the new version.

<a id="couchbase-getting-started-upgrade-online-swap-1-8-1"></a>

### Upgrading to Couchbase Server 1.8.1 Using Swap Rebalance

### Couchbase Server 1.8.1

Swap rebalance functionality is available in Couchbase Server 1.8.1.

You can make use of the Swap Rebalance feature to easily and simply upgrade your
servers to Couchbase Server 1.8.1, without reducing the performance of your
cluster. For background information on the improvements with swap rebalance, see
[Swap
Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

You must apply a patch to enable the swap rebalance functionality during
upgrade. See step 3 below.

You will need one spare node to start the upgrade process.

 1. Install Couchbase Server 1.8.1 on one spare node.

 1. Add the new node with Couchbase Server 1.8.1 to the cluster.

    For swap rebalance to take effect, the number of nodes being removed and added
    to the cluster must be identical. Do not rebalance the cluster until the new
    Couchbase Server 1.8.1 node has become orchestrator of the new cluster.

    You must wait for the new node to be identified within the cluster and identify
    itself itself as the orchestrator node. This will ensure that the node will
    manage the rebalance operation and perform a swap rebalance operation. You can
    check for this by opening the `Log` portion of the Web UI for the following
    sequence of messages attributed to the new node:

     ```
     Node ns_1@10.3.2.147 joined cluster
     Haven't heard from a higher priority node or a master, so I'm taking over.
     Current master is older and I'll try to takeover (repeated 1 times)
     ```

    Once the new node has been assigned as the orchestrator, all rebalances
    performed will be swap rebalances, assuming they meet the swap rebalance
    criteria.

 1. Download the patch from
    [http://packages.couchbase.com/releases/1.8.1/MB-5895.erl](http://packages.couchbase.com/releases/1.8.1/MB-5895.erl).
    This patch must be applied only for the first rebalance to enable swap rebalance
    during the upgrade process.

    You must apply the patch to the newley added Couchbase Server 1.8.1 node. To
    apply the patch:

     * **For Linux** :

       Execute the following command on the new Couchbase Server 1.8.1 node:

        ```
        shell> /opt/couchbase/bin/curl -v --user Administrator:password -X POST  \
            -d @MB-5895.erl http://localhost:8091/diag/eval
        ```

       The output should be similar to the following, showing the connection opened
       without an explicit server response:

        ```
        * About to connect() to localhost port 8091 (#0)
        *   Trying 127.0.0.1... connected
        * Connected to localhost (127.0.0.1) port 8091 (#0)
        * Server auth using Basic with user 'Administrator'
        > POST /diag/eval HTTP/1.1
        > Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
        > User-Agent: curl/7.21.4-DEV (i686-pc-linux-gnu) libcurl/7.21.4-DEV zlib/1.2.3.4
        > Host: localhost:8091
        > Accept: */*
        > Content-Length: 1797
        > Content-Type: application/x-www-form-urlencoded
        > Expect: 100-continue
        >
        < HTTP/1.1 100 Continue
        < HTTP/1.1 200 OK
        < Server: MochiWeb/1.0 (Any of you quaids got a smint?)
        < Date: Tue, 17 Jul 2012 15:29:17 GMT
        < Content-Length: 2
        <
        * Connection #0 to host localhost left intact
        * Closing connection #0
        ```

       If the command fails for any reason, please verify the command and resubmit.

     * **For Windows** :

       Open a command prompt and execute the following command on the new Couchbase
       Server 1.8.1 node using the following command:

        ```
        shell> C:\Program Files\Couchbase\Server\bin>curl -v --user Administrator:password -X POST \
             -d @MB-5895.erl http://localhost:8091/diag/eval
        ```

       The output should be similar to the following, showing the connection opened and
       no explicit error response from the server:

        ```
        * timeout on name lookup is not supported
        * About to connect() to localhost port 8091 (#0)
        *   Trying 127.0.0.1... connected
        * Connected to localhost (127.0.0.1) port 8091 (#0)
        * Server auth using Basic with user 'Administrator'
        > POST /diag/eval HTTP/1.1
        > Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
        > User-Agent: curl/7.21.4-DEV (i686-pc-linux-gnu) libcurl/7.21.4-DEV zlib/1.2.3.4
        > Host: localhost:8091
        > Accept: */*
        > Content-Length: 1405
        > Content-Type: application/x-www-form-urlencoded
        > Expect: 100-continue
        >
        < HTTP/1.1 100 Continue
        < HTTP/1.1 200 OK
        < Server: MochiWeb/1.0 (Any of you quaids got a smint?)
        < Date: Tue, 17 Jul 2012 15:29:17 GMT
        < Content-Length: 2
        <
        * Connection #0 to host localhost left intact
        * Closing connection #0
        ```

       If the command fails for any reason, please verify the command and resubmit.

 1. Mark one of your existing Couchbase 1.8.0 nodes for removal from the cluster.

 1. Perform a rebalance operation.

    The rebalance will operate as a swap rebalance and move the data directly from
    the Couchbase 1.8.0 node to the new Couchbase 1.8.1 node.

    You can monitor the progress by viewing the `Active vBuckets` statistics. This
    should show the number of active vBuckets in the 1.8.0 node being removed as
    reducing, and the number of active vBuckets in the new 1.8.1 node increasing.

    You can monitor this through the UI by selecting the `vBuckets` statistic in the
    `Monitoring` section of the Administration Web Console.


    ![](images/swap-rebalance-active-vbuckets.png)

Repeat steps 1-5 (add/remove and swap rebalance operation), but without the
patch upload for all the remaining Couchbase Server 1.8.0 nodes within the
cluster so that each node is upgraded to Couchbase Server 1.8.1.

With a Couchbase Server 1.8.1 node in the cluster, you can perform a swap
rebalance with multiple nodes, as long as the number of nodes being swapped out,
and the number being swapped in are identical. For example, if you have four
nodes in your cluster, after the initial rebalance, you can add three new nodes,
and remove your existing three 1.8.0 nodes in one rebalance operation.

For more information on swap rebalance, see [Swap
Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

Once complete, your entire cluster should now be running Couchbase Server 1.8.1.

<a id="couchbase-getting-started-upgrade-offline"></a>

### Offline (in-place) Upgrade Process

The offline (or in-place) upgrade process requires you to shutdown all the
applications using the cluster, and the entire Membase Server or Couchbase
Server cluster. With the cluster switched off, you can then perform the upgrade
process on each of the nodes, and bring your cluster and application back up
again.

**Unhandled:** `[:unknown-tag :important]` To upgrade an existing cluster using
the offline method:

 1. Turn off your application, so that no requests are going to your Membase
    Cluster. You can monitor the activity of your cluster by using the
    Administration Web Console.

 1. With the application switched off, the cluster now needs to complete writing the
    information stored out to disk. This will ensure that when you cluster is
    restarted, all of your data remains available. You can do this by monitoring the
    Disk Write Queue within the Web Console. The disk write queue should reach zero
    (i.e. no data remaining to be written to disk).

 1. On each node within the cluster:

     * Shutdown the Membase Server or Couchbase Server process.

       On the node to be upgraded, stop the Couchbase Server process. For guidance on
       specific platforms, see [Startup and Shutdown of Couchbase
       Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

     * With Couchbase Server shutdown on the node, you can perform a standard node
       upgrade to the new version of Couchbase Server. See [Node Upgrade
       Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-individual)
       for details.

    Couchbase Server should be started automatically on each node as you perform the
    upgrade.

 1. As the cluster is warming up again, you can monitor the status of the warmup
    process to determine when you can switch on your application. See [Monitoring
    startup (warmup)](couchbase-manual-ready.html#couchbase-monitoring-startup).

Once the cluster has been started up again, you can re-enable your application
on the upgraded cluster.

<a id="couchbase-getting-started-upgrade-individual"></a>

### Node Upgrade Process

Whether you are performing an online or offline upgrade, the steps for upgrading
an individual node, including the shutdown, installation, and startup process
remains the same.

 1. Download `couchbase-server-edition_and_arch_version`.

 1. Backup the node data. To backup an existing Couchbase Server installation, use
    `cbbackup`. See [Backing
    Up](couchbase-manual-ready.html#couchbase-backup-restore-backup-cbbackup).

 1. Backup the node specific configuration files. While the upgrade script will
    perform a backup of the configuration and data files, it is our recommended best
    practice to take your own backup of the files located at:

    <a id="table-couchbase-getting-started-upgrade-individual"></a>

    Platform | Location
    ---------|-------------------------------------------------------------------------------
    Linux    | `/opt/couchbase/var/lib/couchbase/config/config.dat`
    Windows  | `C:\Program Files\Couchbase\Server\Config\var\lib\couchbase\config\config.dat`

 1. **Linux Upgrade Process from Couchbase Server 1.8.x**

    **Red Hat/CentOS Linux**

    You can perform an upgrade install using the RPM package — this will keep the
    data and existing configuration.

     ```
     root-shell> rpm -U couchbase-server-architecture___meta_current_version__.rpm
     ```

    **Ubuntu/Debian Linux**

    You can perform a package upgrade by installing the updated `.pkg` package:

     ```
     shell> sudo dpkg -i couchbase-server-architecture___meta_current_release.deb
     ```

    **Windows Upgrade Process**

    If you are upgrading from Membase Server 1.7.2 or Couchbase Server 1.8.0 to
    Couchbase Server 1.8.1 you must perform additional steps. See [Upgrading from
    Membase Server 1.7.2 and Couchbase Server 1.8.0 to Couchbase Server 1.8.1
    (Windows
    only)](couchbase-manual-ready.html#couchbase-getting-started-upgrade-1-8-1-windows).

    The Couchbase Server Windows installer will upgrade your server installation
    using the same installation location. For example, if you have installed
    Couchbase Server in the default location, `C:\Program Files\Couchbase\Server`,
    the Couchbase Server installer will copy new 1.8.1 files to the same location.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="couchbase-getting-started-upgrade-1-8-1-windows"></a>

### Upgrading from Membase Server 1.7.2 and Couchbase Server 1.8.0 to Couchbase Server 1.8.1 (Windows only)

Due to a change in the packaging for Couchbase Server 1.8.1 on Windows you need
to run the package installation twice in order to register the package and
upgrade correctly. The correct steps are:

 1. Download Windows installed package for Couchbase Server 1.8.1.

 1. Backup the node before running the upgrade process. If you are backing up an
    existing Membase Server 1.7.x installation, see [Membase Server 1.7
    Backup](http://www.couchbase.com/docs/membase-manual-1.7/membase-backup_1-7-0_backup.html).
    For Couchbase Server 1.8.0, see [Backing
    Up](couchbase-manual-ready.html#couchbase-backup-restore-backup-cbbackup).

 1. If you are upgradeding from Membase Server 1.7.2, stop Membase Server. For
    Couchbase Server 1.8.0, stop Couchbase Server. For more information, see
    [Startup and Shutdown on
    Windows](couchbase-manual-ready.html#couchbase-admin-basics-running-windows).
    Wait until the server process has stopped completely before continuing.

 1. Double-click on the downloaded package installer for Couchbase Server 1.8.1. The
    initial execution will update the registry information in preparation for the
    full upgrade.

 1. Double-click on the downloaded package installer for Couchbase Server 1.8.1.
    This second installation will take you through the full installation process,
    upgrading your existing installation for the new version. Follow the on-screen
    instructions to perform the upgrade.

Once the process has completed, you can start Couchbase Server 1.8.1 and re-add
and rebalance your node into your cluster.

<a id="couchbase-getting-started-upgrade-individual-membase"></a>

### Upgrading from Membase Server 1.7

If you are upgrading from Membase Server 1.7 you should take a backup and copy
your configuration files, before uninstalling the existing Membase Server
product. This will keep the data files in place where they will be upgraded
during the installation and startup of Couchbase Server 1.8.

Step-by-step instructions are probided below:

 1. Download `couchbase-server-edition_and_arch_version`.

 1. Backup the node data. Use `mbbackup` if you are upgrading from Membase Server
    1.7.x (see [Backup and Restore in Membase Server
    1.7.x](http://www.couchbase.com/docs/membase-manual-1.7/membase-backup-restore.html)
    ). If you are upgrading Couchbase Server, use `cbbackup`. See [Backing
    Up](couchbase-manual-ready.html#couchbase-backup-restore-backup-cbbackup).

 1. Backup the node specific configuration files. While the upgrade script will
    perform a backup of the configuration and data files, it is our recommended best
    practice to take your own backup of the files located at:

    <a id="table-couchbase-getting-started-upgrade-individual-membase"></a>

    Version              | Platform | Location
    ---------------------|----------|--------------------------------------------------------------------
    Membase Server 1.7.x | Linux    | `/opt/membase/var/lib/membase/config/config.dat`
    Membase Server 1.7.x | Windows  | `C:\Program Files\Membase\Server\Config\var\lib\membase\config.dat`

    **Unhandled:** `[:unknown-tag :important]`

 1. **Linux Upgrade Process from Membase Server 1.7.x**

    Linux package managers will prevent the `couchbase-server` package from being
    installed when there's already a `membase-server` package installed.

    **Red Hat/CentOS Linux**

     1. Uninstall the existing `membase-server` package — this will keep the user's db
        data and copies of their configuration.

         ```
         root-shell> rpm -e membase-server
         ```

     1. Install Couchbase Server 1.8 with special environment variable flags, which
        force an upgrade. The special env var is `INSTALL_UPGRADE_CONFIG_DIR`.

         ```
         root-shell> INSTALL_UPGRADE_CONFIG_DIR=/opt/membase/var/lib/membase/config \
             rpm -i \
             couchbase-server-architecture_1.8.1.rpm
         ```

    **Ubuntu/Debian Linux**

     1. Uninstall the existing `membase-server` package — this will keep the user's db
        data and copies of their configuration.

         ```
         shell> sudo dpkg -r membase-server
         ```

     1. Install Couchbase Server 1.8 with special environment variable flags, which
        forces an upgrade. The special env var is `INSTALL_UPGRADE_CONFIG_DIR`

         ```
         shell> sudo INSTALL_UPGRADE_CONFIG_DIR=/opt/membase/var/lib/membase/config \
             dpkg -i \
             couchbase-server-architecture_1.8.1.deb
         ```

 1. **Windows Upgrade Process**

    The Couchbase Server Windows installer will upgrade your current Membase Server
    installation to Couchbase Server, using the same installation location. If you
    have installed Membase Server in the default location, `C:\Program
    Files\Membase\Server`, the Couchbase Server installer will copy the new files to
    the same location. Once the upgrade process is completed you will see the
    **Unhandled:** `[:unknown-tag :guiicon]` icon on the Desktop and under
    **Unhandled:** `[:unknown-tag :guimenu]` replacing Membase Server.

After every node has been upgraded and restarted, and you can monitor its
progress of "warming up". For more details, see [Monitoring startup
(warmup)](couchbase-manual-ready.html#couchbase-monitoring-startup). Turn your
application back on.

<a id="couchbase-getting-started-upgrade-manual"></a>

### Manually Controlled Upgrade Options

This section is not applicable to Windows.

By using environment variable flags during installation you may optionally take
more control of the upgrade process and results. The available environment
variables are:

 * `INSTALL_UPGRADE_CONFIG_DIR`

   This variable sets the value of the directory of the previous versions config
   directory. When this environment variable is defined, the rpm/dpkg scripts will
   upgrade configuration files and data records from Membase Server 1.7 to
   Couchbase Server 1.8.

   The data directory defined and used by your Membase Server 1.7 installation will
   continue to be used by your upgraded Couchbase Server 1.8.1 instance. For
   example, if you had mounted/mapped special filesystems for use while running
   Membase Server 1.7, those paths will continue to be used after upgrading to
   Couchbase Server 1.8.1.

 * `INSTALL_DONT_START_SERVER`

   When set to '1', the `rpm` / `dpkg` scripts will not automatically start the
   Couchbase Server as its last step.

 * `INSTALL_DONT_AUTO_UPGRADE`

   When set to '1', the `rpm` / `dpkg` scripts will not automatically invoke the
   `cbupgrade` script that's included in Couchbase Server 1.8.1, allowing you to
   manually invoke `cbupgrade` later. This may be useful in case you need to
   perform more debugging. This should be used with the
   `INSTALL_DONT_START_SERVER=1` and `INSTALL_UPGRADE_CONFIG_DIR= PATH` environment
   variables.

Example flag usage for RedHat / CentOS:


```
INSTALL_DONT_START_SERVER=1 INSTALL_DONT_AUTO_UPGRADE=1 \
    INSTALL_UPGRADE_CONFIG_DIR=/opt/membase/var/lib/membase/config \
    rpm -i couchbase-server-community_x86_64_1.8.1.rpm
```

For Ubuntu


```
INSTALL_DONT_START_SERVER=1 INSTALL_DONT_AUTO_UPGRADE=1 \
    INSTALL_UPGRADE_CONFIG_DIR=/opt/membase/var/lib/membase/config \
    dpkg -i couchbase-server-community_x86_64_1.8.1.deb
```

Example output when using flags, first uninstalling the existing Membase Server
1.7.x:


```
[root@localhost ~]# rpm -e membase-server
Stopping membase-server[ OK ]
warning: /opt/membase/var/lib/membase/config/config.dat saved as /opt/membase/var
/lib/membase/config/config.dat.rpmsave
[root@localhost ~]# INSTALL_DONT_START_SERVER=1 INSTALL_DONT_AUTO_UPGRADE=1
INSTALL_UPGRADE_CONFIG_DIR=/opt/membase/var/lib/membase/config rpm -i
couchbase-server-community_x86_64_1.8.1r-55-g80f24f2.rpm
Upgrading couchbase-server ...
/opt/couchbase/bin/cbupgrade -c /opt/membase/var/lib/membase/config -a yes
Skipping cbupgrade due to INSTALL_DONT_AUTO_UPGRADE ...
Skipping server start due to INSTALL_DONT_START_SERVER ...
You have successfully installed Couchbase Server.
Please browse to http://localhost.localdomain:8091/ to configure your server.
Please refer to http://couchbase.com for additional resources.
Please note that you have to update your firewall configuration to
allow connections to the following ports: 11211, 11210, 4369, 8091
and from 21100 to 21299.
By using this software you agree to the End User License Agreement.
See /opt/couchbase/LICENSE.txt.
[root@localhost ~]#
```

After using the `INSTALL_DONT_AUTO_UPGRADE` option, you can use the
`/opt/couchbase/bin/cbupgrade` program later to fully control the upgrade steps.
It's command-line options include:


```
[root@localhost ~]# /opt/couchbase/bin/cbupgrade -h
Usage: cbupgrade [-c path/to/previous/config/dir] [-a AUTO] [-d FILENAME] [-n] [-s FACTOR]
-c <path/to/previous/config/dir>
-- example: -c /etc/opt/membase/1.6.5.3.1
-a <yes|no>
-- automatic or non-interactive mode; default is 'no';
'yes' to force automatic 'yes' answers to all questions
-d <dbdir_output_file>
-- retrieve db directory from config file and exit
-n -- dry-run; don't actually change anything
-s <free_disk_space_needed_factor>
-- free disk space needed, as a factor of current bucket usage
-- default value is 2.0
-- example: -s 1.0
```

The `cbupgrade` program can be run using the `-n` flag, which tells `cbupgrade`
to not modify any files, but just describe the changes it would make. For
example:


```
[root@localhost ~]# /opt/couchbase/bin/cbupgrade -c /opt/membase/var/lib/membase/config -nDry-run
mode: no actual upgrade changes will be made.
Upgrading your Couchbase Server to 1.8.1r-55-g80f24f2.
The upgrade process might take awhile.
Analysing...
Previous config.dat file is /opt/membase/var/lib/membase/config/config.dat.rpmsave
Target node: ns_1@127.0.0.1
Membase/Couchbase should not be running.
Please use: /etc/init.d/couchbase-server stop
or: /etc/init.d/membase-server stop
Is the Membase/Couchbase server already stopped? [yes|no]
yes
Database dir: /opt/membase/var/lib/membase/data
Is that the expected database directory to upgrade? [yes|no]
yes
Buckets to upgrade: default
Are those the expected buckets to upgrade? [yes|no]
yes
Checking disk space available for buckets in directory:
/opt/membase/var/lib/membase/data
Free disk bucket space wanted: 0.0
Free disk bucket space available: 177790963712
Free disk space factor: 2.0
Ok.
Analysis complete.
Proceed with config & data upgrade steps? [yes|no]
yes
SKIPPED (dry-run): Copying /opt/membase/var/lib/membase/config/config.dat.rpmsave
SKIPPED (dry-run): cp /opt/membase/var/lib/membase/config/config.dat.rpmsave /opt/couchbase/var
/lib/couchbase/config/config.dat
Ensuring bucket data directories.
SKIPPED (dry-run): Ensuring bucket data directory: /opt/membase/var/lib/membase/data/default-data
SKIPPED (dry-run): mkdir -p /opt/membase/var/lib/membase/data/default-data
SKIPPED (dry-run): Ensuring dbdir owner/group: /opt/membase/var/lib/membase/data
SKIPPED (dry-run): chown -R couchbase:couchbase /opt/membase/var/lib/membase/data
SKIPPED (dry-run): Ensuring dbdir owner/group: /opt/membase/var/lib/membase/data
SKIPPED (dry-run): chown -R couchbase:couchbase /opt/membase/var/lib/membase/data
Upgrading buckets.
Skipping already converted bucket: /opt/membase/var/lib/membase/data/default-data
Skipping already converted bucket: /opt/membase/var/lib/membase/data/test0-data
Done.
```

<a id="couchbase-getting-started-upgrade-cetoee"></a>

### Upgrading from Community Edition to Enterprise Edition

To upgrade between Couchbase Server Community Edition and Couchbase Server
Enterprise Edition, you can use two methods:

 * Perform an online upgrade installation

   Using this method, you remove one or more nodes from the cluster and rebalance.
   On the nodes you have taken out of the cluster, uninstall Couchbase Server
   Community Edition package, and install Couchbase Server Enterprise Edition. You
   can then add the new nodes back to the cluster and rebalance. This process can
   be repeated until the entire cluster is using the Enterprise Edition.

   For more information on performing rolling upgrades, see [Online (rolling)
   Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online).

 * Perform an offline upgrade

   Using this method, you need to shutdown the entire cluster, and uninstall
   Couchbase Server Community Edition, and install Couchbase Server Enterprise
   Edition. The data files will be retained, and the cluster can be restarted.

   For more information on performing rolling upgrades, see [Offline (in-place)
   Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline).

You should use the same version number when performing the migration process to
prevent version differences causing issues during the upgrade process.

<a id="couchbase-getting-started-setup"></a>

## Setting up Couchbase Server

To setup a new Couchbase Server you have a number of different solutions
available. All of the solutions require you to set the username and password.
You can also optionally configure other settings, such as the port, RAM
configuration, and the data file location, as well as creating the first bucket
by using any of the following methods:

 * **Using command-line tools**

   The command line toolset provided with your Couchbase Server installation
   includes `couchbase-cli`. This command provides access to the core functionality
   of the Couchbase Server by providing a wrapper to the REST API. Seecluster
   initializationfor more information.

 * **Using the REST API**

   Couchbase Server can be configured and controlled using a REST API. In fact, the
   REST API is the basis for both the command-line tools and Web interface to
   Couchbase Server.

   For more information on using the REST API to provision and setup your node, see
   [Provisioning a
   Node](couchbase-manual-ready.html#couchbase-admin-restapi-provisioning).

 * **Using Web Setup**

   You can use the web browser setup to configure the Couchbase Server
   installation, including setting the memory settings, disk locations, and
   existing cluster configuration. You will also be asked to create a password to
   be used when logging in and administering your server.

   The remainder of this section will provide you with information on using this
   method.

We recommend that you clear your browser cache before starting the setup
process. You can find notes and tips on how to do this on different browsers and
platforms on [this page](http://www.wikihow.com/Clear-Your-Browser's-Cache).

To start the configuration and setup process, you should open the Couchbase Web
Console. On Windows this is opened for you automatically. On all platforms you
can access the web console by connecting to the embedded web server on port
8091. For example, if your server can be identified on your network as
`servera`, you can access the web console by opening `http://servera:8091/`. You
can also use an IP address or, if you are on the same machine,
`http://localhost:8091`.

 1. Once you have opened the web console for the first time immediately after
    installation you will be prompted with the screen shown below.


    ![](images/web-console-startup-1.png)

    Click the **Unhandled:** `[:unknown-tag :guibutton]` button to start the setup
    process.

 1. First, you must set the disk storage and cluster configuration.


    ![](images/web-console-startup-2.png)

    **Configure Disk Storage**

    The `Configure Disk Storage` option specifies the location of the persistent
    (on-disk) storage used by Couchbase Server. The setting affects only this server
    and sets the directory where all the data will be stored on disk.

    **Join Cluster/Start New Cluster**

    The `Configure Server Memory` section sets the amount of physical RAM that will
    be allocated by Couchbase Server for storage.

    If you are creating a new cluster, you specify the memory that will be allocated
    on each node within your Couchbase cluster. You must specify a value that will
    be supported on all the nodes in your cluster as this is a global setting.

    If you want to join an existing cluster, select the radio button. This will
    change the display and prompt the IP address of an existing node, and the
    username and password of an administrator with rights to access the cluster.


    ![](images/web-console-startup-2b.png)

    Click **Unhandled:** `[:unknown-tag :guibutton]` to continue the installation
    process.

 1. Couchbase Server stores information in buckets. You should set up a default
    bucket for Couchbase Server to start with. You can change and alter the bucket
    configuration at any time.

    ### Default Bucket Should Only Be Used for Testing

    The default bucket should not be used for storing live application data. You
    should create a bucket specifically for your application. The default bucket
    should only be used for testing.


    ![](images/web-console-startup-3.png)

    The options are:

     * **Bucket Type**

       Specifies the type of the bucket to be created, either `Memcached` or
       `Couchbase`. See
       [Buckets](couchbase-manual-ready.html#couchbase-introduction-architecture-buckets)
       for more information.

       The remainder of the options differ based on your selection.

       When selecting the `Couchbase` bucket type:

        * **Memory Size**

          This option specifies the amount of available RAM configured on this server
          which should be allocated to the default bucket.

        * **Replication**

          For Couchbase buckets you can enable replication to support multiple replicas of
          the default bucket across the servers within the cluster. You can configure up
          to three replicas. Each replica receives copies of all the documents that are
          managed by the bucket. If the host machine for a bucket fails, a replica can be
          promoted to take its place, providing continuous (high-availability) cluster
          operations in spite of machine failure.

          You can disable replication by setting the number of replica copies to zero (0).

       When selecting the `Memcached` bucket type:

        * **Memory Size**

          The bucket is configured with a per-node amount of memory. Total bucket memory
          will change as nodes are added/removed.

          For more information, see [Memory
          Quotas](couchbase-manual-ready.html#couchbase-introduction-architecture-quotas).

    Click **Unhandled:** `[:unknown-tag :guibutton]` to continue the setup process.

 1. You can optionally enable the notification system within the Couchbase Web
    Console.


    ![](images/web-console-startup-4.png)

    If you select the `Update Notifications` option, the Web Console will
    communicate with Couchbase servers to confirm the version number of your
    Couchbase installation. During this process, the client submits the following
    information to the Couchbase Server:

     * The current version of your Couchbase Server installation. When a new version of
       Couchbase Server becomes available, you will be provided with notification of
       the new version and information on where you can download the new version.

     * Basic information about the size and configuration of your Couchbase cluster.
       This information will be used to help us prioritize our development efforts.

    The process occurs within the browser accessing the web console, not within the
    server itself, and no further configuration or internet access is required on
    the server to enable this functionality. Providing the client accessing the
    Couchbase Server console has internet access, the information can be
    communicated to the Couchbase Servers.

    The update notification process provides the information anonymously, and the
    data cannot be tracked. The information is only used to provide you with update
    notifications and to provide information that will help us improve the future
    development process for Couchbase Server and related products.

     * **Enterprise Edition**

       You can also register your product from within the setup process.

     * **Community Edition**

       Supplying your email address will add you to the Couchbase community mailing
       list, which will provide you with news and update information about Couchbase
       and related products. You can unsubscribe from the mailing list at any time
       using the unsubscribe link provided in each email communication.

    Click **Unhandled:** `[:unknown-tag :guibutton]` to continue the setup process.

 1. The final step in the setup process is to configure the username and password
    for the administrator of the server. If you create a new cluster then this
    information will be used to authenticate each new server into the cluster. The
    same credentials are also used when using the Couchbase Management REST API.
    Enter a username and password. The password must be at least six characters in
    length.


    ![](images/web-console-startup-5.png)

    Click **Unhandled:** `[:unknown-tag :guibutton]` to complete the process.

Once the setup process has been completed, you will be presented with the
Couchbase Web Console showing the Cluster Overview page.


![](images/web-console-startup-6.png)

Your Couchbase Server is now running and ready to use.

<a id="couchbase-getting-started-testing"></a>

## Testing Couchbase Server

Testing the connection to the Couchbase Server can be performed in a number of
different ways. Connecting to the node using the web client to connect to the
admin console should provide basic confirmation that your node is available.
Using the `couchbase-cli` command to query your Couchbase Server node will
confirm that the node is available.

The Couchbase Server web console uses the same port number as clients use when
communicated with the server. If you can connect to the Couchbase Server web
console, administration and database clients should be able to connect to the
core cluster port and perform operations. The Web Console will also warn if the
console loses connectivity to the node.

To verify your installation works for clients, you can use either the
`cbworkloadgen` command, or `telnet`. The `cbworkloadgen` command uses the
Python Client SDK to communicate with the cluster, checking both the cluster
administration port and data update ports. For more information, see [Testing
Couchbase Server using
cbworkloadgen](couchbase-manual-ready.html#couchbase-getting-started-testing-cbworkloadgen).

Using `telnet` only checks the Memcached compatibility ports and the memcached
text-only protocol. For more information, see [Testing Couchbase Server using
Telnet](couchbase-manual-ready.html#couchbase-getting-started-testing-telnet).

<a id="couchbase-getting-started-testing-cbworkloadgen"></a>

### Testing Couchbase Server using cbworkloadgen

The `cbworkloadgen` is a basic tool that can be used to check the availability
and connectivity of a Couchbase Server cluster. The tool executes a number of
different operations to provide basic testing functionality for your server.

`cbworkloadgen` provides basic testing functionality. It does not provide
performance or workload testing.

To test a Couchbase Server installation using `cbworkloadgen`, execute the
command supplying the IP address of the running node:


```
shell> /opt/couchbase/bin/cbworkloadgen -n localhost:8091
Thread 0 - average set time : 0.0257480939229 seconds , min : 0.00325512886047 seconds , max : 0.0705931186676 seconds , operation timeou\
ts 0
```

The progress and activity of the tool can also be monitored within the web
console.

For a longer test you can increase the number of iterations:


```
shell> /opt/couchbase/bin/cbworkloadgen -n localhost:8091 --items=100000
```

<a id="couchbase-getting-started-testing-telnet"></a>

### Testing Couchbase Server using Telnet

You can test your Couchbase Server installation by using Telnet to connect to
the server and using the Memcached text protocol. This is the simplest method
for determining if your Couchbase Server is running.

You will not need to use the Telnet method for communicating with your server
within your application. Instead, use one of the Couchbase SDKs.

You will need to have `telnet` installed on your server to connect to Couchbase
Server using this method. Telnet is supplied as standard on most platforms, or
may be available as a separate package that should be easily installable via
your operating systems standard package manager.

Connect to the server:


```
shell> telnet localhost 11211
Trying 127.0.0.1...
Connected to localhost.localdomain (127.0.0.1).
Escape character is '^]'.
```

Make sure it's responding (stats is a great way to check basic health):


```
stats
STAT delete_misses 0
STAT ep_io_num_write 0
STAT rejected_conns 0
...
STAT time 1286678223
...
STAT curr_items_tot 0
...
STAT threads 4
STAT pid 23871
...
END
```

Put a document in:


```
set test_key 0 0 1
a
STORED
```

Retrieve the document:


```
get test_key
VALUE test_key 0 1
a
END
```

Disconnect:


```
quit
Connection closed by foreign host.
shell>
```

All of the Memcached protocols commands will work through Telnet.

<a id="couchbase-getting-started-nextsteps"></a>

## Next Steps

 * For basic instructions on using your Couchbase Server installation, see
   [Administration Basics](couchbase-manual-ready.html#couchbase-admin-basics).

 * For information on deploying and building your Couchbase Server cluster, see
   [Deployment Strategies](couchbase-manual-ready.html#couchbase-deployment).

 * For instructions on how to use the Couchbase Web Console to manage your
   Couchbase Server installation, see [Web Console for
   Administration](couchbase-manual-ready.html#couchbase-admin-web-console).

   You should create buckets for each of the applications you intend to deploy.

 * If you already have an application that uses the Memcached protocol then you can
   start using your Couchbase Server immediately. If so, you can simply point your
   application to this server like you would any other memcached server. No code
   changes or special libraries are needed, and the application will behave exactly
   as it would against a standard memcached server. Without the client knowing
   anything about it, the data is being replicated, persisted, and the cluster can
   be expanded or contracted completely transparently.

   If you do not already have an application, then you should investigate one of
   the available Couchbase client libraries to connect to your server and start
   storing and retrieving information. For more information, see [Couchbase
   SDKs](http://www.couchbase.com/develop).

<a id="couchbase-admin-basics"></a>
