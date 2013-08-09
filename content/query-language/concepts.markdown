#Concepts

Document-oriented databases such as Couchbase Server use documents to represent applications objects as well 
as the relationships between objects. This model is flexible enough so that you can change application objects without having to migrate the database schema, or plan for significant application downtime. Even the same type of object in your application can have a different data structures. For instance, you can initially represent a user name as a single document field. You can later structure a user document so that the first name and last name are separate fields in the JSON document without any downtime, and without having to update all user documents in the system. 

The other advantage to the flexible, document-based data model is that it is well suited to representing real-world items and how you want to represent them. Documents support nested structures, as well as field representing relationships between items which enable you to realistically represent objects in your application. 

Couchbase Server is also a distributed system. You store your data as documents in *data buckets* which are the functional equivalents of databases. Each data bucket can contain more than one type of document, such as documents for products as well as documents for orders. You operate Couchbase Server as a single instance or multiple instances grouped as a cluster. Items in a data bucket are spread out among multiple server instances to provide high availability of data. This also means when you query the database, the query will be distributed to the different server instances in the cluster and results are aggregated.

To find information in a document-oriented database you need a language that provides the correct logic and algorithms for navigating documents and document structures. This section describes the key concepts you should understand about querying a distributed, document-oriented database.


##Documents and Data Structures

Couchbase Server is a document database; unlike traditional relational databases, you store information in documents rather than table rows. Couchbase has a much more flexible data format; documents generally contains all the information about a data entity, including compound data rather than the data being normalized across tables. Imagine we have an application for beers and breweries around the world. Instead of storing beers in tables, the equivalent document-based model would have an individual document per beer:

![document model compared to table](images/rel_vs_doc_model.png "Document-model compared to table")

In traditional relational databases, you would use a table to represent a real-world object and its respective attributes. For instance, in a beer application, you would have a table with beer attributes, such as id, beer name, brewer, inventory and so on. As we see in the illustration, the relational model conforms to a rigid schema with a specified number of fields which represent a specific purpose in an application as well as fixed datatype.

A document is a JSON object consisting of the number of fields that you define. There is no schema in Couchbase; every JSON document can have its own individual set of keys, although you may probably adopt one or more informal schemas for your data.


##Attributes and Paths

In traditional relational database attributes are in table rows and each record is represented by a table row. Attributes in the document-oriented data model are actually fields in a JSON document. As simple document representing a customer:

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

This makes N1QL a unique querying language compared to SQL. In order to navigate nested data in documents, N1QL supports the concepts of *paths*. A path uses a *dot notation* syntax and provides the logical location of an attribute within a document:

    orders.shipTo.street

This path refers to the value for 'street' in the 'billTo' object. You use a path with a arrays or nested objects in order to get to attributes within the data structure. You can also use array syntax in your path:

    orders.items[0].productId
    
Will result in the item 'coffee' as this is the 'productID' for the first array element under 'items'. 

Paths enable you to find and extract data out of document structures without having to get the entire document or handle it with application log. Any document data can be requested and only the relevant information in the document will be returned to your application; this reduces bandwidth required by your request.


##Queries and Result Sets

*Queries* consist of a single command and zero or more optional *clauses*, which can provide additional filtering, operations, or functions on data. The query command together with any clauses are known as a *query string*. When you perform a query, Couchbase Server takes the query string and produces a *result set*, which is a JSON array containing any result values.

As of N1QL 1.0, we assume that you perform a query on a single data bucket in Couchbase Server. You can have one or more buckets for a single server instance and more than one bucket for an entire Couchbase cluster. Therefore when you use N1QL 1.0 for queries, it will find information in a single bucket. This also implies that there are no JOIN operations; queries are not yet supported as joins across multiple data buckets.

Besides a command, each query can have multiple optional parts, including clauses, expressions and functions. *Expressions* are parts of a query which will compare values against one another or perform arithmetic calculations, and *clauses* are typically used for the limiting the scope of a query. Couchbase Server evaluates these clauses in the following order:

* Filter Expressions. If you provide a filtering expression, the server applies this to every item in a data bucket and only keeps the items where the result is true.
* Aggregate Expressions. This expression groups all items in a result set by evaluating the aggregate expression. The result set contains these groups.
* Having Expressions. The server applies this expression to all items in a result set and only keeps an item in the result set if the expression evaluates to true.
* Order Expressions.  A query orders the item in the result set by evaluating this expression.
* Skip Value. The server discards this number of items in the result set starting at the first item at index 0.

When you perform a query, you can see it as a sequence of steps where each step corresponds to the different clauses and expression in a query. The expressions evaluated first will produce an intermediate *result set* also known as *output objects*. The output objects from a step will become the input for the next step and produce the next result set. After all expressions have been evaluated in a query you have a *final result set*. 

##N1QL and SQL

##Types of Operations

##Expression Evaluation

##N1QL in a Distributed System

##Other Language Bindings
