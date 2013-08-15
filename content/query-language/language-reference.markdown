<a href="#language_ref"></a>
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

The SELECT statement queries a data source. It returns a JSON array containing zero or more result objects. You can see how SELECT behaves as a sequence of steps in a process. Each step in the process produces result objects which are then used as inputs in the next step until all steps in the process are complete. The possible elements and operations in a query include:

* **Data Source** - This is the Couchbase data bucket you query. You provide this as the parameter data-source in a FROM clause. Alternately you can provide a `path` as data source.

* **Filtering** - Results objects from the SELECT can be filtered by adding a WHERE clause.

* **Result Set** - You generate a set of result objects with GROUP BY or HAVING clauses along with a result expression list, `result-expr-list`.

* **Duplicate Removal** Remove duplicate result objects from the result set. To do so you use a DISTINCT query.

###Options

The following describes optional clauses you can use in your select statement:

* **`DISTINCT`** - If you use the `DISTINCT` in your query, any duplicate result objects will be removed from the result set. If you do not use `DISTINCT`, the query will return all objects that meet the query conditions in a result set.

* **`FROM`** - This is an optional clause for your query. If you omit this clause, the input for the query is a single empty object. The most common way to use the FROM clause is to provide a `data-source` which is a named data bucket, database name, or path. Alternately you can provide the database, data bucket, or path as an alias using the `AS` clause with `FROM.` For example:

        SELECT children[0].name AS cname
        	FROM contacts

    Another way to use the `FROM` clause is to specify a path within a bucket as `data-source`. The path refers to an array in the your documents. With this option, the server evaluates the path for each document in the data bucket and the value at that path becomes an input for the query. For example, you have a data bucket named `contacts` which has documents that describes each contact in a system. Each document has an array called `address`. To get all addresses as input for a query, you use this clause:

        FROM contacts.address

    This will get all address fields from all contacts in the data bucket. If the address field does not exist for a contact, it will not be part of the query input.    

* **`OVER`** - This clause can optionally follow a `FROM` clause. This will iterate over attributes within a specified document array. The array elements by this clause will then become input for further query operations. For example, imagine you have a document as follows and you want to get all published reviewers for the beer:

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
    
* **`WHERE`** - Any expression in the clause is evaluated for objects in a result set. If it evaluates as TRUE for an object, the object is included in a results array. For example:

        select * FROM players WHERE score > 100

* **`GROUP BY`** - Collects items from multiple result objects and groups the elements by one or more expressions. This is an aggregate query. 

* **`HAVING`** - This clause can optionally follow a `GROUP BY` clause. It can filter result objects from the `GROUP BY` clause with a given expression.

* **`ORDER BY`** - The order of items in the result set is determined by expression in this clause. Objects are sorted first by the left-most expression in the list of expressions. Any items with the same sort value will be sorted with the next expression in the list. This process repeats until all items are sorted and all expressions in the list are evaluated. 

    The `ORDER BY` clause can evaluate any JSON value. This means it can compare values of different types. For instance 'four' and 4 and will order by type. The following describes order by type from highest to lowest precedence:
    
    * missing value, known as MISSING
    * null value, known as NULL
    * false
    * true
    * number
    * string
    * arrays, where each element in the array is compared with the corresponding element in another array. A longer array will sort after a shorter array.
    * object, where key-values from one object are compared to key-values from another object. Keys are evaluated in sorted order for strings. Larger objects will sort after smaller objects.
    
*  **`LIMIT`** - Imposes a specific number of objects returned in a result set by `SELECT`. This clause must have an integer as upper bound.

* **`OFFSET`** - This clause can optionally follow a `LIMIT` clause. If you specify an offset, this many number of objects are omitted from the result set before enforcing a specified `LIMIT`. This clause must be an integer.



###Examples

###See Also




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

        { a-z | A-Z | _ | & } [ 0-9 | a-z | a-Z | _ | $ ]

        where escaped-identifier is:

        { `chars` }
        
        where case-expr is as follows:
        
        { CASE WHEN expr THEN expr [, ...] } [ ELSE expr ] { END }
        
        where collection-expr is as follows
        
        { ANY | ALL } { expr OVER path AS identifier }
        
        where nested-expr can be one of:
        
        expr.expr
        expr[ expr ]
        
        where function is a follows:
        
        function-name( path. | path.* | DISTINCT { expr [, ... ] } | UNIQUE { expr [ , ... ] } )
        
        
###Compatibility

Available in Couchbase Server X.X

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

- `collection-expr` - Enables you to use boolean expressions for nested collections. The two different ways to provide this expression is through either `ANY` or `ALL`. You provide an array to evaluate as a `path` in an `OVER` clause. The server will iterate through each element in the array and assign each item an `identifier` from the `AS` clause. The `identifier` is only used as a identifier within the `ANY` or `ALL` clause and is distinct from identifiers provided in other clauses.

    `ANY` If an expression evaluates to an array and at least one item in the array satisfies the `ANY` expression, then return `TRUE`, otherwise return `FALSE`.
    
    `ALL` If an expression evaluates to an array and all array elements satisfy the `ALL` expression, return TRUE. Otherwise return `FALSE.` If an array is empty, return `TRUE`.
    
