import { createHashRouter } from "react-router";
import { Home } from "./pages/home/Home";
import { Layout } from "./layouts/Layout";
import { PageNotFound } from "./pages/error/PageNotFound";
import { YearToYear } from "./pages/reports/YearToYear";
import { Monthly } from "./pages/reports/Monthly";
import { Yearly } from "./pages/reports/Yearly";
import ExpenseList from "./pages/expenses/ExpenseList";
import ExpenseForm from "./pages/expenses/ExpenseForm";
import { IncomeList } from "./pages/incomes/IncomeList";
import { IncomeForm } from "./pages/incomes/IncomeForm";
import CategoryList from "./pages/category/CategoryList";
import { ExportPage } from "./pages/backup/Export";
import { ImportPage } from "./pages/backup/Import";
import { ImportFB } from "./pages/backup/ImportFB";
import { InitCats } from "./pages/backup/InitCats";
import ExpenseEdit from "./pages/expenses/ExpenseEdit";
import SourceList  from "./pages/source/SourceList";

export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      {
        path: "expense",
        children: [
          { index: true, path: ":date?", Component: ExpenseList },
          { path: "edit/:id", Component: ExpenseEdit },
          { path: "add", Component: ExpenseForm },
        ],
      },
      {
        path: "income",
        children: [
          { index: true, Component: IncomeList },
          { path: "edit/:tid?", Component: IncomeForm },
          { path: "add", Component: IncomeForm },
        ],
      },
      {
        path: "category",
        children: [{ index: true, Component: CategoryList }],
      },
      {
        path: "source",
        children: [{ index: true, Component: SourceList }],
      },
      {
        path: "reports",
        children: [
          { path: "year-to-year", Component: YearToYear },
          { path: "monthly", Component: Monthly },
          { path: "yearly", Component: Yearly },
        ],
      },
      {
        path: "backup",
        children: [   
          { path: "export", Component: ExportPage },
          { path: "import", Component: ImportPage },
          { path: "import-fb", Component: ImportFB },  // Import from firebase backup
          { path: "init-cats", Component: InitCats }, //  InitCats component
        ],
      },
    ],  
  },
  { path: "*", Component: PageNotFound }, // Fallback route
]);
