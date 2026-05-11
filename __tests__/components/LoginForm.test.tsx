import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/login-form'

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
const mockSignInEmail = vi.fn()
const mockSignInSocial = vi.fn()
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signIn: {
            email: (...args: unknown[]) => mockSignInEmail(...args),
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

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<LoginForm />)
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
    })

    it('renders the card title and description', () => {
        render(<LoginForm />)
        expect(screen.getByText('Welcome back')).toBeInTheDocument()
        expect(screen.getByText('Login with your Google account')).toBeInTheDocument()
    })

    it('renders the email and password input fields', () => {
        render(<LoginForm />)
        expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('********')).toBeInTheDocument()
    })

    it('renders the Login with Google button', () => {
        render(<LoginForm />)
        expect(screen.getByText('Login with Google')).toBeInTheDocument()
    })

    it('renders the Login submit button', () => {
        render(<LoginForm />)
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    it('renders the Forgot password link with correct href', () => {
        render(<LoginForm />)
        const link = screen.getByText('Forgot password?')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/forgot-password')
    })

    it('renders the Sign up link with correct href', () => {
        render(<LoginForm />)
        const link = screen.getByText('Sign up')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/signup')
    })

    it('renders Terms of Service and Privacy Policy links', () => {
        render(<LoginForm />)
        expect(screen.getByText('Terms of Service')).toBeInTheDocument()
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    })

    it('renders the "Or continue with" separator', () => {
        render(<LoginForm />)
        expect(screen.getByText('Or continue with')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<LoginForm className="custom-class" />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass('custom-class')
    })

    it('calls signIn.social with Google provider when Google button is clicked', async () => {
        const user = userEvent.setup()
        mockSignInSocial.mockResolvedValue(undefined)
        render(<LoginForm />)

        await user.click(screen.getByText('Login with Google'))

        expect(mockSignInSocial).toHaveBeenCalledWith({
            provider: 'google',
            callbackURL: '/dashboard',
        })
    })

    it('submits the form with valid email and password', async () => {
        const user = userEvent.setup()
        mockSignInEmail.mockResolvedValue(undefined)
        render(<LoginForm />)

        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(mockSignInEmail).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
        })
    })

    it('shows success toast and navigates to dashboard on successful login', async () => {
        const user = userEvent.setup()
        mockSignInEmail.mockResolvedValue(undefined)
        render(<LoginForm />)

        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith('Sign in successful')
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('shows error toast when login fails with an Error', async () => {
        const user = userEvent.setup()
        mockSignInEmail.mockRejectedValue(new Error('Invalid credentials'))
        render(<LoginForm />)

        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Invalid credentials')
            expect(mockPush).not.toHaveBeenCalled()
        })
    })

    it('shows generic error toast when login fails with a non-Error', async () => {
        const user = userEvent.setup()
        mockSignInEmail.mockRejectedValue('unknown error')
        render(<LoginForm />)

        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Sign in failed')
        })
    })

    it('disables buttons while loading', async () => {
        const user = userEvent.setup()
        // Make signInEmail hang so we can check loading state
        mockSignInEmail.mockImplementation(() => new Promise(() => { }))
        render(<LoginForm />)

        await user.type(screen.getByPlaceholderText('you@email.com'), 'test@example.com')
        await user.type(screen.getByPlaceholderText('********'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
        })

        // Both buttons should be disabled
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
            expect(button).toBeDisabled()
        })
    })

    it('has email input with correct type', () => {
        render(<LoginForm />)
        const emailInput = screen.getByPlaceholderText('you@email.com')
        expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('has password input with correct type', () => {
        render(<LoginForm />)
        const passwordInput = screen.getByPlaceholderText('********')
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('renders the "Don\'t have an account?" text', () => {
        render(<LoginForm />)
        expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument()
    })
})
