# FAQs

 * What kind of client do I use with `couchbase` ?

   `couchbase` is compatible with existing memcached clients. If you have a
   memcached client already, you can just point it at `couchbase`. Regular testing
   is done with `spymemcached` (the Java client), `libmemcached` and fauna (Ruby
   client). See the [Client Libraries](http://www.couchbase.com/develop) page

 * What is a "vbucket"?

   An overview from Dustin Sallings is presented here: [memcached
   vBuckets](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)

 * What is a TAP stream?

   A TAP stream is a when a client requests a stream of item updates from the
   server. That is, as other clients are requesting item mutations (for example,
   SET's and DELETE's), a TAP stream client can "wire-tap" the server to receive a
   stream of item change notifications.

   When a TAP stream client starts its connection, it may also optionally request a
   stream of all items stored in the server, even if no other clients are making
   any item changes. On the TAP stream connection setup options, a TAP stream
   client may request to receive just current items stored in the server (all items
   until "now"), or all item changes from now onward into in the future, or both.

   Trond Norbye's written a blog post about the TAP interface. See [Blog
   Entry](http://blog.couchbase.com/want-know-what-your-memcached-servers-are-doing-tap-them).

 * What ports does `couchbase` Server need to run on?

   The following TCP ports should be available:

    * 8091 — GUI and REST interface

    * 1 — Server-side Moxi port for standard memcached client access

    * 0 — native `couchbase` data port

    * 0 to 21199 — inclusive for dynamic cluster communication

 * What hardware and platforms does `couchbase` Server support?

   Couchbase Server supports Red Hat (and CentOS) versions 5 starting with update
   2, Ubuntu 9 and and Windows Server 2008 (other versions have been shown to work
   but are not being specifically tested). There are both 32-bit and 64-bit
   versions available. Community support for Mac OS X is available. Future releases
   will provide support for additional platforms.

 * How can I get `couchbase` on (this other OS)?

   The `couchbase` source code is quite portable and is known to have been built on
   several other UNIX and Linux based OSs. See [Consolidated
   sources](http://www.couchbase.com/downloads/).

 * Can I query `couchbase` by something other than the key name?

   Not directly. It's possible to build these kinds of solutions atop TAP. For
   instance, via
   [Cascading](http://www.cascading.org/2010/09/memcached-membase-and-elastics.html)
   it is possible to stream out the data, process it with Cascading, then create
   indexes in Elastic Search.

 * What is the maximum item size in `couchbase` ?

   The default item size for `couchbase` buckets is 20 MBytes. The default item
   size for memcached buckets is 1 MByte.

 * How do I the change password?

    ```
    > couchbase cluster-init -c cluster_IP:8091
            -u current_username-p current password
            --cluster-init-username=new_username
            --cluster-init-password=new_password
    ```

 * How do I change the per-node RAM quota?

    ```
    > couchbase-cli cluster-init -c \
               cluster_IP:8091 -u username-p password
                --cluster-init-ramsize=RAM_in_MB
    ```

 * How do I change the disk path?

   Use the `couchbase` command-line tool:

    ```
    > couchbase node-init -c cluster_IP:8091 -u \
           username-p password--node-init-data-path=/tmp
    ```

 * Why are some clients getting different results than others for the same
   requests?

   This should never happen in a correctly-configured `couchbase` cluster, since
   `couchbase` ensures a consistent view of all data in a cluster. However, if some
   clients can't reach all the nodes in a cluster (due to firewall or routing
   rules, for example), it is possible for the same key to end up on more than one
   cluster node, resulting in inconsistent duplication. Always ensure that all
   cluster nodes are reachable from every smart client or client-side moxi host.

<a id="couchbase-uninstalling"></a>
