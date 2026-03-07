import { XMarkIcon } from '@heroicons/react/16/solid';
import type { CategoryDocType } from '../database/schemas/schemas';
import showAlertDialog from './show-alert-dialog';
import { toast } from 'sonner';

export default function Category({ category }: { category: CategoryDocType }) {
 
  const handleDelete = void (async () => {
    const confirmed = await showAlertDialog(
      'Are you absolutely sure?',
      `This action cannot be undone. This will permanently delete "${category.name}".`
    );
    if (confirmed) {
      // Perform the delete action
      toast.info('Not implemented yet');
    } else {
      toast.info('Action canceled');
    }
  })();

  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      {category.name}
      <button disabled={false} className="" onClick={ handleDelete}>
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
