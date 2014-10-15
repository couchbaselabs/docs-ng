<a id="couchbase-views-designdoc-api"></a>

# Design documents REST API

Design documents are used to store one or more view definitions. Views can be
defined within a design document and uploaded to the server through the REST
API.

<a id="couchbase-views-designdoc-api-storing"></a>

## Storing design documents

To create a new design document with one or more views, you can upload the
corresponding design document using the REST API with the definition in place.
The format of this command is as shown in the table below:

<a id="couchbase-views-designdoc-api-put"></a>

Put Design Document | Description
----------------------------|---------------------------------------------------------------
**Method**                  | `PUT /bucket/_design/design-doc`                                                                         
**Request Data**            | Design document definition (JSON)                                                                        
**Response Data**           | Success and stored design document ID                                                                    
**Authentication Required** | optional                                                                                                 
**Return Codes**            |                                                                                                          
201                         | Document created successfully.                                                                           
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.

<div class="notebox">
<p>Note</p>
<p>When creating a design document through the REST API, we recommend that you
create a development ( <code>dev</code> ) view. We recommend that you create a dev design
document and views first, and then check the output of the configured views in
your design document. To create a dev view you <i>must</i> explicitly use the <code>dev_</code>
prefix for the design document name.</p>
</div>

For example, using `curl`, you can create a design document, `byfield`, by
creating a text file (with the name `byfield.ddoc` ) with the design document
content using the following command:


```
> curl -X PUT -H 'Content-Type: application/json' \
   http://user:password@localhost:8092/sales/_design/dev_byfield' \
   -d @byfield.ddoc
```

In the above example:

 * -X PUT

   Indicates that an HTTP PUT operation is requested.

 * -H 'Content-Type: application/json'

   Specifies the HTTP header information. Couchbase Server requires the information
   to be sent and identified as the `application/json` datatype. Information not
   supplied with the content-type set in this manner will be rejected.

 * http://user:password@localhost:8092/sales/_design/dev_byfield

   The URL, including authentication information, of the bucket where you want the
   design document uploaded. The `user` and `password` should either be the
   Administration privileges, or for SASL protected buckets, the bucket name and
   bucket password. If the bucket does not have a password, then the authentication
   information is not required.

<div class="notebox">
<p>Note</p>
<p>The view being accessed in this case is a development view. To create a
   development view, you <i>must</i> use the <code>dev_</code> prefix to the view name.</p>
   </div>

   As a `PUT` command, the URL is also significant, in that the location designates
   the name of the design document. In the example, the URL includes the name of
   the bucket ( `sales` ) and the name of the design document that will be created
   `dev_byfield`.

 * `-d @byfield.ddoc`

   Specifies that the data payload should be loaded from the file `byfield.ddoc`.

If successful, the HTTP response code will be 201 (created). The returned JSON
will contain the field `ok` and the ID of the design document created:


```
{
    "ok":true,
    "id":"_design/dev_byfield"
}
```

The design document will be validated before it is created or updated in the
system. The validation checks for valid JavaScript and for the use of valid
built-in reduce functions. Any validation failure is reported as an error.

In the event of an error, the returned JSON will include the field `error` with
a short description, and the field `reason` with a longer description of the
problem.

The format of the design document should include all the views defined in the
design document, incorporating both the map and reduce functions for each named
view. For example:


```
{"views":{"byloc":{"map":"function (doc, meta) {\n  if (meta.type == \"json\") {\n    emit(doc.city, doc.sales);\n  } else {\n    emit([\"blob\"]);\n  }\n}"}}}
```

Formatted, the design document looks like this:


```
{
   "views" : {
      "byloc" : {
         "map" : "function (doc, meta) {\n  if (meta.type == \"json\") {\n    emit(doc.city, doc.sales);\n  } else {\n    emit([\"blob\"]);\n  }\n}"
      }
   }
}
```

The top-level `views` field lists one or more view definitions (the `byloc` view
in this example), and for each view, a corresponding `map()` function.

<a id="couchbase-views-designdoc-api-retrieving"></a>

## Retrieving design documents

To obtain an existing design document from a given bucket, you need to access
the design document from the corresponding bucket using a `GET` request, as
detailed in the table below.

