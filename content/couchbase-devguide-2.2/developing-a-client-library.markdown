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

In general, your Couchbase client library implementation will be similar to a
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

<a id="couchbase-client-topology-via-rest"></a>

## Getting Cluster Topology

Your SDK will be responsible for storing keys on particular nodes; therefore
your SDK needs to be able to retrieve current cluster topology. The way that
Couchbase Server stores all addresses for existing keys in a cluster is by
providing a vBucket map. Your SDK will need to request a vBucket map from
Couchbase Server and maintain an open connection for streaming updates from the
server. Couchbase Server will provide vBucket maps and updates as JSON. To
create an maintain such a connection, you can do a REST request from your SDK,
and Couchbase Server will send an initial vBucket Map and stream updates as
needed.

You should provide the appropriate REST endpoints your SDK as some initial
configuration parameter specified in a developer's application. The client
application should bootstrap the REST/JSON information by building URLs
discovered from a standard base URL. After following the bootstrapping sequence
and retrieving the URL for vBucket maps, your client library will have a
REST/JSON URL appears as follows:


```
http://HOST:PORT/pools/default/bucketsStreaming/BUCKET_NAME
```

For example:


```
http://couchbase1:8091/pools/default/bucketsStreaming/default
```

The following is an example response from that URL, in JSON:


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

The REST/JSON URLs are 'streaming', in that the Couchbase Server does not close
the HTTP REST connection after responding with one vBucket map. Instead,
Couchbase Server keeps the connection open and continues to stream vBucket maps
to your client library when there are cluster changes, for instance new server
nodes are added, removed, or when vBuckets are reassigned to different servers.
In the Couchbase Server streaming response, new vBucket-to-server map JSON
messages are delimited by four newlines ("\n\n\n\n") characters.

The above section describes what we call named-bucket REST endpoints. That is,
each named bucket on a specified port has a streaming REST endpoint in the form:


```
http://HOST:PORT/pools/default/bucketsStreaming/BUCKET_NAME
```

There is another kind of REST endpoint which describes all SASL-authenticated
buckets. This SASL-authenticated endpoint has the form of:


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

One main difference between the SASL-based bucket response versus the per-bucket
response is that the SASL-based response can describe more than one bucket in a
cluster. In the SASL REST/JSON response, these multiple buckets would be found
in the JSON response under the "buckets" array.

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

<a id="providing-observe"></a>

## Providing Observe Functions

As of Couchbase Server 2.0, the underlying binary protocol provides the ability
to observe items. This means an application can determine whether a document has
been persisted to disk, or exists on a replica node. This provides developers
assurance that a document will survive node failure. In addition, since the new
views functionality of Couchbase Server will only index a document and include
it in a view once the document is persisted, an observe function provides
assurance that a document will or will not be in a view.

