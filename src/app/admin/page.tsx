
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, ListTodo, Users, AlertTriangle, ArrowRight, CalendarClock, UserPlus, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { initialProjects } from './workspace/data';
import { initialTasks } from './workspace/data';
import { clientsData } from './workspace/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow, differenceInCalendarDays, isPast, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Project } from './workspace/projects/page';


const activeProjectsCount = initialProjects.filter(p => p.status === 'in-progress').length;
const pendingTasksCount = initialTasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
const newClientsCount = clientsData.filter(c => c.status === 'new').length;
const overdueTasksCount = initialTasks.filter(t => t.dueDate && isPast(t.dueDate) && t.status !== 'done').length;

const upcomingDeadlines = initialTasks
  .filter(t => t.status !== 'done' && t.dueDate && t.dueDate >= new Date())
  .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
  .slice(0, 5);

const activeProjects = initialProjects
  .filter(p => p.status === 'in-progress')
  .slice(0, 4);

const recentClients = clientsData
  .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
  .slice(0, 5);

const ProjectsTimelineChart = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const projectsInView = initialProjects
        .filter(p => p.startDate <= monthEnd && p.endDate >= monthStart && p.status === 'in-progress')
        .slice(0, 6);

    const getProjectColor = (projectId: string) => {
        const colors = [
          'from-cyan-400 to-blue-500', 'from-sky-400 to-indigo-500', 'from-violet-400 to-fuchsia-500',
          'from-purple-400 to-pink-500', 'from-rose-400 to-red-500', 'from-orange-400 to-amber-500',
          'from-lime-400 to-green-500',
        ];
        const hash = projectId.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-x-2 text-xs text-center text-white/50" style={{gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(0, 1fr))`}}>
                {daysInMonth.map(day => (
                    <div key={day.toISOString()} className={cn("relative h-6 flex items-center justify-center", isToday(day) && "text-blue-300")}>
                        {format(day, 'd')}
                        {isToday(day) && <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-300"></span>}
                    </div>
                ))}
            </div>
            <div className="relative space-y-2">
                {projectsInView.map((project, index) => {
                    const startDay = Math.max(1, differenceInCalendarDays(project.startDate, monthStart) + 1);
                    const endDay = Math.min(daysInMonth.length, differenceInCalendarDays(project.endDate, monthStart) + 1);
                    if (endDay < 1 || startDay > daysInMonth.length) return null;

                    const gridColumn = `${Math.max(1, startDay)} / ${Math.min(daysInMonth.length + 1, endDay + 1)}`;
                    const colorClass = getProjectColor(project.id);
                    
                    return (
                        <div key={project.id} className="h-10 flex items-center relative rounded-lg" style={{ gridColumn: gridColumn, gridRow: index + 1}}>
                           <div className={cn("absolute inset-0 bg-gradient-to-r rounded-lg opacity-20", colorClass)}></div>
                           <div className={cn("absolute inset-0 rounded-lg border", "border-cyan-400/30")}></div>
                           <p className="font-semibold text-white/90 text-sm truncate pl-3">{project.title}</p>
                        </div>
                    );
                })}
                 <div 
                    className="grid gap-x-2 h-full absolute inset-0 -z-10" 
                    style={{gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(0, 1fr))`}}
                 >
                    {daysInMonth.map(day => (
                        <div key={day.toISOString()} className={cn("border-r border-white/5 last:border-r-0", isToday(day) && "bg-blue-500/10")}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default function AdminDashboard() {
  return (
    <main className="flex flex-col h-full pt-4">
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Projects</CardTitle>
            <Briefcase className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{activeProjectsCount}</div>
            <Link href="/admin/workspace/projects" className="text-xs text-blue-400 hover:underline flex items-center gap-1">View projects <ArrowRight className="h-3 w-3" /></Link>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pending Tasks</CardTitle>
            <ListTodo className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{pendingTasksCount}</div>
            <Link href="/admin/workspace/tasks" className="text-xs text-blue-400 hover:underline flex items-center gap-1">Manage tasks <ArrowRight className="h-3 w-3" /></Link>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">New Clients</CardTitle>
            <Users className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{newClientsCount}</div>
             <Link href="/admin/workspace/clients" className="text-xs text-blue-400 hover:underline flex items-center gap-1">View clients <ArrowRight className="h-3 w-3" /></Link>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 backdrop-blur-2xl border-red-400/20 shadow-xl rounded-2xl transition-all duration-300 hover:border-red-400/30 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-300">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-400">{overdueTasksCount}</div>
            <p className="text-xs text-red-400/70">{overdueTasksCount > 0 ? "Action required" : "All tasks on track"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white/90">Active Projects</CardTitle>
            <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <Link href="/admin/workspace/projects">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            {activeProjects.map(project => {
                const totalDays = differenceInCalendarDays(project.endDate, project.startDate) || 1;
                const daysPassed = differenceInCalendarDays(new Date(), project.startDate);
                const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
                const client = clientsData.find(c => c.id === project.clientId);
                return (
                    <div key={project.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-white/90">{project.title}</span>
                            {client && <div className="flex items-center gap-2 text-sm text-white/60">
                                <Avatar className="h-6 w-6"><AvatarImage src={client.avatar}/><AvatarFallback>{client.name.charAt(0)}</AvatarFallback></Avatar>
                                {client.company}
                                </div>}
                        </div>
                        <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
                        <div className="flex justify-between items-center text-xs text-white/50">
                            <span>{Math.round(progress)}% complete</span>
                            <span>Due in {formatDistanceToNow(project.endDate)}</span>
                        </div>
                    </div>
                )
            })}
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2"><CalendarClock className="h-5 w-5"/>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((task) => {
                    const project = initialProjects.find(p => p.id === (initialTasks.find(t => t.id === task.id)?.clientId));
                    return (
                        <div key={task.id} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors">
                            <div className="flex-1">
                            <p className="text-sm text-white/90 font-semibold">{task.title}</p>
                            <p className="text-xs text-white/50">{project?.title || 'General Task'}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className="text-sm font-semibold text-blue-300">{formatDistanceToNow(task.dueDate!, { addSuffix: true })}</span>
                                <p className="text-xs text-white/50">{task.dueDate!.toLocaleDateString()}</p>
                            </div>
                        </div>
                    )
                })}
                 {upcomingDeadlines.length === 0 && <p className="text-sm text-white/50 text-center py-8">No upcoming deadlines. Great job!</p>}
              </div>
            </CardContent>
          </Card>
      </div>

       <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2"><UserPlus className="h-5 w-5"/>Recent Clients</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentClients.map(client => (
                        <div key={client.id} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-lg -m-2 transition-colors">
                            <Avatar className="h-10 w-10 border-2 border-white/20">
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-white/90">{client.name}</p>
                                <p className="text-xs text-white/50">{client.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white/90">Projects Timeline</CardTitle>
            <CardDescription className="text-white/60">A visual overview of your active project schedules for this month.</CardDescription>
          </CardHeader>
           <CardContent>
              <ProjectsTimelineChart />
          </CardContent>
        </Card>
       </div>
    </main>
  );
}

