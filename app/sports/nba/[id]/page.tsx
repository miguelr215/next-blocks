import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import BlocksGameGrid from "@/components/BlocksGameGrid";
import { getBlocksGameById } from "@/server/games";
import { getAllBlocksForGame } from "@/server/blocks";
import BlocksGameScoreBoard from "@/components/BlocksGameScoreBoard";

interface NBABlockGamePageProps {
  params: Promise<{ id: string }>;
}

const NBABlockGamePage = async ({ params }: NBABlockGamePageProps) => {
  const { id } = await params;

  // Server-side auth check — redirect unauthenticated users to login
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

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
      <BlocksGameScoreBoard blocksGame={blocksGame} sportsGame={sportsGame} />

      {/* Blocks grid */}
      <BlocksGameGrid
        blocks={blocksResult.data}
        sportsGame={sportsGame}
        blocksGame={blocksGame}
        userId={userId}
      />
    </div>
  );
};

export default NBABlockGamePage;
