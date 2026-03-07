import Category from '../../components/category';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { CategoryForm } from './CategoryForm';
import useRxDB from '../../hooks/useRxDB';
import type { CategoryDocType } from '../../database/schemas/schemas';
import type { RxDocument } from 'rxdb';

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
      setCategories(docs.map((doc: RxDocument<CategoryDocType>) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">
        Categories
        <span title="Add Category">
          <PlusIcon
            title="Add Category"
            className="ml-2 inline h-5 w-5"
            onClick={() => setShowForm(!showForm)}
          />
        </span>
      </h1>
      <div>
        {showForm && (
          <div className="mb-4 rounded border bg-white p-3 shadow">
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
