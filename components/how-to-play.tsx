import React from 'react'
import SpotlightCard from './SpotlightCard'

const HowToPlaySection = () => {
    return (
        <section className='py-6 lg:py-8'>
            <h2 className="section-title sm:text-center">How To Play</h2>
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 mb-6">
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 255, 52, 0.25)">
                    <h3 className="text-xl font-bold">Step <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full">1</span></h3>
                    <hr className='w-full border border-b border-gray-300' />
                    <p>Choose a game &mdash; NFL, NBA, MLB, or NHL games available</p>
                </SpotlightCard>
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 0, 255, 0.25)">
                    <h3 className="text-xl font-bold">Step <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full">2</span></h3>
                    <hr className='w-full border border-b border-gray-300' />
                    <p>Buy a block... or multiple blocks!</p>
                </SpotlightCard>
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(25, 25, 255, 0.25)">
                    <h3 className="text-xl font-bold">Step <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full">3</span></h3>
                    <hr className='w-full border border-b border-gray-300' />
                    <p>Enjoy the game... it&apos;s that easy!</p>
                </SpotlightCard>
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 0, 0.25)">
                    <h3 className="text-xl font-bold">Step <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full">4</span></h3>
                    <hr className='w-full border border-b border-gray-300' />
                    <p>Prizes automatically paid out for winning blocks!</p>
                </SpotlightCard>
            </div>
            <h2 className="page-subtitle font-bold sm:text-center">How To Win</h2>
            <div>

            </div>
        </section>
    )
}

export default HowToPlaySection