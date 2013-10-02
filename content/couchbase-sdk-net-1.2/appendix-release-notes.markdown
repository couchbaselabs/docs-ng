# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library.NET. To browse or submit new issaues, see [Couchbase
Client Library.NET Issues Tracker](http://www.couchbase.com/issues/browse/NCBC).

<a id="couchbase-sdk-net-rn_1-2-8a"></a>

## Release Note for Couchbase Client Library.NET 1.2.8 GA (01 October 2013)

.NET Couchbase Client 1.2.8 release is a fixes the following issues:

* NCBC-301: added a new StatusCode enumeration for unifying client and server
status results of operations across all clients. This also fixes a bug where
socket time-out messages on the client were not returned with the operation
result.
* NCBC-250: unit test improvements.
* NCBC-257: Improvements to ensure that Disposed objects do not make it through 
to the finalization phase of garbage collection. This should improve issues with
socket time-outs and generally improve client stability and performance.

<a id="couchbase-sdk-net-rn_1-2-6a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.6 GA (07 May 2013)

.NET Couchbase Client 1.2.6 fixes an issue where the 1.2.5 NuGet package
contained an unsigned Enyim.Caching assembly (3.5 only). The 4.0 NuGet package
was not affected.

<a id="couchbase-sdk-net-rn_1-2-5a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.5 GA (07 May 2013)

.NET Couchbase Client 1.2.5 removes the RestSharp and Hammock dependencies, adds
support for.NET 3.5, along with new features and bug fixes.

**New Features and Behaviour Changes in 1.2.5**

 * NCBC-231: Support for Unlock without CAS operation

    ```
    var lockResult = client.ExecuteGetWithLock("key", TimeSpan.FromSeconds(20));

     var storeResult = client.ExecuteStore(StoreMode.Set, "key", "new value");
     Assert.That(storeResult.Success, Is.False);

     var unlockResult = client.ExecuteUnlock("key"); //unlock before the timeout
     //may also use Boolean form (e.g., var boolVal = client.Unlock("key");
     Assert.That(unlockResult.Success, Is.True);

     var storeResult2 = client.ExecuteStore(StoreMode.Set, "key", "another new value");
     Assert.That(storeResult.Success, Is.True);
    ```

 * The logging assemblies are now available via separate NuGet pacakges, which
   reference NLog and log4net via NuGet, instead of local assemblies. See
   CouchbaseLog4NetAdapter and CouchbaseNLogAdapater on NuGet.

 * NCBC-254: JSON extensions should default to ignore Id property on
   add/replace/set. This change allows for compatibility with the generic view
   queries, which map the key to an Id property.

    ```
    var thing = new Thing { Id = key, SomeProperty = "Foo", SomeOtherProperty = 17 };
     var result = _Client.StoreJson(StoreMode.Set, key, thing);
     Assert.That(result, Is.True);

     //An "Id" property will be removed from the stored JSON
     var obj = _Client.Get<string>(key);
     Assert.That(obj, Is.Not.StringContaining("\"id\""));

     //GetJson will automatically assign the key to an Id property
     var savedThing = _Client.GetJson<Thing>(key);
     Assert.That(savedThing.Id, Is.StringContaining(key));
    ```

 * NCBC-246: The.NET Client Library is now code compatible with the.NET Framework
   version 3.5. The NuGet package and release zip file contain both 4.0 and 3.5
   assemblies. The solution (see GitHub) now includes a Couchbase.Net35 project.

 * NCBC-247: RestSharp and Hammock are no longer dependencies of the Couchbase.NET
   Client Library.

   No change should be necessary, unless using explicit RestSharp or Hammock
   configuration for the HttpClientFactory. If not, the default configuration will
   use the new HttpClientFactory, which relies only on WebClient. In 1.2.4, the
   default HttpClientFactory relied on RestSharp.

   RestSharp and Hammock will be usable via a separate NuGet project, or from the
   Couchbase.HttpClients project (via GitHub). These assemblies will not be signed,
   to avoid collisions with a custom RestSharp, which is unsigned.

**Fixes in 1.2.5**

 * NCBC-256: Throw exception when lock expiry exceeds server limit (30 seconds)

    ```
    try {
     var lockResult = client.ExecuteGetWithLock("key", TimeSpan.FromSeconds(40));
     } catch (ArgumentOutOfRangeException ex) {
     //handle exception
     }
    ```

<a id="couchbase-sdk-net-rn_1-2-4a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.4 GA (02 April 2013)

.NET Couchbase Client 1.2.4 adds support for Get with Lock feature, along with
bug fixes.

**New Features and Behaviour Changes in 1.2.4**

 * NCBC-238: Support for key exists check without getting value.

   Observe is used behind the scenes to support the check. `KeyExists` method
   checks that key is either in `FoundPersisted` or `FoundNotPersisted` state on
   master node.

    ```
    var exists = client.KeyExists("foo");
    ```

 * NCBC-231: Support for Get with Lock

    ```
    var lockResult = client.ExecuteGetWithLock("key", TimeSpan.FromSeconds(30));
     var storeResult = client.ExecuteStore(StoreMode.Set, "key", "new value");
     Assert.That(storeResult.Success, Is.False);
     Assert.That(storeResult.StatusCode.Value, Is.EqualTo((int)StatusCodeEnums.DataExistsForKey));

     //or
     var getLockResultA = client.ExecuteGetWithLock("key");
     var getLockResultB = client.ExecuteGetWithLock("key");
     Assert.That(getLockResultB.StatusCode, Is.EqualTo((int)CouchbaseStatusCodeEnums.LockError));
    ```

**Fixes in 1.2.4**

 * NCBC-239: Fix to set `RestSharpHttpClient.Timeout` property correctly. Was
   previously being set to `TimeSpan.Milliseconds` instead of total
   `TimeSpan.Milliseconds`.

 * NCBC-243: Fix to fail store operations when `PersistTo` or `ReplicateTo`
   durability requirements could not be satisfied by number of online nodes.

<a id="couchbase-sdk-net-rn_1-2-3a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.3 GA (08 March 2013)

.NET Couchbase Client 1.2.3 GA addresses an invalid strong name issue with
Enyim.Caching in release 1.2.2.

<a id="couchbase-sdk-net-rn_1-2-2a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.2 GA (05 March 2013)

.NET Couchbase Client 1.2.2 GA provides stability fixes and new API methods.

**New Features and Behaviour Changes in 1.2.2**

 * NCBC-229: Support Remove with CAS operation.

    ```
    var getResult = client.ExecuteGet("key");
     var removeResult = client.ExecuteRemove("key", getResult.Cas);
    ```

**Fixes in 1.2.2**

 * NCBC-234: Fix to include CAS on return of ExecuteGetJson extension method.

 * NCBC-228: Fix for concurrency issues during rebalance lead to frequent
   PooledSocket errors.

**Known Issues in 1.2.2**

 * The 1.2.2 release contains an Enyim.Caching assembly with an invalid strong
   name.

<a id="couchbase-sdk-net-rn_1-2-1a"></a>

## Release Notes for Couchbase Client Library.NET 1.2.1 GA (05 February 2013)

.NET Couchbase Client 1.2.1 GA provides stability fixes and new API methods.

**New Features and Behaviour Changes in 1.2.1**

 * NCBC-165: IView now includes a `CheckExists` method, which will allow callers to
   verifiy that a view exists in a design document prior to executing a view query.
   This method will perform an HTTP request to get the design document contents.

    ```
    var view = client.GetView("cities", "by_name");

     if (view.CheckExists())
     {
     foreach(var item in view)
     {
     //do something
     }
     }
    ```

 * NCBC-179: Additional JSON extensions are now available. For each Store or
   ExecuteStore method in the `ICouchbaseClient` API, there is now a corresponding
   JSON method. These additions include methods for CAS and expiry overloads. An
   `ExecuteGetJson` method has also been provided. Note these methods are
   intentionally not included in the `ICouchbaseClient` interface as they are
   explicitly tied to Newtonsoft.Json and its default serialization rules.

    ```
    //store
     var city = new City { Name = "Hartford", State = "CT", Type = "city" };
     var result = client.ExecuteStoreJson(StoreMode.Set, "city_Hartford_CT", city, DateTime.Now.AddMinutes(30));
     //get
     var otherCity = client.ExecuteGetJson<City>("city_Bridgeport_CT");
    ```

 * NCBC-159: Support for getting debug info from views.

    ```
    var view = client.GetView("cities", "by_name").Debug(true);
     view.Count(); //need to execute the query to get debug info
     var local = view.DebugInfo["local"]; //DebugInfo is a dictionary
    ```

 * NCBC-190: `CouchbaseCluster` now has method FlushBucket. Creating buckets with
   flush enabled is also supported.

    ```
    var cluster = new CouchbaseCluster(config);
     cluster.CreateBucket(new Bucket
     {
     Name = "transaction",
     AuthType = AuthTypes.Sasl,
     BucketType = BucketTypes.Membase,
     Quota = new Quota { RAM = 100 },
     ReplicaNumber = ReplicaNumbers.Zero,
     FlushOption = FlushOptions.Enabled
     });
     //and flushing
     cluster.FlushBucket("transaction");
    ```

**Fixes in 1.2.1**

 * NCBC-166: The `DefaultKeyTransformer` no longer forbids chars 0x00-0x20 and
   space. To provide support for legacy Memcached key rules, the
   `LegacyMemcachedKeyTransformer` may be used.

    ```
    <keyTransformer type="Enyim.Caching.Memcached.LegacyMemcachedKeyTransformer, Enyim.Caching" />
    ```

 * NCBC-189: Fix to NRE when ExecuteIncrement or ExecuteDecrement returned null
   `StatusCode`.

 * NCBC-195: NRE no longer thrown when client cannot locate a node on which to
   execute a view. The lack of available nodes is logged in the debug log and an
   InvalidOperationException is intentionally raised. NCBC-222: is tracking a 1.2.2
   fix for an improved exception type.

 * NCBC-172: 1.2.0 Hammock dependency was throwing a null reference exception when
   executing a view query against an offline node. The 1.2.1 release replaces
   Hammock with RestSharp for view execution. Hammock is still supported, but
   RestSharp is the new default. If Hammock is explicitly configured, then Hammock
   will still be used for view execution. RestSharp is the suggested view REST
   library. To ensure RestSharp is in use, App|Web.config must not contain snippet
   below. If configured in code, the HttpClientFactory should not be set.

    ```
    <httpClientFactory type="Couchbase.HammockHttpClientFactory, Couchbase" />
    ```

 * NCBC-197: When 0 bytes are received on sockets, but read was valid, Enyim client
   was throwing an exception with the message "?." A descriptive exception message
   is now included.

 * NCBC-192: NRE was being thrown when executing ops against a down node. NRE was
   also the symptom displayed when app client configuration was incorrect. Ops
   against a bad node should now return the message "Unable to locate node" when
   using the `IOperationResult` methods. There is a constant for this error.

    ```
    var result = client.ExecuteGet("somekey");
    if (! result.Success && result.Message == ClientErrors.FAILURE_NODE_NOT_FOUND)
    {
     //couldn't reach the node, check config if first run of app
    }
    ```

 * NCBC-212: `ExecuteRemove` is no longer swallowing status codes on errors.
   `StatusCode` property was always null previously on errors.

**Known Issues in 1.2.1**

 * NCBC-223: Mono support not included for 1.2.1.
   ServicePointManager.SetTcpKeepAlive is not supported by Mono. A 1.2.0 build was
   released with this call removed, however a better solution should be in place
   for 1.2.2.

<a id="couchbase-sdk-net-rn_1-2-0g"></a>

## Release Notes for Couchbase Client Library.NET 1.2.0 GA (12 December 2012)

Couchbase Client 1.2 GA is the first GA release to support Couchbase Server 2.0.
1.2 is backwards compatible with Couchbase Server 1.8.

In addition to support for new features of Couchbase Server 2.0, the
Couchbase.NET Client Library 1.2 adds stability improvements to iteself and its
dependent Enyim.Caching library.

The Couchbase.NET Client Library 1.2 requires the.NET Framework 4.0 or higher.

**Fixes in 1.2.0**

 * NCBC-168: Socket errors were previously being swallowed and did not bubble up
   through ExecuteXXX method return values.

 * NCBC-161: Run views only on nodes in cluster supporting couchApiBase (Couchbase
   nodes)

**Known Issues in 1.2.0**

 * NCBC-172: During a rebalance or fail over, view queries may result in an
   unhandled NullReferenceException. This exception is raised by a thread in the
   dependency Hammock.

 * NCBC-170: If an exception occurs before data are read, the PooledSocket may be
   returned to the pool marked still alive and with a dirty buffer. In some
   situations, a wrong magic value error may result.

 * NCBC-176: Flushing of buckets is not yet supported in Couchbase.Management API

<a id="couchbase-sdk-net-rn_1-2-0f"></a>

## Release Notes for Couchbase Client Library.NET 1.2.0-BETA-3 Beta (28 November 2012)

**New Features and Behaviour Changes in 1.2.0-BETA-3**

 * New CouchbaseCluster GetItemCount method (NCBC-92)

 * View timeout is now configuragble (NCBC-158)

 * Implemented remove with observe (NCBC-163)

 * ListBucket object graph now matches full server JSON (NCBC-142)

 * New UpdateBucket method on CouchbaseCluster (NCBC-143)

 * ICouchbaseClient interface completed to match CouchbaseClient public methods
   (NCBC-151)

 * Auto-map Id property to "id" field in view rows on generic view queries
   (NCBC-154)

 * Debug now supported as view parameter (NCBC-159)

 * Add support to build under Mono (NCBC-132)

 * (Experimental) support for spatial views (NCBC-47).

 * New CouchbaseCluster GetBucket and TryGetBucket methods to get single bucket
   (NCBC-72)

**Fixes in 1.2.0-BETA-3**

 * ExecuteGet no longer reports "failed to locate node" on cache misses (NCBC-130)

 * Don't swallow pooled socket errors (NCBC-168)

 * View requests are now made to a randomly selected node from cluster (NCBC-146)

 * Observe reliability fixes (NCBC-129, NCBC-128, NCBC-124, NCBC-127)

 * Failed bootstrap node no longer puts client in invalid state (NCBC-134).

 * Null reference exceptions now longer (occasionally) thrown during rebalancing.

 * Updated Enyim submodule reference to latest commit (NCBC-167)

 * Pre-fetch views to cache network pools for view requests (NCBC-149)

 * Client now handles correctly -1 vbucket indexes in cluster config (NCBC-148)

 * Null reference exceptions now longer (occasionally) thrown during rebalancing
   (NCBC-121).

 * HTTP and connection timeouts are now separate (NCBC-34)

 * Deleted keys return null during generic view queries with non-stale iterations
   (NCBC-157)

 * Delete bucket handles 500 error from server (NCBC-119)

 * No longer disposing Timer in heartbeat check when it's disabled (NCBC-136)

**Known Issues in 1.2.0-BETA-3**

 * Delete bucket request succeeds but exception is thrown.

<a id="couchbase-sdk-net-rn_1-2-0d"></a>

## Release Notes for Couchbase Client Library.NET 1.2.0-DP4 Alpha (27 August 2012)

**New Features and Behaviour Changes in 1.2.0-DP4**

 * New bucket administration methods

    ```
    var cluster = new CouchbaseCluster("couchbase"); //name of config section with credentials
     cluster.CreateBucket(new Bucket { ... });
     var buckets = cluster.ListBuckets();
     cluster.DeleteBucket();
    ```

 * New, basic JSON conversion extension methods for serializing objects to and from
   JSON. Methods use Newtonsoft.Json for JSON conversions.

    ```
    using Couchbase.Extensions;
     var result = client.StoreJson<Beer>(StoreMode.Set, "foo", new Beer { ... });
     var beer = client.GetJson<Beer>("foo");
    ```

 * 1.2.0 specific configuration elements (HttpClientFactory and
   DocumentNameTransformer) now have defaults and 1.1 configuration will work with
   1.2.0.

    ```
    using Couchbase.Extensions;
     var result = client.StoreJson<Beer>(StoreMode.Set, "foo", new Beer { ... });
     var beer = client.GetJson<Beer>("foo");
    ```

 * New design document administration methods

    ```
    var cluster = new CouchbaseCluster("couchbase"); //name of config section with credentials
     cluster.CreateDesignDocument("bucketname", "{ ... }");
     var designDoc = cluster.RetrieveDesignDocument("bucketname", "designdocname");
     cluster.DeleteDesignDocument("bucketname", "designdocname");
    ```

**Fixes in 1.2.0-DP4**

 * Observe tests no longer fail on multi-node persistence/replication checks.

<a id="couchbase-sdk-net-rn_1-2-0c"></a>

## Release Notes for Couchbase Client Library.NET 1.2.0-DP3 Alpha (27 August 2012)

**New Features and Behaviour Changes in 1.2.0-DP3**

 * Initial implementation of Observe and Store with durability checks.

    ```
    //check for master persistence
     var result = client.ExecuteStore(StoreMode.Set, "foo", "bar", PersistTo.One);

     //check for master persistence with replication to 2 nodes
     var result = client.ExecuteStore(StoreMode.Set, "foo", "bar", PersistTo.One, ReplicateTo.Two);
    ```

**Known Issues in 1.2.0-DP3**

 * Multi-node persistence/replication checks fail sporadically on observe.

<a id="couchbase-sdk-net-rn_1-2-0b"></a>

## Release Notes for Couchbase Client Library.NET 1.2.0-DP2 Alpha (25 July 2012)

**Fixes in 1.2.0-DP2**

 * Generic view requests no longer emitting the original document as value. Client
   Get method is used instead to retrieve original document.

 * Reduced views no longer break from missing "id" field in row.

 * Paging no longer breaks.

 * DevelopmentModeNameTransformer now correctly prepends dev\_ on view requests.

<a id="couchbase-sdk-net-rn_1-2-0a"></a>

## Release Notes for Couchbase Client Library.NET 1.2-DP Alpha (27 March 2012)

**New Features and Behaviour Changes in 1.2-DP**

 * Initial support for Couchbase Server 2.0 view API.

    ```
    var view = client.GetView("designdoc", "viewname");
     foreach(var item in view)
     {
     Console.WriteLine(item.ItemId);
     }
    ```

 * Couchbase.dll is now compiled against the.NET Framework 4.0

<a id="licenses"></a>
