import Link from 'next/link'
import React from 'react'

const SportsPage = () => {
    return (
        <div>
            <h1>Sports</h1>
            <ul>
                <li>
                    <Link href="/nfl">NFL</Link>
                </li>
                <li>
                    <Link href="/nba">NBA</Link>
                </li>
                <li>
                    <Link href="/mlb">MLB</Link>
                </li>
                <li>
                    <Link href="/nhl">NHL</Link>
                </li>
            </ul>
        </div>
    )
}

export default SportsPage