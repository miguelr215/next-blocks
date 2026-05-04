import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BackgroundColorSection } from '@/components/profile/BackgroundColorSection'

// Mock the server action
const mockUpdateUserBgColor = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserBgColor: (...args: unknown[]) => mockUpdateUserBgColor(...args),
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

const defaultProps = {
    bgColor: 'bg-primary',
    onSaved: vi.fn().mockResolvedValue(undefined),
}

describe('BackgroundColorSection', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        defaultProps.onSaved = vi.fn().mockResolvedValue(undefined)
    })

    it('renders the label and current background color', () => {
        render(<BackgroundColorSection {...defaultProps} />)

        expect(screen.getByText('Background Color:')).toBeInTheDocument()
        expect(screen.getByText('bg-primary')).toBeInTheDocument()
        expect(screen.getByText('*only active with background image disabled')).toBeInTheDocument()
    })

    it('renders with null bgColor without crashing', () => {
        render(<BackgroundColorSection bgColor={null} onSaved={defaultProps.onSaved} />)

        expect(screen.getByText('Background Color:')).toBeInTheDocument()
    })

    it('renders with undefined bgColor without crashing', () => {
        render(<BackgroundColorSection bgColor={undefined} onSaved={defaultProps.onSaved} />)

        expect(screen.getByText('Background Color:')).toBeInTheDocument()
    })

    it('shows the edit background color button', () => {
        render(<BackgroundColorSection {...defaultProps} />)

        expect(screen.getByRole('button', { name: /edit background color/i })).toBeInTheDocument()
    })

    it('shows the color dropdown when edit button is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // After clicking edit, the dropdown button shows 'bg-primary' (along with the <p> tag)
        const bgPrimaryElements = screen.getAllByText('bg-primary')
        expect(bgPrimaryElements.length).toBeGreaterThanOrEqual(2)
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('opens the color list when the dropdown button is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // Find the dropdown toggle button (the one with type="button" and min-w-40 class)
        const dropdownButton = screen.getAllByText('bg-primary')
            .map(el => el.closest('button[type="button"]'))
            .find(btn => btn?.classList.contains('min-w-40'))!
        await user.click(dropdownButton)

        // Color options should now be visible in the list
        expect(screen.getByText('bg-red-500')).toBeInTheDocument()
        expect(screen.getByText('bg-blue-500')).toBeInTheDocument()
    })

    it('selects a color from the dropdown list', async () => {
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // Open dropdown
        const dropdownButton = screen.getAllByText('bg-primary')
            .map(el => el.closest('button[type="button"]'))
            .find(btn => btn?.classList.contains('min-w-40'))!
        await user.click(dropdownButton)

        // Select a color
        const colorOptions = screen.getAllByText('bg-red-500')
        await user.click(colorOptions[colorOptions.length - 1])

        // Dropdown should close and show selected color in the button
        await waitFor(() => {
            const elements = screen.getAllByText('bg-red-500')
            expect(elements.length).toBeGreaterThan(0)
        })
    })

    it('calls updateUserBgColor and shows success toast on save', async () => {
        mockUpdateUserBgColor.mockResolvedValue({ success: true, message: 'Background color updated successfully' })
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        // Click edit
        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // Open dropdown and select a color
        const dropdownButton = screen.getAllByText('bg-primary')
            .map(el => el.closest('button[type="button"]'))
            .find(btn => btn?.classList.contains('min-w-40'))!
        await user.click(dropdownButton)

        const colorOptions = screen.getAllByText('bg-red-500')
        await user.click(colorOptions[colorOptions.length - 1])

        // Click save
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserBgColor).toHaveBeenCalledWith('bg-red-500')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Background color updated successfully')
        expect(defaultProps.onSaved).toHaveBeenCalled()
    })

    it('does not call updateUserBgColor when no color is selected', async () => {
        const user = userEvent.setup()
        render(<BackgroundColorSection bgColor={null} onSaved={defaultProps.onSaved} />)

        // Click edit (selectedBgColor will be '' since bgColor is null)
        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // Click save without selecting a color
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockUpdateUserBgColor).not.toHaveBeenCalled()
    })

    it('shows error toast when updateUserBgColor returns failure', async () => {
        mockUpdateUserBgColor.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        const dropdownButton = screen.getAllByText('bg-primary')
            .map(el => el.closest('button[type="button"]'))
            .find(btn => btn?.classList.contains('min-w-40'))!
        await user.click(dropdownButton)

        const colorOptions = screen.getAllByText('bg-red-500')
        await user.click(colorOptions[colorOptions.length - 1])

        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
    })

    it('shows generic error toast when updateUserBgColor throws', async () => {
        mockUpdateUserBgColor.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        const dropdownButton = screen.getAllByText('bg-primary')
            .map(el => el.closest('button[type="button"]'))
            .find(btn => btn?.classList.contains('min-w-40'))!
        await user.click(dropdownButton)

        const colorOptions = screen.getAllByText('bg-red-500')
        await user.click(colorOptions[colorOptions.length - 1])

        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating background color')
        })
    })

    it('hides the edit section when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundColorSection {...defaultProps} />)

        // Click edit to show edit section
        await user.click(screen.getByRole('button', { name: /edit background color/i }))

        // Verify save and cancel buttons are visible
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()

        // Click cancel
        await user.click(screen.getByRole('button', { name: /cancel/i }))

        // The edit section's parent div should have the 'hidden' class
        const editSection = screen.getByRole('button', { name: /save/i }).parentElement
        expect(editSection).toHaveClass('hidden')
    })
})
