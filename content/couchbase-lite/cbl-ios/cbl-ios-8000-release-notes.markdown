# Release Notes

## 1.0 Beta (September 2013)

This is the Beta release of Couchbase Lite iOS 1.0. Couchbase Lite is an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs. The 1.0 version features Native APIs, REST APIs, JSON support, and sync capability. The beta release is available to all community-edition customers.

### Features
* **Native API**—The native API enables you to manage your mobile database by using APIs optimized specifically for iOS.

* **REST APIs**—REST APIs provide an alternative access method based on your development needs.

* **JSON support**—JSON support provides a flexible data model designed for mobile object-oriented apps. Adapt to your application needs with immediacy and little impact.

* **Easy sync with Couchbase Sync Gateway**—Easy sync enables you to focus on application development, not syncing. You can be sync-ready with just a few lines of code.

### Fixes

None.

### Known Issues
* Indexing and querying for JSON
	* Working on a JavaScript equivalent of the CouchDB MapReduce sum() function, which adds up the numeric values of all arguments.
	
	* If a document value is updated to nil, or any value that the client is interested in, `CBLLiveQuery` does not notify observers that the document has changed.
	
	Issues: #75, #115

* Easy sync with Couchbase Sync Gateway
	* The revs list being sent from the client to the server can continually grow and  cause a performance impact.
	
	Issues: #118