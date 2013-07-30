# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library PHP. To browse or submit new issaues, see [Couchbase
Client Library PHP Issues Tracker](http://www.couchbase.com/issues/browse/PCBC).

<a id="couchbase-sdk-php-rn_1-1-0c"></a>

## Release Notes for Couchbase Client Library PHP 1.1.0 GA (12 December 2012)

This is the second release of the Couchbase PHP SDK which is compatible with
Couchbase Server 1.8 and Couchbase Server 2.0. It is intended to be compatible
with version 1.0 of the SDK. New features for this SDK include:

 * New functions for writing and accessing data using pessimistic locking, which
   are also known as *get-and-lock* functions.

 * Specify durability. You can now indicate how many replica nodes an item will be
   written to; you can also request a return value if Couchbase Server has
   successfully persisted an item to disk.

 * Indexing and querying. Ability to query a view and handle result sets returned
   by Couchbase Server.

To browse existing issues and fixes in this release, see [PHP SDK Issues
Tracking](http://www.couchbase.com/issues/browse/PCBC).

**New Features and Behaviour Changes in 1.1.0**

 * Warn for incorrect view parameters.

   *Issues* : PCBC-13

 * Add support for unlock command.

   *Issues* : PCBC-52

**Fixes in 1.1.0**

 * Completely document constants used as options and result codes for the PHP SDK.
   A list of constants and result codes are available at [Error Codes and
   Constants](#api-reference-summary-errors).

   PHP Client also now catches and processes 'object too large' errors coming from
   underlying C library. For a complete list of errors, including this one, see
   [Error Codes and Constants](#api-reference-summary-errors).

   *Issues* : PCBC-92

 * Depending on the platform you are using, you may also need to reference the JSON
   library in your PHP configuration file:

   If you are using the Couchbase PHP SDK on Red Hat/CentOS or their derivatives,
   be aware that JSON encoding for PHP is by default not available to other
   extensions. As a result you will receive an error resolving the
   php\_json\_encode symbol. The solution is to edit the php.ini file to load the
   JSON library and also load the Couchbase library. Please note that you should
   provide these two extensions in the order shown below:

    ```
    extension=/path/to/json.so
    extension=/path/to/couchbase.so
    ```

   *Issues* : PCBC-141

 * Improve method signature for `get()` : move the $cas\_token parameter to the
   second parameter, and improve handling of callback function provided as
   parameter.

   *Issues* : PCBC-73

 * Documentation incorrectly stated that version returns the version of the server;
   this in fact returns the version of the library. This has been fixed.

   *Issues* : PCBC-108

 * Provide tarball releases for PHP SDKs.

   *Issues* : PCBC-79

 * When doing a query against a view, the php application segfaulted. This is
   fixed.

   *Issues* : PCBC-147

**Known Issues in 1.1.0**

 * PHP SDK 1.1.0 is not yet available on Windows as a supported library. There is
   however an [experimental build of the PHP SDK
   1.1.0](http://www.couchbase.com/issues/browse/PCBC-146) which you can download
   and preview on a development system.

   *Issues* : PCBC-53

<a id="couchbase-sdk-php-rn_1-1-0b"></a>

## Release Notes for Couchbase Client Library PHP 1.1.0-dp2 Developer Preview (7 June 2012)

This is a preview release of the Couchbase PHP SDK with preliminary support for
Views and Couchbase Server 2.0. Version "-dp1" was a faulty release and is thus
not mentioned here.

This versions includes all fixes of the 1.0.x branch, up to the 1.0.4 release.

**New Features and Behaviour Changes in 1.1.0-dp2**

 * Implement Couchbase::View.

<a id="licenses"></a>
