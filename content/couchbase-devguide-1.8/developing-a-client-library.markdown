# Developing a Client Library

This chapter is relevant for developers who are creating their own client
library that communicates with the Couchbase Server. For instance, developers
creating a library for language or framework that is not yet supported by
Couchbase would be interested in this content.

Couchbase SDKs provide an abstraction layer your web application will use to
communicate with a cluster. Your application logic does not need to contain
logic about navigating information in a cluster, nor does it need much
additional code for handling data requests.

Once your client makes calls into your client library the following should be
handled automatically at the SDK level:

 * Maintain direct communications with the cluster,

 * Determining cluster topology,

 * Distribute requests to the cluster; automatically make reads and writes to the
   correct node in a cluster,

 * Direct and redirect requests based on topology changes,

 * Handle and direct requests appropriately during a failover.

In general, your Couchbase client library implemention will be similar to a
`memcached` (binary protocol) client library implementation.

For instance, it may even be an extension of some existing `memcached`
binary-protocol client library), but just supports a different key hashing
approach. Instead of using modulus or ketama/consistent hashing, the new hashing
approach in Couchbase is instead based around "vbuckets", which you can read up
more about [here](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)

In the vBucket approach, to find a server to talk to for a given key, your
client library should hash the key string into a vBucket-Id (a 16-bit integer).
The default hash algorithm for this step is plain CRC, masked by the required
number of bits. The vBucket-Id is then used as an array index into a server
lookup table, which is also called a vBucket-to-server map. Those two steps will
allow your client library to find the right couchbase server given a key and a
vBucket-to-server map. This extra level of indirection (where we have an
explicit vBucket-to-server map) allows couchbase to easily control item data
rebalancing, migration and replication.

<a id="cb-sasl-example"></a>

## Providing SASL Authentication

This section is relevant for developers who are creating their own client
library that communicates with the Couchbase Server. For instance, developers
creating a library for language or framework that is not yet supported by
Couchbase would be interested in this content.

