import { XMarkIcon } from "@heroicons/react/16/solid";
import { useConfirmAlert } from "../hooks/UseConfirmAlert";
import type { CategoryDocType } from "../database/schemas/schemas";


export default function Category({ category }: { category: CategoryDocType }) {
  const showConfirmAlert = useConfirmAlert();

  return (
    <div className="px-3 py-2 border-b flex justify-between items-center">
      {category.name}
      <button
        disabled={false}
        className=""
        onClick={() => {
          showConfirmAlert.showAlert({
            title: `Delete Category "${category.name}"?`,
            confirmMessage: "This action cannot be undone.",
            onConfirm: async () => {
              //await triplit.delete("categorys", category.id);
            },
          });
          // await triplit.delete("categorys", category.id);
        }}
      >
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
