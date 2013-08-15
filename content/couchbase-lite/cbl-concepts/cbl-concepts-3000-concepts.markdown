# Couchbase Lite Concepts

The Couchbase Lite API makes more sense if you understand how it structures its data. If you already know Couchbase Server, you can safely skip this, but if your database knowledge is based on SQL, or key-value stores like Berkeley DB, you'll find that it's different from what you're used to &mdash; as you'll see, it's sort of like each of those, and sort of like a version control system like Git, and sort of like a web server.

<table frame="box" align="right">
<caption><b>Database Terminology</b></caption>
<tr><th>SQL Term 		</th><th> Couchbase Lite Term</td></th></tr>
<tr><td>Database		</td><td> Database</td></tr>
<tr><td>Table			</td><td> Document type<br/>(informal)</td></tr>
<tr><td>Row			</td><td> Document</td></tr>
<tr><td>Primary key	</td><td> Document ID</td></tr>
<tr><td>Index			</td><td> View</td></tr>
<tr><td>Transaction	</td><td> MVCC</td></tr>
<tr><td>Query			</td><td> GET or view query</td></tr>
<tr><td>SELECT		</td><td> GET</td></tr>
<tr><td>INSERT		</td><td> POST</td></tr>
<tr><td>UPDATE		</td><td> PUT</td></tr>
<tr><td>DELETE		</td><td> DELETE</td></tr>
</table>



## Documents

Couchbase Lite is a **document** database. Partly this is just terminology, but a document really is different from a SQL database row. It has a much more flexible data format; it generally contains all the information about a data entity (including compound data) rather than being normalized across tables; and it can have arbitrary-sized binary attachments.

A document is a JSON object (aka 'dictionary') consisting of arbitrary key-value pairs. There's no schema: every document can have its own individual set of keys, although almost all databases adopt one or more informal schemas.

Whatever its contents, though, every document has a magic property called `_id`. This is the **Document ID**, its unique identifier in its database &mdash; it's very much like a SQL primary key, except that primary keys are usually integers while document IDs are strings (they're most commonly long [universally unique identifiers][UUID] (UUID) but can be anything you want).

There are some other magic/reserved properties of documents, and their names all start with an underscore. Don't use an underscore prefix for any of your own properties.

## Databases

A Couchbase Lite **database** is mostly just a bag of documents, and serves as a namespace to look them up by their unique document IDs. In this way Couchbase Lite is rather similar to Berkeley DB and its relatives such as Kyoto Cabinet and the HTML 5 data store. It supports the typical [CRUD][CRUD] (create, read, update, and delete) operations.

Unlike relational databases, Couchbase Lite databases don't contain tables. They're not necessary &mdash; tables exist to define a schema for their rows, and Couchbase Lite documents don't have a schema. You can freely put different types of documents, containing different properties appropriate to their types, into the same database. It is very convenient, though, to be able to easily distinguish different types of documents (especially in [view functions](Views and Queries)), so there's an informal convention of using a `type` property whose value is a string identifying the document type.

## Revisions

One significant difference from other databases is document **versioning**. Couchbase Lite uses a technique called [Multiversion Concurrency Control][MVCC] (MVCC) to manage conflicts between multiple writers. This is exactly the same technique used by version-control systems like Git or Subversion, and by [WebDAV][WEBDAV]. Every document has an additional magic field called `_rev`, for "revision ID". This is assigned automatically when the document is saved &mdash; every time it's updated, it gets a different and unique revision ID.

The tricky bit is that, to save an update to an existing document, _you have to include its current revision ID_. If the revision ID you provide isn't the current one, the update is rejected. When this happens, it means some other client snuck in and updated the document before you; so you'll need to fetch the new version, reconcile any changes, incorporate the newer revision ID, and try again.

Yes, this is just like when you find someone else beat you by committing a patch to `foo.c` while you were working on your own. Or if you've used [WebDAV][WEBDAV], it's _exactly_ like getting a 409 Conflict response when the `If-Match:` condition in your `PUT` request fails — because Couchbase Lite's REST API also uses Etags and the 409 status code.

And there's another way in which Couchbase Lite is like a version control system: it remembers a document's revision history (the list of previous revision IDs) and even caches the content of obsolete revisions. If a revision is cached, you can get its contents by passing its revision ID along with the document ID when you GET the document.

