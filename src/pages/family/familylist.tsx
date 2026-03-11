//List the family members in the database. This is where you can add new family members and delete existing ones.
import useRxDB from '@/hooks/useRxDB';
import { useEffect, useState } from 'react';
import { FamilyMember } from '@/components/familymember';
import type { familyMemberDocType } from '@/database/schemas/schemas';
import { Minus, Plus } from 'lucide-react';
import { FamilyForm } from './familyform';

export const FamilyList = () => {
  const { db } = useRxDB();
  const [familyMembers, setFamilyMembers] = useState<familyMemberDocType[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!db) return;

    const sub = db.familyMembers.find({sort:[{name: 'asc'}]}).$.subscribe((data) => {
      setFamilyMembers(data);
    });
    return () => sub.unsubscribe();
    /* void (async () => {
      try {
        //TODO: change to subscribe so that it updates in real time when family members are added or deleted
        const familyMembersFromDB = await db.familyMembers.find().exec();
        setFamilyMembers(
          familyMembersFromDB.map((doc: RxDocument<familyMemberDocType>) => doc.toJSON())
        );
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    })(); */
  }, [db]);

  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">
        Family Members
        <span title="Add Family Member" onClick={() => setShowForm(!showForm)}>
          <Plus className={`ml-2 h-5 w-5 ${showForm ? 'hidden' : 'block'}`} />
          <Minus className={`ml-2 h-5 w-5 ${showForm ? 'block' : 'hidden'}`} />
        </span>
      </h1>
      <div>
        {showForm && (
          <div className="mb-4 rounded border bg-white p-3 shadow">
            {/* Family Member Form Component */}
            <FamilyForm />
          </div>
        )}
      </div>
      <div>
        {familyMembers.map((member) => (
          <FamilyMember key={member.name} familyMember={member} />
        ))}
      </div>
    </div>
  );
};

export default FamilyList;
