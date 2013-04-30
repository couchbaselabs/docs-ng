# Couchbase and ASP.NET MVC 3 Tutorial

This tutorial will provide you with some experience for using Couchbase, C\#,
and ASP.NET MVC 3 and help give you some ideas when writing databases for your
own web applications.

<a id="prerequisites"></a>

## Prerequisites

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and one data
bucket established. If you need to set up these items, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

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

You also need to have Visual Studo 2010 Service Pack 1, and have installed
(using the Web Platform Installer) ASP.NET MVC 3.

<a id="stage1"></a>

## Stage 1: Create the Initial Application

Open Visual Studio 2010 and create a new project. Select ASP.NET MVC 3 Web
Application from the Web templates as shown in Figure 1.


![](images/fig01-new-mvc-3-project.png)

Next you need to select the Empty template, and select the Razor view engine.


![](images/fig02-mvc-3-empty.png)

You will need to create a few files. Right click the Controllers folder in
Solution Explorer and choose Add | Controller... Name this controller
`HomeController` and choose the Empty controller template. See Figure 3.


![](images/fig03-new-home-controller.png)

Next right click on the Views folder, and create a folder named Home and then
right click on that folder and choose Add | View... Name the view Index and use
the Razor template. You can leave everything else on the dialog as is, and click
the Add button.

After you've completed this, you will be left with Solution Explorer looking
like Figure 4.


![](images/fig04-after-stage-1.png)

Open the HomeController.cs file and make its contents look like Listing 1 now.

Listing 1, HomeController.cs


```
using System.Web.Mvc;

namespace CouchbaseTutorial.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// GET: /Home
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ViewData["Message"] = "I don't know you.";

            return View();
        }

    }
}
```

Then edit the Index.cshtml view file and set the contents to be that of Listing
2.

Listing 2, Index.cshtml


```
@using CouchbaseTutorial.Models;

@{
    ViewBag.Title = "Home";
}

<h2>Home</h2>

<p>@ViewData["Message"]</p>
```

In the next Stage, you will be downloading and configuring the Enyim Memcache
and Couchbase client library. We will refer to this as the client library or
simply as the client. The driver allows any.NET object to be saved into
Couchbase as long as that object is annotated with `Serializable`. So, we'll
make a simple data model object that we'll use to store user information into
the database with. See Listing 3. Right click on the Models folder and add a new
class.

Listing 3, User.cs


```
using System;

namespace CouchbaseTutorial.Models
{
    [Serializable]
    public class User
    {
        public Guid UserId { get; set; }
        public String UserName { get; set; }
        public String Password { get; set; }
        public String FullName { get; set; }
    }
}
```

There's nothing fancy about this, just a few auto properties to hold the data
in, and the very important `Serializable` attribute. Without this attribute, the
client will not be able to store the object into Couchbase. With it, the client
will serialize your model object directly into the database, and back again
without any extra work on your part — very convenient. Do keep in mind that if
you change the structure of your objects, you will have to provide some sort of
custom serialization to accomplish the task. You could also create multiple
hierarchically named keys and store all of these fields separately in Couchbase.
For the sake of keeping this tutorial simple we'll just use serialized objects.

Speaking of the Couchbase client library, now would be a good time to install
it, add some references, and get it ready to start writing data into your
database.

<a id="stage2"></a>

## Stage 2: Adding and Configuring the Client Library

Download and extract the Couchbase client library into a directory, and then
right click on References|Add Reference... in the solution explorer, select the
Browse tab and navigate to where you extracted the client. Select the
Couchbase.dll and click OK to add these references to your project. See Figure
5.


![](images/fig05-add-reference.png)

Once the references have been made, you will want to add an instance of
`CouchbaseClient` to your project. One of the best places to do this is in
Global.asax.cs in the Application\_Start() method which is guaranteed to be run
only once during the lifetime of the application.

Add the following static instance variable to the `MvcApplication` class:


```
public static CouchbaseClient CouchbaseClient { get; private set; }
```

Add the following line to the end of the `Application_Start()` method:


```
CouchbaseClient = new CouchbaseClient();
```

