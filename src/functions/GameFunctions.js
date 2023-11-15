import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetches game data for a given game ID. First, it checks the Firestore database
 * to see if the game data is already stored there. If found, it returns the data from Firestore.
 * Otherwise, it fetches the data from IGDB, stores it in Firestore for future reference,
 * and then returns the fetched data.
 *
 * @param {number} game_id - The ID of the game to fetch.
 * @returns {Object|null} The game data, or null if not found.
 */
export const fetchGameData = async (game_id) => {
  // First, try to get the game data from Firestore
  const gameRef = doc(db, "games", game_id.toString());
  const docSnap = await getDoc(gameRef);

  if (docSnap.exists()) {
    // Game data found in Firestore
    const gameData = docSnap.data();

    const screenshotUrls = gameData.screenshotUrls || [];
    const videoIds = gameData.videoIds || [];

    return {
      game: gameData,
      screenshotUrls: screenshotUrls,
      videoIds: videoIds,
    };
  } else {
    // Game data not found in Firestore, fetch from IGDB
    const gameDataFromIGDBB = await fetchGameDataFromIGDB(game_id);
    const gameDataFromIGDB = gameDataFromIGDBB[0];

    if (gameDataFromIGDB) {
      // Store the fetched game data in Firestore
      const gameDataForFirestore = {
        ...gameDataFromIGDB.game,
        screenshotUrls: gameDataFromIGDB.screenshotUrls,
        videoIds: gameDataFromIGDB.videoIds,
      };
      await setDoc(doc(db, "games", game_id.toString()), gameDataForFirestore);

      // Return the game data
      return gameDataFromIGDB;
    }
  }

  return null;
};

/**
 * Fetches game data for an array of game IDs. For each game ID, it first checks
 * the Firestore database. If the game data for any ID is not found in Firestore,
 * it fetches the data for all missing IDs from IGDB in a single API call.
 * The fetched data is then stored in Firestore for future reference.
 *
 * @param {number[]} game_ids - Array of game IDs to fetch.
 * @returns {Object[]} Array of game data.
 */
export const fetchMultipleGameData = async (game_ids) => {
  let gamesData = [];
  let idsToFetchFromIGDB = [];

  // First, try to get the game data from Firestore
  for (let game_id of game_ids) {
    const gameRef = doc(db, "games", game_id.toString());
    const docSnap = await getDoc(gameRef);

    // If game data found in Firestore, add it to the array of game data
    if (docSnap.exists()) {
      const gameData = docSnap.data();
      gamesData.push({
        game: gameData,
        screenshotUrls: gameData.screenshotUrls,
        videoIds: gameData.videoIds,
      });
    } else {
      // Game data not found in Firestore, add the game ID to the array of IDs to fetch from IGDB
      idsToFetchFromIGDB.push(game_id);
    }
  }

  // Fetch the game data for all missing IDs from IGDB
  if (idsToFetchFromIGDB.length) {
    const fetchedGamesData = await fetchGameDataFromIGDB(idsToFetchFromIGDB);
    gamesData = [...gamesData, ...fetchedGamesData];

    // Store the fetched game data in Firestore
    for (let gameData of fetchedGamesData) {
      const gameDataForFirestore = {
        ...gameData.game,
        screenshotUrls: gameData.screenshotUrls,
        videoIds: gameData.videoIds,
      };
      await setDoc(
        doc(db, "games", gameData.game.id.toString()),
        gameDataForFirestore
      );
    }
  }

  return gamesData;
};

/**
 * Fetches game data from IGDB for an array of game IDs. It makes a single API call
 * to IGDB to get the data for all game IDs provided in the array.
 *
 * @param {number[]} game_ids - Array of game IDs to fetch.
 * @returns {Object[]} Array of game data from IGDB.
 */
export const fetchGameDataFromIGDB = async (game_ids) => {
  console.log("==================FETCHING DATA FROM IGDB====================");
  const corsAnywhereUrl = "http://localhost:8080/";
  const apiUrl = "https://api.igdb.com/v4/games";

  // Ensure game_ids is always an array
  if (!Array.isArray(game_ids)) {
    game_ids = [game_ids];
  }

  // Fetch game data from IGDB
  try {
    const response = await fetch(corsAnywhereUrl + apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
      },
      body: `
                fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id,genres.name,summary,storyline,platforms.name,age_ratings.*,age_ratings.content_descriptions.*;
                where id = (${game_ids.join(",")});
            `,
    });

    const data = await response.json();

    // Return the game data
    return data.map((game) => ({
      game: game,
      screenshotUrls: game.screenshots
        ? game.screenshots.map((s) => s.url.replace("t_thumb", "t_1080p"))
        : [],
      videoIds: game.videos ? game.videos.map((v) => v.video_id) : [],
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * Fetches similar games based on the provided genres and themes. It constructs a request to the IGDB API
 * with the given conditions and returns a list of games sorted by rating in descending order.
 *
 * @param {Object[]} genres - An array of genre objects.
 * @param {Object[]} themes - An array of theme objects.
 * @returns {Object[]} An array of game objects with formatted screenshot URLs.
 */
export async function fetchSimilarGames(genres, themes) {
  const corsAnywhereUrl = "http://localhost:8080/";
  const apiUrl = "https://api.igdb.com/v4/games";

  // Extracting ids from genres and themes
  const genreIds = genres.map((genre) => genre.id);
  const themeIds = themes.map((theme) => theme.id);

  console.log("genreIds:", genreIds);
  console.log("themeIds:", themeIds);

  // Constructing genres and themes conditions for the API request
  let conditions = "rating > 70 & total_rating_count > 5";

  if (genreIds && genreIds.length > 0) {
    conditions += " & genres = (" + genreIds.join(",") + ")";
  }

  if (themeIds && themeIds.length > 0) {
    conditions += " & themes = (" + themeIds.join(",") + ")";
  }

  const requestBody =
    "fields name, id, rating, involved_companies.company.name, total_rating_count, screenshots.url; where " +
    conditions +
    "; sort rating desc; limit 100;";

  try {
    const response = await fetch(corsAnywhereUrl + apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "71i4578sjzpxfnbzejtdx85rek70p6",
        Authorization: "Bearer 7zs23d87qtkquji3ep0vl0tpo2hzkp",
      },
      body: requestBody,
    });

    // Parse the response to JSON
    const data = await response.json();

    // Format the screenshot URLs
    const formattedData = data.map((game) => {
      return {
        ...game,
        screenshotUrls: game.screenshots
          ? game.screenshots.map((s) => s.url.replace("t_thumb", "t_1080p"))
          : [],
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error fetching similar games:", error);
    return [];
  }
}
