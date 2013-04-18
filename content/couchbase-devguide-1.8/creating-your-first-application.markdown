# Creating Your First Application

This chapters assumes you have arrived at this page as a starting place for
developing on Couchbase Server with a Couchbase SDK. It covers the following
topics:

 * Resources for setting up your development environment,

 * Creating a first data bucket for development,

 * Connecting to Couchbase Server from Couchbase SDKs,

 * Performing a basic query from Couchbase SDKs,

 * Introduction to telnet operations to view database entries.

Another useful place to start if you are just beginning to develop with a
Couchbase SDK is the Getting Started Guides and tutorials which are provided in
each SDK language. For more information, see [Develop with
Couchbase](http://www.couchbase.com/develop).

<a id="couchbase-dev-prerequisites"></a>

## Setting Up the Development Environment

Beyond a standard web application development environment, with a development
machine/OS, and a web application server, you will need the following components
for your development environment:

 * Couchbase Server: installed on a virtual or physical machine separate from the
   machine containing your web application server. Download the appropriate version
   for your environment here: [Couchbase Server
   Downloads](http://www.couchbase.com/download)

 * Couchbase SDK: installed for runtime on the machine containing your web
   application server. You will also need to make the SDKs available in your
   development environment in order to compile/interpret your client-side code. The
   SDKs are programming language and platform specific. You will use your SDK to
   communicate with the Couchbase Server from your web application. Downloads for
   your chosen SDK are here: [Couchbase SDK
   Downloads](http://www.couchbase.com/develop)

 * Couchbase Server Console: administering your Couchbase Server is done via the
   Couchbase Server Console, a web application viewable in most modern browsers.
   Your development environment should therefore have the latest version of Mozilla
   Firefox 3.6+, Apple Safari 5+, Google Chrome 11, or Internet Explorer 8, or
   higher. You should set your browser preference to be JavaScript enabled.

The following are supported platforms for the majority of Couchbase Client
SDK's:

 * CentOS 5.5 (Red Hat and Fedora compatible), 32- and 64- bit.

 * Ubuntu 10.04 (Red Hat and Fedora compatible), 32- and 64- bit

 * Microsoft Windows, for the case of.NET, Java, and Ruby SDKs.

The following virtual machines are supported:

 * Java VM

 * Microsoft.NET VM

The following are development languages supported by the Couchbase Client SDK
Libraries:

 * Java

 * .NET

 * PHP

 * Ruby

 * C

Depending upon the OS for your development platform and web application server
platform, choose the 32- or 64- bit versions of the SDK. Download and install
the following three packages which contain the SDK's:

 * 64- or 32- bit, OS-specific package.

 * 64- or 32- Library Headers.

 * 64- or 32- Debug Symbols.

The.NET and Java SDKs provide their own packages which contain all the libraries
required. Please refer to the individual SDK documentation for these two
languages for more information on installation.

Beyond installation of these three core packages for any given language or
framework, language/framework specific installation information and system
prerequisites can be found in each respective SDK guide, e.g. Java SDK Guides.
Notably, the scripting languages SDKs, such as those for Ruby and PHP, will also
require installation of Couchbase SDKs for C.

<a id="couchbase-connecting-to-cbserver"></a>

## Connecting to Couchbase Server

After you have your Couchbase Server up and running, and your chosen Couchbase
Client libraries installed on a web server, you create the code that connects to
the server from the client.

<a id="creating-a-bucket"></a>

### Create Your First Bucket

The first thing you will want to do after you set up Couchbase Server and you
want to explore the SDKs is to create a data bucket. You can do so with the
Couchbase Admin Console, or you can use the REST API. For your first application
in this chapter, we will show the REST API approach, which you may be less
familiar with after your initial server install. For more information about
creating named buckets via the Couchbase Admin Console, see [Couchbase Server
Manual 2.0, Creating and Editing Data
Buckets](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-web-console-data-buckets-createedit.html)

You create either a Couchbase or memcached bucket using the REST API. When you
make a request, you provide a REST request using a REST client or a UNIX utility
such as curl.

 1. Make a new bucket request to the REST endpoint for buckets and provide the new
    bucket settings as request parameters:

     ```
     shell> curl -u Administrator:password \
                         -d name=newBucket -d ramQuotaMB=100 -d authType=none \
                         -d replicaNumber=1 -d proxyPort=11215 http://localhost:8091/pools/default/buckets
     ```

    To create a bucket we first provide our credentials for the bucket. These are
    the same credentials we established when we first installed Couchbase Server.
    For the sake of convenience, we create a single Couchbase bucket named
    `newBucket` with a RAM quota of 100MB. We require no authentication for the
    bucket and set the proxy port for the bucket to 11215.

    Couchbase Server sends back this HTTP response:

     ```
     202
     ```

 1. You can check your new bucket exists and is running by making a request REST
    request to the new bucket:

     ```
     curl http://localhost:8091/pools/default/buckets/newBucket
     ```

    Couchbase Server will respond with a JSON document containing information on the
    new bucket:

     ```
     {"name":"newcachebucket","bucketType":"couchbase",

     ....

     "bucketCapabilities":["touch","couchapi"]}
     ```

    For this request we go to the same REST URI used when we created the bucket,
    plus we add the endpoint information for the new bucket, `/newBucket`. For this
    type of request we do not need to provide any credentials. The response document
    contains other REST requests you can make for the bucket as well as bucket
    settings/properties.

After you create your first data bucket, you can begin interacting with that
bucket using a Couchbase SDK. To learn more about the Couchbase REST
Administrative API, particularly for administrative functions, see [Couchbase
Server Manual, REST API for
Administration](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html)

<a id="couchbase-client-connecting"></a>

### Connecting with a Client

By default Couchbase Server uses the `http://localhost:8091/pools` for
connections with clients. A Couchbase client will also automatically adjust the
port it is configured to communicate to the Couchbase Server. Therefore it is
not necessary to adjust your code for connecting to accommodate cluster
rebalance, or to accommodate node addition or deletion.

In order to connect and perform data operations, you will need to have at least
one default bucket established, for instance one that you have made in the
Couchbase Administrative Console.

The following shows a basic steps for creating a connection. Other
languages/frameworks follow a similar pattern, with slight variations due to
language and compilers/interpreters:

 1. Include, import, link, or require Couchbase Client libraries into your program
    files. In the example that follows, we `require 'couchbase'`.

 1. Provide connection information for the Couchbase cluster. Typically this
    includes URI, bucket ID, a password and optional parameters and can be provided
    as a list or string. To avoid failure to connect, you should provide and try at
    least two URL's for two different nodes. In the following example, we provide
    connection information as `"http://<host>:<port>/pools"`. In this case there is
    no password required.

 1. Create an instance of a Couchbase client object. In the example that follows, we
    create a new client instance in the `client = Couchbase.connect` statement.

 1. Perform any database operations for your applications, such as read, write,
    delete.

 1. If needed, destroy the client, and therefore disconnect.


```
require 'rubygems'
require 'couchbase'

client = Couchbase.connect "http://<host>:8091/pools"
client.quiet = false;

begin
  client.set "hello", "Hello World!", :ttl => 10
  spoon = client.get "hello"
  puts spoon
rescue Couchbase::Error::NotFound => e
  puts "There is no record."
end
```

In this example, we set and retrieve data in a Ruby `begin rescue end` block.
The code block attempts to set the value "Hello World!" for the key "spoon" with
an expiration of 10 seconds. Then gets the value for the "spoon" key and outputs
it. If the Couchbase client receives and error, it outputs "There is no spoon."

(Optional) Depending on the language you are using, you may need to be
responsible for explicitly destroying the Couchbase client object, and therefore
destroy the connection. Typically it is a best practice to try to reuse the same
client instance across multiple processes and threads, rather than constantly
create and destroy clients. This will provide better application performance and
reduce processing times.

The next example in Java we demonstrate how it is safest to create at least two
possible node URIs while creating an initial connection. This way, if your
application attempts to connect, but one node is down, the client automatically
reattempt connection with the second node URL:


```
// Set up at least two URIs in case one server fails

List<URI> servers = new ArrayList<URI>();
servers.add("http://<host>:8091/pools");
servers.add("http://<host>:8091/pools");

// Create a client talking to the default bucket

CouchbaseClient cbc = new CouchbaseClient(servers, "default", "");

// Create a client talking to the default bucket

CouchbaseClient cbc = new CouchbaseClient(servers, "default", "");

System.err.println(cbc.get(“thisname") +
  " is off developing with Couchbase!");
```

A similar approach should be followed in any language when attempting to connect
to a Couchbase cluster. That is, you should set up an array of two or more
possible nodes and then attempt to connect to at least one node in an array
before performing other operations. The following demonstrates creating a
connection with more than one possible URI in Ruby:


```
Couchbase.connect(:node_list => ['<host>:8091', '<host>:8091',
   'example.net'])
```

After your initial connection with Couchbase Server, you will not need to
reattempt server connection using an explicit list of node URLs. After this
initial connection, your Couchbase client will receive cluster information with
all nodes available for connection. After rebalance and failover, if a Couchbase
client object still exists, it will receive updated cluster information with
updated node URLs.

<a id="cb-authenticating"></a>

### Authenticating a Client

When you create a connection to the Couchbase Server, you are actually creating
a new instance of the bucket containing your information. Typically when you
established a bucket for your application, either in Couchbase Administrative
Console, or via an SDK call, you provide required credentials. When you connect
to the bucket, provide your username and password as parameters in your call to
`Couchbase.connect()` :


```
Couchbase.connect("http://<host>:8091/pools",
                                          :bucket => 'bucket1',
                                          :username => 'Administrator',
                                          :password => 'password')
```

This next example demonstrates use of credentials in PHP:


```
<?php
        $cb = new Couchbase(”<host>:8091", "bucketname", "pass", "user");
        ?>
```

<a id="cb-basic-connect-get-set"></a>

## Performing Connect, Set and Get

The following example demonstrates connecting, setting, then getting a record:


```
<?php

$cb = new Couchbase(”host:8091", "bucket", "pass", "bucket");

$cb->set("hello", "Hello World");

var_dump($cb->get("hello"));

?>
```

The same pattern would be used in any given SDK: connect, then perform a set
with key/value, and within the same connection, get and output the new value.


```
require 'rubygems'
    require 'couchbase'

    client = Couchbase.connect "http://<host>:8091/pools/default"
    client.set "new", "Test content", :ttl => 20
    rec = client.get "new"

    if(rec)
      puts rec
    else
      puts "no record"
    end
```

<a id="cb-basic-telnet-ops"></a>

## Performing Basic Telnet Operations

When you first begin developing with Couchbase SDks it is useful to know you can
also create a telnet connection to the Couchbase Server. Once you create the
connection, you can also experiment with simple gets and sets, to check to see
if your SDK-level operations are actually working.

To connect Couchbase Server via telnet, provide the host and port where it is
located. The default bucket created on the Couchbase Server will be on port
11211 for purposes of telnet. This does not require any authentication:


```
telnet localhost 11211
```

Note that when we telnet to port 11211 this is connecting to the default bucket
at Couchbase Server. There are some cases that you may need to telnet to another
port for instance if you are using moxi, or if you want to connect to a
different bucket. After you successfully connect, you can enter commands at the
telnet prompt. In the example that follows we set a key/value pair via the
telnet session.


```
set name1 0 0 5
     karen
```

In this example we provide they key as 'name1', the flags as 0, TTL as 0, and
the length of value to be set as 5 characters, respectively. After we return the
set command via telnet, we can enter the actual value which is 'karen' in this
case. After Couchbase Server successfully stores the key/value, it will return
STORED via telnet. The next examples demonstrate use of get and delete via
telnet:


```
get name2
     VALUE name2 0 3
     ari
     END
```

Couchbase Server will return the key, flags, length, and then the value followed
by an END statement. Notice that TTL is not returned in this case. When you
delete a value, Couchbase Server will respond via telnet with DELETED if it
successfully removes the item, and if is unsuccessful it will return NOT\_FOUND:


```
delete name3
    DELETED
    delete name3
    NOT_FOUND
```

For this next example we demonstrate adding a record via telnet. This shows the
general distinction between adding and setting a record. If a given key already
exists, setting a record will overwrite it; if you try to add the record,
Couchbase Server will return an error and preserve the existing record:


```
add name1 0 0 4
      erin
      STORED
      add name1 0 0 2
      ed
      NOT_STORED
```

In this case we first add a new key/value of name1/erin via telnet and received
the message STORED from Couchbase Server. When we attempt to add the same key
with a new value, Couchbase Server returns NOT\_STORED via telnet. This helps
provide some form of consistency and atomicity for the record when you use `add`
and it fails for an existing key. In order to change the value of an existing
key, we need to use the `replace` method.

To update a value via telnet, you use the `replace` command with the original
key:


```
set sue 0 0 2
    ok
    STORED
    replace sue 0 0 3
    new
    STORED
    get sue
    VALUE sue 0 3
    new
    END
```

In the first three lines of the session, we set the new key 'sue' with 0 as
flags, 0 as TTL, a value 'ok' of length 2. Couchbase sets the new record
successfully and returns STORED. Then we replace the key sue with a new value of
length 3, 'new'. After the new value is successfully stored, we get it and the
record Couchbase retrieves reflects this change. Notice when you replace a key,
you can also update the flags and TTL should you choose to do so.

This next example demonstrates a check and set command at the telnet prompt. For
check and set use the `cas` command and provide any new flags, expiration, new
length, and cas value. We can retrieve the cas value for a key using the `gets`
command:


```
set record1 0 0 4
      sara
      STORED
      gets record1
      VALUE record1 0 4 10
      sara
      END
      cas record1 0 0 7 10
      maybell
      STORED
```

In this example we set record1 to have 0 flags, 0 expiration, and a length of 4
characters. We set the value to the name 'sara'. When Couchbase Server
successfully stores the record it automatically creates a cas value. which we
get with gets. The last number returned by gets in the telnet session is the cas
value. In this next step, we perform a check and set with the record1 key with
no flags, no expiration, seven characters and the value 'maybell.'


```
cas record1 0 0 7 10
      maybell
      STORED
```

When the cas command succeeds, Couchbase server updates the cas value for
record1. If you attempt to check and set the record with the wrong cas value,
Couchbase Server will return the error 'EXISTS' to the telnet session:


```
cas record1 0 0 3 10
      sue
      EXISTS
```

<a id="storing-data"></a>
