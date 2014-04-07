# View/Query Interface

Couchbase Enterprise 2.0 Server combines the speed and flexibility of Couchbase
databases with the powerful JSON document database technology of CouchDB into a
new product that is easy to use and provides powerful query capabilities such as
map-reduce. With Couchbase Server 2.0 you are able to keep using all of the
Couchbase code you already have, and upgrade certain parts of it to use JSON
documents without any hassles. In doing this, you can easily add the power of
Views and querying those views to your applications.

For more information on Views, how they operate, and how to write effective
map/reduce queries, see [Couchbase Server 2.0:
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
and [Couchbase Sever 2.0: Writing
Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views-writing.html).

The `libcouchbase` API provides direct access to Couchbase Views, while
abstracting away the details about where in the cluster the views are to be
executed. It is callback oriented and allows the caller to handle data streamed
back from the Couchbase cluster in HTTP chunked encoding. The entry point to the
`libcouchbase` view API is through the `libcouchbase_make_couch_request()`
function.

For example, to range query a view looking for all keys starting with "I"
through "j", one would execute a query similar to the following:


```
const char path[] = "myview?startkey=I,endkey=j";
libcouchbase_make_couch_request(instance, NULL, path, npath
                                NULL, 0, LIBCOUCHBASE_HTTP_METHOD_GET, 1);
```

This is derived from the `libcouchbase` interface:


```
libcouchbase_couch_request_t libcouchbase_make_couch_request(libcouchbase_t instance,
                                                                const void *command_cookie,
                                                                const char *path,
                                                                libcouchbase_size_t npath,
                                                                const void *body,
                                                                libcouchbase_size_t nbody,
                                                                libcouchbase_http_method_t method,
                                                                int chunked,
                                                                libcouchbase_error_t *error);
```

Where:

 * `instance`

   is the handle to the libcouchbase instance.

 * `commandCookie`

   is a cookie passed to all of the notifications from this command.

 * `path`

   is a literal view path with optional query parameters as specified in the
   [Couchbase
   Views](http://www.couchbase.com/docs/couchbase-manual-2.0/couchbase-views.html)
   guide. Note that these arguments must be JSON encoded by the caller.

 * `body`

   is the POST body for a Couchbase viwe request. If the body argument is NULL, the
   function will use the GET request.

 * `nbody`

   is the size of the body argument.

 * `method`

   is the HTTP method type to be sent to the server. Most often this will be
   `LIBCOUCHBASE_HTTPMETHOD_GET`. `LIBCOUCHBASE_HTTPMETHOD_PUT` and
   `LIBCOUCHBASE_HTTPMETHOD_DELETE` may sometimes be used when working with design
   documents.

 * `chunked`

   if true, will configure the client to use the `libcouchbas_couch_data_callback`
   to notify the program of any responses. If it is false, the
   `libcouchbase_couch_complete` callback will be called upon completion.

 * `error`

   is a pointer to the error return value as defined in the interface. Additional
   information about the error condition may be retrieved through the
   `libcouchbase_strerror()` function.

For additional usage on this API, please refer to the examples in the source
code repository at [Couchbase Sever 2.0: Writing
Views](https://github.com/couchbase/libcouchbase/blob/7b9c3170abc05afebcfb6bcd9bf5aa111025fe1d/example/couchview.c)

<a id="couchbase-sdk-c-rn"></a>
