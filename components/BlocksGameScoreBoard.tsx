import Image from 'next/image';
import type { BlocksGame, SportsGame } from '@/lib/types';
import { formatCurrency, getOrdinalSuffix } from '@/lib/utils';

interface BlocksGameScoreBoardProps {
    blocksGame: BlocksGame;
    sportsGame: SportsGame;
}

const BlocksGameScoreBoard = ({ blocksGame, sportsGame }: BlocksGameScoreBoardProps) => {
    return (
        <div className='mt-4 w-full max-w-3xl mx-auto lg:flex lg:justify-between'>
            <div className="">
                {/* Game header */}
                <div className="mb-2 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src={sportsGame.awayTeamLogo}
                            alt={sportsGame.awayTeamName}
                            width={40}
                            height={40}
                        />
                        <div className="text-center">
                            <p className="font-bold lg:hidden">{sportsGame.awayTeamAbbr}</p>
                            <p className="font-bold hidden lg:block">{sportsGame.awayTeamName}</p>
                            <p className="text-xs text-gray-500">
                                ({sportsGame.awayTeamRecord})
                            </p>
                        </div>
                    </div>
                    <span className="text-lg font-semibold">@</span>
                    <div className="flex items-center gap-2">
                        <div className="text-center">
                            <p className="font-bold lg:hidden">{sportsGame.homeTeamAbbr}</p>
                            <p className="font-bold hidden lg:block">{sportsGame.homeTeamName}</p>
                            <p className="text-xs text-gray-500">
                                ({sportsGame.homeTeamRecord})
                            </p>
                        </div>
                        <Image
                            src={sportsGame.homeTeamLogo}
                            alt={sportsGame.homeTeamName}
                            width={40}
                            height={40}
                        />
                    </div>
                </div>

                {/* Sports Game info */}
                <div className="flex items-center justify-center gap-4 mb-2 lg:gap-8">
                    <p className="text-5xl font-semibold">{sportsGame.awayTeamScoreCurrent}</p>
                    <span className='font-semibold'>&mdash;</span>
                    <p className="text-5xl font-semibold">{sportsGame.homeTeamScoreCurrent}</p>
                </div>
                {/* Game status */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    {sportsGame.status === "pre" ? (
                        <p>{new Date(sportsGame.gameDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            timeZoneName: "short"
                        })}</p>
                    ) : (
                        <>
                            <p>{sportsGame.gameQuarter}{getOrdinalSuffix(sportsGame.gameQuarter)} Quarter</p>
                            <p>{sportsGame.gameClock}</p>
                        </>
                    )}
                </div>
            </div>



            {/* Blocks Game info */}
            <div className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400 sm:max-w-1/3 sm:mx-auto lg:me-0 lg:border lg:rounded-xl lg:p-6">
                <p className='flex justify-between gap-4'>
                    <span className="font-semibold mb-1">Blocks available:</span> <span>{100 - blocksGame.blocksSold} / 100</span>
                </p>
                <p className='flex justify-between gap-4'>
                    <span className="font-semibold mb-1">Price per block:</span> <span>{formatCurrency(blocksGame.pricePerBlock)}</span>
                </p>
                <p className='flex justify-between gap-4'>
                    <span className="font-semibold">Prize pool:</span> <span>{formatCurrency(blocksGame.prizeTotal)}</span>
                </p>
            </div>
        </div>
    )
}

export default BlocksGameScoreBoard