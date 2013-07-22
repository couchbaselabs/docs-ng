# Storage Operations

<a id="table-couchbase-sdk_php_add"></a>

**API Call**                       | `$object->add($key, $value [, $expiry ] [, $persistto ] [, $replicateto ])`                                                 
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**                        | `scalar` ; supported values:                                                                                                
                                   | `COUCHBASE_E2BIG`                                                                                                           
                                   | `COUCHBASE_EINTERNAL`                                                                                                       
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `docid`                                                                                                                     
**Arguments**                      |                                                                                                                             
**string $key**                    | Document ID used to identify the value                                                                                      
**object $value**                  | Value to be stored                                                                                                          
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**$persistto**                     | Specify the number of nodes on which the document must be persisted to before returning.                                    
**$replicateto**                   | Specify the number of nodes on which the document must be replicated to before returning                                    
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="table-couchbase-sdk_php_replace"></a>

**API Call**                       | `$object->replace($key, $value [, $expiry ] [, $casunique ] [, $persistto ] [, $replicateto ])`                             
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Update an existing key with a new value                                                                                     
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

<a id="table-couchbase-sdk_php_set"></a>

**API Call**                       | `$object->set($key, $value [, $expiry ] [, $casunique ] [, $persistto ] [, $replicateto ])`                                                
-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                                         
**Description**                    | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**                        | `scalar` ; supported values:                                                                                                               
                                   | `COUCHBASE_E2BIG`                                                                                                                          
                                   | `COUCHBASE_ENOMEM`                                                                                                                         
                                   | `COUCHBASE_ETMPFAIL`                                                                                                                       
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

<a id="table-couchbase-sdk_php_setmulti"></a>

**API Call**                       | `$object->setMulti($kvarray [, $expiry ])`                                                                                  
-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                   | no                                                                                                                          
**Description**                    | Set multiple key/value items at once; updates supplied array for successful operation.                                      
**Returns**                        | `boolean` ; supported values:                                                                                               
                                   | `COUCHBASE_E2BIG`                                                                                                           
                                   | `COUCHBASE_ENOMEM`                                                                                                          
                                   | `COUCHBASE_ETMPFAIL`                                                                                                        
                                   | `COUCHBASE_NOT_MY_VBUCKET`                                                                                                  
                                   | `COUCHBASE_NOT_STORED`                                                                                                      
                                   | `COUCHBASE_SUCCESS`                                                                                                         
**Arguments**                      |                                                                                                                             
**array $kvarray**                 | List of key/value pairs                                                                                                     
                                   |                                                                                                                             
                                   |                                                                                                                             
                                   |                                                                                                                             
**$expiry**                        | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Errors**                         |                                                                                                                             
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                                                                              
`CouchbaseException`               | Base exception class for all Couchbase exceptions                                                                           
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                                                                              
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension                                                  
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                                                                              

<a id="api-reference-retrieve"></a>
