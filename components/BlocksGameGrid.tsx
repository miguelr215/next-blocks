import BlocksGameBlock from './BlocksGameBlock';

interface Block {
    id: string;
    isPurchased: boolean;
    blockPrice: string;
    xCoordinate: number;
    yCoordinate: number;
    homeTeamScore: number;
    awayTeamScore: number;
    userId: string | null;
}

interface BlocksGameGridProps {
    blocks: Block[];
    homeTeamAbbr: string;
    awayTeamAbbr: string;
    homeTeamColor: string;
    awayTeamColor: string;
}

const BlocksGameGrid = ({ blocks, homeTeamAbbr, awayTeamAbbr, homeTeamColor, awayTeamColor }: BlocksGameGridProps) => {
    // Build a 10x10 lookup: grid[y][x]
    const grid: (Block | undefined)[][] = Array.from({ length: 10 }, () => Array(10).fill(undefined));
    for (const b of blocks) {
        grid[b.yCoordinate][b.xCoordinate] = b;
    }

    const axisNumbers = Array.from({ length: 10 }, (_, i) => i);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Away team label (top / x-axis) */}
            <div className="text-center font-bold text-sm mb-1" style={{ color: `#${awayTeamColor}` }}>
                {awayTeamAbbr}
            </div>

            <div className="grid grid-cols-[auto_repeat(10,1fr)] gap-0.5">
                {/* Top-left empty corner */}
                <div />

                {/* X-axis header numbers (columns) */}
                {axisNumbers.map((n) => (
                    <div key={`x-${n}`} className="flex items-center justify-center text-xs font-semibold">
                        {n}
                    </div>
                ))}

                {/* Grid rows */}
                {axisNumbers.map((y) => (
                    <>
                        {/* Y-axis header number */}
                        <div key={`y-${y}`} className="flex items-center justify-center text-xs font-semibold pr-1">
                            {y}
                        </div>

                        {/* Row blocks */}
                        {axisNumbers.map((x) => {
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

            {/* Home team label (left / y-axis) */}
            <div className="text-center font-bold text-sm mt-1" style={{ color: `#${homeTeamColor}` }}>
                {homeTeamAbbr}
            </div>
        </div>
    );
};

export default BlocksGameGrid;