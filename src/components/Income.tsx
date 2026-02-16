import type { IncomeDocType } from "../database/schemas/schemas";


export const Income = ({ income }: { income: IncomeDocType }) => {


  return (
    <div className="flex flex-col  bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
      <div>
        {income.date} - {income.source_id}
      </div>
      <div>${(income.amount / 100).toFixed(2)} CAD</div>
      <div>{income.comment}</div>
      <div>From: {income.from_who}</div>
      <button
        className="x-button"
        onClick={() => {
          //triplit.delete("expenses", expense.id);
        }}
      >
        ❌
      </button>
    </div>
  )
};

