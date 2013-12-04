
# Users REST API

As of Couchbase Server 2.2+ you can create one read-only user with the REST API. 
For more information about this type of user, see [Read-Only Users](#couchbase-admin-tasks-read-only).



To create a read-only user, you need administrative access:

    curl -X POST -u admin:password http://localhost:8091/settings/readOnlyUser -d username=a_name -d password=a_password 
    
Replace the *admin*, *password*, *localhost*, *a_name*, and *a_password*
values in the above example with your actual values.

Upon success, you will get this response:

    success: 200 | []
    
The endpoint has one additional, optional parameter `just_validate=1`. If you provide this in 
your request the server will validate the username and password for a read-only user but will not 
actually create the user.

The following are the endpoints, parameters, expected return values and possible errors:

| Request       | Description  | Parameters           | Returns  | Errors  |
| ------------- |:-------------:| :-------------:|-----:| -----:|
| POST /settings/readOnlyUser | Create read-only user| username, password, just_validate |  success: 200 [] | error: 400 | {"errors":{field_name:error_message}}
| PUT /settings/readOnlyUser | Change read-only user password | password |  success: 200 [] | error: 400 | {"errors":{field_name:error_message}}
| DELETE /settings/readOnlyUser| Delete user | none |  success: 200 [] | error: 400 | {"errors":{field_name:error_message}}
|GET /settings/readOnlyAdminName | Get the read-only username | none |  success: 200 "username" | not found: 404 

A `username` is a UTF-8 string that does not contain spaces, control characters or any of these characters: ()<>@,;:\\\"/[]?={} characters. Any `password` must be UTF-8 with no control characters and must be at least six characters long. 

To change the password for a read-only user:

    curl -X POST -u admin:password http://localhost:8091/settings/readOnlyUser -d username=a_name -d password=new_password

To delete this user:

    curl -X DELETE -u admin:password http://localhost:8091/settings/readOnlyUser 

To get the read-only username, you can have administrative or read-only permissions:

    curl -u username:password  http://localhost:8091/settings/readOnlyAdminName

Replace the *admin*, *password*, *localhost*, *username*, *a_name*, and
*new_password* values in the above examples with your actual values.

This will return a response with the read-only username as payload, `success: 200 | "username"`. If there is no 
read-only user you will get this error `not found: 404`.



