import { sendResponse } from "../../../responses/index.mjs"
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { addGame } from "../../../services/games.mjs";

export const handler = middy(async (event) => {
  const { title, createdBy } = event.body;

  const game = await addGame({ 
    id : crypto.randomUUID().slice(0, 5),
    title, 
    createdBy 
  });

  return sendResponse(200, { message : 'Game added successfully!', game });
}).use(httpJsonBodyParser())
  .use(errorHandler());