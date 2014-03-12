
# Couchbase Server Release Notes for 2.5 GA

Couchbase Server 2.5 (February 2014) is a minor release following 
Couchbase Server 2.2. This includes some important new features and bug fixes.


## Enhancements in 2.5

Couchbase Server 2.5 includes the following new features and enhancement:

* Rack Awareness (Enterprise Edition only)
* XDCR data security (Enterprise Edition only)
* Optimized connection management


### Rack Awareness feature

The Rack Awareness feature allows logical groupings of servers on a cluster 
where each server group physically belongs to a rack or availability zone. 
This feature provides the ability to specify that active and corresponding 
replica partitions be created on servers that are part of a separate rack or zone. 
This increases reliability and availability in case entire racks or zones become unavailable. 

See the following for more information about Rack Awareness:

* For concept details on Rack Awareness and Server Groups, see [Rack Awareness](../cb-admin/#cb-concepts-rack-aware).
* For administrative tasks on managing Rack Awareness, see [Managing Rack Awareness](../cb-admin/#cb-admin-tasks-rack-aware).
* For command line interface information on managing server groups, see the 
[couchbase-cli](../cb-cli/#couchbase-cli-tool) and 
[Managing Rack Awareness CLI](../cb-cli/#cb-cli-rack-aware).
* For REST API information on managing server groups, see the 
[Rack Awareness REST API](../cb-rest-api/#cb-restapi-rack-aware).


### XDCR data encryption feature

The cross data center (XDCR) data security feature provides secure cross 
data center replication using Secure Socket Layer (SSL) encryption. 
The data replicated between clusters can be SSL-encrypted in both uni and bi-directional. 

With the XDCR data security feature, the XDCR traffic can be secured by selecting the 
XDCR encryption option and providing the remote cluster's certificate. 
The certificate is a self-signed certificate used by SSL to initiate secure sessions.

See the following for more information about XDCR data encryption:

* For concept details on XDCR and XDCR data encryption, see 
[Cross Datacenter Replication](../cb-admin/#cb-concepts-xdcr) and 
[XDCR data encryption](../cb-admin/#cb-concepts-xdcr-data-encrypt).
* For administrative tasks on managing XDCR data encryption, see  
[Managing XDCR](../cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](../cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information on managing XDCR and XDCR data encryption, 
see the [couchbase-cli](../cb-cli/#couchbase-cli-tool), [Managing XDCR CLI](../cb-cli/#cb-cli-xdcr), 
and [Managing XDCR data encryption CLI](../cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information on managing XDCR and XDCR data encryption, see the 
[XDCR REST API](../cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption REST API](../cb-rest-api/#cb-restapi-xdcr-data-encrypt).

### Optimized connection management

In releases prior to Couchbase Server 2.5, a developer, via a client library of their choice, randomly selects a host from which to request an initial topology configuration. Any future changes to the cluster map following the initial bootstrap are based on the NOT_MY_VBUCKET response from the server. This connection is made to port 8091 and is based on an HTTP connection. 

Starting with Couchbase Server 2.5, client libraries may instead query a cluster for initial topology configuration for a bucket from one of the nodes in the cluster. This is similar to prior releases. However, this information is transmitted via the memcached protocol on port 11210 (rather than via persistent HTTP connections to port 8091). This significantly improves connection scaling capabilities. 

<div class="notebox"><p>Note</p>
<p>This change is only applicable to Couchbase type buckets (not memcached buckets). An error is returned if a configuration request is received on port 8091.</p>
<p>An updated client library is required take advantage of optimized connection management. Old client libraries will continue to use the port 8091 HTTP connection. See the your selected client library release notes for details.</p>
</div>

For more information, see [Using a smart (vBucket aware) client](../cb-admin/#couchbase-deployment-vbucket-client) in Deployment strategies.

## Upgrade notes for 2.5

When upgrading to Couchbase Server 2.5, if the cluster has more than one (1) replica configured during swap rebalance, some vBuckets are re-distributed across the cluster.

<div class="notebox bp"><p>Important</p>
<p>Prior to upgrading to Couchbase Server 2.5 from previous versions, if buckets are using any of the following reserved ports, change the port for the bucket. 
Otherwise, XDCR data encryption is unavailable. (This applies to both offline and online upgrades.) 
</p></div>

With XDCR data encryption, the following ports are reserved:

Port | Description
-----------|---------------
11214 | Incoming SSL Proxy
11215 | Internal Outgoing SSL Proxy
18091 | Internal REST HTTPS for SSL
18092 | Internal CAPI HTTPS for SSL   

<div class="notebox bp"><p>Important</p>
<p>Ensure that these reserved ports are available prior to using XDCR data encryption.
</p></div>


## Fixed or resolved issues in 2.5

[MB-10058](http://www.couchbase.com/issues/browse/MB-10058): With xmem implementation, mutations may be "dropped" if there are less than 10 memcached errors in the set-meta batch. 

[MB-9953](http://www.couchbase.com/issues/browse/MB-9953): For XDCR, mutations are not replicating to the destination cluster. 

[MB-9938](http://www.couchbase.com/issues/browse/MB-9938): In a DGM scenario, memcached disconnects when doing disk fetches.

[MB-9926](http://www.couchbase.com/issues/browse/MB-9926): In XDCR, xmem replication fails to send documents for which get-meta requests failed.

[MB-9864](http://www.couchbase.com/issues/browse/MB-9864): Corrupted messages are logged in the `ep_warmup_access_log` access log file. 

[MB-9800](http://www.couchbase.com/issues/browse/MB-9800): Partition 910 not in active or passive set error during rebalance. 

[MB-9745](http://www.couchbase.com/issues/browse/MB-9745): XDCR recovery time is slow when an error is encountered.

[MB-9693](http://www.couchbase.com/issues/browse/MB-9693): Remote memcached and ep_engine returns ENOENT incorrectly.

[MB-9677](http://www.couchbase.com/issues/browse/MB09677): A memory leak in the client-side moxi occurs during rebalance.

[MB-9663](http://www.couchbase.com/issues/browse/MB-9663): With XDCR, vBuckets are slow to replicate.

[MB-9549](http://www.couchbase.com/issues/browse/MB-9549): A memory leak occurs when the TTL is updated for a non-resident item.

[MB-9451](http://www.couchbase.com/issues/browse/MB-9451): Running cbcollect-info causes nodes to automatically failover.

[MB-9361](http://www.couchbase.com/issues/browse/MB-9361): On Windows, rebalance fails with a `Cannot allocate 18380923 bytes of memory (of type \"binary\")' error message.

[MB-9209](http://www.couchbase.com/issues/browse/MB-9209): With XDCR, beam memory usage over time increases for the source cluster.

[MB-8724](http://www.couchbase.com/issues/browse/MB-8724): Moxi 1.8.1 leaks memory and crashes via the Linux OOM killer.



## Known issues in 2.5

To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-xxxx


[MB-9992](http://www.couchbase.com/issues/browse/MB-9992): **vBucket issue**
: Under certain circumstances, the ep-engine flush API may not completely free up all memory in a bucket. This API has not been supported in the past few releases. Note: This does not affect the REST API `flush` command. 

: **Workaround**: Delete and recreate the bucket.


[MB-9612](https://www.couchbase.com/issues/browse/MB-9612): On the destination cluster, XDCR spams the cluster management error logs with tmp errors.   

[MB-9858](http://www.couchbase.com/issues/browse/MB-9858): **vBucket issue**
: A high percentage of vBucket memory quota used on a vBucket causes rebalance to fail 
because the backfill task for the vBucket takeover is temporarily suspended due to high memory usage. 

[MB-10049](http://www.couchbase.com/issues/browse/MB-10049): **CLI syntax issue**
: The `couchbase-cli xdcr-setup --xdcr-cluster-name` option is misspelled in the CLI help. 
`--xdcr-cluster-name` is correct. `--xdcr-clucter-name` is incorrect. 

[MB-10005](http://www.couchbase.com/issues/browse/MB-10005): **XDCR data encryption issue**
: Upgrade to Couchbase 2.5 Enterprise Edition succeeds when reserved ports for XDCR data encryption 
are used by buckets.

[MB-10000](http://www.couchbase.com/issues/browse/MB-10000): **XDCR and CLI issue**
: The `couchbase-cli xdcr-setup` allows `--xdcr-cluster-name` as an optional option while Web Console has this field as mandatory. 

[MB-10057](https://www.couchbase.com/issues/browse/MB-10057): With XDCR, Rebalance does not reset XDCR checkpoints. In some cases, XDCR checkpointing may reuse old and stale checkpoints which caused stuck replication.

[MB-10059](https://www.couchbase.com/issues/browse/MB-10059): Replica vBuckets ignore `rev_seq` values of new items from the active vBucket. Instead, new `rev_seq` values are generated for those new item. With XDCR, an inconsistent state may occur.

