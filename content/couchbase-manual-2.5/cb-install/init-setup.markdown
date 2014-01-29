<a id="couchbase-getting-started-setup"></a>

# Initial server setup

<div class="notebox bp">
<p>Recommendation</p>
<p>
Couchbase recommends that you clear your browser cache before doing the setup process.
You can find notes and tips on how to do this on different browsers and
platforms on [wikihow.com](http://www.wikihow.com/Clear-Your-Browser's-Cache).
</p></div>

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
    [Disk Throughput and Sizing](../cb-admin/#couchbase-bestpractice-sizing-disk).

    The `Configure Server Memory` section sets the amount of physical RAM that will
    be allocated by Couchbase Server for storage. For more information and
    guidelines, see [RAM Sizing](../cb-admin/#couchbase-bestpractice-sizing-ram).

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
    Sample Buckets](../cb-admin/#couchbase-sampledata). After you create sample data buckets a
    Create Bucket panel appears where you create new data buckets

 1. Set up a test bucket for Couchbase Server. You can change all bucket settings
    later except for the bucket name.

    Enter 'default' as the bucket name and accept all other defaults in this panel.
    For more information about creating buckets, see [Creating and Editing Data
    Buckets](../cb-admin/#couchbase-admin-web-console-data-buckets-createedit).

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
    credentials you use for Couchbase REST API. See the Couchbase [REST
    API](../cb-rest-api/#couchbase-admin-restapi).

Once you finish this setup, you see Couchbase Web Console with the Cluster
Overview page:


![](../images/web-console-startup-7.png)

Your server is now running and ready to use. After you install your server and
finish initial setup you can also optionally configure other settings, such as
the port, RAM, using any of the following methods:

## Using command-line tools

   The command line tools provided with your Couchbase Server installation includes
   `couchbase-cli`. This tool provides access to the core functionality of the
   Couchbase Server by providing a wrapper to the REST API. For information about
   CLI, see [couchbase-cli tool](../cb-cli/#couchbase-admin-cmdline-couchbase-cli).

## Using the REST API

   Couchbase Server can be configured and controlled using a REST API. In fact, the
   REST API is the basis for both the command-line tools and Web interface to
   Couchbase Server.

   For more information on using the REST API see, the Couchbase [REST
   API](../cb-rest-api/#couchbase-admin-restapi).

<a id="couchbase-getting-started-hostnames"></a>

## Using hostnames

When you first install Couchbase Server you can access using a default IP
address. There may be cases where you want to provide a hostname for each
instance of a server. Each hostname you provide should be a valid one and will
ultimately resolve to a valid IP Address. This section describes how you provide
hostnames on Windows and Linux for the different versions of Couchbase Server.
If you restart a node, it will use the hostname once again. If you failover or
remove a node from a cluster, the node needs to be configured with the hostname
once again.

### Couchbase 2.1+ Linux and Windows

There are several ways you can provide hostnames for Couchbase 2.1+. You can
provide a hostname when you install a Couchbase Server on a machine, when
you add the node to an existing cluster for online upgrade, or via a REST API
call. Couchbase Server stores this in a config file on disk. For earlier
versions of Couchbase Server you must follow a manual process where you edit
config files for each node which we describe below.

* **On Initial Setup**  In the first screen that appears when you first log into Couchbase Server, you
can provide either a hostname or IP address under **Configure Server Hostname**.
Any hostname you provide will survive node restart:


![](../images/configure_server1.png)

* **While Adding a Node** If you add a new 2.1+ node to an existing 2.0.1 or older Couchbase cluster you
should first setup the hostname for the 2.1+ node in the setup wizard. If you
add a new 2.1+ node to a 2.1 cluster you can provide either a hostname or IP
address under **Add Server**. You provide it in the **Server IP Address** field:


![](../images/hostname_add_node.png)

* **Providing Hostnames via REST API** The third way you can provide a node a hostname is to do a REST request at the
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

###Hostnames when upgrading to 2.1

If you perform an offline upgrade from Couchbase 1.8.1+ to 2.1 (Linux and Windows)and you have a
configured hostname using the instructions from [Handling Changes in IP
Addresses](../cb-admin/#couchbase-bestpractice-cloud-ip), a 2.1 server will use this
configuration.

If you perform an online upgrade from 1.8.1+ to 2.1, you should add the hostname
when you create the new 2.1 node. For more information about upgrading between
versions, see [Upgrading to Couchbase Server
2.1](#couchbase-getting-started-upgrade)

**Hostnames and the Cloud (such as EC2, Azure, etc)**. For more information about handling
IP addresses and hostnames, see [Handling Changes in IP
Addresses](../cb-admin/#couchbase-bestpractice-cloud-ip).

<a id="couchbase-getting-started-hostnames-pre2.0"></a>

### Hostnames for Couchbase Server 2.0.1 and earlier

For 2.0.1 please follow the same steps for 2.0 and earlier. The one difference
between versions is the name and location of the file you change.

<div class="notebox warning">
<p>Warning</p>
<p>
This operation on both Linux and Windows is data destructive. This process 
reinitializes the node and removes all data on the node. Couchbase recommend that 
all node data be backed up before performing this operation, see [cbbackup
tool](../cb-cli/#couchbase-admin-cmdline-cbbackup).
</p></div>

* **Hostnames for Linux 2.0.1 and earlier**

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

* **Hostnames for Windows 2.0.1 and earlier**

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



