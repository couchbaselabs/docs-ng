

# Deprecated items


The following are items that are deprecated or will be deprecated in the future.


## Platforms

The following operating systems were or will be deprecated.

Operating System | Description/Status | Deprecated version
---------------- | ----------- | -------
Linux | 32-bit operating system will not be supported. | Will be deprecated in 3.0 
Windows | 32-bit operating system will not be supported for production systems, however, will be supported for development purposes. | Will be deprecated in 3.0 
Centos 5 | Centos 5 will not be supported after Couchbase Server version 3.0. | Will be deprecated in a release post-3.0
Ubuntu 10.04 | Ubuntu 10.04 will not be supported after Couchbase Server version 3.0. | Will be deprecated in a release post-3.0

## REST API

The following REST API URI was or will be deprecated.

REST API | URI | Description | Deprecated version 
-------- | --- | ----------- | ------------------
Server nodes  | /pools/nodes | URI for obtaining information about nodes in a Couchbase cluster. | Will be deprecated in a release post-3.0


* To obtain information about nodes in a Couchbase cluster, use the '/pools/default/buckets/default' URI.



## CLI tools and parameters

The following are tools that existed in previous versions but have been
deprecated and removed as of Couchbase Server 1.8:



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
`mbbackup-incremental`       | 1.7             | Deprecated in 1.8, replaced by `cbbackup-incremental`         
`mbbackup-merge-incremental` | 1.7             | Deprecated in 1.8, replaced by `cbbackup-merge-incremental`   
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


## Deprecated parameters

The following CLI parameter is deprecated.

Tool | Parameter | Description | Status 
---- | --------- | ----------- | ------ 
cbepctl | flush_param flushall_enabled | The `flushall_enabled` parameter is deprecated. | Deprecated in 2.5


### Unsupported CLI tools

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