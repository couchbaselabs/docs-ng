<title>Rack Awareness REST API</title>

<a id="cb-restapi-rack-aware"></a>

# Rack Awareness REST API
The Rack Awareness feature allows logical groupings of servers on a cluster where each server group 
physically belongs to a rack or availability zone. This feature provides the ability to specify 
that active and corresponding replica partitions be created on servers that are part of a separate rack or zone. 
For purposes of the server group REST API, racks or availability zones are represented as flat space of server groups with group names. 
To enable Rack Awareness, all servers in a cluster must be upgraded to use the Rack Awareness feature. 

<div class="notebox">
<p>Note</p>
<p>The Rack Awareness feature with its server group capability is an Enterprise Edition feature.</p>
</div>

 The Server groups REST API  provides the following capability:

* Creates server groups
* Edits server groups
* Deletes server groups
* Assigns servers to server groups. 


## HTTP Methods
The following summarizes the HTTP methods used for managing server groups.

HTTP method | URI path | Description
--- | ---
GET  | /pools/default/serverGroups | Retrieves information about a server group.
POST | /pools/default/serverGroups | Creates a server group with a specific name.
PUT | /pools/default/serverGroups/<:uuid> | Updates the server group information.
PUT | /pools/default/serverGroups?rev=<:number> | Updates a server's group memberships.
DELETE | /pools/default/serverGroups/<:uuid> | Deletes a specific server group.



## Retrieving server group information

`GET /pools/default/serverGroups` retrieves information about server groups. Provides group information, `"groups": [(<groupInfo>)+]`, 
where each server group has unique URIs and UUIDs.

**Syntax**

```
curl -X GET -u <administrator>:<password> 
   http://<host>:<port>/pools/default/serverGroups
```

**Example**

```
curl -X GET -u Admin:myPassword 
   http://192.168.0.1:8091/pools/default/serverGroups
```

**Returns**

```
{"groups":
   [
      {
      "name":"<groupName>", 
      "uri": "/pools/default/serverGroups?rev=<integer>",
      "addNodeURI":"/pools/default/serverGroups/0",
      "nodes":[(<nodeInfo>)+]
      }
    ]
}
```

Group info | Description
--- | ---
`"groups": [(<groupInfo>)+]` | Information about server groups.
`"name":"<groupName>" `| Specifies the name of the group. If the group name has a space, for example, Group A, use double quotes (for example, `"Group A"`). If the name does not have spaces (for example, GroupA) double quotes are not required.
`"uri":"/pools/default/serverGroups?rev=<integer>"` | Specifies the URI path and revision integer.
`"uri":"/pools/default/serverGroups/<:uuid>"` | Specifies the URI path and UUID string.
`"addNodeURI":"/pools/default/serverGroups/<:uuid>/addNode` | Specifies the URI path and UUID string for adding servers to a server group.
`"nodes": [(<nodeInfo>+)] ` | Information about the servers.



## Creating server groups
`POST /pools/default/serverGroups` creates a server group with a specific name. In the following example, Group A is created. If the group name has a space, for example, Group A, use double quotes; for example, `"Group A"`.


**Syntax**

```
curl -X POST -u <administrator>:<password> 
  http://<host>:<port>/pools/default/serverGroups 
  -d name="<groupName>"
```

**Example**

```
curl -X POST -u Admin:myPassword 
  http://192.168.0.1:8091/pools/default/serverGroups 
  -d name="Group A"
```


## Renaming server groups
` PUT /pools/default/serverGroups/<:uuid>` renames the server group. Find the UUID for the server group by using GET, add the UUID to the URI path, and specify a new group name. In this example, Group A is renamed to Group B. The UUID for the server group is located in the full URI information for that server group. The UUID remains the same for the server group after changing the name.

For example, the UUID for Group A is located in the following group information:

```
"name":"Group A",
"uri":"/pools/default/serverGroups/246b5de857e100dbfd8b6dee0406420a"
```

**Syntax**

```
curl -X PUT -u <administrator>:<password> 
  http://<host>:<port>/pools/default/serverGroups/<uuid> 
  -d name="<newGroupName>"
```

**Example**

```
curl -X PUT -u Admin:myPassword 
  http://192.168.0.1:8091/pools/default/serverGroups/246b5de857e100dbfd8b6dee0406420a 
  -d name="Group B"
```

## Deleting server groups
`DELETE /pools/default/serverGroups/<:uuid>` deletes a specific server group. The server group must be empty for a successful request. In the following example, the UUID is the same UUID used in the renaming example.

**Syntax**

```
curl -X DELETE -u <administrator>:<password> 
  http://<host>:<port>/pools/default/serverGroups/<uuid>
```

**Example**

```
curl -X DELETE -u Admin:myPassword 
  http://192.168.0.1:8091/pools/default/serverGroups/246b5de857e100dbfd8b6dee0406420a
```

## Adding servers to server groups
`POST /pools/default/serverGroups/<:uuid>/addNode` adds a server to a cluster and assigns it to the specified server group. 

**Syntax**

```
curl -X POST -dhostname=<host>:<port> 
  -u <administrator>:<password> 
  http://<host>:<port>/pools/default/serverGroups/<uuid>/addNode
```

**Example**

```
curl -X POST -dhostname=192.168.0.2:8091 
  -u Admin:myPassword 
  http://192.168.0.1:8091/pools/default/serverGroups/246b5de857e100dbfd8b6dee0406420a/addNode
```

The server group's UUID is in the group information

```
"name":"Group 2",
"uri":"/pools/default/serverGroups/d55339548767ceb51b241c61e3b9f036",
"addNodeURI":"/pools/default/serverGroups/d55339548767ceb51b241c61e3b9f036/addNode",
```

## Updating server group memberships
`PUT /pools/default/serverGroups?rev=<:number>` updates the server's group memberships. 
In the following examples, the group name is optional. If the group name is provided, 
it _must_ match the current group name. 
All servers must be mentioned and _all_ groups must be mentioned. 
The URI is used to identify the group.

This request only allows moving servers between server groups. 
It does not allow server group renaming or removal. 
In this example, the servers for Group 2 are moved to Group 1. 


The following is the group information that is needed to update the server and server group memberships:

```
{
   "groups": [( { ("name": <groupName:string>,)? 
   "uri": "/pools/default/serverGroups/"<uuid>,
   "nodes": [(<otpNode>)*]
}
```



**Syntax**

```
curl -d @<inputFile> -X PUT 
  -u <administrator>:<password> 
  http://<host>:<port>/pools/default/serverGroups?rev=<number>
```

**Example**

In this example, a JSON file is used.


```
curl -d@file.json -X PUT 
  http://Administrator:asdasd@192.168.0.1:8091/pools/default/serverGroups?rev=120137811
```

**Example**

In this example, the JSON data is provided on the command line.

<pre><code>
curl -v -X PUT 
  -u Administrator:password 
  http://192.168.171.144:8091/pools/default/serverGroups?rev=28418649 
  -d '{"groups":
      [{"nodes": [{"otpNode": "ns_1@192.168.171.144"},
                  {"otpNode": "ns_1@192.168.171.145"}], 
        "name": "Group 1", 
        "uri": "/pools/default/serverGroups/0"}, 
       {"nodes": [], 
        "name": "Group 2", 
        "uri": "/pools/default/serverGroups/3ca074a8456e1d4940cfa3b7badc1e22"}] }'
</code></pre>



<div class=notebox>
<p>Note</p>
<p>The PUT request is transactional. The request either succeeds completely or fails without impact. 
If all nodes or groups are not passed, a generic error message: "Bad input" occurs and the server group is removed.
</p></div>
