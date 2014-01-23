# Getting Started
This section contains the information you need to start developing Android apps with Couchbase Lite. 

If you want to play with a demonstration app, you can download and run [GrocerySync](https://github.com/couchbaselabs/GrocerySync-Android) from our GitHub repository.  

## Setting up the development environment

Before you can build an app, you need to set up your development environment:

1. Download and install [Android Studio](http://developer.android.com/sdk/installing/studio.html). 

2. Launch Android Studio.

3. From the Quick Start menu on the welcome screen, select **Configure > SDK Manager**. 

	If you already have a project open, you can open the SDK Manager by selecting **Tools > Android > SDK Manager** from the Android Studio menu bar.

5. In Android SDK Manager, select the following items and then click **Install packages**:

	* Tools/Android SDK Tools
	* Tools/Android SDK Platform-tools
	* Tools/Android SDK Build-tools
	* Android API (currently recommended: API 17)
	* Extras/Google Repository
	* Extras/Android Support Repository

## Building Your First App
This section shows how to create a simple Hello World app for an Android device with Couchbase Lite. It uses Maven to add the Couchbase Lite dependencies.

### Step 1: Create a new project

1. Launch Android Studio.

2. In the Welcome to Android Studio screen, choose **New Project**.

3. In the New Project window, enter the application name, module name, package name, and project location.

	This example uses `HelloWorld` for the application name.

4. Set the minimum required SDK to **API 9: Android 2.3 (Gingerbread)** or later and use the currently recommended Android API.

	After you fill in the fields, the New Project window should look something like this:
	
	<img src="images/new-project.png" width="100%" />

5. Click **Next**, and then move through the remaining setup screens and enter settings as necessary (or just accept the defaults).

6. Click **Finish**.

### Step 2: Add Couchbase Lite dependencies via Maven

1. Expand the **HelloWorld** folder, and then open the **build.gradle** file. 

	You should see a file that looks something like this:

	<img src="images/build-gradle.png" width="100%" />
	
	If the **build.gradle** file is empty, then you are looking at the wrong one. Make sure you open the one in the **HelloWorld** folder (and not the one at the project level).

2. In the **build.gradle** file, add the following lines to the top-level **repositories** section (not the one under buildscript) so it can resolve dependencies through Maven Central and the Couchbase Maven repository:

	    maven {
	        url "http://files.couchbase.com/maven2/"
	    }
	    mavenLocal()
		
	After you add the extra lines, the **repositories** section should look like this:

		repositories {
			mavenCentral()
			maven {
				url "http://files.couchbase.com/maven2/"
			}
			mavenLocal()
		}

3. Select **Tools > Open Terminal**, create a **libs** directory, and then change to the new directory:


		$ mkdir libs
		$ cd libs

4. In the Terminal window, download [td_collator_so.jar](http://cl.ly/Pr1r/td_collator_so.jar) into the **libs** directory.  

	You can use wget or curl to download the file:
	

		$ wget http://cl.ly/Pr1r/td_collator_so.jar
		or
		$ curl -OL http://cl.ly/Pr1r/td_collator_so.jar


5. In the **build.gradle** file, add the following lines to the top-level dependencies section (not the one under the `buildscript` section).

		// hack to add .so objects (bit.ly/17pUlJ1)
		compile fileTree(dir: 'libs', include: 'td_collator_so.jar')  
		compile 'com.couchbase.cblite:CBLite:1.0.0-beta2'
		
	After you add the extra lines, the dependencies section should look similar to this:

		dependencies {
			compile 'com.android.support:appcompat-v7:+'
			// hack to add .so objects (bit.ly/17pUlJ1)
			compile fileTree(dir: 'libs', include: 'td_collator_so.jar')
			compile 'com.couchbase.cblite:CBLite:1.0.0-beta2'
		}

6. In the Android Studio tool bar, click **Sync Project with Gradle Files**.

	<img src="images/sync-gradle.png" width="50%" />

7. In the Android Studio tool bar, click **Run**.

	When requested, start the emulator. You should see the app start in the emulator and the text "Hello World" in the app window, similar to the following figure:

	<img src="images/hello-world-emulator.png" width="40%" />

#### Troubleshooting tips
Running the empty app at this point verifies whether the dependencies are set up correctly. If the app doesn't run properly for you, check the following troubleshooting tips:

<ul>
<li>Errors in the <strong>build.gradle</strong> file are a common cause of problems. </li>
<ul>
<li>Double-check the spelling of all entries in the file.</li>
<li>Check to make sure all the code added to the file is located in the correct sections.</li>
<li>Compare your file to this <a href="images/build-gradle-sample.txt">sample <strong>build.gradle</strong></a> file.
</ul>
<li>Couchbase Lite for Android does not currently build correctly with Proguard. If you get build errors that mention Proguard, you can disable it by changing the **build.gradle** file `runProguard` setting in the **android** section to false. When you change it, the *android* section should look something like the following code:</li>
<pre><code>
android {
     buildTypes {
        release {
            runProguard false
            proguardFile ...
        }
    }
 }
</code></pre>
</ul>
### Step 3: Add the HelloWorld code

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
	Database database = manager.getDatabase(dbname);
	
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

### Step 4: Build and run HelloWorld

1. Click **Run**.

2. View the Hello World app messages in the [logcat](http://developer.android.com/tools/help/logcat.html).

	If you filter the logcat output on the string `/Hello`, you can see just the messages from Hello World:

	<img src="images/hello-logcat.png" width="100%" />
	

