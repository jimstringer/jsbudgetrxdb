import { useEffect, useState } from 'react';
import useRxDB from '../../hooks/useRxDB';
import { YearSelect } from '../../components/YearSelect';
import { NumberFormater } from '../../utils/NumberFormater';

export const Yearly = () => {
  const { db } = useRxDB();
  const [year, setYear] = useState(new Date().getFullYear());

  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  const [expenseCategoryTotals, setExpenseCategories] = useState<Record<string, number>>({});
  const [incomeSourceTotals, setIncomeSources] = useState<Record<string, number>>({});

  const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
  const endDate = new Date(year, 12, 0).toISOString().split('T')[0];

  console.log('Fetching data from', startDate, 'to', endDate);

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
      //console.log(categoryObj);

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
      //console.log(incomeSourceObj);

      //calculate totals
      const totalExp = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalI = incomes.reduce((sum, income) => sum + income.amount, 0);

      setExpenseTotal(totalExp);
      setIncomeTotal(totalI);

      setExpenseCategories(categoryObj); //categoryObj);
      setIncomeSources(incomeSourceObj);
    };

    handleLoading();
  }, [db, startDate, endDate]);

  const sortedCategories = Object.entries(expenseCategoryTotals).sort(([, a], [, b]) => b - a);
  const sortedSources = Object.entries(incomeSourceTotals).sort(([, a], [, b]) => b - a);

  return (
    <div className="mx-auto mt-1 max-w-full rounded bg-white p-4 shadow md:max-w-2xl">
      <div className="sticky top-15 z-10 bg-white pb-4">
        <h1 className="mb-4 text-2xl font-bold">Yearly Report</h1>
        <YearSelect year={year} setYear={setYear} />
      </div>

      <div className="grid md:grid-cols-3 md:gap-4">
        <div className="text-left font-bold text-gray-600">
          Expense:
          <span className="font-bold text-pink-700">
            {NumberFormater.format(expenseTotal / 100)}
          </span>
        </div>
        <div className="text-left font-bold text-gray-600">
          Income:
          <span className="font-bold text-green-700">
            {NumberFormater.format(incomeTotal / 100)}
          </span>
        </div>
        <div className="text-left font-bold text-gray-600">
          Balance:
          <span
            className={`font-bold ${
              incomeTotal - expenseTotal >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {NumberFormater.format((incomeTotal - expenseTotal) / 100)}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-center font-bold text-gray-600">Expense</h2>
        {expenseCategoryTotals &&
          sortedCategories.map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 odd:bg-gray-100 even:bg-gray-200">
              <dt className="text-left font-medium text-gray-900">{key}</dt>
              <dd className="text-right text-gray-700 sm:col-span-1">
                {NumberFormater.format(value / 100)}
              </dd>
            </div>
          ))}
      </div>
      <div className="mt-4">
        <h2 className="text-center font-bold text-gray-600">Income</h2>
        {incomeSourceTotals &&
          sortedSources.map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 odd:bg-gray-100 even:bg-gray-200">
              <dt className="text-left font-medium text-gray-900">{key}</dt>
              <dd className="text-right text-gray-700">{NumberFormater.format(value / 100)}</dd>
            </div>
          ))}
      </div>
    </div>
  );
};
