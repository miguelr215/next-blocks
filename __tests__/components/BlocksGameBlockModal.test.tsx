import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlocksGameBlockModal from '@/components/BlocksGameBlockModal'

// Mock next/navigation
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}))

// Mock server action
const mockAddUserIdToBlock = vi.fn()
vi.mock('@/server/blocks', () => ({
    addUserIdToBlock: (...args: unknown[]) => mockAddUserIdToBlock(...args),
}))

// Mock Dialog to render children directly when open, avoiding Radix portal issues
vi.mock('@/components/ui/dialog', () => ({
    Dialog: ({ open, children, onOpenChange }: { open: boolean; children: React.ReactNode; onOpenChange?: (open: boolean) => void }) =>
        open ? <div data-testid="dialog" data-on-open-change={!!onOpenChange}>{children}</div> : null,
    DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
    DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock Button to render a plain button
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button {...props}>{children}</button>
    ),
}))

const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    blockId: 'block-1',
    blocksGameId: 'game-1',
    blockPrice: '10.00',
    userId: 'user-1',
    league: 'nfl',
    event: 'Super Bowl',
}

describe('BlocksGameBlockModal', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders nothing when isOpen is false', () => {
        render(<BlocksGameBlockModal {...defaultProps} isOpen={false} />)
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })

    it('renders dialog when isOpen is true', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })

    it('renders the title "Purchase Block"', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Purchase Block')).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Review the block details below and confirm your purchase.')).toBeInTheDocument()
    })

    it('displays the Game ID', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Game ID')).toBeInTheDocument()
        expect(screen.getByText('game-1')).toBeInTheDocument()
    })

    it('displays the league in uppercase', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('League')).toBeInTheDocument()
        expect(screen.getByText('NFL')).toBeInTheDocument()
    })

    it('displays the event name', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Event')).toBeInTheDocument()
        expect(screen.getByText('Super Bowl')).toBeInTheDocument()
    })

    it('displays the block price with dollar sign', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Block Price')).toBeInTheDocument()
        expect(screen.getByText('$10.00')).toBeInTheDocument()
    })

    it('renders Cancel button', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('renders Purchase button with price', () => {
        render(<BlocksGameBlockModal {...defaultProps} />)
        expect(screen.getByText('Purchase — $10.00')).toBeInTheDocument()
    })

    it('calls onClose when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} />)

        await user.click(screen.getByText('Cancel'))
        expect(defaultProps.onClose).toHaveBeenCalledOnce()
    })

    it('calls addUserIdToBlock with correct args on purchase', async () => {
        mockAddUserIdToBlock.mockResolvedValue({ success: true })
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} />)

        await user.click(screen.getByText('Purchase — $10.00'))

        await waitFor(() => {
            expect(mockAddUserIdToBlock).toHaveBeenCalledWith('block-1', '10.00', 'user-1', 'game-1')
        })
    })

    it('calls router.refresh and onClose on successful purchase', async () => {
        mockAddUserIdToBlock.mockResolvedValue({ success: true })
        const onClose = vi.fn()
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} onClose={onClose} />)

        await user.click(screen.getByText('Purchase — $10.00'))

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalledOnce()
            expect(onClose).toHaveBeenCalledOnce()
        })
    })

    it('displays error message when purchase fails with result.success false', async () => {
        mockAddUserIdToBlock.mockResolvedValue({ success: false, message: 'Insufficient funds' })
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} />)

        await user.click(screen.getByText('Purchase — $10.00'))

        await waitFor(() => {
            expect(screen.getByText('Insufficient funds')).toBeInTheDocument()
        })
        expect(mockRefresh).not.toHaveBeenCalled()
    })

    it('displays error message when purchase throws an Error', async () => {
        mockAddUserIdToBlock.mockRejectedValue(new Error('Network failure'))
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} />)

        await user.click(screen.getByText('Purchase — $10.00'))

        await waitFor(() => {
            expect(screen.getByText('Network failure')).toBeInTheDocument()
        })
    })

    it('displays generic error message when purchase throws a non-Error', async () => {
        mockAddUserIdToBlock.mockRejectedValue('something went wrong')
        const user = userEvent.setup()
        render(<BlocksGameBlockModal {...defaultProps} />)

        await user.click(screen.getByText('Purchase — $10.00'))

        await waitFor(() => {
            expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
        })
    })
})
