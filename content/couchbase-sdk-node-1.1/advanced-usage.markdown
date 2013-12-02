# Advanced Usage

<a id="replica_reads"></a>

## Replica Reads

In addition to the default methods for you to retrieve documents from the cluster (get), we additionally provide the ability to request documents from replica sets (via the getReplica and getReplicaMulti functions).  This allows you to gracefully handle instances where the active node holding your document goes offline, but accessing the document from a replica node may still be acceptable.  Keep in mind that doing storage operations directly to replica nodes is not possible.  Additionally, replica-reads are not meant to provide load balancing capabilities, the cluster handles mapping of keys to individual nodes to provide load balancing accross all available nodes.

Note that retrieving data from a replica node could return potentially stale document contents if the replica did not recieve a newer mutation of the document.

The replica read function works nearly identically to a normal get request, though it does not provide the ability to do getAndTouch operations.  Additionally, replica-reads allow you to specify which replica you wish to retrieve the document from which can be any number from `0` to `num_replicas-1`, you may also specify `-1` (the default) to retrieve from the fastest responding replica node.

<a id="bulk_loading"></a>

## Bulk Loading

Most API functions have both single and multi-key (batched) variants. The
batched variant has the same name as the single-key variant, but its method name
has Multi appended to it.

The batched operations are significantly quicker and more efficient, especially
when dealing with many small values, because they allow pipelining of requests
and responses, saving on network latency.

Batched operations tend to accept an array of keys and return an object where
the object key matches the key requested and the value of said keys are the same
as if a singular operation was done.

<a id="errors_during_batched_operations"></a>

### Errors during Batched Operations

Sometimes a single (or many) keys in a batched operation will fail. In this
case, the callback will receive an error parameter containing 1 (rather than the
usual 0), and the keys that failed will have a result object which contains an
error key containing an error object rather than value key which would normally
contain the value that was retreived.

<a id="logging_and_debugging"></a>

## Logging & Debugging

This section explains how to uncover bugs in your application (or in the SDK
itself).

<a id="components"></a>

### Components

To debug anything, you must be able to identify in which domain a problem is
found. Specifically, the following components participate in typical Couchbase
operations:

 * *Couchbase Server*

   This is the server itself, which stores your data. Errors can happen here if
   your data does not exist, or if there are connectivity issues with one or more
   nodes in the server. Note that while Couchbase Server is scalable and fault
   tolerant, there are naturally some conditions that would cause failures (for
   example, if all nodes are unreachable).

 * *libcouchbase*

   This is the underlying layer that handles network communication and protocol
   handling between a client and a Couchbase node. Network connectivity issues tend
   to happen here.

 * *Node.js C++ Binding Layer*

   This is the C++ code that provides the bulk of the SDK. It interfaces with the
   libcouchbase component, handles marshaling of information between libcouchbase
   and your application, performs input validation, and encoding and decoding of
   keys and values.

 * *Node.js Layer*

   This is written in pure Javascript. For simple key-value operations these
   normally just dispatch to the C++ layer. Most of the view operations are handled
   here as well, with the C++ layer just performing the lower level network
   handling.

<a id="using-the-apis"></a>
