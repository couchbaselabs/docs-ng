# Twisted Interface

[twisted](http://www.twistedmatrix.com) is a popular asynchronous network framework
for Python. Version 1.1.1 supports `twisted` natively through the `txcouchbase`
module.

The twisted interface builds on the synchronous interface mentioned in the previous
chapter.

Note that the Twisted interface is currently considered to be evolving in terms
of stability and interface. As such, the `couchbase.experimental` feature must
be explicitly imported and enabled in order to use.

## Connecting

```python
from couchbase.experimental import enable as enable_experimental
enable_experimental()
from txcouchbase.connection import Connection as TxCouchbase

client = TxCouchbase(bucket='default')
```

The `TxCouchbase` constructor will return a new `Connection` object (actually
a subclass of the synchronous connection class) which you can then use to
perform operations.

You can invoke the client's `.connect()` method which will actually return a
`Deferred` object which can be used to receive notification of the connection
or its failure.

```python
class Thing(object):
    def __init__(self):
        self.client = TxCouchbase(bucket='default')
        d = self.client.connect()
        d.addCallback(self.on_connect_success)
        d.addErrback(self.on_connect_error)

    def on_connect_error(self, err):
        print "Got error", err
        # Handle it, it's a normal Failure object
        self.client._close()
        err.trap()

    def on_connect_success(self):
        print "Couchbase Connected!"

thing = Thing()
reactor.run()
```

**Initial Connection Errors**

>It is currently recommended to call the `._close()` method on the connection
>instance if a connection error is detected. Otherwise the program may busy
>loop until the `Connection` object is automatically garbage collected.


## Performing Operations

The model for the twisted operation interface is simple. Where the synchronous API
returns a `Result` class, the twisted interface returns a `Deferred` which will
invoke its `callback` with the received `Result` once it is available.

```python
client = TxCouchbase(bucket='default')

def on_get(result):
    print "Got result", result

def on_set(result):
    print "Set item", result
    client.get(result.key).addCallback(on_get)

client.set("foo", "bar").addCallback(on_set)
reactor.run()
```

```
Set item OperationResult<RC=0x0, Key=u'foo', CAS=0xbd3671590b5a0100>
Got result ValueResult<RC=0x0, Key=u'foo', Value=u'bar', CAS=0xbd3671590b5a0100, Flags=0x0>
```

To handle errors, simply add the error callback via the returned `Deferred` object's
`addErrback` method.

```python
def on_get_miss(err, key):
    print "Couldn't fetch", key
    

client = TxCouchbase(bucket='default')
client.delete('foo', quiet=True)
client.get('foo').addErrback(on_get_miss, 'foo')
reactor.run()
```

### Naming Of Multi Operations

The `Connection` object supports usage of both `underscore_names` and
`camelCase` for the multi API methods, thus `cb.getMulti()` is the same as
`cb.get_multi`. This is specific to the twisted interface where `camelCase` names
are prevalent and conventional.


### Ordering Of Operations

If your operations need to be executed in a certain order, then keep in mind
that operations are performed in order only in respect to operations on the
same key. In the above example we can be sure that the key will always be
removed before it is deleted. However if operations on different keys
require a particular form of ordering, it is best to wait until the first
operation completes and then invoke the next operation via the received
`callback`.

## Querying Views

Since the synchronous API uses iterators and generators performing network I/O
on demand, the non-blocking API for querying views from Twisted is slightly
different. The interface does support the same `Query` object used in the
synchronous client.

Two methods are provided to query views. The first one is the simple
`queryAll` method which passes all the rows from the result over to a single
callback, e.g.

```python
def on_view_rows(rows):
    for row in rows:
        print row

client = TxCouchbase(bucket='beer-sample')
d = client.queryAll("beer", "brewery_beers", limit=5)
d.addCallback(on_view_rows)
```

```
ViewRow(key=[u'21st_amendment_brewery_cafe'], value=None, docid=u'21st_amendment_brewery_cafe', doc=None)
ViewRow(key=[u'21st_amendment_brewery_cafe', u'21st_amendment_brewery_cafe-21a_ipa'], value=None, docid=u'21st_amendment_brewery_cafe-21a_ipa', doc=None)
ViewRow(key=[u'21st_amendment_brewery_cafe', u'21st_amendment_brewery_cafe-563_stout'], value=None, docid=u'21st_amendment_brewery_cafe-563_stout', doc=None)
ViewRow(key=[u'21st_amendment_brewery_cafe', u'21st_amendment_brewery_cafe-amendment_pale_ale'], value=None, docid=u'21st_amendment_brewery_cafe-amendment_pale_ale', doc=None)
ViewRow(key=[u'21st_amendment_brewery_cafe', u'21st_amendment_brewery_cafe-bitter_american'], value=None, docid=u'21st_amendment_brewery_cafe-bitter_american', doc=None)
```

`queryAll` returns a `Deferred`. Its callback is invoked with an iterable of all
rows and its `errback` is invoked with an error, if any.

All the additional keyword arguments supported in either the synchronous `query`
method or the `Query` object are supported with the exception of `include_docs`.

### Getting Streaming Results

You can also use the `queryEx` method to receive streaming results. This has
the same effect in setting `streaming=True` in the synchronous API.

The difference between `queryAll` and `queryEx` is that the former buffers
all the rows in memory before invoking the `callback` whereas the latter
invokes the `callback` with rows as they arrive on the network.

In order to receive streaming results, you must first extend the
`couchbase.async.view.AsyncViewBase` object and then implement the relevant
methods needed to handle the streaming events.

```python
from twisted.internet import reactor

from couchbase.experimental import enable as enable_experimental
enable_experimental()

from txcouchbase.connection import Connection as TxCouchbase
from couchbase.exceptions import CouchbaseError
from couchbase.async.view import AsyncViewBase

class MyRowHandler(AsyncViewBase):
    def __init__(self, *args, **kwargs):
        self.__times_called = 0
        self.__received_rows = 0
        super(MyRowHandler, self).__init__(*args, **kwargs)

    def on_rows(self, rows):
        self.__times_called += 1
        self.__received_rows += len([r for r in rows])

    def on_error(self, ex):
        # ex is an Exception, *not* a Failure
        print "Got error while querying view", ex

    def on_done(self):
        print ("Callback invoked {0} times. Total of {1} rows received"
               .format(self.__times_called, self.__received_rows))
        print "Indexed Rows: ", self.indexed_rows

client = TxCouchbase(bucket='beer-sample')
client.queryEx(MyRowHandler, "beer", "brewery_beers")
reactor.run()
```

```
Callback invoked 218 times. Total of 7303 rows received
Indexed Rows:  7303
```

`queryEx` receives a *class* (_not an instance!_) of the row handler which
it then instantiates with the relevant parameters.

Here the `on_rows` method is called with an iterable of rows multiple times
until no more rows are available. The `on_done` method is called when there
are no more rows remaining.

As the `AsyncViewBase` object itself is a subclass of `View` we can also
see how many total rows were indexed by inspecting the `indexed_rows`
property.


## Performance

While the previous examples showed the client returning convenient `Deferred`
objects, in reality `Deferreds` incur a significant performance overhead as
they must support an entire callback chain as well as asynchronous suspend/resume
functionality. See the Deferred [source code](http://twistedmatrix.com/trac/browser/tags/releases/twisted-12.3.0/twisted/internet/defer.py#L527) for the full details.

If performance is critical and you only care about receiving error/success
notifications and results without the overhead of a callback chain,
you may use the `txcouchbase.connection.TxAsyncConnection`
object (which is a base of the `txcouchbase.connection.Connection` class).

Using the `TxAsyncConnection` with the `AsyncResult` objects  instead
of `Deferred` objects yield a 3.5x performance benefit.

```python
from twisted.internet import reactor

from couchbase.experimental import enable as enable_experimental
enable_experimental()
from txcouchbase.connection import TxAsyncConnection as TxAsync

client = TxAsync(bucket='default')

def on_connected(*args):
    ft_set = client.set("foo", "bar")
    def on_set(rr):
        print "Stored item", rr
        def on_get(rr2):
            print "Got item", rr2
        ft_get = client.get("foo")
        ft_get.callback = on_get
    ft_set.callback = on_set

client.connect().addCallback(on_connected)
reactor.run()
```

For key value operations, this class returns an `AsyncResult` object which
contains raw properties of `callback` and `errback`. These properties function
a bit differently than they do in a deferred.

Additionally, operations must only be performed once the initial callback has
been invoked.

If an error takes place, the `errback` field's callback will be invoked with
the signature of `(opres, exc_type, exc_value, exc_traceback)`.
