<a id="hadoop-plugin"></a>

# CouchSqoop: A Couchbase Plugin for Sqoop

<a id="hadoop-plugin-preface"></a>

## Introduction

If you are reading this then you have just downloaded the Couchbase Sqoop
plugin. This plugin allows you to connect to Couchbase Server 2.0 or higher or
Membase Server 1.7.1+ and stream keys into HDFS or Hive for processing with
Hadoop. Note that in this document we will refer to our database as Couchbase,
but if you are using Membase everything will still work correctly. If you have
used Sqoop before for doing imports and exports from other databases then using
this plugin should be straightforward since it uses a similar command line
argument structure.

<a id="hadoop-plugin-installation"></a>
