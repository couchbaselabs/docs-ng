# Document Resources

Document resources enable you to work with individual documents in a database. The following table lists the document resources:

|HTTP method | URI pattern | Description  |
| ------	| ------	| ------	|  
| `POST`    | `/{db}`                     | Creates a new document in the database  
|  `PUT`| `/{db}/{doc}` | Creates a new document or updates an existing document|  
| `GET`| `/{db}/{doc}` | Retrieves a document |
| `DELETE`| `/{db}/{doc}` | Deletes a document |  
| `PUT` | `/{db}/{doc}/{attachment}`| Adds or updates attachments for a document|
| `GET` | `/{db}/{doc}/{attachment}`| Retrieves attachments for a document|
| `DELETE` | `/{db}/{doc}/{attachment}`| Deletes attachments for a document|

The following table defines the parameters used in the URI patterns:

| Name | Description|  
|  ------	| ------	|  
| attachment | Identifier of an attachment |  
| db | Name of the database|  
| doc | Identifier of a document


## POST /{db}
This request creates a new document in the specified database. You can either specify the document ID by including the `_id` object in the request message body, or let the software generate an ID.

### Request

**Request headers**

The request uses the following headers:

* `Accept`—*Optional*—Valid values are:
	* application/json
	* text/plain
* `Content-Type`—*Required*—Must be application/json.

**Query parameters**

The request uses the following query parameter:

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `batch` | string | Stores the document in batch mode. To use, set the value to `ok`.| none  


### Response

The response is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| id | String | Document identifier |  
| ok | Boolean | Indicates whether the operation was successful   
| rev |String | revision identifier |  

### Example

The following request creates a new document in a database named `cookbook`.

**Request**

```
POST /cookbook HTTP/1.1
Host: localhost:59840
Content-Type: application/json

{
    "description": "Chicken topped with mozzarella and parmesan cheese",
    "servings": 4,
    "title": "Chicken Parmagiana"
}
```

**Response**

```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Length: 115
Content-Type: application/json
Date: Fri, 13 Dec 2013 01:57:54 GMT
Etag: "1-ed0ebedd2fab89227b352f6455a08010"
Location: http://localhost:59840/cookbook/209BB170-C1E0-473E-B3C4-A4533ACA3CDD
Server: CouchbaseLite 1.486

{
  "id" : "209BB170-C1E0-473E-B3C4-A4533ACA3CDD",
  "rev" : "1-ed0ebedd2fab89227b352f6455a08010",
  "ok" : true
}
```

The following example creates a new document with the identifier `LemonChicken` in a database named `cookbook`.

**Request**

```
POST /cookbook
Host: localhost:59840
Content-Type: application/json

{
    "_id": "LemonChicken",
    "description": "Chinese lemon chicken",
    "servings": 4,
    "title": "Lemon Chicken"
}
```

**Response**

```

HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Type: application/json
Date: Fri, 13 Dec 2013 02:31:46 GMT
Etag: "1-78abf9a6508671ba8338e4ef6daa910a"
Location: http://localhost:59840/cookbook/LemonChicken
Server: CouchbaseLite 1.486
Transfer-Encoding: chunked

{
  "id" : "LemonChicken",
  "rev" : "1-78abf9a6508671ba8338e4ef6daa910a",
  "ok" : true
}
```

## PUT /{db}/{doc}
This request creates a new document or creates a new revision of an existing document. It enables you to specify the identifier for a new document rather than letting the software create an identifier. If you want to create a new document and let the software create an identifier, use the `POST /db` request. 

If the document specified by `doc` does not exist, a new document is created and assigned the identifier specified in `doc`. If the document already exists, the document is updated with the JSON document in the message body and given a new revision.
 
### Request

**Request headers**

* `Accept`—*optional*—Valid values are:
	* application/json
	* text/plain

 * `Content-Type`—*Required*—Must be application/json.

