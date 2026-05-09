import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardSidebar from '@/components/DashboardSidebar'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
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

// Mock sidebar UI components
vi.mock('@/components/ui/sidebar', () => ({
    Sidebar: ({ children }: { children: React.ReactNode }) => <aside data-testid="sidebar">{children}</aside>,
    SidebarContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-content">{children}</div>,
    SidebarFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-footer">{children}</div>,
    SidebarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
    SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
    SidebarMenuButton: ({ children, ...props }: { children: React.ReactNode; asChild?: boolean; tooltip?: string }) => <li>{children}</li>,
    SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
}))

// Mock Avatar
vi.mock('@/components/ui/avatar', () => ({
    Avatar: ({ src, name, className }: { src?: string | null; name?: string | null; className?: string }) => (
        <div data-testid="avatar" data-src={src ?? ''} data-name={name ?? ''}>{name?.charAt(0) ?? '?'}</div>
    ),
}))

// Mock Button
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button {...props}>{children}</button>
    ),
}))

// Mock Tooltip
vi.mock('@/components/ui/tooltip', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipContent: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

const sessionData = {
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
        bgColor: 'bg-blue-500',
    },
}

describe('DashboardSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue({ data: sessionData })
    })

    it('renders the sidebar component', () => {
        render(<DashboardSidebar />)
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('renders all three section labels', () => {
        render(<DashboardSidebar />)
        expect(screen.getByText('My Account')).toBeInTheDocument()
        // "My Games" appears as both a section label (h3) and a link (span)
        const myGamesHeading = screen.getByText('My Games', { selector: 'h3' })
        expect(myGamesHeading).toBeInTheDocument()
        expect(screen.getByText('Wallet')).toBeInTheDocument()
    })

    it('renders all My Account links with correct hrefs', () => {
        render(<DashboardSidebar />)
        expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/dashboard/profile')
        expect(screen.getByText('Change Password').closest('a')).toHaveAttribute('href', '/dashboard/change-password')
        expect(screen.getByText('Gambling Settings').closest('a')).toHaveAttribute('href', '/dashboard/gambling-settings')
        expect(screen.getByText('Communications').closest('a')).toHaveAttribute('href', '/dashboard/communications')
        expect(screen.getByText('Friends').closest('a')).toHaveAttribute('href', '/dashboard/friends')
    })

    it('renders all My Games links with correct hrefs', () => {
        render(<DashboardSidebar />)
        // "My Games" appears as both section label and link - get the link one
        const myGamesLink = screen.getAllByText('My Games').find(el => el.closest('a'))
        expect(myGamesLink?.closest('a')).toHaveAttribute('href', '/dashboard/my-games')
        expect(screen.getByText('Create a Private Game').closest('a')).toHaveAttribute('href', '/dashboard/create-game')
        expect(screen.getByText('Games History').closest('a')).toHaveAttribute('href', '/dashboard/games-history')
    })

    it('renders all Wallet links with correct hrefs', () => {
        render(<DashboardSidebar />)
        expect(screen.getByText('Add Funds').closest('a')).toHaveAttribute('href', '/dashboard/wallet/add-funds')
        expect(screen.getByText('Withdraw Funds').closest('a')).toHaveAttribute('href', '/dashboard/wallet/withdraw')
        expect(screen.getByText('Edit Payment Methods').closest('a')).toHaveAttribute('href', '/dashboard/wallet/payment-methods')
    })

    it('displays user name and email in the footer', () => {
        render(<DashboardSidebar />)
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('renders the avatar with session data', () => {
        render(<DashboardSidebar />)
        const avatar = screen.getByTestId('avatar')
        expect(avatar).toHaveAttribute('data-name', 'John Doe')
        expect(avatar).toHaveAttribute('data-src', 'https://example.com/avatar.jpg')
    })

    it('displays "Guest" when session has no user name', () => {
        mockUseSession.mockReturnValue({ data: { user: { name: null, email: null, image: null, bgColor: null } } })
        render(<DashboardSidebar />)
        expect(screen.getByText('Guest')).toBeInTheDocument()
    })

    it('displays "Guest" when session is null', () => {
        mockUseSession.mockReturnValue({ data: null })
        render(<DashboardSidebar />)
        expect(screen.getByText('Guest')).toBeInTheDocument()
    })

    it('calls signOut and redirects to home on logout click', async () => {
        const user = userEvent.setup()
        render(<DashboardSidebar />)

        const logoutButton = screen.getByRole('button', { name: /logout/i })
        await user.click(logoutButton)

        expect(mockSignOut).toHaveBeenCalledOnce()
        expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('renders a logout button with sr-only text', () => {
        render(<DashboardSidebar />)
        const srText = screen.getByText('Logout', { selector: '.sr-only' })
        expect(srText).toBeInTheDocument()
    })
})
