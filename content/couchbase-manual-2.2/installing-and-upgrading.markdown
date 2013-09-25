# Installing and Upgrading

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

<a id="couchbase-getting-started-prepare"></a>

## Preparation

Mixed deployments, such as cluster with both Linux and Windows server nodes are
not supported. This incompatibility is due to differences in the number of
shards between platforms. It is not possible either to mix operating systems
within the same cluster, or configure XDCR between clusters on different
platforms. You should use same operating system on all machines within a cluster
and on the same operating systems on multiple clusters if you perform XDCR
between the clusters.

Your system should meet the following system requirements.

<a id="couchbase-getting-started-prepare-platforms"></a>

### Supported Platforms

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

### Resource Requirements

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

### Supported Web Browsers

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

### Network Ports

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
11211                      | Client interface (proxy)      | No           | Yes            | No                     | No  
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
Couchbase Server, see [Uninstalling Couchbase Server](#couchbase-uninstalling).

To perform an upgrade installation while retaining your existing dataset, see
[Upgrading to Couchbase Server 2.1](#couchbase-getting-started-upgrade).

<a id="couchbase-getting-started-install-redhat"></a>

### Red Hat Linux Installation

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

###Installing on CentOS/RHEL as Non-Root, Non-Sudo 

**This installation is for development purposes only.** There may be cases when you want to install the server as a non-root, non-sudo
user. If you perform a non-sudo, non-root installation you will be still be able to run Couchbase Server and all 
Couchbase command-line tools. To do so on CentOS/Red Hat:

 1. After you download the Couchbase RPM, go to the directory where it is located
    and extract it:

     ```
     > rpm2cpio couchbase-server-community_x86_64_2.0.0-1767-rel.rpm | cpio --extract --make-directories \
     --no-absolute-filenames
     ```

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

### Ubuntu Linux Installation

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

###Installing on Ubuntu as Non-Root, Non-Sudo

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

### Microsoft Windows Installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). To install on Windows,
download the Windows installer package. This is supplied as a Windows
executable. You can install the package either using the wizard, or by doing an
unattended installation process. In either case make sure that you have no
anti-virus software running on the machine before you start the installation
process. You also need administrator privileges on the machine where you install
it.

### Port Exhaustion on Windows

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

**Installation Wizard**

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


    ![](images/windows_port_check.png)

 1. Click Yes.

    Without a sufficient number of ephemeral ports, a Couchbase cluster fails during
    rebalance and backup; other operations such as client requests will timeout. If
    you already changed this setting you can click no. The installer will display
    this panel to confirm the update:


    ![](images/windows_port_check2.png)

 1. Restart the server for the port changes to be applied.

After installation you should follow the server setup instructions. See [Initial
Server Setup](#couchbase-getting-started-setup).

**Unattended Installation**

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

### Mac OS X Installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms).Couchbase Server on Mac
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
between a Mac OS X cluster and a cluster hosted on another platform, please use
`cbbackup` and `cbrestore`. For more information, see [Backup and Restore
Between Mac OS X and Other Platforms](#couchbase-backup-restore-mac).

To install:

 1. Delete any previous installs of Couchbase Server at the command line or by
    dragging the icon to the Trash can.

 1. Remove remaining files from previous installations:

     ```
     > rm -rf ~/Library/Application Support/Couchbase

     >rm -rf ~/Library/Application Support/Membase
     ```

 1. Download the Mac OS X Zip file.

 1. Double-click the downloaded Zip installation file to extract the server. This
    will create a single folder, the `Couchbase Server.app` application.

 1. Drag and Drop `Couchbase Server.app` to your chosen installation folder, such as
    the system `Applications` folder.

Once the install completes, you can double-click on `Couchbase Server.app` to
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

###Installing on Mac OS X as Non-Root, Non-Sudo

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

## Initial Server Setup

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


    ![](images/configure_server1.png)

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


    ![](images/web-console-startup-3.png)

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


![](images/web-console-startup-7.png)

Your server is now running and ready to use. After you install your server and
finish initial setup you can also optionally configure other settings, such as
the port, RAM, using any of the following methods:

 * **Using command-line tools**

   The command line tools provided with your Couchbase Server installation includes
   `couchbase-cli`. This tool provides access to the core functionality of the
   Couchbase Server by providing a wrapper to the REST API. For information about
   CLI, see [couchbase-cli Tool](#couchbase-admin-cmdline-couchbase-cli).

 * **Using the REST API**

   Couchbase Server can be configured and controlled using a REST API. In fact, the
   REST API is the basis for both the command-line tools and Web interface to
   Couchbase Server.

   For more information on using the REST API see, [Using the REST
   API](#couchbase-admin-restapi).

<a id="couchbase-getting-started-hostnames"></a>

## Using Hostnames with Couchbase Server

When you first install Couchbase Server you can access using a default IP
address. There may be cases where you want to provide a hostname for each
instance of a server. Each hostname you provide should be a valid one and will
ultimately resolve to a valid IP Address. This section describes how you provide
hostnames on Windows and Linux for the different versions of Couchbase Server.
If you restart a node, it will use the hostname once again. If you failover or
remove a node from a cluster, the node needs to be configured with the hostname
once again.

**Couchbase 2.1 Linux and Windows**

There are several ways you can provide hostnames for Couchbase 2.1+. You can
provide a hostname when you install a Couchbase Server 2.1 on a machine, when
you add the node to an existing cluster for online upgrade, or via a REST-API
call. Couchbase Server stores this in a config file on disk. For earlier
versions of Couchbase Server you must follow a manual process where you edit
config files for each node which we describe below.

**On Initial Setup**

In the first screen that appears when you first log into Couchbase Server, you
can provide either a hostname or IP address under **Configure Server Hostname**.
Any hostname you provide will survive node restart:


![](images/configure_server1.png)

**While Adding a Node**

If you add a new 2.1+ node to an existing 2.0.1 or older Couchbase cluster you
should first setup the hostname for the 2.1+ node in the setup wizard. If you
add a new 2.1+ node to a 2.1 cluster you can provide either a hostname or IP
address under **Add Server**. You provide it in the **Server IP Address** field:


![](images/hostname_add_node.png)

**Providing Hostnames via REST-API**

The third way you can provide a node a hostname is to do a REST request at the
endpoint `http://127.0.0.1:9000/node/controller/rename`. If you use this method,
you should provide the hostname before you add a node to a cluster. If you
provide a hostname for a node that is already part of a Couchbase cluster; the
server will reject the request and return `error 400 reason: unknown ["Renaming
is disallowed for nodes that are already part of a cluster"]`.:


```
curl -v -X POST -u Administrator:asdasd \
http://127.0.0.1:9000/node/controller/rename -d hostname=shz.localdomain
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

**Upgrading to 2.1 on Linux and Windows**

If you perform an offline upgrade from Couchbase 1.8.1+ to 2.1 and you have a
configured hostname using the instructions here [Handling Changes in IP
Addresses](#couchbase-bestpractice-cloud-ip), a 2.1 server will use this
configuration.

If you perform an online upgrade from 1.8.1+ to 2.1, you should add the hostname
when you create the new 2.1 node. For more information about upgrading between
versions, see [Upgrading to Couchbase Server
2.1](#couchbase-getting-started-upgrade)

**In the Cloud (such as EC2, Azure, etc)**. For more information about handling
IP addresses and hostnames, see [Handling Changes in IP
Addresses](#couchbase-bestpractice-cloud-ip).

<a id="couchbase-getting-started-hostnames-pre2.0"></a>

### Hostnames for Couchbase Server 2.0.1 and Earlier

For 2.0.1 please follow the same steps for 2.0 and earlier. The one difference
between versions is the name and location of the file you change.

This operation on both Linux and Windows is data destructive. This process will
reinitialize the node and remove all data on the node. You may want to perform a
backup of node data before you perform this operation, see [cbbackup
Tool](#couchbase-admin-cmdline-cbbackup).

**For Linux 2.0.1 and Earlier:**

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

**For Windows 2.0.1 and Earlier** :

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

<a id="couchbase-getting-started-upgrade"></a>

## Upgrading to Couchbase Server 2.1

The following are officially supported upgrade paths for Couchbase Server for
both online upgrades or offline upgrades:

 * Couchbase 1.8.1 to Couchbase 2.0.x and above

 * Couchbase 2.0 to Couchbase 2.0.x and above

 * Couchbase 2.0.1 to Couchbase 2.1 and above

If you want to upgrade from 1.8.0 to 2.0 +, you must have enough disk space
available for both your original Couchbase Server 1.8 data files and the new
format for Couchbase Server 2.0 files. You will also need additional disk space
for new functions such as indexing and compaction. You will need approximately
three times the disk space.

You cannot perform a direct upgrade from Couchbase Server 1.8.0 to 2.0+. You
must first upgrade from Couchbase Server 1.8 or earlier to Couchbase Server
1.8.1 to provide data compatibility with Couchbase Server 2.0 +. After you
perform this initial upgrade you can then upgrade to 2.0+.

You can perform a cluster upgrade in two ways:

 * **Online Upgrades**

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
   online upgrade, see [Standard Online
   Upgrades](#couchbase-getting-started-upgrade-online).

   Standard online upgrades may take a while because each node must be taken out of
   the cluster, upgraded to a current version, brought back into the cluster, and
   then rebalanced. However since you can upgrade the cluster without taking the
   cluster down, you may prefer this upgrade method. For instructions on online
   upgrades, see [Standard Online
   Upgrades](#couchbase-getting-started-upgrade-online).

   For swap rebalance, you add a node to the cluster then perform a swap rebalance
   to shift data from an old node to a new node. You might prefer this approach if
   you do not have enough cluster capacity to handle data when you remove an old
   node. This upgrade process is also much quicker than performing a standard
   online upgrade because you only need to rebalance each upgraded node once. For
   more information on swap rebalance, see [Swap
   Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

 * **Offline Upgrades**

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
   upgrade, see [Offline Upgrade
   Process](#couchbase-getting-started-upgrade-offline).

<a id="table-couchbase-getting-started-upgrade"></a>

Feature                       | Online Upgrades                                 | Offline Upgrades                     
------------------------------|-------------------------------------------------|--------------------------------------
Applications Remain Available | Yes                                             | No                                   
Cluster Stays in Operation    | Yes                                             | No                                   
Cluster must be Shutdown      | No                                              | Yes                                  
Time Required                 | Requires Rebalance, Upgrade, Rebalance per Node | All nodes in Cluster Upgraded at Once

### Backup your data before performing an upgrade

Before you perform an upgrade, whether it is online or offline, you should
backup your data, see [Backup and Restore](#couchbase-backup-restore).

<a id="couchbase-getting-started-upgrade-online-swap"></a>

### Online Upgrade with Swap Rebalance

You can perform a swap rebalance to upgrade your nodes to Couchbase Server 2.0+,
without reducing the performance of your cluster. This is the preferred method
for performing and online upgrade of your cluster because cluster capacity is
always maintained throughout the upgrade. If you are unable to perform an
upgrade via swap rebalance, you may perform an standard online upgrade, see
[Standard Online Upgrades](#couchbase-getting-started-upgrade-online). For
general information on swap rebalance, see [Swap
Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

You will need at least one extra node to perform a swap rebalance.

 1. Install Couchbase Server 2.0 on one extra machine that is not yet in the
    cluster. For install instructions, see [Installing Couchbase
    Server](#couchbase-getting-started-install).

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    Tool](#couchbase-admin-cmdline-cbbackup).

 1. Open Couchbase Web Console at an existing node in the cluster.

 1. Go to `Manage->Server Nodes`. In the Server panel you can view and managing
    servers in the cluster:


    ![](images/upgrade_addserver.png)

 1. Click Add Server. A panel appears where you can provide credentials and either a
    host name or IP address for the new node: *At this point you can provide a
    hostname for the node you add. For more information, see.*


    ![](images/online-upgrade-addnode.png)

 1. Remove one of your existing old nodes to from the cluster. Under Server Nodes |
    Server panel, Click Remove Server for the node you want to remove. This will
    flag this server for removal.

 1. In the Server panel, click Rebalance.

    The rebalance will automatically take all data from the node flagged for removal
    and move it to your new node.

Repeat these steps for all the remaining old nodes in the cluster. You can add
and remove multiple nodes from a cluster, however you should always add the same
number of nodes from the cluster as you remove. For instance if you add one
node, remove one node and if you add two nodes, you can remove two.

Until you upgrade all nodes in a cluster from 1.8.1 or earlier to Couchbase
Server 2.0+, any features in 2.0+ will be disabled. This means views or XDCR
will not yet function until you migrate all nodes in your cluster to 2.0+. After
you do so, they will be enabled for your use.

For general information on swap rebalance, see [Swap
Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

<a id="couchbase-getting-started-upgrade-online"></a>

### Standard Online Upgrades

This is also known as a standard online upgrade process and it can take place
without taking down the cluster or your application. This means that the cluster
and applications can continue running while you upgrade the individual nodes in
a cluster to the latest Couchbase version. You should only use this online
upgrade method if you are not able to perform online upgrade via swap rebalance,
see [Online Upgrade with Swap
Rebalance](#couchbase-getting-started-upgrade-online-swap).

As a best practice, you should always add the same number of nodes a to a
cluster as the number you remove and then perform rebalance. While it is
technically possible you should avoid removing a node, rebalancing then adding
back nodes into the cluster. This would reduce your cluster capacity while you
add the new node back into the cluster, which could lead to data being ejected
to disk.

For information on upgrading from Couchbase Server 1.8 to Couchbase Server 2.1,
see [Upgrades Notes 1.8.1 to 2.1](#couchbase-getting-started-upgrade-1-8-2-0).
You cannot directly upgrade from Couchbase Server 1.8 to 2.0+, instead you must
first upgrade to Couchbase Server 1.8.1 for data compatibility and then upgrade
to Couchbase Server 2.1+.

To perform an standard, online upgrade of your cluster:

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    Tool](#couchbase-admin-cmdline-cbbackup).

 1. Choose a node to remove from the cluster and upgrade. You can upgrade one node
    at a time, or if you have enough cluster capacity, two nodes at a time. We do
    not recommend that you remove more than two nodes at a time for this upgrade.

 1. In Couchbase Web Console under `Manage->Server Nodes` screen, click `Remove
    Server`. This marks the server for removal from the cluster, but does not
    actually remove it.


    ![](images/online-upgrade-removenode.png)

 1. The `Pending Rebalance` shows servers that require a rebalance. Click the
    `Rebalance` button next to the node you will remove.


    ![](images/online-upgrade-rebalance.png)

    This will move data from the node to remaining nodes in cluster. Once
    rebalancing has been completed, the `Server Nodes` display should display only
    the remaining, active nodes in your cluster.


    ![](images/online-upgrade-noderemoved.png)

 1. Perform an individual node upgrade to the latest version of Couchbase Server.
    See [Upgrading Individual Nodes](#couchbase-getting-started-upgrade-individual).

    Couchbase Server starts automatically after the upgrade. You now need to add the
    node back to the cluster.

 1. Open Web Console for an existing node in the cluster.

 1. Go to `Manage->Server Nodes`.

 1. Click the `Add Server` button. You will see a prompt to add a node to the
    cluster.

    *At this point you can provide a hostname for the new node you add. For more
    information, see.*


    ![](images/online-upgrade-addnode.png)

    After you add the new node, the Pending Rebalance count will indicate that
    servers need to be rebalanced into the cluster.

 1. Click `Rebalance` to rebalance the cluster and bring the new node into an active
    state.

Repeat these steps for each node in the cluster in order to upgrade the entire
cluster to a new version.

<a id="couchbase-getting-started-upgrade-offline"></a>

### Offline Upgrade Process

The offline upgrade process requires you to shutdown all the applications and
then the entire Couchbase Server cluster. You can then perform the upgrade the
software on each machine, and bring your cluster and application back up again.

If you are upgrade from Couchbase Server 1.8 to Couchbase 2.0 there are more
steps for the upgrade because you must first upgrade to Couchbase 1.8.1 for data
compatibility with 2.0. For more information, see [Upgrades Notes 1.8.1 to
2.1](#couchbase-getting-started-upgrade-1-8-2-0).

Check that your disk write queue ( [Disk Write
Queue](#couchbase-monitoring-diskwritequeue) ) is completely drained to ensure
all data has been persisted to disk and will be available after the upgrade. It
is a best practice to turn off your application and allow the queue to drain
before you upgrade it. It is also a best practice to perform a backup of all
data before you upgrade

To perform an offline upgrade:

 1. Under Settings | Auto-Failover, disable auto-failover for all nodes in the
    cluster. If you leave this enabled, the first node that you shut down will be
    auto-failed-over. For instructions, see [Enabling Auto-Failover
    Settings](#couchbase-admin-web-console-settings-autofailover).

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


    ![](images/upgrade_disk_write_zero.png)

 1. Create a backup of your cluster data using `cbbackup`. See [cbbackup
    Tool](#couchbase-admin-cmdline-cbbackup).

 1. Shutdown Couchbase Server on each machine in your cluster. For instructions, see
    [Server Startup and Shutdown](#couchbase-admin-basics-running)

 1. After you shutdown your nodes, perform a standard node upgrade to the new
    version of Couchbase Server. See [Upgrading Individual
    Nodes](#couchbase-getting-started-upgrade-individual) for instructions.

    Couchbase Server starts automatically on each node after you perform the node
    upgrade.

 1. As the cluster warms up, you can monitor the status of the warmup process to
    determine when you can switch on your application. See [Monitoring startup
    (warmup)](#couchbase-monitoring-startup).

Once the cluster finishes warmup, you can re-enable your application on the
upgraded cluster.

<a id="couchbase-getting-started-upgrade-individual"></a>

## Upgrading Individual Nodes

Whether you are performing an online or offline upgrade, the steps for upgrading
an individual nodes in a cluster remain the same:

 1. Download Couchbase Server

 1. Backup data for that node. To backup an existing Couchbase Server installation,
    use `cbbackup`. See [Backing Up Using
    cbbackup](#couchbase-backup-restore-backup-cbbackup).

 1. Backup the node-specific configuration files. While the upgrade script perform a
    backup of the configuration and data files, as a best practice you should make
    your own backup of these files:

    <a id="table-couchbase-getting-started-upgrade-individual"></a>

    Platform | Location
    ---------|-------------------------------------------------------------------------------
    Linux    | `/opt/couchbase/var/lib/couchbase/config/config.dat`
    Windows  | `C:\Program Files\Couchbase\Server\Config\var\lib\couchbase\config\config.dat`

 1. Stop Couchbase Server. For instructions, see [Server Startup and
    Shutdown](#couchbase-admin-basics-running).

 1. Check your hostname configurations. If you have deployed Couchbase Server in a
    cloud service, or you are using hostnames rather than IP addresses, you must
    ensure that the hostname has been configured correctly before performing the
    upgrade. See [Using Hostnames with Couchbase
    Server](#couchbase-getting-started-hostnames)

 1. Check for required components and if needed, install them. This ensures that
    Couchbase Server upgrades and migrates your existing data files. See [Upgrades
    Notes 1.8.1 to 2.1](#couchbase-getting-started-upgrade-1-8-2-0).

 1. Perform the installation upgrade for your platform:

    **RHEL/CentOS**

    You can perform an upgrade install using the RPM package — this will keep the
    data and existing configuration.

     ```
     root-> rpm -U couchbase-server-architecture___meta_current_version__.rpm
     ```

    **Ubuntu/Debian Linux**

    You can perform a package upgrade by installing the updated `.pkg` package:

     ```
     > sudo dpkg -i couchbase-server-architecture___meta_current_release.deb
     ```

    **Windows**

    The Install Wizard will upgrade your server installation using the same
    installation location. For example, if you have installed Couchbase Server in
    the default location, `C:\Program Files\Couchbase\Server`, the Couchbase Server
    installer will put the latest version at the same location.

<a id="couchbase-getting-started-upgrade-1-8-2-0"></a>

## Upgrades Notes 1.8.1 to 2.1

You can upgrade from Couchbase Server 1.8.1 to Couchbase Server 2.1+ using
either the online or offline upgrade method. See [Upgrading to Couchbase Server
1.8](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-getting-started-upgrade.html)
for more information.

**Use Online Upgrades for Couchbase Server 1.8.1 to Couchbase Server 2.1+**

We recommend online upgrade method for 1.8.1 to 2.1+. The process is quicker and
can take place while your cluster and application are up and running. When you
upgrade from Couchbase Server 1.8.1 to Couchbase Server 2.1+, the data files are
updated to use the new Couchstore data format instead of the SQLite format used
in 1.8.1 and earlier. This increases the upgrade time, and requires additional
disk space to support the migration.

Be aware that if you perform a scripted online upgrade from 1.8.1 to 2. you
should have a 10 second delay from adding a 2.1+ node to the cluster and
rebalancing. If you request rebalance too soon after adding a 2.1+ node, the
rebalance may fail.

**Linux Upgrade Notes for 1.8.1 to 2.1+**

When you upgrade from Couchbase Server 1.8 to Couchbase Server 2.1+ on Linux,
you should be aware of the **OpenSSL** requirement. OpenSSL is a required
component and you will get an error message during upgrade if it is not
installed. To install it Red Hat-based systems, use `yum` :


```
root-> yum install openssl098e
```

On Debian-based systems, use `apt-get` to install the required OpenSSL package:


```
> sudo apt-get install libssl0.9.8
```

**Windows Upgrade Notes for 1.8.1 to 2.1+**

If you have configured your Couchbase Server nodes to use hostnames, rather than
IP addresses, to identify themselves within the cluster, you must ensure that
the IP and hostname configuration is correct both before the upgrade and after
upgrading the software. See [Hostnames for Couchbase Server 2.0.1 and
Earlier](#couchbase-getting-started-hostnames-pre2.0).

**Mac OS X Notes for 1.8.1 to 2.1+**

There is currently no officially supported upgrade installer for Mac OS X. If you
want to migrate to 1.8.1 to 2.1+ on OS X, you must make a backup of your data
files with `cbbackup`, install the latest version, then restore your data with
`cbrestore`. For more information, see [cbbackup
Tool](#couchbase-admin-cmdline-cbbackup) and [cbrestore
Tool](#couchbase-admin-cmdline-cbrestore).

<a id="couchbase-getting-started-upgrade-1-8-2-0-process"></a>

### Upgrade Notes 1.8 and Earlier to 2.1+

If you run Couchbase Server 1.8 or earlier, including Membase 1.7.2 and earlier,
you must upgrade to Couchbase Server 1.8.1 first.You do this so that your data
files can convert into 2.0 compatible formats. This conversion is only available
from 1.8.1 to 2.0 + upgrades.

 * **Offline Upgrade**

 * To perform an offline upgrade, you use the standard installation system such as
   `dpkg`, `rpm` or Windows Setup Installer to upgrade the software on each
   machine. Each installer will perform the following operations:

    * Shutdown Couchbase Server 1.8. Do not uninstall the server.

    * Run the installer. The installer will detect any prerequisite software or
      components. An error is raised if the pre-requisites are missing. If you install
      additional required components such as OpenSSL during the upgrade, you must
      manually restart Couchbase after you install the components.

      The installer will copy 1.8.1-compatible data and configuration files to a
      backup location.

      The `cbupgrade` program will automatically start. This will non-destructively
      convert data from the 1.8.1 database file format (SQLite) to 2.0 database file
      format (couchstore). The 1.8 database files are left "as-is", and new 2.0
      database files are created. There must be enough disk space to handle this
      conversion operation (e.g., 3x more disk space).

   The data migration process from the old file format to the new file format may
   take some time. You should wait for the process to finish before you start
   Couchbase Server 2.0.

   Once the upgrade process finishes, Couchbase Server 2.0 starts automatically.
   Repeat this process on all nodes within your cluster.

<a id="couchbase-getting-started-upgrade-cetoee"></a>

### Upgrading from Community Edition to Enterprise Edition

**You should use the same version number when you perform the migration process
to prevent version differences which may result in a failed upgrade.** To
upgrade between Couchbase Server Community Edition and Couchbase Server
Enterprise Edition, you can use two methods:

 * Perform an online upgrade

   Here you remove one node from the cluster and rebalance. On the nodes you have
   taken out of the cluster, uninstall Couchbase Server Community Edition package,
   and install Couchbase Server Enterprise Edition. You can then add the new nodes
   back into the cluster and rebalance. Repeat this process until the entire
   cluster is using the Enterprise Edition.

   For more information on performing online upgrades, see [Standard Online
   Upgrades](#couchbase-getting-started-upgrade-online).

 * Perform an offline upgrade

   Shutdown the entire cluster, and uninstall Couchbase Server Community Edition
   from each machine. Then install Couchbase Server Enterprise Edition. The data
   files will be retained, and the cluster can be restarted.

   For more information on performing offline upgrades, see [Offline Upgrade
   Process](#couchbase-getting-started-upgrade-offline).

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
cbworkloadgen](#couchbase-getting-started-testing-cbworkloadgen).

Using `telnet` only checks the Memcached compatibility ports and the memcached
text-only protocol. For more information, see [Testing Couchbase Server using
Telnet](#couchbase-getting-started-testing-telnet).

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
> cbworkloadgen -n localhost:8091
Thread 0 - average set time : 0.0257480939229 seconds , min : 0.00325512886047 seconds , max : 0.0705931186676 seconds , operation timeouts 0
```

The progress and activity of the tool can also be monitored within the web
console.

For a longer test you can increase the number of iterations:


```
> cbworkloadgen -n localhost:8091 --items=100000
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
> telnet localhost1
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
>
```

All of the Memcached protocols commands will work through Telnet.

<a id="couchbase-getting-started-nextsteps"></a>

## Next Steps

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
