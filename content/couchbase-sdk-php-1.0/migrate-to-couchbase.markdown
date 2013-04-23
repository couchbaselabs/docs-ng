# Migrate to Couchbase

This chapter explains how to move existing codebases to the Couchbase PHP API.

<a id="couchbase-sdk-php-migrating-ext-memcached"></a>

## Migrating from ext/memcached

[ext/memcached](http://php.net/memcached) is a popular PHP extension for
[memcached](http://memcached.org/). You can use Couchbase Server in places where
you use memcached today and take advantage of Couchbase Server's unique features
like scaling over multiple physical machines, persistence or view querying (2.0
or later) as well as many others.

This section will explain how to migrate an existing codebase from ext/memcached
to ext/couchbase.

ext/couchbase is our new PHP extension around libcouchbase, our also new
C-library for connecting to Couchbase Server. ext/couchbase is mostly API
compatible with ext/memcached. However, we made a few changes to take advantage
of libcouchbase's unique features.

You can use ext/memcached with Couchbase Server just fine (using the binary
protocol), so why would you want to migrate to ext/couchbase?

Easy! ext/memcached is what we call a “dumb-client” while ext/couchbase is a
“smart client”. This isn’t meant to sound any derogatory, of course, but points
to the fact that with memcached you always have a single server to connect to or
you are manually managing multiple ones. Couchbase server can manage multiple
servers for you, so you still only connect to one physical node, but
ext/couchbase is “smart” enough to figure out which server to talk to for a
given operation.

And like we said earlier, you get first class access to all the other features
Couchbase has over memcached. We hope that is all reason enough to migrate. Now
let’s go.

<a id="the-differences"></a>

### The Differences

Let’s start with a list of the differences.

<a id="methods"></a>

### Extension Methods

This list shows the differences between the ext/memcached and the ext/couchbase
APIs.

<a id="methods-__construct"></a>

### __construct([string $cluster_url = http://default:@localhost:8091/default[, $persistent = true]])

The constructor for ext/couchbase takes a string identifying one of the cluster
nodes. From there ext/couchbase figures out all the other nodes in a cluster
automatically, whereas in ext/memcached you'd have to use multiple calls to the
addServer() method, that doesn't exist in ext/couchbase.

ext/memcached's $persistent\_id parameter allows you to tie specific instances
of Memcached to persistent connections. In ext/couchbase connections are
persistent by default and you can turn them off with the second optional
parameter to \_\_construct() and setting it to false

<a id="methods-__construct-note"></a>

### Performance Considerations

Note that calling new Couchbase($url) will make a REST call to Couchbase Server
to determine the cluster topology. This is a relatively expensive call and
that's the reason why we use persistent connections by default, so that this
call doesn't have to be made more often then necessary, and most importantly not
on every user-request.

That means, if you have any code that calls new Memcached(); in a tight loop,
you want to move the call to new Couchbase(); to outside of that loop. If you
compare performance between ext/memcached and ext/couchbase and find
ext/couchbase to run at 1/2 the speed of ext/memcached, look for places where
new Couchbase(); is called in a loop or otherwise repeatedly.

<a id="methods-server"></a>

### addByKey(), setByKey(), replaceByKey(), getByKey(), deleteByKey(), appendByKey(), prependByKey(), getDelayedByKey(), setMultiByKey(), getMultiByKey(), addServer(), addServers(), getServerbyKey(), getServerList()

With ext/couchbase you no langer have to manually manage multiple memcached
instances. All methods that are related to that use case aren’t supported by
ext/couchbase.

<a id="append"></a>

### append($key, $value, [int $expiration[, float $cas_token]])

append()'s signature in ext/couchbase is almost identical append() to
ext/memcached. The only difference is two optional arguments: int $expiration
and float $cas\_token. $expliration lets you updated the expiration time for a
key and $cas\_token allows you to make the append operation fail if they key's
existing cas\_token has changed.

append() keeps working like you expect it, but you get the new case
functionality if you like to use that.

<a id="prepend"></a>

### prepend($key, $value, [int $expiration[, float $cas_token]])

prepend()'s signature in ext/couchbase is almost identical prepend() to
ext/memcached. The only difference is two optional arguments: int $expiration
and float $cas\_token. $expliration lets you updated the expiration time for a
key and $cas\_token allows you to make the prepend operation fail if they key's
existing cas\_token has changed.

prepend() keeps working like you expect it, but you get the new case
functionality if you like to use that.

<a id="decrement"></a>

### decrement(string $key[, int $offset = 1[, bool $create = false[, int $expiration = 0[, int $initial = 0]]]])

decrement() adds three more optional parameters.

bool create = false determines whether ext/couchbase should create the key if it
doesn't exist. With this you can model cases where you want to avoid
decrementing non-existent keys. The default is false, do not create non existent
keys.

int $expiration = 0 lets you set a new expiration time for the key. The default
is 0, do not expire.

int initial = 0 allows you to specify an initial value in case you set create =
true. This allows you to start at an arbitrary value without the need for
running extra operations.

decrement() will work like it does in ext/memcached, but you will be able to use
more features with the optional arguments.

<a id="increment"></a>

### increment(string $key[, int $offset = -1[, bool $create = false[, int $expiration = 0[, int $initial = 0]]]])

increment() adds three more optional parameters.

bool create = false determines whether ext/couchbase should create the key if it
doesn't exist. With this you can model cases where you want to avoid
incrementing non-existent keys. The default is false, do not create non existent
keys.

int $expiration = 0 lets you set a new expiration time for the key. The default
is 0, do not expire.

int initial = 0 allows you to specify an initial value in case you set create =
true. This allows you to start at an arbitrary value without the need for
running extra operations.

increment() will work like it does in ext/memcached, but you will be able to use
more features with the optional arguments.

<a id="delete"></a>

### delete(string $key[, float $cas_token])

delete() changes the second optional argument from int $time to float
$cas\_token. Delete with a timeout isn't supported by Couchbase, we hence don't
allow a timeout to be specified with a delete().

Instead delete() gains the opportunity to use a cas value, so you can avoid
deleting a key with a changed cas value.

If you rely on delete() with a time, you need to rework that part of your
application.

<a id="flush"></a>

### flush()

Like delete(), flush() doesn't support flushing after a timeout.

If you rely on flush() with a time, you need to rework that part of your
application.

<a id="constants"></a>

### Extension Constants

Both ext/memcached and ext/couchbase use a number of constants throughout the
API. Most notably result codes and configuration options.

For many constants, you can just switch the Memcached:: (or MEMCACHED\_) prefix
to the Couchbase:: (or COUCHBASE\_) prefix. The constants below are the
exception to this rule.

<a id="Memcached::OPT_HASH"></a>

### Memcached::OPT_HASH

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_DEFAULT"></a>

### Memcached::HASH_DEFAULT

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_MD5"></a>

### Memcached::HASH_MD5

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_CRC"></a>

### Memcached::HASH_CRC

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_FNV1_64"></a>

### Memcached::HASH_FNV1_64

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_FNV1A_64"></a>

### Memcached::HASH_FNV1A_64

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_FNV1_32"></a>

### Memcached::HASH_FNV1_32

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_FNV1A_32"></a>

### Memcached::HASH_FNV1A_32

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_HSIEH"></a>

### Memcached::HASH_HSIEH

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HASH_MURMUR"></a>

### Memcached::HASH_MURMUR

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_DISTRIBUTION"></a>

### Memcached::OPT_DISTRIBUTION

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::DISTRIBUTION_MODULA"></a>

### Memcached::DISTRIBUTION_MODULA

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::DISTRIBUTION_CONSISTENT"></a>

### Memcached::DISTRIBUTION_CONSISTENT

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_LIBKETAMA_COMPATIBLE"></a>

### Memcached::OPT_LIBKETAMA_COMPATIBLE

ext/couchbase handles distribution of keys over a cluster automatically. For
that reasons specifying a hash algorithm doesn't make much sense. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_BUFFER_WRITES"></a>

### Memcached::OPT_BUFFER_WRITES

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_BINARY_PROTOCOL"></a>

### Memcached::OPT_BINARY_PROTOCOL

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_NO_BLOCK"></a>

### Memcached::OPT_NO_BLOCK

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_TCP_NODELAY"></a>

### Memcached::OPT_TCP_NODELAY

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_SOCKET_SEND_SIZE"></a>

### Memcached::OPT_SOCKET_SEND_SIZE

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_SOCKET_RECV_SIZE"></a>

### Memcached::OPT_SOCKET_RECV_SIZE

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_CONNECT_TIMEOUT"></a>

### Memcached::OPT_CONNECT_TIMEOUT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_RETRY_TIMEOUT"></a>

### Memcached::OPT_RETRY_TIMEOUT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_SEND_TIMEOUT"></a>

### Memcached::OPT_SEND_TIMEOUT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_RECV_TIMEOUT"></a>

### Memcached::OPT_RECV_TIMEOUT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_POLL_TIMEOUT"></a>

### Memcached::OPT_POLL_TIMEOUT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_CACHE_LOOKUPS"></a>

### Memcached::OPT_CACHE_LOOKUPS

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::OPT_SERVER_FAILURE_LIMIT"></a>

### Memcached::OPT_SERVER_FAILURE_LIMIT

ext/couchbase handles low-level network settings transparently. There is no
equivalent for this constant in ext/couchbase.

<a id="Memcached::HAVE_IGBINARY"></a>

### Memcached::HAVE_IGBINARY

There is no equivalent for this constant in ext/couchbase.

<a id="Memcached::HAVE_JSON"></a>

### Memcached::HAVE_JSON

There is no equivalent for this constant in ext/couchbase. JSON support is
always included.

<a id="Memcached::GET_PRESERVE_ORDER"></a>

### Memcached::GET_PRESERVE_ORDER

There is no equivalent for this constant in ext/couchbase.

<a id="Memcached::RES_SUCCESS"></a>

### Memcached::RES_SUCCESS

The ext/couchbase equivalent of this constant are Couchbase::SUCCESS and
COUCHBASE\_SUCCESS respectively.

<a id="Memcached::RES_FAILURE"></a>

### Memcached::RES_FAILURE

The ext/couchbase equivalent of this constant are Couchbase::ERROR and
COUCHBASE\_ERROR respectively.

<a id="Memcached::RES_HOST_LOOKUP_FAILURE"></a>

### Memcached::RES_HOST_LOOKUP_FAILURE

The ext/couchbase equivalent of this constant are Couchbase::UNKNOWN\_HOST and
COUCHBASE\_UNKNOWN\_HOST respectively.

<a id="Memcached::RES_PROTOCOL_ERROR"></a>

### Memcached::RES_PROTOCOL_ERROR

The ext/couchbase equivalent of this constant are Couchbase::PROTOCOL\_ERROR and
COUCHBASE\_PROTOCOL\_ERROR respectively.

<a id="Memcached::RES_CLIENT_ERROR"></a>

### Memcached::RES_CLIENT_ERROR

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_SERVER_ERROR"></a>

### Memcached::RES_SERVER_ERROR

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_WRITE_FAILURE"></a>

### Memcached::RES_WRITE_FAILURE

The ext/couchbase equivalent of this constant are Couchbase::NETWORK\_ERROR and
COUCHBASE\_NETWORK\_ERROR respectively.

<a id="Memcached::RES_DATA_EXISTS"></a>

### Memcached::RES_DATA_EXISTS

The ext/couchbase equivalent of this constant are Couchbase::KEY\_EEXISTS and
COUCHBASE\_KEY\_EEXISTS respectively.

<a id="Memcached::RES_NOTSTORED"></a>

### Memcached::RES_NOTSTORED

The ext/couchbase equivalent of this constant are Couchbase::NOT\_STORED and
COUCHBASE\_NOT\_STORED respectively.

<a id="Memcached::RES_NOTFOUND"></a>

### Memcached::RES_NOTFOUND

The ext/couchbase equivalent of this constant are Couchbase::KEY\_ENOENT and
COUCHBASE\_KEY\_ENOENT respectively.

<a id="Memcached::RES_PARTIAL_READ"></a>

### Memcached::RES_PARTIAL_READ

The ext/couchbase equivalent of this constant are Couchbase::PROTOCOL\_ERROR and
COUCHBASE\_PROTOCOL\_ERROR respectively.

<a id="Memcached::RES_SOME_ERRORS"></a>

### Memcached::RES_SOME_ERRORS

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_NO_SERVERS"></a>

### Memcached::RES_NO_SERVERS

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_END"></a>

### Memcached::RES_END

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_BAD_KEY_PROVIDED"></a>

### Memcached::RES_BAD_KEY_PROVIDED

There is no equivalent of this constant in ext/couchbase.

<a id="Memcached::RES_CONNECTION_SOCKET_CREATE_FAILURE"></a>

### Memcached::RES_CONNECTION_SOCKET_CREATE_FAILURE

The ext/couchbase equivalent of this constant are Couchbase::NETWORK\_ERROR and
COUCHBASE\_NETWORK\_ERROR respectively.

<a id="Memcached::RES_PAYLOAD_FAILURE"></a>

### Memcached::RES_PAYLOAD_FAILURE

The ext/couchbase equivalent of this constant are Couchbase::PROTOCOL\_ERROR and
COUCHBASE\_PROTOCOL\_ERROR respectively.

<a id="api-reference-summary"></a>
