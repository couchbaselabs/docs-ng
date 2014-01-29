## Building your first app with Eclipse
This section describes how to build a Couchbase Lite app by using Eclipse.

### Setting up the Eclipse development environment

Before you can build an app, you need to set up your development environment. To get set up with Eclipse, you can use one of the following methods:

* *(Recommended method)*. Download and install the [Android Developer Tools (ADT) Bundle](http://developer.android.com/sdk/index.html), which includes the essential Android SDK components and a version of the Eclipse IDE with built-in ADT. This tutorial was developed with the ADT Bundle.

* If you already have Eclipse installed and prefer to use that version, you can install the Android SDK by following the instructions for using an existing IDE found on the [ADT Bundle page](http://developer.android.com/sdk/index.html).

### Creating an Android app with Eclipse
This section shows how to create a simple Hello World app for an Android device with Couchbase Lite.

#### Step 1: Create a new project

1. Launch Eclipse.

2. Choose **File > Android Application Project**.

3. In the New Project window, enter the application name, module name, package name, and project location.

	This example uses `HelloWorldEclipse` for the application name.

4. Set the minimum required SDK to **API 9: Android 2.3 (Gingerbread)** or later and use the currently recommended Android API.

	After you fill in the fields, the New Project window should look something like this:
	
	<img src="images/new-project-eclipse.png" width="100%" />

5. Click **Next**, and then move through the remaining setup screens and enter settings as necessary (or just accept the defaults).

6. Click **Finish**.

#### Step 2: Add Couchbase Lite

1. Download the latest version of Couchbase Lite from <http://www.couchbase.com/download#cb-mobile>.

2. Decompress the zip file.

3. Copy all the files into the **libs** folder in the HelloWorldEclipse project.

4. Download <http://cl.ly/Pr1r/td_collator_so.jar>.

5. Rename the downloaded **td_collator_so.jar** file to **td_collator_so.zip**.

6. Decompress the **td_collator_so.zip** file.

	The zip file decompresses into a **lib** directory that contains several folders:
	<img src="images/td-collator-files.png" width=100% />

7. Copy all of the files into the **libs** folder in the HellowWorldEclipse project.

	After the Couchbase Lite and td_collator_so files are copied into the libs directory, it should look similar to the following figure:
	<img src="images/project-files.png" width=50% />

8. Click **Run** and verify the app runs properly.

	When requested, start the emulator. You should see the app start in the emulator and the text "Hello World" in the app window, similar to the following figure:

	<img src="images/hello-world-emulator-eclipse.png" width="40%" />

	Running the empty app at this point verifies whether the dependencies are set up correctly. The app won't run properly if you have Android Studio running simultaneously with the ADT bundle Eclipse. 

#### Step 3: Add the HelloWorld code

1. Open the **MainActivity.java** file.
2. Add the following lines of code to the imports section at the top of the file:


		import com.couchbase.lite.*;
		import com.couchbase.lite.util.Log;
		
		import java.io.IOException;
		import java.text.SimpleDateFormat;
		import java.util.Calendar;
		import java.util.GregorianCalendar;
		import java.util.HashMap;
		import java.util.Map;

3. Add the following code at the end of the `onCreate` method in the **MainActivity.java** file, which is located in the **/HelloWorld/HelloWorld/src/main/java/com/couchbase/helloworld** directory.


	```java
	final String TAG = "HelloWorld";
	Log.d(TAG, "Begin Hello World App");
	
	// create a manager
	Manager manager = null;
	try {
	    manager = new Manager(getApplicationContext().getFilesDir(), Manager.DEFAULT_OPTIONS);
	} catch (IOException e) {
	    Log.e(TAG, "Cannot create manager object");
	    return;
	}
	
	// create a name for the database and make sure the name is legal
	String dbname = "hello";
	if (!Manager.isValidDatabaseName(dbname)) {
	    Log.e(TAG, "Bad database name");
	    return;
	}
	
    // create a new database
    Database database = null;
    try {
        database = manager.getDatabase(dbname);
    } catch (CouchbaseLiteException e) {
        Log.e(TAG, "Cannot get database");
        return;
    }
	
	// get the current date and time
	SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
	Calendar calendar = GregorianCalendar.getInstance();
	String currentTimeString = dateFormatter.format(calendar.getTime());
	
	// create an object that contains data for a document
	Map<String, Object> docContent = new HashMap<String, Object>();
	docContent.put("message", "Hello Couchbase Lite");
	docContent.put("creationDate", currentTimeString);
	
	// display the data for the new document
	Log.d(TAG, "docContent=" + String.valueOf(docContent));
	
	// create an empty document
	Document document = database.createDocument();
	
	// write the document to the database
	try {
	    document.putProperties(docContent);
	} catch (CouchbaseLiteException e) {
	    Log.e(TAG, "Cannot write document to database", e);
	}
	
	// save the ID of the new document
	String docID = document.getId();
	
	// retrieve the document from the database
	Document retrievedDocument = database.getDocument(docID);
	
	// display the retrieved document
	Log.d(TAG, "retrievedDocument=" + String.valueOf(retrievedDocument.getProperties()));
	
	Log.d(TAG, "End Hello World App");
	```

The code you just added creates a new database, and then creates a document, stores the document in the database, and retrieves the document. This section contains additional notes that supplement the comments in the code.

It creates a shared `Manager` object that manages a collection of databases. The Manager object can be used only in a single thread.

After it creates a name for the new database, it validates the name. A database name can consist of only lowercase alphabetic characters (a-z), digits (0-9) and a few special characters (_$()+-/), so it's important to validate the name.

To create the database, it calls `getDatabase()`, which is a method in the `Manager` class that returns a `Database` object. If the database does not already exist, `getDatabase()` creates it.

`Map` objects provide JSON-compatible representations of data that are suitable for creating documents that you can store in the database. The document created by the code is a `HashMap<String, Object>` object named `docContent` that contains only two keys, `message` and `creationDate`. `message` contains the string "Hello Couchbase Lite!", and `creationDate` contains the time and date the document was created. The document content is written out to the log to show its content.

An empty `Document` object named `document` is created. The document content is added to the empty document and it is saved to the database by using the  `Document` class `putProperties()` method. If the document cannot be written to the database, an exception is thrown.

When the document is saved to the database, Couchbase Lite generates a document identifier property named `_id` and a revision identifier property named `_rev`, and adds them to the document. The generated `_id` for the new document is available via the `getId()` method of the `Document` class.

The saved document is retrieved from the database by using the `Database` class `getDocument()` method. The retrieved document is written out to the log to show its content, which now includes the `_id` and `_rev` properties created by Couchbase Lite.

#### Step 4: Build and run HelloWorld

1. Click **Run**.

2. View the Hello World app messages in the [logcat](http://developer.android.com/tools/help/logcat.html).

	If you filter the logcat output on the string `tag:/HelloWorld`, you can see just the messages from Hello World:

	<img src="images/hello-logcat-eclipse.png" width="100%" />
	



