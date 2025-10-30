
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
  SidebarMenuSub,
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SheetTitle,
} from '@/components/ui/sidebar';
import { Home, Settings, Briefcase, Shield, Users, BarChart3, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/workspace/meeting-room', label: 'Communications', icon: Users },
    {  
      label: 'Workspace', icon: LayoutGrid, 
      subItems: [
        { href: '/admin/workspace/clients', label: 'Clients' },
        { href: '/admin/workspace/tasks', label: 'Tasks' },
        { href: '/admin/workspace/projects', label: 'Projects' },
      ]
    },
    {  
      label: 'Portfolio', icon: Briefcase,
      subItems: [
        { href: '/admin/projects', label: 'My Works' },
        { href: '/admin/portfolio/page-content', label: 'Page Content' },
      ]
    },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="bg-background min-h-screen h-screen flex">
       <SidebarProvider>
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="bg-background/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-border/40 dark:border-white/10 text-foreground"
        >
           <SheetTitle className="hidden">Sidebar</SheetTitle>
          <SidebarHeader className="p-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-zinc-600 dark:text-white/80 hover:text-foreground dark:hover:text-white" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarMenu>
              {navItems.map((item) => {
                  const Icon = item.icon;

                  if (item.subItems) {
                    const isSubActive = item.subItems.some(subItem => pathname.startsWith(subItem.href));
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger 
                            className="text-zinc-600 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white data-[active=true]:bg-black/10 dark:data-[active=true]:bg-white/20 data-[active=true]:text-foreground dark:data-[active=true]:text-white rounded-lg" 
                            data-active={isSubActive}
                          >
                            <Icon />
                            <span>{item.label}</span>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            {item.subItems.map(subItem => {
                                const SubIcon = Users; // Just an example for icon variety
                                return (
                                <SidebarMenuSubItem key={subItem.href}>
                                    <SidebarMenuSubButton asChild data-active={pathname === subItem.href}>
                                    <Link href={subItem.href}>{subItem.label}</Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                )
                            })}
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    )
                  }
                  
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.label} 
                          className="text-zinc-600 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white data-[active=true]:bg-black/10 dark:data-[active=true]:bg-white/20 data-[active=true]:text-foreground dark:data-[active=true]:text-white rounded-lg"
                          data-active={isActive}
                        >
                        <Link href={item.href!}>
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
                <SidebarMenuButton asChild tooltip="Settings" className="text-zinc-600 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white rounded-lg" data-active={pathname === '/admin/settings'}>
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Security" className="text-zinc-600 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white rounded-lg">
                  <Link href="#">
                    <Shield />
                    <span>Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ThemeToggle />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col h-full">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger />
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                </header>
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
