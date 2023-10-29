import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../images/gamequill.png";
import { getAuth, signOut } from "firebase/auth";
import { Avatar } from "@material-tailwind/react";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

function App() {
    const [user, setUser] = useState(null);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                // User is logged in
                setUser(authUser);

                // Fetch the profile picture from Firestore
                const userDoc = await getDoc(
                    doc(db, "profileData", authUser.uid)
                );
                if (userDoc.exists()) {
                    setProfilePic(userDoc.data().profilePicture);
                }
            } else {
                // User is not logged in
                setUser(null);
                setProfilePic(null);
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

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearch = () => {
        // Redirect to the search page with the search query as a parameter
        window.location.href = `/search?query=${encodeURIComponent(
            searchQuery
        )}`;
    };

    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <nav className="border-gray-200 bg-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/Home" className="flex items-center">
                    <img
                        src={logo}
                        className="h-20 mr-10"
                        alt="GameQuill Logo"
                    />
                </Link>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleEnterKey}
                        placeholder="Search for games or users"
                        className="bg-gray-200 p-2 rounded mr-2"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Search
                    </button>
                </div>
                <div
                    className="hidden w-full md:block md:w-auto"
                    id="navbar-default"
                >
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-600 md:bg-gray-600 border-gray-700">
                        
                        
                        <li>
                            {user ? (
                                <div className="relative">
                                    <Avatar
                                        src={
                                            profilePic ||
                                            "path_to_default_avatar.png"
                                        }
                                        className="rounded-full w-12 h-12"
                                        onClick={() =>
                                            setShowLogoutConfirmation(
                                                !showLogoutConfirmation
                                            )
                                        }
                                    />

                                    {showLogoutConfirmation && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                            <Link
                                               to={`/Profile?user_id=${user.uid}`}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Edit Profile
                                            </Link>
                                            <button
                                                onClick={confirmLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-500 dark:hover:text-white md:dark:hover:bg-transparent"
                                >
                                    Login/Sign Up
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default App;
