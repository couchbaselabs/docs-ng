# Couchbase Plug-in for Elasticsearch

<div class="notebox warning">
<p>Older Documentation</p>
<p>You are reading the documentation for an older version of this software. To find the documentation for the current version, please go to the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

The Couchbase Plug-in for Elasticsearch enables you to provide full-text search
in your application using the open source search engine,
[Elasticsearch](http://www.elasticsearch.org/). This means that your users can
retrieve application documents from Couchbase Server based on text in your
documents. For instance if you provide a product catalog, users can find items
based on text descriptions of the products.

You use Couchbase Server with Elasticsearch to provide quality, rapid full-text
search results. The data model for Elasticsearch is already very compatible with
the schema-free, [document-oriented
model](http://docs.couchbase.com)
used by Couchbase Server. Since search is often a more CPU-intensive process,
you can scale your Elasticsearch cluster separately from your Couchbase cluster
to best meet the demands of your users. In doing so, search functions will not
slow the performance of Couchbase Server reads or writes.

This guide is not meant to be an exhaustive manual on Elasticsearch or Couchbase
Server topics, however you may find the following related sources useful if you
want to know more about these two solutions:

 * [Couchbase Server
   Manual](http://docs.couchbase.com) : covers
   installation, operations, monitoring, views, xdcr, tools, and trouble-shooting for the
   server.

 * [Elasticsearch](http://www.elasticsearch.org/) : the definitive site for
   downloads, documentation, blogs and tutorials on Elasticsearch.

 * [Couchbase SDKs](http://www.couchbase.com/develop) : describes installation and
   use of Couchbase SDKs from your web application.


<a id="couchbase-elastic-intro"></a>

## How the Plug-In Works

The Couchbase Plug-in for Elasticsearch continuously streams data between
Couchbase Server and Elasticsearch. Any document changes made in Couchbase
Server will be sent to Elasticsearch via the plugin which insures your search
index contains the most current items in your system. The plug-in enables the
following:

 * Provides Real-Time Replication. The plug-in continuously transfers data to the
   search cluster after Couchbase Server writes the data to disk; it will help keep
   your search index on Elasticsearch current with the information in Couchbase
   Server.

 * Topology Aware. Using the plug-in, the system can handle node failures within a
   Couchbase cluster or Elasticsearch cluster and adapt accordingly. Replication
   from a Couchbase cluster will continue from functioning nodes and the items will
   be sent to available servers in the Elasticsearch cluster.

 * Recovery from Network Failure. The plug-in is aware of what data has already
   been replicated from Couchbase what data still needs to be replicated. If a
   network failure interrupts data transfer from a Couchbase cluster, once the
   network issue has been resolved, replication can resume for remaining data.

If you are already building applications with Couchbase Server, you are probably
aware of using views 
to index and query data from the server. You use this functionality to find,
retrieve, and sort data based on document metadata and specified document
attributes. For instance you could use views to retrieve all beer documents
where the alcohol percentage is greater than 8%. Or you could use views to
calculate the average alcohol percentage of all beers in an application.
Providing full-text search for Couchbase documents with Elasticsearch
complements this functionality by enabling you to provide text-based search
results. The following shows the different elements in a system using Couchbase
Server and Elasticsearch:


![](images/elastic_components.png)

Your website or web application interacts with Couchbase Server via a [Couchbase
SDK](http://www.couchbase.com/develop). These SDKs are provided in a variety of
popular web programming languages and are responsible for establishing a
connection with the server and for communicating reads/writes and other
functions with the server. As mentioned earlier you can also index and query
data from Couchbase Server using views and your Couchbase SDK.

To provide full-text search with Couchbase Server you need to have a cluster of
Elasticsearch engines, the Couchbase Plug-in for Elasticsearch, and a running
Couchbase cluster. After an application writes or updates data in Couchbase
Server, the server replicates a copy of that data to the Elasticsearch cluster
for indexing. The Elasticsearch cluster will perform indexing based on text
content in your data; then via an Elasticsearch client, you send a search query
to Elasticsearch via HTTP. Elasticsearch does not keep an entire copy of each
item replicated from Couchbase cluster. After Elasticsearch indexes an item it
keeps the ID for the item and other metadata, but discards the content to remain
efficient. After your application queries Elasticsearch for an item via HTTP, it
will send back document IDs which you can use to retrieve the entire document
from Couchbase Server.

<a id="couchbase-elastic-example-querying"></a>

## How Querying Works

Using Couchbase Server with Elasticsearch, users can actually perform searches
based on rich text content within a document, such as information in text
descriptions. Imagine a user wants to find a beer that has a nice fruity flavor
reminiscent of blueberries. Your application can take in a query string as a web
form parameter and send the query to Elasticsearch as JSON containing the term
'blueberry'. Your application would send a query via HTTP to Elasticsearch as
follows:


```
GET http://127.0.0.1:9200/beer-sample/_search?q=blueberry
```

Elasticsearch responds by sending the document ID for this beer document in a
JSON array. The array will contain elements with document IDs for those
documents which match the query parameter:


```
....
"hits" : [{
    ....
    "_source": {
        "meta" : {
            "id": "110ac410b16h"
            .....
        }
    }
}....
```

For purposes of brevity we omit other details from the JSON response. The "id"
field in the response is the ID you use to retrieve a document from Couchbase
Server. With this ID, we can retrieve a document from Couchbase for the beer
document with a blueberry aroma in the text description:


```
{
    "name" : "Wild Blueberry Lager",
    "abv" : 8,
    "brewery_id" : "110f01",
    "description" : "....blueberry aroma....",
    "style" : "Belgian Fruity Lambic"
    ....
}
```

With Elasticsearch you can use text search queries, you can also provide logic
and regular expressions to describe search criterion. The rest of this guide
will show you how you can implement full text search using Couchbase Server, the
Couchbase Plug-in and Elasticsearch.

<a id="couchbase-elastic-install-config"></a>
