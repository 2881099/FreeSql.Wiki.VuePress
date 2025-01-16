# DbFirst

```csharp
IFreeSql fsql; // For creation details, please refer to the Getting Started documentation
```

## Retrieve All Databases

```csharp
var t1 = fsql.DbFirst.GetDatabases();
//["cccddd", "test"]
```

## Retrieve Table Information for a Specific Database

```csharp
var t2 = fsql.DbFirst.GetTablesByDatabase(fsql.DbFirst.GetDatabases()[0]);
// Returns details including tables, columns, primary keys, unique keys, indexes, foreign keys, comments, etc.

var t3 = fsql.DbFirst.GetTableByName("table1");
// Returns details including columns, primary keys, unique keys, indexes, comments, etc.
```

## .NET Core CLI

The code generator `FreeSql.Generator` is a code generator for FreeSql. It can generate entity classes and supports dynamically generating entities from database entities. By default, it includes two templates based on Razor, and you can specify custom templates.

```bash
dotnet tool install -g FreeSql.Generator
dotnet tool update -g FreeSql.Generator
```

Create a new directory, open the command window quickly by typing `cmd` in the address bar, and enter the following command:

```bash
FreeSql.Generator --help
```

The great advantage of using the command-line tool to generate entity classes is that subsequent regenerations and overwrite operations can be done with a single command, and it supports Mac/Linux platforms.

```
C:\WINDOWS\system32>FreeSql.Generator --help
        ____                   ____         __
       / __/  ____ ___  ___   / __/ ___ _  / /
      / _/   / __// -_)/ -_) _\ \  / _ `/ / /
     /_/    /_/   \__/ \__/ /___/  \_, / /_/
                                    /_/


  # Github # https://github.com/dotnetcore/FreeSql v2.0.105

    FreeSql Quick Generate Database Entity Classes

    Update Tool: dotnet tool update -g FreeSql.Generator


  # Quick Start #

  > FreeSql.Generator -Razor 1 -NameOptions 0,0,0,0 -NameSpace MyProject -DB "MySql,Data Source=127.0.0.1;..."

    -Razor 1                 * Select template: Entity class + attributes
    -Razor 2                 * Select template: Entity class + attributes + navigation properties
    -Razor "d:\diy.cshtml"   * Custom template file

    -NameOptions             * 4 boolean values corresponding to:
                               Capitalize the first letter
                               Capitalize the first letter, others lowercase
                               All lowercase
                               Underscore to camelCase

    -NameSpace               * Namespace

    -DB "MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=db;charset=utf8;sslmode=none;max pool size=2"
    -DB "SqlServer,data source=.;integrated security=True;initial catalog=db;pooling=true;max pool size=2"
    -DB "PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=db;pooling=true;maximum pool size=2"
    -DB "Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2"
    -DB "Sqlite,data source=document.db"
    -DB "Firebird,database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2"
    -DB "Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2"
    -DB "KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=db"
    -DB "ShenTong,host=192.168.164.10;port=2003;database=db;username=SYSDBA;password=szoscar55;maxpoolsize=2"

   -Filter                   Table+View+StoreProcedure
                             Default: Generate tables, views, and stored procedures.
                             If you don't want to generate views and stored procedures, use -Filter View+StoreProcedure.

   -Match                    Table name or regular expression to match only specific tables, e.g., dbo\.TB_.+

   -FileName                 File name, default: {name}.cs
   -Output                   Save path, default is the current shell directory.
                             Recommended to create gen.bat in the entity directory, double-click it to regenerate all entity classes.
```

### Common Options

| Option       | Description                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -Razor       | Choose a template: Entity class + attributes `-Razor 1` / Entity class + attributes + navigation properties `-Razor 2` / Custom template file `-Razor "d:\diy.cshtml"`                                                           |
| -NameOptions | Naming convention for the generated entities. Set only one of the four boolean values to 1. Options are: `Pascal Case` / `Pascal Case, others lowercase` / `All lowercase` / `Underscore to camel case` (`-NameOptions 0,0,0,1`) |
| -NameSpace   | Namespace                                                                                                                                                                                                                        |
| -DB          | Refer to the -DB parameter section below                                                                                                                                                                                         |
| -Filter      | Table+View+StoreProcedure (default: generates tables, views, and stored procedures). To exclude views and stored procedures, use -Filter View+StoreProcedure                                                                     |
| -Match       | Table name or regular expression to match specific tables, e.g., dbo\.TB\_.+                                                                                                                                                     |
| -FileName    | File name, default: {name}.cs                                                                                                                                                                                                    |
| -Output      | Recommended to create gen.bat in the entity directory. Double-click it to regenerate all entity classes.                                                                                                                         |

### -DB Parameter

```
-DB "MySql,data source=127.0.0.1;port=3306;user id=root;password=root;initial catalog=b;charset=utf8;sslmode=none;max pool size=2"
-DB "SqlServer,data source=.;integrated security=True;initial catalog=db;pooling=true;max pool size=2"
-DB "PostgreSQL,host=192.168.164.10;port=5432;username=postgres;password=123456;database=db;pooling=true;maximum pool size=2"
-DB "Oracle,user id=user1;password=123456;data source=//127.0.0.1:1521/XE;pooling=true;max pool size=2"
-DB "Sqlite,data source=document.db"
-DB "Firebird,database=localhost:D:\fbdata\EXAMPLES.fdb;user=sysdba;password=123456;max pool size=2"
-DB "Dameng,server=127.0.0.1;port=5236;user id=2user;password=123456789;database=2user;poolsize=2"
-DB "KingbaseES,server=127.0.0.1;port=54321;uid=USER2;pwd=123456789;database=db"
-DB "ShenTong,host=192.168.164.10;port=2003;database=db;username=SYSDBA;password=szoscar55;maxpoolsize=2"
```
