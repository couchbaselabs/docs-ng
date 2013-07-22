# Using the APIs

The Client libraries provides an interface to both Couchbase and Memcached
clients using a consistent interface. The interface between your Java
application and your Couchbase or Memcached servers is provided through the
instantiation of a single object class, `CouchbaseClient`.

Creating a new object based on this class opens the connection to each
configured server and handles all the communication with the server(s) when
setting, retrieving and updating values. A number of different methods are
available for creating the object specifying the connection address and methods.

<a id="couchbase-sdk-java-started-connection-bucket"></a>

## Connecting to a Couchbase Bucket

You can connect to specific Couchbase buckets (in place of using the default
bucket, or a hostname/port combination configured on the Couchbase cluster) by
using the Couchbase `URI` for one or more Couchbase nodes, and specifying the
bucket name and password (if required) when creating the new `CouchbaseClient`
object.

For example, to connect to the local host and the `default` bucket:


```
List<URI> uris = new LinkedList<URI>();

    uris.add(URI.create("http://127.0.0.1:8091/pools"));
    try {
      client = new CouchbaseClient(uris, "default", "");
    } catch (Exception e) {
      System.err.println("Error connecting to Couchbase: " + e.getMessage());
      System.exit(0);
    }
```

The format of this constructor is:


```
CouchbaseClient(URIs,BUCKETNAME,BUCKETPASSWORD)
```

Where:

 * `URIS` is a `List` of URIs to the Couchbase nodes. The format of the URI is the
   hostname, port and path `/pools`.

 * `BUCKETNAME` is the name of the bucket on the cluster that you want to use.
   Specified as a `String`.

 * `BUCKETPASSWORD` is the password for this bucket. Specified as a `String`.

The returned `CouchbaseClient` object can be used as with any other
`CouchbaseClient` object.

<a id="couchbase-sdk-java-started-connection-sasl"></a>

## Connecting using Hostname and Port with SASL

If you want to use SASL to provide secure connectivity to your Couchbase server
then you could create a `CouchbaseConnectionFactory` that defines the SASL
connection type, userbucket and password.

The connection to Couchbase uses the underlying protocol for SASL. This is
similar to the earlier example except that we use the
`CouchbaseConnectionFactory`.


```
List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactory cf = new
                CouchbaseConnectionFactory(baseURIs,
                    "userbucket", "password");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

<a id="couchbase-sdk-java-started-disconnection"></a>

## Shutting down the Connection

The preferred method for closing a connection is to cleanly shutdown the active
connection with a timeout using the `shutdown()` method with an optional timeout
period and unit specification. The following will shutdown the active connection
to all the configured servers after 60 seconds:


```
client.shutdown(60, TimeUnit.SECONDS);
```

The unit specification relies on the `TimeUnit` object enumerator, which
supports the following values:

Constant                | Description              
------------------------|--------------------------
`TimeUnit.NANOSECONDS`  | Nanoseconds (10 `-9` s). 
`TimeUnit.MICROSECONDS` | Microseconds (10 `-6` s).
`TimeUnit.MILLISECONDS` | Milliseconds (10 `-3` s).
`TimeUnit.SECONDS`      | Seconds.                 

The method returns a `boolean` value indicating whether the shutdown request
completed successfully.

You also can shutdown an active connection immediately by using the `shutdown()`
method to your Couchbase object instance. For example:


```
client.shutdown();
```

In this form the `shutdown()` method returns no value.

<a id="api-reference-summary"></a>
