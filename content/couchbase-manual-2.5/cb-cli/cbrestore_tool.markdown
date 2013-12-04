
<a id="couchbase-admin-cmdline-cbrestore"></a>

# cbrestore Tool

The `cbrestore` tool restores data from a file to an entire cluster or to a
single bucket in the cluster. Items that had been written to file on disk will
be restored to RAM.

`cbbackup`, `cbrestore` and `cbtransfer` do not communicate with external IP
addresses for server nodes outside of a cluster. They can only communicate with
nodes from a node list obtained within a cluster. You should perform backup,
restore, or transfer to data from a node within a Couchbase cluster. This also
means that if you install Couchbase Server with the default IP address, you
cannot use an external hostname to access it. For general information about
hostnames for the server, see [Using Hostnames with Couchbase
Server](#couchbase-getting-started-hostnames).

The tool is in the following locations, depending on your platform:

<a id="table-couchbase-admin-cmdline-cbrestore-locs"></a>

**Linux**    | `/opt/couchbase/bin/cbrestore`                                                      
-------------|-------------------------------------------------------------------------------------
**Windows**  | `C:\Program Files\Couchbase\Server\bin\cbrestore`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/cbrestore`

The format of the `cbrestore` command is:


```
cbrestore [options] [host:ip] [source] [destination]
```

Where:

 * `[options]`

   Command options for `cbrestore` are the same options for `cbtransfer`, see
   [cbtransfer Tool](#couchbase-admin-cmdline-cbtransfer).

 * `[host:ip]`

   Hostname and port for a node in cluster.

 * `[source]`

   Source bucket name for the backup data. This is in the directory created by
   `cbbackup` when you performed the backup.

 * `[destination]`

   The destination bucket for the restored information. This is a bucket in an
   existing cluster. If you restore the data to a single node in a cluster, provide
   the hostname and port for the node you want to restore to. If you restore an
   entire data bucket, provide the URL of one of the nodes within the cluster.

All command options for `cbrestore` are the same options available for
`cbtransfer`. For a list of standard and special-use options, see [cbtransfer
Tool](#couchbase-admin-cmdline-cbtransfer).

**Using cbrestore for Design Documents Only**

You can restore design documents to a server node
with the option, `design_doc_only=1`. You can restore from a backup file you
create with `cbbackup`, see [cbbackup Tool](#couchbase-admin-cmdline-cbbackup) :


```
> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b a_bucket -B my_bucket

transfer design doc only. bucket msgs will be skipped.
done
```

This will restore design documents from the backup file `~/backup/a_bucket` to
the destination bucket `my_bucket` in a cluster. If you backed up more than one
source bucket, you will need to perform this command more than once. For
instance, imagine you did a backup for a cluster with two data buckets and have
the backup files `~/backup/bucket_one/design.json` and
`~/backup/bucket_two/design.json` :


```
> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_one -B my_bucket

> ./cbrestore ~/backup http://10.3.1.10:8091 -x design_doc_only=1 -b bucket_two -B my_bucket
```

This will restore design documents in both backup files to a bucket in your
cluster named `my_bucket` After you restore the design documents you can see
them in Couchbase Web Console under the Views tab. For more information about
the Views Editor, see [Using the Views Editor](#couchbase-views-editor).

**Using cbrestore from Couchbase Server 2.0 with 1.8.x**

You can use `cbrestore` 2.0 to backup data from a Couchbase 1.8.x cluster,
including 1.8. To do so you use the same command options you use when you backup
a 2.0 cluster except you provide it the hostname and port for the 1.8.x cluster.
You do not need to even install Couchbase Server 2.0 in order to use `cbrestore`
2.0 to backup Couchbase Server 1.8.x. You can get a copy of the tool from the
[Couchbase command-line tools GitHub
repository](https://github.com/couchbase/couchbase-cli). After you get the tool,
go to the directory where you cloned the tool and perform the command. For
instance:


```
./cbrestore ~/backup http://10.3.3.11:8091 -u Administrator -p password -B saslbucket_destination -b saslbucket_source
```

This restores all data in the `bucket-saslbucket_source` directory under
`~/backups` on the physical machine where you run `cbbackup`. It will restore
this data into a bucket named `saslbucket_destination` in the cluster with the
node host:port of `10.3.3.11:8091`.

Be aware that if you are trying to restore data to a different cluster, that you
should make sure that cluster should have the same number of vBuckets as the
cluster that you backed up. If you attempt to restore data from a cluster to a
cluster with a different number of vBuckets, it will fail when you use the
default port of `8091`. The default number of vBuckets for Couchbase 2.0 is
1024; in earlier versions of Couchbase, you may have a different number of
vBuckets. If you do want to restore data to a cluster with a different number of
vBuckets, you should perform this command with port `11211`, which will
accommodate the difference in vBuckets:


```
cbrestore /backups/backup-42 memcached://HOST:11211 \
    --bucket-source=sessions --bucket-destination=sessions2
```

If you want more information about using `cbbackup` 2.0 tool to backup data onto
a 1.8.x cluster. See [cbbackup Tool](#couchbase-admin-cmdline-cbbackup).

For general information on using `cbbackup`, see [Restoring using cbrestore
tool](#couchbase-backup-restore-cbrestore).
