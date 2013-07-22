# Connection Operations

<a id="table-couchbase-sdk_java_new_couchbaseclient"></a>

**API Call**        | `client.new CouchbaseClient([ url ] [, urls ] [, username ] [, password ])`                                                                                                                                                                                        
--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**    | no                                                                                                                                                                                                                                                                 
**Description**     | Create a connection to Couchbase Server with given parameters, such as node URL. The connection obtains the cluster configuration from the first host to which it has connected. Further communication operates directly with each node in the cluster as required.
**Returns**         | (none)                                                                                                                                                                                                                                                             
**Arguments**       |                                                                                                                                                                                                                                                                    
**String url**      | URL for Couchbase Server Instance, or node.                                                                                                                                                                                                                        
**String urls**     | Linked list containing one or more URLs as strings.                                                                                                                                                                                                                
**String username** | Username for Couchbase bucket.                                                                                                                                                                                                                                     
**String password** | Password for Couchbase bucket.                                                                                                                                                                                                                                     

<a id="api-reference-set"></a>
