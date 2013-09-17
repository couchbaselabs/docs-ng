# Contributing

If you want to contribute to Couchbase Lite for iOS, please follow the guidelines for coding and testing described in this section. You can find the [latest source code for Couchbase Lite iOS](https://github.com/couchbase/couchbase-lite-ios) on GitHub.
 
## Coding Style

Please use the coding style guidelines and naming conventions described in this section.

### Source Files

* Put an Apache license at the top of all .m files and other files containing actual code. Update the year if necessary.  

* For indents, use 4 spaces (do not use tabs).

* Use the following pattern for naming category files: `CBLClassName+CategoryName.m`.

* In headers, use `@class` or `@protocol` forward declarations, when possible, instead of importing the class headers.

* Try to limit lines to 100 characters wide.

* Try to keep source files short. Under 500 lines is best and don't go over 1000 if you can help it. If a class gets bigger, consider breaking it up into topical categories, as was done with `CBLDatabase`.

### General Style

In general, go with Apple's style. However, we have idiosyncrasies and would prefer that you:

* Put spaces after the colons in messages. For example:  

        [foo bar: 1 baz: 0]
        
* Put spaces after the colons in the method declarations also. For example:

		- (void) bar: (int)bar baz: (BOOL)baz;

* Put the opening curly-brace of a method or function at the end of the declaration line (not on a separate line). _unless_ the declaration is multi-line.

* Don't put braces around single-line `if` blocks. You can use braces if you want, but please don't go on a clean-up mission and "fix" all the existing ones.

* Use modern Objective-C syntax, including the new shorthand for object literals and collection indexing.

The following guidelines are mandatory:

* Declare instance variables in the `@interface`. If you don't, the Mac build will fail because it still supports the old 32-bit Mac Obj-C runtime.

* Do *not* declare private methods in the `@interface`.

* Declare internal methods (those not part of a class's API but needed by another source file, such as a category) in a category in `CBLInternal.h`, _not_ in the public `@interface`.

### Name Prefixes

Use the following object naming conventions:

* Classes: `CBL` (`CBL_` is used for some private classes to prevent name conflicts with public classes.)

* Instance variables: `_`

* Category methods on external classes: `cbl_`

* Constants: `kCBL` (do not use `ALL_CAPS`)

* Static variables: `s` (even if defined inside a function/method!)

* Static functions: No prefix, just lowercase.


## Testing

Couchbase Lite uses the MYUtilities unit-test framework, whose API you can find in [`vendor/MYUtilities/Test.h`](https://github.com/snej/MYUtilities/blob/master/Test.h). It isn't fully integrated with Xcode 4's nice test support, so you can't just choose the Product > Test menu command to run the tests.

### Testing and Testability

* Adding unit tests is encouraged! Unlike other test frameworks, MYUtilities lets you put unit tests (`TestCase(Foo){ ... }`) in any source file. For simple tests, you can put them at the end of the source file containing the code you're testing. Larger test suites should go into their own source file, whose name should end with `_Tests.m`.
* If you need to create classes or static functions for use by unit tests, make sure to wrap them and the tests in `#if DEBUG`, so they don't take up space in a release build.
* Use `Assert()` and `CAssert()` fairly liberally in your code, especially for checking parameters.
* Use `Warn()` wherever something happens that seems wrong but shouldn't trigger a failure.


### Running Tests

Tests run when an executable target launches; they're not a separate target the way Xcode's regular tests are. So you'll need to select a scheme that builds something runnable, like "Mac Demo" or "iOS Demo".

Tests are enabled by command-line arguments whose names start with `Test_`. (If you don't know how to configure the argument list, see below.)

 * If a test case is implemented in the source code as `TestCase(Foo) {...}`, you enable it with argument `Test_Foo`. You can add any number of such arguments.
 * As a shortcut, you can enable all tests via the argument `Test_All`.
 * By default, the app will launch normally after the unit tests pass. To disable this you can add `Test_Only`.

Then run the target. Test output appears in the debugger console, of course. If an assertion fails, the test will log a message, raise an exception and exit. Subsequent tests will still run, though. At the end of the run you'll get a list of which tests failed.

*Pro tip:* As a shortcut to enable multiple tests, you can create an aggregate test that uses the `RequireTest()` macro (see below) to invoke the tests you want to run. Then you just have to enable the aggregate test.

### Configuring Command-Line Arguments

 1. Select **Product > Scheme > Edit Scheme** (keyboard shortcut: Cmd-Shift-comma).
 3. From the list on the left side of the sheet, click the **Run** entry. 
 4. Click the **Arguments** tab.
 5. In the **Arguments Passed On Launch** section, click **+** to add an argument (or multiple args separated by spaces).

*Pro tip:* You can disable arguments by unchecking them, so it's very easy to toggle tests on and off.

### Writing New Tests

Unit tests are basically functions, declared with special syntax:

```
    #import "Test.h"
    
    TestCase(Arithmetic) {
        CAssertEq(2 + 2, 4);
    }
````

This means you can put them anywhere; they don't have to go into separate files. It is convenient to put small unit tests at the end of the source file that implements the feature being tested. That means you don't have to jump between files so much while testing, and the tests can call static functions and internal methods without having to jump through hoops. But for larger test suites it's cleaner to make a separate source file (named like "XXX_Tests.m".)

Tests use a custom set of assertion macros. This isn't strictly necessary &mdash; you can use NSAssert if you want &mdash; but I like mine better. Their names start with `CAssert…`, the "`C`" meaning that they're callable from C functions (there are plain `Assert…` macros too, but they assume the existence of `self` and `_cmd`.) There's `CAssert`, `CAssertEq` (for scalars), `CAsssertEqual` (for objects), etc. You can see them all in the header `Testing.h`.

You can use these assertion macros anywhere in the code, not just in unit tests. You can sprinkle in plenty of them.

A test can require another test as a precondition. That way it can assume that the things already tested work and doesn't have to add assertions for them. To do this, begin a test with one or more `RequireTest(Foo)` calls, where `Foo` is the name of the test to require. (Don't put the name in quotes.)

### Precommit Smoke Test:

Before committing any code:

* Build both the Mac and iOS demo app targets, to catch platform- or architecture-specific code.

* Run the static analyzer (Cmd-Shift-B). There should be no issues with our code (there might be one or two issues with third-party code.)

* Run the unit tests on both platforms: run the demo app with custom arguments `Test_All` and `Test_Only`. (This is really easy to do using Cmd-Opt-R.) All the tests must pass.

* Review your patch hunk-by-hunk to make sure you're not checking in unintended changes.

* Are you fixing an issue filed in Github? If so, put something like `Fixes #999` in the commit message, and Github will automatically close the issue and add a comment linking to your commit.
