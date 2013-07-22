# Using the APIs

This section only gives an introduction to the available APIs. The actual API
reference features more options for each of the APIs described here and is
always be more up-to-date than the documentation here.

This section goes a level lower than the *Getting Started* guide and features
the aspects of the APIs offered by the SDK.

<a id="_connecting"></a>

## Connecting

You can connect to a bucket using the simple `Couchbase.connect()` class method:


```
from couchbase import Couchbase

client = Couchbase.connect(bucket='default')
```

<a id="_multiple_nodes"></a>

### Multiple Nodes

Sometimes it is beneficial to let the client know beforehand about multiple
nodes. For example, when you have a cluster with several nodes and some nodes
might not be up, if you pass only one node the client’s constructor might raise
an exception. Instead, you can pass multiple nodes as a list so that the
constructor tries each node until it gets a successful connection or the timeout
is reached.

### Using Multiple Nodes


```
c = Couchbase.connect(
    bucket='default',
    host=['foo.com', 'bar.com', 'baz.com']
)
```



<a id="_timeouts"></a>

### Timeouts

The client uses timeouts so that your application does not wait too long if the
cluster is overloaded or there are connectivity issues. By default, this timeout
value is 2.5 seconds.

You can adjust this value by setting it in the constructor.:


```
c = Couchbase.connect(bucket='default', timeout=5.5)
```

Or by setting the `timeout` property:


```
c.timeout = 4.2
```

<a id="_sasl_buckets"></a>

### SASL Buckets

If your bucket is password protected, you can pass the Simple Authentication and
Security Layer (SASL) password by using the `password` keyword parameter in the
constructor:


```
c = Couchbase.connect(bucket='default', password='s3cr3t')
```

<a id="_threads"></a>

### Threads

Threads will be discussed later on in more detail, but the `Connection` object
is fully thread-safe out of the box by default. You can tune some parameters
that sacrifice thread-safety for performance.

<a id="_api_return_values"></a>

## API Return Values

Before we discuss the individual sections of the API, we’ll discuss the common
return value, which is the `Result` object.

Typically subclasses of this object are returned appropriate for the operation
executed.

All `Result` objects have the following properties:

 * `success`

   A boolean property that indicates whether this operation was successful.

 * `rc`

   This is the low level return code as received from the underlying `libcouchbase`
   layer. This is 0 on success and nonzero on failure. Typically this is useful on
   operations in which `quiet` was set to `True`. Normally you’d use it like this:

    ```
    result = client.get("key", quiet=True)
    if not result.success:
        print "Got error code", result.rc
    ```

 * `__str__`

   While this isn’t really a property, printing out the result object will yield
   interesting metadata to aid in debugging this particular operation.

<a id="_storing_data"></a>

## Storing Data

<a id="_setting_values"></a>

### Setting Values

These methods, if successful, set the value of their respective keys. If they
fail, they raise an exception (and are not affected by the `quiet` property).

These methods can accept a `format` property, which indicates the format in
which the value will be stored on the server, as well as a `ttl` property which
indicates the lifetime of the value. After the `ttl` lifetime is reached, the
value is deleted from the server.

 * `client.set(key, value, **kwargs)`

   Sets the key unconditionally.

 * `client.add(key, value, **kwargs)`

   Sets the key to the specified value, but only if the key does not already exists
   (an exception is raised otherwise).

 * `client.replace(key, value, **kwargs)`

   Replaces an existing key with a new value. This raises an exception if the key
   does not already exist.

<a id="_arithmetic_and_counter_operations"></a>

### Arithmetic and Counter Operations

These methods operate on 64-bit integer counters. They provide efficient
mutation and retrieval of values. You can use these in place of the `set` family
of methods when working with numeric values. For example:

### Using set


```
key = "counter"
try:
    result = c.get("counter")
    c.set(key, result.value + 1)
except KeyNotFoundError:
    c.add(key, 10)
```



### Using incr


```
key = "counter"
c.incr(key, initial=10)
```



These methods accept the `ttl` argument to set the expiration time for their
values, as well as an `amount` value that indicates by what amount to modify
their values. Additionally, an `initial` keyword argument is available to
provide the default value for the counter if it does not yet exist. If an
`initial` argument is not provided and the key does not exist, an exception is
raised.

The value for the counter stored must either not exist (if `initial` is used) or
should be a "Number," that is, a textual representation of an integer.

If using the default `FMT_JSON`, then your integers are already compliant.

If the existing value is not already a number, the server raises an exception
(specifically, a `DeltaBadvalError` ).

