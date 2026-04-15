'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserEmail } from '@/server/users'
import { toast } from 'sonner'

interface EmailSectionProps {
    email: string | null | undefined
    onSaved: () => Promise<void>
}

export const EmailSection = ({ email, onSaved }: EmailSectionProps) => {
    const editEmailRef = useRef<HTMLDivElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleEditEmail = () => {
        if (editEmailRef.current) {
            editEmailRef.current.classList.remove('hidden')
            editEmailRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
    }

    const handleSaveEmail = async () => {
        const newEmail = emailInputRef.current?.value.trim()

        if (!newEmail) {
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newEmail)) {
            toast.error('Please enter a valid email address')
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserEmail(newEmail)

            if (result.success) {
                toast.success('Email updated successfully')
                await onSaved()
                handleCancelEditEmail()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error updating email')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancelEditEmail = () => {
        if (editEmailRef.current) {
            editEmailRef.current.className = 'hidden'
        }
    }

    return (
        <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <Label htmlFor="email" className='font-semibold'>Email:</Label>
            <p>{email}</p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleEditEmail}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit email</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit email</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2">
                <div ref={editEmailRef} className="hidden">
                    <Input
                        ref={emailInputRef}
                        id="email"
                        type="email"
                        placeholder="New email"
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleSaveEmail} disabled={isSaving}>
                                <ArrowDownToLine className="size-4" />
                                <span className="sr-only">Save</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleCancelEditEmail}>
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