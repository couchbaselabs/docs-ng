# Troubleshooting Views

A number of errors and problems with views are generally associated with the
eventual consistency model of the view system. In this section, some further
detail on this information and strategies for identifying and tracking view
errors are provided.

It also gives some guidelines about how to report potential view engine issues,
what information to include in JIRA.

<a id="couchbase-views-debugging-timeout"></a>

## Timeout errors in query responses

When querying a view with `stale=false`, you get often timeout errors for one or
more nodes. These nodes are nodes that did not receive the original query
request, for example you query node 1, and you get timeout errors for nodes 2, 3
and 4 as in the example below (view with reduce function \_count):


```
> curl -s 'http://localhost:9500/default/_design/dev_test2/_view/view2?full_set=true&stale=false'
{"rows":[
  {"key":null,"value":125184}
],
"errors":[
  {"from":"http://192.168.1.80:9503/_view_merge/?stale=false","reason":"timeout"},
  {"from":"http://192.168.1.80:9501/_view_merge/?stale=false","reason":"timeout"},
  {"from":"http://192.168.1.80:9502/_view_merge/?stale=false","reason":"timeout"}
]
}
```

The problem here is that by default, for queries with `stale=false` (full
consistency), the view merging node (node which receive the query request, node
1 in this example) waits up to 60000 milliseconds (1 minute) to receive partial
view results from each other node in the cluster. If it waits for more than 1
minute for results from a remote node, it stops waiting for results from that
node and a timeout error entry is added to the final response. A `stale=false`
request blocks a client, or the view merger node as in this example, until the
index is up to date, so these timeouts can happen frequently.

If you look at the logs from those nodes you got a timeout error, you'll see the
index build/update took more than 60 seconds, example from node 2:


```
[couchdb:info,2012-08-20T15:21:13.150,n_1@192.168.1.80:<0.6234.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater finished
 Indexing time: 93.734 seconds
 Blocked time:  10.040 seconds
 Inserted IDs:  124960
 Deleted IDs:   0
 Inserted KVs:  374880
 Deleted KVs:   0
 Cleaned KVs:   0
```

In this case, node 2 took 103.774 seconds to update the index.

In order to avoid those timeouts, you can pass a large connection\_timeout in
the view query URL, example:


```
> time curl -s
 'http://localhost:9500/default/_design/dev_test2/_view/view2?full_set=true&stale=false&connection_timeout=999999999'
{"rows":[
{"key":null,"value":2000000}
]
}
real  2m44.867s
user   0m0.007s
sys    0m0.007s
```

And in the logs of nodes 1, 2, 3 and 4, respectively you'll see something like
this:

`node 1, view merger node`


```
[couchdb:info,2012-08-20T16:10:02.887,n_0@192.168.1.80:<0.27674.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 155.549
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:96
 Deleted IDs:   0
 Inserted KVs:  1500288
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 2`


```
[couchdb:info,2012-08-20T16:10:28.457,n_1@192.168.1.80:<0.6071.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 163.555
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 3`


```
[couchdb:info,2012-08-20T16:10:29.710,n_2@192.168.1.80:<0.6063.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 164.808
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 4`


```
[couchdb:info,2012-08-20T16:10:26.686,n_3@192.168.1.80:<0.6063.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 161.786
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

<a id="couchbase-views-debugging-blocking"></a>

## Blocked indexers, no progress for long periods of time

Each design document maps to one indexer, so when the indexer runs it updates
all views defined in the corresponding design document. Indexing takes resources
(CPU, disk IO, memory), therefore Couchbase Server limits the maximum number of
indexers that can run in parallel. There are 2 configuration parameters to
specify the limit, one for regular (main/active) indexers and other for replica
indexers (more on this in a later section). The default for the former is 4 and
for the later is 2. They can be queried like this:


```
> curl -s 'http://Administrator:asdasd@localhost:8091/settings/maxParallelIndexers'
{"globalValue":4,"nodes":{"n_0@192.168.1.80":4}}
```

`maxParallelIndexers` is for main indexes and `maxParallelReplicaIndexers` is
for replica indexes. When there are more design documents (indexers) than
maxParallelIndexers, some indexers are blocked until there's a free slot, and
the rule is simple as first-come-first-served. These slots are controlled by 2
barriers processes, one for main indexes, and the other for replica indexes.
Their current state can be seen from `_active_tasks` (per node), for example
when there's no indexing happening:


```
> curl -s 'http://localhost:9500/_active_tasks' | json_xs
[
 {
     "waiting" : 0,
         "started_on" : 1345642656,
         "pid" : "<0.234.0>",
         "type" : "couch_main_index_barrier",
         "running" : 0,
         "limit" : 4,
         "updated_on" : 1345642656
         },
 {
     "waiting" : 0,
         "started_on" : 1345642656,
         "pid" : "<0.235.0>",
         "type" : "couch_replica_index_barrier",
         "running" : 0,
         "limit" : 2,
         "updated_on" : 1345642656
         }
 ]
