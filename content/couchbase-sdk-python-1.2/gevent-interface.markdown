# Gevent Interface

[gevent](http://www.gevent.org) is a coroutine library for Python. It allows
multiple thread-like objects (_eventlets_) to run in seeming parallelism within
a single Python application (and within a single Python thread).

In order for applications to take full benefit of `gevent`, any form of I/O
must be done in a cooperative manner (i.e. it must be gevent-aware). While
running non-gevent-aware libraries will not cause any malfunction within
the application, it will reduce performance as other eventlets will not
be able to run while a non-gevent-aware I/O operation is taking place.

The normal synchronous API may be used without modification for gevent. However
it is not gevent-aware.

## Gevent aware client

With version 1.1.1, a specifically gevent-aware library was introduced allowing
the full performance benefits of gevent with couchbase. Currently both gevent
pre-release (e.g. 0.13) and 1.0.x release versions are known to work.

```python
from couchbase import experimental
experimental.enable()
from gcouchbase.connection import GConnection

cb = GConnection(bucket='default')
cb.set("foo", "bar")
cb.get("foo")
```

In order to use the `gcouchbase` library, you must first enable the experimental
client features. The `gcouchbase` package is considered experimental because it
relies on undocumented internals of the `gevent` library.

## API

The `gcouchbase` API is exactly the same as the normal `couchbase` API (and
uses the exact same codebase) with the following exceptions:

* The `gcouchbase.connection.GConnection` class must be used
* The `include_docs` option in views is not supported.
