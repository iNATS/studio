
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, User, Briefcase, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const notifications = [
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
    switch (type) {
        case 'message': return <User className="h-5 w-5 text-blue-500" />;
        case 'project': return <Briefcase className="h-5 w-5 text-purple-500" />;
        case 'task': return <AlertTriangle className="h-5 w-5 text-red-500" />;
        case 'client': return <User className="h-5 w-5 text-green-500" />;
        default: return <Bell className="h-5 w-5 text-zinc-500" />;
    }
}

export default function NotificationsPage() {
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

  return (
    <main className="flex flex-col h-full">
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>
      <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-4 mt-6">
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${!notification.read ? 'bg-blue-500/5' : ''}`}
                >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                    </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                   {!notification.read && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-2"></div>}
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
