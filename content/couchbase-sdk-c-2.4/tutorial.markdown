# Tutorial

This tutorial assumes you have installed libcouchbase on your systems per the
installation instructions in the Getting Started section of this guide. Because
the approach for building a program based on libcouchbase may vary between
Linux/Mac OS and Windows, this tutorial will focus on the components of the
program rather than how to build it.

If you need to set up a server node or data bucket, you can do so with Couchbase
Administrative Console, Couchbase Command-Line Interface (CLI), or Couchbase
REST API. For information and instructions, see:

 * [Using the Couchbase Web
   Console](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-introduction.html),
   for information on using the Couchbase Administrative Console,

 * [Couchbase
   CLI](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-web-console.html),
   for the command line interface,

 * [Couchbase REST
   API](http://www.couchbase.com/docs/couchbase-manual-1.8/couchbase-admin-restapi.html),
   for creating and managing Couchbase resources.

After you've set up your Couchbase Server and installed the needed client
libraries, you can compile and run the following basic program.

<a id="simple_example"></a>

## Simple Example

Before getting into a more complex example of the programming model to this
library, we will walk through a straightforward example of a program which
builds with libcouchbase, connects to a server, and sets and gets a value:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libcouchbase/couchbase.h>

static void die(const char *msg, lcb_error_t err)
{
	fprintf(stderr, "Got error %s. Code=0x%x, %s\n",
			msg, err, lcb_strerror(NULL, err));
	exit(EXIT_FAILURE);
}

static void get_callback(
	lcb_t instance,
	const void *cookie,
	lcb_error_t err,
	const lcb_get_resp_t *resp
);

static const char *key = "My Key";
static const char *value = "My Value";

int main(void)
{
	lcb_t instance;
	lcb_error_t err;
	lcb_store_cmd_t s_cmd = { 0 }, *s_cmdlist = &s_cmd;
	lcb_get_cmd_t g_cmd = { 0 }, *g_cmdlist = &g_cmd;
	char scratch[4096];

	err = lcb_create(&instance, NULL);
	if (err != LCB_SUCCESS) {
		die("Couldn't create instance", err);
	}

	lcb_set_get_callback(instance, get_callback);
	err = lcb_connect(instance);
	if (err != LCB_SUCCESS) {
		die("Couldn't schedule connection", err);
	}
	lcb_wait(instance);

	s_cmd.v.v0.key = key;
	s_cmd.v.v0.nkey = strlen(key);
	s_cmd.v.v0.bytes = value;
	s_cmd.v.v0.nbytes = strlen(value);
	s_cmd.v.v0.operation = LCB_SET;

	err = lcb_store(instance, NULL, 1,
			(const lcb_store_cmd_t * const *)&s_cmdlist);

	if (err != LCB_SUCCESS) {
		die("Couldn't schedule store operation!", err);
	}
	lcb_wait(instance);

	g_cmd.v.v0.key = s_cmd.v.v0.key;
	g_cmd.v.v0.nkey = s_cmd.v.v0.nkey;
	err = lcb_get(instance, scratch, 1,
			(const lcb_get_cmd_t * const *)&g_cmdlist);
	if (err != LCB_SUCCESS) {
		die("Couldn't schedule get operation!", err);
	}
	lcb_wait(instance);

	/**
	 * Inside the get callback we've copied over the value data from the
	 * callback into the scratch buffer which we passed as a cookie
	 */
	{
		char reversed[4096];
		int ii;
		int curlen = strlen(scratch);
		curlen--;
		for (ii = curlen; ii >= 0; ii--) {
			reversed[curlen-ii] = scratch[ii];
		}
		s_cmd.v.v0.bytes = reversed;
		s_cmd.v.v0.operation = LCB_APPEND;
		/** Since it's reversed there's no need to re-set the size again */
		err = lcb_store(instance, NULL, 1,
				(const lcb_store_cmd_t * const *)&s_cmdlist);
		if (err != LCB_SUCCESS) {
			die("Couldn't schedule second APPEND", err);
		}
		lcb_wait(instance);
	}
	/** Now get the key back again */
	err = lcb_get(instance, scratch, 1,
			(const lcb_get_cmd_t * const *)&g_cmdlist);
	if (err != LCB_SUCCESS) {
		die("Could not schedule final get operation", err);
	}
	lcb_wait(instance);
	printf("Buffer in server is now %s\n", scratch);
	lcb_destroy(instance);
}

static void get_callback(
	lcb_t instance,
	const void *cookie,
	lcb_error_t err,
	const lcb_get_resp_t *resp)
{
	char *target = (char *)cookie;
	if (err != LCB_SUCCESS) {
		die("Got error inside get callback", err);
	}
	memcpy(target, resp->v.v0.bytes, resp->v.v0.nbytes);
	target[resp->v.v0.nbytes] = '\0';
}
```



<a id="additional_resources"></a>

## Additional Resources

In addition to the other sections of this manual, such as the Getting Started
guide and the API reference, the libcouchbase package includes an examples
directory and a tools directory. Each of these show simple Couchbase tools and
an example libcouchbase programs.

<a id="tutorial_integration"></a>
