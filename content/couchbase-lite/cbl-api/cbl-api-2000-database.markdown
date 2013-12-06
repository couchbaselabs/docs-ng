# Database Resources

Database resources provide an interface to an entire database. 
The following table lists the database resources:

|HTTP Method | URI pattern | Description  |
| ------	| ------	| ------	|  
| `GET`    | `/{db}`                     | Retrieves information about the database 
| `PUT`    | /`{db}`                     | Creates a new database
| `DELETE` | `/{db}`                     | Deletes a database 
| `GET`    | `/{db}/_all_docs`           | Retrieve the built-in view of all documents in the database  
| `POST`   | `/{db}/_all_docs`           | Retrieves specified documents from the built-in view of all documents in the database   
| `POST`   | `/{db}/_bulk_docs`          | Inserts multiple documents into the database in a single request
| `GET`    | `/{db}/_changes`            | Returns changes for the given database  
| `POST`   | `/{db}/_compact`            | Starts a compaction for the database  
| `POST`   | `/{db}/_purge`              | Purges some historical documents entirely from database history  
| `POST`   | `/{db}/_temp_view`          | Executes a given view function for all documents and returns the result    |

In the URI patterns, `db` represents the name of the database on which you want to operate.

## Get database information

This request retrieves information about the database.

### Request summary

* **Request**: `GET /db`
* **Request body**: none
* **Response body**: A JSON document that contains information about the database.
* **HTTP status codes**:

### Request

#### Syntax

```
GET /{db} HTTP/1.1
Host: {host:port}
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

The following example shows how 
#### Sample request
```
GET /cookbook HTTP/1.1
```

#### Sample response

## Create database

This request creates a new database.

Sample request:

	PUT /cookbook

## Delete database

This request deletes a database.

Sample request:

	DELETE /cookbook

## Get all documents
This request returns a built-in view of all documents in the database.

Sample request:

	GET /cookbook/_all_docs



## Get specific documents
This request retrieves specific documents from the built-in view of all documents.

Sample request:

	POST /cookbook/_all_docs



## Insert multiple documents
This request inserts multiple documents into the database in a single request.

Sample request:

	POST /cookbook/_bulk_docs



## GET database changes
Returns changes for the given database.

Sample request:

	GET /cookbook/_changes


## POST compact database 
Starts a compaction for the database.

Sample request:

	POST /cookbook/_compact


## POST purge database
Purges some historical documents entirely from the database history.

Sample request:

	POST /cookbook/_purge


## POST temporary view
Executes a given view function for all documents and returns the result.

Sample request:

	POST /cookbook/_temp_view


