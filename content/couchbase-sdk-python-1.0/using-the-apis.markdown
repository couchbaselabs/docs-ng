# Using the APIs

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_connecting"></a>

## Connecting

**Unhandled:** `[:unknown-tag :simpara]`
```
from couchbase import Couchbase

client = Couchbase.connect(bucket='default')
```

<a id="_multiple_nodes"></a>

### Multiple Nodes

### Using Multiple Nodes


```
c = Couchbase.connect(
    bucket='default',
    host=['foo.com', 'bar.com', 'baz.com']
)
```



<a id="_timeouts"></a>

### Timeouts

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
c = Couchbase.connect(bucket='default', timeout=5.5)
```

**Unhandled:** `[:unknown-tag :simpara]`
```
c.timeout = 4.2
```

<a id="_sasl_buckets"></a>

### SASL Buckets

**Unhandled:** `[:unknown-tag :simpara]`
```
c = Couchbase.connect(bucket='default', password='s3cr3t')
```

<a id="_threads"></a>

### Threads

**Unhandled:** `[:unknown-tag :simpara]`<a id="_api_return_values"></a>

## API Return Values

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]````
   result = client.get("key", quiet=True)
   if not result.success:
       print "Got error code", result.rc
   ```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_storing_data"></a>

## Storing Data

<a id="_setting_values"></a>

### Setting Values

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_arithmetic_and_counter_operations"></a>

### Arithmetic and Counter Operations

### Using set


```
key = "counter"
try:
    result = c.get("counter")
    c.set(key, result.value + 1)
except KeyNotFoundError:
    c.add(key, 10)
```



### Using incr


```
key = "counter"
c.incr(key, initial=10)
```



 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_append_and_prepend_operations"></a>

### Append and Prepend Operations

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
c.set("greeting", "Hello", format=FMT_UTF8)
c.append("greeting", " World!")
c.get("greeting").value == "Hello World!"
c.prepend("greeting", "Why, ")
c.get("greeting").value == "Why, Hello World!"
```

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :caution]`<a id="_expiration_operations"></a>

### Expiration Operations

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :simpara]`

<a id="_deleting_data"></a>

## Deleting Data

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_retrieving_data"></a>

## Retrieving Data

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_locking_data_ensuring_consistency"></a>

## Locking Data/Ensuring Consistency

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
def add_friend(user_id, friend):
    result = c.get("user_id-" + user_id)
    result.value['friends'][friend] = { 'added' : time.time() }
    c.set("user_id-" + user_id, result.value)
```

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
`[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`<a id="_opportunistic_locking"></a>

### Opportunistic Locking

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
```
def add_friend(user_id, friend):

    while True:
        result = c.get("user_id-" + user_id)
        result.value['friends'][friend] = { 'added' : time.time() }

        try:
            c.set("user_id-" + user_id, result.value, cas=result.cas)
            break

        except KeyExistsError:
            print "It seems someone tried to modify our user at the same time!"
            print "Trying again"
```

**Unhandled:** `[:unknown-tag :simpara]`<a id="_pessimistic_locking"></a>

### Pessimistic Locking

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :important]`  **Unhandled:** `[:unknown-tag
:simpara]`
```
def add_friend(user_id, friend):
    while True:
        try:
            result = c.lock("user_id-" + user_id)
            break

        except TemporaryFailError:
            # Someone else has locked the key..
            pass
    try:
        result.value['friends'][friend] = { 'added' : time.time() }
        c.set("user_id-" + user_id, result.value, cas=result.cas)

    except:
        # We want to unlock if anything happens, rather than waiting
        # for it to time out
        c.unlock(result.key, result.cas)

        # then, raise the exception
        raise
```

### When To Use Optimistic Or Pessimistic Locking

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`  **Unhandled:** `[:unknown-tag :simpara]`<a id="_working_with_views"></a>

## Working With Views

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`
   **Unhandled:** `[:unknown-tag :screen]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

**Unhandled:** `[:unknown-tag :simpara]`
```
rows_as_list = [ c.query("beer", "brewery_beers") ]
```

### Using encoded query strings


```
client.query("beer", "brewery_beers", query="limit=3&skip=1&stale=false")
```



### Using key-value pairs


```
client.query("beer", "brewery_beers", limit=3, skip=1, stale=False)
```



### Using a Query object


```
from couchbase.views.params import Query

q = Query
q.limit = 3
q.skip = 1
q.stale = False
client.query("beer", "brewery_beers", query=q)
```



**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_common_view_parameters"></a>

### Common View Parameters

**Unhandled:** `[:unknown-tag :simpara]`<a id="_server_parameters"></a>

### Server Parameters

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_literal_query_literal_method_options"></a>

### query Method Options

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_pagination"></a>

### Pagination

**Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
:simpara]`<a id="_design_document_management"></a>

## Design Document Management

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:**
   `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

 * **Unhandled:** `[:unknown-tag :simpara]`  **Unhandled:** `[:unknown-tag
   :simpara]`

<a id="_advanced_usage"></a>
