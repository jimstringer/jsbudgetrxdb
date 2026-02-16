import { useEffect, useState } from "react";
import {Income} from "../../components/Income";
import useRxDB from "../../hooks/useRxDB";
import type { IncomeDocType } from "../../database/schemas/schemas";
import { YearMonthSelect } from "../../components/YearMonthSelect";

export function IncomeList() {
  const [incomes, setIncomes] = useState<IncomeDocType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  ); // Months are 0-indexed

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

  console.log("Fetching incomes from", startDate, "to", endDate);

  // Fetch incomes from the database
  useEffect(() => {
    if (!db) return;
    const query = db.incomes.find({
      selector: {
        date: {
          $gte: startDate, // Greater than or equal to the start date
          $lte: endDate, // Less than or equal to the end date
        },
      },
    });
    const subscription = query.$.subscribe((docs) => {
      setIncomes(docs.map((doc) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db, endDate, startDate]);

  return (
    <div className="max-w-full md:max-w-sm mx-auto mt-1 p-4 bg-white rounded shadow">
      <div className="sticky top-15 bg-white z-10 pb-4">
        <h1 className="text-2xl font-bold mb-4">Income</h1>
        <YearMonthSelect
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
      </div>
      <div>
        {incomes?.map((income) => (
          <Income key={income.id} income={income} />
        ))}
      </div>
    </div>
  );
}
