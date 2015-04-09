# Introduction

This guide provides information for developers who want to use the Couchbase .NET SDK to build applications that use Couchbase Server.

Beginning with the 1.2.5 release, Couchbase .NET Client Library supports .NET Framework versions 3.5 and 4.0.

# Getting Started

This section helps you get started using Couchbase Server and the .NET (C\#)
Client Library.

## Downloading the software

To get the software:

1. [Download and install Couchbase Server](http://www.couchbase.com/download).

2. Get the client library by using one of the following methods:

	* Download the zip file from [here](http://packages.couchbase.com.s3.amazonaws.com/clients/net/1.3/Couchbase-Net-Client-1.3.11.zip).

	* Run the following command in the [NuGet](http://www.nuget.org) package manger console:

			PM> Install-Package CouchbaseNetClient


## Setting up a project

Create a new console project in Visual Studio. Add references to the **Couchbase.dll**, **Enyim.Caching.dll**, and **Newtonsoft.Json.dll** assemblies that are in the release zip file.

Visual Studio console applications target the .NET Framework Client Profile by
default, so you need to change the project properties to target the
full .NET Framework. If you skip this step, you'll have compilation errors.

## Adding configuration

You can configure your Couchbase client either programmatically or using the
**app.config** file with the appropriate Couchbase configuration section. Using **app.config** s more flexible and is the preferred approach. Modify your **app.config** file as follows:


```xml
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
the cluster configuration. If you're running on your local development machine, include only a single URI and use 127.0.0.1 as the address.

The `bucket` and `bucketPassword` attributes are optional because the default Couchbase Server installation creates a bucket named `default` that does not use a password. If you create an authenticated bucket, you must specify those values in place of the default settings shown in the example.

By default, the TCP/IP port allocation on Windows includes a restricted number of
ports available for client communication. For more information on this issue,
including information about how to adjust the configuration and increase the
available ports, see <a href=http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx> MSDN: Avoiding TCP/IP Port Exhaustion</a>.

## Instantiating the Client

To instantiate the client, add the following using statements to the **Program.cs** file:


```csharp
using Couchbase;
using Enyim.Caching.Memcached;
using Newtonsoft.Json;
```

Couchbase is the namespace containing the client and configuration classes with
which you'll work. `Enyim.Caching.Memcached` contains supporting infrastructure. Because Couchbase supports the memcached protocol, it can
make use of the popular EnyimMemcached client for many of its core key-value
operations.

Next, create an instance of the client in the `Main` method. Use the default
constructor, which depends on the configuration from the **app.config** file.


```csharp
var client = new CouchbaseClient();
```

In practice, it's expensive to create clients. The client incurs overhead as it
creates connection pools and sets up the thread to get cluster configuration.
Therefore, the best practice is to create a single client instance, per bucket,
per AppDomain. Creating a static property on a class works well for this
purpose. For example:


```csharp
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

However, for the purpose of this getting started section, the locally scoped client
variable created above is sufficient.

### Performing CRUD Operations

The primary CRUD API used by the .NET Client is a standard key-value
store. You create and update documents by supplying a key and value. You
retrieve or remove documents by supplying a value. For example, consider the following JSON document that you'll find in the `beer-sample` bucket that's available when you install Couchbase Server and set up your cluster. The key for this document is `new_holland_brewing_company-sundog`.


```json
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

To retrieve this document, call the `Get` method of the client:


```csharp
var savedBeer = client.Get("new_holland_brewing_company-sundog");
```

If you add a line to print `savedBeer` to the console, you should see a JSON
string that contains the data from the JSON document.


```csharp
var savedBeer = client.Get("new_holland_brewing_company-sundog");
Console.WriteLine(savedBeer);
```

In this example, `savedBeer` would be of type `Object`. To get a string back instead and avoid having to cast, use the generic version of Get:


```csharp
var savedBeer = client.Get<string>("new_holland_brewing_company-sundog");
```

To add a document, first create a JSON string:


```csharp
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

In this example, the key is formed by taking the name of the beer and prefixing it with the name of the brewery, separated with a dash and replacing spaces replaced with underscores. The mechanism by which you create your keys needs to be consistent. If you are going to query documents by key (not just through views), you should choose predictable keys (for example, `cottrell_brewing-old_yankee_ale`).


```csharp
var key = "cottrell_brewing-old_yankee_ale";
```

You can store the document, as shown in the following example:


```csharp
var result = client.Store(StoreMode.Add, "cottrell_brewing-old_yankee_ale", newBeer);
```

The `Store` method takes several arguments. The first is the store mode. For the store mode value, use `StoreMode.Add` for new keys, `StoreMode.Replace` to update existing keys, and `StoreMode.Set` to add when a key doesn’t exist or to replace it when it does. `Store` fails if `StoreMode.Add` is used with an existing key or `StoreMode.Replace` is used with a nonexistent key. The second and third arguments are the key and value, respectively. The return value, assigned to `result` in this example, is a Boolean that indicates whether the operation succeeded.

Removing a document entails calling the `Remove` method with the key to be
removed. Like the other methods shown so far, `Remove` returns a Boolean value
indicating operation success. For example:

```csharp
var result = client.Remove("cottrell_brewing-old_yankee_ale");
```

### Storing JSON Documents

While storing and retrieving JSON strings is a straightforward process, documents in a typical application are likely at some point to be represented by domain objects (that is, [POCOs](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)). More mileage  comes from storing some representation of these data objects. For example, the beer documents could be represented by an instance of a Beer class in memory. The .NET Client Library allows for serializable objects to be persisted using .NET's standard over-the-wire serialization. However, on the server, these objects are stored as binary attachments to a JSON document. The impact of being an attachment is that it is not indexed in a view. A better solution is to serialize data objects to JSON strings before storing them and deserializing JSON document strings to objects when retrieving them.

### Using CouchbaseClient JSON Extension Methods

If you want an easy way to read and write JSON, the `CouchbaseClientExtensions` class under the Couchbase.Extensions namespace provides two very basic methods, `StoreJson` and `GetJson`. Both methods depend on the open source Newtonsoft.Json library, which is already a dependency of the Couchbase .NET Library. Both methods wrap only the most basic Get and Store overloads and don't currently support CAS or TTL operations. They are included with the library for convenience and might be augmented in the future by a Couchbase Labs extension library.

To improve the way beer data is managed in this getting started project, add a
new file, **Beer.cs**, to the project. It contains a plain-old-CLR-object (POCO)
with mappings from class properties to JSON properties. For brevity, some
document properties have been omitted. The `Type` property is read-only and forces all beer instances to be marked with the type
`beer`. This type information is useful when you want to create views and find all "beer" documents. The **Beer.cs** file looks like this:


```csharp
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

By default, Json.NET serializes the properties of your class in the case you
created them. Because we want our properties to match the casing of the
documents in the beer-sample bucket, we're going to set JSON property names in
JsonProperty attributes (in the Newtonsoft.Json namespace). Again, we could
store instances of this Beer class without converting them to JSON first
(requires marking the class with a Serializable attribute), but that would
prevent those documents from being indexed in views.

Persisting an instance as JSON is similar to how we persisted the JSON document
string above. Replace the code where a JSON string was created with the code
below.


```csharp
var newBeer = new Beer
{
    Name = "Old Yankee Ale",
    ABV = 5.00f,
    BreweryId = "cottrell_brewing",
    Style = "American-Style Amber",
    Category = "North American Ale"
};
```

To store the new instance, use the extension method. The returned `result` object contains a Boolean that indicates whether the operation succeeded.

```csharp
var result = client.StoreJson(StoreMode.Set, key, newBeer);
```

Retrieving the Beer instance is also similar to retrieving a document:

```csharp
var savedBeer = client.GetJson<Beer>(key);
```

At this point, your **Program.cs** file should look something like the
following example:


```csharp
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

### Working with Views

MapReduce views are used to create secondary indexes in Couchbase
Server that can be queried. The primary index for documents is the key you use when performing the
standard CRUD methods described previously. See the view documentation for more
information on writing views.

The following example queries the `by_name` view in the beer design document.
This view just checks whether a document is a beer and has a name. If it does,
it emits the beer's name into the index. This view allows for beers to be
queried by name. For example, it's now possible to ask the question "What
beers start with A?"


```javascript
function (doc, meta) {
  if (doc.type && doc.type == "beer" && doc.name) {
     emit(doc.name, null);
  }
}
```

Querying a view through the .NET Client Library requires calling the `GetView`
method and providing the name of the design document and the name of the view.


```csharp
var view = client.GetView("beer", "by_name");
```

The return type of `GetView` is an enumerable `IView`, where each enumerated value is an `IViewRow`. The actual view query isn't run until you enumerate over the view. For example, if you wanted to print out each of the keys that have been indexed, you could use the `IViewRow` instance's Info dictionary. This particular view emits null as the value, so that is empty when this snippet runs.

```csharp
foreach (var row in view)
{
    Console.WriteLine("Key: {0}, Value: {1}", row.Info["key"], row.Info["value"]);
}
```

The code above should give you a list of beer names for all beer documents that
exist in the beer-sample bucket. If you want to filter that list, there are
fluent methods that can be chained off of the `IView` instance before iterating
over it. Modifying the `GetView` call above as follows finds all beers whose
names start with "A" and limits the results to 50 rows. See the API reference
for other fluent methods. These methods return an `IView`
instance, which is an `IEnumerable`, but is not an `IQueryable`. Therefore, using
LINQ extension methods on the `IView` does not reduce the results in the query.
Only the `IView` fluent methods affect the query before it is run.


```csharp
var view = client.GetView("beer", "by_name").StartKey("A").EndKey("B").Limit(50);
```

Also included in the `IViewRow` instance, is the original ID (the key from the key-value pair) of the document. It is accessible by way of the `ItemId` property of the `IViewRow`. Taking that ID, it is possible to retrieve the original document. Using the JSON extension methods, it's also possible to get a Beer instance for each row. If it seems expensive to perform these lookups, recall that Couchbase Server has a memcached layer built in, and these queries are unlikely to be pulling data from disk. The documents are likely to be found in memory.


```csharp
foreach (var row in view)
{
    var doc = client.GetJson<Beer>(row.ItemId);
    Console.WriteLine(doc.Name);
}
```

Finally, there is a generic version of `GetView` that encapsulates the details of
the view row data structures. To retrieve Beer instances automatically by ID as
you iterate over the view, you need to add the generic parameter to `GetView`
along with the third Boolean argument to tell the client to perform the by ID
lookup. If you omit the third parameter, the client attempts to deserialize
the value emitted by the index into an instance of the specified generic type.
Again, in this example the value was null. Therefore, deserialization must be
done by way of ID lookup.


```csharp
var view = client.GetView<Beer>("beer", "by_name", true).StartKey("A").EndKey("B").Limit(50);

foreach (var beer in view)
{
    Console.WriteLine(beer.Name);
}
```

For more information about using views for indexing and querying from Couchbase
Server, see the following resources:

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


