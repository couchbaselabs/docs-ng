# C Function Summary

`libcouchbase` provides a well defined API for accessing the data stored in a
Couchbase cluster. A summary of the supported methods are listed in **Couldn't
resolve xref tag: table-couchbase-sdk-c-summary**.

<a id="table-couchbase-sdk_c_lcb_arithmetic"></a>

**API Call**            | `lcb_arithmetic (lcb_t instance, const void* cookie, const void* key, size_t nkey, int64_t delta, time_t exptime, bool create, uint64_t initial)`                               
------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                              
**Description**         | Spool an arithmetic operation to the cluster. The operation may be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).
**Returns**             | `lcb_error_t` ( lcb instance )                                                                                                                                                  
**Arguments**           |                                                                                                                                                                                 
**lcb\_t instance**     | The handle to the couchbase instance.                                                                                                                                           
**const void\* cookie** | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                   
**const void\* key**    | An identifier in the database                                                                                                                                                   
**size\_t nkey**        | Number of bytes in the key                                                                                                                                                      
**int64\_t delta**      | The delta to increment/decrement                                                                                                                                                
**time\_t exptime**     | The expiry time for the object. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                         
**bool create**         | Should the key be created if it does not exist?                                                                                                                                 
**uint64\_t initial**   | The initial value for the key if created                                                                                                                                        
**Errors**              |                                                                                                                                                                                 
`LCB_ETMPFAIL`          | No vbucket configuration available                                                                                                                                              
`LCB_SUCCESS`           | Command successfully scheduled                                                                                                                                                  

<a id="table-couchbase-sdk_c_lcb_arithmetic_by_key"></a>

**API Call**             | `lcb_arithmetic_by_key (lcb_t instance, const void* cookie, const void* hashkey, size_t nhashkey, const void* key, size_t nkey, int64_t delta, time_t exptime, bool create, uint64_t initial)`                                                                                                                                                                 
-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**         | no                                                                                                                                                                                                                                                                                                                                                             
**Description**          | Spool an arithmetic operation to the cluster, but use another key to locate the server. The operation may be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).                                                                                                                                     
**Returns**              | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                 
**Arguments**            |                                                                                                                                                                                                                                                                                                                                                                
**lcb\_t instance**      | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                          
**const void\* cookie**  | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                  
**const void\* hashkey** | This alternate hashkey allows a client application to group a set of unique keys together to a given server though the keys themselves may be unique. For example, you may wish to use the hashkey "user" for the two data keys "user:name" and "user:birthdate". Note that not all clients support this option so it may not be interoperable between clients.
**size\_t nhashkey**     | The number of bytes in the alternative key                                                                                                                                                                                                                                                                                                                     
**const void\* key**     | An identifier in the database                                                                                                                                                                                                                                                                                                                                  
**size\_t nkey**         | Number of bytes in the key                                                                                                                                                                                                                                                                                                                                     
**int64\_t delta**       | The delta to increment/decrement                                                                                                                                                                                                                                                                                                                               
**time\_t exptime**      | The expiry time for the object. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                                        
**bool create**          | Should the key be created if it does not exist?                                                                                                                                                                                                                                                                                                                
**uint64\_t initial**    | The initial value for the key if created                                                                                                                                                                                                                                                                                                                       
**Errors**               |                                                                                                                                                                                                                                                                                                                                                                
`LCB_ETMPFAIL`           | No vbucket configuration available                                                                                                                                                                                                                                                                                                                             
`LCB_SUCCESS`            | Command successfully scheduled                                                                                                                                                                                                                                                                                                                                 

<a id="table-couchbase-sdk_c_lcb_connect"></a>

**API Call**        | `lcb_connect (lcb_t instance)`                                                                                                                                                           
--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                                                                                                       
**Description**     | Initiate a connect attempt to the Couchbase cluster to get the serverlist. Please note that this method is asynchronous, so you need to call lcb\_wait to wait for the method to compete.
**Returns**         | `lcb_error_t` ( lcb instance )                                                                                                                                                           
**Arguments**       |                                                                                                                                                                                          
**lcb\_t instance** | The handle to the couchbase instance.                                                                                                                                                    
**Errors**          |                                                                                                                                                                                          
`LCB_NETWORK_ERROR` | If an IO error occurred                                                                                                                                                                  
`LCB_SUCCESS`       | Command successfully scheduled                                                                                                                                                           
`LCB_UNKNOWN_HOST`  | Failed to lookup host name                                                                                                                                                               

<a id="table-couchbase-sdk_c_lcb_create"></a>

