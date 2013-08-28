## Admin REST API

The admin API runs on port 4985 (by default, unless you change the `adminInterface` config.) It's a superset of the public REST API with two major extensions:

* The ability to view, create and modify users and roles.
* Management tasks like creating and deleting databases.
* _No authentication:_ it's superuser mode, where you can view and modify anything without needing a password or session cookie.

Needless to say: **DO NOT EXPOSE THIS PORT!** It belongs behind your firewall. Anyone who can reach this port has free access to and control over your databases and user accounts.

### Admin-only API Endpoints

`PUT /$DB/` -- Configures a new database. The body of the request should be the database configuration as a JSON object, i.e. the same as an entry in the `databases` property of a [[config file|Administration-Basics]]. Note that this doesn't create a Couchbase Server bucket: you have to have done that first.

`DELETE /$DB/` -- Removes a database. It doesn't delete the Couchbase Server bucket or any of its data, though, so you could bring the database back later with a PUT.

`/$DB/_user/$name` -- represents a user account. Supports GET, PUT, DELETE; you can also POST to `/$DB/_user/`. The body is a JSON object; for details see the [[Authentication]] page. The special user name `GUEST` applies to unauthenticated requests.

`/$DB/_role/$name` -- represents a role. API is similar to users.

`/$DB/_session` -- POST to this to create a login session. The body should be a JSON object containing the username in `name` and the duration of the session (in seconds) in `ttl`. The response will be a JSON object with properties `session_id` (the session cookie string), `expires` (the time the session expires) and `cookie_name` (the name of the HTTP cookie to set.)

`/_compact` -- API to compact a database by removing obsolete document bodies. Needs to be run occasionally.

`/_profile` -- POST to this to enable Go CPU profiling, which can be useful for diagnosing performance problems. To start profiling, send a JSON body with a `file` property whose value is a path to write the profile to. To end profiling, send a request without such a property.

### Tips

A quick way to tell whether you're talking to the admin API or not is to `GET /` and check whether the resulting object contains an `"ADMIN": true` property.

HTTP requests logged to the console (using the "HTTP" logging flag, which is on by default) show the username of the requestor after the URL. If the request is made on the admin port, this will be "(ADMIN)" instead.
