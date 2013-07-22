# Advanced Usage

This covers advanced topics and builds on the *Using the APIs* section.

<a id="_batched_bulk_operations"></a>

## Batched (Bulk) Operations

Most API functions have both single and multi-key (batched) variants. The
batched variant has the same name as the single-key variant, but its method name
has `_multi` appended to it.

The batched operations are significantly quicker and more efficient, especially
when dealing with many small values, because they allow pipelining of requests
and responses, saving on network latency.

Batched operations tend to accept an iterable of keys (or a dict of keys,
depending on the method) and return a dictionary of the following format:


```
c.foo_multi(["key1", "key2", "key3"])

{
    "key1" : FooResult(...),
    "key2" : FooResult(...),
    "key3" : FooResult(...)
}
```

<a id="_exceptions_in_batched_operations"></a>

### Exceptions in Batched Operations

Sometimes a single key in a batched operation fails, resulting in an exception.
It is still possible to retrieve the full result set of the failed batched
operation by using the `all_results` property of the thrown exception (assuming
it is of type `CouchbaseError` ).


```
c.set("foo", "foo value")

try:
    c.add_multi({
        "foo" : "foo value",
        "bar" : "bar value",
        "baz" : "baz value"
    })
except CouchbaseError as exc:
    for k, res in exc.all_results.items():
        if res.success:
            # Handle successful operation
        else:
            print "Key {0} failed with error code {1}".format(k, res.rc)
            print "Exception {0} would have been thrown".format(
                CouchbaseError.rc_to_exctype(res.rc))
```

<a id="_using_with_and_without_threads"></a>

## Using With and Without Threads

The `Connection` object by default is thread safe. To do so, it uses internal
locks and explicitly locks and unlocks the Python *GIL* to ensure that a fatal
error is not thrown by the application.

The locking and unlocking has a slight performance impact, with the guarantee
that things will not crash if an application is using threads.

If you are not using threads in your application (at all), you can pass the
`unlock_gil=False` option to the `connect` method like so:


```
c = Couchbase.connect(unlock_gil=False, bucket='default')
```

This disables all locking/unlocking (not to be confused with the `lock` and
`unlock` features that operate on keys in the server) functionality. If your
application does use threads, those threads will be *blocked* while the
`Connection` object waits for the server to respond.

In addition to locking and unlocking the *GIL*, upon entry to each function the
`Connection` object locks itself (using the equivalent of `Lock.acquire` ) and
unlocks itself after it leaves. This is to ensure that multiple threads are not
using the same `Connection` object at once; and thus access is serialized.

You may disable this behavior with the following two options:

 * Don’t lock at all

   The `Connection` object is not locked at all. If your application tries to use
   the `Connection` object from multiple threads at once, strange errors might
   happen and your program will eventually core dump.

   If you’re sure you’re not going to use it from more than one thread, you can use
   the `lockmode = LOCKMODE_NONE` in the constructor:

    ```
    from couchbase import Couchbase, LOCKMODE_NONE
    c = Couchbase.connect(bucket='default', lockmode=LOCKMODE_NONE)
    ```

 * Throw an exception if concurrent access is detected

   This is helpful for debugging an application where multiple threads *should* not
   be accessing the `Connection` object (but for some reason, they are). You can
   use the `lockmode = LOCKMODE_EXC` for this:

    ```
    from couchbase import Couchbase, LOCKMODE_EXC
    c = Couchbase.connect(bucket='default', lockmode=LOCKMODE_EXC)
    ```

The default lockmode is `couchbase.LOCKMODE_WAIT`, which waits silently if
concurrent access is detected.

<a id="_custom_encodings_conversions"></a>

## Custom Encodings/Conversions

While the Python SDK offers numerous options for converting your data to be
suitable for storing on the server, it might sometimes not be enough. For this,
the `Transcoder` interface is used.

The `Transcoder` interface allows you to define an object that is called with
each value together with the `format` arguments passed to it.

<a id="_formats_and_flags"></a>

### Formats and Flags

The value passed for the `format` parameter is actually a flag that is stored on
the server. Each key has a small amount of metadata which is stored along with
it on the server. The Python SDK stores the `format` value to the metadata when
you store a value (using `set` ) and then reads it when retrieving the value
(using `get` ). If the flag is equal to `FMT_JSON`, then it attempts to decode
it as JSON; if the flag is equal to `FMT_PICKLE`, then it attempts to decode it
as Pickle; and so on.

<a id="_custom_literal_transcoder_literal_objects"></a>

### Custom Transcoder Objects

You can write a custom transcoder that allows *Zlib* compression. Here’s a
snippet:


```
import zlib

from couchbase.transcoder import Transcoder
from couchbase import FMT_MASK

# We'll define our own flag.
FMT_ZLIB = (FMT_MASK << 1) & ~FMT_MASK

class ZlibTranscoder(Transcoder):
    def encode_value(self, value, format):
        converted, flags = super(ZlibTranscoder, self).encode_value(value, format & FMT_MASK)
        if (format & FMT_ZLIB):
            flags |= FMT_ZLIB
            converted = zlib.compress(converted)
        return (converted, flags)

    def decode_value(self, value, flags):
        if (format & FMT_ZLIB):
            value = zlib.decompress(value)
            format &= FMT_MASK
        return super(ZlibTranscoder, self).decode_value(value, flags)
```

