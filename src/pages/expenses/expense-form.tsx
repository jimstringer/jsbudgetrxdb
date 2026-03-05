import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { CategoryDocType, ExpenseDocType } from '../../database/schemas/schemas';
import { uuidv7 } from 'uuidv7';
import type { RxError } from 'rxdb';
import showAlertDialog from '@/components/show-alert-dialog';
import { format } from 'date-fns';

export default function ExpenseForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      category_id: '',
      comment: '',
    },
  });

  const [categories, setCategories] = useState<CategoryDocType[]>([]);
  //const [error, setError] = useState('');
  //const [success, setSuccess] = useState('');

  type Inputs = {
    date: string;
    amount: string;
    category_id: string;
    comment: string;
    for_who: '' | 'BOTH' | 'JIM' | 'EVE' | 'OTHER';
  };

  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: '', category_id: '', comment: '', for_who: '' });
    }
    const fetchCategories = async () => {
      const categoryCollection = db.categories;
      const allCategories = await categoryCollection.find().exec();
      setCategories(allCategories.map((cat) => cat.toJSON()));
    };

    fetchCategories();
  }, [db, isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const db = dbctx.db;
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    const dateNow = new Date().getTime();
    db.expenses
      .insert({
        id: uuidv7(),
        date: data.date,
        amount: Math.trunc(Number(data.amount) * 100), // convert to cents
        category_id: data.category_id,
        comment: data.comment,
        for_who: data.for_who,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as ExpenseDocType)
      .then(() => {
        showAlertDialog('Success', 'Expense added successfully');
      })
      .catch((err: RxError) => {
        console.error('Error adding expense:', err);
        showAlertDialog('Error', 'Error logged to console');
      });
  };

  return (
    <div className="w-full p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Add Expense</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto flex max-w-md flex-col space-y-4 rounded-lg bg-white p-6 shadow-md"
      >
        <input
          {...register('date', {
            required: true,
          })}
          type="date"
          className="form-input focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
        {errors.date && <span className="text-red-500">Date is required</span>}

        <label htmlFor="amount" className="mb-1 block">
          Amount:
        </label>
        <input
          {...register('amount', {
            required: true,
            validate: {
              matchPattern: (v) => /^[0-9.]+$/.test(v),
              notNegative: (v) => Number(v) > 0,
            },
          })}
          type="text"
          inputMode="decimal"
          placeholder="Amount"
          id="amount"
          className="form-input focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
        {errors.amount?.type === 'required' && (
          <span className="text-red-500">Amount is required</span>
        )}
        {errors.amount?.type === 'matchPattern' && (
          <span className="text-red-500">Amount must be a number</span>
        )}
        {errors.amount?.type === 'notNegative' && (
          <span className="text-red-500">Amount must be a greater than 0</span>
        )}

        <select
          {...register('category_id', { required: true })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && <span className="text-red-500">Category is required</span>}

        <select
          {...register('for_who', {
            required: true,
          })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select For Who</option>
          <option value="BOTH">BOTH</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.for_who && <span className="text-red-500">For Who is required</span>}

        <input
          {...register('comment')}
          type="text"
          placeholder="Comment"
          className="form-input focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />

        <input
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="submit"
          value="Add Expense"
        />
      </form>
    </div>
  );
}
