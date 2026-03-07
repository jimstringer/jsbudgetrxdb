import { XMarkIcon } from '@heroicons/react/16/solid';
import showAlertDialog from './show-alert-dialog';
import type { IncomeSourceDocType } from '../database/schemas/schemas';
import { toast } from 'sonner';

export default function Source({ source }: { source: IncomeSourceDocType }) {
  const handleDelete = void (async () => {
    const confirmed = await showAlertDialog(
      'Are you absolutely sure?',
      `This action cannot be undone. This will permanently delete "${source.name}".`
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
      {source.name}
      <button disabled={false} className="" onClick={ handleDelete }>
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
