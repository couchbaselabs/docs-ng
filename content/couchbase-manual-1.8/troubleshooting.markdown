# Troubleshooting

When troubleshooting your Couchbase Server deployment there are a number of
different approaches available to you. For specific answers to individual
problems, see [Common
Errors](couchbase-manual-ready.html#couchbase-troubleshooting-common-errors).

<a id="couchbase-troubleshooting-general"></a>

## General Tips

The following are some general tips that may be useful before performing any
more detailed investigations:

 * Try pinging the node.

 * Try connecting to the Couchbase Server Web Console on the node.

 * [Try to use telnet to connect to the
   variousports](couchbase-manual-ready.html#couchbase-network-ports) that
   Couchbase Server uses.

 * Try reloading the web page.

 * Check firewall settings (if any) on the node. Make sure there isn't a firewall
   between you and the node. On a Windows system, for example, the Windows firewall
   might be blocking the ports (Control Panel > Windows Firewall).

 * Make sure that the documented ports are open between nodes and make sure the
   data operation ports are available to clients.

 * Check your browser's security settings.

 * Check any other security software installed on your system, such as antivirus
   programs.

 * Click Generate Diagnostic Report on the Log page to obtain a snapshot of your
   system's configuration and log information for deeper analysis. This information
   can be sent to Couchbase Technical Support to diagnose issues.

<a id="couchbase-troubleshooting-specific-errors"></a>

## Responding to Specific Errors

The following table outlines some specific areas to check when experiencing
different problems:

<a id="table-couchbase-troubleshooting-specific-errors"></a>

Severity      | Issue                               | Suggested Action(s)                                                      
--------------|-------------------------------------|--------------------------------------------------------------------------
Critical      | Couchbase Server does not start up. | Check that the service is running.                                       
              |                                     | Check error logs.                                                        
              |                                     | Try restarting the service.                                              
Critical      | A server is not responding.         | Check that the service is running.                                       
              |                                     | Check error logs.                                                        
              |                                     | Try restarting the service.                                              
Critical      | A server is down.                   | Try restarting the server.                                               
              |                                     | Use the command-line interface to check connectivity.                    
Informational | Bucket authentication failure.      | Check the properties of the bucket that you are attempting to connect to.

The primary source for run-time logging information is the Couchbase Server Web
Console. Run-time logs are automatically set up and started during the
installation process. However, the Couchbase Server gives you access to
lower-level logging details if needed for diagnostic and troubleshooting
purposes. Log files are stored in a binary format in the logs directory under
the Couchbase installation directory. You must use `browse_logs` to extract the
log contents from the binary format to a text file.

<a id="couchbase-troubleshooting-logentries"></a>

## Log File Entries

The log file contains entries for various events, such as progress, information,
error, and crash. Note that something flagged as error or crash does not
necessarily mean that there is anything wrong. Below is an example of the
output:


```
=PROGRESS REPORT==== 4-Mar-2010::11:54:23 ===
supervisor: {local,sasl_safe_sup}
started: [{pid,<0.32.0>},
{name,alarm_handler},
{mfa,{alarm_handler,start_link,[]}},
{restart_type,permanent},
{shutdown,2000},
{child_type,worker}]
=PROGRESS REPORT==== 4-Mar-2010::11:54:23 ===
supervisor: {local,sasl_safe_sup}
started: [{pid,<0.33.0>},
{name,overload},
{mfa,{overload,start_link,[]}},
{restart_type,permanent},
{shutdown,2000},
{child_type,worker}]
```

Look for `ns_log` in the output to see anything that would have been shown via
the Couchbase Server Web Console.

<a id="couchbase-troubleshooting-linux-logs"></a>

## Linux Logs

Couchbase Server stores its logs different places, depending on the component
reporting the error. The core memory and replication logs are stored in an
efficient, space-limited binary format under
`/opt/couchbase/var/lig/couchbase/logs`. A Couchbase shell script (
`cbbrowse_logs` ) will output these logs in a human-readable text format.

To dump the most recent 100MB of logs as text, run the following command:


```
shell> cbbrowse_logs
```

You can redirect the output of this batch file to a text file that you can save
for later viewing or email to [Couchbase Technical
Support](http://www.couchbase.com/products-and-services/couchbase-support). The
following example redirects output to a text file named `nslogs.txt`.


```
shell> cbbrowse_logs > /tmp/nslogs.txt
```

<a id="couchbase-troubleshooting-windows-logs"></a>

## Windows Logs

Couchbase Server stores its logs in an efficient, space-limited binary format.
The binary run-time log files reside in the following path `<install_path>\log`
(where < install\_path> is where you installed the Couchbase software).

You cannot open these binary files directly. To dump the run-time logs into a
text file, run the `browse_logs.bat` file, located
`<install_path>\bin\browse_logs.bat`. This command dumps the logs to standard
output in a human-readable text format. You can redirect the output of this
batch file to a text file that you can save for later viewing or email to
[Couchbase Technical Support](http://www.couchbase.com/support). The following
example redirects output to a text file named nslogs.txt.


```
shell> "C:\Program Files\Couchbase\Memcached Server\bin\browse_logs.bat" > C:\nslogs.txt
```

<a id="couchbase-troubleshooting-macosx-logs"></a>

## Mac OS X Logs

Couchbase Server stores it's logs within the user-specific `~/Library/Logs`
directory. The current log file is stored in `Couchbase.log`. If you stop and
restart the server, the current log will be renamed to `Couchbase.log.old` and a
new `Couchbase.log` will be created.

These files are stored in text format and are accessible within the `Console`
application.

<a id="couchbase-troubleshooting-common-errors"></a>

## Common Errors

This page will attempt to describe and resolve some common errors that are
encountered when using Couchbase. It will be a living document as new problems
and/or resolutions are discovered.

 * **Problems Starting Couchbase Server for the first time**

   If you are having problems starting Couchbase Server on Linux for the first
   time, there are two very common causes of this that are actually quite related.
   When the `/etc/init.d/couchbase-server` script runs, it tries to set the file
   descriptor limit and core file size limit:

    ```
    shell> ulimit -n 10240 ulimit -c unlimited
    ```

   Depending on the defaults of your system, this may or may not be allowed. If
   Couchbase Server is failing to start, you can look through the logs (see [Log
   File Entries](couchbase-manual-ready.html#couchbase-troubleshooting-logentries)
   ) and pick out one or both of these messages:

    ```
    ns_log: logging ns_port_server:0:Port server memcached on node 'ns_1@127.0.0.1' exited with status 71. »
    Restarting. Messages: failed to set rlimit for open files. »
    Try running as root or requesting smaller maxconns value.
    ```

   Alternatively you may additional see or optionally see:

    ```
    ns_port_server:0:info:message - Port server memcached on node 'ns_1@127.0.0.1' exited with status 71. »
    Restarting. Messages: failed to ensure corefile creation
    ```

   The resolution to these is to edit the /etc/security/limits.conf file and add
   these entries:

    ```
    couchbase hard nofile 10240
    couchbase hard core unlimited
    ```

<a id="couchbase-faq"></a>

# Appendix: FAQs

 * What kind of client do I use with `couchbase` ?

   `couchbase` is compatible with existing memcached clients. If you have a
   memcached client already, you can just point it at `couchbase`. Regular testing
   is done with `spymemcached` (the Java client), `libmemcached` and fauna (Ruby
   client). See the [Client Libraries](http://www.couchbase.com/develop) page

 * What is a "vbucket"?

   An overview from Dustin Sallings is presented here: [memcached
   vBuckets](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)

 * What is a TAP stream?

   A TAP stream is a when a client requests a stream of item updates from the
   server. That is, as other clients are requesting item mutations (for example,
   SET's and DELETE's), a TAP stream client can "wire-tap" the server to receive a
   stream of item change notifications.

   When a TAP stream client starts its connection, it may also optionally request a
   stream of all items stored in the server, even if no other clients are making
   any item changes. On the TAP stream connection setup options, a TAP stream
   client may request to receive just current items stored in the server (all items
   until "now"), or all item changes from now onwards into in the future, or both.

   Trond Norbye's written a blog post about the TAP interface. See [Blog
   Entry](http://blog.couchbase.com/want-know-what-your-memcached-servers-are-doing-tap-them).

 * What ports does `couchbase` Server need to run on?

   The following TCP ports should be available:

    * 8091 — GUI and REST interface

    * 11211 — Server-side Moxi port for standard memcached client access

    * 11210 — native `couchbase` data port

    * 21100 to 21199 — inclusive for dynamic cluster communication

 * What hardware and platforms does `couchbase` Server support?

   Couchbase Server supports Red Hat (and CentOS) versions 5 starting with update
   2, Ubuntu 9 and and Windows Server 2008 (other versions have been shown to work
   but are not being specifically tested). There are both 32-bit and 64-bit
   versions available. Community support for Mac OS X is available. Future releases
   will provide support for additional platforms.

 * How can I get `couchbase` on (this other OS)?

   The `couchbase` source code is quite portable and is known to have been built on
   several other UNIX and Linux based OSs. See [Consolidated
   sources](http://www.couchbase.com/downloads/).

 * Can I query `couchbase` by something other than the key name?

   Not directly. It's possible to build these kinds of solutions atop TAP. For
   instance, via
   [Cascading](http://www.cascading.org/2010/09/memcached-membase-and-elastics.html)
   it is possible to stream out the data, process it with Cascading, then create
   indexes in Elastic Search.

 * What is the maximum item size in `couchbase` ?

   The default item size for `couchbase` buckets is 20 MBytes. The default item
   size for memcached buckets is 1 MByte.

 * How do I the change password?

    ```
    shell> couchbase cluster-init -c cluster_IP:8091
            -u current_username-p current password
            --cluster-init-username=new_username
            --cluster-init-password=new_password
    ```

 * How do I change the per-node RAM quota?

    ```
    shell> couchbase cluster-init -c \
               cluster_IP:8091 -u username-p password
                --cluster-init-ramsize=RAM_in_MB
    ```

 * How do I change the disk path?

   Use the `couchbase` command-line tool:

    ```
    shell> couchbase node-init -c cluster_IP:8091 -u \
           username-p password--node-init-data-path=/tmp
    ```

 * Why are some clients getting different results than others for the same
   requests?

   This should never happen in a correctly-configured `couchbase` cluster, since
   `couchbase` ensures a consistent view of all data in a cluster. However, if some
   clients can't reach all the nodes in a cluster (due to firewall or routing
   rules, for example), it is possible for the same key to end up on more than one
   cluster node, resulting in inconsistent duplication. Always ensure that all
   cluster nodes are reachable from every smart client or client-side moxi host.

<a id="couchbase-uninstalling"></a>

# Appendix: Uninstalling Couchbase Server

If you want to uninstall Couchbase Server from your system you must choose the
method appropriate for your operating system.

Before removing Couchbase Server from your system, you should do the following:

 * Shutdown your Couchbase Server. For more information on the methods of shutting
   down your server for your platform, see [Startup and Shutdown of Couchbase
   Server](couchbase-manual-ready.html#couchbase-admin-basics-running).

 * If your machine is part of an active cluster, you should rebalance your cluster
   to take the node out of your configuration. See [Starting a
   Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-rebalancing).

 * Update your clients to point to an available node within your Couchbase Server
   cluster.

<a id="couchbase-uninstalling-redhat"></a>

## Uninstalling on a RedHat Linux System

To uninstall the software on a RedHat Linux system, run the following command:


```
shell> sudo rpm -e couchbase-server
```

Refer to the RedHat RPM documentation for more information about uninstalling
packages using RPM.

You may need to delete the data files associated with your installation. The
default installation location is `/opt`. If you selected an alternative location
for your data files, you will need to separately delete each data directory from
your system.

<a id="couchbase-uninstalling-debian"></a>

## Uninstalling on an Debian/Ubuntu Linux System

To uninstall the software on a Ubuntu Linux system, run the following command:


```
shell> sudo dpkg -r couchbase-server
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

To uninstall on Mac OS X, open the `Applications` folder, and then drag the
`Couchbase Server` application to the trash. You may be asked to provide
administrator credentials to complete the deletion.

To remove the application data, you will need to delete the `CouchbaseServer`
folder from the `~/Library/Application Support` folder for the user that ran
Couchbase Server.

<a id="couchbase-server-rn"></a>

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
   Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-swap).

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

**New Features and Behaviour Changes in 1.8.1**

 * A new port (11209) has been enabled for communication between cluster nodes. You
   must ensure that this port has been opened through firewall and network
   configuration to ensure that cluster operation can take place.

   Couchbase Server uses a new port for communication between cluster nodes. Port
   11209 is used by the `ns_server` component for internode communication.

   *Issues* : [MB-5651](http://www.couchbase.com/issues/browse/MB-5651)

 * Histogram timings are now provided for `get_stats` requests.

 * When a node leaves a cluster (due to failover or removal), the database files
   would automatically be deleted. This behaviour has now been changed so that the
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
   Statistics](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-summary).

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
   Statistics](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-summary).

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

**New Features and Behaviour Changes in 1.8.0**

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
   Administration](couchbase-manual-ready.html#couchbase-admin-cmdline).

   *Tags* : deprecation

 * The `membase` bucket type has been deprecated. The `couchbase` bucket type
   should be used instead to select the balanced, persistent and replicated buckets
   supported by a Couchbase cluster.

   For more information, see
   [Buckets](couchbase-manual-ready.html#couchbase-architecture-buckets).

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

# Appendix: Limits

Couchbase Server has a number of limits and limitations that may affect your use
of Couchbase Server.

<a id="table-couchbase-server-limits"></a>

Limit                   | Value                               
------------------------|-------------------------------------
Max key length          | 250 bytes                           
Max value size          | 20 Mbytes                           
Max data size           | none                                
Max metadata            | Approximately 150 bytes per document
Max Recommended Buckets | 10                                  

<a id="couchbase-server-limits-limitations"></a>

## Known Limitations

The following list provides a summary of the known limitations within Couchbase
Server 1.8.

 * Amazon "micro" and "small" instances are not supported.

   *Workaround* : It is a best practice to use at least "large" instances to
   provide enough RAM for Couchbase to run.

   *Issues* : [MB-3911](http://www.couchbase.com/issues/browse/MB-3911)

 * Couchbase Server fails to run on Windows system with PGP (http://www.pgp.com)
   installed.

   *Workaround* : Uninstall PGP on any systems running Couchbase.

   *Issues* : [MB-3688](http://www.couchbase.com/issues/browse/MB-3688)

 * Network Filesystems (CIFS/NFS) are not supported for data file storage.
   Block-based storage (iSCSI, EBS, etc) work correctly.

   *Issues* : [MB-3333](http://www.couchbase.com/issues/browse/MB-3333)

 * Unsynchronized clocks can lead to UI not displaying graphs.

   *Workaround* : Make sure all the clocks (and their timezones) are synchronized
   in a Couchbase cluster. Use NTP or some other synchronization technology.

   *Issues* : [MB-2833](http://www.couchbase.com/issues/browse/MB-2833)

 * Rebooting a node that re-enables the firewall service on that node will mark all
   the vBuckets on the node as dead and unavailable.

   *Issues* : [MB-5282](http://www.couchbase.com/issues/browse/MB-5282)

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.

<a id="licenses-community"></a>

## Couchbase, Inc. Community Edition License Agreement

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS COMMUNITY EDITION LICENSE
AGREEMENT (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU REPRESENT
AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO THIS
AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE "I
ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. License Grant. Couchbase Inc. hereby grants Licensee, free of charge, the
    non-exclusive right to use, copy, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to Licensee including the following copyright notice
    in all copies or substantial portions of the Software:

     ```
     Couchbase ©
     http://www.couchbase.com
     Copyright 2011 Couchbase, Inc.
     ```

    As used in this Agreement, "Software" means the object code version of the
    applicable elastic data management server software provided by Couchbase, Inc.

 1. Support. Couchbase, Inc. will provide Licensee with access to, and use of, the
    Couchbase, Inc. support forum available at the following URL:
    http://forums.membase.org. Couchbase, Inc. may, at its discretion, modify,
    suspend or terminate support at any time upon notice to Licensee.

 1. Warranty Disclaimer and Limitation of Liability. THE SOFTWARE IS PROVIDED "AS
    IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL COUCHBASE INC. OR THE AUTHORS OR COPYRIGHT
    HOLDERS IN THE SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES (INCLUDING, WITHOUT
    LIMITATION, DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES) OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a id="licenses-enterprise"></a>

## Couchbase, Inc. Enterprise License Agreement: Free Edition

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS ENTERPRISE LICENSE AGREEMENT
– FREE EDITION (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU
REPRESENT AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO
THIS AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE
"I ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. **License Grant**. Subject to Licensee's compliance with the terms and
    conditions of this Agreement, Couchbase Inc. hereby grants to Licensee a
    perpetual, non-exclusive, non-transferable, non-sublicensable, royalty-free,
    limited license to install and use the Software only for Licensee's own internal
    production use on up to two (2) Licensed Servers or for Licensee's own internal
    non-production use for the purpose of evaluation and/or development on an
    unlimited number of Licensed Servers.

 1. **Restrictions**. Licensee will not: (a) copy or use the Software in any manner
    except as expressly permitted in this Agreement; (b) use or deploy the Software
    on any server in excess of the Licensed Servers for which Licensee has paid the
    applicable Subscription Fee unless it is covered by a valid license; (c)
    transfer, sell, rent, lease, lend, distribute, or sublicense the Software to any
    third party; (d) use the Software for providing time-sharing services, service
    bureau services or as part of an application services provider or as a service
    offering primarily designed to offer the functionality of the Software; (e)
    reverse engineer, disassemble, or decompile the Software (except to the extent
    such restrictions are prohibited by law); (f) alter, modify, enhance or prepare
    any derivative work from or of the Software; (g) alter or remove any proprietary
    notices in the Software; (h) make available to any third party the functionality
    of the Software or any license keys used in connection with the Software; (i)
    publically display or communicate the results of internal performance testing or
    other benchmarking or performance evaluation of the Software; or (j) export the
    Software in violation of U.S. Department of Commerce export administration rules
    or any other export laws or regulations.

 1. **Proprietary Rights**. The Software, and any modifications or derivatives
    thereto, is and shall remain the sole property of Couchbase Inc. and its
    licensors, and, except for the license rights granted herein, Couchbase Inc. and
    its licensors retain all right, title and interest in and to the Software,
    including all intellectual property rights therein and thereto. The Software may
    include third party open source software components. If Licensee is the United
    States Government or any contractor thereof, all licenses granted hereunder are
    subject to the following: (a) for acquisition by or on behalf of civil agencies,
    as necessary to obtain protection as "commercial computer software" and related
    documentation in accordance with the terms of this Agreement and as specified in
    Subpart 12.1212 of the Federal Acquisition Regulation (FAR), 48 C.F.R.12.1212,
    and its successors; and (b) for acquisition by or on behalf of the Department of
    Defense (DOD) and any agencies or units thereof, as necessary to obtain
    protection as "commercial computer software" and related documentation in
    accordance with the terms of this Agreement and as specified in Subparts
    227.7202-1 and 227.7202-3 of the DOD FAR Supplement, 48 C.F.R.227.7202-1 and
    227.7202-3, and its successors. Manufacturer is Couchbase, Inc.

 1. **Support**. Couchbase Inc. will provide Licensee with: (a) periodic Software
    updates to correct known bugs and errors to the extent Couchbase Inc.
    incorporates such corrections into the free edition version of the Software; and
    (b) access to, and use of, the Couchbase Inc. support forum available at the
    following URL: http://forums.membase.org. Licensee must have Licensed Servers at
    the same level of Support Services for all instances in a production deployment
    running the Software. Licensee must also have Licensed Servers at the same level
    of Support Services for all instances in a development and test environment
    running the Software, although these Support Services may be at a different
    level than the production Licensed Servers. Couchbase Inc. may, at its
    discretion, modify, suspend or terminate support at any time upon notice to
    Licensee.

 1. **Records Retention and Audit**. Licensee shall maintain complete and accurate
    records to permit Couchbase Inc. to verify the number of Licensed Servers used
    by Licensee hereunder. Upon Couchbase Inc.'s written request, Licensee shall:
    (a) provide Couchbase Inc. with such records within ten (10) days; and (b) will
    furnish Couchbase Inc. with a certification signed by an officer of Licensee
    verifying that the Software is being used pursuant to the terms of this
    Agreement. Upon at least thirty (30) days prior written notice, Couchbase Inc.
    may audit Licensee's use of the Software to ensure that Licensee is in
    compliance with the terms of this Agreement. Any such audit will be conducted
    during regular business hours at Licensee's facilities and will not unreasonably
    interfere with Licensee's business activities. Licensee will provide Couchbase
    Inc. with access to the relevant Licensee records and facilities. If an audit
    reveals that Licensee has used the Software in excess of the authorized Licensed
    Servers, then (i) Couchbase Inc. will invoice Licensee, and Licensee will
    promptly pay Couchbase Inc., the applicable licensing fees for such excessive
    use of the Software, which fees will be based on Couchbase Inc.'s price list in
    effect at the time the audit is completed; and (ii) Licensee will pay Couchbase
    Inc.'s reasonable costs of conducting the audit.

 1. **Confidentiality**. Licensee and Couchbase Inc. will maintain the
    confidentiality of Confidential Information. The receiving party of any
    Confidential Information of the other party agrees not to use such Confidential
    Information for any purpose except as necessary to fulfill its obligations and
    exercise its rights under this Agreement. The receiving party shall protect the
    secrecy of and prevent disclosure and unauthorized use of the disclosing party's
    Confidential Information using the same degree of care that it takes to protect
    its own confidential information and in no event shall use less than reasonable
    care. The terms of this Confidentiality section shall survive termination of
    this Agreement. Upon termination or expiration of this Agreement, the receiving
    party will, at the disclosing party's option, promptly return or destroy (and
    provide written certification of such destruction) the disclosing party's
    Confidential Information.

 1. **Disclaimer of Warranty**. THE SOFTWARE AND ANY SERVICES PROVIDED HEREUNDER ARE
    PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. COUCHBASE INC. DOES NOT WARRANT
    THAT THE SOFTWARE OR THE SERVICES PROVIDED HEREUNDER WILL MEET LICENSEE'S
    REQUIREMENTS, THAT THE SOFTWARE WILL OPERATE IN THE COMBINATIONS LICENSEE MAY
    SELECT FOR USE, THAT THE OPERATION OF THE SOFTWARE WILL BE ERROR-FREE OR
    UNINTERRUPTED OR THAT ALL SOFTWARE ERRORS WILL BE CORRECTED. COUCHBASE INC.
    HEREBY DISCLAIMS ALL WARRANTIES, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
    LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, NON-INFRINGEMENT, TITLE, AND ANY WARRANTIES ARISING OUT OF COURSE OF
    DEALING, USAGE OR TRADE.

 1. **Agreement Term and Termination**. The term of this Agreement shall begin on
    the Effective Date and will continue until terminated by the parties. Licensee
    may terminate this Agreement for any reason, or for no reason, by providing at
    least ten (10) days prior written notice to Couchbase Inc. Couchbase Inc. may
    terminate this Agreement if Licensee materially breaches its obligations
    hereunder and, where such breach is curable, such breach remains uncured for ten
    (10) days following written notice of the breach. Upon termination of this
    Agreement, Licensee will, at Couchbase Inc.'s option, promptly return or destroy
    (and provide written certification of such destruction) the applicable Software
    and all copies and portions thereof, in all forms and types of media. The
    following sections will survive termination or expiration of this Agreement:
    Sections 2, 3, 6, 7, 8, 9, 10 and 11.

 1. **Limitation of Liability**. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
    IN NO EVENT WILL COUCHBASE INC. OR ITS LICENSORS BE LIABLE TO LICENSEE OR TO ANY
    THIRD PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY
    DAMAGES OR FOR THE COST OF PROCURING SUBSTITUTE PRODUCTS OR SERVICES ARISING OUT
    OF OR IN ANY WAY RELATING TO OR IN CONNECTION WITH THIS AGREEMENT OR THE USE OF
    OR INABILITY TO USE THE SOFTWARE OR DOCUMENTATION OR THE SERVICES PROVIDED BY
    COUCHBASE INC. HEREUNDER INCLUDING, WITHOUT LIMITATION, DAMAGES OR OTHER LOSSES
    FOR LOSS OF USE, LOSS OF BUSINESS, LOSS OF GOODWILL, WORK STOPPAGE, LOST
    PROFITS, LOSS OF DATA, COMPUTER FAILURE OR ANY AND ALL OTHER COMMERCIAL DAMAGES
    OR LOSSES EVEN IF ADVISED OF THE POSSIBILITY THEREOF AND REGARDLESS OF THE LEGAL
    OR EQUITABLE THEORY (CONTRACT, TORT OR OTHERWISE) UPON WHICH THE CLAIM IS BASED.
    IN NO EVENT WILL COUCHBASE INC.'S OR ITS LICENSORS' AGGREGATE LIABILITY TO
    LICENSEE, FROM ALL CAUSES OF ACTION AND UNDER ALL THEORIES OF LIABILITY, EXCEED
    ONE THOUSAND DOLLARS (US $1,000). The parties expressly acknowledge and agree
    that Couchbase Inc. has set its prices and entered into this Agreement in
    reliance upon the limitations of liability specified herein, which allocate the
    risk between Couchbase Inc. and Licensee and form a basis of the bargain between
    the parties.

 1. **General**. Couchbase Inc. shall not be liable for any delay or failure in
    performance due to causes beyond its reasonable control. Neither party will,
    without the other party's prior written consent, make any news release, public
    announcement, denial or confirmation of this Agreement, its value, or its terms
    and conditions, or in any manner advertise or publish the fact of this
    Agreement. Notwithstanding the above, Couchbase Inc. may use Licensee's name and
    logo, consistent with Licensee's trademark policies, on customer lists so long
    as such use in no way promotes either endorsement or approval of Couchbase Inc.
    or any Couchbase Inc. products or services. Licensee may not assign this
    Agreement, in whole or in part, by operation of law or otherwise, without
    Couchbase Inc.'s prior written consent. Any attempt to assign this Agreement,
    without such consent, will be null and of no effect. Subject to the foregoing,
    this Agreement will bind and inure to the benefit of each party's successors and
    permitted assigns. If for any reason a court of competent jurisdiction finds any
    provision of this Agreement invalid or unenforceable, that provision of the
    Agreement will be enforced to the maximum extent permissible and the other
    provisions of this Agreement will remain in full force and effect. The failure
    by either party to enforce any provision of this Agreement will not constitute a
    waiver of future enforcement of that or any other provision. All waivers must be
    in writing and signed by both parties. All notices permitted or required under
    this Agreement shall be in writing and shall be delivered in person, by
    confirmed facsimile, overnight courier service or mailed by first class,
    registered or certified mail, postage prepaid, to the address of the party
    specified above or such other address as either party may specify in writing.
    Such notice shall be deemed to have been given upon receipt. This Agreement
    shall be governed by the laws of the State of California, U.S.A., excluding its
    conflicts of law rules. The parties expressly agree that the UN Convention for
    the International Sale of Goods (CISG) will not apply. Any legal action or
    proceeding arising under this Agreement will be brought exclusively in the
    federal or state courts located in the Northern District of California and the
    parties hereby irrevocably consent to the personal jurisdiction and venue
    therein. Any amendment or modification to the Agreement must be in writing
    signed by both parties. This Agreement constitutes the entire agreement and
    supersedes all prior or contemporaneous oral or written agreements regarding the
    subject matter hereof. To the extent there is a conflict between this Agreement
    and the terms of any "shrinkwrap" or "clickwrap" license included in any
    package, media, or electronic version of Couchbase Inc.-furnished software, the
    terms and conditions of this Agreement will control. Each of the parties has
    caused this Agreement to be executed by its duly authorized representatives as
    of the Effective Date. Except as expressly set forth in this Agreement, the
    exercise by either party of any of its remedies under this Agreement will be
    without prejudice to its other remedies under this Agreement or otherwise. The
    parties to this Agreement are independent contractors and this Agreement will
    not establish any relationship of partnership, joint venture, employment,
    franchise, or agency between the parties. Neither party will have the power to
    bind the other or incur obligations on the other's behalf without the other's
    prior written consent.

 1. **Definitions**. Capitalized terms used herein shall have the following
    definitions: "Confidential Information" means any proprietary information
    received by the other party during, or prior to entering into, this Agreement
    that a party should know is confidential or proprietary based on the
    circumstances surrounding the disclosure including, without limitation, the
    Software and any non-public technical and business information. Confidential
    Information does not include information that (a) is or becomes generally known
    to the public through no fault of or breach of this Agreement by the receiving
    party; (b) is rightfully known by the receiving party at the time of disclosure
    without an obligation of confidentiality; (c) is independently developed by the
    receiving party without use of the disclosing party's Confidential Information;
    or (d) the receiving party rightfully obtains from a third party without
    restriction on use or disclosure. "Documentation" means any technical user
    guides or manuals provided by Couchbase Inc. related to the Software. "Licensed
    Server" means an instance of the Software running on one (1) operating system.
    Each operating system instance may be running directly on physical hardware, in
    a virtual machine, or on a cloud server. "Couchbase" means Couchbase, Inc.
    "Couchbase Website" means www.couchbase.com. "Software" means the object code
    version of the applicable elastic data management server software provided by
    Couchbase Inc. and ordered by Licensee during the ordering process on the
    Couchbase Website.

If you have any questions regarding this Agreement, please contact
sales@couchbase.com.