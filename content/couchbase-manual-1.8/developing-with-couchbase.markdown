# Developing with Couchbase

You can find information on client libraries for use with Couchbase Server at
[Develop with Couchbase Server SDKs](http://www.couchbase.com/develop)

<a id="couchbase-developing-usecases"></a>

## Use Cases

Couchbase is a generalized database management system, but looking across
Couchbase deployments, it is clear that there are some patterns of use. These
patterns tend to rely Couchbase's unique combination of linear, horizontal
scalability; sustained low latency and high throughput performance; and the
extensibility of the system facilitated through Tap and NodeCode. This page
highlights these use cases.

<a id="couchbase-developing-usecases-sessionstore"></a>

### Session store

User sessions are easily stored in Couchbase, such as by using a document ID
naming scheme like "user:USERID". The item expiration feature of Couchbase can
be optionally used to have Couchbase automatically delete old sessions. There
are two ways that Couchbase Server will remove items that have expired:

 * Lazy Deletion: when a key is requested Couchbase Server checks a key for
   expiration; if a key is past its expiration Couchbase Server removes it from
   RAM. This applies to data in Couchbase and memcached buckets.

 * Maintenance Intervals: items that have expired will be removed by an automatic
   maintenance process that runs every 60 minutes.

When Couchbase Server gets a requests for a key that is past its expiration it
removes it from RAM; when a client tries to retrieve the expired item, Couchbase
Server will return a message that the key does not exist. Items that have
expired but have not been requested will be removed every 60 minutes by default
by an automatic maintenance process.

Besides the usual SET operation, CAS identifiers can be used to ensure
concurrent web requests from a single user do not lose data.

Many web application frameworks such as Ruby on Rails and various PHP and Python
web frameworks also provide pre-integrated support for storing session data
using Memcached protocol. These are supported automatically by Couchbase.

<a id="couchbase-developing-usecases-socialgaming"></a>

### Social gaming

Game state, property state, timelines, conversations & chats can also be modeled
in Couchbase. The asynchronous persistence algorithms of Couchbase were
designed, built and deployed to support some of the highest scale social games
on the planet. In particular, the heavy dual read & write storage access
patterns of social games (nearly every user gesture mutates game state) is
serviced by Couchbase by asynchronously queueing mutations for disk storage and
also by collapsing mutations into the most recently queued mutation. For
example, a player making 10 game state mutations in 5 seconds (e.g., planting 10
flowers in 5 seconds) will likely be collapsed by Couchbase automatically into
just one queued disk mutation. Couchbase also will force-save mutated item data
to disk, even if an item is heavily changed (the user keeps on clicking and
clicking). Additionally, game state for that player remains instantly readable
as long as it is in the memory working set of Couchbase.

<a id="couchbase-developing-usecases-adservice"></a>

### Ad, offer and content targeting

The same underpinnings that power social games is well suited to real-time ad
and content targeting. For example, Couchbase provides a fast storage capability
for counters. Counters are useful for tracking visits, associating users with
various targeting profiles (eg, user-1234 is visited a page about "automobiles"
and "travel") and in tracking ad-offers and ad-inventory.

Multi-GET operations in Couchbase allow ad applications to concurrently
"scatter-gather" against profiles, counters, or other items in order to allow
for ad computation and serving decisions under a limited response latency
budget.

<a id="couchbase-developing-logging"></a>

### Real-time logging and alerting

Other features of Couchbase, such as the ability to PREPEND and APPEND values
onto existing items, allow for high performance event tracking. Couchbase is
also well suited as a aggregation backend, where events need to be consolidated
for fast, real-time analysis.

For example, if your application needs to process the "firehose" of events from
high-scale conversation services such as Twitter, such as by matching user
interest in terms (eg, user-1234 is interested in conversations about "worldcup"
and "harrypotter"), Couchbase can be used as the database for fast topic to
subscriber matching, allowing your application to quickly answer, "who is
interested in event X?"

<a id="couchbase-developing-bestpractices"></a>

## Best practices

Included below are a number of best practices that you should follow when
developing applications using Couchbase.

<a id="couchbase-developing-bestpractices-objectstorage-what"></a>

### What should I store in an object

Couchbase is most suited towards fast-changing data items of relatively small
size. Couchbase buckets support document data up to 20 Mbytes. For example,
think shopping carts, user profile, user sessions, timelines, game states,
pages, conversations and product catalog, instead of large audio or video media
blobs.

<a id="couchbase-developing-bestpractices-objectstorage-how"></a>

### How should I store an object?

Couchbase, similar to Memcached, can store any binary bytes, and the encoding is
up to you or your client library. Some memcached client libraries, for example,
offer convenience functions to serialize/deserialize objects from your favorite
web application programming language (Java, Ruby, PHP, Python, etc) to a blob
for storage. Please consult your client library API documentation for details.

An additional consideration on object encoding/seralization is whether your
objects will need to be handled by multiple programming languages. For example,
it might be inconvenient for a Java client application to decode a serialized
PHP object. In these cases, consider cross-language encodings such as JSON, XML,
Google Protocol Buffers or Thrift.

The later two (Protocol Buffers and Thrift) have some advantages in providing
more efficient object encodings than text-based encodings like JSON and XML. One
key to Couchbase performance is to watch your working set size, so the more
working set items you can fit into memory, the better.

On that note, some client libraries offer the additional feature of optionally
compressing/decompressing objects stored into Couchbase. The CPU-time versus
space tradeoff here should be considered, in addition to how you might want to
version objects under changing encoding schemes. For example, you might consider
using the 'flags' field in each item to denote the encoding kind and/or optional
compression. When beginning application development, however, a useful mantra to
follow is to just keep things simple.

<a id="couchbase-developing-bestpractices-objectref"></a>

### Objects that refer to other objects

Although Couchbase is a document store and you can store any byte-array value
that you wish, there are some common patterns for handling items that refer to
other items. Some example use cases. For example: User 1234 is interested in
topics A, B, X, W and belongs to groups 1, 3, 5

 * Shopping Cart 222 points to product-1432 and product-211

 * A Page has Comments, and each of those Comments has an Author. Each Author, in
   turn, has a "handle", an avatar image and a karma ranking.

<a id="couchbase-developing-bestpractices-nested"></a>

### Nested Items

You can store serialized, nested structures in Couchbase, such as by using
encodings like JSON or XML (or Google Protocol Buffers or Thrift). A user
profile item stored in Couchbase can then track information such as user
interests. For example, in JSON:


```
{ "key": "user-1234", "handle": "bobama", "avatarURL": ...,
"interests": [ "A", "B", "X", "W" ], "groups": [ 1, 3, 5 ], ...
        }
```

If the above is stored in Couchbase under document ID "user-1234", you can then
know the interests for that user by doing a simple GET for user-1234 and
decoding the JSON response.

<a id="couchbase-developing-bestpractices-lists"></a>

### Simple Lists

To handle reverse lookups (who are the users interested in topic X?), a common
solution is to store simple lists. For example, under document ID "topic-X", you
might have store the following list:


```
user-1234,user-222,user-987,
```

Such lists can be easily constructed by using Couchbase's APPEND or PREPEND
operations, where you append/prepend values that look like "user-XXXXX,".

Note that the list is delimited by commas, but that can be any character you
choose.

<a id="couchbase-developing-bestpractices-lists-deletion"></a>

### Handling List Item Deletion

The above works when a user registers her interest in a topic, but how can you
handle when a user wants to unregister their interest (eg, unsubscribe or
unfollow)?

One approach is to use the CAS identifiers to do atomic replacement. A client
application first does a GET-with-caS (a "gets" request in the ascii protocol)
of the current list for a topic. Then the client removes the given user from the
list response, and finally does a SET-with-CAS-identifier operation (a "cas"
request in the ascii protocol) while supplying the same CAS identifier that was
returned with the earlier "gets" retrieval.

If the SET-with-CAS request succeeds, the client has successfully replaced the
list item with a new, shorter list with the relevant list entry deleted.

The SET-with-CAS-identifier operation might fail, however, if another client
mutated the list while the first client was attempting a deletion. In this case
the first client can try to repeat the list item delete operation.

Under a highly contended or fast mutating list however (such as users trying to
follow a popular user or topic), the deleting client will have a difficult time
making progress.

<a id="couchbase-developing-bestpractices-lists-deletion-contention"></a>

### Handling Highly Contended List Item Deletion

Instead of performing a SET-with-CAS to perform list item deletion, one pattern
is to explicitly track deleted items. This could be done using APPEND for list
additions and PREPENDS for list deletions, with an additional "tombstone"
deletion character. For example, anything before the "|" character is considered
deleted:


```
user-222,|user-1234,user-222,user-987,
```

So, after the client library retrieves that list and does some post-processing,
the effective, actual list of interested subscribers is user-1234 and user-987.

Care must be taken to count correctly, in case user-222 decides to add
themselves again to the list (and her clicks are faster than whatever logic your
application has to prevent duplicate clicks):


```
user-222,|user-1234,user-222,user-987,user-222
```

A similar encoding scheme would use '+' or '-' delimiter characters to the same
effect, where the client sends an APPEND of "+ID" to add an entry to a list, and
an APPEND of "-ID" to remove an entry from a list. The client application would
still perform post-processing on the list response, tracking appropriate list
entry counts. In this and other encodings, we must take care not to use the
delimiter characters that were chosen:


```
+1234+222+987-222
```

Yet another variation on this would be store deleted items to a separate paired
list. So your application might have two lists for a topic, such as a "follow-X"
and "unfollow-X".

<a id="couchbase-developing-bestpractices-lists-compressing"></a>

### Compressing Lists

Eventually, your application may need to garbage collect or compress the lists.
To do so, you might have your client application do so by randomly piggy-backing
on other requests to retrieve the list.

Again, with heavily contended, fast mutating list, attempts to compress a list
may be fruitless as SET-with-CAS attempts can fail. Some solutions, as with many
in software engineering, involve adding a level of indirection. For example, you
could keep two lists for each topic, and use marker items to signal to clients
which list is considered active:


```
topic-X.a => +1234+222+987-222 topic-X.b => (empty)
topic-X.active => topic-X.a
```

A client could multi-GET on topic-X.a and topic-X.b, and the combined result
would contain the full list. To mutate the list, the client would look at the
"pointer" item of topic-X.active, and know to APPEND values to topic-X.a.

A randomly self-chosen client may choose to garbage-collect the active list when
it sees the list length is large enough, by writing a compressed version of
topic-X.a into topic-X.b (note: XXX) and by flipping the topic-X.active item to
point to "b". New clients will start APPEND'ing values to topic-X.b. Old,
concurrent clients might still be APPEND'ing values to the old active item of
topic-X.a, so other randomly self-selected clients can choose to help continue
to compress topic-X.a into topic-X.b so that topic-X.a will be empty and ready
for the next flip.

An alternative to a separate "topic-X.active" pointer item would be instead to
PREPEND a tombstone marker value onto the front of the inactivated list item.
For example, if '^' was the tombstone marker character, all concurrent clients
would be able to see in that a certain list should not be appended to:


```
topic-X.a => +1234+222+987-222 topic-X.b => ^+1234
```

There are concurrency holes in this "active flipping" scheme, such as if there's
a client process failure at the step noted above at "XXX", so for periods of
time there might be duplicates or reappearing list items.

In general, the idea is that independent clients try to make progress towards an
eventually stabilized state. Please consider your application use cases as to
whether temporary inconsistencies are survivable.

<a id="couchbase-developing-bestpractices-lists-large"></a>

### Large Lists

If your lists get large (e.g., some user has 200,000 followers), you may soon
hit the default 1 megabyte value byte size limits of Couchbase. Again, a level
of indirection is useful here, by have another item that lists the lists...


```
topic-X => +0+1 topic-X.0 => ... many actual items ...
topic-X.1 => ... more actual items ...
```

The "topic-X" item just lists pointers to items that have the actual lists.

In this approach, you could have randomly self-selected clients decide to add
new topic sub-lists (topic-X.N) and APPEND'ing updated info to the "index" item
(topic-X).

Other randomly self-chosen clients could attempt to compress topic sub-lists
that are old.

<a id="couchbase-developing-bestpractices-multiget"></a>

### Multi-GET

Once your client application has a list of document IDs, the highest performance
approach to retrieve the actual items is to use a multi-GET request. Doing so
allows for concurrent retrieval of items across your Couchbase cluster. This
will perform better than a serial loop that tries to GET for each item
individually and sequentially.

<a id="couchbase-developing-bestpractices-locking"></a>

### Locking

Advisory locks can be useful to control access to scarce resources. For example,
retrieving information from backend or remote systems might be slow and consume
a lot of resources. Instead of letting any client access the backend system and
potentially overwhelm the backend system with high concurrent client requests,
you could create an advisory lock to allow only one client at a time access the
backend.

Advisory locks in Couchbase or Memcached can be created by setting expiration
times on a named data item and by using the 'add' and 'delete' commands to
access that named item. The 'add' or 'delete' commands are atomic, so you can be
know that only one client will become the advisory lock owner.

The first client that tries to ADD a named lock item (with an expiration
timeout) will succeed. Other clients will see error responses to an ADD command
on that named lock item, so they can know that some other client is owning the
named lock item. When the current lock owner is finished owning the lock, it can
send an explicit DELETE command on the named lock item to free the lock.

If the lock owning client crashes, the lock will automatically become available
to the next client that polls for the lock (using 'add') after the expiration
timeout.

<a id="couchbase-developing-bestpractices-datapartitioning"></a>

### Data partitioning with buckets

Couchbase allows you to partition your data into separate containers or
namespaces. These containers are called 'buckets'. Couchbase will keep item
storage separated for different buckets, allowing you to perform operations like
statistics gathering and flush\_all on a per-bucket basis, which are not
workable using other techniques such as simulating namespaces by document
ID-prefixing.

Couchbase Server supports two different bucket types, Couchbase and memcached.
For a full discussion of the major differences, see
[Buckets](couchbase-manual-ready.html#couchbase-architecture-buckets).

<a id="couchbase-for-memcachedusers"></a>

## Couchbase for Memcached Users

Configuring Couchbase as Memcached

While Couchbase Server is completely compatible with the open-source memcached
protocol, we realize that there are still good use cases for using a cache. For
this reason, we have included standard memcached functionality into the
Couchbase Server product. Simply configure a bucket to be of type "Memcached"
and it will behave almost identically to the open source version. There are a
few differences around memory management but your clients and applications will
not see a difference.

Q: What are the behavioral differences between Couchbase and Memcached?

A: The biggest difference is that Couchbase is a database. It will persist your
data and return an error if there is not enough RAM or disk space available.
Memcached is a cache, and will evict older data to make room for new data.
Couchbase also provides replication so that you always have access to your data
in the event of a failure. Memcached runs only out of RAM and has no replication
so the loss of a server will result in the loss of that cache.

Q: What are the advantages to using this Memcached over the open source version?

A: We provide a much enhanced UI for the purposes of configuration and
monitoring. Also, through the use of "smart clients", your application can be
dynamically updated with cluster topology changes. Using this server also gives
you an easy path to upgrade to a Couchbase bucket type for the enhanced HA,
persistence and querying capabilities.

<a id="couchbase-architecture"></a>
