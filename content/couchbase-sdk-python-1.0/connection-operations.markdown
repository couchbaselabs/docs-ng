# Connection Operations

**Unhandled thing here**
<a id="table-couchbase-sdk_python_bucket_select"></a>

**API Call**     | `object.bucket_select(bucket)`       
-----------------|--------------------------------------
**Asynchronous** | no                                   
**Description**  | Select bucket                        
**Returns**      | `Boolean` ( Boolean (true/false) )   
**Arguments**    |                                      
**bucket**       | Bucket name used for storing objects.

<a id="table-couchbase-sdk_python_complete_onlineupdate"></a>

**API Call**     | `object.complete_onlineupdate()`  
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Stop onlineupdate                 
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_delete_vbucket"></a>

**API Call**       | `object.delete_vbucket(vbucket)`           
-------------------|--------------------------------------------
**Asynchronous**   | no                                         
**Description**    | Delete vbucket                             
**Returns**        | `Boolean` ( Boolean (true/false) )         
**Arguments**      |                                            
**String vbucket** | Name of the vBucket to be used for storage.

<a id="table-couchbase-sdk_python_get_vbucket_state"></a>

**API Call**       | `object.get_vbucket_state(vbucket)`        
-------------------|--------------------------------------------
**Asynchronous**   | no                                         
**Description**    | Get vbucket state                          
**Returns**        | `string` ( vBucket state )                 
**Arguments**      |                                            
**String vbucket** | Name of the vBucket to be used for storage.

<a id="table-couchbase-sdk_python_version"></a>

**API Call**     | `object.version()`                                    
-----------------|-------------------------------------------------------
**Asynchronous** | no                                                    
**Description**  | Returns the versions of all servers in the server pool
**Returns**      | `array` ; supported values:                           
                 | `array`                                               
**Arguments**    |                                                       
                 | None                                                  

<a id="table-couchbase-sdk_python_noop"></a>

**API Call**     | `object.noop()`                   
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Send a noop command               
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_sasl_auth_plain"></a>

**API Call**             | `object.sasl_auth_plain(sasl-user, sasl-password [, sasl-for-user ])`
-------------------------|----------------------------------------------------------------------
**Asynchronous**         | no                                                                   
**Description**          | Perform plain sasl auth                                              
**Returns**              | `Boolean` ( Boolean (true/false) )                                   
**Arguments**            |                                                                      
**String sasl-user**     | SASL authentication user                                             
**String sasl-password** | SASL authentication password                                         
**String sasl-for-user** | SASL token for user                                                  

<a id="table-couchbase-sdk_python_sasl_auth_start"></a>

**API Call**              | `object.sasl_auth_start(sasl-mechanism, sasl-data)`
--------------------------|----------------------------------------------------
**Asynchronous**          | no                                                 
**Description**           | Start a sasl auth session                          
**Returns**               | `Boolean` ( Boolean (true/false) )                 
**Arguments**             |                                                    
**String sasl-mechanism** | SASL authentication mechanism type                 
**String sasl-data**      | SASL token                                         

<a id="table-couchbase-sdk_python_sasl_mechanisms"></a>

**API Call**     | `object.sasl_mechanisms()`                    
-----------------|-----------------------------------------------
**Asynchronous** | no                                            
**Description**  | Get the supported SASL methods                
**Returns**      | `array` ( List of objects or key/value pairs )
**Arguments**    |                                               
                 | None                                          

<a id="table-couchbase-sdk_python_set_flush_param"></a>

**API Call**                 | `object.set_flush_param(flush-param-key, flush-param-value)`
-----------------------------|-------------------------------------------------------------
**Asynchronous**             | no                                                          
**Description**              | Set flush parameter                                         
**Returns**                  | `Boolean` ( Boolean (true/false) )                          
**Arguments**                |                                                             
**String flush-param-key**   | Flush parameter key                                         
**String flush-param-value** | Flush parameter value                                       

<a id="table-couchbase-sdk_python_set_tap_param"></a>

**API Call**         | `object.set_tap_param(tap-key, tap-value)`
---------------------|-------------------------------------------
**Asynchronous**     | no                                        
**Description**      | Set tap parameter                         
**Returns**          | `Boolean` ( Boolean (true/false) )        
**Arguments**        |                                           
**String tap-key**   | TAP parameter key                         
**String tap-value** | TAP parameter value                       

<a id="table-couchbase-sdk_python_set_vbucket_state"></a>

**API Call**             | `object.set_vbucket_state(vbucket, vbucket-state)`
-------------------------|---------------------------------------------------
**Asynchronous**         | no                                                
**Description**          | Set vbucket state                                 
**Returns**              | `Boolean` ( Boolean (true/false) )                
**Arguments**            |                                                   
**String vbucket**       | Name of the vBucket to be used for storage.       
**String vbucket-state** | State of the vBucket to be used for storage.      

<a id="table-couchbase-sdk_python_start_onlineupdate"></a>

**API Call**     | `object.start_onlineupdate()`     
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Start onlineupdate                
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_start_persistence"></a>

**API Call**     | `object.start_persistence()`      
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Start persistence                 
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_start_replication"></a>

**API Call**     | `object.start_replication()`      
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Start replication                 
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_stop_persistence"></a>

**API Call**     | `object.stop_persistence()`       
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Stop persistence                  
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="table-couchbase-sdk_python_stop_replication"></a>

