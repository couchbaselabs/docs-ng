# Ruby — Statistics Operations

The Couchbase Ruby Client Library includes support for obtaining statistic
information from all of the servers defined within a couchbase object. A summary
of the commands is provided below.

**Unhandled thing here**

```
couchbase.stats
#=> {...}
```

The `stats` command gets the statistics from all of the configured nodes. The
information is returned in the form of a nested Hash, first containing the
address of the configured server and then within each server the individual
statistics for that server as key value pairs.


```
{
    "172.16.16.76:12008"=>
    {
        "threads"=>"4",
        "connection_structures"=>"22",
        "ep_max_txn_size"=>"10000",
          ...
    },
    "172.16.16.76:12000"=>
    {
        "threads"=>"4",
        "connection_structures"=>"447",
        "ep_max_txn_size"=>"10000",
          ...
    },
    ...
}
```

<a id="table-couchbase-sdk_ruby_stats"></a>

**API Call**     | `object.stats([ statname ])`                                      
-----------------|-------------------------------------------------------------------
**Asynchronous** | no                                                                
**Description**  | Get the database statistics                                       
**Returns**      | `object` ( Binary object )                                        
**Arguments**    |                                                                   
**statname**     | Group name of a statistic for selecting individual statistic value

<a id="couchbase-sdk-ruby-troubleshooting"></a>
