# Ruby — Storage Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The Couchbase Ruby Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="couchbase-sdk-ruby-set-add"></a>

## Add Operations

The `add` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_ruby_add"></a>

**API Call**                    | `object.add(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                       
**Description**                 | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.                                                                                                                           
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                   
**object value**                | Value to be stored                                                                                                                                                                                                                       
**hash options**                | Hash containing option/value pairs used during a set operation.                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                                
                                | `:ttl` (int)                                                                                                                                                                                                                             
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                              
                                | `:flags` (fixnum)                                                                                                                                                                                                                        
                                | Flags used during the set. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.                        
                                | `:format` (symbol)                                                                                                                                                                                                                       
                                | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.                           
                                | `:cas` (fixnum)                                                                                                                                                                                                                          
                                | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
**Exceptions**                  |                                                                                                                                                                                                                                          
`ArgumentError`                 | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`     | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists`   | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::ValueFormat` | Exception object indicating the value cannot be serialized with chosen encoder, for instance, occurs if you try to store Hash in :plain mode.                                                                                            

The `add` method adds a value to the database using the specified key.


```
couchbase.add("someKey", 0, someObject);
```

Unlike [Set Operations](#couchbase-sdk-ruby-set-set) the operation can fail (and
return false) if the specified key already exists.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will set the key:
```
c.add("foo", "bar")   # stores successully
c.add("foo", "baz")   # raises Couchbase::Error::KeyExists:
                      # fails to store value (key="foo", error=0x0c)
```



<a id="couchbase-sdk-ruby-set-replace"></a>

## Replace Operations

The `replace` methods update an existing key/value pair in the database. If the
specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_ruby_replace"></a>

**API Call**                  | `object.replace(key, value [, ruby-replace-options ])`                                                
------------------------------|-------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                    
**Description**               | Update an existing key with a new value                                                               
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                      
**Arguments**                 |                                                                                                       
**string key**                | Document ID used to identify the value                                                                
**object value**              | Value to be stored                                                                                    
**hash ruby-replace-options** | Hash of options containing key/value pairs                                                            
**Exceptions**                |                                                                                                       
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                             
`Couchbase::Error::KeyExists` | Exception object indicating the CAS value does not match the one for the record already on the server.
`Couchbase::Error::NotFound`  | Exception object specifying a given key cannot be found in datastore.                                 

The first form of the `replace` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


```
couchbase.replace("samplekey","updatedvalue",0);
```

<a id="couchbase-sdk-ruby-set-set"></a>

## Set Operations

The set operations store a value into Couchbase or Memcached using the specified
key and value. The value is stored against the specified key, even if the key
already exists and has data. This operation overwrites the existing with the new
data.

<a id="table-couchbase-sdk_ruby_set"></a>

**API Call**                    | `object.set(key, value, options)`                                                                                                                                                                                                        
--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                       
**Description**                 | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.                                                                                              
**Returns**                     | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                   |                                                                                                                                                                                                                                          
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                   
**object value**                | Value to be stored                                                                                                                                                                                                                       
**hash options**                | Hash containing option/value pairs used during a set operation.                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                                
                                | `:ttl` (int)                                                                                                                                                                                                                             
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                              
                                | `:flags` (fixnum)                                                                                                                                                                                                                        
                                | Flags used during the set. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.                        
                                | `:format` (symbol)                                                                                                                                                                                                                       
                                | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.                           
                                | `:cas` (fixnum)                                                                                                                                                                                                                          
                                | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
**Exceptions**                  |                                                                                                                                                                                                                                          
`Couchbase::Error::Connect`     | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists`   | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::ValueFormat` | Exception object indicating the value cannot be serialized with chosen encoder, e.g. if you try to store the Hash in :plain mode.                                                                                                        

Examples of using set as follows:


```
#Store a key/value which expires in 2 seconds using relative TTL

c.set("foo", "bar", :ttl => 2)


#Store the key that expires in 2 seconds using absolute TTL

c.set("foo", "bar", :ttl => Time.now.to_i + 2)

#Apply JSON document format for value at set

c.set("foo", {"bar" => "baz}, :format => :document)

#Use index and value as hash syntax to store value during set

c.set["foo"] = {"bar" => "baz}

#Use extended hash syntax to store a value at set

c["foo", {:flags => 0x1000, :format => :plain}] = "bar"

c["foo", :flags => 0x1000] = "bar"  # for ruby 1.9.x only

#Set application specific flags (note that it will be OR-ed with format flags)

c.set("foo", "bar", :flags => 0x1000)

#Perform optimistic locking by specifying last known CAS version

c.set("foo", "bar", :cas => 8835713818674332672)

#Perform asynchronous call

c.run do
      c.set("foo", "bar") do |ret|
            ret.operation   #=> :set
            ret.success?    #=> true
            ret.key         #=> "foo"
            ret.cas
      end
end
```

<a id="couchbase-sdk-ruby-set-flush"></a>

## Flush Operation

The `flush` operation deletes all values in a Couchbase bucket.

<a id="table-couchbase-sdk_ruby_flush"></a>

**API Call**     | `object.flush()`                                
-----------------|-------------------------------------------------
**Asynchronous** | no                                              
**Description**  | Deletes all values from the corresponding bucket
**Returns**      | `Boolean` ( Boolean (true/false) )              
**Arguments**    |                                                 
                 | None                                            

This operation is deprecated as of the 1.8.1 Couchbase Server, to prevent
accidental, detrimental data loss. Use of this operation should be done only
with extreme caution, and most likely only for test databases as it will delete,
item by item, every persisted record as well as destroy all cached data.

Third-party client testing tools may perform a `flush` operation as part of
their test scripts. Be aware of the scripts run by your testing tools and avoid
triggering these test cases/operations unless you are certain they are being
performed on your sample/test database.

Inadvertent use of `flush` on production databases, or other data stores you
intend to use will result in permanent loss of data. Moreover the operation as
applied to a large data store will take many hours to remove persisted records.


```
couchbase.flush
```

<a id="couchbase-sdk-ruby-retrieve"></a>