**API Call**     | `object.stop_replication()`       
-----------------|-----------------------------------
**Asynchronous** | no                                
**Description**  | Stop replication                  
**Returns**      | `Boolean` ( Boolean (true/false) )
**Arguments**    |                                   
                 | None                              

<a id="couchbase-sdk-python-connection-done"></a>

## Done Method

The `done()` method closes all connections to the Couchbase server. This is a
crucial step as it forces the subprocesses to complete, otherwise they will not
end and your Python application may freeze. If you fail to issue the method
before the end of your script, you will likely have to kill the process using
operating system tools.

The `done()` function takes no arguments, returns nothing, and closes the given
connection:


```
couchbase.done()
```

<a id="couchbase-sdk-python-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Python. To browse or submit new issaues, see [Couchbase
Client Library Python Issues
Tracker](http://www.couchbase.com/issues/browse/PYCBC).

<a id="couchbase-sdk-python-rn_0-8-0"></a>

## Release Notes for Couchbase Client Library Python 0.8.0 Beta (1 September 2012)

**Known Issues in 0.8.0**

 * Exception is thrown on key not found errors with unified client.

    ```
    try:
     bucket.get("key_that_does_not_exist")
    except:
     #couchbase.exception.MemcachedError
    ```

 * "id" values from view rows must be converted to strings to be used with
   Memcached API.

    ```
    view = bucket.view("_design/beer/_view/by_name")
    for row in view:
     id = row["id"].__str__()
     beer = bucket.get(id)
     #do something
    ```

 * View queries on authenicated buckets are not currently supported.

<a id="couchbase-sdk-python-rn_0-7-1"></a>

## Release Notes for Couchbase Client Library Python 0.7.1 Beta (6 August 2012)

This is the latest release of the Couchbase Python SDK. It is written from the
ground up based on the Couchbase C library, libcouchbase.

This release is considered beta software, use it at your own risk; let us know
if you run into any problems, so we can fix them.

**New Features and Behaviour Changes in 0.7.1**

 * SDK now installable via python setup.py install from source or via pip install
   couchbase.

**Fixes in 0.7.1**

 * Temporarily removing unimplemented multi-get until full implementation
   available. This will be re-addressed in PYCBC-49 in a future release

   *Issues* : [PYCBC-49](http://www.couchbase.com/issues/browse/PYCBC-49),
   [PYCBC-49](http://www.couchbase.com/issues/browse/PYCBC-49)

<a id="couchbase-sdk-python-rn_0-7-0"></a>

## Release Notes for Couchbase Client Library Python 0.7.0 Beta (6 August 2012)

This is the latest release of the Couchbase Python SDK. It is written from the
ground up based on the Couchbase C library, libcouchbase.

This release is considered beta software, use it at your own risk; let us know
if you run into any problems, so we can fix them.

**New Features and Behaviour Changes in 0.7.0**

 * Introduced VBucketAwareClient which extends MemcachedClient with
   Membase/Couchbase specific features.

 * SDK now requires Python 2.6.

 * SDK can now handle server restarts/warmups. Can handle functioning Couchbase
   Server that is loading data from disk after restart.

**Fixes in 0.7.0**

 * Set() now works with integer values; fixes PYCBC-15.

   *Issues* : [PYCBC-15](http://www.couchbase.com/issues/browse/PYCBC-15)

 * Deprecated `get_view` as it was a duplicate of `view_results`.

 * Added memcached level `flush()` command to unify client with other SDKs. Please
   note this only works with 1.8.0 without changing settings. See the release notes
   for Couchbase 1.8.1 and 2.0.0 for how to enable memcached `flush().`

   This operation is deprecated as of the 1.8.1 Couchbase Server, to prevent
   accidental, detrimental data loss. Use of this operation should be done only
   with extreme caution, and most likely only for test databases as it will delete,
   item by item, every persisted record as well as destroy all cached data.

   Third-party client testing tools may perform a `flush_all()` operation as part
   of their test scripts. Be aware of the scripts run by your testing tools and
   avoid triggering these test cases/operations unless you are certain they are
   being performed on your sample/test database.

   Inadvertent use of `flush_all()` on production databases, or other data stores
   you intend to use will result in permanent loss of data. Moreover the operation
   as applied to a large data store will take many hours to remove persisted
   records.

 * Renamed VBucketAwareCouchbaseClient to CouchbaseClient.

 * Can now create memcached buckets

 * SDK can now created memcached buckets.

 * Greater than 50% of SDK covered by unittests; fixes PYCBC-46.

   *Issues* : [PYCBC-46](http://www.couchbase.com/issues/browse/PYCBC-46)

 * Better handling of topology changes; fixes PYCBC-4.

   *Issues* : [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4),
   [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4)

 * `init_cluster` function has been removed.

 * Globally, logging is no longer disabled; fixes PYCBC-31.

   *Issues* : [PYCBC-31](http://www.couchbase.com/issues/browse/PYCBC-31)

 * Set() now returns a proper status in the unified Couchbase() client 0.7.0.

 * Added Apache License headers to all files

 * Fixed.save() method; fixes MB-5609.

   *Issues* : [MB-5609](http://www.couchbase.com/issues/browse/MB-5609),
   [MB-5609](http://www.couchbase.com/issues/browse/MB-5609)

 * Deprecated Server() in favor of Couchbase() for the unified client name

 * SDK now working with mixed clusters, including clusters with memcached type
   buckets.

 * Deprecating getMulti for pep8-compliant multi-get.

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