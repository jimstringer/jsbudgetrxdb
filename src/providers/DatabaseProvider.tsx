import React, { useState, useEffect } from "react";
import { DatabaseContext } from "../contexts/DatabaseContext";
import { initDatabase } from "../database/db";
import type { JsBudgetDatabase } from "../database/db";
import { RxError } from "rxdb";

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [db, setDb] = useState<JsBudgetDatabase | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const expensesDb = await initDatabase();
        setDb(expensesDb);
        setLoading(false);

        return () => {
          // Cleanup logic if needed
        };
      } catch (error) {
        if (error instanceof RxError) {
          setError(error.message);
          console.error("RxDB Error:", error.message, error.parameters);
        } else {
          setError("An unexpected error occurred");
          console.error("Unexpected Error:", error);
        }
      }
    })();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        db,
        loading,
        error,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
