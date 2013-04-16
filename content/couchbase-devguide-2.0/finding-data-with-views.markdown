# Finding Data with Views

In Couchbase 2.0 you can index and query JSON documents using *views*. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to:

 * Find all the documents in your database that you need for a particular process,

 * Create a copy of data in a document and present it in a specific order,

 * Create an index to efficiently find documents by a particular value or by a
   particular structure in the document,

 * Represent relationships between documents, and

 * Perform calculations on data contained in documents. For example, if you use
   documents to represent users and user points in your application, you can use a
   view to find out which ten users have the top scores.

This chapter will describe how you can do the following using Couchbase SDKS and
view functions:

 * Extract and order specific data,

 * Creating an index and use it to perform efficient document lookups,

 * Retrieve a range of entries, and

 * Perform a *reduce* function, which computes a value based on entry values.

This section is not an exhaustive description of views and managing views with
Couchbase Server; it is merely a summary of basic concepts and SDK-based
examples to start using views with Couchbase SDKs. For more detailed information
about views, managing views, and handling views using Couchbase Web Console, see
[Couchbase Server Manual: Views and
Indexes](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).
To see examples and patterns you can use for views, see [Couchbase Views, Sample
Patterns](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns.html
)

<a id="understanding-views"></a>

## Understanding Views

If you are coming from a relational database background and are familiar with
SQL, you know how to use the query language to specify exactly *what* data you
want out of the database. In Couchbase 2.0, you use *views* to perform these
types of operations.

You can use views in Couchbase Server 2.0 to extract, filter, aggregate, and
find information. View are essentially functions you write which Couchbase
Server will then use to find information or perform calculations on information.
For Couchbase Server, finding information with views is a two-stage process,
based on a technique called *map/reduce*.

First you create a view by you providing a *map* function which will filter
entries for certain information and can extract information. The result of a map
function is an ordered list of key/value pairs, called an *index*. The results
of map functions are persisted onto disk by Couchbase Server and will be updated
incrementally as documents change.

You can also provide an optional *reduce* function which can sum, aggregate, or
perform other calculations on information.

Couchbase Server stores one or more view functions as strings in a single JSON
document, called a *design document* ; each design document can be associated
with a data bucket. To see the relationship between these logical elements, see
the illustration below:


![](couchbase-devguide-2.0/images/view_elements.png)

Once you have your view functions, the next step is to *query* a view to
actually get back data from Couchbase Server. When you query a view, you are
asking for results based on that view. Based on the functions in a view,
Couchbase Server will create a result set, which contains key value pairs. Each
key and value in the result set is determined by the logic you provide in your
views functions. Imagine you have several thousand contacts in Couchbase Server
and you want to get all the phone numbers which begin with the prefix 408. Given
a view function that defines this, Couchbase Server would return results that
appears as follows:


![](couchbase-devguide-2.0/images/view_result_set.png)

In this case our results are an ordered list of key and values where the keys
are phone numbers starting with a 408, and we have no value in our results
except the ids of documents containing matching prefixes. The keys will be
sorted based on the key value in ascending, alphabetical order. We can
potentially use these ids to lookup more information from the documents
containing the 408 phone number such as name, city, or address. We could have
also used the map function to provide values from matching entries in our index,
such as names.

