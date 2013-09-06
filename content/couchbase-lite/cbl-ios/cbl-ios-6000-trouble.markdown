# Troubleshooting
This section contains information to help you troubleshoot the apps you develop with Couchbase Lite.

## Logging

Couchbase Lite includes some logging messages that you can enable for troubleshooting purposes. Serious and unexpected problems are always logged with a message that starts with the text "WARNING:", but logging for serious problems needs to be enabled via the user defaults system or command-line arguments.

### The Logging API ##

Couchbase Lite uses the logging API from my MYUtilities library. There's a `Log(@"...")` function that's used just like `NSLog`. It produces no output by default, but there's a master switch to turn it on (the boolean user default also called `Log`.) 

Beyond that, the `LogTo(Channel, @"...")` function logs to an arbitrary named "channel". Channels are off by default but are individually enabled by user defaults. For example, the default `LogFoo` turns on the `Foo` channel (but only if the master log switch is enabled too.

### Enabling Logging ##

You can turn these flags on programmatically with the `NSUserDefaults` class, or persistently from the command-line using the `defaults` tool (using your app's bundle ID, of course). During development, the most convenient way is to set them from Xcode's scheme editor. This lets you toggle them with GUI checkboxes. Here's how:

1. Pull down the scheme menu in the toolbar and choose "Edit Scheme..."
2. Choose "Run" from the source list on the left side of the sheet.
3. Choose the "Arguments" tab.
4. Click the "+" button at the bottom of the "Arguments Passed On Launch" list.
5. In the new list item that appears, type `-Log YES`.

This adds two command-line arguments when Xcode launches your app. An `NSUserDefaults` object parses these at launch time and temporarily sets the value of `Log` to `YES` (aka `true`.) This is persistent as long as you run your app from Xcode, but it's not stored in the system or device user defaults so it has no effect on launching your app normally. Moreover, you can easily turn it off by using the checkbox next to its list item.

Enabling "channels" works the same way. Add another argument item whose value is, for example, `-LogFoo YES` to turn on channel `Foo`. (Remember that you also need to have the `-Log YES` item enabled or no logs will appear at all.)

<img src="images/logging.png">

### Useful Logging Channels ##

Most of Couchbase Lite's logging goes to specific channels. Here are some useful ones to turn on:

 * **Sync** &mdash; High-level status of sync/replication.
 * **SyncVerbose** &mdash; More detailed info about sync/replication.
 * **RemoteRequest** &mdash; The individual HTTP requests the replicator sends to the remote server.
 * **View** &mdash; View indexing and queries.
 * **ChangeTracker** &mdash; The `_changes` feed listener.
 * **CBLRouter** &mdash; If using the REST API, this logs info about the URL requests being handled.
 
## Diagnosing Exceptions

If you hit an assertion failure or other exception in Couchbase Lite (or any other Cocoa code for that matter), here's how to capture information about it. This will make it a lot easier to debug.
 

### Enable a breakpoint on exceptions:

  1. In Xcode, open the breakpoints navigator (or press Cmd-6).
  2. At the bottom of the pane, click the `+` button.
  3. From the pop-up menu, select **Add Exception Breakpoint**.  
  4. In the breakpoint bubble, change the top pop-up from **All** to **Objective-C**.
  5. Click **Done**.

The breakpoint is persistent, so you need to do this only once per project.

### Capture the backtrace:

From now on, when an exception is thrown in this project, you drop into the Xcode debugger. You can of course look at the stack in the debugger GUI, but to report the exception it's best to get a textual form of the stack backtrace. To do this, make the debugger console visible (the right-hand pane of the debugger) and enter "bt" at the "(gdb)" or "(lldb)" prompt. Then copy the output.

## Diagnosing Connection Problems

## Inspecting Your Data