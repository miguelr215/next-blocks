import Link from 'next/link'
import React from 'react'

const HowToPlayHero = () => {
    return (
        <div className='flex flex-col gap-6 w-full max-w-125 md:max-w-none mx-auto md:grid md:grid-cols-2 lg:max-w-5xl'>
            <div>
                <h1 className="page-title">How To Play <span className="md:block">Sports Blocks!</span></h1>
                <p className='page-subtitle'>A fun way to enjoy your favorite sports!</p>
                <p className='page-subtitle'>Sign Up Today &amp; Start Playing!</p>
                <Link href="/signup" className='cta-link-btn hover:bg-blue-900'>Sign Up</Link>
            </div>
            <div className='w-full max-w-125 mx-auto md:pt-6'>
                <video src="/football-tackle.mp4" autoPlay loop muted playsInline className='w-full h-auto' />
            </div>
        </div>
    )
}

export default HowToPlayHero