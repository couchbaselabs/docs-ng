
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


## Upgrade notes

* For the XDCR data encryption feature, anytime the remote cluster's certificate is regenerated, 
the corresponding source cluster must use the regenerated certificate of the remote cluster 
for replication to continue from source to remote cluster.both the source *and* the 
destination cluster should have certificates updated.

## Fixed or resolved issues in 2.5
 1 [MB-8981](https://www.couchbase.com/issues/browse/MB-8981) 
 2 [MB-9019](https://www.couchbase.com/issues/browse/MB-9019) 
 3 [MB-9049](https://www.couchbase.com/issues/browse/MB-9049) 
 4 [MB-8712](http://www.couchbase.com/issues/browse/MB-8712)
 5 [MB-8962](http://www.couchbase.com/issues/browse/MB-8962)
 6 [MB-8932](http://www.couchbase.com/issues/browse/MB-8932)
 7 [MB-9109](http://www.couchbase.com/issues/browse/MB-9109)
 8 [MB-8427](http://www.couchbase.com/issues/browse/MB-8427)
 9 
10 [MB-8654](http://www.couchbase.com/issues/browse/MB-8654)
11 [MB-7168](http://www.couchbase.com/issues/browse/MB-7168)
12 [MB-8459](http://www.couchbase.com/issues/browse/MB-8459)
13 
14 [MB-8777](http://www.couchbase.com/issues/browse/MB-8777)


## Known issues in 2.5
To browse or submit new issues, see http://www.couchbase.com/issues/browse/MB-xxxx



* *Issue* : [MB-7887](http://www.couchbase.com/issues/browse/MB-7887)
Cluster operations
: If you continuously perform numerous appends to a document, it may lead to 
memory fragmentation and overuse. This is due to an underlying issue of 
inefficient memory allocation and deallocation with the third party software 
`tcmalloc`.

*  *Issue* : [MB-9885](http://www.couchbase.com/issues/browse/MB-9885]
If your system is overloaded with requests, rebalance may fail and an error displays associated with the overload. 

Rebalance may fail when etimedout errors happen.


*  *Issue* : [MB-9774](https://www.couchbase.com/issues/browse/MB-9774)
[CLI] server-add command always adds server to default group even if another group name is specified.


*  *Issues* : [MB-9755](https://www.couchbase.com/issues/browse/MB-9755)
[RZA] Incorrect failover message pops up when failing over a node.

*  *Issues* : [MB-9754](https://www.couchbase.com/issues/browse/MB-9754)
[CLI-RZA] Create group command fails when an exclamation mark (!) is present inside the group name.


*  *Issues* : [MB-9768](https://www.couchbase.com/issues/browse/MB-9768)
vBuckets shuffle in online upgrade from 2.2.0 to 2.5.0-1011 in two replica buckets.

* *Issues* : [MB-9707](https://www.couchbase.com/issues/browse/MB-9707)
Users may see incorrect "Outbound mutations" stat after topology change at source cluster. 


