// server/src/main.ts

import cors from "cors";
import "dotenv/config";
import express from "express";
import db from "./database";
import expenseRouter  from "./expenses/expense.router";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.get("/api", (_req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "OK" });
});

console.log(db.name);

app.use("/api/expenses", expenseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Close the database connection when the Node.js process is terminated
process.on("SIGINT", () => {
  db.close();
  console.log("Database connection closed.");
  process.exit(0);
});