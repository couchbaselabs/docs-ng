# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library .NET. To browse or submit new issues, see [Couchbase
Client Library .NET Issues Tracker](http://www.couchbase.com/issues/browse/NCBC).

## Release Notes for Couchbase Client Library .NET 1.3.3 GA (4 February 2014)

<a id="couchbase-sdk-net-rn_1-3-3"></a>

* <a href="http://www.couchbase.com/issues/browse/NCBC-381">Ensure that Nuget installs Newtonsoft.NET 4.5.11</a>

    If this is not specified in the .nuspec file, Nuget will attempt to
    install the lastest version 6.0.0 which is not compatible with view
    calls using 1.3.2 version of the Couchbase .NET SDK. These incompatible
    issues will be resolved in a future release, likely 1.3.3.

* <a href="http://www.couchbase.com/issues/browse/NCBC-380">NCBC-380: Filtering on Compound Key with '+' Char Fails</a>
 
    This fix adds methods for enabling URL encoding of HTTP request parameters when
    making view requests. This allows for queries against keys that contain
    special characters by ensuring that they are properly encoded.

* <a href="http://www.couchbase.com/issues/browse/NCBC-360">NCBC-360: Default connection timeout improperly set in SocketPoolConfiguration.cs</a>

    This fixes a bug where the default connection timeout property was set incorrectly in the 1.3.0 release.

* <a href="http://www.couchbase.com/issues/browse/NCBC-357">NCBC-357: Set TCP keep-alives on Connections</a>

    Enables TCP keep-alives on socket connections.

* <a href="http://www.couchbase.com/issues/browse/NCBC-358">NCBC-358: Sort nodes to reduce number server config changes</a>

    When a server configuration update is signaled, the `GetHashCode()` method compares the new configuration and the previous configuration to determine whether it needs to recreate the connection pool because the cluster has changed on the server. In some cases the only change is to the order of the nodes. This fix orders the node list before doing the comparison so that only significant changes result in a connection pool reconfiguration.

* <a href="http://www.couchbase.com/issues/browse/NCBC-368">NCBC-368: Randomize Bootstrap Node</a>

    Randomizes the selection of the bootstrap node so that all clients do not
    use the same node, which can cause "stampeding herd" and lopsided resource
    utilization in large clusters or when a cluster supports a large number of
    clients. This ensures that bootstrapping is evenly distributed over all of the
    URLs in the configured bootstrap list. The first 'good' node is
    chosen as a bootstrapper.

* <a href="http://www.couchbase.com/issues/browse/NCBC-369">NCBC-369: ObjectDisposedException is not handled in PerformMultiGet</a>

    Handles a case where an uncaught exception can cause the host process to fail.

* <a href="http://www.couchbase.com/issues/browse/NCBC-359">NCBC-359 Allows Serializer customization</a>

    This patch allows serializer customization by placing a static field
    on `CouchbaseClientExtensions.JsonSerializerSettings` that enables users of
    the couchbase extension class to customize the serializer.

* <a href="http://www.couchbase.com/issues/browse/NCBC-375">NCBC-375: preferring IPv4 address</a>

    If you configure Couchbase Server with a host name instead of an IP address 
    (IPv4 because you can't enter an IPv6 address via the Couchbase Web Console), the 
    .NET client library refuses the connection. This fix ensures that the IPv4 address 
    is chosen over the IPv6 address when a connection is made.

* <a href="http://www.couchbase.com/issues/browse/NCBC-361">NCBC-361: Refactor Unit Test Project</a>

    General improvements to the `Couchbase.Tests` project. This is an ongoing effort.

* <a href="http://www.couchbase.com/issues/browse/NCBC-373">NCBC-373: .NET GetJSON operation throws System.ArgumentNullException</a>

    Handle the case where a key is accessed without a value for a view.

## Release Notes for Couchbase Client Library .NET 1.3.1 GA (7 January 2014)

.NET Couchbase Client 1.3.1 is largely a maintenance release and includes the following features and fixes:

<a id="couchbase-sdk-net-rn_1-3-1"></a>

* <a href="http://www.couchbase.com/issues/browse/NCBC-334">NCBC-334: Add a post-merge git hook for updating the assembly version:</a>

    This commit adds a git post-merge hook that runs after a pull by our build process, assuming that the remote repo has changes. It uses git-describe to get the latest revision since the last tag and includes the current SHA1. It then updates a **Version.txt** file and the `AssemblyInfo.cs` class with this information in the `AssemblyInformationalVersion` attribute. A future enhancement will update the AssemblyVersion and AssemblyFileVersion, add the git log (release notes) for the current release as an embedded resource, and expose a public method to access it.

* <a href="http://www.couchbase.com/issues/browse/NCBC-327">NCBC-327: Update Nuspec files to current VS Solution Configuration:</a>

    Previously, the projects in the solution would use NuGet (in some cases) to handle internal references instead of simple using project-to-project references. This caused various versioning issues. This commit changes the Nuspec files so that they only reference the NuGet dependencies from NuGet and not when doing local builds.

* <a href="http://www.couchbase.com/issues/browse/NCBC-341">NCBC-341: AOOR when deserializing bootstrap config with empty 'pools' element:</a>

    During certain times, such as a rebalance, when a config contains an empty `pools` element, it causes an `ArgumentOutOfRangeException` to be thrown. This changes the logic to check for this case and throw a `BootstrapConfigurationException` instead.

* <a href="http://www.couchbase.com/issues/browse/NCBC-337">NCBC-337: Fix for 'View vquery was mapped to a dead node, failing.' errors:</a>

    When a config update occurs, the client might receive a configuration with nodes with a 'status' of 'warmup', in this state the 'couchbaseApiBase' is not returned. This puts the client in a state where a client node might not have an IHttpClient to execute the view request again, thus the request fails. This commit adds a check to ensure that the node is 'valid' by checking for nodes where the IHttpClient is not null.

* <a href="http://www.couchbase.com/issues/browse/NCBC-352">NCBC-352: Flag all Increment/Decrement methods with CAS params as 'Obsolete':</a>

    Some of the Increment and Decrement methods in the Enyim libraries have parameters for CAS values, this commit flags those methods as obsolete and they may be removed in future versions of the .NET SDK. The reason that they are being flagged as obsolete is because Increment/Decrement are atomic operations on the server, thus making the CAS parameter redundant. Furthermore, testing indicates that they do not work as expected.

* <a href="http://www.couchbase.com/issues/browse/NCBC-353">NCBC-353: Add node IP to error messages so that users can isolate issues easier:</a>

    This changes the format of the error message returned from the IOperationResult.Message so that it is easier to track and resolve issues with various nodes in the cluster.
Property. 
<div class="notebox">
<p>Note</p>
<p>Clients that depend on the former message format might break:</p>
<ul>
<li>Former: 'Queue Timeout'</li>
<li>Latter: 'Queue Timeout - 127.0.0.1'</li>
</ul>
<p>Please adjust accordingly when upgrading to this version of the .NET SDK
</p>
</div>

* <a href="http://www.couchbase.com/issues/browse/NCBC-345">NCBC-345: Update Readme.mdown to reflect changes in the Couchbase .NET SDK versioning policy:</a>

    For versioning, we use the [Semantic Versioning 2.0](http://http://semver.org) model. All officially released binaries use the following convention for version numbers: MAJOR.MINOR.PATCH. For example, 1.2.9 is a patch release and 1.3.0 is a minor release. We occasionally provide snapshots of mid-iteration bug fixes for validation purposes. For snapshot releases we add another segment to the version number: MAJOR.MINOR.PATCH.SNAPSHOT, where SNAPSHOT is a number starting at 5000 that is 
    incremented with each build. For example, 1.3.0.5000 is a snapshot release. Snapshot builds are not thoroughly tested or supported in any way&mdash;user beware! 

* <a href="http://www.couchbase.com/issues/browse/NCBC-344">NCBC-344: NotImplementedException when storing against MemcachedClient in v1.3 client:</a>

    Fixes a regression bug for people using our fork of the MemcachedClient API. Couchbase strongly recommends using the CouchbaseClient for reasons such as this.

* <a href="http://www.couchbase.com/issues/browse/NCBC-289">NCBC-289: Does not return errors object on exception:</a>

    An exception is thrown when an error is detected for all view error cases. For the next version (2.x) of the client, we will make a decision on how we want the client to behave when an error is encountered when processing a view. This commit makes it consistent across all error cases and does not change the interface, which would likely impact users by requiring them to change their code to check an error property for failures.

    This commit also adds additional unit tests and refactors the `CouchbaseViewHandler` class so that we can pass streams that contain text resembling errors returned from the server into the `ReadResponse` method.

## Release Notes for Couchbase Client Library .NET 1.3.0 GA (3 December 2013)

.NET Couchbase Client 1.3.0 includes the following features and fixes:

* <a href="https://www.couchbase.com/issues/browse/NCBC-310">NCBC-310: Refactor Connection Pool:</a>

	Refactor the CouchbaseNode class so it depends upon a different
	implementation of the internal socket pool that utilizes a queue structure
	instead of the stack-based implementation used by MemcachedClient. The
	PooledSocket now has a new interface, IPooledSocket, with CouchbaseClient
	and MemcachedClient having separate implementations. These
	changes impact only CouchbaseClient instances—MemcachedClient instances
	still use the older implementation. 


    The benefits of this include:
    + More efficient resource allocation and management especially during a rebalance scenario
    + Elimination of some threading issues related to race conditions and other reentrancy problems
    + Better structure and code organization, improved unit tests and testability
    + Improved overall extensibility of certain components such as pools and socket wrappers.     
&nbsp;

* <a href="http://www.couchbase.com/issues/browse/NCBC-325">NCBC-325: MemcachedClient.ExecuteGet(IEnumerable<string> keys) is not returning any error code on connection error </a>

    Method MemcachedClient.ExecuteGet(IEnumerable<string> keys) of .NET SDK retunrs an empty dictionary when none of the specified keys were found. The same result is returned on connection error. So it is not possible to distinguish between these two cases and it's not possible to find what went wrong. 
* <a href="http://www.couchbase.com/issues/browse/NCBC-333">NCBC-333: reference cleanup when SocketPool is Disposed</a>

    If the client is terminated without calling dispose, a NullReferenceException for the SocketPool class might be thrown. This ensures that the reference is not null before dereferencing it.

* <a href="http://www.couchbase.com/issues/browse/NCBC-331">NCBC-331: Change queueTimeout default from 100ms to 2500ms</a>

    The default value for queueTimeout is currently 100 ms, which is extremely low and will unnecessarily cause queue time-out exceptions. This will increase the queueTimeout to 2.5 seconds, which is still a relatively low amount. Note that this only affects threads waiting on the SocketPool for a socket, not the actual time it takes to execute an operation. 

* <a href="http://www.couchbase.com/issues/browse/NCBC-329">NCBC-329: Ensure IOperationResult returns StatusCode on failure.</a>

    Many of the operations on failure do not return a StatusCode in their IOperationResult resturn values. This fixes most of these cases. 

* <a href="http://www.couchbase.com/issues/browse/NCBC-318">NCBC-318: Status Code list contains duplicate value</a>

    StatusCode.UnknownCommand is now 0x0081.

* <a href="http://www.couchbase.com/issues/browse/NCBC-324">NCBC-324: ExecuteGet(string key, DateTime newExpiration) returns unexpected result codes</a>

* <a href="http://www.couchbase.com/issues/browse/NCBC-309">NCBC-309: Move .NET API documentation from docs repo to auto-doc </a>

    The first step in changing the client documentation involves adding XML comments to each public method. In later releases, client documentation will be generated from the XML comments.

* <a href="https://www.couchbase.com/issues/browse/NCBC-299">NCBC-299: Fix project references:</a>

	Changes in the dependencies in the GitHub repository so that Couchbase.Log4NetAdapter
	and other projects that use NuGet do so only for 3rd party dependencies. All dependencies
	between Couchbase libraries are now via project references and the NuGet packages point
	to the latest Couchbase Client build.

* <a href="https://www.couchbase.com/issues/browse/NCBC-316">NCBC-316: Allow GetJson to support the retrieval of arrays and lists:</a>

	Adds support to the CouchbaseClientExtensions.GetJson(...) methods to 
	handle the deserialization of arrays and lists of objects and not 
	just individual objects.

* <a href="https://www.couchbase.com/issues/browse/NCBC-306">NCBC-306: .NET GetJSON operation throws null reference exception:</a>

	Add support for null values persisted for a key via the 
	CouchbaseClientExtensions.GetJson(...) method. This method no 
	longer throws a NullReferenceException when the value store for 
	key is null and instead just returns null.

* <a href="https://www.couchbase.com/issues/browse/NCBC-293">NCBC-293: Enhance Couchbase.Client.Multiget(..) to allow getting details on missing items:</a>

	Multiget now returns information for every operation (for example, success or failure).

<div class="notebox">
<p>Note</p>
<p>Due to this change, you might need to modify the way you handle the object returned by multiget. Previously, multiget only returned successful operations. In this release, both failed and successful operations are returned in the results.</p>
</div>

* <a href="https://www.couchbase.com/issues/browse/NCBC-317">NCBC-317: Mark Sync operations as obsolete:</a>

	The CouchbaseClient.Sync(...) operations have been deprecated and will 
	not be supported. They will be removed in future releases of the .NET 
	client. The functionality has been superseded by the CouchbaseClient.Observe(...)
	methods and the PersistTo and ReplicateTo parameters.


	Adds XML comments to all public methods of the Couchbase.Client class. 
	The future API documentation will be based on these XML comments.


<a id="couchbase-sdk-net-rn_1-2-9a"></a>

## Release Notes for Couchbase Client Library .NET 1.2.9 GA (04 October 2013)

.NET Couchbase Client 1.2.9 is a follow up release to 1.2.8 
and fixes the following issue:

* NCBC-308: KeyExists does not release socket pool if not found.

<a id="couchbase-sdk-net-rn_1-2-8a"></a>

## Release Notes for Couchbase Client Library .NET 1.2.8 GA (01 October 2013)

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

## Release Notes for Couchbase Client Library .NET 1.2.6 GA (07 May 2013)

.NET Couchbase Client 1.2.6 fixes an issue where the 1.2.5 NuGet package
contained an unsigned Enyim.Caching assembly (3.5 only). The 4.0 NuGet package
was not affected.

<a id="couchbase-sdk-net-rn_1-2-5a"></a>

## Release Notes for Couchbase Client Library .NET 1.2.5 GA (07 May 2013)

.NET Couchbase Client 1.2.5 removes the RestSharp and Hammock dependencies, adds
support for.NET 3.5, along with new features and bug fixes.

**New Features and Behavior Changes in 1.2.5**

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

 * NCBC-246: The.NET Client Library is now code compatible with the .NET Framework
   version 3.5. The NuGet package and release zip file contain both 4.0 and 3.5
   assemblies. The solution (see GitHub) now includes a Couchbase .Net35 project.

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

## Release Notes for Couchbase Client Library .NET 1.2.4 GA (02 April 2013)

.NET Couchbase Client 1.2.4 adds support for Get with Lock feature, along with
bug fixes.

**New Features and Behavior Changes in 1.2.4**

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

## Release Notes for Couchbase Client Library .NET 1.2.3 GA (08 March 2013)

.NET Couchbase Client 1.2.3 GA addresses an invalid strong name issue with
Enyim.Caching in release 1.2.2.

<a id="couchbase-sdk-net-rn_1-2-2a"></a>

## Release Notes for Couchbase Client Library .NET 1.2.2 GA (05 March 2013)

.NET Couchbase Client 1.2.2 GA provides stability fixes and new API methods.

**New Features and Behavior Changes in 1.2.2**

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

## Release Notes for Couchbase Client Library .NET 1.2.1 GA (05 February 2013)

.NET Couchbase Client 1.2.1 GA provides stability fixes and new API methods.

**New Features and Behavior Changes in 1.2.1**

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

## Release Notes for Couchbase Client Library .NET 1.2.0 GA (12 December 2012)

Couchbase Client 1.2 GA is the first GA release to support Couchbase Server 2.0.
1.2 is backwards compatible with Couchbase Server 1.8.

In addition to support for new features of Couchbase Server 2.0, the
Couchbase .NET Client Library 1.2 adds stability improvements to iteself and its
dependent Enyim.Caching library.

The Couchbase .NET Client Library 1.2 requires the .NET Framework 4.0 or higher.

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

## Release Notes for Couchbase Client Library .NET 1.2.0-BETA-3 Beta (28 November 2012)

**New Features and Behavior Changes in 1.2.0-BETA-3**

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

## Release Notes for Couchbase Client Library .NET 1.2.0-DP4 Alpha (27 August 2012)

**New Features and Behavior Changes in 1.2.0-DP4**

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

## Release Notes for Couchbase Client Library .NET 1.2.0-DP3 Alpha (27 August 2012)

**New Features and Behavior Changes in 1.2.0-DP3**

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

## Release Notes for Couchbase Client Library .NET 1.2.0-DP2 Alpha (25 July 2012)

**Fixes in 1.2.0-DP2**

 * Generic view requests no longer emitting the original document as value. Client
   Get method is used instead to retrieve original document.

 * Reduced views no longer break from missing "id" field in row.

 * Paging no longer breaks.

 * DevelopmentModeNameTransformer now correctly prepends dev\_ on view requests.

<a id="couchbase-sdk-net-rn_1-2-0a"></a>

## Release Notes for Couchbase Client Library .NET 1.2-DP Alpha (27 March 2012)

**New Features and Behavior Changes in 1.2-DP**

 * Initial support for Couchbase Server 2.0 view API.

    ```
    var view = client.GetView("designdoc", "viewname");
     foreach(var item in view)
     {
     Console.WriteLine(item.ItemId);
     }
    ```

 * Couchbase.dll is now compiled against the .NET Framework 4.0

<a id="licenses"></a>
