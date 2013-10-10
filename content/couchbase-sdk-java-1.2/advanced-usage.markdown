# Advanced Usage

This Couchbase SDK Java provides a complete interface to Couchbase Server
through the Java programming language. For more on Couchbase Server and Java
read our [Java SDK Getting Started
Guide](http://www.couchbase.com/develop/java/current) followed by our in-depth
Couchbase and Java tutorial. We recommended Java SE 6 (or higher) for running
the Couchbase Client Library.

This section covers the following topics:

 * Logging from the Java SDK

 * Handling Timeouts

 * Bulk Load and Exponential Backoff

 * Retrying After Receiving a Temporary Failure

<a id="java-api-configuring-logging"></a>

## Configuring Logging

Occasionally when you are troubleshooting an issue with a clustered deployment,
you may find it helpful to use additional information from the Couchbase Java
SDK logging. The SDK uses JDK logging and this can be configured by specifying a
runtime define and adding some additional logging properties. There are two ways
to set up Java SDK logging:

 * Use spymemcached to log from the Java SDK. Since the SDK uses spymemcached and
   is compatible with spymemcached, you can use the logging provided to output
   SDK-level information.

 * Set your JDK properties to log Couchbase Java SDK information.

 * Provide logging from your application.

To provide logging via spymemcached:


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
```

or


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");
```

The default logger simply logs everything to the standard error stream. To
provide logging via the JDK, if you are running a command-line Java program, you
can run the program with logging by setting a property:


```
-Djava.util.logging.config.file=logging.properties
```

The other alternative is create a `logging.properties` and add it to your in
your classpath:


```
logging.properties
handlers = java.util.logging.ConsoleHandler
java.util.logging.ConsoleHandler.level = ALL
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
com.couchbase.client.vbucket.level = FINEST
com.couchbase.client.vbucket.config.level = FINEST
com.couchbase.client.level = FINEST
```

The final option is to provide logging from your actual Java application. If you
are writing your application in an IDE which manages command-line operations for
you, it may be easier if you express logging in your application code. Here is
an example:


```
// Tell things using spymemcached logging to use internal SunLogger API
        Properties systemProperties = System.getProperties();
        systemProperties.put("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
        System.setProperties(systemProperties);

        Logger.getLogger("net.spy.memcached").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client").setLevel(Level.FINEST);
        Logger.getLogger("com.couchbase.client.vbucket").setLevel(Level.FINEST);

        //get the top Logger
        Logger topLogger = java.util.logging.Logger.getLogger("");

        // Handler for console (reuse it if it already exists)
        Handler consoleHandler = null;
        //see if there is already a console handler
        for (Handler handler : topLogger.getHandlers()) {
            if (handler instanceof ConsoleHandler) {
                //found the console handler
                consoleHandler = handler;
                break;
            }
        }

        if (consoleHandler == null) {
            //there was no console handler found, create a new one
            consoleHandler = new ConsoleHandler();
            topLogger.addHandler(consoleHandler);
        }

        //set the console handler to fine:
        consoleHandler.setLevel(java.util.logging.Level.FINEST);
```

<a id="java-sdk-handling-timeouts"></a>

## Handling Timeouts

The Java client library has a set of synchronous and asynchronous methods. While
it does not happen in most situations, occasionally network IO can become
congested, nodes can fail, or memory pressure can lead to situations where an
operation can timeout.

When a timeout occurs, most of the synchronous methods on the client will return
a RuntimeException showing a timeout as the root cause. Since the asynchronous
operations give more specific control over how long it takes for an operation to
be successful or unsuccessful, asynchronous operations throw a checked
TimeoutException.

As an application developer, it is best to think about what you would do after
this timeout. This may be something such as showing the user a message, it may
be doing nothing, or it may be going to some other system for additional data.

In some cases you might want to retry the operation, but you should consider
this carefully before performing the retry in your code; sometimes a retry may
exacerbate the underlying problem that caused the timeout. If you choose to do a
retry, providing in the form of a backoff or exponential backoff is advisable.
This can be thought of as a pressure relief valve for intermittent resource
problems. For more information on backoff and exponential backoff, see [Bulk
Load and Exponential Backoff](#java-sdk-bulk-load-and-backoff).

<a id="java-sdk-timingout-and-blocking"></a>

## Timing-out and Blocking

If your application creates a large number of asynchronous operations, you may
also encounter timeouts immediately in response to the requests. When you
perform an asynchronous operation, Couchbase Java SDK creates an object and puts
the object into a request queue. The object and the request are stored in Java
runtime memory, in other words, they are stored in local to your Java
application runtime memory and require some amount of Java Virtual Machine IO to
be serviced.

Rather than write so many asynchronous operations that can overwhelm a JVM and
generate out of memory errors for the JVM, you can rely on SDK-level timeouts.
The default behavior of the Java SDK is to start to immediately timeout
asynchronous operations if the queue of operations to be sent to the server is
overwhelmed.

You can also choose to control the volume of asynchronous requests that are
issued by your application by setting a timeout for blocking. You might want to
do this for a bulk load of data so that you do not overwhelm your JVM. The
following is an example:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-bulk-load-and-backoff"></a>

## Bulk Load and Exponential Backoff

When you bulk load data to Couchbase Server, you can accidentally overwhelm
available memory in the Couchbase cluster before it can store data on disk. If
this happens, Couchbase Server will immediately send a response indicating the
operation cannot be handled at the moment but can be handled later.

This is sometimes referred to as "handling Temp OOM", where where OOM means out
of memory. Note though that the actual temporary failure could be sent back for
reasons other than OOM. However, temporary OOM is the most common underlying
cause for this error.

To handle this problem, you could perform an exponential backoff as part of your
bulk load. The backoff essentially reduces the number of requests sent to
Couchbase Server as it receives OOM errors:


```
package com.couchbase.sample.dataloader;

import com.couchbase.client.CouchbaseClient;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import net.spy.memcached.internal.OperationFuture;
import net.spy.memcached.ops.OperationStatus;

/**
 *
   * The StoreHandler exists mainly to abstract the need to store things
   * to the Couchbase Cluster even in environments where we may receive
   * temporary failures.
 *
 * @author ingenthr
 */
public class StoreHandler {

  CouchbaseClient cbc;
  private final List<URI> baselist;
  private final String bucketname;
  private final String password;

  /**
   *
   * Create a new StoreHandler.  This will not be ready until it's initialized
   * with the init() call.
   *
   * @param baselist
   * @param bucketname
   * @param password
   */
  public StoreHandler(List<URI> baselist, String bucketname, String password) {
    this.baselist = baselist; // TODO: maybe copy this?
    this.bucketname = bucketname;
    this.password = password;


  }

  /**
   * Initialize this StoreHandler.
   *
   * This will build the connections for the StoreHandler and prepare it
   * for use.  Initialization is separated from creation to ensure we would
   * not throw exceptions from the constructor.
   *
   *
   * @return StoreHandler
   * @throws IOException
   */
  public StoreHandler init() throws IOException {
    // I prefer to avoid exceptions from constructors, a legacy we're kind
    // of stuck with, so wrapped here
    cbc = new CouchbaseClient(baselist, bucketname, password);
    return this;
  }

  /**
   *
   * Perform a regular, asynchronous set.
   *
   * @param key
   * @param exp
   * @param value
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> set(String key, int exp, Object value) {
    return cbc.set(key, exp, cbc);
  }

  /**
   * Continuously try a set with exponential backoff until number of tries or
   * successful.  The exponential backoff will wait a maximum of 1 second, or
   * whatever
   *
   * @param key
   * @param exp
   * @param value
   * @param tries number of tries before giving up
   * @return the OperationFuture<Boolean> that wraps this set operation
   */
  public OperationFuture<Boolean> contSet(String key, int exp, Object value,
          int tries) {
    OperationFuture<Boolean> result = null;
    OperationStatus status;
    int backoffexp = 0;

    try {
      do {
        if (backoffexp > tries) {
          throw new RuntimeException("Could not perform a set after "
                  + tries + " tries.");
        }
        result = cbc.set(key, exp, value);
        status = result.getStatus(); // blocking call, improve if needed
        if (status.isSuccess()) {
          break;
        }
        if (backoffexp > 0) {
          double backoffMillis = Math.pow(2, backoffexp);
          backoffMillis = Math.min(1000, backoffMillis); // 1 sec max
          Thread.sleep((int) backoffMillis);
          System.err.println("Backing off, tries so far: " + backoffexp);
        }
        backoffexp++;

        if (!status.isSuccess()) {
          System.err.println("Failed with status: " + status.getMessage());
        }

      } while (status.getMessage().equals("Temporary failure"));
    } catch (InterruptedException ex) {
      System.err.println("Interrupted while trying to set.  Exception:"
              + ex.getMessage());
    }

    if (result == null) {
      throw new RuntimeException("Could not carry out operation."); // rare
    }

    // note that other failure cases fall through.  status.isSuccess() can be
    // checked for success or failure or the message can be retrieved.
    return result;
  }
}
```

There is also a setting you can provide at the connection-level for Couchbase
Java SDK that will also help you avoid too many asynchronous requests:


```
List<URI> baselist = new ArrayList<URI>();
        baselist.add(new URI("http://localhost:8091/pools"));

        CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
        cfb.setOpTimeout(10000);  // wait up to 10 seconds for an operation to succeed
        cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

        CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));
```

<a id="java-sdk-retry"></a>

## Retrying After Receiving a Temporary Failure

If you send too many requests all at once to Couchbase, you can create a out of
memory problem, and the server will send back a temporary failure message. The
message indicates you can retry the operation, however the server will not slow
down significantly; it just does not handle the request. In contrast, other
database systems will become slower for all operations under load.

This gives your application a bit more control since the temporary failure
messages gives you the opportunity to provide a backoff mechanism and retry
operations in your application logic.

<a id="java-gc-tuning"></a>

## Java Virtual Machine Tuning Guidelines

Generally speaking, there is no reason to adjust any Java Virtual Machine
parameters when using the Couchbase Java Client. In fact, in general you should
not start with specific tuning, but instead should use defaults from the
application server first, then measure application metrics such as throughput
and response time. Then, if there is a need to make an improvement, make
adjustments and re-measure.

The recommendations here are based on the Oracle (formerly Sun) HotSpot Virtual
Machine and derivations such as the Java Virtual Machine shipped with Mac OS X
and the OpenJDK project. Other Java virtual machines likely behave similarly.

It should be noted that by default, garbage collection times may easily go over
1sec. This can lead to higher than expected response times or even timeouts, as
the default timeout is 2.5 seconds. This is true with simple tests even on
systems with lots of CPUs and a good amount of memory.

The reason for this is that for the most part, by default, the JVM is weighted
toward throughput instead of latency. Of course, much of this can be controlled
with GC tuning on the JVM. With the hotspot JVM, look to this whitepaper:
http://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf

In the referenced whitepaper, the Concurrent Mark Sweep collector is recommended
if your applciation needs short pauses. It also recommends advising the JVM to
try to shorten pause times. Given the Couchbase client's 2.5 second default
timeout, with our basic testing we found the following to be useful:


```
-XX:+UseConcMarkSweepGC -XX:MaxGCPauseMillis=850
```

The whitepaper refers to a couple of tools which may be useful in gathering
information on JVM GC performance. For example, adding -XX:+PrintGCDetails and
-XX:+PrintGCTimeStamps are a simple way to generate log messages which you may
correlate to application behavior. The logs may show a full GC event taking,
perhaps, several seconds during which no processing occurs and operations may
timeout. Adjusting parameters related to how to perform a full GC, which
collector to use, how long to pause the VM during GC and even adding incremental
mode may help, depending on your application's workload. One other common tool
for getting information is JConsole
(http://docs.oracle.com/javase/6/docs/technotes/guides/management/jconsole.html).
JConsole is more of an interactive tool, but it may help you identify changes
you may want to make in the different memory spaces used by the JVM to further
reduce the need to run a GC on the old generation.

There is a CPU time tradeoff when setting these tuning parameters. There are
also other parameters which may provide additional help referenced in the
whitepaper.

If you happen to be using JDK 7 update 4 or later, the G1 collector may be an
even better option. Again, you should be guided by measuring performance from
the application level.

Even with these, our testing showed some GCs near a half a second. While the
Couchbase Client allows tuning of the timeout time to drop as low as you wish,
we do not recommend dropping it much below one second unless you are planning to
tune other parts of the system beyond the JVM.

For example, most people run applications on networks that do not offer any
guarantee around response time. If the network is oversubscribed or minor blips
occur on the network, there can be TCP retransmissions. While many TCP
implementations may ignore it, RFC 2988 specifies rounding up to 1sec when
calculating TCP retransmit timeouts.

Achieving either maximum throughput or minimum per-operation latency can be
enhanced with JVM tuning, supported by overall system tuning at the extremes.

<a id="couchbase-sdk-java-rn"></a>
