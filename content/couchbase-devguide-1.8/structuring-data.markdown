# Structuring Data

This section describes core elements you will use to handle data in Couchbase
Server; it will describe the ways you can structure individual documents for
your application, how to store the documents from a Couchbase SDK, and describe
different approaches you may take when you structure data in documents.

<a id="documented-oriented-data-model"></a>

## Comparing Document-Oriented and Relational Data

In a relational database system you must define a schema before adding records
to a database. The schema is the structure described in a formal languages
supported by the database and provides a blueprint for the tables in a database
and the relationships between tables of data. Within a table, you need to define
constraints in terms of rows and named columns as well as the type of data that
can be stored in each column.

In contrast, a document-oriented database contains documents, which are records
that describe the data in the document, as well as contain the actual data.
Documents can be as complex as you choose; you can use nested data to provide
additional sub-categories of information about your object. You can also use one
or more document to represent a real-world object. The following compares a
conventional table with document-based objects:


![](images/relational_vs_doc1.png)

In this example we have a table that represents beers and their respective
attributes: id, beer name, brewer, bottles available and so forth. As seen in
this illustration, the relational model confirms to a schema with a specified
number of fields which represent a specific purpose and data type. The
equivalent document-based model has an individual document per beer with the
same types of information for a specific beer in each document.

In a document-oriented model, data objects are stored as documents; each
document stores your data and enables you to update the data or delete it.
Instead of columns with names and data types, we describe the data in the
document, and provide the value for that description. If we wanted to add
attributes to a beer in a relational mode, we would need to modify the database
schema to include the additional columns and their data types. In the case of
document-based data, we would add additional key-value pairs into our documents
to represent the new fields.

The other characteristic of relational database is data normalization; this
means you decompose data into smaller, related tables. The figure below
illustrates this:


![](images/normalizing_data.png)

In the relational model, data is shared across multiple tables. The advantage to
this model is that there is less duplicated data in the database. If we did not
separate beers and brewers into different tables and had one beer table instead,
we would have repeated information about breweries for each beer produced by
that brewer. The problem with this approach is that when you change information
across tables, you need to lock those tables simultaneously to ensure
information changes across the table consistently. Because you also spread
information across a rigid structure, it makes it more difficult to change the
structure during production, and it is also difficult to distribute the data
across multiple servers.

In the document-oriented database, we could choose to have two different
document structures: one for beers, and one for breweries. Instead of splitting
your application objects into tables and rows, you would turn them into
documents. By providing a reference in the beer document to a brewery document,
you create a relationship between the two entities:


![](images/relating_docs.png)

In this example we have two different beers from the Amtel brewery. We represent
each beer as a separate document and reference the brewery in the 'brewer'
field. The document-oriented approach provides several upsides compared to the
traditional RDBMS model. First, because information is stored in documents,
updating a schema is a matter of updating the documents for that type of object.
This can be done with no system downtime. Secondly, we can distribute the
information across multiple servers with greater ease. Since records are
contained within entire documents, it makes it easier to move, or replicate an
entire object to another server.

<a id="Using-json-docs"></a>

## Using JSON Documents

JavaScript Object Notation (JSON) is a lightweight data-interchange format which
is easy to read and change. JSON is language independent although it uses
similar constructs to JavaScript. JSON documents enable you to benefit from all
the upcoming Couchbase features, such as indexing and querying; they also to
provide logical structure for more complex data and enable you to provide
logical connections between different records.

The following are basic data types supported in JSON:

 * Numbers, including integer and floating point,

 * String, including all Unicode characters and backslash escape characters,

 * Boolean: true or false,

 * Array, enclosed in square brackets: \["one", "two", "three"\]

 * Object, consisting of key-value pairs, and also known as an associative array or
   hash. The key must be a string and the value can be any supported JSON data
   type.