This is a very misunderstood feature: it does _not_ mean that Couchbase Lite is a real version control system, nor that you can safely take advantage of this feature in your application (for example, to store the revision history of pages in a wiki). The inconvenient truth is that the old revisions literally are just _cached_ &mdash; they are periodically thrown away when the database is compacted, and they're never replicated. They're not there to use in your data model, they're there to help with concurrency and resolving conflicts during replication.

## Views And Queries

Querying is probably the hardest thing about Couchbase Lite for SQL jockeys to get used to. In SQL you use a complex query language to specify exactly what data you want, then run the query and get back the data. In Couchbase Lite it's more of a two-stage process, based on a popular technique called [MapReduce][MAPREDUCE].

First you define a **view** that uses a _map function_ to extract information out of every document. The map function is written in the same language as your app &mdash; most likely Objective-C or Java &mdash; so it's very flexible. The result of applying the map function to the database is an ordered set of key-value pairs. For example, a map function might grind through an address-book database and produce a set of mappings from names to phone numbers. The view's output is stored persistently in the database and updated incrementally as documents change. It's very much like the type of index a SQL database creates internally to optimize queries.

The second step is querying the view to get actual data. You give a range of keys, and get back all the key-value pairs in that range, sorted by key. Optionally, you can use the view's reduce function to aggregate values together, or group matching values into one. It's very simple compared to the baroque possibilities of SQL `SELECT` statements &mdash; the power of views comes both from the flexibility of the map and reduce functions, and from the ability to use compound (array) keys to sort the results in interesting ways.

Remember: a view is not a _query_, it's an _index_. Views are persistent, and need to be updated (incrementally) whenever documents change, so having large numbers of them can be expensive. Instead, it's better to have a smaller number of views that can be queried in interesting ways.

## The Changes Feed

Couchbase Lite provides a mechanism to track changes to a database. It's based on _sequence numbers_, which are consecutive serial numbers assigned to document updates. The database's **changes feed** is a query that returns metadata about all document updates that have occurred since a given sequence number. The client can then remember the latest sequence number reported in the feed, and the next time it fetches the feed it passes in that sequence number so it can get only the new changes. (There's also a mechanism to leave the feed running and be notified of all new changes in real time.)

## Replication

At a high level, replication is simply a matter of finding all the changes that have been made to the source database since the last replication, fetching them, and applying them to the target database. The first step uses the source's changes feed, passing in a sequence number checkpointed from the previous replication; after all the updates are applied, the checkpoint is updated to the latest sequence number from the source.

Because replication uses document IDs to identify matching documents, it implicitly assumes that both databases share the same document-ID namespace. (And if they didn't for some reason, they will afterwards, whether or not that was intended!) This is why UUIDs are so popular as document IDs: they pretty much guarantee that new documents created on different servers are distinct. Other naming schemes such as serial numbers or time stamps might cause unintentional ID collisions.

Replication is basically unidirectional. A replication from a remote to a local database is called a *pull* and from a local to a remote database is called a *push*. Bidirectional replication, or *sync*, is done by configuring both a pull and a push between the same two databases.

Although any one replication involves only two databases, it's possible to set up chains of replications between any number of databases. This creates a directed graph, with databases as nodes and replications as arcs. Many topologies are possible, from a star with one master database and a number of replicas, to a mesh network where changes made at any node eventually propagate to all the others.

### Conflicts

One important aspect of replication is the way it deals with conflicts. A database prevents local conflicts in a document by using multiversion concurrency control (MVCC): an attempt to add a conflicting change to a document is rejected. However, there's no way to enforce this across multiple independent databases on different servers and devices. (Well, there are ways, but they involve distributed locking, which scales very poorly and doesn't support offline clients at all.) The result is that the same document (as identified by its ID) can be updated with different data on different instances of Couchbase Lite. The conflict probably won't be detected until one database replicates to the other. What happens then? It's too late to prevent the conflict. And Couchbase Lite itself doesn't know how to reconcile it by merging the two documents together &mdash; that requires knowledge of the application schema. What it does instead is simply keep both revisions, and leave it up to the application to review them and merge them together later.

It's actually not obvious that both revisions are present. When the app retrieves a document by its ID, it would be confusing if it got two copies. Instead, Couchbase Lite somewhat arbitrarily chooses one revision as the "winner" (it's the one whose revision ID is lexicographically higher) and treats that one as the document's default value. However, there are API calls to detect the conflict state and to fetch the document's revision tree, which really is a tree now that it's branched. The application can then fetch the "losing" revision by its revision ID, compare the two, and then update the document with the appropriate merged contents, resolving the conflict.


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
