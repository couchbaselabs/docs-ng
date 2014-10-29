#Introduction

This guide provides information for developers who want to use the Couchbase C SDK to build applications that use Couchbase Server.

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

<a id="downloading"></a>

## Downloading the Couchbase Client Library

Download the latest client library from the [Couchbase download
site](http://www.couchbase.com/downloads). It is available as a source
archive in both `.zip` and `.tar.gz`

<a id="c-install-linux"></a>

## Installing on Linux using Packages

Packages are provided for RedHat and Ubuntu Linux systems by seeding your
package manager with the Couchbase repo information. The method for installation
this way is dependent on your platform:

<a id="c-install-linux-redhat"></a>

### RedHat/CentOS

You must seed RPM with a new source, which is depedendent on your RedHat
version:

 * **RHEL/CentOS 5.5**

    ```
    shell> sudo wget -O/etc/yum.repos.d/couchbase.repo \
              http://packages.couchbase.com/rpm/couchbase-centos55-i386.repo
    shell> sudo wget -O/etc/yum.repos.d/couchbase.repo \
              http://packages.couchbase.com/rpm/couchbase-centos55-x86_64.repo
    ```

 * **RHEL/CentOS 6.2**

    ```
    shell> sudo wget -O/etc/yum.repos.d/couchbase.repo \
              http://packages.couchbase.com/rpm/couchbase-centos62-i686.repo
    shell> sudo wget -O/etc/yum.repos.d/couchbase.repo \
              http://packages.couchbase.com/rpm/couchbase-centos62-x86_64.repo
    ```

Then to install libcouchbase itself, run:


```
shell> sudo yum check-update
shell> sudo yum install -y  libcouchbase2 libcouchbase-devel
```

<a id="c-install-linux-ubuntu"></a>

### Ubuntu

You must update the `apt-get` repository:

 * **Ubuntu 12.04 Precise Pangolin (Debian unstable)**

   Also compatible with recent versions, which have `libevent2`.

    ```
    shell> sudo wget -O/etc/apt/sources.list.d/couchbase.list \
              http://packages.couchbase.com/ubuntu/couchbase-ubuntu1204.list
    ```

 * **Ubuntu 11.10 Oneiric Ocelot (Debian unstable)**

   Also compatible with recent versions, which have `libevent2`.

    ```
    shell> sudo wget -O/etc/apt/sources.list.d/couchbase.list \
              http://packages.couchbase.com/ubuntu/couchbase-ubuntu1110.list
    ```

 * **Ubuntu 10.04 Lucid Lynx (Debian stable or testing)**

    ```
    shell> sudo wget -O/etc/apt/sources.list.d/couchbase.list \
              http://packages.couchbase.com/ubuntu/couchbase-ubuntu1004.list
    ```

Also make sure you have the GPG key installed:


```
shell> wget -O- http://packages.couchbase.com/ubuntu/couchbase.key | sudo apt-key add -
```

Then to install libcouchbase itself run:


```
shell> sudo apt-get update
shell> sudo apt-get install libcouchbase2 libcouchbase-dev
```

<a id="c-install-mac"></a>

## Installing using packages on Mac OS X

This client library is available via a homebrew recipe. After installing
homebrew, to install libcouchbase:


```
shell> brew install \
          https://github.com/couchbase/homebrew/raw/stable/Library/Formula/libcouchbase.rb
```

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

<a id="hello_couchbase-c-sdk"></a>

## Hello C Couchbase

The C client library, `libcouchbase`, is a callback oriented client which makes
it very easy to write high performance programs. There are a few ways you can
drive IO with the library. The simplest is to use the synchronous interface over
the asynch internals of the library. More advanced programs will want to either
call the `libcouchbase_wait()` function after generating some operations, or
drive the event loop themselves.

To connect, you must configure the connection options and then create an
instance of the connection to the cluster:


```
struct lcb_create_st create_options;
lcb_t instance;
lcb_error_t err;

memset(&create_options, 0, sizeof(create_options));
create_options.v.v0.host = "myserver:8091";
create_options.v.v0.user = "mybucket";
create_options.v.v0.passwd = "secret";
create_options.v.v0.bucket = "mybucket";

err = lcb_create(&instance, &create_options);
if (err != LCB_SUCCESS) {
    fprintf(stderr, "Failed to create libcouchbase instance: %s\n",
            lcb_strerror(NULL, err));
    return 1;
}

/* Set up the handler to catch all errors! */
lcb_set_error_callback(instance, error_callback);

/*
 * Initiate the connect sequence in libcouchbase
 */
if ((err = lcb_connect(instance)) != LCB_SUCCESS) {
    fprintf(stderr, "Failed to initiate connect: %s\n",
            lcb_strerror(NULL, err));
    return 1;
}

/* Run the event loop and wait until we've connected */
lcb_wait(instance);
```

Callbacks are used by the library and are simple functions to handle the result
of operations. For example:


```
struct lcb_create_st create_options;
lcb_t instance;
lcb_error_t err;

memset(&create_options, 0, sizeof(create_options));
create_options.v.v0.host = "myserver:8091";
create_options.v.v0.user = "mybucket";
create_options.v.v0.passwd = "secret";
create_options.v.v0.bucket = "mybucket";

err = lcb_create(&instance, &create_options);
if (err != LCB_SUCCESS) {
    fprintf(stderr, "Failed to create libcouchbase instance: %s\n",
            lcb_strerror(NULL, err));
    return 1;
}

/* Set up the handler to catch all errors! */
lcb_set_error_callback(instance, error_callback);

/*
 * Initiate the connect sequence in libcouchbase
 */
if ((err = lcb_connect(instance)) != LCB_SUCCESS) {
    fprintf(stderr, "Failed to initiate connect: %s\n",
            lcb_strerror(NULL, err));
    return 1;
}

/* Run the event loop and wait until we've connected */
lcb_wait(instance);
```

Callbacks can be set up for all of your operations called in libcouchbase. In
the API, you'll note the use of a "cookie". This is opaque data from your
application which is associated with the request. Underlying libcouchbase will
not inspect the field, or send it to the server.

Putting the connect logic and the get callback all together into a complete
program with the include headers would be:


```
#include <libcouchbase/couchbase.h>
#include <stdlib.h>
#include <stdio.h>

static void error_callback(lcb_t instance,
                           lcb_error_t err,
                           const char *errinfo)
{
    fprintf(stderr, "Error %s: %s", lcb_strerror(instance, err),
            errinfo ? errinfo : "");
    exit(EXIT_FAILURE);
}

static void get_callback(lcb_t instance,
                         const void *cookie,
                         lcb_error_t error,
                         const lcb_get_resp_t *resp)
{
    if (error != LCB_SUCCESS) {
        fprintf(stderr, "Failed to retrieve \"");
        fwrite(resp->v.v0.key, 1, resp->v.v0.nkey, stderr);
        fprintf(stderr, "\": %s\n", lcb_strerror(instance, error));
    } else {
        fprintf(stderr, "Data for key: \"");
        fwrite(resp->v.v0.key, 1, resp->v.v0.nkey, stderr);
        fprintf(stderr, "\" is : ");
        fwrite(resp->v.v0.bytes, 1, resp->v.v0.nbytes, stderr);
    }
}

int main(void)
{
    struct lcb_create_st create_options;
    lcb_t instance;
    lcb_error_t err;

    memset(&create_options, 0, sizeof(create_options));
    create_options.v.v0.host = "myserver:8091";
    create_options.v.v0.user = "mybucket";
    create_options.v.v0.passwd = "secret";
    create_options.v.v0.bucket = "mybucket";

    err = lcb_create(&instance, &create_options);
    if (err != LCB_SUCCESS) {
        fprintf(stderr, "Failed to create libcouchbase instance: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }

    /* Set up the handler to catch all errors! */
    lcb_set_error_callback(instance, error_callback);

    /*
     * Initiate the connect sequence in libcouchbase
     */
    if ((err = lcb_connect(instance)) != LCB_SUCCESS) {
        fprintf(stderr, "Failed to initiate connect: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }

    /* Run the event loop and wait until we've connected */
    lcb_wait(instance);

    /*
     * Set up a callback for our get requests
     */
    lcb_set_get_callback(instance, get_callback);

    lcb_get_cmd_t cmd;
    const lcb_get_cmd_t * const commands[1] = { &cmd };
    memset(&cmd, 0, sizeof(cmd));
    cmd.v.v0.key = "foo";
    cmd.v.v0.nkey = 3;

    err = lcb_get(instance, NULL, 1, commands);
    if (err != LCB_SUCCESS) {
        fprintf(stderr, "Failed to get: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }

    lcb_wait(instance);

    lcb_destroy(instance);
    exit(EXIT_SUCCESS);
}
```

To compile this sample program, you must link to `libcouchbase` :


```
shell> gcc -o hellocb -lcouchbase hellocb.c
```

<a id="tutorial"></a>
