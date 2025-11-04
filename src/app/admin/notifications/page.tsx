
'use client';

import * as React from 'react';
import {
  Bell,
  User,
  Briefcase,
  AlertTriangle,
  Mail,
  ListFilter,
  CheckCheck,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const initialNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    description: 'You have a new message from Sarah Johnson.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'project',
    title: 'Project Update',
    description: 'Mobile App prototype has been approved.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'task',
    title: 'Task Overdue',
    description: '"Finalize branding" is overdue by 2 days.',
    time: '3 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'client',
    title: 'New Client Inquiry',
    description: 'Emily Davis from Quantum Creative has reached out.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'project',
    title: 'Project Completed',
    description: 'Portfolio Website Design for Apex Digital is complete.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 6,
    type: 'message',
    title: 'Follow-up on Data Systems project',
    description: "Chris Brown is ready to move forward. The signed proposal is attached.",
    time: '3 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
    const iconClass = "h-6 w-6";
    switch (type) {
        case 'message': return <Mail className={cn(iconClass, "text-blue-500")} />;
        case 'project': return <Briefcase className={cn(iconClass, "text-purple-500")} />;
        case 'task': return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
        case 'client': return <User className={cn(iconClass, "text-green-500")} />;
        default: return <Bell className={cn(iconClass, "text-zinc-500")} />;
    }
}

type FilterType = 'all' | 'unread' | 'read' | 'message' | 'project' | 'task';

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState(initialNotifications);
    const [filter, setFilter] = React.useState<FilterType>('all');

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
    };

    const clearAll = () => {
        setNotifications([]);
    }

    const filteredNotifications = React.useMemo(() => {
        switch (filter) {
            case 'unread': return notifications.filter(n => !n.read);
            case 'read': return notifications.filter(n => n.read);
            case 'message': return notifications.filter(n => n.type === 'message');
            case 'project': return notifications.filter(n => n.type === 'project');
            case 'task': return notifications.filter(n => n.type === 'task');
            default: return notifications;
        }
    }, [notifications, filter]);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    };

    return (
        <>
            <div className="sticky top-24 z-20 backdrop-blur-md px-4 sm:px-8 py-4 -mx-4 sm:-mx-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="rounded-lg gap-2">
                           <CheckCheck className="h-4 w-4"/> Mark all as read
                        </Button>
                        <Button variant="destructive" size="sm" onClick={clearAll} className="rounded-lg gap-2">
                            <X className="h-4 w-4"/> Clear all
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-4">
                <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                            <TabsList className="bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
                                <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
                                <TabsTrigger value="unread" className="rounded-lg">Unread</TabsTrigger>
                                <TabsTrigger value="read" className="rounded-lg">Read</TabsTrigger>
                                <TabsTrigger value="message" className="rounded-lg hidden sm:flex"><Mail className="h-4 w-4 mr-2"/>Messages</TabsTrigger>
                                <TabsTrigger value="project" className="rounded-lg hidden sm:flex"><Briefcase className="h-4 w-4 mr-2"/>Projects</TabsTrigger>
                                <TabsTrigger value="task" className="rounded-lg hidden sm:flex"><AlertTriangle className="h-4 w-4 mr-2"/>Tasks</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map(notification => (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        variants={itemVariants}
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
                                                <p className="font-semibold text-lg">{notification.title}</p>
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
                                        <p>You have no notifications in this category.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