**API Call**               | `lcb_create (const char* host, const char* user, const char* passwd, const char* bucket, lcb_io_ops_t* iops)`                                                                                                                                                                                                                                                                                                                                                                                 
---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**           | no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
**Description**            | lcb\_create allocates and initializes an instance of lcb. No connection attempt is at this time. host may be specified as "host:port" and is the REST interface port for the cluster (default: "localhost:8091"). user and password are the username/password combination you want to authenticate as. bucket specifies the bucket you would like to connect to. opps is the io operation structure to use (see lcb\_create\_io\_ops). The bucket name and the username are commonly the same.
**Returns**                | `lcb_t` ( The handle to the couchbase instance. )                                                                                                                                                                                                                                                                                                                                                                                                                                             
**Arguments**              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
**const char\* host**      | Hostname                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
**const char\* user**      | Username                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
**const char\* passwd**    | Password                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
**const char\* bucket**    | Bucket name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
**lcb\_io\_ops\_t\* iops** | I/O operation structure                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
**Errors**                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
`lcb_t`                    | an instance of lcb on success                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
`NULL`                     | on failure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

<a id="table-couchbase-sdk_c_lcb_create_io_ops"></a>

**API Call**     | `lcb_create_io_ops ()`
-----------------|-----------------------
**Asynchronous** | no                    
**Description**  | todo: fixme           
**Returns**      | (none)                
**Arguments**    |                       
                 | None                  

<a id="table-couchbase-sdk_c_lcb_destroy"></a>

**API Call**        | `lcb_destroy (lcb_t instance)`                                                
--------------------|-------------------------------------------------------------------------------
**Asynchronous**    | no                                                                            
**Description**     | lcb\_destory release all allocated resources and invalidates the lcb instance.
**Returns**         | `lcb_error_t` ( lcb instance )                                                
**Arguments**       |                                                                               
**lcb\_t instance** | The handle to the couchbase instance.                                         

<a id="table-couchbase-sdk_c_lcb_disable_timings"></a>

**API Call**        | `lcb_disable_timings (lcb_t instance)`                                                  
--------------------|-----------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                      
**Description**     | Stop recording of timing metrics and release all resources allocated for timing metrics.
**Returns**         | `lcb_error_t` ( lcb instance )                                                          
**Arguments**       |                                                                                         
**lcb\_t instance** | The handle to the couchbase instance.                                                   

<a id="table-couchbase-sdk_c_lcb_enable_timings"></a>

**API Call**        | `lcb_enable_timings (lcb_t instance)`                                
--------------------|----------------------------------------------------------------------
**Asynchronous**    | no                                                                   
**Description**     | Start recording of timing metrics for operations against the cluster.
**Returns**         | `lcb_error_t` ( lcb instance )                                       
**Arguments**       |                                                                      
**lcb\_t instance** | The handle to the couchbase instance.                                

<a id="table-couchbase-sdk_c_lcb_flush"></a>

**API Call**            | `lcb_flush (lcb_t instance, const void* cookie)`                                                                                                             
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                           
**Description**         | lcb\_flush may be used to remove all key/value pairs from the entire cluster.                                                                                
**Returns**             | `lcb_error_t` ( lcb instance )                                                                                                                               
**Arguments**           |                                                                                                                                                              
**lcb\_t instance**     | The handle to the couchbase instance.                                                                                                                        
**const void\* cookie** | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.
**Errors**              |                                                                                                                                                              
`LCB_ETMPFAIL`          | No vbucket configuration available                                                                                                                           
`LCB_SUCCESS`           | Command successfully scheduled                                                                                                                               

<a id="table-couchbase-sdk_c_lcb_get_cookie"></a>

**API Call**        | `lcb_get_cookie (lcb_t instance)`                                                                                                
--------------------|----------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                                               
**Description**     | Each libcochbase instance may have a single pointer (cookie) associated with it. libcouchbaes\_get\_cookie retrieves this cookie.
**Returns**         | `const void*` ( Pointer to data )                                                                                                
**Arguments**       |                                                                                                                                  
**lcb\_t instance** | The handle to the couchbase instance.                                                                                            

<a id="table-couchbase-sdk_c_lcb_get_last_error"></a>

**API Call**        | `lcb_get_last_error (lcb_t instance)`                  
--------------------|--------------------------------------------------------
**Asynchronous**    | no                                                     
**Description**     | Returns the last error that was seen within libcoubhase
**Returns**         | `lcb_error_t` ( lcb instance )                         
**Arguments**       |                                                        
**lcb\_t instance** | The handle to the couchbase instance.                  

<a id="table-couchbase-sdk_c_lcb_get_timings"></a>

**API Call**        | `lcb_get_timings (lcb_t instance)`              
--------------------|-------------------------------------------------
**Asynchronous**    | no                                              
**Description**     | Retrieve the timing metrics from lcb. TODO fixme
**Returns**         | (none)                                          
**Arguments**       |                                                 
**lcb\_t instance** | The handle to the couchbase instance.           

<a id="table-couchbase-sdk_c_lcb_mget"></a>

