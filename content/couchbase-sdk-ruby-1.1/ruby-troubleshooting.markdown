# Ruby — Troubleshooting

<a id="couchbase-sdk-ruby-timed-operations"></a>

## Creating Timed Operations

One approach you can try if you get temporary out of memory errors from the
server is to explicitly pace the timing of requests you make. You can do this in
any SDK by creating a timer and only perform a Couchbase request after a
specific timed interval. This will provide a slight delay between server
requests and will reduce the risk of an out of memory error. For instance in
Ruby:


```
c.set("foo", 100)
n = 1

c.run do
    c.create_periodic_timer(500000) do |tm|
          c.incr("foo") do
              if n == 5
                  tm.cancel
              else
                  n += 1
              end
          end
    end
end
```

In this example we create a sample record `foo` with the initial fixnum value of
100. Then we create a increment count set to one, to indicate the first time we
will create a Couchbase request. In the event loop, we create a timing loop that
runs every.5 seconds until we have repeated the loop 5 times and our increment
is equal to 5. In the timer loop, we increment `foo` per loop.

<a id="couchbase-sdk-ruby-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-1-5"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.5 GA (17 September 2012)

**Fixes in 1.1.5**

 * Fixed installing issue on Mac OS X.

   *Issues* : [RCBC-81](http://www.couchbase.com/issues/browse/RCBC-81)

<a id="couchbase-sdk-ruby-rn_1-1-4"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.4 GA (30 August 2012)

**Fixes in 1.1.4**

 * Allow to pass intial list of nodes which will allow to iterate addresses until
   alive node will be found.

    ```
    Couchbase.connect(:node_list => ['example.com:8091', 'example.org:8091', 'example.net'])
    ```

   *Issues* : [RCBC-37](http://www.couchbase.com/issues/browse/RCBC-37)

 * Fixed UTF-8 in the keys. Original discussion
   [https://groups.google.com/d/topic/couchbase/bya0lSf9uGE/discussion](https://groups.google.com/d/topic/couchbase/bya0lSf9uGE/discussion)

   *Issues* : [RCBC-70](http://www.couchbase.com/issues/browse/RCBC-70)

<a id="couchbase-sdk-ruby-rn_1-1-3"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.3 GA (27 July 2012)

**Fixes in 1.1.3**

 * The `Couchbase::Bucket` class hasn't implemented the `#dup` method. So it caused
   SEGFAULT. The patch is implementing correct function, which copy the internals
   and initializes new connection.

   *Issues* : [RCBC-64](http://www.couchbase.com/issues/browse/RCBC-64)

 * make object\_space gc protector per-bucket object

   previous version provided not completely thread-safe bucket instance, because it
   was sharing global hash for protecting objects, created in extension, from
   garbage collecting.

   *Issues* : [RCBC-60](http://www.couchbase.com/issues/browse/RCBC-60)

 * The flags might be reset if caller will use `Couchbase::Bucket#cas` operation.
   Here is IRB session demostrating the issue:

    ```
    irb> Couchbase.bucket.set("foo", "bar", :flags => 0x100)
    17982951084586893312
    irb> Couchbase.bucket.cas("foo") { "baz" }
    1712422461213442048
    irb> Couchbase.bucket.get("foo", :extended => true)
    ["baz", 0, 1712422461213442048]
    ```

   *Issues* : [RCBC-59](http://www.couchbase.com/issues/browse/RCBC-59)

<a id="couchbase-sdk-ruby-rn_1-1-2"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.2 GA (05 June 2012)

**Fixes in 1.1.2**

 * Upgrade libcouchbase dependency to 1.0.4. Version 1.0.4 includes important
   stability fixes.

 * Backport debugger patch. The gem used to require debugger as development
   dependency. Unfortunately ruby-debug19 isn't supported anymore for ruby 1.9.x.
   But there is new gem 'debugger'. This patch replaces this dependency.

<a id="couchbase-sdk-ruby-rn_1-1-1"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.1 GA (19 March 2012)

**Fixes in 1.1.1**

 * Flags are used differently in different clients for example between Python and
   Ruby. This fix will force the format to a known value irrespective of the flags.

 * Calls between Ruby and C libraries for Couchbase which involved default
   arguments had an associated arity of -1 which was not being handled correctly.
   That is being handled correctly now.

<a id="couchbase-sdk-ruby-rn_1-1-0"></a>

## Release Notes for Couchbase Client Library Ruby 1.1.0 GA (07 March 2012)

**New Features and Behaviour Changes in 1.1.0**

 * With the usage of the URI parser from stdlib it is possible to validate the
   bucket URI more strictly. Also, it is possible to specify credentials in the URI
   like: `http://username:password@example.com:8091/pools/default/buckets/custom`

 * The "default" connection is available in thread local storage. This mean that
   using the `Couchbase.bucket` method it is possible to get access to current
   connection and there is no need to share connections when running in
   multi-thread environment. Each thread has its own connection reference.

 * The direct dependency on libevent and sasl has been removed. Now the library
   doesn't require libevent headers installed.

 * The disconnect and reconnect interfaces are implemented which provide routines
   for explicit resource management. Connections were freed only when the Garbage
   Collector found that the connection was not being used. Now it's possible for
   the client to check if the bucket was connected using `'connected?'` or
   `'disconnect'` it manually or `'reconnect'` using old settings.

**Fixes in 1.1.0**

 * It is not required to install `libcouchbase` or `libvbucket` on windows.

 * Based on the time out fix (CCBC-20),clients will be notified when the connection
   was dropped or host isn't available.

 * It is possible to store nil as a value. It is possible to distinguish a nil
   value from a missing key by looking at at the value returned and the flags and
   CAS values as well.

 *  There were spurious timeout issues with a compound statement like below.```
    connection.run do
     connection.get("foo") {|ret| puts "got foo = #{ret.value}"}
     sleep(5)
    end
    ```

   No timeout will occur unless there is a problem with the connection.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.