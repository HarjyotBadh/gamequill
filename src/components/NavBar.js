import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../images/gamequill.png";
import { getAuth, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is logged in
        setUser(authUser);
      } else {
        // User is not logged in
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setShowLogoutConfirmation(false);
      // Redirect to the home page or another desired page after logging out.
      window.location.href = "/home";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

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
              {user ? (
                <Link
                  to={`/Profile?user_id=${user.uid}`}
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded  md:hover:bg-transparent md:border-0  md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-600 hover:text-white md:hover:bg-transparent"
                >
                  Profile
                </Link>
              )}
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
              {user ? (
                <button
                  onClick={handleLogout}
                  class="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-500 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  class="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-500 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Login/Sign Up
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      {showLogoutConfirmation && (
        <div className="logout-confirmation-popup">
          <p>Are you sure you want to log out?</p>
          <button onClick={confirmLogout}>OK</button>
          <button onClick={cancelLogout}>Cancel</button>
        </div>
      )}
    </nav>
  );
}
export default App;
