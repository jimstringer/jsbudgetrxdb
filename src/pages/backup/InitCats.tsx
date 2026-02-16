//Insert some default categories into database
import { useState } from "react";
import type { CategoryDocType } from "../../database/schemas/schemas";
import useRxDB from "../../hooks/useRxDB";

export const InitCats = () => {
  const dbctx = useRxDB();
  const db = dbctx.db;
  const loading = dbctx.loading;
  const [hasCats, setHasCats] = useState(false);
  const [hasIncomeSources, setHasIncomeSources] = useState(false);

  if (loading) {
    return <div>Loading database...</div>;
  }
  if (!db) {
    console.error("Database is not initialized");
    return;
  }
  const defaultCategories = [
    "Alcohol",
    "Gas",
    "Auto",
    "Fees",
    "Beauty",
    "Bell",
    "Family",
    "Fishing",
    "Camping",
    "City Water",
    "Clothing",
    "Dine Out",
    "Entertainment",
    "Grocery",
    "Health",
    "Holiday",
    "House",
    "Hydro",
    "Lotto",
    "Misc",
    "Taxes",
    "Xmas",
  ];

  const incomecatlist = ["CPP", "OAS","Tips", "Wage", "CAI", "GST", "Other"];
  
  const insertDefaultIncomeSources = async () => {
    const now = new Date().getTime();
    const existingIncomeSources = await db.incomeSources.find().exec();
    if (existingIncomeSources.length === 0) {
      for (const incomeSourceName of incomecatlist) {
        const newIncomeSource = {
          name: incomeSourceName,
          created_at: now,
          updated_at: now,
          _deleted: false,
        };
        await db.incomeSources.insert(newIncomeSource);
      }
      console.log("Default income sources inserted");
      setHasIncomeSources(true);
    } else {
      setHasIncomeSources(true);
      console.log("Income sources already exist, skipping initialization");
    }
  };

  const insertDefaultCategories = async () => {
    const now = new Date().getTime();
    //check if categories exist
    const existingCats = await db.categories.find().exec();
    if (existingCats.length === 0) {
      //insert default categories
      for (const catName of defaultCategories) {
        const newCat: CategoryDocType = {
          name: catName,
          created_at: now,
          updated_at: now,
          _deleted: false,
        };
        await db.categories.insert(newCat);
      }
      console.log("Default categories inserted");
      setHasCats(true);
    } else {
      console.log("Categories already exist, skipping initialization");
      setHasCats(true);
    }
  };

  return (
    <div className="p-4">
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded ${hasCats ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={insertDefaultCategories}
      >
        Initialize Default Categories
          </button>
        <button
          className={`bg-green-500 text-white px-4 py-2 rounded ml-2 ${hasIncomeSources ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={insertDefaultIncomeSources}
        >
          Initialize Default Income Sources
        </button>
    </div>
  );
};
