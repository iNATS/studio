
'use client';

import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Briefcase,
  Shield,
  Users,
  BarChart3,
  LayoutGrid,
  Menu,
  Gem,
  Bell,
  User,
  AlertTriangle,
  CheckCheck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

const initialNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    description: 'You have a new message from Sarah Johnson.',
    time: '5 minutes ago',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    read: false,
  },
  {
    id: 2,
    type: 'project',
    title: 'Project Update',
    description: 'Mobile App prototype has been approved.',
    time: '1 hour ago',
    avatar: 'https://picsum.photos/seed/project/100/100',
    read: false,
  },
  {
    id: 3,
    type: 'task',
    title: 'Task Overdue',
    description: '"Finalize branding" is overdue by 2 days.',
    time: '3 hours ago',
    avatar: 'https://picsum.photos/seed/task/100/100',
    read: false,
  },
    {
    id: 4,
    type: 'client',
    title: 'New Client Inquiry',
    description: 'Emily Davis from Quantum Creative has reached out.',
    time: '1 day ago',
    avatar: 'https://picsum.photos/seed/emily/100/100',
    read: true,
  },
  {
    id: 5,
    type: 'project',
    title: 'Project Completed',
    description: 'Portfolio Website Design for Apex Digital is complete.',
    time: '2 days ago',
    avatar: 'https://picsum.photos/seed/apex/100/100',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
    const iconClass = "h-6 w-6";
    switch (type) {
        case 'message': return <User className={cn(iconClass, "text-blue-500")} />;
        case 'project': return <Briefcase className={cn(iconClass, "text-purple-500")} />;
        case 'task': return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
        case 'client': return <User className={cn(iconClass, "text-green-500")} />;
        default: return <Bell className={cn(iconClass, "text-zinc-500")} />;
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
    
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const clearAll = () => {
      setNotifications([]);
  }

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

  const NavLink = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    if (item.subItems) {
      const isSubActive = item.subItems.some((subItem: any) => pathname.startsWith(subItem.href));
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2 text-sm font-medium",
                isSubActive && "bg-foreground/10 text-foreground",
                isMobile && "w-full justify-start rounded-md text-lg h-auto py-3"
              )}
            >
              <Icon className={cn("h-5 w-5", isMobile && "mr-4")} />
              {item.label}
              {!isMobile && <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
            {item.subItems.map((subItem: any) => (
              <DropdownMenuItem key={subItem.href} asChild>
                <Link href={subItem.href}>{subItem.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    return (
      <Button
        variant="ghost"
        asChild
        className={cn(
          "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2 text-sm font-medium",
          isActive && "bg-foreground/10 text-foreground",
          isMobile && "w-full justify-start rounded-md text-lg h-auto py-3"
        )}
      >
        <Link href={item.href}>
          <Icon className={cn("h-5 w-5", isMobile && "mr-4")} />
          {item.label}
        </Link>
      </Button>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-fit mx-auto">
        <div className="flex items-center justify-between p-2 rounded-full shadow-lg backdrop-blur-lg bg-background/70 dark:bg-background/50 border border-foreground/10">
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => <NavLink key={item.label} item={item} />)}
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                        <span className="sr-only">Notifications</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md bg-background/90 backdrop-blur-xl p-0">
                    <SheetHeader className="p-4 border-b border-border">
                        <SheetTitle className="flex justify-between items-center">
                            <span>Notifications</span>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="rounded-lg gap-1 text-xs">
                                   <CheckCheck className="h-4 w-4"/> Mark all as read
                                </Button>
                                <Button variant="ghost" size="sm" onClick={clearAll} className="rounded-lg gap-1 text-xs">
                                    <X className="h-4 w-4"/> Clear
                                </Button>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-4.5rem)]">
                        <div className="p-4 space-y-3">
                             <AnimatePresence>
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onClick={() => markAsRead(notification.id)}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border",
                                            notification.read 
                                                ? "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5" 
                                                : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
                                        )}
                                    >
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-base">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                                        </div>
                                        {!notification.read && <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500 mt-2.5"></div>}
                                    </motion.div>
                                ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16 text-muted-foreground"
                                    >
                                        <Bell className="mx-auto h-12 w-12 mb-4 text-zinc-400 dark:text-zinc-600"/>
                                        <h3 className="text-lg font-semibold">All caught up!</h3>
                                        <p>You have no notifications.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj" alt="@shadcn" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mohamed Aref</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      m.aref@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="#"><Shield className="mr-2 h-4 w-4" /><span>Security</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] bg-background/90 backdrop-blur-xl">
                 <div className="flex flex-col pt-12">
                    <nav className="flex flex-col items-start space-y-2 text-lg font-medium">
                        {navItems.map((item) => (
                           <div key={item.label} className="w-full" onClick={() => setOpen(false)}>
                                <NavLink item={item} isMobile />
                            </div>
                        ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
          {children}
      </div>
    </div>
  );
}

const ChevronDown = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
)

    