## Working With Replication

Replication is a key feature of Couchbase Lite and enables document syncing. Replication is conceptually simple&mdash;take everything that's changed in database A and copy it over to database B&mdash;but it comes with a sometimes confusing variety of options:

* **Push versus pull.** This is really just a matter of whether A or B is the remote database.
* **Continuous versus one-shot.** A one-shot replication proceeds until all the current changes have been copied, then finishes. A continuous replication keeps the connection open, idling in the background and watching for more changes. As soon as the continuous replication detects any changes, it copies them. Couchbase Lite's replicator is aware of connectivity changes. If the device goes offline, the replicator watches for the server to become reachable again and then reconnects.
* **Persistent versus non-persistent.** Non-persistent replications, even continuous ones, are forgotten after the app quits. Persistent replications are remembered in a special `_replicator` database. This is most useful for continuous replications: by making them persistent, you ensure they are always ready and watching for changes every time your app launches.
* **Filters.** Sometimes you want only particular documents to be replicated, or you want particular documents to be ignored. To do this, you can define a filter function. The function simply takes a document's contents and returns `true` if it should be replicated.

### Creating A Replication
Replications are represented by `CBLReplication` objects. You can create a replication object by calling one of the following  methods on your local `CBLDatabase` object:

* Calling `replicationFromDatabaseAtURL:`. 
* Calling  `replicationToDatabaseAtURL:`.
* Calling `replicateWithURL:exclusively:` to set up a bidirectional replication.

The following example shows how to set up a bidirectional replication:

    NSArray* repls = [self.database replicateWithURL: newRemoteURL exclusively: YES];
    self.pull = [repls objectAtIndex: 0];
    self.push = [repls objectAtIndex: 1];

The `exclusively: YES` option seeks out and removes any pre-existing replications with other remote URLs. This is useful if you sync only with one server at a time and just want to change the address of that server.

Newly created replications are non-persistent and non-continuous. To change that, you should immediately set their `persistent` or `continuous` properties.

It's not strictly necessary to keep references to the replication objects, but you need them if you want to monitor their progress.

### Monitoring Replication Progress
A replication object has several properties you can observe to track its progress. The most useful are:

 * **completed**—the number of documents copied so far in the current batch
 * **total**—the total number of documents to be copied
 * **error**—set to an `NSError` if the replication fails
 * **mode**—an enumeration that tells you whether the replication is stopped, offline, idle or active. Offline means the server is unreachable over the network. Idle means the replication is continuous but there is currently nothing left to be copied.

Generally you can get away with just observing `completed`:

    [self.pull addObserver: self forKeyPath: @"completed" options: 0 context: NULL];
    [self.push addObserver: self forKeyPath: @"completed" options: 0 context: NULL];

Your observation method might look like this:

	- (void) observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
	                         change:(NSDictionary *)change context:(void *)context
	{
	    if (object == pull || object == push) {
	        unsigned completed = pull.completed + push.completed;
	        unsigned total = pull.total + push.total;
	        if (total > 0 && completed < total) {
	            [self showProgressView];
	            [progressView setProgress: (completed / (float)total)];
	        } else {
	            [self hideProgressView];
	        }
	    }
	}

Here `progressView` is a `UIProgressView` that shows a bar-graph of the current progress. The progress view is shown only while replication is active, that is, when `total` is nonzero.

Don't expect the progress indicator to be completely accurate. It might jump around because the `total` property changes as the replicator figures out how many documents need to be copied. It might not advance smoothly, because some documents, such as those with large attachments, take longer to transfer than others. In practice, the progress indicator is accurate enough to give the user an idea of what's going on.

### Document Validation

Pulling from another database requires some trust because you are importing documents and changes that were created elsewhere. Aside from issues of security and authentication, how can you be sure the documents are even formatted correctly? Your application logic probably makes assumptions about what properties and values documents have, and if you pull down a document with invalid properties it might confuse your code.

