<a href="#create-index"></a>
#Create Index

You use this statement to create an index on fields and nested paths. The index provides an optimized access path for N1QL queries.

##Syntax

    CREATE INDEX index-name ON [ :pool-name. ] bucket-name( path [ , ... ] )
    
##Compatibility

Compatible with Couchbase Server 2.2

##Example

    CREATE INDEX contact_name ON contacts(name)

