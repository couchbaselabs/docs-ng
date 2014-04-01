# Error Handling and Diagnositcs

## Inspecting Return Codes

Most operations return an `lcb_error_t` status code. A successful operation is
defined by the return code of `LCB_SUCCESS`. A full listing of error codes may
be found inside the `<libcouchbase/error.h>` header.

In order to handle the errors properly, the application and developer must
understand what the errors mean and whether they indicate a data error, a
retriable error, or a fatal error.

_Data Errors_ are errors received from the cluster as a result of a
requrested operation on a given item. For example, if an `lcb_get`
is performed on a key that does not exist the callback will receive an
`LCB_KEY_ENOENT` error. Other examples of conditions which may result
in data errors include:

* Adding a key that already exists
* Replacing a key that does not already exist
* Appending/Prepending/Incrementing an item which does not already exist
* Modifying an item while specifying a CAS, where the CAS on the server has
  already been modified.


Other types of errors may be received in exceptional conditions, and are
related to load or network issues. While in normal well provisioned
deployments these errors should not be received a robust application
design should be prepared to handle them and take proper action.

The latter type of errors may be further divided into two subgroups:

* **Transient**
  This error type indicates an environment and/or resource limitation
  either on the server or on the network link between the client and
  the server. Transient errors are typically best handled in the application
  side by backing off and retrying again, with the intent of reducing
  stress on the exhausted resource. Some examples of transient error
  causes:

    * Insufficient cache memory on the server
    * Overutilization of the network link between client and server
      or between several servers
    * Router or switch failure
    * Failover of a node
    * Overutilization of application-side CPU
    

* **Fatal**
  This error type indicates that the client has potentially entered
  into an irrecoverable failed state, either because of invalid user
  input (or client configuration), or because an administrator has
  modified settings on the cluster (for example, a bucket has been
  removed). Fatal errors will typically require inspection of the
  client configuration and a restart of the client application or
  a reversal of the change performed at the cluster.
  Examples of fatal error causes:

    * Bucket does not exist
    * Bucket password is wrong


Examples of _transient_ errors include timeout errors or temporary
failures such as `LCB_ETIMEDOUT` (took too long to get a reply),
or `LCB_ETMPFAIL` (server was too busy). Examples of _fatal_ errors include
`LCB_AUTH_ERROR` (authentication failed) or `LCB_BUCKET_ENOENT`
(bucket does not exist).

The `lcb_errflags_t` enumeration defines a set of flags which are associated
with each error code. These flags define the _type_ of error e.g.
`LCB_ERRTYPE_INPUT` if this is a result of a malformed parameter passed to the
library, `LCB_ERRTYPE_DATAOP` if this is an error code received from the server
if it was unable to satisfy certain data constraints (for example, a missing
key or a CAS mismatch) and so on.

The `LCB_EIF<TYPE>` where `<TYPE>` represents one of the `errflags_t` flags may
be used to check if an error is of a specific type.


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
the data operation APIs (for example `lcb_store`) does not mean the operation
itself succeeded and the key was successfuly stored. Rather it means the
key was successfuly placed inside the library's internal queue. The actual
error code is delivered within the response itself.

### Errors Received in Scheduling
Errors may be received when scheduling operations inside the library. If a
scheduling API returns anything but `LCB_SUCCESS` then it implies the operation
itself failed as a whole and _no callback will be delivered for that
operation_. The library may also _mask_ errors during the scheduling phase and
deliver them asynchronously to the user via a callback if e.g. implementation
constraints do not easily allow the immediate returning of an error code.

Conversely, if a scheduling API returns an `LCB_SUCCESS` then the callback
_will always be invoked_.


## Logging

You may use the library's logging API to forward messages to your logging
framework of choice. Additionally you may also enable logging to the console's
standard error by setting the `LCB_LOGLEVEL` environment variable.

Setting the logging level via the environment allows applications linked against
the library which do not offer native support for logging to still employ the
use of the diagnostics provided by the library; thus you may do something like

```
$ LCB_LOGLEVEL=5 ./my_app
```

and logging information will be displayed.

The value of the `LCB_LOGLEVEL` is an integer from 1 to 5. The higher
the value the more verbose the details. The value of 0 disables the
console logging.

To set up your own logger, you must first define a logging callback to be
invoked whenever the library emits a logging message

```c
static void logger(
	lcb_logprocs *procs,
    unsigned int iid,
	const char *module,
	int severity,
	const char *srcfile,
	int srcline,
	const char *fmt,
	va_list ap)
{
	char buf[4096];
	vsprintf(buf, ap, buf);
	dispatch_to_my_logging(buf);
}

static void apply_logging(lcb_t instance)
{
	lcb_logprocs procs = { 0 };
	procs.v.v0.callback = logger;
	lcb_cntl(instance, LCB_CNTL_SET, LCB_CNTL_LOGGER, &procs);
}
```

Note that the `lcb_logprocs` pointer must point to valid memory and must not be
freed by the user once passing it to the library until the instance associated
with it is destroyed.

The arguments to the logging function are:

* `procs` - The logging procedure structure passed to the `lcb_cntl()` operation
* `iid` - An integer used to identify the `lcb_t` - useful if you have multiple
  instances running in your application
* `module` - A short string representing the subsystem which emitted the message
* `severity` An integer describing the severity of the message
  (higher is more severe). Refer to the `lcb_log_severity_t` enum
  within `<libcouchbase/types.h>` for a full listing.
* `srcfile`, `srcline` - File and line where this message was emitted
* `fmt` - a format string
* `ap` - arguments to the format string


Additional diagnostic information is also provided by the _error callback_.
The error callback is considered to be a legacy interface and should generally
not be used. The error callback however does allow programmatic capture of some
errors - something which is not possible with the logging interface (easily).

Specifically the error callback will receive error information when a bootstrap
or configuration update has failed.

```c
static void error_callback(lcb_t instance, lcb_error_t err, const char *msg)
{
	/** ... */
}

lcb_set_error_callback(instance, error_callback);
```

