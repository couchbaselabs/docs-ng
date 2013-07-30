# Couchbase and Rails Tutorial

The goal of this chapter is to show you how to write more advanced applications
using Couchbase and Rails framework.

We assume here that you finished the "Getting Started" section already, if not,
we recommend to take a look, because it describes how to install and verify Ruby
SDK.

<a id="_tl_dr"></a>

## TL;DR

For the purposes of this tutorial, we prepared an example application for you to
follow along with. The application uses a bucket with one of the sample datasets
which come with Couchbase Server itself: `beer-sample`. If you haven’t already
done so, download the latest Couchbase Server 2.0 and install it. While you
follow the download instructions and setup wizard, make sure you install the
`beer-sample` default bucket. It contains a sample data set of beers and
breweries, which we’ll use in our examples here. If you’ve already installed
Couchbase Server 2.0 and didn’t install the `beer-sample` bucket (or if you
deleted it), just open the Web-UI and navigate to "Settings/Sample Buckets".
Select the `beer-sample` checkbox and click "Create". In the right hand corner
you’ll see a notification box that will disappear once the bucket is ready to be
used.

After that you can clone the complete repository from couchbaselabs on github:

`shell> git clone git://github.com/couchbaselabs/couchbase-beer.rb.git Cloning
into 'couchbase-beer.rb'... remote: Counting objects: 409, done. remote:
Compressing objects: 100% (254/254), done. remote: Total 409 (delta 183), reused
340 (delta 114) Receiving objects: 100% (409/409), 235.17 KiB | 130 KiB/s, done.
Resolving deltas: 100% (183/183), done.` Navigate to the directory and install
all application dependencies:


```
shell> cd couchbase-beer.rb/ shell> bundle install...snip... Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.
```

That’s it. Assuming that Couchbase Server with `beer-sample` bucket is up and
running on localhost, you can just start the Ruby web server:

