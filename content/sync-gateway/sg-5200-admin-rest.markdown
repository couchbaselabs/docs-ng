## Admin REST API

The Admin REST API is a superset of the Sync REST API with the following major extensions:

* The capability to view, create, and modify users and roles.
* The capability to perform management tasks such as creating and deleting databases.
* The capability to perform administrative tasks without authentication.  The Admin REST API operates in superuser mode—you can view and modify anything without needing a password or session cookie.

By default, the Admin REST API runs on port 4985 (unless you change the `adminInterface` configuration parameter). **Do not expose this port**—It belongs behind your firewall. Anyone who can reach this port has free access to and control over your databases and user accounts.



### Admin REST API Endpoints

`PUT /$DB/` -- Configures a new database. The body of the request contains the database configuration as a JSON object ()the same as an entry in the `databases` property of a configuration file. Note that this doesn't create a Couchbase Server bucket—you need to do that before configuring the database.

`DELETE /$DB/` -- Removes a database. It doesn't delete the Couchbase Server bucket or any of its data, though, so you could bring the database back later with a PUT.

`/$DB/_user/$name` -- represents a user account. It supports GET, PUT, and DELETE, and you can also POST to `/$DB/_user/`. The body is a JSON object; for details see the [[Authentication]] page. The special user name `GUEST` applies to unauthenticated requests.

`/$DB/_role/$name` -- represents a role. This API is similar to users.

`/$DB/_session` -- POST to this endpoint to create a log-in session. The body is a JSON object containing the username in `name` and the duration of the session (in seconds) in `r`. The response is a JSON object with properties `session_id` (the session cookie string), `expires` (the time the session expires) and `cookie_name` (the name of the HTTP cookie to set).

`/_compact` -- Compacts a database by removing obsolete document bodies. Needs to be run occasionally.

`/_profile` -- POST to this endpoint to enable Go CPU profiling, which can be useful for diagnosing performance problems. To start profiling, send a JSON body with a `file` property whose value is a path to write the profile to. To stop profiling, send a request without a `file` property.

### Tips

A quick way to tell whether you're talking to the Admin REST API is by sending a `GET /` request and checking whether the resulting object contains an `"ADMIN": true` property.

HTTP requests logged to the console (using the "HTTP" logging flag, which is on by default) show the user name of the requester after the URL. If the request is made on the admin port, this is "(ADMIN)" instead.
