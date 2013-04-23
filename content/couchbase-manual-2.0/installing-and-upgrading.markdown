# Installing and Upgrading

To start using Couchbase Server, you need to follow these steps:

 1. Prepare your target system by ensuring that you meet the system requirements.
    See
    [Preparation](couchbase-manual-ready.html#couchbase-getting-started-prepare).

 1. Install Couchbase Server using one of the available binary distributions. See
    [Installing Couchbase
    Server](couchbase-manual-ready.html#couchbase-getting-started-install).

 1. For more information on Upgrading Couchbase Server from a previous version, see
    [Upgrading to Couchbase Server
    2.0](couchbase-manual-ready.html#couchbase-getting-started-upgrade).

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

 * RedHat Enterprise Linux 5 and 6 (32-bit and 64-bit) – RedHat 5.8 recommended

 * CentOS 5 and 6 (32-bit and 64-bit) – 5.8 recommended

   Later CentOS versions may work, but are unsupported. You may need to install a
   specific OpenSSL dependency by running:

    ```
    root-shell> yum install openssl098e
    ```

 * [Amazon AMI (32-bit and
   64-bit)](https://aws.amazon.com/marketplace/seller-profile/ref=dtl_pcp_sold_by?ie=UTF8&id=1a064a14-5ac2-4980-9167-15746aabde72)

 * Ubuntu Linux 10.04 (32-bit and 64-bit) for production

   Ubuntu Linux 12.04 (32-bit and 64-bit) *for development only*

   Later Ubuntu versions may work, but are unsupported. You may need to install a
   specific OpenSSL dependency by running:

    ```
    root-shell> apt-get install libssl0.9.8
    ```

   **Unhandled:** `[:unknown-tag :sidebar]`

 * Windows Server 2008 R2 with Service Pack 1 (64-bit)

   **Unhandled:** `[:unknown-tag :important]`

 * Windows 7 Pro (64-bit)

 * Mac OS X 10.7 and 10.8 (64-bit only) for *Developer Only*. Not supported in
   production. Couchbase Server on Mac OSX uses 64 vBuckets as opposed to the 1024
   vBuckets used by other platforms.

   A Couchbase cluster with nodes on different operating systems may not function
   with one another due to differences in the number of shards. Therefore using
   multiple platforms within a cluster is not a supported configuration.

   Due to limitations within the Mac OS X operating system, the Mac OS X
   implementation is incompatible with other operating systems. It is not possible
   either to mix operating systems within the same cluster, or configure XDCR
   between a Mac OS X and Windows or Linux cluster.

   If you need to move data between a Mac OS X cluster and a cluster hosted on
   another platform, please use `cbbackup` and `cbrestore`. For more information,
   see [Backup and Restore Between Mac OS X and Other
   Platforms](couchbase-manual-ready.html#couchbase-backup-restore-mac).

<a id="couchbase-getting-started-prepare-hardware"></a>

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

View performance on machines with less than 2 CPU cores will be significantly
reduced.

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

 * **XDCR**

   Ports are used for XDCR communication between all nodes in both the source and
   destination clusters.

<a id="table-couchbase-network-ports"></a>

Port                       | Description                   | Node to Node | Node to Client | Cluster Administration | XDCR
---------------------------|-------------------------------|--------------|----------------|------------------------|-----
8091                       | Web Administration Port       | Yes          | Yes            | Yes                    | Yes 
8092                       | Couchbase API Port            | Yes          | Yes            | No                     | Yes 
11209                      | Internal Cluster Port         | Yes          | No             | No                     | No  
11210                      | Internal Cluster Port         | Yes          | Yes            | No                     | No  
11211                      | Client interface (proxy)      | Yes          | Yes            | No                     | No  
4369                       | Erlang Port Mapper ( `epmd` ) | Yes          | No             | No                     | No  
21100 to 21199 (inclusive) | Node data exchange            | Yes          | No             | No                     | No  

<a id="couchbase-getting-started-install"></a>

## Installing Couchbase Server

To install Couchbase Server on your machine you must download the appropriate
package for your chosen platform from
[http://www.couchbase.com/downloads](http://www.couchbase.com/downloads). For
each platform, follow the corresponding platform-specific instructions.

If you are installing Couchbase Server on to a machine that has previously had
Couchbase Server installed and you do not want to perform an upgrade
installation, you must remove Couchbase Server and any associated data from your
machine before you start the installation. For more information on uninstalling
Couchbase Server, see [Uninstalling Couchbase
Server](couchbase-manual-ready.html#couchbase-uninstalling).

To perform an upgrade installation while reatining your existing datasset, see
[Upgrading to Couchbase Server
2.0](couchbase-manual-ready.html#couchbase-getting-started-upgrade).

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

Once the `rpm` command has been executed, the Couchbase server starts
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
allow connections to the following ports:1,0, 4369, 8091
and from 21100 to 21199.

By using this software you agree to the End User License Agreement.
See /opt/couchbase/LICENSE.txt.
```

Once installed, you can use the RedHat `chkconfig` command to manage the
Couchbase Server service, including checking the current status and creating the
links to enable and disable automatic start-up. Refer to the RedHat
documentation for instructions.

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

Once the `dpkg` command has been executed, the Couchbase server starts
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
allow connections to the following ports:1,0, 4369, 8091
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
GUI installation process, or by using the unattended installation process. In
either case, make sure that you have no anti-virus software running on the
machine before you start the installation process.

### Port Exhaustion on Windows

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

Couchbase Server relies on the Microsoft C++ redistributable package, which will
automatically be downloaded for you during installation. However, if another
application on your machine is already using the package, your installation
process may hang. To ensure that your installation process completes
successfully, shut down all other running application during the installation
process.

<a id="couchbase-getting-started-install-win-gui"></a>

### GUI Installation

To use the GUI installer, double click on the downloaded executable file. The
installer for windows will detect if any redistributable packages included with
Couchbase need to be installed or not. If these packaged are not already on your
system, the install will automatically install them along with Couchbase Server.

The installer will launch and prepare for installation. You can cancel this
process at any time. Once completed, you will be provided with the welcome
screen.


![](couchbase-manual-2.0/images/win-install-1.png)

Click **Unhandled:** `[:unknown-tag :guibutton]` to start the installation. You
will be prompted with the `Installation Location` screen. You can change the
location where the Couchbase Server application is located. Note that this does
not configure the location of where the persistent data will be stored, only the
location of the application itself. To select the install location, click the
**Unhandled:** `[:unknown-tag :guibutton]` button to select the folder. Click
**Unhandled:** `[:unknown-tag :guibutton]` to continue the installation.


![](couchbase-manual-2.0/images/win-install-2.png)

Configuration has now been completed. You will be prompted to confirm that you
want to continue installation. Click **Unhandled:** `[:unknown-tag :guibutton]`
to confirm the installation and start the installation process.


![](couchbase-manual-2.0/images/win-install-3.png)

The install will copy over the necessary files to the system. During the
installation process, the installer will also check to ensure that the default
administration port is not already in use by another application. If the default
port is unavailable, the installer will prompt for a different port to be used
for administration of the Couchbase server.


![](couchbase-manual-2.0/images/win-install-4.png)

Once the installation process has been completed, you will be prompted with the
completion screen. This indicates that the installation has been completed and
your Couchbase Server is ready to be setup and configured. When you click
**Unhandled:** `[:unknown-tag :guibutton]`, the installer will quit and
automatically open a web browser with the Couchbase Server setup window.


![](couchbase-manual-2.0/images/win-install-5.png)

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
shell> couchbase_server_version.exe /r
```

You will be prompted with the installation choices as outlined above, but the
installation process will not actually be completed. Instead, a file with your
option choices will be recorded in the file `C:\Windows\setup.iss`.

To perform an installation using a previously recorded setup file, copy the
`setup.iss` file into the same directory as the installer executable. Run the
installer from the command-line, this time using the `/s` option.


```
shell> couchbase_server_version.exe /s
```

You can repeat this process on multiple machines by copying the executable
package and the `setup.iss` file to each machine.

<a id="couchbase-getting-started-install-macosx"></a>

### Mac OS X Installation

Couchbase Server on Mac OS X is for development purposes only.

The Mac OS X installation uses a Zip file which contains a standalone
application that can be copied to the `Applications` folder or to any other
location you choose. The installation location does not affect the location of
the Couchbase data files.

Due to limitations within the Mac OS X operating system, the Mac OS X
implementation is incompatible with other operating systems. It is not possible
either to mix operating systems within the same cluster, or configure XDCR
between a Mac OS X and Windows or Linux cluster.

If you need to move data between a Mac OS X cluster and a cluster hosted on
another platform, please use `cbbackup` and `cbrestore`. For more information,
see [Backup and Restore Between Mac OS X and Other
Platforms](couchbase-manual-ready.html#couchbase-backup-restore-mac).

To install:

 1. Download the Mac OS X Zip file.

 1. Double-click the downloaded Zip installation file to extract the contents. This
    will create a single file, the `Couchbase.app` application.

 1. Drag and Drop the `Couchbase.app` to your chosen installation folder, such as
    the system `Applications` folder.

 1. When you open Couchbase for the first time, you will be asked whether you want
    to install the Couchbase command-line tools into another directory. This creates
    symbolic links to the core command line tools in the chosen directory.

Once the application has been copied to your chosen location, you can
double-click on the application to start it. The application itself has no user
interface. Instead, the Couchbase application icon will appear in the menu bar
on the right-hand side. If there is no active configuration for Couchbase, then
the Couchbase Web Console will be opened and you will be asked to complete the
Couchbase Server setup process. See [Setting up Couchbase
Server](couchbase-manual-ready.html#couchbase-getting-started-setup) for more
details.

The Couchbase application runs as a background application. Clicking on the menu
bar gives you a list of operations that can be performed, as shown in **Couldn't
resolve xref tag: fig-couchbase-getting-started-macosx-menubar**.

The command line tools are included within the Couchbase Server application
directory. You can access them within Terminal by using the full location of the
Couchbase Server installation. By default, this is
`/Applications/Couchbase Server.app/Contents//Resources/couchbase-core/bin/`.

<a id="couchbase-getting-started-upgrade"></a>

## Upgrading to Couchbase Server 2.0

Couchbase Server supports upgrades from the previous major release version
(Couchbase Server 1.8) to any minor release within Couchbase Server 2.0, or
between minor releases within Couchbase Server 2.0.

**Unhandled:** `[:unknown-tag :important]` Upgrades using either the online or
offline method are supported only when upgrading from Couchbase Server 1.8 to
Couchbase Server 2.0. For cluster upgrades older than Couchbase Server 1.8, you
must upgrade to Couchbase Server 1.8.1 first.

The upgrade process for a cluster can be performed in two ways:

 * **Online Upgrades**

   Online upgrades enable you to upgrade your cluster without taking your cluster
   down, allowing your application to continue running. Using the Online upgrade
   method, individual nodes are removed from the cluster (using rebalancing),
   upgraded, and then brought back into action within the cluster.

   Online upgrades naturally take a long time, as each node must be taken out of
   the cluster, upgraded, and then brought back in. However, because the cluster
   can be upgraded without taking either the cluster or associated applications
   down, it can be a more effective method of upgrading.

   For full instructions on performing an online upgrade, see [Online Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online).

 * **Offline Upgrades**

   Offline upgrades involve taking your application and Couchbase Server cluster
   offline, upgrading every node within the cluster while the cluster is down, and
   then restarting the upgraded cluster.

   Offline upgrades can be quicker because the upgrade process can take place
   simultaneously on every node in the cluster. The cluster, though, must be shut
   down for the upgrade to take place. This disables both the cluster and all the
   applications that rely on it.

   For full instructions on performing an offline upgrade, see [Offline Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline).

<a id="table-couchbase-getting-started-upgrade"></a>

Feature                       | Online Upgrades                                 | Offline Upgrades                  
------------------------------|-------------------------------------------------|-----------------------------------
Applications Remain Available | Yes                                             | No                                
Cluster Stays in Operation    | Yes                                             | No                                
Cluster must be Shutdown      | No                                              | Yes                               
Time Required                 | Requires Rebalance, Upgrade, Rebalance per Node | Entire Cluster is Upgraded at Once

### Backup your data before performing an upgrade

Before beginning any upgrade, a backup should be taken as a best practice, see
[Backup and Restore](couchbase-manual-ready.html#couchbase-backup-restore).

<a id="couchbase-getting-started-upgrade-1-8-2-0"></a>

### Upgrading from Couchbase Server 1.8.x to Couchbase Server 2.0.x

You can upgrade from Couchbase Server 1.8.1 to Couchbase Server 2.0 using either
the online or offline upgrade method. If you are running Couchbase Server 1.8.0
or earlier, you must upgrade to Couchbase Server 1.8.1 first.

### Use Online Upgrades for Couchbase Server 1.8 to Couchbase Server 2.0

The recommended method for upgrading to Couchbase Server 2.0 from Couchbase
Server 1.8 is to use the online upgrade method. The process is quicker and can
take place while your cluster and application are up and running.

When upgrading from Couchbase Server 1.8 to Couchbase Server 2.0 the data files
are updated to use the new Couchstore data format in place of the SQLite format.
This increases the upgrade time, and requires additional disk space to support
the migration and update of the data.

**Unhandled:** `[:unknown-tag :important]`<a id="couchbase-getting-started-upgrade-1-8-2-0-macnotes"></a>

### Mac OS X Notes for 1.8 to 2.0 Upgrade

When you upgrade Couchbase Server 1.8 to Couchbase Server 2.0 on Mac OS X, you
should perform the following in order for the latest version of the server to
work:

 * Stop any instances of Couchbase Server by selecting Quit Couchbase from your
   menu bar.

 * Remove any previous versions of Couchbase Server by opening your Applications
   folder and dragging the Couchbase icon to the trash.

 * Remove the following two files from your directory system:

    ```
    shell> rm -rf ~/Library/Application Support/Couchbase
    shell> rm -rf ~/Library/Application Support/Membase
    ```

 * Do not move the application to another location while it is running. If you do
   so, this will break all symbolic links to directories containing command-line
   tools from Couchbase. Instead stop the server then move it to a new location.

<a id="couchbase-getting-started-upgrade-1-8-2-0-linuxnotes"></a>

### Linux Notes for 1.8 to 2.0 Upgrade

When upgrading Couchbase Server 1.8 to Couchbase Server 2.0 on Linux, you should
be aware of the following requirements:

 * **OpenSSL**

   OpenSSL is a required component and should be installed before starting the
   upgrade process.

   On RedHat-based systems, use `yum` to install the required OpenSSL package:

    ```
    root-shell> yum install openssl098e
    ```

   On Debian-based systems, use `apt-get` to install the required OpenSSL package:

    ```
    shell> sudo apt-get install libssl0.9.8
    ```

 * *Hostname Configuration*. If you have configured your Couchbase Server nodes to
   use hostnames, rather than IP addresses to identify themselves within the
   cluster, you should update the `/opt/couchbase/var/lib/couchbase/ip` file with
   your hostnames before you perform the upgrade.

   For more information, check the individual node upgrade process in [Node Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-individual).

<a id="couchbase-getting-started-upgrade-1-8-2-0-windowsnotes"></a>

### Windows Notes for 1.8 to 2.0 Upgrade

When upgrading Couchbase Server 1.8 to Couchbase Server 2.0 on Windows, you
should be aware of the following requirements:

 * *Hostname Configuration*

   If you have configured your Couchbase Server nodes to use hostnames, rather than
   IP addresses, to identify themselves within the cluster, you must ensure that
   the IP and hostname configuration is correct both before the upgrade, and
   initially after upgrading the software.

    * Before the Upgrade

      Ensure that the file `C:\Program Files\Couchbase\Server\var\lib\couchbase\ip`
      contains the hostname used to identify the cluster.

    * After the Upgrade, from 1.8 to 2.0 only:

      Stop Couchbase Server, copy the configuration file, and ensure that the hostname
      information has been updated according to [Handling Changes in IP
      Addresses](couchbase-manual-ready.html#couchbase-bestpractice-cloud-ip), then
      restart the server. You do not need to do this step for upgrade to 2.0.1.

   For more information, check the individual node upgrade process in [Node Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-individual).

<a id="couchbase-getting-started-upgrade-1-8-2-0-process"></a>

### Upgrade Process Notes 1.8 to 2.0

Upgrades can be performed using either the online or offline upgrade methods, as
outlined below:

 * **Online Upgrade**

   The online upgrade process operates in an identical fashion to the main online
   upgrade process, as provided in [Online Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online).

   Using the online upgrade method, you can upgrade or add, new Couchbase Server
   2.0 servers to your existing cluster configuration. You can use the swap
   rebalance functionality to swap and upgrade multiple servers while optimizing
   the rebalance process. For more information on swap rebalance, see [Swap
   Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

   During online upgrades, new Couchbase Server 2.0 features (e.g. Views, XDCR) are
   disabled until the entire cluster has been migrated to Couchbase Server 2.0.

 * **Offline Upgrade**

   You can perform an offline upgrade of your Couchbase Server 1.8.1 installation
   to upgrade it to Couchbase Server 2.0. Offline upgrades require your entire
   cluster to be shutdown cleanly before the installation and upgrade process can
   be completed. The process is similar to the standard offline upgrade, but
   requires extra time where the upgrade tool migrates all your existing data to
   the new format. For more information, see [Offline Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline).

   To perform an offline upgrade, you use the standard installation system (
   `dpkg`, `rpm` or Windows Setup Installer) to perform the upgrade. Each installer
   will perform the following operations:

   You must have enough disk space available for both your original Couchbase
   Server 1.8 data files and the new format Couchbase Server 2.0 files. You will
   need approximately double the disk space.

    * Shutdown the Couchbase Server 1.8.x, if the server has not already been stopped.
      Do not uninstall the server.

    * The installer will detect any prerequisite software or components. An error is
      raised if the pre-requisites are missing.

      **Unhandled:** `[:unknown-tag :important]`

    * The installer will copy 1.8.x data and configuration files to a backup location.

    * Install Couchbase Server 2.0 software.

    * Automatically run the `cbupgrade` program. This will (non-destructively) convert
      data from the 1.8 database file format (SQLite) to 2.0 database file format
      (couchstore). The 1.8 database files are left "as-is", and new 2.0 database
      files are created. There must be enough disk space to handle this conversion
      operation (e.g., 2x more disk space).

   The data migration process from the old file format to the new file format may
   take some time. You should wait for the process to complete before starting up
   Couchbase Server 2.0.

   Once the upgrade process has completed, Couchbase Server 2.0 should be started
   automatically. This process should be repeated on all nodes within your cluster.

<a id="couchbase-getting-started-upgrade-online"></a>

### Online Upgrade Process

Within an online upgrade, the upgrade process can take place without taking down
the cluster or the associated application. This means that the cluster and
applications can continue to function while you upgrade the individual nodes
within the cluster.

The online upgrade process makes use of the auto-sharding and rebalancing
functionality within Couchbase Server to enable one or more nodes within the
cluster to be temporarily removed from the cluster, upgraded, and then
re-enabled within the cluster again.

**Unhandled:** `[:unknown-tag :important]` To perform an online upgrade of your
cluster:

 1. Depending on the size and activity of your cluster, choose one or more nodes to
    be temporarily removed from the cluster and upgraded. You can upgrade one node
    at a time, or if you have capacity, multiple nodes by taking them out of the
    cluster at the same time.

    If necessary, you can add new nodes to your cluster to maintain performance
    while your existing nodes are upgraded.

 1. On the `Manage->Server Nodes` screen, click the **Unhandled:** `[:unknown-tag
    :guibutton]`. This marks the server for removal from the cluster, but does not
    actually remove it.


    ![](couchbase-manual-2.0/images/online-upgrade-removenode.png)

 1. The `Pending Rebalance` will show the number of servers that require a rebalance
    to remove them from the cluster. Click the **Unhandled:** `[:unknown-tag
    :guibutton]` button.


    ![](couchbase-manual-2.0/images/online-upgrade-rebalance.png)

    This will start the rebalance process. Once rebalancing has been completed, the
    `Server Nodes` display should display only the remaining (active) nodes in your
    cluster.


    ![](couchbase-manual-2.0/images/online-upgrade-noderemoved.png)

 1. Perform a standard node upgrade to the new version of Couchbase Server. See
    [Node Upgrade
    Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-individual)
    for details.

 1. Couchbase Server should be started automatically after the upgrade. If not,
    restart the Couchbase Server process, using the methods described in [Startup
    and Shutdown of Couchbase
    Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

 1. With the node upgraded, you need to add the node back to the cluster.

    On an existing node within the running cluster, navigate to the `Manage->Server
    Nodes` page. Click the **Unhandled:** `[:unknown-tag :guibutton]` button. You
    will be prompted to enter the IP address and username/password of the server to
    add back to the cluster.


    ![](couchbase-manual-2.0/images/online-upgrade-addnode.png)

 1. The `Pending Rebalance` count will indicate that servers need to be rebalanced
    into the cluster. Click **Unhandled:** `[:unknown-tag :guibutton]` to rebalance
    the cluster, and bring the node back into production.

You will need to repeat the above sequence for each node within the cluster in
order to upgrade the entire cluster to the new version.

<a id="couchbase-getting-started-upgrade-online-swap"></a>

### Online Upgrade to Couchbase Server Using Swap Rebalance

You can make use of the Swap Rebalance feature to easily and simply upgrade your
servers to Couchbase Server 2.0, without reducing the performance of your
cluster. For background information on the improvements with swap rebalance, see
[Swap
Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

You will need one spare node to start the upgrade process.

 1. Install Couchbase Server 2.0 on one spare node.

 1. Add the new node with Couchbase Server 2.0 to the cluster.

 1. Mark one of your existing Couchbase 1.8.x nodes for removal from the cluster.

 1. Perform a rebalance operation.

    The rebalance will operate as a swap rebalance and move the data directly from
    the Couchbase 1.8.0 node to the new Couchbase 2.0 node.

Repeat steps 1-5 (add/remove and swap rebalance operation), for all the
remaining Couchbase Server 1.8.x nodes within the cluster. Providing you add and
remove the same number of nodes with each rebalance operation, the rebalance
will be optimized for swap rebalance.

**Unhandled:** `[:unknown-tag :important]` For more information on swap
rebalance, see [Swap
Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

Once complete, your entire cluster should now be running Couchbase Server 2.0.

<a id="couchbase-getting-started-upgrade-offline"></a>

### Offline Upgrade Process

The offline upgrade process requires you to shutdown all the applications using
the cluster, and the entire Couchbase Server cluster. With the cluster switched
off, you can then perform the upgrade process on each of the nodes, and bring
your cluster and application back up again.

If you are upgrading from Couchbase Server 1.8 to Couchbase 2.0 there are
additional stages to the upgrade process. For more information, see [Upgrading
from Couchbase Server 1.8.x to Couchbase Server
2.0.x](couchbase-manual-ready.html#couchbase-getting-started-upgrade-1-8-2-0).

**Unhandled:** `[:unknown-tag :important]` To upgrade an existing cluster using
the offline method:

 1. Turn off your application, so that no requests are going to your Couchbase
    Cluster. You can monitor the activity of your cluster by using the
    Administration Web Console.

 1. With the application switched off, the cluster now needs to complete writing the
    information stored out to disk. This will ensure that when you cluster is
    restarted, all of your data remains available. You can do this by monitoring the
    Disk Write Queue within the Web Console. The disk write queue should reach zero
    (i.e. no data remaining to be written to disk).

 1. On each node within the cluster:

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

**Unhandled:** `[:unknown-tag :important]` Whether you are performing an online
or offline upgrade, the steps for upgrading an individual node, including the
shutdown, installation, and start-up process remains the same:

 1. Download `couchbase-server-edition_and_arch_version`

 1. Backup the node data. To backup an existing Couchbase Server installation, use
    `cbbackup`. See [Backing Up Using
    cbbackup](couchbase-manual-ready.html#couchbase-backup-restore-backup-cbbackup).

 1. Backup the node specific configuration files. While the upgrade script will
    perform a backup of the configuration and data files, it is our recommended best
    practice to take your own backup of the files located at:

    <a id="table-couchbase-getting-started-upgrade-individual"></a>

    Platform | Location
    ---------|-------------------------------------------------------------------------------
    Linux    | `/opt/couchbase/var/lib/couchbase/config/config.dat`
    Windows  | `C:\Program Files\Couchbase\Server\Config\var\lib\couchbase\config\config.dat`

 1. Stop the Couchbase Server process. For guidance on specific platforms, see
    [Startup and Shutdown of Couchbase
    Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

 1. If you have deployed your Couchbase Server installation within a cloud service,
    or you are using hostnames rather than IP addresses to refer to the different
    hosts within your cluster you must ensure that the hostname has been configured
    correctly before performing the upgrade process.

    **Linux Upgrade with Hostname Configuration**

    For adding 2.0.1 nodes, update the `ip_start` file with the hostname used to
    identify your node. You can do this by editing the file
    `/opt/couchbase/var/lib/couchbase/ip_start`, ensuring that it contains the
    *hostname* used to identify the host.

    For adding a 2.0 node, provide the hostname in the file
    `/opt/couchbase/var/lib/couchbase/ip`.

    **Windows Upgrade with Hostname Configuration**

    For adding a 2.0.1 node update the `ip_start` file with the hostname used to
    identify your node. You can do this by editing the file
    `C:\Program Files\Couchbase\Server\var\lib\couchbase\ip_start` and ensuring that
    it contains the *hostname* used to identify the host.

    For adding a 2.0 node, provide the hostname in the file and
    `C:\Program Files\Couchbase\Server\var\lib\couchbase\ip`.

 1. The specific upgrade process for your platform is detailed below.

     * **Unhandled:** `[:unknown-tag :important]`  **Linux Upgrade Process from
       Couchbase Server 1.8.x**

       **Red Hat/CentOS Linux**

       OpenSSL is a required component and should be installed before starting the
       upgrade process. Use `yum` to install the required OpenSSL package:

        ```
        root-shell> yum install openssl098e
        ```

       You can perform an upgrade install using the RPM package — this will keep the
       data and existing configuration.

        ```
        root-shell> rpm -U couchbase-server-architecture___meta_current_version__.rpm
        ```

       **Ubuntu/Debian Linux**

       OpenSSL is a required component and should be installed before starting the
       upgrade process. Use `apt-get` to install the required OpenSSL package:

        ```
        shell> sudo apt-get install libssl0.9.8
        ```

       You can perform a package upgrade by installing the updated `.pkg` package:

        ```
        shell> sudo dpkg -i couchbase-server-architecture___meta_current_release.deb
        ```

       **Unhandled:** `[:unknown-tag :important]`

     * **Windows Upgrade Process**

       The Couchbase Server Windows installer will upgrade your server installation
       using the same installation location. For example, if you have installed
       Couchbase Server in the default location, `C:\Program Files\Couchbase\Server`,
       the Couchbase Server installer will copy new 2.0.0 files to the same location.

<a id="couchbase-getting-started-upgrade-cetoee"></a>

### Upgrading from Community Edition to Enterprise Edition

To upgrade between Couchbase Server Community Edition and Couchbase Server
Enterprise Edition, you can use two methods:

 * Perform an online upgrade

   Using this method, you remove one or more nodes from the cluster and rebalance.
   On the nodes you have taken out of the cluster, uninstall Couchbase Server
   Community Edition package, and install Couchbase Server Enterprise Edition. You
   can then add the new nodes back to the cluster and rebalance. This process can
   be repeated until the entire cluster is using the Enterprise Edition.

   For more information on performing online upgrades, see [Online Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-online).

 * Perform an offline upgrade

   Using this method, you need to shutdown the entire cluster, and uninstall
   Couchbase Server Community Edition, and install Couchbase Server Enterprise
   Edition. The data files will be retained, and the cluster can be restarted.

   For more information on performing offline upgrades, see [Offline Upgrade
   Process](couchbase-manual-ready.html#couchbase-getting-started-upgrade-offline).

You should use the same version number when performing the migration process to
prevent version differences causing issues during the upgrade process.

<a id="couchbase-getting-started-hostnames"></a>

## Using Hostnames with Couchbase Server

When you install Couchbase Server, it will be available at a default IP address.
There may be cases where you want to provide a hostname for each instance of a
server. This section describes how you can do so on Windows and Linux.

**Linux**

For 2.0, please update the `/opt/couchbase/var/lib/couchbase/ip` file with your
hostnames after you perform an install, or before you perform the upgrade.

For 2.0.1, update the ip\_start  file with the hostname used to identify your
node. You can do this by editing the file 
`/opt/couchbase/var/lib/couchbase/ip_start`, ensuring that it contains the
*hostnames*.

**Windows**

For 2.0, provide hostnames in the file
`C:\Program Files\Couchbase\Server\var\lib\couchbase\ip.`

For 2.0.1, provide the hostname in
`C:\Program Files\Couchbase\Server\var\lib\couchbase\ip_start.`

For upgrades on Windows from 1.8.1 to 2.0 for the Microsoft Windows platform,
you need to start and restart the server when you provide hostnames. To do this:

 1. Stop Couchbase Server.

     ```
     shell> net stop couchbaseserver
     ```

 1. Copy the configuration information.

     ```
     shell> copy \Program Files\Couchbase\Server\var\lib\couchbase\config.dat
                 \Program Files\Couchbase\Server\var\lib\couchbase\config\config.dat
     ```

 1. Start Couchbase Server.

     ```
     shell> net start couchbaseserver
     ```

**On Amazon**. For more information about handling IP addresses and hostnames,
see [Handling Changes in IP
Addresses](couchbase-manual-ready.html#couchbase-bestpractice-cloud-ip).

<a id="couchbase-getting-started-setup"></a>

## Setting up Couchbase Server

To setup a new Couchbase Server you have a number of different solutions
available. All of the solutions require you to set the username and password.
You can also optionally configure other settings, such as the port, RAM
configuration, and the data file location, as well as creating the first bucket
by using any of the following methods:

 * **Using command-line tools**

   The command line tool set provided with your Couchbase Server installation
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


    ![](couchbase-manual-2.0/images/web-console-startup-1.png)

    Click the **Unhandled:** `[:unknown-tag :guibutton]` button to start the setup
    process.

 1. First, you must set the disk storage and cluster configuration.


    ![](couchbase-manual-2.0/images/web-console-startup-2.png)

    **Configure Disk Storage**

    The `Configure Disk Storage` option specifies the location of the persistent
    (on-disk) storage used by Couchbase Server. The setting affects only this server
    and sets the directory where all the data will be stored on disk, and where the
    indices created by the view mechanism will be stored. These can be configured
    independently.

    ### Data and Index Storage Configuration

    For the best performance, you should configure different disks for storing your
    document and index data.

    **Join Cluster/Start New Cluster**

    The `Configure Server Memory` section sets the amount of physical RAM that will
    be allocated by Couchbase Server for storage.

    If you are creating a new cluster, you specify the memory that will be allocated
    on each node within your Couchbase cluster. You must specify a value that will
    be supported on all the nodes in your cluster as this is a global setting.

    The default value is 60% of your total free RAM. This figure is designed to
    allow RAM capacity for use by the operating system caching layer when accessing
    and using views.

    If you want to join an existing cluster, select the radio button. This will
    change the display and prompt the IP address of an existing node, and the
    username and password of an administrator with rights to access the cluster.


    ![](couchbase-manual-2.0/images/web-console-startup-2b.png)

    Click **Unhandled:** `[:unknown-tag :guibutton]` to continue the installation
    process.

 1. You can optionally load Couchbase Server with sample buckets. This is designed
    to demonstrate the power and capabilities of Couchbase Server and help you
    understand and develop views using structured data.

    Multiple sample buckets may be available. If you decide to install sample data,
    one Couchbase Bucket will be created for each set of sample data that you
    install.


    ![](couchbase-manual-2.0/images/web-console-startup-3.png)

    To install a sample bucket, select the checkbox next to each sample bucket that
    you want to install. For more information on the contents of the sample buckets
    provided, see [Couchbase Sample
    Buckets](couchbase-manual-ready.html#couchbase-sampledata).

    Click Next to continue the setup process.

 1. Couchbase Server stores information in buckets. You should set up a default
    bucket for Couchbase Server to start with. You can change and alter the bucket
    configuration at any time.

    ### Default Bucket Should Only Be Used for Testing

    The default bucket should not be used for storing live application data. You
    should create a bucket specifically for your application. The default bucket
    should only be used for testing.


    ![](couchbase-manual-2.0/images/web-console-startup-4.png)

    The options are:

     * **Bucket Type**

       Specifies the type of the bucket to be created, either `Memcached` or
       `Couchbase`. See [Data
       Storage](couchbase-manual-ready.html#couchbase-introduction-architecture-buckets)
       for more information.

       The remainder of the options differ based on your selection.

       When selecting the `Couchbase` bucket type:

        * **Memory Size**

          This option specifies the amount of available RAM configured on this server
          which should be allocated to the bucket.

        * **Replicas**

          For Couchbase buckets you can enable replication to support multiple replicas of
          the default bucket across the servers within the cluster. You can configure up
          to three replicas. Each replica receives copies of all the key/value pairs that
          are managed by the bucket. If the host machine for a bucket fails, a replica can
          be promoted to take its place, providing continuous (high-availability) cluster
          operations in spite of machine failure.

          You can disable replication by deselecting the `Enable` checkbox.

          To configure the number of replica copies, select the number of replicas using
          the `Number of replica (backup) copies` pop-up list.

          Couchbase Server can also optionally create replicas of the indexes created by
          the view index process. This ensures that indexes do not need to be rebuilt in
          the event of a failure, but increases the network load as the index information
          is replicated along with the data. Replica indexes are enabled by default. To
          disable replica indexes, deselect the `Index replicas` checkbox.

        * **Flush**

          Enable or disable support for the Flush command, which deletes all the data in
          an a bucket. The default is for the flush operation to be disabled. To enable
          the operation for a bucket, click the `Enable` checkbox.

       When selecting the `Memcached` bucket type:

        * **Memory Size**

          The bucket is configured with a per-node amount of memory. Total bucket memory
          will change as nodes are added/removed.

          For more information, see [RAM
          Sizing](couchbase-manual-ready.html#couchbase-bestpractice-sizing-ram).

    Click **Unhandled:** `[:unknown-tag :guibutton]` to continue the setup process.

 1. You can optionally enable the notification system within the Couchbase Web
    Console.


    ![](couchbase-manual-2.0/images/web-console-startup-5.png)

    If you select the `Update Notifications` option, the Web Console will
    communicate with Couchbase servers to confirm the version number of your
    Couchbase installation. During this process, the client submits the following
    information to the Couchbase server:

     * The current version of your Couchbase Server installation. When a new version of
       Couchbase Server becomes available, you will be provided with notification of
       the new version and information on where you can download the new version.

     * Basic information about the size and configuration of your Couchbase cluster.
       This information will be used to help us prioritize our development efforts.

    The process occurs within the browser accessing the web console, not within the
    server itself, and no further configuration or internet access is required on
    the server to enable this functionality. Providing the client accessing the
    Couchbase server console has internet access, the information can be
    communicated to the Couchbase servers.

    The update notification process provides the information anonymously, and the
    data cannot be tracked. The information is only used to provide you with update
    notification and to provide information that will help us improve the future
    development process for Couchbase Server and related products.

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


    ![](couchbase-manual-2.0/images/web-console-startup-6.png)

    Click **Unhandled:** `[:unknown-tag :guibutton]` to complete the process.

Once the setup process has been completed, you will be presented with the
Couchbase Web Console showing the Cluster Overview page.


![](couchbase-manual-2.0/images/web-console-startup-7.png)

Your Couchbase server is now running and ready to use.

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
shell> cbworkloadgen -n localhost:8091
Thread 0 - average set time : 0.0257480939229 seconds , min : 0.00325512886047 seconds , max : 0.0705931186676 seconds , operation timeouts 0
```

The progress and activity of the tool can also be monitored within the web
console.

For a longer test you can increase the number of iterations:


```
shell> cbworkloadgen -n localhost:8091 --items=100000
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
shell> telnet localhost1
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

Put a key in:


```
set test_key 0 0 1
a
STORED
```

Retrieve the key:


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
   Couchbase Server installation, see [Using the Web
   Console](couchbase-manual-ready.html#couchbase-admin-web-console).

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
