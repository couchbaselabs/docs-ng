## Adding Couchbase Lite to Your Project

You can add Couchbase Lite to your project by using any of the following methods:

* [Add a Maven dependency](#adding-a-maven-dependency).

* [Add a Jar file dependency](#adding-a-jar-file-dependency)

* [Add the source files directly](#adding-source-files-to-your-project).


### Adding a Maven Dependency

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

	```bash
$ cd ~/AndroidStudioProjects/MyProjectProject/MyProject
$ mkdir libs
$ cd libs
```

3. Download [td_collator_so.jar](http://cl.ly/Pr1r/td_collator_so.jar) into the **libs** directory.  

	You can use wget or curl to download the file:
	
	```bash
$ wget http://cl.ly/Pr1r/td_collator_so.jar
or
$ curl -OL http://cl.ly/Pr1r/td_collator_so.jar
```

4. In the **build.gradle** file, add the following lines to the top-level dependencies section (not the one under the buildscript section).

	```groovy
dependencies {
    ...
	// hack to add .so objects (bit.ly/17pUlJ1)
    compile fileTree(dir: 'libs', include: 'td_collator_so.jar')  
    compile 'com.couchbase.cblite:CBLite:1.0.0-beta'
}
```

5. Make sure that your dependency on the Android Support library looks like this:

	```
    compile 'com.android.support:support-v4:13.0.+'
```

	You can also use com.android.support:support-v4:18.0.0.




### Adding a Jar File Dependency

Follow these steps to add the Jar file to your project:

1. Download the [1.0.0-beta release zip archive](http://qa.hq.northscale.net/job/build_cblite_android-artifacts/lastSuccessfulBuild/artifact/couchbase-lite-android/CouchbaseLiteProject/zip_release_archive.zip).

2. Extract the .zip file to the **libs** directory.

	You should have a **MyProject/MyProject/libs/CBLite-1.0.0-beta.jar** file.

3. Modify your **build.gradle** file to include all jars in the libs directory.

		dependencies {
	    ...
	    compile fileTree(dir: 'libs', include: '*.jar')
	}

### Adding Source Files to Your Project
If you need to debug Couchbase Lite, you can include the Couchbase Lite code in your project rather than using a jar file or the Maven artifact dependencies . If you choose to  add the source files, make sure you remove any maven or jar file dependencies that you used previously.

Follow these steps to add Couchbase Lite source files directly to your project:

#### Add submodules

1. Change to the parent **MyProject** directory, which contains the **settings.gradle** file.

	```bash
$ cd MyProject 
```

2. Add the required submodule:

	```sh
$ git submodule add https://github.com/couchbase/couchbase-lite-android-core.git CBLite
```

3. Add any optional submodules that you need:

		$ git submodule add https://github.com/couchbase/couchbase-lite-android-listener.git CBLiteListener
		$ git submodule add https://github.com/couchbase/couchbase-lite-android-javascript.git CBLiteJavascript

	You might need to do some extra steps to tell Android Studio about the optional submodules.

#### Update Gradle files

1. Add the following line to the **settings.gradle** file:

	```groovy
include ':MyProject', ':CBLite'
```

2. If you included any optional submodules, add include statements for them to the **settings.gradle** file.

3. Add the following dependency to the **MyProject/MyProject/build.gradle** file:

	```groovy
dependencies {
    ... existing stuff ...
    compile project(':CBLite')
}
```

4. If you included any optional submodules, add compile statements for them to the **MyProject/MyProject/build.gradle** file.


