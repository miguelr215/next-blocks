"use server";

import { db } from "@/db/drizzle";
import { block, blocksGame, user, winner } from "@/db/schema";
import { eq } from "drizzle-orm";

import { createModuleLogger } from "@/logger.js";
import type { Block, BlockWithUser } from "@/lib/types";
import { increaseBlockCount } from "@/server/games";

const logger = createModuleLogger("blocks-server");

// create 100 blocks for a game ✅
export const createBlocks = async (
  blocksGameId: string,
  pricePerBlock: string,
) => {
  logger.info(
    `createBlocks called with blocksGameId: ${blocksGameId} and pricePerBlock: ${pricePerBlock}`,
  );

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

    logger.info(`blocksToInsert: ${blocksToInsert}`);

    const newBlocks = await db.insert(block).values(blocksToInsert).returning();

    logger.info(`newBlocks: ${newBlocks}`);

    return {
      success: true,
      message: "100 blocks created successfully",
      data: newBlocks,
    };
  } catch (error) {
    logger.error(
      error instanceof Error ? error : String(error),
      "Error creating blocks",
    );
    return {
      success: false,
      message: `Error creating blocks: ${(error as Error).message}`,
    };
  }
};

// add User ID to a block; aka purchase a block
/**
 * Purchases a block by assigning a user to it and incrementing the game's sold count.
 *
 * @param blockId - The ID of the block to purchase
 * @param blockPrice - The price paid for the block
 * @param userId - The ID of the purchasing user
 * @param blocksGameId - The ID of the blocks game the block belongs to
 * @returns Object with success status, message, and updated block data
 */
export const addUserIdToBlock = async (
  blockId: string,
  blockPrice: string,
  userId: string,
  blocksGameId: string,
) => {
  logger.info(
    `addUserIdToBlock called with blockId: ${blockId}, blockPrice: ${blockPrice}, userId: ${userId}, blocksGameId: ${blocksGameId}`,
  );

  try {
    const updatedBlock = await db
      .update(block)
      .set({
        isPurchased: true,
        userId,
        purchaseAmt: blockPrice,
      })
      .where(eq(block.id, blockId))
      .returning();

    logger.info(`updatedBlock: ${updatedBlock}`);

    // Increase the blocksSold count for the game after a successful purchase
    const blockCountResult = await increaseBlockCount(blocksGameId);

    if (!blockCountResult.success) {
      logger.error(
        `Failed to increase block count for blocksGameId: ${blocksGameId}: ${blockCountResult.message}`,
      );
    }

    return {
      success: true,
      message: "Block purchased successfully",
      data: updatedBlock,
    };
  } catch (error) {
    logger.error(
      error instanceof Error ? error : String(error),
      "Error purchasing block",
    );
    return {
      success: false,
      message: `Error purchasing block: ${(error as Error).message}`,
    };
  }
};

// get a block by id
export const getBlockById = async (id: string) => {
  logger.info(`getBlockById called with id: ${id}`);

  try {
    const foundBlock = await db.select().from(block).where(eq(block.id, id));

    if (foundBlock.length === 0) {
      return {
        success: false,
        message: `Block with id ${id} not found`,
      };
    }

    logger.info(`foundBlock: ${foundBlock[0]}`);

    return {
      success: true,
      message: "Block found successfully",
      data: foundBlock[0],
    };
  } catch (error) {
    logger.error(
      error instanceof Error ? error : String(error),
      "Error fetching block by id",
    );
    return {
      success: false,
      message: `Error fetching block by id: ${(error as Error).message}`,
    };
  }
};

// get all blocks for a user
export const getAllBlocksForUser = async (userId: string) => {
  logger.info(`getAllBlocksForUser called with userId: ${userId}`);

  try {
    const blocks = await db
      .select()
      .from(block)
      .where(eq(block.userId, userId));

    logger.info(`blocks: ${blocks}`);

    return {
      success: true,
      message: `Found ${blocks.length} blocks for user ${userId}`,
      data: blocks,
    };
  } catch (error) {
    logger.error(
      error instanceof Error ? error : String(error),
      "Error fetching blocks for user",
    );
    return {
      success: false,
      message: `Error fetching blocks for user: ${(error as Error).message}`,
    };
  }
};

// get all blocks for a game ✅
export const getAllBlocksForGame = async (blocksGameId: string) => {
  logger.info(`getAllBlocksForGame called with blocksGameId: ${blocksGameId}`);

  try {
    const rows = await db
      .select({
        block: block,
        userName: user.name,
        userImage: user.image,
      })
      .from(block)
      .leftJoin(user, eq(block.userId, user.id))
      .where(eq(block.blocksGameId, blocksGameId));

    const blocks: BlockWithUser[] = rows.map((row) => ({
      ...row.block,
      userName: row.userName,
      userImage: row.userImage,
    }));

    logger.info(`blocks: ${blocks}`);

    return {
      success: true,
      message: `Found ${blocks.length} blocks for game ${blocksGameId}`,
      data: blocks,
    };
  } catch (error) {
    logger.error(
      error instanceof Error ? error : String(error),
      "Error fetching blocks for game",
    );
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
