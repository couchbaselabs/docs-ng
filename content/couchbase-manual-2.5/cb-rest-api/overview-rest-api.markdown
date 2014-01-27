<title>REST API overview</title>

<a id="couchbase-admin-rest"></a>

<a id="couchbase-admin-restapi"></a>
# REST API overview

The Couchbase REST API enables you to manage a Couchbase Server deployment as well as perform operations such as storing design documents and querying for results. The REST API conforms to Representational State Transfer (REST) constraints, in other words, the REST API follows a **RESTful** architecture.

Use the REST API to manage clusters, server nodes, and buckets, and to
retrieve run-time statistics within your Couchbase Server deployment. If you
want to develop your own Couchbase-compatible SDK, you will also use the
REST API within your library to handle *views*. Views enable you to index and
query data based on functions that you define. 

<div class="notebox tip">
<p>Tip</p>
<p>
The REST API should *not* be used to read or write data to the server. Data
operations such as `set` and `get` for example, are handled by Couchbase SDKs.
See the <a href="http://couchbase.com/develop">Couchbase SDKs</a>.
</p></div>

In addition, the Couchbase Web Console uses many of the same REST API endpoints that are used for a REST API request. This is especially for administrative tasks such as creating a new bucket, adding a node to a cluster, or changing cluster settings. 


Please provide RESTful requests; you will not receive any handling instructions,
resource descriptions, nor should you presume any conventions for URI structure
for resources represented. The URIs in the REST API may have a specific URI or
may even appear as RPC or some other architectural style using HTTP operations
and semantics.

In other words, build your request starting from Couchbase Cluster
URIs, and be aware that URIs for resources may change from version to version.
Also note that the hierarchies shown here enable your reuse of requests, since
they follow a similar pattern for accessing different parts of the system.

