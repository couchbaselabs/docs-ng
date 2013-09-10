# Getting Started
This section contains the information you need to start developing iOS apps with Couchbase Lite. It lists the system requirements, explains how to add the Couchbase Lite iOS framework to your project, and walks through a very simple Couchbase Lite iOS app.

## System Requirements

To develop Couchbase Lite apps for iOS, you need:

* [Couchbase Lite for iOS](http://www.couchbase.com/communities/couchbase-mobile-solution)
* [Xcode 4.6 or later](https://developer.apple.com/xcode/index.php)
* iOS SDK 6.0 or later

## Getting Started in 5 Minutes

This section shows you how to download and build a sample app called ToDo Lite. ToDo Lite is a shared to-do list app that demonstrates many Couchbase Lite features.

### Before You Begin

To get set up before you begin building the Todo Lite app:

1. Download [Xcode](https://developer.apple.com/xcode/).

2. Download [Couchbase Lite for iOS](http://www.couchbase.com/communities/couchbase-mobile-solution) and move it to a permanent location.


### Building Todo Lite

To build the Todo Lite app:

1. Open the Terminal application.

	Terminal is usually located in the Applications > Utilities folder.

2. Change to the directory that you want to store the ToDo Lite app in.

	```sh
	$ cd ~/dev
	```

3. Clone the Todo Lite app:

	```sh
	$ git clone https://github.com/couchbaselabs/ToDoLite-iOS.git
```

4. In the Couchbase Lite for iOS folder, find the **CouchbaseLite.framework** folder.

5. Copy the **CouchbaseLite.framework** folder to the **Frameworks** folder inside the **ToDoLite-iOS** folder.

6. In Xcode, select an iOS simulator build scheme.

7. Click **Run**.

	The ToDo Lite app opens in the iOS simulator.

## Adding Couchbase Lite To Your App

To add Couchbase Lite to your own app, you need to add the Couchbase Lite framework and other frameworks to your target and modify the build options, and then initialize Couchbase Lite in your app.
 
**To add the frameworks:** 

1. Download the [latest release of Couchbase Lite for iOS](http://www.couchbase.com/communities/couchbase-mobile-solution) and move it to a permanent location.

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
        CBLManager *manager = [CBLManager sharedInstance];
        
        // create a database
        NSError *error;
        self.database = [manager createDatabaseNamed: @"my-database" error: &error];
    
    You should also add appropriate error checking code after each call. If either call fails, you might need to display an error message and exit.
    
    The legal characters for the database name are: lowercase letters (`a-z`), digits (`0-9`), and `_$()+-/`.


