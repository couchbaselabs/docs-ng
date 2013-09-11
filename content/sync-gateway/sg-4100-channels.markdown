## Channels

Sync Gateway uses *channels* to make it easy to share a database between a large number of users and control access to the database. Channels are the intermediaries between documents and users. Every document in the database belongs to a set of channels, and every user is allowed to access a set of channels. You use channels to:

* Partition the data set.
* Authorize users to access documents.
* Constrain the amount of data synced to mobile clients.

A replication from Sync Gateway specifies a set of channels to replicate. Documents that do not belong to any of the specified channels are ignored (even if the user has access to them).

You do not need to register or preassign channels. Channels come into existence as documents are assigned to them. Channels with no documents assigned to them are empty.

Valid channel names consist of text letters \[A&ndash;Z, a&ndash;z], digits [0&ndash;9], and a few special characters \[= + / . , _ @] . The empty string is not allowed. The special channel name `*` denotes all channels. Channel names are compared literally—the comparison is case and diacritical sensitive.

### Mapping documents to channels

You assign documents to channels either by adding a `channels` property to the document or by using a sync function. No matter which option you choose, the channel assignment is implicit—the content of the document determines what channels it belongs to.

#### Using a Channels Property

Adding a `channels` property to each document is the easiest way to map documents to channels. The `channels` property is an array of strings that contains the names of the channels to which the document belongs. If you do not include a `channels` property in a document, the document does not appear in any channels.

#### Using a Sync Function

Creating a sync function is a more flexible way to map documents to channels. A *sync function* is a JavaScript function that takes a document body as input and, based on the document content, decides what channels to assign the document to. The sync function cannot reference any external state and must return the same results every time it's called on the same input.

You specify the sync function in the configuration file for the database. Each sync function applies to one database.

To add the current document to a channel, the sync function calls the special function `channel`, which takes one or more channel names (or arrays of channel names) as arguments. For convenience, `channel` ignores `null` or `undefined` argument values.

Defining a sync function overrides the default channel mapping mechanism (the document's `channels` property is ignored). The default mechanism is equivalent to the following simple sync function:

```
function (doc) {
    channel (doc.channels);
}
```


### Replicating Channels to Couchbase Lite

if a client doesn't specify any channels to replicate, it gets all the channels to which its user account has access. Due to this behavior, most apps do not have to specify a channels filter—instead they can just do the default sync configuration on the client (that is, specify the Sync Gateway database URL with no filter) to replicate the channels of interest.

To replicate channels to Couchbase Lite, you configure the replication to use a filter named `sync_gateway/bychannel` with a filter parameter named `channels`. The value of the `channels` parameter is a comma-separated list of channels to fetch. The replication from Sync Gateway now pulls only documents tagged with those channels.

A document can be removed from a channel without being deleted. For example, this can happen when a new revision is not added to one or more channels that the previous revision was in. Subscribers (downstream databases pulling from this database) should know about this change, but it's not exactly the same as a deletion.

Sync Gateway's `_changes` feed includes one more revision of a document after it stops matching a channel. It adds a `removed` property to the entry where this happens. (No client yet recognizes this property, though.) The value of  the `removed` property is an array of strings where each string names a channel in which this revision no longer appears. Also, the body of the document appears to be empty to the client.

The effect on the client is that after a replication it sees the next revision of the document (the one that causes it to no longer match the channel). It won't get any further revisions until the next one that makes the document match again.

This algorithm ensures that any views running in the client do not include an obsolete revision. The app code should use views to filter the results rather than just assuming that all documents in its local database are relevant.

If a user's access to a channel is revoked or a client stops syncing with a channel, documents that have already been synced are not removed from the user's device.

### Authorizing User Access

The `all_channels` property of a [user account](#accounts) determines which channels the user can access.  Its value is derived from the union of:

* The user's `admin_channels` property, which is settable via the admin REST API.
* The channels that user has been given access to by `access()` calls from sync functions invoked for current revisions of documents (see [Programmatic Authorization](#programmatic-authorization)).
* The `all_channels` properties of all roles the user belongs to, which are themselves computed according to the above two rules.

The only documents a user can access are those whose current revisions are assigned to one or more channels the user has access to:

* A GET request to a document not assigned to one or more of the user's available channels fails with a 403 error.
* The `_all_docs` property is filtered to return only documents that are visible to the user.
* The `_changes` property ignores requests (via the `channels` parameter) for channels not visible to the user.

Write protection—access control of document PUT or DELETE requests—is done by document validation. This is handled in the sync function rather than a separate validation function.

After a user is granted access to a new channel, the changes feed incorporates all existing documents in that channel, even those from earlier sequences than the client's `since` parameter. That way the next client pull retrieves all documents to which the user now has access.

#### Programmatic Authorization

Documents can grant users access to channels. This is done by writing a sync function that recognizes such documents and calls a special `access()` function to grant access.

The `access()` function takes the following parameters:  a user name or array of user names and a channel name or array of channel names. For convenience, null values are ignored (treated as empty arrays).

A typical example is a document that represents a shared resource (like a chat room or photo gallery). The document has a `members` property that lists the users who can access the resource. If the documents belonging to the resource are all tagged with a specific channel, then the following sync function can be used to detect the membership property and assign access to the users listed in it:

	function(doc) {
	  if (doc.type == "chatroom") {
	    access (doc.members, doc.channel_id)
	  }
	}


In the example, a chat room is represented by a document with a `type` property set to `chatroom`. The `channel_id` property names the associated channel (with which the actual chat messages are tagged) and the `members` property lists the users who have access.

The `access()` function can also operate on roles. If a user name string begins with `role:` then the remainder of the string is interpreted as a role name. There's no ambiguity here, because ":" is an illegal character in a user or role name.

Because anonymous requests are authenticated as the user "GUEST", you can make a channel and its documents public by calling `access` with a username of `GUEST`.

#### Authorizing Document Updates

Sync functions can also authorize document updates. A sync function can reject the document by throwing an exception:

    throw ({forbidden: "error message"})


A 403 Forbidden status and the given error string is returned to the client.

To validate a document you often need to know which user is changing it, and sometimes you need to compare the old and new revisions. To get access to the old revision, declare the sync function like this:

    function(doc, oldDoc) { ... }

`oldDoc` is the old revision of the document (or empty if this is a new document). 

You can validate user privileges by using the helper functions: `requireUser`, `requireRole`, or `requireAccess`. Here's some examples of how you can use the helper functions:

```javascript
// throw an error if username is not "snej"
requireUser("snej")
 
// throw if username is not in the list
requireUser(["snej", "jchris", "tleyden"]) 

// throw an error unless the user has the "admin" role
requireRole("admin") 

// throw an error unless the user has one of those roles
requireRole(["admin", "old-timer"]) 

// throw an error unless the user has access to read the "events" channel
requireAccess("events") 

// throw an error unless the can read one of these channels
requireAccess(["events", "messages"]) 
```

Here's a simple sync function that validates whether the user is modifying a document in the old document's `owner` list:

```javascript
function (doc, oldDoc) {
  if (oldDoc) {
    requireUser(oldDoc.owner); // may throw({forbidden: "wrong user"})
  }
}
```
