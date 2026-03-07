import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { CategoryDocType } from '../../database/schemas/schemas';
import { useEffect } from 'react';

type Inputs = {
  name: string;
};

export function CategoryForm({ categories }: { categories?: CategoryDocType[] }) {
  const {
    register,
    handleSubmit,
    //watch,
    reset,
    formState,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { name: '' } });

  const dbctx = useRxDB();
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ name: '' });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const db = dbctx.db;
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    const dateNow = new Date().getTime();
    db.categories
      .insert({
        name: data.name,
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as CategoryDocType)
      .then((doc: CategoryDocType) => {
        console.log('Category added:', doc);
      })
      .catch((err) => {
        console.error('Error adding category:', err);
      });
  };

  const validateCategoryUniqueName = (name: string) => {
    if (!categories) return true;
    const exists = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
    return !exists || 'Category name must be unique';
  };

  // 👇️ If you need to capitalize first and lowercase the rest
  const capitalizeFirstLowercaseRest = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  //console.log(watch("name")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      className="flex flex-col items-center justify-center-safe gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      {/* register your input into the hook by invoking the "register" function */}

      {/* include validation with required or other standard HTML validation rules */}
      <input
        {...register('name', {
          required: true,
          pattern: /^[A-Za-z]+$/i,
          validate: validateCategoryUniqueName,
          onChange(event: React.ChangeEvent<HTMLInputElement>) {
            event.target.value = capitalizeFirstLowercaseRest(event.target.value);
          },
        })}
      />

      <input
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        type="submit"
        value="Submit"
      />
      <div className="[&_span]:text-red-500">
        {/* errors will return when field validation fails  */}
        {errors.name && errors.name.type === 'required' && <span>This is required</span>}
        {errors.name && errors.name.type === 'pattern' && <span>Only letters are allowed</span>}
        {errors.name && errors.name.type === 'validate' && <span>{errors.name.message}</span>}
      </div>
    </form>
  );
}
