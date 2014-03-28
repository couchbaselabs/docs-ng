# Configuring and Tuning

<a id="sasl"></a>

## SASL

Starting from the version 2.2 libcouchbase supports CRAM-MD5
authentication mechanism. Which allows to avoid passing bucket
password as a plain text over the wires.

Along with this change, new setting was introduced
`LCB_CNTL_FORCE_SASL_MECH`. It forces a specific SASL mechanism to use
for authentication. This can allow a user to ensure a certain level of
security and have the connection fail if the desired mechanism is not available.

    lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_FORCE_SASL_MECH, "CRAM-MD5");

## Configuration and Bootstrapping

Starting from version 2.3 libcouchbase supports multiple methods of
bootstrapping and configuration retrieval. Normally you should not need
to change these settings as the library will detemine the best method available.


### Configuration Sources

The cluster configuration may be obtained either the Memcached protocol (in
what is called **C**luster **C**onfiguration **C**arrier **P**ublication, or
_CCCP_) as well as via the legacy mode which utilizes a connection to the REST
API.

Note that `CCCP` is available only in cluster versions 2.5 and higher and
LCB versions 2.3 and higher.

The default behavior of the library is to first attempt bootstrap over `CCCP`
and then fallback to HTTP if the former fails. `CCCP` bootstrap is preferrable
as it does not require a dedicated "Configuration Socket", does not require the
latency and overhead of the HTTP protocol, and is more efficient to the internals
of the cluster as well.

It is recommended to explicitly enable or disable one of the configuration
sources. The only reason why the library attempts _CCCP_ and then HTTP is to
support legacy environments where a < 2.5 cluster is available, and/or a mixed
version cluster where some nodes may support _CCCP_ and some may not.

To explicitly define the set of configuration modes to use specify this inside
the `lcb_create_st` structure

The following snippet disables HTTP bootstrapping:

```c
struct lcb_create_st crparams = { 0 };

lcb_config_transport transports[] = {
	LCB_CONFIG_TRANSPORT_CCCP,
	LCB_CONFIG_TRANSPORT_LIST_END
};

/** Requires version 2 */
cparams.version = 2;
crparams.v.v2.transports = transports;
crparams.v.v2.host = "foo.com;bar.org;baz.net";

lcb_t instance;
lcb_create(&instance, &crparams);

```

The `transports` field accepts an array of "enabled transports" followed by the
end-of-list element (`LCB_CONFIG_TRANSPORT_LIST_END`). If this parameter is
specified then the library will _only_ use the transports in the list which are
specified.

> The enabled transports will remain valid for the duration of the instance. This
> means that it will be used for the initial bootstrap as well as any subsequent
> configuration updates.


> #### Memcached Buckets
> Memcached buckets do **not** support _CCCP_. You must ensure that HTTP
> is enabled for them (which is the default)


### Configuration Updates

During the lifetime of a client, its cluster configuration may need to change
or be retrieved. Reasons for this include

* The cluster pushing a new configuration to the client
* Nodes being added, removed, or failed over to/from the cluster
* Client proactively fetching configuration due to an error


These changes are collectively known as _topology changes_ or _configuration
changes_. Note that as mentioned in the list, fetching a configuration may
not _always_ be the result of an actual toplogy change. For example if a certain
node becomes unreachable to the client then the client will attempt to fetch a
new configuration under the assumption that the unresponsive node has potentially
been ejected from the cluster.

For proactive configuration fetches (such as in response to an error) there is
effectively a responsiveness-for-efficiency trade off. If the client does not
check for updated configurations often enough then it risks failing operations
which could have succeeded if it knew about the updated topology, while if the
client fetches the configuration too quickly it can cause a lot of traffic and
increase load on the server (this especially holds true with HTTP). Additionally
some server versions allocate quite a few resources for each HTTP connection and
thus maintaining idle HTTP connections may also be more expensive than
re-establishing them on-demand.

Rather than guess your hardware and infrastructure requirements, there are
several settings in the library to help you tune it to your needs.

#### Error Threshholds

Each time a network-like error is encountered in the library (i.e. a timeout 
or connection error), an internal error counter is incremented. When this
counter's value reaches a specified value the library fetches a new configuration
and resets this counter to zero.

