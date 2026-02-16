// Import from firebase backup file
import Expenses from "../../../local/expenses.json";

import { uuidv7 } from "uuidv7";
import type {
  ExpenseDocType,
  IncomeDocType,
} from "../../database/schemas/schemas";
import useRxDB from "../../hooks/useRxDB";
import { useState } from "react";

/* 
interface Expense {
  docid: string;
  mydate: number;
  StrDate: string;
  Category: string;
  Amount: number;
  Income: boolean;
  Comment: string;
}
 */

/* function yearfrommydate(mydate: number) {
  return +mydate.toString().substring(0, 4);
}
function yearmonth(mydate: number) {
  return +mydate.toString().substring(0, 6);
} */

export const ImportFB = () => {
  const [importing, setImporting] = useState(false);

  const dbctx = useRxDB();
  const db = dbctx.db;

  if (!db) {
    console.warn("In ImportFBDatabase is not initialized");
    return;
  }

  // Save to dexie database using rxdb context
  const saveTodexie = async () => {
    setImporting(true);
    //clear existing expenses
    await db.expenses.find().remove();
    await db.expenses.cleanup(0); //runs cleanup immediately
    await db.incomes.find().remove();
    await db.incomes.cleanup(0); //runs cleanup immediately

    const now = new Date().getTime();

    //get the categories from database
    const categorysMap = new Map<string, string>();
    const categorys = await db.categories.find().exec();
    categorys.forEach((category) => {
      categorysMap.set(category.name.toUpperCase(), category.name);
    });
    //get the income sources from database
    const incomeSourcesMap = new Map<string, string>();
    const incomeSources = await db.incomeSources.find().exec();
    incomeSources.forEach((incomeSource) => {
      incomeSourcesMap.set(incomeSource.name.toUpperCase(), incomeSource.name);
    });

    for (const expense of Expenses) {
      console.log("Importing expense:", expense);
      console.log("amount:", expense.Amount * 100);
      const forfrom = (comment: string) => {
        if (comment && comment.toUpperCase().includes("JIM")) {
          return "JIM";
        } else if (comment && comment.toUpperCase().includes("EVE")) {
          return "EVE";
        } else {
          return "OTHER";
        }
      };
      if (expense.Income) {
        await db.incomes.insert({
          id: uuidv7(),
          amount: +(expense.Amount * 100).toFixed(0), //store as integer
          date: expense.StrDate,
          source_id:
            incomeSourcesMap.get(expense.Category.toUpperCase()) || "Other",
          comment: expense.Comment || "",
          from_who: forfrom(expense.Comment),
          created_at: now,
          updated_at: now,
          _deleted: false,
        } as IncomeDocType);
      } else {
        await db.expenses.insert({
          id: uuidv7(),
          amount: +(expense.Amount * 100).toFixed(0), //store as integer
          date: expense.StrDate,
          category_id:
            categorysMap.get(expense.Category.toUpperCase()) || "Uncategorized",
          comment: expense.Comment || "",
          for_who: forfrom(expense.Comment),
          created_at: now,
          updated_at: now,
          _deleted: false,
        } as ExpenseDocType);
      }
    }
    setImporting(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Import Firebase Backup</h1>
      <p>This feature allows you to import a backup file from Firebase.</p>
      {/* Implementation of import functionality goes here */}
      {importing && <p className="text-red-500">Importing...</p>}
      <button
        onClick={saveTodexie}
        className="border-2 border-solid bg-amber-500"
      >
        Save to Dexie
      </button>
    </div>
  );
};

export default ImportFB;
