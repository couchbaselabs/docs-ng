# Troubleshooting
When troubleshooting your Couchbase Server deployment there are a number of
different approaches available to you. For specific answers to individual
problems, see [Common Errors](#couchbase-troubleshooting-common-errors).

<a id="couchbase-troubleshooting-general"></a>

## General Tips

The following are some general tips that may be useful before performing any
more detailed investigations:

 * Try pinging the node.

 * Try connecting to the Couchbase Server Web Console on the node.

 * [Try to use telnet to connect to the various ports](#couchbase-network-ports)
   that Couchbase Server uses.

 * Try reloading the web page.

 * Check firewall settings (if any) on the node. Make sure there isn't a firewall
   between you and the node. On a Windows system, for example, the Windows firewall
   might be blocking the ports (Control Panel > Windows Firewall).

 * Make sure that the documented ports are open between nodes and make sure the
   data operation ports are available to clients.

 * Check your browser's security settings.

 * Check any other security software installed on your system, such as antivirus
   programs.

 * Generate a Diagnostic Report for use by Couchbase Technical Support to help
   determine what the problem is. There are two ways of collecting this
   information:

    * Click `Generate Diagnostic Report` on the Log page to obtain a snapshot of your
      system's configuration and log information for deeper analysis. You must send
      this file to Couchbase.

    * Run the `cbcollect_info` on each node within your cluster. To run, you must
      specify the name of the file to be generated:

       ```
       > cbcollect_info nodename.zip
       ```

      This will create a Zip file with the specified name. You must run each command
      individually on each node within the cluster. You can then send each file to
      Couchbase for analysis.

      For more information, see [cbcollect_info
      Tool](#couchbase-admin-cmdline-cbcollect_info).

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

<a id="couchbase-troubleshooting-logs"></a>

## Logs and Logging

Couchbase Server creates a number of different log files depending on the
component of the system that produce the error, and the level and severity of
the problem being reported. For a list of the different file locations for each
platform, see [](#couchbase-troubleshooting-logs-oslocs).

<a id="couchbase-troubleshooting-logs-oslocs"></a>

Platform | Location                                                                     
---------|------------------------------------------------------------------------------
Linux    | `/opt/couchbase/var/lib/couchbase/logs`                                      
Windows  | `C:\Program Files\Couchbase\Server\log` Assumes default installation location
Mac OS X | `~/Library/Logs`                                                             

Individual log files are automatically numbered, with the number suffix
incremented for each new log, with a maximum of 20 files per log. Individual log
file sizes are limited to 10MB by default.

[](#couchbase-troubleshooting-logs-files) contains a list of the different log
files are create in the logging directory and their contents.

<a id="couchbase-troubleshooting-logs-files"></a>

File               | Log Contents                                                                                                                                               
-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------
`couchdb`          | Errors relating to the couchdb subsystem that supports views, indexes and related REST API issues                                                          
`debug`            | Debug level error messages related to the core server management subsystem, excluding information included in the `couchdb`, `xdcr` and `stats` logs.      
`info`             | Information level error messages related to the core server management subsystem, excluding information included in the `couchdb`, `xdcr` and `stats` logs.
`error`            | Error level messages for all subsystems excluding `xdcr`.                                                                                                  
`xcdr_error`       | XDCR error messages.                                                                                                                                       
`xdcr`             | XDCR information messages.                                                                                                                                 
`mapreduce_errors` | JavaScript and other view-processing errors are reported in this file.                                                                                     
`views`            | Errors relating to the integration between the view system and the core server subsystem.                                                                  
`stats`            | Contains periodic reports of the core statistics.                                                                                                          
`memcached.log`    | Contains information relating to the core memcache component, including vBucket and replica and rebalance data streams requests.                           

Each log file group will also include a `.idx` and `.siz` file which holds meta
information about the log file group. These files are automatically updated by
the logging system.

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
    > ulimit -n 10240 ulimit -c unlimited
    ```

   Depending on the defaults of your system, this may or may not be allowed. If
   Couchbase Server is failing to start, you can look through the logs and pick out
   one or both of these messages:

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
