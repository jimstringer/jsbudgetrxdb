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
    defaultValues: { date: "", amount: 0, category_id: "", comment: "" },
  });

  const [categories, setCategories] = useState<CategoryDocType[]>([]);
  const [expense, setExpense] = useState<RxDocument<ExpenseDocType> | null>(null);

  const id = useParams().id as string;
  const navigate = useNavigate();

  type Inputs = {
    date: string;
    amount: number;
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
      reset({ amount: 0, category_id: "", comment: "", for_who: "JIM", date: "" });

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
          amount: expenseDoc.amount,
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
          amount: Number(data.amount),
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

            <select {...register("category_id", { required: true })}>
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
         })}>
          <option value="">Select For Who</option>
          <option value="BOTH">BOTH</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
       {errors.for_who && <span className="text-red-500">For Who is required</span>}     

        <input {...register("comment")} type="text" placeholder="Comment" />

        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        />
      </form>
    </div>
  );
}
