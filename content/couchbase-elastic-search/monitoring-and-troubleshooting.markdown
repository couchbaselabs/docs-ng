# Monitoring and Troubleshooting

The most common problems you may need to troubleshoot include:

 * [Data fails to
   transfer](http://www.couchbase.com/docs/couchbase-elasticsearch/couchbase-elastic-transfer-fail.html),
   and

 * [Data did not get
   indexed](http://www.couchbase.com/docs/couchbase-elasticsearch/couchbase-elastic-index-fail.html).

The following sections describe some of the causes of these issues and provides
steps you can follow to resolve these problems. There are a few tasks you can
perform to monitor the progress of Couchbase Plug-in for Elasticsearch. These
tasks will help you determine if data is successfully transferred and indexed.
It will help insure you resolve the most common problems that occur using the
plug-in:

 * **Check Outbound XDCR Operations**

   In Couchbase Web Console under Data Buckets, Click | Bucket-name | Outbound XDCR
   to view information about data replication via XDCR to Elasticsearch. The
   statistics in this section will indicate the rate of data transfer between
   Couchbase Server and Elasticsearch. For more information about monitoring XDCR,
   see [Couchbase Server, Manual, Monitoring
   Replication](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-tasks-xdcr-monitoring.html).

 * **Check Couchbase Plug-in for Elasticsearch Log files**

   The plug-in logs to the same directory and file that Elasticsearch uses at the
   root of a Elasticsearch node. For production systems the log is at
   `/var/log/elasticsearch.`

 * **Compare Document Count**

   You can compare the number of documents in Couchbase Server with the number of
   documents in your Elasticsearch cluster. Be aware that this assumes your
   Couchbase Server has a static number of items, for instance your cluster is in a
   test environment where the number of documents is set and you do not add more
   during replication. In Couchbase Web Console, click on Data Buckets. The number
   of documents for a named bucket appears under `Item Count` :


   ![](images/elastic_montor_xdcr.png)

   In this example we have 7303 items. Then we get the number of documents indexed
   by Elasticsearch:

    ```
    curl http://[elasticsearch_host]:9200/[index-name]/couchbaseDocument/_count
    ```

   Upon success, you get the following result:

    ```
    {"count":7303,"_shards":
        {
        "total":5,"successful":5,"failed":0
        }
    }
    ```

   So the `count` result is the same number as the number of items from Couchbase
   Web Console; this provides assurance that all items from Couchbase are
   transferred and indexed.

<a id="couchbase-elastic-transfer-fail"></a>

## Handling Data Transfer Issues

If you notice issues during data transfer from Couchbase Server to
Elasticsearch, follow these steps and validate the following:

 1. **Check your Elasticsearch version**

    The most common problem you can encounter with Couchbase-Elasticsearch
    integration is that data fails to transfer due to an incompatible Elasticsearch
    version. Elasticsearch has evolved between versions and Couchbase Plugin for
    Elasticsearch has been specifically designed a tested for a particular version.
    If you use a higher version or lower version, it will result in failure to
    transfer data. If you have an incompatible version of the plug, you might see
    this message:

     ```
     Attention - Failed to grab remote bucket info from any of known nodes
     ```

    And if you check the Elasticsearch head console, you will find a stack trace
    similar to this:

     ```
     [2012-12-19 05:50:41,758][WARN ][org.eclipse.jetty.servlet.ServletHandler] Error for /pools/default/buckets
     java.lang.NoSuchMethodError:
     ....
     ```

    If you get this error make sure you are using the plug-in with the correct
    version of Elasticsearch.

 1. **Check destination cluster references**

    The second most common error that occurs is when you create a cluster reference
    in Couchbase Web Console then at a later time create and start the replication.
    After you create a reference to your Elasticsearch cluster, the IP address may
    change, especially if you are using Elasticsearch on a laptop. In this case you
    will get this error under XDCR | Ongoing Replications | Status:


    ![](images/elastic_xdcr_ref_fail.png)

    To resolve this error, check your remote Elasticsearch reference in XDCR and
    make sure the IP address is correct.

<a id="couchbase-elastic-index-fail"></a>

## Handling Indexing Issues

If you encounter issues with indexing, such as failure to index items from
Couchbase, or unexpected items in your search results, try to check the
following items and performing the described fixes:

 * **Change Settings for Initial Indexing**

   If you have an existing Couchbase data bucket with a large number of documents
   already in production, these documents will be transferred to Elasticsearch in
   bulk. Typically this works with Elasticsearch default settings, however there
   are some Elasticsearch settings you can change so that indexing quickly
   completes.

   You use the Elasticsearch `refresh_interval` setting to indicate how frequently
   the engine provides newly indexed items. During an initial bulk load of
   documents from Couchbase, you can reduce access to newly indexed items in
   exchange for overall faster indexing time. For more information about enabling
   and disabling this setting, see [Elasticsearch Guide, Indices
   Update](http://www.elasticsearch.org/guide/reference/api/admin-indices-update-settings).

 * **Check Elasticsearch mappings**

   When you send documents to Elasticsearch it will automatically generate a
   mapping that contains rules for indexing fields. You can also provide your own
   mapping or update this mapping. Be aware that this default mapping from
   Elasticsearch includes assumptions about data types and data structures in your
   documents. Based on these assumptions, Elasticsearch may omit your document from
   the index. For instance, objects within an array may not be indexed as you
   expect.

   For more information and potential fixes see [Document Design
   Considerations](couchbase-elasticguide-ready.html#couchbase-elastic-documents).
   For general information about expected data structures for Elasticsearch see
   [Elasticsearch, Mapping,
   Types](http://www.elasticsearch.org/guide/reference/mapping/) and related
   sections.

 * **Check your documents**

   Validate your documents as well-formed JSON. The Couchbase Plug-in for
   Elasticsearch will take any items that are binary data and will log an error
   message. Elastic search cannot index documents which are not valid JSON, for
   instances.jpgs and other forms of binary data cannot be indexed by
   Elasticsearch.

   If you change a field type for your documents after Elasticsearch has indexed,
   it may omit your document from the index. For more information on how to resolve
   this issue by updating your documents, see [Document Design
   Considerations](couchbase-elasticguide-ready.html#couchbase-elastic-documents)

<a id="couchbase-elastic-performance-mgmt"></a>

## Managing Performance

There are few areas you can adjust which will impact your system performance
with Couchbase and Elasticsearch:

 * **Disable Fields from Indexing**.

   When any search engine has to index large blocks of data, the process is more
   CPU intensive than smaller blocks of data. So if you have objects with large
   amounts of text that are not important for search results, you can provide a
   custom mapping and omit those fields from indexing using the setting `enabled`.
   For more detailed information, see [Elastic Search Guide, Object
   Type](http://www.elasticsearch.org/guide/reference/mapping/object-type.html).

 * **Add Elasticsearch Nodes**.

   If your Couchbase Server cluster experiences a backlog of items in the
   replication queue, you may want to consider adding additional Elasticsearch
   nodes. This should increase how quickly items can be indexed by the search
   engine.

 * **Adjusting Concurrent Replication**

   If you are running your Couchbase cluster and Elasticsearch cluster on hardware
   with high-performance CPUs, you can increase this setting to improve replication
   speed between the two clusters. In the case of Elasticsearch, there are also
   scenarios where you may want to decrease this setting from the default so you do
   not overwhelm an Elasticsearch node. This is discussed below; for more
   information about this XDCR parameter, see [Couchbase Server Manual, Changing
   Internal XDCR
   Settings](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-xdcr-change-settings.html).

   One of the key parameters you can use to adjust XDCR performance is
   `xdcrMaxConcurrentReps` ; this will increase or decrease the maximum concurrent
   replication by a Couchbase node. The default number of concurrent replications
   via XDCR is 32. For instance, if you have five nodes in a Couchbase cluster and
   you have one Elasticsearch node, Couchbase Server can generate up to 160
   concurrent replications targeting the single Elasticsearch node. Each
   replication can require multiple TCP connections and both the concurrent
   replications and the number of connections may overwhelm the Elasticsearch node.
   If this does occur you can see the following types of errors in Couchbase Web
   Console | XDCR | Ongoing XDCR section:

    ```
    Error replicating vbucket 7:
    {badmatch, {error,all_nodes_failed,
    <<"Failed to grab remote bucket info from any of known nodes">>}}

    Error replicating vbucket 7:
    {error,{error,timeout}}}
    ```

   This means that Couchbase Server cannot communicate with Elasticsearch in the
   time that it expects. Couchbase Server can recover from these types of errors
   and retry replication, however your replication may take longer to complete or
   operate with higher latency because the operations must be later retried. If you
   encounter this scenario, you should lower the default `xdcrMaxConcurrentReps`
   setting to 8 or less so that the total number of concurrent replications can be
   handled by your Elasticsearch node. For more information on changing this
   setting, see [Couchbase Server Manual, Changing Internal XDCR
   Settings](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-xdcr-change-settings.html).

<a id="couchbase-elastic-advanced-options"></a>

## Advanced Settings and Features

The Couchbase Plug-in for Elasticsearch has several settings in a YAML file that
you can update. In the beginning you will probably only update the username and
password for the plug-in. Later you may want to change these additional
settings:

 * couchbase.port: the port the plug-in will listen on. Default is 9091.

 * couchbase.username: the username for HTTP basic authentication. Default is
   Administrator.

 * couchbase.password: the password for HTTP basic authentication. No default
   established.

 * couchbase.defaultDocumentType: the type of documents stored in Elasticsearch.
   These documents contain indexing information from Elasticsearch. Defaults to
   `couchbaseDocument`. You can change this if you define and implement your own
   document type which provides specialized Elasticsearch search features. For more
   information, see [Elasticsearch Guide, Index
   API](http://www.elasticsearch.org/guide/reference/api/index_.html)

 * couchbase.checkpointDocumentType: type of document which stores status
   information about replication. Default is `couchbaseCheckpoint`.

 * couchbase.num\_vbuckets: number of data partitions Elasticsearch should specify
   to Couchbase Server. Default corresponds to the number of partitions expected by
   Couchbase Server and that exist on the source Couchbase cluster. For Mac OSX,
   the value is 64, and for all other platforms it is 1024.

**Understanding Metadata**

As you get more advanced in your usage of Couchbase Plug-in for Elasticsearch,
it might be helpful for you to understand what is actually sent via the plug-in
and how Elasticsearch uses it. When you send a JSON document to Couchbase Server
to store, it looks similar to the following:


```
{
   "name": "Green Monsta Ale",
   "abv": 7.3,
   "ibu": 0,
   "srm": 0,
   "upc": 0,
   "type": "beer",
   "brewery_id": "wachusetts_brewing_company",
   "updated": "2010-07-22 20:00:20",
   "description": "A BIG PALE ALE with an awsome balance of Belgian malts with Fuggles and East Kent Golding hops.",
   "style": "American-Style Strong Pale Ale",
   "category": "North American Ale"
}
```

Here we have a JSON document with all the information for a beer in our
application. When Couchbase stores this document, it adds metadata about the
document so that we now have JSON in Couchbase that looks like this:


```
{
    {
   "id": "wachusetts_brewing_company-green_monsta_ale",
   "rev": "1-00000005ce01e6210000000000000000",
   "expiration": 0,
   "flags": 0,
   "type": "json"
    }
    {
       "name": "Green Monsta Ale",
       "abv": 7.3,
       "ibu": 0,
       "srm": 0,
       "upc": 0,
       "type": "beer",
       "brewery_id": "wachusetts_brewing_company",
       "updated": "2010-07-22 20:00:20",
       "description": "A BIG PALE ALE with an awsome balance of Belgian malts with Fuggles and East Kent Golding hops.",
       "style": "American-Style Strong Pale Ale",
       "category": "North American Ale"
    }
}
```

The metadata that Couchbase Server stores with our beer document contains the
key for the document, an internal revision number, expiration, flags and the
type of document. When Couchbase Server replicates data to Elasticsearch via the
plug-in, it sends this entire JSON including the metadata. Elasticsearch will
then index the document and will store the following JSON with document
metadata:


```
{
  "id": "wachusetts_brewing_company-green_monsta_ale",
  "rev": "1-00000005ce01e6210000000000000000",
  "expiration": 0,
  "flags": 0,
  "type": "json"
}
```

And finally when you query Elasticsearch and get a result set, it will contain
the document metadata only:


```
{
    took: 22
    timed_out: false
    _shards: {
    total: 5
    successful: 5
    failed: 0
},
    hits: {
    total: 1
    max_score: 0.18642133
    hits: [
        {
        _index: beer-sample
        _type: couchbaseDocument
        _id: wachusetts_brewing_company-green_monsta_ale
        _score: 0.18642133
            _source: {
                meta: {
                    id: wachusetts_brewing_company-green_monsta_ale
                    rev: 1-00000005ce01e6210000000000000000
                    flags: 0
                    expiration: 0
                    }
                }
            }
        ]
    }
}
```

<a id="couchbase-elasticsearch-resources"></a>

## Learning More

If you want to learn more about full-text search for Couchbase Server, here are
some additional resources:

 * [Couchbase Plug-in for ElasticSearch on
   Github](https://github.com/couchbaselabs/elasticsearch-transport-couchbase).

 * [Couchconf
   Presentation](http://www.couchbase.com/presentations/couchbase-full-text-search-integration)
   on Full Text Search Integration.

 * [The Learning
   Portal](http://blog.couchbase.com/creating-content-store-couchbase-learning-portal)
   a proof-of-concept application which demonstrates Couchbase and Elasticsearch
   together. The full source is also available on GitHub at [Couchbaselabs,
   Learning Portal](https://github.com/couchbaselabs/learningportal/).

 * [Blog post and tutorial on Elasticsearch with
   Couchbase](http://blog.couchbase.com/couchbase-and-full-text-search-couchbase-transport-elastic-search),
   from Couchbaselabs.

 * [Elasticsearch Guide](http://www.elasticsearch.org/guide/), which is
   particularly useful for developing more advanced queries, indexing a field more
   than one way, and to provide custom mappings which influence your search
   results.

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.