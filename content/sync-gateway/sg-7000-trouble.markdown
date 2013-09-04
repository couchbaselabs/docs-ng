# Troubleshooting


The developers are hungry for feedback about Sync Gateway. If you run into any roadblocks, please let us know by filing an issue on one of our projects or via the mailing list. What seems insignificant to you may be hitting everyone but the core developers, so until you let us know, we can't fix it.

## Tools
In general, the `curl` tool is your friend. (Or try [httpie][HTTPIE], an improved curl-like tool.) You can inspect databases and documents by using the Sync REST API, and look at user and role access privileges by using the Admin REST API.

An additional useful tool is the admin-port URL /*databasename*/\_dump/channels, which returns an HTML table that lists all active channels and the documents assigned to them. Similarly, "/_databasename_/\_dump/access" shows which documents are granting access to which users and channels.

## Getting Help
If you're having trouble, feel free to ask for help on the [mailing list][MAILING_LIST]. If you're pretty sure you've found a bug, please [file a bug report][ISSUE_TRACKER].


[HTTPIE]: http://httpie.org
[MAILING_LIST]: https://groups.google.com/forum/?fromgroups#!forum/mobile-couchbase
[ISSUE_TRACKER]: https://github.com/couchbaselabs/sync_gateway/issues?state=open
[MAC_STABLE_BUILD]: http://cbfs-ext.hq.couchbase.com/mobile/SyncGateway/SyncGateway-Mac.zip


