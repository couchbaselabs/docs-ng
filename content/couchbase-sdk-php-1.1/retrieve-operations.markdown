# Retrieve Operations

<a id="api-reference-retrieve-get"></a>

## Basic Get Operations

<a id="table-couchbase-sdk_php_get"></a>

**API Call**                       | `$object->get($key [, $callback ] [, $casunique ])`                       
-----------------------------------|---------------------------------------------------------------------------
**Asynchronous**                   | no                                                                        
**Description**                    | Get one or more key values                                                
**Returns**                        | `scalar` ; supported values:                                              
                                   | `COUCHBASE_KEY_ENOENT`                                                    
                                   | `object`                                                                  
**Arguments**                      |                                                                           
**string $key**                    | Document ID used to identify the value                                    
**mixed $callback**                | Callback function or method to be called                                  
**$casunique**                     | Unique value used to verify a key/value combination                       
**Errors**                         |                                                                           
`CouchbaseAuthenticationException` | Authentication to the Couchbase cluster failed                            
`CouchbaseException`               | Base exception class for all Couchbase exceptions                         
`CouchbaseIllegalKeyException`     | The key provided is not a legal key identifier                            
`CouchbaseLibcouchbaseException`   | An error occurred within the libcouchbase library used by th PHP extension
`CouchbaseServerException`         | An error occurred within the Couchbase cluster                            

The `$casunique` argument is a variable passed by reference in which the client
library will place the current CAS value for this document. Note that it must be
[passed by reference](http://php.net/manual/en/language.references.pass.php).
Sometimes this is referred to as an out variable.

<a id="table-couchbase-sdk_php_get-multi"></a>

**API Call**             | `$object->getMulti($keycollection [, $casarray ])`                                             
-------------------------|------------------------------------------------------------------------------------------------
**Asynchronous**         | no                                                                                             
**Description**          | Get one or more key values                                                                     
**Returns**              | `array` ( Array of key/value pairs for each document, or key/error condition for each failure )
**Arguments**            |                                                                                                
**array $keycollection** | One or more keys used to reference a value                                                     
**array $casarray**      | Array of unique values used to verify a key/value combination                                  

<a id="api-reference-retrieve-asyncget"></a>

## Asynchronous Get Operations

<a id="table-couchbase-sdk_php_get-delayed"></a>

**API Call**           | `$object->getDelayed($keyn [, $with_cas ] [, $callback ])`
-----------------------|-----------------------------------------------------------
**Asynchronous**       | yes                                                       
**Description**        | Get one or more key values                                
**Returns**            | `boolean` ; supported values:                             
                       | `COUCHBASE_KEY_ENOENT`                                    
                       | `COUCHBASE_SUCCESS`                                       
**Arguments**          |                                                           
**array $keyn**        | One or more keys used to reference a value                
**boolean $with\_cas** | Whether to return the CAS value for a document            
**mixed $callback**    | Callback function or method to be called                  

<a id="table-couchbase-sdk_php_fetch"></a>

**API Call**     | `$object->fetch($key [, $keyn ])`                                                
-----------------|----------------------------------------------------------------------------------
**Asynchronous** | yes                                                                              
**Description**  | Fetch the next delayed result set document                                       
**Returns**      | `array` ( An array of the next document retrieved, or NULL if no more documents )
**Arguments**    |                                                                                  
**string $key**  | Document ID used to identify the value                                           
**array $keyn**  | One or more keys used to reference a value                                       

<a id="table-couchbase-sdk_php_fetchall"></a>

**API Call**     | `$object->fetchAll($key [, $keyn ])`                                                       
-----------------|--------------------------------------------------------------------------------------------
**Asynchronous** | yes                                                                                        
**Description**  | Fetch all the delayed result set documents                                                 
**Returns**      | `array` ( An array of all the remaining documents retrieved, or NULL if no more documents )
**Arguments**    |                                                                                            
**string $key**  | Document ID used to identify the value                                                     
**array $keyn**  | One or more keys used to reference a value                                                 

<a id="api-reference-update"></a>
