import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../images/gamequill.png";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Avatar } from "@material-tailwind/react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import SalesNotifications from "./SalesNotifications";

function App() {
    const [user, setUser] = useState(null);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();
    const [isSalesNotificationOpen, setIsSalesNotificationOpen] =
        useState(false);
    const [isNotificationBellOpen, setIsNotificationBellOpen] = useState(false);

    const [selectedPlatform, setSelectedPlatform] = useState("All Platform"); // Initial selected genre

    const gamePlatforms = [
        { value: "select-platform", label: "Select Platform" },
    ];
    const gameGenres = [
        { value: "select-genre", label: "Select Genre" },
        { value: "point-and-click", label: "Point-and-Click" },
        { value: "fighting", label: "Fighting" },
        { value: "shooter", label: "Shooter" },
        { value: "music", label: "Music" },
        { value: "platform", label: "Platform" },
        { value: "puzzle", label: "Puzzle" },
        { value: "racing", label: "Racing" },
        { value: "real-time-strategy", label: "Real Time Strategy (RTS)" },
        { value: "role-playing", label: "Role-playing (RPG)" },
        { value: "simulator", label: "Simulator" },
        { value: "sport", label: "Sport" },
        { value: "strategy", label: "Strategy" },
        { value: "turn-based-strategy", label: "Turn-based Strategy (TBS)" },
        { value: "tactical", label: "Tactical" },
        { value: "quiz-trivia", label: "Quiz/Trivia" },
        {
            value: "hack-and-slash-beat-em-up",
            label: "Hack and Slash/Beat 'em Up",
        },
        { value: "pinball", label: "Pinball" },
        { value: "adventure", label: "Adventure" },
        { value: "arcade", label: "Arcade" },
        { value: "visual-novel", label: "Visual Novel" },
        { value: "indie", label: "Indie" },
        { value: "card-board-game", label: "Card & Board Game" },
        { value: "moba", label: "MOBA" },
    ];
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

    const toggleSalesNotificationPanel = () => {
        setIsSalesNotificationOpen(!isSalesNotificationOpen);
        setIsNotificationBellOpen(false); // Close the NotificationBell when opening SalesNotifications
    };
    
    const toggleNotificationBellPanel = () => {
        setIsNotificationBellOpen(!isNotificationBellOpen);
        setIsSalesNotificationOpen(false); // Close the SalesNotifications when opening NotificationBell
    };
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                // User is logged in
                setUser(authUser);

        // Fetch the profile picture from Firestore
        const userDoc = await getDoc(doc(db, "profileData", authUser.uid));
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

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirmation(false);
      // Redirect to the home page or another desired page after logging out.
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const [selectedGenre, setSelectedGenre] = useState(""); // Initial selected genre
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedGenre(e.target.value);
  };
  const handleSearch = () => {
    // Redirect to the search page with the search query as a parameter
    //navigate(`/Search?query=${searchQuery}genre=${selectedGenre}`);
    navigate(`/Search?query=${searchQuery}`);
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
          <img src={logo} className="h-20 mr-10" alt="GameQuill Logo" />
        </Link>
        <div className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleEnterKey}
            placeholder="Search for games or users"
            className="bg-gray-200 p-2 rounded mr-2 w-96"
            onFocus={() => setIsSearchBarFocused(true)}
          />
          {/* {isSearchBarFocused && (
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-200 p-2 rounded mr-2"
            >
              {gameGenres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          )}
          {isSearchBarFocused && (
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-gray-200 p-2 rounded mr-2"
            >
              {gamePlatforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          )} */}
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-600 md:bg-gray-600 border-gray-700">
            <Link
              to="/top-games"
              className="block py-2 pl-3 pr-4 text-white rounded hover-bg-gray-100 md:hover-bg-transparent md-border-0 md:hover-text-blue-700 md-p-0 dark-text-white md-dark-hover-text-blue-500 dark-hover-bg-gray-500 dark-hover-text-white md-dark-hover-bg-transparent"
            >
              Top Games
            </Link>
            <li>
              {user ? (
                <div className="flex items-center space-x-4">
                  <NotificationBell userUid={user.uid} />
                  <div className="relative">
                    <Avatar
                      src={profilePic || "path_to_default_avatar.png"}
                      className="rounded-full w-12 h-12"
                      onClick={() =>
                        setShowLogoutConfirmation(!showLogoutConfirmation)
                      }
                    />


                    {showLogoutConfirmation && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <Link
                          to={`/Profile?user_id=${user.uid}`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          View Profile
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
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-500 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-600 md:bg-gray-600 border-gray-700">
                        <Link
                            to="/top-games"
                            className="block py-2 pl-3 pr-4 text-white rounded hover-bg-gray-100 md:hover-bg-transparent md-border-0 md:hover-text-blue-700 md-p-0 dark-text-white md-dark-hover-text-blue-500 dark-hover-bg-gray-500 dark-hover-text-white md-dark-hover-bg-transparent"
                        >
                            Top Games
                        </Link>
                        <li>
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <SalesNotifications 
    userUid={user.uid} 
    isOpen={isSalesNotificationOpen}
    onToggle={toggleSalesNotificationPanel}
/>
<NotificationBell 
    userUid={user.uid} 
    isOpen={isNotificationBellOpen}
    onToggle={toggleNotificationBellPanel}
/>

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
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                                                <Link
                                                    to={`/Profile?user_id=${user.uid}`}
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    View Profile
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