Then add the method in Listing 4 below `Application_Start()`.

Listing 4, `Application_End()` method.


```
protected void Application_End()
        {
            CouchbaseClient.Dispose();
        }
```

Now, in order for the `CouchbaseClient` to be created at runtime, configuration
to specify the bucket and server address to connect to must be added. Edit the
Web.config file and add the following XML after the opening <configuration>
element:

Listing 5, Web.config


```
<configSections>
    <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
  </configSections>

  <couchbase>
    <servers bucket="private" bucketPassword="private">
      <add uri="http://10.0.0.33:8091/pools/default"/>
    </servers>
  </couchbase>
```

You would replace 10.0.0.33 with the address of your server, and also set your
bucket and `bucketPassword` attributes appropriately.

<a id="stage3"></a>

## Stage 3: Creating a new user in the database.

Now we'll start adding some of the functionality to the application. Couchbase
does not have a schema, so we can feel free to add whatever we need when we're
writing code. The only stipulation is that if you store a key, you need to be
able to recreate that key in the future otherwise you will lose track of the
data that you stored in that key.

Add the following instance variables to the top of HomeController.cs:


```
private static readonly Guid AppSecret =
Guid.Parse("A9468ADE-8830-4955-B378-573BBCCC62EF");
        private const int SessionTimeoutMinutes = 60;
```

Then add the methods in Listing 6 below the `Index()` method.

Listing 6, Create actions.


```
/// <summary>
        /// GET: /Home/Create
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// POST: /Home/Create
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            var client = MvcApplication.CouchbaseClient;

            var userName = collection["UserName"];
            var password = collection["Password"];
            var fullName = collection["FullName"];

            // We're going to create a new user in the database
            // and then return a cookie that will identify the
            // user for a limited time.

            var sessionToken = Guid.NewGuid();
            var cookie = new HttpCookie("COUCHBASE_SESSION", sessionToken.ToString());
            ControllerContext.HttpContext.Response.Cookies.Add(cookie);

            var user = new User
            {
                UserId = Guid.NewGuid(),
                FullName = fullName,
                Password = EncodePassword(password),
                UserName = userName
            };

            // Design a key that the user will be able to retrieve again, if and only if
            // they remember what their password is. This is likely not the only way to
            // do something like this.
            String userKey = string.Format("User-{0}-{1}{2}",
                userName, AppSecret, user.Password);

            // Store the userKey so that it will expire
            // after SessionTimeoutMinutes minutes,
            // forcing the user to log back in if the user hasn't performed
            // any operations in that time. The key is obfuscated by an application
            // secret GUID. This is not really secure, just for demonstration purposes.
            // It is merely relatively unguessable.
            client.Store(StoreMode.Set, sessionToken.ToString() + AppSecret, userKey,
                         TimeSpan.FromMinutes(SessionTimeoutMinutes));
            client.Store(StoreMode.Set, userKey, user.UserId);
            client.Store(StoreMode.Set, user.UserId.ToString(), user);

            return RedirectToAction("Index");
        }

        /// <summary>
        /// Encode a password into a string of hexadecimal
        /// bytes by hashing it with SHA1 and converting it.
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        private static string EncodePassword(string password)
        {
            var hashBytes = new SHA1Managed()
               .ComputeHash(Encoding.ASCII.GetBytes(password));
            return BitConverter.ToString(hashBytes);
        }
```

The `AppSecret` constant will be used to obfuscate the keys in the database
somewhat. Of course, this is just to provide some perceived security. If your
application does not advertised any of the keys, there would be no need for
this. You will see it is used as part of the key later on in the code.

In order to create a user, an instance of the `User` model class is created and
filled in with the data coming from the form. A key is created directly from the
username and password. This way, only the correct password will lead to being
able to load the User record back into the program. Here the `Store()` method is
used to add a few records to the database. The user key, points to the userId,
and the `userId` can be used to load the User record. Remember, with no schema
comes great flexibility. There are probably a dozen different ways to accomplish
the same thing. Feel free to experiment with your own ideas afterwards.

