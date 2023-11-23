const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

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

        var preventDoubleMicrosoft = false;
        var preventDoublePlaystation = false;
        var preventDoubleSteam = false;

        for (const gameUrl of gameUrls) {
            if (!gameUrl.url) {
                continue;
            }

            console.log("Scraping URL: " + gameUrl.url);


            let priceInfo = {
                price: null,
                timestamp: new Date(),
                url: gameUrl.url,
                platform: ''
            };

            if (gameUrl.url.includes("microsoft.com") && !preventDoubleMicrosoft) {
                preventDoubleMicrosoft = true;
                priceInfo.price = await xboxScrapePrice(gameUrl.url);
                priceInfo.platform = 'xbox';
            } else if (gameUrl.url.includes("playstation.com") && !preventDoublePlaystation) {
                preventDoublePlaystation = true;
                priceInfo.price = await playstationScrapePrice(gameUrl.url);
                priceInfo.platform = 'playstation';
            } else if (gameUrl.url.includes("store.steampowered.com") && !preventDoubleSteam) {
                preventDoubleSteam = true;
                priceInfo.price = await steamScrapePrice(gameUrl.url);
                priceInfo.platform = 'steam';
            }


            if (priceInfo.price) {
                const fieldName = `${priceInfo.platform}_game_price`;
                await db.collection("games").doc(data.game_id).update({
                    [fieldName]: priceInfo
                });

                await db.collection("games").doc(data.game_id).update({
                    last_price_update: new Date()
                });

                console.log(`Price updated for game ${data.game_id} with price ${priceInfo.price}`);
            }
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

async function xboxScrapePrice(url) {
    console.log("Scraping Xbox Store");
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let price = "";

    // Check if there's a discounted price
    if ($(".Price-module__listedDiscountPrice___67yG1").length) {
        price = $(".Price-module__listedDiscountPrice___67yG1").first().text();
    }
    // If no discounted price, check for the original price
    else if ($(".Price-module__originalPrice___+jfaT").length) {
        price = $(".Price-module__originalPrice___+jfaT").first().text();
    }

    // Remove any plus signs at the end of the price string
    price = price.replace(/\+$/, '').trim();

    return price;
}


async function playstationScrapePrice(url) {
    console.log("Scraping Playstation Store");
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // The price is in a span with a specific data-qa attribute
    let price = $("span[data-qa='mfeCtaMain#offer0#finalPrice']").first().text().trim();

    return price;
}


async function steamScrapePrice(url) {
    // Extract the app_id from the URL
    console.log("Scraping Steam Store");
    const appIdRegex = /\/app\/(\d+)/;
    const match = url.match(appIdRegex);
    if (!match || match.length < 2) {
        console.error("Invalid URL or app_id not found in URL");
        return "";
    }
    const appId = match[1];

    // Specify the country as USA to ensure prices are in USD
    const countryCode = 'us';

    // Make a request to the Steam API
    try {
        const apiResponse = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${countryCode}`);
        const appDetails = apiResponse.data[appId].data;

        if (appDetails && appDetails.price_overview && appDetails.price_overview.currency === 'USD') {
            console.log("Final Price in USD: " + appDetails.price_overview.final_formatted);
            return appDetails.price_overview.final_formatted;
        } else {
            console.error("Price information in USD not available for app_id:", appId);
            return "";
        }
    } catch (error) {
        console.error("Error fetching data from Steam API:", error);
        return "";
    }
}