```

The `waiting` fields tells us how many indexers are blocked, waiting for their
turn to run. Queries with `stale=false` have to wait for the indexer to be
started (if not already), unblocked and to finish, which can lead to a long time
when there are many design documents in the system. Also take into account that
the indexer for a particular design document might be running for one node but
it might be blocked in another node - when it's blocked it's not necessarily
blocked in all nodes of the cluster nor when it's running is necessarily running
in all nodes of the cluster - you verify this by querying \_active\_tasks for
each node (this API is not meant for direct user consumption, just for
developers and debugging/troubleshooting).

Through `_active_tasks` (remember, it's per node, so check it for every node in
the cluster), you can see which indexers are running and which are blocked. Here
follows an example where we have 5 design documents (indexers) and
`>maxParallelIndexers` is 4:


```
> curl -s 'http://localhost:9500/_active_tasks' | json_xs
[
   {
      "waiting" : 1,
      "started_on" : 1345644651,
      "pid" :  "<0.234.0>",
      "type" :  "couch_main_index_barrier",
      "running" : 4,
      "limit" : 4,
      "updated_on" : 1345644923
   },
   {
      "waiting" : 0,
      "started_on" : 1345644651,
      "pid" :  "<0.235.0>",
      "type" :  "couch_replica_index_barrier",
      "running" : 0,
      "limit" : 2,
      "updated_on" : 1345644651
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "updated_on" : 1345644923,
      "design_documents" : [
         "_design/test"
      ],
      "pid" :  "<0.4706.0>",
      "signature" : "4995c136d926bdaf94fbe183dbf5d5aa",
      "type" :  "blocked_indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test4"
      ],
      "pid" :  "<0.4715.0>",
      "changes_done" : 0,
      "signature" : "15e1f576bc85e3e321e28dc883c90077",
      "type" :  "indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test3"
      ],
      "pid" :  "<0.4719.0>",
      "changes_done" : 0,
      "signature" : "018b83ca22e53e14d723ea858ba97168",
      "type" :  "indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test2"
      ],
      "pid" :  "<0.4722.0>",
      "changes_done" : 0,
      "signature" : "440b0b3ded9d68abb559d58b9fda3e0a",
      "type" :  "indexer",
      "set" : "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test7"
      ],
      "pid" :  "<0.4725.0>",
      "changes_done" : 0,
      "signature" : "fd2bdf6191e61af6e801e3137e2f1102",
      "type" :  "indexer",
      "set" :  "default"
   }
]
```

The indexer for design document \_design/test is represented by a task with a
`type` field of `blocked_indexer`, while other indexers have a task with type
`indexer`, meaning they're running. The task with type
`couch_main_index_barrier` confirms this by telling us there are currently 4
indexers running and 1 waiting for its turn. When an indexer is allowed to
execute, its active task with type `blocked_indexer` is replaced by a new one
with type `indexer`.

<a id="couchbase-views-debugging-missing"></a>

## Data missing in query response or it's wrong (user issue)

For example, you defined a view with a `_stats` reduce function. You query your
view, and keep getting empty results all the time, for example:


```
> curl -s 'http://localhost:9500/default/_design/dev_test3/_view/view1?full_set=true'
{"rows":[
]
}
```

You repeat this query over and over for several minutes or even hours, and you
always get an empty result set.

Try to query the view with `stale=false`, and you get:


```
> curl -s 'http://localhost:9500/default/_design/dev_test3/_view/view1?full_set=true&stale=false'
{"rows":[
],
"errors":[
{"from":"local","reason":"Builtin _stats function
 requires map values to be numbers"},
{"from":"http://192.168.1.80:9502/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"},
{"from":"http://192.168.1.80:9501/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"},
{"from":"http://192.168.1.80:9503/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"}
]
}
```

Then looking at the design document, you see it could never work, as values are
not numbers:


```
{
   "views":
   {
       "view1": {
           "map": "function(doc, meta) { emit(meta.id, meta.id); }",
           "reduce": "_stats"
       }
   }
}
```

One important question to make is, why do you see the errors when querying with
`stale=false` but do not see them when querying with `stale=update_after`
(default) or `stale=ok` ? The answer is simple:

 1. `stale=false` means: trigger an index update/build, and wait until it that
    update/build finishes, then start streaming the view results. For this example,
    index build/update failed, so the client gets an error, describing why it
    failed, from all nodes where it failed.

 1. `stale=update` \_after means start streaming the index contents immediately and
    after trigger an index update (if index is not up to date already), so query
    responses won't see indexing errors as they do for the `stale=false` scenario.
    For this particular example, the error happened during the initial index build,
    so the index was empty when the view queries arrived in the system, whence the
    empty result set.

 1. `stale=ok` is very similar to (2), except it doesn't trigger index updates.

Finally, index build/update errors, related to user Map/Reduce functions, can be
found in a dedicated log file that exists per node and has a file name matching
`mapreduce_errors.#`. For example, from node 1, the file `*mapreduce_errors.1`
contained:


```
[mapreduce_errors:error,2012-08-20T16:18:36.250,n_0@192.168.1.80:<0.2096.1>] Bucket `default`, main group `_design/dev_test3`,
 error executing reduce
function for view `view1'
   reason:                Builtin _stats function requires map values to be
numbers
```

<a id="couchbase-views-debugging-wrongdocs"></a>

## Wrong documents or rows when querying with include_docs=true

Imagine you have the following design document:


```
{
     "meta": {"id": "_design/test"},
     "views":
     {
         "view1": {
             "map": "function(doc, meta) { emit(meta.id,  doc.value); }"
         }
     }
 }
```

And the bucket only has 2 documents, document `doc1` with JSON value `{"value":
1}`, and document `doc2` with JSON value `{"value": 2}`, you query the view
initially with `stale=false` and `include_docs=true` and get:


```
> curl -s 'http://localhost:9500/default/_design/test/_view/view1?include_docs=true&stale=false' | json_xs
 {
    "total_rows" :
2,
    "rows" :
[
       {
          "value" : 1,
          "doc"
: {
             "json" : {
                "value" : 1
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "1-000000367916708a0000000000000000",
                "id" : "doc1"
             }
          },
          "id"
: "doc1",
          "key"
: "doc1"
       },
       {
          "value" : 2,
          "doc"
: {
             "json" : {
                "value" : 2
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "1-00000037b8a32e420000000000000000",
                "id" : "doc2"
             }
          },
          "id"
: "doc2",
          "key"
: "doc2"
       }
    ]
 }
```

Later on you update both documents, such that document `doc1` has the JSON value
`{"value": 111111}` and document `doc2` has the JSON value `{"value": 222222}`.
You then query the view with `stale=update_after` (default) or `stale=ok` and
get:


```
> curl -s 'http://localhost:9500/default/_design/test/_view/view1?include_docs=true' | json_xs
 {
    "total_rows" :
2,
    "rows" :
[
       {
          "value" : 1,
          "doc"
: {
             "json" : {
                "value" : 111111
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "2-0000006657aeed6e0000000000000000",
                "id" : "doc1"
             }
          },
          "id"
: "doc1",
          "key"
: "doc1"
       },
       {
          "value" : 2,
          "doc"
: {
             "json" : {
                "value" : 222222
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "2-00000067e3ee42620000000000000000",
                "id" : "doc2"
             }
          },
          "id"
: "doc2",
          "key"
: "doc2"
       }
    ]
 }
```

The documents included in each row don't match the value field of each row, that
is, the documents included are the latest (updated) versions but the index row
values still reflect the previous (first) version of the documents.

Why this behavior? Well, `include_docs=true` works by at query time, for each
row, to fetch from disk the latest revision of each document. There's no way to
include a previous revision of a document. Previous revisions are not accessible
through the latest vbucket databases MVCC snapshots (
[http://en.wikipedia.org/wiki/Multiversion\_concurrency\_control](http://en.wikipedia.org/wiki/Multiversion_concurrency_control)
), and it's not possible to find efficiently from which previous MVCC snapshots
of a vbucket database a specific revision of a document is located. Further,
vbucket database compaction removes all previous MVCC snapshots (document
revisions). In short, this is a deliberate design limit of the database engine.

The only way to ensure full consistency here is to include the documents
themselves in the values emitted by the map function. Queries with `stale=false`
are not 100% reliable either, as just after the index is updated and while rows
are being streamed from disk to the client, document updates and deletes can
still happen, resulting in the same behavior as in the given example.

<a id="couchbase-views-debugging-expired"></a>

## Expired documents still have their associated Key-Value pairs returned in queries with stale=false

See
[http://www.couchbase.com/issues/browse/MB-6219](http://www.couchbase.com/issues/browse/MB-6219)

<a id="couchbase-views-debugging-datamissing"></a>

## Data missing in query response or it's wrong (potentially due to server issues)

Sometimes, especially between releases for development builds, it's possible
results are missing due to issues in some component of Couchbase Server. This
section describes how to do some debugging to identify which components, or at
least to identify which components are not at fault.

Before proceeding, it needs to be mentioned that each vbucket is physically
represented by a CouchDB database (generated by couchstore component) which
corresponds to exactly 1 file in the filesystem, example from a development
environment using 16 vbuckets only (for example simplicity), 4 nodes and without
replicas enabled:


```
> tree ns_server/couch/0/
ns_server/couch/0/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 2.couch.1
     ??? 3.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 8 files

> tree ns_server/couch/1/
ns_server/couch/1/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 6.couch.1
     ??? 7.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files

> tree ns_server/couch/2/
ns_server/couch/2/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 8.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files

> tree ns_server/couch/3/
ns_server/couch/3/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 12.couch.1
     ??? 13.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files
```

For this particular example, because there are `no replicas enabled` (ran
`./cluster_connect -n 4 -r 0` ), each node only has database files for the
vbuckets it's responsible for (active vbuckets). The numeric suffix in each
database filename, starts at 1 when the database file is created and it gets
incremented, by 1, every time the vbucket is compacted. If replication is
enabled, for example you ran `./cluster_connect -n 4 -r 1`, then each node will
have vbucket database files for the vbuckets it's responsible for (active
vbuckets) and for some replica vbuckets, example:


```
> tree ns_server/couch/0/

ns_server/couch/0/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 12.couch.1
     ??? 2.couch.1
     ??? 3.couch.1
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 8.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

> tree ns_server/couch/1/

ns_server/couch/1/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 13.couch.1
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 6.couch.1
     ??? 7.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

> tree ns_server/couch/2/

ns_server/couch/2/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? 2.couch.1
     ??? 6.couch.1
     ??? 8.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

> tree ns_server/couch/3/
ns_server/couch/3/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 12.couch.1
     ??? 13.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? 3.couch.1
     ??? 7.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files
```

You can figure out which vbucket are active in each node, by querying the
following URL:


```
> curl -s http://localhost:8091/pools/default/buckets |
  json_xs
 [
    {
       "quota" :
{
          "rawRAM" : 268435456,
          "ram"
: 1073741824
       },
       "localRandomKeyUri" : "/pools/default/buckets/default/localRandomKey",
       "bucketCapabilitiesVer" : "",
       "authType"
: "sasl",
       "uuid" :
  "89dd5c64504f4a9414a2d3bcf9630d15",
       "replicaNumber" : 1,
       "vBucketServerMap" : {
          "vBucketMap" : [
             [
                0,
                1
             ],
             [
                0,
                1
             ],
             [
                0,
                2
             ],
             [
                0,
                3
             ],
             [
                1,
                0
             ],
             [
                1,
                0
             ],
             [
                1,
                2
             ],
             [
                1,
                3
             ],
             [
                2,
                0
             ],
             [
                2,
                1
             ],
             [
                2,
                3
             ],
             [
                2,
                3
             ],
             [
                3,
                0
             ],
             [
                3,
                1
             ],
             [
                3,
                2
             ],
             [
                3,
                2
             ]
          ],
          "numReplicas" : 1,
          "hashAlgorithm" : "CRC",
          "serverList" : [
             "192.168.1.81:12000",
             "192.168.1.82:12002",
             "192.168.1.83:12004",
             "192.168.1.84:12006"
          ]
       },

(....)
 ]
```

The field to look at is named `vBucketServerMap`, and it contains two important
sub-fields, named `vBucketMap` and `serverList`, which we use to find out which
nodes are responsible for which vbuckets (active vbuckets).

Looking at these 2 fields, we can do the following active and replica vbucket to
node mapping:

 * vbuckets 0, 1, 2 and 3 are active at node 192.168.1.81:12000, and vbuckets 4, 5,
   8 and 12 are replicas at that same node

 * vbuckets 4, 5, 6 and 7 are active at node 192.168.1.82:12002, and vbuckets 0, 1,
   9 and 13 are replicas at that same node

 * vbuckets 8, 9, 10 and 11 are active at node 192.168.1.83:12004, and vbuckets 2,
   6, 14 and 15 are replicas at that same node

 * vbuckets 12, 13, 14 and 15 are active at node 192.168.1.84:12006, and vbucket 3,
   7, 11 and 10

the value of `vBucketMap` is an array of arrays of 2 elements. Each sub-array
corresponds to a vbucket, so the first one is related to vbucket 0, second one
to vbucket 1, etc, and the last one to vbucket 15. Each sub-array element is an
index (starting at 0) into the `serverList` array. First element of each
sub-array tells us which node (server) has the corresponding vbucket marked as
active, while the second element tells us which server has this vbucket marked
as replica.

If the replication factor is greater than 1 (N > 1), then each sub-array will
have N + 1 elements, where first one is always index of server/node that has
that vbucket active and the remaining elements are the indexes of the servers
having the first, second, third, etc replicas of that vbucket.

After knowing which vbuckets are active in each node, we can use some tools such
as `couch_dbinfo` and `couch_dbdump` to analyze active vbucket database files.
Before looking at those tools, lets first know what database sequence numbers
are.

When a CouchDB database (remember, each corresponds to a vbucket) is created,
its update\_seq (update sequence number) is 0. When a document is created,
updated or deleted, its current sequence number is incremented by 1. So all the
following sequence of actions result in the final sequence number of 5:

 1. Create document doc1, create document doc2, create document doc3, create
    document doc4, create document doc5

 1. Create document doc1, update document doc1, update document doc1, update
    document doc1, delete document doc1

 1. Create document doc1, delete document doc1, create document doc2, update
    document doc2, update document doc2

 1. Create document doc1, create document doc2, create document doc3, create
    document doc4, update document doc2

 1. etc...

You can see the current update\_seq of a vbucket database file, amongst other
information, with the `couch_dbinfo` command line tool, example with vbucket 0,
active in the first node:


```
> ./install/bin/couch_dbinfo ns_server/couch/0/default/0.couch.1
 DB Info
  (ns_server/couch/0/default/0.couch.1)
    file format version: 10
    update_seq: 31250
    doc count: 31250
    deleted doc count: 0
    data size: 3.76 MB
    B-tree size: 1.66 MB
    total disk size: 5.48 MB
```

After updating all the documents in that vbucket database, the update\_seq
doubled:


```
> ./install/bin/couch_dbinfo ns_server/couch/0/default/0.couch.1
DB Info
 (ns_server/couch/0/default/0.couch.1)
   file format version: 10
   update_seq:00
   doc count: 31250
   deleted doc count: 0
   data size: 3.76 MB
   B-tree size: 1.75 MB
   total disk size: 10.50 MB
```

An important detail, if not obvious, is that with each vbucket database sequence
number one and only one document ID is associated to it. At any time, there's
only one update sequence number associated with a document ID, and it's always
the most recent. We can verify this with the `couch_dbdump` command line tool.
Take the following example, where we only have 2 documents, document with ID
doc1 and document with ID doc2:


```
> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 1
     id: doc1
     rev: 1
     content_meta: 0
     cas: 130763975746, expiry: 0, flags: 0
     data: {"value": 1}
Total docs: 1
```

On an empty vbucket 0 database, we created document with ID `doc1`, which has a
JSON value of `{"value": 1}`. This document is now associated with update
sequence number 1. Next we create another document, with ID \*doc2\* and JSON
value `{"value": 2}`, and the output of `couch_dbdump` is:


```
> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 1
     id: doc1
     rev: 1
     content_meta: 0
     cas: 130763975746, expiry: 0, flags: 0
     data: {"value": 1}
Doc seq: 2
     id: doc2
     rev: 1
     content_meta: 0
     cas: 176314689876, expiry: 0, flags: 0
     data: {"value": 2}
Total docs: 2
```

Document `doc2` got associated to vbucket 0 database update sequence number 2.
Next, we update document `doc1` with a new JSON value of `{"value": 1111}`, and
`couch_dbdump` tells us:


```
> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 2
     id: doc2
     rev: 1
     content_meta: 0
     cas: 176314689876, expiry: 0, flags: 0
     data: {"value": 2}
Doc seq: 3
     id: doc1
     rev: 2
     content_meta: 0
     cas: 201537725466, expiry: 0, flags: 0
     data: {"value": 1111}

Total docs: 2
```

So, document `doc1` is now associated with update sequence number 3. Note that
it's no longer associated with sequence number 1, because the update was the
most recent operation against that document (remember, only 3 operations are
possible: create, update or delete). The database no longer has a record for
sequence number 1 as well. After this, we update document `doc2` with JSON value
`{"value": 2222}`, and we get the following output from `couch_dbdump` :


```
> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 3
     id: doc1
     rev: 2
     content_meta: 0
     cas: 201537725466, expiry: 0, flags: 0
     data: {"value": 1111}
Doc seq: 4
     id: doc2
     rev: 2
     content_meta: 0
     cas: 213993873979, expiry: 0, flags:   0
     data: {"value": 2222}

Total docs: 2
```

Document `doc2` is now associated with sequence number 4, and sequence number 2
no longer has a record in the database file. Finally we deleted document `doc1`,
and then we get:


```
> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 4
     id: doc2
     rev: 2
     content_meta: 0
     cas: 213993873979, expiry: 0, flags: 0
     data: {"value": 2222}
Doc seq: 5
     id: doc1
     rev: 3
     content_meta: 3
     cas: 201537725467, expiry: 0, flags: 0
     doc deleted
     could not read document body: document not found

Total docs: 2
```

Note that document deletes don't really delete documents from the database
files, instead they flag the document has deleted and remove its JSON (or
binary) value. Document `doc1` is now associated with sequence number 5 and the
record for its previously associated sequence number 3, is removed from the
vbucket 0 database file. This allows for example, indexes to know they have to
delete all Key-Value pairs previously emitted by a map function for a document
that was deleted - if there weren't any update sequence number associated with
the delete operation, indexes would have no way to know if documents were
deleted or not.

These details of sequence numbers and document operations are what allow indexes
to be updated incrementally in Couchbase Server (and Apache CouchDB as well).

In Couchbase Server, indexes store in their header (state) the last update\_seq
seen for each vbucket database. Put it simply, whenever an index build/update
finishes, it stores in its header the last update\_seq processed for each
vbucket database. Vbucket databases have states too in indexes, and these states
do not necessarily match the vbucket states in the server. For the goals of this
wiki page, it only matters to mention that view requests with `stale=false` will
be blocked only if the currently stored update\_seq of any active vbucket in the
index header is smaller than the current update\_seq of the corresponding
vbucket database - if this is true for at least one active vbucket, an index
update is scheduled immediately (if not already running) and when it finishes it
will unblock the request. Requests with `stale=false` will not be blocked if the
update\_seq of vbuckets in the index with other states (passive, cleanup,
replica) are smaller than the current update\_seq of the corresponding vbucket
databases - the reason for this is that queries only see rows produced for
documents that live in the active vbuckets.

We can see that states of vbuckets in the index, and the update\_seqs in the
index, by querying the following URL (example for 16 vbuckets only, for the sake
of simplicity):


```
> curl -s 'http://localhost:9500/_set_view/default/_design/dev_test2/_info' | json_xs
{
   "unindexable_partitions" : {},
   "passive_partitions" : [],
   "compact_running" : false,
   "cleanup_partitions" : [],
   "replica_group_info" : {
      "unindexable_partitions" : {},
      "passive_partitions" : [
         4,
         5,
         8,
         12
      ],
      "compact_running" : false,
      "cleanup_partitions" : [],
      "active_partitions" : [],
      "pending_transition" : null,
      "db_set_message_queue_len" : 0,
      "out_of_sync_db_set_partitions" : false,
      "expected_partition_seqs" : {
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
      },
      "updater_running" : false,
      "partition_seqs" : {
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
      },
      "stats" : {
         "update_history" : [
            {
               "deleted_ids" : 0,
               "inserted_kvs" : 38382,
               "inserted_ids" : 12794,
               "deleted_kvs" : 38382,
               "cleanup_kv_count" : 0,
               "blocked_time" : 1.5e-05,
               "indexing_time" : 3.861918
            }
         ],
         "updater_cleanups" : 0,
         "compaction_history" : [
            {
               "cleanup_kv_count" : 0,
               "duration" : 1.955801
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 2.443478
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 4.956397
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 9.522231
            }
         ],
         "full_updates" : 1,
         "waiting_clients" : 0,
         "compactions" : 4,
         "cleanups" : 0,
         "partial_updates" : 0,
         "stopped_updates" : 0,
         "cleanup_history" : [],
         "cleanup_interruptions" : 0
      },
      "initial_build" : false,
      "update_seqs" : {
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
      },
      "partition_seqs_up_to_date" : true,
      "updater_state" : "not_running",
      "data_size" : 5740951,
      "cleanup_running" : false,
      "signature" : "440b0b3ded9d68abb559d58b9fda3e0a",
      "max_number_partitions" : 16,
      "disk_size" : 5742779
   },
   "active_partitions" : [
      0,
      1,
      2,
      3
   ],
   "pending_transition" : null,
   "db_set_message_queue_len" : 0,
   "out_of_sync_db_set_partitions" : false,
   "replicas_on_transfer" : [],
   "expected_partition_seqs" : {
      "1" :00,
      "3" :00,
      "0" :00,
      "2" :00
   },
   "updater_running" : false,
   "partition_seqs" : {
      "1" :00,
      "3" :00,
      "0" :00,
      "2" :00
   },
   "stats" : {
      "update_history" : [],
      "updater_cleanups" : 0,
      "compaction_history" : [],
      "full_updates" : 0,
      "waiting_clients" : 0,
      "compactions" : 0,
      "cleanups" : 0,
      "partial_updates" : 0,
      "stopped_updates" : 0,
      "cleanup_history" : [],
      "cleanup_interruptions" : 0
   },
   "initial_build" :   false,
   "replica_partitions" : [
      4,
      5,
      8,
      12
   ],
   "update_seqs" : {
      "1" : 31250,
      "3" : 31250,
      "0" : 31250,
      "2" : 31250
   },
   "partition_seqs_up_to_date" : true,
   "updater_state" :   "not_running",
   "data_size" : 5717080,
   "cleanup_running" : false,
   "signature" :   "440b0b3ded9d68abb559d58b9fda3e0a",
   "max_number_partitions" : 16,
   "disk_size" : 5726395
}
```

The output gives us several fields useful to diagnose issues in the server. The
field `replica_group_info` can be ignored for the goals of this wiki (would only
be useful during a failover), the information it contains is similar to the top
level information, which is the one for the main/principal index, which is the
one we care about during steady state and during rebalance.

Some of the top level fields and their meaning:

 * `active_partitions` - this is a list with the ID of all the vbuckets marked as
   active in the index.

 * `passive_partitions` - this is a list with the ID of all vbuckets marked as
   passive in the index.

 * `cleanup_partitions` - this is a list with the ID of all vBuckets marked as
   cleanup in the index.

 * `compact_running` - true if index compaction is ongoing, false otherwise.

 * `updater_running` - true if index build/update is ongoing, false otherwise.

 * `update_seqs` - this tells us what up to which vbucket database update\_seqs the
   index reflects data, keys are vbucket IDs and values are update\_seqs. The
   update\_seqs here are always smaller or equal then the values in
   `partition_seqs` and `expected_partition_seqs`. If the value of any update\_seq
   here is smaller than the corresponding value in `partition_seqs` or
   `expected_partition_seqs`, than it means the index is not up to date (it's
   stale), and a subsequent query with `stale=false` will be blocked and spawn an
   index update (if not already running).

 * `partition_seqs` - this tells us what are the current update\_seqs for each
   vbucket database. If any update\_seq value here is greater than the
   corresponding value in `update_seqs`, we can say the index is not up to date
   (it's stale). See the description above for `update_seqs`.

 * `expected_partition_seqs` - this should normally tells us exactly the same as
   `partition_seqs` (see above). Index processes have an optimization where they
   monitor vbucket database updates and track their current update\_seqs, so that
   when the index needs to know them, it doesn't need to consult them from the
   databases (expensive, from a performance perspective). The update\_seqs in this
   field are obtained by consulting each database file. If they don't match the
   corresponding values in `partition_seqs`, then we can say there's an issue in
   the view-engine.

 * `unindexable_partitions` - this field should be non-empty only during rebalance.
   Vbuckets that are in this meta state "unindexable" means that index updates will
   ignore these vbuckets. Transitions to and from this state are used by ns\_server
   for consistent views during rebalance. When not in rebalance, this field should
   always be empty, if not, then there's a issue somewhere. The value for this
   field, when non-empty, is an object whose keys are vbucket IDs and values are
   update\_seqs.

Using the information given by this URL (remember, it's on a per node basis), to
check the vbucket states and indexed update\_seqs, together with the tools
`couch_dbinfo` and `couch_dbdump` (against all active vbucket database files),
one can debug where (which component) a problem is. For example, it's useful to
find if it's the indexes that are not indexing latest data/updates/processing
deletes, or if the memcached/ep-engine layer is not persisting data/updates to
disk or if there's some issue in couchstore (component which writes to database
files) that causes it to not write data or write incorrect data to the database
file.

An example where using these tools and the information from the URL
/\_set\_view/bucketname/\_design/ddocid/\_info was very important to find which
component was misbehaving is at
[http://www.couchbase.com/issues/browse/MB-5534](http://www.couchbase.com/issues/browse/MB-5534).
In this case Tommie was able to identify that the problem was in ep-engine.

<a id="couchbase-views-debugging-indexfs"></a>

## Index filesystem structure and meaning

All index files live within a subdirectory of the data directory named
`@indexes`. Within this subdirectory, there's a subdirectory for each bucket
(which matches exactly the bucket name).

Any index file has the form `<type>_<hexadecimal_signature>.view.N` Each
component's meaning is:

 * `type` - the index type, can be main (active vbuckets data) or replica (replica
   vbuckets data)

 * `hexadecimal_signature` - this is the hexadecimal form of an MD5 hash computed
   over the map/reduce functions of a design document, when these functions change,
   a new index is created. It's possible to have multiple versions of the same
   design document alive (different signatures). This happens for a short period,
   for example a client does a `stale=false` request to an index (1 index == 1
   design document), which triggers an index build/update and before this
   update/build finishes, the design document is updated (with different map/reduce
   functions). The initial version of the index will remain alive until all
   currently blocked clients on it are served. In the meanwhile new query requests
   are redirected to the latest (second) version of the index, always. This is what
   makes it possible to have multiple versions of the same design document index
   files at any point in time (however for short periods).

 * `N` - when an index file is created N is 1, always. Every time the index file is
   compacted, N is incremented by 1. This is similar to what happens for vbucket
   database files (see [Data missing in query response or it's wrong (potentially
   due to server issues)](#couchbase-views-debugging-datamissing) ).

For each design document, there's also a subdirectory named like
`tmp_<hexadecimal_signature>_<type>`. This is a directory containing temporary
files used for the initial index build (and soon for incremental optimizations).
Files within this directory have a name formed by the design document signature
and a generated UUID. These files are periodically deleted when they're not
useful anymore.

All views defined within a design document are backed by a btree data structure,
and they all live inside the same index file. Therefore for each design
document, independently of the number of views it defines, there's 2 files, one
for main data and the other for replica data.

Example:


```
> tree couch/0/\@indexes/
couch/0/@indexes/
 ??? default
     ???
main_018b83ca22e53e14d723ea858ba97168.view.1
     ???
main_15e1f576bc85e3e321e28dc883c90077.view.1
     ???
main_440b0b3ded9d68abb559d58b9fda3e0a.view.1
     ???
main_4995c136d926bdaf94fbe183dbf5d5aa.view.1
     ???
main_fd2bdf6191e61af6e801e3137e2f1102.view.1
     ???
replica_018b83ca22e53e14d723ea858ba97168.view.1
     ???
replica_15e1f576bc85e3e321e28dc883c90077.view.1
     ???
replica_440b0b3ded9d68abb559d58b9fda3e0a.view.1
     ???
replica_4995c136d926bdaf94fbe183dbf5d5aa.view.1
     ???
replica_fd2bdf6191e61af6e801e3137e2f1102.view.1
     ???
tmp_018b83ca22e53e14d723ea858ba97168_main
     ???
tmp_15e1f576bc85e3e321e28dc883c90077_main
     ???
tmp_440b0b3ded9d68abb559d58b9fda3e0a_main
     ???
tmp_4995c136d926bdaf94fbe183dbf5d5aa_main
     ???
tmp_fd2bdf6191e61af6e801e3137e2f1102_main

 6 directories, 10 files
```

<a id="couchbase-views-debugging-aliases"></a>

## Design document aliases

When 2 or more design documents have exactly the same map and reduce functions
(but different IDs of course), they get the same signature (see [Index
filesystem structure and meaning](#couchbase-views-debugging-indexfs) ). This
means that both point to the same index files, and it's exactly this feature
that allows publishing development design documents into production, which
consists of creating a copy of the development design document (ID matches
\_design/dev\_foobar) with an ID not containing the `dev_` prefix and then
deleting the original development document, which ensure the index files are
preserved after deleting the development design document. It's also possible to
have multiple "production" aliases for the same production design document. The
view engine itself has no notion of development and production design documents,
this is a notion only at the UI and cluster layers, which exploits the design
document signatures/aliases feature.

The following example shows this property.

We create 2 identical design documents, only their IDs differ:


```
> curl -H 'Content-Type: application/json' \
    -X PUT 'http://localhost:9500/default/_design/ddoc1' \
    -d '{ "views": {"view1": {"map": "function(doc, meta) { emit(doc.level, meta.id); }"}}}'
{"ok":true,"id":"_design/ddoc1"}

> curl -H 'Content-Type: application/json' \
    -X PUT 'http://localhost:9500/default/_design/ddoc2'
    -d '{ "views": {"view1": {"map": "function(doc, meta) { emit(doc.level, meta.id); }"}}}'
{"ok":true,"id":"_design/ddoc2"}
```

Next we query view1 from \_design/ddoc1 with `stale=false`, and get:


```
> curl -s 'http://localhost:9500/default/_design/ddoc1/_view/view1?limit=10&stale=false'
{"total_rows":1000000,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"},
{"id":"0000464","key":1,"value":"0000464"},
{"id":"0000496","key":1,"value":"0000496"},
{"id":"0000604","key":1,"value":"0000604"},
{"id":"0000626","key":1,"value":"0000626"}
]
}
```

If immediately after you query view1 from \_design/ddoc2 with `stale=ok`, you'll
get exactly the same results, because both design documents are aliases, they
share the same signature:


```
> curl -s 'http://localhost:9500/default/_design/ddoc2/_view/view1?limit=10&stale=ok'
{"total_rows":1000000,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"},
{"id":"0000464","key":1,"value":"0000464"},
{"id":"0000496","key":1,"value":"0000496"},
{"id":"0000604","key":1,"value":"0000604"},
{"id":"0000626","key":1,"value":"0000626"}
]
}
```

If you look into the data directory, there's only one main index file and one
replica index file:


```
> tree couch/0/\@indexes
couch/0/@indexes
 ??? default
     ???
