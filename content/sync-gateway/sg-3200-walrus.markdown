## Using Walrus

[Walrus](https://github.com/couchbaselabs/walrus) is a simple, limited, in-memory database that you can use in place of Couchbase Server for unit testing during development.

Use the following command to start a Sync Gateway that connects to a single Walrus database called `sync_gateway` and listens on the default ports:

```
$ ./sync_gateway -url walrus:
```
    
To use a different database name, use the `-dbname` option. For example:

```
$ ./sync_gateway -url walrus: -dbname mydb
```

By default, Walrus does not persist data to disk. However, you can make your database persistent by specifying an existing directory to which Sync Gateway can periodically save its state. It saves the data to a file named `/<directory>/sync_gateway.walrus`. For example, the following command instructs Sync Gateway to save the data in a file named `/data/sync_gateway.walrus`:

```
$ mkdir /data
$ ./sync_gateway -url walrus:/data
```
 
You can  use a relative path when specifying the directory for persistent data storage:

```
$ mkdir data
$ ./sync_gateway -url walrus:data
```    
 
You can also specify the directory for persistent data storage in a configuration file. The config.json file would look similar to the following JSON fragment:

```json
{
   "databases":{
      "couchchat":{
         "server":"walrus:data"         
   ...
}
```
