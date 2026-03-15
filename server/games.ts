"use server";

import { db } from "@/db/drizzle";
import { block, blocksGame, sportsGame } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import crypto from "node:crypto";
import { createBlocks } from "./blocks";

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

// create a new blocks game in DB ✅
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

		const { success, message, data } = await createBlocks(
			newGame[0].id,
			gameSettings.pricePerBlock.toString(),
		);

		if (!success) {
			return {
				success: false,
				message: `Error creating blocks: ${message}`,
			};
		}

		console.log("blocks created: ", data);

		return {
			success: true,
			message: "Blocks game & blocks created successfully",
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

// get all active blocks games by league and date range ✅
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

/**
 * Generates a shuffled array of digits 0-9 using Fisher-Yates shuffle.
 * Each digit appears exactly once (non-repeating).
 */
const generateShuffledAxis = (): number[] => {
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
	}
	return numbers;
};

/**
 * Generates random axis numbers for a blocks game and assigns them to all blocks.
 * X-axis numbers map to homeTeamScore, Y-axis numbers map to awayTeamScore.
 *
 * @param blocksGameId - The ID of the blocks game to generate axis numbers for
 * @returns Object with success status, message, and the generated axis arrays
 */
export const generateAxisNumbers = async (blocksGameId: string) => {
	try {
		const xAxisNumbers = generateShuffledAxis();
		const yAxisNumbers = generateShuffledAxis();

		// Update all blocks in a transaction — 20 queries total (10 per axis)
		// Each query updates 10 blocks (all blocks sharing the same coordinate)
		await db.transaction(async (tx) => {
			const xAxisUpdates = xAxisNumbers.map((scoreValue, coordinate) =>
				tx
					.update(block)
					.set({ homeTeamScore: scoreValue })
					.where(
						and(
							eq(block.blocksGameId, blocksGameId),
							eq(block.xCoordinate, coordinate),
						),
					),
			);

			const yAxisUpdates = yAxisNumbers.map((scoreValue, coordinate) =>
				tx
					.update(block)
					.set({ awayTeamScore: scoreValue })
					.where(
						and(
							eq(block.blocksGameId, blocksGameId),
							eq(block.yCoordinate, coordinate),
						),
					),
			);

			await Promise.all([...xAxisUpdates, ...yAxisUpdates]);
		});

		return {
			success: true,
			message: "Axis numbers generated and blocks updated successfully",
			data: { xAxisNumbers, yAxisNumbers },
		};
	} catch (error) {
		console.error("Error generating axis numbers:", error);
		return {
			success: false,
			message: `Error generating axis numbers: ${(error as Error).message}`,
		};
	}
};

// get block game by id
export const getBlocksGameById = async (id: string) => {
	try {
		const result = await db
			.select()
			.from(blocksGame)
			.innerJoin(sportsGame, eq(blocksGame.sportsGameId, sportsGame.id))
			.where(eq(blocksGame.id, id));

		if (result.length === 0) {
			return {
				success: false,
				message: `Blocks game with id ${id} not found`,
			};
		}

		return {
			success: true,
			message: "Blocks game fetched successfully",
			data: result[0],
		};
	} catch (error) {
		console.error("Error fetching blocks game:", error);
		return {
			success: false,
			message: `Error fetching blocks game: ${(error as Error).message}`,
		};
	}
};

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
