import { useEffect, useState } from 'react';
import { NumberFormater } from '../../utils/NumberFormater';
import useRxDB from '../../hooks/useRxDB';
import { YearSelect } from '../../components/YearSelect';

export const Home = () => {
  const currentyear = new Date().getFullYear(); // Define currentyear
  const [expenseTotal, setExpenseTotal] = useState(0); // Initialize expenseTotal in cents
  const [incomeTotal, setIncomeTotal] = useState(0); // Initialize incomeTotal
  const [year, setYear] = useState(currentyear); // State for selected year
  const [expenseCount, setExpenseCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);

  // Get database instance
  const dbctx = useRxDB();
  const db = dbctx.db;

  const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
  const endDate = new Date(year + 1, 0, 1).toISOString().split('T')[0];
  const lastExportDate = localStorage.getItem('lastExportDate');

  let daysSince = 0;
  if (lastExportDate) {
    const lastExport = new Date(lastExportDate);
    daysSince = new Date().getDate() - lastExport.getDate();
    console.log(lastExport);
  }

  console.log('Fetching totals from', startDate, 'to', endDate);

  // Fetch data from rxdb
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) return;
        const expenseCount = await db.expenses.count().exec();
        const incomeCount = await db.incomes.count().exec();
        setExpenseCount(expenseCount);
        setIncomeCount(incomeCount);
        // Fetch expenses for the current year
        const expenses = await db.expenses.find().where('date').gte(startDate).lt(endDate).exec();

        // Fetch incomes for the current year
        const incomes = await db.incomes.find().where('date').gte(startDate).lt(endDate).exec();

        // Calculate totals
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);

        // Update state with totals
        setExpenseTotal(totalExpenses);
        setIncomeTotal(totalIncomes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [year, db, startDate, endDate]);

  // Render the component

  return (
    <div className="flex min-h-screen flex-col items-center bg-blue-50 p-6">
      <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">{year} Totals!</h1>
        <div className="mb-4 flex">
          <YearSelect year={year} setYear={setYear} />
        </div>
        <div className="grid md:grid-cols-3 md:gap-4">
          <div className="text-left font-bold text-gray-600">
            <span className="inline-block w-20">Expense:</span>
            <span className="font-bold text-pink-700">
              {NumberFormater.format(expenseTotal / 100)}
            </span>
          </div>
          <div className="text-left font-bold text-gray-600">
            <span className="inline-block w-20">Income:</span>
            <span className="font-bold text-green-700">
              {NumberFormater.format(incomeTotal / 100)}
            </span>
          </div>
          <div className="text-left font-bold text-gray-600">
            <span className="inline-block w-20">Balance:</span>
            <span
              className={`font-bold ${
                incomeTotal - expenseTotal >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {NumberFormater.format((incomeTotal - expenseTotal) / 100)}
            </span>
          </div>
        </div>
        <div className="text-left font-bold text-gray-600">
          <span className="inline-block pr-4">Last Export:</span>
          <span
            className={
              'inline-block font-bold' + (daysSince < 7 ? ' text-green-700' : ' text-red-700')
            }
          >
            {daysSince} days ago!
          </span>
        </div>
        <div
          className={'relative flex flex-col items-center ' + (daysSince < 7 ? ' hidden' : ' p-4')}
        >
          <span className="animate-bounce text-2xl font-bold text-orange-500">test</span>
        </div>
        <div className="mt-4">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Database Totals</h1>
          <div className="grid md:gap-4">
            <div className="text-left font-bold text-gray-600">
              <span className="font-bold text-pink-700">{expenseCount}</span>
              <span className="inline-block p-1">total Expense Documents!</span>
            </div>
            <div className="text-left font-bold text-gray-600">
              <span className="font-bold text-green-700">{incomeCount}</span>
              <span className="inline-block p-1">total Income Documents!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
