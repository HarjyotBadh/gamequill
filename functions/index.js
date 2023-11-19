const { onRequest, onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

// Import your custom functions
// const { updatePricesForGame } = require('./path/to/your/custom/script');

// Example of an HTTP triggered function
exports.helloWorld = onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const text = request.body.text; // assuming text is sent in the request body
            if (!text) {
                throw new Error('No text provided');
            }

            // Create a new document in 'a' collection with 'text' field
            const docRef = db.collection('a').doc();
            await docRef.set({ text });

            logger.info("Document created with ID: ", docRef.id);
            response.send({ message: `Document created with ID: ${docRef.id}` });
        } catch (error) {
            logger.error("Error: ", error);
            response.status(500).send({ error: error.message });
        }
    });
});

// Define a callable function for updating game prices
// exports.updateGamePrices = onCall(async (data, context) => {
//   try {
//     const gameId = data.gameId; // Ensure you are sending 'gameId' from the frontend
//     await updatePricesForGame(gameId);
//     return { message: `Prices updated for game ID: ${gameId}` };
//   } catch (error) {
//     logger.error("Error updating prices: ", error);
//     throw new onCall.HttpsError('internal', error.message);
//   }
// });
