import { cancelReplication, syncClient } from '../../database/sync/syncClient';

export const Sync = () => {
  const sync = async () => {
    await syncClient();
  };

  const cancel = async () => {
    cancelReplication();
  };

  return (
    <div className="mb-2 flex flex-col rounded-lg bg-gray-100 p-2 shadow-md">
      <h1 className="mb-4 flex justify-between px-3 text-2xl font-bold">Manage Sync to CouchDB</h1>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={sync}
      >
        Start Sync
      </button>
      <button
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        onClick={cancel}
      >
        Stop Sync
      </button>
    </div>
  );
};