Additionally, the intervals between successive increments are timed, and if
a call is made to increment the counter and the time between the last call
exceeds a certain threshold then the configuration is refetched again as well.

Both these behaviors can be controlled via `lcb_cntl()`. To modify the error
counter threshold, use the `LCB_CNTL_CONFERRTHRESH` setting. To modify the
error delay threshold, use the `LCB_CNTL_CONFDELAY_THRESH` setting.


#### File-Based Configuration Cache

The library allows to "cache" the configuration settings in a file and then pass
this file to create another instance which will be configured without having to
perform network I/O to retrieve the initial map.

The goal of this feature is to limit the number of initial connections for
retrieving the cluster map, as well as to reduce latency for performing simple
operations. Such a usage is ideal for short lived applications which are spawned
as simple scripts (e.g. PHP scripts).

To use the configuration cache you must use a special form of initialization:

```c
lcb_error_t err;
lcb_t instance;
struct lcb_cached_config_st cacheinfo;

memset(&cacheinfo, 0, sizeof(cacheinfo));
cacheinfo.cachefile = "/tmp/lcb_cache";
/** Access the normal lcb_create_st structure via the 'createopt' field */
cacheinfo.createopt.v.v0.host = "foo.com";

err = lcb_create_compat(LCB_CACHED_CONFIG, &cacheinfo, &instance, NULL);
if (err != LCB_SUCCESS) {
	die("Couldn't create cached info", err)
}
```

If the cache file does not exist, the client will bootstrap from the network
and write the information to the file once it has received the map itself.
You may check to see if the client has loaded a configuration from the cache
(and does not need to fetch the config from the network) by using `lcb_cntl()`

```c
int is_loaded = 0;
lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_CONFIG_CACHE_LOADED, &is_loaded);
if (is_loaded) {
	printf("Configuration cache file loaded OK\n");
} else {
	printf("Configuration cache likely does not exist yet\n");
}
```

> _Memcached_ buckets are not supported with the configuration cache


## Timeouts

As a general prelude to timeouts, timeouts implemented in the library are
implemented with the aim of preventing a single operation hanging or waiting
indefinitely for an I/O operation to complete. Thus while typically timeouts
may be exact, if they are not they will tend to fire sooner rather than
later.

On the other hand, note that internally timeouts are implemented within an
event loop (as opposed to a kernel-based signal timer). This means

* The timer can only fire when and if the event loop is active
* The timer may end up being delayed if it ends up being scheduled
  _after_ other operations which themselves perform blocking timeouts or long
  busy loops. (Note that libcouchbase does not do this, but your own code may).

As an I/O library, libcouchbase has quite a few timeout settings. The main
timeout setting is known as the _operation timeout_ and indicates the amount of
time to wait from when the operation was scheduled. If a response was not
received before this time period the library will fail the operation and invoke
the callback - at which point the error will be set to `LCB_ETIMEDOUT`. The
operation to control this via `lcb_cntl` is `LCB_CNTL_OP_TIMEOUT`.

In addition to the operation timeout, there is also the bootstrap timeout which
controls the amount of time the library will wait for the initial bootstrap.
The bootstrap timeout is comprised of two timeout values. One value controls
the overall amount of time the library should wait until a configuration has
been received, while the other controls the amount of time per-node that the
library will wait for until the next node is retried.

The first timeout represents the absolute timeout and is accessed via the
`LCB_CNTL_CONFIGURATION_TIMEOUT`. As mentioned before this value places the
absolute limit on the amount of time the library will try to wait until the
client has been bootstrapped before delivering the error. Note that this timeout
only makes sense during the initial connection and has no effect threafter.

An additional timeout setting is the per-node bootstrap timeout. When fetching
the cluster configuration there are often multiple nodes which may function
as configuration sources. Configurations are initially retrieved once during
initialization but may also be fetched later on typically when an error condition
is detected by the library or when the cluster topology changes. In such
situations the behavior is to start fetching the configuration from each
node in the list, in sequence. If the retrieval of the config from the first
node fails with a timeout (i.e. the node is unresponsive) the library will
proceeed to fetch from the next node and so on until all nodes are exhausted.
This setting, may be accessed via the `LCB_CNTL_CONFIG_NODE_TIMEOUT` operation.


