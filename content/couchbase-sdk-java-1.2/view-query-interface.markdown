# View/Query Interface

Couchbase Server 2.0 extends the querying mechanisms by not only allowding
key-based lookups, but also allowing you to query your datasets through a
flexible mechanism called views. Those views are based on a common data
aggregation approach called map/reduce. With Couchbase Server 2.0 you are able
to keep using all of the Couchbase code you already have, and upgrade certain
parts of it to use JSON documents without any hassles. In doing this, you can
easily add the power of Views and querying those views to your applications.

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

The `View` Object is obtained by calling the `getView` method which provides
access to the view on the server.

<a id="table-couchbase-sdk_java_getview"></a>

**API Call**        | `client.getView(ddocname, viewname)`                 
--------------------|------------------------------------------------------
**Asynchronous**    | no                                                   
**Description**     | Create a view object to be used when querying a view.
**Returns**         | (none)                                               
**Arguments**       |                                                      
**String ddocname** | Design document name                                 
**String viewname** | View name within a design document                   


```
View view = client.getView(docName, viewName)
```

Then obtain a new `Query` object.

<a id="table-couchbase-sdk_java_query-new"></a>

**API Call**     | `Query.new()`                                         
-----------------|-------------------------------------------------------
**Asynchronous** | no                                                    
**Description**  | Create a query object to be used when querying a view.
**Returns**      | (none)                                                
**Arguments**    |                                                       
                 | None                                                  


```
Query query = new Query();
```

Once, the View and Query objects are available, the results of the server view
can be accessed as below.

<a id="table-couchbase-sdk_java_query"></a>

**API Call**     | `client.query(view, query)`              
-----------------|------------------------------------------
**Asynchronous** | no                                       
**Description**  | Query a view within a design doc         
**Returns**      | (none)                                   
**Arguments**    |                                          
**View view**    | View object associated with a server view
**Query query**  | View object associated with a server view


```
ViewResponse = client.query(view, query);
```

Before accessing the View, a list of options can be set with the query object
(here is a short list of the most commonly used ones).

 * `setKey(java.lang.String key)`

   to set the starting Key.

 * `setRangeStart(java.lang.String startKey)`

   to set the starting Key.

 * `setRangeEnd(java.lang.String endKey)`

   to set the ending Key.

 * `setRange(java.lang.String startKey, java.lang.String endKey)`

   to set the starting and ending key, both.

 * `setDescending(boolean descending)`

   to set the descending flat to true or false.

 * `setIncludeDocs(boolean include)`

   to Include the original JSON document with the query.

 * `setReduce(boolean reduce)`

   where the reduce function is included or excluded based on the Flag.

 * `setStale(Stale stale)`

   where the possible values for stale are `FALSE`, `UPDATE_AFTER` and `OK` as
   noted in the Release Notes.

The format of the returned information of the query method is:

`ViewResponse` or any of the other inherited objects such as
`ViewResponseWithDocs`, `ViewResponseNoDocs`, `ViewResponseReduced`.

The `ViewResponse` method provides a `iterator()` method for iterating through
the rows as a `ViewRow` interface. The `ViewResponse` method also provides a
`getMap()` method where the result is available as a map.

The following methods are available on the `ViewRow` interface.

 * `getId()`

   to get the Id of the associated row.

 * `getKey()`

   to get the Key of the associated Key/Value pair of the result.

 * `getValue()`

   to get the Value of the associated Key/Value pair of the result.

 * `getDocument()`

   to get the document associated with the row.

For usage of these classes, please refer to the
[Tutorial](couchbase-sdk-java-ready.html#tutorial) which has been enhanced to
include Views.

<a id="api-reference-troubleshooting"></a>
