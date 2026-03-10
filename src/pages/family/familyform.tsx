//Form for adding or editing family members.
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import useRxDB from '../../hooks/useRxDB';
import type { familyMemberDocType } from '../../database/schemas/schemas';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Inputs = {
  name: string;
};

export function FamilyForm({ familyMembers }: { familyMembers?: familyMemberDocType[] }) {
  const {
    register,
    handleSubmit,
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const db = dbctx.db;
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    const dateNow = new Date().getTime();
    try {
      await db.familyMembers.insert({
        name: data.name.toUpperCase(), // Store family member names in uppercase for consistency
        created_at: dateNow,
        updated_at: dateNow,
        _deleted: false,
      } as familyMemberDocType);
      toast.success(`Family member "${data.name}" added successfully!`);
    } catch (err) {
      console.error('Error adding family member:', err);
      toast.error(`Error adding family member!`);
    }
  };

  const validateFamilyMemberUniqueName = (name: string) => {
    if (!familyMembers) return true;
    const exists = familyMembers.some((member) => member.name.toLowerCase() === name.toLowerCase());
    return !exists || 'Family member name must be unique';
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(onSubmit)(e).catch(() => {});
      }}
      className="mx-auto mt-8 max-w-md rounded bg-white p-4 shadow"
    >
      <h1 className="mb-4 text-2xl font-bold">Add Family Member</h1>
      <div className="mb-4">
        <label htmlFor="name" className="mb-1 block font-medium">
          Name
        </label>
        <input
          id="name"
          {...register('name', {
            required: 'Name is required',
            validate: validateFamilyMemberUniqueName,
          })}
          className={`w-full rounded border px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Add Family Member
      </button>
    </form>
  );
}
