import { XIcon } from 'lucide-react';
import type { CategoryDocType } from '../database/schemas/schemas';
import showAlertDialog from './show-alert-dialog';
import { toast } from 'sonner';
import useRxDB from '@/hooks/useRxDB';

export default function Category({ category }: { category: CategoryDocType }) {

    const { db } = useRxDB();

  const handleDelete = async (categoryToDelete: CategoryDocType) => {
  
    if (!db) {
      toast.error('Database not initialized');
      return;
    }
    try {
      //get a count of how many expenses are in this category and show that in the confirmation dialog
      const expenseCount = await db.expenses.count().where('category_id').equals(categoryToDelete.name).exec();
      if (expenseCount > 0) {
        toast.error(`Cannot delete category "${categoryToDelete.name}" because it has ${expenseCount} associated expenses.`);
        return;
      }
      const confirmed = await showAlertDialog(
        'Are you absolutely sure?',
        `This action cannot be undone. This will permanently delete "${categoryToDelete.name}".`
      );
      if (confirmed) {
        // Perform the delete action
        toast.info('Not implemented yet');
      } else {
        toast.info('Action canceled');
      }
    } catch (error) {
      console.error('Error during delete confirmation:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      {category.name}
      <button disabled={false} className="" onClick={() => void handleDelete(category)}>
        <XIcon strokeWidth={4} className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
}