The solution to this is to add a validation function to your database. The validation function is called on every document being added or updated. The function decides whether the document should be accepted, and can even decide which HTTP error code to return ()most commonly 403 Forbidden, but possibly 401 Unauthorized).

Validation functions aren't just called during replication&mdash;they see _every_ insertion or update, so they can also be used as a sanity check for your own application code. If you forget this, you might occasionally be surprised by getting a 403 Forbidden error from a document update when a change is rejected by one of your own validation functions.

Here's an example validation function definition from the Grocery Sync sample code. This is a real-life example of self-protection from bad data. At one point during development the Android Grocery Sync app was generating dates in the wrong format, which confused the iOS app when it pulled down the documents created on Android. After the bug was fixed, the affected docs were still in server-side databases. The following validation function was added to reject  documents that had incorrect dates:

    [database defineValidation: @"date" asBlock: VALIDATIONBLOCK({
        if (newRevision.deleted)
            return YES;
        id date = [newRevision.properties objectForKey: @"created_at"];
        if (date && ! [CBLJSON dateWithJSONObject: date]) {
            context.errorMessage = [@"invalid date " stringByAppendingString: date];
            return NO;
        }
        return YES;
    })];

This validation block ensures that the document's `created_at` property, if present, is in valid ISO-8601 date format.

The validation block takes two parameters: `newRevision` is the new document revision to be approved, and `context` is an object you can use to communicate with the database. The block should look at `newRevision.properties` and determine whether they're valid; if so it returns `YES`, otherwise `NO`. If the revision is invalid, you can set `context.errorMessage` or `context.errorType` to customize the error returned.

Note that the example design block first checks whether the revision is deleted and if so returns `YES`. This is a common idiom: a *tombstone* revision marking a deletion usually has no properties at all, so it doesn't make sense to check their values. Another reason to check for deletion is to enforce rules about which documents are allowed to be deleted. For example, you could disallow deletion of a document whose `status` property was not first set to `completed`.

But how could you make that check, since it requires looking at the _current_ value of the `completed` property, before the deletion? You can get the currently active revision from the context's `currentRevision` property. This is very useful for enforcing immutable properties, or other restrictions on what changes can be made to a property. The context also has some convenience methods like `changedKeys` and `disallowChangesTo:` that can be useful for this.

