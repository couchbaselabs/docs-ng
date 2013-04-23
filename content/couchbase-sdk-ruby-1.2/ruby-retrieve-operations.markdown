# Ruby — Retrieve Operations

### Note

The following document is still in production, and is not considered complete or
exhaustive.

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

**Unhandled thing here**
<a id="table-couchbase-sdk_ruby_get"></a>

**API Call**                      | `object.get(keyn [, ruby-get-options ] [, ruby-get-keys ])`                                                                                                                                               
----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Asynchronous**                  | no                                                                                                                                                                                                        
**Description**                   | Get one or more key values                                                                                                                                                                                
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
**hash ruby-get-options**         | Hash of options containing key/value pairs                                                                                                                                                                
                                  | **Structure definition:**                                                                                                                                                                                 
                                  | `:extended` (boolean)                                                                                                                                                                                     
                                  | Default is false. If set to true, returns ordered with pairs. Pairs follow this convention: key => value, flags, cas. If you are getting one key, returns an array. More than one pair returned as a hash.
                                  | `:ttl` (int)                                                                                                                                                                                              
                                  | Time for document to exist in server before it is automatically destroyed. This option symbol is :ttl and the value can be any number representing seconds.                                               
                                  | `:quiet` (boolean)                                                                                                                                                                                        
                                  | Suppresses errors while in synchronous mode. Default is true. If set to true, will return nil, and raise no error. In asynchronous mode, this option ignored.                                             
                                  | `:format` (symbol)                                                                                                                                                                                        
                                  | Determines how a value is represented. Default is nil. Explicitly choose the decoder for this option (:plain, :document, :marshal).                                                                       
**hash ruby-get-keys**            | Hash of options containing key/value pairs                                                                                                                                                                
                                  | **Structure definition:**                                                                                                                                                                                 
                                  | `key` (string)                                                                                                                                                                                            
                                  | Key as string.                                                                                                                                                                                            
                                  | `keys` (strings)                                                                                                                                                                                          
                                  | Comma-separated strings for each key, e.g. client.get( "foo", "bar")                                                                                                                                      
                                  | `symbol` (symbol)                                                                                                                                                                                         
                                  | Symbol for each key to be retrieved, e.g. :foo.                                                                                                                                                           
                                  | `hash` (hash)                                                                                                                                                                                             
                                  | Key-expiration pairs provided in a hash-map, e.g.  c.get("foo" => 10, "bar" => 20). Returns has of key-values for given keys.                                                                             
**Exceptions**                    |                                                                                                                                                                                                           
`ArgumentError`                   | Exception object indicating failed attempt to pass a block in synchronous mode.                                                                                                                           
`Couchbase::Error::Connect`       | Exception object specifying failure to connect to a node.                                                                                                                                                 
`Couchbase::Error::NotFound`      | Exception object specifying a given key cannot be found in datastore.                                                                                                                                     

The `get` method obtains an object stored in Couchbase using the default
transcoder for serialization of the object.

For example:


```
object = couchbase.get("someKey");
```

In this case, `couchbase` is the Couchbase client instance which stores a
connection to the server. Transcoding of the object assumes the default
transcoder was used when the value was stored. The returned object can be of any
type.

If the request key does no existing in the database then the returned value is
null.

The following show variations for using a `get` with different parameters and
settings:


```
#get single value; returns value or nil

c.get("foo")

#doing a get with hash-like syntax

c["foo"]

#get single value in verbose error mode setting
#returns ruby error if :quiet => false
#returns nil if :quiet => true

c.get("missing-foo", :quiet => false)
c.get("missing-foo", :quiet => true)

#get and update expiration time for single value

c.get("foo", :ttl => 10)

#get multiple keys

c.get("foo", "bar", "baz")

#perform an extended get, which returns ordered list of elements
#returns value, flags and cas and assigned to respective variable

val, flags, cas = c.get("foo", :extended => true)

#returns {"foo" => [val1, flags1, cas1], "bar" => [val2, flags2, cas2]}

c.get("foo", "bar", :extended => true)

#perform an asynchronous get

c.run do
    c.get("foo", "bar", "baz") do |ret|
      ret.operation   #=> :get
      ret.success?    #=> true
      ret.key         #=> "foo", "bar" or "baz" in separate calls
      ret.value
      ret.flags
      ret.cas
    end
end
```

<a id="couchbase-sdk-ruby-update"></a>
