"use server";

import { db } from "@/db/drizzle";
import { block, blocksGame, winner } from "@/db/schema";
import { eq } from "drizzle-orm";

// create/purchase a new block
export const createBlock = async (blocksGameId: string) => {};

// get a block by id
export const getBlockById = async (id: string) => {};

// get all blocks for a user
export const getAllBlocksForUser = async (userId: string) => {};

// get all blocks for a game
export const getAllBlocksForGame = async (blocksGameId: string) => {};

// get all blocks for a game that are purchased
export const getAllPurchasedBlocksForGame = async (blocksGameId: string) => {};
