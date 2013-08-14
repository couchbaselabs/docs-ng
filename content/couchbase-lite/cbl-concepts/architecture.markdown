# Couchbase Lite Architecture

Couchbase Lite enables sync on iOS and Android devices and includes Sync Gateway to handle the server side of your app synchronization connections. In production, you run Sync Gateway and use Couchbase Server for storage so you can handle a growing user base with confidence.

## Mobile Technology Stack

The mobile technology stack consists of:

* [Couchbase Server](http://www.couchbase.com/couchbase-server/overview) &mdash; a high performance, scalable, NoSQL document database that's been battle-tested in heavy traffic, mission-critical deployments serving millions of users.

* [Couchbase Lite](https://github.com/couchbase/couchbase-lite-ios) &mdash; a lightweight NoSQL database for [iOS](https://github.com/couchbase/couchbase-lite-ios) and [Android](https://github.com/couchbase/couchbase-lite-android) that provides a native API as well as robust synchronization capabilities by using the standard Apache CouchDB-compatible replication protocol.

* [Sync Gateway](https://github.com/couchbaselabs/sync_gateway) &mdash; a component of Couchbase Lite that manages HTTP-based data access for mobile clients. It handles access control and data routing, so that a single large Couchbase Server cluster can manage data for multiple users and complex applications.

* **Your Application** -- with Couchbase Lite embedded in your application you have fine-grained control over data access and routing. For each document, you specify a set of [channels it belongs to, and for each user or device, you control which channels they can see.](https://github.com/couchbaselabs/sync_gateway/wiki/channels-access-control-and-data-routing-w-sync-function)

The following diagram illustrates the mobile technology stack:

<img src="images/architecture.png" width="75%" />

Couchbase Server should be deployed behind your firewall (like databases normally are). Sync Gateway should be deployed on a server that can be accessed by mobile devices over the Internet and reach Couchbase Server. Mobile devices connect to Sync Gateway, which enforces access control and update validation policies.



### Scaling the Architecture

