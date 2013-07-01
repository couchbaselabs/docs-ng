# Advanced Usage

**Unhandled:** `[:unknown-tag :simpara]`<a id="_batched_bulk_operations"></a>

## Batched (Bulk) Operations

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
c = Couchbase.connect(unlock_gil=False, bucket='default')
```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :simpara]````
   from couchbase import Couchbase, LOCKMODE_NONE
   c = Couchbase.connect(bucket='default', lockmode=LOCKMODE_NONE)
   ```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]````
   from couchbase import Couchbase, LOCKMODE_EXC
   c = Couchbase.connect(bucket='default', lockmode=LOCKMODE_EXC)
   ```

**Unhandled:** `[:unknown-tag :simpara]`<a id="_custom_encodings_conversions"></a>

## Custom Encodings/Conversions

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_formats_and_flags"></a>

### Formats and Flags

**Unhandled:** `[:unknown-tag :simpara]`<a id="_custom_literal_transcoder_literal_objects"></a>

### Custom Transcoder Objects

**Unhandled:** `[:unknown-tag :simpara]`
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

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]` 
**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
# assuming the ZlibTrancoder class is defined above

c = Couchbase.connect(transcoder=ZlibTranscoder(), bucket='default')
c.set("foo", "long value" * 1000, format=FMT_BYTES|FMT_ZLIB)
c.get("foo")
```

<a id="_bypassing_conversion"></a>

### Bypassing Conversion

**Unhandled:** `[:unknown-tag :simpara]`
```
c.set("a_dict", {"foo":"bar"})
c.data_passthrough = True
c.get("a_dict").value == b'{"foo":"bar"}'
```

<a id="_logging_and_debugging"></a>

## Logging and Debugging

**Unhandled:** `[:unknown-tag :simpara]`<a id="_components"></a>

### Components

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_exception_handling"></a>

### Exception Handling

**Unhandled:** `[:unknown-tag :simpara]`
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

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :screen]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :screen]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :screen]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :screen]`

<a id="_application_crashes"></a>

### Application Crashes

### Debugging an already-running application

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:screen]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :screen]` 
**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`<a id="_contributing"></a>
