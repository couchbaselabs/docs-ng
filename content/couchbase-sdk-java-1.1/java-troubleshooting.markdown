# Java Troubleshooting

This Couchbase SDK Java provides a complete interface to Couchbase Server
through the Java programming language. For more on Couchbase Server and Java
read our [Java SDK Getting Started
Guide](http://www.couchbase.com/develop/java/current) followed by our in-depth
Couchbase and Java tutorial. We recommended Java SE 6 (or higher) for running
the Couchbase Client Library.

This section covers the following topics:

 * Logging from the Java SDK

 * Handling Timeouts

 * Bulk Load and Exponential Backoff

 * Retrying After Receiving a Temporary Failure

<a id="java-api-configuring-logging"></a>

## Configuring Logging

Occasionally when you are troubleshooting an issue with a clustered deployment,
you may find it helpful to use additional information from the Couchbase Java
SDK logging. The SDK uses JDK logging and this can be configured by specifying a
runtime define and adding some additional logging properties. There are two ways
to set up Java SDK logging:

 * Use spymemcached to log from the Java SDK. Since the SDK uses spymemcached and
   is compatible with spymemcached, you can use the logging provided to output
   SDK-level information.

 * Set your JDK properties to log Couchbase Java SDK information.

 * Provide logging from your application.

To provide logging via spymemcached:


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
```

or


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");
```

The default logger simply logs everything to the standard error stream. To
provide logging via the JDK, if you are running a command-line Java program, you
can run the program with logging by setting a property:


```
-Djava.util.logging.config.file=logging.properties
```

The other alternative is create a `logging.properties` and add it to your in
your classpath:


```
logging.properties
handlers = java.util.logging.ConsoleHandler
java.util.logging.ConsoleHandler.level = ALL
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
com.couchbase.client.vbucket.level = FINEST
com.couchbase.client.vbucket.config.level = FINEST
com.couchbase.client.level = FINEST
```

The final option is to provide logging from your actual Java application. If you
are writing your application in an IDE which manages command-line operations for
you, it may be easier if you express logging in your application code. Here is
an example:


```
// Tell things using spymemcached logging to use internal SunLogger API
        Properties systemProperties = System.getProperties();
        systemProperties.put("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
        System.setProperties(systemProperties);

        Logger.getLogger("net.spy.memcached").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client.vbucket").setLevel(Level.FINEST);

        //get the top Logger
        Logger topLogger = java.util.logging.Logger.getLogger("");

        // Handler for console (reuse it if it already exists)
        Handler consoleHandler = null;
        //see if there is already a console handler
        for (Handler handler : topLogger.getHandlers()) {
            if (handler instanceof ConsoleHandler) {
                //found the console handler
                consoleHandler = handler;
                break;
            }
        }

        if (consoleHandler == null) {
            //there was no console handler found, create a new one
            consoleHandler = new ConsoleHandler();
            topLogger.addHandler(consoleHandler);
        }

        //set the console handler to fine:
        consoleHandler.setLevel(java.util.logging.Level.FINEST);
```

<a id="java-sdk-handling-timeouts"></a>

## Handling Timeouts

The Java client library has a set of synchronous and asynchronous methods. While
it does not happen in most situations, occasionally network IO can become
congested, nodes can fail, or memory pressure can lead to situations where an
operation can timeout.

When a timeout occurs, most of the synchronous methods on the client will return
a RuntimeException showing a timeout as the root cause. Since the asynchronous
operations give more specific control over how long it takes for an operation to
be successful or unsuccessful, asynchronous operations throw a checked
TimeoutException.

As an application developer, it is best to think about what you would do after
this timeout. This may be something such as showing the user a message, it may
be doing nothing, or it may be going to some other system for additional data.

In some cases you might want to retry the operation, but you should consider
this carefully before performing the retry in your code; sometimes a retry may
exacerbate the underlying problem that caused the timeout. If you choose to do a
retry, providing in the form of a backoff or exponential backoff is advisable.
This can be thought of as a pressure relief valve for intermittent resource
problems. For more information on backoff and exponential backoff, see [Bulk
Load and Exponential
Backoff](couchbase-sdk-java-ready.html#java-sdk-bulk-load-and-backoff).

<a id="java-sdk-timingout-and-blocking"></a>

## Timing-out and Blocking

If your application creates a large number of asynchronous operations, you may
also encounter timeouts immediately in response to the requests. When you
perform an asynchronous operation, Couchbase Java SDK creates an object and puts
the object into a request queue. The object and the request are stored in Java
runtime memory, in other words, they are stored in local to your Java
application runtime memory and require some amount of Java Virtual Machine IO to
be serviced.

Rather than write so many asynchronous operations that can overwhelm a JVM and
generate out of memory errors for the JVM, you can rely on SDK-level timeouts.
The default behavior of the Java SDK is to start to immediately timeout
asynchronous operations if the queue of operations to be sent to the server is
overwhelmed.

You can also choose to control the volume of asynchronous requests that are
issued by your application by setting a timeout for blocking. You might want to
do this for a bulk load of data so that you do not overwhelm your JVM. The
following is an example:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-bulk-load-and-backoff"></a>

## Bulk Load and Exponential Backoff

When you bulk load data to Couchbase Server, you can accidentally overwhelm
available memory in the Couchbase cluster before it can store data on disk. If
this happens, Couchbase Server will immediately send a response indicating the
operation cannot be handled at the moment but can be handled later.

This is sometimes referred to as "handling Temp OOM", where where OOM means out
of memory. Note though that the actual temporary failure could be sent back for
reasons other than OOM. However, temporary OOM is the most common underlying
cause for this error.

To handle this problem, you could perform an exponential backoff as part of your
bulk load. The backoff essentially reduces the number of requests sent to
Couchbase Server as it receives OOM errors:


```
package com.couchbase.sample.dataloader;

import com.couchbase.client.CouchbaseClient;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import net.spy.memcached.internal.OperationFuture;
import net.spy.memcached.ops.OperationStatus;

/**
 *
   * The StoreHandler exists mainly to abstract the need to store things
   * to the Couchbase Cluster even in environments where we may receive
   * temporary failures.
 *
 * @author ingenthr
 */
public class StoreHandler {

  CouchbaseClient cbc;
  private final List<URI> baselist;
  private final String bucketname;
  private final String password;

  /**
   *
   * Create a new StoreHandler.  This will not be ready until it's initialized
   * with the init() call.
   *
   * @param baselist
   * @param bucketname
   * @param password
   */
  public StoreHandler(List<URI> baselist, String bucketname, String password) {
    this.baselist = baselist; // TODO: maybe copy this?
    this.bucketname = bucketname;
    this.password = password;


  }

  /**
   * Initialize this StoreHandler.
   *
   * This will build the connections for the StoreHandler and prepare it
   * for use.  Initialization is separated from creation to ensure we would
   * not throw exceptions from the constructor.
   *
   *
   * @return StoreHandler
   * @throws IOException
   */
  public StoreHandler init() throws IOException {
    // I prefer to avoid exceptions from constructors, a legacy we're kind
    // of stuck with, so wrapped here
    cbc = new CouchbaseClient(baselist, bucketname, password);
    return this;
  }

  /**
   *
   * Perform a regular, asynchronous set.
   *
   * @param key
   * @param exp
   * @param value
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> set(String key, int exp, Object value) {
    return cbc.set(key, exp, cbc);
  }

  /**
   * Continuously try a set with exponential backoff until number of tries or
   * successful.  The exponential backoff will wait a maximum of 1 second, or
   * whatever
   *
   * @param key
   * @param exp
   * @param value
   * @param tries number of tries before giving up
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> contSet(String key, int exp, Object value,
          int tries) {
    OperationFuture<Boolean> result = null;
    OperationStatus status;
    int backoffexp = 0;

    try {
      do {
        if (backoffexp > tries) {
          throw new RuntimeException("Could not perform a set after "
                  + tries + " tries.");
        }
        result = cbc.set(key, exp, value);
        status = result.getStatus(); // blocking call, improve if needed
        if (status.isSuccess()) {
          break;
        }
        if (backoffexp > 0) {
          double backoffMillis = Math.pow(2, backoffexp);
          backoffMillis = Math.min(1000, backoffMillis); // 1 sec max
          Thread.sleep((int) backoffMillis);
          System.err.println("Backing off, tries so far: " + backoffexp);
        }
        backoffexp++;

        if (!status.isSuccess()) {
          System.err.println("Failed with status: " + status.getMessage());
        }

      } while (status.getMessage().equals("Temporary failure"));
    } catch (InterruptedException ex) {
      System.err.println("Interrupted while trying to set.  Exception:"
              + ex.getMessage());
    }

    if (result == null) {
      throw new RuntimeException("Could not carry out operation."); // rare
    }

    // note that other failure cases fall through.  status.isSuccess() can be
    // checked for success or failure or the message can be retrieved.
    return result;
  }
}
```

There is also a setting you can provide at the connection-level for Couchbase
Java SDK that will also help you avoid too many asynchronous requests:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpTimeout(10000);  // wait up to 10 seconds for an operation to succeed
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-retry"></a>

## Retrying After Receiving a Temporary Failure

If you send too many requests all at once to Couchbase, you can create a out of
memory problem, and the server will send back a temporary failure message. The
message indicates you can retry the operation, however the server will not slow
down significantly; it just does not handle the request. In contrast, other
database systems will become slower for all operations under load.

This gives your application a bit more control since the temporary failure
messages gives you the opportunity to provide a backoff mechanism and retry
operations in your application logic.

<a id="java-gc-tuning"></a>

## Java Virtual Machine Tuning Guidelines

Generally speaking, there is no reason to adjust any Java Virtual Machine
parameters when using the Couchbase Java Client. In fact, in general you should
not start with specific tuning, but instead should use defaults from the
application server first, then measure application metrics such as throughput
and response time. Then, if there is a need to make an improvement, make
adjustments and re-measure.

The recommendations here are based on the Oracle (formerly Sun) HotSpot Virtual
Machine and derivations such as the Java Virtual Machine shipped with Mac OS X
and the OpenJDK project. Other Java virtual machines likely behave similarly.

It should be noted that by default, garbage collection times may easily go over
1sec. This can lead to higher than expected response times or even timeouts, as
the default timeout is 2.5 seconds. This is true with simple tests even on
systems with lots of CPUs and a good amount of memory.

The reason for this is that for the most part, by default, the JVM is weighted
toward throughput instead of latency. Of course, much of this can be controlled
with GC tuning on the JVM. With the hotspot JVM, look to this whitepaper:
http://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf

In the referenced whitepaper, the Concurrent Mark Sweep collector is recommended
if your applciation needs short pauses. It also recommends advising the JVM to
try to shorten pause times. Given the Couchbase client's 2.5 second default
timeout, with our basic testing we found the following to be useful:


```
-XX:+UseConcMarkSweepGC -XX:MaxGCPauseMillis=850
```

The whitepaper refers to a couple of tools which may be useful in gathering
information on JVM GC performance. For example, adding -XX:+PrintGCDetails and
-XX:+PrintGCTimeStamps are a simple way to generate log messages which you may
correlate to application behavior. The logs may show a full GC event taking,
perhaps, several seconds during which no processing occurs and operations may
timeout. Adjusting parameters related to how to perform a full GC, which
collector to use, how long to pause the VM during GC and even adding incremental
mode may help, depending on your application's workload. One other common tool
for getting information is JConsole
(http://docs.oracle.com/javase/6/docs/technotes/guides/management/jconsole.html).
JConsole is more of an interactive tool, but it may help you identify changes
you may want to make in the different memory spaces used by the JVM to further
reduce the need to run a GC on the old generation.

There is a CPU time tradeoff when setting these tuning parameters. There are
also other parameters which may provide additional help referenced in the
whitepaper.

If you happen to be using JDK 7 update 4 or later, the G1 collector may be an
even better option. Again, you should be guided by measuring performance from
the application level.

Even with these, our testing showed some GCs near a half a second. While the
Couchbase Client allows tuning of the timeout time to drop as low as you wish,
we do not recommend dropping it much below one second unless you are planning to
tune other parts of the system beyond the JVM.

For example, most people run applications on networks that do not offer any
guarantee around response time. If the network is oversubscribed or minor blips
occur on the network, there can be TCP retransmissions. While many TCP
implementations may ignore it, RFC 2988 specifies rounding up to 1sec when
calculating TCP retransmit timeouts.

Achieving either maximum throughput or minimum per-operation latency can be
enhanced with JVM tuning, supported by overall system tuning at the extremes.

<a id="couchbase-sdk-java-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see [Couchbase
Client Library Java Issues
Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-1-8a"></a>

## Release Notes for Couchbase Client Library Java 1.1.8 GA (9 July 2013)

This 1.1.8 release is the eighth bugfix release for the 1.1 series. The main
additions (aside from the regular bugfixes) are support for "replica read" and
"delete with CAS" through the upgrade of spymemcached to 2.9.1.

**New Features and Behaviour Changes in 1.1.8**

 * Spymemcached has been upgraded to 2.9.1, which adds the capability to use delete
   with CAS. This allows better handling of concurrent deletes.

   Here is a simple example. Note that in a production environment, proper retry on
   CAS failure needs to be implemented.

    ```
    CASValue<Object> casvalue = c.gets("mykey");
    boolean goodToDelete = yourCheckIfDocCanBeDeleted(casvalue);
    if (goodToDelete) {
     c.delete("mykey", casvalue.getCas());
    }
    ```

 * Alongside with the Couchbase Server 2.1 release, the 1.1.8 version of the SDK
   adds support for "replica read". This allows the developer to choose a tradeoff
   between data consistency and availability. Note that this operation is not
   intended for read scaling, but instead for fault tolerance.

   Here is a (simple) example on how to use it. If asynchronous get is used, the
   future needs to be inspected and properly acted upon its resulting status.

    ```
    Object result;
    try {
     result = client.get("mykey");
    } catch (Exception ex) {
     // Read from all replicas and return the first responding value
     result = client.getFromReplica("mykey");
    }

    if(result != null) {
     // Do something with the eventually consistent value.
    }
    ```

   The underlying code will "fan out" to all of the currently available replicas
   and return the value from the first that responds. This is because we know that
   the cluster is in a unstable state and the original response is already delayed
   until cancelled or timeouted.

   Note that because of the eventually consistent nature, it can be the case that
   the value has not been replicated to one of the replicas, leading to a valid
   null as reponse. Also, be aware that since the cluster is currently not in a
   "stable" state, wildly calling `getFromReplica` for every get that failed will
   only result in even more load against it.

   *Issues* : [JCBC-76](http://www.couchbase.com/issues/browse/JCBC-76)

**Fixes in 1.1.8**

 * The `flush()` method on the `CouchbaseClient()` object can now no longer be
   called after the `shutdown()` method has been executed.

   *Issues* : [JCBC-323](http://www.couchbase.com/issues/browse/JCBC-323)

 * If memcached-type buckets are used, the client now checks for inactive nodes and
   triggers hard reconfiguration if no new configuration arrives on time. This
   makes sure that clients connect to memcached-type buckets now eventually recover
   when the streaming connection node is removed / failed over.

   *Issues* : [JCBC-319](http://www.couchbase.com/issues/browse/JCBC-319)

 * The code now makes sure that rebalance/reconnection is only called once at a
   time, making sure that there are not more connections opened than needed.

   *Issues* : [JCBC-318](http://www.couchbase.com/issues/browse/JCBC-318)

**Known Issues in 1.1.8**

 * It can be possible that View operations don't recover properly through rebalance
   operations when the node on which the client is currently receiving
   configuration updates from is removed. This will be addressed in one of the next
   bugfix releases.

<a id="couchbase-sdk-java-rn_1-1-7a"></a>

## Release Notes for Couchbase Client Library Java 1.1.7 GA (7 June 2013)

The 1.1.7 release is the seventh bugfix release for the 1.1 series. This release
mostly brings better stability during rebalance and failover phases. Also,
fail-fast exceptions have been implemented to disallow certain operations on
memcache buckets.

**New Features and Behaviour Changes in 1.1.7**

 * For lots of HTTP responses (Views, DesignDocuments) we now retry until timeout
   when its not a 200 success. This especially helps for transient errors and
   server redirects. This should bring better stability for http requests during
   the rebalance process.

   *Issues* : [JCBC-313](http://www.couchbase.com/issues/browse/JCBC-313)

 * The SDK now "fails fast" when one tries to use persistence options (ReplicateTo,
   PersistTo) with memcached-type buckets. This is not supported and now
   immediately throws a exception instead of failing further down the stack.

   *Issues* : [JCBC-250](http://www.couchbase.com/issues/browse/JCBC-250)

 * Spymemcached has been upgraded to 2.9.0. One of the major enhancements is
   support for SLF4J, which is now also available for the Java SDK.

**Fixes in 1.1.7**

 * In cases where there is no master partition available for the key (so in the
   internal vbucket map its ID is -1), now we correctly cancel the operation and
   also trigger reconfiguration (to make sure the system eventually recovers).

   *Issues* : [JCBC-312](http://www.couchbase.com/issues/browse/JCBC-312)

 * Possible `ConcurrentModificationException` in the IO thread are caught and we
   are making sure that those type of exceptions dont terminate it. There are rare
   occurences where they can occur internally, but they are temporary. Note that
   they still get logged properly.

   *Issues* : [JCBC-309](http://www.couchbase.com/issues/browse/JCBC-309)

**Known Issues in 1.1.7**

 * It can be possible that View operations don't recover properly through rebalance
   operations when the node on which the client is currently receiving
   configuration updates from is removed. This will be addressed in one of the next
   bugfix releases.

<a id="couchbase-sdk-java-rn_1-1-6a"></a>

## Release Notes for Couchbase Client Library Java 1.1.6 GA (13 May 2013)

The 1.1.6 release is the sixth bugfix release for the 1.1 series. Improvements
have been made around view query handling and pagination. Also, new operations
without the need to provide a TTL have been added for convenience.

**New Features and Behaviour Changes in 1.1.6**

 * It is now possible to pass a single "null" value in when using the
   ComplexKey.of() method. This will be translated to a "null" (without the quotes)
   in the Query string.

   *Issues* : [JCBC-177](http://www.couchbase.com/issues/browse/JCBC-177)

 * An optimization has been implemented so when ReplicateTo.ZERO and PersistTo.ZERO
   are used, the persistence constraint checks are avoided completely (and treated
   the same as if they are not present at all). Previously, a potentially costly
   but not needed "observe" call has been executed and therefore decreased
   performance.

   *Issues* : [JCBC-268](http://www.couchbase.com/issues/browse/JCBC-268)

 * The View Paginator has been completely refactored internally. It is now possible
   to use it for reduced views as well. Note that it should be more efficient
   because only one HTTP call is done behind the scenes instead of two for every
   iteration.

   Because of the current API, in odd cases, Pagination with numbers in strings on
   view keys can lead to infinte loops. To address this issue, a new method has
   been added which allows one to force a certain key type even if its not a string
   value. Please see the Paginator\#forceKeyType() method for more information. In
   general, this will be not needed and should only be used when those inifite
   loops occur.

   Also note that this is considered "band aid" and is in place because we don't
   want to change the API completely in the 1.1 series. For a future minor release
   (most likely 1.2), the API for views will change a bit so keys don't directly
   get casted to strings and therefore loose the type information needed to address
   this issue. We will then depcrecate this method.

   *Issues* : [JCBC-241](http://www.couchbase.com/issues/browse/JCBC-241)

 * set, add and replace methods have been overloaded so you don't need to provide a
   TTL of 0 all the time if it is not needed. You can now use shorther method
   calles like:

    ```
    client.set("key", "{\"name\":\"My JSON doc with no TTL\"}");
    ```

   *Issues* : [JCBC-284](http://www.couchbase.com/issues/browse/JCBC-284)

**Fixes in 1.1.6**

 * An issue when parsing view query params has been fixed. Previously, a key like
   "123ABC" has been incorrectly sent as key=123 over the wire (ComplexKex and
   setKeys have been working correctly).

   *Issues* : [JCBC-288](http://www.couchbase.com/issues/browse/JCBC-288)

<a id="couchbase-sdk-java-rn_1-1-5a"></a>

## Release Notes for Couchbase Client Library Java 1.1.5 GA (4 April 2013)

The 1.1.5 release is the fifth bugfix release for the 1.1 series. It fixes a bug
around the ConnectionFactoryBuilder and includes better interoperability with
Netty.

**New Features and Behaviour Changes in 1.1.5**

 * The distributed javadoc jar file has been renamed from "javadocs" to "javadoc"
   for better standard compliance and IDE compatibility.

   *Issues* : [JCBC-232](http://www.couchbase.com/issues/browse/JCBC-232)

**Fixes in 1.1.5**

 * If the CouchbaseClient object was used inside a Netty worker thread (for example
   when used together with the Play! framework), Netty would complain because the
   Client object blocked when loading the configuration (also using Netty) and this
   is not allowed. The blocking mechanism has now been moved out to a separate
   thread, so Netty won't complain anymore and the CouchbaseClient object can now
   be used without issues inside worker threads.

   *Issues* : [JCBC-135](http://www.couchbase.com/issues/browse/JCBC-135)

 * The CouchbaseConnectionFactoryBuilder has been modified so that the same default
   settings are used as if the ConnectionFactory is initialized directly.
   Previously, this could lead to a bug where when the FactoryBuilder was used to
   connect to the cluster, a silently dying streaming connection was never detected
   and not reestablished.

   *Issues* : [JCBC-278](http://www.couchbase.com/issues/browse/JCBC-278)

 * This issue only affects connections to memcache-type buckets. In some cases, it
   could've been the case that when nodes are added, they were not instantly marked
   as active and put on the reconnect queue. This could lead to some odd race
   conditions and a failure state that could not be recovered properly. This has
   been fixed.

   *Issues* : [JCBC-271](http://www.couchbase.com/issues/browse/JCBC-271)

<a id="couchbase-sdk-java-rn_1-1-4a"></a>

## Release Notes for Couchbase Client Library Java 1.1.4 GA (13 March 2013)

The 1.1.4 release is the fourth bugfix release for the 1.1 series. It mainly
fixes a bug introduced in 1.1.3 that comes up when trying to use it with buckets
of type "Memcached".

**Fixes in 1.1.4**

 * When using the 1.1.3 release in combination with a bucket of type "memcached",
   the initial client construction fails with an Exception. This was because of the
   previously introduced backoff on warmup, which uses the number of vBuckets to
   determine the warmup state. The problem associated with this enhancement is that
   "memcached" buckets do not use the concept of vbuckets at all. This has been
   fixed, warmup is now ignored for those bucket types.

   *Issues* : [JCBC-261](http://www.couchbase.com/issues/browse/JCBC-261)

 * When using the ConnectionFactory during CouchbaseClient initialization, it could
   happen that some of the properties were not correctly initialized wih default
   values and this can lead to NPEs when those values get accessed later. Proper
   default values are now used automatically when not provided otherwise.

   *Issues* : [JCBC-257](http://www.couchbase.com/issues/browse/JCBC-257)

<a id="couchbase-sdk-java-rn_1-1-3a"></a>

## Release Notes for Couchbase Client Library Java 1.1.3 GA (4 March 2013)

The 1.1.3 release is the third bugfix release for the 1.1 series. Most of the
improvements center around persistence and replication constraints, other small
bugs have also been fixed.

ATTENTION: do not upgrade to this release when using buckets of type
"memcached". The code will throw an exception during the construction of the
CouchbaseClient object. Regular "couchbase" buckets are not affected and we
recommend all deployments on the 1.1-branch to upgrade. A proper fix for this
known issue is under way and a 1.1.4 release is due shortly.

**New Features and Behaviour Changes in 1.1.3**

 * Spymemcached has been updated to 2.8.12. This version includes corresponding
   enhancements and bugfixes that are needed by this release.

 * When running a cluster and during a failure scenario all nodes provided on the
   bootstrap list are not accessible, the Client now more intelligently backoffs
   for a certain amount of time and sleeps to save precious CPU resources. Before
   this change, the Client did try as fast as it can. The maximum interval between
   backoff is 10 seconds.

   *Issues* : [JCBC-27](http://www.couchbase.com/issues/browse/JCBC-27)

 * When an operation is now cancelled, a CancellationException is now thrown
   instead of a RuntimeException. Since CancellationExceptions inherit from
   RuntimeExceptions, this is not an API change and old code will still work, but
   new code can benefit by distinguishing it from others explicitely.

   *Issues* : [JCBC-210](http://www.couchbase.com/issues/browse/JCBC-210)

**Fixes in 1.1.3**

 * Various bugfixes have been implemented that improve the stability and
   fault-tolerance of mutation commands in combination with replication and
   persistence contstaints (that is, all methods that take ReplicateTo and/or
   PersistTo ENUMs such as set, replace, add or delete). If you see Exceptions in
   older versions in combination with those commands, there is a strong possibility
   that they have been addressed here.

   Also, methods with those signatures incorrectly only accepted Strings as values.
   Since they just call the underlying methods, this is wrong and has been
   corrected. You can now use all kinds ob Objects with those methods and make use
   of the built-in transcoding mechanisms.

   *Issues* : [JCBC-251](http://www.couchbase.com/issues/browse/JCBC-251),
   [JCBC-253](http://www.couchbase.com/issues/browse/JCBC-253),
   [JCBC-254](http://www.couchbase.com/issues/browse/JCBC-254),
   [JCBC-245](http://www.couchbase.com/issues/browse/JCBC-245),
   [JCBC-198](http://www.couchbase.com/issues/browse/JCBC-198)

**Known Issues in 1.1.3**

 * A bug in the newly implemented warmup backoff algorithm causes the 1.1.3 release
   to malfunction when using it in combination with "memcached" type buckets.
   Regular "couchbase" buckets are not affected.

   *Issues* : [JCBC-261](http://www.couchbase.com/issues/browse/JCBC-261)

<a id="couchbase-sdk-java-rn_1-1-2a"></a>

## Release Notes for Couchbase Client Library Java 1.1.2 GA (5 February 2013)

The 1.1.2 release is the second bugfix release for the 1.1 series. Failover and
rebalance resiliency have been improved, and also a bug regarding persistence
constraints and replicas has been fixed. Spymemcached has been upgraded to
2.8.11, which now does not try to reconnect when the node is not part of the
cluster anymore.

**New Features and Behaviour Changes in 1.1.2**

 * Spymemcached has been upgraded to 2.8.11. 2.8.11 fixes a important bug that can
   happen when using commands like "stats" and memcached-buckets together, where
   the node list was not updated correctly. This may also affect broadcast
   operations. In addition, when using authenticated buckets the code now only
   tries to reconnect when the node is still part of the cluster (by checking
   against the node map). This is not an issue on its own, but should give the IO
   thread more time handling IO and not trying to reconnect when not necessary.

 * When the Streaming connection dies and no node is available to reconnect, then
   the client tried as fast as it can to reestablish the connection. This may lead
   to unnecessary CPU usage. The fix implements a backoff algorithm that increases
   from 1 second to max 10 seconds between retries. There is no maximum time where
   it stops, so once one of the nodes in the list is back online, it will be able
   to reconnect. INFO-level log messages indicate the reconnect attempts.

   *Issues* : [JCBC-227](http://www.couchbase.com/issues/browse/JCBC-227)

 * When writing view operations to nodes, previously when one node had no
   connection available, ultimately the operation was cancelled. Now, when one node
   is not able to provide a connection in a reasonable time (max of 5 seconds),
   then a different node is tried. After a max. of 6 retries, the operation is
   considered cancelled (this would mean 6\*5=30 seconds).

   In general, this will slightly improve performance, but also help when nodes
   have problems fulfilling requests and when shutting down.

**Fixes in 1.1.2**

 * When the Couchbase Server closes the HTTP Chunked connection properly (during a
   rebalance finish), it can be the case that a different Netty event is generated
   that has not been caught preivously. This led to a case where the streaming
   connection never got reestablished fully, leading to a potentially "deaf"
   client.

   *Issues* : [JCBC-219](http://www.couchbase.com/issues/browse/JCBC-219)

 * When running against a 1-node cluster with replicas enabled (which is done by
   default) and using the persistence constraints with ReplicateTo.One or more, it
   created an IndexOutOfBoundsException. The client now properly checks for the
   replica count when using "observe". Note that this does not affect 1-node
   buckets when replication has been disabled completely.

   *Issues* : [JCBC-223](http://www.couchbase.com/issues/browse/JCBC-223)

<a id="couchbase-sdk-java-rn_1-1-1a"></a>

## Release Notes for Couchbase Client Library Java 1.1.1 GA (23 January 2013)

The 1.1.1 release is the first bugfix release for the 1.1 series. It brings more
resiliency on failover, adds more flexibility for view query params and adds a
(by default disabled) stats-based throttling mechanism.

**New Features and Behaviour Changes in 1.1.1**

 * An adaptive throttling mechanism has been implemented that is particularily
   useful when running bulk load operations while maintaining a healthy throughput
   from a different running application at the same time. The throttler is disabled
   by default and can be enabled through properties.

   The adaptive throttling mechanisms works on top of memory thresholds that it
   fetches every N operations from the cluster. If the memory is higher than a
   certain level, operations are throttled until everything is back to normal. See
   the `cbclient.properties.dist` for all available options.

   Note that this code should normally not enabled by default, because it
   negatively impacts the throughput and latency against your cluster (which is
   okay if you want the tradeoff in particular situations).

   *Issues* : [JCBC-212](http://www.couchbase.com/issues/browse/JCBC-212)

 * Behind the scenes, property management has been refactored into a centralized
   class. While this doesn't change anything in the first place, all properties
   should now have the `cbclient.` prefix, so that they are picked up
   automatically. As always, when there is a `cbclient.properties` file around in
   the CLASSPATH, it is picked up automatically.

   The only notable difference (for backwards compatibility) is the `viewmode`
   property, which can be used with or without the `cbclient.` prefix.

   *Issues* : [JCBC-211](http://www.couchbase.com/issues/browse/JCBC-211),
   [JCBC-215](http://www.couchbase.com/issues/browse/JCBC-215)

 * Spymemcached has been updated to 2.8.10, which includes a fix that improves
   timeouts during node failure situations.

 * When working with the `ComplexKey` class for view queries, it is now possible to
   use all kinds of numbers (not only doubles).

   *Issues* : [JCBC-190](http://www.couchbase.com/issues/browse/JCBC-190)

**Fixes in 1.1.1**

 * A bug in the reconnection logic has been fixed that would negatively impact the
   reconnect threshold when a node is considered down but a cluster config update
   has not yet reached the client (or the entry node has been failed over/killed).

   Also, possible hanging nodes (that is the socket is open but the process may be
   dead) are now properly detected and should not cause infinited timeouts and
   block the client.

   *Issues* : [JCBC-207](http://www.couchbase.com/issues/browse/JCBC-207),
   [JCBC-134](http://www.couchbase.com/issues/browse/JCBC-134),
   [JCBC-214](http://www.couchbase.com/issues/browse/JCBC-214)

**Known Issues in 1.1.1**

 * The `flush()` command now works over HTTP, but is currently not working because
   of an open issue inside Couchbase Server 2.0 (MB-7381). A workaround is to use
   the ClusterManager with Administrator privileges in the meantime.

   *Issues* : [JCBC-144](http://www.couchbase.com/issues/browse/JCBC-144)

<a id="couchbase-sdk-java-rn_1-1-0f"></a>

## Release Notes for Couchbase Client Library Java 1.1.0 GA (11 December 2012)

The 1.1.0 release adds all features and tools neded to work against Couchbase
Server 2.0 with Java.

This especially includes support for the brand-new view engine. The following
list includes the major features and bugfixes compared to the 1.0.\* releases.
For more detailed release notes, see the developer preview and beta releases.

Also, the [Getting Started
Guide](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/getting-started.html)
and the
[Tutorial](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/tutorial.html)
have been updated and can be used together with the 1.1.0 release.

**New Features and Behaviour Changes in 1.1.0**

 * This release adds the possibility of providing a durability setting that allows
   to make sure data is replicated but not persisted. This may speed up operations
   while allowing to maintain a reasonable safety net at the same time (wait until
   the operation has been replicated to the given number of nodes). Also, every
   command takes either ReplicateTo, PersistTo or both.

   Here is an usage example of an add operation which makes sure to replicate to at
   least one node:

    ```
    // With ReplicateTo only
     client.add("mykey", 0, "value", ReplicateTo.ONE);

     // Identical to this
     client.add("mykey", 0, "value", PersistTo.ZERO, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-119](http://www.couchbase.com/issues/browse/JCBC-119),
   [JCBC-128](http://www.couchbase.com/issues/browse/JCBC-128)

 * Support for spatial view queries has been added to the SDK. Not that at this
   stage, spatial view queries are expermimental and should be treated as such.
   Since spatial queries differ a little bit from classic map/reduce ones, a new
   "bbox" param has been added to the Query object as well to accomodate the needs.
   Note that there has been taken lots of care not to break the current API by
   adding this feature. The main difference to normal map/reduce is to use the
   "getSpatialView" method instead of the "getView" method on the CouchbaseClient
   object. Here is a short example on how to use it:

    ```
    SpatialView view = client.getSpatialView("my_design", "my_spatial_view");
     Query query = new Query();
     ViewResponse response = client.query(view, query);
     for(ViewRow row : response) {
     // Work with bbox data: row.getBbox();
     // Work with geometry data: row.getGeometry();
     // Work with the value: row.getValue();
     }
    ```

   *Issues* : [JCBC-136](http://www.couchbase.com/issues/browse/JCBC-136)

 * ComplexKey querying support has been enhanced and is now more flexible when it
   comes to Long values, nulls and others.

   *Issues* : [JCBC-165](http://www.couchbase.com/issues/browse/JCBC-165),
   [JCBC-167](http://www.couchbase.com/issues/browse/JCBC-167)

 * View Query Timeouts can now be configured through the
   CouchbaseConnectionFactoryBuilder (using the `setViewTimeout()` method).

   *Issues* : [JCBC-168](http://www.couchbase.com/issues/browse/JCBC-168)

 * A new ComplexKey class has ben added as a utility to define view query options.
   This makes it possible to convert Java types into their corresponding JSON
   representations as easy as possible. Also, this avoids the need to encode the
   values by hand to encode them properly. Passing in a string does still work, but
   the ComplexKey approach is recommended when working with arrays or other more
   complex JSON structures.

   Here is a short example on how to use it properly:

    ```
    // JSON Result: 100
     ComplexKey.of(100);

     // JSON Result: "Hello"
     ComplexKey.of("Hello");

     // JSON Result: ["Hello", "World"]
     ComplexKey.of("Hello", "World");

     // JSON Result: [1349360771542,1]
     ComplexKey.of(new Date().getTime(), 1);
    ```

   When querying a view it looks like this:

    ```
    long now = new Date().getTime();
     long tomorrow = now + 86400;
     Query query = new Query();
     query.setRange(ComplexKey.of(now), ComplexKey.of(tomorrow));
     // Converts to: ?startkey=1349362647742&endkey=1349362734142
    ```

   *Issues* : [JCBC-32](http://www.couchbase.com/issues/browse/JCBC-32),
   [JCBC-41](http://www.couchbase.com/issues/browse/JCBC-41)

 * The Views functionality has been added to the Couchbase-client library. Views is
   available starting with Couchbase Server 2.0. For more details on this feature
   refer to [Couchbase Server
   Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

   The purpose of a view is take the structured data stored within your Couchbase
   Server database as JSON documents, extract the fields and information that is
   needed, and to produce an index of the selected information. The result is a
   view on the stored data.

   The view that is created during this process can be iterated, selected and
   queried with the information in the database from the raw data objects that have
   been stored using Java objects such as `View`, `Query`, `ViewFuture`,
   `ViewResponse` and `ViewRow`.

   The following code fragment illustrates how to use the objects and access the
   view.

    ```
    Query query = new Query();

     query.setReduce(false);
     query.setIncludeDocs(true);
     query.setStale(Stale.FALSE);

     // Specify the design and document (by default production mode)
     View view = client.getView("chat", "messages");

     if (view == null) {
     // Take corrective action
     }

     ViewResponse result = client.query(view, query);

     Iterator<ViewRow> itr = result.iterator();
     ViewRow row;

     while (itr.hasNext()) {
     row = itr.next();
     String doc = (String) row.getDocument();
     // Do something for each row
     }
    ```

 * Starting from this beta release, it is now possible to manage design documents
   through the SDK as well. Design documents can be created, loaded and deleted
   through their corresponding methods from the CouchbaseClient class. Use the
   "createDesignDoc()" and "deleteDesignDoc()" methods for creating or deleting
   design documents as a whole. Here is a short example on how to use it:

    ```
    List<ViewDesign> views = new ArrayList<ViewDesign>();
     List<SpatialViewDesign> spviews = new ArrayList<SpatialViewDesign>();

     ViewDesign view1 = new ViewDesign(
     "view1",
     "function(a, b) {}"
     );
     views.add(view1);

     SpatialViewDesign spview = new SpatialViewDesign(
     "spatialfoo",
     "function(map) {}"
     );
     spviews.add(spview);

     DesignDocument doc = new DesignDocument("mydesign", views, spviews);
     Boolean success = client.createDesignDoc(doc);
    ```

   Note that creating design documents may take some time, so make sure to wait
   some time and poll with "getDesignDocument()" to see if it is already correctly
   loaded.

   *Issues* : [JCBC-63](http://www.couchbase.com/issues/browse/JCBC-63)

**Fixes in 1.1.0**

 * When no replicas are defined in the cluster and a node fails (or more nodes fail
   at the same time than replicas are defined), then it is possible that there is
   no single master responsible for a given vbucket. This has been a problem in
   previous tests and is now handled that a RuntimeException is thrown which a
   explanatory message. Since the cluster may now be in a very bad state, it is up
   to the developer at the application level to ensure the correct behavior of the
   following operation (since this may be very different depending on the
   application requirements).

   *Issues* : [JCBC-123](http://www.couchbase.com/issues/browse/JCBC-123)

 * Netty has been upgraded to 3.5.5.

   *Issues* : [JCBC-106](http://www.couchbase.com/issues/browse/JCBC-106)

 * Operation Status message has been changed from hard coded value to be based on
   tunable parameters.

   *Issues* : [JCBC-107](http://www.couchbase.com/issues/browse/JCBC-107)

 * When using memcache-type buckets instead of couchbase-type buckets, the
   reconfiguration should now work as expected. The client previously tried to
   compare the vbuckets all the time, but since memcache-type buckets don't contain
   vbuckets it failed (now only the server nodes themselves are compared).

   *Issues* : [JCBC-35](http://www.couchbase.com/issues/browse/JCBC-35)

**Known Issues in 1.1.0**

 * The `flush()` command now works over HTTP, but is currently not working because
   of an open issue inside Couchbase Server 2.0 (MB-7381). A workaround is to use
   the ClusterManager with Administrator privileges in the meantime.

   *Issues* : [JCBC-144](http://www.couchbase.com/issues/browse/JCBC-144)

<a id="couchbase-sdk-java-rn_1-1-0e"></a>

## Release Notes for Couchbase Client Library Java 1.1-beta Beta (3 December 2012)

**New Features and Behaviour Changes in 1.1-beta**

 * The "delete" command now also supports persitence constraints like set, add,
   replace or CAS do.

    ```
    client.delete("my_key", PersistTo.MASTER, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-162](http://www.couchbase.com/issues/browse/JCBC-162)

 * To assist with better debugging on view queries, a new method on the "Query"
   class, "setDebug(boolean)" has been introduced. When it is set to true, the
   client will log the view results including debug information to the INFO level,
   which is by default turned on. This can be very helpful on debugging misbehaving
   view queries and to provide vital information for support tickets.

   *Issues* : [JCBC-158](http://www.couchbase.com/issues/browse/JCBC-158)

 * The regular view timeout has been increased from 60 to 75 seconds (because the
   server-side view timeout is 60 seconds and now the corresponding timeout on the
   client is slightly higher). It is now possible to configure it through the
   CouchbaseConnectionFactoryBuilder. Use the corresponding "setViewTimeout" method
   on it if you want to change the setting. Note that the lower threshold is set to
   500ms, and it will print a warning if it's lower than 2500ms because this can
   lead to undesired effects in production.

   *Issues* : [JCBC-153](http://www.couchbase.com/issues/browse/JCBC-153)

 * Support for spatial view queries has been added to the SDK. Not that at this
   stage, spatial view queries are expermimental and should be treated as such.
   Since spatial queries differ a little bit from classic map/reduce ones, a new
   "bbox" param has been added to the Query object as well to accomodate the needs.
   Note that there has been taken lots of care not to break the current API by
   adding this feature. The main difference to normal map/reduce is to use the
   "getSpatialView" method instead of the "getView" method on the CouchbaseClient
   object. Here is a short example on how to use it:

    ```
    SpatialView view = client.getSpatialView("my_design", "my_spatial_view");
     Query query = new Query();
     ViewResponse response = client.query(view, query);
     for(ViewRow row : response) {
     // Work with bbox data: row.getBbox();
     // Work with geometry data: row.getGeometry();
     // Work with the value: row.getValue();
     }
    ```

   *Issues* : [JCBC-136](http://www.couchbase.com/issues/browse/JCBC-136)

 * To "fail fast" on observe constraints (when operations like "set" are used with
   PersistTo and/or ReplicateTo), the client now checks if there are enough nodes
   in the cluster to theoretically fulfill the request. This means if
   PersistTo.THREE is used when there are only two nodes in the cluster, the
   operations may succeed but the observation surely fails because the constraint
   can't be fulfilled. In this case, the OperationFuture would return false and the
   message respons with something like this: "Currently, there are less nodes in
   the cluster than required to satisfy the replication/persistence constraint.".
   Keep in mind that replication constraints always require one additional node to
   be fulfilled correctly. So a ReplicateTo.TWO with only two nodes in the cluster
   will fail.

   *Issues* : [JCBC-148](http://www.couchbase.com/issues/browse/JCBC-148)

 * Starting from this beta release, it is now possible to manage design documents
   through the SDK as well. Design documents can be created, loaded and deleted
   through their corresponding methods from the CouchbaseClient class. Use the
   "createDesignDoc()" and "deleteDesignDoc()" methods for creating or deleting
   design documents as a whole. Here is a short example on how to use it:

    ```
    List<ViewDesign> views = new ArrayList<ViewDesign>();
     List<SpatialViewDesign> spviews = new ArrayList<SpatialViewDesign>();

     ViewDesign view1 = new ViewDesign(
     "view1",
     "function(a, b) {}"
     );
     views.add(view1);

     SpatialViewDesign spview = new SpatialViewDesign(
     "spatialfoo",
     "function(map) {}"
     );
     spviews.add(spview);

     DesignDocument doc = new DesignDocument("mydesign", views, spviews);
     Boolean success = client.createDesignDoc(doc);
    ```

   Note that creating design documents may take some time, so make sure to wait
   some time and poll with "getDesignDocument()" to see if it is already correctly
   loaded.

   *Issues* : [JCBC-63](http://www.couchbase.com/issues/browse/JCBC-63)

 * The "getViews" method has been renamed to "getDesignDocument" and the arguments
   have been changed to make it easier to use in combination with
   "createDesignDocument" and "deleteDesignDocument". The method takes the name of
   the design document and returns an instance of a "DesignDocument". This can be
   modified and then passed back to "createDesignDocument" to update it
   accordingly. Here is a quick example:

    ```
    DesignDocument design = client.getDesignDocument("rawdesign");
    design.getName(); // Returns the name of the design document
    design.getViews(); // Contains the stored views
    design.getSpatialViews(); // contains the stored spatial views
    ```

   *Issues* : [JCBC-147](http://www.couchbase.com/issues/browse/JCBC-147)

**Fixes in 1.1-beta**

 * When a view with a defined reduce-function is used, the client now implicitly
   sets "setReduce()" to "true". This behavour is now much more intuitive and also
   irons-out some bugs associated with it.

   *Issues* : [JCBC-150](http://www.couchbase.com/issues/browse/JCBC-150)

 * Pagination support got a lot more attention in the previous weeks and therefore
   some bugs have been ironed out. NullPointerExceptions should not be raised
   anymore. Note that is currently not possible to paginate over reduced or spatial
   results, this will be added in a future release.

   *Issues* : [JCBC-40](http://www.couchbase.com/issues/browse/JCBC-40)

 * When no replicas are defined in the cluster and a node fails (or more nodes fail
   at the same time than replicas are defined), then it is possible that there is
   no single master responsible for a given vbucket. This has been a problem in
   previous tests and is now handled that a RuntimeException is thrown which a
   explanatory message. Since the cluster may now be in a very bad state, it is up
   to the developer at the application level to ensure the correct behavior of the
   following operation (since this may be very different depending on the
   application requirements).

   *Issues* : [JCBC-123](http://www.couchbase.com/issues/browse/JCBC-123)

 * It is now possible to read every kind of included document through views.
   Previously all documents were casted to strings when fetched with
   "setIncludeDocs(true)", which did not allow it to be (for example) serialized
   java objects. This is now possible since those objects are not implicitly casted
   to strings anymore. Note that this only applies to the included documents, view
   results are still interpreted as strings (JSON).

   *Issues* : [JCBC-125](http://www.couchbase.com/issues/browse/JCBC-125)

 * When using memcache-type buckets instead of couchbase-type buckets, the
   reconfiguration should now work as expected. The client previously tried to
   compare the vbuckets all the time, but since memcache-type buckets don't contain
   vbuckets it failed (now only the server nodes themselves are compared).

   *Issues* : [JCBC-35](http://www.couchbase.com/issues/browse/JCBC-35)

 * Additional checkpoints have been added to make sure all ViewConnection threads
   are properly closed during the shutdown phase.

   *Issues* : [JCBC-94](http://www.couchbase.com/issues/browse/JCBC-94)

<a id="couchbase-sdk-java-rn_1-1-0d"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp4 Developer Preview (29 October 2012)

**New Features and Behaviour Changes in 1.1-dp4**

 * It is now possible to create and delete buckets from the client directly,
   without the need to switch to the UI or use the REST API. The functionality is
   provided through the new ClusterManager class. Here is a short example on how to
   use it:

    ```
    // Connect with cluster admin and password
     ClusterManager manager = new ClusterManager(uris, "Administrator", "password");

     // Create a new bucket with authentication
     manager.createSaslBucket(BucketType.COUCHBASE, "saslbucket", 100, 0, "password");

     // Delete the bucket again
     manager.deleteBucket("saslbucket");
    ```

   See the documentation for more details and usage examples.

   *Issues* : [JCBC-64](http://www.couchbase.com/issues/browse/JCBC-64)

 * This release adds the possibility of providing a durability setting that allows
   to make sure data is replicated but not persisted. This may speed up operations
   while allowing to maintain a reasonable safety net at the same time (wait until
   the operation has been replicated to the given number of nodes). Also, every
   command takes either ReplicateTo, PersistTo or both.

   Here is an usage example of an add operation which makes sure to replicate to at
   least one node:

    ```
    // With ReplicateTo only
     client.add("mykey", 0, "value", ReplicateTo.ONE);

     // Identical to this
     client.add("mykey", 0, "value", PersistTo.ZERO, ReplicateTo.ONE);
    ```

   *Issues* : [JCBC-119](http://www.couchbase.com/issues/browse/JCBC-119),
   [JCBC-128](http://www.couchbase.com/issues/browse/JCBC-128)

 * A new ComplexKey class has ben added as a utility to define view query options.
   This makes it possible to convert Java types into their corresponding JSON
   representations as easy as possible. Also, this avoids the need to encode the
   values by hand to encode them properly. Passing in a string does still work, but
   the ComplexKey approach is recommended when working with arrays or other more
   complex JSON structures.

   Here is a short example on how to use it properly:

    ```
    // JSON Result: 100
     ComplexKey.of(100);

     // JSON Result: "Hello"
     ComplexKey.of("Hello");

     // JSON Result: ["Hello", "World"]
     ComplexKey.of("Hello", "World");

     // JSON Result: [1349360771542,1]
     ComplexKey.of(new Date().getTime(), 1);
    ```

   When querying a view it looks like this:

    ```
    long now = new Date().getTime();
     long tomorrow = now + 86400;
     Query query = new Query();
     query.setRange(ComplexKey.of(now), ComplexKey.of(tomorrow));
     // Converts to: ?startkey=1349362647742&endkey=1349362734142
    ```

   *Issues* : [JCBC-32](http://www.couchbase.com/issues/browse/JCBC-32),
   [JCBC-41](http://www.couchbase.com/issues/browse/JCBC-41)

**Fixes in 1.1-dp4**

 * When a HTTP operation is cancelled, it is now ensured that the corresponding
   HTTP request is also cancelled. This prevents a possible issue where the calling
   thread is blocked longer than needed.

   *Issues* : [JCBC-30](http://www.couchbase.com/issues/browse/JCBC-30)

 * The CouchbaseClient now does not try to establish view connections on memcache
   buckets. This makes it possible to connect to memcache buckets on the 1.1 series
   again.

   *Issues* : [JCBC-121](http://www.couchbase.com/issues/browse/JCBC-121)

 * Behind the scenes, the HTTP query parameters for the views are now properly
   encoded. This means that passing characters like spaces don't break view queries
   anymore. This fix also ensures that query parameters generated through
   ComplexKey.of work properly.

   *Issues* : [JCBC-126](http://www.couchbase.com/issues/browse/JCBC-126)

 * The update\_seq param has been removed from the possible Query options because
   it has also been removed from Couchbase Server 2.0 as well.

<a id="couchbase-sdk-java-rn_1-1-0c"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp3 Developer Preview (19 September 2012)

**Fixes in 1.1-dp3**

 * Default Observe poll latency has been changed to 100ms.

   *Issues* : [JCBC-109](http://www.couchbase.com/issues/browse/JCBC-109)

 * The options with Views as documented in
   [http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html)
   is available. The options STOP and CONTINUE can be set as below.

    ```
    query.setOnError(OnError.CONTINUE);
    ```

   *Issues* : [JCBC-25](http://www.couchbase.com/issues/browse/JCBC-25)

 * Netty has been upgraded to 3.5.5.

   *Issues* : [JCBC-106](http://www.couchbase.com/issues/browse/JCBC-106)

 * Operation Status message has been changed from hard coded value to be based on
   tunable parameters.

   *Issues* : [JCBC-107](http://www.couchbase.com/issues/browse/JCBC-107)

**Known Issues in 1.1-dp3**

 * The Paginator object has been changed to handle this. The following code listing
   illustrates how to use the Paginator object and iterate through the pages and
   between the rows.

    ```
    Paginator result = client.paginatedQuery(view, query, 15);

     while (result.hasNext()) {
     ViewResponse response = result.next();
     for (ViewRow row: response) {
     System.out.println("Next Row: " + row.getId());
     }
     System.out.println("<=== Page ====>");
     }
    ```

   *Issues* : [JCBC-40](http://www.couchbase.com/issues/browse/JCBC-40)

<a id="couchbase-sdk-java-rn_1-1-0b"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp2 Developer Preview (23 August 2012)

**New Features and Behaviour Changes in 1.1-dp2**

 * The `set()` and `delete()` methods now support the ability to observe the
   persistence on the master and replicas. Using these methods, it's possible to
   set the persistence requirements for the data on the nodes.

   These methods are supported in Couchbase server build 1554 or higher.

   The persistence requirements can be specified in terms of how the data should be
   persisted on the master and the replicas using `PeristTo` and `ReplicateTo`
   respectively.

   The client library will poll the server until the persistence requirements are
   met. The method will return FALSE if the requirments are impossible to meet
   based on the configuration (inadequate number of replicas) or even after a set
   amount of retries the persistence requirments could not be met.

   The program snippet below illustrates how to specify a requirement that the data
   should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist to all four nodes including master
    OperationFuture<Boolean> setOp =
     c.set("key", 0, "value", PersistTo.FOUR);
    System.out.printf("Result was %b", setOp.get());
    ```

   The program snippet below illustrates how to specify a requirement that the data
   deletion should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist of delete to all four nodes including master
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.FOUR);
    System.out.printf("Result was %b",deleteOp.get());
    ```

   The program snippet below illustrates how to specify a requirement that the data
   deletion should be persisted on 4 nodes (master and three replicas).

    ```
    // Perist of delete to all four nodes including master
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.FOUR);
    System.out.printf("Result was %b",deleteOp.get());
    ```

   The peristence requirements can be specified for both the master and replicas.
   In the case above, it's required that the key and value is persisted on all the
   4 nodes (including replicas).

   The same persistence requirment can be specified in a slightly different form as
   below.

    ```
    // Perist to master and three replicas
    OperationFuture<Boolean> setOp =
     c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", setOp.get());
    ```

   The same persistence requirment can be specified in a slightly different form as
   below.

    ```
    // Perist of delete to master and three replicas
    OperationFuture<Boolean> deleteOp =
     c.delete("key", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", deleteOp.get());
    ```

**Fixes in 1.1-dp2**

 * The Java client library throws exception for non-200 http view responses.

   *Issues* : [JCBC-72](http://www.couchbase.com/issues/browse/JCBC-72)

 * The issue is now fixed.

   *Issues* : [JCBC-20](http://www.couchbase.com/issues/browse/JCBC-20)

 * The Getting Started has a brief explanation of JSON and has a simple example of
   persisting JSON data.

   *Issues* : [JCBC-97](http://www.couchbase.com/issues/browse/JCBC-97)

 * This issue is now fixed.

   *Issues* : [JCBC-68](http://www.couchbase.com/issues/browse/JCBC-68)

 * This issue is now fixed.

   *Issues* : [JCBC-69](http://www.couchbase.com/issues/browse/JCBC-69)

**Known Issues in 1.1-dp2**

 * unlock() method does not check for server errors. The method should check for
   the error and raise an exception.

   *Issues* : [SPY-97](http://www.couchbase.com/issues/browse/SPY-97)

<a id="couchbase-sdk-java-rn_1-1-0a"></a>

## Release Notes for Couchbase Client Library Java 1.1-dp Developer Preview (16 March 2012)

**New Features and Behaviour Changes in 1.1-dp**

 * The Views functionality has been added to the Couchbase-client library. Views is
   available starting with Couchbase Server 2.0. For more details on this feature
   refer to [Couchbase Server
   Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

   The purpose of a view is take the structured data stored within your Couchbase
   Server database as JSON documents, extract the fields and information that is
   needed, and to produce an index of the selected information. The result is a
   view on the stored data.

   The view that is created during this process can be iterated, selected and
   queried with the information in the database from the raw data objects that have
   been stored using Java objects such as `View`, `Query`, `ViewFuture`,
   `ViewResponse` and `ViewRow`.

   The following code fragment illustrates how to use the objects and access the
   view.

    ```
    Query query = new Query();

     query.setReduce(false);
     query.setIncludeDocs(true);
     query.setStale(Stale.FALSE);

     // Specify the design and document (by default production mode)
     View view = client.getView("chat", "messages");

     if (view == null) {
     // Take corrective action
     }

     ViewResponse result = client.query(view, query);

     Iterator<ViewRow> itr = result.iterator();
     ViewRow row;

     while (itr.hasNext()) {
     row = itr.next();
     String doc = (String) row.getDocument();
     // Do something for each row
     }
    ```

**Fixes in 1.1-dp**

 * The `CouchbaseConnectionFactory` which was not being closed properly has been
   fixed. The [TapConnectionProvider
   patch](http://www.couchbase.com/issues/browse/JCBC-16) has been integrated.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.