Here, the actual user's password is never stored, only SHA1 hashed version of
the password is stored.

Now you must add the entry form. Right click on the Views/Home folder and choose
Add | View... Name this view Create, and add the contents in Listing 7.

Listing 7, Create.cshtml


```
@{
    ViewBag.Title = "Create";
}

<h2>Create</h2>

@using (Html.BeginForm()) {
    @Html.ValidationSummary(true)
    <fieldset>
        <legend>User</legend>

        <p>
            UserName: <input type="text" name="UserName" />
        </p>

        <p>
            Password: <input type="password" name="Password" />
        </p>

        <p>
            Full Name: <input type="text" name="FullName" />
        </p>

        <p>
            <input type="submit" value="Create" />
        </p>
    </fieldset>
}

<div>
    @Html.ActionLink("Go back...", "Index")
</div>
```

So, you've got everything in place to be able to create a new user account and
in stage 4 you will create a login action and views to tie this functionality
together.

<a id="stage4"></a>

## Stage 4: Adding Login and Logout actions

A web application needs some form of user authentication. You will be creating
one that uses Couchbase to store the user records. You would most likely back
this data up to long-term persistent storage to avoid any data loss. Couchbase
does write to disk in the case of memory pressure, and it can be considered
persistent if the all of the machines are running perfectly. You can also ensure
that there are replicas in the case of single or multiple machine failures. For
illustrative purposes, we'll just store the user records into Couchbase.

Edit HomeController.cs and add the methods in Listing 8 after the `Create()`
actions.

Listing 8, Login actions


```
/// <summary>
        /// GET: /Home/Login
        /// </summary>
        /// <returns></returns>
        public ActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// POST: /Home/Login
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Login(FormCollection collection)
        {
            var client = MvcApplication.CouchbaseClient;

            var sessionToken = Guid.NewGuid();
            var cookie = new HttpCookie("COUCHBASE_SESSION", sessionToken.ToString());
            ControllerContext.HttpContext.Response.Cookies.Add(cookie);

            var encodedPassword = EncodePassword(collection["Password"]);

            // Design a key that the user will be able to retrieve again, if and only if
            // they remember what their password is. This is likely not the only way to
            // do something like this.
            String userKey = string.Format("User-{0}-{1}{2}", collection["UserName"],
                         AppSecret, encodedPassword);

            client.Store(StoreMode.Set, sessionToken.ToString() + AppSecret, userKey,
                         TimeSpan.FromMinutes(SessionTimeoutMinutes));

            // Try to retrieve the user data from the database. If it returns null,
            // the user has logged in incorrectly
            var userId = client.Get<Guid>(userKey);
            var user = client.Get<User>(userId.ToString());

            // If user is null the login failed otherwise show the Index page.
            return RedirectToAction(user == null ? "Login" : "Index");
        }
```

The first method returns the login form, and the second method responds to the
POST when the user presses the submit button. The user's entered UserName and
Password are taken from the collection object. Here, we format the `userKey` in
the same way, and store the `userKey` into the database by using the
`sessionToken` combined with the `AppSecret`. This is to help you learn about
Couchbase, not to be taught a lesson about security. This is not secure at all,
in fact. More thought would have to be made on how to provide even a small
amount of security to keep unauthorized people out.

Once the keys are correct, if the database contains a record for the `userKey`,
the user's userId will be found, and from that the stored User record will be
found. If the code finds a User, the browser will be redirected to the Index
action, otherwise back to the Login action it goes.

Next add a new view to the Views/Home folder named Login with content from
Listing 9.

Listing 9, Login.cshtml


```
@{
    ViewBag.Title = "Login";
}
<h2>Login</h2>

@using (Html.BeginForm())
{
    Html.ValidationSummary(true);
    <fieldset>
        <legend>Please log in to the system:</legend>
        <p>
            UserName:
            <input type="text" name="UserName" />
        </p>
        <p>
            Password:
            <input type="password" name="Password" />
        </p>
        <p> Don't have an account? @Html.ActionLink("Create one...","Create")
</p>
        <p>
            <input type="submit" value="Log In" />
        </p>
    </fieldset>
}
```

