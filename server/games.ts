"use server";

import { db } from "@/db/drizzle";
import { blocksGame, sportsGame } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import crypto from "node:crypto";

type BlocksGameSettings = {
	sportsGameId: string;
	isPrivate: boolean;
	createdBy: string;
	pricePerBlock: number;
	allowsTouches: boolean;
	prizeTotal: number;
	prizeQ1: number;
	prizePerTouchQ1: number;
	prizeQ2: number;
	prizePerTouchQ2: number;
	prizeQ3: number;
	prizePerTouchQ3: number;
	prizeQ4: number;
	prizePerTouchQ4: number;
};

// create a new blocks game ✅
export const createBlocksGame = async (gameSettings: BlocksGameSettings) => {
	try {
		const newGame = await db
			.insert(blocksGame)
			.values({
				id: crypto.randomUUID(),
				sportsGameId: gameSettings.sportsGameId,
				isPrivate: gameSettings.isPrivate,
				createdBy: gameSettings.createdBy,
				pricePerBlock: gameSettings.pricePerBlock.toString(),
				allowsTouches: gameSettings.allowsTouches,
				prizeTotal: gameSettings.prizeTotal.toString(),
				prizeQ1: gameSettings.prizeQ1.toString(),
				prizePerTouchQ1: gameSettings.prizePerTouchQ1.toString(),
				prizeQ2: gameSettings.prizeQ2.toString(),
				prizePerTouchQ2: gameSettings.prizePerTouchQ2.toString(),
				prizeQ3: gameSettings.prizeQ3.toString(),
				prizePerTouchQ3: gameSettings.prizePerTouchQ3.toString(),
				prizeQ4: gameSettings.prizeQ4.toString(),
				prizePerTouchQ4: gameSettings.prizePerTouchQ4.toString(),
			})
			.returning();

		return {
			success: true,
			message: "Blocks game created successfully",
			data: newGame[0],
		};
	} catch (error) {
		console.error("Error creating blocks game:", error);
		return {
			success: false,
			message: `Error creating blocks game: ${(error as Error).message}`,
		};
	}
};

// get all active blocks games by league ✅
export const getAllActiveBlocksGames = async (league: string) => {
	try {
		const activeGames = await db
			.select()
			.from(blocksGame)
			.innerJoin(sportsGame, eq(blocksGame.sportsGameId, sportsGame.id))
			.where(and(eq(blocksGame.isActive, true), eq(sportsGame.league, league)));

		return {
			success: true,
			message: "Active blocks games fetched successfully",
			data: activeGames,
		};
	} catch (error) {
		console.error("Error fetching active blocks games:", error);
		return {
			success: false,
			message: `Error fetching active blocks games: ${(error as Error).message}`,
		};
	}
};

// get all active blocks games by league and date range
export const getAllActiveBlocksGamesByDateRange = async (
	league: string,
	startDate: string,
	endDate: string,
) => {
	try {
		const activeGames = await db
			.select()
			.from(blocksGame)
			.innerJoin(sportsGame, eq(blocksGame.sportsGameId, sportsGame.id))
			.where(
				and(
					eq(blocksGame.isActive, true),
					eq(sportsGame.league, league),
					gte(sportsGame.gameDate, startDate),
					lte(sportsGame.gameDate, endDate),
				),
			);

		return {
			success: true,
			message: "Active blocks games fetched successfully",
			data: activeGames,
		};
	} catch (error) {
		console.error("Error fetching active blocks games by date range:", error);
		return {
			success: false,
			message: `Error fetching active blocks games by date range: ${(error as Error).message}`,
		};
	}
};

// get block game by id
export const getBlocksGameById = async (id: string) => {};

// get all blocks games for a user
export const getAllBlocksGamesForUser = async (userId: string) => {};

// get all blocks games created by a user
export const getAllBlocksGamesCreatedByUser = async (userId: string) => {};

// update a blocks game
export const updateBlocksGame = async (
	id: string,
	updates: Partial<BlocksGameSettings>,
) => {};

// ***************************************
// TODO: FUNCTIONS FOR PHASE 2
// delete a blocks game
export const deleteBlocksGame = async (id: string) => {};

// archive a blocks game
export const archiveBlocksGame = async (id: string) => {};
// ***************************************
