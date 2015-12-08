# Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see the [Couchbase 
Java Issues Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-4-11a"></a>

## Release Notes for Couchbase Client Library Java 1.4.11 GA (7 December 2015)

This is the 11th release for the 1.4 series and brings additional APIs which have been left out before.

* [JCBC-881](http://www.couchbase.com/issues/browse/JCBC-881): When durability requirements are specified on mutation methods, it is now possible to also pass in a custom transcoder.

<a id="couchbase-sdk-java-rn_1-4-10a"></a>

## Release Notes for Couchbase Client Library Java 1.4.10 GA (7 August 2015)

This is the tenth bug fix release for the 1.4 series and brings correctness and stability improvements during failure scenarios for both couchbase and memcached buckets.

* [JCBC-816](http://www.couchbase.com/issues/browse/JCBC-816): The reconfiguration (which includes grabbing a new config and applying it to the system) has been made more resilient during edge-cases. Those edge-cases include close to no load, as well as full cluster (all nodes) restarts. In the first case the heuristics have been improved to practively pick up a new configuration more quickly, and in the second case the code has been made more resilient to consecutive failed attempts for grabbing a new configuration.

* [JCBC-770](http://www.couchbase.com/issues/browse/JCBC-770): A bug has been fixed where memcached buckets did fail to pick up a new configuration when the original streaming connection was teared down.

<a id="couchbase-sdk-java-rn_1-4-9a"></a>

## Release Notes for Couchbase Client Library Java 1.4.9 GA (3 April 2015)

This is the ninth bug fix release for the 1.4 series and brings correctness and stability improvements.

* [JCBC-738](http://www.couchbase.com/issues/browse/JCBC-738): The possibility of a `ClassCastException` has been eliminated when a `HttpFuture` is used and a timeout is happening. This type of future is also returned when a view request is made.

* [JCBC-741](http://www.couchbase.com/issues/browse/JCBC-741): The active node is now always included in an `observe` call (internally used with durability requirements like `ReplicateTo` and `PersistTo`) to reliably discover concurrent modifications. Previously, when only `ReplicateTo` was used and the same document was modified concurrently the operation would just time out. Now it fails quickly and reports the failure case in the operation status. This behavior is now consistent with the one when `PersistTo` is also included in the durability requirement.

* [SPY-183](http://www.couchbase.com/issues/browse/SPY-183): The touch operation is now properly cloned, which previously led to false timeouts during rebalance and unavailable node scenarios (only on the touch operation).


<a id="couchbase-sdk-java-rn_1-4-8a"></a>

## Release Notes for Couchbase Client Library Java 1.4.8 GA (2 March 2015)

This is the eighth bug fix release for the 1.4 series and brings one for PersistTo/ReplicateTo future status flags.

* [JCBC-700](http://www.couchbase.com/issues/browse/JCBC-700): The "done" variable was not properly set when a  `observe` future was
already correctly completed. This impacts the user when a callback on the `PersistTo/ReplicateTo` overloaded methods is used and/or
the `isDone()` method is called. Other futures are not affected.

<a id="couchbase-sdk-java-rn_1-4-7a"></a>

## Release Notes for Couchbase Client Library Java 1.4.7 GA (19 January 2015)

This is the seventh bug fix release for the 1.4 series and most importantly brings stability improvements when the carrier configuration node dies silently.

* [JCBC-681](http://www.couchbase.com/issues/browse/JCBC-681): When the node where the carrier configuration is fetched from silently dies (that is, without closing the socket proactively), the SDK now provides better heuristics to detect it is not responding anymore. In this new approach, the regular NOOP poll interval is piggybacked and open requests are tracked. If more than 3 responses are not coming back with a successful response, a configuration rebootstrap in the background is initiated. Because the poll cycles are 5 second intervals, this will most likely happen 15 seconds after the first missing heartbeat. The rebootstrap cycle is transparent to the application, so no changes need to be made.

* [SPY-181](http://www.couchbase.com/issues/browse/SPY-181): GetAndLock operations are now properly cloned, which fixes the issue of those operations occasionally timing out during bootstrap,  rebalance, or failover.

* [JCBC-647](http://www.couchbase.com/issues/browse/JCBC-647), [SPY-182](http://www.couchbase.com/issues/browse/SPY-182): Two messages that misleadingly reported at WARN level have been removed because they do not actually
report an unstable condition. One of them is the `handling node not set` message reported when an operation needs to be cloned, and the other one is related
to `PersistTo` and `ReplicateTo`, which are now more clever about selecting the proper nodes to fan out and do not trigger a warning message.

<a id="couchbase-sdk-java-rn_1-4-6a"></a>

## Release Notes for Couchbase Client Library Java 1.4.6 GA (1 December 2014)

This is the sixth bug fix release for the 1.4 series and brings one critical reconnect bug fix and a regression fix for non-Oracle JVMs introduced in 1.4.5.

**Fixes in 1.4.6**

* [SPY-179](http://www.couchbase.com/issues/browse/SPY-179): A wrong reconnect delay ceiling was applied, leading to very long reconnect delays when the node in question was down for a longer time. The fix applied now correctly translates the "max reconnect time" and applies the proper ceiling. This allows the client to recover much quicker when a node has been down for a longer time.

* [JCBC-620](http://www.couchbase.com/issues/browse/JCBC-620): The newly introduced diagnostics feature optionally uses some private packages that might not be available in all environments. This prevented startup in unsupported environments because the class loader would complain immediately. Proper guards are now in place to conditionally use the feature when available and gracefully degrade if not.

* [SPY-178](http://www.couchbase.com/issues/browse/SPY-178): When memcached buckets are used and the `KetamaNodeLocator` method is accessed directly, the `getReadonlyCopy` method was subject to iterator failures when used in combination with the `-XX:+AggressiveOpts` JVM flag.

<a id="couchbase-sdk-java-rn_1-4-5a"></a>

## Release Notes for Couchbase Client Library Java 1.4.5 GA (16 October 2014)

This is the fifth bug fix release for the 1.4 series and brings stability improvements for configuration management and optional diagnostics.

**Enhancements in 1.4.5**

* [JCBC-531](http://www.couchbase.com/issues/browse/JCBC-531): Optional support for diagnostics has been added. When DEBUG logging is enabled, very verbose diagnostics information about the runtime will be logged on startup. In addition, a manual call to `Diagnostics.collectAndFormat()` can be used to print run time information in failure cases or during error handling scenarios (for better analysis afterwards). Information also includes GC pauses, heap statistics and version information. Every single property is utilized through MXBeans internally.

**Fixes in 1.4.5**

* [JCBC-566](http://www.couchbase.com/issues/browse/JCBC-566): Under certain conditions, a scheduled configuration update was not performed, leaving the client with an outdated configuration - this has been fixed.
* [JCBC-567](http://www.couchbase.com/issues/browse/JCBC-567): On a complete fresh config reload, the new code makes sure that carrier publication always is tried first, regardless if the HTTP fallback was used first.

<a id="couchbase-sdk-java-rn_1-4-4a"></a>

## Release Notes for Couchbase Client Library Java 1.4.4 GA (5 August 2014)

This is the fourth bug fix release for the 1.4 series and provides general stability improvements and bug fixes. Users seeing intermittent view errors or experiencing client hangs on full cluster restarts are encouraged to upgrade.

**Enhancements in 1.4.4**

* [JCBC-490](http://www.couchbase.com/issues/browse/JCBC-490): Unparsable JSON content for View results is now logged with an error so that it is easier
to debug and analyze.

**Fixes in 1.4.4**

* [JCBC-488](http://www.couchbase.com/issues/browse/JCBC-488): If view operations are (transparently) retried, this change makes sure that authorization and host headers are replaced instead of appended. This fixes the scenario where the same header is added multiple times, leading to view errors because the server is not able to handle that request.
* [JCBC-464](http://www.couchbase.com/issues/browse/JCBC-464): In case of a full rebootstrap (which is the case for full cluster restarts), the code now makes sure that no old configurations are around that change the bootstrap process a little bit and cause unexpected exceptions. Now every try to rebootstrap looks the same, making the code easier to reason about and fixing NullPointerException in some cases.
* [JCBC-505](http://www.couchbase.com/issues/browse/JCBC-505): The View Query object experienced a concurrency issue because a regular expression matcher was reset instead of recreated (which is not thread safe). In most cases this is not a problem because the Query object is created and used from only one thread, but if used through the Paginator and/or shared across threads this can lead to exceptions in the matcher logic. This is now fixed.
* [JCBC-503](http://www.couchbase.com/issues/browse/JCBC-503): During shutdown, internally observers were not released for the configuration logic, possibly leading to memory leaks during operations like application redeployment because the memory could not be freed after shutdown.

<a id="couchbase-sdk-java-rn_1-4-3a"></a>

## Release Notes for Couchbase Client Library Java 1.4.3 GA (1 July 2014)

This is the third bug fix release for the 1.4 series and provides important bug fixes if you are using replica reads and the new carrier publication mechanism. It also includes a heap memory optimization for larger get responses.

**Enhancements in 1.4.3**

* [SPY-175](http://www.couchbase.com/issues/browse/SPY-175): The memory usage for get responses with payloads has been reduced, which will be more noticeable on the heap with larger payloads and higher traffic.

**Fixes in 1.4.3**

* [JCBC-480](http://www.couchbase.com/issues/browse/JCBC-480), [JCBC-482](http://www.couchbase.com/issues/browse/JCBC-482): Replica reads (`getFromReplica`, `getsFromReplica` and their async variants) are now reacting properly during certain failure conditions (when the document on the replica does not exist). In addition, an important bug with `getsFromReplica` has been fixed to make sure it gets scheduled appropriately to target the replica nodes.

* [JCBC-477](http://www.couchbase.com/issues/browse/JCBC-477): Before this change, the bulk get, which is used internally when `setIncludeDocs` is set 
to true, was not supplied with the timeout used for the view request
itself. This is normally not an issue because key-value operations are much
quicker than the default view timeout. In certain scenarios it can come
up, so the timeout is now properly passed down.

* [JCBC-476](http://www.couchbase.com/issues/browse/JCBC-476): The `Node expected to receive data is inactive` log message has been changed to the INFO level and contains a clearer message of what is reflected underneath. It now says that the operation is queued properly, will be retried and the SDK checks for a new configuration eventually.

* [JCBC-475](http://www.couchbase.com/issues/browse/JCBC-475): The configuration management (especially with the carrier mode and during shutdown) has been reworked a little and hardened so it reacts better during node restarts and in the shutdown process of the SDK (to avoid running threads after shutdown).

**Known Issues in 1.4.3**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (`PersistTo` or `ReplicateTo`) are used, a custom timeout such as  `.get(1, TimeUnit.MINUTES)` is ignored if it is higher than the default `obsTimeout` setting for the `CouchbaseConnectionFactory` class. The work-around
 is to set a higher value through `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-2a"></a>

## Release Notes for Couchbase Client Library Java 1.4.2 GA (5 June 2014)

The 1.4.2 release is the second bug fix release for the 1.4 series. It fixes very important issues found on the 1.4 branch, so all users running on 1.4.0 or 1.4.1 should upgrade.

**Fixes in 1.4.2**

 * [JCBC-460](http://www.couchbase.com/issues/browse/JCBC-460): A bug has been fixed where 
pushed configurations with replica-vbucket changes only did not count as significant 
and got discarded. This can be an issue if persistence or replication constraints are used 
since config changes might not be picked up correctly.

* [SPY-170](http://www.couchbase.com/issues/browse/SPY-170): A concurrency issue has been 
fixed in `StringUtils.isJSONObject()`, which could lead to false negatives when validating 
in a concurrent environment.

* [JCBC-463, SPY-171](http://www.couchbase.com/issues/browse/JCBC-463): There have been 
some changes made which help with hardening the shutdown procedure in general and making 
it more fault tolerant. The code now makes sure to also shut down the JCBC-opened resources 
even if shutting down the spy I/O thread fails. Also, the spy I/O thread now always sets 
running to false, which makes it terminate even if something goes wrong during the shutdown 
phase (preventing it from being active).

* [JCBC-424, SPY-172](http://www.couchbase.com/issues/browse/JCBC-424): The NIO selector 
is now woken up manually if no load is going through, giving the Java client a chance 
to perform tasks. One of the currently implemented tasks is sending a NOOP broadcast if the 
last write is longer behind than 5 seconds. This helps to discover broken channels if no 
load is going through and also prevents restrictive firewalls from timing out the connections 
prematurely.

* [JCBC-413](http://www.couchbase.com/issues/browse/JCBC-413): A race condition has been 
fixed in the ClusterManager, now making sure that the consumer is notified once the result 
is set properly.

* [JCBC-359, JCBC-408, JCBC-409](http://www.couchbase.com/issues/browse/JCBC-359): The API documentation (Javadoc) has been enhanced in various places, most notably in the `CouchbaseConnectionFactoryBuilder` class.
 
* [JCBC-461](http://www.couchbase.com/issues/browse/JCBC-461): Since only one streaming 
connection can be open, the number of Netty worker threads has been limited to 1, reducing the 
risk of opening more threads than needed in failure cases.

**Known Issues in 1.4.2**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (`PersistTo` or `ReplicateTo`) are used, a custom timeout such as  `.get(1, TimeUnit.MINUTES)` is ignored if it is higher than the default `obsTimeout` setting for the `CouchbaseConnectionFactory` class. The work-around
 is to set a higher value through `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-1a"></a>

## Release Notes for Couchbase Client Library Java 1.4.1 GA (8 May 2014)

The 1.4.1 release is the first bug fix release for the 1.4 series. It fixes very important issues found on the 1.4 branch, so all users running on 1.4.0 should upgrade.

**Fixes in 1.4.1**

* [SPY-163](http://www.couchbase.com/issues/browse/SPY-163): A deadlock has been fixed in the `asyncGetBulk` method (which is also facilitated by the view querying mechanism if `setIncludeDocs(true)` is used) that happened when an empty list of keys is passed in. This can happen also if a view request does not return results, so the empty list is passed down the stack, resulting in a thread that does not respond.

* [SPY-167](http://www.couchbase.com/issues/browse/SPY-167): A deadlock has been fixed that occasionally comes up as a race condition between adding a listener and notifying the already subscribed listeners. The behavior also has been cleared up so that a listener is notified only once.

* [JCBC-453](http://www.couchbase.com/issues/browse/JCBC-453), [JCBC-457](http://www.couchbase.com/issues/browse/JCBC-457): Faster configuration fetching under certain conditions (if the new carrier configuration mechanism is used) if the cluster is unstable.

* [SPY-164](http://www.couchbase.com/issues/browse/SPY-164), [SPY-166](http://www.couchbase.com/issues/browse/SPY-166), [SPY-169](http://www.couchbase.com/issues/browse/SPY-169): Increased robustness when cloning (redistributing/retrying) operations.

* [SPY-162](http://www.couchbase.com/issues/browse/SPY-162): If a custom Nagle setting has been set through the builder, it is now also applied if a node gets reconnected after a socket close/service interruption.

* [SPY-168](http://www.couchbase.com/issues/browse/SPY-168): The utility method `isJsonObject` has been hardened to perform a null and empty string check before doing regular expression and string matching. This should prevent regex exceptions on specific JDK versions.

**Known Issues in 1.4.1**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (`PersistTo` or `ReplicateTo`) are used, a custom timeout such as  `.get(1, TimeUnit.MINUTES)` is ignored if it is higher than the default `obsTimeout` setting for the `CouchbaseConnectionFactory` class. The work-around
 is to set a higher value through `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-0c"></a>

## Release Notes for Couchbase Client Library Java 1.4.0 GA (15 April 2014)

The 1.4.0 release is the first production-ready release for the 1.4 series.

Here are some of the highlights of the 1.4.0 release. For more specific information, read the release notes for Developer Preview 1 and Developer Preview 2.

* Transparent, optimized connection management (support for Couchbase Server 2.5+ carrier publication feature)
* The total number of view rows are exposed on the `ViewResult`.
* (Async)ReplicaRead methods have been added that also return the CAS value in addition to the document itself.
* Additional asynchronous mutation methods have been exposed (increment and decrement with expiration and default).
* Type-safe status codes on the `OperationStatus` make it easier to check for error and success states.
* Authentication timeouts are now customizable, and the error handling is much better around redistribution during authentication.
* A development pom.xml has been added to make it easier to contribute.

**Known Issues in 1.4.0**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (`PersistTo` or `ReplicateTo`) are used, a custom timeout such as  `.get(1, TimeUnit.MINUTES)` is ignored if it is higher than the default `obsTimeout` setting for the `CouchbaseConnectionFactory` class. The workaround
 is to set a higher value through `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-0b"></a>

## Release Notes for Couchbase Client Library Java 1.4.0, Developer Preview 2 (4 April 2014)

The 1.4.0-dp2 release is the second developer preview for the 1.4 series.

**New Features and Behavior Changes in 1.4.0-dp2**

* [JCBC-421](http://www.couchbase.com/issues/browse/JCBC-421): Rewriting the Query internals for better performance.
The <code>Query</code> view object has been rewritten completely for much better performance, removing bottlenecks and allowing much quicker creation (especially if fields with a JSON type are used). The rewrite is completely transparent to the user, nothing needs to be changed on the application side.

* [JCBC-426](http://www.couchbase.com/issues/browse/JCBC-426): Since Carrier Configuration and/or HTTP are selected automatically, there is now also a way to disable one of the two bootstrap phases manually. This is only exposed through a system property since it is not intended for everyday use. It should only be used when a failure is discovered in the new carrier configuration process and old behaviour needs to be used temporarily.

Either <code>cbclient.disableCarrierBootstrap</code> or <code>cbclient.disableHttpBootstrap</code> can be set to <code>"true"</code> to force disabling the bootstrap type. If you disable HTTP bootstrap against clusters < 2.5.0 or if you use memcached bucket types, bootstrapping will fail because they solely rely on the HTTP mechanism.

* [JCBC-436](http://www.couchbase.com/issues/browse/JCBC-436): In some scenarios, you might need to specify a larger auth timeout per node. This can be done through the <code>setAuthWaitTime</code> setting in the <code>CouchbaseConnectionFactoryBuilder</code> class (in milliseconds, default is 2500).

* [SPY-156](http://www.couchbase.com/issues/browse/SPY-156): More (async) mutate methods are exposed, which helps with default settings and expirations. Their sync counterparts have been exposed previously already. The following async methods are now available:

```java
Future<Long> asyncIncr(String key, long by, long def);
Future<Long> asyncIncr(String key, int by, long def);
Future<Long> asyncIncr(String key, long by, long def, int exp);
Future<Long> asyncIncr(String key, int by, long def, int exp);

Future<Long> asyncDecr(String key, long by, long def);
Future<Long> asyncDecr(String key, int by, long def);
Future<Long> asyncDecr(String key, long by, long def, int exp);
Future<Long> asyncDecr(String key, int by, long def, int exp);
```

* Add development pom.xml: A maven pom file has been added to the source code to make it easier to get set up with all the dependencies and therefore making it easier to contribute.

**Fixes in 1.4.0-dp2**

* General fixes and stabilization around the new carrier publication feature.
* [SPY-158](http://www.couchbase.com/issues/browse/SPY-158): The "max reconnect delay" on the factory builder incorrectly assumed seconds instead of the advertised milliseconds, leading to wrong reconnect behavior. This is now fixed and works as advertised on the builder.
* [SPY-161](http://www.couchbase.com/issues/browse/SPY-161): When an operation gets cancelled, now all its "children" get cancelled as well. Children get created if an operation needs to be cloned, for example on "not my vbucket" responses. This avoids the situation where operations are kept around longer than needed because their parent cancellation was never passed to them appropriately.

**Known Issues in 1.4.0-dp2**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higher than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The workaround
here is to set a higher value through the `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-0a"></a>

## Release Notes for Couchbase Client Library Java 1.4.0, Developer Preview 1 (25 February 2014)

The 1.4.0-dp release is the first developer preview for the 1.4 series.

**New Features and Behavior Changes in 1.4.0-dp**

* [JCBC-337](http://www.couchbase.com/issues/browse/JCBC-337): Adding support for Carrier Configuration to the Java SDK.
Carrier Configuration allows to fetch the cluster configuration over the
binary protocol, removing the need for the HTTP streaming configuration on
couchbase buckets. This only works in combination with Couchbase Server 2.5.0
and forward, otherwise - transparently - HTTP will still be used.

Note that if the cluster gets upgraded from < 2.5.0 to 2.5.0, HTTP will still be used on the client side. After a restart, Carrier Configuration will be picked up automatically.

From a configuration perspective, nothing needs to be changed on the application side, it will be automatically picked up if supported on the server side.

* [JCBC-417](http://www.couchbase.com/issues/browse/JCBC-417): Replica support
with the CAS value has been added.

The client now exposes the <code>(async)GetsFromReplica</code> methods, which work exactly like the <code>(async)GetFromReplica</code>, aside that they expose the <code>CasValue</code> instead of the object directly.

* [JCBC-240](http://www.couchbase.com/issues/browse/JCBC-240): The total number of rows returned for a View has been added to the <code>ViewResponse</code>.

The <code>#getTotalRows</code> method exposes the total number of rows, which may be a superset of the rows returned (because the result has been filtered for one reason or another). Note that if used together with pagination (or any other "state imposing" mechanism), keep in mind that the total rows can change if the view itself changes.

* [SPY-153](http://www.couchbase.com/issues/browse/SPY-153): A type-safe <code>StatusCode</code> has been added to the <code>OperationStatus</code> instances, which makes it easier to compare responses, instead of having to compare strings which is rather error prone.

Here is a usage example:

```java
OperationFuture<Boolean> set = client.set("statusCode1", 0, "value");
set.get();
assertEquals(StatusCode.SUCCESS, set.getStatus().getStatusCode());

GetFuture<Object> get = client.asyncGet("statusCode1");
get.get();
assertEquals(StatusCode.SUCCESS, get.getStatus().getStatusCode());

OperationFuture<Boolean> add = client.add("statusCode1", 0, "value2");
add.get();
assertEquals(StatusCode.ERR_EXISTS, add.getStatus().getStatusCode());
```

See the client documentation for a full list of status codes that can be returned in various situations.

**Fixes in 1.4.0-dp**

* [SPY-155](http://www.couchbase.com/issues/browse/SPY-155): A bug has been fixed where future listeners were not notified because of a race condition.

**Known Issues in 1.4.0-dp**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higer than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The work-around
here is to set a higher value through the `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.
