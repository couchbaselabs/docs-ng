# Configuring Logging

The following sections provide details on how to enable logging for the .NET
Client Library

To enable logging, you can tap into the logging capabilities provided by the
Enyim.Caching dependency. Enyim logging currently supports either log4net or
NLog.

Start by adding a reference to either Enyim.Caching.Log4NetAdapter or
Enyim.Caching.NLogAdapter. Both are available as part of the part of the client
library zip file, or as separate NuGet packages.

To install via NuGet, look for either the CouchbaseLog4NetAdapter or
CouchbaseNLogAdapter package.

You could also get the projects from
[Github](https://github.com/couchbase/couchbase-net-client). If you use these Visual
Studio projects, you'll need NuGet installed, as dependencies to NLog and
log4Net are managed using NuGet.

For log4net, your configuration should include an enyim.com section that defines
which log factory to use along with standard log4net configuration.

The log4net configuration will vary by the type of appender you are using. For
more information on log4net configuration, see
[http://logging.apache.org/log4net/release/manual/configuration.html](http://logging.apache.org/log4net/release/manual/configuration.html).


```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="enyim.com">
      <section name="log" type="Enyim.Caching.Configuration.LoggerSection, Enyim.Caching" />
    </sectionGroup>
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
  </configSections>
  <enyim.com>
    <log factory="Enyim.Caching.Log4NetFactory, Enyim.Caching.Log4NetAdapter" />
  </enyim.com>
  <log4net debug="false">
    <appender name="LogFileAppender" type="log4net.Appender.FileAppender,log4net">
      <param name="File" value="c:\\temp\\error-log.txt" />
      <param name="AppendToFile" value="true" />
      <layout type="log4net.Layout.PatternLayout,log4net">
        <param name="ConversionPattern" value="%d [%t] %-5p %c [%x] &lt;%X{auth}&gt; - %m%n" />
      </layout>
    </appender>
    <root>
      <priority value="ALL" />
      <level value="DEBUG" />
      <appender-ref ref="LogFileAppender" />
    </root>
  </log4net>
</configuration>
```

You'll also need to initialize (only once in your app) log4net in your code with
the standard log4net initializer.


```
log4net.Config.XmlConfigurator.Configure();
```

NLog configuration requires setting the log factory to NLogAdapter and including
the appropriate NLog configuration section.


```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="enyim.com">
      <section name="log" type="Enyim.Caching.Configuration.LoggerSection, Enyim.Caching" />
    </sectionGroup>
    <section name="nlog" type="NLog.Config.ConfigSectionHandler, NLog" />
  </configSections>
  <enyim.com>
    <log factory="Enyim.Caching.NLogFactory, Enyim.Caching.NLogAdapter" />
  </enyim.com>
  <nlog>
    <targets>
      <target name="logfile" type="File" fileName="c:\temp\error-log.txt" />
    </targets>
    <rules>
      <logger name="*" minlevel="Info" writeTo="logfile" />
    </rules>
  </nlog>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0" />
  </startup>
</configuration>
```

See [http://nlog-project.org/wiki/Configuration_file](http://nlog-project.org/wiki/Configuration_file) for more NLog
configuration details.

<a id="couchbase-sdk-net-cluster-management"></a>
