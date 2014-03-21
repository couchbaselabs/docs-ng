## Working With Replications

This section describes how to work with replications in an iOS app. To learn more about replications, read about [Replication](/couchbase-lite/cbl-concepts/#replication) in the *Couchbase Lite Concepts Guide*.

### Creating replications
Replications are represented by `CBLReplication` objects. You create replication objects by calling one of the following  methods on your local `CBLDatabase` object:

* `replicationFromURL:` sets up a pull replication.
* `replicationToURL:` sets up a push replication.
* `replicationsWithURL:exclusively:` sets up a bidirectional replication.

Creating a replication object does not start the replication automatically. To start a replication, you need to send a `start` message to the replication object.

Newly created replications are noncontinuous. To change the settings, you need to immediately set their `continuous` properties.

It's not strictly necessary to keep references to the replication objects, but you do need them if you want to [monitor their progress](#monitoring-replication-progress).

`replicationsWithURL:exclusively:`, which creates a bidirectional replication, returns an `NSArray` that contains a pull replication in the first element and a push replication in the second element. The following example shows how to set up and start a bidirectional replication:

```
CBLReplication *pull;
CBLReplication *push;

NSArray* repls = [self.database replicationsWithURL: newRemoteURL 
                                        exclusively: YES];
                                        
self.pull = [repls objectAtIndex: 0];
self.push = [repls objectAtIndex: 1];

[self.pull start];
[self.push start];
```

The `exclusively: YES` option seeks out and removes any pre-existing replications with other remote URLs. This is useful if you sync with only one server at a time and just want to change the address of that server.

### Monitoring replication progress
A replication object has several properties you can observe to track its progress. You can use the following `CBLReplication` class properties to monitor replication progress:

 * `completedChangesCount`—number of documents copied so far in the current batch
 * `changesCount`—total number of documents to be copied
 * `lastError`—set to an `NSError` if the replication fails or `nil` if there has not been an error since the replication started.
 * `status`—an enumeration named `CBLReplicationStatus` that indicates the current state of the replication. The status can be stopped, offline, idle or active. Stopped means the replication is finished or hit a fatal error. Offline means the server is unreachable over the network. Idle means the replication is continuous but there is currently nothing left to be copied. Active means the replication is currently transferring data.

In general, you can just observe the `completedChangesCount` property:

    [self.pull addObserver: self 
                forKeyPath: @"completedChangesCount" 
                   options: 0 
                   context: NULL];
                   
    [self.push addObserver: self 
                forKeyPath: @"completedChangesCount" 
                   options: 0 
                   context: NULL];

Your observation method might look like this:

	- (void) observeValueForKeyPath:(NSString *)keyPath
	                       ofObject:(id)object
	                         change:(NSDictionary *)change
	                        context:(void *)context
	{
	    if (object == pull || object == push) {
	        unsigned completed = pull.completedChangesCount + push.completedChangesCount;
	        unsigned total = pull.changesCount + push.changesCount;
	        if (total > 0 && completed < total) {
	            [self showProgressView];
	            [progressView setProgress: (completed / (float)total)];
	        } else {
	            [self hideProgressView];
	        }
	    }
	}

In the example, `progressView` is a `UIProgressView` object that shows a bar graph of the current progress. The progress view is shown only while replication is active, that is, when `total` is nonzero.

Don't expect the progress indicator to be completely accurate. It might jump around because the `changesCount` property changes as the replicator figures out how many documents need to be copied. It might not advance smoothly because some documents, such as those with large attachments, take longer to transfer than others. In practice, the progress indicator is accurate enough to give the user an idea of what's going on.

### Deleting replications

You can cancel continuous replications by deleting them. The following example shows how to delete a replication by deleting the associated `CBLModel` object, `repl`:

```objectivec
[repl deleteDocument: &error];
```

The following example shows how to delete all replications involving a database. In the example, `db` is a `CBLDatabase` object.

```objectivec
[db replicationsWithURL: nil exclusively: YES];
```


### Document validation

Pulling from another database requires some trust because you are importing documents and changes that were created elsewhere. Aside from issues of security and authentication, how can you be sure the documents are even formatted correctly? Your application logic probably makes assumptions about what properties and values documents have, and if you pull down a document with invalid properties it might confuse your code.

The solution to this is to add a validation function to your database. The validation function is called on every document being added or updated. The function decides whether the document should be accepted, and can even decide which HTTP error code to return (most commonly 403 Forbidden, but possibly 401 Unauthorized).

Validation functions aren't just called during replication&mdash;they see every insertion or update, so they can also be used as a sanity check for your own application code. If you forget this, you might occasionally be surprised by getting a 403 Forbidden error from a document update when a change is rejected by one of your own validation functions.

Here's an example validation function definition from the Grocery Sync sample code. This is a real-life example of self-protection from bad data. At one point during development, the Android Grocery Sync app was generating dates in the wrong format, which confused the iOS app when it pulled down the documents created on Android. After the bug was fixed, the affected docs were still in server-side databases. The following validation function was added to reject documents that had incorrect dates:

```objc
    [theDatabase setValidationNamed: @"created_at" asBlock: VALIDATIONBLOCK({
        if (newRevision.isDeletion)
            return;
        id date = (newRevision.properties)[@"created_at"];
        if (date && ! [CBLJSON dateWithJSONObject: date]) {
            [context rejectWithMessage: [@"invalid date " stringByAppendingString: [date description]]];
        }
    })];
```
The validation block ensures that the document's `created_at` property, if present, is in valid ISO-8601 date format. The validation block takes the following parameters: 

*  `newRevision`—a `CBLRevision` object that contains the new document revision to be approved
*  `context`— an `id<CBLValidationContext>` object that you can use to communicate with the database 

A validation block should look at `newRevision.properties`, which is the document content, to determine whether the document is valid. If the revision is invalid, you can either call the `rejectWithMessage:` method on the `context` object to customize the error returned or just call the `reject` method.

The example validation block first checks whether the revision is deleted. This is a common idiom: a *tombstone* revision marking a deletion usually has no properties at all, so it doesn't make sense to check their values. Another reason to check for deletion is to enforce rules about which documents are allowed to be deleted. For example, suppose you have documents that contain a property named `status` and you want to disallow deletion of any document whose `status` property was not first set to `completed`. Making that check requires looking at the _current_ value of the `status` property, before the deletion. You can get the currently active revision from the  `currentRevision` property of `context`. This is very useful for enforcing immutable properties or other restrictions on the changes can be made to a property. The `CBLValidationContext`  property `changedKeys` is also useful for checking these types of conditions.

You can optionally define schemas for your documents by using the powerful [JSON-Schema](http://json-schema.org) format and validate them programmatically. To learn how to do that, see [Validating JSON Objects](#validating-json-objects).

### Filtered replications

You might want to replicate only a subset of documents, especially when pulling from a huge cloud database down to a limited mobile device. For this purpose, Couchbase Lite supports user-defined filter functions in replications. A filter function is registered with a name. It takes a document's contents as a parameter and simply returns true or false to indicate whether it should be replicated.

#### Filtered pull

Filter functions are run on the _source_ database. In a pull, that would be the remote server, so that server must have the appropriate filter function. If you don't have admin access to the server, you are restricted to the set of already existing filter functions.

To use an existing remote filter function in a pull replication, set the replication's `filter` property to the filter's full name, which is the design document name, a slash, and then the filter name:

	pull.filter = @"grocery/sharedItems";

Filtered pulls are how Couchbase Lite can encode the list of [channels](https://github.com/couchbaselabs/sync_gateway/wiki/Channels-Access-Control-and-Data-Routing-w-Sync-Function) it wants Sync Gateway to replicate, although in the case of Sync Gateway, the implementation is based on indexes, not filters.

#### Filtered push

During a push, the filter function runs locally in Couchbase Lite. As with MapReduce functions, the filter function is specified at run time as a native block pointer. Here's an example of defining a filter function that passes only documents with a `"shared"` property with a value of `true`:

```objectivec
database setFilterNamed: @"sharedItems"
                asBlock: FILTERBLOCK({
                   return [[doc objectForKey: @"shared"] booleanValue];
                })];
```

This function can then be plugged into a push replication by name:

```objectivec
push.filter = @"sharedItems";
```

#### Parameterized filters

Filter functions can be made more general-purpose by taking parameters. For example, a filter could pass documents whose `"owner"` property has a particular value, allowing the user name to be specified by the replication. That way there doesn't have to be a separate filter for every user.

To specify parameters, set the `filterParams` property of the replication object. Its value is a dictionary that maps parameter names to values. The dictionary must be JSON-compatible, so the values can be any type allowed by JSON.

Couchbase Lite filter blocks get the parameters as a `params` dictionary passed to the block.

#### Deleting documents with filtered replications

Deleting documents can be tricky in the context of filtered replications.  For example, assume you have a document that has a `worker_id` field, and you set up a filtered replication to pull documents only when the `worker_id` equals a certain value.

When one of these documents is deleted, it does not get synched in the pull replication.  Because the filter function looks for a document with a specific `worker_id`, and the deleted document won't contain any `worker_id`, it fails the filter function and therefore is not synched.

This can be fixed by deleting documents in a different way.  Because a document is considered deleted as long as it has the special `_deleted` field, it is possible to delete the document while still retaining the `worker_id` field.  Instead of using the DELETE verb, you instead use the PUT verb.  You definitely need to set the `_deleted` field  for the document to be considered deleted. You can then either retain the fields that you need for filtered replication, like the `worker_id` field, or you can retain all of the fields in the original document.

### Replication conflicts

Replication is a bit like merging branches in a version control system (for example, pushing and pulling in Git). Just as in version control, you can run into conflicts if incompatible changes are made to the same data. In Couchbase Lite this happens if a replicated document is changed differently in the two databases, and then one database is replicated to the other. Now both of the changes exist there. Here's an example scenario:

 1. Create `mydatabase` on device A.
 2. Create document 'doc' in `mydatabase`. Let's say its revision ID is '1-foo'.
 3. Push `mydatabase` from device A to device B. Now both devices have identical copies of the database.
 4. On device A, update 'doc', producing new revision '2-bar'.
 5. On device B, update 'doc' differently, producing new revision '2-baz'. (No, this does not cause an error. The different revision 2 is in a different copy of the database on device A, and device B has no way of knowing about it yet.)
 6. Now push `mydatabase` from device A to device B again. (Transferring in the other direction would lead to similar results.)
 7. On device B, `mydatabase` now has _two_ current revisions of 'doc': both '2-bar' and '2-baz'.

You might ask why the replicator allows the two conflicting revisions to coexist, when a regular PUT doesn't. The reason is that if the replicator were to give up and fail with a 409 Conflict error, the app would be in a bad state. It wouldn't be able to resolve the conflict because it doesn't have easy access to both revisions (the other revision is on the other device). By accepting conflicting revisions, the replicator allows apps to resolve the conflicts by operating only on local data.

What happens on device B now when the app tries to get the contents of 'doc'? For simplicity, Couchbase Lite preserves the illusion that one document ID maps to one current revision. It does this by choosing one of the conflicting revisions, '2-baz' as the "winner" that is returned by default from API calls. If the app on device B doesn't look too close, it thinks that only this revision exists and ignores the one from device A.

You can detect conflicts in the following ways:

* Call `-[CBLDocument getConflictingRevisions:]` and check for multiple returned values.
* Create a view that finds all conflicts by having its map function look for a `_conflicts` property and emit a row if it's present.

After a conflict is detected, you resolve it by deleting the revisions you don't want and optionally storing a revision that contains the merged contents. In the example, if the app wants to keep one revision it can just delete the other one. More likely it needs to merge parts of each revision, so it can do the merge, delete revision '2-bar', and put the new merged copy as a child of '2-baz'.
