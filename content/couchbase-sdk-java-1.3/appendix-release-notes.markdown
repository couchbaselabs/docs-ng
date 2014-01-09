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