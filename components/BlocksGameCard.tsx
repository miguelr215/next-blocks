import Link from 'next/link';
import Image from 'next/image';
import vsImg from '@/public/vs.png';
import { Button } from './ui/button';
import type { BlocksGame, SportsGame } from '@/lib/types';

interface BlocksGameCardProps {
    game: {
        blocksGame: BlocksGame;
        sportsGame: SportsGame;
    };
}

const BlocksGameCard = ({ game }: BlocksGameCardProps) => {
    return (
        <div className='border border-gray-300 rounded-lg hover:shadow-lg dark:hover:shadow-gray-100 transition-all duration-300 ease-in-out h-full max-w-120 lg:max-w-74'>
            <Link href={`/sports/${game.sportsGame.league}/${game.blocksGame.id}`} className='grid grid-cols-2 h-full lg:flex lg:flex-col'>
                <div className='relative h-full flex flex-col'>
                    <div className="p-4 flex-1 flex justify-center items-center rounded-tl-lg lg:rounded-t-lg" style={{ backgroundColor: `#${game.sportsGame.awayTeamColor}` }}>
                        <Image src={game.sportsGame.awayTeamLogo} alt={game.sportsGame.awayTeamName} width={50} height={50} />
                    </div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Image src={vsImg} alt="vs" width={30} height={30} />
                    </div>
                    <div className="p-4 flex-1 flex justify-center items-center rounded-bl-lg lg:rounded-bl-none" style={{ backgroundColor: `#${game.sportsGame.homeTeamColor}` }}>
                        <Image src={game.sportsGame.homeTeamLogo} alt={game.sportsGame.homeTeamName} width={50} height={50} />
                    </div>
                </div>
                <div className='p-4 text-center flex flex-col justify-between'>
                    <div className='space-y-1'>
                        <div>
                            <p className='font-bold'>
                                {game.sportsGame.awayTeamName} <span className="text-xs text-gray-600 font-normal">({game.sportsGame.awayTeamRecord})</span>
                            </p>
                            <span className='font-bold'>@</span>
                            <p className='font-bold'>
                                {game.sportsGame.homeTeamName} <span className="text-xs text-gray-600 font-normal">({game.sportsGame.homeTeamRecord})</span>
                            </p>
                        </div>
                        <hr />
                        <p className='text-xs text-gray-300 truncate line-clamp-1'>
                            ID: {game.sportsGame.id}
                        </p>
                        <p className="text-sm">
                            {new Date(game.sportsGame.gameDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                timeZoneName: "short"
                            })}
                        </p>
                        <p className='text-sm lg:flex lg:justify-between'>
                            <span className='font-semibold'>Blocks Available:</span> <span>{100 - game.blocksGame.blocksSold} / 100</span>
                        </p>
                        <p className='text-sm lg:flex lg:justify-between'>
                            <span className='font-semibold'>Price:</span> <span>${game.blocksGame.pricePerBlock} / block</span>
                        </p>
                    </div>
                    <div className="mt-4">
                        <Button variant="default" size="sm" className='cursor-pointer'>Play Now</Button>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default BlocksGameCard