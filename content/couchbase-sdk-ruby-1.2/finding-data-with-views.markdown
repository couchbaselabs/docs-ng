# Finding Data with Views

### Note

The following document is still in production, and is not considered complete or
exhaustive.

In Couchbase 2.0 you can index and query JSON documents using *views*. Views are
functions written in JavaScript that can serve several purposes in your
application. You can use them to:

 * Find all the documents in your database that you need for a particular process,

 * Create a copy of data in a document and present it in a specific order,

 * Create an index to efficiently find documents by a particular value or by a
   particular structure in the document,

 * Represent relationships between documents, and

 * Perform calculations on data contained in documents.

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

The `View` Object is obtained by calling the appropriate view on the design
document associated with the view on the server.


```
client = Couchbase.connect
view = client.design_docs['docName'].viewName(params)
```

or


```
client = Couchbase.connect
view = Couchbase::View.new(client, "_design/docName/_view/viewName", params)
```

Where:

 * `docName`

   is the Design document name.

 * `viewName`

 * `params` are the parameters that can be passed such as `:descending`,
   `:include_docs` and so on.

The entire list of `params` are at
[http://wiki.apache.org/couchdb/HTTP\_view\_API\#Querying\_Options](http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options)

Some of the more frequently used parameters are listed below.

 * `startKey`

   to set the starting Key.

 * `endKey`

   to set the ending Key.

 * `descending`

   to set the descending to true or false.

 * `include_docs`

   to Include the original JSON document with the results.

 * `reduce`

   where the reduce function is included or excluded based on the Value.

 * `stale`

   where the possible values for stale are `false`, `update_after` and `ok` as
   noted in the Release Notes.

Process each row of the result using the following structure:


```
view.each do |post|
  # do something
  puts post.doc['date']
end
```

 * `id`

   to get the Id of the associated row.

 * `key`

   to get the Key of the associated Key/Value pair of the emit result.

 * `value`

   to get the Value of the associated Key/Value pair of the result.

 * `doc`

   to get the document associated with the row as long as the property
   :include\_docs is set to true.

For uses these classes, please refer to the `Squish` Tutorial we have expanded
since Couchbase 1.8 to include views.

<a id="couchbase-sdk-ruby-troubleshooting"></a>
