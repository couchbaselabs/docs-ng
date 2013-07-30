# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library C. To browse or submit new issaues, see [Couchbase
Client Library C Issues Tracker](http://www.couchbase.com/issues/browse/CCBC).

<a id="couchbase-sdk-c-rn_1-0-7"></a>

## Release Notes for Couchbase Client Library C 1.0.7 GA (12 October 2012)

**New Features and Behaviour Changes in 1.0.7**

 * Extract cbc tool into separate package (DEB/RPM) with -bin suffix.

<a id="couchbase-sdk-c-rn_1-0-6"></a>

## Release Notes for Couchbase Client Library C 1.0.6 GA (30 August 2012)

**Fixes in 1.0.6**

 * Release ringbuffer in libcouchbase\_purge\_single\_server()

   *Issues* : [CCBC-92](http://www.couchbase.com/issues/browse/CCBC-92)

<a id="couchbase-sdk-c-rn_1-0-5"></a>

## Release Notes for Couchbase Client Library C 1.0.5 GA (15 August 2012)

**Fixes in 1.0.5**

 * Fix switching to backup node in case of server outage

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

 * Reset timer for commands with NOT\_MY\_VBUCKET response

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

<a id="couchbase-sdk-c-rn_1-0-4"></a>

## Release Notes for Couchbase Client Library C 1.0.4 GA (01 June 2012)

**Fixes in 1.0.4**

 * Several fixes related to tests and topology changes in corner conditions were
   added, in additional to the items described below.

 * A hang could occur in libcouchbase\_wait() after the timeout period.

   *Issues* : [CCBC-62](http://www.couchbase.com/issues/browse/CCBC-62)

 * Timeouts can occur during topology changes, rather than be correctly retried.

   *Issues* : [CCBC-64](http://www.couchbase.com/issues/browse/CCBC-64)

 * A small memory leak can occur with frequent calls to libcouchbase\_create() and
   libcouchbase\_destroy()

   *Issues* : [CCBC-65](http://www.couchbase.com/issues/browse/CCBC-65)

<a id="couchbase-sdk-c-rn_1-0-3"></a>

## Release Notes for Couchbase Client Library C 1.0.3 GA (02 May 2012)

**Fixes in 1.0.3**

 * In addition to the buffer overflow (CCBC-33) fixes for buffer handling in the
   event of a server being disconnected have been integrated.

 * A fix for a buffer overflow with the supplied password as reported in RCBC-33
   has been integrated. While it is a buffer overflow issue, this is not considered
   to be a possible security issue because the password to the bucket is not
   commonly supplied by an untrusted source.

   *Issues* : [CCBC-33](http://www.couchbase.com/issues/browse/CCBC-33)

<a id="couchbase-sdk-c-rn_1-0-2"></a>

## Release Notes for Couchbase Client Library C 1.0.2 GA (06 March 2012)

**Fixes in 1.0.2**

 * The source will now emit deb packages and apt repositories are available.

   *Issues* : [CCBC-31](http://www.couchbase.com/issues/browse/CCBC-31)

 * Support for Windows via Microsoft Visual C 9 has been added to this version.

   Support for multiple bootstrap URLs has now been added. This will ensure that if
   one node of the cluster becomes unaavilable for some reason and the client
   becomes unavailable, it can still bootstrap off of remaining nodes in the
   cluster. Host/port combinations are provided to the libcouchbase\_create()
   function semicolon delimited. See the header file in libcouchbase/couchbase.h
   for more usage information.

   Several fixes and enhancements for the example application, cbc, have been
   included. Now cbc supports better usage messages, standard out support for cp,
   and timeouts.

<a id="couchbase-sdk-c-rn_1-0-1"></a>

## Release Notes for Couchbase Client Library C 1.0.1 GA (13 February 2012)

**Fixes in 1.0.1**

 * A fix to allow the client library to failover automatically to other nodes when
   the initial bootstrap node becomes unavailable has been added. All users are
   recommended to upgrade for this fix.

 * Operations will now timeout rather than hang forever in some failure scenarios.

 * Release 1.0.1 of the Couchbase C Client Library is a rollup maintenance covering
   issues discovered subsequent to the 1.0.0 release.

   Error handling is better in a number of corner conditions such as during tests,
   when shutting down, handling timeouts during initial connection, minor
   memory-handling errors with libevent

   Support for building libcouchbase as static to support embedding has been added.
   This approach isn't encouraged, but makes sense in some cases.

   Support for building libcouchbase without a C++ compiler has been added,
   simplifying some environments where it will only be used from C.

 * A fix address incorrect SASL authentication handling when SASL authentication is
   already underway was integrated.

 * A fix to allow the client library to handle retrying a given operation in the
   case that the cluster has gone through a topology change has been integrated.
   Without this fix, software using this library can receive unexpected errors.

<a id="couchbase-sdk-c-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library C 1.0.0 GA (22 January 2012)

**New Features and Behaviour Changes in 1.0.0**

 * This is the first stable release of the Couchbase C Client Library. It is a
   callback based C client library designed to work with Couchbase Server. It is
   frequently used when building higher level client libraries.

   Known client libraries based on this one include the Couchbase Ruby, the
   Couchbase PHP library and an experimental Perl library.

 * Add make targets to build RPM and DEB packages

 * Aggregate flush responses

 * Allow libcouchbase build with libevent 1.x (verified for 1.4.14)

 * Allow config for cbc tool to be read from.cbcrc

   *Issues* : [CCBC-37](http://www.couchbase.com/issues/browse/CCBC-37)

 * Remove <memcached/vbucket.h> dependency

 * Disable Views support

 * Gracefully update vbucket configuration. This means that the connection
   listener, could reconfigure data sockets on the fly.

 * Allow the user to specify sync mode on an instance

 * New command cbc. This command intended as the analog of mem\* tools from
   libmemcached distribution. Supported commands:

    * cbc-cat

    * cbc-cp

    * cbc-create

    * cbc-flush

    * cbc-rm

    * cbc-stats

    * cbc-send

    * cbc-receive

 * Add stats command

**Fixes in 1.0.0**

 * Aggregate flush responses

 * Don't accept NULL as a valid "callback"

 * Convert flags to network byte order

**Known Issues in 1.0.0**

 * If the bootstrap node fails, the client library will not automatically fail over
   to another node in the cluster. This can cause an outage until the bootstrap
   node is corrected.

   *Workaround* : The program initializing libcouchbase may check first to see if
   the bootstrap node is available. If it is not, the program may initialize
   libcouchbase using a different URI.

 * A cluster being rebalanced or having nodes added can return errors to the
   client. There is no workaround for this issue, but it has been addressed in
   version 1.0.1.

<a id="licenses"></a>
