## Working With Documents

The `CBLDocument` class represents a document. A `CBLDocument` knows its database and document ID, and can cache the document's current contents. The contents are represented as parsed JSON—an `NSDictionary`, whose keys are `NSString` objects and whose values can be any of the classes `NSString`, `NSNumber`, `NSNull`, `NSArray` or `NSDictionary`. (Note that, unlike native Cocoa property lists, `NSData` and `NSDate` are not supported.)

### Creating A Document

You create a new document when the user creates a persistent data item in your app, such as a reminder, a photograph or a high score. To save the data, construct a JSON-compatible representation of the data, instantiate a new `CBLDocument` and save the data to it.

Here's an example from the Grocery Sync demo app:

```
NSDictionary *contents = 
     @{@"text"       : text,
       @"check"      : [NSNumber numberWithBool:NO],
       @"created_at" : [CBLJSON JSONObjectWithDate: [NSDate date]]};
```

Next, ask the `CBLDatabase` object, which you instantiated when you initialized Couchbase Lite, to create a new document. This doesn't add anything to the database yet—just like the **New** command in a typical Mac or Windows app, the document is not stored on disk until you save some data into it. Continuing from the previous example:

```
CBLDocument* doc = [database createDocument];
```

When you create a document by calling the `createDocument:` method, Couchbase Lite generates a random unique identifier (a long string of hex digits) for it. You can choose your own identifier by calling `[database documentWithID: someID]` instead. Remember that your identifier has to be unique so you don't get a conflict error when you save it.

Finally, save the contents to the document:

```
NSError* error;
if (![doc putProperties: contents error: &error]) {
   [self showErrorAlert: @"Couldn't save the new item"]
}
```

### Reading A Document

If later on you want to retrieve the contents of a document, you need to obtain the `CBLDocument` object representing it and then get the contents from that object.

You can get a `CBLDocument` in the following ways:

 * If you know its ID (maybe you kept it in memory, maybe you got it from `NSUserDefaults`, or even from a property of another document), you can call `[database existingDocumentWithID:]`. This method loads the document from the database or returns `nil` if the document does not exist.
 
* If you are iterating the results of a [view query](working-with-views-and-queries) or `allDocument`, which is a special view, you can get it from the `CBLQueryRow` object `document` property.

After you get the document object, you can get its content in any of the following ways:


* By accessing the `properties` property:

	```
	CBLDocument* document = [database existingDocumentWithID: documentID];
	NSDictionary* contents = document.properties;
	```

* By using the shortcut `propertyForKey:` method to get one property at a time:

    ```
	NSString* text = [document propertyForKey: @"text"];
	BOOL checked = [[document propertyForKey: @"check"] boolValue];
    ```

* By using the handy Objective-C collection indexing syntax (available in Xcode 4.5 or later):
    
	```
	NSString* text = document[@"text"];
	BOOL checked = [document[@"check"] boolValue];
	```

You might wonder which of these lines actually reads from the database. The answer is that the `CBLDocument` starts out empty, loads its contents on demand, and then caches them in memory &mdash; so it's the call to `document.properties` in the first example, or the first `propertyForKey:` call in the second example. Afterwards, getting properties is as cheap as a dictionary lookup. For this reason it's best not to keep references to huge numbers of `CBLDocument` objects, or you'll end up storing all their contents in memory. Instead, rely on queries to look up documents as you need them.

### Updating A Document

To update a document, you call `putProperties:` again. Couchbase Lite uses Multiversion Concurrency Control (MVCC) to manage changes to documents. When you update a document, you must tell Couchbase Lite which revision you updated so it can stop you if there were any updates to the document in the meantime. If it didn't, you would wipe out those updates by overwriting them. 

Documents contain a special property named `_rev` whose value is the current revision ID. The revision ID is a long, hex string. When you update a document, the new properties dictionary must contain a `_rev` key whose value is the ID of the revision that you're updating.

