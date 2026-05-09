import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HoverGifCard from '@/components/HoverGifCard'

const defaultProps = {
    sport: 'Football',
    image: '/sport-football.png',
    gif: '/football-spinner.gif',
}

describe('HoverGifCard', () => {
    it('renders without crashing', () => {
        render(<HoverGifCard {...defaultProps} />)

        expect(screen.getByLabelText('Football')).toBeInTheDocument()
    })

    it('renders with the correct aria-label from sport prop', () => {
        render(<HoverGifCard {...defaultProps} sport="Basketball" />)

        expect(screen.getByLabelText('Basketball')).toBeInTheDocument()
    })

    it('sets the initial background image to the image prop', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')
        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.image})` })
    })

    it('changes background image to gif on mouse enter', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')
        fireEvent.mouseEnter(card)

        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.gif})` })
    })

    it('reverts background image to static image on mouse leave', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')
        fireEvent.mouseEnter(card)
        fireEvent.mouseLeave(card)

        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.image})` })
    })

    it('applies default CSS classes', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')
        expect(card).toHaveClass(
            'bg-cover',
            'bg-no-repeat',
            'bg-center',
            'rounded-lg',
            'shadow-lg',
            'cursor-pointer',
        )
    })

    it('merges custom className with default classes', () => {
        render(<HoverGifCard {...defaultProps} className="custom-class" />)

        const card = screen.getByLabelText('Football')
        expect(card).toHaveClass('custom-class')
        expect(card).toHaveClass('rounded-lg')
    })

    it('renders without className prop', () => {
        render(<HoverGifCard sport="Hockey" image="/hockey.png" gif="/hockey.gif" />)

        const card = screen.getByLabelText('Hockey')
        expect(card).toBeInTheDocument()
        expect(card).toHaveClass('rounded-lg')
    })

    it('handles multiple hover cycles correctly', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')

        // First cycle
        fireEvent.mouseEnter(card)
        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.gif})` })
        fireEvent.mouseLeave(card)
        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.image})` })

        // Second cycle
        fireEvent.mouseEnter(card)
        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.gif})` })
        fireEvent.mouseLeave(card)
        expect(card).toHaveStyle({ backgroundImage: `url(${defaultProps.image})` })
    })

    it('renders as a div element', () => {
        render(<HoverGifCard {...defaultProps} />)

        const card = screen.getByLabelText('Football')
        expect(card.tagName).toBe('DIV')
    })

    it('uses different image and gif values correctly', () => {
        const props = {
            sport: 'Baseball',
            image: '/baseball-static.png',
            gif: '/baseball-animated.gif',
        }
        render(<HoverGifCard {...props} />)

        const card = screen.getByLabelText('Baseball')
        expect(card).toHaveStyle({ backgroundImage: 'url(/baseball-static.png)' })

        fireEvent.mouseEnter(card)
        expect(card).toHaveStyle({ backgroundImage: 'url(/baseball-animated.gif)' })
    })
})
