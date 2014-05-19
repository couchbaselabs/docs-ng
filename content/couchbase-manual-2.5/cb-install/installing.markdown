<a id="couchbase-getting-started"></a>

# Getting started

To start using Couchbase Server, follow these steps:

 1. Make sure your machine meets the system requirements. See
    [Preparing to install](#couchbase-getting-started-prepare).

 1. Install Couchbase Server. To install Couchbase Server on your machine, download the appropriate
package for your chosen platform from
[http://www.couchbase.com/downloads](http://www.couchbase.com/downloads). For
each platform, follow the corresponding platform-specific instructions.

    * If you are installing Couchbase Server on to a machine that has previously had
Couchbase Server installed and you do not want to perform an upgrade
installation, remove Couchbase Server and any associated data from your
machine before you start the installation. For more information on uninstalling
Couchbase Server, see [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * To perform an upgrade installation while retaining your existing dataset, see
[Upgrading](#couchbase-getting-started-upgrade).


 1. Test the installation by connecting and storing some data using the native
    Memcached protocol. See [Testing Couchbase
    Server](#couchbase-getting-started-testing).

 1. Setup the new Couchbase Server system by completing the web-based setup
    instructions. See [Initial Server Setup](#couchbase-getting-started-setup).



<a id="couchbase-getting-started-prepare"></a>

## Preparing to install

<div class="notebox warning">
<p>Warning</p>
<p>
Mixed deployments, such as a cluster with both Linux and Windows server nodes are
not supported. This incompatibility is due to differences in the number of
shards between platforms. Operating systems cannot be mixed within the same cluster 
and when XDCR is configured between clusters, operating systems cannot be mixed 
between clusters.
</p>
<p>Implement the same operating system on all machines within a cluster.</p> 
<p>If XDCR is used, implement the same operating system on 
the other clusters. 
</p>
</div>

Your system should meet the following system requirements.

<a id="couchbase-getting-started-prepare-platforms"></a>

## Supported platforms

Couchbase Server provides platform support for Windows 2012 and separate packages for Ubuntu 12.04 and CentOS 6.

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

## Resource requirements

The following hardware requirements are recommended for installation:

 * Quad-core for key-value store, 64-bit CPU running at 3GHz

 * Six cores if you use XDCR and views.

 * 16GB RAM (physical)

 * Block-based storage device (hard disk, SSD, EBS, iSCSI). Network filesystems
   (e.g. CIFS, NFS) are not supported.

A minimum specification machine should have the following characteristics:

 * Dual-core CPU running at 2GHz for key-value store

 * 4GB RAM (physical)

<div class="notebox">
<p>Note</p>
<p>
For development and testing purposes a reduced CPU and RAM than the minimum
specified can be used. This can be as low as 1GB of free RAM beyond operating
system requirements and a single CPU core. However, you should not use a
configuration lower than that specified in production. Performance on machines
lower than the minimum specification will be significantly lower and should not
be used as an indication of the performance on a production machine.
</p>
<p>View performance on machines with less than 2 CPU cores will be significantly
reduced.
</p>
</div>

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
Guidelines](../cb-admin/#couchbase-bestpractice-sizing).

<a id="couchbase-getting-started-prepare-browser"></a>

## Supported web browsers

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

## Network ports

Couchbase Server uses a number of different network ports for communication
between the different components of the server, and for communicating with
clients that accessing the data stored in the Couchbase cluster. The ports
listed must be available on the host for Couchbase Server to run and operate
correctly. Couchbase Server will configure these ports automatically, but you
must ensure that your firewall or IP tables configuration allow communication on
the specified ports for each usage type. On Linux the installer will notify you
that you need to open these ports.

For information about using user-defined ports, see 
[Using user-defined ports](../cb-install#install-user-defined-ports)

The following table lists the ports used for different types of communication
with Couchbase Server, as follows:



<a id="table-couchbase-network-ports"></a>

Port                       | Description                   | Node to Node | Node to Client | Cluster Administration | XDCR (version 1) | XDCR (version 2)
---------------------------|-------------------------------|--------------|----------------|------------------------|------------------|-----------------
8091                       | Web Administration Port       | Yes          | Yes            | Yes                    | Yes              | Yes 
8092                       | Couchbase API Port            | Yes          | Yes            | No                     | Yes              | Yes 
11209                      | Internal Bucket Port          | Yes          | No             | No                     | No               | No 
11210                      | Internal/External Bucket Port | Yes          | Yes            | No                     | No               | Yes  
11211                      | Client interface (proxy)      | No           | Yes            | No                     | No               | No  
11214                      | Incoming SSL Proxy            | No           | No             | No                     | Yes              | Yes
11215                      | Internal Outgoing SSL Proxy   | No           | No             | No                     | Yes              | Yes
18091                      | Internal REST HTTPS for SSL   | No           | No             | No                     | Yes              | Yes
18092                      | Internal CAPI HTTPS for SSL   | No           | No             | No                     | Yes              | Yes
4369                       | Erlang Port Mapper ( `epmd` ) | Yes          | No             | No                     | No               | No 
21100 to 21199 (inclusive) | Node data exchange            | Yes          | No             | No                     | No               | No  



Port 8091
: Used by the Web Console from outside the second level firewall (for REST/HTTP traffic).

Port 8092
: Used to access views, run queries, and update design documents.


Port 11210
: Used by smart client libraries or client-side Moxi to directly connect to the data
   nodes.

Port 11211
: Used by pre-existing Couchbase and memcached (non-smart) client libraries that are outside the second level firewall  to work.

Ports 11214, 11215, 18091, and 18092
: Used for SSL XDCR data encryptions.

All other Ports
: Used for other Couchbase Server communications.

Node to node
: Where noted, these ports are used by Couchbase Server for communication between
   all nodes within the cluster. You must have these ports open on all to enable
   nodes to communicate with each other.

Node to client
: Where noted, these ports should be open between each node within the cluster and
   any client nodes accessing data within the cluster.

Cluster administration
: Where noted, these ports should be open and accessible to allow administration,
   whether using the REST API, command-line clients, and Web browser.

XDCR
: These ports are used for XDCR communication between all nodes in both the source and
   destination clusters.






<a id="couchbase-getting-started-install-redhat"></a>

# Red Hat Linux installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). The Red Hat
installation uses the RPM package. Installation is supported on Red Hat and
Red Hat-based operating systems such as CentOS.

## Installing on Red Hat Linux

 1. For Red Hat Enterprise Linux version 6.0, Couchbase Server RPM performs 
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

## Installing on CentOS/RHEL as non-root, non-sudo 

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
see [Server Startup and Shutdown](../cb-admin/#couchbase-admin-basics-running).


<a id="install-multiple-instance"><a>
## Installing multiple instances on a machine

Installing and running multiple Couchbase instances on a physical machine is possible for the Linux operating system. However, this implementation in recommended for development purposes only.

**Requirements**

Ensure that a minimum of 4GB RAM and 8 core CPU are available for each Couchbase instance. 
When installing multiple instances of Couchbase on a physical machine, install as one of the following:

* sudo user 
* non-root, non-sudo user

For information about non-root, non-sudo user installation, see [Installing on CentOS/RHEL as non-root, non-sudo](#installing-on-centosrhel-as-non-root-non-sudo).


<div class="notebox"><p>Note</p>
<p>Refer to the reserved Couchbase Server <a href="#network-ports">Network ports</a> and <a href="#install-user-defined-ports">User-defined ports</a> before creating user-defined ports.
</p></div>


**Recommendations**

Install each instance of a cluster on a different physical machine to ensure data recovery if a failure occurs.

<div class="notebox"><p>Note</p>
<p>The number of Couchbase servers that can be installed on a physical machine depends on the RAM and CPU available.
</p></div>

The following graphic shows a cluster configuration with multiple Couchbase instances on a physical machine. In addition, by having three (3) Couchbase server in a cluster and each server installed on different physical machines, the configuration reduces the risk of data loss from a hardware failure.

<img src="../images/multi-instance.png" width="600">



**Setting up multiple instances**

To set up multiple instances running on a physical machine:


2. Install Couchbase Server as a sudo user or as a non-root, non-sudo user. For more information about installing as non-root,  non-sudo, see [Installing on CentOS/RHEL as non-root, non-sudo](#installing-on-centosrhel-as-non-root-non-sudo). 
3. Create user-defined ports in the **/opt/couchbase/etc/couchbase/static_config** file.
3. In the **/etc/security/limits.conf** file, ensure that the hard and soft limits for the `nofile` parameter are set to a value greater than 10240.
4. Change the short_name parameter that identifies the instance (default: ns_1), to a different short_name in the **/opt/couchbase/etc/couchbase/static_config** file.
	* The short_name value must different for each instance that resides on the same physical server.
5. Change the two occurrences short_name in the **/opt/couchbase/bin/couchbase-server** file. For example, use the `sed` utility. 
	* <code>sed -i 's/ns_1/ns_inst1/g' bin/couchbase-server</code>
6. Start the Couchbase instance.
7. Repeat the steps to install other instances.

<div class="notebox" bp><p>Important</p>
<p>
While creating the cluster make sure the perServer RAM quota is calculated keeping in mind the number of instances planned to be installed on the machine. </p>
<p>When configuring the instance for the cluster, Couchbase provides a default value for the perServer RAM quota. This default value is based on the total RAM quota available on the physical machine. Modify this value.
</p></div>


<div class="notebox"><p>Troubleshooting</p>
<p>If any bucket created on the nodes appear to be in pending state or if rebalance fails  with not_all_nodes_are_ready_yet, there could be a mismatch of the short_name  value in the following files:</p>
<p> /opt/couchbase/bin/couchbase-server</p>
</p>/opt/couchbase/etc/couchbase/static_config</p>
</div>



**Limitations**

* Cbrecovery is unavailable on customized ports
* Cbworkloadgen  is unavailable
* Offline upgrade  is unavailable
* If a bucket is created on a dedicated port, some of the operations results in the error, "could not listen on port xxx”, even though the operation still succeeds. This error is logged regardless of the port that is used. 



<a id="couchbase-getting-started-install-ubuntu"></a>

# Ubuntu Linux installation

Before you install, make sure you check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms).

## Installing on Ubuntu
To install:

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



After successful installation, use the `service` command to manage the
Couchbase Server service, including checking the current status. Refer to the
Ubuntu documentation for instructions. To provide initial setup for Couchbase,
open a web browser and access the web administration interface. See [Initial
Server Setup](#couchbase-getting-started-setup).

## Installing on Ubuntu as non-root, non-sudo

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
see [Server Startup and Shutdown](../cb-admin/#couchbase-admin-basics-running).

<a id="couchbase-getting-started-install-win"></a>

# Microsoft Windows installation

Before installing, check the supported platforms, see [Supported
Platforms](#couchbase-getting-started-prepare-platforms). To install on Windows,
download the Windows installer package. This is supplied as a Windows
executable. You can install the package either using the wizard, or by doing an
unattended installation process. In either case make sure that you have no
anti-virus software running on the machine before you start the installation
process. You also need administrator privileges on the machine where you install
it.

<div class="notebox bp">
<p>Port exhaustion on Windows</p>
<p>
The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).
</p>
</div>

<div class="notebox warning">
<p>Warning</p>
<p>
Couchbase Server uses the Microsoft C++ redistributable package, which 
automatically downloads during installation. However, if another
application on your machine is already using the package, your installation
process may fail. To ensure that your installation process completes
successfully, shut down all other running applications during installation.
</p>
<p>
For Windows 2008, you must upgrade your Windows Server 2008 R2 installation with
Service Pack 1 installed before running Couchbase Server. You can obtain Service
Pack 1 from [Microsoft
TechNet](http://technet.microsoft.com/en-us/library/ff817647(v=ws.10).aspx).
</p>
<p>
The standard Microsoft Server installation does not provide an adequate number
of ephemeral ports for Couchbase clusters. Without the correct number of open
ephemeral ports, you may experience errors during rebalance, timeouts on
clients, and failed backups. The Couchbase Server installer will check for your
current port setting and adjust it if needed. See [Microsoft
KB-196271](http://support.microsoft.com/kb/196271).
</p>
</div>

## Installation wizard

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

 1. Click *Yes*.

    Without a sufficient number of ephemeral ports, a Couchbase cluster fails during
    rebalance and backup; other operations such as client requests will timeout. If
    you already changed this setting you can click no. The installer will display
    this panel to confirm the update:


    ![](../images/windows_port_check2.png)

 1. Restart the server for the port changes to be applied.

After installation you should follow the server setup instructions. See [Initial
Server Setup](#couchbase-getting-started-setup).

## Unattended installation

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

<div class="notebox warning">
<p>Warning</p>
<p>
Due to limitations within the Mac OS X operating system, the Mac OS X
implementation is incompatible with other operating systems. It is not possible
either to mix operating systems within the same cluster, or configure XDCR
between a Mac OS X and Windows or Linux cluster. If you need to move data
between a Mac OS X cluster and a cluster hosted on another platform, use
`cbbackup` and `cbrestore`. For more information, see [Backup and Restore
Between Mac OS X and Other Platforms](../cb-admin/#couchbase-backup-restore-mac).
</p></div>


## Installing on Mac OS X

To install:

 1. Delete any previous installs of Couchbase Server at the command line or by
    dragging the icon to the Trash can.

 2. Remove remaining files from previous installations:

	```
	> rm -rf ~/Library/Application\ Support/Couchbase
	> rm -rf ~/Library/Application\ Support/Membase
	```

 3. Download the Mac OS X zip file.

 4. Double-click the downloaded Zip installation file to extract the server. This
    creates a single folder, the `Couchbase Server.app` application.

 5. Drag and Drop `Couchbase Server.app` to your chosen installation folder, such as
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

## Installing on Mac OS X as non-root, non-sudo

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
see [Server Startup and Shutdown](cb-admin#couchbase-admin-basics-running).

