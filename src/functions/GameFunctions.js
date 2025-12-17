import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const gameCache = new Map();

export const fetchGameData = async (game_id) => {
  const cacheKey = game_id.toString();
  if (gameCache.has(cacheKey)) {
    return gameCache.get(cacheKey);
  }

  const gameRef = doc(db, "games", game_id.toString());
  const docSnap = await getDoc(gameRef);

  if (docSnap.exists()) {
    const gameData = docSnap.data();
    const screenshotUrls = gameData.screenshotUrls || [];
    const videoIds = gameData.videoIds || [];

    const result = {
      game: gameData,
      screenshotUrls: screenshotUrls,
      videoIds: videoIds,
    };
    gameCache.set(cacheKey, result);
    return result;
  } else {
    const gameDataFromIGDBB = await fetchGameDataFromIGDB(game_id);
    const gameDataFromIGDB = gameDataFromIGDBB[0];

    if (gameDataFromIGDB) {
      const gameDataForFirestore = {
        ...gameDataFromIGDB.game,
        screenshotUrls: gameDataFromIGDB.screenshotUrls,
        videoIds: gameDataFromIGDB.videoIds,
      };
      await setDoc(doc(db, "games", game_id.toString()), gameDataForFirestore);

      gameCache.set(cacheKey, gameDataFromIGDB);
      return gameDataFromIGDB;
    }
  }

  return null;
};

export const fetchMultipleGameData = async (game_ids) => {
  let gamesData = [];
  let idsToFetchFromIGDB = [];

  const docSnaps = await Promise.all(
    game_ids.map((id) => getDoc(doc(db, "games", id.toString())))
  );

  docSnaps.forEach((docSnap, index) => {
    if (docSnap.exists()) {
      const gameData = docSnap.data();
      gamesData.push({
        game: gameData,
        screenshotUrls: gameData.screenshotUrls,
        videoIds: gameData.videoIds,
      });
    } else {
      idsToFetchFromIGDB.push(game_ids[index]);
    }
  });

  if (idsToFetchFromIGDB.length) {
    const fetchedGamesData = await fetchGameDataFromIGDB(idsToFetchFromIGDB);
    gamesData = [...gamesData, ...fetchedGamesData];

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

export const fetchGameDataFromIGDB = async (game_ids) => {
  if (!Array.isArray(game_ids)) {
    game_ids = [game_ids];
  }

  try {
    const ob = {
      igdbquery: `
            fields name,cover.url,involved_companies.company.name,rating,aggregated_rating,screenshots.url,videos.video_id,genres.name,summary,storyline,platforms.name,age_ratings.*,age_ratings.content_descriptions.*,themes.name;
            where id = (${game_ids.join(",")});
        `,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: JSON.stringify(ob),
    });
    const data = await response.json();
    const igdbResponse = data.data;
    return igdbResponse.map((game) => ({
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

export async function fetchSimilarGames(genres, themes) {
  const genreIds = genres.map((genre) => genre.id);
  const themeIds = themes.map((theme) => theme.id);

  let conditions = "rating > 75 & total_rating_count > 50";

  if (genreIds && genreIds.length > 0) {
    conditions += " & genres = (" + genreIds.join(",") + ")";
  }

  if (themeIds && themeIds.length > 0) {
    conditions += " & themes = (" + themeIds.join(",") + ")";
  }

  const requestBody =
    "fields name, id, rating, involved_companies.company.name, total_rating_count, screenshots.url; where " +
    conditions +
    "; sort total_rating_count desc; limit 100;";

  try {
    const ob = {
      igdbquery: requestBody,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: JSON.stringify(ob),
    });
    const data = await response.json();
    const igdbResponse = data.data;

    const formattedData = igdbResponse.map((game) => {
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

export async function fetchSingularSimilarGame(genres, themes) {
  const genreIds = genres.map((genre) => genre.id);
  const themeIds = themes.map((theme) => theme.id);

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
    "; sort rating desc; limit 1;";

  try {
    const ob = {
      igdbquery: requestBody,
    };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/getIGDBGames";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: JSON.stringify(ob),
    });
    const data = await response.json();
    const igdbResponse = data.data;

    if (igdbResponse.length > 0) {
      const game = igdbResponse[0];

      const formattedGame = {
        ...game,
        screenshotUrls: game.screenshots
          ? game.screenshots.map((s) => s.url.replace("t_thumb", "t_1080p"))
          : [],
      };

      const gameData = await fetchGameData(formattedGame.id);

      if (gameData.game.last_price_update) {
        const lastPriceUpdate = new Date(gameData.game.last_price_update);
        const now = new Date();
        const hoursSinceLastPriceUpdate =
          (now - lastPriceUpdate) / (1000 * 60 * 60);
        if (hoursSinceLastPriceUpdate > 24) {
          await updateGamePrice(formattedGame.id);
        }
      } else {
        await updateGamePrice(formattedGame.id);
      }

      return formattedGame.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching similar games:", error);
    return null;
  }
}

export const updateGamePrice = (game_id) => {
  return new Promise((resolve, reject) => {
    const ob = { game_id: game_id };
    const functionUrl =
      "https://us-central1-gamequill-3bab8.cloudfunctions.net/updateGamePrice";

    fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: ob }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response);
        } else {
          reject("Response not OK");
        }
      })
      .catch((error) => {
        console.error("Request failed", error);
        reject(error);
      });
  });
};
