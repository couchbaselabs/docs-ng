# Troubleshooting

The developers are hungry for feedback about Sync Gateway. If you run into any roadblocks, please let us know by filing an issue on one of our projects or via the mailing list. What seems insignificant to you may be hitting everyone but the core developers, so until you let us know, we can't fix it. 

## Tools
In general, [cURL](http://curl.haxx.se), a command-line HTTP client, is your friend. You might also want to try [HTTPie](https://github.com/jkbr/httpie), a human-friendly command-line HTTP client. By using these tools, you can inspect databases and documents via the Sync REST API, and look at user and role access privileges via the Admin REST API.

An additional useful tool is the admin-port URL /*databasename*/\_dump/channels, which returns an HTML table that lists all active channels and the documents assigned to them. Similarly, "/_databasename_/\_dump/access" shows which documents are granting access to which users and channels.

## Getting Help
If you're having trouble, feel free to ask for help on the [mailing list](https://groups.google.com/forum/?fromgroups#!forum/mobile-couchbase). If you're pretty sure you've found a bug, please [file a bug report](https://github.com/couchbase/sync_gateway/issues?state=open).






