## Working with documents

Documents are represented by the `Document` class. You create and retrieve documents by using methods in the `Database` class, and you work with the document content by using methods in the `Document` class.

### Creating documents

You create a new document when the user creates a persistent data item in your app, such as a reminder, a photograph or a high score. To create a new document, construct a JSON-compatible representation of the data, instantiate a new document and save the data to the new document.

In the following example,  `properties` is a `HashMap` object that provides a JSON-compatible representation of the document data.

```java
// set up a time stamp to use later
SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
Calendar calendar = GregorianCalendar.getInstance();
String currentTimeString = dateFormatter.format(calendar.getTime());

// create an object to hold document data
Map<String, Object> properties = new HashMap<String, Object>();

// store document data 
properties.put("text", text);
properties.put("check", Boolean.FALSE);
properties.put("created_at", currentTimeString);

// create a new document
Document document = database.createDocument();

// store the data in the document
document.putProperties(properties);
```

When you create a document by calling the `createDocument:` method, Couchbase Lite generates a random unique identifier (a long string of hex digits) for it. You can choose your own identifier by calling `getDocument()` instead. When creating your own identifiers, remember that each identifier must be unique so you don't get conflict errors when you save documents.

### Reading documents

To retrieve the contents of a document, you need to obtain the `Document` object representing it by requesting the document from the `Database` object. After you obtain the document, you can get the contents from that object.

You can retrieve a `Document` object in the following ways:

* If you know the document's ID, you can call  `getDocument()` or `getExistingDocument()` on the `Database` object. These methods are similar but operate differently depending on whether the document exists. If the document exists, each method loads the document from the database. If the document does not exist, `getDocument()` creates a new document with the given ID and `getExistingDocument()` returns null.
 
* If you are iterating the results of a [view query](working-with-views-and-queries) or `createAllDocumentsQuery()` call, you can call `getDocument()` on the  `QueryRow` object.

Here's an example that shows how to retrieve a document by requesting it from a `QueryRow` object:

```java
QueryRow row = (QueryRow) adapterView.getItemAtPosition(position);
Document document = row.getDocument();
```

After you retrieve the document, you can get its content by calling `getProperties()` on it:

```java
Map<String, Object> curProperties = document.getProperties();
```

You can also retrieve individual properties from the document by calling `getProperty()` on it:

```java
boolean checked = ((Boolean)document.getProperty("check")).booleanValue();
```
### Updating documents

To update a document after you modify its attributes, call `putProperties:` again. Couchbase Lite uses Multiversion Concurrency Control (MVCC) to manage changes to documents. When you update a document, you must tell Couchbase Lite which revision you updated so it can stop you if there were any updates to the document in the meantime. If it didn't, you would wipe out those updates by overwriting them. 

Documents contain a special property named `_rev` whose value is the current revision ID. The revision ID is a long, hex string. When you update a document, the new properties dictionary must contain a `_rev` key whose value is the ID of the revision that you're updating.

The `_rev` property is already in the dictionary you got from the `CBLDocument`, so all you need to do is modify the properties dictionary and hand back the modified dictionary that still contains the `_rev` property to `putProperties:`.

The following example retrieves a document, gets a property named `check` from the document, toggles the value of `check`, and then writes an updated revision of the document to the database.

```java
// get a document from a QueryRow object
Document document = row.getDocument();

// get the current document properties
Map<String, Object> curProperties = document.getProperties();

// make a copy of the document properties
Map<String, Object> newProperties = new HashMap<String, Object>();
newProperties.putAll(curProperties);

// get the current value of the check property
boolean checked = ((Boolean) newProperties.get("check")).booleanValue();

// toggle check value and store in copy of properties
newProperties.put("check", !checked);

// update the document with the new property values
try {
	document.putProperties(newProperties);
	itemListViewAdapter.notifyDataSetChanged();
} catch (Exception e) {
	Toast.makeText(getApplicationContext(), "Error updating database, see logs for details", Toast.LENGTH_LONG).show();
	Log.e(TAG, "Error updating database", e);
}
```

#### Handling update conflicts

Due to the realities of concurrent programming, the previous example code is vulnerable to a race condition. If something else updates the document in between the calls to the `getProperties()` and `putProperties()` methods, the operation fails. 

Even if your app is single-threaded, most Couchbase Lite apps use replication, which runs in the background. So it's possible that one of your users might get unlucky and find that Couchbase Lite received a remote update to that very document, and inserted it a moment before he tried to save his own update. He'll get an error about a conflict. Then he'll try the operation again, and this time it'll work because by now your `Document` has updated itself to the latest revision.

This is, admittedly, unlikely to happen in the above example because the elapsed time between getting and putting the properties is so short (microseconds, probably). It's more likely in a situation where it takes the user a while to make a change. For example, in a fancier to-do list app the user might open an inspector view, make multiple changes, then commit them. The app would probably fetch the document properties when the user presses the edit button, let the user take as long as she wants to modify the UI controls, and then save when she returns to the main UI. In this situation, minutes might have gone by, and it's much more likely that in the meantime the replicator pulled down someone else's update to that same document.

The easiest way to deal with a conflict is by starting over and trying again. By now the `Document` will have updated itself to the latest revision, so you'll be making your changes to current content and won't get a conflict.

Here's an example that shows how to handle conflicts. The example makes a copy of the document properties, and then tries to update the document. If the update is successful, the update operation ends. Otherwise, the catch block looks at the returned error code to decide the next action. If the error is a 409 Conflict HTTP status code, it tries to update the document again. If the error contains any other status code, it logs the error and ends the update operation.

```java
boolean done = false;
do {
    Map<String, Object> properties = new HashMap<String, Object>(doc.getProperties());
    try {
        doc.putProperties(properties);
        done = true;
    } catch (CouchbaseLiteException e) {
        if (e.getCBLStatus().getCode() == Status.CONFLICT) {
            // keep trying
        } else {
            e.printStackTrace();
            done = true;
        }
    }
} while (!done);
```

### Deleting documents

Deleting a document is similar to updating a document. Instead of calling `putProperties()` you call `delete()` on the document. Here's an example:

```java
try {
	document.delete();
} catch (Exception e) {
	Log.e ("Main Activity:", "Error deleting document", e);
}
```

The same complications about conflicts apply to deleting documents. You won't get a conflict if someone else deleted the document first, but you will if someone modified it. If that happens, you need to decide which takes precedence, and either retry the delete or give up.