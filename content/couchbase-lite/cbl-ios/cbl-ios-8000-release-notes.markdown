# Release Notes

## 1.0 Beta 3 (March 2014)

This is the third Beta release of Couchbase Lite iOS 1.0.

Couchbase Lite is an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs. The 1.0 version features native APIs, REST APIs, JSON support, and sync capability. The beta release is available to all community-edition customers.

### Features

The primary focus of this release is to continue adding performance enhancements, push API name changes to follow our spec, and introduce a few minor features, for example:

* Core Data adapter now available

* Persistent replication is no longer supporter

* CBLQuery improved with `.startKeyDocID` and `.endKeyDocID` now added (see [111](https://github.com/couchbase/couchbase-lite-ios/issues/111))

* CBLView improved with `_local_seq` property now added


### Fixes in Beta 3

* Document support
	* 'deleteDatabase' throws an unusual exception that it did not previously do before. Full description of the issue is available [here](https://groups.google.com/forum/#!msg/mobile-couchbase/gbDKLsnKk54/NvMliOZiF9EJ).

### Known Issues

A few of the issues noted in Beta 2 remain:

* Indexing and querying for JSON
	* Working on a JavaScript equivalent of the CouchDB MapReduce sum() function, which adds up the numeric values of all arguments.

	 Issues: [76](https://github.com/couchbase/couchbase-lite-ios/issues/76)

* Third-party Compatibility
	* Server header modification is required when attempting to use `_bulk_get` with a reverse proxy.
	
	Issues: [215](https://github.com/couchbase/couchbase-lite-ios/issues/215)

## 1.0 Beta 2 (December 2013)

This is the second Beta release of Couchbase Lite iOS 1.0. Couchbase Lite is an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs. The 1.0 version features native APIs, REST APIs, JSON support, and sync capability. The beta release is available to all community-edition customers.

### Features
* **Replication enhancements**—The replicator can now sync specific sets of documents, and pull replications can now optionally poll. Replications run on a separate background thread so they won't block the main thread or regular Couchbase Lite operations (except unavoidably while writing to the database).
* **Revision management enhancements**—Database compaction now prunes the oldest revisions after a document's revision history grows beyond a maximum length.
* **CBLModel enhancements**—CBLModel now supports all remaining scalar property types and custom object classes as properties.
* **Performance enhancements**—A number of performance enhancements were added, including tuning of the `CBLBatcher` class, incremental parsing of the `_changes` feed, and significant speeds to SQLite database access. 
* **API name changes**—API names changed to follow a language-neutral API spec in preparation to make development for other platforms simple and consistent.
* **Flexible concurrency**—Made concurrency more flexible by allowing Couchbase Lite to run on a dispatch queue and adding a way to call it from any thread.
* Support for 64-bit iOS apps.

### Fixes in Beta 2

* Indexing and Querying for JSON
	* The `CBLQueryRow` class equality test now compares sequence numbers if emitted values are nil or reflect no change.
	* During database compaction, excessively-deep revision trees have their oldest revisions removed entirely. The depth limit can be configured.
	
	Issues: [115](https://github.com/couchbase/couchbase-lite-ios/issues/115), [118](https://github.com/couchbase/couchbase-lite-ios/issues/118)
* Replication
	* The property `docs_id` is now supported.
	
	Issues: [102](https://github.com/couchbase/couchbase-lite-ios/issues/102)

### Known Issues
* API names in Beta 2
	* As mentioned in the Beta 2 feature list, we've made API changes to support a language-neutral spec. In Beta 2 the old method and property names are still available, but marked as deprecated. Xcode issues warnings for these, and the warning messages tell you what name to use instead.
	 
* Indexing and querying for JSON
	* Working on a JavaScript equivalent of the CouchDB MapReduce sum() function, which adds up the numeric values of all arguments.

	 Issues: [75](https://github.com/couchbase/couchbase-lite-ios/issues/75), [76](https://github.com/couchbase/couchbase-lite-ios/issues/76)
	
	* The querying parameter startkey_docid is not yet implemented.

	 Issues: [111](https://github.com/couchbase/couchbase-lite-ios/issues/111)
	
* Third-party Compatibility
	* We do not recommend using Couchbase Lite with the Dropbox Sync SDK at the same time in development.
	
	Issues: [199](https://github.com/couchbase/couchbase-lite-ios/issues/199)

	* Server header modification is required when attempting to use `_bulk_get` with a reverse proxy.
	
	Issues: [215](https://github.com/couchbase/couchbase-lite-ios/issues/215)

* Sync Gateway support
	* To share a cookie with an application, you need to set the path option in the cookie header with `Path=/`.
	
	Issues: [212](https://github.com/couchbase/couchbase-lite-ios/issues/212)

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
	
	Issues: [75](https://github.com/couchbase/couchbase-lite-ios/issues/75), [115](https://github.com/couchbase/couchbase-lite-ios/issues/115)

* Easy sync with Couchbase Sync Gateway
	* The revs list being sent from the client to the server can continually grow and  cause a performance impact.
	
	Issues: [118](https://github.com/couchbase/couchbase-lite-ios/issues/118)