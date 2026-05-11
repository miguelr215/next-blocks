import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HPBannerCTA from '@/components/hp-banner-cta'

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}))

describe('HPBannerCTA', () => {
    it('renders without crashing', () => {
        render(<HPBannerCTA />)

        expect(screen.getByText(/Join Sports Blocks TODAY/)).toBeInTheDocument()
    })

    it('renders the banner text', () => {
        render(<HPBannerCTA />)

        const text = screen.getByText(/Join Sports Blocks TODAY/)
        expect(text.tagName).toBe('P')
        expect(text).toHaveClass('text-gray-200', 'font-semibold', 'text-lg')
    })

    it('renders the Sign Up link with correct href', () => {
        render(<HPBannerCTA />)

        const link = screen.getByRole('link', { name: 'Sign Up' })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/signup')
    })

    it('renders the Sign Up link with the cta-link-btn class', () => {
        render(<HPBannerCTA />)

        const link = screen.getByRole('link', { name: 'Sign Up' })
        expect(link).toHaveClass('cta-link-btn')
    })

    it('renders exactly one link', () => {
        render(<HPBannerCTA />)

        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(1)
    })

    it('renders a section element as the root', () => {
        render(<HPBannerCTA />)

        const section = screen.getByText(/Join Sports Blocks TODAY/).closest('section')
        expect(section).toBeInTheDocument()
    })

    it('renders the section with correct classes', () => {
        render(<HPBannerCTA />)

        const section = screen.getByText(/Join Sports Blocks TODAY/).closest('section')
        expect(section).toHaveClass('bg-blue-800', 'w-full', 'mt-6', 'p-6', 'grid', 'grid-cols-2', 'gap-4')
    })

    it('renders the sign up button inside a flex container', () => {
        render(<HPBannerCTA />)

        const link = screen.getByRole('link', { name: 'Sign Up' })
        const container = link.parentElement
        expect(container).toHaveClass('flex', 'justify-center', 'items-center')
    })

    it('contains the game time message with mdash entity', () => {
        render(<HPBannerCTA />)

        // The mdash renders as an em dash character (—)
        const text = screen.getByText(/It's almost game time/)
        expect(text).toBeInTheDocument()
    })
})
