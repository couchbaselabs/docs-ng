# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-3-2"></a>

## Release Notes for Couchbase Client Library Ruby 1.3.2 GA (10 July 2013)

**New Features and Behavior Changes in 1.3.2**

 * Allow application to select the strategy of reading from replica nodes. *This
   version requires libcouchbase >= 2.0.7.* Now three strategies are available:

    1. `:first` - synonym to `true`, previous behavior now the default. It means that
       the library will sequentially iterate over all replicas in the configuration
       supplied by the cluster and will return as soon as it finds a successful
       response, or report an error.

        ```
        c.get("foo", :replica => true)
        c.get("foo", :replica => :first)
        #=> "bar"
        c.get("foo", :replica => :first, :extended => true)
        #=> ["bar", 0, 11218368683493556224]
        ```

    1. `:all` - query all replicas in parallel. In this case the method will return the
       array of the values on the all replica nodes without a particular order. Also if
       the key isn't on the node, it will be skipped in the result array.

        ```
        c.get("foo", :replica => :all)
        #=> ["bar", "bar", "bar"]
        c.get("foo", :replica => :all, :extended => true)
        #=> [["bar", 0, 11218368683493556224],
        # ["bar", 0, 11218368683493556224],
        # ["bar", 0, 11218368683493556224]]
        ```

    1. `Fixnum` - you can also select specific replica node by its index in the cluster
       configuration. It should be in interval `0...c.num_replicas`

        ```
        0...c.num_replicas
        #=> 0...3
        c.get("foo", :replica => 1)
        #=> "bar"
        c.get("foo", :replica => 42)
        #=> ArgumentError: replica index should be in interval 0...3
        ```

   Note that applications should not assume the order of the replicas indicates
   more recent data is at a lower index number. It is up to the application to
   determine which version of a document/item it may wish to use in the case of
   retrieving data from a replica.

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

    ```
    Couchbase.connect(:default_format => Couchbase::Bucket::FMT_MARSHAL)
    ```

   Symbol notation or explicit transcoder entity should be used

    ```
    Couchbase.connect(:default_format => :marshal)
    Couchbase.connect(:transcoder => Couchbase::Transcoder::Marshal)
    ```

<a id="licenses"></a>
