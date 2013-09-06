## Working With Data Model Objects

Couchbase Lite has an object modeling layer that can make it easier to integrate its documents into your code. It's similar to, though simpler than, the Core Data `NSManagedObject`. The idea is the same: to create Objective-C classes whose instances represent documents in the database and whose native properties map to document properties.

### Defining A Model Class

To create a model class, you subclass `CBLModel`. Here's an example:

	// ShoppingItem.h
	#import <CouchbaseLite/CouchbaseLite.h>
	
	@interface ShoppingItem : CBLModel
	@property bool check;
	@property (copy) NSString* text;
	@property (retain) NSDate* created_at;
	@end

Here's the implementation:

	// ShoppingItem.m
	#import "ShoppingItem.h"
	
	@implementation ShoppingItem
	@dynamic check, text, created_at;
	@end

The accessors for the properties are hooked up at runtime, and get and set the properties of the same names in the associated Couchbase Lite document. The `@dynamic` directive in the .m file is just there to keep the compiler from complaining that the properties aren't implemented at compile time.

### Using A Model Class

If you have a CBLDocument, you can get a model object corresponding to it by calling `+modelForDocument:`

	CBLDocument* doc = ...... ;
	ShoppingItem* item = [ShoppingItem modelForDocument: doc];

Or you can create a new unsaved model object:

```
	ShoppingItem* item = [[ShoppingItem alloc] initWithNewDocumentInDatabase: database];
```

You can access the document properties natively:

	NSLog(@"Text is %@", item.text);
	item.check = true;

Model properties are observable, so you can bind them to UI controls.

You can access any document property whether or not you've declared an Objective-C property for it. Just be aware that these values are always accessed in object form, without automatic conversion to and from scalar types:

	NSNumber* priorityObj = [item getValueOfProperty: @"priority"];
	int priority = priorityObj.intValue;

### Saving Changes

Property changes affect the state of the CBLModel object but aren't immediately saved to the document or the database. To do so, you have to save the model:

    NSError* error;
	BOOL ok = [item save: &error];

If you set the model's `autosaves` property to `true`, it saves changes automatically. Not after every single property change, but within a brief time after one or more changes.

Finally, call `deleteDocument` to delete:

    NSError* error;
	BOOL ok = [item deleteDocument: &error];

### More About Property Types

The automatic mapping from Objective-C types to JSON document properties is very useful, but it has some details and limitations you should be aware of:

* **JSON types:** All the object types used to represent JSON are supported: NSNumber, NSNull, NSString, NSArray, NSDictionary.
* **Scalars:** Numeric properties can be declared as ordinary C numeric types like `int` or `double` and CBLModel will automatically "box" them into NSNumber objects.
* **bool vs. BOOL:** You should declare boolean properties as type `bool`, not `BOOL`. The reason is that `bool` is a built-in C99 type, while `BOOL` is just a typedef for `char`. At runtime it's impossible to tell a `BOOL` value apart from an 8-bit integer, which means CBLModel will store them in JSON as `0` and `1`, not `false` and `true`.

There are also some non-JSON-compatible classes you can use, for convenience:

* **NSData:** CBLModel saves an NSData property value by [base64][BASE64]-encoding it into a JSON string, and read it by base64-decoding the string. Note: This is inefficient and expands the data size by about 50%. If you want to store large data blobs in a document, you should use attachments instead.
* **NSDate:** `NSDate`-valued properties are converted to and from JSON strings using the [ISO-8601][ISO8601] date format. Be aware that if you're reading documents generated externally that didn't store dates in ISO-8601, CBLModel won't be able to parse them. You have to change the property type to `NSString`, and use an `NSDateFormatter` to do the parsing yourself.
* **NSDecimalNumber:** This is a lesser-known Foundation class used for high-precision representation of decimal numbers, without the round-off errors of floating-point. It's used primarily for financial data. A property of this type is stored in JSON as a decimal numeric string.
* **CBLModel:** You can have a property that points to another model object: a _relation_ in database terminology. The value stored in the document is the other model's document ID string. There are a lot of subtleties to this, so it's explored in more detail later on.

### Typed Array Properties

You can declare the type (class) of the items of an NSArray-valued property. This has the following purposes:

* It enforces that all items of the array have that type. If a document's JSON array contains mismatched or incorrect types, the property value will be `nil` and a warning will be logged. This can help avoid runtime exceptions in your code.
* It lets you use supported non-JSON classes in arrays, namely NSData, NSDate and NSDecimalNumber. If you don't specify the item class, the array items will just be NSStrings, just as they are in the JSON.
* It lets you have _arrays of other models_, also known as _to-many relationships_. For example, a `Book` model class could have a property `authors` that's an NSArray of `Author` models. (In the document the property value will be a JSON array of document-ID strings.)

To declare the item class of an array property, implement a class method whose name is of the form "<em>property</em>ItemClass" that returns the appropriate class object. For example:

```objc
+ (Class) holidaysItemClass {return [NSDate class];}
+ (Class) authorsItemClass {return [Author class];}
```

### Relationships Between Models

So far we've seen properties whose values are JSON types like integers, strings or arrays. `CBLModel` also supports properties whose values are pointers to other `CBLModel` objects. This creates what are generally called *relationships* between objects. For example, a blog comment would have a relationship to the post that it refers to.

In the actual document, a relationship is expressed by a **property whose value is the ID of the target document**. `CBLModel` knows this convention, so if you simply declare an Objective-C dynamic property whose type is a pointer to a CBLModel subclass, then at runtime the property value is looked up like this:

    Objective-C property --> document property --> database (by ID) --> document --> model

#### Example

Let's say you have documents for blog comments, and each has a "post" property whose value is the document ID of the blog post it refers to. You can model that like this:

    @class BlogPost;
	
    @interface BlogComment : CBLModel
    @property (assign) BlogPost* post;
    @end

In the implementation of `BlogComment` you simply declare the property as `@dynamic`, like any other model property.

Note that the declaration uses `(assign)` instead of the more typical `(retain)`. This is because a relationship to another model doesn't retain it, to avoid creating reference-loops that can lead to memory leaks.

#### Dynamic Subclassing and the CBLModelFactory

So far, if you declare a property's type as being `BlogPost*`, the instantiated object is a BlogPost. But what if BlogPost has subclasses? In a tumblr-style app, there might be different types of posts, such as text, image, and video, differentiated by the value of a `type` property, and you want these to be instantiated as subclasses like `TextPost`, `ImagePost` and `VideoPost`. How do you tell the property which class to instantiate for which document when the property type doesn't narrow it down to one class?

Enter the `CBLModelFactory`. This singleton object keeps a registry that maps document `type` property values to classes. If at launch time you register the type strings and the corresponding `BlogPost` subclasses, then CBLModel will consult this when instantiating model-reference properties. So the value of the `post` property of a comment will be a `TextPost`, `ImagePost` or `VideoPost` depending on the document's type.

Once you've started using the `CBLModelFactory`, you'll probably want to start instantiating models for existing documents by calling `+modelForDocument:` on CBLModel itself, rather than a subclass. This is because

    [CBLModel modelForDocument: doc]

uses the factory to decide at runtime which class to instantiate based on the document's contents, while

    [BlogPost modelForDocument: doc]
    
always creates a `BlogPost` object, even if the document's `type` indicates that it should get an `ImagePost` or `VideoPost`, which is probably not what you want.


[ISO8601]: http://www.w3.org/TR/NOTE-datetime
[BASE64]: https://tools.ietf.org/html/rfc4648
