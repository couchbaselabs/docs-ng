# Release Notes

## 1.0 Beta 2 (January 2014)

This is the second Beta release of Couchbase Lite Android 1.0. Couchbase Lite is an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs. The 1.0 version features native APIs, REST APIs, JSON support, and sync capability. The beta release is available to all community-edition customers.

### Features
* **Native API Parity with iOS**—The 1.0 feature set available on iOS is now available as native Java APIs on Android as well. Formal documentation of the Java API set is available [here](http://www.couchbase.com/autodocs/couchbase-lite-android-latest/annotated.html).

### Fixes in Beta 2

* Minimum Android API level support
	* We now support Gingerbread (API level 9) and above
	Issues: [115](https://github.com/couchbase/couchbase-lite-android/issues/115)

* Attachment support
	* Attachment retrieval has been fixed
	* Delete attachment via REST APIs now available
	
	Issues: [134](https://github.com/couchbase/couchbase-lite-android/issues/134), [152](https://github.com/couchbase/couchbase-lite-android/issues/152)

* Database support
	* Invalid name databases throws correct status code
	* A local or remotely replicated document update is now updated in the database document cache and does so by document ID
	
	Issues: [146](https://github.com/couchbase/couchbase-lite-android/issues/146), [164](https://github.com/couchbase/couchbase-lite-android/issues/164) 

* Document support
	* `_all_docs` keys parameter now supported
	* Setting missing property now fixed
	
	Issues: [147](https://github.com/couchbase/couchbase-lite-android/issues/147), [155](https://github.com/couchbase/couchbase-lite-android/issues/155)

### Known Issues
* Performance
	* There are known performance issues that we are looking to fix before general release. These performance issues include slowness in replication and in view creation.
	
	 Issues: [123](https://github.com/couchbase/couchbase-lite-android/issues/123), [125](https://github.com/couchbase/couchbase-lite-android/issues/125), [126](https://github.com/couchbase/couchbase-lite-android/issues/126)

* Document support
	* `_bulk_docs` does not include document deletions as part of push replication to target databases causing conflicting revision trees

	Issues: [174](https://github.com/couchbase/couchbase-lite-android/issues/174)

## 1.0 Beta (13 September 2013)

This is the Beta release of Couchbase Lite Android 1.0. 

Couchbase Lite is an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs. This version features REST APIs, JSON support, and sync capability. 

The beta release is available to all community-edition customers.

### Features

* **REST APIs**—REST APIs provide an alternative access method based on your development needs.

* **JSON support**—Use a flexible data model designed for mobile object-oriented apps. Adapt to your application needs with immediacy and little impact.

* **Easy sync with Couchbase Sync Gateway**—Get sync-ready with just a few lines of code. Focus on application development, not syncing.

* **Peer-to-peer support via REST APIs**—Communicate with nearby devices, even offline, with our REST API-enabled P2P support.

### Fixes

None.

### Known Issues

* Changes Feed

	* Change Tracker is not using streaming JSON parser for parsing the changes feed for continuous replications.

	Issue: [97](https://github.com/couchbase/couchbase-lite-android/issues/97)

* Document support

	* Saving large documents with REST often returns an HTTP error 400 due to an incorrect check stop in a method. The method checks to see if there is data to be read in the InputStream, rather than checking whether the stream is empty. 
	* Occassional error 400 outputted when attempting to do a PUT

	Issue: [95](https://github.com/couchbase/couchbase-lite-android/issues/95), [99](https://github.com/couchbase/couchbase-lite-android/issues/99)

* Attachment support

	* Updates to documents with attachments are resending attachments even when the attachment data hasn't been updated. This causes performance issues.

	Issue: [66](https://github.com/couchbase/couchbase-lite-android/issues/66)