* `If-Match` – *Required for document updates f the `rev` query parameter is not supplied* —Revision identifier of the requested document. 

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `batch` | string | Stores the document in batch mode. To use, set the value to `ok`.| none  
| `rev`| string | Revision identifier | none  

### Response

**Status codes**

* 201 Created – Document created and stored on disk
* 202 Accepted – Document data accepted, but not yet stored on disk 
* 400 Bad Request – Invalid request body or parameters 
* 401 Unauthorized – Write privileges required
* 404 Not Found – Specified database or document ID doesn’t exist
* 409 Conflict – Document with the specified ID already exists or specified revision is not latest for target document

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* text/plain; charset=utf-8

* `ETag`—Revision identifier enclosed in double quotes

**Message body**

The response is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| id | String | Document identifier |  
| ok | Boolean | Indicates whether the operation was successful   
| rev |String | revision identifier |  

### Example

The following example creates a new document with the identifier `ButterChicken` in a database named `cookbook`.

**Request**

```
PUT /cookbook/ButterChicken HTTP/1.1
Host: localhost:59840
Content-Type: application/json

{
    "description": "A very buttery chicken dish",
    "nutrition": "500 calories",
    "servings": 4,
    "title": "Butter Chicken"
}
```

**Response**

```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Length: 92
Content-Type: application/json
Date: Fri, 13 Dec 2013 19:34:04 GMT
Etag: "1-4101356e9c47d15d4f8f7390d05dbbcf"
Location: http://localhost:59840/cookbook/ButterChicken
Server: CouchbaseLite 1.486

{
  "id" : "ButterChicken",
  "rev" : "1-4101356e9c47d15d4f8f7390d05dbbcf",
  "ok" : true
}
```

The following example updates the document with the identifier `ButterChicken` that was created in the previous example. To update an existing document, the revision identifier of the current document must be supplied in an `If-Match` header or a `rev` query parameter. This example shows how to use both methods of specifying the revision.

**Request**

This form of the request uses the `If-Match` header to supply the revision identifier:

```
PUT /cookbook/ButterChicken HTTP/1.1
Host: localhost:59840
Content-Type: application/json
If-Match: 1-4101356e9c47d15d4f8f7390d05dbbcf

{
    "description": "A very buttery chicken dish",
    "nutrition": "500 calories",
    "serving-suggestion": "Serve with rice and green beans.",
    "servings": 4,
    "title": "Butter Chicken"
}
```

To use the `rev` query parameter rather than the `If-Match` header to supply the revision identifier, structure the request like this:

```
PUT /cookbook/ButterChicken?rev=1-4101356e9c47d15d4f8f7390d05dbbcf HTTP/1.1
Host: localhost:59840
Content-Type: application/json

{
    "description": "A very buttery chicken dish",
    "nutrition": "500 calories",
    "serving-suggestion": "Serve with rice and green beans.",
    "servings": 4,
    "title": "Butter Chicken"
}
```

**Response**

```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Length: 92
Content-Type: application/json
Date: Fri, 13 Dec 2013 19:56:09 GMT
Etag: "2-1b76d07281d4a576130c7d8f9f621d5e"
Location: http://localhost:59840/cookbook/ButterChicken
Server: CouchbaseLite 1.486

{
  "id" : "ButterChicken",
  "rev" : "2-1b76d07281d4a576130c7d8f9f621d5e",
  "ok" : true
}
```


## GET /{db}/{doc}

This request retrieves a document from a database.

### Request

**Request headers**

* `Accept`—*optional*—Valid values are:
	* application/json
	* multipart/mixed
	* text/plain

* `If-None-Match`—*optional*—Document revision identifier enclosed in double quotes

**Query parameters**

The following query parameters are all optional.

