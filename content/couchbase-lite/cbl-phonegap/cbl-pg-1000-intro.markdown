# Introduction

The Couchbase Lite Plug-in for PhoneGap enables you to develop cross-platform mobile apps that use Couchbase Lite by using PhoneGap and standard web technologies (HTML5, CSS, and JavaScript). 

[PhoneGap](http://phonegap.com) is a web application framework that provides a container to wrap your app in. You develop an app that uses Couchbase Lite and standard web technologies, wrap it in a PhoneGap container, and then build executables for iOS and Android devices from the same code base. 

The following diagram shows the architecture of iOS and Android mobile apps that use the Couchbase Lite Plug-in for PhoneGap:

![](images/phonegap-arch.png)

# Getting Started in 5 Minutes

The following sections show how to build iOS and Android apps with the Couchbase Lite Plug-in for PhoneGap. This example uses a shared to-do list app called Todo Lite that demonstrates many Couchbase Lite features. When you develop your own apps later, you can follow these instructions and substitute your own source code for the ToDo Lite app source code.

## Before You Begin

Before you can build apps with PhoneGap, you need to install PhoneGap and several other tools on your computer. You might already have some of them installed. To get set up, install the following tools: 

1. Install [Git](http://git-scm.com), which is a distributed version control system.

2. If you want to build apps for iOS devices:

	* Install [Xcode](https://developer.apple.com/xcode/).

	* Install [ios-sim](https://github.com/phonegap/ios-sim), which is a command-line application launcher for the Xcode iOS Simulator, by using [Homebrew](http://brew.sh):

		```sh
	$ brew install ios-sim
	```

3. If you want to build apps for Android devices, install [Android Studio](http://developer.android.com/sdk/installing/studio.html). 

4. Install [Node.js](http://nodejs.org/download), which is a JavaScript network application platform. 

	The Node.js download installs both Node.js and the Node.js package manager (npm).
	
5. Install PhoneGap:

	```sh
$ npm install -g phonegap
```


## Building Todo Lite

Get out a stopwatch, your 5 minutes starts now!

1. Open a terminal window and change to the directory that you want to store your project in.

2. Create a new PhoneGap project and change to its directory:

	```sh
	$ phonegap create todo-lite com.couchbase.TodoLite TodoLite
	$ cd todo-lite
	```

	After you create a new PhoneGap project, the project directory contains a directory named **www**. The **www** directory contains a default application.
	
3. Add the Couchbase Lite plug-in to your project:

	```sh
	$ phonegap local plugin add https://github.com/couchbaselabs/Couchbase-Lite-PhoneGap-Plugin.git
	```

4. Add the following additional plug-ins to your project:

	```sh
$ phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
$ phonegap local plugin add https://github.com/apache/cordova-plugin-inappbrowser.git
$ phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
```

These plug-ins activate Couchbase Lite, the camera, the InAppBrowser, and network information.

5. Replace the default application in the **www** directory with the Todo Lite source code:

	```sh
	$ rm -rf www
$ git clone https://github.com/couchbaselabs/TodoLite-PhoneGap.git www
```

When you develop your own app, replace the default application  in the **www** directory with your source code.

6. Build and run the Todo Lite iOS app:

	```sh
	$ phonegap run ios
	```

	The app opens in the iOS simulator.

7. Build and run the ToDo Lite Android app:

	```sh
	$ phonegap run android
	```

	The app opens in the Android simulator.
	

## Troubleshooting the ToDo Lite Build

If you can't build the ToDo Lite app, first make sure you have all the tools listed in [Before You Begin](#before-you-begin) installed and that you have the latest released version of each tool. 

To verify that the command-line tools are installed and check version numbers, you can run the following commands in a terminal window:

```sh
$ git --version
$ brew -v
$ ios-sim --version
$ node -v
$ npm -v
$ phonegap -v
```

To make sure PhoneGap and your IDEs are set up correctly, try building the default PhoneGap app for iOS and Android: 

```sh
$ phonegap create my-app
$ cd my-app
$ phonegap run iOS
$ phongap run android
```

For more information about setting up the SDKs on your computer, see:

* [PhoneGap iOS Platform Guide](http://docs.phonegap.com/en/3.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)

* [PhoneGap Android Platform Guide](http://docs.phonegap.com/en/3.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide) 

The following table contains solutions for some other problems you might encounter when building the ToDo Lite app:

|Problem|Solution|  
| ------	| ------	|  
|You can't install a command-line tool.| Use the `sudo` command to install the tool. For example: `sudo npm install -g phonegap`  
|When you add plug-ins to your project, you get the following error message: \[error] project directory could not be found. | Make sure you are in the **/todo-lite** directory.  
|When you build an iOS app, the iOS simulator doesn't start automatically.|Make sure ios-sim is installed.
|When you build an Android app, it uses the remote environment and prompts you to log in to the PhoneGap build service. |  Make sure your Android device emulator is set up. For more information about setting up an emulator, read the [Deploy to Emulator section in the *PhoneGap Android Platform Guide*](http://docs.phonegap.com/en/3.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)

