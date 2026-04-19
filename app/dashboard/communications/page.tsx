'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const CommunicationsPage = () => {
    const [isMarketingEnabled, setIsMarketingEnabled] = useState(false)
    const [isNewProdsEnabled, setIsNewProdsEnabled] = useState(false)

    const handleMarketingToggle = (checked: boolean): void => {
        console.log('Marketing toggle clicked:', checked)
        setIsMarketingEnabled(checked)
    }

    const handleNewProdsToggle = (checked: boolean): void => {
        console.log('New products toggle clicked:', checked)
        setIsNewProdsEnabled(checked)
    }

    return (
        <section className='mt-4'>
            <h1 className="text-2xl font-bold">Communications</h1>

            <div className="my-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Switch checked={isMarketingEnabled} onCheckedChange={handleMarketingToggle} className='cursor-pointer' />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{isMarketingEnabled ? 'Disable marketing communications' : 'Enable marketing communications'}</TooltipContent>
                </Tooltip>
                <div>
                    <Label className='font-semibold'>Marketing Communications</Label>
                    <p className='text-xs'>Description for marketing communications</p>
                </div>
            </div>
            <div className="mb-6 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Switch checked={isNewProdsEnabled} onCheckedChange={handleNewProdsToggle} className='cursor-pointer' />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{isNewProdsEnabled ? 'Disable new products communications' : 'Enable new products communications'}</TooltipContent>
                </Tooltip>
                <div>
                    <Label className='font-semibold'>New Products Communications</Label>
                    <p className='text-xs'>Description for new products communications</p>
                </div>
            </div>
        </section>
    )
}

export default CommunicationsPage