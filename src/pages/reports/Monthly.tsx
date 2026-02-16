import { useEffect, useState } from "react";
import useRxDB from "../../hooks/useRxDB";
import { YearMonthSelect } from "../../components/YearMonthSelect";
//import type {  ExpenseDocType,  IncomeDocType, } from "../../database/schemas/schemas";
import { NumberFormater } from "../../utils/NumberFormater";


export const Monthly = () => {
  const { db } = useRxDB();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  const [expenseCategoryTotals, setExpenseCategories] = useState<
    Record<string, number>
  >({});
  const [incomeSourceTotals, setIncomeSources] = useState<
    Record<string, number>
  >({});

  //const [expenses, setExpenses] = useState<ExpenseDocType[]>([]);
  //const [incomes, setIncomes] = useState<IncomeDocType[]>([]);

  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  //const expenseCategoryList = [];

  console.log("Fetching data from", startDate, "to", endDate);

  useEffect(() => {
    if (!db) return;
    const handleLoading = async () => {
      const expenses = await db.expenses
        .find({
          selector: {
            date: {
              $gte: startDate, // Greater than or equal to the start date
              $lt: endDate, // Less than the end date
            },
          },
        })
        .exec();

      const incomes = await db.incomes
        .find({
          selector: {
            date: {
              $gte: startDate, // Greater than or equal to the start date
              $lt: endDate, // Less than the end date
            },
          },
        })
        .exec();
      //fetch categories as array of RxDocument
      const allCategories = await db.categories.find().exec();
      //fetch categories as array of strings
      const expenseCategoryList = allCategories.map((cat) => cat.name);
      // create object with category name as key and value 0
      const categoryObj = expenseCategoryList.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {});

      //loop through expenses and add amount to category total
      expenses.forEach((expense) => {
        categoryObj[expense.category_id] += expense.amount;
      });
      console.log(categoryObj);

      //do the same for incomes sources
      const allIncomeSources = await db.incomeSources.find().exec();
      const incomeSourceList = allIncomeSources.map((inc) => inc.name);
      const incomeSourceObj = incomeSourceList.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {});
      incomes.forEach((income) => {
        incomeSourceObj[income.source_id] += income.amount;
      });
      console.log(incomeSourceObj);

      //calculate totals
      const totalExp = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      const totalI = incomes.reduce((sum, income) => sum + income.amount, 0);

      setExpenseTotal(totalExp);
      setIncomeTotal(totalI);

      setExpenseCategories(categoryObj);
      setIncomeSources(incomeSourceObj);
      //setExpenses(expenses);
      //setIncomes(incomes);
    };

    handleLoading();
  }, [db, startDate, endDate]);

  return (
    <div className="max-w-full md:max-w-2xl mx-auto mt-1 p-4 bg-white rounded shadow">
      <div className="sticky top-15 bg-white z-10 pb-4">
        <h1 className="text-2xl font-bold mb-4">Monthly Report</h1>
        <YearMonthSelect
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
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
      <div className="mt-4">
        <h2 className="font-bold text-gray-600 text-center">Expense</h2>
        {expenseCategoryTotals &&
          Object.entries(expenseCategoryTotals).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 odd:bg-gray-100 even:bg-gray-200">
              <dt className="font-medium text-gray-900 text-left">{key}</dt>
              <dd className="text-gray-700 sm:col-span-1 text-right">
                {NumberFormater.format(value / 100)}
              </dd>
            </div>
          ))}
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-gray-600 text-center">Income</h2>
        {incomeSourceTotals &&
          Object.entries(incomeSourceTotals).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 odd:bg-gray-100 even:bg-gray-200">
              <dt className="font-medium text-gray-900 text-left">{key}</dt>
              <dd className="text-gray-700  text-right">
                {NumberFormater.format(value / 100)}
              </dd>
            </div>
          ))}
      </div>
    </div>
  );
};
