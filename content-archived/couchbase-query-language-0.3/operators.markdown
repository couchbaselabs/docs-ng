<a id="operators"></a>
# Operators

The following operators are available in N1QL. Parenthesis are used to combine expressions and operators.  The parenthesis have the highest precedence.  If parenthesis are used to group operators and expressions, these items are evaluated first and then the result is used in any other operations.


## Order of precedence

The following list shows the order of precedence where the items listed above the others have precedence over them:

<pre><code>
CASE | WHEN | THEN | ELSE | END 
 .
  [ ]
   -
    */% 
     +-
      IS NULL | IS MISSING | IS VALUED
       IS NOT NULL | IS NOT MISSING | IS NOT VALUED
        LIKE | BETWEEN 
         =, <, >, <=, and =>
          NOT | NOT BETWEEN
            AND
            OR
</code></pre>



<a id="arithmetic_ops"></a> 

##Arithmetic operators

The following are the arithmetic operations in N1QL. These operators only function on numeric values. If either operand is non-numeric, and expression evaluates to NULL.

| Operator | Description |
| -------- | -----|
| + | Add items 
| - | Subtract right value from left 
| * | Multiply values 
| / | Divide left value by right 
| % | Modulo. Divid left value by right, return the remainder 
| -value | Negate value 


<a id="comparison-terms"></a>
## Comparison operators

The following comparison operators are available in N1QL:

| Comparison | Description | Returns | 
| -------- |----| -----|
| = | Equals to | TRUE or FALSE |
| == | Equals to | TRUE or FALSE |
| != | Not equal to | TRUE or FALSE |
| <> | Not equal to | TRUE or FALSE |
| > | Greater than | TRUE or FALSE |
| >= | Greater than or equal to | TRUE or FALSE |
| < | Less than | TRUE or FALSE |
| <= | Less than or equal to | TRUE or FALSE |  
| BETWEEN | Search criteria for a query where the value is between two values, including the end values specified in the range. 
| LIKE | Match string with wildcard expression. `%` for zero or more wildcards, `_` to match any character at this place in a string | TRUE or FALSE |
| NOT LIKE | Inverse of LIKE. Return TRUE if string is not similar to given string. | TRUE or FALSE |
| IS NULL | Field has value of NULL. | TRUE or FALSE |
| IS NOT NULL | Field has value or is missing. | TRUE or FALSE |
| IS MISSING | No value for field found. | TRUE or FALSE |
| IS NOT MISSING | Value for field found or value is NULL. | TRUE or FALSE |
| IS VALUED | Value for field found. Value is neither missing nor NULL | TRUE or FALSE |
| IS NOT VALUED | Value for field not found. Value is NULL. | TRUE or FALSE |  
| NOT BETWEEN |  Search criteria for a query where the value is outside the range of two values, including the end values specified in the range. |

