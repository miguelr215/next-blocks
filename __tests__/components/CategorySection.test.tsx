import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategorySection from '@/components/categorySection'

// Mock the AvailableSports child component
vi.mock('@/components/available-sports', () => ({
    default: () => <div data-testid="available-sports">Mocked AvailableSports</div>,
}))

describe('CategorySection', () => {
    it('renders without crashing', () => {
        render(<CategorySection />)

        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('renders the section title with correct text', () => {
        render(<CategorySection />)

        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toHaveTextContent('Available Sports')
    })

    it('renders the section title with correct CSS classes', () => {
        render(<CategorySection />)

        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toHaveClass('section-title', 'sm:text-center')
    })

    it('renders the subtitle paragraph', () => {
        render(<CategorySection />)

        const subtitle = screen.getByText('Choose your favorite sport and start playing today!')
        expect(subtitle).toBeInTheDocument()
    })

    it('renders the subtitle with correct CSS classes', () => {
        render(<CategorySection />)

        const subtitle = screen.getByText('Choose your favorite sport and start playing today!')
        expect(subtitle).toHaveClass('page-subtitle', 'sm:text-center')
    })

    it('renders a section element with correct CSS classes', () => {
        const { container } = render(<CategorySection />)

        const section = container.querySelector('section')
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('py-6', 'lg:py-8')
    })

    it('renders the AvailableSports component', () => {
        render(<CategorySection />)

        expect(screen.getByTestId('available-sports')).toBeInTheDocument()
    })

    it('renders elements in correct order: heading, subtitle, AvailableSports', () => {
        const { container } = render(<CategorySection />)

        const section = container.querySelector('section')!
        const children = Array.from(section.children)

        expect(children).toHaveLength(3)
        expect(children[0].tagName).toBe('H2')
        expect(children[1].tagName).toBe('P')
        expect(children[2]).toHaveAttribute('data-testid', 'available-sports')
    })
})
