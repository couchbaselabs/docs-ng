# Installation overview

To start using Couchbase Server, you need to follow these steps:

 1. Make sure your machine meets the system requirements. See
    [Preparation](#couchbase-getting-started-prepare).

 1. Install Couchbase Server. See [Installing Couchbase
    Server](#couchbase-getting-started-install).

 1. For more information on Upgrading Couchbase Server from a previous version, see
    [Upgrading to Couchbase Server 2.1](#couchbase-getting-started-upgrade).

 1. Test the installation by connecting and storing some data using the native
    Memcached protocol. See [Testing Couchbase
    Server](#couchbase-getting-started-testing).

 1. Setup the new Couchbase Server system by completing the web-based setup
    instructions. See [Initial Server Setup](#couchbase-getting-started-setup).

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
Couchbase Server, see [Uninstalling Couchbase Server](#couchbase-uninstalling).

To perform an upgrade installation while retaining your existing dataset, see
[Upgrading to Couchbase Server](#couchbase-getting-started-upgrade).

<a id="couchbase-getting-started-prepare"></a>

# Preparing to install

Mixed deployments, such as cluster with both Linux and Windows server nodes are
not supported. This incompatibility is due to differences in the number of
shards between platforms. It is not possible either to mix operating systems
within the same cluster, or configure XDCR between clusters on different
platforms. You should use same operating system on all machines within a cluster
and on the same operating systems on multiple clusters if you perform XDCR
between the clusters.

Your system should meet the following system requirements.

<a id="couchbase-getting-started-prepare-platforms"></a>

## Supported Platforms

With Couchbase Server 2.2 we have extended our platform support for Windows 2012 and provide separate packages for Ubuntu 12.04 and CentOS 6.

<a id="table-couchbase-platform-support"></a>

**Platform**             | **Version** | **32 / 64 bit** | **Supported**            | **Recommended Version**
-------------------------|-------------|-----------------|--------------------------|------------------------
Red Hat Enterprise Linux | 5           | 32 and 64 bit   | Developer and Production | RHEL 5.8               
Red Hat Enterprise Linux | 6           | 32 and 64 bit   | Developer and Production | RHEL 6.3               
CentOS                   | 5           | 32 and 64 bit   | Developer and Production | CentOS 5.8             
CentOS                   | 6           | 32 and 64 bit   | Developer and Production | CentOS 6.3              
Amazon Linux             | 2011.09     | 32 and 64 bit   | Developer and Production |                        
Ubuntu Linux             | 10.04       | 32 and 64 bit   | Developer and Production |                        
Ubuntu Linux             | 12.04       | 32 and 64 bit   | Developer and Production | Ubuntu 12.04           
Windows 2008             | R2 with SP1 | 64 bit          | Developer and Production | Windows 2008                              
Windows 2012             |             | 64 bit          | Developer and Production |  
Windows 7                |             | 32 and 64 bit   | Developer only           |                        
Windows 8                |             | 32 and 64 bit   | Developer only           |                        
Mac OS                    | 10.7        | 64 bit          | Developer only           |                        
Mac OS                    | 10.8        | 64 bit          | Developer only           | Mac OS 10.8             


**Couchbase clusters with mixed platforms are not supported.** Specifically,
Couchbase Server on Mac OS X uses 64 vBuckets as opposed to the 1024 vBuckets used
by other platforms. Due to this difference, if you need to move data between a
Mac OS X cluster and a cluster hosted on another platform use `cbbackup` and
`cbrestore`. For more information, see [Backup and Restore Between Mac OS X and
Other Platforms](#couchbase-backup-restore-mac).

For other platform-specific installation steps and dependencies, see the
instructions for your platform under [Installing Couchbase
Server](#couchbase-getting-started-install).

<a id="couchbase-getting-started-prepare-hardware"></a>

## Resource Requirements

The following hardware requirements are recommended for installation:

 * Quad-core for key-value store, 64-bit CPU running at 3GHz

 * Six cores if you use XDCR and views.

 * 16GB RAM (physical)

 * Block-based storage device (hard disk, SSD, EBS, iSCSI). Network filesystems
   (e.g. CIFS, NFS) are not supported.

A minimum specification machine should have the following characteristics:

 * Dual-core CPU running at 2GHz for key-value store

 * 4GB RAM (physical)

For development and testing purposes a reduced CPU and RAM than the minimum
specified can be used. This can be as low as 1GB of free RAM beyond operating
system requirements and a single CPU core. However, you should not use a
configuration lower than that specified in production. Performance on machines
lower than the minimum specification will be significantly lower and should not
be used as an indication of the performance on a production machine.

View performance on machines with less than 2 CPU cores will be significantly
reduced.

You must have enough memory to run your operating system and the memory reserved
for use by Couchbase Server. For example, if you want to dedicate 8GB of RAM to
Couchbase Server you must have enough RAM to host your operating system. If you
are running additional applications and servers, you will need additional RAM.
For smaller systems, such as those with less than 16GB you should allocate at
least 40% of RAM to your operating system.

You must have the following amount of storage available:

 * 1GB for application logging

 * At least twice the disk space to match your physical RAM for persistence of
   information

For information and recommendations on server and cluster sizing, see [Sizing
Guidelines](#couchbase-bestpractice-sizing).

<a id="couchbase-getting-started-prepare-browser"></a>

## Supported Web Browsers

The Couchbase Web Console runs on the following browsers, with JavaScript
support enabled:

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
   section of the `Security` section of the `Internet Options` item of the `Tools`
   menu.

<a id="couchbase-network-ports"></a>

## Network Ports

Couchbase Server uses a number of different network ports for communication
between the different components of the server, and for communicating with
clients that accessing the data stored in the Couchbase cluster. The ports
listed must be available on the host for Couchbase Server to run and operate
correctly. Couchbase Server will configure these ports automatically, but you
must ensure that your firewall or IP tables configuration allow communication on
the specified ports for each usage type. On Linux the installer will notify you
that you need to open these ports.

The following table lists the ports used for different types of communication
with Couchbase Server, as follows:

### Node to Node

   Where noted, these ports are used by Couchbase Server for communication between
   all nodes within the cluster. You must have these ports open on all to enable
   nodes to communicate with each other.

### Node to Client

   Where noted, these ports should be open between each node within the cluster and
   any client nodes accessing data within the cluster.

### Cluster Administration

   Where noted, these ports should be open and accessible to allow administration,
   whether using the REST API, command-line clients, and Web browser.

### XDCR

   Ports are used for XDCR communication between all nodes in both the source and
   destination clusters.

<a id="table-couchbase-network-ports"></a>

Port                       | Description                   | Node to Node | Node to Client | Cluster Administration | XDCR (version 1) | XDCR (version 2)
---------------------------|-------------------------------|--------------|----------------|------------------------|------------------|-----------------
8091                       | Web Administration Port       | Yes          | Yes            | Yes                    | Yes              | Yes 
8092                       | Couchbase API Port            | Yes          | Yes            | No                     | Yes              | Yes 
11209                      | Internal Bucket Port          | Yes          | No             | No                     | No               | No 
11210                      | Internal/External Bucket Port | Yes          | Yes            | No                     | No               | Yes  
11211                      | Client interface (proxy)      | No           | Yes            | No                     | No               | No  
4369                       | Erlang Port Mapper ( `epmd` ) | Yes          | No             | No                     | No               | No 
21100 to 21199 (inclusive) | Node data exchange            | Yes          | No             | No                     | No               | No  


<a id="couchbase-getting-started-install-redhat"></a>

# Red Hat Linux installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). The Red Hat
installation uses the RPM package. Installation is supported on Red Hat and
Red Hat-based operating systems such as CentOS.

 1. For Red Hat Enterprise Linux version 6.0, Couchbase Server 2.2 RPM will do
    dependency checks for OpenSSL using `pkg-config`. Therefore you need to check
    that this pkg-config is installed and if you do not have it, install it:

     ```
     root-> sudo yum install -y pkgconfig
     ```

    Upon successful install you will see output as follows:

     ```
     Loaded plugins
     ....
      Installed:
       pkgconfig.x86_64 1:0.21-2.el5
     Complete!
     ```

 1. For Red Hat Enterprise Linux version 6.0 and above, you need to install a
    specific OpenSSL dependency by running:

     ```
     root-> yum install openssl098e
     
     ```
     Some users will not be able to install `openssl098e` with this command without 
     having administrative privileges. If you experience this issue, put the contents of the 
     `lib64` directory into `opt/couchbase/lib`:
     
     - Download `openssl098e-0.9.8e-17.el6.centos.2.x86_64.rpm'.
     
     - Go to the directory where you extracted Couchbase Server: `cd opt/couchbase`.
     
     - Extract the openssl098e RPM: 
     
            rpm2cpio
            openssl098e-0.9.8e-17.el6.centos.2.x86_64.rpm | cpio --extract
            --make-directories --no-absolute-filenames
            
    - Move the extracted files to the `/lib` directory for Couchbase Server: `mv usr/lib64/*
            lib/`
     
 1. To install Couchbase Server, use the `rpm` command-line tool with the RPM
    package that you downloaded. You must be logged in as root (Superuser) to
    complete the installation:

     ```
     root-> rpm --install couchbase-server version.rpm
     ```

    Where `version` is the version number of the downloaded package.

    Once the `rpm` command completes, Couchbase Server starts automatically, and is
    configured to automatically start during boot under the 2, 3, 4, and 5
    runlevels. Refer to the Red Hat RPM documentation for more information about
    installing packages using RPM.

    After installation finishes, the installation process will display a message
    similar to that below:

     ```
     Minimum RAM required  : 4 GB
     System RAM configured : 8174464 KB

     Minimum number of processors required : 4 cores
     Number of processors on the system    : 4 cores

     Starting couchbase-server[  OK  ]

     You have successfully installed Couchbase Server.
     Please browse to http://host_name:8091/ to configure your server.
     Please refer to http://couchbase.com for additional resources.

     Please note that you have to update your firewall configuration to
     allow connections to the following ports: 11211, 11210, 11209, 4369,
     8091, 8092 and from 21100 to 21299.

     By using this software you agree to the End User License Agreement.
     See /opt/couchbase/LICENSE.txt.
     ```

Once installed, you can use the Red Hat `chkconfig` command to manage the
Couchbase Server service, including checking the current status and creating the
links to enable and disable automatic start-up. Refer to the [Red Hat
documentation](https://access.redhat.com/site/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s2-services-chkconfig.html)
for instructions.

To do the initial setup for Couchbase, open a web browser and access the
Couchbase Web Console. See [Initial Server
Setup](#couchbase-getting-started-setup).

##Installing on CentOS/RHEL as Non-Root, Non-Sudo 

**This installation is for development purposes only.** There may be cases when you want to install the server as a non-root, non-sudo
user. If you perform a non-sudo, non-root installation you will be still be able to run Couchbase Server and all 
Couchbase command-line tools. To do so on CentOS/Red Hat:

 1. After you download the Couchbase RPM, go to the directory where it is located and extract it:


		rpm2cpio couchbase-server-community_x86_64_2.0.0-1767-rel.rpm | cpio --extract --make-directories \
		--no-absolute-filenames


    In the directory where you extracted the files, you will see `opt` and `etc`
    subdirectories.
    
    There may be a case where you need to separately provide openssl098e. If you do, put the contents of 
    this library into `opt/couchbase/lib`:
     
     - Download `openssl098e-0.9.8e-17.el6.centos.2.x86_64.rpm'.
     
     - Go to the directory where you extracted Couchbase Server: `cd opt/couchbase`.
     
     - Extract the openssl098e RPM: 
     
            rpm2cpio
            openssl098e-0.9.8e-17.el6.centos.2.x86_64.rpm | cpio --extract
            --make-directories --no-absolute-filenames
            
    - Move the extracted files to the `/lib` directory for Couchbase Server: `mv usr/lib64/*
            lib/`

 1. After you extract the Couchbase Server install files, go to the subdirectory:

     ```
     cd opt/couchbase
     ```

 1. Run this password-related script:

     ```
     ./bin/install/reloc.sh \`pwd`
     ```

    This enables you to continue the install as a non-root, non-sudo user.

 1. To run the server:

     ```
     ./bin/couchbase-server \-- -noinput -detached
     ```

 1. To stop the server:

     ```
     ./bin/couchbase-server -k
     ```

For general instructions on server start-up and shutdown as a sudo or root user,
see [Server Startup and Shutdown](#couchbase-admin-basics-running).

<a id="couchbase-getting-started-install-ubuntu"></a>

# Ubuntu Linux installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms).

 1. For Ubuntu version 12.04, you need to install a specific OpenSSL dependency by
    running:

     ```
     root-> apt-get install libssl0.9.8
     ```

 1. The Ubuntu Couchbase installation uses the DEB package. To install, use the
    `dpkg` command-line tool using the DEB file that you downloaded. The following
    example uses `sudo` which will require root-access to allow installation:

     ```
     > dpkg -i couchbase-server version.deb
     ```

    Where `version` is the version number of the downloaded package.

    Once the `dpkg` command has been executed, the Couchbase server starts
    automatically, and is configured to automatically start during boot under the 2,
    3, 4, and 5 runlevels. Refer to the Ubuntu documentation for more information
    about installing packages using the Debian package manager.

    After installation has completed, the installation process will display a
    message similar to that below:

     ```
     Selecting previously deselected package couchbase-server.
     (Reading database ... 73755 files and directories currently installed.)
     Unpacking couchbase-server (from couchbase-server_x86_64_2.1.0-xxx-rel.deb) ...
     libssl0.9.8 is installed. Continue installing
     Minimum RAM required  : 4 GB
     System RAM configured : 4058708 KB

     Minimum number of processors required : 4 cores
     Number of processors on the system    : 4 cores
     Setting up couchbase-server (2.1) ...
      * Started couchbase-server

     You have successfully installed Couchbase Server.
     Please browse to http://slv-0501:8091/ to configure your server.
     Please refer to http://couchbase.com for additional resources.

     Please note that you have to update your firewall configuration to
     allow connections to the following ports: 11211, 11210, 11209, 4369,
     8091, 8092 and from 21100 to 21299.

     By using this software you agree to the End User License Agreement.
     See /opt/couchbase/LICENSE.txt.

     Processing triggers for ureadahead ...
     ureadahead will be reprofiled on next reboot
     ```



After successful installation, you can use the `service` command to manage the
Couchbase Server service, including checking the current status. Refer to the
Ubuntu documentation for instructions. To provide initial setup for Couchbase,
open a web browser and access the web administration interface. See [Initial
Server Setup](#couchbase-getting-started-setup).

##Installing on Ubuntu as Non-Root, Non-Sudo

**This installation is for development purposes only.** There may be cases when you want to install the server as a non-root, non-sudo
user. If you perform a non-sudo, non-root installation you will be still be able to run Couchbase Server and all 
Couchbase command-line tools. To do so on Ubuntu:

 1. After you download the Couchbase DEB package, go to the directory where it is
    located and extract it:

     ```
     >  dpkg-deb -x couchbase-server-community_x86_64_2.0.0-1767-rel.deb $HOME
     ```

    In the directory where you extracted the files, you will see `opt` and `etc`
    subdirectories.

 1. After you extract the Couchbase Server install files, go to the subdirectory:

     ```
     cd opt/couchbase
     ```

 1. Run this password-related script:

     ```
     ./bin/install/reloc.sh `pwd`
     ```

    This enables you to continue the install as a non-root, non-sudo user.

 1. To run the server:

     ```
     ./bin/couchbase-server -- -noinput -detached
     ```

 1. To stop the server:

     ```
     ./bin/couchbase-server -k
     ```

For general instructions on server start-up and shutdown as a sudo or root user,
see [Server Startup and Shutdown](#couchbase-admin-basics-running).

<a id="couchbase-getting-started-install-win"></a>

# Microsoft Windows installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). To install on Windows,
download the Windows installer package. This is supplied as a Windows
executable. You can install the package either using the wizard, or by doing an
unattended installation process. In either case make sure that you have no
anti-virus software running on the machine before you start the installation
process. You also need administrator privileges on the machine where you install
it.

## Port Exhaustion on Windows

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

Couchbase Server uses the Microsoft C++ redistributable package, which will
automatically download for you during installation. However, if another
application on your machine is already using the package, your installation
process may fail. To ensure that your installation process completes
successfully, shut down all other running applications during installation.

For Windows 2008, you must upgrade your Windows Server 2008 R2 installation with
Service Pack 1 installed before running Couchbase Server. You can obtain Service
Pack 1 from [Microsoft
TechNet](http://technet.microsoft.com/en-us/library/ff817647(v=ws.10).aspx).

The standard Microsoft Server installation does not provide an adequate number
of ephemeral ports for Couchbase clusters. Without the correct number of open
ephemeral ports, you may experience errors during rebalance, timeouts on
clients, and failed backups. The Couchbase Server installer will check for your
current port setting and adjust it if needed. See [Microsoft
KB-196271](http://support.microsoft.com/kb/196271).

##Installation Wizard

 1. Double click on the downloaded executable file.

    The installer for windows will detect if any redistributable packages included
    with Couchbase need to be installed or not. If these packaged are not already on
    your system, the install will automatically install them along with Couchbase
    Server.

 1. Follow the install wizard to complete the installation.

    You will be prompted with the `Installation Location` screen. You can change the
    location where the Couchbase Server application is located. Note that this does
    not configure the location of where the persistent data will be stored, only the
    location of the server itself.

    The installer copies necessary files to the system. During the installation
    process, the installer will also check to ensure that the default administration
    port is not already in use by another application. If the default port is
    unavailable, the installer will prompt for a different port to be used for
    administration of the Couchbase server. The installer asks you to set up
    sufficient ports available for the node. By default Microsoft Server will not
    have an adequate number of ephemeral ports, see [Microsoft Knowledge Base
    Article 196271](http://support.microsoft.com/kb/196271)


    ![](../images/windows_port_check.png)

 1. Click Yes.

    Without a sufficient number of ephemeral ports, a Couchbase cluster fails during
    rebalance and backup; other operations such as client requests will timeout. If
    you already changed this setting you can click no. The installer will display
    this panel to confirm the update:


    ![](../images/windows_port_check2.png)

 1. Restart the server for the port changes to be applied.

After installation you should follow the server setup instructions. See [Initial
Server Setup](#couchbase-getting-started-setup).

## Unattended Installation

To use the unattended installation process, you first record your installation
settings in wizard installation. These settings are saved to a file. You can use
this file to silently install other nodes of the same version.

To record your install options, open a Command Terminal or Power and start the
installation executable with the `/r` command-line option:


```
> couchbase_server_version.exe /r /f1your_file_name.iss
```

You will be prompted with installation options, and the wizard will complete the
server install. We recommend you accept an increase in `MaxUserPort`. A file
with your options will be recorded at `C:\Windows\your_file_name.iss`.

To perform an installation using this recorded setup file, copy the
`your_file_name.iss` file into the same directory as the installer executable.
Run the installer from the command-line using the `/s` option:


```
> couchbase_server_version.exe /s -f1your_file_name.iss
```

You can repeat this process on multiple machines by copying the install package
and the `your_file_name.iss` file to the same directory on each machine.


<a id="couchbase-getting-started-install-macosx"></a>

# Mac OS X installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). Couchbase Server on Mac
OS X is for development purposes only. The Mac OS X installation uses a Zip file
which contains a standalone application that can be copied to the `Applications`
folder or to any other location you choose. The installation location is not the
same as the location of the Couchbase data files.

Please use the default archive file handler in Mac OS X, Archive Utility, when
you unpack the Couchbase Server distribution. It is more difficult to diagnose
non-functioning or damaged installations after extraction by other third party
archive extraction tools.

Due to limitations within the Mac OS X operating system, the Mac OS X
implementation is incompatible with other operating systems. It is not possible
either to mix operating systems within the same cluster, or configure XDCR
between a Mac OS X and Windows or Linux cluster. If you need to move data
between a Mac OS X cluster and a cluster hosted on another platform, use
`cbbackup` and `cbrestore`. For more information, see [Backup and Restore
Between Mac OS X and Other Platforms](#couchbase-backup-restore-mac).

To install:

 1. Delete any previous installs of Couchbase Server at the command line or by
    dragging the icon to the Trash can.

 1. Remove remaining files from previous installations:

	```
     	> rm -rf ~/Library/Application Support/Couchbase
     	> rm -rf ~/Library/Application Support/Membase
	```

 1. Download the Mac OS X zip file.

 1. Double-click the downloaded Zip installation file to extract the server. This
    will create a single folder, the `Couchbase Server.app` application.

 1. Drag and Drop `Couchbase Server.app` to your chosen installation folder, such as
    the system `Applications` folder.

After the installation completes, you can double-click on `Couchbase Server.app` to
start it. The Couchbase Server icon appears in the menu bar on the right-hand
side. If you have not yet configured your server, then the Couchbase Web Console
opens and you should to complete the Couchbase Server setup process. See
[Initial Server Setup](#couchbase-getting-started-setup) for more details.

The Couchbase application runs as a background application. If you click on the
icon in the menu bar you see a list of operations that can be performed.

The command line tools are included in the Couchbase Server application
directory. You can access them in Terminal by using the full path of the
Couchbase Server installation. By default, this is
`/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/`.

##Installing on Mac OS X as Non-Root, Non-Sudo

**This installation is for development purposes only.** There may be cases when you want to install the server as a non-root, non-sudo user. If you perform a non-sudo, non-root installation you will be still be able to run Couchbase Server and all Couchbase command-line tools. To do so on Mac OS X:

 1. After you download Couchbase Server, open Terminal and go to the Downloads
    directory:

     ```
     cd ~/Downloads/
     ```

 1. Unzip the package containing Couchbase Server:

     ```
     open couchbase-server-enterprise_x86_64_2.1.0.zip
     ```

 1. Move Couchbase App to your `/Applications` folder:

     ```
     mv couchbase-server-enterprise_x86_64_2.1.0/Couchbase\ Server.app /Applications/
     ```

 1. Start the server from Terminal:

     ```
     open /Applications/Couchbase\ Server.app
     ```

    This will enable you to use Couchbase Server as a non-sudo, non-root user.

 1. To stop the server, Click on the Couchbase icon in the menu bar and select Quit
    Couchbase Server.

For general instructions on server start-up and shutdown as a sudo or root user,
see [Server Startup and Shutdown](#couchbase-admin-basics-running).

<a id="couchbase-getting-started-setup"></a>

# Initial Server Setup

We recommend that you clear your browser cache before doing the setup process.
You can find notes and tips on how to do this on different browsers and
platforms on [this page](http://www.wikihow.com/Clear-Your-Browser's-Cache).

On all platforms you can access the web console by connecting to the embedded
web server on port 8091. For example, if your server can be identified on your
network as `servera`, you can access the web console by opening
`http://servera:8091/`. You can also use an IP address or, if you are on the
same machine, `http://localhost:8091`. If you set up Couchbase Server on another
port other than `8091`, go to that port.

 1. Open Couchbase Web Console.

 1. Set the disk storage and cluster configuration.

    The `Configure Disk Storage` option specifies the location of the persistent
    storage used by Couchbase Server. The setting affects only this node and sets
    the directory where all the data will be stored on disk. This will also set
    where the indices created by views will be stored. If you are not indexing data
    with views you can accept the default setting. For the best performance, you may
    want to configure different disks for the server, for storing your document and
    for index data. For more information on best practices and disk storage, see
    [Disk Throughput and Sizing](#couchbase-bestpractice-sizing-disk).

    The `Configure Server Memory` section sets the amount of physical RAM that will
    be allocated by Couchbase Server for storage. For more information and
    guidelines, see [RAM Sizing](#couchbase-bestpractice-sizing-ram).

    If you are creating a new cluster, this is the amount of memory that will be
    allocated on each node within your Couchbase cluster. The memory for each node
    in a cluster must be the same amount. You must specify a value that can be
    supported by all the nodes in your cluster as this setting will apply to the
    entire cluster.

    The default value is 60% of your total free RAM. This figure is designed to
    allow RAM capacity for use by the operating system caching layer when accessing
    and using views.

 1. Provide a node IP or hostname under Configure Server Hostname. For more details
    about using hostnames see [Using Hostnames with Couchbase
    Server](#couchbase-getting-started-hostnames).


    ![](../images/configure_server1.png)

 1. Provide the IP Address or hostname of an existing node, and administrative
    credentials for that existing cluster.

 1. To join an existing cluster, Check Join a cluster now.

 1. Click Next.

    The Sample Buckets panel appears where you can select the sample data buckets
    you want to load.

 1. Click the names of sample buckets to load Couchbase Server. These data sets
    demonstrate Couchbase Server and help you understand and develop views. If you
    decide to install sample data, the installer creates one Couchbase bucket for
    each set of sample data you choose.


    ![](../images/web-console-startup-3.png)

    For more information on the contents of the sample buckets, see [Couchbase
    Sample Buckets](#couchbase-sampledata). After you create sample data buckets a
    Create Bucket panel appears where you create new data buckets

 1. Set up a test bucket for Couchbase Server. You can change all bucket settings
    later except for the bucket name.

    Enter 'default' as the bucket name and accept all other defaults in this panel.
    For more information about creating buckets, see [Creating and Editing Data
    Buckets](#couchbase-admin-web-console-data-buckets-createedit).

    Couchbase Server will create a new data bucket named 'default.' You can use this
    test bucket to learn more about Couchbase and can use it in a test environment.

 1. Select `Update Notifications`.

    Couchbase Web Console communicates with Couchbase nodes and confirms the version
    numbers of each node. As long as you have internet access, this information will
    be sent anonymously to Couchbase corporate.. Couchbase corporate only uses this
    information to provide you with updates and information that will help us
    improve Couchbase Server and related products.

    When you provide an email address we will add it to the Couchbase community
    mailing list for news and update information about Couchbase and related
    products. You can unsubscribe from the mailing list at any time using the
    unsubscribe link provided in each newsletter. Web Console communicates the
    following information:

     * The current version. When a new version of Couchbase Server exists, you get
       information on where you can download the new version.

     * Information about the size and configuration of your Couchbase cluster to
       Couchbase corporate. This information helps us prioritize our development
       efforts.

 1. Enter a username and password. Your username must have no more than 24
    characters, and your password must have 6 to 24 characters. You use these
    credentials each time you add a new server into the cluster. These are the same
    credentials you use for Couchbase REST API. See, [Using the REST
    API](#couchbase-admin-restapi).

Once you finish this setup, you see Couchbase Web Console with the Cluster
Overview page:


![](../images/web-console-startup-7.png)

Your server is now running and ready to use. After you install your server and
finish initial setup you can also optionally configure other settings, such as
the port, RAM, using any of the following methods:

##Using command-line tools

   The command line tools provided with your Couchbase Server installation includes
   `couchbase-cli`. This tool provides access to the core functionality of the
   Couchbase Server by providing a wrapper to the REST API. For information about
   CLI, see [couchbase-cli Tool](#couchbase-admin-cmdline-couchbase-cli).

##Using the REST API

   Couchbase Server can be configured and controlled using a REST API. In fact, the
   REST API is the basis for both the command-line tools and Web interface to
   Couchbase Server.

   For more information on using the REST API see, [Using the REST
   API](#couchbase-admin-restapi).

<a id="couchbase-getting-started-hostnames"></a>

# Using Hostnames with Couchbase Server

When you first install Couchbase Server you can access using a default IP
address. There may be cases where you want to provide a hostname for each
instance of a server. Each hostname you provide should be a valid one and will
ultimately resolve to a valid IP Address. This section describes how you provide
hostnames on Windows and Linux for the different versions of Couchbase Server.
If you restart a node, it will use the hostname once again. If you failover or
remove a node from a cluster, the node needs to be configured with the hostname
once again.

## Couchbase 2.1+ Linux and Windows

There are several ways you can provide hostnames for Couchbase 2.1+. You can
provide a hostname when you install a Couchbase Server 2.1 on a machine, when
you add the node to an existing cluster for online upgrade, or via a REST API
call. Couchbase Server stores this in a config file on disk. For earlier
versions of Couchbase Server you must follow a manual process where you edit
config files for each node which we describe below.

## On Initial Setup

In the first screen that appears when you first log into Couchbase Server, you
can provide either a hostname or IP address under **Configure Server Hostname**.
Any hostname you provide will survive node restart:


![](../images/configure_server1.png)

##While Adding a Node

If you add a new 2.1+ node to an existing 2.0.1 or older Couchbase cluster you
should first setup the hostname for the 2.1+ node in the setup wizard. If you
add a new 2.1+ node to a 2.1 cluster you can provide either a hostname or IP
address under **Add Server**. You provide it in the **Server IP Address** field:


![](../images/hostname_add_node.png)

##Providing Hostnames via REST API

The third way you can provide a node a hostname is to do a REST request at the
endpoint `http://127.0.0.1:8091/node/controller/rename`. If you use this method,
you should provide the hostname before you add a node to a cluster. If you
provide a hostname for a node that is already part of a Couchbase cluster; the
server will reject the request and return `error 400 reason: unknown ["Renaming
is disallowed for nodes that are already part of a cluster"]`.:


```
curl -v -X POST -u Administrator:asdasd \
http://127.0.0.1:8091/node/controller/rename -d hostname=shz.localdomain
```

Where you provide the IP address and port for the node and administrative
credentials for the cluster. The value you provide for `hostname` should be a
valid hostname for the node. Possible errors that may occur when you do this
request:

 * Could not resolve the hostname. The hostname you provide as a parameter does not
   resolve to a IP address.

 * Could not listen. The hostname resolves to an IP address, but no network
   connection exists for the address.

 * Could not rename the node because name was fixed at server start-up.

 * Could not save address after rename.

 * Requested name hostname is not allowed. Invalid hostname provided.

 * Renaming is disallowed for nodes that are already part of a cluster.

##Hostnames when upgrading to 2.1

If you perform an offline upgrade from Couchbase 1.8.1+ to 2.1 (Linux and Windows)and you have a
configured hostname using the instructions here [Handling Changes in IP
Addresses](#couchbase-bestpractice-cloud-ip), a 2.1 server will use this
configuration.

If you perform an online upgrade from 1.8.1+ to 2.1, you should add the hostname
when you create the new 2.1 node. For more information about upgrading between
versions, see [Upgrading to Couchbase Server
2.1](#couchbase-getting-started-upgrade)

**Hostnames and the Cloud (such as EC2, Azure, etc)**. For more information about handling
IP addresses and hostnames, see [Handling Changes in IP
Addresses](#couchbase-bestpractice-cloud-ip).

<a id="couchbase-getting-started-hostnames-pre2.0"></a>

## Hostnames for Couchbase Server 2.0.1 and Earlier

For 2.0.1 please follow the same steps for 2.0 and earlier. The one difference
between versions is the name and location of the file you change.

This operation on both Linux and Windows is data destructive. This process will
reinitialize the node and remove all data on the node. You may want to perform a
backup of node data before you perform this operation, see [cbbackup
Tool](#couchbase-admin-cmdline-cbbackup).

### Hostnames for Linux 2.0.1 and earlier

 1. Install Couchbase Server.

 1. Execute:

     ```
     sudo /etc/init.d/couchbase-server stop
     ```

 1. For 2.0, edit the `start()` function in the script located at
    `/opt/couchbase/bin/couchbase-server`. You do not need to edit this file for
    2.0.1.

    Under the line that reads:

     ```
     -run ns_bootstrap -- \
     ```

    Add a new line that reads:

     ```
     -name ns_1@hostname \
     ```

    Where `hostname` is either a DNS name or an IP address that you want this server
    to identify the node (the 'ns\_1@' prefix is mandatory). For example:

     ```
     ...
          -run ns_bootstrap -- \
          -name ns_1@couchbase1.company.com \
          -ns_server config_path "\"/opt/couchbase/etc/couchbase/static_config\"" \
     ...
     ```

 1. Edit the IP address configuration file.

    For Linux 2.0 this is `/opt/couchbase/var/lib/couchbase/ip`. This file contains
    the identified IP address of the node once it is part of a cluster. Open the
    file, and add a single line containing the `hostname`, as configured in the
    previous step.

    For Linux 2.0.1. You update the ip\_start file with the hostname. The file is at
    this location: /opt/couchbase/var/lib/couchbase/ip\_start.

 1. Delete the files under:

     * `/opt/couchbase/var/lib/couchbase/data/*`

     * `/opt/couchbase/var/lib/couchbase/mnesia/*`

     * `/opt/couchbase/var/lib/couchbase/config/config.dat`

 1. Execute:

     ```
     sudo /etc/init.d/couchbase-server start
     ```

 1. You can see the correctly identified node as the hostname under the Manage
    Servers page. You will again see the setup wizard since the configuration was
    cleared out; but after completing the wizard the node will be properly
    identified.

### Hostnames for Windows 2.0.1 and earlier

 1. Install Couchbase Server.

 1. Stop the service by running:

     ```
     > C:\Program Files\Couchbase\Server\bin\service_stop.bat
     ```

 1. Unregister the service by running:

     ```
     > C:\Program Files\Couchbase\Server\bin\service_unregister.bat
     ```

 1. For 2.0, edit the script located at
    `C:\Program Files\Couchbase\Server\bin\service_register.bat`. You do not need
    this step for 2.0.1.

     * On the 7th line it says: `set NS_NAME=ns_1@%IP_ADDR%`

     * Replace `%IP_ADDR%` with the hostname/IP address that you want to use.

 1. Edit the IP address configuration file.

    For Windows 2.0 edit `C:\Program Files\Couchbase\Server\var\lib\couchbase\ip`.
    This file contains the identified IP address of the node once it is part of a
    cluster. Open the file, and add a single line containing the `hostname`, as
    configured in the previous step.

    For Windows 2.0.1. Provide the hostname in `C:\Program
    Files\Couchbase\Server\var\lib\couchbase\ip_start.`

 1. Register the service by running the modified script:
    `C:\Program Files\Couchbase\Server\bin\service_register.bat`

 1. Delete the files located under:
    `C:\Program Files\Couchbase\Server\var\lib\couchbase\mnesia`.

 1. Start the service by running:

     ```
     > C:\Program Files\Couchbase\Server\bin\service_start.bat
     ```

 1. See the node correctly identifying itself as the hostname in the GUI under the
    Manage Servers page. Note you will be taken back to the setup wizard since the
    configuration was cleared out, but after completing the wizard the node will be
    named properly.


<a id="couchbase-getting-started-nextsteps"></a>

# Next Steps

 * For basic instructions on using your Couchbase Server installation, see
   [Administration Basics](#couchbase-admin-basics).

 * For information on deploying and building your Couchbase Server cluster, see
   [Deployment Strategies](#couchbase-deployment).

 * For instructions on how to use the Couchbase Web Console to manage your
   Couchbase Server installation, see [Using the Web
   Console](#couchbase-admin-web-console).

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
