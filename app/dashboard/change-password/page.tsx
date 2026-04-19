import ChangePasswordSection from '@/components/change-password/ChangePasswordSection'
import React from 'react'

const ChangePasswordPage = () => {
    return (
        <section className='mt-4'>
            <h1 className="text-2xl font-bold">Change Password</h1>
            <p className="text-muted-foreground mt-1 text-sm">
                Password must be at least 8 characters long.
            </p>

            <ChangePasswordSection />
        </section>
    )
}

export default ChangePasswordPage