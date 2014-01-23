
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
* For information about managing XDCR data encryption, see  
[Managing XDCR](../cb-admin/#couchbase-admin-tasks-xdcr) and 
[Managing XDCR data encryption](../cb-admin/#cb-admin-tasks-xdcr-encrypt).
* For command line interface information for managing XDCR and XDCR data encryption, see the 
[couchbase-cli](../cb-cli/#couchbase-cli-tool), 
[Managing XDCR CLI](../cb-cli/#cb-cli-xdcr),  
[Managing XDCR data encryption CLI](../cb-cli/#cb-cli-xdcr-data-encrypt).
* For REST API information for managing XDCR and XDCR data encryption, see the 
[XDCR REST API](../cb-rest-api/#couchbase-admin-restapi-xdcr) and 
[Managing XDCR data encryption](../cb-rest-api/#cb-restapi-xdcr-data-encrypt).


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
To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-

DOC DONE MB-9855 = CLI missing for Get and Regenerate Cluster Certificate for XDCR + SSL

* DOC NOTE MB-9774 = [CLI] server-add command always adds server to default group even if another group name is specified.

* NO MB-9755 = RZA: Incorrect failover message pops up when failing over a node

* DOC NOTE MB-9754 = [CLI-RZA]Create group command fails when '!' is present inside the group name.
* BY DESIGN - SEE TONY (asso w/rza)  MB-9768 = vbuckets shuffle in online upgrade from 2.2.0 to 2.5.0-1011 in 2 replica bucket

* MB-9930 = regression in memory fragmentation in tcmalloc with appends ops(2.5.0v2.2.0)

DOC NOTE * MB-9929 = XDCR+SSL : Upgrade from 2.x-2.5.0: Cluster reference dialog should clearly indicate encryption is available only 2.5.0 onwards

* MB-9885 = Rebalance failed due to badmatch,{error,time-out}

* MB-9858 = Rebalance stuck with heavy dgm

* MB-9831 = It takes more than 2 minutes to persist 1000 documents (~2KB each)

* MB-9824 = RAM gauge has incorrect values if one of 2 buckets is down

* MB-7250 = Mac OS X App should be signed by a valid developer key

* MB-9975 = it's possible to set up "moxi bucket" on ssl proxy port

NO * MB-9790 = standalone modi-server does not auto-restart


[MB-7887](http://www.couchbase.com/issues/browse/MB-7887): **Cluster operations issue**
: If numerous appends to a document are continuously performed, it may lead to 
memory fragmentation and overuse. This is due to an underlying issue of 
inefficient memory allocation and deallocation with the third party software 
`tcmalloc`.

[MB-9885](http://www.couchbase.com/issues/browse/MB-9885): **Rebalance issue**
: If the system is overloaded with requests, rebalance may fail and an error displays associated with the overload. 

[MB-9768](https://www.couchbase.com/issues/browse/MB-9768): **Upgrade issue** 
: vBuckets shuffle in online upgrade from 2.2.0 to 2.5.0 occurs in two replica buckets.

[MB-9707](https://www.couchbase.com/issues/browse/MB-9707): **XDCR issue**
: An incorrect stat "Outbound mutations" stat may occur after a topology change at the source cluster. If all XDCR activity has settled down and data has been replicated, "Outbound mutations" stat should see 0, meaning, there are no remaining mutations to be replicated. Due to race condition, "Outbound mutations" may contain stats from "dead" vbuckets that were active before rebalance but had been migrated to other nodes during the rebalance. If this issue occurs, "Outbound mutations" may show a non-zero stat even after all data is replicated. 

: **Verification**: Verify the data on both the source and destination cluster by checking the number of items in the source vBucker and destination vBucket.

: **Workaround**: Stop and restart XDCR to refresh all stats. If all the data has been replicated, the incoming XDCR stats for the destination cluster does not show set and delete operations. Note: Metadata operations are shown. 

[MB-7160](http://www.couchbase.com/issues/browse/MB-7160): **CLI and Mac OSX issue**
: For Mac OSX there is a bug in `cbcollect_info` and the tool will not 
    include system log files, syslog.tar.gz. This will be fixed in future releases.
