# Ruby — Connection Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

Creates a connection with the Couchbase Server. There are several ways to
establish new connection to Couchbase Server. By default a Couchbase SDK uses
the `http://localhost:8091/pools/default/buckets/default` as the endpoint. The
client will automatically adjust configuration when the cluster rebalances, when
the cluster returns from failover, or when you add or delete nodes. Returns the
exception object `Couchbase::Error::Connect` if it fails to connect. The
following creates a default connection:


```
c = Couchbase.connect
c2 = Couchbase.new
```

Note that `Couchbase.new` is a new alias for `connect`, as of the 1.1 version of
the Ruby SDK.

The following are equivalent alternatives to connect to the same node, using
different syntax:


```
#creates connection to the default bucket on default node
c = Couchbase.connect("http://localhost:8091/pools/default/buckets/default")

#shorter method to connect to default bucket
c = Couchbase.connect("http://localhost:8091/pools/default")

#connecting to default bucket
c = Couchbase.connect("http://localhost:8091")

#connecting via default port to default bucket
c = Couchbase.connect(:hostname => "localhost")

#provide host and port as Ruby symbols
c = Couchbase.connect(:hostname => "localhost",
                      :port => 8091)

c = Couchbase.connect(:pool => "default", :bucket => "default")
```

You can also provide a list of possible nodes to connect to in order to avoid a
failure to connect due to a missing node. After your Couchbase client
successfully connects, it will use the most current cluster topology, not this
list, to connect to a node after rebalance or failover. To provide multiple
possible nodes for initial connection:


```
c = Couchbase.connect(:bucket => "mybucket",
                      :node_list => ['example.com:8091', 'example.net'])
```

Here is creating a connection to a protected bucket by providing a username and
password. Notice that the username you provide is the same as the bucket:


```
Couchbase.connect(:bucket => 'protected',
                  :username => 'protected',
                  :password => 'secret')

Couchbase.connect('http://localhost:8091/pools/default/buckets/protected',
                  :username => 'protected',
                  :password => 'secret')
```

The possible errors that can occur when you try to connect are:

 * `Couchbase::Error::BucketNotFound`. Occurs if the bucket name your provide does
   not exist.

 * `Couchbase::Error::Connect`. Occurs if the socket to connect to Couchbase Server
   does not respond in time or cannot accept the connection.

You can persist a Couchbase client storing it in a way such that the Ruby
garbage collector does not remove from memory. To do this, you can create a
singleton object that contains the client instance and the connection
information. You should access the class-level method, `Couchbase.bucket`
instead of `Couchbase.connect` to get the client instance.

When you use `Couchbase.bucket` it will create a new client object when you
first call it and then store the object in thread storage. If the thread is
still alive when the next request is made to the ruby process, the SDK will not
create a new client instance, but rather use the existing one:


```
# Simple example to connect using thread local singleton

Couchbase.connection_options = {:bucket => "my",
                                :hostname => "example.com",
                                :password => "secret"}

# this call will user connection_options to initialize new connection.

# By default Couchbase.connection_options can be empty

Couchbase.bucket.set("foo", "bar")

# Amend the options of the singleton connection in run-time

Couchbase.bucket.reconnect(:bucket => "another")
```

The first example demonstrates how you can create a client instance as a
singleton object, the second one will use the class-level `Couchbase.bucket`
constructor to create a persistent connection. The last example demonstrates how
you can update the properties of the singleton connection if you reconnect.

In the case of the Ruby SDK, you can set a timeout for the initial connection,
and then change the timeout setting. This new connection-level setting will
apply to any subsequent read/write requests made with the client instance:


```
#sets timeout for initial client instance and connection to server

conn = Couchbase.connect(:timeout => 3_000_000)

#resets the connection timeout for subsequent operations on connection

conn.timeout = 1_500_000

#set a value using client instance

conn.set("foo", "bar")
```

In this example, we create a new Couchbase client instance with
`Couchbase.connect()` and set the connection time out to 3 seconds. If the
client instance fails to connect in the three seconds, it will timeout and
return a failure to connect error. Then we set the timeout to `1_500_000`, or
1.5 seconds, which will be the timeout level of any requests made with that
client instance, such as the `set()`.

<a id="couchbase-sdk-ruby-store"></a>
