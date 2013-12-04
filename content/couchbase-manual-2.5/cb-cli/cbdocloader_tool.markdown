   
<a id="couchbase-admin-cmdline-cbdocloader"></a>

# cbdocloader Tool

You can use this tool to load a group of JSON documents in a given directory, or
in a single.zip file. This is the underlying tool used during your initial
Couchbase Server install which will optionally install two sample databases
provided by Couchbase. You can find this tool in the following locations,
depending upon your platform:

<a id="table-couchbase-admin-cmdline-cbdocloader-locs"></a>

Operating System | Location
-------------|----------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin/tools/`                                                      
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

When you load documents as well as any associated design documents for views,
you should use a directory structure similar to the following:


```
/design_docs    // which contains all the design docs for views.
/docs           // which contains all the raw json data files. This can contain other sub directories too.
```

All JSON files that you want to upload contain well-formatted JSON. Any file
names should exclude spaces. If you want to upload JSON documents and design
documents into Couchbase Server, be aware that the design documents will be
uploaded after all JSON documents. The following are command options for
`cbdocloader` :


```
-n HOST[:PORT], --node=HOST[:PORT] Default port is 8091

-u USERNAME, --user=USERNAME REST username of the cluster. It can be specified in environment variable REST_USERNAME.

-p PASSWORD, --password=PASSWORD REST password of the cluster. It can be specified in environment variable REST_PASSWORD.

-b BUCKETNAME, --bucket=BUCKETNAME Specific bucket name. Default is default bucket. Bucket will be created if it does not exist.

-s QUOTA, RAM quota for the bucket. Unit is MB. Default is 100MB.

-h --help Show this help message and exit
```

The following is an example of uploading JSON from a.zip file:


```
./cbdocloader  -n localhost:8091 -u Administrator -p password -b mybucket ../samples/gamesim.zip
```

Be aware that there are typically three types of errors that can occur: 1) the
files are not well-formatted, 2) credentials are incorrect, or 3) the RAM quota
for a new bucket to contain the JSON is too large given the current quota for
Couchbase Server.
