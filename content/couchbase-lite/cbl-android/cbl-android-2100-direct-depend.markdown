## Adding Couchbase Lite Directly

If you need to debug Couchbase Lite, you can optionally include the Couchbase Lite code directly to your project rather than using the Maven artifact dependencies (as described previously in [Adding Couchbase Lite to a Project](#adding-couchbase-lite-to-a-project)). If you choose to  add Couchbase Lite directly to your project, remove the Maven dependencies.

Follow these steps to add Couchbase Lite directly to your project:

**Add submodules**

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

**Update Gradle files**

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


