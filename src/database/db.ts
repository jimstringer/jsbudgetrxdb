/**
 * RxDB Database Initialization
 * Local-first database using IndexedDB
 */

import { addRxPlugin, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
import {
  expenseSchema,
  categorySchema,
  incomeSchema,
  incomeSourceSchema,
} from "./schemas/schemas";
import type { RxDatabase, RxCollection } from "rxdb";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBCleanupPlugin } from "rxdb/plugins/cleanup";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Add dev mode plugin in development
if (import.meta.env.VITE_MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

//addRxPlugin(wrappedValidateAjvStorage);

// Define collection types
export interface JSDatabaseCollections {
  expenses: RxCollection;
  categories: RxCollection;
  incomeSources: RxCollection;
  incomes: RxCollection;
  [key: string]: RxCollection;
}

export type JsBudgetDatabase = RxDatabase<JSDatabaseCollections>;

let dbPromise: Promise<JsBudgetDatabase> | null = null;

export const initDatabase = async (): Promise<JsBudgetDatabase> => {
  if (dbPromise) {
    return dbPromise;
  }
  const storage = wrappedValidateAjvStorage({ storage: getRxStorageDexie() });

  // This causes error creating database with same name in dev mode
  /* if (import.meta.env.VITE_MODE === "development") {
    try {
      console.log("initDB: Removing existing database (dev mode)");
      await removeRxDatabase("jsbudgetdb", storage);
    } catch {
      console.log("initDB: No existing database to remove");
    }
  } */

  dbPromise = createRxDatabase<JSDatabaseCollections>({
    name: "jsbudgetdb",
    //    storage: wrappedValidateAjvStorage({ storage: getRxStorageDexie() }),
    storage: storage,
    cleanupPolicy: {
      /**
       * The minimum time in milliseconds for how long
       * a document has to be deleted before it is
       * purged by the cleanup.
       * [default=one month]
       */
      minimumDeletedTime: 1000 * 60 * 60 * 24 * 31, // one month,
      /**
       * The minimum amount of that that the RxCollection must have existed.
       * This ensures that at the initial page load, more important
       * tasks are not slowed down because a cleanup process is running.
       * [default=60 seconds]
       */
      minimumCollectionAge: 1000 * 60, // 60 seconds
      /**
       * After the initial cleanup is done,
       * a new cleanup is started after [runEach] milliseconds
       * [default=5 minutes]
       */
      runEach: 1000 * 60 * 5, // 5 minutes
      /**
       * If set to true,
       * RxDB will await all running replications
       * to not have a replication cycle running.
       * This ensures we do not remove deleted documents
       * when they might not have already been replicated.
       * [default=true]
       */
      awaitReplicationsInSync: true,
      /**
       * If true, it will only start the cleanup
       * when the current instance is also the leader.
       * This ensures that when RxDB is used in multiInstance mode,
       * only one instance will start the cleanup.
       * [default=true]
       */
      waitForLeadership: true,
    },
    multiInstance: false,
    eventReduce: true,
  }).then(async (db) => {
    await db.addCollections({
      expenses: {
        schema: expenseSchema,
        migrationStrategies: {
          // 1 means, this transforms data from version 0 to version 1
          1: function (oldDoc) {
            oldDoc.updatedAt = new Date(oldDoc.updatedAt).getTime(); // string to unix
            oldDoc.createdAt = new Date(oldDoc.createdAt).getTime(); // string to unix
            return oldDoc;
          },
        },
      },
      categories: {
        schema: categorySchema,
        migrationStrategies: {
          // 1 means, this transforms data from version 0 to version 1
          1: function (oldDoc) {
            oldDoc.updatedAt = new Date(oldDoc.updatedAt).getTime(); // string to unix
            oldDoc.createdAt = new Date(oldDoc.createdAt).getTime(); // string to unix
            return oldDoc;
          },
        },
      },
      incomeSources: {
        schema: incomeSourceSchema,
        migrationStrategies: {
          // 1 means, this transforms data from version 0 to version 1
          1: function (oldDoc) {
            oldDoc.updatedAt = new Date(oldDoc.updatedAt).getTime(); // string to unix
            oldDoc.createdAt = new Date(oldDoc.createdAt).getTime(); // string to unix
            return oldDoc;
          },
        },
      },
      incomes: {
        schema: incomeSchema,
        migrationStrategies: {
          // 1 means, this transforms data from version 0 to version 1
          1: function (oldDoc) {
            oldDoc.updatedAt = new Date(oldDoc.updatedAt).getTime(); // string to unix
            oldDoc.createdAt = new Date(oldDoc.createdAt).getTime(); // string to unix
            return oldDoc;
          },
        },
      },
    });
    return db as JsBudgetDatabase;
  });

  console.log("Database created");

  return dbPromise;
};

/**
 * Get the database instance
 */
export async function getDatabase() {
  return initDatabase();
}

/**
 * Destroy the database (for testing or reset)
export async function destroyDatabase() {
  if (dbPromise) {
    const db = await dbPromise;
    await db.destroy();  //this give a typescript error
    dbPromise = null;
  }
}
 */
