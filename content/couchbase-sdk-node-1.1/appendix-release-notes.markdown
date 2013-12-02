# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Node.js Client Library. To browse or submit new issues, see [Couchbase
Node.js Client Library Issues
Tracker](http://www.couchbase.com/issues/browse/JSCBC).

<a id="couchbase-sdk-node-rn_1-1-0"></a>

## Release Notes for Couchbase Node.js Client Library 1.1.0 GA (5 November 2013)

**New Features and Behavior Changes in 1.1.0**

 * Various bug fixes.
 * Added support for replica reads.
 * Removed dependency on libcouchbase in favor of an embedded version to simplify
   installation and management complexity.

<a id="couchbase-sdk-node-rn_1-0-1"></a>

## Release Notes for Couchbase Node.js Client Library 1.0.1 GA (1 October 2013)

**New Features and Behavior Changes in 1.0.1**

 * Various bug fixes.
 * Added support for specifying hash keys.
 * Updated all tests to use the [Mocha](http://visionmedia.github.io/mocha/) testing framework.
 * Corrected issue with design document management functions.

<a id="couchbase-sdk-node-rn_1-0-0"></a>

## Release Notes for Couchbase Node.js Client Library 1.0.0 GA (12 September 2013)

**New Features and Behavior Changes in 1.0.0**

 * Various bug fixes.

**Known Issues in 1.0.0**

 * Durability requirements on storage operations might fail and could time out even
   though the durability requirements were successfully verified.

<a id="couchbase-sdk-node-rn_1-0-0-beta"></a>

## Release Notes for Couchbase Node.js Client Library 1.0.0 Beta (6 September 2013)

**New Features and Behavior Changes in 1.0.0-beta**

 * Implemented ability to specify durability requirements to all storage operations.
 * Fixed various minor bugs.

<a id="couchbase-sdk-node-rn_0-1-0"></a>

## Release Notes for Couchbase Node.js Client Library 0.1.0 GA (30 August 2013)

**New Features and Behavior Changes in 0.1.0**

 * Complete rewrite of the 0.0.x series of couchnode.
 * Brand new libcouchbase binding layer, which brings huge performance and stability 
   benefits.
 * Refactored user-facing API to be cleaner and easier to use.
