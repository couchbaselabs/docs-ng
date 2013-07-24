#Language Reference

This reference section describes the syntax and general semantics of N1QL. This includes all available commands, functions, expressions, conditionals and operators for the language.

##Explain

You can use this keyword before any N1QL statement and get information about how the statement operates.

###Syntax

    EXPLAIN statement
    
###Compatibility

Available in Couchbase Server X.X

###Description

The EXPLAIN statement can precede any N1QL statement. The statement will be evaluated and will return information about how the statement 
operates. The output from this statement is for analysis and troubleshooting queries only.

##Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

###Syntax

    SELECT [ DISTINCT | UNIQUE ]
        * | expr
        [ FROM data-source ]
        [ WHERE expr ]
        [ GROUP BY expr [, ...] ]
        [ HAVING expr ]
        [ OVER data-source ]
        [ ORDER BY ordering-term ]
        [ LIMIT { int } ]
        [ OFFSET ]
        
    where data_source can be:
    
        data_bucket_name
        path [ [AS] identifier ]
        
    where path can be
    
        identifier [int] [ . ] path
        
        
###Compatibility

Available in Couchbase Server X.X

###Description

The SELECT statement queries a data source. It returns a JSON array containing zero or more result objects. You can see how SELECT behaves as a sequence of steps in a process. Each step in a sequence produces result objects which are them used as inputs in the next step until all steps complete:

* Data Source. This is the Couchbase data bucket you query. You provide this as the parameter data-source in a FROM clause. Alternately you can provide a `path` as data source.

* Filtering. Results objects from the SELECT can be filtered by adding a WHERE clause.

* Result Set. You generate a set of result objects with GROUP BY or HAVING clauses along with a result expression list, `result-expr-list`.

* Duplicate Removal. Remove duplicate result objects from the result set. To do so you use a DISTINCT query.

###Options

The following describe optional clauses you can use in your select statement:

* `DISTINCT` Clause. If you use the `DISTINCT` in your query, any duplicate result objects will be removed from the result set. If you do not use `DISTINCT`the query will return all objects that meet the query conditions in a result set.

* `FROM` Clause. This is an optional clause for your query. If you omit this clause the input for the query is a single empty object. The most common way to use the FROM clause is to provide a `data-source` which is a named data bucket. Alternately you can provide the database or data bucket name as an alias using the `AS` clause within `FROM.`

    Another use of the `FROM` clause is to specify a path within a bucket. With this option, the server evaluates the path specified for each document in the data bucket and the value at that path becomes an input into the query. For example, imagine you have a data bucket named `breweries` which has a document that describes each brewery in a country. Each document has a field called `address`. To get all addresses as input for a query, you use this clause:

        FROM brewer.address

    This will get all address fields from all breweries in the data bucket. If the address field does not exist for a brewer, it will not be part of the query input.    


* `WHERE` Clause. Any expression in the clause is evaluated for objects in a result set. If it evaluates as TRUE for an object, the object is included in a results array. For example:

        select * FROM players WHERE score > 100

* `GROUP BY` Clause. 

* `HAVING` Clause.

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

N1QL provides several built-in functions for performing calculations on data. You can find both aggregate and scalar functions. Aggregate functions take multiple values from documents, perform calculations and return a single value as the result. Scalar functions take a single item in a result set and returns a single value.

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

These functions will return a single value based on the items in a result set. 

##Expressions

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
