# Tutorial

In order to follow this tutorial the following need to be installed and
functional.

 * Java SE 6 (or higher) installed

 * Couchbase server installed and running

 * Client libraries installed and available in the classpath. Please refer to [for
   installation of the client JAR files and the dependencies and for running
   them.](http://www.couchbase.com/develop/java/current)

<a id="installation"></a>

## Installation

 1. Download [the Java client libraries for
    Couchbase](http://packages.couchbase.com/clients/java/1.0.0/Couchbase-Java-Client-1.0.0.zip)

 1. Download [the entire Java Tutorial Source
    code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.0.0.zip)
    and follow along with the steps.

<a id="building-chat"></a>

## Building a Chat Room Application

You will be writing a distributed chat room application, where a nearly
unlimited number of people could potentially be talking at the same time. The
previous statements made by other users will be remembered in memory for a
certain period of time, after which they will be forgotten. When a user first
connects to the server they will be sent the entire transcript of messages that
have not timed out on the server, after which they will be able to participate
anonymously in the ongoing conversation. At any point in the conversation, they
may quit, by typing the word '/quit'. Implementing these requirements will
demonstrate a number of important API methods of the spymemcached driver talking
to a Couchbase server, which is providing the distributed storage capabilities.

Let's get started.

<a id="connecting"></a>

## Connecting with the Server

The driver library contains a number of different ways to connect to a Couchbase
server. First, I will begin with a discussion of these methods and then we will
use one of those methods to make the chat room client application connect with
your Couchbase installation.

There are more than one way of connecting with one or more Couchbase servers
from the driver:

 1. A direct connection can be made by creating an instance of the CouchbaseClient
    object and passing in one or more addresses. For example:

     ```
     URI server = new URI(addresses);
                     ArrayList<URI> serverList = new ArrayList<URI>();
                     serverList.add(server);
                     CouchbaseClient client = new CouchbaseClient(
                             serverList, "default", "");
     ```

    It's recommended to provide more than one server address of all the servers
    participating in the Couchbase cluster since the client can recover easily if
    the original server goes down.

 1. Use the connection factory `CouchbaseConnectionFactory` constructors to
    establish a connection with your server:

     ```
     URI base = new URI(String.format(
              "http://%s:8091/pools", serverAddress));
         ArrayList<URI> serverList = new ArrayList<URI>();
         serverList.add(base);
         CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(serverList,
            "default", "");
     ```

 1. Create a connection that is authenticated using SASL by using a
    `CouchbaseConnectionFactory`. Merely specifying the authenticated bucket will
    establish an authenticated connection. In the case of Couchbase, the username
    and password you use here are based on the buckets you have defined on the
    server. The username is the bucket name, and the password is the password used
    when creating the bucket. I will talk more about this later, in the meantime
    here is the code you will need to authenticate and start using a bucket with
    SASL authentication.

     ```
     CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs,
            "rags", "password");
         client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
     ```

Let's start making modifications to the tutorial `Main.java` class in order to
make our first connection. Here we will be making an unauthenticated ASCII
protocol connection to the server. After you have the tutorial code working, you
can easily go back and change the `connect()` method to use authentication.

First you modify your `main()` method as follows:


```
public static void main(String[] args) {

    if (args.length != 1) {
        System.err.println("usage: serveraddress");
        System.exit(1);
    }

    String serverAddress = args[0];

    System.out.println(String.format("Connecting to %s",serverAddress));

     try {

             connect(serverAddress);
             client.shutdown(1, TimeUnit.MINUTES);

    } catch (IOException ex) {
            ex.printStackTrace();
    }

}
```

Next, add the `connect()` method.


```
private void connect(String serverAddress) throws Exception {

        URI base = new URI(String.format("http://%s:8091/pools",serverAddress));
        List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactory cf = new
                CouchbaseConnectionFactory(baseURIs, "default", "");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

You'll recognize this constructor as a single server connection. What if you
want to know more about the current connection state such as when the connection
has been gained, or lost? You can add a connection observer by modifying the
connect method and adding the following lines:


```
public void connectionLost(SocketAddress sa) {
                System.out.println("Connection lost to " + sa.toString());
            }

            public void connectionEstablished(SocketAddress sa,
                    int reconnectCount) {
                System.out.println("Connection established with "
                        + sa.toString());
                System.out.println("Reconnected count: " + reconnectCount);
            }
        });

    }
