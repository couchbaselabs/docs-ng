# Troubleshooting

This section provides troubleshooting tips.
<a id="net-sdk-bulk-load-and-backoff"></a>
## Bulk Load and Exponential Backoff

When you bulk load data to Couchbase Server, you can accidentally overwhelm
available memory in the Couchbase cluster before it can store data on disk. If
this happens, Couchbase Server will immediately send a response indicating the
operation cannot be handled at the moment but can be handled later.

This is sometimes referred to as "handling Temp OOM", where where OOM means out
of memory. Note though that the actual temporary failure could be sent back for
reasons other than OOM. However, temporary OOM is the most common underlying
cause for this error.

To handle this problem, you could perform an exponential backoff as part of your
bulk load. The backoff essentially reduces the number of requests sent to
Couchbase Server as it receives OOM errors:


```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Couchbase;
using Couchbase.Configuration;
using Enyim.Caching.Memcached.Results;
using Enyim.Caching.Memcached;
using System.Threading;

namespace BulkLoader
{
    public class StoreHandler
    {
        CouchbaseClient _cbc;

        public StoreHandler(IList<Uri> uris, string bucketName, string bucketPassword)
        {
            var config = new CouchbaseClientConfiguration();
            foreach (var uri in uris)
            {
                config.Urls.Add(uri);
            }
            config.Bucket = bucketName;
            config.BucketPassword = bucketPassword;

            _cbc = new CouchbaseClient(config);
        }


        /// Perform a  regular Store with storeMode.Set

        public IStoreOperationResult Set(string key, object value)
        {
            return _cbc.ExecuteStore(StoreMode.Set, key, value);
        }

        /// Continuously try a set with exponential backoff until number of tries or
        /// successful.  The exponential backoff will wait a maximum of 1 second, or whatever

        public IStoreOperationResult Set(string key, object value, int tries)
        {
            var backoffExp = 0;
            var tryAgain = false;
            IStoreOperationResult result = null;

            try
            {
                do
                {
                    if (backoffExp > tries)
                    {
                        throw new ApplicationException("Could not perform a set after " + tries + " tries.");
                    }

                    result = _cbc.ExecuteStore(StoreMode.Set, key, value);
                    if (result.Success) break;

                    if (backoffExp > 0)
                    {
                        var backOffMillis = Math.Pow(2, backoffExp);
                        backOffMillis = Math.Min(1000, backOffMillis); //1 sec max
                        Thread.Sleep((int)backOffMillis);
                        Console.WriteLine("Backing off, tries so far: " + backoffExp);
                    }
                    backoffExp++;

                    if (! result.Success)
                    {
                        var message = result.InnerResult != null ? result.InnerResult.Message : result.Message;
                        Console.WriteLine("Failed with status: " + message);
                    }

                    //Future versions of the .NET client will flatten the results and make checking for
                    //InnerResult objects unnecessary
                    tryAgain = (result.Message != null && result.Message.Contains("Temporary failure") ||
                                result.InnerResult != null && result.InnerResult.Message.Contains("Temporary failure"));

                } while (tryAgain);

            }
            catch (Exception ex)
            {
                Console.WriteLine("Interrupted while trying to set.  Exception:" + ex.Message);
            }

            // note that other failure cases fall through.  status.isSuccess() can be
            // checked for success or failure or the message can be retrieved.
            return result;

        }
    }
}
```

<a id="couchbase-sdk-net-operation-results"></a>
