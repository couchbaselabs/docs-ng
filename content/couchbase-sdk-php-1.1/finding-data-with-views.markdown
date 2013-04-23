# Finding Data with Views

In Couchbase 2.0 you can index and query JSON documents using *views*. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to:

 * Find all the documents in your database that you need for a particular process,

 * Create a copy of data in a document and present it in a specific order,

 * Create an index to efficiently find documents by a particular value or by a
   particular structure in the document,

 * Represent relationships between documents, and

 * Perform calculations on data contained in documents.

For more information on views, see [Couchbase Developer Guide, Finding Data with
Views](http://www.couchbase.com/docs/couchbase-devguide-2.0/indexing-querying-data.html),
and [Couchbase Sever 2.0: Views and
Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

<a id="table-couchbase-sdk_php_view"></a>

**API Call**                       | `$object->view($ddocname [, $viewname ] [, $viewoptions ])`               
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Execute a view request                                                    
**Returns**                        | `array` ; supported values:                                               
                                   | `failure` : Array containing error information                            
                                   | `success` : Array of the requested view request results                   
**Arguments**                      |                                                                           
**$ddocname**                      | Design document name                                                      
**$viewname**                      | View name within a design document                                        
**array $viewoptions**             | View options                                                              
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="table-couchbase-sdk_php_viewgenquery"></a>

**API Call**           | `$object->viewGenQuery($ddocname [, $viewname ] [, $viewoptions ])`
-----------------------|--------------------------------------------------------------------
**Asynchronous**       | no                                                                 
**Description**        | Generate a view request, but do not execute the query              
**Returns**            | `scalar` ; supported values:                                       
                       | `object` : Generated view request                                  
**Arguments**          |                                                                    
**$ddocname**          | Design document name                                               
**$viewname**          | View name within a design document                                 
**array $viewoptions** | View options                                                       

<a id="table-couchbase-sdk_php_viewoptions"></a>

Option name      | Value type                                                                                                                               
-----------------|------------------------------------------------------------------------------------------------------------------------------------------
`descending`     | boolean; optional                                                                                                                        
`endkey`         | string; optional                                                                                                                         
`endkey_docid`   | string; optional                                                                                                                         
`full_set`       | boolean; optional                                                                                                                        
`group`          | boolean; optional                                                                                                                        
`group_level`    | numeric; optional                                                                                                                        
`inclusive_end`  | boolean; optional                                                                                                                        
`key`            | string; optional                                                                                                                         
`keys`           | array; optional                                                                                                                          
`limit`          | numeric; optional                                                                                                                        
`on_error`       | string; optional                                                                                                                         
                 | **Supported Values**                                                                                                                     
                 | `continue` : Continue to generate view information in the event of an error, including the error information in the view response stream.
                 | `stop` : Stop immediately when an error condition occurs. No further view information will be returned.                                  
`reduce`         | boolean; optional                                                                                                                        
`skip`           | numeric; optional                                                                                                                        
`stale`          | string; optional                                                                                                                         
                 | **Supported Values**                                                                                                                     
                 | `false` : Force a view update before returning data                                                                                      
                 | `ok` : Allow stale views                                                                                                                 
                 | `update_after` : Allow stale view, update view after it has been accessed                                                                
`startkey`       | string; optional                                                                                                                         
`startkey_docid` | string; optional                                                                                                                         

<a id="couchbase-sdk-php-rn"></a>

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
   Constants](couchbase-sdk-php-ready.html#api-reference-summary-errors).

   PHP Client also now catches and processes 'object too large' errors coming from
   underlying C library. For a complete list of errors, including this one, see
   [Error Codes and
   Constants](couchbase-sdk-php-ready.html#api-reference-summary-errors).

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