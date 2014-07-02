# Configuring the .NET Client Library

The following sections provide details on the App|Web.config configuration
options for the .NET Client Library

The `CouchbaseClientSection` class is the configuration section handler.


```
<section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
```

The minimum configuration options are to include a `couchbase` section with a
`servers` element with at least one URI, which is used to bootstrap the client.
At least two node URIs should be provided, so that in the event that the client
can't reach the first, it will try the second.

 * `bucket` (default) The bucket against which the client instance will perform
   operations

 * `bucketPassword` The password for authenticated buckets.

 * `username` The username used to secure a cluster.

 * `password` The password associated with the cluster username

 * `retryCount` The number of times to retry a failed attempt to read cluster
   config

 * `retryTimeout` (00:00:02) The amount of time to wait in between failed attempts
   to read cluster config

 * `observeTimeout` (00:01:00) The amount of time to wait for persistence or
   replication checks when using `ExecuteStore` or `ExecuteRemove` with durability
   requirements

 * `httpRequestTimeout` (00:01:00) The amount of time to wait for the HTTP
   streaming connection to receive cluster configuration


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
    <servers bucket="default" bucketPassword="H0p$">
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```

The client may also be configured in code.


```
var config = new CouchbaseClientConfiguration();
config.Urls.Add(new Uri("http://localhost:8091/pools/"));
config.Bucket = "default";

var client = new CouchbaseClient(config);
```

The `socketPool` element is used to configure the behavior of the client as it
connects to the Couchbase cluster. Defaults are in parentheses.

 * `minPoolSize` (10) The minimum number of connections in the connection pool

 * `maxPoolSize` (20) The maximum number of connections in the connection pool

 * `connectionTimeout` (00:00:10) The amount of time the client is waiting to a)
   eastablish a connection to the memcached server, b) get a free connection from
   the pool. If it times out the operation will fail. (And return false or null,
   depending on the operation.)

 * `deadTimeout` (00:00:10) When all pool urls are unavailable the client will
   check the first one again after `deadTimeout` time elapses. Additionally, the
   client has a basic dead node detection mechanism which will also use this
   timeout to reconnect servers which went offline.

 * `queueTimeout` (00:00:02.500) This is the time that a worker thread will wait for
    a connection to become available when the connection pool is empty. This would
    happen in a high-throughput scenario or if the operations take longer than expected.
    The default is 2500 msec.

 * `receiveTimeout` (00:00:10) This amount of time that the client will wait on a
    connection during a read. The default is 10 seconds.




```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <socketPool minPoolSize="10" maxPoolSize="20" />
</couchbase>
```

The client will periodically check the health of its connection to the cluster
by performing a heartbeat check. By default, this test is done every 10 seconds
against the bootstrap URI defined in the `servers` element.

 * `uri` (defaults to first server Uri from `servers` element) The Uri used for the
   heartbeat check

 * `interval` (10000ms) Frequency with which heartbeat check executes

 * `enabled` (true) Enables or disables heartbeat check.




```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <heartbeatMonitor uri="http://127.0.0.1:8091/pools/heartbeat" interval="60000" enabled="true" />
</couchbase>
```

When executing view queries, the client will make requests over HTTP. That
connection may be managed using the `httpClient` element.

 * `initializeConnection` (true) When true, the `ServicePointManager` is
   initialized asynchronously on client creation rather than on the first view
   request

 * `timeout` (00:01:15) How long to wait for a view request before timing out


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <httpClient initializeConnection="false" timeout="00:00:45"/>
</couchbase>
```

