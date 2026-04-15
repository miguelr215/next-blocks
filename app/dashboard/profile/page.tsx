'use client';

import { useCallback } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'
import { BackgroundColorSection } from '@/components/profile/BackgroundColorSection'
import { BackgroundImageSection } from '@/components/profile/BackgroundImageSection'
import { NameSection } from '@/components/profile/NameSection'
import { PhoneNumberSection } from '@/components/profile/PhoneNumberSection'
import { EmailSection } from '@/components/profile/EmailSection'
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
    const { data: session, isPending, refetch } = authClient.useSession()

    const handleSaved = useCallback(async () => {
        await refetch({
            query: {
                disableCookieCache: true
            }
        })
    }, [refetch])

    if (isPending) {
        return (
            <section className="mt-4">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </section>
        )
    }

    if (!session) {
        return (
            <section className="mt-4">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="mt-4 text-muted-foreground">Not signed in.</p>
            </section>
        )
    }

    const { name, email, phoneNumber, image, bgColor } = session.user

    return (
        <section className="mt-4">
            <h1 className="text-2xl font-bold">Profile</h1>

            <div className="my-8 flex items-center gap-6">
                <Avatar
                    src={image}
                    name={name}
                    className={`size-20 text-2xl ${bgColor ?? ''}`}
                />
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="text-sm text-muted-foreground">{phoneNumber}</p>
                </div>
            </div>

            <Separator className='mb-6' />

            <BackgroundImageSection image={image} onSaved={handleSaved} />

            <BackgroundColorSection bgColor={bgColor} onSaved={handleSaved} />

            <NameSection name={name} onSaved={handleSaved} />

            <EmailSection email={email} onSaved={handleSaved} />

            <PhoneNumberSection phoneNumber={phoneNumber} onSaved={handleSaved} />
        </section>
    )
}

export default ProfilePage