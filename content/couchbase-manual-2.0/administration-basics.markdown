# Administration Basics

This chapter covers everything on the Administration of a Couchbase Sever
cluster. Administration is supported through three primary methods:

 * **Couchbase Web Console**

   Couchbase includes a built-in web server and administration interface that
   provides access to the administration and statistic information for your
   cluster.

   For more information, read [Using the Web
   Console](couchbase-manual-ready.html#couchbase-admin-web-console).

 * **Command-line Toolkit**

   Provided within the Couchbase package are a number of command-line tools that
   allow you to communicate and control your Couchbase cluster.

   For more information, read [Command-line Interface for
   Administration](couchbase-manual-ready.html#couchbase-admin-cmdline).

 * **Couchbase REST API**

   Couchbase Server includes a RESTful API that enables any tool capable of
   communicating over HTTP to administer and monitor a Couchbase cluster.

   For more information, read [Using the REST
   API](couchbase-manual-ready.html#couchbase-admin-restapi).

<a id="couchbase-data-files"></a>

## Couchbase Data Files

By default, Couchbase Server will store the data files under the following
paths:

Platform | Directory                                                       
---------|-----------------------------------------------------------------
Linux    | `/opt/couchbase/var/lib/couchbase/data`                         
Windows  | `C:\Program Files\couchbase\server\var\lib\couchbase\data`      
Mac OS X | `~/Library/Application Support/Couchbase/var/lig/couchbase/data`

[This path can be changed for each node at setup either via the Web UI setup
wizard, using theREST API](couchbase-manual-ready.html#couchbase-admin-restapi)
or using the Couchbase CLI:

Changing the data path for a node that is already part of a cluster will
permanently delete the data stored.

Linux:


```
shell> couchbase-cli node-init -c node_IP:8091 \
    --node-init-data-path=new_path \
    -u user -p password
```

Windows:


```
shell> couchbase-cli node-init -c \
    node_IP:8091 --node-init-data-path=new_path \
    -u user -p password
```

When using the command line tool, you cannot change the data file and index file
path settings individually. If you need to configure the data file and index
file paths individually, use the REST API. For more information, see
[Configuring Disk and Index Path for a
Node](couchbase-manual-ready.html#couchbase-admin-restapi-provisioning-diskpath)

For Couchbase Server 2.0, once a node or cluster has already been setup and is
storing data, you cannot change the path while the node is part of a running
cluster. You must take the node out of the cluster then follow the steps below:

 1. [Change the path on a running node either via theREST
    API](couchbase-manual-ready.html#couchbase-admin-restapi) or using the Couchbase
    CLI (commands above). This change will not actually take effect until the node
    is restarted. For more information about using a REST-API request for ejecting
    nodes from clusters, see [Removing a Node from a
    Cluster](couchbase-manual-ready.html#couchbase-admin-restapi-remove-node-from-cluster).

 1. Shut the node down.

 1. Copy all the data files from their original location into the new location.

 1. [Start the service again
    andmonitor](couchbase-manual-ready.html#couchbase-monitoring) the "warmup" of
    the data.

<a id="couchbase-admin-basics-running"></a>

## Startup and Shutdown of Couchbase Server

The packaged installations of Couchbase Server include support for automatically
starting and stopping Couchbase Server using the native boot and shutdown
mechanisms.

For information on starting and stopping Couchbase Server, see the different
platform-specific links:

 * [Startup and Shutdown on
   Linux](couchbase-manual-ready.html#couchbase-admin-basics-running-linux)

 * [Startup and Shutdown on
   Windows](couchbase-manual-ready.html#couchbase-admin-basics-running-windows)

 * [Startup and Shutdown on Mac OS
   X](couchbase-manual-ready.html#couchbase-admin-basics-running-macosx)

<a id="couchbase-admin-basics-running-linux"></a>

### Startup and Shutdown on Linux

On Linux, Couchbase Server is installed as a standalone application with support
for running as a background (daemon) process during startup through the use of a
standard control script, `/etc/init.d/couchbase-server`. The startup script is
automatically installed during installation from one of the Linux packaged
releases (Debian/Ubuntu or RedHat/CentOS). By default Couchbase Server is
configured to be started automatically at run levels 2, 3, 4, and 5, and
explicitly shutdown at run levels 0, 1 and 6.

To manually start Couchbase Server using the startup/shutdown script:


```
shell> sudo /etc/init.d/couchbase-server start
```

To manually stop Couchbase Server using the startup/shutdown script:


```
shell> sudo /etc/init.d/couchbase-server stop
```

<a id="couchbase-admin-basics-running-windows"></a>

### Startup and Shutdown on Windows

On Windows, Couchbase Server is installed as a Windows service. You can use the
`Services` tab within the Windows Task Manager to start and stop Couchbase
Server.

You will need Power User or Administrator privileges, or have been separately
granted the rights to manage services to start and stop Couchbase Server.

By default, the service should start automatically when the machine boots. To
manually start the service, open the Windows Task Manager and choose the
`Services` tab, or select the **Unhandled:** `[:unknown-tag :guimenu]`, choose
`Run` and then type `Services.msc` to open the Services management console.

Once open, find the `CouchbaseServer` service, right-click and then choose to
Start or Stop the service as appropriate. You can also alter the configuration
so that the service is not automatically started during boot.

Alternatively, you can start and stop the service from the command-line, either
by using the system `net` command. For example, to start Couchbase Server:


```
shell> net start CouchbaseServer
```

To stop Couchbase Server:


```
shell> net stop CouchbaseServer
```

Start and Stop scripts are also provided in the standard Couchbase Server
installation in the `bin` directory. To start the server using this script:


```
shell> C:\Program Files\Couchbase\Server\bin\service_start.bat
```

To stop the server using the supplied script:


```
shell> C:\Program Files\Couchbase\Server\bin\service_stop.bat
```

<a id="couchbase-admin-basics-running-macosx"></a>

### Startup and Shutdown on Mac OS X

On Mac OS X, Couchbase Server is supplied as a standard application. You can
start Couchbase Server by double clicking on the application. Couchbase Server
runs as a background application which installs a menubar item through which you
can control the server.


![](couchbase-manual-2.0/images/macosx-menubar.png)

The individual menu options perform the following actions:

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   Opens a standard About dialog containing the licensing and version information
   for the Couchbase Server installed.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   Opens the Web Administration Console in your configured default browser.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   Opens the Couchbase Server support forum within your default browser at the
   Couchbase website where you can ask questions to other users and Couchbase
   developers.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   Checks for updated versions of Couchbase Server. This checks the currently
   installed version against the latest version available at Couchbase and offers
   to download and install the new version. If a new version is available, you will
   be presented with a dialog containing information about the new release.

   If a new version is available, you can choose to skip the update, notify the
   existence of the update at a later date, or to automatically update the software
   to the new version.

   If you choose the last option, the latest available version of Couchbase Server
   will be downloaded to your machine, and you will be prompted to allow the
   installation to take place. Installation will shut down your existing Couchbase
   Server process, install the update, and then restart the service once the
   installation has been completed.

   Once the installation has been completed you will be asked whether you want to
   automatically update Couchbase Server in the future.

   Using the update service also sends anonymous usage data to Couchbase on the
   current version and cluster used in your organization. This information is used
   to improve our service offerings.

   You can also enable automated updates by selecting the `Automatically download
   and install updates in the future` checkbox.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   If this menu item is checked, then the Web Console for administrating Couchbase
   Server will be opened whenever the Couchbase Server is started. Selecting the
   menu item will toggle the selection.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   If this menu item is checked, then Couchbase Server will be automatically
   started when the Mac OS X machine starts. Selecting the menu item will toggle
   the selection.

 * **Unhandled:** `[:unknown-tag :guimenuitem]`

   Selecting this menu option will shut down your running Couchbase Server, and
   close the menubar interface. To restart, you must open the Couchbase Server
   application from the installation folder.

<a id="couchbase-bestpractice"></a>
