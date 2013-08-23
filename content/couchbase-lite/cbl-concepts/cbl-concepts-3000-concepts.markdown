# Couchbase Lite Concepts

This section describes how Couchbase Lite structures and works with data. If you're familiar with relational databases and SQL, you'll notice that Couchbase Lite works differently and has its own database terminology. The following table compares the terminology:

<table style="width:55%">
<col style="width:50%;text-align:left" />
<thead>
<tr style="text-align:left">
<th> Couchbase Lite Term</th>
<th>Relational / SQL Term</th>
</tr>
</thead>
<tr><td>Database</td><td> Database</td></tr>
<tr><td> Document type (informal)</td><td>Table</td></tr>
<tr><td> Document</td><td>Row</td></tr>
<tr><td> Document ID</td><td>Primary key</td></tr>
<tr><td> View</td><td>Index</td></tr>
<tr><td> MVCC</td><td>Transaction</td></tr>
<tr><td> GET or view query</td><td>Query</td></tr>
<tr><td> GET</td><td>SELECT</td></tr>
<tr><td> POST</td><td>INSERT</td></tr>
<tr><td> PUT</td><td>UPDATE</td></tr>
<tr><td> DELETE</td><td>DELETE</td></tr>
</table>

## Documents

Couchbase Lite is a **document** database. A document has a much more flexible data format than a SQL database row, generally contains all the information about a data entity (including compound data) rather than being normalized across tables, and can have arbitrary-sized binary attachments.

A document is a JSON object, similar to a dictionary data structure, that consists of arbitrary key-value pairs. There's no schema—every document can have its own individual set of keys, although almost all databases adopt one or more informal schemas.

Whatever its contents, though, every document has a special property called `_id`. This property is the **document ID**, which is the document's unique identifier in its database. A document ID is similar to a SQL primary key, except that primary keys are usually integers while document IDs are strings.  When you create a document, you can either provide your own ID or let Couchbase Lite assign one. If you provide your own document IDs, you can use any string you want, such as a [universally unique identifier](http://en.wikipedia.org/wiki/Uuid) (UUID) or a string that is meaningful to your application.

Documents have some other special properties, and their names always start with an underscore. The leading underscore denotes a reserved property—don't use an underscore prefix for any of your own properties.


## Databases

