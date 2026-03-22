import BlocksGameBlock from './BlocksGameBlock';
import type { Block, SportsGame, BlocksGame } from '@/lib/types';

interface BlocksGameGridProps {
    blocks: Block[];
    sportsGame: SportsGame;
    blocksGame: BlocksGame;
}

const BlocksGameGrid = ({ blocks, sportsGame, blocksGame }: BlocksGameGridProps) => {
    // Build a 10x10 lookup: grid[y][x]
    const grid: (Block | undefined)[][] = Array.from({ length: 10 }, () => Array(10).fill(undefined));
    for (const b of blocks) {
        grid[b.yCoordinate][b.xCoordinate] = b;
    }

    // Derive axis numbers from block data
    // Each block at xCoordinate=N has the shuffled homeTeamScore for that column
    // Each block at yCoordinate=N has the shuffled awayTeamScore for that row
    const coordinates = Array.from({ length: 10 }, (_, i) => i);

    const xAxisNumbers = coordinates.map((coord) => {
        const block = blocks.find(b => b.xCoordinate === coord);
        return block?.homeTeamScore ?? coord;
    });

    const yAxisNumbers = coordinates.map((coord) => {
        const block = blocks.find(b => b.yCoordinate === coord);
        return block?.awayTeamScore ?? coord;
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Home team label (top / x-axis) */}
            <div className="text-center font-bold text-sm mb-1" style={{ color: `#${sportsGame.homeTeamColor}` }}>
                {sportsGame.homeTeamAbbr}
            </div>

            <div className="flex items-center">
                {/* Away team label (left / y-axis) */}
                <div className="flex flex-col items-center font-bold text-sm mr-1 leading-none gap-0.5" style={{ color: `#${sportsGame.awayTeamColor}` }}>
                    {sportsGame.awayTeamAbbr.split('').map((char, i) => (
                        <span key={i}>{char}</span>
                    ))}
                </div>

                <div className="flex-1 grid grid-cols-[auto_repeat(10,1fr)] gap-0.5">
                    {/* Top-left empty corner */}
                    <div />

                    {/* X-axis header numbers (columns) */}
                    {xAxisNumbers.map((n, i) => (
                        <div key={`x-${i}`} className="flex items-center justify-center text-xs font-semibold">
                            {blocksGame.axisNumbersGenerated ? n : "?"}
                        </div>
                    ))}

                    {/* Grid rows */}
                    {coordinates.map((y) => (
                        <>
                            {/* Y-axis header number */}
                            <div key={`y-${y}`} className="flex items-center justify-center text-xs font-semibold pr-1">
                                {blocksGame.axisNumbersGenerated ? yAxisNumbers[y] : "?"}
                            </div>

                            {/* Row blocks */}
                            {coordinates.map((x) => {
                                const b = grid[y][x];
                                return b ? (
                                    <BlocksGameBlock key={b.id} block={b} />
                                ) : (
                                    <div key={`empty-${x}-${y}`} className="aspect-square border border-gray-300 rounded-sm" />
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default BlocksGameGrid;