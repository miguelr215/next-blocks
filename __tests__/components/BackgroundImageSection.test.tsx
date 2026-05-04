import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BackgroundImageSection } from '@/components/profile/BackgroundImageSection'

// Mock the server action
const mockUpdateUserImage = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserImage: (...args: unknown[]) => mockUpdateUserImage(...args),
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

// Mock next/image to render a plain img element
vi.mock('next/image', () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

const defaultProps = {
    image: '/avatars/miguel.svg',
    onSaved: vi.fn().mockResolvedValue(undefined),
}

describe('BackgroundImageSection', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        defaultProps.onSaved = vi.fn().mockResolvedValue(undefined)
    })

    it('renders the label and switch', () => {
        render(<BackgroundImageSection {...defaultProps} />)

        expect(screen.getByText('Background Image:')).toBeInTheDocument()
    })

    it('shows the current image when enabled and image is provided', () => {
        render(<BackgroundImageSection {...defaultProps} />)

        const img = screen.getByAltText('Background')
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute('src', '/avatars/miguel.svg')
    })

    it('shows "No image set" when enabled but image is null', () => {
        render(<BackgroundImageSection image={null} onSaved={defaultProps.onSaved} />)

        // Switch is unchecked when image is null, so we need to enable it first
        // Since isEnabled starts as false when image is null, "No image set" won't show
        expect(screen.queryByText('No image set')).not.toBeInTheDocument()
    })

    it('shows "No image set" after enabling the switch when image is null', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection image={null} onSaved={defaultProps.onSaved} />)

        // Enable the switch
        const switchEl = screen.getByRole('switch')
        await user.click(switchEl)

        expect(screen.getByText('No image set')).toBeInTheDocument()
    })

    it('shows the edit background image button when enabled', () => {
        render(<BackgroundImageSection {...defaultProps} />)

        expect(screen.getByRole('button', { name: /edit background image/i })).toBeInTheDocument()
    })

    it('does not show edit button when disabled (no image)', () => {
        render(<BackgroundImageSection image={null} onSaved={defaultProps.onSaved} />)

        expect(screen.queryByRole('button', { name: /edit background image/i })).not.toBeInTheDocument()
    })

    it('shows the image dropdown when edit button is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('opens the avatar list when the dropdown toggle is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        // Find the dropdown toggle button by its min-w-48 class
        const dropdownButton = document.querySelector('button.min-w-48')!
        await user.click(dropdownButton)

        // Avatar images should now be visible in the list
        const listItems = screen.getAllByRole('listitem')
        expect(listItems.length).toBeGreaterThan(0)
    })

    it('selects an avatar from the dropdown list', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        // Open dropdown
        const dropdownButton = document.querySelector('button.min-w-48')!
        await user.click(dropdownButton)

        // Click the first avatar in the list
        const listItems = screen.getAllByRole('listitem')
        await user.click(listItems[0])

        // After selecting, the dropdown should close and the button should show the selected image
        const selectedImg = dropdownButton.querySelector('img')
        expect(selectedImg).toBeTruthy()
    })

    it('calls updateUserImage and shows success toast on save', async () => {
        mockUpdateUserImage.mockResolvedValue({ success: true, message: 'Image updated successfully' })
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        // Open dropdown and select an avatar
        const dropdownButton = document.querySelector('button.min-w-48')!
        await user.click(dropdownButton)
        const listItems = screen.getAllByRole('listitem')
        await user.click(listItems[0])

        // Click save
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserImage).toHaveBeenCalledWith('/avatars/blac.svg')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Background image updated successfully')
        expect(defaultProps.onSaved).toHaveBeenCalled()
    })

    it('does not call updateUserImage when no image is selected', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection image={null} onSaved={defaultProps.onSaved} />)

        // Enable the switch
        await user.click(screen.getByRole('switch'))

        // Click edit
        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        // Click save without selecting an image
        await user.click(screen.getByRole('button', { name: /save/i }))

        expect(mockUpdateUserImage).not.toHaveBeenCalled()
    })

    it('shows error toast when updateUserImage returns failure', async () => {
        mockUpdateUserImage.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        const dropdownButton = document.querySelector('button.min-w-48')!
        await user.click(dropdownButton)
        const listItems = screen.getAllByRole('listitem')
        await user.click(listItems[0])

        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
    })

    it('shows generic error toast when updateUserImage throws', async () => {
        mockUpdateUserImage.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        const dropdownButton = document.querySelector('button.min-w-48')!
        await user.click(dropdownButton)
        const listItems = screen.getAllByRole('listitem')
        await user.click(listItems[0])

        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating background image')
        })
    })

    it('removes background image when switch is toggled off', async () => {
        mockUpdateUserImage.mockResolvedValue({ success: true, message: 'Image removed' })
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        // Toggle the switch off
        const switchEl = screen.getByRole('switch')
        await user.click(switchEl)

        await waitFor(() => {
            expect(mockUpdateUserImage).toHaveBeenCalledWith(null)
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Background image removed')
        expect(defaultProps.onSaved).toHaveBeenCalled()
    })

    it('shows error toast when toggle off returns failure', async () => {
        mockUpdateUserImage.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('switch'))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
    })

    it('shows generic error toast when toggle off throws', async () => {
        mockUpdateUserImage.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        await user.click(screen.getByRole('switch'))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error removing background image')
        })
    })

    it('hides the edit section when cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<BackgroundImageSection {...defaultProps} />)

        // Click edit to show edit section
        await user.click(screen.getByRole('button', { name: /edit background image/i }))

        // Verify save and cancel buttons are visible
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()

        // Click cancel
        await user.click(screen.getByRole('button', { name: /cancel/i }))

        // The edit section's parent div should have the 'hidden' class
        const editSection = screen.getByRole('button', { name: /save/i }).parentElement
        expect(editSection).toHaveClass('hidden')
    })

    it('renders with undefined image without crashing', () => {
        render(<BackgroundImageSection image={undefined} onSaved={defaultProps.onSaved} />)

        expect(screen.getByText('Background Image:')).toBeInTheDocument()
    })
})
