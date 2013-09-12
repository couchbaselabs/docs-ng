# Getting Started
This section contains the information you need to start developing Android apps with Couchbase Lite. 

If you want to play with a demonstration app, you can download and run [GrocerySync](https://github.com/couchbaselabs/GrocerySync-Android).  


## Prerequisites

1. Download and install [Android Studio](http://developer.android.com/sdk/installing/studio.html). 

2. Launch Android Studio.

3. Open any project or create an empty project.

	This step might be necessary so you can access the Tools menu (the menus are not visible when the Welcome to Android Studio screen is open).

4. Select **Tools > Android > SDK Manager**.

5. In Android SDK Manager, select the following items and then click **Install packages**:

	* Tools/Android SDK Tools
	* Tools/Android SDK Platform-tools
	* Tools/Android SDK Build-tools
	* Android 4.2.2 (API 17)
	* Extras/Google Repository
	* Extras/Android Support Repository

	

## Adding Couchbase Lite to Your Project
Follow the steps in this section to create a new Android project that uses Couchbase Lite.

**Create a new project:** 

1. Launch Android Studio.

2. In the Welcome to Android Studio screen, choose **New Project**.


3. In the New Project window, enter the application name, module name, package name, and project location. 

	This example uses the name MyProject for the new project. 

4. Set the minimum required SDK to **API 11: Android 3.0 (Honeycomb)** or later.

5. Click **Next**, and move through the remaining setup screens and enter settings as necessary.

6. Click **Finish**.

**Add Couchbase Lite Dependencies:**

<p style="border-style:solid;padding:10px;width:90%;margin:0 auto">
<strong>Note</strong>: If you are an advanced user and need to hack or debug Couchbase Lite, you should add the Couchbase Lite dependencies by following the steps in 
<a href="#adding-couchbase-lite-via-direct-code-dependency">Adding Couchbase Lite Via Direct Code Dependency</a> 
rather than the steps in this section.
</p>

1. Expand the **MyProject** folder, and then open the **build.gradle** file. 

	If the **build.gradle** file is empty, then you are looking at the wrong one. Make sure you open the one in the **MyProject** folder.

2. Add the following repositories section to the **build.gradle** file so it can resolve dependencies through Maven Central and the Couchbase Maven repository:

		repositories {
		    mavenCentral()
		    maven {
		        url "http://files.couchbase.com/maven2/"
		    }
		    mavenLocal()
	}


3. If there is no **libs** directory in the **MyProject** directory, open a Terminal window, create a **libs** directory, and then change to the new directory. For example:

	```bash
$ cd ~/AndroidStudioProjects/MyProjectProject/MyProject
$ mkdir libs
$ cd libs
```

4. Download [td_collator_so.jar](http://cl.ly/Pr1r/td_collator_so.jar) into the **libs** directory.  

	You can use wget or curl to download the file:
	
	```bash
$ wget http://cl.ly/Pr1r/td_collator_so.jar
or
$ curl -OL http://cl.ly/Pr1r/td_collator_so.jar
```

5. In the **build.gradle** file, add the following lines to the top-level dependencies section (not the one under the buildscript section).

	```groovy
dependencies {
    ...
    compile fileTree(dir: 'libs', include: 'td_collator_so.jar')  // hack to add .so objects (bit.ly/17pUlJ1)
    compile 'com.couchbase.cblite:CBLite:1.0.0-beta'
}
```

6. Make sure that your dependency on the Android Support library looks like this:

	```
    compile 'com.android.support:support-v4:13.0.+'
```

	You can also use com.android.support:support-v4:18.0.0.


**(Optional) Build the empty project:**

In a Terminal window, run the following command to make sure the code builds:

	$ ./gradlew clean && ./gradlew build


**Add code and verify the app runs:**

1. Add the following code to your `onCreate` method in the **MainActivity.java** file.

	You can find the file in a package under the **/MyProject/src/main/java/** directory.

	```java
String filesDir = getFilesDir().getAbsolutePath();
try {
    CBLServer server = new CBLServer(filesDir);
    server.getDatabaseNamed("hello-cblite");
} catch (IOException e) {
    Log.e("MainActivity", "Error starting TDServer", e);
}
Log.d("MainActivity", "Got this far, woohoo!");        
```

2. Select **Run > MyProject** to run the app.

	You should see a "Got this far, woohoo!" entry somewhere in the [logcat](http://developer.android.com/tools/help/logcat.html), and the app should not crash.