Couchbase Server will create an index based on a view for all items that have
been persisted to disk. There may be cases where you want to ensure an item has
been persisted to disk and will therefore appear in a result set when you query
a view. Couchbase SDKs provide helper methods, collectively referred to as
*observe-functions* to get more information about an item you want to persist
and then index. For more information, see [Monitoring Data (Using
Observe)](couchbase-devguide-ready.html#monitoring-data).

Notice also that Couchbase Server generates an index and returns a result set
*when you actually query the view*. Building an index is a resource-intensive
process that you may not want to trigger each time you query a view. There may
be cases where you will want Couchbase Server to explicitly rebuild an index and
include any new documents that have been persisted since your last query; in
other cases, you may not care about retrieving an index that contains the most
recent items. Couchbase SDKs enable you to specify if you want to query and
refresh the index to include current items, or if you only want the index that
is currently stored. For more information about this topic, see [Building an
Index](couchbase-devguide-ready.html#building-index)

For more detailed information about views, including how and when Couchbase
Server creates an index based on views, see [Couchbase Server Manual,
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-basics.html).

<a id="filter-extract-data"></a>

## Filtering and Extracting Data

One of the simplest ways to learn about views is to create a basic map function
which extracts data from entries. Imagine we have our own blog application and
we want to provide a list of blog posts by title. First imagine what the JSON
documents would look like for our blog posts:


```
{
  "title":"Move Today",
  "body":"We just moved into a new big apartment in Mountain View just off of....",
  "date":"2012/07/30 18:12:10"
}

{
  "title":"Bought New Fridge",
  "body":"Our freezer broke down so ordered this new one on Amazon....",
  "date":"2012/09/17 21:13:39"
}

{
  "title":"Paint Ball",
  "body":"Had so much fun today when my company took the whole team out for...",
  "date":"2012/9/25 15:52:20"
}
```

Then we create our map function which will extract our blog post titles:


```
function(doc) {
    if(doc.title) {
        emit(doc.title, null);

  }
}
```

This function will look at a JSON document and if the document has a `title`
attribute, it will include that title in the result set as a key. The `null`
indicates no value should be provided in the result set. In reality if you look
at all the details, a standard view function syntax is a bit more complex in
Couchbase 2.0.

Here is how the map function appears when you provide full handling of all JSON
document information:


```
function (doc, meta) {
  if (meta.type == "json" && doc.title && doc.date) {
    // Check if doc is JSON
    emit(doc.title, doc.date);
  } else {
    // do something with binary value
  }
}
```

As a best practice we want make sure that the fields we want to emit in our
index actually exist before we emit it to the index. Therefore we have our map
function within a conditional: `if (doc.title && doc.date)`. For instance, if we
wanted to perform a views function that tried to emit `doc.name.length` we would
get a "undefined reference" exception if the field does not exist and the view
function would fail. By checking for the field we avoid these potential types of
errors.

If you have ever looked at a view in Couchbase Admin Console, this map function
will be more familiar. In Couchbase 2.0 we separate metadata about an entry such
as expiration and the entry itself into two parts in a JSON document. So in our
function we have the parameter `meta` for all document meta-data and `doc` as
the parameter for document values, such as the title and blog text. Our function
first looks at the metadata to determine if it is a JSON document by doing a
`if..else`. If the document is JSON, the map function extracts the blog title
and the date/time for the blog entry. For more information about how meta-data
is stored and handled in JSON documents, see [Couchbase Server 2.0 Manual,
Metadata](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-datastore-fields.html).

If the document is binary data, you would need to provide some code to handle
it, but typically if you are going to query an index data, you would do so on
JSON documents. For more information about using views with binary data, see
[Couchbase Server 2.0 Manual, Views on Non-JSON
data](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-nonjson.html).

The `emit()` function takes two arguments: the first one is `key`, and the
second one is `value`. The `emit()` creates an entry, or row, in our result set.
You are able to call the `emit` function multiple times in a map function; this
will create multiple entries in the result set from a single document. We will
discuss that more in depth later.

Once you have your view functions, you store them to Couchbase Server and then
query the view to get the result set. When you query your view, Couchbase Server
takes the code in your view and runs it on *every document persisted on disk*.
You store your map function as a string in a design document as follows:


```
{
  "_id": "_design/blog",
  "language": "javascript",
  "views": {
    "titles": {
      "map": "function(doc, meta){
          if (meta.type == "json" && doc.date && doc.title) {
                // Check if doc is JSON
                emit(doc.date, doc.title);
              } else {
                // do something with binary value
              }
    }
  }
}
```

All design documents are prefixed with the id `_design/` and then your name for
the design document. We store all view functions in the `views` attribute and
name this particular view `titles`. Using a Couchbase SDK, you can read the
design document in as a file from the file system and store the design document
to the server. In this case we name our design document file `blog.json` :


```
client = Couchbase.connect("http://localhost:8091/pools/default/buckets/bucketName")

client.save_design_doc(File.open('blog.json'))
```

This code will create a Couchbase client instance with a connection to the
bucket, `bucketName`. We then read the design document into memory and write it
to Couchbase Server. At this point we can query the view and retrieve our map
function results:


```
posts = client.design_docs['blog']

posts.views                    #=> ["titles"]

posts.titles
```

Couchbase Server will take each document on disk, determine if the document is
JSON and then put the blog title and date into a list. Each row in that list
includes a key and value:


```
KeyValue
"2012/07/30 18:12:10"            "Move Today"
"2012/09/17 21:13:39"            "Bought New Fridge"
"2012/09/25 15:52:20"            "Paint Ball"
```

You may wonder how effective it is to run query your view if Couchbase Server
will run it on every persisted document in the database. But Couchbase Server is
designed to avoid duplicate work. It will run the function on all documents
once, when you first query the view. For subsequent queries on the view
Couchbase Server will recompute the keys and values only for documents that have
changed.

When you query this view, Couchbase Server will send the list of all documents
as JSON. It will contain the key, value and the document id, plus some
additional metadata. For more information about JSON document metadata in
Couchbase, see [Couchbase Server Manual 2.0, Document
Metadata](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-datastore-fields.html)

<a id="building-index"></a>

## Building an Index

To retrieve the information you want, you query a view and receive a result set
from Couchbase Server. There are two possible types of views which influence
when Couchbase Server will actually build an index based on that view:

 * **Development** : when you query a view that is still in development, by default
   Couchbase Server will create an index using a subset of all entries. A view that
   is still under development is known as a *development view* and will always be
   stored with the naming convention `_design/dev_viewname` where `_design` is a
   directory containing all views and the prefix `dev_` indicates it is a
   development view. These views are editable in Couchbase Admin Console

 * **Production** : these views are known as *production views* and are available
   to all processes that have access/credentials to Couchbase Server; they are the
   views you make available to a live production application built on Couchbase
   Server. Couchbase Server will create an index based on entries that are stored
   on disk. The naming convention for production views is `_design/viewname` where
   `_design` is the directory containing all views. Production views are not
   editable in Couchbase Admin Console.

When you are almost done with design and testing of a view, you can query the
development view and have Couchbase Server index based on the *entire* set of
entries. This becomes a matter of best practice that you create an index based
on all entries shortly before you put a view into production. Generating an
index may take several hours over a large database, and you will want a fairly
complete index to already be available as soon as you put the view into
production.

When Couchbase Server creates an index based on a view, it will sort results
based on the keys. The server will put keys in order based on factors such as 1)
alphabetical order, 2) numeric order, and 3) object type or value. For
information about the sort order of indexes, see [Couchbase Server 2.0 Manual,
Ordering](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-ordering.html).

