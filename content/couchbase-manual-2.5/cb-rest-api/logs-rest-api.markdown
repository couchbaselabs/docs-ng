# Logs REST API

## Using system logs

Couchbase Server logs various messages, which are available via the REST API.
These log messages are optionally categorized by the module. You can retrieve a
generic list of recent log entries or recent log entries for a particular
category. If you perform a GET request on the systems logs URI, Couchbase Server
will return all categories of messages.

Messages may be labeled, "info" "crit" or "warn". Accessing logs requires
administrator credentials if the system is secured.

```
GET /pools/default/logs?cat=crit
Host: localhost:8091
Authorization: Basic xxxxxxxxxxxxxxxxxxx
Accept: application/json
X-memcachekv-Store-Client-Specification-Version: 0.1
```

```
201: bucket was created and valid URIs returned
HTTP/1.1
200 OK
Content-Type: application/json
Content-Length: nnn
[
    {
        "cat":"info",
        "date": "",
        "code": "302",
        "message": "Some information for you."
    },
    {
        "cat":"warn",
        "date": "",
        "code": "502",
        "message": "Something needs attention."
    }
]
```

<a id="couchbase-admin-restapi-client-logging"></a>
## Client logging interface

If you create your own Couchbase SDK you may might want to add entries to the
central log. These entries would typically be responses to exceptions such as
difficulty handling a server response. For instance, the Web UI uses this
functionality to log client error conditions. To add entries you provide a REST
request:

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

