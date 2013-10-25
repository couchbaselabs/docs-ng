# Appendix: Working with Operation Results

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