You can optionally define schemas for your documents using the powerful [JSON-Schema](http://json-schema.org) format and validate them programmatically. To learn how to do that, see [Validating JSON Objects](#validating-json-objects).

### Filtered Replications

You might want to replicate only a subset of documents, especially when pulling from a huge cloud database down to a limited mobile device. For this purpose, Couchbase Lite supports user-defined filter functions in replications. A filter function is registered with a name. It takes a document's contents as a parameter and simply returns true or false to indicate whether it should be replicated.

#### Filtered Pull

Filter functions are run on the _source_ database. In a pull, that would be the remote server, so that server must have the appropriate filter function. If you don't have admin access to the server, you are restricted to the set of already existing filter functions.

To use an existing remote filter function in a pull replication, set the replication's `filter` property to the filter's full name, which is the design document name, a slash, and then the filter name:

	pull.filter = @"grocery/sharedItems";

Filtered pulls are how Couchbase Lite can encode the list of [channels](https://github.com/couchbaselabs/sync_gateway/wiki/Channels-Access-Control-and-Data-Routing-w-Sync-Function) it wants Sync Gateway to replicate, although in the case of Sync Gateway, the implementation is based on indexes, not filters.

#### Filtered Push

During a push, on the other hand, the filter function runs locally in Couchbase Lite. As with MapReduce functions, the filter function is specified at runtime as a native block pointer. Here's an example of defining a filter function that passes only documents with a `"shared"` property with a value of `true`:

	[database defineFilterNamed: @"sharedItems"
	                      block: FILTERBLOCK({
							return [[doc objectForKey: @"shared"] booleanValue];
					      })];

This function can then be plugged into a push replication by name:

	push.filter = @"sharedItems";


#### Parameterized Filters

Filter functions can be made more general-purpose by taking parameters. For example, a filter could pass documents whose `"owner"` property has a particular value, allowing the user name to be specified by the replication. That way there doesn't have to be a separate filter for every user.

To specify parameters, set the `filterParams` property of the replication object. Its value is a dictionary that maps parameter names to values. The dictionary must be JSON-compatible, so the values can be any type allowed by JSON.

Couchbase Lite filter blocks get the parameters as a `params` dictionary passed to the block.

#### Deleting documents with Filtered Replications

Deleting documents can be tricky in the context of filtered replications.  For example, let's assume you have a document that has a `worker_id` field, and you set up a filtered replication to pull documents only when the `worker_id` equals a certain value.

When one of these documents is deleted, it will not get synched in the pull replication!  Since the filter function will look for a document with a specific `worker_id`, and the deleted document won't contain any `worker_id`, it will fail the filter function and therefore not be synched.

This can be fixed by deleting documents in a different way.  Since a document is considered deleted as long as it has the special `_deleted` field, it is possible to delete the document while still retaining the `worker_id` field.  Instead of using the DELETE verb, you will instead want to use the PUT verb.  You will definitely need to set the `_deleted` field, in order for the document to be considered deleted.  You can then either retain the field(s) that you need for filtered replication, like the `worker_id` field, or you can retain all of the fields in the original document.

### Authentication

It's likely that the remote database Couchbase Lite replicates with will require authentication; particularly for a push, since the server is unlikely to accept anonymous writes! In this case the replicator will need to log into the remote server on your behalf.

**SECURITY TIP:** Because Basic auth sends the password in easily-readable form, it is _only_ safe to use it over an HTTPS (SSL) connection, or over an isolated network you're confident has full security. So before configuring authentication, please make sure the remote database URL has the `https:` scheme.

You'll need to register login credentials for the replicator to use. There are several ways to do this, and most of them use the standard credential mechanism provided by the Foundation framework.

#### Hardcoded Username and Password

The simplest but least-secure way to store credentials is to use the standard syntax for embedding them in the URL of the remote database:

	https://frank:s33kr1t@sync.example.com/database/

This URL specifies a username `frank` and password `s33kr1t`. If you use this as the remote URL when creating a replication, Couchbase Lite will know to use the included credentials. The drawback, of course, is that the password is easily readable by anything with access to your app's data files.

#### Using The Credential Store

The better way to store credentials is in the `NSURLCredentialStore`, which is a Cocoa system API that can store credentials either in memory or in the secure (encrypted) Keychain. They will then get used automatically when there’s a connection to the matching server.

Here’s an example of how to register a credential for a remote database. First create a `NSURLCredential` object that contains the username and password, as well as an indication of the persistence with which they should be stored:

    NSURLCredential* cred;
    cred = [NSURLCredential credentialWithUser: @"frank"
                                      password: @"s33kr1t"
                                   persistence: NSURLCredentialPersistencePermanent];

Then create a `NSURLProtectionSpace` object which defines the URLs to which the credential applies:

    NSURLProtectionSpace* space;
    space = [[[NSURLProtectionSpace alloc] initWithHost: @"sync.example.com"
                                                   port: 443
                                               protocol: @"https"
                                                  realm: @"My Database"
                                   authenticationMethod: NSURLAuthenticationMethodDefault]
             autorelease];

Finally, register the credential for the protection space:

    [[NSURLCredentialStorage sharedCredentialStorage] setDefaultCredential: cred
                                                        forProtectionSpace: space];

This is best done right after the user has entered her name and password in your configuration UI. Because this example specified _permanent_ persistence, the credential store writes the password securely to the Keychain. From then on, NSURLConnection, Cocoa's underlying HTTP client engine, finds it when it needs to authenticate with that same server.

The Keychain is a secure place to store secrets: it's encrypted with a key derived from the user's iOS passcode, and managed only by a single trusted OS process. If you don’t want the password stored to disk, use `NSURLCredentialPersistenceForSession`  for the persistence setting. But then you need to call the above code on every launch, begging the question of where you get the password from; the alternatives are generally less secure than the Keychain.

**NOTE:** The OS is pretty picky about the parameters of the protection space. If they don’t match exactly—including the `port` and the `realm` string—the credentials won’t be used and the sync will fail with a 401 error. This is annoying to troubleshoot. In case of mysterious auth failures, double-check the all the credential's and protection space's spelling and port numbers!

##### What's My Realm?

If you need to figure out the actual realm string for the server, you can use `curl` or an equivalent HTTP client tool to examine the "WWW-Authenticate" response header for an auth failure:

    $ curl -i -X POST http://sync.example.com/dbname/
    HTTP/1.1 401 Unauthorized
    WWW-Authenticate: Basic realm="My Database"

#### OAuth

[OAuth](http://oauth.net) is a complex and confusing protocol that, among other things, allows a user to use an identity from one site (such as Google or Facebook) to authenticate to another site (such as a Sync Gateway server) _without_ having to trust the relaying site with the user's password.

Sync Gateway supports OAuth version 1 (but _not_ yet the newer OAuth 2) for client authentication, so if this has been configured in your upstream database, you can replicate with it by providing OAuth tokens:

	replication.OAuth = @{ @"consumer_secret": consumerSecret,
		 				   @"consumer_key": consumerKey,
						   @"token_secret": tokenSecret,
						   @"token": token };

Getting these four values is somewhat tricky, involving authenticating with the origin server (the site at which the user has an account/identity.) Usually you use an OAuth client library to do the hard work, such one from [Google](http://code.google.com/p/gtm-oauth/) or [Facebook](https://github.com/facebook/facebook-ios-sdk).

OAuth tokens expire after some time, so if you install them into a persistent replication, you still need to call the client library periodically to validate them, and if they're updated you need to update them in the replication settings.


### Replication Conflicts

Replication is a bit like merging branches in a version control system (for example, pushing and pulling in Git). And just as in version control, you can run into conflicts if incompatible changes have been made to the same data. In Couchbase Lite this happens if a replicated document is changed differently in the two databases, and then one database is replicated to the other. Now both of the changes exist there. Here's an example scenario:

 1. Create mydatabase on device A.
 2. Create document 'doc' in mydatabase. Let's say its revision ID is '1-foo'.
 3. Push mydatabase from device A to device B. Now both devices have identical copies of the database.
 4. On device A, update 'doc', producing new revision '2-bar'.
 5. On device B, update 'doc' differently, producing new revision '2-baz'. (No, this does not cause an error. The different revision 2 is in a different copy of the database on device A, and device B has no way of knowing about it yet.)
 6. Now push mydatabase from device A to device B again. (Transferring in the other direction would lead to similar results.)
 7. On device B, mydatabase now has _two_ current revisions of 'doc': both '2-bar' and '2-baz'.

You might ask why the replicator allows the two conflicting revisions to coexist, when a regular PUT doesn't. The reason is that if the replicator were to give up and fail with a 409 Conflict error, the app would be in a bad state. It wouldn't be able to resolve the conflict because it doesn't have easy access to both revisions, because the other one is on the other device. By accepting conflicting revisions, the replicator allows apps to resolve the conflicts by operating only on local data.

What happens on device B now when the app tries to get the contents of 'doc'? For simplicity, Couchbase Lite preserves the illusion that one document ID maps to one current revision. It does this by choosing one of the conflicting revisions, '2-baz' as the "winner" which is returned by default from API calls. So if the app on device B doesn't look too close, it thinks that only this revision exists, and ignores the one from device A.

You can detect conflicts in the following ways:

* Call `-[CBLDocument getConflictingRevisions:]` and check for multiple returned values.
* Create a view that finds all conflicts by having its map function look for a `_conflicts` property and emit a row if it's present.

After a conflict is detected, you resolve it by deleting the revisions you don't want, and optionally storing a revision that contains the merged contents. So in the example, if the app wants to keep one revision it can just delete the other one. But more likely it needs to merge parts of each revision, so it can do so, delete revision '2-bar' and put the new merged copy as a child of '2-baz'.
