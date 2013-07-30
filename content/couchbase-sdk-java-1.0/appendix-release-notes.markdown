# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see [Couchbase
Client Library Java Issues
Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-0-3"></a>

## Release Notes for Couchbase Client Library Java 1.0.3 GA (30 July 2012)

**Fixes in 1.0.3**

 * It was found that in some circumstances, the client can fail to update to the
   changed cluster topology if there was a failure and either the instance wide
   client timeout or the operations the client is doing have a short (i.e., less
   than 700ms or so) timeout. JCBC-88.

   *Issues* : [JCBC-88](http://www.couchbase.com/issues/browse/JCBC-88),
   [JCBC-88](http://www.couchbase.com/issues/browse/JCBC-88)

 * It was found that in the dependent spymemcached client library that errors
   encountered in optimized set operations would not be handled correctly and thus
   application code would receive unexpected errors during a rebalance. This has
   been worked around in this release by disabling optimization. This may have a
   negilgable drop in throughput but shorter latencies.

 * If using the CouchbaseConnectionFactoryBuilder, authentication could be ignored
   by the client library.

   *Issues* : [JCBC-53](http://www.couchbase.com/issues/browse/JCBC-53)

 * Ensure the configuration is updated even if the node the client is intended to
   receive updates from fails without closing the TCP connection. Make sure these
   configuration checks are reliable and do not consume significant resources.

   *Issues* : [JCBC-54](http://www.couchbase.com/issues/browse/JCBC-54)

**Known Issues in 1.0.3**

 * As a workaround to a reliability under rebalance issue, optimization has been
   disabled in this release. This can cause a negligible drop in throughput but
   have better per-operation latency.

   *Issues* : [JCBC-89](http://www.couchbase.com/issues/browse/JCBC-89)

<a id="couchbase-sdk-java-rn_1-0-2"></a>

## Release Notes for Couchbase Client Library Java 1.0.2 GA (5 April 2012)

**Fixes in 1.0.2**

 * An issue which affects memcached bucket types, where it was found that the
   hashing was not compatible with Couchbase Server's proxy port (a.k.a. moxi) has
   been fixed in this release. It is also incompatible with the spymemcached 2.7.x
   compatibility with Couchbase (and Membase). Note that this means the use of the
   1.0.2 client is INCOMPATIBLE with 1.0.1 and 1.0.0.

   *Issues* : [JCBC-29](http://www.couchbase.com/issues/browse/JCBC-29)

 * An issue which would prevent failover in some situations was fixed in this
   release. Prior to this fix, a permanent failure of the node the client was
   receiving configurations from (typically from the first node in the list) would
   cause the client to stick with an old configuration, and thus it would not know
   about any failovers or changes to cluster topology.

   *Issues* : [JCBC-19](http://www.couchbase.com/issues/browse/JCBC-19)

<a id="couchbase-sdk-java-rn_1-0-1"></a>

## Release Notes for Couchbase Client Library Java 1.0.1 GA (25 January 2012)

**Fixes in 1.0.1**

 * Some Maven issues with the client libraries were fixed.

 * A major bug in 1.0.0 causing incorrect hashing of vBuckets was fixed and
   addressed in 1.0.1

<a id="couchbase-sdk-java-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library Java 1.0.0 GA (23 January 2012)

**New Features and Behaviour Changes in 1.0.0**

 * The `spymemcached` library functionality is now avaliable via `Couchbase-client`
   and `spymemcached` libraries. Couchbase Connections, Connection Factory and the
   storage and retrieval operations is abstracted in the Couchbase-client library
   and ought to be the predominant library to be used by Java programs. Memcached
   functionality is still available with `spymemcached`.

   Consequently, the package structure has a new `com.couchbase.client` package in
   addition to the exisiting `net.spy.memcached` package.

   For example, the connection to Couchbase can be obtained using the
   Couchbase-client library objects and methods.

    ```
    List<URI> uris = new LinkedList<URI>();

     // Connect to localhost or to the appropriate URI
     uris.add(URI.create("http://127.0.0.1:8091/pools"));
     try {
     client = new CouchbaseClient(uris, "default", "");
     } catch (Exception e) {
     System.err.println("Error connecting to Couchbase: "
     + e.getMessage());
     System.exit(0);
     }
    ```

   or using the `CouchbaseConnectionFactory` as below.

    ```
    CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(uris,
     "rags", "password");
     client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
    ```

<a id="licenses"></a>
