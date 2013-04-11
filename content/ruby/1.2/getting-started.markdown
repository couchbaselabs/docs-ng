---
title: Getting Started
no_nav: true
---

# Getting Started

Awesome that you want to learn more about Couchbase! This is the right
place to start your journey. This chapter will teach you the basics of
Couchbase and how to interact with it through the Ruby Client SDK.

If you haven't already, download the latest Couchbase Server 2.0
release and install it. While following the download instructions and
setup wizard, make sure install the `beer-sample` default bucket. It
contains sample data of beers and breweries, which we'll be using in
our examples here. If you've already installed Couchbase Server 2.0
and didn't install the `beer-sample` bucket (or if you deleted it),
just open the Web-UI and navigate to "Settings/Sample Buckets".
Activate the `beer-sample` checkbox and click "Create". In the right
hand corner you'll see a notification box that will disappear once the
bucket is ready to be used.

Here's a quick outline of what you'll learn in this chapter:

* Install the library with its dependencies.

* Write a simple program to demonstrate connecting to Couchbase and
  saving some documents.

From here on, we'll assume that you have a Couchbase Server 2.0
release running and the `beer-sample` bucket configured. If you need
any help on setting up everything, there is plenty of documentation
available:

* Using the [Couchbase Web Console][ruby_gs_1], for information on
  using the Couchbase Administrative Console,

* [Couchbase CLI][ruby_gs_2], for the command line interface,

* [Couchbase REST API][ruby_gs_3], for creating and managing Couchbase
  resources.

## Installing the Couchbase Client Libraries

Before continuing you should ensure you have a working Ruby
environment up and running. We recommend to use recent [stable
versions of ruby][ruby_gs_4].

You can verify that Ruby is installed by typing the following command:

```
shell> ruby -v
ruby 1.9.3p286 (2012-10-12 revision 37165) [x86_64-linux]
```

Another dependency needed for client is libcouchbase. Please consult
[C Client Library][ruby_gs_5] page about ways to get it on your
system. Here we will assume you are using the Ubuntu/Debian GNU/Linux
family and have the `apt` tool.

Note that the libcouchbase dependency is not needed if you are on
Microsoft Windows, as all dependencies are bundled in the source.

Once you have installed libcouchbase, you are then ready to install
the most recent client using rubygems.

```
shell> gem install couchbase
Fetching: couchbase-1.2.0.gem (100%)
Building native extensions.  This could take a while...
Successfully installed couchbase-1.2.0
1 gem installed
```

Lets load and verify library version.

```
shell> ruby -rrubygems -rcouchbase -e 'puts Couchbase::VERSION'
1.2.0
```

## Hello Couchbase

To follow the tradition of programming tutorials, we'll start with
"Hello Couchbase". In the first example, we'll connect to the Cluster,
retrieve the document, print it out and modify it. This first
example contains the full sourcecode, but in later example we'll omit
the preamble and assume we're already connected to the cluster.

```ruby
require 'rubygems'
require 'couchbase'

client = Couchbase.connect(:bucket => "beer-sample",
                           :host => "localhost")

beer = client.get("aass_brewery-juleol")
puts "#{beer['name']}, ABV: #{beer['abv']}"

beer['comment'] = "Random beer from Norway"
client.replace("aass_brewery-juleol", beer)

client.disconnect
```

While this code should be very easy to grasp, there is a lot going on
worth a little more discussion:

### Connecting to the Bucket

The `Couchbase.connect` basically creates an instance of
`Couchbase::Bucket` class internally passing all arguments to its
contructor. You can see complete list of options on the [API
documentation site][ruby_gs_6]. In our example the most interesting
option is `:bucket`. Because our data bucket isn't "default" we must
specify it during connection.  The bucket is the container for all
your documents. Inside a bucket, a key -- the identifier for a
document -- must be unique. In production environments, it is
recommended to use a password on a bucket (this can be configured
during bucket creation), but when you are just starting out using the
default bucket without a password is fine. Note that the `beer-sample`
bucket also doesn't have a password, so just change the bucket name
and you're set. Another option is `:host` which tells the client
library the address of the cluster. While passing in only one host is
fine, it is strongly recommended to add two or three (of course, if
your cluster has more than one node) and use `:node_list` option
instead. It is important to understand that this list does not have to
contain all nodes in the cluster -- you just need to provide a few so
that during the initial bootstrap phase the Client is able to connect
to the server. Any two or three nodes will be fine, but maintain this
list.  After this has happened, the Client automatically fetches the
cluster configuration and keeps it up to date, even when the cluster
topology changes. This means that you don't need to change your
application config at all when you resize your cluster.