| Name | Type | Description | Default |  
|  ------	| ------	| ------	| ------	|  
| `attachments` | Boolean | Include attachment bodies in response | false |  
| `att_encoding_info` | Boolean | Include encoding information in attachment stubs if the attachment is compressed | false |  
| `atts_since` | array | Include attachments only since specified revisions. Does not include attachments for specified revisions | none |  
| `conflicts` | Boolean | Include information about conflicts in document | false |  
| `deleted_conflicts` | Boolean | Include information about deleted conflicted revisions | false |  
| `latest` | Boolean | Force retrieval of latest leaf revision, no matter what revision was requested | false  
| `local_seq` | Boolean | Include last update sequence number for the document | false  
| `meta` | Boolean | Acts same as specifying all conflicts, deleted_conflicts and open_revs query parameters | false  
| `open_revs` | array | Retrieve documents of specified leaf revisions. You can specify  the value `all` to return all leaf revisions | none  
| `rev` | string | Retrieve the specified revision of the document | none  
| `revs` | Boolean | Include a list of all known document revisions | false  
| `revs_info` | Boolean | Include detailed information for all known document revisions | false

### Response

The response contains a JSON document in the message body.

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* multipart/mixed
	* text/plain; charset=utf-8

* `ETag`—Document revision identifier contained in double quotes.

* `Transfer-Encoding`—This header appears when the request uses the `open-revs` query parameter. The value is `chunked`.

**Message body**

The message body contains the following objects in a JSON document.

| Name | Type | Description |  
|  ------	| ------	| ------	|  
| `_id` | string | Document identifier  
| `_rev `| string | revision identifier  
|  `_deleted` | Boolean | Indicates whether the document is deleted. Appears only when the document was deleted.  
| _`attachments` | object | Stubs for the attachments. Appears only when the document has attachments.  
| `_conflicts` | array | List of revisions with conflicts. Appears only when the request uses the `conflicts=true` query parameter.
| `_deleted_conflicts` | array | List of revisions with conflicts that were deleted. Appears only when the request uses the `deleted_conflicts=true` query parameter.  
| `_local_seq` | integer | Sequence number of the document in the database. Appears only when the request uses the `local_seq=true` query parameter.
| `_revs_info` | array | List of objects with information about local revisions and their status. Appears only when the request uses the `open_revs=true` query parameter.  
| `_revisions` | object | List of locals revision identifiers. Appears only when the request uses the `revs=true` query parameter.

### Example


