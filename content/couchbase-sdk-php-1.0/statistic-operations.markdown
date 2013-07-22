# Statistic Operations

<a id="table-couchbase-sdk_php_getstats"></a>

**API Call**                       | `$object->getStats()`                                                     
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Get the database statistics                                               
**Returns**                        | `array` ; supported values:                                               
                                   | `COUCHBASE_EINTERNAL`                                                     
                                   | `COUCHBASE_ERROR`                                                         
                                   | `array`                                                                   
**Arguments**                      |                                                                           
                                   | None                                                                      
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="couchbase-sdk-php-rn"></a>

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

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.