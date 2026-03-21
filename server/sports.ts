"use server";

import { db } from "@/db/drizzle";
import { sportsGame } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

import { createModuleLogger } from "@/logger.js";

const logger = createModuleLogger("sports-server");

type GameSettings = {
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

// get events by sport and date range ✅
export const getEventsBySportAndDateRange = async (
	league: string,
	startDate: string,
	endDate: string,
) => {
	logger.info(
		`getEventsBySportAndDateRange called with league: ${league}, startDate: ${startDate}, endDate: ${endDate}`,
	);

	let sport = "";
	if (league === "nba") {
		sport = "basketball";
	} else if (league === "nfl") {
		sport = "football";
	} else if (league === "mlb") {
		sport = "baseball";
	} else if (league === "nhl") {
		sport = "hockey";
	}

	try {
		const response = await fetch(
			`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?limit=1000&dates=${startDate}-${endDate}`,
		);
		const data = await response.json();
		logger.info(`data.events: ${data.events}`);

		return data.events || [];
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error fetching sports",
		);
		throw error;
	}
};

// create a new sports game in DB ✅
export const createSportsGame = async (gameSettings: GameSettings) => {
	logger.info(`createSportsGame called with gameSettings: ${gameSettings}`);

	try {
		const existingGame = await db
			.select()
			.from(sportsGame)
			.where(eq(sportsGame.externalGameId, gameSettings.externalGameId))
			.limit(1);

		if (existingGame.length > 0) {
			return {
				success: false,
				message: `A game with external game ID ${gameSettings.externalGameId} already exists`,
			};
		}

		const newGame = await db
			.insert(sportsGame)
			.values({
				id: crypto.randomUUID(),
				externalGameId: gameSettings.externalGameId,
				sport: gameSettings.sport,
				league: gameSettings.league,
				name: gameSettings.name,
				homeTeamName: gameSettings.homeTeamName,
				homeTeamAbbr: gameSettings.homeTeamAbbr,
				homeTeamRecord: gameSettings.homeTeamRecord,
				homeTeamColor: gameSettings.homeTeamColor,
				homeTeamLogo: gameSettings.homeTeamLogo,
				awayTeamName: gameSettings.awayTeamName,
				awayTeamAbbr: gameSettings.awayTeamAbbr,
				awayTeamRecord: gameSettings.awayTeamRecord,
				awayTeamColor: gameSettings.awayTeamColor,
				awayTeamLogo: gameSettings.awayTeamLogo,
				status: gameSettings.status,
				gameDate: gameSettings.gameDate,
				gameQuarter: gameSettings.gameQuarter,
				gameClock: gameSettings.gameClock,
			})
			.returning();

		logger.info(`created sportsGame newGame: ${newGame}`);

		return {
			success: true,
			message: "Game created successfully",
			data: newGame[0],
		};
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Error creating sports game",
		);
		return {
			success: false,
			message: `Error creating sports game: ${(error as Error).message}`,
		};
	}
};

// update sports game
export const updateSportsGame = async (
	id: string,
	updates: Partial<GameSettings>,
) => {};

// ***************************************
// TODO: FUNCTIONS FOR PHASE 2

// delete sports game

// archive sports game

// ***************************************