Arithmetic methods return a `ValueResult` object (subclass of `Result` ). The
`value` property can be used to obtain the current value of the counter.

 * `c.incr(key, amount=1, ttl=0)`

   Increments the value stored under the key.

 * `c.decr(key, amount=1, ttl=0)`

   Decrements the value stored under the key. In this case, `amount` is how much to
   subtract from the key.

<a id="_append_and_prepend_operations"></a>

### Append and Prepend Operations

These operations act on the stored values and append or prepend additional data
to it. They treat existing values as strings and only work if the existing
stored data is a string (that is, `FMT_UTF8` or `FMT_BYTES` ).

The `format` argument is still available, but the value must be either
`FMT_UTF8` or `FMT_BYTES`. If not specified, it defaults to `FMT_UTF8`.
Otherwise, they are part of the `set` family of methods:


```
c.set("greeting", "Hello", format=FMT_UTF8)
c.append("greeting", " World!")
c.get("greeting").value == "Hello World!"
c.prepend("greeting", "Why, ")
c.get("greeting").value == "Why, Hello World!"
```

 * `c.append(key, data_to_append, **kwargs)`

   Appends data to an existing value.

 * `c.prepend(key, data_to_prepend, **kwargs)`

   Prepends data to an existing value.

Ensure that you only append or prepend to values that were initially stored as
`FMT_UTF8` or `FMT_BYTES`. It does not make sense to append to a *JSON* or
*pickle* string.

Consider:


```
c.set("a_dict", { "key for" : "a dictionary" })
```

The key `a_dict` now looks like this on the server:

Now, prepend the following to it:


```
c.prepend("a dict", "blah blah blah")
```

The value for `a_dict` looks like this now:

Now, when you try to get it back, you see this happen:

`>>> c.get("a_dict") Traceback (most recent call last): File "<stdin>", line 1,
in <module> File "couchbase/connection.py", line 325, in get return
_Base.get(self, key, ttl, quiet) File "/usr/lib/python2.7/json/__init__.py",
line 326, in loads return _default_decoder.decode(s) File
"/usr/lib/python2.7/json/decoder.py", line 365, in decode obj, end =
self.raw_decode(s, idx=_w(s, 0).end()) File
"/usr/lib/python2.7/json/decoder.py", line 383, in raw_decode raise
ValueError("No JSON object could be decoded")
couchbase.exceptions.ValueFormatError: <Failed to decode bytes, Results=1,
inner_cause=No JSON object could be decoded, C Source=(src/convert.c,215),
OBJ='blah blah blah{"key for": "a dictionary"}'>` Unfortunately, the SDK has no
way to pre-emptively determine whether the existing value is a string, and the
server does not enforce this.

<a id="_expiration_operations"></a>

### Expiration Operations

This consists of a single method that is used to update the expiration time of a
given key. It is passed two arguments, a key and an expiration time. If the
expiration time is greater than zero, the key receives the new expiration time.

The expiration time can be expressed as either an offset in seconds or a Unix
time stamp. If the value of the expiration time is smaller than `60*60*24*30`
(that is, one month in seconds) it is considered to be an offset in seconds.
Larger values are considered to be Unix time stamps.

If the expiration time is zero, then any existing expiration time is cleared and
the value remains stored indefinitely unless explicitly deleted or updated with
expiration at a later time.

This is a lightweight means by which to ensure entities "stay alive" without the
overhead of having to reset their value or fetch them.

 * `c.touch(key, ttl)`

   Updates the given key with the specified `ttl`.

<a id="_deleting_data"></a>

## Deleting Data

 * `client.delete(key, quiet=False)`

   Removes a key from the server. If `quiet` is specified, an exception is not
   raised if the key does not exist.

<a id="_retrieving_data"></a>

## Retrieving Data

 * `client.get(key, quiet=False, ttl=0)`

   Retrieves a key from the server. If the key does not exist, an exception is
   raised if the key does not exist and `quiet` is set to False.

If `ttl` is specified, this also modifies, in-situ, the expiration time of the
key when retrieving it. This is also known as *Get and Touch*.

This returns a `ValueResult` object (subclass of `Result` ) that can be used to
obtain the actual value via the `value` property.

<a id="_locking_data_ensuring_consistency"></a>

## Locking Data/Ensuring Consistency

In production deployments, it is possible that you will have more than a single
instance of your application trying to modify the same key. In this case a race
condition happens in which a modification one instance has made is immediately
overidden.

Consider this code:


```
def add_friend(user_id, friend):
    result = c.get("user_id-" + user_id)
    result.value['friends'][friend] = { 'added' : time.time() }
    c.set("user_id-" + user_id, result.value)
```

In this case, `friends` is a dictionary of friends the user has added, with the
keys being the friend IDs, and the values being the time when they were added.

When the friend has been added to the dictionary, the document is stored again
on the server.

