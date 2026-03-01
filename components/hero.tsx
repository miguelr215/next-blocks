import Link from 'next/link'
import FullLogo from './ui/fullLogo'

const Hero = () => {
    return (
        <section className="flex flex-col md:flex-row md:gap-4 md:py-8 lg:p-8 lg:gap-6">
            <div className="mb-8 lg:mb-0 lg:pt-6">
                <h1 className="page-title">Sports Blocks</h1>
                <p className="page-subtitle lg:mb-8">A new way to watch and bet on your favorite sports.</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-around sm:items-center sm:gap-4 sm:max-w-3/4 sm:mx-auto md:mx-0">
                    <Link href="/signup" className='cta-link-btn hover:bg-blue-900'>Get Started</Link>
                    <Link href="/how-to-play" className='cta-link-btn hover:bg-green-900'>How To Play</Link>
                    <Link href="/login" className='cta-link-btn hover:bg-yellow-600'>Login</Link>
                </div>
            </div>
            <div className="hero-img w-full max-w-full sm:max-w-fit sm:mx-auto">
                <FullLogo />
            </div>
        </section>
    )
}

export default Hero