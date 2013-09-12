## Working With Views

The following example, shows how to set up a view.

1. Define a view and specify the design document name and view name.

```java
    String dDocName = "ddoc";
    String viewName = "people";
    CBLView view = db.getViewNamed(String.format("%s/%s", dDocName, viewName));
```

2. Add the MapReduce implementation blocks for this view.

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

3. Query this view using the Ektorp API:

```java
    ViewQuery viewQuery = new ViewQuery().designDocId("_design/" + dDocName).viewName(viewName);
    //viewQuery.descending(true); //use this to reverse the sorting order of the view
    ViewResult viewResult = couchDbConnector.queryView(viewQuery);
```



