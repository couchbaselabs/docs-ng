# PyPy Support

[PyPy](http://pypy.org) is an alternative Python interpreter which claims
significant speed benefit over [CPython](http://www.python.org). It attains
this speed boost by using JIT (just-in-time) compilation among other things.


## Built-In SDK Support Functionality

The mainline supported Couchbase Python SDK is a CPython extension using
CPython's native API to deliver a highly efficient and highly stable
library. Unfortunately as a result it means that it will not work properly
on Python implementations which do not support the CPython API.

By means of something called [cpyext](http://pypy.org/compat.html) PyPy offers
rudimentary alpha-level support for libraries requiring the CPython API. The
Couchbase Python SDK will properly compile against `cpyext` without modification
and some of its basic functionality may be available. Note however that because
of the stability level of `cpyext`, your application may randomly crash or leak.

## Native PyPy Support

As an alternative, an external project is available
(https://github.com/couchbaselabs/couchbase-python-cffi) which provides a
pure-python implementation of the Couchbase SDK, utilizing the `cffi` library
to interface with _libcouchbase_.

The CFFI-based implementation is the recommended way to use the Couchbase SDK
in a PyPy environment. It provides a subset of functionality as the mainline
implementation and exposes an identical API.

Currently using the CFFI-implementation itself requires that the mainline
SDK be installed as well.

See the project's homepage for installation instructions and more
details on its supported featureset.
