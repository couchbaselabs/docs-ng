# Statistics Operations

The Couchbase Java Client Library includes support for obtaining statistic
information from all of the servers defined within a `CouchbaseClient` object. A
summary of the commands is provided below.

<a id="table-couchbase-sdk_java_getstats"></a>

**API Call**     | `client.getStats()`        
-----------------|----------------------------
**Asynchronous** | no                         
**Description**  | Get the database statistics
**Returns**      | `Object` ( Binary object ) 
**Arguments**    |                            
                 | None                       

The first form of the `getStats()` command gets the statistics from all of the
servers configured in your `CouchbaseClient` object. The information is returned
in the form of a nested Map, first containing the address of configured server,
and then within each server the individual statistics for that server.

<a id="table-couchbase-sdk_java_getstats-name"></a>

**API Call**        | `client.getStats(statname)`                                       
--------------------|-------------------------------------------------------------------
**Asynchronous**    | no                                                                
**Description**     | Get the database statistics                                       
**Returns**         | `Object` ( Binary object )                                        
**Arguments**       |                                                                   
**String statname** | Group name of a statistic for selecting individual statistic value

The second form of the `getStats()` command gets the specified group of
statistics from all of the servers configured in your CouchbaseClient object.
The information is returned in the form of a nested Map, first containing the
address of configured server, and then within each server the individual
statistics for that server.

<a id="api-reference-troubleshooting"></a>
