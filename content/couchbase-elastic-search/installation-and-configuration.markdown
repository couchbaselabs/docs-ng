# Installation and Configuration

Before you can work with Couchbase and Elasticsearch, you will need to set up
Couchbase Plug-in for Elasticsearch, Couchbase 2.0 cluster and an Elasticsearch
cluster. After you install the two different clusters, start them. The Couchbase
cluster will store any items from your application, and will send replicas of
these items to the Elasticsearch cluster for indexing. Your Couchbase cluster
can contain one or more instances of Couchbase server, and your Elasticsearch
cluster can contain one or more instances of the search engine. For more
information about setting up and using these two components, check the
following:

 * [Couchbase Plug-in for
   Elasticsearch](https://github.com/couchbaselabs/elasticsearch-transport-couchbase)
   : be aware that this plug-in is compatible with **Elasticsearch 0.20**

 * [Couchbase Server
   Requirements](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-getting-started-prepare.html)
   : describes supported platforms, hardware requirements, software requirements,
   and network settings.

 * [Couchbase Server
   Install](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-getting-started-install.html)
   : the server comes with an easy-to-use installer, however you may want further
   information about platform-specific installation steps.

 * [Elasticsearch
   Install](http://www.elasticsearch.org/guide/reference/setup/installation.html) :
   installation instructions and system prerequisites for Elasticsearch. **Be aware
   that the Couchbase Plug-in for Elasticsearch has been tested for compatibility
   with Elasticsearch 0.20.**

For now you will probably only need one instance of Couchbase Server running in
a cluster and one instance of the Elasticsearch engine. Later as you test your
integration under load and deploy your implementation, you will need to add more
servers to handle the workload. At this phase, the most important point about
the Couchbase Server install is to *make sure that you include the beer-sample
data which is included as an option in the install.* The examples in this guide
will build on data contained in the sample. For more information about using
sample buckets, see [Couchbase Web Console, Installing Sample
Buckets](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console-settings-samplebuckets.html).

<a id="couchbase-elastic-plugin-install"></a>

## Installing the Plug-ins

To enable full-text search of data in Couchbase, you transmit data from a
Couchbase cluster to an Elasticsearch cluster where it will be indexed by
Elasticsearch. The Couchbase Plug-in for Elasticsearch helps transmit data from
Couchbase using a protocol understood by Elasticsearch. The plug-in ensures that
information from Couchbase can be mapped and converted into data which
Elasticsearch will index and query.

This plug-in is compatible with Couchbase Server 2.0 and Elasticsearch 0.20. For
more information about the administrative tool for Elasticsearch, see
[Elasticsearch head.](http://mobz.github.com/elasticsearch-head/) For more
information about setting up Elasticsearch, see [Elasticsearch
Install](http://www.elasticsearch.org/guide/reference/setup/installation.html)

 1. Go to your install directory for Elasticsearch:

     ```
     cd elasticsearch-0.19.9
     ```

 1. Install the Couchbase Plug-in:

     ```
     bin/plugin -install couchbaselabs/elasticsearch-transport-couchbase/1.0.0-dp
     ```

    After a successful install, the plugin installer returns:

     ```
     DONE Installed transport-couchbase
     ```

 1. Set the username and password for the plug-in:

     ```
     echo "couchbase.password: password" >> config/elasticsearch.yml
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
    Settings](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-xdcr-change-settings.html).

<a id="couchbase-elastic-indexing"></a>
