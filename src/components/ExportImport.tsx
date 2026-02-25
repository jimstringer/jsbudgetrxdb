import { useRef } from "react";
import useRxDB from "../hooks/useRxDB";
import type { JsBudgetDatabase ,JSDatabaseCollections} from "../database/db";
import type { RxDumpDatabaseAny } from "rxdb";

interface DownloadFileParams {
		data: string | Blob;
		fileName: string;
		fileType: string;
	}

export const Export = () => {
	const dbctx = useRxDB();
	const db = dbctx.db;

	if (!db) {
		console.warn("No database instance found");
		return null;
	}

	

	const downloadFile = ({ data, fileName, fileType }: DownloadFileParams) => {
		// Create a blob with the data we want to download as a file
		const blob = new Blob([data], { type: fileType });
		// Create an anchor element and dispatch a click event on it
		// to trigger a download
		const a = document.createElement("a");
		a.download = fileName;
		a.href = window.URL.createObjectURL(blob);
		const clickEvt = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		a.dispatchEvent(clickEvt);
		a.remove();
	};

	const exportToJson = (json: unknown) => {
		const on = new Date().toISOString().split("T")[0];
		downloadFile({
			data: JSON.stringify(json),
			fileName: on + "-back-up.json",
			fileType: "text/json",
		});
	};

	return (
		<div className="flex  flex-col items-center justify-center bg-gray-100 p-2 mb-2 rounded-lg shadow-md">
			<h1 className="text-xl font-bold">Export to a local file</h1>
			<p className="text-gray-600">You can export the database to a local file</p>
			<p className="text-gray-600">You can import the database from this file</p>
			<button
				type="button"
				className="text-small px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
				onClick={() => {
					db.exportJSON().then((json) => exportToJson(json));
				}}
			>
				Export
			</button>
		</div>
	);
};

export const Import = () => {
	const dbctx = useRxDB();
	const db = dbctx.db as JsBudgetDatabase;
	//const jsonFromFile = useRef<File | null>(null);
	const jsonFromFile = useRef<RxDumpDatabaseAny<JSDatabaseCollections> | null>(null);
	
	

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			const jsonString = e.target?.result;
			console.log(jsonString);
			if (jsonString) {
				jsonFromFile.current = JSON.parse(jsonString as string);
			}
		};
	};
	return (
		<div>
			<input type="file" onChange={handleChange} />
			<button
				onClick={() => {
				db.importJSON(jsonFromFile.current as unknown as RxDumpDatabaseAny<JSDatabaseCollections>)
						.then(() => console.log("done"))
						.catch(console.log);
				}}
			>
				Import
			</button>
		</div>
	);
};
