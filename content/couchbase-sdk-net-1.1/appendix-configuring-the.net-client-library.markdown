# Appendix: Configuring the.NET CLient Library

The following sections provide details on the App|Web.config configuration
options for the.NET Client Library

The `CouchbaseClientSection` class is the configuration section handler.


```
<section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
```

The minimum configuration options are to include a `couchbase` section with a
`servers` element with at least one URI, which is used to bootstrap the client.
At least two node URIs should be provided, so that in the event that the client
can't reach the first, it will try the second.


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

The "bucket" and "bucketPassword" attributes of the `servers` element default to
"default" and an empty string respectively.


```
<couchbase>
    <servers bucket="beers" bucketPassword="H0p$">
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

The client will periodically check the health of its connection to the cluster
by performing a heartbeat check. By default, this test is done every 10 seconds
against the bootstrap URI defined in the `servers` element.

The "uri", "enabled" and "interval" attributes are all optional. The "interval"
is specified in milliseconds. Setting "enabled" to false will cause other
settings to be ignored and the heartbeat will not be checked.


```
<heartbeatMonitor uri="http://127.0.0.1:8091/pools/heartbeat" interval="60000" enabled="true" />
```

<a id="couchbase-sdk-net-rn"></a>
