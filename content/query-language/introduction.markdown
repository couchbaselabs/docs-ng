#Introduction

Couchbase Query Language, known as N1QL or 'Nickel', enables you to find and manipulate data in Couchbase Server. 
We designed the language to be human readable and writable as well as to provide an extensible language for 
ad-hoc querying. The query language is a standard semantic you can use to build client libraries in native programming languages. 

N1QL is similar to the standard SQL language for relational databases, but is also includes some additional 
features which are suited for NoSQL databases and document-oriented data in particular. This guide provides you 
key concepts about the language, tutorials describing how to use it, advanced operations 
you can perform with the language, as well as a language reference for a complete description of syntax and language elements.

##Goals of Language

N1QL is designed to be a concise, intuitive, expressive language you can use to build complex queries.
 It is designed for document-oriented databases which store application objects as well as their relationships in 
documents instead of tables. Application data as well as document relationships can be expressed as atomic values or in 
nested structures within the document, such as hashes or arrays. To find information in a document-oriented database you need a language that provides the correct logic and algorithms for navigating documents and document structures. N1QL provides a clear, easy-to-understand abstraction layer you can use to query and retrieve information in your document-database.

##Who Uses It

Application developers and client library developers can use N1QL to perform ad-hoc querying. Any application developer 
who wants to provide reports or find data that is hard to find can use N1QL in their application logic. Client library 
developers who want to provide query functionality in their library can use N1QL as the standard to build their new APIs.

##Ways to Use It

The major use cases for N1QL are:

- Embed complex query requests in your application logic. Individual queries can include powerful logic such as AND or NOT which would require multiple request using other query engines.
- Light analytics and reporting. You can perform ad-hoc queries for your application. For example if you want a list of all users in your application who have purchased a specific item, you can can N1QL. 

##Where to Start Learning

Depending on how you like to learn new languages, you can start with information at one of the links below:

- Concepts - for those of you who like to understand the theories and ideas behind the language.
- Tutorial - developers who want to start with a reference application with N1QL.
- Blogs - articles, tutorials and demonstrations of N1QL.
- Presentations - features, ability, background information, and examples of the language.




 
