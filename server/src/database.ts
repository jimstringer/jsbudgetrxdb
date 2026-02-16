//The sqlite3 package is imported and used to create a database connection.
import Database from "better-sqlite3";

// Connect to database file
const db = new Database("jsbudget.db", { verbose: console.log });

//The database is configured to use Write-Ahead Logging (WAL) mode for improved performance and concurrency.
db.pragma("journal_mode = WAL");

const dropTables = `
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS sources;
DROP TABLE IF EXISTS categories;
`;

// uncomment the next line to reset the database tables
db.exec(dropTables);

// create the necessary tables if they don't exist
const createTables = `
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT NOT NULL PRIMARY KEY,  
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  category_id TEXT NOT NULL,
  comment TEXT DEFAULT '',
  for_who TEXT CHECK(for_who IN ('BOTH', 'JIM', 'EVE', 'OTHER')) DEFAULT 'BOTH',
  created_at INTEGER,
  updated_at INTEGER,
  _deleted INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS incomes (
  id TEXT NOT NULL PRIMARY KEY,  
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  source_id TEXT NOT NULL,
  comment TEXT DEFAULT '',
  from_who TEXT CHECK(from_who IN ('JIM', 'EVE', 'OTHER')) DEFAULT 'EVE',
  created_at INTEGER,
  updated_at INTEGER,
  _deleted INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sources (
  name TEXT NOT NULL PRIMARY KEY,      
  created_at INTEGER,
  updated_at INTEGER,
  _deleted INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS categories (
  name TEXT NOT NULL PRIMARY KEY,  
  created_at INTEGER,
  updated_at INTEGER,
  _deleted INTEGER DEFAULT 0
);
`;
//console.log(createTables.toString());

console.log("Creating tables if they do not exist..."); 
db.exec(createTables);

export default db;
