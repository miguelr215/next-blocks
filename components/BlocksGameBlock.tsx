"use client"

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import BlocksGameBlockModal from './BlocksGameBlockModal';
import type { BlockWithUser } from '@/lib/types';

interface BlocksGameBlockProps {
    block: BlockWithUser;
    blocksGameId: string;
    userId: string;
    league: string;
    event: string;
}

const BlocksGameBlock = ({ block, blocksGameId, userId, league, event }: BlocksGameBlockProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (block.isPurchased) {
        return (
            <div
                className={cn(
                    'aspect-square flex items-center justify-center border border-gray-300 text-lg rounded-sm transition-colors duration-200',
                    'bg-green-200 dark:bg-green-800'
                )}
                title={`Purchased by ${block.userName ?? 'Unknown'}`}
            >
                <Avatar
                    src={block.userImage}
                    name={block.userName ?? '?'}
                    className="size-full rounded-sm p-1 md:p-2"
                />
            </div>
        );
    }

    return (
        <>
            <div
                className={cn(
                    'aspect-square flex items-center justify-center border border-gray-300 text-xs rounded-sm cursor-pointer transition-colors duration-200',
                    'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
                title={`$${block.blockPrice}`}
                onClick={() => setIsModalOpen(true)}
            >
                Buy
            </div>

            <BlocksGameBlockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                blockId={block.id}
                blocksGameId={blocksGameId}
                blockPrice={block.blockPrice}
                userId={userId}
                league={league}
                event={event}
            />
        </>
    );
};

export default BlocksGameBlock;