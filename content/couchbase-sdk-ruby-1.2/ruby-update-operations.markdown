# Ruby — Update Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

**Unhandled thing here**
<a id="couchbase-sdk-ruby-update-append"></a>

## Append Methods

The `append` methods allow you to add information to an existing key/value pair
in the database. You can use this to add information to a string or other data
after the existing data.

The `append` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding an `Array` of integers into the database, and then
using `append` to add another integer will result in the key referring to a
serialized version of the array, immediately followed by a serialized version of
the integer. It will not contain an updated array with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

<a id="table-couchbase-sdk_ruby_append"></a>

**API Call**                  | `object.append(key, value [, ruby-append-options ])`                                                                                                                                                                                     
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                       
**Description**               | Append a value to an existing key                                                                                                                                                                                                        
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Document ID used to identify the value                                                                                                                                                                                                   
**object value**              | Value to be stored                                                                                                                                                                                                                       
**hash ruby-append-options**  | Hash of options containing key/value pairs                                                                                                                                                                                               
                              | **Structure definition:**                                                                                                                                                                                                                
                              | `:cas` (fixnum)                                                                                                                                                                                                                          
                              | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
                              | `:format` (symbol)                                                                                                                                                                                                                       
                              | Determines how a value is represented in storage. Possible values include :plain for string storage.                                                                                                                                     
**Exceptions**                |                                                                                                                                                                                                                                          
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists` | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::NotStored` | Exception object indicating the key/value does not exist in the database.                                                                                                                                                                

