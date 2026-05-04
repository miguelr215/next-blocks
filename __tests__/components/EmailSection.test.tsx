import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailSection } from '@/components/profile/EmailSection'

// Mock the server action
const mockUpdateUserEmail = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserEmail: (...args: unknown[]) => mockUpdateUserEmail(...args),
}))

// Mock sonner toast
const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => mockToastSuccess(...args),
        error: (...args: unknown[]) => mockToastError(...args),
    },
}))

// Mock radix-ui tooltip to avoid Portal rendering issues in jsdom
vi.mock('@/components/ui/tooltip', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipContent: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('EmailSection', () => {
    const mockOnSaved = vi.fn().mockResolvedValue(undefined)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the email label and current email', () => {
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        expect(screen.getByText('Email:')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('renders with null email', () => {
        render(<EmailSection email={null} onSaved={mockOnSaved} />)

        expect(screen.getByText('Email:')).toBeInTheDocument()
    })

    it('renders with undefined email', () => {
        render(<EmailSection email={undefined} onSaved={mockOnSaved} />)

        expect(screen.getByText('Email:')).toBeInTheDocument()
    })

    it('renders the edit button', () => {
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        expect(screen.getByRole('button', { name: /edit email/i })).toBeInTheDocument()
    })

    it('shows the email input when edit button is clicked', async () => {
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))

        expect(screen.getByPlaceholderText('New email')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('does not call updateUserEmail when input is empty', async () => {
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockUpdateUserEmail).not.toHaveBeenCalled()
    })

    it('shows error toast for invalid email format', async () => {
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        await user.type(screen.getByPlaceholderText('New email'), 'invalid-email')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockToastError).toHaveBeenCalledWith('Please enter a valid email address')
        expect(mockUpdateUserEmail).not.toHaveBeenCalled()
    })

    it('calls updateUserEmail and shows success toast on successful save', async () => {
        mockUpdateUserEmail.mockResolvedValue({ success: true, message: 'Email updated successfully' })
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        await user.type(screen.getByPlaceholderText('New email'), 'new@example.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserEmail).toHaveBeenCalledWith('new@example.com')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Email updated successfully')
        expect(mockOnSaved).toHaveBeenCalled()
    })

    it('shows error toast when updateUserEmail returns failure', async () => {
        mockUpdateUserEmail.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        await user.type(screen.getByPlaceholderText('New email'), 'new@example.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
        expect(mockOnSaved).not.toHaveBeenCalled()
    })

    it('shows generic error toast when updateUserEmail throws', async () => {
        mockUpdateUserEmail.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        await user.type(screen.getByPlaceholderText('New email'), 'new@example.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating email')
        })
    })

    it('hides the edit section when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))

        const editContainer = screen.getByPlaceholderText('New email').closest('div[class]')
        expect(editContainer).not.toHaveClass('hidden')

        await user.click(screen.getByRole('button', { name: /cancel/i }))

        expect(editContainer).toHaveClass('hidden')
    })

    it('hides the edit section after successful save', async () => {
        mockUpdateUserEmail.mockResolvedValue({ success: true, message: 'Email updated successfully' })
        const user = userEvent.setup()
        render(<EmailSection email="test@example.com" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit email/i }))
        const editContainer = screen.getByPlaceholderText('New email').closest('div[class]')

        await user.type(screen.getByPlaceholderText('New email'), 'new@example.com')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(editContainer).toHaveClass('hidden')
        })
    })
})
