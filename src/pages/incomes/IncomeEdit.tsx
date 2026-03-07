import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeDocType, IncomeSourceDocType } from '../../database/schemas/schemas';
import { type RxDocument } from 'rxdb';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function IncomeEdit() {
  interface FormInputs{
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
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      source_id: '',
      comment: '',
      from_who: '',
    },
  });

  const [incomeSources, setIncomeSources] = useState<string[]>([]);
  const [income, setIncome] = useState<RxDocument<IncomeDocType> | null>(null);
  const id = useParams().id as string;
  const navigate = useNavigate();
  const { db } = useRxDB();


  useEffect(() => {
    if (!db) return;

    void (async () => {
      try {
        const allIncomeSources = await db.incomeSources.find().exec();
        const incomeDoc = await db.incomes.findOne(id).exec() as RxDocument<IncomeDocType> | null;
        if (incomeDoc) {
          const inc = {
            date: incomeDoc.date,
            amount: (incomeDoc.amount / 100).toFixed(2),
            source_id: incomeDoc.source_id,
            comment: incomeDoc.comment,
            from_who: incomeDoc.from_who,
          } as FormInputs;
          reset({ ...inc });
        }
        setIncomeSources(allIncomeSources.map((cat: RxDocument<IncomeSourceDocType>) => cat.name));
        setIncome(incomeDoc);
      } catch (error) {
        console.error('Error fetching income sources or income:', error);
      }
    })();


  }, [db, id, income, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
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
          source_id: data.source_id,
          comment: data.comment,
          from_who: data.from_who,
          updated_at: dateNow,
        },
      })
      .then(() => {
        // After successful update, navigate back to expense list
        // would be nice to show the expense list for the month of the edited expense
        void navigate(`/income/${data.date}`);
        toast.success('Income updated successfully');
      })
      .catch((err) => {
        console.error('Error updating income:', err);
        toast.error('Error updating income');
      });
  };

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8">
      <h2 className="mb-4 text-center text-2xl font-bold">Edit Income</h2>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
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
          value="Update"
        />
      </form>
    </div>
  );
}
