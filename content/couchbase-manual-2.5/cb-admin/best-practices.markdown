<a id="couchbase-bestpractice"></a>

# Best practices

When building your Couchbase Server cluster, you need to keep multiple aspects
in mind: the configuration and hardware of individual servers, the overall
cluster sizing and distribution configuration, and more.

For more information on cluster designing basics, see: [Cluster Design
Considerations](#couchbase-bestpractice-clusterdesign).

If you are hosting in the cloud, see [Using Couchbase in the
Cloud](#couchbase-bestpractice-cloud).

<a id="couchbase-bestpractice-clusterdesign"></a>

## Cluster design considerations

 * RAM: Memory is a key factor for smooth cluster performance. Couchbase best fits
   applications that want most of their active dataset in memory. It is very
   important that all the data you actively use (the working set) lives in memory.
   When there is not enough memory left, some data is ejected from memory and will
   only exist on disk. Accessing data from disk is much slower than accessing data
   in memory. As a result, if ejected data is accessed frequently, cluster
   performance suffers. Use the formula provided in the next section to verify your
   configuration, optimize performance, and avoid this situation.

 * Number of Nodes: Once you know how much memory you need, you must decide whether
   to have a few large nodes or many small nodes.

    * Many small nodes: You are distributing I/O across several machines. However, you
      also have a higher chance of node failure (across the whole cluster).

    * Few large nodes: Should a node fail, it greatly impacts the application.

    * It is a trade off between reliability and efficiency.

 * Couchbase prefers a client-side moxi (or a smart client) over a
   server-side moxi. However, for development environments or for faster, easier
   deployments, you can use server-side moxis. A server-side moxi is not recommended
   because of the following drawback: if a server receives a client request and doesn't have
   the requested data, there's an additional hop. See 
   [client development](http://www.couchbase.com/develop) and [Deployment
   Strategies](#couchbase-deployment) for more information.

 * Number of cores: Couchbase is relatively more memory or I/O bound than is CPU
   bound. However, Couchbase is more efficient on machines that have at least two
   cores.

 * Storage type: You may choose either SSDs (solid state drives) or spinning disks
   to store data. SSDs are faster than rotating media but, currently, are more
   expensive. Couchbase needs less memory if a cluster uses SSDs as their I/O queue
   buffer is smaller.

 * WAN Deployments: Couchbase is not intended to be used in WAN configurations.
   Couchbase requires that the latency should be very low between server nodes and
   between servers nodes and Couchbase clients.

<a id="couchbase-bestpractice-sizing"></a>

## Sizing guidelines

Here are the primary considerations when sizing your Couchbase Server cluster:

 * How many nodes do I need?

 * How large (RAM, CPU, disk space) should those nodes be?

To answer the first question, consider following factors:

 * RAM

 * Disk throughput and sizing

 * Network bandwidth

 * Data distribution and safety

Due to the in-memory nature of Couchbase Server, RAM is usually the determining
factor for sizing. But ultimately, how you choose your primary factor will
depend on the data set and information that you are storing.

 * If you have a very small data set that gets a very high load, you'll need to
   base your size more off of network bandwidth than RAM.

 * If you have a very high write rate, you'll need more nodes to support the disk
   throughput needed to persist all that data (and likely more RAM to buffer the
   incoming writes).

 * Even with a very small dataset under low load, you may want three nodes for
   proper distribution and safety.

With Couchbase Server, you can increase the capacity of your cluster (RAM, Disk,
CPU, or network) by increasing the number of nodes within your cluster, since
each limit will be increased linearly as the cluster size is increased.

<a id="couchbase-bestpractice-sizing-ram"></a>

### RAM sizing

RAM is usually the most critical sizing parameter. It's also the one that can
have the biggest impact on performance and stability.

<a id="couchbase-bestpractice-sizing-ram-workingset"></a>

### Working set

The working set is the data that
the client application actively uses at any point in time. Ideally, all of the 
working set lives in memory. This impacts how much memory is needed.

<a id="couchbase-bestpractice-sizing-ram-memoryquota"></a>

### Memory quota

It is very important that your Couchbase cluster's size corresponds to the
working set size and total data you expect.

The goal is to size the available RAM to Couchbase so that all your document
IDs, the document ID meta data, and the working set values fit. The memory
should rest just below the point at which Couchbase will start evicting values
to disk (the High Water Mark).

How much memory and disk space per node you will need depends on several
different variables, which are defined below:


<div class="notebox">
<p>Calculations Are Per Bucket</p>
<p>The calculations below are per-bucket calculations. The calculations need to be
summed up across all buckets. If all your buckets have the same configuration,
you can treat your total data as a single bucket. There is no per-bucket
overhead that needs to be considered.</p>
</div>

<a id="couchbase-bestpractice-sizing-ram-inputvars"></a>

Variable                 | Description                                                 
-------------------------|-------------------------------------------------------------
documents\_num           | The total number of documents you expect in your working set
ID\_size                 | The average size of document IDs                            
value\_size              | The average size of values                                  
number\_of\_replicas     | The number of copies of the original data you want to keep  
working\_set\_percentage | The percentage of your data you want in memory              
per\_node\_ram\_quota    | How much RAM can be assigned to Couchbase                   

Use the following items to calculate how much memory you need:

<a id="couchbase-bestpractice-sizing-ram-constants"></a>

Constant                                                                                                                                                                                         | Description                                                                                                                                                                                                                                                      
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Metadata per document (metadata\_per\_document)                                                                                                                                                  | This is the amount of memory that Couchbase needs to store metadata per document. Metadata uses 56 bytes. All the metadata needs to live in memory while a node is running and serving data.
SSD or Spinning                                                                                                                                                                                  | SSDs give better I/O performance.                                                                                                                                                                                                                                
headroom<sup>1</sup>| Since SSDs are faster than spinning (traditional) hard disks, you should set aside 25% of memory for SSDs and 30% of memory for spinning hard disks.                                                                                                             
High Water Mark (high\_water\_mark)                                                                                                                                                              | By default, the high water mark for a node's RAM is set at 85%.                                                                                                                                                                                                  

<sup><sup>[1]</sup> The cluster needs additional overhead to store metadata. That space is called the headroom. This requires approximately 25-30% more space than the raw RAM requirements for your dataset.</sup> 


This is a rough guideline to size your cluster:

<a id="couchbase-bestpractice-sizing-ram-calculations"></a>

Variable                                                     | Calculation                                                           
-------------------------------------------------------------|-----------------------------------------------------------------------
no\_of\_copies                                               | `1 + number_of_replicas`                                              
total\_metadata<sup>2</sup>  | `(documents_num) * (metadata_per_document + ID_size) * (no_of_copies)`
total\_dataset                                               | `(documents_num) * (value_size) * (no_of_copies)`                     
working\_set                                                 | `total_dataset * (working_set_percentage)`                            
Cluster RAM quota required                                   | `(total_metadata + working_set) * (1 + headroom) / (high_water_mark)` 
number of nodes                                              | `Cluster RAM quota required / per_node_ram_quota`                     

<sup><sup>[2]</sup> All the documents need to live in the memory.</sup>

<div class="notebox">
<p>Note</p>
<p>You will need at least the number of replicas + 1 nodes regardless of your data
size.</p>
</div>

Here is a sample sizing calculation:

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
------------------------|-------------------------
Type of Storage         | SSD                     
overhead\_percentage    | 25%                     
metadata\_per\_document | 56 for 2.1 and higher, 64 for 2.0.x
high\_water\_mark       | 85%                     

<a id="couchbase-bestpractice-sizing-ram-sample-vars"></a>

Variable                   | Calculation                                                      
---------------------------|------------------------------------------------------------------
no\_of\_copies             | = 1 for original and 1 for replica                              
total\_metadata            | = 1,000,000 \* (100 + 56) \* (2) = 312,000,000                  
total\_dataset             | = 1,000,000 \* (10,000) \* (2) = 20,000,000,000                  
working\_set               | = 20,000,000,000 \* (0.2) = 4,000,000,000                        
Cluster RAM quota required | = (440,000,000 + 4,000,000,000) \* (1+0.25)/(0.7) = 7,928,000,000

For example, if you have 8GB machines and you want to use 6 GB for Couchbase...


```
number of nodes =
    Cluster RAM quota required/per_node_ram_quota =
    7.9 GB/6GB = 1.3 or 2 nodes
```

**RAM quota**

You will not be able to allocate all your machine RAM to the
per\_node\_ram\_quota as there may be other programs running on your machine.

<a id="couchbase-bestpractice-sizing-disk"></a>

### Disk throughput and sizing

Couchbase Server decouples RAM from the I/O layer. 
Decoupling allows high scaling at very low and consistent latencies and enables 
very high write loads without affecting  client application performance. 

Couchbase Server implements an append-only format and a built-in 
automatic compaction process. Previously, in Couchbase Server 1.8.x, 
an "in-place-update" disk format was implemented, however, 
this implementation occasionally produced a performance penalty due to fragmentation of the 
on-disk files under workloads with frequent updates/deletes. 

The requirements of your disk subsystem are broken down into two components: 
size and IO. 

**Size** 

Disk size requirements are impacted by the Couchbase file write format, append-only, and the built-in automatic compaction process. Append-only format means that every write (insert/update/delete) creates a new entry in the file(s).

The required disk size increases from the update and delete workload and then shrinks as the automatic compaction process runs. The size increases because of the data expansion rather than the actual data using more disk space. Heavier update and delete workloads increases the size more dramatically than heavy insert and read workloads.

Size recommendations are available for key-value data only. If views and indexes or XDCR are implemented, contact Couchbase support for analysis and recommendations.

**Key-value data only** — Depending on the workload, the required disk size is  **2-3x** your total dataset size (active and replica data combined). 

<div class="notebox bp"><p>Important</p> 
<p>The disk size requirement of 2-3x your total dataset size applies to key-value data only and does not take into account other data formats and the use of views and indexes or XDCR. 
</p></div> 



**IO** 

IO is a combination of the sustained write rate, the need for compacting the database files, and anything else that requires disk access. Couchbase Server automatically buffers writes to the database in RAM and eventually persists them to disk. Because of this, the software can accommodate much higher write rates than a disk is able to handle. However, sustaining these writes eventually requires enough IO to get it all down to disk. 

To manage IO, configure the thresholds and schedule when the compaction process kicks in or doesn't kick in keeping in mind that the successful completion of compaction is critical to keeping the disk size in check. Disk size and disk IO become critical to size correctly when using views and indexes and cross-data center replication (XDCR) as well as taking backup and anything else outside of Couchbase that need space or is accessing the disk. 



<div class="notebox"><p>Best practice</p> 
<p> 
Use the available configuration options to separate data files, indexes and the installation/config directories on separate drives/devices to ensure that IO and space are allocated effectively. 
</p></div> 



<a id="couchbase-bestpractice-sizing-network"></a>

### Network bandwidth

Network bandwidth is not normally a significant factor to consider for cluster
sizing. However, clients require network bandwidth to access information in the
cluster. Nodes also need network bandwidth to exchange information (node to
node).

In general you can calculate your network bandwidth requirements using this
formula:


```
Bandwidth = (operations per second * item size) +
    overhead for rebalancing
```

And you can calculate the `operations per second` with this formula:


```
Operations per second = Application reads +
    (Application writes * Replica copies)
```

<a id="couchbase-bestpractice-sizing-datasafety"></a>

### Data safety

Make sure you have enough nodes (and the right configuration) in your cluster to
keep your data safe. There are two areas to keep in mind: how you distribute
data across nodes and how many replicas you store across your cluster.

<a id="couchbase-bestpractice-sizing-datadistribution"></a>

### Data distribution

Basically, more nodes are better than less. If you only have two nodes, your
data will be split across the two nodes, half and half. This means that half of
your dataset will be "impacted" if one goes away. On the other hand, with ten
nodes, only 10% of the dataset will be "impacted" if one goes away. Even with
automatic failover, there will still be some period of time when data is
unavailable if nodes fail. This can be mitigated by having more nodes.

After a failover, the cluster will need to take on an extra load. The question
is - how heavy is that extra load and are you prepared for it? Again, with only
two nodes, each one needs to be ready to handle the entire load. With ten, each
node only needs to be able to take on an extra tenth of the workload should one
fail.

While two nodes does provide a minimal level of redundancy, we recommend that
you always use at least three nodes.

<a id="couchbase-bestpractice-sizing-replication"></a>

### Replication

Couchbase Server allows you to configure up to three replicas (creating four
copies of the dataset). In the event of a failure, you can only "failover"
(either manually or automatically) as many nodes as you have replicas. Here are
examples:

 * In a five node cluster with one replica, if one node goes down, you can fail it
   over. If a second node goes down, you no longer have enough replica copies to
   fail over to and will have to go through a slower process to recover.

 * In a five node cluster with two replicas, if one node goes down, you can fail it
   over. If a second node goes down, you can fail it over as well. Should a third
   one go down, you now no longer have replicas to fail over.


<div class="notebox">
<p>Note</p>
<p>After a node goes down and is failed over, try to replace that node as soon as
possible and rebalance. The rebalance will recreate the replica copies (if you
still have enough nodes to do so).</p>
</div>

As a rule of thumb, we recommend that you configure the following:

 * One replica for up to five nodes

 * One or two replicas for five to ten nodes

 * One, two, or three replicas for over ten nodes

While there may be variations to this, there are diminishing returns from having
more replicas in smaller clusters.

<a id="couchbase-bestpractice-sizing-hardware"></a>

### Hardware requirements

In general, Couchbase Server has very low hardware requirements and is designed
to be run on commodity or virtualized systems. However, as a rough guide to the
primary concerns for your servers, here is what we recommend:

 * RAM: This is your primary consideration. We use RAM to store active items, and
   that is the key reason Couchbase Server has such low latency.

 * CPU: Couchbase Server has very low CPU requirements. The server is
   multi-threaded and therefore benefits from a multi-core system. We recommend
   machines with at least four or eight physical cores.

 * Disk: By decoupling the RAM from the I/O layer, Couchbase Server can support
   low-performance disks better than other databases. As a best practice we
   recommend that you have a separate devices for server install, data directories,
   and index directories.

   Known working configurations include SAN, SAS, SATA, SSD, and EBS, with the
   following recommendations:

    * SSDs have been shown to provide a great performance boost both in terms of
      draining the write queue and also in restoring data from disk (either on
      cold-boot or for purposes of rebalancing).

    * RAID generally provides better throughput and reliability.

    * Striping across EBS volumes (in Amazon EC2) has been shown to increase
      throughput.

 * Network: Most configurations will work with Gigabit Ethernet interfaces. Faster
   solutions such as 10GBit and Infiniband will provide spare capacity.

<a id="couchbase-bestpractice-sizing-cloud"></a>

### Considerations for Cloud environments (i.e. Amazon EC2)

Due to the unreliability and general lack of consistent I/O performance in cloud
environments, we highly recommend lowering the per-node RAM footprint and
increasing the number of nodes. This will give better disk throughput as well as
improve rebalancing since each node will have to store (and therefore transmit)
less data. By distributing the data further, it lessens the impact of losing a
single node (which could be fairly common).

Read about best practices with the cloud in [Using Couchbase in the
Cloud](#couchbase-bestpractice-cloud).

<a id="couchbase-bestpractice-deployment"></a>

## Deployment considerations

 * **Restricted access to Moxi ports**

   Make sure that only trusted machines (including the other nodes in the cluster)
   can access the ports that Moxi uses.

 * **Restricted access to web console (port 8091)**

   The web console is password protected. However, we recommend that you restrict
   access to port 8091; an abuser could do potentially harmful operations (like
   remove a node) from the web console.

 * **Node to Node communication on ports**

   All nodes in the cluster should be able to communicate with each other on 11210
   and 8091.

 * **Swap configuration**

   Swap should be configured on the Couchbase Server. This prevents the operating
   system from killing Couchbase Server should the system RAM be exhausted. Having
   swap provides more options on how to manage such a situation.

 * **Idle connection timeouts**

   Some firewall or proxy software will drop TCP connections if they are idle for a
   certain amount of time (e.g. 20 minutes). If the software does not allow you to
   change that timeout, send a command from the client periodically to keep the
   connection alive.

 * **Port Exhaustion on Windows**

   The TCP/IP port allocation on Windows by default includes a restricted number of
   ports available for client communication. For more information on this issue,
   including information on how to adjust the configuration and increase the
   available ports, see [MSDN: Avoiding TCP/IP Port
   Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="couchbase-bestpractice-ongoing"></a>

## Ongoing monitoring and maintenance

To fully understand how your cluster is working, and whether it is working
effectively, there are a number of different statistics that you should monitor
to diagnose and identify problems. Some of these key statistics include the
following:

 * Memory Used ( `mem_used` )

   This is the current size of memory used. If `mem_used` hits the RAM quota then
   you will get `OOM_ERROR`. The `mem_used` must be less than `ep_mem_high_wat`,
   which is the mark at which data is ejected from the disk.

 * Disk Write Queue Size ( `ep_queue_size` )

   This is the amount of data waiting to be written to disk.

 * Cache Hits ( `get_hits` )

   As a rule of thumb, this should be at least 90% of the total requests.

 * Cache Misses ( `get_misses` )

   Ideally this should be low, and certainly lower than `get_hits`. Increasing or
   high values mean that data that your application expects to be stored is not in
   memory.

The water mark is another key statistic to monitor cluster performance. The
'water mark' determines when it is necessary to start freeing up available
memory. See [disk storage](#couchbase-introduction-architecture-diskstorage) 
for more information. Two important statistics related to water marks include:

 * High Water Mark ( `ep_mem_high_wat` )

   The system will start ejecting values out of memory when this water mark is met.
   Ejected values need to be fetched from disk when accessed before being returned
   to the client.

 * Low Water Mark ( `ep_mem_low_wat` )

   When the low water mark threshold is reached, it indicates that memory usage is moving toward a critical point and system administration action is should be taken before the high water mark is reached

You can find values for these important stats with the following command:


```
shell> cbstats IP:11210 all | \
    egrep "todo|ep_queue_size|_eject|mem|max_data|hits|misses"
```

This will output the following statistics:


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
<div class="notebox">
<p>Note</p>
<p>Make sure you monitor the disk space, CPU usage, and swapping on all your nodes,
using the standard monitoring tools.</p>
</div>

<a id="couchbase-bestpractice-ongoing-ui"></a>

### Important UI stats to watch

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

## Couchbase behind a secondary firewall

If Couchbase is being deployed behind a secondary firewall, ensure that the reserved 
Couchbase network ports are open. For more information about the ports that Couchbase Server uses, see [Network ports](../cb-install/#network-ports).



<a id="couchbase-bestpractice-cloud"></a>

## Using Couchbase in the Cloud

For the purposes of this discussion, we will refer to "the cloud" as Amazon's
EC2 environment since that is by far the most common cloud-based environment.
However, the same considerations apply to any environment that acts like EC2 (an
organization's private cloud for example). In terms of the software itself, we
have done extensive testing within EC2 (and some of our largest customers have
already deployed Couchbase there for production use). Because of this, we have
encountered and resolved a variety of bugs only exposed by the sometimes
unpredictable characteristics of this environment.

Being simply a software package, Couchbase Server is extremely easy to deploy in
the cloud. From the software's perspective, there is really no difference
between being installed on bare-metal or virtualized operating systems. On the
other hand, the management and deployment characteristics of the cloud warrant a
separate discussion on the best ways to use Couchbase.

We have written a number of [RightScale](http://www.rightscale.com/) templates
to help you deploy within Amazon. Sign up for a free RightScale account to try
it out. The templates handle almost all of the special configuration needed to
make your experience within EC2 successful. Direct integration with RightScale
also allows us to do some pretty cool things with auto-scaling and pre-packaged
deployment. Check out the templates here [Couchbase on
RightScale](http://support.rightscale.com/27-Partners/Couchbase)

We've also authored an AMI for use within EC2 independent of RightScale. When
using these, you will have to handle the specific complexities yourself. You can
find this AMI by searching for 'couchbase' in Amazon's EC2 portal.

When deploying within the cloud, consider the following areas:

 * Local storage being ephemeral

 * IP addresses of a server changing from runtime to runtime

 * Security groups/firewall settings

 * Swap Space

**How to Handle Instance Reboot in Cloud**

Many cloud providers warn users that they need to reboot certain instances for
maintenance. Couchbase Server ensures these reboots won't disrupt your
application. Take the following steps to make that happen:

 1. Install Couchbase on the new node.

 1. From the user interface, add the new node to the cluster.

 1. From the user interface, remove the node that you wish to reboot.

 1. Rebalance the cluster.

 1. Shut down the instance.

<a id="couchbase-bestpractice-cloud-localstorage"></a>

### Local storage

Dealing with local storage is not very much different than a data center
deployment. However, EC2 provides an interesting solution. Through the use of
EBS storage, you can prevent data loss when an instance fails. Writing Couchbase
data and configuration to EBS creates a reliable medium of storage. There is
direct support for using EBS within RightScale and, of course, you can set it up
manually.

Using EBS is definitely not required, but you should make sure to follow the
best practices around performing backups.

Keep in mind that you will have to update the per-node disk path when
configuring Couchbase to point to wherever you have mounted an external volume.

<a id="couchbase-bestpractice-cloud-ip"></a>

### Handling changes in IP addresses

When you use Couchbase Server in the cloud, server nodes can use internal or
public IP addresses. Because IP addresses in the cloud may change quite
frequently, you can configure Couchbase to use a hostname instead of an IP
address.

For Amazon EC2 we recommend you use Amazon-generated hostnames 
which then will automatically resolve to either the internal or external address.

By default Couchbase Servers use specific IP addresses as a unique identifier.
If the IP changes, an individual node will not be able to identify its own
address, and other servers in the same cluster will not be able to access it. To
configure Couchbase Server instances in the cloud to use hostnames, follow the
steps later in this section. Note that RightScale server templates provided by
Couchbase can automatically configure a node with a provided hostname.

Make sure that your hostname always resolves to the IP address of the node. This
can be accomplished by using a dynamic DNS service such as DNSMadeEasy which
will allow you to automatically update the hostname when an underlying IP
address changes.


[Upgrading to Couchbase Server](../cb-install/#couchbase-getting-started-upgrade).

<div class="notebox warning">
<p>Warning</p>
<p>The following steps will completely destroy any data and configuration from the
node, so you should start with a fresh Couchbase install. If you already have a
running cluster, you can rebalance a node out of the cluster, make the change,
and then rebalance it back into the cluster. For more information, see <a href="../cb-install/#couchbase-getting-started-upgrade">Upgrading to Couchbase Server</a>.</p>

<p>Nodes with both IPs and hostnames can exist in the same cluster. When you set
the IP address using this method, you should not specify the address as
<code>localhost</code> or <code>127.0.0.1</code> as this will be invalid when used as the identifier for multiple nodes within the cluster. Instead, use the correct IP address for
your host.</p>
</div>

**Linux and Windows 2.1 and above**

As a rule, you should set the hostname before you add a node to a cluster. You 
can also provide a hostname in these ways: when you install a Couchbase Server 
node or when you do a REST API call before the node is part of a cluster. 
You can also add a hostname to an existing cluster for an online upgrade. If you
restart, any hostname you establish with one of these methods will be used. For
instructions, see [Using Hostnames with Couchbase
Server](../cb-install/#couchbase-getting-started-hostnames).

**Linux and Windows 2.0.1 and earlier**

For Couchbase Server 2.0.1 and earlier you must follow a manual process where
you edit config files for each node which we describe below for Couchbase in the
cloud. For instructions, see [Hostnames for Couchbase Server 2.0.1 and
Earlier](../cb-install/#couchbase-getting-started-hostnames-pre2.0).

<a id="couchbase-bestpractice-cloud-netsecurity"></a>

### Security groups/firewall settings

It's important to make sure you have both allowed AND restricted access to the
appropriate ports in a Couchbase deployment. Nodes must be able to talk to one
another on various ports, and it is important to restrict external and/or
internal access to only authorized individuals. Unlike a typical data center
deployment, cloud systems are open to the world by default, and steps must be
taken to restrict access.

<a id="couchbase-bestpractice-cloud-swap"></a>

### Swap space

On Linux, swap space is used when the physical memory (RAM) is full. If the
system needs more memory resources and the RAM is full, inactive pages in memory
are moved to the swap space. Swappiness indicates how
frequently a system should use swap space based on RAM usage. The swappiness range is from 0 to 100 where, by default, most Linux platforms have swappiness set to 60.

<div class="notebox bp"><p>Recommendation</p>
<p>For optimal Couchbase Server operations, set the swappiness to <strong>0</strong> (zero).
</p> 
</div> 


To change the swap configuration:

1. Execute ```cat /proc/sys/vm/swappiness``` on each node to determine the current swap usage configuration.
2. Execute ```sudo sysctl vm.swappiness=0``` to immediately change the swap configuration and ensure that it persists through server restarts.
3.  Using sudo or root user privileges, edit the kernel parameters configuration file, ```/etc/sysctl.conf```, so that the change is always in effect.
4. Append ```vm.swappiness = 0``` to the file.
5. Reboot your system.

**Note**: 
Executing ```sudo sysctl vm.swappiness=0``` ensures that the operating system no longer uses swap unless memory is completely exhausted. Updating the kernel parameters configuration file, ```sysctl.conf```, ensures that the operating system always uses swap in accordance with Couchbase recommendations even when the node is rebooted.


### Using Couchbase Server on RightScale

Couchbase partners with [RightScale](http://www.rightscale.com) to provide preconfigured RightScale ServerTemplates that you can use to create an individual or array of servers and start them as a cluster. Couchbase Server RightScale ServerTemplates enable you to quickly set up Couchbase Server on [Amazon Elastic Compute Cloud](http://aws.amazon.com/ec2/) (Amazon EC2) servers in the [Amazon Web Services](http://aws.amazon.com)  (AWS) cloud through RightScale. 

The templates also provide support for [Amazon Elastic Block Store](http://aws.amazon.com/ebs/) (Amazon EBS) standard volumes and Provisioned IOPS volumes. (IOPS is an acronym for input/output operations per second.) For more information about Amazon EBS volumes and their capabilities and limitations, see [Amazon EBS Volume Types](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumes.html#EBSVolumeTypes). 

Couchbase provides RightScale ServerTemplates based on [Chef](http://www.opscode.com/chef/) and, for compatibility with existing systems, non-Chef-based ServerTemplates. 

<div class="notebox bp"><p>Note</p>
<p>As of Couchbase Server 2.2, non-Chef templates are deprecated. Do not choose non-Chef templates for new installations.
</p>
</div>

Before you can set up Couchbase Server on RightScale, you need a RightScale account and an AWS account that is connected to your RightScale account. For information about connecting the accounts, see [Add AWS Credentials to RightScale](http://support.rightscale.com/03-Tutorials/01-RightScale/3._Upgrade_Your_Account/1.7_Add_AWS_Credentials_to_the_Dashboard). 

At a minimum, you need the following [RightScale user role privileges](http://support.rightscale.com/15-References/Tables/User_Role_Privileges) to work with the Couchbase RightScale ServerTemplates: actor, designer, library, observer, and server_login. To add privileges: from the RightScale menu bar, click **Settings > Account Settings > Users** and modify the permission list.

To set up Couchbase Server on RightScale, you need to import and customize a  ServerTemplate. After the template is customized, you can launch server and cluster instances. The following figure illustrates the workflow:

<img src="../images/rightscale-workflow.png" style="width:50%;display:block;margin-left:auto;margin-right:auto">

The following procedures do not describe every parameter that you can modify when working with the RightScale ServerTemplates. If you need more information about a parameter, click the info button located near the parameter name.

**To import the Couchbase Server RightScale ServerTemplate:**

1. From the RightScale menu bar, select **Design > MultiCloud Marketplace > ServerTemplates**.
2. In the **Keywords** box on the left under Search, type **couchbase**, and then click **Go**.
3. In the search results list, click on the latest version of the Couchbase Server ServerTemplate.

    The name of each Couchbase template in the list contains the Couchbase Server version number.
    
4. Click **Import**.
5. Review each page of the end user license agreement, and then click **Finish** to accept the agreement.

**To create a new deployment:**

1. From the RightScale menu bar, select **Manage > Deployments > New**.
2. Enter a Nickname and Description for the new deployment.
3. Click **Save**.

**To add a server or cluster to a deployment:**

1. From the RightScale menu bar, select **Manage > Deployments**.
2. Click the nickname of the deployment that you want to place the server or cluster in.
3. From the deployment page menu bar, add the server or cluster:
    * To add a server, click **Add Server**.
    * To add a cluster, click **Add Array**.
4. In the Add to Deployment window, select a cloud and click **Continue**.
5. On the Server Template page, select a template from the list.
    
    If you have many server templates in your account, you can reduce the number of entries in the list by typing a keyword from the template name into the Server Template Name box under Filter Options.
    
6. Click **Server Details**.
7. On the **Server Details** page, choose settings for Hardware:

	**Server Name** or **Array Name**—Enter a name for the new server or array.
	
	**Instance Type**—The default is extra large. The template supports only large or extra large instances and requires a minimum of 4 cores.
	
	**EBS Optimized**—Select the check box to enable EBS-optimized volumes for Provisioned IOPS.
	
8. Choose settings for Networking:

	* **SSH Key**—Choose an SSH key.

	* **Security Groups**—Choose one or more security groups.

9. If you are adding a cluster, click **Array Details**, and then choose settings for Autoscaling Policy and Array Type Details.

    Under Autoscaling Policy, you can set the minimum and maximum number of active servers in the cluster by modifying the **Min Count** and **Max Count** parameters. If you want a specific number of servers, set both parameters to the same value.
    
10. Click **Finish**.
 
**To customize the template for a server or a cluster:**

1. From the RightScale menu bar, select **Manage > Deployments**.
2. Click the nickname of the deployment that the server or cluster is in.
3. Click the nickname of the server or cluster.
4. On the Server or Server Array page, click the **Inputs** tab, and then click **edit**.
5. Expand the **BLOCK_DEVICE** category and modify inputs as needed.

	The BLOCK_DEVICE category contains input parameters that are specific to storage. Here's a list of some advanced inputs that you might want to modify:

	* **I/O Operations per Second**—Number of input/output operations per second (IOPS) that the volume can support
	* **Volume Type**—Type of storage device

6. Expand the **DB_COUCHBASE** category and modify inputs as needed.

	The DB_COUCHBASE category contains input parameters that are specific to Couchbase Server. In general, the default values are suitable for one server. If you want to create a cluster, you need to modify the input parameter values. Here's a list of the advanced inputs that you can modify:

	* **Bucket Name**—Name of the bucket. The default bucket name is `default`.

	* **Bucket Password**—Password for the bucket.

	* **Bucket RAM Quota**—RAM quota for the bucket in MB.

	* **Bucket Replica Count**—Bucket replica count.

	* **Cluster REST/Web Password**—Password for the administrator account. The default is `password`.
	
	* **Cluster REST/Web Username**—Administrator account user name for access to the cluster via the REST or web interface. The default is `Administrator`.

	* **Cluster Tag**—Tag for nodes in the cluster that are automatically joined.

    * **Couchbase Server Edition**—The edition of Couchbase Server. The default is `enterprise`.
    
	* **Rebalance Count**—The number of servers to launch before doing a rebalance. Set this value to the total number of target servers you plan to have in the cluster. If you set the value to 0, Couchbase Server does a rebalance after each server joins the cluster.
	
7. Click **Save**.
8. If you are ready to launch the server or cluster right now, click **Launch**.

**To launch servers or clusters:**

1. From the RightScale menu bar, select **Manage > Deployments**.
2. Click the nickname of the deployment that the server or cluster is in.
3. Click the nickname of the server or cluster.
4. On the Server or Server Array page, click **Launch**.


**To log in to the Couchbase Web Console:**

 You can log in to the Couchbase Web Console by using your web browser to connect to the public IP address on port 8091. The general format is `http://<server:port>`. For example: if the public IP address is 192.236.176.4, enter `http://192.236.176.4:8091/` in the web browser location bar.

<a id="couchbase-deployment"></a>

## Deployment strategies

Here are a number of deployment strategies that you may want to use. Smart
clients are the preferred deployment option if your language and development
environment supports a smart client library. If not, use the client-side Moxi
configuration for the best performance and functionality.

<a id="couchbase-deployment-vbucket-client"></a>

### Using a smart (vBucket aware) client

When using a smart client, the client library provides an interface to the
cluster and performs server selection directly via the vBucket mechanism. The
clients communicate with the cluster using a custom Couchbase protocol. This
allows the clients to share the vBucket map, locate the node containing the
required vBucket, and read and write information from there.


![](../images/couchbase-060711-1157-32_img_281.jpg)


In releases prior to Couchbase Server 2.5, a developer, via a client library of their choice, randomly selects a host from which to request an initial topology configuration. Any future changes to the cluster map following the initial bootstrap are based on the NOT_MY_VBUCKET response from the server. This connection is made to port 8091 and is based on an HTTP connection. 


Starting with Couchbase Server 2.5, client libraries query a cluster for initial topology configuration for a bucket from one of the nodes in the cluster. This is similar to prior releases. However, this information is transmitted via the memcached protocol on port 11210 (rather than via persistent HTTP connections to port 8091). This significantly improves connection scaling capabilities.

Optimized connection management is backward compatible. Old client libraries can connect to Couchbase Server 2.5, and updated client libraries can connect to Couchbase Server 2.5 and earlier. 

<div class="notebox"><p>Note</p>
<p>This change is only applicable to Couchbase type buckets (not memcached buckets). 
</p></div> 

See also [vBuckets](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)
for an in-depth description.

<a id="couchbase-deployment-standaloneproxy"></a>
### Client-side (standalone) proxy

If a smart client is not available for your chosen platform, you can deploy a
standalone proxy. This provides the same functionality as the smart client while
presenting a `memcached` compatible interface layer locally. A standalone proxy
deployed on a client may also be able to provide valuable services, such as
connection pooling. The diagram below shows the flow with a standalone proxy
installed on the application server.


![](../images/couchbase-060711-1157-32_img_280.jpg)

We configured the memcached client to have just one server in its server list
(localhost), so all operations are forwarded to `localhost:11211` — a port
serviced by the proxy. The proxy hashes the document ID to a vBucket, looks up
the host server in the vBucket table, and then sends the operation to the
appropriate Couchbase Server on port 11210.

<div class="notebox">
<p>Note</p>
<p>For the corresponding Moxi product, please use the Moxi 1.8 series. See <a href=http://www.couchbase.com/docs/moxi-manual-1.8/index.html>Moxi 1.8 Manual</a>.</p>
</div>

<a id="couchbase-deployment-embedproxy"></a>

### Using server-side (Couchbase embedded) proxy

<div class="notebox warning">
<p>Warning</p>
<p>We do not recommend server-side proxy configuration for production use. You
should use either a smart client or the client-side proxy configuration unless
your platform and environment do not support that deployment type.</p>
</div>

The server-side (embedded) proxy exists within Couchbase Server using port
11211. It supports the memcached protocol and allows an existing application to
communicate with Couchbase Cluster without installing another piece of proxy
software. The downside to this approach is performance.

In this deployment option versus a typical memcached deployment, in a worse-case
scenario, server mapping will happen twice (e.g. using Ketama hashing to a
server list on the client, then using vBucket hashing and server mapping on the
proxy) with an additional round trip network hop introduced.


![](../images/couchbase-060711-1157-32_img_279.jpg)

<div class="notebox">
<p>Note</p>
<p>For the corresponding Moxi product, please use the Moxi 1.8 series. See <a href=http://www.couchbase.com/docs/moxi-manual-1.8/index.html>Moxi 1.8 Manual</a>.</p>
</div>
<a id="couchbase-admin-tasks"></a>
