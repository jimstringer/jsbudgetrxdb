import Source from '../../components/source';
import { useEffect, useState } from 'react';
import { SourceForm } from './SourceForm';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeSourceDocType } from '../../database/schemas/schemas';
import type { RxDocument } from 'rxdb';
import { Minus, Plus } from 'lucide-react';

export default function SourceList() {
  //const { sources } = useSource()a
  const [showForm, setShowForm] = useState(false);
  const dbctx = useRxDB();
  const db = dbctx.db;

  const [sources, setsources] = useState<IncomeSourceDocType[]>([]);

  // Fetch sources from the database
  useEffect(() => {
    if (!db) return;

    // This is needed because otherwise the list won't update in real time when sources are added or deleted
    const subscription = db.incomeSources.find().$.subscribe((docs) => {
      setsources(docs.map((doc: RxDocument<IncomeSourceDocType>) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">
        Income Sources
        <span title="Add Source" onClick={() => setShowForm(!showForm)}>
          <Plus className={`ml-2 h-5 w-5 ${showForm ? 'hidden' : 'block'}`} />
          <Minus className={`ml-2 h-5 w-5 ${showForm ? 'block' : 'hidden'}`} />
        </span>
      </h1>
      <div>
        {showForm && (
          <div className="mb-4 rounded border bg-white p-3 shadow">
            {/* Source Form Component */}
            <SourceForm sources={sources} />
          </div>
        )}
      </div>
      <div>
        {sources?.map((source) => (
          <Source key={source.name} source={source} />
        ))}
      </div>
    </div>
  );
}