For more information about creating valid JSON documents, please refer to
[JSON](http://www.json.org/).

When you use JSON documents to represent your application data, you should think
about the document as a logical container for information. This involves
thinking about how data from your application fits into natural groups. It also
requires thinking about the information you want to manage in your application.
Doing data modeling for Couchbase Server is a similar process that you would do
for traditional relational databases; there is however much more flexibility and
you can change your mind later on your data structures. As a best practice,
during your data/document design phase, you want to evaluate:

 * What are the 'things' you want to manage in your applications, for instance,
   users, breweries, beers, and so forth.

 * What do you want to store about the 'things.' For example, this could be alcohol
   percentage, aroma, location, etc.

 * How to the 'things' in your application fit into natural groups.

For instance, if you are creating a beer application, you might want particular
document structure to represent a beer:


```
{
    "name":
    "description":
    "category":
    "updated":
}
```

For each of the keys in this JSON document you would provide unique values to
represent individual beers. If you want to provide more detailed information in
your beer application about the actual breweries, you could create a JSON
structure to represent a brewery:


```
{
    "name":
    "address":
    "city":
    "state":
    "website":
    "description":
}
```

Performing data modeling for a document-based application is no different than
the work you would need to do for a relational database. For the most part, it
can be much more flexible, it can provide a more realistic representation or
your application data, and it also enables you to change your mind later about
data structure. For more complex items in your application, one option is to use
nested pairs to represent the information:


```
{
    "name":
    "address":
    "city":
    "state":
    "website":
    "description":
    "geo":
    {
    "location": ["-105.07", "40.59"],
    "accuracy": "RANGE_INTERPOLATED"
    }
    "beers": [ _id4058, _id7628]
}
```

In this case we added a nested attribute for the geo-location of the brewery and
for beers. Within the location, we provide an exact longitude and latitude, as
well as level of accuracy for plotting it on a map. The level of nesting you
provide is your decision; as long as a document is under the maximum storage
size for Couchbase Server, you can provide any level of nesting that you can
handle in your application.

In traditional relational database modeling, you would create tables that
contain a subset of information for an item. For instance a brewery may contain
types of beers which are stored in a separate table and referenced by the beer
id. In the case of JSON documents, you use key-values pairs, or even a nested
key-value pairs.

<a id="working-with-out-schemas"></a>

## Schema-less Data Modeling

When you work with Couchbase Server, using documents to represent data means
that database schema is optional; the majority of your effort will be creating
one or more documents that will represent application data. This document
structure can evolve over time as your application grows and adds new features.

In Couchbase Server you do not need to perform data modeling and establish
relationships between tables the way you would in a traditional relational
database. Technically every document you store with structure in Couchbase
Server has its own implicit schema; the schema is represented in how you
organize and nest information in your documents. While you can choose any
structure for your documents, the JSON model in particular will help you
organize your information in a standard way, and enable you to take advantage of
Couchbase Server 2.0. As a developer you benefit in several ways from this
approach:

 * Extend the schema at runtime, or anytime. You can add new fields for a type of
   item anytime. Changes to your schema can be tracked by a version number, or by
   other fields as needed.

 * Document-based data models may better represent the information you want to
   store and the data structures you need in your application.

 * You design your application information in documents, rather than model your
   data for a database.

 * Converting application information into JSON is very simple, there are many
   options, and there are many libraries widely available for JSON conversion.

 * Minimization of one-to-many relationships through use of nested entities
   therefore, reduction of joins.

When you use JSON documents with Couchbase, you also create an application that
can benefit from all the new features of Couchbase 2.0, particularly querying,
indexing and views.

There are several considerations to have in mind when you design your JSON
document:

 * Whether you want to use a 'type' field at the highest level of your JSON
   document in order to group and filter object types.

 * What particular keys, ids, prefixes or conventions you want to use for items,
   for instance 'beer\_My\_Brew.'

 * When you want a document to expire, if at all, and what expiration would be
   best.

 * If want to use a document to access other documents. In other words you can
   store keys that refer other documents in a JSON document and get the keys
   through this document. In the NoSQL database jargon, this is often known as
   'using composite keys.'

If go to our example of having a beer application which stores information about
beers and breweries, this is a sample JSON document to represent a beer. Notice
in this case we have a 'type' field with the value 'beer.' This may be useful
for grouping together a set of records if we later want to add a 'type' of value
'ale' or 'cider':


```
{
    "beer_id": "beer_Hoptimus_Prime",
    "type” : “beer”,
    "abv": 10.0,
    "category": "North American Ale",
    "name": "Hoptimus Prime",
    "style": “Double India Pale Ale”
}
```

Here is another type of document in our application which we use to represent
breweries. As in the case of beers, we have a 'type' field we can use now or
later to group and categorize our beer producers:


```
{
    "brewery_id": ”brewery_Legacy_Brewing_Co",
    "type” : “brewery",
    "name" : "Legacy Brewing Co.",
    "address": "525 Canal Street
                Reading, Pennsylvania, 19601
                United States",
    "updated": "2010-07-22 20:00:20"
}
```

What happens if we want to change the fields we store for a brewery? In this
case we just add the fields to brewery documents. In this case we decide later
that we want to include GPS location of the brewery:


```
{
    "brewery_id": ”brewery_Legacy_Brewing_Co”,
    "type” : “brewery”,
    "name" : "Legacy Brewing Co.",
    "address": "525 Canal Street
                Reading, Pennsylvania, 19601
                United States",
    "updated": "2010-07-22 20:00:20",
    "latitude": -75.928469,
    "longitude": 40.325725
}
```

So in the case of document-based data, we extend the record by just adding the
two new files of 'latitude' and 'longitude.' When we add other breweries after
this one, we would include these two new fields. For older breweries we can
update them with the field or provide programming logic to show a default for
older breweries. The best approach for adding new fields to a document is to
perform a CAS operation on the document to change it; Couchbase Server will send
you a message that the data has already changed if someone has already changed
the record.

To create relationships between items, we again use fields. In this example we
create a logical connection between beers and breweries using the 'brewery
field' in our beer document which related to the 'id' field in the brewery JSON.
This is analogous to the idea of using a foreign key in traditional relational
database design.

This first documents represents a beer, Hoptimus Prime:


```
{
    "beer_id": "beer_Hoptimus_Prime",
    "type” : “beer”,
    "abv": 10.0,
    "brewery": ”brewery_Legacy_Brewing_Co",
    "category": "North American Ale",
    "name": "Hoptimus Prime",
    "style": “Double India Pale Ale”
}
```

This second document represents the brewery that brews Hoptimus Prime:


```
{
    "brewery_id": ”brewery_Legacy_Brewing_Co”,
    "type” : “brewery”,
    "name" : "Legacy Brewing Co.",
    "address": "525 Canal Street
                         Reading, Pennsylvania, 19601
                         United States",
    "updated": "2010-07-22 20:00:20",
    "latitude": -75.928469,
    "longitude": 40.325725
}
```

In our beer document, the 'brewery' field points to
'brewery\_Legacy\_Brewery\_Co' which is the key for the document that represents
the brewery. By using this model of referencing relating documents within a
document, we create relationships between application objects.

<a id="document-design-options"></a>

## Document Design Considerations

When you work on document design, there are a few other considerations you
should have in mind. This will help you determine whether you use one or more
documents to represent something in your application. Consider:

 * Whether you will represent the items as separate objects,

 * Whether you want to access the objects together at runtime,

 * If you want some data to be atomic; that is, changes occur at once to this data,
   or the change fails and will not made.

The following provides some guidelines on when you would prefer using one or
more than one documents to represent your data.

When you use one document to contain all related data you typically get these
benefits:

 * Your application data is de-normalized,

 * Read/Write related information in one operation,

 * Eliminate need for client-side joins.

 * If you put all information for a transaction in a single document, you can
   better guarantee atomicity.

When you provide a single document to represents an entire entity and any
related records, the document is known as an 'aggregate.' You can also choose to
use separate documents for different object types in your application. This
approach is known as 'denormalization' in NoSQL database terms. In this case you
provide cross references between objects as we demonstrated earlier in the
beer-brewery documents. You typically gain the following from separate documents

 * Reduce data duplication,

 * May provide better application performance and scale by keeping document size
   smaller,

 * Application objects do not need to be in same document; separate documents may
   better reflect the objects as they are in the real world.

The following examples demonstrate the use of a single document versus separate
documents for a simple blog. In the application a user can create an entry with
title and content. Other users can add comments to the post. In the first case,
we have a single JSON document to represent a blog post, plus all the comments
for the post:


```
{
    "post_id": "dborkar_Hello_World",
    "author": "dborkar",
    "type": "post"
      "title": "Hello World",
      "format": "markdown",
      "body": "Hello from [Couchbase](http://couchbase.com).",
      "html": "<p>Hello from <a href=\"http:  …
              "comments":[
              ["format": "markdown", "body":"Awesome post!"],
              ["format”: "markdown", "body":"Like it." ]
           ]
}
```

The next sample JSON document shows the same blog post, however we have split
the post into the actual entry and a separate comment document. First is the
core blog post document as JSON. Notice we have a reference to two comments with
the key 'comments' and two values in an array:


```
{
  "post_id": "dborkar_Hello_World",
  "author": "dborkar",
  "type": "post",
  "title": "Hello World",
  "format": "markdown",
  "body": "Hello from [Couchbase](http://couchbase.com).",
  "html": “<p>Hello from <a href="http:  …">
  "comments" : ["comment1_jchris_Hello_world", "comment2_kzeller_Hello_World"]
}
```

The next document contains the first comment that is associated with the post.
It has the key of 'comment1\_jchris\_Hello\_world' and it has a reference back
to the blog post it belongs to under "comment\_id":


```
{
  "comment_id": "comment1_dborkar_Hello_World",
  "format": "markdown",
  "body": "Awesome post!"
}
```

The next example demonstrates our beer and breweries example as single and
separate documents. If we wanted to use a single-document approach to represent
a beer, it could look like this in JSON:


```
{
    "beer_id": 10.0,
    "name": "Hoptimus Prime",
    "category": "North American Ale",
    "style": "Imperial or Double India Pale Ale",
    "brewery": "Legacy Brewing Co." : {
            "address1" : "Easy Peasy St.",
            "address2" : "Suite 4",
            "city" : "Baltimore",
            "state" : "Maryland",
            "zip" : "21215",
            "capacity" : 10000,
                     },
    "updated": [2010, 7, 22, 20, 0, 20],
    "available": true
}
```

In this case we provide information about the brewery as a subset of the beer.
But consider the case where we have more than one beer from the brewery, in this
case:


```
{
    "beer_id": 12.0,
    "name": "Pleny the Hipster",
    "category": "Wheat Beer",
    "style": "Koelsch",
    "brewery": "Legacy Brewing Co." : {
            "address1" : "Easy Peasy St.",
            "address2" : "Suite 4",
            "city" : "Baltimore",
            "state" : "Maryland",
            "zip" : "21215",
            "capacity" : 10000,
                     },
    "updated": [2011, 8, 2, 20, 0, 20],
    "available": true
}
```

In this case we are starting to develop duplicate information because we have
the same brewery information in each beer document. Here it makes sense to
separate the brewery and beers as different documents and relate them through
fields. The revised, separate beer document. Notice we have added a new field to
represent the brewery and provide the brewer id:


```
{
    "beer_id": 10.0,
    "name": "Hoptimus Prime",
    "category": "North American Ale",
    "style": "Imperial or Double India Pale Ale",
    "brewery" : "leg_brew_10"
    "updated": [2010, 7, 22, 20, 0, 20],
    "available": true
}
```

And here is the associated brewery as a separate brewery document. In this case,
we may simplify the document structure since it is separate, and provide all the
brewery information at the same level:


```
{
    "brewery_id" : "leg_brew_10",
    "name": "Legacy Brewing Co.",
    "address1" : "Easy Peasy St.",
    "address2" : "Suite 4",
    "city" : "Baltimore",
    "state" : "Maryland",
    "zip" : "21215",
    "capacity" : 10000,
}
```

<a id="reference-docs-and-lookup-pattern"></a>

## Using Reference Documents for Lookups

When you store an object, you can use supporting documents which enable you to
later lookup the object with different keys. For instance, if you store a user
as a document, you can create additional helper documents so that you can find
the user by email, Facebook ID, TwitterID, username, and other identifiers
besides the original document key.

To use this approach, you should store your original document and use a
predictable pattern as the key for that type of object. Following the user
example imagine we store all users in documents structured as follows:


```
{
"uid"
"type"
"name"
"email"
"fbid"
}
```

To keep track of how many users are in our system, we create a counter,
`user::counter` and increment it each time we add a new user. The key for each
user document will be in the standard form of `user::uuid`. The records that we
will have in our system would be structured as follows:


![](images/user_lookup1.png)

In this case we start with an initial user count of `100`. In the Ruby example
that follows we increment the counter and then set a new user record with a new
unique user id:


```
# => setup default connection
c = Couchbase.new

# => initialize counter to 100
c.set("user::count", 100)

# => increment counter
c.incr("user::count")

# => get unique uuid, new_id = 12f1
new_id = UUID.timestamp_create().to_s

user_name = "John Smith"
user_username = "johnsmith"
user_email = "jsm@do.com"
user_fb = "12393"

# save User to Couchbase
user_doc = c.add("user::#{new_id}", {
    :uid => new_id,
    :type => "user",
    :name => user_name,
    :email => user_email,
    :fbid => user_fb
    })
```

Here we create a default connection to the server in a new Couchbase client
instance. We then create a new record `user::counter` with the initial value of
100. We will increment this counter each time we add a new user. We then
generated a unique user ID with a standard Ruby UUID gem. The next part of our
code creates local variables which represent our user properties, such as `John
Smith` a the user name. In the past part of this code we take the user data and
perform an `add` to store it to Couchbase. Now our document set is as follows:


![](images/user_lookup2.png)

Then we store additional supporting documents which will enable us to find the
user with other keys. For each different type of lookup we create a separate
record. For instance to enable lookup by email, we create a email record with
the fixed prefix `email::` for a key:


```
# using same variables from above for the user's data

# add reference document for username
c.add("username::#{user_username.downcase}", new_id)    # => save lookup document, with document key = "username::johnsmith" => 101

# add reference document for email
c.add("email::#{user_email.downcase}", new_id)        # => save lookup document, with document key = "email::jsmith@domain.com" => 101

# add reference document for Facebook ID
c.add("fb::#{user_fb}", new_id)                # => save lookup document, with document key = "fb::12393" => 101
```

The additional 'lookup' documents enable us to store alternate keys for the user
and relate those keys to the unique key for the user record `user::101.` The
first document we set is for a lookup by username, so we do an `add` using the
key `username::`. After we create all of our lookup records, the documents in
our system that relate to our user appear as follows:


![](images/user_lookup3.png)

Once these supporting documents are stored, we can attempt a lookup using input
from a form. This can be any type of web form content, such as an entry in a
login, an item from a customer service call, or from an email support system.
First we retrieve the web form parameter:


```
#retrieve input from a web form
user_username = params["username"]

# retrieve by user_id value using username provided in web form
user_id = c.get("username::#{user_username.downcase}")    # => get the user_id   # => 12f1
user_hash = c.get("user::#{user_id}")            # => get the primary User document (key = user::12f1)

puts user_hash
# => { "uid" => 101, "type" => "user", "name" => "John Smith", "email" => "jsmith@domain.com", "fbid" => "12393" }

#get additional web form parameter, email
user_email = params["email"]

# retrieve by email
user_id = c.get("email::#{user_email.downcase}")    # => get the user_id  # => 12f1
user_hash = c.get("user::#{user_id}")            # => get the primary User document (key = user::12f1)

#get facebook ID
user_fb = auth.uid

# retrieve by Facebook ID
user_id = c.get("fb::#{user_fb}")            # => get the user_id  # => 12f1
user_hash = c.get("user::#{user_id}")            # => get the primary User document (key = user::12f1)
```

The first part of our code stores the `username` from a web form to variable we
can later use. We pass the lowercase version of the form input to a `get` to
find the unique user id 12f1. With that unique user id, we perform a `get` with
the key consisting of `user::12f1` to get the entire user record. So the
supporting documents enable you to store a reference to a primary document under
a different key. By using a standard key pattern, such as prefix of `email::`
you can get to the primary user document with an email. By using this pattern
you can lookup an object based on many different properties. The following
illustrates the sequence of operations you can perform, and the documents used
when you do an email-based lookup:


![](images/user_lookup4.png)

The other use case for this pattern is to create categories for object. For
instance, if you have a beer, keyed with the id `beer::#{sku}`, you can create a
product category and reference products belonging to that category with they key
`category::ales::count`. For this category key, you would provide a unique count
and the category name, such as ales. Then you would add products to the content
the reference the SKU for your beers. For instance, the key value pair, could
look like this:


```
{
  :product : "#{sku}"
}
```

When you perform a lookup, you could also do a `multi-get` on all items that are
keyed `category::ales`. This way you can retrieve all primary records for ales.
For more information about multi-get, see [Retrieving Multiple
Keys](#cb-get-multiple)

<a id="example-storage-documents"></a>

## Sample Storage Documents

The following are some sample JSON documents which demonstrate some different
types of application data which can be stored as JSON in Couchbase Server.

Here is an example of a message document:


```
{
    "from": "user_512",
    "to": "user_768",
    "text": "Hey, that Beer you recommended is pretty fab, thx!"
    "sent_timestamp": 1326476560
}
```

The next example is a user profile document. Notice in this case, we have two
versions of a user profile; in order to extend the number of attributes for a
user, you would just add additional string-values to represent the new fields:


```
{
    "user_id": 512,
    "name": "Bob Likington",
    "email": "bob.like@gmail.com",
    "sign_up_timestamp": 1224612317,
    "last_login_timestamp": 1245613101
}

{
    "user_id": 768,
    "name": "Simon Neal",
    "email": "sneal@gmail.com",
    "sign_up_timestamp": 1225554317,
    "last_login_timestamp": 1234166701,
    "country": "Scotland",
    "pro_account" true,
    "friends": [512, 666, 742, 1111]
}
```

In this case we add county, account type, and friends as additional fields to
our user profile. To extend our application with new user attributes, we simply
start storing additional fields at the document level. Unlike traditional
relational databases, there is no need for us to have server downtime, or
database migration to a new schema.

To add new data fields, we simply start writing the additional JSON values for
that particular transaction. You would also update your application to provide a
default value for documents that do not yet have these fields.

This last example provides a sample JSON document to store information about a
photo:


```
{
    "photo_id": "ccbcdeadbeefacee",
    "size": {
        "w": 500,
        "h": 320,
        "unit": "px"
        },
    "exposure: "1/1082",
    "aperture": "f/2.4",
    "flash": false,
    "camera": {
            "name": "iPhone 4S",
            "manufacturer": "Apple",
            }
    "user_id": 512,
    "timestamp": [2011, 12, 13, 16, 31, 07]
}
```

As we did in the brewery document earlier in this chapter, we nest a set of
attributes for the photo size and camera by using JSON syntax.

<a id="developing-applications"></a>
