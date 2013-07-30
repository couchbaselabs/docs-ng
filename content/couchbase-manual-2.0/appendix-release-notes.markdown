# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Server. To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

<a id="couchbase-server-rn_2-0-0l"></a>

## Release Notes for Couchbase Server 2.0.1 GA (March 2013)

Couchbase Server 2.0.1 is first maintenance release for Couchbase Server 2.0.
This release contains number of enhancements particularly for the rebalance,
indexing and compaction operations. In addition, it also includes some critical
bug fixes related to system timeouts and system stability. This includes:

 * Improves rebalance operation time for key-value use cases.

 * Improves coordination of index compaction and index building that occurs during
   the rebalance operation. This helps significantly reduce the index file size
   growth during rebalance.

 * Changes to high and low water marks that provides more usable memory for users.

 * Fixes timeout problems that were seen due to Erlang VM settings.

 * Fixes a critical indexing problem. A document that produced a runtime failure in
   one view had been unavailable to all other views within the same design
   document.

**Fixes in 2.0.1**

 * **Installation and Upgrade**

    * We now provide a warning message on minimal system requirements for Couchbase
      Server. This appears on Linux in the terminal, and on Windows as a InstallShield
      screen. For more information about minimum platform requirements, see the
      section [Preparation](#couchbase-getting-started-prepare).

      *Issues* : [MB-7482](http://www.couchbase.com/issues/browse/MB-7482)

 * **Cluster Operations**

    * The server had experienced timeouts during rebalance if views were being indexed
      or compacted at the same time. This resulted in the rebalance to fail. This has
      been fixed.

      *Issues* : [MB-6595](http://www.couchbase.com/issues/browse/MB-6595)

    * In the past, if you were performing an online upgrade of a 1.8 cluster to 2.0 by
      adding 2.0 nodes, the dynamic configuration file on 2.0 nodes would be purged.
      This resulted in any XDCR remote cluster references to be lost on the 2.0 nodes
      and would produce this error message `"case_clause,error"`. This is now fixed.

      *Issues* : [MB-7568](http://www.couchbase.com/issues/browse/MB-7568)

    * The server had experienced random timeouts possible due to lack of asynchronous
      I/O threads. This caused rebalance to fail. This has been fixed.

      *Issues* : [MB-7182](http://www.couchbase.com/issues/browse/MB-7182)

 * **Command-line Tools**

    * There is a new setting available in `cbepctl` named `mutation_mem_threshold`.
      This is the amount of RAM that can be used on the server before a client begins
      receiving temporary out of memory errors. For more information, see [Changing
      Setting for Out Of Memory Errors](#couchbase-admin-cbepctl-mutation_mem).

      *Issues* : [MB-7540](http://www.couchbase.com/issues/browse/MB-7540)

 * **Indexing and Querying**

    * In past releases of Couchbase Server 2.0, if you had a map function that failed
      to index, other functions in the same design document would also fail. This has
      been fixed.

      *Issues* : [MB-6895](http://www.couchbase.com/issues/browse/MB-6895)

    * During rebalance, index files were growing to an unnecessarily large size. This
      has been fixed.

      *Issues* : [MB-6799](http://www.couchbase.com/issues/browse/MB-6799)

    * There is a new REST-API call which can be used if you experience a slow
      rebalance while indexing and compaction are in progress. For more information,
      see [Adjusting Rebalance during
      Compaction](#couchbase-admin-restapi-rebalance-before-compaction).

      *Issues* : [MB-7843](http://www.couchbase.com/issues/browse/MB-7843)

 * **Cross Datacenter Replication (XDCR)**

    * Stats for XDCR had erroneously omitted the time taken to commit items and had
      also displayed the incorrect number of documents/mutations checked and
      replicated. This is fixed.

      *Issues* : [MB-7275](http://www.couchbase.com/issues/browse/MB-7275)

    * When you create a replication between two clusters, you may see two error
      messages: "Failed to grab remote bucket info, vbucket" and "Error replicating
      vbucket X". Nonetheless, replication will still start and then function as
      expected, but the error messages may appear for some time in the Web Console.
      This has been fixed.

      *Issues* : [MB-7786](http://www.couchbase.com/issues/browse/MB-7786),
      [MB-7457](http://www.couchbase.com/issues/browse/MB-7457)

**Known Issues in 2.0.1**

 * **Installation and Upgrade**

    * When you upgrade from Couchbase Server 2.0.0 to 2.0.1 on Linux the install may
      not replace the `file2.beam` with the latest version. This will cause indexing
      and querying to fail. The workaround is to install 2.0.1 and then manually
      restart Couchbase Server with the following commands:

       ```
       sudo /etc/init.d/couchbase-server stop
       sudo /etc/init.d/couchbase-server start
       ```

      *Issues* : [MB-7770](http://www.couchbase.com/issues/browse/MB-7770)

    * If you perform an online upgrade from Couchbase Server 2.0.0 to 2.0.1, rebalance
      may exit with the error:

       ```
       {{{linked_process_died,....,normal},
       {gen_server,call,
       ['capi_set_view_manager-sasl',
       {set_vbucket_states,
       ```

      *Issues* : [MB-7771](http://www.couchbase.com/issues/browse/MB-7771)

 * **Database Operations**

    * In OpenVZ Linux containers, the server had crashed and restarted when you
      created a Couchbase bucket. This was due to an issue in the memsup process from
      Erlang. To fix this issue, you should upgrade to the latest version of Erlang,
      and have Couchbase Server use this version:

       1. Stop Couchbase Server.

       1. Make a copy of your original memsup then get the patch available on GitHub:
          [memsup patch](https://github.com/vorobev/otp/compare/maint-memsup.patch ).

       1. Place the compiled code in `/opt/membase/lib/erlang/lib/os_mon-2.2.5/priv/bin/`.

       1. Start Couchbase Server.

      *Issues* : [MB-7626](http://www.couchbase.com/issues/browse/MB-7626)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * If you want to add a new Couchbase Server 2.0.1 node to a running 2.0 cluster,
      and you want to refer to this node by hostname do the following on the new node:

       * On Linux: create a file named `ip_start` in the directory
         `/opt/couchbase/var/lib/couchbase` for the node. In this new file, add a line
         provides the DNS name or IP address that you want to use to refer to the node.

       * On Windows: create a file named `ip_start` in the directory `c:\program
         files\couchbase\server\var\lib\couchbase` for the node. In this new file, add a
         line provides the DNS name or IP address that you want to use to refer to the
         node.

      For more information, see [Couchbase Manual 2.0, Node Upgrade
      Process](couchbase-getting-started-upgrade-individual).

      *Issues* : [MB-7664](http://www.couchbase.com/issues/browse/MB-7664)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

    * If you try to add a node during cluster rebalance, the rebalance may fail and
      return the messages `{detected_nodes_change` or `{ns_node_disco_events`. To
      avoid this error complete your cluster rebalance, add the new node and then
      rebalance once again. This issue will be fixed in future releases.

      *Issues* : [MB-6280](http://www.couchbase.com/issues/browse/MB-6280)

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

 * **Indexing and Querying**

    * If you have a large amount of data in Couchbase Server and also use views, data
      compaction and views compaction may not automatically start. If you encounter
      this issue, you should change your node settings so that data and views
      compaction will start in paralell. In Couchbase Web Console: Select Settings |
      Auto-Compaction | Process Database and View compaction in paralell.

      *Issues* : [MB-7781](http://www.couchbase.com/issues/browse/MB-7781)

 * **Cross Datacenter Replication (XDCR)**

    * You may experience an uneven rate of replication for nodes in a cluster. This is
      intermittent behavior that is due to different disk drain rates at different
      nodes and will subside by itself over time. There is no need to change any
      settings on your cluster to try to resolve this behavior.

      *Issues* : [MB-7657](http://www.couchbase.com/issues/browse/MB-7657)

<a id="couchbase-server-rn_2-0-0k"></a>

## Release Notes for Couchbase Server 2.0.0 GA (December 12 2012)

Couchbase Server is a NoSQL document database for interactive web applications.
It has a flexible data model, is easily scalable, provides consistent high
performance and is "always-on," meaning it can serve application data 24 hours,
7 days a week. For more information about Couchbase Server 2.0, visit [Couchbase
Server 2.0](http://www.couchbase.com/couchbase-server/overview).

The major new features available in Couchbase Server 2.0 include:

 * **Flexible data model**. Couchbase provides a schema-less, JSON-based data model
   which is more efficient and intuitive to work with compared to the fixed-schema
   approach used by RDBMS. With JSON you can use different structures for
   application objects; it is much easier to represent complex data, and you can
   add new types of data without having to go through typical schema migration.

 * **Indexing and Querying**. With Couchbase Server 2.0, you can easily find
   documents and perform calculations on your data by using *views* in 2.0. Indexes
   can be defined using JSON and JavaScript functions. Once you have defined your
   functions you can query the information or perform calculations on the
   information using Couchbase Web Console or a Couchbase SDK.

 * **Incremental Map/Reduce**. Couchbase Server supports *incremental index
   building*, meaning it only re-indexes documents that have been changed since the
   last index update. Instead of recomputing index results from the beginning every
   time data changes in your database, Couchbase Server stores intermediate results
   in the index and can recalculate this data only when necessary. This means you
   do not need to wait for a batch job across the entire data set to finish each
   time you want to see your results.

 * **Cross Data Center Replication (XDCR)**. In 2.0, we add cross data center
   replication which enables you to replicate data from one cluster to another one
   so that your data is always available 24x365. It provides you with an easy way
   to replicate active data uni-directionally or bi-directionally between multiple
   data centers in different geographical areas. This provides you a copy of your
   data for disaster recovery and can help you bring your data closer to your end
   users for better application performance.

**New Features and Behaviour Changes in 2.0.0**

 * **XDCR (Cross Data-Center Replication) Enhancements.**

   This includes the following features and enhancements:

    * Performance improvements. Performance for outbound replication from a source
      cluster to a destination has been improved. CPU utilization on destination
      clusters has been reduced for better performance.

    * Improved Error Handling and Logging. More information about documents and the
      size of documents awaiting replication now available.

    * UI Improvements for XDCR in the Couchbase Web Console.

   The Couchbase Web Admin Console has been expanded to show the number of
   documents waiting to be replicated via XDCR and the total size of all documents
   waiting for replication. Low-level errors and statistics have been moved to a
   Couchbase Web Console log file to avoid information overload and confusion.
   Messages that are more appropriately categorized as recoverable states have been
   labeled warnings, not errors.

 * New sample data buckets are available to get you started with Couchbase Server
   2.0. The new buckets include sample documents as well as views so you play
   around with the new Couchbase Server 2.0 features.

 * Online compaction for data and indexes, which kicks off based on fragmentation
   thresholds. You can configure these thresholds along with the compaction
   schedule. In addition, the UI gives you more visibility into background
   compaction. For more information, see [Auto-Compaction
   Configuration](#couchbase-admin-tasks-compaction-autocompaction).

 * There is also now a new REST-API in Couchbase Server 2.0 where you can enable or
   disable flush for each data bucket in a cluster. This also enables you to flush
   an individual bucket in a cluster or multiple buckets on a cluster with a single
   REST-API command. For more information, see [Flushing a
   Bucket](#couchbase-admin-restapi-flushing-bucket).

   *Issues* : [MB-6776](http://www.couchbase.com/issues/browse/MB-6776)

 * Improve and enable data flush for entire cluster via individual data buckets.
   Ability to disable and enable the configuration setting for safe cluster
   administration. For more information, see [Editing Couchbase
   Buckets](#couchbase-admin-web-console-data-buckets-createedit-editcb).

 * New command-line tools, and consolidated tools provided in new locations. This
   is to simplify your use of these tools. For more information about these
   improvements, and the location of new tools, see [Command Line Tools and
   Availability](#couchbase-admin-cmdline-rename-remove-new).

 * Improved working set management. When your working set of documents becomes
   larger than allocated memory, the system needs to eject documents. Couchbase now
   tracks recently accessed, updated or inserted documents and ejects “not recently
   used” documents from RAM. This working set metadata is also replicated so that
   after a rebalance operation, your working set is maintained on the new nodes in
   the cluster for reduced latencies post rebalance.

 * Server logs have been split and have been provided logical naming. This makes it
   easier for you to spot or diagnose server issues. For more information, see
   [Logs and Logging](#couchbase-troubleshooting-logs).

 * **Querying Views during Rebalance**.

   If you perform queries during rebalance, this new feature will ensure that you
   receive the query results that you would expect from a node as if it is not
   being rebalanced. During node rebalance, you will get the same results you would
   get as if the data were on an original node and as if data were not being moved
   from one node to another. In other words, this new feature ensures you get query
   results from a new node during rebalance that are consistent with the query
   results you would have received from the node before rebalance started.

   With this new feature, you will get the same query results before rebalance,
   during rebalance and after rebalance. Without this new functionality querying a
   view during rebalance would have provided results inconsistent with the results
   from a source node. With this new functionality enabled, data that is being
   moved from one node to another node will be incrementally added to an index
   available at the new node so that you get query results that are consistent with
   your expectations.

 * New append-only persistence engine. This improves disk write performance as
   updates are written only to the end of the file. Additional disk resources are
   required..

 * Shorter server warm-up time. When Couchbase Server is restarted, or when it is
   started after an offline recovery from backup, the server goes through a warm-up
   process first loading metadata from disk into RAM. Additionally, it loads the
   documents that belong to the tracked working set maintained in an access log.
   This reduces warm-up time and also makes the most relevant data available
   instead of sequentially loading all data into RAM.

 * **General Changes in Rebalance Behavior**.

   During rebalance, Couchbase Server now has new internal logic that will wait for
   data to be persisted at a new node before the new node takes responsibility for
   serving the data. In situations where you want a very high level of durability,
   this can provide you more assurance that your data can be recovered after node
   failures.

**Fixes in 2.0.0**

 * **Database Operations**

    * Now provide timestamp for when a TAP queue backfill starts. The TAP backfill
      queue is used to send a snapshot of a vbucket to another node.

      *Issues* : [MB-6753](http://www.couchbase.com/issues/browse/MB-6753)

    * Couchbase Server had created new checkpoints even in the case where empty,
      current checkpoints were available. The server provided extraneous notifications
      when various changes to checkpoints ID occurred due to constant polling by XDCR.
      Now when an empty checkpoint is available, the server uses this checkpoint for
      additional replication and provide this checkpoint ID to XDCR. The server also
      pushes a single notification to XDCR when a checkpoint is empty.

    * In the past if you set the disk path for data to be the same path as that for
      index files, Couchbase Server would fail to start. This is fixed.

      *Issues* : [MB-6995](http://www.couchbase.com/issues/browse/MB-6995)

    * In the past, if you used a symbolic link to reference a data directory for
      Couchbase Server, the server determined remaining free only for the partition
      that contained the symbolic link. This resulted in two issues: 1) incorrect
      information in the Couchbase Web Console, 2) more significantly, it would
      accidentally inhibit the data compaction process because of incorrect
      information about free disk space. This has been fixed in 2.0.

      *Issues* : [MB-7307](http://www.couchbase.com/issues/browse/MB-7307)

    * During Couchbase Server warmup or rebalance, if you delete a data bucket, it
      will cause the node to crash.

      *Issues* : [MB-7272](http://www.couchbase.com/issues/browse/MB-7272)

    * Performing a touch operation and providing an expiration of 0, to indicate no
      expiration did not function. This is now fixed.

      *Issues* : [MB-7342](http://www.couchbase.com/issues/browse/MB-7342)

    * We now log all vBucket state changes as mccouch events.

      *Issues* : [MB-7057](http://www.couchbase.com/issues/browse/MB-7057)

    * To handle current limitations on open file descriptors allowed on MacOS, the
      number of vBuckets on MacOS have been reduced to 64 from 1024. This reduces the
      number of files that are created for data as well as for indexes. Overall this
      provides improved CPU and disk I/O for MacOS.

      Note however that replication via XDCR between a MacOS and non-MacOS servers
      will not work due to the mismatch in the number of vBuckets between Mac OSX and
      other platforms.

      In addition mixed clusters with Couchbase nodes running on Mac OSX and on
      non-Mac OSX platforms will not function. In general Mac OSX is supported by
      Couchbase only for developing with Couchbase Server and not for production.

      *Issues* : [MB-6781](http://www.couchbase.com/issues/browse/MB-6781)

    * Check-and-set value was not returned in response to a successful delete request.
      Now it is returned as part of the response.

      *Issues* : [MB-6661](http://www.couchbase.com/issues/browse/MB-6661)

    * In the past, the server would delete items even if a provided CAS value was a
      mismatch. This has been fixed.

      *Issues* : [MB-6985](http://www.couchbase.com/issues/browse/MB-6985)

 * **Cluster Operations**

    * Get-and-touch function were not providing the correct error information from the
      server. Get-and-touch now returns ENOENT if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * The Couchbase REST-API has changed to enable you to change the default maximum
      number of buckets used in a Couchbase cluster. The maximum allowed buckets in
      this request is 128, however the maximum suggested number of buckets is ten per
      cluster. This is a safety mechanism to ensure that a cluster does not have
      resource and CPU overuse due to too many buckets. The following illustrates the
      endpoint and parameters used:

       ```
       shell>    curl -X -u admin:password -d maxBucketCount=6 http://ip_address:8091/internalSettings
       ```

      For this request you need to provide administrative credentials for the cluster.
      The following HTTP request will be sent:

       ```
       About to connect() to 127.0.0.1 port 8091 (#0)
       Trying 127.0.0.1...
       connected
       Connected to 127.0.0.1 (127.0.0.1) port 8091 (#0)
       Server auth using Basic with user 'Administrator'
       POST /internalSettings HTTP/1.1
       ```

      If Couchbase Server successfully changes the bucket limit for the cluster, you
      will get a HTTP 200 response:

       ```
       HTTP/1.1 200 OK
       Server: Couchbase Server 2.0.0r_501_gb614829
       Pragma: no-cache
       Date: Wed, 31 Oct 2012 21:21:48 GMT
       Content-Type: application/json
       Content-Length: 2
       Cache-Control: no-cache
       ```

      If you provide an invalid number, such as 0, a negative number, or an amount
      over 128 buckets, you will get this error message:

       ```
       ["Unexpected server error, request logged."]
       ```

      For more information about setting buckets per cluster via REST-API, see
      [Setting Maximum Buckets for Clusters](#couchbase-admin-restapi-max-buckets).

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

 * **Web Console**

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      inhibited people from performing ongoing work and demonstrations of the server.

    * For Mac OSX, we had provided a drop-down UI menu for logs that pointed to the
      wrong location. This menu option has been removed since it is already provided
      in the Web Console.

      *Issues* : [MB-7075](http://www.couchbase.com/issues/browse/MB-7075)

    * We now provide memcached logs in the diagnostic reports available from the
      Couchbase Web Console.

      *Issues* : [MB-7048](http://www.couchbase.com/issues/browse/MB-7048)

 * **Command-line Tools**

    * Several command line tools have been deprecated, superceded, or moved. This
      includes `cbflushctl` which has been superceded by `cbepctl`. For more
      information, see [Command-line Interface for
      Administration](#couchbase-admin-cmdline).

      *Issues* : [MB-6912](http://www.couchbase.com/issues/browse/MB-6912)

    * For Mac OSX, the tool for collecting statistics for Couchbase technical support
      `cbcollect_info` was not functioning. We have fixed it.

      *Issues* : [MB-6958](http://www.couchbase.com/issues/browse/MB-6958)

    * Incorrect message had been sent in response to a `cbstats vkey` command. Server
      had returned the string 'not found' for valid request. Now correct the memcached
      protocol error is returned. For more information about `cbstats`, see [cbstats
      Tool](#couchbase-admin-cmdline-cbstats).

      *Issues* : [MB-6751](http://www.couchbase.com/issues/browse/MB-6751)

    * `cbepctl` help options now show option for setting the expiry\_pager, a
      maintenance process for removing deleted items from disk.

      *Issues* : [MB-6764](http://www.couchbase.com/issues/browse/MB-6764)

 * **Cross Datacenter Replication (XDCR)**

    * Fix rebalance timeout failure during unidirectional replication of items via
      XDCR. Failure had returned message: "timeout,
      ns\_memcached-bucket','ns\_1@10.1.3.238'}, {get\_vbucket,".

      *Issues* : [MB-6493](http://www.couchbase.com/issues/browse/MB-6493)

    * Errors had occurred performing replication via XDCR due to improper handling of
      non- UTF-8 characters. We now handle errors due to non- UTF-8 characters and can
      continue replication via XDCR for JSON documents containing non- UTF-8.

      *Issues* : [MB-7092](http://www.couchbase.com/issues/browse/MB-7092)

    * We have added 3 new outbound operation stats, namely, 1) data replicated, which
      is amount of data XDCR have replicated to the remote data center through inter-
      cluster network; 2) active vb replications, which shows the number of ongoing
      active replications to the remote clusters; 3) waiting vb replications, which is
      the number of vb replications in the waiting pool to wait for turn to start
      replication. These stats will be useful for performance monitoring and
      diagnosis.

      *Issues* : [MB-6919](http://www.couchbase.com/issues/browse/MB-6919)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

**Known Issues in 2.0.0**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * By default when you perform a new install of Couchbase Server 2.0, creating a
      replica index for a data bucket is disabled by default. This should be the
      standard default setting for all new installs of the server. However, when you
      upgrade from 1.8.1 to 2.0, be aware it is enabled by default.

      *Issues* : [MB-7339](http://www.couchbase.com/issues/browse/MB-7339)

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * In order to upgrade from 1.8.1 to 2.0 for the Microsoft Windows platform, you
      need to make changes to the ip file located on the node at
      Couchbase\Server\var\lib\couchbase\ip as well as complete some additional steps
      on your node which will apply whether you are using Windows on the cloud or not.
      For more information about upgrading from 1.8.x to 2.0, see [Upgrades Notes
      1.8.1 to 2.0 +](#couchbase-getting-started-upgrade-1-8-2-0).

      *Issues* : [MB-7289](http://www.couchbase.com/issues/browse/MB-7289)

      For more information, see [Handling Changes in IP
      Addresses](#couchbase-bestpractice-cloud-ip).

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

    * Performing an upgrade from Couchbase 1.8.1 to Couchbase 2.0.0 GA build freezes
      while transferring data from SQLite files to Couchstore files using
      `cbtransfer`.

      *Issues* : [MB-7341](http://www.couchbase.com/issues/browse/MB-7341)

    * If you use `couchbase-cli` to setup a Couchbase node on a non-default port, you
      may receive an error. Although the cluster gets initialized, the initial RAM
      quota is not used and the server returns an error.

      *Issues* : [MB-7268](http://www.couchbase.com/issues/browse/MB-7268)

    * On Ubuntu 64-bit 12.04, when you upgrade Couchbase Server from 1.8.1 to 2.0 the
      upgrade will work, however the server erroneously returns an error in the end
      when it starts. The error is: "Failed to start couchbase-server dpkg: error
      processing couchbase-server (‐‐install)". Ignore this error message.

      *Issues* : [MB-7298](http://www.couchbase.com/issues/browse/MB-7298)

 * **Database Operations**

    * Several incidents have been reported that after using Flush on nodes, Couchbase
      Server returns TMPFAIL even after a successful flush.

      *Issues* : [MB-7160](http://www.couchbase.com/issues/browse/MB-7160)

    * For the Windows platform, attempts to perform a rebalance of a restarted node
      fails due to failure to clean up old data buckets on the node. The workaround is
      to retry the rebalance.

      *Issues* : [MB-7202](http://www.couchbase.com/issues/browse/MB-7202)

    * If you reset the disk path to a path that contained corrupted data, Couchbase
      Server will shut down and non response. When you change the data path to a
      different folder, make sure it does not contain files with a different format or
      with incorrect permissions.

      *Issues* : [MB-7185](http://www.couchbase.com/issues/browse/MB-7185)

    * Be aware that you may experience delays while node is in a pending state after
      you change the index path for that node. This will be fixed in a point release
      after 2.0 GA.

      *Issues* : [MB-7337](http://www.couchbase.com/issues/browse/MB-7337)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * During a rebalance operation for clusters undergoing uni- and bi-directional
      replication via XDCR, the following server errors may appear, which are
      currently under investigation:

       ```
       Server error during processing: ["web request failed",
       {path,"/pools/default"},
       {type,exit},
       {what,
       {timeout,
       {gen_server,call,
       [ns_doctor,get_tasks_version]}}},
       {trace,
       [{gen_server,call,2},
       {menelaus_web,build_pool_info,4},
       {menelaus_web,handle_pool_info_wait,5},
       {menelaus_web,loop,3},
       {mochiweb_http,headers,5},
       {proc_lib,init_p_do_apply,3}]}] (repeated 1 times)
       ```

      *Issues* : [MB-7286](http://www.couchbase.com/issues/browse/MB-7286)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

    * One of the internal maintenance processes within Couchbase Server for checking
      vBuckets will stop node rebalance when you create replication via XDCR on a
      source cluster.

      A node in a cluster may also stop rebalance when another node orchestrating
      rebalances is over loaded. When a node stops rebalance, it results in the error
      message "Resetting rebalance status since it is not really running".

      Rebalance cna also fail due to the timeout in `bulk_set_vbucket_state` operation
      with continuous view queries.

      *Issues* : [MB-6481](http://www.couchbase.com/issues/browse/MB-6481),
      [MB-6573](http://www.couchbase.com/issues/browse/MB-6573),
      [MB-7212](http://www.couchbase.com/issues/browse/MB-7212)

 * **Web Console**

    * The Couchbase Web Console will erroneously clear all summary statistics for a
      data bucket when a new index is being generated in the background. The
      workaround is to reload the page to get the current statistics.

      *Issues* : [MB-7090](http://www.couchbase.com/issues/browse/MB-7090)

    * Be aware that if attempt hundreds of simultaneous queries with an unlimited
      number of results, Couchbase Server may fail. If you have a result set from
      indexing that contains 10 million items or more, and you query for that entire
      result set, the server will fail.

      Instead you should specify a reasonable limit of results when you query, such as
      retriving a range of results from the larger set, otherwise the server will
      stall and crash due to excessive memory usage. For more information about
      querying and specifying a subset of results, see [Querying
      Views](#couchbase-views-writing-querying).

      *Issues* : [MB-7199](http://www.couchbase.com/issues/browse/MB-7199)

    * If you have a cluster running Couchbase Server 1.8.1 and 2.0.0, Couchbase Web
      Console 2.0 will show incorrect, sometimes negative values for Disk Usage in the
      summary section. Ignore this error.

      *Issues* : [MB-7183](http://www.couchbase.com/issues/browse/MB-7183)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * The sample data loader will fail to run on a cluster when the cluster contains
      nodes with different versions of Couchbase. The workaround is to upgrade all
      cluster nodes to Couchbase Server 2.0. For more information about upgrading
      nodes from 1.8.x to 2.0, see [Upgrades Notes 1.8.1 to 2.0
      +](#couchbase-getting-started-upgrade-1-8-2-0).

      *Issues* : [MB-7171](http://www.couchbase.com/issues/browse/MB-7171)

    * The couchbase command line tool, `couchbase-cli` does not enable you to set
      `index_path` as a separate parameter as `data_path`. The former contains indexed
      data from defined views functions, while the later contains keys, metadata, and
      JSON documents. You can however use the REST-API to do this.

      *Issues* : [MB-7323](http://www.couchbase.com/issues/browse/MB-7323)

      For more information, see [Configuring Index Path for a
      Node](#couchbase-admin-restapi-provisioning-diskpath).

    * The sample data loader will also fail if there are multiple nodes in a cluster
      and creating a bucket in the cluster is taking longer than 10 seconds.

      *Issues* : [MB-7170](http://www.couchbase.com/issues/browse/MB-7170)

 * **Indexing and Querying**

    * If you are using development views, be aware you may see inconsistent results if
      you query a development view during rebalance. For production views, you are
      able to query during rebalance and get results consistent with those you would
      have recieved if no rebalance were occurring.

      *Issues* : [MB-6967](http://www.couchbase.com/issues/browse/MB-6967)

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

    * If a map function in a design document fails while processing a document, that
      document will also not be computed for any other map functions in the same
      design document. To avoid creating errors in your views functions, see the tips
      and advice provided in [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      *Issues* : [MB-6895](http://www.couchbase.com/issues/browse/MB-6895)

    * Couchbase Server does lazy expiration, that is, expired items are flagged as
      deleted rather than being immediately erased. Couchbase Server has a maintenance
      process that will periodically look through all information and erase expired
      items. This means expired items may still be indexed and appear in result sets
      of views. The workarounds for this behavior are available here [About Document
      Expiration](http://www.couchbase.com/docs/couchbase-devguide-2.0/about-ttl-values.html).

      *Issues* : [MB-7053](http://www.couchbase.com/issues/browse/MB-7053)

 * **Cross Datacenter Replication (XDCR)**

    * `beam.smp` memory usage grows to 2 GB when XDCR feature is enabled and
      rebalancing is in progress.

      *Issues* : [MB-6649](http://www.couchbase.com/issues/browse/MB-6649)

    * Under the XDCR tab for Couchbase Web Console, the link to a a destination
      cluster takes you to a missing URL. A simple workaround is to append ':8091' to
      the address in the newly opened browser tab.

      *Issues* : [MB-7211](http://www.couchbase.com/issues/browse/MB-7211)

    * Replication rat e may drop when the XDCR replication queue size becomes less
      than 500 items.

      *Issues* : [MB-6586](http://www.couchbase.com/issues/browse/MB-6586)

    * Be aware that if you are using XDCR for replication to a destination bucket and
      you remove and create a new bucket with the same name, it has a different UUIDs.
      Therefore any replication you had established with the deleted bucket will not
      apply to the new bucket.

      *Issues* : [MB-7262](http://www.couchbase.com/issues/browse/MB-7262)

 * **Performance**

    * Under a heavy load of write operations on two clusters and both bi-directional
      and uni-directional replications occurring via XDCR, Couchbase Server 2.0 may
      fail during rebalance.

      *Issues* : [MB-7290](http://www.couchbase.com/issues/browse/MB-7290)

    * `ep-engine` needs 1.5 minutes to create 1024 vbuckets. This may be too slow,
      however performance improves with setting barrier=0.

      *Issues* : [MB-6232](http://www.couchbase.com/issues/browse/MB-6232)

<a id="couchbase-server-rn_2-0-0j"></a>

## Release Notes for Couchbase Server 2.0.0 #1941 Beta (November 13 2012)

This is build \#1941 of Couchbase Server 2.0. Couchbase Server is a NoSQL
document database for interactive web applications. It has a flexible data
model, is easily scalable, provides consistent high performance and is
"always-on," meaning it can serve application data 24 hours, 7 days a week. For
more information about Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

The major improvements made between build \#1870 and build \#1941 are described
below:

**New Features and Behaviour Changes in 2.0.0 \#1941**

 * The default node quota percentage has been reduced from 80% to 60% to provide
   capacity in the operating system for the view and indexing data to be cached.

   *Issues* : [MB-6973](http://www.couchbase.com/issues/browse/MB-6973)

**Fixes in 2.0.0 \#1941**

 * **Installation and Upgrade**

    * For Mac OSX, we provide the correct version number in the README.

      *Issues* : [MB-6697](http://www.couchbase.com/issues/browse/MB-6697)

 * **Database Operations**

    * The default timeout for persisting a checkpoint had been 10 seconds. This
      default is still in place, but will now be adjusted upward or downward by the
      server to be the last duration required to persist a checkpoint. This is to
      better optimize server resources for indexing during rebalance.

      *Issues* : [MB-6976](http://www.couchbase.com/issues/browse/MB-6976)

    * In the past, we declared the revision value for a document to be 32- bit value
      and have changed this to 48- bit value. This is to support a larger number of
      document revisions and to support conflict resolution in XDCR.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * Document revision numbers had been stored as 32 bit values but are now stored as
      larger 48 bit values. This enables more documents to be changed or deleted for
      the same database shard. A Couchbase cluster can run for more than three years
      performing 400,000 operations a second until revision sequence limits are met.
      This change is to support the functioning of XDCR and to support a larger number
      of document revisions.

      This fix changes the on-disk data format. You will not be able to use data files
      from prior builds of Couchbase Server 2.0 on this new build.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * For Windows, rebalanced has exited due to some concurrent file operations that
      are not allowed on this platform. This has been fixed by enabling retry of file
      operations for Windows during rebalance.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * Document revision numbers had been stored as 32 bit but are now stored as 48 bit
      values. This is to support the functioning of XDCR and to support a larger
      number of document revisions.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * By default we now provide garbage collection more frequently than the normal
      default for Erlang. This keeps memory usage by the Erlang virtual machine lower,
      and enables better performance.

      *Issues* : [MB-6974](http://www.couchbase.com/issues/browse/MB-6974)

    * We now provide more log information about errors during vBucket reset and
      deletion.

      *Issues* : [MB-6494](http://www.couchbase.com/issues/browse/MB-6494)

    * Couchbase Server had intermittently crashed during rebalance due to Erlang
      virtual machine issues; we now disable asynchronous threads and perform garbage
      collection more often to avoid timeouts and process crashes.

      *Issues* : [MB-6638](http://www.couchbase.com/issues/browse/MB-6638)

    * We now log all vBucket state changes as mccouch events.

      *Issues* : [MB-7057](http://www.couchbase.com/issues/browse/MB-7057)

    * To handle current limitations on open file descriptors allowed on MacOS, the
      number of vBuckets on MacOS have been reduced to 64 from 1024. This reduces the
      number of files that are created for data as well as for indexes. Overall this
      provides improved CPU and disk I/O for MacOS.

      Note however that replication via XDCR between a MacOS and non-MacOS servers
      will not work due to the mismatch in the number of vBuckets between Mac OSX and
      other platforms.

      In addition mixed clusters with Couchbase nodes running on Mac OSX and on
      non-Mac OSX platforms will not function. In general Mac OSX is supported by
      Couchbase only for developing with Couchbase Server and not for production.

      *Issues* : [MB-6781](http://www.couchbase.com/issues/browse/MB-6781)

    * In the past, the server would delete items even if a provided CAS value was a
      mismatch. This has been fixed.

      *Issues* : [MB-6985](http://www.couchbase.com/issues/browse/MB-6985)

 * **Cluster Operations**

    * Get-and-touch function were not providing the correct error information from the
      server. Get-and-touch now returns ENOENT if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * Server now releases returned document that is being marked deleted. This fixes a
      rebalance failure where memcached crashes on one of the nodes and rebalance
      exits with the error: `{mover_failed,{badmatch, known macro: {error,closed}}}`.

      *Issues* : [MB-6806](http://www.couchbase.com/issues/browse/MB-6806)

    * Rebalanced had been delayed after failing-over a disconnected node. This is
      fixed.

      *Issues* : [MB-6992](http://www.couchbase.com/issues/browse/MB-6992)

    * The Erlang virtual machine had intermittently crashed when adding a node and
      rebalancing. By increasing the checkpoint timeout for XDCR replication we have
      resolved the issue.

      *Issues* : [MB-7056](http://www.couchbase.com/issues/browse/MB-7056)

 * **Web Console**

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      inhibited people from performing ongoing work and demonstrations of the server.

    * In the past, clicking on a document name shown in the View Results panel did not
      load the document in the sample document pane. This has been fixed.

      *Issues* : [MB-6500](http://www.couchbase.com/issues/browse/MB-6500)

    * A data request error had been returned when a user attempted to save spatial
      views containing map or reduce functions which could not compile. A new error
      handler has been added to display a more helpful message.

      *Issues* : [MB-7029](http://www.couchbase.com/issues/browse/MB-7029)

    * We now refresh the available design documents in the Web Console when you move
      to the views section.

      *Issues* : [MB-6978](http://www.couchbase.com/issues/browse/MB-6978)

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      was cumbersome and annoying for people performing ongoing work and
      demonstrations of the server.

      *Issues* : [MB-6679](http://www.couchbase.com/issues/browse/MB-6679)

    * Number of documents per page specified in the top right corner on the Documents
      page of Couchbase Web Console does not match the number of documents actually
      presented to the user. This is fixed.

      *Issues* : [MB-7011](http://www.couchbase.com/issues/browse/MB-7011)

    * The number of documents you can skip in the Web console is now 1000. This is to
      avoid overloading the user interface for a larger number of documents.

      *Issues* : [MB-7067](http://www.couchbase.com/issues/browse/MB-7067)

    * For Mac OSX, we had provided a drop-down UI menu for logs that pointed to the
      wrong location. This menu option has been removed since it is already provided
      in the Web Console.

      *Issues* : [MB-7075](http://www.couchbase.com/issues/browse/MB-7075)

    * We now provide memcached logs in the diagnostic reports available from the
      Couchbase Web Console.

      *Issues* : [MB-7048](http://www.couchbase.com/issues/browse/MB-7048)

 * **Command-line Tools**

    * Errors had occurred on windows trying to run Python workload generators. This
      has been fixed by adding the bin directory to the Python path.

      *Issues* : [MB-7086](http://www.couchbase.com/issues/browse/MB-7086)

    * Errors had occurred trying to access design documents associated with buckets
      requiring SASL authentication. This has been fixed by properly requiring
      authorization information to access these buckets.

      *Issues* : [MB-6757](http://www.couchbase.com/issues/browse/MB-6757)

    * For Mac OSX, the tool for collecting statistics for Couchbase technical support
      `cbcollect_info` was not functioning. We have fixed it.

      *Issues* : [MB-6958](http://www.couchbase.com/issues/browse/MB-6958)

 * **Indexing and Querying**

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      now provide validation of spatial functions.

      *Issues* : [MB-6990](http://www.couchbase.com/issues/browse/MB-6990)

    * For geo/spatial indexes, after updating a design document, or deleting a design
      document, the old index files and erlang processes were not released. This
      unnecessarily took disk space and resulted in leaking file descriptors. After
      database shard compaction, spatial/geo indexes would never release the file
      handle of the pre-compaction database files. This meant that disk space couldn't
      be reclaimed by the OS. This has now been fixed.

      For general indexes, after index compaction the pre-compaction index files were
      deleted but were somtimes held open for a long time. This prevented the OS from
      reclaiming the respective disk space and leaking one file descriptor per index
      compaction. This has been fixed.

      For both geo/spatial and general indexes, we now avoid creating unnecessary
      empty index files and now avoid keeping them open for very long periods, such as
      waiting until bucket deletion. This is a more minor fix which helps decrease the
      number of open file descriptors, which is important if you are wroking on an
      operating sytem with a small limit of max allowed file descriptors, such as
      Windows and Mac OS X.

      *Issues* : [MB-6860](http://www.couchbase.com/issues/browse/MB-6860)

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      had erroneously returned a 'node' key in the result set which is debug
      information. This is now fixed.

      Note also that querying a spatial view will always return `total_rows = 0` as
      part of the result set. This is information used for internal functioning of
      spatial views.

      *Issues* : [MB-6942](http://www.couchbase.com/issues/browse/MB-6942)

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      had experienced index file descriptor leaks. This is fixed.

      *Issues* : [MB-6860](http://www.couchbase.com/issues/browse/MB-6860)

 * **Cross Datacenter Replication (XDCR)**

    * Errors had occurred performing replication via XDCR due to improper handling of
      non- UTF-8 characters. We now handle errors due to non- UTF-8 characters and can
      continue replication via XDCR for JSON documents containing non- UTF-8.

      *Issues* : [MB-7092](http://www.couchbase.com/issues/browse/MB-7092)

    * XDCR checkpoint intervals have increased to 30 minutes from 5 minutes. This
      helps increase the chance that a checkpoint will successfully replicate and not
      fail; this also reduces the frequent overhead required to determine if a
      checkpoint completed.

      *Issues* : [MB-6939](http://www.couchbase.com/issues/browse/MB-6939)

    * XDCR had displayed error messages as if they were non-recoverable issues that
      required immediate attention. We now provide error messages with less dramatic
      color coding and label them as errors vs. urgent warnings.

      *Issues* : [MB-6934](http://www.couchbase.com/issues/browse/MB-6934)

 * **Performance**

    * Performance improvements have been made to reduce the time taken to rebalance
      when consistent query results are enabled for rebalances.

      *Issues* : [MB-7030](http://www.couchbase.com/issues/browse/MB-7030)

**Known Issues in 2.0.0 \#1941**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0i"></a>

## Release Notes for Couchbase Server 2.0.0 build #1870 Beta (1 November 2012)

This is build \#1870 of Couchbase Server 2.0. Couchbase Server is a NoSQL
document database for interactive web applications. It has a flexible data
model, is easily scalable, provides consistent high performance and is
"always-on," meaning it can serve application data 24 hours, 7 days a week. For
more information about Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

The major improvements made between Beta and build \#1870 include:

 * **General Changes in Rebalance Behavior**.

   During rebalance, Couchbase Server now has new internal logic that will wait for
   data to be persisted at a new node before the new node takes responsibility for
   serving the data. In situations where you want a very high level of durability,
   this can provide you more assurance that your data can be recovered after node
   failures.

 * **Querying Views during Rebalance**.

   If you perform queries during rebalance, this new feature will ensure that you
   receive the query results that you would expect from a node as if it is not
   being rebalanced. During node rebalance, you will get the same results you would
   get as if the data were on an original node and as if data were not being moved
   from one node to another. In other words, this new feature ensures you get query
   results from a new node during rebalance that are consistent with the query
   results you would have received from the node before rebalance started.

   With this new feature, you will get the same query results before rebalance,
   during rebalance and after rebalance. Without this new functionality querying a
   view during rebalance would have provided results inconsistent with the results
   from a source node. With this new functionality enabled, data that is being
   moved from one node to another node will be incrementally added to an index
   available at the new node so that you get query results that are consistent with
   your expectations.

 * **XDCR (Cross Data-Center Replication) Enhancements.**

   This includes the following features and enhancements:

    * Performance improvements. Performance for outbound replication from a source
      cluster to a destination has been improved. CPU utilization on destination
      clusters has been reduced for better performance.

    * Improved Error Handling and Logging. More information about documents and the
      size of documents awaiting replication now available.

    * UI Improvements for XDCR in the Couchbase Web Console.

   The Couchbase Web Admin Console has been expanded to show the number of
   documents waiting to be replicated via XDCR and the total size of all documents
   waiting for replication. Low-level errors and statistics have been moved to a
   Couchbase Web Console log file to avoid information overload and confusion.
   Messages that are more appropriately categorized as recoverable states have been
   labeled warnings, not errors.

 * Improve and enable data flush for entire cluster via individual data buckets.
   Ability to disable and enable the configuration setting for safe cluster
   administration. For more information, see [Editing Couchbase
   Buckets](#couchbase-admin-web-console-data-buckets-createedit-editcb).

 * Server logs have been split and have been provided logical naming. This makes it
   easier for you to spot or diagnose server issues. For more information, see
   [Logs and Logging](#couchbase-troubleshooting-logs).

**New Features and Behaviour Changes in 2.0.0 build \#1870**

 * There is also now a new REST-API in Couchbase Server 2.0 where you can enable or
   disable flush for each data bucket in a cluster. This also enables you to flush
   an individual bucket in a cluster or multiple buckets on a cluster with a single
   REST-API command. For more information, see [Flushing a
   Bucket](#couchbase-admin-restapi-flushing-bucket).

   *Issues* : [MB-6776](http://www.couchbase.com/issues/browse/MB-6776)

**Fixes in 2.0.0 build \#1870**

 * **Database Operations**

    * Now provide timestamp for when a TAP queue backfill starts. The TAP backfill
      queue is used to send a snapshot of a vbucket to another node.

      *Issues* : [MB-6753](http://www.couchbase.com/issues/browse/MB-6753)

    * Couchbase Server had created new checkpoints even in the case where empty,
      current checkpoints were available. The server provided extraneous notifications
      when various changes to checkpoints ID occurred due to constant polling by XDCR.
      Now when an empty checkpoint is available, the server uses this checkpoint for
      additional replication and provide this checkpoint ID to XDCR. The server also
      pushes a single notification to XDCR when a checkpoint is empty.

      *Issues* : [MB-6632](http://www.couchbase.com/issues/browse/MB-6632)

    * Couchbase Server kept requesting to mark a group of partitions as indexable when
      they were already marked as indexable, or when they are already correctly marked
      as unindexable. This triggered redundant effort by processes. It is now fixed.

      *Issues* : [MB-6804](http://www.couchbase.com/issues/browse/MB-6804)

    * During XDCR replication, an incorrect cache-miss-ratio had been displayed in Web
      Console, and had been returned in response to a `cbstats` command. We had
      erroneously incremented `ep_bg_fetched` for `GET_META` background fetches. As a
      fix, we now provide a separate stat for `GET_META` background fetches.

      *Issues* : [MB-6628](http://www.couchbase.com/issues/browse/MB-6628)

    * Get-and-touch returned incorrect error messages when an error occurs.
      Get-and-touch now returns `ENOENT` if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * This enables users to change the disk location of an index without destroying
      persisted data. You can now set index\_path and it will delete an existing index
      only and create a new disk location for use.

      *Issues* : [MB-6423](http://www.couchbase.com/issues/browse/MB-6423)

    * When you try to automatically failover a node, Couchbase Server will not perform
      the failover if there are not enough replica vBuckets in the cluster to support
      the failed node.

      *Issues* : [MB-6209](http://www.couchbase.com/issues/browse/MB-6209)

    * Querying a view during rebalance had resulted in several errors due to the way
      database storage files were managed and named. We now exclude opening databases
      that are meant to be excluded from indexing and we now synchronously open
      databases for indexing to resolve the problem.

      *Issues* : [MB-6612](http://www.couchbase.com/issues/browse/MB-6612)

    * Querying a view on a single node incorrectly returned `inconsistent_state` error
      if a bucket is empty. This is corrected.

      *Issues* : [MB-6736](http://www.couchbase.com/issues/browse/MB-6736)

    * Provide additional XDCR information on Logs tab of Couchbase Web Console.

      *Issues* : [MB-6888](http://www.couchbase.com/issues/browse/MB-6888)

    * We added missing checks to state transition requests. Also erroneous error
      messages had occurred while the server monitored partition in pending
      transition. This has been corrected.

      *Issues* : [MB-6490](http://www.couchbase.com/issues/browse/MB-6490)

    * The collect\_info logs was missing the mapreduce\_errors log file. Now this log
      also contains mapreduce\_errors.

      *Issues* : [MB-6859](http://www.couchbase.com/issues/browse/MB-6859)

    * Change the frequency that internal timeouts on Windows were occurring to be more
      efficient.

      *Issues* : [MB-6653](http://www.couchbase.com/issues/browse/MB-6653)

    * Node rebalance was failing when new nodes were added to the cluster. This
      occurred due to processes being triggered after defining partitions for
      indexing. The processes are now being triggered at the correct time.

      *Issues* : [MB-6706](http://www.couchbase.com/issues/browse/MB-6706)

    * Replication had exited with replicator\_died message after multiple attempts to
      update. Problem was caused by using old revision numbers for new database files.
      Now new database files use new revision numbers, resolving the problem.

      *Issues* : [MB-6711](http://www.couchbase.com/issues/browse/MB-6711)

    * Sporadic failures occurred while running a unit test for testing duplicate items
      on disk. Test now modified to use less items.

      *Issues* : [MB-6647](http://www.couchbase.com/issues/browse/MB-6647)

    * Keys stored in the access log were not correctly scheduled to load, due to a
      broken logic for detecting duplicate items. Now keys properly load during warmup
      from access log.

      *Issues* : [MB-6616](http://www.couchbase.com/issues/browse/MB-6616)

    * Couchbase Server had returned a HTTP 404 error when a node is rebalanced and a
      client tried to cache a list of nodes for a bucket. Now the server sends a HTTP
      302 redirect with the URL of an available node.

      *Issues* : [MB-6922](http://www.couchbase.com/issues/browse/MB-6922)

    * The thread responsible for persisting data in Couchbase Server had been crashing
      during vBucket state changes. This was caused by not handling file not found
      exceptions. The cause of the crashes has been fixed.

      *Issues* : [MB-6676](http://www.couchbase.com/issues/browse/MB-6676)

    * Check-and-set value was not returned in response to a successful delete request.
      Now it is returned as part of the response.

      *Issues* : [MB-6661](http://www.couchbase.com/issues/browse/MB-6661)

 * **Cluster Operations**

    * Server now releases returned document that is being marked deleted. This fixes a
      rebalance failure where memcached crashes on one of the nodes and rebalance
      exits with the error: `{mover_failed,{badmatch, known macro: {error,closed}}}`.

      *Issues* : [MB-6806](http://www.couchbase.com/issues/browse/MB-6806)

    * The Couchbase REST-API has changed to enable you to change the default maximum
      number of buckets used in a Couchbase cluster. The maximum allowed buckets in
      this request is 128, however the maximum suggested number of buckets is ten per
      cluster. This is a safety mechanism to ensure that a cluster does not have
      resource and CPU overuse due to too many buckets. The following illustrates the
      endpoint and parameters used:

       ```
       shell>    curl -X -u admin:password -d maxBucketCount=6 http://ip_address:8091/internalSettings
       ```

      For this request you need to provide administrative credentials for the cluster.
      The following HTTP request will be sent:

       ```
       About to connect() to 127.0.0.1 port 8091 (#0)
       Trying 127.0.0.1...
       connected
       Connected to 127.0.0.1 (127.0.0.1) port 8091 (#0)
       Server auth using Basic with user 'Administrator'
       POST /internalSettings HTTP/1.1
       ```

      If Couchbase Server successfully changes the bucket limit for the cluster, you
      will get a HTTP 200 response:

       ```
       HTTP/1.1 200 OK
       Server: Couchbase Server 2.0.0r_501_gb614829
       Pragma: no-cache
       Date: Wed, 31 Oct 2012 21:21:48 GMT
       Content-Type: application/json
       Content-Length: 2
       Cache-Control: no-cache
       ```

      If you provide an invalid number, such as 0, a negative number, or an amount
      over 128 buckets, you will get this error message:

       ```
       ["Unexpected server error, request logged."]
       ```

      For more information about setting buckets per cluster via REST-API, see
      [Setting Maximum Buckets for Clusters](#couchbase-admin-restapi-max-buckets).

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

    * Automatically prevent a user from creating more than the maximum number of
      supported buckets in a Couchbase cluster. The default maximum is six.

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

 * **Web Console**

    * Provide cleaner, simplified output on error messages from XDCR replication.

      *Issues* : [MB-6763](http://www.couchbase.com/issues/browse/MB-6763)

 * **Command-line Tools**

    * Incorrect message had been sent in response to a `cbstats vkey` command. Server
      had returned the string 'not found' for valid request. Now correct the memcached
      protocol error is returned. For more information about `cbstats`, see [cbstats
      Tool](#couchbase-admin-cmdline-cbstats).

      *Issues* : [MB-6751](http://www.couchbase.com/issues/browse/MB-6751)

    * Fixed stats vkey status for evicted keys. Stats vkey was returning
      `item_deleted` instead of valid for evicted keys. This change fixes that
      problem.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * `cbepctl` help options now show option for setting the expiry\_pager, a
      maintenance process for removing deleted items from disk.

      *Issues* : [MB-6764](http://www.couchbase.com/issues/browse/MB-6764)

 * **Indexing and Querying**

    * Remove an internal setting dialog used internally by Couchbase for testing
      consistent views.

      *Issues* : [MB-6713](http://www.couchbase.com/issues/browse/MB-6713)

    * On Window platform, errors occurred trying to update a design document. This is
      now fixed.

      *Issues* : [MB-6653](http://www.couchbase.com/issues/browse/MB-6653)

    * When consistent views were enabled and rebalance was being performed, the
      rebalance would fail. This was due to incorrect handling of empty partitions and
      by accidentally performing disk cleaning before updating partitions which would
      not be indexed. This is fixed.

      *Issues* : [MB-6612](http://www.couchbase.com/issues/browse/MB-6612)

 * **Cross Datacenter Replication (XDCR)**

    * In the past we had displayed several confusing error messages and warnings for
      XDCR. We had provided low level information in the Couchbase Web Console that is
      now provided to low files to avoid overwhelming users with information. We were
      also reporting errors that were actually more appropriately called warnings
      since they were recoverable issues. We have changed those errors to
      warning/advisories.

      *Issues* : [MB-6934](http://www.couchbase.com/issues/browse/MB-6934)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

    * Renamed "XDCR replication queue" in summary section to "XDCR docs to replicate"
      for clarity.

      *Issues* : [MB-6924](http://www.couchbase.com/issues/browse/MB-6924)

    * Replication via XDCR had experienced performance degradation when a data bucket
      contained a higher ratio of expired items. This has been fixed by ignoring the
      expiration time set for an item, `SET_WITH_META`.

      *Issues* : [MB-6662](http://www.couchbase.com/issues/browse/MB-6662)

    * We have added 3 new outbound operation stats, namely, 1) data replicated, which
      is amount of data XDCR have replicated to the remote data center through inter-
      cluster network; 2) active vb replications, which shows the number of ongoing
      active replications to the remote clusters; 3) waiting vb replications, which is
      the number of vb replications in the waiting pool to wait for turn to start
      replication. These stats will be useful for performance monitoring and
      diagnosis.

      *Issues* : [MB-6919](http://www.couchbase.com/issues/browse/MB-6919)

    * Couchbase Server was dropping connections from client libraries too quickly when
      a node in a cluster was being rebalanced. Now there will be more delay until a
      connection is dropped.

      *Issues* : [MB-5406](http://www.couchbase.com/issues/browse/MB-5406)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

 * **Performance**

    * Increase maximum number of retries to open the database file.

      *Issues* : [MB-6844](http://www.couchbase.com/issues/browse/MB-6844)

    * Prioritize flushing pending vbuckets over regular vbuckets. This is a
      performance improvement used for rebalancing buckets that have no views or
      design docs when consistent view mode is enabled.

      *Issues* : [MB-6796](http://www.couchbase.com/issues/browse/MB-6796)

    * Couchbase Server had experienced a one second delay to mark empty and closed
      checkpoints on a persistence queue. Performance improvements made to eliminate
      delay.

      *Issues* : [MB-6714](http://www.couchbase.com/issues/browse/MB-6714)

**Known Issues in 2.0.0 build \#1870**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0h"></a>

## Release Notes for Couchbase Server 2.0.0 Beta (18 September 2012)

This is the Beta release of Couchbase Server 2.0. Couchbase Server 2.0 is the
next major version of Couchbase Server. The 2.0 version adds support for
distributed indexing and query, real-time map/reduce functions and cross-data
center replication. Couchbase Server 2.0 builds on the high performance Simple,
Fast, and Elastic Couchbase Server 1.8. The beta release is available to all
enterprise- and community-edition customers. For more information about
Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

**New Features and Behaviour Changes in 2.0.0**

 * Two sample databases can be loaded either during setup or in the setting panel.

 * Advanced indexing configuration can be updated in the Couchbase Admin console
   including maximum number of index building tasks that are executed in parallel.

 * Design documents for active data are automatically indexed when a threshold on
   time is met or a number of document mutations is reached. This is user
   configurable.

   For more information, see [Automated Index
   Updates](#couchbase-views-operation-autoupdate).

 * New statistics have been added to understand the cross data center replication
   streams. The source cluster will show information about each XDCR including
   document mutation to be replicated.

   For more information, see [Viewing Bucket and Cluster
   Statistics](#couchbase-admin-web-console-monitoring).

 * Backup and Restore support is now available.

   For more information, see [Backup and Restore](#couchbase-backup-restore).

 * Debug information has been added into the view and indexing operations to make
   debugging views easier. You can enable this by using `debug=true` as query
   parameter.

 * E-mail alerts can now be created when certain error situations are encountered
   in a cluster.

   For more information, see [Enabling
   Alerts](#couchbase-admin-web-console-settings-alerts).

 * You can now manually compact data and design documents using the admin console.

   For more information, see [Using the Views Editor](#couchbase-views-editor).

**Fixes in 2.0.0**

 * **Database Operations**

    * Provide return value of 'not found' in response to get operations on document
      that does not exist.

    * Enable sending compression option as parameter for a document to Couchbase
      Server.

      *Issues* : [MB-6482](http://www.couchbase.com/issues/browse/MB-6482)

 * **Cluster Operations**

    * Fixed incorrect message, 'There are currently no documents in this bucket.' to
      'there are currently no documents in this bucket corresponding to the search
      criteria.'

      *Issues* : [MB-6442](http://www.couchbase.com/issues/browse/MB-6442)

    * Fixed rebalance failure. Rebalanced had stalled after performing failover and
      removing node due to memory leak on cluster nodes.

      *Issues* : [MB-6550](http://www.couchbase.com/issues/browse/MB-6550)

 * **Web Console**

    * Fix Couchbase Admin Console layout when a design document or view has a long
      name.

      *Issues* : [MB-5465](http://www.couchbase.com/issues/browse/MB-5465)

    * Corrected intermittent failures occurred when loading sample data via setup
      wizard or the Settings tab on MAC when user starts couchbase server app for the
      first time. Occurred due to some permission issues.

      *Issues* : [MB-6452](http://www.couchbase.com/issues/browse/MB-6452)

    * Corrected wrong build number displayed in Mac OS X builds in dialog box.

      *Issues* : [MB-6668](http://www.couchbase.com/issues/browse/MB-6668)

    * Fix Couchbase Admin Console behavior when failover is in progress and node goes
      offline.

      *Issues* : [MB-4756](http://www.couchbase.com/issues/browse/MB-4756)

 * **Command-line Tools**

    * Restore connection to hostname instead of IP address.

      *Issues* : [MB-6470](http://www.couchbase.com/issues/browse/MB-6470)

 * **Indexing and Querying**

    * Compaction file for views had been deleted if the process for index compaction
      died.

    * Deleting design documents in development resulted in deleting production index
      files.

      *Issues* : [MB-6517](http://www.couchbase.com/issues/browse/MB-6517)

 * **Cross Datacenter Replication (XDCR)**

    * Fix rebalance timeout failure during unidirectional replication of items via
      XDCR. Failure had returned message: "timeout,
      ns\_memcached-bucket','ns\_1@10.1.3.238'}, {get\_vbucket,".

      *Issues* : [MB-6493](http://www.couchbase.com/issues/browse/MB-6493)

    * Provide REST API endpoint for cancelling replication request.

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

**Known Issues in 2.0.0**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * An upgrade path is not supported to the beta release from prior developer
      preview builds. You need to uninstall your developer preview release and install
      the new release.

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Database Operations**

    * In rare cases codes used to test for data corruption (CRC, checksum) codes do
      not match when reading data from couch file.

      *Issues* : [MB-6538](http://www.couchbase.com/issues/browse/MB-6538)

    * Bucket deletion fails to delete on-disk data and indexes during indexing and
      data compaction.

      *Issues* : [MB-6382](http://www.couchbase.com/issues/browse/MB-6382)

 * **Cluster Operations**

    * Rebalance fails with error "bulk\_set\_vbucket\_state\_failed" due to timeout in
      tap\_replication\_manager for default bucket.

      *Issues* : [MB-6595](http://www.couchbase.com/issues/browse/MB-6595)

    * One of the internal maintenance processes within Couchbase Server for checking
      vBuckets will stop node rebalance when you create replication via XDCR on a
      source cluster.

      A node in a cluster may also stop rebalance when another node orchestrating
      rebalances is over loaded. When a node stops rebalance, it results in the error
      message "Resetting rebalance status since it is not really running".

      Rebalance cna also fail due to the timeout in `bulk_set_vbucket_state` operation
      with continuous view queries.

      *Issues* : [MB-6481](http://www.couchbase.com/issues/browse/MB-6481),
      [MB-6573](http://www.couchbase.com/issues/browse/MB-6573),
      [MB-7212](http://www.couchbase.com/issues/browse/MB-7212)

    * Microsoft Windows 7: when you create a bucket immediately after another bucket
      is deleted, Couchbase Server may timeout.

      *Issues* : [MB-6664](http://www.couchbase.com/issues/browse/MB-6664)

    * `memcached` hangs when aborting during swap rebalance operation and fails to
      restart ( exit 71 ).

      *Issues* : [MB-6592](http://www.couchbase.com/issues/browse/MB-6592)

 * **Web Console**

    * The Couchbase Admin console needs to handle a very slow docloader.
      Alternatively, docloader may be too slow.

      *Issues* : [MB-5938](http://www.couchbase.com/issues/browse/MB-5938)

    * `Preview Random Document` in the View tab does not show the actual values for
      document revision, expiration, flags.

      *Issues* : [MB-6620](http://www.couchbase.com/issues/browse/MB-6620)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Indexing and Querying**

    * Development indexes will remain on disk after bucket deletion.

      *Issues* : [MB-6366](http://www.couchbase.com/issues/browse/MB-6366)

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

    * If a cluster is being rebalanced, and a node does not yet have any active
      vBuckets, you will receive the error `"error":"no_active_vbuckets"` when you
      query a view via the REST API.

      *Issues* : [MB-6633](http://www.couchbase.com/issues/browse/MB-6633)

    * Indexing 11 design documents at once will significantly reduce Couchbase Server
      response times.

      *Issues* : [MB-6392](http://www.couchbase.com/issues/browse/MB-6392)

 * **Cross Datacenter Replication (XDCR)**

    * `beam.smp` memory usage grows to 2 GB when XDCR feature is enabled and
      rebalancing is in progress.

      *Issues* : [MB-6649](http://www.couchbase.com/issues/browse/MB-6649)

    * Very inconsistent statistics may occur with bi-directional XDCR when running
      with a moderate/low load.

      *Issues* : [MB-6598](http://www.couchbase.com/issues/browse/MB-6598)

    * Replication rat e may drop when the XDCR replication queue size becomes less
      than 500 items.

      *Issues* : [MB-6586](http://www.couchbase.com/issues/browse/MB-6586)

    * You may experience very slow replication rates (less than 100 items on average
      per second) with 2 unidirectional replications between 2 clusters.

      *Issues* : [MB-6643](http://www.couchbase.com/issues/browse/MB-6643)

 * **Performance**

    * Mac OS X startup time for restart is quite long considering the number of items.

      *Issues* : [MB-6613](http://www.couchbase.com/issues/browse/MB-6613)

    * `ep-engine` needs 1.5 minutes to create 1024 vbuckets. This may be too slow,
      however performance improves with setting barrier=0.

      *Issues* : [MB-6232](http://www.couchbase.com/issues/browse/MB-6232)

<a id="couchbase-server-rn_2-0-0g"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1672 Developer Preview (10 September 2012)

**New Features and Behaviour Changes in 2.0.0 Build \#1672**

 * New statistics have been added to understand the cross data center replication
   streams. The source cluster will show information about each XDCR including
   document mutation to be replicated.

   For more information, see [Viewing Bucket and Cluster
   Statistics](#couchbase-admin-web-console-monitoring).

**Fixes in 2.0.0 Build \#1672**

 * **Database Operations**

    * Use the mutation log compactor sleep time from the configuration

    * Check each vbucket's bg queue to set the task sleep time

      *Issues* : [MB-6215](http://www.couchbase.com/issues/browse/MB-6215)

    * Only one access scanner should be scheduled at any time

      *Issues* : [MB-6211](http://www.couchbase.com/issues/browse/MB-6211)

    * Refactor add\_with\_meta test function

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Update access scanner run counter when it is completed.

      *Issues* : [MB-6194](http://www.couchbase.com/issues/browse/MB-6194)

    * Requeue failed bgfetch requests for retry

      *Issues* : [MB-6222](http://www.couchbase.com/issues/browse/MB-6222)

    * Disable access scanner scheduling at a specific time

      *Issues* : [MB-6057](http://www.couchbase.com/issues/browse/MB-6057)

    * Reset checkpoint cursors after receiving backfill streams

      *Issues* : [MB-6084](http://www.couchbase.com/issues/browse/MB-6084)

    * Remove the mutation log if exists at the end of each test runs

    * expose TAP\_FLAG\_TAP\_FIX\_FLAG\_BYTEORDER to python

      *Issues* : [MB-6176](http://www.couchbase.com/issues/browse/MB-6176)

    * return TMPFAIL for failed bgfetch instead of assert

      *Issues* : [MB-6323](http://www.couchbase.com/issues/browse/MB-6323)

 * **Cluster Operations**

    * Fixed iterate\_ddocs return values

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Replication stats on UI

      *Issues* : [MB-5943](http://www.couchbase.com/issues/browse/MB-5943)

    * Faster xdcr startup by using cached remote cluster info

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Add logs to time replication stop

      *Issues* : [MB-6041](http://www.couchbase.com/issues/browse/MB-6041)

    * Send out email alerts asynchronously.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Don't send web alerts emails when they are disabled.

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Added cancel bucket compaction button

      *Issues* : [CBD-181](http://www.couchbase.com/issues/browse/CBD-181)

    * Periodically update replica indexes.

      *Issues* : [MB-6269](http://www.couchbase.com/issues/browse/MB-6269)

    * Restart view compaction when getting shutdown errors.

      *Issues* : [MB-6342](http://www.couchbase.com/issues/browse/MB-6342)

    * Expose xdcr replications via tasks API

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

    * Maintain and collect XDCR vb stats

      *Issues* : [MB-5943](http://www.couchbase.com/issues/browse/MB-5943)

    * Added false/true options for reduce

      *Issues* : [MB-6149](http://www.couchbase.com/issues/browse/MB-6149)

    * REST API to alter set view update daemon parameters

      *Issues* : [CBD-423](http://www.couchbase.com/issues/browse/CBD-423)

    * REST API to update per ddoc updateMinChanges.

      *Issues* : [CBD-423](http://www.couchbase.com/issues/browse/CBD-423)

    * Don't shutdown bucket unless we're deleting it

      *Issues* : [MB-6384](http://www.couchbase.com/issues/browse/MB-6384)

    * Use optimized math for cache miss rate

      *Issues* : [MB-6403](http://www.couchbase.com/issues/browse/MB-6403)

    * Add compaction\_daemon settings to config on upgrade.

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * More efficient index state computation

      *Issues* : [CBD-546](http://www.couchbase.com/issues/browse/CBD-546)

    * Allow sending web alerts via email.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Sort ddocs by id on ddocs endpoint

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Inform user whether swap rebalance happens

      *Issues* : [MB-6162](http://www.couchbase.com/issues/browse/MB-6162)

    * Move email helpers from ns\_mail\_log to ns\_mail.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Enabled emails for all alerts by default

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Implemented replication cancellation endpoint

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

    * Fixed saving map/reduce functions into wrong views

      *Issues* : [MB-6167](http://www.couchbase.com/issues/browse/MB-6167)

    * Bump up default MAX\_CONCURRENT\_REPS\_PER\_DOC to 32

      *Issues* : [CBD-399](http://www.couchbase.com/issues/browse/CBD-399)

    * Started new REST api docs

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

 * **Indexing and Querying**

    * Fix too high memory consumption during indexing

      *Issues* : [MB-6096](http://www.couchbase.com/issues/browse/MB-6096)

    * Ignore index pausing of already paused partitions

      *Issues* : [MB-6165](http://www.couchbase.com/issues/browse/MB-6165)

    * More explicit error message when keys are too long

      *Issues* : [MB-6295](http://www.couchbase.com/issues/browse/MB-6295)

    * Delete index files on terminate after ddoc updated

      *Issues* : [MB-6415](http://www.couchbase.com/issues/browse/MB-6415)

    * Delete compaction file if index compactor dies

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Delete index files on view group terminate

      *Issues* : [MB-6415](http://www.couchbase.com/issues/browse/MB-6415)

**Known Issues in 2.0.0 Build \#1672**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0f"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1554 Developer Preview (10 August 2012)

Couchbase Server 2.0.0 build 1530 contains important document behavior changes
that may impact your existing applications. Specifically, this and future
releases include changes the way document metadata is handled and exposed when
working with Views and creating map and reduce functions in Couchbase Server.

In previous releases, the document supplied as the only argument to the `map()`
function included special fields with an additional prefix that provided
information such as the data type, flags, expiration and document ID. For
example:


```
{
 "_id" : "contact_475",
 "_rev" : "1-AB9087AD0977F089",
 "_bin" : "...",
 "$flags" : 0,
 "$expiration" : 0,
 "name" : "Fred Bloggs",
}
```

This representation has been changed so that the submitted document data and
structure remain identical to the document stored and returned by the Views
system.

The metadata is now supplied as a object and second argument to the `map()`
function. The format of this object is a JSON document with fields for each of
the metadata items previously incorporated in the main document. For example:


```
{
 "id" : "contact_475",
 "rev" : "1-AB9087AD0977F089",
 "flags" : 0,
 "expiration" : 0,
 "type" : "json",
}
```

The main flags and their contents remain the same. The `_bin`, `$att_reason`
have been replaced with a single field, `type`, that indicates the document data
type. For documents identified as valid JSON, the field will have the value
`json`. For non-JSON, the value will be `base64`.

The meta information for sample documents is now displayed separately, within a
non-editable portion of the Web Console.

In addition to these changes, the format and information supplied to the `map()`
function has changed.

To access only the document data within your View, you can use the following
`map()` :


```
function(doc) {
}
```

To access the document data and document metadata, including document ID and
expiration time, use the two-argument format of the function:


```
function(doc,meta) {
}
```

For example, to emit only document information from the View based on the
following document structure:


```
{
 "name": "John",
 "e-mail": "john@john.com"
}
```

Create a view using only the document object:


```
function (doc) {
 emit(doc.name,null);
}
```

To create a view that explicitly emits the document ID:


```
function (doc,meta) {
 emit(meta.id,doc.name);
}
```

In addition, the `doc` argument now contains a base64 representation of the
document data if the document is not JSON. This can identified using the `type`
field of the `meta` object. The default `map()` provided within the
Administration Web Console is now:


```
function (doc, meta) {
 if (meta.type == "json") {
 // If the document is JSON, sort by the schema
 var keys = Object.keys(doc);
 emit(["json", keys.length], keys);
 } else {
 emit(["blob"]);
 }
}
```

This provides an example of how to process and output documents that are valid
JSON or binary documents, using the `meta` argument to identify the document
data type.

Existing client libraries continue to work with the new release without
modification to the View or document update mechanisms and information.

**New Features and Behaviour Changes in 2.0.0 Build \#1554**

 * Behavior Change: Identifying the content type of the document can no longer be
   achieved by using the `doc._bin` field of the document object. Instead, you
   should use the `meta.type` field. This will be set to `json` for documents
   identified as valid JSON documents. For documents that cannot be identified as
   valid JSON, the field will be set to `base64`.

   For more information, see [Document
   Metadata](#couchbase-views-datastore-fields).

 * Behavior Change: Document metadata is no longer included as fields within the
   document supplied to the `map()` function as an argument within a view. Instead,
   the function is now supplied two arguments, the document data, and a second
   argument, `meta`, that contains the expiration, flags and an indication of the
   document data type.

   For more information, see [Document
   Metadata](#couchbase-views-datastore-fields).

 * Behavior Change: The document ID for a given document is no longer available
   within the document object supplied to the `map()`. Instead of using `doc._id`
   you should now use the `id` field of the `meta` object, `meta.id`. The
   two-argument form of the `map()` must be used for this purpose.

   For more information, see [Map Functions](#couchbase-views-writing-map).

 * Behavior Change: Because document metadata is now exposed within a separate
   structure, the Admin Console displays the sample document metadata separately
   from the main document content.

   For more information, see [Using the Views Editor](#couchbase-views-editor).

 * Behavior Change: When deleting a design document, the `_rev` parameter is no
   longer required to confirm the deletion.

   For more information, see [Design Document REST
   API](#couchbase-views-designdoc-api).

 * Behavior Change: The `map()` is now supplied two arguments, `doc`, which
   contains the document data, and `meta`, which contains the document metadata.

   For more information, see [Map Functions](#couchbase-views-writing-map).

**Known Issues in 2.0.0 Build \#1554**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0e"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1495 Developer Preview (26 July 2012)

Couchbase Server 2.0.0 build 1495 introduces important changes with respect to
accesing views from buckets that have been secure with SASL authentication.

To access a view from a bucket with SASL authentication through the REST API you
must supply the bucket name and password as the username and password to the URL
of the HTTP request. For example:


```
GET http://bucketname:bucketpass@localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Failure to provide the authentication information on a secure bucket will result
in an HTTP error response (401).

For more information, see [Querying Using the REST
API](#couchbase-views-querying-rest-api).

The same rules also apply to creating and reading design documents using the
REST API.

For more information, see [Design Document REST
API](#couchbase-views-designdoc-api).

**Known Issues in 2.0.0 Build \#1495**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0d"></a>

## Release Notes for Couchbase Server 2.0.0DP4 Developer Preview (21 March 2012)

Couchbase Server 2.0.0 Developer Preview 4 contains a number of new features and
functionality.

**What's new in this release**

 * **Replica Indexes**

   The indexes generated by the map/reduce view interface are replicated across the
   cluster. This ensures that if there is a failover scenario, the index
   information does not have to be regenerated by the replacement node.

 * **Experimental Geospatial Indexing**

   Support has been added for supporting geospatial indexing and querying. The
   geospatial interface enables the storage of two-dimensional geometry points.
   Views can then be written that index this information, and queries can be
   written that return the geospatial information based on the provision of a
   bounding-box to the geometry data.

   For more information, see [Writing Geospatial
   Views](#couchbase-views-writing-geo).

 * **Sample Databases**

   Couchbase Server now includes sample databases as part of the installation and
   setup process. You can load the sample data and associated views. This provides
   both the sample data structures and map/reduce queries to enable youf to
   understand and create your own datasets and views.

   For more information, see [Couchbase Sample Buckets](#couchbase-sampledata).

**New Features and Behaviour Changes in 2.0.0DP4**

 * The index/view related improvements are for production views or development
   views with `full_set=true`.

 * The indexes created by the view system are now replicated among nodes to ensure
   that indexes do not need to be rebuilt in the event of a failover.

 * A new option, `on_error` has been added to control the behaviour of the view
   engine when returning a request. By default the value is `continue`, which
   indicates that the view engine should continue to return results in the event of
   an error. You can also set the option to `stop` to stop the view results being
   returned on failure.

   For more information, see [Error
   Control](#couchbase-views-writing-querying-errorcontrol).

   *Tags* : views

 * The view system has been stabilised to work even while the cluster topology is
   changing through rebalance and failover operations.

 * The design document and view system has been updated with the ability to create
   multiple design docs and query all these design docs in parallel.

 * Experimental support for geospatial indexing has been added.

   For more information, see [Writing Geospatial
   Views](#couchbase-views-writing-geo).

   *Tags* : experimental, geospatial

 * You now have the option to have sample data (and views) created during the
   installation and setup process. This operation requires Python 2.6.

   For more information, see [Couchbase Sample Buckets](#couchbase-sampledata).

 * A number of stability bugs have been fixed when querying and merging views.

 * The default value of the `stale` argument when querying views has been changed
   to `update_after`. This means that by default view information will always be
   returned 'stale', and updated after the view request has completed.

   You can force a view update by specifying `false` to the `stale`, or `ok` to
   enable stale views without an implied update after the view data has been
   returned.

   For more information, see [Querying Views](#couchbase-views-writing-querying).

   *Tags* : views

 * Support for changing (and accessing) the number of parallel indexing processes
   used to build the view index information has been added to the Couchbase
   Management REST API.

   For more information, see [Setting Maximum Parallel
   Indexers](#couchbase-admin-restapi-settings-maxparallelindexers).

   *Tags* : restapi, views

**Fixes in 2.0.0DP4**

 * **Cluster Operations**

    * Rebalancing in a new Couchbase Server 1.8 node if there are less than 500,000
      items results in an imbalanced cluster.

      *Issues* : [MB-4595](http://www.couchbase.com/issues/browse/MB-4595)

    * When upgrading from Couchbase Server 1.8.0 to 1.8.1 or Couchbase Server 1.8.0 to
      2.0, an offline upgrade may fail with a rebalance failure reporting the error
      `{wait_for_memcached_failed,"bucket-1"}`.

      *Issues* : [MB-5532](http://www.couchbase.com/issues/browse/MB-5532)

 * **Unclassified**

    * The web console UI had an incorrect query parameter, `start_key_docid` available
      for selection. This should have been `start_key_doc_id`.

      *Issues* : [MB-4781](http://www.couchbase.com/issues/browse/MB-4781)

    * When deleting a bucket, and then creating a new bucket with the same name, the
      views associated with the deleted bucket would reappear.

      *Issues* : [MB-4562](http://www.couchbase.com/issues/browse/MB-4562)

    * The `ep-engine` component did not persist the mutated replica items to disk.

      *Issues* : [MB-4629](http://www.couchbase.com/issues/browse/MB-4629)

    * The number of threads started when building indexes could increase to an
      unmanageable level causing a significant performance problem. The indexing
      system has been configured so that the main indexers get 4 exclusive slots, and
      the replica index builders 2 exclusive slots to ensure that the indexing process
      proceeds effectively.

      *Issues* : [MB-4848](http://www.couchbase.com/issues/browse/MB-4848)

    * Accessing a view query would fail if the user changes a design document while a
      rebalance was occurring, and then accesses the updated view.

      *Issues* : [MB-4626](http://www.couchbase.com/issues/browse/MB-4626)

    * Accessing a view using a reduce could report different counts from different
      nodes after a cluster has been rebalanced with the addition of new nodes.

      *Issues* : [MB-4500](http://www.couchbase.com/issues/browse/MB-4500)

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * The `ns_server` process could crash on Linux because of too many open file
      descriptors if more than 10 views were defined on a single bucket.

      *Issues* : [MB-4514](http://www.couchbase.com/issues/browse/MB-4514)

    * Creating a view with a `reduce` function, and querying while changing the
      cluster topology through a rebalance could cause incorrect results.

      *Issues* : [MB-4692](http://www.couchbase.com/issues/browse/MB-4692)

    * Accessing the `timings` statistics through the `cbstats` command would fail.

      *Issues* : [MB-4718](http://www.couchbase.com/issues/browse/MB-4718)

    * The compaction process on a node can be terminated while data is still being
      loaded, but fail to restarted again while the node is still under load.

      *Issues* : [MB-4732](http://www.couchbase.com/issues/browse/MB-4732),
      [MB-4774](http://www.couchbase.com/issues/browse/MB-4774)

    * If you remove and rebalance a node out of a running cluster while clients are
      awaiting view results from that node, the node would fail to be rebalanced
      properly.

      *Issues* : [MB-4752](http://www.couchbase.com/issues/browse/MB-4752)

    * An incorrect total cluster storage figure could be reported if the `index_path`
      and `data_path` configurations are on the same disk.

      *Issues* : [MB-4512](http://www.couchbase.com/issues/browse/MB-4512)

    * When accessing information using the basic create, read, update or delete
      operations, the `$flags` and `$expiration` flags are returned through the HTTP
      API for individual documents. This matches the output available through the view
      API when including the entire document.

      *Issues* : [MB-4549](http://www.couchbase.com/issues/browse/MB-4549)

**Known Issues in 2.0.0DP4**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

 * **Unclassified**

    * The `default` bucket may be shutdown unexpectedly when accessing multiple views
      using the test script environment.

      *Issues* : [MB-4940](http://www.couchbase.com/issues/browse/MB-4940) ; *Tags* :
      windows

    * Because of the way information is stored within the cluster, persisted to disk,
      and views are updated, it is possible to store a value into the cluster and be
      unable to immediately retrieve that value through a corresponding view.

      *Tags* : views

      For more information, see [Document Storage and Indexing
      Sequence](#couchbase-views-datastore-indexseq).

    * A rebalance on Windows may fail when adding a new node to the cluster with the
      error `{wait_for_memcached_failed,"bucket-9"}` on a cluster configured with 10
      buckets.

      *Issues* : [MB-4849](http://www.couchbase.com/issues/browse/MB-4849) ; *Tags* :
      windows

    * Couchbase Server can fail when adding a failed over node back into a cluster
      during a rebalance operation with the error:

       ```
       Core was generated by `/opt/couchbase/bin/memcached -X /opt/couchbase/lib/memcached/stdin_term_handler'.
       Program terminated with signal 11, Segmentation fault.
       #0 LoadStorageKVPairCallback::callback (this=0xb9dd8c0, val=...) at stored-value.hh:168
       in stored-value.hh
       ```

      *Workaround* : Reinstall Couchbase Server on the node that failed before adding
      the node back and performing the rebalance.

      *Issues* : [MB-4959](http://www.couchbase.com/issues/browse/MB-4959)

    * Rebalance may fail because `memcached` is closing the connection during the
      authentication request.

      *Issues* : [MB-4824](http://www.couchbase.com/issues/browse/MB-4824)

    * A rebalance when removing a single node from an existing cluster can fail on
      Windows with the error `wait_for_memcached_failed,"default"`.

      *Issues* : [MB-4890](http://www.couchbase.com/issues/browse/MB-4890) ; *Tags* :
      windows

    * View queries return "inconsistent state" error if user calls the `flush`
      operation.

      *Issues* : [MB-4717](http://www.couchbase.com/issues/browse/MB-4717),

    * The disk write queue can become high and very slow to drain if user is running
      view queries on a large number of design docs simultaneously, with compaction
      and index still in progress.

      *Issues* : [MB-4846](http://www.couchbase.com/issues/browse/MB-4846)

    * Couchbase Server may fail to restart properly after having been shutdown.

      *Issues* : [MB-4933](http://www.couchbase.com/issues/browse/MB-4933) ; *Tags* :
      windows

    * Querying views when new nodes are added and not rebalanced into the cluster,
      with another node failed over generate an error:

       ```
       {
        "error":"error",
        "reason":"A view spec can not consist of merges exclusively."
       }
       ```

      *Issues* : [MB-4804](http://www.couchbase.com/issues/browse/MB-4804)

    * The Couchbase sample bucket loader scripts require Python 2.6 as the default
      version of Python installed. If Python is installed, but the default is not
      Python 2.6 the sample bucket loader script will fail.

      *Workaround* : You can install Python 2.6 and then create a link between
      `/usr/bin/python` to point to the installed `/usr/bin/python2.6`.

      *Issues* : [MB-4724](http://www.couchbase.com/issues/browse/MB-4724)

    * Disk usage can grow because compaction does not run until the indexing process
      has finished. In a system with a high number of design docs, the indexing takes
      too long.

      *Issues* : [MB-4849](http://www.couchbase.com/issues/browse/MB-4849)

<a id="couchbase-server-rn_2-0-0c"></a>

## Release Notes for Couchbase Server 2.0.0DP3 Developer Preview (13 December 2011)

This is the 3rd 'developer preview' edition of Couchbase Server 2.0.

**New Features and Behaviour Changes in 2.0.0DP3**

 * Status bars have been added to show view building and rebalance progress.

 * The admin Web Console includes a document viewing and editing interface.

   For more information, see [Using the Document
   Editor](#couchbase-admin-web-console-documents).

 * The Couch API REST port has been changed from 5984 to 8092. Applications using
   5984 for view creation and basic create, read, update, and delete operations
   need to be updated to use the updated port.

   *Tags* : important, incompatible, network

 * Major performance and stability improvements when merging views across multiple
   nodes.

 * Major performance improvements when writing and persisting data to disk from
   memory.

**Fixes in 2.0.0DP3**

 * **Unclassified**

    * Couchbase Server would fail to start on Windows Server 2008 64-bit platform.

      *Issues* : [MB-4380](http://www.couchbase.com/issues/browse/MB-4380) ; *Tags* :
      installer, windows

    * During the warm-up process when the server is first starting and loading items,
      `ep-engine` could fail with an assertion error.

      *Issues* : [MB-4513](http://www.couchbase.com/issues/browse/MB-4513)

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * `memcached` could crash while rebalancing a large number of nodes with a very
      high number of items.

      *Issues* : [MB-4394](http://www.couchbase.com/issues/browse/MB-4394)

    * When running the view tests on Windows, Couchbase Server could hang and fail to
      return any values.

      *Issues* : [MB-4515](http://www.couchbase.com/issues/browse/MB-4515)

    * The resident ratio of items could report a negative number of items.

      *Issues* : [MB-4340](http://www.couchbase.com/issues/browse/MB-4340)

    * The JSON encoding system within the view indexing module could over escape
      double quotes within embedded values.

      *Issues* : [MB-4511](http://www.couchbase.com/issues/browse/MB-4511)

**Known Issues in 2.0.0DP3**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

 * **Unclassified**

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * View queries return "inconsistent state" error after a failover and rebalance
      operation.

      *Issues* :

    * Rebalancing can cause `memcached` to fail with error status 255.

      *Issues* :

    * Query results from views may be incorrect when the topology of the cluster
      changes.

    * It is not possible up create a bucket with uppercase letters in the bucket name.

      *Issues* : [MB-4265](http://www.couchbase.com/issues/browse/MB-4265)

    * Accessing a view using a reduce could report different counts from different
      nodes after a cluster has been rebalanced with the addition of new nodes.

      *Issues* : [MB-4500](http://www.couchbase.com/issues/browse/MB-4500)

<a id="couchbase-server-rn_2-0-0b"></a>

## Release Notes for Couchbase Server 2.0.0DP2 Developer Preview (23 August 2011)

This is the 2nd 'developer preview' edition of Couchbase Server 2.0.

**Known Issues in 2.0.0DP2**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and Restore](#couchbase-backup-restore),
      [Uninstalling Couchbase Server](#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0a"></a>

## Release Notes for Couchbase Server 2.0.0DP Developer Preview (29 July 2011)

This is the 1st 'developer preview' edition of Couchbase Server 2.0.

<a id="couchbase-server-limits"></a>
