<a href="#expressions"></a>
#Expressions

These are the different symbols and operators in N1QL you can use to manipulate document data and result set objects. 

##Syntax

```
[ literal-value ]      \\ [ string | number | object | array | TRUE | FALSE | NULL ]
[ identifier ]         \\ [ unescaped-identifier | escaped-identifier ]
                       \\ unescaped-identifier: a-z | A-Z | _ | &  [ 0-9 | a-z | a-Z | _ | $ ]
                       \\ escaped-identifier: `chars`
[ case-expr ]          \\ CASE WHEN expr THEN expr [, ...] [ ELSE expr ] END
[ collection-expr ]    \\ ANY | EVERY expr SATISFIES identifier IN path END
                       \\ FIRST | ARRAY expr OVER identifier IN path [ WHEN expr ] END
[ logical-term ]
[ comparison-term ]
[ arithmetic-term ]
[ string-term ]
[ function ]           \\ function-name( [ [ DISTINCT ] * | path.* | expr [, ... ] ] )`
[ nested-expr ]        \\ expr.expr or expr[ expr ]
[ expr ]
```
        
       
##Compatibility

Compatible with Couchbase Server 2.2

##Description

N1QL expressions are like formulas but they are written in a query language. They include operators, 
symbols and values you can use to evaluate and filter result objects.

##Options

### literal-value
`literal-value` includes standard literal values in JSON. This includes strings, numbers, objects, arrays, the boolean TRUE/FALSE as well as NULL. The rules defined at [json.org](http://www.json.org/) apply to literal values in N1QL with two exceptions:
    - JSON arrays and objects can only contain nested values. In N1QL, literal arrays and objects can also contain nested expressions.
    - In JSON 'true', 'false', and 'null' are case-sensitive. In N1QL they are case-insensitive to be consistent with other keywords.

### identifier

`identifier` is also known as a path. It can be an escaped or unescaped identifier. Unescaped identifiers support the most common identifiers in JSON as a simpler syntax. Escaped identifiers are surrounded by back-ticks and support all identifiers in JSON. Using two back-ticks within an escaped identifier will create a single back-tick. The syntax for `identifier` is as follows:
        
An identifier is a reference to a value in the current context of a query. For instance if you have a contacts database with a document structure as follows:
    
```
`{
    "firstName" : "Geremy"
    "lastName" : "Irving"
}
```
    
The identifier person.lastName would evaluate to the value "Irving." 
 

### Nested expressions
` nested-expr` - is a way to specify fields nested inside of other objects. It can include the dot operator, `.`, as well as bracket notation, <code>[position] or [start:end?]</code>, to access items in an array or object. 

Array slicing is available. Array slicing is in the form  of <code>source-array [ start : end ]</code>. It returns a new array containing a subset of the source array, containing the elements from position <code>start</code> to <code>end-1</code>. The element at <code>start</code> is included, while the element at <code>end</code> is not. If <code>end</code> is omitted, all elements from <code>start</code> to the end of the source array are included.

If the contacts documents has the following document structure and information:

* The expression address.city evalutes to the value "Mountain View".
* The expression revisions[0] evaluates to the value 2013.
* The expression revisions[1:3] evaluates to the array value [2012, 2011].
* The expression revisions[1:] evaluates to the array value [2012, 2011, 2010].

```
{
  "address": {
    "city": "Mountain View"
  },
  "revisions": [2013, 2012, 2011, 2010]
}
```        
### Case expressions
`case-expr` - You can do conditional logic in an expression. If the first `WHEN` expression evaluates to TRUE, the result for this expression is the `THEN` expression. If the first `WHEN` evaluates to FALSE, then the next `WHEN` clauses will be evaluated. If no `WHEN` clause evaluates to `TRUE` the result is the `ELSE` expression. If no `ELSE` expression is provided in the clause, the result is NULL.

### collection-expr

`collection-expr` - Enables you to evaluate expressions using nested collections. The different forms of collection expressions are specified using `ANY`, `EVERY`, `FIRST`, or `ARRAY`.  Provide an array to evaluate as a `path` in an `SATISFIES` clause. The server iterates through each element in the array and assign each item an `identifier` from the `IN` clause. The `identifier` is only used as a identifier within the collection expression and is distinct from identifiers provided in other clauses.

* `ANY` - If at least one item in the array satisfies the `ANY` expression, then returns `TRUE`, otherwise returns `FALSE`.
    
* `EVERY` - If every array element satisfies the `EVERY` expression, the return TRUE. Otherwise return `FALSE.` If the array is empty, return `TRUE`.

* `FIRST` - Returns the evaluated expression using the first array element (that satisfies the `WHEN` clause, if provided).

* `ARRAY` - Returns a new array of the evaluated expression using each element of the `OVER` array (that satisifies the `WHEN` clause, if provided).

### logical-term  
  
`logical-term` enables you to combine other expression with boolean logic. Includes `AND`, `OR`, and `NOT`.

### comparison-term

