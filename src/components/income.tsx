import { PencilIcon } from '@heroicons/react/16/solid';
import type { IncomeDocType } from '../database/schemas/schemas';
import { useNavigate } from 'react-router';
import useRxDB from '../hooks/useRxDB';
import showAlertDialog from './show-alert-dialog';

export const Income = ({ income }: { income: IncomeDocType }) => {
  const { db } = useRxDB();
  const navigate = useNavigate();


  const handleDelete = async (income: IncomeDocType) => {
  const confirmed = await showAlertDialog("Are you absolutely sure?", 
    `This action cannot be undone. This will permanently delete "${income.source_id}".`);
  if (confirmed) {
    // Perform the delete action
    deleteIncome(income.id);
    console.log("File deleted");
  } else {
    console.log("Action canceled");
  }
};
  const deleteIncome = async (id: string) => {
    if (!db) return;
    const incomeDoc = await db.incomes.findOne(id).exec();
    if (incomeDoc) {
      await incomeDoc.remove();
    }
  };

  function handleEdit(id: string) {
    navigate(`/income/edit/${id}`);
  }

  return (
    <div className="flex flex-col  bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
      <div className="hidden">{income.id} </div>
      <div>
        {income.date} - {income.source_id}
      </div>
      <div>${(income.amount / 100).toFixed(2)} CAD</div>
      <div>{income.comment}</div>
      <div>From: {income.from_who}</div>
      <div className="flex space-x-4 mt-2 justify-end">
        <button
          className=""
          onClick={() => {
            /* Navigate to edit page */
            handleEdit(income.id);
          }}
        >
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </button>

        <button
          className="x-button"
          onClick={ () => handleDelete(income) }
        >
          ❌
        </button>
      </div>
    </div>
  );
};
