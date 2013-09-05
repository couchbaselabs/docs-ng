#Introduction

Couchbase Query Language, known as N1QL or 'Nickel', helps you to find and change data in Couchbase Server. 
We designed the language to be human -readable and -writable; it is an extensible language designed for 
ad-hoc querying. The query language is a standard semantic you use to build querying ability in other programming languages. 

N1QL is similar to the standard SQL language for relational databases, but it is also includes some additional 
features which are suited for document-oriented databases. This guide describes 
key concepts about the language, provides tutorials describing how to use the language, discusses advanced operations 
you can perform with the language, and includes a language reference for a complete description of syntax and language elements.

##Goals of Language

N1QL is designed to be a concise, intuitive, expressive language for building complex queries.
 It is designed for document-oriented databases which store application objects as well as their relationships in 
documents instead of tables. Application data can be expressed as atomic values or in 
nested structures within the document, such as hashes or arrays. Relationships between documents can be expressed as values or values in nested structures.  To find information in a document-oriented database, you need the correct logic and algorithms for navigating documents and document structures. N1QL provides a clear, easy-to-understand abstraction layer to query and retrieve information in your document-database.

##Who Uses It

Application developers and client library developers use N1QL to perform ad-hoc querying. Any application developer 
who wants to provide reports or retrieve data that is hard to find can use N1QL in their application logic. Client library 
developers who want to provide query functionality in their library can use N1QL as the standard to build their new APIs.

##Ways to Use It

The major use cases for N1QL are the following:

- Embed complex query requests in your application logic. Individual queries can include powerful logic such as AND or NOT. With other approaches to querying, you might have to perform multiple requests to achieve the same results.
- Perform light analytics and reporting. You can execute ad-hoc queries from your application. For example if you want a list of all users in your application who have purchased a specific item, you can use N1QL. 

##Where to Start Learning

There are different approaches for learning new language. Depending on your learning style, you can start with information at one of the links below:

- [Concepts](#concepts) - for those of you who like to understand the theories and ideas behind the language.
- Tutorial - developers who want to start with a reference application with N1QL.
- Blogs - articles, tutorials, and demonstrations of N1QL.
- Presentations - features, abilities, background information, and examples of the language.

For the full language and syntax see the [N1QL language reference](#language_ref).




 
