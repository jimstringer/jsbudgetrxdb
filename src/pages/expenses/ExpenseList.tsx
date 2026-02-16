import { useEffect, useState } from "react";
import Expense from "../../components/Expense";
import useRxDB from "../../hooks/useRxDB";
import type { ExpenseDocType } from "../../database/schemas/schemas";
import { YearMonthSelect } from "../../components/YearMonthSelect";
import { useParams } from "react-router";

export default function ExpenseList() {
  const initDate = useParams().date;
  const initYear = initDate
    ? parseInt(initDate.split("-")[0])
    : new Date().getFullYear();
  const initmonth = initDate
    ? parseInt(initDate.split("-")[1])
    : new Date().getMonth() + 1;

  const [expenses, setExpenses] = useState<ExpenseDocType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(initYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initmonth); 

  // Get database instance
  const dbctx = useRxDB();
  const db = dbctx.db;

  // Define date range for the current month
  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
    .toISOString()
    .split("T")[0]; // First day of month
  const endDate = new Date(selectedYear, selectedMonth, 0)
    .toISOString()
    .split("T")[0]; // Last day of month

  console.log("Fetching expenses from", startDate, "to", endDate);

  // Fetch expenses from the database
  useEffect(() => {
    if (!db) return;
    const query = db.expenses.find({
      selector: {
        date: {
          $gte: startDate, // Greater than or equal to the start date
          $lte: endDate, // Less than or equal to the end date
        },
      },
    });
    const subscription = query.$.subscribe((docs) => {
      setExpenses(docs.map((doc) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db, endDate, startDate]);

  return (
    <div className="max-w-full md:max-w-sm mx-auto mt-1 p-4 bg-white rounded shadow">
      <div className="sticky top-15 bg-white z-10 pb-4">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <YearMonthSelect
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
      </div>
      <div>
        {expenses?.map((expense) => (
          <Expense key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
}
