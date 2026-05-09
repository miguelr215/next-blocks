import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlocksGameCard from '@/components/BlocksGameCard'
import type { BlocksGame, SportsGame } from '@/lib/types'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => (
        <img src={typeof src === 'object' ? '' : src} alt={alt} width={width} height={height} />
    ),
}))

// Mock the vs image import
vi.mock('@/public/vs.png', () => ({ default: '/vs.png' }))

// Mock formatCurrency while keeping other exports (like cn used by Button)
vi.mock('@/lib/utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/utils')>()
    return {
        ...actual,
        formatCurrency: (value: string) => `$${parseFloat(value).toFixed(2)}`,
    }
})

const baseSportsGame: SportsGame = {
    id: 'sports-1',
    externalGameId: 'ext-1',
    sport: 'football',
    league: 'nfl',
    name: 'Super Bowl',
    homeTeamName: 'Chiefs',
    homeTeamAbbr: 'KC',
    homeTeamRecord: '14-3',
    homeTeamColor: 'E31837',
    homeTeamLogo: '/logos/chiefs.png',
    homeTeamScoreCurrent: 0,
    homeTeamScoreQ1: 0,
    homeTeamScoreQ2: 0,
    homeTeamScoreQ3: 0,
    homeTeamScoreQ4: 0,
    awayTeamName: 'Eagles',
    awayTeamAbbr: 'PHI',
    awayTeamRecord: '13-4',
    awayTeamColor: '004C54',
    awayTeamLogo: '/logos/eagles.png',
    awayTeamScoreCurrent: 0,
    awayTeamScoreQ1: 0,
    awayTeamScoreQ2: 0,
    awayTeamScoreQ3: 0,
    awayTeamScoreQ4: 0,
    status: 'pre',
    gameDate: '2026-02-08T18:30:00Z',
    gameQuarter: 0,
    gameClock: '15:00',
    createdAt: new Date(),
    updatedAt: new Date(),
}

const baseBlocksGame: BlocksGame = {
    id: 'blocks-1',
    isActive: true,
    isPrivate: false,
    createdBy: 'user-1',
    pricePerBlock: '5.00',
    blocksSold: 25,
    prizeTotal: '500.00',
    allowsTouches: false,
    prizeQ1: '100.00',
    prizePerTouchQ1: '0',
    prizeQ2: '100.00',
    prizePerTouchQ2: '0',
    prizeQ3: '100.00',
    prizePerTouchQ3: '0',
    prizeQ4: '200.00',
    prizePerTouchQ4: '0',
    axisNumbersGenerated: false,
    sportsGameId: 'sports-1',
    createdAt: new Date(),
    updatedAt: new Date(),
}

const defaultProps = {
    game: {
        blocksGame: baseBlocksGame,
        sportsGame: baseSportsGame,
    },
}

describe('BlocksGameCard', () => {
    it('renders the away team name and record', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('Eagles')).toBeInTheDocument()
        expect(screen.getByText('(13-4)')).toBeInTheDocument()
    })

    it('renders the home team name and record', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('Chiefs')).toBeInTheDocument()
        expect(screen.getByText('(14-3)')).toBeInTheDocument()
    })

    it('renders team logos with correct alt text', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByAltText('Eagles')).toBeInTheDocument()
        expect(screen.getByAltText('Chiefs')).toBeInTheDocument()
    })

    it('renders the vs image', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByAltText('vs')).toBeInTheDocument()
    })

    it('displays the sports game ID', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText(/ID: sports-1/)).toBeInTheDocument()
    })

    it('displays blocks available as (100 - blocksSold) / 100', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('75 / 100')).toBeInTheDocument()
    })

    it('displays the price per block', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('$5.00 / block')).toBeInTheDocument()
    })

    it('displays the prize pool', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('$500.00')).toBeInTheDocument()
    })

    it('renders the "Play Now" button', () => {
        render(<BlocksGameCard {...defaultProps} />)
        expect(screen.getByText('Play Now')).toBeInTheDocument()
    })

    it('links to the correct game page', () => {
        render(<BlocksGameCard {...defaultProps} />)
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/sports/nfl/blocks-1')
    })

    it('renders the game date', () => {
        render(<BlocksGameCard {...defaultProps} />)
        // The date is formatted via toLocaleDateString; just check it renders something
        const dateElement = screen.getByText(/Feb/)
        expect(dateElement).toBeInTheDocument()
    })

    it('applies team colors as background', () => {
        const { container } = render(<BlocksGameCard {...defaultProps} />)
        const awayDiv = container.querySelector('[style*="background-color: rgb(0, 76, 84)"]') ??
            container.querySelector('[style*="#004C54"]')
        const homeDiv = container.querySelector('[style*="background-color: rgb(227, 24, 55)"]') ??
            container.querySelector('[style*="#E31837"]')
        expect(awayDiv).toBeTruthy()
        expect(homeDiv).toBeTruthy()
    })

    it('shows correct blocks available when all blocks are sold', () => {
        const allSoldGame = {
            game: {
                blocksGame: { ...baseBlocksGame, blocksSold: 100 },
                sportsGame: baseSportsGame,
            },
        }
        render(<BlocksGameCard {...allSoldGame} />)
        expect(screen.getByText('0 / 100')).toBeInTheDocument()
    })

    it('shows correct blocks available when no blocks are sold', () => {
        const noSoldGame = {
            game: {
                blocksGame: { ...baseBlocksGame, blocksSold: 0 },
                sportsGame: baseSportsGame,
            },
        }
        render(<BlocksGameCard {...noSoldGame} />)
        expect(screen.getByText('100 / 100')).toBeInTheDocument()
    })
})
