# Tutorial

This tutorial will guide you through development of an application using PHP and
Couchbase.

SQL databases and key-value stores such as Couchbase are general solutions to
the web development problem of maintaining applications state across multiple
systems and over time; as such they are similar, but there are many important
differences. Most PHP developers are familiar with SQL databases, so the
emphasis on the Couchbase implementation will be on how it differs from using
SQL.

<a id="couchbase-sdk-php-tutorial-prereq"></a>

## Prerequisites

This section assumes that you have installed Couchbase PHP SDK, that your web
server is properly configured to serve PHP pages and that you've installed the
Couchbase server on your development machine. We assume you have at least one
instance of Couchbase Server and one data bucket established. If you need to set
up these items in Couchbase Server, you can do with the Couchbase Administrative
Console, or Couchbase Command-Line Interface (CLI), or the Couchbase REST-API.
For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed the Couchbase
SDK, you can compile and run the following basic program.

<a id="couchbase-sdk-php-tutorial-example-app"></a>

## Example Application: WebChat

The demonstration application provides a means of chatting over the web:
WebChat. It's a rudimentary implementation with various features specifically
designed to demonstrate the PHP/Couchbase interface. It allows user
registration, login, logout as well as adding chat messages, viewing them and
deleting them. To do this it uses add, increment, delete and append Couchbase
key manipulation methods.

<a id="couchbase-sdk-php-tutorial-database-design"></a>

## Database design

One of the first things usually undertaken in an SQL-based web application
development project is the creation of a schema: the structure of database
tables and their relationship. Couchbase has no tables. Like a PHP Array data
type, all we have are key-value pairs to work with. On top of that, there is no
mechanism for enumerating the keys you've created, so unless you know the keys
to ask for you won't be able to find any of your data.

<a id="couchbase-sdk-php-tutorial-workflow"></a>

## Workflow

Our WebChat workflow will be simple. If you try to access the system and aren't
logged in it will route you to a login page (login.php). If you're not
registered, you can go to the registration page (register.php), and from there
log in. Once you're logged in, you are routed to the chat page (chat.php) and
can engage in chat with other logged-in users: you can add a comment or delete
your own comments. From there you can log out (logout.php). This workflow is
summarized in Figure 1.


![](couchbase-sdk-php-1.0/images/figure1_workflow.png)

Let's think a little bit about how we're going to store our user information. As
mentioned previously, there are no SQL style schemas in Couchbase, only keys and
values. In addition, we can't enumerate a list of keys in the Couchbase bucket
we're using. This means we have to know what we're looking for before we look;
we can't select `* from TABLE` as we would using an SQL query. Also, even
assuming we've only got one application using the given bucket, care must be
taken in key naming conventions so that collisions don't occur with keys of
different types.

For our keys, we'll prefix each key first with the application name, then the
key type, for example a user named jsmith will get a user key in Couchbase of
chat::user::jsmith, where the value associated with that key will contain the
account information. We're prefacing the user key with the application name in
case we later choose to share this bucket with another application; if all
applications follow this convention we're creating a namespace for each
application and we can be avoid key collisions between apps.

For the user comments we'll keep a single key that lists the maximum comment
number so far achieved, and the comments themselves will have keys containing
their comment number, for example, chat::COMMENT\#23

This is another method of determining the keys for values we may want to
retrieve, somewhat different from that of the user list discussed above.

Though we won't be implementing an administration function for managing users in
this example application, we want to design our data model to support that
possibility. This means that it should be possible to enumerate all users. To
allow this, for each user we add, we'll append the username to a string held in
the key `chat::userlist`. We'll be using the API `append()` method to that this.
`append()` is functionally equivalent to doing a `get()` on the key, appending
the new user to the returned text, and storing it again. The `append()` method
requires less code and is also atomic, while a get, modify, and update sequence
would not be.

The value held by a given key is of a default maximum size of 1 megabyte, though
it can be increased with server side configuration. This should be kept in mind
if you are, for example, doing many appends in long running or large-scale
applications that are likely to exceed this limit.

<a id="couchbase-sdk-php-tutorial-example-app-structure"></a>

## Project Directory Structure