The `append` appends information to the end of an existing key/value pair. The
`append` function requires a CAS value. For more information on CAS values, see
[Ruby — Retrieve
Operations](couchbase-sdk-ruby-ready.html#couchbase-sdk-ruby-retrieve).

For example, to append a string to an existing key:


```
#sets foo key to text 'Hello'

couchbase.set("foo", "Hello")

#adds text to end of key foo, resulting in 'Hello, world!'

couchbase.append("foo", ", world!")

#gets foo
couchbase.get("foo")
#=> "Hello, world!"
```

Other examples of using `append` are as follows:


```
#Perform a simple append

c.set("foo", "aaa")
c.append("foo", "bbb")
c.get("foo")           # returns "aaabbb"

#Perform optimistic locking. The operations fails if the
#given CAS does not match the CAS for the key

ver = c.set("foo", "aaa")
c.append("foo", "bbb", :cas => ver)


#Creates custom data groups/sets using append
#appends minus to indicate item not part of set
#appends plus to indicate item is part of set

def set_add(key, *values)
    encoded = values.flatten.map{|v| "+#{v} "}.join
    append(key, encoded)
end

def set_remove(key, *values)
    encoded = values.flatten.map{|v| "-#{v} "}.join
    append(key, encoded)
end

def set_get(key)
    encoded = get(key)
    ret = Set.new

    encoded.split(' ').each do |v|
          op, val = v[0], v[1..-1]
          case op
                when "-"
                    ret.delete(val)
                when "+"
                    ret.add(val)
          end
    end
    ret
end
```

<a id="couchbase-sdk-ruby-cas"></a>

## Compare and Swap

Takes a given key, gets the value for the key, and yields it to a block.
Replaces the value in the datastore with the result of the block as long as the
key has not been updated in the meantime. If the the key has been successfully
updated in the datastore, a new CAS value will be returned raises
Error::KeyExists.

CAS stands for "compare and swap", and avoids the need for manual key mutexing.

<a id="table-couchbase-sdk_ruby_cas"></a>

**API Call**                  | `object.cas(key [, ruby-cas-options ])`                                                                                                                                                                             
------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | yes                                                                                                                                                                                                                 
**Description**               | Compare and set a value providing the supplied CAS key matches                                                                                                                                                      
**Returns**                   | ( Check and set object )                                                                                                                                                                                            
**Arguments**                 |                                                                                                                                                                                                                     
**string key**                | Document ID used to identify the value                                                                                                                                                                              
**hash ruby-cas-options**     | Hash of options containing key/value pairs                                                                                                                                                                          
                              | **Structure definition:**                                                                                                                                                                                           
                              | `:ttl` (int)                                                                                                                                                                                                        
                              | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                         
                              | `:format` (symbol)                                                                                                                                                                                                  
                              | Determines how a value is represented in storage. Possible values include :document for JSON data, :plain for string storage, and :marshal to serialize your ruby object using Marshall.dump and Marshal.load.      
                              | `:flags` (fixnum)                                                                                                                                                                                                   
                              | Flags used during the commit. These flags are ignored by the Couchbase server but preserved for use by a client. This includes default flags recorded for new values and was used as part of the memcached protocol.
**Exceptions**                |                                                                                                                                                                                                                     
`Couchbase::Error::KeyExists` | Exception object indicateing the key was updated before the codeblock has completed and therefore the CAS value had changed.                                                                                        

The following illustrates use of the `cas` function:


```
#appends to a JSON-encoded value
# first sets value and formatting for stored value
        c.default_format = :document
        c.set("foo", {"bar" => 1})

#perform cas and provide value to block
        c.cas("foo") do |val|
              val["baz"] = 2
              val
        end

# returns {"bar" => 1, "baz" => 2}
        c.get("foo")
```

<a id="couchbase-sdk-ruby-update-decr"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Ruby Client Library methods support the use of an explicit
offset value that will be used to reduce the stored value in the database.

<a id="table-couchbase-sdk_ruby_decrement"></a>

**API Call**                    | `object.decrement(key [, offset ] [, ruby-incr-decr-options ])`                                                                                                                                                                     
--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                  
**Description**                 | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.                                                                          
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                  
**Arguments**                   |                                                                                                                                                                                                                                     
**string key**                  | Document ID used to identify the value                                                                                                                                                                                              
**offset**                      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                             
**hash ruby-incr-decr-options** | Hash of options containing key/value pairs                                                                                                                                                                                          
                                | **Structure definition:**                                                                                                                                                                                                           
                                | `:create` (boolean)                                                                                                                                                                                                                 
                                | Default is false. If set to true, it will initialize the key with zero value and zero flags (use :initial option to set another initial value). Note: this will not increment or decrement the missing value once it is initialized.
                                | `:initial` (fixnum)                                                                                                                                                                                                                 
                                | Default is 0. Can be an integer (up to 64 bits) for missing key initialization. This option automatically implies the :create option is true, regardless of the setting.                                                            
                                | `:ttl` (int)                                                                                                                                                                                                                        
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                         
                                | `:extended` (boolean)                                                                                                                                                                                                               
                                | Default is false. If set to true, the operation will return an array, \[value, cas\], otherwise it returns just the value.                                                                                                          

The first form of the `decr` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


```
couchbase.set("counter", 10)
couchbase.decr("counter", 5)
couchbase.get("counter") #returns 5
```

The following demonstrates different options available when using decrement:


```
#decrement key by one (default)

c.decr("foo")

#decrement by 50

c.decr("foo", 50)

#decrement key or initialize with zero

c.decr("foo", :create => true)

#decrement key or initialize with 3

c.decr("foo", 50, :initial => 3)

#decrement key and get CAS value

val, cas = c.decr("foo", :extended => true)

#decrementing signed number

c.set("foo", -100)
c.decrement("foo", 100500)   #=> 0

#decrementing zero
c.set("foo", 0)
c.decrement("foo", 100500)   #=> 0

#asynchronous use of decrement
c.run do
      c.decr("foo") do |ret|
            ret.operation   #=> :decrement
            ret.success?    #=> true
            ret.key         #=> "foo"
            ret.value
            ret.cas
      end
end
```

<a id="couchbase-sdk-ruby-update-delete"></a>

## Delete Methods

The `delete` method deletes an item in the database with the specified key.
Delete operations are synchronous only.

<a id="table-couchbase-sdk_ruby_delete"></a>

**API Call**                  | `object.delete(key [, ruby-delete-options ])`                                                                                                                                                                                                                                
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                                                           
**Description**               | Delete a key/value                                                                                                                                                                                                                                                           
**Returns**                   | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                                                                           
**Arguments**                 |                                                                                                                                                                                                                                                                              
**string key**                | Document ID used to identify the value                                                                                                                                                                                                                                       
**hash ruby-delete-options**  | Hash of options containing key/value pairs                                                                                                                                                                                                                                   
                              | **Structure definition:**                                                                                                                                                                                                                                                    
                              | `:quiet` (boolean)                                                                                                                                                                                                                                                           
                              | If set to true, the operation returns nil for failure. Otherwise it will raise error in synchronous mode. In asynchronous mode this option ignored.                                                                                                                          
                              | `:cas` (fixnum)                                                                                                                                                                                                                                                              
                              | The CAS value for an object. This value created on the server and is guaranteed to be unique for each value of a given key. This value is used to provide simple optimistic concurrency control when multiple clients or threads try to update/delete an item simultaneously.
**Exceptions**                |                                                                                                                                                                                                                                                                              
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                                                              
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                                                    
`Couchbase::Error::KeyExists` | Exception object indicating mismatch of given cas and cas for record.                                                                                                                                                                                                        
`Couchbase::Error::NotFound`  | Exception object indicating key is missing. Occurs in verbose mode.                                                                                                                                                                                                          

For example, to delete an item you might use code similar to the following:


```
couchbase.delete("foo")
```

The following illustrates use of delete in Ruby along with various parameters
and settings:


```
#set and delete for key 'foo' in default mode

c.set("foo", "bar")
c.delete("foo")        #=> true

#attempt second delete in default mode

c.delete("foo")        #=> false

#attempt to delete a key with quiet mode and then verbose

c.set("foo", "bar")
c.delete("foo", :quiet => false)   #=> true
c.delete("foo", :quiet => true)    #=> nil (default behaviour)
c.delete("foo", :quiet => false)   #=> will raise Couchbase::Error::NotFound

#attempt to delete with version check using cas value

ver = c.set("foo", "bar")          #=> 5992859822302167040
c.delete("foo", :cas => 123456)    #=> will raise Couchbase::Error::KeyExists
c.delete("foo", :cas => ver)       #=> true
```

<a id="couchbase-sdk-ruby-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_ruby_increment"></a>

**API Call**                    | `object.increment(key [, offset ] [, ruby-incr-decr-options ])`                                                                                                                                                                                                                                                                           
--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                | no                                                                                                                                                                                                                                                                                                                                        
**Description**                 | Increment the value of an existing numeric key. Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**                     | `fixnum` ( Value for a given key. A fixed number )                                                                                                                                                                                                                                                                                        
**Arguments**                   |                                                                                                                                                                                                                                                                                                                                           
**string key**                  | Document ID used to identify the value                                                                                                                                                                                                                                                                                                    
**offset**                      | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                   
**hash ruby-incr-decr-options** | Hash of options containing key/value pairs                                                                                                                                                                                                                                                                                                
                                | **Structure definition:**                                                                                                                                                                                                                                                                                                                 
                                | `:create` (boolean)                                                                                                                                                                                                                                                                                                                       
                                | Default is false. If set to true, it will initialize the key with zero value and zero flags (use :initial option to set another initial value). Note: this will not increment or decrement the missing value once it is initialized.                                                                                                      
                                | `:initial` (fixnum)                                                                                                                                                                                                                                                                                                                       
                                | Default is 0. Can be an integer (up to 64 bits) for missing key initialization. This option automatically implies the :create option is true, regardless of the setting.                                                                                                                                                                  
                                | `:ttl` (int)                                                                                                                                                                                                                                                                                                                              
                                | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                                                                                                                                                               
                                | `:extended` (boolean)                                                                                                                                                                                                                                                                                                                     
                                | Default is false. If set to true, the operation will return an array, \[value, cas\], otherwise it returns just the value.                                                                                                                                                                                                                

The first form of the `incr` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


```
couchbase.set("counter", 10)
couchbase.incr("counter", 5)
couchbase.get("counter") #=> 15
```

The second form of the `incr` method supports the use of a default value which
will be used to set the corresponding key if that value does already exist in
the database. If the key exists, the default value is ignored and the value is
incremented with the provided offset value. This can be used in situations where
you are recording a counter value but do not know whether the key exists at the
point of storage.

For example, if the key `counter` does not exist, the following fragment will
return 1000:


```
counter = couchbase.incr("counter", 1, :initial => 1000); #=> 1000
```

The following demonstrates different options available when using increment and
the output they produce:


```
#increment key by one (default)

c.incr("foo")

#increment by 50

c.incr("foo", 50)

#increment key or initialize with zero

c.incr("foo", :create => true)

#increment key or initialize with 3

c.incr("foo", 50, :initial => 3)

#increment key and get CAS value

val, cas = c.incr("foo", :extended => true)

#integer overflow from incrementing signed number

c.set("foo", -100)
c.get("foo")           #=> -100
c.incr("foo")          #=> 18446744073709551517

#asynchronous use of increment

c.run do
    c.incr("foo") do |ret|
          ret.operation   #=> :increment
          ret.success?    #=> true
          ret.key         #=> "foo"
          ret.value
          ret.cas
    end
end
```

<a id="couchbase-sdk-ruby-update-prepend"></a>

## Prepend Methods

The `prepend` methods insert information before the existing data for a given
key. Note that as with the `append` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend`.

<a id="table-couchbase-sdk_ruby_prepend"></a>

**API Call**                  | `object.prepend(key, value [, ruby-prepend-options ])`                                                                                                                                                                                   
------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**              | no                                                                                                                                                                                                                                       
**Description**               | Prepend a value to an existing key                                                                                                                                                                                                       
**Returns**                   | `fixnum` ( The CAS value for the object stored. A fixed number )                                                                                                                                                                         
**Arguments**                 |                                                                                                                                                                                                                                          
**string key**                | Document ID used to identify the value                                                                                                                                                                                                   
**object value**              | Value to be stored                                                                                                                                                                                                                       
**hash ruby-prepend-options** | Hash of options containing key/value pairs                                                                                                                                                                                               
                              | **Structure definition:**                                                                                                                                                                                                                
                              | `:cas` (fixnum)                                                                                                                                                                                                                          
                              | The CAS value for an object. This value was created on the server and is guaranteed to be unique for each value for a given key. You provide this value as an option when you want basic optimistic concurrency control while doing sets.
                              | `:format` (symbol)                                                                                                                                                                                                                       
                              | Determines how a value is represented in storage. Possible values include :plain for string storage.                                                                                                                                     
**Exceptions**                |                                                                                                                                                                                                                                          
`ArgumentError`               | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                                                          
`Couchbase::Error::Connect`   | Exception object specifying failure to connect to a node.                                                                                                                                                                                
`Couchbase::Error::KeyExists` | Exception object indicating the key already exists on the server.                                                                                                                                                                        
`Couchbase::Error::NotStored` | Exception object indicating the key/value does not exist in the database.                                                                                                                                                                

For example, to prepend a string to an existing key:


```
#set inital key, foo

couchbase.set("foo", "world!")

#prepend text 'Hello, ' to foo

couchbase.prepend("foo", "Hello, ")

#get new foo value

couchbase.get("foo") #=> "Hello, world!"
```

Other examples of using `prepend` are as follows:


```
#simple prepend example

c.set("foo", "aaa")
c.prepend("foo", "bbb")
c.get("foo")           #=> "bbbaaa"

#Perform optimistic locking. The operations fails if the
#given CAS does not match the CAS for the key

ver = c.set("foo", "aaa")
c.prepend("foo", "bbb", :cas => ver)


#Use explicit format options

c.default_format       #=>defaults to :document, or JSON document
c.set("foo", {"y" => "z"})

#sets added text to plain data and adds
c.prepend("foo", '[', :format => :plain)
c.append("foo", ', {"z": "y"}]', :format => :plain)

#get updated value
c.get("foo")           #=> [{"y"=>"z"}, {"z"=>"y"}]
```

<a id="couchbase-sdk-ruby-update-touch"></a>

## Touch Methods

The `touch` methods allow you to update the expiration time on a given key. This
can be useful for situations where you want to prevent an item from expiring
without resetting the associated value. For example, for a session database you
might want to keep the session alive in the database each time the user accesses
a web page without explicitly updating the session value, keeping the user's
session active and available.

In Ruby, `touch` can be used to update or more keys.

<a id="table-couchbase-sdk_ruby_touch-one"></a>

**API Call**                | `object.touch-one(key [, ruby-touch-options ] [, ruby-touch-keys ])`                                                                                                                                                             
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**            | no                                                                                                                                                                                                                               
**Description**             | Update the expiry time of an item                                                                                                                                                                                                
**Returns**                 | `Boolean` ( Boolean (true/false) )                                                                                                                                                                                               
**Arguments**               |                                                                                                                                                                                                                                  
**string key**              | Document ID used to identify the value                                                                                                                                                                                           
**hash ruby-touch-options** | Hash of options containing key/value pairs                                                                                                                                                                                       
                            | **Structure definition:**                                                                                                                                                                                                        
                            | `:ttl` (fixnum)                                                                                                                                                                                                                  
                            | Expiration time for record. Default is indefinite, meaning the record will remain until an explicit delete command is made. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times from the epoch.
**hash ruby-touch-keys**    | Hash of options containing key/value pairs                                                                                                                                                                                       

The following examples demonstrate use of `touch` with a single key:


```
#update record so no expiration (record held indefinitely long)

c.touch("foo")

#update expiration to 10 seconds

c.touch("foo", :ttl => 10)

#alternate syntax for updating single value

c.touch("foo" => 10)
```

<a id="table-couchbase-sdk_ruby_touch-many"></a>

**API Call**                      | `object.touch-many(keyn)`                                                                                                    
----------------------------------|------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                           
**Description**                   | Update the expiry time of an item                                                                                            
**Returns**                       | `hash` ( Container with key/value pairs )                                                                                    
**Arguments**                     |                                                                                                                              
**String/Symbol/Array/Hash keyn** | One or more keys used to reference a value                                                                                   
                                  | **Structure definition:**                                                                                                    
                                  | `key` (string)                                                                                                               
                                  | Key as string.                                                                                                               
                                  | `keys` (strings)                                                                                                             
                                  | Comma-separated strings for each key, e.g. client.get( "foo", "bar")                                                         
                                  | `symbol` (symbol)                                                                                                            
                                  | Symbol for each key to be retrieved, e.g. :foo.                                                                              
                                  | `hash` (hash)                                                                                                                
                                  | Key-expiration pairs provided in a hash-map, e.g.  c.get("foo" => 10, "bar" => 20). Returns has of key-values for given keys.

The following examples demonstrate use of `touch` with multiple keys, which are
provided as a hash:


```
#update two records with 10 and 20 second expirations
#returns hash with key and success/fail
#{"foo" => true, "bar" => true}

c.touch("foo" => 10, :bar => 20)

#Update several values in asynchronous mode
c.run do
      c.touch("foo" => 10, :bar => 20) do |ret|
          ret.operation   #=> :touch
          ret.success?    #=> true
          ret.key         #=> "foo" and "bar" in separate calls
      end
end
```

<a id="couchbase-sdk-ruby-stats"></a>
