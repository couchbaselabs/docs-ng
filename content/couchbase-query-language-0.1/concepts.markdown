<a href="#concepts"></a>
#Concepts

Document-oriented databases, such as Couchbase Server, use documents to store information as well 
as the relationships between application objects. This model is flexible enough so that you can change application objects without having to migrate the database schema or plan for significant application downtime. Even the same type of object in your application can have a different data structures. For instance, you can initially represent a user name as a single document field. You can later structure a user document so that the first name and last name are separate fields in the document. You can make these changes without any application downtime, and without having to update all user documents in the system. 

The other advantage to the flexible, document-based data model is that it is well suited to representing real-world items. Documents support nested structures, as well as fields representing relationships between items. Both of these attributes enable you to realistically represent objects in your application. 

Couchbase Server is also a distributed system. You store your data as documents in *data buckets*, which are the functional equivalents of databases. Each data bucket can contain more than one type of document, such as documents for products and documents for orders. You operate Couchbase Server as a single instance or multiple instances grouped as a cluster. Items in a data bucket are spread out among multiple servers so that the data is highly available. This also means when you query the database, the query will be distributed to the different server instances in the cluster and results are aggregated before they are returned..

To find information in a document-oriented database you need a language that provides the correct logic and algorithms for navigating documents and document structures. This section describes the key concepts to understand about querying a distributed, document-oriented database.


##Data Modeling

Couchbase Server is a document database: you store information in documents rather store it in table rows. Couchbase has a much more flexible data format; documents generally contain all the information about a data entity, including compound data. In the case of traditional, relational databases, you may need to spread data from a single object across multiple tables, in a process known as *normalization*. Imagine we have an application for beers and breweries around the world. We could store beers in tables, or we can choose the equivalent document-based model with an individual document per beer:

![document model compared to table](images/rel_vs_doc_model.png "Document-model compared to table")

In traditional relational databases, you would use a table to represent a real-world object and its respective attributes. For instance, in contacts database, you would have a table with contacts, such as id, first name, last name and so on. As we see in the illustration, the relational model conforms to a rigid schema with a specified number of fields which represent a specific purpose in an application and a fixed datatype for each column.

Instead of a table, we can represent our object as one or more documents. A document in a document-oriented database is a JSON object consisting of a number of fields that you define. An object can be one or more documents instead of one or more table rows; attributes of each object can be fields in the document. In comparison, a relational database has columns in a table which hold a type of attribute, such as name or zip code.  There is no schema in document-oriented databases; every JSON document can have its own individual set of keys, although you may probably adopt one or more informal schemas for your data. Unlike the relational mode, attributes within a document do not have to have a predefined type. For instance a zip code can be an integer or a string using the document model.  Even documents belonging to the same class of application objects, such as a customer document can have different attributes than other customer documents. For example you can have some customers having an extra field for shipping insurance, while other customer documents do not have that field at all.

##Nested Structures and Paths

In traditional relational databases, each record is represented by a table row and attributes for a record are represented by each column in a table. In a document-database, a record is represented by one or more documents. Attributes for a business object are represented by fields in the document. For example, imagine a simple document representing a customer:

    {
        "id": "7983345",
        "name": "Liam Kilpatrick",
        "type": "retail"
        ....
    }

A document field can contain nested data structures such as arrays and hashes; within an array or hash, you can further nest data. For example, consider a more complex document representing a customer order:

    {
      "type": "customer-order",
      "grand_total": 1000,
      "billTo": {
         "street": "123 foo",
         "state": "CA",
      },
      "shipTo": {
         "street": "123 foo",
         "state": "CA"
      },
      items: [
        { "productId": "coffee", "qty": 1 },
        { "productId": "tea", "qty": 1 }
      ]
    }

This makes N1QL a unique querying language compared to SQL. In order to navigate nested data in document arrays and hashes, N1QL supports the concept of *paths*. A path uses a *dot notation* syntax and provides the logical location of an attribute within a document. For example to get the street from a customer order, we use this path:

    orders.shipTo.street

This path refers to the value for 'street' in the 'billTo' hash. You use a path with a arrays or nested objects in order to get to attributes within the data structure. You can also use array syntax in your path to get to information:

    orders.items[0].productId
    
This path will evaluate to the value 'coffee' as this is the 'productID' for the first array element under 'items'. 

Paths enable you to find and data in document structures without having to get the entire document or handle it within your application. Any document data can be requested and only the relevant information in the document will be returned to your application; this reduces the bandwidth used in for querying. N1QL also provides a query functionality known as *OVER*. This enables you to flatten array elements within a document. When a document contains a nested array, you can have each member of the array joined. These joined objects become input to other query operations.


##Queries and Result Sets

*Queries* consist of a single command and zero or more optional *clauses*, which can filter, run operations, or perform functions on data. The query command along with any clauses are known as a *query string*. When you perform a query, Couchbase Server takes the query string and produces a *result set*, which is a JSON array containing any result values.

As of N1QL X.X, we assume that you perform a query on a single data bucket in Couchbase Server. Therefore when you use N1QL 1.0 for queries, it will find information in a single bucket. You can have one or more buckets for a single server instance and more than one bucket for an entire Couchbase cluster.  This implies that there are no JOIN operations found in other query languages; queries are not yet supported as joins across multiple data buckets.

Besides a command, each query can have multiple optional parts, including clauses, expressions and functions. *Expressions* are parts of a query which will compare values against one another or perform arithmetic calculations, and *clauses* are typically used for the limiting the scope of a query.

When you perform a query, a sequence of steps gets executed. Each step corresponds to the different clauses and expressions in a query. The expressions evaluated first will produce an intermediate *result set*, which is also known as *output objects*. The output objects from a step will become the input for the next step and produce the next result set. After all expressions have been evaluated in a query you have a *final result set*. 

##Types of Operations

There are different types of expressions in N1QL for extracting, grouping and ordering data. The following describe the major categories of operations and the order in which they are handled:

* **Filter Expressions** - If you provide a filtering expression, the server applies this to every item in a data bucket and only keeps the items where the result is true.
* **Aggregate Expressions** - This expression groups all items in a result set by evaluating the aggregate expression. The result set contains these groups.
* **Having Expressions** - The server applies this expression to all items in a result set and only keeps an item in the result set if the expression evaluates to true.
* **Order Expressions** -  A query orders the item in the result set by evaluating this expression.
* **Skip Value** - The server discards this number of items in the result set starting at the first item at index 0.
