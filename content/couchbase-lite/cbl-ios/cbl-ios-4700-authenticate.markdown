## Authenticating With a Remote Database

Most remote databases require authentication (particularly for a push replication because the server is unlikely to accept anonymous writes). To sync with a remote database that requires authentication, your app needs to register credentials ahead of time so the replicator can log in to the remote server on your behalf. The registered credentials get used automatically when there’s a connection to the server. 

<div class="notebox tip">
<p>Security Tip</p> 
<p>Because Basic authentication sends the password in an easily readable form, it is only safe to use it over an HTTPS (SSL) connection or over an isolated network you're confident has full security. Before configuring authentication, make sure the remote database URL has the <code>https:</code> scheme.</p>
</div>

### Hard-coded user name and password

The simplest but least secure way to store credentials is to use the standard syntax for embedding them in the URL of the remote database:

	https://frank:s33kr1t@sync.example.com/database/

This URL specifies the user name `frank` and password `s33kr1t`. If you use this as the remote URL when creating a replication, Couchbase Lite uses the included credentials. The drawback is that the password is easily readable by anything with access to your app's data files.

### Cocoa credential storage

The best way to store credentials is by using the Cocoa [URL loading system](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/URLLoadingSystem/URLLoadingSystem.html), which can store credentials either in memory or in the keychain by using its authentication and credentials classes. The keychain is a secure place to store secrets. it's encrypted with a key derived from the user's iOS passcode and managed by a single trusted OS process. Credentials stored in the keychain get used automatically when there’s a connection to the matching server because the `NSURLConnection` class, Cocoa's underlying HTTP client engine, finds it when it needs to authenticate with that same server. 

You should store the credentials right after the user enters a name and password in your configuration UI. The following example shows how to register a credential for a remote database.

First, create a `NSURLCredential` object that contains the user name and password, and an indication of the persistence with which they should be stored:

    NSURLCredential* cred;
    cred = [NSURLCredential 
       credentialWithUser: @"frank"
                 password: @"s33kr1t"
              persistence: NSURLCredentialPersistencePermanent];

Because this example specifies permanent persistence, the credential store writes the password securely to the keychain. If you don’t want the credentials stored in the keychain, use `NSURLCredentialPersistenceForSession` for the persistence setting. If you don't store the credentials in the keychain, you need to set up the credentials each time the app is launched. 

Next, create a `NSURLProtectionSpace` object that defines the URLs to which the credential applies:

    
    NSURLProtectionSpace* space;
    
    space = [[[NSURLProtectionSpace alloc] 
            initWithHost: @"sync.example.com"
                    port: 443
                protocol: @"https"
                   realm: @"realm name"
    authenticationMethod: NSURLAuthenticationMethodDefault]
             autorelease];

The realm is an attribute of the server's HTTP authentication configuration. It's global to the server and not specific to a database. If you specify the wrong realm, the HTTP authentication will fail with a 401 status (as will your replication). 

If you need to determine the actual realm string for the server, you can use [curl](http://curl.haxx.se) or another HTTP client tool to find the realm name, which is included in the `WWW-Authenticate` header of the response when there is an authentication failure. Here's an example that uses curl to get the name of the realm for a database named `dbname` hosted at `sync.example.com/`:

```
$ curl -i -X POST http://sync.example.com/dbname/
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="realm name"
```

If you try this and the server does not return a `WWW-Authenticate` header, you need to change the configuration to enable it. 

<div class="notebox">
<p>Note</p>
<p>The OS is picky about the parameters of the protection space. If they don’t match exactly—including the port number and the realm string—the credentials are not used and the sync fails with a 401 error. When troubleshooting authentication failures, double-check the spelling and values for each parameter in the <code>NSURLCredential</code> and <code>NSURLProtectionSpace</code> objects.
</p>
</div>

Finally, register the credential for the protection space:

    [[NSURLCredentialStorage sharedCredentialStorage]
       setDefaultCredential: cred
         forProtectionSpace: space];

### OAuth

[OAuth](http://oauth.net) is a complex protocol that, among other things, allows a user to use an identity from one site (such as Google or Facebook) to authenticate to another site (such as a Sync Gateway server) _without_ having to trust the relaying site with the user's password.

Sync Gateway supports OAuth version 1 (but _not_ the newer OAuth 2) for client authentication. If OAuth has been configured in your upstream database, you can replicate with it by providing OAuth tokens:


```
replication.OAuth = 
   @{ @"consumer_secret": consumerSecret,
      @"consumer_key": consumerKey,
      @"token_secret": tokenSecret,
      @"token": token };
```

Getting the values is somewhat tricky and involves authenticating with the origin server (the site at which the user has an account or identity). Usually you use an OAuth client library to do the hard work, such as a library from [Google](http://code.google.com/p/gtm-oauth/) or [Facebook](https://github.com/facebook/facebook-ios-sdk).

OAuth tokens expire after some time. If they're updated, you need to update them in the replication settings.

