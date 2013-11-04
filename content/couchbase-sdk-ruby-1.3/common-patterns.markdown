# Common Patterns

<a id="couchbase-sdk-ruby-timed-operations"></a>

## Creating Timed Operations

One approach you can try if you get temporary out of memory errors from the
server is to explicitly pace the timing of requests you make. You can do this in
any SDK by creating a timer and only performing a Couchbase request after a
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
runs every.5 seconds until we have repeat the loop 5 times and our increment is
equal to 5. In the timer loop, we increment `foo` each time we loop.

<a id="couchbase-sdk-ruby-eventmachine"></a>

## Using EventMachine

The Ruby SDK provides integration with EventMachine so you can perform
asynchronous operations with the server. This is very important for web
applications these days because a project can gather attention and grow a user
base in days or even hours. You can quickly run into problems, such as the [C10K
problem](http://www.kegel.com/c10k.html) when the number of users grow quickly.
When you provide asynchronous operations, you can maintain application
performance for your users while growing your user base..

Asynchronous network services can handle a lot of active connection
simultaneously, and there are a lot of libraries and frameworks which make it
more easier. The Ruby client use libcouchbase which is a library written in C
and implements the reactor pattern.

By default libcouchbase comes with bindings to two popular event libraries:
[libevent](http://libevent.org/) and
[libev](http://software.schmorp.de/pkg/libev.html). There is special layer in
libcouchbase which allows substitution of IO easily. The Ruby client substitutes
IO in two cases, meaning it comes with two additional IO engines. The first
engine in the Ruby client is Ruby thread-friendly, because it tries to release
Ruby [GVL](http://en.wikipedia.org/wiki/Global_Interpreter_Lock) as long as
possible when it does IO. This is the default behavior for the Ruby SDK. The
second Ruby-specific engine is one using routines from
[EventMachine](http://rubyeventmachine.com/). To understand more about the
couchbase gem and EventMachine read [this blog
post](http://blog.couchbase.com/using-couchbase-ruby-gem-eventmachine).

The EventMachine library is Ruby implementation of the [reactor
pattern](http://en.wikipedia.org/wiki/Reactor_pattern). It can solve C10K
problems for applications written in Ruby, and in this section we will describe
how to write efficient application using the asynchronous server
[goliath](http://goliath.io) and the framework
[grape](http://rdoc.info/github/intridea/grape). You can find all the code for
this example in the `examples/chat-goliath-grape` directory of the source
distribution.

First we show you how to configure a couchbase connection. We will use
`EventMachine::Synchrony::ConnectionPool` so the client can handle multiple
threads:


```
config['couchbase'] = EventMachine::Synchrony::ConnectionPool.new(:size => 5) do
  Couchbase::Bucket.new(:engine => :eventmachine)
end
```

This allocates a pool of five connection instances and stores the connections
into a `config` object; this object will be available as a method on an `env`
object during a request.

We use `grape` to declare our API endpoints and `goliath` to run it
asynchronously on EventMachine. This code connects these libraries and wraps the
whole `grape` application into a `goliath` handler:


```
class App < Goliath::API
  def response(env)
    Chat.call(env)
  rescue => e
    [
      500,
      {'Content-Type' => 'application/json'},
      MultiJson.dump(:error => e, :stacktrace => e.backtrace)
    ]
  end
end
```

Here the `Chat` class contains the definition of our API. Since the service
communicates JSON we catch all errors, reformat them into JSON and stream the
errors back to the client:


```
class Chat < Grape::API

  format :json

  resource 'messages' do
    get do
      view = env.couchbase.design_docs["messages"].all
      msgs = view.map do |r|
        {
          "id" => r.id,
          "key" => r.key,
          "value" => r.value,
          "cas" => r.meta["cas"]
        }
      end
      {"ok" => true, "messages" => msgs}
    end

    post do
      payload = {
        "timestamp" => DateTime.now.iso8601,
        "message" => params["message"]
      }
      id = env.couchbase.incr("msgid", :initial => 1)
      id = "msg:#{id}"
      cas = env.couchbase.set(id, payload)
      {"ok" => true, "id" => id, "cas" => cas}
    end
  end

end
```

Our `Chat` class defines a single resource `messages` which responds to `GET`
and `POST` HTTP methods. We first describe a `post do... end` action block
first. Here we extract the message string from input parameters and build a
payload of new messages with a timestamp.

As the next step we use a `incr` operation to get the next message ID. In
Couchbase this operation is atomic, so it is safe to do it in the case of
multiple application instances. After that, we store a new message document with
a `set` operation and report upon success to the client. The hash we return will
be automatically converted to JSON, because of the `format :json` declaration on
the top of the class.

`GET /messages` handler requires no parameters and returns all the message
documents stored in the cluster. In the first line of the handler we create a
`Couchbase::View` object which is bound to `/_design/messages` design document.
For more information about design documents and Views, see [Couchbase Manual,
Views and
Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).


```
view = env.couchbase.design_docs["messages"].all
```

Here you can pass View parameters when you create the object. For example, if
you want to load documents along with view results, just pass `:include_docs =>
true` :


```
view = env.couchbase.design_docs["messages"].all(:include_docs => true
```

The `Couchbase::View` class includes the
[Enumerable](http://ruby-doc.org/core-2.0/Enumerable.html) module, which
supports convenience methods available, such as `#map`, which you saw
previously. Note that the view object itself doesn't fetch data until you query
it.

As the last note, we should probably show the server-side map function, which
the server uses to index:


```
function(doc, meta) {
  if (doc.timestamp) {
    emit(meta.id, doc)
  }
}
```

This function can be either defined using the Couchbase Web Console, or you can
create it in your program (see
[Bucket\#save\_design\_doc](http://www.couchbase.com/autodocs/couchbase-ruby-client-1.2.3/Couchbase/Bucket.html#save_design_doc-instance_method)
method). For more information about using the Web Console, see [Couchbase
Manual, Using the Views
Editor](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-editor.html).

The next examples show how you can query a view. We will use
[curl](http://curl.haxx.se/download.html) tool, which probably available on your
distribution by default. This example was tested with recent stable version of
the Ruby interpreter [2.0.0](http://www.ruby-lang.org/en/downloads/).

Start the goliath server up:


```
$ ruby app.rb -sv
```

Query the server for a single message:


```
$ curl -X POST -Fmessage="Hello world" http://localhost:8091/messages
{"ok":true,"id":"msg:1","cas":11880713153673363456}
```

Query for all messages with this command:


```
$ curl -X GET http://localhost:8091/messages
{"ok":true,"messages":[{"id":"msg:1","key":"msg:1","value":{"timestamp":"2013-04-11T12:43:42+03:00","message":"Hello world"},"cas":11880713153673363456}]}
```

<a id="couchbase-sdk-ruby-transcoder"></a>

## Data Transcoders

More often these days we build heterogeneous application systems. They are
heterogeneous in a sense of programming languages, frameworks and even database
storage. And more often this is the case when we want to gracefully transition
an older system to newer one, and this occurs more often in this constantly
changing world. This section will describe a technique which provides custom
data formatting into an application. This feature is in the almost every
Couchbase client, and we call it `Transcoders`. This feature is available in the
Ruby client since version 1.3.0.

So the transcoder API is simple; it is the class or instance, which responds to
the two methods, `dump` and `load`. The semantic is very straight forward: dump
returns a bytestream (String) representation of an object along with new flags.
The signature is:


```
def dump(obj, flags, options = {})
  # do conversion
  [blob, new_flags]
end
```

The `options` hash will contain some context from the library which helps
identify when the conversion occurs. Currently takes only one parameter,
`:forced` which means that the transcoder is explicitly passed to the operation.
Compare the two different examples of using an implicit or explicit transcoder:


```
# default transcoder is Couchbase::Transcoder::Document
conn = Couchbase.connect
# implicit, used default transcoder, in this case :forced => false
conn.set("foo", "bar")
# explicit, used MyCustom transcoder, and :forced => true
conn.set("foo", "bar", :transcoder => MyCustom)
```

The `load` method is even simpler. It converts the stream back into the object:


```
def load(blob, flags, options = {})
  # check flags and decode value
  obj
end
```

This method can also accept `:forced` as an option. The Ruby library comes with
three predefined transcoders: Document, Marshal and Plain, which are in file
`lib/couchbase/transcoder.rb`. You can use these transcoders with an earlier
version of the Ruby formatting API, therefore the patch won't break applications
built on earlier versions of the library:


```
conn.default_format = :document
conn.get("foo", :format => :marshal) # {:force => true}
```

Below is a transcoder which will compress and decompress all values using Gzip.
Its object initializer accepts any other transcoder and can format the results:


```
require 'zlib'
require 'stringio'

class GzipTranscoder
  FMT_GZIP = 0x04

  def initialize(base = nil)
    @base = base || Couchbase::Transcoder::Plain
  end

  def dump(obj, flags, options = {})
    obj, flags = @base.dump(obj, flags, options)
    io = StringIO.new
    gz = Zlib::GzipWriter.new(io)
    gz.write(obj)
    gz.close
    [io.string, flags|FMT_GZIP]
  end

  def load(blob, flags, options = {})
    # decompress value only if gzip flag set
    if (flags & FMT_GZIP) == FMT_GZIP
      io = StringIO.new(blob)
      gz = Zlib::GzipReader.new(io)
      blob = gz.read
      gz.close
    end
    @base.load(blob, flags, options)
  end
end
```

This shows you how you can use this transcoder after you create a connection:


```
conn = Couchbase.connect
conn.transcoder = GzipTranscoder.new
conn.get("foo")
```

<a id="couchbase-sdk-connection-pool"></a>

## Using Couchbase::ConnectionPool

When your application using threads for better concurrency or parallelism, it is
become important to carefully use all data structures. For example you cannot
share `Couchbase::Bucket` instance between threads. But the library contains
special class `Couchbase::ConnectionPool` which designed to leverage
[connection\_pool gem](https://rubygems.org/gems/connection_pool) and protect
`Couchbase::Bucket`. Note that the `Couchbase::ConnectionPool` class available
only for ruby 1.9+. Here is small example, which demonstrates how to use it:


```
require 'rubygems'
require 'couchbase'

CONFIG = {
  :node_list => ["example.net:8091"],
  :key_prefix => "pool_",
  :pool_size => 3
}

# returns the thread-safe pool object, which proxies all methods to
# the Couchbase::Bucket instance
def connection(bucket)
  @servers ||= {}
  @servers[bucket] ||= begin
                         size = CONFIG[:pool_size]
                         params = CONFIG.merge(:bucket => bucket)
                         Couchbase::ConnectionPool.new(size, params)
                       end
end

connection("default").set('foo', 'bar')

threads = []
5.times do
  threads << Thread.new do
    connection("default").get('foo')
  end
end

threads.map do |t|
  puts [t.object_id, t.value].join("\t")
end
```

If you will run it in your terminal, it should printout a table of thread IDs
and the values, received from the Couchbase Server like this:


```
shell> ruby base.rb
70236984451160    bar
70236984451080    bar
70236984451000    bar
70236984450920    bar
70236984389840    bar
```

<a id="couchbase-sdk-ruby-rn"></a>
