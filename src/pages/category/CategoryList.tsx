import Category from "../../components/Category";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { CategoryForm } from "./CategoryForm";
import useRxDB from "../../hooks/useRxDB";
import type { CategoryDocType } from "../../database/schemas/schemas";

export default function CategoryList() {
  //const { categories } = useCategory()a
  const [showForm, setShowForm] = useState(false);
  const dbctx = useRxDB();
  const db = dbctx.db;

  const [categories, setCategories] = useState<CategoryDocType[]>([]);

  // Fetch categories from the database
  useEffect(() => {
    if (!db) return;
/*
    const fetchCategories = async () => {
      const categoryCollection = db.categories;
      const allCategories = await categoryCollection.find().exec();
      setCategories(allCategories.map((cat) => cat.toJSON()));
    };

    fetchCategories();
*/
    // Optionally, you can set up a subscription to listen for changes
    const subscription = db.categories.find().$.subscribe((docs) => {
      setCategories(docs.map((doc) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      <h1 className="text-2xl flex justify-between px-3 font-bold mb-4">
        Categories
        <span title="Add Category">
          <PlusIcon
            title="Add Category"
            className="h-5 w-5 inline ml-2"
            onClick={() => setShowForm(!showForm)}
          />
        </span>
      </h1>
      <div>
        {showForm && (
          <div className="mb-4 p-3 border rounded bg-white shadow">
            {/* Category Form Component */}
            <CategoryForm categories={categories} />
          </div>
        )}
      </div>
      <div>
        {categories?.map((category) => (
          <Category key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}
