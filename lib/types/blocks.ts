import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { block, blocksGame } from "@/db/schema";

/** A block as returned from the DB */
export type Block = InferSelectModel<typeof block>;

/** Input for creating a new block */
export type NewBlock = InferInsertModel<typeof block>;

/** A blocks game as returned from the DB */
export type BlocksGame = InferSelectModel<typeof blocksGame>;

/** Input for creating a new blocks game */
export type NewBlocksGame = InferInsertModel<typeof blocksGame>;

/** A block with joined user data (image & name) */
export type BlockWithUser = Block & {
  userName: string | null;
  userImage: string | null;
};

/** Settings used when creating a blocks game via server action */
export type BlocksGameSettings = {
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
