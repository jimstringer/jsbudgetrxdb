import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeDocType, IncomeSourceDocType } from '../../database/schemas/schemas';
import { type RxDocument } from 'rxdb';
import { useParams, useNavigate } from 'react-router';

export default function IncomeEdit() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      incomeSourceId: '',
      comment: '',
    },
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSourceDocType[]>([]);
  const [income, setIncome] = useState<RxDocument<IncomeDocType> | null>(null);
  const id = useParams().id as string;
  const navigate = useNavigate();
  const { db } = useRxDB();
  const { isSubmitSuccessful } = formState;

  type Inputs = {
    date: string;
    amount: string;
    incomeSourceId: string;
    comment: string;
    from: 'JIM' | 'EVE' | 'OTHER';
  };

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: '', incomeSourceId: '', comment: '' });
    }
    const fetchIncomeSources = async () => {
      const incomeSourceCollection = db.incomeSources;
      const allIncomeSources = await incomeSourceCollection.find().exec();
      setIncomeSources(allIncomeSources.map((cat) => cat.toJSON()));
    };

    const fetchIncome = async (id: string) => {
      const incomeDoc = await db.incomes.findOne(id).exec();
      if (incomeDoc) {
        setIncome(incomeDoc);
        reset({
          date: incomeDoc.date,
          amount: (incomeDoc.amount / 100) as unknown as string,
          incomeSourceId: incomeDoc.source_id,
          comment: incomeDoc.comment,
          from: incomeDoc.from_who,
        });
      }
    };

    fetchIncome(id);
    fetchIncomeSources();
  }, [db, id, isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (!income) {
      console.error('Database not initialized');
      return;
    }
    const dateNow = new Date().getTime();
    await income
      .update({
        $set: {
          date: data.date,
          amount: Math.trunc(Number(data.amount) * 100),
          source_id: data.incomeSourceId,
          comment: data.comment,
          from_who: data.from,
          updated_at: dateNow,
        },
      })
      .then((doc) => {
        console.log('Income updated:', doc.toJSON());
        // After successful update, navigate back to expense list
        // would be nice to show the expense list for the month of the edited expense
        navigate(`/income/${data.date}`);
      })
      .catch((err) => {
        console.error('Error updating income:', err);
      });
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Edit Income</h2>
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
          placeholder="Amount cents"
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
          {...register('incomeSourceId', { required: true })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select Income Source</option>
          {incomeSources.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.incomeSourceId && <span className="text-red-500">Income Source is required</span>}

        <select
          {...register('from', {
            required: true,
          })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select From Who</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.from && <span className="text-red-500">From is required</span>}

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
      </form>
    </div>
  );
}
