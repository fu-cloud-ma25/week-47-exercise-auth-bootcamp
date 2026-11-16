import { sendResponse } from "../../../responses/index.mjs"
import middy from '@middy/core';
import { createError } from '@middy/util';
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { getGameById, deleteGame } from "../../../services/games.mjs";

export const handler = middy(async (event) => {
  const { id } = event.pathParameters;
  const game = await getGameById(id);

  if (!game) throw createError(404, 'Game not found');

  const deletedGame = await deleteGame(id);

  return sendResponse(200, { message : 'Game deleted successfully!', game: deletedGame });
}).use(errorHandler());