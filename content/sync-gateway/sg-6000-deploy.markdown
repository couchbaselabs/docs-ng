# Deployment Considerations 

This section contains information about Sync Gateway deployments.

## Limitations

Sync Gateway has the following limitations:

* It cannot operate on pre-existing Couchbase buckets with app data in them because Sync Gateway has its own document schema and needs to create and manage documents itself. You can migrate existing data by creating a new bucket for the gateway and then using the Sync REST API to move your documents into it via PUT requests.

* Explicit garbage collection is required to free up space, via a REST call to `/_vacuum`. Garbage collection is not scheduled automatically, so you have to call it yourself.

* Document IDs longer than 180 characters overflow the Couchbase Server maximum key length and cause an HTTP error.

## Scaling Sync Gateway

Sync Gateway can be scaled up by running it as a cluster. This means running an identically configured instance of Sync Gateway on each of several machines, and load-balancing them by directing each incoming HTTP request to a random node. Sync Gateway nodes are "shared-nothing," so they don't need to coordinate any state or even know about each other. Everything they know is contained in the central Couchbase Server bucket.

All Sync Gateway nodes talk to the same Couchbase Server bucket. This can, of course, be hosted by a cluster of Couchbase Server nodes. Sync Gateway uses the standard Couchbase "smart-client" APIs and works with database clusters of any size.

## Performance

Keep in mind the following notes on performance:

* Sync Gateway nodes don't keep any local state, so they don't require any disk.

* Sync Gateway nodes do not cache much in RAM. Every request is handled independently. The Go programming language does use garbage collection, so the memory usage might be somewhat higher than for C code. However, memory usage shouldn't be excessive, provided the number of simultaneous requests per node is kept limited.

* Go is good at multiprocessing. It uses lightweight threads and asynchronous I/O. Adding more CPU cores to a Sync Gateway node can speed it up.

* As is typical with databases, writes are going to put a greater load on the system than reads. In particular, replication and channels imply that there's a lot of fan-out, where making a change triggers sending notifications to many other clients, who then perform reads to get the new data.

* We don't currently have any guidelines for how many gateway or database nodes you might need for particular workloads. We'll know more once we do more testing and tuning and get experience with real use cases.

## Managing TCP Connections

Very large-scale deployments might run into challenges managing large numbers of simultaneous open TCP connections. The replication protocol uses a "hanging-GET" technique to enable the server to push change notifications. This means that an active client running a continuous pull replication always has an open TCP connection on the server. This is similar to other applications that use server-push, also known as "Comet" techniques, as well as protocols like XMPP and IMAP.

These sockets remain idle most of the time (unless documents are being modified at a very high rate), so the actual data traffic is low—the issue is just managing that many sockets. This is commonly known as the "[C10k Problem](http://en.wikipedia.org/wiki/C10k_problem)" and it's been pretty well analyzed in the last few years. Because Go uses asynchronous I/O, it's capable of listening on large numbers of sockets provided that you make sure the OS is tuned accordingly and you've got enough network interfaces to provide a sufficiently large namespace of TCP port numbers per node.

