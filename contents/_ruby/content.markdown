<a id="couchbase-sdk-ruby-1-2"></a>

# Couchbase Client Library Ruby 1.2

<a id="getting-started"></a>

# Getting Started

Awesome that you want to learn more about Couchbase! This is the right place to
start your journey. This chapter will teach you the basics of Couchbase and how
to interact with it through the Ruby Client SDK.

If you haven’t already, download the latest Couchbase Server 2.0 release and
install it. While following the download instructions and setup wizard, make
sure install the `beer-sample` default bucket. It contains sample data of beers
and breweries, which we’ll be using in our examples here. If you’ve already
installed Couchbase Server 2.0 and didn’t install the `beer-sample` bucket (or
if you deleted it), just open the Web-UI and navigate to "Settings/Sample
Buckets". Activate the `beer-sample` checkbox and click "Create". In the right
hand corner you’ll see a notification box that will disappear once the bucket is
ready to be used.

Here’s a quick outline of what you’ll learn in this chapter:

 1. Install the library with its dependencies.

 1. Write a simple program to demonstrate connecting to Couchbase and saving some
    documents.

From here on, we’ll assume that you have a Couchbase Server 2.0 release running
and the `beer-sample` bucket configured. If you need any help on setting up
everything, there is plenty of documentation available:

 * Using the [Couchbase Web
   Console](http://couchbase.com/docs/couchbase-manual-2.0/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

<a id="installing_the_couchbase_client_libraries"></a>

## Installing the Couchbase Client Libraries

Before continuing you should ensure you have a working Ruby environment up and
running. We recommend Ruby 1.9.2 or 1.8.7
[http://ruby-lang.org](http://ruby-lang.org).

You can verify that Ruby is installed by typing the following command:

**Unhandled:** `[:unknown-tag :screen]` Another dependency needed for client is
libcouchbase. Please consult \[ [C Client
Library](http://www.couchbase.com/develop/c/current]) page about ways to get it
on your system. Here we will assume you are using the Ubuntu/Debian GNU/Linux
family and have the `apt` tool.

Note that the libcouchbase dependency is not needed if you are on Microsoft
Windows, as all dependencies are bundled in the source.

Once you have installed libcouchbase, you are then ready to install the most
recent client using rubygems.

**Unhandled:** `[:unknown-tag :screen]` Lets load and verify library version.

**Unhandled:** `[:unknown-tag :screen]` The TCP/IP port allocation on Windows by
default includes a restricted number of ports available for client
communication. For more information on this issue, including information on how
to adjust the configuration and increase the available ports, see [MSDN:
Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="hello_couchbase"></a>

## Hello Couchbase

To follow the tradition of programming tutorials, we’ll start with "Hello
Couchbase". In the first example, we’ll connect to the Cluster, retrieve the
document, print it out and modify it. This first example contains the full
sourcecode, but in later example we’ll omit the preamble and assume we’re
already connected to the cluster.


```
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

While this code should be very easy to grasp, there is a lot going on worth a
little more discussion:

 * Connecting: the `Couchbase.connect` basically creates an instance of
   `Couchbase::Bucket` class internally passing all arguments to its contructor.
   You can see complete list of options on the [API documentation
   site](http://rdoc.info/gems/couchbase/Couchbase/Bucket#initialize-instance_method).
   In our example the most interesting option is `:bucket`. Because our data bucket
   isn’t "default" we must specify it during connection. The bucket is the
   container for all your documents. Inside a bucket, a key — the identifier for a
   document — must be unique. In production environments, it is recommended to use
   a password on a bucket (this can be configured during bucket creation), but when
   you are just starting out using the default bucket without a password is fine.
   Note that the `beer-sample` bucket also doesn’t have a password, so just change
   the bucket name and you’re set. Another option is `:host` which tells the client
   library the address of the cluster. While passing in only one host is fine, it
   is strongly recommended to add two or three (of course, if your cluster has more
   than one node) and use `:node_list` option instead. It is important to
   understand that this list does not have to contain all nodes in the
   cluster — you just need to provide a few so that during the initial bootstrap
   phase the Client is able to connect to the server. Any two or three nodes will
   be fine, but maintain this list. After this has happened, the Client
   automatically fetches the cluster configuration and keeps it up to date, even
   when the cluster topology changes. This means that you don’t need to change your
   application config at all when you resize your cluster.

 * Set and get: these two operations are the most fundamental ones. You can use set
   to create or completely replace a document inside your bucket and get to read it
   back afterwards. There are lots of arguments and variations, but if you just use
   them as shown in the previous example will get you pretty far. The sample is
   using the `Couchbase::Bucket#replace` operation. It behaves exactly like `#set`
   but will raise an error if the document isn’t in the bucket. Note that by
   default all operations are using JSON to store your documents, so make sure it
   is possible to represent your values in this format. If not, you might use
   `:marshal` format. Find more info about the formats in the API documentation.

 * Disconnecting: at the end of the program (or when you shutdown your server
   instance), you should use the `Couchbase::Bucket#disconnect` method. But you
   should know that the instance will be disconnected properly if it is destroyed
   by garbage collector.

That’s it. We’re ready to run our first Couchbase program.

**Unhandled:** `[:unknown-tag :screen]`<a id="working_with_documents"></a>

## Working with Documents

A document in Couchbase Server consists of a value and meta information, like a
unique key, a CAS value, flags etc. These are all stored in a bucket. A document
can be anything, but it is recommended to use the JSON format. JSON is very
convenient for storing structured data with little overhead, and is also used
inside the View engine. This means that if you want to get most out of Couchbase
Server 2.0, use JSON.

The couchbase client will use any of accessible JSON libraries supported by
[multi\_json gem](https://rubygems.org/gems/multi_json). This mean if your
values are serializable with `MultiJson.dump`, you can pass them to mutator
methods and be sure you will get them later in the same form.

The following chapter introduces the basic operations that you can use as the
fundamental building blocks of your application.

Here’s a quick outline of what you’ll learn in this chapter:

 1. Write a program to demonstrate using Create, Read, Update, Delete (CRUD)
    operations on documents.

 1. Explore some of the API methods that will take you further than what you’ve seen
    previously.

<a id="creating_and_updating_documents"></a>

### Creating and Updating Documents

Couchbase Server provides a set of commands to store documents. The commands are
very similar to each other and differ only in their meaning on the server-side.
These are:

`set`     | Stores a document in Couchbase Server (identified by its unique key) and overrides the previous document (if there was one).                 
----------|----------------------------------------------------------------------------------------------------------------------------------------------
`add`     | Adds a document in Couchbase Server (identified by its unique key) and fails if there is already a document with the same key stored.        
`replace` | Replaces a document in Couchbase Server (identified by its unique key) and fails if there is no document with the given key already in place.

There are also additional commands mutation commands, which do make sense when
you are working in `:plain` mode, because they are implmented on the server and
not JSON-aware. But still they might be useful in your application:

`prepend`   | Prepend given string to the value. The concatenation is done on the server side.                                                                                                                                    
------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`append`    | Append given string to the value. The concatenation is also done on the server side.                                                                                                                                
`increment` | Increment, atomically, the value. The value is a string representation of an unsigned integer. The new value is returned by the operation. By default it will increment by one. See API reference for other options.
`decrement` | Decrement, atomically, the value. The value is a string representation of an unsigned integer. The new value is returned by the operation. By default it will decrement by one. See API reference for other options.

The SDK provides several options for these operations, but to start out here are
the simplest forms:


```
key = "aass_brewery-juleol"
doc = {"name" => "Juleøl", "abv" => 5.9}

client.add(key, doc);
client.set(key, doc);
client.replace(key, doc);
```

<a id="reading_documents"></a>

### Reading Documents

With Couchbase Server 2.0, you have two ways of fetching your documents: either
by the unique key through the get method, or through Views. Since Views are more
complex, let’s just look at a simple get first:


```
doc = client.get("aass_brewery-juleol")

keys = ["foo", "bar"]
docs = client.get(keys, :quiet => true)
```

In this case you will receve the Hash document you stored earlier. If there no
such key in the bucket, the exception `Couchbase::Error:NotFound` will be
raised. But you can suppress all `NotFound` errors by using option `:quiet =>
true` and the method will return `nil` instead. The `Couchbase::Bucket#get`
method can also accept list of keys returning list of documents.

With Couchbase Server 2.0, the very powerful ability to query your documents
across this distributed system through secondary indexes (Views) has been added
to your toolbelt. This guide gets you started on how to use them through the
Ruby SDK, if you want to learn more please refer to [the chapter in the
Couchbase Server 2.0
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

Once you created your View in the UI, you can query it from the SDK in two
steps. First, you grab the design document definition from the cluster, second
query view with options you need and use results. In its simplest form, it looks
like this:


```
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

Note that the view request won’t be executed until you will try to access the
results. This means that you can pass view object ( `ddoc.brewery_beers` here)
without executing it.

Views can be queried with a large amount of options to change what the results
of the query will contain. All supported options are available as items in
options Hash accepted either by the view method or by `#each` iterator on the
view. Here are some of them:

include\_docs (Boolean) | Used to define if the complete documents should be fetched with the result ( `false` by default). Note this will actually fetch the document itself from the cache, so if it has been changed or deleted you may not receive a document that matches the view, or any at all.
------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
reduce (Boolean)        | Used to enable/disable the reduce function (if there is one defined on the server). `true` by default.                                                                                                                                                                       
limit (Fixnum)          | Limit the number of results that should be returned.                                                                                                                                                                                                                         
descending (Boolean)    | Revert the sorting order of the result set. ( `false` by default)                                                                                                                                                                                                            
stale (Boolean, Symbol) | Can be used to define the tradeoff between performance and freshness of the data. ( `:update_after` by default)                                                                                                                                                              

Now that we have our View information in place, we can issue the query, which
actually triggers the scatter-gather data loading process on the Cluster. We can
use it to iterate over the results and print out some details (here is a more
complete example which also includes the full documents and only fetches the
first five results). The resulting information is encapsulated inside the
`ViewRow` object.


```
view = client.design_docs["beer"].brewery_beers

# Include all docs and limit to 5
view.each(:include_docs => true, :limit => 5) do |row|
puts row.id
# The full document (as a Hash) is available through row.doc
end
```

In the logs, you can see the corresponding document keys automatically sorted
(ascending):

**Unhandled:** `[:unknown-tag :screen]`<a id="deleting_documents"></a>

### Deleting Documents

If you want to get rid of a document, you can use the delete operation:


```
client.delete("aass_brewery-juleol");
```

<a id="advanced_topics"></a>

## Advanced Topics

This chapter introduces some techniques topics that you can use to further
extend your Couchbase vocabulary.

<a id="cas_and_locking"></a>

### CAS and Locking

If you need to coordinate shared access on documents, Couchbase helps you with
two approaches. Depending on the application you may need to use both of them,
but in general it is better (if feasible) to lean towards CAS because it
provides the better performance characteristics.

### Optimistic Locking

Each document has a unique identifier associated with it (the CAS value), which
changes when the document itself is mutated. You can fetch the CAS value for a
given key and pass it to any mutator operation to protect it. The update will
only succeed, when the CAS value is still the same. This is why it’s called
optimistic locking. Someone else can still read and try to update the document,
but it will fail once the CAS value has changed. Here is a example on how to do
it with the Ruby SDK:


```
key = "eagle_brewing-golden"
# Reads the document with the CAS value.
beer, flags, cas = client.get(key, :extended => true)

# Updates the document and tries to store it back.
beer["name"] = "Some other Name"
client.set(key, beer, :cas => cas, :flags => flags)
```

Note that this also means that all your application need to follow the same code
path (cooperative locking). If you use `#set` somewhere else in the code on the
same document, it will work even if the CAS itself is out of date (that’s
because the normal `#set` method doesn’t care about those values at all). Of
course, the CAS itself changes then and the mutation operation would fail
afterwards.

There is also shortcut operation for doing optimistic locking `Bucket#cas`.
Internally it does the same thing but abstract you from storing and passing meta
information. Here is the previous example rewritten to use this operation:


```
key = "eagle_brewing-golden"
client.cas(key) do |beer|
beer["name"] = "Some other Name"
# return new value from block
beer
end
```

Note that you should return new value from the block. If you will skip it, it
will use `"Some other Name"` as new value.

### Pessimistic Locking

If you want to lock a document completely (or an object graph), you can use the
`Bucket#get` operation with `:lock` option. The option accepts either boolean
(where truth does make sense really) or Fixnum meaning the time period where the
lock is valid. The server will release lock after the that period (or maximum
value, which configured on the server). Other threads can still run `get`
queries queries against the document, but mutation operations without a CAS will
fail.

You can determine actual default and maximum values calling `Bucket#stats`
without arguments and inspecting keys `"ep_getl_default_timeout"` and
`"ep_getl_max_timeout"` correspondingly.


```
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

Once you update the document, the lock will be released. There is also the
`Bucket#unlock` method available through which you can unlock the document.

<a id="persistence_and_replication"></a>

### Persistence and Replication

By default, the mutation operations return when Couchbase Server has accepted
the command and stored it in memory (disk persistence and replication is handled
asynchronously by the cluster). That’s one of the reason why it’s so fast. For
most use-cases, that’s the behavior that you need. Sometimes though, you want to
trade in performance for data-safety and wait until the document has been saved
to disk and/or replicated to other hosts.

The Ruby SDK provides `:observe` option for all mutation operations. You can
claim various persistence conditions using this option. Basically its argument
is a Hash with three possible keys, describing the condition when the mutator
will yield the result:

 1. `:replicated` (Fixnum) describe how many nodes should receive replicated copy of
    the document.

 1. `:persisted` (Fixnum) describe how many nodes should persist the document to the
    disk. The nodes include master node, where the key resides and all replica
    nodes.

 1. `:timeout` (Fixnum) the timeout period in microseconds. After passing, the
    operation condition will be considered timed out and appropriate exception will
    be thrown. Default value could be addressed using
    `Bucket#default_observe_timeout`.

Here is an example on how to make sure that the document has been persisted on
its master node, but also replicated to at least one of its replicas.


```
key = "important"
value = "document"
client.set(key, value, :observe => {:persisted => 1, :replicated => 1})
```

You can also separate persistence requirement from actual operations, and in
this case, you can wait for several keys:


```
keys = []
(1..5).each do |nn|
key = "important-#{nn}"
keys << key
client.set(key, "document-#{nn}")
end
client.observe_and_wait(keys, :persisted => 1, :replicated => 1)
```

<a id="tutorial"></a>

# Couchbase and Rails Tutorial

The goal of this chapter is to show how to write more advanced application using
Couchbase and Rails framework.

We assume here that you are passed "Getting Started" section already, if not, we
recommend to take a look, because it describes how to install and verify Ruby
SDK.

<a id="_tl_dr"></a>

## TL;DR

For the purposes of this tutorial, we have specially prepared an example
application for you to follow along with. The application uses a bucket with one
of the sample datasets which come with Couchbase Server itself: `beer-sample`.
If you haven’t already, download the latest Couchbase Server 2.0 release and
install it. While following the download instructions and setup wizard, make
sure you install the `beer-sample` default bucket. It contains a sample data set
of beers and breweries, which we’ll use in our examples here. If you’ve already
installed Couchbase Server 2.0 and didn’t install the `beer-sample` bucket (or
if you deleted it), just open the Web-UI and navigate to "Settings/Sample
Buckets". Select the `beer-sample` checkbox and click "Create". In the right
hand corner you’ll see a notification box that will disappear once the bucket is
ready to be used.

After that you can clone the complete repository from couchbaselabs on github:

**Unhandled:** `[:unknown-tag :screen]` Navigate to the directory and install
all application dependencies:

**Unhandled:** `[:unknown-tag :screen]` That’s it. Assuming that the server with
`beer-sample` bucket is up and running on localhost, you can just start ruby web
server:

**Unhandled:** `[:unknown-tag :screen]` Then navigate to
[http://localhost:3000/](http://localhost:3000/). You should see something like
that:

**Unhandled:** `[:unknown-tag :informalfigure]`<a id="_create_application_skeleton"></a>

## Create Application Skeleton

If you would like to learn how to create this application from scratch just
continue reading. As with any rails application we will use generators a lot.
Since we don’t need ActiveRecord we’ll let `rails new` know about it.

**Unhandled:** `[:unknown-tag :screen]` Now navigate to the project root and
open up `Gemfile` in your favorite editor. First, we need to add the Couchbase
client libraries there:


```
gem 'couchbase'
gem 'couchbase-model'
```

Skipping the version will get the latest stable versions of those gems. We will
use the [couchbase-model](https://rubygems.org/gems/couchbase-model) gem to
define our models in a declarative way much like all rails developers describe
their models with ActiveRecord. Apart from that we will use `yajl-ruby`, a
high-performance JSON parser/generator, `rdiscount` to render descriptions as
Markdown, and `omniauth-twitter` for authentication.


```
gem 'yajl-ruby'
gem 'rdiscount'
gem 'omniauth-twitter'
```

The complete `Gemfile` will looks like this:

### Gemfile


```
source 'https://rubygems.org'

gem 'rails', '3.2.8'

gem "eventmachine", "~> 1.0.0"
gem 'thin', "~> 1.5.0"
gem 'jquery-rails'
gem 'yajl-ruby'
gem 'couchbase'
gem 'couchbase-model'
gem 'rdiscount'
gem 'omniauth'
gem 'omniauth-twitter'

gem 'capistrano'

group :development, :test do
  gem 'debugger'
end

group :assets do
  gem 'sass-rails', '~> 3.2.3'
  gem 'uglifier', '>= 1.0.3'
end
```



Next step will be to configure Couchbase connection, this step should be
familiar to the rails developer, because `couchbase-model` brings YAML-styled
configuration, so if you know how `config/database.yml` works, you can make some
assumtions about how `config/couchbase.yml` works. To generate a config, use the
`couchbase:config` generator:

**Unhandled:** `[:unknown-tag :screen]` Since our bucket name differs from the
project name, you should update the `bucket` property in the config. Also if
your Couchbase Server is not running on the local machine, you should also
change the hostname in the config. After you’ve made your modifications, your
config should look like this:

### config/couchbase.yml

**Unhandled:** `[:unknown-tag :screen]`

That’s it for configuration, let’s move forward and create some models.

<a id="_define_models"></a>

## Define Models

To create a model, all you need is just define class and inherit from
`Couchbase::Model`. Lets dissect the `Brewery` model from the application.

### app/models/brewery.rb


```
class Brewery < Couchbase::Model
  attribute :name, :description
  attribute :country, :state, :city, :address
  attribute :phone
  attribute :geo
  attribute :updated

  view :all, :limit => 31
  view :all_with_beers
  view :by_country, :include_docs => false, :group => true
  view :points, :spatial => true

  def full_address
    [country, state, city, address].reject(&:blank?).join(', ')
  end

  def location
    [country, state].reject(&:blank?).join(', ')
  end
end
```



The first part of the model contains attribute definitions. The `attribute`
macro defines a pair of accessors and helps to maintain map of
attributes-values. You can also specify default a value for each attribute:


```
class Post < Couchbase::Model
  attribute :title, :body
  attribute :timestamp, :default => lambda{ Time.now }
end

Post.new(:title => "Hello, World!")
#=> #<Post timestamp: 2012-12-07 16:03:56 +0300, title: "Hello, World!">
```

The next block is about defining views. One way to play with views is Couchbase
Server Admin Console, but it may not be the best to keep parts of the code in
different places. After all Views are implemented in Javascript and carry part
of business logic. `couchbase-model` has solution for it. Each time the server
starts (in development mode for each request), the application will check the
filesystem changes of the map/reduce javascript files and update design document
if needed. There is also the rails generator for views. It will put view stubs
for you in proper places. Here, for example, is the model layout for this
particular application:

**Unhandled:** `[:unknown-tag :screen]` For each model which has views, you
should create a directory with the same name and put in the appropriate
javascript files. Each should implement the corresponding parts of the view. For
example `_design/brewery/_view/by_country` does require both map and reduce
parts. To generate a new view you should pass model name and view name you need
to get:

**Unhandled:** `[:unknown-tag :screen]` Those automatically generated files are
full of comments, so they are worth reading as quick start about how to write
View indexes. For more information about using views for indexing and querying
from Couchbase Server, here are some useful resources:

 * For technical details on views, how they operate, and how to write effective
   map/reduce queries, see [Couchbase Server 2.0:
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
   and [Couchbase Sever 2.0: Writing
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

<a id="_implement_controllers"></a>

## Implement Controllers

Now lets dissect the controllers from the project. This is where data is
selected to display to user. For example `BreweriesController` :


```
class BreweriesController < ApplicationController
  def index
    filter = params.extract!(:start_key, :end_key).reject{|_, v| v.blank?}
    @breweries = Brewery.all(filter).to_a
    if @breweries.size > 30
      @last_key = @breweries.pop.try(:key)
    end
    respond_to do |format|
      format.html
      format.json do
        render :json => {:last_key => @last_key, :items => @breweries}
      end
    end
  end

  def show
    @brewery, *@beers = Brewery.all_with_beers(:start_key => [params[:id]],
                                               :end_key => ["#{params[:id]}\uefff"]).to_a
  end
end
```

It has two actions:

 1. "index" which is supposed to pull the list of breweries. It might look complex,
    but it isn’t. In first line we are preparing query parameters for views. In
    particular, we are interested in the `start_key` and `end_key` parameters, but
    we need them only if they aren’t blank (i.e. not nil and not empty string). The
    second step is to execute the view and get results immediately. Your application
    might want to fetch the entries from view on demand in a lazy manner, then you
    no need to call the `#to_a` method and iterate over them or call methods like
    `#next`. In this particular example we are fetching 31 records and are trying to
    pop last one to use it later for "infinite" scrolling. The end of the method is
    responsible for rendering the data in two formats, by default it will use HTML,
    but if the application is responding to an AJAX request with the `Accept:
    application/json` header, it will instead render the JSON representation of our
    models.

 1. "show" uses another view from the `Brewery` model, which collates breweries with
    beer for easier access. Here is a map function which does that job:

    **Unhandled:** `[:unknown-tag :screen]` As you can see we are using a compound
    key with brewery ID in the first position and the document name in the second
    position. Because we are selecting only beers without null names, they will be
    sorted after the breweries. By doing so, when we filter result by the first key
    only, the `@brewery` variable will receive first element of the sequence, and
    `@beers` will get the rest of the collection because of the splat ( `*` )
    operator.

<a id="_bonus_spatial_queries_sessions_and_cache"></a>

## Bonus: Spatial Queries, Sessions and Cache

One of the experimental features of the Couchbase Server is spatial views. These
kind of views allow you to build indexes on geo attributes of your data. Sample
application has part, demostrating power of spatial views. Click on the "Map"
link in the menu, and if you allowed your browser to fetch your current location
it will position the center of the map to your, or to Mountain View otherwise.
After that it will execute spatial query using map bounds and the Couchbase
Server will give you all the breweries which are nearby. Lets take a look at the
implemetation. The core of this feature in `brewery/points/spatial.js` :

**Unhandled:** `[:unknown-tag :screen]` The function will emit Point object and
the name with coordinates as the payload. The action in the controller is quite
trivial, it transmit the result to the frontend in JSON representation, where
google maps is rendering markers for each object.

Except nice extensions, provided by `couchbase-model` library, `couchase` gem
itself has few more nice features which could be useful in the web application.
For example, you can easily substitute your session or cache store in rails (or
even in rack) with Couchbase Server.

To use Couchbase as cache store in rails, just put following line in your
`config/application.rb` file:


```
config.cache_store = :couchbase_store
```

You can also pass additional connection options there


```
cache_options = {
  :bucket => 'protected',
  :username => 'protected',
  :password => 'secret',
  :expires_in => 30.seconds
}
config.cache_store = :couchbase_store, cache_options
```

To use Couchbase as the session store you should update your
`config/initializers/session_store.rb` file


```
require 'action_dispatch/middleware/session/couchbase_store'
AppName::Application.config.session_store :couchbase_store
```

Or remove this file and add following line to your `config/application.rb` :


```
require 'action_dispatch/middleware/session/couchbase_store'
config.session_store :couchbase_store
```

You can also pass additional options:


```
require 'action_dispatch/middleware/session/couchbase_store'
session_options = {
  :expire_after => 5.minutes,
  :couchbase => {:bucket => "sessions", :default_format => :json}
}
config.session_store :couchbase_store, session_options
```

In the example above we are specifying format as JSON which allows us to share
sessions in heterogenous environment, and also analyze them using Map/Reduce.
But keep in the mind that not everything in typical rails application could be
serialized to JSON, for example `ActionDispatch::Flash::FlashHash`. This is why
the library serialize sessions using `Marshal.dump` by default.

<a id="couchbase-sdk-ruby-summary"></a>

# Ruby Method Summary

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The `Ruby Client Library` supports the full suite of API calls to Couchbase. A
summary of the supported methods are listed in **ERROR**.

**Unhandled thing here**
<a id="couchbase-sdk-ruby-summary-synchronous"></a>

## Synchronous Method Calls

The Ruby Client Library supports the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the following fragment stores and retrieves a single key/value
pair:


```
couchbase.set("foo", 3600, value);

foo = couchbase.get("foo");
```

In the example code above, the client will wait until a response has been
received from one of the configured Couchbase servers before returning the
required value or an exception.

<a id="couchbase-sdk-ruby-summary-asynchronous"></a>

## Asynchronous Method Calls

In addition, the library also supports a range of asynchronous methods that can
be used to store, update and retrieve values without having to explicitly wait
for a response. For asynchronous operations, the SDK will return control to the
calling method without blocking the current thread. You can pass the block to a
method and it will be called with the result when the operations completes. You
need to use an event loop, namely an event loop in the form of a `run.. do
|return|` block to perform asynchronous calls with the Ruby SDK:


```
couchbase = Couchbase.connect(:async => true)

couchbase.run do |conn|
      conn.get("foo") {|ret| puts ret.value}
      conn.set("bar", "baz")
end
```

The asynchronous callback will recieve an instance of `Couchbase::Result` which
can respond to several methods:

 * `success?` : Returns true if asynchronous operation succeeded.

 * `error` : Returns nil or exception object (subclass of Couchbase::Error::Base)
   if asynchronous operation failed.

 * `key` : Returns key from asynchronous call.

 * `value` : Returns value from asynchronous call.

 * `flags` : Returns flags from asynchronous call.

 * `cas` : CAS value obtained from asynchronous call.

 * `node` : Node used in asynchronous call.

 * `operation` : Symbol representing the type of asynchronous call.

<a id="couchbase-sdk-ruby-connection"></a>

# Ruby — Connection Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

**Unhandled thing here**
Creates a connection with the Couchbase Server. There are several ways to
establish new connection to Couchbase Server. By default a Couchbase SDK uses
the `http://localhost:8091/pools/default/buckets/default` as the endpoint. The
client will automatically adjust configuration when the cluster rebalances, when
the cluster returns from failover, or when you add or delete nodes. Returns the
exception object `Couchbase::Error::Connect` if it fails to connect. The
following creates a default connection:


```
c = Couchbase.connect
c2 = Couchbase.new
```

Note that `Couchbase.new` is a new alias for `connect`, as of the 1.1 version of
the Ruby SDK.

The following are equivalent alternatives to connect to the same node, using
different syntax:


```
#creates connection to the default bucket on default node
c = Couchbase.connect("http://localhost:8091/pools/default/buckets/default")

#shorter method to connect to default bucket
c = Couchbase.connect("http://localhost:8091/pools/default")

#connecting to default bucket
c = Couchbase.connect("http://localhost:8091")

#connecting via default port to default bucket
c = Couchbase.connect(:hostname => "localhost")

#provide host and port as Ruby symbols
c = Couchbase.connect(:hostname => "localhost",
                      :port => 8091)

c = Couchbase.connect(:pool => "default", :bucket => "default")
```

You can also provide a list of possible nodes to connect to in order to avoid a
failure to connect due to a missing node. After your Couchbase client
successfully connects, it will use the most current cluster topology, not this
list, to connect to a node after rebalance or failover. To provide multiple
possible nodes for initial connection:


```
c = Couchbase.connect(:bucket => "mybucket",
                      :node_list => ['example.com:8091', example.net'])
```

Here is creating a connection to a protected bucket by providing a username and
password. Notice that the username you provide is the same as the bucket:


```
Couchbase.connect(:bucket => 'protected',
                  :username => 'protected',
                  :password => 'secret')

Couchbase.connect('http://localhost:8091/pools/default/buckets/protected',
                  :username => 'protected',
                  :password => 'secret')
```

The possible errors that can occur when you try to connect are:

 * `Couchbase::Error::BucketNotFound`. Occurs if the bucket name your provide does
   not exist.

 * `Couchbase::Error::Connect`. Occurs if the socket to connect to Couchbase Server
   does not respond in time or cannot accept the connection.

You can persist a Couchbase client storing it in a way such that the Ruby
garbage collector does not remove from memory. To do this, you can create a
singleton object that contains the client instance and the connection
information. You should access the class-level method, `Couchbase.bucket`
instead of `Couchbase.connect` to get the client instance.

When you use `Couchbase.bucket` it will create a new client object when you
first call it and then store the object in thread storage. If the thread is
still alive when the next request is made to the ruby process, the SDK will not
create a new client instance, but rather use the existing one:


```
# Simple example to connect using thread local singleton

Couchbase.connection_options = {:bucket => "my",
                                :hostname => "example.com",
                                :password => "secret"}

# this call will user connection_options to initialize new connection.

# By default Couchbase.connection_options can be empty

Couchbase.bucket.set("foo", "bar")

# Amend the options of the singleton connection in run-time

Couchbase.bucket.reconnect(:bucket => "another")
```

The first example demonstrates how you can create a client instance as a
singleton object, the second one will use the class-level `Couchbase.bucket`
constructor to create a persistent connection. The last example demonstrates how
you can update the properties of the singleton connection if you reconnect.

In the case of the Ruby SDK, you can set a timeout for the initial connection,
and then change the timeout setting. This new connection-level setting will
apply to any subsequent read/write requests made with the client instance:


```
#sets timeout for initial client instance and connection to server

conn = Couchbase.connect(:timeout => 3_000_000)

#resets the connection timeout for subsequent operations on connection

conn.timeout = 1_500_000

#set a value using client instance

conn.set("foo", "bar")
```

In this example, we create a new Couchbase client instance with
`Couchbase.connect()` and set the connection time out to 3 seconds. If the
client instance fails to connect in the three seconds, it will timeout and
return a failure to connect error. Then we set the timeout to `1_500_000`, or
1.5 seconds, which will be the timeout level of any requests made with that
client instance, such as the `set()`.

<a id="couchbase-sdk-ruby-store"></a>

# Ruby — Storage Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The Couchbase Ruby Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

**Unhandled thing here**
<a id="couchbase-sdk-ruby-set-add"></a>

## Add Operations

The `add` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_ruby_add"></a>

**API Call**                    | `object.add(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                       
**Description**                 | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.                                                                                                                           
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                   
**object value**                | Value to be stored                                                                                                                                                                                                                       
**hash options**                | Hash containing option/value pairs used during a set operation.                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                                
                                | `:ttl` (int)                                                                                                                                                                                                                             
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                              
                                | `:flags` (fixnum)                                                                                                                                                                                                                        
                                | Flags used during the set. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.                        
                                | `:format` (symbol)                                                                                                                                                                                                                       
                                | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.                           
                                | `:cas` (fixnum)                                                                                                                                                                                                                          
                                | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
**Exceptions**                  |                                                                                                                                                                                                                                          
`ArgumentError`                 | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`     | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists`   | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::ValueFormat` | Exception object indicating the value cannot be serialized with chosen encoder, for instance, occurs if you try to store Hash in :plain mode.                                                                                            

The `add` method adds a value to the database using the specified key.


```
couchbase.add("someKey", 0, someObject);
```

Unlike [Set
Operations](couchbase-sdk-ruby-ready.html#couchbase-sdk-ruby-set-set) the
operation can fail (and return false) if the specified key already exists.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will set the key:
```
c.add("foo", "bar")   # stores successully
c.add("foo", "baz")   # raises Couchbase::Error::KeyExists:
                      # fails to store value (key="foo", error=0x0c)
```



<a id="couchbase-sdk-ruby-set-replace"></a>

## Replace Operations

The `replace` methods update an existing key/value pair in the database. If the
specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_ruby_replace"></a>

**API Call**                  | `object.replace(key, value [, ruby-replace-options ])`                                                
------------------------------|-------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                    
**Description**               | Update an existing key with a new value                                                               
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                      
**Arguments**                 |                                                                                                       
**string key**                | Document ID used to identify the value                                                                
**object value**              | Value to be stored                                                                                    
**hash ruby-replace-options** | Hash of options containing key/value pairs                                                            
**Exceptions**                |                                                                                                       
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                             
`Couchbase::Error::KeyExists` | Exception object indicating the CAS value does not match the one for the record already on the server.
`Couchbase::Error::NotFound`  | Exception object specifying a given key cannot be found in datastore.                                 

The first form of the `replace` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


```
couchbase.replace("samplekey","updatedvalue",0);
```

<a id="couchbase-sdk-ruby-set-set"></a>

## Set Operations

The set operations store a value into Couchbase or Memcached using the specified
key and value. The value is stored against the specified key, even if the key
already exists and has data. This operation overwrites the existing with the new
data.

<a id="table-couchbase-sdk_ruby_set"></a>

**API Call**                    | `object.set(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                       
**Description**                 | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.                                                                                              
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                   
**object value**                | Value to be stored                                                                                                                                                                                                                       
**hash options**                | Hash containing option/value pairs used during a set operation.                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                                
                                | `:ttl` (int)                                                                                                                                                                                                                             
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                              
                                | `:flags` (fixnum)                                                                                                                                                                                                                        
                                | Flags used during the set. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.                        
                                | `:format` (symbol)                                                                                                                                                                                                                       
                                | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.                           
                                | `:cas` (fixnum)                                                                                                                                                                                                                          
                                | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
**Exceptions**                  |                                                                                                                                                                                                                                          
`Couchbase::Error::Connect`     | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists`   | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::ValueFormat` | Exception object indicating the value cannot be serialized with chosen encoder, e.g. if you try to store the Hash in :plain mode.                                                                                                        

Examples of using set as follows:


```
#Store a key/value which expires in 2 seconds using relative TTL

c.set("foo", "bar", :ttl => 2)


#Store the key that expires in 2 seconds using absolute TTL

c.set("foo", "bar", :ttl => Time.now.to_i + 2)

#Apply JSON document format for value at set

c.set("foo", {"bar" => "baz}, :format => :document)

#Use index and value as hash syntax to store value during set

c.set["foo"] = {"bar" => "baz}

#Use extended hash syntax to store a value at set

c["foo", {:flags => 0x1000, :format => :plain}] = "bar"

c["foo", :flags => 0x1000] = "bar"  # for ruby 1.9.x only

#Set application specific flags (note that it will be OR-ed with format flags)

c.set("foo", "bar", :flags => 0x1000)

#Perform optimistic locking by specifying last known CAS version

c.set("foo", "bar", :cas => 8835713818674332672)

#Perform asynchronous call

c.run do
      c.set("foo", "bar") do |ret|
            ret.operation   #=> :set
            ret.success?    #=> true
            ret.key         #=> "foo"
            ret.cas
      end
end
```

<a id="couchbase-sdk-ruby-set-flush"></a>

## Flush Operation

The `flush` operation deletes all values in a Couchbase bucket.

<a id="table-couchbase-sdk_ruby_flush"></a>

**API Call**     | `object.flush()`                                
-----------------|-------------------------------------------------
**Asynchronous** | no                                              
**Description**  | Deletes all values from the corresponding bucket
**Returns**      | `Boolean` ( Boolean (true/false) )              
**Arguments**    |                                                 
                 | None                                            

This operation is deprecated as of the 1.8.1 Couchbase Server, to prevent
accidental, detrimental data loss. Use of this operation should be done only
with extreme caution, and most likely only for test databases as it will delete,
item by item, every persisted record as well as destroy all cached data.

Third-party client testing tools may perform a `flush` operation as part of
their test scripts. Be aware of the scripts run by your testing tools and avoid
triggering these test cases/operations unless you are certain they are being
performed on your sample/test database.

Inadvertent use of `flush` on production databases, or other data stores you
intend to use will result in permanent loss of data. Moreover the operation as
applied to a large data store will take many hours to remove persisted records.


```
couchbase.flush
```

<a id="couchbase-sdk-ruby-retrieve"></a>

# Ruby — Retrieve Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

**Unhandled thing here**
<a id="table-couchbase-sdk_ruby_get"></a>

**API Call**                      | `object.get(keyn [, ruby-get-options ] [, ruby-get-keys ])`                                                                                                                                               
----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                                                                                                        
**Description**                   | Get one or more key values                                                                                                                                                                                
**Returns**                       | `hash` ( Container with key/value pairs )                                                                                                                                                                 
**Arguments**                     |                                                                                                                                                                                                           
**String/Symbol/Array/Hash keyn** | One or more keys used to reference a value                                                                                                                                                                
                                  | **Structure definition:**                                                                                                                                                                                 
                                  | `key` (string)                                                                                                                                                                                            
                                  | Key as string.                                                                                                                                                                                            
                                  | `keys` (strings)                                                                                                                                                                                          
                                  | Comma-separated strings for each key, e.g. client.get( "foo", "bar")                                                                                                                                      
                                  | `symbol` (symbol)                                                                                                                                                                                         
                                  | Symbol for each key to be retrieved, e.g. :foo.                                                                                                                                                           
                                  | `hash` (hash)                                                                                                                                                                                             
                                  | Key-expiration pairs provided in a hash-map, e.g.  c.get("foo" => 10, "bar" => 20). Returns has of key-values for given keys.                                                                             
**hash ruby-get-options**         | Hash of options containing key/value pairs                                                                                                                                                                
                                  | **Structure definition:**                                                                                                                                                                                 
                                  | `:extended` (boolean)                                                                                                                                                                                     
                                  | Default is false. If set to true, returns ordered with pairs. Pairs follow this convention: key => value, flags, cas. If you are getting one key, returns an array. More than one pair returned as a hash.
                                  | `:ttl` (int)                                                                                                                                                                                              
                                  | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                               
                                  | `:quiet` (boolean)                                                                                                                                                                                        
                                  | Suppresses errors while in synchronous mode. Default is true. If set to true, will return nil, and raise no error. In asynchronous mode, this option ignored.                                             
                                  | `:format` (symbol)                                                                                                                                                                                        
                                  | Determines how a value is represented. Default is nil. Explicitly choose the decoder for this option (:plain, :document, :marshal).                                                                       
**hash ruby-get-keys**            | Hash of options containing key/value pairs                                                                                                                                                                
                                  | **Structure definition:**                                                                                                                                                                                 
                                  | `key` (string)                                                                                                                                                                                            
                                  | Key as string.                                                                                                                                                                                            
                                  | `keys` (strings)                                                                                                                                                                                          
                                  | Comma-separated strings for each key, e.g. client.get( "foo", "bar")                                                                                                                                      
                                  | `symbol` (symbol)                                                                                                                                                                                         
                                  | Symbol for each key to be retrieved, e.g. :foo.                                                                                                                                                           
                                  | `hash` (hash)                                                                                                                                                                                             
                                  | Key-expiration pairs provided in a hash-map, e.g.  c.get("foo" => 10, "bar" => 20). Returns has of key-values for given keys.                                                                             
**Exceptions**                    |                                                                                                                                                                                                           
`ArgumentError`                   | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                           
`Couchbase::Error::Connect`       | Exception object specifying failure to connect to a node.                                                                                                                                                 
`Couchbase::Error::NotFound`      | Exception object specifying a given key cannot be found in datastore.                                                                                                                                     

The `get` method obtains an object stored in Couchbase using the default
transcoder for serialization of the object.

For example:


```
object = couchbase.get("someKey");
```

In this case, `couchbase` is the Couchbase client instance which stores a
connection to the server. Transcoding of the object assumes the default
transcoder was used when the value was stored. The returned object can be of any
type.

If the request key does no existing in the database then the returned value is
null.

The following show variations for using a `get` with different parameters and
settings:


```
#get single value; returns value or nil

c.get("foo")

#doing a get with hash-like syntax

c["foo"]

#get single value in verbose error mode setting
#returns ruby error if :quiet => false
#returns nil if :quiet => true

c.get("missing-foo", :quiet => false)
c.get("missing-foo", :quiet => true)

#get and update expiration time for single value

c.get("foo", :ttl => 10)

#get multiple keys

c.get("foo", "bar", "baz")

#perform an extended get, which returns ordered list of elements
#returns value, flags and cas and assigned to respective variable

val, flags, cas = c.get("foo", :extended => true)

#returns {"foo" => [val1, flags1, cas1], "bar" => [val2, flags2, cas2]}

c.get("foo", "bar", :extended => true)

#perform an asynchronous get

c.run do
    c.get("foo", "bar", "baz") do |ret|
      ret.operation   #=> :get
      ret.success?    #=> true
      ret.key         #=> "foo", "bar" or "baz" in separate calls
      ret.value
      ret.flags
      ret.cas
    end
end
```

<a id="couchbase-sdk-ruby-update"></a>

# Ruby — Update Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-ruby-update-append"></a>

## Append Methods

The `append` methods allow you to add information to an existing key/value pair
in the database. You can use this to add information to a string or other data
after the existing data.

The `append` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding an `Array` of integers into the database, and then
using `append` to add another integer will result in the key referring to a
serialized version of the array, immediately followed by a serialized version of
the integer. It will not contain an updated array with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

<a id="table-couchbase-sdk_ruby_append"></a>

**API Call**                  | `object.append(key, value [, ruby-append-options ])`                                                                                                                                                                                     
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                       
**Description**               | Append a value to an existing key                                                                                                                                                                                                        
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Document ID used to identify the value                                                                                                                                                                                                   
**object value**              | Value to be stored                                                                                                                                                                                                                       
**hash ruby-append-options**  | Hash of options containing key/value pairs                                                                                                                                                                                               
                              | **Structure definition:**                                                                                                                                                                                                                
                              | `:cas` (fixnum)                                                                                                                                                                                                                          
                              | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
                              | `:format` (symbol)                                                                                                                                                                                                                       
                              | Determines how a value is represented in storage. Possible values include :plain for string storage.                                                                                                                                     
**Exceptions**                |                                                                                                                                                                                                                                          
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists` | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::NotStored` | Exception object indicating the key/value does not exist in the database.                                                                                                                                                                

The `append` appends information to the end of an existing key/value pair. The
`append` function requires a CAS value. For more information on CAS values, see
[Ruby — Retrieve
Operations](couchbase-sdk-ruby-ready.html#couchbase-sdk-ruby-retrieve).

For example, to append a string to an existing key:


```
#sets foo key to text 'Hello'

couchbase.set("foo", "Hello")

#adds text to end of key foo, resulting in 'Hello, world!'

couchbase.append("foo", ", world!")

#gets foo
couchbase.get("foo")
#=> "Hello, world!"
```

Other examples of using `append` are as follows:


```
#Perform a simple append

c.set("foo", "aaa")
c.append("foo", "bbb")
c.get("foo")           # returns "aaabbb"

#Perform optimistic locking. The operations fails if the
#given CAS does not match the CAS for the key

ver = c.set("foo", "aaa")
c.append("foo", "bbb", :cas => ver)


#Creates custom data groups/sets using append
#appends minus to indicate item not part of set
#appends plus to indicate item is part of set

def set_add(key, *values)
    encoded = values.flatten.map{|v| "+#{v} "}.join
    append(key, encoded)
end

def set_remove(key, *values)
    encoded = values.flatten.map{|v| "-#{v} "}.join
    append(key, encoded)
end

def set_get(key)
    encoded = get(key)
    ret = Set.new

    encoded.split(' ').each do |v|
          op, val = v[0], v[1..-1]
          case op
                when "-"
                    ret.delete(val)
                when "+"
                    ret.add(val)
          end
    end
    ret
end
```

<a id="couchbase-sdk-ruby-cas"></a>

## Compare and Swap

Takes a given key, gets the value for the key, and yields it to a block.
Replaces the value in the datastore with the result of the block as long as the
key has not been updated in the meantime. If the the key has been successfully
updated in the datastore, a new CAS value will be returned raises
Error::KeyExists.

CAS stands for "compare and swap", and avoids the need for manual key mutexing.

<a id="table-couchbase-sdk_ruby_cas"></a>

**API Call**                  | `object.cas(key [, ruby-cas-options ])`                                                                                                                                                                             
------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | yes                                                                                                                                                                                                                 
**Description**               | Compare and set a value providing the supplied CAS key matches                                                                                                                                                      
**Returns**                   | ( Check and set object )                                                                                                                                                                                            
**Arguments**                 |                                                                                                                                                                                                                     
**string key**                | Document ID used to identify the value                                                                                                                                                                              
**hash ruby-cas-options**     | Hash of options containing key/value pairs                                                                                                                                                                          
                              | **Structure definition:**                                                                                                                                                                                           
                              | `:ttl` (int)                                                                                                                                                                                                        
                              | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                         
                              | `:format` (symbol)                                                                                                                                                                                                  
                              | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.      
                              | `:flags` (fixnum)                                                                                                                                                                                                   
                              | Flags used during the commit. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.
**Exceptions**                |                                                                                                                                                                                                                     
`Couchbase::Error::KeyExists` | Exception object indicateing the key was updated before the codeblock has completed and therefore the CAS value had changed.                                                                                        

The following illustrates use of the `cas` function:


```
#appends to a JSON-encoded value
# first sets value and formatting for stored value
        c.default_format = :document
        c.set("foo", {"bar" => 1})

#perform cas and provide value to block
        c.cas("foo") do |val|
              val["baz"] = 2
              val
        end

# returns {"bar" => 1, "baz" => 2}
        c.get("foo")
```

<a id="couchbase-sdk-ruby-update-decr"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Ruby Client Library methods support the use of an explicit
offset value that will be used to reduce the stored value in the database.

<a id="table-couchbase-sdk_ruby_decrement"></a>

**API Call**                    | `object.decrement(key [, offset ] [, ruby-incr-decr-options ])`                                                                                                                                                                     
--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                  
**Description**                 | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.                                                                          
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                  
**Arguments**                   |                                                                                                                                                                                                                                     
**string key**                  | Document ID used to identify the value                                                                                                                                                                                              
**offset**                      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                             
**hash ruby-incr-decr-options** | Hash of options containing key/value pairs                                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                           
                                | `:create` (boolean)                                                                                                                                                                                                                 
                                | Default is false. If set to true, it will initialize the key with zero value and zero flags (use :initial option to set another initial value). Note: this will not increment or decrement the missing value once it is initialized.
                                | `:initial` (fixnum)                                                                                                                                                                                                                 
                                | Default is 0. Can be an integer (up to 64 bits) for missing key initialization. This option automatically implies the :create option is true, regardless of the setting.                                                            
                                | `:ttl` (int)                                                                                                                                                                                                                        
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                         
                                | `:extended` (boolean)                                                                                                                                                                                                               
                                | Default is false. If set to true, the operation will return an array, \[value, cas\], otherwise it returns just the value.                                                                                                          

The first form of the `decr` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


```
couchbase.set("counter", 10)
couchbase.decr("counter", 5)
couchbase.get("counter") #returns 5
```

The following demonstrates different options available when using decrement:


```
#decrement key by one (default)

c.decr("foo")

#decrement by 50

c.decr("foo", 50)

#decrement key or initialize with zero

c.decr("foo", :create => true)

#decrement key or initialize with 3

c.decr("foo", 50, :initial => 3)

#decrement key and get CAS value

val, cas = c.decr("foo", :extended => true)

#decrementing signed number

c.set("foo", -100)
c.decrement("foo", 100500)   #=> 0

#decrementing zero
c.set("foo", 0)
c.decrement("foo", 100500)   #=> 0

#asynchronous use of decrement
c.run do
      c.decr("foo") do |ret|
            ret.operation   #=> :decrement
            ret.success?    #=> true
            ret.key         #=> "foo"
            ret.value
            ret.cas
      end
end
```

<a id="couchbase-sdk-ruby-update-delete"></a>

## Delete Methods

The `delete` method deletes an item in the database with the specified key.
Delete operations are synchronous only.

<a id="table-couchbase-sdk_ruby_delete"></a>

**API Call**                  | `object.delete(key [, ruby-delete-options ])`                                                                                                                                                                                                                                
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                                                           
**Description**               | Delete a key/value                                                                                                                                                                                                                                                           
**Returns**                   | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                                                                           
**Arguments**                 |                                                                                                                                                                                                                                                                              
**string key**                | Document ID used to identify the value                                                                                                                                                                                                                                       
**hash ruby-delete-options**  | Hash of options containing key/value pairs                                                                                                                                                                                                                                   
                              | **Structure definition:**                                                                                                                                                                                                                                                    
                              | `:quiet` (boolean)                                                                                                                                                                                                                                                           
                              | If set to true, the operation returns nil for failure. Otherwise it will raise error in synchronous mode. In asynchronous mode this option ignored.                                                                                                                          
                              | `:cas` (fixnum)                                                                                                                                                                                                                                                              
                              | The CAS value for an object. This value created on the server and is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update/delete an item simultaneously.
**Exceptions**                |                                                                                                                                                                                                                                                                              
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                                                              
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                                                    
`Couchbase::Error::KeyExists` | Exception object indicating mismatch of given cas and cas for record.                                                                                                                                                                                                        
`Couchbase::Error::NotFound`  | Exception object indicating key is missing. Occurs in verbose mode.                                                                                                                                                                                                          

For example, to delete an item you might use code similar to the following:


```
couchbase.delete("foo")
```

The following illustrates use of delete in Ruby along with various parameters
and settings:


```
#set and delete for key 'foo' in default mode

c.set("foo", "bar")
c.delete("foo")        #=> true

#attempt second delete in default mode

c.delete("foo")        #=> false

#attempt to delete a key with quiet mode and then verbose

c.set("foo", "bar")
c.delete("foo", :quiet => false)   #=> true
c.delete("foo", :quiet => true)    #=> nil (default behaviour)
c.delete("foo", :quiet => false)   #=> will raise Couchbase::Error::NotFound

#attempt to delete with version check using cas value

ver = c.set("foo", "bar")          #=> 5992859822302167040
c.delete("foo", :cas => 123456)    #=> will raise Couchbase::Error::KeyExists
c.delete("foo", :cas => ver)       #=> true
```

<a id="couchbase-sdk-ruby-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_ruby_increment"></a>

**API Call**                    | `object.increment(key [, offset ] [, ruby-incr-decr-options ])`                                                                                                                                                                                                                                                                           
--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                                                                                                                        
**Description**                 | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                                                                                                                        
**Arguments**                   |                                                                                                                                                                                                                                                                                                                                           
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**offset**                      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**hash ruby-incr-decr-options** | Hash of options containing key/value pairs                                                                                                                                                                                                                                                                                                
                                | **Structure definition:**                                                                                                                                                                                                                                                                                                                 
                                | `:create` (boolean)                                                                                                                                                                                                                                                                                                                       
                                | Default is false. If set to true, it will initialize the key with zero value and zero flags (use :initial option to set another initial value). Note: this will not increment or decrement the missing value once it is initialized.                                                                                                      
                                | `:initial` (fixnum)                                                                                                                                                                                                                                                                                                                       
                                | Default is 0. Can be an integer (up to 64 bits) for missing key initialization. This option automatically implies the :create option is true, regardless of the setting.                                                                                                                                                                  
                                | `:ttl` (int)                                                                                                                                                                                                                                                                                                                              
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                                                                                                                               
                                | `:extended` (boolean)                                                                                                                                                                                                                                                                                                                     
                                | Default is false. If set to true, the operation will return an array, \[value, cas\], otherwise it returns just the value.                                                                                                                                                                                                                

The first form of the `incr` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


```
couchbase.set("counter", 10)
couchbase.incr("counter", 5)
couchbase.get("counter") #=> 15
```

The second form of the `incr` method supports the use of a default value which
will be used to set the corresponding key if that value does already exist in
the database. If the key exists, the default value is ignored and the value is
incremented with the provided offset value. This can be used in situations where
you are recording a counter value but do not know whether the key exists at the
point of storage.

For example, if the key `counter` does not exist, the following fragment will
return 1000:


```
counter = couchbase.incr("counter", 1, :initial => 1000); #=> 1000
```

The following demonstrates different options available when using increment and
the output they produce:


```
#increment key by one (default)

c.incr("foo")

#increment by 50

c.incr("foo", 50)

#increment key or initialize with zero

c.incr("foo", :create => true)

#increment key or initialize with 3

c.incr("foo", 50, :initial => 3)

#increment key and get CAS value

val, cas = c.incr("foo", :extended => true)

#integer overflow from incrementing signed number

c.set("foo", -100)
c.get("foo")           #=> -100
c.incr("foo")          #=> 18446744073709551517

#asynchronous use of increment

c.run do
    c.incr("foo") do |ret|
          ret.operation   #=> :increment
          ret.success?    #=> true
          ret.key         #=> "foo"
          ret.value
          ret.cas
    end
end
```

<a id="couchbase-sdk-ruby-update-prepend"></a>

## Prepend Methods

The `prepend` methods insert information before the existing data for a given
key. Note that as with the `append` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend`.

<a id="table-couchbase-sdk_ruby_prepend"></a>

**API Call**                  | `object.prepend(key, value [, ruby-prepend-options ])`                                                                                                                                                                                   
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                       
**Description**               | Prepend a value to an existing key                                                                                                                                                                                                       
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Document ID used to identify the value                                                                                                                                                                                                   
**object value**              | Value to be stored                                                                                                                                                                                                                       
**hash ruby-prepend-options** | Hash of options containing key/value pairs                                                                                                                                                                                               
                              | **Structure definition:**                                                                                                                                                                                                                
                              | `:cas` (fixnum)                                                                                                                                                                                                                          
                              | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
                              | `:format` (symbol)                                                                                                                                                                                                                       
                              | Determines how a value is represented in storage. Possible values include :plain for string storage.                                                                                                                                     
**Exceptions**                |                                                                                                                                                                                                                                          
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists` | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::NotStored` | Exception object indicating the key/value does not exist in the database.                                                                                                                                                                

For example, to prepend a string to an existing key:


```
#set inital key, foo

couchbase.set("foo", "world!")

#prepend text 'Hello, ' to foo

couchbase.prepend("foo", "Hello, ")

#get new foo value

couchbase.get("foo") #=> "Hello, world!"
```

Other examples of using `prepend` are as follows:


```
#simple prepend example

c.set("foo", "aaa")
c.prepend("foo", "bbb")
c.get("foo")           #=> "bbbaaa"

#Perform optimistic locking. The operations fails if the
#given CAS does not match the CAS for the key

ver = c.set("foo", "aaa")
c.prepend("foo", "bbb", :cas => ver)


#Use explicit format options

c.default_format       #=>defaults to :document, or JSON document
c.set("foo", {"y" => "z"})

#sets added text to plain data and adds
c.prepend("foo", '[', :format => :plain)
c.append("foo", ', {"z": "y"}]', :format => :plain)

#get updated value
c.get("foo")           #=> [{"y"=>"z"}, {"z"=>"y"}]
```

<a id="couchbase-sdk-ruby-update-touch"></a>

## Touch Methods

The `touch` methods allow you to update the expiration time on a given key. This
can be useful for situations where you want to prevent an item from expiring
without resetting the associated value. For example, for a session database you
might want to keep the session alive in the database each time the user accesses
a web page without explicitly updating the session value, keeping the user's
session active and available.

In Ruby, `touch` can be used to update or more keys.

<a id="table-couchbase-sdk_ruby_touch-one"></a>

**API Call**                | `object.touch-one(key [, ruby-touch-options ] [, ruby-touch-keys ])`                                                                                                                                                             
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**            | no                                                                                                                                                                                                                               
**Description**             | Update the expiry time of an item                                                                                                                                                                                                
**Returns**                 | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                               
**Arguments**               |                                                                                                                                                                                                                                  
**string key**              | Document ID used to identify the value                                                                                                                                                                                           
**hash ruby-touch-options** | Hash of options containing key/value pairs                                                                                                                                                                                       
                            | **Structure definition:**                                                                                                                                                                                                        
                            | `:ttl` (fixnum)                                                                                                                                                                                                                  
                            | Expiration time for record. Default is indefinite, meaning the record will remain until an explicit delete command is made. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times from the epoch.
**hash ruby-touch-keys**    | Hash of options containing key/value pairs                                                                                                                                                                                       

The following examples demonstrate use of `touch` with a single key:


```
#update record so no expiration (record held indefinitely long)

c.touch("foo")

#update expiration to 10 seconds

c.touch("foo", :ttl => 10)

#alternate syntax for updating single value

c.touch("foo" => 10)
```

<a id="table-couchbase-sdk_ruby_touch-many"></a>

**API Call**                      | `object.touch-many(keyn)`                                                                                                    
----------------------------------|------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                           
**Description**                   | Update the expiry time of an item                                                                                            
**Returns**                       | `hash` ( Container with key/value pairs )                                                                                    
**Arguments**                     |                                                                                                                              
**String/Symbol/Array/Hash keyn** | One or more keys used to reference a value                                                                                   
                                  | **Structure definition:**                                                                                                    
                                  | `key` (string)                                                                                                               
                                  | Key as string.                                                                                                               
                                  | `keys` (strings)                                                                                                             
                                  | Comma-separated strings for each key, e.g. client.get( "foo", "bar")                                                         
                                  | `symbol` (symbol)                                                                                                            
                                  | Symbol for each key to be retrieved, e.g. :foo.                                                                              
                                  | `hash` (hash)                                                                                                                
                                  | Key-expiration pairs provided in a hash-map, e.g.  c.get("foo" => 10, "bar" => 20). Returns has of key-values for given keys.

The following examples demonstrate use of `touch` with multiple keys, which are
provided as a hash:


```
#update two records with 10 and 20 second expirations
#returns hash with key and success/fail
#{"foo" => true, "bar" => true}

c.touch("foo" => 10, :bar => 20)

#Update several values in asynchronous mode
c.run do
      c.touch("foo" => 10, :bar => 20) do |ret|
          ret.operation   #=> :touch
          ret.success?    #=> true
          ret.key         #=> "foo" and "bar" in separate calls
      end
end
```

<a id="couchbase-sdk-ruby-stats"></a>

# Ruby — Statistics Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The Couchbase Ruby Client Library includes support for obtaining statistic
information from all of the servers defined within a couchbase object. A summary
of the commands is provided below.

**Unhandled thing here**

```
couchbase.stats
#=> {...}
```

The `stats` command gets the statistics from all of the configured nodes. The
information is returned in the form of a nested Hash, first containing the
address of the configured server and then within each server the individual
statistics for that server as key value pairs.


```
{
    "172.16.16.76:12008"=>
    {
        "threads"=>"4",
        "connection_structures"=>"22",
        "ep_max_txn_size"=>"10000",
          ...
    },
    "172.16.16.76:12000"=>
    {
        "threads"=>"4",
        "connection_structures"=>"447",
        "ep_max_txn_size"=>"10000",
          ...
    },
    ...
}
```

<a id="table-couchbase-sdk_ruby_stats"></a>

**API Call**     | `object.stats([ statname ])`                                      
-----------------|-------------------------------------------------------------------
**Asynchronous** | no                                                                
**Description**  | Get the database statistics                                       
**Returns**      | `object` ( Binary object )                                        
**Arguments**    |                                                                   
**statname**     | Group name of a statistic for selecting individual statistic value

<a id="api-reference-view"></a>

# Finding Data with Views

### Note

The following document is still in production, and is not considered complete or
exhaustive.

In Couchbase 2.0 you can index and query JSON documents using *views*. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to:

 * Find all the documents in your database that you need for a particular process,

 * Create a copy of data in a document and present it in a specific order,

 * Create an index to efficiently find documents by a particular value or by a
   particular structure in the document,

 * Represent relationships between documents, and

 * Perform calculations on data contained in documents.

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * For technical details on views, how they operate, and how to write effective
   map/reduce queries, see [Couchbase Server 2.0:
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
   and [Couchbase Sever 2.0: Writing
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

 * Sample Patterns: to see examples and patterns you can use for views, see
   [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html).

 * Timestamp Pattern: many developers frequently ask about extracting information
   based on date or time. To find out more, see [Couchbase Views, Sample
   Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

The `View` Object is obtained by calling the appropriate view on the design
document associated with the view on the server.


```
client = Couchbase.connect
view = client.design_docs['docName'].viewName(params)
```

or


```
client = Couchbase.connect
view = Couchbase::View.new(client, "_design/docName/_view/viewName", params)
```

Where:

 * `docName`

   is the Design document name.

 * `viewName`

 * `params` are the parameters that can be passed such as `:descending`,
   `:include_docs` and so on.

The entire list of `params` are at
[http://wiki.apache.org/couchdb/HTTP\_view\_API\#Querying\_Options](http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options)

Some of the more frequently used parameters are listed below.

 * `startKey`

   to set the starting Key.

 * `endKey`

   to set the ending Key.

 * `descending`

   to set the descending to true or false.

 * `include_docs`

   to Include the original JSON document with the results.

 * `reduce`

   where the reduce function is included or excluded based on the Value.

 * `stale`

   where the possible values for stale are `false`, `update_after` and `ok` as
   noted in the Release Notes.

Process each row of the result using the following structure:


```
view.each do |post|
  # do something
  puts post.doc['date']
end
```

 * `id`

   to get the Id of the associated row.

 * `key`

   to get the Key of the associated Key/Value pair of the emit result.

 * `value`

   to get the Value of the associated Key/Value pair of the result.

 * `doc`

   to get the document associated with the row as long as the property
   :include\_docs is set to true.

For uses these classes, please refer to the `Squish` Tutorial we have expanded
since Couchbase 1.8 to include views.

<a id="couchbase-sdk-ruby-troubleshooting"></a>

# Ruby — Troubleshooting

<a id="couchbase-sdk-ruby-timed-operations"></a>

## Creating Timed Operations

One approach you can try if you get temporary out of memory errors from the
server is to explicitly pace the timing of requests you make. You can do this in
any SDK by creating a timer and only perform a Couchbase request after a
specific timed interval. This will provide a slight delay between server
requests and will reduce the risk of an out of memory error. For instance in
Ruby:


```
c.set("foo", 100)
n = 1

c.run do
    c.create_periodic_timer(500000) do |tm|
          c.incr("foo") do
              if n == 5
                  tm.cancel
              else
                  n += 1
              end
          end
    end
end
```

In this example we create a sample record `foo` with the initial fixnum value of
100. Then we create a increment count set to one, to indicate the first time we
will create a Couchbase request. In the event loop, we create a timing loop that
runs every.5 seconds until we have repeated the loop 5 times and our increment
is equal to 5. In the timer loop, we increment `foo` per loop.

<a id="couchbase-sdk-ruby-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-2-2"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.2 GA (11 Fabruary 2013)

**New Features and Behaviour Changes in 1.2.2**

 * EventMachine plugin to integrate with EventMachine library. Note that the engine
   is experimental at this stage. Example:

    ```
    require 'eventmachine'
    require 'couchbase'

    EM.epoll = true if EM.epoll?
    EM.kqueue = true if EM.kqueue?
    EM.run do
     con = Couchbase.connect(:engine => :eventmachine, :async => true)
     con.on_connect do |res|
     puts "connected: #{res.inspect}"
     if res.success?
     con.set("emfoo", "bar") do |res|
     puts "set: #{res.inspect}"
     con.get("emfoo") do |res|
     puts "get: #{res.inspect}"
     EM.stop
     end
     end
     else
     EM.stop
     end
     end
    end
    ```

 * Allow to use Bucket instance in completely asynchronous environment like this,
   without blocking on connect:

    ```
    conn = Couchbase.new(:async => true)
    conn.run do
     conn.on_connect do |res|
     if res.success?
     #
     # schedule async requests
     #
     end
     end
    end
    ```

 * View\#fetch\_all - async method for fetching all records

    ```
    conn.run do
     doc.recent_posts.fetch_all do |posts|
     do_something_with_all_posts(posts)
     end
    end
    ```

**Fixes in 1.2.2**

 * Data corruption on intensive store operations. The issue could also lead to
   segfaults.

   *Issues* : [RCBC-104](http://www.couchbase.com/issues/browse/RCBC-104)

 * Alias \#total\_rows as \#total\_entries on view result set to match
   documentation.

   *Issues* : [RCBC-118](http://www.couchbase.com/issues/browse/RCBC-118)

 * Bucket\#design\_docs will return a Hash with DesignDoc instances as a values.

<a id="couchbase-sdk-ruby-rn_1-2-1"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.1 GA (28 December 2012)

**Fixes in 1.2.1**

 * Improve internal structures of multi-threaded IO plugin to protect it from
   memory leaks when the Fiber object is forgotten.

 * Persistence constraints were not passed to mutation methods, so they were not
   applied properly.

   Here is the demonstration of the broken case, when we are require document to be
   persisted at least on two nodes:

    ```
    cas = c.set("foo", document, :observe => {:persisted => 2})
    ```

   The library here will store key and return without ensuring durability
   constraints.

   *Issues* : [RCBC-101](http://www.couchbase.com/issues/browse/RCBC-101)

 * Inconsistent return values in case of storage functions with persistence
   constraints. It always returns a Hash in case of multi-set, even if there is
   only one document is being set.

   *Issues* : [RCBC-102](http://www.couchbase.com/issues/browse/RCBC-102)

<a id="couchbase-sdk-ruby-rn_1-2-0n"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0 GA (12 December 2012)

**New Features and Behaviour Changes in 1.2.0**

 * Specialized io plugin for releasing Ruby GVL:

   Ruby 1.9.x uses global lock for ensuring integrity, and blocking calls should be
   called inside rb\_thread\_blocking\_region to allow other threads to be runned.

   Ruby 1.8.7 have only green threads, so that rb\_thread\_schedule should be
   called manually.

**Fixes in 1.2.0**

 * Catch exceptions from ruby callbacks

   *Issues* : [RCBC-42](http://www.couchbase.com/issues/browse/RCBC-42)

 * Remove debugger development dependency

 * Fix memory leaks and performance improvements

 * Read out the StringIO contents in json gem monkey patch

   *Issues* : [RCBC-99](http://www.couchbase.com/issues/browse/RCBC-99)

 * Use marshal serializer by default for session store

**Known Issues in 1.2.0**

 * The durability arguments for mutation methods ( `:observe` option) doesn't takes
   effect. It is fixed already and will be released with the next version.

   Here is the demonstration of the broken case, when we are require document to be
   persisted at least on two nodes:

    ```
    cas = c.set("foo", document, :observe => {:persisted => 2})
    ```

   The keys will be stored and return without ensuring durability constraints. As
   workaround you can ask it explicitly:

    ```
    cas = c.set("foo", document)
    c.observe_and_wait("foo" => cas)
    ```

   *Issues* : [RCBC-101](http://www.couchbase.com/issues/browse/RCBC-101)

 * The return values of storage functions (add/set/replace/append/prepend) isn't
   consistent when you are using durability constraints. That means it will return
   result always like for "multi" operation. Even if you are specifying just single
   key. Here is the demonstration of it.

   The Bucket\#set for example should return the object corresponding to arguments
   passed:

    ```
    irb> conn.set("foo", "bar")
    851339802448297984
    irb> conn.set("foo" => "bar", "baz" => "foo")
    {"foo"=>2995536636664938496, "baz"=>16831440216388861952}
    ```

   But when `:observe` option is used, it always return it like for multi-set:

    ```
    irb> conn.set("foo", "bar", :observe => {:persisted => 1})
    {"foo"=>2559248876759744512}
    ```

   The issue was fixed and will be released with next version.

   *Issues* : [RCBC-102](http://www.couchbase.com/issues/browse/RCBC-102)

<a id="couchbase-sdk-ruby-rn_1-2-0m"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.z.beta5 Beta (29 November 2012)

**New Features and Behaviour Changes in 1.2.0.z.beta5**

 * Allow to setup default initial value for INCR/DECR on per connection level.

 * Make error message about libcouchbase dependency more verbose.

**Fixes in 1.2.0.z.beta5**

 * Use response body to clarify Couchbase::Error::HTTP

   *Issues* : [RCBC-95](http://www.couchbase.com/issues/browse/RCBC-95)

 * Fix memory leaks: in async mode context wasn’t freed

<a id="couchbase-sdk-ruby-rn_1-2-0l"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.z.beta4 Beta (21 November 2012)

**New Features and Behaviour Changes in 1.2.0.z.beta4**

 * Do not expose docs embedded in HTTP response. Use binary protocol for it.

   *Issues* : [RCBC-89](http://www.couchbase.com/issues/browse/RCBC-89)

**Fixes in 1.2.0.z.beta4**

 * Update documentation about session store

   *Issues* : [RCBC-90](http://www.couchbase.com/issues/browse/RCBC-90)

 * Protect against non string values in :plain mode. Will raise error if the value
   given isn’t a string.

 * Remove all\_docs mentions. It isn’t recommended to use it because of performance
   issues

 * Do not hide ValueFormat reason. It is accessible using
   Couchbase::Error::Value\#inner\_exception.

 * Adjust version check for multijson monkeypatch (8098da1)

 * Reset global exception after usage

   *Issues* : [RCBC-94](http://www.couchbase.com/issues/browse/RCBC-94)

 * Make rack session store adapter quiet

 * Increase default connection timeout for Views up to 75 seconds

<a id="couchbase-sdk-ruby-rn_1-2-0k"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.z.beta3 Beta (16 October 2012)

**New Features and Behaviour Changes in 1.2.0.z.beta3**

 * Implement bucket create/delete operations

    ```
    conn = Couchbase::Cluster.new(:hostname => "localhost",
     :username => "Administrator", :password => "secret")
    conn.create_bucket("my_protected_bucket",
     :ram_quota => 500, # megabytes
     :sasl_password => "s3cr3tBuck3t")
    ```

   *Issues* : [RCBC-52](http://www.couchbase.com/issues/browse/RCBC-52)

**Fixes in 1.2.0.z.beta3**

 * Update to recent libcouchbase API

 * Fix build error on Mac OS X

   *Issues* : [RCBC-87](http://www.couchbase.com/issues/browse/RCBC-87)

 * Propagate status code for HTTP responses

 * Fix memory leaks

 * Use global scope to find Error classes (thanks to @wr0ngway)

<a id="couchbase-sdk-ruby-rn_1-2-0i"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.z.beta2 Beta (21 September 2012)

**Fixes in 1.2.0.z.beta2**

 * Not all rubies are fat on Mac OS X. Fixes build there

   *Issues* : [RCBC-82](http://www.couchbase.com/issues/browse/RCBC-82)

<a id="couchbase-sdk-ruby-rn_1-2-0h"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.z.beta Beta (18 September 2012)

**Fixes in 1.2.0.z.beta**

 * Fix version ordering by using ".z" prefix before.beta. The problem is that DP
   (Developer Preview) should have lower precedence than Beta, but alphabetially
   ".beta" orders before ".dp". This is why further Beta versions have ".z".

<a id="couchbase-sdk-ruby-rn_1-2-0g"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.beta Beta (18 September 2012)

**New Features and Behaviour Changes in 1.2.0.beta**

 * Implement Bucket\#unlock

    ```
    # Unlock the single key
    val, _, cas = c.get("foo", :lock => true, :extended => true)
    c.unlock("foo", :cas => cas)

    # Unlock several keys
    c.unlock("foo" => cas1, :bar => cas2)
    #=> {"foo" => true, "bar" => true}
    ```

   *Issues* : [RCBC-28](http://www.couchbase.com/issues/browse/RCBC-28)

 * Use RESTful flush

   *Issues* : [RCBC-79](http://www.couchbase.com/issues/browse/RCBC-79)

 * Expose client temporary failure error

   *Issues* : [RCBC-98](http://www.couchbase.com/issues/browse/RCBC-98)

 * Add attribute reader for Error::Base status code

**Fixes in 1.2.0.beta**

 * Protect against NoMethodError in extconf.rb. Fixes gem installation

   *Issues* : [RCBC-81](http://www.couchbase.com/issues/browse/RCBC-81)

 * Fix CAS conversion for Bucket\#delete method for 32-bit systems

<a id="couchbase-sdk-ruby-rn_1-2-0f"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp6 Developer Preview (28 June 2012)

**New Features and Behaviour Changes in 1.2.0.dp6**

 * Allow to read keys from replica

   *Issues* : [RCBC-50](http://www.couchbase.com/issues/browse/RCBC-50)

 * Expose number of replicas to the user

 * allow to skip username for protected buckets. the will use bucket name for
   credentials

   *Issues* : [RCBC-47](http://www.couchbase.com/issues/browse/RCBC-47)

 * Allow to specify delta for incr/decr in options

   *Issues* : [RCBC-39](http://www.couchbase.com/issues/browse/RCBC-39)

 * Storage functions with durability requirements. Examples:

    ```
    # Ensure that the key will be persisted at least on the one node
    c.set("foo", "bar", :observe => {:persisted => 1})
    ```

   *Issues* : [RCBC-49](http://www.couchbase.com/issues/browse/RCBC-49)

 * Implement Bucket\#observe command to query durable state. Examples:

    ```
    # Query state of the single key
    c.observe("foo")
    #=> [#<Couchbase::Result:0x00000001650df0 ...>, ...]

    # Query state of the multiple keys
    keys = ["foo", "bar"]
    stats = c.observe(keys)
    stats.size #=> 2
    stats["foo"] #=> [#<Couchbase::Result:0x00000001650df0 ...>, ...]
    ```

   *Issues* : [RCBC-6](http://www.couchbase.com/issues/browse/RCBC-6)

 * Expose timers API from libcouchbase

   *Issues* : [RCBC-57](http://www.couchbase.com/issues/browse/RCBC-57)

**Fixes in 1.2.0.dp6**

 * Fix Bucket\#cas operation behaviour in async mode. The callback of the
   Bucket\#cas method is triggered only once, when it fetches old value, and it
   isn¿t possible to receive notification if the next store operation was
   successful. Example, append JSON encoded value asynchronously:

    ```
    c.default_format = :document
    c.set("foo", {"bar" => 1})
    c.run do
     c.cas("foo") do |val|
     case val.operation
     when :get
     val["baz"] = 2
     val
     when :set
     # verify all is ok
     puts "error: #{ret.error.inspect}" unless ret.success?
     end
     end
    end
    c.get("foo") #=> {"bar" => 1, "baz" => 2}
    ```

   *Issues* : [RCBC-40](http://www.couchbase.com/issues/browse/RCBC-40)

 * Replicate flags in Bucket\#cas operation

   *Issues* : [RCBC-59](http://www.couchbase.com/issues/browse/RCBC-59)

 * Bootstrapping using multiple nodes

    ```
    Couchbase.connect(:node_list => ['example.com:8091', 'example.org:8091', 'example.net'])
    ```

   *Issues* : [RCBC-37](http://www.couchbase.com/issues/browse/RCBC-37)

 * Inherit StandardError instead RuntimeError for errors

 * More docs and examples on Views

   *Issues* : [RCBC-43](http://www.couchbase.com/issues/browse/RCBC-43)

 * Apply timeout value before connection. Currently libcouchbase shares timeouts
   for connection and IO operations. This patch allows to setup timeout on the
   instantiating the connection.

<a id="couchbase-sdk-ruby-rn_1-2-0e"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp5 Developer Preview (15 June 2012)

**New Features and Behaviour Changes in 1.2.0.dp5**

 * Implement key prefix (simple namespacing)

    ```
    Couchbase.connect(:key_prefix => "prefix:")
    ```

 * Implement cache store adapter for Rails

    ```
    cache_options = {
     :bucket => 'protected',
     :username => 'protected',
     :password => 'secret',
     :expires_in => 30.seconds
    }
    config.cache_store = :couchbase_store, cache_options
    ```

 * Allow to force assembling result Hash for multi-get

    ```
    connection.get("foo", "bar")
    #=> [1, 2]
    connection.get("foo", "bar", :assemble_hash => true)
    #=> {"foo" => 1, "bar" => 2}
    ```

 * Integrate with Rack and Rails session store

    ```
    # rack
    require 'rack/session/couchbase'
    use Rack::Session::Couchbase

    # rails
    require 'action_dispatch/middleware/session/couchbase_store'
    AppName::Application.config.session_store :couchbase_store
    ```

<a id="couchbase-sdk-ruby-rn_1-2-0d"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp4 Developer Preview (07 June 2012)

**Fixes in 1.2.0.dp4**

 * Now it is possible to stop event loop (asynchronous mode)```
   conn.run do
    10.times do |ii|
    conn.get("foo") do |ret|
    puts ii
    conn.stop if ii == 5
    end
    end
   end
   ```

 * The Bucket\#replace documentation has been updated to include :cas option

 * Fixed an issue causing a segfault on releasing Request object (couchdb HTTP
   request, aka view request) which was completed already. The behavior was
   dependent on GC.

   *Issues* : [RCBC-36](http://www.couchbase.com/issues/browse/RCBC-36)

<a id="couchbase-sdk-ruby-rn_1-2-0c"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp3 Developer Preview (06 June 2012)

**Fixes in 1.2.0.dp3**

 * Break out from event loop for non-chunked responses. View results are chunked by
   default, so there no problems, but other requests like
   Bucket\#save\_design\_doc() were "locking" awaiting forever.

 * Fix for multi\_json < 1.3.3

   MultiJson gem was changed several method names and this made couchbase gem
   incompatible with old multi\_json versions. The fix makes couchbase working with
   both old and new versions of 'multi\_json'.

 * Break out from event loop for non-chunked responses (fix creating design create)

<a id="couchbase-sdk-ruby-rn_1-2-0b"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp2 Developer Preview (06 June 2012)

**New Features and Behaviour Changes in 1.2.0.dp2**

 * Allow to stop event loop from ruby

 * This fix allows mixing of sync and async approaches. The library maintain the
   counter of the pending requests called 'seqno' and now it is possible to block
   and wait for completion of part of the command:```
   conn.run do
    100.times do |n|
    connection.set("key" + n, {"val" => n})
    end
    # conn.seqno is 100 at this point
    conn.wait_for_seqno(40)
    # after this line seqno will be <= 40
   end
   ```

 * Implement get with lock operation. GETL operation introduces another level of
   locking (in addition to CAS optimistic locks). Now you can lock key(s) for some
   period, and all other clients will get error if will try to update it,
   regardless of CAS. The lock could be reset by using correct CAS, or timeout will
   pass. See the example:

    ```
    irb> require 'couchbase'
    true
    irb> Couchbase.bucket.set("foo", "bar")
    6133961393559502848
    irb> Couchbase.bucket.get("foo", :lock => 10)
    "bar"
    irb> Couchbase.bucket.set("foo", "baz")
    Couchbase::Error::KeyExists: failed to store value (key="foo", error=0x0c)
     from (irb):4:in `set'
     from (irb):4
     from /home/avsej/.rvm/rubies/ruby-1.9.3-p194/bin/irb:16:in `<main>'
    irb> sleep(10)
    10
    irb> Couchbase.bucket.set("foo", "baz")
    15331330723597713408
    ```

   More examples:

    ```
    # Get and lock key using custom timeout
    c.get("foo", :lock => 3)

    # Get and lock key using default timeout
    c.get("foo", :lock => true)

    # Determine lock timeout parameters
    c.stats.values_at("ep_getl_default_timeout", "ep_getl_max_timeout")
    #=> [{"127.0.0.2:11210"=>"15"}, {"127.0.0.1:11210"=>"30"}]
    ```

   *Issues* : [RCBC-76](http://www.couchbase.com/issues/browse/RCBC-76)

 * This fix allows for mixng of sync and async approaches. In asynchronous mode
   user chooses the threshold when the library should flush the buffers to the
   network:

    ```
    conn.run(:send_threshold => 100) do # 100 bytes
    connection.set("uniq_id", "foo" * 100)
    ```

 * Use monotonic high resolution clock internally

**Fixes in 1.2.0.dp2**

 * Fix the View parameters escaping. More info at https://gist.github.com/2775050

   *Issues* : [RCBC-35](http://www.couchbase.com/issues/browse/RCBC-35)

 * Use multi\_json gem. json\_gem compatibility (require ¿yajl/json\_gem¿) is
   notorious for causing all kinds of issues with various gems. The most compatible
   way to use yajl is to call Yajl::Parser and Yajl::Encoder directly

   *Issues* : [RCBC-34](http://www.couchbase.com/issues/browse/RCBC-34)

 * Define views only if "views" key are present. Do not try to iterate "views"
   subkey on design document if it is empty. There was unhandled exception for
   design docs without views.

 * Make Bucket\#get more consistent. The pattern of using more than one argument to
   determine if an array should be returned is not idiomatic. Consider the case of
   a multi-get in an application where I have n items to return. If there happens
   to be only one item it will be treated differently than if there happens to be 2
   items.

    ```
    get(["foo"]) #=> ["bar"]
    get("foo") #=> "bar"
    get(["x"], :extended => true) #=> {"x"=>["xval", 0, 18336939621176836096]}
    ```

   *Issues* : [RCBC-31](http://www.couchbase.com/issues/browse/RCBC-31)

 * Fixed view iterator. It doesn't lock event loop anymore This used to cause
   "locks", memory leaks or even segmentation fault.

<a id="couchbase-sdk-ruby-rn_1-2-0a"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.0.dp Developer Preview (10 April 2012)

**New Features and Behaviour Changes in 1.2.0.dp**

 * [Couchbase Server
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
   is accessible using the view APIs. Please refer to [for getting
   started](http://www.couchbase.com/develop/ruby/current) with views.

**Fixes in 1.2.0.dp**

 * On Mac OS X, `libcouchbase` and `libvbucket` do not need to be installed prior
   to installing Couchbase when installing via homebrew with the `brew` command.

 * Fixed a bug when 'Couchbase.connection\_options' for "default" connection, when
   there are several arguments to pass to the connect() function when establishing
   thread local connection as below```
   Couchbase.connection_options = {:port => 9000, :bucket => 'myapp'}
   ```

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

