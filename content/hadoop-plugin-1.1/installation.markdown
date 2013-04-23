# Installation

The installation process for the Couchbase Sqoop plugin is simple. When you
download the plugin from Cloudera you should find a set of files that need to be
moved into you Sqoop installation. These files along with a short description of
why they are needed are listed below.

 * couchbase-hadoop-plugin-1.0.jar — This is the jar file that contains all of the
   source code that makes Sqoop read data from Couchbase.

 * couchbase-config.xml — This is a property file used to register a ManagerFactory
   for the Couchbase plugin with Sqoop.

 * couchbase-manager.xml — This property file tells Sqoop what jar the
   ManagerFactory defined in couchsqoop-config.xml resides.

 * spymemcached-2.8-preview3.jar — This is the client jar used by our plugin to
   read and write data from Couchbase.

 * jettison-1.1.jar - This is a dependency of memcached-2.7.jar.

 * netty-3.1.5GA.jar - This is a dependency of memcached-2.7.jar.

 * install.sh — A script to automatically install the Couchbase plugin files to
   Sqoop.

<a id="hadoop-plugin-installation-auto"></a>

## Automatic Installation

Automatic installation is done through the use of the install.sh script that
comes with the plugin download. The script takes one argument, the path to your
Sqoop installation. Below is an example of how to use the script.


```
shell> ./install.sh path_to_sqoop_home
```

<a id="hadoop-plugin-installation-manual"></a>

## Manual Installation

Manual installation of the Couchbase plugin requires copying the files
downloaded from Cloudera into your Sqoop installation. Below are a list of files
that contained in the plugin and the name of the directory in your Sqoop
installation to copy each file to.

 * couchbase-hadoop-plugin-1.0.jar — lib

 * spymemcached-2.8.jar — lib

 * jettison-1.1.jar — lib

 * netty-3.1.5GA.jar — lib

 * couchbase-config.xml — conf

 * couchbase-manager.xml — conf/managers.d

<a id="hadoop-plugin-uninstall"></a>

## Uninstall

Uninstallation of the plugin requires removal of all of the files that were
added to Sqoop during installation. To do this cd into your Sqoop home directory
and execute the following command:


```
shell> rm lib/couchbase-hadoop-plugin-1.0.jar lib/spymemcached-2.8.jar \
    lib/jettison-1.1.jar lib/netty-3.1.5GA.jar \
    conf/couchbase-config.xml conf/managers.d/couchbase-manager.xml
```

<a id="hadoop-plugin-sqoop"></a>
