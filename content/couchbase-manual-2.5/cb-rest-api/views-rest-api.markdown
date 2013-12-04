<a id="couchbase-admin-restapi-views"></a>


# Views REST API

## Managing Views with REST

You can index and query JSON documents using views. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to: find all the documents in your database,
create a copy of data in a document and present it in a specific order, create
an index to efficiently find documents by a particular value or by a particular
structure in the document, represent relationships between documents, and
perform calculations on data contained in documents.

You store view functions in a design document as JSON and can use the REST API
to manage your design documents.

<a id="couchbase-restapi-request-limits"></a>

### Limiting Simultaneous Node Requests

As of Couchbase 2.1+ you can use the `/internalSettings` endpoint to limit the
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

<a id="couchbase-admin-rest