import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUpForm } from '@/components/signup-form'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

// Mock auth client
const mockSignUpEmail = vi.fn()
const mockSignInSocial = vi.fn()
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signUp: {
            email: (...args: unknown[]) => mockSignUpEmail(...args),
        },
        signIn: {
            social: (...args: unknown[]) => mockSignInSocial(...args),
        },
    },
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

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Loader2: ({ className }: { className?: string }) => (
        <span data-testid="loader-icon" className={className}>Loading...</span>
    ),
}))

describe('SignUpForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<SignUpForm />)
        expect(screen.getByText('Welcome to Sports Blocks')).toBeInTheDocument()
    })

    it('renders the card title and description', () => {
        render(<SignUpForm />)
        expect(screen.getByText('Welcome to Sports Blocks')).toBeInTheDocument()
        expect(screen.getByText('Sign up with your Google account')).toBeInTheDocument()
    })

    it('renders the username, email, and password input fields', () => {
        render(<SignUpForm />)
        expect(screen.getByPlaceholderText('Mike Honcho')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('********')).toBeInTheDocument()
    })

    it('renders the Sign up with Google button', () => {
        render(<SignUpForm />)
        expect(screen.getByText('Sign up with Google')).toBeInTheDocument()
    })

    it('renders the Sign Up submit button', () => {
        render(<SignUpForm />)
        expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    })

    it('renders the Login link with correct href', () => {
        render(<SignUpForm />)
        const link = screen.getByText('Login')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/login')
    })

    it('renders Terms of Service and Privacy Policy links', () => {
        render(<SignUpForm />)
        expect(screen.getByText('Terms of Service')).toBeInTheDocument()
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    })

    it('renders the "Or continue with" separator', () => {
        render(<SignUpForm />)
        expect(screen.getByText('Or continue with')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<SignUpForm className="custom-class" />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass('custom-class')
    })

    it('calls signIn.social with Google provider when Google button is clicked', async () => {
        const user = userEvent.setup()
        mockSignInSocial.mockResolvedValue(undefined)
        render(<SignUpForm />)

        await user.click(screen.getByText('Sign up with Google'))

        expect(mockSignInSocial).toHaveBeenCalledWith({
            provider: 'google',
            callbackURL: '/dashboard',
        })
    })

    it('submits the form with valid username, email, and password', async () => {
        const user = userEvent.setup()
        mockSignUpEmail.mockResolvedValue(undefined)
        render(<SignUpForm />)

        await user.type(screen.getByPlaceholderText('Mike Honcho'), 'testuser')
        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(mockSignUpEmail).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                name: 'testuser',
            })
        })
    })

    it('shows success toast and navigates to dashboard on successful sign up', async () => {
        const user = userEvent.setup()
        mockSignUpEmail.mockResolvedValue(undefined)
        render(<SignUpForm />)

        await user.type(screen.getByPlaceholderText('Mike Honcho'), 'testuser')
        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith('Sign up successful')
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('shows error toast when sign up fails with an Error', async () => {
        const user = userEvent.setup()
        mockSignUpEmail.mockRejectedValue(new Error('Email already in use'))
        render(<SignUpForm />)

        await user.type(screen.getByPlaceholderText('Mike Honcho'), 'testuser')
        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Email already in use')
            expect(mockPush).not.toHaveBeenCalled()
        })
    })

    it('shows generic error toast when sign up fails with a non-Error', async () => {
        const user = userEvent.setup()
        mockSignUpEmail.mockRejectedValue('unknown error')
        render(<SignUpForm />)

        await user.type(screen.getByPlaceholderText('Mike Honcho'), 'testuser')
        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Sign up failed')
        })
    })

    it('disables buttons while loading', async () => {
        const user = userEvent.setup()
        // Make signUpEmail hang so we can check loading state
        mockSignUpEmail.mockImplementation(() => new Promise(() => { }))
        render(<SignUpForm />)

        await user.type(screen.getByPlaceholderText('Mike Honcho'), 'testuser')
        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
        })

        // Both buttons should be disabled
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
            expect(button).toBeDisabled()
        })
    })

    it('has username input with correct type', () => {
        render(<SignUpForm />)
        const usernameInput = screen.getByPlaceholderText('Mike Honcho')
        expect(usernameInput).toHaveAttribute('type', 'text')
    })

    it('has email input with correct type', () => {
        render(<SignUpForm />)
        const emailInput = screen.getByPlaceholderText('you@email.com')
        expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('has password input with correct type', () => {
        render(<SignUpForm />)
        const passwordInput = screen.getByPlaceholderText('********')
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('renders the "Already have an account?" text', () => {
        render(<SignUpForm />)
        expect(screen.getByText(/Already have an account\?/)).toBeInTheDocument()
    })
})
