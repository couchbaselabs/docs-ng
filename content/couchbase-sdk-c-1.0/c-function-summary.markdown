# C Function Summary

`libcouchbase` provides a well defined API for accessing the data stored in a
Couchbase cluster. The supported methods are listed in the following tables.

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
