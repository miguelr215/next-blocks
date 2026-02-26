import Link from 'next/link'
import React from 'react'
import SpotlightCard from '@/components/SpotlightCard';
import { getEventsBySportAndDateRange } from "@/server/sports";
import { formatDatetoYYYYMMDD } from "@/lib/utils";
import { createSportsGame } from "@/server/sports";
import { createBlocksGame } from '@/server/games';

const SportsPage = async () => {
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

    const createdGames = [];
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
        const { success, message, data } = await createSportsGame(gameSettings);
        if (success) {
            createdGames.push(data);
            console.log("Sports Game created successfully:", data);
        } else {
            console.error("Error creating game:", message);
        }
    }

    console.log("all createdGames: ", createdGames);

    for (const game of createdGames) {
        if (!game?.id) {
            console.error("No id for game:", game);
            continue;
        }
        const blocksGameSettings = {
            sportsGameId: game.id,
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
        }
        const { success, message, data } = await createBlocksGame(blocksGameSettings);
        if (success) {
            console.log("Blocks Game created successfully:", data);
        } else {
            console.error("Error creating game:", message);
        }
    }

    return (
        <div>
            <h1 className="page-title">Sports</h1>
            <ul className='flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'>
                <li>
                    <Link href="/nfl">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                            <h2>NFL</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/nba">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(225, 0, 225, 0.2)">
                            <h2>NBA</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/mlb">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 255, 52, 0.2)">
                            <h2>MLB</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/nhl">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 25, 255, 0.2)">
                            <h2>NHL</h2>
                        </SpotlightCard>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SportsPage