```

You've only connected with one server, what if it goes offline? This can easily
be fixed by changing the first three lines of the connect method:


```
URI fallback = new URI(
            String.format("http://%s:8091/pools",fallbackAddress));
        baseURIs.add(fallback);
```

This class will even work with colon-delimited IPv6 addresses.

Finally, you need to create the static member variable to store the client
instance at the top of the class:


```
private static CouchbaseClient client;
```

Now you can try compiling and running the application.

You can see that the driver outputs some logging statements indicating that it
is making two connections. You can also see that the connection observer you
added to the `connect()` method is being called with the addresses of the two
servers as they are connected and the reconnection count is 1 indicating that
the network is in good shape. It's ready to get some work done.

<a id="tutorial-logging-from-chat"></a>

## Logging in the Chat Application

For the purpose of this tutorial, we will use the spymemcached logging
framework. The Couchbase Java SDK is compatible with the framework. There are
two other approaches to logging with the Java SDK either by setting JDK
properties, or by logging from an application. For more information, see
[Configuring
Logging](couchbase-sdk-java-ready.html#java-api-configuring-logging)

To provide logging via spymemcached:


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");
```

or


```
System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");
```

The default logger simply logs everything to the standard error stream.

<a id="connection-shutdown"></a>

## Shutting Down a Client Connection

The client application will remain running until the `client.shutdown()` or
`client.shutdown(long, TimeUnit)` methods are called.

The `shutdown()` method shuts the application down immediately and any
outstanding work will be stopped.

The `shutdown(long, TimeUnit)` method will actually wait until any outstanding
queued work is completed before shutting down, but it will time out in the given
period of time. This would be the preferred method of shutting down the client
connection.

<a id="increment-decrement"></a>

## Increment and Decrement Operations

The API contains methods that are able to atomically increment a variable in the
cache and decrement a variable. Effectively this means that these operations are
safe for use by any client across the cluster at any time and there is some
guarantee that these will be done in the right order. We will demonstrate these
methods by tracking the total number of chat clients connected to the server.

Add the following lines to the `Main` method after the connect method:


```
try {
    connect(serverAddress);

    register();
    unregister();

    client.shutdown(1, TimeUnit.MINUTES);

} catch (IOException e) {
    e.printStackTrace();
}
```

Then add the following two methods to the end of the class:


```
private static boolean register() {

    userId = client.incr("UserId", 1, 1);
    System.out.println("You are user " + userId + ".");

    userCount = client.incr("UserCount", 1, 1);
    System.out.println("There are currently " + userCount + " connected.");

    return true;
}

private static void unregister() {

    client.decr("UserCount", 1);
    System.out.println("Unregistered.");

}
```

These two methods demonstrate the use of the `incr` and `decr` methods which
increment and decrement a variable, respectively. The application you are
building uses this to keep track of how many users are currently running the
program. This particular overload of the incr method takes a default value which
it will use if the key UserCount does not exist, and will return the current
count. In this case the first user will be assigned user number 1. Finally, when
the unregister method is called, the decr method will be called to subtract 1
from the UserCount value.

Finally, you must add the following static member variables to the top of the
class:


```
private static long userId = 0;
private static long userCount = 0;
```

If you compile and run this program now, you will see the following output:


```
Reconnected count: -1
You are user 1.
Registration succeeded.
There are currently 1 connected.
Enter text, or /who to see user list, or /quit to exit.
```

Up to this point, the application is doing some very simple things, allowing a
user to connect, and keeping track of how many users and currently connected.
It's time to start adding some data to the system, and providing some methods to
interact between multiple clients.

<a id="prepend-append"></a>

## Prepend and Append Operations

We have implemented a client application that tracks how many clients are
connected at the moment. Let's add the functionality to track the user numbers
that are currently connected.

We'll nominate a key to keep a list of all of the user numbers that are
currently connected, and then when a user disconnects, remove their entry from
the key. Right away, though, this presents a challenge. How can we guarantee
that two users starting at exactly the same time don't mess up the value by
overwriting each other's edits? Let's find out.

