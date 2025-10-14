'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, Settings, Briefcase, Shield, Users, BarChart3, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '#', label: 'Users', icon: Users },
    { href: '#', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-background min-h-screen">
       <SidebarProvider>
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="bg-white/5 backdrop-blur-2xl border-white/10 text-white/90"
        >
          <SidebarHeader className="p-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white/80 hover:text-white" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarMenu>
              {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                        asChild 
                        tooltip={item.label} 
                        className={cn("text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg")}
                        data-active={isActive}
                        >
                        <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="#">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Security" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="#">
                    <Shield />
                    <span>Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="fixed top-0 left-0 right-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-white/10 bg-background/50 px-4 backdrop-blur-md md:hidden">
                <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span>Dashboard</span>
                </Link>
                <SidebarTrigger className="text-white/80 hover:text-white" />
            </header>
          <div className="flex-1 w-full h-full p-4 pt-20 sm:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
