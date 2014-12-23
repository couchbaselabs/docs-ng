<a id="couchbase-admin-cmdline"></a>

# Command-line interface overview

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

Couchbase Server includes a number of command-line tools that can be used to
manage and monitor a Couchbase Server cluster or server. All operations are
mapped to their appropriate [REST API](../cb-rest-api/#couchbase-admin-restapi) call
(where available).

There are a number of command-line tools that perform different functions and
operations, these are described individually within the following sections.
Tools can be located in a number of directories, dependent on the tool in
question in each case.

<a id="couchbase-admin-cmdline-rename-remove-new"></a>

## Command line tools and availability

As of Couchbase Server 2.0, the following publicly available tools have been
renamed, consolidated or removed. This is to provide better usability, and
reduce the number of commands required to manage Couchbase Server:

By default, the command-line tools are installed into the following locations on
each platform:

<a id="table-couchbase-admin-cmdline-locs"></a>

Operating System | Directory Locations
-------------|---------------------------------------------------------------------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin`, `/opt/couchbase/bin/install`, `/opt/couchbase/bin/tools`, `/opt/couchbase/bin/tools/unsupported`                      
**Windows**  | `C:\Program Files\couchbase\server\bin`, `C:\Program Files\couchbase\server\bin\install`, and `C:\Program Files\couchbase\server\bin\tools`.
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin`                                                                  

<a id="couchbase-admin-cmdline-unsupported"></a>

## Unsupported tools

The following are tools that are visible in Couchbase Server 2.0 installation;
however the tools are unsupported. This means they are meant for Couchbase
internal use and will not be supported by Couchbase Technical Support:

 * `cbbrowse_logs`

 * `cbdump-config`

 * `cbenable_core_dumps.sh`

 * `couch_compact`

 * `couch_dbdump`

 * `couch_dbinfo`

 * `memslap`

<a id="couchbase-admin-cmdline-deprecated-removed"></a>

## Deprecated and removed tools

The following are tools that existed in previous versions but have been
deprecated and removed as of Couchbase Server 1.8:

<a id="table-couchbase-admin-cmdline-deprecated"></a>

Tool                         | Server Versions | Description/Status                                            
-----------------------------|-----------------|---------------------------------------------------------------
`tap.py`                     | 1.8             | Deprecated in 1.8.                                            
`cbclusterstats`             | 1.8             | Deprecated in 1.8. Replaced by `cbstats` in 1.8.              
`membase`                    | 1.7             | Deprecated in 1.8. Replaced by `couchbase-cli` in 1.8.1       
`mbadm-online-restore`       | 1.7             | Deprecated in 1.8. Replaced by `cbadm-online-restore` in 1.8.1
`membase`                    | 1.7             | Deprecated in 1.8, replaced by `couchbase-cli`                
`mbadm-online-restore`       | 1.7             | Deprecated in 1.8, replaced by `cbadm-online-restore`         
`mbadm-online-update`        | 1.7             | Deprecated in 1.8, replaced by `cbadm-online-update`          
`mbadm-tap-registration`     | 1.7             | Deprecated in 1.8, replaced by `cbadm-tap-registration`       
`mbbackup-incremental`       | 1.7             | Deprecated in 1.8       
`mbbackup-merge-incremental` | 1.7             | Deprecated in 1.8
`mbbackup`                   | 1.7             | Deprecated in 1.8, replaced by `cbbackup`                     
`mbbrowse_logs`              | 1.7             | Deprecated in 1.8, replaced by `cbbrowse_logs`                
`mbcollect_info`             | 1.7             | Deprecated in 1.8, replaced by `cbcollect_info`               
`mbdbconvert`                | 1.7             | Deprecated in 1.8, replaced by `cbdbconvert`                  
`mbdbmaint`                  | 1.7             | Deprecated in 1.8, replaced by `cbdbmaint`                    
`mbdbupgrade`                | 1.7             | Deprecated in 1.8, replaced by `cbdbupgrade`                  
`mbdumpconfig.escript`       | 1.7             | Deprecated in 1.8, replaced by `cbdumpconfig.escript`         
`mbenable_core_dumps.sh`     | 1.7             | Deprecated in 1.8, replaced by `cbenable_core_dumps.sh`       
`mbflushctl`                 | 1.7             | Deprecated in 1.8, replaced by `cbflushctl`                   
`mbrestore`                  | 1.7             | Deprecated in 1.8, replaced by `cbrestore`                    
`mbstats`                    | 1.7             | Deprecated in 1.8, replaced by `cbstats`                      
`mbupgrade`                  | 1.7             | Deprecated in 1.8, replaced by `cbupgrade`                    
`mbvbucketctl`               | 1.7             | Deprecated in 1.8, replaced by `cbvbucketctl`                 