The API contains a method called `append`. It takes a special value called a
CAS, which stands for Check and Set, but where do we get this number? There is
another method called gets which returns an object that can be asked for the CAS
value we need to perform an append operation. Another interesting thing about
the append method is that returns a `Future<Boolean>` which means it is an
asynchronous method. You can use the value it returns to wait for an answer
indicating whether the operation succeeded or failed. Asynchronous methods also
allow the code to do other things without having to wait for the result. At a
later point in the code, the result of the operation can be obtained by using
the future variable.

You will be using the `append` method in this tutorial, but the `prepend` method
functions in exactly the same way except that append adds a string to the end of
a value in the cache, and `prepend` puts a string at the front of a value in the
cache.

Both the `append` and `prepend` methods operate atomically, meaning they will
perform the operation on a value in the cache and finish each operation before
moving on to the next. You will not get interleaved appends and prepends. Of
course, the absolute order of these operations is not guaranteed.

The lines that are in bold-face should be changed in the register method of the
code.


```
private static String getUserNameToken() {
     return String.format("<User-%d>", userId);
}

private static boolean register() {

    userId = client.incr("UserId", 1, 1);
    System.out.println("You are user " + userId + ".");

    CASValue<Object> casValue = client.gets("CurrentUsers");

    if (casValue == null) {

        System.out.println("First user ever!");

        try {
            client.set("CurrentUsers", Integer.MAX_VALUE,
                    getUserNameToken()).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

    } else {

        Future<Boolean> appendDone = client.append(casValue.getCas(),
                "CurrentUsers", getUserNameToken());

        try {

            if (appendDone.get()) {
                System.out.println("Registration succeeded.");
            } else {
                System.out.println("Sorry registration failed.");
                return false;
            }

        } catch (InterruptedException e) {
            e.printStackTrace();
            return false;
        } catch (ExecutionException e) {
            e.printStackTrace();
            return false;
        }

    }

    userCount = client.incr("UserCount", 1, 1);
    System.out.println("There are currently " + userCount
            + " connected.");

    return true;
}
```

First you can see that the `client.gets("CurrentUsers")` method is called to get
a `casValue`. If that value is null, it means that no one has ever connected, so
that user is the first user. So we will simply set the value of `CurrentUsers`
using the new `getUserNameToken()` method.

Otherwise, we will append our userid to the list of users. To do this, we need
to call the append method with the CAS that is in the `casValue` by calling its
`getCas()` method. The append method is also asynchronous and returns a
`Future<Boolean>`. Calling the `get()` method on that future will return its
value when its operation has been performed. The append operation can possibly
fail, if for instance the size of the list of usernames exceeds the maximum size
of a value in the cache. So we handle both cases. If it returns true, we tell
the user that the registration was a success. Otherwise the registration failed,
so we'll tell the user this and return false to tell the main program that
something went wrong.

You need to modify the `main` method as well, to handle the possibility of the
`register` method returning false.


```
try {
     connect(serverAddress);

     if (register()) {
         unregister();
     }

     client.shutdown(1, TimeUnit.MINUTES);

} catch (IOException e) {
    e.printStackTrace();
}
```

Now, we need to implement the cleanup of the user list when a user leaves. We
will be modifying the `unregister` method to be very careful to remove the
current userId from the CurrentUsers list before finishing. This is a
potentially dangerous operation for a distributed cache since two or more users
may try to exit the application at the same time and may try to replace the user
list overwriting the previous changes. We will use a trick that effectively
forces a distributed critical section.


```
private static void unregister() {

    try {
        // Wait for add to succeed. It will only
        // succeed if the value is not in the cache.
        while (!client.add("lock:CurrentUsers", 10, "1").get()) {
            System.out.println("Waiting for the lock...");
            Thread.sleep(500);
        }

        try {
            String oldValue = (String)client.get("CurrentUsers");
            String userNameToken = getUserNameToken();
            String newValue = oldValue.replaceAll(userNameToken, "");
            client.set("CurrentUsers", Integer.MAX_VALUE, newValue);
        } finally {
            client.delete("lock:CurrentUsers");
        }

    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }

    client.decr("UserCount", 1);
    System.out.println("Unregistered.");

}
```

Here we use the fact that the `client.add()` method will succeed if and only if
a value does not exist for the given key to provide a way for only one
application to be able to edit the CurrentUsers at a time. We will call this
`lock:CurrentUsers` and it will expire in ten seconds. If we are not able to
add, the code will sleep for 500 milliseconds and try again.