### Data Manipulation

Set and get: these two operations are the most fundamental ones. You
can use set to create or completely replace a document inside your
bucket and get to read it back afterwards. There are lots of arguments
and variations, but if you just use them as shown in the previous
example will get you pretty far. The sample is using the
`Couchbase::Bucket#replace` operation. It behaves exactly like `#set`
but will raise an error if the document isn't in the bucket. Note that
by default all operations are using JSON to store your documents, so
make sure it is possible to represent your values in this format. If
not, you might use `:marshal` format. Find more info about the formats
in the API documentation.

### Tidy Up

At the end of the program (or when you shutdown your server instance),
you should use the `Couchbase::Bucket#disconnect` method. But you
should know that the instance will be disconnected properly if it is
destroyed by garbage collector.

### Execute

Now we're ready to run our first Couchbase program.

```
shell> ruby hello.rb
Juleøl, ABV: 5.9
```


## Working with Documents

A document in Couchbase Server consists of a value and meta
information, like a unique key, a CAS value, flags etc. These are all
stored in a bucket. A document can be anything, but it is recommended
to use the JSON format. JSON is very convenient for storing structured
data with little overhead, and is also used inside the View engine.
This means that if you want to get most out of Couchbase Server 2.0,
use JSON.

The couchbase client will use any of accessible JSON libraries
supported by [multi_json gem][ruby_gs_7]. This mean if your values are
serializable with `MultiJson.dump`, you can pass them to mutator
methods and be sure you will get them later in the same form.

The following chapter introduces the basic operations that you can use
as the fundamental building blocks of your application.

Here's a quick outline of what you'll learn in this chapter:

* Write a program to demonstrate using Create, Read, Update, Delete
  (CRUD) operations on documents.

* Explore some of the API methods that will take you further than what
  you've seen previously.

### Creating and Updating Documents

Couchbase Server provides a set of commands to store documents. The
commands are very similar to each other and differ only in their
meaning on the server-side. These are:

* `Bucket#set` Stores a document in Couchbase Server
  (identified by its unique key) and overrides the previous document
  (if there was one).

* `Bucket#add` Adds a document in Couchbase Server
  (identified by its unique key) and fails if there is already a
  document with the same key stored.

* `Bucket#replace` Replaces a document in Couchbase Server
  (identified by its unique key) and fails if there is no document
  with the given key already in place.

There are also additional commands mutation commands, which do make
sense when you are working in `:plain` mode, because they are
implmented on the server and not JSON-aware. But still they might be
useful in your application:

* `Bucket#prepend` Prepend given string to the value. The
  concatenation is done on the server side.

* `Bucket#append` Append given string to the value. The concatenation
  is also done on the server side.

* `Bucket#increment` Increment, atomically, the value. The value is a
  string representation of an unsigned integer. The new value is
  returned by the operation. By default it will increment by one. See
  API reference for other options.

* `Bucket#decrement` Decrement, atomically, the value. The value is a
  string representation of an unsigned integer. The new value is
  returned by the operation. By default it will decrement by one. See
  API reference for other options.

The SDK provides several options for these operations, but to start
out here are the simplest forms:

```ruby
key = "aass_brewery-juleol"
doc = {"name" => "Juleøl", "abv" => 5.9}

client.add(key, doc);
client.set(key, doc);
client.replace(key, doc);
```

### Reading Documents

With Couchbase Server 2.0, you have two ways of fetching your
documents: either by the unique key through the get method, or through
Views. Since Views are more complex, let's just look at a simple get
first:

```ruby
doc = client.get("aass_brewery-juleol")

keys = ["foo", "bar"]
docs = client.get(keys, :quiet => true)
```

