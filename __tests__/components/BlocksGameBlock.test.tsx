import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlocksGameBlock from '@/components/BlocksGameBlock'
import type { BlockWithUser } from '@/lib/types'

// Mock the Avatar component
vi.mock('@/components/ui/avatar', () => ({
    Avatar: ({ src, name, className }: { src?: string | null; name?: string | null; className?: string }) => (
        <div data-testid="avatar" data-src={src ?? ''} data-name={name ?? ''} className={className}>
            {name ?? '?'}
        </div>
    ),
}))

// Mock the BlocksGameBlockModal component
vi.mock('@/components/BlocksGameBlockModal', () => ({
    default: ({ isOpen, onClose, blockId, blocksGameId, blockPrice, userId, league, event }: {
        isOpen: boolean; onClose: () => void; blockId: string; blocksGameId: string;
        blockPrice: string; userId: string; league: string; event: string;
    }) => isOpen ? (
        <div data-testid="modal" data-block-id={blockId} data-blocks-game-id={blocksGameId}
            data-block-price={blockPrice} data-user-id={userId} data-league={league} data-event={event}>
            <button onClick={onClose}>Close Modal</button>
        </div>
    ) : null,
}))

const baseBlock: BlockWithUser = {
    id: 'block-1',
    isPurchased: false,
    blockPrice: '5.00',
    purchaseAmt: '0',
    xCoordinate: 0,
    yCoordinate: 0,
    homeTeamScore: 0,
    awayTeamScore: 0,
    usedPromoCode: false,
    promoCodeApplied: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
    blocksGameId: 'game-1',
    userName: null,
    userImage: null,
}

const defaultProps = {
    block: baseBlock,
    blocksGameId: 'game-1',
    userId: 'user-1',
    league: 'nfl',
    event: 'Super Bowl',
}

describe('BlocksGameBlock', () => {
    describe('when block is NOT purchased', () => {
        it('renders "Buy" text', () => {
            render(<BlocksGameBlock {...defaultProps} />)
            expect(screen.getByText('Buy')).toBeInTheDocument()
        })

        it('displays block price in title attribute', () => {
            render(<BlocksGameBlock {...defaultProps} />)
            expect(screen.getByTitle('$5.00')).toBeInTheDocument()
        })

        it('does not render Avatar', () => {
            render(<BlocksGameBlock {...defaultProps} />)
            expect(screen.queryByTestId('avatar')).not.toBeInTheDocument()
        })

        it('does not render modal initially', () => {
            render(<BlocksGameBlock {...defaultProps} />)
            expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
        })

        it('opens modal when clicked', async () => {
            const user = userEvent.setup()
            render(<BlocksGameBlock {...defaultProps} />)

            await user.click(screen.getByText('Buy'))

            expect(screen.getByTestId('modal')).toBeInTheDocument()
        })

        it('passes correct props to modal', async () => {
            const user = userEvent.setup()
            render(<BlocksGameBlock {...defaultProps} />)

            await user.click(screen.getByText('Buy'))

            const modal = screen.getByTestId('modal')
            expect(modal).toHaveAttribute('data-block-id', 'block-1')
            expect(modal).toHaveAttribute('data-blocks-game-id', 'game-1')
            expect(modal).toHaveAttribute('data-block-price', '5.00')
            expect(modal).toHaveAttribute('data-user-id', 'user-1')
            expect(modal).toHaveAttribute('data-league', 'nfl')
            expect(modal).toHaveAttribute('data-event', 'Super Bowl')
        })

        it('closes modal when onClose is called', async () => {
            const user = userEvent.setup()
            render(<BlocksGameBlock {...defaultProps} />)

            await user.click(screen.getByText('Buy'))
            expect(screen.getByTestId('modal')).toBeInTheDocument()

            await user.click(screen.getByText('Close Modal'))
            expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
        })

        it('has cursor-pointer class', () => {
            render(<BlocksGameBlock {...defaultProps} />)
            expect(screen.getByText('Buy')).toHaveClass('cursor-pointer')
        })
    })

    describe('when block IS purchased', () => {
        const purchasedBlock: BlockWithUser = {
            ...baseBlock,
            isPurchased: true,
            userName: 'John Doe',
            userImage: '/avatars/john.svg',
            userId: 'user-2',
        }

        const purchasedProps = { ...defaultProps, block: purchasedBlock }

        it('renders Avatar component', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            expect(screen.getByTestId('avatar')).toBeInTheDocument()
        })

        it('passes correct props to Avatar', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            const avatar = screen.getByTestId('avatar')
            expect(avatar).toHaveAttribute('data-src', '/avatars/john.svg')
            expect(avatar).toHaveAttribute('data-name', 'John Doe')
        })

        it('does not render "Buy" text', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            expect(screen.queryByText('Buy')).not.toBeInTheDocument()
        })

        it('displays purchased-by title', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            expect(screen.getByTitle('Purchased by John Doe')).toBeInTheDocument()
        })

        it('shows "Unknown" when userName is null', () => {
            const noNameBlock = { ...purchasedBlock, userName: null }
            render(<BlocksGameBlock {...defaultProps} block={noNameBlock} />)
            expect(screen.getByTitle('Purchased by Unknown')).toBeInTheDocument()
        })

        it('does not render modal', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
        })

        it('does not have cursor-pointer class', () => {
            render(<BlocksGameBlock {...purchasedProps} />)
            const block = screen.getByTitle('Purchased by John Doe')
            expect(block).not.toHaveClass('cursor-pointer')
        })
    })
})
