## HelloCBL

For the Hello Couchbase Lite example, the tutorial presents detailed steps for creating a Couchbase Lite app from scratch and then walks through the code.

To make the first example in the tutorial easier to understand, the program structure is simplified. Only one new method, `sayHello`, is created and all the Couchbase Lite APIs used in the example are placed within that method. The `sayHello` method is called from the `application:didFinishLaunchingWithOptions:` method in the application delegate class. All output is to the Xcode console, rather than the iPhone screen in the simulator. The example does not use any graphics and does not require setting up a user interface. Rest assured, the other sample apps in the tutorial do not take these shortcuts—they incorporate standard iOS software design and development practices.

### Step 1: Create a new project

1. Open Xcode and select **File > New > Project**.
2. In the new project template sheet, click **Empty Application** and then click **Next**.
3. In the new project options sheet, enter values for each field and then click **Next**.

	Here are the values used in the sample app:

	* **Product Name**—HelloCBL
	* **Organization Name**—Couchbase
	* **Company Identifier**—com.couchbase
	* **Bundle Identifier**—com.couchbase.HelloCBL
	* **Class Prefix**—HC
	* **Devices**—iPhone
	* **Use Core Data**—no

4. Select a location for your new project, and then click **Create**.

### Step 2: Add the Couchbase Lite dependencies

