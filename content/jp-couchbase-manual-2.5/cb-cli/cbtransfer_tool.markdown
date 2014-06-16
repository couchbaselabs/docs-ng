
<a id="couchbase-admin-cmdline-cbtransfer"></a>

# cbtransfer tool

You use this tool to transfer data and design documents between two clusters or
from a file to a cluster. With this tool you can also create a copy of data from
a node that no longer running. This tool is the underlying, generic data
transfer tool that `cbbackup` and `cbrestore` are built upon. It is a
lightweight extract-transform-load (ETL) tool that can move data from a source
to a destination. The source and destination parameters are similar to URLs or
file paths.

<div class="notebox">
<p>Note</p>
<p><code>cbbackup</code>, <code>cbrestore</code> and <code>cbtransfer</code> do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see <a href="../cb-install/#couchbase-getting-started-hostnames">Using Hostnames with Couchbase Server</a>.</p>
</div>

The tool is at the following locations:

<a id="table-couchbase-admin-cmdline-cbtransfer-locs"></a>

**Linux**    | `/opt/couchbase/bin/`                                                      
-------------|----------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/`

The following is the syntax and examples for this command:


```
> ./cbtransfer [options] source destination


Examples:
  cbtransfer http://SOURCE:8091 /backups/backup-42
  cbtransfer /backups/backup-42 http://DEST:8091
  cbtransfer /backups/backup-42 couchbase://DEST:8091
  cbtransfer http://SOURCE:8091 http://DEST:8091
  cbtransfer 1.8_COUCHBASE_BUCKET_MASTER_DB_SQLITE_FILE http://DEST:8091
  cbtransfer file.csv http://DEST:8091
```

The following are the standard command options which you can also view with
`cbtransfer -h` :

<a id="table-couchbase-admin-cbtranfer-options"></a>

-h, --help                                                       | Command help                                                                                                                                                                                                                 
-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--add                                                            | Use --add instead of --set in order to not overwrite existing items in the destination
-b BUCKET\_SOURCE                                                | Single named bucket from source cluster to transfer                                                                                                                                                                          
-B BUCKET\_DESTINATION, --bucket-destination=BUCKET\_DESTINATION | Single named bucket on destination cluster which receives transfer. This allows you to transfer to a bucket with a different name as your source bucket. If you do not provide defaults to the same name as the bucket-source
-i ID, --id=ID                                                   | Transfer only items that match a vbucketID                                                                                                                                                                                   
-k KEY, --key=KEY                                                | Transfer only items with keys that match a regexp                                                                                                                                                                            
-n, --dry-run                                                    | No actual transfer; just validate parameters, files, connectivity and configurations                                                                                                                                         
-u USERNAME, --username=USERNAME                                 | REST username for source cluster or server node                                                                                                                                                                              
-p PASSWORD, --password=PASSWORD                                 | REST password for cluster or server node                                                                                                                                                                                     
-t THREADS, --threads=THREADS                                    | Number of concurrent workers threads performing the transfer. Defaults to 4.                                                                                                                                                 
-v, --verbose                                                    | Verbose logging; provide more verbosity                                                                                                                                                                                      
-x EXTRA, --extra=EXTRA                                          | Provide extra, uncommon config parameters                                                                                                                                                                                    
--single-node                                                    | Transfer from a single server node in a source cluster. This single server node is a source node URL                                                                                                                         
--source-vbucket-state=SOURCE\_VBUCKET\_STATE                    | Only transfer from source vbuckets in this state, such as 'active' (default) or 'replica'. Must be used with Couchbase cluster as source.                                                                                    
--destination-vbucket-state=DESTINATION\_VBUCKET\_STATE          | Only transfer to destination vbuckets in this state, such as 'active' (default) or 'replica'. Must be used with Couchbase cluster as destination.                                                                            
--destination-operation=DESTINATION\_OPERATION                   | Perform this operation on transfer. "set" will override an existing document, 'add' will not override, 'get' will load all keys transferred from a source cluster into the caching layer at the destination.                 
`/path/to/filename`                                              | Export a.csv file from the server or import a.csv file to the server.                                                                                                                                                        

The following are extra, specialized command options you use in this form
`cbtransfer -x [EXTRA OPTIONS]` :

<a id="table-couchbase-admin-cbtranfer-special-options"></a>

batch\_max\_bytes=400000 | Transfer this \# of bytes per batch.                                                                                 
-------------------------|----------------------------------------------------------------------------------------------------------------------
batch\_max\_size=1000    | Transfer this \# of documents per batch                                                                              
cbb\_max\_mb=100000      | Split backup file on destination cluster if it exceeds MB                                                            
max\_retry=10            | Max number of sequential retries if transfer fails                                                                   
nmv\_retry=1             | 0 or 1, where 1 retries transfer after a NOT\_MY\_VBUCKET message. Default of 1.                                     
recv\_min\_bytes=4096    | Amount of bytes for every TCP/IP batch transferred                                                                   
report=5                 | Number batches transferred before updating progress bar in console                                                   
report\_full=2000        | Number batches transferred before emitting progress information in console                                           
try\_xwm=1               | As of 2.1, transfer documents with metadata. 1 is default. 0 should only be used if you transfer from 1.8.x to 1.8.x.
data\_only=0             | For value 1, only transfer data from a backup file or cluster.                                                       
design\_doc\_only=0      | For value 1, transfer design documents only from a backup file or cluster. Defaults to 0.                            

The most important way you can use this tool is to transfer data from a
Couchbase node that is no longer running to a cluster that is running:


```
./cbtransfer \
       couchstore-files://COUCHSTORE_BUCKET_DIR \
       couchbase://HOST:PORT \
       --bucket-destination=DESTINATION_BUCKET

