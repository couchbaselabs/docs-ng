# Couchbase and ASP.NET MVC

This tutorial will walk you through the steps of creating an ASP.NET MVC app
using Couchbase. It will focus on practical design patterns, best practices
along with general SDK usage.

<a id="prerequisites"></a>

## Prerequisites

This tutorial assumes that you have Visual Studio 2010 installed, along with
[ASP.NET MVC 4](http://www.asp.net/mvc). You may use any edition of Visual
Studio or you may use Visual Web Developer. Visual Studio 2012 will also work
for this tutorial, but the screenshots included will be from Visual Studio 2012
Professional.

You will also need to have an installation of Couchbase Server 2.0 and have
obtained the latest Couchbase .NET Client Library, version 1.2 or higher. See
“Getting Started” for more information on client installation.

You also may use an older version of ASP.NET MVC if you do not have MVC 4
installed, but as with using Visual Web Developer or Visual Studio 2012, the
templates shown in the screenshots will vary from what you see.

You should also have installed the beer-sample database on your Couchbase
Server. If you haven't, simply open the web console and navigate to the
“Settings” tab. There, you'll find an option to add a sample bucket to your
cluster.

<a id="stage1"></a>

## Visual Studio Project Setup

This project will be based on an ASP.NET MVC 4 application template. After
opening Visual Studio, select File -> New Project and then select Web -> ASP.NET
MVC 4 Application under the Visual C\# project templates. Name the project
“CouchbaseBeersWeb” and click “OK” to create the solution.


![](images/fig01-new-project.png)

Start with an “Empty” application using the Razor view engine for the MVC
template.


![](images/fig02-mvc-template.png)

Next you'll need to add a reference to the Couchbase .NET Client Library. You
could either download the assemblies from [the getting started
page](http://www.couchbase.com/develop/net/current/) or obtain them using the
NuGet package manager. When you install via Nuget, your project will
automatically get references to Couchbase.dll, Enyim.Caching.dll and the
dependencies Newtonsoft.Json.dll and Hammock.dll. These assemblies are also
found in the zip file and should be referenced in your project if not using
Nuget.


![](images/fig03-nuget-cb.png)

<a id="stage2"></a>

## Working with Models

The first task to solve is displaying a list of breweries in from our
beer-sample bucket. To add this functionality, there is some plumbing to setup
in our application. These tasks are enumerated below.

 * Create a `Brewery` model class to represent beer documents

 * Create a `BreweryRepository` to encapsulate data access for Brewery instances

 * Create a `BreweriesController` with an Index action used to show a Brewery list

 * Create a Razor view to display our list of breweries

As a JSON document database, Couchbase supports a natural mapping of domain
objects to data items. In other words, there's very little difference between
the representation of your data as a class in C\# and the representation of your
data as a document in Couchbase. Your object becomes the schema defined in the
JSON document.

When working with domain objects that will map to documents in Couchbase, it's
useful, but not required, to define a base class from which your model classes
will derive. This base class will be abstract and contain two properties, “Id”
and “Type.”

Right click on the “Models” directory and add a new class named “ModelBase” and
include the following code.


```
public abstract class ModelBase
{
    public virtual string Id { get; set; }
    public abstract string Type { get; }
}
```

Note that the Type method is abstract and readonly. It will be implemented by
subclasses simply by returning a hard-coded string, typically matching the class
name, lower-cased. The purpose of the Type property is to provide taxonomy to
the JSON documents stored in your Couchbase bucket. The utility will be more
obvious when creating views.

Next, create a new class namedin the “Models” directory of your project. This
class will be a plain old CLR object (POCO) that simply has properties mapping
to the properties of brewery documents in the beer-sample bucket. It will also
extend `ModelBase`.


```
public class Brewery : ModelBase
{
    public string Name { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Code { get; set; }
    public string Country { get; set; }
    public string Phone { get; set; }
    public string Website { get; set; }
    public DateTime Updated { get; set; }
    public string Description { get; set; }
    public IList<string> Addresses { get; set; }
    public IDictionary<string, object> Geo { get; set; }
    public override string Type
   {
        get { return "brewery"; }
   }
}
```


```
{
  "name": "Thomas Hooker Brewing",
  "city": "Bloomfield",
  "state": "Connecticut",
  "code": "6002",
  "country": "United States",
  "phone": "860-242-3111",
  "website": "http://www.hookerbeer.com/",
  "type": "brewery",
  "updated": "2010-07-22 20:00:20",
  "description": "Tastings every Saturday from 12-6pm, and 1st and 3rd Friday of every month from 5-8.",
  "address": [
    "16 Tobey Road"
  ],
  "geo": {
    "accuracy": "RANGE_INTERPOLATED",
    "lat": 41.8087,
    "lng": -72.7108
  }
}
```

<a id="stage3"></a>

## Encapsulating Data Access

After creating the Brewery class, the next step is to create the data access
classes that will encapsulate our Couchbase CRUD and View operations. Create a
new file in “Models” named “RepositoryBase`1.cs” with a class name of
“RepositoryBase.” This will be an abstract class, generically constrained to
work with `ModelBase` instances. Note the “`1” suffix on the file name is a
convention used for generic classes in C\# projects.


```
public abstract class RepositoryBase<T> where T : ModelBase
{
   //CRUD methods
}
```

The process of creating an instance of a `CouchbaseClient` is expensive. There
is a fair amount of overhead as the client establishes connections to the
cluster. It is therefore recommended to minimize the number of times that a
client instance is created in your application. The simplest approach is to
create a static property or singleton that may be accessed from data access
code. Using the `RepositoryBase`, setting up a protected static property will
provide access for subclasses.


```
public abstract class RepositoryBase<T> where T : ModelBase
{
    protected static CouchbaseClient _Client { get; set; }
    static RepositoryBase()
    {
        _Client = new CouchbaseClient();
    }
}
```

The code above requires setting configuration in web.config. It is of course
equally valid to define the configuration in code if that is your preference.
See [getting started](http://www.couchbase.com/develop/net/current) for more
details.


```
<configSections>
    <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
</configSections>
<couchbase>
    <servers bucket="beer-sample">
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

<a id="stage4"></a>

## Working with Views

To display a list of all breweries, a view will be necessary. This map function
for this view will simply emit null keys and values for each of the brewery
documents in the database. This view will live in a “breweries” design document
and be named “all.”

For more information on working with views in the admin console, see [the
documentation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-editor.html).


```
function(doc, meta) {
    if (doc.type == "brewery") {
        emit(null, null);
    }
}
```

A null-key index still provides access to each of the document's keys when the
view is queried. Note however that range queries on keys would not be supported
with this view.

You could create the “all” view above by creating a new design document in the
Couchbase web console or you could use the `CouchbaseCluster` API ( [see
docs](http://www.couchbase.com/docs/couchbase-sdk-net-1.2/couchbase-sdk-net-cluster-management.html)
) found in Couchbase.dll to create and to save a design document. However, an
easier approach is to use the [CouchbaseLabs](http://github.com/couchbaselabs)
project Couchbase Model Views.

The Couchbase Model Views project is not part of the Client Library, but makes
use of its design doc management API to create views from attributes placed on
model classes. Using NuGet, add a reference to the CouchbaseModelViews package.


![](images/fig04-nuget-mv.png)

Once installed, modify the Brewery class definition to have two class level
attributes, `CouchbaseDesignDoc` and `CouchbaseAllView`.


```
[CouchbaseDesignDoc("breweries")]
[CouchbaseAllView]
public class Brewery : ModelBase
{
    //props omitted for brevity
}
```

The `CouchbaseDesignDoc` attribute instructs the Model Views framework to create
a design document with the given name. The `CouchbaseAllView` will create the
“all” view as shown previously.

To get the Model Views framework to create the design doc and view, you'll need
to register the assembly containing the models with the framework. In
Global.asax, create a static `RegisterModelViews` method for this purpose.


```
public static void RegisterModelViews(IEnumerable<Assembly> assemblies)
{
    var builder = new ViewBuilder();
    builder.AddAssemblies(assemblies.ToList());
    var designDocs = builder.Build();
    var ddManager = new DesignDocManager();
    ddManager.Create(designDocs);
}
```

Then in the existing `Application_Start` method, add a line to register the
current assembly.


```
RegisterModelViews(new Assembly[] { Assembly.GetExecutingAssembly() });
```

Note that the Model Views framework will create the design doc only if it has
changed, so you don't have to worry about your indexes being recreated each time
your app starts.

To test that the Model Views framework is working, simply run the application
(Ctrl + F5). If all went well, you should be able to navigate to the “Views” tab
in the Couchbase web console and see the new design doc and view in the
“Production Views” tab (as shown below).


![](images/fig05-all-view.png)

If you click the link next to the “Filter Results” button, you will see the JSON
that is returned to the `CouchbaseClient` when querying a view. Notice the “id”
property found in each row. That is the key that was used to store the document.


```
{"total_rows":1412,"rows":[
{"id":"21st_amendment_brewery_cafe","key":null,"value":null},
{"id":"357","key":null,"value":null},
{"id":"3_fonteinen_brouwerij_ambachtelijke_geuzestekerij","key":null,"value":null},
{"id":"512_brewing_company","key":null,"value":null},
{"id":"aass_brewery","key":null,"value":null},
{"id":"abbaye_de_leffe","key":null,"value":null},
{"id":"abbaye_de_maredsous","key":null,"value":null},
{"id":"abbaye_notre_dame_du_st_remy","key":null,"value":null},
{"id":"abbey_wright_brewing_valley_inn","key":null,"value":null},
{"id":"aberdeen_brewing","key":null,"value":null}
]
}
```

With the view created, the next step is to modify the `RepositoryBase` to have a
`GetAll` method. This method will use some conventions to allow for reuse across
subclasses. One of those conventions is that queries will be made to design docs
with camel-cased and pluralized names (e.g., Brewery to breweries). To aid in
the pluralization process, create a reference to inflector\_extension using
NuGet. Note that in .NET 4.5, there is a `PluralizationService` class that will
provide some of the same support.


![](images/fig06-nuget-i.png)

To the `RepositoryBase` class, add a readonly private field and initialize it to
the inflected and pluralized name of the type of T. The inflector extension
methods will require an additional using statement.


```
using inflector_extension;
private readonly string _designDoc;
public RepositoryBase()
{
    _designDoc = typeof(T).Name.ToLower().InflectTo().Pluralized;
}
```

The initial implementation of `GetAll` will simply return all breweries using
the generic `GetView<T>` method of `CouchbaseClient`. The third parameter
instructs `CouchbaseClient` to retrieve the original document rather than
deserialize the value of the view row.


```
public virtual IEnumerable<T> GetAll()
{
    return _Client.GetView<T>(_designDoc, "all", true);
}
```

`RepositoryBase` is a generic and abstract class, so obviously it cannot be used
directly. Create a new class in “Models” named “BreweryRepository.” The code for
this class is very minimal, as it will rely on its base class for most
functionality.


```
public class BreweryRepository : RepositoryBase<Brewery>
{
}
```

<a id="viewsandcontroller"></a>

## The Views and Controller

With the models and repository coded, the next step is to create the controller.
Right click on the “Controllers” directory in the project and select Add ->
Controller. Name the controller “BreweriesController” and select the template
“Controller with empty read/write actions,” which will create actions for
creating, updating, deleting, showing and listing breweries.


![](images/fig07-controller-template.png)

The Index method of the `BreweriesController` will be used to display the list
of breweries. To allow the new controller to access brewery data, it will need
an instance of a `BreweryRepository`. Create a public property of type
`BreweryRepository` and instantiate it in the default constructor.


```
public BreweryRepository BreweryRepository { get; set; }
public BreweriesController()
{
    BreweryRepository = new BreweryRepository();
}
```

Then inside of the `Index` method, add a call to `BreweryRepository` 's `GetAll`
method and pass its results to the view as its model.


```
public ActionResult Index()
{
    var breweries = BreweryRepository.GetAll();
    return View(breweries);
}
```

The last step to displaying the list of breweries is to create the Razor view
(as in MVC views, not Couchbase views). In the “Views” directory, create a new
directory named “Breweries.” Right click on that new directory and select “Add”
-> “View.” Name the view “Index” and create it as a strongly typed (to the
`Brewery` class) view with List scaffolding. This template will create a Razor
view that loops over the brewery results, displaying each as a row in an HTML
table.


![](images/fig08-list-breweries.png)

At this point, you should build your application and navigate to the Breweries
path (e.g., [http://localhost:52962/breweries](http://localhost:52962/breweries)
). If all went well, you should see a list of breweries.


![](images/fig09-list-page.png)

There are quite a few breweries being displayed in this list. Paging will be an
eventual improvement, but for now limiting the results by modifying the defaults
of the GetAll method will be sufficient.


```
//in RepositoryBase
public IEnumerable<T> GetAll(int limit = 0)
{
    var view = _Client.GetView<T>(_designDoc, "all", true);
    if (limit > 0) view.Limit(limit);
    return view;
}
//in BreweriesController
public ActionResult Index()
{
    var breweries = BreweryRepository.GetAll(50);
    return View(breweries);
}
```

For more information about using views for indexing and querying from Couchbase
Server, here are some useful resources:

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

<a id="brewerycrud"></a>

## Brewery CRUD

The MVC scaffolding that created the Razor template to list breweries also
included links to create, show, edit and delete breweries. Using more
scaffolding, these CRUD features are easily implemented.

Create and Update methods require a bit of effort to encapsulate. One decision
to make is whether to use the detailed result `ExecuteStore` method or the
`Boolean>` Store method of the Client. `ExecuteStore` returns an instance of an
`IStoreOperationResult`, which contains a success status and error message
properties, among others.

Since it is likely important to know whether operations succeeded,
`ExecuteStore` will be used in our `RepositoryBase`. However, that interface
will be hidden from the application and instead an int will be returned by each
method. The int will be the status code returned by Couchbase Server for each
operation.


```
public virtual int Create(T value){}
public virtual int Update(T value) {}
public virtual int Save(T value) {}
```

There are other implementation details that need to be considered when
implementing these methods, namely key creation and JSON serialization.

CRUD operations in Couchbase are performed using a key/value API. The key that
is used for these operations may be either meaningful (i.e., human readable) or
arbitrary (e.g., a GUID). When made human readable, your application may be able
to make use of predictable keys to perform key/value get operations (as opposed
to secondary indexes by way of view operations).

A common pattern for creating readable keys is to take a unique property, such
as `Brewery.Name`, and replace its spaces, possibly normalizing to lowercase. So
“Thomas Hooker Brewery” becomes “thomas\_hooker\_brewery.”

Add the following `BuildKey` method to the `RepositoryBase` to allow for default
key creation based on the `Id` property.


```
protected virtual string BuildKey(T model)
{
    if (string.IsNullOrEmpty(model.Id))
    {
        return Guid.NewGuid().ToString();
    }
    return model.Id.InflectTo().Underscored;
}
```

`BuildKey` will default to a `GUID` string when no Id is provided. It's also
virtual so that subclasses are able to override the default behavior. The
`BreweryRepository` needs to override the default behavior to provide a key
based on brewery name.


```
protected override string BuildKey(Brewery model)
{
    return model.Name.InflectTo().Underscored;
}
```

When storing a `Brewery` instance in Couchbase Server, it first has to be
serialized into a JSON string. An important consideration is how to map the
properties of the `Brewery` to properties of the JSON document.

JSON.NET (from Newtonsoft.Json) will by default serialize all properties.
However, `ModelBase` objects all have an Id property that shouldn't be
serialized into the stored JSON. That Id is already being used as the document's
key (in the key/value operations), so it would be redundant to store it in the
JSON.

JSON.NET supports various serialization settings, including which properties
should be included in serialization. In `RepositoryBase`, create a
`serializAndIgnoreId` method and a private `DocumentIdContractResolver` class as
shown below.


```
private string serializeAndIgnoreId(T obj)
{
    var json = JsonConvert.SerializeObject(obj,
        new JsonSerializerSettings()
        {
            ContractResolver = new DocumentIdContractResolver(),
        });
    return json;
}

private class DocumentIdContractResolver : CamelCasePropertyNamesContractResolver
{
    protected override List<MemberInfo> GetSerializableMembers(Type objectType)
    {
        return base.GetSerializableMembers(objectType).Where(o => o.Name != "Id").ToList();
    }
}
```

The `DocumentIdContractResolver` will prevent the Id property from being saved
into the JSON. It also extends `CamelCasePropertyNamesContractResolver` to
provide camel-cased properties in the JSON output.

Note that there is a `JsonIgnore` attribute that could be added to properties
that should be omitted from the serialized JSON, however it is less global in
its application. For example, if a class overrides the `Id` property of
`ModelBase`, it would have to add the attribute.

With this new plumbing in place, it's now possible to complete the `Create`,
`Update` and `Save` methods. Exceptions are caught and wrapped in the
IStoreOperationResult's Exception property. If an exception is detected, it will
be thrown up to the caller. These new methods also have an optional durability
argument, which will block until a document has been written to disk, or the
operation times out. By default, there is no durability requirement imposed.


```
public virtual int Create(T value, PersistTo persistTo = PersistTo.Zero)
{
    var result = _Client.ExecuteStore(StoreMode.Add, BuildKey(value), serializeAndIgnoreId(value), persistTo);
    if (result.Exception != null) throw result.Exception;
    return result.StatusCode.Value;
}

public virtual int Update(T value, PersistTo persistTo = PersistTo.Zero)
{
    var result = _Client.ExecuteStore(StoreMode.Replace, value.Id, serializeAndIgnoreId(value), persistTo);
    if (result.Exception != null) throw result.Exception;
    return result.StatusCode.Value;
}

public virtual int Save(T value, PersistTo persistTo = PersistTo.Zero)
{
    var key = string.IsNullOrEmpty(value.Id) ? BuildKey(value) : value.Id;
    var result = _Client.ExecuteStore(StoreMode.Set, key, serializeAndIgnoreId(value), persistTo);
    if (result.Exception != null) throw result.Exception;
    return result.StatusCode.Value;
}
```

The `Get` method of `RepositoryBase` requires similar considerations.
`CouchbaseClient.ExecuteGet` returns an `IGetOperationResult`. To be consistent
with the goal of not exposing Couchbase SDK plumbing to the app, `Get` will
return the object or null if not found, while throwing a swallowed exception.
Notice also that the `Id` property of the model is set to the value of the key,
since it's not being stored in the JSON.


```
public virtual T Get(string key)
{
    var result = _Client.ExecuteGet<string>(key);
    if (result.Exception != null) throw result.Exception;

    if (result.Value == null)
    {
        return null;
    }

    var model = JsonConvert.DeserializeObject<T>(result.Value);
    model.Id = key; //Id is not serialized into the JSON document on store, so need to set it before returning
    return model;
}
```

Completing the CRUD operations is the `Delete` method. `Delete` will also hide
its SDK result data structure ( `IRemoveOperationResult` ) and return a status
code, while throwing swallowed exceptions. Delete also supports the durability
requirement overload.


```
public virtual int Delete(string key, PersistTo persistTo = PersistTo.Zero)
{
    var result = _Client.ExecuteRemove(key, persistTo);
    if (result.Exception != null) throw result.Exception;
    return result.StatusCode.HasValue ? result.StatusCode.Value : 0;
}
```

<a id="breweryforms"></a>

## Brewery Forms

With the new methods implemented, it's time to create the scaffolding for the
CRUD forms. The first task will be to create an edit form. Open the
`BreweriesController` and locate the `Edit` methods that were generated by the
Add Controller wizard.

In the HTTP GET override of `Edit`, modify it as shown below. This action will
retrieve the `Brewery` and pass it to the view as the model. Note the change
from an int id parameter to a string id parameter.


```
public ActionResult Edit(string id)
{
    var brewery = BreweryRepository.Get(id).Item1;
    return View(brewery);
}
```

Update the `Edit` method that handles POSTs as shown below. Validation and error
handling are intentionally being omitted for brevity.


```
[HttpPost]
public ActionResult Edit(string id, Brewery brewery)
{
    BreweryRepository.Update(brewery);
    return RedirectToAction("Index");
}
```

The edit form will be created using scaffolding, as was the case with the
listing page. Right click on the “Breweries” folder in the “Views” directory and
click Add -> View. Name the view “Edit” and strongly type it to a Brewery with
Edit scaffolding.


![](images/fig10-edit-template.png)

Rebuild the application and return to the brewery listing page.  Click on an
“Edit” link and you should see the edit form loaded with the details for that
brewery.  Edit some values on the form and click save. You should see your
changes persisted on the listing page.


![](images/fig11-edit-brewery.png)

The `Details` action looks very much like `Edit`. Get the `Brewery` and provide
it as the model for the view.


```
public ActionResult Details(string id)
{
    var brewery = BreweryRepository.Get(id).Item1;
    return View(brewery);
}
```

Create a scaffolding form for `Details` using the same process as was used with
`Edit`.


![](images/fig12-details-template.png)

Rebuild and return to the list page. Click on a "Details" link. You should see a
page listing the data for that brewery.


![](images/fig13-details-brewery.png)

The `Create` and `Edit` actions of the `BreweriesController` are quite similar,
save for the fact that Create's GET method doesn't provide a model to the view.
Again, error handling and validation are being omitted for brevity's sake.


```
public ActionResult Create()
{
    return View();
}
[HttpPost]
public ActionResult Create(Brewery brewery)
{
    BreweryRepository.Create(brewery);
    return RedirectToAction("Index");
}
```

Go through the scaffolding process again to add a create view for the `Create`
action.  Rebuild and click the “Create New” link on the list page to test the
new form.  Breweries (for now) are sorted by key and limited to 50, so you might
not see yours in the list.  If you want to verify your create action worked, use
brewery name that starts with a numeric value (e.g., 123 Brewery).

Another reason you wouldn't see your new brewery appear in the list of breweries
is that the view is set to allow stale (eventually consistent) results.  In
other words, the incremental update to the “all” index would be performed after
the query.  If you refresh, you should see your brewery in the list. 

Allowing the breweries to be sorted by key is convenient, since the key is based
on the breweries name.  However, if case-sensitivity is important in sorting or
the key creation strategy changes, then explicitly sorting on the brewery's name
is a better idea.  To that end, creating a new view indexed on the Brewery name
is the right approach.

The new map function will look similar to the “all” map function, but will add
tests on “doc.name” and will emit the doc.name as the key. 


```
function(doc, meta) {
    if (doc.type == "brewery" && doc.name) {
        emit(doc.name, null);
    }
}
```

If you are using the web console to manage your design documents, save the map
function above as “by\_name” in the “breweries” design document.  If you are
using the Model Views framework, add an attribute to the `Name` property of
`Brewery>`.  Then compile and run your application. 

Adding the `CouchbaseViewKey` attribute will create the view above.  The first
argument is the name of the view.  The second is the name of the JSON document
property to emit as key. 


```
[CouchbaseViewKey("by_name", “name”)]
public string Name { get; set; }
```

The next step is to replace the GetAll call with a call to the new view.  First,
add a protected method in RepositoryBase that returns a typed view instance, set
with the design doc for that model type.  The isProjection flag is set when the
type of T does not properties of the JSON to properties of the class.  It must
be used with explicit JSON.NET mappings.


```
protected IView<T> GetView(string name, bool isProjection = false)
{
    return _Client.GetView<T>(_designDoc, name, ! isProjection);
}
```

Then in `BreweryRepository`, implement `GetAllByName` as shown below. This new
method simply returns the view, optionally allowing a limit and stale results.


```
public IEnumerable<Brewery> GetAllByName(int limit = 0, bool allowStale = false)
{
    var view = GetView("by_name");
    if (limit > 0) view.Limit(limit);
    if (! allowStale) view.Stale(StaleMode.False);
    return view;
}
```

Next, modify the `BreweriesController` so that the `Index` action calls the new
`GetAllByName` method.


```
public ActionResult Index()
{
    var breweries = BreweryRepository.GetAllByName(50);
    return View(breweries);
}
```

Compile and run your application.  The list page might be ordered a little
differently as the sample database did scrub some keys of punctuation and other
non-word or non-digit characters.  Also now (because of the stale setting), if
you create a new Brewery, it should appear after a redirect and should not
require a refresh.

Note that it is still possible that the view didn't consider the new Brewery
when it was executed with state set to false.  If the document hadn't persisted
to disk before the index was updated, it wouldn't have been included. 

If that level of consistency is important to your application, you should use an
overload of `ExecuteStore` that includes durability requirements.  See the
documentation on ExecuteStore for more information.

The last piece required to complete the CRUD functionality for breweries is to
implement the delete form.  `Update` the `Delete` actions in
`BreweriesController` as shown below.


```
public ActionResult Delete(string id)
{
    var brewery = BreweryRepository.Get(id).Item1;
    return View(brewery);
}
[HttpPost]
public ActionResult Delete(string id, Brewery brewery)
{
    BreweryRepository.Delete(id);
    return RedirectToAction("Index");
}
```

To create the delete form, simply go through the Add View process again and
choose scaffolding for delete (don't forget to choose the `Brewery` model).

<a id="collatedviews"></a>

## Collated Views

At this point, you've written a full CRUD app for breweries in the beer-sample
database. Another optimization we might want to include is to show the names of
beers that belong to a particular brewery. In the relational world, this is
typically accomplished using a join between two tables. In Couchbase, the
solution is to use a collated view.

Before looking at the map function for this view, it's useful to inspect a beer
document.


```
{
   "name": "Old Stock Ale 2004",
   "abv": 11.4,
   "ibu": 0,
   "srm": 0,
   "upc": 0,
   "type": "beer",
   "brewery_id": "north_coast_brewing_company",
   "updated": "2010-07-22 20:00:20",
   "description": "",
   "style": "Old Ale",
   "category": "British Ale"
}
```

Note the “brewery\_id” property.  This is the key of a brewery document and can
be thought of as a “foreign key.”  Note that this type of document foreign key
relationship is not enforced by Couchbase.

The basic idea behind a collated view is to produce an index in which the keys
are ordered so that a parent id appears first, followed by its children.  In the
beer-sample case that means a brewery appears in a row followed by rows of
beers. 

The basic algorithm for the map function is to check the doc.type.  If a brewery
is found, emit its key (meta.id).  If a child is found, emit its parent id
(brewery\_id).  The map function for the view “all\_with\_beers” is shown below.


```
function(doc, meta) {
    switch(doc.type) {
        case "brewery":
            emit([meta.id, 0]);
            break;
        case "beer":
            if (doc.name && doc.brewery_id) {
                emit([doc.brewery_id, doc.name, 1], null);
            }
    }
}
```

The trick to ordering properly the parent/child keys is to use a composite key
in the index.  Parent ids are paired with a 0 and children with a 1.  The
collated order of the view results is shown conceptually below. 


```
A Brewery, 0
A Brewery, 1
A Brewery, 1
B Brewery, 0
B Brewery, 1
```

To use Model Views to create this view, simply add an attribute to an overridden
Id property on the Brewery class.


```
[CouchbaseCollatedViewKey("all_with_beers", "beer", "brewery_id", "name")]
public override string Id { get; set; }
```

This is a good time to introduce a simple `Beer` class, of which Brewery will
have a collection. Create a new model class named "Beer." For now, include only
the `Name` property.


```
public class Beer : ModelBase
{
    public string Name { get; set; }
    public override string Type
    {
        get { return "beer"; }
    }
}
```

Then add a `Beer` list property to `Brewery`. This property shouldn't be
serialized into the doc, so add the `JsonIgnore` attribute.


```
private IList<Beer> _beers = new List<Beer>();
[JsonIgnore]
public IList<Beer> Beers
{
    get { return _beers; }
    set { _beers = value; }
}
```

Since the collated view has a mix of beers and breweries, the generic
`GetView<T>` method won't work well for deserializing rows. Instead, we'll use
the GetView method that returns `IViewRow` instances. First add a new
`GetViewRaw` method to `RepositoryBase`.


```
protected IView<IViewRow> GetViewRaw(string name)
{
    return _Client.GetView(_designDoc, name);
}
```

Then in `BreweryRepository`, add a `GetWithBeers` method to build the object
graph. This new method performs a range query on the view, starting with the
brewery id and including all possible beer names for that brewery.


```
public Tuple<Brewery, bool, string> GetWithBeers(string id)
{
    var rows = GetViewRaw("all_with_beers")
        .StartKey(new object[] { id, 0 })
        .EndKey(new object[] { id, "\uefff", 1 })
        .ToArray();
    var result = Get(rows[0].ItemId);
    result.Item1.Beers = rows.Skip(1)
        .Select(r => new Beer { Id = r.ItemId, Name = r.ViewKey[1].ToString() })
        .ToList();
    return result;
}
```

Update the `Details` method of `BreweriesController` to use this method.


```
public ActionResult Details(string id)
{
    var brewery = BreweryRepository.GetWithBeers(id).Item1;
    return View(brewery);
}
```

Before the closing `fieldset` tag in details template, add a block of Razor code
to display the beers.


```
<div class="display-field">Beers</div>
 <div>
    @foreach (var item in Model.Beers)
    {
        <div style="margin-left:10px;">- @item.Name</div>
    }
</div>
```

<a id="paging"></a>

## Paging

The final feature to implement on the brewery CRUD forms is paging.  It's
important to state up front that paging in Couchbase does not work like paging
in a typical RDBMS.  Though views have skip and limit filters that could be used
create the standard paging experience, it's not advisable to take this
approach. 

The skip filter still results in a read of index data starting with the first
row of the index.  For example, if an index has 5000 rows and skip is set to 500
and limit is set to 50, 500 records are read and 50 returned.  Instead,
linked-list style pagination is the recommended approach.  Paging should also
consider the document ids because keys may collide.  However, in the breweries
example, paging on name is safe because name is the source of the unique key.

First add an HTML footer to the list table in the Index view, right before the
final closing table tag.  There is a link back to the first page and links to
the previous and next pages.  A default page size of 10 is also used.  Each time
the page is rendered, it sets the previous key to the start key of the previous
page.  The next key will be explained shortly.


```
<tr>
    <td colspan="4">
        @Html.ActionLink("List", "Index", new { pagesize = 10 })
        @Html.ActionLink("< Previous", "Index", new { startKey = Request["previousKey"], pagesize = Request["pagesize"] ?? "10" })
        @Html.ActionLink("Next >", "Index", new { startKey = ViewBag.NextStartKey, previousKey =  ViewBag.StartKey, pagesize = Request["pagesize"] ?? "10"})
    </td>
</tr>
```

Modify the `GetAllByName` method in `BreweryRepository` to be able to handle
range queries (startkey, endkey).


```
public IEnumerable<Brewery> GetAllByName(string startKey = null, string endKey = null, int limit = 0, bool allowStale = false)
{
    var view = GetView("by_name");
    if (limit > 0) view.Limit(limit);
    if (! allowStale) view.Stale(StaleMode.False);
    if (! string.IsNullOrEmpty(startKey)) view.StartKey(startKey);
    if (! string.IsNullOrEmpty(endKey)) view.StartKey(endKey);
    return view;
}
```

For the actual paging, modify the `BreweryController` 's Index method to keep
track of pages. The trick is to select page size + 1 from the view. The last
element is not rendered, but its key is used as the start key of the next page.
In simpler terms, the start key of the current page is the next page's previous
key. The last element's key is not displayed, but is used as the next page's
start key.


```
public ActionResult Index(string startKey, string nextKey, int pageSize = 25)
{
    var breweries = BreweryRepository.GetAllByName(startKey: startKey, limit: pageSize+1);
    ViewBag.StartKey = breweries.ElementAt(0).Name;
    ViewBag.NextStartKey = breweries.ElementAt(breweries.Count()-1).Name;
    return View(breweries.Take(pageSize));
}
```


![](images/fig14-paging.png)

At this point, breweries may be created, detailed (with Children), listed,
updated and deleted.  The next step is to look at the brewery data from a
different perspective, namely location.

Brewery documents have multiple properties related to their location.  There are
state and city properties, as well as detailed geospatial data.  The first
question to ask of the data is how many breweries exist for a given country. 
Then within each country, the counts can be refined to see how many breweries
are in a given state, then city and finally zip code.  All of these questions
will be answered by the same view.

Create a view named “by\_country” with the code below.  This view will not
consider documents that don’t have all location properties.  The reason for this
restriction is so that counts are accurate as you drill into the data.


```
function (doc, meta) {
  if (doc.country && doc.state && doc.city && doc.code) {
     emit([doc.country, doc.state, doc.city, doc.code], null);
  }
}
```

For this view, you’ll also want a reduce function, which will count the number
of rows for a particular grouping by counting how many rows appear for that
grouping.  So for example, when the group\_level parameter is set to 2 brewery
counts will be returned by city and state.  For an analogy, think of a SQL
statement selecting a COUNT(\*) and having a GROUP BY clause with city and state
columns.

Couchbase has three built in reduce functions - \_count, \_sum and \_stats.  For
this view, \_count and \_sum will perform the same duties.  Emitting a 1 as a
value means that \_sum would sum the 1s for a grouping.  \_count would simply
count 1 for each row, even with a null value.

If you are using Model Views, then simply add `CouchbaseViewKeyCount` attributes
to each of the properties that should be produced in the view.


```
[CouchbaseViewKeyCount("by_country", "country", 0, null)]
public string Country { get; set; }

[CouchbaseViewKeyCount("by_country", "state", 1)]
public string State { get; set; }

[CouchbaseViewKeyCount("by_country", "city", 2)]
public string City { get; set; }

[CouchbaseViewKeyCount("by_country", "code", 3)]
public string Code { get; set; }
```

This view demonstrates how to create ordered, composite keys from domain object
properties using the Model Views framework.

The next step is to modify the `BreweryRepository` to include methods that will
return aggregated results grouped at the appropriate levels.  This new method
will return key value pairs where the key is the lowest grouped part of the key
and the value is the count.  Also add an enum for group levels.


```
public IEnumerable<KeyValuePair<string, int>> GetGroupedByLocation(BreweryGroupLevels groupLevel, string[] keys = null)
{
    var view = GetViewRaw("by_country")
                .Group(true)
                .GroupAt((int)groupLevel);
    if (keys != null)
    {
        view.StartKey(keys);
        view.EndKey(keys.Concat(new string[] { "\uefff" }));
    }
    foreach (var item in view)
    {
        var key = item.ViewKey[(int)groupLevel-1].ToString();
        var value = Convert.ToInt32(item.Info["value"]);
        yield return new KeyValuePair<string, int>(key, value);
    }
}
```

Create a new controller named "CountriesController" to contain the actions for
the new grouped queries. Use the empty controller template.


![](images/fig15-countries-controller.png)

Modify the new controller to include the code below, which sets up the
`BreweryRepositoryReference` and loads sends the view results to the MVC View.


```
public class CountriesController : Controller
{
    public BreweryRepository BreweryRepository { get; set; }
    public CountriesController()
    {
        BreweryRepository = new BreweryRepository();
    }
    public ActionResult Index()
    {
        var grouped = BreweryRepository.GetGroupedByLocation(BreweryGroupLevels.Country);
        return View(grouped);
    }
}
```

Next create a new directory under “Views” named “Countries.” Add a view named
“Index” that is not strongly typed.


![](images/fig16-countries-index.png)

To the new view, add the Razor code below, which will simply display the keys
and values as a list. It also links to the Provinces action, which you’ll create
next.


```
@model dynamic
<h2>Brewery counts by country</h2>
<ul>
@foreach (KeyValuePair<string, int> item in Model)
{
    <li>
        @Html.ActionLink(item.Key, "Provinces", new { country = item.Key})
        (@item.Value)
    </li>
}
</ul>
```

Build and run your application and you should see a page like below.


![](images/fig17-countries.png)

Next, add the `Provinces` action to the `CountriesController`. This action will
reuse the repository method, but will change the group level to Province (2) and
pass the selected country to be used as a key to limit the query results.


```
public ActionResult Provinces(string country)
{
    var grouped = BreweryRepository.GetGroupedByLocation(
                BreweryGroupLevels.Province, new string[] { country } );
    return View(grouped);
}
```

Create another empty view named “Provinces” in the “Countries” directory under
the “Views” directory. Include the content below, which is similar to the index
content.


```
@model dynamic
<h2>Brewery counts by province in @Request["country"]</h2>
<ul>
@foreach (KeyValuePair<string, int> item in Model)
{
    <li>
        @Html.ActionLink(item.Key, "Cities",
            new { country = Request["country"], province = item.Key})
        (@item.Value)
    </li>
}
</ul>
```

Compile and run the app. You should see the Provinces page below.


![](images/fig18-provinces.png)

Creating the actions and views for cities and codes is a similar process. Modify
`CountriesController` to include new action methods as shown below.


```
public ActionResult Cities(string country, string province)
{
    var grouped = BreweryRepository.GetGroupedByLocation(
                BreweryGroupLevels.City, new string[] { country, province });
    return View(grouped);
}
public ActionResult Codes(string country, string province, string city)
{
    var grouped = BreweryRepository.GetGroupedByLocation(
                BreweryGroupLevels.PostalCode, new string[] { country, province, city });
    return View(grouped);
}
```

Then add a view named "Cities" with the Razor code below.


```
@model dynamic
<h2>Breweries counts by city in @Request["province"], @Request["country"]</h2>
<ul>
@foreach (KeyValuePair<string, int> item in Model)
{
    <li>
        @Html.ActionLink(item.Key, "Codes",
            new { country = Request["country"],
                  province = Request["province"],
                  city = item.Key})
        (@item.Value)
    </li>
}
</ul>
```

Then add a view named "Codes" with the Razor code below.


```
@model dynamic
<h2>Brewery counts by postal code in @Request["city"], @Request["province"], @Request["country"]</h2>
<ul>
@foreach (KeyValuePair<string, int> item in Model)
{
    <li>
       @Html.ActionLink(item.Key, "Details",
            new { country = Request["country"],
                  province = Request["province"],
                  city = Request["city"],
                  code = item.Key})
        (@item.Value)
    </li>
}
</ul>
@Html.ActionLink("Back to Country List", "Index")
```

Compile and run the app. Navigate through the country and province listings to
the cities listing. You should see the page below.


![](images/fig19-cities.png)

Click through to the codes page and you should see the page below.


![](images/fig20-codes.png)

The last step for this feature is to display the list of breweries for a given
zip code. To implement this page, you need to add a new method to
`BreweryRepository` named `GetByLocation`. This method will use the same view
that we’ve been using, except it won’t execute the reduce step. Not executing
the reduce step means that the results come back ungrouped and individual items
are returned.


```
public IEnumerable<Brewery> GetByLocation(string country, string province, string city, string code)
{
    return GetView("by_country").Key(new string[] { country, province, city, code }).Reduce(false);
}
```

Then add a `Details` action method to the `BreweriesController` that calls this
method and returns its results to the view.


```
public ActionResult Details(string country, string province, string city, string code)
{
    var breweries = BreweryRepository.GetByLocation(country, province, city, code);
    return View(breweries);
}
```

Create a Details view in the “Countries” folder with the Razor code below.


```
@model IEnumerable<CouchbaseBeersWeb.Models.Brewery>
<h2>Breweries in @Request["code"], @Request["city"], @Request["province"], @Request["country"]</h2>
<ul>
@foreach (var item in Model)
{
    <li>
        @Html.ActionLink(item.Name, "Details", "Breweries", new { id = item.Id }, new { })
    </li>
}
</ul>
@Html.ActionLink("Back to Country List", "Index")
```

Compile and run the app. Click through country, province and state on to the
Codes view. The code above already has a link to this new Details page. When you
click on a postal code, you should see a list of breweries as below.


![](images/fig21-breweries-codes.png)

<a id="spatial"></a>

## Spatial Indexes

The last feature to add to the brewery app is the ability to search for
breweries using its longitude and latitude.  The experimental spatial indexes in
Couchbase allow for bounding box searches.  Spatial indexes are created by
emitting a GeoJSON document as the key.  This document must contain a
coordinates property to be indexed.

Using the web console, create a new spatial view (click “Add Spatial View”) in
the breweries design document named “points” using the spatial function below. 
Note that spatial views do not use the same map/reduce process as standard
views.


```
function (doc, meta) {
    if (doc.type == "brewery" && doc.geo.lng && doc.geo.lat) {
        emit({ "type": "Point", "coordinates": [doc.geo.lng, doc.geo.lat]}, null);

    }
}
```

If you are using Model Views, then you’ll need to modify the `Brewery` class.
Currently, the Model Views framework doesn’t support object graph navigation, so
you’ll need to flatten the “geo” property of the JSON document into the
`Brewery` as shown below. These flattened properties provide Model Views with a
way to build the spatial index.


```
[JsonIgnore]
public string GeoAccuracy
{
    get
    {
        return Geo != null && Geo.ContainsKey("accuracy") ? Geo["accuracy"] as string : "";
    }
}
[CouchbaseSpatialViewKey("points", "geo.lng", 0)]
[JsonIgnore]
public float Longitude
{
    get
    {
        return Geo != null && Geo.ContainsKey("lng") ? Convert.ToSingle(Geo["lng"]) : 0f;
    }
}
[CouchbaseSpatialViewKey("points", "geo.lat", 1)]
[JsonIgnore]
public float Latitude
{
    get
    {
        return Geo != null && Geo.ContainsKey("lat") ? Convert.ToSingle(Geo["lat"]) : 0f;
    }
}
```

Next, `RepositoryBase` should be modified to provide support for generic views.
As with `GetView` and `GetViewRaw`, these new methods are to provide some code
reuse to subclasses.


```
protected virtual ISpatialView<T> GetSpatialView(string name, bool isProjection = false)
{
    return _Client.GetSpatialView<T>(_designDoc, name, !isProjection);
}
protected virtual ISpatialView<ISpatialViewRow> GetSpatialViewRaw(string name)
{
    return _Client.GetSpatialView(_designDoc, name);
}
```

Then update `BreweryRepository` with a method to call the new “points” view.
Spatial views expect a bounding box with lower left and upper right coordinates,
ordered longitude then latitude. The UI will work with a delimited string, so
those points must be parsed and parsed as floats.


```
public IEnumerable<Brewery> GetByPoints(string boundingBox)
{
    var points = boundingBox.Split(',').Select(s => float.Parse(s)).ToArray();
    return GetSpatialView("points").BoundingBox(points[0], points[1], points[2], points[3]);
}
```

Then add a new class named “LocationsController” to the “Controllers” folder
using the code below.


```
public class LocationsController : Controller
{
    public BreweryRepository BreweryRepository { get; set; }
    public LocationsController()
    {
        BreweryRepository = new BreweryRepository();
    }
    [HttpGet]
    public ActionResult Details()
    {
        return View();
    }
    [HttpPost]
    public ActionResult Details(string bbox)
    {
        var breweriesByPoints = BreweryRepository.GetByPoints(bbox)
                                    .Select(b => new
                                    {
                                        id = b.Id,
                                        name = b.Name,
                                        geo = new float[] { b.Longitude, b.Latitude }
                                    });
        return Json(breweriesByPoints);
    }
}
```

Most of the code above is boilerplate. A `BreweryRepository` is declared and
initialized in the default constructor. The Details action that handles GET
requests simply returns the view. The Details request that handles POST requests
calls the new BreweryRepository method and renders a JSON array of brewery
projections that will be used in the view.

Next create a new Views folder called “Locations” and add a new view named
“Details” to it. This new view will make use of Nokia’s HERE location services
API. You can register for free at [http://here.com](http://here.com). Add the
Razor and JavaScript code below to your view.


```
@model CouchbaseBeersWeb.Models.Brewery
<style type="text/css">
    #mapContainer {
        width: 80%;
        height: 768px;
        margin-left:10%;
        margin-right:10%;
    }
</style>
<script type="text/javascript" charset="UTF-8" src="http://api.maps.nokia.com/2.2.3/jsl.js?with=all"></script>
<h2>View Breweries</h2>
<div id="mapContainer"></div>
<script type="text/ecmascript">
    nokia.Settings.set("appId", "<YOUR APP ID>");
    nokia.Settings.set("authenticationToken", "<YOUR TOKEN>");
    var mapContainer = document.getElementById("mapContainer");
    var map = new nokia.maps.map.Display(mapContainer, {
        center: [41.763309, -72.67408],
        zoomLevel: 8,
        components: [
            new nokia.maps.map.component.Behavior()
        ]
    });
    $().ready(function () {
        var loadBreweries = function () {
            var mapBoundingBox = map.getViewBounds();
            var queryBoundingBox = mapBoundingBox.topLeft.longitude + "," +                      mapBoundingBox.bottomRight.latitude + "," +
mapBoundingBox.bottomRight.longitude + ","
+ mapBoundingBox.topLeft.latitude;
            $.post("@Url.Action("Details")", { bbox: queryBoundingBox }, function (data) {
            var coordinates = new Array();
            $.each(data, function (idx, item) {
                var coordinate = new nokia.maps.geo.Coordinate(item.geo[1], item.geo[0]);
                var standardMarker = new nokia.maps.map.StandardMarker(coordinate);
                map.objects.add(standardMarker);
            });
        });
    };
    map.addListener("dragend", function (evt) {
        loadBreweries();
    });
    loadBreweries();
});
</script>
```

The details of the HERE API are beyond the scope of this tutorial.  The basic
idea though is that when the map is rendered, the bounding box coordinates are
obtained and passed (via AJAX) to the Details POST method on the
`LocationsController`.  The coordinates that come back are used to render points
on the map via a standard marker. 

Compile and run these last changes.  Navigate to /locations/details and you
should see a map such as the one shown below.


![](images/fig22-map.png)

<a id="conclusion"></a>

## Conclusion

At this point, the brewery features are complete.  Creating a set of pages for
the beer documents is a similar exercise that is left to the reader.  Using
scaffolding and reusing the patterns from working with breweries, it shouldn’t
take much effort to build those features. 

The code for this sample app is on GitHub at
[https://github.com/couchbaselabs/beer-sample-net](https://github.com/couchbaselabs/beer-sample-net). 
It contains all the code from this tutorial, plus the beer pages.  It also
contains some very minor style and navigation improvements (such as a home
page). 

Finally, a single tutorial can address only so many concerns.  Clearly some
shortcuts were taken with validation, exception handling and the like.  Certain
architectural patterns, such as dependency injection and MVVM were also omitted
for the sake of brevity.  The intent of this tutorial was to provide an
intermediate introduction to Couchbase development with .NET.  Your app should be
able to make use of some or all of the patterns described.

<a id="api-reference-summary"></a>
