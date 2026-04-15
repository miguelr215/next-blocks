'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserImage } from '@/server/users'
import { toast } from 'sonner'

interface BackgroundImageSectionProps {
    image: string | null | undefined
    onSaved: () => Promise<void>
}

export const BackgroundImageSection = ({ image, onSaved }: BackgroundImageSectionProps) => {
    const editImageRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isEnabled, setIsEnabled] = useState(!!image)

    const handleEditImage = () => {
        if (editImageRef.current) {
            editImageRef.current.classList.remove('hidden')
            editImageRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
    }

    const handleSaveImage = async () => {
        const newImage = imageInputRef.current?.value.trim()

        if (!newImage) {
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserImage(newImage)

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
                    <p className="truncate max-w-xs">{image ?? 'No image set'}</p>
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
                        <Input
                            ref={imageInputRef}
                            id="image"
                            type="text"
                            placeholder="New image URL"
                        />
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