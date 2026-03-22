import BlocksGameGrid from "@/components/BlocksGameGrid";
import { getBlocksGameById } from "@/server/games";
import { getAllBlocksForGame } from "@/server/blocks";
import Image from "next/image";
import Link from "next/link";

interface NBABlockGamePageProps {
    params: Promise<{ id: string }>;
}

const NBABlockGamePage = async ({ params }: NBABlockGamePageProps) => {
    const { id } = await params;

    const [gameResult, blocksResult] = await Promise.all([
        getBlocksGameById(id),
        getAllBlocksForGame(id),
    ]);

    if (!gameResult.success || !gameResult.data) {
        return (
            <div>
                <h1 className="page-title">Game Not Found</h1>
                <Link href="/sports/nba">Back to Games</Link>
                <p className="mt-8">{gameResult.message}</p>
            </div>
        );
    }

    if (!blocksResult.success || !blocksResult.data) {
        return (
            <div>
                <h1 className="page-title">Error Loading Blocks</h1>
                <Link href="/sports/nba">Back to Games</Link>
                <p className="mt-8">{blocksResult.message}</p>
            </div>
        );
    }

    const { blocksGame, sportsGame } = gameResult.data;

    return (
        <div>
            {/* Game header */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Image src={sportsGame.awayTeamLogo} alt={sportsGame.awayTeamName} width={40} height={40} />
                    <div className="text-center">
                        <p className="font-bold">{sportsGame.awayTeamAbbr}</p>
                        <p className="text-xs text-gray-500">({sportsGame.awayTeamRecord})</p>
                    </div>
                </div>
                <span className="text-lg font-semibold">@</span>
                <div className="flex items-center gap-2">
                    <div className="text-center">
                        <p className="font-bold">{sportsGame.homeTeamAbbr}</p>
                        <p className="text-xs text-gray-500">({sportsGame.homeTeamRecord})</p>
                    </div>
                    <Image src={sportsGame.homeTeamLogo} alt={sportsGame.homeTeamName} width={40} height={40} />
                </div>
            </div>

            {/* Game info */}
            <div className="text-center mb-6 text-sm text-gray-600 dark:text-gray-400">
                <p>Price per block: ${blocksGame.pricePerBlock} &bull; Blocks sold: {blocksGame.blocksSold} / 100</p>
                <p>Prize pool: ${blocksGame.prizeTotal}</p>
            </div>

            {/* Blocks grid */}
            <BlocksGameGrid
                blocks={blocksResult.data}
                sportsGame={sportsGame}
                blocksGame={blocksGame}
            />
        </div>
    );
};

export default NBABlockGamePage;