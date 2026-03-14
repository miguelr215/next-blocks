import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import vsImg from '@/public/vs.png';
import { Button } from './ui/button';

interface BlocksGameCardProps {
    game: {
        blocksGame: {
            id: string;
            sportsGameId: string;
            isActive: boolean;
            isPrivate: boolean;
            createdBy: string;
            pricePerBlock: string;
            blocksSold: number;
            prizeTotal: string;
            allowsTouches: boolean;
            prizeQ1: string;
            prizePerTouchQ1: string;
            prizeQ2: string;
            prizePerTouchQ2: string;
            prizeQ3: string;
            prizePerTouchQ3: string;
            prizeQ4: string;
            prizePerTouchQ4: string;
            createdAt: Date;
            updatedAt: Date;
        }
        sportsGame: {
            id: string;
            externalGameId: string;
            sport: string;
            league: string;
            name: string;
            homeTeamName: string;
            homeTeamAbbr: string;
            homeTeamRecord: string;
            homeTeamColor: string;
            homeTeamLogo: string;
            awayTeamName: string;
            awayTeamAbbr: string;
            awayTeamRecord: string;
            awayTeamColor: string;
            awayTeamLogo: string;
            status: string;
            gameDate: string;
            gameQuarter: number;
            gameClock: string;
        }
    }
}

const BlocksGameCard = ({ game }: BlocksGameCardProps) => {
    return (
        <div className='border border-gray-300 rounded-lg hover:shadow-lg dark:hover:shadow-gray-100 transition-all duration-300 ease-in-out h-full max-w-120 lg:max-w-72'>
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
                    <div>
                        <p>
                            {game.sportsGame.awayTeamName} <span className="text-xs text-gray-600">({game.sportsGame.awayTeamRecord})</span>
                        </p>
                        @
                        <p className=' mb-1'>
                            {game.sportsGame.homeTeamName} <span className="text-xs text-gray-600">({game.sportsGame.homeTeamRecord})</span>
                        </p>
                        <p className='text-xs mb-1'>
                            Blocks: {game.blocksGame.blocksSold} / 100
                        </p>
                        <p className='text-xs mb-1'>
                            Price: ${game.blocksGame.pricePerBlock}
                        </p>
                    </div>
                    <div className="cta-wrapper">
                        <Button variant="default" size="sm" className='cursor-pointer'>Play Now</Button>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default BlocksGameCard