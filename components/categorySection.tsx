import AvailableSports from './available-sports'

const CategorySection = () => {
    return (
        <section className='py-6 lg:py-8'>
            <h2 className="section-title sm:text-center">Available Sports</h2>
            <p className='page-subtitle sm:text-center'>Choose your favorite sport and start playing today!</p>
            <AvailableSports />
        </section>
    )
}

export default CategorySection