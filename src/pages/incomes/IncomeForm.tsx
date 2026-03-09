import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeDocType, IncomeSourceDocType } from '../../database/schemas/schemas';
import { uuidv7 } from 'uuidv7';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function IncomeForm() {
  interface FormInputs {
    date: string;
    amount: string;
    source_id: string;
    comment: string;
    from_who: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      source_id: '',
      comment: '',
      from_who: '',
    },
  });

  const [incomeSources, setIncomeSources] = useState<string[]>([]);
  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: '', source_id: '', comment: '', from_who: '' });
    }
    void (async () => {
      const incomeSourceCollection = db.incomeSources;
      const allIncomeSources = await incomeSourceCollection.find().exec();
      setIncomeSources(allIncomeSources.map((cat: IncomeSourceDocType) => cat.name));
    });
  }, [db, isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
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
        source_id: data.source_id,
        comment: data.comment,
        from_who: data.from_who,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as IncomeDocType)
      .then(() => {
        toast.success('Income added successfully');
      })
      .catch((err) => {
        console.error('Error adding Income', err);
        toast.error('Error adding Income');
      });
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Add Income</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)();
        }}
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
          {...register('source_id', { required: true })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select Income Source</option>
          {incomeSources.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.source_id && <span className="text-red-500">Income Source is required</span>}

        <select
          {...register('from_who', {
            required: true,
          })}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select From Who</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.from_who && <span className="text-red-500">From is required</span>}

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
