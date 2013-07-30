# Appendix: Limits

Couchbase Server has a number of limits and limitations that may affect your use
of Couchbase Server.

<a id="table-couchbase-server-limits"></a>

Limit                   | Value                               
------------------------|-------------------------------------
Max key length          | 250 bytes                           
Max value size          | 20 Mbytes                           
Max data size           | none                                
Max metadata            | Approximately 150 bytes per document
Max Recommended Buckets | 10                                  

<a id="couchbase-server-limits-limitations"></a>

## Known Limitations

The following list provides a summary of the known limitations within Couchbase
Server 1.8.

 * Amazon "micro" and "small" instances are not supported.

   *Workaround* : It is a best practice to use at least "large" instances to
   provide enough RAM for Couchbase to run.

   *Issues* : [MB-3911](http://www.couchbase.com/issues/browse/MB-3911)

 * Couchbase Server fails to run on Windows system with PGP (http://www.pgp.com)
   installed.

   *Workaround* : Uninstall PGP on any systems running Couchbase.

   *Issues* : [MB-3688](http://www.couchbase.com/issues/browse/MB-3688)

 * Network Filesystems (CIFS/NFS) are not supported for data file storage.
   Block-based storage (iSCSI, EBS, etc) work correctly.

   *Issues* : [MB-3333](http://www.couchbase.com/issues/browse/MB-3333)

 * Unsynchronized clocks can lead to UI not displaying graphs.

   *Workaround* : Make sure all the clocks (and their timezones) are synchronized
   in a Couchbase cluster. Use NTP or some other synchronization technology.

   *Issues* : [MB-2833](http://www.couchbase.com/issues/browse/MB-2833)

 * Rebooting a node that re-enables the firewall service on that node will mark all
   the vBuckets on the node as dead and unavailable.

   *Issues* : [MB-5282](http://www.couchbase.com/issues/browse/MB-5282)

<a id="licenses"></a>
