import Link from 'next/link'
import React from 'react'

const HPBannerCTA = () => {
    return (
        <section className='bg-blue-800 w-full mt-6 p-6 grid grid-cols-2 gap-4 md:flex md:justify-center md:items-center'>
            <p className="text-gray-200 font-semibold text-lg">Join Sports Blocks TODAY &mdash; It&apos;s almost game time!</p>
            <div className='flex justify-center items-center'>
                <Link href="/signup" className='cta-link-btn'>Sign Up</Link>
            </div>
        </section>
    )
}

export default HPBannerCTA