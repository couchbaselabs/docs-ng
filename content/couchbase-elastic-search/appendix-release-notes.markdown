# Appendix: Release Notes

This appendix contains release notes for individual versions of Couchbase Plug-in for Elasticsearch.


<a id="elastic-relnotes-1.3.0"></a>
## Release Notes for Couchbase Plug-in for Elasticsearch 1.3.0 GA (April 2014)

This release is compatibility only with Elasticsearch 1.0.1.

This release is compatible with Couchbase Server 2.5.x, and it is backward compatible with earlier 2.x releases. 

* Support for new XDCR checkpointing protocol [CBES-26](https://www.couchbase.com/issues/browse/CBES-26).
* Fixed failure handling due to bounded queue with Elasticsearch 1.x [CBES-27](https://www.couchbase.com/issues/browse/CBES-27).


<a id="elastic-relnotes-1.2.0"></a>

## Release Notes for Couchbase Plug-in for Elasticsearch 1.2.0 GA (October 2013)

This release adds compatibility with Elasticsearch 0.90.5.

This release is compatible with Couchbase Server 2.2, and it is backward compatible with earlier 2.x releases.


<a id="elastic-relnotes-1.1.0"></a>

## Release Notes for Couchbase Plug-in for Elasticsearch 1.1.0 GA (August 2013)

This release adds compatibility with Elasticsearch 0.90.2.

<a id="elastic-relnotes-1.0.0"></a>

## Release Notes for Couchbase Plug-in for Elasticsearch 1.0.0 GA (February 2013)

This is the first general availability (GA) release. It contains the following
enhancements and bug fixes:

 * Now compatible with version 0.20.2 of Elasticsearch.

 * Now supports document expiration using Elasticsearch TTL.

 * Now supports XDCR conflict resolution to reduce bandwidth usage in some cases.

 * Fixed Couchbase index template to allow searching on the document metadata.

 * Fixed data corruption under high load
   [(CBES-11)](http://www.couchbase.com/issues/browse/CBES-11).

 * Fixed recognition of non-JSON documents
   [(CBES-11)](http://www.couchbase.com/issues/browse/CBES-11).

 * Improved log information when indexing stub documents.

<a id="elastic-relnotes-1.0.0-beta"></a>

## Release Notes for Couchbase Plug-in for Elasticsearch 1.0.0 Beta (February 2013)

This is the beta release of the plug-in.

<a id="licenses"></a>