**API Call**                   | `lcb_mget (lcb_t instance, const void* cookie, size_t num_keys, const void * const* keys, const size_t* nkeys, const time_t* exp)`                                                                                                                                                                            
-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**               | no                                                                                                                                                                                                                                                                                                            
**Description**                | Get a number of values from the cache. You need to run the event loop yourself to retrieve the data. You might want to alter the expiry time for the object you're fetching, and to do so you should specify the new expiry time in the exp parameter. To use an ordinary mget use NULL for the exp parameter.
**Returns**                    | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                
**Arguments**                  |                                                                                                                                                                                                                                                                                                               
**lcb\_t instance**            | The handle to the couchbase instance.                                                                                                                                                                                                                                                                         
**const void\* cookie**        | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                 
**size\_t num\_keys**          | Number of keys                                                                                                                                                                                                                                                                                                
**const void \* const\* keys** | Pointer to the array of keys                                                                                                                                                                                                                                                                                  
**const size\_t\* nkeys**      | Pointer to the array with the length of the keys                                                                                                                                                                                                                                                              
**const time\_t\* exp**        | Pointer to the expiry time                                                                                                                                                                                                                                                                                    

<a id="table-couchbase-sdk_c_lcb_mget_by_key"></a>

**API Call**                   | `lcb_mget_by_key (lcb_t instance, const void* cookie, const void* hashkey, size_t nhashkey, size_t num_keys, const void * const* keys, const size_t* nkeys, const time_t* exp)`                                                                                                                                                                                                                                                                                 
-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**               | no                                                                                                                                                                                                                                                                                                                                                                                                                                                              
**Description**                | Get a number of values from the cache. You need to run the event loop yourself (or call lcb\_execute) to retrieve the data. You might want to alter the expiry time for the object you're fetching, and to do so you should specify the new expiry time in the exp parameter. To use an ordinary mget use NULL for the exp parameter. lcb\_mget\_by\_key differs from lcb\_mget that you may use another key to look up the server to retrieve the objects from.
**Returns**                    | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                                                                                                                  
**Arguments**                  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
**lcb\_t instance**            | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                                                                                                                           
**const void\* cookie**        | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                                                                                                                   
**const void\* hashkey**       | This alternate hashkey allows a client application to group a set of unique keys together to a given server though the keys themselves may be unique. For example, you may wish to use the hashkey "user" for the two data keys "user:name" and "user:birthdate". Note that not all clients support this option so it may not be interoperable between clients.                                                                                                 
**size\_t nhashkey**           | The number of bytes in the alternative key                                                                                                                                                                                                                                                                                                                                                                                                                      
**size\_t num\_keys**          | Number of keys                                                                                                                                                                                                                                                                                                                                                                                                                                                  
**const void \* const\* keys** | Pointer to the array of keys                                                                                                                                                                                                                                                                                                                                                                                                                                    
**const size\_t\* nkeys**      | Pointer to the array with the length of the keys                                                                                                                                                                                                                                                                                                                                                                                                                
**const time\_t\* exp**        | Pointer to the expiry time                                                                                                                                                                                                                                                                                                                                                                                                                                      

<a id="table-couchbase-sdk_c_lcb_mtouch"></a>

**API Call**                   | `lcb_mtouch (lcb_t instance, const void* cookie, size_t num_keys, const void * const* keys, const size_t* nkeys, const time_t* exp)`                                 
-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**               | no                                                                                                                                                                   
**Description**                | Touch (set expiration time) on a number of values in the cache You need to run the event loop yourself (or call lcb\_wait) to retrieve the results of the operations.
**Returns**                    | `lcb_error_t` ( lcb instance )                                                                                                                                       
**Arguments**                  |                                                                                                                                                                      
**lcb\_t instance**            | The handle to the couchbase instance.                                                                                                                                
**const void\* cookie**        | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.        
**size\_t num\_keys**          | Number of keys                                                                                                                                                       
**const void \* const\* keys** | Pointer to the array of keys                                                                                                                                         
**const size\_t\* nkeys**      | Pointer to the array with the length of the keys                                                                                                                     
**const time\_t\* exp**        | Pointer to the expiry time                                                                                                                                           

<a id="table-couchbase-sdk_c_lcb_mtouch_by_key"></a>

