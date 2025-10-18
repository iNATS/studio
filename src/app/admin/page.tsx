
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ListTodo, Users, AlertTriangle, ArrowRight, CalendarClock, UserPlus, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { initialProjects } from './workspace/data';
import { initialTasks } from './workspace/data';
import { clientsData } from './workspace/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, differenceInCalendarDays, isBefore, addDays } from 'date-fns';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Task } from './workspace/tasks/page';

const activeProjectsCount = initialProjects.filter(p => p.status === 'in-progress').length;
const pendingTasksCount = initialTasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
const newClientsCount = clientsData.filter(c => c.status === 'new').length;
const overdueTasksCount = initialTasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== 'done').length;

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

type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate';

const TaskPriorityMatrix = () => {
    const getQuadrant = (task: Task): Quadrant => {
        const isUrgent = task.dueDate ? isBefore(task.dueDate, addDays(new Date(), 7)) : false;
        if (task.priority === 'high') {
            return isUrgent ? 'do' : 'schedule';
        }
        if (task.priority === 'medium') {
            return isUrgent ? 'delegate' : 'schedule';
        }
        return 'eliminate';
    };

    const [tasks, setTasks] = React.useState<Record<Quadrant, Task[]>>(() => {
        const initialQuadrants: Record<Quadrant, Task[]> = { do: [], schedule: [], delegate: [], eliminate: [] };
        initialTasks.forEach(task => {
            if (task.status !== 'done') {
                const quadrant = getQuadrant(task);
                initialQuadrants[quadrant].push(task);
            }
        });
        return initialQuadrants;
    });
    
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    const findTask = (id: string) => {
        for (const quadrant of Object.keys(tasks) as Quadrant[]) {
            const task = tasks[quadrant].find(t => t.id === id);
            if (task) return { task, quadrant };
        }
        return null;
    };
    
    const findQuadrantForTask = (taskId: string | null): Quadrant | null => {
        if (!taskId) return null;
        for (const quadrant of Object.keys(tasks) as Quadrant[]) {
            if (tasks[quadrant].some(t => t.id === taskId)) {
                return quadrant;
            }
        }
        return null;
    }


    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
    
        if (over && active.id !== over.id) {
            const activeTaskInfo = findTask(active.id as string);
            if (!activeTaskInfo) return;
    
            const { task: activeTask, quadrant: sourceQuadrant } = activeTaskInfo;
            
            const overIsQuadrant = ['do', 'schedule', 'delegate', 'eliminate'].includes(over.id as string);
            let targetQuadrant: Quadrant | null;

            if (overIsQuadrant) {
                targetQuadrant = over.id as Quadrant;
            } else {
                targetQuadrant = findQuadrantForTask(over.id as string);
            }
            
            if (!targetQuadrant) return;
    
            if (sourceQuadrant !== targetQuadrant) {
                setTasks(prev => {
                    const newTasks = { ...prev };
                    newTasks[sourceQuadrant] = newTasks[sourceQuadrant].filter(t => t.id !== active.id);
                    // Ensure the target quadrant array exists before spreading
                    const targetTasks = newTasks[targetQuadrant] || [];
                    newTasks[targetQuadrant] = [activeTask, ...targetTasks];
                    return newTasks;
                });
            }
        }
    };
    
    const activeTask = activeId ? findTask(activeId)?.task : null;

    const quadrants: { id: Quadrant; title: string; color: string; description: string }[] = [
        { id: 'do', title: 'Do First', color: 'border-red-400/50 bg-red-900/10', description: 'Urgent & Important' },
        { id: 'schedule', title: 'Schedule', color: 'border-blue-400/50 bg-blue-900/10', description: 'Important, Not Urgent' },
        { id: 'delegate', title: 'Delegate', color: 'border-orange-400/50 bg-orange-900/10', description: 'Urgent, Not Important' },
        { id: 'eliminate', title: 'Eliminate', color: 'border-white/20 bg-white/5', description: 'Not Urgent, Not Important' },
    ];
    
    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="grid md:grid-cols-2 gap-4">
                {quadrants.map(quad => (
                    <QuadrantColumn key={quad.id} id={quad.id} title={quad.title} description={quad.description} tasks={tasks[quad.id]} colorClass={quad.color} />
                ))}
            </div>
             <DragOverlay>
                {activeTask ? <TaskItem task={activeTask} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    );
};

const QuadrantColumn = ({ id, title, description, tasks, colorClass }: { id: Quadrant; title: string; description: string; tasks: Task[]; colorClass: string }) => {
    const { setNodeRef } = useSortable({ id: id, data: {type: 'quadrant'} });
    return (
        <div ref={setNodeRef} className={cn("rounded-2xl border p-4 space-y-3 h-[250px] flex flex-col", colorClass)}>
            <div>
                <h4 className="font-bold text-white/90">{title}</h4>
                <p className="text-xs text-white/50">{description}</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => <TaskItem key={task.id} task={task} />)}
                </SortableContext>
            </div>
        </div>
    );
};

const TaskItem = ({ task, isDragging }: { task: Task; isDragging?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    
    const priorityColors = {
        high: 'bg-red-500',
        medium: 'bg-orange-500',
        low: 'bg-blue-500'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className={cn("bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-lg text-sm text-white/80 flex items-center gap-2", isDragging && "opacity-50")}>
            <div {...listeners} className="cursor-grab text-white/40 hover:text-white"><GripVertical className="h-4 w-4" /></div>
            <span className={cn("h-2 w-2 rounded-full flex-shrink-0", priorityColors[task.priority])}></span>
            <span className="truncate flex-1">{task.title}</span>
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
            <CardTitle className="text-white/90">Task Priority Matrix</CardTitle>
             <CardContent className="p-0 pt-4">
                <TaskPriorityMatrix />
            </CardContent>
          </CardHeader>
        </Card>
       </div>
    </main>
  );
}
