import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserBlocksWithGames } from '@/server/games'
import { formatCurrency } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const GamesHistoryPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const { success, message, data } = await getUserBlocksWithGames(session.user.id)

    /** Group blocks by year extracted from sportsGame.gameDate */
    const blocksByYear: Record<string, typeof data> = {}

    if (data) {
        for (const entry of data) {
            const year = new Date(entry.sportsGame.gameDate).getFullYear().toString()

            if (!blocksByYear[year]) {
                blocksByYear[year] = []
            }
            blocksByYear[year].push(entry)
        }
    }

    /** Years sorted descending (most recent first) */
    const sortedYears = Object.keys(blocksByYear).sort((a, b) => Number(b) - Number(a))

    return (
        <section className='mt-4'>
            <h1 className="text-2xl font-bold">My Games - History</h1>

            {!success ? (
                <p className="mt-4 text-muted-foreground">Error loading games: {message}</p>
            ) : sortedYears.length > 0 ? (
                <div className="mt-6 space-y-8">
                    {sortedYears.map((year) => (
                        <div key={year}>
                            <h2 className="text-xl font-semibold border-b pb-1 mb-3">{year}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {blocksByYear[year]!.map((entry) => (
                                    <Link
                                        key={entry.block.id}
                                        href={`/sports/${entry.sportsGame.league.toLowerCase()}/${entry.blocksGame.id}`}
                                    >
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <CardDescription>{entry.sportsGame.league.toUpperCase()}</CardDescription>
                                                <CardTitle>{entry.sportsGame.name}</CardTitle>
                                                <CardDescription>
                                                    {new Date(entry.sportsGame.gameDate).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                        timeZoneName: "short"
                                                    })}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm mb-2">
                                                    <span className="font-medium">Block ID:</span> <span className="text-gray-400">{entry.block.id}</span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-medium">Block Price:</span> {formatCurrency(entry.block.blockPrice)}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-muted-foreground">No games found.</p>
            )}
        </section>
    )
}

export default GamesHistoryPage