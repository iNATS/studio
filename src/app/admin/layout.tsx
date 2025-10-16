
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
} from '@/components/ui/sidebar';
import { Home, Settings, Briefcase, Shield, Users, BarChart3, LayoutGrid, Contact } from 'lucide-react';
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
    {  
      label: 'Portfolio', icon: Briefcase,
      subItems: [
        { href: '/admin/projects', label: 'My Works' },
        { href: '/admin/portfolio/page-content', label: 'Page Content' },
      ]
    },
    {  
      label: 'CRM', icon: Contact, 
      subItems: [
        { href: '/admin/crm/clients', label: 'Clients' },
        { href: '/admin/crm/tasks', label: 'Tasks' },
        { href: '/admin/crm/run-projects', label: 'Projects' },
        { href: '/admin/crm/deadline', label: 'Deadline' },
      ]
    },
  ];

  return (
    <div className="bg-background min-h-screen h-screen flex">
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

                  if (item.subItems) {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                            <Icon />
                            <span>{item.label}</span>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            {item.subItems.map(subItem => (
                               <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton asChild data-active={pathname === subItem.href}>
                                  <Link href={subItem.href}>{subItem.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                        asChild 
                        tooltip={item.label} 
                        className={cn("text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg")}
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
            <div className="flex flex-col h-full">
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
