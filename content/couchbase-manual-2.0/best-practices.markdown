# Best Practices

When designing and building your Couchbase Server cluster you need to give some
thought to a number of different aspects of your server and cluster
configuration, including the configuration and hardware of individual nodes, in
addition to the overall cluster sizing and distribution configuration.

For more information on the basic design and configuration of your Couchbase
Server cluster, see [Cluster Design
Considerations](#couchbase-bestpractice-clusterdesign).

If you are hosting in the cloud, see [Using Couchbase in the
Cloud](#couchbase-bestpractice-cloud).

<a id="couchbase-bestpractice-clusterdesign"></a>

## Cluster Design Considerations

 * RAM: Memory is one of the most important factor that determines how smoothly
   your cluster will operate. Couchbase is well suited for applications that want
   most of its active dataset in memory. This data that is actively used at any
   given point in time is called the Working Set. It is very important that you
   allocate enough memory for the entire Working Set to live in memory. When there
   is not enough memory left for the new data that is written, some values are
   ejected from memory and will only exist on disk. Accessing values from disk is
   much slower than accessing data in memory. As a result, if ejected data is
   accessed frequently, performance of the cluster suffers. Use the formula
   provided in the next section to verify your configuration, to optimize
   performance and avoid this situation.

 * Number of Nodes: Once you know how much memory you will need for the cluster the
   next decision you will make is whether to have few large nodes or several small
   nodes:

    * With several smaller nodes you are distributing I/O across several machines,
      however, the probability of a node failing (across the whole cluster) is also
      higher.

    * With fewer larger nodes, in case of a node failure the impact to the application
      will be greater

    * It is a trade off between reliability and efficiency.

 * [Moxi: A client side moxi or a smart client is always preferred over a server
   side moxi but for development environments or for faster, easier deployments you
   can use server side moxis. The downside of a server side moxi is that there can
   be an additional hop if the server that receives the client request does not
   have data requested. Read more about clients
   [here](http://www.couchbase.com/develop). Read more about different Deployment
   Strategieshere](#couchbase-deployment).

 * Number of cores - Couchbase is relatively more memory or I/O bound than is CPU
   bound. However, Couchbase is more efficient on machines that have at least two
   cores.

 * Storage type - You may choose either SSDs (solid state drives) or spinning disks
   to store data. SSDs are faster than rotating media, but currently have a higher
   cost. Couchbase needs less memory if a cluster uses SSDs as the I/O queue buffer
   is smaller in case of SSDs.

 * WAN Deployments - Couchbase is not intended to be used in WAN configurations.
   Couchbase requires that the latency should be very low between server nodes and
   between servers nodes and Couchbase clients.

<a id="couchbase-bestpractice-sizing"></a>

## Sizing Guidelines

The primary considerations when planning your Couchbase Server cluster are:

 * How many nodes do I need?

 * How large (RAM, CPU, disk space) should those nodes be?

To answer the first question, you need to take into account the following
different factors:

 * RAM

 * Disk throughput and sizing

 * Network bandwidth

 * Data distribution and safety

Each of these factors can be the determining factor for sizing, although due to
the in-memory nature of Couchbase Server, RAM is normally the most important
factor. How you choose your primary factor will depend on the data set and
information that you are storing:

 * If you have a very small data set that gets a very high load, you'll need to
   size more off of network bandwidth than RAM.

 * If you have a very high write rate, you'll need more nodes to support the disk
   throughput of persisting all that data (and likely more RAM to buffer the
   incoming writes).

 * Even with a very small dataset, under low load, you may still want 3 nodes for
   proper distribution and safety.

With Couchbase Server, you can increase the capacity of your cluster (RAM, Disk,
CPU or network) by increasing the number of nodes within your cluster, since
each limit will be increased linearly as the cluster size is increased.

<a id="couchbase-bestpractice-sizing-ram"></a>

### RAM Sizing

RAM is usually the most critical sizing parameter. It's also the one that can
have the biggest impact on performance and stability.

<a id="couchbase-bestpractice-sizing-ram-workingset"></a>

### Working Set

Before we can decide how much memory will we need for the cluster, we should
understand the concept of a 'working set'. The 'working set' at any point of
time is the data that your application actively uses. Ideally you would want all
your working set to live in memory.

<a id="couchbase-bestpractice-sizing-ram-memoryquota"></a>

### Memory quota

It is very important that a Couchbase cluster is sized in accordance with the
working set size and total data you expect.

The goal is to size the RAM available to Couchbase so that all your document
IDs, the document ID meta data, along with the working set values fit into
memory in your cluster, just below the point at which Couchbase will start
evicting values to disk (the High Water Mark).

How much memory and disk space per node you will need depends on several
different variables, defined below.

**Calculations are per bucket**

Calculations below are per bucket calculations. The calculations need to be
summed up across all buckets. If all your buckets have the same configuration,
you can treat your total data as a single bucket, there is no per-bucket
overhead that needs to be considered.

<a id="couchbase-bestpractice-sizing-ram-inputvars"></a>

Variable                 | Description                                                 
-------------------------|-------------------------------------------------------------
documents\_num           | The total number of documents you expect in your working set
ID\_size                 | The average size of document IDs                            
value\_size              | The average size of values                                  
number\_of\_replicas     | number of copies of the original data you want to keep      
working\_set\_percentage | The percentage of your data you want in memory.             
per\_node\_ram\_quota    | How much RAM can be assigned to Couchbase                   

The following are the items that are used in calculating memory required and are
assumed to be constants.

<a id="couchbase-bestpractice-sizing-ram-constants"></a>

Constant                                                                                                                                                                                                                    | Description                                                                                                                                                                                                  
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Meta data per document (metadata\_per\_document)                                                                                                                                                                            | This is the space that Couchbase needs to keep metadata per document. As of Couchbase 2.0.1, it is 64 bytes. All the metadata for documents needs to live in memory while a node is running and serving data.
SSD or Spinning                                                                                                                                                                                                             | SSDs give better I/O performance.                                                                                                                                                                            
headroomThe headroom is the additional overhead required by the cluster to store metadata about the information being stored. This requires approximately 25-30% more space than the raw RAM requirements for your dataset. | Typically 25% (0.25) for SSD and 30% (0.30) for spinning (traditional) hard disks as SSD are faster than spinning disks.                                                                                     
High Water Mark (high\_water\_mark)                                                                                                                                                                                         | By default it is set at 70% of memory allocated to the node                                                                                                                                                  

This is a rough guideline to size your cluster:

<a id="couchbase-bestpractice-sizing-ram-calculations"></a>

Variable                                                    | Calculation                                                           
------------------------------------------------------------|-----------------------------------------------------------------------
no\_of\_copies                                              | `1 + number_of_replicas`                                              
total\_metadataAll the documents need to live in the memory | `(documents_num) * (metadata_per_document + ID_size) * (no_of_copies)`
total\_dataset                                              | `(documents_num) * (value_size) * (no_of_copies)`                     
working\_set                                                | `total_dataset * (working_set_percentage)`                            
Cluster RAM quota required                                  | `(total_metadata + working_set) * (1 + headroom) / (high_water_mark)` 
number of nodes                                             | `Cluster RAM quota required / per_node_ram_quota`                     

You will need at least the number of replicas + 1 nodes irrespective of your
data size.

Example sizing calculation

<a id="couchbase-bestpractice-sizing-ram-sample-inputvars"></a>

Input Variable           | value    
-------------------------|----------
documents\_num           | 1,000,000
ID\_size                 | 100      
value\_size              | 10,000   
number\_of\_replicas     | 1        
working\_set\_percentage | 20%      

<a id="couchbase-bestpractice-sizing-ram-sample-constants"></a>

Constants               | value
------------------------|------
Type of Storage         | SSD  
overhead\_percentage    | 25%  
metadata\_per\_document | 120  
high\_water\_mark       | 70%  

<a id="couchbase-bestpractice-sizing-ram-sample-vars"></a>

Variable                   | Calculation                                                      
---------------------------|------------------------------------------------------------------
no\_of\_copies             | = 21 for original and 1 for replica                              
total\_metadata            | = 1,000,000 \* (100 + 120) \* (2) = 440,000,000                  
total\_dataset             | = 1,000,000 \* (10,000) \* (2) = 20,000,000,000                  
working\_set               | = 20,000,000,000 \* (0.2) = 4,000,000,000                        
Cluster RAM quota required | = (440,000,000 + 4,000,000,000) \* (1+0.25)/(0.7) = 7,928,000,000

For example, if you have 8GB machines and you want to use 6 GB for Couchbase:


```
number of nodes =
    Cluster RAM quota required/per_node_ram_quota =
    7.9 GB/6GB = 1.3 or 2 nodes
```

**RAM quota**

You will not be able to allocate all your machine RAM to the
per\_node\_ram\_quota as there maybe other programs running on your machine.

<a id="couchbase-bestpractice-sizing-disk"></a>

### Disk Throughput and Sizing

One of the big advantages that Couchbase Server provides is the decoupling of
disk IO and RAM. This basic concept allows us to provide extremely high scales
at very low and consistent latencies. It also makes Couchbase Server capable of
handling very high write loads without affecting the application's performance.

However, Couchbase Server still needs to be able to write data to disk and so
your disks need to be capable of handling a steady stream of incoming data. It
is important to analyze your application's write load and provide enough disk
throughput to match. Information is written to disk through the disk write
queue. The internal statistics system monitors the number of outstanding items
in the disk write queue and can give you the information you need. The peak the
disk write queue load shows how many items stored in Couchbase Server would be
lost in the event of a server failure.

It is up to your own internal requirements to decide how much vulnerability you
are comfortable with and size the cluster accordingly so that the disk write
queue level remains low across the entire cluster. Adding more nodes will
provide more disk throughput.

Disk space is also required to persist data. How much disk space you should plan
for is dependent on how your data grows. You will also want to store backup data
on the system. A good guideline is to plan for at least 130% of the total data
you expect. 100% of this is for data backup and 30% for overhead during file
maintenance.

<a id="couchbase-bestpractice-sizing-network"></a>

### Network Bandwidth

Network bandwidth is not normally a significant factor in your calculations and
preparations for cluster sizing, but network bandwidth is vital for accessing
information from your cluster by clients, and for exchanging information between
nodes.

In general you can calculate your network bandwidth requirements using the
formula:


```
Bandwidth = (operations per second * item size) +
    overhead for rebalancing
```

Where the `operations per second` can be calculated using:


```
Operations per second = Application reads +
    (Application writes * Replica copies)
```

<a id="couchbase-bestpractice-sizing-datasafety"></a>

### Data Safety

To ensure data safety you need to ensure there are enough nodes within the
cluster to support the safety requirements for your data. This involves
retaining a suitable number of nodes, and node configration, within your
cluster. There are two aspects to consider, the distribution of information
across your nodes, and the number of replicas of information stored across your
cluster.

<a id="couchbase-bestpractice-sizing-datadistribution"></a>

### Data distribution

The basic idea is that more nodes are better than less. If you only have 2
nodes, your data will be split across the two nodes half, and half. This means
that half of your dataset will be "impacted" if one goes away. On the other
hand, with 10 nodes, only 10% of the dataset will be "impacted" if one goes
away. Even with Automatic Failover, there will still be some period of time when
data is unavailable if nodes fail. This can be mitigated by having more nodes.

You also need to take into account the amount of extra load that the cluster
will need to take on after a failover. Again, with only 2 nodes, each one needs
to be ready to handle the entire load. With 10, each node only needs to be able
to take on an extra 10th of the workload should one fail.

While 2 nodes does provide a minimal level of redundancy, it is recommend always
using at least 3 nodes.

<a id="couchbase-bestpractice-sizing-replication"></a>

### Replication

Couchbase Server allows you to configure up to 3 replicas (creating 4 copies of
the dataset). In the event of a failure, you can only "failover" (either
manually or automatically) as many nodes as you have replicas. For example:

 * In a 5 node cluster with one replica, if one node goes down, you can fail it
   over. If a second node goes down, you no longer have enough replica copies to
   fail over to and will have to go through a slower process to recover.

 * In a 5 node cluster with 2 replicas, if one node goes down, you can fail it
   over. If a second node goes down, you can fail it over as well. Should a 3rd one
   go down, you now no longer have replicas to fail over.

After a node goes down and is failed over, you should attempt to replace that
node as soon as possible and rebalance. The rebalance is what will recreate the
replica copies (if you still have enough nodes to do so).

As a rule of thumb, it is recommended that you configure:

 * 1 replica for up to 5 nodes

 * 1 or 2 replicas for 5 to 10 nodes

 * 1, 2 or 3 replicas for over 10 nodes

While there many be variations to this, there are definitely diminishing returns
from having more replicas in smaller clusters.

<a id="couchbase-bestpractice-sizing-hardware"></a>

### Hardware Requirements

In general, Couchbase Server has very low hardware requirements and is designed
to be run on commodity or virtualized systems. However, as a rough guide to the
primary concerns for your servers:

 * RAM: Your primary consideration as RAM is used to kep active items and is the
   key reason Couchbase Server has such low latency.

 * CPU: Couchbase Server has very low CPU requirements. The server is
   multi-threaded and therefore benefits from a multi-core system. Machines with at
   least 4 or 8 physical cores are recommended.

 * Disk: By decoupling the RAM from the IO layer, Couchbase Server can support
   low-performance disks better than other databases. Known working configurations
   include SAN, SAS, SATA, SSD, and EBS, with the following recommendations:

    * SSDs have been shown to provide a great performance boost both in terms of
      draining the write queue and also in restoring data from disk (either on
      cold-boot or for purposes of rebalancing).

    * RAID generally provides better throughput and reliability.

    * Striping across EBS volumes (in Amazon EC2) has been shown to increase
      throughput.

 * Network: Most configurations will work with Gigabit Ethernet interfaces. Faster
   solutions such as 10GBit and Inifiniband will provide spare capacity.

<a id="couchbase-bestpractice-sizing-cloud"></a>

### Considerations for Cloud environments (i.e. Amazon EC2)

Due to the unreliability and general lack of consistent IO performance in cloud
environments, we highly recommend lowering the per-node RAM footprint and
increasing the number of nodes. This will give better disk throughput as well as
improve rebalancing since each node will have to store (and therefore transmit)
less data. By distributing the data further, it will make the impact of losing a
single node (which could be fairly common) even less.

Also, see the best practices for [Using Couchbase in the
Cloud](#couchbase-bestpractice-cloud).

<a id="couchbase-bestpractice-deployment"></a>

## Deployment Considerations

 * **Restricted access to Moxi ports**

   Make sure that all the ports that Moxi uses are accessible only by trusted
   machines (including the other nodes in the cluster).

 * **Restricted access to web console (port 8091)**

   The web console is password protected. However, it is recommended that you
   restrict access to port 8091, as a abuser could do potentially harmful
   operations (like remove a node) from the web console.

 * **Node to Node communication on ports**

   All nodes in the cluster should be able to communicate with each other on 11210
   and 8091.

 * **Swap configuration**

   Swap should be configured on the couchbase server, to avoid the operating system
   killing couchbase server if the system RAM is exhausted. Having swap provides
   more options on how to manage such a situation.

 * **Idle connection timeouts**

   Some firewall or proxy software will drop TCP connections which are idle for a
   certain amount of time (e.g., 20 minutes). If the software does not allow
   changing that timeout, send a command from the client periodically to keep the
   connection alive.

 * **Port Exhaustion on Windows**

   The TCP/IP port allocation on Windows by default includes a restricted number of
   ports available for client communication. For more information on this issue,
   including information on how to adjust the configuration and increase the
   available ports, see [MSDN: Avoiding TCP/IP Port
   Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="couchbase-bestpractice-ongoing"></a>

## Ongoing Monitoring and Maintenance

To fully understand how your cluster is working, and whether it is working
effectively, there are a number of differnet statistics that you should monitor
to diagnose and identify problems. Some of these key statistics include:

[The 'watermark' determines when it is necessary to start freeing up available
memory. Read more about this
concepthere](#couchbase-introduction-architecture-diskstorage). Some important
statistics related to water marks are:

 * High WaterMark ( `ep_mem_high_wat` )

   The system will start ejecting values out of memory when this watermark is met.
   Ejected values need to be fetched from disk when accessed before being returned
   to the client.

 * Low WaterMark ( `ep_mem_low_wat` )

   When a threshold known as low water mark is reached, this process starts
   ejecting inactive replica data from RAM on the node.

 * Memory Used ( `mem_used` )

   The current size of memory used. If mem\_used hits the RAM quota then you will
   get `OOM_ERROR`. The `mem_used` must be less than `ep_mem_high_wat` which is the
   mark at which data is ejected from the disk.

 * Disk Write Queue Size ( `ep_queue_size` )

   The size of the queue that has data waiting to be written to the disk.

 * Cache Hits ( `get_hits` )

   The rule of thumb is that this should be at least 90% of the total requests.

 * Cache Misses ( `get_misses` )

   Ideally this should be low, and certainly lower than `get_hits`. Increasing or
   high values mean that data that your application expects to be stored is not in
   memory.

You can find values for these important stats with the following command:


```
shell> cbstats IP:11210 all | \
    egrep "todo|ep_queue_size|_eject|mem|max_data|hits|misses"
```

This will output tyhe following statistics:


```
ep_flusher_todo:
ep_max_data_size:
ep_mem_high_wat:
ep_mem_low_wat:
ep_num_eject_failures:
ep_num_value_ejects:
ep_queue_size:
mem_used:
get_misses:
get_hits:
```

Make sure that you monitor the disk space, CPU usage and swapping on all your
nodes, using the standard monitoring tools.

<a id="couchbase-bestpractice-ongoing-ui"></a>

### Important UI Stats to Watch

You can add the following graphs to watch on the Couchbase console. These graphs
can be de/selected by clicking on the `Configure View` link at the top of the
`Bucket Details` on the Couchbase Web Console.

 * `Disk write queues`

   The value should not keep growing; the actual numbers will depend on your
   application and deployment.

 * `Ram ejections`

   There should be no sudden spikes.

 * `Vbucket errors`

   An increasing value for vBucket errors is bad.

 * `OOM errors per sec`

   This should be 0.

 * `Temp OOM errors per sec`

   This should be 0.

 * `Connections count`

   This should remain flat in a long running deployment.

 * `Get hits per second`

 * `Get misses per second`

   This should be much lower than Get hits per second.

<a id="couchbase-bestpractice-secondfirewall"></a>

## Couchbase Behind a Secondary Firewall

If you are deploying Couchbase behind a secondary firewall, you should open the
ports that Couchbase Server uses for communication. In particular, the following
ports should be kept open: 11211, 11210, 4369, 8091, 8092 and the port range
from 21100 to 21199.

 * If you're using smart clients or client-side Moxi from outside the 2nd level
   firewall, also open up port 11210 (in addition to the above port 8091), so that
   the smart client libraries or client-side Moxi can directly connect to the data
   nodes.

 * If you want to use the web admin console from outside the 2nd level firewall,
   also open up port 8091 (for REST/HTTP traffic).

 * Access to views is provided on port 8092; if this port is not open, you will be
   unable to run access views, run queries, or update design documents, including
   through the Web Admin Console.

 * The server-side Moxi port is 11211. Pre-existing Couchbase and Memcached
   (non-smart) client libraries that are outside the 2nd level firewall would just
   need port 11211 open to work.

Nodes within the Couchbase Server cluster need all the above ports open to work:
11211, 11210, 4369, 8091, 8092, and the port range from 21100 to 21199

<a id="couchbase-bestpractice-cloud"></a>

## Using Couchbase in the Cloud

For the purposes of this discussion, we will refer to "the cloud" as Amazon's
EC2 environment since that is by far the most common cloud-based environment.
However the same considerations apply to any environment that acts like EC2 (an
organization's private cloud for example). In terms of the software itself, we
have done extensive testing within EC2 (and some of our largest customers have
already deployed Couchbase there for production use). Because of this, we have
encountered and resolved a variety of bugs only exposed by the sometimes
unpredictable characteristics of this environment.

Being simply a software package, Couchbase Server is extremely easy to deploy in
the cloud. From the software's perspective, there is really no difference being
installed on bare-metal or virtualized operating systems. On the other hand, the
management and deployment characteristics of the cloud warrant a separate
discussion on the best ways to use Couchbase.

We have written a number of [RightScale](http://www.rightscale.com/) templates
to aid in your deployment within Amazon. You can very easily sign up for a free
RightScale account to try it out. The templates handle almost all of the special
configuration needed to make your experience within EC2 successful. Direct
integration with RightScale also allows us to do some pretty cool things around
auto-scaling and pre-packaged deployment. Check out the templates here
[Couchbase on RightScale](http://support.rightscale.com/27-Partners/Membase)

We've also authored an AMI for use within EC2 independent of RightScale. When
using these, you will have to handle the specific complexities yourself. You can
find this AMI by searching for 'couchbase' in Amazon's EC2 portal.

Some considerations to take into account when deploying within the cloud are:

 * Local storage being ephemeral

 * IP addresses of a server changing from runtime to runtime

 * Security groups/firewall settings

 * Swap Space

<a id="couchbase-bestpractice-cloud-localstorage"></a>

### Local Storage

Dealing with the first point is not very much different than a data center
deployment. However, EC2 provides an interesting solution. Through the use of
EBS storage, you can obviate the largest concern of losing your data when an
instance fails. Writing Couchbase data and configuration to EBS creates a
reliable medium of storage. There is direct support for using EBS within
RightScale and of course you can set it up manually yourself.

Using EBS is definitely not required, but you should make sure to follow the
best practices around performing backups.

Keep in mind that you will have to update the per-node disk path when
configuring Couchbase to point to wherever you have mounted an external volume.

<a id="couchbase-bestpractice-cloud-ip"></a>

### Handling Changes in IP Addresses

When you use Couchbase Server in the cloud, server nodes can use internal or
public IP addresses. Because IP addresses in the cloud may change quite
frequently, you should configure Couchbase to use a hostname instead of an IP
address.

By default Couchbase Servers use specific IP addresses as a unique identifier.
If the IP changes, an individual node will not be able to identify its own
address and other servers in the same cluster will not be able to access it. To
configure Couchbase Server instances in the cloud to use hostnames, you should
follow steps later in this section. Note that RightScale server templates
provided by Couchbase can automatically configure a node with a provided
hostname.

Make sure that your hostname always resolves to the IP address of the node. This
can be accomplished by using a dynamic DNS service such as DNSMadeEasy which
will allow you to automatically update the hostname when an underlying IP
address changes.

The steps that follow will completely destroy any data and configuration from
the node, so you should start with a fresh Couchbase install. If you already
have a running cluster, you can rebalance a node out of the cluster, make the
change and then rebalance it back into the cluster. For more information, see
[Upgrading to Couchbase Server 2.0.x](#couchbase-getting-started-upgrade).

Nodes with both IPs and hostnames can exist in the same cluster. When you set
the IP address using this method, you should not specify the address `localhost`
or `127.0.0.1` as this will be invalid when used as the identifier for multiple
nodes within the cluster. Instead, use the correct IP address for your host.

**Linux and Windows 2.0.1 and earlier**

For Couchbase Server 2.0.1 and earlier you must follow a manual process where
you edit config files for each node which we describe below for Couchbase in the
cloud. For instructions, see [Hostnames for Couchbase Server 2.0.1 and
Earlier](#couchbase-getting-started-hostnames-pre2.0).

<a id="couchbase-bestpractice-cloud-netsecurity"></a>

### Security groups/firewall settings

It's important to make sure you have both allowed AND restricted access to the
appropriate ports in a Couchbase deployment. Nodes must be able to talk to one
another on various ports and it is important to restrict external and/or
internal access to only those individuals you want to have access. Unlike a
typical data center deployment, cloud systems are open to the world by default
and steps must be taken to restrict access.

<a id="couchbase-bestpractice-cloud-swap"></a>

### Swap Space

Certain cloud systems by default don't have a swap partition configured. While a
system should not utilize a swap partition heavily, it is our recommended
practice to have at least some amount of swap configured to avoid the kernel
from killing processes.

<a id="couchbase-deployment"></a>

## Deployment Strategies

Below are a number of deployment strategies that you may want to employ when
using Couchbase Server. Smart clients is the preferred deployment option if your
language and development environment supports a smart client library. If not,
use the client-side Moxi configuration for the best performance and
functionality.

<a id="couchbase-deployment-vbucket-client"></a>

### Using a smart (vBucket aware) Client

When using a smart client, the client library provides an interface to the
cluster, and performs server selection directly via the vBucket mechanism. The
clients communicate with the cluster using a custom Couchbase protocol which
enables the sharing of the vBucket map, and the selection within the client of
the required vBucket when obtaining and storing information.


![](images/couchbase-060711-1157-32_img_281.jpg)

See also [vBuckets](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)
for an in-depth description.

<a id="couchbase-deployment-standaloneproxy"></a>

### Client-Side (standalone) Proxy

If a smart client is not available for your chosen platform, the alternative
option is to deploy a standalone proxy, which provides the same functionality as
the smart client, while presenting a `memcached` compatible interface layer
locally. A standalone proxy deployed on a client may also be able to provide
valuable services, such as connection pooling. The diagram below shows the flow
with a standalone proxy installed on the application server.


![](images/couchbase-060711-1157-32_img_280.jpg)

The memcached client is configured to have just one server in its server list
(localhost), so all operations are forwarded to `localhost:11211` — a port
serviced by the proxy. The proxy hashes the document ID to a vBucket, looks up
the host server in the vBucket table, and then sends the operation to the
appropriate couchbase server on port 11210.

For the corresponding Moxi product, please use the Moxi 1.8 series. See [Moxi
1.8 Manual](http://www.couchbase.com/docs/moxi-manual-1.8/index.html).

<a id="couchbase-deployment-embedproxy"></a>

### Using Server-Side (Couchbase Embedded) Proxy

Using a Server-side proxy configuration is not recommended for production use.
You should use either a smart client or the client-side proxy configuration
unless your platform and environment do not support that deployment type.

The server-side (embedded) proxy exists within Couchbase Server using port
11211. It supports the memcached protocol and allows an existing application to
communicate with Couchbase Cluster without also installing another piece of
proxy software. The downside to this approach is performance.

In this deployment option versus a typical memcached deployment, in a worse-case
scenario, server mapping will happen twice (e.g. using ketama hashing to a
server list on the client, then using vBucket hashing and server mapping on the
proxy) with an additional round trip network hop introduced.


![](images/couchbase-060711-1157-32_img_279.jpg)

For the corresponding Moxi product, please use the Moxi 1.8 series. See [Moxi
1.8 Manual](http://www.couchbase.com/docs/moxi-manual-1.8/index.html).

<a id="couchbase-admin-tasks"></a>
