<a href="#select"></a>    
#Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

##Syntax

    SELECT [ DISTINCT ] result-expr [ , ... ]
        [ FROM data-source ]
        [ WHERE expr ]
        [ GROUP BY expr [ , ... ] [ HAVING expr ] ]
        [ ORDER BY ordering-term [ , ... ] ]
        [ LIMIT non-neg-int [ OFFSET non-neg-int  ] ]
        
    where result-expr can be:
        
        *
        path.*
        expr [ AS identifier ]
    
    where data_source is:
    
        [ :pool-name. ] bucket-name [ .path ] [ [ AS ] identifier ] [ UNNEST identifier IN path ]
        
    where path is:
    
        identifier [ '['non-neg-int']' ] [ .path ]
    
    where ordering-term is:
    
        expr [ ASC | DESC ]
        
        
##Compatibility

Compatible with Couchbase Server 2.2

##Description

The SELECT statement queries a data source. It returns a JSON array containing zero or more result objects. You can see how SELECT behaves as a sequence of steps in a process. Each step in the process produces result objects which are then used as inputs in the next step until all steps in the process are complete. The possible elements and operations in a query include:

* **Data Source** - This is the Couchbase data bucket you query. You provide this as the parameter data-source in a FROM clause. Alternately you can provide a `path` as data source.

* **Filtering** - Results objects from the SELECT can be filtered by adding a WHERE clause.

* **Sorting** - You can order objects in a result set and provide range limits by using ORDER BY, LIMIT, and OFFSET.

* **Result Set** - You generate a set of result objects with GROUP BY or HAVING clauses along with a result expression list, `result-expr-list`.

* **Duplicate Removal** - Remove duplicate result objects from the result set. To do so you use the DISTINCT clause.

* **Ordering** - Items are placed in the order specified by the ORDER BY expression list

* **Skipping** - The first N items are skipped as specified by the OFFSET clause

* **Limiting** - No more than M items are returned as specified by the LIMIT clause


## DISTINCT clause

**DISTINCT** - If you use the `DISTINCT` clause in your query, duplicate result objects are removed from the result set. If you do not use `DISTINCT`, the query will return all objects that meet the query conditions in a result set.


## FROM  clause

**FROM** - This is an optional clause for your query. If you omit this clause, the input for the query is a single empty object. The most common way to use the FROM clause is to provide a `data-source` which is a named data bucket or path. Alternately you can provide the data bucket or path as an alias using the `AS` clause with `FROM.` For example, if you have contact documents as follows:

        {"type":"contact",
         "name":"earl",
         "children":[
                {"name":"xena","age":17,"gender":"f"},
                {"name":"yuri","age":2,"gender":"m"}
         ],
         "hobbies":["surfing"]
        }
        
    You can perform a query with `FROM` and `AS` to get the name of the first child listed in each document in the contacts bucket:
    
        SELECT children[0].name AS kid
        	FROM contacts
        	
Returns a result as follows:
    
        "resultset": [
           {
             "kid": "xena"
           },
           ....
           ]
           


Another way to use the `FROM` clause is to specify a path within a bucket as `data-source`. The path refers to an array in the your documents. With this option, the server evaluates the path for each document in the data bucket and the value at that path becomes an input for the query. For example, you have a data bucket named `contacts` which has documents that describes each contact in a system. Each document has an array called `address`. To get all addresses as input for a query, you use this clause:

        FROM contacts.address

This retrieves all address fields from all contacts in the data bucket. If the address field does not exist for a contact, that contact will not be part of the query input.    

### JOIN clause

**JOIN** - This optional clause follows the `FROM`clause and allows you to create new input objects by combining two or more source objects. The `KEYS` clause is required after each JOIN. It specifies the primary keys for the second bucket in the join.

Joins can be chained. By default, an INNER join is performed. This means that for each joined object produced, both the left and right hand source objects must be non-missing and non-null.

If LEFT or LEFT OUTER is specified, then a left outer join is performed. At least one joined object is produced for each left hand source object. If the right hand source object is NULL or MISSING, then the joined object's right-hand side value is also NULL or MISSING (omitted), respectively.


