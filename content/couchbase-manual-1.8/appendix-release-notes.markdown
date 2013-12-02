# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Server. To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

<a id="couchbase-server-rn_1-8-1"></a>

## Release Notes for Couchbase Server 1.8.1 GA (03 July 2012)

Couchbase Server 1.8.1 contains a number of stability, memory reporting, and
rebalancing fixes and improvements, including:

 * Rebalancing has been updated to support an optimized rebalancing operation when
   swapping in and out the same number of nodes. This significantly improves the
   rebalance operation allowing you to swap nodes in and out for maintenance
   (memory fragmentation, disk fragmentation), upgrades and other operations.
   Therefore reducing the impact on the entire cluster performance during the
   rebalance operation.

   For more information, see [Swap
   Rebalance](#couchbase-admin-tasks-addremove-rebalance-swap).

 * Rebalancing stability has been improved, particularly in the event of an error
   or a problem during the rebalance operation. Specific improvements target large
   clusters.

 * Management of the memory allocated and used by different components within the
   system has been improved. This increases stability of the system as a whole and
   ensures that the memory information reported within the statistics is more
   accurate, allowing you to make better decisions.

 * Improved statistic information, including memory and disk fragmentation and
   memory usage.

 * Improved logging provides more information about what operations are taking
   place, and what errors and problems are being reported by the system.

**New Features and Behavior Changes in 1.8.1**

 * A new port (11209) has been enabled for communication between cluster nodes. You
   must ensure that this port has been opened through firewall and network
   configuration to ensure that cluster operation can take place.

   Couchbase Server uses a new port for communication between cluster nodes. Port
   11209 is used by the `ns_server` component for internode communication.

   *Issues* : [MB-5651](http://www.couchbase.com/issues/browse/MB-5651)

 * Histogram timings are now provided for `get_stats` requests.

 * When a node leaves a cluster (due to failover or removal), the database files
   would automatically be deleted. This behavior has now been changed so that the
   database files are not deleted when the node leaves the cluster.

   Files are deleted when the node is added back to the cluster a rebalance
   operation is performed.

   *Issues* : [MB-4564](http://www.couchbase.com/issues/browse/MB-4564)

 * If the underlying database layer reported an error, the database would not be
   reopened. Database errors are now identified and re-opened on failure.

   *Issues* : [MB-5401](http://www.couchbase.com/issues/browse/MB-5401)

 * The `mem_user`, `high_watermark` and `low_watermark` have been added to the
   Couchbase Server Administration Web Console.

   For more information, see [Bucket Monitoring — Summary
   Statistics](#couchbase-admin-web-console-data-buckets-summary).

   *Issues* : [MB-4960](http://www.couchbase.com/issues/browse/MB-4960)

 * The `flush_all` operation has been disabled by default to prevent accidental
   flush operations affecting the data stored in a bucket. You can enable
   `flush_all` by setting the parameter using the `cbflushctl` command:

    ```
    shell> /opt/couchbase/bin/cbflushctl localhost:11210 set flushall_enabled true
    setting flush param: flushall_enabled true
    ```

   Behavior Change: The `flush_all` operation is no longer supported by default.

   *Issues* : [MB-5025](http://www.couchbase.com/issues/browse/MB-5025)

 * The `cbbackup` utility will now execute an integrity check after the backup has
   been completed to check the integrity of the data files created during the
   backup process. This will report any problems in the generated backup files.

   *Issues* : [MB-4884](http://www.couchbase.com/issues/browse/MB-4884)

 * When a node has been rebalanced out of the cluster, the configured location for
   the data files is reset. If you want to store the data files for a node in a
   different location than the default, you must re-iniitialize the configuration
   to set the correct location before the node is rebalanced back into the cluster.

   *Issues* : [MB-5499](http://www.couchbase.com/issues/browse/MB-5499)

 * When creating output file for `collect_info`, the command now creates a
   directory first and then zips the data.

   *Issues* : [MB-3351](http://www.couchbase.com/issues/browse/MB-3351)

 * The disk fragmentation statistics for the on-disk data files are now exposed
   through the statistics interface.

   To get the fragmentation statistics, you can use the `kvtimings` subkey to the
   statistics. This outputs a variety of statistincs, including the new `readSeek`
   and `writeSeek` values. For example:

    ```
    shell> cbstats localhost:11210 kvtimings
    ...
     readSeek (23537 total)
     64 - 128 : ( 0.04%) 10
     256 - 512 : ( 0.06%) 5
     512 - 1KB : ( 0.11%) 10
     1KB - 2KB : ( 55.14%) 12953 #######################################################
     2KB - 4KB : ( 56.52%) 325 #
     4KB - 8KB : ( 57.24%) 169
     8KB - 16KB : ( 57.28%) 10
     16KB - 32KB : ( 57.33%) 12
     32KB - 64KB : ( 57.66%) 78
     64KB - 128KB : ( 59.84%) 512 ##
     128KB - 256KB : ( 63.03%) 751 ###
     256KB - 512KB : ( 88.75%) 6054 #########################
     512KB - 1MB : (100.00%) 2648 ###########
    ...
     writeSeek (111824 total)
     0 - 2 : ( 0.00%) 5
     4 - 8 : ( 0.02%) 15
     8 - 16 : ( 0.02%) 5
     16 - 32 : ( 39.60%) 44254 #######################################
     32 - 64 : ( 39.60%) 5
     64 - 128 : ( 40.43%) 925
     512 - 1KB : ( 40.44%) 15
     1KB - 2KB : ( 95.73%) 61826 #######################################################
     2KB - 4KB : ( 99.49%) 4203 ###
     4KB - 8KB : ( 99.85%) 407
     8KB - 16KB : ( 99.88%) 34
     16KB - 32KB : ( 99.89%) 12
     32KB - 64KB : ( 99.90%) 11
     64KB - 128KB : ( 99.91%) 2
     128KB - 256KB : ( 99.91%) 2
     256KB - 512KB : ( 99.92%) 18
     512KB - 1MB : ( 99.94%) 22
     1MB - 2MB : (100.00%) 63
    ...
    ```

   These statistics show the distribtion of head seek distance that has had to be
   performed on every read/write operation within the SQLite data files. In a file
   with increasing fragmentation, these figures should increase.

   The disk update time is also exposed as a graph through the Administration Web
   Console.

   For more information, see [Bucket Monitoring — Summary
   Statistics](#couchbase-admin-web-console-data-buckets-summary).

   *Issues* : [MB-4937](http://www.couchbase.com/issues/browse/MB-4937)

 * The UI will no longer report a rebalance as having failed through the
   Administration Web Console if the operation was stopped through the use of a
   REST API call or command line request.

   *Issues* : [MB-4963](http://www.couchbase.com/issues/browse/MB-4963)

**Fixes in 1.8.1**

 * **Installation and Upgrade**

    * Compiling Couchbase Server on Windows using `tcmalloc` leads to inconsitent
      memory accounting and reporting, which can lead to problems with the ejection of
      items.

      *Issues* : [MB-4738](http://www.couchbase.com/issues/browse/MB-4738)

    * The shutdown of Couchbase Server may not have completed successfully leaving an
      instance of Erlang and `ns_server` running, which could prevent Couchbase Server
      from restarting successfully. The init scripts for shutting down Couchbase
      Server now terminate and wait for the processes to successfully stop before
      reporting that Couchbase Server has shut down.

      *Issues* : [MB-4765](http://www.couchbase.com/issues/browse/MB-4765)

 * **Cluster Operations**

    * TAP stats sometimes show up as negative.

      *Issues* : [MB-3901](http://www.couchbase.com/issues/browse/MB-3901)

    * Moxi would trigger an assert when obtaining multiple keys during a rebalance
      operation.

      *Issues* : [MB-4334](http://www.couchbase.com/issues/browse/MB-4334)

    * Getting of memcached statistics is much faster.

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Rebalancing in a new Couchbase Server 1.8 node if there are less than 500,000
      items results in an imbalanced cluster.

      *Issues* : [MB-4595](http://www.couchbase.com/issues/browse/MB-4595)

    * Increasing the default timeouts on `ns_server` to avoid rebalance failures due
      to `ep-engine` stats timeout issues in large cluster or clusters where some
      nodes are actively using swap.

      *Issues* : [MB-5546](http://www.couchbase.com/issues/browse/MB-5546)

    * When upgrading from Couchbase Server 1.8.0 to 1.8.1 or Couchbase Server 1.8.0 to
      2.0, an offline upgrade may fail with a rebalance failure reporting the error
      `{wait_for_memcached_failed,"bucket-1"}`.

      *Issues* : [MB-5532](http://www.couchbase.com/issues/browse/MB-5532)

    * The checkpoint implementation used to monitor items and mutations has been
      updated to record only the list of changed items. This requires less memory and
      reduces the overall memory footprint.

      *Issues* : [MB-4814](http://www.couchbase.com/issues/browse/MB-4814)

    * memcached crashes during rebalancing operation with "bucket\_engine.c:1876:
      bucket\_engine\_release\_cookie: Assertion `peh' failed" error.

      *Issues* : [MB-5166](http://www.couchbase.com/issues/browse/MB-5166),
      [MB-3592](http://www.couchbase.com/issues/browse/MB-3592),
      [MB-5081](http://www.couchbase.com/issues/browse/MB-5081)

    * User is unable to add the node back to the cluster because the failed over node
      is stuck in warmup phase.

      *Issues* : [MB-5279](http://www.couchbase.com/issues/browse/MB-5279)

    * Takeover TAP streams do not shut down gracefully in case of rebalance failure or
      rebalance being stopped by the user.

      *Issues* : [MB-4366](http://www.couchbase.com/issues/browse/MB-4366)

    * Auto-failover may failover two nodes instead of one if two failurs occur within
      less than one minute.

      *Issues* : [MB-4906](http://www.couchbase.com/issues/browse/MB-4906)

    * Rebalancing with multiple node changes when a bucket has less than 100k items
      could cause rebalance to hang and fail to complete successfully.

      *Issues* : [MB-4828](http://www.couchbase.com/issues/browse/MB-4828)

    * Logging mechanism has been modified to output into a text format. Previously we
      had logged information in binary format. New log files located at
      /var/lib/couchbase/logs. Log files can be up to 600MB in size. The three log
      files are log.\*, error.\* and info.\*

      *Issues* : [MB-6607](http://www.couchbase.com/issues/browse/MB-6607)

    * The rebalance operation could fail to complete successfully if the node that
      failed during the rebalance operation was a master node. This could be triggered
      either by a manual or automatic failover.

      This would lead to the cluster being marked in the rebalance running state, with
      no way to complete or stop the rebalance operation, or add or remove nodes and
      initiate a new rebalance.

      *Issues* : [MB-5020](http://www.couchbase.com/issues/browse/MB-5020),
      [MB-5050](http://www.couchbase.com/issues/browse/MB-5050)

    * Auto-failover fails over a node if some of the buckets are already rebalanced
      out but rebalance has been stopped or interrupted.

      *Issues* : [MB-5602](http://www.couchbase.com/issues/browse/MB-5602)

    * A rebalance issue may occur when removing a node and adding a replacement node.
      The backfill statistics for the rebalance may show that there are no further
      items to be transferred, but the rebalance process hangs.

      *Issues* : [MB-4864](http://www.couchbase.com/issues/browse/MB-4864)

    * Couchbase Server could mistakenly report that the cluster is in
      `rebalance_state` even though the rebalance operation is not running.

      *Issues* : [MB-4962](http://www.couchbase.com/issues/browse/MB-4962)

    * A rebalance operation could exit with `{mover_crashed, noproc}` if the vBucket
      move operation completed very quickly.

      *Issues* : [MB-4964](http://www.couchbase.com/issues/browse/MB-4964)

    * TAP doesn't handle "garbage" data/messages over a dump connection.

      *Issues* : [MB-3669](http://www.couchbase.com/issues/browse/MB-3669)

    * Mixed clusters with Couchbase Server 1.8.1 and 1.7.1.1 or earlier are not
      supported.

      *Issues* : [MB-5194](http://www.couchbase.com/issues/browse/MB-5194)

 * **Web Console**

    * UI shows "\\[16:14:07\\] - IP address seems to have changed. Unable to listen on
      'ns\_1@169.254.15.168'." message every second after installing 1.8.1 on a
      Windows 7 virtual machine.

      *Issues* : [MB-5535](http://www.couchbase.com/issues/browse/MB-5535)

    * Phone home is unable to post data when json object is too large. The `Update
      Notification` tab shows "Warning - There was a problem with retreiving the
      update information. ".

      *Issues* : [MB-5579](http://www.couchbase.com/issues/browse/MB-5579)

    * Removing a configured bucket through the UI could still indicate a `Cluster
      Memory Fully Allocated` warning message, even though the bucket removal will
      have freed the memory allocation.

      *Issues* : [MB-5019](http://www.couchbase.com/issues/browse/MB-5019)

    * Some of the alerts such as moxi crashing were not being displayed in the web
      console.

      *Issues* : [MB-5275](http://www.couchbase.com/issues/browse/MB-5275)

    * The Administration Web Console will now report a warning if there was a failure
      to persist data due to the underlying persistence layer (SQLite).

      *Issues* : [MB-5256](http://www.couchbase.com/issues/browse/MB-5256)

 * **Command-line Tools**

    * `collect_info` should include "diag" information.

      *Issues* : [MB-5203](http://www.couchbase.com/issues/browse/MB-5203)

    * `collect_info` now collects TAP and checkpoint stats from each node.

      *Issues* : [MB-4482](http://www.couchbase.com/issues/browse/MB-4482)

    * `ebucketmigrator` now supports SASL authentication.

      *Issues* : [MB-5385](http://www.couchbase.com/issues/browse/MB-5385)

    * `cbbrowse_logs` command does not work on Mac OS X.

      *Issues* : [MB-4703](http://www.couchbase.com/issues/browse/MB-4703)

    * The `cbworkloadgen` and `docloader` tools will now work with both Python 2.4 and
      Python 2.6.

      *Issues* : [MB-4965](http://www.couchbase.com/issues/browse/MB-4965)

 * **Cloud Support**

    * Duplicating a virtual machine with Couchbase Server already installed could lead
      to problems because the same otpCookie value has been configured on each
      duplicated machine.

      *Issues* : [MB-4476](http://www.couchbase.com/issues/browse/MB-4476)

    * When using Couchbase Server within a VM, a pause could cause Couchbase Server to
      retain the original time, not the updated time when the VM was re-enabled.

      *Issues* : [MB-4189](http://www.couchbase.com/issues/browse/MB-4189)

**Known Issues in 1.8.1**

 * **Installation and Upgrade**

    * Performing a rolling upgrade from Membase Server 1.7.1 to Couchbase Server 1.8.1
      fails during a rebalance with `{type,exit},
      {what,{noproc,{gen_fsm,sync_send_event,}}}`.

      *Workaround* : Start the rebalance operation from the Couchbase Server 1.8.1
      node.

      *Issues* : [MB-5108](http://www.couchbase.com/issues/browse/MB-5108)

    * Running Couchbase as the `root` may cause problems, but may not produce suitable
      warnings. Do not run as the `root` user. Note that this is not the same as
      installing, which needs to be done by `root`.

      *Issues* : [MB-1475](http://www.couchbase.com/issues/browse/MB-1475)

    * Known issues when Couchbase runs out of disk space.

      *Workaround* : Monitor your system resources closely and ensure that the
      Couchbase nodes don't run out of disk space.

      *Issues* : [MB-3158](http://www.couchbase.com/issues/browse/MB-3158)

    * Large changes in wall-clock time negatively affect disk persistence ability and
      GUI display.

      *Workaround* : Use NTP to keep systems synchronized and start Couchbase service
      after such synchronization has taken place.

    * Memcached process is not shutdown quickly with a high disk write queue.

      *Workaround* : Make sure your disk write queue is as low as possible (or 0)
      before shutting down the service.

      *Issues* : [MB-3628](http://www.couchbase.com/issues/browse/MB-3628)

    * Performing a rolling upgrade from Membase Server 1.7.2 to Couchbase Server 1.8.1
      fails with the message:

       ```
       Unknown macro: {type,exit}
       , {what,{noproc,
       Unknown macro: {gen_fsm,sync_send_event,}
       }}
       ```

      *Workaround* : You should retry the rebalance operation by initiating the
      rebalance on the 1.8.1 node.

      *Issues* : [MB-5108](http://www.couchbase.com/issues/browse/MB-5108)

    * The Linux installer tries to start `couchbase-server` and fails. This warning
      can safely be ignored.

      *Issues* : [MB-3797](http://www.couchbase.com/issues/browse/MB-3797)

 * **Cluster Operations**

    * Connections to memcached buckets may be dropped during a rebalance due to a
      `replicator_died: exited (ns_single_vbucket_mover)`.

      *Issues* : [MB-5343](http://www.couchbase.com/issues/browse/MB-5343)

    * Rebalance fails with `wait_for_memcached` if user stops rebalancing after one
      bucket was already rebalanced out because ns-server looks for "rebalanced out"
      buckets in the next rebalance attempt.

      *Issues* : [MB-5434](http://www.couchbase.com/issues/browse/MB-5434)

    * Rebalance may fail with `gen_fsm, sync_send_event` error during an online
      upgrade from Membase Server 1.7.2 to Couchbase Server 1.8.1 on Windows.

      *Workaround* : Wait 30 seconds between adding adding the node and starting the
      rebalance operation.

      *Issues* : [MB-5293](http://www.couchbase.com/issues/browse/MB-5293)

    * Rebelance may fail with `change_filter_failed` if the password on an individual
      bucket is modified before the rebalance process completes.

      *Issues* : [MB-5625](http://www.couchbase.com/issues/browse/MB-5625)

    * Some known issues when rebalancing with a very high ratio of data on disk versus
      data in RAM.

      *Workaround* : Use more nodes than less to better distribute the on-disk data.

    * Rebalance may fail with `{case_clause,{{ok,replica},{ok_replica}}` when
      rebalancing out a node which had been failed over due to network connectivity
      issues, but appears back during rebalance.

      *Issues* : [MB-5298](http://www.couchbase.com/issues/browse/MB-5298)

    * Rebalance failure due to replicator\_died with
      "memcached\_error,auth\_error,<<"Auth failure">>" because node was marked as
      ready before `isasl.pw` was read.

      *Issues* : [MB-5513](http://www.couchbase.com/issues/browse/MB-5513)

    * When using Moxi in a cluster using `haproxy`, it's possible for a memory leak to
      cause a problem in Moxi when the topology appears to change. The problem is due
      to `haproxy` disabling open connections, particularly those used for management,
      that Moxi may have open, but not using. The `haproxy` closes these open
      connections, which `moxi` identifies as topology changes. The problem is
      particularly prevalent when using the `balance roundrobin` load balancing type.

      *Workaround* : There are two possible workarounds to prevent the memory leak in
      `moxi` :

       * Use `balance source` load balancing mode within `haproxy`. This reduces the
         effect of `haproxy` closing the open network ports.

       * Increase the network timeouts in `haproxy`. You can do this by editing the
         `haproxy` configuration file and adding the following two lines:

          ```
          timeout client 300000
          timeout server 300000
          ```

         The above sets a 5 minute timeout. You can increase this to a larger number.

      *Issues* : [MB-4896](http://www.couchbase.com/issues/browse/MB-4896)

 * **Command-line Tools**

    * When running `cbbackup` on Windows a temporary file will be created on the
      startup drive that contains a copy of the database data, even when the backup is
      being created on another volume.

      *Issues* : [MB-5040](http://www.couchbase.com/issues/browse/MB-5040)

    * The `cbrestore` command sometimes shows a Python interrupt error. This should
      only happen at the very end of the restore and does not affect the data being
      inserted.

      *Issues* : [MB-3804](http://www.couchbase.com/issues/browse/MB-3804)

    * The backup operation may fail when the write-ahead logging (WAL) is large. An
      error, `Database disk image is malformed` may be returned by the backup process.

      *Issues* : [MB-5095](http://www.couchbase.com/issues/browse/MB-5095)

    * The backup commands `cbbackup` (formerly `mbbackup` may fail to work correctly
      unless run as `couchbase` or `membase` user.

      *Workaround* : Run as `couchbase` or `membase` user.

      *Issues* : [MB-4614](http://www.couchbase.com/issues/browse/MB-4614)

<a id="couchbase-server-rn_1-8-0"></a>

## Release Notes for Couchbase Server 1.8.0 GA (23 January 2012)

Couchbase Server 1.8 is the updated and rebranded release of Membase Server.

To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

In line with the rebranding and name changes, there are some significant changes
to the following areas of this release:

 * **Directory Changes**

   Couchbase Server is now installed into a `couchbase` directory, for example on
   Linux the default installation directory is `/opt/couchbase` instead of
   `/opt/membase`.

   During an upgrade, the location of your data files will not be modified.

 * **Command Changes**

   The name of many of the core commands provided with Couchbase Server have been
   renamed, with the existing scripts deprecated. For example, the backup command
   `mbbackup` in Membase Server is now called `cbbackup`. See the full release note
   entry below for more detailed information.

**New Features and Behavior Changes in 1.8.0**

 * Ubuntu 9.x is no longer a supported platform and support will be removed in a
   future release.

   *Issues* : [MB-2506](http://www.couchbase.com/issues/browse/MB-2506) ; *Tags* :
   deprecated

 * The `SYNC` protocol command has been deprecated. Applications and solutions
   should no longer use the `SYNC` command. The command will be removed entirely in
   a future version.

   *Tags* : deprecation

 * Ubuntu 8.x is no longer a supported platform.

   *Issues* : [MB-2506](http://www.couchbase.com/issues/browse/MB-2506) ; *Tags* :
   removal

 * Internet Explorer 7 as a supported browser for the Couchbase Web Admin Console
   is now deprecated, and support will be removed entirely in a future release.

   *Tags* : deprecation

 * Allow disk write queue upper limit to be modified at runtime.

   *Issues* : [MB-4418](http://www.couchbase.com/issues/browse/MB-4418)

 * Red Hat/CentOS 5.4 is no longer a supported platform and will be removed
   entirely in a future release.

   *Issues* : [MB-2506](http://www.couchbase.com/issues/browse/MB-2506) ; *Tags* :
   deprecated

 * The following command-line tools have been deprecated and replaced with the
   corresponding tool as noted in the table below.

   Deprecated Tool              | Replacement Tool
   -----------------------------|-----------------------------
   `membase`                    | `couchbase-cli`
   `mbadm-online-restore`       | `cbadm-online-restore`
   `mbadm-online-update`        | `cbadm-online-update`
   `mbadm-tap-registration`     | `cbadm-tap-registration`
   `mbbackup-incremental`       | `cbbackup-incremental`
   `mbbackup-merge-incremental` | `cbbackup-merge-incremental`
   `mbbackup`                   | `cbbackup`
   `mbbrowse_logs`              | `cbbrowse_logs`
   `mbcollect_info`             | `cbcollect_info`
   `mbdbconvert`                | `cbdbconvert`
   `mbdbmaint`                  | `cbdbmaint`
   `mbdbupgrade`                | `cbdbupgrade`
   `mbdumpconfig.escript`       | `cbdumpconfig.escript`
   `mbenable_core_dumps.sh`     | `cbenable_core_dumps.sh`
   `mbflushctl`                 | `cbflushctl`
   `mbrestore`                  | `cbrestore`
   `mbstats`                    | `cbstats`
   `mbupgrade`                  | `cbupgrade`
   `mbvbucketctl`               | `cbvbucketctl`

   Using a deprecated tool will result in a warning message that the tool is
   deprecated and will no longer be supported.

   For more information, see [Command-line Interface for
   Administration](#couchbase-admin-cmdline).

   *Tags* : deprecation

 * The `membase` bucket type has been deprecated. The `couchbase` bucket type
   should be used instead to select the balanced, persistent and replicated buckets
   supported by a Couchbase cluster.

   For more information, see [Buckets](#couchbase-architecture-buckets).

   *Tags* : deprecation

**Fixes in 1.8.0**

 * **Cluster Operations**

    * TAP stats sometimes show up as negative.

      *Issues* : [MB-3901](http://www.couchbase.com/issues/browse/MB-3901)

    * Takeover TAP streams do not shut down gracefully in case of rebalance failure or
      rebalance being stopped by the user.

      *Issues* : [MB-4366](http://www.couchbase.com/issues/browse/MB-4366)

    * TAP doesn't handle "garbage" data/messages over a dump connection.

      *Issues* : [MB-3669](http://www.couchbase.com/issues/browse/MB-3669)

 * **Unclassified**

    * Installer dependencies on RHEL 5.4 have been updated.

      *Issues* : [MB-4561](http://www.couchbase.com/issues/browse/MB-4561)

    * Installation of Membase on Amazon Linux would fail.

      *Issues* : [MB-3419](http://www.couchbase.com/issues/browse/MB-3419)

    * Rebalancing process might hang when adding or removing nodes in a large cluster
      where client load is running.

      *Issues* : [MB-4517](http://www.couchbase.com/issues/browse/MB-4517),
      [MB-4490](http://www.couchbase.com/issues/browse/MB-4490)

    * Unable to create a default bucket using `membase-cli`.

      *Issues* : [MB-4453](http://www.couchbase.com/issues/browse/MB-4453)

    * The `ep_num_not_my_vbuckets` stat doesn't reset.

      *Issues* : [MB-3852](http://www.couchbase.com/issues/browse/MB-3852)

    * Decreased memory usage by coalesce checkpoints in the replica side if item
      persistence is slower. Server will maintain only two replica checkpoints for
      each `vbucket`.

      *Issues* : [MB-4578](http://www.couchbase.com/issues/browse/MB-4578)

    * Fixed a case where there are two replicas where replication cursor would get
      stuck and slave node didn't replicate the data into the other node in the
      replication chain.

      *Issues* : [MB-4461](http://www.couchbase.com/issues/browse/MB-4461)

    * Selecting the master node during rolling upgrade where there are different
      membase/couchbase servers in the cluster.

      *Issues* : [MB-4592](http://www.couchbase.com/issues/browse/MB-4592)

**Known Issues in 1.8.0**

 * **Installation and Upgrade**

    * Running Couchbase as the `root` may cause problems, but may not produce suitable
      warnings. Do not run as the `root` user. Note that this is not the same as
      installing, which needs to be done by `root`.

      *Issues* : [MB-1475](http://www.couchbase.com/issues/browse/MB-1475)

    * Known issues when Couchbase runs out of disk space.

      *Workaround* : Monitor your system resources closely and ensure that the
      Couchbase nodes don't run out of disk space.

      *Issues* : [MB-3158](http://www.couchbase.com/issues/browse/MB-3158)

    * Large changes in wall-clock time negatively affect disk persistence ability and
      GUI display.

      *Workaround* : Use NTP to keep systems synchronized and start Couchbase service
      after such synchronization has taken place.

    * Memcached process is not shutdown quickly with a high disk write queue.

      *Workaround* : Make sure your disk write queue is as low as possible (or 0)
      before shutting down the service.

      *Issues* : [MB-3628](http://www.couchbase.com/issues/browse/MB-3628)

    * The Linux installer tries to start `couchbase-server` and fails. This warning
      can safely be ignored.

      *Issues* : [MB-3797](http://www.couchbase.com/issues/browse/MB-3797)

 * **Cluster Operations**

    * Some known issues when rebalancing with a very high ratio of data on disk versus
      data in RAM.

      *Workaround* : Use more nodes than less to better distribute the on-disk data.

    * When using Moxi in a cluster using `haproxy`, it's possible for a memory leak to
      cause a problem in Moxi when the topology appears to change. The problem is due
      to `haproxy` disabling open connections, particularly those used for management,
      that Moxi may have open, but not using. The `haproxy` closes these open
      connections, which `moxi` identifies as topology changes. The problem is
      particularly prevalent when using the `balance roundrobin` load balancing type.

      *Workaround* : There are two possible workarounds to prevent the memory leak in
      `moxi` :

       * Use `balance source` load balancing mode within `haproxy`. This reduces the
         effect of `haproxy` closing the open network ports.

       * Increase the network timeouts in `haproxy`. You can do this by editing the
         `haproxy` configuration file and adding the following two lines:

          ```
          timeout client 300000
          timeout server 300000
          ```

         The above sets a 5 minute timeout. You can increase this to a larger number.

      *Issues* : [MB-4896](http://www.couchbase.com/issues/browse/MB-4896)

 * **Command-line Tools**

    * The `cbrestore` command sometimes shows a Python interrupt error. This should
      only happen at the very end of the restore and does not affect the data being
      inserted.

      *Issues* : [MB-3804](http://www.couchbase.com/issues/browse/MB-3804)

    * The backup commands `cbbackup` (formerly `mbbackup` may fail to work correctly
      unless run as `couchbase` or `membase` user.

      *Workaround* : Run as `couchbase` or `membase` user.

      *Issues* : [MB-4614](http://www.couchbase.com/issues/browse/MB-4614)

 * **Unclassified**

    * An imbalanced cluster situation can occur during a rebalance if the cluster has
      been up for a short period of time (because of start or restart of the cluster),
      when there is a low number of stored items (less than 500k).

      *Issues* : [MB-4595](http://www.couchbase.com/issues/browse/MB-4595) ; *Tags* :
      rebalance

    * Scripts and tools supplied with Couchbase Server require Python 2.6. You may
      need to upgrade your Python installation.

      *Issues* : [MB-4667](http://www.couchbase.com/issues/browse/MB-4667)

    * The `ejectNode` operation is possibly dangerous to active servers.

      *Workaround* : Only use `ejectNode` on nodes not currently responsible for any
      vbuckets.

      *Issues* : [MB-3423](http://www.couchbase.com/issues/browse/MB-3423)

    * UDP access blocked by malformed request

    * Performing a rolling upgrade from version 1.7.1, might cause rebalance to stick
      and fail to complete successfully.

      *Workaround* : You can perform a in-place upgrade (shutdown the entire cluster,
      upgrade, and restart) to get round this issue.

      *Issues* : [MB-4615](http://www.couchbase.com/issues/browse/MB-4615) ; *Tags* :
      incompatibility, rebalance, upgrade

    * A rebalance issue may occur when removing a node and adding a replacement node.
      The backfill statistics for the rebalance may show that there are no further
      items to be transferred, but the rebalance process hangs.

      *Issues* : [MB-4864](http://www.couchbase.com/issues/browse/MB-4864)

<a id="couchbase-server-limits"></a>