In the example, the `ZlibTranscoder` class is defined as a subclass of the
provided `couchbase.transcoder.Transcoder` class. The latter is a wrapper class
that defaults to use the default conversion methods in the SDK (note that the
library does not use any `Transcoder` object by default, but the provided one
wraps the built-in converters.

For `encode_value` we are passed the user-specified value, which is any Python
object, and a `format` value, which also can be any valid Python object (though
the default transcoder accepts only the `FMT_JSON`, `FMT_UTF8`, `FMT_BYTES` and
`FMT_PICKLE` values.

We define an additional format flag called `FMT_ZLIB`. We make this one higher
than `FMT_MASK`, which is the bitmask for the built-in formatting flags.

In `encode_value` we first call our parent’s `encode_value` (passing only the
relevant bits of the `format` ) and receive the converted value and output flags
back (in reality, output flags will typically be the same as the format flags).

Then we convert the already-converted value and compress it as *zlib*. We then
**AND** the flag with our `FMT_ZLIB` bit, and return it. The value and flag
returned from the `encode_value` method are stored as is on the server.

We do the converse when reading data back from the server in `decode_value`. In
this method we are passed the value as it is stored on the server, along with
the numeric flags as they are stored in the key’s metadata. We check to see
first whether there is any special `FMT_ZLIB` flag applied, and if so,
decompress the data and strip those bits from the flag. Then we dispatch it to
the default `decode_value` to handle any further encapsulation formats.

This can all be used like so from Python:


```
# assuming the ZlibTrancoder class is defined above

c = Couchbase.connect(transcoder=ZlibTranscoder(), bucket='default')
c.set("foo", "long value" * 1000, format=FMT_BYTES|FMT_ZLIB)
c.get("foo")
```

<a id="_bypassing_conversion"></a>

### Bypassing Conversion

If you are having difficulties with reading some value from the server (possibly
because it was stored using a different client with different flag semantics)
then you can disable conversion (when retrieving) entirely by using the
`Connection` object’s `data_passthrough` property. This is a Boolean, and when
enabled does not reconvert the value (that is, it does not call `decode_value`
but simply interprets the value as a sequence of bytes and returns them as part
of the `Result` object’s `value` property.


```
c.set("a_dict", {"foo":"bar"})
c.data_passthrough = True
c.get("a_dict").value == b'{"foo":"bar"}'
```

<a id="_logging_and_debugging"></a>

## Logging and Debugging

This section explains how to uncover bugs in your application (or in the SDK
itself).

<a id="_components"></a>

### Components

To debug anything, you must be able to identify in which domain a problem is
found. Specifically, the following components participate in typical Couchbase
operations:

 * Couchbase Server

   This is the server itself, which stores your data. Errors can happen here if
   your data does not exist, or if there are connectivity issues with one or more
   nodes in the server. Note that while Couchbase Server is scalable and fault
   tolerant, there are naturally some conditions that would cause failures (for
   example, if all nodes are unreachable).

 * libcouchbase

   This is the underlying layer that handles network communication and protocol
   handling between a client and a Couchbase node. Network connectivity issues tend
   to happen here.

 * Python C Extension Layer

   This is the C code that provides the bulk of the SDK. It interfaces with the
   libcouchbase component, creates `Result` objects, performs input validation, and
   encoding and decoding of keys and values.

 * Python Layer

   This is written in pure python. For simple key-value operations these normally
   just dispatch to the C layer. Most of the view option and row code is handled
   here as well, with the C layer just performing the lower level network handling.

<a id="_exception_handling"></a>

### Exception Handling

When something goes wrong, an exception of `CouchbaseError` is typically thrown.
The exception object contains a lot of information that can be used to find out
what went wrong.


```
from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError

c = Couchbase.connect(bucket='default')
try:
    # Will fail because 'object' is not JSON-serializable
    c.set("key", object())
except CouchbaseError as e:
    print e
```

Printing the exception object typically produces something like this:

`# line breaks inserted for clarity  <Couldn't encode value, inner_cause=<object
object at 0x7f873cf220d0> is not JSON serializable, C
Source=(src/convert.c,131), OBJ=<object object at 0x7f873cf220d0> >` The
exception object consists of the following properties:

 * `message`

   This is the message, if any, that indicates what went wrong. It is always a
   string.

   `>>> e.message "Couldn't encode value"`

 * `inner_cause`

   If this exception is triggered by another exception, this field contains it. In
   the above example, we see the exception

   `>>> e.inner_cause TypeError('<object object at 0x7f873cf220d0> is not JSON
   serializable',)`

 * `csrc_info`

   If present, contains the source code information where the exception was raised.
   This is only present for exceptions raised from within the C extension.

   `>>> e.csrc_info ('src/convert.c', 131)`

 * `objextra`

   Contains the Python object that likely caused the exception. If present, it
   means the object was of an invalid type or format.

   `>>> e.objextra <object object at 0x7f873cf220d0>`

<a id="_application_crashes"></a>

### Application Crashes

Because this is a C extension, some fatal errors might result in an application
crash. On Unix-based systems, these typically look like this:

`python: src/callbacks.c:132: get_common_objects: Assertion
`PyDict_Contains((PyObject*)*mres, hkey) == 0' failed. Aborted` Or simply:

`Segmentation Fault` While the actual cause might be in the application code or
in the SDK itself, there is often less information available in debugging it.

The SDK should never crash under normal circumstances, and any application crash
ultimately indicates a bug in the SDK itself (invalid user input should result
in a Python exception being thrown).

To better help us fix the SDK, a C *backtrace* is needed. To generate a helpful
backtrace, Python must be available with debugging symbols (this can be done by
installing `python-dbg` or `python-debuginfo` from your distribution. Likewise,
`libcouchbase` itself must also be installed with debugging symbols (this can be
done by installing `libcouchbase2-dbg` or `libcouchbase2-debuginfo`, depending
on your distribution).

You also need `gdb` (this is also available on any distribution).

When you have the desired debugging symbols, invoke `gdb` as follows. For this
example, we assume `python` is a Python interpreter, and `crash.py` is a script
that can trigger the crash.

`shell> gdb --args python crash.py GNU gdb (GDB) 7.4.1-debian Copyright (C) 2012
Free Software Foundation, Inc. License GPLv3+: GNU GPL version 3 or later
<http://gnu.org/licenses/gpl.html> This is free software: you are free to change
and redistribute it. There is NO WARRANTY, to the extent permitted by law.  Type
"show copying" and "show warranty" for details. This GDB was configured as
"x86_64-linux-gnu". For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>... Reading symbols from
/usr/bin/python...Reading symbols from /usr/lib/debug/usr/bin/python2.7...done.
done.` This brings you to the `gdb` prompt. Run the program by typing `r` and
then pressing *enter*.

### Debugging an already-running application

Often in the case of web servers, it is difficult to invoke the script directly.
In this case, you need to debug an already-running application. This can be done
with `gdb` by determining the process ID of the already-running process. In this
case, you can attach `gdb` to the running process like so:

`shell> gdb -p 29342..... (gdb) continue` Once `gdb` is attached, you can type
`continue` (instead of `r` ) to continue the application.

This shows us that an application crashed. When this happens, `gdb` will print
the location of the crash. This is not enough, however as we need the full trace
of the crash. To do this, type `bt` and then enter to obtain the trace:

`(gdb) bt #0  0x00007ffff6fc9475 in *__GI_raise (sig=<optimized out>)
at../nptl/sysdeps/unix/sysv/linux/raise.c:64 #1  0x00007ffff6fcc6f0 in
*__GI_abort () at abort.c:92 #2  0x00007ffff6fc2621 in *__GI___assert_fail
(assertion=assertion@entry= 0x7ffff67f6f68 "PyDict_Contains((PyObject*)*mres,
hkey) == 0", file=<optimized out>, file@entry=0x7ffff67f6e0d "src/callbacks.c",
line=line@entry=132, function=function@entry= 0x7ffff67f6fe0
"get_common_objects") at assert.c:81 #3  0x00007ffff67f000c in
get_common_objects (cookie=<optimized out>, key=<optimized out>, nkey=<optimized
out>, err=err@entry=LCB_KEY_ENOENT, conn=conn@entry=0x7fffffffd328,
res=res@entry=0x7fffffffd330, restype=restype@entry=2,
mres=mres@entry=0x7fffffffd338) at src/callbacks.c:132 #4  0x00007ffff67f0623 in
get_callback (instance=<optimized out>, cookie=<optimized out>,
err=LCB_KEY_ENOENT, resp=0x7fffffffd3e0) at src/callbacks.c:216 #5 
0x00007ffff65cf861 in lcb_server_purge_implicit_responses () from
/sources/libcouchbase/inst/lib/libcouchbase.so.2 #6  0x00007ffff65d0f1b in
lcb_proto_parse_single () from /sources/libcouchbase/inst/lib/libcouchbase.so.2
#7  0x00007ffff65cfef5 in lcb_server_v0_event_handler () from
/sources/libcouchbase/inst/lib/libcouchbase.so.2 #8  0x00007ffff58b9ccc in
event_base_loop () from /usr/lib/x86_64-linux-gnu/libevent-2.0.so.5 #9 
0x00007ffff65d50f0 in lcb_wait () ---Type <return> to continue, or q <return> to
quit---` Python traces can be rather long; continue pressing *enter* until the
last line ( `--Type <return>...` ) is no longer present.

After you have a backtrace, send the information (along with the script to
reproduce, if possible) to your desired support venue.

You can also debug a crash using *Valgrind*, but the process is significantly
more involved and requires a slightly modified build of Python. See
[Contributing](couchbase-sdk-python-ready.html#_contributing) for more details.

<a id="_contributing"></a>
