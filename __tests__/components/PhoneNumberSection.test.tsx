import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneNumberSection } from '@/components/profile/PhoneNumberSection'

// Mock the server action
const mockUpdateUserPhoneNumber = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserPhoneNumber: (...args: unknown[]) => mockUpdateUserPhoneNumber(...args),
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

describe('PhoneNumberSection', () => {
    const mockOnSaved = vi.fn().mockResolvedValue(undefined)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the phone number label and current phone number', () => {
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        expect(screen.getByText('Phone Number:')).toBeInTheDocument()
        expect(screen.getByText('1234567890')).toBeInTheDocument()
    })

    it('renders with null phone number', () => {
        render(<PhoneNumberSection phoneNumber={null} onSaved={mockOnSaved} />)

        expect(screen.getByText('Phone Number:')).toBeInTheDocument()
    })

    it('renders with undefined phone number', () => {
        render(<PhoneNumberSection phoneNumber={undefined} onSaved={mockOnSaved} />)

        expect(screen.getByText('Phone Number:')).toBeInTheDocument()
    })

    it('renders the edit button', () => {
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        expect(screen.getByRole('button', { name: /edit phone number/i })).toBeInTheDocument()
    })

    it('shows the phone input when edit button is clicked', async () => {
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))

        expect(screen.getByPlaceholderText('New phone number')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('does not call updateUserPhoneNumber when input is empty', async () => {
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockUpdateUserPhoneNumber).not.toHaveBeenCalled()
    })

    it('shows error toast when phone number has less than 10 digits', async () => {
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.type(screen.getByPlaceholderText('New phone number'), '12345')
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockToastError).toHaveBeenCalledWith('Phone number must contain at least 10 digits')
        expect(mockUpdateUserPhoneNumber).not.toHaveBeenCalled()
    })

    it('calls updateUserPhoneNumber and shows success toast on successful save', async () => {
        mockUpdateUserPhoneNumber.mockResolvedValue({ success: true, message: 'Phone number updated successfully' })
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.type(screen.getByPlaceholderText('New phone number'), '9876543210')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserPhoneNumber).toHaveBeenCalledWith('9876543210')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Phone number updated successfully')
        expect(mockOnSaved).toHaveBeenCalled()
    })

    it('shows error toast when updateUserPhoneNumber returns failure', async () => {
        mockUpdateUserPhoneNumber.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.type(screen.getByPlaceholderText('New phone number'), '9876543210')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
        expect(mockOnSaved).not.toHaveBeenCalled()
    })

    it('shows generic error toast when updateUserPhoneNumber throws', async () => {
        mockUpdateUserPhoneNumber.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.type(screen.getByPlaceholderText('New phone number'), '9876543210')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating phone number')
        })
    })

    it('hides the edit section when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))

        const editContainer = screen.getByPlaceholderText('New phone number').closest('div[class]')
        expect(editContainer).not.toHaveClass('hidden')

        await user.click(screen.getByRole('button', { name: /cancel/i }))

        expect(editContainer).toHaveClass('hidden')
    })

    it('hides the edit section after successful save', async () => {
        mockUpdateUserPhoneNumber.mockResolvedValue({ success: true, message: 'Phone number updated successfully' })
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        const editContainer = screen.getByPlaceholderText('New phone number').closest('div[class]')

        await user.type(screen.getByPlaceholderText('New phone number'), '9876543210')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(editContainer).toHaveClass('hidden')
        })
    })

    it('accepts phone numbers with formatting characters', async () => {
        mockUpdateUserPhoneNumber.mockResolvedValue({ success: true, message: 'Phone number updated successfully' })
        const user = userEvent.setup()
        render(<PhoneNumberSection phoneNumber="1234567890" onSaved={mockOnSaved} />)

        await user.click(screen.getByRole('button', { name: /edit phone number/i }))
        await user.type(screen.getByPlaceholderText('New phone number'), '(123) 456-7890')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserPhoneNumber).toHaveBeenCalledWith('(123) 456-7890')
        })
    })
})
