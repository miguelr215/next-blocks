"use client";

import { cn } from '@/lib/utils';
import React, { useState } from 'react'

const HoverGifCard = ({ sport, image, gif, className }: { sport: string, image: string, gif: string, className?: string }) => {
    const [bgImg, setBgImg] = useState(image);

    const handleMouseEnter = () => {
        setBgImg(gif);
    };

    const handleMouseLeave = () => {
        setBgImg(image);
    };

    return (
        <div
            className={cn("w-62.5 h-62.5 bg-cover bg-no-repeat bg-center rounded-lg shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-2xl", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundImage: `url(${bgImg})` }}
            aria-label={sport}
        />
    )
}

export default HoverGifCard