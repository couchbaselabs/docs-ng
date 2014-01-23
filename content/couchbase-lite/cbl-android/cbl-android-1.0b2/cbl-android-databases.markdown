## Working with databases

Databases are represented by the `Database` class and managed by the `Manager` class.

When your app is launched for the first time, you need to set up a database. Depending on your app design, you might need to [set up an initial database](#setting-up-the-initial-database) the first time a user launches your app and then [connect to the existing database](#connecting-to-an-existing-database) upon subsequent launches. Each time the app launches, you must check whether the database exists in Couchbase Lite.

Database names must begin with an lowercase letter. You can test a database name for validity by calling `isValidDatabaseName()`. The following characters are valid in database names:

* lowercase letters: `a-z`
* numbers: `0-9`
* special characters: `_$()+-/`

### Creating a database

To create a database in your app, you need to create a `Database` instance by using the `getDatabase()` method provided in the `Manager` class. If the database specified in a call to `getDatabase()` already exists, the existing database is opened. If the database does not exist, a new database is created. In the following example, `manager` is declared as static because it needs to be shared with other parts of the app. 

```java

protected static Manager manager;
private Database database;
public static final String DATABASE_NAME = "grocery-sync";

// create a manager
manager = new Manager(getApplicationContext().getFilesDir(), Manager.DEFAULT_OPTIONS);

// create a new database
database = manager.getDatabase(DATABASE_NAME);
     
```

### Connecting to an existing database

If the database already exists, you can open it by using the `getExistingDatabase()` method:

```java
database = manager.getExistingDatabase(DATABASE_NAME);
```

If the specified database does not exist, the `getExistingDatabase()` method throws an exception.

