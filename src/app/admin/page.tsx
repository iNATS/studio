
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, ListTodo, Users, AlertTriangle, ArrowRight, CalendarClock, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow, isPast, isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { getDashboardData } from '@/lib/db';

interface DashboardData {
    activeProjectsCount: number;
    pendingTasksCount: number;
    newClientsCount: number;
    overdueTasksCount: number;
    upcomingDeadlines: any[];
    activeProjects: any[];
    recentClients: any[];
}

export default function AdminDashboard() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
      setLoading(false);
    }
    fetchData();
  }, []);
    
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

  if (loading || !data) {
    return (
        <main className="flex flex-col h-full">
            <div className="sticky top-0 z-10 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
             <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-4 mt-6">
                <p>Loading...</p>
             </div>
        </main>
    );
  }
  
  return (
    <main className="flex flex-col h-full">
        <div className="sticky top-0 z-20 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-4 mt-6">
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Active Projects</CardTitle>
                  <Briefcase className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{data.activeProjectsCount}</div>
                  <Link href="/admin/workspace/projects" className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1">View projects <ArrowRight className="h-3 w-3" /></Link>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">Pending Tasks</CardTitle>
                <ListTodo className="h-5 w-5 text-zinc-500 dark:text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.pendingTasksCount}</div>
                <Link href="/admin/workspace/tasks" className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1">Manage tasks <ArrowRight className="h-3 w-3" /></Link>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600 dark:text-white/70">New Clients</CardTitle>
                <Users className="h-5 w-5 text-zinc-500 dark:text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.newClientsCount}</div>
                 <Link href="/admin/workspace/clients" className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1">View clients <ArrowRight className="h-3 w-3" /></Link>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
            <Card className="bg-red-500/10 dark:bg-red-500/10 backdrop-blur-2xl border-red-400/20 dark:border-red-400/20 shadow-xl rounded-2xl transition-all duration-300 hover:border-red-400/30 dark:hover:border-red-400/30 hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-500 dark:text-red-300">Overdue Tasks</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600 dark:text-red-400">{data.overdueTasksCount}</div>
                <p className="text-xs text-red-600/80 dark:text-red-400/70">{data.overdueTasksCount > 0 ? "Action required" : "All tasks on track"}</p>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid gap-6 lg:grid-cols-3 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <Button variant="ghost" size="sm" asChild className="rounded-lg">
                    <Link href="/admin/workspace/projects">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </CardHeader>
              <CardContent className="grid gap-6">
                {data.activeProjects.map(project => {
                    const startDate = new Date(project.startDate);
                    const endDate = new Date(project.endDate);
                    const totalDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
                    const daysPassed = Math.max(0, (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
                    const progress = Math.min(100, (daysPassed / totalDays) * 100);
                    return (
                        <div key={project.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{project.title}</span>
                                {project.client && <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/60">
                                    <Avatar className="h-6 w-6"><AvatarImage src={project.client.avatar}/><AvatarFallback>{project.client.name.charAt(0)}</AvatarFallback></Avatar>
                                    {project.client.company}
                                    </div>}
                            </div>
                            <Progress value={progress} className="h-2 bg-black/10 dark:bg-white/10" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
                            <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-white/50">
                                <span>{Math.round(progress)}% complete</span>
                                <span>Due in {formatDistanceToNow(endDate)}</span>
                            </div>
                        </div>
                    )
                })}
              </CardContent>
            </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5"/>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.upcomingDeadlines.map((task) => {
                        const dueDate = new Date(task.dueDate);
                        return (
                            <div key={task.id} className="flex items-start gap-4 hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors">
                                <div className="flex-1">
                                <p className="text-sm font-semibold">{task.title}</p>
                                <p className="text-xs text-zinc-600 dark:text-white/50">{task.projectTitle || 'General Task'}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">{formatDistanceToNow(dueDate, { addSuffix: true })}</span>
                                    <p className="text-xs text-zinc-500 dark:text-white/50">{dueDate.toLocaleDateString()}</p>
                                </div>
                            </div>
                        )
                    })}
                     {data.upcomingDeadlines.length === 0 && <p className="text-sm text-zinc-500 dark:text-white/50 text-center py-8">No upcoming deadlines. Great job!</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

           <motion.div 
              className="grid gap-6 lg:grid-cols-3 mt-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
            <motion.div variants={itemVariants}>
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5"/>Recent Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.recentClients.map(client => (
                            <div key={client.id} className="flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors">
                                <Avatar className="h-10 w-10 border-2 border-zinc-200 dark:border-white/20">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{client.name}</p>
                                    <p className="text-xs text-zinc-600 dark:text-white/50">{client.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            </motion.div>
           </motion.div>
        </div>
    </main>
  );
}
