import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
import { Toaster } from '@/components/ui/sonner';

export const Layout = () => {
  return (
    <main className="min-h-screen w-full overflow-auto bg-sky-200 dark:bg-gray-900">
      <NavBar />
      <Toaster position="top-center" />
      <Outlet />
    </main>
  );
};
