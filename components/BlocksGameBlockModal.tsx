"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { addUserIdToBlock } from "@/server/blocks"

interface BlocksGameBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    blockId: string;
    blocksGameId: string;
    blockPrice: string;
    userId: string;
    league: string;
    event: string;
}

const BlocksGameBlockModal = ({
    isOpen,
    onClose,
    blockId,
    blocksGameId,
    blockPrice,
    userId,
    league,
    event,
}: BlocksGameBlockModalProps) => {
    const router = useRouter()
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handlePurchase = async () => {
        setIsPurchasing(true)
        setErrorMessage(null)

        try {
            const result = await addUserIdToBlock(blockId, blockPrice, userId, blocksGameId)

            if (!result.success) {
                setErrorMessage(result.message)
                return
            }

            router.refresh()
            onClose()
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "An unexpected error occurred"
            )
        } finally {
            setIsPurchasing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Purchase Block</DialogTitle>
                    <DialogDescription>
                        Review the block details below and confirm your purchase.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Game ID</span>
                        <span className="font-medium">{blocksGameId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">League</span>
                        <span className="font-medium">{league.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Event</span>
                        <span className="font-medium">{event}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Block Price</span>
                        <span className="font-medium">${blockPrice}</span>
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                )}

                <DialogFooter className="gap-2 sm:justify-between">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPurchasing} className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="button" onClick={handlePurchase} disabled={isPurchasing} className="cursor-pointer hover:bg-green-800">
                        {isPurchasing ? "Purchasing…" : `Purchase — $${blockPrice}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BlocksGameBlockModal