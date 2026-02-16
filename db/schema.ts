import { is, relations } from "drizzle-orm";
import {
	pgTable,
	pgEnum,
	text,
	integer,
	numeric,
	timestamp,
	date,
	boolean,
	index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
	"PURCHASE",
	"REFUND",
	"PAYOUT",
	"DEPOSIT",
	"WITHDRAWAL",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
	"PENDING",
	"COMPLETED",
	"FAILED",
	"REFUNDED",
]);

// AUTH TABLES
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	phoneNumber: text("phone_number"),
	phoneVerified: boolean("phone_verified").default(false).notNull(),
	image: text("image"),
	role: userRoleEnum("user_role").default("USER").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	accountBalance: numeric("account_balance", { precision: 10, scale: 2 })
		.default("0")
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

// GAME TABLES
export const sportsGame = pgTable("sportsGame", {
	id: text("id").primaryKey(),
	externalGameId: text("external_game_id").notNull().unique(),
	sport: text("sport").notNull(),
	league: text("league").notNull(),
	homeTeamName: text("home_team_name").notNull(),
	homeTeamAbbr: text("home_team_abbr").notNull(),
	homeTeamRecord: text("home_team_record").notNull(),
	homeTeamColor: text("home_team_color").notNull(),
	homeTeamLogo: text("home_team_logo").notNull(),
	homeTeamScoreCurrent: integer("home_team_score_current")
		.default(0)
		.notNull(), // x-axis score
	homeTeamScoreQ1: integer("home_team_score_q1").default(0).notNull(),
	homeTeamScoreQ2: integer("home_team_score_q2").default(0).notNull(),
	homeTeamScoreQ3: integer("home_team_score_q3").default(0).notNull(),
	homeTeamScoreQ4: integer("home_team_score_q4").default(0).notNull(),
	awayTeamName: text("away_team_name").notNull(),
	awayTeamAbbr: text("away_team_abbr").notNull(),
	awayTeamRecord: text("away_team_record").notNull(),
	awayTeamColor: text("away_team_color").notNull(),
	awayTeamLogo: text("away_team_logo").notNull(),
	awayTeamScoreCurrent: integer("away_team_score_current")
		.default(0)
		.notNull(), // y-axis score
	awayTeamScoreQ1: integer("away_team_score_q1").default(0).notNull(),
	awayTeamScoreQ2: integer("away_team_score_q2").default(0).notNull(),
	awayTeamScoreQ3: integer("away_team_score_q3").default(0).notNull(),
	awayTeamScoreQ4: integer("away_team_score_q4").default(0).notNull(),
	status: text("status").notNull(),
	gameDate: timestamp("game_date").notNull(),
	gameQuarter: integer("game_quarter").notNull(),
	gameClock: text("game_clock").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const blocksGame = pgTable(
	"blocksGame",
	{
		id: text("id").primaryKey(),
		isActive: boolean("is_active").default(true).notNull(),
		isPrivate: boolean("is_private").default(false).notNull(),
		createdBy: text("created_by").default("system").notNull(),
		pricePerBlock: numeric("price_per_block", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		blocksSold: integer("blocks_sold").default(0).notNull(),
		prizeTotal: numeric("prize_total", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		allowsTouches: boolean("allows_touches").default(true).notNull(),
		prizeQ1: numeric("prize_q1", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		prizePerTouchQ1: numeric("prize_per_touch_q1", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		prizeQ2: numeric("prize_q2", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		prizePerTouchQ2: numeric("prize_per_touch_q2", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		prizeQ3: numeric("prize_q3", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		prizePerTouchQ3: numeric("prize_per_touch_q3", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		prizeQ4: numeric("prize_q4", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		prizePerTouchQ4: numeric("prize_per_touch_q4", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		sportsGameId: text("sports_game_id")
			.notNull()
			.references(() => sportsGame.id, { onDelete: "cascade" }),
	},
	(table) => [index("blocksGame_sportsGameId_idx").on(table.sportsGameId)],
);

export const block = pgTable(
	"block",
	{
		id: text("id").primaryKey(),
		isPurchased: boolean("is_purchased").default(false).notNull(),
		blockPrice: numeric("block_price", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		purchaseAmt: numeric("purchase_amt", {
			precision: 10,
			scale: 2,
		})
			.default("0")
			.notNull(),
		xValue: integer("x_value").default(0).notNull(), // home team x-axis
		yValue: integer("y_value").default(0).notNull(), // away team y-axis
		usedPromoCode: boolean("used_promo_code").default(false).notNull(),
		promoCodeApplied: text("promo_code_applied"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		userId: text("user_id")
			.default("")
			.references(() => user.id, { onDelete: "cascade" }),
		blocksGameId: text("blocks_game_id")
			.notNull()
			.references(() => blocksGame.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("block_userId_idx").on(table.userId),
		index("block_blocksGameId_idx").on(table.blocksGameId),
	],
);

export const transaction = pgTable(
	"transaction",
	{
		id: text("id").primaryKey(),
		type: transactionTypeEnum("transaction_type").notNull(),
		amount: numeric("amount", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		status: transactionStatusEnum("transaction_status")
			.default("PENDING")
			.notNull(),
		paymentMethod: text("payment_method"),
		externalTransactionId: text("external_transaction_id"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		completedAt: timestamp("completed_at"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		blocksGameId: text("blocks_game_id")
			.notNull()
			.references(() => blocksGame.id, { onDelete: "cascade" }),
		blockId: text("block_id")
			.default("")
			.references(() => block.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("transaction_userId_idx").on(table.userId),
		index("transaction_blocksGameId_idx").on(table.blocksGameId),
		index("transaction_blockId_idx").on(table.blockId),
	],
);

export const winner = pgTable(
	"winner",
	{
		id: text("id").primaryKey(),
		winAmount: numeric("win_amount", { precision: 10, scale: 2 })
			.default("0")
			.notNull(),
		winQtr: integer("win_qtr").notNull(),
		winXValue: integer("win_x_value").notNull(),
		winYValue: integer("win_y_value").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		blocksGameId: text("blocks_game_id")
			.notNull()
			.references(() => blocksGame.id, { onDelete: "cascade" }),
		blockId: text("block_id")
			.default("")
			.references(() => block.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("winner_userId_idx").on(table.userId),
		index("winner_blocksGameId_idx").on(table.blocksGameId),
		index("winner_blockId_idx").on(table.blockId),
	],
);

export const schema = {
	user,
	session,
	account,
	verification,
	sportsGame,
	blocksGame,
	block,
	transaction,
	winner,
};
