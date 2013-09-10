## Working With Databases
Depending on your app design, you might need to [set up an initial database](#setting-up-the-initial-database) the first time a user launches your app and then [connect to the existing database](#connecting-to-an-existing-database) upon subsequent launches. Each time the app launches, you must check whether the database exists in Couchbase Lite.

When your app is launched for the first time, you need to set up a database. 

### Setting Up the Initial Database
You can set up the initial database in your app by using any of the following methods:

* [Create a database in your app](#creating-a-database-in-your-app)
* [Pull a database from a server](#pulling-a-database-from-a-server)
* [Install a prebuilt database](#installing-a-prebuilt-database)

#### Creating a Database in Your App
To create a database in your app, you need to create a `CBLDatabase` instance by using the `createDatabaseNamed:error` method provided in the `CBLManager` class. Typically, this is done in the app delegate. The following code fragments show an example.

In the **AppDelegate.h** file:

```
	// AppDelegate.h file
	
	#import <CouchbaseLite/CouchbaseLite.h>
	...
    @property (strong, nonatomic) CBLDatabase *database;
```

In the `application:didFinishLaunchingWithOptions:` method in the **AppDelegate.m** file:

```
        // create a shared instance of CBLManager
        CBLManager *manager = [CBLManager sharedInstance];
        
        // create a database
        NSError *error;
        self.database = [manager createDatabaseNamed: @"my-database" error: &error];
```
   

#### Pulling a Database From a Server

TBD

#### Installing a Prebuilt Database
For some use cases you might want to install a database along with your app. Consider the following pros and cons when deciding whether to include a database with your app.

Pros:

* Generally, it's faster to download a database as part of the app, rather than creating one through the replication protocol. 
* Shifts bandwidth away from your servers.
* Improves the first-launch user experience.

Cons:

* Changing the initial contents requires resubmitting the app to the App Store.
* Including the database with the app increases its disk usage on the device.

To use a prebuilt database, you need to set up the database, build the database into your app bundle as a resource, and install the database during the initial launch.


##### Setting Up the Database

You need to make the database as small as possible. Couchbase Lite keeps a history of every document and that takes up space. 

When creating the database locally, you can make it smaller by storing each document (via a PUT request) only once, rather than updating it multiple times. If the documents are updated only once, each document revision ID starts with `1-`.

If you start with a snapshot of a live database from a server, then create a new local database and replicate the source database into it. If you didn't start the replication with an empty local database, call `-compact` on it afterwards to get rid of any older revision and attachment data.

The Couchbase Lite Xcode project has a target called LiteServ that builds a small Mac app that does nothing but run the REST API. LiteServ is a useful tool for creating databases and running replications locally on your development machine.

##### Extracting and Building the Database

By default, the local database is in the `Application Support` directory tree of the app you used to create the database. The main database file has a `.cblite` extension. If your database has attachments, you also need the **_databasename_ attachments** directory that's adjacent to it.

Add the database file and the corresponding attachments directory to your Xcode project. If you add the attachments folder, make sure that in the **Add Files** sheet you select the **Create folder references for any added folders** radio button, so that the folder structure is preserved; otherwise, the individual attachment files are all added as top-level bundle resources.

##### Installing the Database

After your app launches and creates a `CBLDatabase` instance for its database, it needs to check whether the database exists. If the database does not exist, copy it from the app bundle. The code looks like this:


    CBLManager* dbManager = [[CBLManager sharedInstance] init];
    CBLDatabase* database = [dbManager databaseNamed: @"catalog"
                                               error: &error];
    if (!database) {
        NSString* cannedDbPath = [[NSBundle mainBundle] pathForResource: @"catalog"
                                                                 ofType: @"cblite"];
        NSString* cannedAttPath = [[NSBundle mainBundle] pathForResource: @"Catalog attachments"
                                                                  ofType: @""];
        BOOL ok = [dbManager replaceDatabaseNamed: @"catalog"
                                 withDatabaseFile: cannedDbPath
                                  withAttachments: cannedAttPath
                                            error: &error];
        NSAssert(ok, @"Failed to install database: %@", error);
        CBLDatabase* database = [dbManager databaseNamed: @"catalog"
                                                   error: &error];
        NSAssert(database, @"Failed to open database");
    }


### Connecting to an Existing Database
After the initial launch of your app, you need to connect to the existing database on the device each time the app is launched.