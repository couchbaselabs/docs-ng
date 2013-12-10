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
| `POST`   | `/{db}/_revs_diff`          | Returns a list of differences from the supplied document|
| `POST`   | `/{db}/_temp_view`          | Executes a given view function for all documents and returns the result    |

In the URI patterns, `db` represents the name of the database on which you want to operate.

## PUT /{db}

This request creates a new database. The database name must begin with a lowercase letter. The legal characters for the database name are: lowercase letters \[`a-z`], digits \[`0-9`], and special characters \[`$_()+-/`].
###Request
The request uses the following syntax:

```
PUT /<db> HTTP/1.1
Host: <server:port>
```

### Response
The response contains a JSON document.


|Name | Type | Description|  
| ------	| ------	| ------	|  
|error | String | Error message|  
|ok| Boolean | Indicates whether the operation was successful|  
|status | Integer | HTTP error code|  

### Example

The following example creates a new database named `cookbook`.

**Request**

```
PUT /cookbook HTTP/1.1
Host: http://10.0.0.7:59840
```
	
**Response**

```
HTTP/1.1 201 Created
Server: CouchbaseLite 1.485
Location: http://10.0.0.7:59840/cookbook
Accept-Ranges: bytes
Content-Length: 18
Content-Type: application/json
Date: Sun, 08 Dec 2013 20:17:16 GMT

{
  "ok" : true
}
```

The following example shows the error you receive when requesting creation of a database that already exists:

**Request**

```
PUT /cookbook HTTP/1.1
Host: http://10.0.0.7:59840
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

## GET /{db}

This request retrieves information about a database.

### Request
The request uses the following syntax:

```
GET /<db> HTTP/1.1
Host: <server:port>
```

### Response

The response is a JSON document that contains the following objects:

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
Host: 10.17.15.239:59840
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

The following example shows the response returned when you request information about a database that does not exist on the server. The example requests information from a server located at 10.0.0.7:59840 about a database named `cookbook`, which does not exist on that server.

**Request**

```
GET /cookbook HTTP/1.1
Host: 10.0.0.7:59840
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

The request uses the following syntax:

	DELETE /<db> HTTP/1.1
	Host: <server:port>


### Response
### Example

**Request**

```
DELETE /genealogy HTTP/1.1
Host: 10.0.0.7:59840
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

Sample request:

	GET /cookbook/_all_docs


## POST /{db}/_all_docs
This request retrieves specific documents from the built-in view of all documents.

Sample request:

	POST /cookbook/_all_docs


## /{db}/_bulk_docs
This request inserts multiple documents into the database in a single request.

Sample request:

	POST /cookbook/_bulk_docs


## GET /{db}/_changes
Returns changes for the given database.

Sample request:

	GET /cookbook/_changes


## POST /{db}/_compact 
Starts a compaction for the database.

Sample request:

	POST /cookbook/_compact


## POST /{db}/_purge
Purges some historical documents entirely from the database history.

Sample request:

	POST /cookbook/_purge



## POST /{db}/_revs_diff
## POST /{db}/_temp_view
Executes a view function for all documents and returns the result.

Sample request:

	POST /cookbook/_temp_view
