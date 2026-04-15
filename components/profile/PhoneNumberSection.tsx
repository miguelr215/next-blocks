'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ArrowDownToLine, Pencil, X } from 'lucide-react'
import { updateUserPhoneNumber } from '@/server/users'
import { toast } from 'sonner'

interface PhoneNumberSectionProps {
    phoneNumber: string | null | undefined
    onSaved: () => Promise<void>
}

export const PhoneNumberSection = ({ phoneNumber, onSaved }: PhoneNumberSectionProps) => {
    const editPhoneRef = useRef<HTMLDivElement>(null)
    const phoneInputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleEditPhone = () => {
        if (editPhoneRef.current) {
            editPhoneRef.current.classList.remove('hidden')
            editPhoneRef.current.classList.add('flex', 'items-center', 'gap-2')
        }
    }

    const handleSavePhone = async () => {
        const newPhone = phoneInputRef.current?.value.trim()

        if (!newPhone) {
            return
        }

        const digitsOnly = newPhone.replace(/[^0-9]/g, '')
        if (digitsOnly.length < 10) {
            toast.error('Phone number must contain at least 10 digits')
            return
        }

        try {
            setIsSaving(true)
            const result = await updateUserPhoneNumber(newPhone)

            if (result.success) {
                toast.success('Phone number updated successfully')
                await onSaved()
                handleCancelEditPhone()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error updating phone number')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancelEditPhone = () => {
        if (editPhoneRef.current) {
            editPhoneRef.current.className = 'hidden'
        }
    }

    return (
        <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <Label htmlFor="phoneNumber" className='font-semibold'>Phone Number:</Label>
            <p>{phoneNumber}</p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleEditPhone}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit phone number</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit phone number</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2">
                <div ref={editPhoneRef} className="hidden">
                    <Input
                        ref={phoneInputRef}
                        id="phoneNumber"
                        type="tel"
                        placeholder="New phone number"
                        onKeyDown={(e) => {
                            if (
                                e.key === 'Backspace' ||
                                e.key === 'Delete' ||
                                e.key === 'Tab' ||
                                e.key === 'Escape' ||
                                e.key === 'Enter' ||
                                e.key === 'ArrowLeft' ||
                                e.key === 'ArrowRight' ||
                                e.key === 'Home' ||
                                e.key === 'End' ||
                                e.ctrlKey ||
                                e.metaKey
                            ) {
                                return
                            }
                            if (!/^[0-9\s\-().+]$/.test(e.key)) {
                                e.preventDefault()
                            }
                        }}
                        onPaste={(e) => {
                            const pastedText = e.clipboardData.getData('text')
                            if (/[^0-9\s\-().+]/.test(pastedText)) {
                                e.preventDefault()
                            }
                        }}
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleSavePhone} disabled={isSaving}>
                                <ArrowDownToLine className="size-4" />
                                <span className="sr-only">Save</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer" onClick={handleCancelEditPhone}>
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
