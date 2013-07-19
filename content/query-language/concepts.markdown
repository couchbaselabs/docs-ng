#Concepts

Document-oriented databases such as Couchbase Server use documents to represent applications objects as well 
as the relationships between objects. This model is flexible enough so that you can change application objects without having to migrate the database schema, or plan for significant application downtime. Even the same type of object in your application can have a different data structures. For instance, you can initially represent a user name as a single document field. You can later structure a user document so that the first name and last name are separate fields in the JSON document without any downtime, and without having to update all user documents in the system. The other advantage to the flexible, document-based data model is that it is well suited to representing real-world items and how you want to represent them. Documents support nested structures, as well as field representing relationships between items which enable you to realistically represent objects in your application. 

Couchbase Server is also a distributed system. You store your data as documents in *data buckets* which are the functional equivalents of databases. Each data bucket can contain more than one type of document, such as documents for products as well as documents for orders. You operate Couchbase Server as a single instance or multiple instances grouped as a cluster. Items in a data bucket are spread out among multiple server instances to provide high availability of data. This also means when you query the database, the query will be distributed to the different server instances in the cluster and results are aggregated.

To find information in a document-oriented database you need a language that provides the correct logic and algorithms for navigating documents and document structures. This section describes the key concepts you should understand about querying a distributed, document-oriented database.


##Documents and Data Structures

Couchbase Server is a document database; unlike traditional relational databases, you store information in documents rather than table rows. Couchbase has a much more flexible data format; documents generally contains all the information about a data entity, including compound data rather than the data being normalized across tables.

A document is a JSON object consisting of a number of key-value pairs that you define. There is no schema in Couchbase; every JSON document can have its own individual set of keys, although you may probably adopt one or more informal schemas for your data.

##Attributes and Relations




##Queries and Result Sets

*Queries* consist of a single command and zero or more optional *clauses*, which can provide additional filtering, operations, or functions on data. The query command together with any clauses are known as a *query string*. When you perform a query, Couchbase Server takes the query string and produces a *result set*, which is a JSON array containing any result values.

As of N1QL 1.0, we assume that you perform a query on a single data bucket in Couchbase Server. You can have one or more buckets for a single server instance and more than one bucket for an entire Couchbase cluster. Therefore when you use N1QL 1.0 for queries, it will find information in a single bucket. This also implies that there are no JOIN operations; queries are not yet supported as joins across multiple data buckets.

Besides a command, each query can have multiple optional parts, including clauses, expressions and functions. *Expressions* are parts of a query which will compare values against one another or perform arithmetic calculations, and *clauses* are typically use for the limiting scope of query. Couchbase Server evaluates these clauses in the following order:

* Filter Expressions. If you provide a filtering expression, the server applies this to every item in the data bucket and only keeps the items where the result is true.
* Aggregate Expressions. This expression groups all items in a result set by evaluating the aggregate expression. The result set contains these groups.
* Having Expressions. The server applies this expression to all items in a result set and only keeps an item in the result set if the expression evaluates to true.
* Order Expressions.  A query orders the item in the result set by evaluating this expression.
* Skip Value. The server discards this number of items in the result set starting at the first item at index 0.



##N1QL and SQL

##Types of Operations

##Expression Evaluation

##N1QL in a Distributed System

##Other Language Bindings