1. Download the [latest release of Couchbase Lite for iOS](http://www.couchbase.com/communities/couchbase-lite) and move the unzipped Couchbase Lite folder to a permanent location.

2. Open the Couchbase Lite folder and drag the **CouchbaseLite.framework** folder to the **Frameworks** group in the Xcode project navigator.

	<img src="images/cbl-framework.png" width=600px />

3. In the **Choose options for adding these files** sheet, make sure that your app target is selected.

4. In the navigator, click on the HelloCBL project file to open the project editor for your app, and then click the **Build Settings** tab.

5. Scroll to the **Linking** section, find the **Other Linker Flags** row, and then add the flag `-ObjC` (be sure to use the capitalization shown).

	The **Other Linker Flags** row should look similar to the following screenshot:  
	<img src=images/build-settings.png width=600px/>

6. Click the **Build Phases** tab.

7. Expand the **Link Binary With Libraries** section and add the following items:
    * `CFNetwork.framework`
    * `Security.framework`
    * `SystemConfiguration.framework`
    * `libsqlite3.dylib`
    * `libz.dylib`

	Click the **+** at the bottom of the section to add each item.  When you are done, it should look similar to the following screenshot:
	<img src=images/build-phases.png width=600px/>


### Step 3: Add the Hello Couchbase Lite code

The code added in this step is explained in a later section, [Hello Couchbase Lite walkthrough](#hello-couchbase-lite-walkthrough).

1. Open the **HCAppDelegate.m** file.

2. Add the following code to the #import section:

	```objc
	#import "CouchbaseLite/CouchbaseLite.h"
	#import "CouchbaseLite/CBLDocument.h"
	```

	These statements import the Couchbase Lite framework headers needed by the `sayHello` method
3. Add the following code to the end of the `application:didFinishLaunchingWithOptions`: method, just before the `return` statement:

	```
	// Run a simple method that creates a database, and then stores and retrieves a document
    BOOL result = [self sayHello];
    NSLog (@"This Hello Couchbase Lite run %@!", (result ? @"was a total success" : @"was a dismal failure"));
```

	The first line calls the `sayHello` method, which demonstrates the basic Couchbase Lite iOS APIs. The second line executes after the return from the `sayHello` method, and prints a message on the console that indicates whether the run was successful.
	
4. Add the new `sayHello:` method at the end of the file, just before the `@end` statement. For a description of this method, see [sayHello notes](#sayhello-notes).


        ```objc
	    - (BOOL) sayHello {
    
            // create a shared instance of CBLManager
            CBLManager *manager = [CBLManager sharedInstance];
            if (!manager) {
                NSLog (@"Cannot create shared instance of CBLManager");
                return NO;
            }
            
            // check for a valid database name
            NSString *dbname = @"my-new-database";
            if (![CBLManager isValidDatabaseName: dbname]) {
                NSLog (@"Bad database name");
                return NO;
            }
            
            // create a new database
            NSError *error;
            CBLDatabase *database = [manager createDatabaseNamed: dbname error: &error];
            if (!database) {
                NSLog (@"Cannot create database. Error message: %@", error.localizedDescription);
                return NO;
            }
            
            // create an object that contains data for the new document
            NSDictionary *myDictionary =
                [NSDictionary dictionaryWithObjectsAndKeys:
                    @"Hello Couchbase Lite!", @"message",
                    [[NSDate date] description], @"timestamp",
                    nil];
            
            // display the data for the new document
            NSLog(@"This is the data for the document: %@", myDictionary);
            
            // create an empty document
            CBLDocument* doc = [database untitledDocument];
            
            // write the document to the database
            CBLRevision *newRevision = [doc putProperties: myDictionary error: &error];
            if (!newRevision) {
                NSLog (@"Cannot write document to database. Error message: %@", error.localizedDescription);
            }
            
            // save the ID of the new document
            NSString *docID = doc.documentID;
            
            // retrieve the document from the database
            CBLDocument *retrievedDoc = [database documentWithID: docID];
            
            // display the retrieved document
            NSLog(@"The retrieved document contains: %@", retrievedDoc.properties);
            
            return YES;
    
        }
            
        ```

### Step 4: Build and run Hello CBL
1. Set the active scheme to the iOS simulator for iPhone Retina (4-inch):

	<img src="images/active-scheme.png" width=600px />

2. Click **Run**.

	The iOS simulator opens, but you'll just see a white screen. All output from the app is shown in the console.
	
3. View the console output.

	The console output should look similar to the following screenshot. Don't worry about the error message at the end of the console output that mentions the view controller—the view controller has been omitted from this bare-bones app. 
	
	<img src="images/console-output.png" width=600px />

Congratulations! You've just written your first Couchbase Lite app! 

### sayHello notes

The `sayHello` method creates a new database, and then creates a document, stores the document in the database, and retrieves the document. This section contains additional notes that supplement the comments in the code.

The `sayHello` method first creates a shared `CBLManager` object, which manages a collection of databases. The CBLManager object can be used only in a single thread.

After `sayHello` creates a name for the new database, it validates the name. A database name can consist of only lowercase alphabetic characters (a-z), digits (0-9) and a few special characters (_$()+-/), so it's important to validate the name.

To create the database, it calls `createDatabaseNamed:error` , which is a method in the `CBLManager` class that returns a `CBLDatabase` object. Immediately after the call, it checks to make sure the database was created.

`NSDictionary` objects provide a JSON-compatible representation of data that is suitable for creating documents that you want to store in the database. The document created by `sayHello` is an `NSDictionary` object named `myDictionary` that contains only two keys, `message` and `timestamp`. `message` contains the string "Hello Couchbase Lite!", and `timestamp` contains the time and date the document was created. The document content is written out to the console to show the structure of the document. The JSON for the new document looks like this:

```json
{
    message = "Hello Couchbase Lite!";
    timestamp = "2013-11-19 06:51:04 +0000";
}
```

An empty `CBLDocument` object named `doc` is created, and then the document is saved to the database by using the  `CBLDocument` class `putProperties:error` method. This method returns a `CBLRevision` object, which is checked to make sure the document was written successfully. 

When the document is saved to the database, Couchbase Lite generates a document identifier, `_id` and a revision identifier `_rev`. 

The document is retrieved by using the `CBLDatabase` class `documentWithID:` method. The JSON for the saved document contains the keys created by `sayHello` and the `_id` and `_rev` keys created by Couchbase Lite:

```json
{
    "_id" = "D46FA562-5514-427D-B087-EE7EBB02E2A5";
    "_rev" = "1-f38ee4fb34017644b07807a35af8b96a";
    message = "Hello Couchbase Lite!";
    timestamp = "2013-11-19 06:51:04 +0000";
}
```




