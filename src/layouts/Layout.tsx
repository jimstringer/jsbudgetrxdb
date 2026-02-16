import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
//import { TotalsBar } from "../components/TotalsBar";

export const Layout = () => {
  return (
    <main className="w-full min-h-screen bg-sky-200 dark:bg-gray-900">
      <NavBar />
      <Outlet />
    </main>
  );
};
