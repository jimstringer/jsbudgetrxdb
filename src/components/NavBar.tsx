// Navbar.js

import { useState , useEffect} from "react";
import { NavLink } from "react-router";
import { ChevronDownIcon } from "@heroicons/react/16/solid";


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
  const [error, setError] = useState("");
  const [checkOnline, setCheckOnline] = useState(false);

  const url = import.meta.env.VITE_SERVER_URL || "http://localhost:3001/";

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

        let intervalId: number;
        if (checkOnline) {
          checkApi(); // Initial check
          intervalId = setInterval(checkApi, 5000); // Check every 5 seconds
        }

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [url, checkOnline]);

  
const navItems: NavItem[] = [
    { id: 1, name: "Home", href: "/" },
    {
      id: 2,
      name: "Expenses",
      href: "",
      subItems: [
        { id: 3, name: "Add Expense", href: "/expense/add" },
        { id: 4, name: "List Expenses", href: "/expense" },
        { id: 12, name: "Categories", href: "/category" },
      ],
    },
    { id:5, name: "Income", href: "",
      subItems: [
        { id: 6, name: "Add Income", href: "/income/add" },
        { id: 7, name: "List Income", href: "/income" },
        { id: 18, name: "Sources", href: "/source" },
      ],
    },
    { id: 8, name: "Reports", href: "", subItems: [
      { id: 9, name: "Yearly Report", href: "/reports/yearly" },
      { id: 10, name: "Monthly Report", href: "/reports/monthly" },
      { id: 11, name: "Year-to-Year Report", href: "/reports/year-to-year" },
    ]},
    { id:13, name: "Backup", href: "", subItems: [
      { id: 14, name: "Export Backup", href: "/backup/export" },
      { id: 15, name: "Import Backup", href: "/backup/import" },
      { id: 16, name: "Import Firebase Backup", href: "/backup/import-fb" },
      { id: 17, name: "Initialize Default Categories", href: "/backup/init-cats" },
    ]},
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
    <nav className="bg-cyan-600 p-2 flex justify-between  sticky top-0 z-1000">
      {/* Brand Name */}
      <a href="/" className=" text-lg font-semibold mr-8">
        JSBudget 2026
      </a>
      <div className="flex items-center mr-4">
        <button
          className="mr-4 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => setCheckOnline(!checkOnline)}
        >
          {checkOnline ? "API disable" : "API enable"}
        </button> 
        {/* API Status Indicator */}
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            isApiUp ? "bg-green-500" : "bg-red-500"
          }`}
          title={isApiUp ? "API is Online" : `API is Offline${error ? `: ${error}` : ""}`}
        ></div>
      </div>
      {/* Navigation Links */}
        {/* bg color must be set when absolute for mobile. */ }
      <div
        className={`flex-col absolute bg-cyan-600 top-16 left-0 p-4 md:relative md:flex md:items-center md:w-auto 
                    md:space-x-4 md:flex-row md:top-0 md:left-0 md:p-0 md:bg-transparent 
                    transition-all duration-500 ease-in-out transform ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-2 xl:space-x-4">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.href === "" ? (
                <span className="block mt-2 md:mt-0 mr-4"
                onClick={(event: React.SyntheticEvent) => toggleMenu(event)}
                >{item.name} <ChevronDownIcon className="w-4 h-4 inline" /></span>
              ) :
                <NavLink
                  key={item.id + 100}
                  to={item.href}
                  className="block mt-2 md:mt-0 hover:text-gray-300 mr-4"
                  onClick={(event) => {
                    setIsOpen(!isOpen); // Close menu on link click
                    toggleMenu(event);
                  } 
                  }
                >
                  {item.name}
                </NavLink>
              }
              {item.subItems && (
                <ul className="mt-2 ml-4 hidden z-50 relative md:absolute md:bg-cyan-600 p-2 rounded-md">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <NavLink
                        to={subItem.href}
                        className="block mt-2 md:mt-0 hover:text-gray-300"
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none md:hidden"
      >
        {/* Hamburger Icon and Close Icon */}
        {isOpen ? (
          <svg
            className="w-6 h-6"
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
            className="w-6 h-6"
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
