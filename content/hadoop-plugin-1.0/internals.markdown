# Internals

The Couchbase plugin consists of two parts. The first part is the addition of
code that allows the mappers in Hadoop to read the values sent to it from
Couchbase. The second part is the use of the Spymemcached client to get data to
and from Couchbase. For imports the plugin uses the tap stream feature in
Spymemcached. Tap streams allow users to stream large volumes of data from
Couchbase into other applications and are also at the heart of replication in
Couchbase. They enable a fast way to move data from Couchbase to Hadoop for
further processing. Getting data back into Couchbase runs through the front end
of Couchbase using the memcached protocol.

For more information about the internals of Sqoop see the Sqoop documentation.

<a id="licenses"></a>
