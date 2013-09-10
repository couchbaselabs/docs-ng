## Authorizing Users

You can authorize users and control their access to your database by creating user accounts and assigning roles to users.

### Accounts

You manage accounts by using the Admin REST API.This interface is privileged and for administrator use only. To allow clients to manage accounts, you need to have some other server-side mechanism that calls through to this API.

The URL for a user account is `/databasename/_user/name`, where databasename is the configured name of the database and name is the user name. The content of the resource is a JSON document with the following properties:

* `name`: The user name (same as in the URL path). Names must consist only of alphanumeric ASCII characters or underscores.

* `admin_channels`: Describes the channels that the user is granted access to by the administrator. The value is an array of channel-name strings.

* `all_channels`: Like `admin_channels` but also includes channels the user is given access to by other documents via a sync function. This is a derived property and changes to it will be ignored.

* `roles`: An optional array of strings that contain the roles the user belongs to.

* `password`: In a PUT or POST request, you can set the user's password with this property. It is not returned by a GET request.

* `disabled`: This property is usually not included. if the value is set to `true`, disables access for that account.

* `email`: The user's email address. This property is optional, but Persona login needs it.

You can create a new user by sending a PUT request to its URL, or by sending a POST request to `/$DB/_user/`. 

### Anonymous Access

A special user account named `GUEST` applies to unauthenticated requests. Any request to the Sync REST API that does not have an `Authorization` header or a session cookie is treated as coming from the `GUEST` account. This account and all anonymous access is disabled by default. 

To enable the GUEST account,  set its `disabled` property to false. You might also want to give it access to some channels. If you don't assign some channels to the GUEST account, anonymous requests won't be able to access any documents. The following sample command enables the GUEST account and allows it access to a channel named public:

```sh
$ curl -X PUT localhost:4985/$DB/_user/GUEST --data \
   '{"disabled":false, "admin_channels":[“public”]}'
```


### Roles


*Roles* are named collections of channels. A user account can be assigned to zero or more roles. A user inherits the channel access of all roles it belongs to. This is very much like Unix groups, except that roles do not form a hierarchy.

You access roles through the Admin REST API much like users are accessed, through URLs of the form `/dbname/_role/name`. Role resources have a subset of the properties that users do: `name`, `admin_channels`, `all_channels`.

Roles have a separate namespace from users, so it's legal to have a user and a role with the same name.

## Authenticating Users

You can authenticate users by using the methods described in the following sections.

### HTTP

 Sync Gateway allows clients to authenticate by using either HTTP Basic Auth or cookie-based sessions. The session URL is `/dbname/_session`.

### Persona

Sync Gateway supports [Mozilla Persona](https://developer.mozilla.org/en-US/docs/persona), a sign-in system for the web that allows clients to authenticate by using an email address. You can enable Persona either by modifying your server configuration file or by starting Sync Gateway with an additional command-line option.

To enable Persona by modifying the configuration file, add a top-level `persona` property to the file. The value of the `persona` property is an object with an `origin` property that contains your server's canonical root URL as seen by clients. For example:

```

"persona": {
   "origin": "http://example.com/",
   "register": true
}
```

To enable Persona when you start Sync Gateway, add the `-personaOrigin` option to the command line and specify the server's canonical root URL. For example:

```
$ sync_gateway -personaOrigin http://example.com
```

The `origin` URL must be specified explicitly because the Persona protocol requires both client and server to agree on the server's identity, and there's no reliable way to derive the URL on the server, especially if it's behind a proxy.

After that's set up, you need to set the `email` property of the user accounts, so that the server can look up the account based on the email address given in the Persona credentials.

Clients log in by sending a POST request to `/dbname/_persona`. The request body is a JSON document that contains an `assertion` property whose value is the signed assertion received from the identity provider. Just as with a `_session` login, the response sets a session cookie.

#### Persona Account Registration

If the `register` property of the Persona configuration is true, then clients can implicitly register new user accounts by authenticating through Persona. If the gateway verifies the client's assertion, but no existing user account has that email address, it creates a new user account for that email and returns a session cookie.

The user name for the new account is the same as the authenticated email address and has a random password. There is no way to retrieve the password, so in the future the client must continue to log in using Persona, unless the app server replaces the password with one known to the client.

### Custom (Indirect) Authentication

An app server can create a session for a user by sending a POST request to `/dbname/_session`. This works only on the admin port. 

The request body is a JSON document with the following properties:

* `name`: User name

* `ttl`: Number of seconds until the session expires. This is an optional parameter. If `ttl` is not provided, the default value of 24 hours is used.

The response body is a JSON document that contains the following properties:

 * `session_id`: Session string 
 
* `cookie_name`: Name of the cookie the client should send 
 
* `expires` : Date and time that the session expires

This allows the app server to optionally do its own authentication using the following control flow:

1. Client sends credentials to your app server.

2. App server authenticates the credentials however it wants (LDAP, OAuth, and so on).

3. App server sends a POST request with the user name to the Sync Gateway Admin REST API server `/dbname/_session` endpoint.

4. If the request fails with a 401 status, there is no Sync Gateway user account with that name. The app server can then create one (also using the Admin REST API) and  repeat the `_session` request.

5. The app server adds a `Set-Cookie:` HTTP header to its response to the client, using the session cookie name and value received from the gateway.

Subsequent client requests to the gateway will now include the session in a cookie, which the gateway will recognize. For the cookie to be recognized, your site must be configured so that your app's API and the gateway appear on the same public host name and port.

### Session Expiration

By default, a session created on Sync Gateway lasts 24 hours. If you create sessions by sending a POST request to `/db/_session`, you can set a custom value that overrides the system default. However, if you are using Persona for authentication, the only way to customize the session length is by modifying the `kDefaultSessionTTL` constant in the `rest_session.go` file.  

