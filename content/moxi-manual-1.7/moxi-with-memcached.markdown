# Moxi with Memcached

Moxi speaks the memcached protocol, so it can work with both memcached servers
and Membase servers.

When used with Membase, Moxi is started with a REST/URL that describes the
Membase cluster configuration, and Moxi uses vbucket hashing to determine which
key-value items live on which servers.

When used with standard, classic memcached, Moxi should be started with
different command-line parameters that will make Moxi use libmemcached (ketama)
hashing. In particular, Moxi will take a different cluster or -z command-line
flag, like...


```
./moxi -z LISTEN_PORT=MEMCACHED_HOST1[:PORT1][,MEMCACHED_HOSTN[:PORTN]]
```

The memcached PORT's default to 11211. For example, below, moxi will listen on
port 11811 and use ketama hashing against a server-list of `mc1:11211,mc2:11211`
:


```
./moxi -z 11811=mc1,mc2
              ./moxi -z 11811=mc1:11211,mc2:11211
```

You may also move the -z cluster configuration into a separate file, by
specifying either an absolute or relative path...


```
./moxi -z ./relative/path/to/cluster/config_file
              ./moxi -z /absolute/path/to/cluster/config_file
```

The contents of the config\_file should look like...


```
11811=mc1:11211,mc2:11211
```

<a id="moxi-performance"></a>
