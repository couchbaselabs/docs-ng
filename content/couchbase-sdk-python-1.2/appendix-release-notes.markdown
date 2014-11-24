# Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Python. To browse or submit new issues, see [Couchbase
Client Library Python Issues
Tracker](http://www.couchbase.com/issues/browse/PYCBC).

<a id="couchbase-sdk-python-rn_1-2-4"></a>
## Release Notes for Couchbase Python SDK 1.2.4 (10 October 2014)

This release provides some minor bug fixes for the 1.2 series

**Fixes in 1.2.4**
 * The `design_publish` method will no longer delete the old 'development mode'
   view when it is published into a 'production mode' view. This is to ensure
   consistent behavior between the web UI and the SDK

   **Issues**: [PYCBC-259](http://couchbase.com/issues/browse/PYCBC-259)

 * Allow building on (Apple's) OS X Python
   This adds the `/usr/local/` to the linker and preprocessor search paths,
   if the setup.py script detects that it is being invoked as `/usr/bin/python`.
   Newer versions of OS X no longer automatically add `/usr/local` as a default
   search path

<a id="couchbase-sdk-python-rn_1-2-3g"></a>
## Release Notes for Couchbase Python SDK 1.2.3 GA (2 September 2014)

This release provides some minor bug fixes for the 1.2 series.

**Fixes in 1.2.3**

* Fix potential hang in Twisted integration module

  **Issues**: [PYCBC-257](http://www.couchbase.com/issues/browse/PYCBC-257)

* Handle non-CouchbaseError exceptions thrown in callbacks and avoid crashes

  Sometimes a non-CouchbaseError is thrown within operation callbacks,
  usually due to a bad encoding or other environmental issues (such as memory
  allocation failures). This should be delivered to the user and not crash
  the application.

  **Issues**: [PYCBC-253](http://www.couchbase.com/issues/browse/PYCBC-253)

* Fix various error message and documentation errata

  **Issues**: [PYCBC-254](http://www.couchbase.com/issues/browse/PYCBC-254)
    [PYCBC-252](http://www.couchbase.com/issues/browse/PYCBC-252)

<a id="couchbase-sdk-python-rn_1-2-2g"></a>
## Release Notes for Couchbase Python SDK 1.2.2 GA (1 July 2014)

This release provides some minor bug fixes for 1.2.1

**New Features and Behavior Changes in 1.2.2**

* The `_cntl()` method now accepts a `value_type` argument. This can be used to
  further modify settings not exposed in the SDK itself. The `value_type` describes
  the underlying C type to be used for the setting.

  **Issues**: [PYCBC-247](http://couchbase.com/issues/browse/PYCBC-247)

* The _libcouchbase_ library embedded with the Windows installer has been
  upgraded to 2.3.2

**Fixes in 1.2.2**

* When publishing a design document, poll the newly published view after the
  older view has been deleted. This allows more reliability of the view being
  operational immediately after the `design_publish()` method returns.

* Fixed potential freed memory access within the `stats()` method when
  using asynchronous frameworks like Twisted or gevent.

  **Issues**: [PYCBC-248](http://couchbase.com/issues/browse/PYCBC-248)

<a id="couchbase-sdk-python-rn_1-2-1g"></a>
## Release Notes for Couchbase Python SDK 1.2.1 GA (5 June 2014)

This release provides many bug fixes for 1.2.0. This also includes
added functionality via _libcouchbase_ 2.3.1. For Windows distributions,
the built in libcouchbase has been upgraded to version 2.3.1

**New Features and Behavior Changes in 1.2.1**

* Use compact JSON encoding when serializing documents to JSON.

    The default Python `json.dumps` inserts white space around
    commas and other JSON tokens, while increasing readability when
    printing to the screen. This also inflates the value size stored
    inside the database and the transfer size when sending
    and receiving the item to and from the cluster. Version 1.2.1
    now uses the `separators` argument to only use the tokens without
    their white space padding.

    *Issues*: [PYCBC-231](http://couchbase.com/issues/browse/PYCBC-231)

* Added _master-only_ `observe()` method to efficiently check for the
  existence and CAS of an item.

    This feature utilizes functionality from libcouchbase 2.3.x and allows
    the usage of the `observe()` method to check for the existence of an
    item. In contrast to a normal observe that probes the item's master
    and replica nodes resulting in multiple packets, the _master-only_
    observe contacts the master only. The return value for
    the `observe()` method is still the same, so the actual results are
    present inside the `value` field, which is an array. Because
    only one node is contacted there is only ever a single element in the array.

    ```
    result = cb.observe("key", master_only=True).value[0]
    print "CAS for item is {0}".format(result.cas)
    ```

    This feature requires libcouchbase 2.3.0 or later.

    *Issues*: [PYCBC-225](http://couchbase.com/issues/browse/PYCBC-225)

* Provide semantic base exception classes.

    This adds support for additional semantically-grouped base exceptions
    that may act as the superclasses of other exceptions thrown within
    the library. This means that applications are now able to catch
    the semantic base class and filter further exception handling based
    on the specified categories. This also allows the library to return
    more detailed exception codes in the future (for example, a possible
    `ConnectionRefusedError` rather than `NetworkError`) without breaking
    application-side expectations and `try`/`except` logic. The new base
    classes include `CouchbaseNetworkError` (for network-based failures),
    `CouchbaseDataError` (for CRUD failures), and `CouchbaseTransientError`
    (for errors that are likely to be corrected if the operation is retried).

    This feature requires _ibcouchbase 2.3.0 or later.

    *Issues*: [PYCBC-241](http://couchbase.com/issues/browse/PYCBC-241)

* Twisted and gevent Integration modules are no longer experimental.

    The inclusion of the `couchbase.experimental` module is no longer
    needed to enable the functionality of Twisted and gevent. Existing
    code importing the `experimental` module will still function and
    will still retain the full stability of the Twisted and gevent
    modules.

    *Issues*: [PYCBC-221](http://couchbase.com/issues/browse/PYCBC-221)

* New `--batch` parameter for `bench.py` benchmark script

    This option allows benchmarking using multi operations. If this
    value is set to more than `1`, then _n_ commands are batched.

* Provide `_cntl` method to directly manipulate libcouchbase settings.

    This **unsupported** method sends proxy calls into `lcb_cntl()` to better
    help adjust and tune library settings when deemed necessary. This exists
    mainly as a path to debug and test certain situations, and to provide
    an upgrade path to newer versions of libcouchbase that contain features
    not yet directly exposed by this library. As the documentation and the
    method name suggest, this is not considered a public API and should not be
    used unless otherwise specified.

    *Issues*: [PYCBC-224](http://couchbase.com/issues/browse/PYCBC-224)


**Fixes in 1.2.1**

* Fix build failures when building in a subdirectory of a Git repository.

    Errors would be encountered when building in a subdirectory of a Git
    repository because the `couchbase_version.py` script would invoke
    `git describe` to determine the version being used. If the distribution
    directory was not a Git repository but the parent directory was a Git
    repository, `git describe` would output the parent project's version
    information. This has been fixed in 1.2.1 where `git describe` is
     invoked only if the top-level `.git` directory exists within the
    distribution.

    *Issues*: [PYCBC-220](http://couchbase.com/issues/browse/PYCBC-220)

* Fix hanging in `select` module when no I/O was pending.

    This applies to the `select` module that is used when the
    `enable_experiemental_gevent_support` option is used (which should
    _not_ be confused with `gcouchbase`). A symptom of this issue is
    that certain events would not be delivered and the application
    would be blocked.


* Fix hang in `txcouchbase` when connection is dropped.

    A `write` event is delivered to libcouchbase when the connection is
    dropped, so that it can detect a connection error and close
    the socket. Previously this would manifest itself as infinitely
    hanging in the case of connection failures (or excessive timeouts)
    because events on the socket would no longer be delivered.

* Correct erroneous conflation of `persist_to` and `replicate_to` in `set()` method.

    This fixes a typo that resulted in the meanings of these two parameters to
    be inverted, such that `persist_to` would mean how many nodes to replicate
    to, and `replicate_to` would mean how many nodes the item should be persisted
    on. This issue is manifest in unexpected timeouts.

    *Issues*: [PYCBC-228](http://couchbase.com/issues/browse/PYCBC-228)
        [PYCBC-242](http://couchbase.com/issues/browse/PYCBC-242)

* Prevent application core dump when a python exception is thrown in a
  user-defined transcoder.

    Previously if an exception was thrown in a user defined `Transcoder` object
    (for example, because conversion failed) this would not properly be caught by the
    library and would result in an application crash. This has been fixed and
    Python exceptions are now wrapped inside a `CouchbaseError` which is now
    propagated back to the application

    *Issues*: [PYCBC-232](http://couchbase.com/issues/browse/PYCBC-232)

* Fix truncated row results and crashes when invoking other methods during
  iteration over a `View` object, or when using `include_docs`.

    This fixes an erroneous assumption that the internal fetch method for
    the iterator (that is, `_fetch()`) was the only entry point in which new results
    would be returned. However if a `get()` or other Couchbase method was invoked,
    then any pending socket data would also be delivered to the callback. This has
    now been corrected to no longer assume that `_fetch()` is the only entry point.
    The library now relies on the completion callback from libcouchbase only.

    *Issues*: [PYCBC-223](http://couchbase.com/issues/browse/PYCBC-223)
        [PYCBC-236](http://couchbase.com/issues/browse/PYCBC-236)


* Rename `conncache` parameter to `config_cache`.

    This renames the constructor parameter for the _Configuration Cache_ feature.
    The older name is still accepted but is deprecated.

    *issues*: [PYCBC-221](http://couchbase.com/issues/browse/PYCBC-221)


<a id="couchbase-sdk-python-rn_1-2-0g"></a>
## Release Notes for Couchbase Python SDK 1.2.0 GA (7 January 2014)

This release provides support for additional asynchronous interfaces,
adds some additional convenience features, and fixes various bugs related
to views.

**New Features and Behavior Changes in 1.2.0**

* Native gevent support

	This feature adds native gevent support by means of an additional `gcouchbase` package. This supersedes the gevent support in the 1.1.0 release. Gevent supported versions are 0.13 and 1.0.0

	*Issues*: [PYCBC-207](http://www.couchbase.com/issues/browse/PYCBC-207)

* Twisted Support

	This feature adds an asynchronous API for use with the Twisted I/O framework
   for Python. Support is provided via the `txcouchbase` package. All known
   recent versions of Twisted are supported.

	 *Issues*: [PYCBC-194](http://www.couchbase.com/issues/browse/PYCBC-194)

* Durability Context Manager

	This feature provides a context manager to affect the durability
   settings for all operations executed in its scope. This can be used with
   the python `with` keyword as an alternative to manually specifying the
   `persist_to` and `replicate_to` parameters for each operation individually.

	*Issues*: [PYCBC-201](http://www.couchbase.com/issues/browse/PYCBC-201)

* Multioperation Pipeline

	This feature provides a batched operation context manager in which multiple
   operations of different types can be batched together for execution. This
   might improve performance as it reduces network latency by sending all
   scheduled operations after the context manager exits, rather than sending each
   operation individually. This has the same network performance benefits as using
   the `*_multi` methods, but without requiring that all operations be of the
   same type. The `_multi` operations have other API and performance
   benefits and should still be preferred over the pipeline context manager when
   possible. The pipeline manager itself can also contain
   `_multi`  operations in its own right.

	*Issues*: [PYCBC-211](http://www.couchbase.com/issues/browse/PYCBC-211)


**Fixes in 1.2.0**

* Streaming view parser sometimes provides invalid JSON

	The streaming view parser sometimes drops the last `}` from the response,
   resulting in an error. This affects only query operations where `streaming=True`.

	*Issues*: [PYCBC-206](http://www.couchbase.com/issues/browse/PYCBC-206)

* Views queries malfunction if the `mapkey_single` or `mapkey_multi` fields are over 150 characters.

	This was caused by multiple bugs in the library, such as placing an artificial limit on the URI size to 150 characters and placing extra such parameters via a `POST` request.

	*Issues*: [PYCBC-203](http://www.couchbase.com/issues/browse/PYCBC-203)
[PYCBC-199](http://www.couchbase.com/issues/browse/PYCBC-199)

* Durability options missing from `delete()` method

	The `delete` method was missing the processing of durability options
   (e.g. `persist_to` and `replicate_to`).

	*Issues*: [PYCBC-195](http://www.couchbase.com/issues/browse/PYCBC-195)

* Negative `persist_to` and `replicate_to` values not honored

	A negative value should indicate "use all available nodes", but was not
   being honored as such in all code paths.

	*Issues*: [PYCBC-200](http://www.couchbase.com/issues/browse/PYCBC-200)


<a id="couchbase-sdk-python-rn_1-1-0g"></a>

## Release Notes for Couchbase Python SDK 1.1.0 GA (1 October 2013)

This is the second release. This adds API additions and improvements
on top of the 1.0.0 release.


**New Features and Behavior Changes in 1.1.0**

 * Durability requirements

	This feature allows the application to wait until keys have been
   stored to more than one node. This is done through the additional
   `persist_to` and `replicate_to` parameters in the `set()` family of methods.
   A standalone method, `endure()` is provided as well.
   These features use the new Durability API implemented in libcouchbase.

	*Issues*: [PYCBC-37](http://www.couchbase.com/issues/browse/PYCBC-37)

 * Experimental gevent support

	gevent is a cooperative multitasking framework that allows
   the creation of greenlets, which are cooperatively scheduled
   entities. This feature allows the `couchbase.Connection` object
   to optionally use a different pure-python non-blocking I/O
   implementation that can cooperatively yield to other greenlets
   when needed.

 * Item API

	Item API allows an application to use its own objects and pass
   them into the various methods of couchbase.Connection where they
   will be populated with the relevant key status/value information.
   This allows an application developer to create custom subclasses
   of the Item object which can be seamlessly used across both the SDK
   and the application code.

	*Issues*: [PYCBC-156](http://www.couchbase.com/issues/browse/PYCBC-156)

 * Automatic storage formatting via `FMT_AUTO`

	New format specifier that allows the SDK to guess the appropriate
   value storage format depending on the value type.

	*Issues*: [PYCBC-157](http://www.couchbase.com/issues/browse/PYCBC-157)

 * `no_format` argument for `get()`

	Allows a value to be retrieved in its raw representation (that is, as it
   is stored on the server without any conversion applied). This feature
   is provided as an additional keyword argument, `no_format`, to the
   `get()` family of methods.

 * Replica Read

	Allow reading from a replica server. This can be used if a normal
   `get()` fails. This functionality is exposed via the `replica` parameter
   to the `get()` method and the `rget()` method.

	*Issues*: [PYCBC-38](http://www.couchbase.com/issues/browse/PYCBC-38)

**Fixes In 1.1.0**

 * Minor documentation errata fixes

 * Add `OBS_LOGICALLY_DELETED`, which was referenced but not defined.
   Used by `observe`.

 * Fix potential crash if HTTP view request cannot be scheduled

 * Fix view queries with many keys.
   Previously this would return a server error indicating the URI was too
   long.

	*Issues*: [PYCBC-193](http://www.couchbase.com/issues/browse/PYCBC-193)

 * `lockmode` parameter not propagated from `Couchbase.connect`
   constructor. This would result in the `lockmode` always being set to
   `LOCKMODE_EXC` despite it being overridden in the arguments.

	*Issues*: [PYCBC-192](http://www.couchbase.com/issues/browse/PYCBC-192)


**Known Issues in 1.1.0**

 * `syncwait` parameter for view creation will time out if new design
   document only contains spatial views

	*Issues*: [PYCBC-173](http://www.couchbase.com/issues/browse/PYCBC-173)


<a id="couchbase-sdk-python-rn_1-0-0g"></a>

## Release Notes for Couchbase Client Library Python 1.0.0 GA (1 July 2013)

This is the first general availability (GA) release.

**New Features and Behavior Changes in 1.0.0**

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

**New Features and Behavior Changes in 1.0.0**

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

**New Features and Behavior Changes in 0.11.1**

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

**New Features and Behavior Changes in 0.9.0**

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

**New Features and Behavior Changes in 0.7.1**

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

**New Features and Behavior Changes in 0.7.0**

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
