# Couchbase Lite Architecture

Couchbase Lite enables sync on iOS and Android devices with a flexible, embedded JSON-based database that works with Sync Gateway and Couchbase Server to handle the server side of your app synchronization connections. In production, you run Sync Gateway and use Couchbase Server for storage so you can handle a growing user base with confidence. For development Couchbase Server is optional—you can instead use a very simple, built-in data store called Walrus.


## Mobile Technology Stack

The mobile technology stack consists of:

* **Your Application**—with Couchbase Lite embedded in your application you have fine-grained control over data access and routing. For each document, you specify a set of [channels it belongs to, and for each user or device, you control which channels they can see.](https://github.com/couchbaselabs/sync_gateway/wiki/channels-access-control-and-data-routing-w-sync-function)

* [Couchbase Lite](https://github.com/couchbase/couchbase-lite-ios)—a lightweight NoSQL database for [iOS](https://github.com/couchbase/couchbase-lite-ios) and [Android](https://github.com/couchbase/couchbase-lite-android) devices that provides REST and native APIs, as well as robust synchronization capabilities.

* [Sync Gateway](https://github.com/couchbaselabs/sync_gateway)— a server that manages HTTP-based data access for mobile clients. It handles access control and data routing, so that a single large Couchbase Server cluster can manage data for multiple users and complex applications.

* [Couchbase Server](http://www.couchbase.com/couchbase-server/overview)—a high performance, scalable, NoSQL document database that's been battle-tested in heavy traffic, mission-critical deployments serving millions of users.




The following diagram illustrates the mobile technology stack:

<img src="images/architecture.png" width="75%" />

Couchbase Server should be deployed behind your firewall (as databases normally are). Sync Gateway should be deployed on a server that can be accessed by mobile devices over the Internet and can also reach Couchbase Server. Mobile devices connect to Sync Gateway, which enforces access control and update validation policies.



### Scaling the Architecture