**API Call**                   | `lcb_mtouch_by_key (lcb_t instance, const void* cookie, const void* hashkey, size_t nhashkey, const void * const* keys, const size_t* nkeys, const time_t* exp)`                                                                                                                                                                                               
-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**               | no                                                                                                                                                                                                                                                                                                                                                             
**Description**                | Touch (set expiration time) on a number of values in the cache You need to run the event loop yourself (or call lcb\_wait) to retrieve the results of the operations. lcb\_mtouch\_by\_key differs from lcb\_mtouch that you may use another key to look up the server for the keys.                                                                           
**Returns**                    | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                 
**Arguments**                  |                                                                                                                                                                                                                                                                                                                                                                
**lcb\_t instance**            | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                          
**const void\* cookie**        | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                  
**const void\* hashkey**       | This alternate hashkey allows a client application to group a set of unique keys together to a given server though the keys themselves may be unique. For example, you may wish to use the hashkey "user" for the two data keys "user:name" and "user:birthdate". Note that not all clients support this option so it may not be interoperable between clients.
**size\_t nhashkey**           | The number of bytes in the alternative key                                                                                                                                                                                                                                                                                                                     
**const void \* const\* keys** | Pointer to the array of keys                                                                                                                                                                                                                                                                                                                                   
**const size\_t\* nkeys**      | Pointer to the array with the length of the keys                                                                                                                                                                                                                                                                                                               
**const time\_t\* exp**        | Pointer to the expiry time                                                                                                                                                                                                                                                                                                                                     

<a id="table-couchbase-sdk_c_lcb_remove"></a>

**API Call**            | `lcb_remove (lcb_t instance, const void* cookie, const void* key, size_t nkey, uint64_t cas)`                                                                                                                                   
------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                              
**Description**         | Spool a remove operation to the cluster. The operation  may  be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).                                                   
**Returns**             | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                  
**Arguments**           |                                                                                                                                                                                                                                 
**lcb\_t instance**     | The handle to the couchbase instance.                                                                                                                                                                                           
**const void\* cookie** | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                   
**const void\* key**    | An identifier in the database                                                                                                                                                                                                   
**size\_t nkey**        | Number of bytes in the key                                                                                                                                                                                                      
**uint64\_t cas**       | The cas value for an object is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update an item simultaneously.

<a id="table-couchbase-sdk_c_lcb_remove_by_key"></a>

**API Call**             | `lcb_remove_by_key (lcb_t instance, const void* cookie, const void* hashkey, size_t nhashkey, const void* key, size_t nkey, uint64_t cas)`                                                                                                                                                                                                                     
-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**         | no                                                                                                                                                                                                                                                                                                                                                             
**Description**          | Spool a remove operation to the cluster. The operation  may  be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).                                                                                                                                                                                  
**Returns**              | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                 
**Arguments**            |                                                                                                                                                                                                                                                                                                                                                                
**lcb\_t instance**      | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                          
**const void\* cookie**  | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                  
**const void\* hashkey** | This alternate hashkey allows a client application to group a set of unique keys together to a given server though the keys themselves may be unique. For example, you may wish to use the hashkey "user" for the two data keys "user:name" and "user:birthdate". Note that not all clients support this option so it may not be interoperable between clients.
**size\_t nhashkey**     | The number of bytes in the alternative key                                                                                                                                                                                                                                                                                                                     
**const void\* key**     | An identifier in the database                                                                                                                                                                                                                                                                                                                                  
**size\_t nkey**         | Number of bytes in the key                                                                                                                                                                                                                                                                                                                                     
**uint64\_t cas**        | The cas value for an object is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update an item simultaneously.                                                                                                                               

<a id="table-couchbase-sdk_c_lcb_server_stats"></a>