For example, if our customer objects were:

```
    {
        "name": ...,
        "primary_contact": ...,
        "address": [ ... ]
    }
```

And our invoice objects were:

    {
        "customer_key": ...,
        "invoice_date": ...,
        "invoice_item_keys": [ ... ],
        "total": ...
    }

And the FROM clause was:

    FROM invoice inv JOIN customer cust KEYS inv.customer_key

Then each joined object would be:

    {
        "inv" : {
            "customer_key": ...,
            "invoice_date": ...,
            "invoice_item_keys": [ ... ],
            "total": ...
        },
        "cust" : {
            "name": ...,
            "primary_contact": ...,
            "address": [ ... ]
        }
    }

If our invoice_item_ objects were:

    {
        "invoice_key": ...,
        "product_key": ...,
        "unit_price": ...,
        "quantity": ...,
        "item_subtotal": ...
    }

And the FROM clause was:

    FROM invoice JOIN invoice_item item KEYS invoice.invoice_item_keys

Then our joined objects would be:

    {
        "invoice" : {
            "customer_key": ...,
            "invoice_date": ...,
            "invoice_item_keys": [ ... ],
            "total": ...
        },
        "item" : {
            "invoice_key": ...,
            "product_key": ...,
            "unit_price": ...,
            "quantity": ...,
            "item_subtotal": ...
        }
    },
    {
        "invoice" : {
            "customer_key": ...,
            "invoice_date": ...,
            "invoice_item_keys": [ ... ],
            "total": ...
        },
        "item" : {
            "invoice_key": ...,
            "product_key": ...,
            "unit_price": ...,
            "quantity": ...,
            "item_subtotal": ...
        }
    },
    ...



### KEYS clause

**KEYS** - This optional clause follows a `FROM` clause. The `KEYS` clause is based on primary keys within a bucket. Only values having those primary keys are included as inputs to the query. KEYS is mandatory for the primary bucket.

To specify a single key:

    SELECT * FROM customer KEYS "acme-uuid-1234-5678"

To specify multiple keys:

    SELECT * FROM customer KEYS [ "acme-uuid-1234-5678", "roadster-uuid-4321-8765" ]


### NEST clause

**NEST** - Nesting performs a join across two buckets. But instead of producing a cross-product of the left and right hand inputs, a single result is produced for each left hand input, while the corresponding right hand inputs are collected into an array and nested as a single array-valued field in the result object.

Nests can be chained with other nests, joins, and unnests.

By default, an INNER nest is performed. This means that for each result object produced, both the left and right hand source objects must be non-missing and non-null. The right hand result of NEST is always an array or MISSING. If there is no matching right hand source object, then the right hand source object is as follows:

* If the KEYS expression evaluates to MISSING, the right hand value is also MISSING.
* If the KEYS expression evaluates to NULL, the right hand value is MISSING.
* If the KEYS expression evaluates to an array, the right hand value is an empty array.
* If the KEYS expression evaluates to a non-array value, the right hand value is an empty array.
* If LEFT or LEFT OUTER is specified, then a left outer nest is performed. One result object is produced for each left hand source object.

Recall our invoice objects:

    {
        "customer_key": ...,
        "invoice_date": ...,
        "invoice_item_keys": [ ... ],
        "total": ...
    }

And our invoice_item_ objects:

    {
        "invoice_key": ...,
        "product_key": ...,
        "unit_price": ...,
        "quantity": ...,
        "item_subtotal": ...
    }

If the FROM clause was:

    FROM invoice inv NEST invoice_item items KEYS inv.invoice_item_keys

