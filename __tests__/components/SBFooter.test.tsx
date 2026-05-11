import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SBFooter from '@/components/sb-footer'

describe('SBFooter', () => {
    it('renders without crashing', () => {
        render(<SBFooter />)

        expect(screen.getByText('SBFooter')).toBeInTheDocument()
    })

    it('renders a footer element', () => {
        render(<SBFooter />)

        const footer = screen.getByRole('contentinfo')
        expect(footer).toBeInTheDocument()
    })

    it('renders the footer text content', () => {
        render(<SBFooter />)

        const footer = screen.getByRole('contentinfo')
        expect(footer).toHaveTextContent('SBFooter')
    })

    it('renders as a semantic <footer> HTML element', () => {
        render(<SBFooter />)

        const footer = screen.getByText('SBFooter')
        expect(footer.tagName).toBe('FOOTER')
    })

    it('renders exactly one footer element', () => {
        render(<SBFooter />)

        const footers = screen.getAllByRole('contentinfo')
        expect(footers).toHaveLength(1)
    })
})
