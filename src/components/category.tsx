import { XMarkIcon } from '@heroicons/react/16/solid';
import type { CategoryDocType } from '../database/schemas/schemas';
import showAlertDialog from './show-alert-dialog';

export default function Category({ category }: { category: CategoryDocType }) {

  const handleDelete = async () => {
  const confirmed = await showAlertDialog("Are you absolutely sure?", 
    `This action cannot be undone. This will permanently delete "${category.name}".`);
  if (confirmed) {
    // Perform the delete action
    console.log("File deleted");
  } else {
    console.log("Action canceled");
  }
};

  return (
    <div className="px-3 py-2 border-b flex justify-between items-center">
      {category.name}
      <button
        disabled={false}
        className=""
        onClick= {handleDelete}
      >
        <XMarkIcon className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
