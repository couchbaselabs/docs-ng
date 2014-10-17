# Error Handling and Diagnostics

This section contains information about handling errors and logging error messages.

## Inspecting Return Codes

Most operations return an `lcb_error_t` status code. A successful operation is
defined by the return code of `LCB_SUCCESS`. You can find a full list of error codes in the `<libcouchbase/error.h>` header.

To handle the errors properly, you must understand what the errors mean and whether they indicate a data error, that the operation can be retried, or a fatal error.

Data errors are errors received from the cluster as a result of a
requested operation on a given item. For example, if an `lcb_get`
is performed on a key that does not exist, the callback will receive an
`LCB_KEY_ENOENT` error. Other examples of conditions that can result
in data errors include:

* Adding a key that already exists
* Replacing a key that does not already exist
* Appending, prepending, or incrementing an item that does not already exist
* Modifying an item while specifying a CAS, where the CAS on the server has
  already been modified

Errors related to load or network issues might be received in exceptional conditions. Although you should not receive these types of errors in normal, well-provisioned deployments, your application must be prepared to handle them and take proper action.

The latter type of errors may be further divided into the following subgroups:

* **Transient**. This error type indicates an environment and/or resource limitation
  either on the server or on the network link between the client and
  the server. Examples of transient errors include timeout errors or temporary
failures such as `LCB_ETIMEDOUT` (took too long to get a reply)
and `LCB_ETMPFAIL` (server was too busy). Transient errors are typically best handled on the application
  side by backing off and retrying the operation, with the intent of reducing
  stress on the exhausted resource. Some examples of transient error
  causes:

    * Insufficient cache memory on the server
    * Overutilization of the network link between the client and server
      or between several servers
    * Router or switch failure
    * Failover of a node
    * Overutilization of application-side CPU

* **Fatal**. This error type indicates that the client has potentially entered
  into an irrecoverable failed state, either because of invalid user
  input (or client configuration), or because an administrator has
  modified settings on the cluster (for example, a bucket has been
  removed). Examples of fatal errors include
`LCB_AUTH_ERROR` (authentication failed) and `LCB_BUCKET_ENOENT`
(bucket does not exist). Fatal errors typically require inspection of the
  client configuration and a restart of the client application or
  a reversal of the change performed at the cluster.
  Some examples of fatal error causes:

    * Bucket does not exist
    * Bucket password is wrong

The `lcb_errflags_t` enumeration defines a set of flags that are associated
with each error code. These flags define the type of error. Some examples of error types:

* `LCB_ERRTYPE_INPUT`, which is set when a malformed parameter is passed to the library
* `LCB_ERRTYPE_DATAOP` which is set when the server is unable to satisfy data constraints such as a missing key or a CAS mismatch.

The `LCB_EIF<TYPE>` methods, where `<TYPE>` represents one of the `errflags_t` flags, can be used to check whether an error is of a specific type.

The following example shows how to check the return codes:

```c
static void get_callback(
	lcb_t instance,
	const void *cookie,
	lcb_error_t err,
	const lcb_get_resp_t *resp)
{
	if (err == LCB_SUCCESS) {
		printf("Successfuly retrieved key!\n");
	} else if (LCB_EIFDATA(err)) {
		switch (err) {
			case LCB_KEY_ENOENT:
				printf("Key not found!\n");
				break;
			default:
				printf("Received other unhandled data error\n");
				break;
		}
	} else if (LCB_EIFTMP(err)) {
		printf("Transient error received. May retry\n");
	}
}
```


### Success and Failure
Success and failure depend on the context. A successful return code for one of
the data operation APIs (for example, `lcb_store`) does not mean the operation
itself succeeded and the key was successfully stored. Rather, it means the
key was successfully placed inside the library's internal queue. The actual
error code is delivered within the response itself.

### Errors Received in Scheduling
Errors might be received when scheduling operations inside the library. If a
scheduling API returns anything but `LCB_SUCCESS`, then that implies the operation
itself failed as a whole and _no callback will be delivered for that
operation_. Conversely, if a scheduling API returns an `LCB_SUCCESS` then the callback
_will always be invoked_.

The library might also mask errors during the scheduling phase and
deliver them asynchronously to the user via a callback (for example, when implementation
constraints do not easily allow the immediate returning of an error code).



## Logging

You can enable logging to the console's
standard error by setting the `LCB_LOGLEVEL` environment variable.

```
$ LCB_LOGLEVEL=5 ./my_app
```

The value of the `LCB_LOGLEVEL` environment variable is an integer from 1 to 5. The higher
the value, the more verbose the details. The value of 0 disables the
console logging.
