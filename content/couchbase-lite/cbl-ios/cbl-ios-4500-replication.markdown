## Working With Replications

This section describes how to work with replications in an iOS app. To learn more about replications, read [Replication](/couchbase-lite/cbl-concepts/#replication) in the *Couchbase Lite Concepts Guide*.

### Creating A Replication
Replications are represented by `CBLReplication` objects. You create a replication object by calling one of the following  methods on your local `CBLDatabase` object:

* `replicationFromDatabaseAtURL:` sets up a pull replication.
* `replicationToDatabaseAtURL:` sets up a push replication.
* `replicateWithURL:exclusively:` sets up a bidirectional replication.

The following example shows how to set up a bidirectional replication:

    NSArray* repls = 
       [self.database replicateWithURL: newRemoteURL 
                           exclusively: YES];
    self.pull = [repls objectAtIndex: 0];
    self.push = [repls objectAtIndex: 1];

The `exclusively: YES` option seeks out and removes any pre-existing replications with other remote URLs. This is useful if you sync with only one server at a time and just want to change the address of that server.

Newly created replications are nonpersistent and noncontinuous. To change those settings, you need to immediately set their `persistent` or `continuous` properties.

It's not strictly necessary to keep references to the replication objects, but you do need them if you want to monitor their progress.

### Monitoring Replication Progress
A replication object has several properties you can observe to track its progress. The most useful properties are:

 * **completed**—number of documents copied so far in the current batch
 * **total**—total number of documents to be copied
 * **error**—set to an `NSError` if the replication fails
 * **mode**—an enumeration that indicates whether the replication is stopped, offline, idle or active. Offline means the server is unreachable over the network. Idle means the replication is continuous but there is currently nothing left to be copied.

In general, you can just observe the `completed` property:

    [self.pull addObserver: self 
                forKeyPath: @"completed" 
                   options: 0 
                   context: NULL];
                   
    [self.push addObserver: self 
                forKeyPath: @"completed" 
                   options: 0 
                   context: NULL];

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

In the example, `progressView` is a `UIProgressView` object that shows a bar graph of the current progress. The progress view is shown only while replication is active, that is, when `total` is nonzero.

Don't expect the progress indicator to be completely accurate. It might jump around because the `total` property changes as the replicator figures out how many documents need to be copied. It might not advance smoothly because some documents, such as those with large attachments, take longer to transfer than others. In practice, the progress indicator is accurate enough to give the user an idea of what's going on.

### Deleting Replications

You can cancel persistent and continuous replications by deleting them. The following example shows how to delete a replication by deleting the associated CBLReplication model object, `repl`:


```objectivec
[repl deleteDocument: &error];
```

The following example shows how to delete all replications involving a database. In the example, `db` is a CBLDatabase object.

```objectivec
[db replicateWithURL: nil exclusively: YES];
```


### Document Validation

Pulling from another database requires some trust because you are importing documents and changes that were created elsewhere. Aside from issues of security and authentication, how can you be sure the documents are even formatted correctly? Your application logic probably makes assumptions about what properties and values documents have, and if you pull down a document with invalid properties it might confuse your code.

The solution to this is to add a validation function to your database. The validation function is called on every document being added or updated. The function decides whether the document should be accepted, and can even decide which HTTP error code to return (most commonly 403 Forbidden, but possibly 401 Unauthorized).

Validation functions aren't just called during replication&mdash;they see every insertion or update, so they can also be used as a sanity check for your own application code. If you forget this, you might occasionally be surprised by getting a 403 Forbidden error from a document update when a change is rejected by one of your own validation functions.

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


```objectivec
database defineFilter: @"sharedItems"
              asBlock: FILTERBLOCK({
                 return [[doc objectForKey: @"shared"] booleanValue];
              })];
```

This function can then be plugged into a push replication by name:

```objectivec
	push.filter = @"sharedItems";
```

#### Parameterized Filters

Filter functions can be made more general-purpose by taking parameters. For example, a filter could pass documents whose `"owner"` property has a particular value, allowing the user name to be specified by the replication. That way there doesn't have to be a separate filter for every user.

To specify parameters, set the `filterParams` property of the replication object. Its value is a dictionary that maps parameter names to values. The dictionary must be JSON-compatible, so the values can be any type allowed by JSON.

Couchbase Lite filter blocks get the parameters as a `params` dictionary passed to the block.

#### Deleting documents with Filtered Replications

Deleting documents can be tricky in the context of filtered replications.  For example, let's assume you have a document that has a `worker_id` field, and you set up a filtered replication to pull documents only when the `worker_id` equals a certain value.

When one of these documents is deleted, it does not get synched in the pull replication.  Because the filter function looks for a document with a specific `worker_id`, and the deleted document won't contain any `worker_id`, it fails the filter function and therefore is not synched.

This can be fixed by deleting documents in a different way.  Because a document is considered deleted as long as it has the special `_deleted` field, it is possible to delete the document while still retaining the `worker_id` field.  Instead of using the DELETE verb, you instead use the PUT verb.  You definitely need to set the `_deleted` field  for the document to be considered deleted. You can then either retain the fields that you need for filtered replication, like the `worker_id` field, or you can retain all of the fields in the original document.

### Authentication

The remote database Couchbase Lite replicates with likely requires authentication (particularly for a push because the server is unlikely to accept anonymous writes). In this case, the replicator needs to log on to the remote server on your behalf.

<div class="notebox tip">
<p>Security Tip</p> 
<p>Because Basic auth sends the password in an easily readable form, it is <em>only</em> safe to use it over an HTTPS (SSL) connection or over an isolated network you're confident has full security. Before configuring authentication, make sure the remote database URL has the <code>https:</code> scheme.</p>
</div>

You need to register logon credentials for the replicator to use. There are several ways to do this and most of them use the standard credential mechanism provided by the Cocoa Foundation framework.

#### Hardcoded Username and Password

The simplest but least secure way to store credentials is to use the standard syntax for embedding them in the URL of the remote database:

	https://frank:s33kr1t@sync.example.com/database/

This URL specifies a username `frank` and password `s33kr1t`. If you use this as the remote URL when creating a replication, Couchbase Lite uses the included credentials. The drawback, of course, is that the password is easily readable by anything with access to your app's data files.

#### Using The Credential Store

The better way to store credentials is in the `NSURLCredentialStore`, which is a Cocoa system API that can store credentials either in memory or in the secure (encrypted) Keychain. They then get used automatically when there’s a connection to the matching server.

Here’s an example of how to register a credential for a remote database. First, create a `NSURLCredential` object that contains the username and password, as well as an indication of the persistence with which they should be stored:

    NSURLCredential* cred;
    cred = [NSURLCredential 
       credentialWithUser: @"frank"
                 password: @"s33kr1t"
              persistence: NSURLCredentialPersistencePermanent];

Next, create a `NSURLProtectionSpace` object that defines the URLs to which the credential applies:


    
    NSURLProtectionSpace* space;
    
    space = [[[NSURLProtectionSpace alloc] 
            initWithHost: @"sync.example.com"
                    port: 443
                protocol: @"https"
                   realm: @"My Database"
    authenticationMethod: NSURLAuthenticationMethodDefault]
             autorelease];
    

Finally, register the credential for the protection space:

    [[NSURLCredentialStorage sharedCredentialStorage]
       setDefaultCredential: cred
         forProtectionSpace: space];


This is best done right after the user enters a name and password in your configuration UI. Because this example specified _permanent_ persistence, the credential store writes the password securely to the Keychain. From then on, NSURLConnection, Cocoa's underlying HTTP client engine, finds it when it needs to authenticate with that same server.

The Keychain is a secure place to store secrets: it's encrypted with a key derived from the user's iOS passcode, and managed only by a single trusted OS process. If you don’t want the password stored to disk, use `NSURLCredentialPersistenceForSession`  for the persistence setting. But then you need to call the above code on every launch, begging the question of where you get the password from. The alternatives are generally less secure than the Keychain.

<div class="notebox">
<p>Note</p>
<p>The OS is picky about the parameters of the protection space. If they don’t match exactly—including the `port` and the `realm` string—the credentials are not used and the sync fails with a 401 error. This is annoying to troubleshoot. In case of mysterious auth failures, double-check the all the credential's and protection space's spelling and port numbers!
</p>
</div>

If you need to figure out the actual realm string for the server, you can use [curl](http://curl.haxx.se) or another HTTP client tool to examine the "WWW-Authenticate" response header for an auth failure. Here's an example that uses curl:


```
$ curl -i -X POST http://sync.example.com/dbname/
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="My Database"
```

#### OAuth

[OAuth](http://oauth.net) is a complex protocol that, among other things, allows a user to use an identity from one site (such as Google or Facebook) to authenticate to another site (such as a Sync Gateway server) _without_ having to trust the relaying site with the user's password.

Sync Gateway supports OAuth version 1 (but _not_ yet the newer OAuth 2) for client authentication, so if this has been configured in your upstream database, you can replicate with it by providing OAuth tokens:


```
replication.OAuth = 
   @{ @"consumer_secret": consumerSecret,
      @"consumer_key": consumerKey,
      @"token_secret": tokenSecret,
      @"token": token };
```

Getting these four values is somewhat tricky and involves authenticating with the origin server (the site at which the user has an account or identity). Usually you use an OAuth client library to do the hard work, such as a library from [Google](http://code.google.com/p/gtm-oauth/) or [Facebook](https://github.com/facebook/facebook-ios-sdk).

OAuth tokens expire after some time. If you install them into a persistent replication, you still need to call the client library periodically to validate them. If they're updated, you need to update them in the replication settings.


### Replication Conflicts

Replication is a bit like merging branches in a version control system (for example, pushing and pulling in Git). Just as in version control, you can run into conflicts if incompatible changes are made to the same data. In Couchbase Lite this happens if a replicated document is changed differently in the two databases, and then one database is replicated to the other. Now both of the changes exist there. Here's an example scenario:

 1. Create mydatabase on device A.
 2. Create document 'doc' in mydatabase. Let's say its revision ID is '1-foo'.
 3. Push mydatabase from device A to device B. Now both devices have identical copies of the database.
 4. On device A, update 'doc', producing new revision '2-bar'.
 5. On device B, update 'doc' differently, producing new revision '2-baz'. (No, this does not cause an error. The different revision 2 is in a different copy of the database on device A, and device B has no way of knowing about it yet.)
 6. Now push mydatabase from device A to device B again. (Transferring in the other direction would lead to similar results.)
 7. On device B, mydatabase now has _two_ current revisions of 'doc': both '2-bar' and '2-baz'.

You might ask why the replicator allows the two conflicting revisions to coexist, when a regular PUT doesn't. The reason is that if the replicator were to give up and fail with a 409 Conflict error, the app would be in a bad state. It wouldn't be able to resolve the conflict because it doesn't have easy access to both revisions (the other revision is on the other device). By accepting conflicting revisions, the replicator allows apps to resolve the conflicts by operating only on local data.

What happens on device B now when the app tries to get the contents of 'doc'? For simplicity, Couchbase Lite preserves the illusion that one document ID maps to one current revision. It does this by choosing one of the conflicting revisions, '2-baz' as the "winner" that is returned by default from API calls. If the app on device B doesn't look too close, it thinks that only this revision exists and ignores the one from device A.

You can detect conflicts in the following ways:

* Call `-[CBLDocument getConflictingRevisions:]` and check for multiple returned values.
* Create a view that finds all conflicts by having its map function look for a `_conflicts` property and emit a row if it's present.

After a conflict is detected, you resolve it by deleting the revisions you don't want and optionally storing a revision that contains the merged contents. In the example, if the app wants to keep one revision it can just delete the other one. More likely it needs to merge parts of each revision, so it can do the merge, delete revision '2-bar', and put the new merged copy as a child of '2-baz'.