The results would be:

    {
        "invoice" : {
            "customer_key": ...,
            "invoice_date": ...,
            "invoice_item_keys": [ ... ],
            "total": ...
        },
        "items" : [
            {
                "invoice_key": ...,
                "product_key": ...,
                "unit_price": ...,
                "quantity": ...,
                "item_subtotal": ...
            },
            {
                "invoice_key": ...,
                "product_key": ...,
                "unit_price": ...,
                "quantity": ...,
                "item_subtotal": ...
            }
        ]
    },
    {
        "invoice" : {
            "customer_key": ...,
            "invoice_date": ...,
            "invoice_item_keys": [ ... ],
            "total": ...
        },
        "items" : [
            {
                "invoice_key": ...,
                "product_key": ...,
                "unit_price": ...,
                "quantity": ...,
                "item_subtotal": ...
            },
            {
                "invoice_key": ...,
                "product_key": ...,
                "unit_price": ...,
                "quantity": ...,
                "item_subtotal": ...
            }
        ]
    },
    ...



### UNNEST clause

* **UNNEST** - This clause can optionally follow a `FROM` clause. This clause iterates over attributes within a specified document array. The array elements by this clause becomes input for further query operations. For example, imagine you have a document as follows and you want to get all published reviewers for the beer:

        { "id": "7983345",
        "name": "Takayama Pale Ale",
        "brewer": "Hida Takayama Brewing Corp.",
        "reviews" : [
            { "reviewerName" : "Takeshi Kitano", "publication" : "Outdoor Japan Magazine", "date": "3/2013" },
            { "reviewerName" : "Moto Ohtake", "publication" : "Japan Beer Times", "date" : "7/2013" }
            ]
        }
    
    In this case you would provide a statement containing `UNNEST` as follows:

        SELECT review.reviewerName, review.publication
        FROM beers AS b UNNEST review IN b.reviews
    
    The `UNNEST` clause iterates over the 'reviews' array and collects 'reviewerName' and 'publication' from each element in the array. This collection of objects can be used as input for other query operations.

## WHERE clause    
**WHERE** - Any expression in the clause is evaluated for objects in a result set. If it evaluates as TRUE for an object, the object is the object is included in the remainder of the query. For example:

        select * FROM players WHERE score > 100

## GROUP BY clause

**GROUP BY** - Collects items from multiple result objects and groups the elements by one or more expressions. This is an aggregate query. For example, if you have json documents for books and films and all films have a field "type": "movie" while books have a field "type": "book" you can perform this query:

        select title, type, COUNT(*) AS count FROM catalog GROUP BY type
        
    Any books in the result set will grouped together and returned in an object while all films will be grouped and returned in another object.

### HAVING clause
**HAVING** - This clause can optionally follow a `GROUP BY` clause. It can filter result objects from the `GROUP BY` clause with a given expression.

## ORDER BY clause
**ORDER BY** - The order of items in the result set is determined by expression in this clause. Objects are sorted first by the left-most expression in the list of expressions. Any items with the same sort value will be sorted with the next expression in the list. This process repeats until all items are sorted and all expressions in the list are evaluated. 

The `ORDER BY` clause can evaluate any JSON value. This means it can compare values of different types. For instance 'four' and 4 order by type. The following describes order by type from highest to lowest precedence:
    
* missing value, known as MISSING
* null value, known as NULL
* false
* true
* number
* string
* arrays - where each element in the array is compared with the corresponding element in another array. A longer array sort after a shorter array.
* object - where key-values from one object are compared to key-values from another object. Keys are evaluated in sorted order for strings. Larger objects sort after smaller objects.

## LIMIT clause    
**LIMIT** - Imposes a specific number of objects returned in a result set by `SELECT`. This clause must have a non-negative integer as upper bound.

### OFFSET clause
**OFFSET** - This clause can optionally follow a `LIMIT` clause. If you specify an offset, this many number of objects are omitted from the result set before enforcing a specified `LIMIT`. This clause must be a non-negative integer.


##Examples

Given customer order that appear as follows:

        {
            "type": "customer-order",
            "grand_total": 1000,
            "billToAddress": {
                "street": "123 foo",
                "state": "CA",
                "geo": {
                    "lat": 1234, "lon": 2344
                }
            },
            "shipToAddress": {
                "street": "123 foo",
                "state": "CA"
            },
            items: [
                { "productId": "coffee", "qty": 1 },
                { "productId": "tea", "qty": 1 }
            ]
        }

