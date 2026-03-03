// Navbar.js

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

interface NavItem {
  id: number; // used for key prop
  name: string;
  href: string;
  subItems?: NavItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  //we want to display online state in the navbar
  const [isApiUp, setIsApiUp] = useState(false);
  const [error, setError] = useState('');
  const [checkOnline, setCheckOnline] = useState(false);

  const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001/';

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
          setIsApiUp(true);
        } else {
          setIsApiUp(false);
        }
      } catch (err: unknown) {
        setIsApiUp(false);
        setError((err as Error).message);
      }
    };

    let intervalId: NodeJS.Timeout;
    if (checkOnline) {
      checkApi(); // Initial check
      intervalId = setInterval(checkApi, 5000); // Check every 5 seconds
    }

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [url, checkOnline]);

  const navItems: NavItem[] = [
    { id: 1, name: 'Home', href: '/' },
    {
      id: 2,
      name: 'Expenses',
      href: '',
      subItems: [
        { id: 3, name: 'Add Expense', href: '/expense/add' },
        { id: 4, name: 'List Expenses', href: '/expense' },
        { id: 12, name: 'Categories', href: '/category' },
      ],
    },
    {
      id: 5,
      name: 'Income',
      href: '',
      subItems: [
        { id: 6, name: 'Add Income', href: '/income/add' },
        { id: 7, name: 'List Income', href: '/income' },
        { id: 18, name: 'Sources', href: '/source' },
      ],
    },
    {
      id: 8,
      name: 'Reports',
      href: '',
      subItems: [
        { id: 9, name: 'Yearly Report', href: '/reports/yearly' },
        { id: 10, name: 'Monthly Report', href: '/reports/monthly' },
        { id: 11, name: 'Year-to-Year Report', href: '/reports/year-to-year' },
      ],
    },
    {
      id: 13,
      name: 'Backup',
      href: '',
      subItems: [
        { id: 14, name: 'Export Backup', href: '/backup/export' },
        { id: 15, name: 'Import Backup', href: '/backup/import' },
        { id: 16, name: 'Import Firebase Backup', href: '/backup/import-fb' },
        { id: 17, name: 'Initialize Default Categories', href: '/backup/init-cats' },
        { id: 19, name: 'Sync', href: '/backup/sync' },
      ],
    },
  ];

  const toggleMenu = (event: React.SyntheticEvent) => {
    //event.currentTarget.classList.toggle('bg-salmon');
    const parent = event.currentTarget.parentElement;
    if (parent) {
      const subMenu = parent.querySelector('ul');
      if (subMenu) {
        if (subMenu.classList.contains('hidden')) {
          subMenu.classList.remove('hidden');
          event.currentTarget.innerHTML = `${event.currentTarget.textContent?.trim()} <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>`;
          //here I want to hide any other open submenus
          const allSubMenus = document.querySelectorAll('nav ul ul');
          allSubMenus.forEach((menu) => {
            if (menu !== subMenu) {
              menu.classList.add('hidden');
              const parentSpan = menu.parentElement?.querySelector('span');
              if (parentSpan) {
                parentSpan.innerHTML = `${parentSpan.textContent?.trim()} <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`;
              }
            }
          });
        } else {
          subMenu.classList.add('hidden');
          event.currentTarget.innerHTML = `${event.currentTarget.textContent?.trim()} <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`;
        }
      } else {
        // No submenu so close all other submenus
        const allSubMenus = document.querySelectorAll('nav ul ul');
        allSubMenus.forEach((menu) => {
          menu.classList.add('hidden');
          const parentSpan = menu.parentElement?.querySelector('span');
          if (parentSpan) {
            parentSpan.innerHTML = `${parentSpan.textContent?.trim()} <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`;
          }
        });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-1000 flex justify-between bg-cyan-600 p-2 text-lg">
      {/* Brand Name */}
      <a href="/" className="mr-8 text-lg font-semibold">
        JSBudget 2026
      </a>
      <div className="mr-4 flex items-center text-base">
        <button
          className="mr-4 rounded bg-blue-500 px-2 py-1 text-white"
          onClick={() => setCheckOnline(!checkOnline)}
        >
          {checkOnline ? 'API disable' : 'API enable'}
        </button>
        {/* API Status Indicator */}
        <div
          className={`mr-2 h-3 w-3 rounded-full ${isApiUp ? 'bg-green-500' : 'bg-red-500'}`}
          title={isApiUp ? 'API is Online' : `API is Offline${error ? `: ${error}` : ''}`}
        ></div>
      </div>
      {/* Navigation Links */}
      {/* bg color must be set when absolute for mobile. */}
      <div
        className={`absolute top-16 left-0 transform flex-col bg-cyan-600 p-4 transition-all duration-500 ease-in-out md:relative md:top-0 md:left-0 md:flex md:w-auto md:flex-row md:items-center md:space-x-4 md:bg-transparent md:p-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <ul className="flex flex-col text-2xl md:flex-row md:space-x-2 md:text-lg xl:space-x-4">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.href === '' ? (
                <span
                  className="mt-2 mr-4 block md:mt-0"
                  onClick={(event: React.SyntheticEvent) => toggleMenu(event)}
                >
                  {item.name} <ChevronDownIcon className="inline h-4 w-4" />
                </span>
              ) : (
                <NavLink
                  key={item.id + 100}
                  to={item.href}
                  className="mt-2 mr-4 block hover:text-gray-300 md:mt-0"
                  onClick={(event) => {
                    setIsOpen(!isOpen); // Close menu on link click
                    toggleMenu(event);
                  }}
                >
                  {item.name}
                </NavLink>
              )}
              {item.subItems && (
                <ul className="relative z-50 mt-2 ml-4 hidden rounded-md p-2 md:absolute md:bg-cyan-600">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <NavLink
                        to={subItem.href}
                        className="mt-2 block hover:text-gray-300 md:mt-0"
                        onClick={(event) => {
                          setIsOpen(!isOpen); // Close menu on link click
                          toggleMenu(event);
                        }}
                      >
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Hamburger Menu for mobile */}
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none md:hidden">
        {/* Hamburger Icon and Close Icon */}
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
