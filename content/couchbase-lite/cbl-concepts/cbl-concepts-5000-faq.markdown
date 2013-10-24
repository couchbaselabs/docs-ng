# Couchbase Lite FAQ
This section provides answers to questions frequently asked about Couchbase Lite. The questions are grouped into the following categories:

* [What Is This?](what-is-this)
* [Performance and Size](#performance-and-size)
* [Compatibility](#compatibility)
* [Implementation and Design](implementation-and-design)
* [Choices, Choices](#choices-choices)
* [Usage Issues](#usage-issues)

## What Is This?

### What is Couchbase Lite?

Couchbase Lite is an ultra-lightweight and flexible mobile database that easily syncs with the cloud, built for all your mobile application needs.

### Is Couchbase Lite the same thing as TouchDB?

Couchbase Lite was originally known as TouchDB. In January 2013 we changed the name to Couchbase Lite. The original 1.0 release of TouchDB has kept the old naming. Later releases are known as Couchbase Lite.

### What does Couchbase Lite run on?

The reference Objective-C implementation runs on iOS 6.0 or later and Mac OS X 10.7 or later. There is also a Java version for Android devices. You can also build HTML5 apps with the Couchbase Lite PhoneGap plug-in.

(The Objective-C implementation was at one point partially adapted to run in the [GNUstep](http://gnustep.org) environment, which is portable to systems such as Linux, BSD, and Solaris, and even Microsoft Windows; but it hasn't been built or run in that environment for a long time, so there would certainly be more work to do to bring it back up to speed.)

### How mature is Couchbase Lite?

The released 1.0-beta version of Couchbase Lite is ready to use in apps. As with any open source project, the latest GitHub commits do represent bleeding-edge functionality and should be used with caution.

### Is there a demo app?

iOS demo apps:

* [Checkers](https://github.com/couchbaselabs/Checkers-iOS)
* [Grocery Sync](https://github.com/couchbaselabs/Grocery-Sync-iOS)
* [CouchChat](https://github.com/couchbaselabs/CouchChat-iOS)
* [ToDo Lite](https://github.com/couchbaselabs/ToDoLite-iOS)

Android demo apps:

* [CouchChat](https://github.com/couchbaselabs/CouchChatAndroid)
* [Grocery Sync](https://github.com/couchbaselabs/GrocerySync-Android)

PhoneGap demo apps:

* [ToDo Lite](https://github.com/couchbaselabs/TodoLite-PhoneGap)

### What's the license?

Couchbase Lite itself is released under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

Some libraries that Couchbase Lite uses ([FMDB](https://github.com/ccgus/fmdb), [MYUtilities](https://bitbucket.org/snej/myutilities/overview), and [CocoaHTTPServer](https://github.com/robbiehanson/CocoaHTTPServer)) have MIT or BSD licenses. We might seek relicensing or rewrite those parts of the code to get everything under a single Apache license.

### Who's behind Couchbase Lite?

[Couchbase](http://couchbase.com), the company behind the [Couchbase open source project](http://www.couchbase.com/couchbase-open-source-project) and [Couchbase Server](http://www.couchbase.com/couchbase-server/overview).

### Have any developers shipped apps that use Couchbase Lite?

Yes! You can see a list on the [Couchbase Lite In The Wild](https://github.com/couchbase/couchbase-lite-ios/wiki/Couchbase-Lite-In-The-Wild) page.

### Can I ask more questions?

Yes! The [Mobile Couchbase Google Group](https://groups.google.com/forum/?fromgroups#!forum/mobile-couchbase) is the best place to ask questions. You can access it on the web or subscribe to it as a mailing list.


## Performance & Size

### How big is Couchbase Lite?

As of October 2013, the iOS version of Couchbase Lite compiles to about 550 KB of optimized ARM7 code.

### How long does Couchbase Lite take to start up?

A: For a cold launch, it takes about 100 ms to initialize the library and open a small database. If the app has been launched and quit recently, leaving stuff in cache, it's about 60 ms. This is on an iPad 2&mdash;older devices are a bit slower.

### How fast is Couchbase Lite?

A: Couchbase Lite is fast enough for the kinds of data sets mobile apps use. It's effectively instantaneous for small data sets. It won't handle big data as well as Couchbase Server, but it keeps up pretty well with tens or hundreds of thousands of documents. Arbitrarily large binary attachments are kept as files in the file system.

### How much data can Couchbase Lite handle?

There aren't any hard limits in Couchbase Lite itself. The most likely practical limit is the available disk and flash storage on the device, and of course app responsiveness as query times increase. Couchbase Lite does not store attachments inside the database file. For information about limitations in SQLite, see [Implementation Limits for SQLite](http://www.sqlite.org/limits.html).


## Compatibility

### Is Couchbase Lite compatible with Apache CouchDB?

In the ways that matter, yes. The REST API is compatible, although you talk to the engine in-process rather than over a socket. Some of the more server-centric features of CouchDB, like user accounts, aren't supported.

### Can Couchbase Lite replicate with Apache CouchDB servers?

Yes, its replication protocol is entirely compatible. That's a very important goal. Apps using Couchbase Lite can sync with servers running Apache CouchDB and with Couchbase Server via Sync Gateway.

### Can Couchbase Lite replicate with Couchbase Server?

[Sync Gateway](https://github.com/couchbaselabs/sync-gateway) acts as a server-side bridge between Couchbase Server and Couchbase Lite. After your data is synced to Couchbase Server, you can use MapReduce to build indexes across the full data set.

### Does Couchbase Lite have conflict handling and revision trees like Apache CouchDB?

Yes. Revision trees are implemented and preserved across replication.

### Does Couchbase Lite have MapReduce-based views?

Yes, although for size reasons it doesn't include a JavaScript interpreter, so views are implemented in native code (for example, as blocks in Objective-C.) The same goes for filter and validation functions. It's possible to use JavaScript-based functions if you're willing to link in some extra code and libraries.

### Can you access Couchbase Lite over HTTP?

There's an HTTP server extension called CouchbaseLiteListener. It's mostly there to enable Couchbase Lite-to-Couchbase Lite (peer-to-peer) replication,  make testing easier, and support PhoneGap-style HTML5 development.


### What about CouchApps?

[CouchApps](http://couchapp.org) running in [PhoneGap](http://phonegap.com/) is definitely an interesting mobile platform. We have a [Couchbase Lite Plug-in for PhoneGap] (https://github.com/couchbaselabs/Couchbase-Lite-PhoneGap-Plugin) that enables you to use Couchbase Lite with PhoneGap. Most CouchApps should be able to run with only minor modifications.



### Why SQLite instead of a B-tree engine like Berkeley DB or Kyoto Cabinet?

Largely because SQLite is already available as a shared library on every platform we're interested in. This keeps our code size down and simplifies the build process. It also comes with useful extensions like full-text indexing and R-trees (for geo-queries).

Additionally, both Berkeley and Kyoto have GPL-like licenses that are less friendly to commercial developers (especially iOS developers) and incompatible with the Apache license of Couchbase Lite itself.


## Choices, Choices

### Why would I use Couchbase Lite instead of earlier generations of Couchbase technology for mobile?

Because Couchbase Lite is a lot smaller, starts up a lot more quickly, and is easily embedded into an app. Those are important factors for mobile app developers (and some desktop app developers too). If you're working on server-side software, those factors probably don't matter to you or at least don't outweigh the drawbacks.

### Why would I use Couchbase Lite instead of the Apple Core Data framework?

World-class, highly-flexible data sync capabilities that go way beyond what you can get from iCloud. Another factor is that the API is simpler and easier to use than Core Data.

### Why would I use Couchbase Lite instead of working directly with SQLite or an adapter like FMDB?

As with the previous comparison to Core Data, the big reason is sync. If your users want to work with their data on multiple devices or platforms (including the Web) or have it transparently backed up, the replication capabilities in Couchbase Lite make it very easy compared to the pain of implementing sync yourself or trying to duct-tape your custom SQLite database to the iCloud APIs.

## Usage Issues

### How do I cancel a persistent, continuous replication?

For an iOS example, see [Deleting Replications](/couchbase-lite/cbl-ios/#deleting-replications).

### Does replication create an always-open socket to the server?

It depends on how you configure the replication. You can set up a continuous replication that is always active when the device is online, or you can trigger a one-shot replication whenever you want.

### Can the traffic be compressed?

Yes, by using regular HTTP gzip transfer encoding. A proxy like nginx or Apache can apply this encoding transparently.

### Does replication transfer the whole changed document or just an update that contains only the changes?

It sends the whole document. Typically documents aren't that big. If a document contains attachments, only the ones that have changed are transferred.

### Can you trigger an update from the network side?

If the client has an active replication, changes from the server are pushed to it within a second or two. On iOS 7, your server can send push notifications that invisibly wake up the app and let it replicate the new changes.


