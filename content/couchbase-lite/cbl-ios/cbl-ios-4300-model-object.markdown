## Working With Data Model Objects

Couchbase Lite has an object modeling layer that can make it easier to integrate its documents into your code. It's similar to, though simpler than, the Apple Core Data framework `NSManagedObject` class. The idea is to create Objective-C classes whose instances represent documents in the database and whose native properties map to document properties.

### Defining A Model Class

To create a model class, you subclass `CBLModel`. Here's an example:

	// ShoppingItem.h
	#import <CouchbaseLite/CouchbaseLite.h>
	
	@interface ShoppingItem : CBLModel
	@property bool check;
	@property (copy) NSString* text;
	@property (strong) NSDate* created_at;
	@end

Here's the implementation:

	// ShoppingItem.m
	#import "ShoppingItem.h"
	
	@implementation ShoppingItem
	@dynamic check, text, created_at;
	@end

The accessors for the properties are hooked up at runtime, and get and set the properties of the same names in the associated Couchbase Lite document. The `@dynamic` directive in the .m file is just there to keep the compiler from complaining that the properties aren't implemented at compile time.

### Using A Model Class

If you have a `CBLDocument` object, you can get a model object that corresponds to it by calling the `modelForDocument:` class method from the `CBLModel` class:

```
CBLDocument* doc = ...... ;
ShoppingItem* item = [ShoppingItem modelForDocument: doc];
```

You can create a new unsaved model object, as shown in the following example:

```objc
ShoppingItem* item = [[ShoppingItem alloc] initWithNewDocumentInDatabase: database];
```

You can access the document properties natively:

	NSLog (@"Text is %@", item.text);
	item.check = true;

Model properties support key-value coding and key-value observing. You can access any document property whether or not you've declared an Objective-C property for it. Just be aware that these values are always accessed in object form, without automatic conversion to and from scalar types:

```objc
NSNumber* priorityObj = [item getValueOfProperty: @"priority"];
int priority = priorityObj.intValue;
```
### Saving Changes

Property changes affect the state of the `CBLModel` object but aren't immediately saved to the document or the database. To save the property changes, you have to save the model:

    NSError* error;
	BOOL ok = [item save: &error];

To save property changes automatically, set the `autosaves` property of the `CBLModel` object to `true`. The changes are not saved after every property change, but they are saved within a brief time after one or more changes.

Finally, call `deleteDocument` to delete:

    NSError* error;
	BOOL ok = [item deleteDocument: &error];

### Property Types

The automatic mapping from Objective-C types to JSON document properties is very useful, but it has some details and limitations that you should be aware of:

* **JSON types:** All the object types used to represent JSON are supported: NSNumber, NSNull, NSString, NSArray, NSDictionary.
* **Scalars:** Numeric properties can be declared as ordinary C numeric types like `int` or `double`. `CBLModel` automatically puts them into `NSNumber` objects.
* **bool vs. BOOL:** Declare Boolean properties as type `bool`, not `BOOL`. The reason is that `bool` is a built-in C99 type, while `BOOL` is just a typedef for `char`. At run time it's impossible to tell a `BOOL` value apart from an 8-bit integer, which means `CBLModel` stores them in JSON as `0` and `1`, instead of `false` and `true`.

For convenience, you can also use the following non-JSON-compatible classes:

