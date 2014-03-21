<a href="#create-primary-index"></a>
#Create Primary Index

You use this statement to ensure an optimized primary key index. If the primary key index already exists, the statement will recognize it and not create a duplicate index.

##Syntax

    CREATE PRIMARY INDEX ON [ :pool-name. ] bucket-name
    
##Compatibility

Compatible with Couchbase Server 2.2

##Example

    CREATE PRIMARY INDEX ON contacts


