import { sendResponse } from "../../../responses/index.mjs"
import middy from '@middy/core';
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { getGames } from "../../../services/games.mjs";

export const handler = middy(async (event) => {
  const games = await getGames();
  return sendResponse(200, { games });
}).use(errorHandler());