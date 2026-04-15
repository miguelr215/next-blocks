'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserBgColor } from '@/server/users'
import { toast } from 'sonner'

const BG_COLORS = [
    'bg-primary', 'bg-red-500', 'bg-red-700', 'bg-red-900',
    'bg-orange-500', 'bg-orange-700', 'bg-orange-900',
    'bg-yellow-500', 'bg-yellow-700', 'bg-yellow-900',
    'bg-lime-500', 'bg-lime-700', 'bg-lime-900',
    'bg-green-500', 'bg-green-700', 'bg-green-900',
    'bg-cyan-500', 'bg-cyan-700', 'bg-cyan-900',
    'bg-blue-500', 'bg-blue-700', 'bg-blue-900',
    'bg-violet-500', 'bg-violet-700', 'bg-violet-900',
    'bg-purple-500', 'bg-purple-700', 'bg-purple-900',
    'bg-pink-500', 'bg-pink-700', 'bg-pink-900',
]

interface BackgroundColorSectionProps {
    bgColor: string | null | undefined
    onSaved: () => Promise<void>
}

export const BackgroundColorSection = ({ bgColor, onSaved }: BackgroundColorSectionProps) => {
    const editBgColorRef = useRef<HTMLDivElement>(null)
    const bgColorDropdownRef = useRef<HTMLDivElement>(null)
    const [selectedBgColor, setSelectedBgColor] = useState('')
    const [isBgColorOpen, setIsBgColorOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (bgColorDropdownRef.current && !bgColorDropdownRef.current.contains(e.target as Node)) {
                setIsBgColorOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleEditBgColor = () => {
        if (editBgColorRef.current) {
            editBgColorRef.current.classList.remove('hidden')
            editBgColorRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
        setSelectedBgColor(bgColor ?? '')
    }

    const handleSaveBgColor = async () => {
        if (!selectedBgColor) {
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserBgColor(selectedBgColor)

            if (result.success) {
                toast.success('Background color updated successfully')
                await onSaved()
                handleCancelEditBgColor()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error updating background color')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancelEditBgColor = () => {
        if (editBgColorRef.current) {
            editBgColorRef.current.className = 'hidden'
        }
    }

    return (
        <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <Label className='font-semibold'>Background Color:</Label>
            <div className={`size-4 rounded-full ${bgColor ?? ''}`} />
            <p>{bgColor}</p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleEditBgColor}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit background color</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit background color</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2">
                <div ref={editBgColorRef} className="hidden">
                    <div ref={bgColorDropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsBgColorOpen((prev) => !prev)}
                            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer min-w-40"
                        >
                            {selectedBgColor ? (
                                <>
                                    <span className={`size-3 rounded-full ${selectedBgColor}`} />
                                    {selectedBgColor}
                                </>
                            ) : (
                                'Select a color'
                            )}
                        </button>
                        {isBgColorOpen && (
                            <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-input bg-background py-1 text-sm shadow-md">
                                {BG_COLORS.map((color) => (
                                    <li
                                        key={color}
                                        onClick={() => {
                                            setSelectedBgColor(color)
                                            setIsBgColorOpen(false)
                                        }}
                                        className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:text-white hover:${color}`}
                                    >
                                        <span className={`size-3 shrink-0 rounded-full ${color}`} />
                                        {color}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleSaveBgColor} disabled={isSaving}>
                                <ArrowDownToLine className="size-4" />
                                <span className="sr-only">Save</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleCancelEditBgColor}>
                                <X className='size-4' />
                                <span className="sr-only">Cancel</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
