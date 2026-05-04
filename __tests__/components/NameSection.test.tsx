import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NameSection } from '@/components/profile/NameSection'

// Mock the server action
const mockUpdateUserName = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserName: (...args: unknown[]) => mockUpdateUserName(...args),
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

describe('NameSection', () => {
    const mockOnSaved = vi.fn().mockResolvedValue(undefined)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the name label and current name', () => {
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        expect(screen.getByText('Name:')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('renders with null name', () => {
        render(<NameSection name={null} onSaved={mockOnSaved} />)

        expect(screen.getByText('Name:')).toBeInTheDocument()
    })

    it('renders with undefined name', () => {
        render(<NameSection name={undefined} onSaved={mockOnSaved} />)

        expect(screen.getByText('Name:')).toBeInTheDocument()
    })

    it('renders the edit button', () => {
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        expect(screen.getByRole('button', { name: /edit name/i })).toBeInTheDocument()
    })

    it('shows the name input when edit button is clicked', async () => {
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))

        expect(screen.getByPlaceholderText('New name')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('does not call updateUserName when input is empty', async () => {
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockUpdateUserName).not.toHaveBeenCalled()
    })

    it('shows error toast when name is less than 2 characters', async () => {
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        await user.type(screen.getByPlaceholderText('New name'), 'A')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockToastError).toHaveBeenCalledWith('Name must be at least 2 characters')
        expect(mockUpdateUserName).not.toHaveBeenCalled()
    })

    it('calls updateUserName and shows success toast on successful save', async () => {
        mockUpdateUserName.mockResolvedValue({ success: true, message: 'Name updated successfully' })
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        await user.type(screen.getByPlaceholderText('New name'), 'Jane Doe')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserName).toHaveBeenCalledWith('Jane Doe')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Name updated successfully')
        expect(mockOnSaved).toHaveBeenCalled()
    })

    it('shows error toast when updateUserName returns failure', async () => {
        mockUpdateUserName.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        await user.type(screen.getByPlaceholderText('New name'), 'Jane Doe')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
        expect(mockOnSaved).not.toHaveBeenCalled()
    })

    it('shows generic error toast when updateUserName throws', async () => {
        mockUpdateUserName.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        await user.type(screen.getByPlaceholderText('New name'), 'Jane Doe')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating name')
        })
    })

    it('hides the edit section when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))

        const editContainer = screen.getByPlaceholderText('New name').closest('div[class]')
        expect(editContainer).not.toHaveClass('hidden')

        await user.click(screen.getByRole('button', { name: /cancel/i }))

        expect(editContainer).toHaveClass('hidden')
    })

    it('hides the edit section after successful save', async () => {
        mockUpdateUserName.mockResolvedValue({ success: true, message: 'Name updated successfully' })
        const user = userEvent.setup()
        render(<NameSection name="John Doe" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit name/i }))
        const editContainer = screen.getByPlaceholderText('New name').closest('div[class]')

        await user.type(screen.getByPlaceholderText('New name'), 'Jane Doe')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(editContainer).toHaveClass('hidden')
        })
    })
})
