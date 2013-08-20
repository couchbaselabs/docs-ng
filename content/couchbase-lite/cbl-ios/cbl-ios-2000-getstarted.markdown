# Getting Started
This section contains the information you need to start developing iOS apps with Couchbase Lite. It lists the system requirements, explains how to add the Couchbase Lite iOS framework to your project, and walks through a very simple Couchbase Lite iOS app.

## System Requirements

To develop Couchbase Lite apps for iOS, you need:

* [Couchbase Lite for iOS]()
* Mac OS X 10.7.2 or later
* [Xcode 4.5 or later](https://developer.apple.com/xcode/index.php)
* iOS SDK 5.0 or later

## Adding Couchbase Lite To Your App

To add Couchbase Lite to your app, you need to add the Couchbase Lite framework and other frameworks to your app, and then initialize Couchbase Lite in your app. This section provides a concise description of the process. [Your First Couchbase Lite App](Your First Couchbase Lite App) describes the process in detail.

 
**To add the frameworks:** 

1. Download the [latest release of Couchbase Lite][RELEASES_IOS].

2. From the **Couchbase Lite** folder, drag the **CouchbaseLite.framework** folder to the **Frameworks** group in the Xcode Project Navigator.

3. In the **Choose options for adding these files** sheet, make sure that your app target is selected.

4. Open the project editor for your app target and click the **Build Settings** tab.

5. In the **Linking** section, on the **Other Linker Flags** row, add the flag `-ObjC` (be sure to use the capitalization shown).

6. Click the **Build Phases** tab.

7. In the **Link Binary With Libraries** section, click **+** and add the following items:
    * `CFNetwork.framework`
    * `Security.framework`
    * `SystemConfiguration.framework`
    * `libsqlite3.dylib`
    * `libz.dylib`

8. Build your app to make sure there are no errors.

**To initialize Couchbase Lite in your app:**

You initialize Couchbase Lite in your app delegate, which is usually named ***YourPrefix*AppDelegate**, as follows:

1. In the app delegate header file, add the following import directive:  

        #import <CouchbaseLite/CouchbaseLite.h>

2. In the app delegate header file, add the following property declaration:  

        @property (strong, nonatomic) CBLDatabase *database;
    
3. In the app delegate implementation file, add the following code to the **application:didFinishLaunchingWithOptions:** method:  

        // create a shared instance of CBLManager
        CBLManager *server = [CBLManager sharedInstance];
        
        // create a database
        NSError *error;
        database = [server createDatabaseNamed: @"my-database" error: &error];
    
    You should also add appropriate error checking code after each call. If either call fails, you might need to display an error message and exit.
    
    The legal characters for the database name are: lowercase letters (`a-z`), digits (`0-9`), and `_$()+-/`.

## Your First Couchbase Lite App

This section shows how to create a very simple Couchbase Lite iOS app &mdash; *Hello Couchbase Lite*. The walk-through assumes you have already installed Xcode, the iOS SDK, and configured your development environment. 

[COUCHDB]: http://couchdb.apache.org
[SQLITE]: http://sqlite.org
[UUID]: http://en.wikipedia.org/wiki/Uuid
[CRUD]: http://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[MVCC]: http://en.wikipedia.org/wiki/Multiversion_concurrency_control
[GUIDE]: http://guide.couchdb.org
[WEBDAV]: http://en.wikipedia.org/wiki/Webdav
[MAPREDUCE]: http://en.wikipedia.org/wiki/MapReduce
[RESTAPI]: http://wiki.apache.org/couchdb/Complete_HTTP_API_Reference
[RELEASES_IOS]: http://files.couchbase.com/developer-previews/mobile/ios/CouchbaseLite/
[BUILDING]: https://github.com/couchbase/couchbase-lite-ios/wiki/Building-Couchbase-Lite
[CBL_API]: http://couchbase.github.com/couchbase-lite-ios/docs/html/
[CBLDOCUMENT]: http://couchbase.github.com/couchbase-lite-ios/docs/html/interfaceCBLDocument.html
[GETTINGSTARTED]: http://shop.oreilly.com/product/0636920020837.do