The expiry time as defined in the protocol is documented as follows in the
JavaDocs for the API:

The actual value sent may either be Unix time (number of seconds since January
1, 1970, as a 32-bit value), or a number of seconds starting from current time.
In the latter case, this number of seconds may not exceed 60\*60\*24\*30 (number
of seconds in 30 days); if the number sent by a client is larger than that, the
server will consider it to be real Unix time value rather than an offset from
current time.

Once the add succeeds, a try/finally block is entered that actually gets the
value of CurrentUsers and edits it, replacing the current user token with the
empty string. Then it sets it back. In the finally block, you can see that the
lock is deleted using the `client.delete()` method. This will remove the key
from Couchbase and allow any other clients that are waiting to unregister to
continue into the critical section one at a time.

It is now time to complete the functionality of the tutorial application by
writing a thread that will output the messages that users type as well as a
method of getting input from the users.

First add the following member variable to the class:


```
private static Thread messageThread;
```

Next, modify the `main` method again to add the following lines in bold:


```
if (register()) {
    startMessageThread();
    processInput();
    unregister();
    messageThread.interrupt();
}
```

Now we will need to write a few helper methods, the first is:


```
private static void printMessages(long startId, long endId) {

    for (long i = startId; i <= endId; i++) {
        String message = (String)client.get("Message:" + i);
        if (message != null)
            System.out.println(message);
    }

}
```

This method just iterates through a set of message numbers and prints the
message to the screen. Couchbase does not allow iteration of keys, but that's
alright, we know exactly what pattern the key names follow, so we can do this.

The second method helps to find the oldest message that hasn't expired in the
cache, starting at the last message and running back toward the first message.
Eventually it will find the first message and will return its number,
considering that it will have run one past the end, it needs to do a little
fix-up to return the correct number.


```
private static long findFirstMessage(long currentId) {
    CASValue<Object> cas = null;
    long firstId = currentId;
    do {
        firstId -= 1;
        cas = client.gets("Message:" + firstId);
    } while (cas != null);

    return firstId + 1;
}
```

Finally we come to the method that prints out all of the messages as they come
in. It's somewhat complicated so I'll describe it in detail afterward.


```
private static void startMessageThread() {

    messageThread = new Thread(new Runnable() {
        public void run() {

            long messageId = -1;

            try {
                while (!Thread.interrupted()) {

                    CASValue<Object> msgCountCas = client.gets("Messages");

                    if (msgCountCas == null) {
                        Thread.sleep(250);
                        continue;
                    }

                    long current = Long.parseLong((String)msgCountCas.getValue());

                    if (messageId == -1) {
                        printMessages(findFirstMessage(current),
                                current);
                    } else if (current > messageId) {
                        printMessages(messageId + 1, current);
                    } else {
                        Thread.sleep(250);
                        continue;
                    }

                    messageId = current;

                }

            } catch (InterruptedException ex) {
            } catch (RuntimeException ex) {
            }

            System.out.println("Stopped message thread.");
        }
    });

    messageThread.start();

}
```

This code creates a new thread of execution and assigns it to the
`messageThread` variable. It creates an anonymous `Runnable` class that
implements a `run()` method inline.

The `messageId` variable is set to a sentinel value so that we know when it is
the first time through the while loop. The while loop will iterate until the
thread has been interrupted.

First, in the while loop, we write `client.gets("Messages")` which will return
null if the value does not exist (in which case the loop sleeps for a little
while and continues back to the top), or the method will return a
`CASValue<Object>` instance that we can use to obtain the current message id.

If this is the first time through the loop `(messageId == -1)`, we need to print
out all of the messages since the first to the current.

Otherwise if the current messageId is bigger than what we've previously seen, it
means that some new messages have come in since we last checked, so we will
print them out.

Finally, nothing has changed since we last checked so just sleep some more.

At the end of the loop, we just make sure that the current message id is
remembered for the next iteration of the loop. Exceptions are handled by
suppressing them, and if the while loop exits we'll print a message saying the
message thread stopped.

At the end of the method, the thread is actually started.

Great, so, now if messages come in, we'll display them. Also, when we first
start the application, all of the messages stored in the cache will be
displayed. We need to implement the actual method that allows the user to
interact with the cache.


