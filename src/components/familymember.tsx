// Show a single family member, with option to delete or edit the name.
// Don't allow deletion if there are any expenses or incomes associated with that family member.
import useRxDB from '@/hooks/useRxDB';
import { XIcon } from 'lucide-react';
import type { familyMemberDocType } from '@/database/schemas/schemas';
import type { RxDocument } from 'rxdb';

export const FamilyMember = ({ familyMember }: { familyMember: familyMemberDocType }) => {
  const { db } = useRxDB();

  const handleDelete = async (familyMemberToDelete: familyMemberDocType) => {
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    try {
      //get a count of how many expenses are associated with this family member and show that in the confirmation dialog
      const expenseCount = await db.expenses
        .count()
        .where('for_who')
        .equals(familyMemberToDelete.name)
        .exec();
      const incomeCount = await db.incomes
        .count()
        .where('from_who')
        .equals(familyMemberToDelete.name)
        .exec();
      if (expenseCount > 0 || incomeCount > 0) {
        console.error(
          `Cannot delete family member "${familyMemberToDelete.name}" because it has ${expenseCount} associated expenses and ${incomeCount} associated incomes.`
        );
        return;
      }
      const confirmed = window.confirm(
        `Are you absolutely sure? This action cannot be undone. This will permanently delete "${familyMemberToDelete.name}".`
      );
      if (confirmed) {
        // Perform the delete action
        await db.familyMembers
          .findOne(familyMemberToDelete.name)
          .exec()
          .then((doc: RxDocument<familyMemberDocType> | null) => doc?.remove());
        console.log(`Family member "${familyMemberToDelete.name}" deleted.`);
      } else {
        console.log('Action canceled');
      }
    } catch (error) {
      console.error('Error during delete confirmation:', error);
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      {familyMember.name}
      <button disabled={false} className="" onClick={() => void handleDelete(familyMember)}>
        <XIcon strokeWidth={4} className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
};
