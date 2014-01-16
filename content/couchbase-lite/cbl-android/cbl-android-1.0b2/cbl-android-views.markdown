## Working with views and queries

The basic document API gets you pretty far, but most apps need to work with multiple documents. In a typical app, the top-level UI usually shows either all the documents or a relevant subset of them &mdash; in other words, the results of a query.

Querying a Couchbase Lite database involves first creating a *view* that indexes the keys you're interested in and then running a *query* to get the results of the view for the key or range of keys you're interested in. The view is persistent, like a SQL index.

Because there's no fixed schema for the view engine to refer to and the interesting bits of a document that we want it to index could be located anywhere in the document (including nested values inside of arrays and subobjects), the view engine has to let us pick through each document to identify the relevant keys and values. That's what the view's *map function* is for: it's an app-defined function that's given a document's contents and returns, or *emits*, zero or more key-value pairs. These key-value pairs get indexed, ordered by key, and can then be queried efficiently, again by key.

For example, if you have an address book in a database, you might want to query the cards by first or last name, for display or filtering purposes. To do that, you create two views: one to grab the first-name field and return it as the key, and the other to return the last-name field as the key. (And what if you were originally just storing the full name as one string? Then your functions can detect that, split the full name at the space, and return the first or last name. That's how schema evolution works.)

You might also want to be able to look up people's names from phone numbers so you can do Caller ID on incoming calls. To do this, make a view whose keys are phone numbers. Now, a document might have multiple phone numbers in it, like the following example JSON document:

```json
{
   "first":"Bob",
   "last":"Dobbs",
   "phone":{
      "home":"408-555-1212",
      "cell":"408-555-3774",
      "work":"650-555-8333"
   }
}
```

To handle multiple phone numbers, the map function just needs to loop over the phone numbers and emit each one. You then have a view index that contains each phone number, even if several of them map to the same document.

### Getting All Documents

To start off, for simplicity, this section shows how you can retrieve all documents in the database without using a view.

To retrieve all the documents in the database, you need to create a `Query` object. The  `createAllDocumentsQuery()` method in the `Database` class returns a new `Query` object that contains all documents in the database:

```java
Query query = database.createAllDocumentsQuery();
```

After you obtain the new `Query` object, you can customize it (this is similar to the SQL `SELECT` statement `ORDER BY`, `OFFSET` and `LIMIT` clauses). The following example shows how to retrieve the ten documents with the highest keys:

```java
query.setLimit(10);
query.setDescending(true);
```
        
As a side effect of setting the query to descending order you get the documents in reverse order, but you can compensate for that if it's not appropriate. Now you can iterate over the results:

```java
try {
    QueryEnumerator rowEnum = query.run();
    for (Iterator<QueryRow> it = rowEnum; it.hasNext();) {
        QueryRow row = it.next();
        Log.d("Document ID:", row.getDocumentId());

    }
} catch (CouchbaseLiteException e) {
    e.printStackTrace();
}
```

`query.run()` evaluates the query and returns a `QueryEnumerator` object that you can use with loop to iterate over the results. Each result is a `QueryRow` object. You might expect the result to be a `Document`, but the key-value pairs emitted in views don't necessarily correspond one-to-one to documents and a document might be present multiple times under different keys. If you want the document that emitted a row, you can get it from the row's document ID property.

### Creating Views

To create a view, define its map (and optionally its reduce) function. When you define the MapReduce functions, you also assign a version identifier to the function. If you change the MapReduce function later, you must remember to change the version so Couchbase Lite rebuilds the index.

Here's how the Grocery Sync example app sets up its by-date view:

```java
com.couchbase.lite.View viewItemsByDate = database.getView(String.format("%s/%s", designDocName, byDateViewName));
        viewItemsByDate.setMap(new Mapper() {
            @Override
            public void map(Map<String, Object> document, Emitter emitter) {
                Object createdAt = document.get("created_at");
                if (createdAt != null) {
                    emitter.emit(createdAt.toString(), document);
                }
            }
        }, "1.0");
```

The name of the view is arbitrary, but you need to use it later on when querying the view. The interesting part here is the `Mapper` expression, which is a block defining the map function. The block that takes the following parameters:

 * A map that has the contents of the document being indexed.
 * A function called `emitter` that takes the parameters `key` and `value`. This is the function your code calls to emit a key-value pair into the view's index.

After you get that, the example map block is straightforward: it looks for a `created_at` property in the document, and if it's present, it emits it as the key, with the entire document contents as the value. Emitting the document as the value is fairly common. It makes it slightly faster to read the document at query time, at the expense of some disk space.

The view index then consists of the dates of all documents, sorted in order. This is useful for displaying the documents ordered by date (which Grocery Sync does), or for finding all documents created within a certain range of dates.

Any document without a `created_at` field is ignored and won't appear in the view index. This means you can put other types of documents in the same database (such as names and addresses of of grocery stores) without them messing up the display of the shopping list.

<div class="notebox">
<p>Note</p>
<p>The view index itself is persistent, but the <code>setMap()</code> method must be called every time the app starts, before the view is accessed. You need to call it because the map function <em>is not</em> persistent&mdash;it's an ephemeral block pointer that needs to be hooked up to Couchbase Lite at run time.</p>
</div>

### Querying Views

Now that the view is created, querying it is very much like using `createAllDocumentsQuery()`, except that you get the `Query` object from the view rather than the database:

```java
com.couchbase.lite.View view = database.getView("byDate");
Query query = view.createQuery();
```

Every call to `createQuery()` creates a new `Query` object, ready for you to customize. You can set a number of properties to specify key ranges, ordering, and so on, as described in the [view and query design](#view-and-query-design) section. Then you run the query exactly as described in [Getting All Documents](#getting-all-documents).

### Updating Queries

It's useful to know whether the results of a query have changed. You might have generated some complex output, like a fancy graph, from the query rows, and would prefer to save the work of recomputing the graph if nothing has changed. You can accomplish this by keeping the `QueryEnumerator` object around, and then later checking its `stale` property. This property returns `true` if the results are out of date:

```java
if (rowEnum.isStale()) {
    rowEnum = query.run();
}
```
### Using Live Queries

Even better than _checking_ for a query update is getting _notified_ when one happens. Users expect apps to be live and don't want to have to press a refresh button to see new data. This is especially true if data might arrive over the network at any time through synchronization&mdash;that new data needs to show up right away.

For this reason Couchbase Lite has a very useful subclass of `Query` called `LiveQuery`, which has a `rows` property that updates automatically as the database changes. You can register as a listener for immediate notifications when the database changes, and use those notifications to drive user-interface updates.

To create a `LiveQuery` you just ask a regular query object for a live copy of itself. You can then register as a listener:

```java
private void startLiveQuery(com.couchbase.lite.View view) throws Exception {

    final ProgressDialog progressDialog = showLoadingSpinner();
    if (liveQuery == null) {

        liveQuery = view.createQuery().toLiveQuery();

        liveQuery.addChangeListener(new LiveQuery.ChangeListener() {
            @Override
            public void changed(LiveQuery.ChangeEvent event) {
                displayRows(event.getRows());
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progressDialog.dismiss();
                    }
                });
            }
        });

        liveQuery.start();

    }
}
```

Don't forget to remove the observer when cleaning up. 

### View and Query Design

This section discusses how to set up some different types of queries.
#### All Matching Results

If you run the query without setting any key ranges, the result is all the emitted rows, in ascending order by key. To reverse the order, set the query's `descending` property.

#### Exact Queries

To get only the rows with specific keys, set the query's `keys` property to an array of the desired keys:

```java
List<Object> keyArray = new ArrayList<Object>();
keyArray.add("d123");
keyArray.add("d457");
query.setKeys(keyArray);
```

The order of the keys in the array doesn't matter because the results are returned in ascending-key order.

#### Key Ranges

To get a range of keys, set the query's `startKey` and `endKey` properties. The range is inclusive, that is, the result includes the rows with key equal to `endKey`.

One common source of confusion is combining key ranges with descending order. Remember that you're specifying the _starting_ and _ending_ keys, not the _minimum_ and _maximum_ values. In a descending query, the `startKey` should be the maximum value and the `endKey` the minimum value.

#### Compound Keys

The real power of views comes when you use compound keys. If your map function emits arrays as keys, they are sorted as you would expect: the first elements are compared, and if they're equal the second elements are compared, and so forth. This lets you sort the rows by multiple criteria (like store and item), or group together results that share a criterion.

For example, if a map function emitted the document's `store` and `item` properties as a compound key:

    emit(@[doc[@"store"], doc[@"item"]], nil);

then the view's index contains a series of keys ordered like this:

    ...
    ["Safeway", "goldfish crackers"]
    ["Safeway", "tonic water"]
    ["Trader Joe's", "chocolate chip cookies"]
    ["Whole Foods", "cruelty-free chakra lotion"]
    ...

##### Compound-Key Ordering

The ordering of compound keys depends entirely on how you want to query them; the broader criteria go to the left of the narrower ones. For some queries you might need a different ordering than for others. If so, you need to define a separate view for each ordering. For example, the above ordering is good for finding all the items to buy at a particular store. If instead you want to look up a specific item and see what stores to get it at, you'd want the compound keys in the opposite order. So you could define views called "stores" and "items", and query whichever one is appropriate.

##### Compound-Key Ranges

The way you specify the beginning and end of compound-key ranges can be a bit unintuitive. For example, you have a view whose keys are of the form `[store, item]` and you want to find all the items to buy at Safeway. What are the `startKey` and `endKey`? Clearly, their first elements are `@"Safeway"`, but what comes after that? You need a way to specify the minimum and maximum possible keys with a given first element. The code to set the start and keys looks like this:

    query.startKey = @[ @"Safeway" ];
    query.endKey = @[ @"Safeway", @{} ];

The minimum key with a given first element is just a length-1 array with that element. (This is just like the way that the word "A" sorts before any other word starting with "A".)

The maximum key contains an empty `NSDictionary` object. Couchbase Lite defines a sorting or collation order for all JSON types, and JSON objects (also known as dictionaries) sort after everything else. An empty dictionary is kind of like a "Z" on steroids&mdash;it's a placeholder that sorts after any string, number, or array. It looks weird at first, but it's a useful idiom used in queries to represent the end of a range.


