# Update Operations

**Unhandled thing here**
<a id="table-couchbase-sdk_php_append"></a>

**API Call**                       | `$object->append($key, $value [, $expiry ] [, $casunique ] [, $persistto ] [, $replicateto ])`                              
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Append a value to an existing key                                                                                           
**Returns**                        | `scalar` ; supported values:                                                                                                
                                   | `COUCHBASE_E2BIG`                                                                                                           
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `docid`                                                                                                                     
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**object $value**                  | Value to be stored                                                                                                          
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**$casunique**                     | Unique value used to verify a key/value combination                                                                         
**$persistto**                     | Specify the number of nodes on which the document must be persisted to before returning.                                    
**$replicateto**                   | Specify the number of nodes on which the document must be replicated to before returning                                    
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_cas"></a>

**API Call**                       | `$object->cas($casunique, $key, $value [, $expiry ])`                                                                       
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**                        | `boolean` ; supported values:                                                                                               
                                   | `COUCHBASE_E2BIG`                                                                                                           
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_EEXISTS`                                                                                                     
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `COUCHBASE_SUCCESS`                                                                                                         
**Arguments**                      |                                                                                                                             
**$casunique**                     | Unique value used to verify a key/value combination                                                                         
**string $key**                    | Document ID used to identify the value                                                                                      
**object $value**                  | Value to be stored                                                                                                          
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_decrement"></a>

**API Call**                       | `$object->decrement($key, $offset)`                                                                                                                       
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                                                        
**Description**                    | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**                        | `scalar` ; supported values:                                                                                                                              
                                   | `COUCHBASE_DELTA_BADVAL`                                                                                                                                  
                                   | `COUCHBASE_E2BIG`                                                                                                                                         
                                   | `COUCHBASE_ENOMEM`                                                                                                                                        
                                   | `COUCHBASE_ETMPFAIL`                                                                                                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                                                
                                   | `COUCHBASE_NOT_STORED`                                                                                                                                    
                                   | `scalar`                                                                                                                                                  
**Arguments**                      |                                                                                                                                                           
**string $key**                    | Document ID used to identify the value                                                                                                                    
**$offset**                        | Integer offset value to increment/decrement (default 1)                                                                                                   
**Errors**                         |                                                                                                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                                                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                                                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                                                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                                                
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                                                            

<a id="table-couchbase-sdk_php_delete"></a>

**API Call**     | `$object->delete($key [, $casunique ])`            
-----------------|----------------------------------------------------
**Asynchronous** | no                                                 
**Description**  | Delete a key/value                                 
**Returns**      | `scalar` ; supported values:                       
                 | `COUCHBASE_ETMPFAIL`                               
                 | `COUCHBASE_KEY_ENOENT`                             
                 | `COUCHBASE_NOT_MY_VBUCKET`                         
                 | `COUCHBASE_NOT_STORED`                             
                 | `docid`                                            
**Arguments**    |                                                    
**string $key**  | Document ID used to identify the value             
**$casunique**   | Unique value used to verify a key/value combination

<a id="table-couchbase-sdk_php_increment"></a>

**API Call**                       | `$object->increment($key [, $offset ] [, $create ] [, $expiry ] [, $initial ])`                                                                                                                                                                                                                                                           
-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                                                                                                                                                                                                                                        
**Description**                    | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**                        | `scalar` ; supported values:                                                                                                                                                                                                                                                                                                              
                                   | `COUCHBASE_DELTA_BADVAL`                                                                                                                                                                                                                                                                                                                  
                                   | `COUCHBASE_E2BIG`                                                                                                                                                                                                                                                                                                                         
                                   | `COUCHBASE_ENOMEM`                                                                                                                                                                                                                                                                                                                        
                                   | `COUCHBASE_ETMPFAIL`                                                                                                                                                                                                                                                                                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                                                                                                                                                                                                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                                                                                                                                                                                                                                
                                   | `COUCHBASE_NOT_STORED`                                                                                                                                                                                                                                                                                                                    
                                   | `scalar`                                                                                                                                                                                                                                                                                                                                  
**Arguments**                      |                                                                                                                                                                                                                                                                                                                                           
**string $key**                    | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**$offset**                        | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**boolean $create**                | Create the document if it does not already exist                                                                                                                                                                                                                                                                                          
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                              
**boolean $initial**               | Initial value for the document                                                                                                                                                                                                                                                                                                            
**Errors**                         |                                                                                                                                                                                                                                                                                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                                                                                                                                                                                                                                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                                                                                                                                                                                                                                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                                                                                                                                                                                                                                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                                                                                                                                                                                                                                
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                                                                                                                                                                                                                                            

<a id="table-couchbase-sdk_php_prepend"></a>

**API Call**                       | `$object->prepend($key, $value [, $expiry ] [, $casunique ] [, $persistto ] [, $replicateto ])`                             
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Prepend a value to an existing key                                                                                          
**Returns**                        | `scalar` ; supported values:                                                                                                
                                   | `COUCHBASE_E2BIG`                                                                                                           
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `docid`                                                                                                                     
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**object $value**                  | Value to be stored                                                                                                          
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**$casunique**                     | Unique value used to verify a key/value combination                                                                         
**$persistto**                     | Specify the number of nodes on which the document must be persisted to before returning.                                    
**$replicateto**                   | Specify the number of nodes on which the document must be replicated to before returning                                    
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_appendbykey"></a>

**API Call**      | `$object->appendByKey($master_key, $key, $value [, $expiry ])`                                                              
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Append to a key on a specific server                                                                                        
**Returns**       | `scalar` ( Binary object )                                                                                                  
**Arguments**     |                                                                                                                             
**$master\_key**  | Master key used for consistent server references                                                                            
**string $key**   | Document ID used to identify the value                                                                                      
**object $value** | Value to be stored                                                                                                          
**$expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

<a id="table-couchbase-sdk_php_prependbykey"></a>

**API Call**      | `$object->prependByKey($master_key, $key, $value)`
------------------|---------------------------------------------------
**Asynchronous**  | no                                                
**Description**   | Prepend a value to a key on a specific server     
**Returns**       | `scalar` ( Binary object )                        
**Arguments**     |                                                   
**$master\_key**  | Master key used for consistent server references  
**string $key**   | Document ID used to identify the value            
**object $value** | Value to be stored                                

<a id="table-couchbase-sdk_php_replacebykey"></a>

**API Call**      | `$object->replaceByKey($master_key, $key, $value [, $expiry ])`                                                             
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Replace a value on a specific server                                                                                        
**Returns**       | `scalar` ( Binary object )                                                                                                  
**Arguments**     |                                                                                                                             
**$master\_key**  | Master key used for consistent server references                                                                            
**string $key**   | Document ID used to identify the value                                                                                      
**object $value** | Value to be stored                                                                                                          
**$expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

<a id="table-couchbase-sdk_php_deletebykey"></a>

**API Call**                       | `$object->deleteByKey($master_key, $key)`                                 
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Delete a key/value on a specific server                                   
**Returns**                        | `scalar` ; supported values:                                              
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `COUCHBASE_NOT_STORED`                                                    
                                   | `docid`                                                                   
**Arguments**                      |                                                                           
**$master\_key**                   | Master key used for consistent server references                          
**string $key**                    | Document ID used to identify the value                                    
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="table-couchbase-sdk_php_casbykey"></a>

**API Call**      | `$object->casByKey($casunique, $master_key, $key, $value [, $expiry ])`                                                     
------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**  | no                                                                                                                          
**Description**   | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**       | `scalar` ( Binary object )                                                                                                  
**Arguments**     |                                                                                                                             
**$casunique**    | Unique value used to verify a key/value combination                                                                         
**$master\_key**  | Master key used for consistent server references                                                                            
**string $key**   | Document ID used to identify the value                                                                                      
**object $value** | Value to be stored                                                                                                          
**$expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

<a id="table-couchbase-sdk_php_touch"></a>

**API Call**                       | `$object->touch($key, $expiry)`                                                                                             
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Update the expiry time of an item                                                                                           
**Returns**                        | `boolean` ; supported values:                                                                                               
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `COUCHBASE_SUCCESS`                                                                                                         
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="api-reference-stats"></a>
