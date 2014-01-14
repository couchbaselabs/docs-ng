# Troubleshooting

This section contains information to help you troubleshoot the apps you develop with Couchbase Lite.

## Starting Debugging Tests From the Command Line

1. Set some breakpoints in your test code

2. ./gradlew connectedInstrumentTest

3. In Android Studio, go to Run / Attach Debugger to running process

4. Wait until you see your test process, since it might take a few seconds

5. Choose it in the "Choose Process" window (it will look something like [this](http://cl.ly/image/0v313G320T3B))

6. Wait until it reaches your breakpoint


## Running and Debugging a Single Test From Android Studio

These instructions work with either your own application unit tests or the Couchbase lite library code.  However, in the case of the latter, you need to depend on the Couchbase Lite code directly rather than using Maven artifacts.

1. Go to Run / Edit Configurations.

2. Click the Plus (+) button and choose Android Tests, and give it a name (for example, MyTest).

3. In the module pulldown menu, choose the module in which your test lives.

	The following figure shows selecting a test in the **cblite** library.  
![](images/debug-screen.png)

4. In the "Test" section, choose the Class radio button.
  
5. Under class, add the fully qualified class name that you want to test. For example, `com.couchbase.cblite.testapp.tests.Router`.

6. Click **Apply** or **OK**

7. Make sure MyTest is chosen in the configuration pulldown, and choose Run / Debug.

8. Wait until it reaches your breakpoint.


## Running the Test Suite

1. If Sync Gateway is not already installed, install it by following the instructions in [Installing Sync Gateway](/sync-gateway/#getting-started-with-sync-gateway).

2. Create a file named **config.json** and copy the following JSON-formatted configuration data into it:

	```json
	{
	   "log": ["CRUD", "REST+"],
	   "databases": {
	      "cblite-test": {
	         "server": "walrus:data",
	         "sync": `function(doc){channel(doc.channels);}`,
	         "users": {
	            "GUEST": {"disabled": false, 	"admin_channels": ["*"]}
	         }
	      }
	   }
	}
	```

3. Start Sync Gateway:

		$ ./bin/sync-gateway config.json


4. Create a copy of the **test.properties** file and name it **local-test.properties**:

	```
	$ cd CBLite/src/instrumentTest/assets/
	$ cp test.properties local-test.properties
	```

5. Customize the **local-test.properties** file to point to your database (URL and database name).  For example:

	```
	replicationServer=10.0.2.2
	replicationPort=4984
	```

	**Note**: You need to create a **local-test.properties** file for each of the library projects that contain tests (for example, CBLite and CBLiteJavascript).

	**Note**: If you are running the tests on the android emulator, then you can use the special `10.0.2.2` address, which has use the IP address of the workstation that launched the emulator (assuming that's where your server is).

6. In Android Studio,  select **Tools > Android > AVD Manager**.

	The Android emulator starts.

7. Launch the test suite:

	```
	$ ./gradlew clean && ./gradlew :CBLite:connectedInstrumentTest && ./gradlew :CBLiteJavascript:connectedInstrumentTest
```


