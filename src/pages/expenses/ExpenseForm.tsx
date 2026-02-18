import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import useRxDB from "../../hooks/useRxDB";
import type {
  CategoryDocType,
  ExpenseDocType,
} from "../../database/schemas/schemas";
import { uuidv7 } from "uuidv7";

export default function ExpenseForm() {
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
      category_id: "",
      comment: "",
    },
  });

  const [categories, setCategories] = useState<CategoryDocType[]>([]);

  type Inputs = {
    date: string;
    amount: number;
    category_id: string;
    comment: string;
    for_who: "BOTH" | "JIM" | "EVE" | "OTHER";
  };

  const dbctx = useRxDB();
  const db = dbctx.db;
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (!db) return;

    if (isSubmitSuccessful) {
      reset({ amount: 0, category_id: "", comment: "" });
    }
    const fetchCategories = async () => {
      const categoryCollection = db.categories;
      const allCategories = await categoryCollection.find().exec();
      setCategories(allCategories.map((cat) => cat.toJSON()));
    };

    fetchCategories();
  }, [db, isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const db = dbctx.db;
    if (!db) {
      console.error("Database not initialized");
      return;
    }
    const dateNow = new Date().getTime();
    db.expenses
      .insert({
        id: uuidv7(),
        date: data.date,
        amount: Number(data.amount),
        category_id: data.category_id,
        comment: data.comment,
        for_who: data.for_who,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as ExpenseDocType)
      .then((doc) => {
        console.log("Expense added:", doc.toJSON());
      })
      .catch((err) => {
        console.error("Error adding expense:", err);
      });
  };

  return (
    <div className="w-full p-4 md:p-8 ">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>
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
          })}
        >
          <option value="">Select For Who</option>
          <option value="BOTH">BOTH</option>
          <option value="JIM">JIM</option>
          <option value="EVE">EVE</option>
          <option value="OTHER">OTHER</option>
        </select>
        {errors.for_who && (
          <span className="text-red-500">For Who is required</span>
        )}

        <input {...register("comment")} type="text" placeholder="Comment" />

        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        />
      </form>
    </div>
  );
}
