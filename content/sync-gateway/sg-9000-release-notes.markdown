# Release Notes

## 1.0 Beta 3 (March 2014)
This is the third Beta release of Couchbase Sync Gateway 1.0.

Couchbase Sync Gateway is a ready-to-go, easy-to-scale sync layer that extends Couchbase Server to facilitate communication between Couchbase Server and your Couchbase Lite-backed apps. This version features syncing and basic admin features. 

The beta release is available to all community-edition customers. You can find the Couchbase Sync Gateway documentation on the web at <http://docs.couchbase.com/sync-gateway>.

### Features

We've made some major changes since Beta 2 to make Sync Gateway more performant, scalable, and co-exist better with Couchbase Server. Features introduced in Beta 3 include the following:

* **Bucket Shadowing** We have designed a co-existence path with Couchbase Server 2.5 and above using a workflow we've dubbed "Bucket Shadowing". A Couchbase Server managed bucket and a Sync Gateway compatible bucket shadow each other. More information can be found [here](https://github.com/couchbase/sync_gateway/wiki/Bucket-Shadowing).
* **New Configuration Properties** Properties have been added to increase flexibility for compression, maxinum number of open file descriptors allowed and support for **Bucket Shadowing**.
* **Admin API Enhancements** We've added more feedback for Admin API requests, the ability to check a database's correlating Sync Function, and a feature to check internal statistics that we've used ourselves for performance testing.
* **Performance Enhancements** We've added support to handle GZip-compressed HTTP requests and responses, WebSocket protocol for continuous `_changes` feed, and in-memory caching of recently requests document bodies as well as change history.

### Fixes in Beta 3

A majority of noted issues found in Beta 2 have been fixed, but we also have made fixes for the following:

* Replication support
	* Fixed a bug that could cause the Sync Gateway to send a pull replicator the same changes over and over again, consuming CPU (on both sides) and network bandwidth. 

	Issues: [262](https://github.com/couchbase/sync_gateway/issues/262)

* Changes feed
	* Fixed a rare crash in the TruncateEncodedChangeLog function, probably triggered by lots of simultaneous writes to a channel. 

	Issues: [243](https://github.com/couchbase/sync_gateway/issues/243)
	
* Correctly assign document channels when importing existing docs from a Couchbase bucket or after changing the sync function.

### Known Issues

A few of the issues noted in Beta 2 remain:

* Web Client Support
	* Web apps will have trouble making XHR requests to Sync Gateway due to browser security restrictions unless the HTML is hosted at the same public host/port.
	
	Issues: [115](https://github.com/couchbase/sync_gateway/issues/115)
	
* Attachment Support
	* We are actively working on an option to store attachments in third-party storage.
	
	Issues: [197](https://github.com/couchbase/sync_gateway/issues/197)

* Authentication
	* If your Persona login fails with a 405, make sure you have set the personaOrigin URL on the command line or in the config file.
	
	Issues: [71](https://github.com/couchbase/sync_gateway/issues/71)


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