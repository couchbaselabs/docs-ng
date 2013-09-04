# Contributing

The Sync Gateway code is available on GitHub: <https://github.com/couchbase/sync_gateway>.

## Building From Source

To build Sync Gateway from source, you must have [Go](http://golang.org) 1.1 or later installed on your computer. 

On Mac or Unix systems, you can build Sync Gateway from source as follows:

1. In a terminal window, clone the Sync Gateway GitHub repository:

	$ git clone https://github.com/couchbase/sync_gateway.git

2. Change to the **sync_gateway** directory:

	$ cd sync_gateway

3. Set up the submodules:

	$ git submodule init 
	$ git submodule update

4. Build Sync Gateway:

	$ ./build.sh


Sync Gateway is a standalone, native executable located in `/bin`. You can run the executable from the build location or move it anywhere you want.

To update your build later, just pull the latest updates from GitHub and run `./build.sh` again.

