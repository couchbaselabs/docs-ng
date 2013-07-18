#Concepts

Document-oriented databases such as Couchbase Server use documents to represent applications objects as well 
as the relationships between objects. 

This document model is flexible enough so that you can change application objects without having to migrate the database schema, or plan for significant application downtime. Even the same type of object in your application can have a different data structures. For instance, you can initially represent a user name as a single document field. You can later structure a user document so that the first name and last name are separate fields in the JSON document without any downtime, and without having to update all user documents in the system.

The other advantage to the flexible, document-based data model is that it is well suited to representing real-world items and how you want to represent them. Documents support nested structures, as well as field representing relationships between items which enable you to realistically represent objects in your application.

##Documents and Data Structures

##Attributes and Relations

##Queries and Result Sets

##Expressions and Nested Expressions

##NiQL and SQL

##Types of Operations

##Expression Evaluation

##N1QL in a Distributed System

##Other Language Bindings