The following example retrieves a document with the identifier `beer_#17_Cream_Ale` from a database named `beer-db`. Because the identifier contains a number sign (#) character, the identifier must be URL encoded in the URI.


**Request**

```
GET /beer-db/beer_%2317_Cream_Ale HTTP/1.1
Host: localhost:59840
```

**Response**

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: must-revalidate
Content-Length: 259
Content-Type: application/json
Date: Thu, 12 Dec 2013 21:12:28 GMT
Etag: "1-431506b53aeac96a225e619cfa7bb569"
Server: CouchbaseLite 1.486

{
  "category" : "North American Lager",
  "brewery" : "Big Ridge Brewing",
  "style" : "American-Style Lager",
  "updated" : "2010-07-22 20:00:20",
  "_id" : "beer_#17_Cream_Ale",
  "_rev" : "1-431506b53aeac96a225e619cfa7bb569",
  "name" : "#17 Cream Ale"
}
```

## DELETE /{db}/{doc}

This request deletes a document from the database. When a document is deleted, the revision number is updated so the database can track the deletion in synchronized copies.

### Request

**Request headers**

* `Accept`—*optional*—Valid values are:
	* application/json
	* text/plain

* `If-Match` – *Required if the `rev` query parameter is not supplied* —Revision identifier of the requested document. 

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `batch` | string | Stores the document in batch mode. To use, set the value to `ok`.| none  
| `rev`| string | Revision identifier | none  

**Message body**

None
### Response

**Status codes**

* 200 OK – Document successfully removed
* 202 Accepted – Request was accepted, but changes are not yet stored on disk
* 400 Bad Request – Invalid request body or parameters
* 401 Unauthorized – Write privileges required
* 404 Not Found – Specified database or document ID doesn’t exists
* 409 Conflict – Specified revision is not the latest for target document

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* text/plain; charset=utf-8

* `ETag`—Revision identifier enclosed in double quotes

**Message body**

The response is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| id | String | Document identifier |  
| ok | Boolean | Indicates whether the operation was successful   
| rev |String | revision identifier |  

### Example

Request

```
DELETE /cookbook/ButterChicken?rev=2-1b76d07281d4a576130c7d8f9f621d5e
Host: localhost:59840
```

Response

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Type: application/json
Date: Fri, 13 Dec 2013 20:52:38 GMT
Etag: "3-7c9a006fb9938b0994cb06a9c11521e7"
Server: CouchbaseLite 1.486
Transfer-Encoding: chunked

{
  "id" : "ButterChicken",
  "rev" : "3-7c9a006fb9938b0994cb06a9c11521e7",
  "ok" : true
}
```

## PUT /{db}/{doc}/{attachment}

This request adds or updates the supplied request content as an attachment to the specified document. The attachment name must be a URL-encoded string (the file name). You must also supply either the `rev` query parameter or the `If-Match` HTTP header for validation, and the `Content-Type` headers (to set the attachment content type).

When uploading an attachment using an existing attachment name, the corresponding stored content of the database will be updated. Because you must supply the revision information to add an attachment to the document, this serves as validation to update the existing attachment.

Uploading an attachment updates the corresponding document revision. Revisions are tracked for the parent document, not individual attachments.
### Request

**Request headers**

 * `Content-Type`—*Required*—MIME type of the attachment.

* `If-Match` – *Required if the `rev` query parameter is not supplied* —Revision identifier of the requested document. 

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `rev`| string | Revision identifier | none  

**Message body**

The message body contains the attachment, in the format specified in the `Content-Type` header.

### Response

**Status codes**

* 200 OK – Attachment successfully removed
* 202 Accepted – Request was accepted, but changes are not yet stored on disk
* 400 Bad Request – Invalid request body or parameters
* 401 Unauthorized – Write privileges required
* 404 Not Found – Specified database, document or attachment was not found
* 409 Conflict – Document’s revision wasn’t specified or it’s not the latest

**Response headers**

* `Accept-Ranges` – Range request aware. Used for attachments with application/octet-stream
* `Content-Encoding` – Used compression codec. Available if the attachment’s content is a compressible type.
* `Content-Length` – Attachment size. If compression codec is used, this value represents the compressed size, not the actual size.
* `Content-MD5` – Base64 encoded MD5 binary digest
* `ETag`—Revision identifier enclosed in double quotes

**Message body**

The response is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| id | String | Document identifier |  
| ok | Boolean | Indicates whether the operation was successful   
| rev |String | revision identifier |  

### Example

The following example adds a plain text attachment to the document identified by `LemonChicken` in the `cookbook` database.

**Request**

```
PUT /cookbook/LemonChicken/lcnote.txt?rev=1-78abf9a6508671ba8338e4ef6daa910a HTTP/1.1
Host: localhost:59840
Content-Type: text/plain

Some notes about the Lemon Chicken recipe from testers

* This recipe is fabulous
* I wish it made more servings
```

**Response**

```
HTTP/1.1 201 Created
Accept-Ranges: bytes
Content-Length: 91
Content-Type: application/json
Date: Fri, 13 Dec 2013 22:52:49 GMT
Etag: "2-6847bbc089e24db84bd0371b9c169566"
Location: http://localhost:59840/cookbook/LemonChicken/lcnote.txt
Server: CouchbaseLite 1.486

{
  "id" : "LemonChicken",
  "rev" : "2-6847bbc089e24db84bd0371b9c169566",
  "ok" : true
}
```

## GET /{db}/{doc}/{attachment}

This request retrieves the file attachment associated with the document. The raw data of the associated attachment is returned (just as if you were accessing a static file). The returned content is the same content type set when the document attachment was added to the database.
### Request

**Request headers**

* `If-Match` – *Optional* —Revision identifier of the requested document. Alternative to the `rev` query parameter

* `If-None-Match`—*Optional*—The attachment’s Base64-encoded MD5 binary digest.


**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `rev`| string | Revision identifier | none  

**Message body**

### Response

**Status codes**

* 200 OK – Attachment exists
* 304 Not Modified – Attachment wasn’t modified if ETag equals specified If-None-Match header
* 401 Unauthorized – Read privilege required
* 404 Not Found – Specified database, document or attachment was not found

**Response headers**

* `Accept-Ranges` – Range request aware. Used for attachments with application/octet-stream
* `Content-Encoding` – Used compression codec. Available if the attachment’s content is a compressible type.
* `Content-Length` – Attachment size. If compression codec is used, this value represents the compressed size, not the actual size.
* `Content-MD5` – Base64 encoded MD5 binary digest
* `ETag`—Revision identifier enclosed in double quotes

**Message body**

The message body contains the attachment, in the format specified in the `Content-Type` header.

### Example

**Request**

The following request retrieves the attachment that was added in the previous example.

```
GET http://localhost:59840/cookbook/LemonChicken/lcnote.txt?rev=2-6847bbc089e24db84bd0371b9c169566
Host: localhost:59840
```

**Response**

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: must-revalidate
Content-Length: 112
Content-Type: text/plain; charset=UTF-8
Date: Fri, 13 Dec 2013 22:59:25 GMT
Etag: "2-6847bbc089e24db84bd0371b9c169566"
Server: CouchbaseLite 1.486

Some notes about the Lemon Chicken recipe from testers

* This recipe is fabulous
* I wish it made more servings
```

## DELETE /{db}/{doc}/{attachment}

This request deletes an attachment to the specified document. To delete an attachment, you must supply the `rev` query parameter or `If-Match` header with the current revision identifier.
### Request

**Request headers**

* `Accept`—*optional*—Valid values are:
	* application/json
	* text/plain

* `If-Match` – *Required if the `rev` query parameter is not supplied* —Revision identifier of the requested document. 

**Query parameters**

| Name | Type | Description | Default  
|  ------	| ------	| ------	| ------	|  
| `batch` | string | Stores the document in batch mode. To use, set the value to `ok`.| none  
| `rev`| string | Revision identifier | none  

**Message body**

None
### Response

**Status codes**

* 200 OK – Attachment successfully removed
* 202 Accepted – Request was accepted, but changes are not yet stored on disk
* 400 Bad Request – Invalid request body or parameters
* 401 Unauthorized – Write privileges required
* 404 Not Found – Specified database, document or attachment was not found
* 409 Conflict – Document’s revision wasn’t specified or it’s not the latest

**Response headers**

* `Content-Type`—The value can be:
	* application/json
	* text/plain; charset=utf-8

* `ETag`—Revision identifier enclosed in double quotes

**Message body**

The response is a JSON document that contains the following objects:

|Name|Type|Description|  
| ------	| ------	| ------	|  
| id | String | Document identifier |  
| ok | Boolean | Indicates whether the operation was successful   
| rev |String | revision identifier |  

### Example

The following example deletes the attachment that was added in a previous example.

**Request**

```
DELETE /cookbook/LemonChicken/lcnote.txt?rev=2-6847bbc089e24db84bd0371b9c169566
Host: localhost:59840
```

**Response**

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 91
Content-Type: application/json
Date: Sat, 14 Dec 2013 00:32:26 GMT
Etag: "3-6210945863a15ee7eff1e540133d19da"
Server: CouchbaseLite 1.486

{
  "id" : "LemonChicken",
  "rev" : "3-6210945863a15ee7eff1e540133d19da",
  "ok" : true
}
```


