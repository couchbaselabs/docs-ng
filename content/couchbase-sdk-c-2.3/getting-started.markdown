#Introduction

<div class="notebox warning">
<p>A newer version of this software is available</p>
<p>You are viewing the documentation for an older version of this software. To find the documentation for the current version, visit the <a href="http://docs.couchbase.com">Couchbase documentation home page</a>.</p>
</div>

This guide provides information for developers who want to use the Couchbase C SDK to build applications that use Couchbase Server.

# Getting Started

Now that you've installed Couchbase and have created a cluster of servers, you
need a client library to read and write data from the cluster. The Couchbase C
client library, also known as libcouchbase, can be used from your application to
access Couchbase Server.

Here's a quick outline of what you'll learn in this chapter:

 * Get the client library.

 * Build the client library from source (optional).

 * Write a simple program to connecting to Couchbase and save some data.

<a id="downloading"></a>

## Downloading the Couchbase Client Library

Download the latest client library from the [Couchbase download
site](http://www.couchbase.com/downloads). It is available as a source
archive in both `.zip` and `.tar.gz`

<a id="c-install-linux"></a>

## Installing on Linux using Packages

Packages are provided for RedHat and Ubuntu Linux systems by providing your
package manager with the Couchbase repository information. The method for
installation is dependent on your platform:

<a id="c-install-linux-redhat"></a>

### RedHat/CentOS

You must populate RPM with a new source, which is dependent on your RedHat
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

Then to install libcouchbase with libevent backend, run:


```
shell> sudo yum check-update
shell sudo yum install -y  libcouchbase2-libevent libcouchbase-devel
```

<a id="c-install-linux-ubuntu"></a>

### Ubuntu

You must update the `apt-get` repository to install the client library:

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

Then to install libcouchbase with libevent backend, run:


```
shell> sudo apt-get update
shell> sudo apt-get install libcouchbase2-libevent libcouchbase-dev
```

<a id="c-install-mac"></a>

## Installing using packages on Mac OS X

This client library is available via a [homebrew](http://brew.sh/) recipe. After
you install homebrew, install libcouchbase:


```
shell> brew update
shell> brew install libcouchbase
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
command. For additional information on configuration options, run./configure
with --help.

For libcouchbase, extract the archive, then cd into the directory and run:


```
shell> ./configure CPPFLAGS="-I/opt/couchbase/include" --disable-couchbasemock
shell> make install
```

The `--disable-couchbasemock` simply disables some tests which are common during
the development of libcouchbase, but not required when installing a release.

<a id="c-install-windows"></a>

## Installing from Source: Microsoft Windows


Spin up your visual studio shell and run cmake from there. It is best
practice that you make an out-of-tree build; thus like so:

Assuming Visual Studio 2010

```
C:\> git clone git://github.com/couchbase/libcouchbase.git
C:\> mkdir lcb-build
C:\> cd lcb-build
C:\> cmake -G "Visual Studio 10" ..\libcouchbase
C:\> msbuild /M libcouchbase.sln
```

This will generate and build a Visual Studio `.sln` file.

Windows builds are known to work on Visual Studio versions 2008, 2010 and
2012.

<a id="hello_couchbase-c-sdk"></a>

## Hello C Couchbase

The C client library, `libcouchbase`, is a callback-oriented client which makes
it very easy to write high performance programs. There are a few ways you can
drive IO with the library. The simplest approach is to use the synchronous
interface over the asynch internals of the library. More advanced programs will
either call the `libcouchbase_wait()` function after generating some operations
or drive the event loop themselves.

To connect, you first configure the connection options and then create an
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

Callbacks are used by the library and are simple functions which handle the
result of operations. For example:


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
the API, you'll note the use of a cookie. This is metadata from your application
which is associated with the request. The libcouchbase library will not inspect
any cookie or send the cookie to the server.

When you put the connect logic and the get callback together and plug them into
a complete program with the include headers, you get:


```
#include <libcouchbase/couchbase.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

static void error_callback(lcb_t instance,
                           lcb_error_t err,
                           const char *errinfo)
{
    fprintf(stderr, "Error %s: %s", lcb_strerror(instance, err),
            errinfo ? errinfo : "");
    exit(EXIT_FAILURE);
}

/* the callback invoked by the library when receiving a get response */
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
    (void)cookie; /* ignore */
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

    /* set up the handler to catch all errors */
    lcb_set_error_callback(instance, error_callback);

    /* initiate the connect sequence in libcouchbase */
    err = lcb_connect(instance);
    if (err != LCB_SUCCESS) {
        fprintf(stderr, "Failed to initiate connect: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }

    /* run the event loop and wait until we've connected */
    lcb_wait(instance);

    /* set up a callback for our get requests  */
    lcb_set_get_callback(instance, get_callback);

    {
        lcb_get_cmd_t cmd;
        const lcb_get_cmd_t *commands[1];

        commands[0] = &cmd;
        memset(&cmd, 0, sizeof(cmd));
        cmd.v.v0.key = "foo";
        cmd.v.v0.nkey = 3;

        err = lcb_get(instance, NULL, 1, commands);
        if (err != LCB_SUCCESS) {
            fprintf(stderr, "Failed to get: %s\n",
                    lcb_strerror(NULL, err));
            return 1;
        }
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
