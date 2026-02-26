"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getEventsBySportAndDateRange } from "@/server/sports";
import { formatDatetoYYYYMMDD } from "@/lib/utils";
import { createBlocksGame } from "@/server/games";

export const GET = async (request: NextRequest) => {
	console.log("cron running");

	const startDate = new Date();
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 1);
	// const nflData = await getEventsBySportAndDateRange("nfl", formatDatetoYYYYMMDD(startDate), formatDatetoYYYYMMDD(endDate));
	const nbaData = await getEventsBySportAndDateRange(
		"nba",
		formatDatetoYYYYMMDD(startDate),
		formatDatetoYYYYMMDD(endDate),
	);
	// const mlbData = await getEventsBySportAndDateRange("mlb", formatDatetoYYYYMMDD(startDate), formatDatetoYYYYMMDD(endDate));
	// const nhlData = await getEventsBySportAndDateRange("nhl", formatDatetoYYYYMMDD(startDate), formatDatetoYYYYMMDD(endDate));
	// console.log("data in page: ", nflData);
	console.log("nbaData: ", nbaData);
	// console.log("mlbData: ", mlbData);
	// console.log("nhlData: ", nhlData);

	for (const game of nbaData) {
		const gameSettings = {
			externalGameId: game.id,
			sport: "basketball",
			league: "nba",
			name: game.name,
			homeTeamName: game.competitions[0].competitors[0].team.displayName,
			homeTeamAbbr: game.competitions[0].competitors[0].team.abbreviation,
			homeTeamRecord: game.competitions[0].competitors[0].records[0].summary,
			homeTeamColor: game.competitions[0].competitors[0].team.color,
			homeTeamLogo: game.competitions[0].competitors[0].team.logo,
			awayTeamName: game.competitions[0].competitors[1].team.displayName,
			awayTeamAbbr: game.competitions[0].competitors[1].team.abbreviation,
			awayTeamRecord: game.competitions[0].competitors[1].records[0].summary,
			awayTeamColor: game.competitions[0].competitors[1].team.color,
			awayTeamLogo: game.competitions[0].competitors[1].team.logo,
			status: game.status.type.state, // pre, in, post
			gameDate: game.date,
			gameQuarter: game.status.period,
			gameClock: game.status.displayClock,
		};
		console.log("gameSettings: ", gameSettings);
		const { success, message, data } = await createBlocksGame(gameSettings);
		if (success) {
			console.log("Game created successfully:", data);
		} else {
			console.error("Error creating game:", message);
		}
	}

	console.log("cron complete");
	return NextResponse.json({ message: "OK" }, { status: 200 });
};
