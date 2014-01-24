<a id="couchbase-server-rn_2-2"></a>
# Couchbase Server Release Notes for 2.2 GA

Couchbase Server 2.2 (September 2013) is our minor update release for Couchbase Server 2.0. This includes some major enhancements, new features and important bug fixes.  Also with this we have extended our platform support for Windows 2012 and provide separate packages for Ubuntu 12.04 and CentOS 6.

To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).


The **major enhancements** available in Couchbase Server 2.2 include:
 
- XDCR performance optimization through new mode of replication which utilizes highly efficient memcached protocol on the destination cluster for replicating changes. See [Behavior and
   Limitations](#couchbase-admin-tasks-xdcr-functionality).
- Disk storage optimization through new metadata purge settings for permanently purge metadata on deleted items. See [Disk
   Storage](#couchbase-introduction-architecture-diskstorage).
- New read-only admin user to Couchbase Server. This user will have access to Couchbase Server and its Admin UI, tools and REST APIs but only in read-only mode. See Account Management.
- New addition to our toolset CBRecovery tool that provides additional durability from remote cluster. See [CLI Tools](#couchbase-cli-tool).
 
Additional enhancements in 2.2 include:
 
- Instructions for non-root, non-sudo installation and running of Couchbase Server and its tools. See [Installing
   Couchbase Server](#couchbase-getting-started-install).
- CRAM-MD5 support for SASL authentication on Couchbase Server. See Providing SASL Authentication. See [Couchbase
   Developer Guide 2.2, Providing SASL
   Authentication](http://docs.couchbase.com/couchbase-devguide-2.2/#providing-sasl-authentication)
- Ability to reset password for Administrator using the CLI command. See [cbreset_password Tool](#couchbase-admin-cbreset_password).

**Fixes in 2.2**


 * **Command-line Tools**

    * In past versions of Couchbase Server, `cbbackup` would continue past 100%
      progress. This is due to a a bug in the `cbbackup` progress indicator and tool
      behavior. In the past, `cbtransfer` only accounted for items in RAM in the
      backup estimate, but would also backup deleted items as well as items read from
      disk into memory. This resulted in greater than 100% progress being displayed.
      These issues have been fixed.

      *Issues* : [MB-8692](http://www.couchbase.com/issues/browse/MB-8692)

 * **Indexing and Querying**

    * In the past you had to delete an XDCR replication and recreate it if you wanted
      to change any XDCR internal settings. This includes:
      `xdcr_optimistic_replication_threshold`, `xdcr_worker_batch_size`,
      `xdcr_connection_timeout`, `xdcr_num_worker_process`,
      `xdcr_num_http_connections`, and `xdcr_num_retries_per_request`. You can now
      change these settings and they will immediately apply to the existing XDCR
      replication. For more information, see [Changing Internal XDCR
      Settings](#couchbase-admin-restapi-xdcr-change-settings).

      *Issues* : [MB-8422](http://www.couchbase.com/issues/browse/MB-8422)

 * **Cross Datacenter Replication (XDCR)**

    * If you used a custom data path then performed a server uninstall and upgraded,
      older XDCR replication files were left intact. This resulted in Couchbase Server
      crashes and incorrect information in Web Console. This has been fixed.

      *Issues* : [MB-8460](http://www.couchbase.com/issues/browse/MB-8460)

    * Non-UTF-8 encoded keys will not be replicated to destination clusters via XDCR
      by design. See [Behavior and Limitations](#couchbase-admin-tasks-xdcr-functionality).

      *Issues* : [MB-8427](http://www.couchbase.com/issues/browse/MB-8727)

 * **Performance**

    * Users experienced higher latency rates when they performed `observe` for
      replicated data. We have now fixed the issue.  
       Latency is now at least 5 times faster for this use case for Couchbase Server 2.2.

      *Issues* : [MB-8453](http://www.couchbase.com/issues/browse/MB-8453)
      
    * Users may experience segmentation faults if a cluster is under heavy stress. For example if your cluster has a very high disk write queue such as 2 million items per node, several XDCR replications, plus thousands of writes per second, the disks will drain slower. 
    
    	With a similar workload and limited hardware, synchronization delays in I/O may occur resulting in a segmentation fault. This may result in data-loss. We therefore recommend you have adequate cluster capacity and monitor operations per second on your cluster.

      *Issues* : [MB-9098](http://www.couchbase.com/issues/browse/MB-9098)

**Known Issues in 2.2**

* **External IP Addresses and EC2**

   * In the past you were able to add a node to a cluster in EC2 with an external IP address. If this address 
   did not resolve, any error was ignored and the server used a local IP address for the node. The server now  
   displays this error, "54.241.121.223": eaddrnotavail". If you using Couchbase on Amazon EC2 we recommend 
   you use Amazon-generated hostnames which then will automatically resolve to either the internal or external address. 
   For more information, see [Handling Changes in IP Addresses](#couchbase-bestpractice-cloud-ip)

     *Issues* : [MB-8981](https://www.couchbase.com/issues/browse/MB-8981)

* **XDCR and Tombstone Purging**

   * If you are using XDCR, Couchbase Server 2.2 introduces new functionality 
   known as tombstone purging. This functionality runs as part of auto-compaction. If you set the purge interval to a fairly low number, such 
   as less than one day, you may experience significant mismatch in data replicated from a 
   source to destination cluster. For more information 
   about tombstone purging see [Enabling Auto-Compaction](#couchbase-admin-web-console-settings-autocompaction).

     *Issues* : [MB-9019](https://www.couchbase.com/issues/browse/MB-9019)

* **XDCR and Elastic Search**

   * If you are using Elastic Search with Couchbase Server 2.2, you must use 
   the REST protocol for XDCR replication to Elastic Search. Otherwise 
   Elastic Search will fail and return the error code 500. For more 
   information about XDCR protocols, see [XDCR Behavior and Limitations](#couchbase-admin-tasks-xdcr-functionality).

     *Issues* : [MB-9049](https://www.couchbase.com/issues/browse/MB-9049)

 * **Installation and Upgrade**

    * For Mac OSX, if you move the server after it is installed and configured, it
      will fail. If you must move a configured server on this platform, you should
      first stop the server, delete the config.dat file found at
      `*install_directory*/var/lib/couchbase/config`, start the server and configure it once again.

      *Issues* : [MB-8712](http://www.couchbase.com/issues/browse/MB-8712)
      
     * If you upgrade to 2.1.1 or later from 2.1.0 or earlier the server may not automatically 
     start after you reboot the machine. You may need to check your firewall settings 
     and flush any iptables before the server will automatically restart after upgrade.
     
        *Issues* : [MB-8962](http://www.couchbase.com/issues/browse/MB-8962)

	* If you upgrade an Ubuntu system from 1.81 to 2.2.0, the node referenced by the host name is reset during the upgrade. 

		Workaround: Before upgrading, make sure you put the host name under  /opt/couchbase/var/lib/couchbase/ip so the installer can back it up as ip.debsave and determine the host name after the upgrade.

		Issues: [MB-8932](http://www.couchbase.com/issues/browse/MB-8932), [MB-9109](http://www.couchbase.com/issues/browse/MB-9109)
	
 * **Database Operations**

    * Any non-UTF-8 characters are not filtered or logged by Couchbase Server. Future
      releases will address this issue.

      *Issues* : [MB-8427](http://www.couchbase.com/issues/browse/MB-8427)


     * If you continuously perform numerous appends to a document, it may lead to
           memory fragmentation and overuse. This is due to an underlying issue of
           inefficient memory allocation and deallocation with third party software
           `tcmalloc`.
           
      	*Issues* : [MB-7887](http://www.couchbase.com/issues/browse/MB-7887)
           
 * **Cluster Operations**

    * The detailed rebalance report in Couchbase Web Console display numbers for
      `Total number of keys to be transferred` and `Estimated number of keys
      transferred` when you rebalance empty data buckets. We incorrectly show the
      number of internal server messages that will be transferred and have been
      transferred, instead of only documents in a data bucket. This will be fixed in
      future releases. For more information about detailed rebalance information, see
      [Monitoring a Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).

      *Issues* : [MB-8654](http://www.couchbase.com/issues/browse/MB-8654)
      
     * A cluster rebalance may exit and produce the error {not_all_nodes_are_ready_yet} if you perform the rebalance right after failing over a node in the cluster. You may need to wait 60 seconds after the node failover before you attempt the cluster rebalance.

      	This is because the failover REST API is a synchronous operation with a timeout. If it fails to complete the failover process by the timeout, the operation internally switches into a asynchronous operation. It will immediately return and re-attempt failover in the background which will cause rebalance to fail since the failover operation is still running.

      *Issues* : [MB-7168](http://www.couchbase.com/issues/browse/MB-7168)

 * **Command-line Tools**

    * If you use `cbbackup`, `cbrestore`, or `cbtransfer` you should perform the
      backup, restore, or transfer from a node in your Couchbase cluster. These three
      tools will not transfer data from external IP addresses; they will function with
      IP addresses from an internal Couchbase cluster node list. See [cbbackup
      Tool](#couchbase-admin-cmdline-cbbackup).

      *Issues* : [MB-8459](http://www.couchbase.com/issues/browse/MB-8459)
      
    * Several incidents have been reported that after using flush on nodes, Couchbase 
      Server returns TMPFAIL even after a successful flush. This may occur for Couchbase 
      Server 2.0 and above.

    *Issues* : [MB-7160](http://www.couchbase.com/issues/browse/MB-7160)
    
    * For Mac OSX there is a bug in `cbcollect_info` and the tool will not 
    include system log files, syslog.tar.gz. This will be fixed in future releases.

    *Issues* : [MB-8777](http://www.couchbase.com/issues/browse/MB-8777)

