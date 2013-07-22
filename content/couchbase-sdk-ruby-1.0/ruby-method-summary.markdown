# Ruby Method Summary

The `Ruby Client Library` supports the full suite of API calls to Couchbase. A
summary of the supported methods are listed in **Couldn't resolve xref tag:
table-couchbase-sdk-ruby-summary**.

<a id="couchbase-sdk-ruby-summary-synchronous"></a>

## Synchronous Method Calls

The Ruby Client Library supports the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the following fragment stores and retrieves a single key/value
pair:


```
couchbase.set("foo", 3600, value);

foo = couchbase.get("foo");
```

In the example code above, the client will wait until a response has been
received from one of the configured Couchbase servers before returning the
required value or an exception.

<a id="couchbase-sdk-ruby-summary-asynchronous"></a>

## Asynchronous Method Calls

In addition, the library also supports a range of asynchronous methods that can
be used to store, update and retrieve values without having to explicitly wait
for a response. For asynchronous operations, the SDK will return control to the
calling method without blocking the current thread. You can pass the block to a
method and it will be called with the result when the operations completes. You
need to use an event loop, namely an event loop in the form of a `run.. do
|return|` block to perform asynchronous calls with the Ruby SDK:


```
couchbase = Couchbase.connect(:async => true)

couchbase.run do |conn|
      conn.get("foo") {|ret| puts ret.value}
      conn.set("bar", "baz")
end
```

The asynchronous callback will recieve an instance of `Couchbase::Result` which
can respond to several methods:

 * `success?` : Returns true if asynchronous operation succeeded.

 * `error` : Returns nil or exception object (subclass of Couchbase::Error::Base)
   if asynchronous operation failed.

 * `key` : Returns key from asynchronous call.

 * `value` : Returns value from asynchronous call.

 * `flags` : Returns flags from asynchronous call.

 * `cas` : CAS value obtained from asynchronous call.

 * `node` : Node used in asynchronous call.

 * `operation` : Symbol representing the type of asynchronous call.

<a id="couchbase-sdk-ruby-connection"></a>
