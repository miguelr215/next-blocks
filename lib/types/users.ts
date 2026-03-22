import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { user, session, account, verification } from "@/db/schema";

/** A user as returned from the DB */
export type User = InferSelectModel<typeof user>;

/** Input for creating a new user */
export type NewUser = InferInsertModel<typeof user>;

/** A session as returned from the DB */
export type Session = InferSelectModel<typeof session>;

/** Input for creating a new session */
export type NewSession = InferInsertModel<typeof session>;

/** An account as returned from the DB */
export type Account = InferSelectModel<typeof account>;

/** Input for creating a new account */
export type NewAccount = InferInsertModel<typeof account>;

/** A verification as returned from the DB */
export type Verification = InferSelectModel<typeof verification>;

/** Input for creating a new verification */
export type NewVerification = InferInsertModel<typeof verification>;

