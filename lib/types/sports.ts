import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { sportsGame } from "@/db/schema";

/** A sports game as returned from the DB */
export type SportsGame = InferSelectModel<typeof sportsGame>;

/** Input for creating a new sports game */
export type NewSportsGame = InferInsertModel<typeof sportsGame>;

/** Settings used when creating a sports game via server action */
export type GameSettings = {
	externalGameId: string;
	sport: string;
	league: string;
	name: string;
	homeTeamName: string;
	homeTeamAbbr: string;
	homeTeamRecord: string;
	homeTeamColor: string;
	homeTeamLogo: string;
	awayTeamName: string;
	awayTeamAbbr: string;
	awayTeamRecord: string;
	awayTeamColor: string;
	awayTeamLogo: string;
	gameDate: string;
	gameQuarter: number;
	gameClock: string;
	status: string;
};

