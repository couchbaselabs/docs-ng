# Getting Started With Sync Gateway

Sync Gateway is compatible with the following operating systems:

* Mac OS X 10.6 or later and a 64-bit CPU

* RedHat Linux

* Ubuntu Linux


## Installing Sync Gateway
You can install Sync Gateway from a [precompiled build](#using-a-precompiled-build) or you can [build it from source](#building-from-source).


### Using a Precompiled Build

Download Sync Gateway for your platform:

|OS|URL|  
| ------	| ------	|  
|Mac OS X | <http://cbfs-ext.hq.couchbase.com/mobile/SyncGateway/SyncGateway-Mac.zip> 
|RedHat Linux |  
|Ubuntu Linux |  

The unzipped folder contains an executable file called `sync_gateway`. You can run it as you would any other command-line tool. For convenience, you can move it to a directory that is included in your $PATH environment variable.


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

[COUCHBASE_LITE]: https://github.com/couchbase/couchbase-lite-ios
[TOUCHDB]: https://github.com/couchbaselabs/TouchDB-iOS
[COUCHDB]: http://couchdb.apache.org
[COUCHDB_API]: http://wiki.apache.org/couchdb/Complete_HTTP_API_Reference
[COUCHBASE_SERVER]: http://www.couchbase.com/couchbase-server/overview
[WALRUS]: https://github.com/couchbaselabs/walrus
[HTTPIE]: http://httpie.org
[MAILING_LIST]: https://groups.google.com/forum/?fromgroups#!forum/mobile-couchbase
[ISSUE_TRACKER]: https://github.com/couchbaselabs/sync_gateway/issues?state=open
[MAC_STABLE_BUILD]: http://cbfs-ext.hq.couchbase.com/mobile/SyncGateway/SyncGateway-Mac.zip
[GO_PLATFORMS]: http://golang.org/doc/install#requirements




