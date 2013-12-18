# Database Resources

Database resources provide an interface to an entire database. 
The following table lists the database resources:

|HTTP Method | URI pattern | Description  |
| ------	| ------	| ------	|  
| `PUT`    | `/{db}`                     | Creates a new database
| `GET`    | `/{db}`                     | Retrieves information about a database 
| `DELETE` | `/{db}`                     | Deletes a database 
| `GET`    | `/{db}/_all_docs`           | Retrieve the built-in view of all documents in the database  
| `POST`   | `/{db}/_all_docs`           | Retrieves specified documents from the built-in view of all documents in the database   
| `POST`   | `/{db}/_bulk_docs`          | Inserts multiple documents into the database in a single request
| `GET`    | `/{db}/_changes`            | Returns changes for the database  
| `POST`   | `/{db}/_compact`            | Starts a compaction for the database  
| `POST`   | `/{db}/_purge`              | Purges some historical documents from the database history  
| `POST`   | `/{db}/_temp_view`          | Executes a given view function for all documents and returns the result    |

In the URI patterns, `{db}` represents the name of the database on which you want to operate.

## PUT /{db}

This request creates a new database. The database name must begin with a lowercase letter. The legal characters for the database name are: lowercase letters \[`a-z`], digits \[`0-9`], and special characters \[`$_()+-/`].
###Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

This request does not use a message body.

### Response

**Status codes**

* 201 Created – Database created successfully
* 400 Bad Request – Invalid database name
* 401 Unauthorized – Administrator privileges required
* 412 Precondition Failed – Database already exists

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* multipart/mixed
	* text/plain; charset=utf-8
* Location—URI of the new database

**Message body**

The response contains a JSON document that contains some of the following objects:

|Name | Type | Description|  
| ------	| ------	| ------	|  
|`error` | String | Error message|  
|`ok`| Boolean | Indicates whether the operation was successful|  
|`status` | Integer | HTTP error code|  

### Example

The following example creates a new database named `cookbook`.

**Request**

```
PUT /cookbook HTTP/1.1
Host: localhost:59840
```
	
**Response**

```
HTTP/1.1 201 Created
Server: CouchbaseLite 1.485
Location: http://localhost:59840/cookbook
Accept-Ranges: bytes
Content-Length: 18
Content-Type: application/json
Date: Sun, 08 Dec 2013 20:17:16 GMT

{
  "ok" : true
}
```

The following example shows the error you receive when trying to create a database that already exists:

**Request**

```
PUT /cookbook HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 412 Precondition Failed
Transfer-Encoding: chunked
Accept-Ranges: bytes
Content-Type: application/json
Server: CouchbaseLite 1.485
Date: Mon, 09 Dec 2013 19:26:09 GMT

{
  "status" : 412,
  "error" : "file_exists"
}
```

The following example show the error you receive when you specify an invalid database name.

**Request**

```
PUT /ACookbook HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 400 Bad Request
Transfer-Encoding: chunked
Accept-Ranges: bytes
Content-Type: application/json
Server: CouchbaseLite 1.486
Date: Thu, 12 Dec 2013 19:42:12 GMT

{
  "status" : 400,
  "error" : "Invalid database\/document\/revision ID"
}
```

## GET /{db}

This request retrieves information about a database.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

This request does not use a message body.

### Response

**Status codes**

* 200 OK – Request completed successfully
* 404 Not Found – Requested database not found

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The message body is a JSON document that contains the following objects:

| Name | Type |Description |  
|  ------	| ------	|  
|`committed_update_seq` | Integer |Number of committed updates to the database 
| `db_name` | String|Name of the database
| `db_uuid` |String |Database identifier
| `disk_format_version` |Integer |Database schema version
| `disk_size` |Integer |Total amount of data stored on the disk. Units: bytes 
|`doc_count` |Integer |Number of documents in the database
| `instance_start_time` | Integer|Date and time the database was opened. Units:  microseconds since the epoch (1 January 1970)
| `purge_seq` |Integer|Returns 0.
|`update_seq` |Integer  |Number of updates to the database


### Example

The following example retrieves information about a database named `beer-db`.

**Request**

```
GET /beer-db HTTP/1.1
Host: localhost:59840
```


**Response**

