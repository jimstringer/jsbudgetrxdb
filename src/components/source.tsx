import showAlertDialog from './show-alert-dialog';
import type { IncomeSourceDocType } from '../database/schemas/schemas';
import { toast } from 'sonner';
import { XIcon } from 'lucide-react';

export default function Source({ source }: { source: IncomeSourceDocType }) {
  const handleDelete = async () => {
    try {
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
    } catch (error) {
      console.error('Error during delete confirmation:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      {source.name}
      <button disabled={false} className="" onClick={() => void handleDelete()}>
        <XIcon strokeWidth={4} className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
}
