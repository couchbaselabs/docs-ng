# Tutorial

The tutorials in this document will lead you through various server
administration and then some more advanced interaction examples, both using the
Couchbase Python API.

<a id="prerequisites"></a>

## Prerequisites

This article assumes that you have a working Python installation and a running
Couchbase server. The Couchbase server can be local or remote but a local
example will be used in the tutorial. The Couchbase Python module must also be
installed, as described below. You will also need the python-nmap module for
giving access to the network monitoring tools you will use.

In order to follow along in this tutorial you need the following items to be
installed and functional:

 * Python 2.6 or higher

 * Python Couchbase SDK, or module

 * python-nmap module installed, from
   [http://xael.org/norman/python/python-nmap/](http://xael.org/norman/python/python-nmap/)

This section assumes that you have installed Couchbase Python SDK and you have
installed the Couchbase server on your development machine. We assume you have
at least one instance of Couchbase Server and one data bucket established. If
you need to set up these items in Couchbase Server, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="installation"></a>

## Installation

The same process for installing Python modules from source code is also followed
for installing the couchbase module. You download the package, unzip it, then
build and install it.

 1. Download
    [couchbase-python-client-0.6.tar.gz](http://files.couchbase.com/developer-previews/clients/couchbase-server-2.0.0-compatible/python/couchbase-python-client-0.6.tar.gz)

 1. Unzip the compressed file and move into the folder.

     ```
     shell> tar -xf couchbase-python-client-0.6.tar.gz
     shell> cd couchbase-python-client-0.6
     ```

 1. Build and install the module. Build first is recommended to check for any errors
    or problems, but doing install also builds for you. You will need
    root/administrator rights to complete the install step.

     ```
     shell> python setup.py build
     shell> python setup.py install
     ```

<a id="testing"></a>

## Testing the Installation

The above steps install your new module, named couchbase, into your default
Python installation. With the couchbase module installed, Python should now be
able to access the module. This can be tested by launching Python and trying a
simple import command. The command will return quietly to the Python >>> prompt
if it loads properly.


```
shell> python
Python 2.6.7 (r267:88850, Jul 18 2011, 14:32:54)
[GCC 4.2.1 (Apple Inc. build) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import couchbase
>>>
```

If successful this means that all the files for the module have been properly
installed and are accessible to your Python instance. Otherwise it will get
confused and complain that your new module cannot be found.

<a id="api-overview"></a>

## API Overview

Before launching into how to build our sample application it is a good idea to
look at what the Python Couchbase module offers. For this tutorial, only a small
portion of the module will be used. This is to keep it simple, but in the
future, more advanced tutorials will show you how to take advantage of more of
these features.

The couchbase API instance is mainly accessed through an object called
VBucketAwareCouchbaseClient. All the main methods shown in this tutorial are
called through that client. Using this object, you create a connection to the
server and use the `get`, `set` and similar functions to interact with the
server as shown in the related [Getting Started
guide](http://www.couchbase.com/docs/couchbase-sdk-python-getting-started/).

<a id="couchbase-client"></a>

## VBucketAwareCouchbaseClient

The main object is accessed by importing from its parent objects as follows:


```
from couchbase.couchbaseclient import VBucketAwareCouchbaseClient
```

This makes the VBucketAwareCouchbaseClient available for client connections with
a variety of settings. The basic syntax can be described as shown in this
example:


```
v = VBucketAwareCouchbaseClient(url, bucket, password, verbose=False)
...
v = VBucketAwareCouchbaseClient("http://localhost:8091/pools/default","default","",False)
```

For any buckets other than the "default" you will need to also include a
password, which is left blank "" in the above example. The "verbose" option will
print out more information about your connection when your script runs.

<a id="example-app"></a>

## Example Application: Network Monitoring

Couchbase lends itself well to real-time monitoring and logging applications.
With its simple setting and retrieval mechanisms, putting data in and getting
data out are extremely simplified. In this example application, as you will see,
there is more code to run the monitoring side of things than there is for the
database interaction.

A simplified approach to network monitoring can be taken by simply scanning
whether a host is responsive and by checking the availability of open network
ports on the system. In this example application we use a Python library that
gives simplified access to the nmap port scanning toolset. Data retrieve from
the nmap module is that stored in the database for later use.

<a id="planning"></a>

## Planning

Before launching into the application itself, let's plan ahead for how we will
store and retrieve the data in the database. There are two levels of information
that we are going to collect and store.

First, in this application we will check the general status of the given host.
So the hostname or IP address will be our main document ID or key. Then the host
is check for its availability or status - is it responsive at all or not? Then
the timestamp for the last time it was checked is also collected. The status,
timestamp and hostname are the high level of data stored.

Second, a detailed list of ports is scanned and the responses of what protocols
are available and what ports are open is returned. This detailed information is
stored using a key combining host, protocol, port, and timestamp.

With the above planned approach, it is possible to quickly grab the current
status for a host. It is also possible to retrieve the detailed information
about a particular port at a specific point in time. More advanced features
using views and design documents will be considered elsewhere, but by using this
plan, querying for view-level data will be much easier and provide a quick way
to roll-up stats across a network.

<a id="setup"></a>

## Setting Up Network Scanner

First we'll get the network scanning portion of the Python script up and
running. The following code does a basic scan for a specific set of ports on a
given host and prints some of the results.


```
import nmap

def scan(host='127.0.0.1',range='22-80'):
  nm = nmap.PortScanner()
  nm.scan(host, range)
  return nm

nm = scan()

print "Hosts scanned: " + str(nm.all_hosts())
for host in nm.all_hosts():
  print "Host state: " + str(host) + ": " + nm[host].state()
  print "Protocols checked: " + str(nm[host].all_protocols())
  for proto in nm[host].all_protocols():
    print "Ports checked: " + str(nm[host][proto].keys())
    for port in nm[host][proto].keys():
      print "Port status: " + str(port) + ": " + str(nm[host][proto][port])
```

As you can see there are three different loops. In the example only a single
host is checked and only tcp ports are considered and no services were found, as
shown in the output below.


```
shell> python nmap-tutorial-mini.py
Hosts scanned: [u'127.0.0.1']
Host state: 127.0.0.1: up
Protocols checked: []
```

After turning on the ssh service on the host, you can see the results of the
script change:


```
shell> python nmap-tutorial-mini.py
Hosts scanned: [u'127.0.0.1']
Host state: 127.0.0.1: up
Protocols checked: [u'tcp']
Ports checked: [22]
Port status: 22: {'state': u'open', 'reason': u'syn-ack', 'name': u'ssh'}
```

With the above information we have a variety of information tidbits to use in
our logging application. You can download the script from:
[nmap-tutorial-mini.py](http://www.couchbase.com/docs/couchbase-sdk-python-tutorial/nmap-tutorial-mini.py)

<a id="data-restructure"></a>

## Restructing the Data

Next we just need to restructure the data into a useful format, in this case
we'll put collect the strings together and then dump it as `json` format.

By using `json` it is ready for more advanced manipulations in the future.
Further atomization of the data is possible too, but sticking with our original
plan is a good example to begin with.

Remember the two levels of data we want to collect: host level and service/port
level, stored in the following as `host_state` and `port_state`.


```
import nmap, json, time

def scan(host='127.0.0.1',range='22-80'):
  '''Setup port scanner'''
  nm = nmap.PortScanner()
  nm.scan(host, range)
  return nm

nm = scan()

for host in nm.all_hosts():
  host_state = {}
  host_state["host"] = host
  host_state["state"] = nm[host].state()
  for proto in nm[host].all_protocols():
    for port in nm[host][proto].keys():
      port_state = nm[host][proto][port]
      port_state["host"] = host
      port_state["protocol"] = proto
      port_state["port"] = port
      timestamp = time.time()
      host_state["timestamp"] = str(timestamp)
      port_state["timestamp"] = str(timestamp)
      print json.dumps(host_state)
      print json.dumps(port_state)
      docid = str(host) + ":" + str(proto) + ":" + str(port) + ":" + str(port_state["timestamp"])
```

In addition to a few more lines of code, note specifically that you must now
import `json` and `time` modules. We also remove all the verbose print lines and
only print the resulting `json` string instead. The `docid` variable is also
created, which will be used for the Couchbase document key in the next step.

You can download the script from:
[nmap-tutorial-collect.py](http://www.couchbase.com/docs/couchbase-sdk-python-tutorial/nmap-tutorial-collect.py)

<a id="example-app-completion"></a>

## Bringing It All Together

Almost done! The above steps were the hard part, next comes the easy part,
putting the data into the database. We import the part of the couchbase module
we need, issue a couple `.set()` functions, then instead of printing the source
strings, we request the data from the database using a `.get()` call and print
it to confirm data was entered.

Note that you must issue the closing `cb.done()` call or your script will hang.
The Couchbase module uses multithreading and this helps it tie up any loose
ends. Should you forget to do this call you will likely have to kill the python
process in your task/activity manager (Windows/OSX) or by issuing the kill
command (Linux/OSX) for the Python process id (pid) as reported by the `ps -e`
command.


```
import nmap, json, time

from couchbase.couchbaseclient import VBucketAwareCouchbaseClient as CbClient
cb = CbClient("http://localhost:8091/pools/default","default","",False)

def scan(host='127.0.0.1',range='22-80'):
  '''Setup port scanner'''
  nm = nmap.PortScanner()
  nm.scan(host, range)
  return nm

nm = scan()

for host in nm.all_hosts():
  host_state = {}
  host_state["host"] = host
  host_state["state"] = nm[host].state()
  for proto in nm[host].all_protocols():
    for port in nm[host][proto].keys():
      port_state = nm[host][proto][port]
      port_state["host"] = host
      port_state["protocol"] = proto
      port_state["port"] = port
      timestamp = time.time()
      host_state["timestamp"] = str(timestamp)
      port_state["timestamp"] = str(timestamp)
      docid = str(host) + ":" + str(proto) + ":" + str(port) + ":" + str(port_state["timestamp"])
      cb.set(docid,0,0,json.dumps(port_state))
      cb.set(str(host),0,0,json.dumps(host_state))
      print cb.get(docid)
      print cb.get(str(host))

cb.done()
```

You can download the script, including more detailed comments, from:
[nmap-tutorial-complete.py](http://www.couchbase.com/docs/couchbase-sdk-python-tutorial/nmap-tutorial-complete.py)

<a id="conclusion"></a>

## Conclusion

The basic interaction with Couchbase is limited to a few simple functions. It is
most likely that the Couchbase portions of any script you write will be very
minimal. Consider other logging applications you've written and see how easy it
might be to port them over to running on Couchbase.

<a id="couchbase-sdk-python-summary"></a>
