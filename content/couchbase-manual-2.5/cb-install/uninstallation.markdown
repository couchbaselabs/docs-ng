# Uninstalling Couchbase Server

If you want to uninstall Couchbase Server from your system you must choose the
method appropriate for your operating system.

Before removing Couchbase Server from your system, you should do the following:

 * Shutdown your Couchbase Server. For more information on the methods of shutting
   down your server for your platform, see [Server Startup and
   Shutdown](#couchbase-admin-basics-running).

 * If your machine is part of an active cluster, you should rebalance your cluster
   to take the node out of your configuration. See
   [Rebalancing](#couchbase-admin-tasks-addremove).

 * Update your clients to point to an available node within your Couchbase Server
   cluster.

<a id="couchbase-uninstalling-redhat"></a>

## Uninstalling on a Red Hat Linux System

To uninstall the software on a Red Hat Linux system, run the following command:


```
> sudo rpm -e couchbase-server
```

Refer to the Red Hat RPM documentation for more information about uninstalling
packages using RPM.

You may need to delete the data files associated with your installation. The
default installation location is `/opt`. If you selected an alternative location
for your data files, you will need to separately delete each data directory from
your system.

<a id="couchbase-uninstalling-debian"></a>

## Uninstalling on an Debian/Ubuntu Linux System

To uninstall the software on a Ubuntu Linux system, run the following command:


```
> sudo dpkg -r couchbase-server
```

Refer to the Ubuntu documentation for more information about uninstalling
packages using `dpkg`.

You may need to delete the data files associated with your installation. The
default installation location is `/opt`. If you selected an alternative location
for your data files, you will need to separately delete each data directory from
your system.

<a id="couchbase-uninstalling-windows"></a>

## Uninstalling on a Windows System

To uninstall the software on a Windows system you must have Administrator or
Power User privileges to uninstall Couchbase.

To remove, choose `Start` > `Settings` > `Control Panel`, choose `Add or Remove
Programs`, and remove the Couchbase Server software.

<a id="couchbase-uninstalling-macosx"></a>

## Uninstalling on a Mac OS X System

To uninstall on Mac OS X:

 1. Open the `Applications` folder, and then drag the `Couchbase Server` application
    to the trash. You may be asked to provide administrator credentials to complete
    the deletion.

 1. To remove the application data, you will need to delete the `Couchbase` folder
    from the `~/Library/Application Support` folder for the user that ran Couchbase
    Server.

<a id="couchbase-sampledata"></a>