```json
HTTP/1.1 200 OK
Server: CouchbaseLite 1.485
Content-Type: application/json
Accept-Ranges: bytes
Content-Length: 281
Cache-Control: must-revalidate
Date: Fri, 06 Dec 2013 22:31:17 GMT

{
  "instance_start_time" : 1386620242527997,
  "committed_update_seq" : 25800,
  "disk_size" : 15360000,
  "purge_seq" : 0,
  "db_uuid" : "65FB16DF-FFD7-4514-9E8D-B734B066D28D",
  "doc_count" : 5048,
  "db_name" : "beer-db",
  "update_seq" : 25800,
  "disk_format_version" : 11
}
```

The following example shows the response returned when you request information about a database that does not exist on the server. The example requests information about a database named `cookbook`, which does not exist on the server.

**Request**

```
GET /cookbook HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 404 Not Found
Transfer-Encoding: chunked
Accept-Ranges: bytes
Content-Type: application/json
Server: CouchbaseLite 1.485
Date: Sun, 08 Dec 2013 20:16:50 GMT

{
  "status" : 404,
  "error" : "not_found"
}
```
## DELETE /{db}

This request deletes a database, including all documents and attachments.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

This request does not use a message body.

### Response

**Status codes**

* 200 OK – Database removed successfully
* 400 Bad Request – Invalid database name
* 401 Unauthorized – CouchDB Server Administrator privileges required
* 404 Not Found – Database doesn’t exist

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The response contains a JSON document that contains some of the following objects:

|Name | Type | Description|  
| ------	| ------	| ------	|  
|`error` | String | Error message|  
|`ok`| Boolean | Indicates whether the operation was successful|  
|`status` | Integer | HTTP error code|  

### Example

**Request**

```
DELETE /genealogy HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 200 OK
Content-Type: application/json
Accept-Ranges: bytes
Content-Length: 18
Server: CouchbaseLite 1.485
Date: Mon, 09 Dec 2013 04:24:05 GMT

{
  "ok" : true
}
```
## GET /{db}/_all_docs
This request returns a built-in view of all documents in the database.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `conflicts` | Boolean | Include conflict information in the response. This parameter is ignored if the `include_docs` parameter is `false`. | false  
|  `descending` | Boolean | Return documents in descending order | false  
| `endkey` | string | If this parameter is provided, stop returning records when the specified key is reached. | none  
 | `end_key` |  string | Alias for the `endkey` parameter | none
| `endkey_docid` | string | If this parameter is provided, stop returning records when the specified document identifier is reached | none  
| `end_key_doc_id` | string | Alias for the `endkey_docid` parameter | none  
| `include_docs` | Boolean | Indicates whether to include the full content of the documents in the response | false  
| `inclusive_end` | Boolean | Indicates whether the specified end key should be included in the result | true  
| `key` | string | If this parameter is provided, return only document that match the specified key. | none  
| `limit` | integer | If this parameter is provided, return only the specified number of documents | none  
| `skip` |  integer | If this parameter is provided, skip the specified number of documents before starting to return results | 0  
| `stale` | string | Allow the results from a stale view to be used, without triggering a rebuild of all views within the encompassing design document. Valid values: `ok` and `update_after`. | none  
| `startkey` | string | If this parameter is provided, return documents starting with the specified key. | none  
| `start_key` |  string | Alias for `startkey` param | none  
| `startkey_docid` | string | If this parameter is provided, return documents starting with the specified document identifier. | none  
| `update_seq` | Boolean | Indicates whether to include `update_seq` in the response | false

**Message body**

This request does not use a message body.

### Response

**Status codes**

* 200 OK – Request completed successfully
* 400 — Invalid database
* 404 — Database not found

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* text/plain; charset=utf-8

* `ETag`—Response signature

**Message body**

The message body is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	|  
|`offset`| integer| Starting index of the returned rows. 
|`rows`| array|Array of row objects. Each row contains the following objects: `id`, `key`, and `value`. The `value` object contains the revision identifier in a `rev` object.
|`total_rows`| integer|Number of documents in the database.This number is *not* the number of rows returned.|  
|`update_seq` | integer | Sequence identifier of the underlying database that the view reflects

### Example
The following request retrieves all documents from a database named `cookbook`.