The real-time nature of Couchbase Server means that an index can become outdated
fairly quickly when new entries and updates occur. Couchbase Server generates
the index when it is queried, but in the meantime more data can be added to the
server and this information will not yet be part of the index. To resolve this,
Couchbase SDKs and the REST API provide a `stale` parameter you use when you
query a view. With this parameter you can indicate you will accept the most
current index as it is, you want to trigger a refresh of the index and retrieve
these results, or you want to retrieve the existing index as is but also trigger
a refresh of the index. For instance, to query a view with the stale parameter
using the Ruby SDK:


```
doc.recent_posts(:body => {:stale => :ok})
```

In this case, we query a view named `recent_posts` in a design document named
`doc`. In the query we pass the parameter `:stale` set to the value `:ok` to
indicate that Couchbase Server can return the most current index as it exists.
For more detailed information about the `stale` parameter, consult the Language
Reference for your SDK. For general information and underlying server operations
for the `stale` parameter see [Couchbase Server Manual 2.0, Index Updates and
the Stale
Parameter](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-stale.html).

For more information and details on how and when Couchbase Server generates an
index and updates an index, see [Couchbase Server 2.0 Manual, View
Operation](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-operation.html).

<a id="performing-range-lookup"></a>

## Providing Efficient Lookups

Views enable us to find documents based on any value or structure that resides
in the document. In [Filtering and Extracting
Data](couchbase-devguide-ready.html#filter-extract-data) we demonstrated how you
can find the data and have Couchbase Server generate it in an index; this
section describes how you can use *query parameters* to constrain the result
set. For instance, imagine you know the date of a particular blog post. To find
a single document based on that date, you can provide parameters which specify
which items in a index Couchbase Server should return.

Imagine we want to find all blog posts with comments that were made between
certain dates. In this case we have a map function in our view and we have
generated an index for the view with numerous blog posts indexed. In the Ruby
SDK we demonstrate below how we can query a view and pass in query parameters.
In this case, we go back to the example index of blog post timestamps and titles
that we created with our view. The index is as follows:


```
KeyValue
"2012/07/30 18:12:10"            "Move Today"
"2012/09/17 21:13:39"            "Bought New Fridge"
"2012/09/25 15:52:20"            "Paint Ball"
```


```
doc.recent_posts(:body => {:keys => ["2012/07/30 18:12:10"]})
```

Here we specify the blog post that we want to retrieve from the index by
timestamp. Couchbase Server will return the blog item "Move Today" in response
to this query. You can use query parameters to specify ranges of results you are
looking for:


```
doc.recent_posts(:start_key => "2012/09/10 00:00:00",
                               :end_key => "2012/9/30 23:59:59")
```

In this case we specify the start of our range and end of our range with the
parameters `:start_key` and `:end_key` respectively. The values we provide for
our query parameters indicate we want to find any blog post from the start of
the day on September 9th until the end of the day on September 30th. In this
case, Couchbase Server will return the following result set based on the index
and our query parameters:


```
KeyValue
"2012/09/17 21:13:39"            "Bought New Fridge"
"2012/09/25 15:52:20"            "Paint Ball"
```

There is alternate approach for finding documents which does not require
indexing and querying via views. This approach would be based on storing one or
more keys to a related object in a source document and then performing a
retrieve on those keys. The advantage of this alternate approach is that
response time will be significantly lower. The disadvantage of this approach is
that it could potentially introduce too much contention for the source object if
the object contains data that you expect to update frequently from different
processes. In this later case where you expect numerous changes to a source
document, it is preferable to model the document to be independent of related
objects and use indexing and querying to retrieve the related object.

For more information about different ways to model related objects for future
search and retrieval, see [Modeling Documents for
Retrieval](couchbase-devguide-ready.html#relating-documents-for-retrieval) and
[Using Reference Documents for
Lookups](couchbase-devguide-ready.html#reference-docs-and-lookup-pattern). For
information about performing multiple-retrieves, see [Retrieving Multiple
Keys](couchbase-devguide-ready.html#cb-get-multiple).

<a id="ordering-results"></a>

## Ordering Results

 1. When you query a view, you can provide parameters that indicate the order of
    results; there are also parameters you use to indicate a start and end for a
    result set as we described earlier. When you provide these types of query
    parameters, this is how Couchbase functions:Begin collecting results from the
    top of the index, or at the start position specified.

 1. Provide one row from the index at a time, until the end of the index, or until
    the specified end key.

For instance imagine the simplest case where Couchbase Server generates this
index based on a view:


```
KeyValue
0        "foo"
1        "bar"
2        "baz"
```

We use the Ruby SDK to retrieve all the results in descending order:


```
doc.foo_bar(:descending => :true )
```

We query the view named `foo_bar` and indicate we want the results to be in
descending order by providing the `:descending` parameter set to true. In this
case our result set would appear as follows:


```
KeyValue
2        "baz"
1        "bar"
0        "foo"
```

Imagine we want to provide another query parameter along with the `:descending`,
such as a start key. In this case our query would look like this in Ruby:


```
doc.foo_bar(:descending => :true, :start_key => 1)
```

Here our result set would look like this:


```
KeyValue
1        "bar"
0        "foo"
```

This might not be what you expected: when you indicated the start key, you
probably expected the last two items in the index sorted in descending order.
But when you specify the order `:descending` to be true, Couchbase Server will
read index items from the bottom of the index upwards. Therefore you get the
items in position 1 then 0 from the index. To get the results in position 1 and
2, you would invert the logic of your query and use the `:endkey` parameter set
to 1:


```
doc.foo_bar(:descending => :true, :end_key => 1)
```

In this case Couchbase Server will start reading items at the last position of
2, and then add the item from position 1. Your result set will appear as
follows:


```
KeyValue
2        "baz"
1        "bar"
```

Couchbase Server sorts results in ascending or descending order based on the
value of the key; for instance if you sort in ascending order, keys starting
with 'a' will be in a higher position than those starting with 'c'. For more
information about sorting rules and values in Couchbase Server, see [Couchbase
Server 2.0 Manual,
Ordering](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-ordering.html)

<a id="handling-result-sets"></a>

## Handling Result Sets

When you query a view, Couchbase Server generates an index which can contain
zero or more results. Couchbase SDKs provide helper methods which enable you to
iterate through the items in an index and perform operations on each individual
result. For instance, going back to our blog example we performed a map function
to get all the blog post dates and titles. In this case, we have a result set as
follows:


```
KeyValue
"2012/07/30 18:12:10"        "Move Today"
"2012/09/17 21:13:39"        "Bought New Fridge"
"2012/09/25 15:52:20"        "Paint Ball"
```

The result set returned by Couchbase Server inherits from Ruby `Enumerable`
interface, and can therefore be treated like any other `Enumerable` object:


```
blog.recent_posts.each do |doc|
  # do something
  # with doc object
  doc.key   # gives the key argument of the emit()
  doc.value # gives the value argument of the emit()
end
```

We can access each result in the result set with the `each..do |value|` block;
in this example we output each key and value form the result set. Here is
another example in.Net where the result set is provided as an enumerated value.
This example is part of the sample beer application provided with your Couchbase
install:


```
var view = client.GetView("beer", "by_name");
foreach (var row in view)
{
    Console.WriteLine("Key: {0}, Value: {1}", row.Info["key"], row.Info["value"]);
}
```

In the first line we query a view stored in the design document `beer` called
`by_name`. Then we output each item in the result set, which will give us a list
of beer names for all beer documents. For more information about the sample
application, see the individual Getting Started Guide and Language Reference for
your chosen SDK at [Develop with Couchbase](http://www.couchbase.com/develop).

<a id="using-built-in-reduces"></a>

## Using Built-In Reduces

We discussed earlier how a Couchbase view includes a map function for finding
and extracting into an index. *Reduce* functions are optional functions which
can perform calculations and other operations on items in an index. There are
two types of reduce functions: those that are provided by Couchbase Server,
known as *built-in* reduces, and reduce function you create as custom
JavaScript. The built-in reduce function for Couchbase Server 2.0 include:

 * **\_count** : this function will count the number of emitted items. For instance
   if you perform a query on a view and provide a start key and end key resulting
   in 10 items in a result set, you will get the value 10 as a result of the
   reduce.

 * **\_sum** : will add up all values emitted to an index. For instance, for the
   values 3, 4, and 5 in a result set the result of the reduce function will be 12.

 * **\_stats** : calculates statistics on your emitted values, including sum of
   emitted values, count of emitted items, minimum emitted value, maximum emitted
   value and sum of squares for emitted values.

To understand how a built-in reduce works, imagine an application for beers and
breweries. Each brewery document would appear as follows in JSON:


```
{
"name":"Allguer Brauhaus AG Kempten",
"state":"Bayern",
"code":"",
"country":"Germany",
"phone":"49-(0)831-/-2050-0",
"website":"",
"type":"brewery",
"updated":"2010-07-22 20:00:20",
"description":"",
"address":["Beethovenstrasse 7"],
"geo":{"accuracy":"ROOFTOP","lat":47.7487,"lng":10.5694}
}
```

This specific brewery document contains information for a brewery in Bavaria,
but all other breweries in our application would follow the same document model.
Imagine we want to be able to count the number of breweries in each unique city,
state or country. In this case we need both a map and reduce function; in this
case the map function of our view would look like this:


```
function (doc, meta) {
  if (doc.country, doc.state, doc.city) {
    emit([doc.country, doc.state, doc.city], 1);
  } else if (doc.country, doc.state) {
    emit([doc.country, doc.state], 1);
  } else if (doc.country) {
    emit([doc.country], 1);
  }
}
```

As a best practice we want make sure that the fields we want to include in our
index actually exist. Therefore we have our map function build on index based on
a conditional, and the same conditional ensures the prescence of the items we
want to index. This ensures the fields exist in documents when we query the view
and we therefore avoid a view failure when Couchbase Server generates the index.

If a brewery has all categories of information, namely country, state, and city,
we will create an index with the country, state and city as key with the value
equal to one. If the brewery only has country and state, we create an index with
country and state as key with the value equal to one. Finally if we only have
the country of origin, we create an index with only the country as key and the
value set to one. As a result of the map function, we would have an index that
appears as follows:


```
KeyValue
["Germany", "Bayern"]            1
["Belgium", "Namur"]            1
["Germany", "Bayern"]            1
....
```

For our reduce function we use a built-in reduce function, `_count`. This
function which will sum the values for all unique keys. In this case, the result
set for our view query will be as follows:


```
KeyValue
["Germany", "Bayern"]            2
["Belgium", "Namur"]            1
```

When you create reduce function and store it in a design document, it will
appear in JSON as follows:


```
{
  "_id": "_design/beers",
  "language": "javascript",
  "views": {
    "titles": {
      "map": "function(doc, meta){
        if (meta.type == "json" && doc.date && doc.title) {
        // Check if doc is JSON
        emit(doc.date, doc.title);
         } else {
        // do something with binary value
         }
    }
  }
  "reduce" : "_count"
}
```

For more information about built-in reduce functions, consult the Language
Reference for your chosen SDK at [Develop with
Couchbase](http://www.couchbase.com/develop) and [Couchbase Server 2.0 Manual,
Reduce
Functions](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-reduce.html#couchbase-views-writing-reduce-count).

<a id="using-compound-keys-group-by"></a>

## Using Compound Keys and Group-By Functions

When Couchbase Server generates an index, it can create *compound keys* ; a
compound key is an array that contains multiple values. Couchbase Server will
sort items in an index based on the sequence of keys provided in a compound key.
Couchbase Server will sort items in an index based on the key in position 0, and
then for all items with matching keys for position 0, sort based on the key in
position 1 and so forth. This enables you to control how an index is sorted, and
ultimately how you can retrieve information that is grouped the way you need it.
For example here is an index created by Couchbase Server using compound keys:


```
KeyValue
["a","b","c"]        1
["a","b","e"]        1
["a","c","m"]        1
["b","a","c"]        1
["b","a","g"]        1
```

Each of the keys above is a compound key consisting of three different array
elements. The keys at the beginning of the index all have 'a' in position 0 of
the array; within the first group of items starting with 'a', the items with 'b'
in position 1 are placed before those with 'c' in position 1. By providing
multiple keys we have a first key for sorting, and within the first keys that
match, a secondary key for sorting within that group, and so forth.

To retrieve results from this index, we can use a *group-by* function to extract
the items which meet our criterion. The criterion we use to select an item for a
group-by function is called a *prefix*. When you run a group-by query you run a
reduce query on each range that exists at the *level* you want. Couchbase Server
will return results grouped by the unique prefix at that level. For instance, if
you specify level 1 a unique prefix is `["a"]` ; if you specify level 2, a
unique prefix is `["a","b"]`. Here is an example using the Ruby SDK:


```
doc.myview(:group_level => 1)
```

We query `myview` and provide the parameter `:group_level` set to 1 to indicate
the first position in a compound key. The result set returned by Couchbase
Server will appear as follows:


```
KeyValue
["a"]                3
["b"]                2
```

In this case we perform the built-in reduce function of `_count` which will
count the unique instances of keys at level 1, which corresponds to position 0
of the compound key. Since we have three instances of `["a"]` we have the first
row in the result set have 3 as the value, and since there are two instances of
a `["b"]` as a prefix, we have 2 for the second result. The next example
demonstrates the result set we receive if we query a view with a group level of
2. Our query would be as follows:


```
doc.myview(:group_level => 2)
```

In this case we query the view with the group-by level set to 2, and the unique
prefix will consist of items in position 0 and 1 of the array. We receive this
result set:


```
KeyValue
["a", "b"]            2
["a", "c"]            1
["b", "a"]            2
```

Since there are two instances of the unique prefix `["a","b"]`, we have the
value of 2 for the first result. The second result is the next unique item based
on the unique prefix `["a","c"]`. In this case the item only occurs one time in
our index, therefore we have the value of 1. The last item is the unique prefix
`["b","a"]` which occurs 2 times in the index, therefore we have a value of 2
for that result. To learn more about group-by parameters used in view queries,
see the individual Language Reference for your SDK at [Develop with
Couchbase](http://www.couchbase.com/develop).

A common question from developers is how to extract items based on date or time
using views. For more information and examples, see [Couchbase Views, Date and
Time
Selection](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-sample-patterns-timestamp.html).

<a id="creating-views-from-sdk"></a>

## Using Views from an Application

When you develop a new application using views, you sometimes need to create a
view dynamically from your code. For example you may need this when you install
your application, when you write a test, or when you are building a framework
and want to create views and query data from the framework. This sections
describes you how to do it. Make sure you have installed the [beer
sample](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-sampledata-beer.html)
dataset which comes as an option when you install Couchbase Server. For more
information about the Couchbase Server install, see [Couchbase Server Manual,
Installing](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-getting-started-install.html).

For more information about using views from the Java SDK, see [Tug's
Blog](http://tugdualgrall.blogspot.de/2012).

The first thing we do in our application is to connect to the cluster from our
Couchbase client. As a best practice we typically provide a list of URIs to
different nodes in the cluster in case the initial node we try to connect to is
unavailable. By doing so we can attempt another initial connection to the
cluster at another node:


```
import com.couchbase.client.CouchbaseClient;

    List<uri> uris = new LinkedList<uri>();

    uris.add(URI.create("http://127.0.0.1:8091/pools"));

    CouchbaseClient client = null;

    try {

        client = new CouchbaseClient(uris, "beer-sample", "");


        // put your code here
        client.shutdown();
    } catch (Exception e) {
        System.err.println("Error connecting to Couchbase: " + e.getMessage());
        System.exit(0);
    }


</uri></uri>
```

Here we create a list of URIs to different nodes of the cluster; for the sake of
convenience we are working with a single node cluster. Then we connect to our
bucket, which in this case is `beer-sample`.

**Creating View Functions with an SDK**

Couchbase SDKs provide all the methods you need to save, index, and query views.
Imagine we want to get all the beer names out of our sample database. In this
case, our map function would appear as follows:


```
function (doc, meta) {
  if(doc.type && doc.type == "beer") {
    emit(doc.name, null);
  }
}
```

At first, we import the Java SDK libraries that we need to work with views. Then
we can create a design document based on the `DesignDocument` class and also
create our view as an instance of the `ViewDesign` class:


```
import com.couchbase.client.protocol.views.DesignDocument;
import com.couchbase.client.protocol.views.ViewDesign;

    DesignDocument designDoc = new DesignDocument("dev_beer");

    String viewName = "by_name";
    String mapFunction =
            "function (doc, meta) {\n" +
            "  if(doc.type && doc.type == \"beer\") {\n" +
            "    emit(doc.name);\n" +
            "  }\n" +
            "}";

    ViewDesign viewDesign = new ViewDesign(viewName,mapFunction);
    designDoc.getViews().add(viewDesign);
    client.createDesignDoc( designDoc );
```

In this case we create a design document named 'dev\_beer', name our actual view
'by\_name' and store the map function in a String. We then create a a new view
provide the constructor the name and function. Finally we add this view to our
design document and store it to Couchbase Server with `createDesignDoc`.

**Querying View from SDKs**

At this point you can index and query your view. Be aware that when you first
create a view, whether this in Couchbase Web Console, or via an SDK, the view is
in development mode. You need to put the into production mode in order to query
it:


```
import import com.couchbase.client.protocol.views.*;

System.setProperty("viewmode", "development"); // before the connection to Couchbase

// Create connection if needed

View view = client.getView("beer", "by_name");
Query query = new Query();
query.setIncludeDocs(true).setLimit(20);
query.setStale( Stale.FALSE );
ViewResponse result = client.query(view, query);

for(ViewRow row : result) {
  row.getDocument(); // deal with the document/data
}
```

Before we create a Couchbase client instance and connect to the server, we set a
system property 'viewmode' to 'development' to put the view into production
mode. Then we query our view and limit the number of documents returned to 20
items. Finally when we query our view we set the `stale` parameter to FALSE to
indicate we want to reindex and include any new or updated beers in Couchbase.
For more information about the `stale` parameter and index updates, see [Index
Updates and the Stale
Parameter](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-stale.html).

The last part of this code sample is a loop we use to iterate through each item
in the result set. You can provide any code for handling or outputting
individual results here.

For more information about developing views in general, the follow resources
describe best practices, and how indexing works on the server, along with other
topics:

 * [View Writing Best
   Practice](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-bestpractice.html).

 * [Views and Stored
   Data](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-datastore.html).

 * [Development and Production
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-types.html).

<a id="creating-custom-reduces"></a>

## Creating Custom Reduces

In the majority of cases most developers will use built-in reduce functions
provided by Couchbase Server to perform calculations on index items. Even more
complex operations can be performed using a combination of logic in a map
function combined with built-in reduce functions. The advantage of using
built-in reduces with map functions is that your view functions will tend to be
less complex, and will tend to be less error-prone. There are however some cases
where you will need to build a custom reduce function either alone, or in
conjunction with a built-in reduce. This section demonstrates the use of custom
reduce functions.

For more information about the sample application described in this section, as
well as the custom reduce function used in it, see [Visualizing Reddit Data with
Couchbase 2.0](http://crate.im/posts/visualizing-reddit-data/)

The goal of our application is to show the frequency of Reddit posts that occur
over the course of a day. To do this we aggregate information from Reddit, the
online source for user-nominated and user-voted links. In this sample we already
have information from a Reddit page as JSON documents stored in Couchbase
Server. Here is the output we would like to present as graph:


![](couchbase-devguide-2.0/images/reddit_snippet.png)

In this graph we have a x-axis to represent the 24 hours in a day. Each bar that
appears in the graph represents the number of Reddit posts that occurred in a
one-hour time block during the day, such as the time between 6:00AM to 7:00AM.
To start, we extract information from the page and create JSON documents to
represent each Reddit post. An example document would look like this:


```
{
    ....

    "kind": "link",
    ....

    "title": "I don't buy the bottled Thai Sweet Chili Sauce anymore...",
    "thumbnail": "",
    "permalink": "/r/food/comments/yph1p/i_dont_buy_the_bottled_thai_sweet_chili_sauce/",
    "url": "http://www.ibelieveicanfry.com/2012/08/thai-sweet-chili-sauce.html",
    "created": 1345745189,
    "num_reports": null,
    "saved": false,
    "subreddit": "food",
    "ups": 10,
    "created_utc": 134759064,

    ....
}
```

For the sake of brevity we do not show some of the document attributes which we
do not use in our application. When we extract JSON from Reddit, we add an
attribute `kind` with the value of "link" to indicate this is a Reddit link. The
attributes we want to extract with a map function and output as a compound key
are `[subreddit, day-of-week, date]`.

The logic used to index items in Couchbase Server require that compound keys be
sorted first by the first element, and then by the second element, and so on.
This means that items in an index from the same `subreddit` will be grouped, and
within that group, items are sorted by `day-of-week` and so on. For more
information about compound keys and sorting, see [Using Compound Keys and
Group-By Functions](couchbase-devguide-ready.html#using-compound-keys-group-by).

Creating compound keys sorts the keys so that we can specify what range we want
to retrieve from the index using query parameters. When we query the view for
this data we can use the query parameters `startkey` and `endkey` to get the
items in a particular subreddit post, in all the subreddits between days of the
week, or in all subreddits on a day based on the time of day. The following is
the map function we use to generate a compound key and provide the post time,
date, and score:


```
function (doc, meta) {
  if (meta.type == "json" && doc.kind && doc.created_utc) {
    if(doc.kind == "link") {
      var dt = new Date(doc.created_utc * 1000);
      var hrs = dt.getUTCHours();
      var out = {total: 1, freqs: [], score: []};
      //Get day of week, but start week on Saturday, not Sunday, so that
      //we can pull out the weekend easily.
      var ssday = dt.getUTCDay() + 1;
      if (ssday == 7) ssday = 0;
      out.freqs[hrs] = 1;
      out.score[hrs] = doc.score;
      emit([doc.subreddit, ssday, dt], out);
    }
  }
}
```

As a best practice we want make sure that the fields we want to include in our
index actually exist. Therefore we have our map function within a conditional
which determines the document is JSON and also checks that the fields `doc.kind`
and `doc.created_utc` actually exist. This ensures the fields exist in documents
when we query the view and we therefore avoid a view failure when Couchbase
Server generates the index.

The first thing we do is determine if the document is JSON and whether it is a
Reddit link. Then we create instance variables `dt` to store the date of the
post as a UTC value multiplied by 1000. We then have a variable `hrs` to store
the hour of the post. We will use these two variables for the second and third
elements of our compound key. The variable `out` will be a hash value that we
emit for each compound key. It will contain the total instances of the post that
occur, the frequency of the post, and the score for the post. The final variable
we set up, `ssday` converts the UTC to the day of the week plus one and if it is
the last day of the week, we set it to 0. So following our logic, Saturday would
be set to 0, Sunday will be 1, and Thursday would be 5.

Then we generate the value for our index. We set position `hrs` of the array to
1, for instance, if the post timestamp is the 2:00 in the morning, we have the
array `[null, null, 1]`. Finally we emit the value in our index with the
compound key and the `out` hash as our value.

A sample index entry based on this map function will appear as follows:


```
Key
["food", 5, "2012-09-14T02:44:07.230Z"]

Value
{total:1, freqs: [null, null, 1], score: [null, null, 5]}
```

The map function outputs the hour of the day by storing 1 in `freqs` at the
position representing the hour of day. In the `score` array we output the score
at the position representing the hour of day. In this case we have a post that
occurred at 2:00AM so the score of 5 is at position 2 of the array. To aggregate
the frequency of posts into each 24-hour time periods in a day, we use this
custom reduce function:


```
function (keys, values, rereduce) {
  var out = {};
  out.freqs = [];
  out.score = [];
  for(i = 0; i < 24; i++) {
    out.freqs[i] = 0;
    out.score[i] = 0;
  }
  out.total = 0;
  for(v in values) {
    for(h in values[v].freqs) {
      out.freqs[h] += values[v].freqs[h];
      out.score[h] += values[v].score[h];
    }
    out.total += values[v].total;
  }
  return out;
}
```

The reduce function will aggregate the output of the map and can later be
queried to get a range of keys within the result set. We create arrays to store
our aggregated frequency and aggregated scores, and then create array elements
for the 24 hours in a day. We then sum the frequency and sum the scores in each
array element and store it in the array position for the hour of the day. When
we query the view, the result of the reduce function will appear as follows:


```
{"rows":[{"key":null,
          "value":{"freqs":[20753,19760,15821,15284,14627,13699,11012,8991,
                            7330,6327,6637,7711,10003,12705,15464, 17765,
                            19265,21043,21068,22372,18423,17951,20382,20404],
                   "score":[640304,620266,543505,507882,444247,362853,307157,
                            269177,249111,299142,336299,484781,701107,885255,
                            1006005,1095631,1020605,982352,849484,864482,
                            727186,689255,666884,692730],
                   "total":364797}}]}
```

So for the first hour of the day, which is midnight to 1:00 AM we have 20753
posts on Reddit with the aggregate score of 640304. Both the `freqs` and `score`
attributes have arrays with 24 values. The values in `freqs` are the total
number of Reddits posts that occured in 1 hour time blocks, and the values in
`scores` are the aggregate scores for posts that occured in 1 hour time blocks
over a day. The final item in the reduce is `total`, which is the total number
of Reddit posts that occurred in an entire day. We use the array values in
`freqs` from our custom reduce to generate our frequency graph. Each frequency
can be plotted to the corresponding hour in a day and color-coded:


![](couchbase-devguide-2.0/images/reddit.png)

To create a graph from the JSON result set, we use open source data
visualization code available from [Data-Driven Documents](http://d3js.org). The
graph is created using HTML and JQuery. For more information about the graphing,
or about the sample application, see [Visualizing Reddit
Data](http://crate.im/posts/visualizing-reddit-data/).

<a id="understanding-custom-reduce"></a>

## Understanding Custom Reduces and Re-reduce

If you are going to write your own custom reduces, you should be aware of how
the *rereduce* option works in Couchbase Server. Rereduces are a form of
recursion where Couchbase Server pre-calculates preliminary results and stores
these results in a structure known in computer science as a *b-tree*. First it
applies the reduce function to groups of data in a result set and then stores
these calculated values in the b-tree. The Server will then apply the reduce
function to the calculated values, and will repeat the process on these
resulting values, if needed. Couchbase Server performs the reduce as an initial
reduction and then re-reduces repeatedly to provide better performance, and
faster access to results.

If you have a large initial result set, Couchbase Server may create a b-tree
structure with several levels, where the results from the initial reduce are
stored at one level, and results from the following re-reduces are stored at the
second, third, and forth level, and so on. The number of pre-calculated results
decreases at each level, as Couchbase Server re-applies the reduce function:


![](couchbase-devguide-2.0/images/rereduce1.png)

This example shows the initial result set, and the different levels of results
that exist when we sum numbers as part of our reduce and rereduces. The first
level represents the result set generated by a map function where the key is a
letter and the value is a number. Additional levels represents the results from
two rereduces. In this example, we assume the server applies a reduce and then
applies rereduces to groups of three items. In reality the size of the blocks
are arbitrary and determined by internal logic in Couchbase Server. When
Couchbase Server applies the reduce function to groups of three from the
original result set, it sums each set and stores 4, 6, and 8 as pre-calculated
results. The last items in a result set only consist of two items, so those are
summed and stored as the value 3, The second time Couchbase Server applies the
function as a rereduce, we get 18 which is the sum of the set of three numbers:
4 + 6 + 8. The second value for our rereduce is the remaining number 3, which
has no other values to form a group of three and to be summed with.

Now that you see the logic of rereduces with Couchbase Server, you may wonder if
this matters to you at all. It does matter if you perform want to perform a
calculation based on the original result set. Because you have the option of
performing a reduce and rereduce, when you choose this option you can no longer
assume that you final result will be the same result you would have gotten if
you performed the reduce on the initial data set.

For instance, this may be a consideration if you create a custom reduce which
performs some type of counting. Couchbase Server already provides a built-in
version of a count function which you can use for a reduce, but imagine you have
a scenario where you need to do custom counting for your scenario. In this case,
if you provided a count-type function the rereduce would apply the count to the
pre-calculated values, not the original result set. You would get a count based
on a reduced set, not the true number of values in the initial result. In the
example below, if you use a count-type function to rereduce, you would get 3,
which represent the number of values stored after the initial reduce:


![](couchbase-devguide-2.0/images/rereduceCT.png)

So instead of getting the number of keys, which is 8, you get the number of
values in the reduction, which is only 3. This is not what you might have
expected, had you known about rereduce before you built your custom reduce.
Instead of using a type of counting function for and performing rereduce, you
actually need to sum after the initial reduction. The following code samples
demonstrates the custom reduce function you would use:


```
function (keys, values, rereduce) {
    if(!rereduce) {
        return values.length;
    } else {
        var sum = 0;
        for (i in values) {
            sum += values[i];
        }
        return sum;
    }
}
```

For all custom reduces you will write the reduce function to take `keys`,
`values`, and `rereduce` as parameters. Couchbase Server will execute the custom
reduce and provide the function keys and values from a map function, and will
provide a boolean for `rereduce`. Whether this boolean is true or false is
determined by internal Couchbase Server logic. So we should always provide a
custom reduce function that can handle the case where `rereduce` can be false or
`rereduce` is true. This way we cover our bases and create a custom reduce which
produces results we expect.

For this example if `rereduce` is false, Couchbase Server will not perform the
reduce on a reduction, rather it will perform it on the original result set from
a map function; therefore we can return the length of all values in the result
set. In this case we will get the value 8. If `rereduce` is true, we need to
handle this by performing a sum of the reduction which is the correct number of
items, 8. The logic for this second case is illustrated below:


![](couchbase-devguide-2.0/images/rereduce2.png)

Be aware that this is a very contrived example to demonstrate the rereduce and
how to handle it in your custom reduce. In reality Couchbase Server provides a
built-in function `_count` which automatically handles the rereduce so that you
get a count of all items in a result set, not the count of the reduced set.
Nonetheless you should keep this behavior in mind if you perform a custom reduce
which assumes the calculations are performed on the initial result set. If you
want to find more information about the re-reduce, and other forms of custom
reduces, see
[](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-reduce.html)

<a id="error-handing-for-views"></a>

## Error Handling for Views

When you query a view, Couchbase Server might return errors when it is
generating a result set. For instance, the server may only be able to retrieve
results from two of three server nodes in response to a view query. Couchbase
Server will include any successfully created results as a JSON object; any
errors that the server encountered are a part of the JSON object. Couchbase SDKs
include helper methods you can use to handle any detected errors. For instance
in the Ruby SDK:


```
view = blog.recent_posts(:include_docs => true)
logger = Logger.new(STDOUT)

view.on_error do |from, reason|
  logger.warn("#{view.inspect} received the error '#{reason}' from #{from}")
end

posts = view.each do |doc|
  # do something
  # with doc object
end
```

We start by querying our view and assigning the result set to the variable
`view`. We then use the `on_error` method to intercept any error objects that
are streaming from Couchbase Server in response to the view query. Within the
`on_error` loop we can do something useful with each error object; in this case
we log the content from the error object to standard output.

Note that any error objects in a result set will appear at the end of the
response object. Therefore you may receive several objects in the result set
that are successfully retrieved results. After any retrieved results you will
find error objects.

If you are using the REST API or Couchbase Admin Console to query views, you can
read more about the functional equivalent of the `on_error` method and what
conditions will cause errors here: [Couchbase Server 2.0 Manual, Views, Error
Control](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html).

<a id="developing-clients"></a>
