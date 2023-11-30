import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

/**
 * Sends a like notification to the receiver's profile data document in Firestore.
 * If the notification already exists, it will not send a new one.
 * If there are more than 25 notifications, it will remove the oldest one.
 * @param {string} receiverUID - The UID of the receiver's profile data document.
 * @param {string} senderUID - The UID of the sender.
 * @param {Object} reviewObject - The review object containing the review ID, game ID, game name, and game cover URL.
 * @returns {Promise<void>} - A promise that resolves when the notification has been sent successfully.
 */
export async function sendLikeNotification(receiverUID, senderUID, reviewObject) {

    // If the sender and receiver are the same, do not send a notification
    if (senderUID === receiverUID) {
        return;
    }

    const profileDataRef = doc(db, "profileData", receiverUID);

    try {
        // Get the current profile data
        const profileDataSnap = await getDoc(profileDataRef);

        // If the document exists
        if (profileDataSnap.exists()) {
            const profileData = profileDataSnap.data();

            // Check for existing notifications
            const existingNotification = profileData.notifications?.find(notification =>
                notification.type === 'like' &&
                notification.senderUID === senderUID &&
                notification.reviewID === reviewObject.reviewID
            );

            // If the notification already exists, do not send a new one
            if (existingNotification) {
                return;
            }

            // Prepare the new notification object
            const newNotification = {
                type: 'like',
                senderUID: senderUID,
                reviewID: reviewObject.reviewID,
                gameID: reviewObject.gameID,
                gameName: reviewObject.gameName,
                gameCoverUrl: reviewObject.gameCoverUrl,
                timestamp: new Date() // Current time
            };

            // If there are more than 25 notifications, remove the oldest one
            if (profileData.notifications && profileData.notifications.length >= 25) {

                // Sort notifications by timestamp to find the oldest
                const sortedNotifications = profileData.notifications.sort((a, b) => a.timestamp - b.timestamp);
                const oldestNotification = sortedNotifications[0];

                // Remove the oldest notification
                await updateDoc(profileDataRef, {
                    notifications: arrayRemove(oldestNotification)
                });
            }

            // Add the new notification
            await updateDoc(profileDataRef, {
                notifications: arrayUnion(newNotification)
            });

            console.log("Notification sent successfully.");
        } else {
            console.error("Receiver profile data does not exist.");
        }
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

/**
 * Sends a follower notification to the receiver's profile data document in Firestore.
 * If the notification already exists, it will not send a new one.
 * If there are more than 25 notifications, it will remove the oldest one.
 * @param {string} receiverUID - The UID of the receiver's profile data document.
 * @param {string} senderUID - The UID of the sender.
 * @returns {Promise<void>} - A promise that resolves when the notification has been sent successfully.
 */
export async function sendFollowerNotification(receiverUID, senderUID) {
    const profileDataRef = doc(db, "profileData", receiverUID);

    try {
        // Get the current profile data
        const profileDataSnap = await getDoc(profileDataRef);

        // If the document exists
        if (profileDataSnap.exists()) {
            const profileData = profileDataSnap.data();

            // Check for existing follow notifications from the same sender
            const existingNotification = profileData.notifications?.find(notification =>
                notification.type === 'follow' &&
                notification.senderUID === senderUID
            );

            // If the notification already exists, do not send a new one
            if (existingNotification) {
                return;
            }

            // Prepare the new follow notification object
            const newNotification = {
                type: 'follow',
                senderUID: senderUID,
                timestamp: new Date()
            };

            // If there are more than 25 notifications, remove the oldest one
            if (profileData.notifications && profileData.notifications.length >= 25) {

                // Sort notifications by timestamp to find the oldest
                const sortedNotifications = profileData.notifications.sort((a, b) => a.timestamp - b.timestamp);
                const oldestNotification = sortedNotifications[0];

                // Remove the oldest notification
                await updateDoc(profileDataRef, {
                    notifications: arrayRemove(oldestNotification)
                });
            }

            // Add the new follow notification
            await updateDoc(profileDataRef, {
                notifications: arrayUnion(newNotification)
            });

        } else {
            console.error("Receiver profile data does not exist.");
        }
    } catch (error) {
        console.error("Error sending follow notification:", error);
    }
}

// @TODO: Create a notification for when a user reposts.
export async function sendRepostNotification(receiverUID, senderUID) {

}
