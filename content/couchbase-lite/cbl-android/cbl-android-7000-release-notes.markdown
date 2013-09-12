# Release Notes

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

	Change Tracker is not using streaming JSON parser for parsing the changes feed for continuous replications.

	Issue: #97

* REST APIs

	Saving large documents with REST often returns an HTTP error 400 due to an incorrect check stop in a method. The method checks to see if there is data to be read in the InputStream, rather than checking whether the stream is empty. 

	Issue: #95

* Attachment support on device and in the cloud

	Updates to documents with attachments are resending attachments even when the attachment data hasn't been updated. This causes performance issues.

	Issue: #66


