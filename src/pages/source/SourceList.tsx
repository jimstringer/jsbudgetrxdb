import Source from '../../components/source';
import { useEffect, useState } from 'react';
import { SourceForm } from './SourceForm';
import useRxDB from '../../hooks/useRxDB';
import type { IncomeSourceDocType } from '../../database/schemas/schemas';
import type { RxDocument } from 'rxdb';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function SourceList() {
  //const { sources } = useSource()a
  const [showForm, setShowForm] = useState(false);
  const dbctx = useRxDB();
  const db = dbctx.db;

  const [sources, setsources] = useState<IncomeSourceDocType[]>([]);

  // Fetch sources from the database
  useEffect(() => {
    if (!db) return;

    void (async () => {
      try {
      const sourceCollection = db.incomeSources;
      const allSources = await sourceCollection.find().exec();
      setsources(allSources.map((src: RxDocument<IncomeSourceDocType>) => src.toJSON()));
    } catch (error) {
        console.error('Error fetching sources:', error);
        toast.error('An error occurred while fetching sources. Please try again.');
    }
    })();
    /* // Optionally, you can set up a subscription to listen for changes
    const subscription = db.incomeSources.find().$.subscribe((docs) => {
      setsources(docs.map((doc: RxDocument<IncomeSourceDocType>) => doc.toJSON()));
    });

    return () => {
      subscription.unsubscribe();
    }; */
  }, [db]);
  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">
        sources
        <span title="Add Source">
          <Plus
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
