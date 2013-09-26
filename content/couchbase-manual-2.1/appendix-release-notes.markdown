# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Server. To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

<a id="couchbase-server-rn_2-1-1a"></a>

## Release Notes for Couchbase Server 2.1.1 GA (July 2013)

Couchbase Server 2.1.1 is first maintenance release for Couchbase Server 2.1.
This release includes some major bug fixes and enhancements:

**New Edition in 2.1.1**

The Enterprise Edition of Couchbase Server is now available on Mac OS X. See
[Couchbase, Downloads](http://www.couchbase.com/download).

**Fixes in 2.1.1**

 * **Database Operations**

    * There was an underlying Windows Management Instrumentation issue in
      `wmi_port.cpp` which caused memory leaks. This has been fixed.

      *Issues* : [MB-8674](http://www.couchbase.com/issues/browse/MB-8674)

    * The 2.1 version of the server exposes fewer server stats than it did in earlier
      versions. The five stats that have been removed are `key_data_age`,
      `key_last_modification_time`, `paged_out _time`, `ep_too_young` and
      `ep_too_old`.

      *Issues* : [MB-8539](http://www.couchbase.com/issues/browse/MB-8539)

 * **Cluster Operations**

    * The rebalance speed for small datasets has been significantly improved. This
      includes time to rebalance empty buckets and buckets containing tens of
      thousands of items.

      *Issues* : [MB-8521](http://www.couchbase.com/issues/browse/MB-8521)

    * In Couchbase 2.1.0 if you tried to assign a hostname to a node when you join the
      node to a cluster, it will be reset. The hostname will not be saved for the node
      and will not be used by the cluster to identify the node. This has been fixed.
      For more information about managing hostnames, see [Using Hostnames with
      Couchbase Server](#couchbase-getting-started-hostnames).

      *Issues* : [MB-8545](http://www.couchbase.com/issues/browse/MB-8545)

<a id="couchbase-server-rn_2-1-0a"></a>

## Release Notes for Couchbase Server 2.1.0 GA (June 2013)

Couchbase Server 2.1.0 is the first minor release for Couchbase Server 2.0 and
includes several optimizations, new features and important bug fixes.

The **major enhancements** available in Couchbase Server 2.1.0 include:

 * Improved disk read and write performance with new multi-threaded persistence
   engine. With the newly designed persistence engine, users can configure the
   multiple read-write workers on a per Bucket basis. See [Disk
   Storage](#couchbase-introduction-architecture-diskstorage).

 * Optimistic Replication mode for XDCR to optimistically replicate mutations to
   the target cluster. More information can be found here: ['Optimistic
   Replication' in XDCR](#xdcr-optimistic-replication)

 * More XDCR Statistics to monitor performance and behavior of XDCR. See
   [Monitoring Outgoing XDCR](#couchbase-admin-web-console-data-buckets-xdcr).

 * Support for hostnames when setting up Couchbase Server. See [Using Hostnames
   with Couchbase Server](#couchbase-getting-started-hostnames).

 * Rebalance progress indicator to provide more visibility into rebalance
   operation. See [Monitoring a
   Rebalance](#couchbase-admin-tasks-addremove-rebalance-monitoring).

 * Ability to generate a health report with `cbhealthchecker`, now included as part
   of the Couchbase Server install. See [cbhealthchecker
   Tool](#couchbase-admin-cmdline-cbhealthchecker).

 * Importing and exporting of CSV files with Couchbase using `cbtransfer`. See
   [cbtransfer Tool](#couchbase-admin-cmdline-cbtransfer).

 * Server-side replica-read API. [Couchbase Developer Guide, Replica
   Read](http://www.couchbase.com/docs/couchbase-devguide-2.1.0/cb-protocol-replica-read.html).

**Additional behavior changes in 2.1.0 include:**

 * Backup, Restore and Transfer tool to optionally transfer data or design
   documents only. The default is to transfer both data and design documents. See
   [cbbackup Tool](#couchbase-admin-cmdline-cbbackup), [cbrestore
   Tool](#couchbase-admin-cmdline-cbrestore), [cbtransfer
   Tool](#couchbase-admin-cmdline-cbtransfer)

 * Improved cluster manager stability via separate process for cluster manager. See
   [Underlying Server Processes](#couchbase-underlying-processes).

 * Command Line tools updated so you can manage nodes, buckets, clusters and XDCR.
   See [couchbase-cli Tool](#couchbase-admin-cmdline-couchbase-cli)

 * More XDCR Statistics to monitor performance and behavior of XDCR. See
   [Monitoring Outgoing XDCR](#couchbase-admin-web-console-data-buckets-xdcr).

 * Command Line tools updated so you can manage nodes, buckets, clusters and XDCR.
   See [couchbase-cli Tool](#couchbase-admin-cmdline-couchbase-cli).

 * Several new and updated statistics for XDCR on the admin Console and via the
   REST-API. For more information, see [Monitoring Incoming
   XDCR](#couchbase-admin-web-console-data-buckets-xdcr-recv), [Monitoring Outgoing
   XDCR](#couchbase-admin-web-console-data-buckets-xdcr), and [Getting XDCR Stats
   via REST](#couchbase-admin-restapi-xdcr-stats).

**Fixes in 2.1.0**

 * **Installation and Upgrade**

    * In the past Couchbase Server 2.0.0 upgrade installers on Linux did not replace
      the `file2.beam` with the latest version. This will cause indexing and querying
      to fail. This has been fixed.

      *Issues* : [MB-7770](http://www.couchbase.com/issues/browse/MB-7770)

    * The Windows installer for Windows 32-bit and 64-bit now prompts you to set the
      MaxUserPort registry setting. This will increase the number of ephemeral ports
      available to applications on Windows, as documented in [Microsoft Knowledge Base
      Article 196271](http://support.microsoft.com/kb/196271). The installer also
      warns you that a reboot is necessary for this change to take effect. If this
      registry key is not set, it may lead to port exhaustion leading to various
      problems, see as MB-8321. For installer instructions, see [Microsoft Windows
      Installation](#couchbase-getting-started-install-win).

      *Issues* : [MB-8321](http://www.couchbase.com/issues/browse/MB-8321)

 * **Cluster Operations**

    * Previously, there was only one process that was responsible for monitoring and
      managing all the other underlying server processes. This includes Moxi and
      memcached, and also statistics gathering.  Now there are two processes. One is
      responsible for just Moxi/Memcached and the other is responsible for monitoring
      all other processes. This should help prevent the max\_restart\_intensity seen
      when timeouts start and temporarily disrupted the server. The most noticeable
      change you see with this fix is that there are now two beam.smp processes
      running on Linux and two erl.exe running on Windows. For more details, see
      [Underlying Server Processes](#couchbase-underlying-processes).

      *Issues* : [MB-8376](http://www.couchbase.com/issues/browse/MB-8376)

 * **Command-line Tools**

    * For earlier versions of Couchbase Server, some internal server directories were
      accessible all users, which was a security issue. This is now fixed. The fix now
      means that you should have root privileges when you run `cbcollect_info` because
      this tool needs this access level to collect all the information it needs to
      collect about the server. For more information about `cbcollect_info`, see
      [cbcollect_info Tool](#couchbase-admin-cmdline-cbcollect_info).

    * One XDCR REST API endpoint had a typo which is now fixed. The old endpoint was
      `/controller/cancelXCDR/:xid`. The new, correct endpoint is
      `/controller/cancelXDCR/:xid`. See [Deleting XDCR
      Replications](#couchbase-admin-restapi-xdcr-delete-repl).

      *Issues* : [MB-8347](http://www.couchbase.com/issues/browse/MB-8347)

    * In the past when you used `cbworkloadgen` you see this error `ImportError: No
      module named _sqlite3`. This has been fixed.

      *Issues* : [MB-8153](http://www.couchbase.com/issues/browse/MB-8153)

 * **Indexing and Querying**

    * In the past too many simultaneous views requests could overwhelm a node. You can
      now limit the number of simultaneous requests a node can receive. For more
      information, see REST-API, see [Limiting Simultaneous Node
      Requests](#couchbase-restapi-request-limits).

      *Issues* : [MB-8199](http://www.couchbase.com/issues/browse/MB-8199)

 * **Cross Datacenter Replication (XDCR)**

    * When you create a replication between two clusters, you may see two error
      messages: "Failed to grab remote bucket info, vbucket" and "Error replicating
      vbucket X". Nonetheless, replication will still start and then function as
      expected, but the error messages may appear for some time in the Web Console.
      This has been fixed.

      *Issues* : [MB-7786](http://www.couchbase.com/issues/browse/MB-7786),
      [MB-7457](http://www.couchbase.com/issues/browse/MB-7457)

**Known Issues in 2.1.0**

 * **Installation and Upgrade**

    * On Ubuntu if you upgrade from Couchbase Server 2.0 to 2.1.0 and use a
      non-default port, the upgrade can fail and return the message 'Failed to stop
      couchbase-server.' We recommend you use the default ports on both 2.0 and 2.1.0
      when you perform an upgrade.

      *Issues* : [MB-8051](http://www.couchbase.com/issues/browse/MB-8051)

    * You may have a installation of Couchbase Server with a custom data path. If you
      perform a server uninstall and then upgrade to 2.1.0 with the same custom data
      path, some older XDCR replication files may be left intact. This will result in
      server crashes and incorrect information in Web Console. The workaround for this
      case is to make sure you manually delete the `_replicator.couch.1` file from the
      server data directory before you install the new version of the server.
      Alternately you can delete the entire data directory before you install the new
      version of the server. If you choose this workaround, you may want to backup
      your data before you delete the entire directory. By default, on Linux this
      directory is at `/opt/couchbase/var/lib/couchbase/data/` and on Windows at
      `C:/Program Files/Couchbase/Server/var/lib/couchbase/data/`.

      *Issues* : [MB-8460](http://www.couchbase.com/issues/browse/MB-8460)

 * **Database Operations**

    * On Windows platforms, statistics from the server will incorrectly show a very
      high swap usage rate. This will be resolved in future releases of Couchbase
      Server.

      *Issues* : [MB-8461](http://www.couchbase.com/issues/browse/MB-8461)

    * If you edit a data bucket using the REST-API and you do not provide existing
      values for bucket properties, the server may reset existing bucket properties to
      the default value. To avoid this situation you should specify all existing
      bucket properties as well as the updated properties as parameters when you make
      this REST request. For more information, see [Couchbase Manual, Creating and
      Editing Data
      Buckets](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-creating-buckets.html).

      *Issues* : [MB-7897](http://www.couchbase.com/issues/browse/MB-7897)

    * Any non-UTF-8 characters are not filtered or logged by Couchbase Server. Future
      releases will address this issue.

      *Issues* : [MB-8427](http://www.couchbase.com/issues/browse/MB-8427)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * If you perform asynchronous operations from a client to Couchbase on Windows,
      you may receive unclear status messages due to character encoding issues on
      Windows. This impacts status messages in the response only; actual response data
      is unaffected by this problem. This will be resolved in future releases of
      Couchbase Server.

      *Issues* : [MB-8149](http://www.couchbase.com/issues/browse/MB-8149)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

    * A cluster rebalance may exit and produce the error
      {not\_all\_nodes\_are\_ready\_yet} if you perform the rebalance right after
      failing over a node in the cluster. You may need to wait 60 seconds after the
      node failover before you attempt the cluster rebalance.

      This is because the failover REST API is a synchronous operation with a timeout.
      If it fails to complete the failover process by the timeout, the operation
      internally switches into a asynchronous operation. It will immediately return
      and re-attempt failover in the background which will cause rebalance to fail
      since the failover operation is still running.

      *Issues* : [MB-7168](http://www.couchbase.com/issues/browse/MB-7168)

    * Stats call via Moxi are currently enabled, however if you use the command-line
      tool `cbstats` through Moxi on port 11211 to Couchbase Server, you will receive
      incorrect server statistics. To avoid this issue you should use port 11210 when
      you make a `cbstats` request.

      *Issues* : [MB-7678](http://www.couchbase.com/issues/browse/MB-7678)

    * If you perform a scripted rolling upgrade from 1.8.1 to 2.1.0 nodes, you should
      script a delay of 10 seconds after you add a node and before you request
      rebalance. Without this delay, you may request rebalance too soon and rebalance
      may fail and produce an error.

      *Issues* : [MB-8094](http://www.couchbase.com/issues/browse/MB-8094)

 * **Command-line Tools**

    * `cbbackup` will backup even deleted items from a cluster which are not needed.
      In future releases it will ignore these items and not back them up.

      *Issues* : [MB-8377](http://www.couchbase.com/issues/browse/MB-8377)

    * `cbstats` will not work on port 11210 if you installed Couchbase Server without
      root-level permissions.

      *Issues* : [MB-7878](http://www.couchbase.com/issues/browse/MB-7878)

 * **Indexing and Querying**

    * If you rebalance a cluster, index compaction starts but bucket compaction will
      not start. This is because vBucket cleanup from an index is not accounted for in
      index fragmentation. After this cleanup process completes it will cause more
      index fragmentation and therefore we run compaction again. Index compaction will
      therefore always run after a certain number of changes to vBuckets on nodes. You
      can change this setting using the REST-API, see [Adjusting Rebalance during
      Compaction](#couchbase-admin-restapi-rebalance-before-compaction).

      *Issues* : [MB-8319](http://www.couchbase.com/issues/browse/MB-8319)

 * **Performance**

    * RHEL6 and other newer Linux distributions running on physical hardware are known
      to have transparent hugepages feature enabled. In general this can provide a
      measurable performance boost. However under some conditions that Couchbase
      Server is known to trigger, this may cause severe delays in page allocations.
      Therefore we strongly recommend you disable this feature with Couchbase Server.

      *Issues* : [MB-8456](http://www.couchbase.com/issues/browse/MB-8456)

<a id="couchbase-server-limits"></a>
