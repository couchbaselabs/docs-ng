# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library PHP. To browse or submit new issues, see [Couchbase
Client Library PHP Issues Tracker](http://www.couchbase.com/issues/browse/PCBC).

<a id="couchbase-sdk-php-rn_1-0-5"></a>

## Release Notes for Couchbase Client Library PHP 1.0.5 GA (13 August 2012)

**New Features and Behaviour Changes in 1.0.5**

 * Allow for multiple hosts to be specified either via an array or a semicolon
   delimited list

   This feature will configure the client library to automatically select another
   node from the cluster if the first node specified is down.

**Fixes in 1.0.5**

 * PCBC-77: Do not attempt to decompress uncompressed JSON.

   This change allows for interoperability between the Java client library and the
   PHP client library, even though the flags may be slightly different between the
   two.

 * PCBC-75: Correctly free persistent structures.

   Prior to this change, in some cases the client could encounter a segmentation
   fault while trying to use persistent connections.

<a id="couchbase-sdk-php-rn_1-0-4"></a>

## Release Notes for Couchbase Client Library PHP 1.0.4 GA (7 June 2012)

This is a bugfix release of the Couchbase PHP SDK.

**Fixes in 1.0.4**

 * PCBC-65: Implement getResultMessage() and get\_result\_message()

 * PCBC-67: Add preserve\_order flag to getMulti()

 * PCBC-66: null terminate keys in getMulti() responses

<a id="couchbase-sdk-php-rn_1-0-3"></a>

## Release Notes for Couchbase Client Library PHP 1.0.3 GA (9 May 2012)

This is a bugfix release of the Couchbase PHP SDK.

**Fixes in 1.0.3**

 * Fix PCBC-61, compatibility with ext/memcached.

<a id="couchbase-sdk-php-rn_1-0-2"></a>

## Release Notes for Couchbase Client Library PHP 1.0.2 GA (20 April 2012)

This is a bugfix release of the Couchbase PHP SDK.

**Fixes in 1.0.2**

 * Fixed PCBC-62 (Extension reports wrong version).

 * Fixed PCBC-54 (Converting numbers in responses).

<a id="couchbase-sdk-php-rn_1-0-1"></a>

## Release Notes for Couchbase Client Library PHP 1.0.1 GA (5 March 2012)

This is a bugfix release of the Couchbase PHP SDK.

**Fixes in 1.0.1**

 * Fixed build on Windows.

 * Fixed argument parsing for ::increment().

<a id="couchbase-sdk-php-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library PHP 1.0.0 GA (1 March 2012)

This is the first stable release of the Couchbase PHP SDK.

**New Features and Behaviour Changes in 1.0.0**

 * Implemented PCBC-38 (Change connect() signature to take a URL).

**Fixes in 1.0.0**

 * Fixed tests, various segfaults and memory leaks.

 * Fixed naming of constants and features.

 * Renamed version() method and function to Couchbase::getVersion and
   couchbase\_get\_version() respectively.

 * Fixed PCBC-37 (Segfault when invalid hostname is provided).

 * Update compatibility with more recent libcouchbase releases.

 * Allow creation of non-existent keys with arithmetic calls.

<a id="licenses"></a>
