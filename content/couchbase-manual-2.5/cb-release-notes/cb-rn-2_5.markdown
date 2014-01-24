
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

<div class="notebox"><p>Upgrade Note</p> 
<p>vBuckets re-shuffling occurs during upgrade (from 2.2.0 to 2.5.0) during the first swap rebalance and when two (2) or more replica vBuckets are present. This behavior is expected.
</p></div>


* For architecture and concept information about XDCR and XDCR data encryption, see 
[Cross Datacenter Replication](../cb-admin/#cb-concepts-xdcr) and 
[XDCR data encryption](../cd-admin/#cb-concepts-xdcr-data-encrypt).
* For information about managing XDCR data encryption, see  
[Managing XDCR](../cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](../cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information for managing XDCR and XDCR data encryption, see the [couchbase-cli](../cb-cli/#couchbase-cli-tool), [Managing XDCR CLI](../cb-cli/#cb-cli-xdcr),  and [Managing XDCR data encryption CLI](../cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information for managing XDCR and XDCR data encryption, see the 
[XDCR REST API](../cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption](../cb-rest-api/#cb-restapi-xdcr-data-encrypt).


## Fixed or resolved issues in 2.5
[MB-8981](https://www.couchbase.com/issues/browse/MB-8981) : External IP Addresses and EC2 error associated with the address not being resolved.

[MB-9019](https://www.couchbase.com/issues/browse/MB-9019) : If you are using XDCR and you set the purge interval to a fairly low number, such as less than one day, you may experience significant mismatch in data replicated from a source to destination cluster.

[MB-9049](https://www.couchbase.com/issues/browse/MB-9049) : If you are using Elastic Search with Couchbase Server, you must use the REST protocol for XDCR replication to Elastic Search.

[MB-8712](http://www.couchbase.com/issues/browse/MB-8712) : For Mac OSX, if you move the server after it is installed and configured, it
      will fail.

[MB-8962](http://www.couchbase.com/issues/browse/MB-8962) : If you upgrade to 2.1.1 or later from 2.1.0 or earlier the server may not automatically 
     start after you reboot the machine.
     
[MB-8932](http://www.couchbase.com/issues/browse/MB-8932)
[MB-9109](http://www.couchbase.com/issues/browse/MB-9109) : If you upgrade an Ubuntu system from 1.81 to 2.2.0, the node referenced by the host name is reset during the upgrade. 

[MB-8427](http://www.couchbase.com/issues/browse/MB-8427) : Any non-UTF-8 characters are not filtered or logged by Couchbase Server.

[MB-8654](http://www.couchbase.com/issues/browse/MB-8654) : The detailed rebalance report in Couchbase Web Console display numbers for
      `Total number of keys to be transferred` and `Estimated number of keys
      transferred` when you rebalance empty data buckets.
      
[MB-7168](http://www.couchbase.com/issues/browse/MB-7168) : A cluster rebalance may exit and produce the error {not_all_nodes_are_ready_yet} if you perform the rebalance right after failing over a node in the cluster. 

[MB-8459](http://www.couchbase.com/issues/browse/MB-8459) : If you use `cbbackup`, `cbrestore`, or `cbtransfer` you should perform the
      backup, restore, or transfer from a node in your Couchbase cluster.

[MB-8777](http://www.couchbase.com/issues/browse/MB-8777) : For Mac OSX there is a bug in `cbcollect_info` and the tool will not 
    include system log files, syslog.tar.gz.


## Known issues in 2.5
To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-xxxx

[MB-9930](http://www.couchbase.com/issues/browse/MB-9930): **vBucket issue**
: Regression in memory fragmentation in tcmalloc with appends ops.

[MB-9858](http://www.couchbase.com/issues/browse/MB-9858): **vBucket issue**
: A high percentage of vBucket memory quota used on a vBucket causes rebalance to fail because the backfill task for the vBucket takeover is temporarily suspended due to high memory usage. 

[MB-9831](http://www.couchbase.com/issues/browse/MB-9831): **vBucket issue**
: It takes an unusually long time (more than two minutes) to persist a large number of documents (more than 100) where each document is approximately 2KB each.

[MB-9824](http://www.couchbase.com/issues/browse/MB-9824): **vBucket issue**
: RAM gauge has incorrect values if one of two vBuckets is down.

[MB-7250] (http://www.couchbase.com/issues/browse/MB-7250): **Developer issue**
: Mac OS X App should be signed by a valid developer key.

[MB-9975](http://www.couchbase.com/issues/browse/MB-9975): **XDCR data encryption issue**
: It's possible to set up "moxi bucket" on the SSL proxy port.

[MB-7887](http://www.couchbase.com/issues/browse/MB-7887): **Cluster operations issue**
: If numerous appends to a document are continuously performed, it may lead to 
memory fragmentation and overuse. This is due to an underlying issue of 
inefficient memory allocation and deallocation with the third party software 
`tcmalloc`.

[MB-9885](http://www.couchbase.com/issues/browse/MB-9885): **Rebalance issue**
: If the system is overloaded with requests, rebalance may fail and an error displays associated with the overload. 


[MB-9707](https://www.couchbase.com/issues/browse/MB-9707): **XDCR issue**
: An incorrect stat "Outbound mutations" stat may occur after a topology change at the source cluster. If all XDCR activity has settled down and data has been replicated, "Outbound mutations" stat should see 0, meaning, there are no remaining mutations to be replicated. Due to race condition, "Outbound mutations" may contain stats from "dead" vbuckets that were active before rebalance but had been migrated to other nodes during the rebalance. If this issue occurs, "Outbound mutations" may show a non-zero stat even after all data is replicated. 

: **Verification**: Verify the data on both the source and destination cluster by checking the number of items in the source vBucker and destination vBucket.

: **Workaround**: Stop and restart XDCR to refresh all stats. If all the data has been replicated, the incoming XDCR stats for the destination cluster does not show set and delete operations. Note: Metadata operations are shown. 

[MB-7160](http://www.couchbase.com/issues/browse/MB-7160): **Server issue**
: Several incidents have been reported that after using flush on nodes. Couchbase Server returns TMPFAIL even after a successful flush. 
