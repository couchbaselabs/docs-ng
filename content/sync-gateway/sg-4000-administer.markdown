# Administering Sync Gateway

This section describes how to administer Sync Gateway.

## Command Line Tool
For quick-and-dirty configuration you can launch the `sync_gateway` tool with command-line options. In the long run, it's better to use JSON configuration files, which are the only way to serve multiple databases.

The format of the `sync_gateway` command is:

```
sync_gateway [ConfigurationFile...] [Options]
```

### Command-Line Options

* `-adminInterface` (default `:4985`): The port the admin REST API should listen on.
* `-bucket` (default `sync_gateway`): The name of the Couchbase bucket to use.
* `-dbname` (defaults to bucket name): The name of the database to serve on the regular REST API.
* `-help`: Lists the available flags and exits.
* `-interface` (default `:4984`): The port the REST API should listen on.
* `-log` (no default): A comma-separated list of logging keywords to enable. The `HTTP` keyword is always enabled, which means HTTP requests and error responses  are always logged.
* `-personaOrigin` (no default): The server's base URL for purposes of Persona authentication. This should be the same as the URL the client reaches the server at.
* `pool` (default `default`): The Couchbase Server pool name to find buckets in.
* `pretty` (default: false): Pretty-print the JSON responses. This is useful for debugging, but reduces performance.
* `-url` (default `http://localhost:8091`) The URL of the database server. An HTTP URL implies Couchbase Server, a `walrus:` URL implies the built-in Walrus database.
* `-verbose` (default: false): Logs more information about requests

The tool uses the regular Go flag parser, so options can be prefixed with one or two `-` characters, and option values can be given either as a following argument or in the same argument after an equal sign (=). 

The following command  does not include any parameters and just uses the default values. It connects to bucket `sync_gateway` of pool `default` of a Couchbase Server at localhost:8091. The database is called `sync_gateway` and is served from port 4984, with the admin interface on port 4985.

```sh
$ sync_gateway
```

The following command creates an ephemeral, in-memory Walrus database, served as `db`. JSON responses are pretty-printed.

```sh
$ sync_gateway -url=walrus: -bucket=db -pretty
```

The following command uses a Walrus database that will be persisted to a file named /tmp/walrus/db.walrus.

```sh
$ sync_gateway -url=walrus:///tmp/walrus -bucket=db -pretty
```

### Configuration Files

Instead of entering the settings on the command-line, you can store them in a JSON file and then just provide the path to that file as a command-line argument. As a bonus, the file lets you run multiple databases.

If you want to run multiple databases you can either add more entries to the `databases` property in the configuration file, or you can define each database in its own configuration file and list each of the configuration files on the command line.

Configuration files have one syntactic feature that's not standard JSON: any text between backticks (\`) is treated as a string, even if it spans multiple lines. This makes it easy to embed JavaScript code, such as the sync function.

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

You can combine command-line options with configuration files. The following command starts Sync Gateway with the parameters specified in a configuration file named config.json and adds additional logging by including the -log option on the command line:

```sh
$ sync_gateway -log=HTTP+,CRUD config.json
```



## Administering the REST APIs
Sync Gateway provides the following REST APIs:

* The [Sync REST API](#sync-rest-api) is used for client replication. The default port for the Sync REST API is 4984.

* The [Admin REST API](#admin-rest-api) is used to administer user accounts and roles. It can also be used to look at the contents of databases in superuser mode. The default port for the Admin REST API is 4985.

### Managing API Access

The APIs are accessed on different TCP ports, which makes it easy to expose the Sync REST API on port 4984 to clients while keeping the Admin REST API on port 4985 secure behind your firewall. 

If you want to change the ports, you can do that in the configuration file. 

* To change the Sync REST API port, set the `interface` property in the configuration file. 

* To change the Admin REST API port, set the `adminInterface`  property in the configuration file. 

The value of the property is a string consisting of a colon followed by a port number (for example, `:4985`). You can also prepend a host name or numeric IP address before the colon to bind only to the network interface with that address.

### Enabling Guest Access

Sync Gateway does not allow anonymous or guest access by default. A new server is accessible through the Sync REST API only after you enable guest access or create some user accounts. You can do this either by editing the configuration file before starting the server or by using the Admin REST API.

<p style="border-style:solid;padding:10px;">
<strong>Warning</strong>: If you enable guest access, all data is accessible to any client without authentication. If you need to enable guest access temporarily, be sure to disable it later.
</p>

You can enable guest access by modifying a configuration file or by sending a REST request. The reserved user name `GUEST` is used for all anonymous or unauthenticated access.

To enable guest access via a configuration file,  add a guest user to a `users` property inside a database object. Here's an example of a configuration file that gives full access to unauthenticated requests by enabling guest access:

```
{
   "log":["CRUD","REST+"],
   "databases":{
      "db":{
         "users":{
            "GUEST":{
               "disabled":false,
               "admin_channels":["*"]
            }
         }
      }
   }
}
```

The following sample command shows how to modify the guest account through the Admin REST API:

```
$ curl -X PUT localhost:4985/$DB/_user/GUEST --data '{"disabled":false, "admin_channels":["*"]}'
```
