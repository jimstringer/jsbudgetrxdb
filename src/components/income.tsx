import { XIcon, PencilIcon } from 'lucide-react';
import type { IncomeDocType } from '../database/schemas/schemas';
import { useNavigate } from 'react-router';
import useRxDB from '../hooks/useRxDB';
import showAlertDialog from './show-alert-dialog';
import type { RxDocument } from 'node_modules/rxdb/dist/types/types/rx-document';

export const Income = ({ income }: { income: IncomeDocType }) => {
  const { db } = useRxDB();
  const navigate = useNavigate();

  const handleDelete = async (income: IncomeDocType) => {
    const confirmed = await showAlertDialog(
      'Are you absolutely sure?',
      `This action cannot be undone. This will permanently delete "${income.source_id}".`
    );
    if (confirmed) {
      // Perform the delete action
      await deleteIncome(income.id);
      console.log('File deleted');
    } else {
      console.log('Action canceled');
    }
  };
  const deleteIncome = async (id: string) => {
    if (!db) return;
    const incomeDoc = (await db.incomes.findOne(id).exec()) as RxDocument | null;
    if (incomeDoc) {
      await incomeDoc.remove();
    }
  };

  function handleEdit(id: string) {
    void navigate(`/income/edit/${id}`);
  }

  return (
    <div className="mb-2 flex flex-col rounded-lg bg-gray-100 p-2 shadow-md">
      <div className="hidden">{income.id} </div>
      <div>
        {income.date} - {income.source_id}
      </div>
      <div>${(income.amount / 100).toFixed(2)} CAD</div>
      <div>{income.comment}</div>
      <div>From: {income.from_who}</div>
      <div className="mt-2 flex justify-end space-x-4">
        <button
          className=""
          onClick={() => {
            /* Navigate to edit page */
            handleEdit(income.id);
          }}
        >
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </button>

        <button className="x-button" onClick={() => void handleDelete(income)}>
          <XIcon strokeWidth={4} className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};
