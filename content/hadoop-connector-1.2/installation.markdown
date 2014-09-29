# Installation

The installation process for the Couchbase Hadoop Connector is simple. When
you download the connector, you should find a set of files that need to be
moved into your Sqoop installation along with a script which will do this
for you if you provide the path to the sqoop installation. These files
along with a short description of why they are needed are listed below.

 * couchbase-hadoop-plugin-1.2.0-beta.jar — This jar file contains the Couchbase Hadoop Connector for sqoop itself.

 * couchbase-config.xml — This is a property file used to register a ManagerFactory
   for the Couchbase Hadoop Connector with sqoop.

 * couchbase-manager.xml — This property file tells sqoop in which jar the
   ManagerFactory defined in couchsqoop-config.xml resides.

 * couchbase-client-1.4.4.bundled.jar - This is a library dependency of the sqoop connector.  It handles the basic
   communications with the Couchbase Cluster.

 * spymemcached-2.11.4.jar — This is a library dependency of the Couchbase Client. It provides networking and core
   protocol handling for the transferring of data.

 * jettison-1.1.jar - This is a dependency of the Couchbase Client.

 * netty-3.5.5.Final.jar - This is a dependency of the Couchbase Client.

 * install.sh — A script to assist with the installation of the Couchbase Hadoop Connector.

<a id="hadoop-connector-installation-auto"></a>

## Script Based Installation

Script based installation is done through the use of the install.sh script
that comes with the connector download. The script takes one argument, the
path to your sqoop installation. For example:


```
shell> chmod 755 install.sh
shell> ./install.sh path_to_sqoop_home
```

<a id="hadoop-connector-installation-manual"></a>

## Manual Installation

Manual installation of the Couchbase connector requires copying the files
in the zip distribution into your sqoop installation. Below is a list of
files that contained in the connector and the name of the directory in your
Sqoop installation to copy each file to.

 * couchbase-hadoop-plugin-1.2.0-beta.jar — lib

 * spymemcached-2.11.4.jar — lib

 * jettison-1.1.jar — lib

 * netty-3.5.5.Final.jar — lib

 * couchbase-config.xml — conf

 * couchbase-manager.xml — conf/managers.d

<a id="hadoop-connector-uninstall"></a>

## Uninstall

Un-installation of the connector requires removal of all of the files that
were added to sqoop during installation. To do this cd into your sqoop home
directory and execute the following command:


```
shell> rm lib/couchbase-hadoop-plugin-1.2.0-beta.jar lib/spymemcached-2.11.4.jar \
    lib/jettison-1.1.jar lib/netty-3.5.5.Final.jar \
    conf/couchbase-config.xml conf/managers.d/couchbase-manager.xml
```