The REST API is built on a number of basic principles:

 * **JSON Responses**

   The Couchbase Management REST API returns many responses as JavaScript Object
   Notation (JSON). On that node, you may find it convenient to read responses in a
   JSON reader. Some responses may have an empty body, but indicate the response
   with standard HTTP codes. For more information, see RFC 4627 (
   [http://www.ietf.org/rfc/rfc4627.txt](http://www.ietf.org/rfc/rfc4627.txt) ) and
   [www.json.org](http://www.json.org).

 * **HTTP Basic Access Authentication**

   The Couchbase Management REST API uses HTTP basic authentication. The
   browser-based [Using the Web Console](../cb-admin/#couchbase-admin-web-console) and
   [Command-line Interface](../cb-cli/#couchbase-admin-cmdline) also use
   HTTP basic authentication.

 * **Versatile Server Nodes**

   All server nodes in a cluster share the same properties and can handle any
   requests made via the REST API.; you can make a REST API request on any node in
   a cluster you want to access. If the server node cannot service a request
   directly, due to lack of access to state or some other information, it will
   forward the request to the appropriate server node, retrieve the results, and
   send the results back to the client.

In order to use the REST API you should be aware of the different terms and
concepts discussed in the following sections.

<a id="couchbase-admin-restapi-key-concepts-resources"></a>

## Types of resources

There are a number of different resources within the Couchbase Server and these
resources will require a different URI/RESTful-endpoint in order to perform an
operations:

### Server nodes

   A Couchbase Server instance, also known as 'node', is a physical or virtual
   machine running Couchbase Server. Each node is as a member of a cluster.

### Cluster/Pool

   A cluster is a group of one or more nodes; it is a collection of physical
   resources that are grouped together and provide services and a management
   interface. A single default cluster exists for every deployment of Couchbase
   Server. A node, or instance of Couchbase Server, is a member of a cluster.
   Couchbase Server collects run-time statistics for clusters, maintaining an
   overall pool-level data view of counters and periodic metrics of the overall
   system. The Couchbase Management REST API can be used to retrieve historic
   statistics for a cluster.

### Buckets

   A bucket is a logical grouping of data within a cluster. It provides a name
   space for all the related data in an application; therefore you can use the same
   key in two different buckets and they are treated as unique items by Couchbase
   Server.

   Couchbase Server collects run-time statistics for buckets, maintaining an
   overall bucket-level data view of counters and periodic metrics of the overall
   system. Buckets are categorized by storage type: 1) memcached buckets are for
   in-memory, RAM-based information, and 2) Couchbase buckets, which are for
   persisted data.

### Views

   Views enable you to index and query data based on logic you specify. You can
   also use views to perform calculations and aggregations, such as statistics, for
   items in Couchbase Server. For more information, see [Views and
   Indexes](../cb-admin/#couchbase-views).

### Cross datacenter replication (XDCR)

   Cross Datacenter Replication (XDCR) is new functionality as of Couchbase Server
   2.0. It enables you to automatically replicate data between clusters and between
   data buckets. There are two major benefits of using XDCR as part of your
   Couchbase Server implementation: 1) enables you to restore data from one
   Couchbase cluster to another cluster after system failure. 2) provide copies of
   data on clusters that are physically closer to your end users. For more
   information, see [Cross Datacenter Replication
   (XDCR)](../cb-admin/#couchbase-admin-tasks-xdcr).

<a id="couchbase-admin-restapi-key-concepts-httpheaders"></a>

## HTTP request headers

You will use the following HTTP request headers when you create your request:

<a id="table-couchbase-admin-restapi-key-concepts-httpheaders"></a>

Header                               | Supported Values                                            | Description of Use                                                                           | Required                                     
-------------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------
Accept                               | Comma-delimited list of media types or media type patterns. | Indicates to the server what media type(s) this client is prepared to accept.                | Recommended                                  
Authorization                        | `Basic` plus username and password (per RFC 2617).          | Identifies the authorized user making this request.                                          | No, unless secured                           
Content-Length                       | Body Length (in bytes)                                      | Describes the size of the message body.                                                      | Yes, on requests that contain a message body.
Content-Type                         | Content type                                                | Describes the representation and syntax of the request message body.                         | Yes, on requests that contain a message body.
Host                                 | Origin hostname                                             | Required to allow support of multiple origin hosts at a single IP address.                   | All requests                                 
X-YYYYY-Client-Specification-Version | String                                                      | Declares the specification version of the YYYYY API that this client was programmed against. | No                                           

<a id="couchbase-admin-restapi-key-concepts-httpstatus"></a>

## HTTP status codes

The Couchbase Server will return one of the following HTTP status codes in
response to your REST API request:

<a id="table-couchbase-admin-restapi-key-concepts-httpstatus"></a>

HTTP Status               | Description                                                                                                                                                                                                                                                               
--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
200 OK                    | Successful request and an HTTP response body returns. If this creates a new resource with a URI, the 200 status will also have a location header containing the canonical URI for the newly created resource.                                                             
201 Created               | Request to create a new resource is successful, but no HTTP response body returns. The URI for the newly created resource returns with the status code.                                                                                                                   
202 Accepted              | The request is accepted for processing, but processing is not complete. Per HTTP/1.1, the response, if any, SHOULD include an indication of the request's current status, and either a pointer to a status monitor or some estimate of when the request will be fulfilled.
204 No Content            | The server fulfilled the request, but does not need to return a response body.                                                                                                                                                                                            
400 Bad Request           | The request could not be processed because it contains missing or invalid information, such as validation error on an input field, a missing required value, and so on.                                                                                                   
401 Unauthorized          | The credentials provided with this request are missing or invalid.                                                                                                                                                                                                        
403 Forbidden             | The server recognized the given credentials, but you do not possess proper access to perform this request.                                                                                                                                                                
404 Not Found             | URI you provided in a request does not exist.                                                                                                                                                                                                                             
405 Method Not Allowed    | The HTTP verb specified in the request (DELETE, GET, HEAD, POST, PUT) is not supported for this URI.                                                                                                                                                                      
406 Not Acceptable        | The resource identified by this request cannot create a response corresponding to one of the media types in the Accept header of the request.                                                                                                                             
409 Conflict              | A create or update request could not be completed, because it would cause a conflict in the current state of the resources supported by the server. For example, an attempt to create a new resource with a unique identifier already assigned to some existing resource. 
500 Internal Server Error | The server encountered an unexpected condition which prevented it from fulfilling the request.                                                                                                                                                                            
501 Not Implemented       | The server does not currently support the functionality required to fulfill the request.                                                                                                                                                                                  
503 Service Unavailable   | The server is currently unable to handle the request due to temporary overloading or maintenance of the server.                                                                                                                                                           

