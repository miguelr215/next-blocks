import React from 'react'

const footerItems = [
    {
        name: 'Sports', href: '/sports', subNavs: [
            { name: 'NFL', href: '/nfl' },
            { name: 'NBA', href: '/nba' },
            { name: 'MLB', href: '/mlb' },
            { name: 'NHL', href: '/nhl' }
        ]
    },
    { name: 'My Games', href: '/dashboard/my-games' },
    { name: 'How To Play', href: '/how-to-play' },
    {
        name: 'About', href: '/about', subNavs: [
            { name: 'Contact Us', href: '/contact-us' },
            { name: 'Get Help', href: '/get-help' },
            { name: 'Responsible Gaming', href: '/responsible-gaming' },
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms-of-service' },
            { name: 'Accessibility', href: '/accessibility' }
        ]
    }
]

const SBFooter = () => {
    return (
        <footer>SBFooter</footer>
    )
}

export default SBFooter