
<a id="couchbase-admin-cmdline-cbworkloadgen"></a>

# cbworkloadgen Tool

Tool that generates random data and perform read/writes for Couchbase Server.
This is useful for testing your Couchbase node.

<a id="table-couchbase-admin-cmdline-cbworkloadgen-locs"></a>

Operating System | Location
-------------|----------------------------------------------------------------------------------
**Linux**    | `/opt/couchbase/bin/tools/`                                                      
**Windows**  | `C:\Program Files\Couchbase\Server\bin\tools\`                                   
**Mac OS X** | `/Applications/Couchbase Server.app/Contents/Resources/couchbase-core/bin/tools/`

The following is the standard command format:


```
cbworkloadgen Usage:
cbworkloadgen -n host:port -u [username] -p [password]

Options are as follows:

-r [number] // % of workload will be writes, remainder will be reads
--ratio-sets=[number] // 95% of workload will be writes, 5% will be reads
-i [number]    // number of inserted items
-l // loop forever until interrupted by user
-t // set number of concurrent threads
-v // verbose mode
```

For example, to generate workload on a given Couchbase node and open port on
that node:


```
> ./cbworkloadgen -n 10.17.30.161:8091 -u Administrator -p password
```

Will produce a result similar to the following if successful:


```
[####################] 100.0% (10527/10526 msgs)
bucket: default, msgs transferred...
       :                total |       last |    per sec
 batch :                   11 |         11 |        2.2
 byte  :               105270 |     105270 |    21497.9
 msg   :                10527 |      10527 |     2149.8
done
```

When you check the data bucket you will see 10000 new items of with random keys
and values such as the following item:


```
pymc0    "MDAwMDAwMDAwMA=="
```
