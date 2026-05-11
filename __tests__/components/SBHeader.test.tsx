import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SBHeader } from '@/components/sb-header'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode;[key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

// Mock auth client
const mockSignOut = vi.fn().mockResolvedValue(undefined)
const mockUseSession = vi.fn()
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signOut: () => mockSignOut(),
        useSession: () => mockUseSession(),
    },
}))

// Mock motion/react
vi.mock('motion/react', () => ({
    useScroll: () => ({
        scrollYProgress: {
            on: vi.fn(() => vi.fn()),
        },
    }),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    LogOut: ({ className }: { className?: string }) => (
        <span data-testid="logout-icon" className={className}>LogOutIcon</span>
    ),
    Menu: ({ className }: { className?: string }) => (
        <span data-testid="menu-icon" className={className}>MenuIcon</span>
    ),
    X: ({ className }: { className?: string }) => (
        <span data-testid="x-icon" className={className}>XIcon</span>
    ),
}))

// Mock SmallLogo
vi.mock('@/components/ui/smallLogo', () => ({
    default: () => <div data-testid="small-logo">SmallLogo</div>,
}))

// Mock Avatar
vi.mock('@/components/ui/avatar', () => ({
    Avatar: ({ name, className }: { src?: string; name?: string; className?: string }) => (
        <div data-testid="avatar" className={className}>{name}</div>
    ),
}))

// Mock Button
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, asChild, ...props }: { children: React.ReactNode; onClick?: () => void; asChild?: boolean;[key: string]: unknown }) => (
        <button onClick={onClick} {...props}>{children}</button>
    ),
}))