main_1909e1541626269ef88c7107f5123feb.view.1
     ???
replica_1909e1541626269ef88c7107f5123feb.view.1
     ???
tmp_1909e1541626269ef88c7107f5123feb_main

 2 directories, 2 files
```

Also, while the indexer is running, if you query `_active_tasks` for a node,
you'll see one single indexer task, which lists both design documents in the
`design_documents` array field:


```
> curl -s http://localhost:9500/_active_tasks | json_xs
[
   {
      "waiting" : 0,
      "started_on" : 1345662986,
      "pid" :   "<0.234.0>",
      "type" :   "couch_main_index_barrier",
      "running" : 1,
      "limit" : 4,
      "updated_on" : 1345663590
   },
   {
      "waiting" : 0,
      "started_on" : 1345662986,
      "pid" : "<0.235.0>",
      "type" :   "couch_replica_index_barrier",
      "running" : 0,
      "limit" : 2,
      "updated_on" : 1345662986
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345663590,
      "progress" : 75,
      "initial_build" : true,
      "updated_on" : 1345663634,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/ddoc1",
         "_design/ddoc2"
      ],
      "pid" :   "<0.6567.0>",
      "changes_done" : 189635,
      "signature" : "1909e1541626269ef88c7107f5123feb",
      "type" :   "indexer",
      "set" :   "default"
   }
]
```

<a id="couchbase-views-debugging-singlenode"></a>

## Getting query results from a single node

There's a special URI which allows to get index results only from the targeted
node. It is used only for development and debugging, not meant to be public.
Here follows an example where we query 2 different nodes from a 4 nodes cluster.


```
> curl -s 'http://192.168.1.80:9500/_set_view/default/_design/ddoc2/_view/view1?limit=4'
{"total_rows":250000,"offset":0,"rows":[
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000716","key":1,"value":"0000716"},
{"id":"0000719","key":1,"value":"0000719"}
]}
> curl -s 'http://192.168.1.80:9500/_set_view/default/_design/ddoc2/_view/view1?limit=4'
{"total_rows":250000,"offset":0,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"}
]}
```

`Note:` for this special API, the default value of the stale parameter is
`stale=false`, while for the public, documented API the default is
`stale=update_after`.

<a id="couchbase-views-debugging-replicaindex"></a>

## Verifying replica index and querying it (debug/testing)

It's not easy to test/verify from the outside that the replica index is working.
Remember, replica index is optional, and it's just an optimization for faster
`stale=false` queries after rebalance - it doesn't cope with correctness of the
results.

There's a non-public query parameter named `_type` used only for debugging and
testing. Its default value is `main`, and the other possible value is `replica`.
Here follows an example of querying the main (default) and replica indexes on a
2 nodes cluster (for sake of simplicity), querying the main (normal) index
gives:


```
> curl -s 'http://localhost:9500/default/_design/test/_view/view1?limit=20&stale=false&debug=true'
{"total_rows":20000,"rows":[
{"id":"0017131","key":2,"partition":43,"node":"http://192.168.1.80:9501/_view_merge/","value":"0017131"},
{"id":"0000225","key":10,"partition":33,"node":"http://192.168.1.80:9501/_view_merge/","value":"0000225"},
{"id":"0005986","key":15,"partition":34,"node":"http://192.168.1.80:9501/_view_merge/","value":"0005986"},
{"id":"0015579","key":17,"partition":27,"node":"local","value":"0015579"},
{"id":"0018530","key":17,"partition":34,"node":"http://192.168.1.80:9501/_view_merge/","value":"0018530"},
{"id":"0006210","key":23,"partition":2,"node":"local","value":"0006210"},
{"id":"0006866","key":25,"partition":18,"node":"local","value":"0006866"},
{"id":"0019349","key":29,"partition":21,"node":"local","value":"0019349"},
{"id":"0004415","key":39,"partition":63,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004415"},
{"id":"0018181","key":48,"partition":5,"node":"local","value":"0018181"},
{"id":"0004737","key":49,"partition":1,"node":"local","value":"0004737"},
{"id":"0014722","key":51,"partition":2,"node":"local","value":"0014722"},
{"id":"0003686","key":54,"partition":38,"node":"http://192.168.1.80:9501/_view_merge/","value":"0003686"},
{"id":"0004656","key":65,"partition":48,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004656"},
{"id":"0012234","key":65,"partition":10,"node":"local","value":"0012234"},
{"id":"0001610","key":71,"partition":10,"node":"local","value":"0001610"},
{"id":"0015940","key":83,"partition":4,"node":"local","value":"0015940"},
{"id":"0010662","key":87,"partition":38,"node":"http://192.168.1.80:9501/_view_merge/","value":"0010662"},
{"id":"0015913","key":88,"partition":41,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015913"},
{"id":"0019606","key":90,"partition":22,"node":"local","value":"0019606"}
],
```

Note that the `debug=true` parameter, for map views, add 2 row fields,
`partition` which is the vbucket ID where the document that produced this row
(emitted by the map function) lives, and `node` which tells from which node in
the cluster the row came (value "local" for the node which received the query,
an URL otherwise).

Now, doing the same query but against the replica index ( `_type=replica` )
gives:


```
> curl -s 'http://localhost:9500/default/_design/test/_view/view1?limit=20&stale=false&_type=replica&debug=true'
{"total_rows":20000,"rows":[
{"id":"0017131","key":2,"partition":43,"node":"local","value":"0017131"},
{"id":"0000225","key":10,"partition":33,"node":"local","value":"0000225"},
{"id":"0005986","key":15,"partition":34,"node":"local","value":"0005986"},
{"id":"0015579","key":17,"partition":27,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015579"},
{"id":"0018530","key":17,"partition":34,"node":"local","value":"0018530"},
{"id":"0006210","key":23,"partition":2,"node":"http://192.168.1.80:9501/_view_merge/","value":"0006210"},
{"id":"0006866","key":25,"partition":18,"node":"http://192.168.1.80:9501/_view_merge/","value":"0006866"},
{"id":"0019349","key":29,"partition":21,"node":"http://192.168.1.80:9501/_view_merge/","value":"0019349"},
{"id":"0004415","key":39,"partition":63,"node":"local","value":"0004415"},
{"id":"0018181","key":48,"partition":5,"node":"http://192.168.1.80:9501/_view_merge/","value":"0018181"},
{"id":"0004737","key":49,"partition":1,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004737"},
{"id":"0014722","key":51,"partition":2,"node":"http://192.168.1.80:9501/_view_merge/","value":"0014722"},
{"id":"0003686","key":54,"partition":38,"node":"local","value":"0003686"},
{"id":"0004656","key":65,"partition":48,"node":"local","value":"0004656"},
{"id":"0012234","key":65,"partition":10,"node":"http://192.168.1.80:9501/_view_merge/","value":"0012234"},
{"id":"0001610","key":71,"partition":10,"node":"http://192.168.1.80:9501/_view_merge/","value":"0001610"},
{"id":"0015940","key":83,"partition":4,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015940"},
{"id":"0010662","key":87,"partition":38,"node":"local","value":"0010662"},
{"id":"0015913","key":88,"partition":41,"node":"local","value":"0015913"},
{"id":"0019606","key":90,"partition":22,"node":"http://192.168.1.80:9501/_view_merge/","value":"0019606"}
],
```

Note that you get exactly the same results (id, key and value for each row).
Looking at the row field `node`, you can see there's a duality when compared to
the results we got from the main index, which is very easy to understand for the
simple case of a 2 nodes cluster.

To find out which replica vbuckets exist in each node, see section [Data missing
in query response or it's wrong (potentially due to server
issues)](#couchbase-views-debugging-datamissing).

<a id="couchbase-views-debugging-totalrows"></a>

## Expected cases for total_rows with a too high value

In some scenarios, it's expected to see queries returning a `total_rows` field
with a value higher than the maximum rows they can return (map view queries
without an explicit `limit`, `skip`, `startkey` or `endkey` ).

The expected scenarios are during rebalance, and immediately after a failover
for a finite period of time.

This happens because in these scenarios some vbuckets are marked for cleanup in
the indexes, temporarily marked as passive, or data is being transferred from
the replica index to the main index (after a failover). While the rows
originated from those vbuckets are never returned to queries, they contribute to
the reduction value of every view btree, and this value is what is used for the
`total_rows` field in map view query responses (it's simply a counter with total
number of Key-Value pairs per view).

Ensuring that `total_rows` always reflected the number of rows originated from
documents in active vbuckets would be very expensive, severely impacting
performance. For example, we would need to maintain a different value in the
btree reductions which would map vbucket IDs to row counts:


```
{"0":56, "1": 2452435, ..., "1023": 432236}
```

This would significantly reduce the btrees branching factor, making them much
more deep, using more disk space and taking more time to compute reductions on
inserts/updates/deletes.

To know if there are vbuckets under cleanup, vbuckets in passive state or
vbuckets being transferred from the replica index to main index (on failover),
one can query the following URL:


```
> curl -s 'http://localhost:9500/_set_view/default/_design/dev_test2/_info' | json_xs
{
   "passive_partitions" : [1, 2, 3],
   "cleanup_partitions" : [],
   "replicas_on_transfer" : [1, 2, 3],
   (....)
}
```

Note that the example above intentionally hides all non-relevant fields. If any
of the fields above is a non-empty list, than `total_rows` for a view may be
higher than expected, that is, we're under one of those expected scenarios
mentioned above. In steady state all of the above fields are empty lists.

<a id="couchbase-views-debugging-btreestats"></a>

## Getting view btree stats for performance and longevity analysis

As of 2.0 build 1667, there is a special (non-public) URI to get statistics for
all the btrees of an index (design document). These statistics are developer
oriented and are useful for analyzing performance and longevity issues. Example:


```
> curl -s 'http://localhost:9500/_set_view/default/_design/test3/_btree_stats' | python -mjson.tool
{
    "id_btree": {
        "avg_elements_per_kp_node": 19.93181818181818,
        "avg_elements_per_kv_node": 75.00750075007501,
        "avg_kp_node_size": 3170.159090909091,
        "avg_kp_node_size_compressed": 454.0511363636364,
        "avg_kv_node_size": 2101.2100210021,
        "avg_kv_node_size_compressed": 884.929492949295,
        "btree_size": 3058201,
        "chunk_threshold": 5120,
        "file_size": 11866307,
        "fragmentation": 74.22786213098988,
        "kp_nodes": 176,
        "kv_count": 250000,
        "kv_nodes": 3333,
        "max_depth": 4,
        "max_elements_per_kp_node": 27,
        "max_elements_per_kv_node": 100,
        "max_kp_node_size": 4294,
        "max_kp_node_size_compressed": 619,
        "max_kv_node_size":,
        "max_kv_node_size_compressed": 1161,
        "max_reduction_size": 133,
        "min_depth": 4,
        "min_elements_per_kp_node": 8,
        "min_elements_per_kv_node": 75,
        "min_kp_node_size":,
        "min_kp_node_size_compressed": 206,
        "min_kv_node_size": 2101,
        "min_kv_node_size_compressed": 849,
        "min_reduction_size": 133
    },
    "view1": {
        "avg_elements_per_kp_node": 17.96416938110749,
        "avg_elements_per_kv_node": 23.99923202457521,
        "avg_kp_node_size": 3127.825732899023,
        "avg_kp_node_size_compressed": 498.3436482084691,
        "avg_kv_node_size": 3024.903235096477,
        "avg_kv_node_size_compressed": 805.7447441681866,
        "btree_size": 8789820,
        "chunk_threshold": 5120,
        "file_size": 11866307,
        "fragmentation": 25.92623804524862,
        "kp_nodes": 614,
        "kv_count": 250000,
        "kv_nodes": 10417,
        "max_depth": 5,
        "max_elements_per_kp_node": 21,
        "max_elements_per_kv_node": 24,
        "max_kp_node_size": 3676,
        "max_kp_node_size_compressed": 606,
        "max_kv_node_size": 3025,
        "max_kv_node_size_compressed": 852,
        "max_reduction_size": 141,
        "min_depth": 5,
        "min_elements_per_kp_node": 2,
        "min_elements_per_kv_node": 16,
        "min_kp_node_size": 357,
        "min_kp_node_size_compressed": 108,
        "min_kv_node_size": 2017,
        "min_kv_node_size_compressed": 577,
        "min_reduction_size": 137
    }
}
```

Note that these statistics are per node, therefore for performance and longevity
analysis, you should query this URI for all nodes in the cluster. Getting these
statistics can take from several seconds to several minutes, depending on the
size of the dataset (it needs to traverse the entire btrees in order to compute
the statistics).

<a id="couchbase-views-debugging-debugstale"></a>

## Debugging stale=false queries for missing/unexpected data

The query parameter `debug=true` can be used to debug queries with `stale=false`
that are not returning all expected data or return unexpected data. This is
particularly useful when clients issue a `stale=false` query right after being
unblocked by a memcached OBSERVE command. An example issue where this happened
is [MB-7161](http://www.couchbase.com/issues/browse/MB-7161).

Here follows an example of how to debug this sort of issues on a simple scenario
where there's only 16 vbuckets (instead of 1024) and 2 nodes. The tools
`couchdb_dump` and `couchdb_info` (from the couchstore git project) are used to
help analyze this type of issues (available under `install/bin` directory).

Querying a view with `debug=true` will add an extra field, named `debug_info` in
the view response. This field has one entry per node in the cluster (if no
errors happened, like down/timed out nodes for example). Example:


```
> curl -s 'http://localhost:9500/default/_design/test/_view/view1?stale=false&limit=5&debug=true' | json_xs
 {
    "debug_info" : {
       "local" : {
          "main_group" : {
             "passive_partitions" : [],
             "wanted_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "wanted_seqs" : {
                "0002" :00,
                "0001" :00,
                "0006" :00,
                "0005" :00,
                "0004" :00,
                "0000" :00,
                "0007" :00,
                "0003" :00
             },
             "indexable_seqs" : {
                "0002" :00,
                "0001" :00,
                "0006" :00,
                "0005" :00,
                "0004" :00,
                "0000" :00,
                "0007" :00,
                "0003" :00
             },
             "cleanup_partitions" : [],
             "stats" : {
                "update_history" : [
                   {
                      "deleted_ids" : 0,
                      "inserted_kvs" :00,
                      "inserted_ids" :00,
                      "deleted_kvs" : 0,
                      "cleanup_kv_count" : 0,
                      "blocked_time" : 0.000258,
                      "indexing_time" : 103.222201
                   }
                ],
                "updater_cleanups" : 0,
                "compaction_history" : [],
                "full_updates" : 1,
                "accesses" : 1,
                "cleanups" : 0,
                "compactions" : 0,
                "partial_updates" : 0,
                "stopped_updates" : 0,
                "cleanup_history" : [],
                "update_errors" : 0,
                "cleanup_stops" : 0
             },
             "active_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "pending_transition" : null,
             "unindexeable_seqs" : {},
             "replica_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "original_active_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "original_passive_partitions" : [],
             "replicas_on_transfer" : []
          }
       },
       "http://10.17.30.98:9501/_view_merge/" :   {
          "main_group" : {
             "passive_partitions" : [],
             "wanted_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "wanted_seqs" : {
                "0008" :00,
                "0009" :00,
                "0011" :00,
                "0012" :00,
                "0015" :00,
                "0013" :00,
                "0014" :00,
                "0010" :00
             },
             "indexable_seqs" : {
                "0008" :00,
                "0009" :00,
                "0011" :00,
                "0012" :00,
                "0015" :00,
                "0013" :00,
                "0014" :00,
                "0010" :00
             },
             "cleanup_partitions" : [],
             "stats" : {
                "update_history" : [
                   {
                      "deleted_ids" : 0,
                      "inserted_kvs" :00,
                      "inserted_ids" :00,
                      "deleted_kvs" : 0,
                      "cleanup_kv_count" : 0,
                      "blocked_time" : 0.000356,
                      "indexing_time" : 103.651148
                   }
                ],
                "updater_cleanups" : 0,
                "compaction_history" : [],
                "full_updates" : 1,
                "accesses" : 1,
                "cleanups" : 0,
                "compactions" : 0,
                "partial_updates" : 0,
                "stopped_updates" : 0,
                "cleanup_history" : [],
                "update_errors" : 0,
                "cleanup_stops" : 0
             },
             "active_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "pending_transition" : null,
             "unindexeable_seqs" : {},
             "replica_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "original_active_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "original_passive_partitions" : [],
             "replicas_on_transfer" : []
          }
       }
    },
    "total_rows" : 1000000,
    "rows" : [
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "orc"
          },
          "id" : "0000014",
          "node" : "http://10.17.30.98:9501/_view_merge/",
          "partition" : 14,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "orc"
          },
          "id" : "0000017",
          "node" : "local",
          "partition" : 1,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "priest",
             "category" : "human"
          },
          "id" : "0000053",
          "node" : "local",
          "partition" : 5,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "priest",
             "category" : "orc"
          },
          "id" : "0000095",
          "node" : "http://10.17.30.98:9501/_view_merge/",
          "partition" : 15,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "elf"
          },
          "id" : "0000151",
          "node" : "local",
          "partition" : 7,
          "key" : 1
       }
    ]
 }
