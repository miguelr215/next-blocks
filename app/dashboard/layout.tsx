import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const DashboardLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <section id="dl">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarTrigger />
                    </TooltipTrigger>
                    <TooltipContent>Toggle Sidebar</TooltipContent>
                </Tooltip>
                {children}
            </section>
        </SidebarProvider>
    )
}

export default DashboardLayout