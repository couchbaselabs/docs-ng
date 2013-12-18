# Release Notes

## 1.0 Beta 2 (December 2013)

This is the second Beta release of Couchbase Sync Gateway 1.0. 

Couchbase Sync Gateway is a ready-to-go, easy-to-scale sync layer that extends Couchbase Server to facilitate communication between Couchbase Server and your Couchbase Lite-backed apps. This version features syncing and basic admin features. 

The beta release is available to all community-edition customers. You can find the Couchbase Sync Gateway documentation on the web at <http://docs.couchbase.com/sync-gateway>.

### Features

The primary focus of the second Beta release for Sync Gateway has been performance enhancement and increased stability.

### Fixes in Beta 2

Overall performance fixes to improve product usability.

### Known Issues
* Authentication
	* If your Persona login fails with a 405, make sure you have set the personaOrigin URL on the command line or in the config file.
	
	Issues: #71

* Web Client Support
	* Web-apps will have trouble making XHR requests to Sync Gateway due to browser security restrictions, unless the HTML is hosted at the same public host/port.
	
	Issues: #115
	
* Attachment Support
	* We are actively working on an option to store attachments in third party storage.
	
	Issues: #197
	
* Higher ulimit
	* The ulimit can be tuned at the developer's discretion.
	
	Issues: #218

* Installation
	* Installing from Beta 1 to Beta 2 on Ubuntu allows for older instance of Sync Gateway to run. A re-start of Sync Gateway will rectify this problem.
	
	Issues: #232

* Rebalance support
	* If a Couchbase Server node is failed-over and the cluster is not rebalanced to correct the situation, the Sync Gateway will get errors to half the requests.
	
	Issues: #198

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

We are currently working on performance-tuning and are aware of issues when Sync Gateway is scaled. If you run into a performance issue, please let us know.