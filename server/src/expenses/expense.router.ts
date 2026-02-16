import express from "express";
import db from "../database.js";
//import { ExpenseDocType } from "../../../src/database/schemas/schemas.js";

type ExpenseDocType = {
  id: string;
  amount: number;
  date: string;
  category_id: string;
  comment: string;
  for_who: "JIM" | "EVE" | "OTHER";
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

// create and export the expense router
const expenseRouter = express.Router();

// Define routes for expenseRouter here (e.g., CRUD operations for expenses)
// For example:
expenseRouter.get("/", (_req, res) => {
  res.status(200).json({ message: "Expense router is working!" });
});

// post route to add many expenses
expenseRouter.post("/", async (req, res) => {
  const expense = req.body;
  // Logic to add expense to the database goes here
  const insertExpense = db.prepare(`
      INSERT INTO expenses (id, amount, date, category_id, comment, for_who, created_at, updated_at, _deleted)
      VALUES (@id, @amount, @date, @category_id, @comment, @for_who, @created_at, @updated_at, @_deleted)
    `);
    const insertManyExpenses = db.transaction((cats: ExpenseDocType[]) => {
        for (const cat of cats) insertExpense.run(cat);
    });
     insertManyExpenses(expense);
  res.status(201).json({ message: "Expense created!", expense });
});

expenseRouter.put("/:id", (req, res) => {
  const expenseId = req.params.id;
  const updatedExpense = req.body;
  // Logic to update expense in the database goes here
  res
    .status(200)
    .json({ message: `Expense ${expenseId} updated!`, updatedExpense });
});

expenseRouter.delete("/:id", (req, res) => {
  const expenseId = req.params.id;
  // Logic to delete expense from the database goes here
  res.status(200).json({ message: `Expense ${expenseId} deleted!` });
});

export default expenseRouter ;