WebChat follows a standard structure for small and medium sized PHP projects,
which is shown in the list below. The base directory contains PHP scripts
corresponding to application views that the user will see (login.php,
logout.php, register.php, chat.php), while a subdirectory (here named include)
contains utility classes for page layout (header.php, footer.php) and a library
file (include.php) of classes that do most of the work of the application.
Finally the css directory contains our application specific style sheet
(chat.css) which makes the generated web pages pretty and helps to avoid
cluttering our PHP files with excessive HTML formatting.

 * index.php

 * login.php

 * logout.php

 * register.php

 * chat.php

 * css

    * chat.css

 * include

    * include.php

    * header.php

    * footer.php

We'll discuss each of these files in turn to explain how the application works,
with the exception of chat.css, which makes the output prettier, but doesn't
affect the way it works. All the files are available in the provided
supplemental file [Zip
file](http://www.couchbase.com/docs/examples/couchbase-sdk-php-examples-1.0.0.zip).

<a id="couchbase-sdk-php-tutorial-supporting-php"></a>

## Supporting PHP files

The first file, index.php (Listing 1), provides a redirect. If a user attempts
to access the root directory, we'll redirect to chat.php that will, in turn,
redirect the page to login.php if they're not already logged in.

Listing 1: index.php


```
<?php
    header("Location: chat.php");
    exit;
?>
```

Listing 2 shows the header file which sets the stylesheet, the page title and
sets up the HTML markup.

Listing 2: header.php


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
     <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <title><?php
echo ($title);
?></title>
     <link rel="stylesheet" href="css/chat.css" type="text/css"
    media="screen" /> </head>
<body>
<div id="frame">
<div id="header">
     <h1><?php
echo ($APP_NAME);
?></h1>
</div>
```

Listing 3 shows footer.php, which displays login status and closes off the
markup.

Listing 3: footer.php


```
<div id="footer">
    <?php
    if(empty($_SESSION{"userid"})){
        echo("Not logged in.<br>");
?>
    <a href="login.php">Login here</a>
    <?php
}else{
echo("Logged in as user <i>" . $_SESSION{"userid"} . "</i>");
echo("<br>");
echo("<a href='logout.php'>Logout</a>");
}?>
</div>
</div>
</body>
</html>
```

Like pieces of bread around a sandwich, the header and footer are boring but
mandatory items included at the top and bottom of every page output by our
application. Like sandwiches, all the interesting stuff happens between the
bread.

include.php contains the meat of our application, and you'll see it included
first at the top of every PHP page, even before the header.php file. It starts
the PHP session and contains a variety of constants used elsewhere in the
application and the `User`, `Comment` and `CouchbaseSingleton` classes that do
the bulk of the work in this application.

The first two clauses of include.php (Listing 4) set the error output and
warnings to maximum and direct their output to the web server. While this is
something we would turn off on a production web server, its helpful to see all
warnings and errors while in development. The global constants are accessible by
other pages and classes called after this file has been included.

Listing 4: include.php constants and settings


```
error_reporting(E_ALL);
ini_set("display_errors", 1);

//start our session
session_start();

//Global constants
$APP_NAME="PHP Couchbase WebChat";
define('APP_PREFIX',"chat");
define('KEY_DELIM',"::");
define('COUCHBASE_SERVER',"localhost:8091");
define('COUCHBASE_USER','Administrator');
define('COUCHBASE_PASS','asdasd');
define('COUCHBASE_BUCKET','default');
```

The `$APP_NAME` variable is output by the header at the top of every page.

The constants that are set using the `define` function are used by the classes
defined later in the file. `APP_PREFIX (chat)` is added to the front of every
key avoid potential key name collisions with other applications using the same
bucket. `KEY_DELIM` (set to two colons "::")is used to delimit the various
portions of the keys; so, for example, the key for comment number 99 will be the
concatenation of `APP_PREFIX, KEY_DELIM`, the key type (in this case comment),
the `KEY_DELIM` again and the comment number: `chat::comment::99`.

`COUCHBASE_SERVER`, `COUCHBASE_USER`, `COUCHBASE_PASS` and `COUCHBASE_BUCKET`
indicate the location of the Couchbase server and bucket we'll be connecting to.
You can change these to match the address and port of your own server.

The next part of the include.php file contains the three classes that do most of
the work: `CouchbaseSingleton`, `User` and `Comment`.

The `CouchbaseSingleton` class (Listing 5) is a wrapper for the `Couchbase`
library class. Both the `User` and `Comment` class (which we'll see next)
require a Couchbase library connection to the Couchbase server.

Listing 5: include.php `CouchbaseSingleton` class


```
/**
* Singleton Couchbase class
* This keeps a single global copy of the Couchbase
* Couchbase connection.
*/
class CouchbaseSingleton{
    private static $instance;
    private static $cb_obj;

    /**
    * Construct the object
    */
    private function __construct() {
    }

    /**
    * Initialize this class after construction
    */
    private function initialize(){
        self::$cb_obj = new Couchbase(COUCHBASE_SERVER, COUCHBASE_USER, COUCHBASE_PASS, COUCHBASE_BUCKET);
        self::$cb_obj->setOption(COUCHBASE_OPT_COMPRESSER,false);
    }

    /**
    * Return the singleton instance, constructing and
    * and initializing it if it doesn't already exist
    */
    public static function getInstance() {
        if(!self::$instance) {
            self::$instance = new self();
            self::$instance->initialize();
        }
        return self::$instance;
    }

    /**
    * Return the Couchbase object held by the singleton
    */
    public static function getCouchbase(){
        return(self::$cb_obj);
    }
}
```

Rather than have more than one `Couchbase` library instance created, we use
`CouchbaseSingleton` to ensure we initialize and use only one copy per
invocation of the application. When the static method `getInstance()` is called,
it creates a `CouchbaseSingleton` instance and initializes a `Couchbase`
instance, which may be retrieved using the `getCouchbase()` method. If a
Couchbase connection is required, the call:
`CouchbaseSingleton::getInstance()->getCouchbase()` will provide a reference
with the appropriately initialized Couchbase server information and avoid
recreating one. Though this is overkill for the current implementation, if it
were to get significantly more complex (as applications tend to), it avoids the
issue of multiple Couchbase library instances being instantiated by different
classes.

The Couchbase library has limited functionality for connecting to servers; it
does not directly support vBuckets or SASL authentication. You can, however,
configure multiple servers with associated weights (connection priorities) by
specifying hostname, port and weight. One solution is to use client-side Moxi to
act as a proxy service to the Couchbase Server cluster.

The key method of the `CouchbaseSingleton` class is `initialize()`, which
configures the connection to the Couchbase server. In initialize()we turn off
compression using: `setOption(COUCHBASE_OPT_COMPRESSER,false)` as the Couchbase
`append` method is only supported if the Couchbase records are not compressed.

The User class (Listing 6) handles user related actions; registration, login and
logout.

Listing 6: include.php `User` class


```
/**
 * User class
 * This handles user interactions with Couchbase through
 * the Couchbase interface.
 */
class User {
    private $last_error_string;
    /**
     * Create a user account based on provided userid
     * and password.
     * @param string $userid
     * @param string $password
     * @return boolean
     */
    public function createUserAccount($userid, $password) {
        $error = "";
        if(!preg_match("/^\w{4,10}$/", $userid)) {
            $error .= "Illegal userid '<i>$userid</i>'<br>";
        }
        if(!preg_match("/^.{4,10}/", $password)) {
            $error .= "Password must have between 4 and 10 characters";
        }
        if($error != "") {
            $this -> last_error_string = $error;
            return false;
        }

        $cb_obj = CouchbaseSingleton::getInstance() -> getCouchbase();
        //check to see if the userid already exists
        $userid_key = APP_PREFIX . KEY_DELIM . "user" .
KEY_DELIM . $userid;
        $passwordHash = sha1($password);
        if($cb_obj -> add($userid_key, $passwordHash)) {
        //now that we've added the userid key we'll add it to the userlist
            $userlist_key = APP_PREFIX . KEY_DELIM . "userlist";
            if(!$cb_obj -> add($userlist_key, $userid)) {
                $cb_obj -> append($userlist_key, KEY_DELIM . $userid);
            }
            return true;
        } else {
            $result_code = $cb_obj -> getResultCode();
            if($result_code == COUCHBASE_KEY_EEXISTS) {
                $this -> last_error_string .=
                "User id '<i>$userid</i>' exists, please choose another.";
            } else {
                $this -> last_error_string .=
                "Error, please contact administrator:" .
                $cb_obj -> getResultMessage();
            }
            return false;
        }
    }

    /**
     * Attempt to login the user
     * @param string $userid
     * @param string $password
     * @return boolean
     */
    public function loginUser($userid, $password) {
        $cb_obj = CouchbaseSingleton::getInstance() -> getCouchbase();
        //check to sees if userid exists with the same password hashed
        $userid_key = APP_PREFIX . KEY_DELIM .
 "user" . KEY_DELIM . $userid;
        $submitted_passwordHash = sha1($password);
        $db_passwordHash = $cb_obj -> get($userid_key);
        if($db_passwordHash == false) {
            return (false);
        }
        //do we match the password?
        if($db_passwordHash == $submitted_passwordHash) {
            $_SESSION{"userid"} = $userid;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Log the user out
     */
    public function logoutUser() {
        session_unset();
        session_destroy();
    }

    /**
     * Get the error string from the last action
     * @return string
     */
    public function getLastErrorString() {
        return $this -> last_error_string;
    }
}
```

The `createUser` method is called from the register.php file, which we'll see
later. It checks that the userid and password are of the correct format (userid
4-10 alphanumeric or underscore characters, password 4-10 characters), then
attempts to add the new user to the database. The key is of the format:
`Chat::user::$userid`, and the value is the sha1 hash of the password. If it
fails (the method returns false), we set a private class error variable
`$last_error_string`, which can be retrieved using the `getLastErrorString`
method. There are many possible failure modes for an add (see the Couchbase
documentation; in this case we're only dealing with one explicitly, where the
user id is already taken. In that case the error code is
`COUCHBASE_KEY_EEXISTS`. All other error cases are converted to text using the
`getResultMessage()` method for text display to the user.

If the user id addition is successful then we add it to the user list (stored in
the `chat::userlist` key) with the `append` method. This will result in a value
for the userlist of the form `bjones::fdavis::jsmith` enumerating all user ids
that have successfully created accounts. Though we don't currently use this
elsewhere in the application, if we were to create a user management
administration view, we'd need some way to find the full list of user ids. This
list is where we would get that information.

The `loginUser` method of the User class is called from the login.php page. It
retrieves the user id record (if it exists) from Couchbase, and then compares
the retrieved sha1 hash with the hash of the provided password. If they match,
the user is logged in by setting the userid value in the session variable.

The `logout` method is particularly simple; it destroys the PHP session for the
current user.

The `Comments` class (Listing 7) manages adding, listing and deleting comments.

Listing 7: include.php Comment


```
/**  * Comments class for managing comments in Couchbase
  * through the Couchbase library
  */
class Comments {
     /**
      * Return the last n comments
      * @param integer $count
      * @return Array
      */
     public function getLastComments($count) {
         $cb_obj = CouchbaseSingleton::getInstance() -> getCouchbase();
         $comment_count_key = APP_PREFIX . KEY_DELIM . "chatcount";
         $script_comment_count = $cb_obj -> get($comment_count_key);
         $comment_key_list = array();
         for($i = $script_comment_count; $i > 0 &&
              $i > ($script_comment_count - $count); $i--) {
              array_push($comment_key_list, "COMMENT#" . $i);
         }
         $null = null;
         return ($cb_obj -> getMulti($comment_key_list,
             $null, Couchbase::GET_PRESERVE_ORDER));
     }
     /**
      * Add a comment to the comment list
     * @param string
     */
    public function addComment($comment) {
         $cb_obj = CouchbaseSingleton::getInstance() -> getCouchbase();
         if($comment != "") {
             $comment_count_key = APP_PREFIX . KEY_DELIM . "chatcount";
             $comment_count = $cb_obj -> get($comment_count_key);
             if($cb_obj -> getResultCode() == COUCHBASE_KEY_ENOENT) {
                 $cb_obj -> add($comment_count_key, 0);
             }
             $script_comment_count = $cb_obj -> increment($comment_count_key);
             $cb_obj -> add("COMMENT#" . $script_comment_count, $_SESSION{"userid"} .
              KEY_DELIM . $_POST["comment"]);
         }
     }
     /**
      * delete a comment from the list by number
      * @param integer $number
      */
     public function deleteComment($number) {
         $cb_obj = CouchbaseSingleton::getInstance() -> getCouchbase();
         $comment_key = "COMMENT#" . $number;
         $result = $cb_obj -> get($comment_key);
         $elements = explode(KEY_DELIM, $result);
         $userid = array_shift($elements);
         //make sure user who created is deleting
         if($userid == $_SESSION{"userid"}) {
             $result = $cb_obj -> delete($comment_key);
         }
     }
 }
 ?>
```

The `addComment` method takes the provided comment and adds it to the Couchbase
database. The current comment number is stored in the `$comment_count_key` key
`(chat::chatcount)`. To add the comment to the database, the comment count key
is incremented and we take the resultant number as our next comment number.
Couchbase guarantees that the increment and retrieval are atomic, so we can be
sure that we won't collide with comment key number generated by another instance
of the web application. The key for the comment is created, of the form
`chat::COMMENT#9`. The corresponding comment value is of the form
userid::comment, so that the comment is prepended by the identity of the
submitter. We could serialize a data structure into the value if desired;
however we've chosen to use text here for the sake of simplicity and clarity.

The `deleteComment` method takes a comment number as an argument and deletes
that comment if the same user who submitted the comment requested the action.

The `getLastComments` method returns the specified number of comments in an
array, counting backwards from the most current comment. The current comment
count is retrieved to determine the most recent comment number. From this, an
Array of keys is generated counting backwards from that comment, and the
Couchbase getMulti method is used to retrieve them all simultaneously, which is
more efficient than looping and retrieving each individually. The results are
returned in an Array with the key being the request key and the value being the
value retrieved from Couchbase. If a key doesn't exist because that comment has
been deleted, the value returned is empty.

The next few listings describe pages that provide views of the application;
login, logout, register and chat.

The login view (Figure 2) is a userid and password form.


![](couchbase-sdk-php-1.0/images/figure2_login.png)

The login code (login.php, Listing 8) passes the userid and password fields to
the createUser method of the User class we saw previously in
include/include.inc.

Listing 8: login.php8


```
<?php
include_once ("include/include.php");

$loginfailed = "";
if(!empty($_POST{"userid"})) {
    $user = new User();
    if(!$user -> loginUser($_POST{"userid"}, $_POST{"password"})) {
        $loginfailed = "Login attempt failed";
    }
}

if(!empty($_SESSION{"userid"})) {
    header("Location: chat.php");
    exit ;
}

$title = "Login";
include_once ("include/header.php");
?>
<div id="content">
    <h2>Login to MemChat</h2>
    <?php echo $loginfailed
    ?><br>
    <form method="post" action="login.php" id="loginform" style="width:40%">
        <fieldset>
            <label for="userid">
                User id:
            </label>
            <input type="text" name="userid" length=20>
            <label for="password">
                Password:
            </label>
            <input type="password" name="password" id="password" length=20>
            <input type="submit" name="login" id="registration">
        </fieldset>
    </form>
    Register
    <a href="register.php">here</a> if you don't have an account.
</div>
<?php
include_once ("include/footer.php");
?>
```

If the user is already logged in (i.e., there is a value for
`$_SESSION{"userid"}` ), they are immediately redirected to the chat.php file.
If there is an error on login (in which case the the `loginUser` method returns
false) the login page is shown again with a login error.

The logout screen (Figure 3) just indicates the logged out status of the user.


![](couchbase-sdk-php-1.0/images/figure3_logout.png)

The logout code (logout.php, Listing 9) calls the `User` class `logoutUse` r
method, which we've seen already, then clears the current user PHP session.

Listing 9: logout.php


```
<?php
    include_once("include/include.php");
    $userid=$_SESSION{"userid"};
    $title="Logout";
    include_once("include/header.php");
    $user = new User();
    $user->logoutUser();
    echo("$userid logged out");
    include_once("include/footer.php");
?>
```

The register screen (Figure 4), is similar to the login page and provides a
userid and password form.


![](couchbase-sdk-php-1.0/images/figure4_register.png)

The register code (register.php, Listing 10) is similar to login; it takes a
userid and password and calls the User class createUserAccount method; if an
error is returned (for example the userid already exists) then the error is
displayed.

Listing 10: register.php


```
<?php
    include_once("include/include.php");
    $title="Register User";
    include_once("include/header.php");
    $result = false;
    //opening the register page logs you out
    $user=new User();
    $user->logoutUser();
    if(!empty($_POST{"userid"})){
        $userid=$_POST{"userid"};
        $result = $user->createUserAccount($_POST{"userid"},$_POST{"password"});
        if($result == true){
            echo     "<div id='error'>" .
                    "User id '<i>$userid</i>' successfully created.
<br> " .
                    "<a href='login.php'>Login here</a>" .
                    "</div>";
        }else{
            echo "<div id='error'>" . $user->getLastErrorString() .
"</div>";
        }
    }
    if($result != true){
?>
<div id="content">
    <h2>Register to use WebChat</h2>
    <form method="post" action="register.php" id="registrationform"
style="width:40%">
        <fieldset>
            <label for="userid">
                User id:
            </label>
            <input type="text" name="userid" id="userid">
            <label for="password">
                Password:
            </label>
            <input type="password" name="password" id="password">
            <input type="submit" name="registration" id="registration">
        </fieldset>
    </form>
    <small>
        <i>
        User id must have between 4 and 10 characters.
        <br>
        Only letters, numbers and underscore characters are permitted
        </i>
    </small>
</div>
<?php
}
include_once("include/footer.php");
?>
```

The chat view (Figure 5) displays the user chat form (a text field and a
button), and the last ten submitted comments. The delete buttons in the "Action"
allow a user to delete their own comments.


![](couchbase-sdk-php-1.0/images/figure5_chat.png)

The chat view (chat.php, Listing 11) has the most user interaction and
behavioral complexity, however the bulk of this behavior is implemented in the
Comments class; the chat.php code is relatively simple.

Listing 11. chat.php


```
<?php
include_once ("include/include.php");
if(empty($_SESSION{"userid"})) {
    header("Location: login.php");
}
$title = "Chat";
include_once ("include/header.php");
?>
<form method="post" action="chat.php" id="chat">
    <div>
    <input type="text" name="comment" id="comment" maxlength="50" size="50"/>
    <input type="submit" name="submitcomment" id="submitcomment" value="Submit
 comment" />
    </div>
</form>
<br>

<?php
$comments = new Comments();
if(!empty($_POST{"comment"})) {
    $comments -> addComment($_POST{"comment"});
}
if(!empty($_POST{"delete"})) {
    $comments -> deleteComment($_POST{"commentnum"});
}
$comment_list = $comments -> getLastComments(10);
$keys = array_keys($comment_list);
?>
<table>
    <tr>
        <th width="10%" align="center">Comment #</th>
        <th>Action</th>
        <th>User ID</th>
        <th width="60%">Comment</th>
    </tr>
    <?php
    foreach($keys as $key) {
        echo "<tr>\n";
        $result = explode(KEY_DELIM, $comment_list{$key});
        $userid = array_shift($result);
        $message = implode(KEY_DELIM, $result);
        $commentnum = array_pop(explode("#", $key));
        $actionlink = "";
        if(empty($userid)) {
            $userid = "?";
            $message = "<i>deleted</i>";
        }
        if($_SESSION{"userid"} == $userid) {
            $actionlink =
"<form method='post' action='chat.php' id='message" . $commentnum . "'>";
            $actionlink .= "<input type='hidden' value='$commentnum'
 name='commentnum'>";
            $actionlink .= '<input type="submit" value="delete" name="delete"
style="background: none; border: none; font-style: italic;" >';
            $actionlink .= "</form>";
        }

echo("<td>$commentnum</td><td>$actionlink</td><td>
$userid</td><td>$message</td>\n");
        echo "</tr>\n";
    }
    ?>
</table>
<?php
include_once ("include/footer.php");
?>
```

If a non-logged in user accesses the chat view, they are immediately routed to
the login page. If they are logged in, a chat form is displayed with the last 10
comments shown in decreasing order (i.e. increasing in age as they go down the
page). If the currently logged in user created a given comment, a button to
delete it is shown in the action column (Figure 5) for that comment. The delete
button looks like a link, but it is actually a borderless button on a form that
does a POST submission to the chat.php page. `Comment` class methods handle both
comment submission and comment deletion.

WebChat is an example application that outlines various features of Couchbase as
they apply to PHP development. We've demonstrated how to add, delete, append and
retrieve data from Couchbase using the Couchbase library in addition to
identifying error states. This example should give you a clear idea of how to
begin using Couchbase with your own PHP application.

<a id="migrate-to-couchbase"></a>
