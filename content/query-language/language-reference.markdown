#Language Reference

This reference section describes the syntax and general semantics of N1QL. This includes all available commands, functions, expressions, conditionals and operators for the language.

##Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

###Syntax

    SELECT [ DISTINCT | UNIQUE ]
        [ FROM data-source ]
        [ WHERE expression ]
        [ GROUP BY expression [, ...] ]
        [ HAVING expression ]
        [ ORDER BY ]
        [ LIMIT ]
        [ OFFSET ]
        
###Supported Versions

###Description


###Parameters

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