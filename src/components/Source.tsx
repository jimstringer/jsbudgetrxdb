import { XMarkIcon } from "@heroicons/react/16/solid";
import { useConfirmAlert } from "../hooks/UseConfirmAlert";
import type { IncomeSourceDocType } from "../database/schemas/schemas";


export default function Source({ source }: { source: IncomeSourceDocType }) {
  const showConfirmAlert = useConfirmAlert();

  return (
    <div className="px-3 py-2 border-b flex justify-between items-center">
      {source.name}
      <button
        disabled={false}
        className=""
        onClick={() => {
          showConfirmAlert.showAlert({
            title: `Delete Source "${source.name}"?`,
            confirmMessage: "This action cannot be undone.",
            onConfirm: async () => {
            },
          });
        }}
      >
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
