# Configuring and Tuning

## SASL

libcouchbase version 2.2 and later supports the CRAM-MD5 authentication mechanism, which enables you to avoid passing the bucket password as plain text over the wire.

Along with this change, a new setting was introduced: `LCB_CNTL_FORCE_SASL_MECH`, which forces a specific Simple Authentication and Security Layer (SASL) mechanism to use for authentication. This can allow a user to ensure a certain level of security and have the connection fail if the desired mechanism is not available.

    lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_FORCE_SASL_MECH, "CRAM-MD5");

## Configuration and Bootstrapping

libcouchbase 2.3 and later supports multiple methods of bootstrapping and configuration retrieval. Normally you should not change these settings because the library determines the best method available.

### Configuration Sources

<a id="cccp"></a>

You can obtain the cluster configuration by using either the memcached protocol that uses the cluster configuration carrier protocol (CCCP) or the legacy mode that uses a connection to the REST API. CCCP is available only in cluster version 2.5 and later and libcouchbase version 2.3 and later.

The default behavior of the library is to first attempt bootstrap over CCCP and then fall back to HTTP if CCCP fails. CCCP bootstrap is preferable because it does not require a dedicated configuration socket, does not require the latency and overhead of the HTTP protocol, and is more efficient to the internals of the cluster.

To explicitly define the set of configuration modes to use, specify the modes inside the `lcb_create_st` structure.

The following snippet disables HTTP bootstrapping:

```c
struct lcb_create_st crparams = { 0 };

lcb_config_transport_t transports[] = {
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

The `transports` field accepts an array of enabled transports followed by the
end-of-list element (`LCB_CONFIG_TRANSPORT_LIST_END`). If this parameter is
specified, the library _only_ uses the transports that are specified in the list.

The enabled transports remain valid for the duration of the instance. This means that it is used for the initial bootstrap and any subsequent configuration updates.


#### Memcached Buckets
Memcached buckets *do not* support CCCP. You must ensure that HTTP is enabled for them (which is the default)


### Configuration Updates

During the lifetime of a client, its cluster configuration might need to change
or be retrieved. Reasons for this include:

* The cluster pushing a new configuration to the client
* Nodes being added, removed, or failed over to or from the cluster
* Client proactively fetching configuration due to an error


These changes are collectively known as _topology changes_ or _configuration
changes_. As mentioned in the list, fetching a configuration might
not _always_ be the result of an actual topology change. For example, if a certain
node becomes unreachable to the client, then the client will attempt to fetch a
new configuration under the assumption that the unresponsive node has potentially
been ejected from the cluster.

For proactive configuration fetches (such as in response to an error) there is
effectively a responsiveness-for-efficiency trade off. If the client does not
check for updated configurations often enough, it risks failing operations
that could have succeeded if it knew about the updated topology. If the
client fetches the configuration too quickly, it can cause a lot of traffic and
increase load on the server (this especially holds true with HTTP). Because
some server versions allocate quite a few resources for each HTTP connection, maintaining idle HTTP connections might be more expensive than
re-establishing them on demand.

Rather than guess your hardware and infrastructure requirements, there are
several settings in the library to help you tune it to your needs.

#### Error Thresholds

Each time a network-like error is encountered in the library (that is, a timeout 
or connection error), an internal error counter is incremented. When the
counter reaches a specified value, the library fetches a new configuration
and resets the counter to zero.

The intervals between successive increments are timed. If
a call is made to increment the counter and the time between the last call
exceeds a certain threshold, then the configuration is refetched again.

You can control both behaviors by using the `lcb_cntl()` method. To modify the error
counter threshold, use the `LCB_CNTL_CONFERRTHRESH` setting. To modify the
error delay threshold, use the `LCB_CNTL_CONFDELAY_THRESH` setting.


#### File-Based Configuration Cache

The library allows you to cache the configuration settings in a file and then pass the file to create another instance. The new instance is configured without having to perform network I/O to retrieve the initial map.

The goal of this feature is to limit the number of initial connections for
retrieving the cluster map and to reduce latency for performing simple
operations. Such a usage is ideal for short lived applications that are spawned
as simple scripts (for example, PHP scripts).

To use the configuration cache you must use a special form of initialization:

```c
lcb_error_t err;
lcb_t instance;
struct lcb_create_st cropts;
cropts.v.v0.host = "foo.com";
err = lcb_create(&instance, &cropts);
if (err != LCB_SUCCESS) {
    die("Couldn't create instance", err);
}

/* now set the cache */
const char *cachefile = "some_file";
err = lcb_cntl(instance, LCB_CNTL_SET, LCB_CNTL_CONFIGCACHE, (void*)cachefile);
if (err != LCB_SUCCESS) {
    die("Couldn't assign the configuration cache!\n");
}
```

If the cache file does not exist, the client bootstraps from the network
and writes the information to the file after it has received the map itself.
You can check to see if the client has loaded a configuration from the cache
(and does not need to fetch the configuration from the network) by using `lcb_cntl()`

```c
int is_loaded = 0;
lcb_cntl(instance, LCB_CNTL_GET, LCB_CNTL_CONFIG_CACHE_LOADED, &is_loaded);
if (is_loaded) {
	printf("Configuration cache file loaded OK\n");
} else {
	printf("Configuration cache likely does not exist yet\n");
}
```

##### Limitations

You need to be aware of the following limitations:

* Memcached buckets are not supported with the configuration cache.

* The file-based provider is recommended only for short-lived clients. It is
  intended to reduce network I/O and latency during the initial bootstrap
  process. It is not a recommended solution for reducing the total number
  of connections to the cluster.


## Timeouts

Timeouts prevent a single operation from hanging or waiting indefinitely for an I/O operation to complete. Typically, timeouts are exact, but if they are not, they tend to fire early rather than late.

Internally, timeouts are implemented within an event loop (as opposed to a kernel-based signal timer). This means:

* The timer can fire only when and if the event loop is active.
* The timer might be delayed if it is scheduled after other operations that perform blocking timeouts or long busy loops. (libcouchbase does not do this, but your own code might).

As an I/O library, libcouchbase has quite a few timeout settings. The main
timeout setting is the _operation timeout_, which indicates the amount of
time to wait from when the operation was scheduled. If a response is not
received within this time period, the library fails the operation and invokes
the callback, at which point the error will be set to `LCB_ETIMEDOUT`. The
operation to control this via `lcb_cntl` is `LCB_CNTL_OP_TIMEOUT`.

The bootstrap timeout, which controls the amount of time the library waits for the initial bootstrap, is another important timeout. The bootstrap timeout comprises two timeout values, the absolute timeout and the per-node bootstrap timeout. The absolute timeout controls
the overall amount of time the library should wait until a configuration has
been received, while the per-node bootstrap timeout controls the amount of time per-node that the
library will wait until the next node is retried.

You can access the absolute timeout via the
`LCB_CNTL_CONFIGURATION_TIMEOUT`. This value places an
absolute limit on the amount of time the library waits until the
client has been bootstrapped before delivering an error. This timeout
is used only during the initial connection and has no effect thereafter.

You can access the bootstrap timeout via the `LCB_CNTL_CONFIG_NODE_TIMEOUT` operation.
When fetching
the cluster configuration there are often multiple nodes that might function
as configuration sources. Configurations are retrieved once during
initialization, but might also be fetched later on, typically when an error condition
is detected by the library or when the cluster topology changes. In such
situations, the behavior is to start fetching the configuration from each
node in the list, in sequence. If the retrieval of the configuration from the first
node fails with a timeout (that is, the node is unresponsive) the library will
proceed to fetch from the next node and so on until all nodes are exhausted.


