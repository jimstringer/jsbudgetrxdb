import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import useRxDB from "../../hooks/useRxDB";
import type { IncomeDocType, IncomeSourceDocType } from "../../database/schemas/schemas";
import { uuidv7 } from "uuidv7";

export function IncomeForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { date: "", amount: 0, incomeSourceId: "", comment: "" },
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSourceDocType[]>([]);

  type Inputs = {
    date: string;
    amount: number;
    incomeSourceId: string;
    comment: string;
    from: "JIM" | "EVE" | "OTHER";
  };

  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: 0, incomeSourceId: "", comment: "" });
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
      console.error("Database not initialized");
      return;
    }
    const dateNow = new Date().getTime();
    db.incomes
      .insert({
        id: uuidv7(),
        date: data.date,
        amount: Number(data.amount),
        source_id: data.incomeSourceId,
        comment: data.comment,
        from_who: data.from,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as IncomeDocType)
      .then((doc) => {
        console.log("Income", doc.toJSON());
      })
      .catch((err) => {
        console.error("Error adding Income", err);
      });
  };

  return (
    <div className="w-full p-4 md:p-8 bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col relative max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          {...register("date", {
            required: true,
          })}
          type="date"
        />
        {errors.date && <span className="text-red-500">Date is required</span>}

        <input
          {...register("amount", {
            required: true,
            pattern: /^[0-9]+$/i,
          })}
          type="tel"
          placeholder="Amount cents"
        />
        {errors.amount && (
          <span className="text-red-500">Amount is required</span>
        )}

        <Controller
          name="incomeSourceId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <select {...field}>
              <option value="">Select Income Source</option>
              {incomeSources.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.incomeSourceId && (
          <span className="text-red-500">Income Source is required</span>
        )}

        <input
          {...register("from", {
            required: true,
          })}
          type="text"
          placeholder="From Who (JIM, EVE, OTHER)"
        />
        {errors.from && <span className="text-red-500">From Who is required</span>} 

        <input {...register("comment")} type="text" placeholder="Comment" />

        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        />
      </form>
    </div>
  );
}
