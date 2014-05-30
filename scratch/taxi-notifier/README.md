taxi_notifier
==============

Example using node.js

Setting Up
-----------
1. Failed to find way to create database schema in node-persist,
   hence please restore the mysql database structures using the 
   mysql dump file: [taxi-notifier-052014.sql](taxi-notifier-052014.sql)
2. Modify the MySQL database connection in: [database.json](database.json)
3. Insert basic test data to the database:
   `node setup.js`

Required dependencies
---------------------
Refer [package.json](package.json)

Running the app
---------------
```
node taxi_notifier.js
```

Running test
------------
```
npm test
```

or

```
mocha specs/*
```