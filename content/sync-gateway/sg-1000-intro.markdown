# Introduction

Couchbase Server Sync Gateway is an add-on that enables Couchbase Server 2.0 and later to act as a replication endpoint for Couchbase Lite. Sync Gateway runs an HTTP listener process that provides a passive replication endpoint and uses a Couchbase Server bucket as persistent storage for all database documents.


## Architecture

Sync Gateway provides an HTTP front-end for Couchbase Server that syncs with Couchbase Lite. The following figure shows how Sync Gateway interacts with mobile apps and Couchbase Server.

![](images/architecture.png)

