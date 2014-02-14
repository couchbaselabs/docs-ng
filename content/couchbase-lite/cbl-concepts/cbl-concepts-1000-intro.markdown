# Introduction

This guide provides a platform-independent overview of Couchbase Lite that focuses on what it is and how it works with your data.

**Couchbase Lite** is a lightweight, document-oriented (NoSQL), syncable database engine suitable for embedding into mobile apps.

**Lightweight** means:

* Embedded—the database engine is a library linked into the app, not a separate server process.
* Small code size—important for mobile apps, which are often downloaded over cell networks.
* Quick startup time—important because mobile devices have relatively slow CPUs.
* Low memory usage—typical mobile data sets are relatively small, but some documents might have large multimedia attachments.
* Good performance—exact figures depend on your data and application, of course.

**Document-oriented** means:

* Stores records in flexible [JSON](http://json.org) format instead of requiring predefined schemas or normalization.
* Documents can have arbitrary-sized binary attachments, such as multimedia content.
* Application data format can evolve over time without any need for explicit migrations.
* MapReduce indexing provides fast lookups without needing to use special query languages.

**Syncable** means:

* Any two copies of a database can be brought into sync via an efficient, reliable, proven replication algorithm.
* Sync can be on-demand or continuous (with a latency of a few seconds).
* Devices can sync with a subset of a large database on a remote server.
* The sync engine supports intermittent and unreliable network connections.
* Conflicts can be detected and resolved, with app logic in full control of merging.
* Revision trees allow for complex replication topologies, including server-to-server (for multiple data centers) and peer-to-peer, without data loss or false conflicts.

Couchbase Lite provides native APIs for seamless iOS (Objective-C) and Android (Java) development. In addition, it includes the Couchbase Lite Plug-in for PhoneGap, which enables you to build iOS and Android apps that you develop by using familiar web-application programming techniques and the [PhoneGap mobile development framework](http://phonegap.com).

## Features

Major features of Couchbase Lite:

  * **JSON-based**. Every document is a [JSON](http://json.org) object consisting of freeform key-value pairs. The values can contain arrays or even nested objects.This lets you structure your data in a way that's natural to your app, without having to deal with complex data normalization or joins.
  * **Schemaless**. This means that you don't have to define a rigid data layout beforehand, and later go through complex migrations if you need to update it. Data layout is somewhat freeform, and records, called *documents*, can have different structures. A sophisticated MapReduce query engine enables you to perform efficient queries, even on large data sets, regardless of how you structure the data in your documents.
  * Provides **native, object-oriented APIs for iOS and Android devices** that integrate with your app framework. These APIs can map database documents to your own native object model, let you work directly with JSON structures, or both. Additionally, apps built with web technologies can use the Couchbase Lite REST API (for example, JavaScript, C#, or Python applications).
  * Supports **replication** with compatible database servers. This gives your app best-of-breed sync capabilities. Not only can the user's data stay in sync across multiple devices, but multiple users' data can be synced together.
  * Supports **peer-to-peer replication**. By adding an extra HTTP listener component, your app can accept connections from other devices running Couchbase Lite and exchange data with them.
 * Supports **low-latency** and even **offline** access to data. In contrast with the frequent network request and response cycle of a traditional networked app, you work primarily with local data. This means your app remains responsive whether it's on WiFi, a slow cell network, or offline. The user can even modify data while offline, and it'll be synced to the server as soon as possible.

## Why Use Couchbase Lite?

The world has gone mobile—both businesses and consumers have leapt on the bandwagon. By using Couchbase Lite, you can provide your customers with a seamless mobile experience.

Businesses are moving to mobile solutions to provide better customer experiences and operate their businesses more efficiently.

Today's consumers rely on mobile apps to organize their lives and keep up with family and friends. They have smartphones *and* tablets. They want to keep their data synched between multiple devices *and* multiple people. For example, all members of a family could use an app that helps them coordinate schedules and shopping lists.

### JSON Anywhere

By using flexible JSON documents rather than a rigid schema, your database can evolve over time without impacting the user experience. Your users can count on having an amazing app experience with a fast and unbreakable local database.

Couchbase Lite provides an ultra-lightweight, reliable, secure JSON database built for all your online and offline mobile application needs.

### Easy Sync

Couchbase Lite provides a sync solution that already works. It's easy to set up, easy to manage, and easy to scale. Data syncing is crucial for mobile apps because it:

* Lets users work with their data on multiple devices, from phones to desktop computers.

* Lets groups of users collaborate on shared data.

* Lets companies update data sets (whether corporate databases or restaurant directories) in one central place and have the updates delivered efficiently to clients.

* Makes apps more responsive, and even lets users work offline, by _taking network I/O out of the critical path_. The app's UI operates on local data, and syncing runs in the background.

However, syncing is very difficult to implement properly. It requires special metadata (like vector clocks or revision trees), has to handle network partition and data conflicts, and its algorithms have to work incrementally and be highly failure-tolerant. Some mobile developers have waded into ad-hoc sync implementations and found themselves in over their heads, with delayed or canceled products. Couchbase Lite has sync compatibility with a solution that already works, Couchbase Sync Gateway. 


### Use Cases

We've been working with community users and customers on use cases like these:

* Medical Records—medical data is a great fit for schemaless JSON storage. It's also critical that it be available wherever the health care provider goes, regardless of network conditions.

* Customer Loyalty and Point of Sale—we see a lot of these apps already using our sync technology, and we've been working with some developers closely to ensure a smooth ride.

* Airline—pilots and flight attendants benefit from having easy access to data about passengers and flight plans, with the ability to dynamically refresh the data when they are on the ground.

* Fleet Management—tracking vehicle telemetry and routing it to the cloud when connections are available is a great fit for Couchbase Mobile.

* Social Media—chat and game companies often take a portfolio approach. By offloading the details of pushing data across mobile networks, they can focus on rolling out compelling content that uses a common backbone.
