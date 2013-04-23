# Using Sqoop

The Couchbase Sqoop Plugin can be used with a variety of command line tools that
are provided by Sqoop. In this section we discuss the usage of each tool.

<a id="hadoop-plugin-sqoop-tables"></a>

## Tables

Since Sqoop is built for a relational model it requires that the user specifies
a table to import and export into Couchbase. The Couchbase plugin uses the
`--table` option to specify the type of tap stream for importing and exporting
into Couchbase. For exports the user must enter a value for the `--table` option
even though what is entered will not actually be used by the plugin. For imports
the table command can take on only two values.

 * `DUMP` — Causes all keys currently in Couchbase to be read into HDFS.

 * `BACKFILL_##` — Streams all key mutations for a given amount of time (in
   minutes).

For the `--table` value for the `BACKFILL` table that a time should be put in
place of the brackets. For example `BACKFILL_5` means stream key mutations in
the Couchbase server for 5 minutes and then stop the stream.

For exports a value for `--table` is required, but the value will not be used.
Any value used for the `--table` option when doing export will be ignored by the
Couchbase plugin.

<a id="hadoop-plugin-sqoop-connection"></a>

## Connect String

A connect string option is required in order to connect to Couchbase. This can
be specified with `--connect` on the command line. Below are two examples of
connect strings.


```
http://10.2.1.55:8091/pools
http://10.2.1.55:8091/pools,http://10.2.1.56:8091/pools
```

When creating your connect strings simply replace the IP address above with the
IP address of your Couchbase sever. If you have multiple servers you can list
them in a comma-separated list.

Why list multiple servers? Let's say you create a backfill stream for 10,080
minutes or one week. In that time period you might have a server crash, have to
add another server, or remove a server from your cluster. Providing an address
to each server allows an import and export command to proceed through topology
changes to your cluster. In the first example above if you had a two-node
cluster and 10.2.1.55 goes down then the import will fail even though the entire
cluster didn't go down. If you list both machines then the import will continue
unaffected by the downed server and your import will complete successfully.

<a id="hadoop-plugin-sqoop-connection-buckets"></a>

## Connecting to Different Buckets

By default the Couchbase plugin connects to the default bucket. If you want to
connect to a bucket other than the default bucket you can specify the bucket
name with the `--username` option. If you have to connect to a SASL bucket use
the `--password` option followed by the buckets password.

<a id="hadoop-plugin-sqoop-import"></a>

## Importing

Importing data to your cluster requires the use of the Sqoop import command
followed by the parameters `--connect` and `--table`. Below are some example
imports.


```
shell> bin/sqoop import --connect http://10.2.1.55:8091/pools --table DUMP
```

This will dump all key-value pairs from Couchbase into HDFS.


```
shell> bin/sqoop import --connect http://10.2.1.55:8091/pools --table BACKFILL_10
```

This will stream all key-value mutations from Couchbase into HDFS.

Sqoop provides many more options to the import command than we will cover in
this document. Run `bin/sqoop import help` for a list of all options and see the
Sqoop documentation for more details about these options.

<a id="hadoop-plugin-exporting"></a>

## Exporting

Exporting data to your cluster requires the use of the Sqoop import command
followed by the parameters `--connect`, `--export-dir`, and `--table`. Below are
some example imports.


```
shell> bin/sqoop export --connect http://10.2.1.55:8091/pools --table garbage_value --export-dir dump_4-12-11
```

This will export all key-value pairs from the HDFS directory specified by
export-dir into Couchbase.


```
shell> bin/sqoop export -connect http://10.2.1.55:8091/pools --table garbage_value --export-dir backfill_4-29-11
```

This will export all key-value pairs from the HDFS directory specified by
`--export-dir` into Couchbase.

Sqoop provides many more options to the export command than we will cover in
this document. Run `bin/sqoop export help` for a list of all options and see the
Sqoop documentation for more details about these options.

<a id="hadoop-plugin-sqoop-listtable"></a>

## List table

Sqoop has a tool called list tables that in a relational database has a lot of
meaning since it shows us what kinds of things we can import. As noted in
previous sections, Couchbase doesn't have a notion of tables, but we use `DUMP`
and `BACKFILL_##` as values to the `--table` option. As a result using the
list-tables tool does the following.


```
shell> bin/sqoop list-tables --connect http://10.2.1.55:8091/pools DUMP BACKFILL_5
```

All this does in the case of the Couchbase plugin is remind us what we can use
as an argument to the `--table` option. We give `BACKFILL` a time of 5 minutes
so that the import-all-tables tool functions properly.

Sqoop provides many more options to the list-tables command than we will cover
in this document. Run `bin/sqoop list-tables help` for a list of all options and
see the Sqoop documentation for more details about these options.

<a id="hadoop-plugin-sqoop-importall"></a>

## Import All Tables

In the Couchbase plugin the import-all-tables tool dumps all keys in Couchbase
into HDFS and then streams all key-value mutations into Hadoop for five minutes.
This command is a direct result of running import on each table from the
list-tables command. Below is an example of this command.


```
shell> bin/sqoop import-all-tables -connect http://10.2.1.55:8091/pools
```

Sqoop provides many more options to the import-all-tables command than we will
cover in this document. Run `bin/sqoop import-all-tables help` for a list of all
options and see the Sqoop documentation for more details about these options.

<a id="hadoop-plugin-limittions"></a>

## Limitations

While Couchbase provides many great features to import and export data from
Couchbase to Hadoop there is some functionality that the plugin doesn't
implement in Sqoop. Here's a list of what isn't implemented.

 * Querying: You cannot run queries on Couchbase. All tools that attempt to do this
   will fail with a NotSupportedException.

 * list-databases tool: Even though Couchbase is a multi-tenant system that allows
   for multiple databases. There is no way of listing these databases from Sqoop.

 * eval-sql tool: Couchbase doesn't use SQL so this tool will not work.

<a id="hadoop-plugin-internals"></a>
