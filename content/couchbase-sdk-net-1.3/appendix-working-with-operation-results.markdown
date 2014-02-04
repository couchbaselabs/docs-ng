# Working with Operation Results and Error Codes

## Working with Operation Results

The following sections provide details on working with the `IOperationResult`
interface.

`CouchbaseClient` 's standard CRUD operations return `Boolean` values. When
exceptions or failures occur, they are swallowed and `false` is returned.

While there might be scenarios where the cause of a failure is not important
(e.g., non-persistent cache), it is likely that access to error information is
necessary. To that end, the `CouchbaseClient` provides a set of complimentary
ExecuteXXX methods, where XXX is the name of a standard CRUD operation.


```
var success = client.Get("foo"); //returns a Boolean

var result = client.ExecuteGet("foo"); //returns an IOperationResult
```

All ExecuteXXX methods return an instance of an implementation of the
`IOperationResult` interface.


```
public interface IOperationResult
{
    bool Success { get; set; }

    string Message { get; set; }

    Exception Exception { get; set; }

    int? StatusCode { get; set; }

    IOperationResult InnerResult { get; set; }
}
```

For each of the ExecuteXXX methods, a typical use pattern would be to
interrogate the possible error values on failure.


```
var result = client.ExecuteStore(StoreMode.Add, "foo", "bar");

if (! result.Success)
{
    Console.WriteLine("Store operation failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
```

The `Message` property will contain details as to why an operation failed. The
message might be from the server or it could be from the client. The
`StatusCode` property is a `Nullable<int>` that will be populated from the
server's response.

Note that the 1.1 release of the `OperationResult` API wrapped lower level
(networking) exceptions in an `InnerResult` object. Since release 1.2,
`InnerResult` is no longer populated. The property still remains so as to be
backwards compatible.

Like the standard CRUD methods, the Execute methods will swallow exceptions.
However, caught exceptions are passed back to the caller by way of the
`Exception` property. This allows the caller to check for an exception and throw
it if exception behavior is desired.

There are several interfaces that extend `IOperationResult` to provide
additional properties. Two important interfaces are the
`INullableOperationResult<T>` and `ICasOperationResult`


```
public interface INullableOperationResult<T> : IOperationResult
{
    bool HasValue { get; }
    T Value { get; set; }
}

public interface ICasOperationResult : IOperationResult
{
    ulong Cas { get; set; }
}
```

The `INullableOperationResult<T>` interface is extended by the
`IGetOperationResult`, providing Get operations with properties to get the
retrieved value.


```
var result = client.ExecuteGet("foo");

if (! result.Success)
{
    Console.WriteLine("Get operation failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}

if (result.HasValue)
{
    var value = result.Value;
}
else if (result.StatusCode == 1)
{
    Console.WriteLine("Key does not exist");
}
```

`IGetOperationResult` also extends `ICasOperationResult`. Therefore, it is
possible to get the CAS value from an ExecuteGet operation. The snippet below
demonstrates the generic `ExecuteGet` method.


```
var result = client.ExecuteGet<City>("CT_Hartford");

if (result.Success)
{
    var city = result.Value;
    city.Population = 124775;
    client.ExecuteStore(StoreMode.Set, "CT_Hartford", city, result.Cas); //will fail if Cas is not the same value on server
}
```

`ExecuteStore` methods return `IStoreOperationResult` instances.


```
var result = client.ExecuteStore(StoreMode.Add, "foo", "bar");

if (! result.Success)
{
    Console.WriteLine("Get operation failed with message {0} and status code {1}", result.Message, result.StatusCode);

    if (result.StatusCode == 2)
    {
        Console.WriteLine("Key already exists");
    }

    if (result.Exception != null)
    {
        throw result.Exception;
    }
}
```

`IStoreOperationResult` also extends `ICasOperationResult`. Therefore, it is
possible to get the CAS value from an ExecuteStore operation.


```
var city = new City() { Name = "Hartford", State = "CT" };
var result = client.ExecuteStore(StoreMode.Add, "CT_Hartford", city);

if (result.Success)
{
    city.Population = 124775;
    client.ExecuteStore(StoreMode.Set, "CT_Hartford", city, result.Cas); //will fail if Cas is not the same value on server
}
```

