Couchbase Server 3.0.0 BETA, Ubuntu and CentOS

Couchbase Server is a distributed NoSQL document database for interactive applications. 
Its scale-out architecture runs in the cloud or on commodity hardware and provides a 
flexible data model, consistent high-performance, easy scalability and always-on 
24x365 availability.

This release contains major enhancements and bug fixes. 
For more information, see the Couchbase Server Release Notes.


REQUIREMENTS

- For Ubuntu and CentOS platforms, there is an OpenSSL dependency. 
- As of Couchbase Server 2.2, new packages were provided that supports 
  OpenSSL 1.0.x for Ubuntu and CentOS.

- For CentOS, if the new package is installed with OpenSSL 1.0.x, 
  also install pkg-config:

  root-shell> yum install –y pkg-config

INSTALL

Instructions: 

- Centos: See the 2.5 documentation:  
  http://docs.couchbase.com/couchbase-manual-2.5/cb-install/#red-hat-linux-installation

- Ubuntu: See the 2.5 documentation: 
  http://docs.couchbase.com/couchbase-manual-2.5/cb-install/#ubuntu-linux-installation

- By default, Couchbase Server is installed at: /opt/couchbase

- The server automatically starts after installation and is available on 
  port 8091 (default).

ADDITIONAL

For a full list of network ports for Couchbase Server, see the 2.5 documentation: 
  http://docs.couchbase.com/couchbase-manual-2.5/cb-install/#network-ports

To read more about Couchbase Server best practices, see the 2.5 documentation: 
  http://docs.couchbase.com/couchbase-manual-2.5/cb-admin/#best-practices

