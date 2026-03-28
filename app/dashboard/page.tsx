import Logout from '@/components/logout'
import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
    return (
        <section>
            <h1>My Dashboard</h1>
            <div className="my-8">
                <h2>Active Games</h2>
            </div>
            <div className="my-8">
                <h2>Quick Links</h2>
                <ul className='list-disc ps-4'>
                    <li><Link href="/dashboard/wallet/add-funds" className='text-blue-800 hover:text-blue-600'>Add Funds</Link></li>
                    <li><Link href="/dashboard/profile" className='text-blue-800 hover:text-blue-600'>Change Avatar</Link></li>
                    <li><Link href="/dashboard/change-password" className='text-blue-800 hover:text-blue-600'>Change Password</Link></li>
                </ul>
            </div>
            <Logout />
        </section>
    )
}

export default Dashboard