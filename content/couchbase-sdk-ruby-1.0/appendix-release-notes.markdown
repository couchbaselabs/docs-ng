# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library Ruby 1.0.0 GA (23 January 2012)

**New Features and Behaviour Changes in 1.0.0**

 * The library supports three different formats for representing values:

    * `:document` (default) format supports most of Ruby types which could be mapped
      to JSON data (hashes, arrays, string, numbers).

    * `:marshal` This format avoids any conversions to be applied to your data, but
      your data should be passed as String. It could be useful for building custom
      algorithms or formats. For example to implement set please see
      [http://dustin.github.com/2011/02/17/memcached-set.html](http://dustin.github.com/2011/02/17/memcached-set.html)

    * `:plain` Use this format if you'd like to transparently serialize your Ruby
      object with standard `Marshal.dump` and `Marshal.load` methods

 * The Namespace `Memcached` is no longer available and has been replaced. For Ruby
   code that used the former namespace, use code that looks something like below.```
   rescue Couchbase::Error::NotFound => e
   ```

 * Removed Views support

 * The client library still supports the Memcached protocol and that syntax is
   still supported as in below.```
   val = c.get("foo", :ttl => 10)
   ```

 * The client will automatically adjust to the changed configuration of the cluster
   (such as on node addition, deletion, rebalance and so on).

<a id="licenses"></a>
