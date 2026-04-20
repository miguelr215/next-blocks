import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getActiveBlocksGamesForUser } from '@/server/games'
import BlocksGameCard from '@/components/BlocksGameCard'

const MyGamesPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const { success, message, data } = await getActiveBlocksGamesForUser(session.user.id)

    return (
        <section className='mt-4'>
            <h1 className="text-2xl font-bold">My Games</h1>

            {!success ? (
                <p className="mt-4 text-muted-foreground">Error loading games: {message}</p>
            ) : data && data.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-y-12">
                    {data.map((game) => (
                        <BlocksGameCard game={game} key={game.blocksGame.id} />
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-muted-foreground">No active games found.</p>
            )}
        </section>
    )
}

export default MyGamesPage