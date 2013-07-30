# Indexing and Querying Data

The Couchbase Plug-in for Elasticsearch uses Cross Datacenter Replication (XDCR)
feature in Couchbase Server 2.0. This feature can transmit all documents from a
Couchbase data bucket or server cluster to another cluster. In this case we
transmit documents from Couchbase to Elasticsearch using XDCR and as soon and
these documents have been transmitted, the Elasticsearch engine will index them.
For more information about XDCR in Couchbase Server 2.0, see [Couchbase Server
Manual, Cross Datacenter
Replication](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-xdcr.html)
:

 1. Open Couchbase Web Console and login. This is the administrative user interface
    for Couchbase Server. For more information, see [Couchbase Server
    Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/index.html).

 1. Click on the XDCR tab. Under this tab you can configure and start data
    replication between a source and destination cluster. In this case our source
    cluster is a Couchbase cluster and the destination is Elasticsearch.

 1. Click on Create Cluster Reference.

    A panel will appear where you can specify information for your Elasticsearch
    cluster. This is the Elasticsearch cluster where Couchbase Server will send
    copies of documents from a databucket to be indexed.

 1. Enter a name, hostname, username and password for your Elasticsesarch cluster
    then click Save. Be aware that Elasticsearch will be listening on port 9091
    which is not a standard port for those familiar with Couchbase Server.


    ![](images/create_cluster_ref.png)

    The reference to the new replication will appear in the Remote Clusters list
    under the XDCR Tab.

 1. To set up replication, click Create Replication.

    A panel appears where you can establish replication from your Couchbase cluster
    to Elasticsearch.

 1. Under Replicate changes from: Bucket, choose `beer-sample`.

 1. Under the section To: select ElasticSearch.

 1. For Bucket: enter `beer-sample`. This is actually the Elasticsearch index where
    the data will be sent for indexing.

 1. Finally click Replicate to start replication of documents to Elasticsearch.
    Couchbase Server will begin sending data from the beer-sample bucket to your
    Elasticsearch cluster.


    ![](images/elastic_replicate.png)

    Under the Ongoing Replications section, you will see the replication and status
    of replication.

 1. You can also view the data transfer by clicking the Overview tab of
    Elasticsearch head:


    ![](images/view_replication.png)

    The `docs` field indicates the number of items that have been indexed by
    Elasticsearch. At this point you can begin querying data from Elasticsearch.

    Note that the number of documents displayed by Elasticsearch head may be greater
    than the actual number of documents in Couchbase Server. This is because XDCR
    and the Couchbase Plug-in for Elasticsearch will also send additional documents
    that describe the status of replication and Elasticsearch head will show this
    total number. There is an alternate, more accurate way you can determine the
    true number of documents indexed by Elasticsearch, which excludes extra status
    documents. You can use this method to debug possible data transfer issues
    between Couchbase and Elasticsearch. For more information, see [Monitoring and
    Troubleshooting](#couchbase-elastic-debugging), Compare Document Count.

<a id="couchbase-elastic-querying"></a>

## Querying Data

To issue a query to Elasticsearch, you send a request in the form of a simple
Lucene-based string or you can use the more extensive JSON-based query syntax,
DSL. When you query Elasticsearch, you send it as a REST-ful request using any
REST client, or as a URI in a browser:


```
curl http://localhost:9200/beer-sample/_search?q=blueberry
```

Elasticsearch will return a result set as JSON as follows:


```
{"took":2,
"timed_out":false,
....
        "hits" : 8,
    ....
        {
        ....
        "_index":"beer-sample",
        "_type":"couchbaseDocument",
        "_id":"dark_horse_brewing_co-tres_blueberry_stout",
        "_score":1.8963704,
        "_source": ....
        "
        .....
        "_index":"beer-sample",
        "_type":"couchbaseDocument",
        "_id":"yegua_creek_brewing_dallas-blueberry_blonde",
        "_score":1.2890494,
        "_source": ....
        ....
        }
}
```

For the sake of brevity we show just the first two results out of a result set
containing eight hits. Each item has a "\_score" field which Elasticsearch uses
to indicate the level of relevance for search hits. Notice that `source`
attribute will contain only metadata saved by Elasticsearch rather than the
entire document contents. We do this because Couchbase Server provides
incredibly fast access to the documents. So we use `_id` sent back by
Elasticsearch to retrieve the document out of Couchbase Server. To start we view
the document using Couchbase Web Console:

 1. Copy one of the document IDs returned by Elasticsearch, for instance
    `dark_horse_brewing_co-tres_blueberry_stout`.

 1. Click on the Data Bucket tab in Couchbase Web Console. A table appears with a
    list of all Couchbase Buckets.

 1. Click on the Documents button for the `beer-sample` bucket. A table appears
    which displays all documents in the bucket.

 1. In the Document ID field, paste the document ID
    `dark_horse_brewing_co-tres_blueberry_stout`. The JSON document for that beer
    will appear. You can click on the document name to view the entire JSON
    document:


    ![](images/elastic_get_doc.png)

Elasticsearch supports more complex queries using their REST-API; for instance
you can search the beer database for a style 'lambic' and for 'blueberry' in the
description. In this case you send a HTTP POST request. The JSON request will
appear as follows:


```
{
"query": {
    "query_string": {
            "query_string": {
                "query": "style: lambic AND description: blueberry"
            }
        }
    }
}
```

Here we scope the search so that it looks for 'lambic' in the style field and
'blueberry' in the description and we get this result:


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

Rather than using the web console to retrieve a document, you would typically
use a Couchbase SDK to retrieve the documents the IDs. There are specific
methods and functions available in each SDK to retrieve one or more items based
on the IDs. For more information about reading and writing data from an
application with Couchbase SDKs, see [Couchbase Developer
Guide](http://www.couchbase.com/docs/couchbase-devguide-2.0/accessing-data.html).

For more information about the JSON request and response documents for
Elasticsearch, see [Elastic Search, Search
API](http://www.elasticsearch.org/guide/reference/api/search/request-body.html).

<a id="couchbase-elastic-documents"></a>

## Document Design Considerations

Both Couchbase Server and Elasticsearch enable you to flexibly model data by
using JSON documents to represent your application objects. These documents
generally contain all the information about a data entity, and can be as complex
as you choose. You can use nested data and structures such as arrays and hashes
to provide additional information about your object. You also do not need to
perform schema migrations for JSON documents. Instead you can flexibly write new
data fields or values to represent new information in your documents.

Be aware that Elasticsearch automatically creates a *mapping* which defines what
is searchable in your documents. So how you design your documents for search is
influenced by Elasticsearch mappings. This guide is not intended to be an
exhaustive description on how to model documents for use in Elasticsearch or how
to modifying mapping in Elasticsearch. For more information, see [Elasticsearch
Guide](http://www.elasticsearch.org/guide/) and more specifically [Elasticsearch
Guide, Mapping](http://www.elasticsearch.org/guide/reference/mapping/).

There are a few document design considerations you should have in mind if you
are going to use Couchbase Server with Elasticsearch. For instance, imagine you
have a document to represent a product as follows:


![](images/elastic_model_str.png)

Imagine your inventory system changes and you want to change your product SKU so
that it is an integer. With the flexibility of JSON, you can update the schema
for your product to look like this in Couchbase Server:


![](images/elastic_model_int.png)

By design, there may be some cases where you do not want to update **all** your
products to have integer SKUs. This may be an intentional design choice if your
application logic does not depend on it, or you may want to change your
application logic to handle both string and integer SKUs.

When you use Elasticsearch, it will generate a *default mapping* used to index
items; this mapping describes how particular fields should be indexed. By
default, Elasticsearch builds a mapping based on documents transmitted to it and
it will make assumptions and generalizations about all documents based on the
initial documents it receives. *Each default mapping will assume specific data
types for each field.* Be aware that even though you can change a field type for
a document in Couchbase Server, it can cause problems for Elasticsearch if you
do not also update the default mapping. If you change the field type in
Couchbase Server, Elasticsearch will **not** index the new documents containing
the different field type and you **will not** receive the document ID as a
search query. In this case, because we change the SKU from a string to an
integer, all the products we add to our system with the integer SKU will not be
indexed by Elasticsearch using the default mapping. For more information about
changing a mapping see [Elasticsearch Guide,
Mapping](http://www.elasticsearch.org/guide/reference/mapping/).

To resolve this, whenever you update a document schema you probably want to
update all documents which contain that field. In our example, we update the SKU
field so that all documents have integers for SKUs. Elasticsearch will receive
all updates to existing products and then index them. For more general
information about data modeling for Couchbase Server, see [Couchbase Developer
Guide, Modeling
Data.](http://www.couchbase.com/docs/couchbase-devguide-2.0/modeling-documents.html)

**Understanding Arrays in Elasticsearch**

If you want to store an array of objects in a JSON document, be aware that you
may need to provide your own specific mapping for Elasticsearch in order to
achieve the results you expect from it. For example, imagine you have an object
with two items that appear:


```
{
    "object1" : [
        {
            "name" : "blue",
            "count" : 4
        },
        {
            "name" : "green",
      "count" : 6
     }
    ]
}
```

If you search for a name set to blue and a count greater than 5, you will get
this document in your index, even though the count associated with blue is 4 not
6. This is most likely not what you expected since the two conditions are
satisfied by two different objects in the array. To handle these types of
scenarios, you need to provide your own *nested mapping* for Elasticsearch. For
more information see [Elasticsearch Guide, Nested
Type](http://www.elasticsearch.org/guide/reference/mapping/nested-type.html).

**Enabling Document Expiration**

Time to Live, also known as TTL, is the time until a document expires in
Couchbase Server. By default, all documents will have a TTL of 0, which
indicates the document will be kept indefinitely. When you create your own
application, you can provide specific TTLs such as 30 seconds. As part of normal
maintenance operations, Couchbase Server will periodically remove all items with
expirations that have passed. By default this maintenance process runs every 60
minutes.

Be aware that if you use TTLs in Couchbase Server that this expiration **will
not** be propagated with a document to Elasticsearch. Instead Couchbase Server
will send information about the document deletion when the maintenance process
runs on the 60- minute interval. This may cause some problems because the
document ID can appear in an Elasticsearch index, but the document may no longer
be available from Couchbase Server.

To mitigate this problem, you can manually enable the expiration field used by
Elasticsearch, `_ttl`. When you do this, Couchbase Server can propagate the
document TTL to Elasticsearch, and then Elasticsearch will remove the item from
an index when TTL expires. Because there is some time lag between the servers
during replication, indexing, and maintenance processes, document expiration
will not occur at the same exact time for each server. However if you use this
approach it can help reduce items in an Elasticsearch result set which are no
longer available from Couchbase. To enable this setting, see [Elasticsearch
Guide, TTL
Field](http://www.elasticsearch.org/guide/reference/mapping/ttl-field).

**Learning More About Data Formats**

There are two other final areas and resources you should be aware of as you
model your documents for Elasticsearch:

 * Date Formats: While Elasticsearch enables you represent dates in several
   different manners, it will be easier to manage your system when you store dates
   in the same field and use a single date format. For more information about date
   formats supported by Elasticsearch, see [Elasticsearch Guide, Date
   Formats](http://www.elasticsearch.org/guide/reference/mapping/date-format.html).

 * Geographic Data: Be aware that Elasticsearch has a limited number of formats for
   geographic data. For more information see [Elasticsearch Guide, Geo Point
   Type](http://www.elasticsearch.org/guide/reference/mapping/geo-point-type.html).

<a id="couchbase-elastic-debugging"></a>
