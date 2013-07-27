#Language Reference

This reference section describes the syntax and general semantics of N1QL. This includes all available commands, functions, expressions, conditionals and operators for the language.

We use the following typographical conventions to mark different parts of the command syntax:

- Square brackets [] indicate optional parts
- Curled braces {} indicate you must provide this clause
- Separator | indicates you choose one alternative
- Dots ... mean that you can repeat the preceding element in a query

##Explain

You can use this keyword before any N1QL statement and get information about how the statement operates.

###Syntax

    EXPLAIN select-statement
    
###Compatibility

Available in Couchbase Server X.X

###Description

The EXPLAIN statement can precede any N1QL statement. The statement will be evaluated and will return information about how the statement 
operates. The output from this statement is for analysis and troubleshooting queries only.

##Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

###Syntax

    SELECT [ DISTINCT ]
        { result-expr-list }
        [ FROM data-source ]
        [ WHERE expr ]
        [ GROUP BY expr [, ...] ]
        [ HAVING expr ]
        [ ORDER BY ordering-term [, ...] ]
        [ LIMIT { int } [ OFFSET { int } ] ]

        
    where result-expr-list can be:
    
        result-expr [, result-expr-list] ...
        
    where result-expr can be:
        
        *
        path
        path.*
        expr [ AS identifier ]
    
    where data_source can be:
    
        path [ [AS] identifier ] [ OVER data-source] 
        
    where path can be:
    
        identifier [int] [ .path ]
    
    where identifier can be:
    
        bucket_name
        database_name
    
    where ordering-term can be:
    
        expr [ ASC | DESC ]
        
        
###Compatibility

Available in Couchbase Server X.X

###Description

The SELECT statement queries a data source. It returns a JSON array containing zero or more result objects. You can see how SELECT behaves as a sequence of steps in a process. Each step in a sequence produces result objects which are then used as inputs in the next step in a query until all steps complete:

* Data Source. This is the Couchbase data bucket you query. You provide this as the parameter data-source in a FROM clause. Alternately you can provide a `path` as data source.

* Filtering. Results objects from the SELECT can be filtered by adding a WHERE clause.

* Result Set. You generate a set of result objects with GROUP BY or HAVING clauses along with a result expression list, `result-expr-list`.

* Duplicate Removal. Remove duplicate result objects from the result set. To do so you use a DISTINCT query.

###Options

The following describe optional clauses you can use in your select statement:

* `DISTINCT` Clause. If you use the `DISTINCT` in your query, any duplicate result objects will be removed from the result set. If you do not use `DISTINCT`the query will return all objects that meet the query conditions in a result set.

* `FROM` Clause. This is an optional clause for your query. If you omit this clause the input for the query is a single empty object. The most common way to use the FROM clause is to provide a `data-source` which is a named data bucket, database name, or path. Alternately you can provide the database, data bucket, or path as an alias using the `AS` clause in `FROM.`

    One use of the `FROM` clause is to specify a path within a bucket as `data-source`. The path refers an array in the your documents. With this option, the server evaluates the path for each document in the data bucket and the value at that path becomes an input for the query. For example, imagine you have a data bucket named `breweries` which has a document that describes each brewery in a country. Each document has an array called `address`. To get all addresses as input for a query, you use this clause:

        FROM brewer.address

    This will get all address fields from all breweries in the data bucket. If the address field does not exist for a brewer, it will not be part of the query input.    

* `OVER` Clause. This clause can optionally follow a `FROM` clause. This will iterate over attributes within a specified document array. The array elements by this clause will them become input for further query operations. For example, imagine you have a document as follows and you want to get all published reviewers for the beer:

        { "id": "7983345",
        "name": "Takayama Pale Ale",
        "brewer": "Hida Takayama Brewing Corp.",
        "reviews" : [
            { "reviewerName" : "Takeshi Kitano", "publication" : "Outdoor Japan Magazine", "date": "3/2013" },
            { "reviewerName" : "Moto Ohtake", "publication" : "Japan Beer Times", "date" : "7/2013" }
            ]
        }
    
    In this case you would provide a statement containing `OVER` as follows:

        SELECT reviews.reviewerName, reviews.publication
        FROM beers OVER reviews
    
    The `OVER` clause iterates over the 'reviews' array and collects 'reviewerName' and 'publication' from each element in the array. This collection of objects can be used as input for other query operations.
    
* `WHERE` Clause. Any expression in the clause is evaluated for objects in a result set. If it evaluates as TRUE for an object, the object is included in a results array. For example:

        select * FROM players WHERE score > 100

* `GROUP BY` Clause. Collects items from multiple result objects and groups the elements by one or more expressions. This is an aggregate query. 

* `HAVING` Clause. This clause can optionally follow a `GROUP BY` clause. It can be  filter result objects from the `GROUP BY` clause with a given expression.

* `ORDER BY` Clause. The order of items in the result set is determined by expression in this clause. Objects are sorted first by the left-most expression in the list of expressions. Any items with the same sort value will be sorted with the next expression in the list. This process repeats all items are sorted and all expressions in the list are evaluated. 

    The `ORDER BY` clause can evaluate any JSON value. This means it can compare values of different types, for instance 'four' and 4 and will order by type. The following describes order by type from highest to lowest:
    
    * missing value, known as MISSING
    * null value, known as NULL
    * false
    * true
    * number
    * string
    * arrays, where each element in the array is compared with the corresponding element in another array. A longer array will sort after a shorter array
    * object, where key-values from one object are compared to key-values from another object. Keys are evaluated in sorted order for strings. Larger objects will sort after smaller objects.
    
*  `LIMIT` Clause. Imposes a specific number of objects returned in a result set by `SELECT`. This clause must have an integer as upper bound.

