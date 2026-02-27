//import { Export } from "../../components/ExportImport";
//import { useState } from "react";
import useRxDB from '../../hooks/useRxDB';
import { JsButton } from '../../components/JsButton';
//import type { JsBudgetDatabase ,JSDatabaseCollections} from "../database/db";
//import type { RxDumpDatabaseAny } from "rxdb";

//TODO: store the last export date in local storage. Add code to remind user to export weekly.

interface DownloadFileParams {
  data: string | Blob;
  fileName: string;
  fileType: string;
}

export const ExportPage = () => {
  const { db, loading, error } = useRxDB(); // Get the database instance

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading database...</div>;
  }

  if (!db) {
    return <div>No database instance found</div>;
  }

  const downloadFile = ({ data, fileName, fileType }: DownloadFileParams) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToJson = (json: unknown) => {
    //const on = new Date().toISOString().split("T")[0];
    const on = new Date().toISOString();
    //Write the date string with time to local storage with key "lastExportDate"
    localStorage.setItem('lastExportDate', on);
    downloadFile({
      data: JSON.stringify(json),
      fileName: on + '-back-up.json',
      fileType: 'text/json',
    });
  };

  return (
    <div className="flex  flex-col items-center justify-center bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
      <h1 className="text-xl font-bold">Export to a local file</h1>
      <p className="text-gray-600">You can export the database to a local file</p>
      <p className="text-gray-600">You can import the database from this file</p>
      <JsButton
        label="Export"
        onClick={() => {
          db.exportJSON().then((json) => exportToJson(json));
        }}
      />
    </div>
  );
};