```
private static void processInput() {
    boolean quit = false;

    System.out.println("Enter text, or /who to see user list, or /quit to exit.");

    do {
        String input = System.console().readLine();
        if (input.startsWith("/quit")) {
            quit = true;
        } else if (input.startsWith("/who")) {
            System.out.println("Users connected: "
                    + client.get("CurrentUsers"));
        } else {
            // Send a new message to the chat
            long messageId = client.incr("Messages", 1, 1);
            client.set("Message:" + messageId, 3600,
                    getUserNameToken() + ": " + input);
        }

    } while (!quit);

}
```

The method keeps track of a quit variable to know when to exit the do/while
loop, then prints out some simple instructions for the user.

The console is read one line at a time, and each is checked to see if it starts
with a command. If the user has typed '/quit' the quit flag will be set, and the
loop will exit.

If the user has typed '/who' the CurrentUsers cached value will be output to the
screen, so that at any time a user can check who is currently online.

Otherwise, the line is treated as a message. Here we increment the Messages key
and use that value as a message id. Then the `client.set()` method is called
with a key of `Message:MessageId` with a timeout of one hour, followed by the
user's name and the text that they entered.

These changes to the cache will be noticed by the message thread, and output to
the screen. Of course this means that each user will see his or her messages
repeated back to them.

If you compile and run the program in multiple terminal windows, you can talk to
yourself. This is about as fun as things can get, isn't it? Notice how
intelligent you can be.

<a id="using-buckets"></a>

## Using Buckets

Up to this point, the test application has been using the default bucket. This
is because it is not authenticated. The default bucket on Couchbase can be
useful when you first start out, but as you build more complex applications, you
may want to partition your data into different buckets to improve fault
tolerance by boosting replication or just so that one bucket can be cleared
without affecting all of the data you have cached in other buckets. You may also
want to partition your key space among several applications to avoid naming
collisions.


![](images/fig01-bucket-creation.png)

Figure 1 shows the dialog in the Couchbase Web Console that demonstrates
creating a new bucket called private with two replicas. Here you also choose a
password to protect the bucket during SASL authentication. How do you access
this bucket? You have already learned about how to make a SASL authenticated
connection to Couchbase, if you use the bucket name as the username, and the
password you provided when creating the bucket, you will connect to the private
bucket for data storage. The following code would accomplish this:


```
// We have used private as the username and private as the password
// but you would not do this, you would be much smarter and use
// something much harder to guess.
    CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs,
       "private", "private");
     client = new CouchbaseClient((CouchbaseConnectionFactory) cf);
```

<a id="error-handling"></a>

## Error Handling

At this point, you may still be wondering how CAS values are used to prevent
clients from writing over values that were changed by another client.

In essence, the CAS value exists so that that a client can 'hold' the CAS value
for a item ID that it knows, and only update the item if the CAS has not
changed. Hence, Check And Set (CAS). In a multi-client environment it's designed
to prevent one client changing the value of an item when another client may have
already updated it.

Unfortunately there's no way to lock items; individual operations (set, for
example) are atomic, but multiple operations are not, and this is what CAS is
designed to protect against. To stop you changing a value that has changed since
the last GET.

In order to demonstrate this situation, add the bold lines to the `processInput`
method to allow a way to perform a CAS operation and see what happens if two of
these operations is interleaved if two copies of the program are run at the same
time.


```
} else if (input.startsWith("/who")) {
    System.out.println("Users connected: "
            + client.get("CurrentUsers"));
} else if (input.startsWith("/cas")) {
    runCasTest();
} else {
```

Now create the `runCasTest()` method at the bottom of the class:


```
private static void runCasTest() {

    System.out.println("Testing a CAS operation.");
    CASValue<Object> cas = client.gets("CasTest");

    if (cas == null) {
        // Must create it first
        System.out.println("Creating CasTest value.");
        client.set("CasTest", 120, "InitialValue");
        return;
    }

    System.out.println("CAS for CasTest = "+cas.getCas());
    System.out.println("Sleeping for 10 seconds.");
    try {
        Thread.sleep(10000);
    } catch (InterruptedException e) {
    }

    CASResponse response =
        client.cas("CasTest", cas.getCas(), "ReplacedValue");
    if (response.equals(CASResponse.OK)) {
        System.out.println("OK response.");
    }
    else if (response.equals(CASResponse.EXISTS)) {
        System.out.println("EXISTS response.");
    }
    else if (response.equals(CASResponse.NOT_FOUND)) {
        System.out.println("NOT_FOUND response.");
    }

    cas = client.gets("CasTest");
    System.err.println("CAS after = "+cas.getCas());
}
```

