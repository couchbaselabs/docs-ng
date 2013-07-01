# Contributing

This section contains means by which you can contribute to this SDK.

<a id="_general_information"></a>

## General Information

The latest source code for the Python SDK may be found on *github*. It is
located at
[https://github.com/couchbase/couchbase-python-client](https://github.com/couchbase/couchbase-python-client).

If you wish to contribute to the C extension itself, it may be worthwhile using
a debug build of Python.

<a id="_compiling_python_from_source"></a>

### Compiling Python From Source

You may skip this section if you do not intend to contribute to the C part of
the SDK.

The instructions here have been tested on Python 2.6.7 and Python 3.2.4. They
will likely work for any version of Python.

In order to generate a debug build of python, you will need to compile it from
source. To do this, you will need to modify some Python source files as
instructed in the `Misc/README.valgrind` file within the Python source
distribution.

Additionally, if you wish to have your Python be useful for installing other
packages (for example, `nose` ), you will need to have `pip` and `distribute`
installed. These themselves depend on several core modules which may not be
built by default on some systems.

The `Modules/Setup` file may be modified using the following diff as a guidline:


```
--- ../../tmp/Python-2.6.7/Modules/Setup.dist   2008-11-27 02:15:12.000000000 -0800
+++ Setup.dist  2013-05-15 15:58:30.559170619 -0700
@@ -162,7 +162,7 @@
 # it, depending on your system -- see the GNU readline instructions.
 # It's okay for this to be a shared library, too.

-#readline readline.c -lreadline -ltermcap
+readline readline.c -lreadline -ltermcap


 # Modules that should always be present (non UNIX dependent):
@@ -215,6 +215,7 @@
 #_ssl _ssl.c \
 #      -DUSE_SSL -I$(SSL)/include -I$(SSL)/include/openssl \
 #      -L$(SSL)/lib -lssl -lcrypto
+_ssl _ssl.c -DUSE_SSL -lssl -lcrypto

 # The crypt module is now disabled by default because it breaks builds
 # on many systems (where -lcrypt is needed), e.g. Linux (I believe).
@@ -248,14 +249,14 @@
 # Message-Digest Algorithm, described in RFC 1321.  The necessary files
 # md5.c and md5.h are included here.

-#_md5 md5module.c md5.c
+_md5 md5module.c md5.c


 # The _sha module implements the SHA checksum algorithms.
 # (NIST's Secure Hash Algorithms.)
-#_sha shamodule.c
-#_sha256 sha256module.c
-#_sha512 sha512module.c
+_sha shamodule.c
+_sha256 sha256module.c
+_sha512 sha512module.c


 # SGI IRIX specific modules -- off by default.
@@ -460,7 +461,7 @@
 # Andrew Kuchling's zlib module.
 # This require zlib 1.1.3 (or later).
 # See http://www.gzip.org/zlib/
-#zlib zlibmodule.c -I$(prefix)/include -L$(exec_prefix)/lib -lz
+zlib zlibmodule.c -I$(prefix)/include -L$(exec_prefix)/lib -lz

 # Interface to the Expat XML parser
 #
```

Note that on some distributions (specifically Debian) you may get a build
failure when building the `ssl` module. If so, you likely need to modify the
`Modules/_ssl.c` file like so:


```
--- ../../tmp/Python-2.6.7/Modules/_ssl.c       2010-08-03 11:50:32.000000000 -0700
+++ _ssl.c      2013-05-15 15:58:03.471170217 -0700
@@ -302,8 +302,6 @@
         self->ctx = SSL_CTX_new(TLSv1_method()); /* Set up context */
     else if (proto_version == PY_SSL_VERSION_SSL3)
         self->ctx = SSL_CTX_new(SSLv3_method()); /* Set up context */
-    else if (proto_version == PY_SSL_VERSION_SSL2)
-        self->ctx = SSL_CTX_new(SSLv2_method()); /* Set up context */
     else if (proto_version == PY_SSL_VERSION_SSL23)
         self->ctx = SSL_CTX_new(SSLv23_method()); /* Set up context */
     PySSL_END_ALLOW_THREADS
```

Once the source tree is prepared, you can do something like:

**Unhandled:** `[:unknown-tag :screen]`<a id="_running_tests"></a>

### Running Tests

If you’ve made changes to the library, you need to run the test suite to ensure
that nothing broke with your changes.

To run the tests, you need to have the `nose` package installed (this may also
work with the `unittest` module as well, but is less tested).

Additionally, you need a real cluster to test against. The test may modify the
buckets specified, so be sure not to point it to a production server(!).

Note that the views test may fail if you have made changes to the `beer-sample`
bucket.

To tell the test about your cluster setup, copy the file `tests/test.ini.sample`
to `tests/test.ini` and modify as needed.

To run the tests, simply do:

**Unhandled:** `[:unknown-tag :screen]` from within the root of the SDK source.

<a id="_building_docs"></a>

### Building Docs

You will need `sphinx` and `numpydoc` installed. Simply do

**Unhandled:** `[:unknown-tag :screen]` Once done, the built HTML should be in
`docs/build/html`, and you can begin browsing by opening
`docs/build/html/index.html` in your browser.

<a id="_source_style_guidelines"></a>

## Source Style Guidelines

For the Python code, a loose adherence to *PEP-8* should be used. For the C
extension code, a fairly more strict adherence to *PEP-7* should be used.

These rules are meant to be broken; this just reflects some guidelines to use.

In general:

 * Use spaces, not tabs

 * Lines should never be longer than 80 columns

 * Code should be compatible with Python versions 2.6 up to the latest 3.x

Python-Specific:

 * Doc strings should be readable by Sphinx

 * Methods should not have more than three positional arguments

 * Avoid using string literals in code

   If a new object makes use of a dictionary, consider converting this dictionary
   to a proper Python object, using a `namedtuple`, etc.

 * Avoid dependencies not in Python’s standard library

   Though you may add conditional functionality depending on whether a specific
   library is installed or not.

 * Don’t use threads

   While threads are a useful construct in application code, they do not belong in
   library code without good reason.

C-Specific:

 * Use of `goto` is better than deeply nested blocks

 * Return type and storage specifiers should be on their own line

   Thus:

    ```
    static PyObject*
    do_something(PyObject *self, PyObject *args, ...)
    {
        /** ... **/
    }
    ```

   Rather than

    ```
    static PyObject *do_something(PyObject *self, PyObject *args)
    {
        /** ... **/
    }
    ```

 * Code should compile with the following flags (for GCC or clang)

   **Unhandled:** `[:unknown-tag :screen]`

 * Non-static functions should have a `pycbc_` prefix

 * Functions exposed as Python methods should be named as `pycbc_<Object>_<Method>`

   Where `<Object>` is the name of the class in the SDK (e.g. `Connection` ) and
   `<Method>` is the name of the method (e.g. `<get>` ), thus,
   `pycbc_Connection_get`

 * Code should be portable to Win32

   Therefore, only include standard library headers and use `PyOS_*` functions when
   needed.

<a id="couchbase-sdk-python-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Python. To browse or submit new issaues, see [Couchbase
Client Library Python Issues
Tracker](http://www.couchbase.com/issues/browse/PYCBC).

<a id="couchbase-sdk-python-rn_0-8-0"></a>

## Release Notes for Couchbase Client Library Python 0.8.0 Beta (1 September 2012)

**Known Issues in 0.8.0**

 * Exception is thrown on key not found errors with unified client.

    ```
    try:
     bucket.get("key_that_does_not_exist")
    except:
     #couchbase.exception.MemcachedError
    ```

 * "id" values from view rows must be converted to strings to be used with
   Memcached API.

    ```
    view = bucket.view("_design/beer/_view/by_name")
    for row in view:
     id = row["id"].__str__()
     beer = bucket.get(id)
     #do something
    ```

 * View queries on authenicated buckets are not currently supported.

<a id="couchbase-sdk-python-rn_0-7-1"></a>

## Release Notes for Couchbase Client Library Python 0.7.1 Beta (6 August 2012)

This is the latest release of the Couchbase Python SDK. It is written from the
ground up based on the Couchbase C library, libcouchbase.

This release is considered beta software, use it at your own risk; let us know
if you run into any problems, so we can fix them.

**New Features and Behaviour Changes in 0.7.1**

 * SDK now installable via python setup.py install from source or via pip install
   couchbase.

**Fixes in 0.7.1**

 * Temporarily removing unimplemented multi-get until full implementation
   available. This will be re-addressed in PYCBC-49 in a future release

   *Issues* : [PYCBC-49](http://www.couchbase.com/issues/browse/PYCBC-49),
   [PYCBC-49](http://www.couchbase.com/issues/browse/PYCBC-49)

<a id="couchbase-sdk-python-rn_0-7-0"></a>

## Release Notes for Couchbase Client Library Python 0.7.0 Beta (6 August 2012)

This is the latest release of the Couchbase Python SDK. It is written from the
ground up based on the Couchbase C library, libcouchbase.

This release is considered beta software, use it at your own risk; let us know
if you run into any problems, so we can fix them.

**New Features and Behaviour Changes in 0.7.0**

 * Introduced VBucketAwareClient which extends MemcachedClient with
   Membase/Couchbase specific features.

 * SDK now requires Python 2.6.

 * SDK can now handle server restarts/warmups. Can handle functioning Couchbase
   Server that is loading data from disk after restart.

**Fixes in 0.7.0**

 * Set() now works with integer values; fixes PYCBC-15.

   *Issues* : [PYCBC-15](http://www.couchbase.com/issues/browse/PYCBC-15)

 * Deprecated `get_view` as it was a duplicate of `view_results`.

 * Added memcached level `flush()` command to unify client with other SDKs. Please
   note this only works with 1.8.0 without changing settings. See the release notes
   for Couchbase 1.8.1 and 2.0.0 for how to enable memcached `flush().`

   This operation is deprecated as of the 1.8.1 Couchbase Server, to prevent
   accidental, detrimental data loss. Use of this operation should be done only
   with extreme caution, and most likely only for test databases as it will delete,
   item by item, every persisted record as well as destroy all cached data.

   Third-party client testing tools may perform a `flush_all()` operation as part
   of their test scripts. Be aware of the scripts run by your testing tools and
   avoid triggering these test cases/operations unless you are certain they are
   being performed on your sample/test database.

   Inadvertent use of `flush_all()` on production databases, or other data stores
   you intend to use will result in permanent loss of data. Moreover the operation
   as applied to a large data store will take many hours to remove persisted
   records.

 * Renamed VBucketAwareCouchbaseClient to CouchbaseClient.

 * Can now create memcached buckets

 * SDK can now created memcached buckets.

 * Greater than 50% of SDK covered by unittests; fixes PYCBC-46.

   *Issues* : [PYCBC-46](http://www.couchbase.com/issues/browse/PYCBC-46)

 * Better handling of topology changes; fixes PYCBC-4.

   *Issues* : [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4),
   [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4)

 * `init_cluster` function has been removed.

 * Globally, logging is no longer disabled; fixes PYCBC-31.

   *Issues* : [PYCBC-31](http://www.couchbase.com/issues/browse/PYCBC-31)

 * Set() now returns a proper status in the unified Couchbase() client 0.7.0.

 * Added Apache License headers to all files

 * Fixed.save() method; fixes MB-5609.

   *Issues* : [MB-5609](http://www.couchbase.com/issues/browse/MB-5609),
   [MB-5609](http://www.couchbase.com/issues/browse/MB-5609)

 * Deprecated Server() in favor of Couchbase() for the unified client name

 * SDK now working with mixed clusters, including clusters with memcached type
   buckets.

 * Deprecating getMulti for pep8-compliant multi-get.

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