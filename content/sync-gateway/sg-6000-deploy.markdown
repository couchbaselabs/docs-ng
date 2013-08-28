# Deployment Considerations 


## Sizing

## Limitations

Sync Gateway has the following limitations:

* Can't currently operate on pre-existing Couchbase buckets with app data in them. (The gateway has its own document schema and needs to create and manage documents itself.) You can migrate existing data by creating a new bucket for the gateway and then using  the Sync API to PUT your documents into it.

* Only a subset of the CouchDB REST API is supported: this is intentional. The gateway is _not_ a CouchDB replacement, rather a compatible sync endpoint.

* Explicit garbage collection is required to free up space, via a REST call to `/_vacuum`. This is not yet scheduled automatically, so you'll have to call it yourself.

* Document IDs longer than about 180 characters will overflow Couchbase's key size limit and cause an HTTP error.

## Scaling Sync Gateway

Sync Gateway can be scaled up by running it as a cluster. This simply means running an instance of the gateway on each of several machines, all with the **identical configuration**, and load-balancing them by directing each incoming HTTP request to a random node. The gateway nodes are "shared-nothing," so they don't need to coordinate any state or even know about each other. Everything they know is contained in the central Couchbase bucket.

All of the gateway nodes talk to the same Couchbase Server bucket. This can, of course, be hosted by a cluster of Couchbase nodes. The gateway uses the standard Couchbase "smart-client" APIs and works with database clusters of any size.

## Performance

Keep in mind the following notes on performance:

* The gateway nodes don't keep any local state, so they don't require any disk.

* The gateway nodes do not cache much in RAM. Every request is handled independently. The Go programming language does use garbage collection, so the memory usage might be somewhat higher than for C code. However, memory usage shouldn't be excessive, provided the number of simultaneous requests per node is kept limited.

* Go is good at multiprocessing. It uses lightweight threads and asynchronous I/O. Throwing more CPU cores at a gateway node should definitely speed it up.

* As is typical with databases, writes are going to put a greater load on the system than reads. In particular, replication and channels imply that there's a lot of fan-out, where making a change will trigger sending notifications to many other clients, who will then perform reads to get the new data.

* We don't currently have any guidelines for how many gateway or database nodes you might need for particular workloads. We'll know more once we do more testing and tuning and get experience with real use cases.

## Managing TCP Connections

Very large-scale deployments may run into challenges managing large numbers of simultaneous open TCP connections. The replication protocol uses a "hanging-GET" technique to enable the server to push notifications of changes. This means that an active client running a continuous pull replication will always have an open TCP connection on the server. (This is similar to other applications that use server-push aka "Comet" techniques, as well as protocols like XMPP and IMAP.)

These sockets remain idle most of the time (unless documents are being modified at a very high rate!) so the actual data traffic is low; the issue is simply managing that many sockets. This is commonly known as the "[C10k Problem](http://en.wikipedia.org/wiki/C10k_problem)" and it's been pretty well analyzed in the last few years. Go uses asynchronous I/O so it's capable of listening on large numbers of sockets, provided you make sure the OS is tuned accordingly and you've got enough network interfaces to provide a sufficiently large namespace of TCP port numbers per node.

