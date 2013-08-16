## Working With the REST API


Couchbase Lite has an _optional_ HTTP-based REST API interface that provides access to nearly all Couchbase Lite functionality through HTTP requests. The API is useful when you want to:

* Support embedded web applications that access the REST API through AJAX. These apps can easily be packaged up into native apps by using a development framework such as [PhoneGap](http://phonegap.com).
* Enable apps written in other languages such as C#, which have client libraries available that can communicate with the REST API.
* Support peer-to-peer replication over Wi-Fi between apps on two devices.

The HTTP API follows the architectural style known as REST (Representational State Transfer), in which resources identified by URLs act as objects and the basic HTTP verbs act as methods. This maps very well to the fundamental create, read, update, and delete (CRUD) operations of a database. It's also similar to the read-write extension of HTTP, [WebDAV][WEBDAV].

### Enabling the REST API

The code that handles this API isn't in the core Couchbase Lite library, for size reasons. Instead it's in an additional framework called `CouchbaseLiteListener`. To use the REST API, you need to link this framework into your app.

Once you've done this, you can call the method `-internalURL` on the top-level `CBLManager` instance, or on any `CBLDatabase` instance, to get its equivalent URL. You can then derive other entities' URLs relative to it and send them requests.

Couchbase Lite doesn't communicate with your app over TCP sockets because it's already built into the app; instead it fakes it by registering a fake hostname (which ends with `.couchbase.`). As long as your app uses the platform-standard URL access API (`NSURLConnection` on iOS or Mac OS), it can make HTTP requests using this fake hostname and they'll be routed directly to the Couchbase Lite thread.

You don't need to know the details of the hostname, and shouldn't hardcode it as it might change (and has changed twice already!) Instead, the `internalURL` property of a `CBLDatabase` or the `CBLManager` gives you the URL to use.

### Serving the REST API

If you want external clients to be able to connect to the REST API, to enable peer-to-peer replication, you'll need to instantiate a CBLListener object.

    #import <CouchbaseLiteListener/CBLListener.h>

    CBLManager* manager = [CBLManager sharedInstance];
    _listener = [[CBLListener alloc] initWithManager: manager port: 0];
    _listener.readOnly = YES;  // Do this to prevent writes to your databases
    _listener.passwords = @{@"naomi": @"letmein"};
    BOOL ok = [_listener start];
    UInt16 actualPort = _listener.port;  // the actual TCP port it's listening on

Congratulations, you're now running a real live HTTP server. Other devices can connect to it and replicate with your databases. You will definitely want to lock this down to prevent anything malicious from reading or changing your app's data! Note how the above snippet makes the listener read-only, so remote clients can only pull from, not push to, your databases; it then sets a username and password, which implicitly disables anonymous access.

### Being a Client

For another instance of your app to be able to connect to your listener and replicate with your databases, first it has to be able to _find_ it. The easiest way to enable that is to turn on the Bonjour service on the listener:

    [_listener setBonjourName: @"John Smith" type: @"_myshoppinglist._http._tcp"];

On the client side, you can now use an `NSNetServiceBrowser` to browse for services of type `_myshoppinglist._http._tcp`, and registered listeners will show up. Typically you display them in a table view in the UI and let the user pick the right one by name.

To connect, you resolve the chosen service's IP address and port, construct an HTTP URL from them, append the database name, and then use that as the remote URL of a CBLReplication. Don't forget to add credentials, since the listener is probably password-protected; you'll probably have to prompt the user to enter them the first time.