./cbtransfer \
       couchstore-files:///opt/couchbase/var/lib/couchbase/data/default \
       couchbase://10.5.3.121:8091 \
       --bucket-destination=foo
```

Upon success, the tool will output as follows:


```
[####################] 100.0% (10000/10000 msgs)
bucket: bucket_name, msgs transferred...
      : total | last | per sec
batch : 1088 | 1088 | 554.8
byte : 5783385 | 5783385 | 3502156.4
msg : 10000 | 10000 | 5230.9
done
```

This shows we successfully transferred 10000 total documents in batch size of
1088 documents each. This next examples shows how you can send all the data from
a node to standard output:


```
> ./cbtransfer http://10.5.2.37:8091/ stdout:
```

Will produce a output as follows:


```
set pymc40 0 0 10
0000000000
set pymc16 0 0 10
0000000000
set pymc9 0 0 10
0000000000
set pymc53 0 0 10
0000000000
set pymc34 0 0 10
0000000000
```

Note Couchbase Server will store all data from a bucket, node or cluster, but
not the associated design documents. To do so, you should explicitly use
`cbbackup` to store the information and `cbrestore` to read it back into memory.

**Exporting and Importing CSV Files**

You can import and export well-formed.csv files with
`cbtransfer`. This will import data into Couchbase Server as documents and will
export documents from the server into comma-separated values. This does not
include any design documents associated with a bucket in the cluster.

For example imagine you have records as follows in the default bucket in a
cluster:


```
re-fdeea652a89ec3e9,
0,
0,
4271152681275955,
"{""key"":""re-fdeea652a89ec3e9"",
 ""key_num"":4112,
 ""name"":""fdee c3e"",
 ""email"":""fdee@ea.com"",
 ""city"":""a65"",
 ""country"":""2a"",
 ""realm"":""89"",
 ""coins"":650.06,
 ""category"":1,
 ""achievements"":[77, 149, 239, 37, 76],""body"":""xc4ca4238a0b923820d
 .......
""}"
......
```

Where `re-fdeea652a89ec3e9` is the document ID, 0 are flags, 0 is the expiration
and the CAS value is `4271152681275955`. The actual value in this example is the
hash starting with `"{""key""......`. To export these items to a.csv file
perform this command:


```
./cbtransfer http://[hostname]:[port] csv:./data.csv -b default -u Administrator -p password
```

Will transfer all items from the default bucket, `-b default` available at the
node `http://localhost:8091` and put the items into the `/data.csv` file. If you
provide another named bucket for the `-b` option, it will export items from that
named bucket. You will need to provide credentials for the cluster when you
export items from a bucket in the cluster. You will see output similar to that
in other `cbtransfer` scenarios:


```
[####################] 100.0% (10000/10000 msgs)
bucket: default, msgs transferred...
       : total | last | per sec
 batch : 1053 | 1053 | 550.8
 byte : 4783385 | 4783385 | 2502156.4
 msg : 10000 | 10000 | 5230.9
2013-05-08 23:26:45,107: mt warning: cannot save bucket design on a CSV destination
done
```

This shows we transferred 1053 batches of data at 550.8 batches per second. The
tool outputs "cannot save bucket design...." to indicate that no design
documents were exported. To import information from a.csv file to a named bucket
in a cluster:


```
./cbtransfer /data.csv http://[hostname]:[port] -B bucket_name -u Administrator -p password
```

If your.csv is not correctly formatted you will see the following error during
import:


```
w0 error: fails to read from csv file, .....
```

**Transferring Design Documents Only**

You can transfer design documents from one cluster to
another one with the option, `design_doc_only=1` :


```
> ./cbtransfer http://10.5.2.30:8091 http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_one -B bucket_two
transfer design doc only. bucket msgs will be skipped.
done
```

This will transfer all design documents associated with `bucket_one` to
`bucket_two` on the cluster with node `http://10.3.1.10:8091`. In Couchbase Web
Console you can see this updated design documents when you click on the View tab
and select `bucket_two` in the drop-down.