The `IMutateOperationResult`, `IConcatOperationResult` interfaces also return
the CAS value. These interfaces are returned by
`ExecuteIncrement/ExecuteDecrement` and `ExecuteAppend/ExecutePrepend`
respectively. `IRemoveOperationResult` includes only the properties found in
`IOperationResult`.

For more information on which API methods support ExecuteXXX variants, see the
API reference.

<a id="couchbase-sdk-net-json"></a>

## Error Code Checking

As previously discussed, the Couchbase .NET Client has two forms of CRUD methods: 
those that return the primitive value (e.g. `bool`, `integer`, etc) of the result and 
those that return an `IOperationResult` object. The former methods have a signature 
that matches the operation's name (e.g. Increment(..)) and the latter methods have 
a signature with a prefix of the "Execute" (e.g. ExecuteIncrement).

The benefit of using the methods which return `IOperationResult` is that they give 
you additional information of about the result of the operation which allows you to 
handle specific error or failure cases or to determine what caused the error to occur. 
Of major importance is the `Success`, `StatusCode`, `Message` and `Exception` fields.

A description of each field:

 * **Success** - returns Boolean true if operation was successful, otherwise false
 * **StatusCode** - returns an integer value indicating the response status from the server 
 or the IO portion of the client. There is also an enumeration describing the values and 
 extension method that makes the conversion simple. 
 * **Message** - a string describing the error that occurred
 * **Exception** - the exception caused by the error

Status Codes
Perhaps the most important field is the `StatusCode` field. Here is a table with the numerical 
value, enum value and description of each `StatusCode`:

|  **Enum Value** |**Numerical**   |**Origin**   | **Description**  |
|---|---|---|---|
|  Success | 0  | Server  | Operation was successful |
|  KeyNotFound | 1  | Server  | Key was not found on server |
|  KeyExists | 2  | Server  | Key already exists on server |
|  ValueToLarge | 3  | Server  | Value is to large  |
|  InvalidArguments  |  4 | Server  | The operations arguments are invalid  |
|  ItemNotStored | 5  | Server  | The item could not be stored  |
|  IncrDecrOnNonNumericValue | 6  | Server  | An attempt was made to increment or decrement a non-numeric value – e.g. a string  |
|  VBucketBelongsToAnotherServer | 7  | Server  | The VBucket the key is mapped too has been changed. Common during rebalance scenarios and operation should be retried  |
|  AuthenticationError | 20  | Server  | SASL authentication has failed. Check the password or username of the server or bucket  |
|  AuthenticationContinue | 21  | Server  | Used during SASL authentication  |
|  InvalidRange | 22 | Server  | Invalid range was specified  |
|  UnknownCommand | 81 | Server  | Operation was not recognized by server. Should never occur with a Couchbase supported client  |
|  OutOfMemory | 82 | Server  | Server is out of memory. This is usually temporary, but should prompt further investigation  |
|  NotSupported | 83 | Server  | A client attempted an operation that was not supported by the server  |
|  InternalError | 84 | Server  | Server error state  |
|  Busy  | 85 | Server  | Server is temporarily too busy. This may warrant a retry attempt  |
|  TemporaryFailure  | 86 | Server |   |
|  SocketPoolTimeout | 91 | Client | A timeout has occurred while attempting to retrieve a connection. This can happen during rebalance scenarios or during times of high throughput on the client. A retry attempt is warranted in this case |
|  UnableToLocateNode | 92 | Client | Usually a temporary state of the client during rebalance/failover scenarios when a configuration change has occurred (server added or removed from cluster for example). A retry attempt is warranted in this case |
|  NodeShutdown  | 93 | Client | Temporary client state during a configuration change when an operation is using the older state of the cluster. A retry attempt is warranted in this case  |
|  OperationTimeout | 94 | Client | The 1.X client uses synchronous IO, If a connection is terminated by the server a timeout will occur after n seconds on the client if the current operation does not complete. A retry attempt is warranted in this case |

Note the `StatusCode` enumeration is found within `Enyim.Caching` assembly: `Enyim.Caching.StatusCode`.