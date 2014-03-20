# Packages for the .NET Client Library

The following sections provide details about the various Couchbase packages
available on NuGet and via direct download.

The official Client Library and associated loggers are both available as .NET 3.5
and .NET 4.0 builds. When you download the zip file, there are directories for
each framework version. The NuGet package contains both 3.5 and 4.0 binaries.

 * `CouchbaseNetClient` Contains the latest `Couchbase` and `Enyim.Caching`
   assemblies. `Newtonsoft.Json` is a dependency.

 * `CouchbaseNLogAdapter` Contains the latest `NLog` logging adapter, built against
   the Couchbase fork of `Enyim.Caching`. Installing the `EnyimMemcached-NLog`
   package will lead to a build conflict in your project. `CouchbaseNetClient` and
   `NLog` are dependencies.

 * `CouchbaseLog4NetAdapter` Contains the latest `log4net` logging adapter, built
   against the Couchbase fork of `Enyim.Caching`. Installing the
   `EnyimMemcached-log4net` package will lead to a build conflict in your project.
   `CouchbaseNetClient` and `log4net` are dependencies.

 * `CouchbaseHttpClients` Contains the latest `RestSharp` and `Hammock` view HTTP
   clients. These clients are legacy. The latest `CouchbaseClient` uses the BCL
   `WebClient`. `CouchbaseNetClient`, `RestSharp`, and `Hammock` are dependencies.
   These assemblies are unsigned, due to the NuGet package for `RestSharp` being
   unsigned.

Several integration packages are also available via NuGet.

 * `Couchbase ASP.NET SessionState and OutputCache Providers` allows Couchbase to
   be used as an out of process session state provider, and output caching
   provider.

 * `CouchbaseElmahErrorLog` allows ELMAH error logs to be stored in Couchbase.

 * `CouchbaseSnippets` adds some basic Visual Studio snippets.

 * `CouchbaseNHibernateCache` allows Couchbase to be used as an NHibernate second
   level cache.

 * `Couchbase Model Views` allows classes to be decorated with attributes used to
   create simple, and complex views without writing map functions.

   `Glimpse for Couchbase` allows `CouchbaseClient` logs to be viewable via a
   Glimpse tab.

If not using NuGet, the lastest binaries are available as a direct download at
[](https://www.couchbase.com/develop/net/current/). The download package
contains the `CouchbaseClient`, and `Enyim.Caching` assemblies. The
`Newtonsoft.Json`, `NLog`, and `log4net` dependencies are also included.

<a id="couchbase-sdk-net-rn"></a>
