# Couchbase Lite Architecture

Couchbase Mobile adds Couchbase Lite and Sync Gateway to your technology stack.

Couchbase Lite enables sync on iOS and Android devices with a flexible, embedded JSON-based database that works with Sync Gateway and Couchbase Server to handle the server side of your app synchronization connections. In production, you run Sync Gateway and use Couchbase Server for storage so you can handle a growing user base with confidence.

Couchbase Server is deployed behind your firewall (as databases normally are). Sync Gateway is deployed on a server that can be accessed by mobile devices over the Internet and can also reach Couchbase Server. Mobile devices connect to Sync Gateway, which facilitates sync and enforces access control and update validation policies.

## Mobile Technology Stack

The mobile technology stack consists of:

* Your Couchbase Lite-powered application—with Couchbase Lite embedded you have fine-grained control over data access and routing. For each document in the database, you specify a set of channels the document belongs to and for each user or device, you control which channels they can access.

* Sync Gateway—a server that manages HTTP-based data access for mobile clients. It handles access control and data routing, so that a single large Couchbase Server cluster can manage data for multiple users and complex applications.

* Couchbase Server—a high performance, scalable, NoSQL document database that's been battle-tested in heavy traffic, mission-critical deployments serving millions of users.

The following diagram illustrates the mobile technology stack:

<img src="images/mobile-solution.png" width="100%" />


