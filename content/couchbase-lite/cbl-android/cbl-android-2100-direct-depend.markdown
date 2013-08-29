## Adding Couchbase Lite via Direct Code Dependency

If you need to debug or hack on Couchbase Lite, you can include the Couchbase Lite code directly in a project rather than using the Maven artifact dependencies.

### Add submodules

1. Move into the parent **MyProject** directory, which contains the **settings.gradle** file.

	```bash
$ cd MyProject 
```

2. Add the required submodules:

	```bash
$ git submodule add https://github.com/couchbase/couchbase-lite-android-core.git CBLite
```

3. Add any optional submodules that you need:

	```bash
$ git submodule add https://github.com/couchbase/couchbase-lite-android-listener.git CBLiteListener
$ git submodule add https://github.com/couchbase/couchbase-lite-android-javascript.git CBLiteJavascript
$ git submodule add https://github.com/couchbaselabs/couchbase-lite-android-ektorp.git CBLiteEktorp
```

	You might need to do some extra steps to tell Android Studio about the optional submodules.

### Update Gradle Files

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


