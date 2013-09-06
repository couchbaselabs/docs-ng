## Authenticating With a Remote Database

To sync successfully with a remote database that requires authentication, your app needs to register credentials ahead of time. The registered credentials get used automatically when there’s a connection to that server. Here’s an example of how to do this with a name and password pair:

    NSURLCredential* cred;
    cred = [NSURLCredential credentialWithUser: @"snej"
                                      password: @"XXXX"
                                   persistence: NSURLCredentialPersistencePermanent];
    NSURLProtectionSpace* space;
    space = [[[NSURLProtectionSpace alloc] initWithHost: @"sync.example.com"
                                                   port: 443
                                               protocol: @"https"
                                                  realm: @"My Database"
                                   authenticationMethod: NSURLAuthenticationMethodDefault]
             autorelease];
    [[NSURLCredentialStorage sharedCredentialStorage] setDefaultCredential: cred
                                                        forProtectionSpace: space];

This is best done right after the user has entered her name and password in your configuration UI. Because this specifies permanent persistence, the credential store writes the password securely to the Keychain. From then on, NSURLConnection (Cocoa's underlying HTTP client engine) finds it when it needs to authenticate with that same server.

If you don’t want the password stored, use NSURLCredentialPersistenceForSession. If you don't store the password, you need to call the above code on every launch, begging the question of where you get the password from. The alternatives are generally less secure than the Keychain.

The OS is  picky about the parameters of the protection space. If they don’t match exactly — including the port and the realm string — the credentials won’t be used and the sync fails with a 401 error.

### What's My Realm?

If you need to figure out the actual realm string for the server, you can use ‘curl’ or an equivalent tool to examine the "WWW-Authenticate" response header for an authorization failure:

    $ curl -i -X POST http://sync.example.com/dbname/
    HTTP/1.1 401 Unauthorized
    WWW-Authenticate: Basic realm="My Database"


If you try this and the server isn't returning a WWW-Authenticate header, you need to change the configuration to enable it. This includes specifying the value of that header, which means you get to make up any realm value you want.

### Hardcoding

Alternatively, you can hardcode the username and password into the URL of the remote database, using the standard syntax. In the same situation as the previous example, the URL to specify is:

    https://snej:XXXX@sync.example.com/databasename

This is less secure because the password is stored in plaintext.

### OAuth

Couchbase Lite supports OAuth 1 (but _not_ yet the newer OAuth 2) for client authentication, so if this has been configured in your upstream database, you can replicate with it by providing OAuth tokens. These go into the JSON replication description. The `source` or `target` property that specifies the remote database becomes a JSON object instead of a string, with an `auth` sub-property that contains the credentials. Continuing the previous examples:

    {"source": "localdb",
     "target": {
        "url": "https://sync.example.com/databasename",
        "auth": {
            "oauth": {
                "consumer_secret": "...", "consumer_key": "...", "token_secret": "...", "token": "..."
            }
        }
    }
