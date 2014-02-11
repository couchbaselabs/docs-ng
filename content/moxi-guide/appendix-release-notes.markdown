# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Moxi. To browse or submit new issues, see [Moxi Issues
Tracker](http://www.couchbase.com/issues/browse/MB).


<a id="moxi-server-rn_2-5"></a>

## Release Notes for Moxi 2.5 GA

**Fixed Issues in 2.5**

[MB-9677](http://www.couchbase.com/issues/browse/MB09677): A memory leak in the client-side moxi occurs during rebalance.

[MB-9549](http://www.couchbase.com/issues/browse/MB-9549): A memory leak occurs when the TTL is updated for a non-resident item.

[MB-8724](http://www.couchbase.com/issues/browse/MB-8724): Moxi 1.8.1 leaks memory and crashes via the Linux OOM killer.





<a id="moxi-server-rn_1-8"></a>

## Release Notes for Moxi 1.8.0 GA (Already released)

**Fixed Issues in 1.8.1**




**Known Issues in 1.8.0**

 * When using Moxi in a cluster using `haproxy`, it's possible for a memory leak to
   cause a problem in Moxi when the topology appears to change. The problem is due
   to `haproxy` disabling open connections, particularly those used for management,
   that Moxi may have open, but not using. The `haproxy` closes these open
   connections, which `moxi` identifies as topology changes. The problem is
   particularly prevalent when using the `balance roundrobin` load balancing type.

   *Workaround* : There are two possible workarounds to prevent the memory leak in
   `moxi` :

    * Use `balance source` load balancing mode within `haproxy`. This reduces the
      effect of `haproxy` closing the open network ports.

    * Increase the network timeouts in `haproxy`. You can do this by editing the
      `haproxy` configuration file and adding the following two lines:

       ```
       timeout client 300000
       timeout server 300000
       ```

      The above sets a 5 minute timeout. You can increase this to a larger number.

<a id="licenses"></a>
