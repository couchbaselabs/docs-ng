# Tutorial

This tutorial assumes you have installed libcouchbase on your systems per the
installation instructions in the Getting Started section of this guide. Because
the method of building a program based on libcouchbase may vary between
Linux/Mac OS and Windows, this tutorial will focus on the components of the
program rather than how to build it.

If you need to set up a server node or data bucket, you can do with the
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

<a id="simple_example"></a>

## Simple Example

Before getting into a more complex example of the programming model to this
library, we will walk through simple, straightforward example of a program which
builds with libcouchbase, connects to a server, sets and gets a value:


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

/*
 * BUILD:
 *
 *      cc -o minimal minimal.c -lcouchbase
 *      cl /DWIN32 /Iinclude minimal.c lib\libcouchbase.lib
 *
 * RUN:
 *
 *      valgrind -v --tool=memcheck  --leak-check=full --show-reachable=yes ./minimal
 *      ./minimal <host:port> <bucket> <passwd>
 *      mininal.exe <host:port> <bucket> <passwd>
 */
#include <stdio.h>
#include <libcouchbase/couchbase.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#ifdef _WIN32
#define PRIu64 "I64u"
#else
#include <inttypes.h>
#endif

static void error_callback(lcb_t instance, lcb_error_t error, const char *errinfo)
{
    fprintf(stderr, "ERROR: %s (0x%x), %s\n",
            lcb_strerror(instance, error), error, errinfo);
    exit(EXIT_FAILURE);
}

static void store_callback(lcb_t instance, const void *cookie,
                           lcb_storage_t operation,
                           lcb_error_t error,
                           const lcb_store_resp_t *item)
{
    if (error == LCB_SUCCESS) {
        fprintf(stderr, "STORED \"");
        fwrite(item->v.v0.key, sizeof(char), item->v.v0.nkey, stderr);
        fprintf(stderr, "\" CAS: %"PRIu64"\n", item->v.v0.cas);
    } else {
        fprintf(stderr, "STORE ERROR: %s (0x%x)\n",
                lcb_strerror(instance, error), error);
        exit(EXIT_FAILURE);
    }
    (void)cookie;
    (void)operation;
}

static void get_callback(lcb_t instance, const void *cookie, lcb_error_t error,
                         const lcb_get_resp_t *item)
{
    if (error == LCB_SUCCESS) {
        fprintf(stderr, "GOT \"");
        fwrite(item->v.v0.key, sizeof(char), item->v.v0.nkey, stderr);
        fprintf(stderr, "\" CAS: %"PRIu64" FLAGS:0x%x SIZE:%lu\n",
                item->v.v0.cas, item->v.v0.flags, (unsigned long)item->v.v0.nbytes);
        fwrite(item->v.v0.bytes, sizeof(char), item->v.v0.nbytes, stderr);
        fprintf(stderr, "\n");
    } else {
        fprintf(stderr, "GET ERROR: %s (0x%x)\n",
                lcb_strerror(instance, error), error);
    }
    (void)cookie;
}

int main(int argc, char *argv[])
{
    lcb_error_t err;
    lcb_t instance;
    struct lcb_create_st create_options;
    struct lcb_create_io_ops_st io_opts;

    io_opts.version = 0;
    io_opts.v.v0.type = LCB_IO_OPS_DEFAULT;
    io_opts.v.v0.cookie = NULL;

    memset(&create_options, 0, sizeof(create_options));
    err = lcb_create_io_ops(&create_options.v.v0.io, &io_opts);
    if (err != LCB_SUCCESS) {
        fprintf(stderr, "Failed to create IO instance: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }

    if (argc > 1) {
        create_options.v.v0.host = argv[1];
    }
    if (argc > 2) {
        create_options.v.v0.user = argv[2];
        create_options.v.v0.bucket = argv[2];
    }
    if (argc > 3) {
        create_options.v.v0.passwd = argv[3];
    }
    err = lcb_create(&instance, &create_options);
    if (err != LCB_SUCCESS) {
        fprintf(stderr, "Failed to create libcouchbase instance: %s\n",
                lcb_strerror(NULL, err));
        return 1;
    }
    (void)lcb_set_error_callback(instance, error_callback);
    /* Initiate the connect sequence in libcouchbase */
    if ((err = lcb_connect(instance)) != LCB_SUCCESS) {
        fprintf(stderr, "Failed to initiate connect: %s\n",
                lcb_strerror(NULL, err));
        lcb_destroy(instance);
        return 1;
    }
    (void)lcb_set_get_callback(instance, get_callback);
    (void)lcb_set_store_callback(instance, store_callback);
    /* Run the event loop and wait until we've connected */
    lcb_wait(instance);
    {
        lcb_store_cmd_t cmd;
        const lcb_store_cmd_t *commands[1];

        commands[0] = &cmd;
        memset(&cmd, 0, sizeof(cmd));
        cmd.v.v0.operation = LCB_SET;
        cmd.v.v0.key = "foo";
        cmd.v.v0.nkey = 3;
        cmd.v.v0.bytes = "bar";
        cmd.v.v0.nbytes = 3;
        err = lcb_store(instance, NULL, 1, commands);
        if (err != LCB_SUCCESS) {
            fprintf(stderr, "Failed to set: %s\n", lcb_strerror(NULL, err));
            return 1;
        }
    }
    lcb_wait(instance);
    {
        lcb_get_cmd_t cmd;
        const lcb_get_cmd_t *commands[1];
        commands[0] = &cmd;
        memset(&cmd, 0, sizeof(cmd));
        cmd.v.v0.key = "foo";
        cmd.v.v0.nkey = 3;
        err = lcb_get(instance, NULL, 1, commands);
        if (err != LCB_SUCCESS) {
            fprintf(stderr, "Failed to get: %s\n", lcb_strerror(NULL, err));
            return 1;
        }
    }
    lcb_wait(instance);
    lcb_destroy(instance);

    return 0;
}
```



<a id="additional_resources"></a>

## Additional Resources

In addition to the other sections of this manual, namely the Getting Started
guide and the API reference, a libcouchbase distribution includes an examples
directory and a tools directory, each of which show simple Couchbase tools and
and example libcouchbase programs.

On Linux you may find these examples in TODO...

<a id="tutorial_integration"></a>
