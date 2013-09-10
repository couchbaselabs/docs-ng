## Concurrency Support


Couchbase Lite's API is mostly synchronous. That makes it simpler and more efficient. Most of the API calls are quick enough that it's not a problem to run them on the main thread, but some things might become too slow, especially with large databases, so you'd like to offload the processing to a background thread. You have a couple of options.

First, though, a stern warning: **Couchbase Lite objects are not thread-safe** so you cannot call them from multiple threads. This means you can't solve latency problems just by calling part of your app code that uses Couchbase Lite on a background thread or dispatch queue. If you're using the same CBL instances you use on the main thread, you will crash or corrupt the app state.

### Async Queries

View queries will slow down as the database grows, especially when the view's index needs to be updated after the database changes. You can prevent this from blocking your UI by running the query asynchronously.

The easiest way to do this is just to use `CBLLiveQuery` (or `CBLUITableSource`, which uses it internally.) It always runs its queries in the background, and then posts a KVO notification on the main thread after the query is complete.

If you use regular `CBLQuery` directly, though, you may find its `.rows` accessor getting slow. You can access the result rows asynchronously like this:

```objectivec
    [query runAsync: ^(CBLQueryEnumerator* rows) {
        for (CBLQueryRow* row in rows) {
            // operate on row...
        }
    }];
```

The `-runAsync` method returns immediately, but performs the query on a background thread. When the query finishes, your block is called (on the original thread) with the query result as its parameter.

Error checking is a bit different. In synchronous mode `query.rows` returns nil if there was an error, and then `query.error` returns the error. The async API is stateless, so instead it always passes you a non-nil enumerator, but the enumerator has an `.error` property you can check. (On the other hand, errors from queries are very unlikely.)

If you ever need to debug async and live queries, there’s a logging key “Query” that will log when queries start and finish.

### General-Purpose Async Calls


Also, there’s a more general-purpose method for doing async operations, which a few people have asked for. You can now use the CBLManager to perform any operation in the background. Here’s an example that deletes a bunch of documents given an array of IDs:

```objectivec
    CBLManager* mgr = [CBLManager sharedInstance];
        [mgr asyncTellDatabaseNamed: @"mydb" to: ^(CBLDatabase *bgdb) {
            for (NSString* docID in docIDs) {
                [[bgdb documentWithID: docID] deleteDocument: nil];
        }];
```

You have to be careful with this, though! CBL objects are per-thread, and your block runs on a background thread, so:

* You can’t use any of the CBL objects (databases, documents, models…) you were using on the main thread. Instead, you have to use the CBLDatabase object passed to the block, and the other objects reachable from it. 
* You can’t save any of the CBL objects in the block and then call them on the main thread. (For example, if in the block you allocated some CBLModels and assigned them to properties of application objects, bad stuff would happen if they got called later on by application code.)
* And of course, since the block is called on a background thread, any application or system APIs you call from it need to be thread-safe.

In general, it's best to do only very limited things using this API, otherwise it becomes too easy to accidentally use main-thread CBL objects in the block, or store background-thread CBL objects in places where they'll be called on the main thread.

### Create A Background CBLManager

If you want to do lots of Couchbase Lite stuff in the background, the best way to do it is to start your own background thread and use a new instance of `CBLManager` on it. Just don't get objects mixed up between threads.

Note: Don't call `[CBLManager sharedInstance]` on a background thread. That instance is for the main thread. Instead, call `-copy` on your main manager on the main thread, and then use that instance on the background thread.

```objectivec
    CBLManager* bgMgr = [[CBLManager sharedInstance] copy];
    [NSThread detachNewThreadSelector: @selector(runBackground:) toTarget: self withObject: bgMgr];
        
```

