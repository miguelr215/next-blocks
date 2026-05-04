import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChangePasswordSection from '@/components/change-password/ChangePasswordSection'

// Mock the server action
const mockUpdateUserPassword = vi.fn()
vi.mock('@/server/users', () => ({
    updateUserPassword: (...args: unknown[]) => mockUpdateUserPassword(...args),
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

describe('ChangePasswordSection', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the form with password fields and buttons', () => {
        render(<ChangePasswordSection />)

        expect(screen.getByLabelText('New Password:')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm New Password:')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('shows validation error when password is less than 8 characters', async () => {
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'short')
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'short')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
        })
        expect(mockUpdateUserPassword).not.toHaveBeenCalled()
    })

    it('shows validation error when passwords do not match', async () => {
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'validpassword1')
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'differentpassword')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
        })
        expect(mockUpdateUserPassword).not.toHaveBeenCalled()
    })

    it('shows validation error when confirm password is empty', async () => {
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'validpassword1')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(screen.getByText('Confirm password is required')).toBeInTheDocument()
        })
        expect(mockUpdateUserPassword).not.toHaveBeenCalled()
    })

    it('calls updateUserPassword and shows success toast on successful submission', async () => {
        mockUpdateUserPassword.mockResolvedValue({ success: true, message: 'Password updated successfully' })
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'newpassword123')
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpassword123')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockUpdateUserPassword).toHaveBeenCalledWith('newpassword123')
        })
        expect(mockToastSuccess).toHaveBeenCalledWith('Password updated successfully')
    })

    it('resets the form after successful submission', async () => {
        mockUpdateUserPassword.mockResolvedValue({ success: true, message: 'Password updated successfully' })
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        const newPasswordInput = screen.getByPlaceholderText('Enter new password')
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password')

        await user.type(newPasswordInput, 'newpassword123')
        await user.type(confirmPasswordInput, 'newpassword123')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(newPasswordInput).toHaveValue('')
            expect(confirmPasswordInput).toHaveValue('')
        })
    })

    it('shows error toast when updateUserPassword returns failure', async () => {
        mockUpdateUserPassword.mockResolvedValue({ success: false, message: 'User not authenticated' })
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'newpassword123')
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpassword123')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('User not authenticated')
        })
    })

    it('shows generic error toast when updateUserPassword throws', async () => {
        mockUpdateUserPassword.mockRejectedValue(new Error('Network error'))
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        await user.type(screen.getByPlaceholderText('Enter new password'), 'newpassword123')
        await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpassword123')
        await user.click(screen.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error updating password')
        })
    })

    it('resets the form when Cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(<ChangePasswordSection />)

        const newPasswordInput = screen.getByPlaceholderText('Enter new password')
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password')

        await user.type(newPasswordInput, 'somepassword')
        await user.type(confirmPasswordInput, 'somepassword')

        expect(newPasswordInput).toHaveValue('somepassword')
        expect(confirmPasswordInput).toHaveValue('somepassword')

        await user.click(screen.getByRole('button', { name: /cancel/i }))

        expect(newPasswordInput).toHaveValue('')
        expect(confirmPasswordInput).toHaveValue('')
    })
})