Notice here, that an action link has been set up in the login page to create a
new user account if you haven't already created one. This executes the create
action from the previous stage.

Next you will likely want to be able to log out of the application to add other
users for testing. Add the `Logout` action in Listing 10 after the Login actions
in HomeController.cs.

Listing 10, Logout action


```
/// <summary>
        /// GET /Home/Logout
        /// </summary>
        /// <returns></returns>
        public ActionResult Logout()
        {
            var client = MvcApplication.CouchbaseClient;

            var cookie = ControllerContext.HttpContext
                .Request.Cookies["COUCHBASE_SESSION"];
            if (cookie != null)
            {
                var sessionToken = cookie.Value;
                client.Remove(sessionToken + AppSecret);
            }

            return RedirectToAction("Login");
        }
```

The Logout action gets the `COUCHBASE_SESSION` cookie, reads the `sessionToken`
and removes that token from the database. Then it redirects the user's browser
to the Login action. Once the session token is removed, the cookie is
effectively invalid.

Finally you need to add the logout link to the bottom of the Index view:


```
<p>@Html.ActionLink("Logout...","Logout")</p>
```

At this point, you should be able to start using the application to create user
accounts, and log in and out of these accounts given the username and password.
However, the flow of the application would be enhanced by the addition of an
authentication check. You will add this in the next stage.

<a id="stage5"></a>

## Stage 5: Adding an authentication check

It is common in older style web applications to protect each action with a check
to see whether the user is logged in (typically by checking a cookie is valid)
and redirecting them to a login page if not. This simple mechanism has been
around for a long time. We're just going to go through and create one of these
simple mechanisms using the fact that Couchbase keys can be set to expire
automatically. Using an expiring key to keep a reference to the User record in
means that if the key has expired, the application will need the user to
reauthenticate in order to find the record again.

First, modify the `Index` method of `HomeControler` and add the bold face lines
in Listing 11.

Listing 11, Modify the `Index` action.


```
public ActionResult Index()
        {
            var client = MvcApplication.CouchbaseClient;

            ViewData["Message"] = "I don't know you.";
            ViewData["IsLoggedIn"] = false;

            User user;
            if (!IsAuthenticated(client, out user))
                return RedirectToAction("Login");

            return View();
        }
```

Next, add the code in Listing 12 to the end of the `HomeController` class.

Listing 12, The `IsAuthenticated` method.


```
/// <summary>
        /// Check that the user is authenticated, and if not, set some
        /// view data to make sure a login form is shown.
        /// </summary>
        /// <param name="client"></param>
        /// <param name="user">the user will be returned through
        ///   this out variable</param>
        /// <returns></returns>
        private bool IsAuthenticated(CouchbaseClient client, out User user)
        {
            var cookie = ControllerContext.HttpContext
                .Request.Cookies["COUCHBASE_SESSION"];
            if (cookie != null)
            {
                var sessionToken = cookie.Value;
                var userKey = client.Get<string>(sessionToken + AppSecret);

                if (userKey == null)
                {
                    // User must have been idle too long and their session has
                    // expired, so they'll need to log back in
                    ViewData["Message"] = "You'll need to log in.";
                }
                else
                {
                    var userId = client.Get<Guid>(userKey);
                    user = client.Get<User>(userId.ToString());

                    if (user == null)
                    {
                        ViewData["Message"] = "Unable to log in.";
                    }
                    else
                    {
                        ViewData["Message"] = "Welcome " + user.FullName;
                        ViewData["IsLoggedIn"] = true;
                        ViewData["User"] = user;

                        // User is authenticated correctly so keep the session alive
                        // by using the Touch operation which resets the timeout
                        // for the key in the database.
                        client.Touch(sessionToken + AppSecret,
                           TimeSpan.FromMinutes(SessionTimeoutMinutes));

                        return true;
                    }
                }
            }

            user = null;

            return false;
        }
```

