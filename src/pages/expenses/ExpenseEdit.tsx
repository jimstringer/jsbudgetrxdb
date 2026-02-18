import { useEffect, useState } from "react";
import {  useForm, type SubmitHandler } from "react-hook-form";
import useRxDB from "../../hooks/useRxDB";
import type { CategoryDocType, ExpenseDocType } from "../../database/schemas/schemas";
import { type RxDocument } from "rxdb";
import { useParams , useNavigate} from "react-router";
//import { uuidv7 } from "uuidv7";

export default function ExpenseEdit() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { date: "", amount: "", category_id: "", comment: "" },
  });

  const [categories, setCategories] = useState<CategoryDocType[]>([]);
  const [expense, setExpense] = useState<RxDocument<ExpenseDocType> | null>(null);

  const id = useParams().id as string;
  const navigate = useNavigate();

  type Inputs = {
    date: string;
    amount: string; // convert to number on submit
    category_id: string;
    comment: string;
    for_who:  "BOTH" | "JIM" | "EVE" | "OTHER";
  };

  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: "", category_id: "", comment: "", for_who: "JIM", date: "" });

    }
    const fetchCategories = async () => {
      const categoryCollection = db.categories;
      const allCategories = await categoryCollection.find().exec();
      setCategories(allCategories.map((cat) => cat.toJSON()));
    };

    const fetchExpense = async (id: string) => {
      const expenseDoc = await db.expenses.findOne(id).exec();
      if (expenseDoc) {
        setExpense(expenseDoc); //we need this to do update
        reset({
          date: expenseDoc.date,
          amount: expenseDoc.amount/100 as unknown as string,
          category_id: expenseDoc.category_id,
          comment: expenseDoc.comment,
          for_who: expenseDoc.for_who,
        });
      }
    };

    fetchExpense(id); 

    fetchCategories();
  }, [db, isSubmitSuccessful, reset, id]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const dateNow = new Date().getTime();
    if (!expense) {
      console.error("Expense not loaded");
      return;
    }
    await expense.update({
        $set: {
          date: data.date,
          amount: Number(data.amount) * 100, // convert to cents
          category_id: data.category_id,
          comment: data.comment,
          for_who: data.for_who,
        updated_at: dateNow,
      },
    })
      .then((doc) => {
        console.log("Expense updated:", doc.toJSON());
        // After successful update, navigate back to expense list
        // would be nice to show the expense list for the month of the edited expense
        navigate(`/expense/${data.date}`);
      })
      .catch((err) => {
        console.error("Error updating expense:", err);
      });
  };

  return (
    <div className="w-full p-4 md:p-8 ">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Expense</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col relative max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          {...register("date", {
            required: true,
          })}
          type="date"
          className="form-input px-4 py-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.date && <span className="text-red-500">Date is required</span>}

        <input
          {...register("amount", {
            required: true,
            validate: {
              matchPattern: (v) => /^[0-9.]+$/.test(v),
              notNegative: (v) => Number(v) > 0,
            },
          })}
          type="tel"
          placeholder="Amount"
          className="form-input px-4 py-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.amount?.type === "required" && (
          <span className="text-red-500">Amount is required</span>
        )}
        {errors.amount?.type === "matchPattern" && (
          <span className="text-red-500">Amount must be a number</span>
        )}
        {errors.amount?.type === "notNegative" && (
          <span className="text-red-500">Amount must be a greater than 0</span>
        )}

        <select {...register("category_id", { required: true })}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
        {errors.category_id && (
          <span className="text-red-500">Category is required</span>
        )}

       <select
         {...register("for_who", {
           required: true,
         })}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select For Who</option>
          <option value="BOTH">BOTH</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
       {errors.for_who && <span className="text-red-500">For Who is required</span>}     

        <input {...register("comment")} type="text" placeholder="Comment"
          className="form-input px-4 py-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />

        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        />
      </form>
    </div>
  );
}
