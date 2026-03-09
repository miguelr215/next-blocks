import Link from 'next/link';
import HoverGifCard from '@/components/HoverGifCard';
import footballImg from '@/public/sport-football.png';
import footballGif from '@/public/football-spinner.gif';
import basketballImg from '@/public/sport-basketball.png';
import basketballGif from '@/public/basketball-dunk.gif';
import baseballImg from '@/public/sport-baseball.png';
import baseballGif from '@/public/sandlot-baseball.gif';
import hockeyImg from '@/public/sport-hockey.png';
import hockeyGif from '@/public/snoopy-hockey.gif';

const AvailableSports = () => {
    return (
        <ul className='flex flex-col gap-4 items-center sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'>
            <li >
                <Link href="/sports/nfl" className='sm:flex sm:justify-end lg:justify-start'>
                    <HoverGifCard image={footballImg.src} gif={footballGif.src} sport="Football" />
                </Link>
            </li>
            <li>
                <Link href="/sports/nba">
                    <HoverGifCard image={basketballImg.src} gif={basketballGif.src} sport="Basketball" />
                </Link>
            </li>
            <li>
                <Link href="/sports/mlb" className='sm:flex sm:justify-end lg:justify-start'>
                    <HoverGifCard image={baseballImg.src} gif={baseballGif.src} sport="Baseball" />
                </Link>
            </li>
            <li>
                <Link href="/sports/nhl">
                    <HoverGifCard image={hockeyImg.src} gif={hockeyGif.src} sport="Hockey" />
                </Link>
            </li>
        </ul>
    )
}

export default AvailableSports