This method checks the request for a `COUCHBASE_SESSION` cookie with a session
token value that can be used to retrieve a userKey from the database. That user
key can be used to retrieve the user's primary key and in turn get the stored
user record, if it exists. This might seem overly complicated, but there is
flexibility to design whatever data layout you wish within Couchbase. This is
simply one layout that solved this particular problem, and you should feel free
to create others.

Of special note is the use of the `Touch` method. If the user has correctly
logged in, this operation will extend the expiry time of the session token
whenever this method is hit. The `Touch` operation extends the expiry without
actually getting the data. It is a method that the client library is using which
exists in Couchbase servers from 1.7 and up. It will not work on 1.6 servers, so
be aware of that.

Try the application out by hitting F5. The workflow of the application is fairly
complete now. When you first hit the page, you will be asked to log in or create
a new account. Afterwards, you remain logged in until you click the logout link,
or until the session expires in 60 minutes.

The application needs more of a purpose, so let's quickly turn it into a simple
online diary.

<a id="stage6"></a>

## Stage 6: Adding diary entries

First, add a new model class called `DiaryEntry` with the contents from Listing
13.

Listing 13, DiaryEntry.cs


```
using System;

namespace CouchbaseTutorial.Models
{
    [Serializable]
    public class DiaryEntry
    {
        public Guid DiaryEntryId { get; set; }
        public Guid UserId { get; set; }
        public String Title { get; set; }
        public String Text { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
```

Next add `MakeEntry` action methods (Listing 14) in `HomeController`.

Listing 14: `MakeEntry` actions.


```
/// <summary>
        /// GET: /Home/MakeEntry
        /// </summary>
        /// <returns></returns>
        public ActionResult MakeEntry()
        {
            var client = MvcApplication.CouchbaseClient;

            User user;
            if (!IsAuthenticated(client, out user))
                return RedirectToAction("Login");

            return View();
        }

        /// <summary>
        /// POST: /Home/MakeEntry
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult MakeEntry(FormCollection collection)
        {
            var client = MvcApplication.CouchbaseClient;

            User user;
            if (!IsAuthenticated(client, out user))
                RedirectToAction("Login");

            var title = collection["EntryTitle"];
            var text = collection["EntryText"];

            // Persist these in the database

            var entry = new DiaryEntry
            {
                DiaryEntryId = Guid.NewGuid(),
                Text = text,
                Title = title,
                CreationDate = DateTime.Now,
                UserId = user.UserId
            };

            client.Store(StoreMode.Set, entry.DiaryEntryId.ToString(), entry);

            // Now we need to keep track of the entries a user has.
            var entriesKey = user.UserId + ".DiaryEntries";
            AddToListWithCas(client, entriesKey, entry.DiaryEntryId);

            return RedirectToAction("Index");
        }
```

You can see that this method uses another method called `AddToListWithCas` to
make sure that the list of diary entries for each user is added to the database.
Add this method to HomeController.cs from Listing 15.

Listing 15, `AddToListWithCas`


```
/// <summary>
        /// Adds a value to a list of type T associated with the given Key using a
        /// CAS operation and retries.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="client"></param>
        /// <param name="key"></param>
        /// <param name="entry"></param>
        private static void AddToListWithCas<T>(CouchbaseClient client, string key,
                                                T entry)
        {
            CasResult<bool> casResult;
            do
            {
                var result = client.GetWithCas<List<T>>(key);
                var list = result.Result ?? new List<T>();
                var cas = result.Cas;

                // Avoid duplicates
                if (list.Contains(entry)) return;

                list.Add(entry);
                casResult = client.Cas(StoreMode.Set, key, list, cas);

            } while (casResult.Result == false);
        }
```

A CAS (Check And Set) operation is the correct way to ensure that operations
happen without data loss without requiring distributed locking protocols or
transactions to be handled. The way it works is you get the value of something
with its cas. This is a monotonically increasing number that can be thought of
as the version number of the object in the database. You mutate the object
(change it in some way) and use a `Cas` operation to write it back to the
database. This will fail (a `casResult` whose Result property is set to false)
if some other client had modified the value in the database in the meantime.
Notice the use of the `'??'` operator. This says assign to the list variable
`result.Result` if it is not null; otherwise create an empty list.

