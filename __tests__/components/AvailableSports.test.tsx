import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AvailableSports from '@/components/available-sports'

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}))

// Mock HoverGifCard to render a simple div with sport name
vi.mock('@/components/HoverGifCard', () => ({
    default: ({ sport, image, gif }: { sport: string; image: string; gif: string }) => (
        <div data-testid={`hover-gif-card-${sport.toLowerCase()}`} data-image={image} data-gif={gif}>
            {sport}
        </div>
    ),
}))

// Mock static image imports
vi.mock('@/public/sport-football.png', () => ({ default: { src: '/sport-football.png' } }))
vi.mock('@/public/football-spinner.gif', () => ({ default: { src: '/football-spinner.gif' } }))
vi.mock('@/public/sport-basketball.png', () => ({ default: { src: '/sport-basketball.png' } }))
vi.mock('@/public/basketball-dunk.gif', () => ({ default: { src: '/basketball-dunk.gif' } }))
vi.mock('@/public/sport-baseball.png', () => ({ default: { src: '/sport-baseball.png' } }))
vi.mock('@/public/sandlot-baseball.gif', () => ({ default: { src: '/sandlot-baseball.gif' } }))
vi.mock('@/public/sport-hockey.png', () => ({ default: { src: '/sport-hockey.png' } }))
vi.mock('@/public/snoopy-hockey.gif', () => ({ default: { src: '/snoopy-hockey.gif' } }))

describe('AvailableSports', () => {
    it('renders without crashing', () => {
        render(<AvailableSports />)

        expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('renders exactly four sport items', () => {
        render(<AvailableSports />)

        const items = screen.getAllByRole('listitem')
        expect(items).toHaveLength(4)
    })

    it('renders all four sport names', () => {
        render(<AvailableSports />)

        expect(screen.getByText('Football')).toBeInTheDocument()
        expect(screen.getByText('Basketball')).toBeInTheDocument()
        expect(screen.getByText('Baseball')).toBeInTheDocument()
        expect(screen.getByText('Hockey')).toBeInTheDocument()
    })

    it('renders correct links for each sport', () => {
        render(<AvailableSports />)

        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(4)

        expect(links[0]).toHaveAttribute('href', '/sports/nfl')
        expect(links[1]).toHaveAttribute('href', '/sports/nba')
        expect(links[2]).toHaveAttribute('href', '/sports/mlb')
        expect(links[3]).toHaveAttribute('href', '/sports/nhl')
    })

    it('passes correct image and gif props to Football HoverGifCard', () => {
        render(<AvailableSports />)

        const card = screen.getByTestId('hover-gif-card-football')
        expect(card).toHaveAttribute('data-image', '/sport-football.png')
        expect(card).toHaveAttribute('data-gif', '/football-spinner.gif')
    })

    it('passes correct image and gif props to Basketball HoverGifCard', () => {
        render(<AvailableSports />)

        const card = screen.getByTestId('hover-gif-card-basketball')
        expect(card).toHaveAttribute('data-image', '/sport-basketball.png')
        expect(card).toHaveAttribute('data-gif', '/basketball-dunk.gif')
    })

    it('passes correct image and gif props to Baseball HoverGifCard', () => {
        render(<AvailableSports />)

        const card = screen.getByTestId('hover-gif-card-baseball')
        expect(card).toHaveAttribute('data-image', '/sport-baseball.png')
        expect(card).toHaveAttribute('data-gif', '/sandlot-baseball.gif')
    })

    it('passes correct image and gif props to Hockey HoverGifCard', () => {
        render(<AvailableSports />)

        const card = screen.getByTestId('hover-gif-card-hockey')
        expect(card).toHaveAttribute('data-image', '/sport-hockey.png')
        expect(card).toHaveAttribute('data-gif', '/snoopy-hockey.gif')
    })

    it('renders the list with correct CSS classes', () => {
        render(<AvailableSports />)

        const list = screen.getByRole('list')
        expect(list).toHaveClass('flex', 'flex-col', 'gap-4', 'items-center')
    })

    it('renders Football link with responsive justify classes', () => {
        render(<AvailableSports />)

        const footballLink = screen.getAllByRole('link')[0]
        expect(footballLink).toHaveClass('sm:flex', 'sm:justify-end', 'lg:justify-start')
    })

    it('renders Baseball link with responsive justify classes', () => {
        render(<AvailableSports />)

        const baseballLink = screen.getAllByRole('link')[2]
        expect(baseballLink).toHaveClass('sm:flex', 'sm:justify-end', 'lg:justify-start')
    })
})
