'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserImage } from '@/server/users'
import { toast } from 'sonner'
import Image from 'next/image'

const AVATAR_IMAGES = [
    'blac.svg', 'black.svg', 'boricua.svg', 'bunpunisher.svg', 'c.svg',
    'ceasar.svg', 'christina.svg', 'copycat.svg', 'd.svg', 'denise.svg',
    'doubledancedragon.svg', 'elena.svg', 'extremadora.svg', 'g.svg', 'goril.svg',
    'honeybunny.svg', 'huxley.svg', 'irontwin.svg', 'j.svg', 'jacob.svg',
    'jamesbon.svg', 'jessica.svg', 'jo.svg', 'karl.svg', 'kimpatel.svg',
    'kitty.svg', 'marco.svg', 'marcus.svg', 'marcus100.svg', 'mary.svg',
    'melissa.svg', 'mia.svg', 'mia2.svg', 'mia6.svg', 'michael.svg',
    'mig.svg', 'miguel.svg', 'mike.svg', 'mj.svg', 'mon.svg',
    'r.svg', 'ramb.svg', 'ramba.svg', 'rock.svg', 'sam.svg',
    'samantha.svg', 'slic.svg', 'snoop.svg', 'snoop2.svg', 'spooneyes.svg',
    'squarepusher.svg', 'taco.svg', 'tesla.svg', 'tuco.svg', 'tuko.svg',
    'victormontoya.svg', 'weeed.svg', 'wunderlick.svg', 'y.svg', 'zenflash.svg',
]

/** Returns the full public path for an avatar filename */
function getAvatarPath(filename: string): string {
    return `/avatars/${filename}`
}

interface BackgroundImageSectionProps {
    image: string | null | undefined
    onSaved: () => Promise<void>
}

export const BackgroundImageSection = ({ image, onSaved }: BackgroundImageSectionProps) => {
    const editImageRef = useRef<HTMLDivElement>(null)
    const imageDropdownRef = useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isEnabled, setIsEnabled] = useState(!!image)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (imageDropdownRef.current && !imageDropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleEditImage = () => {
        if (editImageRef.current) {
            editImageRef.current.classList.remove('hidden')
            editImageRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
        setSelectedImage(image ?? '')
    }

    const handleSaveImage = async () => {
        if (!selectedImage) {
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserImage(selectedImage)

            if (result.success) {
                toast.success('Background image updated successfully')
                await onSaved()
                handleCancelEditImage()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error updating background image')
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggle = async (checked: boolean) => {
        if (!checked) {
            try {
                setIsSaving(true)
                const result = await updateUserImage(null)

                if (result.success) {
                    setIsEnabled(false)
                    handleCancelEditImage()
                    toast.success('Background image removed')
                    await onSaved()
                } else {
                    toast.error(result.message)
                }
            } catch {
                toast.error('Error removing background image')
            } finally {
                setIsSaving(false)
            }
        } else {
            setIsEnabled(true)
        }
    }

    const handleCancelEditImage = () => {
        if (editImageRef.current) {
            editImageRef.current.className = 'hidden'
        }
    }

    return (
        <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <Label htmlFor="image" className='font-semibold'>Background Image:</Label>
            <Switch checked={isEnabled} onCheckedChange={handleToggle} disabled={isSaving} />
            {isEnabled && (
                <>
                    {image && (
                        <Image src={image} alt="Background" width={24} height={24} className="size-6 rounded" />
                    )}
                    {!image && <p className="truncate max-w-xs">No image set</p>}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleEditImage}>
                                <Pencil className="size-4" />
                                <span className="sr-only">Edit background image</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit background image</TooltipContent>
                    </Tooltip>
                </>
            )}
            {isEnabled && (
                <div className="flex items-center gap-2">
                    <div ref={editImageRef} className="hidden">
                        <div ref={imageDropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer min-w-48"
                            >
                                {selectedImage ? (
                                    <Image src={selectedImage} alt="" width={32} height={32} className="size-8 rounded" />
                                ) : (
                                    'Select an image'
                                )}
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-input bg-background py-1 text-sm shadow-md">
                                    {AVATAR_IMAGES.map((filename) => {
                                        const path = getAvatarPath(filename)
                                        return (
                                            <li
                                                key={filename}
                                                onClick={() => {
                                                    setSelectedImage(path)
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="flex cursor-pointer items-center justify-center px-3 py-1.5 hover:bg-accent"
                                            >
                                                <Image src={path} alt={filename} width={32} height={32} className="size-8 shrink-0 rounded" />
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleSaveImage} disabled={isSaving}>
                                    <ArrowDownToLine className="size-4" />
                                    <span className="sr-only">Save</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleCancelEditImage}>
                                    <X className='size-4' />
                                    <span className="sr-only">Cancel</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancel</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    )
}