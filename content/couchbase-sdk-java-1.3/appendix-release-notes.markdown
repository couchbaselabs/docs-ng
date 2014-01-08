# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see the [Couchbase 
Java Issues Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-3-0a"></a>

## Release Notes for Couchbase Client Library Java 1.3.0 GA (8 January 2014)

The 1.3.0 release is the first minor release in the 1.3 series. It features a rewrite of the underlying view connection management and provides real asynchronous futures when used in combination with persistence and replication constraints.

**New Features and Behavior Changes in 1.3.0**

* [JCBC-388](http://www.couchbase.com/issues/browse/JCBC-388): The underlying View connection management has been completely rewritten. This has been necessary to both improve runtime performance and also be more stable under failure conditions on the server side.

**Please note that the underlying httpcore and httpcore-nio dependencies have been upgraded to a newer version in order to facilitate the connection pool mechanisms provided. If you don't use a dependency managemen tool like maven, make sure to replace the jars with the ones provided in the download archive.**

From an application developer perspective, there are no changes needed to the codebase (so it's completely backwards compatible), but some configuration flags have been introduced in order to make it more configurable:

- `CouchbaseConnectionFactoryBuilder.setViewWorkerSize(int workers)`: the number of view workers (defaults to 1) can be tuned if a very large numbers of view requests is fired off in parallel.
- `CouchbaseConnectionFactoryBuilder.setViewConnsPerNode(int conns)`: the maximum number of parallel open view connections per node in the cluster can be also tuned (defaults to 10).

The number of threads needed per `CouchbaseClient` object has been decreased to a minimum of 2 (one orchestrator and one worker) instead of N (where N is the number of nodes in the cluster).

Because the current codebase now does less DNS lookups, it also fixes the long-standing issue as reported in [JCBC-151](http://www.couchbase.com/issues/browse/JCBC-151). While the issue is ultimately environmental, the code now helps to mitigate the issue as much as possible.

As a result of the upgrade, the `ClusterManager` class has also been refactored to use the upgraded underlying httpcore(nio) libraries. See [JCBC-390](http://www.couchbase.com/issues/browse/JCBC-390).

* [JCBC-361](http://www.couchbase.com/issues/browse/JCBC-361): Mutating methods with PersistTo/ReplicateTo now do not block anymore unless instructed by the application developer.

Before this change, every overloaded PersistTo/ReplicateTo method did return a OperationFuture, but had to block until the observe condition was done - rendering the future essentially useless. This limitation has now been removed. The underlying codebase utilizes the built-in listeners to listen on the original mutation operation and then be notified on a listener when the operation is complete to do the actual - blocking - observe operation. Since this happens on a separate thread pool, the application itself is not blocked until instructed by the developer.

The main fact to be aware of is that a previously synchronous operation like `client.set("key", "value", PersistTo.MASTER)` is now non-blocking until `get()` is called explicitly. To honor the fact that disk-based operations potentially take longer to complete, a new "observe timeout" has been introduced that is set to 5 seconds by default (instead the 2.5 seconds with normal operations). It is configurable through the newly added `CouchbaseConnectionFactoryBuilder.setObsTimeout(long timeout)` method.

Note that `CouchbaseConnectionFactoryBuilder.setObsPollMax(int maxPoll)` has been deprecated and is ignored because it can be calculated out of the observe timeout and the still available observe interval settings.

* [JCBC-396](http://www.couchbase.com/issues/browse/JCBC-396): The `CouchbaseClient.getDesignDocument` has been renamed to `CouchbaseClient.getDesignDoc` in order to be consistent with the other design document related methods. The old methods have not been removed but marked as deprecated in order to be backwards compatible.

* [JCBC-397](http://www.couchbase.com/issues/browse/JCBC-397): When instantiating a new `CouchbaseClient` object, now a INFO-level log message gets printed that shows all configuration settings in effect. This helps greatly when diagnosing issues without turning on debug logging or looking at the code directly.

**Fixes in 1.3.0**

* [SPY-149](http://www.couchbase.com/issues/browse/SPY-149): Listeners are now only called after the future has been completed correctly, not when the value was set (or the operation cancelled). This mitigates a potential race condition where the future is technically not completed yet, but the listener has already been called with the future reference.

<a id="couchbase-sdk-java-rn_1-2-3a"></a>

## Release Notes for Couchbase Client Library Java 1.2.3 GA (3 December 2013)

The 1.2.3 release is the third bug fix release for the 1.2 series. It is a
pure bug fix release, increasing the stability of the SDK in various scenarios.

**Fixes in 1.2.3**

 * [SPY-146](http://www.couchbase.com/issues/browse/SPY-146): When using persistence and
   replication constraints (that is, PersistTo and ReplicateTo), together with "special"
   UTF-8 characters that take up 2 bytes instead of one (for example the pound sign or euro sign),
   in 1.2.2 and earlier it doesn't work&dash;a normal set() works, but a set with a constraint
   will lead to a time-out. Now the UTF-8 key is properly encoded for the underlying protocol.

 * [SPY-144](http://www.couchbase.com/issues/browse/SPY-144): During special failure conditions
   on the server side, the callback stack of an operation might grow out
   of bounds. This is now mitigated, improving the general stability of the client.

 * [SPY-136](http://www.couchbase.com/issues/browse/SPY-136): When a node is rebooted and a client
   later than 1.2.1 is used, the SASL (authentication) mechanism list
   might not respond immediately, leading to authentication failures. Now, the client waits
   until a valid responds is returned.

 * [JCBC-380](http://www.couchbase.com/issues/browse/JCBC-380): When Couchbase Server is
   configured with an alternative admin port (not using 8091), the SDK is now aware
   of the change completely and does not force you to use 8091. This is a regression
   fix.

<a id="couchbase-sdk-java-rn_1-2-2a"></a>

## Release Notes for Couchbase Client Library Java 1.2.2 GA (5 November 2013)

The 1.2.2 release is the second bug fix release for the 1.2 series. It has important
fixes for the replica read functionality and in general stabilizes the 1.2 release branch. Couchbase recommends that all 1.2.x users upgrade to the 1.2.2 release.

**New Features and Behavior Changes in 1.2.2**

 * [JCBC-371](http://www.couchbase.com/issues/browse/JCBC-371): In this and a series of
   other changes, the overhead for vBucket objects during rebalance and in general has
   been reduced. During a rebalance process, existing Configurations are reused, leading
   to less garbage collection (especially when more than one `CouchbaseClient` object
   is used). The internal implementation has also been changed to be more memory efficient.

	This change is completely opaque. You just see less memory usage and garbage collector pressure in a profiler during rebalance.

 * [JCBC-369](http://www.couchbase.com/issues/browse/JCBC-369): A small bug in the observe
   logic used for `ReplicateTo` and `PersistTo` operations has been fixed, but more
   importantly, the performance has been improved. The constant time for an operation that
   uses persistence or replication constraints has been reduced by exactly one observe interval,
   which defaults to 10&nbsp;ms.

	Previously, the loop waited an interval at the end, even when the result was already
   correctly fetched. For applications making heavy use of `PersistTo` and `ReplicateTo`,
   this should be a good performance enhancement. Also make sure to use Couchbase Server
   version 2.2 to benefit from server-side optimizations in that area.
   

**Fixes in 1.2.2**

 * [JCBC-373](http://www.couchbase.com/issues/browse/JCBC-373), 
   [JCBC-374](http://www.couchbase.com/issues/browse/JCBC-374): In a series of changes, the stability and performance of replica read operations has been greatly improved. The code now also multicasts to the active node, increasing the chance that a replica read operation returns successfully, even when a replica node goes down. Also, thread-safety issues have been fixed and the actual calls are optimized to go only to the nodes that can (based on the configuration) answer such a get request.

 * [JCBC-368](http://www.couchbase.com/issues/browse/JCBC-368): During bootstrap, a deadlock with the [Netty](http://netty.io) IO provider has been resolved. Now, the deadlock is avoided and an exception is thrown to indicate what went wrong during streaming connection setup.

 * [JCBC-375](http://www.couchbase.com/issues/browse/JCBC-375): In some cases, when a 
   streaming connection was dropped because of a race condition, the new connection
   could not be established. This change fixes the condition and makes sure there is
   always a valid state.

 * [SPY-141](http://www.couchbase.com/issues/browse/SPY-141): Wrong assertions  that would incorrectly throw an exception when a negative CAS value 
   is received have 
   been removed. Because this is a valid CAS identifier, the assumption can lead to false 
   positives.
 
 * [SPY-140](http://www.couchbase.com/issues/browse/SPY-140): The correct queue is now 
   used for the listener callbacks. Previously, the underlying queue was bounded and
   therefore threw exceptions in the wrong places (the IO thread). Because the number
   of threads is bounded, the queue needs to buffer incoming listener callbacks accordingly.

<a id="couchbase-sdk-java-rn_1-2-1a"></a>

## Release Notes for Couchbase Client Library Java 1.2.1 GA (11 October 2013)

The 1.2.1 release is the first bug fix release for the 1.2 series. It fixes some
issues for newly added features in 1.2.0. Couchbase recommends that all 1.2.0 users upgrade to the 1.2.1 release. 

**New Features and Behavior Changes in 1.2.1**

 * [SPY-135](http://www.couchbase.com/issues/browse/SPY-135): In addition to the 
   exposed synchronous CAS with expiration methods, the asynchronous
   overloaded method is also exposed.

   ```java
   OperationFuture<CASResponse> casFuture = client.asyncCAS(key, future.getCas(), 2, value);
   ```

**Fixes in 1.2.1**

 * [SPY-137](http://www.couchbase.com/issues/browse/SPY-137): If the `ExecutorService` was not
   overridden through the factory, it is now properly shut down on `client.shutdown()`. This is
   not the case in 1.2.0, which results in some threads still running and preventing the app
   from halting completely.
 * [SPY-138](http://www.couchbase.com/issues/browse/SPY-138): The default `ExecutorService`
   can now be overridden properly through the `setListenerExecutorService(ExecutorService executorService)`
   method.

   If you override the default `ExecutorService`, you are also responsible for shutting it down properly 
   afterward. Because it can be shared across many application scopes, the CouchbaseClient cannot shut it down on your behalf.

   ```java
   CouchbaseConnectionFactoryBuilder builder = new CouchbaseConnectionFactoryBuilder();
   ExecutorService service = Executors.newFixedThreadPool(1);
   CouchbaseConnectionFactory cf = builder.buildCouchbaseConnection(/*...*/);
   ```
 * [JCBC-366](http://www.couchbase.com/issues/browse/JCBC-366): Enabling metrics is now easier and works as originally designed. Now you can just enable it through the builder and do not need to set the property also.

   ```java
   CouchbaseConnectionFactoryBuilder builder = new CouchbaseConnectionFactoryBuilder();
   builder.setEnableMetrics(MetricType.DEBUG);
   CouchbaseConnectionFactory cf = builder.buildCouchbaseConnection();
   ```

<a id="couchbase-sdk-java-rn_1-2-0a"></a>

## Release Notes for Couchbase Client Library Java 1.2.0 GA (13 September 2013)

The 1.2.0 release is the first stable release of the 1.2 series and contains new features that are backward compatible. The underlying spymemcached library, which builds the foundation for many of those features, has been upgraded to 2.10.0.


**New Features and Behavior Changes in 1.2.0**

 * The JARs are now served from the Maven Central Repository, which required a change of the `groupId` element from `couchbase` to `com.couchbase.client`. You can find a list of packages
   at <http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22couchbase-client%22>.
 * Spymemcached has been upgraded to 2.10.0, which implements most of the
   required code for the new features.
 * [JCBC-346](http://www.couchbase.com/issues/browse/JCBC-346): Couchbase Server 2.2 supports
   a new authentication mechanism (SASL CRAM-MD5), which is now supported and automatically
   detected/used by the client as well. You can still force the old one (`PLAIN`) if needed, 
   but this should not be the case in general.
 * [JCBC-347](http://www.couchbase.com/issues/browse/JCBC-347): The default `observe` poll interval
   has been decreased from 100 ms to 10 ms, which should give better performance in most cases. Also, this aligns with replication performance improvements in the Couchbase Server 2.2 release. 
 * [JCBC-138](http://www.couchbase.com/issues/browse/JCBC-138): The SDK now properly replaces the
   node list passed in on bootstrap, randomizes it, and stores it. This means that when the streaming
   connection goes down, the full last known node list can be used to reestablish the streaming
   connection. Randomizing the node list better distributes the streaming connection throughout
   the cluster, so not always the first and same node will be used.
 * [JCBC-343](http://www.couchbase.com/issues/browse/JCBC-343): In addition to blocking on the future
   or polling its status, you can now add a listener to be notified after it is completed. The
   callback is executed in a thread pool autonomously. Every future provides a `addListener()`
   method where a anonymous class that acts as a callback can be passed in. Here is an example:

   ```java
   OperationFuture<Boolean> setOp = client.set("setWithCallback", 0, "content");

   setOp.addListener(new OperationCompletionListener() {
     @Override
     public void onComplete(OperationFuture<?> f) throws Exception {
       System.out.println("I was completed!");
     }
   };
   ```
 * [JCBC-330](http://www.couchbase.com/issues/browse/JCBC-330): To make it easier to supply a new
   time-out when using the CAS operations, there are now overloaded methods provided to add a custom
   time-out. See the API documentation for details.
 * [JCBC-280](http://www.couchbase.com/issues/browse/JCBC-280): Buckets can now not only be created and deleted, but also updated directly through the SDK.
 * [JCBC-344](http://www.couchbase.com/issues/browse/JCBC-344): For easier administration and
   configuration purposes, you can now create a `CouchbaseConnectionFactory` based on system properties.
   Here is an example (the properties can be set through a file as well):

   ```java
   System.setProperty("cbclient.nodes", "http://192.168.1.1:8091/pools;192.168.1.2");
   System.setProperty("cbclient.bucket", "default");
   System.setProperty("cbclient.password", "");

   CouchbaseConnectionFactory factory = new CouchbaseConnectionFactory();
   CouchbaseClient client = new CouchbaseClient(factory);
   ```

   If you need to customize options, the `CouchbaseConnectionFactoryBuilder`  class provides a new method to
   construct a factory like this. The instantiation fails if any of the three properties are missing.

**Fixes in 1.2.0**
  	
 * [JCBC-333](http://www.couchbase.com/issues/browse/JCBC-333): When view nodes are queried and they are in a state in which they don't contain active vBuckets
   (partitions), an error might be returned. This fix ensures that the node is avoided while it is in this state (during rebalance in/out conditions).
 * [JCBC-349](http://www.couchbase.com/issues/browse/JCBC-349): Because of a regression, the
   `flush` command did not work on memcached-buckets since 1.1.9. This is now fixed.
 * [JCBC-350](http://www.couchbase.com/issues/browse/JCBC-350): A race condition when loading 
   documents from a replica has been fixed so that NPEs are no longer thrown.
 * [JCBC-351](http://www.couchbase.com/issues/browse/JCBC-351): Replica read has been hardened
   in a way that it also loads the document from the active node and silently discards replicas
   that are not in an active state. It only returns an exception if not a single replica read
   operation could be dispatched.
