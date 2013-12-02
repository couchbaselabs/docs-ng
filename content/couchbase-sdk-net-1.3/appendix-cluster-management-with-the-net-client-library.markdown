# Appendix: Cluster Management with the .NET Client Library

The following sections provide details about using the Couchbase .NET Client to
manage buckets and design documents.

Cluster management is performed by using methods of the `CouchbaseCluster`
class, which implements the `ICouchbaseCluster` interface, both of which are in
the `Couchbase.Management` namespace.


```
using Couchbase.Management;
```

The `CouchbaseCluster` is configured using the same config definitions (code or
XML) used to create instances of a `CouchbaseClient`. When managing the cluster
with the .NET client, the cluster username and password must be provided.


```
<couchbase>
    <servers username="Administrator" password="qwerty" >
      <add uri="http://127.0.0.1:8091/pools"/>
    </servers>
</couchbase>
```



The default constructor for `CouchbaseCluster` looks for a section named
"couchbase". It is possible to use a named section, as follows:


```
var config = ConfigurationManager.GetSection("anothersection") as CouchbaseClientSection;
var cluster = new CouchbaseCluster(_config);
```

To configure `CouchbaseCluster` in code, pass an instance of an
`ICouchbaseClientConfiguration` to the constructor.


```
var config = new CouchbaseClientConfiguration();
config.Urls.Add(new Uri("http://localhost:8091/pools/"));
config.Username = "Administrator";
config.Password = "qwerty";

var cluster = new CouchbaseCluster(config);
```

 * To get a list of buckets from the server, there are two methods. `Bucket[]
   ListBuckets()` returns an array of Bucket instances, one for each bucket in the
   cluster

 * `bool TryListBuckets(out Bucket[] buckets)` returns true when no errors and
   provides the list of buckets as an out param. When errors occur, returns false
   and a null buckets array

 * To get a single of bucket from the server, there are two methods. `Bucket
   GetBucket(string bucketName)` returns a Bucket instance for a bucket with the
   given name

 * `bool TryGetBucket(string bucketName, out Bucket bucket)` returns true when no
   errors and provides the named bucket as an out param. When errors occur, returns
   false and a null bucket

 * To get the count of items in a bucket, or across buckets use the following
   methods: `long GetItemCount(string bucketName)` returns the count of items in a
   bucket with the given name

 * `long GetItemCount()` returns the count of items in all buckets in a cluster

 * To get the count of items in a bucket, or across buckets use the following
   methods: `long GetItemCount(string bucketName)` returns the count of items in a
   bucket with the given name

 * `long GetItemCount()` returns the count of items in all buckets in a cluster

 * To manage the buckets in a cluster, there are three methods. `void
   CreateBucket(Bucket bucket)` create a bucket with the given bucket properties

    ```
    //create an authenticated Couchbase bucket
    cluster.CreateBucket(
        new Bucket
            {
                Name = "newBucket",
                AuthType = AuthTypes.Sasl,
                BucketType = BucketTypes.Membase,
                Quota = new Quota { RAM = 100 },
                ReplicaNumber = ReplicaNumbers.Zero
            }
    );

    //create an unauthenticated Couchbase bucket
    cluster.CreateBucket(
        new Bucket
            {
                Name = "newBucket",
                AuthType = AuthTypes.None,
                BucketType = BucketTypes.Membase,
                Quota = new Quota { RAM = 100 },
                ProxyPort = 9090,
                ReplicaNumber = ReplicaNumbers.Two
            }
    );

    //create a memcached bucket
    cluster.CreateBucket(
        new Bucket
        {
          Name = "newBucket",
             AuthType = AuthTypes.None,
             BucketType = BucketTypes.Memcached,
             Quota = new Quota { RAM = 100 },
             ProxyPort = 9090,
             ReplicaNumber = ReplicaNumbers.Zero
        }
    );
    ```

 * `void UpdateBucket(Bucket bucket)` recreates an existing bucket, updating only
   changed parameters.

    ```
    cluster.UpdateBucket(
        new Bucket
        {
          Name = "newBucket",
             Quota = new Quota { RAM = 128 },
             ProxyPort = 9090,
             AuthType = AuthTypes.None
        }
    );
    ```

 * `void DeleteBucket(string bucketName)` deletes an existing bucket

    ```
    cluster.DeleteBucket("bucketName");
    ```

 * To remove the data (but not design documents) from a bucket, use the
   `FlushBucket` method. `void FlushBucket(string bucketName)` flushes data from a
   bucket

    ```
    cluster.FlushBucket("bucketName");
    ```

 * There are four methods for managing design documents with the
   `CouchbaseCluster`. `bool CreateDesignDocument(string bucket, string name,
   string document)` creates a design document on the server, using the provided
   JSON string as the source of the document.

    ```
    //create a production mode design document
    var json =
    @"{
        ""views"": {
            ""by_name"": {
                ""map"": ""function (doc) { if (doc.type == \""city\"") { emit(doc.name, null); } }""
            }
        }
    }";

    var result = cluster.CreateDesignDocument("default", "cities", json);

    //create the same view using development mode
    var devResult = custer.CreateDesignDocument("default", "dev_cities", json);
    ```

 * `bool CreateDesignDocument(string bucket, string name, Stream source)` create a
   design document on the server using a readable `Stream` instance as the source
   of the document.

    ```
    var stream = new FileStream("Data\\CityViews.json", FileMode.Open);
    var result = cluster.CreateDesignDocument("default", "cities", stream);
    ```

 * `string RetrieveDesignDocument(string bucket, string name)` Retreive a design
   document from a bucket

    ```
    var document = cluster.RetrieveDesignDocument("default", "cities");
    ```

 * `bool DeleteDesignDocument(string bucket, string name)` Deletes a design
   document from a bucket

    ```
    var result = cluster.DeleteDesignDocument("default", "cities");
    ```



<a id="couchbase-sdk-net-available-packages"></a>