**Request**

	GET /cookbook/_all_docs HTTP/1.1
	Host: localhost:59840
	
**Response**

```

HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: must-revalidate
Content-Type: application/json
Date: Fri, 13 Dec 2013 02:42:23 GMT
Etag: "3"
Server: CouchbaseLite 1.486

{
  "offset" : 0,
  "rows" : [
    {
      "key" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD",
      "value" : {
        "rev" : "1-ed0ebedd2fab89227b352f6455a08010"
      },
      "id" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD"
    },
    {
      "key" : "A329CFEC-29E8-4DCF-BB49-EFCE8CD6B212",
      "value" : {
        "rev" : "1-afbf905396a144446feb2431c37065f9"
      },
      "id" : "A329CFEC-29E8-4DCF-BB49-EFCE8CD6B212"
    },
    {
      "key" : "LemonChicken",
      "value" : {
        "rev" : "1-78abf9a6508671ba8338e4ef6daa910a"
      },
      "id" : "LemonChicken"
    }
  ],
  "total_rows" : 3
}
```

## POST /{db}/_all_docs
This request retrieves specified documents from the database.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

The message body is a JSON document that contains the following object:

|Name | Type | Description|  
| ------	| ------	| ------	|  
| `keys` | array | List of identifiers of the documents to retrieve |
### Response

**Status codes**

* 200 OK – Request completed successfully

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* text/plain; charset=utf-8

**Message body**

The message body is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	|  
|`offset`| integer| Starting index of the returned rows. 
|`rows`| array|Array of row objects. Each row contains the following objects: `id`, `key`, and `value`. The `value` object contains the revision identifier in a `rev` object.
|`total_rows`| integer|Number of documents in the database.This number is *not* the number of rows returned.|  

### Example
The following request retrieves specified documents from the database named `cookbook`.

**Request**

```
POST /cookbook/_all_docs
Host: localhost:59840

{
    "keys": [
        "LemonChicken",
        "209BB170-C1E0-473E-B3C4-A4533ACA3CDD"
    ]
}
```

**Response**

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 406
Content-Type: application/json
    Date: Sun, 15 Dec 2013 21:38:59 GMT
    Server: CouchbaseLite 1.486

{
  "offset" : 0,
  "rows" : [
    {
      "key" : "LemonChicken",
      "value" : {
        "rev" : "3-6210945863a15ee7eff1e540133d19da"
      },
      "id" : "LemonChicken"
    },
    {
      "key" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD",
      "value" : {
        "rev" : "1-ed0ebedd2fab89227b352f6455a08010"
      },
      "id" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD"
    }
  ],
  "total_rows" : 2
}
```

##POST /{db}/_bulk_docs
This request enables you to add, update, or delete multiple documents to a database in a single request.

To new documents, you can either specify the ID or let the software create an ID.

To update existing documents, you must provide the document ID, revision identifier, and new document values.

To delete existing documents you must provide the document ID, revision identifier, and a deletion flag (`_deleted`).
### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

The message body is a JSON document that contains the following objects:

|Name | Type | Description| Default |
| ------	| ------	| ------	|  ------ |
| `all_or_nothing` | Boolean | *Optional*. Indicates whether to use all-or-nothing semantics for the database commit mode | false  
|  `docs` | array | List containing new or updated documents. The docs object can contain `_id, `_rev`, `_deleted`, and values for new and updated documents. | none  
| `new_edits` | Boolean | *Optional*. Indicates whether to assign new revision identifiers to new edits. | true  

### Response

**Status codes**

* 201 Created – Document(s) have been created or updated
* 400 Bad Request – The request provided invalid JSON data
* 417 Expectation Failed – Occurs when all_or_nothing option set as true and at least one document was rejected by validation function
* 500 Internal Server Error – Malformed data provided, while it’s still valid JSON

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The response message body is a JSON documental that contains an array. Each array element contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| `id` | String | Document identifier |  
| `ok` | Boolean | Indicates whether the operation was successful   
| `rev` |String | revision identifier |  

### Example
Sample request:

The following example adds a new document with the identifier `PeachCobbler`, modifies the document with the identifier `LemonChicken`, and deletes the document with the identifier `CinnamonCookies`.

