import { cn } from '@/lib/utils';

interface BlocksGameBlockProps {
    block: {
        id: string;
        isPurchased: boolean;
        blockPrice: string;
        xCoordinate: number;
        yCoordinate: number;
        homeTeamScore: number;
        awayTeamScore: number;
        userId: string | null;
    };
}

const BlocksGameBlock = ({ block }: BlocksGameBlockProps) => {
    return (
        <div
            className={cn(
                'aspect-square flex items-center justify-center border border-gray-300 text-xs rounded-sm cursor-pointer transition-colors duration-200',
                block.isPurchased
                    ? 'bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            title={block.isPurchased ? 'Purchased' : `$${block.blockPrice}`}
        >
            {block.isPurchased ? '✓' : ''}
        </div>
    );
};

export default BlocksGameBlock;