- `logical-term` - Enables you to combine other expression with boolean logic. Includes `AND`, `OR`, and `NOT`.

- `comparison-term` - These clauses enable you to compare the results of two expressions. This includes `=`, `<`, `>`, `<=`, `>=` and others. The terms `=` and `==` are functional equivalents of equal which are provided for compatibility with other languages. The terms `!=` and `<>` are also equivalent comparisons provided for compatibility. See [Comparison Terms](#Comparison_Terms).
    
    If a comparison term is missing from the clause, returns `MISSING`. If either operand in a comparison results in `NULL` returns `NULL`. If comparison operators return results of different types, returns `FALSE`.
    
    By default any string comparisons use raw collation, otherwise known as binary collation. This collation is *case sensitive*. If you want to perform case-insensitive comparisons, you can first transform a string with `UPPER()` or `LOWER()` functions.
    
    The `LIKE` operator enables you to do wildcard matching in strings. You provide a pattern to the right of the operators which can optionally contain wildcard characters of `%` or `_`. The percentage sign, `%`, indicates any string of zero or more characters. The underscore, `_` matches any single character.
    
    **Comparing NULL and MISSING values**
      
    `NULL` or `MISSING` values have special comparison terms because we need to determine type information. For more information, see [Comparison Terms](#Comparison_Terms).
    
- `arithmetic-term` - perform arithmetic methods within an expression. This includes basic mathematical operations such as addition, subtraction, multiplication, divisions, and modulo. In addition, a negation operation will change the sign of a value. See [Arithmetic Operators](#arithmetic_ops).

- `string-term`, or `||` - If both operands are strings, the `||` operator will concatenate the strings, otherwise evaluates to NULL.

- `function-name` - used to apply a function to values, to values at a specified path, or to values derived from a `DISTINCT` or `UNIQUE` clause. For a full list of 
functions, see [Functions](#functions).
         
###Examples

###See Also

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
| CEIL(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer | xxxx 
| FLOOR(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer | xxxx 
| GREATEST(expr, expr, ....) | Returns greatest value from all expressions provided. Otherwise NULL if values NULL or MISSING | value | xxxx 
| IFMISSING(expr, expr, ....) | Returns the first non-MISSING value | value | xxxx 
| IFMISSINGORNULL(expr, expr, ....) | Returns the first non-MISSING, non-NULL value | value | xxxx 
| IFNULL(expr, expr, ....) | Returns the first non-NULL value | value | xxxx
| META() | Returns metadata for the document | value | xxxx|
| MISSINGIF(value1, value2) | If value1 equals value2 return MISSING, otherwise value1 | value | xxxx 
| LEAST(expr, expr, ... ) | Returns the smallest non-NULL, non-MISSING VALUE after evaluating all expressions. If all values are NULL or MISSING, returns NULL | value or NULL | xxxx 
|   LENGTH(expr) | Returns the length of the value after evaluating the expression. If string, length of string. For arrays, length of array. For objects returns the number of pairs in object. For all others returns NULL | value or NULL | xxxx 
|   LOWER(expr) | If expr is a string, returns string in all lowercase, otherwise NULL | string or NULL | xxxx 
|   LTRIM(expr, charset) | Remove the longest string containing the characters in `charset` from start of string. | string or NULL | xxxx 
|   NULLIF( value1, value2 ) | If valuel 1 equals value2, return NULL, otherwise value1. | value1 or NULL | xxxx 
|   ROUND( value ) | If value is numeric, round to nearest integer, otherwise NULL. Functional equivalent of `ROUND(value, 0)` | integer or NULL | xxxx 
|   ROUND( value, digits ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL | xxxx 
|   RTRIM( expr, charset ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL | xxxx 
|   SUBSTR( value, position ) | For value of string and position numeric, returns substring from position to end of string. String position starts at 1. If position 0, starts at position 1 nonetheless. If negative position, characters are counted from the end of string. Otherwise returns NULL. | string or NULL | xxxx 
|   SUBSTR( value, position, length ) | If length is positive integer, returns substring starting at position up to length characters. Otherwise NULL | string or NULL | xxxx 
|   TRIM( expr, charset ) | Functional equivalent of LTRIM(RTRIM(expr, charset)) | string or NULL | xxxx 
|   TRUNC( value ) | If numeric value, truncates towards zero. Functional equivalent of TRUNC(value, 0). Otherwise returns NULL | integer or NULL | xxxx 
|   TRUNC( value, digits ) | If digits an integer and value numeric, truncates value to the specific number of digits. Otherwise returns NULL | integer or NULL | xxxx 
|   UPPER( expr ) | If expr a string, return it in all uppercase letters. Otherwise NULL | string or NULL | xxxx 
|   VALUE() | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | value or NULL | xxxx 

