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

 * [Try to use telnet to connect to the variousports](#couchbase-network-ports)
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
   File Entries](#couchbase-troubleshooting-logentries) ) and pick out one or both
   of these messages:

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
