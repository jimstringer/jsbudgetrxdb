import { cancelReplication, syncClient } from '../../database/sync/syncClient';

export const Sync = () => {
  const sync = async () => {
    await syncClient();
  };

  const cancel = async () => {
    cancelReplication();
  };

  return (
    <div className="flex flex-col  bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
      <h1 className="text-2xl flex justify-between px-3 font-bold mb-4">Manage Sync to CouchDB</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={sync}
      >
        Start Sync
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={cancel}
      >
        Stop Sync
      </button>
    </div>
  );
};
