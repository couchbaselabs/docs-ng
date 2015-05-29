# Introduction

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

This guide provides information for developers who want to use the Couchbase .NET SDK to build applications that use Couchbase Server.

# Getting Started

This chapter will get you started with using Couchbase Server and the.NET (C\#)
Client Library. This article will walk you through the following:

 1. Downloading and installing the Couchbase client library.

 1. Setting up a command-line driven C\# application in Visual Studio 2010, and
    referencing the Couchbase client library.

 1. Writing a simple program to demonstrate connecting to Couchbase and saving some
    data in the database.

 1. Exploring the Couchbase client library's API so that you are better equipped to
    begin to write more complex applications.

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and one data
bucket established. If you need to set up these items, you can do with the
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

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="downloading"></a>

## Downloading the Couchbase Client Library

The Couchbase.NET client library is a.NET library that can be downloaded from
the Couchbase Client Library language center
[http://memcached.enyim.com](http://www.couchbase.com/download). It is shared
with a lower-level library implements the memcached protocol (which is also the
low-level protocol supported by Couchbase), along with more functionality
through the enhancements that Couchbase provides.

<a id="getting-started-hello"></a>

## Hello C# Couchbase

The easiest way to create and compile C\# programs is by using Visual Studio
2010. Let's go into Visual Studio and create a HelloCouchbase project by
completing the following steps (see Figure 2):

 1. Click on File > New > Project

 1. Choose: Visual C\# > Windows > Console Application as your template

 1. Give the project the name HelloCouchbase

 1. Click OK to create the new project


    ![](images/fig-hello-couchbase-solution.png)

 1. Right click the HelloCouchbase project in the solution explorer and choose Add |
    New Folder, and name the new folder Libraries

 1. Drag and drop all of the.dll,.pdb, and.xml files from the.NET Client Library
    zip-file you downloaded into the Libraries folder

 1. Right click on References and choose Add Reference

 1. Click on the Browse tab and then find the Libraries folder and choose the
    Enyim.Caching.dll and the Couchbase.dll

 1. Since the project is not a web application, we need to reconfigure it so that a
    few of the *System.Web* assemblies are referenced. To do this, we also need to
    switch to the full.NET 4.0 profile instead of the client profile. Start by right
    clicking the HelloCouchbase project and choosing Properties and in the 'Target
    Framework' drop-down list, choose '.NET Framework 4'.

 1. Next, add another reference from the.NET tab of the Add Reference dialog, choose
    "System.Web (Version 4.0.0.0)".

After you have done these steps, your solution should look like that shown in
Figure 2.


![](images/fig-solution-with-references.png)

Next you will need to configure the client library to talk with Couchbase. This
is most easily done by editing the App.config file to add a configuration
section. You can also do your configuration in code, but the benefits of adding
this to the.config file is that you can change it later without having to
recompile. Also, when you start writing web applications using ASP.NET you can
add the same configuration to the Web.config file.

Listing 1: App.config file


```
<?xml version="1.0"?>
<configuration>

  <configSections>
    <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
  </configSections>

  <couchbase>
    <servers bucket="private" bucketPassword="private">
      <add uri="http://10.0.0.33:8091/pools/default"/>
    </servers>
  </couchbase>

  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0"/>
  </startup>
</configuration>
```

You would change the uri to point at your server by replacing 10.0.0.33 with the
IP address or hostname of your Couchbase server machine. Be sure you set your
bucket name and password. You can also set the connection to use the default
bucket, by setting the bucket attribute to "default" and leaving the
bucketPassword attribute empty. In this case we have configured the server with
a bucket named "private" and with a password called "private". Feel free to
change these to whatever you have configured on your server.

Now you are ready to begin your first C\# application to talk with your
Couchbase server. Enter the code in Listing 2 into Program.cs:

Listing 2: Simple C\# Application


```
using System;
using Enyim.Caching.Memcached;
using Couchbase;

namespace HelloCouchbase
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var client = new CouchbaseClient())
            {
                String spoon = null;

                if ((spoon = client.Get<string>("Spoon")) == null)
                {
                    Console.WriteLine("There is no spoon!");
                    client.Store(StoreMode.Set,
                                 "Spoon",
                                 "Hello, Couchbase!",
                                 TimeSpan.FromMinutes(1));
                }
                else
                {
                    Console.WriteLine(spoon);
                }
            }
        }
    }
}
```

If you run this program without debugging, by hitting Ctrl-F5, you will
initially see the following output:


```
There is no spoon!
Press any key to continue
```

If you then press Ctrl-F5 again, you will see some different output:


```
Hello, Couchbase!
Press any key to continue
```

The code creates an instance of a `CouchbaseClient` in a using block so that it
will be properly disposed of before the program exits. Creation of the
`CouchbaseClient` instance is an expensive operation, and you would not want to
create an instance every time you need one. Usually this would be done once in
an application, and stored for when it is needed.

Next the code makes a call to the generic `client.Get>T>` method. If you know
that you've stored a string in a particular database key this method allows you
to return the string without having to perform a typecast. If you get the type
wrong, a `ClassCastException` will be thrown, so be careful. Any type marked
with the \[Serializable\] attribute can be stored into Couchbase.

Press Ctrl-F5 again. You'll notice that there is no spoon. Where did it go? If
you notice, the `client.Store()` method was given a `TimeSpan` parameter
indicating the expiry time of the key in the database. After that amount of time
the key will cease to exist and its value will be forgotten. This is convenient
to store information that has a short lifetime, such as a user session, or other
data that is expensive to calculate, but is only valid for a short period of
time like the daily bus schedule for a given bus stop, or the number of people
that have visited a particular web page since midnight.

The Couchbase client library also has a very useful way of keeping keys from
expiring without having to write new data into them, called the `Touch()`
method. In order to use this, you must have a very recent Couchbase server
(currently version 1.7 or higher) that supports the Touch operation. If your
server is new enough, try adding the following line in bold to the else block:


```
else
                {
                    Console.WriteLine(spoon);
                    client.Touch("Spoon", TimeSpan.FromMinutes(1));
                }
```

Now you will be able to press Ctrl-F5 every 30 seconds for the rest of your life
if you wanted to. The expiry time of the Spoon value will be extended every time
the application is run, keeping it nice and fresh. If you stop for more than one
minute Spoon will expire again.

<a id="api-overview"></a>

### Couchbase API overview

The Couchbase client library has many API methods that you can use to implement
whatever you desire. The following tables outline some API categories, the
methods that are available, and a short description of what those methods do.

<a id="memcached-methods"></a>

### Memcached methods

These methods allow all of the operations defined for the memcached protocol,
which is implemented in the Enyim client library inside the
`Enyim.Caching.MemcachedClient` class. A few of these methods have generic
versions that allow automatic type casting of serializable objects to be
retrieved. Many of these methods can also return a Boolean value indicating
whether the operation succeeded or failed.

`Append`    | Append some bytes to the end of a key.                                              
------------|-------------------------------------------------------------------------------------
`Decrement` | Decrement a key and return the value.                                               
`FlushAll`  | Flush all data on all servers for the connected bucket.                             
`Get`       | Get the value for a key.                                                            
`Increment` | Increment the value of a key.                                                       
`Prepend`   | Prepend some bytes to the start of a key.                                           
`Remove`    | Removes a key from the database.                                                    
`Stats`     | Return statistics about a key, or about the servers in the cluster.                 
`Store`     | Stores a value for a key.                                                           
`TryGet`    | Tries to get a value, and returns a Boolean if the value was successfully retrieved.

<a id="check-and-set"></a>

### Check And Set

The `MemcachedClient` has a number of methods that allow a Check and Set
operation to be performed on keys in the database. Check and Set operations
(CAS) are a way to prevent data loss in a distributed database without heavy
locks or transactions. Before you write data into the database you can obtain
the current `cas` value, which is effectively like a version number for the data
in the database. When you write your new data into the database you pass along
the version you think the data is supposed to have. If, by the time the write
happens, the value is no longer valid your code will be told that your write
failed. You will then be able to take corrective action such as reading the new
value, its cas, and retrying your operation.

`Cas`           | Perform a Check And Set operation.                                                                      
----------------|---------------------------------------------------------------------------------------------------------
`Decrement`     | Some of the Decrement overloads support returning a `CasResult`.                                        
`GetWithCas`    | Perform a Get and also return a `CasResult`.                                                            
`Increment`     | Some Increment overloads support passing back a Cas to check for whether the operation succeeded.       
`TryGetWithCas` | Returns a Boolean so your code knows if the value exists or not, and returns a CasResult if it succeeds.

<a id="couchbase-methods"></a>

### Specialized Couchbase Methods

The Couchbase library includes the `CouchbaseClient` class, which is a subclass
of the `MemcachedClient` class. It has a set of methods that provide very
powerful ways to interact with data and extent the expiry time concurrently. You
will be able to use all of these methods (get, touch and CAS equivalents) on
both both Couchbase and Memcached buckets in Couchbase 1.7, except for the Sync
operation. Sync is only supported on Couchbase buckets.

`Get`           | A special form of Get, sometimes referred to as Get and Touch, which a returns the value but allows the expiry time to be reset.                                                                                                              
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`GetWithCas`    | Get a value, its Cas, and also reset the expiry, all at once.                                                                                                                                                                                 
`Sync`          | A very new operation that allows you to wait for data in the database to change in specific ways. Allows you to know when data has been persisted, replicated, or mutated. Remember this operation can only be performed on Couchbase buckets.
`Touch`         | Reset a keys expiry date without getting its value.                                                                                                                                                                                           
`TryGet`        | Try to get a value, a Boolean indicates success, reset the expiry, all at once.                                                                                                                                                               
`TryGetWithCas` | Swiss army knife. Gets a Boolean indicating if the operation succeeded, gets a `CasResult` and also resets the expiry time of value.                                                                                                          

<a id="conclusion"></a>

### Conclusion

We hope you have enjoyed this very brief introduction to using the Enyim client
library to connect your C\# programs to your Couchbase database. We would
encourage you to spend some time working though the Tutorial application as
well.

<a id="tutorial"></a>
