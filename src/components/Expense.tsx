import type { ExpenseDocType } from "../database/schemas/schemas";
import { PencilIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import useRxDB from "../hooks/useRxDB";
import { useNavigate } from "react-router";

export default function Expense({ expense }: { expense: ExpenseDocType }) {

  const { db } = useRxDB();
  const navigate = useNavigate();
  
  const deleteExpense = async (id: string) => {
    if (!db) return;
    const expenseDoc = await db.expenses.findOne(id).exec();
    if (expenseDoc) {
      await expenseDoc.remove();
    }
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page
    navigate(`/expense/edit/${id}`);
  };

  return (
    <div className="flex flex-col  bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
      <div>
        {expense.date} - {expense.category_id}
      </div>
      <div>${(expense.amount / 100).toFixed(2)} CAD</div>
      <div>{expense.comment}</div>
      <div>For: {expense.for_who}</div>
      <div className="flex space-x-4 mt-2 justify-end">
        <button
          className=""
          onClick={() => {
            /* Navigate to edit page */
            handleEdit(expense.id);
          }}
        >
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </button>
        <button
          className="x-button"
          onClick={() => {
            deleteExpense(expense.id);
          }}
        >
          <XMarkIcon className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
