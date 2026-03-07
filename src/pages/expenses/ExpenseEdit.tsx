import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { CategoryDocType, ExpenseDocType } from '../../database/schemas/schemas';
import { forWhoArray } from '../../database/schemas/schemas';
import { type RxDocument } from 'rxdb';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ExpenseEdit() {
  const [categories, setCategories] = useState<string[]>([]);
  const [expense, setExpense] = useState<RxDocument<ExpenseDocType> | null>(null);
  interface FormValues {
    date: string;
    amount: string;
    category_id: string;
    comment: string;
    for_who: string;
  }
  // we need the RxDocument to call .update() on it, we will set the form values from this document after we fetch it from the db
  const {
    register,
    handleSubmit,
    reset,
    //formState,
    formState: { errors },
  } = useForm<FormValues>({
  });


  const id = useParams().id as string;
  const navigate = useNavigate();
  const dbctx = useRxDB();
  const db = dbctx.db;

  useEffect(() => {
    if (!db) return;

    void ( async () => {
      try {
        const allCategories = await db.categories.find().exec();
        const expenseDoc = (await db.expenses
          .findOne(id)
          .exec()) as RxDocument<ExpenseDocType> | null;
        if (expenseDoc) {
          const exp = {
            date: expenseDoc.date,
            amount: (expenseDoc.amount / 100).toFixed(2),
            category_id: expenseDoc.category_id,
            comment: expenseDoc.comment,
            for_who: expenseDoc.for_who,  
          } as FormValues;
          reset({ ...exp });
          //setFormValues(exp);
          setExpense(expenseDoc);
        }
        setCategories(allCategories.map((cat: RxDocument<CategoryDocType>) => cat.name));
      } catch (error) {
        console.error('Error fetching categories or expense:', error);
      }
    })();

    
  }, [db, id, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const dateNow = new Date().getTime();
    if (!expense) {
      console.error('Expense not loaded');
      return;
    }
    await expense
      .update({
        $set: {
          date: data.date,
          amount: Math.trunc(Number(data.amount) * 100), // convert to cents
          category_id: data.category_id,
          comment: data.comment,
          for_who: data.for_who,
          updated_at: dateNow,
        },
      })
      .then((doc) => {
        console.log('Expense updated:', doc.toJSON());
        // After successful update, navigate back to expense list
        // would be nice to show the expense list for the month of the edited expense
        void navigate(`/expense/${data.date}`);
        toast.success('Expense updated successfully');
      })
      .catch((err) => {
        console.error('Error updating expense:', err);
        toast.error('Failed to update expense');
      });
  }; 


  return (
    <div className="w-full p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Edit Expense</h2>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="relative mx-auto flex max-w-md flex-col space-y-4 rounded-lg bg-white p-6 shadow-md"
      >
        <input
          {...register('date', {
            required: true,
          },
        )} 
          type="date"
          className="form-input focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
        {errors.date && <span className="text-red-500">Date is required</span>}

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
            <option key={category} value={category}>
              {category}
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
          { forWhoArray.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          )) }
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
          value="Update"
        />
        <button
          type="button"
          className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
          onClick={() => void navigate(`/expense/${expense?.date}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
