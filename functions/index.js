const functions = require('firebase-functions');
const admin = require("firebase-admin");
const axios = require('axios');
const cheerio = require('cheerio');

admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

exports.updateGamePrice = functions.https.onCall(async (data, context) => {
    try {
        if (!data.game_id) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                'The function must be called with one argument "game_id".'
            );
        }

        // Print out the game ID, using logger
        console.log("Finding for game_id: " + data.game_id);

        
        // IGDB API headers
        const igdbHeaders = {
            Accept: "application/json",
            "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6", // Replace with your IGDB Client ID
            Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp", // Replace with your IGDB access token
        };

        // Make an API call to IGDB
        const igdbResponse = await axios({
            method: "post",
            url: "https://api.igdb.com/v4/external_games",
            headers: igdbHeaders,
            data: `fields id,game,name,url; where game=${data.game_id} & category=(1,11,36);`,
        });

        const gameUrls = igdbResponse.data;

        for (const gameUrl of gameUrls) {
            const response = await axios.get(gameUrl.url);
            const $ = cheerio.load(response.data);
            const price = $("#price").text();

            await db.collection("games").doc(data.game_id).update({
                game_price: price,
            });
        }

        return { result: `Prices updated for game ${data.game_id}` };
    } catch (error) {
        console.error("Error updating game price:", error);
        throw new functions.https.HttpsError(
            "unknown",
            "Failed to update game price",
            error
        );
    }
});
