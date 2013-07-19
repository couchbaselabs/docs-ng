#Language Reference

This reference section describes the syntax and general semantics of N1QL. This includes all available commands, functions, expressions, conditionals and operators for the language.

##Select

You use the SELECT statement to extract data from Couchbase Server. The result of this command will be one or more objects.

###Syntax

###Supported Versions

###Description

###Parameters

###Examples

###See Also

##Operators

##Functions

N1QL provides several built-in functions for performing calculations on data. You can find both aggregate and scalar functions. Aggregate functions take multiple values from documents, perform calculations and return a single value as the result. Scalar functions return a single value based on a value in a document.

###Aggregate Functions

You can use aggregate functions in SELECT, HAVING and ORDER BY clauses. When you use an aggregate function in a clause with these commands, the query will act as an aggregate query. 

| Function | Description | Returns | Example | 
| ------------- |:-------------:| -----:|-----:|
| Count(expr) | Returns the number items in a result set | 0 or positive integer | xxx|
| MIN(expr) | Returns minimum value of all values in a result set. This is the first non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer | xxx|


##Expressions

##Conditions