## Concurrency Support


The Couchbase Lite API is mostly synchronous. That makes it simpler and more efficient. Most of the API calls are quick enough that it's not a problem to run them on the main thread, but some things might become too slow, especially with large databases, so you might want to offload the processing to a background thread. You have a couple of options.

### Asynchronous Queries

View queries slow down as the database grows, especially when the view's index needs to be updated after the database changes. You can prevent this from blocking your UI by running the query asynchronously.

The easiest way to do this is just to use `LiveQuery`. It always runs its queries in the background, and then posts a notification on the main thread after the query is complete.

If you use a regular `Query` object directly, though, you might find that calling the  synchronous `run()` method getting slow. You can access the result rows asynchronously like this:

```java
Future future = query.runAsync(new Query.QueryCompleteListener() {
        @Override
        public void completed(QueryEnumerator rows, Throwable error) {
            // operate on row...
        }
    });
```

The `runAsync()` method returns immediately, but performs the query on a background thread. When the query finishes, your callback is called with the query result as its parameter.

Error checking is a bit different. In synchronous mode `query.run()` throws an exception if there is an error. The async API will call your callback with a `Throwable` in the case when there was an error during the query.

### General-purpose asynchronous calls


Also, there’s a more general-purpose method for doing asynchronous operations, which a few people have asked for. You can now use the `Manager` object to perform any operation in the background. Here’s an example that deletes a bunch of documents given an array of IDs:

```java

final String[] docids = new String[] {"id1", "id2", "id3"};
 
Future result = manager.runAsync("db", new AsyncTask() {
    @Override
    public boolean run(Database database) {
        for (String docid : docids) {
            database.getDocument(docid).delete();
        }
        return true;
    }
});
```

