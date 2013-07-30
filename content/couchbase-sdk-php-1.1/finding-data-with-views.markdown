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
