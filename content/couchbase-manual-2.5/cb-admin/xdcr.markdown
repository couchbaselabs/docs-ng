<a id="cb-concepts-xdcr"></a>
# Cross Datacenter Replication (XDCR)

Couchbase Server supports cross datacenter replication (XDCR), providing an
easy way to replicate data from one cluster to another for disaster recovery as
well as better data locality (getting data closer to its users).

Couchbase Server provides support for both intra-cluster replication and cross
datacenter replication (XDCR). Intra-cluster replication is the process of
replicating data on multiple servers within a cluster in order to provide data
redundancy should one or more servers crash. Data in Couchbase Server is
distributed uniformly across all the servers in a cluster, with each server
holding active and replica documents. When a new document is added to Couchbase
Server, in addition to being persisted, it is also replicated to other servers
within the cluster (this is configurable up to three replicas). If a server goes
down, failover promotes replica data to active:


![](../images/intra_cluster_repl.png)

Cross datacenter replication in Couchbase Server involves replicating active
data to multiple, geographically diverse datacenters either for disaster
recovery or to bring data closer to its users for faster data access, as shown
in below:


![](../images/xdcr_1.png)

You can also see that XDCR and intra-cluster replication occurs simultaneously.
Intra-cluster replication is taking place within the clusters at both Datacenter
1 and Datacenter 2, while at the same time XDCR is replicating documents across
datacenters. Both datacenters are serving read and write requests from the
application.

## XDCR use cases

**Disaster Recovery.** Disaster can strike your datacenter at any time – often
with little or no warning. With active-active cross datacenter replication in
Couchbase Server, applications can read and write to any geo-location ensuring
availability of data 24x365 even if an entire datacenter goes down.

**Bringing Data Closer to Users.** Interactive web applications demand low
latency response times to deliver an awesome application experience. The best
way to reduce latency is to bring relevant data closer to the user. For example,
in online advertising, sub-millisecond latency is needed to make optimized
decisions about real-time ad placements. XDCR can be used to bring
post-processed user profile data closer to the user for low latency data access.

**Data Replication for Development and Test Needs.** Developers and testers
often need to simulate production-like environments for troubleshooting or to
produce a more reliable test. By using cross datacenter replication, you can
create test clusters that host subset of your production data so that you can
test code changes without interrupting production processing or risking data
loss.

<a id="xdcr-topologies"></a>

## XDCR basic topologies

XDCR can be configured to support a variety of different topologies; the most
common are unidirectional and bidirectional.

Unidirectional Replication is one-way replication, where active data gets
replicated from the source cluster to the destination cluster. You may use
unidirectional replication when you want to create an active offsite backup,
replicating data from one cluster to a backup cluster.

Bidirectional Replication allows two clusters to replicate data with each other.
Setting up bidirectional replication in Couchbase Server involves setting up two
unidirectional replication links from one cluster to the other. This is useful
when you want to load balance your workload across two clusters where each
cluster bidirectionally replicates data to the other cluster.

In both topologies, data changes on the source cluster are replicated to the
destination cluster only after they are persisted to disk. You can also have
more than two datacenters and replicate data between all of them.

XDCR can be setup on a per bucket basis. A bucket is a logical container for
documents in Couchbase Server. Depending on your application requirements, you
might want to replicate only a subset of the data in Couchbase Server between
two clusters. With XDCR you can selectively pick which buckets to replicate
between two clusters in a unidirectional or bidirectional fashion. As shown in
Figure 3, there is no XDCR between Bucket A (Cluster 1) and Bucket A (Cluster
2). Unidirectional XDCR is setup between Bucket B (Cluster 1) and Bucket B
(Cluster 2). There is bidirectional XDCR between Bucket C (Cluster 1) and Bucket
C (Cluster 2):

Cross datacenter replication in Couchbase Server involves replicating active
data to multiple, geographically diverse datacenters either for disaster
recovery or to bring data closer to its users for faster data access, as shown
in below:


![](../images/xdcr_selective.png)

As shown above, after the document is stored in Couchbase Server and before XDCR
replicates a document to other datacenters, a couple of things happen within
each Couchbase Server node.

 1. Each server in a Couchbase cluster has a managed cache. When an application
    stores a document in Couchbase Server it is written into the managed cache.

 1. The document is added into the intra-cluster replication queue to be replicated
    to other servers within the cluster.

 1. The document is added into the disk write queue to be asynchronously persisted
    to disk. The document is persisted to disk after the disk-write queue is
    flushed.

 1. After the documents are persisted to disk, XDCR pushes the replica documents to
    other clusters. On the destination cluster, replica documents received will be
    stored in cache. This means that replica data on the destination cluster can
    undergo low latency read/write operations:


    ![](../images/xdcr-persistence.png)

