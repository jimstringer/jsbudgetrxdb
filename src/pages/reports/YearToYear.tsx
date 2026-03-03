import { useEffect, useState } from 'react';
import useRxDB from '../../hooks/useRxDB';
import { YearSelect } from '../../components/YearSelect';
import { NumberFormater } from '../../utils/NumberFormater';
import type {
  CategoryDocType,
  ExpenseDocType,
  IncomeDocType,
  IncomeSourceDocType,
} from '../../database/schemas/schemas';

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

  const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
  const endDate = new Date(year, 12, 0).toISOString().split('T')[0];
  const startDate2 = new Date(year2, 0, 1).toISOString().split('T')[0];
  const endDate2 = new Date(year2, 12, 0).toISOString().split('T')[0];

  console.log('Fetching data from', startDate, 'to', endDate);
  console.log('Fetching data from', startDate2, 'to', endDate2);

  useEffect(() => {
    if (!db) return;
    const handleLoading = async () => {
      const expenses = (await db.expenses
        .find({
          selector: {
            date: {
              $gte: startDate, // Greater than or equal to the start date
              $lt: endDate, // Less than the end date
            },
          },
        })
        .exec()) as ExpenseDocType[];
      const expenses2 = (await db.expenses
        .find({
          selector: {
            date: {
              $gte: startDate2, // Greater than or equal to the start date
              $lt: endDate2, // Less than the end date
            },
          },
        })
        .exec()) as ExpenseDocType[];

      const incomes = (await db.incomes
        .find({
          selector: {
            date: {
              $gte: startDate, // Greater than or equal to the start date
              $lt: endDate, // Less than the end date
            },
          },
        })
        .exec()) as IncomeDocType[];
      const incomes2 = (await db.incomes
        .find({
          selector: {
            date: {
              $gte: startDate2, // Greater than or equal to the start date
              $lt: endDate2, // Less than the end date
            },
          },
        })
        .exec()) as IncomeDocType[];

      //fetch categories as array of RxDocument
      const allCategories = await db.categories.find().exec();
      //fetch categories as array of strings
      const expenseCategoryList = allCategories.map((cat: CategoryDocType) => cat.name);
      // create object with category name as key and { year: 0, year2: 0 }
      const categoryObj: Record<string, { year: number; year2: number }> =
        expenseCategoryList.reduce((acc: Record<string, { year: number; year2: number }>, cur) => {
          acc[cur] = { year: 0, year2: 0 };
          return acc;
        }, {});

      //loop through expenses and add amount to category total
      expenses.forEach((expense: ExpenseDocType) => {
        categoryObj[expense.category_id].year += expense.amount;
      });
      expenses2.forEach((expense: ExpenseDocType) => {
        categoryObj[expense.category_id].year2 += expense.amount;
      });
      //console.log(categoryObj);

      //do the same for incomes sources
      const allIncomeSources = await db.incomeSources.find().exec();
      const incomeSourceList = allIncomeSources.map((inc: IncomeSourceDocType) => inc.name);
      const incomeSourceObj: Record<string, { year: number; year2: number }> =
        incomeSourceList.reduce((acc: Record<string, { year: number; year2: number }>, cur) => {
          acc[cur] = { year: 0, year2: 0 };
          return acc;
        }, {});
      incomes.forEach((income: IncomeDocType) => {
        incomeSourceObj[income.source_id].year += income.amount;
      });
      incomes2.forEach((income: IncomeDocType) => {
        incomeSourceObj[income.source_id].year2 += income.amount;
      });
      console.log(incomeSourceObj);

      //calculate totals
      const totalExp: number = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalI = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExp2 = expenses2.reduce((sum, expense) => sum + expense.amount, 0);
      const totalI2 = incomes2.reduce((sum, income) => sum + income.amount, 0);

      setExpenseTotal(totalExp);
      setIncomeTotal(totalI);
      setExpenseCategories(categoryObj); //categoryObj);
      setIncomeSources(incomeSourceObj);

      setExpenseTotal2(totalExp2);
      setIncomeTotal2(totalI2);
    };

    handleLoading().catch(console.error);
  }, [db, startDate, endDate, startDate2, endDate2]);

  //we sort by year not year2
  const sortedCategories = Object.entries(expenseCategoryTotals).sort(
    ([, a], [, b]) => b.year - a.year
  );
  const sortedSources = Object.entries(incomeSourceTotals).sort(([, a], [, b]) => b.year - a.year);
  console.log('sortedCategories:', sortedCategories);

  return (
    <div className="mx-auto mt-1 max-w-full rounded bg-white p-4 shadow md:max-w-2xl">
      <div className="sticky top-15 z-10 bg-white pb-4">
        <h1 className="mb-4 text-2xl font-bold">Year to Year Report</h1>
        <div className="grid grid-cols-2 gap-4">
          <YearSelect year={year} setYear={setYear} />
          <YearSelect year={year2} setYear={setYear2} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-left font-bold text-gray-600">
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
        <div className="text-left font-bold text-gray-600">
          <div className="text-left font-bold text-gray-600">
            Expense:
            <span className="font-bold text-pink-700">
              {NumberFormater.format(expenseTotal2 / 100)}
            </span>
          </div>
          <div className="text-left font-bold text-gray-600">
            Income:
            <span className="font-bold text-green-700">
              {NumberFormater.format(incomeTotal2 / 100)}
            </span>
          </div>
          <div className="text-left font-bold text-gray-600">
            Balance:
            <span
              className={`font-bold ${
                incomeTotal2 - expenseTotal2 >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {NumberFormater.format((incomeTotal2 - expenseTotal2) / 100)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-center font-bold text-gray-600">Expense</h2>
        {expenseCategoryTotals &&
          sortedCategories.map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 odd:bg-gray-100 even:bg-gray-200">
              <dt className="text-left font-medium text-gray-900">{key}</dt>
              <dd className="text-right text-gray-700 sm:col-span-1">
                {NumberFormater.format(value.year / 100)}
              </dd>
              <dd className="text-right text-gray-700 sm:col-span-1">
                {NumberFormater.format(value.year2 / 100)}
              </dd>
            </div>
          ))}
      </div>
      <div className="mt-4">
        <h2 className="text-center font-bold text-gray-600">Income</h2>
        {incomeSourceTotals &&
          sortedSources.map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 odd:bg-gray-100 even:bg-gray-200">
              <dt className="text-left font-medium text-gray-900">{key}</dt>
              <dd className="text-right text-gray-700">
                {NumberFormater.format(value.year / 100)}
              </dd>
              <dd className="text-right text-gray-700">
                {NumberFormater.format(value.year2 / 100)}
              </dd>
            </div>
          ))}
      </div>
    </div>
  );
};
