# Getting Started

Now that you've installed Couchbase and have probably created a cluster of
Couchbase servers, you will need to use a client library to save and retrieve
data from the cluster. The Couchbase C client library, also known as
libcouchbase, is one way of doing so.

Here's a quick outline of what you'll learn in this chapter:

 * How to obtain the client library.

 * How to build the client library from source (optional).

 * Write a simple program to demonstrate connecting to Couchbase and saving some
   data.

To explore other C SDK methods, please refer to the Couchbase [C SDK Language
reference](http://www.couchbase.com/docs/couchbase-sdk-c-1.0/index.html).

<a id="downloading"></a>

## Downloading the Couchbase Client Library

Download the latest client library from the [Coucbase download
site](http://files.couchbase.com/developer-previews/clients/couchbase-server-2.0.0-compatible/c/).
It is available as a source archive in both `.zip` and `.tar.gz`

<a id="c-install-linux_and_mac"></a>

## Installing from Source: Linux and Mac OS X

Installation is like many common libraries, following the `./configure`, `make`,
`make install` conventions.

For libvbucket, extract the archive then `cd` into the directory and run:


```
shell> ./configure
shell> make install
```

Standard configure options such as `--prefix` can be passed to the configure
command. Running./configure with --help with provide additional information on
configuration options.

For libcouchbase, extract the archive, then cd into the directory and run:


```
shell> ./configure CPPFLAGS="-I/opt/couchbase/include" --disable-couchbasemock
shell> make install
```

The `--disable-couchbasemock` simply disables some tests which are common during
development of libcouchbase, but not required when installing a release.

<a id="c-install-windows"></a>

## Installing from Source: Microsoft Windows

Building and installing on Microsoft Windows depends on `nmake` and tools in
Microsoft Visual Studio 2010.

Open the Visual Studio Command Prompt, and navigate to the directory for the
extracted archive for libvbucket. The NMakefile defines an `INSTALL` variable as
`C:\local`. Edit the NMakefile if you wish to change the installation location.
Then build and install libvbucket:


```
shell> nmake -f NMakefile install
```

Because it uses memcached binary protocol, libcouchbase requires header files
from the memcached project. After obtaining the memcached source, copy
`memcached.h` and `protocol_binary.h` into `c:\local\include\memcached`.

Then navigate to the directory for libcouchbase. Edit the NMakefile if you wish
to change the installation location, then build and install libcouchbase:


```
shell> nmake -f NMakefile install
```

<a id="installation_packages_linux_rh"></a>

## Installing on CentOS/ReHat

Installation on CentOS/RedHat Linux consists of adding a set of RPMs.

<a id="linux_rh_pkginst"></a>


```

```

<a id="installation_packages_linux_ubu"></a>

## Installing on Ubuntu

Installation on Ubuntu Linux consists of adding a set of.deb packages. After
downloading the packages, simply add the packages with the `dpkg` command. There
is a dependent order between the packages, as `libcouchbase` depends on
`libvbucket`.

Also, note that as is common with Ubuntu packaging, the library is broken up
into three separate pieces. One is the library itself. The next is the `-dev`
package which contains header files needed during development. The final package
contains the debug symbols, which may be useful when using a debugger during
development.

The most basic of installs is just a matter of installing `libvbucket1` and
`libcouchbase` with its header files and debug symbols.

<a id="linux_deb_pkginst"></a>


```
shell> sudo dpkg -i libvbucket1-1_amd64.deb
shell> sudo dpkg -i libcouchbase1-1_amd64.deb
shell> sudo dpkg -i libcouchbase-dev-1_amd64.deb
shell> sudo dpkg -i libcouchbase1-dbg-1_amd64.deb
```

<a id="hello_couchbase-c-sdk"></a>

## Hello C Couchbase

This chapter will get you started with Couchbase Server and the Couchbase C SDK,
`libcouchbase`.

This section assumes you have downloaded and set up a compatible version of
Couchbase Server and have at least one instance of Couchbase Server and one data
bucket established. If you need to set up these items, you can do with the
Couchbase Administrative Console, or Couchbase Command-Line Interface (CLI), or
the Couchbase REST-API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

After you have your Couchbase Server set up and you have installed the needed
client libraries, you can compile and run the following basic program.


```
/* -*- Mode: C; tab-width: 4; c-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
 *     Copyright 2012 Couchbase, Inc.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/**
 * Example "hello Couchbase" libcouchbase program.
 *
 * @author Matt Ingenthron
 */

#include <getopt.h>
#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

#include <libcouchbase/couchbase.h>

/* the callback invoked by the library when receiving an error */
static void error_callback(libcouchbase_t instance,
                           libcouchbase_error_t error,
                           const char *errinfo)
{
    (void)instance;
    fprintf(stderr, "Error %d", error);
    if (errinfo) {
        fprintf(stderr, ": %s", errinfo);
    }
    fprintf(stderr, "\n");
    exit(EXIT_FAILURE);
}

/* the callback invoked by the library when receiving a get response */
static void get_callback(libcouchbase_t instance,
                         const void *cookie,
                         libcouchbase_error_t error,
                         const void *key, size_t nkey,
                         const void *bytes, size_t nbytes,
                         uint32_t flags, uint64_t cas)
{
    (void)instance; (void)cookie; (void)cas;
    fwrite(bytes, 1, nbytes, stdout);
    fprintf(stdout, "\n");
    fflush(stdout);
    fprintf(stderr, "Get callback received\n");
}


int main(int argc, char **argv)
{
    libcouchbase_t instance;    /* our libcouchbase instance */
    libcouchbase_error_t oprc;  /* for checking various responses */

    const char *host = "localhost:8091";
    const char *username = NULL;
    const char *passwd = NULL;
    const char *bucket = "default";

    instance = libcouchbase_create(host, username,
                                   passwd, bucket, NULL);
    if (instance == NULL) {
        fprintf(stderr, "Failed to create libcouchbase instance\n");
        return 1;
    }

    (void)libcouchbase_set_error_callback(instance, error_callback);
    (void)libcouchbase_set_get_callback(instance, get_callback);

    if (libcouchbase_connect(instance) != LIBCOUCHBASE_SUCCESS) {
        fprintf(stderr, "Failed to connect libcouchbase instance to server\n");
        return 1;
    }

    /* Wait for the connect to compelete */
    libcouchbase_wait(instance);

    /* A simple document we want to create */
    char *key = "hello";
    char *doc = "{ \"message\": \"world\" }";

    /* Store doc to in the system */
    oprc = libcouchbase_store(instance,
                              NULL,
                              LIBCOUCHBASE_SET,
                              key, /* the key or _id of the document */
                              strlen(key), /* the key length */
                              doc,
                              strlen(doc), /* length of */
                              0,  /* flags,  */
                              0,  /* expiration */
                              0); /* and CAS values, see API reference */

    if (oprc != LIBCOUCHBASE_SUCCESS) {
        fprintf(stderr, "Failed to create hello store operation.\n");
        return 1;
    }

    /* Wait for the operation to compelete */
    libcouchbase_wait(instance);

    oprc = libcouchbase_get_last_error(instance);
    if (oprc == LIBCOUCHBASE_SUCCESS) {
        fprintf(stderr, "Successfully set hello.\n");
    } else {
        fprintf(stderr, "Could not set hello.  Error received is %d\n", oprc);
        return 1;
    }

    /* Now go and get "hello" */
    const char* keys[1];
    size_t nkey[1];
    keys[0] = key;
    nkey[0] = strlen(key);
    oprc = libcouchbase_mget(instance,
                             NULL,
                             1,
                             (const void*const*)keys,
                             nkey,
                             NULL);

    if (oprc != LIBCOUCHBASE_SUCCESS) {
        fprintf(stderr, "Failed to create hello mget operation.\n");
        return 1;
    }

    /* Wait for the operation to compelete */
    libcouchbase_wait(instance);

    return 0;
}
```

<a id="tutorial"></a>