* **NSData:** `CBLModel` saves an `NSData` property value by [base64](https://tools.ietf.org/html/rfc4648)-encoding it into a JSON string, and reads it by base64-decoding the string. This is inefficient and expands the data size by about 50%. If you want to store large data blobs in a document, you should use attachments instead.
* **NSDate:** `NSDate`-valued properties are converted to and from JSON strings using the [ISO-8601](http://www.w3.org/TR/NOTE-datetime) date format. Be aware that if you're reading documents generated externally that didn't store dates in ISO-8601, `CBLModel` won't be able to parse them. You have to change the property type to `NSString` and use an `NSDateFormatter` object to do the parsing yourself.
* **NSDecimalNumber:** This is a lesser-known Foundation class used for high-precision representation of decimal numbers without the round-off errors of floating-point. It's used primarily for financial data. A property of this type is stored in JSON as a decimal numeric string.
* **CBLModel:** You can have a property that points to another model object: a _relation_ in database terminology. The value stored in the document is the other model's document ID string. There are a lot of subtleties to this, so it's explored in more detail later on.

### Typed Array Properties

You can declare the type (class) of the items of an NSArray-valued property. This has the following purposes:

* It enforces that all items of the array have that type. If a document's JSON array contains mismatched or incorrect types, the property value will be `nil` and a warning will be logged. This can help avoid run-time exceptions in your code.
* It lets you use supported non-JSON classes in arrays, namely `NSData`, `NSDate` and `NSDecimalNumber`. If you don't specify the item class, the array items will just be `NSString` objects, just as they are in the JSON.
* It lets you have arrays of other models, also known as _to-many relationships_. For example, a `Book` model class could have a property `authors` that's an `NSArray` of `Author` models. (In the document the property value will be a JSON array of document-ID strings.)

To declare the item class of an array property, implement a class method whose name is of the form "<em>property</em>ItemClass" that returns the appropriate class object. For example:

```objc
+ (Class) holidaysItemClass {return [NSDate class];}
+ (Class) authorsItemClass {return [Author class];}
```

### Relationships Between Models

So far we've seen properties whose values are JSON types like integers, strings or arrays. `CBLModel` also supports properties whose values are pointers to other `CBLModel` objects. This creates what are generally called *relationships* between objects. For example, a blog comment would have a relationship to the post that it refers to.

In the actual document, a relationship is expressed by a property whose value is the ID of the target document. `CBLModel` knows this convention, so if you declare an Objective-C dynamic property whose type is a pointer to a `CBLModel` subclass, then at run time the property value is looked up like this:

    Objective-C property --> document property --> database (by ID) --> document --> model


For example, you might have documents for blog comments and each blog comment has a `post` property whose value is the document ID of the blog post it refers to. You can model that like this:

    @class BlogPost;
	
    @interface BlogComment : CBLModel
    @property (assign) BlogPost* post;
    @end

In the implementation of `BlogComment` you declare the property as `@dynamic`, like any other model property.

Note that the declaration uses `(assign)` instead of the more typical `(retain)`. This is because a relationship to another model doesn't retain it to avoid creating reference-loops that can lead to memory leaks. Couchbase Lite takes care of reloading the destination model if necessary when you access the property. Also, Couchbase Lite does not deallocate models with unsaved changes.

#### Dynamic Subclassing and the CBLModelFactory

So far, if you declare a property's type as being `BlogPost*`, the instantiated object is a BlogPost. But what if BlogPost has subclasses? In a Tumblr-style app, there might be different types of posts, such as text, image, and video, differentiated by the value of a `type` property, and you want these to be instantiated as subclasses like `TextPost`, `ImagePost` and `VideoPost`. How do you tell the property which class to instantiate for which document when the property type doesn't narrow it down to one class?

The `CBLModelFactory` singleton object keeps a registry that maps document `type` property values to classes. If at launch time you register the type strings and the corresponding `BlogPost` subclasses, then CBLModel consults this when instantiating model-reference properties. So the value of the `post` property of a comment is a `TextPost`, `ImagePost`, or `VideoPost` depending on the document's type.

<!-- Add an example of registering a document type here -->

After you've started using the `CBLModelFactory`, you'll probably want to start instantiating models for existing documents by calling `modelForDocument:` on `CBLModel` itself, rather than a subclass. This is because

    [CBLModel modelForDocument: doc]

uses the factory to decide at run time which class to instantiate based on the document's contents, while

    [BlogPost modelForDocument: doc]
    
always creates a `BlogPost` object, even if the document's `type` indicates that it should get an `ImagePost` or `VideoPost`, which is probably not what you want.