A Couchbase Lite **database** is a collection of documents, and serves as a namespace to look them up by their unique document IDs. The database supports the typical [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations (create, read, update, and delete) .

Unlike relational databases, Couchbase Lite databases don't contain tables. They're not necessary—tables exist to define a schema for their rows, and Couchbase Lite documents don't have a schema. You can freely put different types of documents, containing different properties appropriate to their types, into the same database. It is very convenient, though, to be able to easily distinguish different types of documents (especially in [view functions](#views-and-queries)), so there's an informal convention of using a `type` property whose value is a string identifying the document type.


## Views And Queries

Querying is probably the hardest thing about Couchbase Lite for SQL users to get used to. In SQL, you use a complex query language to specify exactly what data you want, then run the query and get back the data. In Couchbase Lite it's a two-stage process based on a technique called [MapReduce](http://en.wikipedia.org/wiki/MapReduce).

First you define a **view** that uses a _map function_ to extract information out of every document. The map function is written in the same language as your app—most likely Objective-C or Java—so it's very flexible. The result of applying the map function to the database is an ordered set of key-value pairs. For example, a map function might grind through an address-book database and produce a set of mappings from names to phone numbers. The view's output is stored persistently in the database and updated incrementally as documents change. It's very much like the type of index a SQL database creates internally to optimize queries.

The second step is querying the view to get actual data. You give a range of keys, and get back all the key-value pairs in that range, sorted by key. Optionally, you can use the view's reduce function to aggregate values together, or group matching values into one. It's very simple compared to the baroque possibilities of SQL `SELECT` statements—the power of views comes both from the flexibility of the map and reduce functions, and from the ability to use compound (array) keys to sort the results in interesting ways.

Remember: a view is not a _query_, it's an _index_. Views are persistent, and need to be updated (incrementally) whenever documents change, so having large numbers of them can be expensive. Instead, it's better to have a smaller number of views that can be queried in interesting ways.


## Replication

Replication is basically unidirectional. A replication from a remote to a local database is called a *pull*, and a replication from a local to a remote database is called a *push*. Bidirectional replication, or *sync*, is done by configuring both a pull and a push between the same two databases.

Although any one replication involves only two databases, it's possible to set up chains of replications between any number of databases. This creates a directed graph, with databases as nodes and replications as arcs. Many topologies are possible, from a star with one master database and a number of replicas, to a mesh network where changes made at any node eventually propagate to all the others.

### Changes Feed

Couchbase Lite provides a mechanism to track changes to a database. It's based on _sequence numbers_, which are consecutive serial numbers assigned to document updates. The database's **changes feed** is a query that returns metadata about all document updates that have occurred since a given sequence number. The client can then remember the latest sequence number reported in the feed, and the next time it fetches the feed it passes in that sequence number so it can get only the new changes. There's also a mechanism to leave the feed running and be notified of all new changes in real time.

### Replication Workflow

At a high level, replication is simply a matter of finding all the changes that have been made to the source database since the last replication, fetching them, and applying them to the target database. The first step uses the source's changes feed, passing in a sequence number saved during the previous replication. After all the updates are applied, the checkpoint is updated to the latest sequence number from the source.

Because replication uses document IDs to identify matching documents, it implicitly assumes that both databases share the same document-ID namespace. (And if they didn't for some reason, they will afterwards, whether or not that was intended!) This is why UUIDs are so popular as document IDs—they pretty much guarantee that new documents created on different servers are distinct. Other naming schemes such as serial numbers or time stamps might cause unintentional ID collisions.

### Conflict Resolution

One important aspect of replication is the way it deals with conflicts. A database prevents local conflicts in a document by using MVCC—an attempt to add a conflicting change to a document is rejected. However, there's no way to enforce this across multiple independent databases on different servers and devices. (Well, there are ways, but they involve distributed locking, which scales very poorly and doesn't support offline clients at all.) The result is that the same document (as identified by its ID) can be updated with different data on different instances of Couchbase Lite. The conflict probably won't be detected until one database replicates to the other. What happens then? It's too late to prevent the conflict.  Couchbase Lite itself doesn't know how to reconcile it by merging the two documents together because that requires knowledge of the application schema. What it does instead is simply keep both revisions, and leave it up to the application to review them and merge them together later.

It's actually not obvious that both revisions are present. When the app retrieves a document by its ID, it would be confusing if it got two copies. Instead, Couchbase Lite somewhat arbitrarily chooses one revision as the "winner" (it's the one whose revision ID is lexicographically higher) and treats that one as the document's default value. Couchbase Lite has API calls to detect the conflict state and to fetch the document's revision tree, which really is a tree now that it's branched. The application can then fetch the "losing" revision by its revision ID, compare the two, and then update the document with the appropriate merged contents, thereby resolving the conflict.


## Revisions

One significant difference from other databases is document **versioning**. Couchbase Lite uses a technique called [Multiversion Concurrency Control](http://en.wikipedia.org/wiki/Multiversion_concurrency_control) (MVCC) to manage conflicts between multiple writers. This is exactly the same technique used by version-control systems like Git or Subversion, and by [WebDAV](http://en.wikipedia.org/wiki/Webdav). Document versioning is similar to the check-and-set mechanism (CAS) of Couchbase Server, except that in Couchbase Lite versioning is required rather than optional and the token is a UUID rather than an integer.

Every document has a special field called `_rev` that contains the revision ID. The revision ID is assigned automatically each time the document is saved. Every time a document is updated, it gets a different and unique revision ID.

The tricky bit is that, to save an update to an existing document, _you have to include its current revision ID_. If the revision ID you provide isn't the current one, the update is rejected. When this happens, it means some other client snuck in and updated the document before you. You need to fetch the new version, reconcile any changes, incorporate the newer revision ID, and try again.

Yes, this is just like when you find someone else beat you by committing a patch to `foo.c` while you were working on your own. Or if you've used WebDAV, it's _exactly_ like getting a 409 Conflict response when the `If-Match:` condition in your `PUT` request fails (Couchbase Lite's REST API also uses [Etags](http://en.wikipedia.org/wiki/HTTP_ETag) and the 409 status code).

Another way in which Couchbase Lite is like a version control system is that it remembers a document's revision history (the list of previous revision IDs) and even caches the content of obsolete revisions. If a revision is cached, you can get its contents by passing its revision ID along with the document ID when you GET the document.

This is a very misunderstood feature: it does _not_ mean that Couchbase Lite is a real version control system, nor that you can safely take advantage of this feature in your application (for example, to store the revision history of pages in a wiki). The old revisions literally are just  *cached*—they are periodically thrown away when the database is compacted, and they're never replicated. They're not there to use in your data model, they're there to help with concurrency and resolving conflicts during replication.
