import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import useRxDB from "../../hooks/useRxDB";
import type {
  IncomeDocType,
  IncomeSourceDocType,
} from "../../database/schemas/schemas";
import { type RxDocument } from "rxdb";
import { useParams, useNavigate } from "react-router";

export default function IncomeEdit() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      incomeSourceId: "",
      comment: "",
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
    amount: number;
    incomeSourceId: string;
    comment: string;
    from: "JIM" | "EVE" | "OTHER";
  };

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

    const fetchIncome = async (id: string) => {
      const incomeDoc = await db.incomes.findOne(id).exec();
      if (incomeDoc) {
        setIncome(incomeDoc);
        reset({
          date: incomeDoc.date,
          amount: incomeDoc.amount,
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
      console.error("Database not initialized");
      return;
    }
    const dateNow = new Date().getTime();
    await income
      .update({
        $set: {
          date: data.date,
          amount: Number(data.amount),
          source_id: data.incomeSourceId,
          comment: data.comment,
          from_who: data.from,
          updated_at: dateNow,
        },
      })
      .then((doc) => {
        console.log("Income updated:", doc.toJSON());
        // After successful update, navigate back to expense list
        // would be nice to show the expense list for the month of the edited expense
        navigate(`/income/${data.date}`);
      })
      .catch((err) => {
        console.error("Error updating income:", err);
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

        <select {...register("incomeSourceId", { required: true })}>
          <option value="">Select Income Source</option>
          {incomeSources.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.incomeSourceId && (
          <span className="text-red-500">Income Source is required</span>
        )}

        <select
          {...register("from", {
            required: true,
          })}
        >
          <option value="">Select From Who</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.from && <span className="text-red-500">From is required</span>}

        <input {...register("comment")} type="text" placeholder="Comment" />

        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        />
      </form>
    </div>
  );
}
