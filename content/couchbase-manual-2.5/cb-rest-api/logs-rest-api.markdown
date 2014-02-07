
<a id="cb-rest-api-logs"></a>
# Logs REST API
This section provides the REST API endpoints for retrieving log and diagnostic information as well as how an SDK can add entries into a log.

HTTP method | URI path | Description
------------------ | ------------ | ---------------
GET | `/diag` | Retrieves log and additional server diagnostic information.
GET | `/sasl_logs` | Retrieves log information.


## Retrieving log information

Couchbase Server logs various messages, which are available via the REST API.
These log messages are optionally categorized by the module. A generic list of log entries or log entries for a particular category can be retrieved. 

<div class="notebox"><p>Note</p>
If the system is secured, administrator credentials are required to access logs.
</p></div>

To retrieve log and server diagnostic information, perform a GET with the `/diag` endpoint.

```
curl -v -X GET -u Administrator:password
   http://127.0.0.1:8091/diag
```


To retrieve a generic list of logs, perform a GET with the `/sasl_logs` endpoint.

```
curl -v -X GET -u Administrator:password 
  http://127.0.0.1:8091/sasl_logs
```


To retrieve a specific log file, perform a GET on the `sasl_logs` endpoint and provide a specific log category.

```
curl -v -X GET -u Administrator:password
 http://127.0.0.1:8091/sasl_logs/<categoryName>
```

Where the _categoryName_ is one of the following:

* babysitter
* couchdb
* debug
* error
* info
* mapreduce_errors
* ssl_proxy
* stats
* view
* xdcr
* xdcr_errors

**Example**

```
curl -v -X GET -u Administrator:password
 http://127.0.0.1:8091/sasl_logs/ssl_proxy
```


**Results**

```
* About to connect() to 10.5.2.118 port 8091 (#0)
*   Trying 10.5.2.118... connected
* Connected to 10.5.2.118 (10.5.2.118) port 8091 (#0)
* Server auth using Basic with user 'Administrator'
> GET /sasl_logs/ssl_proxy HTTP/1.1
> Authorization: Basic QWRtaW5pc3RyYXRvcjpwYXNzd29yZA==
> User-Agent: curl/7.21.4 (x86_64-unknown-linux-gnu) libcurl/7.21.4 OpenSSL/0.9.8b zlib/1.2.3
> Host: 10.5.2.118:8091
> Accept: */*
> 
< HTTP/1.1 200 OK
< Transfer-Encoding: chunked
< Server: Couchbase Server
< Pragma: no-cache
< Date: Thu, 06 Feb 2014 22:50:12 GMT
< Content-Type: text/plain; charset=utf-8
< Cache-Control: no-cache
< 
logs_node (ssl_proxy):
-------------------------------
[ns_server:info,2014-01-24T11:25:18.066,nonode@nohost:<0.30.0>:ns_ssl_proxy:init_logging:84]Brought up ns_ssl_proxy logging
[error_logger:info,2014-01-24T11:25:18.082,nonode@nohost:error_logger<0.5.0>:ale_error_logger_handler:log_report:72]
=========================PROGRESS REPORT=========================
          supervisor: {local,ns_ssl_proxy_sup}
             started: [{pid,<0.64.0>},
                       {name,ns_ssl_proxy_server_sup},
                       {mfargs,{ns_ssl_proxy_server_sup,start_link,[]}},
                       {restart_type,permanent},
                       {shutdown,infinity},
                       {child_type,supervisor}]
```


<a id="couchbase-admin-restapi-client-logging"></a>

## Creating a client logging interface

Entries can be added to the central log from a custom Couchbase SDK. These entries are typically  responses to exceptions such as difficulty handling a server response. For instance, the Web Console uses this functionality to log client error conditions. 

To add entries, provide a REST request similar to the following:

```
POST /logClientError
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```


```
200 - OK
```

