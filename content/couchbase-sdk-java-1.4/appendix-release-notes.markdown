# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see the [Couchbase 
Java Issues Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-4-0c"></a>

## Release Notes for Couchbase Client Library Java 1.4.0 GA (?? April 2014)

**New Features and Behavior Changes in 1.4.0**

**Fixes in 1.4.0**

**Known Issues in 1.4.0**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (`PersistTo` or `ReplicateTo`) are used, a custom timeout such as  `.get(1, TimeUnit.MINUTES)` is ignored if it is higher than the default `obsTimeout` setting for the `CouchbaseConnectionFactory` class. The workaround
 is to set a higher value through `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.

<a id="couchbase-sdk-java-rn_1-4-0b"></a>

## Release Notes for Couchbase Client Library Java 1.4.0, Developer Preview 2 (4 April 2014)

The 1.4.0-dp2 release is the second developer preview for the 1.4 series.

**New Features and Behavior Changes in 1.4.0-dp2**

* [JCBC-421](http://www.couchbase.com/issues/browse/JCBC-421): Rewriting the Query internals for better performance.
The <code>Query</code> view object has been rewritten completely for much better performance, removing bottlenecks and allowing much quicker creation (especially if fields with a JSON type are used).

The rewrite is completely transparent to the user, nothing needs to be changed on the application side.
* [JCBC-426](http://www.couchbase.com/issues/browse/JCBC-426): Since Carrier Configuration and/or HTTP are selected automatically, there is now also a way to disable one of the two bootstrap phases manually. This is only exposed through a system property since it is not intended for everyday use. It should only be used when a failure is discovered in the new carrier configuration process and old behaviour needs to be used temporarily.

Either <code>cbclient.disableCarrierBootstrap</code> or <code>cbclient.disableHttpBootstrap</code> can be set to <code>"true"</code> in order to force disabling the bootstrap type. Note that if you disable http bootstrap against clusters < 2.5.0 or if you use memcached bucket types, bootstrapping will fail since they solely rely on the HTTP mechanism.

* [JCBC-436](http://www.couchbase.com/issues/browse/JCBC-436): In some scenarios, it might be needed to specify a larger auth timeout per node. This can be done through the <code>setAuthWaitTime</code> setting in the <code>CouchbaseConnectionFactoryBuilder</code> class (in milliseconds, default is 2500).

* [SPY-156:](http://www.couchbase.com/issues/browse/SPY-156): More (async) mutate methods are exposed, which helps with default settings and expirations. Their sync counterparts have been exposed previously already. The following async methods are now available:

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

* Add development pom.xml: A maven pom file has been added to the source code in order to make it easier to get setup with all the dependencies and therefore making it easier to contribute.

**Fixes in 1.4.0-dp2**

* General fixes and stabilisation around the new carrier publication feature.
* [SPY-158:](http://www.couchbase.com/issues/browse/SPY-158): The "max reconnect delay" on the factory builder incorrectly assumed seconds instead of the advertised milliseconds, leading to wrong reconnect behavior. This is now fixed and works as advertised on the builder.
* [SPY-161:](http://www.couchbase.com/issues/browse/SPY-161): When an operation gets cancelled, now all its "children" get cancelled as well. Children get created if an operation needs to be cloned, for example on "not my vbucket" responses. This avoids the situation where operations are kept around longer than needed because their parent cancellation was never passed to them appropriately.

**Known Issues in 1.4.0-dp2**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higer than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The workaround
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

* [SPY-153](http://www.couchbase.com/issues/browse/SPY-153): A typesafe <code>StatusCode</code> has been added to the <code>OperationStatus</code> instances, which makes it easier to compare responses, instead of having to compare strings which is rather error prone.

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

* [SPY-155](http://www.couchbase.com/issues/browse/SPY-155): A bug has been fixed where future listeners where not notified because of a race condition.

**Known Issues in 1.4.0-dp**

* [JCBC-401](http://www.couchbase.com/issues/browse/JCBC-401): When durability requirements (PersistTo/ReplicateTo) are used, a custom timeout (for example `.get(1, TimeUnit.MINUTES))` is ignored if it is higer than the default `obsTimeout` setting on the `CouchbaseConnectionFactory`. The workaround
here is to set a higher value through the `CouchbaseConnectionFactoryBuilder` and then just use `.get()` or a possibly lower timeout setting.