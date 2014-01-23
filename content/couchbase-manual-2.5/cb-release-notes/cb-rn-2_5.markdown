
# Couchbase Server Release Notes for 2.5 GA
Couchbase Server 2.5 (January 2014) is minor update release for 
Couchbase Server 2.0. This includes some major enhancements, 
new features, and important bug fixes.


## Enhancements in 2.5

The *major enhancements* for this release are for the Enterprise Edition only 
and include:

* Rack Awareness
* XDCR data security


### Rack Awareness feature
The Rack Awareness feature allows logical groupings of servers on a cluster 
where each server group physically belongs to a rack or availability zone. 
This feature provides the ability to specify that active and corresponding 
replica partitions be created on servers that are part of a separate rack or zone. 
This increases reliability and availability in case servers become unavailable. 

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

* For architecture and concept information about XDCR and XDCR data encryption, see 
[Cross Datacenter Replication](../cb-admin/#cb-concepts-xdcr) and 
[XDCR data encryption](../cd-admin/#cb-concepts-xdcr-data-encrypt).
* For user interface information about managing XDCR data encryption, see  
[Managing XDCR](../cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](../cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information for managing XDCR and XDCR data encryption, see the 
[couchbase-cli](../cb-cli/#couchbase-cli-tool), 
[couchbase-cli, Managing XDCR](../cb-cli/#cb-cli-xdcr),  
[couchbase-cli, Managing XDCR data encryption](../cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information for managing XDCR and XDCR data encryption, see the 
[XDCR REST API](../cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption](../cb-rest-api/#cb-restapi-xdcr-data-encrypt).

<div class="notebox">
<p>XDCR data encryption feature</p>
<p>Anytime a destination cluster's certificate is regenerated, corresponding source cluster(s) must use the destination cluster's regenerated certificate for replication. For XDCR replication to occur when XDCR data encryption is enable, the source cluster must be updated with the destination cluster's regenerated certificate.
</p>
<p>For example, if source clusters A, B, C use XDCR data encryption to replicate to destination cluster E, each of the source clusters must be updated whenever the certificate on the destination cluster E is regenerated (changed).
</p>
<p>Under these circumstances, if the source cluster(s) are not updated with the destination cluster's regenerated certificate, replication stops.
</p>
</div>
## Upgrade notes



	

## Fixed or resolved issues in 2.5
>[MB-8981](https://www.couchbase.com/issues/browse/MB-8981) 
>[MB-9019](https://www.couchbase.com/issues/browse/MB-9019) 
>[MB-9049](https://www.couchbase.com/issues/browse/MB-9049) 
>[MB-8712](http://www.couchbase.com/issues/browse/MB-8712)
>[MB-8962](http://www.couchbase.com/issues/browse/MB-8962)
>[MB-8932](http://www.couchbase.com/issues/browse/MB-8932)
>[MB-9109](http://www.couchbase.com/issues/browse/MB-9109)
>[MB-8427](http://www.couchbase.com/issues/browse/MB-8427) 
>[MB-8654](http://www.couchbase.com/issues/browse/MB-8654)
>[MB-7168](http://www.couchbase.com/issues/browse/MB-7168)
>[MB-8459](http://www.couchbase.com/issues/browse/MB-8459)
>[MB-8777](http://www.couchbase.com/issues/browse/MB-8777)


## Known issues in 2.5
To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-xxxx



[MB-7887](http://www.couchbase.com/issues/browse/MB-7887): **Cluster operations issue**
: If numerous appends to a document are continuously performed, it may lead to 
memory fragmentation and overuse. This is due to an underlying issue of 
inefficient memory allocation and deallocation with the third party software 
`tcmalloc`.

[MB-9885](http://www.couchbase.com/issues/browse/MB-9885): **Rebalance issue**
: If the system is overloaded with requests, rebalance may fail and an error displays associated with the overload. 

NOT a BUG, CHANGE DOCS[MB-9774](https://www.couchbase.com/issues/browse/MB-9774): **CLI  and Rack Awareness issue**
: The `couchbase-cli server-add` command always adds servers to the default group even if a server group name (`--group-name=groupName`) is specified.


NOT a BUG [MB-9755](https://www.couchbase.com/issues/browse/MB-9755): **Rack Awareness**
: Incorrect failover message occurs when failing over a node.

 [MB-9754](https://www.couchbase.com/issues/browse/MB-9754): **CLI and Rack Awareness issue**
: For `couchbase-cli group-manage`, the `--create --group-name=groupName` command option fails when the server group name includes an exclamation mark (!).

[MB-9768](https://www.couchbase.com/issues/browse/MB-9768): **Upgrade issue** 
: vBuckets shuffle in online upgrade from 2.2.0 to 2.5.0 occurs in two replica buckets.

[MB-9707](https://www.couchbase.com/issues/browse/MB-9707): **XDCR issue**
: An incorrect stat "Outbound mutations" stat may occur after a topology change at the source cluster. If all XDCR activity has settled down and data has been replicated, "Outbound mutations" stat should see 0, meaning, there are no remaining mutations to be replicated. Due to race condition, "Outbound mutations" may contain stats from "dead" vbuckets that were active before rebalance but had been migrated to other nodes during the rebalance. If this issue occurs, "Outbound mutations" may show a non-zero stat even after all data is replicated. 

: **Verification**: Verify the data on both the source and destination cluster by checking the number of items in the source vBucker and destination vBucket.

: **Workaround**: Stop and restart XDCR to refresh all stats. If all the data has been replicated, the incoming XDCR stats for the destination cluster does not show set and delete operations. Note: Metadata operations are shown. 

[MB-7160](http://www.couchbase.com/issues/browse/MB-7160): **CLI and Mac OSX issue**
: For Mac OSX there is a bug in `cbcollect_info` and the tool will not 
    include system log files, syslog.tar.gz. This will be fixed in future releases.