```
POST /cookbook/_bulk_docs
Host: localhost:59840

{
    "docs": [
        {
            "_id": "PeachCobbler",
            "description": "Juicy peaches topped with pie crust",
            "title": "Peach Cobbler"
        },
        {
            "_id": "LemonChicken",
            "_rev": "3-6210945863a15ee7eff1e540133d19da",
            "description": "Chinese lemon chicken",
            "serving-suggestion": "Serve with plain jasmine rice.",
            "servings": 4,
            "title": "Lemon Chicken"
        },
        {
            "_deleted": true,
            "_id": "CinnamonCookies",
            "_rev": "1-2c25302ccf3d70d3461f28b8df9fafd0"
        }
    ]
}
```

**Response**

```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Type: application/json
Date: Mon, 16 Dec 2013 17:01:56 GMT
Server: CouchbaseLite 1.486
Transfer-Encoding: chunked

[
  {
    "id" : "PeachCobbler",
    "rev" : "1-eb8eafda1b60edecef37f7daa02baa9e",
    "ok" : true
  },
  {
    "id" : "LemonChicken",
    "rev" : "4-51737756120a34de2d4981ab0f02c5a5",
    "ok" : true
  },
{
    "id" : "CinnamonCookies",
    "rev" : "2-28df61cdda892ad3dd4339f2bce18463",
    "ok" : true
  }
]
```


## GET /{db}/_changes
This request retrieves a sorted list of changes made to documents in the database, in time order of application, can be obtained from the database’s _changes resource. Only the most recent change for a given document is guaranteed to be provided. For example if a document has had fields added, and then deleted, an API client checking for changes will not necessarily receive the intermediate state of added documents.

This request can be used to listen for update and modifications to the database for post processing or synchronization. A continuously connected changes feed is a reasonable approach for generating a real-time log for most applications.
### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `attachments` | Boolean | Indicates whether to include the Base64-encoded content of attachments in the documents that are included when `include_docs` is true. this parameter is ignored when `include_docs` is false. | false  
| `att_encoding_info` | Boolean | Indicates whether to include encoding information in attachment stubs when `include_docs` is true. | false  
| `conflicts` | Boolean | Includes conflicts information in response. Ignored if include_docs isn’t true. | false  
| `descending` | Boolean | Return the change results in descending sequence order (most recent change first).| false  
| `doc_ids` | array | List of document IDs to filter the changes feed as valid JSON array. Used with _doc_ids filter. | none
| `feed` | string | Specifies type of change feed. Valid values: `normal`, `continuous`, `eventsource`, `longpoll` | `normal`  
| `filter` | string | Reference to a filter function from a design document that will filter whole stream emitting only filtered events. | none  
| `heartbeat`  | integer | Period in milliseconds after which an empty line is sent in the results. Only applicable for longpoll or continuous feeds. Overrides any timeout to keep the feed alive indefinitely. | 60000  
| `include_docs` | Boolean | Indicates whether to include the associated document with each result. f there are conflicts, only the winning revision is returned. | false  
| `last-event-id` | integer | Alias for the `Last-Event-ID` header. | none  
| `limit` | integer | Limits the number of result rows to the specified value. Using a value of 0 has the same effect as the value 1. | none  
| `since` | integer | Starts the results from the change immediately after the given sequence number. The value can be an integer or a row value. | 0  
| `style` | string | Number of revisions to return in the `changes` array. `main_only` returns the current winning revision, `all_docs` returns all leaf revisions including conflicts and deleted former conflicts. | `main_only`  
| `timeout` | integer | Maximum period in milliseconds to wait for a change before the response is sent, even if there are no results. Only applicable for `longpoll` or `continuous` feeds. The default value is specified by the httpd/changes_timeout configuration option. If not specified, the default maximum timeout is used to prevent undetected dead connections. | 60000  
| `view` | string | Name of a view function to use as a filter | none 

**Message body**

### Response

**Status codes**

* 200 OK – Request completed successfully
* 400 Bad Request – Bad request

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The response message body contains a JSON document with the following objects;

| Name | Type | Description  
|  ------	| ------	| ------	|  
| `last_seq` | integer  | Last change sequence number  
| `results` | array | List of changes to the database. See the following table for a list of fields in this object. |  

The `results` array contains the following objects:

