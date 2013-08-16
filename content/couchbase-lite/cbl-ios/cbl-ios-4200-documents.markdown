## Working With Documents

The [CBLDocument][CBLDOCUMENT] class represents a document. A `CBLDocument` knows its database and document ID, and can cache the document's current contents. The contents are represented as parsed JSON &mdash; an `NSDictionary`, whose keys are `NSString` objects and whose values can be any of the classes `NSString`, `NSNumber`, `NSNull`, `NSArray` or `NSDictionary`. (Note that, unlike native Cocoa property lists, `NSData` and `NSDate` are not supported.)

### Creating A Document

You create a new document when the user creates a persistent data item in your app, such as a reminder, a photograph or a high score. To save this, construct a JSON-compatible representation of the data, instantiate a new `CBLDocument` and save the data to it.

Here's an example from the Grocery Sync demo app:

```
	NSDictionary *contents = [NSDictionary dictionaryWithObjectsAndKeys:
								text, @"text",
                                [NSNumber numberWithBool:NO], @"check",
                                [RESTBody JSONObjectWithDate: [NSDate date]], @"created_at",
                                nil];
```

Next, ask the `CBLDatabase` object, which you instantiated when you initialized Couchbase Lite, for a new document. This doesn't add anything to the database yet &mdash; just like the **New** command in a typical Mac or Windows app, the document is not stored on disk until you save some data into it. Continuing from the previous example:

```
    CBLDocument* doc = [database untitledDocument];
```

"Untitled" is a little bit of a misnomer, because this document does have an ID already reserved for it. Couchbase Lite just made up a random unique ID (a long string of hex digits). You can choose your own ID by calling `[database documentWithID: someID]` instead; just remember that it has to be unique so you don't get a conflict error when you save it.

### Saving A Document

Finally save the contents to the document:

```
    NSError* error;
    if (![doc putProperties: contents error: &error];
        [self showErrorAlert: @"Couldn't save the new item"];
```

### Reading A Document

If later on you want to retrieve the contents of the document, you need to obtain the `CBLDocument` object representing it and then get the contents from that object.

You can get the `CBLDocument` in the any of the following ways:

 * You might know its ID (maybe you kept it in memory, maybe you got it from `NSUserDefaults` or even from a property of another document), in which case you can call `[database documentWithID:]`.
 
* If you are iterating the results of a view query or `allDocument`, which is a special view, you can get it from the `CBLQueryRow` object `document` property.

After you get the document object, you can get its content in any of the following ways:

* By accessing the `properties` property:

    ```
	CBLDocument* doc = [database documentWithID: documentID];
	NSDictionary* contents = document.properties;
    ```

* By using the shortcut `propertyForKey:` to get one property at a time:

    ```
	NSString* text = [document propertyForKey: @"text"];
	BOOL checked = [[document propertyForKey: @"check"] boolValue];
    ```

* By using the handy Objective-C collection indexing syntax (available in Xcode 4.5 or later):
    
    ```
	NSString* text = document[@"text"];
	BOOL checked = [document[@"check"] boolValue];
    ```

You might wonder which of these lines actually hits the database. The answer is that the `CBLDocument` starts out empty, loads its contents on demand, and then caches them in memory &mdash; so it's the call to `document.properties` in the first example, or the first `propertyForKey:` call in the second example. Afterwards, getting properties is as cheap as a dictionary lookup. For this reason it's best not to keep references to huge numbers of `CBLDocument` objects, or you'll end up storing all their contents in memory. Instead, rely on queries to look up documents as you need them.

### Updating A Document

To update a document, you can just call `putProperties:` again.

Multiversion Concurrency Control (MVCC) comes into play here. When you update a document, Couchbase Lite wants to know _which revision you updated_, so it can stop you if there were any updates in the meantime. If it didn't, you would wipe out those updates by overwriting them. I'll get into update-conflict handling in a little bit; for now, just realize that Couchbase Lite wants to see that `_rev` property in the properties you're putting.

The `_rev` property is already in the dictionary you got from the `CBLDocument`, So all you need to do is _modify the properties dictionary_ and hand back the modified dictionary, which still contains the `_rev` property, to `putProperties:`

```
    NSMutableDictionary *contents = [[doc.properties mutableCopy] autorelease];
    BOOL wasChecked = [[contents valueForKey: @"check"] boolValue];
    [contents setObject: [NSNumber numberWithBool: !wasChecked] forKey: @"check"];
```

`docContent` is now a copy of the existing document (including the important `_rev` property), with the value of the `checked` property toggled.

Finally you save the document the same way you did when you created it:

```
    NSError* error;
    if (![doc putProperties: contents error: &error])
        [self showErrorAlert: @"Couldn't update the item"];
```

#### Update Conflicts

Now let's look at the messy reality of concurrent programming. The above example code is vulnerable to a race condition. If something else updates the document in between the calls to `document.properties` and `[document putProperties:]`, the operation will fail. (The error domain will be `CBLHTTPErrorDomain` and the error code 409, which is HTTP for "Conflict".)

"So what?" you might object. "My app is single-threaded, so it can't make any other changes in between." Ah, but most Couchbase Lite apps use replication (since it's such an awesome feature), and replication runs in the background. So it's possible that one of your users might get unlucky and find that Couchbase Lite sucked down a remote update to that very document, and inserted it a moment before he tried to save his own update. He'll get some weird error about a conflict. Then he'll try the operation again, and this time it'll work (because by now your CBLDocument has updated itself to the latest revision). This will annoy him and he'll go and lower his App Store rating of your app.

This is, admittedly, vanishingly unlikely to happen in the above example, because the elapsed time between getting and putting the properties is so short (microseconds, probably). It's more likely in a situation where it takes the user a while to make a change. For example, in a fancier to-do list app the user might open an inspector view, make multiple changes, then commit them. The app would probably fetch the document properties when the user presses the Edit button, let the user take as long as she wants to modify the UI controls, then save when she returns to the main UI. In this situation minutes may have gone by, and it's much more likely that in the meantime the replicator pulled down someone else's update to that same document.

I'll show you how to deal with this, but for simplicity I'll do it in the context of our rather trivial example. The easiest way to deal with this is to respond to a conflict by starting over and trying again. By now the `CBLDocument` will have updated itself to the latest revision, so you'll be making your changes to current content and won't get a conflict.

First we figure out what change we want to make &mdash; in this case, the new setting of the checkbox:

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

(Yes, there is a second call to `doc.properties`. But it's in the loop; the first call is redundant, but it's vital if there's a conflict and the loop has to execute a second time, so that `docContent` can pick up the new contents.)

**Note:** There is a different type of document revision conflict that arises as a result of replication. In that case the conflict can't be detected in advance, so both conflicting revisions exist at once in the database and have to be merged. This type of conflict is covered in the [replication](#working-with-replication) section.

### Deleting A Document

Deleting is a lot like updating; instead of calling `putProperties:` you call `deleteDocument:`. Here's the sample code, which should be familiar looking by now:

```
    NSError* error;
    if (![doc deleteDocument: &error])
        [self showErrorAlert: @"Couldn't delete the item"];
```

The same complications about conflicts apply. You won't get a conflict if someone else deleted the document first, but you will if someone modified it. Then you'll need to decide which takes precedence, and either retry the delete or give up.
