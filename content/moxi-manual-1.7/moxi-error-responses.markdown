# Moxi Error Responses

Errors are reported differently based on whether you are using the ASCII or
binary protocol.

**Unhandled:** `[:unknown-tag :bridgehead]` Besides the normal memcached error
codes ( `CLIENT_ERROR...`, `SERVER_ERROR...`, `NOT_FOUND`, `NOT_STORED` ), moxi
has its own set of proxy-specific error responses. These follow the
`SERVER_ERROR` prefix used by memcached ascii protocol.

 * `SERVER_ERROR proxy downstream closed`

   Moxi returns `SERVER_ERROR proxy downstream closed` when moxi sees a connection
   it previously had to a downstream memcached/membase server has closed.

   This can be a transient error response. That is, if memcached/membase had just a
   very quick, transient connectivity issue, moxi should `heal` on the next
   request, where moxi might immediately attempt a re-connect() to handle the next
   request. The `might` is due to moxi's blacklisting/backoff feature. moxi tracks
   the number of errors it sees during its re-connect attempts. If moxi counts up
   too many errors during its re-connect attempts, it will blacklist that
   uncontactable server for awhile. Requests to other online servers will continue
   as normal. The default configuration values for moxi for connect\_max\_errors is
   5 and for the connect\_retry\_interval is 30000 (the number of milliseconds that
   moxi should blacklist a server that reaches connect\_max\_errors number of
   consecutive connect() errors).

 * `SERVER_ERROR proxy write to downstream`

   This is a variation of moxi losing its connection to a downstream
   memcached/membase server, but is returned when moxi sees the error through a
   different codepath (while trying to write to a socket to a downstream
   memcached/membase server). Pragmatically, `SERVER_ERROR proxy write to
   downstream` and `SERVER_ERROR proxy downstream closed` can be treated as
   synonyms.

 * `SERVER_ERROR proxy downstream timeout`

   In this error response, moxi reached a timeout while waiting for a downstream
   server to respond to a request. That is, moxi did not see any explicit errors
   such as a connection going down, but the response is just taking too long. The
   downstream connection will be also closed by moxi rather than putting the
   downstream connection back into a connection pool. The default
   downstream\_timeout configuration is 5000 (milliseconds).

 * `SERVER_ERROR unauthorized, null bucket`

   The `SERVER_ERROR unauthorized, null bucket` response is returned by moxi when
   your client connection is associated with the NULL BUCKET and the client is
   trying to perform key-value operations on items in the NULL BUCKET. This usually
   means your client has not yet done SASL authentication (and the `default` bucket
   has been deleted by your membase Administrator).

   You may also see this error very early right after bucket creation, when the
   bucket creation configuration change is still propagating throughout the membase
   cluster and its clients.

 * `SERVER_ERROR a2b not_my_vbucket`

   The `SERVER_ERROR a2b not_my_vbucket` error response is returned by moxi during
   a Rebalance operation when it cannot find a server that owns the vbucket that
   owns a given item key-value.

   When moxi receives a not-my-vbucket error response from a downstream
   membase/memcached server, moxi will start looking for the right
   membase/memcached server that should own that vbucket. If moxi was provided a
   `fast-forward-map`, it will use that information to ask the expected new owner
   of the vbucket. Otherwise, moxi will probe all the servers in the cluster,
   serially, and twice to see if it can find the membase/memcached server that owns
   the vbucket. If no membase/memcached server owns that vbucket, moxi will finally
   return the `SERVER_ERROR a2b not_my_vbucket` error response to your client
   application.

**Unhandled:** `[:unknown-tag :bridgehead]` Moxi will respond to the client with
the same binary error response message that it received from the downstream
membase/memcached server.

For all other proxy-related errors, moxi will respond with a binary error
message with the status/error code of:

 * `PROTOCOL_BINARY_RESPONSE_EBUSY` - during a timeout

 * `PROTOCOL_BINARY_RESPONSE_ENOMEM` - if moxi or membase runs out of memory

 * `PROTOCOL_BINARY_RESPONSE_EINTERNAL` - if moxi cannot contact a membase server
   or a connection to a membase server is closed or lost

<a id="moxi-internals"></a>
