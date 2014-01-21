## Working With Replication

This section describes how to work with replication in an Android app. To learn more about replication, see [Replication](/couchbase-lite/cbl-concepts/#replication) in the *Couchbase Lite Concepts Guide*.

### Creating Replications
Replications are represented by `Replication` objects. You create replication objects by calling the following methods on your local `Database` object:

* `getPullReplication()` sets up a pull replication.
* `getPushReplication()` sets up a push replication.

Creating a replication object does not start the replication automatically. To start a replication, you need to send a `start` message to the replication object.

Newly created replications are noncontinuous. To create a continuous replication, you need to immediately set the `continuous` property of the `Replication` object to `true`.

It's not strictly necessary to keep references to the replication objects, but you do need them if you want to [monitor their progress](#monitoring-replication-progress).

The following example shows how to set up and start a bidirectional replication:

```java
URL syncUrl;
try {
    syncUrl = new URL("http://db.example.com");
} catch (MalformedURLException e) {
    throw new RuntimeException(e);
}

Replication pullReplication = database.createPullReplication(syncUrl);
pullReplication.setContinuous(true);

Replication pushReplication = database.createPushReplication(syncUrl);
pushReplication.setContinuous(true);

pullReplication.start();
pushReplication.start();
```

### Monitoring replication progress
A replication object has several properties you can observe to track its progress. You can use the following `Replication` class properties to monitor replication progress:

 * `completedChangesCount`—number of documents copied so far in the current batch
 * `changesCount`—total number of documents to be copied
 * `lastError`—set to an `NSError` if the replication fails or `nil` if there has not been an error since the replication started.
 * `status`—an enumeration named `ReplicationStatus` that indicates the current state of the replication. The status can be `STOPPED`, `OFFLINE`, `IDLE` or `ACTIVE`. Stopped means the replication is finished or hit a fatal error. Offline means the server is unreachable over the network. Idle means the replication is continuous but there is currently nothing left to be copied. Active means the replication is currently transferring data.

The following example shows how to set up a change listener for a replication:

```java
pullReplication.addChangeListener(new Replication.ChangeListener() {
    @Override
    public void changed(Replication.ChangeEvent event) {
        Replication replication = event.getSource();
        Log.d(TAG, "Replication : " + replication + " changed.");
        if (!replication.isRunning()) {
            String msg = String.format("Replicator %s not running", replication);
            Log.d(TAG, msg);
        }
        else {
            int processed = replication.getCompletedChangesCount();
            int total = replication.getChangesCount();
            String msg = String.format("Replicator processed %d / %d", processed, total);
            Log.d(TAG, msg);
        }
    }
});
```

### Stopping replications

You can cancel continuous replications by stopping them. The following example shows how to stop a replication`:

```java
pullReplication.stop();
pushReplication.stop();
```

The following example shows how to stop all replications that exist for a database:

```java
List<Replication> replications = database.getAllReplications();
for (Replication rep : replications) {
    rep.stop();
}
```

### Document Validation

Pulling from another database requires some trust because you are importing documents and changes that were created elsewhere. Aside from issues of security and authentication, how can you be sure the documents are even formatted correctly? Your application logic probably makes assumptions about what properties and values documents have, and if you pull down a document with invalid properties it might confuse your code.

The solution to this is to add a validation function to your database. The validation function is called on every document being added or updated. The function decides whether the document should be accepted, and can even decide which HTTP error code to return (most commonly 403 Forbidden, but possibly 401 Unauthorized).

Validation functions aren't just called during replication&mdash;they see every insertion or update, so they can also be used as a sanity check for your own application code. If you forget this, you might occasionally be surprised by getting a 403 Forbidden error from a document update when a change is rejected by one of your own validation functions.

Here's an example validation function that makes sure each new document contains a `towel` property:

```java
database.setValidation("hoopy", new Validator() {
    @Override
    public boolean validate(Revision newRevision, ValidationContext context) {
        boolean hoopy = newRevision.isDeletion()  || (newRevision.getProperties().get("towel") != null);
        Log.v("Validator:", String.format("--- Validating %s --> %b", newRevision.getProperties(), hoopy));
        if(!hoopy) {
            context.reject("Where's your towel?");
        }
        return hoopy;
    }
});
```
 
The example sets up a validation delegate named `hoopy` and defines the `Validator` interface for the `validate()` method. The `validate()` method accepts the following parameters:

*  `newRevision`—a `Revision` object that contains the new document revision to be approved
*  `context`— a `ValidationContext` object that you use to communicate with the database

If the document contained in `newRevision` is not being deleted, the `validate()` method checks for the presence of a `towel` property in the document. If there is no `towel` property, the method rejects the change by sending a `reject()` message to the `context` object. 

A validation block can call `newRevision.getProperties()` to retrieve the document content and determine whether the document is valid. If the revision is invalid, call the `reject()` method on the `context` object. You can customize the error returned by specifying an optional error message string with the call to the `reject()` method.

The example validation block first checks whether the revision is deleted. This is a common idiom: a *tombstone* revision marking a deletion usually has no properties at all, so it doesn't make sense to check their values. Another reason to check for deletion is to enforce rules about which documents are allowed to be deleted. For example, suppose you have documents that contain a property named `status` and you want to disallow deletion of any document whose `status` property was not first set to `completed`. Making that check requires looking at the _current_ value of the `status` property, before the deletion. You can get the currently active revision from the  `currentRevision` property of `context`. This is very useful for enforcing immutable properties or other restrictions on the changes can be made to a property. The `ValidationContext`  property `changedKeys` is also useful for checking these types of conditions.

### Filtered Replications

You might want to replicate only a subset of documents, especially when pulling from a huge cloud database down to a limited mobile device. For this purpose, Couchbase Lite supports user-defined filter functions in replications. A filter function is registered with a name. It takes a document's content as a parameter and returns true or false to indicate whether it should be replicated.

#### Filtered Pull

Filter functions are run on the _source_ database. In a pull, that would be the remote server, so that server must have the appropriate filter function. If you don't have admin access to the server, you are restricted to the set of already existing filter functions.

To use an existing remote filter function in a pull replication, set the replication's `filter` property to the filter's full name, which is the design document name, a slash, and then the filter name:

	pull.setFilter = "grocery/sharedItems";

Filtered pulls enable Couchbase Lite to encode the list of [channels](https://github.com/couchbaselabs/sync_gateway/wiki/Channels-Access-Control-and-Data-Routing-w-Sync-Function) it wants Sync Gateway to replicate. In Sync Gateway, the implementation is based on indexes, not filters.

#### Filtered Push

During a push, the filter function runs locally in Couchbase Lite. Here's an example of a filter function definition that passes only documents with a `"shared"` property with a value of `true`:

```java
database.setFilter("sharedItems", new ReplicationFilter() {
    @Override
    public boolean filter(SavedRevision revision, Map<String, Object> params) {
        return ((Boolean) revision.getProperties().get("shared")).booleanValue();
    }
});
```

This function can then be plugged into a push replication by name:

```objectivec
push.setFilter = "sharedItems";
```

#### Parameterized Filters

Filter functions can be made more general-purpose by taking parameters. For example, a filter could approve documents whose `"owner"` property has a particular value, allowing the user name to be specified by the replication. That way there doesn't have to be a separate filter for every user.

To specify parameters, call `setFilterParams()` on the `Replication` object. The filter parameters object is a dictionary that maps parameter names to values. The dictionary must be JSON-compatible, so the values can be any type allowed by JSON.

Couchbase Lite filter blocks get the parameters in a map object named `params` that is passed into the block.

#### Deleting documents with Filtered Replications

Deleting documents can be tricky in the context of filtered replications.  For example, assume you have a document that has a `worker_id` field, and you set up a filtered replication to pull documents only when the `worker_id` equals a certain value.

When one of these documents is deleted, it does not get synched in the pull replication.  Because the filter function looks for a document with a specific `worker_id`, and the deleted document won't contain any `worker_id`, it fails the filter function and therefore is not synced.

This can be fixed by deleting documents in a different way.  Because a document is considered deleted as long as it has the special `_deleted` field, it is possible to delete the document while still retaining the `worker_id` field.  Instead of using the DELETE verb, use the PUT verb.  You definitely need to set the `_deleted` field  for the document to be considered deleted. You can then either retain the fields that you need for filtered replication, like the `worker_id` field, or you can retain all of the fields in the original document.

### Authentication

The remote database Couchbase Lite replicates with likely requires authentication (particularly for a push because the server is unlikely to accept anonymous writes). You need to register login credentials for the replicator to use when logging in to the remote server on your behalf.

<div class="notebox tip">
<p>Security Tip</p> 
<p>Because Basic Authentication sends the password in an easily readable form, it is <em>only</em> safe to use it over an HTTPS (SSL) connection or over an isolated network you're confident has full security. Before configuring authentication, make sure the remote database URL has the <code>https:</code> scheme.</p>
</div>

#### Hard-coded username and password

The simplest but least secure way to store credentials is to use the standard syntax for embedding them in the URL of the remote database:

	https://frank:s33kr1t@sync.example.com/database/

The URL in the example specifies the user name `frank` and password `s33kr1t`. If you use this form for the remote URL when creating a replication, Couchbase Lite uses the included credentials. The drawback, of course, is that the password is easily readable by anything with access to your app's data files.


#### Authenticating with Facebook credentials

1. Download the [Android Facebook SDK](https://github.com/facebook/facebook-android-sdk).

Here's an example that shows how to authenticate with Facebook credentials:

```java
 private void addFacebookAuthorization(Replication replication) {

    // start Facebook Login
    Session.openActiveSession(this, true, new Session.StatusCallback() {

        // callback when session changes state
        @Override
        public void call(Session session, SessionState state, Exception exception) {

            if (exception != null || !session.isOpened())  {
                return;
            }

            // make request to the Facebook /me API
            Request.executeMeRequestAsync(session, new Request.GraphUserCallback() {

                // callback after Facebook Graph API response with user object
                @Override
                public void onCompleted(GraphUser user, Response response) {
                    if (user != null) {
                        String email = (String) user.getProperty("email");
                        FacebookAuthorizer authorizer = new FacebookAuthorizer(email);
                        authorizer.registerAccessToken(session.getAccessToken(), email, replication.getRemoteUrl());
                        replication.setAuthorizer(authorizer);
                    }

                }
            });

        }
    });
}
```


### Replication Conflicts

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

* Call `-getConflictingRevisions()` on the `Document` object and check for multiple returned values.
* Create a view that finds all conflicts by having its map function look for a `_conflicts` property and emit a row if it's present.

After a conflict is detected, you resolve it by deleting the revisions you don't want and optionally storing a revision that contains the merged contents. In the example, if the app wants to keep one revision it can just delete the other one. More likely it needs to merge parts of each revision, so it can do the merge, delete revision '2-bar', and put the new merged copy as a child of '2-baz'.