| Name | Type | Description  
|  ------	| ------	| ------	|  
| `changes` | array |  List of the document's leafs. Each leaf object contains one field, `rev`. 
| `id` | string | Document identifier  
| `seq` | Update sequence number

### Example
The following example requests the changes to the database named `cookbook` and specifies that only two rows be included in the response:

**Request**

```
GET /cookbook/_changes?limit=2 HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: must-revalidate
Content-Type: application/json
Date: Mon, 16 Dec 2013 21:09:35 GMT
Etag: "13"
Server: CouchbaseLite 1.486
Transfer-Encoding: chunked

{
  "results" : [
    {
      "seq" : 1,
      "id" : "A329CFEC-29E8-4DCF-BB49-EFCE8CD6B212",
      "changes" : [
        {
          "rev" : "1-afbf905396a144446feb2431c37065f9"
        }
      ]
    },
    {
      "seq" : 2,
      "id" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD",
      "changes" : [
        {
          "rev" : "1-ed0ebedd2fab89227b352f6455a08010"
        }
      ]
    }
  ],
  "last_seq" : 2
}
```

## POST /{db}/_compact 
This request compacts the database. Compaction compresses the disk database file by performing the following operations:

* Writes a new, optimized version of the database file. Unused sections are removed from the new version during write. Because a new file is temporarily created for this purpose, up to twice the current storage space of the specified database is required for the compaction routine to complete.

* Removes old revisions of documents from the database, up to the per-database limit specified by the _revs_limit database parameter.

The compaction process runs as a background process.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

This request does not use a message body.

### Response

**Status codes**

* 202 Accepted – Compaction request has been accepted
* 400 Bad Request – Invalid database name
* 401 Unauthorized – Administrator privileges required
* 415 Unsupported Media Type – Bad Content-Type value

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The response contains a JSON document that contains some of the following objects:

|Name | Type | Description|  
| ------	| ------	| ------	|  
|`error` | String | Error message|  
|`ok`| Boolean | Indicates whether the operation was successful|  
|`status` | Integer | HTTP error code|  

### Example

The following example requests the database named  `cookbook`  to be compacted.

**Request**

```
POST /cookbook/_compact HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 202 Accepted
Accept-Ranges: bytes
Content-Length: 18
Content-Type: application/json
Date: Mon, 16 Dec 2013 17:22:34 GMT
Server: CouchbaseLite 1.486

{
  "ok" : true
}
```

## POST /{db}/_purge

This request permanently removes references to specified deleted documents from the database. 

Deleting a document does not remove the document from the database— that just marks it as deleted and creates a new revision to ensure that deleted documents can be replicated to other databases as having been deleted. This also means that you can check the status of a document and determine that the document has been deleted by its absence.

Purging documents does not remove the space used by them on disk. To reclaim disk space, run a database compact (see /db/_compact) or compact views (see /db/_compact/design-doc) request.

### Request

**Request headers**

This request does not have any required headers.

**Query parameters**

This request does not use query parameters.

**Message body**

The request message body is a JSON document that contains an object in which the key is a document identifier and the value is a list of the revision identifiers.

| Name | Type | Description  
|  ------	| ------	| ------	|  
| not applicable | object | An object that represents the document to be purged. The key is the document identifier and the value is an array that contains identifiers of the revisions to be purged.  

### Response

**Status codes**

* 200 OK – Request completed successfully
* 400 Bad Request – Invalid database name or JSON payload  
* 415 Unsupported Media Type – Bad Content-Type value

**Response headers**

This response uses only standard HTTP headers.

**Message body**

The response message body contains the following objects:

| Name | Type | Description |  
|  ------	| ------	| ------	|  
| `purge_seq` | integer | Purge sequence number |  
| `purged` | object | An object that represents the purged document. The key is the document identifier and the value is an array that contains identifiers of the purged revisions. |

### Example

**Request**

```
POST /cookbook/_purge HTTP/1.1
```

**Response**


## POST /{db}/_temp_view
Executes a temporary view function for all documents and returns the result.

### Request

**Request headers**

**Query parameters**

**Message body**

### Response

**Status codes**

**Response headers**

**Message body**

### Example

**Request**

```
POST /cookbook/_temp_view
```

**Response**



