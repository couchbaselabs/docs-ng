# Introduction

This reference manual provides information for developers who want to use the Couchbase Lite REST API to develop apps for mobile devices. To get an overview of Couchbase Lite, read the [Couchbase Lite Concepts Guide](/couchbase-lite/cbl-concepts/).

<div class=notebox>
<p>Work In Progress</p>
<p>The Couchbase Lite REST API Reference is a work in progress. All the APIs that Couchbase Lite supports are listed in this document, but some of them are not  documented yet.</p>
<p>If you want to help fill in the gaps, please feel free to fork the <a href="https://github.com/couchbaselabs/docs-ng">official Couchbase documentation repository</a> on GitHub, make documentation updates in your fork, and then send a pull request.</p>
<p>If you have questions about the REST API, please ask them on the <a href="https://groups.google.com/forum/#!forum/mobile-couchbase"> Couchbase Mobile mailing list</a>.</p>
</div>
## Resource Groups
The REST API enables you to interact with all of your database resources. The Couchbase Lite REST API is divided into the following logical groups of resources:

| Resource Group | Description|  
|  ------	| ------	|  
| [Database](#database-resources) | APIs that operate on the whole database|  
| [Document](#document-resources) |APIs that operate on individual documents |  
| [Local Document](#local-document-resources) | APIs that operate on local documents that are not replicated|  
| [Design Document](#design-document-resources) | APIs that operate on design documents (for views)|  
| [Server](#server-resources) | APIs that operate on the database host server|  
| [Authentication](#authentication-resources) | APIs that operate on session and authentication data|  

## HTTP requests and responses
The Couchbase Lite REST API uses the [Hypertext Transfer Protocol (HTTP)](http://www.w3.org/Protocols/rfc2616/rfc2616.html). Each API is an HTTP request. For each HTTP request that you send, you receive an HTTP response. HTTP requests consist of a request line, header lines, and a message body. HTTP responses consist of a status line, header lines, and a message body. 

The message body for both the HTTP requests and HTTP responses is formatted as a JSON document. To learn more about JSON, check out [JSON.org](http://json.org) or the [W3Schools JSON Tutorial](http://www.w3schools.com/json/).

The examples in this document are shown in the basic HTTP format.

The following table lists some of the status codes returned by Couchbase Lite:

| HTTP Status Code | Returned String |  
|  ------	| ------	|  
200 | OK
201 | Created
202 | Accepted
400 | Bad data encoding
400 | bad_request
400 | Invalid attachment
400 | Invalid database/document/revision ID
400 | Invalid JSON
400 | Invalid parameter in HTTP query or JSON body
401 | unauthorized
403 | forbidden
404 | Attachment not found
404 | deleted
404 | not_found
406 | not_acceptable
409 | conflict
412 | file_exists
415 | bad_content_type
500 | Application callback block failed
500 | Attachment store error
500 | Database error!
500 | Database locked
500 | Internal error
500 | Invalid data in database
502 | Invalid response from remote replication server


## Notation Conventions

Within the paths of the URIs presented in this reference manual:

* Path segments that start with an underscore character are static components of the URI that you use exactly as given. For example: `_replicate`.

* Path segments that are not preceded by an underscore character represent variables that you replace with your own value. These variables are usually enclosed in brackets as a reminder. For example: `{db}` or `<db>`.

For example, suppose you have a database named cookbook. In the database, the IDs for recipes start with the string "recipe" and IDs for design documents start with the string "ddoc". The following table shows examples of values you might use for the URI path in the request that you send to the database:

|Path | Sample value |  
| ------	| ------	|  
|`/<db>` | `/cookbook` |  
| `/<db>/_changes` | `/cookbook/_changes` |  
| `/<db>/<doc>` | `/cookbook/recipe123` |  
| `/<db>/_design/<design-doc>`  |` /cookbook/_design/ddoc456` |  
| `/_replicate`  | `/_replicate` |
