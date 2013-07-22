# Update Operations

<a id="api-reference-update-preappend"></a>

## Append and Prepend Operations

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

<a id="api-reference-update-cas"></a>

## CAS And Locking Operations

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

<a id="table-couchbase-sdk_php_getandlock"></a>

**API Call**                       | `$object->getAndLock($key [, $casarray ] [, $getl-expiry ])`              
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Get the value for a key, lock the key from changes                        
**Returns**                        | `scalar` ; supported values:                                              
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `object`                                                                  
**Arguments**                      |                                                                           
**string $key**                    | Document ID used to identify the value                                    
**array $casarray**                | Array of unique values used to verify a key/value combination             
**$getl-expiry**                   | Expiry time for lock                                                      
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="table-couchbase-sdk_php_getandlock-multi"></a>

**API Call**                       | `$object->getAndLockMulti($keycollection [, $casarray ] [, $getl-expiry ])`                    
-----------------------------------|------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                             
**Description**                    | Get the value for a key, lock the key from changes                                             
**Returns**                        | `array` ( Array of key/value pairs for each document, or key/error condition for each failure )
**Arguments**                      |                                                                                                
**array $keycollection**           | One or more keys used to reference a value                                                     
**array $casarray**                | Array of unique values used to verify a key/value combination                                  
**$getl-expiry**                   | Expiry time for lock                                                                           
**Errors**                         |                                                                                                
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                 
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                              
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                 
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                     
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                 

<a id="table-couchbase-sdk_php_unlock"></a>

**API Call**                       | `$object->unlock($key, $casunique)`                                                                      
-----------------------------------|----------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                       
**Description**                    | Unlock a previously locked key by providing the corresponding CAS value that was returned during the lock
**Returns**                        | `boolean` ; supported values:                                                                            
                                   | `COUCHBASE_KEY_ENOENT`                                                                                   
                                   | `COUCHBASE_SUCCESS`                                                                                      
**Arguments**                      |                                                                                                          
**string $key**                    | Document ID used to identify the value                                                                   
**$casunique**                     | Unique value used to verify a key/value combination                                                      
**Errors**                         |                                                                                                          
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                           
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                        
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                           
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                               
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                           

<a id="api-reference-update-incrdecr"></a>

## Increment and Decrement Operations

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

Couchbase Server stores numbers as unsigned numbers, therefore if you try to
increment an existing negative number, it will cause an integer overflow and
return a non-logical numeric result. If a key does not exist, this method will
initialize it with the zero or a specified value.

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

<a id="api-reference-update-touch"></a>

## Touch Operations

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

<a id="table-couchbase-sdk_php_touch-multi"></a>

**API Call**                       | `$object->touchMulti($keyarray, $expiry)`                                                                                   
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Change the expiration time for multiple documents                                                                           
**Returns**                        | `boolean` ; supported values:                                                                                               
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_SUCCESS`                                                                                                         
**Arguments**                      |                                                                                                                             
**$keyarray**                      | Array of keys used to reference one or more values.                                                                         
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_getandtouch"></a>

**API Call**                       | `$object->getAndTouch($key, $expiry)`                                                                                       
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Get a value and update the expiration time for a given key                                                                  
**Returns**                        | `scalar` ; supported values:                                                                                                
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_KEY_ENOENT`                                                                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `object`                                                                                                                    
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_getandtouch-multi"></a>

**API Call**                       | `$object->getAndTouchMulti($key, $expiry)`                                                                                  
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Get a value and update the expiration time for a given key                                                                  
**Returns**                        | `array` ( Array of key/value pairs for each document, or key/error condition for each failure )                             
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="api-reference-update-durability"></a>

## Observing Document Durability

<a id="table-couchbase-sdk_php_observe"></a>

**API Call**                       | `$object->observe($key, $casunique, $observedetails)`                     
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Get the durability of a document                                          
**Returns**                        | `boolean` ; supported values:                                             
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `COUCHBASE_SUCCESS`                                                       
**Arguments**                      |                                                                           
**string $key**                    | Document ID used to identify the value                                    
**$casunique**                     | Unique value used to verify a key/value combination                       
**array $observedetails**          | List of returned observe details                                          
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="table-couchbase-sdk_php_observemulti"></a>

**API Call**                       | `$object->observeMulti($keycollection, $observedetails)`                  
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Get the durability of a document                                          
**Returns**                        | `scalar` ; supported values:                                              
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `array`                                                                   
**Arguments**                      |                                                                           
**array $keycollection**           | One or more keys used to reference a value                                
**array $observedetails**          | List of returned observe details                                          
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

The durability functions enable you to specify the durability parameters of one
or more keys. The values should be specified as an associative array of the
following values:

Name           | Description                                             
---------------|---------------------------------------------------------
`persist_to`   | The number of nodes the document should be persisted to 
`replicate_to` | The number of nodes the document should be replicated to
`timeout`      | The max time in milliseconds to wait for durability     
`interval`     | The interval between each poll request                  

<a id="table-couchbase-sdk_php_keydurability"></a>

**API Call**                       | `$object->keyDurability($key, $casunique, $durability)`                   
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Wait until the durability of a document has been reached                  
**Returns**                        | `boolean` ; supported values:                                             
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `COUCHBASE_SUCCESS`                                                       
**Arguments**                      |                                                                           
**string $key**                    | Document ID used to identify the value                                    
**$casunique**                     | Unique value used to verify a key/value combination                       
**array $durability**              | List of required durability values                                        
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="table-couchbase-sdk_php_keydurabilitymulti"></a>

**API Call**                       | `$object->keyDurabilityMulti($keycollection, $durability)`                
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Wait until the durability of a document has been reached                  
**Returns**                        | `scalar` ; supported values:                                              
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `array`                                                                   
**Arguments**                      |                                                                           
**array $keycollection**           | One or more keys used to reference a value                                
**array $durability**              | List of required durability values                                        
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="api-reference-update-delete"></a>

## Delete Operations

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

<a id="api-reference-update-flush"></a>

## Flush Operation

<a id="table-couchbase-sdk_php_flush"></a>

**API Call**                       | `$object->flush()`                                                        
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Deletes all values from the corresponding bucket                          
**Returns**                        | `boolean` ; supported values:                                             
                                   | `COUCHBASE_ETMPFAIL`                                                      
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                
                                   | `COUCHBASE_SUCCESS`                                                       
**Arguments**                      |                                                                           
                                   | None                                                                      
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

<a id="api-reference-stats"></a>
