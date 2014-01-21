<a id="couchbase-admin-restapi-views"></a>


# Views REST API

You can index and query JSON documents using views. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to: find all the documents in your database,
create a copy of data in a document and present it in a specific order, create
an index to efficiently find documents by a particular value or by a particular
structure in the document, represent relationships between documents, and
perform calculations on data contained in documents.

You store view functions in a design document as JSON and can use the REST API
to manage your design documents.

<a id="couchbase-restapi-query-views"></a>


## Querying views with REST

Querying can be performed through the REST API endpoint. The REST API supports
and operates using the core HTTP protocol, and this is the same system used by
the client libraries to obtain the view data.

Use the REST API to query a view by accessing any node within the
Couchbase Server cluster on port 8092. For example:


```
GET http://localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Where:

 * `bucketname` is the name of the bucket.

 * `designdocname` is the name of the design document that contains the view.

   For views defined within the development context (see [Development and
   Production Views](#couchbase-views-types) ), the `designdocname` is prefixed
   with `dev_`. For example, the design document `beer` is accessible as a
   development view using `dev_beer`.

   Production views are accessible using their name only.

 * `viewname` is the name of the corresponding view within the design document.

When accessing a view stored within an SASL password-protected bucket, you must
include the bucket name and bucket password within the URL of the request:


```
GET http://bucketname:password@localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Additional arguments to the URL request can be used to select information from
the view, and provide limit, sorting and other options. For example, to output
only ten items:


```
GET http://localhost:8092/bucketname/_design/designdocname/_view/viewname?limit=10
```

The formatting of the URL follows the HTTP specification. The first argument
should be separated from the base URL using a question mark ( `?` ). Additional
arguments should be separated using an ampersand ( `&` ). Special characters
should be quoted or escaped according to the HTTP standard rules.

The additional supported arguments are detailed in the table below.

<a id="table-couchbase-querying-arguments"></a>

Get View Name | Description 
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Method**                  | `GET /bucket/_design/design-doc/_view/view-name`                                                                                                                     
**Request Data**            | None                                                                                                                                                                 
**Response Data**           | JSON of the rows returned by the view                                                                                                                                
**Authentication Required** | no                                                                                                                                                                   
**Query Arguments**         |                                                                                                                                                                      
`descending`                | Return the documents in descending by key order                                                                                                                      
                            | **Parameters** : boolean; optional                                                                                                                                   
`endkey`                    | Stop returning records when the specified key is reached. Key must be specified as a JSON value.                                                                     
                            | **Parameters** : string; optional                                                                                                                                    
`endkey_docid`              | Stop returning records when the specified document ID is reached                                                                                                     
                            | **Parameters** : string; optional                                                                                                                                    
`full_set`                  | Use the full cluster data set (development views only).                                                                                                              
                            | **Parameters** : boolean; optional                                                                                                                                   
`group`                     | Group the results using the reduce function to a group or single row                                                                                                 
                            | **Parameters** : boolean; optional                                                                                                                                   
`group_level`               | Specify the group level to be used                                                                                                                                   
                            | **Parameters** : numeric; optional                                                                                                                                   
`inclusive_end`             | Specifies whether the specified end key should be included in the result                                                                                             
                            | **Parameters** : boolean; optional                                                                                                                                   
`key`                       | Return only documents that match the specified key. Key must be specified as a JSON value.                                                                           
                            | **Parameters** : string; optional                                                                                                                                    
`keys`                      | Return only documents that match each of keys specified within the given array. Key must be specified as a JSON value. Sorting is not applied when using this option.
                            | **Parameters** : array; optional                                                                                                                                     
`limit`                     | Limit the number of the returned documents to the specified number                                                                                                   
                            | **Parameters** : numeric; optional                                                                                                                                   
`on_error`                  | Sets the response in the event of an error                                                                                                                           
                            | **Parameters** : string; optional                                                                                                                                    
                            | **Supported Values**                                                                                                                                                 
                            | `continue` : Continue to generate view information in the event of an error, including the error information in the view response stream.                            
                            | `stop` : Stop immediately when an error condition occurs. No further view information will be returned.                                                              
