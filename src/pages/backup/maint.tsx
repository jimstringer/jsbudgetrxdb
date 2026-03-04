// This is a placeholder for the maintenance page
// should implement backup and restore and delete data
import showAlertDialog from '@/components/show-alert-dialog';
import useRxDB from '../../hooks/useRxDB';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { JSDatabaseCollections } from '../../database/db';
import type { RxDumpDatabaseAny } from 'rxdb';
import { useRef } from 'react';

interface DownloadFileParams {
  data: string | Blob;
  fileName: string;
  fileType: string;
}

const readJsonFile = (file: Blob) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target) {
        resolve(JSON.parse(event.target.result as string));
      }
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });

export const Maint = () => {
  const jsonFromFile = useRef<RxDumpDatabaseAny<JSDatabaseCollections> | null>(null);
  const { db, loading, error } = useRxDB();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading database...</div>;
  }

  if (!db) {
    return <div>No database instance found</div>;
  }

  const handleDelete = async () => {
    if (!db) return;
    try {
      const confirmed = await showAlertDialog(
        'Are you absolutely sure?',
        `This action cannot be undone. This will permanently delete all data.`
      );
      if (confirmed) {
        // Perform the delete action
        await db.expenses.find().remove();
        await db.expenses.cleanup(0); //runs cleanup immediately
        await db.incomes.find().remove();
        await db.incomes.cleanup(0); //runs cleanup immediately
        toast.success('Database deleted');
        console.log('Database deleted');
      } else {
        toast.error('Action canceled');
        console.log('Action canceled');
      }
    } catch (error) {
      toast.error('Error deleting database');
      console.error(error);
    }
  };

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

  const handleBackup = async () => {
    if (!db) return;
    try {
      const on = new Date().toISOString();
      const fileName = on + '-back-up.json';
      const confirmed = await showAlertDialog(
        `Backup all data?`,
        `This will create a backup named ${fileName}.`
      );
      if (confirmed) {
        const json = await db.exportJSON();
        downloadFile({
          data: JSON.stringify(json),
          fileName: fileName,
          fileType: 'text/json',
        });
        localStorage.setItem('lastExportDate', on);
        toast.success('Backup created');
      } else {
        toast.error('Action canceled');
        console.log('Action canceled');
      }
    } catch (error) {
      toast.error('Error creating backup');
      console.error('Error creating backup:', error);
    }
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      try {
        jsonFromFile.current = (await readJsonFile(
          event.target.files[0]
        )) as RxDumpDatabaseAny<JSDatabaseCollections>;
      } catch (error) {
        toast.error('Error reading file');
        console.error('Error reading file:', error);
      }
    }
  };

  const handleRestore = async () => {
    if (!db) return;
    if (!jsonFromFile.current) {
      toast.error('No backup file found. Select a file first.');
      return;
    }
    try {
      const confirmed = await showAlertDialog(
        'Are you sure?',
        `This will delete all data and replace it with the backup data.`
      );
      if (confirmed) {
        // Perform the restore action
        db.importJSON(jsonFromFile.current as unknown as RxDumpDatabaseAny<JSDatabaseCollections>);
        toast.success('Database restored');
        console.log('Database restored');
      } else {
        toast.error('Action canceled');
        console.log('Action canceled');
      }
    } catch (error) {
      toast.error('Error restoring database');
      console.error(error);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-white p-4 shadow">
      <h3>Maintenance</h3>
      <div className="my-2 flex flex-col justify-between gap-2 md:flex-row">
        <Button className="mt-8 p-4" onClick={handleBackup}>
          Backup
        </Button>
        <Button onClick={handleRestore} className="mt-8 p-4">Restore</Button>
        <Button className="mt-8 p-4" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="my-2 flex flex-col justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Last export: {localStorage.getItem('lastExportDate')}
        </p>
        <p className="text-muted-foreground text-sm">
          Last import: {localStorage.getItem('lastImportDate')}
        </p>
        <p className="text-muted-foreground text-sm">To restore, first select a backup file.</p>
        <input
          type="file"
          onChange={onChange}
          className="text-sm text-stone-500 file:mr-5 file:border file:bg-stone-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
        />
      </div>
    </div>
  );
};
