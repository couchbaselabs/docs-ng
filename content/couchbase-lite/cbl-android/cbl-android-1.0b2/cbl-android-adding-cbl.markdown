# Adding Couchbase Lite to Your Project

You can add Couchbase Lite to your Android project by using one of the following methods:

* [Add a Maven dependency](#adding-a-maven-dependency)

* [Add a JAR file dependency](#adding-a-jar-file-dependency)

* [Add the source files directly](#adding-source-files-to-your-project)


## Adding a Maven Dependency

Follow these steps to add the Maven dependency to your project:

1. Add the following repositories section to the **build.gradle** file so it can resolve dependencies through Maven Central and the Couchbase Maven repository:

		repositories {
		    mavenCentral()
		    maven {
		        url "http://files.couchbase.com/maven2/"
		    }
		    mavenLocal()
		}


2. If there is no **libs** directory in the **MyProject** directory, open a Terminal window, create a **libs** directory, and then change to the new directory. For example:

		
		$ cd ~/AndroidStudioProjects/MyProjectProject/MyProject
		$ mkdir libs
		$ cd libs


3. Download [td_collator_so.jar](http://cl.ly/Pr1r/td_collator_so.jar) into the **libs** directory.  

	You can use wget or curl to download the file:
	

		$ wget http://cl.ly/Pr1r/td_collator_so.jar
		or
		$ curl -OL http://cl.ly/Pr1r/td_collator_so.jar


4. In the **build.gradle** file, add the following lines to the top-level dependencies section (*not* the one under the buildscript section).


		dependencies {
		   // ...
		   // hack to add .so objects
		   compile fileTree(dir: 'libs', include: 'td_collator_so.jar')  
		   compile 'com.couchbase.cblite:CBLite:1.0.0-beta2'
		}


5. Make sure that your dependency on the Android Support library looks like this:

		compile 'com.android.support:support-v4:13.0.+'

	You can also use `com.android.support:support-v4:18.0.0`.


## Adding a JAR File Dependency

Follow these steps to add the JAR file to your project:

1. Download the latest release of Couchbase Lite for Android from <http://www.couchbase.com/download#cb-mobile>.

2. Extract the .zip file to the **libs** directory of your project.

3. Modify the **build.gradle** file to include all jars in the **libs** directory:

		dependencies {
		   ...
		   compile fileTree(dir: 'libs', include: '*.jar')
		}

## Adding Source Files to Your Project
If you need to debug Couchbase Lite, you can include the Couchbase Lite code in your project rather than using a JAR file or the Maven artifact dependencies. If you choose to add the source files, make sure you remove any Maven or JAR file dependencies that you used previously.

Follow these steps to add Couchbase Lite source files directly to your project:

### Add submodules

1. Change to the parent **MyProject** directory, which contains the **settings.gradle** file.

		$ cd MyProject 

2. Add the required submodule:


		$ git submodule add https://github.com/couchbase/couchbase-lite-android-core.git CBLite


3. Add any optional submodules that you need:

		$ git submodule add https://github.com/couchbase/couchbase-lite-android-listener.git CBLiteListener
		$ git submodule add https://github.com/couchbase/couchbase-lite-android-javascript.git CBLiteJavascript


### Update Gradle files

1. Add the following line to the **settings.gradle** file:

		include ':MyProject', ':CBLite'


2. If you included any optional submodules, add include statements for them to the **settings.gradle** file.

3. Add the following dependency to the **MyProject/MyProject/build.gradle** file:

		dependencies {
			... existing dependencies ...
			compile project(':CBLite')
}


4. If you included any optional submodules, add compile statements for them to the **MyProject/MyProject/build.gradle** file.