The first time the test is run (by typing "/cas" while the application is
running) the `gets()` method will return null so it will just set the `CasTest`
key to "InitialValue" and return. The second time the test is run it will get a
`CASValue<Object>` instance from the `gets()` method, print out its value, and
then sleep for 10 seconds. Then after sleeping the code performs a
`client.cas()` method call to replace the value.

If you run this in two different windows you may see output something like the
following if you time things just right:


```
/cas
/cas
Testing a CAS operation.
CAS for CasTest = 2637312854241
Sleeping for 10 seconds.
OK response.
CAS after = 2850841875395
```

In the second copy of the application, the output would look something like
this:


```
Testing a CAS operation.
CAS for CasTest = 2637312854241
Sleeping for 10 seconds.
EXISTS response.
CAS after = 2850841875395
```

What you see is that when the CAS is 2637312854241, the second client modifies
the value before the first client is done sleeping. Instead of getting an OK
response, that client gets an EXISTS response indicating that a change has been
made before it had a chance to do so, so its `client.cas()` operation failed,
and the code would have to handle this situation to rectify the situation.

Locking is not an option if you want to have an operational distributed cache.
Locking causes contention and complexity. Being able to quickly detect when a
value has been overwritten without having to hold a lock is a simple solution to
the problem. You will be able to write code to handle the situation either by
returning an error to the user, or retrying the operation after obtaining
another CAS value.

<a id="using-couchbase-cluster"></a>

## Using Couchbase Cluster

One of the newest features of the Couchbase SDKs and spymemcached libraries is
the support for communicating intelligently with the Couchbase Server cluster.
The smart client support allows the SDK to automatically connect clients to the
data stored within the cluster by directly communicating with the right node in
the cluster. This ability also allows for clints to continue to operate during
failover and rebalancing operations.

All you need to start using this functionality is to use a new `Couchbase`
constructor that allows you to pass in a list of base URIs, and the bucket name
and password as we did in the `connect()` method earlier.


```
try {
    URI server = new URI(addresses);
    ArrayList<URI> serverList = new ArrayList<URI>();
    serverList.add(server);
    CouchbaseClient client = new CouchbaseClient(
            serverList, "rags", "password");
} catch (Throwable ex) {
    ex.printStackTrace();
}
```

Compile and run the application:


```
shell> javac -cp couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar Tutorial.java
shell> java -cp .:couchbase-client-1.0.0.jar:\
spymemcached-2.8.0.jar:jettison-1.1.jar:netty-3.2.0.Final.jar:\
commons-codec-1.5.jar Tutorial 192.168.3.104
```

Replace serverhost with the name or IP address of your server, you won't need
the port this time. You will see something like the following output:


```
Jan 17, 2012 12:11:43 PM net.spy.memcached.MemcachedConnection createConnections
INFO: Added {QA sa=/192.168.3.111:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
Jan 17, 2012 12:11:43 PM net.spy.memcached.MemcachedConnection handleIO
INFO: Connection state changed for sun.nio.ch.SelectionKeyImpl@2abe0e27
Jan 17, 2012 12:11:43 PM net.spy.memcached.auth.AuthThread$1 receivedStatus
INFO: Authenticated to /192.168.3.111:11210
```

You can see that it connects to the server and automatically loads the list of
all Couchbase servers, connects to them and authenticates. It uses the vbucket
algorithm automatically, and no code changes to the application will be
required.

<a id="complete-tutorial-code"></a>

## The Tutorial Example Code

The Complete code for the tutorial is below and you would compile and run it
with the command line arguments as below ensuring that the client libraries are
included in the Java classpath.


```
shell> javac -cp couchbase-client-1.0.0.jar:spymemcached-2.8.0.jar Tutorial.java
shell> java -cp .:couchbase-client-1.0.0.jar:\
spymemcached-2.8.0.jar:jettison-1.1.jar:netty-3.2.0.Final.jar:\
commons-codec-1.5.jar Tutorial 192.168.3.104
```


