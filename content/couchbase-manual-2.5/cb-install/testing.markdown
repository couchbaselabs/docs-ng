<a id="couchbase-getting-started-testing"></a>

# Testing Couchbase Server

Testing the connection to the Couchbase Server can be performed in a number of
different ways. Connecting to the node using the web client to connect to the
admin console should provide basic confirmation that your node is available.
Using the `couchbase-cli` command to query your Couchbase Server node will
confirm that the node is available.

<div class="notebox">
<p>Note</p>
<p>The Couchbase Server web console uses the same port number as clients use when
communicated with the server. If you can connect to the Couchbase Server web
console, administration and database clients should be able to connect to the
core cluster port and perform operations. The Web Console will also warn if the
console loses connectivity to the node.
</p></div>

To verify your installation works for clients, you can use either the
`cbworkloadgen` command, or `telnet`. The `cbworkloadgen` command uses the
Python Client SDK to communicate with the cluster, checking both the cluster
administration port and data update ports. For more information, see [Testing
with cbworkloadgen](#couchbase-getting-started-testing-cbworkloadgen).

Using `telnet` only checks the Memcached compatibility ports and the memcached
text-only protocol. For more information, see [Testing with Telnet](#couchbase-getting-started-testing-telnet).

<a id="couchbase-getting-started-testing-cbworkloadgen"></a>

## Testing with cbworkloadgen

The `cbworkloadgen` is a basic tool that can be used to check the availability
and connectivity of a Couchbase Server cluster. The tool executes a number of
different operations to provide basic testing functionality for your server.

<div class="notebox">
<p>Note</p>
<p>`cbworkloadgen` provides basic testing functionality. It does not provide
performance or workload testing.
</p>
</div>

To test a Couchbase Server installation using `cbworkloadgen`, execute the
command supplying the IP address of the running node:


```
> cbworkloadgen -n localhost:8091
Thread 0 - average set time : 0.0257480939229 seconds , min : 0.00325512886047 seconds , max : 0.0705931186676 seconds , operation timeouts 0
```

The progress and activity of the tool can also be monitored within the web
console.

For a longer test you can increase the number of iterations:


```
> cbworkloadgen -n localhost:8091 --items=100000
```

<a id="couchbase-getting-started-testing-telnet"></a>

## Testing with telnet

You can test your Couchbase Server installation by using Telnet to connect to
the server and using the Memcached text protocol. This is the simplest method
for determining if Couchbase Server is running.

<div class="notebox">
<p>Note</p>
<p>You will not need to use the Telnet method for communicating with your server
within your application. Instead, use one of the Couchbase SDKs.
</p></div>

You will need to have `telnet` installed on your server to connect to Couchbase
Server using this method. Telnet is supplied as standard on most platforms, or
may be available as a separate package that should be easily installable via
your operating systems standard package manager.

Connect to the server:

<div class="notebox">
<p>Note</p>
<p>The following example connects to the legacy memcached protocol using moxi.
</p></div>



```
> telnet localhost1 11211
Trying 127.0.0.1...
Connected to localhost.localdomain (127.0.0.1).
Escape character is '^]'.
```

Make sure it's responding (stats is a great way to check basic health):


```
stats
STAT delete_misses 0
STAT ep_io_num_write 0
STAT rejected_conns 0
...
STAT time 1286678223
...
STAT curr_items_tot 0
...
STAT threads 4
STAT pid 23871
...
END
```

Put a key in:


```
set test_key 0 0 1
a
STORED
```

Retrieve the key:


```
get test_key
VALUE test_key 0 1
a
END
```

Disconnect:


```
quit
Connection closed by foreign host.
>
```

All of the Memcached protocols commands will work through Telnet.