**API Call**            | `lcb_server_stats (lcb_t instance, const void* cookie, const void* key, size_t nkey)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
**Description**         | Request server statistics. Without a key specified the server will respond with a "default" set of statistical information. Each statistic is returned in its own packet (key contains the name of the statistical item and the body contains the value in ASCII format). The sequence of return packets is terminated with a packet that contains no key and no value. The command will signal about transfer completion by passing NULL as the server endpoint and 0 for key length. Note that key length will be zero when some server responds with error. In the latter case server endpoint argument will indicate the server address.
**Returns**             | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
**Arguments**           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
**lcb\_t instance**     | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
**const void\* cookie** | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
**const void\* key**    | An identifier in the database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
**size\_t nkey**        | Number of bytes in the key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

<a id="table-couchbase-sdk_c_lcb_set_arithmetic_callback"></a>

**API Call**                      | `lcb_set_arithmetic_callback (lcb_t instance, lcb_error_callback callback)`                                                                                                                               
----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                                                                                                        
**Description**                   | Specify the callback to be used for all arithmetic operations. The callback will be called whenever the operation completes, and the parameters to the callback will describe the result of the operation.
**Returns**                       | ()                                                                                                                                                                                                        
**Arguments**                     |                                                                                                                                                                                                           
**lcb\_t instance**               | The handle to the couchbase instance.                                                                                                                                                                     
**lcb\_error\_callback callback** | The callback function                                                                                                                                                                                     

<a id="table-couchbase-sdk_c_lcb_set_cookie"></a>

**API Call**            | `lcb_set_cookie (lcb_t instance, const void* cookie)`                                                                                                        
------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**        | no                                                                                                                                                           
**Description**         | Each libcochbase instance may have a single pointer (cookie) associated with it.                                                                             
**Returns**             | (none)                                                                                                                                                       
**Arguments**           |                                                                                                                                                              
**lcb\_t instance**     | The handle to the couchbase instance.                                                                                                                        
**const void\* cookie** | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.

<a id="table-couchbase-sdk_c_lcb_set_error_callback"></a>

**API Call**                      | `lcb_set_error_callback (lcb_t instance, lcb_error_callback callback)`                                                                                                                                                                    
----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                                                                                                                                        
**Description**                   | Set the callback function to be used by lcb to report errors back to the client. Due to the asyncronous nature of lcb errors may occur outside of the normal access pattern and such problems will be reported through this error handler.
**Returns**                       | ()                                                                                                                                                                                                                                        
**Arguments**                     |                                                                                                                                                                                                                                           
**lcb\_t instance**               | The handle to the couchbase instance.                                                                                                                                                                                                     
**lcb\_error\_callback callback** | The callback function                                                                                                                                                                                                                     

<a id="table-couchbase-sdk_c_lcb_set_flush_callback"></a>

**API Call**        | `lcb_set_flush_callback (lcb_t instance)`
--------------------|------------------------------------------
**Asynchronous**    | no                                       
**Description**     | @fixme                                   
**Returns**         | (none)                                   
**Arguments**       |                                          
**lcb\_t instance** | The handle to the couchbase instance.    

<a id="table-couchbase-sdk_c_lcb_set_get_callback"></a>

**API Call**        | `lcb_set_get_callback (lcb_t instance)`
--------------------|----------------------------------------
**Asynchronous**    | no                                     
**Description**     | @fixme                                 
**Returns**         | (none)                                 
**Arguments**       |                                        
**lcb\_t instance** | The handle to the couchbase instance.  

<a id="table-couchbase-sdk_c_lcb_set_remove_callback"></a>

**API Call**        | `lcb_set_remove_callback (lcb_t instance)`
--------------------|-------------------------------------------
**Asynchronous**    | no                                        
**Description**     | @fixme                                    
**Returns**         | (none)                                    
**Arguments**       |                                           
**lcb\_t instance** | The handle to the couchbase instance.     

<a id="table-couchbase-sdk_c_lcb_set_stat_callback"></a>

**API Call**        | `lcb_set_stat_callback (lcb_t instance)`
--------------------|-----------------------------------------
**Asynchronous**    | no                                      
**Description**     | @fixme                                  
**Returns**         | (none)                                  
**Arguments**       |                                         
**lcb\_t instance** | The handle to the couchbase instance.   

<a id="table-couchbase-sdk_c_lcb_set_storage_callback"></a>

**API Call**        | `lcb_set_storage_callback (lcb_t instance)`
--------------------|--------------------------------------------
**Asynchronous**    | no                                         
**Description**     | @fixme                                     
**Returns**         | (none)                                     
**Arguments**       |                                            
**lcb\_t instance** | The handle to the couchbase instance.      

<a id="table-couchbase-sdk_c_lcb_set_tap_deletion_callback"></a>

**API Call**        | `lcb_set_tap_deletion_callback (lcb_t instance)`
--------------------|-------------------------------------------------
**Asynchronous**    | no                                              
**Description**     | @fixme                                          
**Returns**         | (none)                                          
**Arguments**       |                                                 
**lcb\_t instance** | The handle to the couchbase instance.           

<a id="table-couchbase-sdk_c_lcb_set_tap_flush_callback"></a>

**API Call**        | `lcb_set_tap_flush_callback (lcb_t instance)`
--------------------|----------------------------------------------
**Asynchronous**    | no                                           
**Description**     | @fixme                                       
**Returns**         | (none)                                       
**Arguments**       |                                              
**lcb\_t instance** | The handle to the couchbase instance.        

<a id="table-couchbase-sdk_c_lcb_set_tap_mutation_callback"></a>

**API Call**        | `lcb_set_tap_mutation_callback (lcb_t instance)`
--------------------|-------------------------------------------------
**Asynchronous**    | no                                              
**Description**     | @fixme                                          
**Returns**         | (none)                                          
**Arguments**       |                                                 
**lcb\_t instance** | The handle to the couchbase instance.           

<a id="table-couchbase-sdk_c_lcb_set_tap_opaque_callback"></a>

**API Call**        | `lcb_set_tap_opaque_callback (lcb_t instance)`
--------------------|-----------------------------------------------
**Asynchronous**    | no                                            
**Description**     | @fixme                                        
**Returns**         | (none)                                        
**Arguments**       |                                               
**lcb\_t instance** | The handle to the couchbase instance.         

<a id="table-couchbase-sdk_c_lcb_set_tap_vbucket_set_callback"></a>

**API Call**        | `lcb_set_tap_vbucket_set_callback (lcb_t instance)`
--------------------|----------------------------------------------------
**Asynchronous**    | no                                                 
**Description**     | @fixme                                             
**Returns**         | (none)                                             
**Arguments**       |                                                    
**lcb\_t instance** | The handle to the couchbase instance.              

<a id="table-couchbase-sdk_c_lcb_set_touch_callback"></a>

**API Call**        | `lcb_set_touch_callback (lcb_t instance)`
--------------------|------------------------------------------
**Asynchronous**    | no                                       
**Description**     | @fixme                                   
**Returns**         | (none)                                   
**Arguments**       |                                          
**lcb\_t instance** | The handle to the couchbase instance.    

<a id="table-couchbase-sdk_c_lcb_store"></a>

**API Call**                         | `lcb_store (lcb_t instance, const void* cookie, lcb_storage_t store_operation, const void* key, size_t nkey, const void* bytes, size_t nbytes, flags, time_t exptime, uint64_t cas)`                                            
-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                     | no                                                                                                                                                                                                                              
**Description**                      | Spool a store operation to the cluster. The operation may be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).                                                      
**Returns**                          | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                  
**Arguments**                        |                                                                                                                                                                                                                                 
**lcb\_t instance**                  | The handle to the couchbase instance.                                                                                                                                                                                           
**const void\* cookie**              | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                   
**lcb\_storage\_t store\_operation** | The kind of storage operation (set/replace/add etc.)                                                                                                                                                                            
**const void\* key**                 | An identifier in the database                                                                                                                                                                                                   
**size\_t nkey**                     | Number of bytes in the key                                                                                                                                                                                                      
**const void\* bytes**               | A pointer to a memory area containing data                                                                                                                                                                                      
**size\_t nbytes**                   | Number of bytes used                                                                                                                                                                                                            
**flags**                            |                                                                                                                                                                                                                                 
**time\_t exptime**                  | The expiry time for the object. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                         
**uint64\_t cas**                    | The cas value for an object is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update an item simultaneously.

<a id="table-couchbase-sdk_c_lcb_store_by_key"></a>

**API Call**                         | `lcb_store_by_key (lcb_t instance, const void* cookie, lcb_storage_t store_operation, const void* hashkey, size_t nhashkey, const void* key, size_t nkey, const void* bytes, size_t nbytes, flags, time_t exptime, uint64_t cas)`                                                                                                                              
-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                     | no                                                                                                                                                                                                                                                                                                                                                             
**Description**                      | Spool a store operation to the cluster. The operation may be sent immediately, but you won't be sure (or get the result) until you run the event loop (or call lcb\_wait).                                                                                                                                                                                     
**Returns**                          | `lcb_error_t` ( lcb instance )                                                                                                                                                                                                                                                                                                                                 
**Arguments**                        |                                                                                                                                                                                                                                                                                                                                                                
**lcb\_t instance**                  | The handle to the couchbase instance.                                                                                                                                                                                                                                                                                                                          
**const void\* cookie**              | This is a cookie the client may attach to all requests that will be included in all callbacks. It is not required and may be NULL if you have no need for it.                                                                                                                                                                                                  
**lcb\_storage\_t store\_operation** | The kind of storage operation (set/replace/add etc.)                                                                                                                                                                                                                                                                                                           
**const void\* hashkey**             | This alternate hashkey allows a client application to group a set of unique keys together to a given server though the keys themselves may be unique. For example, you may wish to use the hashkey "user" for the two data keys "user:name" and "user:birthdate". Note that not all clients support this option so it may not be interoperable between clients.
**size\_t nhashkey**                 | The number of bytes in the alternative key                                                                                                                                                                                                                                                                                                                     
**const void\* key**                 | An identifier in the database                                                                                                                                                                                                                                                                                                                                  
**size\_t nkey**                     | Number of bytes in the key                                                                                                                                                                                                                                                                                                                                     
**const void\* bytes**               | A pointer to a memory area containing data                                                                                                                                                                                                                                                                                                                     
**size\_t nbytes**                   | Number of bytes used                                                                                                                                                                                                                                                                                                                                           
**flags**                            |                                                                                                                                                                                                                                                                                                                                                                
**time\_t exptime**                  | The expiry time for the object. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                                        
**uint64\_t cas**                    | The cas value for an object is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update an item simultaneously.                                                                                                                               

<a id="table-couchbase-sdk_c_lcb_strerror"></a>

**API Call**        | `lcb_strerror (lcb_t instance)`                           
--------------------|-----------------------------------------------------------
**Asynchronous**    | no                                                        
**Description**     | Convert the error code to human readable form. @todo fixme
**Returns**         | (none)                                                    
**Arguments**       |                                                           
**lcb\_t instance** | The handle to the couchbase instance.                     

<a id="table-couchbase-sdk_c_lcb_tap_cluster"></a>

**API Call**        | `lcb_tap_cluster (lcb_t instance)`   
--------------------|--------------------------------------
**Asynchronous**    | no                                   
**Description**     | @fixme                               
**Returns**         | (none)                               
**Arguments**       |                                      
**lcb\_t instance** | The handle to the couchbase instance.

<a id="table-couchbase-sdk_c_lcb_tap_filter_create"></a>

**API Call**        | `lcb_tap_filter_create (lcb_t instance)`                                                                
--------------------|---------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                      
**Description**     | tap filters are on the client side only, so data still needs to be transferred across the network @fixme
**Returns**         | (none)                                                                                                  
**Arguments**       |                                                                                                         
**lcb\_t instance** | The handle to the couchbase instance.                                                                   

<a id="table-couchbase-sdk_c_lcb_tap_filter_destroy"></a>

**API Call**        | `lcb_tap_filter_destroy (lcb_t instance)`
--------------------|------------------------------------------
**Asynchronous**    | no                                       
**Description**     | Invalidate the filter.. @fixme           
**Returns**         | (none)                                   
**Arguments**       |                                          
**lcb\_t instance** | The handle to the couchbase instance.    

<a id="table-couchbase-sdk_c_lcb_tap_filter_get_backfill"></a>

**API Call**        | `lcb_tap_filter_get_backfill (lcb_t instance)`
--------------------|-----------------------------------------------
**Asynchronous**    | no                                            
**Description**     | @fixme                                        
**Returns**         | (none)                                        
**Arguments**       |                                               
**lcb\_t instance** | The handle to the couchbase instance.         

<a id="table-couchbase-sdk_c_lcb_tap_filter_get_keys_only"></a>

**API Call**        | `lcb_tap_filter_get_keys_only (lcb_t instance)`
--------------------|------------------------------------------------
**Asynchronous**    | no                                             
**Description**     | @fixme                                         
**Returns**         | (none)                                         
**Arguments**       |                                                
**lcb\_t instance** | The handle to the couchbase instance.          

<a id="table-couchbase-sdk_c_lcb_tap_filter_set_backfill"></a>

**API Call**        | `lcb_tap_filter_set_backfill (lcb_t instance)`
--------------------|-----------------------------------------------
**Asynchronous**    | no                                            
**Description**     | @fixme                                        
**Returns**         | (none)                                        
**Arguments**       |                                               
**lcb\_t instance** | The handle to the couchbase instance.         

<a id="table-couchbase-sdk_c_lcb_tap_filter_set_keys_only"></a>

**API Call**        | `lcb_tap_filter_set_keys_only (lcb_t instance)`
--------------------|------------------------------------------------
**Asynchronous**    | no                                             
**Description**     | @fixme                                         
**Returns**         | (none)                                         
**Arguments**       |                                                
**lcb\_t instance** | The handle to the couchbase instance.          

<a id="table-couchbase-sdk_c_lcb_wait"></a>

**API Call**        | `lcb_wait (lcb_t instance)`                                                                                            
--------------------|------------------------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                                     
**Description**     | lcb\_wait cause the calling thread to block and wait until all spooled operations (and their callbacks) have completed.
**Returns**         | (none)                                                                                                                 
**Arguments**       |                                                                                                                        
**lcb\_t instance** | The handle to the couchbase instance.                                                                                  

<a id="couchbase-sdk-c-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library C. To browse or submit new issaues, see [Couchbase
Client Library C Issues Tracker](http://www.couchbase.com/issues/browse/CCBC).

<a id="couchbase-sdk-c-rn_1-0-7"></a>

## Release Notes for Couchbase Client Library C 1.0.7 GA (12 October 2012)

**New Features and Behaviour Changes in 1.0.7**

 * Extract cbc tool into separate package (DEB/RPM) with -bin suffix.

<a id="couchbase-sdk-c-rn_1-0-6"></a>

## Release Notes for Couchbase Client Library C 1.0.6 GA (30 August 2012)

**Fixes in 1.0.6**

 * Release ringbuffer in libcouchbase\_purge\_single\_server()

   *Issues* : [CCBC-92](http://www.couchbase.com/issues/browse/CCBC-92)

<a id="couchbase-sdk-c-rn_1-0-5"></a>

## Release Notes for Couchbase Client Library C 1.0.5 GA (15 August 2012)

**Fixes in 1.0.5**

 * Fix switching to backup node in case of server outage

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

 * Reset timer for commands with NOT\_MY\_VBUCKET response

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

<a id="couchbase-sdk-c-rn_1-0-4"></a>

## Release Notes for Couchbase Client Library C 1.0.4 GA (01 June 2012)

**Fixes in 1.0.4**

 * Several fixes related to tests and topology changes in corner conditions were
   added, in additional to the items described below.

 * A hang could occur in libcouchbase\_wait() after the timeout period.

   *Issues* : [CCBC-62](http://www.couchbase.com/issues/browse/CCBC-62)

 * Timeouts can occur during topology changes, rather than be correctly retried.

   *Issues* : [CCBC-64](http://www.couchbase.com/issues/browse/CCBC-64)

 * A small memory leak can occur with frequent calls to libcouchbase\_create() and
   libcouchbase\_destroy()

   *Issues* : [CCBC-65](http://www.couchbase.com/issues/browse/CCBC-65)

<a id="couchbase-sdk-c-rn_1-0-3"></a>

## Release Notes for Couchbase Client Library C 1.0.3 GA (02 May 2012)

**Fixes in 1.0.3**

 * In addition to the buffer overflow (CCBC-33) fixes for buffer handling in the
   event of a server being disconnected have been integrated.

 * A fix for a buffer overflow with the supplied password as reported in RCBC-33
   has been integrated. While it is a buffer overflow issue, this is not considered
   to be a possible security issue because the password to the bucket is not
   commonly supplied by an untrusted source.

   *Issues* : [CCBC-33](http://www.couchbase.com/issues/browse/CCBC-33)

<a id="couchbase-sdk-c-rn_1-0-2"></a>

## Release Notes for Couchbase Client Library C 1.0.2 GA (06 March 2012)

**Fixes in 1.0.2**

 * The source will now emit deb packages and apt repositories are available.

   *Issues* : [CCBC-31](http://www.couchbase.com/issues/browse/CCBC-31)

 * Support for Windows via Microsoft Visual C 9 has been added to this version.

   Support for multiple bootstrap URLs has now been added. This will ensure that if
   one node of the cluster becomes unaavilable for some reason and the client
   becomes unavailable, it can still bootstrap off of remaining nodes in the
   cluster. Host/port combinations are provided to the libcouchbase\_create()
   function semicolon delimited. See the header file in libcouchbase/couchbase.h
   for more usage information.

   Several fixes and enhancements for the example application, cbc, have been
   included. Now cbc supports better usage messages, standard out support for cp,
   and timeouts.

<a id="couchbase-sdk-c-rn_1-0-1"></a>

## Release Notes for Couchbase Client Library C 1.0.1 GA (13 February 2012)

**Fixes in 1.0.1**

 * A fix to allow the client library to failover automatically to other nodes when
   the initial bootstrap node becomes unavailable has been added. All users are
   recommended to upgrade for this fix.

 * Operations will now timeout rather than hang forever in some failure scenarios.

 * Release 1.0.1 of the Couchbase C Client Library is a rollup maintenance covering
   issues discovered subsequent to the 1.0.0 release.

   Error handling is better in a number of corner conditions such as during tests,
   when shutting down, handling timeouts during initial connection, minor
   memory-handling errors with libevent

   Support for building libcouchbase as static to support embedding has been added.
   This approach isn't encouraged, but makes sense in some cases.

   Support for building libcouchbase without a C++ compiler has been added,
   simplifying some environments where it will only be used from C.

 * A fix address incorrect SASL authentication handling when SASL authentication is
   already underway was integrated.

 * A fix to allow the client library to handle retrying a given operation in the
   case that the cluster has gone through a topology change has been integrated.
   Without this fix, software using this library can receive unexpected errors.

<a id="couchbase-sdk-c-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library C 1.0.0 GA (22 January 2012)

**New Features and Behaviour Changes in 1.0.0**

 * This is the first stable release of the Couchbase C Client Library. It is a
   callback based C client library designed to work with Couchbase Server. It is
   frequently used when building higher level client libraries.

   Known client libraries based on this one include the Couchbase Ruby, the
   Couchbase PHP library and an experimental Perl library.

 * Add make targets to build RPM and DEB packages

 * Aggregate flush responses

 * Allow libcouchbase build with libevent 1.x (verified for 1.4.14)

 * Allow config for cbc tool to be read from.cbcrc

   *Issues* : [CCBC-37](http://www.couchbase.com/issues/browse/CCBC-37)

 * Remove <memcached/vbucket.h> dependency

 * Disable Views support

 * Gracefully update vbucket configuration. This means that the connection
   listener, could reconfigure data sockets on the fly.

 * Allow the user to specify sync mode on an instance

 * New command cbc. This command intended as the analog of mem\* tools from
   libmemcached distribution. Supported commands:

    * cbc-cat

    * cbc-cp

    * cbc-create

    * cbc-flush

    * cbc-rm

    * cbc-stats

    * cbc-send

    * cbc-receive

 * Add stats command

**Fixes in 1.0.0**

 * Aggregate flush responses

 * Don't accept NULL as a valid "callback"

 * Convert flags to network byte order

**Known Issues in 1.0.0**

 * If the bootstrap node fails, the client library will not automatically fail over
   to another node in the cluster. This can cause an outage until the bootstrap
   node is corrected.

   *Workaround* : The program initializing libcouchbase may check first to see if
   the bootstrap node is available. If it is not, the program may initialize
   libcouchbase using a different URI.

 * A cluster being rebalanced or having nodes added can return errors to the
   client. There is no workaround for this issue, but it has been addressed in
   version 1.0.1.

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