"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { createModuleLogger } from "@/logger.js";
import { formatDatetoYYYYMMDD } from "@/lib/utils";
import { createBlocksGame } from "@/server/games";
import {
	createSportsGame,
	getEventsBySportAndDateRange,
} from "@/server/sports";

const logger = createModuleLogger("cron-create-games");

// TODO: Add mlb and nhl, once you create the blocks games table (9 innings, 3periods) for them
const leagues = ["nfl", "nba"];
const sports = {
	nfl: "football",
	nba: "basketball",
	mlb: "baseball",
	nhl: "hockey",
};
const NUM_OF_DAYS = 1;

// Cron to create initial block games ✅
export const GET = async (request: NextRequest) => {
	logger.info("cron-create-games running");

	const startDate = new Date();
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + NUM_OF_DAYS);

	const createdGames: {
		blocksGame: NonNullable<
			Awaited<ReturnType<typeof createBlocksGame>>["data"]
		>;
		sportsGame: NonNullable<
			Awaited<ReturnType<typeof createSportsGame>>["data"]
		>;
	}[] = [];

	for (const league of leagues) {
		const sport = sports[league as keyof typeof sports];
		logger.info(`Fetching events for league: ${league}, sport: ${sport}`);

		// Get events from ESPN
		const eventsData = await getEventsBySportAndDateRange(
			league,
			formatDatetoYYYYMMDD(startDate),
			formatDatetoYYYYMMDD(endDate),
		);

		logger.info(`${league} events found: ${eventsData.length}`);

		for (const game of eventsData) {
			const gameSettings = {
				externalGameId: game.id,
				sport,
				league,
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

			logger.info({ gameSettings }, `[${league}] Creating sports game`);

			// Create a sports game
			const { success, message, data } = await createSportsGame(gameSettings);

			if (success && data) {
				logger.info({ data }, `[${league}] Sports game created successfully`);

				const blocksGameSettings = {
					sportsGameId: data.id,
					isPrivate: false,
					createdBy: "system",
					pricePerBlock: 10,
					allowsTouches: false,
					prizeTotal: 1000,
					prizeQ1: 100,
					prizePerTouchQ1: 0,
					prizeQ2: 200,
					prizePerTouchQ2: 0,
					prizeQ3: 300,
					prizePerTouchQ3: 0,
					prizeQ4: 400,
					prizePerTouchQ4: 0,
				};

				// Create a blocks game for the newly created sports game
				const blocksResult = await createBlocksGame(blocksGameSettings);

				if (blocksResult.success && blocksResult.data) {
					logger.info(
						{ blocksGame: blocksResult.data },
						`[${league}] Blocks game created successfully`,
					);
					createdGames.push({
						blocksGame: blocksResult.data,
						sportsGame: data,
					});
				} else {
					logger.error(
						`[${league}] Error creating blocks game: ${blocksResult.message}`,
					);
				}
			} else {
				logger.error(`[${league}] Error creating sports game: ${message}`);
			}
		}
	}

	logger.info(`cron complete. Total games created: ${createdGames.length}`);
	return NextResponse.json(
		{ message: "OK", totalCreated: createdGames.length },
		{ status: 200 },
	);
};
