taxi_notifier
==============

Setting Up
-----------
1. Failed to find way to create database schema in node-persist,
   hence please restore the mysql database structures using the 
   mysql dump file: <code>taxi-notifier-052014.sql</code>
2. Modify the MySQL database connection in: <code>database.json</code>
3. Insert basic test data to the database:
   <code>node setup.js</code>

Required dependencies
---------------------
Refer <code>package.json</code>

Running test
------------
```
npm test
```