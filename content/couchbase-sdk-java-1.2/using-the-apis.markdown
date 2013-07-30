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

<a id="couchbase-sdk-ccfb"></a>

## Setting runtime Parameters for the CouchbaseConnectionFactoryBuilder

A final approach to creating the connection is using the
`CouchbaseConnectionFactoryBuilder` and `CouchbaseConnectionFactory` classes.

It's possible to ovverride some of the default paramters that are defined in the
`CouchbaseConnectionFactoryBuilder` for a variety of reasons and customize the
connection for the session depending on expected load on the server and
potential network traffic.

For example, in the following program snippet, we instatiate a new
`CouchbaseConnectionFactoryBuilder` and use the `setOpTimeout` method to change
the default value to 10000ms (or 10 secs).

We subsequently use the `buildCouchbaseConnection` specifying the bucket name,
password and an username (which is not being used any more) to get a
`CouchbaseConnectionFactory` object. We then create a `CouchbaseClient` object.


```
List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactoryBuilder cfb = new
            CouchbaseConnectionFactoryBuilder();

        // Ovveride default values on CouchbaseConnectionFactoryBuilder

        // For example - wait up to 10 seconds for an operation to succeed
        cfb.setOpTimeout(10000);

        CouchbaseConnectionFactory cf =
            cfb.buildCouchbaseConnection(baseURIs, "default", "", "");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

For example, the following code snippet will set the OpTimeOut value to 10000
secs. before creating the connection as we saw in the code above.


```
cfb.setOpTimeout(10000);
```

These parameters can be set at runtime by setting a property on the command line
(such as *-DopTimeout=1000* ) or via properties in a file *cbclient.properties*
in that order of precedence.

The following parameters can be set as summarized in the table below. We provide
the parameter name, a brief description, the default value and why the
particular parameter might need to be modified.

Parameter                   | Description                                                                                      | Default value    | When to Override the default value                                                                                                                                                                                                                         
----------------------------|--------------------------------------------------------------------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`opTimeout`                 | Time in millisecs for an operation to Timeout                                                    | 2500 millisecs.  | You can set this value higher when there is heavy network traffic and timeouts happen frequently.                                                                                                                                                          
`timeoutExceptionThreshold` | Number of operations to timeout before the node is deemed down                                   | 998              | You can set this value lower to deem a node is down earlier.                                                                                                                                                                                               
`readBufSize`               | Read Buffer Size                                                                                 | 16384            | You can set this value higher or lower to optimize the reads.                                                                                                                                                                                              
`opQueueMaxBlockTime`       | The maximum time to block waiting for op queue operations to complete, in milliseconds.          | 10000 millisecs. | The default has been set with the expectation that most requests are interactive and waiting for more than a few seconds is thus more undesirable than failing the request. However, this value could be lowered for operations not to block for this time.
`shouldOptimize`            | Optimize behavior for the network                                                                | False            | You can set this value to be true if the performance should be optimized for the network as in cases where there are some known issues with the network that may be causing adverse effects on applications.                                               
`maxReconnectDelay`         | Maximum number of milliseconds to wait between reconnect attempts.                               | 30000 millisecs. | You can set this value lower when there is intermittent and frequent connection failures.                                                                                                                                                                  
`MinReconnectInterval`      | A default minimum reconnect interval in millisecs.                                               | 1100             | This means that if a reconnect is needed, it won't try to reconnect more frequently than default value. The internal connections take up to 500ms per request. You can set this to higher to try reconnecting less frequently.                             
`obsPollInterval`           | Wait for the specified interval before the Observe operation polls the nodes.                    | 400              | Set this higher or lower depending on whether the polling needs to happen less or more frequently depending on the tolerance limits for the Observe operation as compared to other operations.                                                             
`obsPollMax`                | The maximum times to poll the master and replica(s) to meet the desired durability requirements. | 10               | You could set this value higher if the Observe operations do not complete after the normal polling.                                                                                                                                                        

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
