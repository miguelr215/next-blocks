"use server";

import { db } from "@/db/drizzle";
import { block, blocksGame, winner } from "@/db/schema";
import { eq } from "drizzle-orm";

type Block = {
	id: string;
	isPurchased: boolean;
	blockPrice: number;
	purchaseAmt: number;
	usedPromoCode: boolean;
	promoCodeApplied: string;
	userId: string;
	blocksGameId: string;
	xCoordinate: number;
	yCoordinate: number;
	homeTeamScore: number;
	awayTeamScore: number;
};

// create 100 blocks for a game
export const createBlocks = async (
	blocksGameId: string,
	pricePerBlock: string,
) => {
	try {
		// Generate 100 blocks for a 10x10 grid
		const blocksToInsert = [];
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				blocksToInsert.push({
					id: crypto.randomUUID(),
					xCoordinate: x,
					yCoordinate: y,
					blockPrice: pricePerBlock,
					blocksGameId,
				});
			}
		}

		const newBlocks = await db.insert(block).values(blocksToInsert).returning();

		return {
			success: true,
			message: "100 blocks created successfully",
			data: newBlocks,
		};
	} catch (error) {
		console.error("Error creating blocks:", error);
		return {
			success: false,
			message: `Error creating blocks: ${(error as Error).message}`,
		};
	}
};

// purchase a block
export const purchaseBlock = async (blockId: string, userId: string) => {};

// get a block by id
export const getBlockById = async (id: string) => {};

// get all blocks for a user
export const getAllBlocksForUser = async (userId: string) => {};

// get all blocks for a game
export const getAllBlocksForGame = async (blocksGameId: string) => {
	try {
		const blocks = await db
			.select()
			.from(block)
			.where(eq(block.blocksGameId, blocksGameId));

		return {
			success: true,
			message: `Found ${blocks.length} blocks for game ${blocksGameId}`,
			data: blocks,
		};
	} catch (error) {
		console.error("Error fetching blocks for game:", error);
		return {
			success: false,
			message: `Error fetching blocks for game: ${(error as Error).message}`,
		};
	}
};

// get all blocks for a game that are purchased
// NOTE: is this just a filtered getAllBlocksForGame?
export const getAllPurchasedBlocksForGame = async (blocksGameId: string) => {};

// update a block
export const updateBlock = async (id: string, updates: Partial<Block>) => {};

// ***************************************
// TODO: FUNCTIONS FOR PHASE 2

// delete a block

// archive a block

// ***************************************