```
import java.io.IOException;
import java.net.SocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import javax.naming.ConfigurationException;

import net.spy.memcached.CASMutation;
import net.spy.memcached.CASMutator;
import net.spy.memcached.CASResponse;
import net.spy.memcached.CASValue;
import net.spy.memcached.CachedData;
import net.spy.memcached.ConnectionObserver;
import net.spy.memcached.transcoders.SerializingTranscoder;
import net.spy.memcached.transcoders.Transcoder;

import com.couchbase.client.CouchbaseClient;
import com.couchbase.client.CouchbaseConnectionFactory;

public class Tutorial {

    private static CouchbaseClient client;
    private long userId = 0;
    private long userCount = 0;
    private Thread messageThread;

    /**
     * Main Program for a Couchbase chat room application using
     * the couchbase-client and spymemcached libraries.
     */
    public static void main(String[] args) {

        if (args.length != 1) {
            System.err.println("usage: serveraddresses");
            System.exit(1);
        }

        try {

            new Tutorial().run(args[0]);

        } catch (Exception ex) {
            System.err.println(ex);
            client.shutdown();
        }
    }

    public void run(String serverAddress) throws Exception {

        System.setProperty("net.spy.log.LoggerImpl",
            "net.spy.memcached.compat.log.SunLogger");

        System.out.println(String
                .format("Connecting to %s", serverAddress));

        connect(serverAddress);

        if (register()) {
            startMessageThread();
            Runtime.getRuntime().addShutdownHook(new unregisterThread());
            processInput();
            unregister();
            messageThread.interrupt();
        }
        client.shutdown(1, TimeUnit.MINUTES);
        System.exit(0);
    }

    /**
     * Connect to the server, or servers given.
     * @param serverAddress the server addresses to connect with.
     * @throws IOException if there is a problem with connecting.
     * @throws URISyntaxException
     * @throws ConfigurationException
     */
    private void connect(String serverAddress) throws Exception {

        URI base = new URI(
                String.format("http://%s:8091/pools",serverAddress));
        List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactory cf = new
                CouchbaseConnectionFactory(baseURIs, "default", "");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

        client.addObserver(new ConnectionObserver() {

            public void connectionLost(SocketAddress sa) {
                System.out.println("Connection lost to " + sa.toString());
            }

            public void connectionEstablished(SocketAddress sa,
                    int reconnectCount) {
                System.out.println("Connection established with "
                        + sa.toString());
                System.out.println("Reconnected count: " + reconnectCount);
            }
        });

    }

    /**
     * Get a user name token for the current user.
     * @return the token to use.
     */
    private String getUserNameToken() {
        return String.format("<User-%d>", userId);
    }

    /**
     * Register the user with the chat room.
     * @return true if the registration succeeded, false otherwise.
     */
    private boolean register() throws Exception {

        userId = client.incr("UserId", 1, 1);
        System.out.println("You are user " + userId + ".");

        CASValue<Object> casValue = client.gets("CurrentUsers");

        if (casValue == null) {

            System.out.println("First user ever!");

            client.set("CurrentUsers", Integer.MAX_VALUE,
                    getUserNameToken()).get();

        } else {

            Future<Boolean> appendDone = client.append(casValue.getCas(),
                    "CurrentUsers", getUserNameToken());

            if (appendDone.get()) {
                System.out.println("Registration succeeded.");
            } else {
                System.out.println("Sorry registration failed.");
                return false;
            }

        }

        userCount = client.incr("UserCount", 1, 1);
        System.out.println("There are currently " + userCount
                + " connected.");

        return true;
    }

    /**
     * A Transcoder for strings that just delegates to using
     * a SerializingTranscoder.
     */
    class StringTranscoder implements Transcoder<String> {

        final SerializingTranscoder delegate = new SerializingTranscoder();

        public boolean asyncDecode(CachedData d) {
            return delegate.asyncDecode(d);
        }

        public String decode(CachedData d) {
            return (String)delegate.decode(d);
        }

        public CachedData encode(String o) {
            return delegate.encode(o);
        }

        public int getMaxSize() {
            return delegate.getMaxSize();
        }

    }

    /**
     * Unregister the current user from the chat room.
     */
    private void unregister() throws Exception {

        CASMutation<String> mutation = new CASMutation<String>() {
            public String getNewValue(String current) {
                return current.replaceAll(getUserNameToken(), "");
            }
        };

        Transcoder<String> transcoder = new StringTranscoder();
        CASMutator<String> mutator = new CASMutator<String>(client, transcoder);
        mutator.cas("CurrentUsers", "", 0, mutation);

        client.decr("UserCount", 1);
        System.out.println("Unregistered.");

    }

    /**
     * Print a number of messages.
     * @param startId the first message id to output.
     * @param endId the last message id to output.
     */
    private void printMessages(long startId, long endId) {

        for (long i = startId; i <= endId; i++) {
            String message = (String)client.get("Message:" + i);
            if (message != null)
                System.out.println(message);
        }

    }

    /**
     * Finds the first message id that has not yet expired.
     * @param currentId the last message id to start with.
     * @return the first message id known in the system at the time.
     */
    private long findFirstMessage(long currentId) {
        CASValue<Object> cas = null;
        long firstId = currentId;
        do {
            firstId -= 1;
            cas = client.gets("Message:" + firstId);
        } while (cas != null);

        return firstId + 1;
    }

    /**
     * Start up the message display thread.
     */
    private void startMessageThread() {

        messageThread = new Thread(new Runnable() {
            public void run() {

                long messageId = -1;

                try {
                    while (!Thread.interrupted()) {

                        CASValue<Object> msgCountCas = client
                                .gets("Messages");

                        if (msgCountCas == null) {
                            Thread.sleep(250);
                            continue;
                        }

                        long current = Long.parseLong((String)msgCountCas
                                .getValue());

                        if (messageId == -1) {
                            printMessages(findFirstMessage(current),
                                    current);
                        } else if (current > messageId) {
                            printMessages(messageId + 1, current);
                        } else {
                            Thread.sleep(250);
                            continue;
                        }

                        messageId = current;

                    }

                } catch (InterruptedException ex) {
                } catch (RuntimeException ex) {
                }

                System.out.println("Stopped message thread.");
            }
        });

        messageThread.start();
    }

    /**
     * Handle shutdown by unregistering
     */
    private class unregisterThread extends Thread {


    public void run() {
      try {

        unregister();
        messageThread.interrupt();
        client.shutdown(1, TimeUnit.MINUTES);
        super.run();;
      } catch (Exception e) {
      }
    }
  }

    /**
     * Processes input from the user, and sends messages to the virtual
     * chat room.
     */
    private void processInput() {
        boolean quit = false;

        System.out.
          println("Enter text, or /who to see user list, or /quit to exit.");

        try {
        do {
            String input = System.console().readLine();
            System.out.println(input);
            if (input.startsWith("/quit")) {
                quit = true;
            } else if (input.startsWith("/who")) {
                System.out.println("Users connected: "
                        + client.get("CurrentUsers"));
            } else if (input.startsWith("/cas")) {
                runCasTest();
            } else {
                // Send a new message to the chat
                long messageId = client.incr("Messages", 1, 1);
                client.set("Message:" + messageId, 3600,
                        getUserNameToken() + ": " + input);
            }

        } while (!quit);
        } catch (Exception e) {
        }

    }

    private void runCasTest() {
        System.out.println("Testing a CAS operation.");
        CASValue<Object> cas = client.gets("CasTest");

        if (cas == null) {
            // Must create it first
            System.out.println("Creating CasTest value.");
            client.set("CasTest", 120, "InitialValue");
            return;
        }

        System.out.println("CAS for CasTest = "+cas.getCas());
        System.out.println("Sleeping for 10 seconds.");
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
        }

        CASResponse response =
            client.cas("CasTest", cas.getCas(), "ReplacedValue");
        if (response.equals(CASResponse.OK)) {
            System.out.println("OK response.");
        }
        else if (response.equals(CASResponse.EXISTS)) {
            System.out.println("EXISTS response.");
        }
        else if (response.equals(CASResponse.NOT_FOUND)) {
            System.out.println("NOT_FOUND response.");
        }

        cas = client.gets("CasTest");
        System.err.println("CAS after = "+cas.getCas());
    }
}
```

Congratulations, you have completed the Couchbase portion of this tutorial. You
can download [the entire Java Tutorial Source
code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.0.0.zip)
and follow along with the steps.

<a id="api-reference-started"></a>
