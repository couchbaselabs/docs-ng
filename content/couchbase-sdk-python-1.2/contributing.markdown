<a id="_contributing"></a>

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

    ```c
static PyObject\*
do_something(PyObject \*self, PyObject \*args, ...)
{
    /\*\* ... \*\*/
}
```

   rather than this format

    ```c
static PyObject \*do_something(PyObject \*self, PyObject \*args)
{
    /\*\* ... \*\*/
}
```

 * Code must compile with the following flags (for GCC or clang):

    ```
-std=c89 -pedantic -Wall -Wextra -Werror -Wno-long-long -Wno-missing-field-initializers
```

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
