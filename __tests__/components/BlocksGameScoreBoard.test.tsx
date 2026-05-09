import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlocksGameScoreBoard from '@/components/BlocksGameScoreBoard'
import type { BlocksGame, SportsGame } from '@/lib/types'

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => (
        <img src={typeof src === 'object' ? '' : src} alt={alt} width={width} height={height} />
    ),
}))

// Mock formatCurrency and getOrdinalSuffix while keeping other exports
vi.mock('@/lib/utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/utils')>()
    return {
        ...actual,
        formatCurrency: (value: string) => `$${parseFloat(value).toFixed(2)}`,
        getOrdinalSuffix: (n: number) => {
            if (n > 3 && n < 21) return 'th'
            switch (n % 10) {
                case 1: return 'st'
                case 2: return 'nd'
                case 3: return 'rd'
                default: return 'th'
            }
        },
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
    blocksGame: baseBlocksGame,
    sportsGame: baseSportsGame,
}

describe('BlocksGameScoreBoard', () => {
    describe('Game header', () => {
        it('renders the away team logo with correct alt text', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            const img = screen.getByAltText('Eagles')
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', '/logos/eagles.png')
        })

        it('renders the home team logo with correct alt text', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            const img = screen.getByAltText('Chiefs')
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', '/logos/chiefs.png')
        })

        it('displays the away team abbreviation', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('PHI')).toBeInTheDocument()
        })

        it('displays the home team abbreviation', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('KC')).toBeInTheDocument()
        })

        it('displays the away team full name', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('Eagles')).toBeInTheDocument()
        })

        it('displays the home team full name', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('Chiefs')).toBeInTheDocument()
        })

        it('displays the away team record', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('(13-4)')).toBeInTheDocument()
        })

        it('displays the home team record', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('(14-3)')).toBeInTheDocument()
        })

        it('renders the "@" separator between teams', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('@')).toBeInTheDocument()
        })
    })

    describe('Sports game scores', () => {
        it('displays both team scores', () => {
            const props = {
                blocksGame: baseBlocksGame,
                sportsGame: { ...baseSportsGame, awayTeamScoreCurrent: 21, homeTeamScoreCurrent: 14 },
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('21')).toBeInTheDocument()
            expect(screen.getByText('14')).toBeInTheDocument()
        })
    })

    describe('Game status', () => {
        it('displays formatted date when status is "pre"', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText(/Feb/)).toBeInTheDocument()
        })

        it('displays quarter and clock when status is not "pre"', () => {
            const props = {
                blocksGame: baseBlocksGame,
                sportsGame: { ...baseSportsGame, status: 'in' as const, gameQuarter: 2, gameClock: '5:30' },
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('2nd Quarter')).toBeInTheDocument()
            expect(screen.getByText('5:30')).toBeInTheDocument()
        })

        it('displays correct ordinal suffix for 1st quarter', () => {
            const props = {
                blocksGame: baseBlocksGame,
                sportsGame: { ...baseSportsGame, status: 'in' as const, gameQuarter: 1, gameClock: '12:00' },
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('1st Quarter')).toBeInTheDocument()
        })

        it('displays correct ordinal suffix for 3rd quarter', () => {
            const props = {
                blocksGame: baseBlocksGame,
                sportsGame: { ...baseSportsGame, status: 'in' as const, gameQuarter: 3, gameClock: '8:00' },
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('3rd Quarter')).toBeInTheDocument()
        })

        it('displays correct ordinal suffix for 4th quarter', () => {
            const props = {
                blocksGame: baseBlocksGame,
                sportsGame: { ...baseSportsGame, status: 'in' as const, gameQuarter: 4, gameClock: '2:00' },
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('4th Quarter')).toBeInTheDocument()
        })
    })

    describe('Blocks game info', () => {
        it('displays blocks available as (100 - blocksSold) / 100', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('75 / 100')).toBeInTheDocument()
        })

        it('displays price per block', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('$5.00')).toBeInTheDocument()
        })

        it('displays prize pool total', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('$500.00')).toBeInTheDocument()
        })

        it('shows 0 blocks available when all are sold', () => {
            const props = {
                blocksGame: { ...baseBlocksGame, blocksSold: 100 },
                sportsGame: baseSportsGame,
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('0 / 100')).toBeInTheDocument()
        })

        it('shows 100 blocks available when none are sold', () => {
            const props = {
                blocksGame: { ...baseBlocksGame, blocksSold: 0 },
                sportsGame: baseSportsGame,
            }
            render(<BlocksGameScoreBoard {...props} />)
            expect(screen.getByText('100 / 100')).toBeInTheDocument()
        })

        it('renders the "Blocks available" label', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('Blocks available:')).toBeInTheDocument()
        })

        it('renders the "Price per block" label', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('Price per block:')).toBeInTheDocument()
        })

        it('renders the "Prize pool" label', () => {
            render(<BlocksGameScoreBoard {...defaultProps} />)
            expect(screen.getByText('Prize pool:')).toBeInTheDocument()
        })
    })
})
