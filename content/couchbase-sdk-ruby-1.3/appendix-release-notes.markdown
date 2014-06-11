# Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

## 1.3.8 (11 June 2014)

**Fixes in 1.3.8**

* Update runtime (connection_pool) and build (libcouchbase) dependencies to the latest versions.

**Known issues in 1.3.8**

* [RCBC-176](http://www.couchbase.com/issues/browse/RCBC-176). When the Couchbase client is used in an `em-synchrony` context, connection errors might not be propagated to the client. This leads to a runtime assertion in EventMachine. 

## 1.3.7 (18 April 2014)

* [major] Allow the selection of bootstrap providers. Since libcouchbase
  2.3.0 there is a new bootstrapping transport available: Cluster
  Configuration Carrier Publication (CCCP). It is a more efficient way
  to keep the cluster configuration up-to-date using Carrier Publication
  instead of HTTP connection.

	```
nodes = ["example.com", "example.org"]
Couchbase.connect(node_list: nodes, bootstrap_transports: [:cccp, :http])
```

	  Read more about it here: <http://www.couchbase.com/wiki/display/couchbase/Cluster+Configuration+Carrier+Publication>

* [major] RCBC-168 An experimental DNS SRV helper for connection
  constructor. The DNS SRV records need to be configured on a reachable
  DNS server. An example configuration could look like the following
  (note that the service ids might change):


	```
	_cbmcd._tcp.example.com.  0  IN  SRV  20  0  11210 node2.example.com.
	_cbmcd._tcp.example.com.  0  IN  SRV  10  0  11210 node1.example.com.
	_cbmcd._tcp.example.com.  0  IN  SRV  30  0  11210 node3.example.com.
	
	_cbhttp._tcp.example.com.  0  IN  SRV  20  0  8091 node2.example.com.
	_cbhttp._tcp.example.com.  0  IN  SRV  10  0  8091 node1.example.com.
	_cbhttp._tcp.example.com.  0  IN  SRV  30  0  8091 node3.example.com.
```

  	Now if "example.com" is passed in as the argument, the three nodes
  configured will be parsed and put in the returned URI list. Note
  that the priority is respected (in this example, node1 will be the
  first one in the list, followed by node2 and node3). As of now,
  weighting is not supported. This is how it could be used to
  bootstrap the connection:


    ```
	transport = :http
	nodes = Couchbase::DNS.locate('example.com', transport)
	if nodes.empty?
		nodes = ["example.com:8091"]
	end
	Couchbase.connect(node_list: nodes, bootstrap_transports: [transport])
```

  	NOTE: This is experimental and subject to change at any time. Watch
  the release notes for changes in future releases.

* [major] RCBC-166 Fix a crash with `eventmachine`. In `eventmachine` event
  handlers are separated and run separately and in the following order:
  [READ, WRITE]. So it was possible to cancel WRITE event handler from
  the READ handler, which could cause a crash when the reactor run it in the next
  turn.

* [minor] Fixed a typo that  doesn't allow you to use bundler in the project
  directory.

## Release notes for Couchbase client library Ruby 1.3.6 (17 February 2014)

**Fixes in 1.3.6**

* Fix linkage issue that blocks library installation on Microsoft Windows.

## Release notes for Couchbase client library Ruby 1.3.5 (5 February 2014)

**Fixes in 1.3.5**

* Honor the :environment constructor argument.

	Issues: [RCBC-152](http://www.couchbase.com/issues/browse/RCBC-152), [RCBC-159](http://www.couchbase.com/issues/browse/RCBC-159)

* Allow inheritance from `Couchbase::Bucket`. It wasn't possible to
  create a view with a subclass of the `Couchbase::Bucket` class.

* Ensure that an exception raised early does not prevent the finalizer
  from being called in the underlying client being constructed. Here's an
  example of a situation where this could occur:

        class Couchbase::Bucket
          def initialize(*args)
            raise "something wrong"
            super
          end
        end

## Release notes for Couchbase client library Ruby 1.3.4 (8 January 2014)

**New Features and Behavior Changes in 1.3.4**

* Build 64-bit versions of the extensions for Windows platform. Also support ruby 2.0 and 2.1.

* Updated hacking section in README.

*  Return CAS in extended mode for incr/decr

	Issues: [RCBC-151](http://www.couchbase.com/issues/browse/RCBC-151)

* Update list of options on `Cluster.create_bucket`. Added the following new options: `:replica_index`, `:flush_enabled`,   `:parallel_db_and_view_compaction`.

	Issues: [RCBC-150](http://www.couchbase.com/issues/browse/RCBC-150)

* Allow retries on Couchbase::Bucket#cas collisions. Now it takes a `:retry` Fixnum option that specifies the maximum number of times the method should retry the entire get/update/set operation when a `Couchbase::Error::KeyExists` error is encountered due to a   concurrent update from another writer between its `#get` and `#set` calls.

* MD5 and truncate ActiveSupport::Cache keys that are longer than 250 characters.

**Fixes in 1.3.4**

* Fix gemspec warnings regarding versions of the dependencies. Now it honors semantic versioning and doesn't use strict versions.

## Release notes for Couchbase client library Ruby 1.3.3 GA (12 September 2013)

**New Features and Behavior Changes in 1.3.3**

* Allow application to use several connections with thread-local singleton.
*Issues*: [RCBC-134](http://www.couchbase.com/issues/browse/RCBC-134)

*  Add selection options for new IO engines: select and iocp.
*Issues*: [RCBC-137](http://www.couchbase.com/issues/browse/RCBC-137)

* Allow determining the version of libcouchbase:

        Couchbase.libcouchbase_version


**Fixes in 1.3.3**

* Fixed invalid memory access which was detected by using 'GC.stress = true' in tests.
Issues: [RCBC-135](http://www.couchbase.com/issues/browse/RCBC-135)

* Build shared object for ruby 2.0 on windows. Also fixes build script when using latest rake and rake-compiler.
*Issues*:  [RCBC-136](http://www.couchbase.com/issues/browse/RCBC-136):

* Initialize event indexes correctly. The plug-in didn't trace event callbacks, which might lead to invalid memory access during rebalance, where libcouchbase creates or removes a lot of events because of a fast-changing topology.
Issues: [RCBC-141](http://www.couchbase.com/issues/browse/RCBC-141):

* When setting the username field, check for password presence. Fixes segmentation fault in this code:

        Couchbase.connect(:username => "default", :bucket => "default")

* Fix deprecation warning on ruby 2.x. On newer versions it should use `rb_thread_call_without_gvl()`.

        ext/couchbase_ext/multithread_plugin.c: In function ‘loop_run_poll’:
        ext/couchbase_ext/multithread_plugin.c:772:5: warning: ‘rb_thread_blocking_region’ is deprecated (declared at .../2.0.0-p247-dbg/include/ruby-2.0.0/ruby/intern.h:839) [-Wdeprecated-declarations]
             rb_thread_blocking_region(loop_blocking_poll, args, RUBY_UBF_PROCESS, NULL);

* Do not try to compile with plug-ins for Windows platform.

* Force handle to be NULL on `lcb_create()` failure. `lcb_create()` can leave garbage in the pointer even if the call itself failed.  This behavior could lead to illegal memory access on GC.

* Remove usage of `RARRAY_PTR` in favor of `rb_ary_entry`. This improves performance significantly on Rubinius and also improves compatibility with future CRuby 2.1, which introduces generational garbage collection. This results in these arrays not having to be rescanned in Rubinius and not marked as shady in RBGCENC in CRuby 2.1.   For more discussion, see <https://bugs.ruby-lang.org/issues/8399>.

<a id="couchbase-sdk-ruby-rn_1-3-2"></a>

## Release Notes for Couchbase Client Library Ruby 1.3.2 GA (10 July 2013)

**New Features and Behavior Changes in 1.3.2**

 * Allow application to select the strategy of reading from replica nodes. *This
   version requires libcouchbase >= 2.0.7.* Now three strategies are available:

    1. `:first` - synonym to `true`, previous behavior now the default. It means that the library will sequentially iterate over all replicas in the configuration supplied by the cluster and will return as soon as it finds a successful response, or report an error.

        ```ruby
        c.get("foo", :replica => true)
        c.get("foo", :replica => :first)
        #=> "bar"
        c.get("foo", :replica => :first, :extended => true)
        #=> ["bar", 0, 11218368683493556224]
        ```

    1. `:all` - query all replicas in parallel. In this case the method will return the array of the values on the all replica nodes without a particular order. Also if the key isn't on the node, it will be skipped in the result array.

        ```ruby
        c.get("foo", :replica => :all)
        #=> ["bar", "bar", "bar"]
        c.get("foo", :replica => :all, :extended => true)
        #=> [["bar", 0, 11218368683493556224],
        # ["bar", 0, 11218368683493556224],
        # ["bar", 0, 11218368683493556224]]
        ```

    1. `Fixnum` - you can also select specific replica node by its index in the cluster configuration. It should be in interval `0...c.num_replicas`

        ```ruby
        0...c.num_replicas
        #=> 0...3
        c.get("foo", :replica => 1)
        #=> "bar"
        c.get("foo", :replica => 42)
        #=> ArgumentError: replica index should be in interval 0...3
        ```

   Note that applications should not assume the order of the replicas indicates    more recent data is at a lower index number. It is up to the application to    determine which version of a document/item it may wish to use in the case of    retrieving data from a replica.

   *Issues* : [RCBC-133](http://www.couchbase.com/issues/browse/RCBC-133)

<a id="couchbase-sdk-ruby-rn_1-3-1"></a>

## Release Notes for Couchbase Client Library Ruby 1.3.1 GA (06 June 2013)

**Fixes in 1.3.1**

 * Fix compatibility with multi\_json 1.7.5. It removed the VERSION constant
   unexpectedly.
   [github.com/intridea/multi\_json/commit/f803f397d1a3ef839a80a669a09318c64b252e5f](https://github.com/intridea/multi_json/commit/f803f397d1a3ef839a80a669a09318c64b252e5f#diff-1)

 * Couchbase::Cluster instance shouldn't require persistent connections. There was
   an issue which lead to a Couchbase::Error::Connect exception and blocked the
   creation/removing of buckets.

   *Issues* : [RCBC-131](http://www.couchbase.com/issues/browse/RCBC-131)

<a id="couchbase-sdk-ruby-rn_1-3-0"></a>

## Release Notes for Couchbase Client Library Ruby 1.3.0 GA (07 May 2013)

**New Features and Behavior Changes in 1.3.0**

 * Introduce Transcoders. This mechanism is more flexible, and similar to how other
   clients encode values.

 * Implement Couchbase::ConnectionPool to allow applications (and
   ActiveSupport::Cache::CouchbaseStore) use it in multi-threaded environment

   *Issues* : [RCBC-46](http://www.couchbase.com/issues/browse/RCBC-46)

**Fixes in 1.3.0**

 * Deprecate numeric argument to 'default\_format'. Instead of this style:

    ```ruby
    Couchbase.connect(:default_format => Couchbase::Bucket::FMT_MARSHAL)
    ```

   Symbol notation or explicit transcoder entity should be used

    ```ruby
    Couchbase.connect(:default_format => :marshal)
    Couchbase.connect(:transcoder => Couchbase::Transcoder::Marshal)
    ```

