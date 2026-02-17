// Import from firebase backup file
// import { Expenses } from "../../../local/expenses.json";
// I don't want to put this file in git so need to load it from file
//import Expenses from "../../../local/expenses.json";

//TODO: get the backup from the server using axios

import { uuidv7 } from "uuidv7";
import type {
  ExpenseDocType,
  IncomeDocType,
} from "../../database/schemas/schemas";
import useRxDB from "../../hooks/useRxDB";
import { useState } from "react";

interface Expense {
  docid: string;
  mydate: number;
  StrDate: string;
  Category: string;
  Amount: number;
  Income: boolean;
  Comment: string;
}

/* function yearfrommydate(mydate: number) {
  return +mydate.toString().substring(0, 4);
}
function yearmonth(mydate: number) {
  return +mydate.toString().substring(0, 6);
} */

const readJsonFile = (file: Blob) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target) {
        resolve(JSON.parse(event.target.result as string));
      }
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });

export const ImportFB = () => {
  const [importing, setImporting] = useState(false);
  const [fsexpenses, setFsexpenses] = useState<Expense[]>([]);

  const dbctx = useRxDB();
  const db = dbctx.db;

  if (!db) {
    console.warn("In ImportFB Database is not initialized");
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

    for (const expense of fsexpenses) {
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
    setFsexpenses([]);
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const parsedData = await readJsonFile(event.target.files[0]);
      //should be an array of Expenses, How to check?
      setFsexpenses(parsedData as Expense[]); //I say it will be an Expense[]
      console.log(parsedData);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Import Firebase Backup</h1>
      <p>This feature allows you to import a backup file from Firebase.</p>
      <div className="flex w-full h-screen items-center justify-center bg-grey-lighter">
        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">Select firestore backup file</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>
      {/* Implementation of import functionality goes here */}
      {importing && <p className="text-red-500">Importing...</p>}
      <button
        onClick={saveTodexie}
        className={`border-2 border-solid bg-amber-500 ${
          (fsexpenses.length > 0) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Save to Dexie
      </button>
    </div>
  );
};

export default ImportFB;
