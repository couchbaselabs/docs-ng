<a id="couchbase-sdk-java-1-1"></a>

# Couchbase Client Library: Java 1.1

This is the manual for 1.1 of the Couchbase Java client library, which is
compatible with Couchbase Server 2.0. This manual provides a reference to the key features and best practice for using
the Java Couchbase Client libraries ( `couchbase-client` and `spymemcached` ).
The content constitutes a reference to the core API, not a complete guide to the
entire API functionality.
    

### `External Community Resources`

 *  [Wiki: Java Client
    Library](http://www.couchbase.com/wiki/display/couchbase/Couchbase+Java+Client+Library)

 *  [Download Client
    Library](http://packages.couchbase.com/clients/java/1.1-dp/Couchbase-Java-Client-1.1-dp.zip)

 *  [Java Client Library](http://www.couchbase.com/develop/java/next)

 *  [SDK Forum](http://www.couchbase.com/forums/sdks/sdks)



<a id="getting-started"></a>

# Getting Started

Install the Couchbase server with the sample bucket, beer-sample. We will look
at some examples later that will use this bucket.

Now that you have installed Couchbase, the sample bucket beer-sample and have
probably created a cluster of Couchbase servers, it is time to install the
client libraries, `couchbase-client` and `spymemcached`, and start storing data
into the clusters.

Here's a quick outline of what you'll learn in this chapter:

 1.  Download the Java Couchbase Client Libraries, couchbase-client and spymemcached.

 2.  Create an Eclipse or NetBeans project and set up the Couchbase Client Libraries
     as referenced libraries. You'll need to include these libraries at compile time,
     which should propagate to run time.

 3.  Write a simple program to demonstrate connecting to Couchbase and saving some
     documents.

 4.  Write a program to demonstrate using Create, Read, Update, Delete (CRUD)
     operations on some documents.

 5.  Explore some of the API methods that will take you further than the simple
     program.

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and a sample
data bucket, beer-sample, established. If you need to set up these items, you
can do with the Couchbase Administrative Console, or Couchbase Command-Line
Interface (CLI), or the Couchbase REST-API. For information and instructions,
see:

 *  [Using the Couchbase Web
    Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
    for information on using the Couchbase Administrative Console,

 *  [Couchbase
    CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
    for the command line interface,

 *  [Couchbase REST
    API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
    for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed SDK, you can
compile and run the following basic program.

<a id="downloading"></a>

## Downloading the Couchbase Client Libraries

Download the Client libraries and its dependencies and make sure they are
available in the classpath. Please refer to [for installation of the client JAR
files and the dependencies and for running
them.](http://www.couchbase.com/develop/java/current) You can download them
directly from [the Java client libraries for
Couchbase](http://packages.couchbase.com/clients/java/1.1-dp2/Couchbase-Java-Client-1.1-dp2.zip).

These are Java Archive ( `.jar` ) files that you can use with your Java
environment.

<a id="hello-world"></a>

## Hello Couchbase

You might be curious what the simplest Java program to talk to Couchbase might
look like, and how you might compile and run it using just the Java command line
tools. Follow along if you like and look at Listing 1.

Listing 1: Main.java


    `java
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
        // Shutdown the client
        client.shutdown(3, TimeUnit.SECONDS);
        System.exit(0);
      }
    }

 1.  Enter the code in listing 1 into a file named Main.java

 2.  Download the couchbase-client and spymemcached client libraries for Java. You
     will also need the dependent JAR files as well, as listed in the execution
     instructions below. One simple way to obtain the JAR and all dependencies is
     through the Maven repository.

 3.  Type the following commands:


         shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar \
               Main.java
         shell> java -cp .:couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar:\
         jettison-1.1.jar:netty-3.3.1.Final.jar:commons-codec-1.5.jar:\
         httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar Main

Of course, substitute your own Couchbase server IP address. If you are on Linux
or MacOS replace the semi-colon in the second command-line with a colon. The
program will produce the following output:


    2012-03-14 16:15:19.575 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    2012-03-14 16:15:19.582 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@15a62c31
    2012-03-14 16:15:19.598 INFO com.couchbase.client.CouchbaseConnection:  Added localhost/127.0.0.1:11210 to connect queue
    2012-03-14 16:15:19.599 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
    2012-03-14 16:15:19.602 INFO com.couchbase.client.ViewConnection:  Added localhost/127.0.0.1:8092 to connect queue
    Set Succeeded
    Synchronous Get Suceeded: Hello World!
    Asynchronous Get Succeeded: Hello World!
    2012-03-14 16:15:19.725 INFO com.couchbase.client.CouchbaseConnection:  Shut down Couchbase client
    2012-03-14 16:15:19.727 INFO com.couchbase.client.ViewConnection:  Shut down Couchbase client
    2012-03-14 16:15:19.728 INFO com.couchbase.client.ViewNode:  Couchbase I/O reactor terminated

Much of this output is logging statements produced by the client library, to
inform you of what's going on inside the client library to help you diagnose
issues. It says that a connection to Couchbase was added and that the connection
state changed. Then the code shows that the key spoon did not exist in Couchbase
which is why the Synchronous Get failed.

Running the program again, within 10 seconds will produce the following output:


    2012-03-14 16:17:49.602 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    2012-03-14 16:17:49.609 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@67d225a7
    2012-03-14 16:17:49.624 INFO com.couchbase.client.CouchbaseConnection:  Added localhost/127.0.0.1:11210 to connect queue
    2012-03-14 16:17:49.626 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
    2012-03-14 16:17:49.628 INFO com.couchbase.client.ViewConnection:  Added localhost/127.0.0.1:8092 to connect queue
    Set Succeeded
    Synchronous Get Suceeded: Hello World!
    Asynchronous Get Succeeded: Hello World!
    2012-03-14 16:17:49.765 INFO com.couchbase.client.CouchbaseConnection:  Shut down Couchbase client
    2012-03-14 16:17:49.767 INFO com.couchbase.client.ViewConnection:  Shut down Couchbase client

Again you see the log statements, followed by the indication that this time, the
key spoon was found in Couchbase with the value "Hello World!" as evidenced in
the Synchronous Get succeeding. Run the same piece of code after 10 seconds or
set the do\_delete flag to true and notice the changed behavior of the program.
It is possible to get the precise message from the server in the case of a
failure by calling the `getOp.getStatus().getMessage()` method on the Operation.

Congratulations, you've taken your first small step into a much larger world.

<a id="persisting-json"></a>

## Persisting JSON Data using Java

As we will see later, persisting data in JSON format provides the capabilities
of defining secondary indexing using query and views. There are several Java
libraries that provides APIs for mapping JSON data as a Java class and vice
versa. Using these libraries makes it easy to manipulate JSON data in a Java
program.

We will look at a very simple program below that takes the data for Presidents
in a file *Presidents.json* and persists the data using presidency as a key. We
will use the [Google gson libraries](http://code.google.com/p/google-gson/) to
do this although we could have used any other JSON library for Java.

We first define a Java class(President.java) to handle the mapping of the
Presidents' data between Java and JSON.


    `java
    class President
    {
      String presidency;
      String name;
      String wikipedia_entry;
      String took_office;
      String left_office;
      String party;
      String portrait;
      String thumbnail;
      String home_state;
      String type;
    }

Next we write a Java program that opens up the *Presidents.json* file, uses the
mapping that we just defined and persists the data using the presidency as the
key.

The *fromJson* and *toJson* methods in the Gson libraries handle the mapping
between the Java class and JSON and vice versa as shown below.


    `java
    import java.net.URI;
    import java.util.List;

    import com.couchbase.client.CouchbaseClient;
    import java.io.FileReader;

    import com.google.gson.Gson;
    import java.util.ArrayList;

    public class Presidents {

      public static void main(String[] args) throws Exception {

        // Read the Data

        Gson gson = new Gson();
        President[] Presidents = gson.fromJson(new
                FileReader("Presidents.json"),
                President[].class);

        try {

          URI local = new URI("http://localhost:8091/pools");
          List<URI> baseURIs = new ArrayList<URI>();
          baseURIs.add(local);

          CouchbaseClient c = new CouchbaseClient(baseURIs, "default", "");
          for (President entry : Presidents) {
            String JSONentry = gson.toJson(entry);
            c.set(entry.presidency, 0, JSONentry).get();

            System.out.println(entry.presidency + " " +
                    c.get(entry.presidency));
          }
        } catch (Exception e) {
          System.err.println("Error connecting to Couchbase: " + e.getMessage());
          System.exit(0);
        }
      System.exit(0);
      }
    }

Compiling and running the program as below


    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar:\
    gson-2.1.jar \
    Presidents.java President.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar:\
    jettison-1.1.jar:netty-3.3.1.Final.jar:commons-codec-1.5.jar:\
    gson-2.1.jar:httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar Presidents

Should produce an output that looks something like below.


    2012-08-18 01:45:14.089 INFO com.couchbase.client.CouchbaseConnection:  Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    2012-08-18 01:45:14.094 INFO com.couchbase.client.CouchbaseConnection:  Connection state changed for sun.nio.ch.SelectionKeyImpl@3b6f0be8
    2012-08-18 01:45:14.114 INFO com.couchbase.client.CouchbaseConnection:  Added localhost/127.0.0.1:11210 to connect queue
    2012-08-18 01:45:14.115 INFO com.couchbase.client.CouchbaseClient:  viewmode property isn't defined. Setting viewmode to production mode
    2012-08-18 01:45:14.118 INFO com.couchbase.client.ViewConnection:  Added localhost/127.0.0.1:8092 to connect queue
    1 {"presidency":"1","name":"George Washington","wikipedia_entry":"http://en.wikipedia.org/wiki/George_Washington","took_office":"1789","left_office":"1797","party":"Independent","portrait":"GeorgeWashington.jpg","thumbnail":"thmb_GeorgeWashington.jpg","home_state":"Virginia","type":"president"}
    2 {"presidency":"2","name":"John Adams","wikipedia_entry":"http://en.wikipedia.org/wiki/John_Adams","took_office":"1797","left_office":"1801","party":"Federalist ","portrait":"JohnAdams.jpg","thumbnail":"thmb_JohnAdams.jpg","home_state":"Massachusetts","type":"president"}
    3 {"presidency":"3","name":"Thomas Jefferson","wikipedia_entry":"http://en.wikipedia.org/wiki/Thomas_Jefferson","took_office":"1801","left_office":"1809","party":"Democratic-Republican ","portrait":"Thomasjefferson.gif","thumbnail":"thmb_Thomasjefferson.gif","home_state":"Virginia","type":"president"}
    4 {"presidency":"4","name":"James Madison","wikipedia_entry":"http://en.wikipedia.org/wiki/James_Madison","took_office":"1809","left_office":"1817","party":"Democratic-Republican ","portrait":"JamesMadison.gif","thumbnail":"thmb_JamesMadison.gif","home_state":"Virginia","type":"president"}
    5 {"presidency":"5","name":"James Monroe","wikipedia_entry":"http://en.wikipedia.org/wiki/James_Monroe","took_office":"1817","left_office":"1825","party":"Democratic-Republican ","portrait":"JamesMonroe.gif","thumbnail":"thmb_JamesMonroe.gif","home_state":"Virginia","type":"president"}
    6 {"presidency":"6","name":"John Quincy Adams","wikipedia_entry":"http://en.wikipedia.org/wiki/John_Quincy_Adams","took_office":"1825","left_office":"1829","party":"Democratic-Republican/National Republican ","portrait":"JohnQuincyAdams.gif","thumbnail":"thmb_JohnQuincyAdams.gif","home_state":"Massachusetts","type":"president"}
    7 {"presidency":"7","name":"Andrew Jackson","wikipedia_entry":"http://en.wikipedia.org/wiki/Andrew_Jackson","took_office":"1829","left_office":"1837","party":"Democratic ","portrait":"Andrew_jackson_head.gif","thumbnail":"thmb_Andrew_jackson_head.gif","home_state":"Tennessee","type":"president"}
    8 {"presidency":"8","name":"Martin Van Buren","wikipedia_entry":"http://en.wikipedia.org/wiki/Martin_Van_Buren","took_office":"1837","left_office":"1841","party":"Democratic ","portrait":"MartinVanBuren.gif","thumbnail":"thmb_MartinVanBuren.gif","home_state":"New York","type":"president"}
    9 {"presidency":"9","name":"William Henry Harrison","wikipedia_entry":"http://en.wikipedia.org/wiki/William_Henry_Harrison","took_office":"1841","left_office":"1841","party":"Whig","portrait":"WilliamHenryHarrison.gif","thumbnail":"thmb_WilliamHenryHarrison.gif","home_state":"Ohio","type":"president"}
    10 {"presidency":"10","name":"John Tyler","wikipedia_entry":"http://en.wikipedia.org/wiki/John_Tyler","took_office":"1841","left_office":"1845","party":"Whig","portrait":"JohnTyler.jpg","thumbnail":"thmb_JohnTyler.jpg","home_state":"Virginia","type":"president"}
    11 {"presidency":"11","name":"James K. Polk","wikipedia_entry":"http://en.wikipedia.org/wiki/James_K._Polk","took_office":"1845","left_office":"1849","party":"Democratic ","portrait":"JamesKPolk.gif","thumbnail":"thmb_JamesKPolk.gif","home_state":"Tennessee","type":"president"}
    12 {"presidency":"12","name":"Zachary Taylor","wikipedia_entry":"http://en.wikipedia.org/wiki/Zachary_Taylor","took_office":"1849","left_office":"1850","party":"Whig","portrait":"ZacharyTaylor.jpg","thumbnail":"thmb_ZacharyTaylor.jpg","home_state":"Louisiana","type":"president"}
    13 {"presidency":"13","name":"Millard Fillmore","wikipedia_entry":"http://en.wikipedia.org/wiki/Millard_Fillmore","took_office":"1850","left_office":"1853","party":"Whig","portrait":"MillardFillmore.png","thumbnail":"thmb_MillardFillmore.png","home_state":"New York","type":"president"}
    14 {"presidency":"14","name":"Franklin Pierce","wikipedia_entry":"http://en.wikipedia.org/wiki/Franklin_Pierce","took_office":"1853","left_office":"1857","party":"Democratic ","portrait":"FranklinPierce.gif","thumbnail":"thmb_FranklinPierce.gif","home_state":"New Hampshire","type":"president"}
    15 {"presidency":"15","name":"James Buchanan","wikipedia_entry":"http://en.wikipedia.org/wiki/James_Buchanan","took_office":"1857","left_office":"1861","party":"Democratic ","portrait":"JamesBuchanan.gif","thumbnail":"thmb_JamesBuchanan.gif","home_state":"Pennsylvania","type":"president"}
    16 {"presidency":"16","name":"Abraham Lincoln","wikipedia_entry":"http://en.wikipedia.org/wiki/Abraham_Lincoln","took_office":"1861","left_office":"1865","party":"Republican/NationalUnion","portrait":"AbrahamLincoln.jpg","thumbnail":"thmb_AbrahamLincoln.jpg","home_state":"Illinois","type":"president"}
    17 {"presidency":"17","name":"Andrew Johnson","wikipedia_entry":"http://en.wikipedia.org/wiki/Andrew_Johnson","took_office":"1865","left_office":"1869","party":"Democratic/National Union","portrait":"AndrewJohnson.gif","thumbnail":"thmb_AndrewJohnson.gif","home_state":"Tennessee","type":"president"}
    18 {"presidency":"18","name":"Ulysses S. Grant","wikipedia_entry":"http://en.wikipedia.org/wiki/Ulysses_S._Grant","took_office":"1869","left_office":"1877","party":"Republican ","portrait":"UlyssesSGrant.gif","thumbnail":"thmb_UlyssesSGrant.gif","home_state":"Ohio","type":"president"}
    19 {"presidency":"19","name":"Rutherford B. Hayes","wikipedia_entry":"http://en.wikipedia.org/wiki/Rutherford_B._Hayes","took_office":"1877","left_office":"1881","party":"Republican ","portrait":"RutherfordBHayes.png","thumbnail":"thmb_RutherfordBHayes.png","home_state":"Ohio","type":"president"}
    20 {"presidency":"20","name":"James A. Garfield","wikipedia_entry":"http://en.wikipedia.org/wiki/James_A._Garfield","took_office":"1881","left_office":"1881","party":"Republican ","portrait":"James_Garfield.jpg","thumbnail":"thmb_James_Garfield.jpg","home_state":"Ohio","type":"president"}
    21 {"presidency":"21","name":"Chester A. Arthur","wikipedia_entry":"http://en.wikipedia.org/wiki/Chester_A._Arthur","took_office":"1881","left_office":"1885","party":"Republican ","portrait":"ChesterAArthur.gif","thumbnail":"thmb_ChesterAArthur.gif","home_state":"New York","type":"president"}
    22 {"presidency":"22","name":"Grover Cleveland","wikipedia_entry":"http://en.wikipedia.org/wiki/Grover_Cleveland","took_office":"1885","left_office":"1889","party":"Democratic ","portrait":"Grover_Cleveland_2.jpg","thumbnail":"thmb_Grover_Cleveland_2.jpg","home_state":"New York","type":"president"}
    23 {"presidency":"23","name":"Benjamin Harrison","wikipedia_entry":"http://en.wikipedia.org/wiki/Benjamin_Harrison","took_office":"1889","left_office":"1893","party":"Republican ","portrait":"BenjaminHarrison.gif","thumbnail":"thmb_BenjaminHarrison.gif","home_state":"Indiana","type":"president"}
    24 {"presidency":"24","name":"Grover Cleveland (2nd term)","wikipedia_entry":"http://en.wikipedia.org/wiki/Grover_Cleveland","took_office":"1893","left_office":"1897","party":"Democratic ","portrait":"Grover_Cleveland.jpg","thumbnail":"thmb_Grover_Cleveland.jpg","home_state":"New York","type":"president"}
    25 {"presidency":"25","name":"William McKinley","wikipedia_entry":"http://en.wikipedia.org/wiki/William_McKinley","took_office":"1897","left_office":"1901","party":"Republican ","portrait":"WilliamMcKinley.gif","thumbnail":"thmb_WilliamMcKinley.gif","home_state":"Ohio","type":"president"}
    26 {"presidency":"26","name":"Theodore Roosevelt","wikipedia_entry":"http://en.wikipedia.org/wiki/Theodore_Roosevelt","took_office":"1901","left_office":"1909","party":"Republican ","portrait":"TheodoreRoosevelt.jpg","thumbnail":"thmb_TheodoreRoosevelt.jpg","home_state":"New York","type":"president"}
    27 {"presidency":"27","name":"William Howard Taft","wikipedia_entry":"http://en.wikipedia.org/wiki/William_Howard_Taft","took_office":"1909","left_office":"1913","party":"Republican ","portrait":"WilliamHowardTaft.jpg","thumbnail":"thmb_WilliamHowardTaft.jpg","home_state":"Ohio","type":"president"}
    28 {"presidency":"28","name":"Woodrow Wilson","wikipedia_entry":"http://en.wikipedia.org/wiki/Woodrow_Wilson","took_office":"1913","left_office":"1921","party":"Democratic ","portrait":"WoodrowWilson.gif","thumbnail":"thmb_WoodrowWilson.gif","home_state":"New Jersey","type":"president"}
    29 {"presidency":"29","name":"Warren G. Harding","wikipedia_entry":"http://en.wikipedia.org/wiki/Warren_G._Harding","took_office":"1921","left_office":"1923","party":"Republican ","portrait":"WarrenGHarding.gif","thumbnail":"thmb_WarrenGHarding.gif","home_state":"Ohio","type":"president"}
    30 {"presidency":"30","name":"Calvin Coolidge","wikipedia_entry":"http://en.wikipedia.org/wiki/Calvin_Coolidge","took_office":"1923","left_office":"1929","party":"Republican ","portrait":"CoolidgeWHPortrait.gif","thumbnail":"thmb_CoolidgeWHPortrait.gif","home_state":"Massachusetts","type":"president"}
    31 {"presidency":"31","name":"Herbert Hoover","wikipedia_entry":"http://en.wikipedia.org/wiki/Herbert_Hoover","took_office":"1929","left_office":"1933","party":"Republican ","portrait":"HerbertHover.gif","thumbnail":"thmb_HerbertHover.gif","home_state":"Iowa","type":"president"}
    32 {"presidency":"32","name":"Franklin D. Roosevelt","wikipedia_entry":"http://en.wikipedia.org/wiki/Franklin_D._Roosevelt","took_office":"1933","left_office":"1945","party":"Democratic","portrait":"FranklinDRoosevelt.gif","thumbnail":"thmb_FranklinDRoosevelt.gif","home_state":"New York","type":"president"}
    33 {"presidency":"33","name":"Harry S. Truman","wikipedia_entry":"http://en.wikipedia.org/wiki/Harry_S._Truman","took_office":"1945","left_office":"1953","party":"Democratic","portrait":"HarryTruman.jpg","thumbnail":"thmb_HarryTruman.jpg","home_state":"Missouri","type":"president"}
    34 {"presidency":"34","name":"Dwight D. Eisenhower","wikipedia_entry":"http://en.wikipedia.org/wiki/Dwight_D._Eisenhower","took_office":"1953","left_office":"1961","party":"Republican ","portrait":"Dwight_D_Eisenhower.jpg","thumbnail":"thmb_Dwight_D_Eisenhower.jpg","home_state":"Texas","type":"president"}
    35 {"presidency":"35","name":"John F. Kennedy","wikipedia_entry":"http://en.wikipedia.org/wiki/John_F._Kennedy","took_office":"1961","left_office":"1963","party":"Democratic","portrait":"John_F_Kennedy.jpg","thumbnail":"thmb_John_F_Kennedy.jpg","home_state":"Massachusetts","type":"president"}
    36 {"presidency":"36","name":"Lyndon B. Johnson","wikipedia_entry":"http://en.wikipedia.org/wiki/Lyndon_B._Johnson","took_office":"1963","left_office":"1969","party":"Democratic","portrait":"Lyndon_B_Johnson.gif","thumbnail":"thmb_Lyndon_B_Johnson.gif","home_state":"Texas","type":"president"}
    37 {"presidency":"37","name":"Richard Nixon","wikipedia_entry":"http://en.wikipedia.org/wiki/Richard_Nixon","took_office":"1969","left_office":"1974","party":"Republican","portrait":"RichardNixon.gif","thumbnail":"thmb_RichardNixon.gif","home_state":"California","type":"president"}
    38 {"presidency":"38","name":"Gerald Ford","wikipedia_entry":"http://en.wikipedia.org/wiki/Gerald_Ford","took_office":"1974","left_office":"1977","party":"Republican","portrait":"Gerald_R_Ford.jpg","thumbnail":"thmb_Gerald_R_Ford.jpg","home_state":"Michigan","type":"president"}
    39 {"presidency":"39","name":"Jimmy Carter","wikipedia_entry":"http://en.wikipedia.org/wiki/Jimmy_Carter","took_office":"1977","left_office":"1981","party":"Democratic ","portrait":"James_E_Carter.gif","thumbnail":"thmb_James_E_Carter.gif","home_state":"Georgia","type":"president"}
    40 {"presidency":"40","name":"Ronald Reagan","wikipedia_entry":"http://en.wikipedia.org/wiki/Ronald_Reagan","took_office":"1981","left_office":"1989","party":"Republican ","portrait":"ReaganWH.jpg","thumbnail":"thmb_ReaganWH.jpg","home_state":"California","type":"president"}
    41 {"presidency":"41","name":"George H. W. Bush","wikipedia_entry":"http://en.wikipedia.org/wiki/George_H._W._Bush","took_office":"1989","left_office":"1993","party":"Republican ","portrait":"George_H_W_Bush.gif","thumbnail":"thmb_George_H_W_Bush.gif","home_state":"Texas","type":"president"}
    42 {"presidency":"42","name":"Bill Clinton","wikipedia_entry":"http://en.wikipedia.org/wiki/Bill_Clinton","took_office":"1993","left_office":"2001","party":"Democratic ","portrait":"Clinton.jpg","thumbnail":"thmb_Clinton.jpg","home_state":"Arkansas","type":"president"}
    43 {"presidency":"43","name":"George W. Bush","wikipedia_entry":"http://en.wikipedia.org/wiki/George_W._Bush","took_office":"2001","left_office":"2009","party":"Republican ","portrait":"George_W_Bush.jpg","thumbnail":"thmb_George_W_Bush.jpg","home_state":"Texas","type":"president"}
    44 {"presidency":"44","name":"Barack Obama","wikipedia_entry":"http://en.wikipedia.org/wiki/Barack_Obama","took_office":"2009","left_office":"2013","party":"Democratic","portrait":"Barack_Obama.jpg","thumbnail":"thmb_Barack_Obama.jpg","home_state":"Illinois","type":"president"}

For convenience, the Java programs and the accompanying JSON data is available
from
[http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip).

As you can see, it's very straightforward to persist JSON data on the server
using Java. Please refer to the tutorial for a more detailed discussion of using
JSON and how to define views and queries based on the JSON data.

<a id="crud-json"></a>

## CRUD Operations with JSON

In this section we will look at how to Create, Read, Update and Delete
JSON-based documents.

These program snippets assume that Couchbase Server 1563 (or higher) is
installed and the sample data which is contained in beer-sample is created and
ready for use.

We will use the [Google gson libraries](http://code.google.com/p/google-gson/)
to do this although we could have used any other JSON library for Java.

We first define a Java class(Beer.java) to handle the mapping of the Beer data
between Java and JSON.


    `java
    public class Beer {
      String name;
      float abv;
      float ibu;
      float srm;
      int upc;
      String type;
      String brewery_id;
      String updated;
      String description;
      String style;
      String category;
    }

Next define a view on the data bucket beer-sample with the design document as
beer and the view name as by\_name as below.


    `javascript
    function (doc) {
      if (doc.type && doc.type == "beer" && doc.name) {
         emit(doc.name, doc.id);
      }
    }

The following code snippet will read a document using the view that was just
created where the name of the beer is "Wrath".


    `javascript
    View view = c.getView("beer", "by_name");

          if (view == null) {
              System.err.println("View is null");
              System.exit(0);
           }

           Query query = new Query();

           // Set the key for the query based on beer name

           query.setKey("Wrath");

           query.setStale(Stale.FALSE);
           query.setIncludeDocs(true);
           query.setDescending(false);

           ViewResponse result = c.query(view, query);

           Iterator<ViewRow> itr = result.iterator();

           ViewRow row;

           row = itr.next();

           if (row != null) {
             System.out.println(String.format("Id is: %s",
                      row.getId()));
             System.out.println(String.format("Key is: %s",
                      row.getKey()));
             System.out.println(String.format("Document is: %s",
                      row.getDocument()));
           }

           Beer beerEntry = gson.fromJson( (String) row.getDocument(), Beer.class);

The following code snippet will create a document where the name of the beer is
"Wrath\_MAX" and we will inherit the same values that we read earlier. These
values can be changed, as we shall see later.

We use the UUID class to generate a UUID and use a subset of that as a key. We
could also use the beer name for the key if it is unique such as
*beer\_Wrath\_MAX*.


    `javascript
    Beer beerEntry = gson.fromJson( (String) row.getDocument(), Beer.class);

           beerEntry.name = String.format("%s_MAX", beerEntry.name);

           // Create a new key
           UUID idOne = UUID.randomUUID();

           String beerId = new StringBuffer(idOne.toString()).substring(24, 36);

           c.add(beerId, 0, gson.toJson(beerEntry));

In the following code snippet, we will update the abv of the document and store
it back as below.


    `javascript
    beerEntry.abv = 10.0f;

           c.replace(beerId, 0, gson.toJson(beerEntry));

Finally we delete the document that was just added as below.


    `javascript
    c.delete(beerId);

The *fromJson* and *toJson* methods in the Gson libraries handle the mapping
between the Java class and JSON and vice versa as shown.

As you can see, it's very straightforward to persist JSON data on the server
using Java. Please refer to the tutorial for a more detailed discussion of using
JSON and how to define views and queries based on the JSON data.

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
Code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip)
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


    `java
    URI server = new URI(addresses);

        ArrayList<URI> serverList = new ArrayList<URI>();

        serverList.add(server);
        CouchbaseClient client = new CouchbaseClient(
            serverList, "default", "");

You can see, from these lines that you'll need to obtain an instance of a
`CouchbaseClient`. There are numerous ways to construct one, but a constructor
that is quite useful involved the `ArrayList` of URIs.


    http://host-or-ip:port/pools

The port you will be connecting to will be the port 8091 which is effectively a
proxy that knows about all of the other servers in the cluster and will provide
quick protocol access. So in the case of this cluster, providing an addresses
string as follows, worked very well:


    `java
    String addresses = "10.0.0.33:8091/pools"

Listing 3 is an abridged excerpt that shows the creation of an
IntegerTranscoder, which is a useful class for converting objects in Couchbase
back to integers when needed. This is for convenience and reduces type casting.
You can then see that a the gets() method is called. This returns a CASValue<T>
of type integer which is useful for checking and setting a value. If the value
is null it means that Couchbase hasn't been given a value for this key. The code
then sets a value. Otherwise, we can get its value and do something with it.

Listing 3. Check And Set operations


    `java
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

Setting values in Couchbase are done asynchronously, and the application does
not have to wait for these to be completed. Sometimes, though, you may want to
ensure that Couchbase has been sent some values, and you can do this by calling
`client.waitForQueues()` and giving it a timeout for waiting for this to occur,
as shown in Listing 4.

Listing 4. Waiting for the data to be set into Couchbase.


    `java
    client.waitForQueues(1, TimeUnit.MINUTES);

<a id="sample-application"></a>

## How to Build and Run the Sample Application

Download [the entire Java Getting Started Source
code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip)
and follow along with the steps.

You can compile and run the program using the following steps.


    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar \
        GettingStarted.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    commons-codec-1.5.jar:httpcore-4.1.1.jar:\
    httpcore-nio-4.1.1.jar GettingStarted http://192.168.3.104:8091/pools 10

Running this program generates the following output the first time:


    Client-2 took 37.2500 ms per key. Created 35. Retrieved 65 from cache.
    Client-3 took 37.7800 ms per key. Created 35. Retrieved 65 from cache.
    Client-4 took 37.7100 ms per key. Created 35. Retrieved 65 from cache.
    Client-0 took 37.8300 ms per key. Created 35. Retrieved 65 from cache.
    Client-1 took 37.8400 ms per key. Created 35. Retrieved 65 from cache.

Running the program a second time before 15 seconds elapses, produces this
output instead:


    Client-1 took 4.6700 ms per key. Created 0. Retrieved 100 from cache.
    Client-3 took 4.6000 ms per key. Created 0. Retrieved 100 from cache.
    Client-4 took 4.7500 ms per key. Created 0. Retrieved 100 from cache.
    Client-2 took 4.7900 ms per key. Created 0. Retrieved 100 from cache.
    Client-0 took 4.8400 ms per key. Created 0. Retrieved 100 from cache.

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

    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar \
        GettingStarted.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    commons-codec-1.5.jar:httpcore-4.1.1.jar:\
    httpcore-nio-4.1.1.jar GettingStarted http://192.168.3.104:8091/pools 10




    `java
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
                            // The value doesn't exist in Couchbase
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

<a id="conclusion"></a>

## Conclusion

You now know how to obtain the Couchbase Java client libraries, and write small
Java programs to connect with your Couchbase cluster and interact with it.
Congratulations, you will be able to save your servers from burning down, and
impress your users with the blazing fast response that your application will be
able to achieve.

<a id="tutorial"></a>

# Tutorial

In order to follow this tutorial the following need to be installed and
functional.

 *  Java SE 6 (or higher) installed

 *  Couchbase server installed and running

 *  Client libraries installed and available in the classpath. Please refer to [for
    installation of the client JAR files and the dependencies and for running
    them.](http://www.couchbase.com/develop/java/current)

<a id="installation"></a>

## Installation

 1.  Download [the Java client libraries for
     Couchbase](http://packages.couchbase.com/clients/java/1.1-dp2/Couchbase-Java-Client-1.1-dp2.zip)

 2.  Download [the entire Java Tutorial Source
     code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip)
     and follow along with the steps.

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and one data
bucket established. If you need to set up these items, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

 *  [Using the Couchbase Web
    Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
    for information on using the Couchbase Administrative Console,

 *  [Couchbase
    CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
    for the command line interface,

 *  [Couchbase REST
    API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
    for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed SDK, you can
compile and run the following basic program.

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

## Connecting with the Couchbase Server

The driver library contains a number of different ways to connect to a Couchbase
server. First, I will begin with a discussion of these methods and then we will
use one of those methods to make the chat room client application connect with
your Couchbase installation.

There are more than one way of connecting with one or more Couchbase servers
from the driver:

 1.  A direct connection can be made by creating an instance of the CouchbaseClient
     object and passing in one or more addresses. For example:


         `java
         URI server = new URI(addresses);
         ArrayList<URI> serverList = new ArrayList<URI>();
         serverList.add(server);
         CouchbaseClient client = new CouchbaseClient(
                 serverList, "default", "");

     It's recommended to provide more than one server address of all the servers
     participating in the Couchbase cluster since the client can recover easily if
     the original server goes down.

 2.  Use the connection factory `CouchbaseConnectionFactory` constructors to
     establish a connection with your server:


         `java
         URI base = new URI(String.format(
             "http://%s:8091/pools", serverAddress));
         ArrayList<URI> serverList = new ArrayList<URI>();
         serverList.add(base);
         CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(serverList,
             "default", "");

 3.  Create a connection that is authenticated using SASL by using a
     `CouchbaseConnectionFactory`. Merely specifying the authenticated bucket will
     establish an authenticated connection. In the case of Couchbase, the username
     and password you use here are based on the buckets you have defined on the
     server. The username is the bucket name, and the password is the password used
     when creating the bucket. I will talk more about this later, in the meantime
     here is the code you will need to authenticate and start using a bucket with
     SASL authentication.


         `java
         CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs,
            "rags", "password");
         client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

Let's start making modifications to the tutorial `Tutorial.java` class in order
to make our first connection. Here we will be making an unauthenticated ASCII
protocol connection to the server. After you have the tutorial code working, you
can easily go back and change the `connect()` method to use authentication.

First you modify your `main()` method as follows:


    `java
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

Next, add the `connect()` method.


    `java
    private void connect(String serverAddress) throws Exception {

            URI base = new URI(String.format("http://%s:8091/pools",serverAddress));
            List<URI> baseURIs = new ArrayList<URI>();
            baseURIs.add(base);
            CouchbaseConnectionFactory cf = new
                    CouchbaseConnectionFactory(baseURIs, "default", "");

            client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

You'll recognize this constructor as a single server connection. What if you
want to know more about the current connection state such as when the connection
has been gained, or lost? You can add a connection observer by modifying the
connect method and adding the following lines:


    `java
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

You've only connected with one server, what if it goes offline? This can easily
be fixed by changing the first three lines of the connect method:


    `java
    URI fallback = new URI(
                String.format("http://%s:8091/pools",fallbackAddress));
            baseURIs.add(fallback);

This class will even work with colon-delimited IPv6 addresses.

Finally, you need to create the static member variable to store the client
instance at the top of the class:


    `java
    private static CouchbaseClient client;

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
[Configuring Logging](#java-api-configuring-logging)

To provide logging via spymemcached:


    `java
    System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");

or


    `java
    System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");

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


    `java
    try {
        connect(serverAddress);

        register();
        unregister();

        client.shutdown(1, TimeUnit.MINUTES);

    } catch (IOException e) {
        e.printStackTrace();
    }

Then add the following two methods to the end of the class:


    `java
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


    `java
    private static long userId = 0;
    private static long userCount = 0;

If you compile and run this program as below, replacing localhost with the
address of the Couchbase server you want to connect to, you will see the
following output:


    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar \
          Tutorial.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar:\
    jettison-1.1.jar:netty-3.3.1.Final.jar:commons-codec-1.5.jar:\
    httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar Tutorial localhost


    Reconnected count: -1
    You are user 1.
    Registration succeeded.
    There are currently 1 connected.
    Enter text, or /who to see user list, or /quit to exit.

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


    `java
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


    `java
    try {
         connect(serverAddress);

         if (register()) {
             unregister();
         }

         client.shutdown(1, TimeUnit.MINUTES);

    } catch (IOException e) {
        e.printStackTrace();
    }

Now, we need to implement the cleanup of the user list when a user leaves. We
will be modifying the `unregister` method to be very careful to remove the
current userId from the CurrentUsers list before finishing. This is a
potentially dangerous operation for a distributed cache since two or more users
may try to exit the application at the same time and may try to replace the user
list overwriting the previous changes. We will use a trick that effectively
forces a distributed critical section.


    `java
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


    `java
    private static Thread messageThread;

Next, modify the `main` method again to add the following lines in bold:


    `java
    if (register()) {
        startMessageThread();
        processInput();
        unregister();
        messageThread.interrupt();
    }

Now we will need to write a few helper methods, the first is:


    `java
    private static void printMessages(long startId, long endId) {

        for (long i = startId; i <= endId; i++) {
            String message = (String)client.get("Message:" + i);
            if (message != null)
                System.out.println(message);
        }

    }

This method just iterates through a set of message numbers and prints the
message to the screen. Couchbase does not allow iteration of keys, but that's
alright, we know exactly what pattern the key names follow, so we can do this.

The second method helps to find the oldest message that hasn't expired in the
cache, starting at the last message and running back toward the first message.
Eventually it will find the first message and will return its number,
considering that it will have run one past the end, it needs to do a little
fix-up to return the correct number.


    `java
    private static long findFirstMessage(long currentId) {
        CASValue<Object> cas = null;
        long firstId = currentId;
        do {
            firstId -= 1;
            cas = client.gets("Message:" + firstId);
        } while (cas != null);

        return firstId + 1;
    }

Finally we come to the method that prints out all of the messages as they come
in. It's somewhat complicated so I'll describe it in detail afterward.


    `java
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


    `java
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

Here it is important to convert the doc.date field to a string in order that the
`query.setRange` method will work, as it can only operate on strings at the time
this was written.


![](images/fig01-bucket-creation.png)

Figure 1 shows the dialog in the Couchbase Web Console that demonstrates
creating a new bucket called private with two replicas. Here you also choose a
password to protect the bucket during SASL authentication. How do you access
this bucket? You have already learned about how to make a SASL authenticated
connection to Couchbase, if you use the bucket name as the username, and the
password you provided when creating the bucket, you will connect to the private
bucket for data storage. The following code would accomplish this:


    `java
    // We have used private as the username and private as the password
    // but you would not do this, you would be much smarter and use
    // something much harder to guess.
        CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs,
           "private", "private");
         client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

<a id="error-handling"></a>

## Error Handling

At this point, you may still be wondering how CAS values are used to prevent
clients from writing over values that were changed by another client.

In essence, the CAS value exists so that that a client can 'hold' the CAS value
for a item ID that it knows, and only update the item if the CAS has not
changed. Hence, Check And Set (CAS). In a multi-client environment it is
designed to prevent one client changing the value of an item when another client
may have already updated it.

Unfortunately there's no way to lock items; individual operations (set, for
example) are atomic, but multiple operations are not, and this is what CAS is
designed to protect against. To stop you changing a value that has changed since
the last GET.

In order to demonstrate this situation, add the bold lines to the `processInput`
method to allow a way to perform a CAS operation and see what happens if two of
these operations is interleaved if two copies of the program are run at the same
time.


    `java
    } else if (input.startsWith("/who")) {
        System.out.println("Users connected: "
                + client.get("CurrentUsers"));
    } else if (input.startsWith("/cas")) {
        runCasTest();
    } else {

Now create the `runCasTest()` method at the bottom of the class:


    `java
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

The first time the test is run (by typing "/cas" while the application is
running) the `gets()` method will return null so it will just set the `CasTest`
key to "InitialValue" and return. The second time the test is run it will get a
`CASValue<Object>` instance from the `gets()` method, print out its value, and
then sleep for 10 seconds. Then after sleeping the code performs a
`client.cas()` method call to replace the value.

If you run this in two different windows you may see output something like the
following if you time things just right:


    /cas
    /cas
    Testing a CAS operation.
    CAS for CasTest = 2637312854241
    Sleeping for 10 seconds.
    OK response.
    CAS after = 2850841875395

In the second copy of the application, the output would look something like
this:


    Testing a CAS operation.
    CAS for CasTest = 2637312854241
    Sleeping for 10 seconds.
    EXISTS response.
    CAS after = 2850841875395

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

One of the newest features of Couchbase SDKs and spymemcached libraries is the
support for communicating intelligently with the Couchbase Server cluster. The
smart client support allows the SDK to automatically connect to the data stored
within the cluster by directly communicating with the right node in the cluster.
This ability also allows for clients to continue to operate during failover and
rebalancing operations.

All you need to start using this functionality is to use a new `Couchbase`
constructor that allows you to pass in a list of base URIs, and the bucket name
and password as we did in the `connect()` method earlier.


    `java
    try {
        URI server = new URI(addresses);
        ArrayList<URI> serverList = new ArrayList<URI>();
        serverList.add(server);
        CouchbaseClient client = new CouchbaseClient(
                serverList, "rags", "password");
    } catch (Throwable ex) {
        ex.printStackTrace();
    }

Compile and run the application:


    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar Tutorial.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar:\
    commons-codec-1.5.jar Tutorial 192.168.3.104

Replace serverhost with the name or IP address of your server, you won't need
the port this time. You will see something like the following output:


    Jan 17, 2012 12:11:43 PM net.spy.memcached.MemcachedConnection createConnections
    INFO: Added {QA sa=/192.168.3.111:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    Jan 17, 2012 12:11:43 PM net.spy.memcached.MemcachedConnection handleIO
    INFO: Connection state changed for sun.nio.ch.SelectionKeyImpl@2abe0e27
    Jan 17, 2012 12:11:43 PM net.spy.memcached.auth.AuthThread$1 receivedStatus
    INFO: Authenticated to /192.168.3.111:11210

You can see that it connects to the server and automatically loads the list of
all Couchbase servers, connects to them and authenticates. It uses the vbucket
algorithm automatically, and no code changes to the application will be
required.

<a id="complete-tutorial-code"></a>

## The Tutorial Example Code

The Complete code for the tutorial is below and you would compile and run it
with the command line arguments as below ensuring that the client libraries and
dependencies are included in the Java classpath.


    shell> javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar Tutorial.java
    shell> java -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar:\
    commons-codec-1.5.jar Tutorial 192.168.3.104


    `java
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

Congratulations, you have completed the Couchbase portion of this tutorial. You
can download [the entire Java Tutorial Source
code](http://www.couchbase.com/docs/examples/couchbase-javaclient-examples-1.1-dp2.zip)
and follow along with the steps.

<a id="couchbase-views"></a>

## Adding Couchbase Views into the Chat Room

Couchbase Server 2.0 combines the speed and flexibility of Couchbase databases
with the powerful JSON document database technology of CouchDB into a new
product that is easy to use and provides powerful query capabilities such as
map-reduce. With Couchbase Server 2.0 you are able to keep using all of the
Couchbase code you already have, and upgrade certain parts of it to use JSON
documents without any hassles. In doing this, you can easily add the power of
Views and querying those views to your applications.

For more information on Views, how they operate, and how to write effective
map/reduce queries, see [Couchbase Server 2.0:
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

Let's get started making modifications to the code you've written for the
Couchbase portion of the tutorial, and quickly get it modified to connect with a
Couchbase Server 2.0, and finally replace much of the old message queries with a
View query.

Now you are ready to start using the new API to connect with your Couchbase
Server 2.0. Let's begin to modify the Tutorial.java code in order to replace the
Message database records with JSON and change the way the list of messages is
queried.

The operation of the code will not change in any visible ways. Information will
be stored and retrieved as they were before. The main different is that all of
the information will actually be stored in JSON format. If the client sends
invalid JSON to the database, the database will automatically store these as
attachments, and read them back from these attachments later.

What you need to do now, however, is start using JSON to send documents to and
from the database. That's where the real power of the system lies. We will
create a very simple class to store messages into the database, and then modify
the old code to send and receive JSON instead. Add a new class, called
Message.java into the same folder as Tutorial.java with the code as follows:


    `java
    public class Message {
        public String userId;
        public String message;
        public String type = "Message";
        public long date;

        public Message(String userId, String message) {
            super();
            this.userId = userId;
            this.message = message;
            date = System.currentTimeMillis();
        }
    }

There's really no need to go the extra mile and make this follow the full Java
Bean pattern with getters and setters. It will work fine this way.

Now that the data class is written, edit the `processInput()` method and change
the final else block to read:


    `java
    } else {
              // Send a new message to the chat
              long messageId =
              client.incr("Messages", 1, 1);
              String json = new Gson().toJson(new
                  Message(getUserNameToken(), input)); client.set("Message:" +
                      messageId, 3600, json); }

That code will serialize a new `Message` object into a JSON string and then save
it with a key of Message:\# in the database with an expiry time of one hour. Now
let's add the message query handling. This is the fun part, where you get to
delete a few methods that were used to work around the lack of query
capabilities in Couchbase. Be bold. Delete the entire `printMessages` method and
`findFirstMessage` methods. You won't need them anymore.

Rewrite the `startMessageThread` method to read as follows:


    `java
    /**
     * Start up the message display thread.
     */
    private void startMessageThread() {

        messageThread = new Thread(new Runnable() {
            public void run() {

                long lastMessageSeen = 0;

                try {

                    while (!Thread.interrupted()) {

                        Query query = new Query();

                        query.setRange(String.valueOf(lastMessageSeen),
                            String.valueOf(currentTime));
                        query.setReduce(false);
                        query.setIncludeDocs(true);
                        query.setStale(Stale.FALSE);

                        View view = client.getView("chat", "messages");

                        if (view == null) {
                            System.err.println("View is null");
                            continue;
                        }

                        long currentTime = System.currentTimeMillis();

                        ViewResponse result = client.query(view, query);
                        ViewRow row;

                        Iterator<ViewRow> itr = result.iterator();

                        while(itr.hasNext()) {
                            row = itr.next();
                            String doc = (String)row.getDocument();
                            Message message = new Gson().fromJson(doc, Message.class);

                            System.out.println(String.format("%s: %s [%tc]",
                                message.userId, message.message,
                                new Date(message.date)));

                            // Remember the last message seen date.
                            lastMessageSeen = message.date + 1;
                        }
                        query.setReduce(true);

                        result = client.query(view, query);

                        itr = result.iterator();

                        while (itr.hasNext()) {
                          row = itr.next();

                          System.out.println("Total Messages: " + row.getValue());
                        }

                        Thread.sleep(2000);
                    }

                } catch (InterruptedException ex) {
                } catch (RuntimeException ex) {
                }
                System.out.println("Stopped message thread.");
            }
        });

        messageThread.start();

    }

This thread loops every 2 seconds, and keeps track of the last message date that
was seen previously. The Query object is created and the respective parameters
are set. You will be writing this view shortly. The Query object is created that
provides some filter parameters. In this case we want to restrict the keys
coming back from the query to be within the range of dates that we haven't seen
yet.

It uses the new `getView()` API method to retrieve a view from the 'chat' design
document, called 'messages'.

The query is then executed using the `client.query()` method which takes the
view and the query and performs the query synchronously. Once the result is
collected successfully, we can then iterate through the rows and obtain the
documents referred to and deserialize them into `Message` objects once again. It
really couldn't be much easier than that. At the end of this, we keep track of
where we left off by `assigning message.date + 1` to `lastMessageSeen` variable,
and then sleeping for two seconds.

The query is finally executed using the `query.setReduce(true)` method which
takes the view and the query and provides access to the Reduce result. Once the
result is collected successfully, we use the first row to get a count of the
messages.

Wait, we haven't written the view yet. Go to the Couchbase Server 2.0 console
application and log in. Choose the Views tab on the top, and click the
'Development Views' button and hit the Create View... button on the right hand
side.

You will be presented with the dialog in figure 2. Enter 'chat' for the design
document name, and 'messages' for the view name.


![](images/fig02-create-view.png)

Next, enter the Javascript code for the view as shown in figure 3, and hit the
Save button on the top right.


![](images/fig03-messages-view.png)

Here it is important to convert the doc.date field to a string in order that the
`query.setRange` method will work, as it can only operate on strings at the time
this was written.


![](images/fig04-create-reduce.png)

The code is very simple, and demonstrates a simple reduce function, but it's
enough to select the messages in the database and count them.

Run the application and add some messages, and you should see them displayed on
the screen every two seconds. What's happening here? The application will query
views that are in development mode by default. You can change this by setting
the property on the command line using


    -Dviewmode=production

or


    -Dviewmode=development

That way, once you publish your development views to production you can use
those views in the application without having to run though the code and change
all of the design document names.

If you try running the application now, replacing the localhost with the address
of the Couchbase database you want to connect to, you will see something like
the following:


    $ javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar \
          TutorialViews.java
    $ java -Dviewmode=development -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar:\
    commons-codec-1.5.jar:gson-2.1.jar TutorialViews localhost


    Mar 14, 2012 7:03:31 PM net.spy.memcached.MemcachedConnection createConnections
    INFO: Added {QA sa=/127.0.0.1:11210, #Rops=0, #Wops=0, #iq=0, topRop=null, topWop=null, toWrite=0, interested=0} to connect queue
    Mar 14, 2012 7:03:32 PM net.spy.memcached.MemcachedConnection handleIO
    INFO: Connection state changed for sun.nio.ch.SelectionKeyImpl@1bbb60c3
    Mar 14, 2012 7:03:32 PM com.couchbase.client.CouchbaseConnection createConnections
    INFO: Added localhost/127.0.0.1:11210 to connect queue
    Mar 14, 2012 7:03:32 PM com.couchbase.client.CouchbaseClient <init>
    INFO: viewmode set to development mode
    Mar 14, 2012 7:03:32 PM com.couchbase.client.ViewConnection createConnections
    INFO: Added localhost/127.0.0.1:8092 to connect queue
    Mar 14, 2012 7:03:32 PM net.spy.memcached.auth.AuthThread$1 receivedStatus
    INFO: Authenticated to localhost/127.0.0.1:11210
    Connection established with localhost/127.0.0.1:11210
    When in danger, when in doubt, run in circles, scream and shout!
    &lt;User-33&gt;: When in danger, when in doubt, run in circles, scream and shout!
    Sage advice!
    &lt;User-33&gt;: Sage advice!

<a id="complete-tutorial-code-with-views"></a>

## The Tutorial Example Code including Views

The Complete code for the tutorial including views is below and you would
compile and run it with the command line arguments as below ensuring that the
client libraries and dependencies are included in the Java classpath.


    $ javac -cp couchbase-client-1.1-dp2.jar:spymemcached-2.8.4.jar:\
    gson-2.1.jar Message.java TutorialViews.java
    $ java -Dviewmode=development -cp .:couchbase-client-1.1-dp2.jar:\
    spymemcached-2.8.4.jar:jettison-1.1.jar:netty-3.3.1.Final.jar:\
    httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar:\
    commons-codec-1.5.jar:gson-2.1.jar TutorialViews 192.168.3.104


    `java
    public class Message {
        public String userId;
        public String message;
        public String type = "Message";
        public long date;

        public Message(String userId, String message) {
            super();
            this.userId = userId;
            this.message = message;
            date = System.currentTimeMillis();
        }
    }

and the listing for TutorialViews.java is below.


    `java
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
    import net.spy.memcached.MemcachedClient;
    import net.spy.memcached.tapmessage.ResponseMessage;
    import net.spy.memcached.transcoders.SerializingTranscoder;
    import net.spy.memcached.transcoders.Transcoder;

    import com.couchbase.client.CouchbaseClient;
    import com.couchbase.client.CouchbaseConnectionFactory;
    import com.couchbase.client.internal.ViewFuture;
    import com.couchbase.client.protocol.views.Query;
    import com.couchbase.client.protocol.views.Stale;
    import com.couchbase.client.protocol.views.View;
    import com.couchbase.client.protocol.views.ViewResponse;
    import com.couchbase.client.protocol.views.ViewResponseWithDocs;
    import com.couchbase.client.protocol.views.ViewRow;
    import com.google.gson.Gson;
    import java.util.Date;
    import java.util.Iterator;

    public class TutorialViews {

      private static CouchbaseClient client;
      private long userId = 0;
      private long userCount = 0;
      private Thread messageThread;

      /**
       * Main Program for a Couchbase chat room application using
       * the spymemcached driver library.
       */
      public static void main(String[] args) {

        if (args.length != 1) {
          System.err.println("usage: serveraddress");
          System.exit(1);
        }

        try {

          new TutorialViews().run(args[0]);

        } catch (Exception ex) {
          System.err.println(ex);
          client.shutdown();
        }
      }

      public void run(String serverAddress) throws Exception {

        System.setProperty("net.spy.log.LoggerImpl",
                "net.spy.memcached.compat.log.SunLogger");

        System.out.println(String.format("Connecting to %s", serverAddress));

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

        URI base = new URI(String.format("http://%s:8091/pools", serverAddress));
        List<URI> baseURIs = new ArrayList<URI>();
        baseURIs.add(base);
        CouchbaseConnectionFactory cf = new CouchbaseConnectionFactory(baseURIs,
           "rags", "");

        client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

        // client = new CouchbaseClient(baseURIs, "private", "private", "private");

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
          return (String) delegate.decode(d);
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
          String message = (String) client.get("Message:" + i);
          if (message != null) {
            System.out.println(message);
          }
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

          @Override
          public void run() {

            long lastMessageSeen = 0;

            try {


              while (!Thread.interrupted()) {

                long currentTime = System.currentTimeMillis();

                Query query = new Query();

                query.setRange(String.valueOf(lastMessageSeen),
                    String.valueOf(currentTime));
                query.setReduce(false);
                query.setIncludeDocs(true);
                query.setStale(Stale.FALSE);

                View view = client.getView("chat", "messages");

                if (view == null) {
                  System.err.println("View is null");
                  continue;
                }

                ViewResponse result = client.query(view, query);

                Iterator<ViewRow> itr = result.iterator();
                ViewRow row;

                while (itr.hasNext()) {
                  row = itr.next();
                  String doc = (String) row.getDocument();
                  Message message = new Gson().fromJson(doc, Message.class);

                  System.out.println(String.format("%s: %s [%tc]", message.userId,
                          message.message, new Date(message.date)));
                              // Remember the last message seen date.
                  lastMessageSeen = message.date + 1;

                }

                query.setReduce(true);

                result = client.query(view, query);

                itr = result.iterator();

                while (itr.hasNext()) {
                  row = itr.next();

                  System.out.println("Total Messages: " + row.getValue());
                }

                Thread.sleep(2000);
              }

            } catch (InterruptedException ex) {
            } catch (RuntimeException ex) {
              ex.printStackTrace();
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

        System.out.println("Enter text, or /who to see user list, or /quit to exit.");

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
              // Write out in JSON
              String json = new Gson().toJson(new
                      Message(getUserNameToken(), input));
              client.set("Message:" + messageId, 3600, json);
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

        System.out.println("CAS for CasTest = " + cas.getCas());
        System.out.println("Sleeping for 10 seconds.");
        try {
          Thread.sleep(10000);
        } catch (InterruptedException e) {
        }

        CASResponse response =
                client.cas("CasTest", cas.getCas(), "ReplacedValue");
        if (response.equals(CASResponse.OK)) {
          System.out.println("OK response.");
        } else if (response.equals(CASResponse.EXISTS)) {
          System.out.println("EXISTS response.");
        } else if (response.equals(CASResponse.NOT_FOUND)) {
          System.out.println("NOT_FOUND response.");
        }

        cas = client.gets("CasTest");
        System.err.println("CAS after = " + cas.getCas());
      }
    }

As you can see, it is very easy to begin using Views with the `CouchbaseClient`.

<a id="api-reference-started"></a>

# Using the APIs

The Client libraries provides an interface to both Couchbase and Memcached
clients using a consistent interface. The interface between your Java
application and your Couchbase or Memcached servers is provided through the
instantiation of a single object class, `CouchbaseClient`.

Creating a new object based on this class opens the connection to each
configured server and handles all the communication with the server(s) when
setting, retrieving and updating values. A number of different methods are
available for creating the object specifying the connection address and methods.

<a id="couchbase-sdk-java-started-connection-bucket"></a>

## Connecting to a Couchbase Bucket

You can connect to specific Couchbase buckets (in place of using the default
bucket, or a hostname/port combination configured on the Couchbase cluster) by
using the Couchbase `URI` for one or more Couchbase nodes, and specifying the
bucket name and password (if required) when creating the new `CouchbaseClient`
object.

For example, to connect to the local host and the `default` bucket:


    `java
    List<URI> uris = new LinkedList<URI>();

        uris.add(URI.create("http://127.0.0.1:8091/pools"));
        try {
          client = new CouchbaseClient(uris, "default", "");
        } catch (Exception e) {
          System.err.println("Error connecting to Couchbase: " + e.getMessage());
          System.exit(0);
        }

The format of this constructor is:


    `java
    CouchbaseClient(URIs,BUCKETNAME,BUCKETPASSWORD)

Where:

 *  `URIS` is a `List` of URIs to the Couchbase nodes. The format of the URI is the
    hostname, port and path `/pools`.

 *  `BUCKETNAME` is the name of the bucket on the cluster that you want to use.
    Specified as a `String`.

 *  `BUCKETPASSWORD` is the password for this bucket. Specified as a `String`.

The returned `CouchbaseClient` object can be used as with any other
`CouchbaseClient` object.

<a id="couchbase-sdk-java-started-connection-sasl"></a>

## Connecting using Hostname and Port with SASL

If you want to use SASL to provide secure connectivity to your Couchbase server
then you could create a `CouchbaseConnectionFactory` that defines the SASL
connection type, userbucket and password.

The connection to Couchbase uses the underlying protocol for SASL. This is
similar to the earlier example except that we use the
`CouchbaseConnectionFactory`.


    `java
    List<URI> baseURIs = new ArrayList<URI>();
            baseURIs.add(base);
            CouchbaseConnectionFactory cf = new
                    CouchbaseConnectionFactory(baseURIs,
                        "userbucket", "password");

            client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

<a id="couchbase-sdk-ccfb"></a>

## Setting runtime Parameters for the CouchbaseConnectionFactoryBuilder

A final approach to creating the connection is using the
`CouchbaseConnectionFactoryBuilder` and `CouchbaseConnectionFactory` classes.

It's possible to ovverride some of the default paramters that are defined in the
`CouchbaseConnectionFactoryBuilder` for a variety of reasons and customize the
connection for the session depending on expected load on the server and
potential network traffic.

For example, in the following program snippet, we instatiate a new
`CouchbaseConnectionFactoryBuilder` and use the `setOpTimeout` method to change
the default value to 10000ms (or 10 secs).

We subsequently use the `buildCouchbaseConnection` specifying the bucket name,
password and an username (which is not being used any more) to get a
`CouchbaseConnectionFactory` object. We then create a `CouchbaseClient` object.


    `java
    List<URI> baseURIs = new ArrayList<URI>();
            baseURIs.add(base);
            CouchbaseConnectionFactoryBuilder cfb = new
                CouchbaseConnectionFactoryBuilder();

            // Ovveride default values on CouchbaseConnectionFactoryBuilder

            // For example - wait up to 10 seconds for an operation to succeed
            cfb.setOpTimeout(10000);

            CouchbaseConnectionFactory cf =
                cfb.buildCouchbaseConnection(baseURIs, "default", "", "");

            client = new CouchbaseClient((CouchbaseConnectionFactory) cf);

For example, the following code snippet will set the OpTimeOut value to 10000
secs. before creating the connection as we saw in the code above.


    `java
    cfb.setOpTimeout(10000);

These parameters can be set at runtime by setting a property on the command line
(such as *-DopTimeout=1000* ) or via properties in a file *cbclient.properties*
in that order of precedence.

The following parameters can be set as summarized in the table below. We provide
the parameter name, a brief description, the default value and why the
particular parameter might need to be modified.

Parameter                   | Description                                                                                      | Default value    | When to Override the default value                                                                                                                                                                                                                         
----------------------------|--------------------------------------------------------------------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`opTimeout`                 | Time in millisecs for an operation to Timeout                                                    | 2500 millisecs.  | You can set this value higher when there is heavy network traffic and timeouts happen frequently.                                                                                                                                                          
`timeoutExceptionThreshold` | Number of operations to timeout before the node is deemed down                                   | 998              | You can set this value lower to deem a node is down earlier.                                                                                                                                                                                               
`readBufSize`               | Read Buffer Size                                                                                 | 16384            | You can set this value higher or lower to optimize the reads.                                                                                                                                                                                              
`opQueueMaxBlockTime`       | The maximum time to block waiting for op queue operations to complete, in milliseconds.          | 10000 millisecs. | The default has been set with the expectation that most requests are interactive and waiting for more than a few seconds is thus more undesirable than failing the request. However, this value could be lowered for operations not to block for this time.
`shouldOptimize`            | Optimize behavior for the network                                                                | False            | You can set this value to be true if the performance should be optimized for the network as in cases where there are some known issues with the network that may be causing adverse effects on applications.                                               
`maxReconnectDelay`         | Maximum number of milliseconds to wait between reconnect attempts.                               | 30000 millisecs. | You can set this value lower when there is intermittent and frequent connection failures.                                                                                                                                                                  
`MinReconnectInterval`      | A default minimum reconnect interval in millisecs.                                               | 1100             | This means that if a reconnect is needed, it won't try to reconnect more frequently than default value. The internal connections take up to 500ms per request. You can set this to higher to try reconnecting less frequently.                             
`obsPollInterval`           | Wait for the specified interval before the Observe operation polls the nodes.                    | 400              | Set this higher or lower depending on whether the polling needs to happen less or more frequently depending on the tolerance limits for the Observe operation as compared to other operations.                                                             
`obsPollMax`                | The maximum times to poll the master and replica(s) to meet the desired durability requirements. | 10               | You could set this value higher if the Observe operations do not complete after the normal polling.                                                                                                                                                        

<a id="couchbase-sdk-java-started-disconnection"></a>

## Shutting down the Connection

The preferred method for closing a connection is to cleanly shutdown the active
connection with a timeout using the `shutdown()` method with an optional timeout
period and unit specification. The following will shutdown the active connection
to all the configured servers after 60 seconds:


    `java
    client.shutdown(60, TimeUnit.SECONDS);

The unit specification relies on the `TimeUnit` object enumerator, which
supports the following values:

Constant                | Description                                                      
------------------------|------------------------------------------------------------------
`TimeUnit.NANOSECONDS`  | Nanoseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s). 
`TimeUnit.MICROSECONDS` | Microseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s).
`TimeUnit.MILLISECONDS` | Milliseconds (10 **Unhandled:** `[:unknown-tag :superscript]` s).
`TimeUnit.SECONDS`      | Seconds.                                                         

The method returns a `boolean` value indicating whether the shutdown request
completed successfully.

You also can shutdown an active connection immediately by using the `shutdown()`
method to your Couchbase object instance. For example:


    `java
    client.shutdown();

In this form the `shutdown()` method returns no value.

<a id="couchbase-sdk-java-started-spring"></a>

## Connecting to Couchbase buckets using Spring Inversion of Control (IoC)

Unlike the approach that we have seen so far when the program explicitly
requests a CouchbaseClient object, the dependency to the Couchbase connection
can be injected at runtime using [Spring's  Inversion of Control
(IoC)](http://static.springsource.org/spring/docs/2.0.x/reference/beans.html).
This permits a looser coupling where the bucket name and other connection
parameters can be specified at runtime.

The Java program to request an instance of the CouchbaseClient that will be
injected at runtime looks like below.


    `java
    public class Main {
      public static void main(String[] args) throws
          URISyntaxException, IOException {

          // Request the CouchbaseClient dynamically

          BeanFactory beanFactory =
                new ClassPathXmlApplicationContext(
                    "cbConnect.xml");

          CouchbaseClient c =
                  (CouchbaseClient) beanFactory.getBean("couchbaseClient");

          c.set("key", 0, "Hello Couchbase using Spring");

          System.out.println(c.get("key"));

          c.shutdown(3, TimeUnit.SECONDS);
      }
    }

The Spring JAR files will have to be included in the CLASSPATH in addition to
the XML configuration file. This program has been tested with Spring 3.2.0.M2
release.

We explicity request a CouchbaseClient at runtime as specified in a
configuration XML file as shown below.

The XML configuration file, cbConnect.xml which is used to inject the Couchbase
client dependency at runtime looks something along the lines of below.


    `xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.springframework.org/schema/beans
             http://www.springframework.org/schema/beans/spring-beans-2.5.xsd">

      <bean name="couchbaseClient" class="com.couchbase.client.CouchbaseClient">

      <!-- CouchbaseClient three arguments.
           URL list, bucket name and bucket password. -->
                <constructor-arg>
                    <list>
                        <bean id="url1" class="java.net.URI" >
                                <constructor-arg>
                                    <value>http://10.3.121.48:8091/pools</value>
                                </constructor-arg>
                        </bean>
                    </list>
                </constructor-arg>
                <constructor-arg value="default"/>
                <constructor-arg value=""/>
      </bean>
    </beans>

The XML configuration file specifies the Spring Framework namespace and
additional namespaces for the purpose of injecting the bean, which in this case
is the fully qualified CouchbaseClient class. The parameters to the constructor
are also specified in the file, which include the list of URIs, the name of the
bucket and the associated password.

Likewise, to use the CouchbaseConnectionFactoryBuilder class, the following XML
application snippet can be used.


    `xml
    <!-- Configuration for Couchbase configuration beans -->
      <bean name="couchbasecfb" class="com.couchbase.client.CouchbaseConnectionFactoryBuilder">
      </bean>

The following Java code snippet illustrates how the bean is instantiated at
runtime using the name of the bean that was specified in the XML file.


    `java
    CouchbaseConnectionFactoryBuilder cfb = (CouchbaseConnectionFactoryBuilder)
                beanFactory.getBean("couchbasecfb");

        CouchbaseClient c = new
                  CouchbaseClient(cfb.buildCouchbaseConnection(baseURIs,
                      "beer-sample", "", ""));

The parameters for the connection can be specified either via the command line
parameters or the file *cbclient.properties* included in the classpath as
illustrated earlier.

<a id="couchbase-cache-apis"></a>

## Using Spring Cache APIs with Couchbase

The Spring framework provides interfaces for Caching via the CacheManager and
Cache interfaces. These interfaces are implemented by the Couchbase client
library. A program that already uses the Spring framework can use the
CouchbaseCacheManager and CouchbaseCache objects to use Couchbase as a backing
store and leverage the Spring framework Cache APIs.

The first step would be to instantiate a CouchbaseCacheManager as below and a
List of CouchbaseCache to be used in conjunction with the manager.


    `java
    CouchbaseCacheManager cacheManager = new CouchbaseCacheManager();
         List<CouchbaseCache> cacheList = new ArrayList<CouchbaseCache>();

The next step would be to instatiate a CouchbaseCache class and populate the
cache. Please note that the bucket will be removed of all its existing data. So,
it is strongly recommended to map a Spring Cache to a new and unique bucket.
This will also prevent name collisions since it's possible to have same key
names in multiple Spring caches.

Next, we add the Cache to the Cache List.


    `java
    CouchbaseCache statesCache = new
                CouchbaseCache("statesCache",
                baseURIs, "Rags1R", "");
        statesCache.put("MA", "MA");
        statesCache.put("NH", "NH");
        statesCache.put("ME", "ME");

        cacheList.add(statesCache);

Additionally, since Couchbase keys can only be String with some restrictions,
the keys for Spring will be Stringifyed before they are persisted in Couchbase.
It's recommended to use Strings for keys when using Couchbase.

Once the list of Caches is complete, call the setCaches() and the
afterPropertiesSet() methods on the Cache Manager as below.


    `java
    Collection<CouchbaseCache> cacheCollection = cacheList;
        cacheManager.setCaches(cacheCollection);
        cacheManager.afterPropertiesSet();

Now the Cache is ready for use in the Spring framework.

A sample code for working with the Spring framework Cache is included below.


    `java
    Collection<CouchbaseCache> cacheCollection = cacheList;
        cacheManager.setCaches(cacheCollection);
        cacheManager.afterPropertiesSet();

The following complete Java code illustrates how to use the classes and the
methods such as put(), get(), evict() and clear() which populates the cache,
retrieves the value of a key from a cache, evicts a key from a cache and clears
the cache respectively.


    `java
    import com.couchbase.springframework.CouchbaseCache;
    import com.couchbase.springframework.CouchbaseCacheManager;

    import java.io.IOException;
    import java.net.URI;
    import java.net.URISyntaxException;
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.Collection;
    import java.util.HashSet;
    import java.util.List;

    public class Main {

        public static void main(String[] args) throws
                URISyntaxException, IOException {

            CouchbaseCacheManager cacheManager = new CouchbaseCacheManager();

            List<CouchbaseCache> cacheList = new ArrayList<CouchbaseCache>();

            List baseURIs = new ArrayList<URI>();

            if (args.length != 1) {
                System.err.println("usage: server_address");
                System.exit(1);
            }

            baseURIs.add(new URI(String.format("http://%s:8091/pools",
                args[0])));

            CouchbaseCache colorsCache = new
                CouchbaseCache("colorsCache",
                baseURIs, "Rags0R", "");
            colorsCache.put("RED", "Red");
            colorsCache.put("GREEN", "Green");
            colorsCache.put("BLUE", "Blue");

            cacheList.add(colorsCache);

            CouchbaseCache statesCache = new
                CouchbaseCache("statesCache",
                baseURIs, "Rags1R", "");
            statesCache.put("MA", "MA");
            statesCache.put("NH", "NH");
            statesCache.put("ME", "ME");

            cacheList.add(statesCache);

            CouchbaseCache numCache = new
                CouchbaseCache("numCache",
                baseURIs, "Rags2R", "");
            numCache.put("evenNumbers", new
                    HashSet<Integer>(Arrays.asList(0, 2, 4, 6, 8)));
            numCache.put("oddNumbers", new
                    HashSet<Integer>(Arrays.asList(1, 3, 5, 7, 9)));
            numCache.put("fibonacciNumbers", new
                    HashSet<Integer>(Arrays.asList(1, 1, 2, 3, 5, 8, 13)));
            cacheList.add(numCache);

            CouchbaseCache arrayCache = new
                CouchbaseCache( "arrayCache",
                baseURIs, "Rags3R", "");
            Integer[] integerArray = new Integer[3];
            integerArray[0] = 2;
            integerArray[1] = 3;
            integerArray[2] = 4;
            arrayCache.put("intArray", integerArray);
            cacheList.add(arrayCache);

            Collection<CouchbaseCache> cacheCollection = cacheList;
            cacheManager.setCaches(cacheCollection);
            cacheManager.afterPropertiesSet();

            printCacheNames(cacheManager);
            printCache(cacheManager);
            System.out.println("Evicting fibonacciNumbers and printing");
            cacheManager.getCache("numCache").evict("fibonacciNumbers");
            printCache(cacheManager);
            System.out.println("clearing numCache and printing");
            cacheManager.getCache("numCache").clear();
            printCache(cacheManager);
            System.exit(0);
        }

        private static void printCacheNames(CouchbaseCacheManager cacheManager) {
            for (String cacheName : cacheManager.getCacheNames()) {
                System.out.println("Cache name is " + cacheName);
            }
        }

        private static void printCache(CouchbaseCacheManager cacheManager) {
            System.out.println("Value of 'MA' from 'statesCache' is "
                + cacheManager.getCache("statesCache").get("MA").get());
            System.out.println("Value of 'NH' from 'statesCache' is "
                + cacheManager.getCache("statesCache").get("NH").get());
            System.out.println("Value of 'XX' from 'statesCache' is "
                + cacheManager.getCache("statesCache").get("XX").get());

            System.out.println("Value of 'oddNumbers' "
                + "from 'numCache' is "
                + cacheManager.getCache("numCache")
                .get("oddNumbers").get());

            System.out.println("Value of 'fibonacciNumbers' "
                + "from 'numCache' is "
                + cacheManager.getCache("numCache")
                .get("fibonacciNumbers").get());

            Integer[] intArray;
            intArray = (Integer [])
                    cacheManager.getCache("arrayCache").get("intArray").get();
            System.out.println("Value of 'arrays' from 'arrayCache' is "
                + intArray[0] + " " +  intArray[1] + " " + intArray[2]);
        }
    }

You can compile the program and run it as shown below.


    javac -cp spring-beans-3.2.0.M2.jar:spring-context-3.2.0.M2.jar:spring-core-3.2.0.M2.jar:couchbase-client-1.1.2c.jar:spymemcached-2.8.7.jar:. Main.java


    java -cp spring-beans-3.2.0.M2.jar:spring-context-3.2.0.M2.jar:spring-core-3.2.0.M2.jar:spring-context-support-3.2.0.M2.jar:spring-expression-3.2.0.M2.jar:commons-logging-1.1.1.jar:couchbase-client-1.1.2c.jar:httpcore-4.1.1.jar:httpcore-nio-4.1.1.jar:jettison-1.1.jar:netty-3.5.5.Final.jar:commons-codec-1.5.jar:spymemcached-2.8.7-SNAPSHOT.jar:. com.couchbase.client.test.CouchbaseCacheTest 10.3.121.48

    Cache name is colorsCache
    Cache name is statesCache
    Cache name is numCache
    Cache name is arrayCache
    Value of 'MA' from 'statesCache' is MA
    Value of 'NH' from 'statesCache' is NH
    Value of 'XX' from 'statesCache' is null
    Value of 'oddNumbers' from 'numCache' is [1, 3, 5, 7, 9]
    Value of 'fibonacciNumbers' from 'numCache' is [1, 2, 3, 5, 8, 13]
    Value of 'arrays' from 'arrayCache' is 2 3 4
    Evicting fibonacciNumbers and printing
    Value of 'MA' from 'statesCache' is MA
    Value of 'NH' from 'statesCache' is NH
    Value of 'XX' from 'statesCache' is null
    Value of 'oddNumbers' from 'numCache' is [1, 3, 5, 7, 9]
    Value of 'fibonacciNumbers' from 'numCache' is null
    Value of 'arrays' from 'arrayCache' is 2 3 4
    clearing numCache and printing
    Value of 'MA' from 'statesCache' is MA
    Value of 'NH' from 'statesCache' is NH
    Value of 'XX' from 'statesCache' is null
    Value of 'oddNumbers' from 'numCache' is null
    Value of 'fibonacciNumbers' from 'numCache' is null
    Value of 'arrays' from 'arrayCache' is 2 3 4

This Cache can be used in other programs in the Spring framework in a similar
manner.

<a id="api-reference-summary"></a>

# Java Method Summary

The `couchbase-client` and `spymemcached` libraries support the full suite of
API calls to Couchbase. A summary of the supported methods are listed in
[](#table-couchbase-sdk-java-summary).

<a id="table-couchbase-sdk-java-summary"></a>

Method                                                                                                                       | Title                                                                                                                                        
-----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------
[`client.add(key, expiry, value)`](#table-couchbase-sdk_java_add)                                                            | Add a value with the specified key that does not already exist                                                                               
[`client.add(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_add-transcoder)                                     | Add a value that does not already exist using custom transcoder                                                                              
[`client.append(casunique, key, value)`](#table-couchbase-sdk_java_append)                                                   | Append a value to an existing key                                                                                                            
[`client.append(casunique, key, value, transcoder)`](#table-couchbase-sdk_java_append-transcoder)                            | Append a value to an existing key                                                                                                            
[`client.asyncCAS(key, casunique, value)`](#table-couchbase-sdk_java_asynccas)                                               | Asynchronously compare and set a value                                                                                                       
[`client.asyncCAS(key, casunique, expiry, value, transcoder)`](#table-couchbase-sdk_java_asynccas-expiry-transcoder)         | Asynchronously compare and set a value with custom transcoder and expiry                                                                     
[`client.asyncCAS(key, casunique, value, transcoder)`](#table-couchbase-sdk_java_asynccas-transcoder)                        | Asynchronously compare and set a value with custom transcoder                                                                                
[`client.cas(key, casunique, value)`](#table-couchbase-sdk_java_cas)                                                         | Compare and set                                                                                                                              
[`client.cas(key, casunique, expiry, value, transcoder)`](#table-couchbase-sdk_java_cas-expiry-transcoder)                   | Compare and set with a custom transcoder and expiry                                                                                          
[`client.cas(key, casunique, value, transcoder)`](#table-couchbase-sdk_java_cas-transcoder)                                  | Compare and set with a custom transcoder                                                                                                     
[`client.new CouchbaseClient([ url ] [, urls ] [, username ] [, password ])`](#table-couchbase-sdk_java_new_couchbaseclient) | Create connection to Couchbase Server                                                                                                        
[`client.asyncDecr(key, offset)`](#table-couchbase-sdk_java_asyncdecr)                                                       | Asynchronously decrement the value of an existing key                                                                                        
[`client.decr(key, offset)`](#table-couchbase-sdk_java_decr)                                                                 | Decrement the value of an existing numeric key                                                                                               
[`client.decr(key, offset, default)`](#table-couchbase-sdk_java_decr-default)                                                | Decrement the value of an existing numeric key                                                                                               
[`client.decr(key, offset, default, expiry)`](#table-couchbase-sdk_java_decr-default-expiry)                                 | Decrement the value of an existing numeric key                                                                                               
[`client.delete(key)`](#table-couchbase-sdk_java_delete)                                                                     | Delete the specified key                                                                                                                     
[`client.delete(key, persistto)`](#table-couchbase-sdk_java_delete-persist)                                                  | Delete a value using the specified key and observe it being persisted on master and more node(s).                                            
[`client.delete(key, persistto, replicateto)`](#table-couchbase-sdk_java_delete-replicate)                                   | Delete a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).
[`client.asyncGetAndTouch(key, expiry)`](#table-couchbase-sdk_java_asyncgat)                                                 | Asynchronously get a value and update the expiration time for a given key                                                                    
[`client.asyncGetAndTouch(key, expiry, transcoder)`](#table-couchbase-sdk_java_asyncgat-transcoder)                          | Asynchronously get a value and update the expiration time for a given key using a custom transcoder                                          
[`client.getAndTouch(key, expiry)`](#table-couchbase-sdk_java_gat)                                                           | Get a value and update the expiration time for a given key                                                                                   
[`client.getAndTouch(key, expiry, transcoder)`](#table-couchbase-sdk_java_gat-transcoder)                                    | Get a value and update the expiration time for a given key using a custom transcoder                                                         
[`client.asyncGet(key)`](#table-couchbase-sdk_java_asyncget)                                                                 | Asynchronously get a single key                                                                                                              
[`client.asyncGetBulk(keycollection)`](#table-couchbase-sdk_java_asyncget-bulk)                                              | Asynchronously get multiple keys                                                                                                             
[`client.asyncGetBulk(keyn)`](#table-couchbase-sdk_java_asyncget-bulk-multikeys)                                             | Asynchronously get multiple keys                                                                                                             
[`client.asyncGetBulk(transcoder, keyn)`](#table-couchbase-sdk_java_asyncget-bulk-multikeys-transcoder)                      | Asynchronously get multiple keys using a custom transcoder                                                                                   
[`client.asyncGetBulk(keycollection, transcoder)`](#table-couchbase-sdk_java_asyncget-bulk-transcoder)                       | Asynchronously get multiple keys using a custom transcoder                                                                                   
[`client.asyncGet(key, transcoder)`](#table-couchbase-sdk_java_asyncget-transcoder)                                          | Asynchronously get a single key using a custom transcoder                                                                                    
[`client.get(key)`](#table-couchbase-sdk_java_get)                                                                           | Get a single key                                                                                                                             
[`client.getBulk(keycollection)`](#table-couchbase-sdk_java_get-bulk)                                                        | Get multiple keys                                                                                                                            
[`client.getBulk(keyn)`](#table-couchbase-sdk_java_get-bulk-multikeys)                                                       | Get multiple keys                                                                                                                            
[`client.getBulk(transcoder, keyn)`](#table-couchbase-sdk_java_get-bulk-multikeys-transcoder)                                | Get multiple keys using a custom transcoder                                                                                                  
[`client.getBulk(keycollection, transcoder)`](#table-couchbase-sdk_java_get-bulk-transcoder)                                 | Get multiple keys using a custom transcoder                                                                                                  
[`client.get(key, transcoder)`](#table-couchbase-sdk_java_get-transcoder)                                                    | Get a single key using a custom transcoder                                                                                                   
[`client.asyncGetLock(key [, getl-expiry ])`](#table-couchbase-sdk_java_asyncgetl)                                           | Asynchronously get a lock.                                                                                                                   
[`client.asyncGetLock(key [, getl-expiry ], transcoder)`](#table-couchbase-sdk_java_asyncgetl-transcoder)                    | Asynchronously get a lock with transcoder.                                                                                                   
[`client.getAndLock(key [, getl-expiry ])`](#table-couchbase-sdk_java_get-and-lock)                                          | Get and lock Asynchronously                                                                                                                  
**Couldn't resolve link tag: table-couchbase-sdk\_java\_get-and-lock-transcoder**                                            | Get and lock                                                                                                                                 
[`client.asyncGets(key)`](#table-couchbase-sdk_java_asyncgets)                                                               | Asynchronously get single key value with CAS value                                                                                           
[`client.asyncGets(key, transcoder)`](#table-couchbase-sdk_java_asyncgets-transcoder)                                        | Asynchronously get single key value with CAS value using custom transcoder                                                                   
[`client.gets(key)`](#table-couchbase-sdk_java_gets)                                                                         | Get single key value with CAS value                                                                                                          
[`client.gets(key, transcoder)`](#table-couchbase-sdk_java_gets-transcoder)                                                  | Get single key value with CAS value using custom transcoder                                                                                  
[`client.getView(ddocname, viewname)`](#table-couchbase-sdk_java_getview)                                                    | Create a view object                                                                                                                         
[`client.asyncIncr(key, offset)`](#table-couchbase-sdk_java_asyncincr)                                                       | Asynchronously increment the value of an existing key                                                                                        
[`client.incr(key, offset)`](#table-couchbase-sdk_java_incr)                                                                 | Increment the value of an existing numeric key                                                                                               
[`client.incr(key, offset, default)`](#table-couchbase-sdk_java_incr-default)                                                | Increment the value of an existing numeric key                                                                                               
[`client.incr(key, offset, default, expiry)`](#table-couchbase-sdk_java_incr-default-expiry)                                 | Increment the value of an existing numeric key                                                                                               
[`client.prepend(casunique, key, value)`](#table-couchbase-sdk_java_prepend)                                                 | Prepend a value to an existing key using the default transcoder                                                                              
[`client.prepend(casunique, key, value, transcoder)`](#table-couchbase-sdk_java_prepend-transcoder)                          | Prepend a value to an existing key using a custom transcoder                                                                                 
[`client.query(view, query)`](#table-couchbase-sdk_java_query)                                                               | Query a view                                                                                                                                 
[`Query.new()`](#table-couchbase-sdk_java_query-new)                                                                         | Create a query object                                                                                                                        
[`client.replace(key, expiry, value)`](#table-couchbase-sdk_java_replace)                                                    | Update an existing key with a new value                                                                                                      
[`client.replace(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_replace-transcoder)                             | Update an existing key with a new value using a custom transcoder                                                                            
[`client.set(key, expiry, value)`](#table-couchbase-sdk_java_set)                                                            | Store a value using the specified key                                                                                                        
[`client.set(key, expiry, value, persistto)`](#table-couchbase-sdk_java_set-persist)                                         | Store a value using the specified key and observe it being persisted on master and more node(s).                                             
[`client.set(key, expiry, value, persistto, replicateto)`](#table-couchbase-sdk_java_set-replicate)                          | Store a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s). 
[`client.set(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_set-transcoder)                                     | Store a value using the specified key and a custom transcoder.                                                                               
[`client.getStats()`](#table-couchbase-sdk_java_getstats)                                                                    | Get the statistics from all connections                                                                                                      
[`client.getStats(statname)`](#table-couchbase-sdk_java_getstats-name)                                                       | Get the statistics from all connections                                                                                                      
[`client.touch(key, expiry)`](#table-couchbase-sdk_java_touch)                                                               | Update the expiry time of an item                                                                                                            
[`client.unlock(key, casunique)`](#table-couchbase-sdk_java_unlock)                                                          | Unlock                                                                                                                                       

<a id="couchbase-sdk-java-summary-synchronous"></a>

## Synchronous Method Calls

The Java Client Libraries support the core Couchbase API methods as direct calls
to the Couchbase server through the API call. These direct methods can be used
to provide instant storage, retrieval and updating of Couchbase key/value pairs.

For example, the following fragment stores and retrieves a single key/value
pair:


    `java
    client.set("someKey", 3600, someObject);

    Object myObject = client.get("someKey");

In the example code above, the client `get()` call will wait until a response
has been received from the appropriately configured Couchbase servers before
returning the required value or an exception.

<a id="couchbase-sdk-java-summary-asynchronous"></a>

## Asynchronous Method Calls

In addition, the librares also support a range of asynchronous methods that can
be used to store, update and retrieve values without having to explicitly wait
for a response.

The asynchronous methods use a *Future* object or its appropriate implementation
which is returned by the initial method call for the operation. The
communication with the Couchbase server will be handled by the client libraries
in the background so that the main program loop can continue. You can recover
the status of the operation by using a method to check the status on the
returned Future object. For example, rather than synchronously getting a key, an
asynchronous call might look like this:


    `java
    GetFuture getOp = client.asyncGet("someKey");

This will populate the Future object `GetFuture` with the response from the
server. The Future object class is defined
[here](http://download.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/Future.html?is-external=true).
The primary methods are:

 *  `cancel()`

    Attempts to Cancel the operation if the operation has not already been
    completed.

 *  `get()`

    Waits for the operation to complete. Gets the object returned by the operation
    as if the method was synchronous rather than asynchronous.

 *  `get(timeout, TimeUnit)`

    Gets the object waiting for a maximum time specified by `timeout` and the
    corresponding `TimeUnit`.

 *  `isDone()`

    The operation has been completed successfully.

For example, you can use the timeout method to obtain the value or cancel the
operation:


    `java
    GetFuture getOp = client.asyncGet("someKey");

    Object myObj;

    try {
        myObj = getOp.get(5, TimeUnit.SECONDS);
    } catch(TimeoutException e) {
        getOp.cancel(false);
    }

Alternatively, you can do a blocking wait for the response by using the `get()`
method:


    `java
    Object myObj;

    myObj = getOp.get();

<a id="couchbase-sdk-java-summary-transcoding"></a>

## Object Serialization (Transcoding)

All of the Java client library methods use the default Whalin transcoder that
provides compatilibility with memcached clients for the serialization of objects
from the object type into a byte array used for storage within Couchbase.

You can also use a custom transcoder the serialization of objects. This can be
to serialize objects in a format that is compatible with other languages or
environments.

You can customize the transcoder by implementing a new Transcoder interface and
then using this when storing and retrieving values. The Transcoder will be used
to encode and decode objects into binary strings. All of the methods that store,
retrieve or update information have a version that supports a custom transcoder.

<a id="couchbase-sdk-java-summary-expiry"></a>

## Expiry Values

All values in Couchbase and Memcached can be set with an expiry value. The
expiry value indicates when the item should be expired from the database and can
be set when an item is added or updated.

Within `spymemcached` the expiry value is expressed in the native form of an
integer as per the Memcached protocol specification. The integer value is
expressed as the number of seconds, but the interpretation of the value is
different based on the value itself:

 *  Expiry is less than `30*24*60*60` (30 days)

    The value is interpreted as the number of seconds from the point of storage or
    update.

 *  Expiry is greater than `30*24*60*60`

    The value is interpreted as the number of seconds from the epoch (January 1st,
    1970).

 *  Expiry is 0

    This disables expiry for the item.

For example:


    `java
    client.set("someKey", 3600, someObject);

The value will have an expiry time of 3600 seconds (one hour) from the time the
item was stored.

The statement:


    `java
    client.set("someKey", 1307458800, someObject);

Will set the expiry time as June 7th 2011, 15:00 (UTC).

<a id="api-reference-connection"></a>

# Connection Operations

<a id="table-couchbase-sdk-java-connection-summary"></a>

Method                                                                                                                       | Title                                
-----------------------------------------------------------------------------------------------------------------------------|--------------------------------------
[`client.new CouchbaseClient([ url ] [, urls ] [, username ] [, password ])`](#table-couchbase-sdk_java_new_couchbaseclient) | Create connection to Couchbase Server

<a id="table-couchbase-sdk_java_new_couchbaseclient"></a>

**API Call**        | `client.new CouchbaseClient([ url ] [, urls ] [, username ] [, password ])`                                                                                                                                                                                                                                 
--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**     | Create a connection to Couchbase Server with given parameters, such as node URL. Most SDKs accept a list of possible URL's to avoid an error in case one node is down. After initial connection a Couchbase Client uses node topology provided by Couchbase Server to reconnect after failover or rebalance.
**Returns**         | (none)                                                                                                                                                                                                                                                                                                      
**Arguments**       |                                                                                                                                                                                                                                                                                                             
**String url**      | URL for Couchbase Server Instance, or node.                                                                                                                                                                                                                                                                 
**String urls**     | Linked list containing one or more URLs as strings.                                                                                                                                                                                                                                                         
**String username** | Username for Couchbase bucket.                                                                                                                                                                                                                                                                              
**String password** | Password for Couchbase bucket.                                                                                                                                                                                                                                                                              

<a id="api-reference-set"></a>

# Store Operations

The Couchbase Java Client Library store operations set information within the
Couchbase database. These are distinct from the update operations in that the
key does not have to exist within the Couchbase database before being stored.

<a id="table-couchbase-sdk-java-store-summary"></a>

Method                                                                                              | Title                                                                                                                                       
----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------
[`client.add(key, expiry, value)`](#table-couchbase-sdk_java_add)                                   | Add a value with the specified key that does not already exist                                                                              
[`client.add(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_add-transcoder)            | Add a value that does not already exist using custom transcoder                                                                             
[`client.replace(key, expiry, value)`](#table-couchbase-sdk_java_replace)                           | Update an existing key with a new value                                                                                                     
[`client.replace(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_replace-transcoder)    | Update an existing key with a new value using a custom transcoder                                                                           
[`client.set(key, expiry, value)`](#table-couchbase-sdk_java_set)                                   | Store a value using the specified key                                                                                                       
[`client.set(key, expiry, value, persistto)`](#table-couchbase-sdk_java_set-persist)                | Store a value using the specified key and observe it being persisted on master and more node(s).                                            
[`client.set(key, expiry, value, persistto, replicateto)`](#table-couchbase-sdk_java_set-replicate) | Store a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).
[`client.set(key, expiry, value, transcoder)`](#table-couchbase-sdk_java_set-transcoder)            | Store a value using the specified key and a custom transcoder.                                                                              

<a id="couchbase-sdk-java-set-add"></a>

## Add Operations

The `add()` method adds a value to the database with the specified key, but will
fail if the key already exists in the database.

<a id="table-couchbase-sdk_java_add"></a>

**API Call**     | `client.add(key, expiry, value)`                                                                                            
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**  | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**      | `Future<Boolean>` ( Future value as Boolean )                                                                               
**Arguments**    |                                                                                                                             
**String key**   | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value** | Value to be stored                                                                                                          

The `add()` method adds a value to the database using the specified key.


    `java
    client.add("someKey", 0, someObject);

Unlike [Set Operations](#couchbase-sdk-java-set-set) the operation can fail (and
return false) if the specified key already exist.

For example, the first operation in the example below may complete if the key
does not already exist, but the second operation will always fail as the first
operation will have set the key:


    `java
    OperationFuture<Boolean> addOp = client.add("someKey",0,"astring");
    System.out.printf("Result was %b",addOp.get());
    addOp =  client.add("someKey",0,"anotherstring");
    System.out.printf("Result was %b",addOp.get());

<a id="table-couchbase-sdk_java_add-transcoder"></a>

**API Call**                 | `client.add(key, expiry, value, transcoder)`                                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Add a value with the specified key that does not already exist. Will fail if the key/value pair already exist.              
**Returns**                  | `Future<Boolean>` ( Future value as Boolean )                                                                               
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This method is identical to the `add()` method, but supports the use of a custom
transcoder for serialization of the object value. For more information on
transcoding, see [Object Serialization
(Transcoding)](#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-set"></a>

## Set Operations

The set operations store a value into Couchbase or Memcached using the specified
key and value. The value is stored against the specified key, even if the key
already exists and has data. This operation overwrites the existing with the new
data.

<a id="table-couchbase-sdk_java_set"></a>

**API Call**     | `client.set(key, expiry, value)`                                                                                                           
-----------------|--------------------------------------------------------------------------------------------------------------------------------------------
**Description**  | Store a value using the specified key, whether the key already exists or not. Will overwrite a value if the given key/value already exists.
**Returns**      | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                                           
**Arguments**    |                                                                                                                                            
**String key**   | Key used to reference the value. The key cannot contain control characters or whitespace.                                                  
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).               
**Object value** | Value to be stored                                                                                                                         

The first form of the `set()` method stores the key, sets the expiry (use 0 for
no expiry), and the corresponding object value using the built in transcoder for
serialization.

The simplest form of the command is:


    `java
    client.set("someKey", 3600, someObject);

The `Boolean` return value will be true if the value was stored. For example:


    `java
    OperationFuture<Boolean> setOp = client.set("someKey",0,"astring");
    System.out.printf("Result was %b",setOp.get());

<a id="table-couchbase-sdk_java_set-transcoder"></a>

**API Call**                 | `client.set(key, expiry, value, transcoder)`                                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Store a value using the specified key and a custom transcoder.                                                              
**Returns**                  | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                            
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This method is identical to the `set()` method, but supports the use of a custom
transcoder for serialization of the object value. For more information on
transcoding, see [Object Serialization
(Transcoding)](#couchbase-sdk-java-summary-transcoding).

<a id="couchbase-sdk-java-set-observe"></a>

## Set Operations with Observe

<a id="table-couchbase-sdk_java_set-persist"></a>

**API Call**       | `client.set(key, expiry, value, persistto)`                                                                                                                                                                                                                                                                                 
-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**    | Store a value using the specified key and observe it being persisted on master and more node(s).                                                                                                                                                                                                                            
**Returns**        | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                                                                                                                                                                                                                            
**Arguments**      |                                                                                                                                                                                                                                                                                                                             
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                   
**int expiry**     | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                
**Object value**   | Value to be stored                                                                                                                                                                                                                                                                                                          
**enum persistto** | Ability to specify Persist requirements to Master and more server(s). MASTER or ONE requires Persist to the Master. TWO requires Persist to at least two nodes including the Master. THREE requires Persist to at least three nodes including the Master. FOUR requires Persist to at least four nodes including the Master.

<a id="table-couchbase-sdk_java_set-replicate"></a>

**API Call**         | `client.set(key, expiry, value, persistto, replicateto)`                                                                                                                                                                                                                                                                                                                                                     
---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**      | Store a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).                                                                                                                                                                                                                                                                 
**Returns**          | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                                                                                                                                                                                                                                                                                                             
**Arguments**        |                                                                                                                                                                                                                                                                                                                                                                                                              
**String key**       | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                                                                                    
**int expiry**       | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                                                                                                 
**Object value**     | Value to be stored                                                                                                                                                                                                                                                                                                                                                                                           
**enum persistto**   | Ability to specify Persist requirements to Master and more server(s). MASTER or ONE requires Persist to the Master. TWO requires Persist to at least two nodes including the Master. THREE requires Persist to at least three nodes including the Master. FOUR requires Persist to at least four nodes including the Master.                                                                                 
**enum replicateto** | Ability to specify Replication requirements to zero or more replicas. ZERO implies no requirements for the data to be replicated to the replicas. ONE implies requirements for the data to be replicated with at least one replica. TWO implies requirements for the data to be replicated with at least two replicas. THREE implies requirements for the data to be replicated with at least three replicas.

This method is identical to the `set()` method, but supports the ability to
observe the persistence on the master and replicas and the propagation to the
replicas. Using these methods above, it's possible to set the persistence
requirements for the data on the nodes.

The persistence requirements can be specified in terms of how the data should be
persisted on the master and the replicas using `PeristTo` and how the data
should be propagated to the replicas using `ReplicateTo` respectively.

The client library will poll the server until the persistence requirements are
met. The method will return FALSE if the requirments are impossible to meet
based on the configuration (inadequate number of replicas) or even after a set
amount of retries the persistence requirments could not be met.

The program snippet below illustrates how to specify a requirement that the data
should be persisted on 4 nodes (master and three replicas).


    `java
    // Perist to all four nodes including master
    OperationFuture<Boolean> setOp =
       c.set("key", 0, "value", PersistTo.FOUR);
    System.out.printf("Result was %b", setOp.get());

The peristence requirements can be specified for both the master and replicas.
In the case above, it's required that the key and value is persisted on all the
4 nodes (including replicas).

In the following, the requirement is specified as requiring persistence to the
master and propagation of the data to the three replicas. This requirment is
weaker than requring the data to be persisted on all four nodes including the
three replicas.


    `java
    // Perist to master and propagate the data to three replicas
    OperationFuture<Boolean> setOp =
       c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", setOp.get());

Similar requirements can used with the *add()* and *replace()* mutation
operations.

<a id="api-reference-retrieve"></a>

# Retrieve Operations

The retrieve operations get information from the Couchbase database. A summary
of the available API calls is listed below.

<a id="table-couchbase-sdk-java-retrieve-summary"></a>

Method                                                                                                    | Title                                                                                              
----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------
[`client.asyncGetAndTouch(key, expiry)`](#table-couchbase-sdk_java_asyncgat)                              | Asynchronously get a value and update the expiration time for a given key                          
[`client.asyncGetAndTouch(key, expiry, transcoder)`](#table-couchbase-sdk_java_asyncgat-transcoder)       | Asynchronously get a value and update the expiration time for a given key using a custom transcoder
[`client.getAndTouch(key, expiry)`](#table-couchbase-sdk_java_gat)                                        | Get a value and update the expiration time for a given key                                         
[`client.getAndTouch(key, expiry, transcoder)`](#table-couchbase-sdk_java_gat-transcoder)                 | Get a value and update the expiration time for a given key using a custom transcoder               
[`client.asyncGet(key)`](#table-couchbase-sdk_java_asyncget)                                              | Asynchronously get a single key                                                                    
[`client.asyncGetBulk(keycollection)`](#table-couchbase-sdk_java_asyncget-bulk)                           | Asynchronously get multiple keys                                                                   
[`client.asyncGetBulk(keyn)`](#table-couchbase-sdk_java_asyncget-bulk-multikeys)                          | Asynchronously get multiple keys                                                                   
[`client.asyncGetBulk(transcoder, keyn)`](#table-couchbase-sdk_java_asyncget-bulk-multikeys-transcoder)   | Asynchronously get multiple keys using a custom transcoder                                         
[`client.asyncGetBulk(keycollection, transcoder)`](#table-couchbase-sdk_java_asyncget-bulk-transcoder)    | Asynchronously get multiple keys using a custom transcoder                                         
[`client.asyncGet(key, transcoder)`](#table-couchbase-sdk_java_asyncget-transcoder)                       | Asynchronously get a single key using a custom transcoder                                          
[`client.get(key)`](#table-couchbase-sdk_java_get)                                                        | Get a single key                                                                                   
[`client.getBulk(keycollection)`](#table-couchbase-sdk_java_get-bulk)                                     | Get multiple keys                                                                                  
[`client.getBulk(keyn)`](#table-couchbase-sdk_java_get-bulk-multikeys)                                    | Get multiple keys                                                                                  
[`client.getBulk(transcoder, keyn)`](#table-couchbase-sdk_java_get-bulk-multikeys-transcoder)             | Get multiple keys using a custom transcoder                                                        
[`client.getBulk(keycollection, transcoder)`](#table-couchbase-sdk_java_get-bulk-transcoder)              | Get multiple keys using a custom transcoder                                                        
[`client.get(key, transcoder)`](#table-couchbase-sdk_java_get-transcoder)                                 | Get a single key using a custom transcoder                                                         
[`client.asyncGetLock(key [, getl-expiry ])`](#table-couchbase-sdk_java_asyncgetl)                        | Asynchronously get a lock.                                                                         
[`client.asyncGetLock(key [, getl-expiry ], transcoder)`](#table-couchbase-sdk_java_asyncgetl-transcoder) | Asynchronously get a lock with transcoder.                                                         
[`client.getAndLock(key [, getl-expiry ])`](#table-couchbase-sdk_java_get-and-lock)                       | Get and lock Asynchronously                                                                        
**Couldn't resolve link tag: table-couchbase-sdk\_java\_get-and-lock-transcoder**                         | Get and lock                                                                                       
[`client.asyncGets(key)`](#table-couchbase-sdk_java_asyncgets)                                            | Asynchronously get single key value with CAS value                                                 
[`client.asyncGets(key, transcoder)`](#table-couchbase-sdk_java_asyncgets-transcoder)                     | Asynchronously get single key value with CAS value using custom transcoder                         
[`client.gets(key)`](#table-couchbase-sdk_java_gets)                                                      | Get single key value with CAS value                                                                
[`client.gets(key, transcoder)`](#table-couchbase-sdk_java_gets-transcoder)                               | Get single key value with CAS value using custom transcoder                                        
[`client.unlock(key, casunique)`](#table-couchbase-sdk_java_unlock)                                       | Unlock                                                                                             

<a id="couchbase-sdk-java-retrieve-get"></a>

## Synchronous get Methods

The synchronous `get()` methods allow for direct access to a given key/value
pair.

<a id="table-couchbase-sdk_java_get"></a>

**API Call**    | `client.get(key)`                                                                        
----------------|------------------------------------------------------------------------------------------
**Description** | Get one or more key values                                                               
**Returns**     | `Object` ( Binary object )                                                               
**Arguments**   |                                                                                          
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.

The `get()` method obtains an object stored in Couchbase using the default
transcoder for serialization of the object.

For example:


    `java
    Object myObject = client.get("someKey");

Transcoding of the object assumes the default transcoder was used when the value
was stored. The returned object can be of any type.

If the request key does no existing in the database then the returned value is
null.

<a id="table-couchbase-sdk_java_get-transcoder"></a>

**API Call**                 | `client.get(key, transcoder)`                                                            
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get one or more key values                                                               
**Returns**                  | `T` ( Transcoded object )                                                                
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The second form of the `get()` retrieves a value from Couchbase using a custom
transcoder.

For example to obtain an integer value using the IntegerTranscoder:


    `java
    Transcoder<Integer> tc = new IntegerTranscoder();
    Integer ic = client.get("someKey", tc);

<a id="couchbase-sdk-java-retrieve-get-async"></a>

## Asynchronous get Methods

The asynchronous `asyncGet()` methods allow to retrieve a given value for a key
without waiting actively for a response.

<a id="table-couchbase-sdk_java_asyncget"></a>

**API Call**       | `client.asyncGet(key)`                                                                   
-------------------|------------------------------------------------------------------------------------------
**Description**    | Get one or more key values                                                               
**Returns**        | `Future<Object>` ( Future value as Object )                                              
**Arguments**      |                                                                                          
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.
**Exceptions**     |                                                                                          
`TimeoutException` | Value could not be retrieved                                                             

The first form of the `asyncGet()` method obtains a value for a given key
returning a Future object so that the value can be later retrieved. For example,
to get a key with a stored String value:


    `java
    GetFuture<Object> getOp =
        client.asyncGet("samplekey");

    String username;

    try {
        username = (String) getOp.get(5, TimeUnit.SECONDS);
    } catch(Exception e) {
        getOp.cancel(false);
    }

<a id="table-couchbase-sdk_java_asyncget-transcoder"></a>

**API Call**                 | `client.asyncGet(key, transcoder)`                                                       
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get one or more key values                                                               
**Returns**                  | `Future<T>` ( Future value as Transcoded Object )                                        
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The second form is identical to the first, but includes the ability to use a
custom transcoder on the stored value.

<a id="couchbase-sdk-java-retrieve-gat"></a>

## Get-and-Touch Methods

The Get-and-Touch (GAT) methods obtain a value for a given key and update the
expiry time for the key. This can be useful for session values and other
information where you want to set an expiry time, but don't want the value to
expire while the value is still in use.

<a id="table-couchbase-sdk_java_gat"></a>

**API Call**           | `client.getAndTouch(key, expiry)`                                                                                           
-----------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**        | Get a value and update the expiration time for a given key                                                                  
**Introduced Version** | 1.0                                                                                                                         
**Returns**            | `CASValue` ( Check and set object )                                                                                         
**Arguments**          |                                                                                                                             
**String key**         | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**         | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The first form of the `getAndTouch()` obtains a given value and updates the
expiry time. For example, to get session data and renew the expiry time to five
minutes:


    `java
    session = client.getAndTouch("sessionid",300);

<a id="table-couchbase-sdk_java_gat-transcoder"></a>

**API Call**                 | `client.getAndTouch(key, expiry, transcoder)`                                                                               
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Get a value and update the expiration time for a given key                                                                  
**Introduced Version**       | 1.0                                                                                                                         
**Returns**                  | `CASValue` ( Check and set object )                                                                                         
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form supports the use of a custom transcoder for the stored value
information.

<a id="table-couchbase-sdk_java_asyncgat"></a>

**API Call**           | `client.asyncGetAndTouch(key, expiry)`                                                                                      
-----------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**        | Get a value and update the expiration time for a given key                                                                  
**Introduced Version** | 1.0                                                                                                                         
**Returns**            | `Future<CASValue<Object>>` ( Future value as CASValue as Object )                                                           
**Arguments**          |                                                                                                                             
**String key**         | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**         | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The asynchronous methods obtain the value and update the expiry time without
requiring you to actively wait for the response. The returned value is a CAS
object with the embedded value object.


    `java
    Future<CASValue<Object>> future = client.asyncGetAndTouch("sessionid", 300);

    CASValue casv;

    try {
        casv = future.get(5, TimeUnit.SECONDS);
    } catch(Exception e) {
        future.cancel(false);
    }

<a id="table-couchbase-sdk_java_asyncgat-transcoder"></a>

**API Call**                 | `client.asyncGetAndTouch(key, expiry, transcoder)`                                                                          
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Get a value and update the expiration time for a given key                                                                  
**Introduced Version**       | 1.0                                                                                                                         
**Returns**                  | `Future<CASValue<T>>` ( Future value as CASValue as Transcoded object )                                                     
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form of the asynchronous method supports the use of a custom
transcoder for the stored object.

<a id="couchbase-sdk-java-retrieve-gets"></a>

## CAS get Methods

The `gets()` methods obtain a CAS value for a given key. The CAS value is used
in combination with the corresponding Check-and-Set methods when updating a
value. For example, you can use the CAS value with the `append()` operation to
update a value only if the CAS value you supply matches. For more information
see [Append Methods](#couchbase-sdk-java-update-append) and [Check-and-Set
Methods](#couchbase-sdk-java-update-cas).

<a id="table-couchbase-sdk_java_gets"></a>

**API Call**    | `client.gets(key)`                                                                       
----------------|------------------------------------------------------------------------------------------
**Description** | Get single key value with CAS value                                                      
**Returns**     | `CASValue` ( Check and set object )                                                      
**Arguments**   |                                                                                          
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.

The `gets()` method obtains a `CASValue` for a given key. The CASValue holds the
CAS to be used when performing a Check-And-Set operation, and the corresponding
value for the given key.

For example, to obtain the CAS and value for the key `someKey` :


    `java
    CASValue status = client.gets("someKey");
    System.out.printf("CAS is %s\n",status.getCas());
    System.out.printf("Result was %s\n",status.getValue());

The CAS value can be used in a CAS call such as `append()` :


    `java
    client.append(status.getCas(),"someKey", "appendedstring");

<a id="table-couchbase-sdk_java_gets-transcoder"></a>

**API Call**                 | `client.gets(key, transcoder)`                                                           
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get single key value with CAS value                                                      
**Returns**                  | `CASValue` ( Check and set object )                                                      
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The second form of the `gets()` method supports the use of a custom transcoder.

<a id="table-couchbase-sdk_java_asyncgets"></a>

**API Call**    | `client.asyncGets(key)`                                                                  
----------------|------------------------------------------------------------------------------------------
**Description** | Get single key value with CAS value                                                      
**Returns**     | `Future<CASValue<Object>>` ( Future value as CASValue as Object )                        
**Arguments**   |                                                                                          
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.

The `asyncGets()` method obtains the `CASValue` object for a stored value
against the specified key, without requiring an explicit wait for the returned
value.

For example:


    `java
    Future<CASValue<Object>> future = client.asyncGets("someKey");

    System.out.printf("CAS is %s\n",future.get(5,TimeUnit.SECONDS).getCas());

Note that you have to extract the CASValue from the Future response, and then
the CAS value from the corresponding object. This is performed here in a single
statement.

<a id="table-couchbase-sdk_java_asyncgets-transcoder"></a>

**API Call**                 | `client.asyncGets(key, transcoder)`                                                      
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get single key value with CAS value                                                      
**Returns**                  | `Future<CASValue<T>>` ( Future value as CASValue as Transcoded object )                  
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The final form of the `asyncGets()` method supports the use of a custom
transcoder.

<a id="couchbase-sdk-java-retrieve-bulk"></a>

## Bulk get Methods

The bulk `getBulk()` methods allow you to get one or more items from the
database in a single request. Using the bulk methods is more efficient than
multiple single requests as the operation can be conducted in a single network
call.

<a id="table-couchbase-sdk_java_get-bulk"></a>

**API Call**                         | `client.getBulk(keycollection)`                
-------------------------------------|------------------------------------------------
**Description**                      | Get one or more key values                     
**Returns**                          | `Map<String,Object>` ( Map of Strings/Objects )
**Arguments**                        |                                                
**Collection<String> keycollection** | One or more keys used to reference a value     

The first format accepts a `String`  `Collection` as the request argument which
is used to specify the list of keys that you want to retrieve. The return type
is `Map` between the keys and object values.

For example:


    `java
    Map<String,Object> keyvalues = client.getBulk(keylist);

    System.out.printf("A is %s\n",keyvalues.get("keyA"));
    System.out.printf("B is %s\n",keyvalues.get("keyB"));
    System.out.printf("C is %s\n",keyvalues.get("keyC"));

The returned map will only contain entries for keys that exist from the original
request. For example, if you request the values for three keys, but only one
exists, the resultant map will contain only that one key/value pair.

<a id="table-couchbase-sdk_java_get-bulk-transcoder"></a>

**API Call**                         | `client.getBulk(keycollection, transcoder)`          
-------------------------------------|------------------------------------------------------
**Description**                      | Get one or more key values                           
**Returns**                          | `Map<String,T>` ( Map of Strings/Transcoded objects )
**Arguments**                        |                                                      
**Collection<String> keycollection** | One or more keys used to reference a value           
**Transcoder<T> transcoder**         | Transcoder class to be used to serialize value       

The second form of the `getBulk()` method supports the same `Collection`
argument, but also supports the use of a custom transcoder on the returned
values.

The specified transcoder will be used for every value requested from the
database.

<a id="table-couchbase-sdk_java_get-bulk-multikeys"></a>

**API Call**       | `client.getBulk(keyn)`                         
-------------------|------------------------------------------------
**Description**    | Get one or more key values                     
**Returns**        | `Map<String,Object>` ( Map of Strings/Objects )
**Arguments**      |                                                
**String... keyn** | One or more keys used to reference a value     

The third form of the `getBulk()` method supports a variable list of arguments
with each interpreted as the key to be retrieved from the database.

For example, the equivalent of the `Collection` method operation using this
method would be:


    `java
    Map<String,Object> keyvalues = client.getBulk("keyA","keyB","keyC");

    System.out.printf("A is %s\n",keyvalues.get("keyA"));
    System.out.printf("B is %s\n",keyvalues.get("keyB"));
    System.out.printf("C is %s\n",keyvalues.get("keyC"));

The return `Map` will only contain entries for keys that exist. Non-existent
keys will be silently ignored.

<a id="table-couchbase-sdk_java_get-bulk-multikeys-transcoder"></a>

**API Call**                 | `client.getBulk(transcoder, keyn)`                   
-----------------------------|------------------------------------------------------
**Description**              | Get one or more key values                           
**Returns**                  | `Map<String,T>` ( Map of Strings/Transcoded objects )
**Arguments**                |                                                      
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value       
**String... keyn**           | One or more keys used to reference a value           

The fourth form of the `getBulk()` method uses the variable list of arguments
but supports a custom transcoder.

Note that unlike other formats of the methods used for supporting custom
transcoders, the transcoder specification is at the start of the argument list,
not the end.

<a id="table-couchbase-sdk_java_asyncget-bulk"></a>

**API Call**                         | `client.asyncGetBulk(keycollection)`                       
-------------------------------------|------------------------------------------------------------
**Description**                      | Get one or more key values                                 
**Returns**                          | `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )
**Arguments**                        |                                                            
**Collection<String> keycollection** | One or more keys used to reference a value                 

The asynchronous `getBulk()` method supports a `Collection` of keys to be
retrieved, returning a BulkFuture object (part of the `spymemcached` package)
with the returned map of key/value information. As with other asynchronous
methods, the benefit is that you do not need to actively wait for the response.

The `BulkFuture` object operates slightly different in context to the standard
`Future` object. Whereas the `Future` object gets a returned single value, the
`BulkFuture` object will return an object containing as many keys as have been
returned. For very large queries requesting large numbers of keys this means
that multiple requests may be required to obtain every key from the original
list.

For example, the code below will obtain as many keys as possible from the
supplied `Collection`.


    `java
    BulkFuture<Map<String,Object>> keyvalues = client.asyncGetBulk(keylist);

    Map<String,Object> keymap = keyvalues.getSome(5,TimeUnit.SECONDS);

    System.out.printf("A is %s\n",keymap.get("keyA"));
    System.out.printf("B is %s\n",keymap.get("keyB"));
    System.out.printf("C is %s\n",keymap.get("keyC"));

<a id="table-couchbase-sdk_java_asyncget-bulk-transcoder"></a>

**API Call**                         | `client.asyncGetBulk(keycollection, transcoder)`                 
-------------------------------------|------------------------------------------------------------------
**Description**                      | Get one or more key values                                       
**Returns**                          | `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )
**Arguments**                        |                                                                  
**Collection<String> keycollection** | One or more keys used to reference a value                       
**Transcoder<T> transcoder**         | Transcoder class to be used to serialize value                   

The second form of the asynchronous `getBulk()` method supports the custom
transcoder for the returned values.

<a id="table-couchbase-sdk_java_asyncget-bulk-multikeys"></a>

**API Call**       | `client.asyncGetBulk(keyn)`                                
-------------------|------------------------------------------------------------
**Description**    | Get one or more key values                                 
**Returns**        | `BulkFuture<Map<String,Object>>` ( Map of Strings/Objects )
**Arguments**      |                                                            
**String... keyn** | One or more keys used to reference a value                 

[The third form is identical to the multi-argument key request method
(seecollection based
`asyncBulkGet()`](#table-couchbase-sdk_java_get-bulk-multikeys) ), except that
the operation occurs asynchronously.

<a id="table-couchbase-sdk_java_asyncget-bulk-multikeys-transcoder"></a>

**API Call**                 | `client.asyncGetBulk(transcoder, keyn)`                          
-----------------------------|------------------------------------------------------------------
**Description**              | Get one or more key values                                       
**Returns**                  | `BulkFuture<Map<String,T>>` ( Map of Strings/Transcoded objects )
**Arguments**                |                                                                  
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                   
**String... keyn**           | One or more keys used to reference a value                       

The final form of the `asyncGetBulk()` method supports a custom transcoder with
the variable list of keys supplied as arguments.

<a id="couchbase-sdk-java-retrieve-get-and-lock"></a>

## Get and Lock

<a id="table-couchbase-sdk_java_asyncgetl-transcoder"></a>

**API Call**                 | `client.asyncGetLock(key [, getl-expiry ], transcoder)`                                  
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get the value for a key, lock the key from changes                                       
**Returns**                  | `Future<CASValue<T>>` ( Future value as CASValue as Transcoded object )                  
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**int getl-expiry**          | Expiry time for lock                                                                     
                             | **Default**                                                                              
                             | **Maximum**                                                                              
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

<a id="table-couchbase-sdk_java_asyncgetl"></a>

**API Call**        | `client.asyncGetLock(key [, getl-expiry ])`                                              
--------------------|------------------------------------------------------------------------------------------
**Description**     | Get the value for a key, lock the key from changes                                       
**Returns**         | `Future<CASValue<Object>>` ( Future value as CASValue as Object )                        
**Arguments**       |                                                                                          
**String key**      | Key used to reference the value. The key cannot contain control characters or whitespace.
**int getl-expiry** | Expiry time for lock                                                                     
                    | **Default**                                                                              
                    | **Maximum**                                                                              

<a id="table-couchbase-sdk_java_getl"></a>

**API Call**                 | `client.getAndLock(key [, getl-expiry ], transcoder)`                                    
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Get the value for a key, lock the key from changes                                       
**Returns**                  | `CASValue<T>` ( CASValue as Transcoded object )                                          
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**int getl-expiry**          | Expiry time for lock                                                                     
                             | **Default**                                                                              
                             | **Maximum**                                                                              
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           
**Exceptions**               |                                                                                          
`OperationTimeoutException`  | Exception timeout occured while waiting for value.                                       
`RuntimeException`           | Exception object specifying interruption while waiting for value.                        

The simplest form of the method is without the transcoder as below.

<a id="table-couchbase-sdk_java_get-and-lock"></a>

**API Call**                | `client.getAndLock(key [, getl-expiry ])`                                                
----------------------------|------------------------------------------------------------------------------------------
**Description**             | Get the value for a key, lock the key from changes                                       
**Returns**                 | `CASValue<Object>` ( CASValue as object )                                                
**Arguments**               |                                                                                          
**String key**              | Key used to reference the value. The key cannot contain control characters or whitespace.
**int getl-expiry**         | Expiry time for lock                                                                     
                            | **Default**                                                                              
                            | **Maximum**                                                                              
**Exceptions**              |                                                                                          
`OperationTimeoutException` | Exception timeout occured while waiting for value.                                       
`RuntimeException`          | Exception object specifying interruption while waiting for value.                        


    `java
    CASValue<Object> casv = client.getAndLock("keyA", 3);

Will lock keyA for 3 seconds or until an Unlock is issued.

<a id="couchbase-sdk-java-retrieve-unlock"></a>

## Unlock

<a id="table-couchbase-sdk_java_unlock"></a>

**API Call**                | `client.unlock(key, casunique)`                                                                          
----------------------------|----------------------------------------------------------------------------------------------------------
**Description**             | Unlock a previously locked key by providing the corresponding CAS value that was returned during the lock
**Returns**                 | ( Boolean (true/false) )                                                                                 
**Arguments**               |                                                                                                          
**String key**              | Key used to reference the value. The key cannot contain control characters or whitespace.                
**long casunique**          | Unique value used to identify a key/value combination                                                    
**Exceptions**              |                                                                                                          
`InterruptedException`      | Interrupted Exception while waiting for value.                                                           
`OperationTimeoutException` | Exception timeout occured while waiting for value.                                                       
`RuntimeException`          | Exception object specifying interruption while waiting for value.                                        


    `java
    CASValue<Object> casv = client.getAndLock("keyA", 3);
    //Use CAS Value to Unlock
    client.unlock("getunltest", casv.getCas());

<a id="api-reference-update"></a>

# Update Operations

The update methods support different methods of updating and changing existing
information within Couchbase. A list of the available methods is listed below.

<a id="table-couchbase-sdk-java-update-summary"></a>

Method                                                                                                               | Title                                                                                                                                        
---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------
[`client.append(casunique, key, value)`](#table-couchbase-sdk_java_append)                                           | Append a value to an existing key                                                                                                            
[`client.append(casunique, key, value, transcoder)`](#table-couchbase-sdk_java_append-transcoder)                    | Append a value to an existing key                                                                                                            
[`client.asyncCAS(key, casunique, value)`](#table-couchbase-sdk_java_asynccas)                                       | Asynchronously compare and set a value                                                                                                       
[`client.asyncCAS(key, casunique, expiry, value, transcoder)`](#table-couchbase-sdk_java_asynccas-expiry-transcoder) | Asynchronously compare and set a value with custom transcoder and expiry                                                                     
[`client.asyncCAS(key, casunique, value, transcoder)`](#table-couchbase-sdk_java_asynccas-transcoder)                | Asynchronously compare and set a value with custom transcoder                                                                                
[`client.cas(key, casunique, value)`](#table-couchbase-sdk_java_cas)                                                 | Compare and set                                                                                                                              
[`client.cas(key, casunique, expiry, value, transcoder)`](#table-couchbase-sdk_java_cas-expiry-transcoder)           | Compare and set with a custom transcoder and expiry                                                                                          
[`client.cas(key, casunique, value, transcoder)`](#table-couchbase-sdk_java_cas-transcoder)                          | Compare and set with a custom transcoder                                                                                                     
[`client.asyncDecr(key, offset)`](#table-couchbase-sdk_java_asyncdecr)                                               | Asynchronously decrement the value of an existing key                                                                                        
[`client.decr(key, offset)`](#table-couchbase-sdk_java_decr)                                                         | Decrement the value of an existing numeric key                                                                                               
[`client.decr(key, offset, default)`](#table-couchbase-sdk_java_decr-default)                                        | Decrement the value of an existing numeric key                                                                                               
[`client.decr(key, offset, default, expiry)`](#table-couchbase-sdk_java_decr-default-expiry)                         | Decrement the value of an existing numeric key                                                                                               
[`client.delete(key)`](#table-couchbase-sdk_java_delete)                                                             | Delete the specified key                                                                                                                     
[`client.delete(key, persistto)`](#table-couchbase-sdk_java_delete-persist)                                          | Delete a value using the specified key and observe it being persisted on master and more node(s).                                            
[`client.delete(key, persistto, replicateto)`](#table-couchbase-sdk_java_delete-replicate)                           | Delete a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).
[`client.asyncIncr(key, offset)`](#table-couchbase-sdk_java_asyncincr)                                               | Asynchronously increment the value of an existing key                                                                                        
[`client.incr(key, offset)`](#table-couchbase-sdk_java_incr)                                                         | Increment the value of an existing numeric key                                                                                               
[`client.incr(key, offset, default)`](#table-couchbase-sdk_java_incr-default)                                        | Increment the value of an existing numeric key                                                                                               
[`client.incr(key, offset, default, expiry)`](#table-couchbase-sdk_java_incr-default-expiry)                         | Increment the value of an existing numeric key                                                                                               
[`client.prepend(casunique, key, value)`](#table-couchbase-sdk_java_prepend)                                         | Prepend a value to an existing key using the default transcoder                                                                              
[`client.prepend(casunique, key, value, transcoder)`](#table-couchbase-sdk_java_prepend-transcoder)                  | Prepend a value to an existing key using a custom transcoder                                                                                 
[`client.touch(key, expiry)`](#table-couchbase-sdk_java_touch)                                                       | Update the expiry time of an item                                                                                                            

<a id="couchbase-sdk-java-update-append"></a>

## Append Methods

The `append()` methods allow you to add information to an existing key/value
pair in the database. You can use this to add information to a string or other
data after the existing data.

The `append()` methods append raw serialized data on to the end of the existing
data in the key. If you have previously stored a serialized object into
Couchbase and then use append, the content of the serialized object will not be
extended. For example, adding an `Array` of integers into the database, and then
using `append()` to add another integer will result in the key referring to a
serialized version of the array, immediately followed by a serialized version of
the integer. It will not contain an updated array with the new integer appended
to it. De-serialization of objects that have had data appended may result in
data corruption.

<a id="table-couchbase-sdk_java_append"></a>

**API Call**       | `client.append(casunique, key, value)`                                                   
-------------------|------------------------------------------------------------------------------------------
**Description**    | Append a value to an existing key                                                        
**Returns**        | `Object` ( Binary object )                                                               
**Arguments**      |                                                                                          
**long casunique** | Unique value used to identify a key/value combination                                    
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.
**Object value**   | Value to be stored                                                                       

The `append()` appends information to the end of an existing key/value pair. The
`append()` function requires a CAS value. For more information on CAS values,
see [CAS get Methods](#couchbase-sdk-java-retrieve-gets).

For example, to append a string to an existing key:


    `java
    CASValue<Object> casv = client.gets("samplekey");
    client.append(casv.getCas(),"samplekey", "appendedstring");

You can check if the append operation succeeded by using the return
`OperationFuture` value:


    `java
    OperationFuture<Boolean> appendOp =
        client.append(casv.getCas(),"notsamplekey", "appendedstring");

    try {
        if (appendOp.get().booleanValue()) {
            System.out.printf("Append succeeded\n");
        }
        else {
            System.out.printf("Append failed\n");
        }
    }
    catch (Exception e) {
    ...
    }

<a id="table-couchbase-sdk_java_append-transcoder"></a>

**API Call**                 | `client.append(casunique, key, value, transcoder)`                                       
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Append a value to an existing key                                                        
**Returns**                  | `Object` ( Binary object )                                                               
**Arguments**                |                                                                                          
**long casunique**           | Unique value used to identify a key/value combination                                    
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Object value**             | Value to be stored                                                                       
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The second form of the `append()` method supports the use of custom transcoder.

<a id="couchbase-sdk-java-update-prepend"></a>

## Prepend Methods

The `prepend()` methods insert information before the existing data for a given
key. Note that as with the `append()` method, the information will be inserted
before the existing binary data stored in the key, which means that
serialization of complex objects may lead to corruption when using `prepend()`.

<a id="table-couchbase-sdk_java_prepend"></a>

**API Call**       | `client.prepend(casunique, key, value)`                                                  
-------------------|------------------------------------------------------------------------------------------
**Description**    | Prepend a value to an existing key                                                       
**Returns**        | `Future<Boolean>` ( Future value as Boolean )                                            
**Arguments**      |                                                                                          
**long casunique** | Unique value used to identify a key/value combination                                    
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.
**Object value**   | Value to be stored                                                                       

The `prepend()` inserts information before the existing data stored in the
key/value pair. The `prepend()` function requires a CAS value. For more
information on CAS values, see [CAS get
Methods](#couchbase-sdk-java-retrieve-gets).

For example, to prepend a string to an existing key:


    `java
    CASValue<Object> casv = client.gets("samplekey");
    client.prepend(casv.getCas(),"samplekey", "prependedstring");

You can check if the prepend operation succeeded by using the return
`OperationFuture` value:


    `java
    OperationFuture<Boolean> prependOp =
        client.prepend(casv.getCas(),"notsamplekey", "prependedstring");

    try {
        if (prependOp.get().booleanValue()) {
            System.out.printf("Prepend succeeded\n");
        }
        else {
            System.out.printf("Prepend failed\n");
        }
    }
    catch (Exception e) {
    ...
    }

<a id="table-couchbase-sdk_java_prepend-transcoder"></a>

**API Call**                 | `client.prepend(casunique, key, value, transcoder)`                                      
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Prepend a value to an existing key                                                       
**Returns**                  | `Future<Boolean>` ( Future value as Boolean )                                            
**Arguments**                |                                                                                          
**long casunique**           | Unique value used to identify a key/value combination                                    
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**Object value**             | Value to be stored                                                                       
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The secondary form of the `prepend()` method supports the use of a custom
transcoder for updating the key/value pair.

<a id="couchbase-sdk-java-update-cas"></a>

## Check-and-Set Methods

The check-and-set methods provide a mechanism for updating information only if
the client knows the check (CAS) value. This can be used to prevent clients from
updating values in the database that may have changed since the client obtained
the value. Methods for storing and updating information support a CAS method
that allows you to ensure that the client is updating the version of the data
that the client retrieved.

The check value is in the form of a 64-bit integer which is updated every time
the value is modified, even if the update of the value does not modify the
binary data. Attempting to set or update a key/value pair where the CAS value
does not match the value stored on the server will fail.

The `cas()` methods are used to explicitly set the value only if the CAS
supplied by the client matches the CAS on the server, analogous to the [Set
Operations](#couchbase-sdk-java-set-set) method.

With all CAS operations, the `CASResponse` value returned indicates whether the
operation succeeded or not, and if not why. The `CASResponse` is an `Enum` with
three possible values:

 *  `EXISTS`

    The item exists, but the CAS value on the database does not match the value
    supplied to the CAS operation.

 *  `NOT_FOUND`

    The specified key does not exist in the database. An `add()` method should be
    used to add the key to the database.

 *  `OK`

    The CAS operation was successful and the updated value is stored in Couchbase

<a id="table-couchbase-sdk_java_cas"></a>

**API Call**       | `client.cas(key, casunique, value)`                                                      
-------------------|------------------------------------------------------------------------------------------
**Description**    | Compare and set a value providing the supplied CAS key matches                           
**Returns**        | `CASResponse` ( Check and set object )                                                   
**Arguments**      |                                                                                          
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.
**long casunique** | Unique value used to identify a key/value combination                                    
**Object value**   | Value to be stored                                                                       

The first form of the `cas()` method allows for an item to be set in the
database only if the CAS value supplied matches that stored on the server.

For example:


    `java
    CASResponse casr = client.cas("caskey", casvalue, "new string value");

    if (casr.equals(CASResponse.OK)) {
        System.out.println("Value was updated");
    }
    else if (casr.equals(CASResponse.NOT_FOUND)) {
        System.out.println("Value is not found");
    }
    else if (casr.equals(CASResponse.EXISTS)) {
        System.out.println("Value exists, but CAS didn't match");
    }

<a id="table-couchbase-sdk_java_cas-transcoder"></a>

**API Call**                 | `client.cas(key, casunique, value, transcoder)`                                          
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Compare and set a value providing the supplied CAS key matches                           
**Returns**                  | `CASResponse` ( Check and set object )                                                   
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**long casunique**           | Unique value used to identify a key/value combination                                    
**Object value**             | Value to be stored                                                                       
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

The second form of the method supports using a custom transcoder for storing a
value.

<a id="table-couchbase-sdk_java_cas-expiry-transcoder"></a>

**API Call**                 | `client.cas(key, casunique, expiry, value, transcoder)`                                                                     
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**                  | `CASResponse` ( Check and set object )                                                                                      
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**long casunique**           | Unique value used to identify a key/value combination                                                                       
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

This form of the `cas()` method updates both the key value and the expiry time
for the value. For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

For example the following attempts to set the key `caskey` with an updated
value, setting the expiry times to 3600 seconds (one hour).


    `java
    Transcoder<Integer> tc = new IntegerTranscoder();
    CASResponse casr = client.cas("caskey", casvalue, 3600, 1200, tc);

<a id="table-couchbase-sdk_java_asynccas"></a>

**API Call**       | `client.asyncCAS(key, casunique, value)`                                                 
-------------------|------------------------------------------------------------------------------------------
**Description**    | Compare and set a value providing the supplied CAS key matches                           
**Returns**        | `Future<CASResponse>` ( Future value as CASResponse )                                    
**Arguments**      |                                                                                          
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.
**long casunique** | Unique value used to identify a key/value combination                                    
**Object value**   | Value to be stored                                                                       

Performs an asynchronous CAS operation on the given key/value. You can use this
method to set a value using CAS without waiting for the response. The following
example requests an update of a key, timing out after 5 seconds if the operation
was not successful.


    `java
    Future<CASResponse> future = client.asyncCAS("someKey", casvalue, "updatedvalue");

    CASResponse casr;

    try {
        casr = future.get(5, TimeUnit.SECONDS);
    } catch(TimeoutException e) {
        future.cancel(false);
    }

<a id="table-couchbase-sdk_java_asynccas-transcoder"></a>

**API Call**                 | `client.asyncCAS(key, casunique, value, transcoder)`                                     
-----------------------------|------------------------------------------------------------------------------------------
**Description**              | Compare and set a value providing the supplied CAS key matches                           
**Returns**                  | `Future<CASResponse>` ( Future value as CASResponse )                                    
**Arguments**                |                                                                                          
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.
**long casunique**           | Unique value used to identify a key/value combination                                    
**Object value**             | Value to be stored                                                                       
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                           

Performs an asynchronous CAS operation on the given key/value using a custom
transcoder. The example below shows the update of an existing value using a
custom Integer transcoder.


    `java
    Transcoder<Integer> tc = new IntegerTranscoder();
    Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 1200, tc);

    CASResponse casr;

    try {
        casr = future.get(5, TimeUnit.SECONDS);
    } catch(TimeoutException e) {
        future.cancel(false);
    }

<a id="table-couchbase-sdk_java_asynccas-expiry-transcoder"></a>

**API Call**                 | `client.asyncCAS(key, casunique, expiry, value, transcoder)`                                                                
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Compare and set a value providing the supplied CAS key matches                                                              
**Returns**                  | `Future<CASResponse>` ( Future value as CASResponse )                                                                       
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**long casunique**           | Unique value used to identify a key/value combination                                                                       
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The final form of the `asyncCAS()` method supports a custom transcoder and
setting the associated expiry value. For example, to update a value and set the
expiry to 60 seconds:


    `java
    Transcoder<Integer> tc = new IntegerTranscoder();
    Future<CASResponse> future = client.asyncCAS("someKey", casvalue, 60, 1200, tc);

    CASResponse casr;

    try {
        casr = future.get(5, TimeUnit.SECONDS);
    } catch(TimeoutException e) {
        future.cancel(false);
    }

<a id="couchbase-sdk-java-update-delete"></a>

## Delete Methods

The `delete()` method deletes an item in the database with the specified key.
Delete operations are asynchronous only.

<a id="table-couchbase-sdk_java_delete"></a>

**API Call**    | `client.delete(key)`                                                                     
----------------|------------------------------------------------------------------------------------------
**Description** | Delete a key/value                                                                       
**Returns**     | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                         
**Arguments**   |                                                                                          
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.

For example, to delete an item you might use code similar to the following:


    `java
    OperationFuture<Boolean> delOp =
        client.delete("samplekey");

    try {
        if (delOp.get().booleanValue()) {
            System.out.printf("Delete succeeded\n");
        }
        else {
            System.out.printf("Delete failed\n");
        }

    }
    catch (Exception e) {
        System.out.println("Failed to delete " + e);
    }

<a id="couchbase-sdk-java-delete-observe"></a>

## Delete Methods with Observe

<a id="table-couchbase-sdk_java_delete-persist"></a>

**API Call**       | `client.delete(key, persistto)`                                                                                                                                                                                                                                                                                             
-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**    | Delete a value using the specified key and observe it being persisted on master and more node(s).                                                                                                                                                                                                                           
**Returns**        | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                                                                                                                                                                                                                            
**Arguments**      |                                                                                                                                                                                                                                                                                                                             
**String key**     | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                   
**enum persistto** | Ability to specify Persist requirements to Master and more server(s). MASTER or ONE requires Persist to the Master. TWO requires Persist to at least two nodes including the Master. THREE requires Persist to at least three nodes including the Master. FOUR requires Persist to at least four nodes including the Master.

<a id="table-couchbase-sdk_java_delete-replicate"></a>

**API Call**         | `client.delete(key, persistto, replicateto)`                                                                                                                                                                                                                                                                                                                                                                 
---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description**      | Delete a value using the specified key and observe it being persisted on master and more node(s) and being replicated to one or more node(s).                                                                                                                                                                                                                                                                
**Returns**          | `OperationFuture<Boolean>` ( Operation Future value as Boolean )                                                                                                                                                                                                                                                                                                                                             
**Arguments**        |                                                                                                                                                                                                                                                                                                                                                                                                              
**String key**       | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                                                                                    
**enum persistto**   | Ability to specify Persist requirements to Master and more server(s). MASTER or ONE requires Persist to the Master. TWO requires Persist to at least two nodes including the Master. THREE requires Persist to at least three nodes including the Master. FOUR requires Persist to at least four nodes including the Master.                                                                                 
**enum replicateto** | Ability to specify Replication requirements to zero or more replicas. ZERO implies no requirements for the data to be replicated to the replicas. ONE implies requirements for the data to be replicated with at least one replica. TWO implies requirements for the data to be replicated with at least two replicas. THREE implies requirements for the data to be replicated with at least three replicas.

This method is identical to the `delete()` method, but supports the ability to
observe the deletion on the master and replicas.

Using these methods above, it's possible to set the deletion requirements for
the data on the nodes and distinguish between a physical delete (not found and
persisted) versus a logical delete (not found and not persisted).

The deletion persistence requirements can be specified in terms of how the data
should be deleted on the master and the replicas using `PeristTo` and
`ReplicateTo` respectively.

The client library will poll the server until the persistence requirements are
met. The method will return FALSE if the requirments are impossible to meet
based on the configuration (inadequate number of replicas) or even after a set
amount of retries the persistence requirments could not be met.

The program snippet below illustrates how to specify a requirement that the data
deletion should be persisted on 4 nodes (master and three replicas).


    `java
    // Perist of delete to all four nodes including master
    OperationFuture<Boolean> deleteOp =
       c.delete("key", PersistTo.FOUR);
    System.out.printf("Result was %b",deleteOp.get());

The peristence requirements can be specified for both the master and replicas.
In the case above, it's required that the key and value is deleted on all the 4
nodes (including replicas).

A slightly different requirement will ensure that that the key in the master is
physically deleted and the the key in the replicas are logically deleted (not
found).


    `java
    // Perist of delete to master and three replicas
    OperationFuture<Boolean> deleteOp =
       c.delete("key", PersistTo.MASTER, ReplicateTo.THREE);
    System.out.printf("Result was %b", deleteOp.get());

<a id="couchbase-sdk-java-update-decr"></a>

## Decrement Methods

The decrement methods reduce the value of a given key if the corresponding value
can be parsed to an integer value. These operations are provided at a protocol
level to eliminate the need to get, update, and reset a simple integer value in
the database. All the Java Client Library methods support the use of an explicit
offset value that will be used to reduce the stored value in the database.

<a id="table-couchbase-sdk_java_decr"></a>

**API Call**    | `client.decr(key, offset)`                                                                                                                                
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**     | `long` ( Numeric value )                                                                                                                                  
**Arguments**   |                                                                                                                                                           
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                 
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                   

The first form of the `decr()` method accepts the keyname and offset value to be
used when reducing the server-side integer. For example, to decrement the server
integer `dlcounter` by 5:


    `java
    client.decr("dlcounter",5);

The return value is the updated value of the specified key.

<a id="table-couchbase-sdk_java_decr-default"></a>

**API Call**    | `client.decr(key, offset, default)`                                                                                                                       
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**     | `long` ( Numeric value )                                                                                                                                  
**Arguments**   |                                                                                                                                                           
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                 
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                   
**int default** | Default value to increment/decrement if key does not exist                                                                                                

The second form of the `decr()` method will decrement the given key by the
specified `offset` value if the key already exists, or set the key to the
specified `default` value if the key does not exist. This can be used in
situations where you are recording a counter value but do not know whether the
key exists at the point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


    `java
    long newcount =
        client.decr("dlcount",1,1000);

    System.out.printf("Updated counter is %d\n",newcount);

A subsequent identical call will return the value 999 as the key `dlcount`
already exists.

<a id="table-couchbase-sdk_java_decr-default-expiry"></a>

**API Call**    | `client.decr(key, offset, default, expiry)`                                                                                                               
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**     | `long` ( Numeric value )                                                                                                                                  
**Arguments**   |                                                                                                                                                           
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                 
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                   
**int default** | Default value to increment/decrement if key does not exist                                                                                                
**int expiry**  | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                              

The third form of the `decr()` method the decrement operation, with a default
value and with the addition of setting an expiry time on the stored value. For
example, to decrement a counter, using a default of 1000 if the value does not
exist, and an expiry of 1 hour (3600 seconds):


    `java
    long newcount =
        client.decr("dlcount",1,1000,3600);

For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

<a id="table-couchbase-sdk_java_asyncdecr"></a>

**API Call**    | `client.asyncDecr(key, offset)`                                                                                                                           
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Decrement the value of an existing numeric key. The Couchbase Server stores numbers as unsigned values. Therefore the lowest you can decrement is to zero.
**Returns**     | `long` ( Numeric value )                                                                                                                                  
**Arguments**   |                                                                                                                                                           
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                 
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                   

The asynchronous form of the `asyncDecr()` method enables you to decrement a
value without waiting for a response. This can be useful in situations where you
do not need to know the updated value or merely want to perform a decrement and
continue processing.

For example, to asynchronously decrement a given key:


    `java
    OperationFuture<Long> decrOp =
        client.asyncDecr("samplekey",1,1000,24000);

<a id="couchbase-sdk-java-update-incr"></a>

## Increment Methods

The increment methods enable you to increase a given stored integer value. These
are the incremental equivalent of the decrement operations and work on the same
basis; updating the value of a key if it can be parsed to an integer. The update
operation occurs on the server and is provided at the protocol level. This
simplifies what would otherwise be a two-stage get and set operation.

<a id="table-couchbase-sdk_java_incr"></a>

**API Call**    | `client.incr(key, offset)`                                                                                                                                                                                                                                                                                                                    
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Increment the value of an existing numeric key. The Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**     | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                      
**Arguments**   |                                                                                                                                                                                                                                                                                                                                               
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                     
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                       

The first form of the `incr()` method accepts the keyname and offset (increment)
value to be used when increasing the server-side integer. For example, to
increment the server integer `dlcounter` by 5:


    `java
    client.incr("dlcounter",5);

The return value is the updated value of the specified key.

<a id="table-couchbase-sdk_java_incr-default"></a>

**API Call**    | `client.incr(key, offset, default)`                                                                                                                                                                                                                                                                                                           
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Increment the value of an existing numeric key. The Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**     | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                      
**Arguments**   |                                                                                                                                                                                                                                                                                                                                               
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                     
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                       
**int default** | Default value to increment/decrement if key does not exist                                                                                                                                                                                                                                                                                    

The second form of the `incr()` method supports the use of a default value which
will be used to set the corresponding key if that value does not already exist
in the database. If the key exists, the default value is ignored and the value
is incremented with the provided offset value. This can be used in situations
where you are recording a counter value but do not know whether the key exists
at the point of storage.

For example, if the key `dlcounter` does not exist, the following fragment will
return 1000:


    `java
    long newcount =
        client.incr("dlcount",1,1000);

    System.out.printf("Updated counter is %d\n",newcount);

A subsequent identical call will return the value 1001 as the key `dlcount`
already exists and the value (1000) is incremented by 1.

<a id="table-couchbase-sdk_java_incr-default-expiry"></a>

**API Call**    | `client.incr(key, offset, default, expiry)`                                                                                                                                                                                                                                                                                                   
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Increment the value of an existing numeric key. The Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**     | `long` ( Numeric value )                                                                                                                                                                                                                                                                                                                      
**Arguments**   |                                                                                                                                                                                                                                                                                                                                               
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                     
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                       
**int default** | Default value to increment/decrement if key does not exist                                                                                                                                                                                                                                                                                    
**int expiry**  | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).                                                                                                                                                                                                                  

The third format of the `incr()` method supports setting an expiry value on the
given key, in addition to a default value if key does not already exist.

For example, to increment a counter, using a default of 1000 if the value does
not exist, and an expiry of 1 hour (3600 seconds):


    `java
    long newcount =
        client.incr("dlcount",1,1000,3600);

For information on expiry values, see [Expiry
Values](#couchbase-sdk-java-summary-expiry).

<a id="table-couchbase-sdk_java_asyncincr"></a>

**API Call**    | `client.asyncIncr(key, offset)`                                                                                                                                                                                                                                                                                                               
----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Description** | Increment the value of an existing numeric key. The Couchbase Server stores numbers as unsigned numbers, therefore if you try to increment an existing negative number, it will cause an integer overflow and return a non-logical numeric result. If a key does not exist, this method will initialize it with the zero or a specified value.
**Returns**     | `Future<Long>` ( Future value as Long )                                                                                                                                                                                                                                                                                                       
**Arguments**   |                                                                                                                                                                                                                                                                                                                                               
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                                                                                                                                                                                                                                     
**int offset**  | Integer offset value to increment/decrement (default 1)                                                                                                                                                                                                                                                                                       

The `asyncIncr()` method supports an asynchronous increment on the value for a
corresponding key. Asynchronous increments are useful when you do not want to
immediately wait for the return value of the increment operation.


    `java
    OperationFuture<Long> incrOp =
        client.asyncIncr("samplekey",1,1000,24000);

<a id="couchbase-sdk-java-update-replace"></a>

## Replace Methods

The `replace()` methods update an existing key/value pair in the database. If
the specified key does not exist, then the operation will fail.

<a id="table-couchbase-sdk_java_replace"></a>

**API Call**     | `client.replace(key, expiry, value)`                                                                                        
-----------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**  | Update an existing key with a new value                                                                                     
**Returns**      | `Future<Boolean>` ( Future value as Boolean )                                                                               
**Arguments**    |                                                                                                                             
**String key**   | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**   | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value** | Value to be stored                                                                                                          

The first form of the `replace()` method updates an existing value setting while
supporting the explicit setting of the expiry time on the item. For example to
update the `samplekey` :


    `java
    OperationFuture<Boolean> replaceOp =
        client.replace("samplekey","updatedvalue",0);

The return value is a `OperationFuture` value with a `Boolean` base.

<a id="table-couchbase-sdk_java_replace-transcoder"></a>

**API Call**                 | `client.replace(key, expiry, value, transcoder)`                                                                            
-----------------------------|-----------------------------------------------------------------------------------------------------------------------------
**Description**              | Update an existing key with a new value                                                                                     
**Returns**                  | `Future<Boolean>` ( Future value as Boolean )                                                                               
**Arguments**                |                                                                                                                             
**String key**               | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**               | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).
**Object value**             | Value to be stored                                                                                                          
**Transcoder<T> transcoder** | Transcoder class to be used to serialize value                                                                              

The second form of the `replace()` method is identical o the first, but also
supports using a custom Transcoder in place of the default transcoder.

<a id="couchbase-sdk-java-update-touch"></a>

## Touch Methods

The `touch()` methods allow you to update the expiration time on a given key.
This can be useful for situations where you want to prevent an item from
expiring without resetting the associated value. For example, for a session
database you might want to keep the session alive in the database each time the
user accesses a web page without explicitly updating the session value, keeping
the user's session active and available.

<a id="table-couchbase-sdk_java_touch"></a>

**API Call**    | `client.touch(key, expiry)`                                                                                                 
----------------|-----------------------------------------------------------------------------------------------------------------------------
**Description** | Update the expiry time of an item                                                                                           
**Returns**     | `Future<Boolean>` ( Future value as Boolean )                                                                               
**Arguments**   |                                                                                                                             
**String key**  | Key used to reference the value. The key cannot contain control characters or whitespace.                                   
**int expiry**  | Expiry time for key. Values larger than 30\*24\*60\*60 seconds (30 days) are interpreted as absolute times (from the epoch).

The first form of the `touch()` provides a simple key/expiry call to update the
expiry time on a given key. For example, to update the expiry time on a session
for another 5 minutes:


    `java
    OperationFuture<Boolean> touchOp =
        client.touch("sessionid",300);

<a id="api-reference-stat"></a>

# Statistics Operations

The Couchbase Java Client Library includes support for obtaining statistic
information from all of the servers defined within a `CouchbaseClient` object. A
summary of the commands is provided below.

<a id="table-couchbase-sdk-java-stats-summary"></a>

Method                                                                 | Title                                  
-----------------------------------------------------------------------|----------------------------------------
[`client.getStats()`](#table-couchbase-sdk_java_getstats)              | Get the statistics from all connections
[`client.getStats(statname)`](#table-couchbase-sdk_java_getstats-name) | Get the statistics from all connections

<a id="table-couchbase-sdk_java_getstats"></a>

**API Call**    | `client.getStats()`        
----------------|----------------------------
**Description** | Get the database statistics
**Returns**     | `Object` ( Binary object ) 
**Arguments**   |                            
                | None                       

The first form of the `getStats()` command gets the statistics from all of the
servers configured in your `CouchbaseClient` object. The information is returned
in the form of a nested Map, first containing the address of configured server,
and then within each server the individual statistics for that server.

<a id="table-couchbase-sdk_java_getstats-name"></a>

**API Call**        | `client.getStats(statname)`                                       
--------------------|-------------------------------------------------------------------
**Description**     | Get the database statistics                                       
**Returns**         | `Object` ( Binary object )                                        
**Arguments**       |                                                                   
**String statname** | Group name of a statistic for selecting individual statistic value

The second form of the `getStats()` command gets the specified group of
statistics from all of the servers configured in your CouchbaseClient object.
The information is returned in the form of a nested Map, first containing the
address of configured server, and then within each server the individual
statistics for that server.

<a id="api-reference-view"></a>

# View/Query Interface

Couchbase Server 2.0 combines the speed and flexibility of Couchbase databases
with the powerful JSON document database technology of CouchDB into a new
product that is easy to use and provides powerful query capabilities such as
map-reduce. With Couchbase Server 2.0 you are able to keep using all of the
Couchbase code you already have, and upgrade certain parts of it to use JSON
documents without any hassles. In doing this, you can easily add the power of
Views and querying those views to your applications.

For more information on Views, how they operate, and how to write effective
map/reduce queries, see [Couchbase Server 2.0:
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
and [Couchbase Sever 2.0: Writing
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

The `View` Object is obtained by calling the `getView` method which provides
access to the view on the server.

<a id="table-couchbase-sdk_java_getview"></a>

**API Call**        | `client.getView(ddocname, viewname)`                 
--------------------|------------------------------------------------------
**Description**     | Create a view object to be used when querying a view.
**Returns**         | (none)                                               
**Arguments**       |                                                      
**String ddocname** | Design document name                                 
**String viewname** | View name within a design document                   


    `java
    View view = client.getView(docName, viewName)

Then obtain a new `Query` method.

<a id="table-couchbase-sdk_java_query-new"></a>

**API Call**    | `Query.new()`                                         
----------------|-------------------------------------------------------
**Description** | Create a query object to be used when querying a view.
**Returns**     | (none)                                                
**Arguments**   |                                                       
                | None                                                  


    `java
    Query query = new Query();

Once, the View and Query objects are available, the results of the server view
can be accessed as below.

<a id="table-couchbase-sdk_java_query"></a>

**API Call**    | `client.query(view, query)`              
----------------|------------------------------------------
**Description** | Query a view within a design doc         
**Returns**     | (none)                                   
**Arguments**   |                                          
**View view**   | View object associated with a server view
**Query query** | View object associated with a server view


    `java
    ViewResponse = client.query(view, query)

Before accessing the View, a list of options can be set with the query object.

 *  `setKey(java.lang.String key)`

    to set the starting Key.

 *  `setRangeStart(java.lang.String startKey)`

    to set the starting Key.

 *  `setRangeEnd(java.lang.String endKey)`

    to set the ending Key.

 *  `setRange(java.lang.String startKey, java.lang.String endKey)`

    to set the starting and ending key, both.

 *  `setDescending(boolean descending)`

    to set the descending flat to true or false.

 *  `setIncludeDocs(boolean include)`

    to Include the original JSON document with the query.

 *  `setReduce(boolean reduce)`

    where the reduce function is included or excluded based on the Flag.

 *  `setStale(Stale stale)`

    where the possible values for stale are `FALSE`, `UPDATE_AFTER` and `OK` as
    noted in the Release Notes.

The format of the returned information of the query method is:

`ViewResponse` or any of the other inherited objects such as
`ViewResponseWithDocs`, `ViewResponseNoDocs`, `ViewResponseReduced`.

The `ViewResponse` method provides a `iterator()` method for iterating through
the rows as a `ViewRow` interface. The `ViewResponse` method also provides a
`getMap()` method where the result is available as a map.

The following methods are available on the `ViewRow` interface.

 *  `getId()`

    to get the Id of the associated row.

 *  `getKey()`

    to get the Key of the associated Key/Value pair of the result.

 *  `getValue()`

    to get the Value of the associated Key/Value pair of the result.

 *  `getDocument()`

    to get the document associated with the row.

For usage of these classes, please refer to the [Tutorial](#tutorial) which has
been enhanced to include Views.

<a id="api-reference-troubleshooting"></a>

# Java Troubleshooting

This Couchbase SDK Java provides a complete interface to Couchbase Server
through the Java programming language. For more on Couchbase Server and Java
read our [Java SDK Getting Started
Guide](http://www.couchbase.com/develop/java/current) followed by our in-depth
Couchbase and Java tutorial. We recommended Java SE 6 (or higher) for running
the Couchbase Client Library.

This section covers the following topics:

 *  Logging from the Java SDK

 *  Handling Timeouts

 *  Bulk Load and Exponential Backoff

 *  Retrying After Receiving a Temporary Failure

<a id="java-api-configuring-logging"></a>

## Configuring Logging

Occasionally when you are troubleshooting an issue with a clustered deployment,
you may find it helpful to use additional information from the Couchbase Java
SDK logging. The SDK uses JDK logging and this can be configured by specifying a
runtime define and adding some additional logging properties. There are two ways
to set up Java SDK logging:

 *  Use spymemcached to log from the Java SDK. Since the SDK uses spymemcached and
    is compatible with spymemcached, you can use the logging provided to output
    SDK-level information.

 *  Set your JDK properties to log Couchbase Java SDK information.

 *  Provide logging from your application.

To provide logging via spymemcached:


    `java
    System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.SunLogger");

or


    `java
    System.setProperty("net.spy.log.LoggerImpl", "net.spy.memcached.compat.log.Log4JLogger");

The default logger simply logs everything to the standard error stream. To
provide logging via the JDK, if you are running a command-line Java program, you
can run the program with logging by setting a property:


    `java
    -Djava.util.logging.config.file=logging.properties

The other alternative is create a `logging.properties` and add it to your in
your classpath:


    `java
    logging.properties
    handlers = java.util.logging.ConsoleHandler
    java.util.logging.ConsoleHandler.level = ALL
    java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
    com.couchbase.client.vbucket.level = FINEST
    com.couchbase.client.vbucket.config.level = FINEST
    com.couchbase.client.level = FINEST

The final option is to provide logging from your actual Java application. If you
are writing your application in an IDE which manages command-line operations for
you, it may be easier if you express logging in your application code. Here is
an example:


    `java
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


    `java
    List<URI> baselist = new ArrayList<URI>();
            baselist.add(new URI("http://localhost:8091/pools"));

            CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
            cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

            CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));

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


    `java
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

There is also a setting you can provide at the connection-level for Couchbase
Java SDK that will also help you avoid too many asynchronous requests:


    `java
    List<URI> baselist = new ArrayList<URI>();
            baselist.add(new URI("http://localhost:8091/pools"));

            CouchbaseConnectionFactoryBuilder cfb = new CouchbaseConnectionFactoryBuilder();
            cfb.setOpTimeout(10000);  // wait up to 10 seconds for an operation to succeed
            cfb.setOpQueueMaxBlockTime(5000); // wait up to 5 seconds when trying to enqueue an operation

            CouchbaseClient myclient = new CouchbaseClient(cfb.buildCouchbaseConnection(baselist, "default", "default", ""));

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

<a id="couchbase-sdk-java-rn"></a>

#Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library Java. To browse or submit new issues, see [Couchbase
Client Library Java Issues
Tracker](http://www.couchbase.com/issues/browse/JCBC).

<a id="couchbase-sdk-java-rn_1-1-0c"></a>

## Release Notes for 1.1-dp3 Couchbase Client Library Java beta (19 September 2012)

**Fixes in 1.1-dp3**

 *  Default Observe poll latency has been changed to 100ms.

    *Issues* : [JCBC-109](http://www.couchbase.com/issues/browse/JCBC-109)

 *  The options with Views as documented in
    [http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing-querying-errorcontrol.html)
    is available. The options STOP and CONTINUE can be set as below.


        `java
        query.setOnError(OnError.CONTINUE);

    *Issues* : [JCBC-25](http://www.couchbase.com/issues/browse/JCBC-25)

 *  Operation Status message has been changed from hard coded value to be based on
    tunable parameters.

    *Issues* : [JCBC-107](http://www.couchbase.com/issues/browse/JCBC-107)

 *  Netty has been upgraded to 3.5.5.

    *Issues* : [JCBC-106](http://www.couchbase.com/issues/browse/JCBC-106)

**Known Issues in 1.1-dp3**

 *  The Paginator object has been changed to handle this. The following code listing
    illustrates how to use the Paginator object and iterate through the pages and
    between the rows.


        `java
        Paginator result = client.paginatedQuery(view, query, 15);

         while (result.hasNext()) {
         ViewResponse response = result.next();
         for (ViewRow row: response) {
         System.out.println("Next Row: " + row.getId());
         }
         System.out.println("<=== Page ====>");
         }

    *Issues* : [JCBC-40](http://www.couchbase.com/issues/browse/JCBC-40)

<a id="couchbase-sdk-java-rn_1-1-0b"></a>

## Release Notes for 1.1-dp2 Couchbase Client Library Java beta (23 August 2012)

**New Features and Behaviour Changes in 1.1-dp2**

 *  The `set()` and `delete()` methods now support the ability to observe the
    persistence on the master and replicas. Using these methods, it's possible to
    set the persistence requirements for the data on the nodes.

    These methods are supported in Couchbase server build 1554 or higher.

    The persistence requirements can be specified in terms of how the data should be
    persisted on the master and the replicas using `PeristTo` and `ReplicateTo`
    respectively.

    The client library will poll the server until the persistence requirements are
    met. The method will return FALSE if the requirments are impossible to meet
    based on the configuration (inadequate number of replicas) or even after a set
    amount of retries the persistence requirments could not be met.

    The program snippet below illustrates how to specify a requirement that the data
    should be persisted on 4 nodes (master and three replicas).


        `java
        // Perist to all four nodes including master
        OperationFuture<Boolean> setOp =
         c.set("key", 0, "value", PersistTo.FOUR);
        System.out.printf("Result was %b", setOp.get());

    The program snippet below illustrates how to specify a requirement that the data
    deletion should be persisted on 4 nodes (master and three replicas).


        `java
        // Perist of delete to all four nodes including master
        OperationFuture<Boolean> deleteOp =
         c.delete("key", PersistTo.FOUR);
        System.out.printf("Result was %b",deleteOp.get());

    The program snippet below illustrates how to specify a requirement that the data
    deletion should be persisted on 4 nodes (master and three replicas).


        `java
        // Perist of delete to all four nodes including master
        OperationFuture<Boolean> deleteOp =
         c.delete("key", PersistTo.FOUR);
        System.out.printf("Result was %b",deleteOp.get());

    The peristence requirements can be specified for both the master and replicas.
    In the case above, it's required that the key and value is persisted on all the
    4 nodes (including replicas).

    The same persistence requirment can be specified in a slightly different form as
    below.


        `java
        // Perist to master and three replicas
        OperationFuture<Boolean> setOp =
         c.set("key", 0, "value", PersistTo.MASTER, ReplicateTo.THREE);
        System.out.printf("Result was %b", setOp.get());

    The same persistence requirment can be specified in a slightly different form as
    below.


        `java
        // Perist of delete to master and three replicas
        OperationFuture<Boolean> deleteOp =
         c.delete("key", PersistTo.MASTER, ReplicateTo.THREE);
        System.out.printf("Result was %b", deleteOp.get());

**Fixes in 1.1-dp2**

 *  The Java client library throws exception for non-200 http view responses.

    *Issues* : [JCBC-72](http://www.couchbase.com/issues/browse/JCBC-72)

 *  The issue is now fixed.

    *Issues* : [JCBC-20](http://www.couchbase.com/issues/browse/JCBC-20)

 *  The Getting Started has a brief explanation of JSON and has a simple example of
    persisting JSON data.

    *Issues* : [JCBC-97](http://www.couchbase.com/issues/browse/JCBC-97)

 *  This issue is now fixed.

    *Issues* : [JCBC-68](http://www.couchbase.com/issues/browse/JCBC-68)

 *  This issue is now fixed.

    *Issues* : [JCBC-69](http://www.couchbase.com/issues/browse/JCBC-69)

**Known Issues in 1.1-dp2**

 *  unlock() method does not check for server errors. The method should check for
    the error and raise an exception.

    *Issues* : [SPY-97](http://www.couchbase.com/issues/browse/SPY-97)

<a id="couchbase-sdk-java-rn_1-1-0a"></a>

## Release Notes for 1.1DP Couchbase Client Library Java Alpha (16 March 2012)

**New Features and Behaviour Changes in 1.1DP**

 *  The Views functionality has been added to the Couchbase-client library. Views is
    available starting with Couchbase Server 2.0. For more details on this feature
    refer to [Couchbase Server
    Manual](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html).

    The purpose of a view is take the structured data stored within your Couchbase
    Server database as JSON documents, extract the fields and information that is
    needed, and to produce an index of the selected information. The result is a
    view on the stored data.

    The view that is created during this process can be iterated, selected and
    queried with the information in the database from the raw data objects that have
    been stored using Java objects such as `View`, `Query`, `ViewFuture`,
    `ViewResponse` and `ViewRow`.

    The following code fragment illustrates how to use the objects and access the
    view.


        Query query = new Query();

         query.setReduce(false);
         query.setIncludeDocs(true);
         query.setStale(Stale.FALSE);

         // Specify the design and document (by default production mode)
         View view = client.getView("chat", "messages");

         if (view == null) {
         // Take corrective action
         }

         ViewResponse result = client.query(view, query);

         Iterator<ViewRow> itr = result.iterator();
         ViewRow row;

         while (itr.hasNext()) {
         row = itr.next();
         String doc = (String) row.getDocument();
         // Do something for each row
         }

**Fixes in 1.1DP**

 *  The `CouchbaseConnectionFactory` which was not being closed properly has been
    fixed. The [TapConnectionProvider
    patch](http://www.couchbase.com/issues/browse/JCBC-16) has been integrated.

<a id="licenses"></a>

#Appendix: Licenses

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