When executing view queries, HTTP requests are made by IHttpClient instances
which are created by factories. The factory is defined in the
`httpClientFactory` element.

 * `type` (Couchbase.RestSharpHttpClientFactory, Couchbase) The fully qualified
   type name of an `IHttpClientFactory` implementation,
   `RestSharpHttpClientFactory` is the default. `HammockHttpClientFactory` is also
   supported, but has known issues.


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <httpClientFactory type="Couchbase.RestSharpHttpClientFactory, Couchbase" />
</couchbase>
```

When executing view queries, the design document is toggled between dev mode
(prefixed by dev\_) and production mode by setting the `documentNameTransformer`
element.

 * `type` (Couchbase.Configuration.ProductionModeNameTransformer, Couchbase) The
   fully qualified type name of an `INameTransformer` implementation


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <documentNameTransformer type="Couchbase.Configuration.ProductionModeNameTransformer, Couchbase" />
</couchbase>
```

The `keyTransformer` is used to normalize/validate the item keys before sending
them to the server.

 * `type` (Enyim.Caching.Memcached.DefaultKeyTransformer) must be the fully
   qualified name of a type implementing `IMemcachedKeyTransformer`

 * `factory` must be the fully qualified name of a type implementing
   `IProviderFactory<IMemcachedKeyTransformer>`


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <keyTransformer type="Enyim.Caching.Memcached.DefaultKeyTransformer, Enyim.Caching" />
</couchbase>
```

The `transcoder` is used to serialize stored/retrieved objects.

 * `type` (Enyim.Caching.Memcached.DefaultKeyTransformer) must be the fully
   qualified name of a Type implementing `ITranscoder`

 * `factory` must be the fully qualified name of a type implementing
   `IProviderFactory<ITranscoder>`


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <keyTransformer type="Enyim.Caching.Memcached.DefaultTranscoder, Enyim.Caching" />
</couchbase>
```

The `transcoder` is used to map objects to servers in the pool.

 * `type` (Enyim.Caching.Memcached.DefaultKeyTransformer) must be the fully
   qualified name of a type implementing `IMemcachedNodeLocator`

 * `factory` must be the fully qualified name of a type implementing
   `IProviderFactory<IMemcachedNodeLocator>`


```
<couchbase>
    <servers>
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
    <keyTransformer type="Enyim.Caching.Memcached.DefaultNodeLocator, Enyim.Caching" />
</couchbase>
```

It is not possible to configure (in app|web.config) a single instance of a
CouchbaseClient to work with multiple buckets. Though it is possible to
programmatically reconstruct a client to work with multiple buckets, it is not
recommended. The process of creating a client is expensive (relative to other
Couchbase operations) and should ideally be done once per app domain.

It is possible however to set multiple config sections in app|web.config to
allow for multiple client instances to be created, while still maintaining
bucket affinity.


```
<?xml version="1.0"?>
<configuration>
  <configSections>
    <sectionGroup name="couchbase">
      <section name="bucket-a" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
      <section name="bucket-b" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
    </sectionGroup>
  </configSections>

  <couchbase>
    <bucket-a>
      <servers bucket="default">
        <add uri="http://127.0.0.1:8091/pools" />
      </servers>
    </bucket-a>
    <bucket-b>
      <servers bucket="beernique" bucketPassword="b33rs">
        <add uri="http://127.0.0.1:8091/pools" />
      </servers>
    </bucket-b>
  </couchbase>

  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0"/>
  </startup>
</configuration>
```

After defining the config sections, bucket specific clients are created by
reading the appropriate config sections and passing the config section reference
to the constructor of the CouchbaseClient. Again, constructing the client should
not be done per operation, but rather per app domain.


```
var bucketASection = (CouchbaseClientSection)ConfigurationManager.GetSection("couchbase/bucket-a");
var bucketBSection = (CouchbaseClientSection)ConfigurationManager.GetSection("couchbase/bucket-b");

var clientA = new CouchbaseClient(bucketASection);
var clientB = new CouchbaseClient(bucketBSection);

clientA.ExecuteStore(StoreMode.Set, "fooA", "barA");
var itemA = clientA.Get<string>("fooA");
Console.WriteLine(itemA);

clientB.ExecuteStore(StoreMode.Set, "fooB", "barB");
var itemB = clientB.Get<string>("fooB");
Console.WriteLine(itemB);
```

<a id="couchbase-sdk-net-logging"></a>