`comparison-term` clauses enable you to compare the results of two expressions. This includes `=`, `<`, `>`, `<=`, `>=` and others. The terms `=` and `==` are functional equivalents of equal which are provided for compatibility with other languages. The terms `!=` and `<>` are also equivalent comparisons provided for compatibility. See [Comparison Terms](#Comparison_Terms).
    
If a comparison term is missing from the clause, returns `MISSING`. If either operand in a comparison results in `NULL` returns `NULL`. If comparison operators return results of different types, returns `FALSE`.
    
By default any string comparisons use raw collation, otherwise known as binary collation. This collation is *case sensitive*. If you want to perform case-insensitive comparisons, you can first transform a string with `UPPER()` or `LOWER()` functions.
    
The `LIKE` operator enables you to do wildcard matching in strings. You provide a pattern to the right of the operators which can optionally contain wildcard characters of `%` or `_`. The percentage sign, `%`, indicates any string of zero or more characters. The underscore, `_` matches any single character.
    
`NULL` or `MISSING` values have special comparison terms because we need to determine type information. For more information, see [Comparison Terms](#Comparison_Terms).

### arithmetic-term

`arithmetic-term` operations perform arithmetic methods within an expression. This includes basic mathematical operations such as addition, subtraction, multiplication, divisions, and modulo. In addition, a negation operation will change the sign of a value. See [Arithmetic Operators](#arithmetic_ops).

### string-term

`string-term`, or `||` - If both operands are strings, the `||` operator will concatenate the strings, otherwise evaluates to NULL.

### function-name

`function-name` - used to apply a function to values, to values at a specified path, or to values derived from a `DISTINCT` clause. For a full list of 
functions, see [Functions](#functions).
         
##Examples

Given a customer order document with the following information:


```
`{
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
```

### Literal expression example

`literal-expr` returns any record that matches the literal expression provided in a query. The following query returns emails from contacts where the contact name is 'dave'.

```
`SELECT email FROM contacts AS contact WHERE contact.name = 'dave'
```

```   
{
          "email": "dave@gmail.com"
}
```


### CASE example    

`case-expr` applies conditional logic to documents. For example the following uses a `CASE` clause to handle documents that do not have an ship date. This scans all orders and if an order has a shipped-on date, provide it in the result set. If an order does not have a shipped-on date, it will provide default text instead.

```
SELECT CASE WHEN `shipped-on` IS NOT NULL THEN `shipped-on` ELSE \"not-shipped-yet\" END AS shipped FROM orders
```

    
```    
{ "shipped": "2013/01/02" },
{ "shipped": "2013/01/12" },
{ "shipped": "not-shipped-yet" },
 ....
```


### Collection expression example        
The different forms of collection expressions are specified using `ANY`, `EVERY`, `FIRST`, or `ARRAY`.  

#### ANY
`ANY` returns any record with one or more items that meet the condition or expression. In the following query, all contacts who have one or more children over the age of 14 are retrieved. This query returns at one item for 'dave' because one of his children is 17.

```
SELECT name FROM contacts WHERE ANY child.age > 14 SATISFIES children
```

```
"results": [
          {
            "name": "dave"
          },
          ....
        ]
```


#### EVERY
 `EVERY`  returns records with fields that meet all conditions or expression provided in the query. For example, this query is almost identical to the one above with `ANY` with `EVERY` substituted. This query scans all contacts and returns the name of any contact that has children over the age of 10. This tells us that out of all of the contacts only 'ian' has children who are both over the age 10.

```
SELECT name FROM tutorial WHERE EVERY child.age > 10 SATISTIES tutorial.children AS child
```

```    
{
            "name": "ian"
 }
```



### Logical expression example
`logical-expr` can be used to provide logical operators, for example you can test for two conditions at the same time in a query. This query scans all contacts and output the name of any contact with more than one child who also has an email ending in '@gmail'. 

```
SELECT name FROM tutorial WHERE LENGTH(children) > 0 AND email LIKE '%@gmail.com'
```
    
```    
{
	"name": "dave"
	...
},
```


### Comparison example
`comparison-term` clauses enable you to compare the results of two expressions. The `LIKE` operator enables you to do wildcard matching in strings. You provide a pattern to the right of the operators which can optionally contain wildcard characters of `%` or `_`. The percentage sign, `%`, indicates any string of zero or more characters. The underscore, `_` matches any single character.

#### LIKE   
`LIKE` returns contacts are similar to a given string. For example, to get all contacts with an email ending with '@yahoo'. The % indicates any characters prior to @ can appear.

```
SELECT name, email
            FROM tutorial 
                WHERE email LIKE '%@yahoo.com'
```
                

```    
{
            "email": "harry@yahoo.com",
            "name": "harry"
 },
```

#### NOT LIKE 
`NOT LIKE` is the inverse of `LIKE`. It returns items that are not like the given string. For example, the following clause will return all emails from contacts which do not contain `@yahoo`.

```
SELECT name, email
            FROM tutorial 
                WHERE email NOT LIKE '%@yahoo.com'
```            

```
{
            "email": "dave@gmail.com",
            "name": "dave"
},
```


            
### Arithmetic expression example

`arithmetic-expr` applies an arithmetic expression to any numerical values retrieved as part of query clauses. This query selects the document where name is 'dave' and return the name, age and age times 12. 

```
SELECT name, age, age*12 AS age_in_months
            FROM tutorial 
                WHERE name = 'dave'
```

```
{
          "age": 45,
          "age_in_months": 540,
          "name": "dave"
}
```                
    
### See also
- [Operators](#operators)
- [Functions](#functions)


