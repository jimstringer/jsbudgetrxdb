import { use } from "react";
import { DatabaseContext } from "../contexts/DatabaseContext";

// Add your custom hook logic here
const useRxDB = () => {
    const { db, loading, error } = use(DatabaseContext);
    return { db, loading, error }; 
};

export default useRxDB;