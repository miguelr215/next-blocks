import HowToPlaySection from '@/components/how-to-play'
import HowToPlayHero from '@/components/how-to-play-hero'
import HowToWinSection from '@/components/how-to-win'
import React from 'react'

const HowToPlayPage = () => {
    return (
        <div>
            <HowToPlayHero />
            <HowToPlaySection />
            <HowToWinSection />
        </div>
    )
}

export default HowToPlayPage