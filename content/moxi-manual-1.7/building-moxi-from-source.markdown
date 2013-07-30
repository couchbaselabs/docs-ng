# Building Moxi From Source

The development git repository for Moxi is available at
[http://github.com/couchbase/moxi](http://github.com/couchbase/moxi)

As Moxi is used as a component of Membase, the easiest way to build Moxi from
source is to follow the directions to build Membase. You can find directions for
building Membase from source under the Contributing to Membase documentation
tree. After building Membase, just see the `./moxi` subdirectory.

Some dependencies of Moxi (so that you can use it with Membase) include:

 * libevent, version >= 2.0.7-rc (required to build Membase)

 * libcurl, version >= 7.21

 * libmemcached, version >= 0.41

 * libconflate (included as part of building Membase)

 * libvbucket (included as part of building Membase)

Your Moxi build should be configure'd to enable:


```
shell> ./configure --enable-moxi-libvbucket --enable-moxi-libmemcached
    --without-check make
```

When you build Membase from source, this is the default set of options to
`configure` used.

<a id="moxi-server-rn"></a>
