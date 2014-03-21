<a id="functions"></a>
#Functions

N1QL provides several built-in functions for performing calculations on data. You can find both aggregate and scalar functions. Aggregate functions take multiple values from documents, perform calculations and return a single value as the result. Scalar functions take a single item in a result set and returns a single value. All function names are case insensitive.

Aggregate functions include SUM, AVG, COUNT, MIN, MAX and ARRAY_AGG. Aggregate functions can only be used in SELECT, HAVING, and ORDER BY clauses. When aggregate functions are used in expressions in these clauses, the query will operate as an aggregate query. Aggregate functions take one argument, the value over which to compute the aggregate function. The COUNT function can also take '*' or 'path.*' as its argument.

##Aggregate functions

You can use aggregate functions in SELECT, HAVING and ORDER BY clauses. When you use an aggregate function in a clause with these commands, the query will act as an aggregate query. 

| Function | Description | Returns | 
| ------------- |-------------| -----|
| ARRAY_AGG(expr) | Evaluate the expression for each member of the group and return an array containing these values | Array | 
| AVG(expr) | Returns average value of all values in a result set. Non-numeric values in a result set are ignored. | Integer |  
| COUNT(expr) | Returns the number items in a result set | 0 or positive integer |  
| MIN(expr) | Returns minimum value of all values in a result set. This is the first non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer, NULL if no non-NULL, non-MISSING items in result set |  
| MAX(expr) | Returns maximum value of all values in a result set. This is the last non-NULL, non-MISSING value that would result from an ORDER BY | 0 or positive integer |  
| SUM(expr) | Returns sum of all numeric values in a result set. Non-numeric values in a result set are ignored | Integer |  
 

## Scalar functions

Scalar functions return a single value based on the items in a result set. The following are scalar functions are provided in N1QL:

* Date functions
* String functions
* Number functions
* Array functions
* Comparison functions
* Conditional functions
* Meta and value functions
* Type checking and conversion functions

 
### Date functions

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| DATE_ADD_MILLIS(expr, n, part) | Date arithmetic. n and part defines an interval or duration, which is then added (or subtracted) to the UNIX timestamp and returns the result. | Possible date results include year, month (1-12), day (1-31), hour (0-23), second (0-59), and millisecond (0-999). |  
| DATE_DIFF_MILLIS(expr1, expr2, part) | Date arithmetic. Returns the elapsed time between two UNIX timestamps, as an integer whose unit is part. | |  
| DATE_PART('field', source) | Retrieves subfields such as year or hour from date/time values. The source must be a value expression of type timestamp or time | value |  
| DATE_PART_MILLIS(expr, part) | Date part as an integer. The date expression is a number representing UNIX milliseconds and part is s date part strings. | See the following DATE_PART_MILLIS strings. |  
| DATE_TRUNC_MILLIS(expr, part) | Truncates UNIX timestamp so that the given date part string is the least significant. |  |
|   NOW_STR | Returns current date and time as a String value | value |  


**DATE_PART_MILLIS strings**

* millenium
* century
* decade - floor(year / 10)
* year
* quarter - 1 to 4
* month - 1 to 12
* day - 1 to 31
* hour - 0 to 23
* minute - 0 to 59
* second - 0 to 59
* millisecond - 0 to 999
* week - 1 to 53; ceil(day_of_year / 7.0)
* day_of_year, doy - 1 to 366
* day_of_week, dow - 0 to 6
* iso_week - 1 to 53; use with "iso_year"
* iso_year - use with "iso_week"
* iso_dow - 1 to 7
* timezone - offset from UTC in seconds
* timezone_hour - hour component of timezone offset
* timezone_minute - minute component of timezone offset


### String functions

| Function | Description | Returns | 
| ----------- | --------------- | ---------- |
|   LENGTH(expr) | Returns the length of the value after evaluating the expression. For example, length(orders.items). If string, length of string. For arrays, length of array. For objects, returns the number of pairs in object. For all others, returns NULL | value or NULL |
|   LOWER(expr) | If expr is a string, returns string in all lowercase, otherwise NULL | string or NULL |
|   LTRIM(expr, charset) | Remove the longest string containing the characters in `charset` from start of string. | string or NULL |  
|   RTRIM( expr, charset ) | Remove the longest string containing only the characters in the specified character set starting at the end| string or NULL |
|   SUBSTR( value, position ) | For value of string and position numeric, returns substring from position to end of string. String position starts at 1. If position 0, starts at position 1 nonetheless. If negative position, characters are counted from the end of string. Otherwise returns NULL. | string or NULL |
|   SUBSTR( value, position, length ) | If length is positive integer, returns substring starting at position up to length characters. Otherwise NULL | string or NULL |
|   TRIM( expr, charset ) | Functional equivalent of LTRIM(RTRIM(expr, charset)) | string or NULL | 
|   UPPER( expr ) | If expr a string, return it in all uppercase letters. Otherwise NULL | string or NULL |

### Number functions

