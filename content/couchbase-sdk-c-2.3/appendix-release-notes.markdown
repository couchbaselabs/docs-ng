# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library C. To browse or submit new issues, see [Couchbase
Client Library C Issues Tracker](http://www.couchbase.com/issues/browse/CCBC).

<a id="couchbase-sdk-c-rn_2-2-0"></a>

## Release Notes for Couchbase Client Library C 2.2.0 GA (06 November 2013)

**New Features and Behavior Changes in 2.2.0**

* Handle 302 redirects in HTTP (views and administrative requests). By
  default the library follows up to three redirects.  After the
  limit is reached, the request is terminated with code
  `LCB_TOO_MANY_REDIRECTS`. The limit is configurable through
  `LCB_CNTL_MAX_REDIRECTS`. If it is set to -1, it disables the redirect
  limit. The following example shows how to set the limit:

        int new_value = 5;
        lcb_cntl(instance, LCB_CNTL_SET, LCB_CNTL_MAX_REDIRECTS, &new_value);

	*Issues*: [CCBC-169](http://www.couchbase.com/issues/browse/CCBC-169)

* Replace isasl with cbsasl. cbsasl implements both PLAIN and CRAM-MD5 authentication mechanisms.

* `LCB_CNTL_MEMDNODE_INFO` command updated to include effective
    SASL mechanism:

        cb_cntl_server_t node;
        node.version = 1;
        node.v.v1.index = 0; /* first node */
        lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_MEMDNODE_INFO, &node);
        if (node.v.v1.sasl_mech) {
            printf("authenticated via SASL '%s'\n",
                   node.v.v1.sasl_mech);
        }


* You can force a specific authentication mechanism for
    the connection handle by using the `LCB_CNTL_FORCE_SASL_MECH` command:

        lcb_cntl(instance, LCB_CNTL_SET, LCB_CNTL_FORCE_SASL_MECH, "PLAIN");

	*Issues*:
   [CCBC-243](http://www.couchbase.com/issues/browse/CCBC-243)

* Stricter, more inspectable behavior for the configuration cache. This provides a
  test and an additional `lcb_cntl` operation to check the status of
  the configuration cache. Also, it switches off the configuration cache with
  memcached buckets.

        int is_loaded;
        lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_CONFIG_CACHE_LOADED, &is_loaded);
        if (is_loaded) {
            printf("Configuration cache saved us a trip to the config server\n");
        } else {
            printf("We had to contact the configuration server for some reason\n");
        }

	*Issues*:
   [CCBC-204](http://www.couchbase.com/issues/browse/CCBC-204)
   [CCBC-205](http://www.couchbase.com/issues/browse/CCBC-205)



**Fixes in 2.2.0**

* libuv plugin: use the same CRT for free and malloc.

	*Issues* :
   [CCBC-286](http://www.couchbase.com/issues/browse/CCBC-286)

* Fail `NOT_MY_VBUCKET` responses on time-out.

   *Issues* :
   [CCBC-288](http://www.couchbase.com/issues/browse/CCBC-288)

* Do a full purge when negotiation times out. In this case we must
  purge the server from all commands and not simply pop individual
  items.

   *Issues* :
   [CCBC-275](http://www.couchbase.com/issues/browse/CCBC-275)


* Reset the server's buffers upon reconnection. This fixes a crash
  experienced when requesting a new read with the previous buffer
  still intact. This was exposed by calling `lcb_failout_server` on a
  time-out error while maintaining the same server struct.

   *Issues* :
   [CCBC-275](http://www.couchbase.com/issues/browse/CCBC-275)

* Make server buffers reentrant-safe. When purging implicit commands,
  we invoke callbacks that might in turn cause other LCB entry points
  to be invoked, which can shift the contents or positions of the
  ring buffers that we're reading from.

   *Issues* :
   [CCBC-282](http://www.couchbase.com/issues/browse/CCBC-282)

* Use common config retry mechanism for bad configuration cache. This uses the
  same error handling mechanism as when a bad configuration has been
  received from the network. New `LCB_CONFIG_CACHE_INVALID` error code
  to notify the user of such a situation

   *Issues* :
   [CCBC-278](http://www.couchbase.com/issues/browse/CCBC-278)

* Handle getl and unl when purging the server (thanks Robert Groenenberg).

   *Issues* :
   [CCBC-274](http://www.couchbase.com/issues/browse/CCBC-274)

* Don't fail out all commands on a time-out. Only fail those commands
  that are old enough to have timed out already.

* Don't record and use TTP/TTR from observe. Just poll at a fixed
  interval, because the responses from the server side can be unreliable.

   *Issues* :
   [CCBC-269](http://www.couchbase.com/issues/browse/CCBC-269)

* Allow hooks for mapping server codes to errors. This also helps
  handle sane behavior if a new error code is introduced, or allow
  user-defined logging when a specific error code is received.

        lcb_errmap_callback default_callback;

        lcb_error_t user_map_error(lcb_t instance, lcb_uint16_t in)
        {
          if (in == PROTOCOL_BINARY_RESPONSE_ETMPFAIL) {
            fprintf(stderr, "temporary failure on server\n");
          }
          return default_callback(instance, in);
        }

        ...

        default_callback = lcb_set_errmap_callback(conn, user_map_error);

* Add an example of a connection pool. See `example/instancepool`
  directory

* Force `lcb_wait` return result of wait operation instead of
  `lcb_get_last_error`. It returns `last_error` if and only if the
  handle is not yet configured

   *Issues* :
   [CCBC-279](http://www.couchbase.com/issues/browse/CCBC-279)

* `cbc-pillowfight`: compute item size correctly during set If
  `minSize` and `maxSize` are set to the same value it can sometimes
  crash since it may try to read out of memory bounds from the
  allocated data buffer.

   *Issues* :
   [CCBC-284](http://www.couchbase.com/issues/browse/CCBC-284)

* Apply key prefix CLI option in cbc-pillowfight

   *Issues* :
   [CCBC-283](http://www.couchbase.com/issues/browse/CCBC-283)

* Add `--enable-maintainer-mode`. Maintainer mode enables
  `--enable-werror --enable-warnings --enable-debug`, forces all
  plugins to be installed and forces all tests, tools, and examples to
  be built

* Expose `LCB_MAX_ERROR` to allow user-defined codes

   *Issues* :
   [CCBC-255](http://www.couchbase.com/issues/browse/CCBC-255)


<a id="couchbase-sdk-c-rn_2-1-3"></a>

## Release Notes for Couchbase Client Library C 2.1.3 GA (10 September 2013)

**New Features and Behavior Changes in 2.1.3**

* Use cluster type connection for cbc-bucket-flush. Although
  flush command is accessible for bucket type connections,
  cbc-bucket-flush doesn't use provided bucket name to connect to,
  therefore it will fail if the bucket name isn't "default".

* Allow to make connect order deterministic. It allows the
  user to toggle between deterministic and random connect order for
  the supplied nodes list. By default it will randomize the list.

**Fixes in 2.1.3**

* Updated gtest to version 1.7.0. Fixes issue with building
  test suite with new XCode 5.0 version being released later this
  month.

* Do not try to parse config for `LCB_TYPE_CLUSTER`
  handles. It fixes timouts for management operations (like 'cbc
  bucket-create', 'cbc bucket-flush', 'cbc bucket-delete' and 'cbc
  admin')

   *Issues* :
   [CCBC-265](http://www.couchbase.com/issues/browse/CCBC-265)

* Skip unfinished SASL commands on rebalance. During
  rebalance, it is possible that the newly added server doesn't have
  chance to finish SASL auth before the cluster will push config
  update, in this case packet relocator messing cookies. Also the
  patch makes sure that SASL command/cookie isn't mixing with other
  commands

   *Issues* :
   [CCBC-263](http://www.couchbase.com/issues/browse/CCBC-263)

* Do not allow to use Administrator account for
  `LCB_TYPE_BUCKET`

* Fig segmentation faults during tests load of
  node.js. Sets `inside_handler` on `socket_connected`. Previously we
  were always using SASL auth, and as such, we wouldn't flush packets
  from the `cmd_log` using `server_send_packets` (which calls
  `apply_want`). `apply_want` shouldn't be called more than once per
  event loop entry -- so this sets and unsets the `inside_handler`
  flag.

   *Issues* :
   [CCBC-258](http://www.couchbase.com/issues/browse/CCBC-258)

* Added support of libuv 0.8

* Close config connection before trying next node. It will fix
  asserts in case of the config node becomes unresponsive, and the
  threshold controlled by `LCB_CNTL_CONFERRTHRESH` and `lcb_cntl(3)`

<a id="couchbase-sdk-c-rn_2-1-2"></a>

## Release Notes for Couchbase Client Library C 2.1.2 GA (27 August 2013)

**Fixes in 2.1.2**

 * Use bucket name in SASL if username omitted. Without this fix, you
   can may encounter a segmentation faults for buckets, which are not
   protected by a password.

   *Issues* :
   [CCBC-253](http://www.couchbase.com/issues/browse/CCBC-253)
   [CCBC-254](http://www.couchbase.com/issues/browse/CCBC-254)

 * Preserve IO cookie in `options_from_info` when using v0 plugins
   with user-provided IO loop instance. This issue was introduced in
   2.1.0.

 * Display the effective IO backend in `cbc-version`. This is helpful
   to quickly detect what is the effective IO plugin on a given
   system.

<a id="couchbase-sdk-c-rn_2-1-1"></a>

## Release Notes for Couchbase Client Library C 2.1.1 GA (22 August 2013)

**New Features and Behavior Changes in 2.1.1**

 * Fallback to 'select' IO plugin if default plugin cannot be loaded. On UNIX-like
   systems, default IO backend is 'libevent', which uses third-party library might
   be not available at the run-time. Read in lcb\_cntl(3couchbase) man page in
   section LCB\_CNTL\_IOPS\_DEFAULT\_TYPES about how to determine effective IO
   plugin, when your code chose to use LCB\_IO\_OPS\_DEFAULT during connection
   instantiation. The fallback mode doesn't affect application which specify IO
   backend explicitly.

   *Issues* : [CCBC-246](http://www.couchbase.com/issues/browse/CCBC-246)

 * Skip misconfigured nodes in the list. New lcb\_cntl(3couchbase) added to control
   whether the library will skip nodes in initial node list, which listen on
   configuration port (8091 usually) but doesn't meet required parameters (invalid
   authentication or missing bucket). By default report this issue and stop trying
   nodes from the list, like all previous release. Read more at man page
   lcb\_cntl(3couchbase) in section
   LCB\_CNTL\_SKIP\_CONFIGURATION\_ERRORS\_ON\_CONNECT

   *Issues* : [CCBC-192](http://www.couchbase.com/issues/browse/CCBC-192)

 * Distribute debug information with release binaries on Windows

   *Issues* : [CCBC-245](http://www.couchbase.com/issues/browse/CCBC-245)

**Fixes in 2.1.1**

 * Do not use socket after failout. Fixes segmentation faults during rebalance.

   *Issues* : [CCBC-239](http://www.couchbase.com/issues/browse/CCBC-239)

 * Use provided credentials for authenticating to the data nodes. With this fix, it
   is no longer possible to use Administrator credentials with a bucket. If your
   configuration does so, you must change the credentials you use before applying
   this update. No documentation guides use of Administrator credentials, so this
   change is not expected to affect few, if any deployments.

 * Do not disable config.h on UNIX-like platforms. It fixes build issue, when
   application is trying to include plugins from the tarball.

   *Issues* : [CCBC-248](http://www.couchbase.com/issues/browse/CCBC-248)

<a id="couchbase-sdk-c-rn_2-1-0"></a>

## Release Notes for Couchbase Client Library C 2.1.0 GA (18 August 2013)

**New Features and Behavior Changes in 2.1.0**

 * New backend `select`. This backend is based on the select(2) system call and its
   Windows version. It could be considered the most portable solution and is
   available with the libcouchbase core.

 * API for durability operations. This new API is based on `lcb_observe(3)` and
   allows you to monitor keys more easily. See the man pages
   `lcb_durability_poll(3)` and `lcb_set_durability_callback(3)` for more info.

   *Issues* : [CCBC-145](http://www.couchbase.com/issues/browse/CCBC-145)

 * New backend `libuv`. This backend previously was part of the
   [couchnode](https://github.com/couchbase/couchnode) project and is now available
   as a plugin. Because libuv doesn't ship binary packages there is no binary
   package `libcouchbase2-libuv`. You can build plugin from the source
   distribution, or through the `libcouchbase-dev` or `libcouchbase-devel` package
   on UNIX like systems.

   *Issues* : [CCBC-236](http://www.couchbase.com/issues/browse/CCBC-236)

 * New backend `iocp`. This is a Windows specific backend, which uses "I/O
   Completion Ports". As a part of the change, a new version of plugin API was
   introduced which is more optimized to this model of asynchronous IO.

 * New configuration interface `lcb_cntl(3)` along with new tunable options of the
   library and connection instances. In this release the following settings are
   available. See the man page for more information and examples.:

    * LCB\_CNTL\_OP\_TIMEOUT operation timeout (default 2.5 seconds)

    * LCB\_CNTL\_CONFIGURATION\_TIMEOUT time to fetch cluster configuration. This is
      similar to a connection timeout (default 5 seconds)

    * LCB\_CNTL\_VIEW\_TIMEOUT timeout for couchbase views (default 75 seconds)

    * LCB\_CNTL\_HTTP\_TIMEOUT timeout for other HTTP operations like RESTful flush,
      bucket creating etc. (default 75 seconds)

    * LCB\_CNTL\_RBUFSIZE size of the internal read buffer (default 32768 bytes)

    * LCB\_CNTL\_WBUFSIZE size of the internal write buffer (default 32768 bytes)

    * LCB\_CNTL\_HANDLETYPE type of the `lcb\_t` handler (readonly)

    * LCB\_CNTL\_VBCONFIG returns pointer to VBUCKET\_CONFIG\_HANDLE (readonly)

    * LCB\_CNTL\_IOPS get the implementation of IO (lcb\_io\_opt\_t)

    * LCB\_CNTL\_VBMAP get vBucket ID for a given key

    * LCB\_CNTL\_MEMDNODE\_INFO get memcached node info

    * LCB\_CNTL\_CONFIGNODE\_INFO get config node info

    * LCB\_CNTL\_SYNCMODE control synchronous behavior (default LCB\_ASYNCHRONOUS)

    * LCB\_CNTL\_IP6POLICY specify IPv4/IPv6 policy (default LCB\_IPV6\_DISABLED)

    * LCB\_CNTL\_CONFERRTHRESH control configuration error threshold (default 100)

    * LCB\_CNTL\_DURABILITY\_TIMEOUT durability timeout (default 5 seconds)

    * LCB\_CNTL\_DURABILITY\_INTERVAL durability polling interval (default 100
      milliseconds)

    * LCB\_CNTL\_IOPS\_DEFAULT\_TYPES get the default IO types

    * LCB\_CNTL\_IOPS\_DLOPEN\_DEBUG control verbose printing of dynamic loading of IO
      plugins.

**Fixes in 2.1.0**

 * Fixed bug when `REPLICA_SELECT` didn't invoke callbacks for negative error codes

   *Issues* : [CCBC-228](http://www.couchbase.com/issues/browse/CCBC-228)

 * Fixed bug when `LCB_REPLICA_FIRST` fails if first try does not return key

   *Issues* : [CCBC-229](http://www.couchbase.com/issues/browse/CCBC-229)

**Known Issues in 2.1.0**

 * From the release the 2.1.0 package `libcouchbase2` will not install an IO
   backend automatically. If you are upgrading, there are no changes because you
   have already `libcouchbase2-libev` or `libcouchbase2-libevent` packages
   installed. For new installations, a backend must be selected for the client
   library to work correctly.

   If for example you are using the PHP SDK, the old way, which works for pre-2.1.0
   versions is:

    ```
    # DEB-based systems
    shell> sudo apt-get install libcouchbase2 libcouchbase-dev
    # RPM-based systems
    shell> sudo yum install libcouchbase2 libcouchbase-devel
    ```

   But a more explicit way to do this, which works for all versions (including
   2.1.0) is:

    ```
    # DEB-based systems
    shell> sudo apt-get install libcouchbase2-libevent libcouchbase-dev
    # RPM-based systems
    shell> sudo yum install libcouchbase2-libevent libcouchbase-devel
    ```

<a id="couchbase-sdk-c-rn_2-0-7"></a>

## Release Notes for Couchbase Client Library C 2.0.7 GA (10 July 2013)

**New Features and Behavior Changes in 2.0.7**

 * Improve `lcb\_get\_replica()`. Now it is possible to choose between three
   strategies:

    1. `LCB_REPLICA_FIRST` : Previously accessible and now the default, the caller will
       get a reply from the first replica to successfully reply within the timeout for
       the operation or will receive an error.

    1. `LCB_REPLICA_ALL` : Ask all replicas to send documents/items back.

    1. `LCB_REPLICA_SELECT` : Select one replica by the index in the configuration
       starting from zero. This approach can more quickly receive all possible replies
       for a given topology, but it can also generate false negatives.

   Note that applications should not assume the order of the replicas indicates
   more recent data is at a lower index number. It is up to the application to
   determine which version of a document/item it may wish to use in the case of
   retrieving data from a replica.

   *Issues* : [CCBC-183](http://www.couchbase.com/issues/browse/CCBC-183)

<a id="couchbase-sdk-c-rn_2-0-6"></a>

## Release Notes for Couchbase Client Library C 2.0.6 GA (07 May 2013)

**New Features and Behavior Changes in 2.0.6**

 * Added an example to properly use the bucket credentials for authentication
   instead of administrator credentials

   *Issues* : [CCBC-179](http://www.couchbase.com/issues/browse/CCBC-179)

 * Add Host header in http request http://cbugg.hq.couchbase.com/bug/bug-555 points
   out that Host is a required field in HTTP 1.1

   *Issues* : [CCBC-201](http://www.couchbase.com/issues/browse/CCBC-201)

**Fixes in 2.0.6**

 * Fix segfault when rebalancing. When a (!connected) server is reconnected, the
   tasks in its "pending" buffer will be moved into "output" buffer. If its
   connection is broken again immediately, relocate\_packets() will go to wrong
   path.

   *Issues* : [CCBC-188](http://www.couchbase.com/issues/browse/CCBC-188)

 * Don't try to switch to backup nodes when timeout is reached

   *Issues* : [CCBC-202](http://www.couchbase.com/issues/browse/CCBC-202)

 * Fix compile error with sun studio. `"src/event.c", line 172: error: statement
   not reached (E_STATEMENT_NOT_REACHED)`

 * Don't invoke HTTP callbacks after cancellation, because user code might assume a
   previously-freed resource is still valid

 * Check if SASL struct is valid before disposing

   *Issues* : [CCBC-188](http://www.couchbase.com/issues/browse/CCBC-188)

 * example/yajl/couchview.c: pass cookie to the command Fixes coredump when
   executing./examples/yajl/couchview

<a id="couchbase-sdk-c-rn_2-0-5"></a>

## Release Notes for Couchbase Client Library C 2.0.5 GA (05 April 2013)

**New Features and Behavior Changes in 2.0.5**

 * pillowfight example updated to optionally use threads

**Fixes in 2.0.5**

 * Try to search the --libdir for modules if dlopen fails to find the module in the
   default library path

 * New compat mode (experimental) for configuration caching. See man
   lcb\_create\_compat

   *Issues* : [CCBC-190](http://www.couchbase.com/issues/browse/CCBC-190)

 * Fix reconnecting issues on windows (http://review.couchbase.org/25170 and
   http://review.couchbase.org/25155)

 * Fix build on FreeBSD (http://review.couchbase.org/25289)

<a id="couchbase-sdk-c-rn_2-0-4"></a>

## Release Notes for Couchbase Client Library C 2.0.4 GA (06 March 2013)

**Fixes in 2.0.4**

 * Build error on solaris/sparc: -Werror=cast-align

   *Issues* : [CCBC-178](http://www.couchbase.com/issues/browse/CCBC-178)

 * Fixed illegal memory access in win32 plugin

   *Issues* : [CCBC-147](http://www.couchbase.com/issues/browse/CCBC-147)

 * Work properly on systems where EWOULDBLOCK != EAGAIN

   *Issues* : [CCBC-175](http://www.couchbase.com/issues/browse/CCBC-175)

 * The library stops iterating backup nodes list if the next one isn't accessible.

   *Issues* : [CCBC-182](http://www.couchbase.com/issues/browse/CCBC-182)

 * The bootstrap URI is not parsed correctly

   *Issues* : [CCBC-185](http://www.couchbase.com/issues/browse/CCBC-185)

 * Segmentation fault when the hostname resolved into several addresses and first
   of them reject couchbase connections.

   *Issues* : [CCBC-180](http://www.couchbase.com/issues/browse/CCBC-180)

<a id="couchbase-sdk-c-rn_2-0-3"></a>

## Release Notes for Couchbase Client Library C 2.0.3 GA (06 February 2013)

**New Features and Behavior Changes in 2.0.3**

 * Add a new library: libcouchbase\_debug.so (see include/libcouchbase/debug.h)
   which is a new library that contains new debug functionality.

 * Added manual pages for the library.

**Fixes in 2.0.3**

 * Observe malfunctions in the case of multiple keys and server failure.

   *Issues* : [CCBC-155](http://www.couchbase.com/issues/browse/CCBC-155)

 * Reset internal state on lcb\_connect(). Allow caller to use lcb\_connect()
   multiple times to implement reconnecting using the same lcb\_t instance. Also it
   sets up the initial-connection timer for users who don't use lcb\_wait() and
   drive IO loop manually.

   *Issues* : [CCBC-153](http://www.couchbase.com/issues/browse/CCBC-153)

 * Invalid read in libevent plugin, when the plugin compiled in 1.x mode

   *Issues* : [CCBC-171](http://www.couchbase.com/issues/browse/CCBC-171)

 * Shrink internal lookup tables (and reduce the size of lcb\_t)

 * *Issues* : [CCBC-156](http://www.couchbase.com/issues/browse/CCBC-156)

<a id="couchbase-sdk-c-rn_2-0-2"></a>

## Release Notes for Couchbase Client Library C 2.0.2 GA (04 January 2013)

**Fixes in 2.0.2**

 * Document LCB\_SERVER\_BUG and LCB\_PLUGIN\_VERSION\_MISMATCH. Enhance the
   lcb\_strerror test to detect undocumented error codes.

 * Commands sent to multiple servers fail to detect the respose if mixed with other
   commands.

   *Issues* : [CCBC-150](http://www.couchbase.com/issues/browse/CCBC-150)

 * Under high load the library could generate LCB\_ETIMEDOUT errors without reason
   owing to internal limitations.

   *Issues* : [CCBC-153](http://www.couchbase.com/issues/browse/CCBC-153)

 * Cancellation of the HTTP request might lead to memory leaks or to segfaults
   (2e3875c2).

   *Issues* : [CCBC-151](http://www.couchbase.com/issues/browse/CCBC-151)

<a id="couchbase-sdk-c-rn_2-0-1"></a>

## Release Notes for Couchbase Client Library C 2.0.1 GA (11 December 2012)

**New Features and Behavior Changes in 2.0.1**

 * SystemTap and DTrace integration

**Fixes in 2.0.1**

 * Fix a memory leak on the use of http headers

   *Issues* : [CCBC-130](http://www.couchbase.com/issues/browse/CCBC-130)

 * libev-plugin: delay all timers while the loop isn’t active. It will fix
   LCB\_ETIMEOUT in the following scenario:

    * connect the instance

    * sleep for time greater than default timeout (e.g. 3 seconds)

    * schedule and execute a command (it will be timed out immediately)

 * Do not abort when purging SASL commands

   *Issues* : [CCBC-136](http://www.couchbase.com/issues/browse/CCBC-136)

 * Fix possible SEGFAULT. Not-periodic timers are destroyed after calling user’s
   callback, after that library performed read from freed pointer.

 * Compensate for cluster nodes lacking couchApiBase

   *Issues* : [CCBC-131](http://www.couchbase.com/issues/browse/CCBC-131)

 * Ensure HTTP works even when the network may be unreliable. This changeset
   encompasses several issues which had been found with HTTP requests during
   network errors and configuration changes. Specifically some duplicate code paths
   were removed, and the process for delivering an HTTP response back to the user
   is more streamlined.

   *Issues* : [CCBC-132](http://www.couchbase.com/issues/browse/CCBC-132),
   [CCBC-133](http://www.couchbase.com/issues/browse/CCBC-133)

 * libev-plugin: reset IO event on delete. We need to reset it, because it might be
   re-used later

 * Make library C89 friendly again

<a id="couchbase-sdk-c-rn_2-0-0d"></a>

## Release Notes for Couchbase Client Library C 2.0.0 GA (27 November 2012)

**New Features and Behavior Changes in 2.0.0**

 * Add the CAS to the delete callback

**Fixes in 2.0.0**

 * Minor update of the packaging layout:

    * libcouchbase-all package comes without version

    * extract debug symbols from libcouchbase-{bin,core} to libcouchbase-dbg package

 * Install unlock callback in synchronous mode

<a id="couchbase-sdk-c-rn_2-0-0c"></a>

## Release Notes for Couchbase Client Library C 2.0.0beta3 Beta (21 November 2012)

**New Features and Behavior Changes in 2.0.0beta3**

 * Try all known plugins for LCB\_IO\_OPS\_DEFAULT in run time

 * Allow to use ‘cbc-hash’ with files

 * Create man pages for cbc and cbcrc

 * Use dynamic versioning for plugins

 * Lookup the plugin symbol also in the current executable image.

   *Issues* : [CCBC-114](http://www.couchbase.com/issues/browse/CCBC-114)

 * Allow the user to specify a different hash key. All of the data operations
   contains a hashkey and nhashkey field. This allows you to “group” items together
   in your cluster. A typical use case for this is if you’re storing lets say data
   for a single user in multiple objects. If you want to ensure that either all or
   none of the objects are available if a server goes down, it could be a good idea
   to locate them on the same server. Do bear in mind that if you do try to decide
   where objects is located, you may end up with an uneven distribution of the
   number of items on each node. This will again result in some nodes being more
   busy than others etc. This is why some clients doesn’t allow you to do this, so
   bear in mind that by doing so you might not be able to get your objects from
   other clients.

   *Issues* : [CCBC-119](http://www.couchbase.com/issues/browse/CCBC-119)

 * Add documentation about the error codes

   *Issues* : [CCBC-87](http://www.couchbase.com/issues/browse/CCBC-87)

 * Add lcb\_verify\_compiler\_setup(). This function allows the “user” of the
   library to verify that the compiler use a compatible struct packing scheme.

**Fixes in 2.0.0beta3**

 * lcb\_error\_t member in the http callbacks shouldn’t reflect the HTTP response
   code. So the error code will be always LCB\_SUCCESS if the library managed to
   receive the data successfully.

   *Issues* : [CCBC-118](http://www.couchbase.com/issues/browse/CCBC-118)

 * Fix cbc-bucket-create. `sasl-password' is misspelled, and it fails to parse the
   command line option.

 * Remove libtool version from the plugins

 * Do not allow admin operations without authentication

 * check for ewouldblock/eintr on failed send

 * Purge stale OBSERVE packets

   *Issues* : [CCBC-120](http://www.couchbase.com/issues/browse/CCBC-120)

 * Allow to use gethrtime() from C++

 * Remove unauthorized asserion (d344037). The lcb\_server\_send\_packets()
   function later check if the server object connected and establish connection if
   not (with raising possible errors)

   *Issues* : [CCBC-113](http://www.couchbase.com/issues/browse/CCBC-113)

 * Don’t use the time\_t for win32. When compiling from php it turns out that it
   gets another size of the time\_t type, causing the struct offsets to differ.

 * Reformat and refactor lcb\_server\_purge\_implicit\_responses:

    * move packet allocation out of GET handler

    * dropping NOOP command shouldn’t return error code

   *Issues* : [CCBC-120](http://www.couchbase.com/issues/browse/CCBC-120)

 * Try to switch another server from backup list on timeout

   *Issues* : [CCBC-122](http://www.couchbase.com/issues/browse/CCBC-122)

 * Timer in libev uses double for interval. Ref:
   http://pod.tst.eu/http://cvs.schmorp.de/libev/ev.pod\#code\_ev\_timer\_code\_relative\_and\_opti

 * Fix illegal memory access. Reconnect config listener if the config connection
   was gone without proper shutdown.

   *Issues* : [CCBC-104](http://www.couchbase.com/issues/browse/CCBC-104)

 * Fix using freed memory (was introduced in 4397181)

 * Return zero from do\_read\_data() if operations\_per\_call reached. The
   `operations\_per\_call' limit was introduced to prevent from freezing event
   loop. But in the function variable rv could store two different results and in
   case of reaching this limit it is returning number of the processed records,
   which is wrong. The function should return either zero (success) or non-zero
   (failure).

   *Issues* : [CCBC-115](http://www.couchbase.com/issues/browse/CCBC-115)

<a id="couchbase-sdk-c-rn_2-0-0b"></a>

## Release Notes for Couchbase Client Library C 2.0.0beta2 Beta (12 October 2012)

**New Features and Behavior Changes in 2.0.0beta2**

 * Implement a new libev plugin. It is compatible with both libev3 and libev4.

 * Allow libcouchbase to connect to an instance without specifying bucket. It is
   useful when the bucket not needed, e.g. when performing administration tasks.

 * Allow users to build the library without dependencies. For example, without
   plugins at all. This may be useful if the plugin is implemented by or built into
   the host application.

 * Allow users to use environment variables to pick the event plugin

 * Add a new interface version for creating IO objects via plugins

 * Allow to disable CXX targets

 * Allow users to install both libraries (2.x and 1.x) on the same system.

 * Cleanup HTTP callbacks. Use the same callbacks both for Management and View
   commands, and rename them to lcb\_http\_complete\_callback and
   lcb\_http\_data\_callback.

 * Add support for raw http requests. libcouchase already contains all the bits to
   execute a raw http request, except for the possibility to specify a host:port,
   username and password.

 * Make the content type optional for lcb\_make\_http\_request()

**Fixes in 2.0.0beta2**

 * Fix invalid memory access in cbc tool. Affected command is cbc-bucket-create

 * Search ev.h also in ${includedir}/libev

 * Fix password memory leak in http.c (7e71493)

 * lcb\_create: replace assert() with error code

 * Breakout event loop in default error\_callback. This provides better default
   behavior for users who haven’t defined global error callback.

   *Issues* : [CCBC-105](http://www.couchbase.com/issues/browse/CCBC-105)

 * Fix linked event/timer lists for win32

   *Issues* : [CCBC-103](http://www.couchbase.com/issues/browse/CCBC-103)

 * Fix SEGFAULT if IO struct is allocated not by the lcb\_create()

 * Fix memory leak after an unsuccessful connection

 * lcb\_connect() should honor the syncmode setting. Automatically call lcb\_wait()
   when in synchronous mode

<a id="couchbase-sdk-c-rn_2-0-0a"></a>

## Release Notes for Couchbase Client Library C 2.0.0beta Beta (13 September 2012)

**New Features and Behavior Changes in 2.0.0beta**

 * Bundle Windows packages as zip archives

 * Refactor the API. This is a full redesign of the current libcouchbase API
   that’ll allow us to extend parts of the API without breaking binary
   compatibility. Also it renames all functions to have lcb prefix instead of
   libcouchbase and LCB/LIBCOUCHBASE in macros.

 * Implement getter for number of nodes in the cluster: lcb\_get\_num\_nodes()

 * Add lcb\_get\_server\_list() to get current server list

 * Deliver HTTP headers via callbacks

 * Implement RESTful flush in the cbc toolset

 * Merge lcb\_get\_locked into lcb\_get function

 * Bundle libvbucket

**Fixes in 2.0.0beta**

 * Fix a problem with allocating too few slots in the backup\_nodes. Fixes illegal
   memory access.

 * Include sys/uio.h. Needed by OpenBSD

 * Added `--enable-fat-binary`. Helps to solve issues when linking with fat
   binaries on MacOS.

 * Differentiate between TMPFAILs. This allows a developer to know if the temporary
   condition where the request cannot be handled is due to a constraint on the
   client or the server.

   *Issues* : [CCBC-98](http://www.couchbase.com/issues/browse/CCBC-98)

 * Correct buffer length for POST/PUT headers

   *Issues* : [CCBC-96](http://www.couchbase.com/issues/browse/CCBC-96)

 * Fix switching to backup node in case of server outage

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

 * Fix locking keys in multi-get mode

 * Release the memory allocated by the http parser

   *Issues* : [CCBC-89](http://www.couchbase.com/issues/browse/CCBC-89)

 * Fix initialization of backup nodes array. The code switching nodes relies on
   NULL terminator rather than nbackup\_nodes variable. Fixes illegal memory
   access.

   *Issues* : [CCBC-90](http://www.couchbase.com/issues/browse/CCBC-90)

 * Default to IPv4 only

   *Issues* : [CCBC-80](http://www.couchbase.com/issues/browse/CCBC-80)

 * Reset timer for commands with NOT\_MY\_VBUCKET response

   *Issues* : [CCBC-91](http://www.couchbase.com/issues/browse/CCBC-91)

 * Sync memcached/protocol\_binary.h. Pull extra protocol\_binary\_datatypes
   declarations.

 * Fix bug where HTTP method is not set

 * Don’t try to put the current node last in the backup list. This may cause
   “duplicates” in the list if the REST server returns another name for the server
   than you used. Ex: you specify “localhost” and the REST response contains
   127.0.0.1

 * Release ringbuffer in lcb\_purge\_single\_server

   *Issues* : [CCBC-92](http://www.couchbase.com/issues/browse/CCBC-92)

<a id="couchbase-sdk-c-rn_1-1-0i"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp9 Developer Preview (27 July 2012)

**Fixes in 1.1.0dp9**

 * Render auth credentials for View requests. libcouchbase\_make\_http\_request()
   won’t accept credentials anymore. It will pick them bucket configuration.

<a id="couchbase-sdk-c-rn_1-1-0h"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp8 Developer Preview (27 July 2012)

**New Features and Behavior Changes in 1.1.0dp8**

 * Allow the user to get the number of replicas using
   libcouchbase\_get\_num\_replicas()

 * Separate HTTP callbacks for couch and management requests

 * Implement read replica

   *Issues* : [CCBC-82](http://www.couchbase.com/issues/browse/CCBC-82)

 * Let users detect if the event loop running already using
   libcouchbase\_is\_waiting() function.

 * Add OBSERVE command

   *Issues* : [CCBC-15](http://www.couchbase.com/issues/browse/CCBC-15)

 * Allow users to specify content type for HTTP request.

 * Allow a user to breakout from the event loop in callbacks using
   libcouchbase\_breakout()

 * New cbc commands and options:

    * cbc-view (remove couchview example)

    * cbc-verbosity

    * cbc-admin

    * cbc-bucket-delete

    * cbc-bucket-create

    * Add -p and -r options to cbc-cp to control persistence (uses OBSERVE internally)

 * Allow the client to specify the verbosity level on the servers using
   lcb\_set\_verbosity() function.

 * Implement general purpose timers. It is possible for users to define their own
   timers using libcouchbase\_timer\_create() function. (See headers for more
   info). Implement multiple timers for windows

   *Issues* : [CCBC-85](http://www.couchbase.com/issues/browse/CCBC-85)

**Fixes in 1.1.0dp8**

 * Claim that server has data in buffers if there are HTTP requests pending.
   Without this patch the event loop can be stopped prematurely.

 * Make libcouchbase\_wait() re-entrable

 * Fix to handle the case when View base doesn’t have URI schema.

 * Bind timeouts to server sockets instead of commands. This means that from this
   point timeout interval will be started from the latest IO activity on the
   socket. This is a behavior change from the 1.0 series.

 * Use separate error code for ENOMEM on the client

   *Issues* : [CCBC-77](http://www.couchbase.com/issues/browse/CCBC-77)

<a id="couchbase-sdk-c-rn_1-1-0g"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp7 Developer Preview (19 June 2012)

**New Features and Behavior Changes in 1.1.0dp7**

 * Implement function to execution management requests. Using
   libcouchbase\_make\_management\_request() function you can configure the
   cluster, add/remove buckets, rebalance etc. It behaves like
   libcouchbase\_make\_couch\_request() but works with another endpoint.

 * Add support for notification callbacks for configuration changes. Now it is
   possible to install a hook using function
   libcouchbase\_set\_configuration\_callback(), and be notified about all
   configuration changes.

**Fixes in 1.1.0dp7**

 * Extract HTTP client. Backward incompatible change in Couchbase View subsystem

<a id="couchbase-sdk-c-rn_1-1-0f"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp6 Developer Preview (13 June 2012)

**New Features and Behavior Changes in 1.1.0dp6**

 * Implement ‘help’ command for cbc tool

   *Issues* : [RCBC-71](http://www.couchbase.com/issues/browse/RCBC-71)

**Fixes in 1.1.0dp6**

 * Undefine NDEBUG to avoid asserts to be optimized out

 * Fix compilation on macosx with gtest from homebrew

   *Issues* : [RCBC-72](http://www.couchbase.com/issues/browse/RCBC-72)

 * Close dynamic libraries. Fixes small memory leak

   *Issues* : [RCBC-70](http://www.couchbase.com/issues/browse/RCBC-70)

 * Include types definitions for POSIX systems. Fixes C++ builds on some systems.

   *Issues* : [RCBC-63](http://www.couchbase.com/issues/browse/RCBC-63)

 * Fix win32 builds:

    * Add suffix to cbc command implementations;

    * Fix guards for socket errno macros;

    * Define size\_t types to fix MSVC 9 build;

    * MSVC 9 isn’t C99, but has stddef.h, so just include it.

<a id="couchbase-sdk-c-rn_1-1-0e"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp5 Developer Preview (06 June 2012)

**New Features and Behavior Changes in 1.1.0dp5**

 * Implement ‘cbc-hash’ to get server/vbucket for given key

**Fixes in 1.1.0dp5**

 * The library doesn’t depend on pthreads (eliminates package lint warnings)

<a id="couchbase-sdk-c-rn_1-1-0d"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp4 Developer Preview (05 June 2012)

**Fixes in 1.1.0dp4**

 * cbc: strtoull doesn’t exist on win32, therefore use C++ equivalent.

<a id="couchbase-sdk-c-rn_1-1-0c"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp3 Developer Preview (03 June 2012)

**New Features and Behavior Changes in 1.1.0dp3**

 * Implement GET\_LOCKED (GETL) command

   *Issues* : [CCBC-68](http://www.couchbase.com/issues/browse/CCBC-68)

 * Implement UNLOCK\_KEY (UNL) command

   *Issues* : [CCBC-68](http://www.couchbase.com/issues/browse/CCBC-68)

**Fixes in 1.1.0dp3**

 * Timeouts can occur during topology changes, rather than be correctly retried.
   Send the retry-packet to new server

   *Issues* : [CCBC-64](http://www.couchbase.com/issues/browse/CCBC-64)

 * Fix ringbuffer\_memcpy() (36afdb2). Fix ringbuffer\_is\_continous().

 * A hang could occur in libcouchbase\_wait() after the timeout period. Check for
   breakout condition after purging servers

   *Issues* : [CCBC-62](http://www.couchbase.com/issues/browse/CCBC-62)

 * Destroy view requests items when server get destroyed. Fixes memory leaks.

 * A fix for a buffer overflow with the supplied password as has been integrated.
   While it is a buffer overflow issue, this is not considered to be a possible
   security issue because the password to the bucket is not commonly supplied by an
   untrusted source

   *Issues* : [RCBC-33](http://www.couchbase.com/issues/browse/RCBC-33)

 * A small memory leak can occur with frequent calls to libcouchbase\_create() and
   libcouchbase\_destroy()

   *Issues* : [CCBC-65](http://www.couchbase.com/issues/browse/CCBC-65)

 * Use vbucket\_found\_incorrect\_master() to get correct server index during
   relocating buffers. Pick up cookies from pending buffer unless node connected.

 * Do not call View callbacks for cancelled requests

 * hashset.c: iterate over whole set on rehashing. Fixes memory leaks related to
   hash collisions (905ef95)

<a id="couchbase-sdk-c-rn_1-1-0b"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp2 Developer Preview (10 April 2012)

**Fixes in 1.1.0dp2**

 * Don’t wait for empty buffers. If called with no operations queued,
   libcouchbase\_wait() will block forever. This means that a single threaded
   application that calls libcouchbase\_wait() at different times to make sure
   operations are sent to the server runs the risk of stalling indefinitely. This
   is a very likely scenario.

   *Issues* : [CCBC-59](http://www.couchbase.com/issues/browse/CCBC-59)

 * Don’t define size\_t and ssize\_t for VS2008

 * Fix segfault while authorizing on protected buckets (211bb04)

<a id="couchbase-sdk-c-rn_1-1-0a"></a>

## Release Notes for Couchbase Client Library C 1.1.0dp Developer Preview (05 April 2012)

**New Features and Behavior Changes in 1.1.0dp**

 * This release adds new functionality to directly access Couchbase Server views
   using the `libcouchbase_make_couch_request()` function. See the associated
   documentation and header files for more details.

**Fixes in 1.1.0dp**

 * Request the tap bytes in a known byte order (adf2b30)

   *Issues* : [MB-4834](http://www.couchbase.com/issues/browse/MB-4834)

 * Check for newer libvbucket

<a id="licenses"></a>
