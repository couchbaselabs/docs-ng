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
---------|-----------------------------------------------------------------------------------
Linux    | `/opt/couchbase/var/lib/couchbase/logs`                                           
Windows  | `C:\Program Files\Couchbase\Server\log`  **Unhandled:** `[:unknown-tag :footnote]`
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

    * 1 — Server-side Moxi port for standard memcached client access

    * 0 — native `couchbase` data port

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

To remove, choose **Unhandled:** `[:unknown-tag :guimenu]` > **Unhandled:**
`[:unknown-tag :guimenuitem]` > **Unhandled:** `[:unknown-tag :guimenuitem]`,
choose **Unhandled:** `[:unknown-tag :guimenuitem]`, and remove the Couchbase
Server software.

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

The Game Simulation sample bucket is designed to showcase a typical gaming
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
   update_seq:00
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
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
      },
      "updater_running" : false,
      "partition_seqs" : {
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
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
         "8" :00,
         "4" :00,
         "12" :00,
         "5" :00
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
      "1" :00,
      "3" :00,
      "0" :00,
      "2" :00
   },
   "updater_running" : false,
   "partition_seqs" : {
      "1" :00,
      "3" :00,
      "0" :00,
      "2" :00
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
        "max_kv_node_size":,
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
                "0002" :00,
                "0001" :00,
                "0006" :00,
                "0005" :00,
                "0004" :00,
                "0000" :00,
                "0007" :00,
                "0003" :00
             },
             "indexable_seqs" : {
                "0002" :00,
                "0001" :00,
                "0006" :00,
                "0005" :00,
                "0004" :00,
                "0000" :00,
                "0007" :00,
                "0003" :00
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
                "0008" :00,
                "0009" :00,
                "0011" :00,
                "0012" :00,
                "0015" :00,
                "0013" :00,
                "0014" :00,
                "0010" :00
             },
             "indexable_seqs" : {
                "0008" :00,
                "0009" :00,
                "0011" :00,
                "0012" :00,
                "0015" :00,
                "0013" :00,
                "0014" :00,
                "0010" :00
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

<a id="couchbase-server-rn_2-1-0a"></a>

## Release Notes for Couchbase Server 2.1.0 GA (June 2013)

Couchbase Server 2.1.0 is the first minor release for Couchbase Server 2.0 and
includes several optimizations, new features and important bug fixes.

The **major enhancements** available in Couchbase Server 2.1.0 include:

 * Improved disk read and write performance with new multi-threaded persistence
   engine. With the newly designed persistence engine, users can configure the
   multiple read-write workers on a per Bucket basis. See [Disk
   Storage](couchbase-manual-ready.html#couchbase-introduction-architecture-diskstorage).

 * Optimistic Replication mode for XDCR to optimistically replicate mutations to
   the target cluster. More information can be found here: ['Optimistic
   Replication' in XDCR](couchbase-manual-ready.html#xdcr-optimistic-replication)

 * More XDCR Statistics to monitor performance and behavior of XDCR. See
   [Monitoring Outgoing
   XDCR](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-xdcr).

 * Support for hostnames when setting up Couchbase Server. See [Using Hostnames
   with Couchbase
   Server](couchbase-manual-ready.html#couchbase-getting-started-hostnames).

 * Rebalance progress indicator to provide more visibility into rebalance
   operation. See [Monitoring a
   Rebalance](couchbase-manual-ready.html#couchbase-admin-tasks-addremove-rebalance-monitoring).

 * Ability to generate a health report with `cbhealthchecker`, now included as part
   of the Couchbase Server install. See [cbhealthchecker
   Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbhealthchecker).

 * Importing and exporting of CSV files with Couchbase using `cbtransfer`. See
   [cbtransfer
   Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbtransfer).

 * Server-side replica-read API. [Couchbase Developer Guide, Replica
   Read](http://www.couchbase.com/docs/couchbase-devguide-2.1.0/cb-protocol-replica-read.html).

**Additional behavior changes in 2.1.0 include:**

 * Backup, Restore and Transfer tool to optionally transfer data or design
   documents only. The default is to transfer both data and design documents. See
   [cbbackup Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbbackup),
   [cbrestore Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbrestore),
   [cbtransfer
   Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbtransfer)

 * Improved cluster manager stability via separate process for cluster manager. See
   [Underlying Server
   Processes](couchbase-manual-ready.html#couchbase-underlying-processes).

 * Command Line tools updated so you can manage nodes, buckets, clusters and XDCR.
   See [couchbase-cli
   Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-couchbase-cli)

 * More XDCR Statistics to monitor performance and behavior of XDCR. See
   [Monitoring Outgoing
   XDCR](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-xdcr).

 * Command Line tools updated so you can manage nodes, buckets, clusters and XDCR.
   See [couchbase-cli
   Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-couchbase-cli).

 * Several new and updated statistics for XDCR on the admin Console and via the
   REST-API. For more information, see [Monitoring Incoming
   XDCR](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-xdcr-recv),
   [Monitoring Outgoing
   XDCR](couchbase-manual-ready.html#couchbase-admin-web-console-data-buckets-xdcr),
   and [Getting XDCR Stats via
   REST](couchbase-manual-ready.html#couchbase-admin-restapi-xdcr-stats).

**Fixes in 2.1.0**

 * **Installation and Upgrade**

    * In the past Couchbase Server 2.0.0 upgrade installers on Linux did not replace
      the `file2.beam` with the latest version. This will cause indexing and querying
      to fail. This has been fixed.

      *Issues* : [MB-7770](http://www.couchbase.com/issues/browse/MB-7770)

    * The Windows installer for Windows 32-bit and 64-bit now prompts you to set the
      MaxUserPort registry setting. This will increase the number of ephemeral ports
      available to applications on Windows, as documented in [Microsoft Knowledge Base
      Article 196271](http://support.microsoft.com/kb/196271). The installer also
      warns you that a reboot is necessary for this change to take effect. If this
      registry key is not set, it may lead to port exhaustion leading to various
      problems, see as MB-8321. For installer instructions, see [Microsoft Windows
      Installation](couchbase-manual-ready.html#couchbase-getting-started-install-win).

      *Issues* : [MB-8321](http://www.couchbase.com/issues/browse/MB-8321)

 * **Cluster Operations**

    * Previously, there was only one process that was responsible for monitoring and
      managing all the other underlying server processes. This includes Moxi and
      memcached, and also statistics gathering.  Now there are two processes. One is
      responsible for just Moxi/Memcached and the other is responsible for monitoring
      all other processes. This should help prevent the max\_restart\_intensity seen
      when timeouts start and temporarily disrupted the server. The most noticeable
      change you see with this fix is that there are now two beam.smp processes
      running on Linux and two erl.exe running on Windows. For more details, see
      [Underlying Server
      Processes](couchbase-manual-ready.html#couchbase-underlying-processes).

      *Issues* : [MB-8376](http://www.couchbase.com/issues/browse/MB-8376)

 * **Command-line Tools**

    * For earlier versions of Couchbase Server, some internal server directories were
      accessible all users, which was a security issue. This is now fixed. The fix now
      means that you should have root privileges when you run `cbcollect_info` because
      this tool needs this access level to collect all the information it needs to
      collect about the server. For more information about `cbcollect_info`, see
      [cbcollect_info
      Tool](couchbase-manual-ready.html#couchbase-admin-cmdline-cbcollect_info).

    * One XDCR REST API endpoint had a typo which is now fixed. The old endpoint was
      `/controller/cancelXCDR/:xid`. The new, correct endpoint is
      `/controller/cancelXDCR/:xid`. See [Deleting XDCR
      Replications](couchbase-manual-ready.html#couchbase-admin-restapi-xdcr-delete-repl).

      *Issues* : [MB-8347](http://www.couchbase.com/issues/browse/MB-8347)

    * In the past when you used `cbworkloadgen` you see this error `ImportError: No
      module named _sqlite3`. This has been fixed.

      *Issues* : [MB-8153](http://www.couchbase.com/issues/browse/MB-8153)

 * **Cross Datacenter Replication (XDCR)**

    * When you create a replication between two clusters, you may see two error
      messages: "Failed to grab remote bucket info, vbucket" and "Error replicating
      vbucket X". Nonetheless, replication will still start and then function as
      expected, but the error messages may appear for some time in the Web Console.
      This has been fixed.

      *Issues* : [MB-7786](http://www.couchbase.com/issues/browse/MB-7786),
      [MB-7457](http://www.couchbase.com/issues/browse/MB-7457)

**Known Issues in 2.1.0**

 * **Installation and Upgrade**

    * On Ubuntu if you upgrade from Couchbase Server 2.0 to 2.1.0 and use a
      non-default port, the upgrade can fail and return the message 'Failed to stop
      couchbase-server.' We recommend you use the default ports on both 2.0 and 2.1.0
      when you perform an upgrade.

      *Issues* : [MB-8051](http://www.couchbase.com/issues/browse/MB-8051)

    * You may have a installation of Couchbase Server with a custom data path. If you
      perform a server uninstall and then upgrade to 2.1.0 with the same custom data
      path, some older XDCR replication files may be left intact. This will result in
      server crashes and incorrect information in Web Console. The workaround for this
      case is to make sure you manually delete the `_replicator.couch.1` file from the
      server data directory before you install the new version of the server.
      Alternately you can delete the entire data directory before you install the new
      version of the server. If you choose this workaround, you may want to backup
      your data before you delete the entire directory. By default, on Linux this
      directory is at `/opt/couchbase/var/lib/couchbase/data/` and on Windows at
      `C:/Program Files/Couchbase/Server/var/lib/couchbase/data/`.

      *Issues* : [MB-8460](http://www.couchbase.com/issues/browse/MB-8460)

 * **Database Operations**

    * On Windows platforms, statistics from the server will incorrectly show a very
      high swap usage rate. This will be resolved in future releases of Couchbase
      Server.

      *Issues* : [MB-8461](http://www.couchbase.com/issues/browse/MB-8461)

    * Any non-UTF-8 characters are not filtered or logged by Couchbase Server. Future
      releases will address this issue.

      *Issues* : [MB-8427](http://www.couchbase.com/issues/browse/MB-8427)

    * If you edit a data bucket using the REST-API and you do not provide existing
      values for bucket properties, the server may reset existing bucket properties to
      the default value. To avoid this situation you should specify all existing
      bucket properties as well as the updated properties as parameters when you make
      this REST request. For more information, see [Couchbase Manual, Creating and
      Editing Data
      Buckets](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-admin-restapi-creating-buckets.html).

      *Issues* : [MB-7897](http://www.couchbase.com/issues/browse/MB-7897)

 * **Cluster Operations**

    * If you query a view during cluster rebalance it will fail and return the
      messages "error Reason: A view spec can not consist of merges exclusively" and
      then "no\_active\_vbuckets Reason: Cannot execute view query since the node has
      no active vbuckets." The workaround for this situation is to handle this error
      and retry later in your code. Alternatively the latest version of the Java SDK
      will automatically retry upon these errors.

      *Issues* : [MB-7661](http://www.couchbase.com/issues/browse/MB-7661)

    * If you perform asynchronous operations from a client to Couchbase on Windows,
      you may receive unclear status messages due to character encoding issues on
      Windows. This impacts status messages in the response only; actual response data
      is unaffected by this problem. This will be resolved in future releases of
      Couchbase Server.

      *Issues* : [MB-8149](http://www.couchbase.com/issues/browse/MB-8149)

    * By default most Linux systems have swappiness set to 60. This will lead to
      overuse of disk swap with Couchbase Server. Please follow our current
      recommendations on swappiness and swap space, see [Swap
      Space](couchbase-manual-ready.html#couchbase-bestpractice-cloud-swap).

      *Issues* : [MB-7737](http://www.couchbase.com/issues/browse/MB-7737),
      [MB-7774](http://www.couchbase.com/issues/browse/MB-7774)

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

    * Stats call via Moxi are currently enabled, however if you use the command-line
      tool `cbstats` through Moxi on port 11211 to Couchbase Server, you will receive
      incorrect server statistics. To avoid this issue you should use port 11210 when
      you make a `cbstats` request.

      *Issues* : [MB-7678](http://www.couchbase.com/issues/browse/MB-7678)

    * If you perform a scripted rolling upgrade from 1.8.1 to 2.1.0 nodes, you should
      script a delay of 10 seconds after you add a node and before you request
      rebalance. Without this delay, you may request rebalance too soon and rebalance
      may fail and produce an error.

      *Issues* : [MB-8094](http://www.couchbase.com/issues/browse/MB-8094)

 * **Command-line Tools**

    * `cbbackup` will backup even deleted items from a cluster which are not needed.
      In future releases it will ignore these items and not back them up.

      *Issues* : [MB-8377](http://www.couchbase.com/issues/browse/MB-8377)

    * `cbstats` will not work on port 11210 if you installed Couchbase Server without
      root-level permissions.

      *Issues* : [MB-7878](http://www.couchbase.com/issues/browse/MB-7878)

 * **Indexing and Querying**

    * If you rebalance a cluster, index compaction starts but bucket compaction will
      not start. This is because vBucket cleanup from an index is not accounted for in
      index fragmentation. After this cleanup process completes it will cause more
      index fragmentation and therefore we run compaction again. Index compaction will
      therefore always run after a certain number of changes to vBuckets on nodes. You
      can change this setting using the REST-API, see [Adjusting Rebalance during
      Compaction](couchbase-manual-ready.html#couchbase-admin-restapi-rebalance-before-compaction).

      *Issues* : [MB-8319](http://www.couchbase.com/issues/browse/MB-8319)

 * **Performance**

    * RHEL6 and other newer Linux distributions running on physical hardware are known
      to have transparent hugepages feature enabled. In general this can provide a
      measurable performance boost. However under some conditions that Couchbase
      Server is known to trigger, this may cause severe delays in page allocations.
      Therefore we strongly recommend you disable this feature with Couchbase Server.

      *Issues* : [MB-8456](http://www.couchbase.com/issues/browse/MB-8456)

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