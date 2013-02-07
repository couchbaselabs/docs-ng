<a id="couchbase-sdk-ruby-1-2"></a>

# Couchbase Client Library Ruby 1.2

This is the manual for 1.2 of the Couchbase Ruby client library, which is
compatible with Couchbase Server 1.8.


### External Community Resources

 *  [Download Client
    Library](http://packages.couchbase.com/clients/ruby/couchbase-1.2.0.dp6.gem)

 *  [Ruby Client Library](http://www.couchbase.com/develope/ruby/next)

 *  [SDK Forum](http://www.couchbase.com/forums/sdks/sdks)


<a id="getting-started"></a>

# Getting Started

Now that you've installed Couchbase and have probably created a cluster of
Couchbase servers, it is time to install the client library for Ruby, and start
manipulating data.

Here's a quick outline of what you'll learn in this article:

 1.  Installing the Ruby Couchbase Client (Gem)
     [Couchbase](https://github.com/couchbase/couchbase-ruby-client).

 2.  Writing a simple program to demonstrate connecting to Couchbase and saving some
     data.

 3.  Exploring some of the API methods that will take you further than the simple
     program.

This section assumes that you have installed Couchbase Ruby SDK and you have
installed the Couchbase server on your development machine. We assume you have
at least one instance of Couchbase Server and one data bucket established. If
you need to set up these items in Couchbase Server, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

 *  [Using the Couchbase Web
    Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
    for information on using the Couchbase Administrative Console,

 *  [Couchbase
    CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
    for the command line interface,

 *  [Couchbase REST
    API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
    for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="couchbase-sdk-ruby-getting-started-installing"></a>

## Installing the Couchbase Client Library

Before continuing you should ensure you have a working `Ruby` environment up and
running. We recommend the following:

 *  Ruby `1.9.2` or `1.8.7`  [http://ruby-lang.org](http://ruby-lang.org)

 *  Rubygems `1.8.15`  [https://rubygems.org](https://rubygems.org)

You can verify that Ruby and RubyGems are installed by typing the following
commands:


    shell> ruby -v

and


    shell> gem --version

The Ruby version should be 1.8.7 or higher. Rubygems must be 1.3.6 or higher.

 1.  Install the package `libevent`.

 2.  Then install the Couchbase C Client library, `libcouchbase`

 3.  The next step is to install `libvbucket` which is also part of the Couchbase
     client library.

 4.  You may need to install `rubygems` as well, if not already installed.

 5.  Once you have Rubygems installed you can simply use it to install Couchbase as
     below.

         shell> gem install couchbase

<a id="couchbase-sdk-ruby-getting-started-hello"></a>

## Hello Couchbase

Let's look at a very simple Ruby program to interact with Couchbase. We want to
set a key and on subsequent runs of the application we will output the key if it
exists or create it if it does not. We'll also set a Time to Live (TTL) so that
the key we set will expire after 10 seconds.

If you want to follow along with this example, to make things easier we've
provided a [repository](https://github.com/avsej/couchbase-examples-ruby) of the
code used in this tutorial. To that we've added a `Gemfile` for use with
[Bundler](http://gembundler.com).

If you want a head start you can grab the example code and get going straight
away. Open up a new Terminal window and type the following:


    shell> git clone git@github.com:avsej/couchbase-examples-ruby.git
    shell> cd couchbase-examples-ruby
    shell> sudo bundle install

Now that you have a copy of the code, let's look at what's happening.

Listing 1: `Gemfile`

In the above, we simply require all Gem dependencies for the `hello-world.rb`
example. If you didn't have them already they will be installed when you run
`bundle install` as below.


    shell> sudo bundle install

or, if you have already installed the dependencies, you can run the sample
program by simply running the command


    shell> ruby hello-world.rb

Listing 2: `hello-world.rb`


    require 'rubygems'
    require 'couchbase'

    client = Couchbase.connect("http://127.0.0.1:8091/pools/default")
    client.quiet = false
    begin
      spoon = client.get "spoon"
      puts spoon
    rescue Couchbase::Error::NotFound => e
      puts "There is no spoon."
      client.set "spoon", "Hello World!", :ttl => 10
    end

The first 3 lines are some bootstrap code for `Bundler`, to load it and then
have it load all the Gems specified in our `Gemfile`.

We then create a new connection to our Couchbase Server. Remember to change the
connection details `127.0.0.1:8091` if you are working with couchbase remotely
or on another port.

The last few lines are the meat of what's happening, let's go through them in
more detail:


    `ruby
    begin
      ...
    rescue Couchbase::Error::NotFound => e
      ...
    end

If we try to retrieve a key from Couchbase that does not exist it will raise a
`Couchbase::Error::NotFound` error. So to be able to handle this we start a
begin/rescue block and specify we want to only rescue from that error.


    `ruby
    spoon = client.get "spoon"
    puts spoon

Now we attempt to `get` the contents of the key "spoon". If it exists, we
continue and output the value of that key.


    `ruby
    puts "There is no spoon."
    client.set "spoon", "Hello World!", 10

Lastly if the key doesn't exist and our attempt to `get` raises a
`Couchbase::Error::NotFound` error then our rescue block will be triggered. In
which we're just outputting to the terminal again and then setting a value for
our key "spoon". For the purposes of the example we're passing a 3rd (optional)
paramter to the `set` method specifying a `TTL` Time to Live (expiry time in
seconds).

That's it. We're ready to run our first Couchbase program.


    shell> ruby hello-world.rb

The first time you run the program it should produce the following output


    shell> ruby hello-world.rb
    There is no spoon.

If you are to run it again within 10 seconds it should produce this output


    shell> ruby hello-world.rb
    Hello World!

If you are to run it after 10 seconds it should produce the following output
based on the Time To Live (TTL) specified.


    shell> ruby hello-world.rb
    There is no spoon.

Way to go! You've just interacted with Couchbase for the first time. We've
looked at getting and setting the value of a key and expiring the cache.

<a id="couchbase-sdk-ruby-getting-started-conclusion"></a>

## Conclusion

You now know how to obtain the Ruby Couchbase Client, and write small Ruby
programs to connect with your Couchbase cluster and interact with it.
Congratulations, you will be able to save your servers from burning down, and
impress your users with the blazing fast response that your application will be
able to achieve.

<a id="tutorial"></a>

# Couchbase and Rails Tutorial

Now that you've installed Couchbase Server 2.0 and have probably created a
cluster of Couchbase servers, it is time to install the Couchbase Ruby SDK, and
start working with the data.

Here's a quick outline of what you'll learn in this article:

 1.  Install the Ruby Couchbase Client Dependencies
     [Couchbase](https://github.com/couchbase/couchbase-ruby-client).

 2.  Write a more advanced application in Rails to connect, save and update data in
     Couchbase Server 2.0.

This section assumes that you have installed Couchbase Ruby SDK and you have
installed the Couchbase Server 2.0 on your development machine. We assume you
have at least one instance of Couchbase Server 2.0 and one data bucket
established. If you need to set up these items in Couchbase Server, you can do
this either with the Couchbase Administrative Console, with Couchbase
Command-Line Interface (CLI), or with Couchbase REST-API. For information and
instructions, see:

 *  [Using the Couchbase Web
    Console](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console.html),
    for information on using the Couchbase Administrative Console,

 *  [Couchbase
    CLI](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-cmdline.html),
    for the command line interface,

 *  [Couchbase REST
    API](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi.html),
    for creating and managing Couchbase resources.

After you have Couchbase Server 2.0 set up and you have installed the Couchbase
Ruby SDK and dependencies, you can compile and run the following basic program.

<a id="couchbase-sdk-ruby-tutorial-installation"></a>

## Installing the Couchbase Ruby SDK Dependencies

Before continuing you should ensure you have a working `Ruby` environment up and
running. We recommend the following:

 *  Ruby `1.9.2` or `1.8.7`  [http://ruby-lang.org](http://ruby-lang.org)

 *  Ruby Version Manager `RVM`
    [https://rvm.beginrescueend.com/](https://rvm.beginrescueend.com)

 *  Rubygems `1.8.6`  [https://rubygems.org](https://rubygems.org)

 *  Bundler `1.0`  [http://gembundler.com/](http://gembundler.com)

<a id="couchbase-sdk-ruby-tutorial-railsapp"></a>

## Example Rails Application (Squish)

For the purposes of this tutorial, we have specially prepared an example
application for you to follow along with. You can download
[Squish](https://github.com/couchbaselabs/couchbase-squish) from Github.
`Squish` is a simple URL shortener implemented with `Couchbase`.

To get started, lets first get the source code. Open up a new Terminal window
and type the following:


    shell> git clone git://github.com/couchbaselabs/couchbase-squish.git
    shell> cd couchbase-squish
    shell> bundle install

Now that you have the source and all of the dependencies, we can start the
application and see what's happening.


    shell> rails server


![](images/couchbase-squish.png)

In a URL shortening application there are a number of features we would like to
accomplish. Let's define what they are:

 *  User should be able to save a valid URL. `client.set`

 *  User can visit the shortened URL and is redirected to the long one. `client.get`

 *  A user visiting a URL should increment number of hits for a given URL.
    `client.set`

<a id="couchbase-sdk-ruby-tutorial-activerecord"></a>

## Not your mother's ActiveRecord

Rails is based on conventions, one of those is that you'll want to be using a
`SQL` database. We don't. So what things should we do differently.

Listing 1: `Gemfile`


    `ruby
    source 'http://rubygems.org'

    # Rails 3.1, Asset Pipeline and Javascript
    gem 'rails', '3.1.0'
    group :assets do
      gem 'sass-rails', "  ~> 3.1.0"
      gem 'coffee-rails', "~> 3.1.0"
      gem 'uglifier'
    end
    gem 'jquery-rails'

    # Required to give an executable JS environment
    # in Production on Heroku
    group :production do
      gem 'therubyracer-heroku', '0.8.1.pre3'
    end

    # Development / Test only.
    group :development, :test do
      gem 'ruby-debug'
    end
    group :test do
      gem 'turn', :require => false
    end
    group :development do
      gem 'thin'
    end

    # Squish Application Dependencies
    gem "couchbase", "~> 1.2.0.dp"
    gem "couchbase-model", "~> 0.1.0"
    gem "validate_url"

The major difference from this Gemfile and a freshly generated Rails application
is that we're not using `sqlite` and we have required `couchbase` instead. Also
we required `couchbase-model` gem for ORM-like API for couchbase.

`couchbase-model` gem deserves its own paragraph here, because it provides handy
bindings for rails (and not only) applications. First of all it allows describe
your data in declarative way, like most ORM for ruby do (see **Couldn't resolve
xref tag: couchbase-model** ), so that you can keep your buisness rules and
logic along with data decription.

### `Example of model definition`


    class Post < Couchbase::Model
      attribute :title
      attribute :body
      attribute :created_at, :default => lambda{ Time.zone.now }
    end

The second is that the `couchbase-model` gem simplifies connection
configuration. With command `rails generate couchbase:config` you can generate
`config/couchbase.yml` with all the options needed to connect to couchbase
server.

### `Generating config`


    $ rails generate couchbase:config
    create  config/couchbase.yml

### `config/couchbase.yml generated for project named "tutorial".`


    common: &common
      hostname: localhost
      port: 8091
      username:
      password:
      pool: default

    development:
      <<: *common
      bucket: tutorial_development

    test:
      <<: *common
      bucket: tutorial_test

    # set these environment variables on your production server
    production:
      hostname: <%= ENV['COUCHBASE_HOST'] %>
      port: <%= ENV['COUCHBASE_PORT'] %>
      username: <%= ENV['COUCHBASE_USERNAME'] %>
      password: <%= ENV['COUCHBASE_PASSWORD'] %>
      pool: <%= ENV['COUCHBASE_POOL'] %>
      bucket: <%= ENV['COUCHBASE_BUCKET'] %>

And the third good thing, why you should take a look at `couchbase-model` gem is
its automatic design document upgrade. It means each time the server is starting
(in development mode for each request), the application will check the
filesystem changes of the map/reduce javascript files and update design document
if needed.


    .
    └── app
        └── models
            ├── link
            │   ├── by_created_at
            │   │   └── map.js
            │   ├── by_session_id
            │   │   └── map.js
            │   └── by_view_count
            │       └── map.js
            └── link.rb

Views are stored in the one of the directories from
`Couchbase::Model::Configuration.design_documents_paths` array, which by default
set to `config.paths["app/models"]` for the rails applications. Generally this
means you could put design document directory everywhere you can put the model
classes. The design document directory contains subdirectories named after views
with special files `map.js` and `reduce.js` where latter could be omitted. To
generate the new view use `rails generate couchbase:view DESIGNDOCNAME
VIEWNAME`, for example:

### `Generating view`


    $ rails generate couchbase:view link by_view_count
          create  app/models/link/by_view_count/map.js
          create  app/models/link/by_view_count/reduce.js

The generated files contain instructions and examples. You just need to edit
them or remove some of them (for example `reduce.js` ).

### `config/application.rb`


    `ruby
    require File.expand_path('../boot', __FILE__)

      # require 'rails/all'
      #
      # require "active_record/railtie"
      require "action_controller/railtie"
      # require "action_mailer/railtie"
      # require "active_resource/railtie"
      # require "rails/test_unit/railtie"

      if defined?(Bundler)
        # If you precompile assets before deploying to production, use this line
        # Bundler.require *Rails.groups(:assets => %w(development test))
        # If you want your assets lazily compiled in production, use this line
        Bundler.require(:default, :assets, Rails.env)
      end

      module CouchbaseTinyurl
        class Application  Rails::Application
          # ...
          config.encoding = "utf-8"

          # Configure sensitive parameters which will be filtered from the log file.
          config.filter_parameters += [:password]

          # Enable the asset pipeline
          config.assets.enabled = true
        end
      end

Out of the box, Rails will require `rails/all` which will load all aspects of
Rails. For this application we only need `action_controller`. This cuts the boot
time down significantly.

Listing 3: `config/environments/development.rb`


    `ruby
    CouchbaseTinyurl::Application.configure do
      # ...
      # config.action_mailer.raise_delivery_errors = false
      # ...
    end

One last thing to ensure unloading all those other Rails modules doesn't hurt
us. We need to remove the `action_mailer` configuration options for Development
and Test environments.

Now that we've got our application configured just right for using Couchbase we
can start connecting with the server.

<a id="couchbase-sdk-ruby-tutorial-connecting"></a>

## Connecting to Couchbase

Listing 5: `app/models/couch.rb`


    `ruby
    module Couch

          class << self

            def domain
              return "http://#{ENV['COUCHBASE_DOMAIN']}" if ENV['COUCHBASE_DOMAIN']
              case Rails.env.to_s
                when "production"  then "http://127.0.0.1"
                when "test"        then "http://127.0.0.1"
                when "development" then "http://127.0.0.1"
              end
            end

            def client
              @client ||= Couchbase.new "#{domain}:8091/pools/default"
            end

          end

        end

Because we have the concept of an `environment` in Rails, we wrote this small
module to enable us to configure where our couchbase instance is located. Then
throughout our code we can reference `Couch.client` which will return our
Couchbase Client object.

<a id="couchbase-sdk-ruby-tutorial-apibasics"></a>

## Defining an API

Just because we aren't using ActiveRecord doesn't mean we can't have a nice API,
thanks to `ActiveModel` we can very easily create a simple Model to encapsulate
our `Link` object. What would such an API look like? Let's define how we would
interact with a Couchbase model from our `Controller`.

Listing 6: `app/controllers/links_controller.rb`


    `ruby
    class LinksController < ApplicationController
      def create
        @link = Link.new(params[:link])
        @link.session_id = session[:session_id]
        if @link.save
          respond_to do |format|
            format.html { redirect_to @link }
            format.js
          end
        else
          respond_to do |format|
            format.html { render :new }
            format.js
          end
        end
      end

      def short
        @link = Link.find(params[:id])
        redirect_to root_path unless @link
        @link.views += 1
        @link.save
        redirect_to @link.url
      end

      def show
        @link = Link.find(params[:id])
      end

      def new
        @link = Link.new
      end

      def my
        @filter = "my_links"
        @filtered_links = Link.my(session[:session_id])
        @link = Link.new
      end

      def recent
        @filter = "recent"
        @filtered_links = Link.recent
        @link = Link.new
      end

      def popular
        @filter = "popular"
        @filtered_links = Link.popular
        @link = Link.new
      end

    end

So, in looking at our sketched out `Controller` above we can see how we would
like to interact with our `Link` object.

 *  We can initialize a new `Link` with a `Hash` of attributes. e.g. `Link.new(
    params[:link] )`

 *  We can access and set a `Link` 's attributes. e.g. `@link.session_id =
    session[:session_id]`

 *  We can save a new `Link` to couchbase. e.g. `@link.save`

 *  We can find and instantiate a `Link` object. e.g. `Link.find( params[:id] )`

<a id="couchbase-sdk-ruby-tutorial-couchbasemodel"></a>

## Defining a Couchbase Model

Now that we know what kind of an API we want to expose from our `Link` Model,
let's define it.

Listing 7: `app/models/link.rb`


    `ruby
    class Link

      include ActiveModel::Validations
      include ActiveModel::Conversion
      extend ActiveModel::Callbacks
      extend ActiveModel::Naming

      # Couch Model

      attr_accessor :url, :key, :views, :session_id, :created_at

      define_model_callbacks :save
      validates :url, :presence => true, :url => {:allow_nil => true, :message => "This is not a valid URL"}
      before_save :generate_key

      def generate_key
        while self.key.nil?
          random = SecureRandom.hex(2)
          self.key = random if self.class.find(random).nil?
        end
      end

      # ActiveModel

      def initialize(attributes = {})
        @errors = ActiveModel::Errors.new(self)
        attributes.each do |name, value|
          setter = "#{name}="
          next unless respond_to?(setter)
          send(setter, value)
        end
        self.views ||= 0
        self.created_at ||= Time.zone.now
      end

      def to_param
        self.key
      end

      def persisted?
        return false unless (key && valid?)
        # TODO need a better way to track if an object is *dirty* or not...
        self.class.find(key).url == self.url
      end

      def save
        return false unless valid?
        run_callbacks :save do
          Couch.client.set(self.key, {
            :type => self.class.to_s.downcase,
            :url => self.url,
            :key => self.key,
            :views => self.views,
            :session_id => self.session_id,
            :created_at => self.created_at
          })
        end
        true
      end

      def self.find(key)
        return nil unless key
        begin
          doc = Couch.client.get(key)
          self.new(doc)
        rescue Couchbase::Error::NotFound => e
          nil
        end
      end

    end

Might seem like a lot to take in at once, let's break it down into the three
main responsibilities of the Class.

 *  Creating a basic `ActiveModel` implementation to integrate with Couchbase

 *  Defining some `Model` logic for the `Link`.

<a id="couchbase-sdk-ruby-tutorial-activemodel"></a>

## Couchbase + ActiveModel

Listing 7a: `app/models/link.rb` \[line:3..6\]


    `ruby
    include ActiveModel::Validations
    include ActiveModel::Conversion
    extend ActiveModel::Callbacks
    extend ActiveModel::Naming

Firstly we include all the aspects of `ActiveModel` that we would like to use.

Listing 7b: `app/models/link.rb` \[line:8\]


    `ruby
    attr_accessor :url, :key, :views, :session_id, :created_at

Our model needs some `Attributes` so we define them.

Listing 7c: `app/models/link.rb` \[line:23..32\]


    `ruby
    def initialize(attributes = {})
        @errors = ActiveModel::Errors.new(self)
        attributes.each do |name, value|
          next unless @@keys.include?(name.to_sym)
          send("#{name}=", value)
        end
        self.views ||= 0
        self.created_at ||= Time.zone.now
      end

In our `initialize` method we are doing the following:

 *  Initializing an `ActiveModel::Errors` object that will work with the validations
    we'll define later.

 *  Iterating through the `Hash` of attributes passed in. We check if our list of
    attribute keys and if it matches we assign that attribute to the passed in
    value.

Listing 7d: `app/models/link.rb` \[line:34..36\]


    `ruby
    def to_param
                 self.key
               end

To work with rails `link_to` methods we need to implement this method. As we
would like to use our generated key.

Listing 7e: `app/models/link.rb` \[line:38..42\]


    `ruby
    def persisted?
                 return false unless (key && valid?)
                 # TODO use a better way to track if an object is *dirty* or not...
                 self.class.find(key).url == self.url
               end

So that our `Link` objects know wether they are a `new?` object or not, we
implemented this method. There are better ways to track this, just to
demonstrate things working, once a Link is `valid?` we are checking to see if
the object has been persisted and that the url matches.

Listing 7f: `app/models/link.rb` \[line:44..56\]


    `ruby
    def save
       return false unless valid?
       run_callbacks :save do
         # TODO should client.set return nil if successful? don't think so
         Couch.client.set(self.key, {
           :type => self.class.to_s.downcase,
           :url => self.url,
           :key => self.key,
           :views => self.views,
           :session_id => self.session_id,
           :created_at => self.created_at
         })
       end
     end

Saving a complex document to `Couchbase` is a simple as passing a Hash of
attributes as the second parameter to `client.set(key, value)`.

Listing 7g: `app/models/link.rb` \[line:58..66\]


    `ruby
    def self.find(key)
       return nil unless key
       begin
         doc = Couch.client.get(key)
         self.new(doc)
       rescue Couchbase::Error::NotFound => e
         nil
       end
     end

Here we've implemented a simple find method that will get a given document from
couchbase based on the key. It's worth noting that `Couchbase` will raise an
error if the document you're trying to access doesn't exist in which case we
rescue and return a nil.

<a id="couchbase-sdk-ruby-tutorial-linkmodel"></a>

## The Link Model

Everything we've done up to now is providing a bit of framework to our code to
allow us to create our Link object.

Listing 7h: `app/models/link.rb` \[line:8..19\]


    `ruby
    attr_accessor :url, :key, :views, :session_id, :created_at

    define_model_callbacks :save
    validates :url, :presence => true, :url => {:allow_nil => true}
    before_save :generate_key

    def generate_key
      while self.key.nil?
        random = SecureRandom.hex(2)
        self.key = random if self.class.find(random).nil?
      end
    end

What we are left with here is quite simple, we've already mentioned defining the
attributes. Next, we're telling `ActiveModel` that it should give us a callback
to bind to for the `save` method of a Link. Next we setup a validation on the
`url` attribute, we're using the built-in `presence` validator and we've
included a third party validation by way of the [validate\_url
Gem](https://rubygems.org/gems/validate_url). Finally we setup our save callback
to call the `generate_key` method which takes care of creating a unique short
key for our Links.

### `app/models/link.rb [line:41..51]`


    def self.popular
      by_view_count(:descending => true).to_a
    end

    def self.my(session_id)
      by_session_id(:key => session_id).to_a
    end

    def self.recent
      by_created_at(:descending => true).to_a
    end

Finally, we define some helper methods that return the output of our views. For
each of the defined `map` functions, `Couchbase` will define named methods at
runtime on your `design document`. With the popular and most recent methods we
are passing in query parameters to `Couchbase` ( [Couchbase Manual 2.0: Querying
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying.html)
) are a number of other query parameters you can pass to Couchbase that will
change the output of your map functions). As we want the most recent and most
popular data we sort with `:descending => true`. For viewing all the documents
created by one user, we want to query for all documents matching a specific
session\_id and so we execute the view with `:key => session_id` which only
returns those documents emitted with a matching session\_id.

<a id="couchbase-sdk-ruby-tutorial-conclusion"></a>

## Conclusion

And that's it. You now know how to install all the dependencies for working with
Couchbase and Rails. You can integrate Couchbase with your Rails projects,
whilst keeping a decent object orientated structure and we've started to explore
some of the other features of Couchbase.

<a id="couchbase-sdk-ruby-summary"></a>

# Ruby Method Summary

The `Ruby Client Library` supports the full suite of API calls to Couchbase. A
summary of the supported methods are listed in
[](#table-couchbase-sdk-ruby-summary).

<a id="table-couchbase-sdk-ruby-summary"></a>

Method                                                                                                      | Title                                                         
------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------
[`object.add(key, value, options)`](#table-couchbase-sdk_ruby_add)                                          | Add a value with the specified key that does not already exist
[`object.append(key, value [, ruby-append-options ])`](#table-couchbase-sdk_ruby_append)                    | Append a value to an existing key                             
[`object.cas(key [, ruby-cas-options ])`](#table-couchbase-sdk_ruby_cas)                                    | Compare and set a value providing the supplied CAS key matches
**Couldn't resolve link tag: table-couchbase-sdk\_ruby\_couchbase\_new**                                    | New alias for creating Couchbase client instance.             
**Couldn't resolve link tag: table-couchbase-sdk\_ruby\_couchbase\_connect**                                | Create connection to Couchbase Server                         
[`object.decrement(key [, offset ] [, ruby-incr-decr-options ])`](#table-couchbase-sdk_ruby_decrement)      | Decrement the value of an existing numeric key                
[`object.delete(key [, ruby-delete-options ])`](#table-couchbase-sdk_ruby_delete)                           | Delete a key/value                                            
[`object.flush()`](#table-couchbase-sdk_ruby_flush)                                                         | Deletes all values from a server                              
[`object.get(keyn [, ruby-get-options ] [, ruby-get-keys ])`](#table-couchbase-sdk_ruby_get)                | Get one or more key values                                    
[`object.increment(key [, offset ] [, ruby-incr-decr-options ])`](#table-couchbase-sdk_ruby_increment)      | Increment the value of an existing numeric key                
[`object.prepend(key, value [, ruby-prepend-options ])`](#table-couchbase-sdk_ruby_prepend)                 | Prepend a value to an existing key                            
[`object.replace(key, value [, ruby-replace-options ])`](#table-couchbase-sdk_ruby_replace)                 | Update an existing key with a new value                       
[`object.set(key, value, options)`](#table-couchbase-sdk_ruby_set)                                          | Store a value using the specified key                         
[`object.stats([ statname ])`](#table-couchbase-sdk_ruby_stats)                                             | Get the database statistics                                   
[`object.touch-many(keyn)`](#table-couchbase-sdk_ruby_touch-many)                                           | Update the expiry time of an item                             
[`object.touch-one(key [, ruby-touch-options ] [, ruby-touch-keys ])`](#table-couchbase-sdk_ruby_touch-one) | Update the expiry time of an item                             

<a id="couchbase-sdk-ruby-summary-synchronous"></a>

## Synchronous Method Calls

The Ruby Client Library supports the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the following fragment stores and retrieves a single key/value
pair:


    `ruby
    couchbase.set("foo", 3600, value);

    foo = couchbase.get("foo");

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


    `ruby
    couchbase = Couchbase.connect(:async => true)

    couchbase.run do |conn|
          conn.get("foo") {|ret| puts ret.value}
          conn.set("bar", "baz")
    end

The asynchronous callback will recieve an instance of `Couchbase::Result` which
can respond to several methods:

 *  `success?` : Returns true if asynchronous operation succeeded.

 *  `error` : Returns nil or exception object (subclass of Couchbase::Error::Base)
    if asynchronous operation failed.

 *  `key` : Returns key from asynchronous call.

 *  `value` : Returns value from asynchronous call.

 *  `flags` : Returns flags from asynchronous call.

 *  `cas` : CAS value obtained from asynchronous call.

 *  `node` : Node used in asynchronous call.

 *  `operation` : Symbol representing the type of asynchronous call.

<a id="couchbase-sdk-ruby-connection"></a>

# Ruby — Connection Operations

<a id="table-couchbase-sdk-ruby-connection-summary"></a>

Method                                                                       | Title                                            
-----------------------------------------------------------------------------|--------------------------------------------------
**Couldn't resolve link tag: table-couchbase-sdk\_ruby\_couchbase\_new**     | New alias for creating Couchbase client instance.
**Couldn't resolve link tag: table-couchbase-sdk\_ruby\_couchbase\_connect** | Create connection to Couchbase Server            

Creates a connection with the Couchbase Server. There are several ways to
establish new connection to Couchbase Server. By default a Couchbase SDK uses
the `http://localhost:8091/pools/default/buckets/default` as the endpoint. The
client will automatically adjust configuration when the cluster rebalances, when
the cluster returns from failover, or when you add or delete nodes. Returns the
exception object `Couchbase::Error::Connect` if it fails to connect. The
following creates a default connection:


    `ruby
    c = Couchbase.connect
    c2 = Couchbase.new

Note that `Couchbase.new` is a new alias for `connect`, as of the 1.1 version of
the Ruby SDK.

The following are equivalent alternatives to connect to the same node, using
different syntax:


    `ruby
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

You can also provide a list of possible nodes to connect to in order to avoid a
failure to connect due to a missing node. After your Couchbase client
successfully connects, it will use the most current cluster topology, not this
list, to connect to a node after rebalance or failover. To provide multiple
possible nodes for initial connection:


    `ruby
    c = Couchbase.connect(:bucket => "mybucket",
                          :node_list => ['example.com:8091', example.net'])

Here is creating a connection to a protected bucket by providing a username and
password. Notice that the username you provide is the same as the bucket:


    `ruby
    Couchbase.connect(:bucket => 'protected',
                      :username => 'protected',
                      :password => 'secret')

    Couchbase.connect('http://localhost:8091/pools/default/buckets/protected',
                      :username => 'protected',
                      :password => 'secret')

The possible errors that can occur when you try to connect are:

 *  `Couchbase::Error::BucketNotFound`. Occurs if the bucket name your provide does
    not exist.

 *  `Couchbase::Error::Connect`. Occurs if the socket to connect to Couchbase Server
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


    # Simple example to connect using thread local singleton

    Couchbase.connection_options = {:bucket => "my",
                                    :hostname => "example.com",
                                    :password => "secret"}

    # this call will user connection_options to initialize new connection.

    # By default Couchbase.connection_options can be empty

    Couchbase.bucket.set("foo", "bar")

    # Amend the options of the singleton connection in run-time

    Couchbase.bucket.reconnect(:bucket => "another")

The first example demonstrates how you can create a client instance as a
singleton object, the second one will use the class-level `Couchbase.bucket`
constructor to create a persistent connection. The last example demonstrates how
you can update the properties of the singleton connection if you reconnect.

In the case of the Ruby SDK, you can set a timeout for the initial connection,
and then change the timeout setting. This new connection-level setting will
apply to any subsequent read/write requests made with the client instance:


    #sets timeout for initial client instance and connection to server

    conn = Couchbase.connect(:timeout => 3_000_000)

    #resets the connection timeout for subsequent operations on connection

    conn.timeout = 1_500_000

    #set a value using client instance

    conn.set("foo", "bar")

In this example, we create a new Couchbase client instance with
`Couchbase.connect()` and set the connection time out to 3 seconds. If the
client instance fails to connect in the three seconds, it will timeout and
return a failure to connect error. Then we set the timeout to `1_500_000`, or
1.5 seconds, which will be the timeout level of any requests made with that
client instance, such as the `set()`.

<a id="couchbase-sdk-ruby-store"></a>

# Ruby — Storage Operations

The Couchbase Ruby Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="table-couchbase-sdk-ruby-store-summary"></a>

Method                                                                                      | Title                                                         
--------------------------------------------------------------------------------------------|---------------------------------------------------------------
[`object.add(key, value, options)`](#table-couchbase-sdk_ruby_add)                          | Add a value with the specified key that does not already exist
[`object.replace(key, value [, ruby-replace-options ])`](#table-couchbase-sdk_ruby_replace) | Update an existing key with a new value                       
[`object.set(key, value, options)`](#table-couchbase-sdk_ruby_set)                          | Store a value using the specified key                         

<a id="couchbase-sdk-ruby-set-add"></a>

## Add Operations

The `add` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_ruby_add"></a>

**API Call**                    | `object.add(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**                 | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.                                                                                                                           
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                
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


    `ruby
    couchbase.add("someKey", 0, someObject);

Unlike [Set Operations](#couchbase-sdk-ruby-set-set) the operation can fail (and
return false) if the specified key already exists.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will set the key:

    `ruby
    c.add("foo", "bar")   # stores successully
    c.add("foo", "baz")   # raises Couchbase::Error::KeyExists:
                          # fails to store value (key="foo", error=0x0c)



<a id="couchbase-sdk-ruby-set-replace"></a>

## Replace Operations

The `replace` methods update an existing key/value pair in the database. If the
specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_ruby_replace"></a>

**API Call**                  | `object.replace(key, value [, ruby-replace-options ])`                                                
------------------------------|-------------------------------------------------------------------------------------------------------
**Description**               | Update an existing key with a new value                                                               
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                      
**Arguments**                 |                                                                                                       
**string key**                | Key used to reference the value. The key cannot contain control characters or whitespace.             
**object value**              | Value to be stored                                                                                    
**hash ruby-replace-options** | Hash of options containing key/value pairs                                                            
**Exceptions**                |                                                                                                       
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                             
`Couchbase::Error::KeyExists` | Exception object indicating the CAS value does not match the one for the record already on the server.
`Couchbase::Error::NotFound`  | Exception object specifying a given key cannot be found in datastore.                                 

The first form of the `replace` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


    `ruby
    couchbase.replace("samplekey","updatedvalue",0);

<a id="couchbase-sdk-ruby-set-set"></a>

## Set Operations

The set operations store a value into Couchbase or Memcached using the specified
key and value. The value is stored against the specified key, even if the key
already exists and has data. This operation overwrites the existing with the new
data.

<a id="table-couchbase-sdk_ruby_set"></a>

**API Call**                    | `object.set(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**                 | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.                                                                                              
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                
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


    `ruby
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

<a id="couchbase-sdk-ruby-set-flush"></a>

## Flush Operation

The `flush` operation deletes all values in a Couchbase bucket.

<a id="table-couchbase-sdk_ruby_flush"></a>

**API Call**    | `object.flush()`                  
----------------|-----------------------------------
**Description** | Deletes all values from a server  
**Returns**     | `Boolean` ( Boolean (true/false) )
**Arguments**   |                                   
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


    `ruby
    couchbase.flush

<a id="couchbase-sdk-ruby-retrieve"></a>

# Ruby — Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

<a id="table-couchbase-sdk-ruby-retrieve-summary"></a>

Method                                                                                       | Title                     
---------------------------------------------------------------------------------------------|---------------------------
[`object.get(keyn [, ruby-get-options ] [, ruby-get-keys ])`](#table-couchbase-sdk_ruby_get) | Get one or more key values

<a id="table-couchbase-sdk_ruby_get"></a>

**API Call**                      | `object.get(keyn [, ruby-get-options ] [, ruby-get-keys ])`                                                                                                                                               
----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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


    `ruby
    object = couchbase.get("someKey");

In this case, `couchbase` is the Couchbase client instance which stores a
connection to the server. Transcoding of the object assumes the default
transcoder was used when the value was stored. The returned object can be of any
type.

If the request key does no existing in the database then the returned value is
null.

The following show variations for using a `get` with different parameters and
settings:


    `ruby
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

<a id="couchbase-sdk-ruby-update"></a>

# Ruby — Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

<a id="table-couchbase-sdk-ruby-update-summary"></a>

Method                                                                                                      | Title                                                         
------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------
[`object.append(key, value [, ruby-append-options ])`](#table-couchbase-sdk_ruby_append)                    | Append a value to an existing key                             
[`object.cas(key [, ruby-cas-options ])`](#table-couchbase-sdk_ruby_cas)                                    | Compare and set a value providing the supplied CAS key matches
[`object.decrement(key [, offset ] [, ruby-incr-decr-options ])`](#table-couchbase-sdk_ruby_decrement)      | Decrement the value of an existing numeric key                
[`object.delete(key [, ruby-delete-options ])`](#table-couchbase-sdk_ruby_delete)                           | Delete a key/value                                            
[`object.flush()`](#table-couchbase-sdk_ruby_flush)                                                         | Deletes all values from a server                              
[`object.increment(key [, offset ] [, ruby-incr-decr-options ])`](#table-couchbase-sdk_ruby_increment)      | Increment the value of an existing numeric key                
[`object.prepend(key, value [, ruby-prepend-options ])`](#table-couchbase-sdk_ruby_prepend)                 | Prepend a value to an existing key                            
[`object.touch-many(keyn)`](#table-couchbase-sdk_ruby_touch-many)                                           | Update the expiry time of an item                             
[`object.touch-one(key [, ruby-touch-options ] [, ruby-touch-keys ])`](#table-couchbase-sdk_ruby_touch-one) | Update the expiry time of an item                             

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
**Description**               | Append a value to an existing key                                                                                                                                                                                                        
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                
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
[Ruby — Retrieve Operations](#couchbase-sdk-ruby-retrieve).

For example, to append a string to an existing key:


    `ruby
    #sets foo key to text 'Hello'

    couchbase.set("foo", "Hello")

    #adds text to end of key foo, resulting in 'Hello, world!'

    couchbase.append("foo", ", world!")

    #gets foo
    couchbase.get("foo")
    #=> "Hello, world!"

Other examples of using `append` are as follows:


    `ruby
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
**Description**               | Compare and set a value providing the supplied CAS key matches                                                                                                                                                      
**Returns**                   | ( Check and set object )                                                                                                                                                                                            
**Arguments**                 |                                                                                                                                                                                                                     
**string key**                | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                           
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


    `ruby
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
**Description**                 | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.                                                                          
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                  
**Arguments**                   |                                                                                                                                                                                                                                     
**string key**                  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                           
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


    `ruby
    couchbase.set("counter", 10)
    couchbase.decr("counter", 5)
    couchbase.get("counter") #returns 5

The following demonstrates different options available when using decrement:


    `ruby
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

<a id="couchbase-sdk-ruby-update-delete"></a>

## Delete Methods

The `delete` method deletes an item in the database with the specified key.
Delete operations are synchronous only.

<a id="table-couchbase-sdk_ruby_delete"></a>

**API Call**                  | `object.delete(key [, ruby-delete-options ])`                                                                                                                                                                                                                                
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**               | Delete a key/value                                                                                                                                                                                                                                                           
**Returns**                   | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                                                                           
**Arguments**                 |                                                                                                                                                                                                                                                                              
**string key**                | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                    
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


    `ruby
    couchbase.delete("foo")

The following illustrates use of delete in Ruby along with various parameters
and settings:


    `ruby
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

<a id="couchbase-sdk-ruby-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_ruby_increment"></a>

**API Call**                    | `object.increment(key [, offset ] [, ruby-incr-decr-options ])`                                                                                                                                                                                                                                                                               
--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**                 | Increment the value of an existing numeric key. The Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                                                                                                                            
**Arguments**                   |                                                                                                                                                                                                                                                                                                                                               
**string key**                  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                     
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


    `ruby
    couchbase.set("counter", 10)
    couchbase.incr("counter", 5)
    couchbase.get("counter") #=> 15

The second form of the `incr` method supports the use of a default value which
will be used to set the corresponding key if that value does already exist in
the database. If the key exists, the default value is ignored and the value is
incremented with the provided offset value. This can be used in situations where
you are recording a counter value but do not know whether the key exists at the
point of storage.

For example, if the key `counter` does not exist, the following fragment will
return 1000:


    `ruby
    counter = couchbase.incr("counter", 1, :initial => 1000); #=> 1000

The following demonstrates different options available when using increment and
the output they produce:


    `ruby
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

<a id="couchbase-sdk-ruby-update-prepend"></a>

## Prepend Methods

The `prepend` methods insert information before the existing data for a given
key. Note that as with the `append` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend`.

<a id="table-couchbase-sdk_ruby_prepend"></a>

**API Call**                  | `object.prepend(key, value [, ruby-prepend-options ])`                                                                                                                                                                                   
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**               | Prepend a value to an existing key                                                                                                                                                                                                       
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                
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


    `ruby
    #set inital key, foo

    couchbase.set("foo", "world!")

    #prepend text 'Hello, ' to foo

    couchbase.prepend("foo", "Hello, ")

    #get new foo value

    couchbase.get("foo") #=> "Hello, world!"

Other examples of using `prepend` are as follows:


    `ruby
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
**Description**             | Update the expiry time of an item                                                                                                                                                                                                
**Returns**                 | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                               
**Arguments**               |                                                                                                                                                                                                                                  
**string key**              | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                        
**hash ruby-touch-options** | Hash of options containing key/value pairs                                                                                                                                                                                       
                            | **Structure definition:**                                                                                                                                                                                                        
                            | `:ttl` (fixnum)                                                                                                                                                                                                                  
                            | Expiration time for record. Default is indefinite, meaning the record will remain until an explicit delete command is made. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times from the epoch.
**hash ruby-touch-keys**    | Hash of options containing key/value pairs                                                                                                                                                                                       

The following examples demonstrate use of `touch` with a single key:


    `ruby
    #update record so no expiration (record held indefinitely long)

    c.touch("foo")

    #update expiration to 10 seconds

    c.touch("foo", :ttl => 10)

    #alternate syntax for updating single value

    c.touch("foo" => 10)

<a id="table-couchbase-sdk_ruby_touch-many"></a>

**API Call**                      | `object.touch-many(keyn)`                                                                                                    
----------------------------------|------------------------------------------------------------------------------------------------------------------------------
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


    `ruby
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

<a id="couchbase-sdk-ruby-stats"></a>

# Ruby — Statistics Operations

The Couchbase Ruby Client Library includes support for obtaining statistic
information from all of the servers defined within a couchbase object. A summary
of the commands is provided below.

<a id="table-couchbase-sdk-ruby-stats-summary"></a>

Method                                                          | Title                      
----------------------------------------------------------------|----------------------------
[`object.stats([ statname ])`](#table-couchbase-sdk_ruby_stats) | Get the database statistics


    `ruby
    couchbase.stats
    #=> {...}

The `stats` command gets the statistics from all of the configured nodes. The
information is returned in the form of a nested Hash, first containing the
address of the configured server and then within each server the individual
statistics for that server as key value pairs.


    `ruby
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

<a id="table-couchbase-sdk_ruby_stats"></a>

**API Call**    | `object.stats([ statname ])`                                      
----------------|-------------------------------------------------------------------
**Description** | Get the database statistics                                       
**Returns**     | `object` ( Binary object )                                        
**Arguments**   |                                                                   
**statname**    | Group name of a statistic for selecting individual statistic value

<a id="api-reference-view"></a>

# View/Query Interface

Couchbase Server 2.0 combines the speed and flexibility of Couchbase databases
with the powerful JSON document database technology of CouchDB into a new
product that is easy to use and provides powerful query capabilities such as
map-reduce. With Couchbase Server 2.0 you are able to keep using all of the
Couchbase code you already have, and upgrade certain parts of it to use JSON
documents without any hassles. In doing this, you can easily add the power of
Views and querying those views to your applications.

For more information on Views, how they operate, and how to write effective
map/reduce queries, see [Couchbase Server 2.0:
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
and [Couchbase Sever 2.0: Writing
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

The `View` Object is obtained by calling the appropriate view on the design
document associated with the view on the server.


    `ruby
    client = Couchbase.connect
    view = client.design_docs['docName'].viewName(params)

or


    `ruby
    client = Couchbase.connect
    view = Couchbase::View.new(client, "_design/docName/_view/viewName", params)

Where:

 *  `docName`

    is the Design document name.

 *  `viewName`

 *  `params` are the parameters that can be passed such as `:descending`,
    `:include_docs` and so on.

The entire list of `params` are at
[http://wiki.apache.org/couchdb/HTTP\_view\_API\#Querying\_Options](http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options)

Some of the params are listed below.

 *  `startKey`

    to set the starting Key.

 *  `endKey`

    to set the ending Key.

 *  `descending`

    to set the descending to true or false.

 *  `include_docs`

    to Include the original JSON document with the results.

 *  `reduce`

    where the reduce function is included or excluded based on the Value.

 *  `stale`

    where the possible values for stale are `false`, `update_after` and `ok` as
    noted in the Release Notes.

Process each row of the result using the following structure:


    `ruby
    view.each do |post|
      # do something
      puts post.doc['date']
    end

 *  `id`

    to get the Id of the associated row.

 *  `key`

    to get the Key of the associated Key/Value pair of the emit result.

 *  `value`

    to get the Value of the associated Key/Value pair of the result.

 *  `doc`

    to get the document associated with the row as long as the property
    :include\_docs is set to true.

For usage of these classes, please refer to the `Squish` Tutorial which has been
enhanced to include Views.

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

In this example we create a sample record `foo` with the initial fixnum value of
100. Then we create a increment count set to one, to indicate the first time we
will create a Couchbase request. In the event loop, we create a timing loop that
runs every.5 seconds until we have repeated the loop 5 times and our increment
is equal to 5. In the timer loop, we increment `foo` per loop.

<a id="couchbase-sdk-ruby-rn"></a>

#Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Ruby. To browse or submit new issues, see [Couchbase
Client Library Ruby Issues
Tracker](http://www.couchbase.com/issues/browse/RCBC).

<a id="couchbase-sdk-ruby-rn_1-2-0b"></a>

## Release Notes for 1.2.0.dp4 Couchbase Client Library Ruby Beta (08 June 2012)

This is a preview release of the Couchbase Ruby SDK.

This versions includes all fixes of the 1.2.x branch, until the 1.2 stable
release.

**New Features and Behaviour Changes in 1.2.0.dp4**

 *  Implement get with lock operation. GETL operation introduces another level of
    locking (in addition to CAS optimistic locks). Now you can lock key(s) for some
    period, and all other clients will get error if will try to update it,
    regardless of CAS. The lock could be reset by using correct CAS, or timeout will
    pass. See the example:

        > require 'couchbase'
         true
         > Couchbase.bucket.set("foo", "bar")
         6133961393559502848
         > Couchbase.bucket.get("foo", :lock => 10)
         "bar"
         > Couchbase.bucket.set("foo", "baz")
         Couchbase::Error::KeyExists: failed to store value (key="foo", error=0x0c)
         from (irb):4:in `set'
         from (irb):4
         from /home/avsej/.rvm/rubies/ruby-1.9.3-p194/bin/irb:16:in `<main>'
         > sleep(10)
         10
         > Couchbase.bucket.set("foo", "baz")
         15331330723597713408

**Fixes in 1.2.0.dp4**

 *  RCBC-34 and RCBC-35 are fixed.

 *  Use debugger gem for 1.9.x. The gem used to require debugger as development
    dependency. Unfortunately ruby-debug19 isn't supported anymore for ruby 1.9.x.
    But there is new gem 'debugger'. This fix replaces this dependency.

 *  Require yajl as development dependency. MultiJson gem requires that at least one
    json implementation should be installed. For 1.9.x it could use built-in json
    library, but 1.8.7 doesn't have json parser by default, therefore require it for
    development environment.

 *  Fixed RCBC-36 which was causing a segfault on releasing Request object (couchdb
    HTTP request, aka view request) which was completed already. The behavior was
    dependent on GC.

 *  Now it is possible to stop event loop (asynchronous mode)

        conn.run do
         10.times do |ii|
         conn.get("foo") do |ret|
         puts ii
         conn.stop if ii == 5
         end
         end
         end

 *  Break out from event loop for non-chunked responses. View results are chunked by
    default, so there no problems, but other requests like
    Bucket\#save\_design\_doc() were "locking" awaiting forever.

 *  This fixes View queries with filters, delivered with POST HTTP method.

 *  The test for Bucket\#wait\_for\_seqno is unpredictable and is commented out.

 *  Define views only if "views" key are present. Do not try to iterate "views"
    subkey on design document if it is empty. There was unhandled exception for
    design docs without views.

 *  RCBC-31 is fixed by making Bucket\#get consistent.

 *  This fix allows for mixng of sync and async approaches. In asynchronous mode
    user chooses the threshold when the library should flush the buffers to the
    network:


        conn.run(:send_threshold => 100) do # 100 bytes
        connection.set("uniq_id", "foo" * 100)

 *  Fixed view iterator. It doesn't lock event loop anymore This used to cause
    "locks", memory leaks or even segmentation fault.

 *  MultiJson gem was changed several method names and this made couchbase gem
    incompatible with old multi\_json versions. The fix makes couchbase working with
    both old and new versions of 'multi\_json'.

 *  This fix allows mixing of sync and async approaches. The library maintain the
    counter of the pending requests called 'seqno' and now it is possible to block
    and wait for completion of part of the command:

        conn.run do
         100.times do |n|
         connection.set("key" + n, {"val" => n})
         end
         # conn.seqno is 100 at this point
         conn.wait_for_seqno(40)
         # after this line seqno will be <= 40
         end

 *  The replace documentation has been updated to include :cas option

<a id="couchbase-sdk-ruby-rn_1-2-0a"></a>

## Release Notes for 1.2.0-dp Couchbase Client Library Ruby Alpha (05 April 2012)

**New Features and Behaviour Changes in 1.2.0-dp**

 *  [Couchbase Server
    Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
    is accessible using the view APIs. Please refer to [for getting
    started](http://www.couchbase.com/develop/ruby/next) with views.

**Fixes in 1.2.0-dp**

 *  Fixed a bug when 'Couchbase.connection\_options' for "default" connection, when
    there are several arguments to pass to the connect() function when establishing
    thread local connection as below

        Couchbase.connection_options = {:port => 9000, :bucket => 'myapp'}

 *  On MacOS, `libcouchbase` and `libvbucket` do not need to be installed prior to
    installing Couchbase when installing via homebrew with the `brew` command.

<a id="licenses"></a>

#Appendix: Licenses

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