`shell> rails server => Booting Thin => Rails 3.2.8 application starting in
development on http://0.0.0.0:3000 => Call with -d to detach => Ctrl-C to
shutdown server >> Thin web server (v1.5.0 codename Knife) >> Maximum
connections set to 1024 >> Listening on 0.0.0.0:3000, CTRL+C to stop` Then
navigate to [http://localhost:3000/](http://localhost:3000/). You should see
something like that:


![](images/couchbase-beer.rb-home.png)

<a id="_create_application_skeleton"></a>

## Create the Application

If you want to learn how to create this application from scratch just continue
reading. As with any Rails application we will use generators a lot. Since we
don’t need ActiveRecord we’ll let `rails new` know about this:

`shell> rails new couchbase-beer.rb -O --old-style-hash` Now navigate to the
project root and open up the `Gemfile` in your favorite editor. First, we need
to add the Couchbase client libraries there:


```
gem 'couchbase'
gem 'couchbase-model'
```

Omitting the version will get the latest stable versions of those gems. We will
use the [couchbase-model](https://rubygems.org/gems/couchbase-model) gem to
define our models in a declarative way much like all Rails developers describe
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



The next step will be to configure Couchbase connection, this step should be
familiar to the Rails developer, because `couchbase-model` brings YAML-styled
configuration. So if you know how `config/database.yml` works, you can make some
assumptions about how `config/couchbase.yml` works. To generate a config, use
the `couchbase:config` generator:

`shell> rails generate couchbase:config create  config/couchbase.yml` Since our
bucket name differs from the project name, you should update the `bucket`
property in the config. Also if your Couchbase Server is not running on the
local machine, you should also change the hostname in the config. After you’ve
made your modifications, your config should look like this:

### config/couchbase.yml

`common: &common hostname: localhost port: 8091 username: password: pool:
default  development: <<: *common bucket: beer-sample  production: <<: *common
bucket: beer-sample`

That’s it for configuration, let’s move forward and create some models.

<a id="_define_models"></a>

## Define Models

To create a model, all you need is to define the class and inherit from
`Couchbase::Model`. Here we dissect the `Brewery` model in the application.

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
different places. After all Views are implemented in JavaScript and contain the
business logic `couchbase-model`. Each time the server starts (in development
mode for each request), the application will check the file system changes of
the map/reduce JavaScript files and update the design document if needed. There
is also the Rails generator for views. It will put view stubs for you in proper
places. Here for example, is the model layout for this particular application:

`app/models/ ├── beer │   ├── all │   │   └── map.js │   └── by_category │      
├── map.js │       └── reduce.js ├── beer.rb ├── brewery │   ├── all │   │   └──
map.js │   ├── all_with_beers │   │   └── map.js │   ├── by_country │   │   ├──
map.js │   │   └── reduce.js │   └── points │       └── spatial.js ├──
brewery.rb ├── favorites.rb └── user.rb` For each model which has views, you
should create a directory with the same name and put in the appropriate
JavaScript files. Each should implement the corresponding parts of the view. For
example `_design/brewery/_view/by_country` does require both map and reduce
parts. To generate a new view you should pass model name and view name you need
to get:

`shell> rails generate couchbase:view beer test create 
app/models/beer/test/map.js create  app/models/beer/test/reduce.js` Those
automatically generated files are full of comments, so they are worth reading as
a quick start about how to write View indexes. For more information about using
views for indexing and querying from Couchbase Server, here are some useful
resources:

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

Now we examine the controllers from the project. This is where data is selected
to display to user. For example `BreweriesController` :


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

 1. "index" which pulls the list of breweries. It might look complex, but it isn’t.
    In first line we are preparing query parameters for views. In particular, we are
    interested in the `start_key` and `end_key` parameters, but we need them only if
    they aren’t blank (i.e. not nil and not empty string). The second step is to
    execute the view and get results immediately. Your application might want to
    fetch the entries from view on demand in a lazy manner, then you no need to call
    the `#to_a` method and iterate over them or call methods like `#next`. In this
    particular example we are fetching 31 records and are trying to pop last one to
    use it later for "infinite" scrolling. The end of the method is responsible for
    rendering the data in two formats, by default it will use HTML, but if the
    application is responding to an AJAX request with the `Accept: application/json`
    header, it will instead render the JSON representation of our models.

 1. "show" uses another view from the `Brewery` model, which collates breweries with
    beer for easier access. Here is a map function which does that job:

    `function(doc, meta) { switch(doc.type) { case "brewery": emit([meta.id]);
    break; case "beer": if (doc.brewery_id && doc.name) { emit([doc.brewery_id,
    doc.name]); } break; } }` As you can see we are using a compound key with
    brewery ID in the first position and the document name in the second position.
    Because we are selecting only beers without null names, they will be sorted
    after the breweries. By doing so, when we filter result by the first key only,
    the `@brewery` variable will receive first element of the sequence, and `@beers`
    will get the rest of the collection because of the splat ( `*` ) operator.

<a id="_bonus_spatial_queries_sessions_and_cache"></a>

## Bonus: Spatial Queries, Sessions and Cache

One of the experimental features of the Couchbase Server is spatial views. These
kind of views allow you to build indexes on geo attributes of your data. This
sample application demonstrates spatial views. Click on the "Map" link in the
menu and your browser will fetch your current location; it will position the
center of the map to your location, or to Mountain View otherwise. After that it
will execute a spatial query using map bounds and the Couchbase Server will give
you all the breweries which are nearby. The following is part of the
implementation. The core of this feature is `brewery/points/spatial.js` :

`function(doc, meta) { if (doc.geo && doc.geo.lng && doc.geo.lat && doc.name) {
emit({type: "Point", coordinates: [doc.geo.lng, doc.geo.lat]}, {name: doc.name,
geo: doc.geo}); } }` The function will emit a Point object and the name with
coordinates as the payload. The action in the controller is quite trivial, it
transmits the result to the application in JSON representation, and Google maps
is renders markers for each object.

Except nice extensions, provided by `couchbase-model` library, `couchbase` gem
itself has few more nice features which could be useful in the web application.
For example, you can easily substitute your session or cache store in Rails (or
even in rack) with Couchbase Server.

To use Couchbase as cache store in Rails, just put following line in your
`config/application.rb` file:


```
config.cache_store = :couchbase_store
```

You can also pass additional connection options:


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
`config/initializers/session_store.rb` file:


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

In the example above we specify the format as JSON which allows us to share
sessions in a heterogeneous environment, and also analyze them using Map/Reduce.
But keep in the mind that not everything in typical Rails application can be
serialized to JSON, for example `ActionDispatch::Flash::FlashHash`. This is why
the library serializes sessions using `Marshal.dump` by default.

<a id="couchbase-sdk-ruby-troubleshooting"></a>
