# Troubleshooting

When troubleshooting your Couchbase Server deployment there are a number of
different approaches available to you. For specific answers to individual
problems, see [Common
Errors](couchbase-manual-ready.html#couchbase-troubleshooting-common-errors).

<a id="couchbase-troubleshooting-general"></a>

## General Tips

The following are some general tips that may be useful before performing any
more detailed investigations:

 * Try pinging the node.

 * Try connecting to the Couchbase Server Web Console on the node.

 * [Try to use telnet to connect to the
   variousports](couchbase-manual-ready.html#couchbase-network-ports) that
   Couchbase Server uses.

 * Try reloading the web page.

 * Check firewall settings (if any) on the node. Make sure there isn't a firewall
   between you and the node. On a Windows system, for example, the Windows firewall
   might be blocking the ports (Control Panel > Windows Firewall).

 * Make sure that the documented ports are open between nodes and make sure the
   data operation ports are available to clients.

 * Check your browser's security settings.

 * Check any other security software installed on your system, such as antivirus
   programs.

 * Generate a Diagnostic Report for use by Couchbase Technical Support to help
   determine what the problem is. There are two ways of collecting this
   information:

    * Click `Generate Diagnostic Report` on the Log page to obtain a snapshot of your
      system's configuration and log information for deeper analysis. You must send
      this file to Couchbase.

    * Run the `cbcollect_info` on each node within your cluster. To run, you must
      specify the name of the file to be generated:

       ```
       shell> cbcollect_info nodename.zip
       ```

      This will create a Zip file with the specified name. You must run each command
      individually on each node within the cluster. You can then send each file to
      Couchbase for analysis.

      For more information, see [cbcollect_info
      Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbcollect_info).

<a id="couchbase-troubleshooting-specific-errors"></a>

## Responding to Specific Errors

The following table outlines some specific areas to check when experiencing
different problems:

<a id="table-couchbase-troubleshooting-specific-errors"></a>

Severity      | Issue                               | Suggested Action(s)                                                      
--------------|-------------------------------------|--------------------------------------------------------------------------
Critical      | Couchbase Server does not start up. | Check that the service is running.                                       
              |                                     | Check error logs.                                                        
              |                                     | Try restarting the service.                                              
Critical      | A server is not responding.         | Check that the service is running.                                       
              |                                     | Check error logs.                                                        
              |                                     | Try restarting the service.                                              
Critical      | A server is down.                   | Try restarting the server.                                               
              |                                     | Use the command-line interface to check connectivity.                    
Informational | Bucket authentication failure.      | Check the properties of the bucket that you are attempting to connect to.

The primary source for run-time logging information is the Couchbase Server Web
Console. Run-time logs are automatically set up and started during the
installation process. However, the Couchbase Server gives you access to
lower-level logging details if needed for diagnostic and troubleshooting
purposes. Log files are stored in a binary format in the logs directory under
the Couchbase installation directory. You must use `browse_logs` to extract the
log contents from the binary format to a text file.

<a id="couchbase-troubleshooting-logs"></a>

## Logs and Logging

Couchbase Server creates a number of different log files depending on the
component of the system that produce the error, and the level and severity of
the problem being reported. For a list of the different file locations for each
platform, see
[](couchbase-manual-ready.html#couchbase-troubleshooting-logs-oslocs).

<a id="couchbase-troubleshooting-logs-oslocs"></a>

Platform | Location                                                                     
---------|------------------------------------------------------------------------------
Linux    | `/opt/couchbase/var/lib/couchbase/logs`                                      
Windows  | `C:\Program Files\Couchbase\Server\log` Assumes default installation location
Mac OS X | `~/Library/Logs`                                                             

Individual log files are automatically numbered, with the number suffix
incremented for each new log, with a maximum of 20 files per log. Individual log
file sizes are limited to 10MB by default.

[](couchbase-manual-ready.html#couchbase-troubleshooting-logs-files) contains a
list of the different log files are create in the logging directory and their
contents.

<a id="couchbase-troubleshooting-logs-files"></a>

File               | Log Contents                                                                                                                                               
-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------
`couchdb`          | Errors relating to the couchdb subsystem that supports views, indexes and related REST API issues                                                          
`debug`            | Debug level error messages related to the core server management subsystem, excluding information included in the `couchdb`, `xdcr` and `stats` logs.      
`info`             | Information level error messages related to the core server management subsystem, excluding information included in the `couchdb`, `xdcr` and `stats` logs.
`error`            | Error level messages for all subsystems excluding `xdcr`.                                                                                                  
`xcdr_error`       | XDCR error messages.                                                                                                                                       
`xdcr`             | XSCR information messages.                                                                                                                                 
`mapreduce_errors` | JavaScript and other view-processing errors are reported in this file.                                                                                     
`views`            | Errors relating to the integration between the view system and the core server subsystem.                                                                  
`stats`            | Contains periodic reports of the core statistics.                                                                                                          
`memcached.log`    | Contains information relating to the core memcache component, including vBucket and replica and rebalance data streams requests.                           

Each logfile group will also include a `.idx` and `.siz` file which holds meta
information about the logfile group. These files are automatically updated by
the logging system.

<a id="couchbase-troubleshooting-common-errors"></a>

## Common Errors

This page will attempt to describe and resolve some common errors that are
encountered when using Couchbase. It will be a living document as new problems
and/or resolutions are discovered.

 * **Problems Starting Couchbase Server for the first time**

   If you are having problems starting Couchbase Server on Linux for the first
   time, there are two very common causes of this that are actually quite related.
   When the `/etc/init.d/couchbase-server` script runs, it tries to set the file
   descriptor limit and core file size limit:

    ```
    shell> ulimit -n 10240 ulimit -c unlimited
    ```

   Depending on the defaults of your system, this may or may not be allowed. If
   Couchbase Server is failing to start, you can look through the logs and pick out
   one or both of these messages:

    ```
    ns_log: logging ns_port_server:0:Port server memcached on node 'ns_1@127.0.0.1' exited with status 71. »
    Restarting. Messages: failed to set rlimit for open files. »
    Try running as root or requesting smaller maxconns value.
    ```

   Alternatively you may additional see or optionally see:

    ```
    ns_port_server:0:info:message - Port server memcached on node 'ns_1@127.0.0.1' exited with status 71. »
    Restarting. Messages: failed to ensure corefile creation
    ```

   The resolution to these is to edit the /etc/security/limits.conf file and add
   these entries:

    ```
    couchbase hard nofile 10240
    couchbase hard core unlimited
    ```

<a id="couchbase-faq"></a>

# Appendix: FAQs

 * What kind of client do I use with `couchbase` ?

   `couchbase` is compatible with existing memcached clients. If you have a
   memcached client already, you can just point it at `couchbase`. Regular testing
   is done with `spymemcached` (the Java client), `libmemcached` and fauna (Ruby
   client). See the [Client Libraries](http://www.couchbase.com/develop) page

 * What is a "vbucket"?

   An overview from Dustin Sallings is presented here: [memcached
   vBuckets](http://dustin.github.com/2010/06/29/memcached-vbuckets.html)

 * What is a TAP stream?

   A TAP stream is a when a client requests a stream of item updates from the
   server. That is, as other clients are requesting item mutations (for example,
   SET's and DELETE's), a TAP stream client can "wire-tap" the server to receive a
   stream of item change notifications.

   When a TAP stream client starts its connection, it may also optionally request a
   stream of all items stored in the server, even if no other clients are making
   any item changes. On the TAP stream connection setup options, a TAP stream
   client may request to receive just current items stored in the server (all items
   until "now"), or all item changes from now onwards into in the future, or both.

   Trond Norbye's written a blog post about the TAP interface. See [Blog
   Entry](http://blog.couchbase.com/want-know-what-your-memcached-servers-are-doing-tap-them).

 * What ports does `couchbase` Server need to run on?

   The following TCP ports should be available:

    * 8091 — GUI and REST interface

    * 11211 — Server-side Moxi port for standard memcached client access

    * 11210 — native `couchbase` data port

    * 0 to 21199 — inclusive for dynamic cluster communication

 * What hardware and platforms does `couchbase` Server support?

   Couchbase Server supports Red Hat (and CentOS) versions 5 starting with update
   2, Ubuntu 9 and and Windows Server 2008 (other versions have been shown to work
   but are not being specifically tested). There are both 32-bit and 64-bit
   versions available. Community support for Mac OS X is available. Future releases
   will provide support for additional platforms.

 * How can I get `couchbase` on (this other OS)?

   The `couchbase` source code is quite portable and is known to have been built on
   several other UNIX and Linux based OSs. See [Consolidated
   sources](http://www.couchbase.com/downloads/).

 * Can I query `couchbase` by something other than the key name?

   Not directly. It's possible to build these kinds of solutions atop TAP. For
   instance, via
   [Cascading](http://www.cascading.org/2010/09/memcached-membase-and-elastics.html)
   it is possible to stream out the data, process it with Cascading, then create
   indexes in Elastic Search.

 * What is the maximum item size in `couchbase` ?

   The default item size for `couchbase` buckets is 20 MBytes. The default item
   size for memcached buckets is 1 MByte.

 * How do I the change password?

    ```
    shell> couchbase cluster-init -c cluster_IP:8091
            -u current_username-p current password
            --cluster-init-username=new_username
            --cluster-init-password=new_password
    ```

 * How do I change the per-node RAM quota?

    ```
    shell> couchbase cluster-init -c \
               cluster_IP:8091 -u username-p password
                --cluster-init-ramsize=RAM_in_MB
    ```

 * How do I change the disk path?

   Use the `couchbase` command-line tool:

    ```
    shell> couchbase node-init -c cluster_IP:8091 -u \
           username-p password--node-init-data-path=/tmp
    ```

 * Why are some clients getting different results than others for the same
   requests?

   This should never happen in a correctly-configured `couchbase` cluster, since
   `couchbase` ensures a consistent view of all data in a cluster. However, if some
   clients can't reach all the nodes in a cluster (due to firewall or routing
   rules, for example), it is possible for the same key to end up on more than one
   cluster node, resulting in inconsistent duplication. Always ensure that all
   cluster nodes are reachable from every smart client or client-side moxi host.

<a id="couchbase-uninstalling"></a>

# Appendix: Uninstalling Couchbase Server

If you want to uninstall Couchbase Server from your system you must choose the
method appropriate for your operating system.

Before removing Couchbase Server from your system, you should do the following:

 * Shutdown your Couchbase Server. For more information on the methods of shutting
   down your server for your platform, see [Server Startup and
   Shutdown](couchbase-manual-ready.html#couchbase-admin-basics-running).

 * If your machine is part of an active cluster, you should rebalance your cluster
   to take the node out of your configuration. See
   [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

 * Update your clients to point to an available node within your Couchbase Server
   cluster.

<a id="couchbase-uninstalling-redhat"></a>

## Uninstalling on a RedHat Linux System

To uninstall the software on a RedHat Linux system, run the following command:


```
shell> sudo rpm -e couchbase-server
```

Refer to the RedHat RPM documentation for more information about uninstalling
packages using RPM.

You may need to delete the data files associated with your installation. The
default installation location is `/opt`. If you selected an alternative location
for your data files, you will need to separately delete each data directory from
your system.

<a id="couchbase-uninstalling-debian"></a>

## Uninstalling on an Debian/Ubuntu Linux System

To uninstall the software on a Ubuntu Linux system, run the following command:


```
shell> sudo dpkg -r couchbase-server
```

Refer to the Ubuntu documentation for more information about uninstalling
packages using `dpkg`.

You may need to delete the data files associated with your installation. The
default installation location is `/opt`. If you selected an alternative location
for your data files, you will need to separately delete each data directory from
your system.

<a id="couchbase-uninstalling-windows"></a>

## Uninstalling on a Windows System

To uninstall the software on a Windows system you must have Administrator or
Power User privileges to uninstall Couchbase.

To remove, choose `Start` > `Settings` > `Control Panel`, choose `Add or Remove
Programs`, and remove the Couchbase Server software.

<a id="couchbase-uninstalling-macosx"></a>

## Uninstalling on a Mac OS X System

To uninstall on Mac OS X:

 1. Open the `Applications` folder, and then drag the `Couchbase Server` application
    to the trash. You may be asked to provide administrator credentials to complete
    the deletion.

 1. To remove the application data, you will need to delete the `Couchbase` folder
    from the `~/Library/Application Support` folder for the user that ran Couchbase
    Server.

<a id="couchbase-sampledata"></a>

# Appendix: Couchbase Sample Buckets

Couchbase Server comes with sample buckets that contain both data and MapReduce
queries to demonstrate the power and capabilities.

This appendix provides information on the structure, format and contents of the
sample databases. The available sample buckets include:

 * [Game Simulation data](couchbase-manual-ready.html#couchbase-sampledata-gamesim)

 * [Beer and Brewery data](couchbase-manual-ready.html#couchbase-sampledata-beer)

<a id="couchbase-sampledata-gamesim"></a>

## Game Simulation Sample Bucket

The Game Simlution sample bucket is designed to showcase a typical gaming
application that combines records showing individual gamers, game objects and
how this information can be merged together and then reported on using views.

For example, a typical game player record looks like the one below:


```
{
    "experience": 14248,
    "hitpoints": 23832,
    "jsonType": "player",
    "level": 141,
    "loggedIn": true,
    "name": "Aaron1",
    "uuid": "78edf902-7dd2-49a4-99b4-1c94ee286a33"
}
```

A game object, in this case an Axe, is shown below:


```
{
   "jsonType" : "item",
   "name" : "Axe_14e3ad7b-8469-444e-8057-ac5aefcdf89e",
   "ownerId" : "Benjamin2",
   "uuid" : "14e3ad7b-8469-444e-8057-ac5aefcdf89e"
}
```

In this example, you can see how the game object has been connected to an
individual user through the `ownerId` field of the item JSON.

Monsters within the game are similarly defined through another JSON object type:


```
{
    "experienceWhenKilled": 91,
    "hitpoints": 3990,
    "itemProbability": 0.19239324085462631,
    "jsonType": "monster",
    "name": "Wild-man9",
    "uuid": "f72b98c2-e84b-4b17-9e2a-bcec52b0ce1c"
}
```

For each of the three records, the `jsonType` field is used to define the type
of the object being stored.

<a id="couchbase-sampledata-gamesim-views-leaderboard"></a>

### leaderboard View

The `leaderboard` view is designed to generate a list of the players and their
current score:


```
function (doc) {
  if (doc.jsonType == "player") {
  emit(doc.experience, null);
  }
}
```

The view looks for records with a `jsonType` of "player", and then outputs the
`experience` field of each player record. Because the output from views is
naturally sorted by the key value, the output of the view will be a sorted list
of the players by their score. For example:


```
{
   "total_rows" : 81,
   "rows" : [
      {
         "value" : null,
         "id" : "Bob0",
         "key" : 1
      },
      {
         "value" : null,
         "id" : "Dustin2",
         "key" : 1
      },
…
      {
         "value" : null,
         "id" : "Frank0",
         "key" : 26
      }
   ]
}
```

To get the top 10 highest scores (and ergo players), you can send a request that
reverses the sort order (by using `descending=true`, for example:


```
http://127.0.0.1:8092/gamesim-sample/_design/dev_players/_view/leaderboard?descending=true&connection_timeout=60000&limit=10&skip=0
```

Which generates the following:


```
{
   "total_rows" : 81,
   "rows" : [
      {
         "value" : null,
         "id" : "Tony0",
         "key" : 23308
      },
      {
         "value" : null,
         "id" : "Sharon0",
         "key" : 20241
      },
      {
         "value" : null,
         "id" : "Damien0",
         "key" : 20190
      },
…
      {
         "value" : null,
         "id" : "Srini0",
         "key" :9
      },
      {
         "value" : null,
         "id" : "Aliaksey1",
         "key" : 17263
      }
   ]
}
```

<a id="couchbase-sampledata-gamesim-views-playerlist"></a>

### playerlist View

The `playerlist` view creates a list of all the players by using a map function
that looks for "player" records.


```
function (doc, meta) {
  if (doc.jsonType == "player") {
    emit(meta.id, null);
  }
}
```

This outputs a list of players in the format:


```
{
   "total_rows" : 81,
   "rows" : [
      {
         "value" : null,
         "id" : "Aaron0",
         "key" : "Aaron0"
      },
      {
         "value" : null,
         "id" : "Aaron1",
         "key" : "Aaron1"
      },
      {
         "value" : null,
         "id" : "Aaron2",
         "key" : "Aaron2"
      },
      {
         "value" : null,
         "id" : "Aliaksey0",
         "key" : "Aliaksey0"
      },
      {
         "value" : null,
         "id" : "Aliaksey1",
         "key" : "Aliaksey1"
      }
   ]
}
```

<a id="couchbase-sampledata-beer"></a>

## Beer Sample Bucket

The beer sample data demonstrates a combination of the document structure used
to describe different items, including references between objects, and also
includes a number of sample views that show the view structure and layout.

The primary document type is the 'beer' document:


```
{
   "name": "Piranha Pale Ale",
   "abv": 5.7,
   "ibu": 0,
   "srm": 0,
   "upc": 0,
   "type": "beer",
   "brewery_id": "110f04166d",
   "updated": "2010-07-22 20:00:20",
   "description": "",
   "style": "American-Style Pale Ale",
   "category": "North American Ale"
}
```

Beer documents contain core information about different beers, including the
name, alcohol by volume ( `abv` ) and categorisation data.

Individual beer documents are related to brewery documents using the
`brewery_id` field, which holds the information about a specific brewery for the
beer:


```
{
   "name": "Commonwealth Brewing #1",
   "city": "Boston",
   "state": "Massachusetts",
   "code": "",
   "country": "United States",
   "phone": "",
   "website": "",
   "type": "brewery",
   "updated": "2010-07-22 20:00:20",
   "description": "",
   "address": [
   ],
   "geo": {
       "accuracy": "APPROXIMATE",
       "lat": 42.3584,
       "lng": -71.0598
   }
}
```

The brewery reconrd includes basic contact and address information for the
brewery, and contains a spatial record consisting of the latitute and longitude
of the brewery location.

To demonstrate the view functionality in Couchbase Server, three views are
defined.

<a id="couchbase-sampledata-beer-views-brewerybeers"></a>

### brewery_beers View

The `brewery_beers` view outputs a composite list of breweries and beers they
brew by using the view output format to create a 'fake' join, as detailed in
[Solutions for Simulating
Joins](couchbase-manual-ready.html#couchbase-views-sample-patterns-joins). This
outputs the brewery ID for brewery document types, and the brewery ID and beer
ID for beer document types:


```
function(doc, meta) {
  switch(doc.type) {
  case "brewery":
    emit([meta.id]);
    break;
  case "beer":
    if (doc.brewery_id) {
      emit([doc.brewery_id, meta.id]);
    }
    break;
  }
}
```

The raw JSON output from the view:


```
{
   "total_rows" : 7315,
   "rows" : [
      {
         "value" : null,
         "id" : "110f0013c9",
         "key" : [
            "110f0013c9"
         ]
      },
      {
         "value" : null,
         "id" : "110fdd305e",
         "key" : [
            "110f0013c9",
            "110fdd305e"
         ]
      },
      {
         "value" : null,
         "id" : "110fdd3d0b",
         "key" : [
            "110f0013c9",
            "110fdd3d0b"
         ]
      },
…
      {
         "value" : null,
         "id" : "110fdd56ff",
         "key" : [
            "110f0013c9",
            "110fdd56ff"
         ]
      },
      {
         "value" : null,
         "id" : "110fe0aaa7",
         "key" : [
            "110f0013c9",
            "110fe0aaa7"
         ]
      },
      {
         "value" : null,
         "id" : "110f001bbe",
         "key" : [
            "110f001bbe"
         ]
      }
   ]
}
```

The output could be combined with the corresponding brewery and beer data to
provide a list of the beers at each brewery.

<a id="couchbase-sampledata-beer-views-by_location"></a>

### by_location View

Outputs the brewery location, accounting for missing fields in the source data.
The output creates information either by country, by country and state, or by
country, state and city.


```
function (doc, meta) {
  if (doc.country, doc.state, doc.city) {
    emit([doc.country, doc.state, doc.city], 1);
  } else if (doc.country, doc.state) {
    emit([doc.country, doc.state], 1);
  } else if (doc.country) {
    emit([doc.country], 1);
  }
}
```

The view also includes the built-in `_count` function for the reduce portion of
the view. Without using the reduce, the information outputs the raw location
information:


```
{
   "total_rows" : 1413,
   "rows" : [
      {
         "value" : 1,
         "id" : "110f0b267e",
         "key" : [
            "Argentina",
            "",
            "Mendoza"
         ]
      },
      {
         "value" : 1,
         "id" : "110f035200",
         "key" : [
            "Argentina",
            "Buenos Aires",
            "San Martin"
         ]
      },
…
      {
         "value" : 1,
         "id" : "110f2701b3",
         "key" : [
            "Australia",
            "New South Wales",
            "Sydney"
         ]
      },
      {
         "value" : 1,
         "id" : "110f21eea3",
         "key" : [
            "Australia",
            "NSW",
            "Picton"
         ]
      },
      {
         "value" : 1,
         "id" : "110f117f97",
         "key" : [
            "Australia",
            "Queensland",
            "Sanctuary Cove"
         ]
      }
   ]
}
```

With the `reduce()` enabled, grouping can be used to report the number of
breweries by the country, state, or city. For example, using a grouping level of
two, the information outputs the country and state counts:


```
{"rows":[
{"key":["Argentina",""],"value":1},
{"key":["Argentina","Buenos Aires"],"value":1},
{"key":["Aruba"],"value":1},
{"key":["Australia"],"value":1},
{"key":["Australia","New South Wales"],"value":4},
{"key":["Australia","NSW"],"value":1},
{"key":["Australia","Queensland"],"value":1},
{"key":["Australia","South Australia"],"value":2},
{"key":["Australia","Victoria"],"value":2},
{"key":["Australia","WA"],"value":1}
]
}
```

<a id="couchbase-views-troubleshooting"></a>

# Appendix: Troubleshooting Views (Technical Background)

A number of errors and problems with views are generally associated with the
eventual consistency model of the view system. In this section, some further
detail on this information and strategies for identifying and tracking view
errors are provided.

It also gives some guidelines about how to report potential view engine issues,
what information to include in JIRA.

<a id="couchbase-views-debugging-timeout"></a>

## Timeout errors in query responses

When querying a view with `stale=false`, you get often timeout errors for one or
more nodes. These nodes are nodes that did not receive the original query
request, for example you query node 1, and you get timeout errors for nodes 2, 3
and 4 as in the example below (view with reduce function \_count):


```
shell> curl -s 'http://localhost:9500/default/_design/dev_test2/_view/view2?full_set=true&stale=false'
{"rows":[
  {"key":null,"value":125184}
],
"errors":[
  {"from":"http://192.168.1.80:9503/_view_merge/?stale=false","reason":"timeout"},
  {"from":"http://192.168.1.80:9501/_view_merge/?stale=false","reason":"timeout"},
  {"from":"http://192.168.1.80:9502/_view_merge/?stale=false","reason":"timeout"}
]
}
```

The problem here is that by default, for queries with `stale=false` (full
consistency), the view merging node (node which receive the query request, node
1 in this example) waits up to 60000 milliseconds (1 minute) to receive partial
view results from each other node in the cluster. If it waits for more than 1
minute for results from a remote node, it stops waiting for results from that
node and a timeout error entry is added to the final response. A `stale=false`
request blocks a client, or the view merger node as in this example, until the
index is up to date, so these timeouts can happen frequently.

If you look at the logs from those nodes you got a timeout error, you'll see the
index build/update took more than 60 seconds, example from node 2:


```
[couchdb:info,2012-08-20T15:21:13.150,n_1@192.168.1.80:<0.6234.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater finished
 Indexing time: 93.734 seconds
 Blocked time:  10.040 seconds
 Inserted IDs:  124960
 Deleted IDs:   0
 Inserted KVs:  374880
 Deleted KVs:   0
 Cleaned KVs:   0
```

In this case, node 2 took 103.774 seconds to update the index.

In order to avoid those timeouts, you can pass a large connection\_timeout in
the view query URL, example:


```
shell> time curl -s
 'http://localhost:9500/default/_design/dev_test2/_view/view2?full_set=true&stale=false&connection_timeout=999999999'
{"rows":[
{"key":null,"value":2000000}
]
}
real  2m44.867s
user   0m0.007s
sys    0m0.007s
```

And in the logs of nodes 1, 2, 3 and 4, respectively you'll see something like
this:

`node 1, view merger node`


```
[couchdb:info,2012-08-20T16:10:02.887,n_0@192.168.1.80:<0.27674.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 155.549
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:96
 Deleted IDs:   0
 Inserted KVs:  1500288
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 2`


```
[couchdb:info,2012-08-20T16:10:28.457,n_1@192.168.1.80:<0.6071.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 163.555
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 3`


```
[couchdb:info,2012-08-20T16:10:29.710,n_2@192.168.1.80:<0.6063.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 164.808
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

`node 4`


```
[couchdb:info,2012-08-20T16:10:26.686,n_3@192.168.1.80:<0.6063.0>:couch_log:info:39] Set view
  `default`, main group `_design/dev_test2`, updater
finished
 Indexing time: 161.786
seconds
 Blocked time:  0.000 seconds
 Inserted IDs:  499968
 Deleted IDs:   0
 Inserted KVs:  1499904
 Deleted KVs:   0
 Cleaned KVs:   0
```

<a id="couchbase-views-debugging-blocking"></a>

## Blocked indexers, no progress for long periods of time

Each design document maps to one indexer, so when the indexer runs it updates
all views defined in the corresponding design document. Indexing takes resources
(CPU, disk IO, memory), therefore Couchbase Server limits the maximum number of
indexers that can run in parallel. There are 2 configuration parameters to
specify the limit, one for regular (main/active) indexers and other for replica
indexers (more on this in a later section). The default for the former is 4 and
for the later is 2. They can be queried like this:


```
shell> curl -s 'http://Administrator:asdasd@localhost:9000/settings/maxParallelIndexers'
{"globalValue":4,"nodes":{"n_0@192.168.1.80":4}}
```

`maxParallelIndexers` is for main indexes and `maxParallelReplicaIndexers` is
for replica indexes. When there are more design documents (indexers) than
maxParallelIndexers, some indexers are blocked until there's a free slot, and
the rule is simple as first-come-first-served. These slots are controlled by 2
barriers processes, one for main indexes, and the other for replica indexes.
Their current state can be seen from `_active_tasks` (per node), for example
when there's no indexing happening:


```
shell> curl -s 'http://localhost:9500/_active_tasks' | json_xs
[
 {
     "waiting" : 0,
         "started_on" : 1345642656,
         "pid" : "<0.234.0>",
         "type" : "couch_main_index_barrier",
         "running" : 0,
         "limit" : 4,
         "updated_on" : 1345642656
         },
 {
     "waiting" : 0,
         "started_on" : 1345642656,
         "pid" : "<0.235.0>",
         "type" : "couch_replica_index_barrier",
         "running" : 0,
         "limit" : 2,
         "updated_on" : 1345642656
         }
 ]
```

The `waiting` fields tells us how many indexers are blocked, waiting for their
turn to run. Queries with `stale=false` have to wait for the indexer to be
started (if not already), unblocked and to finish, which can lead to a long time
when there are many design documents in the system. Also take into account that
the indexer for a particular design document might be running for one node but
it might be blocked in another node - when it's blocked it's not necessarily
blocked in all nodes of the cluster nor when it's running is necessarily running
in all nodes of the cluster - you verify this by querying \_active\_tasks for
each node (this API is not meant for direct user consumption, just for
developers and debugging/troubleshooting).

Through `_active_tasks` (remember, it's per node, so check it for every node in
the cluster), you can see which indexers are running and which are blocked. Here
follows an example where we have 5 design documents (indexers) and
`>maxParallelIndexers` is 4:


```
shell> curl -s 'http://localhost:9500/_active_tasks' | json_xs
[
   {
      "waiting" : 1,
      "started_on" : 1345644651,
      "pid" :  "<0.234.0>",
      "type" :  "couch_main_index_barrier",
      "running" : 4,
      "limit" : 4,
      "updated_on" : 1345644923
   },
   {
      "waiting" : 0,
      "started_on" : 1345644651,
      "pid" :  "<0.235.0>",
      "type" :  "couch_replica_index_barrier",
      "running" : 0,
      "limit" : 2,
      "updated_on" : 1345644651
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "updated_on" : 1345644923,
      "design_documents" : [
         "_design/test"
      ],
      "pid" :  "<0.4706.0>",
      "signature" : "4995c136d926bdaf94fbe183dbf5d5aa",
      "type" :  "blocked_indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test4"
      ],
      "pid" :  "<0.4715.0>",
      "changes_done" : 0,
      "signature" : "15e1f576bc85e3e321e28dc883c90077",
      "type" :  "indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test3"
      ],
      "pid" :  "<0.4719.0>",
      "changes_done" : 0,
      "signature" : "018b83ca22e53e14d723ea858ba97168",
      "type" :  "indexer",
      "set" :  "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test2"
      ],
      "pid" :  "<0.4722.0>",
      "changes_done" : 0,
      "signature" : "440b0b3ded9d68abb559d58b9fda3e0a",
      "type" :  "indexer",
      "set" : "default"
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345644923,
      "progress" : 0,
      "initial_build" : true,
      "updated_on" : 1345644923,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/test7"
      ],
      "pid" :  "<0.4725.0>",
      "changes_done" : 0,
      "signature" : "fd2bdf6191e61af6e801e3137e2f1102",
      "type" :  "indexer",
      "set" :  "default"
   }
]
```

The indexer for design document \_design/test is represented by a task with a
`type` field of `blocked_indexer`, while other indexers have a task with type
`indexer`, meaning they're running. The task with type
`couch_main_index_barrier` confirms this by telling us there are currently 4
indexers running and 1 waiting for its turn. When an indexer is allowed to
execute, its active task with type `blocked_indexer` is replaced by a new one
with type `indexer`.

<a id="couchbase-views-debugging-missing"></a>

## Data missing in query response or it's wrong (user issue)

For example, you defined a view with a `_stats` reduce function. You query your
view, and keep getting empty results all the time, for example:


```
shell> curl -s 'http://localhost:9500/default/_design/dev_test3/_view/view1?full_set=true'
{"rows":[
]
}
```

You repeat this query over and over for several minutes or even hours, and you
always get an empty result set.

Try to query the view with `stale=false`, and you get:


```
shell> curl -s 'http://localhost:9500/default/_design/dev_test3/_view/view1?full_set=true&stale=false'
{"rows":[
],
"errors":[
{"from":"local","reason":"Builtin _stats function
 requires map values to be numbers"},
{"from":"http://192.168.1.80:9502/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"},
{"from":"http://192.168.1.80:9501/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"},
{"from":"http://192.168.1.80:9503/_view_merge/?stale=false","reason":"Builtin _stats function requires map values to be
 numbers"}
]
}
```

Then looking at the design document, you see it could never work, as values are
not numbers:


```
{
   "views":
   {
       "view1": {
           "map": "function(doc, meta) { emit(meta.id, meta.id); }",
           "reduce": "_stats"
       }
   }
}
```

One important question to make is, why do you see the errors when querying with
`stale=false` but do not see them when querying with `stale=update_after`
(default) or `stale=ok` ? The answer is simple:

 1. `stale=false` means: trigger an index update/build, and wait until it that
    update/build finishes, then start streaming the view results. For this example,
    index build/update failed, so the client gets an error, describing why it
    failed, from all nodes where it failed.

 1. `stale=update` \_after means start streaming the index contents immediately and
    after trigger an index update (if index is not up to date already), so query
    responses won't see indexing errors as they do for the `stale=false` scenario.
    For this particular example, the error happened during the initial index build,
    so the index was empty when the view queries arrived in the system, whence the
    empty result set.

 1. `stale=ok` is very similar to (2), except it doesn't trigger index updates.

Finally, index build/update errors, related to user Map/Reduce functions, can be
found in a dedicated log file that exists per node and has a file name matching
`mapreduce_errors.#`. For example, from node 1, the file `*mapreduce_errors.1`
contained:


```
[mapreduce_errors:error,2012-08-20T16:18:36.250,n_0@192.168.1.80:<0.2096.1>] Bucket `default`, main group `_design/dev_test3`,
 error executing reduce
function for view `view1'
   reason:                Builtin _stats function requires map values to be
numbers
```

<a id="couchbase-views-debugging-wrongdocs"></a>

## Wrong documents or rows when querying with include_docs=true

Imagine you have the following design document:


```
{
     "meta": {"id": "_design/test"},
     "views":
     {
         "view1": {
             "map": "function(doc, meta) { emit(meta.id,  doc.value); }"
         }
     }
 }
```

And the bucket only has 2 documents, document `doc1` with JSON value `{"value":
1}`, and document `doc2` with JSON value `{"value": 2}`, you query the view
initially with `stale=false` and `include_docs=true` and get:


```
shell> curl -s 'http://localhost:9500/default/_design/test/_view/view1?include_docs=true&stale=false' | json_xs
 {
    "total_rows" :
2,
    "rows" :
[
       {
          "value" : 1,
          "doc"
: {
             "json" : {
                "value" : 1
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "1-000000367916708a0000000000000000",
                "id" : "doc1"
             }
          },
          "id"
: "doc1",
          "key"
: "doc1"
       },
       {
          "value" : 2,
          "doc"
: {
             "json" : {
                "value" : 2
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "1-00000037b8a32e420000000000000000",
                "id" : "doc2"
             }
          },
          "id"
: "doc2",
          "key"
: "doc2"
       }
    ]
 }
```

Later on you update both documents, such that document `doc1` has the JSON value
`{"value": 111111}` and document `doc2` has the JSON value `{"value": 222222}`.
You then query the view with `stale=update_after` (default) or `stale=ok` and
get:


```
shell> curl -s 'http://localhost:9500/default/_design/test/_view/view1?include_docs=true' | json_xs
 {
    "total_rows" :
2,
    "rows" :
[
       {
          "value" : 1,
          "doc"
: {
             "json" : {
                "value" : 111111
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "2-0000006657aeed6e0000000000000000",
                "id" : "doc1"
             }
          },
          "id"
: "doc1",
          "key"
: "doc1"
       },
       {
          "value" : 2,
          "doc"
: {
             "json" : {
                "value" : 222222
             },
             "meta" : {
                "flags" : 0,
                "expiration" : 0,
                "rev" : "2-00000067e3ee42620000000000000000",
                "id" : "doc2"
             }
          },
          "id"
: "doc2",
          "key"
: "doc2"
       }
    ]
 }
```

The documents included in each row don't match the value field of each row, that
is, the documents included are the latest (updated) versions but the index row
values still reflect the previous (first) version of the documents.

Why this behaviour? Well, `include_docs=true` works by at query time, for each
row, to fetch from disk the latest revision of each document. There's no way to
include a previous revision of a document. Previous revisions are not accessible
through the latest vbucket databases MVCC snapshots (
[http://en.wikipedia.org/wiki/Multiversion\_concurrency\_control](http://en.wikipedia.org/wiki/Multiversion_concurrency_control)
), and it's not possible to find efficiently from which previous MVCC snapshots
of a vbucket database a specific revision of a document is located. Further,
vbucket database compaction removes all previous MVCC snapshots (document
revisions). In short, this is a deliberate design limit of the database engine.

The only way to ensure full consistency here is to include the documents
themselves in the values emitted by the map function. Queries with `stale=false`
are not 100% reliable either, as just after the index is updated and while rows
are being streamed from disk to the client, document updates and deletes can
still happen, resulting in the same behaviour as in the given example.

<a id="couchbase-views-debugging-expired"></a>

## Expired documents still have their associated Key-Value pairs returned in queries with stale=false

See
[http://www.couchbase.com/issues/browse/MB-6219](http://www.couchbase.com/issues/browse/MB-6219)

<a id="couchbase-views-debugging-datamissing"></a>

## Data missing in query response or it's wrong (potentially due to server issues)

Sometimes, especially between releases for development builds, it's possible
results are missing due to issues in some component of Couchbase Server. This
section describes how to do some debugging to identify which components, or at
least to identify which components are not at fault.

Before proceeding, it needs to be mentioned that each vbucket is physically
represented by a CouchDB database (generated by couchstore component) which
corresponds to exactly 1 file in the filesystem, example from a development
environment using 16 vbuckets only (for example simplicity), 4 nodes and without
replicas enabled:


```
shell> tree ns_server/couch/0/
ns_server/couch/0/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 2.couch.1
     ??? 3.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 8 files

shell> tree ns_server/couch/1/
ns_server/couch/1/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 6.couch.1
     ??? 7.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files

shell> tree ns_server/couch/2/
ns_server/couch/2/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 8.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files

shell> tree ns_server/couch/3/
ns_server/couch/3/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 12.couch.1
     ??? 13.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? master.couch.1
     ??? stats.json
     ??? stats.json.old

 1 directory, 9 files
```

For this particular example, because there are `no replicas enabled` (ran
`./cluster_connect -n 4 -r 0` ), each node only has database files for the
vbuckets it's responsible for (active vbuckets). The numeric suffix in each
database filename, starts at 1 when the database file is created and it gets
incremented, by 1, every time the vbucket is compacted. If replication is
enabled, for example you ran `./cluster_connect -n 4 -r 1`, then each node will
have vbucket database files for the vbuckets it's responsible for (active
vbuckets) and for some replica vbuckets, example:


```
shell> tree ns_server/couch/0/

ns_server/couch/0/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 12.couch.1
     ??? 2.couch.1
     ??? 3.couch.1
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 8.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

shell> tree ns_server/couch/1/

ns_server/couch/1/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 0.couch.1
     ??? 1.couch.1
     ??? 13.couch.1
     ??? 4.couch.1
     ??? 5.couch.1
     ??? 6.couch.1
     ??? 7.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

shell> tree ns_server/couch/2/

ns_server/couch/2/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? 2.couch.1
     ??? 6.couch.1
     ??? 8.couch.1
     ??? 9.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files

shell> tree ns_server/couch/3/
ns_server/couch/3/
 ???
_replicator.couch.1
 ???
_users.couch.1
 ??? default
     ??? 10.couch.1
     ??? 11.couch.1
     ??? 12.couch.1
     ??? 13.couch.1
     ??? 14.couch.1
     ??? 15.couch.1
     ??? 3.couch.1
     ??? 7.couch.1
     ??? master.couch.1
     ??? stats.json

 1 directory, 12 files
```

You can figure out which vbucket are active in each node, by querying the
following URL:


```
shell> curl -s http://localhost:9000/pools/default/buckets |
  json_xs
 [
    {
       "quota" :
{
          "rawRAM" : 268435456,
          "ram"
: 1073741824
       },
       "localRandomKeyUri" : "/pools/default/buckets/default/localRandomKey",
       "bucketCapabilitiesVer" : "",
       "authType"
: "sasl",
       "uuid" :
  "89dd5c64504f4a9414a2d3bcf9630d15",
       "replicaNumber" : 1,
       "vBucketServerMap" : {
          "vBucketMap" : [
             [
                0,
                1
             ],
             [
                0,
                1
             ],
             [
                0,
                2
             ],
             [
                0,
                3
             ],
             [
                1,
                0
             ],
             [
                1,
                0
             ],
             [
                1,
                2
             ],
             [
                1,
                3
             ],
             [
                2,
                0
             ],
             [
                2,
                1
             ],
             [
                2,
                3
             ],
             [
                2,
                3
             ],
             [
                3,
                0
             ],
             [
                3,
                1
             ],
             [
                3,
                2
             ],
             [
                3,
                2
             ]
          ],
          "numReplicas" : 1,
          "hashAlgorithm" : "CRC",
          "serverList" : [
             "192.168.1.81:12000",
             "192.168.1.82:12002",
             "192.168.1.83:12004",
             "192.168.1.84:12006"
          ]
       },

(....)
 ]
```

The field to look at is named `vBucketServerMap`, and it contains two important
sub-fields, named `vBucketMap` and `serverList`, which we use to find out which
nodes are responsible for which vbuckets (active vbuckets).

Looking at these 2 fields, we can do the following active and replica vbucket to
node mapping:

 * vbuckets 0, 1, 2 and 3 are active at node 192.168.1.81:12000, and vbuckets 4, 5,
   8 and 12 are replicas at that same node

 * vbuckets 4, 5, 6 and 7 are active at node 192.168.1.82:12002, and vbuckets 0, 1,
   9 and 13 are replicas at that same node

 * vbuckets 8, 9, 10 and 11 are active at node 192.168.1.83:12004, and vbuckets 2,
   6, 14 and 15 are replicas at that same node

 * vbuckets 12, 13, 14 and 15 are active at node 192.168.1.84:12006, and vbucket 3,
   7, 11 and 10

the value of `vBucketMap` is an array of arrays of 2 elements. Each sub-array
corresponds to a vbucket, so the first one is related to vbucket 0, second one
to vbucket 1, etc, and the last one to vbucket 15. Each sub-array element is an
index (starting at 0) into the `serverList` array. First element of each
sub-array tells us which node (server) has the corresponding vbucket marked as
active, while the second element tells us which server has this vbucket marked
as replica.

If the replication factor is greater than 1 (N > 1), then each sub-array will
have N + 1 elements, where first one is always index of server/node that has
that vbucket active and the remaining elements are the indexes of the servers
having the first, second, third, etc replicas of that vbucket.

After knowing which vbuckets are active in each node, we can use some tools such
as `couch_dbinfo` and `couch_dbdump` to analyze active vbucket database files.
Before looking at those tools, lets first know what database sequence numbers
are.

When a couchdb database (remember, each corresponds to a vbucket) is created,
its update\_seq (update sequence number) is 0. When a document is created,
updated or deleted, its current sequence number is incremented by 1. So all the
following sequence of actions result in the final sequence number of 5:

 1. Create document doc1, create document doc2, create document doc3, create
    document doc4, create document doc5

 1. Create document doc1, update document doc1, update document doc1, update
    document doc1, delete document doc1

 1. Create document doc1, delete document doc1, create document doc2, update
    document doc2, update document doc2

 1. Create document doc1, create document doc2, create document doc3, create
    document doc4, update document doc2

 1. etc...

You can see the current update\_seq of a vbucket database file, amongst other
information, with the `couch_dbinfo` command line tool, example with vbucket 0,
active in the first node:


```
shell> ./install/bin/couch_dbinfo ns_server/couch/0/default/0.couch.1
 DB Info
  (ns_server/couch/0/default/0.couch.1)
    file format version: 10
    update_seq: 31250
    doc count: 31250
    deleted doc count: 0
    data size: 3.76 MB
    B-tree size: 1.66 MB
    total disk size: 5.48 MB
```

After updating all the documents in that vbucket database, the update\_seq
doubled:


```
shell> ./install/bin/couch_dbinfo ns_server/couch/0/default/0.couch.1
DB Info
 (ns_server/couch/0/default/0.couch.1)
   file format version: 10
   update_seq: 62500
   doc count: 31250
   deleted doc count: 0
   data size: 3.76 MB
   B-tree size: 1.75 MB
   total disk size: 10.50 MB
```

An important detail, if not obvious, is that with each vbucket database sequence
number one and only one document ID is associated to it. At any time, there's
only one update sequence number associated with a document ID, and it's always
the most recent. We can verify this with the `couch_dbdump` command line tool.
Take the following example, where we only have 2 documents, document with ID
doc1 and document with ID doc2:


```
shell> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 1
     id: doc1
     rev: 1
     content_meta: 0
     cas: 130763975746, expiry: 0, flags: 0
     data: {"value": 1}
Total docs: 1
```

On an empty vbucket 0 database, we created document with ID `doc1`, which has a
JSON value of `{"value": 1}`. This document is now associated with update
sequence number 1. Next we create another document, with ID \*doc2\* and JSON
value `{"value": 2}`, and the output of `couch_dbdump` is:


```
shell> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 1
     id: doc1
     rev: 1
     content_meta: 0
     cas: 130763975746, expiry: 0, flags: 0
     data: {"value": 1}
Doc seq: 2
     id: doc2
     rev: 1
     content_meta: 0
     cas: 176314689876, expiry: 0, flags: 0
     data: {"value": 2}
Total docs: 2
```

Document `doc2` got associated to vbucket 0 database update sequence number 2.
Next, we update document `doc1` with a new JSON value of `{"value": 1111}`, and
`couch_dbdump` tells us:


```
shell> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 2
     id: doc2
     rev: 1
     content_meta: 0
     cas: 176314689876, expiry: 0, flags: 0
     data: {"value": 2}
Doc seq: 3
     id: doc1
     rev: 2
     content_meta: 0
     cas: 201537725466, expiry: 0, flags: 0
     data: {"value": 1111}

Total docs: 2
```

So, document `doc1` is now associated with update sequence number 3. Note that
it's no longer associated with sequence number 1, because the update was the
most recent operation against that document (remember, only 3 operations are
possible: create, update or delete). The database no longer has a record for
sequence number 1 as well. After this, we update document `doc2` with JSON value
`{"value": 2222}`, and we get the following output from `couch_dbdump` :


```
shell> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 3
     id: doc1
     rev: 2
     content_meta: 0
     cas: 201537725466, expiry: 0, flags: 0
     data: {"value": 1111}
Doc seq: 4
     id: doc2
     rev: 2
     content_meta: 0
     cas: 213993873979, expiry: 0, flags:   0
     data: {"value": 2222}

Total docs: 2
```

Document `doc2` is now associated with sequence number 4, and sequence number 2
no longer has a record in the database file. Finally we deleted document `doc1`,
and then we get:


```
shell> ./install/bin/couch_dbdump ns_server/couch/0/default/0.couch.1
Doc seq: 4
     id: doc2
     rev: 2
     content_meta: 0
     cas: 213993873979, expiry: 0, flags: 0
     data: {"value": 2222}
Doc seq: 5
     id: doc1
     rev: 3
     content_meta: 3
     cas: 201537725467, expiry: 0, flags: 0
     doc deleted
     could not read document body: document not found

Total docs: 2
```

Note that document deletes don't really delete documents from the database
files, instead they flag the document has deleted and remove its JSON (or
binary) value. Document `doc1` is now associated with sequence number 5 and the
record for its previously associated sequence number 3, is removed from the
vbucket 0 database file. This allows for example, indexes to know they have to
delete all Key-Value pairs previously emitted by a map function for a document
that was deleted - if there weren't any update sequence number associated with
the delete operation, indexes would have no way to know if documents were
deleted or not.

These details of sequence numbers and document operations are what allow indexes
to be updated incrementally in Couchbase Server (and Apache CouchDB as well).

In Couchbase Server, indexes store in their header (state) the last update\_seq
seen for each vbucket database. Put it simply, whenever an index build/update
finishes, it stores in its header the last update\_seq processed for each
vbucket database. Vbucket databases have states too in indexes, and these states
do not necessarily match the vbucket states in the server. For the goals of this
wiki page, it only matters to mention that view requests with `stale=false` will
be blocked only if the currently stored update\_seq of any active vbucket in the
index header is smaller than the current update\_seq of the corresponding
vbucket database - if this is true for at least one active vbucket, an index
update is scheduled immediately (if not already running) and when it finishes it
will unblock the request. Requests with `stale=false` will not be blocked if the
update\_seq of vbuckets in the index with other states (passive, cleanup,
replica) are smaller than the current update\_seq of the corresponding vbucket
databases - the reason for this is that queries only see rows produced for
documents that live in the active vbuckets.

We can see that states of vbuckets in the index, and the update\_seqs in the
index, by querying the following URL (example for 16 vbuckets only, for the sake
of simplicity):


```
shell> curl -s 'http://localhost:9500/_set_view/default/_design/dev_test2/_info' | json_xs
{
   "unindexable_partitions" : {},
   "passive_partitions" : [],
   "compact_running" : false,
   "cleanup_partitions" : [],
   "replica_group_info" : {
      "unindexable_partitions" : {},
      "passive_partitions" : [
         4,
         5,
         8,
         12
      ],
      "compact_running" : false,
      "cleanup_partitions" : [],
      "active_partitions" : [],
      "pending_transition" : null,
      "db_set_message_queue_len" : 0,
      "out_of_sync_db_set_partitions" : false,
      "expected_partition_seqs" : {
         "8" : 62500,
         "4" : 62500,
         "12" : 62500,
         "5" : 62500
      },
      "updater_running" : false,
      "partition_seqs" : {
         "8" : 62500,
         "4" : 62500,
         "12" : 62500,
         "5" : 62500
      },
      "stats" : {
         "update_history" : [
            {
               "deleted_ids" : 0,
               "inserted_kvs" : 38382,
               "inserted_ids" : 12794,
               "deleted_kvs" : 38382,
               "cleanup_kv_count" : 0,
               "blocked_time" : 1.5e-05,
               "indexing_time" : 3.861918
            }
         ],
         "updater_cleanups" : 0,
         "compaction_history" : [
            {
               "cleanup_kv_count" : 0,
               "duration" : 1.955801
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 2.443478
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 4.956397
            },
            {
               "cleanup_kv_count" : 0,
               "duration" : 9.522231
            }
         ],
         "full_updates" : 1,
         "waiting_clients" : 0,
         "compactions" : 4,
         "cleanups" : 0,
         "partial_updates" : 0,
         "stopped_updates" : 0,
         "cleanup_history" : [],
         "cleanup_interruptions" : 0
      },
      "initial_build" : false,
      "update_seqs" : {
         "8" : 62500,
         "4" : 62500,
         "12" : 62500,
         "5" : 62500
      },
      "partition_seqs_up_to_date" : true,
      "updater_state" : "not_running",
      "data_size" : 5740951,
      "cleanup_running" : false,
      "signature" : "440b0b3ded9d68abb559d58b9fda3e0a",
      "max_number_partitions" : 16,
      "disk_size" : 5742779
   },
   "active_partitions" : [
      0,
      1,
      2,
      3
   ],
   "pending_transition" : null,
   "db_set_message_queue_len" : 0,
   "out_of_sync_db_set_partitions" : false,
   "replicas_on_transfer" : [],
   "expected_partition_seqs" : {
      "1" : 62500,
      "3" : 62500,
      "0" : 62500,
      "2" : 62500
   },
   "updater_running" : false,
   "partition_seqs" : {
      "1" : 62500,
      "3" : 62500,
      "0" : 62500,
      "2" : 62500
   },
   "stats" : {
      "update_history" : [],
      "updater_cleanups" : 0,
      "compaction_history" : [],
      "full_updates" : 0,
      "waiting_clients" : 0,
      "compactions" : 0,
      "cleanups" : 0,
      "partial_updates" : 0,
      "stopped_updates" : 0,
      "cleanup_history" : [],
      "cleanup_interruptions" : 0
   },
   "initial_build" :   false,
   "replica_partitions" : [
      4,
      5,
      8,
      12
   ],
   "update_seqs" : {
      "1" : 31250,
      "3" : 31250,
      "0" : 31250,
      "2" : 31250
   },
   "partition_seqs_up_to_date" : true,
   "updater_state" :   "not_running",
   "data_size" : 5717080,
   "cleanup_running" : false,
   "signature" :   "440b0b3ded9d68abb559d58b9fda3e0a",
   "max_number_partitions" : 16,
   "disk_size" : 5726395
}
```

The output gives us several fields useful to diagnose issues in the server. The
field `replica_group_info` can be ignored for the goals of this wiki (would only
be useful during a failover), the information it contains is similar to the top
level information, which is the one for the main/principal index, which is the
one we care about during steady state and during rebalance.

Some of the top level fields and their meaning:

 * `active_partitions` - this is a list with the ID of all the vbuckets marked as
   active in the index.

 * `passive_partitions` - this is a list with the ID of all vbuckets marked as
   passive in the index.

 * `cleanup_partitions` - this is a list with the ID of all vBuckets marked as
   cleanup in the index.

 * `compact_running` - true if index compaction is ongoing, false otherwise.

 * `updater_running` - true if index build/update is ongoing, false otherwise.

 * `update_seqs` - this tells us what up to which vbucket database update\_seqs the
   index reflects data, keys are vbucket IDs and values are update\_seqs. The
   update\_seqs here are always smaller or equal then the values in
   `partition_seqs` and `expected_partition_seqs`. If the value of any update\_seq
   here is smaller than the corresponding value in `partition_seqs` or
   `expected_partition_seqs`, than it means the index is not up to date (it's
   stale), and a subsequent query with `stale=false` will be blocked and spawn an
   index update (if not already running).

 * `partition_seqs` - this tells us what are the current update\_seqs for each
   vbucket database. If any update\_seq value here is greater than the
   corresponding value in `update_seqs`, we can say the index is not up to date
   (it's stale). See the description above for `update_seqs`.

 * `expected_partition_seqs` - this should normally tells us exactly the same as
   `partition_seqs` (see above). Index processes have an optimization where they
   monitor vbucket database updates and track their current update\_seqs, so that
   when the index needs to know them, it doesn't need to consult them from the
   databases (expensive, from a performance perspective). The update\_seqs in this
   field are obtained by consulting each database file. If they don't match the
   corresponding values in `partition_seqs`, then we can say there's an issue in
   the view-engine.

 * `unindexable_partitions` - this field should be non-empty only during rebalance.
   Vbuckets that are in this meta state "unindexable" means that index updates will
   ignore these vbuckets. Transitions to and from this state are used by ns\_server
   for consistent views during rebalance. When not in rebalance, this field should
   always be empty, if not, then there's a issue somewhere. The value for this
   field, when non-empty, is an object whose keys are vbucket IDs and values are
   update\_seqs.

Using the information given by this URL (remember, it's on a per node basis), to
check the vbucket states and indexed update\_seqs, together with the tools
`couch_dbinfo` and `couch_dbdump` (against all active vbucket database files),
one can debug where (which component) a problem is. For example, it's useful to
find if it's the indexes that are not indexing latest data/updates/processing
deletes, or if the memcached/ep-engine layer is not persisting data/updates to
disk or if there's some issue in couchstore (component which writes to database
files) that causes it to not write data or write incorrect data to the database
file.

An example where using these tools and the information from the URL
/\_set\_view/bucketname/\_design/ddocid/\_info was very important to find which
component was misbehaving is at
[http://www.couchbase.com/issues/browse/MB-5534](http://www.couchbase.com/issues/browse/MB-5534).
In this case Tommie was able to identify that the problem was in ep-engine.

<a id="couchbase-views-debugging-indexfs"></a>

## Index filesystem structure and meaning

All index files live within a subdirectory of the data directory named
`@indexes`. Within this subdirectory, there's a subdirectory for each bucket
(which matches exactly the bucket name).

Any index file has the form `<type>_<hexadecimal_signature>.view.N` Each
component's meaning is:

 * `type` - the index type, can be main (active vbuckets data) or replica (replica
   vbuckets data)

 * `hexadecimal_signature` - this is the hexadecimal form of an MD5 hash computed
   over the map/reduce functions of a design document, when these functions change,
   a new index is created. It's possible to have multiple versions of the same
   design document alive (different signatures). This happens for a short period,
   for example a client does a `stale=false` request to an index (1 index == 1
   design document), which triggers an index build/update and before this
   update/build finishes, the design document is updated (with different map/reduce
   functions). The initial version of the index will remain alive until all
   currently blocked clients on it are served. In the meanwhile new query requests
   are redirected to the latest (second) version of the index, always. This is what
   makes it possible to have multiple versions of the same design document index
   files at any point in time (however for short periods).

 * `N` - when an index file is created N is 1, always. Every time the index file is
   compacted, N is incremented by 1. This is similar to what happens for vbucket
   database files (see [Data missing in query response or it's wrong (potentially
   due to server
   issues)](couchbase-manual-ready.html#couchbase-views-debugging-datamissing) ).

For each design document, there's also a subdirectory named like
`tmp_<hexadecimal_signature>_<type>`. This is a directory containing temporary
files used for the initial index build (and soon for incremental optimizations).
Files within this directory have a name formed by the design document signature
and a generated UUID. These files are periodically deleted when they're not
useful anymore.

All views defined within a design document are backed by a btree data structure,
and they all live inside the same index file. Therefore for each design
document, independently of the number of views it defines, there's 2 files, one
for main data and the other for replica data.

Example:


```
shell> tree couch/0/\@indexes/
couch/0/@indexes/
 ??? default
     ???
main_018b83ca22e53e14d723ea858ba97168.view.1
     ???
main_15e1f576bc85e3e321e28dc883c90077.view.1
     ???
main_440b0b3ded9d68abb559d58b9fda3e0a.view.1
     ???
main_4995c136d926bdaf94fbe183dbf5d5aa.view.1
     ???
main_fd2bdf6191e61af6e801e3137e2f1102.view.1
     ???
replica_018b83ca22e53e14d723ea858ba97168.view.1
     ???
replica_15e1f576bc85e3e321e28dc883c90077.view.1
     ???
replica_440b0b3ded9d68abb559d58b9fda3e0a.view.1
     ???
replica_4995c136d926bdaf94fbe183dbf5d5aa.view.1
     ???
replica_fd2bdf6191e61af6e801e3137e2f1102.view.1
     ???
tmp_018b83ca22e53e14d723ea858ba97168_main
     ???
tmp_15e1f576bc85e3e321e28dc883c90077_main
     ???
tmp_440b0b3ded9d68abb559d58b9fda3e0a_main
     ???
tmp_4995c136d926bdaf94fbe183dbf5d5aa_main
     ???
tmp_fd2bdf6191e61af6e801e3137e2f1102_main

 6 directories, 10 files
```

<a id="couchbase-views-debugging-aliases"></a>

## Design document aliases

When 2 or more design documents have exactly the same map and reduce functions
(but different IDs of course), they get the same signature (see [Index
filesystem structure and
meaning](couchbase-manual-ready.html#couchbase-views-debugging-indexfs) ). This
means that both point to the same index files, and it's exactly this feature
that allows publishing development design documents into production, which
consists of creating a copy of the development design document (ID matches
\_design/dev\_foobar) with an ID not containing the `dev_` prefix and then
deleting the original development document, which ensure the index files are
preserved after deleting the development design document. It's also possible to
have multiple "production" aliases for the same production design document. The
view engine itself has no notion of development and production design documents,
this is a notion only at the UI and cluster layers, which exploits the design
document signatures/aliases feature.

The following example shows this property.

We create 2 identical design documents, only their IDs differ:


```
shell> curl -H 'Content-Type: application/json' \
    -X PUT 'http://localhost:9500/default/_design/ddoc1' \
    -d '{ "views": {"view1": {"map": "function(doc, meta) { emit(doc.level, meta.id); }"}}}'
{"ok":true,"id":"_design/ddoc1"}

shell> curl -H 'Content-Type: application/json' \
    -X PUT 'http://localhost:9500/default/_design/ddoc2'
    -d '{ "views": {"view1": {"map": "function(doc, meta) { emit(doc.level, meta.id); }"}}}'
{"ok":true,"id":"_design/ddoc2"}
```

Next we query view1 from \_design/ddoc1 with `stale=false`, and get:


```
shell> curl -s 'http://localhost:9500/default/_design/ddoc1/_view/view1?limit=10&stale=false'
{"total_rows":1000000,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"},
{"id":"0000464","key":1,"value":"0000464"},
{"id":"0000496","key":1,"value":"0000496"},
{"id":"0000604","key":1,"value":"0000604"},
{"id":"0000626","key":1,"value":"0000626"}
]
}
```

If immediately after you query view1 from \_design/ddoc2 with `stale=ok`, you'll
get exactly the same results, because both design documents are aliases, they
share the same signature:


```
shell> curl -s 'http://localhost:9500/default/_design/ddoc2/_view/view1?limit=10&stale=ok'
{"total_rows":1000000,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"},
{"id":"0000464","key":1,"value":"0000464"},
{"id":"0000496","key":1,"value":"0000496"},
{"id":"0000604","key":1,"value":"0000604"},
{"id":"0000626","key":1,"value":"0000626"}
]
}
```

If you look into the data directory, there's only one main index file and one
replica index file:


```
shell> tree couch/0/\@indexes
couch/0/@indexes
 ??? default
     ???
main_1909e1541626269ef88c7107f5123feb.view.1
     ???
replica_1909e1541626269ef88c7107f5123feb.view.1
     ???
tmp_1909e1541626269ef88c7107f5123feb_main

 2 directories, 2 files
```

Also, while the indexer is running, if you query `_active_tasks` for a node,
you'll see one single indexer task, which lists both design documents in the
`design_documents` array field:


```
shell> curl -s http://localhost:9500/_active_tasks | json_xs
[
   {
      "waiting" : 0,
      "started_on" : 1345662986,
      "pid" :   "<0.234.0>",
      "type" :   "couch_main_index_barrier",
      "running" : 1,
      "limit" : 4,
      "updated_on" : 1345663590
   },
   {
      "waiting" : 0,
      "started_on" : 1345662986,
      "pid" : "<0.235.0>",
      "type" :   "couch_replica_index_barrier",
      "running" : 0,
      "limit" : 2,
      "updated_on" : 1345662986
   },
   {
      "indexer_type" : "main",
      "started_on" : 1345663590,
      "progress" : 75,
      "initial_build" : true,
      "updated_on" : 1345663634,
      "total_changes" : 250000,
      "design_documents" : [
         "_design/ddoc1",
         "_design/ddoc2"
      ],
      "pid" :   "<0.6567.0>",
      "changes_done" : 189635,
      "signature" : "1909e1541626269ef88c7107f5123feb",
      "type" :   "indexer",
      "set" :   "default"
   }
]
```

<a id="couchbase-views-debugging-singlenode"></a>

## Getting query results from a single node

There's a special URI which allows to get index results only from the targeted
node. It is used only for development and debugging, not meant to be public.
Here follows an example where we query 2 different nodes from a 4 nodes cluster.


```
shell> curl -s 'http://192.168.1.80:9500/_set_view/default/_design/ddoc2/_view/view1?limit=4'
{"total_rows":250000,"offset":0,"rows":[
{"id":"0000136","key":1,"value":"0000136"},
{"id":"0000205","key":1,"value":"0000205"},
{"id":"0000716","key":1,"value":"0000716"},
{"id":"0000719","key":1,"value":"0000719"}
]}
shell> curl -s 'http://192.168.1.80:9500/_set_view/default/_design/ddoc2/_view/view1?limit=4'
{"total_rows":250000,"offset":0,"rows":[
{"id":"0000025","key":1,"value":"0000025"},
{"id":"0000158","key":1,"value":"0000158"},
{"id":"0000208","key":1,"value":"0000208"},
{"id":"0000404","key":1,"value":"0000404"}
]}
```

`Note:` for this special API, the default value of the stale parameter is
`stale=false`, while for the public, documented API the default is
`stale=update_after`.

<a id="couchbase-views-debugging-replicaindex"></a>

## Verifying replica index and querying it (debug/testing)

It's not easy to test/verify from the outside that the replica index is working.
Remember, replica index is optional, and it's just an optimization for faster
`stale=false` queries after rebalance - it doesn't cope with correctness of the
results.

There's a non-public query parameter named `_type` used only for debugging and
testing. Its default value is `main`, and the other possible value is `replica`.
Here follows an example of querying the main (default) and replica indexes on a
2 nodes cluster (for sake of simplicity), querying the main (normal) index
gives:


```
shell> curl -s 'http://localhost:9500/default/_design/test/_view/view1?limit=20&stale=false&debug=true'
{"total_rows":20000,"rows":[
{"id":"0017131","key":2,"partition":43,"node":"http://192.168.1.80:9501/_view_merge/","value":"0017131"},
{"id":"0000225","key":10,"partition":33,"node":"http://192.168.1.80:9501/_view_merge/","value":"0000225"},
{"id":"0005986","key":15,"partition":34,"node":"http://192.168.1.80:9501/_view_merge/","value":"0005986"},
{"id":"0015579","key":17,"partition":27,"node":"local","value":"0015579"},
{"id":"0018530","key":17,"partition":34,"node":"http://192.168.1.80:9501/_view_merge/","value":"0018530"},
{"id":"0006210","key":23,"partition":2,"node":"local","value":"0006210"},
{"id":"0006866","key":25,"partition":18,"node":"local","value":"0006866"},
{"id":"0019349","key":29,"partition":21,"node":"local","value":"0019349"},
{"id":"0004415","key":39,"partition":63,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004415"},
{"id":"0018181","key":48,"partition":5,"node":"local","value":"0018181"},
{"id":"0004737","key":49,"partition":1,"node":"local","value":"0004737"},
{"id":"0014722","key":51,"partition":2,"node":"local","value":"0014722"},
{"id":"0003686","key":54,"partition":38,"node":"http://192.168.1.80:9501/_view_merge/","value":"0003686"},
{"id":"0004656","key":65,"partition":48,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004656"},
{"id":"0012234","key":65,"partition":10,"node":"local","value":"0012234"},
{"id":"0001610","key":71,"partition":10,"node":"local","value":"0001610"},
{"id":"0015940","key":83,"partition":4,"node":"local","value":"0015940"},
{"id":"0010662","key":87,"partition":38,"node":"http://192.168.1.80:9501/_view_merge/","value":"0010662"},
{"id":"0015913","key":88,"partition":41,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015913"},
{"id":"0019606","key":90,"partition":22,"node":"local","value":"0019606"}
],
```

Note that the `debug=true` parameter, for map views, add 2 row fields,
`partition` which is the vbucket ID where the document that produced this row
(emitted by the map function) lives, and `node` which tells from which node in
the cluster the row came (value "local" for the node which received the query,
an URL otherwise).

Now, doing the same query but against the replica index ( `_type=replica` )
gives:


```
shell> curl -s 'http://localhost:9500/default/_design/test/_view/view1?limit=20&stale=false&_type=replica&debug=true'
{"total_rows":20000,"rows":[
{"id":"0017131","key":2,"partition":43,"node":"local","value":"0017131"},
{"id":"0000225","key":10,"partition":33,"node":"local","value":"0000225"},
{"id":"0005986","key":15,"partition":34,"node":"local","value":"0005986"},
{"id":"0015579","key":17,"partition":27,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015579"},
{"id":"0018530","key":17,"partition":34,"node":"local","value":"0018530"},
{"id":"0006210","key":23,"partition":2,"node":"http://192.168.1.80:9501/_view_merge/","value":"0006210"},
{"id":"0006866","key":25,"partition":18,"node":"http://192.168.1.80:9501/_view_merge/","value":"0006866"},
{"id":"0019349","key":29,"partition":21,"node":"http://192.168.1.80:9501/_view_merge/","value":"0019349"},
{"id":"0004415","key":39,"partition":63,"node":"local","value":"0004415"},
{"id":"0018181","key":48,"partition":5,"node":"http://192.168.1.80:9501/_view_merge/","value":"0018181"},
{"id":"0004737","key":49,"partition":1,"node":"http://192.168.1.80:9501/_view_merge/","value":"0004737"},
{"id":"0014722","key":51,"partition":2,"node":"http://192.168.1.80:9501/_view_merge/","value":"0014722"},
{"id":"0003686","key":54,"partition":38,"node":"local","value":"0003686"},
{"id":"0004656","key":65,"partition":48,"node":"local","value":"0004656"},
{"id":"0012234","key":65,"partition":10,"node":"http://192.168.1.80:9501/_view_merge/","value":"0012234"},
{"id":"0001610","key":71,"partition":10,"node":"http://192.168.1.80:9501/_view_merge/","value":"0001610"},
{"id":"0015940","key":83,"partition":4,"node":"http://192.168.1.80:9501/_view_merge/","value":"0015940"},
{"id":"0010662","key":87,"partition":38,"node":"local","value":"0010662"},
{"id":"0015913","key":88,"partition":41,"node":"local","value":"0015913"},
{"id":"0019606","key":90,"partition":22,"node":"http://192.168.1.80:9501/_view_merge/","value":"0019606"}
],
```

Note that you get exactly the same results (id, key and value for each row).
Looking at the row field `node`, you can see there's a duality when compared to
the results we got from the main index, which is very easy to understand for the
simple case of a 2 nodes cluster.

To find out which replica vbuckets exist in each node, see section [Data missing
in query response or it's wrong (potentially due to server
issues)](couchbase-manual-ready.html#couchbase-views-debugging-datamissing).

<a id="couchbase-views-debugging-totalrows"></a>

## Expected cases for total_rows with a too high value

In some scenarios, it's expected to see queries returning a `total_rows` field
with a value higher than the maximum rows they can return (map view queries
without an explicit `limit`, `skip`, `startkey` or `endkey` ).

The expected scenarios are during rebalance, and immediately after a failover
for a finite period of time.

This happens because in these scenarios some vbuckets are marked for cleanup in
the indexes, temporarily marked as passive, or data is being transferred from
the replica index to the main index (after a failover). While the rows
originated from those vbuckets are never returned to queries, they contribute to
the reduction value of every view btree, and this value is what is used for the
`total_rows` field in map view query responses (it's simply a counter with total
number of Key-Value pairs per view).

Ensuring that `total_rows` always reflected the number of rows originated from
documents in active vbuckets would be very expensive, severely impacting
performance. For example, we would need to maintain a different value in the
btree reductions which would map vbucket IDs to row counts:


```
{"0":56, "1": 2452435, ..., "1023": 432236}
```

This would significantly reduce the btrees branching factor, making them much
more deep, using more disk space and taking more time to compute reductions on
inserts/updates/deletes.

To know if there are vbuckets under cleanup, vbuckets in passive state or
vbuckets being transferred from the replica index to main index (on failover),
one can query the following URL:


```
shell> curl -s 'http://localhost:9500/_set_view/default/_design/dev_test2/_info' | json_xs
{
   "passive_partitions" : [1, 2, 3],
   "cleanup_partitions" : [],
   "replicas_on_transfer" : [1, 2, 3],
   (....)
}
```

Note that the example above intentionally hides all non-relevant fields. If any
of the fields above is a non-empty list, than `total_rows` for a view may be
higher than expected, that is, we're under one of those expected scenarios
mentioned above. In steady state all of the above fields are empty lists.

<a id="couchbase-views-debugging-btreestats"></a>

## Getting view btree stats for performance and longevity analysis

As of 2.0 build 1667, there is a special (non-public) URI to get statistics for
all the btrees of an index (design document). These statistics are developer
oriented and are useful for analyzing performance and longevity issues. Example:


```
shell> curl -s 'http://localhost:9500/_set_view/default/_design/test3/_btree_stats' | python -mjson.tool
{
    "id_btree": {
        "avg_elements_per_kp_node": 19.93181818181818,
        "avg_elements_per_kv_node": 75.00750075007501,
        "avg_kp_node_size": 3170.159090909091,
        "avg_kp_node_size_compressed": 454.0511363636364,
        "avg_kv_node_size": 2101.2100210021,
        "avg_kv_node_size_compressed": 884.929492949295,
        "btree_size": 3058201,
        "chunk_threshold": 5120,
        "file_size": 11866307,
        "fragmentation": 74.22786213098988,
        "kp_nodes": 176,
        "kv_count": 250000,
        "kv_nodes": 3333,
        "max_depth": 4,
        "max_elements_per_kp_node": 27,
        "max_elements_per_kv_node": 100,
        "max_kp_node_size": 4294,
        "max_kp_node_size_compressed": 619,
        "max_kv_node_size": 2801,
        "max_kv_node_size_compressed": 1161,
        "max_reduction_size": 133,
        "min_depth": 4,
        "min_elements_per_kp_node": 8,
        "min_elements_per_kv_node": 75,
        "min_kp_node_size":,
        "min_kp_node_size_compressed": 206,
        "min_kv_node_size": 2101,
        "min_kv_node_size_compressed": 849,
        "min_reduction_size": 133
    },
    "view1": {
        "avg_elements_per_kp_node": 17.96416938110749,
        "avg_elements_per_kv_node": 23.99923202457521,
        "avg_kp_node_size": 3127.825732899023,
        "avg_kp_node_size_compressed": 498.3436482084691,
        "avg_kv_node_size": 3024.903235096477,
        "avg_kv_node_size_compressed": 805.7447441681866,
        "btree_size": 8789820,
        "chunk_threshold": 5120,
        "file_size": 11866307,
        "fragmentation": 25.92623804524862,
        "kp_nodes": 614,
        "kv_count": 250000,
        "kv_nodes": 10417,
        "max_depth": 5,
        "max_elements_per_kp_node": 21,
        "max_elements_per_kv_node": 24,
        "max_kp_node_size": 3676,
        "max_kp_node_size_compressed": 606,
        "max_kv_node_size": 3025,
        "max_kv_node_size_compressed": 852,
        "max_reduction_size": 141,
        "min_depth": 5,
        "min_elements_per_kp_node": 2,
        "min_elements_per_kv_node": 16,
        "min_kp_node_size": 357,
        "min_kp_node_size_compressed": 108,
        "min_kv_node_size": 2017,
        "min_kv_node_size_compressed": 577,
        "min_reduction_size": 137
    }
}
```

Note that these statistics are per node, therefore for performance and longevity
analysis, you should query this URI for all nodes in the cluster. Getting these
statistics can take from several seconds to several minutes, depending on the
size of the dataset (it needs to traverse the entire btrees in order to compute
the statistics).

<a id="couchbase-views-debugging-debugstale"></a>

## Debugging stale=false queries for missing/unexpected data

The query parameter `debug=true` can be used to debug queries with `stale=false`
that are not returning all expected data or return unexpected data. This is
particularly useful when clients issue a `stale=false` query right after being
unblocked by a memcached OBSERVE command. An example issue where this happened
is [MB-7161](http://www.couchbase.com/issues/browse/MB-7161).

Here follows an example of how to debug this sort of issues on a simple scenario
where there's only 16 vbuckets (instead of 1024) and 2 nodes. The tools
`couchdb_dump` and `couchdb_info` (from the couchstore git project) are used to
help analyze this type of issues (available under `install/bin` directory).

Querying a view with `debug=true` will add an extra field, named `debug_info` in
the view response. This field has one entry per node in the cluster (if no
errors happened, like down/timed out nodes for example). Example:


```
shell> curl -s 'http://localhost:9500/default/_design/test/_view/view1?stale=false&limit=5&debug=true' | json_xs
 {
    "debug_info" : {
       "local" : {
          "main_group" : {
             "passive_partitions" : [],
             "wanted_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "wanted_seqs" : {
                "0002" : 62500,
                "0001" : 62500,
                "0006" : 62500,
                "0005" : 62500,
                "0004" : 62500,
                "0000" : 62500,
                "0007" : 62500,
                "0003" : 62500
             },
             "indexable_seqs" : {
                "0002" : 62500,
                "0001" : 62500,
                "0006" : 62500,
                "0005" : 62500,
                "0004" : 62500,
                "0000" : 62500,
                "0007" : 62500,
                "0003" : 62500
             },
             "cleanup_partitions" : [],
             "stats" : {
                "update_history" : [
                   {
                      "deleted_ids" : 0,
                      "inserted_kvs" :00,
                      "inserted_ids" :00,
                      "deleted_kvs" : 0,
                      "cleanup_kv_count" : 0,
                      "blocked_time" : 0.000258,
                      "indexing_time" : 103.222201
                   }
                ],
                "updater_cleanups" : 0,
                "compaction_history" : [],
                "full_updates" : 1,
                "accesses" : 1,
                "cleanups" : 0,
                "compactions" : 0,
                "partial_updates" : 0,
                "stopped_updates" : 0,
                "cleanup_history" : [],
                "update_errors" : 0,
                "cleanup_stops" : 0
             },
             "active_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "pending_transition" : null,
             "unindexeable_seqs" : {},
             "replica_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "original_active_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "original_passive_partitions" : [],
             "replicas_on_transfer" : []
          }
       },
       "http://10.17.30.98:9501/_view_merge/" :   {
          "main_group" : {
             "passive_partitions" : [],
             "wanted_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "wanted_seqs" : {
                "0008" : 62500,
                "0009" : 62500,
                "0011" : 62500,
                "0012" : 62500,
                "0015" : 62500,
                "0013" : 62500,
                "0014" : 62500,
                "0010" : 62500
             },
             "indexable_seqs" : {
                "0008" : 62500,
                "0009" : 62500,
                "0011" : 62500,
                "0012" : 62500,
                "0015" : 62500,
                "0013" : 62500,
                "0014" : 62500,
                "0010" : 62500
             },
             "cleanup_partitions" : [],
             "stats" : {
                "update_history" : [
                   {
                      "deleted_ids" : 0,
                      "inserted_kvs" :00,
                      "inserted_ids" :00,
                      "deleted_kvs" : 0,
                      "cleanup_kv_count" : 0,
                      "blocked_time" : 0.000356,
                      "indexing_time" : 103.651148
                   }
                ],
                "updater_cleanups" : 0,
                "compaction_history" : [],
                "full_updates" : 1,
                "accesses" : 1,
                "cleanups" : 0,
                "compactions" : 0,
                "partial_updates" : 0,
                "stopped_updates" : 0,
                "cleanup_history" : [],
                "update_errors" : 0,
                "cleanup_stops" : 0
             },
             "active_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "pending_transition" : null,
             "unindexeable_seqs" : {},
             "replica_partitions" : [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7
             ],
             "original_active_partitions" : [
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
             ],
             "original_passive_partitions" : [],
             "replicas_on_transfer" : []
          }
       }
    },
    "total_rows" : 1000000,
    "rows" : [
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "orc"
          },
          "id" : "0000014",
          "node" : "http://10.17.30.98:9501/_view_merge/",
          "partition" : 14,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "orc"
          },
          "id" : "0000017",
          "node" : "local",
          "partition" : 1,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "priest",
             "category" : "human"
          },
          "id" : "0000053",
          "node" : "local",
          "partition" : 5,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "priest",
             "category" : "orc"
          },
          "id" : "0000095",
          "node" : "http://10.17.30.98:9501/_view_merge/",
          "partition" : 15,
          "key" : 1
       },
       {
          "value" : {
             "ratio" : 1.8,
             "type" : "warrior",
             "category" : "elf"
          },
          "id" : "0000151",
          "node" : "local",
          "partition" : 7,
          "key" : 1
       }
    ]
 }
```

For each node, there are 2 particular fields of interest when debugging
`stale=false` queries that apparently miss some data:

 * `wanted_seqs` - This field has an object (dictionary) value where keys are
   vbucket IDs and values are vbucket database sequence numbers (see [Data missing
   in query response or it's wrong (potentially due to server
   issues)](couchbase-manual-ready.html#couchbase-views-debugging-datamissing) for
   an explanation of sequence numbers). This field tells us the sequence number of
   each vbucket database file (at the corresponding node) at the moment the query
   arrived at the server (all these vbuckets are `active vbuckets` ).

 * `indexable_seqs` - This field has an object (dictionary) value where keys are
   vbucket IDs and values are vbucket database sequence numbers. This field tells
   us, for each active vbucket database, up to which sequence the index has
   processed/indexed documents (remember, each vbucket database sequence number is
   associated with 1, and only 1, document).

For queries with `stale=false`, all the sequences in `indexable_seqs` must be
greater or equal then the sequences in `wanted_seqs` - otherwise the
`stale=false` option can be considered broken. What happens behind the scenes
is, at each node, when the query request arrives, the value for `wanted_seqs` is
computed (by asking each active vbucket database for its current sequence
number), and if any sequence is greater than the corresponding entry in
`indexable_seqs` (stored in the index), the client is blocked, the indexer is
started to update the index, the client is unblocked when the indexer finishes
updating the index, and finally the server starts streaming rows to the client -
note that at this point, all sequences in `indexable_seqs` are necessarily
greater or equal then the corresponding sequences in `wanted_sequences`,
otherwise the `stale=false` implementation is broken.

<a id="couchbase-views-debugging-reportingissues"></a>

## What to include in good issue reports (JIRA)

When reporting issues to Couchbase (using
[couchbase.com/issues](http://www.couchbase.com/issues) ), you should always add
the following information to JIRA issues:

 * Environment description (package installation? cluster\_run? build number? OS)

 * All the steps necessary to reproduce (if applicable)

 * Show the full content of all the design documents

 * Describe how your documents are structured (all same structure, different
   structures?)

 * If you generated the data with any tool, mention its name and all the parameters
   given to it (full command line)

 * Show what queries you were doing (include all query parameters, full url), use
   curl with option -v and show the full output, example:


```
shell> curl -v 'http://localhost:9500/default/_design/test/_view/view1?limit=10&stale=false'
* About to connect() to localhost port 9500 (#0)
*   Trying ::1... Connection refused
*   Trying 127.0.0.1... connected
* Connected to localhost (127.0.0.1) port 9500 (#0)
> GET /default/_design/test/_view/view1 HTTP/1.1
> User-Agent: curl/7.21.4 (universal-apple-darwin11.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5
> Host: localhost:9500
> Accept: */*
>
< HTTP/1.1 200 OK
< Transfer-Encoding: chunked
< Server: MochiWeb/1.0 (Any of you quaids got a smint?)
< Date: Tue, 21 Aug 2012 14:43:06 GMT
< Content-Type: text/plain;charset=utf-8
< Cache-Control: must-revalidate
<
{"total_rows":2,"rows":[
{"id":"doc1","key":"doc1","value":111111},
{"id":"doc2","key":"doc2","value":222222}
]
}
* Connection #0 to host localhost left intact
* Closing connection #0
```

 * Repeat the query with different values for the stale parameter and show the
   output

 * Attach logs from all nodes in the cluster

 * Try all view related operations, including design document
   creation/update/deletion, from the command line. The goal here to isolate UI
   problems from the view engine.

 * If you suspect the indexer is stuck, blocked, etc, please use curl against the
   `_active_tasks` API to confirm that, the goal again is to isolate UI issues from
   view-engine issues. Example:

    ```
    shell> curl -s 'http://localhost:9500/_active_tasks' | json_xs
    [
       {
          "indexer_type" : "main",
          "started_on" : 1345645088,
          "progress" : 43,
          "initial_build" : true,
          "updated_on" : 1345645157,
          "total_changes" : 250000,
          "design_documents" : [
             "_design/test"
          ],
          "pid" : "<0.5948.0>",
          "changes_done" : 109383,
          "signature" : "4995c136d926bdaf94fbe183dbf5d5aa",
          "type" : "indexer",
          "set" : "default"
       }
    ]
    ```

Note that the `started_on` and `update_on` fields are UNIX timestamps. There are
tools (even online) and programming language APIs (Perl, Python, etc) to convert
them into human readable form, including date and time. Note that the
`_active_tasks` API contains information per node, so you'll have to query
`_active_tasks` or every node in the cluster to verify if progress is stuck,
etc.

<a id="couchbase-server-rn"></a>

# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Server. To browse or submit new issues, see [Couchbase Server Issues
Tracker](http://www.couchbase.com/issues/browse/MB).

<a id="couchbase-server-rn_2-0-0l"></a>

## Release Notes for Couchbase Server 2.0.1 GA (March 2013)

Couchbase Server 2.0.1 is first maintenance release for Couchbase Server 2.0.
This release contains number of enhancements particularly for the rebalance,
indexing and compaction operations. In addition, it also includes some critical
bug fixes related to system timeouts and system stability. This includes:

 * Improves rebalance operation time for key-value use cases.

 * Improves coordination of index compaction and index building that occurs during
   the rebalance operation. This helps significantly reduce the index file size
   growth during rebalance.

 * Changes to high and low water marks that provides more usable memory for users.

 * Fixes timeout problems that were seen due to Erlang VM settings.

 * Fixes a critical indexing problem. A document that produced a runtime failure in
   one view had been unavailable to all other views within the same design
   document.

**Fixes in 2.0.1**

 * **Installation and Upgrade**

    * We now provide a warning message on minimal system requirements for Couchbase
      Server. This appears on Linux in the terminal, and on Windows as a InstallShield
      screen. For more information about minimum platform requirements, see the
      section
      [Preparation](couchbase-manual-ready.html#couchbase-getting-started-prepare).

      *Issues* : [MB-7482](http://www.couchbase.com/issues/browse/MB-7482)

 * **Cluster Operations**

    * The server had experienced timeouts during rebalance if views were being indexed
      or compacted at the same time. This resulted in the rebalance to fail. This has
      been fixed.

      *Issues* : [MB-6595](http://www.couchbase.com/issues/browse/MB-6595)

    * In the past, if you were performing an online upgrade of a 1.8 cluster to 2.0 by
      adding 2.0 nodes, the dynamic configuration file on 2.0 nodes would be purged.
      This resulted in any XDCR remote cluster references to be lost on the 2.0 nodes
      and would produce this error message `"case_clause,error"`. This is now fixed.

      *Issues* : [MB-7568](http://www.couchbase.com/issues/browse/MB-7568)

    * The server had experienced random timeouts possible due to lack of asynchronous
      I/O threads. This caused rebalance to fail. This has been fixed.

      *Issues* : [MB-7182](http://www.couchbase.com/issues/browse/MB-7182)

 * **Command-line Tools**

    * There is a new setting available in `cbepctl` named `mutation_mem_threshold`.
      This is the amount of RAM that can be used on the server before a client begins
      receiving temporary out of memory errors. For more information, see [Changing
      Setting for Out Of Memory
      Errors](couchbase-manual-ready.html#couchbase-admin-cbepctl-mutation_mem).

      *Issues* : [MB-7540](http://www.couchbase.com/issues/browse/MB-7540)

 * **Indexing and Querying**

    * In past releases of Couchbase Server 2.0, if you had a map function that failed
      to index, other functions in the same design document would also fail. This has
      been fixed.

      *Issues* : [MB-6895](http://www.couchbase.com/issues/browse/MB-6895)

    * During rebalance, index files were growing to an unnecessarily large size. This
      has been fixed.

      *Issues* : [MB-6799](http://www.couchbase.com/issues/browse/MB-6799)

    * There is a new REST-API call which can be used if you experience a slow
      rebalance while indexing and compaction are in progress. For more information,
      see [Adjusting Rebalance during
      Compaction](couchbase-manual-ready.html#couchbase-admin-restapi-rebalance-before-compaction).

      *Issues* : [MB-7843](http://www.couchbase.com/issues/browse/MB-7843)

 * **Cross Datacenter Replication (XDCR)**

    * Stats for XDCR had erroneously omitted the time taken to commit items and had
      also displayed the incorrect number of documents/mutations checked and
      replicated. This is fixed.

      *Issues* : [MB-7275](http://www.couchbase.com/issues/browse/MB-7275)

    * When you create a replication between two clusters, you may see two error
      messages: "Failed to grab remote bucket info, vbucket" and "Error replicating
      vbucket X". Nonetheless, replication will still start and then function as
      expected, but the error messages may appear for some time in the Web Console.
      This has been fixed.

      *Issues* : [MB-7786](http://www.couchbase.com/issues/browse/MB-7786),
      [MB-7457](http://www.couchbase.com/issues/browse/MB-7457)

**Known Issues in 2.0.1**

 * **Installation and Upgrade**

    * When you upgrade from Couchbase Server 2.0.0 to 2.0.1 on Linux the install may
      not replace the `file2.beam` with the latest version. This will cause indexing
      and querying to fail. The workaround is to install 2.0.1 and then manually
      restart Couchbase Server with the following commands:

       ```
       sudo /etc/init.d/couchbase-server stop
       sudo /etc/init.d/couchbase-server start
       ```

      *Issues* : [MB-7770](http://www.couchbase.com/issues/browse/MB-7770)

    * If you perform an online upgrade from Couchbase Server 2.0.0 to 2.0.1, rebalance
      may exit with the error:

       ```
       {{{linked_process_died,....,normal},
       {gen_server,call,
       ['capi_set_view_manager-sasl',
       {set_vbucket_states,
       ```

      *Issues* : [MB-7771](http://www.couchbase.com/issues/browse/MB-7771)

 * **Database Operations**

    * In OpenVZ Linux containers, the server had crashed and restarted when you
      created a Couchbase bucket. This was due to an issue in the memsup process from
      Erlang. To fix this issue, you should upgrade to the latest version of Erlang,
      and have Couchbase Server use this version:

       1. Stop Couchbase Server.

       1. Make a copy of your original memsup then get the patch available on GitHub:
          [memsup patch](https://github.com/vorobev/otp/compare/maint-memsup.patch ).

       1. Place the compiled code in `/opt/membase/lib/erlang/lib/os_mon-2.2.5/priv/bin/`.

       1. Start Couchbase Server.

      *Issues* : [MB-7626](http://www.couchbase.com/issues/browse/MB-7626)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * If you want to add a new Couchbase Server 2.0.1 node to a running 2.0 cluster,
      and you want to refer to this node by hostname do the following on the new node:

       * On Linux: create a file named `ip_start` in the directory
         `/opt/couchbase/var/lib/couchbase` for the node. In this new file, add a line
         provides the DNS name or IP address that you want to use to refer to the node.

       * On Windows: create a file named `ip_start` in the directory `c:\program
         files\couchbase\server\var\lib\couchbase` for the node. In this new file, add a
         line provides the DNS name or IP address that you want to use to refer to the
         node.

      For more information, see [Couchbase Manual 2.0, Node Upgrade
      Process](couchbase-getting-started-upgrade-individual).

      *Issues* : [MB-7664](http://www.couchbase.com/issues/browse/MB-7664)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](couchbase-manual-ready.html#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

    * If you try to add a node during cluster rebalance, the rebalance may fail and
      return the messages `{detected_nodes_change` or `{ns_node_disco_events`. To
      avoid this error complete your cluster rebalance, add the new node and then
      rebalance once again. This issue will be fixed in future releases.

      *Issues* : [MB-6280](http://www.couchbase.com/issues/browse/MB-6280)

    * A cluster rebalance may exit and produce the error
      {not\_all\_nodes\_are\_ready\_yet} if you perform the rebalance right after
      failing over a node in the cluster. You may need to wait 60 seconds after the
      node failover before you attempt the cluster rebalance.

      This is because the failover REST API is a synchronous operation with a timeout.
      If it fails to complete the failover process by the timeout, the operation
      internally switches into a asynchronous operation. It will immediately return
      and re-attempt failover in the background which will cause rebalance to fail
      since the failover operation is still running.

      *Issues* : [MB-7168](http://www.couchbase.com/issues/browse/MB-7168)

 * **Indexing and Querying**

    * If you have a large amount of data in Couchbase Server and also use views, data
      compaction and views compaction may not automatically start. If you encounter
      this issue, you should change your node settings so that data and views
      compaction will start in paralell. In Couchbase Web Console: Select Settings |
      Auto-Compaction | Process Database and View compaction in paralell.

      *Issues* : [MB-7781](http://www.couchbase.com/issues/browse/MB-7781)

 * **Cross Datacenter Replication (XDCR)**

    * You may experience an uneven rate of replication for nodes in a cluster. This is
      intermittent behavior that is due to different disk drain rates at different
      nodes and will subside by itself over time. There is no need to change any
      settings on your cluster to try to resolve this behavior.

      *Issues* : [MB-7657](http://www.couchbase.com/issues/browse/MB-7657)

<a id="couchbase-server-rn_2-0-0k"></a>

## Release Notes for Couchbase Server 2.0.0 GA (December 12 2012)

Couchbase Server is a NoSQL document database for interactive web applications.
It has a flexible data model, is easily scalable, provides consistent high
performance and is "always-on," meaning it can serve application data 24 hours,
7 days a week. For more information about Couchbase Server 2.0, visit [Couchbase
Server 2.0](http://www.couchbase.com/couchbase-server/overview).

The major new features available in Couchbase Server 2.0 include:

 * **Flexible data model**. Couchbase provides a schema-less, JSON-based data model
   which is more efficient and intuitive to work with compared to the fixed-schema
   approach used by RDBMS. With JSON you can use different structures for
   application objects; it is much easier to represent complex data, and you can
   add new types of data without having to go through typical schema migration.

 * **Indexing and Querying**. With Couchbase Server 2.0, you can easily find
   documents and perform calculations on your data by using *views* in 2.0. Indexes
   can be defined using JSON and JavaScript functions. Once you have defined your
   functions you can query the information or perform calculations on the
   information using Couchbase Web Console or a Couchbase SDK.

 * **Incremental Map/Reduce**. Couchbase Server supports *incremental index
   building*, meaning it only re-indexes documents that have been changed since the
   last index update. Instead of recomputing index results from the beginning every
   time data changes in your database, Couchbase Server stores intermediate results
   in the index and can recalculate this data only when necessary. This means you
   do not need to wait for a batch job across the entire data set to finish each
   time you want to see your results.

 * **Cross Data Center Replication (XDCR)**. In 2.0, we add cross data center
   replication which enables you to replicate data from one cluster to another one
   so that your data is always available 24x365. It provides you with an easy way
   to replicate active data uni-directionally or bi-directionally between multiple
   data centers in different geographical areas. This provides you a copy of your
   data for disaster recovery and can help you bring your data closer to your end
   users for better application performance.

**New Features and Behaviour Changes in 2.0.0**

 * **XDCR (Cross Data-Center Replication) Enhancements.**

   This includes the following features and enhancements:

    * Performance improvements. Performance for outbound replication from a source
      cluster to a destination has been improved. CPU utilization on destination
      clusters has been reduced for better performance.

    * Improved Error Handling and Logging. More information about documents and the
      size of documents awaiting replication now available.

    * UI Improvements for XDCR in the Couchbase Web Console.

   The Couchbase Web Admin Console has been expanded to show the number of
   documents waiting to be replicated via XDCR and the total size of all documents
   waiting for replication. Low-level errors and statistics have been moved to a
   Couchbase Web Console log file to avoid information overload and confusion.
   Messages that are more appropriately categorized as recoverable states have been
   labeled warnings, not errors.

 * New sample data buckets are available to get you started with Couchbase Server
   2.0. The new buckets include sample documents as well as views so you play
   around with the new Couchbase Server 2.0 features.

 * Online compaction for data and indexes, which kicks off based on fragmentation
   thresholds. You can configure these thresholds along with the compaction
   schedule. In addition, the UI gives you more visibility into background
   compaction. For more information, see [Auto-Compaction
   Configuration](couchbase-manual-ready.html#couchbase-admin-tasks-compaction-autocompaction).

 * There is also now a new REST-API in Couchbase Server 2.0 where you can enable or
   disable flush for each data bucket in a cluster. This also enables you to flush
   an individual bucket in a cluster or multiple buckets on a cluster with a single
   REST-API command. For more information, see [Flushing a
   Bucket](couchbase-manual-ready.html#couchbase-admin-restapi-flushing-bucket).

   *Issues* : [MB-6776](http://www.couchbase.com/issues/browse/MB-6776)

 * Improve and enable data flush for entire cluster via individual data buckets.
   Ability to disable and enable the configuration setting for safe cluster
   administration. For more information, see [Editing Couchbase
   Buckets](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-createedit-editcb).

 * New command-line tools, and consolidated tools provided in new locations. This
   is to simplify your use of these tools. For more information about these
   improvements, and the location of new tools, see [Command Line Tools and
   Availability](couchbase-manual-ready.html#couchbase-admin-cmdline-rename-remove-new).

 * Improved working set management. When your working set of documents becomes
   larger than allocated memory, the system needs to eject documents. Couchbase now
   tracks recently accessed, updated or inserted documents and ejects “not recently
   used” documents from RAM. This working set metadata is also replicated so that
   after a rebalance operation, your working set is maintained on the new nodes in
   the cluster for reduced latencies post rebalance.

 * Server logs have been split and have been provided logical naming. This makes it
   easier for you to spot or diagnose server issues. For more information, see
   [Logs and Logging](couchbase-manual-ready.html#couchbase-troubleshooting-logs).

 * **Querying Views during Rebalance**.

   If you perform queries during rebalance, this new feature will ensure that you
   receive the query results that you would expect from a node as if it is not
   being rebalanced. During node rebalance, you will get the same results you would
   get as if the data were on an original node and as if data were not being moved
   from one node to another. In other words, this new feature ensures you get query
   results from a new node during rebalance that are consistent with the query
   results you would have received from the node before rebalance started.

   With this new feature, you will get the same query results before rebalance,
   during rebalance and after rebalance. Without this new functionality querying a
   view during rebalance would have provided results inconsistent with the results
   from a source node. With this new functionality enabled, data that is being
   moved from one node to another node will be incrementally added to an index
   available at the new node so that you get query results that are consistent with
   your expectations.

 * New append-only persistence engine. This improves disk write performance as
   updates are written only to the end of the file. Additional disk resources are
   required..

 * Shorter server warm-up time. When Couchbase Server is restarted, or when it is
   started after an offline recovery from backup, the server goes through a warm-up
   process first loading metadata from disk into RAM. Additionally, it loads the
   documents that belong to the tracked working set maintained in an access log.
   This reduces warm-up time and also makes the most relevant data available
   instead of sequentially loading all data into RAM.

 * **General Changes in Rebalance Behavior**.

   During rebalance, Couchbase Server now has new internal logic that will wait for
   data to be persisted at a new node before the new node takes responsibility for
   serving the data. In situations where you want a very high level of durability,
   this can provide you more assurance that your data can be recovered after node
   failures.

**Fixes in 2.0.0**

 * **Database Operations**

    * Now provide timestamp for when a TAP queue backfill starts. The TAP backfill
      queue is used to send a snapshot of a vbucket to another node.

      *Issues* : [MB-6753](http://www.couchbase.com/issues/browse/MB-6753)

    * Couchbase Server had created new checkpoints even in the case where empty,
      current checkpoints were available. The server provided extraneous notifications
      when various changes to checkpoints ID occurred due to constant polling by XDCR.
      Now when an empty checkpoint is available, the server uses this checkpoint for
      additional replication and provide this checkpoint ID to XDCR. The server also
      pushes a single notification to XDCR when a checkpoint is empty.

    * In the past if you set the disk path for data to be the same path as that for
      index files, Couchbase Server would fail to start. This is fixed.

      *Issues* : [MB-6995](http://www.couchbase.com/issues/browse/MB-6995)

    * In the past, if you used a symbolic link to reference a data directory for
      Couchbase Server, the server determined remaining free only for the partition
      that contained the symbolic link. This resulted in two issues: 1) incorrect
      information in the Couchbase Web Console, 2) more significantly, it would
      accidentally inhibit the data compaction process because of incorrect
      information about free disk space. This has been fixed in 2.0.

      *Issues* : [MB-7307](http://www.couchbase.com/issues/browse/MB-7307)

    * During Couchbase Server warmup or rebalance, if you delete a data bucket, it
      will cause the node to crash.

      *Issues* : [MB-7272](http://www.couchbase.com/issues/browse/MB-7272)

    * Performing a touch operation and providing an expiration of 0, to indicate no
      expiration did not function. This is now fixed.

      *Issues* : [MB-7342](http://www.couchbase.com/issues/browse/MB-7342)

    * We now log all vBucket state changes as mccouch events.

      *Issues* : [MB-7057](http://www.couchbase.com/issues/browse/MB-7057)

    * To handle current limitations on open file descriptors allowed on MacOS, the
      number of vBuckets on MacOS have been reduced to 64 from 1024. This reduces the
      number of files that are created for data as well as for indexes. Overall this
      provides improved CPU and disk I/O for MacOS.

      Note however that replication via XDCR between a MacOS and non-MacOS servers
      will not work due to the mismatch in the number of vBuckets between Mac OSX and
      other platforms.

      In addition mixed clusters with Couchbase nodes running on Mac OSX and on
      non-Mac OSX platforms will not function. In general Mac OSX is supported by
      Couchbase only for developing with Couchbase Server and not for production.

      *Issues* : [MB-6781](http://www.couchbase.com/issues/browse/MB-6781)

    * Check-and-set value was not returned in response to a successful delete request.
      Now it is returned as part of the response.

      *Issues* : [MB-6661](http://www.couchbase.com/issues/browse/MB-6661)

    * In the past, the server would delete items even if a provided CAS value was a
      mismatch. This has been fixed.

      *Issues* : [MB-6985](http://www.couchbase.com/issues/browse/MB-6985)

 * **Cluster Operations**

    * Get-and-touch function were not providing the correct error information from the
      server. Get-and-touch now returns ENOENT if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * The Couchbase REST-API has changed to enable you to change the default maximum
      number of buckets used in a Couchbase cluster. The maximum allowed buckets in
      this request is 128, however the maximum suggested number of buckets is ten per
      cluster. This is a safety mechanism to ensure that a cluster does not have
      resource and CPU overuse due to too many buckets. The following illustrates the
      endpoint and parameters used:

       ```
       shell>    curl -X -u admin:password -d maxBucketCount=6 http://ip_address:8091/internalSettings
       ```

      For this request you need to provide administrative credentials for the cluster.
      The following HTTP request will be sent:

       ```
       About to connect() to 127.0.0.1 port 8091 (#0)
       Trying 127.0.0.1...
       connected
       Connected to 127.0.0.1 (127.0.0.1) port 8091 (#0)
       Server auth using Basic with user 'Administrator'
       POST /internalSettings HTTP/1.1
       ```

      If Couchbase Server successfully changes the bucket limit for the cluster, you
      will get a HTTP 200 response:

       ```
       HTTP/1.1 200 OK
       Server: Couchbase Server 2.0.0r_501_gb614829
       Pragma: no-cache
       Date: Wed, 31 Oct 2012 21:21:48 GMT
       Content-Type: application/json
       Content-Length: 2
       Cache-Control: no-cache
       ```

      If you provide an invalid number, such as 0, a negative number, or an amount
      over 128 buckets, you will get this error message:

       ```
       ["Unexpected server error, request logged."]
       ```

      For more information about setting buckets per cluster via REST-API, see
      [Setting Maximum Buckets for
      Clusters](couchbase-manual-ready.html#couchbase-admin-restapi-max-buckets).

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

 * **Web Console**

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      inhibited people from performing ongoing work and demonstrations of the server.

    * For Mac OSX, we had provided a drop-down UI menu for logs that pointed to the
      wrong location. This menu option has been removed since it is already provided
      in the Web Console.

      *Issues* : [MB-7075](http://www.couchbase.com/issues/browse/MB-7075)

    * We now provide memcached logs in the diagnostic reports available from the
      Couchbase Web Console.

      *Issues* : [MB-7048](http://www.couchbase.com/issues/browse/MB-7048)

 * **Command-line Tools**

    * Several command line tools have been deprecated, superceded, or moved. This
      includes `cbflushctl` which has been superceded by `cbepctl`. For more
      information, see [Command-line Interface for
      Administration](couchbase-manual-ready.html#couchbase-admin-cmdline).

      *Issues* : [MB-6912](http://www.couchbase.com/issues/browse/MB-6912)

    * For Mac OSX, the tool for collecting statistics for Couchbase technical support
      `cbcollect_info` was not functioning. We have fixed it.

      *Issues* : [MB-6958](http://www.couchbase.com/issues/browse/MB-6958)

    * Incorrect message had been sent in response to a `cbstats vkey` command. Server
      had returned the string 'not found' for valid request. Now correct the memcached
      protocol error is returned. For more information about `cbstats`, see [cbstats
      Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbstats).

      *Issues* : [MB-6751](http://www.couchbase.com/issues/browse/MB-6751)

    * `cbepctl` help options now show option for setting the expiry\_pager, a
      maintenance process for removing deleted items from disk.

      *Issues* : [MB-6764](http://www.couchbase.com/issues/browse/MB-6764)

 * **Cross Datacenter Replication (XDCR)**

    * Fix rebalance timeout failure during unidirectional replication of items via
      XDCR. Failure had returned message: "timeout,
      ns\_memcached-bucket','ns\_1@10.1.3.238'}, {get\_vbucket,".

      *Issues* : [MB-6493](http://www.couchbase.com/issues/browse/MB-6493)

    * Errors had occurred performing replication via XDCR due to improper handling of
      non- UTF-8 characters. We now handle errors due to non- UTF-8 characters and can
      continue replication via XDCR for JSON documents containing non- UTF-8.

      *Issues* : [MB-7092](http://www.couchbase.com/issues/browse/MB-7092)

    * We have added 3 new outbound operation stats, namely, 1) data replicated, which
      is amount of data XDCR have replicated to the remote data center through inter-
      cluster network; 2) active vb replications, which shows the number of ongoing
      active replications to the remote clusters; 3) waiting vb replications, which is
      the number of vb replications in the waiting pool to wait for turn to start
      replication. These stats will be useful for performance monitoring and
      diagnosis.

      *Issues* : [MB-6919](http://www.couchbase.com/issues/browse/MB-6919)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

**Known Issues in 2.0.0**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * By default when you perform a new install of Couchbase Server 2.0, creating a
      replica index for a data bucket is disabled by default. This should be the
      standard default setting for all new installs of the server. However, when you
      upgrade from 1.8.1 to 2.0, be aware it is enabled by default.

      *Issues* : [MB-7339](http://www.couchbase.com/issues/browse/MB-7339)

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * In order to upgrade from 1.8.1 to 2.0 for the Microsoft Windows platform, you
      need to make changes to the ip file located on the node at
      Couchbase\Server\var\lib\couchbase\ip as well as complete some additional steps
      on your node which will apply whether you are using Windows on the cloud or not.
      For more information about upgrading from 1.8.x to 2.0, see [Upgrades Notes
      1.8.1 to 2.0
      +](couchbase-manual-ready.html#couchbase-getting-started-upgrade-1-8-2-0).

      *Issues* : [MB-7289](http://www.couchbase.com/issues/browse/MB-7289)

      For more information, see [Handling Changes in IP
      Addresses](couchbase-manual-ready.html#couchbase-bestpractice-cloud-ip).

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

    * Performing an upgrade from Couchbase 1.8.1 to Couchbase 2.0.0 GA build freezes
      while transferring data from SQLite files to Couchstore files using
      `cbtransfer`.

      *Issues* : [MB-7341](http://www.couchbase.com/issues/browse/MB-7341)

    * If you use `couchbase-cli` to setup a Couchbase node on a non-default port, you
      may receive an error. Although the cluster gets initialized, the initial RAM
      quota is not used and the server returns an error.

      *Issues* : [MB-7268](http://www.couchbase.com/issues/browse/MB-7268)

    * On Ubuntu 64-bit 12.04, when you upgrade Couchbase Server from 1.8.1 to 2.0 the
      upgrade will work, however the server erroneously returns an error in the end
      when it starts. The error is: "Failed to start couchbase-server dpkg: error
      processing couchbase-server (‐‐install)". Ignore this error message.

      *Issues* : [MB-7298](http://www.couchbase.com/issues/browse/MB-7298)

 * **Database Operations**

    * Several incidents have been reported that after using Flush on nodes, Couchbase
      Server returns TMPFAIL even after a successful flush.

      *Issues* : [MB-7160](http://www.couchbase.com/issues/browse/MB-7160)

    * For the Windows platform, attempts to perform a rebalance of a restarted node
      fails due to failure to clean up old data buckets on the node. The workaround is
      to retry the rebalance.

      *Issues* : [MB-7202](http://www.couchbase.com/issues/browse/MB-7202)

    * If you reset the disk path to a path that contained corrupted data, Couchbase
      Server will shut down and non response. When you change the data path to a
      different folder, make sure it does not contain files with a different format or
      with incorrect permissions.

      *Issues* : [MB-7185](http://www.couchbase.com/issues/browse/MB-7185)

    * Be aware that you may experience delays while node is in a pending state after
      you change the index path for that node. This will be fixed in a point release
      after 2.0 GA.

      *Issues* : [MB-7337](http://www.couchbase.com/issues/browse/MB-7337)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * During a rebalance operation for clusters undergoing uni- and bi-directional
      replication via XDCR, the following server errors may appear, which are
      currently under investigation:

       ```
       Server error during processing: ["web request failed",
       {path,"/pools/default"},
       {type,exit},
       {what,
       {timeout,
       {gen_server,call,
       [ns_doctor,get_tasks_version]}}},
       {trace,
       [{gen_server,call,2},
       {menelaus_web,build_pool_info,4},
       {menelaus_web,handle_pool_info_wait,5},
       {menelaus_web,loop,3},
       {mochiweb_http,headers,5},
       {proc_lib,init_p_do_apply,3}]}] (repeated 1 times)
       ```

      *Issues* : [MB-7286](http://www.couchbase.com/issues/browse/MB-7286)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](couchbase-manual-ready.html#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

    * One of the internal maintenance processes within Couchbase Server for checking
      vBuckets will stop node rebalance when you create replication via XDCR on a
      source cluster.

      A node in a cluster may also stop rebalance when another node orchestrating
      rebalances is over loaded. When a node stops rebalance, it results in the error
      message "Resetting rebalance status since it is not really running".

      Rebalance cna also fail due to the timeout in `bulk_set_vbucket_state` operation
      with continuous view queries.

      *Issues* : [MB-6481](http://www.couchbase.com/issues/browse/MB-6481),
      [MB-6573](http://www.couchbase.com/issues/browse/MB-6573),
      [MB-7212](http://www.couchbase.com/issues/browse/MB-7212)

 * **Web Console**

    * The Couchbase Web Console will erroneously clear all summary statistics for a
      data bucket when a new index is being generated in the background. The
      workaround is to reload the page to get the current statistics.

      *Issues* : [MB-7090](http://www.couchbase.com/issues/browse/MB-7090)

    * Be aware that if attempt hundreds of simultaneous queries with an unlimited
      number of results, Couchbase Server may fail. If you have a result set from
      indexing that contains 10 million items or more, and you query for that entire
      result set, the server will fail.

      Instead you should specify a reasonable limit of results when you query, such as
      retriving a range of results from the larger set, otherwise the server will
      stall and crash due to excessive memory usage. For more information about
      querying and specifying a subset of results, see [Querying
      Views](couchbase-manual-ready.html#couchbase-views-writing-querying).

      *Issues* : [MB-7199](http://www.couchbase.com/issues/browse/MB-7199)

    * If you have a cluster running Couchbase Server 1.8.1 and 2.0.0, Couchbase Web
      Console 2.0 will show incorrect, sometimes negative values for Disk Usage in the
      summary section. Ignore this error.

      *Issues* : [MB-7183](http://www.couchbase.com/issues/browse/MB-7183)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * The sample data loader will fail to run on a cluster when the cluster contains
      nodes with different versions of Couchbase. The workaround is to upgrade all
      cluster nodes to Couchbase Server 2.0. For more information about upgrading
      nodes from 1.8.x to 2.0, see [Upgrades Notes 1.8.1 to 2.0
      +](couchbase-manual-ready.html#couchbase-getting-started-upgrade-1-8-2-0).

      *Issues* : [MB-7171](http://www.couchbase.com/issues/browse/MB-7171)

    * The couchbase command line tool, `couchbase-cli` does not enable you to set
      `index_path` as a separate parameter as `data_path`. The former contains indexed
      data from defined views functions, while the later contains keys, metadata, and
      JSON documents. You can however use the REST-API to do this.

      *Issues* : [MB-7323](http://www.couchbase.com/issues/browse/MB-7323)

      For more information, see [Configuring Index Path for a
      Node](couchbase-manual-ready.html#couchbase-admin-restapi-provisioning-diskpath).

    * The sample data loader will also fail if there are multiple nodes in a cluster
      and creating a bucket in the cluster is taking longer than 10 seconds.

      *Issues* : [MB-7170](http://www.couchbase.com/issues/browse/MB-7170)

 * **Indexing and Querying**

    * If you are using development views, be aware you may see inconsistent results if
      you query a development view during rebalance. For production views, you are
      able to query during rebalance and get results consistent with those you would
      have recieved if no rebalance were occurring.

      *Issues* : [MB-6967](http://www.couchbase.com/issues/browse/MB-6967)

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

    * If a map function in a design document fails while processing a document, that
      document will also not be computed for any other map functions in the same
      design document. To avoid creating errors in your views functions, see the tips
      and advice provided in [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      *Issues* : [MB-6895](http://www.couchbase.com/issues/browse/MB-6895)

    * Couchbase Server does lazy expiration, that is, expired items are flagged as
      deleted rather than being immediately erased. Couchbase Server has a maintenance
      process that will periodically look through all information and erase expired
      items. This means expired items may still be indexed and appear in result sets
      of views. The workarounds for this behavior are available here [About Document
      Expiration](http://www.couchbase.com/docs/couchbase-devguide-2.0/about-ttl-values.html).

      *Issues* : [MB-7053](http://www.couchbase.com/issues/browse/MB-7053)

 * **Cross Datacenter Replication (XDCR)**

    * `beam.smp` memory usage grows to 2 GB when XDCR feature is enabled and
      rebalancing is in progress.

      *Issues* : [MB-6649](http://www.couchbase.com/issues/browse/MB-6649)

    * Under the XDCR tab for Couchbase Web Console, the link to a a destination
      cluster takes you to a missing URL. A simple workaround is to append ':8091' to
      the address in the newly opened browser tab.

      *Issues* : [MB-7211](http://www.couchbase.com/issues/browse/MB-7211)

    * Replication rat e may drop when the XDCR replication queue size becomes less
      than 500 items.

      *Issues* : [MB-6586](http://www.couchbase.com/issues/browse/MB-6586)

    * Be aware that if you are using XDCR for replication to a destination bucket and
      you remove and create a new bucket with the same name, it has a different UUIDs.
      Therefore any replication you had established with the deleted bucket will not
      apply to the new bucket.

      *Issues* : [MB-7262](http://www.couchbase.com/issues/browse/MB-7262)

 * **Performance**

    * Under a heavy load of write operations on two clusters and both bi-directional
      and uni-directional replications occurring via XDCR, Couchbase Server 2.0 may
      fail during rebalance.

      *Issues* : [MB-7290](http://www.couchbase.com/issues/browse/MB-7290)

    * `ep-engine` needs 1.5 minutes to create 1024 vbuckets. This may be too slow,
      however performance improves with setting barrier=0.

      *Issues* : [MB-6232](http://www.couchbase.com/issues/browse/MB-6232)

<a id="couchbase-server-rn_2-0-0j"></a>

## Release Notes for Couchbase Server 2.0.0 #1941 Beta (November 13 2012)

This is build \#1941 of Couchbase Server 2.0. Couchbase Server is a NoSQL
document database for interactive web applications. It has a flexible data
model, is easily scalable, provides consistent high performance and is
"always-on," meaning it can serve application data 24 hours, 7 days a week. For
more information about Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

The major improvements made between build \#1870 and build \#1941 are described
below:

**New Features and Behaviour Changes in 2.0.0 \#1941**

 * The default node quota percentage has been reduced from 80% to 60% to provide
   capacity in the operating system for the view and indexing data to be cached.

   *Issues* : [MB-6973](http://www.couchbase.com/issues/browse/MB-6973)

**Fixes in 2.0.0 \#1941**

 * **Installation and Upgrade**

    * For Mac OSX, we provide the correct version number in the README.

      *Issues* : [MB-6697](http://www.couchbase.com/issues/browse/MB-6697)

 * **Database Operations**

    * The default timeout for persisting a checkpoint had been 10 seconds. This
      default is still in place, but will now be adjusted upward or downward by the
      server to be the last duration required to persist a checkpoint. This is to
      better optimize server resources for indexing during rebalance.

      *Issues* : [MB-6976](http://www.couchbase.com/issues/browse/MB-6976)

    * In the past, we declared the revision value for a document to be 32- bit value
      and have changed this to 48- bit value. This is to support a larger number of
      document revisions and to support conflict resolution in XDCR.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * Document revision numbers had been stored as 32 bit values but are now stored as
      larger 48 bit values. This enables more documents to be changed or deleted for
      the same database shard. A Couchbase cluster can run for more than three years
      performing 400,000 operations a second until revision sequence limits are met.
      This change is to support the functioning of XDCR and to support a larger number
      of document revisions.

      This fix changes the on-disk data format. You will not be able to use data files
      from prior builds of Couchbase Server 2.0 on this new build.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * For Windows, rebalanced has exited due to some concurrent file operations that
      are not allowed on this platform. This has been fixed by enabling retry of file
      operations for Windows during rebalance.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * Document revision numbers had been stored as 32 bit but are now stored as 48 bit
      values. This is to support the functioning of XDCR and to support a larger
      number of document revisions.

      *Issues* : [MB-6945](http://www.couchbase.com/issues/browse/MB-6945)

    * By default we now provide garbage collection more frequently than the normal
      default for Erlang. This keeps memory usage by the Erlang virtual machine lower,
      and enables better performance.

      *Issues* : [MB-6974](http://www.couchbase.com/issues/browse/MB-6974)

    * We now provide more log information about errors during vBucket reset and
      deletion.

      *Issues* : [MB-6494](http://www.couchbase.com/issues/browse/MB-6494)

    * Couchbase Server had intermittently crashed during rebalance due to Erlang
      virtual machine issues; we now disable asynchronous threads and perform garbage
      collection more often to avoid timeouts and process crashes.

      *Issues* : [MB-6638](http://www.couchbase.com/issues/browse/MB-6638)

    * We now log all vBucket state changes as mccouch events.

      *Issues* : [MB-7057](http://www.couchbase.com/issues/browse/MB-7057)

    * To handle current limitations on open file descriptors allowed on MacOS, the
      number of vBuckets on MacOS have been reduced to 64 from 1024. This reduces the
      number of files that are created for data as well as for indexes. Overall this
      provides improved CPU and disk I/O for MacOS.

      Note however that replication via XDCR between a MacOS and non-MacOS servers
      will not work due to the mismatch in the number of vBuckets between Mac OSX and
      other platforms.

      In addition mixed clusters with Couchbase nodes running on Mac OSX and on
      non-Mac OSX platforms will not function. In general Mac OSX is supported by
      Couchbase only for developing with Couchbase Server and not for production.

      *Issues* : [MB-6781](http://www.couchbase.com/issues/browse/MB-6781)

    * In the past, the server would delete items even if a provided CAS value was a
      mismatch. This has been fixed.

      *Issues* : [MB-6985](http://www.couchbase.com/issues/browse/MB-6985)

 * **Cluster Operations**

    * Get-and-touch function were not providing the correct error information from the
      server. Get-and-touch now returns ENOENT if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * Server now releases returned document that is being marked deleted. This fixes a
      rebalance failure where memcached crashes on one of the nodes and rebalance
      exits with the error: `{mover_failed,{badmatch, known macro: {error,closed}}}`.

      *Issues* : [MB-6806](http://www.couchbase.com/issues/browse/MB-6806)

    * Rebalanced had been delayed after failing-over a disconnected node. This is
      fixed.

      *Issues* : [MB-6992](http://www.couchbase.com/issues/browse/MB-6992)

    * The Erlang virtual machine had intermittently crashed when adding a node and
      rebalancing. By increasing the checkpoint timeout for XDCR replication we have
      resolved the issue.

      *Issues* : [MB-7056](http://www.couchbase.com/issues/browse/MB-7056)

 * **Web Console**

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      inhibited people from performing ongoing work and demonstrations of the server.

    * In the past, clicking on a document name shown in the View Results panel did not
      load the document in the sample document pane. This has been fixed.

      *Issues* : [MB-6500](http://www.couchbase.com/issues/browse/MB-6500)

    * A data request error had been returned when a user attempted to save spatial
      views containing map or reduce functions which could not compile. A new error
      handler has been added to display a more helpful message.

      *Issues* : [MB-7029](http://www.couchbase.com/issues/browse/MB-7029)

    * We now refresh the available design documents in the Web Console when you move
      to the views section.

      *Issues* : [MB-6978](http://www.couchbase.com/issues/browse/MB-6978)

    * We have removed the automatic 5-minute timeout for Couchbase Web Console. This
      was cumbersome and annoying for people performing ongoing work and
      demonstrations of the server.

      *Issues* : [MB-6679](http://www.couchbase.com/issues/browse/MB-6679)

    * Number of documents per page specified in the top right corner on the Documents
      page of Couchbase Web Console does not match the number of documents actually
      presented to the user. This is fixed.

      *Issues* : [MB-7011](http://www.couchbase.com/issues/browse/MB-7011)

    * The number of documents you can skip in the Web console is now 1000. This is to
      avoid overloading the user interface for a larger number of documents.

      *Issues* : [MB-7067](http://www.couchbase.com/issues/browse/MB-7067)

    * For Mac OSX, we had provided a drop-down UI menu for logs that pointed to the
      wrong location. This menu option has been removed since it is already provided
      in the Web Console.

      *Issues* : [MB-7075](http://www.couchbase.com/issues/browse/MB-7075)

    * We now provide memcached logs in the diagnostic reports available from the
      Couchbase Web Console.

      *Issues* : [MB-7048](http://www.couchbase.com/issues/browse/MB-7048)

 * **Command-line Tools**

    * Errors had occurred on windows trying to run Python workload generators. This
      has been fixed by adding the bin directory to the Python path.

      *Issues* : [MB-7086](http://www.couchbase.com/issues/browse/MB-7086)

    * Errors had occurred trying to access design documents associated with buckets
      requiring SASL authentication. This has been fixed by properly requiring
      authorization information to access these buckets.

      *Issues* : [MB-6757](http://www.couchbase.com/issues/browse/MB-6757)

    * For Mac OSX, the tool for collecting statistics for Couchbase technical support
      `cbcollect_info` was not functioning. We have fixed it.

      *Issues* : [MB-6958](http://www.couchbase.com/issues/browse/MB-6958)

 * **Indexing and Querying**

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      now provide validation of spatial functions.

      *Issues* : [MB-6990](http://www.couchbase.com/issues/browse/MB-6990)

    * For geo/spatial indexes, after updating a design document, or deleting a design
      document, the old index files and erlang processes were not released. This
      unnecessarily took disk space and resulted in leaking file descriptors. After
      database shard compaction, spatial/geo indexes would never release the file
      handle of the pre-compaction database files. This meant that disk space couldn't
      be reclaimed by the OS. This has now been fixed.

      For general indexes, after index compaction the pre-compaction index files were
      deleted but were somtimes held open for a long time. This prevented the OS from
      reclaiming the respective disk space and leaking one file descriptor per index
      compaction. This has been fixed.

      For both geo/spatial and general indexes, we now avoid creating unnecessary
      empty index files and now avoid keeping them open for very long periods, such as
      waiting until bucket deletion. This is a more minor fix which helps decrease the
      number of open file descriptors, which is important if you are wroking on an
      operating sytem with a small limit of max allowed file descriptors, such as
      Windows and Mac OS X.

      *Issues* : [MB-6860](http://www.couchbase.com/issues/browse/MB-6860)

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      had erroneously returned a 'node' key in the result set which is debug
      information. This is now fixed.

      Note also that querying a spatial view will always return `total_rows = 0` as
      part of the result set. This is information used for internal functioning of
      spatial views.

      *Issues* : [MB-6942](http://www.couchbase.com/issues/browse/MB-6942)

    * For geo/spatial indexes, which are experimental features in Couchbase 2.0, we
      had experienced index file descriptor leaks. This is fixed.

      *Issues* : [MB-6860](http://www.couchbase.com/issues/browse/MB-6860)

 * **Cross Datacenter Replication (XDCR)**

    * Errors had occurred performing replication via XDCR due to improper handling of
      non- UTF-8 characters. We now handle errors due to non- UTF-8 characters and can
      continue replication via XDCR for JSON documents containing non- UTF-8.

      *Issues* : [MB-7092](http://www.couchbase.com/issues/browse/MB-7092)

    * XDCR checkpoint intervals have increased to 30 minutes from 5 minutes. This
      helps increase the chance that a checkpoint will successfully replicate and not
      fail; this also reduces the frequent overhead required to determine if a
      checkpoint completed.

      *Issues* : [MB-6939](http://www.couchbase.com/issues/browse/MB-6939)

    * XDCR had displayed error messages as if they were non-recoverable issues that
      required immediate attention. We now provide error messages with less dramatic
      color coding and label them as errors vs. urgent warnings.

      *Issues* : [MB-6934](http://www.couchbase.com/issues/browse/MB-6934)

 * **Performance**

    * Performance improvements have been made to reduce the time taken to rebalance
      when consistent query results are enabled for rebalances.

      *Issues* : [MB-7030](http://www.couchbase.com/issues/browse/MB-7030)

**Known Issues in 2.0.0 \#1941**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0i"></a>

## Release Notes for Couchbase Server 2.0.0 build #1870 Beta (1 November 2012)

This is build \#1870 of Couchbase Server 2.0. Couchbase Server is a NoSQL
document database for interactive web applications. It has a flexible data
model, is easily scalable, provides consistent high performance and is
"always-on," meaning it can serve application data 24 hours, 7 days a week. For
more information about Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

The major improvements made between Beta and build \#1870 include:

 * **General Changes in Rebalance Behavior**.

   During rebalance, Couchbase Server now has new internal logic that will wait for
   data to be persisted at a new node before the new node takes responsibility for
   serving the data. In situations where you want a very high level of durability,
   this can provide you more assurance that your data can be recovered after node
   failures.

 * **Querying Views during Rebalance**.

   If you perform queries during rebalance, this new feature will ensure that you
   receive the query results that you would expect from a node as if it is not
   being rebalanced. During node rebalance, you will get the same results you would
   get as if the data were on an original node and as if data were not being moved
   from one node to another. In other words, this new feature ensures you get query
   results from a new node during rebalance that are consistent with the query
   results you would have received from the node before rebalance started.

   With this new feature, you will get the same query results before rebalance,
   during rebalance and after rebalance. Without this new functionality querying a
   view during rebalance would have provided results inconsistent with the results
   from a source node. With this new functionality enabled, data that is being
   moved from one node to another node will be incrementally added to an index
   available at the new node so that you get query results that are consistent with
   your expectations.

 * **XDCR (Cross Data-Center Replication) Enhancements.**

   This includes the following features and enhancements:

    * Performance improvements. Performance for outbound replication from a source
      cluster to a destination has been improved. CPU utilization on destination
      clusters has been reduced for better performance.

    * Improved Error Handling and Logging. More information about documents and the
      size of documents awaiting replication now available.

    * UI Improvements for XDCR in the Couchbase Web Console.

   The Couchbase Web Admin Console has been expanded to show the number of
   documents waiting to be replicated via XDCR and the total size of all documents
   waiting for replication. Low-level errors and statistics have been moved to a
   Couchbase Web Console log file to avoid information overload and confusion.
   Messages that are more appropriately categorized as recoverable states have been
   labeled warnings, not errors.

 * Improve and enable data flush for entire cluster via individual data buckets.
   Ability to disable and enable the configuration setting for safe cluster
   administration. For more information, see [Editing Couchbase
   Buckets](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-createedit-editcb).

 * Server logs have been split and have been provided logical naming. This makes it
   easier for you to spot or diagnose server issues. For more information, see
   [Logs and Logging](couchbase-manual-ready.html#couchbase-troubleshooting-logs).

**New Features and Behaviour Changes in 2.0.0 build \#1870**

 * There is also now a new REST-API in Couchbase Server 2.0 where you can enable or
   disable flush for each data bucket in a cluster. This also enables you to flush
   an individual bucket in a cluster or multiple buckets on a cluster with a single
   REST-API command. For more information, see [Flushing a
   Bucket](couchbase-manual-ready.html#couchbase-admin-restapi-flushing-bucket).

   *Issues* : [MB-6776](http://www.couchbase.com/issues/browse/MB-6776)

**Fixes in 2.0.0 build \#1870**

 * **Database Operations**

    * Now provide timestamp for when a TAP queue backfill starts. The TAP backfill
      queue is used to send a snapshot of a vbucket to another node.

      *Issues* : [MB-6753](http://www.couchbase.com/issues/browse/MB-6753)

    * Couchbase Server had created new checkpoints even in the case where empty,
      current checkpoints were available. The server provided extraneous notifications
      when various changes to checkpoints ID occurred due to constant polling by XDCR.
      Now when an empty checkpoint is available, the server uses this checkpoint for
      additional replication and provide this checkpoint ID to XDCR. The server also
      pushes a single notification to XDCR when a checkpoint is empty.

      *Issues* : [MB-6632](http://www.couchbase.com/issues/browse/MB-6632)

    * Couchbase Server kept requesting to mark a group of partitions as indexable when
      they were already marked as indexable, or when they are already correctly marked
      as unindexable. This triggered redundant effort by processes. It is now fixed.

      *Issues* : [MB-6804](http://www.couchbase.com/issues/browse/MB-6804)

    * During XDCR replication, an incorrect cache-miss-ratio had been displayed in Web
      Console, and had been returned in response to a `cbstats` command. We had
      erroneously incremented `ep_bg_fetched` for `GET_META` background fetches. As a
      fix, we now provide a separate stat for `GET_META` background fetches.

      *Issues* : [MB-6628](http://www.couchbase.com/issues/browse/MB-6628)

    * Get-and-touch returned incorrect error messages when an error occurs.
      Get-and-touch now returns `ENOENT` if key does not exist.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * This enables users to change the disk location of an index without destroying
      persisted data. You can now set index\_path and it will delete an existing index
      only and create a new disk location for use.

      *Issues* : [MB-6423](http://www.couchbase.com/issues/browse/MB-6423)

    * When you try to automatically failover a node, Couchbase Server will not perform
      the failover if there are not enough replica vBuckets in the cluster to support
      the failed node.

      *Issues* : [MB-6209](http://www.couchbase.com/issues/browse/MB-6209)

    * Querying a view during rebalance had resulted in several errors due to the way
      database storage files were managed and named. We now exclude opening databases
      that are meant to be excluded from indexing and we now synchronously open
      databases for indexing to resolve the problem.

      *Issues* : [MB-6612](http://www.couchbase.com/issues/browse/MB-6612)

    * Querying a view on a single node incorrectly returned `inconsistent_state` error
      if a bucket is empty. This is corrected.

      *Issues* : [MB-6736](http://www.couchbase.com/issues/browse/MB-6736)

    * Provide additional XDCR information on Logs tab of Couchbase Web Console.

      *Issues* : [MB-6888](http://www.couchbase.com/issues/browse/MB-6888)

    * We added missing checks to state transition requests. Also erroneous error
      messages had occurred while the server monitored partition in pending
      transition. This has been corrected.

      *Issues* : [MB-6490](http://www.couchbase.com/issues/browse/MB-6490)

    * The collect\_info logs was missing the mapreduce\_errors log file. Now this log
      also contains mapreduce\_errors.

      *Issues* : [MB-6859](http://www.couchbase.com/issues/browse/MB-6859)

    * Change the frequency that internal timeouts on Windows were occurring to be more
      efficient.

      *Issues* : [MB-6653](http://www.couchbase.com/issues/browse/MB-6653)

    * Node rebalance was failing when new nodes were added to the cluster. This
      occurred due to processes being triggered after defining partitions for
      indexing. The processes are now being triggered at the correct time.

      *Issues* : [MB-6706](http://www.couchbase.com/issues/browse/MB-6706)

    * Replication had exited with replicator\_died message after multiple attempts to
      update. Problem was caused by using old revision numbers for new database files.
      Now new database files use new revision numbers, resolving the problem.

      *Issues* : [MB-6711](http://www.couchbase.com/issues/browse/MB-6711)

    * Sporadic failures occurred while running a unit test for testing duplicate items
      on disk. Test now modified to use less items.

      *Issues* : [MB-6647](http://www.couchbase.com/issues/browse/MB-6647)

    * Keys stored in the access log were not correctly scheduled to load, due to a
      broken logic for detecting duplicate items. Now keys properly load during warmup
      from access log.

      *Issues* : [MB-6616](http://www.couchbase.com/issues/browse/MB-6616)

    * Couchbase Server had returned a HTTP 404 error when a node is rebalanced and a
      client tried to cache a list of nodes for a bucket. Now the server sends a HTTP
      302 redirect with the URL of an available node.

      *Issues* : [MB-6922](http://www.couchbase.com/issues/browse/MB-6922)

    * The thread responsible for persisting data in Couchbase Server had been crashing
      during vBucket state changes. This was caused by not handling file not found
      exceptions. The cause of the crashes has been fixed.

      *Issues* : [MB-6676](http://www.couchbase.com/issues/browse/MB-6676)

    * Check-and-set value was not returned in response to a successful delete request.
      Now it is returned as part of the response.

      *Issues* : [MB-6661](http://www.couchbase.com/issues/browse/MB-6661)

 * **Cluster Operations**

    * Server now releases returned document that is being marked deleted. This fixes a
      rebalance failure where memcached crashes on one of the nodes and rebalance
      exits with the error: `{mover_failed,{badmatch, known macro: {error,closed}}}`.

      *Issues* : [MB-6806](http://www.couchbase.com/issues/browse/MB-6806)

    * The Couchbase REST-API has changed to enable you to change the default maximum
      number of buckets used in a Couchbase cluster. The maximum allowed buckets in
      this request is 128, however the maximum suggested number of buckets is ten per
      cluster. This is a safety mechanism to ensure that a cluster does not have
      resource and CPU overuse due to too many buckets. The following illustrates the
      endpoint and parameters used:

       ```
       shell>    curl -X -u admin:password -d maxBucketCount=6 http://ip_address:8091/internalSettings
       ```

      For this request you need to provide administrative credentials for the cluster.
      The following HTTP request will be sent:

       ```
       About to connect() to 127.0.0.1 port 8091 (#0)
       Trying 127.0.0.1...
       connected
       Connected to 127.0.0.1 (127.0.0.1) port 8091 (#0)
       Server auth using Basic with user 'Administrator'
       POST /internalSettings HTTP/1.1
       ```

      If Couchbase Server successfully changes the bucket limit for the cluster, you
      will get a HTTP 200 response:

       ```
       HTTP/1.1 200 OK
       Server: Couchbase Server 2.0.0r_501_gb614829
       Pragma: no-cache
       Date: Wed, 31 Oct 2012 21:21:48 GMT
       Content-Type: application/json
       Content-Length: 2
       Cache-Control: no-cache
       ```

      If you provide an invalid number, such as 0, a negative number, or an amount
      over 128 buckets, you will get this error message:

       ```
       ["Unexpected server error, request logged."]
       ```

      For more information about setting buckets per cluster via REST-API, see
      [Setting Maximum Buckets for
      Clusters](couchbase-manual-ready.html#couchbase-admin-restapi-max-buckets).

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

    * Automatically prevent a user from creating more than the maximum number of
      supported buckets in a Couchbase cluster. The default maximum is six.

      *Issues* : [MB-5684](http://www.couchbase.com/issues/browse/MB-5684)

 * **Web Console**

    * Provide cleaner, simplified output on error messages from XDCR replication.

      *Issues* : [MB-6763](http://www.couchbase.com/issues/browse/MB-6763)

 * **Command-line Tools**

    * Incorrect message had been sent in response to a `cbstats vkey` command. Server
      had returned the string 'not found' for valid request. Now correct the memcached
      protocol error is returned. For more information about `cbstats`, see [cbstats
      Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbstats).

      *Issues* : [MB-6751](http://www.couchbase.com/issues/browse/MB-6751)

    * Fixed stats vkey status for evicted keys. Stats vkey was returning
      `item_deleted` instead of valid for evicted keys. This change fixes that
      problem.

      *Issues* : [MB-6840](http://www.couchbase.com/issues/browse/MB-6840)

    * `cbepctl` help options now show option for setting the expiry\_pager, a
      maintenance process for removing deleted items from disk.

      *Issues* : [MB-6764](http://www.couchbase.com/issues/browse/MB-6764)

 * **Indexing and Querying**

    * Remove an internal setting dialog used internally by Couchbase for testing
      consistent views.

      *Issues* : [MB-6713](http://www.couchbase.com/issues/browse/MB-6713)

    * On Window platform, errors occurred trying to update a design document. This is
      now fixed.

      *Issues* : [MB-6653](http://www.couchbase.com/issues/browse/MB-6653)

    * When consistent views were enabled and rebalance was being performed, the
      rebalance would fail. This was due to incorrect handling of empty partitions and
      by accidentally performing disk cleaning before updating partitions which would
      not be indexed. This is fixed.

      *Issues* : [MB-6612](http://www.couchbase.com/issues/browse/MB-6612)

 * **Cross Datacenter Replication (XDCR)**

    * In the past we had displayed several confusing error messages and warnings for
      XDCR. We had provided low level information in the Couchbase Web Console that is
      now provided to low files to avoid overwhelming users with information. We were
      also reporting errors that were actually more appropriately called warnings
      since they were recoverable issues. We have changed those errors to
      warning/advisories.

      *Issues* : [MB-6934](http://www.couchbase.com/issues/browse/MB-6934)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

    * Renamed "XDCR replication queue" in summary section to "XDCR docs to replicate"
      for clarity.

      *Issues* : [MB-6924](http://www.couchbase.com/issues/browse/MB-6924)

    * Replication via XDCR had experienced performance degradation when a data bucket
      contained a higher ratio of expired items. This has been fixed by ignoring the
      expiration time set for an item, `SET_WITH_META`.

      *Issues* : [MB-6662](http://www.couchbase.com/issues/browse/MB-6662)

    * We have added 3 new outbound operation stats, namely, 1) data replicated, which
      is amount of data XDCR have replicated to the remote data center through inter-
      cluster network; 2) active vb replications, which shows the number of ongoing
      active replications to the remote clusters; 3) waiting vb replications, which is
      the number of vb replications in the waiting pool to wait for turn to start
      replication. These stats will be useful for performance monitoring and
      diagnosis.

      *Issues* : [MB-6919](http://www.couchbase.com/issues/browse/MB-6919)

    * Couchbase Server was dropping connections from client libraries too quickly when
      a node in a cluster was being rebalanced. Now there will be more delay until a
      connection is dropped.

      *Issues* : [MB-5406](http://www.couchbase.com/issues/browse/MB-5406)

    * By default, the server automatically disables flushing data from a source data
      bucket when XDCR replications exist for that bucket.

      *Issues* : [MB-6809](http://www.couchbase.com/issues/browse/MB-6809)

 * **Performance**

    * Increase maximum number of retries to open the database file.

      *Issues* : [MB-6844](http://www.couchbase.com/issues/browse/MB-6844)

    * Prioritize flushing pending vbuckets over regular vbuckets. This is a
      performance improvement used for rebalancing buckets that have no views or
      design docs when consistent view mode is enabled.

      *Issues* : [MB-6796](http://www.couchbase.com/issues/browse/MB-6796)

    * Couchbase Server had experienced a one second delay to mark empty and closed
      checkpoints on a persistence queue. Performance improvements made to eliminate
      delay.

      *Issues* : [MB-6714](http://www.couchbase.com/issues/browse/MB-6714)

**Known Issues in 2.0.0 build \#1870**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0h"></a>

## Release Notes for Couchbase Server 2.0.0 Beta (18 September 2012)

This is the Beta release of Couchbase Server 2.0. Couchbase Server 2.0 is the
next major version of Couchbase Server. The 2.0 version adds support for
distributed indexing and query, real-time map/reduce functions and cross-data
center replication. Couchbase Server 2.0 builds on the high performance Simple,
Fast, and Elastic Couchbase Server 1.8. The beta release is available to all
enterprise- and community-edition customers. For more information about
Couchbase Server 2.0, visit [Couchbase Server
2.0](http://www.couchbase.com/couchbase-server/next).

**New Features and Behaviour Changes in 2.0.0**

 * Two sample databases can be loaded either during setup or in the setting panel.

 * Advanced indexing configuration can be updated in the Couchbase Admin console
   including maximum number of index building tasks that are executed in parallel.

 * Design documents for active data are automatically indexed when a threshold on
   time is met or a number of document mutations is reached. This is user
   configurable.

   For more information, see [Automated Index
   Updates](couchbase-manual-ready.html#couchbase-views-operation-autoupdate).

 * New statistics have been added to understand the cross data center replication
   streams. The source cluster will show information about each XDCR including
   document mutation to be replicated.

   For more information, see [Viewing Bucket and Cluster
   Statistics](couchbase-manual-ready.html#couchbase-admin-web-console-monitoring).

 * Backup and Restore support is now available.

   For more information, see [Backup and
   Restore](couchbase-manual-ready.html#couchbase-backup-restore).

 * Debug information has been added into the view and indexing operations to make
   debugging views easier. You can enable this by using `debug=true` as query
   parameter.

 * E-mail alerts can now be created when certain error situations are encountered
   in a cluster.

   For more information, see [Enabling
   Alerts](couchbase-manual-ready.html#couchbase-admin-web-console-settings-alerts).

 * You can now manually compact data and design documents using the admin console.

   For more information, see [Using the Views
   Editor](couchbase-manual-ready.html#couchbase-views-editor).

**Fixes in 2.0.0**

 * **Database Operations**

    * Provide return value of 'not found' in response to get operations on document
      that does not exist.

    * Enable sending compression option as parameter for a document to Couchbase
      Server.

      *Issues* : [MB-6482](http://www.couchbase.com/issues/browse/MB-6482)

 * **Cluster Operations**

    * Fixed incorrect message, 'There are currently no documents in this bucket.' to
      'there are currently no documents in this bucket corresponding to the search
      criteria.'

      *Issues* : [MB-6442](http://www.couchbase.com/issues/browse/MB-6442)

    * Fixed rebalance failure. Rebalanced had stalled after performing failover and
      removing node due to memory leak on cluster nodes.

      *Issues* : [MB-6550](http://www.couchbase.com/issues/browse/MB-6550)

 * **Web Console**

    * Fix Couchbase Admin Console layout when a design document or view has a long
      name.

      *Issues* : [MB-5465](http://www.couchbase.com/issues/browse/MB-5465)

    * Corrected intermittent failures occurred when loading sample data via setup
      wizard or the Settings tab on MAC when user starts couchbase server app for the
      first time. Occurred due to some permission issues.

      *Issues* : [MB-6452](http://www.couchbase.com/issues/browse/MB-6452)

    * Corrected wrong build number displayed in Mac OS X builds in dialog box.

      *Issues* : [MB-6668](http://www.couchbase.com/issues/browse/MB-6668)

    * Fix Couchbase Admin Console behavior when failover is in progress and node goes
      offline.

      *Issues* : [MB-4756](http://www.couchbase.com/issues/browse/MB-4756)

 * **Command-line Tools**

    * Restore connection to hostname instead of IP address.

      *Issues* : [MB-6470](http://www.couchbase.com/issues/browse/MB-6470)

 * **Indexing and Querying**

    * Compaction file for views had been deleted if the process for index compaction
      died.

    * Deleting design documents in development resulted in deleting production index
      files.

      *Issues* : [MB-6517](http://www.couchbase.com/issues/browse/MB-6517)

 * **Cross Datacenter Replication (XDCR)**

    * Fix rebalance timeout failure during unidirectional replication of items via
      XDCR. Failure had returned message: "timeout,
      ns\_memcached-bucket','ns\_1@10.1.3.238'}, {get\_vbucket,".

      *Issues* : [MB-6493](http://www.couchbase.com/issues/browse/MB-6493)

    * Provide REST API endpoint for cancelling replication request.

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

**Known Issues in 2.0.0**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * An upgrade path is not supported to the beta release from prior developer
      preview builds. You need to uninstall your developer preview release and install
      the new release.

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Database Operations**

    * In rare cases codes used to test for data corruption (CRC, checksum) codes do
      not match when reading data from couch file.

      *Issues* : [MB-6538](http://www.couchbase.com/issues/browse/MB-6538)

    * Bucket deletion fails to delete on-disk data and indexes during indexing and
      data compaction.

      *Issues* : [MB-6382](http://www.couchbase.com/issues/browse/MB-6382)

 * **Cluster Operations**

    * Rebalance fails with error "bulk\_set\_vbucket\_state\_failed" due to timeout in
      tap\_replication\_manager for default bucket.

      *Issues* : [MB-6595](http://www.couchbase.com/issues/browse/MB-6595)

    * One of the internal maintenance processes within Couchbase Server for checking
      vBuckets will stop node rebalance when you create replication via XDCR on a
      source cluster.

      A node in a cluster may also stop rebalance when another node orchestrating
      rebalances is over loaded. When a node stops rebalance, it results in the error
      message "Resetting rebalance status since it is not really running".

      Rebalance cna also fail due to the timeout in `bulk_set_vbucket_state` operation
      with continuous view queries.

      *Issues* : [MB-6481](http://www.couchbase.com/issues/browse/MB-6481),
      [MB-6573](http://www.couchbase.com/issues/browse/MB-6573),
      [MB-7212](http://www.couchbase.com/issues/browse/MB-7212)

    * Microsoft Windows 7: when you create a bucket immediately after another bucket
      is deleted, Couchbase Server may timeout.

      *Issues* : [MB-6664](http://www.couchbase.com/issues/browse/MB-6664)

    * `memcached` hangs when aborting during swap rebalance operation and fails to
      restart ( exit 71 ).

      *Issues* : [MB-6592](http://www.couchbase.com/issues/browse/MB-6592)

 * **Web Console**

    * The Couchbase Admin console needs to handle a very slow docloader.
      Alternatively, docloader may be too slow.

      *Issues* : [MB-5938](http://www.couchbase.com/issues/browse/MB-5938)

    * `Preview Random Document` in the View tab does not show the actual values for
      document revision, expiration, flags.

      *Issues* : [MB-6620](http://www.couchbase.com/issues/browse/MB-6620)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Indexing and Querying**

    * Development indexes will remain on disk after bucket deletion.

      *Issues* : [MB-6366](http://www.couchbase.com/issues/browse/MB-6366)

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

    * If a cluster is being rebalanced, and a node does not yet have any active
      vBuckets, you will receive the error `"error":"no_active_vbuckets"` when you
      query a view via the REST API.

      *Issues* : [MB-6633](http://www.couchbase.com/issues/browse/MB-6633)

    * Indexing 11 design documents at once will significantly reduce Couchbase Server
      response times.

      *Issues* : [MB-6392](http://www.couchbase.com/issues/browse/MB-6392)

 * **Cross Datacenter Replication (XDCR)**

    * `beam.smp` memory usage grows to 2 GB when XDCR feature is enabled and
      rebalancing is in progress.

      *Issues* : [MB-6649](http://www.couchbase.com/issues/browse/MB-6649)

    * Very inconsistent statistics may occur with bi-directional XDCR when running
      with a moderate/low load.

      *Issues* : [MB-6598](http://www.couchbase.com/issues/browse/MB-6598)

    * Replication rat e may drop when the XDCR replication queue size becomes less
      than 500 items.

      *Issues* : [MB-6586](http://www.couchbase.com/issues/browse/MB-6586)

    * You may experience very slow replication rates (less than 100 items on average
      per second) with 2 unidirectional replications between 2 clusters.

      *Issues* : [MB-6643](http://www.couchbase.com/issues/browse/MB-6643)

 * **Performance**

    * Mac OS X startup time for restart is quite long considering the number of items.

      *Issues* : [MB-6613](http://www.couchbase.com/issues/browse/MB-6613)

    * `ep-engine` needs 1.5 minutes to create 1024 vbuckets. This may be too slow,
      however performance improves with setting barrier=0.

      *Issues* : [MB-6232](http://www.couchbase.com/issues/browse/MB-6232)

<a id="couchbase-server-rn_2-0-0g"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1672 Developer Preview (10 September 2012)

**New Features and Behaviour Changes in 2.0.0 Build \#1672**

 * New statistics have been added to understand the cross data center replication
   streams. The source cluster will show information about each XDCR including
   document mutation to be replicated.

   For more information, see [Viewing Bucket and Cluster
   Statistics](couchbase-manual-ready.html#couchbase-admin-web-console-monitoring).

**Fixes in 2.0.0 Build \#1672**

 * **Database Operations**

    * Use the mutation log compactor sleep time from the configuration

    * Check each vbucket's bg queue to set the task sleep time

      *Issues* : [MB-6215](http://www.couchbase.com/issues/browse/MB-6215)

    * Only one access scanner should be scheduled at any time

      *Issues* : [MB-6211](http://www.couchbase.com/issues/browse/MB-6211)

    * Refactor add\_with\_meta test function

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Update access scanner run counter when it is completed.

      *Issues* : [MB-6194](http://www.couchbase.com/issues/browse/MB-6194)

    * Requeue failed bgfetch requests for retry

      *Issues* : [MB-6222](http://www.couchbase.com/issues/browse/MB-6222)

    * Disable access scanner scheduling at a specific time

      *Issues* : [MB-6057](http://www.couchbase.com/issues/browse/MB-6057)

    * Reset checkpoint cursors after receiving backfill streams

      *Issues* : [MB-6084](http://www.couchbase.com/issues/browse/MB-6084)

    * Remove the mutation log if exists at the end of each test runs

    * expose TAP\_FLAG\_TAP\_FIX\_FLAG\_BYTEORDER to python

      *Issues* : [MB-6176](http://www.couchbase.com/issues/browse/MB-6176)

    * return TMPFAIL for failed bgfetch instead of assert

      *Issues* : [MB-6323](http://www.couchbase.com/issues/browse/MB-6323)

 * **Cluster Operations**

    * Fixed iterate\_ddocs return values

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Replication stats on UI

      *Issues* : [MB-5943](http://www.couchbase.com/issues/browse/MB-5943)

    * Faster xdcr startup by using cached remote cluster info

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Add logs to time replication stop

      *Issues* : [MB-6041](http://www.couchbase.com/issues/browse/MB-6041)

    * Send out email alerts asynchronously.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Don't send web alerts emails when they are disabled.

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Added cancel bucket compaction button

      *Issues* : [CBD-181](http://www.couchbase.com/issues/browse/CBD-181)

    * Periodically update replica indexes.

      *Issues* : [MB-6269](http://www.couchbase.com/issues/browse/MB-6269)

    * Restart view compaction when getting shutdown errors.

      *Issues* : [MB-6342](http://www.couchbase.com/issues/browse/MB-6342)

    * Expose xdcr replications via tasks API

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

    * Maintain and collect XDCR vb stats

      *Issues* : [MB-5943](http://www.couchbase.com/issues/browse/MB-5943)

    * Added false/true options for reduce

      *Issues* : [MB-6149](http://www.couchbase.com/issues/browse/MB-6149)

    * REST API to alter set view update daemon parameters

      *Issues* : [CBD-423](http://www.couchbase.com/issues/browse/CBD-423)

    * REST API to update per ddoc updateMinChanges.

      *Issues* : [CBD-423](http://www.couchbase.com/issues/browse/CBD-423)

    * Don't shutdown bucket unless we're deleting it

      *Issues* : [MB-6384](http://www.couchbase.com/issues/browse/MB-6384)

    * Use optimized math for cache miss rate

      *Issues* : [MB-6403](http://www.couchbase.com/issues/browse/MB-6403)

    * Add compaction\_daemon settings to config on upgrade.

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * More efficient index state computation

      *Issues* : [CBD-546](http://www.couchbase.com/issues/browse/CBD-546)

    * Allow sending web alerts via email.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Sort ddocs by id on ddocs endpoint

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

    * Inform user whether swap rebalance happens

      *Issues* : [MB-6162](http://www.couchbase.com/issues/browse/MB-6162)

    * Move email helpers from ns\_mail\_log to ns\_mail.

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Enabled emails for all alerts by default

      *Issues* : [MB-6131](http://www.couchbase.com/issues/browse/MB-6131)

    * Implemented replication cancellation endpoint

      *Issues* : [MB-6381](http://www.couchbase.com/issues/browse/MB-6381)

    * Fixed saving map/reduce functions into wrong views

      *Issues* : [MB-6167](http://www.couchbase.com/issues/browse/MB-6167)

    * Bump up default MAX\_CONCURRENT\_REPS\_PER\_DOC to 32

      *Issues* : [CBD-399](http://www.couchbase.com/issues/browse/CBD-399)

    * Started new REST api docs

      *Issues* : [MB-5307](http://www.couchbase.com/issues/browse/MB-5307)

 * **Indexing and Querying**

    * Fix too high memory consumption during indexing

      *Issues* : [MB-6096](http://www.couchbase.com/issues/browse/MB-6096)

    * Ignore index pausing of already paused partitions

      *Issues* : [MB-6165](http://www.couchbase.com/issues/browse/MB-6165)

    * More explicit error message when keys are too long

      *Issues* : [MB-6295](http://www.couchbase.com/issues/browse/MB-6295)

    * Delete index files on terminate after ddoc updated

      *Issues* : [MB-6415](http://www.couchbase.com/issues/browse/MB-6415)

    * Delete compaction file if index compactor dies

      *Issues* : [MB-100](http://www.couchbase.com/issues/browse/MB-100)

    * Delete index files on view group terminate

      *Issues* : [MB-6415](http://www.couchbase.com/issues/browse/MB-6415)

**Known Issues in 2.0.0 Build \#1672**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0f"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1554 Developer Preview (10 August 2012)

Couchbase Server 2.0.0 build 1530 contains important document behavior changes
that may impact your existing applications. Specifically, this and future
releases include changes the way document metadata is handled and exposed when
working with Views and creating map and reduce functions in Couchbase Server.

In previous releases, the document supplied as the only argument to the `map()`
function included special fields with an additional prefix that provided
information such as the data type, flags, expiration and document ID. For
example:


```
{
 "_id" : "contact_475",
 "_rev" : "1-AB9087AD0977F089",
 "_bin" : "...",
 "$flags" : 0,
 "$expiration" : 0,
 "name" : "Fred Bloggs",
}
```

This representation has been changed so that the submitted document data and
structure remain identical to the document stored and returned by the Views
system.

The metadata is now supplied as a object and second argument to the `map()`
function. The format of this object is a JSON document with fields for each of
the metadata items previously incorporated in the main document. For example:


```
{
 "id" : "contact_475",
 "rev" : "1-AB9087AD0977F089",
 "flags" : 0,
 "expiration" : 0,
 "type" : "json",
}
```

The main flags and their contents remain the same. The `_bin`, `$att_reason`
have been replaced with a single field, `type`, that indicates the document data
type. For documents identified as valid JSON, the field will have the value
`json`. For non-JSON, the value will be `base64`.

The meta information for sample documents is now displayed separately, within a
non-editable portion of the Web Console.

In addition to these changes, the format and information supplied to the `map()`
function has changed.

To access only the document data within your View, you can use the following
`map()` :


```
function(doc) {
}
```

To access the document data and document metadata, including document ID and
expiration time, use the two-argument format of the function:


```
function(doc,meta) {
}
```

For example, to emit only document information from the View based on the
following document structure:


```
{
 "name": "John",
 "e-mail": "john@john.com"
}
```

Create a view using only the document object:


```
function (doc) {
 emit(doc.name,null);
}
```

To create a view that explicitly emits the document ID:


```
function (doc,meta) {
 emit(meta.id,doc.name);
}
```

In addition, the `doc` argument now contains a base64 representation of the
document data if the document is not JSON. This can identified using the `type`
field of the `meta` object. The default `map()` provided within the
Administration Web Console is now:


```
function (doc, meta) {
 if (meta.type == "json") {
 // If the document is JSON, sort by the schema
 var keys = Object.keys(doc);
 emit(["json", keys.length], keys);
 } else {
 emit(["blob"]);
 }
}
```

This provides an example of how to process and output documents that are valid
JSON or binary documents, using the `meta` argument to identify the document
data type.

Existing client libraries continue to work with the new release without
modification to the View or document update mechanisms and information.

**New Features and Behaviour Changes in 2.0.0 Build \#1554**

 * Behavior Change: Identifying the content type of the document can no longer be
   achieved by using the `doc._bin` field of the document object. Instead, you
   should use the `meta.type` field. This will be set to `json` for documents
   identified as valid JSON documents. For documents that cannot be identified as
   valid JSON, the field will be set to `base64`.

   For more information, see [Document
   Metadata](couchbase-manual-ready.html#couchbase-views-datastore-fields).

 * Behavior Change: Document metadata is no longer included as fields within the
   document supplied to the `map()` function as an argument within a view. Instead,
   the function is now supplied two arguments, the document data, and a second
   argument, `meta`, that contains the expiration, flags and an indication of the
   document data type.

   For more information, see [Document
   Metadata](couchbase-manual-ready.html#couchbase-views-datastore-fields).

 * Behavior Change: The document ID for a given document is no longer available
   within the document object supplied to the `map()`. Instead of using `doc._id`
   you should now use the `id` field of the `meta` object, `meta.id`. The
   two-argument form of the `map()` must be used for this purpose.

   For more information, see [Map
   Functions](couchbase-manual-ready.html#couchbase-views-writing-map).

 * Behavior Change: Because document metadata is now exposed within a separate
   structure, the Admin Console displays the sample document metadata separately
   from the main document content.

   For more information, see [Using the Views
   Editor](couchbase-manual-ready.html#couchbase-views-editor).

 * Behavior Change: When deleting a design document, the `_rev` parameter is no
   longer required to confirm the deletion.

   For more information, see [Design Document REST
   API](couchbase-manual-ready.html#couchbase-views-designdoc-api).

 * Behavior Change: The `map()` is now supplied two arguments, `doc`, which
   contains the document data, and `meta`, which contains the document metadata.

   For more information, see [Map
   Functions](couchbase-manual-ready.html#couchbase-views-writing-map).

**Known Issues in 2.0.0 Build \#1554**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0e"></a>

## Release Notes for Couchbase Server 2.0.0 Build #1495 Developer Preview (26 July 2012)

Couchbase Server 2.0.0 build 1495 introduces important changes with respect to
accesing views from buckets that have been secure with SASL authentication.

To access a view from a bucket with SASL authentication through the REST API you
must supply the bucket name and password as the username and password to the URL
of the HTTP request. For example:


```
GET http://bucketname:bucketpass@localhost:8092/bucketname/_design/designdocname/_view/viewname
```

Failure to provide the authentication information on a secure bucket will result
in an HTTP error response (401).

For more information, see [Querying Using the REST
API](couchbase-manual-ready.html#couchbase-views-querying-rest-api).

The same rules also apply to creating and reading design documents using the
REST API.

For more information, see [Design Document REST
API](couchbase-manual-ready.html#couchbase-views-designdoc-api).

**Known Issues in 2.0.0 Build \#1495**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

<a id="couchbase-server-rn_2-0-0d"></a>

## Release Notes for Couchbase Server 2.0.0DP4 Developer Preview (21 March 2012)

Couchbase Server 2.0.0 Developer Preview 4 contains a number of new features and
functionality.

**What's new in this release**

 * **Replica Indexes**

   The indexes generated by the map/reduce view interface are replicated across the
   cluster. This ensures that if there is a failover scenario, the index
   information does not have to be regenerated by the replacement node.

 * **Experimental Geospatial Indexing**

   Support has been added for supporting geospatial indexing and querying. The
   geospatial interface enables the storage of two-dimensional geometry points.
   Views can then be written that index this information, and queries can be
   written that return the geospatial information based on the provision of a
   bounding-box to the geometry data.

   For more information, see [Writing Geospatial
   Views](couchbase-manual-ready.html#couchbase-views-writing-geo).

 * **Sample Databases**

   Couchbase Server now includes sample databases as part of the installation and
   setup process. You can load the sample data and associated views. This provides
   both the sample data structures and map/reduce queries to enable youf to
   understand and create your own datasets and views.

   For more information, see [Couchbase Sample
   Buckets](couchbase-manual-ready.html#couchbase-sampledata).

**New Features and Behaviour Changes in 2.0.0DP4**

 * The index/view related improvements are for production views or development
   views with `full_set=true`.

 * The indexes created by the view system are now replicated among nodes to ensure
   that indexes do not need to be rebuilt in the event of a failover.

 * A new option, `on_error` has been added to control the behaviour of the view
   engine when returning a request. By default the value is `continue`, which
   indicates that the view engine should continue to return results in the event of
   an error. You can also set the option to `stop` to stop the view results being
   returned on failure.

   For more information, see [Error
   Control](couchbase-manual-ready.html#couchbase-views-writing-querying-errorcontrol).

   *Tags* : views

 * The view system has been stabilised to work even while the cluster topology is
   changing through rebalance and failover operations.

 * The design document and view system has been updated with the ability to create
   multiple design docs and query all these design docs in parallel.

 * Experimental support for geospatial indexing has been added.

   For more information, see [Writing Geospatial
   Views](couchbase-manual-ready.html#couchbase-views-writing-geo).

   *Tags* : experimental, geospatial

 * You now have the option to have sample data (and views) created during the
   installation and setup process. This operation requires Python 2.6.

   For more information, see [Couchbase Sample
   Buckets](couchbase-manual-ready.html#couchbase-sampledata).

 * A number of stability bugs have been fixed when querying and merging views.

 * The default value of the `stale` argument when querying views has been changed
   to `update_after`. This means that by default view information will always be
   returned 'stale', and updated after the view request has completed.

   You can force a view update by specifying `false` to the `stale`, or `ok` to
   enable stale views without an implied update after the view data has been
   returned.

   For more information, see [Querying
   Views](couchbase-manual-ready.html#couchbase-views-writing-querying).

   *Tags* : views

 * Support for changing (and accessing) the number of parallel indexing processes
   used to build the view index information has been added to the Couchbase
   Management REST API.

   For more information, see [Setting Maximum Parallel
   Indexers](couchbase-manual-ready.html#couchbase-admin-restapi-settings-maxparallelindexers).

   *Tags* : restapi, views

**Fixes in 2.0.0DP4**

 * **Cluster Operations**

    * Rebalancing in a new Couchbase Server 1.8 node if there are less than 500,000
      items results in an imbalanced cluster.

      *Issues* : [MB-4595](http://www.couchbase.com/issues/browse/MB-4595)

    * When upgrading from Couchbase Server 1.8.0 to 1.8.1 or Couchbase Server 1.8.0 to
      2.0, an offline upgrade may fail with a rebalance failure reporting the error
      `{wait_for_memcached_failed,"bucket-1"}`.

      *Issues* : [MB-5532](http://www.couchbase.com/issues/browse/MB-5532)

 * **Unclassified**

    * The web console UI had an incorrect query parameter, `start_key_docid` available
      for selection. This should have been `start_key_doc_id`.

      *Issues* : [MB-4781](http://www.couchbase.com/issues/browse/MB-4781)

    * When deleting a bucket, and then creating a new bucket with the same name, the
      views associated with the deleted bucket would reappear.

      *Issues* : [MB-4562](http://www.couchbase.com/issues/browse/MB-4562)

    * The `ep-engine` component did not persist the mutated replica items to disk.

      *Issues* : [MB-4629](http://www.couchbase.com/issues/browse/MB-4629)

    * The number of threads started when building indexes could increase to an
      unmanageable level causing a significant performance problem. The indexing
      system has been configured so that the main indexers get 4 exclusive slots, and
      the replica index builders 2 exclusive slots to ensure that the indexing process
      proceeds effectively.

      *Issues* : [MB-4848](http://www.couchbase.com/issues/browse/MB-4848)

    * Accessing a view query would fail if the user changes a design document while a
      rebalance was occurring, and then accesses the updated view.

      *Issues* : [MB-4626](http://www.couchbase.com/issues/browse/MB-4626)

    * Accessing a view using a reduce could report different counts from different
      nodes after a cluster has been rebalanced with the addition of new nodes.

      *Issues* : [MB-4500](http://www.couchbase.com/issues/browse/MB-4500)

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * The `ns_server` process could crash on Linux because of too many open file
      descriptors if more than 10 views were defined on a single bucket.

      *Issues* : [MB-4514](http://www.couchbase.com/issues/browse/MB-4514)

    * Creating a view with a `reduce` function, and querying while changing the
      cluster topology through a rebalance could cause incorrect results.

      *Issues* : [MB-4692](http://www.couchbase.com/issues/browse/MB-4692)

    * Accessing the `timings` statistics through the `cbstats` command would fail.

      *Issues* : [MB-4718](http://www.couchbase.com/issues/browse/MB-4718)

    * The compaction process on a node can be terminated while data is still being
      loaded, but fail to restarted again while the node is still under load.

      *Issues* : [MB-4732](http://www.couchbase.com/issues/browse/MB-4732),
      [MB-4774](http://www.couchbase.com/issues/browse/MB-4774)

    * If you remove and rebalance a node out of a running cluster while clients are
      awaiting view results from that node, the node would fail to be rebalanced
      properly.

      *Issues* : [MB-4752](http://www.couchbase.com/issues/browse/MB-4752)

    * An incorrect total cluster storage figure could be reported if the `index_path`
      and `data_path` configurations are on the same disk.

      *Issues* : [MB-4512](http://www.couchbase.com/issues/browse/MB-4512)

    * When accessing information using the basic create, read, update or delete
      operations, the `$flags` and `$expiration` flags are returned through the HTTP
      API for individual documents. This matches the output available through the view
      API when including the entire document.

      *Issues* : [MB-4549](http://www.couchbase.com/issues/browse/MB-4549)

**Known Issues in 2.0.0DP4**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Indexing and Querying**

    * Accessing a recently created view (with other, existing active views) may return
      a error if the corresponding design document and view definition have not been
      replicated across the cluster. The error return will be returned in error of the
      view output detailing the missing design document. The workaround is to add
      views and design documents to your node or cluster after you have performed
      rebalance. For more information about resolving issues with Couchbase Views, see
      [Troubleshooting Views (Technical
      Background)](couchbase-manual-ready.html#couchbase-views-troubleshooting).

      Note also that stopping a rebalance operation on a cluster may take a long time
      if compaction and indexing operations are in progress on the cluster at the
      point of rebalance. Again, the workaround is to add views and index and query
      views after you have performed compaction or rebalance. For more information
      about rebalance, and considerations on when to rebalance, see
      [Rebalancing](couchbase-manual-ready.html#couchbase-admin-tasks-addremove).

      *Issues* : [MB-6726](http://www.couchbase.com/issues/browse/MB-6726),
      [MB-6339](http://www.couchbase.com/issues/browse/MB-6339)

 * **Unclassified**

    * The `default` bucket may be shutdown unexpectedly when accessing multiple views
      using the test script environment.

      *Issues* : [MB-4940](http://www.couchbase.com/issues/browse/MB-4940) ; *Tags* :
      windows

    * Because of the way information is stored within the cluster, persisted to disk,
      and views are updated, it is possible to store a value into the cluster and be
      unable to immediately retrieve that value through a corresponding view.

      *Tags* : views

      For more information, see [Document Storage and Indexing
      Sequence](couchbase-manual-ready.html#couchbase-views-datastore-indexseq).

    * A rebalance on Windows may fail when adding a new node to the cluster with the
      error `{wait_for_memcached_failed,"bucket-9"}` on a cluster configured with 10
      buckets.

      *Issues* : [MB-4849](http://www.couchbase.com/issues/browse/MB-4849) ; *Tags* :
      windows

    * Couchbase Server can fail when adding a failed over node back into a cluster
      during a rebalance operation with the error:

       ```
       Core was generated by `/opt/couchbase/bin/memcached -X /opt/couchbase/lib/memcached/stdin_term_handler'.
       Program terminated with signal 11, Segmentation fault.
       #0 LoadStorageKVPairCallback::callback (this=0xb9dd8c0, val=...) at stored-value.hh:168
       in stored-value.hh
       ```

      *Workaround* : Reinstall Couchbase Server on the node that failed before adding
      the node back and performing the rebalance.

      *Issues* : [MB-4959](http://www.couchbase.com/issues/browse/MB-4959)

    * Rebalance may fail because `memcached` is closing the connection during the
      authentication request.

      *Issues* : [MB-4824](http://www.couchbase.com/issues/browse/MB-4824)

    * A rebalance when removing a single node from an existing cluster can fail on
      Windows with the error `wait_for_memcached_failed,"default"`.

      *Issues* : [MB-4890](http://www.couchbase.com/issues/browse/MB-4890) ; *Tags* :
      windows

    * View queries return "inconsistent state" error if user calls the `flush`
      operation.

      *Issues* : [MB-4717](http://www.couchbase.com/issues/browse/MB-4717),

    * The disk write queue can become high and very slow to drain if user is running
      view queries on a large number of design docs simultaneously, with compaction
      and index still in progress.

      *Issues* : [MB-4846](http://www.couchbase.com/issues/browse/MB-4846)

    * Couchbase Server may fail to restart properly after having been shutdown.

      *Issues* : [MB-4933](http://www.couchbase.com/issues/browse/MB-4933) ; *Tags* :
      windows

    * Querying views when new nodes are added and not rebalanced into the cluster,
      with another node failed over generate an error:

       ```
       {
        "error":"error",
        "reason":"A view spec can not consist of merges exclusively."
       }
       ```

      *Issues* : [MB-4804](http://www.couchbase.com/issues/browse/MB-4804)

    * The Couchbase sample bucket loader scripts require Python 2.6 as the default
      version of Python installed. If Python is installed, but the default is not
      Python 2.6 the sample bucket loader script will fail.

      *Workaround* : You can install Python 2.6 and then create a link between
      `/usr/bin/python` to point to the installed `/usr/bin/python2.6`.

      *Issues* : [MB-4724](http://www.couchbase.com/issues/browse/MB-4724)

    * Disk usage can grow because compaction does not run until the indexing process
      has finished. In a system with a high number of design docs, the indexing takes
      too long.

      *Issues* : [MB-4849](http://www.couchbase.com/issues/browse/MB-4849)

<a id="couchbase-server-rn_2-0-0c"></a>

## Release Notes for Couchbase Server 2.0.0DP3 Developer Preview (13 December 2011)

This is the 3rd 'developer preview' edition of Couchbase Server 2.0.

**New Features and Behaviour Changes in 2.0.0DP3**

 * Status bars have been added to show view building and rebalance progress.

 * The admin Web Console includes a document viewing and editing interface.

   For more information, see [Using the Document
   Editor](couchbase-manual-ready.html#couchbase-admin-web-console-documents).

 * The Couch API REST port has been changed from 5984 to 8092. Applications using
   5984 for view creation and basic create, read, update, and delete operations
   need to be updated to use the updated port.

   *Tags* : important, incompatible, network

 * Major performance and stability improvements when merging views across multiple
   nodes.

 * Major performance improvements when writing and persisting data to disk from
   memory.

**Fixes in 2.0.0DP3**

 * **Unclassified**

    * Couchbase Server would fail to start on Windows Server 2008 64-bit platform.

      *Issues* : [MB-4380](http://www.couchbase.com/issues/browse/MB-4380) ; *Tags* :
      installer, windows

    * During the warm-up process when the server is first starting and loading items,
      `ep-engine` could fail with an assertion error.

      *Issues* : [MB-4513](http://www.couchbase.com/issues/browse/MB-4513)

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * `memcached` could crash while rebalancing a large number of nodes with a very
      high number of items.

      *Issues* : [MB-4394](http://www.couchbase.com/issues/browse/MB-4394)

    * When running the view tests on Windows, Couchbase Server could hang and fail to
      return any values.

      *Issues* : [MB-4515](http://www.couchbase.com/issues/browse/MB-4515)

    * The resident ratio of items could report a negative number of items.

      *Issues* : [MB-4340](http://www.couchbase.com/issues/browse/MB-4340)

    * The JSON encoding system within the view indexing module could over escape
      double quotes within embedded values.

      *Issues* : [MB-4511](http://www.couchbase.com/issues/browse/MB-4511)

**Known Issues in 2.0.0DP3**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

 * **Unclassified**

    * Querying a view when deleting items and performing a rebalance simultaneous
      leads to invalid results.

      *Issues* : [MB-4518](http://www.couchbase.com/issues/browse/MB-4518)

    * View queries return "inconsistent state" error after a failover and rebalance
      operation.

      *Issues* :

    * Rebalancing can cause `memcached` to fail with error status 255.

      *Issues* :

    * Query results from views may be incorrect when the topology of the cluster
      changes.

    * It is not possible up create a bucket with uppercase letters in the bucket name.

      *Issues* : [MB-4265](http://www.couchbase.com/issues/browse/MB-4265)

    * Accessing a view using a reduce could report different counts from different
      nodes after a cluster has been rebalanced with the addition of new nodes.

      *Issues* : [MB-4500](http://www.couchbase.com/issues/browse/MB-4500)

<a id="couchbase-server-rn_2-0-0b"></a>

## Release Notes for Couchbase Server 2.0.0DP2 Developer Preview (23 August 2011)

This is the 2nd 'developer preview' edition of Couchbase Server 2.0.

**Known Issues in 2.0.0DP2**

 * **Installation and Upgrade**

    * It is not possible to perform an upgrade between Couchbase Server 2.0
      pre-releases including beta, or to perform an offline upgrade from Couchbase
      Server 1.8 to a pre-release or beta of Couchbase Server 2.0. To upgrade between
      these versions use `cbbackup` to backup your data, delete the existing
      installation, install the new version, and restore the stored data.

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

    * Documents identified as Non-JSON stored within Couchbase Server may appear as
      binary, or text-encoded binary data within the UI.

      *Issues* : [MB-7069](http://www.couchbase.com/issues/browse/MB-7069)

    * During periods of moderate CPU load on the Couchbase Server cluster, you may see
      warnings that `IP address seems to have changed. Unable to listen to node
      X.X.X.X`.

      *Issues* : [MB-7115](http://www.couchbase.com/issues/browse/MB-7115),
      [MB-7238](http://www.couchbase.com/issues/browse/MB-7238),
      [MB-7228](http://www.couchbase.com/issues/browse/MB-7228)

 * **Command-line Tools**

    * The `cbbackup`, `cbrestore`, and `cbtransfer` command-line tools require the
      `zlib` module for Python to have been installed. If Python was installed from
      source, you must have enabled `zlib` using the `--with-zlib` option during the
      build process.

      *Issues* : [MB-7256](http://www.couchbase.com/issues/browse/MB-7256)

      For more information, see [Backup and
      Restore](couchbase-manual-ready.html#couchbase-backup-restore), [Uninstalling
      Couchbase Server](couchbase-manual-ready.html#couchbase-uninstalling).

<a id="couchbase-server-rn_2-0-0a"></a>

## Release Notes for Couchbase Server 2.0.0DP Developer Preview (29 July 2011)

This is the 1st 'developer preview' edition of Couchbase Server 2.0.

<a id="couchbase-server-limits"></a>

# Appendix: Limits

Couchbase Server has a number of limits and limitations that may affect your use
of Couchbase Server.

<a id="table-couchbase-server-limits"></a>

Limit                   | Value                               
------------------------|-------------------------------------
Max key length          | 250 bytes                           
Max value size          | 20 Mbytes                           
Max data size           | none                                
Max metadata            | Approximately 150 bytes per document
Max Buckets per Cluster | 10                                  
Max View Key Size       | 4096 bytes                          

<a id="couchbase-server-limits-limitations"></a>

## Known Limitations

The following list provides a summary of the known limitations within Couchbase
Server 2.0.

 * Amazon "micro" and "small" instances are not supported.

   *Workaround* : It is a best practice to use at least "large" instances to
   provide enough RAM for Couchbase to run.

   *Issues* : [MB-3911](http://www.couchbase.com/issues/browse/MB-3911)

 * Couchbase Server fails to run on Windows system with PGP (http://www.pgp.com)
   installed.

   *Workaround* : Uninstall PGP on any systems running Couchbase.

   *Issues* : [MB-3688](http://www.couchbase.com/issues/browse/MB-3688)

 * Network Filesystems (CIFS/NFS) are not supported for data file storage.
   Block-based storage (iSCSI, EBS, etc) work correctly.

   *Issues* : [MB-3333](http://www.couchbase.com/issues/browse/MB-3333)

 * Unsynchronized clocks can lead to UI not displaying graphs.

   *Workaround* : Make sure all the clocks (and their timezones) are synchronized
   in a Couchbase cluster. Use NTP or some other synchronization technology.

   *Issues* : [MB-2833](http://www.couchbase.com/issues/browse/MB-2833)

 * Rebooting a node that re-enables the firewall service on that node will mark all
   the vBuckets on the node as dead and unavailable.

   *Issues* : [MB-5282](http://www.couchbase.com/issues/browse/MB-5282)

<a id="licenses"></a>

# Appendix: Licenses

This documentation and associated software is subject to the following licenses.

<a id="license-documentation"></a>

## Documentation License

This documentation in any form, software or printed matter, contains proprietary
information that is the exclusive property of Couchbase. Your access to and use
of this material is subject to the terms and conditions of your Couchbase
Software License and Service Agreement, which has been executed and with which
you agree to comply. This document and information contained herein may not be
disclosed, copied, reproduced, or distributed to anyone outside Couchbase
without prior written consent of Couchbase or as specifically provided below.
This document is not part of your license agreement nor can it be incorporated
into any contractual agreement with Couchbase or its subsidiaries or affiliates.

Use of this documentation is subject to the following terms:

You may create a printed copy of this documentation solely for your own personal
use. Conversion to other formats is allowed as long as the actual content is not
altered or edited in any way. You shall not publish or distribute this
documentation in any form or on any media, except if you distribute the
documentation in a manner similar to how Couchbase disseminates it (that is,
electronically for download on a Web site with the software) or on a CD-ROM or
similar medium, provided however that the documentation is disseminated together
with the software on the same medium. Any other use, such as any dissemination
of printed copies or use of this documentation, in whole or in part, in another
publication, requires the prior written consent from an authorized
representative of Couchbase. Couchbase and/or its affiliates reserve any and all
rights to this documentation not expressly granted above.

This documentation may provide access to or information on content, products,
and services from third parties. Couchbase Inc. and its affiliates are not
responsible for and expressly disclaim all warranties of any kind with respect
to third-party content, products, and services. Couchbase Inc. and its
affiliates will not be responsible for any loss, costs, or damages incurred due
to your access to or use of third-party content, products, or services.

The information contained herein is subject to change without notice and is not
warranted to be error-free. If you find any errors, please report them to us in
writing.

<a id="licenses-community"></a>

## Couchbase, Inc. Community Edition License Agreement

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS COMMUNITY EDITION LICENSE
AGREEMENT (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU REPRESENT
AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO THIS
AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE "I
ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. License Grant. Couchbase Inc. hereby grants Licensee, free of charge, the
    non-exclusive right to use, copy, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to Licensee including the following copyright notice
    in all copies or substantial portions of the Software:

     ```
     Couchbase ©
     http://www.couchbase.com
     Copyright 2011 Couchbase, Inc.
     ```

    As used in this Agreement, "Software" means the object code version of the
    applicable elastic data management server software provided by Couchbase, Inc.

 1. Support. Couchbase, Inc. will provide Licensee with access to, and use of, the
    Couchbase, Inc. support forum available at the following URL:
    http://forums.membase.org. Couchbase, Inc. may, at its discretion, modify,
    suspend or terminate support at any time upon notice to Licensee.

 1. Warranty Disclaimer and Limitation of Liability. THE SOFTWARE IS PROVIDED "AS
    IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL COUCHBASE INC. OR THE AUTHORS OR COPYRIGHT
    HOLDERS IN THE SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES (INCLUDING, WITHOUT
    LIMITATION, DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES) OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a id="licenses-enterprise"></a>

## Couchbase, Inc. Enterprise License Agreement: Free Edition

IMPORTANT-READ CAREFULLY: BY CLICKING THE "I ACCEPT" BOX OR INSTALLING,
DOWNLOADING OR OTHERWISE USING THIS SOFTWARE AND ANY ASSOCIATED DOCUMENTATION,
YOU, ON BEHALF OF YOURSELF OR AS AN AUTHORIZED REPRESENTATIVE ON BEHALF OF AN
ENTITY ("LICENSEE") AGREE TO ALL THE TERMS OF THIS ENTERPRISE LICENSE AGREEMENT
– FREE EDITION (THE "AGREEMENT") REGARDING YOUR USE OF THE SOFTWARE. YOU
REPRESENT AND WARRANT THAT YOU HAVE FULL LEGAL AUTHORITY TO BIND THE LICENSEE TO
THIS AGREEMENT. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, DO NOT SELECT THE
"I ACCEPT" BOX AND DO NOT INSTALL, DOWNLOAD OR OTHERWISE USE THE SOFTWARE. THE
EFFECTIVE DATE OF THIS AGREEMENT IS THE DATE ON WHICH YOU CLICK "I ACCEPT" OR
OTHERWISE INSTALL, DOWNLOAD OR USE THE SOFTWARE.

 1. **License Grant**. Subject to Licensee's compliance with the terms and
    conditions of this Agreement, Couchbase Inc. hereby grants to Licensee a
    perpetual, non-exclusive, non-transferable, non-sublicensable, royalty-free,
    limited license to install and use the Software only for Licensee's own internal
    production use on up to two (2) Licensed Servers or for Licensee's own internal
    non-production use for the purpose of evaluation and/or development on an
    unlimited number of Licensed Servers.

 1. **Restrictions**. Licensee will not: (a) copy or use the Software in any manner
    except as expressly permitted in this Agreement; (b) use or deploy the Software
    on any server in excess of the Licensed Servers for which Licensee has paid the
    applicable Subscription Fee unless it is covered by a valid license; (c)
    transfer, sell, rent, lease, lend, distribute, or sublicense the Software to any
    third party; (d) use the Software for providing time-sharing services, service
    bureau services or as part of an application services provider or as a service
    offering primarily designed to offer the functionality of the Software; (e)
    reverse engineer, disassemble, or decompile the Software (except to the extent
    such restrictions are prohibited by law); (f) alter, modify, enhance or prepare
    any derivative work from or of the Software; (g) alter or remove any proprietary
    notices in the Software; (h) make available to any third party the functionality
    of the Software or any license keys used in connection with the Software; (i)
    publically display or communicate the results of internal performance testing or
    other benchmarking or performance evaluation of the Software; or (j) export the
    Software in violation of U.S. Department of Commerce export administration rules
    or any other export laws or regulations.

 1. **Proprietary Rights**. The Software, and any modifications or derivatives
    thereto, is and shall remain the sole property of Couchbase Inc. and its
    licensors, and, except for the license rights granted herein, Couchbase Inc. and
    its licensors retain all right, title and interest in and to the Software,
    including all intellectual property rights therein and thereto. The Software may
    include third party open source software components. If Licensee is the United
    States Government or any contractor thereof, all licenses granted hereunder are
    subject to the following: (a) for acquisition by or on behalf of civil agencies,
    as necessary to obtain protection as "commercial computer software" and related
    documentation in accordance with the terms of this Agreement and as specified in
    Subpart 12.1212 of the Federal Acquisition Regulation (FAR), 48 C.F.R.12.1212,
    and its successors; and (b) for acquisition by or on behalf of the Department of
    Defense (DOD) and any agencies or units thereof, as necessary to obtain
    protection as "commercial computer software" and related documentation in
    accordance with the terms of this Agreement and as specified in Subparts
    227.7202-1 and 227.7202-3 of the DOD FAR Supplement, 48 C.F.R.227.7202-1 and
    227.7202-3, and its successors. Manufacturer is Couchbase, Inc.

 1. **Support**. Couchbase Inc. will provide Licensee with: (a) periodic Software
    updates to correct known bugs and errors to the extent Couchbase Inc.
    incorporates such corrections into the free edition version of the Software; and
    (b) access to, and use of, the Couchbase Inc. support forum available at the
    following URL: http://forums.membase.org. Licensee must have Licensed Servers at
    the same level of Support Services for all instances in a production deployment
    running the Software. Licensee must also have Licensed Servers at the same level
    of Support Services for all instances in a development and test environment
    running the Software, although these Support Services may be at a different
    level than the production Licensed Servers. Couchbase Inc. may, at its
    discretion, modify, suspend or terminate support at any time upon notice to
    Licensee.

 1. **Records Retention and Audit**. Licensee shall maintain complete and accurate
    records to permit Couchbase Inc. to verify the number of Licensed Servers used
    by Licensee hereunder. Upon Couchbase Inc.'s written request, Licensee shall:
    (a) provide Couchbase Inc. with such records within ten (10) days; and (b) will
    furnish Couchbase Inc. with a certification signed by an officer of Licensee
    verifying that the Software is being used pursuant to the terms of this
    Agreement. Upon at least thirty (30) days prior written notice, Couchbase Inc.
    may audit Licensee's use of the Software to ensure that Licensee is in
    compliance with the terms of this Agreement. Any such audit will be conducted
    during regular business hours at Licensee's facilities and will not unreasonably
    interfere with Licensee's business activities. Licensee will provide Couchbase
    Inc. with access to the relevant Licensee records and facilities. If an audit
    reveals that Licensee has used the Software in excess of the authorized Licensed
    Servers, then (i) Couchbase Inc. will invoice Licensee, and Licensee will
    promptly pay Couchbase Inc., the applicable licensing fees for such excessive
    use of the Software, which fees will be based on Couchbase Inc.'s price list in
    effect at the time the audit is completed; and (ii) Licensee will pay Couchbase
    Inc.'s reasonable costs of conducting the audit.

 1. **Confidentiality**. Licensee and Couchbase Inc. will maintain the
    confidentiality of Confidential Information. The receiving party of any
    Confidential Information of the other party agrees not to use such Confidential
    Information for any purpose except as necessary to fulfill its obligations and
    exercise its rights under this Agreement. The receiving party shall protect the
    secrecy of and prevent disclosure and unauthorized use of the disclosing party's
    Confidential Information using the same degree of care that it takes to protect
    its own confidential information and in no event shall use less than reasonable
    care. The terms of this Confidentiality section shall survive termination of
    this Agreement. Upon termination or expiration of this Agreement, the receiving
    party will, at the disclosing party's option, promptly return or destroy (and
    provide written certification of such destruction) the disclosing party's
    Confidential Information.

 1. **Disclaimer of Warranty**. THE SOFTWARE AND ANY SERVICES PROVIDED HEREUNDER ARE
    PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. COUCHBASE INC. DOES NOT WARRANT
    THAT THE SOFTWARE OR THE SERVICES PROVIDED HEREUNDER WILL MEET LICENSEE'S
    REQUIREMENTS, THAT THE SOFTWARE WILL OPERATE IN THE COMBINATIONS LICENSEE MAY
    SELECT FOR USE, THAT THE OPERATION OF THE SOFTWARE WILL BE ERROR-FREE OR
    UNINTERRUPTED OR THAT ALL SOFTWARE ERRORS WILL BE CORRECTED. COUCHBASE INC.
    HEREBY DISCLAIMS ALL WARRANTIES, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
    LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, NON-INFRINGEMENT, TITLE, AND ANY WARRANTIES ARISING OUT OF COURSE OF
    DEALING, USAGE OR TRADE.

 1. **Agreement Term and Termination**. The term of this Agreement shall begin on
    the Effective Date and will continue until terminated by the parties. Licensee
    may terminate this Agreement for any reason, or for no reason, by providing at
    least ten (10) days prior written notice to Couchbase Inc. Couchbase Inc. may
    terminate this Agreement if Licensee materially breaches its obligations
    hereunder and, where such breach is curable, such breach remains uncured for ten
    (10) days following written notice of the breach. Upon termination of this
    Agreement, Licensee will, at Couchbase Inc.'s option, promptly return or destroy
    (and provide written certification of such destruction) the applicable Software
    and all copies and portions thereof, in all forms and types of media. The
    following sections will survive termination or expiration of this Agreement:
    Sections 2, 3, 6, 7, 8, 9, 10 and 11.

 1. **Limitation of Liability**. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
    IN NO EVENT WILL COUCHBASE INC. OR ITS LICENSORS BE LIABLE TO LICENSEE OR TO ANY
    THIRD PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY
    DAMAGES OR FOR THE COST OF PROCURING SUBSTITUTE PRODUCTS OR SERVICES ARISING OUT
    OF OR IN ANY WAY RELATING TO OR IN CONNECTION WITH THIS AGREEMENT OR THE USE OF
    OR INABILITY TO USE THE SOFTWARE OR DOCUMENTATION OR THE SERVICES PROVIDED BY
    COUCHBASE INC. HEREUNDER INCLUDING, WITHOUT LIMITATION, DAMAGES OR OTHER LOSSES
    FOR LOSS OF USE, LOSS OF BUSINESS, LOSS OF GOODWILL, WORK STOPPAGE, LOST
    PROFITS, LOSS OF DATA, COMPUTER FAILURE OR ANY AND ALL OTHER COMMERCIAL DAMAGES
    OR LOSSES EVEN IF ADVISED OF THE POSSIBILITY THEREOF AND REGARDLESS OF THE LEGAL
    OR EQUITABLE THEORY (CONTRACT, TORT OR OTHERWISE) UPON WHICH THE CLAIM IS BASED.
    IN NO EVENT WILL COUCHBASE INC.'S OR ITS LICENSORS' AGGREGATE LIABILITY TO
    LICENSEE, FROM ALL CAUSES OF ACTION AND UNDER ALL THEORIES OF LIABILITY, EXCEED
    ONE THOUSAND DOLLARS (US $1,000). The parties expressly acknowledge and agree
    that Couchbase Inc. has set its prices and entered into this Agreement in
    reliance upon the limitations of liability specified herein, which allocate the
    risk between Couchbase Inc. and Licensee and form a basis of the bargain between
    the parties.

 1. **General**. Couchbase Inc. shall not be liable for any delay or failure in
    performance due to causes beyond its reasonable control. Neither party will,
    without the other party's prior written consent, make any news release, public
    announcement, denial or confirmation of this Agreement, its value, or its terms
    and conditions, or in any manner advertise or publish the fact of this
    Agreement. Notwithstanding the above, Couchbase Inc. may use Licensee's name and
    logo, consistent with Licensee's trademark policies, on customer lists so long
    as such use in no way promotes either endorsement or approval of Couchbase Inc.
    or any Couchbase Inc. products or services. Licensee may not assign this
    Agreement, in whole or in part, by operation of law or otherwise, without
    Couchbase Inc.'s prior written consent. Any attempt to assign this Agreement,
    without such consent, will be null and of no effect. Subject to the foregoing,
    this Agreement will bind and inure to the benefit of each party's successors and
    permitted assigns. If for any reason a court of competent jurisdiction finds any
    provision of this Agreement invalid or unenforceable, that provision of the
    Agreement will be enforced to the maximum extent permissible and the other
    provisions of this Agreement will remain in full force and effect. The failure
    by either party to enforce any provision of this Agreement will not constitute a
    waiver of future enforcement of that or any other provision. All waivers must be
    in writing and signed by both parties. All notices permitted or required under
    this Agreement shall be in writing and shall be delivered in person, by
    confirmed facsimile, overnight courier service or mailed by first class,
    registered or certified mail, postage prepaid, to the address of the party
    specified above or such other address as either party may specify in writing.
    Such notice shall be deemed to have been given upon receipt. This Agreement
    shall be governed by the laws of the State of California, U.S.A., excluding its
    conflicts of law rules. The parties expressly agree that the UN Convention for
    the International Sale of Goods (CISG) will not apply. Any legal action or
    proceeding arising under this Agreement will be brought exclusively in the
    federal or state courts located in the Northern District of California and the
    parties hereby irrevocably consent to the personal jurisdiction and venue
    therein. Any amendment or modification to the Agreement must be in writing
    signed by both parties. This Agreement constitutes the entire agreement and
    supersedes all prior or contemporaneous oral or written agreements regarding the
    subject matter hereof. To the extent there is a conflict between this Agreement
    and the terms of any "shrinkwrap" or "clickwrap" license included in any
    package, media, or electronic version of Couchbase Inc.-furnished software, the
    terms and conditions of this Agreement will control. Each of the parties has
    caused this Agreement to be executed by its duly authorized representatives as
    of the Effective Date. Except as expressly set forth in this Agreement, the
    exercise by either party of any of its remedies under this Agreement will be
    without prejudice to its other remedies under this Agreement or otherwise. The
    parties to this Agreement are independent contractors and this Agreement will
    not establish any relationship of partnership, joint venture, employment,
    franchise, or agency between the parties. Neither party will have the power to
    bind the other or incur obligations on the other's behalf without the other's
    prior written consent.

 1. **Definitions**. Capitalized terms used herein shall have the following
    definitions: "Confidential Information" means any proprietary information
    received by the other party during, or prior to entering into, this Agreement
    that a party should know is confidential or proprietary based on the
    circumstances surrounding the disclosure including, without limitation, the
    Software and any non-public technical and business information. Confidential
    Information does not include information that (a) is or becomes generally known
    to the public through no fault of or breach of this Agreement by the receiving
    party; (b) is rightfully known by the receiving party at the time of disclosure
    without an obligation of confidentiality; (c) is independently developed by the
    receiving party without use of the disclosing party's Confidential Information;
    or (d) the receiving party rightfully obtains from a third party without
    restriction on use or disclosure. "Documentation" means any technical user
    guides or manuals provided by Couchbase Inc. related to the Software. "Licensed
    Server" means an instance of the Software running on one (1) operating system.
    Each operating system instance may be running directly on physical hardware, in
    a virtual machine, or on a cloud server. "Couchbase" means Couchbase, Inc.
    "Couchbase Website" means www.couchbase.com. "Software" means the object code
    version of the applicable elastic data management server software provided by
    Couchbase Inc. and ordered by Licensee during the ordering process on the
    Couchbase Website.

If you have any questions regarding this Agreement, please contact
sales@couchbase.com.