import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { transaction, winner } from "@/db/schema";

/** A transaction as returned from the DB */
export type Transaction = InferSelectModel<typeof transaction>;

/** Input for creating a new transaction */
export type NewTransaction = InferInsertModel<typeof transaction>;

/** A winner as returned from the DB */
export type Winner = InferSelectModel<typeof winner>;

/** Input for creating a new winner */
export type NewWinner = InferInsertModel<typeof winner>;

