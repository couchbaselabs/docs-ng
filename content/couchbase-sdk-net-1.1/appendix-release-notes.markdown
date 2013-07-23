# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library.NET. To browse or submit new issues, see [Couchbase
Client Library.NET Issues Tracker](http://www.couchbase.com/issues/browse/NCBC).

<a id="couchbase-sdk-net-rn_1-1-6"></a>

## Release Notes for Couchbase Client Library.NET 1.1.6 GA (07 June 2012)

**New Features and Behaviour Changes in 1.1.6**

 * The 1.1.6 release of the Couchbase.NET Client library is a build only change,
   providing signed assemblies for both Couchbase.dll and Enyim.Caching.dll. The
   logging assemblies have also been signed.

<a id="couchbase-sdk-net-rn_1-1-5"></a>

## Release Notes for Couchbase Client Library.NET 1.1.5 GA (30 May 2012)

These updates includes minor bugfixes to release (.92) as well as an upgrade to
the current release of Enyim.Memcached (2.15)

**New Features and Behaviour Changes in 1.1.5**

 * The 1.1.5 release of the Couchbase.NET Client library includes fixes for issues
   NCBC-42, NCBC-43 and NCBC-49. With this release, client bootstrapping is now
   performed off of /pools and the heartbeat check is configurable.

   Prior to version 1.1.5, the.NET client would get cluster information by first
   bootstrapping to a node at /pools/default. While this approach is generally
   safe, the client should have bootstrapped off of /pools as /pools/default might
   not be the correct second URI in the handshake sequence.

    ```
    <servers>
     <add uri="http://127.0.0.1:8091/pools" />
     </servers>
    ```

   The.NET client performs a heartbeat check on the streaming connection it
   maintains by querying the bootstrapping node at periodic intervals. The URI it
   used previously for bootstrapping was the above bootstrapping URI. This release
   allows for this URI to be configured, along with the interval. Disabling the
   check is also allowed now.

   The default values are to check the /pools URI every 10 seconds. The
   heartbeatMonitor element is a sibling to the servers element.

    ```
    <heartbeatMonitor uri="http://127.0.0.1:8091/pools" interval="10000" enabled="true" />
    ```

<a id="couchbase-sdk-net-rn_1-1-0"></a>

## Release Notes for Couchbase Client Library.NET 1.1.0 GA (02 May 2012)

**New Features and Behaviour Changes in 1.1.0**

 * The 1.1 release of the.NET Client Library contains a series of new API methods
   designed to provide developers with more details about the success or failure of
   an operation performed by the client.

   The existing API methods remain in place and as such, these changes are not
   breaking. Each of the new methods has the standard API method name prefixed by
   `Execute`. For example `Store` becomes `ExecuteStore`.

    ```
    var storeResult = client.ExecuteStore(StoreMode.Set, "foo", "bar");

     if (! result.Success) {
     Console.WriteLine("Operation failed: {0}", result.Message);
     }
    ```

   Each of the new Execute methods returns an instance of an `IOperationResult`,
   with is extended by various operation specific interfaces -
   `IGetOperationResult`, `IStoreOperationResult`, `IConcatOperationResult`,
   `IMutateOperationResult` and `IRemoveOperationResult`.

   `IOperationResult` defines common properties available to all results returned
   by Execute methods.

    ```
    IOperationResult opertionResult = client.Store(StoreMode.Set, "foo", "bar");

     //Was the operation successful (i.e., no errors or exceptions)?
     Console.WriteLine("Success: " + operationResult.Success);

     //Print out possible error, warning or informational message
     Console.WriteLine("Message: " + operationResult.Message);

     //Print out a caught exception
     Console.WriteLine("Exception: " + operationResult.Exception.Message);

     //Print out status code (nullable)
     Console.WriteLine("StatusCode: " + operationResult.StatusCode);

     //Print out InnerResult, which is populated on handled failures (i.e., IO exceptions)
     Console.WriteLine("InnerResult: " + operationResult.InnerResult.Message);
    ```

   Store, Get, Mutate and Concat operation results all return Cas values.

    ```
    var getResult = client.ExecuteGet("foo");

     //Print out the Cas value
     Console.WriteLine("Cas value for 'foo':" + getResult.Cas);
    ```

   Get operation results also expose HasValue and Value properties.

    ```
    var getResult = client.ExecuteGet("foo");

     //Print out whether getResult contains a value (shortcut for value null check)
     Console.WriteLine("getResult HasValue: " + getResult.HasValue);

     //Print out the item value
     Console.WriteLine("Value for 'foo':" + getResult.Value);
    ```

   Most failures are likely to fall into one of two categories. The first are
   conditions that the server won't allow. For example, a Cas operation with an
   expired CAS value would be a failure. Attempting to add a key when that key
   already exists would also be failure. The second category of likely failures
   would occur when the client can't connect to a node.

   Both categories of failures are likely to be reported by lower-level components
   within the client library. These components handle these errors gracefully and
   then log the problem. Before 1.1, these failure conditions were swallowed and
   did not propagate up to the caller. As a consequence, it is a good idea to check
   the `InnerResult` for a failed operation result.

<a id="licenses"></a>
