'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    User,
    KeyRound,
    Settings,
    Mail,
    Gamepad2,
    Plus,
    History,
    ArrowDownToLine,
    ArrowUpFromLine,
    CreditCard,
    LogOut,
    HeartHandshake,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { authClient } from "@/lib/auth-client"

const myAccountLinks = [
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: User,
    },
    {
        name: 'Change Password',
        href: '/dashboard/change-password',
        icon: KeyRound,
    },
    {
        name: 'Gambling Settings',
        href: '/dashboard/gambling-settings',
        icon: Settings,
    },
    {
        name: 'Communications',
        href: '/dashboard/communications',
        icon: Mail,
    },
    {
        name: 'Friends',
        href: '/dashboard/friends',
        icon: HeartHandshake,
    },
]

const myGamesLinks = [
    {
        name: 'My Games',
        href: '/dashboard/my-games',
        icon: Gamepad2,
    },
    {
        name: 'Create a Private Game',
        href: '/dashboard/create-game',
        icon: Plus,
    },
    {
        name: 'Games History',
        href: '/dashboard/games-history',
        icon: History,
    },
]

const walletLinks = [
    {
        name: 'Add Funds',
        href: '/dashboard/wallet/add-funds',
        icon: ArrowDownToLine,
    },
    {
        name: 'Withdraw Funds',
        href: '/dashboard/wallet/withdraw',
        icon: ArrowUpFromLine,
    },
    {
        name: 'Edit Payment Methods',
        href: '/dashboard/wallet/payment-methods',
        icon: CreditCard,
    },
]

interface SidebarSection {
    label: string
    links: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const sidebarSections: SidebarSection[] = [
    { label: 'My Account', links: myAccountLinks },
    { label: 'My Games', links: myGamesLinks },
    { label: 'Wallet', links: walletLinks },
]

const DashboardSidebar = () => {
    const router = useRouter()
    const { data: session } = authClient.useSession()

    const handleLogout = async () => {
        await authClient.signOut()
        router.push('/')
    }

    return (
        <Sidebar className="top-20 md:top-25 lg:top-26.75 h-[calc(100svh-5rem)] md:h-[calc(100svh-6.25rem)] lg:h-[calc(100svh-6.6875rem)]" collapsible="icon">
            <SidebarHeader />
            <SidebarContent>
                {sidebarSections.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.links.map((link) => (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton asChild tooltip={link.name}>
                                            <Link href={link.href}>
                                                <link.icon className="size-4" />
                                                <span>{link.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Avatar
                            src={session?.user.image}
                            name={session?.user.name}
                            className={`size-8 ${session?.user.bgColor ?? ''}`}
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {session?.user.name ?? 'Guest'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {session?.user.email ?? ''}
                            </p>
                        </div>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="size-4" />
                                <span className="sr-only">Logout</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Logout</TooltipContent>
                    </Tooltip>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar