# Contributing

This section describes how you can contribute to this SDK.

<a id="_general_information"></a>

## General Information

The latest source code for the Python SDK can be found on *github*. It is
located at
[https://github.com/couchbase/couchbase-python-client](https://github.com/couchbase/couchbase-python-client).

If you want to contribute to the C extension itself, it might be worthwhile to
use a debug build of Python.

<a id="_compiling_python_from_source"></a>

### Compiling Python From Source

You can skip this section if you do not intend to contribute to the C part of
the SDK.

The instructions here have been tested on Python 2.6.7 and Python 3.2.4. They
will likely work for any version of Python.

To generate a debug build of python, you need to compile it from source. To do
this, you need to modify some Python source files as instructed in the
`Misc/README.valgrind` file within the Python source distribution.

Additionally, if you want to have your Python be useful for installing other
packages (for example, `nose` ), you need to have `pip` and `distribute`
installed. These themselves depend on several core modules that might not be
built by default on some systems.

The `Modules/Setup` file can be modified using the following diff as a guidline:


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

Note that on some distributions (specifically Debian) you might get a build
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

After the source tree is prepared, you can do something like:

`shell>./configure --without-pymalloc --prefix=/source/pythons/py267 shell> make
install`<a id="_running_tests"></a>

### Running Tests

If you’ve made changes to the library, you need to run the test suite to ensure
that nothing broke with your changes.

To run the tests, you need to have the `nose` package installed (this may also
work with the `unittest` module as well, but is less tested).

Additionally, you need a real cluster to test against. The test might modify the
buckets specified, so be sure not to point it to a production server!

Note that the views test might fail if you have made changes to the
`beer-sample` bucket.

To tell the test about your cluster setup, copy the file `tests/test.ini.sample`
to `tests/test.ini` and modify as needed.

To run the tests, from within the root of the SDK source simply do:

`shell> nosetest -v`<a id="_building_docs"></a>

### Building Docs

You will need `sphinx` and `numpydoc` installed. Simply do:

`shell> make -C docs html` After you do this, the built HTML should be in
`docs/build/html`, and you can begin browsing by opening
`docs/build/html/index.html` in your browser.

<a id="_source_style_guidelines"></a>

## Source Style Guidelines

For the Python code, a loose adherence to *PEP-8* should be used. For the C
extension code, a fairly more strict adherence to *PEP-7* should be used.

These rules are meant to be broken; this just reflects some guidelines to use.

In general:

 * Use spaces, not tabs.

 * Lines should never be longer than 80 columns.

 * Code should be compatible with Python versions 2.6 up to the latest 3.x.

Python-Specific:

 * Doc strings should be readable by Sphinx.

 * Methods should not have more than three positional arguments.

 * Avoid using string literals in code.

   If a new object makes use of a dictionary, consider converting this dictionary
   to a proper Python object by using a `namedtuple`, and so on.

 * Avoid dependencies not in Python’s standard library.

   You can add conditional functionality depending on whether a specific library is
   installed.

 * Don’t use threads.

   While threads are a useful construct in application code, they do not belong in
   library code without good reason.

C-Specific:

 * Use of `goto` is better than deeply nested blocks.

 * Return type and storage specifiers should be on their own line.

   For example, use the following format

    ```
    static PyObject*
    do_something(PyObject *self, PyObject *args, ...)
    {
        /** ... **/
    }
    ```

   rather than this format

    ```
    static PyObject *do_something(PyObject *self, PyObject *args)
    {
        /** ... **/
    }
    ```

 * Code must compile with the following flags (for GCC or clang):

   `-std=c89 -pedantic -Wall -Wextra -Werror \ -Wno-long-long
   -Wno-missing-field-initializers`

 * Non-static functions must have a `pycbc_` prefix.

 * Functions exposed as Python methods must be named using the following pattern:
   `pycbc_<Object>_<Method>`.

   In this pattern, `<Object>` is the name of the class in the SDK and `<Method>`
   is the name of the method. For example, if you add a `get` method to the
   `Connection` class, name the new method `pycbc_Connection_get`.

 * Code should be portable to Win32.

   Therefore, include only standard library headers and use `PyOS_*` functions when
   needed.

<a id="couchbase-sdk-python-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Python. To browse or submit new issues, see [Couchbase
Client Library Python Issues
Tracker](http://www.couchbase.com/issues/browse/PYCBC).

<a id="couchbase-sdk-python-rn_1-0-0g"></a>

## Release Notes for Couchbase Client Library Python 1.0.0 GA (1 July 2013)

This is the first general availability (GA) release.

**New Features and Behaviour Changes in 1.0.0**

 * Enable `Transcoder` to be a class as well as an instance. Fixes some common
   misuses. If a class, a new instance is created.

   *Issues* : [PYCBC-135](http://www.couchbase.com/issues/browse/PYCBC-135)

**Fixes in 1.0.0**

 * Creating and destroying many Couchbase instances crash program. This happened
   because of an extra refcount decrement.

   *Issues* : [PYCBC-140](http://www.couchbase.com/issues/browse/PYCBC-140)

 * Observe crashes when used against clusters with replicas.

   *Issues* : [PYCBC-146](http://www.couchbase.com/issues/browse/PYCBC-146)

<a id="couchbase-sdk-python-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library Python 1.0.0 Beta (17 June 2013)

This version builds upon previous APIs. It provides new APIs for querying views
and managing design documents.

**New Features and Behaviour Changes in 1.0.0**

 * New `query` method and paginated view iterator. View querying is now more
   efficient and streamlined with the new `query` method. The older `_view` method
   has been removed.

   *Issues* : [PYCBC-7](http://www.couchbase.com/issues/browse/PYCBC-7),
   [PYCBC-9](http://www.couchbase.com/issues/browse/PYCBC-9),
   [PYCBC-27](http://www.couchbase.com/issues/browse/PYCBC-27),
   [PYCBC-41](http://www.couchbase.com/issues/browse/PYCBC-41),
   [PYCBC-83](http://www.couchbase.com/issues/browse/PYCBC-83)

 * Low-level observe command wraps the `libcouchbase` implementation.

   *Issues* : [PYCBC-36](http://www.couchbase.com/issues/browse/PYCBC-36)

 * The `Connection` object can now be used safely across multiple threads by
   default. Tuning the behavior among multiple threads can be changed by the
   `lockmode` constructor option.

   *Issues* : [PYCBC-125](http://www.couchbase.com/issues/browse/PYCBC-125)

 * An API to change default JSON and Pickle converters is provided. This allows the
   user to select a more performant implementation. Note that this affects only the
   JSON and Pickle conversion performed with key-value operations, not with views.

   *Issues* : [PYCBC-124](http://www.couchbase.com/issues/browse/PYCBC-124)

 * A new set of design document methods provides simple methods for creating,
   fetching, and removing design documents. These replace the older `_design`
   method.

   *Issues* : [PYCBC-64](http://www.couchbase.com/issues/browse/PYCBC-64),
   [PYCBC-68](http://www.couchbase.com/issues/browse/PYCBC-68)

**Fixes in 1.0.0**

 * The `quiet` parameter was not being used if passed in the constructor.

   *Issues* : [PYCBC-136](http://www.couchbase.com/issues/browse/PYCBC-136)

 * Multi-arithmetic ( `incr_multi`, `decr_multi` ) does not change the value. These
   functions appeared to work and did not return an error, but did not actually
   modify the value.

   *Issues* : [PYCBC-138](http://www.couchbase.com/issues/browse/PYCBC-138)

 * `unlock_multi` does not raise an exception on missing CAS. This has been fixed
   because unlock must have a CAS.

   *Issues* : [PYCBC-](http://www.couchbase.com/issues/browse/PYCBC-)

 * Crash when specifying `host:port` in a single string. This is still illegal, but
   it now raises an exception and does not crash.

   *Issues* : [PYCBC-130](http://www.couchbase.com/issues/browse/PYCBC-130)

 * A more informative message is returned if an empty string is passed to `get`.
   Previously, it returned `InvalidArgument` without more information. The client
   now checks for this and displays more helpful information.

   *Issues* : [PYCBC-131](http://www.couchbase.com/issues/browse/PYCBC-131)

 * Client crashes if an invalid hostname is passed. Certain variants of bad
   hostnames (such as those with illegal characters) will have `libcouchbase`
   return an error code the client cannot handle and will thus crash the program.

   *Issues* : [PYCBC-128](http://www.couchbase.com/issues/browse/PYCBC-128)

 * Lock without TTL fails with an erroneous 'Encoding Error'. The client now throws
   a more informative exception.

   *Issues* : [PYCBC-132](http://www.couchbase.com/issues/browse/PYCBC-132)

 * Client crashes if duplicate keys are passed in `*_multi` methods.

   *Issues* : [PYCBC-134](http://www.couchbase.com/issues/browse/PYCBC-134)

<a id="couchbase-sdk-python-rn_0-11-1"></a>

## Release Notes for Couchbase Client Library Python 0.11.1 Beta (29 May 2013)

This version maintains the 0.10.0 API, while adding some new features and fixing
some additional bugs.

**New Features and Behaviour Changes in 0.11.1**

 * Basic HTTP/Views support (experimental): `view` and `design` methods are now
   available.

   *Issues* : [PYCBC-105](http://www.couchbase.com/issues/browse/PYCBC-105)

 * Add bucket attribute to show bucket name.

   *Issues* : [PYCBC-119](http://www.couchbase.com/issues/browse/PYCBC-119)

 * Allow Python 3 `dict_keys` objects to be passed into the multi\_\* methods.

   *Issues* : [PYCBC-107](http://www.couchbase.com/issues/browse/PYCBC-107)

 * Add `touch` command.

   *Issues* : [PYCBC-115](http://www.couchbase.com/issues/browse/PYCBC-115)

 * Add `unlock` and `lock` commands.

   *Issues* : [PYCBC-61](http://www.couchbase.com/issues/browse/PYCBC-61),
   [PYCBC-104](http://www.couchbase.com/issues/browse/PYCBC-104)

 * User-defined transcoder classes can be used to override or supplement the
   default serialization of keys and values.

   *Issues* : [PYCBC-92](http://www.couchbase.com/issues/browse/PYCBC-92)

 * Expose list of nodes

   *Issues* : [PYCBC-106](http://www.couchbase.com/issues/browse/PYCBC-106)

 * Pretty print `repr` and `str` for common objects.

   *Issues* : [PYCBC-112](http://www.couchbase.com/issues/browse/PYCBC-112),
   [PYCBC-118](http://www.couchbase.com/issues/browse/PYCBC-118)

**Fixes in 0.11.1**

 * Passing a negative time to live (TTL) now throws an exception. Previously, this
   resulted in an integer underflow.

   *Issues* : [PYCBC-109](http://www.couchbase.com/issues/browse/PYCBC-109)

 * Memory leak on each storage operation.

   *Issues* : [PYCBC-123](http://www.couchbase.com/issues/browse/PYCBC-123)

 * JSON format is now more efficient for Unicode values. Previously, JSON would be
   encoded in ASCII-safe mode. 0.11 allows encoding in UTF-8 mode.

   *Issues* : [PYCBC-108](http://www.couchbase.com/issues/browse/PYCBC-108)

 * Memory leak on some exceptions. If bad arguments were received, the exception
   handling code would leak memory.

   *Issues* : [PYCBC-111](http://www.couchbase.com/issues/browse/PYCBC-111)

<a id="couchbase-sdk-python-rn_0-10-0"></a>

## Release Notes for Couchbase Client Library Python 0.10.0 Beta (16 May 2013)

This version rewrites the client again, still using `libcouchbase`, but this
time using the native Python C API. Specifically this means:

 * Cython is no longer required for the build.

 * Code works on Visual Studio compilers (and can be used on Microsoft Windows).

Additionally, the API was changed with respect to return values. Currently most
API functions return a `Result` (or a subclass thereof).

The rewrite is filed as PYCBC-103.

**Known Issues in 0.10.0**

 * Support for byte values.

   *Issues* : [PYCBC-103](http://www.couchbase.com/issues/browse/PYCBC-103)

 * Formal specification for key types - keytypes should currently be a Python
   Unicode object.

   *Issues* : [PYCBC-66](http://www.couchbase.com/issues/browse/PYCBC-66),
   [PYCBC-91](http://www.couchbase.com/issues/browse/PYCBC-91)

 * Client-side timeout can be set via the `timeout` property.

   *Issues* : [PYCBC-58](http://www.couchbase.com/issues/browse/PYCBC-58)

<a id="couchbase-sdk-python-rn_0-9-0"></a>

## Release Notes for Couchbase Client Library Python 0.9.0 Beta (29 April 2013)

This version is the initial rewrite of the Python library using `libcouchbase`.
The installation now requires a C compiler and `libcouchbase`.

**New Features and Behaviour Changes in 0.9.0**

 * Basic key-value functionality, including:

    * get

    * set

    * add

    * replace

    * delete

    * append

    * prepend

    * incr

    * decr

**Fixes in 0.9.0**

 * Most of the issues fixed by this release are older bugs closed out from the
   0.8.x client and were implicitly fixed by the rewrite.

   *Issues* : [PYCBC-6](http://www.couchbase.com/issues/browse/PYCBC-6),
   [PYCBC-11](http://www.couchbase.com/issues/browse/PYCBC-11),
   [PYCBC-24](http://www.couchbase.com/issues/browse/PYCBC-24),
   [PYCBC-26](http://www.couchbase.com/issues/browse/PYCBC-26),
   [PYCBC-28](http://www.couchbase.com/issues/browse/PYCBC-28),
   [PYCBC-29](http://www.couchbase.com/issues/browse/PYCBC-29),
   [PYCBC-56](http://www.couchbase.com/issues/browse/PYCBC-56),
   [PYCBC-62](http://www.couchbase.com/issues/browse/PYCBC-62),
   [PYCBC-73](http://www.couchbase.com/issues/browse/PYCBC-73),
   [PYCBC-75](http://www.couchbase.com/issues/browse/PYCBC-75)

**Known Issues in 0.9.0**

 * Version 0.9.0 blocks all Python threads.

<a id="couchbase-sdk-python-rn_0-8-0"></a>

## Release Notes for Couchbase Client Library Python 0.8.0 Beta (1 September 2012)

**Known Issues in 0.8.0**

 * View queries on authenticated buckets are not currently supported.

 * "id" values from view rows must be converted to strings to be used with
   Memcached API.

    ```
    view = bucket.view("_design/beer/_view/by_name")
    for row in view:
     id = row["id"].__str__()
     beer = bucket.get(id)
     #do something
    ```

 * Exception is thrown on key not found errors with unified client.

    ```
    try:
     bucket.get("key_that_does_not_exist")
    except:
     #couchbase.exception.MemcachedError
    ```

<a id="couchbase-sdk-python-rn_0-7-2"></a>

## Release Notes for Couchbase Client Library Python 0.7.2 Beta (August 2012)

**Fixes in 0.7.2**

 * Install with PyPi failing due to missing version number, now fixed.

   *Issues* : [PYCBC-51](http://www.couchbase.com/issues/browse/PYCBC-51)

 * Install dependencies via setup.py rather than including them in the source
   distribution

   *Issues* : [PYCBC-52](http://www.couchbase.com/issues/browse/PYCBC-52)

 * Improve bucket creation defaults:

    * `ramQuotaMB` is now set to 100 by default

    * `authType` is set to sasl by default

    * Several assets are included for better error catching and reporting on invalid
      combinations or values.

    * Server-side validation is now being done to check for port duplicates, name
      taken, and similar checks.

   *Issues* : [PYCBC-53](http://www.couchbase.com/issues/browse/PYCBC-53)

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

 * SDK now requires Python 2.6.

 * SDK can now handle server restarts/warmups. Can handle functioning Couchbase
   Server that is loading data from disk after restart.

 * Introduced VBucketAwareClient which extends MemcachedClient with
   Membase/Couchbase specific features.

**Fixes in 0.7.0**

 * Deprecated Server() in favor of Couchbase() for the unified client name

 * Added Apache License headers to all files

 * Globally, logging is no longer disabled; fixes PYCBC-31.

   *Issues* : [PYCBC-31](http://www.couchbase.com/issues/browse/PYCBC-31)

 * Renamed VBucketAwareCouchbaseClient to CouchbaseClient.

 * Set() now works with integer values; fixes PYCBC-15.

   *Issues* : [PYCBC-15](http://www.couchbase.com/issues/browse/PYCBC-15)

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

 * Deprecating getMulti for pep8-compliant multi-get.

 * Fixed.save() method; fixes MB-5609.

   *Issues* : [MB-5609](http://www.couchbase.com/issues/browse/MB-5609),
   [MB-5609](http://www.couchbase.com/issues/browse/MB-5609)

 * Deprecated `get_view` as it was a duplicate of `view_results`.

 * SDK now working with mixed clusters, including clusters with memcached type
   buckets.

 * Can now create memcached buckets

 * Set() now returns a proper status in the unified Couchbase() client 0.7.0.

 * Better handling of topology changes; fixes PYCBC-4.

   *Issues* : [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4),
   [PYCBC-4](http://www.couchbase.com/issues/browse/PYCBC-4)

 * `init_cluster` function has been removed.

 * SDK can now created memcached buckets.

 * Greater than 50% of SDK covered by unit tests; fixes PYCBC-46.

   *Issues* : [PYCBC-46](http://www.couchbase.com/issues/browse/PYCBC-46)

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