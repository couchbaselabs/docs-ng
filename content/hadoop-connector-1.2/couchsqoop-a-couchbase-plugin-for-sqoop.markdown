<a id="hadoop-connector"></a>

# Couchbase Hadoop Connector 1.2

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

## Introduction

The Couchbase Hadoop connector allows you to connect to Couchbase Server 2.5 or 3.0 to
stream keys into HDFS or Hive for processing with Hadoop. If you have used
Sqoop before with other databases then using this connector should be
straightforward since it uses a similar command line argument structure.
Some arguments will seem slightly different as Couchbase has a very
different structure than a typical RDBMS.

<a id="hadoop-plugin-installation"></a>
