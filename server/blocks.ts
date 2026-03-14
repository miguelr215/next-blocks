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
};

// create/purchase a new block
export const createBlock = async (blocksGameId: string) => {};

// get a block by id
export const getBlockById = async (id: string) => {};

// get all blocks for a user
export const getAllBlocksForUser = async (userId: string) => {};

// get all blocks for a game
export const getAllBlocksForGame = async (blocksGameId: string) => {};

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
