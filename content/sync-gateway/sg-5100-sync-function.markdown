## Sync Function API

The sync function is the core API you'll be interacting with on the Sync Gateway. For simple applications it might be the only server-side code you need to write. For more complex applications it is still a primary touchpoint for managing data routing and access control.

For more information about using sync functions, read about [channels](#channels) and the description of the [CouchChat data model](https://github.com/couchbaselabs/CouchChat-iOS/wiki/Chat-App-Data-Model).

### Default function

If you don't supply a sync function, Sync Gateway uses this as a default:

```javascript
function (doc) {
  channel(doc.channels);
}
```

### Sync Function Arguments

The sync function arguments allow it to be used for validation as well as data routing. Your implementation can omit the `oldDoc` parameter if it is uneeded because JavaScript simply ignores extra parameters passed to a function.

```javascript
function (doc, oldDoc) {
  // your code here
}
```

* `doc`

  The first argument is the document that is being saved. This matches the JSON that was saved by the mobile client and replicated to Sync Gateway. There are no metadata or other fields added, although the `_id` and `_rev` fields are available.

* `oldDoc`

If the document has been saved before, the revision that is being replaced is available here. In the case of a document with a conflicting revision, the provisional winning revision is passed as the `oldDoc` parameter. If the document is being deleted, there is a `_deleted` property whose value is true. 


### Sync Function Calls

From within the sync function you create changes in the Sync Gateway configuration via callback functions. Each call manages a small amount of configuration state. It is also tied back to the document which initiated the call, so that when the document is modified, any configuration made by an old version of the document is replaced with configuration derived from the newer version. Via these APIs, documents are mapped to channels. They can also grant access to channels, either to users or roles. Finally, you can reject an update completely by throwing an error. The error message will be returned to the synchronizing client, which will log it or potentially display it to the user.

#### Validation via `throw()`

The sync function can prevent a document from persisting or syncing to any other users by calling `throw()` with an error object. This also prevents the document from changing any other gateway configuration. Here is an example sync function that disallows all writes to the database it is in.


```javascript
function (doc) {
  throw({forbidden : "read only!"})
}
```

The key of the error object may be either `forbidden` (corresponding to an [HTTP 403 error code](http://en.wikipedia.org/wiki/HTTP_403)) or `unauthorized` (corresponding to HTTP 401 error). The `forbidden` error should be used if the user is already authenticated and the account they are syncing with is not permitted to modify or create the document. The `unauthorized` error should be used if the account is not authenticated. Some user agents will trigger a login workflow when presented with a 401 error.

A quick rule of thumb: most of the time you should use the `throw({forbidden : "your message here"})` statement because most applications require users to be authenticated before any reads or writes can occur.

#### Map a document to a channel

The `channel` call routes the document to the named channel. It accepts either a channel name string, or an array of strings, if the document should be added to multiple channels in a single call. The channel function can be called zero or more times from the sync function, for any document. The default function (listed at the top of this document) routes documents to the channels listed on them. Here is an example that routes all "published" documents to the "public" channel.

```javascript
function (doc, oldDoc) {
  if (doc.published) {
    channel("public");
  } 
}
```

As a convenience, it is legal to call `channel` with a `null` or `undefined` argument; it simply does nothing. This allows you to do something like `channel(doc.channels)` without having to first check whether `doc.channels` exists.


#### Grant a user access to a channel
The `access` call grants access to channel to a given user or list of users. It can be called multiple times from a sync function.

The effects of the `access` call last as long as this revision is current. If a new revision is saved, the `access` calls made by the `sync` function will replace the original access. If the document is deleted, the access is revoked. The effects of all access calls by all active documents are effectively unioned together, so if any document grants a user access to a channel, that user has access to the channel. Note that revoking access to a channel will not delete the documents which have already been synced to a user's device.

The access call takes two arguments, the user (or users) and the channel (or channels). These are all valid ways to call it:

```javascript
  access("jchris", "mtv")
  access("jchris", ["mtv", "mtv2", "vh1"])
  access(["snej", "jchris", "role:admin"], "vh1")
  access(["snej", "jchris"], ["mtv", "mtv2", "vh1"])
```

As a convenience, either argument may be `null` or `undefined`, in which case nothing happens.

Here is an example function that grants access to a channel for all the users listed on a document:

```javascript
function (doc, oldDoc) {

  access(doc.members, doc.channel_name);
  
  // we should also put this document on the channel it manages
  channel(doc.channel_name)
}
```

#### Grant access to a channel to all users with a given role

If a user name in an `access` call begins with the prefix `role:`, the rest of the name is interpreted as a role, not a user. The call then grants access to the channel(s) for _all_ users with that role.

#### Grant a user a role

The `role` call grants a user a role, indirectly giving them access to all channels granted to that role. It can also affect the user's ability to revise documents, if the access function requires role membership to validate certain types of changes.

Its use is similar to `access`:

    role(user_or_users, role_or_roles);

where either parameter may be a string or an array of strings. (Or null, in which case the call is a no-op.)

For consistency with the `access` call, role names must always be prefixed with `role:`. An exception is thrown if a role name doesn't match this.

Some examples:

```javascript
  role("jchris", "role:admin")
  role("jchris", ["role:portlandians", "role:portlandians-owners"])
  role(["snej", "jchris", "traun"], "role:mobile")
```

**NOTE:** Roles, like users, have to be explicitly created by an administrator. So _unlike_ channels, which come into existence simply by being named, you can't create new roles with a `role()` call. Nonexistent roles won't cause an error, but have no effect on the user's access privileges. (It is possible to create a role after the fact; as soon as it's created, any pre-existing references to it take effect.)