<a id="xdcr-architecture"></a>

## XDCR architecture

There are a number of key elements in Couchbase Server’s XDCR architecture
including:

**Continuous Replication.** XDCR in Couchbase Server provides continuous
replication across geographically distributed datacenters. Data mutations are
replicated to the destination cluster after they are written to disk. There are
multiple data streams (32 by default) that are shuffled across all shards
(called vBuckets in Couchbase Server) on the source cluster to move data in
parallel to the destination cluster. The vBucket list is shuffled so that
replication is evenly load balanced across all the servers in the cluster. The
clusters scale horizontally, more the servers, more the replication streams,
faster the replication rate. For information on changing the number of data
streams for replication, see [Changing XDCR
settings](#couchbase-admin-xdcr-rest-crossref)

**Cluster Aware.** XDCR is cluster topology aware. The source and destination
clusters could have different number of servers. If a server in the source or
destination cluster goes down, XDCR is able to get the updated cluster topology
information and continue replicating data to available servers in the
destination cluster.

**Push based connection resilient replication.** XDCR in Couchbase Server is
push-based replication. The source cluster regularly checkpoints the replication
queue per vBucket and keeps track of what data the destination cluster last
received. If the replication process is interrupted for example due to a server
crash or intermittent network connection failures, it is not required to restart
replication from the beginning. Instead, once the replication link is restored,
replication can continue from the last checkpoint seen by the destination
cluster.

**Efficient.** For the sake of efficiency, Couchbase Server is able to
de-duplicate information that is waiting to be stored on disk. For instance, if
there are three changes to the same document in Couchbase Server, and these
three changes are waiting in queue to be persisted, only the last version of the
document is stored on disk and later gets pushed into the XDCR queue to be
replicated.

**Active-Active Conflict Resolution.** Within a cluster, Couchbase Server
provides strong consistency at the document level. On the other hand, XDCR also
provides eventual consistency across clusters. Built-in conflict resolution will
pick the same “winner” on both the clusters if the same document was mutated on
both the clusters. If a conflict occurs, the document with the most updates will
be considered the “winner.” If the same document is updated the same number of
times on the source and destination, additional metadata such as numerical
sequence, CAS value, document flags and expiration TTL value are used to pick
the “winner.” XDCR applies the same rule across clusters to make sure document
consistency is maintained:


![](../images/xdcr_conflict_res.png)

As shown in above, bidirectional replication is set up between Datacenter 1 and
Datacenter 2 and both the clusters start off with the same JSON document (Doc
1). In addition, two additional updates to Doc 1 happen on Datacenter 2. In the
case of a conflict, Doc 1 on Datacenter 2 is chosen as the winner because it has
seen more updates.

## XDCR advanced topologies

By combining unidirectional and bidirectional topologies, you have the
flexibility to create several complex topologies such as the chain and
propagation topology as shown below:


![](../images/xdcr_repl_chain.png)

In the image below there is one bidirectional replication link between
Datacenter 1 and Datacenter 2 and two unidirectional replication links between
Datacenter 2 and Datacenters 3 and 4. Propagation replication can be useful in a
scenario when you want to setup a replication scheme between two regional
offices and several other local offices. Data between the regional offices is
replicated bidirectionally between Datacenter 1 and Datacenter 2. Data changes
in the local offices (Datacenters 3 and 4) are pushed to the regional office
using unidirectional replication:


![](../images/xdcr_advanced.png)

A description of the functionality, implementation and limitations of XDCR are
provided in [Behavior and
Limitations](#couchbase-admin-tasks-xdcr-functionality).

To create and configure replication, see [Configuring
Replication](#couchbase-admin-tasks-xdcr-configuration).


<a id="couchbase-admin-tasks-xdcr-functionality"></a>

## XDCR behavior and limitations

### XDCR replication via memcached protocol

 XDCR can
   replicate data through the memcached protocol at a destination cluster. 
   This new mode utilizes highly efficient memcached protocol on the destination cluster for replicating changes. The new mode of XDCR increases XDCR throughput, reducing the CPU usage at destination cluster and also improves XDCR scalability. 
   
   In earlier versions of Couchbase Server only the REST protocol could be used for replication. 
   On a source cluster a work process batched multiple
   mutations and sent the batch to a destination cluster using a REST interface.
   The REST interface at the destination node unpacked the batch of mutations and
   sent each mutation via a single memcached command. The destination cluster then
   stored mutations in RAM. This process is known as *CAPI mode XDCR* as it relies
   on the REST API known as CAPI.

   This second mode available for XDCR is known as *XMEM mode XDCR* and will
   bypass the REST interface and replicates mutations via the memcached protocol at
   the destination cluster:


   ![](../images/XDCR_xmem.png)

   In this mode, every replication process at a source cluster will deliver
   mutations directly via the memcached protocol on the remote cluster. This
   additional mode will not impact current XDCR architecture, rather it is
   implemented completely within the data communication layer used in XDCR. Any
   external XDCR interface remains the same. The benefit of using this mode is
   performance: this will increase XDCR throughput, improve XDCR scalability, and
   reduce CPU usage at destination clusters during replication.

   You can configure XDCR to operate via the new XMEM mode, which is the default or use CAPI
   mode. To do so, you use Couchbase Web Console or the REST API and change the setting for
   `xdcr_replication_mode`, see [Changing Internal XDCR
   Settings](../cb-rest-api/#couchbase-admin-restapi-xdcr-change-settings).

### XDCR and network and system outages

XDCR is resilient to intermittent network failures. In the event that the 
destination cluster is unavailable due to a network interruption, XDCR 
pauses replication and then retries the connection to the cluster every 30 
seconds. Once XDCR can successfully reconnect with a destination cluster, it 
resumes replication. In the event of a more prolonged network failure where 
the destination cluster is unavailable for more than 30 seconds, a source 
cluster continues polling the destination cluster which may result in 
numerous errors over time. 

In case of a network interruption:

1. Delete the replication in 
the Web Console.
1. Fix the system issue.
1. Re-create the replication. 

The new XDCR replication will resume replicating items from where the old 
replication had been stopped. 

Your configurations is retained over host restarts and reboots. 
The replication configuration does not need to be re-configured 
in the event of a system failure.

### XDCR document handling

XDCR does not replicate views and view indexes. To replicate views and view indexes,  manually exchange view definitions between clusters and re-generate the index on the destination cluster.

Non UTF-8 encodable document IDs on the source cluster are automatically 
filtered out and logged. The IDs are not transferred to the remote cluster. If there are any non UTF-8 keys, the warning output, `xdcr_error.*`  displays in the log files along with a list of all non-UTF-8 keys found by XDCR.

### XDCR flush requests

   Flush requests to delete the entire contents of bucket are not replicated to the
   remote cluster. Performing a flush operation will only delete data on the local
   cluster. Flush is disabled if there is an active outbound replica stream
   configured.
   
<a id="cb-concepts-xdcr-data-encrypt"></a>
   
## XDCR data encryption

The cross data center (XDCR) data security feature provides secure cross data center replication 
using Secure Socket Layer (SSL) data encryption. 
The data replicated between clusters can be encrypted in both uni-directional and bi-directional topologies.

By default, XDCR traffic to a destination cluster is sent in clear text that is unencrypted. 
In this case, when XDCR traffic occurs across multiple clusters over public networks, 
it is recommended that a VPN gateway be configured between the two data centers to encrypt the data between each route.

With the XDCR data encryption feature, the XDCR traffic from the source cluster is secured by 
enabling the XDCR encryption option, providing the destination cluster's certificate, and then replicating. 
The certificate is a self-signed certificate used by SSL to initiate secure sessions.


Data encryption is established between the source and destination clusters. 
Since data encryption is established at the cluster level, 
all buckets that are selected for replicated on the destination cluster are data encrypted. 
For buckets that need to be replicated without data encryption, establish a second XDCR destination cluster 
without XDCR data encryption enabled.

<img src="../images/xdcr-ssl.png" width="300">

<div class="notebox"><p>Important</p>
<p>Both data encrypted and non-encrypted replication can not occur between the same XDCR source and
destination cluster. For example, if Cluster A (source) has data encryption enabled to Cluster B (destination), 
then Cluster A (source) cannot also have non-encryption (data encryption is *not* enabled) to Cluster B (destination).
</p></div>

For more information about enabling XDCR data encryption, see 
[Managing XDCR data encryption](#cb-admin-tasks-xdcr-encrypt).




