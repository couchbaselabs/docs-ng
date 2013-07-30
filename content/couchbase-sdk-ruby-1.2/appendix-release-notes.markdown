# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-2-3"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.3 GA (02 April 2013)

**Fixes in 1.2.3**

 * Make ActiveSupport::Cache::CouchbaseStore threadsafe

 * Update documentation bits regarding SET operations

 * Check for gethrtime. Needed for solaris/smartos

<a id="couchbase-sdk-ruby-rn_1-2-2"></a>

## Release Notes for Couchbase Client Library Ruby 1.2.2 GA (11 February 2013)

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
