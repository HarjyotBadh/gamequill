// import React, { useState, useEffect } from "react";
// import { db, auth } from "../firebase";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { ArrowPathIcon } from "@heroicons/react/24/solid"; // Import the appropriate icon
// //import "../styles/RepostButton.css"; // You may need to create or import the appropriate styles

// const RepostButton = ({ reviewID }) => {
//   const [isReposted, setIsReposted] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const user = auth.currentUser;
        
//         // Check if auth.currentUser is not null before accessing uid
//         if (user) {
//           const docRef = doc(db, "profileData", user.uid);
//           const docSnap = await getDoc(docRef);
//           const reposts = docSnap.data().reposts;

//           if (reposts && reposts.includes(reviewID)) {
//             setIsReposted(true); // Set the button to 'on' state
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data from Firestore:", error);
//       }
//     };

//     fetchData();
//   }, [reviewID]);

//   const handleButtonClick = async () => {
//     setIsReposted((prevState) => !prevState);

//     const user = auth.currentUser;

//     // Check if auth.currentUser is not null before updating Firestore
//     if (user) {
//       const docRef = doc(db, "profileData", user.uid);

//       try {
//         if (isReposted) {
//           // Remove the reviewID from the 'reposts' array
//           await updateDoc(docRef, {
//             reposts: arrayRemove(reviewID),
//           });
//         } else {
//           // Add the reviewID to the 'reposts' array
//           await updateDoc(docRef, {
//             reposts: arrayUnion(reviewID),
//           });
//         }
//       } catch (error) {
//         console.error("Error updating data in Firestore:", error);
//       }
//     }
//   };

//   return (
//     <button className={`repostButton ${isReposted ? "reposted" : ""}`} onClick={handleButtonClick}>
//       {/* Use the ArrowPathIcon or replace it with the appropriate image */}
//       <ArrowPathIcon />
//     </button>
//   );
// };

// export default RepostButton;
