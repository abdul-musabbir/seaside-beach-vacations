import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SeasideVacationLogo from "../assets/seasidebeachvacationslogo.png";
export default function Header() {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <nav className="bg-white sticky w-full z-20 top-0 start-0 border-b border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={SeasideVacationLogo} alt="logo" />
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
          >
            Get started
          </button>
          <button
            onClick={() => setShowDropDown((prev) => !prev)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between absolute md:static md:top-0 md:left-0 md:px-0 top-20 left-0 px-3 sm:px-10 w-full md:flex md:w-auto md:order-1 ${
            showDropDown ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            <li>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                    : "block py-2 px-3 text-black bg-transparent rounded-sm md:bg-transparent  md:p-0"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/house"}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                    : "block py-2 px-3 text-black bg-transparent rounded-sm md:bg-transparent  md:p-0"
                }
              >
                House
              </NavLink>
            </li>
            <li>
              <Link
                to={"/features"}
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to={"/how-to-book"}
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
              >
                How To Book
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
