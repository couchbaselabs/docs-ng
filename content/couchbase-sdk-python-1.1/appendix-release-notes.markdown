# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Python. To browse or submit new issues, see [Couchbase
Client Library Python Issues
Tracker](http://www.couchbase.com/issues/browse/PYCBC).

<a id="couchbase-sdk-python-rn_1-1-0g"></a>

## Release Notes for Couchbase Python SDK 1.1.0 GA (1 October 2013)

This is the second release. This adds API additions and improvements
on top of the 1.0.0 release.

**Fixes In 1.1.0**

 * Minor documentation errata fixes

 * Add `OBS_LOGICALLY_DELETED` which was referenced but not defined.
   Used by 'observe'

 * Fix potential crash if HTTP view request cannot be scheduled

 * Fix view queries with many keys.
   Previously this would return a server error indidcating the URI was too
   long.

   *Issues*: [PYCBC-193](http://www.couchbase.com/issues/browse/PYCBC-193)

 * `lockmode` parameter not being propagated from `Couchbase.connect`
   constructor. This would result in the `lockmode` always being set to
   `LOCKMODE_EXC` despite it being overidden in the arguments

   *Issues*: [PYCBC-192](http://www.couchbase.com/issues/browse/PYCBC-192)


**New Features In 1.1.0**

 * Durability/Persistence requirements.
   This feature allows the application to wait until key(s) have been
   stored to more than one node. This is done through the additional
   `persist_to`/`replicate_to` parameters in the `set()` family of methods.
   A standalone method, `endure()` is provided as well.
   These features use the new Durability API implemented in libcouchbase

   *Issues*: [PYCBC-37](http://www.couchbase.com/issues/browse/PYCBC-37)

 * Experimental GEvent support
   Gevent is a cooperative multi tasking framework which allows
   the creation of "greenlets" which are cooperatively scheduled
   entities. This feature allows the couchbase.Connection object
   to optionally use a different pure-python non-blocking I/O
   implementation which can cooperatively yield to other greenlets
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
   New format specifier which allows the SDK to guess the appropriate
   value storage format depending on the value type.

   *Issues*: [PYCBC-157](http://www.couchbase.com/issues/browse/PYCBC-157)


 * `no_format` argument for `get()`
   Allows a value to be retrieved in its raw representation; i.e. as it
   is stored on the server without any conversion applied. This feature
   is provided as an additional keyword argument (`no_format`) to the
   `get()` family of methods

 * Replica Read
   Allow reading from a replica server. This may be used if a normal
   `get()` fails. This functionality is exposed via the `replica` parameter
   to the 'get()' method as well as the 'rget()' method.

   *Issues*: [PYCBC-38](http://www.couchbase.com/issues/browse/PYCBC-38)

**Known Issues in 1.1.0**

 * 'syncwait' parameter for view creation will time out if new design
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
