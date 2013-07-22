# Statistics Operations

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

<a id="php-api-reference-view"></a>
