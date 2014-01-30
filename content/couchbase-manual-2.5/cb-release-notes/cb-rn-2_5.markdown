
# Couchbase Server Release Notes for 2.5 GA
Couchbase Server 2.5 (January 2014) is minor release following 
Couchbase Server 2.2. This includes some important new features and bug fixes.


## Enhancements in 2.5

The new features for this release are for the Enterprise Edition only 
and include:

* Rack Awareness
* XDCR data security


### Rack Awareness feature
The Rack Awareness feature allows logical groupings of servers on a cluster 
where each server group physically belongs to a rack or availability zone. 
This feature provides the ability to specify that active and corresponding 
replica partitions be created on servers that are part of a separate rack or zone. 
This increases reliability and availability in case entire racks or zones become unavailable. 

* For architecture and concept information about Rack Awareness and server groups, see  [Rack Awareness](../cb-admin/#cb-concepts-rack-aware).
* For user interface information about managing Rack Awareness, see  [Managing Rack Awareness](../cb-admin/#cb-admin-tasks-rack-aware).
* For command line interface information for managing server groups, see the 
[couchbase-cli](../cb-cli/#couchbase-cli-tool) and 
[couchbase-cli, Managing Rack Awareness](../cb-cli/#cb-cli-rack-aware).
* For REST API information for managing server groups, see the 
[Rack Awareness REST API](../cb-rest-api/#cb-restapi-rack-aware).


### XDCR data encryption feature
The cross data center (XDCR) data security feature provides secure cross 
data center replication using Secure Socket Layer (SSL) encryption. 
The data replicated between clusters can be SSL-encrypted in both uni and bi-directional. 

With the XDCR data security feature, the XDCR traffic can be secured by selecting the 
XDCR encryption option and providing the remote cluster's certificate. 
The certificate is a self-signed certificate used by SSL to initiate secure sessions.



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

Prior to upgrading, if buckets are using any of these reserved ports, change the port for the bucket. 
Otherwise, XDCR data encryption is unavailable. (This applies to both offline and online upgrades.) 


<div class="notebox"><p>Upgrade Note</p> 
<p>When upgrading to Couchbase Server 2.5, vBuckets re-shuffling occurs during the first swap rebalance 
and when two (2) or more replica vBuckets are present. This behavior is expected.
</p></div>


* For architecture and concept information about XDCR and XDCR data encryption, see 
[Cross Datacenter Replication](../cb-admin/#cb-concepts-xdcr) and 
[XDCR data encryption](../cd-admin/#cb-concepts-xdcr-data-encrypt).
* For information about managing XDCR data encryption, see  
[Managing XDCR](../cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](../cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information for managing XDCR and XDCR data encryption, 
see the [couchbase-cli](../cb-cli/#couchbase-cli-tool), [Managing XDCR CLI](../cb-cli/#cb-cli-xdcr), 
and [Managing XDCR data encryption CLI](../cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information for managing XDCR and XDCR data encryption, see the 
[XDCR REST API](../cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption](../cb-rest-api/#cb-restapi-xdcr-data-encrypt).



## Upgrade notes for 2.5

During upgrade to Couchbase Server 2.5, vBuckets re-shuffling occurs during the first swap rebalance 
and when two (2) or more replica vBuckets are present. 
This behavior is expected. 

Prior to upgrading, if buckets are using any of the following reserved ports, change the port for the bucket. 
Otherwise, XDCR data encryption is unavailable. (This applies to both offline and online upgrades.) 

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

[MB-9953](http://www.couchbase.com/issues/browse/MB-9953): For XDCR, mutations are not replicating to the destination cluster. 

[MB-9938](http://www.couchbase.com/issues/browse/MB-9938): In a DGM scenario, memcached disconnects when doing disk fetches.

[MB-9926](http://www.couchbase.com/issues/browse/MB-9926): In XDCR, xmem replication fails to send documents for which get-meta requests failed.

[MB-9864](http://www.couchbase.com/issues/browse/MB-9864): Corrupted messages are logged in the `ep_warmup_access_log` access log file. 

[MB-9800](http://www.couchbase.com/issues/browse/MB-9800): Partition 910 not in active or passive set error during rebalance. 

[MB-9745](http://www.couchbase.com/issues/browse/MB-9745): XDCR recovery time is slow when an error is encountered.

[MB-9693](http://www.couchbase.com/issues/browse/MB-9693): Remote memcached and ep_engine returns ENOENT incorrectly.

[MB-9663](http://www.couchbase.com/issues/browse/MB-9663): With XDCR, vBuckets are slow to replicate.

[MB-9451](http://www.couchbase.com/issues/browse/MB-9451): Running cbcollect-info causes nodes to automatically failover.

[MB-9361](http://www.couchbase.com/issues/browse/MB-9361): On Windows, rebalance fails with a `Cannot allocate 18380923 bytes of memory (of type \"binary\")' error message.

[MB-9209](http://www.couchbase.com/issues/browse/MB-9209): With XDCR, beam memory usage over time for the source cluster increases.





## Known issues in 2.5
To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-xxxx


[MB-9992](http://www.couchbase.com/issues/browse/MB-9992): **vBucket issue**
: Memory is not released after a flush.


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
: The `couchbase-cli xdcr-setup` allows `--xdcr-cluster-name` as optional option while Web Console has this field as mandatory. 