In this case you will receve the Hash document you stored earlier. If
there no such key in the bucket, the exception
`Couchbase::Error:NotFound` will be raised. But you can suppress all
`NotFound` errors by using option `:quiet => true` and the method will
return `nil` instead. The `Couchbase::Bucket#get` method can also
accept list of keys returning list of documents.

With Couchbase Server 2.0, the very powerful ability to query your
documents across this distributed system through secondary indexes
(Views) has been added to your toolbelt. This guide gets you started
on how to use them through the Ruby SDK, if you want to learn more
please refer to [the chapter "Views and Indexes" in the Couchbase
Server 2.0 documentation][ruby_gs_8].

Once you created your View in the UI, you can query it from the SDK in
two steps. First, you grab the design document definition from the
cluster, second query view with options you need and use results.
In its simplest form, it looks like this:

```ruby
# 1: Get the design document definition
ddoc = client.design_docs["beer"]
ddoc.views      #=> ["brewery_beers", "by_location"]

# 2: Query the view and use results
ddoc.brewery_beers.each do |row|
  puts row.key
  puts row.value
  puts row.id
  puts row.doc
end
```

Note that the view request won't be executed until you will try to
access the results. This means that you can pass view object
(`ddoc.brewery_beers` here) without executing it.

Views can be queried with a large amount of options to change what the
results of the query will contain. All supported options are available
as items in options Hash accepted either by the view method or by
`#each` iterator on the view. Here are some of them:

* `include_docs (Boolean)` Used to define if the complete documents
  should be fetched with the result (`false` by default).  Note this
  will actually fetch the document itself from the cache, so if it has
  been changed or deleted you may not receive a document that matches
  the view, or any at all.

* `reduce (Boolean)` Used to enable/disable the reduce function (if
  there is one defined on the server). `true` by default.

* `limit (Fixnum)` Limit the number of results that should be
  returned.

* `descending (Boolean)` Revert the sorting order of the result set.
  (`false` by default)

* `stale (Boolean, Symbol)` Can be used to define the tradeoff between
  performance and freshness of the data.  (`:update_after` by default)

Now that we have our View information in place, we can issue the
query, which actually triggers the scatter-gather data loading process
on the Cluster. We can use it to iterate over the results and print
out some details (here is a more complete example which also includes
the full documents and only fetches the first five results). The
resulting information is encapsulated inside the `ViewRow` object.

```ruby
view = client.design_docs["beer"].brewery_beers

# Include all docs and limit to 5
view.each(:include_docs => true, :limit => 5) do |row|
  puts row.id
  # The full document (as a Hash) is available through row.doc
end
```

In the logs, you can see the corresponding document keys automatically
sorted (ascending):

```
21st_amendment_brewery_cafe
21st_amendment_brewery_cafe-21a_ipa
21st_amendment_brewery_cafe-563_stout
21st_amendment_brewery_cafe-amendment_pale_ale
21st_amendment_brewery_cafe-bitter_american
```

### Deleting Documents

If you want to get rid of a document, you can use the delete operation:

```ruby
client.delete("aass_brewery-juleol");
```

## Advanced Topics

This chapter introduces some techniques topics that you can use to
further extend your Couchbase vocabulary.

### CAS and Locking

If you need to coordinate shared access on documents, Couchbase helps
you with two approaches. Depending on the application you may need to
use both of them, but in general it is better (if feasible) to lean
towards CAS because it provides the better performance
characteristics.

#### Optimistic Locking

Each document has a unique identifier associated with it (the CAS
value), which changes when the document itself is mutated. You can
fetch the CAS value for a given key and pass it to any mutator
operation to protect it. The update will only succeed, when the CAS
value is still the same. This is why it's called optimistic locking.
Someone else can still read and try to update the document, but it
will fail once the CAS value has changed. Here is a example on how to
do it with the Ruby SDK:

```ruby
key = "eagle_brewing-golden"
# Reads the document with the CAS value.
beer, flags, cas = client.get(key, :extended => true)

# Updates the document and tries to store it back.
beer["name"] = "Some other Name"
client.set(key, beer, :cas => cas, :flags => flags)
```

