# Using the APIs

For convenience, all distributions include a stub API reference file that
contains the definitions for all the different methods and constants supported.
The API information is provided in the `couchbase-api.php` file.  Additionally,
a link to the current API reference is available [here](#api-reference).

<a id="api-reference-summary-errorhandling"></a>

## Finding Data with Views

In Couchbase 2.0 you can index and query JSON documents using *views*. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to:

 * Find all the documents in your database that you need for a particular process,

 * Create a copy of data in a document and present it in a specific order,

 * Create an index to efficiently find documents by a particular value or by a
   particular structure in the document,

 * Represent relationships between documents, and

 * Perform calculations on data contained in documents.

For more information on views, see [Couchbase Developer Guide, Finding Data with
Views](http://www.couchbase.com/docs/couchbase-devguide-2.0/indexing-querying-data.html),
and [Couchbase Sever 2.0: Views and
Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).


## Error Handling

Error handling with the Couchbase PHP interface is currently handled using a
combination of return values, exceptions and error codes. Return values are used
for operations such as `get()`, which returns the corresponding document value
if successful, or `false` if the document could not be found.

An explicit error code system is available when you want to identify specific
errors, but the methods to obtain these must be called immediately after each
operation to identify a specific failure. These methods are deprecated in place
of the PHP exception mechanism and may be removed in a future release.

All the interface calls support exceptions and will raise a specific or generic
Couchbase exception if an operation fails. For more information on the
exceptions supported, see [Exceptions](#api-reference-summary-exceptions).
Operations also raise a result code which can be obtained by calling the
`getResultCode()` method immediately after an operation. Constants are provided
to identify specific error conditions. See [Error Codes and
Constants](#api-reference-summary-errors) for more information.

<a id="api-reference-summary-exceptions"></a>

### Exceptions

Exceptions are used within the PHP Couchbase client library to raise an error
within an operation. The exceptions are all inherited from the base
`CouchbaseException` class, or you can trap for specific exceptions. The error
string associated with the exception will provide more information about the
error.

For example:


```
try {
    $oo->touch("spoon", 1);
} catch (CouchbaseException $e) {
    echo "Error: " + $e;
}
```

The supported exceptions are listed below:

 * **CouchbaseException**

   This is the base class of all of the exceptions thrown from the extension.

 * **CouchbaseIllegalKeyException**

   The key provided to the operation is not legal (i.e. empty).

 * **CouchbaseAuthenticationException**

   Authentication to the Couchbase cluster failed.

 * **CouchbaseLibcouchbaseException**

   An error occurred within libcouchbase which is used by the PHP extension to
   communicate with the cluster.

 * **CouchbaseServerException**

   An error occurred somewhere in the Couchbase Cluster.

<a id="api-reference-summary-errors"></a>

### Error Codes and Constants

The PHP client library defines the following error codes and constants. These
can be used against the return value for most operations to determine whether
they succeeded, or failed, and in the event of a failure, what the underlying
cause was. The constants are distributed between both generic interface errors,
and operation specific errors. Check the corresponding API reference for
information on which errors are raised by each operation.

You can use the `getResultCode()` and `getResultMessage()` methods to obtain the
error code and message for each operation. You can use these in combination with
the error constants to determine a specific course of action when an operation
fails, for example:


```
$cb->replace("fork", "Hello World!", 10);

if ($cb->getResultCode() === COUCHBASE_KEY_ENOENT) {
  // Doesn't exist, add it first
  $cb->add("fork", "Hello World!", 10);
  echo "Key added (didn't exist)\n";
} elseif ($cb->getResultCode() === SUCCESS) {
  echo "Key updated\n";
} else {
  echo "Error occurred: ", $cb->getResultMessage(), "<br/>";
}
```

In the above example, an update operation is attempted on a key which must
already exist. If Couchbase Server returns an error that the key didn't exist,
`add()` is used to create the key. If the operation was successful, we output a
success message. For all other errors, the error message is generated.

#### Note: Deprecations
Note that the `getResultCode()` and `getResultMessage()` methods are now
deprecated and will be removed in a future release. The PHP exception system
will replace the functionality of these two methods.
