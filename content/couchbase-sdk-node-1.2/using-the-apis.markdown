# Using the APIs

<a id="datatypes_with_nodejs"></a>

## Data types with Node.js

All Javascript data types that are able to be serialized via the JSON functions
are supported by default. It is worth noting that recursive structures cannot be
serialized. It is also possible to encode data using the raw Node.js formats or
in UTF-8 as well by using the format option on the storage operations.


```
bucket.set(‘test-key’, 'test-value', {
  format:couchbase.format.utf8
}, function(err, result) {
  console.log(result);
});
```

<a id="callback_and_multicallback_format"></a>

## Callback and MultiCallback Format

The Node.js Couchbase driver employs a callback pattern to notify the
application when results are ready. These callbacks are passed to the operation
methods and the callbacks are invoked later once the results or errors are
ready. All storage and retrieval operations follow the same callback pattern and
have the following parameters:

 * `error`

   For singular operations, this parameter will contain an Error object
   representing any error that occurred during the execution of the operation, or
   alternatively will contain null if no errors occurred.

   For a batch operation, this will contain either 1 or 0 representing if an error
   occurred on any of the batched operations.

 * `result/results`

   For a singular operation, this parameter will contain an object with the
   properties as listed below.

   For a batched operation, this will be an object where the keys match the keys
   your operation targeted, and the values will contain an object containing the
   fields listed below.

    * `value`

      This will contain the value of the key that was requested if the operation was a
      retrieval type operation.

    * `error`

      This will contain an Error object representing any errors that occurred during
      execution of this particular batch operation.

    * `cas`

      This will contain an opaque object representing the resulting CAS value of the
      key that was operated upon. This value is not meant to be user-facing, but
      should be passed directly to other operations for locking purposes.

<a id="concurrency_with_cas_and_locking"></a>

## Concurrency with CAS and Locking

In production deployments, it is possible that you will have more than a single
instance of your application trying to modify the same key. In this case a race
condition happens in which a modification one instance has made is immediately
overridden.

Consider this code:


```
function add_friend(user_id, friend_id) {
  bucket.get('user_id-' + user_id, function(err, result) {
    result.value.friends[friend_id] = { 'added': new Date() };
    bucket.set('user_id-' + user_id, result.value, function(err, result) { } );
  });
}
```

In this case, friends is an array of friends the user has added, with the keys
being the friend IDs, and the values being the time when they were added.

When the friend has been added to the array, the document is stored again on the
server.

Assume that two users add the same friend at the same time, in this case there
is a race condition where one version of the friends array ultimately wins.

Couchbase provides two means by which to solve for this problem. The first is
called Opportunistic Locking and the second is called Pessimistic Locking.

Both forms of locking involve using a CAS value. This value indicates the state
of a document at a specific time. Whenever a document is modified, this value
changes. The contents of this value are not significant to the application,
however it can be used to ensure consistency. You can pass the CAS of the value
as it is known to the application and have the server make the operation fail if
the current (server-side) CAS value differs.

<a id="error_handling"></a>

## Error Handling

When something goes wrong, an Error object will be returned into the callback
passed to the operation. This Error object contains a lot of information that
can be helpful to identify what went wrong. Logging this object will typically
contain a stack trace as well as contain the error code and message that was
generated within libcouchbase.

An Error object contains all of the default Javascript error properties, but is
also enhanced with a numeric code value which is represents the error
encountered within libcouchbase. This error code can be used for quick
identification of errors and easier error handling.

<a id="api-reference"></a>
