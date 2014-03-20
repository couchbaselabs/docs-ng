# JSON Extension Methods

The following sections provide details on how to use the `CouchbaseClient` JSON
extensions.

The `Couchbase.Extensions` namespace contains a series of extension methods that
provide out of the box support for storing and retrieving JSON with Couchbase
Server. These methods use JSON.NET, and provide only limited customization. If
your JSON serialization needs are advanced, you will need to provide your own
methods to work with JSON.

To use the JSON extensions in your application, you'll first need to include a
using block for the extensions namespace


```
using Couchbase.Extensions;
```

Once that using directive has been added, an instance of an `ICouchbaseClient`
will be able to execute various JSON methods.

Generally speaking, for each store or get method, there is a corresponding Json
method.


```
//Person will be stored using binary serialization
    var storeResult = client.ExecuteStore(StoreMode.Set, "person1", new Person { Name = "John" });

    //Person will be stored as a view-ready, JSON string { name : "John" }
    var storeJsonResult = client.ExecuteStoreJson(StoreMode.Set, "person2", new Person { Name = "John" });

    //getResult.Value will contain an instance of a Person
    var getResult = client.ExecuteGet<Person>("person1");

    //InvalidCastException will be thrown, since "person1" contains a binary value
    var getJsonResult = client.ExecuteGetJson<Person>("person1");

    //Invalid cast exception, because person2 contains a string
    var getResult = client.ExecuteGet<Person>("person2");

    //getJsonResult.Value will contain an instance of a Person
    var getJsonResult = client.ExecuteGetJson<Person>("person2");
```

`ExecuteStoreJson` is overloaded to provide support for key expiration, and
durability requirements.


```
var person = new Person { Name = "John" };

    //key will expire in 10 minutes
    var storeJsonResult1 = client.ExecuteStoreJson(StoreMode.Set, "john", person, DateTime.Now.AddMinutes(10));

    //key will expire in 10 minutes
    var storeJsonResult2 = client.ExecuteStoreJson(StoreMode.Set, "john", person, TimeSpan.FromMinutes(10));

    //storeJsonResult3 will fail unless the key is written to disk on its master node, and replicated to two nodes
    var storeJsonResult3 = client.ExecuteStoreJson(StoreMode.Set, "john", person, PersistTo.One, ReplicateTo.Two);
```

CAS operations are also available via the `ExecuteCasJson` extension method.


```
var person = new Person { Name = "John" };

    var getResult = client.ExecuteGetJson("key");
    getResult.Value.Name = "John Z";

    //would fail if the CAS value has changed on the server since it was retrieved
    var casResult = client.ExecuteCasJson(StoreMode.Set, "key", getResult.Value, getResult.Cas);
```

The JSON extensions make an important assumption about your model objects, and
how they serialize and deserialize them. It is important that you understand
this assumption before using these methods. Consider the following Person class:


```
public class Person
{
  public string Id { get; set; }

  public string Type { get { return "person"; } }

  public string Name { get; set; }
}
```

The assumption is that the `Id` property of a domain object is meant to be
mapped to the key in the key/value used to store your data.


```
var person = new Person { Id = "person_12345", Name = "Tony Soprano" };

var storeResult = client.ExecuteStoreJson(StoreMode.Set, person.Id, person);

//the JSON would be:
//{ "name" : "Tony Soprano", type : "person" }
```

When the JSON is saved, it will ignore the `Id` property and its value. Since it
is assumed that the `Id` is the key, it would be redundant to include it in the
saved JSON. Moreover, it would also be a challenge to keep the key in sync with
the JSON.

When the `Person` is retrieved, the `ExecuteGetJson` method will automatically
map the `Id` property to the key. This mapping is achieved by inserting the key
as an "id" property in the JSON document before it is deserialized.


```
var getResult = client.ExecuteGetJson<Person>("person_12345");

Console.WriteLine("Id: " + Person.Id);
//Id: person_12345
```

The importance of how the "id" property is mapped is that you are able to take
advantage of JSON.NET attributes to have some control over which property is
your "Id" property. If you wanted to map the key to a `Key` property, then you
could use the `JsonProperty` attribute as below. Note however, that should you
use this mapping, it will override the ignore "id" on write and you'll have your
key in the JSON.


```
public class Person
{
  [JsonProperty("Id")]
  public string Key { get; set; }

  public string Type { get { return "person"; } }

  public string Name { get; set; }
}
```

The default behavior of the JSON extensions works well with strongly typed
views, which will also map an `Id` property of a class to its key as you iterate
over the view.


```
var view = client.GetView<Person>("people", "by_name", true).Key("Tony Soprano");
var person = view.FirstOrDefault();

Console.WriteLine("Id: " + Person.Id);
//Id: person_12345
```

<a id="couchbase-sdk-net-configuration"></a>
