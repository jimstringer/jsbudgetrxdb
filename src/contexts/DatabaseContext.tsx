import { createContext } from "react";

import type { JsBudgetDatabase } from "../database/db";

export interface IDatabaseContext {
  db: JsBudgetDatabase | undefined;
  loading: boolean;
  error: string | null;
  //ofMonths: number;
  //removeExpanse: any;
  //addExpanse: any;
  //clearExpanses: any;
  //seedDb: any;
}

export const DatabaseContext = createContext<IDatabaseContext>({
  db: undefined,
  loading: false,
  error: null,
  //ofMonths: 0,
  //removeExpanse: null,
  //addExpanse: null,
  //clearExpanses: null,
  //seedDb: null,
});