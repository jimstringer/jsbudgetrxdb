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
		downloadFile({
			data: JSON.stringify(json),
			fileName: "back-up.json",
			fileType: "text/json",
		});
	};

	return (
		<>
			<button
				onClick={() => {
					db.exportJSON().then((json) => exportToJson(json));
				}}
			>
				Export
			</button>
		</>
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