| Function | Description | Returns |
| ----------- | --------------- | ---------- |
| CEIL(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer |
| FLOOR(value) | If numeric values, return the smallest integer no less than this value. Otherwise NULL | NULL or integer |
|   ROUND( value ) | If value is numeric, round to nearest integer, otherwise NULL. Functional equivalent of `ROUND(value, 0)` | integer or NULL |
|   ROUND( value, digits ) | If digits an integer and value numeric, rounds the value up to the number of digits. Otherwise returns NULL | integer or NULL |
|   TRUNC( value ) | If numeric value, truncates towards zero. Functional equivalent of TRUNC(value, 0). Otherwise returns NULL | integer or NULL | 
|   TRUNC( value, digits ) | If digits an integer and value numeric, truncates value to the specific number of digits. Otherwise returns NULL | integer or NULL |



### Array functions
The array functions also support array slicing.

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| ARRAY_CONCAT(expr1, expr2) | Concatenates the array with the input arrays. | xxx |  
| ARRAY_LENGTH(expr) | Returns the number of elements in the array. | Integer |  
|  ARRAY_APPEND(expr, value) | New array with an appended value. |  |  
| ARRAY_PREPEND(value, expr) | New array with a prepended value. |  |  
| ARRAY_REMOVE(expr, value)  | New array with all occurrences of the value removed. |  |  


### Comparison functions

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| GREATEST(expr, expr, ....) | Returns greatest value from all expressions provided. Otherwise NULL if values NULL or MISSING | value |  
| LEAST(expr, expr, ... ) | Returns the smallest non-NULL, non-MISSING VALUE after evaluating all expressions. If all values are NULL or MISSING, returns NULL | value or NULL |  

### Conditional functions

The following functions are conditional functions for unknowns:

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| FIRSTNUM(expr1, expr2, ...) | Returns the first non-NULL, non-MISSING, non-NaN, non-infinite numeric value | NULL or integer |
| IFMISSING(expr, expr, ....) | Returns the first non-MISSING value | value |  
| IFMISSINGORNULL(expr, expr, ....) | Returns the first non-MISSING, non-NULL value | value | 
| IFNULL(expr, expr, ....) | Returns the first non-NULL value | value | 
| MISSINGIF(value1, value2) | If value1 equals value2 return MISSING, otherwise value1 | value | 
|   NULLIF(value1, value2 ) | If valuel 1 equals value2, return NULL, otherwise value1. | value1 or NULL |

The following functions are functions for numbers:

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| IFINF(expr1, expr2, ...)  | Returns the first non-infinite value (+ or -) | value |  
| IFNAN(expr1, expr2, ...) | Returns the first non-NaN value | value |  
| IFNANORINF(expr1, expr2, ...) |  Returns the first non-NaN, non-infinite value | value |  
| IFNEGINF(expr1, expr2, ...) |  Returns the first non-infinite value | value |  
| IFPOSINF(expr1, expr2, ...) | Returns the first positive non-infinite value | value |  
| NANIF(value1, value2) | If value1 equals value2, return NaN, otherwise value1 | value1 or NaN |  
| NEGINFIF(value1, value2) | If value1 equals value2, return negative infinity, otherwise value1 | value1 or +infinity |  
| NEGINFIF(value1, value2) | If value1 equals value2, return negative infinity, otherwise value1 | value1 or +infinity |  
| POSINFIF(value1, value2) | If value1 equals value2, return positive infinity, otherwise value1 | value1 or +infinity |  


### Meta and value functions

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| BASE64_VALUE(value) | Return the value encoded in base64. can be used on work with non-JSON values stored in the bucket. | value | 
| META() | Returns metadata for the document | value | 
|   VALUE() | Returns the full value for the item in the current context| value or NULL |   


### Type checking and conversion functions

| Function | Description | Returns |  
| ----------- | --------------- | ---------- |  
| IS_ARRAY(expr) | Checks to see if the expression is an array. | True or False |  
| IS_ATOM(expr) | Checks to see if the expression is a boolean, number, or string. | True or False |  
| IS_BOOL(expr) | Checks to see if the expression is a boolean. | True or False |  
| IS_NUM(expr) | Checks to see if the expression is a number. | True or False |  
| IS_OBJ(expr) | Checks to see if the expression is an object. | True or False |  
| IS_STR(expr) | Checks to see if the expression is a string. | True or False |  
| TO_ARRAY(expr) | Converts the expression to an array. | Array |  
| TO_ATOM(expr) | Converts the expression to an atomic value. | Atomic value |  
| TO_BOOL(expr) | Converts the expression to a booleon value. | Boolean value |  
| TO_NUM(expr) | Converts the expression to a numerical value. | Numerical value |  
| TO_STR(expr) | Converts the expression to a string. | String |
| TYPE_NAME(expr) | Based on the value of the expression, returns the type of string. | String types: missing, null, not_json, boolean, number, string, array, or object. |

#### TO_ARRAY(expr)

Converts the expression to an array.

* MISSING if the array missing
* NULL if the array is null
* Arrays are themselves
* All other values are wrapped in an array


#### TO_ATOM(expr)
Converts the expression to an atomic value. 

* MISSING if the array missing</li>
* NULL if the array is null</li>
* Arrays of length 1 are the result of TO_ATOM() on their single element</li>
* Objects of length 1 are the result of TO_ATOM() on their single value</li>
* Booleans, numbers, and strings are themselves</li>
* All other values are NULL


#### TO_BOOL(expr)
Converts the expression to a booleon value.

* MISSING if the array missing
* NULL if the array is null
* False is false
* Numbers +0, -0 and NaN are false
* Empty strings, arrays, and objects are false
* All other values are true


### TO_NUM(expr)
Converts the expression to a numerical value.

* MISSING if the expression is missing
* NULL if the expression is null
* False is 0
* True is 1
* Numbers are themselves
* Strings that are pased as numbers are those numbers
* All other values are NULL

### TO_STR(expr)
Converts the expression to a string.

* MISSING if the expression is missing
* NULL if the expression is null
* False is false
* True is true
* Numbers are their string representation
* Strings are themselves
* All other values are NULL

#### TYPE_NAME(expr)
Returns the type of string.

* missing
* null
* not_json
* boolean
* number
* string
* array
* object