<a id="couchbase-views-designdoc-api-get"></a>

Get Design Document | Description 
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Method**                  | `GET /bucket/_design/design-doc`                                                                                                
**Request Data**            | Design document definition (JSON)                                                                                               
**Response Data**           | Success and stored design document ID                                                                                           
**Authentication Required** | optional                                                                                                                        
**Return Codes**            |                                                                                                                                 
200                         | Request completed successfully.                                                                                                 
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.                       
404                         | The requested content could not be found. The returned content will include further information, as a JSON object, if available.

To get back all the design documents with views defined on a bucket, the use following URI path with the GET request. 
In addition to get specific design documents back, the name of the design document can be specified to retrieve it.


```
"ddocs": {
        "uri": "/pools/default/buckets/default/ddocs" // To obtain design docs for this bucket
    }
```

For example, to get the existing design document from the bucket `sales` for the
design document `byfield` :


```
> curl -X GET \
    -H 'Content-Type: application/json' \
    http://user:password@192.168.0.77:8092/sales/_design/dev_byfield
```

Through `curl` this will download the design document to the file `dev_byfield`
filename.

If the bucket does not have a password, you can omit the authentication
information. If the view does not exist you will get an error:


```
{
   "error":"not_found",
   "reason":"missing"
}
```

The HTTP response header will include a JSON document containing the metadata
about the design document being accessed. The information is returned within the
`X-Couchbase-Meta` header of the returned data. You can obtain this information
by using the `-v` option to the `curl`.

For example:


```
&gt; curl -v -X GET \
   -H 'Content-Type: application/json' \
   http://user:password@192.168.0.77:8092/sales/_design/
* About to connect() to 192.168.0.77 port 8092 (#0)
*   Trying 192.168.0.77...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* connected
* Connected to 192.168.0.77 (192.168.0.77) port 8092 (#0)
* Server auth using Basic with user 'Administrator'
> GET /sales/_design/something HTTP/1.1
> Authorization: Basic QWRtaW5pc3RyYXRvcjpUYW1zaW4=
> User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
> Host: 192.168.0.77:8092
> Accept: */*
> Content-Type: application/json
>
< HTTP/1.1 200 OK
< X-Couchbase-Meta: {"id":"_design/dev_sample","rev":"5-2785ea87","type":"json"}
< Server: MochiWeb/1.0 (Any of you quaids got a smint?)
< Date: Mon, 13 Aug 2012 10:45:46 GMT
< Content-Type: application/json
< Content-Length: 159
< Cache-Control: must-revalidate
<
{ [data not shown]
100   159  100   159    0     0  41930      0 --:--:-- --:--:-- --:--:-- 53000
* Connection #0 to host 192.168.0.77 left intact
* Closing connection #0
```

The metadata matches the corresponding metadata for a data document.

<a id="couchbase-views-designdoc-api-deleting"></a>

## Deleting design documents

To delete a design document, you use the `DELETE` HTTP request with the URL of
the corresponding design document. The summary information for this request is
shown in the table below:

<a id="couchbase-views-designdoc-api-delete"></a>

Delete Design Document | Description 
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Method**                  | `DELETE /bucket/_design/design-doc`                                                                                             
**Request Data**            | Design document definition (JSON)                                                                                               
**Response Data**           | Success and confirmed design document ID                                                                                        
**Authentication Required** | optional                                                                                                                        
**Return Codes**            |                                                                                                                                 
200                         | Request completed successfully.                                                                                                 
401                         | The item requested was not available using the supplied authorization, or authorization was not supplied.                       
404                         | The requested content could not be found. The returned content will include further information, as a JSON object, if available.

Deleting a design document immediately invalidates the design document and all
views and indexes associated with it. The indexes and stored data on disk are
removed in the background.

For example, to delete the previously created design document using `curl` :


```
> curl -v -X DELETE -H 'Content-Type: application/json' \
    http://Administrator:Password@192.168.0.77:8092/default/_design/dev_byfield
```

When the design document has been successfully removed, the JSON returned
indicates successful completion, and confirmation of the design document
removed:


```
{"ok":true,"id":"_design/dev_byfield"}
```

Error conditions will be returned if the authorization is incorrect, or the
specified design document cannot be found.

