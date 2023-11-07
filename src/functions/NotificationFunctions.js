import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function sendLikeNotification(receiverUID, senderUID, reviewID /* or we could do reviewObject? */) {

    // Check if that like notification is already in the receiver's notifications
    // If it is, then don't send another notification

    // Check how many notifications the receiver has, if they have more than 25, then
    // delete the oldest one

    // Send the notification
    const notificationRef = doc(db, "notifications", receiverUID);


}

/*

Notification Object:

Like Notification:
type: "like"
senderUID: "uid"
reviewID: "review_id"
gameID: "game_id"
gameName: "game_name"
gameCoverUrl: "game_cover_url"
timestamp: "timestamp"


Follower Notification:
type: "follow"
receiverUID: "uid"
senderUID: "uid"
timestamp: "timestamp"


*/

export async function sendFollowerNotification(receiverUID, senderUID) {

}