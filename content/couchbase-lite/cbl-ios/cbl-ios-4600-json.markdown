## Validating JSON Objects

<!-- Needs a general high-level overview of validation blocks and what they do -->
[JSON-Schema](http://json-schema.org) is a way of defining the allowed structure and content of a JSON object in a machine-readable format, which is itself JSON. If you have a schema, you can programmatically validate JSON objects against the schema to find out if they match it.

Couchbase Lite includes a JSON-Schema validator class. However, to keep code size down, it's not a built-in part of the framework, but the source code is included in the distribution so you can compile it into your app.

### Adding the Validator Class to Your App

1. Locate the **CBLJSONValidator.m** and **CBLJSONValidator.h** files. 

    If you have the prebuilt binary distribution of Couchbase Lite, they're in the **Extras** folder. If you checked out the source, they're in the **Source** directory.
    
2. In Xcode, add both files to your app's target.

3. If your app's target uses Automatic Reference Counting (ARC), you are done setting up the validator class. Otherwise, you need to continue following these steps to enable ARC for the .m file you just added.
  
  1. Go to the **Build Phases** tab of your target's editor.
  
  2. Open the **Compile Sources** group.
  
  3. Double-click in the **Compiler Flags** column of the `CBLJSONValidator.m` row.
  
  4. In the bubble that opens, type `-fobjc-arc`.

### Defining a Schema

You probably want to store the schema in a JSON file, so create a new empty file in your target and give it the extension `.json`. Double-check that the file has been added to the target's "Copy Bundle Resources" file list.

Now fill in your schema. Note that the current implementation of the validator class follows [JSON Schema Draft 4](http://tools.ietf.org/html/draft-zyp-json-schema-04).

### Validating Objects

Define a document validation block

```
    NSURL* url = [[NSBundle mainBundle] URLForResource: resourceName withExtension: @"json"];
    NSError* error;
    CBLJSONValidator* v = [CBLJSONValidator validatorForSchemaAtURL: url error: &error];
    NSAssert(v != nil, @"Couldn't load JSON validator: %@", error);
  #if TEST_SCHEMA
    NSAssert([v selfValidate: &error], @"Validator is invalid: %@", error);
 #endif

    [db defineValidation: @"schema" asBlock: VALIDATIONBLOCK{
        return [v validateJSONObject: newRevision.body error: NULL];
    }];
```

If you want, you can get the NSError returned by a validation failure and return that as the validation error message.

Note the call to `-selfValidate:` &mdash; this is very useful during development, to catch mistakes in your schema, but you shouldn't include it in any real builds of the app because it will load the JSON-Schema meta-schema over HTTP from json-schema.org. This will at best slow down launch, and at worst fail (triggering an assertion failure and crash) if your app is launched while offline.

#### Handling Deletions

Document deletion is an important special case that all validators need to handle. To Couchbase Lite a deletion is just a special revision, sometimes called a *tombstone*, that contains a property `"_deleted": true`. Typically, a deletion revision has no other properties.

Your schema needs to recognize a tombstone as a special case, otherwise it will inadvertently prevent all deletions. You do this by giving the top level of the schema a `type` property whose value is an array &mdash; meaning that values can have any of the given types &mdash; and make one element of the array a schema definition specifying an object with a required `_deleted` property whose value must be `true`.

**Sample schema TBD**

#### Detecting Invalid Changes

Using schema isn't a silver bullet. A schema can only identify whether a document is structurally invalid, it can't identify an invalid _change_ in a document, or a valid change that the user doesn't have permission to make. Such invalid changes are usually crucial to detect for security reasons. Some examples:

* A new expense report, created by a user account that doesn't have permission to file expense reports.
* A revision that changes the dollar value of an existing expense report, which is supposed to be immutable.
* A revision that changes the approval status of an expense report, submitted by a user account that doesn't have permission to to do so (e.g. isn't in the originator's management hierarchy.)

Cases like these still need to be checked with custom logic. `CBLValidationContext` has some convenience methods for this, like `changedKeys` and `enumerateChanges:`.

