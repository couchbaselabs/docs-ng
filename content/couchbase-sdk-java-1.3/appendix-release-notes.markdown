# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see the [Couchbase 
Java Issues Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-3-1a"></a>

## Release Notes for Couchbase Client Library Java 1.3.1 GA (14 January 2014)

The 1.3.1 release is the first bugfix release in the 1.3 series. It is a purely bugfix release, fixing a regression introduced in 1.3.0.

**Fixes in 1.3.1 **

* [JCBC-399](http://www.couchbase.com/issues/browse/JCBC-399): When `CouchbaseClient.asyncQuery(...)` is called and a listener is attached
   to the future, it is now only called once instead of twice. This makes sure operations done in the listener are not performed twice without
   any external guards against this in place.

** Known Issues in 1.3.1 **

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higer than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The workaround
here is to set a higher value through the `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-3-0a"></a>

## Release Notes for Couchbase Client Library Java 1.3.0 GA (8 January 2014)

The 1.3.0 release is the first minor release in the 1.3 series. It features a rewrite of the underlying view connection management and provides real asynchronous futures when used in combination with persistence and replication constraints.

**New Features and Behavior Changes in 1.3.0**

<ul>
<li><a href="http://www.couchbase.com/issues/browse/JCBC-388">JCBC-388</a>: The underlying view connection management has been completely rewritten. This has been necessary to both improve run time performance and also be more stable under failure conditions on the server side.

<div class="notebox">
<p>Note</p>
<p>The underlying <code>httpcore</code> and <code>httpcore-nio</code> dependencies have been upgraded to a newer version to facilitate the connection pool mechanisms provided. If you don't use a dependency management tool like Maven, make sure to replace the JARs with the ones provided in the download archive.</p>
</div>

<p>From an application developer perspective, you don't need to make any changes to your codebase (it's completely backward compatible), but some configuration flags have been introduced to make it more configurable:</p>

<ul>
<li><code>CouchbaseConnectionFactoryBuilder.setViewWorkerSize(int workers)</code>: the number of view workers (defaults to 1) can be tuned if a very large numbers of view requests is fired off in parallel.</li>
<li><code>CouchbaseConnectionFactoryBuilder.setViewConnsPerNode(int conns)</code>: the maximum number of parallel open view connections per node in the cluster can be also tuned (defaults to 10).</li>
</ul>

<p>The number of threads needed per <code>CouchbaseClient</code> object has been decreased to a minimum of 2 (one orchestrator and one worker) instead of N (where N is the number of nodes in the cluster).</p>

<p>Because the current codebase now does fewer DNS lookups, it also fixes the long-standing issue reported in <a href"http://www.couchbase.com/issues/browse/JCBC-151">JCBC-151</a>. While the issue is ultimately environmental, the code now helps mitigate the issue as much as possible.</p>

<p>As a result of the upgrade, the <code>ClusterManager</code> class has also been refactored to use the upgraded underlying httpcore(nio) libraries. See <a href="www.couchbase.com/issues/browse/JCBC-390">JCBC-390</a>.</p>
</li>

<li><a href="http://www.couchbase.com/issues/browse/JCBC-361">JCBC-361</a>: Mutating methods with PersistTo/ReplicateTo now do not block unless instructed by the application developer.

<p>Before this change, every overloaded PersistTo/ReplicateTo method did return a OperationFuture, but had to block until the observe condition was done - rendering the future essentially useless. This limitation has now been removed. The underlying codebase utilizes the built-in listeners to listen on the original mutation operation and then be notified on a listener when the operation is complete to do the actual - blocking - observe operation. Since this happens on a separate thread pool, the application itself is not blocked until instructed by the developer.</p>

<p>The main fact to be aware of is that a previously synchronous operation like <code>client.set("key", "value", PersistTo.MASTER)</code> is now non-blocking until <code>get()</code> is called explicitly. To honor the fact that disk-based operations potentially take longer to complete, a new observe time-out has been introduced that is set to 5 seconds by default (instead the 2.5 seconds with normal operations). It is configurable through the newly added <code>CouchbaseConnectionFactoryBuilder.setObsTimeout(long timeout)</code> method.</p>

<p><code>CouchbaseConnectionFactoryBuilder.setObsPollMax(int maxPoll)</code> has been deprecated and is ignored because it can be calculated out of the observe time-out and the still available observe interval settings.</p>
</li>

<li><a href="http://www.couchbase.com/issues/browse/JCBC-396">JCBC-396</a>: The `CouchbaseClient.getDesignDocument` has been renamed to `CouchbaseClient.getDesignDoc` in order to be consistent with the other design document related methods. The old methods have not been removed but marked as deprecated in order to be backwards compatible.</li>

<li><a href="http://www.couchbase.com/issues/browse/JCBC-397">JCBC-397</a>: When instantiating a new <code>CouchbaseClient</code> object, now an INFO-level log message gets printed that shows all configuration settings in effect. This helps greatly when diagnosing issues without turning on debug logging or looking at the code directly.</li>

</ul>

**Fixes in 1.3.0**

* [SPY-149](http://www.couchbase.com/issues/browse/SPY-149): Listeners are now only called after the future has been completed correctly, not when the value was set (or the operation cancelled). This mitigates a potential race condition where the future is technically not completed yet, but the listener has already been called with the future reference.

** Known Issues in 1.3.0 **

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higer than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The workaround
here is to set a higher value through the `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.