Note that this also means that all your application need to follow the
same code path (cooperative locking). If you use `#set` somewhere else
in the code on the same document, it will work even if the CAS itself
is out of date (that's because the normal `#set` method doesn't care
about those values at all). Of course, the CAS itself changes then and
the mutation operation would fail afterwards.

There is also shortcut operation for doing optimistic locking
`Bucket#cas`. Internally it does the same thing but abstract you from
storing and passing meta information. Here is the previous example
rewritten to use this operation:

```ruby
key = "eagle_brewing-golden"
client.cas(key) do |beer|
  beer["name"] = "Some other Name"
  # return new value from block
  beer
end
```

Note that you should return new value from the block. If you will skip
it, it will use `"Some other Name"` as new value.

#### Pessimistic Locking

If you want to lock a document completely (or an object graph), you
can use the `Bucket#get` operation with `:lock` option. The option
accepts either boolean (where truth does make sense really) or Fixnum
meaning the time period where the lock is valid. The server will
release lock after the that period (or maximum value, which configured
on the server). Other threads can still run `get` queries queries
against the document, but mutation operations without a CAS will fail.

You can determine actual default and maximum values calling
`Bucket#stats` without arguments and inspecting keys
`"ep_getl_default_timeout"` and `"ep_getl_max_timeout"`
correspondingly.

```ruby
key = "eagle_brewing-golden";

# Get with Lock
beer, flags, cas = client.get(key, :lock => true, :extended => true);

# Update the document
beer["name"] = "Some other Name"

# Try to set without the lock
client.set(key, beer, :flags => flags)
#=> will raise Couchbase::Error::KeyExists

# Try to set with the CAS aquired, will be OK
client.set(key, beer, :flags => flags, :cas => cas)
```

Once you update the document, the lock will be released. There is also
the `Bucket#unlock` method available through which you can unlock the
document.

### Persistence and Replication

By default, the mutation operations return when Couchbase Server has
accepted the command and stored it in memory (disk persistence and
replication is handled asynchronously by the cluster). That's one of
the reason why it's so fast. For most use-cases, that's the behavior
that you need. Sometimes though, you want to trade in performance for
data-safety and wait until the document has been saved to disk and/or
replicated to other hosts.

The Ruby SDK provides `:observe` option for all mutation operations.
You can claim various persistence conditions using this option.
Basically its argument is a Hash with three possible keys, describing
the condition when the mutator will yield the result:

* `:replicated (Fixnum)` describe how many nodes should receive
replicated copy of the document.

* `:persisted` (Fixnum)` describe how many nodes should persist the
document to the disk. The nodes include master node, where the key
resides and all replica nodes.

* `:timeout (Fixnum)` the timeout period in microseconds. After
passing, the operation condition will be considered timed out and
appropriate exception will be thrown. Default value could be addressed
using `Bucket#default_observe_timeout`.

Here is an example on how to make sure that the document has been
persisted on its master node, but also replicated to at least one of
its replicas.

```ruby
key = "important"
value = "document"
client.set(key, value, :observe => {:persisted => 1, :replicated => 1})
```

You can also separate persistence requirement from actual operations,
and in this case, you can wait for several keys:

```ruby
keys = []
(1..5).each do |nn|
  key = "important-#{nn}"
  keys << key
  client.set(key, "document-#{nn}")
end
client.observe_and_wait(keys, :persisted => 1, :replicated => 1)
```

[ruby_gs_1]: http://couchbase.com/docs/couchbase-manual-2.0/couchbase-introduction.html
[ruby_gs_2]: http://couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console.html
[ruby_gs_3]: http://couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi.html
[ruby_gs_4]: http://www.ruby-lang.org/en/downloads/
[ruby_gs_5]: http://www.couchbase.com/develop/c/current
[ruby_gs_6]: http://rdoc.info/gems/couchbase/Couchbase/Bucket#initialize-instance_method
[ruby_gs_7]: https://rubygems.org/gems/multi_json
[ruby_gs_8]: http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html
[ruby_gs_9]:
