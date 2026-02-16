import { useEffect, useState } from "react";
import { NumberFormater } from "../../utils/NumberFormater";
import useRxDB from "../../hooks/useRxDB";
import { YearSelect } from "../../components/YearSelect";

export const Home = () => {
  const currentyear = new Date().getFullYear(); // Define currentyear
  const [expenseTotal, setExpenseTotal] = useState(0); // Initialize expenseTotal in cents
  const [incomeTotal, setIncomeTotal] = useState(0); // Initialize incomeTotal
  const [year, setYear] = useState(currentyear); // State for selected year

  // Get database instance
  const dbctx = useRxDB();
  const db = dbctx.db;

  const startDate = new Date(year, 0, 1).toISOString().split("T")[0];
  const endDate = new Date(year + 1, 0, 1).toISOString().split("T")[0];

  console.log("Fetching totals from", startDate, "to", endDate);

  // Fetch data from rxdb
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) return;
        // Fetch expenses for the current year
        const expenses = await db.expenses
          .find()
          .where("date")
          .gte(startDate)
          .lt(endDate)
          .exec();

        // Fetch incomes for the current year
        const incomes = await db.incomes
          .find()
          .where("date")
          .gte(startDate)
          .lt(endDate)
          .exec();

        // Calculate totals
        const totalExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const totalIncomes = incomes.reduce(
          (sum, income) => sum + income.amount,
          0
        );

        // Update state with totals
        setExpenseTotal(totalExpenses);
        setIncomeTotal(totalIncomes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, db, startDate, endDate]);


  // Render the component

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full text-center border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {year} Totals!
        </h1>
        <div className="mb-4 flex ">
          <YearSelect year={year} setYear={setYear} />
        </div>
        <div className="grid  md:grid-cols-3 md:gap-4">
          <div className="font-bold text-gray-600 text-left">
            Expense:
            <span className="text-pink-700 font-bold">
              {NumberFormater.format(expenseTotal / 100)}
            </span>
          </div>
          <div className="font-bold text-gray-600 text-left">
            Income:
            <span className="text-green-700 font-bold">
              {NumberFormater.format(incomeTotal / 100)}
            </span>
          </div>
          <div className="font-bold text-gray-600 text-left">
            Balance:
            <span
              className={`font-bold ${
                incomeTotal - expenseTotal >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {NumberFormater.format((incomeTotal - expenseTotal) / 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
