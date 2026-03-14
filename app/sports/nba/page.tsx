import BlocksGameCard from "@/components/BlocksGameCard";
import { getAllActiveBlocksGamesByDateRange } from "@/server/games";

const NBAPage = async () => {
    const startDate = new Date("2026-02-27T00:00Z");
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    const { success, message, data } = await getAllActiveBlocksGamesByDateRange("nba", startDate.toISOString(), endDate.toISOString());

    console.log("data - records returned: ", data?.length);

    if (!success) {
        return (
            <div>
                <h1 className="page-title">Blocks &mdash; NBA Games</h1>
                <p>Error loading games: {message}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Blocks &mdash; NBA Games</h1>
            {data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-y-12">
                    {data.map((game) => (
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