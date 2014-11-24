# Advanced Usage

## Timeouts
The PHP SDK currently implements a timeout for Couchbase operations
which is defaulted to 2.5 seconds.  This timeout can be adjusted via 
the `getTimeout` and `setTimeout` methods.  The following is an example =
of this:

    <?php
    // Connect to our cluster
    $cb = new Couchbase("192.168.1.200:8091");
    
    // Adjust our timeout to 100000usec rather than the default of 2500000usec
    $cb->setTimeout(100000);
    
    // The following operation will timeout if not completed within 100000usec
    $cb->add('test_key', 'test_value');

## Configuration Cache
Note, this feature is currently experimental!

Due to the highly maleable nature of a Couchbase cluster, the
configuration information which holds a list of all cluster nodes
along with various other important pieces of cluster meta-data needs
to be downloaded when a connection to the cluster is established.
This is a 'heavy' call to make to a Couchbase cluster, and because of
this, we have implemented a system that allows temporary cacheing
of this data such that requests that are executed simultaneously, or 
close together will not incur the configuration lookup penalty.

In order to enable this feature, you must specify the 
`couchbase.config_cache` option somewhere in your php configuration.
The value of this option should be a path to a directory where you
would like to store the cached data.

See the [example couchbase ini](https://github.com/couchbase/php-ext-couchbase/blob/master/example/couchbase.ini#L96)
for further information.


## Replica Read

As of version 1.2.0 of the PHP client library, we now support an operation known as ‘replica read’.  This functionality allows you to read data from your cluster when the node holding the active copy of your document is inaccessible.  This is not a replacement for node failover, but instead provides a stop-gap for gracefully handling situations where a particular document is inaccessible but available through one of its replicas.  It is worth noting that this feature does not guarantee consistency as any pending writes on the primary node may not have been replicated yet.

Using this feature is similar to executing a get request, however there is no Multi variant of replica reads.  Here is an simple example of reading a document from a replica:

    <?php

    // Connect to our cluster
    $cb = new Couchbase("192.168.1.200:8091”);

    // Add a document and ensure replication to another node
    $cb->add("replica_read", "this_is_a_test", 0, 1, 1);

    // Read from our replica
    $replica_cas = "";
    $cb->getReplica("replica_read", NULL, $replica_cas);