// Mock Tooltip components
vi.mock('@/components/ui/tooltip', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipContent: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

// Mock AnimatedThemeToggler
vi.mock('@/components/ui/animated-theme-toggler', () => ({
    AnimatedThemeToggler: ({ className }: { className?: string }) => (
        <button data-testid="theme-toggler" className={className}>ThemeToggler</button>
    ),
}))

beforeEach(() => {
    vi.clearAllMocks()
    mockUseSession.mockReturnValue({ data: null, isPending: false })
})

describe('SBHeader', () => {
    it('renders without crashing', () => {
        render(<SBHeader />)
        expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('renders the logo with link to home', () => {
        render(<SBHeader />)
        const homeLink = screen.getByLabelText('home')
        expect(homeLink).toBeInTheDocument()
        expect(homeLink).toHaveAttribute('href', '/')
        expect(screen.getByTestId('small-logo')).toBeInTheDocument()
    })

    it('renders all navigation menu items', () => {
        render(<SBHeader />)
        const sportsLinks = screen.getAllByText('Sports')
        const myGamesLinks = screen.getAllByText('My Games')
        const howToPlayLinks = screen.getAllByText('How To Play')
        const aboutLinks = screen.getAllByText('About')

        // Each menu item appears twice (desktop + mobile)
        expect(sportsLinks).toHaveLength(2)
        expect(myGamesLinks).toHaveLength(2)
        expect(howToPlayLinks).toHaveLength(2)
        expect(aboutLinks).toHaveLength(2)
    })

    it('renders correct hrefs for navigation links', () => {
        render(<SBHeader />)
        const sportsLinks = screen.getAllByText('Sports')
        expect(sportsLinks[0].closest('a')).toHaveAttribute('href', '/sports')

        const myGamesLinks = screen.getAllByText('My Games')
        expect(myGamesLinks[0].closest('a')).toHaveAttribute('href', '/dashboard/my-games')

        const howToPlayLinks = screen.getAllByText('How To Play')
        expect(howToPlayLinks[0].closest('a')).toHaveAttribute('href', '/how-to-play')

        const aboutLinks = screen.getAllByText('About')
        expect(aboutLinks[0].closest('a')).toHaveAttribute('href', '/about')
    })

    it('renders the theme toggler', () => {
        render(<SBHeader />)
        expect(screen.getByTestId('theme-toggler')).toBeInTheDocument()
    })

    it('renders the mobile menu toggle button', () => {
        render(<SBHeader />)
        const menuButton = screen.getByLabelText('Open Menu')
        expect(menuButton).toBeInTheDocument()
    })

    it('toggles mobile menu aria-label on click', async () => {
        const user = userEvent.setup()
        render(<SBHeader />)

        const menuButton = screen.getByLabelText('Open Menu')
        await user.click(menuButton)
        expect(screen.getByLabelText('Close Menu')).toBeInTheDocument()

        await user.click(screen.getByLabelText('Close Menu'))
        expect(screen.getByLabelText('Open Menu')).toBeInTheDocument()
    })

    describe('when user is not authenticated', () => {
        beforeEach(() => {
            mockUseSession.mockReturnValue({ data: null, isPending: false })
        })

        it('renders Login and Sign Up buttons', () => {
            render(<SBHeader />)
            expect(screen.getByText('Login')).toBeInTheDocument()
            expect(screen.getByText('Sign Up')).toBeInTheDocument()
        })

        it('Login button links to /login', () => {
            render(<SBHeader />)
            const loginLink = screen.getByText('Login').closest('a')
            expect(loginLink).toHaveAttribute('href', '/login')
        })

        it('Sign Up button links to /signup', () => {
            render(<SBHeader />)
            const signupLink = screen.getByText('Sign Up').closest('a')
            expect(signupLink).toHaveAttribute('href', '/signup')
        })

        it('does not render avatar or logout button', () => {
            render(<SBHeader />)
            expect(screen.queryByTestId('avatar')).not.toBeInTheDocument()
            expect(screen.queryByTestId('logout-icon')).not.toBeInTheDocument()
        })
    })

    describe('when session is pending', () => {
        beforeEach(() => {
            mockUseSession.mockReturnValue({ data: null, isPending: true })
        })

        it('does not render Login/Sign Up buttons or user UI', () => {
            render(<SBHeader />)
            expect(screen.queryByText('Login')).not.toBeInTheDocument()
            expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
            expect(screen.queryByTestId('avatar')).not.toBeInTheDocument()
        })
    })

    describe('when user is authenticated', () => {
        const mockSession = {
            user: {
                name: 'John Doe',
                email: 'john@example.com',
                image: 'https://example.com/avatar.jpg',
                accountBalance: 100,
                bgColor: 'bg-blue-500',
            },
        }

        beforeEach(() => {
            mockUseSession.mockReturnValue({ data: mockSession, isPending: false })
        })

        it('renders the user avatar', () => {
            render(<SBHeader />)
            const avatar = screen.getByTestId('avatar')
            expect(avatar).toBeInTheDocument()
            expect(avatar).toHaveTextContent('John Doe')
        })

        it('renders the account balance with link to wallet', () => {
            render(<SBHeader />)
            const balanceLink = screen.getByText('$100')
            expect(balanceLink).toBeInTheDocument()
            expect(balanceLink).toHaveAttribute('href', '/dashboard/wallet')
        })

        it('renders the avatar link to dashboard', () => {
            render(<SBHeader />)
            const dashboardLink = screen.getByTestId('avatar').closest('a')
            expect(dashboardLink).toHaveAttribute('href', '/dashboard')
        })

        it('renders the logout button', () => {
            render(<SBHeader />)
            expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
        })

        it('does not render Login/Sign Up buttons', () => {
            render(<SBHeader />)
            expect(screen.queryByText('Login')).not.toBeInTheDocument()
            expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
        })

        it('calls signOut and redirects to home on logout', async () => {
            const user = userEvent.setup()
            render(<SBHeader />)

            const logoutButton = screen.getByTestId('logout-icon').closest('button')!
            await user.click(logoutButton)

            await waitFor(() => {
                expect(mockSignOut).toHaveBeenCalledTimes(1)
                expect(mockPush).toHaveBeenCalledWith('/')
            })
        })
    })

    it('renders a nav element', () => {
        render(<SBHeader />)
        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
})
