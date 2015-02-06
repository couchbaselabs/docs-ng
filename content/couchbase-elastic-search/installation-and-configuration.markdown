# Installation and Configuration

Before you can work with Couchbase and Elasticsearch, you need to set up
Couchbase Plug-in for Elasticsearch, a Couchbase 2.0 or later cluster, and an
Elasticsearch cluster. After you install the clusters, start them. The Couchbase cluster stores any items from your application and sends replicas
of these items to the Elasticsearch cluster for indexing. Your Couchbase cluster
can contain one or more instances of Couchbase server, and your Elasticsearch
cluster can contain one or more instances of the search engine. For more
information about setting up and using these components, see the
following links:

 * [Couchbase Plug-in for
   Elasticsearch](https://github.com/couchbaselabs/elasticsearch-transport-couchbase). **Be aware that the Couchbase plug-in v1.3.0 is compatible only with Elasticsearch 1.0.1**.

 * [Couchbase Server
   requirements](http://docs.couchbase.com/couchbase-manual-2.5/cb-install/#getting-started). This topic describes supported platforms, hardware requirements, software requirements, and network settings.

 * [Couchbase Server
   installation](http://docs.couchbase.com/couchbase-manual-2.5/cb-install/). Couchbase Server comes with an easy-to-use installer, however you may want further information about platform-specific installation steps.

 * [Elasticsearch
   installation](http://www.elasticsearch.org/guide/reference/setup/installation.html).
   installation instructions and system prerequisites for Elasticsearch. **Be aware
   that the Couchbase Plug-in 1.3.0 for Elasticsearch is only compatibility
   with Elasticsearch 1.0.1**. See the release notes for Couchbase plug-ins that are compatible with earlier versions of Elasticsearch.

For now you probably need only one instance of Couchbase Server running in
a cluster and one instance of the Elasticsearch engine. Later as you test your
integration under load and deploy your implementation, you will need to add more
servers to handle the workload. At this phase, the most important point about
the Couchbase Server installation is to make sure that you include the beer-sample
data, which is available as an installation option. The examples in this guide build on data contained in the sample database. For more information about using
sample buckets, see [Couchbase Web Console, Installing Sample
Buckets](http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#installing-sample-buckets).

<a id="couchbase-elastic-plugin-install"></a>

## Installing the Plug-ins

To enable full-text search of data in Couchbase, you transmit data from a
Couchbase cluster to an Elasticsearch cluster where it will be indexed by
Elasticsearch. The Couchbase Plug-in for Elasticsearch helps transmit data from
Couchbase using a protocol understood by Elasticsearch. The plug-in ensures that
information from Couchbase can be mapped and converted into data which
Elasticsearch will index and query.

This plug-in is compatible only with Elasticsearch
1.0.1 and with Couchbase Server 2.5.1 and earlier and  and earlier. For more information about the administrative tool for
Elasticsearch, see [Elasticsearch
head.](http://mobz.github.com/elasticsearch-head/) For more information about
setting up Elasticsearch, see [Elasticsearch
Install](http://www.elasticsearch.org/guide/reference/setup/installation.html)

 1. Go to your installation directory for Elasticsearch:

     ```
     cd elasticsearch-<version>
     ```

 1. Install the Couchbase Plug-in. Replace the version number with the appropriate one.

```
bin/plugin -install transport-couchbase -url \
http://packages.couchbase.com.s3.amazonaws.com/releases/elastic-search-adapter/1.3.0/elasticsearch-transport-couchbase-1.3.0.zip
```

After a successful installation, the plug-in installer returns:

```
DONE Installed transport-couchbase
```

 1. Set the username and password for the plug-in:

     ```
     echo "couchbase.password: password" >> config/elasticsearch.yml ;
     echo "couchbase.username: Administrator" >> config/elasticsearch.yml
```

 1. The other plug-in to install is a third party plug-in for Elasticsearch called
    `head` ; this plug-in provides a simple web user interface you can use to
    interact with Elasticsearch:

     ```
     bin/plugin -install mobz/elasticsearch-head
     ```

 1. After you are done installing the two plug-ins, you can start Elasticsearch:

     ```
     bin/elasticsearch
     ```

    Elasticsearch will start and run on your machine in the background.

 1. You can open the administrative client for Elasticsearch by going to this URL in
    a browser `http://localhost:9200/_plugin/head/`. The following screen with a
    randomized name will appear:


    ![](images/elastic_head.png)

At this point you have the Couchbase Plug-in for Elasticsearch and the
Elasticsearch engine installed and running. You can now set up the index
templates for Elasticsearch and set up Couchbase Server to send data to
Elasticsearch.

<a id="couchbase-elastic-configurations"></a>

## Updating Configurations

After installation you are now ready to transfer data from Couchbase Server to
Elasticsearch and begin indexing the data. In Elasticsearch you will create an
index template to define the scope of indexing and searching. In Couchbase
Server, you will change the default setting for replication so that the timing
and performance will work with Elasticsearch clusters.

 1. We need to provide an index template that Elasticsearch will use on information
    from Couchbase. The one we use below is an example provided as part of the
    Couchbase Plug-in for Elasticsearch:

     ```
     shell>    curl -XPUT http://localhost:9200/_template/couchbase \
     -d @plugins/transport-couchbase/couchbase_template.json
     ```

    You can also provide your own index template in the future. If you provide more
    than one template, you can maintain multiple indexes that can be individually
    updated. Upon success, Elasticsearch returns:

     ```
     {"ok":true,"acknowledged":true}
     ```

 1. For each Couchbase data bucket that we want to search, we create an empty index
    in Elasticsearch:

     ```
     shell>    curl -XPUT http://localhost:9200/beer-sample
     ```

    In this case we name our index `beer-sample`. Upon success Elasticsearch returns
    the following:

     ```
     {"ok":true,"acknowledged":true}
     ```

 1. Provide this setting to Elasticsearch to change the number of concurrent
    requests it will handle:

     ```
     shell>echo "couchbase.maxConcurrentRequests: 1024" >> config/elasticsearch.yml
     ```

 1. Stop and restart Elasticsearch for your changes to take effect.

 1. Change the number of concurrent replicators in Couchbase Server from 32 to 8:

     ```
     shell> curl -X POST -u Administrator:password1  \
     http://10.4.2.4:8091/internalSettings  \
     -d xdcrMaxConcurrentReps=8
     ```

    When Couchbase Server successfully updates this setting, it will send a response
    as follows:

     ```
     HTTP/1.1 200 OK
     Server: Couchbase Server 2.0.0-1941-rel-community
     Pragma: no-cache
     Date: Wed, 28 Nov 2012 18:20:22 GMT
     Content-Type: application/json
     Content-Length: 188
     Cache-Control: no-cache
     ```

    One of the issues that can occur when an Elasticsearch node is overwhelmed by
    replication from Couchbase is that the node can fail. If this does occur, you
    may also experience errors from remaining nodes.

    For more information about this XDCR parameter, see [Couchbase Server Manual,
    Changing Internal XDCR
    Settings](http://docs.couchbase.com/couchbase-manual-2.5/cb-rest-api/#changing-internal-xdcr-settings).

<a id="couchbase-elastic-indexing"></a>
