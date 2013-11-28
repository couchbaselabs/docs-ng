# Release Notes #

The following sections provide release notes for individual versions of Couchbase Query Language (N1QL).

## Release Notes for Couchbase Query Language Developer Preview 2 (November 2013) ##
This is the second developer preview edition of Couchbase Query Language

**New features in DP2:**

* Introducing date/time features in this release. Specifically two new functions DATE_PART and NOW_STR have been added. We will likely expand capabilities in this area in subsequent releases.
* Performance Improvements: Better use of indexes. These are internal improvements in the engine, for example, queries covered by index can eliminate the Fetch operator; find by id queries need not scan the index at all; MIN changed to use index.
* Minor syntax improvements – Example, AS keyword is now optional
* Stability – various bug fixes to help improve the stability of query engine

**Fixes in DP2:**

* Add initial date and time features
  
  *Issues*: [MB-9325](http://www.couchbase.com/issues/browse/MB-9325)
* Queries covered by index now avoid the FETCH operator
  
  *Issues*: [MB-9189](http://www.couchbase.com/issues/browse/MB-9189)
* Find by id queries now optimized to not scan an index at all
  
  *Issues*: [MB-9187](http://www.couchbase.com/issues/browse/MB-9187)
* Make AS keyword optional
  
  *Issues*: [MB-9138](http://www.couchbase.com/issues/browse/MB-9138)   
* MIN now optimized to use index
  
  *Issues*: [MB-9060](http://www.couchbase.com/issues/browse/MB-9060)
* DISTINCT behaved unexpectedly when used in combination with the GROUP BY clause. This is now fixed.
  
  *Issues*: [MB-9206](http://www.couchbase.com/issues/browse/MB-9206)
* Make IN optional in OVER..IN clauses
  
  *Issues*: [MB-9136](http://www.couchbase.com/issues/browse/MB-9136)
  
**Known Issues in DP2:**

This is a 'Developer Preview' and this release is **not** meant to be used in Production.

## Release Notes for Couchbase Query Language Developer Preview 1 (September 2013) ##

This is the first developer preview edition of Couchbase Query Language



