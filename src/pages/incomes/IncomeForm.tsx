import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeDocType, IncomeSourceDocType } from '../../database/schemas/schemas';
import { uuidv7 } from 'uuidv7';
import { format } from 'date-fns';

export function IncomeForm() {
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
      incomeSourceId: '',
      comment: '',
    },
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSourceDocType[]>([]);

  type Inputs = {
    date: string;
    amount: string;
    incomeSourceId: string;
    comment: string;
    from: '' | 'JIM' | 'EVE' | 'OTHER';
  };

  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: '', incomeSourceId: '', comment: '', from: '' });
    }
    const fetchIncomeSources = async () => {
      const incomeSourceCollection = db.incomeSources;
      const allIncomeSources = await incomeSourceCollection.find().exec();
      setIncomeSources(allIncomeSources.map((cat) => cat.toJSON()));
    };

    fetchIncomeSources();
  }, [db, isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const db = dbctx.db;
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    const dateNow = new Date().getTime();
    db.incomes
      .insert({
        id: uuidv7(),
        date: data.date,
        amount: Math.trunc(Number(data.amount) * 100), // convert to cents
        source_id: data.incomeSourceId,
        comment: data.comment,
        from_who: data.from,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as IncomeDocType)
      .then((doc) => {
        console.log('Income', doc.toJSON());
      })
      .catch((err) => {
        console.error('Error adding Income', err);
      });
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Add Income</h2>
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
          value="Add Income"
        />
      </form>
    </div>
  );
}
