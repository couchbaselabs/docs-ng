<a href="#language_ref"></a>
#Language Reference

This reference section describes the syntax and general semantics of N1QL. This includes all available commands, functions, expressions, conditionals and operators for the language.

We use the following typographical conventions to mark different parts of the command syntax:

- Square brackets [] indicate optional parts
- Separator | indicates you choose one alternative
- Dots ... mean that you can repeat the preceding element in a query

<a href="#explain"></a>
##Explain

You can use this keyword before any N1QL statement and get information about how the statement operates.

###Syntax

    EXPLAIN statement
    
###Compatibility

Compatible with Couchbase Server 2.2

###Example

Perform any N1QL statement preceding by they keyword `EXPLAIN` to get JSON output describing how the query would execute. For example:

    EXPLAIN select name, age from contacts limit 2
    
Will return the following output:

    {
    "resultset": [
        {
            "root": {
                "type": "limit",
                "input": {
                    "type": "projector",
                    "input": {
                        "type": "fetch",
                        "input": {
                            "type": "scan",
                            "scanner": "_design//_view/_all_docs",
                            "bucket": "contacts"
                        },
                        "bucket": "contacts",
                        "projection": {
                            "type": "function",
                            "name": "VALUE",
                            "operands": []
                        },
                        "as": "contacts"
                    },
                    "result": [
                        {
                            "star": true,
                            "expr": {
                                "type": "property",
                                "path": "default"
                            },
                            "as": ""
                        }
                    ]
                },
                "value": 2
            }
        }
    ],
    "info": [
        {
            "caller": "http:161",
            "code": 100,
            "key": "total_rows",
            "message": "1"
        },
        {
            "caller": "http:163",
            "code": 101,
            "key": "total_elapsed_time",
            "message": "38.192789ms"
        }
    ]
    }

<a href="#select"></a>    
##Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

###Syntax

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
    
        [ :pool-name. ] bucket-name [ .path ] [ [ AS ] identifier ] [ OVER identifier IN path ]
        
    where path is:
    
        identifier [ '['non-neg-int']' ] [ .path ]
    
    where ordering-term is:
    
        expr [ ASC | DESC ]
        
        
###Compatibility

Compatible with Couchbase Server 2.2

###Description

The SELECT statement queries a data source. It returns a JSON array containing zero or more result objects. You can see how SELECT behaves as a sequence of steps in a process. Each step in the process produces result objects which are then used as inputs in the next step until all steps in the process are complete. The possible elements and operations in a query include:

* **Data Source** - This is the Couchbase data bucket you query. You provide this as the parameter data-source in a FROM clause. Alternately you can provide a `path` as data source.

* **Filtering** - Results objects from the SELECT can be filtered by adding a WHERE clause.

* **Sorting** - You can order objects in a result set and provide range limits by using ORDER BY, LIMIT, and OFFSET.

* **Result Set** - You generate a set of result objects with GROUP BY or HAVING clauses along with a result expression list, `result-expr-list`.

* **Duplicate Removal** - Remove duplicate result objects from the result set. To do so you use a DISTINCT query.

* **Ordering** - Items are placed in the order specified by the ORDER BY expression list

* **Skipping** - The first N items are skipped as specified by the OFFSET clause

* **Limiting** - No more than M items are returned as specified by the LIMIT clause

###Options

The following describes optional clauses you can use in your select statement:

* **DISTINCT** - If you use the `DISTINCT` in your query, any duplicate result objects will be removed from the result set. If you do not use `DISTINCT`, the query will return all objects that meet the query conditions in a result set.

* **FROM** - This is an optional clause for your query. If you omit this clause, the input for the query is a single empty object. The most common way to use the FROM clause is to provide a `data-source` which is a named data bucket or path. Alternately you can provide the data bucket or path as an alias using the `AS` clause with `FROM.` For example, if you have contact documents as follows:

        {"type":"contact",
         "name":"earl",
         "children":[
                {"name":"xena","age":17,"gender":"f"},
                {"name":"yuri","age":2,"gender":"m"}
         ],
         "hobbies":["surfing"]
        }
        