Before you provide an observe-function, you need to understand how to retrieve
cluster topology for your SDK. In other words, your SDK needs to be able to
determine if a key is on a master and/or replica nodes. The observe-function
that you provide in your SDK will need to be sent from your SDK to an individual
node where the key exists; therefore being able to retrieve cluster topology is
critical to implement an observe. Your SDK must also be able to be
'cluster-aware'. This means that your SDK should be able to get updated cluster
topology after node failure, rebalance, or node addition. For more information
about getting cluster topology from an SDK, see [Getting Cluster
Topology](#couchbase-client-topology-via-rest)

To provide an observe function in your SDK, you send the following binary
request from an SDK:


```
Byte/     0       |       1       |       2       |       3       |
     /              |               |               |               |
    |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
    +---------------+---------------+---------------+---------------+
   0| 0x80          | 0x92          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
   4| 0x00          | 0x00          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
   8| 0x00          | 0x00          | 0x00          | 0x14          |
    +---------------+---------------+---------------+---------------+
  12| 0xde          | 0xad          | 0xbe          | 0xef          |
    +---------------+---------------+---------------+---------------+
  16| 0x00          | 0x00          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
  20| 0x00          | 0x00          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
  24| 0x00          | 0x04          | 0x00          | 0x05          |
    +---------------+---------------+---------------+---------------+
  28| 0x68 ('h')    | 0x65 ('e')    | 0x6c ('l')    | 0x6c ('l')    |
    +---------------+---------------+---------------+---------------+
  32| 0x6f ('o')    | 0x00          | 0x05          | 0x00          |
    +---------------+---------------+---------------+---------------+
  36| 0x05          | 0x77 ('w')    | 0x6f ('o')    | 0x72 ('r')    |
    +---------------+---------------+---------------+---------------+
  40| 0x6c ('l')    | 0x64 ('d')    |
    +---------------+---------------+
observe command
Field        (offset) (value)
Magic        (0)    : 0x80
Opcode       (1)    : 0x92
Key length   (2,3)  : 0x0000
Extra length (4)    : 0x00
Data type    (5)    : 0x00
Vbucket      (6,7)  : 0x0000
Total body   (8-11) : 0x00000014
Opaque       (12-15): 0xdeadbeef
CAS          (16-23): 0x0000000000000000
Key #0
    vbucket  (24-25): 0x0004
    keylen   (26-27): 0x0005
             (28-32): "hello"
Key #1
    vbucket  (33-34): 0x0005
    keylen   (35-36): 0x0005
             (37-41): "world"
```

In this type of binary request, all the information that follows the `CAS` value
is considered payload. All information up to and including the `CAS` value is
considered header data. The format of this request is similar to any other
Couchbase Server read/write request, but there are differences in the header and
payload. Here we specify the key that we want to observe as payload, beginning
with `Key #0`. In this example, we provide two keys that we want to observe,
`hello` and `world`. The `Opcode : 0x92` indicates to Couchbase Server that this
is an observe request.

Your SDK should build a binary request packet once for all the keys that will be
observed. After your SDK sends the request to all master and replica nodes
containing the key, a node will send back one response with all keys that exist
on that node.

When you make a binary request, you are providing the functional equivalent of
the following Couchbase Server `STAT` requests which are used in the telnet
protocol:

 * `STAT key_is_dirty` : If Couchbase Server responds with a value of 0, this means
   a key is persisted; if `key_is_dirty` has the value 1, the key is not yet
   persisted.

 * `STAT key_cas` : Couchbase Server provides the current CAS value for a key as a
   response. This type of information is helpful to use in your SDK to determine if
   a key has been updated before you perform an observe.

You will determine how often your SDK will poll Couchbase Server as part of an
observe request. Keep in mind that you should take into account your expected
server workload. You will also need to determine a standard timeout for the
observe function you provide; as an option you can provide the developer the
ability to set a timeout as a parameter. The following statistics are useful in
determining how often you should poll:

 * `Persist Stat` : check this server statistic within your SDK to determine how
   many milliseconds it takes for a key to be persisted.

 * `Repl Stat` : check this server statistic to determine how many milliseconds it
   takes for a key to be placed on a replica node.

When Couchbase Server responds to an observe request, it will be in the
following binary format:


```
Byte/     0       |       1       |       2       |       3       |
     /              |               |               |               |
    |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
    +---------------+---------------+---------------+---------------+
   0| 0x81          | 0x92          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
   4| 0x00          | 0x00          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
   8| 0x00          | 0x00          | 0x00          | 0x26          |
    +---------------+---------------+---------------+---------------+
  12| 0xde          | 0xad          | 0xbe          | 0xef          |
    +---------------+---------------+---------------+---------------+
  16| 0x00          | 0x00          | 0x03          | 0xe8          |
    +---------------+---------------+---------------+---------------+
  20| 0x00          | 0x00          | 0x00          | 0x64          |
    +---------------+---------------+---------------+---------------+
  24| 0x00          | 0x04          | 0x00          | 0x05          |
    +---------------+---------------+---------------+---------------+
  28| 0x68 ('h')    | 0x65 ('e')    | 0x6c ('l')    | 0x6c ('l')    |
    +---------------+---------------+---------------+---------------+
  32| 0x6f ('o')    | 0x01          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
  36| 0x00          | 0x00          | 0x00          | 0x00          |
    +---------------+---------------+---------------+---------------+
  40| 0x00          | 0x0a          | 0x00          | 0x05          |
    +---------------+---------------+---------------+---------------+
  44| 0x00          | 0x05          | 0x77 ('w')    | 0x6f ('o')    |
    +---------------+---------------+---------------+---------------+
  48| 0x72 ('r')    | 0x6c ('l')    | 0x64 ('d')    | 0x00          |
    +---------------+---------------+---------------+---------------+
  52| 0xde          | 0xad          | 0xbe          | 0xef          |
    +---------------+---------------+---------------+---------------+
  56| 0xde          | 0xad          | 0xca          | 0xfe          |
    +---------------+---------------+---------------+---------------+
observe response
Field        (offset) (value)
Magic        (0)    : 0x81
Opcode       (1)    : 0x92
Key length   (2,3)  : 0x0000
Extra length (4)    : 0x00
Data type    (5)    : 0x00
Status       (6,7)  : 0x0000
Total body   (8-11) : 0x00000026
Opaque       (12-15): 0xdeadbeef
Persist Stat (16-19): 0x000003e8 (msec time)
Repl Stat    (20-23): 0x00000064 (msec time)
Key #0
    vbucket  (24-25): 0x0004
    keylen   (26-27): 0x0005
             (28-32): "hello"
    keystate (33)   : 0x01 (persisted)
    cas      (34-41): 000000000000000a
Key #1
    vbucket  (42-43): 0x0005
    keylen   (44-45): 0x0005
             (46-50): "world"
    keystate (51)   : 0x00 (not persisted)
    cas      (52-59): deadbeefdeadcafe
```

In the Couchbase Server response, `keystate` will indicate whether a key is
persisted or not. The following are possible values for `keystate` :

 * `0x00` : Found, not persisted. Indicates key is in RAM, but not persisted to
   disk.

 * `0x01` : Found, persisted. Indicates key is found in RAM, and is persisted to
   disk

 * `0x80` : Not found. Indicates the key is persisted, but not found in RAM. In
   this case, a key is not available in any view/index. Couchbase Server will
   return this `keystate` for any item that is not stored in the server. It
   indicates you will not expect to have the item in a view/index.

 * `0x81` : Logically deleted. Indicates an item is in RAM, but is not yet deleted
   from disk.

It is important that you to understand the difference between 'not found' and
'logically deleted.' The context in which your SDK receives this message is
important. If an SDK performs a write for a key and the key is not found, then
the responses 'not found' and 'logically deleted' indicate the same state of a
key. After an SDK performs a document write, the first thing the SDK needs to
determine is whether or not the item has been stored on the right node; in this
scenario, the 'not found' and 'logically deleted' response both mean that the
item is not yet stored on the appropriate node.

If the SDK performs a delete on a key, then the observe responses 'not found'
and 'logically deleted' have two different meanings about a key. If Couchbase
Server returns 'not found' for a delete operation, this means that the delete
has been persisted on that node. If you receive a 'logically deleted' response
then it means that the item has been removed from Couchbase Server RAM but the
item is not yet deleted from disk.

As a final note, should you choose to provide an observe-function as an
asynchronous method, you need to provide an 'observe-set' as part of your SDK.
An observe-set is a table that stores all the ongoing observe requests sent from
the SDK. When Couchbase Server fulfills an observe request by providing all
required status updates for a key, your SDK should remove an observe request
from the observe-set. In the SDK you should naturally also provide a function
that retrieves any asynchronous observe results that are received from Couchbase
Server and stored in SDK runtime memory.

<a id="cb-protocol-replica-read"></a>

## Replica Read

As of Couchbase Server 2.1.0, we have a binary protocol to retrieve replicated
data for a given key. The command is similar to the existing binary get command,
however it returns data from a vBucket that is in a replica state as opposed to
an active state.

In case of node failure you can have an application retry the server and wait
until replicated data is available on another node. Couchbase Server takes 30
seconds to detect a node has failed, automatically failover the node, and then
elevate replicated data to an active state on another node. If you do not have
automatic failover enabled, it may take even longer for human intervention and
manual failover. Although clients can wait and retry a read, you may have a
scenario where you cannot wait 30 seconds to detect node failure, perform
failover and activate replicated data. For instance if you a SLA that requires
you to get data within 30 seconds of a request or less, you may need replica
read functionality. In this case you can use replica read at the binary protocol
level or as it is available in Couchbase SDKs. For more information about node
failure and failover, see [Couchbase Server Manual, Failing Over
Nodes](http://www.couchbase.com/docs/couchbase-manual-2.1.0/couchbase-admin-tasks-failover.html).

If you create your own Couchbase client, you can also create a wrapper on this
protocol to provide replica reads.

If you use replica read, it will introduce the possibility that a client gets
inconsistent data from the cluster; for this reason we generally recommend you
have your application logic handle shorts periods of unavailability. For example
if a user cannot get their user profile within 30 seconds, you can handle it
with an error message and request that they try later. Replica read will get
replicated data from the functioning node; but this does not ensure that the
document is the most current document. For instance, if you update a document
then immediately perform replica read, the data might not yet be replicated to
the other node and you will get an older version back. If it is very important
that you always have the most current version of a document, you may not satisfy
this with a replica read. One thing you can do to help mitigate this problem is
to keep the CAS value for an item when you set or update it and compare this
with the CAS value returned by replica read. For more information, see [Check
and Set (CAS)](#cb-cas).

The request is identical to a get request with the exception of the Opcode of
0x83:


```
Field (offset) (value)
  Magic (0) : 0x80
  Opcode (1) : 0x83
  Key length (2,3) : 0x0005
  Extra length (4) : 0x00
  Data type (5) : 0x00
  VBucket (6,7) : 0x0000
  Total body (8-11) : 0x00000005
  Opaque (12-15): 0x00000000
  CAS (16-23): 0x0000000000000000
  Extras : None
  Key (24-29): The textual string: "Hello"
  Value : None
```

The response is also identical to a get response except for the Opcode of 0x83:


```
Field (offset) (value)
  Magic (0) : 0x81
  Opcode (1) : 0x83
  Key length (2,3) : 0x0000
  Extra length (4) : 0x04
  Data type (5) : 0x00
  Status (6,7) :0x0000
  Total body (8-11) : 0x00000009
  Opaque (12-15): 0x00000000
  CAS (16-23): 0x0000000000000001
  Key (24-29): The textual string: "Hello"
  Value : The textual string: "World"
```

Possible errors from the server include the following:


```
ENGINE_NOT_MY_VBUCKET = 0x0c
ENGINE_EWOULDBLOCK = 0x07
```

You will get the `ENGINE_NOT_MY_VBUCKET` message if the server cannot find the
vBucket with this key. You may also get this message if the vBucket with this
key is not in replica state. This means you will get this error if the server
has already performed automatic failover and has already elevated the replicated
data into an active state when it got the request. In this case, the key is
available as a get operation and not as a replica read.

Couchbase Server will return `ENGINE_EWOULDBLOCK` if the vBucket with replicated
data is still undergoing rebalance. In this case you may want to provide logic
in your client to retry as a get operation once the rebalance completes.

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
