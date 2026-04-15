'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserName } from '@/server/users'
import { toast } from 'sonner'

interface NameSectionProps {
    name: string | null | undefined
    onSaved: () => Promise<void>
}

export const NameSection = ({ name, onSaved }: NameSectionProps) => {
    const editNameRef = useRef<HTMLDivElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleEditName = () => {
        if (editNameRef.current) {
            editNameRef.current.classList.remove('hidden')
            editNameRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
    }

    const handleSaveName = async () => {
        const newName = nameInputRef.current?.value.trim()

        if (!newName) {
            return
        }

        if (newName.length < 2) {
            toast.error('Name must be at least 2 characters')
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserName(newName)

            if (result.success) {
                toast.success('Name updated successfully')
                await onSaved()
                handleCancelEditName()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error updating name')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancelEditName = () => {
        if (editNameRef.current) {
            editNameRef.current.className = 'hidden'
        }
    }

    return (
        <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <Label htmlFor="name" className='font-semibold'>Name:</Label>
            <p>{name}</p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleEditName}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit name</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit name</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2">
                <div ref={editNameRef} className="hidden">
                    <Input
                        ref={nameInputRef}
                        id="name"
                        type="text"
                        placeholder="New name"
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleSaveName} disabled={isSaving}>
                                <ArrowDownToLine className="size-4" />
                                <span className="sr-only">Save</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleCancelEditName}>
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