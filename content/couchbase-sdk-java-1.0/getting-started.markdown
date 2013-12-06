#Introduction

This guide provides information for developers who want to use the Couchbase Java SDK to build applications that use Couchbase Server.

# Getting Started

Now that you have installed Couchbase and have probably created a cluster of
Couchbase servers, it is time to install the client libraries,
`couchbase-client` and `spymemcached`, and start storing data into the clusters.

Here's a quick outline of what you'll learn in this chapter:

 1. Download the Java Couchbase Client Libraries, couchbase-client and spymemcached.

 2. Create an Eclipse or NetBeans project and set up the Couchbase Client Libraries
    as referenced libraries. You'll need to include these libraries at compile time,
    which should propagate to run time.

 3. Write a simple program to demonstrate connecting to Couchbase and saving some
    data.

 4. Explore some of the API methods that will take you further than the simple
    program.

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and one data
bucket established. If you need to set up these items, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

The TCP/IP port allocation on Windows by default includes a restricted number of
ports available for client communication. For more information on this issue,
including information on how to adjust the configuration and increase the
available ports, see <a href=http://msdn.microsoft.com/en-us/library/aa560610(v=bts.20).aspx> MSDN: Avoiding TCP/IP Port
Exhaustion</a>.

After you have your Couchbase Server set up and you have installed SDK, you can
compile and run the following basic program.

<a id="downloading"></a>

## Downloading the Couchbase Client Libraries

