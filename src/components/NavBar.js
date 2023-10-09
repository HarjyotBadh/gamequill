import { Link } from "react-router-dom";
import React from "react";
import logo from "../images/gamequill.png";
function App() {
  return (
    <nav class="border-gray-200 bg-gray-600">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/Home" class="flex items-center">
          <img src={logo} class="h-20 mr-10" alt="GameQuill Logo"></img>
        </Link>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0  bg-gray-600 md:bg-gray-600 border-gray-700">
            <li>
              <a
                href="/Home"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <Link
                to="/Profile"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/Game"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                to="/Login"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
              >
                Login/Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default App;