So, in this case, the loop is repeated until the operation succeeds. This is a
simplified example of how to do this. You may want to limit the number of
retries performed before failing.

Also note that in this case it is highly unlikely that another user will be
modifying the same list, so the Cas operation is probably overkill, but we will
need this operation later in situations where the database could indeed be
modified at the same time by another user.

Next add the form for creating a new diary entry by right clicking on the Home
folder under Views, and choosing Add | View... and naming it MakeEntry. See
Listing 16 for the contents of this file.

Listing 16, MakeEntry.cshtml


```
@{
    ViewBag.Title = "Diary Entry";
}

<h2>Diary Entry</h2>

@using (Html.BeginForm()) {
    @Html.ValidationSummary(true)
    <fieldset>
        <legend>Enter your diary entry:</legend>

        <p>
            Title: @Html.TextBox("EntryTitle")
        </p>

        <p>
            @Html.TextArea("EntryText", "", 20, 80, null)
        </p>

        <p>
            <input type="submit" value="Done" />
        </p>
    </fieldset>
}

<div>
    @Html.ActionLink("Go back...", "Index")
</div>
```

You will need a place to display the diary entries too. We'll just display them
as a bulleted list in the Index view. Edit Index.cshtml and add the content in
Listing 17 before the Logout link.

Listing 17, an update to Index.cshtml


```
<p>@Html.ActionLink("Make diary entry...", "MakeEntry")</p>

@if (ViewData.ContainsKey("DiaryEntries")) {
    <ul>
    @foreach (var entry in ((IList<DiaryEntry>)ViewData["DiaryEntries"]))
    {
        <li>@entry.CreationDate.ToShortDateString()
            @entry.CreationDate.ToShortTimeString() -
            @entry.Title <p>@entry.Text</p>
       </li>
    }
    </ul>
}
```

Finally you need to make an update (Listing 18) to the Index action in
HomeController.cs to generate the view data that the view is trying to display.
Insert these lines just before the return at the end of the method.

Listing 18, Update `Index` method of HomeController.cs


```
var entriesKey = user.UserId + ".DiaryEntries";
            var result = client.Get<List<Guid>>(entriesKey);

            if (result != null)
            {
                // First we want to display all of a user's diary entries

                // Convert all of the Guids to strings to do a multi-get with
                var keys = result.Select(key => key.ToString()).ToList();
                var entryDictionary = client.Get(keys);
                var diaryEntries = new List<DiaryEntry>(
                    entryDictionary.Values.Cast<DiaryEntry>());
                diaryEntries.Sort((a, b) => a.CreationDate.CompareTo(b.CreationDate));
                ViewData["DiaryEntries"] = diaryEntries;
            }
```

The list of diary entry keys is retrieved from the database first. If the list
exists, we convert these to a list of strings to use in a multi-get operation.
The multi-get operation returns an entry dictionary but we are only interested
in the fact that the values are all `DiaryEntry` objects, so we typecast them
all using a quick LINQ expression. Finally the entries are sorted by creation
date, and stored into the `ViewData` under the `DiaryEntries` key.

Now you can compile the application and have some fun writing diary entries. You
will also be able to log out, create other users, and make more diary entries.
Don't get too carried away.

That's a lot of fun, but what if we tried to make this a more social operation?
Imagine if you could be told the names of the top three users who are making
diary entries containing many of the same words that you are. The final stage of
this tutorial will discuss doing just that.

<a id="stage7"></a>

## Stage 7: Making the application a little more social

Web applications tend to be more fun if there's some sort of social aspect to
them. Usually a diary application would be a private affair. Let's add a social
aspect to this to make it a little more interesting.

The application should break down each diary entry into a list of words. Every
user will have a list of every word they have ever written in a diary entry.
Each word will also have a user list associated with it, effectively keeping
track of every user who has ever said that word in one of their diary entries.

Add the content of Listing 19 to the end of the `MakeEntry` action, just before
the return statement.

Listing 19, Creating the word lists.


