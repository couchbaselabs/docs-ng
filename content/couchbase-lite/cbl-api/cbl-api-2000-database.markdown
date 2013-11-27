# Database Resources

Database resources provide an interface to an entire database. 
The following table lists the database resources:

|HTTP Method | Path Template | Description  |
| ------	| ------	| ------	|  
| GET    | /db                     | Retrieves information about the database 
| PUT    | /db                     | Creates a new database
| DELETE | /db                     | Deletes a database 
| GET    | /db/_all_docs           | Returns a built-in view of all documents in the database  
| POST   | /db/_all_docs           | Returns certain rows from the built-in view of all documents   
| POST   | /db/_bulk_docs          | Inserts multiple documents into the database in a single request
| GET    | /db/_changes            | Returns changes for the given database  
| POST   | /db/_compact            | Starts a compaction for the database  
| POST   | /db/_purge              | Purges some historical documents entirely from database history  
| POST   | /db/_temp_view          | Executes a given view function for all documents and returns the result    |

In each path template, `db` represents the database on which you want to operate.

## GET /db

Retrieves information about the database.

Request summary:

* **Request**: `GET /db`
* **Request body**: none
* **Response body**: A JSON document that contains information about the database.
* **HTTP status codes**:

Sample request:

```
GET /cookbook
```

Objects in the returned JSON document:

| Object | Type |Description |  
|  ------	| ------	|  
|committed_update_seq | Integer |Number of committed updates to the database 
| db_name | String|Name of the database
| db_uuid |String |Database identifier
| disk_format_version |Integer |Database schema version
| disk_size |Integer |Total amount of data stored on the disk. Units: bytes 
|doc_count |Integer |Number of documents in the database
| instance_start_time | Integer|Date and time the database was opened. Units:  microseconds since the epoch (1 January 1970)
| purge_seq |Integer|Returns 0.
|update_seq |Integer  |Number of updates to the database
   

## PUT /db

Creates a new database.

Sample request:

	PUT /cookbook

## DELETE /db

Deletes a database.

Sample request:

	DELETE /cookbook

## GET /db/_all_docs
Returns a built-in view of all documents in the database.

Sample request:

	GET /cookbook/_all_docs



## POST /db/_all_docs
Returns certain rows from the built-in view of all documents.

Sample request:

	POST /cookbook/_all_docs



## POST /db/_bulk_docs
Inserts multiple documents into the database in a single request.

Sample request:

	POST /cookbook/_bulk_docs



## GET  /db/_changes
Returns changes for the given database.

Sample request:

	GET /cookbook/_changes


## POST /db/_compact 
Starts a compaction for the database.

Sample request:

	POST /cookbook/_compact


## POST /db/_purge
Purges some historical documents entirely from database history.

Sample request:

	POST /cookbook/_purge


## POST /db/_temp_view
Executes a given view function for all documents and returns the result.

Sample request:

	POST /cookbook/_temp_view


