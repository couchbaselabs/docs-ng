
<a id="couchbase-admin-cmdline-cbcollect_info"></a>

# cbcollect_info tool

This is one of the most important diagnostic tools used by Couchbase technical
support teams; this command-line tool provides detailed statistics for a
specific node. The tool is at the following locations, depending upon your
platform:

<a id="table-couchbase-admin-cmdline-cbcollect_info-locs"></a>

Operating System | Location
-------------|------------------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin/cbcollect_info`                                                      
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbcollect_info`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbcollect_info`

**Be aware that this tool is a per-node operation.** If you want to perform this
operation for an entire cluster, you will need to perform the command for every
node that exists for that cluster.

You will need a root account to run this command and
collect all the server information needed. There are internal server files and
directories that this tool accesses which require root privileges.

To use this command, you remotely connect to the machine which contains your
Couchbase Server then issue the command with options. You typically run this
command under the direction of technical support at Couchbase and it will
generate a large.zip file. This archive will contain several different files
which contain performance statistics and extracts from server logs. The
following describes usage, where `output_file` is the name of the.zip file you
will create and send to Couchbase technical support:


```
cbcollect_info hostname:port output_file

Options:
  -h, --help  show this help message and exit
  -v          increase verbosity level
```

If you choose the verbosity option, `-v` debugging information for
`cbcollect_info` will be also output to your console. When you run
`cbcollect_info`, it will gather statistics from an individual node in the
cluster.

This command will collect information from an individual Couchbase Server node.
If you are experiencing problems with multiple nodes in a cluster, you may need
to run it on all nodes in a cluster.

The tool will create the following.log files in your named archive:

<a id="table-couchbase-admin-cmdline-cbcollect_info"></a>

**couchbase.log**          | OS-level information about a node.                                                                                                      
---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------
**ns\_server.couchdb.log** | Information about the persistence layer for a node.                                                                                     
**ns\_server.debug.log**   | Debug-level information for the cluster management component of this node.                                                              
**ns\_server.error.log**   | Error-level information for the cluster management component of this node.                                                              
**ns\_server.info.log**    | Info-level entries for the cluster management component of this node.                                                                   
**ns\_server.views.log**   | Includes information about indexing, time taken for indexing, queries which have been run, and other statistics about views.            
**stats.log**              | The results from multiple `cbstats` options run for the node. For more information, see [cbstats Tool](#couchbase-admin-cmdline-cbstats)

After you finish running the tool, you should upload the archive and send it to
Couchbase technical support:


```
> curl --upload-file file_name https://s3.amazonaws.com/customers.couchbase.com/company_name/
```

Where `file_name` is the name of your archive, and `company_name` is the name of
your organization. After you have uploaded the archive, please contact Couchbase
technical support. For more information, see [Working with Couchbase Customer
Support](http://www.couchbase.com/wiki/display/couchbase/Working+with+the+Couchbase+Technical+Support+Team).