```
// Finally we want to store each word in the diary entry
            // into the database such that a map of words to users
            // is produced in order to make this application a little
            // more social.
            var wordList = Regex.Split(entry.Text, @"\W+")
                .ToList()
                .ConvertAll(d => d.ToLower());

            var wordsKey = user.UserId + ".Words";

            foreach (var word in wordList)
            {
                AddToListWithCas(client, wordsKey, word);
                AddToListWithCas(client, word + ".Users", user.UserId);
            }
```

This block of code breaks the entry text down into words using a regular
expression, and uses a little LINQ to turn the array of strings into a list and
convert every word to lower case. A key is created simply be appending ".Words"
to the user's `UserId` guide. It doesn't matter what is in the key, as long as
you remember what the key was. This effectively makes a relation between the
list of words and the user.

The code then iterates over the list of words, and reuses the `AddToListWithCas`
method discussed earlier to add them first to the user's word list, and finally
to a global word list that relates each word to all of the users who have ever
said it. This is definitely where the power of a NoSQL database shines. We can
just make links between information by making specially formatted keys pointing
to objects. In this case we're adding the `userId` to a list of objects pointed
to by the key `word.Users` where the word is replaced by the current word.

Now you will need to make a final modification to the Index method of the
`HomeController` to include the logic for turning these lists of words into a
list of names of the users who are using the same language you are.

Listing 20, update Index in HomeController.cs


```
// Now, do a calculation to discover the top three users who use
            // similar words in their diary entries.

            // Get the user's word list
            var wordlist = client.Get<List<string>>(user.UserId + ".Words");

            if (wordlist != null)
            {
                var userListKeys = wordlist.ConvertAll(k => k + ".Users");
                var userLists = client.Get(userListKeys)
                    .Values
                    .Cast<List<Guid>>();

                // Calculate the count of users who have used
                // the same words that the current user has

                var userCounts = new Dictionary<Guid, int>();

                foreach (var list in userLists)
                {
                    foreach (var userId in list)
                    {
                        // Skip ourselves
                        if (userId == user.UserId) continue;

                        if (userCounts.ContainsKey(userId))
                        {
                            userCounts[userId] = userCounts[userId] + 1;
                        }
                        else
                        {
                            userCounts[userId] = 1;
                        }
                    }
                }

                // Make a final list of users by ordering by the counts
                // in the userCounts dictionary.
                var kindred = new List<User>();
                foreach (var item in userCounts.OrderByDescending(key => key.Value))
                {
                    kindred.Add(client.Get<User>(item.Key.ToString()));
                    if (kindred.Count > 2)
                        break;
                }

                ViewData["KindredUsers"] = kindred;
            }
```

Effectively each user's word lists are obtained, and the keys to the global list
of words to users is created. This is used in another multi-get operation whose
values are converted to a lists of Guids. Then these lists are iterated, to
tabulate a total count of the userIds. We're making the assumption that these
counts are all we need to determine who has been using similar words to us.
These are then ordered by maximum count first, and added to a `KindredUsers`
list.

The `Index` view must now be modified to present these kindred users. Listing 21
should be added before the last line of the Index.cshtml file.

Listing 21, update Index.cshtml.


```
@if (ViewData.ContainsKey("KindredUsers")) {

    var kindred = ((IList<User>)ViewData["KindredUsers"]);

    <h2>Kindred Users</h2>

    if (kindred.Count > 0)
    {
        <ul>
        @foreach (var user in kindred)
        {
            <li>@user.FullName</li>
        }
        </ul>
    }
    else
    {
        <p>You currently have no kindred users.</p>
    }
}
```

Improvements could easily be made to this application. You may want to allow
users to contact each other by providing a way to drop notes. You may also
improve the word ratings by removing common stop-words (such as 'a', 'an', 'or',
'the', 'in' and so on) or maybe skipping all short words altogether.

I'm sure you've got all sorts of ideas about how to apply Couchbase to your
latest projects, and we hope you've enjoyed this tutorial. You will find the
final source code in the file dotnet-couchbase-tutorial.zip.

<a id="api-reference-summary"></a>
