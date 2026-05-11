import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HowToWinSection from '@/components/how-to-win'

// Mock next/image to render a simple img element
vi.mock('next/image', () => ({
    default: ({ src, alt, className }: { src: string | { src: string }; alt: string; className?: string }) => (
        <img
            src={typeof src === 'string' ? src : src.src}
            alt={alt}
            className={className}
            data-testid="next-image"
        />
    ),
}))

describe('HowToWinSection', () => {
    it('renders without crashing', () => {
        render(<HowToWinSection />)

        expect(screen.getByText('How To Win')).toBeInTheDocument()
    })

    it('renders the section title as an h2', () => {
        render(<HowToWinSection />)

        const title = screen.getByText('How To Win')
        expect(title.tagName).toBe('H2')
        expect(title).toHaveClass('section-title', 'sm:text-center')
    })

    it('renders a section element with correct classes', () => {
        render(<HowToWinSection />)

        const section = screen.getByText('How To Win').closest('section')
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('py-6', 'lg:py-8', 'lg:max-w-4xl', 'lg:mx-auto')
    })

    it('renders exactly 2 h3 headings', () => {
        render(<HowToWinSection />)

        const headings = screen.getAllByRole('heading', { level: 3 })
        expect(headings).toHaveLength(2)
    })

    it('renders "Last Digit of Scores" heading with correct classes', () => {
        render(<HowToWinSection />)

        const heading = screen.getByText('Last Digit of Scores')
        expect(heading.tagName).toBe('H3')
        expect(heading).toHaveClass('text-lg', 'font-bold', 'mb-2')
    })

    it('renders "Match Scores on Grid" heading with correct classes', () => {
        render(<HowToWinSection />)

        const heading = screen.getByText('Match Scores on Grid')
        expect(heading.tagName).toBe('H3')
        expect(heading).toHaveClass('text-lg', 'font-bold', 'mb-2')
    })

    it('renders the description for "Last Digit of Scores"', () => {
        render(<HowToWinSection />)

        expect(screen.getByText(/The last digit of the home team and away team scores at the end of each quarter determine the winner/)).toBeInTheDocument()
    })

    it('renders the description for "Match Scores on Grid"', () => {
        render(<HowToWinSection />)

        expect(screen.getByText(/Winners are determined by matching the home team and away team scores on the grid at the end of each quarter/)).toBeInTheDocument()
    })

    it('renders exactly 2 images', () => {
        render(<HowToWinSection />)

        const images = screen.getAllByTestId('next-image')
        expect(images).toHaveLength(2)
    })

    it('renders the ScoreWinner image with correct alt text', () => {
        render(<HowToWinSection />)

        const image = screen.getAllByAltText('Winner by last digit of score')
        expect(image).toHaveLength(2)
    })

    it('renders images with mx-auto class', () => {
        render(<HowToWinSection />)

        const images = screen.getAllByTestId('next-image')
        for (const image of images) {
            expect(image).toHaveClass('mx-auto')
        }
    })

    it('renders the flex column container with correct classes', () => {
        const { container } = render(<HowToWinSection />)

        const flexContainer = container.querySelector('.flex.flex-col.gap-4')
        expect(flexContainer).toBeInTheDocument()
    })

    it('renders two card sections with md:grid layout', () => {
        const { container } = render(<HowToWinSection />)

        const gridSections = container.querySelectorAll('.md\\:grid.md\\:grid-cols-2')
        expect(gridSections).toHaveLength(2)
    })

    it('renders the first card with md:mb-6 class', () => {
        const { container } = render(<HowToWinSection />)

        const gridSections = container.querySelectorAll('.md\\:grid.md\\:grid-cols-2')
        expect(gridSections[0]).toHaveClass('md:mb-6')
        expect(gridSections[1]).not.toHaveClass('md:mb-6')
    })

    it('renders the first card text section with md:order-2 class', () => {
        render(<HowToWinSection />)

        const heading = screen.getByText('Last Digit of Scores')
        const textSection = heading.closest('.text-center')
        expect(textSection).toHaveClass('md:order-2')
    })

    it('renders the first card image section with md:order-1 class', () => {
        render(<HowToWinSection />)

        const heading = screen.getByText('Last Digit of Scores')
        const card = heading.closest('.md\\:grid')
        const imageSection = card?.querySelector('.w-full.md\\:order-1')
        expect(imageSection).toBeInTheDocument()
    })

    it('renders description paragraphs with correct classes', () => {
        render(<HowToWinSection />)

        const descriptions = screen.getAllByText(/determine|determined/)
        for (const desc of descriptions) {
            expect(desc).toHaveClass('max-w-3/4', 'mx-auto')
        }
    })
})
