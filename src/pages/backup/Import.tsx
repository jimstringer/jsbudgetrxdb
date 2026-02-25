//import { Import } from "../../components/ExportImport";
import { useRef } from "react";
import useRxDB from "../../hooks/useRxDB";
import type { JsBudgetDatabase ,JSDatabaseCollections} from "../../database/db";
import type { RxDumpDatabaseAny } from "rxdb";


export const ImportPage = () => {   
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