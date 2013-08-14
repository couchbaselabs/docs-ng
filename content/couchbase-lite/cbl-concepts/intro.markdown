# Introduction


**Couchbase Lite** is a lightweight, document-oriented (NoSQL), syncable database engine suitable for embedding into mobile apps.

Think of it this way: If [Apache CouchDB](http://couchdb.apache.org) is MySQL, and [Couchbase Server](http://www.couchbase.com/couchbase-server/overview) is Oracle, then Couchbase Lite is [SQLite](http://www.sqlite.org).

**Lightweight** means:

* Embedded &mdash; the database engine is a library linked into the app, not a separate server process.
* Small code size &mdash; currently under 400kbytes. This is important to mobile apps, which are often downloaded over cell networks.
* Quick startup time on relatively slow CPUs &mdash; currently under 50ms on recent iPhones.
* Low memory usage with typical mobile data sets in which the number of documents is not huge but might have sizable multimedia attachments.
* Good performance with these CPUs and data sets. (Exact figures depend on your data and application, of course.)

**Document-oriented** means:

* Stores records in flexible [JSON](http://json.org) format instead of requiring predefined schemas or normalization.
* Documents can have arbitrary-sized binary attachments, such as multimedia content.
* Application data format can evolve over time without any need for explicit migrations.
* MapReduce indexing provides fast lookups without needing to use special query languages.

**Syncable** means:

* Any two copies of a database can be brought into sync via an efficient, reliable, proven replication algorithm.
* Sync can be on-demand or continuous (with a latency of a few seconds).
* The sync engine supports intermittent and unreliable network connections.
* Conflicts can be detected and resolved, with app logic in full control of merging.
* Revision trees allow for complex replication topologies, including server-to-server (for multiple data centers) and peer-to-peer, without data loss or false conflicts.

The native APIs are Objective-C (iOS, Mac) and Java (Android), but an optional internal REST API adapter allows it to be called from other languages like JavaScript and C#, for use in apps built with PhoneGap, Titanium or MonoTouch.

## Features

Major features of Couchbase Lite:

 * Supports **replication** with compatible database servers.  This gives your app best-of-breed sync capabilities. Not only can the user's data stay in sync across multiple devices, but multiple users' data can be synced together.
  * Supports **peer-to-peer replication**. By adding an extra HTTP listener component, your app can accept connections from other devices running Couchbase Lite and exchange data with them.
 * Supports **low-latency** and even **offline** access to data. In contrast with the frequent network request and response cycle of a traditional networked app, you work primarily with local data. This means your app remains responsive whether it's on WiFi, a slow cell network, or offline. The user can even modify data while offline, and it'll be synced to the server as soon as possible.
 * **Schemaless**. This means that you don't have to define a rigid data layout beforehand, and later go through complex migrations if you need to update it. Data layout is somewhat freeform, and records, called *documents*, can have different structures. A sophisticated MapReduce query engine enables you to perform efficient queries, even on large data sets, regardless of how you structure the data in your documents.
 * **JSON-based**. Every document is a [JSON](http://json.org) object consisting of freeform key-value pairs. The values can contain arrays or even nested objects. (If you're familiar with Cocoa's property-list format, JSON is almost identical.) This lets you structure your data in a way that's natural to your app, without having to deal with complex data normalization or joins.
 * Provides **native, object-oriented APIs for iOS and Android devices** that integrate with your app framework. These APIs can map database documents to your own native object model, let you work directly with JSON structures, or both. Additionally, apps built with web technologies such as PhoneGap can use the Couchbase Lite REST API from JavaScript or any language that has an HTTP client library (for example, C# or Python).
 * **Open-source**. Couchbase Lite is open-source, documented, and released under an Apache 2.0 license. In contrast to proprietary technologies such as iCloud and DropBox, you can use a hosted server or run your own.


[COUCHBASE_LITE]: https://github.com/couchbase/couchbase-lite-ios
[COUCHDB]: http://couchdb.apache.org
[SQLITE]: http://sqlite.org
[UUID]: http://en.wikipedia.org/wiki/Uuid
[CRUD]: http://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[MVCC]: http://en.wikipedia.org/wiki/Multiversion_concurrency_control
[GUIDE]: http://guide.couchdb.org
[WEBDAV]: http://en.wikipedia.org/wiki/Webdav
[MAPREDUCE]: http://en.wikipedia.org/wiki/MapReduce
[RESTAPI]: http://wiki.apache.org/couchdb/Complete_HTTP_API_Reference
[RELEASES_IOS]: http://files.couchbase.com/developer-previews/mobile/ios/CouchbaseLite/
[BUILDING]: https://github.com/couchbaselabs/couchbase-lite-ios/wiki/Building-Couchbase-Lite
[CBL_API]: http://couchbase.github.com/couchbase-lite-ios/docs/html/
[CBLDOCUMENT]: http://couchbase.github.com/couchbase-lite-ios/docs/html/interfaceCBLDocument.html
[GETTINGSTARTED]: http://shop.oreilly.com/product/0636920020837.do
[NOSQL]: http://en.wikipedia.org/wiki/NoSQL


## Why Use Couchbase Lite?

In a word: **Sync**. Data syncing is crucial for mobile apps because it:

* Lets users work with their data on multiple devices, from phones to desktop computers.
* Lets groups of users collaborate on shared data.
* Lets companies update data sets (whether corporate databases or restaurant directories) in one central place and have the updates delivered efficiently to clients.
* Makes apps more responsive, and even lets users work offline, by _taking network I/O out of the critical path_. The app's UI operates on local data, and syncing runs in the background.

However, syncing is very difficult to implement properly. It requires special metadata (like vector clocks or revision trees), has to handle network partition and data conflicts, and its algorithms have to work incrementally and be highly failure-tolerant. Some mobile developers have waded into ad-hoc sync implementations and found themselves in over their heads, with delayed or canceled products. Couchbase Lite provides a sync solution that already works.

### Couchbase Lite vs. Cloud Sync Services

Couchbase Lite offers many advantages over proprietary cloud sync services such as iCloud or Dropbox. Consider the following:

**Conflict Resolution.** This is important and hard to get right. The app is ultimately responsible for merging changes within a record, but the sync framework needs to identify the conflicting revisions. Couchbase Lite tracks revision histories and propagates a tree of revisions, which is the most reliable way to do it.

**Flexible Schema.** iCloud's structured storage is accessed via Core Data, which is an object-relational mapping and thus strongly schema-based. You can update a Core Data app's schema, but migrating existing data can be tricky. NoSQL databases like Couchbase Lite are a lot more flexible about how data is stored, so this is less of an issue.

**Sharing.** iCloud syncs only between devices owned by the same person. Couchbase Lite can do that, share in small groups (for example, Glassboard and GroupMe), or publish to the public (like a blog or Instagram). Hybrids of those are possible too.

**Cross-Platform.** iOS users might also have an Android device or run Linux on their PC. iCloud won't work for that, but Couchbase Lite does. Couchbase Lite even supports [PhoneGap interfaces](https://github.com/couchbaselabs/Couchbase-Lite-PhoneGap-Plugin) for maximum portability.

**Flexible Storage.** Proprietary services store data on their own servers. These servers are reliable and secure, but it's better to have a choice. Couchbase Lite can sync to your own servers, to a desktop machine, or even peer-to-peer.

**Enterprise Data.** The only way to get data into an iCloud account is from an iOS device or Mac. But a frequent desire in mobile apps is to view small subsets of a huge upstream database (whether enterprise sales data, scientific observations, or consumer info like movie reviews) and be able to work with them while offline or bandwidth-limited. Couchbase Lite connects to Couchbase Server via the [Sync Gateway](https://github.com/couchbaselabs/sync_gateway), which has supports fine-grained access control and subset sync.

**Flexible Topology.** A star topology is the easiest, with devices all connecting to a single server, but Couchbase Lite also allows peers to sync to each other, creating a permanent or ad-hoc mesh. You can set up home or office servers that devices sync to, which in turn sync to a cloud service.

**Open Code & Protocols.** Apple's not going to show you iCloud's source code, or even describe the details of the protocols. If you find bugs, you have to wait for Apple to acknowledge and fix them. If you want to write your own client library, good luck reverse-engineering. Couchbase Lite (like all other Couchbase products) is open source, and the protocols are REST-based and publicly documented.


## Use Cases

We've been working with community users and customers on use cases like these:

* Medical Records &mdash; medical data is a great fit for schemaless JSON storage. It's also critical that it be available wherever the health care provider goes, regardless of network conditions.
* Customer Loyalty and Point of Sale &mdash; we see a lot of these apps already using our sync technology, and we've been working with some developers closely to ensure a smooth ride.
* Airline &mdash; pilots and flight attendants benefit from having easy access to data about passengers and flight plans, with the ability to dynamically refresh the data when they are on the ground.
* Fleet Management &mdash; tracking vehicle telemetry and routing it to the cloud when connections are available is a great fit for Couchbase Mobile.
* Social Media &mdash; chat and game companies often take a portfolio approach. By offloading the details of pushing data across mobile networks, they can focus on rolling out compelling content that uses a common backbone.

