import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
//import { TotalsBar } from "../components/TotalsBar";

export const Layout = () => {
  return (
    <main className="min-h-screen w-full overflow-auto bg-sky-200 dark:bg-gray-900">
      <NavBar />
      <Outlet />
    </main>
  );
};
