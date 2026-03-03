import Source from '../../components/source';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { SourceForm } from './SourceForm';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeSourceDocType } from '../../database/schemas/schemas';

export default function SourceList() {
  //const { sources } = useSource()a
  const [showForm, setShowForm] = useState(false);
  const dbctx = useRxDB();
  const db = dbctx.db;

  const [sources, setsources] = useState<IncomeSourceDocType[]>([]);

  // Fetch sources from the database
  useEffect(() => {
    if (!db) return;
    // Optionally, you can set up a subscription to listen for changes
    const subscription = db.incomeSources.find().$.subscribe((docs) => {
      setsources(docs.map((doc) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">
        sources
        <span title="Add Source">
          <PlusIcon
            title="Add Source"
            className="ml-2 inline h-5 w-5"
            onClick={() => setShowForm(!showForm)}
          />
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
