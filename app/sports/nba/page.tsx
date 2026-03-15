import BlocksGameCard from "@/components/BlocksGameCard";
import { formatDatetoYYYYMMDD } from "@/lib/utils";
import { createBlocksGame, getAllActiveBlocksGamesByDateRange } from "@/server/games";
import { createSportsGame, getEventsBySportAndDateRange } from "@/server/sports";

const NBAPage = async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // **************** TESTING STATE ****************
    const nbaData = await getEventsBySportAndDateRange(
        "nba",
        formatDatetoYYYYMMDD(startDate),
        formatDatetoYYYYMMDD(endDate),
    );
    console.log("nbaData: ", nbaData);

    const createdGames: { blocksGame: NonNullable<Awaited<ReturnType<typeof createBlocksGame>>["data"]>; sportsGame: NonNullable<Awaited<ReturnType<typeof createSportsGame>>["data"]> }[] = [];

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
            status: game.status.type.state,
            gameDate: game.date,
            gameQuarter: game.status.period,
            gameClock: game.status.displayClock,
        };
        console.log("gameSettings: ", gameSettings);
        const { success, message, data } = await createSportsGame(gameSettings);
        if (success && data) {
            console.log("Game created successfully:", data);

            // Create a blocks game for the newly created sports game
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
            const blocksResult = await createBlocksGame(blocksGameSettings);
            // TODO: SOMEHOW BLOCK GAMES WERE CREATED BUT BLOCKS WERE NOT?
            if (blocksResult.success && blocksResult.data) {
                console.log("Blocks game created successfully:", blocksResult.data);
                createdGames.push({ blocksGame: blocksResult.data, sportsGame: data });
            } else {
                console.error("Error creating blocks game:", blocksResult.message);
            }
        } else {
            console.error("Error creating game:", message);
        }
    }


    // **************** FUTURE STATE ****************
    // const { success, message, data } = await getAllActiveBlocksGamesByDateRange("nba", startDate.toISOString(), endDate.toISOString());

    // console.log("data - records returned: ", data?.length);

    // if (!success) {
    //     return (
    //         <div>
    //             <h1 className="page-title">Blocks &mdash; NBA Games</h1>
    //             <p>Error loading games: {message}</p>
    //         </div>
    //     );
    // }

    return (
        <div>
            <h1 className="page-title">Blocks &mdash; NBA Games</h1>
            {createdGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-y-12">
                    {createdGames.map((game) => (
                        <BlocksGameCard game={game} key={game.blocksGame.id} />
                    ))}
                </div>
            ) : (
                <p>No active NBA blocks games available.</p>
            )}
        </div>
    );
};

export default NBAPage;