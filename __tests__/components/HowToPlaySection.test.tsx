import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HowToPlaySection from '@/components/how-to-play'

// Mock SpotlightCard to render a simple div with children
vi.mock('@/components/SpotlightCard', () => ({
    default: ({ children, className, spotlightColor }: {
        children: React.ReactNode
        className?: string
        spotlightColor?: string
    }) => (
        <div data-testid="spotlight-card" className={className} data-spotlight-color={spotlightColor}>
            {children}
        </div>
    ),
}))

describe('HowToPlaySection', () => {
    it('renders without crashing', () => {
        render(<HowToPlaySection />)

        expect(screen.getByText('How To Play')).toBeInTheDocument()
    })

    it('renders the section title as an h2', () => {
        render(<HowToPlaySection />)

        const title = screen.getByText('How To Play')
        expect(title.tagName).toBe('H2')
        expect(title).toHaveClass('section-title', 'sm:text-center')
    })

    it('renders a section element with correct classes', () => {
        render(<HowToPlaySection />)

        const section = screen.getByText('How To Play').closest('section')
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('py-6', 'lg:py-8')
    })

    it('renders exactly 4 SpotlightCard components', () => {
        render(<HowToPlaySection />)

        const cards = screen.getAllByTestId('spotlight-card')
        expect(cards).toHaveLength(4)
    })

    it('renders all 4 step headings', () => {
        render(<HowToPlaySection />)

        const headings = screen.getAllByRole('heading', { level: 3 })
        expect(headings).toHaveLength(4)

        expect(headings[0]).toHaveTextContent('Step 1')
        expect(headings[1]).toHaveTextContent('Step 2')
        expect(headings[2]).toHaveTextContent('Step 3')
        expect(headings[3]).toHaveTextContent('Step 4')
    })

    it('renders step number badges with correct classes', () => {
        render(<HowToPlaySection />)

        const badges = screen.getAllByText(/^[1-4]$/)
        expect(badges).toHaveLength(4)

        for (const badge of badges) {
            expect(badge.tagName).toBe('SPAN')
            expect(badge).toHaveClass('px-4', 'py-2', 'bg-primary', 'text-primary-foreground', 'rounded-full')
        }
    })

    it('renders step 1 description', () => {
        render(<HowToPlaySection />)

        expect(screen.getByText(/Choose a game/)).toBeInTheDocument()
        expect(screen.getByText(/NFL, NBA, MLB, or NHL games available/)).toBeInTheDocument()
    })

    it('renders step 2 description', () => {
        render(<HowToPlaySection />)

        expect(screen.getByText(/Buy a block/)).toBeInTheDocument()
    })

    it('renders step 3 description', () => {
        render(<HowToPlaySection />)

        expect(screen.getByText(/Enjoy the game/)).toBeInTheDocument()
    })

    it('renders step 4 description', () => {
        render(<HowToPlaySection />)

        expect(screen.getByText(/Prizes automatically paid out for winning blocks/)).toBeInTheDocument()
    })

    it('renders 4 horizontal rule separators', () => {
        const { container } = render(<HowToPlaySection />)

        const hrs = container.querySelectorAll('hr')
        expect(hrs).toHaveLength(4)

        for (const hr of hrs) {
            expect(hr).toHaveClass('w-full', 'border', 'border-b', 'border-gray-300')
        }
    })

    it('applies custom-spotlight-card class to all SpotlightCard components', () => {
        render(<HowToPlaySection />)

        const cards = screen.getAllByTestId('spotlight-card')
        for (const card of cards) {
            expect(card).toHaveClass('custom-spotlight-card')
        }
    })

    it('passes unique spotlight colors to each card', () => {
        render(<HowToPlaySection />)

        const cards = screen.getAllByTestId('spotlight-card')
        expect(cards[0]).toHaveAttribute('data-spotlight-color', 'rgba(25, 255, 52, 0.25)')
        expect(cards[1]).toHaveAttribute('data-spotlight-color', 'rgba(255, 0, 255, 0.25)')
        expect(cards[2]).toHaveAttribute('data-spotlight-color', 'rgba(25, 25, 255, 0.25)')
        expect(cards[3]).toHaveAttribute('data-spotlight-color', 'rgba(255, 255, 0, 0.25)')
    })

    it('renders step headings with correct styling classes', () => {
        render(<HowToPlaySection />)

        const headings = screen.getAllByRole('heading', { level: 3 })
        for (const heading of headings) {
            expect(heading).toHaveClass('text-xl', 'font-bold')
        }
    })

    it('renders the grid container with correct layout classes', () => {
        const { container } = render(<HowToPlaySection />)

        const grid = container.querySelector('.sm\\:grid')
        expect(grid).toBeInTheDocument()
        expect(grid).toHaveClass('flex', 'flex-col', 'gap-4', 'sm:grid', 'sm:grid-cols-2', 'sm:gap-6', 'lg:grid-cols-4', 'mb-6')
    })
})
