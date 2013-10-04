# Appendix: Release Notes

The following sections provide release notes for individual release versions of
Couchbase Client Library.NET. To browse or submit new issaues, see [Couchbase
Client Library.NET Issues Tracker](http://www.couchbase.com/issues/browse/NCBC).

<a id="couchbase-sdk-net-rn_1-0-0"></a>

## Release Notes for Couchbase Client Library.NET 1.0.0 GA (23 January 2012)

**New Features and Behavior Changes in 1.0.0**

 * Also updated in 1.0, classes, namespaces and the assembly have been renamed from
   Membase to Couchbase to reflect the server product name change.

   What this means to you is that calling code will need to be updated and
   recompiled when referencing the new assembly.

   For example

    ```
    var config = new MembaseClientConfiguration();
    var client = new MembaseClient(config);
    ```

   is now

    ```
    var config = new CouchbaseClientConfiguration();
    var client = new CouchbaseClient(config);
    ```

   The app config section and config section handler also references Couchbase,
   instead of Membase.

    ```
    <configuration>
        <section name="membase" type="Membase.Configuration.MembaseClientSection, Membase"/>
    </configSections>
     <section name="membase" type="Membase.Configuration.MembaseClientSection, Membase"/>
    </configSections>
    <membase>...</membase>
    <startup>
    </configuration>
    ```

   is now

    ```
    <configuration>
        <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
    </configSections>
     <section name="couchbase" type="Couchbase.Configuration.CouchbaseClientSection, Couchbase"/>
    </configSections>
    <couchbase>...</couchbase>
    <startup>
    </configuration>
    ```

<a id="licenses"></a>