Assume that two users add the same friend at the same time, in this case there
is a race condition where one version of the friends dict ultimately wins.

Couchbase provides two means by which to solve for this problem. The first is
called *Opportunistic Locking* and the second is called *Pessimistic Locking*.

Both forms of locking involve using a *CAS* value. This value indicates the
state of a document at a specific time. Whenever a document is modified, this
value changes. The contents of this value are not significant to the
application, however it can be used to ensure consistency. You can pass the
*CAS* of the value as it is known to the application and have the server make
the operation fail if the current (server-side) *CAS* value differs.

<a id="_opportunistic_locking"></a>

### Opportunistic Locking

The opportunistic locking functionality can be employed by using the `cas`
keyword argument to the `set` family of methods.

Note that the `cas` value itself may be obtained by inspecting the `cas`
property of the `Result` object returned by any of the API functions.

We can now modify the `add_friend` example so that it handles concurrent
modifications gracefully:


```
def add_friend(user_id, friend):

    while True:
        result = c.get("user_id-" + user_id)
        result.value['friends'][friend] = { 'added' : time.time() }

        try:
            c.set("user_id-" + user_id, result.value, cas=result.cas)
            break

        except KeyExistsError:
            print "It seems someone tried to modify our user at the same time!"
            print "Trying again"
```

This is called *opportunistic* locking, because if the *CAS* is not modified
during the first loop, the operation succeeds without any additional steps.

<a id="_pessimistic_locking"></a>

### Pessimistic Locking

Pessimistic locking is useful for highly contended resources; that is, if the
key being accessed has a high likelihood of being contended. While this method
may be more complex, it is much more efficient for such resources.

We can use pessimistic locking by employing the `lock` and `unlock` functions.

The `lock` method locks the key on the server for a specified amount of time.
After the key is locked, further attempts to access the key without passing the
proper CAS fail with a `TemporaryFailureError` exception until the key is either
unlocked or the lock timeout is reached.

 * `c.lock(key, ttl=0)`

   This has the same behavior as `get` (that is, it returns the value on the
   server), but the `ttl` argument now indicates how long the lock should be held
   for. By default, the server-side lock timeout is used, which is 15 seconds.

   Returns a `ValueResult`.

 * `c.unlock(key, cas)`

   Unlocks the key. The key must have been previously locked and must have been
   locked with the specified `cas`. The `cas` value can be obtained from the
   `Result` object’s `cas` property.

Calling any of the `set` methods with a valid CAS implicitly unlocks the key,
and thus makes an explicit call to `unlock` unnecessary — calling `unlock` on a
key that is not currently locked raises an exception.

We can rewrite our `add_friend` example using the lock functions:


```
def add_friend(user_id, friend):
    while True:
        try:
            result = c.lock("user_id-" + user_id)
            break

        except TemporaryFailError:
            # Someone else has locked the key..
            pass
    try:
        result.value['friends'][friend] = { 'added' : time.time() }
        c.set("user_id-" + user_id, result.value, cas=result.cas)

    except:
        # We want to unlock if anything happens, rather than waiting
        # for it to time out
        c.unlock(result.key, result.cas)

        # then, raise the exception
        raise
```

### When To Use Optimistic Or Pessimistic Locking

Optimistic locking is more convenient and sometimes more familiar to users.
Additionally, it does not require an explicit *unlock* phase.

However, during a CAS mismatch, the full value is still sent to the server in
the case of opportunistic locking. For highly contended resources this has
impacts on network I/O, because the value must be sent multiple times before it
is actually stored.

Pessimistic locking does not retrieve its value unless the operation was
successful, however.

<a id="_working_with_views"></a>

## Working With Views

This section provides a bit more information on how to work with views from the
Python SDK. If you are new to views, you should [read the chapter about views in
the Couchbase Server
Manual.](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-views.html)

To use views, you must have already set up *design documents* containing one or
more view queries you have defined. You can execute these queries from the
Python SDK and retrieve their results.

