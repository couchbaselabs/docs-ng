# Using Sqoop

The Couchbase Hadoop Connector can be used with a variety of command line tools
provided by Sqoop. In this section we discuss the usage of each tool.

<a id="hadoop-connector-sqoop-tables"></a>

## Tables

Since Sqoop is built for a relational model it requires that the user
specifies a table to import and export into Couchbase. The Couchbase Hadoop
Connector uses the `--table` option to specify the type of data stream for
importing and exporting into Couchbase.

For exports the user must enter a value for the `--table` option though
what is entered will not be used by the connector.

For imports the table command accepts two values and will exit reporting
errors with invalid input.

 * `DUMP` — Causes all keys currently in Couchbase to be read into HDFS.
    Any data items which are received by the Couchbase cluster while this
    command is running will also be passed along by the connector meaning
    new or changed items are part of the dump.  However, items removed
    while the dump is running will not be removed from the output.

 * `BACKFILL_##` — Streams all key mutations for a given amount of time (in
   minutes).  This is best used to sample a bucket in a cluster for a period of time.

For the `--table` value for the `BACKFILL` table that a time should be put
in place of the brackets. For example `BACKFILL_5` means stream key
mutations in the Couchbase server for 5 minutes and then stop the stream.

<a id="hadoop-connector-sqoop-connection"></a>

## Connect String

A connect string option is required in order to connect to Couchbase. This
can be specified with `--connect` as an argument to the sqoop command.
Below are two examples of connect strings.


```
http://10.2.1.55:8091/pools
http://10.2.1.55:8091/pools,http://10.2.1.56:8091/pools
```

When creating your connect strings simply replace the IP address above with
the hostname or IP address of one or more nodes of your Couchbase Cluster.
If you have multiple servers you can list them in a comma-separated list.

<a id="hadoop-connector-sqoop-connection-buckets"></a>

## Connecting to Different Buckets

By default the Couchbase Hadoop Connector connects to the `default` bucket.
If you want to connect to a bucket other than the default bucket you can
specify the bucket name with the `--username` option. If the bucket has a
password use the `--password` option followed by the password.

<a id="hadoop-connector-sqoop-import"></a>

## Importing

Importing data to your cluster requires the use of the Sqoop import command
followed by the parameters `--connect` and `--table`. Below are some example
imports.


```
shell> sqoop import --connect http://10.2.1.55:8091/pools --table DUMP
```

This will dump all items from Couchbase into HDFS. Since the Couchbase Java
Client has support for a number of different data types, all values are
normalized to strings when being written to a Hadoop text file.


```
shell> sqoop import --connect http://10.2.1.55:8091/pools --table BACKFILL_10
```

This will stream all item mutations from Couchbase into HDFS for a period
of 10 minutes.

Sqoop provides many more options to the import command than we will cover
in this document. Run `sqoop import help` for a list of all options and see
the Sqoop documentation for more details about these options.

Some options which may be important in your import are those that define
what delimiters sqoop will use when writing the records. The default is the
comma (`,`) character.  Through the sqoop command you may specify a
different delimiter if, for instance, it's likely that the item's key or
value may contain a comma.

When the import job executes, it will also generate a `.java` source code
file that can facilitate reading/writing the records imported by other
Hadoop MapReduce jobs.  If, for instance, the job run was a DUMP, sqoop
will generate a `DUMP.java` source code file.

<a id="hadoop-connector-exporting"></a>

## Exporting

Exporting data to your cluster requires the use of the `sqoop export` command
followed by the parameters `--connect`, `--export-dir`, and `--table`.
Below are some example exports.


```
shell> sqoop export --connect http://10.2.1.55:8091/pools --table couchbaseExportJob --export-dir data_for_export
```

This will export all records from the files in the HDFS directory specified
by `--export-dir` into Couchbase.

Sqoop provides many more options to the export command than we will cover
in this document. Run `sqoop export help` for a list of all options and see
the Sqoop documentation for more details about these options.

Some options which may be important in your export are those that define
what delimiters sqoop will use when reading the records from the Hadoop
text file to export to Couchbase. The default is the comma (`,`) character.
Through the sqoop command you may specify a different delimiter.

When the export job executes, it will also generate a `.java` source code
file that will show how the data was read.  If, for instance, the job run
had the argument `--table couchbaseExportJob`, sqoop will generate a
`couchbaseExportJob.java` source code file.

<a id="hadoop-connector-sqoop-listtable"></a>

## List table

Sqoop has a tool called list tables. As noted in previous sections,
Couchbase does not have a notion of tables, but we use `DUMP` and
`BACKFILL_##` as values to the `--table` option.

Since there is no real purpose to the list-tables command in the case of
the Couchbase Hadoop Connector, it is not recommended you use this argument
to sqoop.

<a id="hadoop-connector-sqoop-importall"></a>

## Import All Tables

Sqoop has a tool called `import-all-tables`. As noted in previous sections,
Couchbase does not have a notion of tables.

Since there is no real purpose to the `import-all-tables` command in the
case of the Couchbase Hadoop Connector, it is not recommended you use this
argument to sqoop.

<a id="hadoop-connector-limitations"></a>

## Limitations

While Couchbase provides many great features to import and export data from
Couchbase to Hadoop there is some functionality that the connector doesn't
implement in sqoop. These are the known limitations:

 * Querying: You cannot run queries on Couchbase. All tools that attempt to do this
   will fail with a NotSupportedException. Querying will be added to future Couchbase
   products designed to integrate with Hadoop.

 * list-databases tool: Even though Couchbase is a multi-tenant system that allows
   for multiple buckets (which are analogous to databases) here is no way of listing these buckets from sqoop.  The list
   of buckets is available through the Couchbase Cluster web console.

 * eval-sql tool: Couchbase does not use SQL, so this tool is not appropriate.

One other known limitation at this time is that the Couchbase Hadoop
Connector does not automatically handle some classes of failures in a
Couchbase cluster or changes to cluster topology while the sqoop task is
being run.
