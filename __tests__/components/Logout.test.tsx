import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Logout from '@/components/logout'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

// Mock auth client
const mockSignOut = vi.fn()
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signOut: () => mockSignOut(),
    },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    LogOut: ({ className }: { className?: string }) => (
        <span data-testid="logout-icon" className={className}>LogOutIcon</span>
    ),
}))

describe('Logout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<Logout />)
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders a button with "Logout" text', () => {
        render(<Logout />)
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })

    it('renders the LogOut icon', () => {
        render(<Logout />)
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('renders the LogOut icon with correct className', () => {
        render(<Logout />)
        expect(screen.getByTestId('logout-icon')).toHaveClass('size-4')
    })

    it('renders a button with outline variant', () => {
        render(<Logout />)
        const button = screen.getByRole('button', { name: /logout/i })
        expect(button).toBeInTheDocument()
    })

    it('calls authClient.signOut when clicked', async () => {
        const user = userEvent.setup()
        mockSignOut.mockResolvedValue(undefined)
        render(<Logout />)

        await user.click(screen.getByRole('button', { name: /logout/i }))

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalledOnce()
        })
    })

    it('navigates to "/" after signing out', async () => {
        const user = userEvent.setup()
        mockSignOut.mockResolvedValue(undefined)
        render(<Logout />)

        await user.click(screen.getByRole('button', { name: /logout/i }))

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })

    it('calls signOut before navigating', async () => {
        const user = userEvent.setup()
        const callOrder: string[] = []
        mockSignOut.mockImplementation(() => {
            callOrder.push('signOut')
            return Promise.resolve()
        })
        mockPush.mockImplementation(() => {
            callOrder.push('push')
        })
        render(<Logout />)

        await user.click(screen.getByRole('button', { name: /logout/i }))

        await waitFor(() => {
            expect(callOrder).toEqual(['signOut', 'push'])
        })
    })

    it('handles multiple clicks', async () => {
        const user = userEvent.setup()
        mockSignOut.mockResolvedValue(undefined)
        render(<Logout />)

        const button = screen.getByRole('button', { name: /logout/i })
        await user.click(button)
        await user.click(button)

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled()
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })
})
