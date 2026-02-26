"use server";

import { db } from "@/db/drizzle";
import { sportsGame } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

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

// get events by sport and date range
export const getEventsBySportAndDateRange = async (
	league: string,
	startDate: string,
	endDate: string,
) => {
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
		// console.log(`league: ${league}, sport: ${sport}, data: `, data);
		return data.events || [];
	} catch (error) {
		console.error("Error fetching sports:", error);
		throw error;
	}
};

// create a new sports game
export const createSportsGame = async (gameSettings: GameSettings) => {
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

		return {
			success: true,
			message: "Game created successfully",
			data: newGame[0],
		};
	} catch (error) {
		console.error("Error creating blocks game:", error);
		return {
			success: false,
			message: `Error creating game: ${(error as Error).message}`,
		};
	}
};
