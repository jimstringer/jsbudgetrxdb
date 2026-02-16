import { useContext } from "react";
import { DatabaseContext } from "../contexts/DatabaseContext";

// Add your custom hook logic here
const useRxDB = () => {
    const { db, loading, error } = useContext(DatabaseContext);
    return { db, loading, error }; 
};

export default useRxDB;