`reduce`                    | Use the reduction function                                                                                                                                           
                            | **Parameters** : boolean; optional                                                                                                                                   
`skip`                      | Skip this number of records before starting to return the results                                                                                                    
                            | **Parameters** : numeric; optional                                                                                                                                   
`stale`                     | Allow the results from a stale view to be used                                                                                                                       
                            | **Parameters** : string; optional                                                                                                                                    
                            | **Supported Values** :                                                                                                                                               
                            | `false` : Force a view update before returning data                                                                                                                  
                            | `ok` : Allow stale views                                                                                                                                             
                            | `update_after` : Allow stale view, update view after it has been accessed                                                                                            
`startkey`                  | Return records with a value equal to or greater than the specified key. Key must be specified as a JSON value.                                                       
                            | **Parameters** : string; optional                                                                                                                                    
`startkey_docid`            | Return records starting with the specified document ID                                                                                                               
                            | **Parameters** : string; optional                                                                                                                                    

The output from a view will be a JSON structure containing information about the
number of rows in the view, and the individual view information.

An example of the View result is shown below:


```
{
  "total_rows": 576,
  "rows" : [
      {"value" : 13000, "id" : "James", "key" : ["James", "Paris"] },
      {"value" : 20000, "id" : "James", "key" : ["James", "Tokyo"] },
      {"value" : 5000,  "id" : "James", "key" : ["James", "Paris"] },
…
    ]
}
```

The JSON returned consists of two fields:

 * `total_rows`

   A count of the number of rows of information within the stored View. This shows
   the number of rows in the full View index, not the number of rows in the
   returned data set.

 * `rows`

   An array, with each element of the array containing the returned view data,
   consisting of the value, document ID that generated the row, and the key.

In the event of an error, the HTTP response will be an error type (not 200), and
a JSON structure will be returned containing two fields, the basic `error` and a
more detailed `reason` field. For example:


```
{
  "error":"bad_request",
  "reason":"invalid UTF-8 JSON: {{error,{1,\"lexical error: invalid char in json text.\\n\"}},\n                     \"Paris\"}"
}
```

If you supply incorrect parameters to the query, an error message is returned by
the server. Within the Client Libraries the precise behavior may differ between
individual language implementations, but in all cases, an invalid query should
trigger an appropriate error or exception.


<a id="couchbase-restapi-request-limits"></a>

## Limiting simultaneous node requests

You can use the `/internalSettings` endpoint to limit the
number of simultaneous requests each node can accept. In earlier releases, too
many simultaneous views requests resulted in a node being overwhelmed. For
general information about this endpoint, see [Managing Internal Cluster
Settings](#couchbase-admin-restapi-settings-max_bucket_count).

 When Couchbase Server rejects an incoming connection because one of these
limits is exceeded, it responds with an HTTP status code of 503. The HTTP
Retry-After header will be set appropriately. If the request is made to a REST
port, the response body will provide the reason why the request was rejected. If
the request is made on a CAPI port, such as a views request, the server will
respond with a JSON object with a "error" and "reason" fields.

For example, to change this limit for the port used for views:

    curl -X POST -u admin:password http://localhost:8091/internalSettings -d 'capiRequestLimit=50'

Replace the *admin*, *password*, *localhost*, and *50* values in the above
example with your actual values.
    
Will limit the number of simultaneous views requests and internal XDCR requests
which can be made on a port. The following are all the port-related request
parameters you can set:

 * **restRequestLimit** : Maximum number of simultaneous connections each node
   should accept on a REST port. Diagnostic-related requests and 
   `/internalSettings` requests are not counted in this limit.

 * **capiRequestLimit** : Maximum number of simultaneous connections each node
   should accept on CAPI port. This port is used for XDCR and views connections.

 * **dropRequestMemoryThresholdMiB** : In MB. The amount of memory used by Erlang
   VM that should not be exceeded. If the amount is exceeded the server will start
   dropping incoming connections.

By default these settings do not have any limit set. We recommend you leave this
settings at the default setting unless you experience issues with too many
requests impacting a node. If you set these thresholds too low, too many
requests will be rejected by the server, including requests from Couchbase Web
Console.

