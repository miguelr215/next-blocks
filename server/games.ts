"use server";

import { db } from "@/db/drizzle";
import { block, blocksGame, sportsGame } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import crypto from "node:crypto";
import { createBlocks } from "./blocks";

import { createModuleLogger } from "@/logger.js";

const logger = createModuleLogger("games-server");

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
	logger.info(`createBlocksGame called with gameSettings: ${gameSettings}`);

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

		logger.info(`created blocksGame newGame: ${newGame}`);

		// Create 100 blocks for the new game
		const { success, message, data } = await createBlocks(
			newGame[0].id,
			gameSettings.pricePerBlock.toString(),
		);

		if (!success) {
			logger.error(`Error creating blocks: ${message}`);

			return {
				success: false,
				message: `Error creating blocks: ${message}`,
			};
		}

		logger.info(`blocks created: ${data}`);

		return {
			success: true,
			message: "Blocks game & blocks created successfully",
			data: newGame[0],
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error creating blocks game",
		);
		return {
			success: false,
			message: `Error creating blocks game: ${(error as Error).message}`,
		};
	}
};

// get all active blocks games by league ✅
export const getAllActiveBlocksGames = async (league: string) => {
	logger.info(`getAllActiveBlocksGames called with league: ${league}`);

	try {
		const activeGames = await db
			.select()
			.from(blocksGame)
			.innerJoin(sportsGame, eq(blocksGame.sportsGameId, sportsGame.id))
			.where(and(eq(blocksGame.isActive, true), eq(sportsGame.league, league)));

		logger.info(`activeGames: ${activeGames}`);

		return {
			success: true,
			message: "Active blocks games fetched successfully",
			data: activeGames,
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error fetching active blocks games",
		);
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
	logger.info(
		`getAllActiveBlocksGamesByDateRange called with league: ${league}, startDate: ${startDate}, endDate: ${endDate}`,
	);

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

		logger.info(`activeGames: ${activeGames}`);

		return {
			success: true,
			message: "Active blocks games fetched successfully",
			data: activeGames,
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error fetching active blocks games by date range",
		);
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
	logger.info(`generateShuffledAxis called...`);
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[numbers[i], numbers[j]] = [numbers[j], numbers[i]];
	}
	logger.info(`generateShuffledAxis numbers: ${numbers}`);
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
	logger.info(`generateAxisNumbers called with blocksGameId: ${blocksGameId}`);

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

		logger.info(`Axis numbers generated and blocks updated successfully`);

		return {
			success: true,
			message: "Axis numbers generated and blocks updated successfully",
			data: { xAxisNumbers, yAxisNumbers },
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error generating axis numbers",
		);
		return {
			success: false,
			message: `Error generating axis numbers: ${(error as Error).message}`,
		};
	}
};

// get block game by id
export const getBlocksGameById = async (id: string) => {
	logger.info(`getBlocksGameById called with id: ${id}`);

	try {
		const result = await db
			.select()
			.from(blocksGame)
			.innerJoin(sportsGame, eq(blocksGame.sportsGameId, sportsGame.id))
			.where(eq(blocksGame.id, id));

		if (result.length === 0) {
			logger.info(`Blocks game with id ${id} not found`);
			return {
				success: false,
				message: `Blocks game with id ${id} not found`,
			};
		}

		logger.info(`Blocks game with id ${id} found: ${result[0]}`);

		return {
			success: true,
			message: "Blocks game fetched successfully",
			data: result[0],
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error fetching blocks game",
		);
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
