# View/Query Interface

Provides support for views. For more information about using views for indexing
and querying from Couchbase Server, here are some useful resources:

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

View Interface


```
GetView(designName, viewName)
```

`GetView` takes a

 * `designName`

   Design document name.

 * `viewName`

   View name.

There is also a generic version of GetView, which returns view items that are
stongly typed.


```
GetData<T>(designName, viewName)
```

Both versions of `GetView` return an IView, which implements IEnumerable.
Therefore, when you query for the items in a view, you can iterate over the
returned collection as folows:


```
var beersByNameAndABV = client.GetView<Beer>("beers", "by_name_and_abv");
foreach(var beer in beersByNameAndABV) {
            Console.WriteLine(beer.Name);
}
```

or the non-generic version:


```
var beersByNameAndABV = client.GetView("beers", "by_name_and_abv");
foreach(var row in beersByNameAndABV) {
            Console.WriteLine((row.GetItem() as Beer).Name);
}
```

As you can see, when you iterate over a strongly typed view each item is of the
type you specified. If you use the non-generic version, each item you enumerate
over will be of type IViewRow. IViewRow provides methods for accessing details
of the row that are not present when using strongly typed views.

To get the original document from the datastore:


```
row.GetItem();
```

To get a `Dictionary` representation of the row:


```
row.Info;
```

To get the original document's ID (key):


```
row.ItemId;
```

To get the key emitted by the map function:


```
row.ViewKey;
```

Before iterating over the view results, you can modify the query that is sent to
the server by using the fluent methods of IView. Refer to the sample document
and view below when exploring the IView API.


```
//map function
function(doc) {
              if (doc.type == "beer") {
                 emit([doc.name, doc.abv], doc);
                 }
}

//sample json document
{
  "_id" : "beer_harpoon_ipa",
  "name" : "Harpoon IPA",
  "brewery" : "brewery_harpoon",
  "abv" : 5.9
}
```

To find beers with names starting with "H" and an ABV of at least 5:


```
var beersByNameAndABV = client.GetView("beers", "by_name_and_abv")
                                                                       .StartKey(new object[] { "H", 5 });
```

To limit the number of beers returned by the query to 10:


```
var beersByNameAndABV = client.GetView("beers", "by_name_and_abv")
                                                                       .Limit(10);
```

To group the results (when using \_count for example):


```
var beersByNameAndABV = client.GetView("breweries", "breweries_by_state")
                                                                       .Group(true);
```

To disallow stale results in the view:


```
var beersByNameAndABV = client.GetView("beers", "by_name_and_abv")
                                                                       .Stale(StaleMode.False);
```

IView API methods may be chained. To limit the number of results to 5 and order
the results descending:


```
var beersByNameAndABV = client.GetView("beers", "by_name_and_abv")
                                                                       .Limit(5).Descending(true);
```

<a id="api-reference-troubleshooting"></a>
