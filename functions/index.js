const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

exports.fetchIGDBGamess = functions.https.onRequest(async (data, context) => {
  try {
    // if (!data.igdbquery) {
    //   throw new functions.https.HttpsError(
    //     "invalid-argument",
    //     'The function must be called with one argument "body".'
    //   );
    // }
    console.log("Data test: " + data.body.slice(1, -1));
    console.log("Fetching from Games API with body: " + data.igdbquery);
    const igdbHeaders = {
      Accept: "application/json",
      "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6", // Replace with your IGDB Client ID
      Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo", // Replace with your IGDB access token
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    };
    const igdbResponse = await axios({
      method: "post",
      url: "https://api.igdb.com/v4/games",
      headers: igdbHeaders,
      data: data.body.slice(1, -1),
    });
    return { data: igdbResponse.data };
  } catch (error) {
    console.error("Error updating game price:", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Failed to update game price",
      error
    );
  }
});

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
      Authorization: "Bearer rgj70hvei3al0iynkv1976egaxg0fo", // Replace with your IGDB access token
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
        platform: "",
      };

      if (gameUrl.url.includes("microsoft.com") && !preventDoubleMicrosoft) {
        preventDoubleMicrosoft = true;
        priceInfo.price = await xboxScrapePrice(gameUrl.url);
        priceInfo.platform = "xbox";
      } else if (
        gameUrl.url.includes("playstation.com") &&
        !preventDoublePlaystation
      ) {
        preventDoublePlaystation = true;
        priceInfo.price = await playstationScrapePrice(gameUrl.url);
        priceInfo.platform = "playstation";
      } else if (
        gameUrl.url.includes("store.steampowered.com") &&
        !preventDoubleSteam
      ) {
        preventDoubleSteam = true;
        priceInfo.price = await steamScrapePrice(gameUrl.url);
        priceInfo.platform = "steam";
      }

      if (priceInfo.price) {
        const fieldName = `${priceInfo.platform}_game_price`;
        await db
          .collection("games")
          .doc(data.game_id)
          .set(
            {
              [fieldName]: priceInfo,
              last_price_update: new Date(),
            },
            { merge: true }
          );

        console.log(
          `Price updated for game ${data.game_id} with price ${priceInfo.price}`
        );
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
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let finalPrice = "";
    let discountedPrice = "";

    const discountedPriceElement = $(
      "div.ProductDetailsHeader-module__showOnMobileView___uZ1Dz span"
    );

    // The discounted price is the second span element
    discountedPrice = discountedPriceElement.eq(1).text().trim();

    let originalPriceElement = $(
      "div.ProductDetailsHeader-module__showOnMobileView___uZ1Dz span"
    );
    let originalPrice = $(
      "div.ProductDetailsHeader-module__showOnMobileView___uZ1Dz span"
    )
      .first()
      .text();

    if (discountedPriceElement.length && discountedPrice[0] === "$") {
      console.log("Discounted price element found");
      finalPrice = discountedPriceElement.eq(1).text().trim();
      discountedPrice = finalPrice;
    } else {
      discountedPrice = "None";
      finalPrice = originalPrice;
    }

    if (originalPriceElement.length) {
      console.log("Original price element found");
      originalPrice = originalPriceElement.first().text().trim();
    } else {
      console.log("Original price element not found");
    }

    if (!finalPrice) {
      finalPrice = originalPrice;
    }

    if (!discountedPrice) {
      discountedPrice = "None";
    }

    // Remove the '+' sign from the price at the end
    finalPrice = finalPrice.replace("+", "");
    discountedPrice = discountedPrice.replace("+", "");
    originalPrice = originalPrice.replace("+", "");

    return {
      finalPrice: finalPrice,
      discountedPrice: discountedPrice,
      originalPrice: originalPrice,
    };
  } catch (error) {
    console.error("Error in xboxScrapePrice:", error);
    throw error; // Rethrow the error for higher-level handling
  }
}

async function playstationScrapePrice(url) {
  console.log("Scraping Playstation Store");
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Final price is the price with any discounts applied
  let finalPrice = $("span[data-qa='mfeCtaMain#offer0#finalPrice']")
    .first()
    .text()
    .trim();
  let discountedPrice = "";
  let originalPriceElement = $(
    "span[data-qa='mfeCtaMain#offer0#originalPrice']"
  );

  // Price is the original price without any discounts
  let originalPrice;
  if (originalPriceElement.length === 0) {
    // No original price found, set to 'None'
    originalPrice = finalPrice;
    discountedPrice = "None";
  } else {
    originalPrice = originalPriceElement.text().trim();
    discountedPrice = finalPrice;
  }

  return {
    finalPrice: finalPrice,
    discountedPrice: discountedPrice,
    originalPrice: originalPrice,
  };
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
  const countryCode = "us";

  // Make a request to the Steam API
  try {
    const apiResponse = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${countryCode}`
    );
    const appDetails = apiResponse.data[appId].data;

    if (
      appDetails &&
      appDetails.price_overview &&
      appDetails.price_overview.currency === "USD"
    ) {
      console.log(
        "Final Price in USD: " + appDetails.price_overview.final_formatted
      );
      let finalPrice = appDetails.price_overview.final_formatted;
      let originalPrice = appDetails.price_overview.initial_formatted;
      let discountPrice = finalPrice;

      if (appDetails.price_overview.discount_percent == 0) {
        // No discount, set original price to 'None'
        originalPrice = finalPrice;
        discountPrice = "None";
      }
      return {
        finalPrice: finalPrice,
        discountedPrice: discountPrice,
        originalPrice: originalPrice,
      };
    } else {
      console.error(
        "Price information in USD not available for app_id:",
        appId
      );
      return "";
    }
  } catch (error) {
    console.error("Error fetching data from Steam API:", error);
    return "";
  }
}
