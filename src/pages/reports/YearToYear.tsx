import { useEffect, useState } from "react";
import useRxDB from "../../hooks/useRxDB";
import { YearSelect } from "../../components/YearSelect";
import { NumberFormater } from "../../utils/NumberFormater";

export const YearToYear = () => {
  const { db } = useRxDB();
  const [year, setYear] = useState(new Date().getFullYear());
  const [year2, setYear2] = useState(new Date().getFullYear() - 1); //last year

  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal2, setExpenseTotal2] = useState(0);
  const [incomeTotal2, setIncomeTotal2] = useState(0);

  const [expenseCategoryTotals, setExpenseCategories] = useState<
    Record<string, { year: number; year2: number }>
  >({});
  const [incomeSourceTotals, setIncomeSources] = useState<
    Record<string, { year: number; year2: number }>
  >({});

  const startDate = new Date(year, 0, 1).toISOString().split("T")[0];
  const endDate = new Date(year, 12, 0).toISOString().split("T")[0];
  const startDate2 = new Date(year2, 0, 1).toISOString().split("T")[0];
  const endDate2 = new Date(year2, 12, 0).toISOString().split("T")[0];

  console.log("Fetching data from", startDate, "to", endDate);
  console.log("Fetching data from", startDate2, "to", endDate2);

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
      const expenses2 = await db.expenses
        .find({
          selector: {
            date: {
              $gte: startDate2, // Greater than or equal to the start date
              $lt: endDate2, // Less than the end date
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
      const incomes2 = await db.incomes
        .find({
          selector: {
            date: {
              $gte: startDate2, // Greater than or equal to the start date
              $lt: endDate2, // Less than the end date
            },
          },
        })
        .exec();

      //fetch categories as array of RxDocument
      const allCategories = await db.categories.find().exec();
      //fetch categories as array of strings
      const expenseCategoryList = allCategories.map((cat) => cat.name);
      // create object with category name as key and { year: 0, year2: 0 }
      const categoryObj = expenseCategoryList.reduce((acc, cur) => {
        acc[cur] = { year: 0, year2: 0 };
        return acc;
      }, {});

      //loop through expenses and add amount to category total
      expenses.forEach((expense) => {
        categoryObj[expense.category_id].year += expense.amount;
      });
      expenses2.forEach((expense) => {
        categoryObj[expense.category_id].year2 += expense.amount;
      });
      //console.log(categoryObj);

      //do the same for incomes sources
      const allIncomeSources = await db.incomeSources.find().exec();
      const incomeSourceList = allIncomeSources.map((inc) => inc.name);
      const incomeSourceObj = incomeSourceList.reduce((acc, cur) => {
        acc[cur] = { year: 0, year2: 0 };
        return acc;
      }, {});
      incomes.forEach((income) => {
        incomeSourceObj[income.source_id].year += income.amount;
      });
      incomes2.forEach((income) => {
        incomeSourceObj[income.source_id].year2 += income.amount;
      });
      console.log(incomeSourceObj);

      //calculate totals
      const totalExp = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      const totalI = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExp2 = expenses2.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      const totalI2 = incomes2.reduce((sum, income) => sum + income.amount, 0);

      setExpenseTotal(totalExp);
      setIncomeTotal(totalI);
      setExpenseCategories(categoryObj); //categoryObj);
      setIncomeSources(incomeSourceObj);

      setExpenseTotal2(totalExp2);
      setIncomeTotal2(totalI2);
    };

    handleLoading();
  }, [db, startDate, endDate, startDate2, endDate2]);

  //we sort by year not year2
  const sortedCategories = Object.entries(expenseCategoryTotals).sort(
    ([, a], [, b]) => b.year - a.year,
  );
  const sortedSources = Object.entries(incomeSourceTotals).sort(
    ([, a], [, b]) => b.year - a.year,
  );
  console.log("sortedCategories:", sortedCategories);

  return (
    <div className="max-w-full md:max-w-2xl mx-auto mt-1 p-4 bg-white rounded shadow">
      <div className="sticky top-15 bg-white z-10 pb-4">
        <h1 className="text-2xl font-bold mb-4">Year to Year Report</h1>
        <div className="grid grid-cols-2 gap-4">
          <YearSelect year={year} setYear={setYear} />
          <YearSelect year={year2} setYear={setYear2} />
        </div>
      </div>

      <div className="grid  grid-cols-2 gap-4">
        <div className="font-bold text-gray-600 text-left">
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
        <div className="font-bold text-gray-600 text-left">
          <div className="font-bold text-gray-600 text-left">
            Expense:
            <span className="text-pink-700 font-bold">
              {NumberFormater.format(expenseTotal2 / 100)}
            </span>
          </div>
          <div className="font-bold text-gray-600 text-left">
            Income:
            <span className="text-green-700 font-bold">
              {NumberFormater.format(incomeTotal2 / 100)}
            </span>
          </div>
          <div className="font-bold text-gray-600 text-left">
            Balance:
            <span
              className={`font-bold ${
                incomeTotal2 - expenseTotal2 >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {NumberFormater.format((incomeTotal2 - expenseTotal2) / 100)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-gray-600 text-center">Expense</h2>
        {expenseCategoryTotals &&
          sortedCategories.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 odd:bg-gray-100 even:bg-gray-200"
            >
              <dt className="font-medium text-gray-900 text-left">{key}</dt>
              <dd className="text-gray-700 sm:col-span-1 text-right">
                {NumberFormater.format(value.year / 100)}
              </dd>
              <dd className="text-gray-700 sm:col-span-1 text-right">
                {NumberFormater.format(value.year2 / 100)}
              </dd>
            </div>
          ))}
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-gray-600 text-center">Income</h2>
        {incomeSourceTotals &&
          sortedSources.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 odd:bg-gray-100 even:bg-gray-200"
            >
              <dt className="font-medium text-gray-900 text-left">{key}</dt>
              <dd className="text-gray-700  text-right">
                {NumberFormater.format(value.year / 100)}
              </dd>
              <dd className="text-gray-700  text-right">
                {NumberFormater.format(value.year2 / 100)}
              </dd>
            </div>
          ))}
      </div>
    </div>
  );
};