```

For each node, there are 2 particular fields of interest when debugging
`stale=false` queries that apparently miss some data:

 * `wanted_seqs` - This field has an object (dictionary) value where keys are
   vbucket IDs and values are vbucket database sequence numbers (see [Data missing
   in query response or it's wrong (potentially due to server
   issues)](#couchbase-views-debugging-datamissing) for an explanation of sequence
   numbers). This field tells us the sequence number of each vbucket database file
   (at the corresponding node) at the moment the query arrived at the server (all
   these vbuckets are `active vbuckets` ).

 * `indexable_seqs` - This field has an object (dictionary) value where keys are
   vbucket IDs and values are vbucket database sequence numbers. This field tells
   us, for each active vbucket database, up to which sequence the index has
   processed/indexed documents (remember, each vbucket database sequence number is
   associated with 1, and only 1, document).

For queries with `stale=false`, all the sequences in `indexable_seqs` must be
greater or equal then the sequences in `wanted_seqs` - otherwise the
`stale=false` option can be considered broken. What happens behind the scenes
is, at each node, when the query request arrives, the value for `wanted_seqs` is
computed (by asking each active vbucket database for its current sequence
number), and if any sequence is greater than the corresponding entry in
`indexable_seqs` (stored in the index), the client is blocked, the indexer is
started to update the index, the client is unblocked when the indexer finishes
updating the index, and finally the server starts streaming rows to the client -
note that at this point, all sequences in `indexable_seqs` are necessarily
greater or equal then the corresponding sequences in `wanted_sequences`,
otherwise the `stale=false` implementation is broken.

<a id="couchbase-views-debugging-reportingissues"></a>

## What to include in good issue reports (JIRA)

When reporting issues to Couchbase (using
[couchbase.com/issues](http://www.couchbase.com/issues) ), you should always add
the following information to JIRA issues:

 * Environment description (package installation? cluster\_run? build number? OS)

 * All the steps necessary to reproduce (if applicable)

 * Show the full content of all the design documents

 * Describe how your documents are structured (all same structure, different
   structures?)

 * If you generated the data with any tool, mention its name and all the parameters
   given to it (full command line)

 * Show what queries you were doing (include all query parameters, full URL), use
   curl with option -v and show the full output, example:


```
> curl -v 'http://localhost:9500/default/_design/test/_view/view1?limit=10&stale=false'
* About to connect() to localhost port 9500 (#0)
*   Trying ::1... Connection refused
*   Trying 127.0.0.1... connected
* Connected to localhost (127.0.0.1) port 9500 (#0)
> GET /default/_design/test/_view/view1 HTTP/1.1
> User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
> Host: localhost:9500
> Accept: */*
>
< HTTP/1.1 200 OK
< Transfer-Encoding: chunked
< Server: MochiWeb/1.0 (Any of you quaids got a smint?)
< Date: Tue, 21 Aug 2012 14:43:06 GMT
< Content-Type: text/plain;charset=utf-8
< Cache-Control: must-revalidate
<
{"total_rows":2,"rows":[
{"id":"doc1","key":"doc1","value":111111},
{"id":"doc2","key":"doc2","value":222222}
]
}
* Connection #0 to host localhost left intact
* Closing connection #0
```

 * Repeat the query with different values for the stale parameter and show the
   output

 * Attach logs from all nodes in the cluster

 * Try all view related operations, including design document
   creation/update/deletion, from the command line. The goal here to isolate UI
   problems from the view engine.

 * If you suspect the indexer is stuck, blocked, etc, please use curl against the
   `_active_tasks` API to confirm that, the goal again is to isolate UI issues from
   view-engine issues. Example:

    ```
    > curl -s 'http://localhost:9500/_active_tasks' | json_xs
    [
       {
          "indexer_type" : "main",
          "started_on" : 1345645088,
          "progress" : 43,
          "initial_build" : true,
          "updated_on" : 1345645157,
          "total_changes" : 250000,
          "design_documents" : [
             "_design/test"
          ],
          "pid" : "<0.5948.0>",
          "changes_done" : 109383,
          "signature" : "4995c136d926bdaf94fbe183dbf5d5aa",
          "type" : "indexer",
          "set" : "default"
       }
    ]
    ```

Note that the `started_on` and `update_on` fields are UNIX timestamps. There are
tools (even online) and programming language APIs (Perl, Python, etc) to convert
them into human readable form, including date and time. Note that the
`_active_tasks` API contains information per node, so you'll have to query
`_active_tasks` or every node in the cluster to verify if progress is stuck,
etc.

## Beam.smp uses excessive memory
On Linux, if XDCR Max Replications per Bucket are set to a value in the higher limit (such as 128), then beam.sm uses excessive memory. Solution: Reset to 32 or lower.


<a id="couchbase-server-rn"></a>
