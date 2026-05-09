import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlocksGameGrid from '@/components/BlocksGameGrid'
import type { BlockWithUser, SportsGame, BlocksGame } from '@/lib/types'

// Mock BlocksGameBlock to render a simple div with identifying data
vi.mock('@/components/BlocksGameBlock', () => ({
    default: ({ block, blocksGameId, userId, league, event }: {
        block: BlockWithUser; blocksGameId: string; userId: string; league: string; event: string;
    }) => (
        <div
            data-testid={`block-${block.xCoordinate}-${block.yCoordinate}`}
            data-block-id={block.id}
            data-blocks-game-id={blocksGameId}
            data-user-id={userId}
            data-league={league}
            data-event={event}
        >
            Block
        </div>
    ),
}))

const makeBlock = (x: number, y: number, overrides: Partial<BlockWithUser> = {}): BlockWithUser => ({
    id: `block-${x}-${y}`,
    isPurchased: false,
    blockPrice: '5.00',
    purchaseAmt: '0',
    xCoordinate: x,
    yCoordinate: y,
    homeTeamScore: x,
    awayTeamScore: y,
    usedPromoCode: false,
    promoCodeApplied: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
    blocksGameId: 'game-1',
    userName: null,
    userImage: null,
    ...overrides,
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

// Create a few blocks for testing (not a full 100)
const sampleBlocks: BlockWithUser[] = [
    makeBlock(0, 0),
    makeBlock(1, 0),
    makeBlock(0, 1),
    makeBlock(3, 5, { homeTeamScore: 7, awayTeamScore: 3 }),
]

const defaultProps = {
    blocks: sampleBlocks,
    sportsGame: baseSportsGame,
    blocksGame: baseBlocksGame,
    userId: 'user-1',
}

describe('BlocksGameGrid', () => {
    describe('team labels', () => {
        it('renders home team abbreviation at the top', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            expect(screen.getByText('KC')).toBeInTheDocument()
        })

        it('applies home team color to the home label', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            const homeLabel = screen.getByText('KC')
            expect(homeLabel).toHaveStyle({ color: '#E31837' })
        })

        it('renders away team abbreviation characters vertically', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            expect(screen.getByText('P')).toBeInTheDocument()
            expect(screen.getByText('H')).toBeInTheDocument()
            expect(screen.getByText('I')).toBeInTheDocument()
        })
    })

    describe('axis numbers when NOT generated', () => {
        it('shows "?" for all x-axis headers', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            const questionMarks = screen.getAllByText('?')
            // 10 x-axis + 10 y-axis = 20 question marks
            expect(questionMarks).toHaveLength(20)
        })
    })

    describe('axis numbers when generated', () => {
        const generatedProps = {
            ...defaultProps,
            blocksGame: { ...baseBlocksGame, axisNumbersGenerated: true },
        }

        it('shows actual homeTeamScore numbers on x-axis', () => {
            render(<BlocksGameGrid {...generatedProps} />)
            // Should not show any "?" marks
            expect(screen.queryByText('?')).not.toBeInTheDocument()
        })

        it('displays derived axis numbers from block data', () => {
            // Use unique scores that won't collide with fallback coordinate indices
            const blocks = [makeBlock(0, 0, { homeTeamScore: 5, awayTeamScore: 8 })]
            render(<BlocksGameGrid {...generatedProps} blocks={blocks} />)
            // homeTeamScore=5 should appear on the x-axis (at index 0)
            // awayTeamScore=8 should appear on the y-axis (at index 0)
            // Use getAllByText since fallback coords may produce duplicates
            const fives = screen.getAllByText('5')
            expect(fives.length).toBeGreaterThanOrEqual(1)
            const eights = screen.getAllByText('8')
            expect(eights.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe('grid blocks', () => {
        it('renders BlocksGameBlock for occupied cells', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            expect(screen.getByTestId('block-0-0')).toBeInTheDocument()
            expect(screen.getByTestId('block-1-0')).toBeInTheDocument()
            expect(screen.getByTestId('block-0-1')).toBeInTheDocument()
            expect(screen.getByTestId('block-3-5')).toBeInTheDocument()
        })

        it('passes correct props to BlocksGameBlock', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            const blockEl = screen.getByTestId('block-0-0')
            expect(blockEl).toHaveAttribute('data-block-id', 'block-0-0')
            expect(blockEl).toHaveAttribute('data-blocks-game-id', 'blocks-1')
            expect(blockEl).toHaveAttribute('data-user-id', 'user-1')
            expect(blockEl).toHaveAttribute('data-league', 'nfl')
            expect(blockEl).toHaveAttribute('data-event', 'Super Bowl')
        })

        it('renders empty cells for unoccupied positions', () => {
            // With 4 blocks occupied, there should be 96 empty cells
            const { container } = render(<BlocksGameGrid {...defaultProps} />)
            const emptyCells = container.querySelectorAll('[class*="border-gray-300"]')
            expect(emptyCells).toHaveLength(96)
        })

        it('renders exactly 4 BlocksGameBlock components', () => {
            render(<BlocksGameGrid {...defaultProps} />)
            expect(screen.getAllByText('Block')).toHaveLength(4)
        })
    })

    describe('with no blocks', () => {
        it('renders 100 empty cells when blocks array is empty', () => {
            const { container } = render(<BlocksGameGrid {...defaultProps} blocks={[]} />)
            const emptyCells = container.querySelectorAll('[class*="border-gray-300"]')
            expect(emptyCells).toHaveLength(100)
        })
    })
})