* `OFFSET` Clause. This clause can optionally follow a `LIMIT` clause. If you specify and offset, this many objects are omitted from the result set before enforcing a specified `LIMIT`. This clause must be an integer.



###Examples

###See Also

##Operators

##Functions

N1QL provides several built-in functions for performing calculations on data. You can find both aggregate and scalar functions. Aggregate functions take multiple values from documents, perform calculations and return a single value as the result. Scalar functions take a single item in a result set and returns a single value. All function names are case insensitive.

###Aggregate Functions

You can use aggregate functions in SELECT, HAVING and ORDER BY clauses. When you use an aggregate function in a clause with these commands, the query will act as an aggregate query. 

| Function | Description | Returns | Example | 
| ------------- |:-------------:| -----:|-----:|
| COUNT(expr) | Returns the number items in a result set | 0 or positive integer | xxx|
| MIN(expr) | Returns minimum value of all values in a result set. This is the first non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer, NULL if no non-NULL, non-MISSING items in result set | xxx |
| MAX(expr) | Returns maximum value of all values in a result set. This is the last non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer | xxx |
| AVG(expr) | Returns average value of all values in a result set. Non-numeric values in a result set are ignored. | Integer | xxx |
| SUM(expr) | Returns sum of all numeric values in a result set. Non-numeric values in a result set are ignored | Integer | xxx |

### Scalar Functions

These functions will return a single value based on the items in a result set. The following are scalar functions in N1QL:

|Function | Description | Returns | Example |
|--------- |:------------:| -----:|--------:|
| CEIL(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer | xxxx |
| FLOOR(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer | xxxx |
| GREATEST(expr, expr, ....) | Returns greatest value from all expressions provided. Otherwise NULL if values NULL or MISSING | value | xxxx |
| IFMISSING(expr, expr, ....) | Returns the first non-MISSING value | value | xxxx |
| IFMISSINGORNULL(expr, expr, ....) | Returns the first non-MISSING, non-NULL value | value | xxxx |
| IFNULL(expr, expr, ....) | Returns the first non-NULL value | value | xxxx|
| META() | Returns metadata for the document | value | xxxx|
| MISSINGIF(value1, value2) | If value1 equals value2 return MISSING, otherwise value1 | value | xxxx |
| LEAST(expr, expr, ... ) | Returns the smallest non-NULL, non-MISSING VALUE after evaluating all expressions. If all values are NULL or MISSING, returns NULL | value or NULL | xxxx |
|   LENGTH(expr) | Returns the length of the value after evaluating the expression. If string, length of string. For arrays, length of array. For objects returns the number of pairs in object. For all others returns NULL | value or NULL | xxxx |
|   LOWER(expr) | If expr is a string, returns string in all lowercase, otherwise NULL | string or NULL | xxxx |
|   LTRIM(expr, charset) | Remove the longest string containing the characters in `charset` from start of string. | string or NULL | xxxx |
|   NULLIF( value1, value2 ) | If valuel 1 equals value2, return NULL, otherwise value1. | value1 or NULL | xxxx |
|   ROUND( value ) | If value is numeric, round to nearest integer, otherwise NULL. Functional equivalent of `ROUND(value, 0)` | integer or NULL | xxxx |
|   ROUND( value, digits ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL | xxxx |
|   RTRIM( expr, charset ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL | xxxx |



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
        
        where object can be one of:
        
        { } 
        { members }
        
        where members can be one of:
        
        pair
        pair.{ members }
        
        where pair is:
        
        string:expr
        
        where nested-expr can be one of:
        
        expr.expr
        expr[ expr ]
        
        
###Compatibility

Available in Couchbase Server X.X

###Description

N1QL expressions are similar to formulas but written in a query language. They include operators, 
symbols, and values which you can use to evaluate and filter result objects.

###Options

- `literal-value` includes standard literal values in JSON. This includes strings, numbers, objects, arrays, the booleans TRUE and FALSE as well as NULL. The rules defined at [json.org](http://www.json.org/) apply to literal values in N1QL with two exceptions:
    - JSON arrays and objects can only contain nested values. In N1QL, literal arrays and objects can also contain nested expressions.
    - In JSON 'true', 'false', and 'null are case-sensitive. In N1QL they are case-insensitive to be consistent with other keywords.

- `identifier` is also known as a path. It can be an escaped or unescaped identifier. Unescaped identifiers support the most common identifiers in JSON as a simpler syntax. Escaped identifiers are surrounded by back-ticks and support all identifiers in JSON. Using two back-tick within an escaped identifier will create a single back-tick. The syntax for `identifier` is as follows:

        [ unescaped-identifier ]
        [ escaped-identifier ]
        
        where unescaped-identifier is:
        
        { a-z | A-Z | _ | & } [ 0-9 | a-z | a-Z | _ | $ ]
        
        where escaped-identifier is:
        
        { `chars` }
        
    An identifier, or path, is a reference to a particular value in a document. For instance given a people database with documents as follows:
    
        {
            "firstName" : "Geremy"
            "lastName" : "Irving"
        }
    
    The path person.lastName would evaluate to the value "Irving" in this example.  
         
###Examples

###See Also


##Conditions

##Operators and Operator Precedence

The following operators are available in N1QL. The list that follows is also in the order of precedence where the items listed above others have precedence over them:

* CASE | WHEN | THEN | ELSE | END
* .
* []
* -
* */%
* +-
* IS NULL | IS MISSING | IS VALUED
* IS NOT NULL | IS NOT MISSING | IS NOT VALUED
* like
* <, >, <=, and =>
* =
* NOT
* AND
* OR

You can also use parenthesis to combine expressions and operators and the parenthesis have the highest precedence. If you use parenthesis to group operators and expressions, these items will be evaluated first and then the result will then be used in any other operations.
