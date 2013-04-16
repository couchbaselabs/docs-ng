# Advanced Topics in Development

This chapter is dedicated to illustrating common development you will likely
encounter while building a more complex web application on Couchbase SDKs. It
describes the concepts and process for performing different types of data
transactions available with Couchbase Server, and provides sample code and data.
The following topics are covered:

 * Performing a Bulk Get

 * Asynchronous and Synchronous Transactions

 * Performing Transactions

 * Optimizing Use of Client Instances

 * Improving Application Performance

 * Handling Common Errors

 * Troubleshooting

<a id="populating-cb"></a>

## Performing a Bulk Set

During development or production you will probably want to add
application-specific seed data into Couchbase. This may be data you use to test
your application during development, or it may be application-specific content
that is pre-populated, such as catalog data.

In general, you need three elements in place to do a bulk upload:

 * Set of data you want to upload. This can be cleanly structured information in a
   file, a JSON document, or information in a database.

 * Program in the SDK language of your choice. This program that you write will
   connect to Couchbase Server, read the file or data into memory and then store it
   to Couchbase Server. You program will typically have an event loop to loop
   through all the elements you want to store and store them.

 * Any supporting classes used to represent that data you want to store. In some
   cases you may be storing simple data which can be stored in your loader program
   as primitive types, in which case you do not need to create a class.

