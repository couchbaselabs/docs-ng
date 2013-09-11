# Administering Sync Gateway

This section describes how to administer Sync Gateway.

## Command Line Tool
You can launch the `sync_gateway` with command-line options. However, in the long run, it's better to use JSON configuration files, which are the only way to serve multiple databases. You can also combine command-line options with configuration files. 

The format of the `sync_gateway` command is:

```
sync_gateway [Options] [ConfigurationFile...] 
```

**Options**

|Option | Default |Description|  
| ------	| ------	| ------	|  
| `-adminInterface` | 127.0.0.1:4985| Port the Admin REST API  listens on
| `-bucket` | sync_gateway| Name of the Couchbase bucket to use
| `-dbname` |bucket name| Name of the database to serve via the Sync REST API
| `-help`| None | Lists the available options and exits.
| `-interface` | 4984| Port the Sync REST API listens on
| `-log` |None | Comma-separated list of logging keywords to enable. The `HTTP` keyword is always enabled, which means HTTP requests and error responses  are always logged.
| `-personaOrigin` |None| Base URL for Persona authentication. It should be the same URL that the client uses to reach the server.
| `-pool` | default | Couchbase Server pool name in which to find buckets
|`-pretty` | false | Pretty-print JSON responses. This is useful for debugging, but reduces performance.
| `-url` | walrus: | URL of the database server. An HTTP URL implies Couchbase Server, a `walrus:` URL implies the built-in Walrus database.
|`-verbose`| false | Logs more information about requests.


The command-line tool uses the regular Go flag parser, so you can prefix options with one or two `-` characters, and give option values either as a following argument or in the same argument after an equal sign (=). 

The following command  does not include any parameters and just uses the default values. It connects to the bucket named `sync_gateway` in the pool named `default` of the built-in Walrus database. It is served from port 4984, with the admin interface on port 4985.

```sh
$ sync_gateway
```

The following command creates an ephemeral, in-memory Walrus database, served as `db` and specifies pretty-printed JSON responses.

```sh
$ sync_gateway -url=walrus: -bucket=db -pretty
```

The following command uses a Walrus database that is persisted to a file named /tmp/walrus/db.walrus.

```sh
$ sync_gateway -url=walrus:///tmp/walrus -bucket=db -pretty
```

### Configuration Files

Instead of entering the settings on the command-line, you can store them in a JSON file and then just provide the path to that file as a command-line argument. As a bonus, the file lets you run multiple databases.

If you want to run multiple databases you can either add more entries to the `databases` property in the configuration file, or you can define each database in its own configuration file and list each of the configuration files on the command line.

Configuration files have one syntactic feature that's not standard JSON: any text between backticks (\`) is treated as a string, even if it spans multiple lines or contains double-quotes. This makes it easy to embed JavaScript code , such as the sync function.

The following sample configuration file starts a server with the default settings:

```json
{
   "interface":":4984",
   "adminInterface":":4985",
   "log":["REST"],
   "databases":{
      "sync_gateway":{
         "server":"http://localhost:8091",
         "bucket":"sync_gateway",
         "sync":`function(doc) {channel(doc.channels);}`
      }
   }
}

```

You can see an example of a more complex configuration file in the [CouchChat-iOS sample app](https://github.com/couchbaselabs/CouchChat-iOS/blob/master/sync-gateway-config.json).

The following command starts Sync Gateway with the parameters specified in a configuration file named config.json:

```sh
$ sync_gateway config.json
```

The following command starts Sync Gateway with the parameters specified in a configuration file named config.json and adds additional logging by including the -log option on the command line:

```sh
$ sync_gateway -log=HTTP+,CRUD config.json
```



## Administering the REST APIs
Sync Gateway provides the following REST APIs:

* The [Sync REST API](#sync-rest-api) is used for client replication. The default port for the Sync REST API is 4984.

* The [Admin REST API](#admin-rest-api) is used to administer user accounts and roles. It can also be used to look at the contents of databases in superuser mode. The default port for the Admin REST API is 4985. By default, the Admin REST API is reachable only from localhost for safety reasons.

### Managing API Access

The APIs are accessed on different TCP ports, which makes it easy to expose the Sync REST API on port 4984 to clients while keeping the Admin REST API on port 4985 secure behind your firewall. 

If you want to change the ports, you can do that in the configuration file. 

* To change the Sync REST API port, set the `interface` property in the configuration file. 

* To change the Admin REST API port, set the `adminInterface`  property in the configuration file. 

The value of the property is a string consisting of a colon followed by a port number (for example, `:4985`). You can also prepend a host name or numeric IP address before the colon to bind only to the network interface with that address. 

As a useful special case, the IP address 127.0.0.1 binds to the loopback interface, making the port unreachable from any other host. This is the default setting for the admin interface.

### Managing Guest Access

Sync Gateway does not allow anonymous or guest access by default. A new server is accessible through the Sync REST API only after you enable guest access or create some user accounts. You can do this either by editing the configuration file before starting the server or by using the Admin REST API. For more information, see [Anonymous Access](#anonymous-access).

