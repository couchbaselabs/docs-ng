## Sync REST API

You use the Sync REST API to synchronize a local database with a remote database. The sync takes place over HTTP and uses JSON documents in the message bodies. For more information about the synchronization protocol, see [Replication Algorithm](https://github.com/couchbase/couchbase-lite-ios/wiki/Replication-Algorithm). You can also see the [URL mappings in the Sync Gateway source code](https://github.com/couchbase/sync_gateway/blob/master/src/github.com/couchbaselabs/sync_gateway/rest/routing.go).

To access the Sync REST API, you need to have a user account.


### HTTP Requests

You can use the following requests on the remote database. Replace *db* with the dame of your database.

**Push or Pull Requests:**

* Read the last checkpoint  
		GET /*db*/_local/*checkpointid*

* Save a new checkpoint  
		PUT /*db*/_local/*checkpointid*


**Push Requests:**

* Create remote database  
		PUT /*db*

* Find revisions that are not known to the remote database  
		POST /*db* /_revs_diff

* Upload revisions  
		POST /*db*/_bulk_docs

* Upload a single document with attachments  
		PUT /*db*/_docid_?new_edits=false


**Pull Requests:**

* Find changes since the last pull (_feed_ can be normal or longpoll)  
		GET /*db*/_changes?style=all_docs&feed=*feed*&since=*since*&limit=*limit*&heartbeat=*heartbeat*

* Download a single document with attachments  
		GET /*db*/*docid*?rev=*revid*&revs=true&attachments=true&atts_since=*lastrev* 

* Download first-generation revisions in bulk  
POST /*db*/_all_docs?include_docs=true

