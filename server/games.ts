"use server";

import { db } from "@/db/drizzle";
import { blocksGame } from "@/db/schema";
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

// create a new blocks game
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
