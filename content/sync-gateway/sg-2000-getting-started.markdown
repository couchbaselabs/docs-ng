# Getting Started With Sync Gateway

You can run Sync Gateway on the following operating systems:

* Mac OS X 10.6 or later with a 64-bit CPU

* Red Hat Linux

* Ubuntu Linux


## Installing Sync Gateway

You can download Sync Gateway for your platform from <http://www.couchbase.com/communities/couchbase-sync-gateway>.

The download contains an executable file called `sync_gateway` that you run as a command-line tool. For convenience, you can move it to a directory that is included in your $PATH environment variable.


## Connecting Sync Gateway to Couchbase Server

You can connect Sync Gateway to [Couchbase Server 2.0](http://www.couchbase.com/couchbase-server/overview) or later.

To connect Sync Gateway to Couchbase Server:

1. Open the Couchbase Server Admin Console and log on using your administrator credentials.
2. In the toolbar, click **Data Buckets**.
3. On the Data Buckets page, click **Create New Data Bucket** and create a bucket named `sync_gateway` in the default pool.

You can use any name you want for your bucket, but `sync_gateway ` is the default name that Sync Gateway uses if you do not specify a bucket name when you start Sync Gateway. If you use a different name for your bucket, you need to specify the `-bucket` option when you start Sync Gateway.


## Starting Sync Gateway

You start Sync Gateway by running `sync_gateway` with the  `-url` option. The argument for the `-url` option is the HTTP URL of the Couchbase server to which you want Sync Gateway to connect. If you do not include any additional command-line options, the default values are used. 

The following command starts Sync Gateway on port 4984, connects to the default bucket named  `sync_gateway` in the Couchbase Serving running on localhost, and starts the admin server on port 4985. 

```
$ ./sync_gateway -url http://localhost:8091
```

If you used a different name for the Couchbase Server bucket or want to listen on a different port, you need to include those parameters as command-line options. For information about the available command-line options, see [Administering Sync Gateway](#administering-sync-gateway).


## Stopping Sync Gateway

You can stop Sync Gateway by typing Control-C. There is no specific shutdown procedure and it is safe to stop it at any time.




