# Contributing

The Sync Gateway code is available on GitHub: <https://github.com/couchbase/sync_gateway>.

## Building From Source

To build Sync Gateway from source, you must have [Go](http://golang.org) 1.1 or later installed on your computer. 

On Mac or Unix systems, you can build Sync Gateway from source as follows:

1. Open a terminal window and change to the directory that you want to store Sync Gateway in.

2. Clone the Sync Gateway GitHub repository:

		$ git clone https://github.com/couchbase/sync_gateway.git

3. Change to the **sync_gateway** directory:

		$ cd sync_gateway

4. Set up the submodules:

		$ git submodule init
		$ git submodule update

5. Build Sync Gateway:

		$ ./build.sh

Sync Gateway is a standalone, native executable located in the **./bin** directory. You can run the executable from the build location or move it anywhere you want.

To update your build later, pull the latest updates from GitHub, update the submodules, and run `./build.sh` again.