You can perform query with `FROM` and `AS` to get any children from the first contact retrieved:

        SELECT children[0].name AS kid
        	FROM contacts
        	
This will return a result as follows:
    
    "resultset": [
       {
         "kid": "bill"
       },
       ....
       ]

    Another way to use the `FROM` clause is to specify a path within a bucket as `data-source`. The path refers to an array in the your documents. With this option, the server evaluates the path for each document in the data bucket and the value at that path becomes an input for the query. For example, you have a data bucket named `contacts` which has documents that describes each contact in a system. Each document has an array called `address`. To get all addresses as input for a query, you use this clause:

        FROM contacts.address

    This will get all address fields from all contacts in the data bucket. If the address field does not exist for a contact, that contact will not be part of the query input.    

* **OVER** - This clause can optionally follow a `FROM` clause. This will iterate over attributes within a specified document array. The array elements by this clause will then become input for further query operations. For example, imagine you have a document as follows and you want to get all published reviewers for the beer:

        { "id": "7983345",
        "name": "Takayama Pale Ale",
        "brewer": "Hida Takayama Brewing Corp.",
        "reviews" : [
            { "reviewerName" : "Takeshi Kitano", "publication" : "Outdoor Japan Magazine", "date": "3/2013" },
            { "reviewerName" : "Moto Ohtake", "publication" : "Japan Beer Times", "date" : "7/2013" }
            ]
        }
    
    In this case you would provide a statement containing `OVER` as follows:

        SELECT review.reviewerName, review.publication
        FROM beers AS b OVER review IN b.reviews
    
    The `OVER` clause iterates over the 'reviews' array and collects 'reviewerName' and 'publication' from each element in the array. This collection of objects can be used as input for other query operations.
    
* **WHERE** - Any expression in the clause is evaluated for objects in a result set. If it evaluates as TRUE for an object, the object is the object is included in the remainder of the query. For example:

        select * FROM players WHERE score > 100

* **GROUP BY** - Collects items from multiple result objects and groups the elements by one or more expressions. This is an aggregate query. For example, if you have json documents for books and films and all films have a field "type": "movie" while books have a field "type": "book" you can perform this query:

        select title, type, COUNT(*) AS count FROM catalog GROUP BY type
        
    Any books in the result set will grouped together and returned in an object while all films will be grouped and returned in another object.

* **HAVING** - This clause can optionally follow a `GROUP BY` clause. It can filter result objects from the `GROUP BY` clause with a given expression.

* **ORDER BY** - The order of items in the result set is determined by expression in this clause. Objects are sorted first by the left-most expression in the list of expressions. Any items with the same sort value will be sorted with the next expression in the list. This process repeats until all items are sorted and all expressions in the list are evaluated. 

    The `ORDER BY` clause can evaluate any JSON value. This means it can compare values of different types. For instance 'four' and 4 and will order by type. The following describes order by type from highest to lowest precedence:
    
    * missing value, known as MISSING
    * null value, known as NULL
    * false
    * true
    * number
    * string
    * arrays, where each element in the array is compared with the corresponding element in another array. A longer array will sort after a shorter array.
    * object, where key-values from one object are compared to key-values from another object. Keys are evaluated in sorted order for strings. Larger objects will sort after smaller objects.
    
*  **LIMIT** - Imposes a specific number of objects returned in a result set by `SELECT`. This clause must have a non-negative integer as upper bound.

* **OFFSET** - This clause can optionally follow a `LIMIT` clause. If you specify an offset, this many number of objects are omitted from the result set before enforcing a specified `LIMIT`. This clause must be a non-negative integer.


###Examples

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

- `FROM` will return any values from the `orders` data bucket. For example:

        SELECT * FROM orders.billToAddress.state

Will return a list of all billing states from the orders data bucket. Sample output would appears as follows:
    
       "results": [
        {
            "state": "CA"
        }
    ]