In order to connect to a given bucket you need to run a SASL authentication with
the `Couchbase` server. The SASL authentication for `Couchbase` is specified in
[SASLAuthProtocol](http://code.google.com/p/memcached/wiki/SASLAuthProtocol)
(binary protocol only).

[vbucketmigrator](http://github.com/membase/vbucketmigrator) implements SASL
Authentication by using libsasl in C if you want some example code.

<a id="couchbase-client-development-saslauth-listmechanisms"></a>

### List Mechanisms

We start the SASL authentication by asking the `memcached` server for the
mechanisms it supports. This is achieved by sending the following packet:


```
Byte/ 0 | 1 | 2 | 3 |
/ | | | |
|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
+---------------+---------------+---------------+---------------+
0| 80 | 20 | 00 | 00 |
+---------------+---------------+---------------+---------------+
4| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
8| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
12| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
16| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
20| 00 | 00 | 00 | 00 |
```


```
Header breakdown
Field (offset) (value)
Magic (0): 0x80 (PROTOCOL_BINARY_REQ)
Opcode (1): 0x20 (sasl list mechs)
Key length (2-3): 0x0000 (0)
Extra length (4): 0x00
Data type (5): 0x00
vBucket (6-7): 0x0000 (0)
Total body (8-11): 0x00000000 (0)
Opaque (12-15): 0x00000000 (0)
CAS (16-23): 0x0000000000000000 (0)
```

If the server supports SASL authentication the following packet is returned:


```
Byte/ 0 | 1 | 2 | 3 |
/ | | | |
|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
+---------------+---------------+---------------+---------------+
0| 81 | 20 | 00 | 00 |
+---------------+---------------+---------------+---------------+
4| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
8| 00 | 00 | 00 | 05 |
+---------------+---------------+---------------+---------------+
12| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
16| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
20| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
24| 50 ('P') | 4c ('L') | 41 ('A') | 49 ('I') |
+---------------+---------------+---------------+---------------+
```

28| 4e ('N') |


```
Header breakdown
Field (offset) (value)
Magic (0): 0x81 (PROTOCOL_BINARY_RES)
Opcode (1): 0x20 (sasl list mechs)
Key length (2-3): 0x0000 (0)
Extra length (4): 0x00
Data type (5): 0x00
Status (6-7): 0x0000 (SUCCESS)
Total body (8-11): 0x00000005 (5)
Opaque (12-15): 0x00000000 (0)
CAS (16-23): 0x0000000000000000 (0)
Mechanisms (24-28): PLAIN
```

Please note that the server may support a different set of mechanisms. The list
of mechanisms is a space-separated list of SASL mechanism names (e.g. "PLAIN
CRAM-MD5 GSSAPI").

<a id="couchbase-client-development-saslauth-authreq"></a>

### Making an Authentication Request

After choosing the desired mechanism from the ones that the Couchbase Server
supports, you need to create an authentication request packet and send it to the
server. The following packet shows a packet using PLAIN authentication of "foo"
with the password "bar":


```
Byte/ 0 | 1 | 2 | 3 |
/ | | | |
|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
+---------------+---------------+---------------+---------------+
0| 80 | 21 ('!') | 00 | 05 |
+---------------+---------------+---------------+---------------+
4| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
8| 00 | 00 | 00 | 10 |
+---------------+---------------+---------------+---------------+
12| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
16| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
20| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
24| 50 ('P') | 4c ('L') | 41 ('A') | 49 ('I') |
+---------------+---------------+---------------+---------------+
28| 4e ('N') | 66 ('f') | 6f ('o') | 6f ('o') |
+---------------+---------------+---------------+---------------+
32| 00 | 66 ('f') | 6f ('o') | 6f ('o') |
+---------------+---------------+---------------+---------------+
36| 00 | 62 ('b') | 61 ('a') | 72 ('r') |
```


```
Header breakdown
Field (offset) (value)
Magic (0): 0x80 (PROTOCOL_BINARY_REQ)
Opcode (1): 0x21 (sasl auth)
Key length (2-3): 0x0005 (5)
Extra length (4): 0x00
Data type (5): 0x00
vBucket (6-7): 0x0000 (0)
Total body (8-11): 0x00000010 (16)
Opaque (12-15): 0x00000000 (0)
CAS (16-23): 0x0000000000000000 (0)
Mechanisms (24-28): PLAIN
Auth token (29-39): foo0x00foo0x00bar
```

When the server accepts this username/password combination, it returns one of
two status codes: Success or "Authentication Continuation". Success means that
you're done


```
Byte/ 0 | 1 | 2 | 3 |
/ | | | |
|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
+---------------+---------------+---------------+---------------+
0| 81 | 21 ('!') | 00 | 00 |
+---------------+---------------+---------------+---------------+
4| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
8| 00 | 00 | 00 | 0d |
+---------------+---------------+---------------+---------------+
12| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
16| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
20| 00 | 00 | 00 | 00 |
+---------------+---------------+---------------+---------------+
24| 41 ('A') | 75 ('u') | 74 ('t') | 68 ('h') |
+---------------+---------------+---------------+---------------+
28| 65 ('e') | 6e ('n') | 74 ('t') | 69 ('i') |
+---------------+---------------+---------------+---------------+
32| 63 ('c') | 61 ('a') | 74 ('t') | 65 ('e') |
+---------------+---------------+---------------+---------------+
36| 64 ('d') |
```


```
Header breakdown
Field (offset) (value)
Magic (0): 0x81 (PROTOCOL_BINARY_RES)
Opcode (1): 0x21 (sasl auth)
Key length (2-3): 0x0000 (0)
Extra length (4): 0x00
Data type (5): 0x00
Status (6-7): 0x0000 (SUCCESS)
Total body (8-11): 0x0000000d (13)
Opaque (12-15): 0x00000000 (0)
CAS (16-23): 0x0000000000000000 (0)
Info (24-36): Authenticated
```

<a id="couchbase-client-development-restjson"></a>

## Handling REST/JSON

The mapping between the vBucket designation and the client interface operates
through a request to the Couchbase Server via client-initiated REST/JSON
requests. The REST/JSON URLs should be provided to the client library as some
initial configuration parameter by the user's application. The client
application should bootstrap the REST/JSON information by "chasing URLs" from a
standard base, starting URL.

Eventually, after following the bootstrapping sequence, your client library will
have a REST/JSON URL that looks like:


```
http://HOST:PORT/pools/default/bucketsStreaming/BUCKET_NAME
```

For example:


```
http://couchbase1:8091/pools/default/bucketsStreaming/default
```

Here's an example response when requesting that URL, in JSON:


```
{
    "name" : "default",
    "bucketType" : "couchbase",
...
    "vBucketServerMap" : {
        "hashAlgorithm" : "CRC",
        "numReplicas" : 1,
        "serverList" : ["10.1.2.14:11210"],
        "vBucketMap" : [[0,-1],[0,-1],[0,-1],[0,-1],[0,-1] : ]
   }
}
```

The REST/JSON URLs might be under HTTP Basic Auth authentication control, so the
client application may also have to provide (optional) user/password information
to the your client library so that the proper HTTP/REST request can be made.

The REST/JSON URLs are "streaming", in that the couchbase REST server doesn't
close the HTTP REST connection after responding with one vBucket-to-server map.
Instead, couchbase keeps the connection open, and continues to stream new maps
to your client library when there are cluster changes (new server nodes being
added, removed, and/or vBuckets getting reassigned to different servers). In the
couchbase streaming approach, new vBucket-to-server map JSON messages are
delimited by 4 newlines ("\n\n\n\n") characters.

The above section describes what we call "per-bucket" REST/JSON URLs. That is,
each port-based bucket has a streaming REST/JSON URL of the form:


```
http://HOST:PORT/pools/default/bucketsStreaming/BUCKET_NAME
```

There is another kind of REST/JSON URL, which describes all SASL-authenticated
buckets. This SASL REST/JSON URL has the form of:


```
http://HOST:PORT/pools/default/saslBucketsStreaming
```

Sample output:


```
{"buckets":[
    {"name":"default",
            "nodeLocator":"vbucket",
            "saslPassword":"",
            "nodes":[
             {"clusterMembership":"active","status":"healthy","hostname":"10.1.4.11:8091",
             "version":"1.6.1rc1","os":"x86_64-unknown-linux-gnu",
             "ports":{"proxy":11211,"direct":11210}},
             {"clusterMembership":"active","status":"healthy","hostname":"10.1.4.12:8091",
             "version":"1.6.1pre_21_g5aa2027","os":"x86_64-unknown-linux-gnu",
             "ports":{"proxy":11211,"direct":11210}}],
            "vBucketServerMap":{
            "hashAlgorithm":"CRC","numReplicas":1,
        "serverList":["10.1.4.11:11210","10.1.4.12:11210"],
        "vBucketMap":[[0,-1],[1,-1],...,[0,-1],[0,-1]]}}

 ]
        }
```

One main difference between the SASL REST/JSON response versus the per-bucket
REST/JSON response is that the SASL REST/JSON response can describe more than
one bucket. In the SASL REST/JSON response, these multiple buckets would be
found under the "buckets" array.

<a id="couchbase-client-development-restjson-parsing"></a>

### Parsing the JSON

Once your client library has received a complete vBucket-to-server map message,
it should use its favorite JSON parser to process the map into more useful data
structures. An implementation of this kind of JSON parsing in C exists as a
helper library in [libvbucket](http://github.com/membase/libvbucket), or for
Java, [jvbucket](http://github.com/membase/jvbucket).

The `libvbucket` and `jvbucket` helper libraries don't do any connection
creation, socket management, protocol serialization, etc. That's the job of your
higher-level library. These helper libraries instead just know how to parse a
JSON vBucket-to-server map and provide an API to access the map information.

<a id="couchbase-client-development-restjson-parsing-vbucketmap"></a>

### Handling vBucketMap Information

The `vBucketMap` value within the returned JSON describes the vBucket
organization. For example:


```
"serverList":["10.1.4.11:11210","10.1.4.12:11210"], "vBucketMap":[[0,1],[1,0],[1,0],[1,0],:,[0,1],[0,1]]
```

The vBucketMap is zero-based indexed by vBucketId. So, if you have a vBucket
whose vBucketId is 4, you'd look up vBucketMap\[4\]. The entries in the
vBucketMap are arrays of integers, where each integer is a zero-based index into
the serverList array. The 0th entry in this array describes the primary server
for a vBucket. Here's how you read this stuff, based on the above config:

The vBucket with vBucketId of 0 has a configuration of `vBucketMap[0]`, or `[0,
1]`. So vBucket 0's primary server is at `serverList[0]`, or `10.1.4.11:11210`.

While vBucket 0's first replica server is at `serverList[1]`, which is
`10.1.4.12:11210`.

The vBucket with vBucketId of 1 has a configuration of `vBucketMap[1]`, or `[1,
0]`. So vBucket 1's primary server is at `serverList[1]`, or `10.1.4.12:11210`.
And vBucket 1's first replica is at `serverList[0]`, or `10.1.4.11:11210`.

This structure and information repeats for every configured vBucket.

If you see a -1 value, it means that there is no server yet at that position.
That is, you might see:


```
"vBucketMap":[[0,-1],[0,-1],[0,-1],[0,-1],:]
```

Sometimes early before the system has been completely configured, you might see
variations of:


```
"serverList":[], "vBucketMap":[]
```

<a id="couchbase-client-development-restjson-vbucket-encoding"></a>

### Encoding the vBucketId

As the user's application makes item data API invocations on your client library
(mc.get("some\_key"), mc.delete("some\_key"), your client library will hash the
key ("some\_key") into a vBucketId. Your client library must also encode a
binary request message (following `memcached` binary protocol), but also also
needs to include the vBucketId as part of that binary request message.

Python-aware readers might look at this implementation for an
[example](http://github.com/membase/ep-engine/blob/master/management/mc_bin_client.py).

Each couchbase server will double-check the vBucketId as it processes requests,
and would return NOT\_MY\_VBUCKET error responses if your client library
provided the wrong vBucketId to the wrong couchbase server. This mismatch is
expected in the normal course of the lifetime of a cluster -- especially when
the cluster is changing configuration, such as during a Rebalance.

<a id="couchbase-client-development-restjson-rebalancing"></a>

### Handling Rebalances in Your Client Library

A major operation in a cluster of Couchbase servers is rebalancing. A Couchbase
system administrator may choose to initiate a rebalance because new servers
might have been added, old servers need to be decommissioned and need to be
removed, etc. An underlying part of rebalancing is the controlled migration of
vBuckets (and the items in those migrating vBuckets) from one Couchbase server
to another.

There is a certain amount of time, given the distributed nature of couchbase
servers and clients, where vBuckets ownership may have changed and migrated from
one server to another server, but your client library has not been informed. So,
your client library could be trying to talk to the 'wrong' or outdated server
for a given item, since your client library is operating with an out-of-date
vBucket-to-server map.

Below is a walk-through of this situation in more detail and how to handle this
case:

Before the Rebalance starts, any existing, connected clients should be operating
with the cluster's pre-rebalance vBucket-to-server map.

As soon as the rebalance starts, Couchbase will "broadcast" (via the streaming
REST/JSON channels) a slightly updated vBucket-to-server map message. The
assignment of vBuckets to servers does not change at this point at the start of
the rebalance, but the serverList of all the servers in the Couchbase cluster
does change. That is, vBuckets have not yet moved (or are just starting to
move), but now your client library knows the addresses of any new couchbase
servers that are now part of the cluster. Knowing all the servers in the cluster
(including all the newly added servers) is important, as you will soon see.

At this point, the Couchbase cluster will be busy migrating vBuckets from one
server to another.

Concurrently, your client library will be trying to do item data operations
(Get/Set/Delete's) using its pre-Rebalance vBucket-to-server map. However, some
vBuckets might have been migrated to a new server already. In this case, the
server your client library was trying to use will return a NOT\_MY\_VBUCKET
error response (as the server knows the vBucketId which your client library
encoded into the request).

Your client library should handle that NOT\_MY\_VBUCKET error response by
retrying the request against another server in the cluster. The retry, of
course, might fail with another NOT\_MY\_VBUCKET error response, in which your
client library should keep probing against another server in the cluster.

Eventually, one server will respond with success, and your client library has
then independently discovered the new, correct owner of that vBucketId. Your
client library should record that knowledge in its vBucket-server-map(s) for use
in future operations time.

An implementation of this can be seen in the libvBucket API
`vbucket_found_incorrect_master()`.

The following shows a swim-lane diagram of how moxi interacts with libvBucket
during NOT\_MY\_VBUCKET errors
[libvbucket\_notmyvbucket.pdf](http://www.couchbase.com/wiki/download/attachments/3342379/libvbucket_notmyvbucket.pdf?version=2&modificationDate=1289323788000).

At the end of the Rebalance, the couchbase cluster will notify streaming
REST/JSON clients, finally, with a new vBucket-to-server map. This can be
handled by your client library like any other vBucket-to-server map update
message. However, in the meantime, your client library didn't require granular
map updates during the Rebalancing, but found the correct vBucket owners on its
own.

<a id="couchbase-client-development-restjson-rebalancing-ffm"></a>

### Fast Forward Map

A planned, forthcoming improvement to the above NOT\_MY\_VBUCKET handling
approach is that Couchbase will soon send an optional second map during the
start of the Rebalance. This second map, called a "fast forward map", provides
the final vBucket-to-server map that would represent the cluster at the end of
the Rebalance. A client library can use the optional fast forward map during
NOT\_MY\_VBUCKET errors to avoid linear probing of all servers and can instead
just jump straight to talking with the eventual vBucket owner.

Please see the implementation in libvBucket that handles a fast-forward-map
[here](http://github.com/membase/libvbucket/blob/master/tests/testapp.c#L67).

The linear probing, however, should be retained by client library
implementations as a good fallback, just-in-case error handling codepath.

<a id="couchbase-client-development-restjson-redundancy-availability"></a>

### Redundancy & Availability

Client library authors should enable their user applications to specify multiple
URLs into the Couchbase cluster for redundancy. Ideally, the user application
would specify an odd number of URLs, and the client library should compare
responses from every REST/JSON URL until is sees a majority of equivalent
cluster configuration responses. With an even number of URLs which provide
conflicting cluster configurations (such as when there's only two couchbase
servers in the cluster and there's a split-brain issue), the client library
should provide an error to the user application rather than attempting to access
items from wrong nodes (nodes that have been Failover'ed out of the cluster).

The libvBucket C library has an API for comparing two configurations to support
these kinds of comparisons. See the `vbucket_compare()` function
[here](http://github.com/membase/libvbucket/blob/master/include/libvbucket/vbucket.h).

As an advanced option, the client library should keep multiple REST/JSON streams
open and do continual "majority vote" comparisons between streamed
configurations when there are re-configuration events.

As an advanced option, the client library should "learn" about multiple cluster
nodes from its REST/JSON responses. For example, the user may have specified
just one URL into a multi-node cluster. The REST/JSON response from that one
node will list all other nodes, which the client library can optionally,
separately contact. This allows the client library to proceed even if the first
URL/node fails (as long as the client library continues running).

<a id="cb-protocol-extensions"></a>

## Couchbase Protocol Extensions

In addition to the protocol commands described previously, Couchbase Server and
client SDK's support the following command extensions, when compared to the
existing memchaced protocol:

 * `CMD_STOP_PERSISTENCE`

 * `CMD_START_PERSISTENCE`

 * `CMD_SET_FLUSH_PARAM`

 * `CMD_SET_VBUCKET`

 * `CMD_GET_VBUCKET`

 * `CMD_DEL_VBUCKET`

 * `CMD_START_REPLICATION`

 * `CMD_STOP_REPLICATION`

 * `CMD_SET_TAP_PARAM`

 * `CMD_EVICT_KEY`

<a id="licenses"></a>
