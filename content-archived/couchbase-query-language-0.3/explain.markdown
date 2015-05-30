<a href="#explain"></a>
#Explain

You can use this keyword before any N1QL statement and get information about how the statement operates.

##Syntax

    EXPLAIN statement
    
##Compatibility

Compatible with Couchbase Server 2.2

##Example

Perform any N1QL statement preceding by they keyword `EXPLAIN` to get JSON output describing how the query would execute. For example:

    EXPLAIN SELECT name, age FROM contacts LIMIT 2
    
Returns the following output:

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