- `AS` will return any values retrieved by the select statement using an alias provided. For instance:

        SELECT
             shipToAddress.state AS state_abv FROM orders
             
    Will return all states from ship to addresses in an array where each array element uses the alias: { "state_abv": { .... } }
    
        SELECT
             shipToAddress.state AS state,
             SUM(grand_total) AS grandTotalByState
          FROM orders
             GROUP BY shipToAddress.state
    
    Will get states from orders and then sum the grand_totals from the orders and label these amounts `grandTotalByState` in the result set.
    
- `WHERE` will return results based on a condition or expression provided in the `WHERE` clauses. For example, with the customer orders documents we can perform this query:

        SELECT * FROM orders WHERE grand_total > 2000
          
    This query will return a result set of all customer orders where the `grand_total` is greater than 2000.

- `ORDER BY` will return a result set which is sorted by a given field. For example, to get all names in a contact database and order then by age:

        SELECT shipToAddress.state FROM orders ORDER BY grand_total.
        
    This will scan all orders and return all items in a result set ordered by the grand_total by ascending order, from lowest to highest.
    
- `LIMIT` can be used as a standalone clause to limit the number of results, or can be used with other clauses such as order by to limit the number of sorted results that appear. For example:

        SELECT name FROM contacts LIMIT 2
    
    Will only return two names from the contacts database. Sample output would look like this:
    
        {
          "name": "dave"
        },
        {
          "name": "earl"
        }
        
    If you use this statement in conjunction with an `ORDER BY` the objects will first be sorted in ascending order and then limited by the given number:
    
        SELECT name FROM contacts ORDER BY age LIMIT 3
    
    This query will return the names of the three youngest contacts, sorted by age. An example of output is as follows:
    
        {
          "name": "fred"
        },
        {
          "name": "harry"
        },
        {
          "name": "jane"
        }
    
- `GROUP-BY` will return a result set where all orders that meet the conditions are grouped by a particular expression. For example:

        
        SELECT
             shipToAddress.state AS state
          FROM orders
          WHERE grand_total > 2000
          GROUP BY shipToAddress.state
          
    This query gets all states from ship-to addresses in customer orders where the grand total is greater than 2000. The result set will be grouped by state.
    
- `HAVING` can be used after a `GROUP BY` clause to filter items in a group by a given condition. The following example builds upon the `GROUP BY` we used previously:

        SELECT
             shipToAddress.state AS state,
             SUM(grand_total) AS grandTotalByState
          FROM orders
          WHERE grand_total > 2
          GROUP BY shipToAddress.state
          HAVING grandTotalByState >= 1000

    This will return a list of states where the grand total of orders, grouped by state is greater than or equal to 1000. The sample output appears as follows:
    
        [
            {"state": "CA",
                "grandTotalByState": 10000000},
            {"state": "DE",
                "grandTotalByState": 5000},
            ....
        ]
        
- `OVER` can be used after the `FROM` clause to iterate through all items in a document array and provide these elements input into other query clauses. For example, to go through each child in a children array in contacts:

        SELECT * FROM contacts AS contact OVER contact.children AS child WHERE child.name = 'aiden'

    This example will scan all 'children' arrays in contacts, find the document where the child's name is 'aiden' and return the contacts in a result set. An example result set, given just one matching contact would look like this:
    
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
            
    Here the actual contact is named dave and the one child in the array of children that matches is 17 and male.

