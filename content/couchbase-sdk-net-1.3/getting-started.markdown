# Introduction

This guide provides information for developers who want to use the Couchbase .NET SDK to build applications that use Couchbase Server.

# Getting Started

This chapter will get you started with using Couchbase Server and the .NET (C\#)
Client Library.

As of release 1.2.5, the Couchbase.NET Client Library supports .NET Framework
versions 3.5 and 4.0.

<a id="server"></a>

## Get a Server

[Get & Install Couchbase Server.](http://www.couchbase.com/download) Come back
here when you're done

<a id="downloading"></a>

## Get a Client Library

It can either be [downloaded as a
zip file](http://packages.couchbase.com/clients/net/1.2/Couchbase-Net-Client-1.2.6.zip)
or run the following command in the NuGet Package Manger console:


```
PM> Install-Package CouchbaseNetClient
```

<a id="tryitout"></a>

## Try it Out!

### Project Setup

Create a new console project in Visual Studio. Add references to the
Couchbase.dll, Enyim.Memcached.dll, Newtonsoft.Json.dll and RestSharp.dll
assemblies found in the release zip file.

Visual Studio console applications target the .NET Framework Client Profile by
default, so you'll need to update the project properties to instead target the
full .NET Framework. If you skip this step, you'll have compilation errors.

<a id="configuration"></a>

### Adding Configuration

You can configure your Couchbase client either programmatically or using the
app.config file with the appropriate Couchbase config section. Using app.config
is more flexible and is the preferred approach. Modify your app.config file as
follows:


```
<?xml version="1.0"?>
<configuration>
  <configSections>
    <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
  </configSections>
  <couchbase>
    <servers bucket="default" bucketPassword="">
      <add uri="http://192.168.0.2:8091/pools"/>
      <add uri="http://192.168.0.3:8091/pools"/>
    </servers>
  </couchbase>
</configuration>
```

The URIs in the servers list are used by the client to obtain information about
the cluster configuration. If you're running on your local dev machine, include
only a single URI using 127.0.0.1 as the address.

The default Couchbase Server installation creates a bucket named "default"
without a password, therefore the bucket and bucketPassword attributes are
optional. If you created an authenticated bucket, you should specify those
values in place of the default settings above.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see [MSDN: Avoiding TCP/IP Port
Exhaustion](http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx).

<a id="clientinstantiation"></a>

### Instantiating the Client

Add the following using statements to Program.cs:


```
using Couchbase;
using Enyim.Caching.Memcached;
using Enyim.Caching.Memcached;
using Newtonsoft.Json;
```

Couchbase is the namespace containing the client and configuration classes with
which you'll work. Enyim.Caching.Memcached contains supporting infrastructure.
Recall that Couchbase supports the Memcached protocol and is therefore able to
make use of the popular Enyim Memcached client for many of its core key/value
operations.

Next create an instance of the client in the Main method. Use the default
constructor, which depends on the configuration from app.config.


```
var client = new CouchbaseClient();
```

In practice, it's expensive to create clients. The client incurs overhead as it
creates connection pools and sets up the thread to get cluster configuration.
Therefore, the best practice is to create a single client instance, per bucket,
per AppDomain. Creating a static property on a class works well for this
purpose. For example:


```
public static class CouchbaseManager
{
   private readonly static CouchbaseClient _instance;

   static CouchbaseManager()
   {
       _instance = new CouchbaseClient();
   }

   public static CouchbaseClient Instance { get { return _instance; } }
}
```

However, for the purpose of this getting started guide the locally scoped client
variable created above is sufficient.

<a id="crud"></a>

### CRUD Operations

The primary CRUD API used by the .NET Client is that of a standard key/value
store. You create and update documents by supplying a key and value. You
retrieve or remove documents by supplying a value. For example, consider the
JSON document that you'll find in the "beer-sample" bucket that's available when
you install Couchbase Server and setup your cluster. The key for this document
is "new\_holland\_brewing\_company-sundog."


```
{
 "name": "Sundog",
 "abv": 5.25,
 "ibu": 0,
 "srm": 0,
 "upc": 0,
 "type": "beer",
 "brewery_id": "new_holland_brewing_company",
 "updated": "2010-07-22 20:00:20",
 "description": "Sundog is an amber ale as deep as the copper glow of a Lake Michigan sunset. Its biscuit malt give Sundog a toasty character and a subtle malty sweetness. Sundog brings out the best in grilled foods, caramelized onions, nutty cheese, barbecue, or your favorite pizza.",
 "style": "American-Style Amber/Red Ale",
 "category": "North American Ale"
}
```

To retrieve this document, you simply call the Get method of the client.


```
var savedBeer = client.Get("new_holland_brewing_company-sundog");
```

If you add a line to print the savedBeer to the console, you should see a JSON
string that contains the data above.


```
var savedBeer = client.Get("new_holland_brewing_company-sundog");
Console.WriteLine(savedBeer);
```

In this example, savedBeer would be of type Object. To get a string back instead
and avoid having to cast, simply use the generic version of Get.


```
var savedBeer = client.Get<string>("new_holland_brewing_company-sundog");
```

To add a document, first create a JSON string.


```
var newBeer =
@"{
   ""name"": ""Old Yankee Ale"",
   ""abv"": 5.00,
   ""ibu"": 0,
   ""srm"": 0,
   ""upc"": 0,
   ""type"": ""beer"",
   ""brewery_id"": ""cottrell_brewing"",
   ""updated"": ""2012-08-30 20:00:20"",
   ""description"": ""A medium-bodied Amber Ale"",
   ""style"": ""American-Style Amber"",
   ""category"": ""North American Ale""
}";
```

For a key, we'll simply take the name of the beer and prefix it with the name of
the brewery, separated with a dash and with spaces replaced by underscores. The
exact mechanism by which you create your keys need only be consistent. If you
are going to query documents by key (not just through views) you should choose
predictable keys (e.g., cottrell\_brewing-old\_yankee\_ale).


```
var key = "cottrell_brewing-old_yankee_ale";
```

With this new key, the JSON document may easily be stored.


```
var result = client.Store(StoreMode.Add, "cottrell_brewing-old_yankee_ale", newBeer);
```

There are three arguments to Store. The first is the store mode. Use
StoreMode.Add for new keys, StoreMode.Replace to update existing keys and
StoreMode.Set to add when a key doesn’t exist or to replace it when it does.
Store will fail if Add is used with an existing key or Replace is used with a
non-existent key. The second and third arguments are the key and value,
respectively. The return value, assigned to the result variable, is a Boolean
indicating whether the operation succeeded.

Removing a document simply entails calling the Remove method with the key to be
removed. Like the other methods we've seen so far, Remove returns a Boolean
indicating operation success.


```
var result = client.Remove("cottrell_brewing-old_yankee_ale");
```

<a id="storingjson"></a>

### Storing JSON Documents

While storing and retreiving JSON strings is a straightforward process,
documents in a typical application are likely at some point to be represented by
domain objects (i.e., POCOs). More mileage will come from storing some
representation of these data objects. For example, the beer documents could be
represented by an instance of a Beer class in memory. The .NET Client Library
will allow for serializable objects to be persisted using .NET's standard
over-the-wire serialization. However, on the server, these objects will be
stored as binary attachments to a JSON document. The impact of being an
attachment is that it will not be indexed in a view. A better solution then, is
to serialize data objects to JSON strings before storing them and deserializing
JSON document strings to objects when retreiving them.

<a id="jsonextensions"></a>

### CouchbaseClient JSON Extension Methods

If you want an easy way to read and write JSON, the CouchbaseClientExtensions
class under the Couchbase.Extensions namespace provides two very basic methods,
StoreJson and GetJson. Both methods depend on the open source Newtonsoft.Json
library, which is already a dependency of the Couchbase .NET Library. Both
methods wrap only the most basic Get and Store overloads and don't currently
support CAS or TTL operations. They are included with the library for
convenience and will likely be augmented in the future by a Couchbase Labs
extension library.

To improve the way beer data is managed in this getting started project, add a
new file Beer.cs to the project. It will contain a plain-old-CLR-object (POCO)
with mappings from class properties to JSON properties. For brevity, some
document properties have been omitted. Notice also that the Type property has
been made read-only and forces all beer instances to be marked with the type
"beer." This type information will be useful when creating views and wanting to
find all "beer" documents.


```
public class Beer
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("abv")]
    public float ABV { get; set; }

    [JsonProperty("type")]
    public string Type
    {
       get { return "beer"; }
    }

    [JsonProperty("brewery_id")]
    public string BreweryId { get; set; }

    [JsonProperty("style")]
    public string Style { get; set; }

    [JsonProperty("category")]
    public string Category { get; set; }
}
```

By default, Json.NET will serialize the properties of your class in the case you
created them. Because we want our properties to match the casing of the
documents in the beer-sample bucket, we're going to set JSON property names in
JsonProperty attributes (in the Newtonsoft.Json namespace). Again, we could
store instances of this Beer class without converting them first to JSON
(requires marking the class with a Serializable attribute), but that would
prevent those documents from being indexed in views.

Persisting an instance as JSON is similar to how we persisted the JSON document
string above. Replace the code where a JSON string was created with the code
below.


```
var newBeer = new Beer
{
    Name = "Old Yankee Ale",
    ABV = 5.00f,
    BreweryId = "cottrell_brewing",
    Style = "American-Style Amber",
    Category = "North American Ale"
};
```

And to store the new instance, simply use the extension method. Result will
return a Boolean indicating operation success.


```
var result = client.StoreJson(StoreMode.Set, key, newBeer);
```

Retrieving the Beer instance is also similar to retrieving a document as was
demonstrated above.


```
var savedBeer = client.GetJson<beer><Beer>(key);</beer>
```

At this point, your simple Program.cs file should look something like the
following:


```
class Program
{
    static void Main(string[] args)
    {
        var client = new CouchbaseClient();
        var key = "cottrell_brewing-old_yankee_ale";

        var newBeer = new Beer
        {
            Name = "Old Yankee Ale",
            ABV = 5.00f,
            BreweryId = "cottrell_brewing",
            Style = "American-Style Amber",
            Category = "North American Ale"
        };

        var result = client.StoreJson(StoreMode.Set, key, newBeer);

        if (result)
        {
            var savedBeer = client.GetJson<Beer>(key);
            Console.WriteLine("Found beer: " + savedBeer.Name);
        }

    }
}
```

<a id="workingwithviews"></a>

### Working with Views

Map/Reduce Views are used to create queryable, secondary indexes in Couchbase
Server. The primary index for documents is the key you use when performing the
standard CRUD methods described above. See the view documentation for more
information on writing views.

For this example, the by\_name view in the beer design document will be queried.
This view simply checks whether a document is a beer and has a name. If it does,
it emits the beer's name into the index. This view will allow for beers to be
queried for by name. For example, it's now possible to ask the question "What
beers start with A?"


```
function (doc, meta) {
  if (doc.type && doc.type == "beer" && doc.name) {
     emit(doc.name, null);
  }
}
```

Querying a view through the .NET Client Library requires calling the GetView
method and providing the name of the design document and the name of the view.


```
var view = client.GetView("beer", "by_name");
```

The return type of GetView is an enumerable IView, where each enumerated value
is an IViewRow. The actual view query isn't run until you enumerate over the
view. For example, if you wanted to print out each of the keys that have been
indexed, you could use the IViewRow instance's Info dictionary. This particular
view emits null as the value, so that will be empty when this snippet runs.


```
foreach (var row in view)
{
    Console.WriteLine("Key: {0}, Value: {1}", row.Info["key"], row.Info["value"]);
}
```

The code above should give you a list of beer names for all beer documents that
exist in the beer-sample bucket. If you want to filter that list, there are
fluent methods that may be chained off of the IView instance before iterating
over it. Modifying the GetView call above as follows will find all beers whose
names start with "A" and limits the results to 50 rows. See the API reference
for other fluent methods. Please note that these methods return an IView
instance, which is an IEnumerable, but is not an IQueryable. Therefore, using
LINQ extension methods on the IView will not reduce the results in the query.
Only the IView fluent methods will affect the query before it is run.


```
var view = client.GetView("beer", "by_name").StartKey("A").EndKey("B").Limit(50);
```

Also included in the IViewRow instance, is the original ID (the key from the k/v
pair) of the document. It is accessible by way of the IViewRow's ItemId
property. Taking that ID, it is possible to retrieve the original document.
Using the JSON extension methods, it's also possible to get a Beer instance for
each row. If it seems expensive to perform these lookups, recall that Couchbase
Server has a Memcached layer built in and these queries are unlikely to be
pulling data from disk. The documents are likely to be found in memory.


```
foreach (var row in view)
{
    var doc = client.GetJson<Beer>(row.ItemId);
    Console.WriteLine(doc.Name);
}
```

Finally, there is a generic version of GetView which encapsulates the details of
the view row data structures. To retrieve Beer instances automatically by ID as
you iterate over the view, you need to add the generic parameter to GetView
along with the third Boolean argument to tell the client to perform the by ID
lookup. If you omit the third parameter, the client will attempt to deserialize
the value emitted by the index into an instance of the specified generic type.
Again, in this example the value was null. Therefore, deserialization must be
done by way of ID lookup.


```
var view = client.GetView<Beer>("beer", "by_name", true).StartKey("A").EndKey("B").Limit(50);

foreach (var beer in view)
{
    Console.WriteLine(beer.Name);
}
```

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

 * For more information on Views, how they operate, and how to write effective
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

<a id="tutorial"></a>
