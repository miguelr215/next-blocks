import GridWinner from '@/public/grid-winner.png';
import ScoreWinner from '@/public/score-winner.png';
import Image from 'next/image';

const HowToWinSection = () => {
    return (
        <section className='py-6 lg:py-8 lg:max-w-4xl lg:mx-auto'>
            <h2 className="section-title sm:text-center">How To Win</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:grid md:grid-cols-2 md:mb-6">
                    <div className="text-center py-6 px-4 md:order-2 md:flex md:flex-col md:gap-2 md:justify-center md:items-center">
                        <h3 className='text-lg font-bold mb-2'>Last Digit of Scores</h3>
                        <p className='max-w-3/4 mx-auto'>The last digit of the home team and away team scores at the end of each quarter determine the winner.</p>
                    </div>
                    <div className="w-full md:order-1">
                        <Image src={ScoreWinner} alt="Winner by last digit of score" className='mx-auto' />
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-2">
                    <div className="text-center py-6 px-4 md:flex md:flex-col md:gap-2 md:justify-center md:items-center">
                        <h3 className='text-lg font-bold mb-2'>Match Scores on Grid</h3>
                        <p className='max-w-3/4 mx-auto'>Winners are determined by matching the home team and away team scores on the grid at the end of each quarter.</p>
                    </div>
                    <div className="w-full">
                        <Image src={GridWinner} alt="Winner by last digit of score" className='mx-auto' />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowToWinSection