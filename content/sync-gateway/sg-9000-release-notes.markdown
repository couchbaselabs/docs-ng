# Release Notes

## 1.0 Beta 3 (March 2014)
This is the third Beta release of Couchbase Sync Gateway 1.0.

Couchbase Sync Gateway is a ready-to-go, easy-to-scale sync layer that extends Couchbase Server to facilitate communication between Couchbase Server and your Couchbase Lite-backed apps. This version features syncing and basic admin features. 

The beta release is available to all community-edition customers. You can find the Couchbase Sync Gateway documentation on the web at <http://docs.couchbase.com/sync-gateway>.

### Features

We've made some major changes since Beta 2 to make Sync Gateway more performant, scalable, and co-exist better with Couchbase Server. Features introduced in Beta 3 include the following:

* **Bucket shadowing** We have designed a co-existence path with Couchbase Server web clients using a workflow dubbed "bucket shadowing". A Couchbase Server managed bucket and a Sync Gateway compatible bucket "shadow" each other.  The Couchbase Server bucket can continue to be managed using regular Couchbase Server APIs. Also, if you're already using Couchbase Server and want to make your existing data available to Couchbase Lite mobile clients, this is the recommended approach. More information can be found [here](https://github.com/couchbase/sync_gateway/wiki/Bucket-Shadowing).

* **New Configuration Properties** Properties have been added to increase flexibility for compression, maxinum number of open file descriptors allowed and support for **bucket shadowing**. They are as follows:
	* `compressResponses`: set this to `false` to disable GZip compression of HTTP responses, if your gateway is behind a proxy server that applies its own compression.
	* `maxFileDescriptors`: The maximum number of open file descriptors/sockets. The gateway calls `setrlimit` at startup time to request 5000 file descriptors, but if you need more (which is likely for heavily loaded servers) you can set this property to request a higher number.
	* `shadow`: Configures [bucket shadowing](https://github.com/couchbase/sync_gateway/wiki/Bucket-Shadowing).

* **Admin API Enhancements** We've added a number of Admin enhancements that include:
	* Inspection of document channel assignments and access grants. More detail available [here](https://github.com/couchbase/sync_gateway/wiki/Beta-3-Changes#admin-api).
	* You can see the database's current sync function by doing a `GET /db/_config`.
	* `GET /_expvar` will return a (large) JSON response containing a lot of internal statistics about the gateway. We use this internally for performance testing but it could be useful to you too. See the [expvars](https://github.com/couchbase/sync_gateway/wiki/expvars) page for details.

* **Performance Enhancements** We've added support to handle GZip-compressed HTTP requests and responses, WebSocket protocol for continuous `_changes` feed, and in-memory caching of recently requests document bodies as well as change history.


### Fixes in Beta 3

Some fixes to highlight in this release:

* Replication support
	* Fixed a bug that could cause the Sync Gateway to send a pull replicator the same changes over and over again, consuming CPU (on both sides) and network bandwidth. 

	Issues: [262](https://github.com/couchbase/sync_gateway/issues/262)

* Changes feed
	* Fixed a rare crash in the TruncateEncodedChangeLog function, probably triggered by lots of simultaneous writes to a channel. 

	Issues: [243](https://github.com/couchbase/sync_gateway/issues/243)
	
* Correctly assign document channels when importing existing docs from a Couchbase bucket or after changing the sync function.

### Known Issues

* `GET /db` no longer includes a `doc_count` property. It's quite expensive to count the number of documents in a Couchbase bucket. This URL gets accessed at the beginning of every replication, so the overhead of including `doc_count` was significant, even though it appears to be unused.


## 1.0 Beta 2 (December 2013)

This is the second Beta release of Couchbase Sync Gateway 1.0. 

Couchbase Sync Gateway is a ready-to-go, easy-to-scale sync layer that extends Couchbase Server to facilitate communication between Couchbase Server and your Couchbase Lite-backed apps. This version features syncing and basic admin features. 

The beta release is available to all community-edition customers. You can find the Couchbase Sync Gateway documentation on the web at <http://docs.couchbase.com/sync-gateway>.

### Features

The primary focus of the second Beta release for Sync Gateway has been performance enhancement, horizontal scaling, and increased stability.

### Fixes in Beta 2

Overall performance fixes to improve product usability.

### Known Issues
* Authentication
	* If your Persona login fails with a 405, make sure you have set the personaOrigin URL on the command line or in the config file.
	
	Issues: [71](https://github.com/couchbase/sync_gateway/issues/71)

	* We are actively working on a known Mac issue for Facebook and Persona support stemming from a build bug. For Mac developers looking to use these third-party services, developers can use [Couchbase Cloud] (http://www.couchbasecloud.com/index/) or build Sync Gateway using these [instructions](http://docs.couchbase.com/sync-gateway/#building-from-source) while we fix the Mac installer.
	
	Issues: [71](https://github.com/couchbase/sync_gateway/issues/71), [220](https://github.com/couchbase/sync_gateway/issues/220)

* Web Client Support
	* Web apps will have trouble making XHR requests to Sync Gateway due to browser security restrictions unless the HTML is hosted at the same public host/port.
	
	Issues: [115](https://github.com/couchbase/sync_gateway/issues/115)
	
* Attachment Support
	* We are actively working on an option to store attachments in third-party storage.
	
	Issues: [197](https://github.com/couchbase/sync_gateway/issues/197)
	
* Higher ulimit
	* The ulimit can be tuned at the developer's discretion.
	
	Issues: [218](https://github.com/couchbase/sync_gateway/issues/218)

* Installation
	* Installing from Beta 1 to Beta 2 on Ubuntu allows for older instance of Sync Gateway to run. A restart of Sync Gateway will rectify this problem.
	
	Issues: [232](https://github.com/couchbase/sync_gateway/issues/232)

* Rebalance support
	* If a Couchbase Server node is failed over and the cluster is not rebalanced to correct the situation, Sync Gateway will get errors on half the requests.
	
	Issues: [198](https://github.com/couchbase/sync_gateway/issues/198)

## 1.0 Beta (13 September 2013)

This is the Beta release of Couchbase Sync Gateway 1.0. 

Couchbase Sync Gateway is a ready-to-go, easy-to-scale sync layer that extends Couchbase Server to facilitate communication between Couchbase Server and your Couchbase Lite-backed apps. This version features syncing and basic admin features. 

The beta release is available to all community-edition customers. You can find the Couchbase Sync Gateway documentation on the web at <http://docs.couchbase.com/sync-gateway>.

### Features

* **Dynamic sync capabilities via Sync Function APIs**—Apps can begin to automatically sync data from the cloud without any manual setup by using Couchbase sync functions. 

* **Easy Administration**—Manage Sync Gateway via the Admin REST API when you need to.

* **Seamless scale-out**—Easily scale your Sync Gateway tier as your application needs grow.


### Fixes

None.

### Known Issues

We are currently working on performance tuning and are aware of issues when Sync Gateway is scaled. If you run into a performance issue, please let us know.