###See Also
- [Expressions](#expressions)
- [Comparison Terms](#Comparison_Terms)
- [Functions](#functions)
- [Arithmetic Operators](#arithmetic_ops)
- [Errors and Response Codes](#errors_responses)


<a href="#create-index"></a>
##Create Index

You use this statement to create an index on fields and nested paths. The index provides an optimized access path for N1QL queries.

###Syntax

    CREATE INDEX index-name ON [ :pool-name. ] bucket-name( path [ , ... ] )
    
###Compatibility

Compatible with Couchbase Server 2.2

###Example

    CREATE INDEX contact_name ON contacts(name)


<a href="#create-primary-index"></a>
##Create Primary Index

You use this statement to ensure an optimized primary key index. If the primary key index already exists, the statement will recognize it and not create a duplicate index.

###Syntax

    CREATE PRIMARY INDEX ON [ :pool-name. ] bucket-name
    
###Compatibility

Compatible with Couchbase Server 2.2

###Example

    CREATE PRIMARY INDEX ON contacts


<a href="#drop-index"></a>
##Drop Index

You use this statement to remove a named index in the given bucket.

###Syntax

    DROP INDEX [ :pool-name. ] bucket-name . index-name
    
###Compatibility

Compatible with Couchbase Server 2.2

###Example

    DROP INDEX contacts.contact_name


<a href="#expressions"></a>
##Expressions

These are the different symbols and operators in N1QL you can use to manipulate document data and result set objects. 

###Syntax

        [ literal-value ]
        [ identifier ]
        [ case-expr ]
        [ collection-expr ]
        [ logical-term ]
        [ comparison-term ]
        [ arithmetic-term ]
        [ string-term ]
        [ function ]
        [ nested-expr ]
        [ expr ]
        
        where literal-value can be one of:
        
        [ string | number | object | array | TRUE | FALSE | NULL ]
        
        where identifier can be one of:
        
        [ unescaped-identifier | escaped-identifier ]

        where unescaped-identifier is:

         a-z | A-Z | _ | &  [ 0-9 | a-z | a-Z | _ | $ ]

        where escaped-identifier is:

         `chars`
        
        where case-expr is as follows:
        
        CASE WHEN expr THEN expr [, ...] [ ELSE expr ] END
        
        where collection-expr is as follows
        
        ANY | ALL expr OVER identifier IN path END
        
        FIRST | ARRAY expr OVER identifier IN path [ WHEN expr ] END
        
        where nested-expr can be one of:
        
        expr.expr
        expr[ expr ]
        
        where function is a follows:
        
        function-name( [ [ DISTINCT ] * | path.* | expr [, ... ] ] )
        
        
###Compatibility

Compatible with Couchbase Server 2.2

###Description

N1QL expressions are like formulas but they are written in a query language. They include operators, 
symbols and values you can use to evaluate and filter result objects.

###Options

- `literal-value` - includes standard literal values in JSON. This includes strings, numbers, objects, arrays, the boolean TRUE/FALSE as well as NULL. The rules defined at [json.org](http://www.json.org/) apply to literal values in N1QL with two exceptions:
    - JSON arrays and objects can only contain nested values. In N1QL, literal arrays and objects can also contain nested expressions.
    - In JSON 'true', 'false', and 'null' are case-sensitive. In N1QL they are case-insensitive to be consistent with other keywords.

- `identifier` is also known as a path. It can be an escaped or unescaped identifier. Unescaped identifiers support the most common identifiers in JSON as a simpler syntax. Escaped identifiers are surrounded by back-ticks and support all identifiers in JSON. Using two back-ticks within an escaped identifier will create a single back-tick. The syntax for `identifier` is as follows:
        
    An identifier is a reference to a value in the current context of a query. For instance if you have a contacts database with a document structure as follows:
    
        {
            "firstName" : "Geremy"
            "lastName" : "Irving"
        }
    
    The identifier person.lastName would evaluate to the value "Irving." 
    
- ` nested-expr` - is a way to specify fields nested inside of other objects. It can include the dot operator, `.`, as well as bracket notation, `[]` to access items in an array or object. For example our contacts documents can have the following document structure:

        {
            "address": {
                "city": "Mountain View"
            },
            "revisions": [2013]
        }
        
    The expression `address.city` evaluates to the value 'Mountain View' and the expression `revisions[0]` evaluates to the value `2013`.
    
- `case-expr` - You can do conditional logic in an expression. If the first `WHEN` expression evaluates to TRUE, the result for this expression is the `THEN` expression. If the first `WHEN` evaluates to FALSE, then the next `WHEN` clauses will be evaluated. If no `WHEN` clause evaluates to `TRUE` the result is the `ELSE` expression. If no `ELSE` expression is provided in the clause, the result is NULL.

- `collection-expr` - Enables you to evaluate expressions using nested collections. The different forms of collection expressions are specified using `ANY`, `ALL`, `FIRST`, or `ARRAY`. You provide an array to evaluate as a `path` in an `OVER` clause. The server will iterate through each element in the array and assign each item an `identifier` from the `IN` clause. The `identifier` is only used as a identifier within the collection expression and is distinct from identifiers provided in other clauses.

    `ANY` If at least one item in the array satisfies the `ANY` expression, then return `TRUE`, otherwise return `FALSE`.
    
    `ALL` If all array elements satisfy the `ALL` expression, return TRUE. Otherwise return `FALSE.` If the array is empty, return `TRUE`.

    `FIRST` Return the evaluated expression using the first array element (that satisifies the `WHEN` clause, if provided).

    `ARRAY` Returns a new array of the evaluated expression using each element of the `OVER` array (that satisifies the `WHEN` clause, if provided).
    
- `logical-term` - Enables you to combine other expression with boolean logic. Includes `AND`, `OR`, and `NOT`.

- `comparison-term` - These clauses enable you to compare the results of two expressions. This includes `=`, `<`, `>`, `<=`, `>=` and others. The terms `=` and `==` are functional equivalents of equal which are provided for compatibility with other languages. The terms `!=` and `<>` are also equivalent comparisons provided for compatibility. See [Comparison Terms](#Comparison_Terms).
    
    If a comparison term is missing from the clause, returns `MISSING`. If either operand in a comparison results in `NULL` returns `NULL`. If comparison operators return results of different types, returns `FALSE`.
    
    By default any string comparisons use raw collation, otherwise known as binary collation. This collation is *case sensitive*. If you want to perform case-insensitive comparisons, you can first transform a string with `UPPER()` or `LOWER()` functions.
    
    The `LIKE` operator enables you to do wildcard matching in strings. You provide a pattern to the right of the operators which can optionally contain wildcard characters of `%` or `_`. The percentage sign, `%`, indicates any string of zero or more characters. The underscore, `_` matches any single character.
    
    **Comparing NULL and MISSING values**
      
    `NULL` or `MISSING` values have special comparison terms because we need to determine type information. For more information, see [Comparison Terms](#Comparison_Terms).
    
- `arithmetic-term` - perform arithmetic methods within an expression. This includes basic mathematical operations such as addition, subtraction, multiplication, divisions, and modulo. In addition, a negation operation will change the sign of a value. See [Arithmetic Operators](#arithmetic_ops).

- `string-term`, or `||` - If both operands are strings, the `||` operator will concatenate the strings, otherwise evaluates to NULL.

- `function-name` - used to apply a function to values, to values at a specified path, or to values derived from a `DISTINCT` clause. For a full list of 
functions, see [Functions](#functions).
         
###Examples

Given a customer order document with the following information:

        {
            "type":"contact",
            "name":"dave",
            "age": 45,
            "email": "dave@gmail.com",
            "children":[
                {"name":"aiden","age":17,"gender":"m"},
                {"name":"bill","age":2,"gender":"f"}
                ],
            ....
        }

- `literal-expr` will return any record that matches the literal expression provided in a query. For example:

        SELECT email FROM contacts AS contact WHERE contact.name = 'dave'
    
    Will return emails from any contacts where the contact name is 'dave.' Sample output appears as follows:
    
        {
          "email": "dave@gmail.com"
        }
        
- `ANY` will return any record with one or more items that meet the condition or expression. For example this query will return all contacts who have one or more children over the age of 14:

        SELECT name FROM contacts WHERE ANY child.age > 14 OVER children

    This will return at one item in the result set for 'dave' because one of his children is 17. The sample output is as follows:

        "results": [
          {
            "name": "dave"
          },
          ....
        ]
        
 `ALL` will return records with fields that meet all conditions or expression provided in the query. For example, this query is almost identical to the one above with `ANY` however we substitute it for `ALL`:
 
        SELECT name FROM tutorial WHERE ALL child.age > 10 OVER tutorial.children AS child
        
    This query will scan all contacts and return the name of any contact that has children over the age of 10. Example output for this query is below:
    
        {
            "name": "ian"
        }

    This tells us that out of all of the contacts only 'ian' has children who are both over the age 10.
    
- `LIKE` will return contacts are similar to a given string. For example, to get all contacts with an email ending with '@yahoo':

        SELECT name, email
            FROM tutorial 
                WHERE email LIKE '%@yahoo.com'
                
    The % indicates any characters prior to @ can appear. This will return output similar to the following:
    
        {
            "email": "harry@yahoo.com",
            "name": "harry"
        },
    
- `NOT LIKE` is the inverse of `LIKE`. It will return items that are not like the given string. For example, the following clause will return all emails from contacts which do not contain `@yahoo`:

        SELECT name, email
            FROM tutorial 
                WHERE email NOT LIKE '%@yahoo.com'
            
    This will return results as follows:
    
        {
            "email": "dave@gmail.com",
            "name": "dave"
        },

- `logical-expr` can be used to provide logical operators, for example you can test for two conditions at the same time in a query:

        SELECT name FROM tutorial WHERE LENGTH(children) > 0 AND email LIKE '%@gmail.com'
        
    This query will scan all contacts and output the name of any contact with more than one child who also has an email ending in '@gmail'. Example output from this query follows:
    
            {
                "name": "dave"
            },
            ....
            
- `arithmetic-expr` will apply an arithmetic expression to any numerical values retrieved as part of query clauses. For example:

        SELECT name, age, age*12 AS age_in_months
            FROM tutorial 
                WHERE name = 'dave'
                
    This will select the document where name is 'dave' and return the name, age and age times 12. Example output appears as follows:
    
        {
          "age": 45,
          "age_in_months": 540,
          "name": "dave"
        }
        
- `case-expr` will apply conditional logic to documents. For example the following uses a `CASE` clause to handle documents that do not have an ship date:

        SELECT CASE WHEN `shipped-on` IS NOT NULL THEN `shipped-on` ELSE \"not-shipped-yet\" END AS shipped FROM orders
    
    This will scan all orders and if an order has a shipped-on date, provide it in the result set. If an order does not have a shipped-on date, it will provide default text instead. Sample output for this query is as follows:
    
        { "shipped": "2013/01/02" },
        { "shipped": "2013/01/12" },
        { "shipped": "not-shipped-yet" },
        ....


###See Also
- [Comparison Terms](#Comparison_Terms)
- [Functions](#functions)
- [Arithmetic Operators](#arithmetic_ops)
- [Errors and Response Codes](#errors_responses)

<a id="Comparison_Terms"></a>
##Comparison Terms

The following comparison terms are available in N1QL:

| Comparison | Description | Returns | 
| -------- |:----:| -----:|
| = | Equals to | TRUE or FALSE |
| == | Equals to | TRUE or FALSE |
| != | Not equal to | TRUE or FALSE |
| <> | Not equal to | TRUE or FALSE |
| > | Greater than | TRUE or FALSE |
| >= | Greater than or equal to | TRUE or FALSE |
| < | Less than | TRUE or FALSE |
| <= | Less than or equal to | TRUE or FALSE |
| LIKE | Match string with wildcard expression. `%` for zero or more wildcards, `_` to match any character at this place in a string | TRUE or FALSE |
| NOT LIKE | Inverse of LIKE. Return TRUE if string is not similar to given string. | TRUE or FALSE |
| IS NULL | Field has value of NULL. | TRUE or FALSE |
| IS NOT NULL | Field has value or is missing. | TRUE or FALSE |
| IS MISSING | No value for field found. | TRUE or FALSE |
| IS NOT MISSING | Value for field found or value is NULL. | TRUE or FALSE |
| IS VALUED | Value for field found. Value is neither missing nor NULL | TRUE or FALSE |
| IS NOT VALUED | Value for field not found. Value is NULL. | TRUE or FALSE |

<a id="arithmetic_ops"></a>
##Arithmetic Operators

The following are the arithmetic operations in N1QL. These operators only function on numeric values. If either operand is non-numeric, and expression will evaluate to NULL.

| Operator | Description |
| -------- | -----:|
| + | Add items 
| - | Subtract right value from left 
| * | Multiply values 
| / | Divide left value by right 
| % | Modulo. Divid left value by right, return the remainder 
| -value | Negate value 

##Operators and Operator Precedence

The following operators are available in N1QL. The list that follows is also in the order of precedence where the items listed above others have precedence over them:

* `CASE | WHEN | THEN | ELSE | END`
* `.`
* `[]`
* `-`
* `*/%`
* `+-`
* `IS NULL | IS MISSING | IS VALUED`
* `IS NOT NULL | IS NOT MISSING | IS NOT VALUED`
* `LIKE`
* `<`, `>`, `<=`, and `=>`
* `=`
* `NOT`
* `AND`
* `OR`

You can also use parenthesis to combine expressions and operators and the parenthesis have the highest precedence. If you use parenthesis to group operators and expressions, these items will be evaluated first and then the result will then be used in any other operations.

<a id="functions"></a>
##Functions

N1QL provides several built-in functions for performing calculations on data. You can find both aggregate and scalar functions. Aggregate functions take multiple values from documents, perform calculations and return a single value as the result. Scalar functions take a single item in a result set and returns a single value. All function names are case insensitive.

Aggregate functions include SUM, AVG, COUNT, MIN, MAX and ARRAY_AGG. Aggregate functions can only be used in SELECT, HAVING, and ORDER BY clauses. When aggregate functions are used in expressions in these clauses, the query will operate as an aggregate query. Aggregate functions take one argument, the value over which to compute the aggregate function. The COUNT function can also take '*' or 'path.*' as its argument.

###Aggregate Functions

You can use aggregate functions in SELECT, HAVING and ORDER BY clauses. When you use an aggregate function in a clause with these commands, the query will act as an aggregate query. 

| Function | Description | Returns | Example | 
| ------------- |:-------------:| -----:|-----:|
| COUNT(expr) | Returns the number items in a result set | 0 or positive integer |  |
| MIN(expr) | Returns minimum value of all values in a result set. This is the first non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer, NULL if no non-NULL, non-MISSING items in result set |  |
| MAX(expr) | Returns maximum value of all values in a result set. This is the last non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer |  |
| AVG(expr) | Returns average value of all values in a result set. Non-numeric values in a result set are ignored. | Integer |  |
| SUM(expr) | Returns sum of all numeric values in a result set. Non-numeric values in a result set are ignored | Integer |  |
| ARRAY_AGG(expr) | Evaluate the expression for each member of the group and return an array containing these values | Array |  |

### Scalar Functions

These functions will return a single value based on the items in a result set. The following are scalar functions in N1QL:

|Function | Description | Returns | Example |
|--------- |:------------:| -----:|--------:|
| BASE64_VALUE(value) | Return the value encoded in base64. can be used on work with non-JSON values stored in the bucket. | value | 
| CEIL(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer |  
| FIRSTNUM(expr1, expr2, ...) | Returns the first non-NULL, non-MISSING, non-NaN, non-infinite numeric value | NULL or integer |  
| FLOOR(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer |  
| GREATEST(expr, expr, ....) | Returns greatest value from all expressions provided. Otherwise NULL if values NULL or MISSING | value |  
| IFINF(expr1, expr2, ...)  | returns the first non-infinite value (+ or -) | value |
| IFMISSING(expr, expr, ....) | Returns the first non-MISSING value | value |  
| IFMISSINGORNULL(expr, expr, ....) | Returns the first non-MISSING, non-NULL value | value | 
| IFNAN(expr1, expr2, ...) | Returns the first non-NaN value | value | 
| IFNANORINF(expr1, expr2, ...) |  returns the first non-NaN, non-infinite value | value | 
| IFNEGINF(expr1, expr2, ...) |  Returns the first non-infinite value | value |  
| IFNULL(expr, expr, ....) | Returns the first non-NULL value | value | 
| IFPOSINF(expr1, expr2, ...) | Returns the first positive non-infinite value | value |  
| LEAST(expr, expr, ... ) | Returns the smallest non-NULL, non-MISSING VALUE after evaluating all expressions. If all values are NULL or MISSING, returns NULL | value or NULL |  
|   LENGTH(expr) | Returns the length of the value after evaluating the expression. If string, length of string. For arrays, length of array. For objects returns the number of pairs in object. For all others returns NULL | value or NULL | length(orders.items)
|   LOWER(expr) | If expr is a string, returns string in all lowercase, otherwise NULL | string or NULL |  
|   LTRIM(expr, charset) | Remove the longest string containing the characters in `charset` from start of string. | string or NULL | 
| META() | Returns metadata for the document | value | 
| MISSINGIF(value1, value2) | If value1 equals value2 return MISSING, otherwise value1 | value | 
| NANIF(value1, value2) | If value1 equals value2, return NaN, otherwise value1 | value1 or NaN |  
|   NEGINFIF(value1, value2) | If value1 equals value2, return negative infinity, otherwise value1 | value1 or -infinity |  
|   NULLIF( value1, value2 ) | If valuel 1 equals value2, return NULL, otherwise value1. | value1 or NULL | 
|  POSINFIF(value1, value2) | If value1 equals value2, return positive infinity, otherwise value1 | value1 or +infinity |  
|   ROUND( value ) | If value is numeric, round to nearest integer, otherwise NULL. Functional equivalent of `ROUND(value, 0)` | integer or NULL |   
|   ROUND( value, digits ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL |   
|   RTRIM( expr, charset ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL |   
|   SUBSTR( value, position ) | For value of string and position numeric, returns substring from position to end of string. String position starts at 1. If position 0, starts at position 1 nonetheless. If negative position, characters are counted from the end of string. Otherwise returns NULL. | string or NULL |   
|   SUBSTR( value, position, length ) | If length is positive integer, returns substring starting at position up to length characters. Otherwise NULL | string or NULL |   
|   TRIM( expr, charset ) | Functional equivalent of LTRIM(RTRIM(expr, charset)) | string or NULL |   
|   TRUNC( value ) | If numeric value, truncates towards zero. Functional equivalent of TRUNC(value, 0). Otherwise returns NULL | integer or NULL |   
|   TRUNC( value, digits ) | If digits an integer and value numeric, truncates value to the specific number of digits. Otherwise returns NULL | integer or NULL |   
|   UPPER( expr ) | If expr a string, return it in all uppercase letters. Otherwise NULL | string or NULL |   
|   VALUE() | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | value or NULL |   

<a id="reserved_words"></a>
## Reserved Words

The following keywords are reserved and cannot be used as identifiers. All keywords are case-insensitive.

There will be more reserved words in the future to support DDL, DML, compound statements, and others. To ensure that an identifier does not conflict with a future reserved word, you can escape the identifier with back ticks.

- ALL
- ALTER
- AND
- ANY
- ARRAY
- AS
- ASC
- BETWEEN
- BUCKET
- BY
- CASE
- CAST
- COLLATE
- CREATE
- DATABASE
- DELETE
- DESC
- DISTINCT
- DROP
- EACH
- ELSE
- END
- EXCEPT
- EXISTS
- EXPLAIN
- FALSE
- FIRST
- FROM
- GROUP
- HAVING
- IF
- IN
- INDEX
- INLINE
- INSERT
- INTERSECT
- INTO
- IS
- JOIN
- LIKE
- LIMIT
- MISSING
- NOT
- NULL
- OFFSET
- ON
- OR
- ORDER
- OVER
- PATH
- POOL
- PRIMARY
- SELECT
- THEN
- TRUE
- UNION
- UNIQUE
- UPDATE
- USING
- VALUED
- VIEW
- WHEN
- WHERE

