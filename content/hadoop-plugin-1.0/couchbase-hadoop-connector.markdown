<a id="hadoop-plugin"></a>

# Couchbase Hadoop Connector 1.0

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

## Introduction

If you are reading this then you have just downloaded the Couchbase Sqoop
plugin. This plugin allows you to connect to Couchbase server 2.0+ or Membase
Server 1.7.1+ and stream keys into HDFS or Hive for processing with Hadoop. Note
that in this document we will refer to our database as Couchbase, but if you are
using Membase everything will still work correctly. If you have used Sqoop
before for doing imports and exports from other databases then using this plugin
should be straightforward since it uses a similar command line argument
structure.

<a id="hadoop-plugin-installation"></a>