Download the Client libraries and its dependencies and make sure they are
available in the classpath. Please refer to [for installation of the client JAR
files and the dependencies and for running
them.](http://www.couchbase.com/develop/java/current) You can download them
directly from [the Java client libraries for
Couchbase](http://packages.couchbase.com/clients/java/1.0.1/Couchbase-Java-Client-1.0.1.zip).

These are Java Archive ( `.jar` ) files that you can use with your Java
environment.

<a id="hello-world"></a>

## Hello Couchbase

You might be curious what the simplest Java program to talk to Couchbase might
look like, and how you might compile and run it using just the Java command line
tools. Follow along if you like and look at Listing 1.

Listing 1: Main.java


```
import java.net.URI;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.couchbase.client.CouchbaseClient;
import net.spy.memcached.internal.GetFuture;
import net.spy.memcached.internal.OperationFuture;

public class Main {
  public static final int EXP_TIME = 10;
  public static final String KEY = "spoon";
  public static final String VALUE = "Hello World!";

  public static void main(String args[]) {
    // Set the URIs and get a client
    List<URI> uris = new LinkedList<URI>();

    Boolean do_delete = false;

    // Connect to localhost or to the appropriate URI
    uris.add(URI.create("http://127.0.0.1:8091/pools"));

    CouchbaseClient client = null;
    try {
      client = new CouchbaseClient(uris, "default", "");
    } catch (Exception e) {
      System.err.println("Error connecting to Couchbase: "
        + e.getMessage());
      System.exit(0);
    }
    // Do a synchrononous get
    Object getObject = client.get(KEY);
    // Do an asynchronous set
    OperationFuture<Boolean> setOp = client.set(KEY, EXP_TIME, VALUE);
    // Do an asynchronous get
    GetFuture getOp = client.asyncGet(KEY);
    // Do an asynchronous delete
    OperationFuture<Boolean> delOp = null;
    if (do_delete) {
      delOp = client.delete(KEY);
    }
    // Shutdown the client
    client.shutdown(3, TimeUnit.SECONDS);
    // Now we want to see what happened with our data
    // Check to see if our set succeeded
    try {
      if (setOp.get().booleanValue()) {
        System.out.println("Set Succeeded");
      } else {
        System.err.println("Set failed: "
            + setOp.getStatus().getMessage());
      }
    } catch (Exception e) {
      System.err.println("Exception while doing set: "
          + e.getMessage());
    }
    // Print the value from synchronous get
    if (getObject != null) {
      System.out.println("Synchronous Get Suceeded: "
          + (String) getObject);
    } else {
      System.err.println("Synchronous Get failed");
    }
    // Check to see if ayncGet succeeded
    try {
      if ((getObject = getOp.get()) != null) {
        System.out.println("Asynchronous Get Succeeded: "
            + getObject);
      } else {
        System.err.println("Asynchronous Get failed: "
            + getOp.getStatus().getMessage());
      }
    } catch (Exception e) {
      System.err.println("Exception while doing Aynchronous Get: "
          + e.getMessage());
    }
    // Check to see if our delete succeeded
    if (do_delete) {
      try {
        if (delOp.get().booleanValue()) {
          System.out.println("Delete Succeeded");
        } else {
          System.err.println("Delete failed: " +
              delOp.getStatus().getMessage());
        }
      } catch (Exception e) {
        System.err.println("Exception while doing delete: "
            + e.getMessage());
      }
    }
  }
}
```

 1. Enter the code in listing 1 into a file named Main.java

 1. Download the couchbase-client and spymemcached client libraries for Java. You
    will also need the dependent JAR files as well, as listed in the execution
    instructions below. One simple way to obtain the JAR and all dependencies is
    through the Maven repository.

 1. Type the following commands:

     ```
     shell> javac -cp couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar \
           Main.java
     shell> java -cp .:couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar:\
     jettison-1.1.jar:netty-3.2.0.Final.jar:commons-codec-1.5.jar Main
     ```

Of course, substitute your own Couchbase server IP address. If you are on Linux
or MacOS replace the semi-colon in the second command-line with a colon. The
program will produce the following output:


```
2012-01-16 15:06:29.265 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
2012-01-16 15:06:29.277 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@1d3c468a
2012-01-16 15:06:29.420 INFO com.couchbase.client.CouchbaseConnection:  Shut down Couchbase client
Synchronous Get failed
Set Succeeded
Asynchronous Get Succeeded: Hello World!
```

Much of this output is logging statements produced by the client library, to
inform you of what's going on inside the client library to help you diagnose
issues. It says that a connection to Couchbase was added and that the connection
state changed. Then the code shows that the key spoon did not exist in Couchbase
which is why the Synchronous Get failed.

Running the program again, within 10 seconds will produce the following output:


```
2012-01-16 15:37:12.242 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
2012-01-16 15:37:12.253 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@7f2ad19e
2012-01-16 15:37:12.439 INFO com.couchbase.client.CouchbaseConnection:  Shut down Couchbase client
Synchronous Get Succeeded: Hello World!
Set Succeeded
Asynchronous Get Succeeded: Hello World!
```

Again you see the log statements, followed by the indication that this time, the
key spoon was found in Couchbase with the value "Hello World!" as evidenced in
the Synchronous Get succeeding. Run the same piece of code after 10 seconds or
set the do\_delete flag to true and notice the changed behavior of the program.
It is possible to get the precise message from the server in the case of a
failure by calling the `getOp.getStatus().getMessage()` method on the Operation.

Congratulations, you've taken your first small step into a much larger world.

<a id="api-overview"></a>

## Couchbase API Overview

The Couchbase client library has many API methods that you can use to implement
your distributed memory magic. The client library methods below are grouped into
categories so that you'll have a quick reference you can refer to later.

`decr`    | Decrement a key and return the value.              
----------|----------------------------------------------------
`get`     | Gets a particular value from the cache.            
`getBulk` | Gets many values at the same time.                 
`gets`    | Gets a particular value with Check And Set support.
`incr`    | Increment the value of a key.                      

`cas` | Perform a Check And Set operation.
------|-----------------------------------

`add`          | Adds an object to the cache if it does not exist already.
---------------|----------------------------------------------------------
`delete`       | Deletes a value from the cache.                          
`flush`        | Clears the cache on all servers.                         
`append`       | Append to an existing value in the cache.                
`asyncCAS`     | Check and set values of particular keys.                 
`asyncDecr`    | Decrement a value.                                       
`asyncGet`     | Get a particular value.                                  
`asyncGetBulk` | Get many values at the same time.                        
`asyncGets`    | Get a value with CAS support.                            
`asyncIncr`    | Increment a value.                                       

`addObserver`           | Adds an observer to watch the connection status.     
------------------------|------------------------------------------------------
`getAvailableServers`   | Returns a list of available servers.                 
`getNodeLocator`        | Returns a read only instance of the node locator.    
`getStats`              | Returns connection statistics.                       
`getTranscoder`         | Returns the default transcoder instance.             
`getUnavailableServers` | Returns a list of the servers that are not available.
`getVersions`           | Returns the versions of all connected servers.       

<a id="further-example"></a>

## A More Substantial Program

Please download the [Sample
Code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.0.0.zip)
if you're interested in making a more substantial program that you can run. The
program will create a user specified number of threads, that each try to create
(or read from Couchbase) 100 random numbers. The code creates a CouchbaseClient
object instance for each thread, and then proceeds to perform a `gets()`
operation looking for specific keys. The `gets()` operation will return null if
the key has not been set. In this case the thread will create the value itself
and set it into Couchbase and it will incur a 100 millisecond penalty for doing
so. This simulates an expensive database operation. You can find the full source
code for the small application attached to the end of this article.

Let's discuss a few parts of the program, so you can understand the fundamentals
of connecting to Couchbase servers, testing for the existence of particular
key-value pairs, and setting a value to a key. These few operations will give
you more of an idea of how to begin.

Listing 2. Connecting to a set of Couchbase servers:


```
URI server = new URI(addresses);

    ArrayList<URI> serverList = new ArrayList<URI>();

    serverList.add(server);
    CouchbaseClient client = new CouchbaseClient(
        serverList, "default", "");
```

You can see, from these lines that you'll need to obtain an instance of a
`CouchbaseClient`. There are numerous ways to construct one, but a constructor
that is quite useful involved the `ArrayList` of URIs.


```
http://host-or-ip:port/pools
```

The port you will be connecting to will be the port 8091 which is effectively a
proxy that knows about all of the other servers in the cluster and will provide
quick protocol access. So in the case of this cluster, providing an addresses
string as follows, worked very well:


```
String addresses = "10.0.0.33:8091/pools"
```

Listing 3 is an abridged excerpt that shows the creation of an
IntegerTranscoder, which is a useful class for converting objects in Couchbase
back to integers when needed. This is for convenience and reduces type casting.
You can then see that a the gets() method is called. This returns a CASValue<T>
of type integer which is useful for checking and setting a value. If the value
is null it means that Couchbase hasn't been given a value for this key. The code
then sets a value. Otherwise, we can get its value and do something with it.

Listing 3. Check And Set operations


```
IntegerTranscoder intTranscoder = new IntegerTranscoder();

    CASValue<Integer> value = client.gets(key,
        intTranscoder);

    if (value == null) {
        // The value doesn't exist in Couchbase
        client.set(key, 15, rand.nextInt(), intTranscoder);

        // Simulate the value taking time to create.
        Thread.sleep(100);

        created++;

    } else {

        int v = value.getValue();

    }
```

Setting values in Couchbase are done asynchronously, and the application does
not have to wait for these to be completed. Sometimes, though, you may want to
ensure that Couchbase has been sent some values, and you can do this by calling
`client.waitForQueues()` and giving it a timeout for waiting for this to occur,
as shown in Listing 4.

Listing 4. Waiting for the data to be set into Couchbase.


```
client.waitForQueues(1, TimeUnit.MINUTES);
```

<a id="sample-application"></a>

## How to Build and Run the Sample Application

Download [the entire Java Getting Started Source
code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.0.0.zip)
and follow along with the steps.

You can compile and run the program using the following steps.


```
shell> javac -cp couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar \
    GettingStarted.java
shell> java -cp .:couchbase-client-1.0.0.jar:\
spymemcached-2.8.0.jar:jettison-1.1.jar:netty-3.2.0.Final.jar:\
commons-codec-1.5.jar GettingStarted http://192.168.3.104:8091/pools 10
```

Running this program generates the following output the first time:


```
Client-2 took 37.2500 ms per key. Created 35. Retrieved 65 from cache.
Client-3 took 37.7800 ms per key. Created 35. Retrieved 65 from cache.
Client-4 took 37.7100 ms per key. Created 35. Retrieved 65 from cache.
Client-0 took 37.8300 ms per key. Created 35. Retrieved 65 from cache.
Client-1 took 37.8400 ms per key. Created 35. Retrieved 65 from cache.
```

Running the program a second time before 15 seconds elapses, produces this
output instead:


```
Client-1 took 4.6700 ms per key. Created 0. Retrieved 100 from cache.
Client-3 took 4.6000 ms per key. Created 0. Retrieved 100 from cache.
Client-4 took 4.7500 ms per key. Created 0. Retrieved 100 from cache.
Client-2 took 4.7900 ms per key. Created 0. Retrieved 100 from cache.
Client-0 took 4.8400 ms per key. Created 0. Retrieved 100 from cache.
```

There are a few things that are interesting about the output. In the first
scenario, the five threads collaborate to produce the sequence of random numbers
such that the average time per key is significantly less than 100ms. Each thread
is creating 35 numbers, but reading 65 from the cache.

In the second run, because the 15 second timeout has not elapsed yet, all of the
random numbers were retrieved from the cache by all of the threads. Notice that
reading these values from Couchbase only takes a few milliseconds.

The complete source code for this is below. You would run this with the command
line arguments like below after ensuring that the client libraries are included
in the classpath.
```
shell> javac -cp couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar \
    GettingStarted.java
shell> java -cp .:couchbase-client-1.0.0.jar:\
spymemcached-2.8.0.jar:jettison-1.1.jar:netty-3.2.0.Final.jar:\
commons-codec-1.5.jar GettingStarted http://192.168.3.104:8091/pools 10
```




```
import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;

import java.net.URI;

import com.couchbase.client.CouchbaseClient;

import net.spy.memcached.CASValue;
import net.spy.memcached.transcoders.IntegerTranscoder;

/**
 * Sets up a number of threads each cooperating to generate a set of random
 * numbers and illustrates the time savings that can be achieved by using
 * Couchbase.
 */
public class GettingStarted {

    static final int numIntegers = 100;
    static String addresses;
    static CountDownLatch countdown;

    /**
     * @param args
     */
    public static void main(String[] args) {

        if (args.length < 2) {
            System.err.println("usage: addresses numthreads");
            System.exit(1);
        }

        addresses = args[0];

        int numThreads = Integer.parseInt(args[1]);

        countdown = new CountDownLatch(numThreads);

        for (int i = 0; i < numThreads; i++) {
            Thread t = new Thread(new ClientThread(String.format(
                    "Client-%d", i)));
            t.setName("Client Thread " + i);
            t.start();
        }

        try {
            countdown.await();
        } catch (InterruptedException e) {
        }

        System.exit(0);
    }

    private static class ClientThread implements Runnable {

        private String name;

        public ClientThread(String name) {
            this.name = name;
        }

        @Override
        public void run() {

            try {
                URI server = new URI(addresses);

                ArrayList<URI> serverList = new ArrayList<URI>();

                serverList.add(server);

                CouchbaseClient client = new CouchbaseClient(
                        serverList, "default", "");
                IntegerTranscoder intTranscoder = new IntegerTranscoder();

                // Not really random, all threads
                // will have the same seed and sequence of
                // numbers.
                Random rand = new Random(1);

                long startTime = System.currentTimeMillis();

                int created = 0;
                int cached = 0;

                for (int i = 0; i < numIntegers; i++) {
                    String key = String.format("Value-%d", i);

                    CASValue<Integer> value = client.gets(key,
                            intTranscoder);

                    if (value == null) {
                        // The value doesn't exist in Membase
                        client.set(key, 15, rand.nextInt(), intTranscoder);

                        // Simulate the value taking time to create.
                        Thread.sleep(100);

                        created++;

                    } else {

                        // The value does exist, another thread
                        // created it already so this thread doesn't
                        // have to.
                        int v = value.getValue();

                        // Check that the value is what we
                        // expect it to be.
                        if (v != rand.nextInt()) {
                            System.err.println("No match.");
                        }
                        cached++;
                    }

                    client.waitForQueues(1, TimeUnit.MINUTES);
                }

                System.err.println(String.format(
                        "%s took %.4f ms per key. Created %d."
                                + " Retrieved %d from cache.", name,
                        (System.currentTimeMillis() - startTime)
                                / (double)numIntegers, created, cached));

            } catch (Throwable ex) {
                ex.printStackTrace();
            }

            countdown.countDown();
        }
    }
}
```

<a id="conclusion"></a>

## Conclusion

You now know how to obtain the Couchbase Java client libraries, and write small
Java programs to connect with your Couchbase cluster and interact with it.
Congratulations, you will be able to save your servers from burning down, and
impress your users with the blazing fast response that your application will be
able to achieve.

<a id="tutorial"></a>
