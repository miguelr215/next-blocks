import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HowToPlayHero from '@/components/how-to-play-hero'

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}))

describe('HowToPlayHero', () => {
    it('renders without crashing', () => {
        render(<HowToPlayHero />)

        expect(screen.getByText(/How To Play/)).toBeInTheDocument()
    })

    it('renders the page title with correct tag and class', () => {
        render(<HowToPlayHero />)

        const title = screen.getByRole('heading', { level: 1 })
        expect(title).toBeInTheDocument()
        expect(title).toHaveClass('page-title')
        expect(title).toHaveTextContent('How To Play')
        expect(title).toHaveTextContent('Sports Blocks!')
    })

    it('renders "Sports Blocks!" inside a span within the title', () => {
        render(<HowToPlayHero />)

        const span = screen.getByText('Sports Blocks!')
        expect(span.tagName).toBe('SPAN')
        expect(span).toHaveClass('md:block')
    })

    it('renders the first subtitle', () => {
        render(<HowToPlayHero />)

        const subtitle = screen.getByText('A fun way to enjoy your favorite sports!')
        expect(subtitle.tagName).toBe('P')
        expect(subtitle).toHaveClass('page-subtitle')
    })

    it('renders the second subtitle with sign up message', () => {
        render(<HowToPlayHero />)

        const subtitle = screen.getByText('Sign Up Today & Start Playing!')
        expect(subtitle.tagName).toBe('P')
        expect(subtitle).toHaveClass('page-subtitle')
    })

    it('renders the Sign Up link with correct href and classes', () => {
        render(<HowToPlayHero />)

        const link = screen.getByRole('link', { name: 'Sign Up' })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/signup')
        expect(link).toHaveClass('cta-link-btn', 'hover:bg-blue-900')
    })

    it('renders exactly one link', () => {
        render(<HowToPlayHero />)

        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(1)
    })

    it('renders the video element with correct attributes', () => {
        render(<HowToPlayHero />)

        const video = document.querySelector('video')
        expect(video).toBeInTheDocument()
        expect(video).toHaveAttribute('src', '/football-tackle.mp4')
        expect(video).toHaveAttribute('autoplay')
        expect(video).toHaveAttribute('loop')
        expect(video!.muted).toBe(true)
        expect(video).toHaveClass('w-full', 'h-auto')
    })

    it('renders the video with playsInline attribute', () => {
        render(<HowToPlayHero />)

        const video = document.querySelector('video')
        expect(video).toHaveAttribute('playsinline')
    })

    it('renders the outer container with correct layout classes', () => {
        render(<HowToPlayHero />)

        const container = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement
        expect(container).toHaveClass('flex', 'flex-col', 'gap-6', 'w-full')
    })
})
