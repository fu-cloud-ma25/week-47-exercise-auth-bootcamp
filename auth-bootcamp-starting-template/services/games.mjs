import { db } from './db.mjs';
import {
    QueryCommand,
    GetCommand,
    PutCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { createError } from '@middy/util';

// Get games
export const getGames = async () => {
    try {
        const command = new QueryCommand({
            TableName: 'GameDB',
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'GAME'
            }
        });

        const result = await db.send(command);
        return result.Items;
    } catch (error) {
        console.error('Error getting games:', error);
        throw createError(500, 'Could not fetch games');
    }   
}

export const getGameById = async (gameId) => {
    const command = new GetCommand({
        TableName: 'GameDB',
        Key: {
            PK: 'GAME',
            SK: gameId
        }
    });

    try {
        const result = await db.send(command);
        return result.Item;
    } catch (error) {
        console.error('Error getting game by ID:', error);
        throw createError(500, 'Could not fetch game');
    }
}

// Add new game
export const addGame = async (game) => {
    const command = new PutCommand({
        TableName: 'GameDB',
        Item: {
            PK: 'GAME',
            SK: game.id,
            ...game,
            GSI1PK: `USER#${game.createdBy}`,
            GSI1SK: `GAME#${game.id}`
        }
    });

    try {
        await db.send(command);
        return game;
    } catch (error) {
        console.error('Error adding game:', error);
        throw createError(500, 'Could not add game');
    }
}

// Delete game
export const deleteGame = async (gameId) => {
    const command = new DeleteCommand({
        TableName: 'GameDB',
        Key: {
            PK: 'GAME',
            SK: gameId
        },
        ReturnValues: 'ALL_OLD' // This will return the deleted item attributes
    });

    try {
        const result = await db.send(command);
        return result.Attributes;
    } catch (error) {
        console.error('Error deleting game:', error);
        throw createError(500, 'Could not delete game');
    }
}