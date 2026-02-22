import Link from 'next/link'
import React from 'react'
import SpotlightCard from '@/components/SpotlightCard';

const SportsPage = () => {
    return (
        <div>
            <h1 className="page-title">Sports</h1>
            <ul className='flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'>
                <li>
                    <Link href="/nfl">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                            <h2>NFL</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/nba">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(225, 0, 225, 0.2)">
                            <h2>NBA</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/mlb">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 255, 52, 0.2)">
                            <h2>MLB</h2>
                        </SpotlightCard>
                    </Link>
                </li>
                <li>
                    <Link href="/nhl">
                        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 25, 255, 0.2)">
                            <h2>NHL</h2>
                        </SpotlightCard>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SportsPage