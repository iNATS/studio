'use client';

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
import { Home, Settings, Briefcase, MessageSquare, Shield, Users, BarChart3, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="bg-background min-h-screen">
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="bg-transparent backdrop-blur-xl border-white/20 text-white"
        >
          <SidebarHeader className="p-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white/80 hover:text-white" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="/admin">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Projects" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="#">
                    <Briefcase />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="#">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Analytics" className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white rounded-lg">
                  <Link href="#">
                    <BarChart3 />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
          <div className="flex-1 w-full h-full p-4 pt-16 sm:p-6 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
