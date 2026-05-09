import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/hero'

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}))

// Mock FullLogo component
vi.mock('@/components/ui/fullLogo', () => ({
    default: () => <div data-testid="full-logo">FullLogo</div>,
}))

// Mock ElectricBorder component
vi.mock('@/components/ElectricBorder', () => ({
    default: ({ children, color, speed, chaos, className, style }: {
        children: React.ReactNode
        color: string
        speed: number
        chaos: number
        className: string
        style: React.CSSProperties
    }) => (
        <div data-testid="electric-border" data-color={color} data-speed={speed} data-chaos={chaos} className={className} style={style}>
            {children}
        </div>
    ),
}))

describe('Hero', () => {
    it('renders without crashing', () => {
        render(<Hero />)

        expect(screen.getByText('Sports Blocks')).toBeInTheDocument()
    })

    it('renders the page title', () => {
        render(<Hero />)

        const title = screen.getByText('Sports Blocks')
        expect(title.tagName).toBe('H1')
        expect(title).toHaveClass('page-title')
    })

    it('renders the subtitle', () => {
        render(<Hero />)

        const subtitle = screen.getByText('A new way to watch and bet on your favorite sports.')
        expect(subtitle.tagName).toBe('P')
        expect(subtitle).toHaveClass('page-subtitle')
    })

    it('renders the Get Started link with correct href', () => {
        render(<Hero />)

        const link = screen.getByText('Get Started')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/signup')
        expect(link).toHaveClass('cta-link-btn', 'hover:bg-blue-900')
    })

    it('renders the How To Play link with correct href', () => {
        render(<Hero />)

        const link = screen.getByText('How To Play')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/how-to-play')
        expect(link).toHaveClass('cta-link-btn', 'hover:bg-green-900')
    })

    it('renders the Login link with correct href', () => {
        render(<Hero />)

        const link = screen.getByText('Login')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/login')
        expect(link).toHaveClass('cta-link-btn', 'hover:bg-yellow-600')
    })

    it('renders exactly three CTA links', () => {
        render(<Hero />)

        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(3)
    })

    it('renders the FullLogo component', () => {
        render(<Hero />)

        expect(screen.getByTestId('full-logo')).toBeInTheDocument()
    })

    it('renders the ElectricBorder component with correct props', () => {
        render(<Hero />)

        const border = screen.getByTestId('electric-border')
        expect(border).toBeInTheDocument()
        expect(border).toHaveAttribute('data-color', '#193cb8')
        expect(border).toHaveAttribute('data-speed', '1')
        expect(border).toHaveAttribute('data-chaos', '0.25')
        expect(border).toHaveClass('hero-img-border')
        expect(border).toHaveStyle({ borderRadius: '16px' })
    })

    it('renders the section element with correct classes', () => {
        render(<Hero />)

        const section = screen.getByText('Sports Blocks').closest('section')
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('flex', 'flex-col')
    })

    it('renders links in the correct order', () => {
        render(<Hero />)

        const links = screen.getAllByRole('link')
        expect(links[0]).toHaveTextContent('Get Started')
        expect(links[1]).toHaveTextContent('How To Play')
        expect(links[2]).toHaveTextContent('Login')
    })
})
