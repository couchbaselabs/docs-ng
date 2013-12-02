# Introduction

This guide provides information for developers who want to use the Couchbase Ruby SDK to build applications that use Couchbase Server.

# Getting Started

Now that you've installed Couchbase and have probably created a cluster of
Couchbase servers, it is time to install the client library for Ruby, and start
manipulating data.

Here's a quick outline of what you'll learn in this article:

 1. Installing the Ruby Couchbase Client (Gem)
    [Couchbase](https://github.com/couchbase/couchbase-ruby-client).

 1. Writing a simple program to demonstrate connecting to Couchbase and saving some
    data.

 1. Exploring some of the API methods that will take you further than the simple
    program.

This section assumes that you have installed Couchbase Ruby SDK and you have
installed the Couchbase server on your development machine. We assume you have
at least one instance of Couchbase Server and one data bucket established. If
you need to set up these items in Couchbase Server, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="couchbase-sdk-ruby-getting-started-installing"></a>

## Installing the Couchbase Client Library

Before continuing you should ensure you have a working `Ruby` environment up and
running. We recommend the following:

 * Ruby `1.9.2` or `1.8.7`  [http://ruby-lang.org](http://ruby-lang.org)

 * Rubygems `1.8.15`  [https://rubygems.org](https://rubygems.org)

You can verify that Ruby and RubyGems are installed by typing the following
commands:


```
shell> ruby -v
```

and


```
shell> gem --version
```

The Ruby version should be 1.8.7 or higher. Rubygems must be 1.3.6 or higher.

 1. Install the package `libevent`.

 1. Then install the Couchbase C Client library, `libcouchbase`

 1. The next step is to install `libvbucket` which is also part of the Couchbase
    client library.

 1. You may need to install `rubygems` as well, if not already installed.

 1. Once you have Rubygems installed you can simply use it to install Couchbase as
    below.```
    shell> gem install couchbase
    ```

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


```
shell> git clone git@github.com:avsej/couchbase-examples-ruby.git
shell> cd couchbase-examples-ruby
shell> sudo bundle install
```

Now that you have a copy of the code, let's look at what's happening.

Listing 1: `Gemfile`

In the above, we simply require all Gem dependencies for the `hello-world.rb`
example. If you didn't have them already they will be installed when you run
`bundle install` as below.


```
shell> sudo bundle install
```

or, if you have already installed the dependencies, you can run the sample
program by simply running the command


```
shell> ruby hello-world.rb
```

Listing 2: `hello-world.rb`


```
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
```

The first 3 lines are some bootstrap code for `Bundler`, to load it and then
have it load all the Gems specified in our `Gemfile`.

We then create a new connection to our Couchbase Server. Remember to change the
connection details `127.0.0.1:8091` if you are working with couchbase remotely
or on another port.

The last few lines are the meat of what's happening, let's go through them in
more detail:


```
begin
  ...
rescue Couchbase::Error::NotFound => e
  ...
end
```

If we try to retrieve a key from Couchbase that does not exist it will raise a
`Couchbase::Error::NotFound` error. So to be able to handle this we start a
begin/rescue block and specify we want to only rescue from that error.


```
spoon = client.get "spoon"
puts spoon
```

Now we attempt to `get` the contents of the key "spoon". If it exists, we
continue and output the value of that key.


```
puts "There is no spoon."
client.set "spoon", "Hello World!", 10
```

Lastly if the key doesn't exist and our attempt to `get` raises a
`Couchbase::Error::NotFound` error then our rescue block will be triggered. In
which we're just outputting to the terminal again and then setting a value for
our key "spoon". For the purposes of the example we're passing a 3rd (optional)
paramter to the `set` method specifying a `TTL` Time to Live (expiry time in
seconds).

That's it. We're ready to run our first Couchbase program.


```
shell> ruby hello-world.rb
```

The first time you run the program it should produce the following output


```
shell> ruby hello-world.rb
There is no spoon.
```

If you are to run it again within 10 seconds it should produce this output


```
shell> ruby hello-world.rb
Hello World!
```

If you are to run it after 10 seconds it should produce the following output
based on the Time To Live (TTL) specified.


```
shell> ruby hello-world.rb
There is no spoon.
```

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