The `_rev` property is already in the dictionary you got from the `CBLDocument`, so all you need to do is modify the properties dictionary and hand back the modified dictionary that still contains the `_rev` property to `putProperties:`.

The following example shows a document update:  

```
// copy the document
NSMutableDictionary *contents = [[doc.properties mutableCopy] autorelease];

// toggle value of check property
BOOL wasChecked = [[contents valueForKey: @"check"] boolValue];
    [contents setObject: [NSNumber numberWithBool: !wasChecked] forKey: @"check"];

// save the updated document  
NSError* error;
if (![doc putProperties: contents error: &error])
   [self showErrorAlert: @"Couldn't update the item"];
```

In the example, the document is copied to a mutable dictionary object called `contents` that already contains the current revision ID in its `_rev` property. Then the document is modified by toggling the `check` property. Finally, you save the same way it was originally saved, by sending a message to the `putProperties:error:` method.



#### Handling Update Conflicts

Due to the realities of concurrent programming, the previous example code is vulnerable to a race condition. If something else updates the document in between the calls to the `properties:` and `putProperties:error:` methods, the operation fails. (The error domain is `CBLHTTPErrorDomain` and the error code is 409, which is the HTTP status code for `Conflict`.)

Even if your app is single-threaded, most Couchbase Lite apps use replication, which runs in the background. So it's possible that one of your users might get unlucky and find that Couchbase Lite received a remote update to that very document, and inserted it a moment before he tried to save his own update. He'll get an error about a conflict. Then he'll try the operation again, and this time it'll work because by now your `CBLDocument` has updated itself to the latest revision.

This is, admittedly, unlikely to happen in the above example because the elapsed time between getting and putting the properties is so short (microseconds, probably). It's more likely in a situation where it takes the user a while to make a change. For example, in a fancier to-do list app the user might open an inspector view, make multiple changes, then commit them. The app would probably fetch the document properties when the user presses the edit button, let the user take as long as she wants to modify the UI controls, and then save when she returns to the main UI. In this situation, minutes might have gone by, and it's much more likely that in the meantime the replicator pulled down someone else's update to that same document.

We'll show you how to deal with this, but for simplicity we'll do it in the context of our  example. The easiest way to deal with this is to respond to a conflict by starting over and trying again. By now the `CBLDocument` will have updated itself to the latest revision, so you'll be making your changes to current content and won't get a conflict.

First figure out what change to make. In this case, we want to save the new setting of the checkbox:

```
    NSMutableDictionary *docContent = [[doc.properties mutableCopy] autorelease];
    BOOL wasChecked = [[docContent valueForKey:@"check"] boolValue];
```

Then we get the document contents, apply the change, and retry as long as there's a conflict:

```
    NSError* error = nil;
    do {
        docContent = [[doc.properties mutableCopy] autorelease];
        [docContent setObject:[NSNumber numberWithBool:!wasChecked] forKey:@"check"];
        [[doc putProperties: docContent] wait: &error];
    } while ([error.domain isEqualToString: CBLHTTPErrorDomain] && error.code == 409);
```

The example shows a second call to `doc.properties`, but it's in the loop. The first call is redundant, but it's vital if there's a conflict and the loop has to execute a second time, so that `docContent` can pick up the new contents.


<div class="notebox">
<p>Note</p>
<p>A different type of document revision conflict arises as a result of replication. In that case, the conflict can't be detected in advance, so both conflicting revisions exist at once in the database and have to be merged. This type of conflict is covered in the <a href=""#working-with-replication">replication</a> section.</p>
</div>

### Deleting A Document

Deleting is a lot like updating. Instead of calling `putProperties:` you call `deleteDocument:`. Here's an example:

```
    NSError* error;
    if (![doc deleteDocument: &error])
        [self showErrorAlert: @"Couldn't delete the item"];
```

The same complications about conflicts apply. You won't get a conflict if someone else deleted the document first, but you will if someone modified it. Then you need to decide which takes precedence, and either retry the delete or give up.