[You can define views via either the Couchbase Server web interface or thePython
SDK design document management
functions](couchbase-sdk-python-ready.html#_design_document_management).

Couchbase Server comes with two pre-defined sample buckets which can be
installed from the "Sample Buckets" section in the "Settings" pane.

The basic interface for views is such

`client.query(design_name, view_name)` Which returns an iterable object which
yields `ViewRow` objects.

`ViewRow` objects are simple named tuples with the following fields:

 * `vr.key`

   The key emitted by the view’s `map` function (i.e. first argument to `emit`.

 * `vr.value`

   The *value* emitted by the view’s `map` function (i.e. second argument to `emit`
   ).

 * `vr.id`

   The document ID of this row. The ID can be passed to `get` and `set`.

 * `vr.doc`

   A `Result` object containing the actual document, if the `query` method was
   passed the `include_docs` directive.

The object returned by `query` is a class that defines an `__iter__` (and thus
does not have a `__len__` or `items()` method). You can convert it to a list by
using *list comprehension* :


```
rows_as_list = [ c.query("beer", "brewery_beers") ]
```

You can also pass options to the `query` method. The list of available options
is documented in the `Query` class in the API documentation.

`from couchbase.views.params import Query  client.query(design_name, view_name,
limit=3, mapkey_range = ["abbaye", "abbaye" + Query.STRING_RANGE_END],
descending=True)` The `include_docs` directive can be used to fetch the
documents along with each `ViewRow` object. Note that while it is possible to
simply call `c.get(vr.id)`, the client handles the `include_docs` directive by
actually performing a batched ( `get_multi` ) operation.

You can also pass options for the server itself to handle. These options can be
passed as either an encoded query string, a list of key-value parameters, or a
`Query` object.

### Using encoded query strings


```
client.query("beer", "brewery_beers", query="limit=3&skip=1&stale=false")
```



Note that this is the most efficient way to pass options because they do not
need to be re-encoded for each invocation.

However, it is impossible for the SDK to verify the inputs and thus it is
suggested you only use a raw string once your query has been refined and
optimized.

### Using key-value pairs


```
client.query("beer", "brewery_beers", limit=3, skip=1, stale=False)
```



This allows simple and idiomatic construction of query options.

### Using a Query object


```
from couchbase.views.params import Query

q = Query
q.limit = 3
q.skip = 1
q.stale = False
client.query("beer", "brewery_beers", query=q)
```



The `Query` object makes it simple to programmatically construct a query, and
provides the most maintainable option. When using key-value pairs, the SDK
actually converts them to a `Query` object before processing.

`Query` objects also have named properties, making query construction easy to
integrate if using an IDE with code completion.

<a id="_common_view_parameters"></a>

### Common View Parameters

Here are some common parameters used for views. They are available either as
keyword options to the `query` method, or as properties on the `Query` object

<a id="_server_parameters"></a>

### Server Parameters

 * `mapkey_range = [ "start", "end" ]`

   Sets the start and end key range for keys emitted by the `map` function.

 * `startkey = "start"`

   Sets the start key.

 * `endkey = "end"`

   Sets the end key.

 * `descending = True`

   Inverts the default sort order.

 * `stale = False`

   Possible values are `True`, `False`, or the string `update_after`.

 * `limit = 10`

   Limits the number of rows returned by the query.

<a id="_literal_query_literal_method_options"></a>

### query Method Options

These are only available as options to the `query` method, and should not be
used on the `Query` object.

 * `include_docs = True`

   Fetches corresponding documents along with each row.

 * `streaming = True`

   Fetches results incrementally. Don’t buffer all results in memory at once.

<a id="_pagination"></a>

### Pagination

Often, view results can be large. By default the client reads all the results
into memory and then returns an iterator over that result set. You can change
this behavior by specifying the `streaming` option to the `query` method. When
used, results are fetched incrementally.

Using `streaming` does not have any impact on how the rows are returned.

<a id="_design_document_management"></a>

## Design Document Management

The Python Couchbase SDK provides means by which you can manage design
documents; including all phases of design document development. You can:

 * Create a development design.

 * Publish a development design to a production design.

 * Retrieve a design document.

 * Delete a design document.

Note that all design creation methods take a `syncwait` argument, which is an
optional amount of time to wait for the operation to be complete. By default the
server (and thus the SDK) only *schedule* a design document operation. This
means that if you try to use the view right after you created it, you might get
an error because the operation has not yet completed. Using the `syncwait`
parameter polls for this many seconds and either returns successfully or raises
an exception.

An additional argument that can be provided is the `use_devmode` parameter. If
on, the name of the design will be prepended with `dev_` (if it does not already
start with it).

All these operations return an `HttpResult` object which contains the decoded
JSON payload in its `value` property.

 * `c.design_create(name, design, use_devmode=True, syncwait=0)`

   Creates a new design document. `name` is the name of the design document (for
   example, `"beer"` ). `design` is either a Python dictionary representing the
   structure of the design or a valid string (that is, encoded JSON) to be passed
   to the server.

 * `c.design_get(name, use_devmode=True)`

   Retrieves the design document.

 * `c.design_publish(name, syncwait=0)`

   Converts a development-mode view into a production mode view. This is equivalent
   to pressing the *Publish* button on the web UI.

 * `c.design_delete(name, use_devmode=True)`

   Deletes a design document.

<a id="_advanced_usage"></a>
