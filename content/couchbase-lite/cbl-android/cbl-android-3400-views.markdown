## Working With Views

It may not be obvious at first how you can use Couchbase Lite Views (implemented in Java) with the standard Ektorp API.  Below is small example of how it can be done.

1.  First set up your CBLServer as described in the page [[Getting Started]]

2.  Next, define a view with design document name and view name you want.

```java
    String dDocName = "ddoc";
    String viewName = "people";
    CBLView view = db.getViewNamed(String.format("%s/%s", dDocName, viewName));
```

3.  Next, add the map/reduce implementation blocks for this view.

```java
    view.setMapReduceBlocks(new CBLViewMapBlock() {

        @Override
        public void map(Map<String, Object> document, CBLViewMapEmitBlock emitter) {
            String type = (String)document.get("type");
            if("person".equals(type)) {
                emitter.emit(null, document.get("_id"));
            }
        }
    }, new CBLViewReduceBlock() {
            public Object reduce(List<Object> keys, List<Object> values, boolean rereduce) {
                    return null;
            }
    }, "1.0");
```

4.  Now you can query this view using the normal Ektorp API:

```java
    ViewQuery viewQuery = new ViewQuery().designDocId("_design/" + dDocName).viewName(viewName);
    //viewQuery.descending(true); //use this to reverse the sorting order of the view
    ViewResult viewResult = couchDbConnector.queryView(viewQuery);
```

5.  If you follow these steps, custom CouchDbDocument subclasses and the repository support classes should also work.

### CouchDbRepositorySupport Example

Currently Couchbase-Lite-Android supports limited functionality when using Ektorp Views, according to a [message posted by Marty Schoch](https://groups.google.com/d/msg/mobile-couchbase/AbwQhplCWVo/9FFrhhE_sMIJ):

> CouchDbRepositorySupport - You can use a subset of this functionality.
I haven't used it, but we have some successful reports of it
working)  The subset of functionality that does not work yet revolves
around the designDocumentFacotry.  This is what Ektorp uses to
automatically generate map/reduce views to access the data.  We'd like
to add support for this in the future.  Here is a related issue we're
tracking https://github.com/couchbaselabs/TouchDB-Android/issues/17


Here are some steps to use the CouchDbRepositorySupport class described by David K Pham:

1. Properly describe my model so Ektorp knows how to map rows to it.  Further explanation can be found in the [Ektorp reference documentation](http://www.ektorp.org/reference_documentation.html#d100e313)

2. Setup an all view for the model in the database early on in the application lifecycle before you try to retrieve all the documents for that model.

```java
CBLView allView = db.getViewNamed("EmailAccount/all");

allView.setMapReduceBlocks(new CBLViewMapBlock() {
    @Override
	public void map(Map<String, Object> document, CBLViewMapEmitBlock emitter) {
		String type = document.get("type");

        if ("email_account".equals(type)) {
            emitter.emit(null, document.get("_id"));	
		}
    }
}, null, "1.0");
```

3. Create a CouchDbRepositorySupport class:

	```java
public class EmailAccountRepository extends CouchDbRepositorySupport<EmailAccount> {
        public EmailAccountRepository(CouchDbConnector couchDBConnector) {
                super(EmailAccount.class, couchDBConnector);
        }
}
```

4. Now you can retrieve all the documents for that model:

```java
EmailAccountRepository emailAccountRepository = new EmailAccountRepository(CouchDBManager.getCouchDBConnector());

List<EmailAccount> emailAccounts = emailAccountRepository.getAll();
```

**Caution:** Any functionality of the CouchDbRepositorySupport class that relies on the design document factory to generate design documents at runtime is not supported.

### @Annotating Views
Currently this is not supported.

