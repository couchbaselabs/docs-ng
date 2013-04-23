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