The following PHP example demonstrates a bulk set of sample data on beers and
breweries. Sample code and data for this example are at Github:
[import.php](https://github.com/couchbaselabs/couchbase-beers/blob/beernique/import.php)
and [beer and brewey sample
data](https://github.com/couchbaselabs/couchbase-beers/tree/beernique/beer-sample).

First, here is an example of a JSON record for a beer. This particular beer is
in the `beer_#17_Cream_Ale.json` file in the `beer-sample/beer` directory.


```
{
    "_id":"beer_#17_Cream_Ale",
    "brewery":"Big Ridge Brewing",
    "name":"#17 Cream Ale",
    "category":"North American Lager",
    "style":"American-Style Lager",
    "updated":"2010-07-22 20:00:20"
}
```

We also have brewery data with each brewery in a JSON file located in
`beer-sample/breweries`. Finally we create the script that reads in the
directories and stores each file as a record in Couchbase Server:


```
<?php

// Set up Couchbase client object
try {
  $cb = new Couchbase(COUCHBASE_HOST.':'.COUCHBASE_PORT, COUCHBASE_USER, COUCHBASE_PASSWORD, COUCHBASE_BUCKET);
} catch (ErrorException $e) {
  die($e->getMessage());
}

// import a directory
function import($cb, $dir) {
  $d = dir($dir);
  while (false !== ($file = $d->read())) {
    if (substr($file, -5) != '.json') continue;
    echo "adding $file\n";
    $json = json_decode(file_get_contents($dir . $file), true);
    unset($json["_id"]);
    echo $cb->set(substr($file, 0, -5), json_encode($json));
    echo "\n";
  }
}

// import beers and breweries
import($cb, 'beer-sample/beer/');
import($cb, 'beer-sample/breweries/');

?>
```

We first create a Couchbase client, then we declare an `import` function which
will read in our files and write them to Couchbase Server. While the import
function reads each file into memory, we repeat the same set of operations for
each file. If the file is not a JSON file we convert it into JSON. We also omit
the first attribute of '\_id' from the file since we already provide unique file
names and use the filename itself as a key; therefore we do not need this as a
unique identifier. Then we store the value to Couchbase Server as JSON and use
the filename, minus the.json file extension as the key for each record.

<a id="handling-temp-oom"></a>

## Handling Temporary Out of Memory Errors

There may be cases where you are performing operations at such a high volume,
that you need to decrease your requests to a rate your environment can handle.
For instance Couchbase Server may return a temporary out of memory response
based on a heavy request volume, your network can be slow, or your operations
may be returning too many errors. You can handle this scenario by creating a
loop that performs exponential backoff. With this technique, you have your
process increasingly wait to a point if your requests stall.

One of the typically errors that may occur when you bulk load of data is that
Couchbase Server returns an out of memory error due to the volume of requests.
To handle this, you would follow this approach:

 * Create a loop that continuously tries your operation within a certain number of
   time limit, and possible a certain number of tries,

 * In the loop, attempt your operation,

 * If you get an out of memory error, have your process/thread wait,

 * Try the operation again,

 * If you get an error again, increase your wait time, and wait. This part of the
   approach is known as the exponential backoff.

This is a similar approach you could use for any Couchbase SDK, and for any
operation you are performing in bulk, such as getting in bulk. The following
example shows this approach using the Java SDK:


```
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
            status = result.getStatus(); // blocking call

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

 }
```

In the first part of our `try..catch` loop, we have a `do..while` loop which
continuously tries to set a key and value. In this loop we specify the amount of
time the application waits, in milliseconds, as `backoffMillis`, and we increase
it exponentially each time we receive a runtime exception. We will only
exponentially increase the wait time a certain number of times, which we specify
in the parameter, `tries`.

The other approach you can try if you get temporary out of memory errors from
the server is to explicitly pace the timing of requests you make. You can do
this in any SDK by creating a timer and only perform a Couchbase request after a
specific timed interval. This will provide a slight delay between server
requests and will reduce the risk of an out of memory error. For instance in
Ruby:


```
c.set("foo", 100)
n = 1

c.run do
    c.create_periodic_timer(500000) do |tm|
        c.incr("foo") do
            if n == 5
                tm.cancel
      else
        n += 1
      end
    end
  end
end
```

In this example we create a sample record 'foo' with the initial fixnum value of
100. Then we create a increment count set to one, to indicate the first time we
will create a Couchbase request. In the event loop, we create a timing loop that
runs every.5 seconds until we have repeated the loop 5 times and our increment
is equal to 5. In the timer loop, we increment 'foo' per loop.

<a id="synchronous-and-asynchronous"></a>

## Synchronous and Asynchronous Transactions

Some Couchbase SDKs support both synchronous and asynchronous transactions. In
the case of synchronous transactions, your application pauses its execution
until a response is returned from the Couchbase Server. In the case of
asynchronous commands, your application can continue performing other,
background operations until Couchbase Server responds. Asynchronous operations
are particularly useful when your application accesses persisted data, or when
you are performing data sets and updates.

In the case of a typical asynchronous call, your application handles something
that does not depend on a server response, and the result is still being
computed on the server. The object that is eventually returned by an
asynchronous call is often referred to as a future object, which is
non-blocking. That is, the server returns the object sometime in the future,
after the original method call requesting it, and the object is non-blocking
because it does not interfere with the continued execution of the application.

Please refer to your chosen SDK to find out more about which methods are
available for asynchronous transactions, as of this writing, asynchronous calls
are available in the Java and Ruby SDKs only.

The following is an example showing the typical pattern you use to create an
asynchronous transaction; in an asynchronous transaction, we store a record and
process something in the meantime. Then we either successfully perform a `get()`
and retrieve the future object, or cancel the process. This example is in Java:


```
//perform a set asynchronously; return from set not important now

OperationFuture<Boolean> setOp = client.set(KEY, EXP_TIME, VALUE);

//do something in meantime

//check to see if set successful via get, if not fail
//the get will block application flow

if (setOp.get().booleanValue()) {
    System.out.println("Set Succeeded");
} else {
    System.err.println("Set failed:" + setOp.getStatus().getMessage());
}
```

Other operations such as `get()` can be used asynchronously in your application.
Here is a second example in Java:


```
GetFuture getOp = client.asyncGet(KEY);

//do something in meantime

//check to see if get successful
//if not cancel

if ((getObject = getOp.get()) != null {
    System.out.println("Asynchronous get succeeded: " + getObject);
} else {
    System.err.println("Asynchronous get failed: " + getOp.getStatus().getMessage());
}
```

This last example demonstrates use of `delete()` in Java as in an asynchronous
transaction:


```
// Do an asynchronous delete
OperationFuture<Boolean> delOp = null;

if (do_delete) {
     delOp = client.delete(KEY);
}

//do something in meantime

// Check to see if our delete succeeded

if (do_delete) {
    try {
        if (delOp.get().booleanValue()) {
            System.out.println("Delete Succeeded");
    } else {
        System.err.println("Delete failed: " + delOp.getStatus().getMessage());
    }
    } catch (Exception e) {
            System.err.println("Exception while doing delete: " + e.getMessage());
  }
}
```

This next example shows how asynchronous call can be made using the Ruby SDK.
When you use this mode in the Ruby SDK, you execute the operation and it returns
control immediately without performing any input/output. As in the case of Java,
we perform the asynchronous operation and later we use a callback that either
successfully retrieve the future value or it fails and reports on the error:


```
Couchbase.bucket.run do |c|
    c.set("foo", "bar") do |res1|
      # res1 is the Couchbase::Bucket::Result instance
      if res1.success?
        c.get("foo") do |res2|
          puts res.value if res2.success?
      end
      else
            puts "Something wrong happened: #{res1.error.message}"
        end
    end
end
```

In the callback for our Ruby example, we perform a get from the SDK that will be
called as soon as a response is ready. The callback received a result object,
and we can check if the value was set with the `success?` method. If the value
is true, then the record has been successfully set; otherwise you should assume
call failed and check the error property of the result, which will be an
exception object.

In the case of PHP, `getDelayed()` and `getDelayedByKey()` are the two available
asynchronous methods for the SDK. Both methods can retrieve one or more key; the
major difference between `getDelayed()` and `getDelayedByKey()` is that the
later will retrieve a record from a specified node. Here is an example of
`getDelayed()` :


```
<?php

$cb = new Couchbase("127.0.0.1:8091");

$cb->set('int', 99);
$cb->set('string', 'a simple string');
$cb->set('array', array(11, 12));

$cb->getDelayed(array('int', 'array'), true);
var_dump($cb->fetchAll());

?>
```

In this case `getDelayed()` will make a request to Couchbase Server for multiple
items in the array. The method does not wait and returns immediately. When you
want to collect all the items, you perform a `fetch()` or `fetchAll()` as well
do in the last line of this example.

All the Couchbase SDKs support synchronous transactions. In the most basic form
a synchronous call will block, or wait for a response from the Couchbase Server
before program execution continues. The most standard form of any method in a
Couchbase SDK is synchronous in its functioning. In this case of synchronous
calls, typically the return is assigned to variable, or used immediately
afterwards in the applications, such as output or display.

<a id="handling-transactions"></a>

## Providing Transactional Logic

In another chapter of this guide, "Structuring Data" [Modeling
Documents](couchbase-devguide-ready.html#modeling-documents), we discuss much
more in depth the advantages you gain when you use JSON documents with Couchbase
Server; we also discuss when you might want to use more than one document to
represent an object. Here we want to discuss how to perform operations on data
across one or more documents while providing some reliability and consistency.
In traditional relational database systems, this is the concept of database
concept of ACIDity:

 * Atomicity means that if a transaction fails, all changes to related records fail
   and the data is left unchanged,

 * Consistency means data must be valid according to defined rules, for instance
   you cannot delete a blog post without also deleting all of the related comments,

 * Isolation means that concurrent transactions would create the same data as if
   that transactions were executed sequentially,

 * Durability means that once the transaction completes, the data changes survive
   system failure.

Relational databases will typically rely on locking or versioning data to
provide ACID capabilities. Locking means the database marks data so that no
other transactions modify it until the first transaction succeeds; versioning
means the database provides a version of the data that existed before one
process started a process.

NoSQL databases generally do not support transactions in the traditional way
used by relational databases. Yet there are many situations where you might want
to use Couchbase Server to build an application with transactional logic. With
Couchbase Server you can generally improve the reliability, consistency, and
isolation of related commits by 1) providing 'leases' on information, which
reserves the document for use by a single process, or 2) by performing two-phase
commits on multiple documents.

<a id="reserving-documents"></a>

### Using a 'Lease-Out' Pattern

When you use this web application pattern, you 'lease-out' information, or in
other words, reserve a document for use by a single process. By doing so, you
manage any conflicts with any other processes that my attempt to access the
document. Imagine you want to build an online ticketing system that meets the
following rules:

 * All seats being ticketed are unique; no two seats are the same,

 * A user can purchase a ticket once the system guarantees a seat,

 * A user might not complete a ticket purchase,

 * The ticket should be available to the user at checkout.

To fulfill these requirements, we can use these techniques:

 * Document Model: Provide one document per ticket.

 * Lease/Reserve: Implement a lease for tickets. Once a user chooses a seat, we
   reserve the ticket and a user has 5 minutes to purchase it.

 * Manage States, and Compensate: A seat can be made available again; expired
   tickets can be offered once again. If there are failures when a ticket is in an
   intermediate state, the system can compensate.

**Unhandled:** `[:unknown-tag :sidebar]` The process would look like this if
follow the basic application flow:


![](couchbase-devguide-2.0/images/lease_out_pattern1.png)

The initial stage of our ticket document, as JSON, would appear as follows:


```
{
    "ticket_id" : "ticket1",
    "seat_no" : 100,
    "state" : "AVAILABLE"
}
```

The ticket document has an unique id, an associated seat, and an explicit
`state` field to store that state of our ticket transaction. We can use this
information in our application logic to ensure no other process tries to reserve
the seat. We can also use this information to roll-back the ticket to an initial
state. Imagine a user searches for open seats, and then they want a seat that is
unavailable. Our system can get all the tickets that were requested but not
purchased by other users; these will all be tickets with expired leases. So we
can also use this information to reserve seats and return seats to a pool of
available seats that we offer to users. If a user selects a open seat, we put
the ticket in their shopping cart, and indicate this in the ticket document:


```
{
    "ticket_id" : "ticket1",
    "seat_no" : 100,
    "state" : "INCART",
    "expiry" : <timestamp>
}
```

Notice that when we update the state of the ticket, we also provide an
expiration. The `expiry` in this case is 5 minutes, and serves as the lease, or
time hold that is in place on the ticket so that no other processes can modify
it during that period. The user now has 5 minutes to pay for the ticket. If a
user moves forward with the purchase, our application should then get each
ticket in the user cart from Couchbase Server and test that the tickets in the
user shopping cart have not expired. If the ticket lease has not expired, we
update the state to `PRE-AUTHORIZE` :


```
{
    "ticket_id" : "ticket1",
    "seat_no" : 100,
    "state" : "PRE-AUTHORIZE",
    "expiry" : <updated_timestamp>
}
```

Note at this phase we also update the timestamps to 5 minutes once again; this
provides the additional time we may need to authorize payment from a credit
card, or get an electronic payment for the ticket. If the payment fails, for
instance the credit card is not authorized, we can reset the tickets to the
state `AVAILABLE`. Our system will know that the ticket can be returned to the
pool of available tickets that we present to users. If the payment succeeds, we
then set the ticket state to `SOLD` and set the expiration to 0:


```
{
    "ticket_id" : "ticket1",
    "seat_no" : 100,
    "state" : "SOLD",
    "expiry" : 0
}
```

So we set the expiration explicitly to 0 to indicate the ticket has no
expiration since it is sold. We keep the document in the system so that the user
can print it out, and as a record until the actual event is over. Here is the
process once again, this time we also demonstrate the state changes which keep
track of the ticket along with the application flow:


![](couchbase-devguide-2.0/images/lease_out_pattern_w_tickets.png)

This diagram shows some of the compensation mechanisms we can put in place. If
the seat that a user selects is not `AVAILABLE` we can reset all the tickets
that are expired to `AVAILABLE` and retrieve them for the user. If the user
fails to complete the checkout, for instance their credit card does not clear,
we can also reset that ticket state to `AVAILABLE` so that it is ready to
retrieve for other users. At each phase of the user interaction, we keep track
of the ticket state so that it is reserved for checkout and payment. If the
system fails and the ticket is persisted, we can retrieve that state and return
the user to the latest step in the purchase they had achieved. Also by
preserving the ticket state and expiration, we withhold it from access and
changes by other users during the payment process.

An alternate approach you can use with this same pattern is to have a ticketing
system that offers a fixed number of general admission tickets. In this case, we
can use lazy expiration in Couchbase Server to remove all the tickets once the
event has already passed.

<a id="two-phase-commits"></a>

### Performing Two-Phase Commits

For traditional relational databases, we can store information for an object in
one or more tables. This helps us from having a lot of duplicate information in
a table. In the case of a document database, such as Couchbase Server, we can
store the high level information in a JSON document and store related
information in a separate JSON documents.

This leads to the challenge of transactions in document-based databases. In
relational databases, you are able to change both the blog post and the comments
in a single transaction. You can undo all the changes from the transaction via
rollback, ensure you have a consistent version of the data during the
transaction, or in case of system failure during the transaction, leave the data
in a state that is easier to repair.

The Ruby and PHP examples we describe here plus two slightly more complex
versions are available on Github:

 * [Ruby basic example](https://gist.github.com/3135796)

 * [Ruby class](https://gist.github.com/3136027) to represent the two-phase commit,
   including counters.

 * [PHP basic
   example](https://gist.github.com/3155132/2301591fa9d2dddbf3c2578ad1369703493c5aef)

 * [PHP Advanced Transaction](https://gist.github.com/3155762), includes checks,
   JSON helpers, encapsulation, and counters.

**Unhandled:** `[:unknown-tag :sidebar]` With Couchbase Server, you can
generally provide something functional analogous to an atomic transaction by
performing a two-phase commit. You follow this approach:


![](couchbase-devguide-2.0/images/two_phase_commit.png)

Here is the same approach demonstrated in actual code using the Couchbase Ruby
SDK. To view the complete code, as well as a slightly more complex version, see
[sample two-phase transaction](https://gist.github.com/3135796) and
[transfer()](https://gist.github.com/3136027). First we start by storing the
documents/objects that we want to update. The example below shows how to create
the new Couchbase client, and then store two players and their points:


```
require 'rubygems'
require 'couchbase'

cb = Couchbase.bucket

karen = {"name" => "karen", "points" => 500, "transactions" => []}
dipti = {"name" => "dipti", "points" => 700, "transactions" => []}

# preload initial documents

cb.set("karen", karen)
cb.set("dipti", dipti)
```

We then create a third record that represents the transaction between the two
objects:


```
# STEP 1: prepare transaction document

trans = {"source" => "karen", "destination" => "dipti", "amount" => 100, "state" => "initial"}
cb.set("trans:1", trans)
```

Then we set the transfer state to `pending`, which indicates the transfer
between karen and dipti is in progress. Notice in this case we do this in a
`begin..rescue` block so that we can perform a rollback in the `rescue` in case
of server/system failure.

Next in our `begin..rescue` block we refer the two documents we want to update
to the actual transfer document. We then update the amounts in the documents and
change the transfer status to `committed` :


```
begin

    # STEP 2: Switch transfer into pending state

    cb.cas("trans:1") do
    trans.update("state" => "pending")
    end

    # STEP 3 + 4: Apply transfer to both documents

    cb.cas("karen") do |val|
        val.update("points" => val["points"] - 100,
        "transactions" => val["transactions"] + ["trans:1"])
    end

    cb.cas("dipti") do |val|
        val.update("points" => val["points"] + 100,
        "transactions" => val["transactions"] + ["trans:1"])
    end

    # STEP 4: Switch transfer document into committed state

    cb.cas("trans:1") do |val|
        val.update("state" => "committed")
    end
```

In this case we have combined both steps 3 and 4 into three cas operations: one
operation per document. In other words, we update the documents to refer to the
transfer, and we also update their points. Depending on your programming
languages, it may be easier to combine these two, or keep them separate updates.

For this last step in the `begin..rescue` block we change remove the two
references from the player documents and update the transfer to be `done`.


```
# STEP 5: Remove transfer from the documents

    cb.cas("karen") do |val|
        val.update("transactions" => val["transactions"] - ["trans:1"])
    end

    cb.cas("dipti") do |val|
        val.update("transactions" => val["transactions"] - ["trans:1"])
    end

    # STEP 5: Switch transfer into done state

    cb.cas("trans:1") do |val|
        val.update("state" => "done")
    end
```

To perform the rollback, we had placed all of our update operations in a
`begin..rescue..end` block. If there are any failures during the `begin` block,
we will execute the `rescue` part of the block. In order to undo the transfer
when it is left in a particular state, we have a `case` statement to test
whether the transfer failed at a pending, commit, or done status:


```
rescue Couchbase::Error::Base => ex

    # Rollback transaction

    trans = cb.get("trans:1")

    case trans["state"]

        when "committed"

            # Create new transaction and swap the targets or amount sign.
            # The code block about could be wrapped in the method something like
            #
            #     def transfer(source, destination, amount)
            #     ...
            #   end
            #
            # So that this handler could just re-use it.

        when "pending"
            # STEP 1: Switch transaction into cancelling state

            cb.cas("trans:1") do |val|
                val.update("state" => "cancelling")
            end

            # STEP 2: Revert changes if they were applied

            cb.cas("karen") do |val|
                break unless val["transactions"].include?("trans:1")
                val.update("points" => val["points"] + 100,
                "transactions" => val["transactions"] - ["trans:1"])
            end

            cb.cas("dipti") do |val|
                break unless val["transactions"].include?("trans:1")
                val.update("points" => val["points"] - 100,
                 "transactions" => val["transactions"] - ["trans:1"])
            end

            # STEP 3: Switch transaction into cancelled state

            cb.cas("trans:1") do |val|
                val.update("state" => "cancelled")
            end

      end

    # Re-raise original exception
    raise ex

end
```

As the comments in the code note, it may be most useful to put the entire
transfer, including the rollback into a new `transfer` method. As a method, it
could include a counter, and also take parameters to represent the documents
updated in a transfer. This variation also uses a cas value with `update` to
rollback the transfer; this is to avoid the unintended risk of rewriting the
entire transfer document. To see the complete sample code provided above, as
well as a Ruby variation which includes the code as a `transfer()` method, see
[sample two-phase transaction](https://gist.github.com/3135796) and
[transfer()](https://gist.github.com/3136027).

This next illustration shows you the diagram we initially introduced to you at
the start of this section. but this we update it to show when system failures
may occur and the rollback scenario you may want to provide. Depending on the
programming language that you use, how you implement the rollbacks may vary
slightly:


![](couchbase-devguide-2.0/images/two-phase-rollback.png)

The next example demonstrates a transaction using the PHP SDK; as in the Ruby
example provided above, we follow the same process of creating a separate
transfer document to track the state of our changes. To see the example we
illustrate above, as well as the alternate class, see [Two-Phase PHP Couchbase
Commit](https://gist.github.com/3155132/2301591fa9d2dddbf3c2578ad1369703493c5aef)
and [Advanced Two-Phase PHP Couchbase Commit](https://gist.github.com/3155762)

In this case we provide the functionality within a single exception class which
manages the commits as well as the possible rollback cases based on errors.
First we establish some base elements before we actually set any documents

Here we create our `Transaction` class which will throw an error if any issues
arise as we try to perform our transaction. We then provide a public method,
`transfer()` which we can use to retrieve the documents and decode the JSON. We
can provide parameters to this method that specify the document from which we
remove points, also known as the source document, and the document to which we
add points, also known as the destination document. We can also provide the
client instance and the amount of the transaction as parameters. We will use the
client instance as our connection to the server. Within the `transfer()`
function we try to create and store the new document which represents the actual
transfer:


```
<?php

class TransactionException extends RuntimeException {}

function transfer($source, $destination, $amount, &$cb) {
      $get = function($key, $casOnly = false) use (&$cb) {
          $return = null;
          $cb->getDelayed(array($key), true, function($cb, $data) use(&$return, $casOnly) {
              $return = $casOnly ? $data['cas'] : array(json_decode($data['value'], true), $data['cas']);
                  });
              return $return;
      };

      if($cb->get('transaction:counter') === null) {
          $cb->set('transaction:counter', 0);
      }

        $id = $cb->increment('transaction:counter', 1);

        $state = 'initial';
        $transKey = "transaction:$id";

        $transDoc = compact('source', 'destination', 'amount', 'state');
        $cb->set($transKey, json_encode($transDoc));
        $transactionCas = $get($transKey, true);

          if(!$transactionCas) {
                throw new TransactionException("Could not insert transaction document");
        }
```

The first thing we do is try to retrieve any existing, named document
`transaction:counter` and if it does not exist, create a new one with the
default counter of 0. We then increment the id for our transfer and set the
state and key. Finally we perform the SDK store operation `set()` to save the
document as JSON to Couchbase Server. In the `transfer()` function, we use a
`try..catch` block to try to update the transfer to a pending state and throw an
exception if we cannot update the state:

In the `try` block we try to retrieve the stored documents and apply the
attributes from the documents provided as parameters. We also provide a
reference to the new transfer document in the source and destination documents
as we described in our illustration.

We perform a check and set operations to update the source and destination
documents in the `try` block; if either attempts fail and return false, we raise
an exception. We then update the transfer document in Couchbase Server to
indicate the commit state is now committed:


```
try {
                $transDoc['state'] = 'pending';
                if(!$cb->cas($transactionCas, $transKey, json_encode($transDoc))) {
                       throw new TransactionException("Could not switch to pending state");
                }

                list($sourceDoc, $sourceCas) = $get($source);
                list($destDoc, $destCas) = $get($destination);

                $sourceDoc['points'] -= $amount;
                $sourceDoc['transactions'] += array($transKey);
                $destDoc['points'] += $amount;
                $destDoc['transactions'] += array($transKey);

                if(!$cb->cas($sourceCas, $source, json_encode($sourceDoc))) {
                         throw new TransactionException("Could not update source document");
                }

                if(!$cb->cas($destCas, $destination, json_encode($destDoc))) {
                         throw new TransactionException("Could not update destination document");
                }
            $transDoc['state'] = 'committed';
                $transactionCas = $get($transKey, true);

                if(!$cb->cas($transactionCas, $transKey, json_encode($transDoc))) {
                        throw new TransactionException("Could not switch to committed state");
                }
```

Again in the `try` block we throw an exception if we fail to update the transfer
state. We then remove the reference to the transfer for the source and
destination documents. At the end of our `try` we update the transfer document
so that it is marked as 'done':


```
list($sourceDoc, $sourceCas) = $get($source);
                list($destDoc, $destCas) = $get($destination);

                $sourceDoc['transactions'] = array_diff($sourceDoc['transactions'], array($transKey));
                $destDoc['transactions'] = array_diff($destDoc['transactions'], array($transKey));

                if(!$cb->cas($sourceCas, $source, json_encode($sourceDoc))) {
                       throw new TransactionException("Could not remove transaction from source document");
                }

                if(!$cb->cas($destCas, $destination, json_encode($destDoc))) {
                       throw new TransactionException("Could not remove transaction from destination document");
                 }

            $transDoc['state'] = 'done';
                $transactionCas = $get($transKey, true);
                if(!$cb->cas($transactionCas, $transKey, json_encode($transDoc))) {
                        throw new TransactionException("Could not switch to done state");
                }
```

We can now handle any system failures in our `transfer()` function with
exception handling code which looks at the state of our two-phase commit:


```
} catch(Exception $e) {

              // Rollback transaction

              list($transDoc, $transCas) = $get($transKey);

              switch($transDoc['state']) {

                     case 'committed':
                            // create new transaction and swap the targets
                            transfer($destination, $source, $amount, $cb);
                        break;

                     case 'pending':

                          // STEP 1: switch transaction into cancelling state

                          $transDoc['state'] = 'cancelling';
                          $transactionCas = $get($transKey, true);

                          if(!$cb->cas($transactionCas, $transKey, json_encode($transDoc))) {
                               throw new TransactionException("Could not switch into cancelling state");
                          }

                          // STEP 2: revert changes if applied

                          list($sourceDoc, $sourceCas) = $get($source);
                          list($destDoc, $destCas) = $get($destination);

                          if(in_array($transKey, $sourceDoc['transactions'])) {
                                 $sourceDoc['points'] += $amount;
                                 $sourceDoc['transactions'] = array_diff($sourceDoc['transactions'], array($transKey));
                                 if(!$cb->cas($sourceCas, $source, json_encode($sourceDoc))) {
                                      throw new TransactionException("Could not revert source document");
                                 }
                           }

                          if(in_array($transKey, $destDoc['transactions'])) {
                                 $destDoc['points'] -= $amount;
                                 $destDoc['transactions'] = array_diff($destDoc['transactions'], array($transKey));
                                 if(!$cb->cas($destCas, $destination, json_encode($destDoc))) {
                                        throw new TransactionException("Could not revert destination document");
                                 }
                          }

                          // STEP 3: switch transaction into cancelled state

                          $transDoc['state'] = 'cancelled';
                          $transactionCas = $get($transKey, true);
                          if(!$cb->cas($transactionCas, $transKey, json_encode($transDoc))) {
                                 throw new TransactionException("Could not switch into cancelled state");
                          }

                      break;
              }

            // Rethrow the original exception
            throw new Exception("Transaction failed, rollback executed", null, $e);

       }

}
```

If the transfer is in a indeterminate state, such as 'pending' or 'committed'
but not 'done', we flag the document as in the process of being cancelled and
then revert the values for the stored documents into their original states. To
revert the documents, we use the `transfer()` method again, but this time we
invert the parameters and provide the destination as the source of points and
source as the destination of points. This will take away the amount from the
destination and revert them back to the source. This final sample code
illustrates our new class and `transfer()` method in action:


```
$cb = new Couchbase('localhost:8091');

$cb->set('karen', json_encode(array(
           'name' => 'karen',
           'points' => 500,
           'transactions' => array()
        )));

$cb->set('dipti', json_encode(array(
            'name' => 'dipti',
            'points' => 700,
            'transactions' => array()
       )));

transfer('karen', 'dipti', 100, $cb);

?>
```

There is also another variation for handling transactions with the Couchbase PHP
SDK that relies on helper functions to create the document objects, and to
provide the additional option to create a document if it does not exist in
Couchbase Server. The sample is slightly more complex, but handles cases where
the documents do not already exist in Couchbase Server, and cases where the
documents provided as parameters are only partial values to be added to the
stored documents. To see the example we illustrate above, as well as the
alternate class, see [Two-Phase PHP Couchbase
Commit](https://gist.github.com/3155132/2301591fa9d2dddbf3c2578ad1369703493c5aef)
and [Advanced Two-Phase PHP Couchbase
Commit](https://gist.github.com/3155132/2301591fa9d2dddbf3c2578ad1369703493c5aef)

<a id="getting_and-locking"></a>

### Getting and Locking

Retrieving information from back end or remote systems might be slow and consume
a lot of resources. You can use advisory locks on records in order to control
access to these resources. Instead of letting any client access Couchbase Server
and potentially overwhelm the server with high concurrent client requests, you
could create an advisory lock to allow only one client at a time access the
information.

You can create a lock in Couchbase by setting an expiration on specific item and
by using the `add()` and `delete()` methods to access that named item. The
`add()` and `delete()` methods are atomic, so you can be assured that only one
client will become the advisory lock owner.

The first client that tries to add a named lock item with an expiration timeout
will succeed. Other clients will see error responses to an `add()` command on
that named lock item; they will know that some other client owns the named lock
item. When the current lock owner is finished owning the lock, it can send an
explicit `delete()` command on the named lock item to free the lock.

If a client that owns a lock crashes, the lock will automatically become
available to the next client that requests for lock via `add()` after the
expiration timeout.

As a convenience, several Couchbase SDKs provide `get-and-lock` as a single
operation and single server request. This will accomplish the functional
equivalent of adding a lock and deleting it. The following is an example from
the Python SDK:


```
import uuid

key, value = str(uuid.uuid4()), str(uuid.uuid4())

client.set(key, 0, 0, value)
client.getl((key)[2], value)
client.set(key, 0, 0, value)
```

After we set the key and values to unique strings, we lock the key. The
subsequent `set()` request will fail and return an error.

<a id="improving-application-performance"></a>

## Improving Application Performance

There are few main variables that can impact application performance which you
can help control and manage:

 * Getting cluster sizing correct for your application load,

 * Structuring documents for efficient reads/writes,

 * Using SDK methods which are more efficient for the operation you want to
   perform.

 * Optimize your use of Couchbase client connections.

Correctly sizing your cluster is one of the most important tasks you need to
complete in order to provide good performance. Couchbase Server performs best
when you have smaller documents in your data set, and when a large majority of
this data set is in RAM. This means you need to take into consideration the size
of your application data set and how much of this data set will be in active,
constant use. This set of actively used data is also called your 'working set.'
In general, 99% of your working set should be in RAM. This means you need to
plan your cluster and size your RAM data buckets to handle your working set.

<a id="cb-server-cluster-sizing"></a>

### Performing Cluster Sizing

Before your application goes into production, you will need to determine your
cluster size. This includes:

 * Determine how many initial nodes will be required to support your user base,

 * Determine how much capacity you need for data storage and processing in terms of
   RAM, CPU, disk space, and network bandwidth.

 * Determine the level of performance availability you want.

For instance, if you want to provide high-availability for even a smaller
dataset, you will need a minimum of three nodes for your cluster. For detailed
information about determining cluster and resource sizing, see Couchbase Server
Manual: Sizing Guidelines.

<a id="cb-improving-doc-access"></a>

### Improving Document Access

The way that you structure documents in Couchbase Server will influence how
often retrieve them for their information, and will therefore influence
application performance. Given identical document size for your entire data set,
it takes more operations to retrieve two documents than it does one document;
therefore there are scenarios where you can reduce the number of reads/write you
perform on Couchbase Server if you perform the reads/writes on one document
instead of many documents. In doing so, you improve application performance by
structuring your documents in way that optimizes read/write times.

The following goes back to our beer application example and illustrates all the
additional operations you would need to perform if you used separate documents.
In this case, pretend our beer application has a 'leader board.' This board has
all of the top 10 best selling beers that exist in our application. Imagine what
this leader board document would look like:


```
{
    "board_id": 222
    "leader_board": "best selling"
    "top_sales" : [ "beer_id" : 75623,
                    "beer_id" : 98756,
                    "beer_id" : 2938,
                    "beer_id" : 49283,
                    "beer_id" : 204857,
                    "beer_id" : 12345,
                    "beer_id" : 23456,
                    "beer_id" : 56413,
                    "beer_id" : 24645,
                    "beer_id" : 34502
                  ],
     "updated": "2010-07-22 20:00:20"
}
```

In the example document above, we store a reference to a top-selling beer in the
'top\_sales' array. A specific beer in that list of beers could look like this
document:


```
{
    "beer_id" :  75623,
    "name" : "Pleny the Felder"
    "type" : "wheat",
    "aroma" : "wheaty",
    "category": "koelsch",
    "units_sold": 37011,
    "brewery" : ”brewery_Legacy_Brewing_Co”
}
```

If we use this approach, we need to 1) retrieve the leader board document from
Couchbase Server, 2) go through each element in the 'top\_sales' array and
retrieve each beer from Couchbase Server, 3) get the 'units\_sold' value from
each beer document. Consider the alternative when we use a single leader board
document with the relevant beer sales:


```
{
    "board_id": 222
    "leader_board": "best selling"
    "top_sales" : [ { "beer_id" : 75623, "units_sold": 37011, "name": "Pleny the Felder" },
                    { "beer_id" : 98756, "units_sold": 23002, "name": "Sub-Hoptimus" },
                    { "beer_id" : 2938, "units_sold": 23001, "name": "Speckled Hen" },
                    { "beer_id" : 49283, "units_sold": 11023, "name": "Happy Hops" },
                    { "beer_id" : 204857, "units_sold": 9856, "name": "Bruxulle Rouge" },
                    { "beer_id" : 12345, "units_sold": 7654, "name": "Plums Pilsner" },
                    { "beer_id" : 23456, "units_sold": 7112, "name": "Humble Amber Lager" },
                    { "beer_id" : 56413, "units_sold": 6723, "name": "Hermit Dopplebock" },
                    { "beer_id" : 24645, "units_sold": 6409, "name": "IAM Lambic" },
                    { "beer_id" : 34502, "units_sold": 5012, "name": "Inlaws Special Bitter" }
                  ],
    "updated": "2010-07-22 20:00:20"
}
```

In this case, we only need to perform a single request to get the leader board
document from Couchbase Server. Then within our application logic, we can get
each of leading beers from that document. Instead of eleven database requests,
we have a single request, which is far less time- and resource- consuming as
having multiple server requests. So when you creating or modifying document
structures, keep in mind this approach.

<a id="optimizing-method-calls"></a>

### Using the Fastest Methods

There are several Couchbase SDK APIs which are considered 'convenience' methods
in that they provide commonly used functionality in a single method call. They
tend to be less resource intensive processes that can be used in place of a
series of `get()/set()` calls that you would otherwise have to perform to
achieve the same result. Typically these convenience methods enable you to
perform an operation in single request to Couchbase Server, instead of having to
do two requests. The following is a summary of recommended alternative calls:

 * Multi-Get/Bulk-Get: When you want to retrieve multiple items and have all of the
   keys, then performing a multi-get retrieves all the keys in a single request as
   opposed to a request per key. It is therefore faster and less resource intensive
   than performing individual, sequential `get()` calls. The following demonstrates
   a multi-get in Ruby:

    ```
    keys = ["foo", "bar","baz"]

    // alternate method signatures for multi-get

    conn.get(keys)

    conn.get(["foo", "bar", "baz"])

    conn.get("foo", "bar", "baz")
    ```

   Each key we provide in the array will be sent in a single request, and Couchbase
   Server will return a single response with all existing keys. Consult the API
   documentation for your chosen SDK to find out more about a specify method call
   for multi-gets.

 * Increment/Decrement: These are two other convenience methods which enable you to
   perform an update without having to call a `get()` and `set()`. Typically if you
   want to increment or decrement an integer, you would need to 1) retrieve it with
   a request to Couchbase, 2) add an amount to ithe value if it exists, or set it
   to an initial value otherwise and 3) then store the value Couchbase Server. If a
   key is not found, Couchbase Server will store the initial value, but not
   increment or decrement it as part of the operation. With increment and decrement
   methods, you can perform all three steps in a single method call, as we do in
   this Ruby SDK example:

    ```
    client.increment("score", :delta => 1, :initial => 100);
    ```

   In this example in we provide a key, and also two other parameters: one is an
   initial value, the later is the increment amount. Most Couchbase SDKs follow a
   similar signature. The first parameter is the key you want to increment or
   decrement, the second parameter is an initial value if the value does not
   already exist, and the third parameter is the amount that Couchbase Server will
   increment/decrement the existing value. In a single server request and response,
   increment and decrement methods provide you the convenience of establishing a
   key-document if it does not exist, and provide the ability to
   increment/decrement. Over thousands or millions of documents, this approach will
   improve application performance compared to using `get()/set()` to perform the
   functional equivalent.

 * Prepend/Append: These two methods provide the functional equivalent of: 1)
   retrieving a key from Couchbase Server with a request, 2) adding binary content
   to the document, and then 3) making a second request to Couchbase Server to
   store the updated value. With prepend and append, you can perform these three
   steps in a single request to Couchbase Server. The following illustrates this in
   Python. To see the full example in Python, including encoding and decoding the
   data, see [Maintaining a
   Set](http://blog.couchbase.com/maintaining-set-memcached) :

    ```
    def modify(cb, indexName, op, keys):
        encoded = encodeSet(keys, op)
        try:
            cb.append(indexName, encoded)
        except KeyError:
            # If we can't append, and we're adding to the set,
            # we are trying to create the index, so do that.
            if op == '+':
                cb.add(indexName, encoded)

    def add(mc, indexName, *keys):
        """Add the given keys to the given set."""
        modify(cb, indexName, '+', keys)

    def remove(cb, indexName, *keys):
        """Remove the given keys from the given set."""
        modify(cb, indexName, '-', keys)
    ```

   This example can be used to manage a set of keys, such as `'a', 'b', 'c'` and
   can indicate that given keys are including or not included in a set by using
   `append`. For instance, given a set `'a', 'b', 'c'`, if you update the set to
   read `+a +b +c -b` this actually represents `{a, c}`. We have method `modify()`
   which will take a Couchbase client object, a named set, an operator, and keys.
   The `modify()` tries to append the new key with the operator into the named set,
   and since append fails if the set does not exist, `modify` can add the new set.

   Compared to using a separate `get()` call, appending the string to the start of
   the document, then saving the document back to Couchbase with another request,
   we have accomplished it in a single call/request. Once again you improve
   application performance if you substitute `get()/set()` sequences, with a single
   append or prepend; this is particular so if you are performing this on thousands
   or millions of documents.

`Append()/Prepend()` can add raw serialized data to existing data for a key. The
Couchbase Server treats an existing value as a binary stream and concatenates
the new content to either beginning or end. Non-linear, hierarchical formats in
the database will merely have the new information added at the start or end.
There will be no logic which adds the information to a certain place in a stored
document structure or object.

Therefore, if you have a serialized object in Couchbase Server and then append
or prepend, the existing content in the serialized object will not be extended.
For instance, if you `append()` an integer to an Array stored in Couchbase, this
will result in the record containing a serialized array, and then the serialized
integer.

<a id="optimizing-client-instances"></a>

### Optimizing Client Instances

Creating a new connection to Couchbase Server from an SDK, is done by creating
an instance of the Couchbase client. When you create this object, it is one of
the more resource-consuming processes that you can perform with the SDKs.

When you create a new connection, Couchbase Server needs to provide current
server topology to the client instance and it may also need to perform
authentication. All of this is more time consuming and resource intensive
compared to when you perform a read/write on data once a connection already
exists. Because this is the case, you want to try to reduce the number of times
you need to create a connection and attempt to reuse existing connections to the
extent possible.

There are different approaches for each SDK on connection reuse; some SDKs use a
connection-pool approach, some SDKs rely more on connection reuse. Please refer
to the Language reference for your respective SDK for information on how to
implement this. The other approach is to handle multiple requests from a single,
persistent client instance. The next section discusses this approach.

<a id="cb-persistent-connections"></a>

### Maintaining Persistent Connections

Couchbase SDKs support persistent connections which enable you to send multiple
requests and receive multiple responses using the same connection. How the
Couchbase SDKs implement persistent connections varies by SDK. Here are the
respective approaches you can use:

 * PHP: Persistent connections for PHP clients are actually persistent memory that
   we use across multiple requests in a PHP process. Typically you use one PHP
   process per system process. The web server that is currently in use in your
   system will determine this. To configure the PHP SDK to maintain a persistent
   connection you would use these parameters in your connection:

    ```
    $cb = new Couchbase("192.168.1.200:8091", "default", "", "default", true);

    // uses the default bucket
    ```

   This example uses the default bucket. Arguments include host:port, username,
   password, bucket name, and true indicates we want to use a persistent
   connection. For more information, refer to the [Couchbase PHP SDK Language
   Reference.](http://www.couchbase.com/docs/couchbase-sdk-php-1.1/api-reference-connection.html)

 * Java: When you create connection with the Java SDK, the connection is a
   thread-safe object that can be shared across multiple processes. The alternative
   is that you can create a connection pool which contains a multiple connection
   objects.

   For more information, see [Couchbase Java SDK: Connecting to the
   Server.](http://www.couchbase.com/docs/couchbase-sdk-java-1.1/api-reference-connection.html)

 * .Net: Connections that you create with the.net SDK are also thread-safe objects;
   for persisted connections, you can use a connection pool which contains multiple
   connection objects. You should create only a single static instance of a
   Couchbase client per bucket, in accordance with.Net framework. The persistent
   client will maintain connection pools per server node. For more information, see
   [MSDN: AppDomain
   Class](http://msdn.microsoft.com/en-us/library/system.appdomain(v=vs.71).aspx).
   You can also find more information about client instances and connection for
   the.Net SDK at [.Net Connection
   Operations](http://www.couchbase.com/docs/couchbase-sdk-net-1.2/api-reference-connection.html)

 * You can persist a Couchbase client storing it in a way such that the Ruby
   garbage collector does not remove from memory. To do this, you can create a
   singleton object that contains the client instance and the connection
   information. You should access the class-level method, `Couchbase.bucket`
   instead of `Couchbase.connect` to get the client instance.

   When you use `Couchbase.bucket` it will create a new client object when you
   first call it and then store the object in thread storage. If the thread is
   still alive when the next request is made to the ruby process, the SDK will not
   create a new client instance, but rather use the existing one:

    ```
    # Simple example to connect using thread local singleton

    Couchbase.connection_options = {
      :bucket => "my",
      :hostname => "example.com",
      :password => "secret"
    }

    # this call will user connection_options to initialize new connection.
    # By default Couchbase.connection_options can be empty
    Couchbase.bucket.set("foo", "bar")

    # Amend the options of the singleton connection in run-time
    Couchbase.bucket.reconnect(:bucket => "another")
    ```

   The first example demonstrates how you can create a client instance as a
   singleton object, the second one will use the class-level `Couchbase.bucket`
   constructor to create a persistent connection. The last example demonstrates how
   you can update the properties of the singleton connection if you reconnect.

For more information about persistent connections for an SDK, see the individual
Language Reference for your chosen SDK.

<a id="threading-in-sdks"></a>

## Thread-Safety for Couchbase SDKs

Developers typically want to know which Couchbase SDKs are thread-safe. In most
programming languages a thread is associated with a single use of a program to
serve one user. For multiple users you typically create and maintain a separate
thread for each user. 'Thread-safe' means the Couchbase SDK can spawn additional
processes at the system level; the processes will access and change shared
objects and data in the runtime environment in a way that guarantees safe
execution of multiple process.

When a language or framework is not truly thread safe, multiple processes that
try to share objects may corrupt object data, and may lead to inconsistent
results. For instance sharing the same client object from multiple threads could
lead to retrieving the wrong value for a key requested by a thread, or no value
at all.

When you develop with Couchbase Server, creating a multi-threaded application is
particularly helpful for sharing a client instance across multiple processes.
When you create a new client instance, it is a relatively time-consuming and
resource intensive process compared to other server requests. When you can reuse
a client instance, multiple processes with multiple requests can reuse the
connection to Couchbase Server. Therefore being able to safely reuse client
objects across multiple processes can improve application performance.

Languages such as.Net and Java have in built-in support for thread-safety, and
the Couchbase Java and.Net SDKs have been certified as being thread-safe if you
utilize thread-safety mechanisms provided by the two languages with the SDKs.

Note that the client object you create with a Couchbase SDK does not spawn
additional threads to handle multiple requests. Therefore to provide
multi-threading and client object reuse even for SDKs that are thread-safe, you
will need to implement connection pools and other language-specific
thread-safety measures.

The following Couchbase SDKs are developed and tested as thread safe:

 * Java SDK 1.0 and above

 * .Net SDK 1.0 and above

The Couchbase C library is not tested or implemented as thread-safe. This means
you cannot safely share a connection instance between threads. You also cannot
make a copy of the connection with the current connection settings and pass it
to another thread.

There are several Couchbase SDKs that rely on the underlying Couchbase C library
for Couchbase Server communications, namely Couchbase SDKs based on scripting
languages. Since these libraries are also dependent on the C library, they not
certified as thread-safe. This includes the ruby, PHP, and Perl SDKs for
Couchbase.

However there are alternatives for these SDKs that can enable safe reuse of
client objects for multiple processes. The rest of this section describes some
of these techniques.

The Ruby languages provides a class called `Thread` so you can reuse a client
object for multiple requests:


```
require 'couchbase'

# setup default connection options

Couchbase.connection_options = {:bucket => 'mybucket', :port => 9000}

threads = []

      5.times do |num|
          threads << Thread.new do
              Couchbase.bucket.set("key-#{num}", "val-#{num}")
              sleep(1)
              end
      end

threads.map(&:join)
```

In the example we create a new local variable called `Thread`, with one local
variable per thread. Each local instance has an individual client object which
share the same connection objects. Individual thread instances could also
establish more connections if needed. An alternate is to clone a client object.
The following shows how you can duplicate an existing connection to a separate
object which maintains the same connection information, but can be used safely
by another thread:


```
conn1 = Couchbase.connect(:bucket => 'mybucket')

conn2 = conn1.dup
```

When you use the Ruby method `dup` it will make a copy of the Couchbase client
object and will create a new connection for that object using parameters from
the original client object.

<a id="handling-common-errors"></a>

## Handling Common Errors

This section describes resources and approaches to handling client- and server-
side errors.

<a id="about-client-timeouts"></a>

### Client-Side Timeouts

Timeouts that occur during your application runtime can be configured on the
Couchbase Client SDK side. In most cases, you should also assume that your
client application will need to receive Couchbase timeout information and handle
the timeout appropriately.

This section is not intended to be a comprehensive guide on timeouts and
performance tuning for your application; it provides some of the most useful,
basic information about SDK-level timeout settings. It also describes
considerations and trade-offs you should have in mind when you design your
application to address timeouts.

In general, there are few possible ways to handle timeouts from Couchbase client
SDKs:

 * Trigger another action, such as displaying default content or providing user
   with alternative action,

 * Slow down the number of requests you are making from your application,

 * Indicate system overload.

In many cases, a developer's first instinct is to set very low timeouts, such as
100ms or less, in the hope that this will guarantee requests/responses happen in
a certain time. However one possible consequence of setting very low timeouts is
even a minor network delay of a few milliseconds can trigger a timeout. Timeouts
usually means that a Couchbase SDK will retry an operation which puts more
unneeded traffic on the networks and other systems used in your application. In
other scenarios developers may have inherited an application they want to use
with Couchbase Server, but the application has not been originally designed to
handle timeout information returned by Couchbase Server.

In either of these scenario, the risk is to assume that setting aggressive
timeouts at the SDK-level will make a transaction occur in a certain time. Doing
so may erroneously lead to even more performance bottlenecks for your
application.

Timeouts are actually intended as a way to trigger your application to make a
decision should a response not happen by a certain time. In other words, it is
still your application's responsibility, and your responsibility as a developer
to appropriately handle types of requests that will take longer, or not return
at all. Time requirements for your application are best handled in your own
application logic.

Setting timeouts so that an operation can fail fast can frequently be the right
approach if your application is appropriately designed to do something in the
case of a timeout, or slow response. For instance, if you want to set data and
it does not happen quickly, it may not be significant for your application's
usability. You may want your application to provide some default result to
display, or do nothing. In other cases, your application may have to display a
general "all systems busy" to reflect the heavy concurrent demand.

One common error to avoid is the case where you destroy a client instance and
recreate a new client object every time a timeout occurs. This is especially so
when you set an aggressively low timeout. Creating a new client is a heavier,
slower process; if you developed an application that responded to timeouts this
way, you would significantly impact performance.

The other approach to consider in your application logic is to actually provide
a 'relief valve' by slowing your application down during certain operations. For
instance, in the context of bulk loading, you want to load as much information
as quickly as possible, but slow down the response of your application for the
user when the load is not progressing.

Be aware too that with web applications, there may be a timeout that occurs
elsewhere in the system which is generated outside of the control of Couchbase
Server and Couchbase Client SDKs. For instance, most web application servers
will not let a request continue indefinitely.

The default timeout for any given node in a Couchbase cluster is 2.5 seconds. If
a Couchbase SDK does not receive a response from the server by this time, it
will drop the connection to Couchbase Server and attempt to connect to another
node.

Applications built on Couchbase can have timeouts configured at the following
levels:

 * Connection-level settings

 * Authentication-level settings

 * Request-level settings

The Couchbase PHP SDK does not have any connection, authentication, or request
timeouts which are configurable, however you can build timeouts which are
managed by your own application.

The following are timeouts that can be set for a connection to Couchbase Server
from the Java SDK:

<a id="about-client-timeouts-java"></a>

Parameter                 | Description                                                                                                                                                                                              | Default Setting
--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------
MaxReconnectDelay         | Maximum number of milliseconds to wait between reconnect attempts.                                                                                                                                       | 30 seconds     
ShouldOptimize            | If multiple requests simultaneously occur for same record, the record will be retrieved only once from the database and then returned to each request. This eliminates the need for multiple retrievals. | true           
OpQueueMaxBlockTime       | The maximum amount of time, in milliseconds a client will wait to add a new item to a queue.                                                                                                             | 10 milliseconds
OpTimeout                 | Operation timeout used by this connection.                                                                                                                                                               | 2.5 seconds    
TimeoutExceptionThreshold | Maximum number of timeouts allowed before this connection will shut down.                                                                                                                                | 998 timeouts   

If you performing asynchronous transactions, you should be aware that performing
these operations allocates memory at a low level. This can create a lot of
information that needs to be garbage-collected by a VM, which will also slow
down your application performance.

The following are some of the frequently-used timeouts that you set for a
connection to Couchbase Server from the.Net SDK. for a full list of timeouts,
their defaults, and their descriptions for.Net, please see [Couchbase.Net SDK,
Configuration](http://www.couchbase.com/docs/couchbase-sdk-net-1.2/couchbase-sdk-net-configuration.html)
:

<a id="about-client-timeouts-net"></a>

Parameter          | Description                                                                                                         | Default Setting
-------------------|---------------------------------------------------------------------------------------------------------------------|----------------
retryTimeout       | The amount of time to wait in between failed attempts to read cluster configguration.                               | 2 seconds      
observeTimeout     | Time to wait attempting to connect to pool when all nodes are down. In milliseconds.                                | 1 minute       
httpRequestTimeout | The amount of time to wait for the HTTP streaming connection to receive cluster configuration                       | 1 minute       
connectionTimeout  | The amount of time the client waits to establish a connection to the server, or get a free connection from the pool | 10 seconds     

The following are timeouts that typically can be set for a connection to
Couchbase Server from the Ruby SDK:

<a id="about-client-timeouts-ruby"></a>

Parameter | Description                                                                       | Default Setting      
----------|-----------------------------------------------------------------------------------|----------------------
\:timeout | Maximum number of microseconds to wait for a connection or a read/write to occur. | 2500000 microseconds.

In the case of the Ruby SDK, you can set a timeout for the initial connection,
and then change the timeout setting. This new connection-level setting will
apply to any subsequent read/write requests made with the client instance:


```
conn = Couchbase.connect(:timeout => 3_000_000)
conn.timeout = 1_500_000
conn.set("foo", "bar")
```

In this example, we create a new Couchbase client instance with
`Couchbase.connect()` and set the connection time out to 3 seconds. If the
client instance fails to connect in the three seconds, it will timeout and
return a failure to connect error. Then we set the timeout to 1.5, which will be
the timeout level of any requests made with that client instance, such as the
`set()`.

The following is the standard, default, non-configurable timeout for the
Couchbase C and PHP SDKs. This timeout applies to creating a connection to the
server and all read- and write- operations:

<a id="about-client-timeouts-c-and-php"></a>

Description                                                                                | Default Setting      
-------------------------------------------------------------------------------------------|----------------------
Default, maximum number of microseconds to wait for a connection or a read/write to occur. | 2500000 microseconds.

<a id="cb-client-troubleshooting"></a>

## Troubleshooting

This section provides general, non-SDK specific information about logging,
backups and restores, as well as failover information. For more information,
please refer to the Language Reference for your chosen SDK as well as the
[Couchbase Server Manual
2.0](http://www.couchbase.com/docs/couchbase-manual-2.0/index.html)

<a id="cb-configuring-logs"></a>

### Configuring Logs

You can configure logging at a few different levels for Couchbase Server:

 * Couchbase Server logs. The primary source for logging information is Couchbase
   Administrative Console. The installation for Couchbase Server automatically sets
   up and starts logging for you. There are also optional, lower level logs which
   you can configure. For more information, see Couchbase Server Manual,
   "Troubleshooting."

 * SDK-specific log errors. For more information, refer to the Language Reference
   for your chosen SDK.

<a id="cb-handling-backups-restores"></a>

### Backups and Restores

Backing up your information should be a regular process you perform to help
ensure you do not lose all your data in case of major hardware or other system
failure.

**Unhandled:** `[:unknown-tag :sidebar]` For more information on backups and
restores, see Couchbase Server Manual, "Backup and Restore with Couchbase."

<a id="cb-handling-failover"></a>

### Handling Failover

When a Couchbase Server node fails, any other node functioning in the cluster
will continue to process requests and provide responses and you will experience
no loss of administrative control. Couchbase SDKs will try to communicate to a
failed node, but will receive a message that the requested information cannot be
found on the failed node; an SDK will then request updated cluster information
from Couchbase Server then communicate with nodes that are still active. Since
Couchbase Server distributes information across nodes, and also stores replica
data, information from any failed node will still exist in the cluster and an
SDK can access it.

There are two ways to handle possible node failures with Couchbase Server:

 * Auto-failover: You can specify the maximum amount of time a node is unresponsive
   and then Couchbase Server will remove that node from a cluster. For more
   information, see Couchbase Server Manual, Node Failure.

 * Manual-failover: In this case, a person will determine that a node is down, and
   then remove the node from a cluster.

In either case, when a node is removed, Couchbase Server will automatically
redistribute information from that node to all other functioning nodes in the
cluster. However, at this point, the existing nodes will not have replicas
established for the additional data. In order to provide replication, you will
want to perform a rebalance on the cluster. The rebalance will:

 * Redistribute stored data across remaining nodes in the cluster,

 * Create replica data for all buckets in the cluster,

 * Provide information on the new location for information, based on SDK requests.

In general, rebalances with Couchbase Server have less of a performance impact
than you would expect with a traditional relational database, with all other
factors such as size of data set as a constant. However, rebalances will
increase the overload load and resource utilization for a cluster and will lead
to some amount of performance loss. Therefore, it is a best practice to perform
a rebalance after node failure during the lowest application use, if possible.
After rebalance, you could choose to perform one of these options:

 * Leave the cluster functioning with one less node. Be aware that the cluster
   still needs to adequately maintain the volume of requests and data with one less
   node,

 * If possible, get the failed node functioning once again, add it to the cluster
   and then rebalance,

 * Create a new node to replace the failed node, add it to the cluster, and then
   rebalance.

For more information about this topic, see Couchbase Server Manual, "Handling a
Failover Situation."

<a id="creating-client-library"></a>