### FROM example
`FROM` returns  values from the `orders` data bucket. The following query returns a list of all billing states from the orders data bucket.

```
SELECT * FROM orders.billToAddress.state
```

```    
"results": [
        {
            "state": "CA"
        }
    ]
```

### AS example
`AS` returns values retrieved by the select statement using an alias provided. The following query returns all states from ship to addresses in an array where each array element uses the alias, `state_abv`:

```
SELECT shipToAddress.state AS state_abv FROM orders
```
 
```            
{ "state_abv": { .... } }
```


The following query gets states from orders and then sum the grand_totals from the orders and label these amounts `grandTotalByState` in the result set.

```
SELECT
	shipToAddress.state AS state,
	SUM(grand_total) AS grandTotalByState
	FROM orders
	GROUP BY shipToAddress.state
```
    
### WHERE example
`WHERE` returns results based on a condition or expression provided in the `WHERE` clauses. For example, with the customer orders documents we can perform this query:

```
SELECT * FROM orders WHERE grand_total > 2000
```
          
    This query will return a result set of all customer orders where the `grand_total` is greater than 2000.

### ORDER BY example
`ORDER BY` returns a result set which is sorted by a given field. For example, to get all names in a contact database and order then by age, the query scans all orders and return all items in a result set ordered by the grand_total by ascending order, from lowest to highest.

```
SELECT shipToAddress.state FROM orders ORDER BY grand_total.
```
        
### LIMIT EXAMPLE

`LIMIT` can be used as a standalone clause to limit the number of results, or can be used with other clauses such as order by to limit the number of sorted results that appear. The following query returns two names from the contacts database.

```
SELECT name FROM contacts LIMIT 2
```    

```    
{
          "name": "dave"
 },
 {
          "name": "earl"
 }
```
        
If you use this statement in conjunction with an `ORDER BY` the objects are first sorted in ascending order and then limited by the given number. The following query returns the names of the three youngest contacts, sorted by age.
    
```
SELECT name FROM contacts ORDER BY age LIMIT 3
```
    
    
```    
{
          "name": "fred"
},
 {
          "name": "harry"
 },
 {
          "name": "jane"
}
```

### GROUP BY example
    
- `GROUP BY` returns a result set where all orders that meet the conditions are grouped by a particular expression. The following query gets all states from ship-to addresses in customer orders where the grand total is greater than 2000. The result set is grouped by state.

```        
SELECT
             shipToAddress.state AS state
          FROM orders
          WHERE grand_total > 2000
          GROUP BY shipToAddress.state
```

### HAVING example
    
`HAVING` can be used after a `GROUP BY` clause to filter items in a group by a given condition. The following example builds upon the `GROUP BY` example used previously. This query returns a list of states where the grand total of orders, grouped by state is greater than or equal to 1000.

```
SELECT
             shipToAddress.state AS state,
             SUM(grand_total) AS grandTotalByState
          FROM orders
          WHERE grand_total > 2
          GROUP BY shipToAddress.state
          HAVING grandTotalByState >= 1000
```

```    
[
            {"state": "CA",
                "grandTotalByState": 10000000},
            {"state": "DE",
                "grandTotalByState": 5000},
            ....
 ]
```
 
### UNNEST example       
`UNNEST` can be used after the `FROM` clause to iterate through all items in a document array and provide these elements input into other query clauses. 

The following query goes through each child in a children array in contacts, that is, scans all 'children' arrays in contacts, finds the document where the child's name is 'aiden' and returns the contacts in a result set. The actual contact is named dave and the one child in the array of children that matches is 17 and male.


```
SELECT * FROM contacts AS contact UNNEST contact.children AS child WHERE child.name = 'aiden'
```

```    
{
   "children": [
     {
       "age": 17,
       "gender": "m",
       "name": "aiden"
     },
     {
       "age": 2,
        "gender": "f",
        "name": "amy"
     }
    ],
    "hobbies": [
      "golf",
      "surfing"
    ],
     "name": "dave",
     "type": "contact"
}
```
            


###See Also
- [Expressions](#expressions)
- [Functions](#functions)
- [Operators](#operators)

