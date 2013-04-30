# Couchbase and Rails Tutorial

Now that you've installed Couchbase and have probably created a cluster of
Couchbase servers, it is time to install the client library library, and start
manipulating the data.

Here's a quick outline of what you'll learn in this article:

 1. Install the Ruby Couchbase Client (Gem) Dependencies
    [Couchbase](https://github.com/couchbase/couchbase-ruby-client).

 1. Write a more advanced program using Rails to connect, save and update data in
    couchbase

This section assumes that you have installed Couchbase Ruby SDK and you have
installed the Couchbase server on your development machine. We assume you have
at least one instance of Couchbase Server and one data bucket established. If
you need to set up these items in Couchbase Server, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="couchbase-sdk-ruby-tutorial-installation"></a>

## Installing the Couchbase Client Library Dependencies

Before continuing you should ensure you have a working `Ruby` environment up and
running. We recommend the following:

 * Ruby `1.9.2` or `1.8.7`  [http://ruby-lang.org](http://ruby-lang.org)

 * Ruby Version Manager `RVM`
   [https://rvm.beginrescueend.com/](https://rvm.beginrescueend.com)

 * Rubygems `1.8.6`  [https://rubygems.org](https://rubygems.org)

 * Bundler `1.0`  [http://gembundler.com/](http://gembundler.com)

<a id="couchbase-sdk-ruby-tutorial-railsapp"></a>

## Example Rails Application (Squish)

For the purposes of this tutorial, we have specially prepared an example
application for you to follow along with. You can download
[Squish](https://github.com/couchbaselabs/couchbase-squish) from Github.
`Squish` is a simple URL shortener implemented with `Couchbase`.

To get started, lets first get the source code. Open up a new Terminal window
and type the following:


```
shell> git clone git://github.com/couchbaselabs/couchbase-squish.git
shell> cd couchbase-squish
shell> bundle install
```

Now that you have the source and all of the dependencies, we can start the
application and see what's happening.


```
shell> rails server
```


![](images/couchbase-squish.png)

In a URL shortening application there are a number of features we would like to
accomplish. Let's define what they are:

 * User should be able to save a valid URL. `client.set`

 * User can visit the shortened URL and is redirected to the long one. `client.get`

 * A user visiting a URL should increment number of hits for a given URL.
   `client.set`

<a id="couchbase-sdk-ruby-tutorial-activerecord"></a>

## Not your mother's ActiveRecord

Rails is based on conventions, one of those is that you'll want to be using a
`SQL` database. We don't. So what things should we do differently.

Listing 1: `Gemfile`


```
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

# Squish Application Dependencies
gem "couchbase", 1.0.0
gem "validate_url"
```

The major difference from this Gemfile and a freshly generated Rails application
is that we're not using `sqlite` and we have required `couchbase` instead.

Listing 2: `config/application.rb`


```
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
```

Out of the box, Rails will require `rails/all` which will load all aspects of
Rails. For this application we only need `action_controller`. This cuts the boot
time down significantly.

Listing 3: `config/environments/development.rb`


```
CouchbaseTinyurl::Application.configure do
  # ...
  # config.action_mailer.raise_delivery_errors = false
  # ...
end
```

One last thing to ensure unloading all those other Rails modules doesn't hurt
us. We need to remove the `action_mailer` configuration options for Development
and Test environments.

Now that we've got our application configured just right for using Couchbase we
can start connecting with the server. You would connect to the address of the
server (in this case it is 127.0.0.1 which is the IPV4 address of localhost.

<a id="couchbase-sdk-ruby-tutorial-connecting"></a>

### Connecting to Couchbase

Listing 5: `app/models/couch.rb`


```
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
```

Because we have the concept of an `environment` in Rails, we wrote this small
module to enable us to configure where our couchbase instance is located. Then
throughout our code we can reference `Couch.client` which will return our
Couchbase Client object.

<a id="couchbase-sdk-ruby-tutorial-apibasics"></a>

### Defining an API

Just because we aren't using ActiveRecord doesn't mean we can't have a nice API,
thanks to `ActiveModel` we can very easily create a simple Model to encapsulate
our `Link` object. What would such an API look like? Let's define how we would
interact with a Couchbase model from our `Controller`.

Listing 6: `app/controllers/links_controller.rb`


```
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
end
```

So, in looking at our sketched out `Controller` above we can see how we would
like to interact with our `Link` object.

 * We can initialize a new `Link` with a `Hash` of attributes. e.g. `Link.new(
   params[:link] )`

 * We can access and set a `Link` 's attributes. e.g. `@link.session_id =
   session[:session_id]`

 * We can save a new `Link` to couchbase. e.g. `@link.save`

 * We can find and instantiate a `Link` object. e.g. `Link.find( params[:id] )`

<a id="couchbase-sdk-ruby-tutorial-couchbasemodel"></a>

### Defining a Couchbase Model

Now that we know what kind of an API we want to expose from our `Link` Model,
let's define it.

Listing 7: `app/models/link.rb`


```
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
```

Might seem like a lot to take in at once, let's break it down into the three
main responsibilities of the Class.

 * Creating a basic `ActiveModel` implementation to integrate with Couchbase

 * Defining some `Model` logic for the `Link`.

<a id="couchbase-sdk-ruby-tutorial-activemodel"></a>

### Couchbase + ActiveModel

Listing 7a: `app/models/link.rb` \[line:3..6\]


```
include ActiveModel::Validations
include ActiveModel::Conversion
extend ActiveModel::Callbacks
extend ActiveModel::Naming
```

Firstly we include all the aspects of `ActiveModel` that we would like to use.

Listing 7b: `app/models/link.rb` \[line:8\]


```
attr_accessor :url, :key, :views, :session_id, :created_at
```

Our model needs some `Attributes` so we define them.

Listing 7c: `app/models/link.rb` \[line:23..32\]


```
def initialize(attributes = {})
    @errors = ActiveModel::Errors.new(self)
    attributes.each do |name, value|
      next unless @@keys.include?(name.to_sym)
      send("#{name}=", value)
    end
    self.views ||= 0
    self.created_at ||= Time.zone.now
  end
```

In our `initialize` method we are doing the following:

 * Initializing an `ActiveModel::Errors` object that will work with the validations
   we'll define later.

 * Iterating through the `Hash` of attributes passed in. We check if our list of
   attribute keys and if it matches we assign that attribute to the passed in
   value.

Listing 7d: `app/models/link.rb` \[line:34..36\]


```
def to_param
             self.key
           end
```

To work with rails `link_to` methods we need to implement this method. As we
would like to use our generated key.

Listing 7e: `app/models/link.rb` \[line:38..42\]


```
def persisted?
             return false unless (key && valid?)
             # TODO use a better way to track if an object is *dirty* or not...
             self.class.find(key).url == self.url
           end
```

So that our `Link` objects know wether they are a `new?` object or not, we
implemented this method. There are better ways to track this, just to
demonstrate things working, once a Link is `valid?` we are checking to see if
the object has been persisted and that the url matches.

Listing 7f: `app/models/link.rb` \[line:44..56\]


```
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
```

Saving a complex document to `Couchbase` is a simple as passing a Hash of
attributes as the second parameter to `client.set(key, value)`.

Listing 7g: `app/models/link.rb` \[line:58..66\]


```
def self.find(key)
   return nil unless key
   begin
     doc = Couch.client.get(key)
     self.new(doc)
   rescue Couchbase::Error::NotFound => e
     nil
   end
 end
```

Here we've implemented a simple find method that will get a given document from
couchbase based on the key. It's worth noting that `Couchbase` will raise an
error if the document you're trying to access doesn't exist in which case we
rescue and return a nil.

<a id="couchbase-sdk-ruby-tutorial-linkmodel"></a>

### The Link Model

Everything we've done up to now is providing a bit of framework to our code to
allow us to create our Link object.

Listing 7h: `app/models/link.rb` \[line:8..19\]


```
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
```

What we are left with here is quite simple, we've already mentioned defining the
attributes. Next, we're telling `ActiveModel` that it should give us a callback
to bind to for the `save` method of a Link. Next we setup a validation on the
`url` attribute, we're using the built-in `presence` validator and we've
included a third party validation by way of the [validate\_url
Gem](https://rubygems.org/gems/validate_url). Finally we setup our save callback
to call the `generate_key` method which takes care of creating a unique short
key for our Links.

<a id="couchbase-sdk-ruby-tutorial-conclusion"></a>

## Conclusion

And that's it. You now know how to install all the dependencies for working with
Couchbase and Rails. You can integrate Couchbase with your Rails projects,
whilst keeping a decent object orientated structure and we've started to explore
some of the other features of Couchbase.

<a id="couchbase-sdk-ruby-summary"></a>
