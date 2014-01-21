
<a id="couchbase-admin-cmdline-cbbackup"></a>

# cbbackup tool

The `cbbackup` tool creates a copy of data from an entire running cluster, an
entire bucket, a single node, or a single bucket on a single functioning node.
Your node or cluster needs to be functioning in order to create the backup.
Couchbase Server will write a copy of data onto disk.

`cbbackup`, `cbrestore` and `cbtransfer` do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see [Using Hostnames with Couchbase
Server](../cb-install/#couchbase-getting-started-hostnames).

Depending upon your platform, this tool is the following directories:

<a id="table-couchbase-admin-cmdline-cbbackup-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbbackup`                                                      
-------------|------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbbackup`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbbackup`

The format of the `cbbackup` command is:


```
cbbackup [options] [source] [destination]
```

Where:

 * `[options]`

   Same options available for `cbtransfer`, see [cbtransfer
   Tool](#couchbase-admin-cmdline-cbtransfer)

 * `[source]`

   Source for the backup. This can be either a URL of a node when backing up a
   single node or the cluster, or a URL specifying a directory where the data for a
   single bucket is located.

 * `[destination]`

   The destination directory for the backup files to be stored. Either the
   directory must exist, and be empty, or the directory will be created. The parent
   directory must exist.

This tool has several different options which you can use to:

 * Backup all buckets in an entire cluster,

 * Backup one named bucket in a cluster,

 * Backup all buckets on a node in a cluster,

 * Backup one named buckets on a specified node,

All command options for `cbbackup` are the same options available for
`cbtransfer`. For a list of standard and special-use options, see [cbtransfer
Tool](#couchbase-admin-cmdline-cbtransfer).

You can backup an entire cluster, which includes all of the data buckets and
data at all nodes. This will also include all design documents; do note however
that you will need to rebuild any indexes after you restore the data. To backup
an entire cluster and all buckets for that cluster:


```
> cbbackup http://HOST:8091 ~/backups \
          -u Administrator -p password
```

Where `~/backups` is the directory where you want to store the data. When you
perform this operation, be aware that cbbackup will create the following
directory structure and files in the `~/backups` directory assuming you have two
buckets in your cluster named `my_name` and `sasl` and two nodes `N1` and `N2` :


```
~/backups
        bucket-my_name
            N1
            N2
        bucket-sasl
            N1
            N2
```

Where `bucket-my_name` and `bucket-sasl` are directories containing data files
and where `N1` and `N2` are two sets of data files for each node in the cluster.
To backup a single bucket in a cluster:


```
> cbbackup http://HOST:8091 /backups/backup-20120501 \
  -u Administrator -p password \
  -b default
```

In this case `-b default` specifies you want to backup data from the default
bucket in a cluster. You could also provide any other given bucket in the
cluster that you want to backup. To backup all the data stored in multiple
buckets from a single node which access the buckets:


```
> cbbackup http://HOST:8091 /backups/ \
  -u Administrator -p password \
  --single-node
```

This is an example of how to backup data from a single bucket on a single node
follows:


```
> cbbackup http://HOST:8091 /backups \
  -u Administrator -p password \
  --single-node \
  -b bucket_name
```

This example shows you how you can specify keys that are backed up using the `-
k` option. For example, to backup all keys from a bucket with the prefix
'object':


```
> cbbackup http://HOST:8091 /backups/backup-20120501 \
  -u Administrator -p password \
  -b bucket_name \
  -k '^object.*'
```

For more information on using `cbbackup` scenarios when you may want to use it
and best practices for backup and restore of data with Couchbase Server, see
[Backing Up Using cbbackup](../cb-admin/#couchbase-backup-restore-backup-cbbackup).

**Backing Up Design Documents Only**

You can backup only design documents from a cluster
or bucket with the option, `design_doc_only=1`. You can later restore the design
documents only with `cbrestore`, see [cbrestore
Tool](#couchbase-admin-cmdline-cbrestore) :


```
> ./cbbackup http://10.5.2.30:8091 ~/backup -x design_doc_only=1 -b bucket_name

transfer design doc only. bucket msgs will be skipped.
done
```

Where you provide the hostname and port for a node in the cluster. This will
make a backup copy of all design documents from `bucket_name` and store this as
`design.json` in the directory `~/backup/bucket_name`. If you do not provide a
named bucket it will backup design documents for all buckets in the cluster. In
this example we did a backup of two design documents on a node and our file will
appear as follows:


```
[
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fddoc1/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fddoc1/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "view1":{
                  "map":"function(doc){emit(doc.key,doc.key_num);}"
               },
               "view2":{
                  "map":"function(doc,meta){emit(meta.id,doc.key);}"
               }
            }
         },
         "meta":{
            "rev":"1-6f9bfe0a",
            "id":"_design/ddoc1"
         }
      }
   },
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fddoc2/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fddoc2/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "dothis":{
                  "map":"function (doc, meta) {\n  emit(meta.id, null);\n}"
               }
            }
         },
         "meta":{
            "rev":"1-4b533871",
            "id":"_design/ddoc2"
         }
      }
   },
   {
      "controllers":{
         "compact":"/pools/default/buckets/default/ddocs/_design%2Fdev_ddoc2/controller/compactView",
         "setUpdateMinChanges":"/pools/default/buckets/default/ddocs/_design%2Fdev_ddoc2/controller/setUpdateMinChanges"
      },
      "doc":{
         "json":{
            "views":{
               "dothat":{
                  "map":"function (doc, meta) {\n  emit(meta.id, null);\n}"
               }
            }
         },
         "meta":{
            "rev":"1-a8b6f59b",
            "id":"_design/dev_ddoc2"
         }
      }
   }
]
```

**Using cbbackup from Couchbase Server 2.0 with 1.8.x**

You can use `cbbackup` 2.x to backup data from a Couchbase 1.8.x cluster,
including 1.8. To do so you use the same command options you use when you backup
a 2.0 cluster except you provide it the hostname and port for the 1.8.x cluster.
You do not need to even install Couchbase Server 2.0 in order to use `cbbackup
2.x` to backup Couchbase Server 1.8.x. You can get a copy of the tool from the
[Couchbase command-line tools GitHub
repository](https://github.com/couchbase/couchbase-cli). After you get the tool,
go to the directory where you cloned the tool and perform the command. For
instance:


```
./cbbackup http://1.8_host_name:port ~/backup -u Administrator -p password
```

This creates a backup of all buckets in the 1.8 cluster at `~/backups` on the
physical machine where you run `cbbackup`. So if you want to make the backup on
the machine containing the 1.8.x data bucket, you should copy the tool on that
machine. As in the case where you perform backup with Couchbase 2.0, you can use
`cbbackup 2.0` options to backup all buckets in a cluster, backup a named
bucket, backup the default bucket, or backup the data buckets associated with a
single node.

Be aware that you can also use the `cbrestore 2.0` tool to restore backup data
onto a 1.8.x cluster. See [cbrestore Tool](#couchbase-admin-cmdline-cbrestore).
