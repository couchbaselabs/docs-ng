# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see the [Couchbase 
Java Issues Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-2-0a"></a>

## Release Notes for Couchbase Client Library Java 1.2.0 GA (13 September 2013)

This 1.2.0 release is the first stable release of the 1.2 series, containing
backwards compatible new features. The underlying spymemcached library has also
been upgraded to 2.10.0, which builds the foundation for lots of those features.


**New Features and Behaviour Changes in 1.2.0**

 * The jars are now served from maven central, which required a change of
   the groupId from `couchbase` to `com.couchbase.client`. A list of packages
   can also be found [here](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22couchbase-client%22).
 * Spymemcached has been upgraded to 2.10.0, which implements most of the
   required code for the new features.
 * [JCBC-346](http://www.couchbase.com/issues/browse/JCBC-346): Couchbase Server 2.2 supports
   a new authentication mechanism (SASL CRAM-MD5) which is now supported and automatically
   detected/used by the client as well. One could still force the old one (`PLAIN`) if needed, 
   but this should not be the case in general.
 * [JCBC-347](http://www.couchbase.com/issues/browse/JCBC-347): The default `observe` poll interval
   has been decreased from `100ms` to `10ms`, which should give better performanc ein most of the
   cases. Also, this aligns with replication performance improvements in the 2.2 Couchbase Server
   release. 
 * [JCBC-138](http://www.couchbase.com/issues/browse/JCBC-138): The SDK now properly replaces the
   node list passed in on bootstrap, randomizes it and stores it. This means that when the streaming
   connection goes down, the full last known node list can be used to reestablish the streaming
   connection. Randomizing the node list better distributes the streaming connection throughout
   the cluster, so not always the first and same node will be used.
 * [JCBC-343](http://www.couchbase.com/issues/browse/JCBC-343): In addition to blocking on the future
   or polling its status, one can now add a listener to be notified once it is completed. The
   callback will be executed in a thread pool autonomously. Every future provides a `addListener()`
   method where a anomyous class thact acts as a callback can be passed in. Here is an example:

   ```java
   OperationFuture<Boolean> setOp = client.set("setWithCallback", 0, "content");

   setOp.addListener(new OperationCompletionListener() {
     @Override
     public void onComplete(OperationFuture<?> f) throws Exception {
       System.out.println("I was completed!";
     }
   });
   ```
 * [JCBC-330](http://www.couchbase.com/issues/browse/JCBC-330): To make it easier to supply a new
   timeout when using the CAS operations, there are now overloaded methods provided to add a custom
   timeout. See the API docs for detailed documentation.
 * [JCBC-280](http://www.couchbase.com/issues/browse/JCBC-280): Buckets can now not only be created
   deleted, but also updated directly through the SDK.
 * [JCBC-344](http://www.couchbase.com/issues/browse/JCBC-344): For easier administration and
   configuration purposes, one can now create a `CouchbaseConnectionFactory` based on system properties.
   Here is an example (of course those properties can be set through a file as well):

   ```java
   System.setProperty("cbclient.nodes", "http://192.168.1.1:8091/pools;192.168.1.2");
   System.setProperty("cbclient.bucket", "default");
   System.setProperty("cbclient.password", "");

   CouchbaseConnectionFactory factory = new CouchbaseConnectionFactory();
   CouchbaseClient client = new CouchbaseClient(factory);
   ```

   If you need to customize options, the `CouchbaseConnectionFactoryBuilder` provides a new method to
   construct a factory like this. The instantiation will fail if any of these three properties is not
   supplied.

**Fixes in 1.2.0**
  	
 * [JCBC-333](http://www.couchbase.com/issues/browse/JCBC-333): There is a possibility that
   when view nodes are queried and they are in a state that they don't contain active vbuckets
   (paritions), an error is returned. This fix makes sure that the node is avoided while it is
   in this state (during rebalance in/out conditions).
 * [JCBC-349](http://www.couchbase.com/issues/browse/JCBC-349): Because of a regression, the
   `flush` command did not work on memcached-buckets since 1.1.9. This is now fixed.
 * [JCBC-350](http://www.couchbase.com/issues/browse/JCBC-350): A race condition when loading 
   documents from a replica has been fixed so that no NPE is thrown anymore.
 * [JCBC-351](http://www.couchbase.com/issues/browse/JCBC-351): Replica read has been hardened
   in a way that it also loads the document from the active node and silently discards replicas
   who are not in an active state. It only returns an exception if not a single replica read
   operation could be dispatched.
